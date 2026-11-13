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
