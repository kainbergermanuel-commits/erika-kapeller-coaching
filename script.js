(() => {
  /* ---- Mobile drawer navigation ---- */
  const toggle = document.querySelector('[data-mobile-toggle]');
  const drawer = document.querySelector('[data-mobile-menu]');
  const overlay = document.querySelector('[data-mobile-overlay]');

  if (toggle && drawer && overlay) {
    const setOpen = (open) => {
      drawer.classList.toggle('is-open', open);
      overlay.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
    };

    toggle.addEventListener('click', () => setOpen(!drawer.classList.contains('is-open')));
    overlay.addEventListener('click', () => setOpen(false));
    drawer.querySelectorAll('[data-close-nav]').forEach((el) => {
      el.addEventListener('click', () => setOpen(false));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  /* ---- Active navigation state ---- */
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer-links a').forEach((a) => {
    if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
  });

  /* ---- Contact form (client-side confirmation) ---- */
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const success = document.querySelector('[data-form-success]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      // Die Seite hat keinen Server: Wir öffnen das Mailprogramm mit dem fertigen Text.
      const wert = (n) => (form.elements[n] ? form.elements[n].value.trim() : '');
      const betreff = 'Anfrage: ' + wert('thema');
      const text = wert('nachricht') + '\n\n' + wert('name') + '\n' + wert('email');
      window.location.href = 'mailto:mail@erikakapeller.com?subject=' + encodeURIComponent(betreff)
        + '&body=' + encodeURIComponent(text);
      form.hidden = true;
      if (success) {
        success.classList.add('is-visible');
        success.setAttribute('tabindex', '-1');
        success.focus();
      }
    });
  }
})();

// Vorübergehend: Hinweis-Pille auf das Änderungsprotokoll (nach der Abnahme löschen).
(function () {
  if (/aenderungen\.html$/.test(location.pathname)) return;
  var a = document.createElement('a');
  a.href = 'aenderungen.html';
  a.className = 'pruef-pille';
  a.setAttribute('data-pruef', '');
  a.textContent = 'Überarbeitung 11/2026 · Änderungen ansehen';
  document.body.appendChild(a);
})();

// Stimmen: Filter nach Angebot
(function () {
  var chips = document.querySelectorAll('.filter-chip');
  if (!chips.length) return;
  var karten = document.querySelectorAll('.testimonials-cols .testimonial-card');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      chips.forEach(function (c) {
        var an = c === chip;
        c.classList.toggle('is-aktiv', an);
        c.setAttribute('aria-pressed', an ? 'true' : 'false');
      });
      karten.forEach(function (k) {
        var zeigen = f === 'alle' || k.getAttribute('data-kat') === f;
        k.hidden = !zeigen;
        k.classList.remove('einblenden');
        if (zeigen) { void k.offsetWidth; k.classList.add('einblenden'); }
      });
    });
  });
})();

// Begriffe mit Erklärung: Hover, Fokus oder Antippen zeigt den Tooltip.
// Die Tooltips wandern an <body>, damit kein Elternelement (Spalten, Karten mit
// transform oder backdrop-filter) ihre feste Position verfälscht.
(function () {
  var begriffe = Array.prototype.slice.call(document.querySelectorAll('.begriff'));
  if (!begriffe.length) return;
  var paare = begriffe.map(function (b) {
    var tip = b.querySelector('.begriff-tip');
    document.body.appendChild(tip);
    return { wort: b.querySelector('.begriff-wort'), tip: tip };
  });
  var offen = null, startY = 0;

  function schliessen() {
    if (offen) offen.tip.classList.remove('is-offen');
    offen = null;
  }
  function zeigen(p) {
    if (offen && offen !== p) schliessen();
    var tip = p.tip;
    // Bei umbrechenden Begriffen an der ersten Zeile ausrichten
    var r = p.wort.getClientRects()[0] || p.wort.getBoundingClientRect();
    tip.classList.add('is-offen');
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var mitte = r.left + r.width / 2;
    var links = Math.max(12, Math.min(mitte - w / 2, window.innerWidth - w - 12));
    var oben = r.top - h - 10, unten = oben < 80;
    if (unten) oben = r.bottom + 10;
    tip.classList.toggle('unten', unten);
    tip.style.left = links + 'px';
    tip.style.top = oben + 'px';
    tip.style.setProperty('--pfeil-x', Math.max(14, Math.min(w - 14, mitte - links)) + 'px');
    offen = p; startY = window.scrollY;
  }
  paare.forEach(function (p) {
    p.wort.addEventListener('mouseenter', function () { zeigen(p); });
    p.wort.addEventListener('mouseleave', function () { if (document.activeElement !== p.wort && offen === p) schliessen(); });
    p.wort.addEventListener('focus', function () { zeigen(p); });
    p.wort.addEventListener('blur', function () { if (offen === p) schliessen(); });
    p.wort.addEventListener('click', function (e) {
      e.stopPropagation();
      if (offen === p && e.pointerType !== 'mouse') schliessen(); else zeigen(p);
    });
    p.wort.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); offen === p ? schliessen() : zeigen(p); }
    });
  });
  document.addEventListener('click', schliessen);
  window.addEventListener('resize', schliessen);
  // Erst bei spürbarem Scrollen schließen (kleine Ruckler beim Antippen ignorieren)
  window.addEventListener('scroll', function () {
    if (offen && Math.abs(window.scrollY - startY) > 40) schliessen();
  }, { passive: true });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && offen) { var w = offen.wort; schliessen(); w.blur(); }
  });
})();

