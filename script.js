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
// Er ist fest über der Seite positioniert, damit ihn keine Spalte abschneidet.
(function () {
  var begriffe = document.querySelectorAll('.begriff');
  if (!begriffe.length) return;
  function zeigen(b) {
    begriffe.forEach(function (x) { if (x !== b) x.classList.remove('offen'); });
    var tip = b.querySelector('.begriff-tip');
    var wort = b.querySelector('.begriff-wort').getBoundingClientRect();
    b.classList.add('offen');
    startY = window.scrollY;
    var w = tip.offsetWidth, h = tip.offsetHeight;
    var mitte = wort.left + wort.width / 2;
    var links = Math.max(12, Math.min(mitte - w / 2, window.innerWidth - w - 12));
    var oben = wort.top - h - 10, unten = oben < 80;
    if (unten) oben = wort.bottom + 10;
    tip.classList.toggle('unten', unten);
    tip.style.left = links + 'px';
    tip.style.top = oben + 'px';
    tip.style.setProperty('--pfeil-x', (mitte - links) + 'px');
  }
  function alleZu() { begriffe.forEach(function (x) { x.classList.remove('offen'); }); }
  begriffe.forEach(function (b) {
    var wort = b.querySelector('.begriff-wort');
    b.addEventListener('mouseenter', function () { zeigen(b); });
    b.addEventListener('mouseleave', function () { if (document.activeElement !== wort) b.classList.remove('offen'); });
    wort.addEventListener('focus', function () { zeigen(b); });
    wort.addEventListener('blur', function () { b.classList.remove('offen'); });
    wort.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.classList.contains('offen') ? b.classList.remove('offen') : zeigen(b); }
    });
    wort.addEventListener('click', function (e) {
      e.stopPropagation();
      if (b.classList.contains('offen') && e.pointerType !== 'mouse') b.classList.remove('offen'); else zeigen(b);
    });
  });
  document.addEventListener('click', alleZu);
  // Erst bei spürbarem Scrollen schließen (kleine Ruckler beim Antippen ignorieren)
  var startY = null;
  window.addEventListener('scroll', function () {
    var offen = document.querySelector('.begriff.offen');
    if (!offen) { startY = null; return; }
    if (startY === null) startY = window.scrollY;
    if (Math.abs(window.scrollY - startY) > 40) { alleZu(); startY = null; }
  }, { passive: true });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { alleZu(); if (document.activeElement) document.activeElement.blur(); } });
})();
