// film4_patch.js — v4: the daydream restructure. REALITY = present-day Jay (red hoodie, no mask, no sword), warm & calm;
// FANTASY = the ninja world, night palette. Three escalating slips (那里 / 这里 / 心里), pre-choruses snap back home
// (ikebana, mother's call), verse 2 revisits in snow and drifts faster, hard wake at the izakaya counter.
// Also: rim/stroke removed (env5), corner blowgun + shogunate rebuilt, 隐身 dissolve, Sekiro-style bamboo duel, sparks on every clash.
(function(G){
const {P,mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,capsule,blob}=G.K; const E=G.E, E4=G.E4, E5=G.E5, F=G.FILM, SPR=G.SPR, D=G.DATA; const W=1920,H=1080;
const {g5,J,Ja,poof}=F; const shot=F.shot; const C=E4.C; const GY=930, MASTER=1300, SEAT=900;
const REPL=['S01','O4','O5','O9','S05','S06','S07','S11','S12','S13','S14','S18','S19','S21','S22','S23','S25','S30','S31','S32','S33','S41','S42'];
F.SHOTS=F.SHOTS.filter(s=>!REPL.includes(s.id));
const N32=32, R=SPR.REMAP;
// ninja Jay seen in water: dark body, his red scarf/mask kept, pale eye band
R.mirrorJay=Array.from({length:N32},(_,i)=>[7,8,9].includes(i)?i:(i===23||i===22?30:(i===0?1:3)));
R.samurai=Array.from({length:N32},(_,i)=>i===0?0:(i===23||i===22?18:1));
R.ghost=Array.from({length:N32},(_,i)=>i===0?-1:29);
// reality redirect: the v3 off-duty Jay (T set) is replaced by modern Jay (H set) everywhere
const REDIR={walk_umb:1,umb_close:1,glance:1,tap:1};
const _sd=SPR.draw; SPR.draw=(c,set,anim,k,wx,wy,face,remap,dx,dy)=>{ if(set==='T'&&REDIR[anim]) set='H'; return _sd(c,set,anim,k,wx,wy,face,remap,dx,dy); };
const _fa=SPR.frameAt; SPR.frameAt=(set,anim,t,t0)=>_fa(set==='T'&&REDIR[anim]?'H':set,anim,t,t0);
const Hs=(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,'H');
const Ls=(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,'L');
const Ts=(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,'T');
const Ds=(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,'D');
const fl=(t)=>0.9+0.1*Math.sin(t*23)*Math.sin(t*7.3);
const WARM=[0.98,0.9,0.82], NIGHTA=[0.6,0.66,1.0];
const warmify=(k)=>{ const a=F.FX.amb||[1,1,1]; F.FX.amb=a.map((v,i)=>lerp(v,WARM[i],k)); };
const regulars=(c,t)=>{ Ts(c,'r1_drink',t,0,480,930,1); Ts(c,'r2_laugh',t,0.4,1750,930,-1); };
const BAY=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
// big pixel petal / red thread for the final counter insert
const petal=(c,x,y,s)=>{ blob(c,[[x-20*s,y],[x,y-14*s],[x+24*s,y-4*s],[x+6*s,y+12*s]],'#F2B6C0'); rect(c,g5(x-5*s),g5(y-5*s),g5(15*s),5,'#FFF8EC'); rect(c,g5(x+12*s),g5(y-3*s),5,5,'#D8728A'); };

// ---------- sprite dissolve (隐身): erase from the feet up through a Bayer threshold; scarf/mask survive ----------
const [dcv,dctx]=(()=>{ const cv=document.createElement('canvas'); cv.width=320; cv.height=320; return [cv,cv.getContext('2d',{willReadFrequently:true})]; })();
function dissolve(c,set,anim,k,wx,wy,face,level,mode,off,remap){ const a=SPR.data.sets[set][anim]; const flip=face<0; const ox=flip?a.w-1-a.ox:a.ox;
  dctx.setTransform(1,0,0,1,0,0); dctx.clearRect(0,0,320,320); SPR.blit(dctx,set,anim,k,ox,a.oy,face,remap||null);
  const w=a.w,h=a.h; const im=dctx.getImageData(0,0,w,h), d=im.data, src=new Uint8ClampedArray(d);
  const isRed=(q)=>src[q]>150&&src[q+1]<110&&src[q+2]<100; const top=a.oy;
  for(let y=0;y<h;y++) for(let x=0;x<w;x++){ const q=(y*w+x)*4; if(!src[q+3]) continue; const f=(a.oy-y)/top; const red=isRed(q);
    let keep=true, pale=false;
    if(mode==='scarf') keep=red;
    else if(mode==='outline'){ const n=(xx,yy)=>xx<0||yy<0||xx>=w||yy>=h||!src[(yy*w+xx)*4+3]; keep=n(x-1,y)||n(x+1,y)||n(x,y-1)||n(x,y+1); pale=keep; if(keep&&(x+y)%3===0) keep=false; }
    else { const th=level*1.2-0.1+(BAY[y&3][x&3]/16-0.5)*0.16; if(f<th){ keep=red&&mode!=='all'; } else if(f<th+0.05) pale=true; }
    if(!keep){ d[q+3]=0; continue; } if(pale&&!red){ d[q]=0xC8; d[q+1]=0xD4; d[q+2]=0xF0; } }
  dctx.putImageData(im,0,0); const m=c.getTransform(); const lx=Math.round(m.a*wx+m.e+(off?off[0]:0)), ly=Math.round(m.d*wy+m.f+(off?off[1]:0));
  c.save(); c.setTransform(1,0,0,1,0,0); c.imageSmoothingEnabled=false; c.drawImage(dcv,0,0,w,h,lx-ox,ly-a.oy,w,h); c.restore(); }
// squashed water reflection of a sprite (rows decimated, wobbling) — for puddles shallower than the figure
function reflectSq(c,set,anim,k,wx,wy,face,remap,t,sq,amp){ const a=SPR.data.sets[set][anim]; const flip=face<0; const ox=flip?a.w-1-a.ox:a.ox;
  dctx.setTransform(1,0,0,1,0,0); dctx.clearRect(0,0,320,320); SPR.blit(dctx,set,anim,k,ox,a.oy,face,remap); const m=c.getTransform(); const lx=Math.round(m.a*wx+m.e), ly=Math.round(m.d*wy+m.f);
  c.save(); c.setTransform(1,0,0,1,0,0); c.imageSmoothingEnabled=false; const n=Math.round(a.oy*sq);
  for(let r=0;r<n;r++){ const sy=a.oy-Math.floor(r/sq); if(sy<0) break; if((r&1)&&r>n*0.5) continue; const off=Math.round(Math.sin(r*1.1+t*6)*(amp||1)); c.drawImage(dcv,0,sy,a.w,1,lx-ox+off,ly+r,a.w,1); } c.restore(); }
// Bayer region swap helper (for the 心里 room → shogunate transform): draws fnB over the current image where mask(x,y,bayer) is true
const [scv,sctx]=(()=>{ const cv=document.createElement('canvas'); cv.width=384; cv.height=216; return [cv,cv.getContext('2d',{willReadFrequently:true})]; })();

// ======================= S01 0–8.93 — title: rain over the old capital's roofs (no hero yet: reality has no ninja) =======================
shot('S01',0,8.93,(c,t)=>{ const tilt=eio(inv(3.4,7.2,t)); const by=g5(lerp(1250,760,tilt));
  E5.SKY(c,t,4,1080); E.moon(c,1240,g5(lerp(470,240,tilt)),250,{}); E5.clouds(c,t,[[g5(lerp(560,330,tilt)),15,12,620,'#2E3756',200],[g5(lerp(700,470,tilt)),10,-8,460,'#253052',1300]]);
  E5.mountains(c,0,by-60,170,'#1C2238',5);
  E.roofRow(c,-80,by+20,0.6,14,'#1C2238',null,'#1C2238',11,{lamp:'#B8562E',lattice:'#141A30'}); E5.cityLights(c,t,-80,2000,by-20,11);
  E.roofRow(c,-160,by+200,0.95,9,'#141A30',null,'#141A30',12,{lamp:'#D8742E',lattice:'#0E1020'});
  // a crow crosses the moon
  const cu=inv(4.2,7.6,t); if(cu>0&&cu<1){ const x=g5(lerp(-80,2000,cu)), y=g5(lerp(420,300,cu)+Math.sin(cu*30)*12), up=Math.floor(t*8)%2; rect(c,x-10,y,20,10,'#0E1020'); poly(c,up?[[x-40,y-20],[x,y],[x-5,y+5]]:[[x-40,y+20],[x,y],[x-5,y+5]],'#0E1020'); poly(c,up?[[x+40,y-20],[x,y],[x+5,y+5]]:[[x+40,y+20],[x,y],[x+5,y+5]],'#0E1020'); rect(c,x+10,y-5,10,5,'#0E1020'); }
  // foreground ridge (kawara) with a puddle catching the moon
  const ry=g5(lerp(1300,980,tilt)); rect(c,-100,ry,2200,300,'#0E1020'); for(let x=-100;x<2100;x+=40) rect(c,x,ry,30,15,'#1C2238'); rect(c,-100,ry-10,2200,10,'#2E3756');
  if(t>3.2){ F.rain(c,t,{seed:5,gy:ry,x0:0,x1:1920,depth:0,ns:0,dens:clamp((t-3.2)/2,0,0.8)}); }
  F.amb([0.62,0.68,0.98]); F.light(c,1240,g5(lerp(470,240,tilt)),600,'#C8D4F0',0.18,{ry:0.8});
  // the story scroll unrolls (title frame)
  const so=eo(inv(0.2,1.2,t)); if(so<1){ const w=g5(lerp(0,1920,so)); rect(c,0,0,960-w/2,H,'#0E1020'); rect(c,960+w/2,0,960,H,'#0E1020'); rect(c,960-w/2-20,0,20,H,'#93603C'); rect(c,960+w/2,0,20,H,'#93603C'); }
});

// ======================= O4 12.63–14.35 — the bowl (insert): modern sleeves enter from the SIDES, hands above the caption band =======================
shot('O4',12.63,14.35,(c,t)=>{ const lt=t-12.63; const by=g5(lerp(-30,0,eo(inv(0,0.4,lt)))); const lift=t>13.95?g5(-eo(inv(13.95,14.35,t))*25):0;
  E4.bowl(c,t,{dy:by+lift,rip:t>14.0,rings:[[12.75,0,0],[13.38,140,150],[13.62,140,150],[14.17,-60,-30]],shadowPass:inv(14.0,14.28,t)});
  const bx=960, byy=470+by+lift;
  if(t<13.1){ const k=SPR.frameAt('T','hands_master',t,12.63); const ry=t>12.95?g5(-eo(inv(12.95,13.1,t))*300):0; J(c,'hands_master',k,bx,byy+ry,1,null,'T'); }
  if(t>=13.08){ const k=SPR.frameAt('H','hands_side',t,13.08); const sl=g5((1-eo(inv(13.08,13.32,t)))*420); const m=c.getTransform();
    c.save(); c.beginPath(); c.rect(0,0,bx,H); c.clip(); J(c,'hands_side',k,bx-sl,byy,1,null,'H'); c.restore();
    c.save(); c.beginPath(); c.rect(bx,0,W,H); c.clip(); J(c,'hands_side',k,bx+sl,byy,1,null,'H'); c.restore(); }
  const dp=inv(13.95,14.17,t); if(dp>0&&dp<1){ rect(c,900,g5(lerp(-40,490+by,ei(dp))),10,20,'#C8D4F0'); }
  F.amb(WARM); F.light(c,960,420,700,'#FFC870',0.25,{ry:0.7});
});
// ======================= O5 14.35–15.49 — the garden pond: FIRST SLIP — the water shows a ninja with his red scarf =======================
shot('O5',14.35,15.49,(c,t)=>{ const lt=t-14.35; const camX=g5(lerp(-40,120,lt/1.14));
  E4.garden(c,t,{camX,mirror:(c,pond)=>{ const u=inv(0.3,1.0,lt); if(u>0&&u<1){ const m=c.getTransform(); const ly=Math.round(m.d*pond[0]+m.f), y1=Math.round(m.d*pond[1]+m.f);
    F.mirrorSprite(c,'L','run',SPR.frameAt('L','run',t,14.35),g5(lerp(1500,600,u)),pond[0]+5,-1,'mirrorJay',t,1.5,[0,ly,384,y1-ly]); } }});
},{k:'ripple',d:0.5,c:[0.47,0.43]});
// ======================= O9 17.74–18.60 — calm: the bell is still there; Jay looks up from his soup (the theft was only in his head) =======================
shot('O9',17.74,18.60,(c,t)=>{ const lt=t-17.74; const camX=-250;
  E4.izakaya3(c,t,{camX,bell:'off',behind:(c)=>Ts(c,'m_stir',t,0,MASTER,930,-1),
    front:(c)=>{ Ts(c,'r1_drink',t,0,480,930,1); Ts(c,'cat_sit',t,0,-150,930,1); if(t<18.05) Hs(c,'chew',t,17.74,SEAT,930,1); else Hs(c,'glance',t,18.05,SEAT,930,1); E4.steam(c,t,SEAT+110,700,3,{h:200}); } });
  E5.bellProp(c,t,camX,{glint:t>18.0});
  warmify(0.35);
});
// O1 O2 O3 O6 O7 (kept from v3, Jay redirected to modern clothes): reality is warm
for(const s of F.SHOTS) if(['O1','O2','O3','O6','O7'].includes(s.id)){ const f=s.fn; s.fn=(c,t)=>{ f(c,t); warmify(0.3); }; }
// O8 stays the bell-snatch insert but in the night palette: a flash of the fantasy (it never happened)
for(const s of F.SHOTS) if(s.id==='O8'){ const f=s.fn; s.fn=(c,t)=>{ f(c,t); F.FX.lights=[]; F.amb([0.5,0.56,0.95]); F.light(c,1400,300,600,'#8C9CC8',0.35,{ry:0.8}); F.tintL&&0; }; }

// ======================= S05 18.60–20.72 — 那里: through the rainy izakaya window the torii chase plays inside the glass =======================
const WIN=[860,110,1000,640];
shot('S05',18.60,20.72,(c,t)=>{ const lt=t-18.60; const flash=t>=19.754&&t<19.754+0.2;
  // interior wall (warm), counter edge
  rect(c,0,0,W,H,'#4A2A1C'); F.planks(c,0,0,W,800,70,[C.w2,C.w3,C.w1,C.w4],52,true); rect(c,0,800,W,280,C.w1); rect(c,0,800,W,20,C.w4); rect(c,0,820,W,10,C.w0);
  // window: fantasy inside the glass (night torii tunnel, zoomed down)
  const [wx,wy,ww,wh]=WIN; c.save(); c.beginPath(); c.rect(wx,wy,ww,wh); c.clip();
  const z=0.56, ox=wx+ww/2, oy=wy+wh/2; c.save(); c.translate(ox-960,oy-540); E.zoom(c,z,960,600,()=>{ E.toriiTunnel(c,t,lt*700,{}); }); c.restore();
  const sc=(x,y)=>[ox+(x-960)*z, oy+(y-600)*z];
  { const u=inv(0,2.1,lt); const [tx,ty]=sc(lerp(500,1700,u),GY); Ja(c,'run',t,18.6,g5(tx),g5(ty),1,'shadow'); F.bell(c,g5(tx+20),g5(ty-40),t);
    const [jx,jy]=sc(lerp(150,1350,u),GY); Ja(c,'run',t,18.65,g5(jx),g5(jy),1,null); }
  if(flash){ rect(c,wx,wy,ww,wh,'#F2E8D5'); Ja(c,'hold',t,19.754,g5(ox+120),g5(wy+wh-40),-1,'silL','KL'); }
  // raindrops running down the glass + Jay's faint reflection
  const r=mulberry(77); for(let k=0;k<40;k++){ const x=g5(wx+r()*ww), sp=60+r()*140, y=g5(wy+((r()*wh+t*sp)%wh)); rect(c,x,y,5,10,'#8C9CC8'); rect(c,x,y-15,5,10,'#4A5378'); }
  c.restore();
  // window frame + lattice (warm wood)
  rect(c,wx-30,wy-30,ww+60,30,C.w0); rect(c,wx-30,wy+wh,ww+60,40,C.w0); rect(c,wx-30,wy-30,30,wh+70,C.w0); rect(c,wx+ww,wy-30,30,wh+70,C.w0);
  for(const k of [1,2]) rect(c,wx+ww*k/3-5,wy,10,wh,C.w1); rect(c,wx,wy+wh/2-5,ww,10,C.w1); rect(c,wx-30,wy+wh,ww+60,8,C.w4);
  // akachochin hanging at left, sake bottles on the sill
  E4.akachochin&&E4.akachochin(c,330,250,t,{});
  for(const [bx,col] of [[960,'#2F4A3A'],[1010,'#4A2A1C'],[1720,'#2F4A3A']]){ rect(c,bx,wy+wh-70,30,70,col); rect(c,bx+8,wy+wh-100,14,30,col); rect(c,bx+5,wy+wh-50,20,20,'#F2E8D5'); }
  // Jay (modern) at the counter, turning to the window
  Hs(c,t<19.6?'glance':'react_seat',t,t<19.6?18.75:19.62,560,GY,1);
  E4.steam(c,t,430,760,3,{h:180}); rect(c,370,770,120,30,'#2E3756'); rect(c,380,760,100,15,'#93603C');
  F.amb(WARM); F.light(c,330,250,520,'#F09A48',0.6*fl(t),{ry:0.9}); F.light(c,wx+ww/2,wy+wh/2,700,'#8C9CC8',flash?0.8:0.18,{ry:0.7}); if(flash) F.flashL(0.3);
},{k:'dissolve',d:0.3});

// ======================= S06 20.72–22.87 — 这里: a ninja right here in the room (corner blowgun) =======================
const tBlow=21.86;
shot('S06',20.72,22.87,(c,t)=>{
  if(t<21.30){ // (a) izakaya wide: something stirs in the dark corner by the window
    const camX=250; const em=inv(20.95,21.28,t);
    E4.izakaya3(c,t,{camX,bell:'off',behind:(c)=>Ts(c,'m_stir',t,0,MASTER,930,-1),front:(c)=>{ Ts(c,'r1_drink',t,0,480,930,1); Hs(c,'chew',t,20.72,SEAT,930,1);
      if(em>0){ c.save(); c.translate(-camX,0); const k=SPR.frameAt('D','blowgun',t,20.95); dissolve(c,'D','blowgun',Math.min(1,k),1950,930,-1,1-em,'body',null,'shadow'); c.restore(); } }});
    E5.bellProp(c,t,camX,{});
    // the corner swallows the light
    E.dither(c,1500,0,420,H,'#0E1020',f=>0.55); if(t<20.95||Math.floor(t*10)%3===0){ rect(c,1690,700,5,5,'#F2E8D5'); rect(c,1710,700,5,5,'#F2E8D5'); }
    warmify(0.3); return; }
  if(t<tBlow){ // (b) corner close: the ninja emerges, raises the pipe, cheeks puff
    E5.corner(c,t,{lx:1585,ly:300}); const kk=Math.min(5,Math.floor((t-21.30)/0.11)); const em=inv(21.30,21.5,t);
    if(em<1) dissolve(c,'D','blowgun',kk,1600,900,-1,1-em,'body',null,'shadow'); else J(c,'blowgun',kk,1600,900,-1,'shadow','D');
    if(Math.floor(t*12)%4!==0) { rect(c,1510,610,5,5,'#F2E8D5'); }
    F.amb([0.52,0.58,0.98]); F.light(c,1585,500,380,'#8C9CC8',0.45,{ry:1.2}); return; }
  if(t<22.30){ // (c) slow-mo dart with a light streak
    const u=inv(tBlow,22.30,t); rect(c,0,0,W,H,'#141A30'); const r=mulberry(4); for(let k=0;k<26;k++){ const y=g5(r()*H), x=g5(((r()*W)-(t*2600))%W+W)%W; rect(c,x,y,g5(120+r()*300),5,k%3?'#253052':'#2E3756'); }
    rect(c,0,820,W,260,'#2A1E1A'); for(let x=0;x<W;x+=60) rect(c,g5((x-t*900)%W+W)%W,840,30,5,'#4A2A1C');
    const dx=g5(lerp(1600,320,u)), dy=500; rect(c,dx,dy,g5(lerp(200,900,u)),5,'#5A6A9A'); rect(c,dx,dy-5,g5(lerp(100,500,u)),5,'#C8D4F0'); rect(c,dx+40,dy,200,10,'#E2D3B8'); rect(c,dx+40,dy+3,200,4,'#93603C'); poly(c,[[dx,dy+5],[dx+45,dy-5],[dx+45,dy+15]],'#C8D4F0'); poly(c,[[dx+230,dy+5],[dx+290,dy-35],[dx+260,dy+5],[dx+290,dy+45]],'#D8402F'); rect(c,dx+2,dy+3,10,5,'#FFF8EC');
    rect(c,dx,1000-(dy-500)/3,g5(lerp(100,500,u)),5,'#4A5378');
    F.amb([0.55,0.6,1.0]); F.light(c,dx,dy,260,'#C8D4F0',0.6,{add:true}); return; }
  // (d) thunk: the dart quivers in the counter beside his bowl; he jolts — the corner is empty
  const z=1.45, cx=SEAT+200, cy=GY-390/z; const sx=g5(960+(SEAT-cx)*z);
  E.zoom(c,z,cx,cy,()=>{ E4.izakaya3(c,t,{camX:0,bell:'off',behind:(c)=>Ts(c,'m_stir',t,0,MASTER,930,-1)}); });
  Hs(c,'react_seat',t,22.30,sx,930,1); E4.steam(c,t,sx+160,700,3,{h:180});
  const qa=Math.sin((t-22.30)*60)*Math.max(0,1-(t-22.30)*3)*0.25; c.save(); c.translate(sx+330,720); c.rotate(-0.5+qa); rect(c,0,-150,10,150,'#E2D3B8'); poly(c,[[-15,-150],[5,-210],[25,-150]],'#D8402F'); c.restore();
  if(t<22.45) F.sparks(c,t,22.30,sx+330,720,5);
  warmify(0.3);
});

// ======================= S07 22.87–25.08 — 心里: the whole room turns to shogunate night, then the castle reveal =======================
function castleWorld(c,t,lt){ // grand Edo castle: sky, mountains, fog, keep, moat, samurai parade with lanterns & banners
  const tilt=eio(inv(0,1.0,lt)); const ty=g5(lerp(100,0,tilt));
  E5.SKY(c,t,13,900); E.moon(c,1420,g5(220+ty*0.3),190,{}); E5.clouds(c,t,[[300+ty*0.3,15,14,620,'#2E3756',100],[420+ty*0.3,10,-9,500,'#253052',900]]);
  E5.mountains(c,0,640+ty*0.4,200,'#1C2238',31); E5.cityLights(c,t,-100,2100,600+ty*0.4,17,'#F09A48');
  c.save(); c.translate(0,ty*0.6); for(const [yy,v,col,dd] of [[640,22,'#4A5378',0.35]]){ const x=((t*v)%240); E.dither(c,-240+x,yy,2400,90,col,dd); }
  E.castle(c,t,1000,800,1.9,{banners:(i)=>clamp((lt-0.25*i)/0.3,0,1)}); c.restore();
  c.save(); c.translate(0,ty);
  // ishigaki base line + moat
  rect(c,-100,860,2100,40,'#43475A'); for(let x=-100;x<2000;x+=60){ rect(c,x,865,55,15,'#5A5F73'); } rect(c,-100,900,2100,180,'#12303A'); rect(c,-100,900,2100,5,'#0E1020');
  for(let j=0;j<7;j++){ const w=g5(70-j*7+Math.sin(t*3+j)*12), off=g5(Math.sin(t*4+j*1.7)*18); rect(c,1420+off-w,920+j*14,w*2,5,j%2?'#C8D4F0':'#8C9CC8'); }
  F.ripples(c,t,{n:8,x0:-100,x1:2000,y0:920,y1:1070,r0:5,r1:30,sq:0.3,col:'#5FB0A8',per:0.7,seed:30});
  // stone bridge and the parade crossing it (lanterns, yari, sashimono banners)
  rect(c,-100,820,2100,30,'#5A5F73'); rect(c,-100,815,2100,8,'#7E7C76'); for(let x=-80;x<2000;x+=160) rect(c,x,770,15,50,'#43475A'); rect(c,-100,850,2100,10,'#2E3756');
  for(let k=0;k<14;k++){ const x=g5(((2100-k*150-lt*90)%2300+2300)%2300-200); const ph=(t+k*0.37); Ja(c,'walk',t,k*0.13,x,815,-1,'samurai');
    rect(c,x+25,560,5,260,'#1C2238'); poly(c,[[x+20,560],[x+27,520],[x+35,560]],'#C8D4F0');
    if(k%2){ rect(c,x-30,600,5,60,'#1C2238'); rect(c,x-55,600,30,70,k%4===1?'#D8402F':'#E2D3B8'); circ(c,x-40,630,10,'#0E1020'); }
    else { rect(c,x-40,700,5,40,'#1C2238'); rect(c,x-55,740,35,45,'#FFC870'); rect(c,x-55,740,35,8,'#D8402F'); F.light(c,x-38,760,150,'#FFC870',0.35*fl(ph),{add:true}); } }
  c.restore();
  F.reflect(c,{y0:900+ty,y1:1080,k:0.45,dark:0.6,amp:1.5,t,tint:'#A8E0D0'});
  // foreground: a near roof corner, ninja Jay watching (silhouette with the red scarf)
  poly(c,[[1400,1080],[1600,900],[2000,860],[2000,1080]],'#0E1020'); for(let x=1600;x<2000;x+=40) rect(c,x,g5(900-(x-1600)*0.1),30,10,'#1C2238');
  Ls(c,'look',t,0,1700,g5(890),-1,'sil');
  E.dither(c,0,980,W,100,'#253052',0.3);
  F.amb([0.55,0.62,1.0]); F.light(c,1420,220,700,'#C8D4F0',0.2,{ry:0.8}); }
shot('S07',22.87,25.08,(c,t)=>{ const lt=t-22.87;
  if(t<23.98){ // (a) the room goes night: warm → indigo, back wall dissolves to the castle world (Bayer sweep), Jay flickers into the ninja
    const k=eio(inv(22.95,23.6,t)); const camX=-100; const nin=t>=23.98||(t>23.4&&Math.floor(t*15)%2===0);
    E4.izakaya3(c,t,{camX,bell:'off',behind:(c)=>Ts(c,'m_stir',t,0,MASTER,930,-1,k>0.5?'shadow':null),front:(c)=>{ Ts(c,'r1_drink',t,0,480,930,1,k>0.5?'shadow':null); Ts(c,'r2_laugh',t,0.4,1750,930,-1,k>0.5?'shadow':null);
      if(nin) Ls(c,'react_seat',t,23.4,SEAT,930,1); else Hs(c,'chew',t,22.87,SEAT,930,1); }});
    E5.bellProp(c,t,camX,{});
    const lights=F.FX.lights; F.FX.lights=lights.map(L=>Object.assign({},L,{k:L.k*(1-k*0.8)})); F.FX.amb=WARM.map((v,i)=>lerp(v,NIGHTA[i],k));
    const sw=inv(23.35,23.98,t); if(sw>0){ // sweep: castle world replaces the wall above the counter
      const m=c.getTransform(); const img=c.getImageData(0,0,384,216); c.save(); castleWorld(c,t,0); c.restore(); const B=c.getImageData(0,0,384,216); const a=img.data,b=B.data;
      for(let y=0;y<216;y++) for(let x=0;x<384;x++){ const q=(y*384+x)*4; const thr=(y/143)*0.6+BAY[y&3][x&3]/16*0.4; if(y<143&&thr<sw*1.1){ a[q]=b[q];a[q+1]=b[q+1];a[q+2]=b[q+2]; } }
      c.putImageData(img,0,0); }
    return; }
  castleWorld(c,t,t-23.98);
},{k:'cut'});

// ======================= home set (pre-choruses): reality, warm. S11–S14 / S30–S33 =======================
const leafCut=(c,t,ts,x,y,s,seed)=>{ const u=t-ts; if(u<0||u>1.2) return; const r=mulberry(seed||3); for(let k=0;k<5;k++){ const a=-1.2+r()*1.4, v=200+r()*220; const px=g5(x+Math.cos(a)*v*u*s), py=g5(y+Math.sin(a)*v*u+500*u*u); blob(c,[[px-25,py],[px,py-12],[px+25,py],[px,py+10]],k%2?C.fol2:C.fol1); }
  if(u<0.12){ c.save(); c.translate(x,y); c.rotate(-0.35*s); rect(c,-260,-3,520,6,'#FFF8EC'); c.restore(); } };
const HOMEPRE=(c,t)=>{ F.amb(WARM); };
const hp=(z,cx,cy)=>(x,y)=>[g5(960+(x-cx)*z),g5(540+(y-cy)*z)];
shot('S11',37.22,39.37,(c,t)=>{ const lt=t-37.22; const camX=g5(lerp(-60,40,lt/2.15));
  const z=1.08, cx=1000+camX, cy=850; E.zoom(c,z,cx,cy,()=>E5.home(c,t,{phone:false})); const P=hp(z,cx,cy); const [jx,jy]=P(1000,940); if(t<37.8) Hs(c,'idle',t,37.22,jx,jy,1); else Hs(c,'seal',t,37.8,jx,jy,1); HOMEPRE(c,t); },{k:'flash'});
shot('S12',39.37,41.56,(c,t)=>{ const z=1.3, cx=1050, cy=760; const s1=39.5, s2=40.85;
  E.zoom(c,z,cx,cy,()=>E5.home(c,t,{phone:false})); const sx=g5(960+(1050-cx)*z);
  const fy=g5(540+(940-cy)*z); if(t<s2-0.15) Hs(c,'slash',t,s1-0.2,sx-60,fy,1); else Hs(c,'slash',t,s2-0.2,sx+60,fy,-1);
  leafCut(c,t,s1,sx+200,620,1,3); leafCut(c,t,s2,sx-200,600,-1,5); HOMEPRE(c,t); });
const zHome=(t,t0,t1)=>lerp(1.0,1.12,eio(inv(t0,t1,t)));
shot('S13',41.56,44.03,(c,t)=>{ const z=zHome(t,41.56,44.03), cx=1200, cy=820; const P=(x,y)=>[g5(960+(x-cx)*z),g5(540+(y-cy)*z)];
  E.zoom(c,z,cx,cy,()=>E5.home(c,t,{phone:false,rip:42.9})); const [jx,jy]=P(1010,962); Hs(c,'seiza_snip',t,41.56,jx,jy,1);
  const u=inv(42.75,43.5,t); if(u>0&&u<1){ const [px,py]=P(1250,lerp(700,830,ei(u))); capsule(c,px,py,3,px+30,py-15,3,C.fol1); } HOMEPRE(c,t); },{k:'dissolve',d:0.4});
const phoneShot=(t0,t1,picked,snow,bamboo)=>(c,t)=>{ const lt=t-t0; const camX=g5(lerp(-40,20,lt/(t1-t0)));
  const z=1.12, cx=1040+camX, cy=830; E.zoom(c,z,cx,cy,()=>E5.home(c,t,{snow,bamboo,phone:{t0,t1:picked,picked},rip:t1-0.5})); const [jx,jy]=hp(z,cx,cy)(1000,962);
  if(t<picked){ Hs(c,'seiza',t,t0,jx,jy,1); } else Hs(c,t<picked+1.0?'phone':'phone_listen',t,picked,jx,jy,1);
  HOMEPRE(c,t); };
shot('S14',44.03,46.02,phoneShot(43.75,46.02,44.45,false,false));
// ======================= S18 59.62–64.16 — 隐身: rain, petals; Jay dissolves feet-up; only scarf + reflection remain; then nothing =======================
const CNT=[60.209,60.767,61.324,61.881];
shot('S18',59.62,64.16,(c,t)=>{ const lt=t-59.62; const jx=1000, jy=700; const camX=g5(lerp(-30,30,lt/4.5));
  E.castleRoof(c,t,camX,{rain:true,ridgeY:690});
  // a broad rain pool on the roof in front of him: the reflection stays after the body is gone
  const pcx=jx, pcy=815; ell(c,pcx,pcy,360,112,0,'#141A30'); ell(c,pcx,pcy,345,104,0,'#1C2238'); E.dither(c,pcx-300,pcy-90,600,30,'#2E3756',0.3);
  const lvl=t<CNT[0]?0:clamp((t-CNT[0])/(CNT[3]+0.35-CNT[0]),0,1); const gone=t>62.35;
  const anim=t<59.95?'idle':'seal', t0=t<59.95?59.62:59.95, k=SPR.frameAt('L',anim,t,t0);
  if(t<63.5&&(t<63.1||Math.floor(t*15)%2)){ c.save(); c.beginPath(); c.ellipse(pcx,pcy,340,100,0,0,6.283); c.clip(); reflectSq(c,'L',anim,k,jx,pcy-95,1,t>62.35?'mirrorJay':null,t,0.55,1); c.restore(); }
  F.ripples(c,t,{n:12,x0:pcx-300,x1:pcx+300,y0:pcy-80,y1:pcy+80,r0:5,r1:40,sq:0.25,col:'#5A6A9A',per:0.7,seed:18});
  if(!gone) dissolve(c,'L',anim,k,jx,jy,1,lvl,'body');
  else { const u=inv(62.35,63.7,t); if(u<1){ const off=[Math.round(eo(u)*190+u*u*60),Math.round(-u*60)]; dissolve(c,'L',anim,k,jx,jy,1,1,'scarf',off); } }
  if(t>=62.62&&t<62.62+2/30) dissolve(c,'L',anim,k,jx,jy,1,0,'outline');
  F.petals(c,t,61,70,{});
  F.amb([0.58,0.64,1.0]); F.light(c,1300,200,700,'#C8D4F0',0.2,{ry:0.8});
});

// ======================= S19 64.16–72.90 — bamboo duel (Sekiro-style, pixel): Jay vs a Kage ronin =======================
const BT=n=>64.157+n*0.5571;
const HS=[BT(4),BT(5),BT(6),BT(11),BT(13)];
const hitstop=t=>{ for(const h of HS){ if(t>=h&&t<h+3/30) return h; } return t; };
const SPK=[[BT(4),960,640],[BT(5),960,600],[BT(6),980,780],[BT(11),930,900],[BT(13),1000,700]];
F.SHAKES.push(...SPK.map(([t])=>({t,d:0.22,a:3})),{t:BT(9),d:0.3,a:2},{t:64.45,d:0.2,a:3});
F.FLASHES.push(...SPK.map(([t])=>({t,d:0.04,k:0.15})),{t:BT(13),d:0.07,k:0.3});
function duelBG(c,t,cam,z,cx,cy){ if(z&&z!==1) E.zoom(c,z,cx,cy,()=>E5.bambooDuel(c,t,{cam})); else E5.bambooDuel(c,t,{cam}); }
shot('S19',64.16,72.90,(c,t0)=>{ const t=hitstop(t0); const b=n=>BT(n);
  // positions over time
  let jx=700, rx=1220;
  if(t>b(3)){ const u=inv(b(3),b(4)-0.15,t); jx=g5(lerp(700,800,u)); rx=g5(lerp(1220,1120,u)); }
  if(t>b(7)-0.1){ jx=g5(lerp(800,840,inv(b(7)-0.1,b(7),t))); rx=g5(lerp(1120,1090,inv(b(7)-0.1,b(7),t))); }
  if(t>b(9)){ const u=eo(inv(b(9),b(9)+0.25,t)); jx=g5(lerp(840,760,u)); rx=g5(lerp(1090,1200,u)); }
  if(t>b(11)-0.13){ const u=eo(inv(b(11)-0.13,b(11),t)); rx=g5(lerp(1200,1060,u)); }
  if(t>b(13)-0.07){ const u=eo(inv(b(13)-0.07,b(13)+0.05,t)); jx=g5(lerp(760,1120,u)); }
  const tight=(t>=b(7)&&t<b(8))?1.4:(t>=b(10)&&t<b(11))?1.25:1; const cam=g5((t-64.16)*20);
  // ---- inserts ----
  if(t>=65.27&&t<65.83){ duelBG(c,t,cam,2.2,t<65.55?700:1220,600);
    if(t<65.55) Ja(c,'look',t,65.27,960,1180,1,null,'XL'); else Ds(c,'r_guard',t,64.16,960,GY-20,-1);
    F.amb([0.55,0.62,1.0]); return; }
  if(t>=b(7)+0.39&&t<b(7)+0.72){ duelBG(c,t,cam,2.4,880,560); Ja(c,'look',t,b(7),900,1200,1,null,'XL'); rect(c,0,200,W,10,'#C8D4F0'); F.amb([0.55,0.6,1.0]); return; }
  if(t>=b(7)+0.72&&t<b(9)){ // ECU: blades grinding, sparks
    rect(c,0,0,W,H,'#0E1020'); E.dither(c,0,0,W,H,'#16261E',0.4); const g=Math.sin(t*40)*10;
    c.save(); c.translate(960,540); c.rotate(-0.5); rect(c,-900,-25+g,1300,50,'#C8D4F0'); rect(c,-900,-25+g,1300,10,'#FFF8EC'); rect(c,-900,20+g,1300,5,'#5A6A9A'); c.restore();
    c.save(); c.translate(960,540); c.rotate(0.55); rect(c,-400,-25,1300,50,'#8C9CC8'); rect(c,-400,-25,1300,10,'#C8D4F0'); c.restore();
    for(let q=0;q<4;q++) F.sparks(c,t,b(7)+0.72+q*0.1,960,540,q+7);
    F.amb([0.5,0.55,0.95]); F.light(c,960,540,420,'#FFC870',0.6,{add:true}); return; }
  // ---- two-shot ----
  const cx=(jx+rx)/2, cy=GY-260; duelBG(c,t,cam,tight,cx,cy); const P=(x,y)=>[g5(960+(x-cx)*tight),g5(540+(y-cy)*tight)];
  const [JX,JY]=P(jx,GY), [RX,RY]=P(rx,GY);
  // ronin
  let ra='r_guard', rt=64.16;
  if(t>=b(3)&&t<b(4)-0.15){ ra='r_step'; rt=b(3); }
  if(t>=b(4)-0.133&&t<b(5)-0.07){ ra='r_high'; rt=b(4)-0.133; }
  if(t>=b(5)-0.067&&t<b(6)-0.133){ ra='r_parry'; rt=b(5)-0.067; }
  if(t>=b(6)-0.133&&t<b(7)-0.1){ ra='r_low'; rt=b(6)-0.133; }
  if(t>=b(7)-0.1&&t<b(9)){ ra='r_lock'; rt=b(7); }
  if(t>=b(9)&&t<b(10)){ ra='r_step'; rt=b(9); }
  if(t>=b(10)&&t<b(11)-0.13){ ra='r_tell'; rt=b(10); }
  if(t>=b(11)-0.13&&t<b(11)+0.07){ ra='r_thrust'; rt=b(11)-0.13; }
  if(t>=b(11)+0.07&&t<b(12)){ ra='r_pinned'; rt=b(11); }
  if(t>=b(12)&&t<b(13)+0.2){ ra='r_stagger'; rt=b(12); }
  // jay
  let ja='j_guard', jt=64.16;
  if(t<64.45){ ja=null; }
  if(t>=b(3)&&t<b(4)-0.15){ ja='j_step'; jt=b(3); }
  if(t>=b(4)-0.067&&t<b(5)-0.133){ ja='j_parry'; jt=b(4)-0.067; }
  if(t>=b(5)-0.133&&t<b(6)-0.07){ ja='j_high'; jt=b(5)-0.133; }
  if(t>=b(6)-0.067&&t<b(7)-0.1){ ja='j_parry'; jt=b(6)-0.067; }
  if(t>=b(7)-0.1&&t<b(9)){ ja='j_lock'; jt=b(7); }
  if(t>=b(9)&&t<b(11)-0.133){ ja='j_step'; jt=b(9); }
  if(t>=b(11)-0.133&&t<b(12)){ ja='j_mikiri'; jt=b(11)-0.133; }
  if(t>=b(12)&&t<b(13)-0.067){ ja='j_guard'; jt=b(12); }
  if(t>=b(13)-0.067&&t<b(13)+0.6){ ja='j_deathblow'; jt=b(13)-0.067; }
  if(t>=b(13)+0.6){ ja='j_finish'; jt=b(13)+0.6; }
  const dead=t>=b(13)+0.2;
  if(!dead) Ds(c,ra,t,rt,RX,RY,-1); 
  if(ja) Ds(c,ja,t,jt,JX,JY,1);
  else { const u=inv(64.16,64.45,t); Ls(c,'land',t,64.16,JX,g5(lerp(JY-700,JY,ei(u))),1); }
  // effects
  F.splash(c,t,64.45,JX,GY+40,true);
  for(const [ts,x,y] of SPK){ const [sx,sy]=P(x,y); F.sparks(c,t,ts,sx,sy,Math.round(ts*10)); if(t>=ts&&t<ts+0.07){ circ(c,sx,sy,40,'#FFF8EC'); F.light(c,sx,sy,220,'#FFE7A8',0.5,{add:true}); } }
  if(t>=b(11)&&t<b(11)+0.5){ F.splash(c,t,b(11),JX+120,GY+40,false); }
  if(t>=b(9)&&t<b(9)+0.1){ c.save(); c.translate(960,500); c.rotate(-0.9); rect(c,-500,-3,1000,6,'#FFF8EC'); c.restore(); }
  E5.fallingBamboo(c,t,b(9)+0.02,960,200);
  if(t>=b(10)&&t<b(11)){ // perilous attack telegraph: red glint + 危
    const bl=Math.floor((t-b(10))*12)%2===0; if(bl){ const [kx,ky]=P(rx-160,GY-330); circ(c,kx,ky,25,'#D8402F'); rect(c,kx-60,ky-5,120,10,'#F07850'); rect(c,kx-5,ky-60,10,120,'#F07850'); }
    PX.text&&0; const [hx,hy]=P(rx,GY-640); F.light(c,hx,hy+200,280,'#D8402F',0.5,{add:true}); c.save(); c.setTransform(1,0,0,1,0,0); G.PX.text(c,'危',Math.round(hx/5),Math.round(hy/5),{scale:2,color:'#D8402F',shadow:'#0E1020',align:'center'}); c.restore(); }
  if(t>=b(12)&&t<b(13)-0.07){ const [kx,ky]=P(rx,GY-360); const pr=Math.floor((t-b(12))*8)%2; F.ring(c,kx,ky,pr?90:80,1,'#D8402F',0.1); F.ring(c,kx,ky,pr?85:75,1,'#D8402F',0.1); F.ring(c,kx,ky,45,1,'#F07850',0.1); circ(c,kx,ky,20,'#D8402F'); F.light(c,kx,ky,200,'#D8402F',0.4,{add:true}); }
  if(t>=b(13)&&t<b(13)+0.08){ c.save(); c.translate(960,520); c.rotate(-0.15); rect(c,-900,-5,1800,10,'#FFF8EC'); c.restore(); }
  if(dead){ F.poof(c,RX,RY-250,t,b(13)+0.2); E5.smoke(c,t,RX,RY-200,6,'#4A5378'); }
  E5.bambooFG(c,t,cam);
  F.amb([0.7,0.76,1.05]); F.light(c,960,560,760,'#8C9CC8',0.22,{ry:0.8});
},{k:'dissolve',d:0.4});

// ======================= S21/S22 — verse 2: same lane & izakaya in snow, he drifts faster =======================
shot('S21',81.39,84.27,(c,t)=>{ const lt=t-81.39; const camX=g5(lerp(-80,80,lt/2.88));
  c.save(); c.translate(g5(-camX),0); F.cast(c,760,520,{a:0.35}); c.restore();
  E4.street(c,t,{camX,ty:0,snow:true}); c.save(); c.translate(g5(-camX),0); Hs(c,'walk_umb',t,81.39,g5(lerp(80,640,lt/2.88)),930,1);
  // a fantasy flicker: a ninja crosses the rooftops for two frames
  if(t>83.1&&t<83.17) Ja(c,'run',t,83.1,1300,420,1,'shadow');
  F.reflect(c,{y0:840,y1:1080,k:0.35,dark:0.7,amp:0.5,t,puddles:E4.PUD,tint:'#C8D4F0'}); F.amb([0.78,0.76,0.86]); F.light(c,760,540,520,'#F09A48',0.8*fl(t),{ry:0.85}); F.light(c,1010,640,420,'#F09A48',0.4,{ry:0.7}); c.restore();
  E.snow(c,t,121,120,{}); },{k:'mosaic',d:0.6});
shot('S22',84.27,86.53,(c,t)=>{ const lt=t-84.27; const camX=g5(lerp(-250,100,lt/2.26)); const flick=t>85.4&&t<85.47;
  E4.izakaya3(c,t,{camX,bell:'off',snow:true,behind:(c)=>Ts(c,'m_stir',t,0,MASTER,930,-1),front:(c)=>{ Ts(c,'cat_sit',t,0,-150,930,1); Hs(c,'chew',t,84.27,SEAT,930,1); E4.steam(c,t,SEAT+110,700,3,{h:200}); }});
  if(!flick) E5.bellProp(c,t,camX,{glint:true}); else { F.FX.lights=[]; F.amb(NIGHTA); }
  if(!flick) warmify(0.3); });
// ======================= S23 86.53–91.05 — snowy pond: the water shows the leader; he resolves (modern XL) =======================
shot('S23',86.53,91.05,(c,t)=>{ const lt=t-86.53;
  if(t<88.78){ const camX=g5(lerp(-40,100,lt/2.25));
    E4.garden(c,t,{camX,mirror:(c,pond)=>{ const u=inv(0.3,2.0,lt); if(u>0&&u<1){ const m=c.getTransform(); const ly=Math.round(m.d*pond[0]+m.f), y1=Math.round(m.d*pond[1]+m.f);
      F.mirrorSprite(c,'K','run',SPR.frameAt('K','run',t,86.53),g5(lerp(1600,500,u)),pond[0]+5,-1,'leader',t,1.5,[0,ly,384,y1-ly]); } }});
    E.dither(c,-100,425,2200,15,'#F2E8D5',0.8); E.dither(c,-100,960,2200,30,'#F2E8D5',0.5); E.snow(c,t,123,110,{});
    return; }
  const z=1.8, cx=SEAT+260, cy=GY-420/z; E.zoom(c,z,cx,cy,()=>E4.izakaya3(c,t,{camX:0,bell:'off',snow:true,behind:(c)=>Ts(c,'m_stir',t,0,MASTER,930,-1)}));
  Ja(c,'x_resolve',t,88.9,480,GY-15,1,null,'H'); E4.steam(c,t,860,640,3,{h:240}); warmify(0.3); },{k:'dissolve',d:0.5});
F.SHOTS.filter(s=>s.id==='S24').forEach(s=>s.tr={k:'ripple',d:0.5,c:[0.45,0.55]});
// ======================= S25 93.18–95.43 — winter corner (fantasy): ninja Jay's blowgun, slow dart, the sentinel drops =======================
const tBlow2=94.32;
shot('S25',93.18,95.43,(c,t)=>{ E5.corner(c,t,{snow:true,lx:1585,ly:300});
  const kk=Math.min(5,Math.floor((t-93.3)/0.16)); J(c,'blowgun',Math.max(0,kk),1250,900,-1,null,'D');
  if(t<tBlow2+0.6) Ja(c,'idle',t,93.18,380,900,1,'shadow','L'); F.poof(c,380,650,t,tBlow2+0.6);
  const u=inv(tBlow2,tBlow2+0.6,t); if(u>0&&u<1){ const dx=g5(lerp(1110,430,u)); rect(c,dx,595,g5(lerp(80,400,u)),5,'#C8D4F0'); rect(c,dx,592,60,8,'#E2D3B8'); F.light(c,dx,595,200,'#C8D4F0',0.5,{add:true}); }
  F.amb([0.55,0.62,1.0]); },{k:'cut'});
// ======================= S30–S33 — pre-chorus 2 at home in snow (bamboo in the arrangement); phone again; drifts faster =======================
shot('S30',109.44,111.66,(c,t)=>{ const lt=t-109.44; const camX=g5(lerp(40,-40,lt/2.22));
  const z=1.08, cx=1000+camX, cy=850; E.zoom(c,z,cx,cy,()=>E5.home(c,t,{snow:true,bamboo:true,phone:false})); const [jx,jy]=hp(z,cx,cy)(1000,940); if(t<110.0) Hs(c,'idle',t,109.44,jx,jy,1); else Hs(c,'seal',t,110.0,jx,jy,1); HOMEPRE(c,t); },{k:'flash'});
shot('S31',111.66,113.98,(c,t)=>{ const z=1.25, cx=1200, cy=800; const P=(x,y)=>[g5(960+(x-cx)*z),g5(540+(y-cy)*z)]; const tc=113.03;
  E.zoom(c,z,cx,cy,()=>E5.home(c,t,{snow:true,bamboo:t<tc,phone:false}));
  const [jx,jy]=P(1010,962); Hs(c,'seiza_snip',t,111.66,jx,jy,1);
  if(t>=tc){ const [bx,by]=P(E5.VASE[0]+30,E5.VASE[1]); rect(c,bx-18,by-90,36,90,'#46613F'); rect(c,bx,by-90,10,90,'#7C9A6E'); E5.fallingBamboo(c,t,tc,bx,by-200); if(t<tc+0.1){ c.save(); c.translate(bx,by-110); c.rotate(-0.3); rect(c,-300,-3,600,6,'#FFF8EC'); c.restore(); } }
  HOMEPRE(c,t); });
shot('S32',113.98,116.49,(c,t)=>{ const z=zHome(t,113.98,116.49), cx=1200, cy=820; const P=(x,y)=>[g5(960+(x-cx)*z),g5(540+(y-cy)*z)];
  E.zoom(c,z,cx,cy,()=>E5.home(c,t,{snow:true,bamboo:true,phone:false})); const [jx,jy]=P(1010,962); Hs(c,'seiza_snip',t,113.98,jx,jy,1); HOMEPRE(c,t); },{k:'dissolve',d:0.4});
shot('S33',116.49,118.45,(c,t)=>{ if(t<117.7) return phoneShot(116.2,117.7,116.75,true,true)(c,t);
  const z=1.9, cx=1150, cy=740; E.zoom(c,z,cx,cy,()=>E5.home(c,t,{snow:true,bamboo:true,phone:false,rip:118.0})); Ja(c,'x_det',t,117.7,420,GY-60,1,null,'H'); HOMEPRE(c,t); });
F.SHOTS.filter(s=>s.id==='S34').forEach(s=>s.tr={k:'ripple',d:0.6,c:[0.75,0.6]});
F.SHOTS.filter(s=>s.id==='S15').forEach(s=>s.tr={k:'ripple',d:0.6,c:[0.69,0.77]});

// ======================= S41 152.37–154.43 — the final count: fantasy catch, reality flickers through on the counts =======================
const FL=[[152.462,1],[153.043,2],[153.6,3]];
shot('S41',152.37,154.43,(c,t)=>{ const fl1=FL.some(([ft,n])=>t>=ft&&t<ft+n/30);
  if(fl1){ E4.izakaya3(c,t,{camX:-250,bell:'off',snow:true,behind:(c)=>Ts(c,'m_stir',t,0,MASTER,930,-1),front:(c)=>{ Hs(c,'chew',t,152,SEAT,930,1); }}); E5.bellProp(c,t,-250,{}); warmify(0.4); return; }
  E.zoom(c,1.6,960,700,()=>E.castleRoof(c,t,(t-150)*40,{snow:true,ridgeY:820}));
  Ja(c,'catch',t,152.4,560,GY-60,1,null,'XL'); E.snow(c,t,151,100,{}); F.amb([0.62,0.68,1.0]); });
// ======================= S42a–d 154.43–159.17 — HARD WAKE at the izakaya counter =======================
const BELLX=E4.KAMI.x+134, BELLY=E4.KAMI.y+60;
shot('S42a',154.43,155.40,(c,t)=>{ const z=1.8, cx=SEAT+260, cy=GY-420/z;
  E.zoom(c,z,cx,cy,()=>E4.izakaya3(c,t,{camX:0,bell:'off',snow:true,behind:(c)=>Ts(c,'m_stir',t,0,MASTER,930,-1)}));
  J(c,'x_wake',t<154.5?0:(t<154.85?1:2),480,GY+60,1,null,'H'); E4.steam(c,t,860,640,4,{h:300}); warmify(0.45); },{k:'cut'});
shot('S42b',155.40,156.30,(c,t)=>{ E4.kamidanaClose(c,t,{dy:g5(lerp(10,-10,(t-155.4)/0.9)),bellOn:true,swing:0.25,tb:155.45,gust:0.3});
  const u=t-155.5; if(u>0&&u<0.8){ for(let q=0;q<3;q++){ const v=u*1.6-q*0.25; if(v>0&&v<1) F.ring(c,1400,520,lerp(120,360,v),0.6,'#FFE7A8',v); } }
  F.amb(WARM); F.light(c,1400,500,500,'#FFC870',0.4,{ry:0.9}); });
shot('S42c',156.30,157.10,(c,t)=>{ E4.bowl(c,t,{dy:0,rip:false,rings:[[156.4,0,0]]});
  // what he brought back: a sakura petal and a frayed red scarf thread on the counter
  petal(c,1430,720,3);
  for(let k=0;k<44;k++){ const x=g5(330+k*14), y=g5(770+Math.sin(k*0.45)*22+k*1.2); rect(c,x,y,15,10,'#D8402F'); if(k%3==0) rect(c,x,y,10,5,'#F07850'); } rect(c,945,855,10,10,'#A82A26'); rect(c,325,795,5,5,'#F07850');
  F.amb(WARM); F.light(c,960,500,800,'#FFC870',0.3,{ry:0.7}); });
const S42cam=t=>g5(lerp(-250,-170,eio(inv(157.1,158.6,t))));
shot('S42d',157.10,159.17,(c,t)=>{ const camX=S42cam(t);
  E4.izakaya3(c,t,{camX,bell:'off',snow:true,glint:true,behind:(c)=>Hs(c,'m_smile',t,157.3,MASTER,930,-1),front:(c)=>{ regulars(c,t); Ts(c,'cat_sit',t,0,-150,930,1); Hs(c,t<157.6?'chew':'glance',t,t<157.6?157.1:157.6,SEAT,930,1); E4.steam(c,t,SEAT+110,700,3,{h:200}); } });
  E5.bellProp(c,t,camX,{glint:true,ring:157.15}); warmify(0.4); });
F.IRIS=t=>{ if(t<157.7) return null; const u=inv(157.7,158.8,t); const cam=S42cam(t); return [Math.round((BELLX-cam)/5),Math.round((BELLY)/5),Math.round(lerp(260,0,eio(u))/2)*2]; };

// ======================= lightning, clash sparks on kept shots =======================
for(const s of F.SHOTS){ const sp=F.CLASH.filter(q=>q[3]===s.id); const lt=s.id==='S38'; if(!sp.length&&!lt) continue; const f=s.fn;
  s.fn=(c,t)=>{ f(c,t); for(const [ts,x,y] of sp){ if(t>=ts&&t<ts+0.45){ F.sparks(c,t,ts,x,y,Math.round(ts*7)); if(t<ts+0.07) F.light(c,x,y,260,'#FFE7A8',0.7,{add:true}); } }
    if(lt) F.lightning(c,t,141.12,1500,0,760,11); }; }
F.SHAKES.push({t:141.13,d:0.25,a:3});
// fantasy shots get the night amb if none declared by the set
})(window);
