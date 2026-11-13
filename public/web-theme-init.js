// Se ejecuta antes del bundle para evitar un destello del tema equivocado.
(function () {
  var theme = 'dark';
  try {
    var saved = localStorage.getItem('fuentehr-web-theme');
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch (_) { /* La web sigue funcionando si el almacenamiento está bloqueado. */ }
  document.documentElement.setAttribute('data-web-theme', theme);
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', getComputedStyle(document.documentElement).backgroundColor);
})();
