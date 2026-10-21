(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else api.mount(root);})(typeof window!=='undefined'?window:globalThis,()=>{
  'use strict';
  function dateError(values,today){const dates=values.filter(Boolean);if(!dates.length)return 'Please choose at least one preferred date.';if(dates.some(d=>!/^\d{4}-\d{2}-\d{2}$/.test(d)||d<today))return 'Please choose dates from today onwards.';if(new Set(dates).size!==dates.length)return 'Please choose different dates for each preference.';return '';}
  function summary(data){return ['Hi Nathaly, I’d like to request a tattoo.','Request reference: '+data.reference,'Name: '+data.name,'Email: '+data.email,data.phone?'Phone: '+data.phone:'','Idea: '+data.idea,'Placement: '+data.placement,'Approximate size: '+data.size,'Preferred dates: '+data.dates.join(', '),'Preferred payment method: '+data.payment,data.links?'Reference links: '+data.links:'','Please let me know your proposed date, estimated price and deposit details.'].filter(Boolean).join('\n');}
  function mount(root){
    const form=root.document.getElementById('tattoo-request-form');if(!form)return;
    const $=id=>root.document.getElementById(id),F=root.NathaEnquiryFiles;
    const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Australia/Sydney',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()),part=k=>parts.find(p=>p.type===k).value,today=part('year')+'-'+part('month')+'-'+part('day');
    const bytes=new Uint8Array(5);root.crypto.getRandomValues(bytes);const reference='NATHA-'+today.replaceAll('-','')+'-'+Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
    $('request-reference').value=reference;$('reference-display').textContent=reference;
    const dateInputs=['date-one','date-two','date-three'].map($);dateInputs.forEach(input=>input.min=today);
    const status=$('booking-status');
    function validate(){const message=dateError(dateInputs.map(i=>i.value),today);dateInputs[0].setCustomValidity(message);const fileMessage=F.check(form);return message||fileMessage;}
    dateInputs.forEach(i=>i.addEventListener('input',()=>{dateInputs[0].setCustomValidity('');}));
    form.querySelectorAll('input[type="file"]').forEach(input=>input.addEventListener('change',()=>{status.textContent=F.check(form);}));
    form.addEventListener('submit',event=>{
      const error=validate();if(error||!form.reportValidity()){event.preventDefault();status.textContent=error;return;}
      if(!/^https?:$/.test(root.location.protocol)){event.preventDefault();status.textContent='Please open the hosted site to send your request.';return;}
      form.querySelector('[name="_subject"]').value='Tattoo request — '+reference;
      status.textContent='Opening the message service to finish sending your request. Your appointment is confirmed separately by Nathaly.';
      // Native multipart submission sends the named fields and attachments together.
      // Do not claim delivery or booking confirmation before the service responds.
    });
    $('request-whatsapp').addEventListener('click',()=>{
      const error=validate();if(error||!form.reportValidity()){status.textContent=error;return;}
      const fd=new FormData(form),data={reference,name:fd.get('name'),email:fd.get('email'),phone:fd.get('phone'),idea:fd.get('tattoo_idea'),placement:fd.get('placement'),size:fd.get('approximate_size'),dates:dateInputs.map(i=>i.value).filter(Boolean),payment:fd.get('payment_preference'),links:fd.get('reference_links')};
      status.textContent=F.files(form).length?'Your WhatsApp draft is opening. Attach your selected photos or files in WhatsApp before sending; they are not transferred automatically.':'Your WhatsApp draft is opening. Review it and send when ready.';
      root.open('https://wa.me/61426930105?text='+encodeURIComponent(summary(data)),'_blank','noopener,noreferrer');
    });
    const settings=root.NATHA_BOOKING_SETTINGS||{},payid=String(settings.payid||'').trim(),name=String(settings.recipientName||'').trim();
    if(payid&&name){$('payid-receiving-details').hidden=false;$('payid-pending').hidden=true;$('payid-value').textContent=payid;$('payid-recipient').textContent=name;$('copy-payid').addEventListener('click',async()=>{try{await root.navigator.clipboard.writeText(payid);$('copy-payid-status').textContent='PayID copied.';}catch{$('copy-payid-status').textContent='Select and copy the PayID shown above.';}});}
  }
  return {dateError,summary,mount};
});
