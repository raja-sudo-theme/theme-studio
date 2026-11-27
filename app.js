const P={
  ice:{c:["#0d1624","#152338","#0a84ff","#192942","#ffffff","#bae6fd","#38bdf8","#152338"],s:[55,6,20,16]},
  sakura:{c:["#24101c","#36172a","#ec4899","#3b182e","#ffffff","#fbcfe8","#f472b6","#36172a"],s:[58,8,25,18]},
  midnight:{c:["#090b10","#121622","#6366f1","#161b29","#f8fafc","#94a3b8","#818cf8","#121622"],s:[65,5,35,14]},
  emerald:{c:["#0a1c16","#112b22","#10b981","#133026","#ffffff","#a7f3d0","#34d399","#112b22"],s:[56,6,25,16]},
  neon:{c:["#120c24","#1d1438","#8b5cf6","#221742","#ffffff","#ddd6fe","#c084fc","#1d1438"],s:[52,7,30,16]},
  crystal:{c:["#e2e8f0","#f1f5f9","#0284c7","#ffffff","#0f172a","#334155","#0284c7","#f8fafc"],s:[68,10,10,16]}
};
let loadedImg=null;
const $=id=>document.getElementById(id);
const note=t=>{$("msg").textContent=t};
function rgb(h){const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]}
function rgba(h,a){const[r,g,b]=rgb(h);return`rgba(${r},${g},${b},${a})`}
function argb(h,a){const[r,g,b]=rgb(h),al=Math.max(15,Math.min(240,Math.round(a*255))),u=((al<<24)|(r<<16)|(g<<8)|b)>>>0;return u>0x7FFFFFFF?u-0x100000000:u}

function render(){
  const c=[1,2,3,4,5,6,7,8].map(i=>$("c"+i).value);
  const op=$("sOp").value/100,bl=$("sBl").value,dm=$("sDm").value/100,rd=$("sRd").value;
  $("vOp").textContent=Math.round(op*100)+"%";
  $("vBl").textContent=bl+" px";
  $("vDm").textContent=Math.round(dm*100)+"%";
  $("vRd").textContent=rd+" px";
  $("w1").style.filter=$("w2").style.filter=`blur(${bl}px)`;
  $("d1").style.opacity=$("d2").style.opacity=dm;
  ["bar1","bar2","srch","minp"].forEach(id=>{$(id).style.background=rgba(c[1],op);$(id).style.color=c[4]});
  $("acc1").style.color=c[6];
  ["it1","it2"].forEach(id=>{$(id).style.background=rgba(c[0],op);$(id).style.color=c[4]});
  $("bf").style.background=rgba(c[3],op);$("bf").style.color=c[4];$("bf").style.borderRadius=`${rd}px ${rd}px ${rd}px 4px`;
  $("bm").style.background=rgba(c[2],Math.min(.95,op+.18));$("bm").style.color="#fff";$("bm").style.borderRadius=`${rd}px ${rd}px 4px ${rd}px`;
}

function setP(k){
  const p=P[k];if(!p)return;
  document.querySelectorAll(".chip").forEach(b=>b.classList.toggle("on",b.dataset.k===k));
  p.c.forEach((v,i)=>$("c"+(i+1)).value=v);
  [$("sOp").value,$("sBl").value,$("sDm").value,$("sRd").value]=p.s;
  render();
}

function getWallpaperBytes(){
  return new Promise(resolve=>{
    const cv=document.createElement("canvas");
    cv.width=720;cv.height=1560;
    const ctx=cv.getContext("2d");
    const bl=parseInt($("sBl").value,10)*2;
    const dm=parseInt($("sDm").value,10)/100;
    if(loadedImg){
      const scale=Math.max(cv.width/loadedImg.width,cv.height/loadedImg.height);
      const w=loadedImg.width*scale,h=loadedImg.height*scale;
      ctx.save();
      if(bl>0)ctx.filter=`blur(${bl}px)`;
      ctx.drawImage(loadedImg,(cv.width-w)/2-bl,(cv.height-h)/2-bl,w+bl*2,h+bl*2);
      ctx.restore();
    }else{
      const g=ctx.createLinearGradient(0,0,720,1560);
      g.addColorStop(0,$("c1").value);g.addColorStop(1,$("c2").value);
      ctx.fillStyle=g;ctx.fillRect(0,0,720,1560);
    }
    if(dm>0){ctx.fillStyle=`rgba(0,0,0,${dm})`;ctx.fillRect(0,0,720,1560)}
    cv.toBlob(async blob=>{resolve(new Uint8Array(await blob.arrayBuffer()))},"image/jpeg",0.86);
  });
}

