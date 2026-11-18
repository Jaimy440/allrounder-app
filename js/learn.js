/* Lernbereich Berufsschule: Lernfelder/Fächer, Themen-Checklisten, Karteikarten (Leitner), Lernzettel, Prüfungen */
const Learn = {
  INTERVALS: [0, 1, 2, 4, 7, 14], // Tage bis zur nächsten Abfrage je Fach (Box 1–5)
  EGS_VERSION: 2,
  YEARS: { 1: '1. Ausbildungsjahr', 2: '2. Ausbildungsjahr', 3: '3. Ausbildungsjahr', 4: '4. Ausbildungsjahr', 0: 'Allgemeinbildende Fächer' },

  load() {
    const d = Store.get('learn', { subjects: [], cards: [], exams: [] });
    d.subjects ||= []; d.cards ||= []; d.exams ||= [];
    return d;
  },
  save(d) { Store.set('learn', d); },
  due(cards) { const t = D.today(); return cards.filter(c => (c.next || t) <= t); },

  /* Kurzname ohne „LF n – “ */
  short(s) { return s.lf ? s.name.replace(/^LF\s*\d+\s*[–-]\s*/, '') : s.name; },

  sheet(def) {
    let t = `${def.name}\n${'='.repeat(Math.min(60, def.name.length))}\n\n`;
    if (def.year) t += `${this.YEARS[def.year]}${def.hours ? ` · ${def.hours} Unterrichtsstunden` : ''}\n\n`;
    t += `ZIEL\n${def.goal}\n\n`;
    t += `INHALTE\n${def.topics.map(x => '• ' + x).join('\n')}\n`;
    if (def.formulas && def.formulas.length) t += `\nFORMELN & MERKE\n${def.formulas.map(x => '  ' + x).join('\n')}\n`;
    t += `\nEIGENE MITSCHRIFTEN\n\n`;
    return t;
  },

  /* Lehrplan Elektroniker/-in für Geräte und Systeme anlegen bzw. ergänzen (idempotent) */
  installEGS() {
    const d = this.load();
    const legacy = { 'egs-wiso': 'Wirtschaft & Soziales', 'egs-deutsch': 'Deutsch' };
    let addedSubjects = 0, addedCards = 0;
    EGS.subjects.forEach(def => {
      let s = d.subjects.find(x => x.key === def.key)
        || (legacy[def.key] && d.subjects.find(x => !x.key && x.name === legacy[def.key]));
      if (!s) {
        s = { id: uid(), notes: '' };
        d.subjects.push(s);
        addedSubjects++;
      }
      Object.assign(s, {
        key: def.key, name: def.name, color: s.color || def.color,
        lf: def.lf || null, year: def.year, hours: def.hours, goal: def.goal
      });
      s.topics ||= [];
      def.topics.forEach(text => { if (!s.topics.some(t => t.text === text)) s.topics.push({ id: uid(), text, done: false }); });
      if (!s.notes || !s.notes.trim()) s.notes = this.sheet(def);
      const have = new Set(d.cards.filter(c => c.sid === s.id).map(c => c.q));
      def.cards.forEach(([q, a]) => {
        if (have.has(q)) return;
        d.cards.push({ id: uid(), sid: s.id, q, a, box: 1, next: D.today() });
        addedCards++;
      });
    });
    d.profession = EGS.name + (EGS.state ? ' · Lehrplan ' + EGS.state : '');
    d.egsInstalled = this.EGS_VERSION;
    this.save(d);
    return { addedSubjects, addedCards };
  },

  /* Sortierung: Lernfelder nach Nummer, dann allgemeinbildend, dann eigene */
  ordered(subjects) {
    const rank = s => s.lf ? s.lf : s.year === 0 ? 100 : 200;
    return [...subjects].sort((a, b) => rank(a) - rank(b));
  }
};

