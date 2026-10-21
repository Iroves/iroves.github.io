(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NathaPortfolio=api;})(typeof window!=='undefined'?window:globalThis,()=>{
  'use strict';
  function select(works,kind,style='All'){return works.filter(work=>work.category===kind&&(style==='All'||work.styles?.includes(style)));}
  function styles(works,kind){return [...new Set(select(works,kind).flatMap(work=>work.styles||[]))];}
  function at(works,index){return works.length?works[((index%works.length)+works.length)%works.length]:null;}
  return {select,styles,at};
});
