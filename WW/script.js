(() => {
  'use strict';
  const save = document.getElementById('save-contact');
  const toast = document.getElementById('toast');
  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => toast.classList.remove('show'), 2500);
  }
  save?.addEventListener('click', () => {
    // Uses the verified public business name; the founder's first-name spelling is not confirmed.
    const vcard = [
      'BEGIN:VCARD', 'VERSION:3.0',
      'FN:Collective Wedding Styling',
      'ORG:Collective Wedding Styling',
      'TITLE:Bespoke Wedding Styling',
      'TEL;TYPE=WORK,VOICE:1300003040',
      'URL:https://www.collectiveweddingstyling.com.au/',
      'NOTE:Wedding styling and florals - Sydney, Melbourne and Brisbane',
      'END:VCARD'
    ].join('\r\n');
    const file = new Blob([vcard], {type: 'text/vcard;charset=utf-8'});
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Collective-Wedding-Styling.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2500);
    notify('Contact ready to save');
  });
})();