App.register('learn', {
  title: 'Berufsschule',
  subject: null,
  tab: 'topics',
  session: null,

  render(el) {
    this.el = el;
    const d = Learn.load();
    if (this.subject && !d.subjects.find(s => s.id === this.subject)) this.subject = null;
    if (this.subject) this.renderSubject(); else this.renderOverview();
  },

  /* ---------- Übersicht ---------- */
  renderOverview() {
    const el = this.el;
    let d = Learn.load();
    if ((d.egsInstalled || 0) < Learn.EGS_VERSION) { Learn.installEGS(); d = Learn.load(); }
    const today = D.today();
    const exams = d.exams.filter(x => x.date >= today).sort((a, b) => a.date.localeCompare(b.date));
    const past = d.exams.filter(x => x.date < today).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
    const allDue = Learn.due(d.cards).length;
    const lfs = d.subjects.filter(s => s.lf);
    const topicsAll = lfs.flatMap(s => s.topics || []);
    const topicsDone = topicsAll.filter(t => t.done).length;

    const groups = [1, 2, 3, 4, 0].map(y => ({ y, list: Learn.ordered(d.subjects.filter(s => s.year === y)) }))
      .filter(g => g.list.length);
    const other = d.subjects.filter(s => s.year == null);
    if (other.length) groups.push({ y: null, list: other });

    const card = s => {
      const cards = d.cards.filter(c => c.sid === s.id);
      const due = Learn.due(cards).length;
      const tp = s.topics || [];
      const tDone = tp.filter(t => t.done).length;
      return `<button class="card subject-card" data-id="${s.id}" style="--chip:var(--c-${s.color})">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          ${s.lf ? `<span class="tag" style="background:var(--c-${s.color});color:#fff">LF ${s.lf}</span>` : ''}
          ${s.hours ? `<span class="muted small">${s.hours} Std.</span>` : ''}
        </div>
        <h3>${esc(Learn.short(s))}</h3>
        <div class="counts">
          <span class="tag">${cards.length} Karten</span>
          ${cards.length ? (due ? `<span class="tag warn">${due} fällig</span>` : `<span class="tag ok">gelernt</span>`) : ''}
          ${tp.length ? `<span class="tag">${tDone}/${tp.length} Themen</span>` : ''}
        </div>
        ${tp.length ? `<div class="progress"><div style="width:${Math.round(tDone / tp.length * 100)}%"></div></div>` : ''}
      </button>`;
    };

    el.innerHTML = `
      <div class="page-head">
        <div style="margin-right:auto">
          <h1>Berufsschule</h1>
          <div class="page-sub">${d.profession ? esc(d.profession) + ' · ' : ''}${d.cards.length} Karteikarten · ${allDue} heute fällig</div>
        </div>
        ${allDue ? `<button class="btn primary" data-act="learnall">${icon('play')} Alle fälligen lernen</button>` : ''}
        <button class="btn" data-act="addsub">${icon('plus')} Fach</button>
      </div>

      ${lfs.length ? `<div class="card card-pad" style="margin-bottom:20px;display:flex;gap:16px;align-items:center;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="font-weight:650;margin-bottom:6px">Lehrplan-Fortschritt: ${topicsDone} von ${topicsAll.length} Themen abgehakt</div>
          <div class="progress"><div style="width:${topicsAll.length ? Math.round(topicsDone / topicsAll.length * 100) : 0}%"></div></div>
        </div>
        <button class="btn sm ghost" data-act="egs" title="Fehlende Lernfelder, Themen und Karten ergänzen – eigene Inhalte bleiben erhalten">Lehrplan ergänzen</button>
      </div>` : ''}

      ${groups.map(g => `
        <section style="margin-bottom:22px">
          <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:10px">
            <h2>${g.y === null ? 'Weitere Fächer' : Learn.YEARS[g.y]}</h2>
            ${g.y ? `<span class="muted small">${g.list.reduce((a, s) => a + (s.hours || 0), 0)} Std.</span>` : ''}
          </div>
          <div class="grid grid-3">${g.list.map(card).join('')}</div>
        </section>`).join('')}

      ${d.subjects.length ? '' : `<div class="card">${UI.empty('Noch keine Fächer angelegt.',
        `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">
          <button class="btn primary" data-act="egs">Lehrplan Elektroniker/-in für Geräte und Systeme (Hessen) anlegen</button>
          <button class="btn" data-act="addsub2">${icon('plus')} Eigenes Fach</button></div>`)}</div>`}

      <div class="grid grid-2" style="margin-top:8px">
        <div class="card card-pad">
          <div class="card-head"><h2>Prüfungen & Klassenarbeiten</h2>
            <button class="btn sm" data-act="addexam" ${d.subjects.length ? '' : 'disabled'}>${icon('plus')} Termin</button></div>
          ${exams.length ? `<div class="list">${exams.map(x => this.examRow(x, d)).join('')}</div>` : UI.empty('Keine anstehenden Prüfungen.')}
          ${past.length ? `<details style="margin-top:8px"><summary class="muted small">Vergangene</summary><div class="list">${past.map(x => this.examRow(x, d)).join('')}</div></details>` : ''}
        </div>
        <div class="card card-pad">
          <div class="card-head"><h2>So funktioniert's</h2></div>
          <p class="muted small" style="line-height:1.7">
            Jedes <b>Lernfeld</b> hat eine <b>Themen-Checkliste</b> (abhaken, was im Unterricht dran war bzw. was du kannst),
            einen <b>Lernzettel</b> mit Zielen und Formeln für eigene Mitschriften und <b>Karteikarten</b>.
            Die Karten werden nach dem Leitner-System abgefragt: Gewusste Karten kommen seltener dran (1 → 2 → 4 → 7 → 14 Tage),
            nicht gewusste sofort wieder. Prüfungstermine erscheinen automatisch im Kalender.
            <br><br>Grundlage ist die <b>Handreichung zum Rahmenlehrplan des Hessischen Kultusministeriums</b> (13 Lernfelder, 1020 Std.).
          </p>
        </div>
      </div>`;

    const on = (sel, fn) => el.querySelectorAll(sel).forEach(b => { b.onclick = fn; });
    on('[data-act=addsub]', () => this.editSubject(null));
    on('[data-act=addsub2]', () => this.editSubject(null));
    on('[data-act=egs]', () => {
      const r = Learn.installEGS();
      this.render(el);
      UI.toast(r.addedSubjects || r.addedCards ? `${r.addedSubjects} Fächer und ${r.addedCards} Karten ergänzt` : 'Lehrplan ist vollständig');
    });
    on('[data-act=addexam]', () => this.editExam(null));
    on('[data-act=learnall]', () => { this.subject = null; this.startSession(null, 'due'); });
    el.querySelectorAll('.subject-card').forEach(b => b.onclick = () => { this.subject = b.dataset.id; this.tab = 'topics'; this.render(el); });
    el.querySelectorAll('[data-exam]').forEach(b => b.onclick = () => {
      this.editExam(Learn.load().exams.find(x => x.id === b.dataset.exam));
    });
  },

  examRow(x, d) {
    const s = d.subjects.find(s => s.id === x.sid);
    const n = D.diffDays(D.today(), x.date);
    const cls = n < 0 ? '' : n <= 3 ? 'danger' : n <= 7 ? 'warn' : '';
    return `<div class="list-item" data-exam="${x.id}" style="cursor:pointer">
      <span class="dot" style="background:var(--c-${s ? s.color : 'gray'})"></span>
      <div style="flex:1;min-width:0">
        <div style="font-weight:600">${esc(x.title)}</div>
        <div class="muted small">${esc(s ? (s.lf ? 'LF ' + s.lf : s.name) : '–')} · ${esc(D.fmt(x.date))}</div>
      </div>
      <span class="tag ${cls}">${esc(D.relative(x.date))}</span>
    </div>`;
  },

  async editSubject(s) {
    const r = await UI.form({
      title: s ? 'Fach bearbeiten' : 'Neues Fach',
      fields: [
        { name: 'name', label: 'Name', required: true, placeholder: 'z. B. Lernfeld 3' },
        { name: 'color', label: 'Farbe', type: 'color' }
      ],
      values: s || { color: COLORS[Learn.load().subjects.length % COLORS.length] },
      danger: s ? 'Fach löschen' : null
    });
    if (!r) return;
    const d = Learn.load();
    if (r === 'delete') {
      if (!await UI.confirm(`Fach „${s.name}“ mit allen Karten, Notizen und Prüfungen löschen?`)) return;
      d.subjects = d.subjects.filter(x => x.id !== s.id);
      d.cards = d.cards.filter(c => c.sid !== s.id);
      d.exams = d.exams.filter(c => c.sid !== s.id);
      this.subject = null;
    } else if (s) Object.assign(d.subjects.find(x => x.id === s.id), r);
    else d.subjects.push({ id: uid(), notes: '', ...r });
    Learn.save(d);
    this.render(this.el);
  },

  async editExam(x) {
    const d = Learn.load();
    const r = await UI.form({
      title: x ? 'Prüfung bearbeiten' : 'Neue Prüfung / Klassenarbeit',
      fields: [
        { name: 'title', label: 'Titel', required: true, placeholder: 'z. B. Klassenarbeit Schützschaltungen' },
        { name: 'sid', label: 'Fach', type: 'select', half: true, options: Learn.ordered(d.subjects).map(s => [s.id, s.name]) },
        { name: 'date', label: 'Datum', type: 'date', required: true, half: true },
        { name: 'note', label: 'Themen / Notiz', type: 'textarea', rows: 3 }
      ],
      values: x || { sid: this.subject || d.subjects[0]?.id, date: D.addDays(D.today(), 7) },
      danger: x ? 'Löschen' : null
    });
    if (!r) return;
    if (r === 'delete') d.exams = d.exams.filter(e => e.id !== x.id);
    else if (x) Object.assign(d.exams.find(e => e.id === x.id), r);
    else d.exams.push({ id: uid(), ...r });
    Learn.save(d);
    this.render(this.el);
  },

  /* ---------- Fach-Ansicht ---------- */
  renderSubject() {
    const el = this.el;
    const d = Learn.load();
    const s = d.subjects.find(x => x.id === this.subject);
    const cards = d.cards.filter(c => c.sid === s.id);
    const due = Learn.due(cards);

    el.innerHTML = `
      <div class="page-head">
        <button class="icon-btn" data-act="back" title="Zurück">${icon('chevL')}</button>
        <div style="margin-right:auto">
          ${s.lf ? `<div class="muted small" style="font-weight:650">Lernfeld ${s.lf} · ${esc(Learn.YEARS[s.year])}${s.hours ? ' · ' + s.hours + ' Std.' : ''}</div>` : ''}
          <h1><span class="dot" style="background:var(--c-${s.color});width:12px;height:12px;vertical-align:middle;margin-right:6px"></span>${esc(Learn.short(s))}</h1>
        </div>
        <button class="icon-btn" data-act="editsub" title="Fach bearbeiten">${icon('edit')}</button>
        <div class="seg">
          <button data-tab="topics" class="${this.tab === 'topics' ? 'active' : ''}">Themen</button>
          <button data-tab="cards" class="${this.tab === 'cards' ? 'active' : ''}">Karteikarten</button>
          <button data-tab="learn" class="${this.tab === 'learn' ? 'active' : ''}">Lernen${due.length ? ` (${due.length})` : ''}</button>
          <button data-tab="notes" class="${this.tab === 'notes' ? 'active' : ''}">Lernzettel</button>
        </div>
      </div>
      <div id="learn-body"></div>`;

    el.querySelector('[data-act=back]').onclick = () => { this.subject = null; this.session = null; this.render(el); };
    el.querySelector('[data-act=editsub]').onclick = () => this.editSubject(s);
    el.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => {
      this.tab = b.dataset.tab;
      if (this.tab === 'learn') this.session = null;
      this.render(el);
    });

    const body = el.querySelector('#learn-body');
    if (this.tab === 'topics') this.drawTopics(body, s);
    else if (this.tab === 'cards') this.drawCards(body, s, cards);
    else if (this.tab === 'notes') this.drawNotes(body, s);
    else if (this.session) this.drawSession(body);
    else this.drawLearnStart(body, s, cards, due);
  },

  drawTopics(body, s) {
    const tp = s.topics || [];
    const done = tp.filter(t => t.done).length;
    body.innerHTML = `
      <div class="grid" style="grid-template-columns:minmax(0,1fr);gap:16px">
        ${s.goal ? `<div class="card card-pad"><div class="card-head"><h3>Ziel des Lernfelds</h3></div><p style="line-height:1.6">${esc(s.goal)}</p></div>` : ''}
        <div class="card card-pad">
          <div class="card-head"><h3>Themen</h3><span class="muted small">${done}/${tp.length} erledigt</span></div>
          ${tp.length ? `<div class="progress" style="margin-bottom:8px"><div style="width:${Math.round(done / tp.length * 100)}%"></div></div>` : ''}
          <div class="list">
            ${tp.map(t => `
              <div class="ex-row ${t.done ? 'done' : ''}" data-id="${t.id}" style="padding:9px 4px">
                <button class="ex-check" data-act="toggle" title="Abhaken">${icon('check')}</button>
                <div class="name" style="flex:1;font-weight:500">${esc(t.text)}</div>
                <button class="icon-btn" data-act="del" title="Thema entfernen">${icon('trash')}</button>
              </div>`).join('') || UI.empty('Noch keine Themen.')}
          </div>
          <form id="topic-add" style="display:flex;gap:8px;margin-top:12px">
            <input class="input" name="t" placeholder="Eigenes Thema hinzufügen…" required>
            <button class="btn" type="submit">${icon('plus')}</button>
          </form>
        </div>
      </div>`;
    const mutate = fn => {
      const d = Learn.load();
      const subj = d.subjects.find(x => x.id === s.id);
      subj.topics ||= [];
      fn(subj);
      Learn.save(d);
      this.render(this.el);
    };
    body.querySelectorAll('[data-act=toggle]').forEach(b => b.onclick = () => {
      const id = b.closest('.ex-row').dataset.id;
      mutate(subj => { const t = subj.topics.find(x => x.id === id); t.done = !t.done; });
    });
    body.querySelectorAll('[data-act=del]').forEach(b => b.onclick = () => {
      const id = b.closest('.ex-row').dataset.id;
      mutate(subj => { subj.topics = subj.topics.filter(x => x.id !== id); });
    });
    body.querySelector('#topic-add').onsubmit = e => {
      e.preventDefault();
      const v = e.target.t.value.trim();
      if (v) mutate(subj => subj.topics.push({ id: uid(), text: v, done: false }));
    };
  },

  drawCards(body, s, cards) {
    const counts = [1, 2, 3, 4, 5].map(b => cards.filter(c => c.box === b).length);
    body.innerHTML = `
      <div class="grid" style="grid-template-columns:minmax(0,1fr);gap:16px">
        <div class="card card-pad">
          <div class="card-head"><h3>Lernfortschritt</h3></div>
          <div class="boxes">${counts.map((n, i) => `<div class="b"><div class="n">${n}</div><div class="l">Fach ${i + 1}</div></div>`).join('')}</div>
        </div>
        <div class="card card-pad">
          <div class="card-head">
            <h3>${cards.length} Karteikarten</h3>
            <button class="btn primary sm" data-act="add">${icon('plus')} Karte</button>
          </div>
          ${cards.length ? `<div class="list">${cards.map(c => `
            <div class="list-item" data-id="${c.id}">
              <div style="flex:1;min-width:0">
                <div style="font-weight:600" class="qa">${esc(c.q)}</div>
                <div class="muted small qa">${esc(c.a)}</div>
              </div>
              <span class="tag">Fach ${c.box}</span>
              <button class="icon-btn" data-act="edit" title="Bearbeiten">${icon('edit')}</button>
            </div>`).join('')}</div>` : UI.empty('Noch keine Karten in diesem Fach.')}
        </div>
      </div>`;
    body.querySelector('[data-act=add]').onclick = () => this.editCard(null);
    body.querySelectorAll('[data-act=edit]').forEach(b => b.onclick = () => {
      this.editCard(Learn.load().cards.find(c => c.id === b.closest('.list-item').dataset.id));
    });
  },

  async editCard(c) {
    const r = await UI.form({
      title: c ? 'Karte bearbeiten' : 'Neue Karteikarte',
      fields: [
        { name: 'q', label: 'Vorderseite (Frage)', type: 'textarea', rows: 3, required: true },
        { name: 'a', label: 'Rückseite (Antwort)', type: 'textarea', rows: 4, required: true }
      ],
      values: c || {},
      danger: c ? 'Löschen' : null,
      submit: c ? 'Speichern' : 'Hinzufügen'
    });
    if (!r) return;
    const d = Learn.load();
    if (r === 'delete') d.cards = d.cards.filter(x => x.id !== c.id);
    else if (c) Object.assign(d.cards.find(x => x.id === c.id), r);
    else d.cards.push({ id: uid(), sid: this.subject, box: 1, next: D.today(), ...r });
    Learn.save(d);
    this.render(this.el);
    if (!c && r !== 'delete') this.editCard(null); // direkt nächste Karte
  },

  drawNotes(body, s) {
    body.innerHTML = `
      <div class="card" style="display:flex;flex-direction:column">
        <div class="note-toolbar"><span class="muted small" id="ln-status">Lernzettel – wird automatisch gespeichert</span></div>
        <textarea class="note-body" style="min-height:60vh" placeholder="Mitschriften, Formeln, Merksätze…">${esc(s.notes || '')}</textarea>
      </div>`;
    const status = body.querySelector('#ln-status');
    const save = debounce(v => {
      const d = Learn.load();
      d.subjects.find(x => x.id === s.id).notes = v;
      Learn.save(d);
      status.textContent = 'Gespeichert';
    }, 400);
    body.querySelector('textarea').addEventListener('input', e => { status.textContent = 'Speichert…'; save(e.target.value); });
  },

  drawLearnStart(body, s, cards, due) {
    body.innerHTML = `
      <div class="card card-pad" style="max-width:640px;margin:0 auto;text-align:center;display:grid;gap:14px">
        <h2>${due.length ? `${due.length} Karte${due.length === 1 ? '' : 'n'} fällig` : 'Alles gelernt für heute 🎉'}</h2>
        <p class="muted">${cards.length} Karten insgesamt in diesem Fach.</p>
        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
          <button class="btn primary" data-act="due" ${due.length ? '' : 'disabled'}>${icon('play')} Fällige lernen</button>
          <button class="btn" data-act="all" ${cards.length ? '' : 'disabled'}>Alle wiederholen (gemischt)</button>
        </div>
      </div>`;
    body.querySelector('[data-act=due]').onclick = () => this.startSession(s.id, 'due');
    body.querySelector('[data-act=all]').onclick = () => this.startSession(s.id, 'all');
  },

  startSession(sid, mode) {
    const d = Learn.load();
    let cards = d.cards.filter(c => !sid || c.sid === sid);
    if (mode === 'due') cards = Learn.due(cards);
    const queue = cards.map(c => c.id).sort(() => Math.random() - .5);
    if (!queue.length) { UI.toast('Keine Karten zum Lernen'); return; }
    this.session = { queue, mode, right: 0, wrong: 0, flipped: false, total: queue.length };
    this.tab = 'learn';
    if (!sid) {
      // fächerübergreifend – eigene Ansicht ohne Fach-Kopf
      this.el.innerHTML = `<div class="page-head"><button class="icon-btn" data-act="back" title="Zurück">${icon('chevL')}</button><h1>Alle fälligen Karten</h1></div><div id="learn-body"></div>`;
      this.el.querySelector('[data-act=back]').onclick = () => { this.session = null; this.render(this.el); };
      this.drawSession(this.el.querySelector('#learn-body'));
    } else this.render(this.el);
  },

  drawSession(body) {
    const ss = this.session;
    const d = Learn.load();
    if (!ss.queue.length) {
      body.innerHTML = `<div class="card card-pad" style="max-width:640px;margin:0 auto;text-align:center;display:grid;gap:12px">
        <h2>Runde geschafft! 🎉</h2>
        <p class="muted">${ss.right} gewusst · ${ss.wrong} nicht gewusst</p>
        <div><button class="btn primary" data-act="done">Fertig</button></div></div>`;
      body.querySelector('[data-act=done]').onclick = () => { this.session = null; this.render(this.el); };
      return;
    }
    const card = d.cards.find(c => c.id === ss.queue[0]);
    if (!card) { ss.queue.shift(); return this.drawSession(body); }
    const subj = d.subjects.find(s => s.id === card.sid);
    const doneCount = ss.total - ss.queue.length;

    body.innerHTML = `
      <div style="max-width:640px;margin:0 auto 12px;display:flex;align-items:center;gap:10px">
        <div class="progress" style="flex:1"><div style="width:${Math.round(doneCount / ss.total * 100)}%"></div></div>
        <span class="small muted">${doneCount}/${ss.total}</span>
      </div>
      <div class="flash-wrap">
        <div class="flash ${ss.flipped ? 'flipped' : ''}" id="flash" tabindex="0" role="button" aria-label="Karte umdrehen">
          <div class="side front card"><span class="hint">${esc(subj ? subj.name : '')} · Frage · Fach ${card.box}</span><div class="content">${esc(card.q)}</div><span class="muted small">Tippen zum Umdrehen</span></div>
          <div class="side back card"><span class="hint">Antwort</span><div class="content" style="font-weight:500">${esc(card.a)}</div></div>
        </div>
      </div>
      <div class="learn-actions">
        ${ss.flipped ? `
          <button class="btn danger" data-act="wrong">✗ Nicht gewusst</button>
          <button class="btn ok" data-act="right">✓ Gewusst</button>` :
          `<button class="btn primary" data-act="flip">${icon('flip')} Antwort zeigen</button>`}
      </div>`;

    const flip = () => { ss.flipped = !ss.flipped; this.drawSession(body); };
    body.querySelector('#flash').onclick = flip;
    body.querySelector('#flash').onkeydown = e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } };
    const fb = body.querySelector('[data-act=flip]');
    if (fb) fb.onclick = flip;
    const answer = ok => {
      const dd = Learn.load();
      const c = dd.cards.find(x => x.id === card.id);
      ss.queue.shift();
      if (ok) {
        c.box = Math.min(5, (c.box || 1) + 1);
        c.next = D.addDays(D.today(), Learn.INTERVALS[c.box]);
        ss.right++;
      } else {
        c.box = 1;
        c.next = D.today();
        ss.wrong++;
        ss.queue.push(c.id); // nochmal in dieser Runde
        ss.total++;
      }
      Learn.save(dd);
      ss.flipped = false;
      this.drawSession(body);
    };
    const r = body.querySelector('[data-act=right]');
    const w = body.querySelector('[data-act=wrong]');
    if (r) r.onclick = () => answer(true);
    if (w) w.onclick = () => answer(false);
  }
});
