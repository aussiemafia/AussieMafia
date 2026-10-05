(()=>{const list=window.VEHICLES||[],esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));function draw(group){const a=list.filter(v=>group==='all'||v.group===group);document.getElementById('vehicle-count').textContent=a.length+' ways to travel';document.getElementById('vehicle-grid').innerHTML=a.map(v=>`<article class="vehicle-card"><img src="${esc(v.image)}" alt="${esc(v.name)} in Rust" loading="lazy"><div><span class="eyebrow">${esc(v.group.toUpperCase())}</span><h2>${esc(v.name)}</h2><dl><div><dt>Power / fuel</dt><dd>${esc(v.fuel)}</dd></div><div><dt>Riders</dt><dd>${esc(v.capacity)}</dd></div><div><dt>Where to get it</dt><dd>${esc(v.where)}</dd></div></dl><p>${esc(v.tip)}</p><a class="text-link" href="${esc(v.source)}" target="_blank" rel="noopener">OFFICIAL GUIDE</a></div></article>`).join('')}document.querySelectorAll('[data-vehicle]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-vehicle]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});draw(b.dataset.vehicle)}));
const guide=document.createElement('dialog');
guide.id='horseSourceTest';
guide.setAttribute('aria-label','Horse official guide — embedded page test');
guide.style.cssText='width:94vw;max-width:1400px;height:90vh;max-height:90vh;padding:16px;background:#101722;color:#fff;border:1px solid #657182;';
guide.innerHTML='<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:8px"><strong>HORSE — OFFICIAL GUIDE TEST</strong><button type="button" style="cursor:pointer;padding:10px 16px">CLOSE ×</button></div><p style="margin:8px 0">Live Facepunch page. If the area below is blank or says “refused to connect”, embedding has not worked in your browser.</p><iframe title="Facepunch — Make Your Mark" style="display:block;width:100%;height:calc(100% - 112px);border:0;background:#fff" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" allowfullscreen></iframe>';
document.body.appendChild(guide);
guide.querySelector('button').addEventListener('click',()=>guide.close());
guide.addEventListener('close',()=>guide.querySelector('iframe').removeAttribute('src'));
document.getElementById('vehicle-grid').addEventListener('click',event=>{
const link=event.target.closest('a.text-link');
if(!link||link.getAttribute('href')!=='https://rust.facepunch.com/news/make-your-mark')return;
event.preventDefault();
guide.showModal();
guide.querySelector('iframe').src=link.href;
guide.addEventListener('close',()=>link.focus(),{once:true});
});
draw('all')})();
