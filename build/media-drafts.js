#!/usr/bin/env node
/* Generates three standalone media-page layout proposals into site/drafts/.
   Self-contained (inline CSS/JS), real content, noindex. Throwaway drafts —
   the winner gets rebuilt properly in build.js. */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const POSTS = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/news/posts.json'), 'utf8'));
const LI = JSON.parse(fs.readFileSync(path.join(ROOT, 'site/assets/data/linkedin.json'), 'utf8'));
const VIDEOS = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/media/videos.json'), 'utf8')).videos;

const KEYS = { 7923:'team-building-2026',7848:'cpca-show-2026',7577:'hkpca-2025',7284:'cpca-show-2025',7152:'golden-supplier-award',7123:'hkpca-2024',7009:'cpca-2024',6938:'tpca-2024',6796:'kpca-2024',6672:'granite',6480:'schmoll-asia-vs-maschinen',5876:'wus-expansion',3441:'larry-gao',3217:'new-website' };
const img = (u) => '../assets/img/news/' + u.split('/').pop().replace('-scaled','').toLowerCase();
const thumb = (p) => p.liFeatured || (p.featured && p.featured.startsWith && p.featured.startsWith('assets/')) ? '../' + p.featured : (p.featured ? img(p.featured) : (p.images[0] ? img(p.images[0]) : '../assets/img/facility-2.jpg'));
const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fd = (iso) => { const [y,m,d] = iso.slice(0,10).split('-'); return `${d} ${M[m-1]} ${y}`; };
const sorted = [...POSTS].sort((a,b)=>b.date.localeCompare(a.date));
const hero = sorted.find(p=>p.isFeatured) || sorted[0];
const liPosts = LI.posts.slice(0,6);
const TYPE = { news:'News', insight:'Insight', event:'Event', company:'Company', video:'Video' };

