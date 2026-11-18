/* Notizen */
App.register('notes', {
  title: 'Notizen',
  sel: null,
  q: '',

  load() { return Store.get('notes', []); },
  save(notes) { Store.set('notes', notes); },

  sorted(notes) {
    return [...notes].sort((a, b) => (b.pinned - a.pinned) || (b.updated - a.updated));
  },

  render(el) {
    this.el = el;
    const notes = this.load();
    if (!this.sel || !notes.find(n => n.id === this.sel)) this.sel = this.sorted(notes)[0]?.id || null;

    el.innerHTML = `
      <div class="page-head">
        <h1>Notizen</h1>
        <button class="btn primary" data-act="new">${icon('plus')} Neue Notiz</button>
      </div>
      <div class="notes-layout">
        <aside class="notes-list card">
          <div class="search"><input class="input" type="search" placeholder="Notizen durchsuchen…" id="note-q" value="${esc(this.q)}"></div>
          <div class="notes-items" id="note-items"></div>
        </aside>
        <section class="note-editor card" id="note-editor"></section>
      </div>`;

    el.querySelector('[data-act=new]').onclick = () => this.create();
    el.querySelector('#note-q').addEventListener('input', e => { this.q = e.target.value; this.renderList(); });
    this.renderList();
    this.renderEditor();
  },

  create() {
    const notes = this.load();
    const n = { id: uid(), title: '', body: '', pinned: false, created: Date.now(), updated: Date.now() };
    notes.push(n);
    this.save(notes);
    this.sel = n.id;
    this.q = '';
    this.el.querySelector('#note-q').value = '';
    this.renderList();
    this.renderEditor();
    this.el.querySelector('.note-title')?.focus();
  },

  renderList() {
    const q = this.q.toLowerCase();
    const notes = this.sorted(this.load()).filter(n => !q || (n.title + ' ' + n.body).toLowerCase().includes(q));
    const box = this.el.querySelector('#note-items');
    if (!notes.length) {
      box.innerHTML = UI.empty(q ? 'Keine Treffer.' : 'Noch keine Notizen.');
      return;
    }
    box.innerHTML = notes.map(n => `
      <button class="note-item ${n.id === this.sel ? 'active' : ''}" data-id="${n.id}">
        <div class="t">${n.pinned ? icon('pin') : ''}<span>${esc(n.title || 'Ohne Titel')}</span></div>
        <div class="p">${esc(new Date(n.updated).toLocaleDateString('de-DE'))} · ${esc(n.body.slice(0, 80) || 'Leer')}</div>
      </button>`).join('');
    box.querySelectorAll('.note-item').forEach(b => b.onclick = () => {
      this.sel = b.dataset.id;
      this.renderList();
      this.renderEditor();
    });
  },

  renderEditor() {
    const ed = this.el.querySelector('#note-editor');
    const n = this.load().find(x => x.id === this.sel);
    if (!n) {
      ed.innerHTML = UI.empty('Wähle eine Notiz aus oder erstelle eine neue.',
        `<button class="btn primary" data-act="new2">${icon('plus')} Neue Notiz</button>`);
      ed.querySelector('[data-act=new2]').onclick = () => this.create();
      return;
    }
    ed.innerHTML = `
      <div class="note-toolbar">
        <span class="muted small" id="note-status">Gespeichert</span>
        <span class="spacer"></span>
        <button class="icon-btn ${n.pinned ? 'on' : ''}" data-act="pin" title="Anheften">${icon('pin')}</button>
        <button class="icon-btn" data-act="del" title="Löschen">${icon('trash')}</button>
      </div>
      <input class="note-title" placeholder="Titel" value="${esc(n.title)}">
      <textarea class="note-body" placeholder="Schreib los…">${esc(n.body)}</textarea>`;

    const status = ed.querySelector('#note-status');
    const persist = debounce(() => {
      const notes = this.load();
      const cur = notes.find(x => x.id === n.id);
      if (!cur) return;
      cur.title = ed.querySelector('.note-title').value;
      cur.body = ed.querySelector('.note-body').value;
      cur.updated = Date.now();
      this.save(notes);
      status.textContent = 'Gespeichert';
      this.renderList();
    }, 400);
    const onInput = () => { status.textContent = 'Speichert…'; persist(); };
    ed.querySelector('.note-title').addEventListener('input', onInput);
    ed.querySelector('.note-body').addEventListener('input', onInput);

    ed.querySelector('[data-act=pin]').onclick = () => {
      const notes = this.load();
      const cur = notes.find(x => x.id === n.id);
      cur.pinned = !cur.pinned;
      this.save(notes);
      this.renderList();
      this.renderEditor();
    };
    ed.querySelector('[data-act=del]').onclick = async () => {
      if (!await UI.confirm(`Notiz „${n.title || 'Ohne Titel'}“ löschen?`)) return;
      this.save(this.load().filter(x => x.id !== n.id));
      this.sel = null;
      this.render(this.el);
      UI.toast('Notiz gelöscht');
    };
  }
});
