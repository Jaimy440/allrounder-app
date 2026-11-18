/* Trainingsplan */
const Training = {
  empty() {
    const plan = {};
    for (let i = 0; i < 7; i++) plan[i] = { title: '', exercises: [] };
    return { plan, log: [] };
  },
  load() { return Store.get('training', this.empty()); },
  save(d) { Store.set('training', d); },
  todayDone() {
    const t = Store.get('training_today', null);
    return t && t.date === D.today() ? t : { date: D.today(), done: {} };
  },
  setDone(t) { Store.set('training_today', t); },

  sample() {
    const ex = (name, sets, reps, weight = '') => ({ id: uid(), name, sets, reps, weight, note: '' });
    const d = this.empty();
    d.plan[0] = { title: 'Push – Brust/Schulter/Trizeps', exercises: [ex('Bankdrücken', 4, 8, 60), ex('Schulterdrücken', 3, 10, 30), ex('Schrägbank Kurzhantel', 3, 10, 22), ex('Dips', 3, 12)] };
    d.plan[1] = { title: 'Cardio', exercises: [ex('Laufen (30 min)', 1, 1)] };
    d.plan[2] = { title: 'Pull – Rücken/Bizeps', exercises: [ex('Klimmzüge', 4, 8), ex('Rudern Langhantel', 4, 10, 50), ex('Latzug', 3, 12, 45), ex('Bizeps-Curls', 3, 12, 12)] };
    d.plan[4] = { title: 'Beine & Core', exercises: [ex('Kniebeugen', 4, 8, 70), ex('Rumänisches Kreuzheben', 3, 10, 60), ex('Ausfallschritte', 3, 12), ex('Plank (60 s)', 3, 1)] };
    d.plan[5] = { title: 'Mobility', exercises: [ex('Dehnen (20 min)', 1, 1)] };
    return d;
  }
};

