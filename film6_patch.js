// film6_patch.js — v6: S23 b-part (88.78–91.05, 「有一种榛榛米的稻香叫做禅」) and its verse-1 twin O7 (16.33–17.18) become a
// zen tatami zashiki in one-point perspective: mats, ceiling beams, kamoi, tokonoma and the open shoji all share one vanishing
// point; Jay kneels in seiza ON the mats at the L depth with a contact shadow; incense smoke, andon pool, the garden beyond.
(function(G){
const {mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,blob,capsule}=G.K; const E=G.E, E4=G.E4, E5=G.E5, E6=G.E6, F=G.FILM, SPR=G.SPR; const {g5,J,Ja}=F; const pj=E6.pj, Q=E6.Q; const W=1920,H=1080; const C=E4.C;
const shot5=(id,t0,t1,fn,tr)=>{ F.NEW5.push(id); F.SHOTS=F.SHOTS.filter(s=>s.id!==id); F.shot(id,t0,t1,fn,tr); };
const fl=(t)=>0.92+0.08*Math.sin(t*19)*Math.sin(t*5.3);
// ---------------- the zashiki ----------------
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
    Q(c,K,[[X,0.9,3.2],[X,1.25,3.8],[X,1.15,4.2],[X,0.9,4.7]],'#B9B6AC'); Q(c,K,[[X,0.9,3.9],[X,1.15,4.5],[X,0.9,5.1]],'#7E7C76'); }
  // --- tatami (rice straw): rows 0.9 deep, mats 1.8 wide, staggered; weave lines; light catching the straw near the lamp/opening ---
  Q(c,K,[[-HW,0,0.4],[HW,0,0.4],[HW,0,ZB],[-HW,0,ZB]],'#A8C08A');
  for(let row=0;row<7;row++){ const Zb=ZB-row*0.9, Za=Zb-0.9; if(Zb<0.45) break; const za=Math.max(0.45,Za); const off=row%2?0.9:0;
    for(let X=-HW-off;X<HW;X+=1.8){ const xa=Math.max(-HW,X), xb=Math.min(HW,X+1.8); if(xb-xa<0.05) continue; const shade=(row+Math.round((X+off)/1.8))%2;
      Q(c,K,[[xa,0,za],[xb,0,za],[xb,0,Zb],[xa,0,Zb]],shade?'#A8C08A':'#BFB27A');
      for(let zz=za+0.06;zz<Zb;zz+=0.06) Q(c,K,[[xa+0.02,0,zz],[xb-0.02,0,zz],[xb-0.02,0,zz+0.015],[xa+0.02,0,zz+0.015]],shade?'#93AD78':'#A8A06C');
      Q(c,K,[[xa,0,za],[xb,0,za],[xb,0,za+0.045],[xa,0,za+0.045]],'#2F4A3A'); Q(c,K,[[xa,0,Zb-0.045],[xb,0,Zb-0.045],[xb,0,Zb],[xa,0,Zb]],'#2F4A3A');
      if(X+1.8<HW) Q(c,K,[[X+1.8-0.02,0,za],[X+1.8+0.02,0,za],[X+1.8+0.02,0,Zb],[X+1.8-0.02,0,Zb]],'#5A7A52'); } }
  { const r=mulberry(Math.floor(t*4)); for(let k=0;k<26;k++){ const X=(r()-0.5)*4.4, Z=1.6+r()*4.2; const [x,y]=pj(K,X,0,Z); rect(c,g5(x),g5(y),g5(Math.max(5,K.f/Z*0.15)),5,'#F2D27A'); } }
  // andon lamp (right, behind him) + incense burner in front of the alcove, smoke bending with the gust
  { const Z=4.0, X=1.9; const [x,y]=pj(K,X,0,Z); const s=K.f/Z; rect(c,g5(x-s*0.17),g5(y-s*0.72),g5(s*0.34),g5(s*0.62),C.w1); rect(c,g5(x-s*0.14),g5(y-s*0.69),g5(s*0.28),g5(s*0.52),'#FFE7A8'); rect(c,g5(x)-2,g5(y-s*0.69),5,g5(s*0.52),C.w3); rect(c,g5(x-s*0.2),g5(y-s*0.1),g5(s*0.4),g5(s*0.1),C.w0);
    F.light(c,x,y-s*0.4,s*4.0,'#FFC870',0.42*fl(t),{ry:0.6}); F.light(c,x,y-s*0.4,s*0.8,'#FFE7A8',0.25*fl(t)); F.cast(c,x,y-s*0.4,{a:0.3}); }
  { const [ix,iy]=pj(K,-1.4,0,3.3); const s=K.f/3.3; ell(c,g5(ix),g5(iy),g5(s*0.12),g5(s*0.04),0,'#43475A'); rect(c,g5(ix-s*0.1),g5(iy-s*0.1),g5(s*0.2),g5(s*0.1),'#7E7C76'); rect(c,g5(ix-s*0.11),g5(iy-s*0.11),g5(s*0.22),5,'#B9B6AC');
    for(let k=0;k<14;k++){ const ph=((t*0.3)+k/14)%1; if(ph>0.9) continue; const sx=ix+Math.sin(ph*8+k)*18*ph+gust*ph*260, sy=iy-s*0.12-ph*360; rect(c,g5(sx),g5(sy),5,15,'#B9B6AC'); if(ph>0.35) rect(c,g5(sx+12*Math.sin(ph*9)),g5(sy-20),5,10,'#B9B6AC'); } }
  F.amb(o.amb||(sn?[0.86,0.84,0.9]:[0.84,0.82,0.9]));
};
// ---------------- S23 b-part: he kneels on the mats, eyes closing (zen) — the shot the line 「榛榛米的稻香叫做禅」 lands on ----------------
const KZ=E6.camFor('L',930,{vx:960,camH:1.15}); const JXZ=g5(KZ.vx-0.45*270);
const seiza=(c,t,tA,tB,flip)=>{ const k=t<tA?0:(t<tB?1:2); E6.shadow(c,JXZ+5,930,95,'#5A7A52'); J(c,'seiza',k,JXZ,930,1,null,'H'); };
const S23a=F.SHOTS.find(s=>s.id==='S23').fn;
shot5('S23',86.53,91.05,(c,t)=>{ if(t<88.78) return S23a(c,t);
  E6.zen(c,t,KZ,{snow:true}); seiza(c,t,90.2,90.477); F.light(c,JXZ,700,380,'#FFE7A8',0.12); },{k:'dissolve',d:0.5});
// O7 16.33–17.18 (verse 1, same lyric): the same zashiki in the rain; the gust stirs the incense smoke
const O7tr=F.SHOTS.find(s=>s.id==='O7').tr;
shot5('O7',16.33,17.18,(c,t)=>{ const gust=inv(16.75,17.0,t)*(1-inv(17.0,17.18,t)); E6.zen(c,t,KZ,{snow:false,gust}); seiza(c,t,99,99); },O7tr);
})(window);
