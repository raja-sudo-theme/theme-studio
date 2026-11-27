const P={
  sakura:{c:["#24101c","#36172a","#ec4899","#3b182e","#ffffff","#fbcfe8","#f472b6","#36172a"],s:[58,7,25,18],m:"Sakura Glass"},
  ice:{c:["#0d1624","#152338","#0a84ff","#192942","#ffffff","#bae6fd","#38bdf8","#152338"],s:[56,6,20,16],m:"ColorOS Ice"},
  lavender:{c:["#1a122b","#291c42","#a855f7","#2e204a","#ffffff","#e9d5ff","#c084fc","#291c42"],s:[58,7,25,18],m:"Lavender Glass"},
  midnight:{c:["#090b10","#131724","#6366f1","#171c2b","#f8fafc","#94a3b8","#818cf8","#131724"],s:[64,5,30,15],m:"Midnight Glass"},
  emerald:{c:["#0b1f18","#123026","#10b981","#15382c","#ffffff","#a7f3d0","#34d399","#123026"],s:[56,6,25,16],m:"Sage Green"},
  crystal:{c:["#f1f5f9","#ffffff","#0284c7","#e2e8f0","#0f172a","#334155","#0284c7","#ffffff"],s:[72,8,10,16],m:"Pure Light"}
};

let loadedImg=null;
const $=id=>document.getElementById(id);
const note=t=>{if($("msg"))$("msg").textContent=t};
function rgb(h){const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255]}
function toHex(r,g,b){return"#"+[r,g,b].map(x=>Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,"0")).join("")}
function rgba(h,a){const[r,g,b]=rgb(h);return`rgba(${r},${g},${b},${a})`}
function lum(h){const[r,g,b]=rgb(h);return(0.299*r+0.587*g+0.114*b)/255}
function argb(h,a){const[r,g,b]=rgb(h),al=Math.max(16,Math.min(245,Math.round(a*255))),u=((al<<24)|(r<<16)|(g<<8)|b)>>>0;return u>0x7FFFFFFF?u-0x100000000:u}

function enforceSafeContrast(){
  const bgLum=lum($("c1").value);
  const txtLum=lum($("c5").value);
  const isLight=bgLum>0.62;
  if(isLight){
    if(txtLum>0.45)$("c5").value="#0f172a";
    if(lum($("c6").value)>0.55)$("c6").value="#334155";
  }else{
    if(txtLum<0.55)$("c5").value="#ffffff";
    if(lum($("c6").value)<0.45)$("c6").value="#cbd5e1";
  }
  if($("modeLbl"))$("modeLbl").textContent=isLight?"Light Glass":"Dark Glass";
}

function extractFromWallpaper(img){
  try{
    const cv=document.createElement("canvas");
    cv.width=32;cv.height=32;
    const ctx=cv.getContext("2d");
    ctx.drawImage(img,0,0,32,32);
    const d=ctx.getImageData(0,0,32,32).data;
    let rS=0,gS=0,bS=0,cnt=0,bestSat=-1,accR=236,accG=72,accB=153;
    for(let i=0;i<d.length;i+=4){
      const r=d[i],g=d[i+1],b=d[i+2];
      rS+=r;gS+=g;bS+=b;cnt++;
      const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
      const sat=mx===0?0:(mx-mn)/mx;
      const l=(0.299*r+0.587*g+0.114*b)/255;
      if(sat>bestSat && l>0.22 && l<0.86){bestSat=sat;accR=r;accG=g;accB=b}
    }
    const aR=rS/cnt,aG=gS/cnt,aB=bS/cnt;
    const aLum=(0.299*aR+0.587*aG+0.114*aB)/255;
    if(aLum>0.65 && parseInt($("sDm").value,10)<30)$("sDm").value=35;
    $("c1").value=toHex(aR*0.18,aG*0.18,aB*0.20);
    $("c2").value=toHex(aR*0.26,aG*0.26,aB*0.30);
    const acc=toHex(Math.min(255,accR*1.12),Math.min(255,accG*1.12),Math.min(255,accB*1.12));
    $("c3").value=acc;
    $("c4").value=toHex(aR*0.30,aG*0.30,aB*0.34);
    $("c5").value="#ffffff";
    $("c6").value=toHex(195+accR*0.2,200+accG*0.2,210+accB*0.2);
    $("c7").value=acc;
    $("c8").value=$("c2").value;
  }catch(e){}
  render();
}

