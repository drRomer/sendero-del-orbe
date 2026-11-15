// Versión web: activa funciones de PWA en el juego y registra el service worker
// (juego sin conexión + instalable). Se carga antes del juego.
window.SDO_WEB = 1;
(function () {
  var h = location.hostname;
  var secure = location.protocol === 'https:' || h === 'localhost' || h === '127.0.0.1';
  if (!('serviceWorker' in navigator) || !secure) return;
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).catch(function () {});
  });
})();
