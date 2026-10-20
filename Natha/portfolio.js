(() => {
  'use strict';
  const works=window.NATHA_WORKS||[],P=window.NathaPortfolio,dialog=document.getElementById('art-dialog');
  if(!P||!dialog)return;
  const image=document.getElementById('art-full'),caption=document.getElementById('art-caption');let viewing=[],current=0;
  const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  function show(index){const work=P.at(viewing,index);if(!work)return;current=((index%viewing.length)+viewing.length)%viewing.length;image.src=work.src;image.alt=work.alt;image.width=work.width||1200;image.height=work.height||1600;caption.textContent=work.title+' · '+work.styles.join(' / ')+' · '+(current+1)+' / '+viewing.length;}
  function open(group,index){viewing=group;show(index);window.NathaDialogs.open(dialog);}
  function tile(work,group,index){const button=node('button','gallery-tile');button.type='button';button.setAttribute('aria-label','Enlarge '+work.title);const frame=node('span','gallery-frame'),img=node('img');img.src=work.thumb;img.alt=work.alt;img.width=work.width||480;img.height=work.height||600;img.loading='lazy';img.decoding='async';frame.append(img);button.append(frame,node('span','gallery-title',work.title),node('span','gallery-style',work.styles.join(' / ')));button.addEventListener('click',()=>open(group,index));return button;}
  document.querySelectorAll('[data-portfolio-preview]').forEach(mount=>{const items=P.select(works,mount.dataset.portfolioPreview).slice(0,Number(mount.dataset.limit)||6);mount.replaceChildren(...items.map((work,index)=>tile(work,items,index)));});
  document.querySelectorAll('[data-portfolio-kind]').forEach(root=>{
    const kind=root.dataset.portfolioKind,filterRoot=root.querySelector('.style-filters'),grid=root.querySelector('[data-portfolio-gallery]'),count=root.querySelector('.portfolio-count'),more=root.querySelector('.portfolio-more');let selected='All',limit=12;
    function render(){const group=P.select(works,kind,selected);grid.replaceChildren(...group.slice(0,limit).map((work,index)=>tile(work,group,index)));count.textContent=group.length+' '+(kind==='ink'?'tattoo photographs':'artworks')+(selected==='All'?'':' · '+selected);more.hidden=limit>=group.length;}
    const available=P.styles(works,kind);
    ['All',...available].forEach(style=>{const b=node('button','filter'+(style==='All'?' is-active':''),style==='All'?(kind==='ink'?'All tattoos':'All art'):style);b.type='button';b.setAttribute('aria-pressed',String(style==='All'));b.addEventListener('click',()=>{selected=style;limit=12;filterRoot.querySelectorAll('button').forEach(other=>{other.classList.toggle('is-active',other===b);other.setAttribute('aria-pressed',String(other===b));});render();});filterRoot.append(b);});
    more.addEventListener('click',()=>{limit+=12;render();});render();
  });
  document.querySelector('.art-prev').addEventListener('click',()=>show(current-1));document.querySelector('.art-next').addEventListener('click',()=>show(current+1));
  dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();show(current-1);}if(event.key==='ArrowRight'){event.preventDefault();show(current+1);}});
  let start=null;image.addEventListener('touchstart',event=>{start=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;},{passive:true});image.addEventListener('touchend',event=>{if(!start||!event.changedTouches.length)return;const dx=event.changedTouches[0].clientX-start.x,dy=event.changedTouches[0].clientY-start.y;if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy)*1.4)show(current+(dx<0?1:-1));start=null;},{passive:true});
})();