async function makeFile(){
  const c=[1,2,3,4,5,6,7,8].map(i=>$("c"+i).value),op=$("sOp").value/100;
  const ov=argb(c[1],.16),rp=argb(c[6],.22),bg=argb(c[0],op),br=argb(c[1],Math.min(.88,op+.15)),mb=argb(c[2],Math.min(.92,op+.2)),fb=argb(c[3],Math.min(.88,op+.12)),tx=argb(c[4],.95),sb=argb(c[5],.85),ac=argb(c[6],.95),fl=argb(c[7],op);
  const m={windowBackgroundWhite:bg,windowBackgroundGray:bg,chats_background:bg,chats_pinnedOverlay:ov,chats_pinnedIcon:ac,listSelector:rp,dialogBackground:br,actionBarDefault:br,actionBarDefaultIcon:tx,actionBarDefaultTitle:tx,actionBarDefaultSubtitle:sb,actionBarTabActiveText:ac,actionBarTabUnactiveText:sb,actionBarTabLine:ac,chats_name:tx,chats_message:sb,chats_date:sb,chats_unreadCounter:ac,chats_unreadCounterText:-1,divider:ov,chat_outBubble:mb,chat_outBubbleSelected:mb,chat_messageTextOut:-1,chat_outTimeText:sb,chat_outSentCheck:ac,chat_inBubble:fb,chat_inBubbleSelected:fb,chat_messageTextIn:tx,chat_inTimeText:sb,chat_inReplyNameText:ac,chat_inReplyLine:ac,chat_serviceBackground:fl,chat_serviceText:tx,chat_messagePanelBackground:br,chat_messagePanelText:tx,chat_messagePanelHint:sb,chat_messagePanelIcons:ac,chat_emojiPanelBackground:br,switchTrackChecked:ac,chat_wallpaper:0};
  let txt="// ColorOS 17 Liquid Glass Studio\n";
  for(const k in m)txt+=k+"="+m[k]+"\n";
  const enc=new TextEncoder();
  const hB=enc.encode(txt+"\nWPS\n"),iB=await getWallpaperBytes(),fB=enc.encode("\nWPE\n");
  const out=new Uint8Array(hB.length+iB.length+fB.length);
  out.set(hB,0);out.set(iB,hB.length);out.set(fB,hB.length+iB.length);
  const fn=($("tName").value.trim()||"ColorOS17_Glass").replace(/[^a-zA-Z0-9_-]/g,"_")+".attheme";
  return new File([out],fn,{type:"application/octet-stream"});
}

$("bMood").onclick=()=>{
  const v=$("moodIn").value.toLowerCase();
  if(v.includes("pink")||v.includes("sakura"))setP("sakura");
  else if(v.includes("green"))setP("emerald");
  else if(v.includes("neon")||v.includes("purple"))setP("neon");
  else if(v.includes("white")||v.includes("light"))setP("crystal");
  else if(v.includes("blue")||v.includes("ice"))setP("ice");
  else setP("midnight");
  note("✨ Mood applied");
};
$("chipBox").onclick=e=>{if(e.target.dataset.k)setP(e.target.dataset.k)};
$("wIn").onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  $("fLbl").textContent=f.name;
  const r=new FileReader();
  r.onload=ev=>{
    $("w1").style.backgroundImage=$("w2").style.backgroundImage=`url(${ev.target.result})`;
    const im=new Image();im.onload=()=>{loadedImg=im;note("🖼️ Photo ready to embed!")};im.src=ev.target.result;
  };
  r.readAsDataURL(f);
};
document.querySelectorAll("input[type=color],input[type=range]").forEach(el=>el.oninput=render);
$("bDl").onclick=async()=>{
  note("⏳ Packing wallpaper...");
  const f=await makeFile(),u=URL.createObjectURL(f),a=document.createElement("a");
  a.href=u;a.download=f.name;document.body.appendChild(a);a.click();a.remove();
  note(`✅ Ready (${Math.round(f.size/1024)} KB): ${f.name}`);
};
$("bSh").onclick=async()=>{
  note("⏳ Preparing...");
  const f=await makeFile();
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:f.name});return}catch(e){}}
  $("bDl").click();
};
$("bFx").onclick=()=>{$("sOp").value=58;$("sDm").value=30;if($("c1").value==="#ffffff")$("c1").value="#101522";render();note("🛡️ White glitch fixed")};

$("jsState").textContent="Active ✓";
render();
