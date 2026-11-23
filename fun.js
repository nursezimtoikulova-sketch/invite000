/* ===== Салам ырлары + Сүрөт-табышмак + Сүрөттөп тап ===== */
window.GUESS=window.GUESS||{rebus:[],describe:[]};
const SONGS=[
 {id:'hello',lv:'YL',t:'Hello Song',ky:'Салам ыры (кичүүлөр)',l:['Hello, hello, how are you?','I am fine, and how are you?','Clap, clap, clap, one, two, three!','Hello, friends, now sing with me!']},
 {id:'morning',lv:'YL',t:'Good Morning',ky:'Кутмандуу таң',l:['Good morning, good morning to you!','The sun is up, the sky is blue.','Stand up, sit down, turn around,','Good morning, friends, let’s start right now!']},
 {id:'week',lv:'YL',t:'Days of the Week',ky:'Жуманын күндөрү',l:['Monday, Tuesday, Wednesday too,','Thursday, Friday, how are you?','Saturday, Sunday, the week is done,','Learning English is so much fun!']},
 {id:'hey',lv:'TEEN',t:'Hey There, Hello!',ky:'Өспүрүмдөр үчүн салам',l:['Hey there, hello, nice to see you,','How was your weekend? What is new?','Smile at your neighbour, give a high five,','English time, we are all alive!']},
 {id:'ready',lv:'TEEN',t:'Are You Ready?',ky:'Даярсыңарбы?',l:['Are you ready? Yes, we are!','Every student is a star.','Open your books and open your mind,','Leave your worries far behind!']},
 {id:'checkin',lv:'ADV',t:'Morning Check-in',ky:'Улуулар үчүн салам-рэп',l:['Good morning, class, are you ready to go?','Tell me something that I don’t know.','Big ideas and a brand-new day,','Let’s speak English all the way!']},
 {id:'bye',lv:'Баары',t:'Goodbye Song',ky:'Коштошуу ыры (сабактын аягы)',l:['Goodbye, goodbye, it’s time to go,','We learned a lot, and now we know.','See you next time, have a nice day,','Goodbye, my friends, hip hip hooray!']}];
let AC=null,SGT=[],BPM=96;
function tone(f,t0,d,type,v){const o=AC.createOscillator(),g=AC.createGain();o.type=type||'triangle';o.frequency.value=f;g.gain.setValueAtTime(0.0001,t0);g.gain.linearRampToValueAtTime(v||.2,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+d);o.connect(g);g.connect(AC.destination);o.start(t0);o.stop(t0+d+.05)}
const SCL=[0,2,4,5,7,9,11,12,14];function hz(d){return 261.63*Math.pow(2,SCL[d]/12)}
const PAT=[[0,0,4,4,5,5,4],[3,3,2,2,1,1,0],[4,4,3,3,2,2,1],[4,3,2,1,2,1,0]];
function contour(n,i){const P=PAT[i%4];return Array.from({length:n},(_,k)=>P[Math.round(k*(P.length-1)/Math.max(1,n-1))])}
function songStop(){SGT.forEach(clearTimeout);SGT=[];if(AC){try{AC.close()}catch(e){}AC=null}document.querySelectorAll('#songbox .w.on').forEach(w=>w.classList.remove('on'))}
function songPlay(id,withVoice){songStop();const S=SONGS.find(s=>s.id===id);AC=new (window.AudioContext||window.webkitAudioContext)();const b=60/BPM,t0=AC.currentTime+.3;let t=0;
 S.l.forEach((line,i)=>{const W=line.split(' '),C=contour(W.length,i);tone(130.81*(i%2?1.5:1),t0+t,b*(W.length+2),'sine',.12);
  W.forEach((w,k)=>{const d=k===W.length-1?2*b:b;tone(hz(C[k]),t0+t,d*.95,'triangle',.22);tone(1200,t0+t,.04,'square',.03);
   const ms=(t0+t-AC.currentTime)*1000;SGT.push(setTimeout(()=>{document.querySelectorAll('#songbox .w.on').forEach(x=>x.classList.remove('on'));const el=document.getElementById('w'+i+'_'+k);if(el)el.classList.add('on')},ms));t+=d});
  t+=b});
 SGT.push(setTimeout(songStop,(t0+t-AC.currentTime)*1000+300))}
