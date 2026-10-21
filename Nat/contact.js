(function(root){
  'use strict';
  function responseState(ok,data){
    const message=typeof data?.message==='string'?data.message:'';
    if(/activat|confirm.{0,30}(?:email|form)/i.test(message))return 'activation';
    return ok&&(data?.success===true||data?.success==='true')?'accepted':'failed';
  }
  if(typeof module==='object'&&module.exports)module.exports={responseState};
  if(!root.document)return;
  const form=root.document.getElementById('contact-form');if(!form)return;
  const status=root.document.getElementById('contact-status'),button=root.document.getElementById('contact-send');
  let busy=false,accepted=false;
  function show(message,error=false){status.textContent=message;status.classList.toggle('is-error',error);}
  form.addEventListener('input',()=>{if(accepted&&!busy){accepted=false;button.disabled=false;button.textContent='Send enquiry ↗';show('Your message has changed. Sending again creates a new enquiry.');}});
  const files=root.NathaEnquiryFiles;
  form.querySelectorAll('input[type="file"]').forEach(input=>input.addEventListener('change',()=>{const error=files.check(form);show(error||'');}));
  form.addEventListener('submit',async event=>{
    // Files use the documented multipart form route. Text-only messages keep
    // the existing in-page request and delivery-status handling.
    if(files&&files.files(form).length){
      const error=files.check(form);
      if(busy||accepted||error||!form.reportValidity()){event.preventDefault();if(error)show(error,true);return;}
      if(!/^https?:$/.test(root.location.protocol)){event.preventDefault();show('Please open the hosted card link to send your enquiry.',true);return;}
      if(new FormData(form).get('_honey')){event.preventDefault();return;}
      show('Opening the message service to send your enquiry and attachments. Delivery requires Nathaly’s inbox activation.');
      return;
    }
    event.preventDefault();if(busy||accepted||!form.reportValidity())return;
    const values=new FormData(form);if(values.get('_honey'))return;
    if(!/^https?:$/.test(root.location.protocol)){show('Please open the hosted card link to send your enquiry.',true);return;}
    const payload=Object.fromEntries([...values.entries()].filter(([,value])=>typeof value==='string'));
    payload.name=String(payload.name).trim();payload.email=String(payload.email).trim();payload.message=String(payload.message).trim();
    if(!payload.name||payload.message.length<10){show('Please enter your name and a message of at least 10 characters.',true);return;}
    payload._replyto=payload.email;payload._url=root.location.href.split('#')[0];
    busy=true;button.disabled=true;button.textContent='Sending…';show('Sending your enquiry…');
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
    try{
      const endpoint=form.action.replace('https://formsubmit.co/','https://formsubmit.co/ajax/');
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),credentials:'omit',signal:controller.signal});
      const data=await response.json(),state=responseState(response.ok,data);
      if(state==='activation'){
        show('The form needs Nathaly’s inbox confirmation before messages can be delivered. Your enquiry has not been confirmed as delivered. For now, please call or send an SMS.');
      }else if(state==='accepted'){
        accepted=true;button.textContent='Enquiry submitted';show('Your enquiry was accepted by the delivery service. Delivery depends on Nathaly activating this new form; for urgent enquiries, please call or send an SMS.');
      }else{
        show('The message service could not confirm your enquiry. Your message is still here. Please call or send an SMS, or try again later.',true);
      }
    }catch(error){
      show(error.name==='AbortError'?'The request timed out. Delivery is uncertain, so please check before sending again. Your message is still here. You can also call or send an SMS.':'We could not confirm whether your enquiry reached the message service. Your message is still here. Check your connection before retrying, or call or send an SMS.',true);
    }finally{clearTimeout(timer);busy=false;button.disabled=accepted;if(!accepted)button.textContent='Send enquiry ↗';}
  });
})(typeof window!=='undefined'?window:globalThis);
