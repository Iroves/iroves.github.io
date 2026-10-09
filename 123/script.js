// Replace these demo details when personalising the template.
const email = 'hello@example.com';
document.querySelectorAll('[data-color]').forEach(button => {
 button.addEventListener('click',()=>{
  document.documentElement.style.setProperty('--accent',button.dataset.color);
  document.querySelectorAll('[data-color]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 });
});
document.querySelector('#copyEmail').addEventListener('click',async()=>{
 const status=document.querySelector('#copyStatus');
 try {
  if(!navigator.clipboard)throw new Error('Clipboard unavailable');
  await navigator.clipboard.writeText(email);status.textContent='Email copied.';
 }catch {status.textContent='Select and copy: '+email;}
});
