/* ===== Китеп боюнча (Take off with English) + Talking Club ===== */
window.BOOK=window.BOOK||{grades:[]};window.TC=window.TC||{topics:[]};
document.head.insertAdjacentHTML('beforeend','<style>[hidden]{display:none!important}</style>');
const KU='https://kitep.edu.kg';let BG=null,TLV='Баары';
function lsg(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function lss(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function bkG(){return BOOK.grades.find(g=>g.grade===BG)||BOOK.grades[0]}
function audURL(G,t){const p=(G.audio||{})[t];return p?KU+'/media/audio/'+p:null}
function q1(s){return String(s).replace(/\\/g,'').replace(/'/g,"\\'")}
function revBtn(a){return `<button class="btn sm ghost" onclick="this.nextElementSibling.hidden=false;this.remove()">👁 Жооп</button><b class="ans" hidden style="color:#0d6b4b">✅ ${esc(a)}</b>`}
const EXT={gap:'Боштукту толтур',mcq:'Тандагыла',order:'Сүйлөм түз',tf:'True / False',tr:'Которгула'};
function exHTML(x,i){return `<div style="margin:6px 0;padding:8px 12px;background:#fff;border-radius:12px"><small class="tag y">${EXT[x.t]||'Көнүгүү'}</small> <b>${i+1}.</b> <span class="en">${esc(x.q)}</span>${x.o?` <span>${x.o.map(o=>`<span class="tag b">${esc(o)}</span>`).join(' ')}</span>`:''} ${revBtn(x.a)}</div>`}

function renderBook(){const el=$('#bunits');if(!el)return;
 if(!BOOK.grades.length){el.innerHTML='<p class="sub">Даярдалууда.</p>';return}
 const G=bkG();BG=G.grade;
 $('#bgrades').innerHTML=BOOK.grades.map(g=>`<button class="chip ${g.grade===BG?'on':''}" onclick="BG=${g.grade};renderBook()">${g.grade}-класс</button>`).join('');
 const pos=lsg('bk'+BG,null),U=G.units;
 const posTxt=pos&&U[pos.u]?`📍 Биз азыр: <b>${esc(U[pos.u].label)}</b>${U[pos.u].lessons[pos.l]?', '+esc(U[pos.u].lessons[pos.l].title):''} <button class="btn sm" onclick="bkGo(${pos.u},${pos.l})">Ушул жерден улантуу →</button>`:'📍 Белги жок. Сабакта «Ушул жерде токтодук» баскычын басыңыз, кийинки жолу ушул жерден улантасыз.';
 $('#bhead').innerHTML=`<div class="card" style="margin-bottom:14px"><h4>📗 Take off with English · ${BG}-класс</h4>
 <p>Расмий китептер (Билим берүү министрлиги, kitep.edu.kg): ${[['pb','📖 Pupil’s Book'],['wb','📒 Workbook'],['tg','👩‍🏫 Teacher’s Guide']].filter(x=>G.ids[x[0]]).map(x=>`<a class="pl" href="${KU}/book/${G.ids[x[0]]}/read" target="_blank" rel="noopener">${x[1]} ↗</a>`).join(' ')}</p>
 <p>🗓 Күн алмашып окутабыз: <b>1-күн — менин программам</b>, <b>2-күн — китеп</b>. Программа күнү да китептен 1–2 көнүгүү жасаса болот.</p>
 <p style="margin:0">${posTxt}</p></div>`;
 el.innerHTML=U.map((u,ui)=>`<details class="lesson" data-u="${ui}"><summary><span class="num">${esc(u.short)}</span><span class="lt">${esc(u.title)} <small style="color:var(--muted);font-weight:600">PB ${esc(u.pb_pages||'')}</small></span>${pos&&pos.u===ui?'<span class="tag y">📍</span>':''}</summary><div class="lbody"></div></details>`).join('');
 el.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open&&!d.dataset.r){d.dataset.r=1;d.querySelector('.lbody').innerHTML=bkUnitHTML(+d.dataset.u)}}))}
