// Applies the theme before first paint: a saved choice wins, a first visit follows
// prefers-color-scheme, otherwise dark. Keep the storage key in sync with src/lib/theme.ts.
// Loaded as a small blocking file (not inline) so the Content-Security-Policy can stay strict.
(function () {
  var theme = 'dark';
  try {
    var saved = localStorage.getItem('saracodes-theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
    else if (window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'light';
  } catch (e) {
    // Storage blocked: keep the default.
  }
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'light') {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', '#FFFFFF');
  }
})();
