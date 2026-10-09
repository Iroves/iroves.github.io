(() => {
  'use strict';
  document.getElementById('year').textContent = new Date().getFullYear();
  const film = document.getElementById('beachFilm');
  const toggle = document.getElementById('motionToggle');
  const iconPause = document.getElementById('motionIconPause');
  const iconPlay = document.getElementById('motionIconPlay');
  const label = toggle.querySelector('.motion-toggle__label');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !reducedMotion.matches;

  function setMotion(on) {
    playing = on;
    if (on) {
      const promise = film.play();
      if (promise && typeof promise.catch === 'function') promise.catch(() => setMotion(false));
    } else {
      film.pause();
    }
    toggle.setAttribute('aria-pressed', String(!on));
    toggle.setAttribute('aria-label', on ? 'Pause beach animation' : 'Play beach animation');
    toggle.title = on ? 'Pause moving beach' : 'Play moving beach';
    iconPause.hidden = !on;
    iconPlay.hidden = on;
    label.textContent = on ? 'MOTION ON' : 'MOTION OFF';
  }
  toggle.addEventListener('click', () => setMotion(!playing));
  setMotion(playing);
})();
