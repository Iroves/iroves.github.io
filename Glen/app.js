/* No account or server is necessary. Upload to GitHub Pages and point the NFC tag at the URL. */
(() => {
  'use strict';
  const cfg = window.CARD_CONFIG || {};
  const $ = id => document.getElementById(id);
  const str = v => String(v ?? '').trim();
  const dial = str(cfg.phoneDial).replace(/[^+\d]/g, '');
  const escaped = v => str(v).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
  let toastTimer;
  function toast(message) {
    const box = $('toast'); if (!box) return;
    box.textContent = message;
    box.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => box.classList.remove('show'), 2800);
  }
  if (str(cfg.fullName)) {
    $('fullName').textContent = cfg.fullName;
    document.title = `${cfg.fullName} · ${str(cfg.tradeTitle)}`;
  }
  if (str(cfg.tradeTitle)) $('tradeTitle').textContent = cfg.tradeTitle;
  if (str(cfg.experienceYears)) $('experience').textContent = cfg.experienceYears;
  if (str(cfg.photo)) $('portrait').src = cfg.photo;
  if (Array.isArray(cfg.services)) {
    const services = cfg.services.map(str).filter(Boolean);
    $('servicesLine').replaceChildren();
    services.forEach((service, i) => {
      if (i) { const dot = document.createElement('i'); dot.textContent = '•'; $('servicesLine').append(dot); }
      const s = document.createElement('span'); s.textContent = service.toUpperCase(); $('servicesLine').append(s);
    });
  }
  const pretty = str(cfg.phoneDisplay) || dial;
  if (dial) {
    $('callBtn').href = `tel:${dial}`;
    $('messageBtn').href = `sms:${dial}`;
    $('callText').textContent = `Call ${pretty}`;
  } else {
    $('callBtn').hidden = true;
    $('messageBtn').hidden = true;
  }
  $('saveContact').addEventListener('click', () => {
    const name = str(cfg.fullName) || 'New Contact';
    const names = name.split(/\s+/); const first = names.shift(), last = names.join(' ');
    const rows = ['BEGIN:VCARD','VERSION:3.0',`N:${escaped(last)};${escaped(first)};;;`,
      `FN:${escaped(name)}`,`TITLE:${escaped(cfg.tradeTitle)}`,
      dial ? `TEL;TYPE=CELL:${dial}` : '',
      `NOTE:${escaped('Over 20 years experience. Restoration. Interiors. Exteriors.')}`,'END:VCARD'].filter(Boolean);
    const blob = new Blob([rows.join('\r\n') + '\r\n'], {type:'text/vcard;charset=utf-8'});
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = href;
    a.download = name.replace(/[^a-z0-9_-]+/gi,'_') + '.vcf';
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 30000);
    toast('Contact file ready to save.');
  });
  $('shareCard').addEventListener('click', async () => {
    const url = location.href.split('#')[0];
    if (navigator.share) {
      try { await navigator.share({title:document.title,url}); return; }
      catch (e) { if (e.name === 'AbortError') return; }
    }
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(url); toast('Card link copied.'); return; }
      catch { /* fall back */ }
    }
    window.prompt('Copy this link:', url);
  });
  const vid = $('motionVideo');
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) vid.pause();
})();
