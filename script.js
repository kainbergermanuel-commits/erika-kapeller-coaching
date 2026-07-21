(() => {
  const toggle = document.querySelector('[data-mobile-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', () => setOpen(menu.hidden));
  menu.querySelectorAll('[data-close-nav]').forEach((el) => {
    el.addEventListener('click', () => setOpen(false));
  });
})();
