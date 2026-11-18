/* Kalender */
const Calendar = {
  events() { return Store.get('events', []); },
  saveEvents(ev) { Store.set('events', ev); },

  /* Alle Einträge eines Tages – inkl. Prüfungen und fälliger Board-Karten */
  itemsFor(date) {
    const items = this.events().filter(e => e.date === date).map(e => ({
      kind: 'event', id: e.id, title: e.title, time: e.time, end: e.end, color: e.color || 'blue', note: e.note
    }));
    const learn = Store.get('learn', { subjects: [], exams: [] });
    (learn.exams || []).filter(x => x.date === date).forEach(x => {
      const s = learn.subjects.find(s => s.id === x.sid);
      items.push({ kind: 'exam', id: x.id, title: `Prüfung: ${x.title}${s ? ' (' + s.name + ')' : ''}`, color: 'red', note: x.note });
    });
    const boards = Store.get('boards', null);
    if (boards) boards.list.forEach(b => b.columns.forEach((c, ci) => c.cards.forEach(card => {
      if (card.due === date && ci < b.columns.length - 1)
        items.push({ kind: 'card', id: card.id, title: `Fällig: ${card.title}`, color: card.label || 'purple' });
    })));
    return items.sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  },

  async edit(ev, date) {
    const r = await UI.form({
      title: ev ? 'Termin bearbeiten' : 'Neuer Termin',
      fields: [
        { name: 'title', label: 'Titel', required: true, placeholder: 'z. B. Zahnarzt' },
        { name: 'date', label: 'Datum', type: 'date', required: true, half: true },
        { name: 'time', label: 'Beginn', type: 'time', half: true },
        { name: 'end', label: 'Ende', type: 'time', half: true },
        { name: 'repeat', label: 'Wiederholen', type: 'select', half: true,
          options: [['', 'Nie'], ['weekly', 'Wöchentlich (8×)'], ['monthly', 'Monatlich (6×)']] },
        { name: 'color', label: 'Farbe', type: 'color' },
        { name: 'note', label: 'Notiz', type: 'textarea', rows: 3 }
      ],
      values: ev || { date, color: 'blue' },
      danger: ev ? 'Löschen' : null
    });
    if (!r) return false;
    let list = this.events();
    if (r === 'delete') {
      list = list.filter(e => e.id !== ev.id);
    } else if (ev) {
      Object.assign(list.find(e => e.id === ev.id), r);
      delete list.find(e => e.id === ev.id).repeat;
    } else {
      const base = { ...r };
      delete base.repeat;
      list.push({ id: uid(), ...base });
      const n = r.repeat === 'weekly' ? 7 : r.repeat === 'monthly' ? 5 : 0;
      for (let i = 1; i <= n; i++) {
        let d;
        if (r.repeat === 'weekly') d = D.addDays(r.date, 7 * i);
        else { const x = D.parse(r.date); x.setMonth(x.getMonth() + i); d = D.ymd(x); }
        list.push({ id: uid(), ...base, date: d });
      }
    }
    this.saveEvents(list);
    return true;
  }
};

