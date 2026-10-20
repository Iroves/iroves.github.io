(() => {
  'use strict';
  let toastTimer;
  function syncScrollLock(){document.body.classList.toggle('has-modal',Boolean(document.querySelector('dialog[open]')));}
  function openDialog(dialog){if(!dialog||dialog.open)return;dialog.showModal();syncScrollLock();}
  document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{
    const topic=document.getElementById('contact-topic');
    if(button.dataset.topic&&topic)topic.value=button.dataset.topic;
    openDialog(document.getElementById(button.dataset.open));
  }));
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
    dialog.addEventListener('close',syncScrollLock);
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close();});
  });
  window.NathaDialogs={open:openDialog};
  function toast(message){const el=document.getElementById('toast');if(!el)return;clearTimeout(toastTimer);el.textContent=message;el.hidden=false;toastTimer=setTimeout(()=>{el.hidden=true;},4200);}
  async function copyLink(url){try{if(!navigator.clipboard)throw new Error();await navigator.clipboard.writeText(url);toast('Card link copied. Share a little art.');}catch{toast('Use your browser’s share button to send this card.');}}
  document.querySelector('.share-button')?.addEventListener('click',async()=>{
    const url=/^https?:$/.test(location.protocol)?new URL('index.html',location.href).href:'https://natha-artist-card.equalcocoa4.chatgpt.site/';
    if(navigator.share){try{await navigator.share({title:'Natha.tat — Tattoos & Art',text:'Tattoos, illustration and original art by Nathaly.',url});}catch(error){if(error.name!=='AbortError')await copyLink(url);}}else await copyLink(url);
  });
  // Keep previously shared in-page portfolio/shop links useful after the split.
  if(document.body.classList.contains('home-page')){
    const destinations={'#shop':'shop.html','#tattoos':'tattoos.html','#about':'about.html','#story':'about.html','#art':'art.html'};
    const follow=()=>{if(destinations[location.hash])location.replace(destinations[location.hash]);};
    window.addEventListener('hashchange',follow);follow();
  }
})();
