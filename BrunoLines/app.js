(function () {
  'use strict';
  const saveButton = document.getElementById('saveContact');
  if (!saveButton) return;
  saveButton.addEventListener('click', function () {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Giuffre;Bruno;M;;',
      'FN:Bruno M Giuffre',
      'TITLE:Diagnostic Radiologist',
      'ORG:Royal North Shore Hospital;Department of Diagnostic Radiology',
      'TEL;TYPE=WORK,VOICE:+61299264415',
      'TEL;TYPE=CELL:+61419814346',
      'TEL;TYPE=WORK,FAX:+61299264097',
      'EMAIL;TYPE=WORK:bruno.giuffre@health.nsw.gov.au',
      'ADR;TYPE=WORK:;;Level 2\, Main Building\, Royal North Shore Hospital;St Leonards;NSW;2065;',
      'END:VCARD'
    ].join('\r\n');

    const file = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Bruno_M_Giuffre.vcf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
