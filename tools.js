'use strict';
(() => {
const data=window.RAID_TARGETS, rows=document.getElementById('raidRows'), results=document.getElementById('raidResults');
const targetSelect=document.getElementById('raidTarget');
data.forEach(d=>targetSelect.add(new Option(d.name,d.id)));targetSelect.value='garage';
let path=[{id:'garage',qty:2}];
const fmt=n=>n.toLocaleString('en-AU');
const methods=[['Regular rockets',1400,'ammo.rocket.basic'],['C4 charges',2200,'explosive.timed'],['Satchel charges',480,'explosive.satchel'],['Explosive 5.56 rounds',25,'ammo.rifle.explosive']];
function renderRows(){
 rows.innerHTML=path.map((r,i)=>{const d=data.find(t=>t.id===r.id);return `<div class="raid-row">${d.image?`<img src="items/${d.image}.png" alt="">`:''}<div class="target-info"><strong>${d.name}</strong><small>${fmt(d.hp)} HP each</small></div><div class="quantity"><button data-step="-1" data-index="${i}" aria-label="Remove one ${d.name}">−</button><input type="number" min="1" max="100" value="${r.qty}" data-qty="${i}" aria-label="Quantity of ${d.name}"><button data-step="1" data-index="${i}" aria-label="Add one ${d.name}">+</button></div><button class="remove-target" data-remove="${i}" aria-label="Remove ${d.name}">×</button></div>`}).join('')||'<p class="empty-raid">Add a door or wall to start your raid path.</p>';
 renderResults();
}
function renderResults(){
 const totals=[0,0,0,0];path.forEach(r=>data.find(t=>t.id===r.id).counts.forEach((n,i)=>totals[i]+=n*r.qty));
 const costs=totals.map((n,i)=>n*methods[i][1]),low=Math.min(...costs),max=Math.max(...costs,1);
 document.getElementById('targetCount').textContent=path.reduce((n,r)=>n+r.qty,0)+' targets';
 results.innerHTML=methods.map((m,i)=>`<div class="boom-option ${costs[i]===low&&totals[i]?'cheapest':''}"><img src="items/${m[2]}.png" alt=""><div><strong>${m[0]}</strong><small>${fmt(costs[i])} sulfur${costs[i]===low&&totals[i]?' · lowest of these options':''}</small></div><b>${fmt(totals[i])}</b><span class="cost-bar" style="width:${costs[i]/max*100}%"></span></div>`).join('');
 const mix=document.getElementById('mixedResult');
 if(path.length&&path.every(r=>data.find(t=>t.id===r.id).mix)){
  const sum=path.reduce((a,r)=>{const m=data.find(t=>t.id===r.id).mix;return[a[0]+m[0]*r.qty,a[1]+m[1]*r.qty]},[0,0]);
  mix.innerHTML=`<div class="mixed-budget"><span class="eyebrow">MIX ROCKETS + AMMO</span><strong>${fmt(sum[0])} rockets + ${fmt(sum[1])} explosive rounds</strong><small>${fmt(sum[0]*1400+sum[1]*25)} sulfur total · finish each door with ammo</small></div>`;
 }else mix.innerHTML='';
}
rows.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.remove!==undefined)path.splice(+b.dataset.remove,1);else if(b.dataset.step)path[+b.dataset.index].qty=Math.max(1,Math.min(100,path[+b.dataset.index].qty+ +b.dataset.step));renderRows()});
rows.addEventListener('change',e=>{if(e.target.dataset.qty===undefined)return;const n=Math.round(Number(e.target.value));path[+e.target.dataset.qty].qty=Number.isFinite(n)?Math.max(1,Math.min(100,n)):1;renderRows()});
document.getElementById('addTarget').onclick=()=>{const r=path.find(r=>r.id===targetSelect.value);if(r)r.qty=Math.min(100,r.qty+1);else path.push({id:targetSelect.value,qty:1});renderRows()};
document.getElementById('clearRaid').onclick=()=>{path=[];renderRows()};renderRows();
const cameras=[
['Cargo ship','cargo','CARGOBRIDGE CARGODECK CARGOSTERN CARGOHOLD1 CARGOHOLD2','Available while Cargo Ship is present.'],
['Missile silo','silo','SILOEXIT1 SILOEXIT2 SILOMISSILE SILOSHIPPING SILOTOWER','Monitor the exits, missile area, shipping area and tower.'],
['Small oil rig','small-oil','OILRIG1HELI OILRIG1DOCK OILRIG1L1 OILRIG1L2 OILRIG1L3 OILRIG1L4','Small rig uses OILRIG1.'],
['Large oil rig','large-oil','OILRIG2HELI OILRIG2DOCK OILRIG2EXHAUST OILRIG2L1 OILRIG2L2 OILRIG2L3A OILRIG2L3B OILRIG2L4 OILRIG2L5 OILRIG2L6A OILRIG2L6B OILRIG2L6C OILRIG2L6D','Large rig uses OILRIG2.'],
['The Dome','dome','DOME1 DOMETOP','Check the approach and top platform.'],
['Outpost','outpost','COMPOUNDSTREET COMPOUNDMUSIC COMPOUNDCRUDE COMPOUNDCHILL','Public cameras around the compound.'],
['Bandit camp','bandit','CASINO TOWNWEAPONS AIRWOLF','Camera availability can depend on the server’s monument layout.'],
['Ferry terminal','ferry','FERRYDOCK FERRYPARKING FERRYUTILITIES FERRYLOGISTICS','Dock, parking, utility and logistics cameras.'],
['Airfield','airfield','AIRFIELDHELIPAD','View the helipad.'],
['Radtown','radtown','RADTOWNHOUSE RADTOWNSBL RADTOWNAPARTMENTS','Public feeds around Radtown.'],
['Underwater labs','labs','','Map-specific codes: find the full identifiers at the lab’s Computer Station. Prefixes include AUXPOWER, BRIG, CANTINA, CAPTAINQUARTER, CLASSIFIED, CREWQUARTER, HALLWAY, INFIRMARY, LAB, LOCKERROOM, OPERATIONS, SECURITYHALL, SPECTRE and TECHCABINET.'],
['Abandoned military base','military','','Map-specific code: COMPOUND followed by that monument’s unique digits. Find the complete identifier at the monument.']
];
const sources=window.MONUMENT_SOURCES||{};
document.getElementById('cameraGrid').innerHTML=cameras.map(([name,id,codes,note])=>`<article class="camera-card"><div class="camera-photo"><img src="monuments/${id}.jpg" alt="${name} in Rust" loading="lazy" width="640" height="360"><h2>${name}</h2></div><div class="camera-body"><p>${note}</p><div class="camera-codes">${codes?codes.split(' ').map(c=>`<button class="camera-code" data-camera="${c}" aria-label="Copy ${c}"><code>${c}</code><span>COPY</span></button>`).join(''):'<strong>Find this wipe’s code in-game</strong>'}</div><a class="image-source" href="${sources[id]||'https://rust.facepunch.com/'}" target="_blank" rel="noopener">Image source</a></div></article>`).join('');
document.getElementById('cameraGrid').addEventListener('click',async e=>{const b=e.target.closest('[data-camera]');if(!b)return;try{await navigator.clipboard.writeText(b.dataset.camera);b.querySelector('span').textContent='COPIED';toast(b.dataset.camera+' copied. Paste it into your Computer Station.');setTimeout(()=>b.querySelector('span').textContent='COPY',1800)}catch{const range=document.createRange();range.selectNodeContents(b.querySelector('code'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);toast('Code selected. Press Ctrl+C to copy.')}});
// Restore the original shared GoatCounter account. Do not count private previews.
const host=location.hostname;
if(['aussiemafia.au','www.aussiemafia.au','aussiemafia.github.io'].includes(host)){
 const script=document.createElement('script');script.async=true;script.src='https://gc.zgo.at/count.js';script.dataset.goatcounter='https://aussiemafia.goatcounter.com/count';document.head.append(script);
}
fetch('https://aussiemafia.goatcounter.com/counter/TOTAL.json',{signal:AbortSignal.timeout(10000)}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{const n=Number(String(d.count).replaceAll(',',''));if(!Number.isFinite(n)||n<0)throw Error();document.querySelectorAll('[data-visit-count],#lifetimeVisits').forEach(el=>el.textContent=fmt(n));document.getElementById('visitNote').textContent='Recorded visits · updates periodically'}).catch(()=>{document.getElementById('visitNote').textContent='Counter temporarily unavailable'});
})();
