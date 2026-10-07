"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
$('#year').textContent=new Date().getFullYear();let toastTimer;
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3500)}
$$('[data-copy]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);toast('Connection command copied. Paste it into Rust with F1.')}catch{toast('Copy unavailable. Open Join the server to select the command.')}});
$$('[data-dialog]').forEach(b=>b.onclick=()=>{const d=document.getElementById(b.dataset.dialog);d.showModal();if(d.id==='mapDialog')mapUpdate()});$$('dialog').forEach(d=>{d.querySelector('.close').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()})});
const pages=['home','server','news','wildlife','farming','raid','cctv','cards','servers','pve','pve-map','pve-rules','pve-plugins','weapons','vehicles'];const names={home:'OVERVIEW',server:'OUR SERVER',news:'WHAT’S NEW',wildlife:'WILDLIFE',farming:'FARMING',raid:'RAID CALCULATOR',cctv:'CCTV CODES',cards:'MONUMENTS & CARDS',servers:'AUSSIE MAFIA SERVERS',pve:'AUSSIE MAFIA PVE 5X','pve-map':'ORI ISLAND MAP','pve-rules':'PVE RULES','pve-plugins':'PVE PLUGINS & FEATURES',weapons:'RUST WEAPONS',vehicles:'RUST VEHICLES'};
function route(){let p=location.hash.slice(1);if(!pages.includes(p))p='home';const pveMode=p==='pve'||p.startsWith('pve-');$$('.page').forEach(el=>el.hidden=el.id!=='page-'+p);$$('[data-page]').forEach(a=>{const active=a.dataset.page===p||(a.dataset.page==='pve'&&pveMode);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});$('#pageLabel').textContent=names[p];document.title='Aussie Mafia | '+names[p];const mode=$('#modeLabel'),join=$('#headerJoin');if(mode)mode.textContent=pveMode?'PVE · 5X MODDED':'VANILLA PVP';if(join){join.dataset.dialog=pveMode?'connectPve':'connect';join.innerHTML=pveMode?'JOIN PVE 5X <b>+</b>':'JOIN THE SERVER <b>+</b>'}scrollTo({top:0,behavior:'instant'})}addEventListener('hashchange',route);route();
const video=$('#worldVideo'),motionButton=$('#motionToggle'),reduce=matchMedia('(prefers-reduced-motion: reduce)');let motionOff=reduce.matches;
function syncMotion(){motionButton.textContent=motionOff?'▶ Play background':'Ⅱ Pause background';$('#mobileMotion').textContent=motionOff?'Play background':'Pause background';motionButton.setAttribute('aria-pressed',String(motionOff));if(motionOff)video.pause();else video.play().catch(()=>{motionOff=true;motionButton.textContent='▶ Play background';motionButton.setAttribute('aria-pressed','true')})}motionButton.onclick=()=>{motionOff=!motionOff;syncMotion()};$('#mobileMotion').onclick=motionButton.onclick;reduce.addEventListener('change',()=>{motionOff=reduce.matches;syncMotion()});syncMotion();
$$('[data-animal]').forEach(b=>{b.setAttribute('aria-pressed',String(b.classList.contains('active')));b.onclick=()=>{$$('[data-animal]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});$$('[data-group]').forEach(a=>a.hidden=b.dataset.animal!=='all'&&b.dataset.animal!==a.dataset.group)}});
const farmData={livestock:{label:'YOUR FIRST HERD',title:'Make room<br>for livestock.',text:'New gates and fences help contain animals. Grown livestock can be sold to a stable vendor; genetics influence offers.'},dairy:{label:'FROM THE HERD TO THE KITCHEN',title:'Milk, cream<br>& new recipes.',text:'Refrigerate milk for four hours to unlock skimming. Milk and cream can modify tea effects.'},fuel:{label:'NOTHING GOES TO WASTE',title:'Organic matter.<br>Useful fuel.',text:'The Biofuel Generator turns organic matter into low-grade fuel. It needs periodic hand stirring.'}};
const farmTabs=$$('[data-farm]');function pickFarm(b){const d=farmData[b.dataset.farm];farmTabs.forEach(t=>{t.setAttribute('aria-selected',String(t===b));t.tabIndex=t===b?0:-1});$('#farmPanel').setAttribute('aria-labelledby',b.id);$('#farmLabel').textContent=d.label;$('#farmTitle').innerHTML=d.title;$('#farmText').textContent=d.text}farmTabs.forEach((b,i)=>{b.onclick=()=>pickFarm(b);b.onkeydown=e=>{let n;if(['ArrowRight','ArrowDown'].includes(e.key))n=(i+1)%farmTabs.length;if(['ArrowLeft','ArrowUp'].includes(e.key))n=(i+farmTabs.length-1)%farmTabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=farmTabs.length-1;if(n!==undefined){e.preventDefault();pickFarm(farmTabs[n]);farmTabs[n].focus()}}});
let zoom=1,panX=0,panY=0,drag=null;const stage=$('#mapStage'),layer=$('#mapLayer');function mapUpdate(){const maxX=stage.clientWidth*(zoom-1)/2,maxY=stage.clientHeight*(zoom-1)/2;panX=Math.max(-maxX,Math.min(maxX,panX));panY=Math.max(-maxY,Math.min(maxY,panY));layer.style.transform=`translate(${panX}px,${panY}px) scale(${zoom})`;$('#zoomValue').textContent=Math.round(zoom*100)+'%';$('#zoomOut').disabled=zoom<=1;$('#zoomIn').disabled=zoom>=3;stage.style.touchAction=zoom>1?'none':'pan-y'}function changeZoom(delta){zoom=Math.max(1,Math.min(3,zoom+delta));mapUpdate()}$('#zoomIn').onclick=()=>changeZoom(.5);$('#zoomOut').onclick=()=>changeZoom(-.5);$('#mapReset').onclick=()=>{zoom=1;panX=panY=0;mapUpdate()};stage.addEventListener('pointerdown',e=>{if(e.target.closest('button')||zoom===1)return;drag={x:e.clientX,y:e.clientY,panX,panY};stage.setPointerCapture(e.pointerId)});stage.addEventListener('pointermove',e=>{if(!drag)return;panX=drag.panX+e.clientX-drag.x;panY=drag.panY+e.clientY-drag.y;mapUpdate()});['pointerup','pointercancel','lostpointercapture'].forEach(type=>stage.addEventListener(type,()=>drag=null));stage.addEventListener('keydown',e=>{if(e.target!==stage)return;if(e.key==='+'||e.key==='='){changeZoom(.5);e.preventDefault()}else if(e.key==='-'){changeZoom(-.5);e.preventDefault()}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)&&zoom>1){panX+=e.key==='ArrowLeft'?30:e.key==='ArrowRight'?-30:0;panY+=e.key==='ArrowUp'?30:e.key==='ArrowDown'?-30:0;mapUpdate();e.preventDefault()}});new ResizeObserver(mapUpdate).observe(stage);mapUpdate();

async function refreshPlayers(){const refresh=$('#refresh');if(refresh.disabled)return;refresh.disabled=true;$('#status').textContent='Updating…';try{const r=await fetch('https://cdn.battlemetrics.com/b/horizontal500x80px/40453506.html',{signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error();const doc=new DOMParser().parseFromString(await r.text(),'text/html');if(doc.querySelector('#server-name a')?.getAttribute('href')!=='https://www.battlemetrics.com/servers/rust/40453506')throw Error();const match=doc.querySelector('#server-players')?.textContent.trim().match(/^(\d+)\s*\/\s*(\d+)$/);if(!match||+match[2]<1)throw Error();$('#players').textContent=Number(match[1])+' / '+Number(match[2]);$('#status').textContent='Player count · may be delayed';$('.dock-status').style.background='#94c68b'}catch{$('#players').textContent='— / —';$('#status').textContent='Count unavailable';$('.dock-status').style.background='#8493a3'}finally{refresh.disabled=false;const cardPlayers=$('#vanilla-directory-players'),cardStatus=$('#vanilla-directory-status');if(cardPlayers)cardPlayers.textContent=$('#players').textContent;if(cardStatus)cardStatus.textContent=$('#status').textContent}}
$('#refresh').onclick=refreshPlayers;refreshPlayers();setInterval(()=>{if(!document.hidden)refreshPlayers()},300000);

const pveStatusWidget=$('#pve-status-widget');
function readPveWidgetPlayers(){
 const section=pveStatusWidget?.shadowRoot?.querySelector('.serverCard-section--players');
 const value=section?.querySelector('.text-3xl')?.textContent||'';
 const match=value.replace(/\s+/g,' ').trim().match(/^(\d+)\s*\/\s*(\d+)$/);
 return match&&+match[2]>0?match:null;
}
let pveRefreshInFlight=false;
async function refreshPvePlayers(){
 const cardPlayers=$('#pve-directory-players'),cardStatus=$('#pve-directory-status');
 if(!cardPlayers||!cardStatus||pveRefreshInFlight)return;
 pveRefreshInFlight=true;
 cardStatus.textContent='Updating…';
 try{
  let match;
  const until=Date.now()+30000;
  while(Date.now()<until){
   match=readPveWidgetPlayers();
   if(match)break;
   await new Promise(resolve=>setTimeout(resolve,500));
  }
  if(!match)throw Error();
  cardPlayers.textContent=match[1]+' / '+match[2];
  cardStatus.textContent='Player count · may be delayed';
 }catch{
  cardPlayers.textContent='— / —';
  cardStatus.textContent='Count unavailable';
 }finally{pveRefreshInFlight=false}
}
refreshPvePlayers();setTimeout(refreshPvePlayers,15000);setInterval(()=>{if(!document.hidden)refreshPvePlayers()},300000);

// Background music supplied by the site owner. Try on load, then retry on a user gesture if blocked.
const backgroundMusic=document.getElementById('backgroundMusic');
backgroundMusic.volume=0.3;
let musicStarting=false;
const musicGestures=['pointerdown','click','touchend','keydown'];
function stopMusicRetries(){musicGestures.forEach(type=>document.removeEventListener(type,startBackgroundMusic,true));}
async function startBackgroundMusic(){
 if(musicStarting||!backgroundMusic.paused)return;
 musicStarting=true;
 try{await backgroundMusic.play();stopMusicRetries();}catch{/* Browser requires a user gesture; leave listeners ready. */}
 finally{musicStarting=false;}
}
backgroundMusic.addEventListener('playing',stopMusicRetries);
musicGestures.forEach(type=>document.addEventListener(type,startBackgroundMusic,{capture:true,passive:true}));
startBackgroundMusic();


// Interactive Ori Island map
let pveZoom=1,pvePanX=0,pvePanY=0,pveDrag=null;
const pveStage=$('#pveMapStage'),pveLayer=$('#pveMapLayer');
function pveMapUpdate(){
 if(!pveStage||!pveLayer)return;
 const maxX=pveStage.clientWidth*(pveZoom-1)/2,maxY=pveStage.clientHeight*(pveZoom-1)/2;
 pvePanX=Math.max(-maxX,Math.min(maxX,pvePanX));pvePanY=Math.max(-maxY,Math.min(maxY,pvePanY));
 pveLayer.style.transform=`translate(${pvePanX}px,${pvePanY}px) scale(${pveZoom})`;
 const value=$('#pveZoomValue');if(value)value.textContent=Math.round(pveZoom*100)+'%';
 const out=$('#pveZoomOut'),inc=$('#pveZoomIn');if(out)out.disabled=pveZoom<=1;if(inc)inc.disabled=pveZoom>=4;
 pveStage.style.touchAction=pveZoom>1?'none':'pan-y';
}
function pveChangeZoom(delta){pveZoom=Math.max(1,Math.min(4,pveZoom+delta));pveMapUpdate()}
if(pveStage){
 $('#pveZoomIn').onclick=()=>pveChangeZoom(.5);$('#pveZoomOut').onclick=()=>pveChangeZoom(-.5);
 $('#pveMapReset').onclick=()=>{pveZoom=1;pvePanX=pvePanY=0;pveMapUpdate()};
 pveStage.addEventListener('pointerdown',e=>{if(e.target.closest('button')||pveZoom===1)return;pveDrag={x:e.clientX,y:e.clientY,panX:pvePanX,panY:pvePanY};pveStage.setPointerCapture(e.pointerId)});
 pveStage.addEventListener('pointermove',e=>{if(!pveDrag)return;pvePanX=pveDrag.panX+e.clientX-pveDrag.x;pvePanY=pveDrag.panY+e.clientY-pveDrag.y;pveMapUpdate()});
 ['pointerup','pointercancel','lostpointercapture'].forEach(type=>pveStage.addEventListener(type,()=>pveDrag=null));
 pveStage.addEventListener('keydown',e=>{if(e.target!==pveStage)return;if(e.key==='+'||e.key==='='){pveChangeZoom(.5);e.preventDefault()}else if(e.key==='-'){pveChangeZoom(-.5);e.preventDefault()}else if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)&&pveZoom>1){pvePanX+=e.key==='ArrowLeft'?30:e.key==='ArrowRight'?-30:0;pvePanY+=e.key==='ArrowUp'?30:e.key==='ArrowDown'?-30:0;pveMapUpdate();e.preventDefault()}});
 new ResizeObserver(pveMapUpdate).observe(pveStage);pveMapUpdate();
}

function filterCards(stage){$$('[data-card-stage]').forEach(x=>x.hidden=stage!=='all'&&x.dataset.cardStage!==stage);$$('[data-card]').forEach(x=>{x.classList.toggle('active',x.dataset.card===stage);x.setAttribute('aria-pressed',String(x.dataset.card===stage))})}$$('[data-card]').forEach(x=>x.onclick=()=>filterCards(x.dataset.card));$$('[data-card-filter]').forEach(x=>x.onclick=()=>filterCards(x.dataset.cardFilter));
