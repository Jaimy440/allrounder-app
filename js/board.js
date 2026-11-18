/* Kanban-Board */
const Boards = {
  load() {
    let b = Store.get('boards', null);
    if (!b || !b.list || !b.list.length) {
      const first = this.make('Mein Board');
      b = { active: first.id, list: [first] };
      Store.set('boards', b);
    }
    if (!b.list.find(x => x.id === b.active)) b.active = b.list[0].id;
    return b;
  },
  make(name) {
    return {
      id: uid(), name,
      columns: ['Zu erledigen', 'In Arbeit', 'Erledigt'].map(t => ({ id: uid(), title: t, cards: [] }))
    };
  },
  save(b) { Store.set('boards', b); }
};

App.register('board', {
  title: 'Board',

  render(el) {
    this.el = el;
    const data = Boards.load();
    const board = data.list.find(x => x.id === data.active);

    el.innerHTML = `
      <div class="page-head">
        <h1>Board</h1>
        <div class="board-bar">
          <select class="input" id="board-sel" aria-label="Board wählen">
            ${data.list.map(b => `<option value="${b.id}" ${b.id === data.active ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}
          </select>
          <button class="icon-btn" data-act="rename" title="Board umbenennen">${icon('edit')}</button>
          <button class="icon-btn" data-act="delboard" title="Board löschen">${icon('trash')}</button>
          <button class="btn" data-act="newboard">${icon('plus')} Board</button>
        </div>
      </div>
      <div class="board-scroll" id="board-cols"></div>`;

    el.querySelector('#board-sel').onchange = e => { data.active = e.target.value; Boards.save(data); this.render(el); };
    el.querySelector('[data-act=newboard]').onclick = async () => {
      const name = await UI.prompt('Neues Board', 'Name');
      if (!name) return;
      const b = Boards.make(name);
      data.list.push(b); data.active = b.id; Boards.save(data); this.render(el);
    };
    el.querySelector('[data-act=rename]').onclick = async () => {
      const name = await UI.prompt('Board umbenennen', 'Name', board.name);
      if (!name) return;
      board.name = name; Boards.save(data); this.render(el);
    };
    el.querySelector('[data-act=delboard]').onclick = async () => {
      if (!await UI.confirm(`Board „${board.name}“ mit allen Karten löschen?`)) return;
      data.list = data.list.filter(b => b.id !== board.id);
      Boards.save(data);
      this.render(el);
    };
    this.drawColumns();
  },

  withBoard(fn) {
    const data = Boards.load();
    const board = data.list.find(x => x.id === data.active);
    const res = fn(board, data);
    Boards.save(data);
    return res;
  },

  drawColumns() {
    const data = Boards.load();
    const board = data.list.find(x => x.id === data.active);
    const wrap = this.el.querySelector('#board-cols');
    const today = D.today();
    const last = board.columns.length - 1;

    wrap.innerHTML = board.columns.map((c, ci) => `
      <section class="column" data-col="${c.id}">
        <div class="column-head">
          <h3 data-act="rencol" title="Umbenennen">${esc(c.title)}</h3>
          <span class="count">${c.cards.length}</span>
          <button class="icon-btn" data-act="delcol" title="Spalte löschen">${icon('trash')}</button>
        </div>
        <div class="cards" data-col="${c.id}">
          ${c.cards.map(k => {
            let due = '';
            if (k.due) {
              const cls = ci === last ? '' : k.due < today ? 'danger' : k.due === today ? 'warn' : '';
              due = `<span class="tag ${cls}">${icon('clock')} ${esc(D.relative(k.due))}</span>`;
            }
            return `<article class="kcard" draggable="true" data-id="${k.id}">
              ${k.label ? `<span class="label" style="background:var(--c-${k.label})"></span>` : ''}
              <div class="ttl">${esc(k.title)}</div>
              ${due || k.desc ? `<div class="meta">${due}${k.desc ? `<span class="muted small" title="Hat Beschreibung">${icon('notes')}</span>` : ''}</div>` : ''}
            </article>`;
          }).join('')}
        </div>
        <div class="add-card"><button class="btn ghost sm block" data-act="addcard">${icon('plus')} Karte hinzufügen</button></div>
      </section>`).join('') + `
      <div class="add-column"><button class="btn block" data-act="addcol">${icon('plus')} Spalte hinzufügen</button></div>`;

    wrap.querySelector('[data-act=addcol]').onclick = async () => {
      const t = await UI.prompt('Neue Spalte', 'Titel');
      if (!t) return;
      this.withBoard(b => b.columns.push({ id: uid(), title: t, cards: [] }));
      this.drawColumns();
    };
    wrap.querySelectorAll('.column').forEach(col => {
      const cid = col.dataset.col;
      col.querySelector('[data-act=rencol]').onclick = async () => {
        const c = board.columns.find(x => x.id === cid);
        const t = await UI.prompt('Spalte umbenennen', 'Titel', c.title);
        if (!t) return;
        this.withBoard(b => { b.columns.find(x => x.id === cid).title = t; });
        this.drawColumns();
      };
      col.querySelector('[data-act=delcol]').onclick = async () => {
        const c = board.columns.find(x => x.id === cid);
        if (!await UI.confirm(`Spalte „${c.title}“ mit ${c.cards.length} Karte(n) löschen?`)) return;
        this.withBoard(b => { b.columns = b.columns.filter(x => x.id !== cid); });
        this.drawColumns();
      };
      col.querySelector('[data-act=addcard]').onclick = () => this.editCard(null, cid);
    });
    wrap.querySelectorAll('.kcard').forEach(k => {
      k.onclick = () => {
        const col = board.columns.find(c => c.cards.some(x => x.id === k.dataset.id));
        this.editCard(col.cards.find(x => x.id === k.dataset.id), col.id);
      };
    });
    this.bindDnD(wrap);
  },

  bindDnD(wrap) {
    let dragId = null;
    const marker = document.createElement('div');
    marker.className = 'drop-marker';

    wrap.querySelectorAll('.kcard').forEach(k => {
      k.addEventListener('dragstart', e => {
        dragId = k.dataset.id;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', dragId);
        requestAnimationFrame(() => k.classList.add('dragging'));
      });
      k.addEventListener('dragend', () => {
        k.classList.remove('dragging');
        marker.remove();
        wrap.querySelectorAll('.cards.over').forEach(x => x.classList.remove('over'));
      });
    });

    const indexAt = (list, y) => {
      const cards = [...list.querySelectorAll('.kcard:not(.dragging)')];
      const i = cards.findIndex(c => { const r = c.getBoundingClientRect(); return y < r.top + r.height / 2; });
      return { i: i === -1 ? cards.length : i, cards };
    };

    wrap.querySelectorAll('.cards').forEach(list => {
      list.addEventListener('dragover', e => {
        if (!dragId) return;
        e.preventDefault();
        list.classList.add('over');
        const { i, cards } = indexAt(list, e.clientY);
        if (i < cards.length) list.insertBefore(marker, cards[i]); else list.appendChild(marker);
      });
      list.addEventListener('dragleave', e => {
        if (!list.contains(e.relatedTarget)) { list.classList.remove('over'); marker.remove(); }
      });
      list.addEventListener('drop', e => {
        e.preventDefault();
        if (!dragId) return;
        const { i } = indexAt(list, e.clientY);
        const target = list.dataset.col;
        const id = dragId;
        dragId = null;
        this.withBoard(b => {
          let card;
          b.columns.forEach(c => {
            const idx = c.cards.findIndex(x => x.id === id);
            if (idx > -1) card = c.cards.splice(idx, 1)[0];
          });
          if (card) b.columns.find(c => c.id === target).cards.splice(i, 0, card);
        });
        this.drawColumns();
      });
    });
  },

  async editCard(card, colId) {
    const data = Boards.load();
    const board = data.list.find(x => x.id === data.active);
    const r = await UI.form({
      title: card ? 'Karte bearbeiten' : 'Neue Karte',
      fields: [
        { name: 'title', label: 'Titel', required: true },
        { name: 'desc', label: 'Beschreibung', type: 'textarea', rows: 4 },
        { name: 'col', label: 'Spalte', type: 'select', half: true, options: board.columns.map(c => [c.id, c.title]) },
        { name: 'due', label: 'Fällig am', type: 'date', half: true },
        { name: 'label', label: 'Label', type: 'color', allowNone: true }
      ],
      values: card ? { ...card, col: colId } : { col: colId, label: '' },
      danger: card ? 'Löschen' : null
    });
    if (!r) return;
    this.withBoard(b => {
      const src = b.columns.find(c => c.id === colId);
      if (r === 'delete') { src.cards = src.cards.filter(x => x.id !== card.id); return; }
      const { col, ...fields } = r;
      if (card) {
        const idx = src.cards.findIndex(x => x.id === card.id);
        const cur = Object.assign(src.cards[idx], fields);
        if (col !== colId) {
          src.cards.splice(idx, 1);
          b.columns.find(c => c.id === col).cards.push(cur);
        }
      } else {
        b.columns.find(c => c.id === col).cards.push({ id: uid(), created: Date.now(), ...fields });
      }
    });
    this.drawColumns();
  }
});