function render(){
  enforceSafeContrast();
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
  if($("sub1"))$("sub1").style.color=$("sub2").style.color=c[5];
  $("bf").style.background=rgba(c[3],op);$("bf").style.color=c[4];$("bf").style.borderRadius=`${rd}px ${rd}px ${rd}px 4px`;
  const myTxt=lum(c[2])>0.72?"#0f172a":"#ffffff";
  $("bm").style.background=rgba(c[2],Math.min(.95,op+.18));$("bm").style.color=myTxt;$("bm").style.borderRadius=`${rd}px ${rd}px 4px ${rd}px`;
}

function setP(k){
  const p=P[k];if(!p)return;
  document.querySelectorAll(".chip").forEach(b=>b.classList.toggle("on",b.dataset.k===k));
  p.c.forEach((v,i)=>$("c"+(i+1)).value=v);
  [$("sOp").value,$("sBl").value,$("sDm").value,$("sRd").value]=p.s;
  if($("modeLbl"))$("modeLbl").textContent=p.m;
  render();
}

// Instant synchronous wallpaper encoder (Never hangs on Android!)
function getWallpaperBytesSync(){
  try{
    const cv=document.createElement("canvas");
    cv.width=540;cv.height=1170;
    const ctx=cv.getContext("2d");
    const bl=parseInt($("sBl").value,10);
    const dm=parseInt($("sDm").value,10)/100;

    if(loadedImg){
      const scale=Math.max(cv.width/loadedImg.width,cv.height/loadedImg.height);
      const w=loadedImg.width*scale,h=loadedImg.height*scale;
      if(bl>0 && "filter" in ctx){
        ctx.save();
        ctx.filter=`blur(${bl*1.5}px)`;
        ctx.drawImage(loadedImg,(cv.width-w)/2-bl*2,(cv.height-h)/2-bl*2,w+bl*4,h+bl*4);
        ctx.restore();
      }else{
        ctx.drawImage(loadedImg,(cv.width-w)/2,(cv.height-h)/2,w,h);
      }
    }else{
      const g=ctx.createLinearGradient(0,0,540,1170);
      g.addColorStop(0,$("c1").value);g.addColorStop(1,$("c2").value);
      ctx.fillStyle=g;ctx.fillRect(0,0,540,1170);
    }

    if(dm>0){
      ctx.fillStyle=`rgba(0,0,0,${dm})`;
      ctx.fillRect(0,0,540,1170);
    }

    const dataUrl=cv.toDataURL("image/jpeg",0.82);
    const b64=dataUrl.split(",")[1];
    const bin=atob(b64);
    const arr=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);
    return arr;
  }catch(e){
    return null;
  }
}

