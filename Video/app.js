/* Reusable contact-card logic. Edit config.js, not this file, for each customer. */
(() => {
  'use strict';
  const data = window.CARD_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const text = (value) => String(value ?? '').trim();
  const setText = (id, value) => { if ($(id)) $(id).textContent = text(value); };
  const setOptional = (id, value) => {
    const item = $(id);
    if (!item) return;
    item.hidden = !text(value);
    item.textContent = text(value);
  };
  const icon = (name) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'svg-icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `#icon-${name}`);
    svg.appendChild(use);
    return svg;
  };
  const httpUrl = (url) => {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : '';
    } catch { return ''; }
  };
  const number = (value) => text(value).replace(/[^+\d]/g, '');
  const escapeVCard = (value) => text(value)
    .replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

  setText('fullName', data.name || 'Your Name');
  setOptional('credentials', data.credentials);
  setOptional('jobTitle', data.jobTitle);
  setOptional('organization', data.organization);
  setOptional('bio', data.bio);
  setText('cardBrand', data.label || 'DIGITAL BUSINESS CARD');
  setText('introText', data.greeting || 'NICE TO MEET YOU');
  setText('footerLabel', data.footer || 'Tap. Connect. Remember.');
  document.title = `${text(data.name || 'Digital Business Card')} | Digital Business Card`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', `Connect with ${text(data.name || 'this contact')}: call, email or save their details.`);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', text(data.name || 'Digital Business Card'));

  if (text(data.photo)) {
    $('avatar').src = text(data.photo);
  }
  $('avatar').alt = `Profile photo of ${text(data.name || 'the card owner')}`;

  // New row shown ONLY when supplied in config.js; values are always visible.
  const list = $('contactList');
  const addRow = (label, value, href, iconId) => {
    if (!text(value) || !text(href)) return;
    const a = document.createElement('a');
    a.className = 'contact-row';
    a.href = href;
    if (/^https?:/.test(href)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    const ico = document.createElement('span'); ico.className = 'contact-icon'; ico.appendChild(icon(iconId));
    const lines = document.createElement('span'); lines.className = 'contact-text';
    const title = document.createElement('span'); title.className = 'contact-label'; title.textContent = label;
    const val = document.createElement('span'); val.className = 'contact-value'; val.textContent = value;
    lines.append(title, val);
    const arrow = icon('arrow'); arrow.classList.add('contact-arrow');
    a.append(ico, lines, arrow);
    list.appendChild(a);
  };
  const office = data.telephone || {};
  const mobile = data.mobile || {};
  const fax = data.fax || {};
  const officeNumber = number(office.dial);
  const mobileNumber = number(mobile.dial);
  const faxNumber = number(fax.dial);
  addRow('Telephone', office.display, officeNumber ? 'tel:' + officeNumber : '', 'phone');
  addRow('Mobile', mobile.display, mobileNumber ? 'tel:' + mobileNumber : '', 'phone');
  addRow('Fax', fax.display, faxNumber ? 'tel:' + faxNumber : '', 'fax');
  const email = text(data.email);
  if (email) addRow('Email', email, 'mailto:' + encodeURIComponent(email).replace(/%40/g, '@'), 'mail');
  const website = httpUrl(data.website || '');
  if (website) addRow('Website', website.replace(/^https?:\/\//, '').replace(/\/$/, ''), website, 'globe');
  const mapUrl = httpUrl(data.mapUrl || '');
  if (mapUrl && text(data.address)) addRow('Location', text(data.address), mapUrl, 'pin');

  // Quick actions are only shown when corresponding data exists.
  const callButton = $('callButton');
  const callNumber = mobileNumber || officeNumber;
  if (callNumber) callButton.href = 'tel:' + callNumber;
  else callButton.hidden = true;
  const emailButton = $('emailButton');
  if (email) emailButton.href = 'mailto:' + encodeURIComponent(email).replace(/%40/g, '@');
  else emailButton.hidden = true;
  if (!email || !callNumber) document.querySelector('.cta-section').style.gridTemplateColumns = '1fr';

  const socials = data.socials || {};
  const socialContainer = $('socialList');
  for (const [name, url] of Object.entries(socials)) {
    const safe = httpUrl(url);
    if (!safe) continue;
    const a = document.createElement('a');
    a.className = 'social-link';
    a.textContent = name;
    a.href = safe;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    socialContainer.appendChild(a);
  }
  $('socialSection').hidden = socialContainer.children.length === 0;

  let toastTimer;
  const toast = (message) => {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3100);
  };

  // Generate vCard directly from the client's config. No server/database needed.
  $('saveContact').addEventListener('click', () => {
    const fullname = text(data.name || 'New Contact');
    const parts = fullname.split(/\s+/);
    const lastName = parts.length > 1 ? parts.pop() : '';
    const firstName = parts.join(' ');
    const lines = [
      'BEGIN:VCARD', 'VERSION:3.0',
      `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
      'FN:' + escapeVCard(fullname)
    ];
    if (text(data.organization)) lines.push('ORG:' + escapeVCard(data.organization));
    if (text(data.jobTitle)) lines.push('TITLE:' + escapeVCard(data.jobTitle));
    if (officeNumber) lines.push('TEL;TYPE=WORK,VOICE:' + officeNumber);
    if (mobileNumber) lines.push('TEL;TYPE=CELL:' + mobileNumber);
    if (faxNumber) lines.push('TEL;TYPE=WORK,FAX:' + faxNumber);
    if (email) lines.push('EMAIL;TYPE=INTERNET:' + escapeVCard(email));
    if (website) lines.push('URL:' + escapeVCard(website));
    if (text(data.address)) lines.push('ADR;TYPE=WORK:;;' + escapeVCard(data.address) + ';;;;');
    if (text(data.credentials)) lines.push('NOTE:' + escapeVCard(data.credentials));
    lines.push('END:VCARD');
    const file = new Blob([lines.join('\r\n') + '\r\n'], { type: 'text/vcard;charset=utf-8' });
    const href = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = fullname.replace(/[^a-z0-9_-]+/gi, '_') + '.vcf';
    document.body.appendChild(anchor);
    anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(href), 60000);
    toast('Contact file ready — open it to add this person.');
  });

  $('shareCard').addEventListener('click', async () => {
    const url = location.href.split('#')[0];
    if (navigator.share) {
      try { await navigator.share({ title: data.name, text: `Connect with ${data.name}`, url }); return; }
      catch (err) { if (err.name === 'AbortError') return; }
    }
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(url); toast('Card link copied!'); return; }
      catch { /* use simple fallback */ }
    }
    window.prompt('Copy this card link:', url);
  });

  // Accessibility: don't animate for people who request reduced motion.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('#backgroundVideo, .card-background-video').forEach(v => v.pause());
  }
})();
