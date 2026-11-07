// ================== ЛИЧНАЯ НАСТРОЙКА ==================
// Вставь своё поздравление сюда. Текст появится на странице письма.
const PERSONAL_MESSAGE = `ВСТАВЬ СЮДА СВОЙ ТЕКСТ ПОЗДРАВЛЕНИЯ`;

// Прозвища и обращения к Богдану — можно заполнить позже.
const NICKNAMES = ["", ""];

// Три личных послания в подарочных коробочках.
const GIFT_MESSAGES = [
  {title:"Ого какой торт!",text:"Самый сладкий подарок в этот день — это ты. Загадывай желание и задувай свечи! ♡"},
  {title:"Вот это поздравление!",text:"Кажется, кто-то сегодня получил слишком много крема. Зато будет что вспомнить! 😂"},
  {title:"Праздник для двоих",text:"Пусть в жизни будет побольше таких тёплых вечеров, смеха и счастливых моментов вместе. ♡"}
];

// Замени файлы в assets и пути здесь на свои фотографии.
const PHOTOS = [
 {src:"assets/photo-1.jpg",caption:"Это мыыы"},
 {src:"assets/photo-2.jpg",caption:"ещё мыы)"},
 {src:"assets/photo-3.jpg",caption:"и ещё одно ♡"}
];

