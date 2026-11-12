// film7_patch.js — v7 (final commercial round): tatami layout + right wall in the zen room; the full v6 QA list.
(function(G){
const {mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,blob,capsule}=G.K; const E=G.E, E4=G.E4, E5=G.E5, E6=G.E6, F=G.FILM, SPR=G.SPR, D=G.DATA, PX=G.PX; const {g5,J,Ja,seq,fxW,poof,bell}=F; const pj=E6.pj, Q=E6.Q; const W=1920,H=1080; const C=E4.C;
F.NEW7=[]; const shot7=(id,t0,t1,fn,tr)=>{ F.NEW7.push(id); F.SHOTS=F.SHOTS.filter(s=>s.id!==id); F.shot(id,t0,t1,fn,tr); };
const S=(set)=>(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,set); const Hs=S('H'), Ls=S('L'), Ms=S('M'), Ts=S('T'), Ks=S('K'), KL=S('KL'), XLs=S('XL'), Ds=S('D'), DX=S('DX');
const sh=(c,x,y,w,col)=>E6.shadow(c,x,y,w,col);
const fl=(t)=>0.92+0.08*Math.sin(t*19)*Math.sin(t*5.3);
// ======================= zen zashiki (S23 b / O7), refined =======================
const HW=3.6, ZB=6.3, YC=2.5;
E6.zen=(c,t,K,o={})=>{ const sn=o.snow!==false; const gust=o.gust||0; const Zj=E6.zOf(K,'L');
  rect(c,0,0,W,H,C.w0);
  // --- beyond the open shoji: engawa, snow (or rain) garden, wall, pines, moon ---
  { const [x0,y0]=pj(K,-2.4,1.95,ZB), [x1,y1]=pj(K,2.4,0,ZB); c.save(); c.beginPath(); c.rect(x0,y0,x1-x0,y1-y0+400); c.clip();
    E6.sky(c,t,{h:K.h-40,seed:19}); if(sn) E.moon(c,g5(x1-120),g5(y0+90),55,{});
    // garden plane continues outside (Y -0.45, lower than the room floor), wall with tile cap at Z 16, pines
    { const r=mulberry(44); for(let k=0;k<9;k++){ const X=-7+k*1.8+r()*0.6, Z=18+r()*2; const [px,py]=pj(K,X,1.3,Z); const sc=K.f/Z, hh=sc*(1.6+r()*1.2); rect(c,g5(px-sc*0.08),g5(py-hh*0.6),Math.max(5,g5(sc*0.16)),g5(hh*0.6),'#1C262B'); poly(c,[[g5(px-sc*0.8),g5(py-hh*0.45)],[g5(px),g5(py-hh*1.25)],[g5(px+sc*0.8),g5(py-hh*0.45)]],'#16261E'); if(sn) poly(c,[[g5(px-sc*0.5),g5(py-hh*0.8)],[g5(px),g5(py-hh*1.22)],[g5(px+sc*0.3),g5(py-hh*0.9)]],'#C8D4F0'); } }
    Q(c,K,[[-12,-0.45,16],[12,-0.45,16],[12,1.6,16],[-12,1.6,16]],sn?'#8C9CC8':'#4A5378'); Q(c,K,[[-12,1.6,15.7],[12,1.6,15.7],[12,1.85,16.2],[-12,1.85,16.2]],'#1C2238'); if(sn) Q(c,K,[[-12,1.82,15.8],[12,1.82,15.8],[12,1.9,16.2],[-12,1.9,16.2]],'#F2E8D5');
    Q(c,K,[[-12,-0.45,ZB+1.2],[12,-0.45,ZB+1.2],[12,-0.45,16],[-12,-0.45,16]],sn?'#C8D4F0':'#2F4A3A');
    if(!sn) for(let k=0;k<8;k++){ const [rx,ry]=pj(K,-2+k*0.6,-0.45,9+k%3*2); ell(c,g5(rx),g5(ry),g5(30+k*3),5,0,'#5A6A9A'); }
    // raked gravel lines + a stone lantern and a snow-capped rock
    for(let Z=ZB+1.6;Z<15;Z+=0.5) Q(c,K,[[-12,-0.45,Z],[12,-0.45,Z],[12,-0.45,Z+0.05],[-12,-0.45,Z+0.05]],sn?'#A8B4D0':'#22382A');
    { const X=1.4, Z=10; E6.box(c,K,X-0.15,X+0.15,-0.45,0.5,Z,Z+0.3,'#7E7C76','#5A5F73',sn?'#E2E8F0':null); E6.box(c,K,X-0.35,X+0.35,0.5,0.85,Z-0.05,Z+0.6,'#7E7C76','#5A5F73',sn?'#E2E8F0':null);
      const [lx,ly]=pj(K,X,0.7,Z-0.06); rect(c,g5(lx-15),g5(ly-10),30,20,'#FFC870'); F.light(c,lx,ly,180,'#FFC870',0.5*fl(t)); Q(c,K,[[X-0.55,0.85,Z-0.3],[X+0.55,0.85,Z-0.3],[X,1.3,Z+0.3]],sn?'#F2E8D5':'#5A5F73'); }
    { const [rx,ry]=pj(K,-1.3,-0.45,9); const s=K.f/9; blob(c,[[rx-s*0.7,ry],[rx-s*0.4,ry-s*0.5],[rx+s*0.5,ry-s*0.45],[rx+s*0.7,ry]],'#43475A'); if(sn) blob(c,[[rx-s*0.5,ry-s*0.35],[rx-s*0.3,ry-s*0.55],[rx+s*0.45,ry-s*0.5],[rx+s*0.55,ry-s*0.3]],'#E2E8F0'); }
    // engawa (veranda) boards just outside the room (Z ZB..ZB+1.2, Y 0), its edge beam
    Q(c,K,[[-12,0,ZB],[12,0,ZB],[12,0,ZB+1.2],[-12,0,ZB+1.2]],C.w3); for(let X=-12;X<12;X+=0.25) Q(c,K,[[X,0,ZB],[X+0.02,0,ZB],[X+0.02,0,ZB+1.2],[X,0,ZB+1.2]],C.w2);
    Q(c,K,[[-12,0,ZB+1.2],[12,0,ZB+1.2],[12,-0.12,ZB+1.2],[-12,-0.12,ZB+1.2]],C.w1);
    // falling snow / rain seen through the opening
    { const r=mulberry(81); for(let k=0;k<70;k++){ const ph=r(); const xx=x0+r()*(x1-x0)+(sn?Math.sin(t+k)*12:0), yy=y0+((ph*(y1-y0+200)+t*(sn?45+r()*30:520))%(y1-y0+200)); if(sn) rect(c,g5(xx),g5(yy),5,5,'#F2E8D5'); else rect(c,g5(xx),g5(yy),5,20,'#8C9CC8'); } }
    c.restore(); F.light(c,(x0+x1)/2,y1,(x1-x0)*0.6,sn?'#C8D4F0':'#8C9CC8',0.18,{ry:0.4}); }
  // --- the room: ceiling boards + three cross beams, back opening framed by posts, kamoi and ranma ---
  Q(c,K,[[-HW,YC,0.4],[HW,YC,0.4],[HW,YC,ZB],[-HW,YC,ZB]],C.w3); for(let X=-HW;X<HW;X+=0.45) Q(c,K,[[X,YC,0.4],[X+0.03,YC,0.4],[X+0.03,YC,ZB],[X,YC,ZB]],C.w2);
  for(const Z of [1.6,3.4,5.0]){ Q(c,K,[[-HW,YC-0.18,Z],[HW,YC-0.18,Z],[HW,YC,Z],[-HW,YC,Z]],C.w1); Q(c,K,[[-HW,YC-0.18,Z],[HW,YC-0.18,Z],[HW,YC-0.18,Z+0.15],[-HW,YC-0.18,Z+0.15]],C.w0); }
  Q(c,K,[[-HW,1.95,ZB],[HW,1.95,ZB],[HW,YC,ZB],[-HW,YC,ZB]],'#E2D3B8'); for(let X=-HW+0.2;X<HW;X+=0.3) Q(c,K,[[X,2.05,ZB-0.01],[X+0.15,2.05,ZB-0.01],[X+0.15,2.4,ZB-0.01],[X,2.4,ZB-0.01]],C.w2);
  Q(c,K,[[-HW,1.95,ZB-0.02],[HW,1.95,ZB-0.02],[HW,2.07,ZB-0.02],[-HW,2.07,ZB-0.02]],C.w1);
  // shoji pushed aside: two panels at each side of the opening (X ±2.4..±3.6), lattice glowing
  for(const sd of [-1,1]){ const xa=2.4*sd, xb=HW*sd; Q(c,K,[[xa,0,ZB-0.03],[xb,0,ZB-0.03],[xb,1.95,ZB-0.03],[xa,1.95,ZB-0.03]],'#E8DCC4');
    for(let k=0;k<=4;k++){ const X=lerp(xa,xb,k/4); Q(c,K,[[X-0.02,0,ZB-0.04],[X+0.02,0,ZB-0.04],[X+0.02,1.95,ZB-0.04],[X-0.02,1.95,ZB-0.04]],C.w3); } for(let Y=0.25;Y<1.95;Y+=0.28) Q(c,K,[[xa,Y,ZB-0.04],[xb,Y,ZB-0.04],[xb,Y+0.02,ZB-0.04],[xa,Y+0.02,ZB-0.04]],C.w3);
    Q(c,K,[[xa-0.06*sd,0,ZB-0.05],[xa+0.04*sd,0,ZB-0.05],[xa+0.04*sd,1.95,ZB-0.05],[xa-0.06*sd,1.95,ZB-0.05]],C.w1); }
  for(const X of [-HW,HW]) Q(c,K,[[X-0.08,0,ZB-0.06],[X+0.08,0,ZB-0.06],[X+0.08,YC,ZB-0.06],[X-0.08,YC,ZB-0.06]],C.w1);
  Q(c,K,[[-2.4,0,ZB-0.06],[2.4,0,ZB-0.06],[2.4,0.05,ZB-0.06],[-2.4,0.05,ZB-0.06]],C.w1);
  // left wall: tokonoma alcove with an ensō scroll and a single camellia; right wall: fusuma
  { const X=-HW; Q(c,K,[[X,0,0.4],[X,0,ZB],[X,YC,ZB],[X,YC,0.4]],'#E2D3B8'); Q(c,K,[[X,1.95,0.4],[X,1.95,ZB],[X,2.07,ZB],[X,2.07,0.4]],C.w1);
    const Z0=3.4, Z1=5.4, XA=X-0.6; Q(c,K,[[XA,0.15,Z0],[XA,0.15,Z1],[XA,1.95,Z1],[XA,1.95,Z0]],'#C9B48E'); Q(c,K,[[X,0.15,Z0],[XA,0.15,Z0],[XA,0.15,Z1],[X,0.15,Z1]],C.w4); Q(c,K,[[X,0,Z0],[X,0,Z1],[X,0.15,Z1],[X,0.15,Z0]],C.w2);
    Q(c,K,[[X,0,Z0-0.08],[X,0,Z0],[X,1.95,Z0],[X,1.95,Z0-0.08]],C.w1);
    const zc=(Z0+Z1)/2; Q(c,K,[[XA+0.01,1.75,zc-0.3],[XA+0.01,1.75,zc+0.3],[XA+0.01,0.5,zc+0.3],[XA+0.01,0.5,zc-0.3]],'#F2E8D5');
    for(let k=0;k<40;k++){ const a=k/40*6.0+0.9; const w=0.25+0.75*Math.sin(k/40*Math.PI); const [px,py]=pj(K,XA+0.02,1.12+Math.sin(a)*0.2,zc+Math.cos(a)*0.17); const d=Math.round(5+w*10); rect(c,g5(px-d/2),g5(py-d/2),g5(d)||5,g5(d)||5,'#141A30'); } { const [sx,sy]=pj(K,XA+0.02,0.62,zc+0.2); rect(c,g5(sx),g5(sy),10,10,'#A82A26'); }
    const [vx,vy]=pj(K,XA+0.3,0.15,zc+0.6); rect(c,g5(vx-10),g5(vy-40),20,40,'#2B3A67'); capsule(c,vx,vy-40,3,vx+15,vy-110,3,C.w1); circ(c,g5(vx+15),g5(vy-112),12,'#D8402F'); blob(c,[[vx,vy-80],[vx+20,vy-90],[vx+10,vy-72]],C.fol2); }
  { const X=HW; Q(c,K,[[X,0,0.4],[X,0,ZB],[X,YC,ZB],[X,YC,0.4]],'#D4C4A4'); for(let Z=0.4;Z<ZB;Z+=0.9) Q(c,K,[[X,0,Z],[X,0,Z+0.03],[X,1.95,Z+0.03],[X,1.95,Z]],C.w2); Q(c,K,[[X,1.95,0.4],[X,1.95,ZB],[X,2.07,ZB],[X,2.07,0.4]],C.w1);
    for(let Z=0.4+0.9;Z<ZB;Z+=1.8){ const [hx,hy]=pj(K,X-0.01,0.85,Z-0.12); const s=K.f/(Z-0.12); rect(c,g5(hx-s*0.012),g5(hy-s*0.05),Math.max(5,g5(s*0.03)),Math.max(5,g5(s*0.1)),C.w1); }
    Q(c,K,[[X-0.01,0,0.4],[X-0.01,0,ZB],[X-0.01,0.1,ZB],[X-0.01,0.1,0.4]],C.w2); }
  // --- tatami: traditional layout, every mat 1.8 x 0.9 with its long side running INTO the room (heri borders converge on the
  //     vanishing point); neighbouring columns offset by half a mat so no four corners ever meet; one even straw-green, rushes along the length ---
  Q(c,K,[[-HW,0,0.4],[HW,0,0.4],[HW,0,ZB],[-HW,0,ZB]],'#A8C08A');
  for(let k=0;k<8;k++){ const xa=-HW+k*0.9, xb=xa+0.9; const off=k%2?0.9:0;
    for(let Zb=ZB-off;Zb>0.4;Zb-=1.8){ const za=Math.max(0.4,Zb-1.8);
      for(const u of [0.25,0.5,0.75]) Q(c,K,[[lerp(xa,xb,u)-0.006,0,za],[lerp(xa,xb,u)+0.006,0,za],[lerp(xa,xb,u)+0.006,0,Zb],[lerp(xa,xb,u)-0.006,0,Zb]],'#9DB680');
      if(za>0.41) Q(c,K,[[xa+0.04,0,za-0.012],[xb-0.04,0,za-0.012],[xb-0.04,0,za+0.012],[xa+0.04,0,za+0.012]],'#7E9A6A'); }
    if(off&&k<8) Q(c,K,[[xa+0.04,0,ZB-0.9-0.012],[xb-0.04,0,ZB-0.9-0.012],[xb-0.04,0,ZB-0.9+0.012],[xa+0.04,0,ZB-0.9+0.012]],'#7E9A6A'); }
  for(let k=0;k<=8;k++){ const X=-HW+k*0.9; Q(c,K,[[X-0.035,0,0.4],[X+0.035,0,0.4],[X+0.035,0,ZB],[X-0.035,0,ZB]],'#2F4A3A'); }
  // straw sheen: fixed glints on the rushes near the lamp and the opening (slow twinkle, never random flicker)
  { const r=mulberry(77); for(let k=0;k<16;k++){ const X=0.6+r()*2.6, Z=2.6+r()*3.2; if(Math.sin(t*1.3+k*2.1)<0.2) continue; const [x,y]=pj(K,X,0,Z); rect(c,g5(x),g5(y),5,5,'#F2D27A'); } }
  // andon lamp (right, behind him) + incense burner in front of the alcove, smoke bending with the gust
  { const Z=4.0, X=1.9; const [x,y]=pj(K,X,0,Z); const s=K.f/Z; rect(c,g5(x-s*0.17),g5(y-s*0.72),g5(s*0.34),g5(s*0.62),C.w1); rect(c,g5(x-s*0.14),g5(y-s*0.69),g5(s*0.28),g5(s*0.52),'#FFE7A8'); rect(c,g5(x)-2,g5(y-s*0.69),5,g5(s*0.52),C.w3); rect(c,g5(x-s*0.2),g5(y-s*0.1),g5(s*0.4),g5(s*0.1),C.w0);
    F.light(c,x,y-s*0.4,s*4.0,'#FFC870',0.42*fl(t),{ry:0.6}); F.light(c,x,y-s*0.4,s*0.8,'#FFE7A8',0.25*fl(t)); F.cast(c,x,y-s*0.4,{a:0.3}); }
  { const [ix,iy]=pj(K,-1.4,0,3.3); const s=K.f/3.3; ell(c,g5(ix),g5(iy),g5(s*0.12),g5(s*0.04),0,'#43475A'); rect(c,g5(ix-s*0.1),g5(iy-s*0.1),g5(s*0.2),g5(s*0.1),'#7E7C76'); rect(c,g5(ix-s*0.11),g5(iy-s*0.11),g5(s*0.22),5,'#B9B6AC');
    for(let k=0;k<14;k++){ const ph=((t*0.3)+k/14)%1; if(ph>0.9) continue; const sx=ix+Math.sin(ph*8+k)*18*ph+gust*ph*260, sy=iy-s*0.12-ph*360; rect(c,g5(sx),g5(sy),5,15,'#B9B6AC'); if(ph>0.35) rect(c,g5(sx+12*Math.sin(ph*9)),g5(sy-20),5,10,'#B9B6AC'); } }
  F.amb(o.amb||(sn?[0.86,0.84,0.9]:[0.84,0.82,0.9]));
};
// ======================= v7 item 4 — S01 5.4–8.93: Jay walks on the RIGHT of the frame, clear of the vertical title (x 130–550) =======================
{ const S01v5=F.SHOTS.find(s=>s.id==='S01'); const fn5=S01v5.fn, tr=S01v5.tr; const K=E6.camFor('L',640,{vx:1250,camH:4.2});
  // walk_umb planted foot travels 1.5 low-res px / frame = 225 world px/s at L scale -> body moves exactly that (no foot slide)
  shot7('S01',0,8.93,(c,t)=>{ if(t<5.4) return fn5(c,t); const lt=t-5.4; E6.lane(c,t,{snow:false,K}); const fy=640;
    const x=g5(760+lt*225);
    const px0=g5(x-200), px1=g5(x+320), pcx=g5((px0+px1)/2), pcy=fy+230, prx=g5((px1-px0)/2), pry=200;
    ell(c,pcx,pcy,prx,pry,0,'#2E3756'); ell(c,pcx,pcy,prx-10,pry-10,0,'#5A6A9A'); for(const [dx,dy,w] of [[-160,-110,220],[-60,60,280],[40,140,160]]) rect(c,g5(pcx+dx),g5(pcy+dy),w,5,'#8C9CC8');
    c.save(); c.beginPath(); c.ellipse(pcx,pcy,prx-10,pry-10,0,0,6.283); c.clip();
    F.mirrorSprite(c,'L','walk',SPR.frameAt('L','walk',t,5.4),x,fy+5,1,null,t,0.8,null); c.restore();
    F.ripples(c,t,{n:7,x0:px0+60,x1:px1-60,y0:fy+60,y1:fy+400,r0:5,r1:25,sq:0.3,col:'#5A6A9A',per:0.8,seed:41});
    sh(c,x,fy,80); Hs(c,'walk_umb',t,5.4,x,fy,1);
    F.rain(c,t,{seed:5,dens:0.7}); F.amb([0.66,0.7,0.96]); },tr); }

// ======================= v7 item 10 — S24 torii: camera speed = walk speed at the L depth (225 px/s / 270 px/m = 0.833 m/s) =======================
{ const old=F.SHOTS.find(s=>s.id==='S24'); const tr=old.tr;
  shot7('S24',91.05,93.18,(c,t)=>{ const lt=t-91.05; const K=E6.KTOR; const fy=g5(K.h+K.camH*270); const cam=lt*(225/270);
    E6.toriiSide(c,t,cam,{}); sh(c,900,fy,90); Ls(c,'walk',t,91.05,900,fy,1); E6.toriiNear(); E.snow(c,t,121,110,{});
    if(t>=92.206&&t<92.206+4/30){ rect(c,0,0,W,H,'#F2E8D5'); E.castle(c,t,960,900,1.3,{wall:'#4A2A1C',roof:'#4A2A1C',stone:'#4A2A1C'}); } },tr); }

// ======================= v7 item 12 — S26 gate: the yaguramon brought to Z 8.4 so the castle reads at its true size next to the guards / Jay =======================
const castleGate7=eval('('+E6.castleGate.toString().replace('const ZG=13;','const ZG=o.ZG||13;')+')');
{ const old=F.SHOTS.find(s=>s.id==='S26'); const tr=old.tr; const Ss=S('S');
  shot7('S26',95.43,97.53,(c,t)=>{ const K=E6.KGATE; castleGate7(c,t,K,{ZG:8.4}); const fM=g5(K.h+K.camH*135);
    const gx=X=>g5(K.vx+X*135); sh(c,gx(-1.25),fM,35); Ss(c,'guard',t,95.43,gx(-1.25),fM,1); sh(c,gx(1.25),fM,35); Ss(c,'guard_r',t,95.43,gx(1.25),fM,-1);
    const px=gx(lerp(-2.3,-0.2,(t-95.43)/2.1)); sh(c,px,fM,35); Ss(c,'walk_lan',t,95.43,px,fM,1); F.light(c,px+45,fM-90,160,'#FFC870',0.5*(0.9+0.1*Math.sin(t*20)));
    // Jay crouched ON the tile cap of the left dobei at the M depth (cap top Y 4.3, its inner edge X -2.45)
    const [wx,wy]=pj(K,-2.5,4.3,E6.zOf(K,'M')); Ms(c,'crouch',t,95.43,g5(wx)+10,g5(wy),1);
    E.snow(c,t,131,100,{}); },tr); }

// ======================= S25 contact shadows (ninja Jay with the blowgun, the sentinel) =======================
{ const old=F.SHOTS.find(s=>s.id==='S25'); const tr=old.tr; const tBlow2=94.32;
  shot7('S25',93.18,95.43,(c,t)=>{ E5.corner(c,t,{snow:true,lx:1585,ly:300});
    const kk=Math.min(5,Math.floor((t-93.3)/0.16)); sh(c,1250,900,110,'#0E1020'); J(c,'blowgun',Math.max(0,kk),1250,900,-1,null,'D');
    if(t<tBlow2+0.6){ sh(c,380,900,100,'#0E1020'); Ls(c,'idle',t,93.18,380,900,1,'shadow'); } else if(t<tBlow2+0.9) sh(c,380,900,g5(100*(1-(t-tBlow2-0.6)/0.3)),'#0E1020'); F.poof(c,380,650,t,tBlow2+0.6);
    const u=inv(tBlow2,tBlow2+0.6,t); if(u>0&&u<1){ const dx=g5(lerp(1110,430,u)); rect(c,dx,595,g5(lerp(80,400,u)),5,'#C8D4F0'); rect(c,dx,592,60,8,'#E2D3B8'); F.light(c,dx,595,200,'#C8D4F0',0.5,{add:true}); }
    F.amb([0.55,0.62,1.0]); },tr); }

// ======================= S42a 154.43–155.40: back at the counter — Jay seated on his stool (L depth, contact shadow), waking with a start =======================
{ const old=F.SHOTS.find(s=>s.id==='S42a'); const tr=old.tr;
  shot7('S42a',154.43,155.40,(c,t)=>{ const K=E6.KCTR; const fy=g5(K.h+K.camH*270);
    E6.counterP(c,t,{behind:(c,K)=>Ts(c,'m_stir',t,0,g5(K.vx+1.65*270),fy,-1)});
    Q(c,K,[[0.4,0,1.3],[1.25,0,1.3],[1.25,0.8,1.3],[0.4,0.8,1.3]],C.w2);
    const jx=g5(K.vx-0.05*270); sh(c,jx-10,fy,80); Hs(c,'react_seat',t,154.62,jx,fy,1);
    { const [bx,by]=pj(K,0.6,0.8,800/270); ell(c,g5(bx),g5(by+10),30,20,0,'#6E1A1E'); ell(c,g5(bx),g5(by),30,8,0,'#2A1E1A'); rect(c,g5(bx-30),g5(by-5),60,5,'#A82A26'); E4.steam(c,t,g5(bx),g5(by-10),3,{h:200}); }
    F.FX.amb=[0.98,0.9,0.82]; },tr); }

// ======================= duel clash: no full-frame palette flash; a local burst at the blades instead =======================
F.FLASHES=F.FLASHES.filter(s=>!(s.t>64.1&&s.t<73)&&!(s.t>76.4&&s.t<76.9)&&!(Math.abs(s.t-122.633)<0.01)&&!(Math.abs(s.t-150.45)<0.01));

// ======================= v7 item 9 — smoke bombs: night-toned solid puffs (no paper-white balls, no checker), billowing up and thinning =======================
F.smoke=(c,t,ts,cx,cy,opt={})=>{ const u=t-ts; if(u<0||u>1.5) return; const r=mulberry(opt.seed||3); const grow=eo(Math.min(1,u/0.45)), fade=inv(0.8,1.5,u);
  const P=[]; for(let k=0;k<16;k++){ const a=r()*6.283, d=(60+r()*260)*grow, R0=60+r()*90; P.push([cx+Math.cos(a)*d*1.2+u*40*(r()-0.3), cy+Math.sin(a)*d*0.45-u*(60+r()*90), R0*(0.5+grow*0.7)*(1-fade*0.85), r()]); }
  P.sort((a,b)=>a[1]-b[1]);
  for(const [x,y,R] of P){ if(R<10) continue; circ(c,g5(x),g5(y),g5(R),'#43475A'); }
  for(const [x,y,R] of P){ if(R<14) continue; circ(c,g5(x-R*0.15),g5(y-R*0.25),g5(R*0.72),fade>0.5?'#43475A':'#5A5F73'); }
 };

// ======================= v7 item 5/7 — the roof/town environment: calm town, moon never cut by the horizon, readable ground =======================
{ let src=E6.keepRoof.toString();
  const rep=(a,b)=>{ if(!src.includes(a)) throw new Error('keepRoof7 patch miss: '+a.slice(0,60)); src=src.replace(a,b); };
  // silhouettes: a soft low mountain ridgeline instead of a full-width band; the moon is lifted fully above it
  rep("if(sil){ rect(c,0,g5(K.h-160),W,160,'#253052'); E.dither(c,0,g5(K.h-260),W,100,'#253052',0.5); rect(c,0,g5(K.h-60),W,60,'#2E3756'); }",
      "if(sil){ const pts=[[-50,K.h+5]]; for(let x=-50;x<=1980;x+=60){ pts.push([x,g5(K.h-40-46*(0.5+0.5*Math.sin(x*0.0042+1.3))-22*Math.sin(x*0.011))]); } pts.push([1980,K.h+5]); poly(c,pts,'#253052'); rect(c,0,g5(K.h-20),W,25,'#1C2238'); }");
  rep("if(o.moon!==false&&!storm){ const m=o.moon||{x:1400,y:220,r:140};",
      "if(o.moon!==false&&!storm){ const m0=o.moon||{x:1400,y:220,r:140}; const mr=Math.max(70,Math.min(m0.r,260,sil?260:(K.h-80)/2)); let mx0=m0.x, my0=Math.max(m0.y,mr+40); if(mx0>1300&&mx0<1800&&my0<340) mx0-=450; const m={x:mx0,r:mr,y:Math.max(mr+20,Math.min(my0,K.h-mr-(sil?150:30)))};");
  rep("rect(c,0,g5(K.h),W,H,sil?'#0E1020':'#141A30');","rect(c,0,g5(K.h),W,H,sil?'#141A30':'#141A30');");
  // the town: half the houses, roof value by distance band (not random), fewer lit windows, sparser street lamps
  rep("for(let k=0;k<300;k++)","for(let k=0;k<140;k++)");
  rep("if(sil){ rect(c,g5(x-w/2),g5(y-hw),g5(w),g5(hw),'#0E1020'); continue; }",
      "if(sil){ rect(c,g5(x-w/2),g5(y-hw),g5(w),g5(hw),'#0E1020'); if(q2<0.16&&Z<220) rect(c,g5(x-w/4),g5(y-hw*0.7),5,5,'#F09A48'); continue; }");
  rep("if(q2<0.55) rect(","if(q2<0.28) rect(");
  rep("wx==='snow'?(Z>120?'#4A5378':(q3<0.5?'#8C9CC8':'#5A6A9A')):(storm?'#253052':'#2E3756')","wx==='snow'?(Z>150?'#2E3756':(Z>80?'#4A5378':'#5A6A9A')):(storm?'#253052':'#2E3756')");
  rep("if(wx==='snow'&&q2<0.35&&Z<150) rect(c,g5(x-w/2+s*0.4),g5(y-hw-rh),g5(w-s*0.8),5,'#C8D4F0');","if(wx==='snow'&&Z<90) rect(c,g5(x-w/2+s*0.4),g5(y-hw-rh),g5(w-s*0.8),5,'#8C9CC8');");
  rep("for(let Z=30;Z<400;Z*=1.08)","for(let Z=30;Z<400;Z*=1.16)");
  rep("E.dither(c,0,g5(K.h),W,40,'#253052',0.5); }","rect(c,0,g5(K.h),W,10,'#253052'); }");
  // moonlit rim on the ridge cap in silhouette shots so feet read against the roof
  rep("E6.box(c,K,o.step?o.step.x-cam:-40,40,-0.35,0,Zr-0.22,Zr+0.22,cap,cap,sil?'#141A30':","E6.box(c,K,o.step?o.step.x-cam:-40,40,-0.35,0,Zr-0.22,Zr+0.22,cap,cap,sil?'#4A5378':");
  rep("if(o.tiers!==false){","if(o.tiers===true){");
  rep("for(let k=0;k<22;k++){ const X=(r()-0.5)*20-cam*0, u=0.1+r()*0.8;","for(let k=0;k<9;k++){ const X=(r()-0.5)*20-cam*0, u=0.1+r()*0.8;");
  rep("[X-cam+0.1,Y-0.12,Z-0.15]],'#C8D4F0');","[X-cam+0.1,Y-0.12,Z-0.15]],'#4A5378');");
  rep("const sl=sil?'#0E1020':'#2E3756', sl2=sil?'#0E1020':'#1C2238';","const sl=sil?'#1C2238':'#2E3756', sl2=sil?'#141A30':'#1C2238';");
  rep("if(!sil){ const zl=Math.max(0.55,Zr-3.4);","{ const zl=Math.max(0.55,Zr-3.4);");
  E6.keepRoof7=eval('('+src+')'); E6.keepRoof=E6.keepRoof7; }

// ======================= v7 item 3 — S40/S41 151.2–154.43: one continuous close (same camera, same pose clock, bell stays in his hand);
//                         the reality inserts are real shots (5/6/8 frames on the beats), not 1-frame stutters =======================
{ const GY=930; const KRX=E6.camFor('XL',GY,{camH:1.8}); const ZX=E6.zOf(KRX,'XL'); const XLc=S('XL');
  const roofX=(c,t)=>E6.keepRoof(c,t,KRX,{Zr:ZX,wx:'snow',moon:{x:1250,y:300,r:240},tiers:false});
  const jayX=860, bellXY=t=>[jayX+27*5,g5(lerp(GY-700,GY-87*5,eo(inv(151.2,151.45,t))))];
  shot7('S40',151.20,152.37,(c,t)=>{ roofX(c,t); sh(c,jayX,GY,130); XLc(c,'catch',t,151.2,jayX,GY,1); const [bx,by]=bellXY(t); bell(c,bx,by,t); E.snow(c,t,181,25,{calm:1}); },F.SHOTS.find(s=>s.id==='S40').tr);
  const FL=[[152.462,5],[153.043,6],[153.6,8]];
  shot7('S41',152.37,154.43,(c,t)=>{ const f1=FL.some(([ft,n])=>t>=ft&&t<ft+n/30);
    if(f1){ const K=E6.KCTR; const fy=g5(K.h+K.camH*270); E6.counterP(c,t,{behind:(c,K)=>Ts(c,'m_stir',t,0,g5(K.vx+1.65*270),fy,-1)}); Q(c,K,[[0.4,0,1.3],[1.25,0,1.3],[1.25,0.8,1.3],[0.4,0.8,1.3]],C.w2); sh(c,g5(K.vx-0.05*270)-10,fy,80); Hs(c,'chew',t,152,g5(K.vx-0.05*270),fy,1); F.FX.amb=[0.98,0.9,0.82]; return; }
    roofX(c,t); sh(c,jayX,GY,130); XLc(c,'catch',t,151.2,jayX,GY,1); const [bx,by]=bellXY(t); bell(c,bx,by,t); E.snow(c,t,151,60+Math.floor((t-152.37)*20),{}); },F.SHOTS.find(s=>s.id==='S41').tr); }

// ======================= v7 item 8 — S20 72.90–81.39: the moonlit susuki ridge, rebuilt in the env6 projection.
//   Runs are planted (L run = 500 px/s, the sprite's own stride), dust at every footfall, grass sways, the moon sits fully above
//   the hills (no cloud bars across it), mediums/close use their own cameras (no zoomed backgrounds), the clash is a local burst.
const E7=G.E7=G.E7||{};
E7.moonField=(c,t,K,o={})=>{ const m=o.moon||{x:960,y:380,r:230};
  rect(c,0,0,W,H,'#141A30'); rect(c,0,g5(K.h-300),W,H,'#1C2238'); rect(c,0,g5(K.h-130),W,H,'#253052');
  E.stars(c,t,29,80,g5(K.h-160),['#F2E8D5','#4A5378','#8C9CC8']);
  E.moon(c,g5(m.x),g5(m.y),m.r,{}); F.light(c,m.x,m.y,m.r*2.4,'#C8D4F0',0.16);
  // two thin cloud strands that never cross the moon disc
  for(const [cx,cy,w,sp] of [[m.x-m.r-520,m.y-m.r*0.6,300,6],[m.x+m.r+460,m.y-m.r*0.2,240,-5]]){ const x=g5(cx+((t*sp)%120)); ell(c,x,g5(cy),w,15,0,'#253052'); ell(c,x+g5(w*0.4),g5(cy-15),g5(w*0.5),10,0,'#2E3756'); }
  // far hills (two ranges), a soft rim where the moonlight catches the nearer crest
  const ridge=(yb,amp,f,ph,col)=>{ const pts=[[-50,H]]; for(let x=-50;x<=1980;x+=30) pts.push([x,g5(yb-amp*(0.55+0.45*Math.sin(x*f+ph))-amp*0.3*Math.sin(x*f*2.7+ph*2))]); pts.push([1980,H]); poly(c,pts,col); };
  ridge(K.h-10,90,0.0031,o.ph||0.7,'#1C2238'); ridge(K.h+4,36,0.0052,(o.ph||0.7)+2.1,'#141A30');
  rect(c,0,g5(K.h+4),W,H,'#0E1020'); rect(c,0,g5(K.h+4),W,5,'#2E3756');
  // susuki tufts behind the action line (Z 3.6–14): stems + pale moonlit plumes, swaying
  const r=mulberry(o.seed||17); for(let k=0;k<70;k++){ const X=(r()-0.5)*26-(o.cam||0), Z=3.6+r()*r()*11; const [x,y]=pj(K,X,0,Z); if(x<-60||x>W+60) continue; const s=K.f/Z, hh=s*(0.7+r()*0.5), sw=Math.sin(t*1.8+X*0.7)*s*0.08;
    for(let q=-1;q<=1;q++){ const tx=x+q*s*0.12+sw, ty=y-hh*(1-Math.abs(q)*0.15); poly(c,[[g5(x+q*s*0.04),g5(y)],[g5(x+q*s*0.04)+5,g5(y)],[g5(tx)+5,g5(ty)],[g5(tx),g5(ty)]],'#0E1020'); if(r()<0.7) rect(c,g5(tx-s*0.03),g5(ty-s*0.02),Math.max(5,g5(s*0.07)),Math.max(5,g5(s*0.12)),Z<8?'#7E7C76':'#43475A'); } }
  F.amb(o.amb||[0.62,0.64,0.92]); };
E7.moonFieldFG=(c,t,K,o={})=>{ const r=mulberry((o.seed||17)+5); for(let k=0;k<12;k++){ const X=(r()-0.5)*9-(o.cam||0), Z=1.15+r()*0.6; const [x,y]=pj(K,X,0,Z); const s=K.f/Z, hh=s*0.28, sw=Math.sin(t*2.2+X)*s*0.05;
  for(let q=-2;q<=2;q++) poly(c,[[g5(x+q*s*0.03),H],[g5(x+q*s*0.03)+5,H],[g5(x+q*s*0.08+sw)+5,g5(y-hh*(1-Math.abs(q)*0.12))],[g5(x+q*s*0.08+sw),g5(y-hh*(1-Math.abs(q)*0.12))]],'#0E1020'); } };
{ const KW=E6.camFor('L',900,{camH:0.25}), KWM=E6.camFor('M',860,{camH:0.25}); const fL=900, fMd=860;
  const KJ=E6.camFor('L',950,{camH:0.35,vx:960}), KC=E6.camFor('XL',1000,{camH:0.55}); const fMC=g5(KC.h+KC.camH*135);
  const KLs=S('KL');
  const dustAt=(c,t,t0,x,y,face,per)=>{ const ph=((t-t0)%per+per)%per; if(ph<0.3) F.fxW(c,'dust',SPR.frameAt('FX','dust',t,t-ph),x,y,face); };
  const clashT=76.603;
  shot7('S20',72.90,81.39,(c,t)=>{
    if(t<74.5){ E7.moonField(c,t,KW,{moon:{x:960,y:400,r:240}}); const lt=t-72.9; const jx=g5(-60+lt*500), lx=g5(1980-lt*500);
      sh(c,jx,fL,70,'#0E1020'); Ls(c,'run',t,72.9,jx,fL,1,'sil'); dustAt(c,t,72.9,jx-40,fL,1,0.4);
      sh(c,lx,fL,70,'#0E1020'); KLs(c,'run',t,72.95,lx,fL,-1,'sil'); dustAt(c,t,72.95,lx+40,fL,-1,0.4);
      E7.moonFieldFG(c,t,KW,{}); return; }
    if(t<75.2){ E7.moonField(c,t,KJ,{moon:{x:1240,y:430,r:250},ph:1.9,seed:23}); sh(c,760,950,80,'#0E1020'); Ls(c,'idle',t,74.5,760,950,1,'sil'); F.petals(c,t,31,14,{wind:200}); E7.moonFieldFG(c,t,KJ,{seed:23}); return; }
    if(t<75.9){ E7.moonField(c,t,KJ,{moon:{x:700,y:430,r:250},ph:3.1,seed:29}); sh(c,1160,950,80,'#0E1020'); KLs(c,'idle',t,75.2,1160,950,-1,'sil'); F.petals(c,t,31,14,{wind:200}); E7.moonFieldFG(c,t,KJ,{seed:29}); return; }
    if(t<77.2){ E7.moonField(c,t,KWM,{moon:{x:960,y:380,r:250}}); const tc=clashT; let u, lx,ly,jx,jy;
      if(t<tc){ u=inv(75.9,tc,t); lx=g5(lerp(1220,1010,u)); jx=g5(lerp(700,910,u)); ly=jy=g5(fMd-Math.sin(u*Math.PI*0.5)*180); J(c,'jump',Math.min(6,SPR.frameAt('M','jump',t,75.9)),lx,ly,-1,'sil','K'); J(c,'jump',Math.min(6,SPR.frameAt('M','jump',t,75.9)),jx,jy,1,'sil'); }
      else { u=inv(tc,77.2,t); lx=g5(lerp(1010,1250,u)); ly=g5(fMd-Math.sin((0.5+u*0.5)*Math.PI)*180); jx=g5(lerp(910,690,u)); jy=g5(fMd-Math.sin((0.5+u*0.5)*Math.PI)*180); J(c,'jump',6,lx,ly,-1,'sil','K'); J(c,u<0.85?'jump':'land',u<0.85?6:0,jx,jy,1,'sil'); if(u>0.85) sh(c,jx,fMd,35,'#0E1020'); }
      for(const [x,y] of [[jx,jy],[lx,ly]]){ const d=fMd-y; if(d<170) sh(c,x,fMd,g5(35*(1-d/220)),'#0E1020'); }
      if(t>=tc&&t<tc+0.1){ circ(c,960,g5(fMd-250),g5(70-(t-tc)*400),'#FFF8EC'); F.light(c,960,fMd-250,320,'#FFE7A8',0.6,{add:true}); }
      F.sparks(c,t,tc,960,fMd-250,7); if(t>=tc&&t<tc+0.45) F.fxW(c,'poof',SPR.frameAt('FX','poof',t,tc),960,g5(fMd-260),1);
      E7.moonFieldFG(c,t,KWM,{}); return; }
    if(t<79.4){ E7.moonField(c,t,KC,{moon:{x:1380,y:330,r:250},ph:4.2,seed:37}); // close: the defeat — leader on the ridge behind (M depth), Jay XL in front
      if(t<78.878){ sh(c,1500,fMC,35,'#0E1020'); Ks(c,'hold',t,77.2,1500,fMC,-1,'sil'); bell(c,1440,fMC-170,t); } poof(c,1500,fMC-110,t,78.878);
      sh(c,760,1000,130,'#0E1020'); XLs(c,'hurt',t,77.2,760,1000,1); E.snow(c,t,101,Math.floor(Math.min(120,(t-77)*40)),{calm:1}); E7.moonFieldFG(c,t,KC,{seed:37}); return; }
    E7.moonField(c,t,KWM,{moon:{x:960,y:380,r:250}}); sh(c,690,fMd,35,'#0E1020'); if(t<80.5) J(c,'down',1,690,fMd,1,'sil'); else Ja(c,'idle',t,80.5,690,fMd,1,'sil'); E.snow(c,t,101,120,{calm:1}); E7.moonFieldFG(c,t,KWM,{}); },{k:'flash'}); }

// ======================= S16 50.55–55.10: the old flat castleRoof replaced by the env6 keep roof (same ridge/town/moon as the climax) =======================
{ const GY=930; const KRL=E6.camFor('L',GY,{camH:2.4}); const ZL=E6.zOf(KRL,'L'); const v=500/270; const camAt=t=>Math.min(t-50.55,1.45)*v;
  const sparkL=(c,t,ts,x,y)=>{ F.sparks(c,t,ts,x,y,Math.round(ts*7)); if(t>=ts&&t<ts+0.07){ circ(c,g5(x),g5(y),40,'#FFF8EC'); F.light(c,x,y,260,'#FFE7A8',0.6,{add:true}); } };
  shot7('S16',50.55,55.10,(c,t)=>{ const lt=t-50.55;
    if(t<52.0){ const cam=camAt(t); E6.keepRoof(c,t,KRL,{Zr:ZL,wx:'snow',cam,moon:{x:600,y:240,r:150},shachi:9.5});
      const jx=700; sh(c,jx,GY,80); Ls(c,'run',t,50.55,jx,GY,1);
      const Xe=camAt(51.75)+(1700-960)/270, ex=g5(960+(Xe-cam)*270); poof(c,ex,GY-250,t,51.7); if(t>=51.75){ sh(c,ex,GY,80); Ls(c,'idle',t,51.75,ex,GY,-1,'shadow'); }
      E.snow(c,t,151,60,{}); return; }
    E6.keepRoof(c,t,KRL,{Zr:ZL,wx:'snow',moon:{x:1500,y:240,r:180}}); const jx=640, s1=1180, s2=1620, tc=52.4+19/30;
    const st=inv(52.4+12/30,tc,t); const jxx=g5(jx+st*160); sh(c,jxx,GY,80); if(t<52.4) Ls(c,'idle',t,52.0,jx,GY,1); else Ls(c,'slash',t,52.4,jxx,GY,1);
    if(t<tc){ sh(c,s1,GY,80); Ls(c,'idle',t,52.0,s1,GY,-1,'shadow'); } poof(c,s1,GY-250,t,tc); sparkL(c,t,tc,s1-40,GY-260);
    poof(c,s2,GY-250,t,52.25); if(t>=52.3){ sh(c,s2,GY,80); if(t<54.1) Ls(c,'idle',t,52.3,s2,GY,-1,'shadow'); else Ls(c,'throw',t,54.1,s2,GY,-1,'shadow'); }
    const u=inv(54.25,54.45,t); if(u>0&&u<1) fxW(c,'shuriken',Math.floor(t*15)%2,g5(lerp(s2-60,jxx+300,u)),GY-260,-1);
    F.smoke(c,t,54.45,jxx+300,GY-200,{seed:11}); E.snow(c,t,151,60,{}); },F.SHOTS.find(s=>s.id==='S16').tr); }

// ======================= v7 item 6 + S17/S36 scroll art: a real mounted handscroll — brocade, rollers, sumi-e wash landscape,
//   a pine bough, a calligraphy column (real characters) with a vermilion seal; figures in two-tone sepia ink (faces/hands read),
//   the pupils' red scarves the only colour =======================
{ const PALh=SPR.data.palette; const lum=h=>{ const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16); return 0.3*r+0.59*g+0.11*b; };
  SPR.REMAP.ink2=PALh.map(h=>{ const L=lum(h); return L<70?16:(L<150?17:19); });
  SPR.REMAP.ink2red=PALh.map((h,i)=>[7,8,9].includes(i)?i:(lum(h)<70?16:(lum(h)<150?17:19))); }
const vtext=(c,str,wx,wy,col,sc)=>{ const m=c.getTransform(); c.save(); c.setTransform(1,0,0,1,0,0); [...str].forEach((ch,k)=>PX.text(c,ch,Math.round((m.a*wx+m.e)),Math.round((m.d*wy+m.f))+k*13*(sc||1),{color:col,align:'center',scale:sc||1})); c.restore(); };
const inkLandscape=(c,x0,y0,w,h,o={})=>{ const GYs=y0+h-80;
  // far range, mid range (sepia/grey washes, no dither), a mist band, the brush ground line
  const rng=(base,amp,f,ph,col)=>{ const pts=[[x0,GYs]]; for(let x=x0;x<=x0+w;x+=20) pts.push([x,g5(base-amp*Math.abs(Math.sin((x-x0)*f+ph))*(0.6+0.4*Math.sin((x-x0)*f*3.1+ph)))]); pts.push([x0+w,GYs]); poly(c,pts,col); };
  rng(y0+h*0.62,h*0.36,0.0042,0.4,'#E2D3B8'); rng(y0+h*0.74,h*0.24,0.0061,1.7,'#B9B6AC'); rect(c,x0,g5(y0+h*0.70),w,25,'#F2E8D5'); rng(y0+h*0.86,h*0.12,0.009,2.6,'#E2D3B8');
  for(let x=x0+20;x<x0+w-20;x+=10){ const yy=g5(GYs+Math.sin(x*0.02)*5); rect(c,x,yy,10,5,'#7A4B34'); if((x/10)%7<2) rect(c,x,yy+5,10,5,'#7A4B34'); }
  // pine bough from the upper-left corner
  { const bx=x0+40, by=y0+60; for(let k=0;k<26;k++){ const u=k/26; rect(c,g5(bx+u*420),g5(by+Math.sin(u*3)*40+u*60),15,10,'#4A2A1C'); }
    for(const [u,dy] of [[0.25,-20],[0.45,25],[0.62,-15],[0.8,20],[0.95,-5]]){ const cx=bx+u*420, cy=by+Math.sin(u*3)*40+u*60+dy; for(let q=-5;q<=5;q++) rect(c,g5(cx+q*12),g5(cy-Math.abs(q)*4),10,5,'#7E7C76'); for(let q=-3;q<=3;q++) rect(c,g5(cx+q*10),g5(cy-10-Math.abs(q)*3),10,5,'#43475A'); } }
  // calligraphy column + seal at the right end of the painting
  if(o.text){ const tx=o.textX||(x0+w-90); vtext(c,o.text,tx,y0+50,'#4A2A1C',2); const sy=y0+50+o.text.length*130+20; rect(c,g5(tx-35),g5(sy),70,70,'#A82A26'); rect(c,g5(tx-30),g5(sy+5),60,60,'#D8402F'); vtext(c,'忍',tx,sy+5,'#F2E8D5',1); } };
const scrollMount=(c,x0,y0,w,h)=>{ rect(c,x0-60,y0-50,w+120,h+100,'#4A2A1C'); rect(c,x0-50,y0-40,w+100,h+80,'#6E1A1E'); for(let x=x0-40;x<x0+w+40;x+=40){ rect(c,x,y0-30,10,10,'#D9A441'); rect(c,x+20,y0+h+20,10,10,'#D9A441'); }
  rect(c,x0-50,y0-5,w+100,5,'#D9A441'); rect(c,x0-50,y0+h,w+100,5,'#D9A441'); rect(c,x0,y0,w,h,'#F2E8D5');
  for(const rx of [x0-80,x0+w+50]){ rect(c,rx,y0-70,30,h+140,'#33201A'); rect(c,rx+5,y0-70,10,h+140,'#5E3A26'); rect(c,rx-5,y0-90,40,20,'#D9A441'); rect(c,rx-5,y0+h+70,40,20,'#D9A441'); } };
F.scroll2=(c,t,o)=>{ const lt=t-o.t0; const x0=170, y0=170, w=1580, h=680; const pan=g5(lt*30); const GYs=y0+h-80;
  rect(c,0,0,W,H,'#1C2238');
  const draw=()=>{ c.save(); c.beginPath(); c.rect(x0,y0,w,h); c.clip(); c.translate(-pan,0); inkLandscape(c,x0,y0,w+200,h,{text:o.mode==='oath'?'忍之誓':'斬断過去',textX:x0+w-70});
    if(o.mode==='oath'){ J(c,'seiza',0,560,GYs,1,'ink2','L'); const q=seq([['bow',0,10],['bow',1,4],['bow',2,40],['bow',1,4],['bow',0,80]],t,o.t0+0.4);
      J(c,q[0],q[1],1040,GYs,-1,'ink2red'); J(c,q[0],q[1],1280,GYs,-1,'ink2red'); F.fxW(c,'bell',0,810,GYs-30,1,'ink'); }
    else { const s1=SPR.frameAt('M','slash',t,o.t0+0.3+Math.floor(Math.max(0,lt-0.3)/1.5)*1.5), s2=SPR.frameAt('M','slash',t,o.t0+0.45+Math.floor(Math.max(0,lt-0.45)/1.5)*1.5);
      J(c,'slash',lt<0.3?0:s1,760,GYs,1,'ink2red'); if(t<o.turn) J(c,'slash',lt<0.45?0:s2,1240,GYs,-1,'ink2red'); else J(c,'slash',s2,1240,GYs,-1,'sil','K'); }
    c.restore(); };
  if(o.cut&&t>=o.cut){ const u=eo(inv(o.cut,o.cut+0.5,t)); const diag=(sd)=>{ c.beginPath(); if(sd<0){ c.moveTo(0,0); c.lineTo(1100,0); c.lineTo(820,H); c.lineTo(0,H); } else { c.moveTo(1100,0); c.lineTo(W,0); c.lineTo(W,H); c.lineTo(820,H); } c.closePath(); };
    for(const sd of [-1,1]){ c.save(); diag(sd); c.clip(); c.translate(g5(sd*u*40),g5(sd*u*30)); scrollMount(c,x0,y0,w,h); draw(); c.restore(); }
    if(t<o.cut+0.1) poly(c,[[1095,0],[1110,0],[825,H],[810,H]],'#FFF8EC'); }
  else { scrollMount(c,x0,y0,w,h); draw(); }
  if(o.burn&&t>=o.burn){ const u=inv(o.burn,o.burn+1.6,t); const fx=g5(lerp(x0+w+60,x0+w*0.55,u)); const r=mulberry(Math.floor(t*12));
    rect(c,fx,y0-100,x0+w-fx+200,h+200,'#1C2238'); for(let y=y0-40;y<y0+h+40;y+=10){ const j=g5(r()*40); rect(c,fx-j-10,y,j+10,10,'#2A1E1A'); rect(c,fx-j-20,y,10,10,'#D8402F'); rect(c,fx-j-30,y,10,10,r()<0.5?'#D9A441':'#F07850'); if(r()<0.3) rect(c,fx+g5(r()*120),y-g5(r()*80),5,5,'#D9A441'); }
    F.light(c,fx,y0+h/2,500,'#F07850',0.5,{add:true}); }
  F.amb([1,0.97,0.92]); };
// S17 55.10–59.62 uses the new scroll
shot7('S17',55.10,59.62,(c,t)=>F.scroll2(c,t,{t0:55.10,mode:'oath',cut:57.934}),F.SHOTS.find(s=>s.id==='S17').tr);
// ======================= v7 item 1 + 6 — S36: even tatami (no checker), the alcove scroll is the same painting in miniature (never blank),
//   the hooded leader holds still in profile (no walk-in-place against the one-point room); red mood via ambient, not a checker overlay =======================
{ let src=E6.tatami.toString(); const rep=(a,b)=>{ if(!src.includes(a)) throw new Error('tatami7 miss '+a.slice(0,50)); src=src.replace(a,b); };
  rep("(i+Math.floor((Z+1)/1.8))%2?'#C8D4A0':'#A8B488'","'#C8D4A0'");
  rep("Q(c,K,[[X0,0,za],[X1,0,za],[X1,0,za+0.03],[X0,0,za+0.03]],'#5A5F73');","Q(c,K,[[X0,0,za],[X1,0,za],[X1,0,za+0.02],[X0,0,za+0.02]],'#A8B488');");
  E6.tatami7=eval('('+src+')'); }
const miniScroll=(c,t,r)=>{ const [x,y,w,h]=r; rect(c,x-10,y-10,w+20,h+20,'#6E1A1E'); rect(c,x,y,w,h,'#F2E8D5');
  const pts=[[x,y+h]]; for(let k=0;k<=12;k++){ pts.push([x+w*k/12,g5(y+h*(0.55-0.3*Math.abs(Math.sin(k*0.9+0.4))))]); } pts.push([x+w,y+h]); poly(c,pts,'#E2D3B8');
  const p2=[[x,y+h]]; for(let k=0;k<=12;k++){ p2.push([x+w*k/12,g5(y+h*(0.75-0.16*Math.abs(Math.sin(k*1.4+1.2))))]); } p2.push([x+w,y+h]); poly(c,p2,'#B9B6AC');
  rect(c,x+5,g5(y+h*0.84),w-10,5,'#7A4B34'); for(const fx of [0.32,0.55]){ rect(c,g5(x+w*fx),g5(y+h*0.62),5,g5(h*0.22),'#4A2A1C'); rect(c,g5(x+w*fx)-5,g5(y+h*0.66),10,5,'#D8402F'); }
  for(let k=0;k<4;k++) rect(c,g5(x+w*0.86),g5(y+h*(0.12+k*0.13)),10,5,'#4A2A1C'); rect(c,g5(x+w*0.86)-5,g5(y+h*0.7),15,15,'#D8402F'); };
{ const old=F.SHOTS.find(s=>s.id==='S36'); const tr=old.tr; const KTT=E6.camFor('L',935,{camH:1.25,vx:960}), KTX=E6.camFor('XL',935,{camH:1.35,vx:960});
  const tokoFrame=(c,t)=>{ rect(c,0,0,170,H,'#33201A'); rect(c,150,0,20,H,'#4A2A1C'); rect(c,0,0,W,95,'#2A1E1A'); rect(c,0,80,W,15,'#4A2A1C'); rect(c,1770,0,150,H,'#E2D3B8'); rect(c,1760,0,15,H,'#33201A');
    rect(c,0,985,W,95,'#5E3A26'); rect(c,0,985,W,10,'#93603C'); F.light(c,1700,700,600,'#FFC870',0.35*(0.9+0.1*Math.sin(t*20))); };
  const KX=S('KXL');
  shot7('S36',127.55,132.08,(c,t)=>{
    if(t<128.6){ E6.tatami7(c,t,KTT,{scroll:miniScroll}); return; }
    if(t<129.823){ F.scroll2(c,t,{t0:127.55,mode:'twist',turn:999}); tokoFrame(c,t); return; }
    if(t<131.0){ E6.tatami7(c,t,KTX,{scroll:miniScroll}); const torn=t>=130.0; sh(c,1060,935,120);
      J(c,torn?'reveal':'hood',torn?(t<130.4?0:1):0,1060,935,-1,null,'KXL'); bell(c,1060-27*5,935-87*5,t); if(t>=130.0&&t<130.0+2/30) rect(c,0,0,W,H,'#F2E8D5'); F.amb([1.0,0.7,0.7]); return; }
    if(t<131.5){ F.scroll2(c,t,{t0:127.55,mode:'twist',turn:129.823,burn:130.6}); tokoFrame(c,t); return; }
    E6.tatami7(c,t,KTT,{burn:131.0,scroll:(c,t,r)=>{ rect(c,r[0],r[1],r[2],r[3],'#2A1E1A'); }}); },tr); }

// ======================= O3 / O6 (and every izakaya view): the menu tags carry real, correctly oriented characters on a wooden board.
//   Text is placed through the current transform but drawn upright, so the mirrored reverse angle (O6) still reads left-to-right. =======================
{ const iz=E4.izakaya3; const MENU=['酒','焼鳥','茶漬','豆腐','鰻','稲荷'];
  const board=(c)=>{ rect(c,1395,100,590,230,'#33201A'); rect(c,1395,100,590,10,'#5E3A26'); rect(c,1395,320,590,10,'#2A1E1A');
    MENU.forEach((m,k)=>{ const x=1420+k*92, h=40+m.length*65; rect(c,x,125,80,h,'#F2E8D5'); rect(c,x+70,125,10,h,'#E2D3B8'); rect(c,x,125,80,10,'#B9B6AC'); vtext(c,m,x+38,150,'#0E1020',1); }); };
  E4.izakaya3=(c,t,o={})=>iz(c,t,Object.assign({},o,{behind:(cc,...a)=>{ board(cc); if(o.behind) o.behind(cc,...a); }})); }

// ======================= v7 item 2 — bamboo duel ground: a lit moss floor that reads as ground right up to the fighters' feet
//   (no dark-blue dither band at the horizon, no fog band across the feet line), denser litter, so the XL fighters stand ON something =======================
{ let src=E6.grove.toString(); const rep=(a,b)=>{ if(!src.includes(a)) throw new Error('grove7 miss '+a.slice(0,50)); src=src.replace(a,b); };
  rep("rect(c,0,g5(K.h),W,H,'#16261E'); E.dither(c,0,g5(K.h),W,g5((H-K.h)*0.35),'#1C2238',f=>0.6-f*0.6);",
      "rect(c,0,g5(K.h),W,H,'#22382A'); rect(c,0,g5(K.h),W,g5((H-K.h)*0.12),'#1C262B'); rect(c,0,g5(K.h+(H-K.h)*0.12),W,g5((H-K.h)*0.18),'#16261E');");
  rep("for(let k=0;k<160;k++)","for(let k=0;k<280;k++)");
  rep("[[K.h-20,12,'#2E3756',0.35],[K.h+30,-8,'#253052',0.3]]","[[K.h-60,12,'#2E3756',0.3]]");
  E6.grove=eval('('+src+')'); }

// ======================= v7 item 7 — S38 136.57–145.64: the silhouette passage (141.12–143.4) — moon fully clear of the ridge, a moonlit
//   tiled slope instead of a black void, and the clones multiply with poofs into readable poses (no flattened mid-air tuck frames) =======================
{ const old=F.SHOTS.find(s=>s.id==='S38'); const fn=old.fn, tr=old.tr; const LT=141.12; const FM=800; const KRSM=E6.camFor('M',800,{camH:0.15}); const ZM=E6.zOf(KRSM,'M');
  shot7('S38',136.57,145.64,(c,t)=>{ if(t<LT||t>=143.4) return fn(c,t);
    const fl1=t>=LT&&t<LT+1/30; E6.keepRoof(c,t,KRSM,{Zr:ZM,wx:'clear',sil:true,moon:{x:960,y:380,r:240},tiers:false,top:fl1?'#4A5378':undefined,mid:fl1?'#5A6A9A':undefined});
    if(t>=LT&&t<LT+2/30) E6.bolt(c,1500,0,g5(KRSM.h-40),11);
    { const r=mulberry(7); for(let k=0;k<4;k++){ const x=((r()*2400-t*90*(1+k%2))%2400+2400)%2400-240, y=60+r()*140; ell(c,g5(x),g5(y),g5(220+r()*160),g5(18+r()*20),0,'#141A30'); } }
    sh(c,960,FM,40,'#0E1020'); Ks(c,'hold',t,LT,960,FM,1,'sil'); bell(c,1020,FM-170,t);
    const xs=[200,400,600,780,1140,1320,1520,1720]; const POSE=[['seal',null],['slash',5],['crouch',1],['throw',0],['throw',0],['crouch',1],['slash',5],['seal',null]];
    xs.forEach((x,k)=>{ const t0=LT+0.1+k*0.14; if(t>=t0+0.08){ const [an,fix]=POSE[k]; const f=x<960?1:-1; sh(c,x,FM,40,'#0E1020'); J(c,an,fix==null?SPR.frameAt('M',an,t,t0):fix,x,FM,f,'sil'); } poof(c,x,FM-110,t,t0); });
    F.petals(c,t,91,80,{wind:300}); },tr); }

})(window);
