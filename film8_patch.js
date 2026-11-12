// film8_patch.js — v8: answers the independent v7 playback review (claims verified at full res; confirmed ones fixed) + own v7 residuals.
(function(G){
const {P,mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,blob,capsule,rrect}=G.K; const E=G.E, E4=G.E4, E5=G.E5, E6=G.E6, E7=G.E7, F=G.FILM, SPR=G.SPR, D=G.DATA, PX=G.PX; const {g5,J,Ja,seq,fxW,poof,bell}=F; const pj=E6.pj, Q=E6.Q; const W=1920,H=1080; const C=E4.C;
F.NEW8=[]; const shot8=(id,t0,t1,fn,tr)=>{ F.NEW8.push(id); F.SHOTS=F.SHOTS.filter(s=>s.id!==id); F.shot(id,t0,t1,fn,tr); };
const S=(set)=>(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,set); const Hs=S('H'), Ls=S('L'), Ms=S('M'), Ks=S('K'), KL=S('KL'), XL=S('XL'), XLs=XL, Ds=S('D'), DX=S('DX');
const sh=(c,x,y,w,col)=>E6.shadow(c,x,y,w,col);
const fl=(t)=>0.92+0.08*Math.sin(t*19)*Math.sin(t*5.3);
const ED=G.SPR8EDIT, SD=SPR.data.sets;
const getShot=id=>F.SHOTS.find(s=>s.id===id);
// flat (undithered) light pool, applied by film_main8 before fxApply
F.lightFlat=(c,x,y,r,col,k,o={})=>{ const m=c.getTransform(); const X=F.FX; (X.flat||(X.flat=[])).push({x:m.a*x+m.c*y+m.e,y:m.b*x+m.d*y+m.f,r:r*m.a,ry:o.ry||1,col:F.hex(col),k,steps:o.steps||3}); };

// ======================= sprite data (native pixels; rows moved/repeated, never scaled) =======================
// (a) H 'kneel_tall': hips raised off the heels, thighs vertical — the in-between of standing -> seiza (same character size tier as idle/seiza)
SD.H.kneel_tall={w:160,h:120,ox:80,oy:112,dur:[30],loop:false,note:'v8 in-between',frames:[ED.tallKneel(SD.H.seiza.frames[0],98,12)]};
// (b) duel guards: the 2-frame breathing toggle becomes a 4-step cycle (each key + a 1-px settle in-between of the upper body; feet planted)
for(const set of ['D','DX']) for(const an of ['j_guard','r_guard']){ const a=SD[set][an]; const t0=ED.top(a.frames[0]); const hip=a.oy-Math.round(0.45*(a.oy-t0));
  const f=a.frames.slice(0,2); a.frames=[f[0],ED.bob(f[0],hip,1),f[1],ED.bob(f[1],hip,1)]; a.dur=[8,6,8,6]; }

// ======================= CLAIM 1 — home tatami room (S11–S14, S30–S33) =======================
// World scale was already consistent (Jay 91 px = 1.69 m at the L depth, ceiling 2.45 m), but the low 1.2 m camera with the back wall 2.2 m
// behind him put his head 60 px under the ceiling line. Reframed: ceiling 2.4 m, eye height 1.45 m, back wall 1.6 m behind him (ZB 4.6).
E6.HOME.YC=2.4; E6.HOME.ZB=4.6;
E6.camHome=(pan,size,footY)=>E6.camFor(size||'L',footY||940,{vx:960-(pan||0),camH:1.45});
{ const FY=940; const jxOf=K=>g5(K.vx+E6.HOME.JX*270); const room=(c,t,pan,o)=>{ const K=E6.camHome(pan); E6.home(c,t,K,o); return K; };
  const shH=(c,x,w)=>E6.shadow(c,x,FY,w,'#2F4A3A'); const WARM=[0.98,0.9,0.82];
  // kneel-down: bow (3 f) -> tall kneel (4 f) -> seated anim
  const kneel=(c,t,t0,jx,anim)=>{ const f=Math.floor((t-t0)*30+1e-4); if(f<3) J(c,'bow',2,jx,FY,1,null,'H'); else if(f<7) J(c,'kneel_tall',0,jx,FY,1,null,'H'); else Hs(c,anim,t,t0+7/30,jx,FY,1); };
  shot8('S13',41.56,44.03,(c,t)=>{ const K=room(c,t,lerp(80,120,eio(inv(41.56,44.03,t))),{}); const jx=jxOf(K); shH(c,jx,90); kneel(c,t,41.56,jx,'seiza_snip'); const [vx,vy,k]=E6.homeTable(c,t,K,{rip:42.9});
    const u=inv(42.75,43.5,t); if(u>0&&u<1){ const px=vx+90*k+Math.sin(u*9)*12, py=lerp(vy-104*k,vy-4,ei(u)); ell(c,g5(px),g5(py),10,6,0,'#D8402F'); rect(c,g5(px)-5,g5(py)-5,5,5,'#F07850'); } F.amb(WARM); },{k:'cut'});
  shot8('S31',111.66,113.98,(c,t)=>{ const tc=113.03; const K=room(c,t,100,{snow:true,bamboo:true}); const jx=jxOf(K); shH(c,jx,90); kneel(c,t,111.66,jx,'seiza_snip');
    const [vx,vy,k]=E6.homeTable(c,t,K,{bamboo:true,cut:t>=tc});
    if(t>=tc){ const bx=vx+30*k; rect(c,g5(bx-14*k),g5(vy-90*k),g5(28*k),g5(90*k),'#46613F'); rect(c,g5(bx),g5(vy-90*k),Math.max(5,g5(8*k)),g5(90*k),'#7C9A6E'); E5.fallingBamboo(c,t,tc,bx,vy-200*k); if(t<tc+0.1){ c.save(); c.translate(bx,vy-110*k); c.rotate(-0.3); rect(c,-300,-3,600,6,'#FFF8EC'); c.restore(); } }
    F.amb(WARM); },getShot('S31').tr);
  // S32 continues the same kneeling pose: a dissolve between two pans of the same pose read as a double image -> straight cut
  getShot('S32').tr={k:'cut'};
  // CLAIM 4: the paper-flash cuts into the home room become a designed dither wipe (picture on every frame)
  getShot('S11').tr={k:'dwipe',d:0.5}; getShot('S30').tr={k:'dwipe',d:0.5};
}

// ======================= CLAIM 2 — zen zashiki (O7 16.33–17.18, S23 88.78–91.05): camera dollied 1.1 m into the room =======================
// (the seiza sprite only exists at the L tier, so the camera moves, not the sprite); he kneels on an ochre zabuton with a hard contact shadow.
{ const pjz=(K,X,Y,Z)=>{ const z=Math.max(0.3,Z-(K.dz||0)); const s=K.f/z; return [K.vx+X*s, K.h+(K.camH-Y)*s]; };
  const Qz=(c,K,pts,col)=>{ const dz=K.dz||0; if(pts.every(p=>p[2]-dz<=0.05)) return; poly(c,pts.map(p=>{ const [x,y]=pjz(K,p[0],p[1],p[2]); return [g5(x),g5(y)]; }),col); };
  const boxz=(c,K,x0,x1,y0,y1,z0,z1,cf,cs,ct)=>{ const zz=z0-(K.dz||0); if(x1*K.f/zz+K.vx<K.vx||x1<0) Qz(c,K,[[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],cs); if(x0>0) Qz(c,K,[[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1]],cs);
    if(y1<K.camH&&ct) Qz(c,K,[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],ct); if(y0>K.camH&&ct) Qz(c,K,[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]],ct); Qz(c,K,[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]],cf); };
  let src=E6.zen.toString(); src=src.replace(/\bpj\(/g,'pjz(').replace(/\bQ\(/g,'Qz(').replace(/E6\.box\(/g,'boxz(');
  const HW=3.6, ZB=6.3, YC=2.5; const zen8=eval('('+src+')'); E6.zen8=zen8;
  const KZ=E6.camFor('L',930,{vx:960,camH:1.15}); KZ.dz=1.1; const Zj=E6.zOf(KZ,'L'), JX=-0.5, JXZ=g5(960+JX*270), CU=0.08, JY=g5(930-CU*270);
  const cushion=(c)=>{ const P=(X,Y,Z)=>{ const [x,y]=pj(KZ,X,Y,Z); return [g5(x),g5(y)]; }; const x0=JX-0.34, x1=JX+0.34, z0=Zj-0.3, z1=Zj+0.36;
    // contact shadow on the mats (offset away from the andon on the right), then the cushion: top, front face, piping, corner tassels
    const [sx,sy]=P(JX-0.06,0,Zj+0.02); ell(c,sx,sy,g5(0.5*270),g5(0.16*270),0,'#46613F'); ell(c,sx+5,sy,g5(0.42*270),g5(0.12*270),0,'#24382A');
    poly(c,[P(x0,CU,z0),P(x1,CU,z0),P(x1,CU,z1),P(x0,CU,z1)],'#D9A441'); poly(c,[P(x0,0,z0),P(x1,0,z0),P(x1,CU,z0),P(x0,CU,z0)],'#8A5A1E');
    poly(c,[P(x0+0.03,CU,z0+0.02),P(x1-0.03,CU,z0+0.02),P(x1-0.03,CU,z0+0.05),P(x0+0.03,CU,z0+0.05)],'#F2D27A');
    for(const X of [x0,x1]){ const [tx,ty]=P(X,CU,z0); rect(c,tx-5,ty-5,10,10,'#A82A26'); }
    // body shadow pressed into the cushion top
    const [bx,by]=P(JX-0.02,CU,Zj+0.02); ell(c,bx,by,g5(0.28*270),g5(0.07*270),0,'#8A5A1E'); };
  const seiza=(c,t,tA,tB)=>{ const k=t<tA?0:(t<tB?1:2); cushion(c); J(c,'seiza',k,JXZ,JY,1,null,'H'); };
  const s23=getShot('S23'), s23fn=s23.fn; // film6 S23: garden part before 88.78, then the zen room
  shot8('S23',86.53,91.05,(c,t)=>{ if(t<88.78) return s23fn(c,t); zen8(c,t,KZ,{snow:true}); seiza(c,t,90.2,90.477); F.lightFlat(c,JXZ,JY-230,300,'#FFE7A8',0.1); },s23.tr);
  const o7=getShot('O7'); shot8('O7',16.33,17.18,(c,t)=>{ const gust=inv(16.75,17.0,t)*(1-inv(17.0,17.18,t)); zen8(c,t,KZ,{snow:false,gust}); seiza(c,t,99,99); },o7.tr); }

// ======================= CLAIM 3 — S36 127.55–132.08 tatami room =======================
// Verified FALSE for the pan: every S36 room view is a locked camera (KTT / KTX, constant vx) — frame-differenced 127.6–128.55; the only lateral
// motion in 128–130 is the painting inside the handscroll close-up. CONFIRMED "plain and empty": dressed (zabuton pair, hibachi with embers,
// sword stand + ikebana in the tokonoma, incense box on the shelves, a gold two-fold byobu). The 2 paper frames at 130.0 become a local light flash.
{ const t7=E6.tatami7; const ZB=8.6;
  const dress=(c,t,K,o)=>{ const P=(X,Y,Z)=>{ const [x,y]=pj(K,X,Y,Z); return [g5(x),g5(y)]; }; const burnt=o.burn!=null&&t>o.burn+0.6;
    { const pts=[[2.55,7.9],[2.2,7.3],[2.55,6.7]]; for(let k=0;k<2;k++){ const [xa,za]=pts[k], [xb,zb]=pts[k+1]; Q(c,K,[[xa,0,za],[xb,0,zb],[xb,1.5,zb],[xa,1.5,za]],k?'#D9A441':'#F2D27A');
        Q(c,K,[[xa,1.44,za],[xb,1.44,zb],[xb,1.5,zb],[xa,1.5,za]],'#4A2A1C'); Q(c,K,[[xa,0,za],[xb,0,zb],[xb,0.06,zb],[xa,0.06,za]],'#4A2A1C');
        Q(c,K,[[lerp(xa,xb,0.2),0.9,lerp(za,zb,0.2)],[lerp(xa,xb,0.8),1.15,lerp(za,zb,0.8)],[lerp(xa,xb,0.75),1.05,lerp(za,zb,0.75)],[lerp(xa,xb,0.25),0.82,lerp(za,zb,0.25)]],'#46613F'); } }
    { const Y=0.18, Z=ZB-0.25; const [ax,ay]=P(-2.3,Y,Z), [bx,by]=P(-1.5,Y,Z); rect(c,ax,ay-10,bx-ax,10,'#2A1E1A'); rect(c,ax+10,ay-60,10,50,'#2A1E1A'); rect(c,bx-20,ay-60,10,50,'#2A1E1A');
      rect(c,ax-10,ay-45,bx-ax+20,10,'#0E1020'); rect(c,ax-10,ay-65,bx-ax+20,10,'#0E1020'); rect(c,ax+30,ay-50,10,20,'#D9A441'); rect(c,ax+30,ay-70,10,20,'#D9A441');
      const [vx,vy]=P(0.15,Y,Z); rect(c,vx-15,vy-40,30,40,'#2B3A67'); rect(c,vx-15,vy-40,30,5,'#3E4E86'); poly(c,[[vx-5,vy-40],[vx,vy-40],[vx-40,vy-120],[vx-45,vy-115]],'#4A2A1C');
      blob(c,[[vx-70,vy-115],[vx-40,vy-135],[vx-10,vy-118],[vx-40,vy-105]],'#46613F'); circ(c,vx+10,vy-70,12,'#D8402F'); blob(c,[[vx+15,vy-60],[vx+35,vy-62],[vx+25,vy-50]],'#46613F'); }
    { const [x,y]=P(1.7,0.6,ZB-0.15); rect(c,x-25,y-25,50,25,'#6E1A1E'); rect(c,x-25,y-25,50,5,'#A82A26'); rect(c,x-5,y-15,10,5,'#D9A441'); }
    for(const X of [-0.95,0.95]){ E6.box(c,K,X-0.3,X+0.3,0,0.07,6.0,6.6,'#6E1A1E','#4A1E1E','#A82A26'); const [x,y]=P(X,0,6.0); ell(c,x,y+5,g5(0.32*K.f/6),10,0,'#43475A'); }
    { E6.box(c,K,1.25,1.65,0,0.32,4.6,5.0,'#5E3A26','#4A2A1C','#2A1E1A'); const [x,y]=P(1.45,0.32,4.8); if(!burnt){ rect(c,x-20,y-5,15,5,'#D8402F'); rect(c,x+5,y-5,10,5,'#F07850'); F.lightFlat(c,x,y,120,'#FF9A5A',0.25,{ry:0.6,steps:2}); } } };
  E6.tatami7=(c,t,K,o={})=>{ t7(c,t,K,o); if(o.dress!==false) dress(c,t,K,o); }; }
{ const s36=getShot('S36'); const tr=s36.tr; const KTT=E6.camFor('L',935,{camH:1.25,vx:960}), KTX=E6.camFor('XL',935,{camH:1.35,vx:960});
  const miniScroll=(c,t,r)=>{ const [x,y,w,h]=r; rect(c,x-10,y-10,w+20,h+20,'#6E1A1E'); rect(c,x,y,w,h,'#F2E8D5');
    const pts=[[x,y+h]]; for(let k=0;k<=12;k++){ pts.push([x+w*k/12,g5(y+h*(0.55-0.3*Math.abs(Math.sin(k*0.9+0.4))))]); } pts.push([x+w,y+h]); poly(c,pts,'#E2D3B8');
    const p2=[[x,y+h]]; for(let k=0;k<=12;k++){ p2.push([x+w*k/12,g5(y+h*(0.75-0.16*Math.abs(Math.sin(k*1.4+1.2))))]); } p2.push([x+w,y+h]); poly(c,p2,'#B9B6AC');
    rect(c,x+5,g5(y+h*0.84),w-10,5,'#7A4B34'); for(const fx of [0.32,0.55]){ rect(c,g5(x+w*fx),g5(y+h*0.62),5,g5(h*0.22),'#4A2A1C'); rect(c,g5(x+w*fx)-5,g5(y+h*0.66),10,5,'#D8402F'); }
    for(let k=0;k<4;k++) rect(c,g5(x+w*0.86),g5(y+h*(0.12+k*0.13)),10,5,'#4A2A1C'); rect(c,g5(x+w*0.86)-5,g5(y+h*0.7),15,15,'#D8402F'); };
  const tokoFrame=(c,t)=>{ rect(c,0,0,170,H,'#33201A'); rect(c,150,0,20,H,'#4A2A1C'); rect(c,0,0,W,95,'#2A1E1A'); rect(c,0,80,W,15,'#4A2A1C'); rect(c,1770,0,150,H,'#E2D3B8'); rect(c,1760,0,15,H,'#33201A');
    rect(c,0,985,W,95,'#5E3A26'); rect(c,0,985,W,10,'#93603C'); F.light(c,1700,700,600,'#FFC870',0.35*(0.9+0.1*Math.sin(t*20))); };
  F.FLASHES.push({t:130.0,d:2/30,k:0.45});
  shot8('S36',127.55,132.08,(c,t)=>{
    if(t<128.6){ E6.tatami7(c,t,KTT,{scroll:miniScroll}); return; }
    if(t<129.823){ F.scroll2(c,t,{t0:127.55,mode:'twist',turn:999}); tokoFrame(c,t); return; }
    if(t<131.0){ E6.tatami7(c,t,KTX,{scroll:miniScroll}); const torn=t>=130.0; sh(c,1060,935,120);
      J(c,torn?'reveal':'hood',torn?(t<130.4?0:1):0,1060,935,-1,null,'KXL'); bell(c,1060-27*5,935-87*5,t); F.amb([1.0,0.7,0.7]); return; }
    if(t<131.5){ F.scroll2(c,t,{t0:127.55,mode:'twist',turn:129.823,burn:130.6}); tokoFrame(c,t); return; }
    E6.tatami7(c,t,KTT,{burn:131.0,scroll:(c,t,r)=>{ rect(c,r[0],r[1],r[2],r[3],'#2A1E1A'); }}); },tr); }

// ======================= CLAIM 5 — attic (S35 123.00–127.55): flat planes, no dither =======================
// Confirmed: the candle / vent pools used Bayer-edged bands (a dotted halo ring around the fighters) and the moon patch on the floor was a 50% checker.
// Now: flat stepped light pools (low, floor-hugging ellipses), the moonbeam wedge stays a solid plane, its floor patch is two solid tones.
{ let src=E6.attic.toString(); const rep=(a,b)=>{ if(!src.includes(a)) throw new Error('attic8 miss '+a.slice(0,60)); src=src.split(a).join(b); };
  rep("F.light(c,(x0+x1)/2,(y0+y1)/2,260,'#C8D4F0',0.4);","F.lightFlat(c,(x0+x1)/2,(y1+20),200,'#C8D4F0',0.22,{ry:0.5,steps:2});");
  rep("F.light(c,x,y-70,420,'#FFC870',0.55*fl(t));","F.lightFlat(c,x,y-20,300,'#FFC870',0.4*fl(t),{ry:0.45,steps:3}); F.lightFlat(c,x,y-75,70,'#FFE7A8',0.35,{steps:2});");
  rep("E6.Q(c,K,pts.map(p=>[p[0]-cam,p[1],p[2]]),'#33201A'); c.restore(); E.dither(c,...(()=>{ const [x0,y0]=pj(K,0.2-cam,0,5.5), [x1,y1]=pj(K,1.6-cam,0,5.0); return [g5(x0),g5(y0-10),g5(x1-x0),40]; })(),'#8C9CC8',0.5);",
      "c.restore(); E6.Q(c,K,[[-0.55-cam,1.75,ZB],[0.55-cam,1.75,ZB],[1.6-cam,0,5.9],[0.0-cam,0,4.7]],'#3E4E86'); E6.Q(c,K,[[0.0-cam,0,4.7],[0.9-cam,0,4.7],[1.6-cam,0,5.9],[0.5-cam,0,5.9]],'#43475A'); for(let X=-0.05;X<1.9;X+=0.35) E6.Q(c,K,[[X-cam,0,4.6],[X+0.03-cam,0,4.6],[X+0.03-cam+(X+0.03)*0,0,6.0],[X-cam,0,6.0]],'#2E3756');");
  E6.attic=eval('('+src+')'); }

// ======================= CLAIM 7 — S20 73–80: the jumping pair on parabolic arcs (75.90–77.20) =======================
// Confirmed: both rose on sin(u·π/2)·180 from the first frame (no crouch), and drifted down on the same sine (floaty), no landing.
// Now: 6-frame anticipation crouch, ballistic y = apex − g/2·(t−t_apex)² (0.45 s rise to a 170 px apex), a 2-frame hang on the clash,
// the matching fall, landing squash ('land' 0→1) with dust; jump frames follow the vertical velocity.
{ const s20=getShot('S20'); const fn=s20.fn, tr=s20.tr; const KWM=E6.camFor('M',860,{camH:0.25}); const fMd=860, tc=76.603, TA=76.15, HANG=2/30, HP=170, TR=tc-TA, G2=2*HP/(TR*TR), TL=tc+HANG+TR;
  const yAt=t=>{ if(t<=TA) return fMd; if(t<tc) return fMd-HP+0.5*G2*(tc-t)*(tc-t); if(t<tc+HANG) return fMd-HP; const u=t-tc-HANG; return Math.min(fMd,fMd-HP+0.5*G2*u*u); };
  const frameAt=t=>{ if(t<TA) return 0; if(t<TA+0.1) return 1; if(t<tc-0.15) return 2; if(t<tc-0.03) return 3; if(t<tc+HANG+0.05) return 4; if(t<TL-0.12) return 5; return 6; };
  const pose=(c,t,x,face,set)=>{ const y=g5(yAt(t)); const d=fMd-y; sh(c,x,fMd,g5(Math.max(10,35*(1-d/240))),'#0E1020');
    if(t>=TL){ const k=t<TL+3/30?0:1; J(c,'land',k,x,fMd,face,'sil',set); } else J(c,'jump',frameAt(t),x,y,face,'sil',set); };
  shot8('S20',72.90,81.39,(c,t)=>{ if(t<75.9||t>=77.2) return fn(c,t);
    E7.moonField(c,t,KWM,{moon:{x:960,y:380,r:250}});
    const air=t<TA?0:(t<tc?(t-TA)/TR:1), fall=t<tc+HANG?0:Math.min(1,(t-tc-HANG)/TR);
    const xL=t<tc+HANG?lerp(1220,1010,air):lerp(1010,1250,fall), xJ=t<tc+HANG?lerp(700,910,air):lerp(910,690,fall);
    pose(c,t,g5(xL),-1,'K'); pose(c,t,g5(xJ),1,undefined);
    if(t>=TL&&t<TL+0.4){ F.fxW(c,'dust',SPR.frameAt('FX','dust',t,TL),g5(xJ),fMd,1); F.fxW(c,'dust',SPR.frameAt('FX','dust',t,TL),g5(xL),fMd,-1); }
    if(t>=tc&&t<tc+0.1){ circ(c,960,g5(fMd-250),g5(70-(t-tc)*400),'#FFF8EC'); F.light(c,960,fMd-250,320,'#FFE7A8',0.6,{add:true}); }
    F.sparks(c,t,tc,960,fMd-250,7); if(t>=tc&&t<tc+0.45) F.fxW(c,'poof',SPR.frameAt('FX','poof',t,tc),960,g5(fMd-260),1);
    E7.moonFieldFG(c,t,KWM,{}); },tr); }

// ======================= CLAIM 8 — duel S19 64.16–72.90 =======================
// Confirmed in part: after the push-off cut (b9) both fighters looped the 2-frame step (4/4 ticks) for 0.85 s while standing still
// (stepping in place), and every guard hold was a 2-frame toggle. Now: steps only while the feet travel (one step = 8 ticks over the
// 0.25 s slide), then guard; guards are a 4-step cycle with 1-px settle in-betweens (sprite data above); clashes push the defender back
// 0.10–0.12 m (skid + dust) and he recovers with a step; feet stay on the same ground line fy, shadows follow x.
{ const BT=n=>64.157+n*0.5571; const HS=[BT(4),BT(5),BT(6),BT(11),BT(13)]; const hitstop=t=>{ for(const h of HS){ if(t>=h&&t<h+3/30) return h; } return t; };
  const KXL=E6.camFor('XL',1010), KLd=E6.camFor('L',950); const xlX=X=>g5(960+X*405); const lX=X=>g5(960+X*270);
  const bigText=(c,txt,wx,wy,scale,col,shadow)=>{ c.save(); c.setTransform(1,0,0,1,0,0); PX.text(c,txt,Math.round(wx/5),Math.round(wy/5),{scale,color:col,shadow,align:'center'}); c.restore(); };
  const s19=getShot('S19'); let src=s19.fn.toString(); const rep=(a,b)=>{ if(!src.includes(a)) throw new Error('S19 miss '+a.slice(0,60)); src=src.replace(a,b); };
  rep("if(t>=b(9)&&t<b(10)){ ra='r_step'; rt=b(9); }","if(t>=b(9)&&t<b(9)+0.27){ ra='r_step'; rt=b(9); } else if(t>=b(9)+0.27&&t<b(10)){ ra='r_guard'; rt=b(9)+0.27; }");
  rep("if(t>=b(9)&&t<b(11)-0.133){ ja='j_step'; jt=b(9); }","if(t>=b(9)&&t<b(9)+0.27){ ja='j_step'; jt=b(9); } else if(t>=b(9)+0.27&&t<b(11)-0.133){ ja='j_guard'; jt=b(9)+0.27; }");
  rep("E6.grove(c,t,KXL,{cam}); const fy=g5(KXL.h+KXL.camH*405);",
      "const rc=(ts,d)=>{ const u=t-ts; return u<0?0:(u<0.12?eo(u/0.12)*d:(u<0.42?d*(1-eio((u-0.12)/0.3)):0)); }; JXm-=rc(b(4),0.1)+rc(b(6),0.1); RXm+=rc(b(5),0.12);\n  E6.grove(c,t,KXL,{cam}); const fy=g5(KXL.h+KXL.camH*405);");
  rep("let ja='j_guard', jt=64.16;","if(t>=b(5)+0.12&&t<b(5)+0.39&&ra==='r_parry'){ ra='r_step'; rt=b(5)+0.12; }\n  let ja='j_guard', jt=64.16;");
  rep("const dead=t>=b(13)+0.2;","for(const ts of [b(4),b(6)]) if(t>=ts+0.12&&t<ts+0.39&&ja==='j_parry'){ ja='j_step'; jt=ts+0.12; }\n  const dead=t>=b(13)+0.2;");
  rep("if(t>=b(11)&&t<b(11)+0.6){","for(const [ts,who] of [[b(4),0],[b(5),1],[b(6),0]]) if(t>=ts&&t<ts+0.35) F.fxW(c,'dust',SPR.frameAt('FX','dust',t,ts),who?RX+60:JX-60,fy,who?-1:1);\n  if(t>=b(11)&&t<b(11)+0.6){");
  shot8('S19',64.16,72.90,eval('('+src+')'),s19.tr); }

// ======================= residual — duel teal cast: grove ambient was blue-cyan (0.74,0.80,1.04) over teal mid-depth stalks =======================
{ let src=E6.grove.toString(); const rep=(a,b)=>{ if(!src.includes(a)) throw new Error('grove8 miss '+a.slice(0,50)); src=src.split(a).join(b); };
  rep("F.amb([0.74,0.8,1.04]);","F.amb([0.84,0.84,0.94]);");
  rep("['#253A3F','#2C3D45','#1C262B']","['#22382A','#2F4A3A','#1C262B']");
  E6.grove=eval('('+src+')'); }

// ======================= residual — S34 (and every keep-roof view with a shachi): the roof now ENDS at the shachi =======================
{ let src=E6.keepRoof.toString(); const rep=(a,b)=>{ if(!src.includes(a)) throw new Error('keep8 miss '+a.slice(0,50)); src=src.replace(a,b); };
  rep("// the ridge (Y -0.35..0)","let _ce=null; if(o.shachi!=null&&o.rEnd!==false){ const Xe=o.shachi-cam+(o.shachi>0?0.3:-0.3); const zl0=Math.max(0.55,Zr-3.4); const [ax,ay]=pj(K,Xe,0,Zr-0.22), [bx,by]=pj(K,Xe,-3.2,zl0); const xt=ax+(bx-ax)*(-400-ay)/(by-ay), xb=ax+(bx-ax)*(H+400-ay)/(by-ay); c.save(); c.beginPath(); if(o.shachi>0){ c.moveTo(-50,-400); c.lineTo(xt,-400); c.lineTo(xb,H+400); c.lineTo(-50,H+400); } else { c.moveTo(W+50,-400); c.lineTo(xt,-400); c.lineTo(xb,H+400); c.lineTo(W+50,H+400); } c.closePath(); c.clip(); _ce={Xe,zl0}; }\n  // the ridge (Y -0.35..0)");
  rep("// shachihoko on the ridge end","if(_ce){ c.restore(); const {Xe,zl0}=_ce; const d=o.shachi>0?-1:1; Q(c,K,[[Xe+d*0.1,0.02,Zr-0.24],[Xe,0.02,Zr-0.24],[Xe,-3.2,zl0],[Xe+d*0.1,-3.2,zl0]],sil?'#141A30':'#1C2238'); }\n  // shachihoko on the ridge end");
  E6.keepRoof=eval('('+src+')'); }

// ======================= residual — S18 59.62–64.16: the old flat castleRoof replaced by the keep roof (same ridge/town as S16/S34) =======================
{ const s18=getShot('S18'); const fn=s18.fn; const K18=E6.camFor('L',700,{camH:1.0}); const Z18=E6.zOf(K18,'L');
  shot8('S18',59.62,64.16,(c,t)=>{ const cr=E.castleRoof; E.castleRoof=(cc,tt,camX,o)=>{ E6.keepRoof(cc,tt,K18,{Zr:Z18,wx:'storm',cam:camX/270,moon:{x:1450,y:200,r:120},tiers:false,shachi:-4.6}); };
    try{ fn(c,t); } finally { E.castleRoof=cr; } },s18.tr); }

// ======================= residual — S38 141.12–143.40: cloud bars -> cumulus banks (flat, two tones, lit tops) =======================
{ const s38=getShot('S38'); const fn=s38.fn, tr=s38.tr; const LT=141.12, FM=800; const KRSM=E6.camFor('M',800,{camH:0.15}); const ZM=E6.zOf(KRSM,'M');
  const cloud=(c,x,y,w,seed)=>{ const r=mulberry(seed); const n=5; const parts=[]; for(let k=0;k<n;k++){ const u=k/(n-1); parts.push([x-w/2+u*w+(r()-0.5)*40, y-(1-Math.abs(u-0.5)*2)*(30+r()*30), 60+r()*50]); }
    for(const [px,py,pr] of parts) ell(c,g5(px),g5(py+10),g5(pr*1.2),g5(pr*0.8),0,'#141A30');
    for(const [px,py,pr] of parts) ell(c,g5(px),g5(py-pr*0.25),g5(pr*0.9),g5(pr*0.35),0,'#253052'); };
  shot8('S38',136.57,145.64,(c,t)=>{ if(t<LT||t>=143.4) return fn(c,t);
    const fl1=t>=LT&&t<LT+1/30; E6.keepRoof(c,t,KRSM,{Zr:ZM,wx:'clear',sil:true,moon:{x:960,y:380,r:240},tiers:false,top:fl1?'#4A5378':undefined,mid:fl1?'#5A6A9A':undefined});
    if(t>=LT&&t<LT+2/30) E6.bolt(c,1500,0,g5(KRSM.h-40),11);
    for(const [x0,y,w,sp,sd] of [[200,150,520,-18,3],[1500,110,600,-12,5],[900,40,440,-8,9]]){ const x=((x0+t*sp)%2600+2600)%2600-340; cloud(c,x,y,w,sd); }
    sh(c,960,FM,40,'#0E1020'); Ks(c,'hold',t,LT,960,FM,1,'sil'); bell(c,1020,FM-170,t);
    const xs=[200,400,600,780,1140,1320,1520,1720]; const POSE=[['seal',null],['slash',5],['crouch',1],['throw',0],['throw',0],['crouch',1],['slash',5],['seal',null]];
    xs.forEach((x,k)=>{ const t0=LT+0.1+k*0.14; if(t>=t0+0.08){ const [an,fix]=POSE[k]; const f=x<960?1:-1; sh(c,x,FM,40,'#0E1020'); J(c,an,fix==null?SPR.frameAt('M',an,t,t0):fix,x,FM,f,'sil'); } poof(c,x,FM-110,t,t0); });
    F.petals(c,t,91,80,{wind:300}); },tr); }
})(window);
