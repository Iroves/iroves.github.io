/* Static GitHub Pages NFC card — no backend needed. */
(() => {
  'use strict';
  const data = window.CARD_CONFIG || {};
  const el = id => document.getElementById(id);
  const trim = value => String(value ?? '').trim();
  const phone = trim(data.phoneDial).replace(/[^+\d]/g, '');
  const vCardEscape = value => trim(value).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
  let toastTimer;
  const notify = message => {
    const target = el('toast');
    target.textContent = message;
    target.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => target.classList.remove('show'), 2800);
  };

  if (trim(data.fullName)) {
    const [first, ...rest] = trim(data.fullName).split(/\s+/);
    const title = el('fullName');
    title.replaceChildren(document.createTextNode(first + ' '));
    const surname = document.createElement('em');
    surname.textContent = rest.join(' ');
    title.appendChild(surname);
    document.title = trim(data.fullName) + ' · ' + trim(data.tradeTitle);
  }
  if (trim(data.tradeTitle)) el('tradeTitle').textContent = data.tradeTitle;
  if (trim(data.experienceYears)) el('experience').textContent = data.experienceYears;
  if (trim(data.photo)) el('portrait').src = data.photo;

  const phoneNumber = trim(data.phoneDisplay) || phone;
  if (phone) {
    el('callBtn').href = 'tel:' + phone;
    el('messageBtn').href = 'sms:' + phone; // Opens the phone's native SMS app.
    el('callText').textContent = 'Call ' + phoneNumber;
  } else {
    el('callBtn').hidden = true;
    el('messageBtn').hidden = true;
  }
  if (Array.isArray(data.services)) {
    const services = data.services.map(trim).filter(Boolean);
    const strip = document.querySelector('.service-inline');
    strip.replaceChildren();
    services.forEach((service, index) => {
      if (index) { const dot = document.createElement('b'); dot.textContent = '·'; strip.append(dot); }
      const item = document.createElement('span'); item.textContent = service.toUpperCase(); strip.append(item);
    });
    document.querySelector('.subline > span').textContent = services.join(' • ').toUpperCase();
  }

  el('saveContact').addEventListener('click', () => {
    const name = trim(data.fullName) || 'New Contact';
    const names = name.split(/\s+/);
    const first = names.shift(), last = names.join(' ');
    const lines = [
      'BEGIN:VCARD', 'VERSION:3.0',
      `N:${vCardEscape(last)};${vCardEscape(first)};;;`,
      `FN:${vCardEscape(name)}`,
      `TITLE:${vCardEscape(data.tradeTitle)}`,
      phone ? 'TEL;TYPE=CELL:' + phone : '',
      'NOTE:Over 20 years experience. Restoration. Interiors. Exteriors.',
      'END:VCARD'
    ].filter(Boolean);
    const blob = new Blob([lines.join('\r\n') + '\r\n'], {type: 'text/vcard;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name.replace(/[^a-z0-9_-]+/gi, '_') + '.vcf';
    document.body.append(link);
    link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    notify('Contact file ready to save.');
  });

  el('shareCard').addEventListener('click', async () => {
    const url = location.href.split('#')[0];
    if (navigator.share) {
      try { await navigator.share({title: document.title, url}); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(url); notify('Card link copied.'); return; }
      catch { /* show manual copy fallback */ }
    }
    window.prompt('Copy this card link:', url);
  });
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) el('motionVideo').pause();
})();
