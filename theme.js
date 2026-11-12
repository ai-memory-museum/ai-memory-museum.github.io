(() => {
  const KEY = 'museum-theme';
  const root = document.documentElement;
  const btn = document.getElementById('themeBtn');
  const ru = root.lang !== 'en';
  const SUN = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  const MOON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z"/></svg>';
  const paint = () => {
    const dark = root.dataset.theme === 'dark';
    btn.innerHTML = dark ? SUN : MOON;
    btn.setAttribute('aria-label', dark ? (ru ? 'Светлая тема' : 'Light theme') : ru ? 'Тёмная тема' : 'Dark theme');
    btn.title = btn.getAttribute('aria-label');
  };
  btn.addEventListener('click', () => {
    if (root.dataset.theme === 'dark') delete root.dataset.theme;
    else root.dataset.theme = 'dark';
    try {
      localStorage.setItem(KEY, root.dataset.theme || 'light');
    } catch {}
    paint();
  });
  paint();
})();