document.addEventListener("DOMContentLoaded",()=>{
 const pages=[...document.querySelectorAll(".page")], ids=pages.map(p=>p.id);
 let current=0,opened=new Set(),photoIndex=0;
 function go(target){
  let idx=typeof target==="number"?target:ids.indexOf(target);
  if(idx<0||idx>=pages.length)return;
  current=idx;pages.forEach((p,i)=>p.classList.toggle("active",i===idx));

  window.scrollTo({top:0,behavior:"smooth"});
  if(idx===1||idx===7)confetti(75);
 }
 document.querySelectorAll("[data-next]").forEach(b=>b.onclick=()=>go(b.dataset.next));
 document.querySelector("#envelope-hit").onclick=()=>{
  const stage=document.querySelector(".envelope-stage");if(stage.classList.contains("open"))return;
  stage.classList.add("open");confetti(55);setTimeout(()=>go("p-welcome"),900);
 };
 const no=document.querySelector("#no-btn"),note=document.querySelector("#no-note");
 function dodgeNo(){
  note.classList.add("show");
  no.style.position="fixed"; no.style.zIndex="18";
  const margin=14, w=no.offsetWidth||90, h=no.offsetHeight||46;
  const maxX=Math.max(margin,window.innerWidth-w-margin), maxY=Math.max(margin,window.innerHeight-h-margin);
  const active=document.querySelector(".page.active");
  const protectedRects=[...active.querySelectorAll("h1,h2,h3,.question,.sub,.choice-row,.btn:not(#no-btn),.letter-sheet,.music-player,.photo-wall,.boxes")].map(el=>el.getBoundingClientRect());
  let x=margin,y=margin;
  for(let attempt=0;attempt<80;attempt++){
   const tx=margin+Math.random()*Math.max(0,maxX-margin),ty=margin+Math.random()*Math.max(0,maxY-margin);
   const candidate={left:tx,top:ty,right:tx+w,bottom:ty+h};
   const overlaps=protectedRects.some(r=>candidate.left<r.right+12&&candidate.right>r.left-12&&candidate.top<r.bottom+12&&candidate.bottom>r.top-12);
   if(!overlaps){x=tx;y=ty;break;}
  }
  no.style.left=x+"px";no.style.top=y+"px";no.style.transform=`rotate(${Math.random()*14-7}deg)`;
 }
 no.addEventListener("click",dodgeNo);
 // Единственный audio-элемент управляет и фоновым звучанием, и интерфейсом плеера.
 const bgAudio=document.querySelector("#birthday-audio"),toggle=document.querySelector("#music-toggle"),progress=document.querySelector("#music-progress"),currentTime=document.querySelector("#music-current"),duration=document.querySelector("#music-duration"),volume=document.querySelector("#music-volume"),volumeValue=document.querySelector("#volume-value"),musicPlayer=document.querySelector("#music-player");
 bgAudio.volume=Number(volume.value);
 const fmt=t=>{if(!Number.isFinite(t))return "0:00";const m=Math.floor(t/60),sec=Math.floor(t%60);return m+":"+String(sec).padStart(2,"0")};
 function syncAudio(){if(Number.isFinite(bgAudio.duration)){progress.max=bgAudio.duration;duration.textContent=fmt(bgAudio.duration)}progress.value=bgAudio.currentTime||0;currentTime.textContent=fmt(bgAudio.currentTime);}
 function syncPlay(){const playing=!bgAudio.paused;toggle.textContent=playing?"Ⅱ":"▶";toggle.setAttribute("aria-label",playing?"Пауза":"Воспроизвести");musicPlayer.classList.toggle("is-playing",playing);}
 toggle.addEventListener("click",()=>{if(bgAudio.paused)bgAudio.play().catch(()=>{});else bgAudio.pause()});
 bgAudio.addEventListener("play",syncPlay);bgAudio.addEventListener("pause",syncPlay);bgAudio.addEventListener("timeupdate",syncAudio);bgAudio.addEventListener("loadedmetadata",syncAudio);bgAudio.addEventListener("durationchange",syncAudio);
 progress.addEventListener("input",()=>{if(Number.isFinite(bgAudio.duration))bgAudio.currentTime=Number(progress.value)});
 volume.addEventListener("input",()=>{bgAudio.volume=Number(volume.value);volumeValue.textContent=Math.round(bgAudio.volume*100)+"%"});
 let bgStarted=false;function startBackground(e){if(e&&e.target&&e.target.closest&&e.target.closest(".music-player"))return;if(bgStarted)return;bgStarted=true;bgAudio.play().catch(()=>{bgStarted=false;});}
 document.addEventListener("pointerdown",startBackground,{once:true});document.addEventListener("keydown",startBackground,{once:true});
 document.querySelectorAll(".present").forEach(b=>b.onclick=()=>{
  const i=Number(b.dataset.gift),g=GIFT_MESSAGES[i];opened.add(i);
  document.querySelector("#gift-title").textContent=g.title;document.querySelector("#gift-text").textContent=g.text;
  document.querySelector("#gift-modal").classList.add("show");
  document.querySelector("#opened-count").textContent=`Открыто подарков: ${opened.size} из 3`;
  b.classList.add("opened");confetti(32);
 });
 document.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>document.querySelector("#gift-modal").classList.remove("show"));
 document.querySelector("#gift-modal").onclick=e=>{if(e.target.id==="gift-modal")e.currentTarget.classList.remove("show")};
 const personal=PERSONAL_MESSAGE.trim()==="ВСТАВЬ СЮДА СВОЙ ТЕКСТ ПОЗДРАВЛЕНИЯ"?
 "[Твоё личное поздравление появится здесь. Добавь его в переменную PERSONAL_MESSAGE в начале файла script.js.]":PERSONAL_MESSAGE;
 document.querySelector("#personal-message").textContent=personal;
 const wall=document.querySelector("#photo-wall");
 [...wall.querySelectorAll(".photo-card")].forEach((card,i)=>{
  card.querySelector("img").src=PHOTOS[i].src;card.querySelector("span").textContent=PHOTOS[i].caption;
  card.onclick=()=>openPhoto(i);
 });
 function openPhoto(i){photoIndex=(i+PHOTOS.length)%PHOTOS.length;document.querySelector("#lb-img").src=PHOTOS[photoIndex].src;document.querySelector("#lb-cap").textContent=PHOTOS[photoIndex].caption;document.querySelector("#lightbox").classList.add("show")}
 document.querySelector(".lb-close").onclick=()=>document.querySelector("#lightbox").classList.remove("show");
 document.querySelector(".lb-prev").onclick=()=>openPhoto(photoIndex-1);
 document.querySelector(".lb-next").onclick=()=>openPhoto(photoIndex+1);
 document.querySelector("#lightbox").onclick=e=>{if(e.target.id==="lightbox")e.currentTarget.classList.remove("show")};
 document.addEventListener("keydown",e=>{if(e.key==="Escape"){document.querySelector("#lightbox").classList.remove("show");document.querySelector("#gift-modal").classList.remove("show")}if(document.querySelector("#lightbox").classList.contains("show")){if(e.key==="ArrowRight")openPhoto(photoIndex+1);if(e.key==="ArrowLeft")openPhoto(photoIndex-1)}});
 let sx=0,sy=0;document.addEventListener("touchstart",e=>{sx=e.changedTouches[0].screenX;sy=e.changedTouches[0].screenY},{passive:true});
 document.addEventListener("touchend",e=>{if(document.querySelector(".modal.show,.lightbox.show"))return;let dx=e.changedTouches[0].screenX-sx,dy=e.changedTouches[0].screenY-sy;if(Math.abs(dx)>80&&Math.abs(dx)>Math.abs(dy))go(current+(dx<0?1:-1))},{passive:true});
 document.querySelector("#wish-btn").onclick=()=>{confetti(180);document.querySelector("#wish-btn").textContent="Пусть сбудется! ♡"};
 document.querySelector("#restart").onclick=()=>{opened.clear();document.querySelector("#opened-count").textContent="Открыто подарков: 0 из 3";document.querySelectorAll(".present").forEach(b=>b.classList.remove("opened"));document.querySelector(".envelope-stage").classList.remove("open");go(0)};
 go(0);
});

// Праздничные частицы и маленький салют без библиотек.
const canvas=document.querySelector("#confetti"),ctx=canvas.getContext("2d");let bits=[],running=false;
function size(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}addEventListener("resize",size);size();
function confetti(n=60){let colors=["#75d2c4","#b9eee4","#f5c4d0","#cce9f8","#fff","#e9b7c4"];for(let i=0;i<n;i++)bits.push({x:innerWidth*(.25+Math.random()*.5),y:innerHeight*.28,vx:(Math.random()-.5)*8,vy:-Math.random()*8-1,g:.13,a:Math.random()*6,s:3+Math.random()*5,c:colors[Math.floor(Math.random()*colors.length)],life:90+Math.random()*50});if(!running)draw()}
function draw(){running=true;ctx.clearRect(0,0,innerWidth,innerHeight);bits=bits.filter(p=>p.life-->0&&p.y<innerHeight+30);bits.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.g;p.a+=.1;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);ctx.fillStyle=p.c;ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*1.4);ctx.restore()});if(bits.length)requestAnimationFrame(draw);else{running=false;ctx.clearRect(0,0,innerWidth,innerHeight)}}
