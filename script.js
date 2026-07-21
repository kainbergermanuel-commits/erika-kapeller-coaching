(() => {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const drawer = document.querySelector('[data-mobile-menu]');
  const overlay = document.querySelector('[data-mobile-overlay]');
  if (!toggle || !drawer || !overlay) return;

  function setOpen(open) {
    drawer.classList.toggle('is-open', open);
    overlay.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  }

  toggle.addEventListener('click', () => setOpen(!drawer.classList.contains('is-open')));
  overlay.addEventListener('click', () => setOpen(false));
  drawer.querySelectorAll('[data-close-nav]').forEach((el) => {
    el.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
})();