function makeFileSync(){
  enforceSafeContrast();
  const c=[1,2,3,4,5,6,7,8].map(i=>$("c"+i).value),op=$("sOp").value/100;
  const ov=argb(c[1],0.18),rp=argb(c[6],0.24),bg=argb(c[0],op);
  const br=argb(c[1],Math.min(0.92,op+0.18));
  const solidBg=argb(c[0],0.96),popupBg=argb(c[1],0.96);
  const mb=argb(c[2],Math.min(0.94,op+0.20)),fb=argb(c[3],Math.min(0.90,op+0.14));
  const tx=argb(c[4],0.98),sb=argb(c[5],0.88),ac=argb(c[6],0.98),fl=argb(c[7],Math.min(0.88,op+0.10));
  const myBubTxt=lum(c[2])>0.72?argb("#0f172a",0.98):-1;
  const badgeTxt=lum(c[6])>0.72?argb("#0f172a",0.98):-1;

  const m={
    windowBackgroundWhite:bg,windowBackgroundGray:bg,windowBackgroundGrayShadow:ov,
    chats_background:bg,chats_pinnedOverlay:ov,chats_pinnedIcon:ac,listSelector:rp,
    dialogBackground:popupBg,dialogBackgroundGray:solidBg,dialogTextBlack:tx,
    dialogTextBlue:ac,dialogTextBlue2:ac,dialogTextGray:sb,dialogTextGray2:sb,dialogTextGray3:sb,
    dialogIcon:ac,dialogButton:ac,
    actionBarDefault:br,actionBarDefaultIcon:tx,actionBarDefaultTitle:tx,actionBarDefaultSubtitle:sb,
    actionBarDefaultSelector:rp,actionBarDefaultSearch:tx,actionBarDefaultSearchPlaceholder:sb,
    actionBarDefaultSubmenuBackground:popupBg,actionBarDefaultSubmenuItem:tx,actionBarDefaultSubmenuItemIcon:ac,
    actionBarActionModeDefault:popupBg,actionBarActionModeDefaultIcon:tx,actionBarActionModeDefaultTop:br,
    actionBarActionModeDefaultSelector:rp,actionBarTabActiveText:ac,actionBarTabUnactiveText:sb,
    actionBarTabLine:ac,actionBarTabSelector:rp,
    windowBackgroundWhiteBlackText:tx,windowBackgroundWhiteGrayText:sb,windowBackgroundWhiteGrayText2:sb,
    windowBackgroundWhiteGrayText3:sb,windowBackgroundWhiteGrayText4:sb,windowBackgroundWhiteGrayText5:sb,
    windowBackgroundWhiteGrayText6:sb,windowBackgroundWhiteGrayText7:sb,windowBackgroundWhiteGrayText8:sb,
    windowBackgroundWhiteValueText:ac,windowBackgroundWhiteBlueText:ac,windowBackgroundWhiteBlueText2:ac,
    windowBackgroundWhiteBlueText3:ac,windowBackgroundWhiteBlueText4:ac,windowBackgroundWhiteBlueText5:ac,
    windowBackgroundWhiteBlueText6:ac,windowBackgroundWhiteBlueText7:ac,windowBackgroundWhiteBlueHeader:ac,
    windowBackgroundWhiteLinkText:ac,windowBackgroundWhiteLinkSelection:rp,
    profile_title:tx,profile_status:sb,profile_actionIcon:tx,profile_actionBackground:popupBg,
    profile_actionPressedBackground:rp,profile_verifiedBackground:ac,profile_verifiedCheck:badgeTxt,
    chats_name:tx,chats_nameArchived:sb,chats_nameIcon:ac,chats_message:sb,chats_messageArchived:sb,
    chats_date:sb,chats_unreadCounter:ac,chats_unreadCounterText:badgeTxt,chats_unreadCounterMuted:rp,
    chats_actionMessage:ac,chats_attachMessage:ac,chats_draft:ac,chats_secretName:ac,chats_secretIcon:ac,
    divider:ov,
    chat_outBubble:mb,chat_outBubbleSelected:mb,chat_outBubbleShadow:ov,chat_messageTextOut:myBubTxt,
    chat_outTimeText:sb,chat_outTimeSelectedText:sb,chat_outSentCheck:ac,chat_outSentCheckSelected:ac,
    chat_outSentClock:sb,chat_outReplyNameText:myBubTxt,chat_outReplyMessageText:myBubTxt,chat_outReplyLine:myBubTxt,
    chat_inBubble:fb,chat_inBubbleSelected:fb,chat_inBubbleShadow:ov,chat_messageTextIn:tx,
    chat_inTimeText:sb,chat_inTimeSelectedText:sb,chat_inReplyNameText:ac,chat_inReplyMessageText:sb,
    chat_inReplyLine:ac,
    chat_serviceBackground:fl,chat_serviceBackgroundSelected:fl,chat_serviceText:tx,
    chat_messagePanelBackground:br,chat_messagePanelText:tx,chat_messagePanelHint:sb,
    chat_messagePanelIcons:ac,chat_messagePanelSend:ac,chat_emojiPanelBackground:popupBg,
    chat_emojiPanelIcon:sb,chat_emojiPanelIconSelected:ac,chat_emojiPanelBackspace:sb,
    chat_emojiSearchBackground:solidBg,
    switchTrack:rp,switchTrackChecked:ac,switchThumb:tx,switchThumbChecked:tx,
    checkbox:ac,checkboxCheck:badgeTxt,chat_wallpaper:0
  };

  let txt="// Liquid Glass Studio v7\n";
  for(const k in m)txt+=k+"="+m[k]+"\n";

  const enc=new TextEncoder();
  const imgBytes=getWallpaperBytesSync();
  const fn=($("tName").value.trim()||"LiquidGlass_Theme").replace(/[^a-zA-Z0-9_-]/g,"_")+".attheme";

  if(imgBytes && imgBytes.length>100){
    const hB=enc.encode(txt+"\nWPS\n"),fB=enc.encode("\nWPE\n");
    const out=new Uint8Array(hB.length+imgBytes.length+fB.length);
    out.set(hB,0);out.set(imgBytes,hB.length);out.set(fB,hB.length+imgBytes.length);
    return new File([out],fn,{type:"application/octet-stream"});
  }
  return new File([txt],fn,{type:"application/octet-stream"});
}

