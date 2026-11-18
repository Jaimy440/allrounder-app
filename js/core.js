/* Kern: Speicher, Hilfsfunktionen, Dialoge, Router */
'use strict';

const PREFIX = 'allrounder_';

const Store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw != null) return JSON.parse(raw);
    } catch (e) { /* ignorieren */ }
    return fallback === undefined ? null : JSON.parse(JSON.stringify(fallback));
  },
  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); }
    catch (e) { UI.toast('Speichern fehlgeschlagen – Speicher voll oder gesperrt.'); }
  },
  keys() {
    const out = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith(PREFIX)) out.push(k.slice(PREFIX.length));
      }
    } catch (e) { /* ignorieren */ }
    return out;
  },
  exportAll() {
    const data = {};
    this.keys().forEach(k => { data[k] = this.get(k); });
    return { app: 'allrounder', version: 1, exported: new Date().toISOString(), data };
  },
  importAll(obj) {
    if (!obj || obj.app !== 'allrounder' || typeof obj.data !== 'object') throw new Error('Ungültige Sicherungsdatei');
    this.clear();
    Object.entries(obj.data).forEach(([k, v]) => this.set(k, v));
  },
  clear() {
    this.keys().forEach(k => { try { localStorage.removeItem(PREFIX + k); } catch (e) { /* */ } });
  }
};

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const debounce = (fn, ms = 300) => {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
};

/* ---------- Datum ---------- */
const D = {
  ymd(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  },
  parse(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  },
  today() { return this.ymd(); },
  addDays(s, n) {
    const d = this.parse(s);
    d.setDate(d.getDate() + n);
    return this.ymd(d);
  },
  diffDays(a, b) { return Math.round((this.parse(b) - this.parse(a)) / 86400000); },
  weekday(s) { return (this.parse(s).getDay() + 6) % 7; }, // 0 = Montag
  fmt(s, opts = { weekday: 'short', day: '2-digit', month: '2-digit' }) {
    return this.parse(s).toLocaleDateString('de-DE', opts);
  },
  long(s) { return this.fmt(s, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); },
  relative(s) {
    const n = this.diffDays(this.today(), s);
    if (n === 0) return 'Heute';
    if (n === 1) return 'Morgen';
    if (n === -1) return 'Gestern';
    if (n > 1 && n < 7) return `in ${n} Tagen`;
    if (n < -1 && n > -7) return `vor ${-n} Tagen`;
    return this.fmt(s);
  },
  DAYS: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
  DAYS_SHORT: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
};

const COLORS = ['blue', 'green', 'yellow', 'orange', 'red', 'purple', 'gray'];
const COLOR_NAMES = { blue: 'Blau', green: 'Grün', yellow: 'Gelb', orange: 'Orange', red: 'Rot', purple: 'Lila', gray: 'Grau' };

/* ---------- Icons ---------- */
const ICONS = {
  home: 'M3 11l9-8 9 8M5 9.5V20h5v-6h4v6h5V9.5',
  notes: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h5',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5',
  training: 'M6.5 7v10M17.5 7v10M3.5 9.5v5M20.5 9.5v5M6.5 12h11',
  board: 'M4 4h4.5v15H4zM10 4h4.5v10H10zM16 4h4v12.5h-4z',
  learn: 'M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6',
  circuit: 'M3 12h5M16 12h5M8 12l7-5M12 18v-3M9 18h6',
  settings: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  plus: 'M12 5v14M5 12h14',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',
  pin: 'M9 4h6l-1 6 3 3H7l3-3zM12 13v7',
  check: 'M5 12l5 5 9-10',
  chevL: 'M15 5l-7 7 7 7',
  chevR: 'M9 5l7 7-7 7',
  play: 'M7 5v14l11-7z',
  stop: 'M6 6h12v12H6z',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  upload: 'M12 20V9M7 14l5-5 5 5M5 4h14',
  menu: 'M4 7h16M4 12h16M4 17h16',
  flip: 'M4 8h13l-3-3M20 16H7l3 3',
  clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z'
};
const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;