App.register('training', {
  title: 'Training',
  day: null,

  render(el) {
    this.el = el;
    if (this.day == null) this.day = D.weekday(D.today());
    const data = Training.load();
    const todayIdx = D.weekday(D.today());
    const isEmpty = Object.values(data.plan).every(p => !p.exercises.length && !p.title);

    el.innerHTML = `
      <div class="page-head">
        <h1>Trainingsplan</h1>
        ${isEmpty ? `<button class="btn" data-act="sample">Beispielplan laden</button>` : ''}
      </div>
      <div class="day-tabs">
        ${D.DAYS.map((d, i) => `
          <button class="day-tab ${i === this.day ? 'active' : ''} ${i === todayIdx ? 'today' : ''}" data-day="${i}">
            <div class="d">${d.slice(0, 2)}</div>
            <div class="s">${esc(data.plan[i].title || (data.plan[i].exercises.length ? data.plan[i].exercises.length + ' Übungen' : 'Ruhetag'))}</div>
          </button>`).join('')}
      </div>
      <div class="train-layout">
        <div class="card card-pad" id="tr-day"></div>
        <div class="grid">
          <div class="card card-pad" id="tr-stats"></div>
          <div class="card card-pad" id="tr-log"></div>
        </div>
      </div>`;

    el.querySelectorAll('.day-tab').forEach(b => b.onclick = () => { this.day = +b.dataset.day; this.render(el); });
    const s = el.querySelector('[data-act=sample]');
    if (s) s.onclick = () => { Training.save(Training.sample()); this.render(el); UI.toast('Beispielplan geladen'); };
    this.drawDay();
    this.drawStats();
    this.drawLog();
  },

  drawDay() {
    const box = this.el.querySelector('#tr-day');
    const data = Training.load();
    const p = data.plan[this.day];
    const isToday = this.day === D.weekday(D.today());
    const done = Training.todayDone();
    const nDone = isToday ? p.exercises.filter(x => done.done[x.id]).length : 0;

    box.innerHTML = `
      <div class="muted small" style="font-weight:600">${D.DAYS[this.day]}${isToday ? ' · heute' : ''}</div>
      <input class="day-title-input" id="tr-title" placeholder="Name der Einheit (z. B. Oberkörper) – leer = Ruhetag" value="${esc(p.title)}">
      ${isToday && p.exercises.length ? `
        <div style="display:flex;align-items:center;gap:10px;margin:8px 0 4px">
          <div class="progress" style="flex:1"><div style="width:${Math.round(nDone / p.exercises.length * 100)}%"></div></div>
          <span class="small muted">${nDone}/${p.exercises.length}</span>
        </div>` : ''}
      <div class="list" style="margin-top:8px">
        ${p.exercises.length ? p.exercises.map(x => `
          <div class="ex-row ${isToday && done.done[x.id] ? 'done' : ''}" data-id="${x.id}">
            ${isToday ? `<button class="ex-check" data-act="toggle" title="Erledigt">${icon('check')}</button>` : ''}
            <div style="flex:1;min-width:0">
              <div class="name">${esc(x.name)}</div>
              <div class="ex-meta">
                ${x.sets ? `<span class="tag">${x.sets} Sätze</span>` : ''}
                ${x.reps ? `<span class="tag">${x.reps} Wdh.</span>` : ''}
                ${x.weight !== '' && x.weight != null ? `<span class="tag">${x.weight} kg</span>` : ''}
                ${x.note ? `<span class="muted small">${esc(x.note)}</span>` : ''}
              </div>
            </div>
            <button class="icon-btn" data-act="edit" title="Bearbeiten">${icon('edit')}</button>
          </div>`).join('') : UI.empty('Keine Übungen – Ruhetag oder füge welche hinzu.')}
      </div>
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
        <button class="btn" data-act="add">${icon('plus')} Übung</button>
        <span class="spacer"></span>
        ${isToday && p.exercises.length ? `<button class="btn ok" data-act="finish">${icon('check')} Training abschließen</button>` : ''}
      </div>`;

    box.querySelector('#tr-title').addEventListener('input', debounce(e => {
      const d = Training.load();
      d.plan[this.day].title = e.target.value;
      Training.save(d);
      const tab = this.el.querySelector(`.day-tab[data-day="${this.day}"] .s`);
      if (tab) tab.textContent = e.target.value || (d.plan[this.day].exercises.length ? d.plan[this.day].exercises.length + ' Übungen' : 'Ruhetag');
    }, 300));

    box.querySelector('[data-act=add]').onclick = () => this.editEx(null);
    box.querySelectorAll('[data-act=edit]').forEach(b => b.onclick = () => {
      const id = b.closest('.ex-row').dataset.id;
      this.editEx(Training.load().plan[this.day].exercises.find(x => x.id === id));
    });
    box.querySelectorAll('[data-act=toggle]').forEach(b => b.onclick = () => {
      const id = b.closest('.ex-row').dataset.id;
      const t = Training.todayDone();
      t.done[id] = !t.done[id];
      Training.setDone(t);
      this.drawDay();
    });
    const fin = box.querySelector('[data-act=finish]');
    if (fin) fin.onclick = () => this.finish();
  },

  async editEx(ex) {
    const r = await UI.form({
      title: ex ? 'Übung bearbeiten' : 'Neue Übung',
      fields: [
        { name: 'name', label: 'Übung', required: true, placeholder: 'z. B. Kniebeugen' },
        { name: 'sets', label: 'Sätze', type: 'number', min: 0, half: true },
        { name: 'reps', label: 'Wiederholungen', type: 'number', min: 0, half: true },
        { name: 'weight', label: 'Gewicht (kg)', type: 'number', step: '0.5', min: 0, half: true },
        { name: 'note', label: 'Notiz', placeholder: 'z. B. Pause 90 s', half: true }
      ],
      values: ex || { sets: 3, reps: 10 },
      danger: ex ? 'Löschen' : null
    });
    if (!r) return;
    const d = Training.load();
    const list = d.plan[this.day].exercises;
    if (r === 'delete') d.plan[this.day].exercises = list.filter(x => x.id !== ex.id);
    else if (ex) Object.assign(list.find(x => x.id === ex.id), r);
    else list.push({ id: uid(), ...r });
    Training.save(d);
    this.render(this.el);
  },

  async finish() {
    const d = Training.load();
    const p = d.plan[this.day];
    const t = Training.todayDone();
    const r = await UI.form({
      title: 'Training abschließen',
      fields: [
        { name: 'duration', label: 'Dauer (Minuten)', type: 'number', min: 0, half: true },
        { name: 'feeling', label: 'Gefühl', type: 'select', half: true, options: [['5', '💪 Super'], ['4', '🙂 Gut'], ['3', '😐 Okay'], ['2', '😮‍💨 Schwer']] },
        { name: 'note', label: 'Notiz', type: 'textarea', rows: 2 }
      ],
      values: { feeling: '4' },
      submit: 'Eintragen'
    });
    if (!r || r === 'delete') return;
    d.log.unshift({
      id: uid(), date: D.today(), title: p.title || D.DAYS[this.day],
      done: p.exercises.filter(x => t.done[x.id]).map(x => x.name),
      total: p.exercises.length, ...r
    });
    Training.save(d);
    UI.toast('Training eingetragen – stark! 💪');
    this.render(this.el);
  },

  drawStats() {
    const d = Training.load();
    const today = D.today();
    const monday = D.addDays(today, -D.weekday(today));
    const week = d.log.filter(l => l.date >= monday).length;
    const planned = Object.values(d.plan).filter(p => p.exercises.length).length;
    const month = d.log.filter(l => l.date.slice(0, 7) === today.slice(0, 7)).length;
    this.el.querySelector('#tr-stats').innerHTML = `
      <div class="card-head"><h3>Statistik</h3></div>
      <div class="grid grid-3" style="gap:8px;grid-template-columns:repeat(3,1fr)">
        <div><div style="font-size:1.5rem;font-weight:700">${week}/${planned}</div><div class="muted small">diese Woche</div></div>
        <div><div style="font-size:1.5rem;font-weight:700">${month}</div><div class="muted small">diesen Monat</div></div>
        <div><div style="font-size:1.5rem;font-weight:700">${d.log.length}</div><div class="muted small">gesamt</div></div>
      </div>`;
  },

  drawLog() {
    const d = Training.load();
    const box = this.el.querySelector('#tr-log');
    const mood = { 5: '💪', 4: '🙂', 3: '😐', 2: '😮‍💨' };
    box.innerHTML = `
      <div class="card-head"><h3>Verlauf</h3></div>
      ${d.log.length ? `<div class="list">${d.log.slice(0, 15).map(l => `
        <div class="list-item" data-id="${l.id}">
          <div style="flex:1;min-width:0">
            <div style="font-weight:600">${esc(l.title)} ${mood[l.feeling] || ''}</div>
            <div class="muted small">${esc(D.relative(l.date))} · ${l.done.length}/${l.total} Übungen${l.duration ? ' · ' + l.duration + ' min' : ''}</div>
            ${l.note ? `<div class="small qa">${esc(l.note)}</div>` : ''}
          </div>
          <button class="icon-btn" data-act="del" title="Eintrag löschen">${icon('trash')}</button>
        </div>`).join('')}</div>` : UI.empty('Noch keine Einheiten eingetragen.')}`;
    box.querySelectorAll('[data-act=del]').forEach(b => b.onclick = async () => {
      if (!await UI.confirm('Eintrag aus dem Verlauf löschen?')) return;
      const id = b.closest('.list-item').dataset.id;
      const dd = Training.load();
      dd.log = dd.log.filter(l => l.id !== id);
      Training.save(dd);
      this.render(this.el);
    });
  }
});
