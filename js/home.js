/* Startseite / Übersicht */
App.register('home', {
  title: 'Start',

  render(el) {
    const today = D.today();
    const h = new Date().getHours();
    const greet = h < 11 ? 'Guten Morgen' : h < 18 ? 'Hallo' : 'Guten Abend';

    // Daten sammeln
    const todayItems = Calendar.itemsFor(today);
    const upcoming = [];
    for (let i = 1; i <= 7; i++) {
      const d = D.addDays(today, i);
      Calendar.itemsFor(d).forEach(it => upcoming.push({ ...it, date: d }));
    }
    const tr = Training.load();
    const plan = tr.plan[D.weekday(today)];
    const done = Training.todayDone();
    const trainedToday = tr.log.some(l => l.date === today);

    if ((Learn.load().egsInstalled || 0) < Learn.EGS_VERSION) Learn.installEGS();
    const learn = Learn.load();
    const due = Learn.due(learn.cards).length;
    const nextExam = learn.exams.filter(x => x.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];

    const boards = Boards.load();
    let open = 0, overdue = 0;
    const urgent = [];
    boards.list.forEach(b => b.columns.forEach((c, ci) => {
      if (ci === b.columns.length - 1) return;
      c.cards.forEach(k => {
        open++;
        if (k.due && k.due < today) overdue++;
        if (k.due && k.due <= D.addDays(today, 3)) urgent.push({ ...k, col: c.title });
      });
    }));
    urgent.sort((a, b) => a.due.localeCompare(b.due));

    const notes = Store.get('notes', []).sort((a, b) => b.updated - a.updated).slice(0, 4);

    el.innerHTML = `
      <div class="hero">
        <h1>${greet}! 👋</h1>
        <div class="page-sub">${esc(D.long(today))}</div>
      </div>

      <div class="stat-row">
        <a class="card stat" href="#/calendar"><div class="num">${todayItems.length}</div><div class="lab">${icon('calendar')} Termine heute</div></a>
        <a class="card stat" href="#/board"><div class="num">${open}</div><div class="lab">${icon('board')} offene Aufgaben${overdue ? ` · <span style="color:var(--danger)">${overdue} überfällig</span>` : ''}</div></a>
        <a class="card stat" href="#/learn"><div class="num">${due}</div><div class="lab">${icon('learn')} Karten fällig</div></a>
        <a class="card stat" href="#/training"><div class="num">${trainedToday ? '✓' : plan.exercises.length ? plan.exercises.length : '–'}</div><div class="lab">${icon('training')} ${trainedToday ? 'heute trainiert' : plan.exercises.length ? 'Übungen heute' : 'Ruhetag'}</div></a>
      </div>

      <div class="grid grid-3">
        <div class="card card-pad">
          <div class="card-head"><h2>Heute</h2><a class="btn sm ghost" href="#/calendar">Kalender</a></div>
          ${todayItems.length ? `<div>${todayItems.map(it => this.agenda(it)).join('')}</div>` : UI.empty('Heute nichts geplant.')}
          ${upcoming.length ? `<h3 style="margin:14px 0 4px" class="muted small">NÄCHSTE 7 TAGE</h3>
            <div>${upcoming.slice(0, 5).map(it => this.agenda(it, true)).join('')}</div>` : ''}
        </div>

        <div class="card card-pad">
          <div class="card-head"><h2>Training</h2><a class="btn sm ghost" href="#/training">Plan</a></div>
          ${plan.exercises.length ? `
            <div style="font-weight:600;margin-bottom:6px">${esc(plan.title || D.DAYS[D.weekday(today)])}</div>
            <div class="progress" style="margin-bottom:10px"><div style="width:${Math.round(plan.exercises.filter(x => done.done[x.id]).length / plan.exercises.length * 100)}%"></div></div>
            <div class="list">${plan.exercises.slice(0, 6).map(x => `
              <div class="list-item"><span class="dot" style="background:${done.done[x.id] ? 'var(--ok)' : 'var(--surface-3)'}"></span>
              <span style="flex:1">${esc(x.name)}</span><span class="muted small">${x.sets || ''}${x.reps ? '×' + x.reps : ''}</span></div>`).join('')}</div>`
            : UI.empty('Heute ist Ruhetag. 😌')}
        </div>

        <div class="card card-pad">
          <div class="card-head"><h2>Berufsschule</h2><a class="btn sm ghost" href="#/learn">Lernen</a></div>
          ${nextExam ? (() => {
            const s = learn.subjects.find(x => x.id === nextExam.sid);
            const n = D.diffDays(today, nextExam.date);
            return `<div class="list-item" style="padding-top:0">
              <div style="flex:1"><div class="muted small">Nächste Prüfung</div><div style="font-weight:600">${esc(nextExam.title)}</div>
              <div class="muted small">${esc(s ? (s.lf ? 'LF ' + s.lf : s.name) : '')} · ${esc(D.fmt(nextExam.date))}</div></div>
              <span class="tag ${n <= 3 ? 'danger' : n <= 7 ? 'warn' : ''}">${esc(D.relative(nextExam.date))}</span></div>`;
          })() : '<p class="muted small" style="margin-bottom:10px">Keine Prüfungen eingetragen.</p>'}
          ${learn.subjects.length ? `<div class="list">${Learn.ordered(learn.subjects)
            .map(s => ({ s, n: Learn.due(learn.cards.filter(c => c.sid === s.id)).length }))
            .sort((a, b) => (b.n > 0) - (a.n > 0)).slice(0, 5).map(({ s, n }) => {
            return `<div class="list-item"><span class="dot" style="background:var(--c-${s.color})"></span><span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(s.name)}">${s.lf ? '<b>LF ' + s.lf + '</b> ' : ''}${esc(Learn.short(s))}</span>
              ${n ? `<span class="tag warn">${n} fällig</span>` : `<span class="tag ok">✓</span>`}</div>`;
          }).join('')}</div>` : `<a class="btn sm" href="#/learn">Fächer anlegen</a>`}
        </div>

        <div class="card card-pad">
          <div class="card-head"><h2>Dringende Aufgaben</h2><a class="btn sm ghost" href="#/board">Board</a></div>
          ${urgent.length ? `<div class="list">${urgent.slice(0, 6).map(k => `
            <div class="list-item">
              ${k.label ? `<span class="dot" style="background:var(--c-${k.label})"></span>` : '<span class="dot" style="background:var(--surface-3)"></span>'}
              <div style="flex:1;min-width:0"><div style="font-weight:550">${esc(k.title)}</div><div class="muted small">${esc(k.col)}</div></div>
              <span class="tag ${k.due < today ? 'danger' : 'warn'}">${esc(D.relative(k.due))}</span>
            </div>`).join('')}</div>` : UI.empty('Nichts Dringendes in den nächsten 3 Tagen.')}
        </div>

        <div class="card card-pad">
          <div class="card-head"><h2>Letzte Notizen</h2><a class="btn sm ghost" href="#/notes">Alle</a></div>
          ${notes.length ? `<div class="list">${notes.map(n => `
            <a class="list-item" href="#/notes" data-note="${n.id}" style="text-decoration:none;color:inherit">
              <div style="flex:1;min-width:0"><div style="font-weight:600">${esc(n.title || 'Ohne Titel')}</div>
              <div class="muted small" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(n.body.slice(0, 90) || 'Leer')}</div></div>
            </a>`).join('')}</div>` : UI.empty('Noch keine Notizen.')}
        </div>

        <a class="card card-pad" href="#/circuit" style="text-decoration:none;color:inherit;display:grid;gap:8px">
          <div class="card-head" style="margin:0"><h2>Steuerkreis-Simulator</h2>${icon('circuit')}</div>
          <p class="muted small">Selbsthaltung, Wendeschütz, Stern-Dreieck & eigene Schaltungen zeichnen und live simulieren.</p>
        </a>
      </div>`;

    el.querySelectorAll('[data-note]').forEach(a => a.addEventListener('click', () => { App.modules.notes.sel = a.dataset.note; }));
  },

  agenda(it, withDate) {
    return `<div class="agenda-item" style="--chip:var(--c-${it.color});cursor:default">
      <span class="bar"></span>
      <div style="min-width:0">
        <div style="font-weight:600">${esc(it.title)}</div>
        <div class="time">${withDate ? esc(D.relative(it.date)) + (it.time ? ' · ' : '') : ''}${it.time ? esc(it.time) + ' Uhr' : ''}</div>
      </div>
    </div>`;
  }
});
