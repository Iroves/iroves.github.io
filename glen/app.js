/* This works on ordinary GitHub Pages: no backend or external JavaScript libraries. */
(() => {
  'use strict';
  const data = window.CARD_CONFIG || {};
  const get = (id) => document.getElementById(id);
  const str = (x) => String(x ?? '').trim();
  const phone = str(data.phoneDial || '').replace(/[^+\d]/g, '');
  const vCardEscape = (value) => str(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
  let toastTimer;
  function notify(message){const el=get('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2700)}
  if (str(data.fullName)) {
    const [first,...rest] = str(data.fullName).split(/\s+/);
    const h1=get('fullName'); h1.replaceChildren(document.createTextNode(first+' ')); const em=document.createElement('em');em.textContent=rest.join(' ');h1.append(em);
    document.title=data.fullName+' · '+str(data.tradeTitle);
  }
  if (str(data.tradeTitle)) get('tradeTitle').textContent=data.tradeTitle;
  if (str(data.experienceYears)) get('experience').querySelector('strong').textContent=data.experienceYears;
  if (str(data.photo)) get('portrait').src=data.photo;
  if (phone) {
    get('callBtn').href='tel:'+phone;
    get('phoneLink').href='tel:'+phone;
    get('callText').textContent='Call '+str(data.phoneDisplay);
    get('phoneLink').textContent=str(data.phoneDisplay);
  } else {get('callBtn').hidden=true;get('phoneLink').hidden=true;}
  if (Array.isArray(data.services)) {
    const inline=document.querySelector('.service-inline');
    inline.replaceChildren();
    data.services.filter(Boolean).forEach((item,i)=>{
      if(i){const mid=document.createElement('b');mid.textContent='·';inline.append(mid)}
      const span=document.createElement('span');span.textContent=str(item).toUpperCase();inline.append(span);
    });
    document.querySelectorAll('.service-tile').forEach((tile,i)=>{
      if(data.services[i])tile.querySelector('strong').textContent=str(data.services[i]);
      else tile.hidden=true;
    });
  }
  get('saveContact').addEventListener('click',()=>{
    const name=str(data.fullName)||'New Contact';
    const parts=name.split(/\s+/);const first=parts.shift();const last=parts.join(' ');
    const lines=['BEGIN:VCARD','VERSION:3.0',`N:${vCardEscape(last)};${vCardEscape(first)};;;`,`FN:${vCardEscape(name)}`,
      `TITLE:${vCardEscape(data.tradeTitle)}`,phone?'TEL;TYPE=CELL:'+phone:'',
      'NOTE:Over 20 years experience. Restoration. Interiors. Exteriors.','END:VCARD'].filter(Boolean);
    const blob=new Blob([lines.join('\r\n')+'\r\n'],{type:'text/vcard;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='Glen_Coxon.vcf';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);notify('Contact file ready to save.');
  });
  get('shareCard').addEventListener('click',async()=>{
    const url=location.href.split('#')[0];
    if(navigator.share){try{await navigator.share({title:document.title,url});return}catch(e){if(e.name==='AbortError')return}}
    if(navigator.clipboard && window.isSecureContext){try{await navigator.clipboard.writeText(url);notify('Card link copied.');return}catch{}}
    window.prompt('Copy this card link:',url);
  });
  const video=get('motionVideo'),btn=get('motionToggle');
  const setPauseText=(paused)=>{btn.querySelector('span').textContent=paused?'Play motion':'Pause motion';btn.setAttribute('aria-label',paused?'Play moving background':'Pause moving background');btn.setAttribute('aria-pressed',String(paused));};
  btn.addEventListener('click',async()=>{
    if(video.paused){try{await video.play();setPauseText(false)}catch{notify('Motion unavailable on this device.')}}
    else{video.pause();setPauseText(true)}
  });
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){video.pause();setPauseText(true)}
})();