function bkUnitHTML(ui){const G=bkG(),u=G.units[ui];
 return `<p>${esc(u.about_ky||'')}</p>
 ${(u.vocab||[]).length?`<div class="tw"><table><tr><th>English</th><th>Кыргызча</th><th></th></tr>${u.vocab.map(w=>`<tr><td><b class="en">${esc(w.en)}</b></td><td>${esc(w.ky)}</td><td>${sayBtn(w.en)}</td></tr>`).join('')}</table></div>`:''}
 ${u.grammar?`<div class="card" style="background:#ece0f7;border:0;margin:10px 0"><h4>📘 ${esc(u.grammar.name)}</h4><p style="color:var(--ink)">${esc(u.grammar.ky||'')}</p>${(u.grammar.examples||[]).map(e=>`<div><i class="en">${esc(e)}</i> ${sayBtn(e)}</div>`).join('')}</div>`:''}
 ${(u.lessons||[]).map((l,li)=>`<details class="lesson" data-l="${li}" style="margin-left:8px"><summary><span class="num">${li+1}</span><span class="lt">${esc(l.title)} <small style="color:var(--muted);font-weight:600">${l.pb_pages?'PB '+esc(l.pb_pages):''}${l.wb_pages?' · WB '+esc(l.wb_pages):''}</small></span></summary><div class="lbody">${bkLessonHTML(ui,li)}</div></details>`).join('')}`}