// Vorübergehend: Farbwelt-Umschalter zum Vergleichen (nach der Entscheidung löschen).
// Die Wahl bleibt im Browser gespeichert; ?farbe=salbei in der Adresse wählt direkt.
(function () {
  var farben = [
    ['orange', 'Orange', '#d4692a', 'aktuell'],
    ['terrakotta', 'Terrakotta', '#c2673f', 'vorher'],
    ['salbei', 'Salbei', '#6b8a6e', ''],
    ['rosenholz', 'Rosenholz', '#a86c72', ''],
    ['taubenblau', 'Taubenblau', '#5d7d92', ''],
    ['lavendel', 'Lavendel', '#85709a', ''],
    ['honig', 'Honig', '#a9813e', '']
  ];
  var root = document.documentElement;
  function lesen() { try { return localStorage.getItem('farbwelt'); } catch (e) { return null; } }
  function merken(k) { try { localStorage.setItem('farbwelt', k); } catch (e) {} }
  function setzen(k) {
    if (k === 'orange') root.removeAttribute('data-farbe'); else root.setAttribute('data-farbe', k);
    merken(k);
    document.querySelectorAll('.farbwahl-option').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-farbe') === k ? 'true' : 'false');
    });
  }
  var ausUrl = /[?&]farbe=([a-z]+)/.exec(location.search);
  var start = (ausUrl && ausUrl[1]) || lesen() || 'orange';
  if (!farben.some(function (f) { return f[0] === start; })) start = 'orange';

  var box = document.createElement('div');
  box.className = 'farbwahl';
  box.setAttribute('data-pruef', '');
  box.innerHTML = '<button type="button" class="farbwahl-knopf" aria-expanded="false">'
    + '<span class="farbwahl-punkte" aria-hidden="true">' + farben.slice(0, 5).map(function (f) { return '<i style="background:' + f[2] + '"></i>'; }).join('') + '</span>Farbwelt</button>'
    + '<div class="farbwahl-liste" role="group" aria-label="Farbwelt auswählen" hidden>'
    + '<p class="farbwahl-titel">Farbwelt zum Vergleichen</p>'
    + farben.map(function (f) {
        return '<button type="button" class="farbwahl-option" data-farbe="' + f[0] + '" aria-pressed="false">'
          + '<i style="background:' + f[2] + '"></i><span>' + f[1] + '</span>' + (f[3] ? '<small>' + f[3] + '</small>' : '') + '</button>';
      }).join('')
    + '<p class="farbwahl-hinweis">Nur zur Ansicht. Hintergründe bleiben gleich, es ändert sich die Akzentfarbe.</p></div>';
  document.body.appendChild(box);
  var knopf = box.querySelector('.farbwahl-knopf'), liste = box.querySelector('.farbwahl-liste');
  knopf.addEventListener('click', function (e) {
    e.stopPropagation();
    var auf = liste.hidden;
    liste.hidden = !auf;
    knopf.setAttribute('aria-expanded', auf ? 'true' : 'false');
  });
  liste.addEventListener('click', function (e) {
    e.stopPropagation();
    var b = e.target.closest('.farbwahl-option');
    if (b) setzen(b.getAttribute('data-farbe'));
  });
  document.addEventListener('click', function () { liste.hidden = true; knopf.setAttribute('aria-expanded', 'false'); });
  setzen(start);
})();
