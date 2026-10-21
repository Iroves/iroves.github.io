(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NathaEnquiryFiles=api;})(typeof window!=='undefined'?window:globalThis,()=>{
  'use strict';
  const maxBytes=9000000;
  function validate(files){
    if(files.length>3)return 'Please attach up to three files.';
    if(files.some(f=>!/\.(?:jpe?g|png|webp|heic|heif|pdf)$/i.test(f.name)))return 'Please choose JPG, PNG, WEBP, HEIC or PDF files.';
    if(files.reduce((sum,f)=>sum+f.size,0)>maxBytes)return 'The attached files are larger than 9 MB combined. Please choose smaller files or share a reference link.';
    return '';
  }
  function files(form){return [...form.querySelectorAll('input[type="file"]')].flatMap(input=>[...input.files]);}
  function check(form){const message=validate(files(form)),input=form.querySelector('input[type="file"]');if(input)input.setCustomValidity(message);return message;}
  return {validate,files,check,maxBytes};
});