App.register('calendar', {
  title: 'Kalender',
  month: null,
  sel: null,

  render(el) {
    this.el = el;
    if (!this.month) { const t = new Date(); this.month = [t.getFullYear(), t.getMonth()]; }
    if (!this.sel) this.sel = D.today();
    el.innerHTML = `
      <div class="page-head">
        <h1>Kalender</h1>
        <button class="btn primary" data-act="new">${icon('plus')} Termin</button>
      </div>
      <div class="cal-layout">
        <div class="card" style="overflow:hidden">
          <div class="cal-head">
            <h2 id="cal-title"></h2>
            <span class="spacer"></span>
            <button class="icon-btn" data-act="prev" title="Voriger Monat">${icon('chevL')}</button>
            <button class="btn sm" data-act="today">Heute</button>
            <button class="icon-btn" data-act="next" title="Nächster Monat">${icon('chevR')}</button>
          </div>
          <div class="cal-grid" id="cal-grid"></div>
        </div>
        <div class="card card-pad" id="cal-day"></div>
      </div>`;
    el.querySelector('[data-act=new]').onclick = async () => { if (await Calendar.edit(null, this.sel)) this.draw(); };
    el.querySelector('[data-act=prev]').onclick = () => this.shift(-1);
    el.querySelector('[data-act=next]').onclick = () => this.shift(1);
    el.querySelector('[data-act=today]').onclick = () => {
      const t = new Date(); this.month = [t.getFullYear(), t.getMonth()]; this.sel = D.today(); this.draw();
    };
    this.draw();
  },

  shift(n) {
    const d = new Date(this.month[0], this.month[1] + n, 1);
    this.month = [d.getFullYear(), d.getMonth()];
    this.draw();
  },

  draw() {
    const [y, m] = this.month;
    const first = new Date(y, m, 1);
    this.el.querySelector('#cal-title').textContent = first.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    const start = D.addDays(D.ymd(first), -((first.getDay() + 6) % 7));
    const today = D.today();
    let html = D.DAYS_SHORT.map(d => `<div class="cal-dow">${d}</div>`).join('');
    for (let i = 0; i < 42; i++) {
      const ds = D.addDays(start, i);
      const dt = D.parse(ds);
      const items = Calendar.itemsFor(ds);
      const cls = ['cal-day', dt.getMonth() !== m ? 'other' : '', ds === today ? 'today' : '', ds === this.sel ? 'sel' : ''].join(' ');
      html += `<div class="${cls}" data-date="${ds}">
        <span class="num">${dt.getDate()}</span>
        ${items.slice(0, 3).map(it => `<div class="cal-chip" style="--chip:var(--c-${it.color})" title="${esc(it.title)}">${it.time ? esc(it.time) + ' ' : ''}${esc(it.title)}</div>`).join('')}
        ${items.length > 3 ? `<div class="cal-more">+${items.length - 3} weitere</div>` : ''}
      </div>`;
    }
    const grid = this.el.querySelector('#cal-grid');
    grid.innerHTML = html;
    grid.querySelectorAll('.cal-day').forEach(c => {
      c.onclick = () => { this.sel = c.dataset.date; this.draw(); };
      c.ondblclick = async () => { if (await Calendar.edit(null, c.dataset.date)) this.draw(); };
    });
    this.drawDay();
  },

  drawDay() {
    const box = this.el.querySelector('#cal-day');
    const items = Calendar.itemsFor(this.sel);
    box.innerHTML = `
      <div class="card-head">
        <div><h2>${esc(D.relative(this.sel))}</h2><div class="muted small">${esc(D.long(this.sel))}</div></div>
        <button class="btn sm" data-act="add">${icon('plus')} Termin</button>
      </div>
      ${items.length ? items.map(it => `
        <div class="agenda-item" data-kind="${it.kind}" data-id="${it.id}" style="--chip:var(--c-${it.color})">
          <span class="bar"></span>
          <div style="min-width:0">
            <div style="font-weight:600">${esc(it.title)}</div>
            ${it.time ? `<div class="time">${esc(it.time)}${it.end ? ' – ' + esc(it.end) : ''} Uhr</div>` : ''}
            ${it.note ? `<div class="muted small qa">${esc(it.note)}</div>` : ''}
          </div>
        </div>`).join('') : UI.empty('Keine Einträge an diesem Tag.')}
    `;
    box.querySelector('[data-act=add]').onclick = async () => { if (await Calendar.edit(null, this.sel)) this.draw(); };
    box.querySelectorAll('.agenda-item').forEach(a => a.onclick = async () => {
      if (a.dataset.kind === 'exam') { location.hash = '#/learn'; return; }
      if (a.dataset.kind === 'card') { location.hash = '#/board'; return; }
      const ev = Calendar.events().find(e => e.id === a.dataset.id);
      if (ev && await Calendar.edit(ev)) this.draw();
    });
  }
});