$("bMood").onclick=()=>{
  const v=$("moodIn").value.toLowerCase();
  if(v.includes("auto")&&loadedImg){extractFromWallpaper(loadedImg);note("🎨 Auto-matched!");return}
  if(v.includes("pink")||v.includes("sakura")||v.includes("aesthetic"))setP("sakura");
  else if(v.includes("purple")||v.includes("lavender"))setP("lavender");
  else if(v.includes("green")||v.includes("sage"))setP("emerald");
  else if(v.includes("white")||v.includes("light"))setP("crystal");
  else if(v.includes("blue")||v.includes("ice"))setP("ice");
  else setP("midnight");
  note("✨ Preset applied!");
};
$("chipBox").onclick=e=>{if(e.target.dataset.k)setP(e.target.dataset.k)};
$("wIn").onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  $("fLbl").textContent=f.name;
  const r=new FileReader();
  r.onload=ev=>{
    $("w1").style.backgroundImage=$("w2").style.backgroundImage=`url(${ev.target.result})`;
    const im=new Image();
    im.onload=()=>{loadedImg=im;extractFromWallpaper(im);note("🎨 Wallpaper + Auto Colors ready!")};
    im.src=ev.target.result;
  };
  r.readAsDataURL(f);
};
document.querySelectorAll("input[type=color],input[type=range]").forEach(el=>el.oninput=render);

$("bDl").onclick=()=>{
  try{
    const f=makeFileSync();
    const u=URL.createObjectURL(f);
    const a=document.createElement("a");
    a.href=u;a.download=f.name;
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(u),2000);
    note(`✅ Downloaded (${Math.round(f.size/1024)} KB): ${f.name}`);
  }catch(e){
    note("❌ Error: "+e.message);
  }
};

$("bSh").onclick=async()=>{
  try{
    const f=makeFileSync();
    if(navigator.canShare && navigator.canShare({files:[f]})){
      await navigator.share({files:[f],title:f.name});
      note("📤 Shared to Telegram!");
      return;
    }
  }catch(e){}
  $("bDl").click();
};

$("bFx").onclick=()=>{
  if(loadedImg)extractFromWallpaper(loadedImg);
  else enforceSafeContrast();
  render();
  note("🛡️ Menus & bio contrast locked!");
};

$("jsState").textContent="Ready ✓";
setP("sakura");
