(() => {
  const cfg = window.CARD_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const text = (v) => String(v ?? '').trim();
  const set = (id, value) => { const el = $(id); if (el) el.textContent = text(value); };
  const toast = (message) => {
    const el = $('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
  };

  set('cardLabel', cfg.label || 'NFC DIGITAL CARD');
  set('tradeTitle', cfg.tradeTitle || 'MASTER PAINTER & DECORATOR');
  set('fullName', cfg.fullName || 'Glen Coxon');
  set('experience', cfg.experience || 'Over 20 years experience.');
  set('tagline', cfg.tagline || 'Professional painter and decorator.');
  set('specialtyText', cfg.specialtyText || 'Restoration. Interiors. Exteriors.');
  set('styleText', cfg.styleText || 'Clean • Professional • Reliable');
  set('aboutText', cfg.aboutText || 'Clean NFC landing page.');

  const portrait = $('portrait');
  if (portrait && text(cfg.photo)) portrait.src = cfg.photo;

  const phoneDisplay = $('phoneDisplay');
  const callBtn = $('callBtn');
  const dial = text(cfg.phoneDial || '').replace(/[^\d+]/g, '');
  const shown = text(cfg.phoneDisplay || dial);
  if (phoneDisplay) {
    phoneDisplay.textContent = shown;
    phoneDisplay.href = dial ? `tel:${dial}` : '#';
  }
  if (callBtn) callBtn.href = dial ? `tel:${dial}` : '#';

  const tags = $('serviceTags');
  if (tags && Array.isArray(cfg.services)) {
    tags.innerHTML = '';
    cfg.services.forEach(service => {
      if (!text(service)) return;
      const span = document.createElement('span');
      span.textContent = service;
      tags.appendChild(span);
    });
  }

  const motionToggle = $('motionToggle');
  const cardVideo = $('cardVideo');
  if (motionToggle && cardVideo) {
    motionToggle.addEventListener('click', () => {
      if (cardVideo.paused) {
        cardVideo.play();
        motionToggle.textContent = 'Pause Motion';
        toast('Motion background resumed.');
      } else {
        cardVideo.pause();
        motionToggle.textContent = 'Play Motion';
        toast('Motion background paused.');
      }
    });
  }

  $('saveBtn')?.addEventListener('click', () => {
    const vc = cfg.vcard || {};
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${text(vc.lastName)};${text(vc.firstName)};;;`,
      `FN:${text(cfg.fullName || `${text(vc.firstName)} ${text(vc.lastName)}`)}`,
      vc.organization ? `ORG:${text(vc.organization)}` : '',
      vc.title ? `TITLE:${text(vc.title)}` : '',
      vc.phone ? `TEL;TYPE=CELL:${text(vc.phone)}` : '',
      vc.note ? `NOTE:${text(vc.note)}` : '',
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
    setTimeout(() => URL.revokeObjectURL(url), 20000);
    toast('Contact file downloaded.');
  });

  $('shareBtn')?.addEventListener('click', async () => {
    const shareData = { title: text(cfg.fullName || 'Business Card'), text: text(cfg.tradeTitle || ''), url: location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); return; } catch (e) {}
    }
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(location.href);
        toast('Card link copied.');
        return;
      } catch (e) {}
    }
    window.prompt('Copy this link:', location.href);
  });

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    cardVideo?.pause();
  }
})();