function songLines(id){songStop();const S=SONGS.find(s=>s.id===id);let i=0;const nx=()=>{if(i>=S.l.length)return;const u=new SpeechSynthesisUtterance(S.l[i].replace(/’/g,"'"));u.lang='en-GB';u.rate=.8;document.querySelectorAll('#songbox .ln').forEach((x,j)=>x.style.background=j===i?'#fff1c9':'');u.onend=()=>{i++;setTimeout(nx,1800)};speechSynthesis.cancel();speechSynthesis.speak(u)};nx()}
function openSongs(sel){openM('🎵 Салам ырлары');const S=SONGS.find(s=>s.id===sel)||SONGS[0];
 $('#mb').innerHTML=`<style>#songbox .w{display:inline-block;padding:0 4px;border-radius:8px;transition:.15s}#songbox .w.on{background:var(--cherry);color:#fff;transform:scale(1.12)}#songbox .ln{font-family:var(--hf);font-size:clamp(22px,3.2vw,40px);margin:8px 0;padding:4px 10px;border-radius:12px}</style>
 <div class="chips">${SONGS.map(s=>`<button class="chip ${s.id===S.id?'on':''}" onclick="openSongs('${s.id}')">${esc(s.t)} <small>${esc(s.lv)}</small></button>`).join('')}</div>
 <p><b>${esc(S.ky)}</b>. Адегенде сап-сап угуп кайталайбыз, анан музыка менен чогуу ырдайбыз. Ар бир сабакты ушул ыр менен баштасаңыз, 1–2 жумада жаттап алышат.</p>
 <div id="songbox" class="card" style="background:#fffaf0">${S.l.map((line,i)=>`<div class="ln en">${line.split(' ').map((w,k)=>`<span class="w" id="w${i}_${k}">${esc(w)}</span>`).join(' ')}</div>`).join('')}</div>
 <p class="ready" style="margin-top:12px"><button class="btn" onclick="songPlay('${S.id}')">▶ Музыка менен ырдоо</button><button class="btn alt" onclick="songLines('${S.id}')">🗣 Сап-сап угуу</button><button class="btn ghost" onclick="songStop();speechSynthesis.cancel()">⏹ Токтотуу</button>
 <label style="display:inline-flex;gap:6px;align-items:center;font-weight:700">🐢 <input type="range" min="70" max="130" value="${BPM}" oninput="BPM=+this.value"> 🐇</label></p>
 <p><small>Кыймыл кошуңуз: «Clap» дегенде кол чаап, «Stand up / sit down» дегенде туруп-отуруп ырдашат. Музыка: жөнөкөй обон, интернетсиз да иштейт.</small></p>`}
/* --- Сүрөт-табышмак (ребус) жана Сүрөттөп тап --- */
function lvChips(fn,cur){return ['YL','TEEN','ADV'].map(l=>`<button class="chip ${l===cur?'on':''}" onclick="${fn}('${l}')">${l==='YL'?'YL (кичүүлөр)':l==='TEEN'?'TEEN':'ADV'}</button>`).join('')}
function openRebus(lv){lv=lv||'YL';openM('🧩 Сүрөт-табышмак');const R=GUESS.rebus.filter(r=>r.lv===lv);
 $('#mb').innerHTML=`<div class="chips">${lvChips('openRebus',lv)}</div><p>Экранда сүрөттөр чыгат: ар бир сүрөт бир англис сөз, бирге кошулганда жаңы сөз же туюнтма болот (мисалы ☀️ + 🌻 = <b>sunflower</b>). Командалар таап айтат. ${R.length} табышмак.</p><p class="ready"><button class="btn" onclick="rebusDeck('${lv}')">▶ Тактага чыгаруу</button></p>`}