const shell = (title, body, css, js='') => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex,nofollow">
<title>${title}</title>
<link rel="icon" href="../assets/monogram.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Roboto+Slab:wght@300;400;500&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--red:#C11819;--red-dark:#9d1314;--blue:#2C55A3;--ink:#141414;--g9:#333;--g7:#4D4D4D;--g5:#7F8080;--g4:#B3B3B3;--g2:#E5E5E5;--g1:#F2F2F2;--fd:"Jost",sans-serif;--fb:"Roboto Slab",serif;--fm:"Roboto Mono",monospace}
body{font-family:var(--fb);color:var(--g9);background:#fff;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%}a{color:inherit;text-decoration:none}
.draftbar{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:10px 20px;background:var(--ink);color:#fff;font-family:var(--fm);font-size:11px;letter-spacing:.12em;text-transform:uppercase}
.draftbar a{color:#fff;border:1px solid rgba(255,255,255,.3);padding:5px 12px}
.draftbar a:hover{border-color:#fff}
.draftbar b{color:var(--red);}
${css}
</style>
</head>
<body>
<div class="draftbar"><span><b>DRAFT</b> ${title}</span><span style="display:flex;gap:8px"><a href="media-a.html">A</a><a href="media-b.html">B</a><a href="media-c.html">C</a><a href="../news.html">current</a></span></div>
${body}
${js ? `<script>${js}</script>` : ''}
</body>
</html>`;

/* ================= A — COVER STORY (cinematic covers + filmstrips) ================= */
const strip = (items) => items.map(it => `
  <a class="fs__card" href="${it.href}"${it.ext?' target="_blank" rel="noopener"':''}>
    <img src="${it.img}" alt="${it.alt||''}" loading="lazy">
    ${it.play?'<span class="fs__play">▶</span>':''}
    <span class="fs__cap"><span class="fs__date">${it.date}</span><span class="fs__t">${it.title}</span></span>
  </a>`).join('');

const stripRow = (label, items) => `
<section class="fs">
  <header class="fs__head"><h2>${label}</h2><span class="fs__hint">scroll →</span></header>
  <div class="fs__row">${strip(items)}</div>
</section>`;

const aBody = `
<a class="cover" href="../news-${KEYS[hero.id]}.html">
  <img src="${thumb(hero)}" alt="${hero.imageAlt||''}">
  <div class="cover__body">
    <span class="cover__k">${fd(hero.date)} · Featured</span>
    <h1>${hero.cleanTitle}</h1>
    <span class="cover__go">Read the story →</span>
  </div>
</a>
${stripRow('News & Events', sorted.filter(p=>p.type!=='insight'&&p.id!==hero.id).map(p=>({href:'../news-'+KEYS[p.id]+'.html',img:thumb(p),date:fd(p.date),title:p.cleanTitle,alt:p.imageAlt})))}
${stripRow('Expert Insights', sorted.filter(p=>p.type==='insight'&&p.id!==hero.id).map(p=>({href:'../news-'+KEYS[p.id]+'.html',img:thumb(p),date:fd(p.date),title:p.cleanTitle,alt:p.imageAlt})))}
${stripRow('Videos', VIDEOS.map(v=>({href:'../news.html#videos',img:'../'+v.poster,date:'',title:v.title,play:true})))}
${stripRow('LinkedIn', liPosts.map(p=>({href:p.url,ext:true,img:'../'+p.images[0],date:fd(p.date),title:p.text.split('\n')[0].slice(0,70)})))}
`;
const aCss = `
.cover{position:relative;display:flex;align-items:flex-end;height:100vh;min-height:560px;overflow:hidden;color:#fff}
.cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cover::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(8,8,8,.9),rgba(8,8,8,.15) 55%,rgba(8,8,8,.35))}
.cover__body{position:relative;z-index:1;padding:clamp(28px,5vw,72px);max-width:900px;display:flex;flex-direction:column;gap:18px}
.cover__k{font-family:var(--fm);font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.75)}
.cover h1{font-family:var(--fd);font-weight:700;font-size:clamp(2rem,5vw,4.2rem);line-height:1.05;text-transform:uppercase}
.cover__go{font-family:var(--fd);font-weight:600;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#fff;border-bottom:2px solid var(--red);align-self:flex-start;padding-bottom:4px}
.fs{padding:clamp(36px,5vw,64px) 0 0}
.fs__head{display:flex;align-items:baseline;justify-content:space-between;padding:0 clamp(20px,4vw,64px);margin-bottom:18px}
.fs__head h2{font-family:var(--fd);font-weight:700;text-transform:uppercase;font-size:clamp(1.2rem,2vw,1.7rem)}
.fs__hint{font-family:var(--fm);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--g5)}
.fs__row{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 clamp(20px,4vw,64px) 8px;scrollbar-width:thin}
.fs__card{position:relative;flex:0 0 clamp(300px,38vw,560px);aspect-ratio:16/9;overflow:hidden;scroll-snap-align:start;color:#fff;background:var(--g1)}
.fs__card img{width:100%;height:100%;object-fit:cover;transition:transform .4s cubic-bezier(.22,.61,.36,1)}
.fs__card:hover img{transform:scale(1.03)}
.fs__card::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(8,8,8,.85),rgba(8,8,8,0) 55%)}
.fs__cap{position:absolute;left:0;right:0;bottom:0;z-index:1;padding:16px 18px;display:flex;flex-direction:column;gap:4px}
.fs__date{font-family:var(--fm);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7)}
.fs__t{font-family:var(--fd);font-weight:600;font-size:15px;line-height:1.3}
.fs__play{position:absolute;inset:0;display:grid;place-items:center;font-size:15px;color:#fff;z-index:1}
.fs__play::before{content:"";position:absolute;width:52px;height:52px;border-radius:50%;background:rgba(10,10,10,.6);border:1px solid rgba(255,255,255,.4)}
body>section:last-of-type{padding-bottom:clamp(48px,6vw,90px)}
`;

/* ================= B — LIGHT TABLE (photo wall + caption bar) ================= */
const wallTiles = [
  ...sorted.map((p,i)=>({href:'../news-'+KEYS[p.id]+'.html',img:thumb(p),date:fd(p.date),title:p.cleanTitle,type:p.type,n:i+1})),
  ...VIDEOS.map((v,i)=>({href:'../news.html#videos',img:'../'+v.poster,date:'Video',title:v.title,type:'video',n:sorted.length+i+1,play:true})),
  ...liPosts.slice(0,4).map((p,i)=>({href:p.url,ext:true,img:'../'+p.images[0],date:fd(p.date),title:p.text.split('\n')[0].slice(0,70),type:'linkedin',n:sorted.length+VIDEOS.length+i+1})),
];
const SPANB = ['b-6 b-r2','b-3','b-3','b-3','b-3','b-4','b-4','b-4','b-6','b-6','b-4','b-4','b-4','b-3','b-3','b-3','b-3','b-6','b-3','b-3','b-4','b-4','b-4'];
const bBody = `
<header class="lt-head">
  <h1>Media</h1>
  <p>News · Insights · Videos · LinkedIn — hover any image</p>
</header>
<main class="wall">
${wallTiles.map((t,i)=>`  <a class="tile ${SPANB[i]||'b-4'}" href="${t.href}"${t.ext?' target="_blank" rel="noopener"':''} data-cap="${(t.date+' — '+t.title).replace(/"/g,'&quot;')}" data-type="${t.type}">
    <img src="${t.img}" alt="" loading="lazy">${t.play?'<span class="tile__play">▶</span>':''}<span class="tile__n">${String(t.n).padStart(2,'0')}</span>
  </a>`).join('\n')}
</main>
<div class="capbar" id="capbar"><span class="capbar__type" id="captype"></span><span id="captext">Schmoll Asia Pacific — media archive. Hover an image.</span></div>
`;
const bCss = `
body{background:#111;color:#fff}
.lt-head{padding:84px clamp(20px,4vw,64px) 26px;display:flex;align-items:baseline;gap:26px;flex-wrap:wrap}
.lt-head h1{font-family:var(--fd);font-weight:700;text-transform:uppercase;font-size:clamp(2.4rem,5vw,4rem)}
.lt-head p{font-family:var(--fm);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--g5)}
.wall{display:grid;grid-template-columns:repeat(12,1fr);gap:10px;padding:0 clamp(20px,4vw,64px) 110px;grid-auto-rows:clamp(120px,15vw,220px);grid-auto-flow:dense}
.b-3{grid-column:span 3}.b-4{grid-column:span 4}.b-6{grid-column:span 6}.b-r2{grid-row:span 2}
.tile{position:relative;overflow:hidden;background:#1c1c1c}
.tile img{width:100%;height:100%;object-fit:cover;opacity:.82;filter:saturate(.92);transition:opacity .3s,transform .5s cubic-bezier(.22,.61,.36,1)}
.tile:hover img{opacity:1;transform:scale(1.03);filter:none}
.tile__n{position:absolute;top:10px;left:10px;font-family:var(--fm);font-size:10px;letter-spacing:.1em;color:rgba(255,255,255,.85);background:rgba(10,10,10,.55);padding:3px 7px}
.tile[data-type=insight] .tile__n{background:var(--blue)}
.tile[data-type=news] .tile__n{background:var(--red)}
.tile[data-type=linkedin] .tile__n{background:#0a66c2}
.tile__play{position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-size:13px}
.tile__play::before{content:"";position:absolute;width:46px;height:46px;border-radius:50%;background:rgba(10,10,10,.6);border:1px solid rgba(255,255,255,.4)}
.capbar{position:fixed;left:0;right:0;bottom:0;z-index:90;display:flex;align-items:center;gap:14px;padding:16px clamp(20px,4vw,64px);background:rgba(14,14,14,.96);border-top:1px solid rgba(255,255,255,.14);font-family:var(--fd);font-weight:500;font-size:15px;min-height:56px}
.capbar__type{font-family:var(--fm);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--g5);flex:none}
@media(max-width:860px){.b-3,.b-4,.b-6{grid-column:span 6}.b-r2{grid-row:span 1}}
`;
const bJs = `
var cap=document.getElementById('captext'),typ=document.getElementById('captype');
document.querySelectorAll('.tile').forEach(function(t){
  t.addEventListener('mouseenter',function(){cap.textContent=t.dataset.cap;typ.textContent=t.dataset.type;});
});
document.querySelector('.wall').addEventListener('mouseleave',function(){cap.textContent='Schmoll Asia Pacific — media archive. Hover an image.';typ.textContent='';});
`;

/* ================= C — REGISTER (fixed index left, image canvas right) ================= */
const regItems = [
  ...sorted.map(p=>({href:'../news-'+KEYS[p.id]+'.html',img:thumb(p),date:p.date.slice(0,10),title:p.cleanTitle,type:TYPE[p.type]})),
  ...VIDEOS.map(v=>({href:'../news.html#videos',img:'../'+v.poster,date:'—',title:v.title,type:'Video'})),
  ...liPosts.slice(0,4).map(p=>({href:p.url,ext:true,img:'../'+p.images[0],date:p.date.slice(0,10),title:p.text.split('\n')[0].slice(0,60),type:'LinkedIn'})),
];
const cBody = `
<div class="reg">
  <aside class="reg__list">
    <h1>Media<br>Register</h1>
    <p class="reg__sub">${regItems.length} entries · hover to preview · click to open</p>
    ${regItems.map((it,i)=>`<a class="reg__row${i===0?' is-on':''}" href="${it.href}"${it.ext?' target="_blank" rel="noopener"':''} data-img="${it.img}">
      <span class="reg__no">${String(i+1).padStart(2,'0')}</span>
      <span class="reg__meta"><span class="reg__date">${it.date}</span><span class="reg__type">${it.type}</span></span>
      <span class="reg__title">${it.title}</span>
    </a>`).join('\n')}
  </aside>
  <div class="reg__stage">
    <img id="stageA" src="${regItems[0].img}" alt="" class="is-show">
    <img id="stageB" src="" alt="">
    <span class="reg__stamp" id="stamp">01 / ${String(regItems.length).padStart(2,'0')}</span>
  </div>
</div>
`;
const cCss = `
.reg{display:grid;grid-template-columns:minmax(380px,44fr) 56fr;min-height:100vh}
.reg__list{padding:96px clamp(20px,3vw,48px) 60px;border-right:1px solid var(--g2)}
.reg__list h1{font-family:var(--fd);font-weight:700;text-transform:uppercase;font-size:clamp(2rem,3.4vw,3rem);line-height:1;margin-bottom:10px}
.reg__sub{font-family:var(--fm);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--g5);margin-bottom:34px}
.reg__row{display:grid;grid-template-columns:34px 108px 1fr;gap:14px;align-items:baseline;padding:13px 8px;border-bottom:1px solid var(--g2);transition:background .15s}
.reg__row:hover,.reg__row.is-on{background:var(--g1)}
.reg__row:hover .reg__title,.reg__row.is-on .reg__title{color:var(--red)}
.reg__no{font-family:var(--fm);font-size:10.5px;color:var(--g4)}
.reg__meta{display:flex;flex-direction:column;gap:1px}
.reg__date{font-family:var(--fm);font-size:10.5px;color:var(--g5)}
.reg__type{font-family:var(--fm);font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--blue)}
.reg__title{font-family:var(--fd);font-weight:500;font-size:15.5px;line-height:1.35;transition:color .15s}
.reg__stage{position:sticky;top:0;height:100vh;overflow:hidden;background:var(--ink)}
.reg__stage img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .45s ease}
.reg__stage img.is-show{opacity:1}
.reg__stamp{position:absolute;right:22px;bottom:18px;font-family:var(--fm);font-size:11px;letter-spacing:.14em;color:rgba(255,255,255,.85);background:rgba(10,10,10,.55);padding:5px 10px}
@media(max-width:900px){.reg{grid-template-columns:1fr}.reg__stage{display:none}.reg__list{padding-top:76px}}
`;
const cJs = `
var A=document.getElementById('stageA'),B=document.getElementById('stageB'),stamp=document.getElementById('stamp');
var rows=document.querySelectorAll('.reg__row');var front=A,back=B,cur=0;
rows.forEach(function(r,i){r.addEventListener('mouseenter',function(){
  if(i===cur)return;cur=i;
  rows.forEach(function(x){x.classList.remove('is-on')});r.classList.add('is-on');
  back.src=r.dataset.img;
  back.onload=function(){back.classList.add('is-show');front.classList.remove('is-show');var t=front;front=back;back=t;};
  stamp.textContent=String(i+1).padStart(2,'0')+' / '+String(rows.length).padStart(2,'0');
});});
`;

fs.mkdirSync(path.join(ROOT,'site/drafts'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'site/drafts/media-a.html'), shell('A · Cover Story', aBody, aCss));
fs.writeFileSync(path.join(ROOT,'site/drafts/media-b.html'), shell('B · Light Table', bBody, bCss, bJs));
fs.writeFileSync(path.join(ROOT,'site/drafts/media-c.html'), shell('C · Register', cBody, cCss, cJs));
console.log('3 drafts written to site/drafts/');
