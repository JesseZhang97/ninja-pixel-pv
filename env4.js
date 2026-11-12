// env4.js — v3 sets for the new opening (rainy Kyoto lane, detailed izakaya, bowl insert, garden pond, kamidana insert,
// reverse angle). Modern pixel-game craft: dense hand-placed texture on the 5-unit grid, multi-layer parallax,
// palette-stepped lighting declared to fx3.js. All fills snap to NINJA-56 at quantise.
(function(G){
const {P,mulberry,clamp,lerp,inv,eio,eo,poly,rect,circ,ell,capsule,blob,seigaiha}=G.K; const E=G.E, F=G.FILM, SPR=G.SPR; const W=1920,H=1080;
const g5=v=>Math.round(v/5)*5; const E4=G.E4={};
const C={ink:'#0E1020',deep:'#141A30',night:'#1C2238',n2:'#253052',n3:'#2E3756',slate:'#4A5378',moonL:'#8C9CC8',moonH:'#C8D4F0',
  w0:'#33201A',w1:'#4A2A1C',w2:'#5E3826',w3:'#7A4B34',w4:'#93603C',w5:'#C9965E',w6:'#A8744A',paper:'#E2D3B8',paper2:'#F2E8D5',
  tealD:'#12303A',teal:'#1F4E5A',tealL:'#2F7A80',aqua:'#5FB0A8',foam:'#A8E0D0',lan0:'#B8562E',lan1:'#F09A48',lan2:'#FFC870',lan3:'#FFE7A8',
  fol0:'#16261E',fol1:'#2F4A3A',fol2:'#46613F',stone0:'#43475A',stone1:'#7E7C76',stone2:'#B9B6AC',ai:'#2B3A67',aiL:'#3E4E86',red:'#A82A26',redL:'#D8402F'};
E4.C=C;
// ---------- small parts ----------
function noren(c,x,y,w,h,n,t,o={}){ const sw=o.sway||1, part=o.part||0; const sw_=w/n; for(let k=0;k<n;k++){ const mid=(k+0.5)/n-0.5; const ph=Math.sin(t*2.2+k*0.9)*6*sw;
    const open=part*Math.sign(mid||0.01)*(1-Math.abs(mid))*w*0.55; const x0=x+k*sw_+2, x1=x0+sw_-6; const dx=g5(ph+open), dxb=g5(ph*1.8+open*1.3+(o.gust||0)*(k%2?40:30));
    poly(c,[[x0,y],[x1,y],[x1+dxb,y+h],[x0+dxb,y+h]],o.col||C.ai); poly(c,[[x1-10,y],[x1,y],[x1+dxb,y+h],[x1+dxb-10,y+h]],o.colS||'#1F2A4C');
    rect(c,x0+dxb*0.5,y+h*0.45,x1-x0,5,o.colL||C.aiL); }
  if(o.crest){ const cx=x+w/2, cy=y+h*0.3; circ(c,cx+g5(Math.sin(t*2.2)*4),cy,o.crest,C.paper2); circ(c,cx+g5(Math.sin(t*2.2)*4),cy,o.crest-12,o.col||C.ai); rect(c,cx-5+g5(Math.sin(t*2.2)*4),cy-o.crest+15,10,(o.crest-15)*2,C.paper2); }
  rect(c,x-15,y-15,w+30,20,C.w1); }
function akachochin(c,x,y,r,t,o={}){ const sw=Math.sin(t*1.7+(o.ph||0))*0.05*(o.sway||1); c.save(); c.translate(x,y); c.rotate(sw); rect(c,-3,-80,6,80,C.ink);
  ell(c,0,r*1.1,r,r*1.15,0,o.col||C.redL); c.save(); c.beginPath(); c.ellipse(0,r*1.1,r,r*1.15,0,0,6.283); c.clip(); rect(c,r*0.3,0,r,r*2.4,o.colS||C.red); rect(c,-r,r*0.2,r*0.35,r*2,o.colL||'#F07850');
  c.fillStyle=o.rib||'#6E1A1E'; for(let k=-4;k<=4;k++) c.fillRect(-r,r*1.1+k*r*0.24,r*2,5); c.restore();
  rect(c,-r*0.5,-5,r,20,C.ink); rect(c,-r*0.5,r*2.2,r,20,C.ink); if(o.mark){ rect(c,-10,r*0.7,20,r*0.8,C.paper2); rect(c,-25,r*0.9,50,8,C.paper2); } c.restore(); }
function kawara(c,x,y,w,h,col,colS,colL){ rect(c,x,y,w,h,col); for(let xx=x;xx<x+w;xx+=30){ rect(c,xx,y,10,h,colS); rect(c,xx+20,y,5,h,colL||col); } rect(c,x,y+h-10,w,10,colS); for(let xx=x;xx<x+w;xx+=30) rect(c,xx,y+h-15,15,15,colL||colS); }
function lattice(c,x,y,w,h,slat,gap,col,back){ if(back) rect(c,x,y,w,h,back); c.fillStyle=col; for(let xx=x;xx<x+w;xx+=gap) c.fillRect(xx,y,slat,h); c.fillRect(x,y,w,10); c.fillRect(x,y+h-10,w,10); }
function cobbles(c,x0,x1,y0,y1,seed,cols){ const r=mulberry(seed); rect(c,x0,y0,x1-x0,y1-y0,cols[0]); for(let y=y0;y<y1;y+=40){ const off=((y/40)%2)*35; for(let x=x0-70+off;x<x1;x+=70){ const w=50+Math.floor(r()*3)*5, h=25+Math.floor(r()*2)*5;
      rect(c,x+5,y+5,w,h,cols[1]); rect(c,x+5,y+5,w,5,cols[2]); if(r()<0.3) rect(c,x+15+Math.floor(r()*5)*5,y+15,10,5,cols[3]||cols[2]); } } }
function pebbleBed(c,x,y,w,h,seed){ const r=mulberry(seed); rect(c,x,y,w,h,C.stone0); for(let k=0;k<w*h/500;k++){ const px=g5(x+r()*w), py=g5(y+r()*h), s=r()<0.3?10:5; rect(c,px,py,s+5,s,r()<0.5?C.stone1:(r()<0.6?C.stone2:'#5A5F73')); if(s>5) rect(c,px,py,5,5,C.stone2); } }
function bottle(c,x,y,h,col,colL,neck){ rect(c,x,y-h,30,h,col); rect(c,x+5,y-h+10,5,h-20,colL); rect(c,x+10,y-h-neck,10,neck,col); rect(c,x+10,y-h-neck-5,10,5,C.ink); rect(c,x+5,y-h*0.6,20,h*0.3,C.paper2); rect(c,x+10,y-h*0.55,10,5,C.ink); }
function menuTag(c,x,y,h,seed){ const r=mulberry(seed); rect(c,x,y,40,h,C.paper); rect(c,x+35,y,5,h,'#B9B6AC'); rect(c,x,y,40,5,C.w2); let yy=y+20; while(yy<y+h-20){ const w=r()<0.5?20:10; rect(c,x+10+(r()<0.5?0:5),yy,w,5,C.ink); if(r()<0.4) rect(c,x+15,yy+5,5,10,C.ink); yy+=15+Math.floor(r()*2)*5; } }
function steam(c,t,x,y,n,o={}){ for(let k=0;k<n;k++){ const ph=((t*(o.sp||0.5))+k/n)%1; const sx=x+Math.sin(ph*6+k*1.7)*(o.wob||18)+k*8-n*4, sy=y-ph*(o.h||220); const a=1-ph; if(a<0.12) continue;
    const r1=g5(6+a*8*(o.s||1)); capsule(c,sx,sy,r1,sx+10*Math.sin(k+ph*4),sy-40,Math.max(3,r1-4),o.col||'#F6EEDD'); if(a>0.5) capsule(c,sx+12,sy-40,Math.max(3,r1-5),sx-4,sy-80,3,o.col||'#F6EEDD'); } }
E4.noren=noren; E4.akachochin=akachochin; E4.steam=steam; E4.kawara=kawara; E4.lattice=lattice;
function bellBig(c,x,y,R,t,o={}){ // the shrine bell drawn as a prop at insert size (hard bands, 3-step metal ramp)
  const sw=Math.sin(t*2.6)*(o.sw||0); c.save(); c.translate(x,y); c.rotate(sw);
  rect(c,-8,-R*2.2,16,R*1.1,'#4A2A1C'); circ(c,0,0,R,'#8A5A1E'); circ(c,-R*0.12,-R*0.12,R*0.82,'#D9A441'); circ(c,-R*0.3,-R*0.3,R*0.45,'#F2D27A'); rect(c,-R*0.45,-R*0.55,R*0.2,R*0.2,'#FFF8EC');
  rect(c,-R,-5,R*2,10,'#8A5A1E'); rect(c,-R*0.5,R*0.35,R,R*0.18,'#4A2A1C'); circ(c,0,R*0.62,R*0.12,'#0E1020');
  for(let k=0;k<6;k++) rect(c,-R*0.18,R*0.95+k*R*0.45,R*0.36,R*0.45,k%2?'#D8402F':'#F5F1E8'); c.restore(); }
E4.bellBig=bellBig;

// ---------- O1/O2: rainy Kyoto lane (6 parallax layers) ----------
// o: {camX, ty (tilt offset: 0 = street level, >0 = looking up), zoom:{z,cx,cy}}
E4.street=(c,t,o={})=>{ const camX=o.camX||0, ty=o.ty||0; const L=(p,fn)=>{ c.save(); c.translate(g5(-camX*p),g5(ty*p)); fn(); c.restore(); };
  // L0 sky: banded night with a dithered seam, the moon veiled by rain cloud
  L(0.05,()=>{ rect(c,-200,-1400,2400,2600,C.deep); rect(c,-200,-200,2400,500,C.night); E.dither(c,-200,-260,2400,120,C.night,f=>f*0.5); rect(c,-200,300,2400,700,C.n2); E.dither(c,-200,240,2400,80,C.n2,f=>f*0.5);
    circ(c,1450,140,105,'#5A6A9A'); circ(c,1450,140,88,'#C8D4F0'); circ(c,1420,120,30,'#8C9CC8'); circ(c,1490,170,18,'#8C9CC8'); E.dither(c,1280,90,360,60,C.n2,f=>0.5); rect(c,1150,160,700,30,C.n2); rect(c,900,220,600,25,C.n3); rect(c,1350,60,500,20,C.n3); E.stars(c,t,9,40,300,['#8C9CC8','#4A5378']); });
  // L1 far hills + pagoda
  L(0.15,()=>{ poly(c,[[-300,520],[100,380],[420,450],[760,330],[1150,430],[1500,350],[1900,440],[2300,380],[2300,700],[-300,700]],'#253052');
    const px=1320,py=430; for(let k=0;k<5;k++){ const w=150-k*24, y=py-k*55; poly(c,[[px-w,y],[px+w,y],[px+w*0.7,y-22],[px-w*0.7,y-22]],C.night); rect(c,px-w*0.45,y-55+22,w*0.9,35,C.n3); } rect(c,px-4,py-330,8,80,C.night); });
  // L2 mid roofs with a few lit windows (flicker)
  L(0.35,()=>{ E.roofRow(c,-400,640,0.75,18,'#2E3756',null,'#2A3150',77,{lattice:'#232A45',lamp:'#8A5A1E'}); const r=mulberry(4); for(let k=0;k<9;k++){ const x=g5(-300+r()*2400), y=g5(560+r()*60); if(Math.sin(t*3+k*7)>-0.8) { rect(c,x,y,20,15,'#B8562E'); rect(c,x,y,20,5,'#F09A48'); } } });
  // L3 machiya row (left + right of the izakaya): koshi lattices with warm light, tiled eaves
  L(0.7,()=>{ for(const [bx,bw] of [[-500,620],[1700,800]]){ rect(c,bx,320,bw,520,'#3A2A22'); kawara(c,bx-40,290,bw+80,45,C.n3,C.night,C.slate); rect(c,bx,335,bw,15,C.w0);
      rect(c,bx+40,420,bw-80,250,'#B8562E'); E.dither(c,bx+40,420,bw-80,250,'#F09A48',f=>0.35); lattice(c,bx+40,420,bw-80,250,10,20,C.w0); rect(c,bx,680,bw,160,C.w1); for(let x=bx+20;x<bx+bw;x+=60) rect(c,x,690,10,150,C.w0); if(o.snow) E.snowCap(c,bx-40,292,bw+80,bx); } });
  // L4 the izakaya front + the lane
  L(1.0,()=>{ const ix=200, iw=1400;
    rect(c,ix,300,iw,540,C.w2); F.planks(c,ix,300,iw,140,35,[C.w2,C.w1,C.w3,C.w0],11,false); kawara(c,ix-60,250,iw+120,60,'#2B3A67','#1F2A4C','#3E4E86');
    // signboard
    rect(c,ix+520,320,360,80,C.w0); rect(c,ix+530,330,340,60,C.w4); for(const [sx,sw] of [[560,40],[640,20],[700,50],[790,30]]){ rect(c,ix+sx,345,sw,10,C.ink); rect(c,ix+sx+10,355,10,20,C.ink); }
    // lattice window with the warm room behind it + a seated silhouette (the master) moving
    rect(c,ix+80,460,420,260,C.lan1); rect(c,ix+80,620,420,100,C.lan0); const mx=ix+330+g5(Math.sin(t*1.3)*20); circ(c,mx,560,30,'#B8562E'); poly(c,[[mx-40,640],[mx+40,640],[mx+30,585],[mx-30,585]],'#B8562E');
    lattice(c,ix+80,460,420,260,10,25,C.w0);
    // door: noren + glimpse of the lit interior
    rect(c,ix+620,440,380,400,C.lan0); rect(c,ix+620,440,380,120,C.lan1); rect(c,ix+640,600,340,240,'#5C2E22'); rect(c,ix+620,440,15,400,C.w0); rect(c,ix+985,440,15,400,C.w0);
    noren(c,ix+625,445,370,170,4,t,{sway:o.gust?2.5:1,crest:40,gust:o.gust||0});
    // right: lattice + rain barrel + potted pine
    lattice(c,ix+1060,460,300,380,10,20,C.w1,'#3A2A22'); rect(c,ix+1060,460,300,380,'rgba(0,0,0,0)');
    rect(c,ix+1380,700,110,140,C.w3); rect(c,ix+1380,720,110,10,C.w0); rect(c,ix+1380,800,110,10,C.w0); rect(c,ix+1385,690,100,15,C.tealD);
    rect(c,ix+20,760,90,80,C.w2); blob(c,[[ix,760],[ix+60,700],[ix+130,760],[ix+60,740]],C.fol1); blob(c,[[ix+10,720],[ix+60,660],[ix+110,720],[ix+60,705]],C.fol2);
    // the lantern (light source)
    akachochin(c,ix+560,470,45,t,{mark:1});
    // lane: wet flagstones + the pebble genkan in front of the door
    cobbles(c,-600,2600,840,1100,7,['#1C2238','#2E3756','#4A5378','#5A6A9A']); pebbleBed(c,ix+600,840,420,70,3); rect(c,ix+600,835,420,8,C.w0);
    // puddles (dark mirrors; the reflection pass paints into them)
    for(const [px,py,rx,ry] of E4.PUD) ell(c,px,py,rx,ry,0,o.snow?'#253052':'#141A30');
    if(o.snow){ E.snowCap(c,ix-60,252,iw+120,5); E.dither(c,-600,840,3200,260,'#DDE6F2',f=>0.3); E.dither(c,-600,840,3200,40,'#DDE6F2',f=>0.6); }
  });
  // L5 foreground: utility pole + sagging wires + eave edge dripping (parallax 1.4)
  L(1.4,()=>{ rect(c,-120,-400,70,1600,'#0E1020'); rect(c,-60,-400,10,1600,'#1C2238'); rect(c,-170,-260,170,20,'#0E1020'); rect(c,-170,-180,170,15,'#0E1020');
    c.fillStyle='#0E1020'; for(let x=-60;x<2600;x+=10){ const y1=-250+Math.pow((x-1300)/1300,2)*-120+120, y2=-170+Math.pow((x-1300)/1300,2)*-100+100; c.fillRect(g5(x),g5(y1),10,5); c.fillRect(g5(x),g5(y2),10,5); }
    for(let k=0;k<8;k++){ const x=g5(300+k*260), u=((t*1.6+k*0.37)%1); c.fillStyle='#8C9CC8'; c.fillRect(x,g5(-200+(-250+Math.pow((x-1300)/1300,2)*-120+120+250)*0+u*600)+0,5,10); } });
};
E4.PUD=[[700,930,180,22],[1250,990,240,26],[260,1040,200,22],[1700,920,160,18]];

// ---------- the izakaya interior (v3). world x -400..2600 ----------
E4.KAMI={x:210,y:450};
E4.izakaya3=(c,t,o={})=>{ const camX=o.camX||0; c.save(); c.translate(-g5(camX),0);
  // ceiling + rafters
  rect(c,-500,0,3300,95,C.w0); for(let x=-460;x<2800;x+=240){ rect(c,x,0,40,95,C.w1); rect(c,x+30,0,10,95,C.w0); } rect(c,-500,85,3300,15,C.w1);
  // back wall planks
  F.planks(c,-500,100,3300,620,60,[C.w3,C.w2,C.w4,C.w1],21,true);
  for(const x of [-60,480,1320,1980]){ rect(c,x,95,50,640,C.w1); rect(c,x+40,95,10,640,C.w0); rect(c,x,95,10,640,C.w2); }
  // high shoji transom (moonlit paper): ninja silhouettes slide across it
  const sx0=530, sx1=1320, sy0=140, sy1=320; rect(c,sx0,sy0,sx1-sx0,sy1-sy0,'#C8D4F0'); E.dither(c,sx0,sy0,sx1-sx0,sy1-sy0,'#E2D3B8',f=>0.5);
  if(o.shoji) o.shoji(c,[sx0,sy0,sx1,sy1]);
  c.fillStyle=C.w2; for(let x=sx0;x<=sx1;x+=60) c.fillRect(x,sy0,5,sy1-sy0); for(let y=sy0;y<=sy1;y+=45) c.fillRect(sx0,y,sx1-sx0,5); rect(c,sx0-10,sy0-10,sx1-sx0+20,10,C.w0); rect(c,sx0-10,sy1,sx1-sx0+20,12,C.w0);
  // kamidana (left, high) with the bell
  const kx=E4.KAMI.x, ky=E4.KAMI.y; rect(c,kx-200,ky,400,25,C.w4); rect(c,kx-200,ky+25,400,10,C.w1); rect(c,kx-180,ky+35,15,40,C.w1); rect(c,kx+165,ky+35,15,40,C.w1);
  poly(c,[[kx-110,ky],[kx-110,ky-110],[kx+110,ky-110],[kx+110,ky]],C.paper); poly(c,[[kx-140,ky-110],[kx,ky-170],[kx+140,ky-110]],C.w3); rect(c,kx-140,ky-118,280,12,C.w1); rect(c,kx-45,ky-95,90,95,C.w2); circ(c,kx,ky-60,15,'#D9A441');
  rect(c,kx-200,ky-190,400,16,C.lan2); rect(c,kx-200,ky-180,400,6,'#B9832C'); for(const zx of [-150,-50,50,150]) poly(c,[[kx+zx,ky-174],[kx+zx+20,ky-174],[kx+zx+8,ky-150],[kx+zx+24,ky-150],[kx+zx+10,ky-122],[kx+zx-4,ky-122],[kx+zx+6,ky-150],[kx+zx-8,ky-150]],C.paper2);
  for(const sx of [-170,170]){ capsule(c,kx+sx,ky-5,6,kx+sx,ky-60,7,C.fol2); blob(c,[[kx+sx-25,ky-70],[kx+sx,ky-110],[kx+sx+25,ky-72],[kx+sx,ky-55]],C.fol2); poly(c,[[kx+sx,ky-110],[kx+sx+25,ky-72],[kx+sx,ky-62]],C.fol1); }
  const bellOn=o.bell==null||o.bell==='on'||(typeof o.bell==='number'&&t<o.bell);
  rect(c,kx+130,ky-80,8,80,C.w1); if(bellOn){ F.bell(c,kx+134,ky+5,t); for(let k=0;k<5;k++) rect(c,kx+130,ky+30+k*24,8,24,k%2?'#D8402F':'#F5F1E8');
    const gl=(t*0.7)%1; if(o.glint&&gl<0.12){ const gx=kx+124,gy=ky-15; rect(c,gx-30,gy,20,5,'#FFF8EC'); rect(c,gx+20,gy,20,5,'#FFF8EC'); rect(c,gx,gy-30,5,20,'#FFF8EC'); rect(c,gx,gy+20,5,20,'#FFF8EC'); } }
  if(typeof o.bell==='number') F.poof(c,kx+134,ky-10,t,o.bell-0.05);
  // menu tags + shelves with sake bottles behind the counter
  for(let k=0;k<12;k++) menuTag(c,1400+k*48,120,140+((k*37)%3)*20,k+3);
  for(const sy of [420,520]){ rect(c,560,sy,1380,15,C.w4); rect(c,560,sy+15,1380,8,C.w0); }
  const r=mulberry(12); for(let x=580;x<1920;x+=50){ if(r()<0.25) continue; const cols=[[C.w1,C.w3],[C.fol1,C.fol2],[C.tealL,C.aqua],[C.w0,C.w2]][Math.floor(r()*4)]; bottle(c,x,420,40+Math.floor(r()*4)*10,cols[0],cols[1],20); }
  for(let x=600;x<1900;x+=70){ rect(c,x,500,30,20,C.paper2); rect(c,x,500,30,5,C.stone1); rect(c,x+40,505,20,15,C.w5); }
  // right window: rain outside
  rect(c,2050,200,320,360,C.deep); c.save(); c.beginPath(); c.rect(2050,200,320,360); c.clip(); rect(c,2050,450,320,110,o.snow?'#DDE6F2':C.n2); if(o.snow){ c.save(); c.translate(1900,0); E.snow(c,t,31,40,{calm:1}); c.restore(); } else F.rain(c,t,{seed:3,splash:false,dens:0.6}); c.restore(); lattice(c,2050,200,320,360,10,40,C.w1); rect(c,2040,190,340,12,C.w0); rect(c,2040,560,340,14,C.w0);
  // entrance (left): door frame, the street glow, the noren
  rect(c,-420,180,340,640,C.n2); c.save(); c.beginPath(); c.rect(-420,180,340,640); c.clip(); rect(c,-420,600,340,220,o.snow?'#B9B6AC':C.night); akachochin(c,-200,330,30,t,{sway:0.5}); if(o.snow){ c.save(); c.translate(-500,0); E.snow(c,t,32,30,{calm:1}); c.restore(); } else F.rain(c,t,{seed:8,splash:false,dens:0.5}); c.restore();
  rect(c,-440,170,30,660,C.w0); rect(c,-90,170,30,660,C.w0); noren(c,-415,190,330,220,3,t,{sway:o.norenSway||1,crest:35,gust:o.gust||0});
  // lanterns (the main light source + a paper one)
  akachochin(c,1050,170,55,t,{mark:1,sway:o.lanSway||1}); rect(c,1700,95,6,90,C.ink); ell(c,1703,230,35,45,0,C.paper2); rect(c,1680,190,46,8,C.ink); rect(c,1680,268,46,8,C.ink); rect(c,1712,195,14,70,'#E2D3B8');
  // behind-counter actors (master etc.)
  if(o.behind) o.behind(c);
  // counter: top with items, front panel with grain
  rect(c,250,715,1800,30,C.w5); rect(c,250,715,1800,8,'#E2B880'); rect(c,250,745,1800,10,C.w1); F.planks(c,250,755,1800,175,45,[C.w2,C.w1,C.w3,C.w0],5,true);
  // iron pot on the burner with fire glow + steam
  rect(c,1380,650,170,65,'#2A2F45'); rect(c,1380,650,170,12,C.stone0); rect(c,1395,640,140,12,C.stone1); rect(c,1370,705,190,10,C.ink); const fl=Math.floor(t*10)%3; rect(c,1400+fl*10,700,30,10,C.lan1); rect(c,1480-fl*5,700,20,10,C.lan2);
  steam(c,t,1465,640,4,{h:260});
  rect(c,1700,690,40,25,C.paper2); rect(c,1705,680,30,10,C.paper2); rect(c,1760,700,30,15,C.w5); rect(c,560,700,120,15,C.paper2); rect(c,570,695,100,5,C.stone2);
  // stools
  for(const sx of (o.stools||[480,900,1300,1750])){ rect(c,sx-55,830,110,20,C.w4); rect(c,sx-55,845,110,8,C.w1); rect(c,sx-45,853,15,77,C.w1); rect(c,sx+30,853,15,77,C.w1); rect(c,sx-40,890,80,8,C.w0); }
  // floor: doma tiles, wet sheen near the door
  rect(c,-500,930,3300,150,C.stone0); for(let y=930;y<1080;y+=50) for(let x=-500+((y/50)%2)*50;x<2800;x+=100){ rect(c,x,y,95,45,'#5A5F73'); rect(c,x,y,95,5,C.stone1); }
  rect(c,-500,925,3300,10,C.w0);
  if(o.front) o.front(c);
  c.restore();
  // lights (declared in world coords through the camera)
  c.save(); c.translate(-g5(camX),0); const fk=o.flick!=null?o.flick:1; const fli=(0.9+0.1*Math.sin(t*23)*Math.sin(t*7.3))*fk;
  F.amb(o.amb||[0.74,0.68,0.70]); F.light(c,1050,260,900,'#FFC870',0.42*fli,{ry:0.8}); F.light(c,1050,260,330,'#FFE7A8',0.25*fli); F.light(c,1703,230,420,'#FFE7A8',0.22); F.light(c,1465,700,200,'#F09A48',0.5*(0.8+0.2*Math.sin(t*17)));
  F.shaft(c,[[sx0,sy1],[sx1,sy1],[sx1+260,930],[sx0+260,930]],'#8C9CC8',0.16,0.4); F.shaft(c,[[2050,560],[2370,560],[2150,930],[1830,930]],'#8C9CC8',0.14,0.35);
  F.light(c,-250,600,380,'#F09A48',0.18); F.cast(c,1050,260,{a:0.4}); c.restore(); };

// ---------- O4: the miso bowl from above ----------
E4.bowl=(c,t,o={})=>{ const cx=960+(o.dx||0), cy=520+(o.dy||0);
  F.planks(c,-20,-20,1960,1120,90,[C.w4,C.w3,C.w5,C.w2],31,false); rect(c,-20,860,1960,240,C.w2); rect(c,-20,860,1960,10,C.w1);
  // chopsticks on a rest, sake cup
  rect(c,1350,820,40,25,C.stone1); rect(c,1300,800,420,10,C.w0); rect(c,1300,815,410,10,C.w1); rect(c,1300,800,420,5,C.w5);
  circ(c,420,300,70,C.paper2); circ(c,420,300,52,'#B9B6AC'); circ(c,420,300,45,'#DDE6F2');
  // bowl shadow, lacquer body, rim, soup
  ell(c,cx+30,cy+40,300,250,0,C.w1); ell(c,cx,cy,290,245,0,'#1E2233'); ell(c,cx,cy,270,228,0,'#33201A'); ell(c,cx-20,cy-20,250,210,0,'#4A2A1C');
  rect(c,cx-240,cy-120,20,60,'#93603C'); rect(c,cx-200,cy-180,40,15,'#93603C');
  const R=225, RY=185; ell(c,cx,cy,R,RY,0,'#93603C'); c.save(); c.beginPath(); c.ellipse(cx,cy,R-10,RY-10,0,0,6.283); c.clip();
  rect(c,cx-R,cy-RY,2*R,2*RY,'#A8744A'); const r=mulberry(77);
  for(let k=0;k<28;k++){ const a=r()*6.28, d=r()*0.85, x=cx+Math.cos(a)*R*d+g5(Math.sin(t*0.7+k)*6), y=cy+Math.sin(a)*RY*d; rect(c,g5(x),g5(y),g5(30+r()*50),10,r()<0.5?'#C9965E':'#93603C'); }
  // lantern reflection (stretched, ripple-broken rows)
  const lx=cx-90, ly=cy-70; for(let j=-5;j<=5;j++){ const w=Math.round((1-Math.abs(j)/6)*60/5)*5, off=g5(Math.sin(j*1.3+t*(o.rip?9:2))*(o.rip?14:4)); if(w>0){ rect(c,lx-w+off,ly+j*10,w*2,10,j%2?'#FFC870':'#FFE7A8'); } }
  if(o.shadowPass){ const u=o.shadowPass; if(u>0&&u<1){ const x=g5(lerp(cx+260,cx-300,u)); poly(c,[[x-30,ly-60],[x+30,ly-60],[x+60,ly+60],[x-60,ly+60]],'#3A1E1A'); circ(c,x,ly-80,28,'#3A1E1A'); } }
  // tofu, scallion rings, wakame
  for(const [tx,ty] of [[-60,40],[50,-30],[90,70],[-120,-60],[0,110]]){ const x=cx+tx+g5(Math.sin(t*0.8+tx)*5), y=cy+ty; rect(c,x,y,40,40,'#F2E8D5'); rect(c,x,y+30,40,10,'#E2D3B8'); rect(c,x+30,y,10,40,'#E2D3B8'); rect(c,x,y,10,5,'#FFF8EC'); }
  for(const [gx,gy] of [[-20,-90],[120,0],[-150,30],[40,60],[150,-80],[-90,120]]){ const x=cx+gx, y=cy+gy; rect(c,x,y,20,5,'#A8C08A'); rect(c,x,y+15,20,5,'#7C9A6E'); rect(c,x,y,5,20,'#A8C08A'); rect(c,x+15,y,5,20,'#7C9A6E'); }
  for(const [wx,wy] of [[100,-120],[-170,90],[170,60]]) blob(c,[[cx+wx-30,cy+wy],[cx+wx,cy+wy-20],[cx+wx+35,cy+wy+5],[cx+wx,cy+wy+20]],'#2F4A3A');
  // surface ripples (taps / drop)
  for(const [rt,rx,ry] of (o.rings||[])){ const u=(t-rt)/0.9; if(u>0&&u<1) for(let q=0;q<3;q++){ const uu=u-q*0.18; if(uu>0) F.ring(c,cx+rx,cy+ry,lerp(10,260,eo(uu)),0.83,q?'#C9965E':'#E2B880',uu); } }
  c.restore(); ell(c,cx,cy,R,RY,0,'rgba(0,0,0,0)');
  // steam curls above everything
  steam(c,t,cx-40,cy-40,5,{h:420,s:1.6,wob:30,sp:0.45});
  F.amb([0.86,0.78,0.72]); F.light(c,cx-200,cy-260,700,'#FFC870',0.35,{ry:0.8}); F.light(c,lx,ly,120,'#FFE7A8',0.2); };

// ---------- O5: the garden through the back shoji (庭園假山), rain on the pond ----------
E4.garden=(c,t,o={})=>{ const camX=o.camX||0; const L=(p,fn)=>{ c.save(); c.translate(g5(-camX*p),0); fn(); c.restore(); };
  L(0.1,()=>{ rect(c,-200,0,2400,500,C.deep); rect(c,-200,250,2400,300,C.night); E.dither(c,-200,200,2400,80,C.night,f=>0.5); circ(c,1500,150,85,'#C8D4F0'); circ(c,1515,140,75,'#F4E9C8'); circ(c,1490,170,14,'#E6D6A8'); circ(c,1540,120,10,'#E6D6A8'); E.stars(c,t,19,30,260,['#8C9CC8','#4A5378']); });
  L(0.3,()=>{ // pine + maple foliage clusters
    for(const [x,y,s,cA,cB] of [[200,320,1.2,C.fol0,C.fol1],[700,280,1.0,C.fol0,C.fol1],[1250,330,1.3,C.fol0,C.fol2],[1750,300,1.1,C.fol0,C.fol1]]){ const r=mulberry(x);
      for(let k=0;k<9;k++){ const bx=x+(r()-0.5)*300*s, by=y+(r()-0.5)*140*s; blob(c,[[bx-70*s,by],[bx,by-40*s],[bx+80*s,by],[bx,by+25*s]],cA); blob(c,[[bx-50*s,by-10],[bx,by-38*s],[bx+50*s,by-10],[bx,by+5]],cB); } } });
  L(0.5,()=>{ // garden wall with tiled cap
    rect(c,-300,430,2700,170,'#5A6A9A'); E.dither(c,-300,430,2700,170,'#8C9CC8',f=>0.18); for(let x=-300;x<2400;x+=180) rect(c,x,440,5,150,'#4A5378'); kawara(c,-320,400,2740,40,C.n2,C.night,C.slate); rect(c,-300,590,2700,10,C.n3); });
  L(0.8,()=>{ // rock mountain (假山) + stone lantern + pond
    for(const [x,y,w,h,col,col2] of [[260,640,360,220,'#43475A','#5A5F73'],[470,600,260,240,'#4A5378','#7E7C76'],[120,700,240,160,'#2E3756','#43475A']]){ poly(c,[[x-w/2,y+h*0.4],[x-w*0.3,y-h*0.3],[x,y-h*0.5],[x+w*0.35,y-h*0.25],[x+w/2,y+h*0.4]],col); poly(c,[[x-w*0.3,y-h*0.3],[x,y-h*0.5],[x+w*0.1,y-h*0.1],[x-w*0.15,y]],col2); blob(c,[[x-w*0.2,y-h*0.42],[x,y-h*0.52],[x+w*0.25,y-h*0.38],[x,y-h*0.36]],C.fol2); }
    // pond
    const py0=700, py1=960; rect(c,-300,py0,2700,py1-py0,C.tealD); rect(c,-300,py0,2700,10,'#0E1020');
    // caustics: drifting light lines on the pond floor (dithered)
    c.fillStyle=C.teal; for(let y=py0+20;y<py1;y+=20) for(let x=-300;x<2400;x+=10){ const v=Math.sin(x*0.013+t*1.7+y*0.05)+Math.sin(x*0.007-t*1.1-y*0.03); if(v>1.1) c.fillRect(g5(x),y,10,5); }
    c.fillStyle=C.tealL; for(let y=py0+30;y<py1;y+=30) for(let x=-300;x<2400;x+=10){ const v=Math.sin(x*0.011-t*1.3+y*0.07)+Math.sin(x*0.017+t*0.9); if(v>1.55) c.fillRect(g5(x),y,10,5); }
    // moon reflection broken into ripple rows
    for(let j=0;j<9;j++){ const w=g5(70-j*5+Math.sin(t*3+j)*15), off=g5(Math.sin(t*4+j*1.9)*20); rect(c,1450+off-w,py0+20+j*15,w*2,5,j%2?'#C8D4F0':'#8C9CC8'); }
    // koi
    for(let k=0;k<4;k++){ const a=t*(0.5+k*0.13)+k*1.7, x=g5(900+Math.cos(a)*(380+k*60)), y=g5(830+Math.sin(a*1.3)*60), dir=-Math.sin(a)>0?1:-1, cols=[['#F07850','#F2E8D5'],['#F2E8D5','#D8402F'],['#D9A441','#F2E8D5'],['#F07850','#0E1020']][k];
      rect(c,x-20,y,40,10,cols[0]); rect(c,x-10*dir,y,15,10,cols[1]); rect(c,x+20*dir,y,10,10,cols[0]); rect(c,x-30*dir,y-5,10,20,cols[0]); rect(c,x+25*dir,y,5,5,'#0E1020'); }
    if(o.mirror) o.mirror(c,[py0,py1]);
    F.ripples(c,t,{n:12,x0:-200,x1:2200,y0:py0+20,y1:py1-10,r0:6,r1:50,sq:0.3,col:'#5FB0A8',per:0.9,seed:3});
    // stone lantern (tōrō) with its lit window
    const lx=1600, ly=700; rect(c,lx-15,ly-120,30,120,'#7E7C76'); rect(c,lx-60,ly-180,120,60,'#7E7C76'); rect(c,lx-35,ly-170,70,40,'#FFC870'); rect(c,lx-35,ly-170,70,10,'#FFE7A8'); rect(c,lx-8,ly-170,16,40,'#7E7C76');
    poly(c,[[lx-90,ly-180],[lx,ly-240],[lx+90,ly-180]],'#5A5F73'); rect(c,lx-10,ly-260,20,25,'#5A5F73'); rect(c,lx-50,ly-10,100,15,'#5A5F73');
    for(let j=0;j<6;j++){ const off=g5(Math.sin(t*5+j*2)*12); rect(c,lx-25+off,ly+20+j*20,50-j*6,5,j%2?'#FFC870':'#F09A48'); }
    // tsukubai + bamboo spout drip
    const tx=1960, ty=900; ell(c,tx,ty,120,45,0,'#5A5F73'); ell(c,tx,ty-10,90,30,0,C.tealD); rect(c,tx-150,ty-80,170,15,C.fol2); rect(c,tx-150,ty-80,10,15,C.fol1);
    const dp=(t*0.9)%1; if(dp<0.5){ rect(c,tx+15,g5(ty-60+dp*120),5,10,'#A8E0D0'); } else F.ring(c,tx+15,ty-10,lerp(5,70,(dp-0.5)*2),0.33,'#5FB0A8',(dp-0.5)*2);
  });
  F.rain(c,t,{seed:21,gy:960,x0:0,x1:1920,depth:0,ns:0,dens:0.9});
  L(1.5,()=>{ // engawa (veranda boards) + shoji frame edges in the foreground
    F.planks(c,-400,960,2800,140,30,[C.w3,C.w2,C.w4,C.w1],41,false); rect(c,-400,955,2800,10,C.w0);
    rect(c,-400,0,300,1080,C.w1); rect(c,-120,0,20,1080,C.w0); rect(c,2020,0,400,1080,C.w1); rect(c,2020,0,20,1080,C.w0); rect(c,-400,0,2800,40,C.w0); });
  // red maple overhanging from the left (foreground-ish layer)
  L(1.1,()=>{ const r=mulberry(55); for(let k=0;k<14;k++){ const bx=-100+r()*700, by=40+r()*260; blob(c,[[bx-60,by],[bx,by-30],[bx+60,by],[bx,by+22]],k%3?'#6E1A1E':'#A82A26'); if(k%2) blob(c,[[bx-30,by-8],[bx,by-26],[bx+30,by-8],[bx,by]],'#D8402F'); } rect(c,-120,0,40,300,'#2A1A16'); });
  F.amb([0.62,0.68,0.96]); c.save(); c.translate(g5(-camX*0.8),0); F.light(c,1600,550,330,'#FFC870',0.55,{ry:0.9}); F.light(c,300,1080,700,'#F09A48',0.3,{ry:0.5}); F.light(c,1100,780,300,'#8C9CC8',0.25,{ry:0.4}); c.restore(); };

// ---------- O7: reverse angle from behind the counter ----------
E4.izakayaRev=(c,t,o={})=>{ const camX=o.camX||0; c.save(); c.translate(-g5(camX),0);
  // front wall: entrance with noren (right), lattice window with rain + street lantern glow, kamidana high left-centre
  rect(c,-300,0,2600,95,C.w0); F.planks(c,-300,95,2600,700,60,[C.w3,C.w2,C.w4,C.w1],61,true);
  rect(c,250,230,520,330,C.night); c.save(); c.beginPath(); c.rect(250,230,520,330); c.clip(); rect(c,250,470,520,90,C.n2); akachochin(c,600,300,26,t,{sway:0.4}); F.rain(c,t,{seed:14,splash:false,dens:0.7}); c.restore(); lattice(c,250,230,520,330,10,30,C.w1);
  rect(c,1460,200,400,620,C.n2); c.save(); c.beginPath(); c.rect(1460,200,400,620); c.clip(); rect(c,1460,600,400,220,C.night); F.rain(c,t,{seed:15,splash:false,dens:0.8}); c.restore(); rect(c,1440,190,30,640,C.w0); rect(c,1850,190,30,640,C.w0);
  noren(c,1470,210,380,230,3,t,{sway:o.norenSway||1,crest:38,gust:o.gust||0});
  const kx=1060, ky=300; rect(c,kx-180,ky,360,22,C.w4); rect(c,kx-180,ky+22,360,10,C.w1); poly(c,[[kx-100,ky],[kx-100,ky-100],[kx+100,ky-100],[kx+100,ky]],C.paper); poly(c,[[kx-125,ky-100],[kx,ky-155],[kx+125,ky-100]],C.w3); rect(c,kx-40,ky-85,80,85,C.w2);
  rect(c,kx-180,ky-175,360,14,C.lan2); const bellOn=o.bell==null||t<o.bell; rect(c,kx-125,ky-80,8,80,C.w1); if(bellOn){ F.bell(c,kx-121,ky+5,t); const gl=(t*0.8)%1; if(gl<0.1){ rect(c,kx-151,ky-15,20,5,'#FFF8EC'); rect(c,kx-101,ky-15,20,5,'#FFF8EC'); } }
  akachochin(c,520,95+60,50,t,{mark:1,sway:o.lanSway||1});
  // Jay's side: stools + floor beyond the counter
  rect(c,-300,930,2600,150,C.stone0); for(let x=-300;x<2400;x+=100) rect(c,x,930,95,45,'#5A5F73');
  for(const sx of [700,1150]){ rect(c,sx-55,830,110,20,C.w4); rect(c,sx-45,853,15,77,C.w1); rect(c,sx+30,853,15,77,C.w1); }
  if(o.mid) o.mid(c);
  // counter top seen from behind (foreground): cutting board, knife, scallions, bowls stacked; the pot steaming
  rect(c,-300,760,2600,60,C.w5); rect(c,-300,760,2600,10,'#E2B880'); F.planks(c,-300,820,2600,260,50,[C.w2,C.w1,C.w3,C.w0],71,false);
  rect(c,300,730,300,40,'#C9965E'); rect(c,300,730,300,8,'#E2B880'); rect(c,380,720,160,10,'#B9B6AC'); rect(c,540,718,60,14,C.w0); for(let k=0;k<6;k++) rect(c,320+k*12,740,10,10,'#7C9A6E');
  for(let k=0;k<3;k++) ell(c,1700,750-k*18,70,18,0,k%2?'#1E2233':'#33201A');
  if(o.front) o.front(c);
  c.restore();
  c.save(); c.translate(-g5(camX),0); F.amb([0.72,0.68,0.72]); const fli=0.9+0.1*Math.sin(t*23)*Math.sin(t*7.3); F.light(c,520,260,850,'#FFC870',0.42*fli*(o.flick??1),{ry:0.8}); F.light(c,1660,700,380,'#8C9CC8',0.2); F.cast(c,520,260,{a:0.4}); c.restore(); };

// ---------- O8: kamidana insert (close-up) ----------
E4.kamidanaClose=(c,t,o={})=>{ const dy=g5(o.dy||0); c.save(); c.translate(0,dy);
  F.planks(c,-20,-200,1960,1400,90,[C.w3,C.w2,C.w4,C.w1],81,true);
  rect(c,200,690,1520,70,C.w4); rect(c,200,690,1520,15,'#E2B880'); rect(c,200,760,1520,25,C.w1); rect(c,260,785,40,140,C.w1); rect(c,1620,785,40,140,C.w1);
  // miniature shrine
  rect(c,620,360,620,330,C.paper); rect(c,640,380,580,310,'#E2D3B8'); poly(c,[[540,370],[930,180],[1320,370]],C.w3); poly(c,[[560,370],[930,200],[1300,370],[1300,385],[560,385]],C.w2); rect(c,540,365,780,22,C.w1);
  rect(c,800,450,260,240,C.w2); rect(c,810,460,115,230,C.w3); rect(c,935,460,115,230,C.w3); circ(c,930,560,22,'#D9A441'); circ(c,925,555,10,'#F2D27A');
  // shimenawa rope + shide zigzags
  for(let x=200;x<1720;x+=40){ const y=g5(150+Math.sin(x*0.004)*-30); rect(c,x,y,40,30,'#D9A441'); rect(c,x,y,20,10,'#F2D27A'); rect(c,x+20,y+20,20,10,'#B9832C'); }
  for(const zx of [380,700,1160,1480]){ const sw=g5(Math.sin(t*2+zx)*8*(o.gust||0.4)); poly(c,[[zx+sw,190],[zx+40+sw,190],[zx+15+sw,250],[zx+50+sw,250],[zx+20+sw,320],[zx-10+sw,320],[zx+15+sw,250],[zx-20+sw,250]],C.paper2); }
  // sakaki branches
  for(const sx of [330,1530]){ rect(c,sx,560,15,130,C.w1); for(let k=0;k<6;k++){ const lx=sx+(k%2?-50:50), ly=420+k*28; blob(c,[[lx-40,ly],[lx,ly-25],[lx+40,ly],[lx,ly+18]],k%2?C.fol2:'#7C9A6E'); poly(c,[[lx,ly-25],[lx+40,ly],[lx,ly+5]],C.fol1); } }
  // the bell on its post (right of the shrine)
  const bx=1400, by=500; rect(c,bx-8,280,16,160,C.w1); rect(c,bx-60,270,120,20,C.w1);
  const sw=o.swing||0; const ang=Math.sin(t*7)*sw*Math.exp(-(t-(o.tb||0))*1.5);
  if(o.bellOn) bellBig(c,bx,by,90,t,{sw:0.03}); else { c.save(); c.translate(bx,440); c.rotate(ang); rect(c,-5,0,10,60,'#4A2A1C'); rect(c,-15,55,30,10,'#8A5A1E'); for(let k=0;k<6;k++) rect(c,-14,70+k*40,28,40,k%2?'#D8402F':'#F5F1E8'); c.restore(); }
  c.restore();
  F.amb([0.78,0.72,0.74]); F.light(c,1100,0,1100,'#FFC870',0.38,{ry:0.7}); F.light(c,bx,by,260,'#FFE7A8',o.bellOn?0.3:0.0); };
})(window);
