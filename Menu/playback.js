// A full one-second dwell is required on every arrival or resume.
function createPlaybackController({isAllowed,onState,delay=1000,setTimer=setTimeout,clearTimer=clearTimeout}) {
 const states=new Map();
 function state(v){if(!states.has(v))states.set(v,{visible:false,timer:null,pausedByUser:false,epoch:0});return states.get(v)}
 function cancel(v,s){if(s.timer!==null)clearTimer(s.timer);s.timer=null;s.epoch++;v.pause()}
 function start(v,s){const epoch=++s.epoch;v.muted=true;onState(v,'loading');Promise.resolve(v.play()).then(()=>{if(s.epoch!==epoch)return;if(!s.visible||!isAllowed()||s.pausedByUser){v.pause();return}onState(v,'playing')}).catch(()=>{if(s.epoch===epoch)onState(v,'blocked')})}
 function schedule(v,s){cancel(v,s);if(!s.visible||!isAllowed()||s.pausedByUser)return;onState(v,'waiting');s.timer=setTimer(()=>{s.timer=null;if(s.visible&&isAllowed()&&!s.pausedByUser)start(v,s)},delay)}
 return {
  visible(v,yes){const s=state(v);if(s.visible===yes)return;s.visible=yes;if(!yes){cancel(v,s);s.pausedByUser=false;onState(v,'paused')}else schedule(v,s)},
  suspend(){states.forEach((s,v)=>cancel(v,s))},
  resume(){states.forEach((s,v)=>schedule(v,s))},
  toggle(v){const s=state(v);if(!s.visible||!isAllowed())return;if(!v.paused){s.pausedByUser=true;cancel(v,s);onState(v,'paused')}else{s.pausedByUser=false;cancel(v,s);start(v,s)}},
  destroy(){states.forEach((s,v)=>cancel(v,s));states.clear()}
 };
}
