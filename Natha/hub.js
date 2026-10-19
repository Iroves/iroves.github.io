(() => {
  'use strict';
  const C=window.NathaShopCore, data=window.NATHA_SHOP, $=id=>document.getElementById(id);
  let products=C.normalise(data.products,data.images), filter='All', expanded=false, selected=null, bag=[];
  try {const saved=JSON.parse(localStorage.getItem('natha-bag-v1')||'[]');if(Array.isArray(saved))bag=C.lines(saved,products).map(i=>({id:i.id,qty:i.qty}));} catch {}
  const money=c=>new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(c/100);
  const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
  const photo=(p,cls)=>{if(!p.photos.length)return node('div',cls+' no-photo','Photo coming soon');const img=node('img',cls);img.src=p.photos[0].src;img.alt=p.photos[0].alt;img.loading='lazy';img.decoding='async';return img;};
  const open=d=>{if(!d.open)d.showModal();document.body.classList.add('has-modal');};
  function saveBag(){try{localStorage.setItem('natha-bag-v1',JSON.stringify(bag));}catch{}renderBag();}
  function renderBag(){
    document.querySelectorAll('[data-bag-count]').forEach(el=>el.textContent=bag.reduce((n,l)=>n+l.qty,0));
    const list=$('bag-items');list.replaceChildren();
    const items=C.lines(bag,products);
    if(!items.length)list.append(node('p','','Your bag is waiting for a little colour.'));
    items.forEach(item=>{const row=node('div','bag-row'),details=node('div','bag-detail');details.append(node('strong','',item.p.title),node('span','',money(item.v.cents)+(item.v.available?'':' · Unavailable')));if(item.v.title!=='Default Title')details.append(node('span','',item.v.title));
      const qty=node('input');qty.type='number';qty.min=1;qty.max=99;qty.value=item.qty;qty.setAttribute('aria-label','Quantity for '+item.p.title);qty.addEventListener('change',()=>{const value=Number(qty.value);if(Number.isInteger(value)&&value>=1&&value<=99){bag=bag.map(l=>l.id===item.id?{...l,qty:value}:l);saveBag();}else qty.value=item.qty;});
      const remove=node('button','small-link','Remove');remove.type='button';remove.setAttribute('aria-label','Remove '+item.p.title);remove.addEventListener('click',()=>{bag=bag.filter(l=>l.id!==item.id);saveBag();});row.append(photo(item.p,'bag-image'),details,qty,remove);list.append(row);
    });
    $('bag-total').textContent=items.length?'Subtotal '+money(C.subtotal(bag,products)):'';
    setCheckout($('checkout'),bag);
  }
  function setCheckout(anchor,items){try{anchor.href=C.checkout(items,products);anchor.removeAttribute('aria-disabled');anchor.tabIndex=0;}catch{anchor.removeAttribute('href');anchor.setAttribute('aria-disabled','true');anchor.tabIndex=-1;}}
  function render(){
    const term=$('shop-search').value.trim().toLowerCase();const matches=products.filter(p=>(filter==='All'||p.category===filter)&&p.title.toLowerCase().includes(term));
    const grid=$('product-grid');grid.replaceChildren();
    (expanded?matches:matches.slice(0,8)).forEach(p=>{const card=node('article','product-card'),button=node('button','product-open');button.type='button';button.setAttribute('aria-label','View '+p.title);button.append(photo(p,'product-image'));
      const info=node('div','product-info');info.append(node('span','product-category',p.category),node('h3','',p.title));const available=p.variants.filter(v=>v.available),prices=(available.length?available:p.variants).map(v=>v.cents);info.append(node('p','',prices.length?money(Math.min(...prices))+(available.length?'':' · Sold out'):'See details'));button.append(info);button.addEventListener('click',()=>showProduct(p));card.append(button);grid.append(card);});
    $('shop-empty').hidden=matches.length>0;$('show-products').hidden=expanded||matches.length<=8;
  }
  function description(html){const doc=new DOMParser().parseFromString(html||'','text/html');return doc.body.textContent.trim();}
  function showProduct(p){selected=p;$('product-title').textContent=p.title;$('product-description').textContent=description(p.body_html);$('product-source').href=C.shop+'/products/'+encodeURIComponent(p.handle);$('product-quantity').value=1;$('product-message').textContent='';
    const photos=$('product-photos');photos.replaceChildren();p.photos.forEach(i=>{const img=node('img');img.src=i.src;img.alt=i.alt;img.loading='lazy';photos.append(img);});if(!p.photos.length)photos.append(node('div','no-photo','This item has no product photo yet.'));
    const select=$('product-variant');select.replaceChildren();p.variants.forEach(v=>{const option=node('option','',v.title+(v.available?'':' — Sold out'));option.value=v.id;select.append(option);});const available=p.variants.find(v=>v.available);if(available)select.value=available.id;select.hidden=p.variants.length===1;select.previousElementSibling.hidden=select.hidden;
    updatePurchase();open($('product-dialog'));
  }
  function selection(){const qty=Number($('product-quantity').value);return [{id:$('product-variant').value,qty}];}
  function updatePurchase(){if(!selected)return;const v=selected.variants.find(v=>v.id===$('product-variant').value);$('product-price').textContent=v?money(v.cents)+(v.available?'':' · Sold out'):'';setCheckout($('buy-now'),selection());$('add-bag').disabled=!v||!v.available||!Number.isInteger(selection()[0].qty)||selection()[0].qty<1||selection()[0].qty>99;}
  $('product-variant').addEventListener('change',updatePurchase);$('product-quantity').addEventListener('input',updatePurchase);
  $('add-bag').addEventListener('click',()=>{const item=selection()[0];try{C.checkout([item],products);}catch{return;}const existing=bag.find(l=>l.id===item.id);if(existing&&existing.qty+item.qty>99){$('product-message').textContent='The bag limit is 99 of each item.';return;}if(existing)existing.qty+=item.qty;else bag.push(item);saveBag();$('product-message').textContent='Added to your bag. Keep exploring or open Bag to check out.';});
  $('keep-shopping').addEventListener('click',()=>$('bag-dialog').close());
  ['All','Original art','Prints','Stickers','Clothing'].forEach(name=>{const button=node('button','filter'+(name==='All'?' is-active':''),name);button.type='button';button.setAttribute('aria-pressed',String(name==='All'));button.addEventListener('click',()=>{filter=name;expanded=false;$('shop-filters').querySelectorAll('button').forEach(b=>{b.classList.toggle('is-active',b===button);b.setAttribute('aria-pressed',String(b===button));});render();});$('shop-filters').append(button);});
  $('shop-search').addEventListener('input',()=>{expanded=false;render();});$('show-products').addEventListener('click',()=>{expanded=true;render();});
  (window.NATHA_WORKS||[]).slice(0,6).forEach(work=>{const button=node('button','tattoo-tile');button.type='button';const img=node('img');img.src=work.thumb;img.alt=work.alt;img.loading='lazy';button.append(img,node('span','',work.title));button.addEventListener('click',()=>window.NathaGallery.open('all',work.src));$('tattoo-preview').append(button);});
  $('all-work').addEventListener('click',()=>window.NathaGallery.open('all'));
  let refreshing=false;
  async function refresh(){if(refreshing)return;refreshing=true;$('refresh-shop').disabled=true;const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);try{const raw=[];for(let page=1;page<=20;page++){const response=await fetch(C.shop+'/products.json?limit=250&page='+page,{credentials:'omit',signal:controller.signal});if(!response.ok)throw new Error('Catalogue unavailable');const json=await response.json();if(!Array.isArray(json.products))throw new Error('Invalid catalogue');raw.push(...json.products);if(json.products.length<250)break;if(page===20)throw new Error('Catalogue too large');}const next=C.normalise(raw,data.images);if(!next.length)throw new Error('Empty catalogue');products=next;const retained=C.lines(bag,products).map(i=>({id:i.id,qty:i.qty}));const removed=retained.length!==bag.length;bag=retained;render();saveBag();if(selected){const current=products.find(p=>p.id===selected.id);if(current&&$('product-dialog').open)showProduct(current);else if($('product-dialog').open)$('product-dialog').close();}$('shop-status').textContent=products.length+' pieces · Updated from her Shopify store'+(removed?' · An unavailable item was removed from your bag.':'');}catch{$('shop-status').textContent='Showing saved listings. Shopify confirms current prices and availability at checkout.';}finally{clearTimeout(timeout);refreshing=false;$('refresh-shop').disabled=false;}}
  $('refresh-shop').addEventListener('click',refresh);render();renderBag();refresh();
})();
