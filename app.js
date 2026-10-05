'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
$('#year').textContent=new Date().getFullYear();
let toastTimer;function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3000)}
$$('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);toast('Copied. Ready to paste.')}catch{toast('Copy unavailable. Select the address or command and copy it manually.')}}));
const help=$('#help');$('#connectHelp').onclick=()=>help.showModal();$('.dialog-close').onclick=()=>help.close();help.addEventListener('click',e=>{if(e.target===help){const r=help.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)help.close()}});
$('#menu').onclick=()=>{const open=$('#nav').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String(open));$('#menu').setAttribute('aria-label',open?'Close navigation':'Open navigation')};$$('#nav a').forEach(a=>a.onclick=()=>{$('#nav').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');$('#menu').setAttribute('aria-label','Open navigation')});
const reduceQuery=matchMedia('(prefers-reduced-motion: reduce)');let motionOff=reduceQuery.matches;const heroVideo=$('#heroVideo');function syncVideo(){if(!heroVideo)return;if(motionOff){heroVideo.pause()}else{heroVideo.play().catch(()=>{toast('Your browser paused the background video. Use Enable motion to try again.');motionOff=true;applyMotion()})}}heroVideo?.addEventListener('error',()=>{heroVideo.hidden=true});heroVideo?.querySelector('source')?.addEventListener('error',()=>{heroVideo.hidden=true});let animationContext;let activeMotion=[];
function applyMotion(){syncVideo();animationContext?.revert();activeMotion.forEach(a=>a.stop?.());activeMotion=[];document.body.classList.toggle('motion-paused',motionOff);$('#motionToggle').textContent=motionOff?'Enable motion':'Pause motion';$('#motionToggle').setAttribute('aria-pressed',String(motionOff));if(motionOff||!window.gsap)return;gsap.registerPlugin(ScrollTrigger);animationContext=gsap.context(()=>{gsap.from('.hero-content .eyebrow, h1>span, h1 strong, .hero-content>p, .hero-cta',{y:25,opacity:0,duration:.95,stagger:.13,ease:'power3.out',clearProps:'transform,opacity'});gsap.to('.hero-scene',{yPercent:14,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});$$('.reveal').forEach(el=>gsap.from(el,{y:30,opacity:0,duration:.8,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true},clearProps:'transform,opacity'}));gsap.to('.scroll-progress',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.2}})});}
$('#motionToggle').onclick=()=>{motionOff=!motionOff;applyMotion()};reduceQuery.addEventListener('change',e=>{motionOff=e.matches;applyMotion()});applyMotion();
// Motion powers small interaction responses independently of GSAP's scroll timelines.
$$('.button').forEach(b=>{b.addEventListener('pointerenter',()=>{if(!motionOff&&window.Motion)activeMotion.push(Motion.animate(b,{y:-3},{type:'spring',stiffness:320,damping:20}))});b.addEventListener('pointerleave',()=>{if(window.Motion)activeMotion.push(Motion.animate(b,{y:0},{duration:motionOff?0:.22}))})});
$$('.rule-list details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open&&!motionOff&&window.Motion)activeMotion.push(Motion.animate(d.querySelector('.rule-body'),{opacity:[0,1],y:[-6,0]},{duration:.25}));window.ScrollTrigger?.refresh()}));
let zoom=1,panX=0,panY=0,drag=null;const stage=$('#mapStage'),layer=$('#mapLayer');function mapUpdate(){const maxX=stage.clientWidth*(zoom-1)/2,maxY=stage.clientHeight*(zoom-1)/2;panX=Math.max(-maxX,Math.min(maxX,panX));panY=Math.max(-maxY,Math.min(maxY,panY));layer.style.transform=`translate(${panX}px,${panY}px) scale(${zoom})`;$('#zoomValue').textContent=Math.round(zoom*100)+'%';$('#zoomOut').disabled=zoom<=1;$('#zoomIn').disabled=zoom>=3;stage.style.touchAction=zoom>1?'none':'pan-y'}function changeZoom(delta){zoom=Math.max(1,Math.min(3,zoom+delta));mapUpdate()}$('#zoomIn').onclick=()=>changeZoom(.5);$('#zoomOut').onclick=()=>changeZoom(-.5);$('#mapReset').onclick=()=>{zoom=1;panX=panY=0;mapUpdate()};stage.addEventListener('pointerdown',e=>{if(e.target.closest('button')||zoom===1)return;drag={x:e.clientX,y:e.clientY,panX,panY};stage.setPointerCapture(e.pointerId)});stage.addEventListener('pointermove',e=>{if(!drag)return;panX=drag.panX+e.clientX-drag.x;panY=drag.panY+e.clientY-drag.y;mapUpdate()});['pointerup','pointercancel','lostpointercapture'].forEach(type=>stage.addEventListener(type,()=>drag=null));stage.addEventListener('keydown',e=>{if(e.target!==stage)return;if(e.key==='+'||e.key==='='){changeZoom(.5);e.preventDefault()}else if(e.key==='-'){changeZoom(-.5);e.preventDefault()}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)&&zoom>1){panX+=e.key==='ArrowLeft'?30:e.key==='ArrowRight'?-30:0;panY+=e.key==='ArrowUp'?30:e.key==='ArrowDown'?-30:0;mapUpdate();e.preventDefault()}});new ResizeObserver(mapUpdate).observe(stage);mapUpdate();
// Read the text count from the public, CORS-enabled BattleMetrics banner.
// No subscription API, image enlargement, script execution or HTML insertion.
const bannerURL='https://cdn.battlemetrics.com/b/horizontal500x80px/40453506.html';
const playerCount=$('#livePlayerCount'),bannerNote=$('#bannerNote'),bannerFallback=$('#bannerFallback'),refreshButton=$('#refresh');
function parsePlayerCount(html){
 const doc=new DOMParser().parseFromString(html,'text/html');
 const serverLink=doc.querySelector('#server-name a');
 if(serverLink?.getAttribute('href')!=='https://www.battlemetrics.com/servers/rust/40453506')throw Error('Unexpected server');
 const raw=doc.querySelector('#server-players')?.textContent?.trim()||'';
 const match=raw.match(/^(\d+)\s*\/\s*(\d+)$/);
 if(!match||Number(match[2])<1)throw Error('Player count unavailable');
 return `${Number(match[1])}/${Number(match[2])}`;
}
async function refreshPlayers(){
 if(refreshButton.disabled)return;
 refreshButton.disabled=true;bannerNote.textContent='Refreshing online players…';
 try{
  const response=await fetch(bannerURL,{signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('Banner unavailable');
  const count=parsePlayerCount(await response.text());
  playerCount.textContent=count;playerCount.hidden=false;bannerFallback.hidden=true;
  playerCount.title='Player count may be delayed.';
  bannerNote.textContent='Player count updated; reported numbers may be delayed.';
 }catch{
  playerCount.textContent='— / —';playerCount.title='Could not retrieve the player count.';
  bannerFallback.hidden=false;bannerNote.textContent='Open the server page to check current players.';
 }finally{refreshButton.disabled=false}
}
refreshButton.onclick=refreshPlayers;refreshPlayers();
setInterval(()=>{if(!document.hidden)refreshPlayers()},300000);

// Restore the existing GoatCounter total; never replace account history with a local counter.
async function loadVisitorTotal(){
 const fields=document.querySelectorAll('[data-visitor-count]');
 try{
  const r=await fetch('https://aussiemafia.goatcounter.com/counter/TOTAL.json',{signal:AbortSignal.timeout(10000)});
  if(!r.ok)throw Error('Counter unavailable');
  const data=await r.json();
  if(!['string','number'].includes(typeof data.count))throw Error('Invalid counter');
  fields.forEach(el=>{el.textContent=String(data.count);el.title='All-time total reported by GoatCounter; updates may be delayed.'});
 }catch{fields.forEach(el=>{el.textContent='—';el.title='Visitor count temporarily unavailable.'})}
}
loadVisitorTotal();
// Count visits on the existing website only, not local copies or hosted design previews.
if(['www.aussiemafia.au','aussiemafia.au','aussiemafia.github.io'].includes(location.hostname.toLowerCase())){
 const tracker=document.createElement('script');tracker.async=true;tracker.src='https://gc.zgo.at/count.js';tracker.dataset.goatcounter='https://aussiemafia.goatcounter.com/count';document.head.appendChild(tracker);
}
