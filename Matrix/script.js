(() => {
  const video = document.getElementById('motion-video');
  video.autoplay = false; // The script controls playback after initialization.
  const toggle = document.getElementById('motion-toggle');
  const card = video.closest('.motion-card');
  const choices = [...document.querySelectorAll('[data-style]')];
  const caption = document.getElementById('style-caption');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const styles = {
    'digital-rain': 'Cascading symbols, soft glow, classic green code.',
    'code-tunnel': 'Glowing symbols rushing through a deep perspective tunnel.'
  };
  let userPaused = reduced.matches;
  let manualMotion = false;
  let visible = true;
  let request = 0;
  function label() {
    const playing = !video.paused && !video.classList.contains('is-still');
    toggle.textContent = playing ? 'Pause motion' : 'Play motion';
    toggle.setAttribute('aria-label', playing ? 'Pause animation' : 'Play animation');
  }
  function stop() { request++; video.pause(); label(); }
  async function play() {
    if (userPaused || !visible || document.hidden || (reduced.matches && !manualMotion)) return;
    const ticket = ++request;
    try {
      await video.play();
      if (ticket === request) video.classList.remove('is-still');
    } catch (_) {
      if (ticket === request) video.classList.add('is-still');
    }
    label();
  }
  toggle.addEventListener('click', () => {
    if (!video.paused) { userPaused = true; stop(); }
    else {
      userPaused = false;
      manualMotion = true;
      video.classList.add('motion-requested');
      play();
    }
  });
  choices.forEach(button => button.addEventListener('click', () => {
    const style = button.dataset.style;
    if (!Object.prototype.hasOwnProperty.call(styles, style)) return;
    stop();
    choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    video.poster = 'assets/' + style + '-poster.jpg';
    card.style.backgroundImage = 'url("' + video.poster + '")';
    video.src = 'assets/' + style + '.mp4';
    video.load();
    caption.textContent = styles[style];
    if (userPaused || reduced.matches && !manualMotion) video.classList.add('is-still');
    else play();
    label();
  }));
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  video.addEventListener('error', () => { video.classList.add('is-still'); stop(); });
  reduced.addEventListener('change', () => {
    userPaused = reduced.matches;
    manualMotion = false;
    video.classList.remove('motion-requested');
    if (reduced.matches) { video.classList.add('is-still'); stop(); }
    else play();
  });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : play());
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play(); else stop();
    }, {threshold: .05}).observe(card);
  }
  if (reduced.matches) { video.classList.add('is-still'); stop(); }
  else play();
})();