function rebusDeck(lv){const R=shuffle(GUESS.rebus.filter(r=>r.lv===lv));closeM();
 DECK=[`<div class="sl" style="text-align:center"><span class="sl-k">Picture puzzle · ${lv}</span><h2>Guess the word! 🧩</h2><p class="sl-q">Look at the pictures. What word do they make?</p><p style="font-size:clamp(60px,10vw,120px)">☀️ + 🌻 = ?</p></div>`,
 ...R.map((r,i)=>`<div class="sl" style="text-align:center"><span class="sl-k">${i+1} / ${R.length}</span><p style="font-size:clamp(70px,13vw,170px);margin:20px 0;line-height:1.1">${r.p.join(' <span style="font-size:.5em;color:var(--muted)">+</span> ')}</p>
 <p class="sl-btns" style="justify-content:center"><button class="btn alt" onclick="this.parentNode.nextElementSibling.hidden=false">💡 Жардам</button><button class="btn" onclick="this.parentNode.parentNode.querySelector('.ra').hidden=false;say('${q1(r.a)}')">👁 Жооп</button></p>
 <p class="sl-t" hidden>${(r.parts||[]).map(esc).join(' + ')}</p><div class="ra" hidden><p class="sl-big" style="color:var(--cherry)">${esc(r.a)}</p><p class="sl-t">${esc(r.ky||'')}</p></div></div>`)];showDeck()}
function openDescribe(lv){lv=lv||'YL';openM('🔍 Сүрөттөп тап');const R=GUESS.describe.filter(r=>r.lv===lv);
 $('#mb').innerHTML=`<div class="chips">${lvChips('openDescribe',lv)}</div><p>Бир нерсе белги-белги менен сүрөттөлөт (кандай көрүнөт, эмнеден жасалган, эмне кылат…). Окуучулар мүмкүн болушунча эрте табууга аракет кылышат: 1-белгиден тапса 5 упай, 2-белгиден 4 упай ж.б. ${R.length} табышмак.</p><p class="ready"><button class="btn" onclick="descDeck('${lv}')">▶ Тактага чыгаруу</button></p>`}
function descDeck(lv){const R=shuffle(GUESS.describe.filter(r=>r.lv===lv));closeM();
 DECK=[`<div class="sl" style="text-align:center"><span class="sl-k">Describe & guess · ${lv}</span><h2>What is it? 🔍</h2><p class="sl-q">Listen to the clues. Guess as early as you can!</p><p class="sl-t">Useful: Is it a…? I think it’s a… It might be…</p></div>`,
 ...R.map((r,i)=>`<div class="sl"><span class="sl-k">${i+1} / ${R.length}</span><h2>What is it?</h2>${r.clues.map((c,k)=>`<p class="sl-big dc" ${k?'hidden':''} style="font-size:clamp(20px,2.8vw,34px)" onclick="say(this.textContent.replace(/^\\d+\\. /,''))">${k+1}. ${esc(c)}</p>`).join('')}
 <p class="sl-btns"><button class="btn alt" onclick="const h=this.closest('.sl').querySelector('.dc[hidden]');if(h){h.hidden=false;say(h.textContent.replace(/^\\d+\\. /,''))}">➕ Кийинки белги</button><button class="btn" onclick="const a=this.closest('.sl').querySelector('.ra');a.hidden=false;say('${q1(r.a)}')">👁 Жооп</button></p>
 <div class="ra" hidden style="text-align:center"><span style="font-size:clamp(60px,9vw,110px)">${r.emoji||''}</span><p class="sl-big" style="color:var(--cherry)">${esc(r.a)}</p><p class="sl-t">${esc(r.ky||'')}</p></div></div>`)];showDeck()}
const _closeM0=closeM;closeM=function(){songStop();_closeM0()};
