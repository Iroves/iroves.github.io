(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NathaShopCore=api;})(typeof window!=='undefined'?window:globalThis,()=>{
  'use strict';
  const shop='https://nathadotstore.com';
  function cents(value){if(!/^\d+(\.\d{1,2})?$/.test(String(value)))throw new Error('Invalid price');const [whole,decimal='']=String(value).split('.');const result=Number(whole)*100+Number(decimal.padEnd(2,'0'));if(!Number.isSafeInteger(result))throw new Error('Invalid price');return result;}
  function category(p){const t=(p.title+' '+p.product_type+' '+p.handle).toLowerCase();return /sticker|stick\b|flyingfox|fairy-lady|kangaroo-koala|fair-bussiness|domingueira/.test(t)?'Stickers':/print/.test(t)?'Prints':/t.shirt/.test(t)?'Clothing':'Original art';}
  function normalise(raw,images={}){return raw.filter(p=>p&&p.id&&Array.isArray(p.variants)).map(p=>({...p,category:category(p),photos:(p.images||[]).map(i=>({src:images[String(i.id)]||i.src,alt:i.alt||p.title})).filter(i=>/^assets\//.test(i.src)||/^https:\/\/cdn\.shopify\.com\//.test(i.src)),variants:p.variants.filter(v=>/^\d+$/.test(String(v.id))).map(v=>({...v,id:String(v.id),cents:cents(v.price),available:v.available===true}))}));}
  function lines(bag,products){const variants=new Map(products.flatMap(p=>p.variants.map(v=>[v.id,{p,v}])));return bag.flatMap(l=>{const found=variants.get(String(l.id));return found&&Number.isInteger(l.qty)&&l.qty>0&&l.qty<=99?[{...found,id:String(l.id),qty:l.qty}]:[];});}
  function checkout(bag,products){const items=lines(bag,products);if(!items.length||items.length!==bag.length||items.some(i=>!i.v.available))throw new Error('Some items are unavailable');return shop+'/cart/'+items.map(i=>i.id+':'+i.qty).join(',');}
  function subtotal(bag,products){return lines(bag,products).reduce((sum,i)=>sum+i.v.cents*i.qty,0);}
  return {shop,cents,category,normalise,lines,checkout,subtotal};
});
