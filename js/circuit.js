/* Steuerkreis-Simulator
 *
 * Datenmodell
 *   circuit = { name, inputs: [{tag, type:'taster'|'schalter', label}], rungs: [rung] }
 *   rung    = { blocks: [block], out: {kind, tag, label, delay} }   – ein Strompfad zwischen L1 und N
 *   block   = [branch]                                              – Parallelzweige (ODER)
 *   branch  = [contact]                                             – Reihenschaltung (UND)
 *   contact = { tag, no }                                           – no=true Schließer, no=false Öffner
 *   out.kind: 'coil' (Schütz/Relais), 'timer_on' (anzugsverzögert), 'timer_off' (abfallverzögert), 'lamp' (Meldeleuchte)
 */
(function () {
  const CH = 64;        // Höhe eines Kontakt-Slots
  const BDX = 62;       // Abstand der Parallelzweige
  const SPLIT = 14;     // Höhe von Verzweigungs-/Zusammenführungs-Schiene
  const OUT_H = 100;    // Bereich für Spule/Leuchte
  const TOP = 46;       // y der L1-Schiene
  const LEFT = 44;

  const OUT_KINDS = [
    ['coil', 'Schütz / Relais (K)'],
    ['timer_on', 'Zeitrelais anzugsverzögert (KT)'],
    ['timer_off', 'Zeitrelais abfallverzögert (KT)'],
    ['lamp', 'Meldeleuchte (H)']
  ];

  /* ---------- Vorlagen ---------- */
  const C = (tag, no = true) => ({ tag, no });
  const P = (...branches) => ({ par: branches.map(b => Array.isArray(b) ? b : [b]) });
  const R = (out, ...items) => ({ blocks: items.map(it => it.par ? it.par : [[it]]), out });
  const coil = (tag, label) => ({ kind: 'coil', tag, label });
  const lamp = (tag, label) => ({ kind: 'lamp', tag, label });
  const ton = (tag, label, delay) => ({ kind: 'timer_on', tag, label, delay });
  const toff = (tag, label, delay) => ({ kind: 'timer_off', tag, label, delay });
  const T = (tag, label) => ({ tag, type: 'taster', label });
  const SW = (tag, label) => ({ tag, type: 'schalter', label });

  const PRESETS = {
    tipp: {
      name: 'Tippbetrieb',
      info: 'Das Schütz K1 zieht nur an, solange S1 gedrückt wird. Typisch für Einrichtbetrieb.',
      inputs: [T('S1', 'Tippen')],
      rungs: [R(coil('K1', 'Motorschütz'), C('S1')), R(lamp('H1', 'Betrieb'), C('K1'))]
    },
    selbst: {
      name: 'Selbsthaltung (Dauerbetrieb)',
      info: 'S1 schaltet K1 ein, der Schließer K1 parallel zu S1 hält das Schütz. S0 (Öffner) schaltet aus. F2 simuliert das Auslösen des Motorschutzes.',
      inputs: [SW('F2', 'Motorschutz'), T('S0', 'Aus'), T('S1', 'Ein')],
      rungs: [
        R(coil('K1', 'Motorschütz'), C('F2', false), C('S0', false), P(C('S1'), C('K1'))),
        R(lamp('H1', 'Betrieb'), C('K1')),
        R(lamp('H2', 'Störung'), C('F2'))
      ]
    },
    wende: {
      name: 'Wendeschützschaltung (verriegelt)',
      info: 'Rechts-/Linkslauf mit Taster- und Schützverriegelung: Die Öffner von S2/K2 im Pfad von K1 (und umgekehrt) verhindern, dass beide Schütze gleichzeitig anziehen.',
      inputs: [SW('F2', 'Motorschutz'), T('S0', 'Aus'), T('S1', 'Rechts'), T('S2', 'Links')],
      rungs: [
        R(coil('K1', 'Rechtslauf'), C('F2', false), C('S0', false), P(C('S1'), C('K1')), C('S2', false), C('K2', false)),
        R(coil('K2', 'Linkslauf'), C('F2', false), C('S0', false), P(C('S2'), C('K2')), C('S1', false), C('K1', false)),
        R(lamp('H1', 'Rechts'), C('K1')),
        R(lamp('H2', 'Links'), C('K2'))
      ]
    },
    sterndreieck: {
      name: 'Stern-Dreieck-Anlauf (automatisch)',
      info: 'K1 = Netzschütz, K2 = Sternschütz, K3 = Dreieckschütz. Nach Ablauf von KT1 wird von Stern auf Dreieck umgeschaltet. K2 und K3 sind gegeneinander verriegelt.',
      inputs: [SW('F2', 'Motorschutz'), T('S0', 'Aus'), T('S1', 'Ein')],
      rungs: [
        R(coil('K1', 'Netz'), C('F2', false), C('S0', false), P(C('S1'), C('K1'))),
        R(ton('KT1', 'Umschaltzeit', 3), C('K1'), C('K3', false)),
        R(coil('K2', 'Stern'), C('K1'), C('KT1', false), C('K3', false)),
        R(coil('K3', 'Dreieck'), C('K1'), P(C('KT1'), C('K3')), C('K2', false)),
        R(lamp('H1', 'Stern'), C('K2')),
        R(lamp('H2', 'Dreieck'), C('K3'))
      ]
    },
    folge: {
      name: 'Folgeschaltung',
      info: 'Motor 2 (K2) kann erst eingeschaltet werden, wenn Motor 1 (K1) läuft. S0 schaltet alles aus, S3 nur Motor 2.',
      inputs: [T('S0', 'Alles aus'), T('S1', 'M1 ein'), T('S3', 'M2 aus'), T('S2', 'M2 ein')],
      rungs: [
        R(coil('K1', 'Motor 1'), C('S0', false), P(C('S1'), C('K1'))),
        R(coil('K2', 'Motor 2'), C('S0', false), C('K1'), C('S3', false), P(C('S2'), C('K2'))),
        R(lamp('H1', 'M1 läuft'), C('K1')),
        R(lamp('H2', 'M2 läuft'), C('K2'))
      ]
    },
    treppe: {
      name: 'Treppenlicht (abfallverzögert)',
      info: 'Ein kurzer Druck auf S1 oder S2 schaltet das Licht ein. Nach dem Loslassen bleibt es noch 5 s an (abfallverzögertes Zeitrelais KT1).',
      inputs: [T('S1', 'Taster EG'), T('S2', 'Taster OG')],
      rungs: [
        R(toff('KT1', 'Nachlaufzeit', 5), P(C('S1'), C('S2'))),
        R(lamp('H1', 'Treppenlicht'), C('KT1'))
      ]
    },
    leer: {
      name: 'Leere Schaltung',
      info: 'Starte mit einem leeren Strompfad.',
      inputs: [T('S0', 'Aus'), T('S1', 'Ein')],
      rungs: [R(coil('K1', ''), C('S1'))]
    }
  };

  const clone = o => JSON.parse(JSON.stringify(o));
  const fromPreset = key => { const p = clone(PRESETS[key]); return { name: p.name, info: p.info, inputs: p.inputs, rungs: p.rungs }; };

  /* ---------- Modul ---------- */
  const Sim = {
    title: 'Steuerkreis',
    mode: 'sim',
    sel: null,
    timer: null,

    load() {
      const st = Store.get('circuit', null);
      if (st && st.current) return st;
      return { current: fromPreset('selbst'), saved: [] };
    },
    persist() { Store.set('circuit', { current: this.c, saved: this.saved }); },

    render(el) {
      this.el = el;
      const st = this.load();
      this.c = st.current;
      this.saved = st.saved || [];
      this.resetSim();

      el.innerHTML = `
        <div class="page-head">
          <div style="margin-right:auto">
            <h1>Steuerkreis-Simulator</h1>
            <div class="page-sub" id="sk-name"></div>
          </div>
          <div class="seg" role="tablist">
            <button data-mode="sim">${icon('play')} Simulieren</button>
            <button data-mode="edit">${icon('edit')} Bearbeiten</button>
          </div>
        </div>
        <div class="sk-toolbar">
          <select class="input" id="sk-load" aria-label="Schaltung laden"></select>
          <button class="btn" data-act="save">Speichern unter…</button>
          <button class="btn ghost" data-act="reset" title="Alle Schütze abfallen lassen">${icon('stop')} Reset</button>
        </div>
        <div class="sk-layout">
          <div class="card">
            <div class="sk-canvas" id="sk-canvas"></div>
            <div class="sk-legend">
              <span><i style="background:var(--live)"></i>Spannung (L1)</span>
              <span><i style="background:var(--wire)"></i>spannungslos</span>
              <span><i style="background:var(--neutral)"></i>Neutralleiter N</span>
              <span><i style="background:var(--coil-on);height:10px;width:10px;border-radius:2px"></i>Spule angezogen</span>
            </div>
          </div>
          <div class="sk-panel" id="sk-panel"></div>
        </div>`;

      el.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => this.setMode(b.dataset.mode));
      el.querySelector('[data-act=save]').onclick = () => this.saveAs();
      el.querySelector('[data-act=reset]').onclick = () => { this.resetSim(); this.tick(true); };
      el.querySelector('#sk-load').onchange = e => this.loadCircuit(e.target.value);

      const canvas = el.querySelector('#sk-canvas');
      canvas.addEventListener('pointerdown', e => this.onCanvasDown(e));
      this.onUp = () => this.releaseTaster();
      window.addEventListener('pointerup', this.onUp);
      window.addEventListener('pointercancel', this.onUp);

      this.setMode(this.mode);
      this.timer = setInterval(() => this.tick(), 50);
    },

    destroy() {
      clearInterval(this.timer);
      window.removeEventListener('pointerup', this.onUp);
      window.removeEventListener('pointercancel', this.onUp);
    },

    drawLoadSelect() {
      const sel = this.el.querySelector('#sk-load');
      sel.innerHTML = `<option value="">Schaltung laden…</option>
        <optgroup label="Vorlagen">${Object.entries(PRESETS).map(([k, p]) => `<option value="p:${k}">${esc(p.name)}</option>`).join('')}</optgroup>
        ${this.saved.length ? `<optgroup label="Gespeichert">${this.saved.map(s => `<option value="s:${s.id}">${esc(s.name)}</option>`).join('')}</optgroup>` : ''}
        ${this.saved.length ? `<optgroup label="Verwalten"><option value="del">Gespeicherte löschen…</option></optgroup>` : ''}`;
      this.el.querySelector('#sk-name').textContent = this.c.name || 'Eigene Schaltung';
    },

    async loadCircuit(v) {
      if (!v) return;
      if (v === 'del') {
        const r = await UI.form({
          title: 'Gespeicherte Schaltung löschen', submit: 'Löschen',
          fields: [{ name: 'id', label: 'Schaltung', type: 'select', options: this.saved.map(s => [s.id, s.name]) }]
        });
        if (r && r !== 'delete') { this.saved = this.saved.filter(s => s.id !== r.id); this.persist(); }
      } else if (v.startsWith('p:')) {
        this.c = fromPreset(v.slice(2));
      } else {
        const s = this.saved.find(x => x.id === v.slice(2));
        if (s) this.c = clone(s.data);
      }
      this.sel = null;
      this.persist();
      this.resetSim();
      this.setMode(this.mode);
    },

    async saveAs() {
      const name = await UI.prompt('Schaltung speichern', 'Name', this.c.name || '');
      if (!name) return;
      this.c.name = name;
      const ex = this.saved.find(s => s.name === name);
      if (ex) ex.data = clone(this.c);
      else this.saved.push({ id: uid(), name, data: clone(this.c) });
      this.persist();
      this.drawLoadSelect();
      UI.toast('Schaltung gespeichert');
    },

    setMode(m) {
      this.mode = m;
      if (m === 'sim') this.sel = null;
      this.resetSim();
      this.el.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === m));
      this.drawLoadSelect();
      this.drawPanel();
      this.tick(true);
    },

    /* ---------- Simulation ---------- */
    resetSim() {
      this.s = { inputs: {}, out: {}, coil: {}, timers: {}, unstable: false, held: new Set() };
    },

    inputOf(tag) { return this.c.inputs.find(i => i.tag === tag); },
    outOf(tag) { return this.c.rungs.map(r => r.out).find(o => o.tag === tag); },

    actuated(tag) {
      if (this.mode !== 'sim') return false;
      if (this.inputOf(tag)) return !!this.s.inputs[tag];
      return !!this.s.out[tag];
    },
    closed(c) { const a = this.actuated(c.tag); return c.no ? a : !a; },
    conducts(r) { return r.blocks.every(b => b.some(br => br.every(c => this.closed(c)))); },

    step(now) {
      const s = this.s;
      for (let i = 0; i < 40; i++) {
        const en = {};
        this.c.rungs.forEach(r => { if (r.out.tag) en[r.out.tag] = en[r.out.tag] || this.conducts(r); });
        let changed = false;
        Object.keys(en).forEach(tag => {
          const o = this.outOf(tag);
          const e = en[tag];
          s.coil[tag] = e;
          const delay = Math.max(0, Number(o.delay) || 0) * 1000;
          const t = s.timers[tag] || (s.timers[tag] = {});
          let val;
          if (o.kind === 'timer_on') {
            if (e) { if (t.since == null) t.since = now; val = now - t.since >= delay; }
            else { t.since = null; val = false; }
          } else if (o.kind === 'timer_off') {
            if (e) { t.off = null; t.was = true; val = true; }
            else if (t.was) {
              if (t.off == null) t.off = now;
              val = now - t.off < delay;
              if (!val) t.was = false;
            } else val = false;
          } else val = e;
          if (!!s.out[tag] !== val) { s.out[tag] = val; changed = true; }
        });
        if (!changed) { s.unstable = false; return; }
      }
      s.unstable = true;
    },

    tick(force) {
      if (!this.el) return;
      let sig = '';
      if (this.mode === 'sim') {
        const before = JSON.stringify(this.s.out) + JSON.stringify(this.s.coil);
        this.step(performance.now());
        sig = JSON.stringify(this.s.out) + JSON.stringify(this.s.coil);
        const timing = Object.entries(this.s.timers).some(([, t]) => t.since != null || t.off != null);
        if (!force && before === sig && !timing && !this.dirty) return;
      } else if (!force && !this.dirty) return;
      this.dirty = false;
      this.draw();
      this.updateStatus();
    },

    press(tag) {
      const inp = this.inputOf(tag);
      if (!inp || this.mode !== 'sim') return;
      if (inp.type === 'schalter') this.s.inputs[tag] = !this.s.inputs[tag];
      else { this.s.inputs[tag] = true; this.s.held.add(tag); }
      this.dirty = true;
      this.updateInputButtons();
      this.tick();
    },
    releaseTaster() {
      if (!this.s || !this.s.held.size) return;
      this.s.held.forEach(t => { this.s.inputs[t] = false; });
      this.s.held.clear();
      this.dirty = true;
      this.updateInputButtons();
      this.tick();
    },

    onCanvasDown(e) {
      const hit = e.target.closest('[data-hit]');
      if (this.mode === 'sim') {
        if (hit && hit.dataset.tag) { e.preventDefault(); this.press(hit.dataset.tag); }
        return;
      }
      if (!hit) { this.sel = null; }
      else if (hit.dataset.hit === 'contact') {
        const [r, b, br, c] = hit.dataset.path.split(',').map(Number);
        this.sel = { type: 'contact', r, b, br, c };
      } else if (hit.dataset.hit === 'out') {
        this.sel = { type: 'out', r: +hit.dataset.r };
      }
      this.dirty = true;
      this.drawPanel();
      this.tick(true);
    },

    /* ---------- Zeichnen ---------- */
    layout() {
      let x = LEFT + 20;
      const rungs = this.c.rungs.map(r => {
        const maxBr = Math.max(1, ...r.blocks.map(b => b.length));
        const w = Math.max(96, maxBr * BDX + 34);
        const blocks = r.blocks.map(b => {
          const maxLen = Math.max(1, ...b.map(br => br.length));
          return { maxLen, h: maxLen * CH + (b.length > 1 ? SPLIT * 2 : 0) };
        });
        const contentH = blocks.reduce((a, b) => a + b.h, 0);
        const g = { x: x + w / 2, w, blocks, contentH };
        x += w;
        return g;
      });
      const maxContent = Math.max(CH, ...rungs.map(r => r.contentH));
      const outY = TOP + maxContent + 18;
      const bottom = outY + OUT_H - 18;
      return { rungs, outY, bottom, width: x + 30, height: bottom + 64 };
    },

    draw() {
      const L = this.layout();
      const parts = [];
      const W = (x1, y1, x2, y2, live) => parts.push(`<line class="w ${live ? 'live' : ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
      const sim = this.mode === 'sim';
      const knownTags = new Set([...this.c.inputs.map(i => i.tag), ...this.c.rungs.map(r => r.out.kind !== 'lamp' ? r.out.tag : null)]);
      const lastX = L.rungs.length ? L.rungs[L.rungs.length - 1].x : LEFT + 60;

      // Schienen
      parts.push(`<text x="${LEFT - 30}" y="${TOP + 4}">L1</text><text x="${LEFT - 30}" y="${L.bottom + 4}">N</text>`);
      parts.push(`<line class="w ${sim ? 'live' : ''}" x1="${LEFT}" y1="${TOP}" x2="${Math.max(lastX + 30, LEFT + 80)}" y2="${TOP}"/>`);
      parts.push(`<line class="w n" x1="${LEFT}" y1="${L.bottom}" x2="${Math.max(lastX + 30, LEFT + 80)}" y2="${L.bottom}"/>`);

      this.c.rungs.forEach((rung, ri) => {
        const g = L.rungs[ri];
        const x = g.x;
        let y = TOP;
        let live = sim;
        parts.push(`<circle class="junction ${sim ? 'live' : ''}" cx="${x}" cy="${TOP}" r="3"/>`);

        rung.blocks.forEach((block, bi) => {
          const bg = g.blocks[bi];
          const n = block.length;
          const xs = block.map((_, i) => x + (i - (n - 1) / 2) * BDX);
          let yStart = y;
          if (n > 1) {
            W(x, y, x, y + SPLIT, live);
            W(xs[0], y + SPLIT, xs[n - 1], y + SPLIT, live);
            yStart = y + SPLIT;
          }
          const yEnd = yStart + bg.maxLen * CH;
          // Potential je Knoten berechnen (inkl. Rückspeisung von der Sammelschiene)
          const nodes = block.map(br => {
            const nd = [live];
            br.forEach((c, k) => nd.push(nd[k] && this.closed(c)));
            return nd;
          });
          const barLive = nodes.some(nd => nd[nd.length - 1]);
          nodes.forEach((nd, i) => {
            nd[nd.length - 1] = nd[nd.length - 1] || barLive;
            for (let k = block[i].length - 1; k >= 0; k--) if (this.closed(block[i][k]) && nd[k + 1]) nd[k] = true;
          });

          block.forEach((br, i) => {
            const bx = xs[i];
            br.forEach((c, k) => {
              const cy = yStart + k * CH;
              const isSel = this.sel && this.sel.type === 'contact' && this.sel.r === ri && this.sel.b === bi && this.sel.br === i && this.sel.c === k;
              parts.push(this.contactSVG(bx, cy, c, nodes[i][k], nodes[i][k + 1], isSel, !knownTags.has(c.tag), [ri, bi, i, k]));
            });
            const brEnd = yStart + br.length * CH;
            if (brEnd < yEnd) W(bx, brEnd, bx, yEnd, nodes[i][br.length]);
          });
          if (n > 1) {
            W(xs[0], yEnd, xs[n - 1], yEnd, barLive);
            W(x, yEnd, x, yEnd + SPLIT, barLive);
            xs.slice(1, -1).forEach(bx => {
              parts.push(`<circle class="junction ${live ? 'live' : ''}" cx="${bx}" cy="${yStart}" r="2.5"/>`);
              parts.push(`<circle class="junction ${barLive ? 'live' : ''}" cx="${bx}" cy="${yEnd}" r="2.5"/>`);
            });
          }
          live = barLive;
          y = yEnd + (n > 1 ? SPLIT : 0);
        });

        // Leitung bis zum Verbraucher
        const oy = L.outY;
        W(x, y, x, oy + 20, live);
        // Verbraucher
        const isSelOut = this.sel && this.sel.type === 'out' && this.sel.r === ri;
        parts.push(this.outSVG(x, oy + 20, rung.out, ri, isSelOut));
        parts.push(`<line class="w n" x1="${x}" y1="${oy + 60}" x2="${x}" y2="${L.bottom}"/>`);
        parts.push(`<circle cx="${x}" cy="${L.bottom}" r="3" fill="var(--neutral)"/>`);
        // Strompfad-Nummer & Bezeichnung
        parts.push(`<text x="${x}" y="${L.bottom + 20}" text-anchor="middle" class="lbl-muted">${ri + 1}</text>`);
        if (rung.out.label) parts.push(`<text x="${x}" y="${L.bottom + 36}" text-anchor="middle" class="lbl-muted">${esc(this.trunc(rung.out.label, Math.floor(g.w / 6.5)))}</text>`);
      });

      if (!this.c.rungs.length) parts.push(`<text x="${LEFT + 20}" y="${TOP + 60}" class="lbl-muted">Keine Strompfade – im Bearbeiten-Modus hinzufügen.</text>`);

      this.el.querySelector('#sk-canvas').innerHTML =
        `<svg width="${L.width}" height="${L.height}" viewBox="0 0 ${L.width} ${L.height}" role="img" aria-label="Stromlaufplan">${parts.join('')}</svg>`;
    },

    trunc(s, n) { return s.length > n ? s.slice(0, Math.max(1, n - 1)) + '…' : s; },

    contactSVG(x, y, c, liveTop, liveBot, selected, unknown, path) {
      const act = this.actuated(c.tag);
      const closed = c.no ? act : !act;
      const y1 = y + 12, y2 = y + 52; // Symbolbereich
      const inp = this.inputOf(c.tag);
      const outDef = this.outOf(c.tag);
      const o = [];
      o.push(`<g>`);
      if (selected) o.push(`<rect class="sel" x="${x - 26}" y="${y + 2}" width="52" height="${CH - 4}" rx="6"/>`);
      // Zuleitungen
      o.push(`<line class="w ${liveTop ? 'live' : ''}" x1="${x}" y1="${y}" x2="${x}" y2="${y1 + 8}"/>`);
      o.push(`<line class="w ${liveBot ? 'live' : ''}" x1="${x}" y1="${y2 - 8}" x2="${x}" y2="${y + CH}"/>`);
      const bladeCls = `w ${liveBot ? 'live' : ''}`;
      const pivotY = y2 - 8;
      if (c.no) {
        // Schließer
        const tx = closed ? x : x - 13, ty = closed ? y1 + 8 : y1 + 9;
        o.push(`<line class="${bladeCls}" x1="${x}" y1="${pivotY}" x2="${tx}" y2="${ty}"/>`);
      } else {
        // Öffner: feststehender Kontakt mit Haken nach rechts
        o.push(`<line class="w ${liveTop ? 'live' : ''}" x1="${x}" y1="${y1 + 8}" x2="${x + 10}" y2="${y1 + 8}"/>`);
        const tx = closed ? x + 13 : x - 12, ty = closed ? y1 + 5 : y1 + 11;
        o.push(`<line class="${bladeCls}" x1="${x}" y1="${pivotY}" x2="${tx}" y2="${ty}"/>`);
      }
      // Kontaktpunkte
      o.push(`<circle class="term" cx="${x}" cy="${pivotY}" r="2.2"/>`);
      if (c.no) o.push(`<circle class="term" cx="${x}" cy="${y1 + 8}" r="2.2"/>`);
      // Betätigung
      const my = (y1 + y2) / 2;
      const bx = c.no ? (closed ? x : x - 6) : (closed ? x + 6 : x - 5);
      if (inp) {
        o.push(`<line class="act" stroke-dasharray="3 2" x1="${bx}" y1="${my}" x2="${x - 22}" y2="${my}"/>`);
        if (inp.type === 'taster') o.push(`<path class="act" d="M${x - 18} ${my - 6} h-4 v12 h4"/>`);
        else o.push(`<path class="act" d="M${x - 16} ${my - 6} l-6 0 l0 6 l0 6 l-4 0"/>`);
      } else if (outDef && (outDef.kind === 'timer_on' || outDef.kind === 'timer_off')) {
        // Verzögerungssymbol (Halbkreis)
        const dir = outDef.kind === 'timer_on' ? 1 : -1;
        o.push(`<line class="act" x1="${bx}" y1="${my}" x2="${x - 16}" y2="${my}"/>`);
        o.push(`<path class="act" d="M${x - 16} ${my - 5} a 5 5 0 0 ${dir > 0 ? 0 : 1} 0 10"/>`);
      }
      // Beschriftung
      const lab = '-' + (c.tag || '?');
      o.push(`<text x="${x + 13}" y="${my - 2}" ${unknown ? 'class="warnc"' : ''}>${esc(lab)}</text>`);
      o.push(`<text x="${x + 13}" y="${my + 11}" class="lbl-muted">${c.no ? '13/14' : '11/12'}</text>`);
      const tip = inp ? `${inp.tag}: ${inp.label || ''} (${inp.type === 'taster' ? 'Taster' : 'Schalter'}) – ${c.no ? 'Schließer' : 'Öffner'}`
        : `${c.tag}: ${c.no ? 'Schließer' : 'Öffner'}${unknown ? ' – unbekanntes Betriebsmittel!' : ''}`;
      o.push(`<rect class="hit" data-hit="contact" data-path="${path.join(',')}" ${inp ? `data-tag="${esc(c.tag)}"` : ''} x="${x - 26}" y="${y + 4}" width="52" height="${CH - 8}"><title>${esc(tip)}</title></rect>`);
      o.push(`</g>`);
      return o.join('');
    },

    outSVG(x, y, out, ri, selected) {
      const sim = this.mode === 'sim';
      const on = sim && !!this.s.coil[out.tag];
      const o = [];
      if (selected) o.push(`<rect class="sel" x="${x - 30}" y="${y - 6}" width="60" height="52" rx="6"/>`);
      o.push(`<line class="w ${on ? 'live' : ''}" x1="${x}" y1="${y}" x2="${x}" y2="${y + 8}"/>`);
      if (out.kind === 'lamp') {
        const lit = on;
        o.push(`<circle class="lamp ${lit ? 'on' : ''}" cx="${x}" cy="${y + 20}" r="12"/>`);
        o.push(`<path class="sym" d="M${x - 8.5} ${y + 11.5} l17 17 M${x + 8.5} ${y + 11.5} l-17 17"/>`);
        o.push(`<line class="w n" x1="${x}" y1="${y + 32}" x2="${x}" y2="${y + 40}"/>`);
      } else {
        o.push(`<rect class="coil ${on ? 'on' : ''}" x="${x - 15}" y="${y + 8}" width="30" height="24" rx="1"/>`);
        if (out.kind === 'timer_on' || out.kind === 'timer_off') {
          // Zusatzfeld des Zeitrelais
          if (out.kind === 'timer_off') o.push(`<rect class="sym fill" x="${x - 25}" y="${y + 8}" width="10" height="24"/>`);
          else o.push(`<rect class="sym" x="${x - 25}" y="${y + 8}" width="10" height="24"/><path class="sym" d="M${x - 25} ${y + 8} l10 24 M${x - 15} ${y + 8} l-10 24"/>`);
          const t = this.s.timers[out.tag];
          const d = Math.max(0.001, (Number(out.delay) || 0) * 1000);
          let p = null;
          if (sim && t) {
            if (out.kind === 'timer_on' && t.since != null && !this.s.out[out.tag]) p = (performance.now() - t.since) / d;
            if (out.kind === 'timer_off' && t.off != null && this.s.out[out.tag]) p = 1 - (performance.now() - t.off) / d;
          }
          if (p != null) o.push(`<rect class="prog" x="${x - 15}" y="${y + 35}" width="${30 * Math.max(0, Math.min(1, p))}" height="3" rx="1"/>`);
        }
        o.push(`<line class="w n" x1="${x}" y1="${y + 32}" x2="${x}" y2="${y + 40}"/>`);
      }
      o.push(`<text x="${x + 18}" y="${y + 18}">-${esc(out.tag || '?')}</text>`);
      if (out.kind !== 'lamp') o.push(`<text x="${x + 18}" y="${y + 30}" class="lbl-muted">A1/A2</text>`);
      if (out.kind === 'timer_on' || out.kind === 'timer_off') o.push(`<text x="${x - 20}" y="${y + 50}" class="lbl-muted" text-anchor="middle">${Number(out.delay) || 0}s</text>`);
      o.push(`<rect class="hit" data-hit="out" data-r="${ri}" x="${x - 30}" y="${y - 4}" width="60" height="48"><title>${esc(out.tag + (out.label ? ': ' + out.label : ''))}</title></rect>`);
      return o.join('');
    },

    /* ---------- Seitenleiste ---------- */
    drawPanel() {
      const p = this.el.querySelector('#sk-panel');
      if (this.mode === 'sim') {
        p.innerHTML = `
          <div class="card card-pad">
            <div class="card-head"><h3>Bedienfeld</h3></div>
            <div class="sk-inputs" id="sk-inputs">
              ${this.c.inputs.map(i => {
                const color = /aus|stop/i.test(i.label) || /^S0$/i.test(i.tag) ? 'red' : /ein|start|rechts|links|tipp/i.test(i.label) ? 'green' : '';
                return `<button class="sk-btn ${color}" data-tag="${esc(i.tag)}">
                  <div class="t">${esc(i.tag)}</div>
                  <div class="l">${esc(i.label || '')} · ${i.type === 'taster' ? 'Taster' : 'Schalter'}</div>
                </button>`;
              }).join('') || '<p class="muted small">Keine Betätigungselemente definiert.</p>'}
            </div>
            <p class="muted small" style="margin-top:10px">Taster gedrückt halten, Schalter rasten ein. Du kannst auch direkt auf die Kontakte im Plan klicken.</p>
          </div>
          <div class="card card-pad">
            <div class="card-head"><h3>Zustand</h3></div>
            <div class="sk-status" id="sk-status"></div>
            <div class="sk-warn hidden" id="sk-unstable" style="margin-top:8px">⚠ Schaltung schwingt (instabil) – prüfe die Verriegelungen.</div>
          </div>
          ${this.c.info ? `<div class="card card-pad"><div class="card-head"><h3>Funktion</h3></div><p class="small muted" style="line-height:1.6">${esc(this.c.info)}</p></div>` : ''}`;
        p.querySelectorAll('.sk-btn').forEach(b => {
          b.addEventListener('pointerdown', e => { e.preventDefault(); this.press(b.dataset.tag); });
          b.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); this.press(b.dataset.tag); } });
          b.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') this.releaseTaster(); });
          b.addEventListener('contextmenu', e => e.preventDefault());
        });
        this.updateInputButtons();
        this.updateStatus();
        return;
      }
      this.drawEditPanel(p);
    },

    updateInputButtons() {
      this.el.querySelectorAll('.sk-btn').forEach(b => b.classList.toggle('on', !!this.s.inputs[b.dataset.tag]));
    },

    updateStatus() {
      const box = this.el.querySelector('#sk-status');
      if (!box) return;
      const seen = new Set();
      const outs = this.c.rungs.map(r => r.out).filter(o => o.tag && !seen.has(o.tag) && seen.add(o.tag));
      box.innerHTML = outs.map(o => {
        const on = o.kind === 'lamp' ? !!this.s.coil[o.tag] : !!this.s.out[o.tag];
        const coilOn = !!this.s.coil[o.tag];
        let extra = '';
        if (o.kind.startsWith('timer')) extra = ` <span class="muted small">(Spule ${coilOn ? 'an' : 'aus'}, Kontakte ${on ? 'betätigt' : 'Ruhe'})</span>`;
        return `<div class="row"><span class="sk-led ${o.kind === 'lamp' ? 'lamp' : ''} ${on ? 'on' : ''}"></span><b>${esc(o.tag)}</b><span class="muted">${esc(o.label || '')}</span>${extra}</div>`;
      }).join('');
      this.el.querySelector('#sk-unstable')?.classList.toggle('hidden', !this.s.unstable);
    },

    /* ---------- Editor ---------- */
    tagOptions() {
      const tags = [...this.c.inputs.map(i => i.tag), ...this.c.rungs.filter(r => r.out.kind !== 'lamp').map(r => r.out.tag)];
      return [...new Set(tags.filter(Boolean))];
    },

    changed() {
      this.persist();
      this.dirty = true;
      this.drawPanel();
      this.tick(true);
    },

    drawEditPanel(p) {
      const sel = this.sel;
      let selHTML = '';
      const dl = `<datalist id="sk-tags">${this.tagOptions().map(t => `<option value="${esc(t)}">`).join('')}</datalist>`;

      if (sel && sel.type === 'contact') {
        const c = this.c.rungs[sel.r].blocks[sel.b][sel.br][sel.c];
        selHTML = `
          <div class="card card-pad">
            <div class="card-head"><h3>Kontakt in Strompfad ${sel.r + 1}</h3></div>
            <div class="form-fields">
              <div class="field half"><label>Betriebsmittel</label><input class="input" id="e-tag" list="sk-tags" value="${esc(c.tag)}"></div>
              <div class="field half"><label>Art</label><select class="input" id="e-no">
                <option value="1" ${c.no ? 'selected' : ''}>Schließer</option>
                <option value="0" ${!c.no ? 'selected' : ''}>Öffner</option></select></div>
            </div>
            <div class="btn-row" style="margin-top:12px">
              <button class="btn sm" data-op="series">${icon('plus')} In Reihe darunter</button>
              <button class="btn sm" data-op="parallel">${icon('plus')} Parallel dazu</button>
              <button class="btn sm" data-op="blockBelow">${icon('plus')} Neuer Abschnitt darunter</button>
              <button class="btn sm danger ghost" data-op="delContact">${icon('trash')} Entfernen</button>
            </div>
            ${dl}
          </div>`;
      } else if (sel && sel.type === 'out') {
        const o = this.c.rungs[sel.r].out;
        selHTML = `
          <div class="card card-pad">
            <div class="card-head"><h3>Verbraucher in Strompfad ${sel.r + 1}</h3></div>
            <div class="form-fields">
              <div class="field"><label>Typ</label><select class="input" id="e-kind">${OUT_KINDS.map(([k, l]) => `<option value="${k}" ${o.kind === k ? 'selected' : ''}>${l}</option>`).join('')}</select></div>
              <div class="field half"><label>Kennzeichnung</label><input class="input" id="e-otag" value="${esc(o.tag)}" placeholder="K1"></div>
              <div class="field half"><label>Beschreibung</label><input class="input" id="e-label" value="${esc(o.label || '')}" placeholder="z. B. Netzschütz"></div>
              ${o.kind.startsWith('timer') ? `<div class="field half"><label>Zeit (Sekunden)</label><input class="input" id="e-delay" type="number" min="0" step="0.5" value="${Number(o.delay) || 0}"></div>` : ''}
            </div>
            <div class="btn-row" style="margin-top:12px">
              <button class="btn sm" data-op="addContactEnd">${icon('plus')} Kontakt davor</button>
              <button class="btn sm danger ghost" data-op="delRung">${icon('trash')} Strompfad löschen</button>
            </div>
          </div>`;
      } else {
        selHTML = `<div class="card card-pad"><p class="muted small">Klicke im Plan auf einen <b>Kontakt</b> oder einen <b>Verbraucher</b> (Spule/Leuchte), um ihn zu bearbeiten.</p></div>`;
      }

      p.innerHTML = `
        ${selHTML}
        <div class="card card-pad">
          <div class="card-head"><h3>Strompfade</h3></div>
          <div class="btn-row">
            <button class="btn sm primary" data-op="addRung">${icon('plus')} Strompfad</button>
            <button class="btn sm" data-op="newEmpty">Alles leeren</button>
          </div>
        </div>
        <div class="card card-pad">
          <div class="card-head"><h3>Betätigungselemente</h3><button class="btn sm" data-op="addInput">${icon('plus')}</button></div>
          <div style="display:grid;gap:6px">
            <div class="input-row muted small"><span>Kennz.</span><span>Beschreibung</span><span>Art</span><span></span></div>
            ${this.c.inputs.map((i, idx) => `
              <div class="input-row" data-idx="${idx}">
                <input class="input" data-f="tag" value="${esc(i.tag)}">
                <input class="input" data-f="label" value="${esc(i.label || '')}">
                <select class="input" data-f="type"><option value="taster" ${i.type === 'taster' ? 'selected' : ''}>Taster</option><option value="schalter" ${i.type === 'schalter' ? 'selected' : ''}>Schalter</option></select>
                <button class="icon-btn" data-op="delInput" title="Entfernen">${icon('trash')}</button>
              </div>`).join('')}
          </div>
          <p class="muted small" style="margin-top:10px">Kontakte mit diesen Kennzeichnungen werden per Hand betätigt. Alle anderen Kontakte folgen der Spule mit gleichem Namen (z. B. K1).</p>
        </div>
        <div class="card card-pad">
          <div class="card-head"><h3>Beschreibung</h3></div>
          <textarea class="input" id="e-info" rows="3" placeholder="Was macht die Schaltung?">${esc(this.c.info || '')}</textarea>
        </div>`;

      // Bindungen: Auswahl
      const $ = s => p.querySelector(s);
      if (sel && sel.type === 'contact') {
        const c = this.c.rungs[sel.r].blocks[sel.b][sel.br][sel.c];
        $('#e-tag').addEventListener('input', e => { c.tag = e.target.value.trim().toUpperCase(); this.persist(); this.dirty = true; this.tick(true); });
        $('#e-tag').addEventListener('change', () => this.changed());
        $('#e-no').onchange = e => { c.no = e.target.value === '1'; this.changed(); };
      }
      if (sel && sel.type === 'out') {
        const o = this.c.rungs[sel.r].out;
        $('#e-kind').onchange = e => { o.kind = e.target.value; if (o.kind.startsWith('timer') && !o.delay) o.delay = 3; this.changed(); };
        $('#e-otag').addEventListener('input', e => { o.tag = e.target.value.trim().toUpperCase(); this.persist(); this.dirty = true; this.tick(true); });
        $('#e-label').addEventListener('input', e => { o.label = e.target.value; this.persist(); this.dirty = true; this.tick(true); });
        const dl = $('#e-delay');
        if (dl) dl.addEventListener('input', e => { o.delay = Number(e.target.value) || 0; this.persist(); this.dirty = true; this.tick(true); });
      }
      p.querySelectorAll('.input-row[data-idx]').forEach(row => {
        const i = this.c.inputs[+row.dataset.idx];
        row.querySelectorAll('[data-f]').forEach(inp => {
          const ev = inp.tagName === 'SELECT' ? 'change' : 'input';
          inp.addEventListener(ev, e => {
            let v = e.target.value;
            if (inp.dataset.f === 'tag') v = v.trim().toUpperCase();
            i[inp.dataset.f] = v;
            this.persist(); this.dirty = true; this.tick(true);
          });
        });
      });
      $('#e-info').addEventListener('input', e => { this.c.info = e.target.value; this.persist(); });
      p.querySelectorAll('[data-op]').forEach(b => b.onclick = () => this.op(b.dataset.op, b));
    },

    nextTag(prefix) {
      const used = new Set([...this.c.inputs.map(i => i.tag), ...this.c.rungs.map(r => r.out.tag)]);
      let n = prefix === 'S' ? 0 : 1;
      while (used.has(prefix + n)) n++;
      return prefix + n;
    },

    async op(name, btn) {
      const sel = this.sel;
      const rungs = this.c.rungs;
      const defTag = () => this.c.inputs[1]?.tag || this.c.inputs[0]?.tag || 'S1';
      switch (name) {
        case 'series': {
          const br = rungs[sel.r].blocks[sel.b][sel.br];
          br.splice(sel.c + 1, 0, { tag: defTag(), no: true });
          this.sel = { ...sel, c: sel.c + 1 };
          break;
        }
        case 'parallel': {
          const block = rungs[sel.r].blocks[sel.b];
          const cur = block[sel.br][sel.c];
          block.splice(sel.br + 1, 0, [{ tag: rungs[sel.r].out.tag && rungs[sel.r].out.kind !== 'lamp' ? rungs[sel.r].out.tag : cur.tag, no: true }]);
          this.sel = { ...sel, br: sel.br + 1, c: 0 };
          break;
        }
        case 'blockBelow': {
          rungs[sel.r].blocks.splice(sel.b + 1, 0, [[{ tag: defTag(), no: true }]]);
          this.sel = { type: 'contact', r: sel.r, b: sel.b + 1, br: 0, c: 0 };
          break;
        }
        case 'delContact': {
          const r = rungs[sel.r];
          const br = r.blocks[sel.b][sel.br];
          br.splice(sel.c, 1);
          if (!br.length) r.blocks[sel.b].splice(sel.br, 1);
          if (!r.blocks[sel.b].length) r.blocks.splice(sel.b, 1);
          this.sel = null;
          break;
        }
        case 'addContactEnd': {
          rungs[sel.r].blocks.push([[{ tag: defTag(), no: true }]]);
          this.sel = { type: 'contact', r: sel.r, b: rungs[sel.r].blocks.length - 1, br: 0, c: 0 };
          break;
        }
        case 'delRung':
          rungs.splice(sel.r, 1);
          this.sel = null;
          break;
        case 'addRung': {
          const tag = this.nextTag('K');
          rungs.push({ blocks: [[[{ tag: defTag(), no: true }]]], out: { kind: 'coil', tag, label: '' } });
          this.sel = { type: 'out', r: rungs.length - 1 };
          break;
        }
        case 'newEmpty':
          if (!await UI.confirm('Alle Strompfade entfernen?', 'Leeren')) return;
          this.c = fromPreset('leer');
          this.c.rungs = [];
          this.c.name = 'Eigene Schaltung';
          this.sel = null;
          break;
        case 'addInput':
          this.c.inputs.push({ tag: this.nextTag('S'), type: 'taster', label: '' });
          break;
        case 'delInput': {
          const idx = +btn.closest('.input-row').dataset.idx;
          this.c.inputs.splice(idx, 1);
          break;
        }
      }
      this.resetSim();
      this.changed();
    }
  };

  App.register('circuit', Sim);
})();