function bkLessonHTML(ui,li){const G=bkG(),l=G.units[ui].lessons[li];
 const aud=(l.audio||[]).map(t=>[t,audURL(G,t)]).filter(a=>a[1]);
 return `<p>🎯 ${esc(l.goal_ky||'')}</p><p>${pgLink(G,'pb',l.pb_pages)} ${pgLink(G,'wb',l.wb_pages)}</p>${l.listen_ky?`<p>🗣️ ${esc(l.listen_ky)}</p>`:''}
 <p class="ready"><button class="btn" onclick="bkDeck(${ui},${li})">▶ Тактага чыгаруу</button><button class="btn ghost" onclick="openSongs()">🎵 Салам ыры</button><button class="btn alt" onclick="bkMark(${ui},${li})">📍 Ушул жерде токтодук</button>${(l.speak||[]).length?`<button class="btn mint" onclick="openM('🗣️ Speaking');gWheel([],[],[],bkG().units[${ui}].lessons[${li}].speak)">🎡 Сүйлөө</button>`:''}</p>
 <div class="stages">
 ${aud.length?`<div class="st" style="--c:var(--k4)"><div><b>Аудио</b><small>расмий, kitep.edu.kg</small></div><div>${aud.map(a=>`<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:4px 0"><b style="min-width:58px">🎧 ${esc(a[0])}</b><audio controls preload="none" src="${a[1]}" style="height:34px;max-width:100%"></audio></div>`).join('')}</div></div>`:''}
 ${(l.steps_ky||[]).length?`<div class="st" style="--c:var(--butter)"><div><b>Сабактын жүрүшү</b></div><div><ol style="margin:0;padding-left:20px">${l.steps_ky.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div></div>`:''}
 ${(l.my_ex||[]).length?`<div class="st" style="--c:var(--cherry)"><div><b>Көнүгүүлөр</b><small>жооп басканда чыгат</small></div><div>${l.my_ex.map(exHTML).join('')}</div></div>`:''}
 ${(l.book_answers||[]).length?`<div class="st" style="--c:var(--mint)"><div><b>Китептин жооптору</b><small>адегенде талкуулап, анан ачыңыз</small></div><div>${l.book_answers.map(b=>`<div style="margin:4px 0"><b>${esc(b.ex)}</b> ${revBtn(b.a)}</div>`).join('')}</div></div>`:''}
 ${(l.speak||[]).length?`<div class="st" style="--c:var(--k2)"><div><b>Сүйлөө</b></div><div>${l.speak.map(q=>`<div>❓ <i class="en">${esc(q)}</i> ${sayBtn(q)}</div>`).join('')}</div></div>`:''}
 ${l.hw_ky?`<div class="st" style="--c:var(--plum)"><div><b>Үй тапшырма</b></div><div>${esc(l.hw_ky)}</div></div>`:''}
 </div>`}
function pg1(p){const m=String(p||'').match(/\d+/);return m?+m[0]:null}
function pgLink(G,k,p){const n=pg1(p);if(!n||!G.parts||!G.parts[k])return '';const pt=G.parts[k].find(x=>n>=x[1]&&n<=x[2])||G.parts[k][0];return `<a class="pl" href="${KU}/book/${pt[0]}/read" target="_blank" rel="noopener">${k==='pb'?'📖 Pupil’s Book':'📒 Workbook'}: ${esc(p)}-бет ↗</a>`}
function bkMark(ui,li){lss('bk'+BG,{u:ui,l:li});renderBook();bkGo(ui,li)}
function bkGo(ui,li){setTimeout(()=>{const d=document.querySelector(`#bunits details[data-u="${ui}"]`);if(!d)return;d.open=true;setTimeout(()=>{const x=d.querySelector(`details[data-l="${li}"]`);if(x){x.open=true;x.scrollIntoView({behavior:'smooth'})}},60)},60)}
function slRev(a){return `<p class="sl-btns"><button class="btn alt" onclick="this.parentNode.nextElementSibling.hidden=false;this.parentNode.remove()">👁 Жоопту көрсөтүү</button></p><p class="sl-big" hidden style="color:#0d6b4b">✅ ${esc(a)}</p>`}
function bkDeck(ui,li){const G=bkG(),u=G.units[ui],l=u.lessons[li];const aud=(l.audio||[]).map(t=>[t,audURL(G,t)]).filter(a=>a[1]);
 DECK=[boardHTML({t:l.title,n:null},true),
  pg1(l.pb_pages)?`<div class="sl" style="text-align:center"><span class="sl-k">Books open</span><div style="font-size:clamp(70px,11vw,140px)">📖</div><h2>Open your books at page ${pg1(l.pb_pages)}</h2><p class="sl-q">Pupil's Book, p. ${esc(l.pb_pages)}${l.wb_pages?' · Workbook, p. '+esc(l.wb_pages):''}</p></div>`:'',
  (u.vocab||[]).length?`<div class="sl"><span class="sl-k">Vocabulary · ${esc(u.label)}</span><h2>New words</h2><div class="sl-words">${u.vocab.slice(0,12).map(w=>`<button onclick="say('${q1(w.en)}');this.querySelector('small').hidden=false"><b>${esc(w.en)}</b><small hidden>${esc(w.ky)}</small></button>`).join('')}</div></div>`:'',
  u.grammar?`<div class="sl"><span class="sl-k">Grammar</span><h2>${esc(u.grammar.name)}</h2>${(u.grammar.examples||[]).slice(0,4).map(e=>`<p class="sl-big" onclick="say(this.textContent)">${esc(e)}</p>`).join('')}<p class="sl-t">${esc(u.grammar.ky||'')}</p></div>`:'',
  aud.length?`<div class="sl"><span class="sl-k">Listening 🎧</span><h2>Listen!</h2><p class="sl-t">Pupil's Book ${esc(l.pb_pages||'')}</p>${aud.map(a=>`<div style="display:flex;gap:12px;align-items:center;margin:10px 0"><b style="font-size:24px;min-width:80px">${esc(a[0])}</b><audio controls preload="none" src="${a[1]}" style="flex:1"></audio></div>`).join('')}</div>`:'',
  ...(l.my_ex||[]).map((x,i)=>`<div class="sl"><span class="sl-k">Exercise ${i+1} · ${EXT[x.t]||''}</span><p class="sl-big" style="margin-top:24px">${esc(x.q)}</p>${x.o?`<p class="sl-btns">${x.o.map(o=>`<span class="tag b" style="font-size:24px;padding:8px 18px">${esc(o)}</span>`).join('')}</p>`:''}${slRev(x.a)}</div>`),
  (l.book_answers||[]).length?`<div class="sl"><span class="sl-k">Check the book</span><h2>Answers ✔</h2>${l.book_answers.map(b=>`<div class="sl-t" style="margin:8px 0"><b>${esc(b.ex)}</b> <button class="btn sm alt" onclick="this.nextElementSibling.hidden=false;this.remove()">👁</button><b hidden style="color:#0d6b4b"> ${esc(b.a)}</b></div>`).join('')}</div>`:'',
  (l.speak||[]).length?`<div class="sl"><span class="sl-k">Speaking</span><h2>Let's talk! 🗣️</h2>${l.speak.map(q=>`<p class="sl-big" onclick="say(this.textContent)">${esc(q)}</p>`).join('')}</div>`:'',
  l.hw_ky?`<div class="sl"><span class="sl-k">Homework</span><h2>Үй тапшырма 🏠</h2><p class="sl-big">${esc(l.hw_ky)}</p></div>`:''].filter(Boolean);
 showDeck()}
function showDeck(){DI=0;let d=document.getElementById('deck');if(!d){d=document.createElement('div');d.id='deck';document.body.append(d)}
 d.innerHTML=`<div class="dk-stage" id="dks"></div><div class="dk-bar"><button class="x" onclick="deckGo(-1)">‹</button><span id="dkn"></span><button class="x" onclick="deckGo(1)">›</button><button class="x" onclick="(document.fullscreenElement?document.exitFullscreen():document.getElementById('deck').requestFullscreen()).catch(()=>{})">⛶</button><button class="x" onclick="closeDeck()">×</button></div>`;
 d.classList.add('on');deckGo(0)}

/* ===== Talking Club ===== */
function tcT(id){return TC.topics.find(t=>t.id===id)}
function renderTalk(){const el=$('#ttopics');if(!el)return;const T=TC.topics;
 if(!T.length){el.innerHTML='<p class="sub">Даярдалууда.</p>';return}
 $('#tlevels').innerHTML=['Баары','TEEN','ADV'].map(l=>`<button class="chip ${l===TLV?'on':''}" onclick="TLV='${l}';renderTalk()">${l==='Баары'?l:l==='TEEN'?'TEEN (A2–B1)':'ADV (B1–B2)'}</button>`).join('');
 el.innerHTML=T.filter(t=>TLV==='Баары'||t.level===TLV).map(t=>`<div class="card lift" style="cursor:pointer" onclick="tcOpen('${t.id}')"><div style="font-size:42px">${t.emoji||'💬'}</div><span class="tag ${t.level==='ADV'?'p':'g'}">${esc(t.level)}</span><h4 style="margin-top:8px">${esc(t.title)}</h4><p style="font-size:14px"><i>${esc((t.warmup||[])[0]||'')}</i></p></div>`).join('')}
function tcOpen(id){const t=tcT(id);openM((t.emoji||'💬')+' '+t.title);
 $('#mb').innerHTML=`<p class="ready"><button class="btn" onclick="tcDeck('${id}')">▶ Тактага чыгаруу</button><button class="btn mint" onclick="openM('🎡 ${q1(t.title)}');gWheel([],[],[],tcT('${id}').discuss)">🎡 Суроолор дөңгөлөгү</button></p>
 <h4>1. Жылытуу</h4>${(t.warmup||[]).map(q=>`<div>❓ <i class="en">${esc(q)}</i> ${sayBtn(q)}</div>`).join('')}
 ${t.what?`<h4>2. Бул эмне?</h4><p class="en">${esc(t.what.en)}</p><p><small>${esc(t.what.ky)}</small></p>`:''}
 <h4>3. Маалымат</h4>${(t.texts||[]).map(x=>`<div class="card" style="margin:8px 0"><h4>${esc(x.h)}</h4><p class="en" style="color:var(--ink)">${esc(x.en)}</p><details><summary style="cursor:pointer;color:var(--ink2)">Котормосу</summary>${esc(x.ky)}</details>${x.q?`<p style="margin:6px 0 0">💬 <b class="en">${esc(x.q)}</b></p>`:''}</div>`).join('')}
 ${t.case?`<h4>4. Окуя: сен болсоң эмне кылмаксың?</h4><div class="card" style="background:#fff1c9;border:0"><p class="en" style="color:var(--ink)">${esc(t.case.en)}</p><details><summary style="cursor:pointer">Котормосу</summary>${esc(t.case.ky)}</details>${(t.case.q||[]).map(q=>`<p style="margin:6px 0 0">💬 <b class="en">${esc(q)}</b></p>`).join('')}</div>`:''}
 <h4>5. Талкуу</h4>${(t.discuss||[]).map(q=>`<div>❓ <i class="en">${esc(q)}</i></div>`).join('')}
 ${t.debate?`<h4>6. Дебат</h4><p>⚖️ <b class="en">${esc(t.debate)}</b></p>`:''}
 <h4>Сөздөр</h4><div class="tw"><table>${(t.vocab||[]).map(w=>`<tr><td><b class="en">${esc(w.en)}</b></td><td>${esc(w.ky)}</td><td>${sayBtn(w.en)}</td></tr>`).join('')}</table></div>`}
const OPN=['I think… because…','In my opinion…','I agree / I disagree, because…','On the one hand… on the other hand…','For example…','What about you?'];
function tcDeck(id){const t=tcT(id);closeM();
 DECK=[`<div class="sl" style="text-align:center"><span class="sl-k">Talking Club · ${engDate()}</span><div style="font-size:clamp(70px,12vw,150px)">${t.emoji||'💬'}</div><h2>${esc(t.title)}</h2>${(t.warmup||[]).map(q=>`<p class="sl-q">${esc(q)}</p>`).join('')}</div>`,
  t.what?`<div class="sl"><span class="sl-k">What is it?</span><p class="sl-big">${esc(t.what.en)}</p>${slRev(t.what.ky)}</div>`:'',
  ...(t.texts||[]).map((x,i)=>`<div class="sl"><span class="sl-k">Read · ${i+1}/${t.texts.length}</span><h2>${esc(x.h)}</h2><p class="sl-t" style="font-size:clamp(20px,2.3vw,30px);line-height:1.5;color:var(--ink)">${esc(x.en)}</p><p class="sl-btns"><button class="btn sm ghost" onclick="this.parentNode.nextElementSibling.hidden=false">🇰🇬 Котормо</button></p><p class="sl-t" hidden>${esc(x.ky)}</p>${x.q?`<p class="sl-q">💬 ${esc(x.q)}</p>`:''}</div>`),
  t.case?`<div class="sl"><span class="sl-k">Real life</span><h2>What would you do?</h2><p class="sl-t" style="font-size:clamp(19px,2.1vw,28px);line-height:1.5;color:var(--ink)">${esc(t.case.en)}</p><p class="sl-btns"><button class="btn sm ghost" onclick="this.parentNode.nextElementSibling.hidden=false">🇰🇬 Котормо</button></p><p class="sl-t" hidden>${esc(t.case.ky)}</p>${(t.case.q||[]).map(q=>`<p class="sl-q">💬 ${esc(q)}</p>`).join('')}</div>`:'',
  `<div class="sl"><span class="sl-k">Discussion</span><h2>Let's discuss! 🗣️</h2>${(t.discuss||[]).map(q=>`<p class="sl-big" style="font-size:clamp(20px,2.6vw,32px)" onclick="say(this.textContent)">${esc(q)}</p>`).join('')}</div>`,
  t.debate?`<div class="sl"><span class="sl-k">Debate ⚖️</span><h2>Agree or disagree?</h2><p class="sl-q">“${esc(t.debate)}”</p><div class="sl-words">${((t.phrases&&t.phrases.length)?t.phrases:OPN).map(p=>`<button><b style="font-size:clamp(17px,1.8vw,22px)">${esc(p)}</b></button>`).join('')}</div></div>`:'',
  (t.vocab||[]).length?`<div class="sl"><span class="sl-k">Useful words</span><h2>Vocabulary</h2><div class="sl-words">${t.vocab.map(w=>`<button onclick="say('${q1(w.en)}');this.querySelector('small').hidden=false"><b>${esc(w.en)}</b><small hidden>${esc(w.ky)}</small></button>`).join('')}</div></div>`:''].filter(Boolean);
 showDeck()}
/* Программа сабагына тиешелүү Talking Club темасы (сөз боюнча дал келүү) */
function tcFor(P){if(!TC.topics.length||P.track==='YL')return null;const words=new Set((P.title+' '+(P.vocab||[]).map(v=>v.en).join(' ')).toLowerCase().match(/[a-z]{4,}/g)||[]);
 let best=null,bs=0;TC.topics.forEach(t=>{const tw=(t.title+' '+(t.vocab||[]).map(v=>v.en).join(' ')).toLowerCase().match(/[a-z]{4,}/g)||[];let s=0;new Set(tw).forEach(w=>{if(words.has(w))s+=(t.level===P.track?2:1)});if(s>bs){bs=s;best=t}});return bs>=2?best:null}
function tcLink(P){const t=tcFor(P);return t?`<div class="st" style="--c:var(--k1)"><div><b>Talking Club</b><small>кошумча тема</small></div><div>${t.emoji||'💬'} <b>${esc(t.title)}</b>: маалымат тексттери, «сен болсоң эмне кылмаксың?», талкуу жана дебат.<br><button class="btn sm" onclick="tcDeck('${t.id}')">▶ Тактага чыгаруу</button> <button class="btn sm ghost" onclick="tcOpen('${t.id}')">Карап чыгуу</button></div></div>`:''}
function kwOf(P){const stop=/^(and|the|our|my|your|with|about|from|what|how|can|lesson|revision|review|show|time|unit|part|test|talk|let|is|are|in|of|to|a|an|for|at|on|do|does|you|i)$/i;const t=(P.title||'').replace(/[^A-Za-z ]/g,' ').split(/\s+/).filter(w=>w.length>2&&!stop.test(w));return (t.slice(0,2).join(' ')||((P.vocab||[])[0]||{}).en||'english').toLowerCase()}
function findRow(P){if(P.track==='YL')return '';const k=kwOf(P),e=encodeURIComponent(k);return `<div style="margin-top:6px">🔎 <b>«${esc(k)}» темасына даяр оюндар:</b> <a class="pl" href="https://wordwall.net/community/${e.replace(/%20/g,'-')}" target="_blank" rel="noopener">Wordwall ↗</a> <a class="pl" href="https://www.baamboozle.com/search?q=${e}" target="_blank" rel="noopener">Baamboozle ↗</a> <a class="pl" href="https://en.islcollective.com/english-esl-video-lessons/search?q=${e}" target="_blank" rel="noopener">ISL видео ↗</a> <a class="pl" href="https://www.liveworksheets.com/search?q=${e}" target="_blank" rel="noopener">Liveworksheets ↗</a></div>`}
function moreHTML(P){const M=P.more||[];if(!M.length&&P.track==='YL')return '';return `<div class="st" style="--c:var(--sky)"><div><b>Кошумча ресурстар</b><small>даяр, акысыз</small></div><div>${M.map(r=>`<div style="margin:4px 0 8px">🔗 <a class="pl" href="${r.url}" target="_blank" rel="noopener">${esc(r.name)} ↗</a> <span class="tag b">${esc(r.platform)}</span><br><small>${esc(r.how_ky||'')}</small></div>`).join('')}${findRow(P)}</div></div>`}
function moreHTML_old(P){const M=P.more||[];return M.length?`<div class="st" style="--c:var(--sky)"><div><b>Кошумча ресурстар</b><small>даяр, акысыз</small></div><div>${M.map(r=>`<div style="margin:4px 0 8px">🔗 <a class="pl" href="${r.url}" target="_blank" rel="noopener">${esc(r.name)} ↗</a> <span class="tag b">${esc(r.platform)}</span><br><small>${esc(r.how_ky||'')}</small></div>`).join('')}</div></div>`:''}
