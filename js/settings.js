/* Einstellungen: Design, Sicherung, Zurücksetzen */
App.register('settings', {
  title: 'Einstellungen',

  render(el) {
    const theme = Store.get('theme', 'system');
    let bytes = 0;
    Store.keys().forEach(k => { try { bytes += (localStorage.getItem(PREFIX + k) || '').length; } catch (e) { /* */ } });

    el.innerHTML = `
      <div class="page-head"><h1>Einstellungen</h1></div>
      <div class="grid grid-2">
        <div class="card card-pad">
          <div class="card-head"><h2>Darstellung</h2></div>
          <div class="seg" id="theme-seg">
            <button data-t="system">System</button>
            <button data-t="light">Hell</button>
            <button data-t="dark">Dunkel</button>
          </div>
        </div>
        <div class="card card-pad">
          <div class="card-head"><h2>Datensicherung</h2></div>
          <p class="muted small" style="margin-bottom:12px">
            Alle Daten werden nur lokal in diesem Browser gespeichert (${(bytes / 1024).toFixed(1)} KB).
            Erstelle regelmäßig eine Sicherung – damit kannst du deine Daten auch auf ein anderes Gerät übertragen.
          </p>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn primary" data-act="export">${icon('download')} Sicherung herunterladen</button>
            <label class="btn">${icon('upload')} Sicherung einspielen<input type="file" accept="application/json,.json" id="imp" hidden></label>
          </div>
        </div>
        <div class="card card-pad">
          <div class="card-head"><h2>Zurücksetzen</h2></div>
          <p class="muted small" style="margin-bottom:12px">Löscht alle Notizen, Termine, Pläne, Boards, Karteikarten und Schaltungen.</p>
          <button class="btn danger" data-act="reset">${icon('trash')} Alle Daten löschen</button>
        </div>
      </div>`;

    el.querySelectorAll('[data-t]').forEach(b => {
      b.classList.toggle('active', b.dataset.t === theme);
      b.onclick = () => { Theme.set(b.dataset.t); this.render(el); };
    });

    el.querySelector('[data-act=export]').onclick = () => {
      const blob = new Blob([JSON.stringify(Store.exportAll(), null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `allrounder-sicherung-${D.today()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };

    el.querySelector('#imp').onchange = async e => {
      const f = e.target.files[0];
      if (!f) return;
      try {
        const obj = JSON.parse(await f.text());
        if (!await UI.confirm('Sicherung einspielen? Die aktuellen Daten werden dabei ersetzt.', 'Einspielen')) return;
        Store.importAll(obj);
        Theme.apply();
        UI.toast('Sicherung eingespielt');
        this.render(el);
      } catch (err) {
        UI.toast('Datei konnte nicht gelesen werden: ' + err.message);
      }
      e.target.value = '';
    };

    el.querySelector('[data-act=reset]').onclick = async () => {
      if (!await UI.confirm('Wirklich ALLE Daten unwiderruflich löschen?', 'Alles löschen')) return;
      Store.clear();
      Theme.apply();
      UI.toast('Alle Daten gelöscht');
      this.render(el);
    };
  }
});