/* ---------- UI: Dialoge & Toasts ---------- */
const UI = {
  fieldHTML(f, value) {
    const id = 'f_' + f.name;
    const v = value ?? f.value ?? '';
    const req = f.required ? 'required' : '';
    let input;
    switch (f.type) {
      case 'textarea':
        input = `<textarea id="${id}" name="${f.name}" rows="${f.rows || 4}" class="input" placeholder="${esc(f.placeholder || '')}" ${req}>${esc(v)}</textarea>`;
        break;
      case 'select':
        input = `<select id="${id}" name="${f.name}" class="input">${f.options.map(o => {
          const [val, lab] = Array.isArray(o) ? o : [o, o];
          return `<option value="${esc(val)}" ${String(val) === String(v) ? 'selected' : ''}>${esc(lab)}</option>`;
        }).join('')}</select>`;
        break;
      case 'color':
        input = `<div class="swatches">${COLORS.map(c => `
          <label class="swatch" title="${COLOR_NAMES[c]}">
            <input type="radio" name="${f.name}" value="${c}" ${c === (v || 'blue') ? 'checked' : ''}>
            <span style="background:var(--c-${c})"></span>
          </label>`).join('')}
          ${f.allowNone ? `<label class="swatch" title="Keine"><input type="radio" name="${f.name}" value="" ${!v ? 'checked' : ''}><span class="none"></span></label>` : ''}
        </div>`;
        break;
      case 'checkbox':
        input = `<label class="check"><input type="checkbox" name="${f.name}" ${v ? 'checked' : ''}> ${esc(f.text || '')}</label>`;
        break;
      default:
        input = `<input id="${id}" name="${f.name}" type="${f.type || 'text'}" class="input" value="${esc(v)}"
          placeholder="${esc(f.placeholder || '')}" ${f.step ? `step="${f.step}"` : ''} ${f.min != null ? `min="${f.min}"` : ''} ${f.list ? `list="${f.list}"` : ''} ${req}>`;
    }
    return `<div class="field ${f.half ? 'half' : ''}"><label for="${id}">${esc(f.label)}</label>${input}</div>`;
  },

  form({ title, fields, values = {}, submit = 'Speichern', danger, extra = '' }) {
    return new Promise(resolve => {
      const dlg = document.createElement('dialog');
      dlg.className = 'modal';
      dlg.innerHTML = `
        <form>
          <h2>${esc(title)}</h2>
          <div class="form-fields">${fields.map(f => this.fieldHTML(f, values[f.name])).join('')}</div>
          ${extra}
          <div class="modal-actions">
            ${danger ? `<button type="button" class="btn danger ghost" data-act="delete">${icon('trash')} ${esc(danger)}</button>` : ''}
            <span class="spacer"></span>
            <button type="button" class="btn" data-act="cancel">Abbrechen</button>
            <button type="submit" class="btn primary">${esc(submit)}</button>
          </div>
        </form>`;
      document.body.appendChild(dlg);
      const done = v => { dlg.close(); dlg.remove(); resolve(v); };
      dlg.querySelector('[data-act=cancel]').onclick = () => done(null);
      const del = dlg.querySelector('[data-act=delete]');
      if (del) del.onclick = () => done('delete');
      dlg.addEventListener('cancel', e => { e.preventDefault(); done(null); });
      dlg.querySelector('form').addEventListener('submit', e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const out = {};
        fields.forEach(f => {
          let v = fd.get(f.name);
          if (f.type === 'checkbox') v = fd.has(f.name);
          else if (f.type === 'number') v = v === '' || v == null ? '' : Number(v);
          else v = v == null ? '' : (f.type === 'textarea' ? v : String(v).trim());
          out[f.name] = v;
        });
        done(out);
      });
      dlg.showModal();
      const first = dlg.querySelector('.form-fields input:not([type=radio]):not([type=checkbox]), .form-fields textarea');
      if (first) first.focus();
    });
  },

  confirm(message, ok = 'Löschen') {
    return new Promise(resolve => {
      const dlg = document.createElement('dialog');
      dlg.className = 'modal small';
      dlg.innerHTML = `<form><p>${esc(message)}</p>
        <div class="modal-actions"><span class="spacer"></span>
        <button type="button" class="btn" data-act="cancel">Abbrechen</button>
        <button type="submit" class="btn danger">${esc(ok)}</button></div></form>`;
      document.body.appendChild(dlg);
      const done = v => { dlg.close(); dlg.remove(); resolve(v); };
      dlg.querySelector('[data-act=cancel]').onclick = () => done(false);
      dlg.addEventListener('cancel', e => { e.preventDefault(); done(false); });
      dlg.querySelector('form').addEventListener('submit', e => { e.preventDefault(); done(true); });
      dlg.showModal();
    });
  },

  async prompt(title, label, value = '') {
    const r = await this.form({ title, fields: [{ name: 'v', label, required: true }], values: { v: value } });
    return r && r !== 'delete' ? r.v : null;
  },

  toast(msg) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    document.getElementById('toasts').appendChild(el);
    setTimeout(() => el.classList.add('out'), 2200);
    setTimeout(() => el.remove(), 2600);
  },

  empty(text, action = '') {
    return `<div class="empty"><p>${esc(text)}</p>${action}</div>`;
  }
};

/* ---------- Theme ---------- */
const Theme = {
  apply() {
    const t = Store.get('theme', 'system');
    if (t === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  },
  set(t) { Store.set('theme', t); this.apply(); }
};

/* ---------- App / Router ---------- */
const NAV = [
  ['home', 'Start', 'home'],
  ['notes', 'Notizen', 'notes'],
  ['calendar', 'Kalender', 'calendar'],
  ['training', 'Training', 'training'],
  ['board', 'Board', 'board'],
  ['learn', 'Berufsschule', 'learn'],
  ['circuit', 'Steuerkreis', 'circuit'],
  ['settings', 'Einstellungen', 'settings']
];

const App = {
  modules: {},
  current: null,
  register(id, mod) { this.modules[id] = mod; },

  init() {
    Theme.apply();
    document.getElementById('nav-links').innerHTML = NAV.map(([id, label, ic]) =>
      `<a href="#/${id}" data-id="${id}">${icon(ic)}<span>${label}</span></a>`).join('');
    window.addEventListener('hashchange', () => this.route());
    this.route();
  },

  route() {
    let id = location.hash.replace(/^#\/?/, '').split('/')[0] || 'home';
    if (!this.modules[id]) id = 'home';
    const prev = this.modules[this.current];
    if (prev && prev.destroy) prev.destroy();
    this.current = id;
    document.querySelectorAll('#nav-links a').forEach(a => a.classList.toggle('active', a.dataset.id === id));
    const view = document.getElementById('view');
    view.innerHTML = '';
    view.className = 'view view-' + id;
    const mod = this.modules[id];
    document.title = (mod.title ? mod.title + ' · ' : '') + 'Allrounder';
    mod.render(view);
    view.scrollTop = 0;
    window.scrollTo(0, 0);
  },

  refresh() { this.route(); }
};
