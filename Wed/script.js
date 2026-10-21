(() => {
  'use strict';
  const save = document.getElementById('saveContact');
  const toast = document.getElementById('toast');
  let toastTimer;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  save.addEventListener('click', () => {
    // Use company name for the contact; founder first-name spelling still needs confirmation.
    const vCard = [
      'BEGIN:VCARD', 'VERSION:3.0',
      'FN:Collective Wedding Styling',
      'ORG:Collective Wedding Styling',
      'TEL;TYPE=WORK,VOICE:1300003040',
      'URL:https://www.collectiveweddingstyling.com.au/',
      'NOTE:Wedding styling and florals - Sydney, Melbourne, Brisbane',
      'END:VCARD'
    ].join('\r\n');
    const blob = new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Collective-Wedding-Styling.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    notify('Contact file ready to save');
  });
})();
