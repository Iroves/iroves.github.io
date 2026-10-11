'use strict';
const contact = window.CARD_CONTACT || {};
const phone = String(contact.phone || '').trim();
const instagram = String(contact.instagram || '').trim().replace(/^@/, '');
const name = String(contact.name || 'Iro').trim();
const nameEl = document.getElementById('name');
nameEl.replaceChildren(document.createTextNode(name));
const dot = document.createElement('span'); dot.textContent = '.'; nameEl.append(dot);
document.title = `${name} · Connect`;
function enable(id, href, detail) {
  const link = document.getElementById(id);
  link.href = href; link.removeAttribute('aria-disabled'); link.removeAttribute('tabindex');
  document.getElementById(`${id}-detail`).textContent = detail;
}
const phoneReady = /^\+?[0-9 ()-]{7,22}$/.test(phone);
const instagramReady = /^[A-Za-z0-9._]{1,30}$/.test(instagram);
if (phoneReady) enable('phone', `tel:${phone.replace(/[ ()-]/g, '')}`, phone);
if (instagramReady) {
  enable('instagram', `https://www.instagram.com/${encodeURIComponent(instagram)}/`, `@${instagram}`);
  document.getElementById('instagram').target = '_blank';
  document.getElementById('instagram').rel = 'noopener noreferrer';
}
const save = document.getElementById('save');
save.disabled = !phoneReady && !instagramReady;
const escapeVcard = value => value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r/g, '');
save.addEventListener('click', () => {
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${escapeVcard(name)}`, `N:${escapeVcard(name)};;;;`];
  if (phoneReady) lines.push(`TEL;TYPE=CELL:${phone.replace(/[ ()-]/g, '')}`);
  if (instagramReady) lines.push(`URL:https://www.instagram.com/${encodeURIComponent(instagram)}/`);
  lines.push('END:VCARD');
  const url = URL.createObjectURL(new Blob([lines.join('\r\n') + '\r\n'], {type:'text/vcard;charset=utf-8'}));
  const a = document.createElement('a'); a.href = url; a.download = 'Iro.vcf';
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  document.getElementById('status').textContent = 'Open the downloaded contact to save it.';
});
document.getElementById('motion').addEventListener('click', event => {
  const paused = document.querySelector('.card').classList.toggle('paused');
  const button = event.currentTarget;
  button.setAttribute('aria-pressed', String(paused));
  button.setAttribute('aria-label', paused ? 'Resume moving gold lines' : 'Pause moving gold lines');
  button.title = button.getAttribute('aria-label');
  button.querySelector('path').setAttribute('d', paused ? 'M9 6l8 6-8 6Z' : 'M9 7v10M15 7v10');
});
