(() => {
  const cfg = window.CARD_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const text = (value) => String(value ?? '').trim();
  const setText = (id, value) => { const el = $(id); if (el) el.textContent = text(value); };
  const showToast = (message) => {
    const toast = $('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  setText('brandChip', cfg.brandChip || 'MASTER PAINTER & DECORATOR');
  setText('fullName', cfg.fullName || 'Glen Coxon');
  setText('subtitle', cfg.subtitle || 'Master Painter & Decorator');
  setText('perfectionist', cfg.perfectionist || 'Perfectionist');
  setText('summary', cfg.summary || 'Professional painting services.');
  setText('serviceLine', cfg.serviceLine || 'Restoration • Interiors • Exteriors');
  setText('aboutText', cfg.aboutText || 'Professional digital business card.');

  const portrait = $('portrait');
  if (portrait && text(cfg.photo)) portrait.src = cfg.photo;

  const display = text(cfg.phoneDisplay || '');
  const dial = text(cfg.phoneDial || '').replace(/[^\d+]/g, '');
  const phoneHref = dial ? `tel:${dial}` : '#';
  const phoneLink = $('phoneLink');
  const callButton = $('callButton');
  if (phoneLink) {
    phoneLink.textContent = display || dial;
    phoneLink.href = phoneHref;
  }
  if (callButton) {
    callButton.textContent = display ? `Call ${display}` : 'Call now';
    callButton.href = phoneHref;
  }

  const pillWrap = $('servicePills');
  const listWrap = $('serviceList');
  if (Array.isArray(cfg.services)) {
    if (pillWrap) {
      pillWrap.innerHTML = '';
      cfg.services.forEach((service) => {
        if (!text(service)) return;
        const span = document.createElement('span');
        span.textContent = service.replace(/ work$/i, '');
        pillWrap.appendChild(span);
      });
    }
    if (listWrap) {
      listWrap.innerHTML = '';
      cfg.services.forEach((service) => {
        if (!text(service)) return;
        const li = document.createElement('li');
        li.textContent = service;
        listWrap.appendChild(li);
      });
    }
  }

  const motionToggle = $('motionToggle');
  const cardVideo = $('cardVideo');
  if (motionToggle && cardVideo) {
    motionToggle.addEventListener('click', () => {
      if (cardVideo.paused) {
        cardVideo.play();
        motionToggle.textContent = 'Pause motion';
        showToast('Motion resumed.');
      } else {
        cardVideo.pause();
        motionToggle.textContent = 'Play motion';
        showToast('Motion paused.');
      }
    });
  }

  $('saveContact')?.addEventListener('click', () => {
    const v = cfg.vcard || {};
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${text(v.lastName)};${text(v.firstName)};;;`,
      `FN:${text(cfg.fullName || `${text(v.firstName)} ${text(v.lastName)}`)}`,
      v.title ? `TITLE:${text(v.title)}` : '',
      v.phone ? `TEL;TYPE=CELL:${text(v.phone)}` : '',
      v.note ? `NOTE:${text(v.note)}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([lines + '\r\n'], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(cfg.fullName || 'contact').replace(/[^a-z0-9]+/gi, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    showToast('Contact file downloaded.');
  });

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    cardVideo?.pause();
  }
})();
