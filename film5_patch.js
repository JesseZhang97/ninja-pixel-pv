// film5_patch.js — v5 (final): every set laid out in one real perspective (env6 projection); characters stand on the
// floor of their own depth with contact shadows; the bamboo duel rebuilt on a receding earth path with XL fighters;
// fresh layouts for the whole second half; samurai sprites; S01 title with the protagonist; wake/resolve shots fixed.
(function(G){
const {P,mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,capsule,blob}=G.K; const E=G.E, E4=G.E4, E5=G.E5, E6=G.E6, F=G.FILM, SPR=G.SPR, D=G.DATA, PX=G.PX; const W=1920,H=1080;
const {g5,J,Ja,poof}=F; const shot=F.shot; const C=E4.C; const pj=E6.pj, Q=E6.Q;
const NEW=[]; const shot5=(id,t0,t1,fn,tr)=>{ NEW.push(id); F.SHOTS=F.SHOTS.filter(s=>s.id!==id); shot(id,t0,t1,fn,tr); };
const S=(set)=>(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,set);
const Ls=S('L'), Hs=S('H'), Ds=S('D'), DX=S('DX'), Ms=S('M'), Ts=S('T'), XL=S('XL'), Ss=S('S'), KL=S('KL'), Ks=S('K');
const fl=(t)=>0.9+0.1*Math.sin(t*23)*Math.sin(t*7.3);
const WARM=[0.98,0.9,0.82];
const BAY=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
const sh=(c,x,y,w,col)=>E6.shadow(c,x,y,w,col);
const bigText=(c,txt,wx,wy,scale,col,shadow)=>{ c.save(); c.setTransform(1,0,0,1,0,0); PX.text(c,txt,Math.round(wx/5),Math.round(wy/5),{scale,color:col,shadow,align:'center'}); c.restore(); };

// ======================= S19 64.16–72.90 — bamboo duel, rebuilt: receding earth path, XL fighters on the ground =======================
const BT=n=>64.157+n*0.5571;
const HS=[BT(4),BT(5),BT(6),BT(11),BT(13)];
const hitstop=t=>{ for(const h of HS){ if(t>=h&&t<h+3/30) return h; } return t; };
F.SHAKES=F.SHAKES.filter(s=>!(s.t>64.1&&s.t<73)); F.FLASHES=F.FLASHES.filter(s=>!(s.t>64.1&&s.t<73));
F.SHAKES.push(...HS.map(t=>({t,d:0.2,a:3})),{t:BT(9),d:0.25,a:2},{t:64.47,d:0.18,a:2});
F.FLASHES.push(...HS.map(t=>({t,d:0.034,k:0.12})));
const KXL=E6.camFor('XL',1010), KLd=E6.camFor('L',950);
const xlX=X=>g5(960+X*405); const lX=X=>g5(960+X*270);
shot5('S19',64.16,72.90,(c,t0)=>{ const t=hitstop(t0); const b=BT; const cam=(t-64.16)*0.04;
  // ---- wide establishing (L): Jay drops in, lands on the path (dust), the ronin waits in guard ----
  if(t<65.27){ E6.grove(c,t,KLd,{cam}); const fy=g5(KLd.h+KLd.camH*270);
    const rx=lX(1.3), jx=lX(-1.3); sh(c,rx,fy,110); Ds(c,'r_guard',t,64.16,rx,fy,-1);
    const u=inv(64.16,64.47,t); if(u<1){ const y=g5(lerp(-150,fy,ei(u))); if(u>0.5) sh(c,jx,fy,g5(lerp(40,110,(u-0.5)*2))); Ls(c,'land',t,64.16,jx,y,1); }
    else { sh(c,jx,fy,110); if(t<64.75) J(c,'land',Math.min(2,Math.floor((t-64.47)*15)+1),jx,fy,1,null,'L'); else Ds(c,'j_guard',t,64.75,jx,fy,1); }
    if(t>=64.47&&t<64.97) F.fxW(c,'dust',SPR.frameAt('FX','dust',t,64.47),jx,fy,1);
    { const r=mulberry(5); const u2=t-64.47; if(u2>0&&u2<0.8) for(let k=0;k<10;k++){ const a=-0.3-r()*2.5, v=250+r()*300; rect(c,g5(jx+Math.cos(a)*v*u2),g5(fy+Math.sin(a)*v*u2+700*u2*u2),10,5,k%2?'#46613F':'#93603C'); } }
    E6.groveFG(c,t,KLd,cam); return; }
  // ---- eye inserts ----
  if(t<65.83){ const KE=E6.camFor('XL',1200,{camH:1.55}); E6.grove(c,t,KE,{cam:cam+(t<65.55?-0.6:0.6),seed:33});
    if(t<65.55) XL(c,'look',t,65.27,880,1200,1); else DX(c,'r_guard',t,64.16,1080,1180,-1);
    return; }
  if(t>=b(7)+0.39&&t<b(7)+0.72){ const KE=E6.camFor('XL',1200,{camH:1.55}); E6.grove(c,t,KE,{cam:cam-0.5,seed:33}); XL(c,'look',t,b(7),900,1200,1); return; }
  if(t>=b(7)+0.72&&t<b(9)){ // ECU: blades grinding against the out-of-focus grove
    const KE=E6.camFor('XL',2400,{camH:1.4}); E6.grove(c,t,KE,{cam:cam,seed:35}); E.dither(c,0,0,W,H,'#0E1020',0.5); const g=Math.sin(t*40)*10;
    c.save(); c.translate(960,540); c.rotate(-0.5); rect(c,-900,-25+g,1300,50,'#C8D4F0'); rect(c,-900,-25+g,1300,10,'#FFF8EC'); rect(c,-900,20+g,1300,5,'#5A6A9A'); rect(c,380,-40+g,40,80,'#D9A441'); c.restore();
    c.save(); c.translate(960,540); c.rotate(0.55); rect(c,-400,-25,1300,50,'#8C9CC8'); rect(c,-400,-25,1300,10,'#C8D4F0'); rect(c,-440,-40,40,80,'#7E7C76'); c.restore();
    for(let q=0;q<4;q++) F.sparks(c,t,b(7)+0.72+q*0.1,960,540,q+7);
    F.amb([0.55,0.6,0.98]); F.light(c,960,540,420,'#FFC870',0.6,{add:true}); return; }
  // ---- finish wide (L): Jay alone, sheathes; leaves settle ----
  if(t>=72.3){ E6.grove(c,t,KLd,{cam}); const fy=g5(KLd.h+KLd.camH*270); const jx=lX(0.2); sh(c,jx,fy,110); Ds(c,'j_finish',t,b(13)+0.6,jx,fy,1); E6.groveFG(c,t,KLd,cam); F.petals&&0; return; }
  // ---- two-shot (XL) ----
  let JXm=-1.1, RXm=1.1;
  if(t>b(3)){ const u=inv(b(3),b(4)-0.15,t); JXm=lerp(-1.1,-0.85,u); RXm=lerp(1.1,0.85,u); }
  if(t>b(7)-0.1){ const u=inv(b(7)-0.1,b(7),t); JXm=lerp(-0.85,-0.6,u); RXm=lerp(0.85,0.6,u); }
  if(t>b(9)){ const u=eo(inv(b(9),b(9)+0.25,t)); JXm=lerp(-0.6,-1.0,u); RXm=lerp(0.6,1.05,u); }
  if(t>b(11)-0.13){ const u=eo(inv(b(11)-0.13,b(11),t)); RXm=lerp(1.05,0.5,u); }
  if(t>b(13)-0.07){ const u=eo(inv(b(13)-0.07,b(13)+0.05,t)); JXm=lerp(-1.0,0.25,u); }
  E6.grove(c,t,KXL,{cam}); const fy=g5(KXL.h+KXL.camH*405);
  const JX=xlX(JXm), RX=xlX(RXm);
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
  let ja='j_guard', jt=64.16;
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
  // the cut stalk standing between them (rooted behind, at Z 2.6) until the push-off cut
  { const Zs=2.6, [bx,by]=pj(KXL,0.05,0,Zs); const s=KXL.f/Zs, w=g5(s*0.1); if(t<b(9)+0.02){ rect(c,g5(bx-w/2),-20,w,g5(by+20),'#3E5A4C'); rect(c,g5(bx),-20,10,g5(by+20),'#46613F'); for(let y=by-s*0.45;y>0;y-=s*0.5) rect(c,g5(bx-w/2-5),g5(y),w+10,10,'#2D4439'); sh(c,bx,by,w); }
    else { const cutY=g5(by-s*1.1); rect(c,g5(bx-w/2),cutY,w,g5(by-cutY),'#3E5A4C'); poly(c,[[g5(bx-w/2),cutY],[g5(bx+w/2),cutY-15],[g5(bx+w/2),cutY+5],[g5(bx-w/2),cutY+15]],'#C8D4A0'); E5.fallingBamboo(c,t,b(9)+0.02,bx,cutY-20); } }
  if(!dead){ sh(c,RX,fy,150); DX(c,ra,t,rt,RX,fy,-1); }
  sh(c,JX,fy,150); DX(c,ja,t,jt,JX,fy,1);
  // effects on the beats: spark at the blade contact, clang flash, hit-stop handled above
  const SPK=[[b(4),(JX+RX)/2,fy-600],[b(5),(JX+RX)/2+40,fy-560],[b(6),(JX+RX)/2,fy-420],[b(11),JX+140,fy-60],[b(13),RX-40,fy-430]];
  for(const [ts,x,y] of SPK){ F.sparks(c,t,ts,x,y,Math.round(ts*10)); if(t>=ts&&t<ts+0.07){ circ(c,g5(x),g5(y),45,'#FFF8EC'); F.light(c,x,y,260,'#FFE7A8',0.55,{add:true}); } }
  if(t>=b(11)&&t<b(11)+0.6){ F.fxW(c,'dust',SPR.frameAt('FX','dust',t,b(11)),JX+150,fy,1); }
  if(t>=b(9)&&t<b(9)+0.1){ c.save(); c.translate(xlX(0.05),g5(fy-450)); c.rotate(-0.9); rect(c,-300,-3,600,6,'#FFF8EC'); c.restore(); }
  if(t>=b(10)&&t<b(11)){ // perilous attack: red glint on his blade + a large 危
    const bl=Math.floor((t-b(10))*12)%2===0; if(bl){ const kx=RX+200, ky=fy-560; circ(c,kx,ky,30,'#D8402F'); rect(c,kx-90,ky-5,180,10,'#F07850'); rect(c,kx-5,ky-90,10,180,'#F07850'); }
    const pop=t<b(10)+0.08?6:5; F.light(c,RX,fy-820,360,'#D8402F',0.5,{add:true}); bigText(c,'危',RX,fy-900,pop,'#D8402F','#0E1020'); }
  if(t>=b(12)&&t<b(13)-0.07){ const kx=RX-20, ky=fy-470; const pr=Math.floor((t-b(12))*8)%2; F.ring(c,kx,ky,pr?110:100,1,'#D8402F',0.1); F.ring(c,kx,ky,104,1,'#D8402F',0.1); F.ring(c,kx,ky,55,1,'#F07850',0.1); circ(c,kx,ky,25,'#D8402F'); F.light(c,kx,ky,220,'#D8402F',0.45,{add:true}); }
  if(t>=b(13)&&t<b(13)+0.08){ c.save(); c.translate(960,g5(fy-450)); c.rotate(-0.12); rect(c,-900,-5,1800,10,'#FFF8EC'); c.restore(); }
  if(dead){ F.poof(c,RX,fy-300,t,b(13)+0.2); E5.smoke(c,t,RX,fy-260,6,'#4A5378'); }
  E6.groveFG(c,t,KXL,cam);
},{k:'dissolve',d:0.4});
F.NEW5=NEW;
})(window);
(function(G){
const {mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,blob}=G.K; const E=G.E, E4=G.E4, E5=G.E5, E6=G.E6, F=G.FILM, SPR=G.SPR; const {g5,J,Ja}=F; const pj=E6.pj, Q=E6.Q; const W=1920,H=1080;
const shot5=(id,t0,t1,fn,tr)=>{ F.NEW5.push(id); F.SHOTS=F.SHOTS.filter(s=>s.id!==id); F.shot(id,t0,t1,fn,tr); };
const JX=g5(900-0.95*405), FY=1180; const CY=()=>{ const [x,y]=pj(E6.KOC,0,0.8,1.8); return g5(y); };
// S23 b-part (88.78–91.05) and S42a (154.43–155.40): Jay seated across the counter (no more kneeling in mid-air)
const S23a=F.SHOTS.find(s=>s.id==='S23').fn;
shot5('S23',86.53,91.05,(c,t)=>{ if(t<88.78) return S23a(c,t);
  E6.overCounter(c,t,{}); E6.drawClip(c,'H','x_seat_resolve',SPR.frameAt('H','x_seat_resolve',t,88.9),JX,FY,1,null,CY()); E6.overCounterFG(c,t,{}); },{k:'dissolve',d:0.5});
shot5('S42a',154.43,155.40,(c,t)=>{ E6.overCounter(c,t,{}); E6.drawClip(c,'H','x_wake',t<154.5?0:(t<154.85?1:(t<155.1?2:3)),JX,FY,1,null,CY()); E6.overCounterFG(c,t,{steamH:340}); F.FX.amb=[0.98,0.9,0.82]; },{k:'cut'});
})(window);
// ======================= block 3: S21 lane, S22 counter, S23a garden, S24 torii (fresh v5 layouts) =======================
(function(G){
const {mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,blob}=G.K; const E=G.E, E4=G.E4, E5=G.E5, E6=G.E6, F=G.FILM, SPR=G.SPR; const {g5,J,Ja}=F; const pj=E6.pj, Q=E6.Q; const W=1920,H=1080;
const shot5=(id,t0,t1,fn,tr)=>{ F.NEW5.push(id); F.SHOTS=F.SHOTS.filter(s=>s.id!==id); F.shot(id,t0,t1,fn,tr); };
const S=(set)=>(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,set); const Hs=S('H'), Ls=S('L'), Ms=S('M'), Ts=S('T'), Ks=S('K');
const sh=(c,x,y,w)=>E6.shadow(c,x,y,w); const fl=(t)=>0.9+0.1*Math.sin(t*23)*Math.sin(t*7.3);
const footL=K=>g5(K.h+K.camH*270), footM=K=>g5(K.h+K.camH*135);
// S21 81.39–84.27: snowy lane in one-point perspective; Jay (modern, umbrella) crosses at L depth leaving footprints
shot5('S21',81.39,84.27,(c,t)=>{ const lt=t-81.39; const K=E6.KLANE; const fy=footL(K); E6.lane(c,t,{});
  const X=lerp(-1.9,0.35,lt/2.88), x=g5(K.vx+X*270);
  for(let q=0;q<14;q++){ const fx=x-60-q*40; if(fx<K.vx-1.95*270) break; rect(c,g5(fx),fy+(q%2?-5:5),15,5,'#8C9CC8'); }
  sh(c,x,fy,90); Hs(c,'walk_umb',t,81.39,x,fy,1);
  if(t>83.1&&t<83.2){ const KM=K; const rx=g5(K.vx+(2.2-(t-83.1)*8)*135), ry=g5(K.h+(K.camH-4.75)*135); Ms(c,'run',t,83.1,rx,ry,-1); F.light(c,rx,ry-60,120,'#C8D4F0',0.3); }
  E6.laneFG(c,t); },{k:'mosaic',d:0.6});
// S22 84.27–86.53: the counter runs into depth; Jay on the nearest stool eating, the master stirring across; bell on the shelf
const BELL=(c,K,t,glow)=>{ const Z=4.0, [x,y]=pj(K,-1.7,1.7,Z); const s=K.f/Z; Q(c,K,[[-1.79,1.45,3.4],[-1.79,1.45,4.6],[-1.55,1.45,4.6],[-1.55,1.45,3.4]],C2.w4);
  rect(c,g5(x)-2,g5(y-s*0.15),5,g5(s*0.1),'#43475A'); poly(c,[[g5(x-s*0.07),g5(y-s*0.05)],[g5(x+s*0.07),g5(y-s*0.05)],[g5(x+s*0.1),g5(y+s*0.17)],[g5(x-s*0.1),g5(y+s*0.17)]],glow?'#F2D27A':'#D9A441'); rect(c,g5(x-s*0.1),g5(y+s*0.15),g5(s*0.2),5,'#93603C');
  F.light(c,x,y,glow?220:90,'#FFE7A8',glow?0.7:0.25,{add:!!glow}); };
const C2=E4.C;
shot5('S22',84.27,86.53,(c,t)=>{ const K=E6.KCTR; const fy=footL(K); const flick=t>85.4&&t<85.47;
  E6.counterP(c,t,{behind:(c,K)=>{ const mx=g5(K.vx+1.65*270); Ts(c,'m_stir',t,0,mx,fy,-1); }});
  // near end cap of the counter (occludes the master's legs as the real volume would)
  Q(c,K,[[0.4,0,1.3],[1.25,0,1.3],[1.25,0.8,1.3],[0.4,0.8,1.3]],C2.w2);
  BELL(c,K,t,flick);
  const jx=g5(K.vx-0.05*270); sh(c,jx-10,fy,80); Hs(c,'chew',t,84.27,jx,fy,1);
  { const [bx,by]=pj(K,0.6,0.8,800/270); ell(c,g5(bx),g5(by+10),30,20,0,'#6E1A1E'); ell(c,g5(bx),g5(by),30,8,0,'#2A1E1A'); rect(c,g5(bx-30),g5(by-5),60,5,'#A82A26'); E4.steam(c,t,g5(bx),g5(by-10),3,{h:200}); }
  if(flick){ F.ring(c,...pj(K,-1.7,1.8,4.0),70,1,'#F2D27A',0.1); }
},{k:'cut'});
// S23a 86.53–88.78: snowy garden; the leader appears only in the pond's reflection (M depth = the pond's depth)
const S23b=F.SHOTS.find(s=>s.id==='S23').fn;
shot5('S23',86.53,91.05,(c,t)=>{ if(t>=88.78) return S23b(c,t); const lt=t-86.53;
  E6.snowGarden(c,t,{mirror:(c,K,pts,pc)=>{ const u=inv(0.3,2.0,lt); if(u<=0||u>=1) return;
    const [,ly]=pj(K,0,0,pc[1]+1.2); const X=lerp(3.2,-2.2,u)+pc[0]; const [mx]=pj(K,X,0,pc[1]+1.2);
    c.save(); c.beginPath(); pts.forEach((p,i)=>{ const [x,y]=pj(K,p[0],p[1],p[2]); i?c.lineTo(x,y):c.moveTo(x,y); }); c.closePath(); c.clip();
    F.mirrorSprite(c,'K','run',SPR.frameAt('K','run',t,86.53),g5(mx),g5(ly),-1,'leader',t,1.2,null); c.restore(); }});
  E.snow(c,t,123,110,{}); },{k:'dissolve',d:0.5});
// S24 91.05–93.18: side view through the torii tunnel; near pillars pass in front of him, far pillars behind
shot5('S24',91.05,93.18,(c,t)=>{ const lt=t-91.05; const K=E6.KTOR; const fy=footL(K); const cam=lt*1.05;
  E6.toriiSide(c,t,cam,{}); sh(c,900,fy,90); Ls(c,'walk',t,91.05,900,fy,1); E6.toriiNear(); E.snow(c,t,121,110,{});
  if(t>=92.206&&t<92.206+4/30){ rect(c,0,0,W,H,'#F2E8D5'); E.castle(c,t,960,900,1.3,{wall:'#4A2A1C',roof:'#4A2A1C',stone:'#4A2A1C'}); } },{k:'ripple',d:0.5,c:[0.45,0.55]});
})(window);
// ======================= block 4: trains (S08/S27 silent duotone, S09/S10/S28/S29 chase) and the castle gate (S26) =======================
(function(G){
const {mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,blob}=G.K; const E=G.E, E4=G.E4, E5=G.E5, E6=G.E6, F=G.FILM, SPR=G.SPR; const {g5,J,Ja,seq,fxW,poof,bell}=F; const pj=E6.pj, Q=E6.Q; const W=1920,H=1080;
const shot5=(id,t0,t1,fn,tr)=>{ F.NEW5.push(id); F.SHOTS=F.SHOTS.filter(s=>s.id!==id); F.shot(id,t0,t1,fn,tr); };
const S=(set)=>(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,set); const Ls=S('L'), Ms=S('M'), Ss=S('S');
const sh=(c,x,y,w)=>E6.shadow(c,x,y,w);
const KTW=E6.camFor('M',600,{camH:1.0,vx:960}), KTM=E6.camFor('L',930,{camH:1.6,vx:960});
const ZW=E6.zOf(KTW,'M'), ZM=E6.zOf(KTM,'L'); const xM=X=>g5(960+X*270), xW=X=>g5(960+X*135);
const RUN=3.5; // runners' speed relative to the roof (m/s): the roof slides under them, so feet plant
// silent-film Yamanote (duotone): riders surf the roof of a car; camera alongside at the M depth
const KSIL=E6.camFor('M',700,{camH:1.3,vx:960});
const silent=(c,t,riders,bx)=>{ const tq=Math.floor(t*12)/12; E6.trainSide(c,tq,KSIL,{Zc:E6.zOf(KSIL,'M'),v:22,duo:true,cars:[[-9,8.6],[9.4,26]],speedLines:true});
  Ja(c,'ride',tq,0,960-60,700,1,'duo'); riders.forEach((x,k)=>Ja(c,'ride',tq,k*0.1,x,700,-1,'shadow')); if(bx) bell(c,bx,550,t); E6.trainNear(); E6.silent(c,t); };
shot5('S08',25.08,28.49,(c,t)=>silent(c,t,[1700],1640),{k:'wipe',d:0.6});
shot5('S27',97.53,100.94,(c,t)=>silent(c,t,[1520,1660,1800],null),{k:'wipe',d:0.6});
// chase helpers
const chaseWide=(c,t,t0,o)=>{ const sn=o.snow; const shift=(t-t0)*RUN; const cars=[[-30-shift+o.c0,o.gap-shift+o.c0],[o.gap+1.3-shift+o.c0,40-shift+o.c0]];
  E6.trainSide(c,t,KTW,{Zc:ZW,v:20,shift,snow:sn,cars,mx:1500,my:150,mr:90,seed:sn?44:43}); return cars; };
const chaseMed=(c,t,t0,o)=>{ const shift=(t-t0)*RUN; E6.trainSide(c,t,KTM,{Zc:ZM,v:20,shift,snow:o.snow,cars:[[-40-shift,60-shift]],mx:1520,my:140,mr:80,seed:o.snow?44:43}); };
// S09 28.49–32.97 / S10 32.97–37.22 (fantasy chase, no snow)
shot5('S09',28.49,32.97,(c,t)=>{ if(t<30.5){ chaseWide(c,t,28.49,{snow:false,c0:0,gap:12}); const fy=600; sh(c,xW(-2.2),fy,40); Ms(c,'run',t,28.49,xW(-2.2),fy,1); sh(c,xW(4.2),fy,40); Ms(c,'run',t,28.59,xW(4.2),fy,1,'shadow'); bell(c,xW(4.2)-30,fy-150,t); E6.trainNear(); return; }
  chaseMed(c,t,28.49,{}); const fy=930; sh(c,700,fy,80); if(t>=30.75&&t<30.75+22/30) Ls(c,'throw',t,30.75,700,fy,1); else Ls(c,'run',t,28.49,700,fy,1);
  const u=inv(30.98,31.4,t); if(u>0&&u<1) fxW(c,'shuriken',Math.floor(t*15)%2,g5(lerp(900,2000,u)),fy-310,1); E6.trainNear(); },{k:'mosaic',d:0.6});
shot5('S10',32.97,37.22,(c,t)=>{ if(t>=35.75){ return jumpWide(c,t,35.75,35.92,false); }
  chaseMed(c,t,32.97,{}); const fy=930, jx=520, sx=1450;
  sh(c,jx,fy,80); if(t>=33.62&&t<33.62+43/30) Ls(c,'slash',t,33.62,jx,fy,1); else Ls(c,'run',t,32.97,jx,fy,1);
  if(t<35.1){ sh(c,sx,fy,80); if(t>=33.4&&t<33.4+22/30) Ls(c,'throw',t,33.4,sx,fy,-1,'shadow'); else Ls(c,'run',t,32.9,sx,fy,-1,'shadow'); bell(c,sx-60,fy-300,t); }
  poof(c,sx,fy-250,t,35.1); poof(c,sx-60,fy-150,t,35.15);
  const u=inv(33.4+8/30,33.62+19/30,t); if(u>0&&u<1) fxW(c,'shuriken',Math.floor(t*15)%2,g5(lerp(sx-200,jx+240,u)),fy-320,-1); F.sparks(c,t,33.62+19/30,jx+250,fy-320,5);
  E6.trainNear(); });
// wide somersault over the gap between two cars: Jay stays framed, the gap slides under him; take-off before, landing after
function jumpWide(c,t,t0,tj,sn){ const jx=0.3, air0=tj+6/30, air1=tj+33/30; const gx=jx+((air0+air1)/2-t0)*RUN; // gap centre under him at mid-air
  chaseWide(c,t,t0,{snow:sn,c0:0,gap:gx-0.65}); const fy=600; const q=seq(F.JUMP,t,tj); const u=inv(air0,air1,t);
  const y=t<tj?fy:g5(fy-Math.sin(u*Math.PI)*190); if(t<air0||t>=air1) sh(c,xW(jx),fy,40); else sh(c,xW(jx),fy,g5(40-Math.sin(u*Math.PI)*20));
  if(t<tj) Ms(c,'run',t,t0,xW(jx),fy,1); else if(t<tj+37/30) J(c,q[0],q[1],xW(jx),y,1); else Ms(c,'run',t,tj,xW(jx),fy,1);
  if(t>=air1&&t<air1+0.4) F.fxW(c,'dust',SPR.frameAt('FX','dust',t,air1),xW(jx),fy,1); E6.trainNear(); }
// S28 100.94–105.42 (snow): wide — three shadows chase; medium — throw / deflect
shot5('S28',100.94,105.42,(c,t)=>{ if(t<102.6){ chaseWide(c,t,100.94,{snow:true,c0:0,gap:14}); const fy=600; for(const [X,ph,rm] of [[-4.8,0.1,'shadow'],[-3.2,0.2,'shadow'],[-6.2,0.05,'far']]){ sh(c,xW(X),fy,40); Ms(c,'run',t,100.9+ph,xW(X),fy,1,rm); } sh(c,xW(2.4),fy,40); Ms(c,'run',t,100.94,xW(2.4),fy,1); E6.trainNear(); return; }
  chaseMed(c,t,100.94,{snow:true}); const fy=930, jx=1300;
  sh(c,380,fy,80); Ls(c,'run',t,100.9,380,fy,1,'shadow'); sh(c,720,fy,80); if(t>=103.2&&t<103.2+22/30) Ls(c,'throw',t,103.2,720,fy,1,'shadow'); else Ls(c,'run',t,100.95,720,fy,1,'shadow');
  sh(c,jx,fy,80); if(t>=103.25&&t<103.25+43/30) Ls(c,'slash',t,103.25,jx,fy,-1); else Ls(c,'run',t,100.94,jx,fy,1);
  const u=inv(103.43,103.25+19/30,t); if(u>0&&u<1) fxW(c,'shuriken',Math.floor(t*15)%2,g5(lerp(820,jx-240,u)),fy-320,1); F.sparks(c,t,103.25+19/30,jx-250,fy-320,7); if(t>=103.25+19/30&&t<103.25+21/30){ circ(c,jx-250,fy-320,40,'#FFF8EC'); F.light(c,jx-250,fy-320,240,'#FFE7A8',0.5,{add:true}); }
  E6.trainNear(); },{k:'mosaic',d:0.6});
// S29 105.42–109.44 (snow): his own smoke thrown back, the shadows lost; wide somersault over the gap
shot5('S29',105.42,109.44,(c,t)=>{ if(t>=107.85) return jumpWide(c,t,107.85,107.92,true);
  chaseMed(c,t,105.42,{snow:true}); const fy=930, jx=1250;
  for(const [x,tp,ph] of [[420,107.0,0.1],[760,107.1,0.2]]){ if(t<tp){ sh(c,x,fy,80); Ls(c,'run',t,100.9+ph,x,fy,1,'shadow'); } poof(c,x,fy-250,t,tp); }
  sh(c,jx,fy,80); if(t>=106.3&&t<106.3+22/30) Ls(c,'throw',t,106.3,jx,fy,-1); else Ls(c,'run',t,105.42,jx,fy,1);
  F.smoke(c,t,106.55,700,fy-240,{seed:7}); E6.trainNear(); });
// S26 95.43–97.53: the castle gate in perspective; samurai guards at the M depth, a lantern patrol; Jay crouched on the wall top (L depth)
shot5('S26',95.43,97.53,(c,t)=>{ const K=E6.KGATE; E6.castleGate(c,t,K,{}); const fM=g5(K.h+K.camH*135), fL=g5(K.h+K.camH*270);
  const gx=X=>g5(K.vx+X*135); sh(c,gx(-1.25),fM,35); Ss(c,'guard',t,95.43,gx(-1.25),fM,1); sh(c,gx(1.25),fM,35); Ss(c,'guard_r',t,95.43,gx(1.25),fM,-1);
  const px=gx(lerp(-2.3,-0.2,(t-95.43)/2.1)); sh(c,px,fM,35); Ss(c,'walk_lan',t,95.43,px,fM,1); F.light(c,px+45,fM-90,160,'#FFC870',0.5*(0.9+0.1*Math.sin(t*20)));
  // Jay on the left wall top (Y 3.9 at L depth, X -2.75): crouched, watching
  const [wx,wy]=pj(K,-2.45,4.3,E6.zOf(K,'M')); Ms(c,'crouch',t,95.43,g5(wx)+10,g5(wy),1); 
  E.snow(c,t,131,100,{}); },{k:'cut'});
})(window);
// ======================= block 5: climax — S34 keep roof, S35 attic, S36 tatami room, S37 temple roof, S38 storm/clones, S39a–c, S40, S41 =======================
(function(G){
const {mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,blob}=G.K; const E=G.E, E4=G.E4, E5=G.E5, E6=G.E6, F=G.FILM, SPR=G.SPR, D=G.DATA; const {g5,J,Ja,seq,fxW,poof,bell}=F; const pj=E6.pj, Q=E6.Q; const W=1920,H=1080;
const shot5=(id,t0,t1,fn,tr)=>{ F.NEW5.push(id); F.SHOTS=F.SHOTS.filter(s=>s.id!==id); F.shot(id,t0,t1,fn,tr); };
const S=(set)=>(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,set); const Ls=S('L'), Ms=S('M'), KL=S('KL'), Ks=S('K'), KX=S('KXL'), XLs=S('XL'), Hs=S('H'), Ts=S('T');
const sh=(c,x,y,w,col)=>E6.shadow(c,x,y,w,col); const flashW=(c,t,t0,n)=>{ if(t>=t0&&t<t0+(n||2)/30) rect(c,0,0,W,H,'#F2E8D5'); };
const spark=(c,t,ts,x,y)=>{ F.sparks(c,t,ts,x,y,Math.round(ts*7)); if(t>=ts&&t<ts+0.07){ circ(c,g5(x),g5(y),40,'#FFF8EC'); F.light(c,x,y,260,'#FFE7A8',0.6,{add:true}); } };
const GY=930; const KRL=E6.camFor('L',GY,{camH:2.4}), KRM=E6.camFor('M',800,{camH:3.2}), KRX=E6.camFor('XL',GY,{camH:1.8});
const KRS=E6.camFor('L',GY,{camH:0.12}), KRSM=E6.camFor('M',800,{camH:0.15}); const ZL=E6.zOf(KRL,'L'), ZM=E6.zOf(KRM,'M'), ZX=E6.zOf(KRX,'XL'); const FM=800;
const mX=X=>g5(960+X*135), lX=X=>g5(960+X*270);
// ---------------- S34 118.45–123.00 ----------------
const fz=122.195, un=122.0+19/30;
shot5('S34',118.45,123.00,(c,t)=>{
  if(t<119.9){ // wide: he leaps from the lower tier up to the top ridge (same depth, real heights)
    E6.keepRoof(c,t,KRM,{Zr:ZM,wx:'snow',moon:{x:1450,y:200,r:110},step:{x:-1.2,y:-2.6},shachi:5.6});
    const yLow=g5(KRM.h+(KRM.camH+2.6)*135); const q=seq(F.JUMP,t,118.6); const p=clamp((t-118.8)/1.0,0,1);
    const x=mX(lerp(-4.2,0.6,p)); const yb=lerp(yLow,FM,p); const y=t<118.8?yLow:g5(yb-Math.sin(p*Math.PI)*230);
    if(t<118.8||p>=1) sh(c,x,p>=1?FM:yLow,40); J(c,q[0],q[1],x,y,1); if(p>=1&&t<119.9) F.fxW(c,'dust',SPR.frameAt('FX','dust',t,119.8),x,FM,1); E.snow(c,t,151,70,{}); return; }
  if(t<121.6){ // silhouettes: Jay near (L) on the near ridge, the leader (M) on a far ridge across the moon
    E6.keepRoof(c,t,KRS,{Zr:ZL,wx:'snow',sil:true,moon:{x:1180,y:700,r:330},tiers:false,farRidge:{X0:-1,X1:12,Y:0.3,Z:ZL*2}});
    const fyM=g5(KRS.h+(KRS.camH-0.3)*135); Ls(c,'idle',t,119.9,lX(-1.6),GY,1,'sil'); Ks(c,'hold',t,119.9,g5(960+1.6*270),fyM,-1,'sil'); bell(c,g5(960+1.6*270)-60,fyM-170,t); F.petals(c,t,23,60,{}); return; }
  if(t<fz){ E6.keepRoof(c,t,KRL,{Zr:ZL,wx:'snow',moon:{x:700,y:300,r:200},shachi:-3.2}); sh(c,1100,GY,80); KL(c,'hold',t,121.6,1100,GY,-1); bell(c,1010,GY-290,t); F.petals(c,t,23,70,{}); return; }
  const frozen=t<un; E6.keepRoof(c,frozen?fz:t,KRL,{Zr:ZL,wx:'snow',moon:{x:1500,y:240,r:200},shachi:3.4}); sh(c,820,GY,80); Ls(c,'slash',t,122.0,820,GY,1);
  spark(c,t,122.633,1060,640); F.petals(c,frozen?fz:t,23,90,{freeze:frozen?fz:null,wind:frozen?20:500}); E.snow(c,frozen?fz:t,151,60,{}); flashW(c,t,un,2); },{k:'mosaic',d:0.6});
// ---------------- S35 123.00–127.55: the attic ----------------
const KAM=E6.camFor('M',860,{camH:1.6});
shot5('S35',123.00,127.55,(c,t)=>{ const cam=(t-123)*0.15;
  if(t<124.75){ const K=E6.KATT; E6.attic(c,t,K,{cam}); const jx=760, sx=1180, tc=123.6+19/30, fy=935;
    sh(c,jx,fy,80); if(t<123.6) Ls(c,'idle',t,123,jx,fy,1); else Ls(c,'slash',t,123.6,g5(jx+inv(123.6+12/30,tc,t)*120),fy,1);
    if(t<tc){ sh(c,sx,fy,80); Ls(c,'idle',t,123,sx,fy,-1,'shadow'); } poof(c,sx,fy-250,t,tc); spark(c,t,124.233,1140,650); E6.atticNear(); return; }
  if(t<125.6){ const K=KAM; E6.attic(c,t,K,{cam:0.4}); const fy=860; // wide: a shadow crouched on the tie beam of the M-depth truss (Y 2.6)
    sh(c,600,fy,40); Ms(c,'throw',t,124.75,600,fy,1); const by=g5(K.h+(K.camH-2.6)*135); const tr=124.75+7/30, th=tr+0.35; if(t<th) Ms(c,'crouch',t,124,1380,by,-1,'shadow'); poof(c,1380,by-60,t,th);
    const u=inv(tr,th,t); if(u>0&&u<1) fxW(c,'shuriken',Math.floor(t*15)%2,g5(lerp(660,1370,u)),g5(lerp(fy-80,by-50,u)),1); E6.atticNear(); return; }
  if(t<126.45){ const K=E6.KATT; E6.attic(c,t,K,{cam:cam+0.1}); const fy=935; sh(c,960,fy,80); Ls(c,'look',t,125.6,960,fy,1); // two drop from the L-depth tie beam
    const by=g5(K.h+(K.camH-2.6)*270)+40; for(const [x,t0,f] of [[520,125.75,1],[1420,125.85,-1]]){ const u=clamp((t-t0)/0.35,0,1); if(t>=t0){ sh(c,x,fy,g5(30+50*u)); J(c,'land',u<1?0:SPR.frameAt('L','land',t,t0+0.35),x,g5(lerp(by,fy,u*u)),f,'shadow','L'); if(u>=1&&t<t0+0.75) F.fxW(c,'dust',SPR.frameAt('FX','dust',t,t0+0.35),x,fy,f); } }
    E6.atticNear(); return; }
  // outside: the leader throws smoke from the ridge
  E6.keepRoof(c,t,KRL,{Zr:ZL,wx:'snow',cam:(t-126)*0.6,moon:{x:400,y:260,r:200}}); sh(c,1150,GY,80); KL(c,'throw',t,126.45,1150,GY,-1); F.smoke(c,t,126.7,800,GY-260,{seed:13}); E.snow(c,t,151,60,{}); });
// attic: add a truss at the L depth so the drop comes from a real beam
// ---------------- S36 127.55–132.08: the tatami room ----------------
const KTT=E6.camFor('L',935,{camH:1.25,vx:960}), KTX=E6.camFor('XL',935,{camH:1.35,vx:960});
const tokoFrame=(c,t)=>{ // the scroll seen close, hung in the tokonoma: post, lintel, alcove floor framing the parchment
  rect(c,0,0,170,H,'#33201A'); rect(c,150,0,20,H,'#4A2A1C'); rect(c,0,0,W,95,'#2A1E1A'); rect(c,0,80,W,15,'#4A2A1C'); rect(c,1770,0,150,H,'#E2D3B8'); rect(c,1760,0,15,H,'#33201A');
  rect(c,0,985,W,95,'#5E3A26'); rect(c,0,985,W,10,'#93603C'); F.light(c,1700,700,600,'#FFC870',0.35*(0.9+0.1*Math.sin(t*20))); };
shot5('S36',127.55,132.08,(c,t)=>{
  if(t<128.6){ E6.tatami(c,t,KTT,{scroll:(c,t,r)=>{ rect(c,r[0],r[1],r[2],r[3],'#E2D3B8'); for(let k=0;k<5;k++) rect(c,g5(r[0]+r[2]*(0.15+k*0.17)),g5(r[1]+r[3]*0.55),15,g5(r[3]*0.3),'#2A1E1A'); rect(c,r[0],g5(r[1]+r[3]*0.86),r[2],5,'#2A1E1A'); }}); return; }
  if(t<129.823){ F.scroll2(c,t,{t0:127.55,mode:'twist',turn:999}); tokoFrame(c,t); return; }
  if(t<131.0){ E6.tatami(c,t,KTX,{}); E.dither(c,0,0,W,H,'#6E1A1E',f=>0.12); const torn=t>=130.0; sh(c,1060,935,120);
    J(c,torn?'reveal':'hood',SPR.frameAt('KXL','hood',t,129.823),1060,935,-1,null,'KXL'); bell(c,1060-27*5,935-87*5,t); flashW(c,t,130.0,2); return; }
  if(t<131.5){ F.scroll2(c,t,{t0:127.55,mode:'twist',turn:129.823,burn:130.6}); tokoFrame(c,t); return; }
  E6.tatami(c,t,KTT,{burn:131.0,scroll:(c,t,r)=>{ rect(c,r[0],r[1],r[2],r[3],'#2A1E1A'); }}); },{k:'dissolve',d:0.6});
// ---------------- S37 132.08–136.57: temple hall roof in snow, the pagoda beyond ----------------
const st37=[132.656,133.213,133.77,134.351];
shot5('S37',132.08,136.57,(c,t)=>{ const pg=[-14,70];
  if(t<134.35){ E6.keepRoof(c,t,KRL,{Zr:ZL,wx:'snow',moon:{x:1250,y:230,r:170},pagoda:pg,tiers:false}); const lv=st37.filter(q=>t>=q).length; const R=[null,'fade1','fade2','fade3','fade3'][lv];
    if(lv<4) sh(c,860,GY,g5(80-lv*18)); if(t<132.3) Ls(c,'idle',t,132.08,860,GY,1); else Ls(c,'seal',t,132.3,860,GY,1,R); F.petals(c,t,29,40,{}); E.snow(c,t,151,50,{}); return; }
  if(t<135.45){ E6.keepRoof(c,t,KRL,{Zr:ZL,wx:'snow',moon:{x:600,y:260,r:200},pagoda:[10,70],tiers:false,cam:0.8}); const f=t<134.75?-1:(t<135.1?1:-1); sh(c,1000,GY,80); KL(c,'look',t,134.35,1000,GY,f); bell(c,1000+f*90,GY-290,t); F.petals(c,t,29,40,{}); E.snow(c,t,151,50,{}); return; }
  E6.keepRoof(c,t,KRL,{Zr:ZL,wx:'snow',moon:{x:600,y:260,r:200},pagoda:[10,70],tiers:false,cam:0.8}); sh(c,800,GY,80); KL(c,'look',t,134.35,800,GY,-1); bell(c,710,GY-290,t); poof(c,1300,GY-250,t,135.42);
  if(t>=135.488){ sh(c,1300,GY,80); J(c,'slash',t<135.8?0:1,1300,GY,-1,null,'L'); } spark(c,t,135.6,1250,690); E.snow(c,t,151,50,{}); },{k:'flash'});
// ---------------- S38 136.57–145.64: storm on the keep; clones on the counts at true depths; lightning without washout ----------------
const cnt=t=>D.counts.filter(q=>q.t>=136.57&&q.t<=t);
const LT=141.12; const lflash=t=>t>=LT&&t<LT+1/30;
shot5('S38',136.57,145.64,(c,t)=>{ const c38=cnt(t);
  if(t<138.88){ // medium: leader (KL) on the ridge; clones appear: two on his ridge (L), two on the upper tier ridge behind (M)
    E6.keepRoof(c,t,KRL,{Zr:ZL,wx:'storm',farRidge:{X0:-9,X1:9,Y:1.2,Z:ZL*2}});
    const fyM=g5(KRL.h+(KRL.camH-1.2)*135); const lf=c38.length%2?1:-1;
    const sp=[[420,1,136.58,0],[1500,-1,137.183,0],[700,1,137.741,1],[1240,-1,138.298,1]];
    sp.forEach(([x,f,tb,far],k)=>{ if(far){ if(t>=tb+0.1){ sh(c,x,fyM,35); if(k%2) J(c,'slash',5,x,fyM,f,null,'M'); else Ms(c,'seal',t,tb,x,fyM,f); } poof(c,x,fyM-110,t,tb); } });
    sh(c,960,GY,80); KL(c,'look',t,136.57,960,GY,lf); bell(c,960+lf*90,GY-290,t);
    sp.forEach(([x,f,tb,far],k)=>{ if(!far){ if(t>=tb+0.1){ sh(c,x,GY,80); if(k%2) J(c,'slash',5,x,GY,f,null,'L'); else Ls(c,'seal',t,tb,x,GY,f); } poof(c,x,GY-250,t,tb); } });
    F.petals(c,t,91,60,{wind:400}); return; }
  if(t<LT){ // wide: eight clones on the ridge and the lower tiers (M scale everywhere = one depth, different heights)
    E6.keepRoof(c,t,KRM,{Zr:ZM,wx:'storm',step:{x:-3.6,y:-1.6},shachi:6.6});
    const cs=c38.length, n=Math.min(8,Math.pow(2,Math.min(3,cs))); const lf=cs%2?1:-1;
    const yAt=Y=>g5(KRM.h+(KRM.camH-Y)*135);
    const spots=[[-1.6,0,1],[2.4,0,-1],[-5.0,-1.6,1],[4.2,0,-1],[-6.6,-1.6,1],[5.6,0,-1],[-0.4,0,1],[3.3,0,-1]];
    const POSE=[['seal',null],['slash',5],['crouch',1],['point',1],['throw',0],['seal',null],['idle',null],['slash',1]];
    const born=k=>k===0?null:D.counts.filter(q=>q.t>=136.57)[Math.ceil(Math.log2(k+1))-1];
    sh(c,mX(0.9),FM,40); Ks(c,'hold',t,136.57,mX(0.9),FM,lf); bell(c,mX(0.9)+lf*60,FM-170,t);
    for(let k=0;k<n;k++){ const [X,Y,f]=spots[k]; const [an,fix]=POSE[k]; const b=born(k); const tb=b?b.t:-99; const x=mX(X), y=yAt(Y);
      if(k===0||t>=tb+0.1){ sh(c,x,y,40); const fr=fix==null?SPR.frameAt('M',an,t,tb+k*0.13):fix; J(c,an,fr,x,y,f,null); } if(k>0) poof(c,x,y-110,t,tb); }
    F.petals(c,t,91,90,{wind:500}); return; }
  if(t<143.4){ // silhouettes leaping along the ridge against the moon breaking through the storm; one lightning frame (sky only)
    const fl=lflash(t); E6.keepRoof(c,t,KRSM,{Zr:ZM,wx:'clear',sil:true,moon:{x:960,y:600,r:400},tiers:false,top:fl?'#4A5378':undefined,mid:fl?'#5A6A9A':undefined});
    if(t>=LT&&t<LT+2/30) E6.bolt(c,1500,0,g5(KRSM.h-40),11);
    { const r=mulberry(7); for(let k=0;k<6;k++){ const x=((r()*2400-t*90*(1+k%2))%2400+2400)%2400-240, y=200+r()*500; ell(c,g5(x),g5(y),g5(250+r()*200),g5(20+r()*30),0,'#141A30'); } }
    Ks(c,'hold',t,LT,960,FM,1,'sil'); bell(c,1020,FM-170,t);
    const xs=[160,380,600,780,1140,1320,1540,1760]; xs.forEach((x,k)=>{ const t0=LT+k*0.12; const q=seq(F.JUMP,t,t0); const u=clamp((t-t0-0.2)/1.0,0,1); J(c,q[0],q[1],x,g5(FM-Math.sin(u*Math.PI)*220),x<960?1:-1,'sil'); });
    F.petals(c,t,91,80,{wind:300}); return; }
  // close on the leader (KXL) on the ridge in the rain; three clones seal on the far ridge (M)
  E6.keepRoof(c,t,KRX,{Zr:ZX,wx:'storm',farRidge:{X0:-12,X1:12,Y:0.6,Z:ZX*3}}); const fyM=g5(KRX.h+(KRX.camH-0.6)*135);
  [[300,1,143.4],[620,1,143.9],[1700,-1,144.4]].forEach(([x,f,tb])=>{ if(t>=tb){ sh(c,x,fyM,35); Ms(c,'seal',t,tb,x,fyM,f); } poof(c,x,fyM-110,t,tb-0.05); });
  sh(c,1150,GY,130); KX(c,'hood',t,143.4,1150,GY,(Math.floor((t-143.4)/0.6)%2)?1:-1); F.petals(c,t,91,100,{wind:300}); },{k:'mosaic',d:0.6});
F.SHAKES.push({t:LT+0.01,d:0.2,a:2});
// ---------------- S39a–c: three strikes ----------------
shot5('S39a',145.64,147.93,(c,t)=>{ // wide: wet ridge in the rain, puddle glints on the cap
  E6.keepRoof(c,t,KRM,{Zr:ZM,wx:'storm',shachi:-5.2}); const ts=145.64, tc=ts+19/30; sh(c,1150,FM,40); Ks(c,'idle',t,ts,1150,FM,-1);
  const jx=g5(620+inv(ts+12/30,tc,t)*200); sh(c,jx,FM,40); Ms(c,'slash',t,ts,jx,FM,1); if(t>=tc&&t<tc+3/30) poly(c,[[890,FM-300],[910,FM-300],[1410,FM-20],[1390,FM-20]],'#FFF8EC');
  spark(c,t,146.273,1150,FM-160); { const r=mulberry(Math.floor(t*15)); for(let k=0;k<10;k++){ const x=g5(r()*W), y=g5(FM+5); rect(c,x,y-10,5,10,'#8C9CC8'); rect(c,x-5,y-15,15,5,'#C8D4F0'); } } F.petals(c,t,29,60,{wind:400}); },{k:'flash'});
shot5('S39b',147.93,150.19,(c,t)=>{ const K=E6.KBAL; const fl=t>=148.9&&t<148.9+1/30; E6.balcony(c,t,K,{flash:fl}); if(fl) E6.bolt(c,400,0,g5(K.h-20),5);
  const ts=147.93, tc=ts+19/30; sh(c,760,GY,80); KL(c,'look',t,ts,760,GY,1); bell(c,850,GY-290,t);
  const jx=g5(1320-inv(ts+12/30,tc,t)*220); sh(c,jx,GY,80); Ls(c,'slash',t,ts,jx,GY,-1); if(t>=tc&&t<tc+3/30) poly(c,[[480,480],[500,480],[1040,900],[1020,900]],'#FFF8EC'); spark(c,t,148.563,760,690); F.petals(c,t,29,50,{wind:400}); },{k:'flash'});
shot5('S39c',150.19,151.20,(c,t)=>{ E6.keepRoof(c,t,KRSM,{Zr:ZM,wx:'clear',sil:true,moon:{x:1000,y:600,r:430},tiers:false}); const ts=150.19-12/30, tc=ts+19/30, gone=150.45;
  if(t<gone) Ks(c,'idle',t,ts,1000,FM,-1,'sil'); poof(c,1000,FM-110,t,gone); const u=inv(gone,gone+0.7,t); bell(c,1000,g5(FM-170+Math.min(1,u*u)*170),t);
  Ms(c,'slash',t,ts,g5(560+inv(ts+12/30,tc,t)*220),FM,1,'sil'); if(t>=tc&&t<tc+3/30) poly(c,[[740,FM-290],[760,FM-290],[1260,FM-30],[1240,FM-30]],'#FFF8EC'); spark(c,t,150.45,960,FM-230); F.petals(c,t,29,80,{wind:300}); },{k:'flash'});
// ---------------- S40 151.20–152.37: XL close, he catches the bell; S41 152.37–154.43 the reality flickers in ----------------
shot5('S40',151.20,152.37,(c,t)=>{ E6.keepRoof(c,t,KRX,{Zr:ZX,wx:'snow',moon:{x:1250,y:300,r:260},tiers:true}); sh(c,860,GY,130); XLs(c,'catch',t,151.2,860,GY,1);
  const u=inv(151.2,151.45,t); bell(c,860+27*5,g5(lerp(GY-700,GY-87*5,eo(u))),t); E.snow(c,t,181,25,{calm:1}); });
const FL41=[[152.462,1],[153.043,2],[153.6,3]];
shot5('S41',152.37,154.43,(c,t)=>{ const f1=FL41.some(([ft,n])=>t>=ft&&t<ft+n/30);
  if(f1){ const K=E6.KCTR; const fy=g5(K.h+K.camH*270); E6.counterP(c,t,{behind:(c,K)=>Ts(c,'m_stir',t,0,g5(K.vx+1.65*270),fy,-1)}); Q(c,K,[[0.4,0,1.3],[1.25,0,1.3],[1.25,0.8,1.3],[0.4,0.8,1.3]],E4.C.w2); sh(c,g5(K.vx-0.05*270)-10,fy,80); Hs(c,'chew',t,152,g5(K.vx-0.05*270),fy,1); F.FX.amb=[0.98,0.9,0.82]; return; }
  E6.keepRoof(c,t,KRX,{Zr:ZX,wx:'snow',cam:(t-152.37)*0.25,moon:{x:1300,y:260,r:220}}); sh(c,560,GY,130); XLs(c,'catch',t,152.4,560,GY,1); E.snow(c,t,151,100,{}); });
})(window);
// ======================= block 6: the HOME tatami room rebuilt in true perspective (S11–S14, S30–S33) =======================
(function(G){
const {mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,blob,capsule}=G.K; const E=G.E, E4=G.E4, E5=G.E5, E6=G.E6, F=G.FILM, SPR=G.SPR; const {g5,J,Ja}=F; const pj=E6.pj, Q=E6.Q; const W=1920,H=1080; const C=E4.C;
const shot5=(id,t0,t1,fn,tr)=>{ F.NEW5.push(id); F.SHOTS=F.SHOTS.filter(s=>s.id!==id); F.shot(id,t0,t1,fn,tr); };
const Hs=(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,'H'); const WARM=[0.98,0.9,0.82];
const leafCut=(c,t,ts,x,y,s,seed)=>{ const u=t-ts; if(u<0||u>1.2) return; const r=mulberry(seed||3); for(let k=0;k<5;k++){ const a=-1.2+r()*1.4, v=200+r()*220; const px=g5(x+Math.cos(a)*v*u*s), py=g5(y+Math.sin(a)*v*u+500*u*u); blob(c,[[px-25,py],[px,py-12],[px+25,py],[px,py+10]],k%2?C.fol2:C.fol1); } };
const FY=940; const jxOf=K=>g5(K.vx+E6.HOME.JX*270);
const room=(c,t,pan,o)=>{ const K=E6.camHome(pan); E6.home(c,t,K,o); return K; };
const sh=(c,x,w)=>E6.shadow(c,x,FY,w,'#2F4A3A');
shot5('S11',37.22,39.37,(c,t)=>{ const lt=t-37.22; const K=room(c,t,lerp(-60,40,lt/2.15),{}); const jx=jxOf(K); sh(c,jx,80); if(t<37.8) Hs(c,'idle',t,37.22,jx,FY,1); else Hs(c,'seal',t,37.8,jx,FY,1); E6.homeTable(c,t,K,{}); F.amb(WARM); },{k:'flash'});
shot5('S12',39.37,41.56,(c,t)=>{ const s1=39.5, s2=40.85; const K=room(c,t,60,{}); const jx=jxOf(K); sh(c,jx,80);
  if(t<s2-0.15) Hs(c,'slash',t,s1-0.2,jx-60,FY,1); else Hs(c,'slash',t,s2-0.2,jx+60,FY,-1); E6.homeTable(c,t,K,{});
  leafCut(c,t,s1,jx+200,620,1,3); leafCut(c,t,s2,jx-200,600,-1,5); F.amb(WARM); });
shot5('S13',41.56,44.03,(c,t)=>{ const K=room(c,t,lerp(80,120,eio(inv(41.56,44.03,t))),{}); const jx=jxOf(K); sh(c,jx,90); Hs(c,'seiza_snip',t,41.56,jx,FY,1); const [vx,vy,k]=E6.homeTable(c,t,K,{rip:42.9});
  const u=inv(42.75,43.5,t); if(u>0&&u<1){ const px=vx+90*k+Math.sin(u*9)*12, py=lerp(vy-104*k,vy-4,ei(u)); ell(c,g5(px),g5(py),10,6,0,'#D8402F'); rect(c,g5(px)-5,g5(py)-5,5,5,'#F07850'); } F.amb(WARM); },{k:'dissolve',d:0.4});
const phoneShot=(t0,t1,picked,snow,bamboo,cut)=>(c,t)=>{ const lt=t-t0; const K=room(c,t,lerp(-40,20,lt/(t1-t0)),{snow,bamboo,phone:{t0,t1:picked,picked}}); const jx=jxOf(K); sh(c,jx,90);
  if(t<picked) Hs(c,'seiza',t,t0,jx,FY,1); else Hs(c,t<picked+1.0?'phone':'phone_listen',t,picked,jx,FY,1); E6.homeTable(c,t,K,{bamboo,cut,rip:t1-0.5}); F.amb(WARM); };
shot5('S14',44.03,46.02,phoneShot(43.75,46.02,44.45,false,false,false));
shot5('S30',109.44,111.66,(c,t)=>{ const lt=t-109.44; const K=room(c,t,lerp(40,-40,lt/2.22),{snow:true,bamboo:true}); const jx=jxOf(K); sh(c,jx,80); if(t<110.0) Hs(c,'idle',t,109.44,jx,FY,1); else Hs(c,'seal',t,110.0,jx,FY,1); E6.homeTable(c,t,K,{bamboo:true}); F.amb(WARM); },{k:'flash'});
shot5('S31',111.66,113.98,(c,t)=>{ const tc=113.03; const K=room(c,t,100,{snow:true,bamboo:true}); const jx=jxOf(K); sh(c,jx,90); Hs(c,'seiza_snip',t,111.66,jx,FY,1);
  const [vx,vy,k]=E6.homeTable(c,t,K,{bamboo:true,cut:t>=tc});
  if(t>=tc){ const bx=vx+30*k; rect(c,g5(bx-14*k),g5(vy-90*k),g5(28*k),g5(90*k),'#46613F'); rect(c,g5(bx),g5(vy-90*k),Math.max(5,g5(8*k)),g5(90*k),'#7C9A6E'); E5.fallingBamboo(c,t,tc,bx,vy-200*k); if(t<tc+0.1){ c.save(); c.translate(bx,vy-110*k); c.rotate(-0.3); rect(c,-300,-3,600,6,'#FFF8EC'); c.restore(); } }
  F.amb(WARM); });
const stump=(c,K,t)=>{ const [vx,vy,k]=E6.homeTable(c,t,K,{bamboo:true,cut:true}); const bx=vx+30*k; rect(c,g5(bx-14*k),g5(vy-90*k),g5(28*k),g5(90*k),'#46613F'); rect(c,g5(bx),g5(vy-90*k),Math.max(5,g5(8*k)),g5(90*k),'#7C9A6E'); poly(c,[[g5(bx-14*k),g5(vy-90*k)],[g5(bx+14*k),g5(vy-100*k)],[g5(bx+14*k),g5(vy-88*k)],[g5(bx-14*k),g5(vy-84*k)]],'#C8D4A0'); };
shot5('S32',113.98,116.49,(c,t)=>{ const K=room(c,t,lerp(80,120,eio(inv(113.98,116.49,t))),{snow:true,bamboo:true}); const jx=jxOf(K); sh(c,jx,90); Hs(c,'seiza_snip',t,113.98,jx,FY,1); stump(c,K,t); F.amb(WARM); },{k:'dissolve',d:0.4});
const ph33=(c,t)=>{ const t0=116.2,t1=117.7,picked=116.75; const K=room(c,t,lerp(-40,20,(t-t0)/(t1-t0)),{snow:true,bamboo:true,phone:{t0,t1:picked,picked}}); const jx=jxOf(K); sh(c,jx,90);
  if(t<picked) Hs(c,'seiza',t,t0,jx,FY,1); else Hs(c,t<picked+1.0?'phone':'phone_listen',t,picked,jx,FY,1); stump(c,K,t); F.amb(WARM); };
shot5('S33',116.49,118.45,(c,t)=>{ if(t<117.7) return ph33(c,t);
  // XL close at the XL depth (Z 1.98): he looks up, determined; feet/knees on the real floor line of that depth
  const K=E6.camHome(-560,'XL',1000); E6.home(c,t,K,{snow:true,bamboo:true}); E6.shadow(c,345,1000,130,'#2F4A3A'); Ja(c,'x_det',t,117.7,345,1000,1,null,'H'); F.amb(WARM); });
})(window);
// ======================= block 7: S01 opening with the protagonist, S07 samurai parade (S set), S42c petal + thread, O7 reverse angle =======================
(function(G){
const {mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,blob,capsule}=G.K; const E=G.E, E4=G.E4, E5=G.E5, E6=G.E6, F=G.FILM, SPR=G.SPR; const {g5,J,Ja}=F; const pj=E6.pj, Q=E6.Q; const W=1920,H=1080; const C=E4.C;
const shot5=(id,t0,t1,fn,tr)=>{ F.NEW5.push(id); F.SHOTS=F.SHOTS.filter(s=>s.id!==id); F.shot(id,t0,t1,fn,tr); };
const S=(set)=>(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,set); const Hs=S('H'), Ls=S('L'), Ss=S('S'), Ts=S('T');
const fl=(t)=>0.9+0.1*Math.sin(t*23)*Math.sin(t*7.3); const WARM=[0.98,0.9,0.82];
// ---- S01: keep the title/moon/tilt, then (5.4–8.93) the protagonist: a high view of the rainy lane; modern Jay walks under his umbrella,
//      and the puddle at his feet reflects the ninja he will become
const S01old=F.SHOTS.find(s=>s.id==='S01'); const S01fn=S01old.fn, S01tr=S01old.tr;
const KS01=E6.camFor('L',640,{vx:1250,camH:4.2});
shot5('S01',0,8.93,(c,t)=>{ if(t<5.4) return S01fn(c,t);
  const lt=t-5.4; const K=KS01; E6.lane(c,t,{snow:false,K}); const fy=640;
  const X=lerp(-2.6,-0.4,lt/3.53), x=g5(K.vx+X*270);
  // puddle on the asphalt in front of the vending machine glow: the reflection shows ninja Jay walking in step
  const px0=g5(x-330), px1=g5(x+390), pcx=g5((px0+px1)/2), pcy=fy+230, prx=g5((px1-px0)/2), pry=210;
  ell(c,pcx,pcy,prx,pry,0,'#2E3756'); ell(c,pcx,pcy,prx-10,pry-10,0,'#5A6A9A'); for(const [dx,dy,w] of [[-200,-120,260],[-80,60,320],[40,150,180]]) rect(c,g5(pcx+dx),g5(pcy+dy),w,5,'#8C9CC8');
  rect(c,g5(pcx+230),g5(pcy-150),15,g5(110),'#B8562E'); rect(c,g5(pcx+235),g5(pcy-150),5,g5(80),'#F09A48');
  c.save(); c.beginPath(); c.ellipse(pcx,pcy,prx-10,pry-10,0,0,6.283); c.clip();
  F.mirrorSprite(c,'L','walk',SPR.frameAt('L','walk',t,5.4),x,fy+5,1,null,t,0.8,null); c.restore();
  F.ripples(c,t,{n:7,x0:px0+80,x1:px1-80,y0:fy+60,y1:fy+400,r0:5,r1:25,sq:0.3,col:'#5A6A9A',per:0.8,seed:41});
  E6.shadow(c,x,fy,80); Hs(c,'walk_umb',t,5.4,x,fy,1);
  F.rain(c,t,{seed:5,dens:0.7}); F.amb([0.66,0.7,0.96]);
},S01tr);
// ---- S07: the castle world, parade of armoured samurai (S set: yari bearers, lantern bearers, banners) walking on the bridge
const S07old=F.SHOTS.find(s=>s.id==='S07'); const S07fn=S07old.fn, S07tr=S07old.tr;
function castleWorld5(c,t,lt){ const tilt=eio(inv(0,1.0,lt)); const ty=g5(lerp(100,0,tilt));
  E5.SKY(c,t,13,900); E.moon(c,1420,g5(220+ty*0.3),190,{}); E5.clouds(c,t,[[300+ty*0.3,15,14,620,'#2E3756',100],[420+ty*0.3,10,-9,500,'#253052',900]]);
  E5.mountains(c,0,640+ty*0.4,200,'#1C2238',31); E5.cityLights(c,t,-100,2100,600+ty*0.4,17,'#F09A48');
  c.save(); c.translate(0,ty*0.6); { const x=((t*22)%240); E.dither(c,-240+x,640,2400,90,'#4A5378',0.35); } E.castle(c,t,1000,800,1.9,{banners:(i)=>clamp((lt-0.25*i)/0.3,0,1)}); c.restore();
  c.save(); c.translate(0,ty);
  rect(c,-100,860,2100,40,'#43475A'); for(let x=-100;x<2000;x+=60){ rect(c,x,865,55,15,'#5A5F73'); } rect(c,-100,900,2100,180,'#12303A'); rect(c,-100,900,2100,5,'#0E1020');
  for(let j=0;j<7;j++){ const w=g5(70-j*7+Math.sin(t*3+j)*12), off=g5(Math.sin(t*4+j*1.7)*18); rect(c,1420+off-w,920+j*14,w*2,5,j%2?'#C8D4F0':'#8C9CC8'); }
  F.ripples(c,t,{n:8,x0:-100,x1:2000,y0:920,y1:1070,r0:5,r1:30,sq:0.3,col:'#5FB0A8',per:0.7,seed:30});
  rect(c,-100,820,2100,30,'#5A5F73'); rect(c,-100,815,2100,8,'#7E7C76'); rect(c,-100,850,2100,10,'#2E3756');
  const kinds=['walk_yari','walk_lan','walk_yari_r','walk_lan_i'];
  for(let k=0;k<13;k++){ const x=g5(((2100-k*165-lt*95)%2300+2300)%2300-200); const an=kinds[k%4]; E6.shadow(c,x,815,40); Ss(c,an,t,k*0.17,x,815,-1);
    if(an.startsWith('walk_lan')) F.light(c,x-45,725,150,'#FFC870',0.38*fl(t+k),{add:true}); }
  for(let x=-80;x<2000;x+=160){ rect(c,x,770,15,50,'#43475A'); rect(c,x-5,765,25,8,'#5A5F73'); }   // bridge posts in front of their feet line
  c.restore();
  F.reflect(c,{y0:900+ty,y1:1080,k:0.45,dark:0.6,amp:1.5,t,tint:'#A8E0D0'});
  poly(c,[[1400,1080],[1600,900],[2000,860],[2000,1080]],'#0E1020'); for(let x=1600;x<2000;x+=40) rect(c,x,g5(900-(x-1600)*0.1),30,10,'#1C2238');
  Ls(c,'look',t,0,1700,g5(890),-1,'sil'); E.dither(c,0,980,W,100,'#253052',0.3);
  F.amb([0.55,0.62,1.0]); F.light(c,1420,220,700,'#C8D4F0',0.2,{ry:0.8}); }
shot5('S07',22.87,25.08,(c,t)=>{ if(t<23.98) return S07fn(c,t); castleWorld5(c,t,t-23.98); },S07tr);
// ---- S42c: what he brought back — a notched sakura petal (three pinks) and a frayed red thread with its shadow, on the counter by the bowl
const S42cold=F.SHOTS.find(s=>s.id==='S42c'); const S42ctr=S42cold.tr;
const sakura=(c,x,y,s,a)=>{ c.save(); c.translate(x,y); c.rotate(a); const P=[[0,42],[14,30],[26,6],[26,-14],[18,-32],[8,-40],[0,-28],[-8,-40],[-18,-32],[-26,-14],[-26,6],[-14,30]];
  poly(c,P.map(([u,v])=>[u*s+10,v*s+10]),'#5E3826'); poly(c,P.map(([u,v])=>[u*s,v*s]),'#EBA9A5'); poly(c,[[4*s,40*s],[14*s,30*s],[26*s,6*s],[26*s,-14*s],[18*s,-32*s],[10*s,-20*s],[12*s,10*s]],'#C86C78');
  poly(c,[[-16*s,-24*s],[-6*s,-30*s],[-2*s,-10*s],[-8*s,16*s],[-16*s,4*s]],'#F8D8D0'); rect(c,-2*s,26*s,Math.max(5,4*s),Math.max(5,12*s),'#C86C78'); for(const [u,v] of [[-4,0],[2,-8],[0,10]]) rect(c,u*s,v*s,5,5,'#C86C78'); c.restore(); };
shot5('S42c',156.30,157.10,(c,t)=>{ E4.bowl(c,t,{dy:0,rip:false,rings:[[156.4,0,0]]});
  // thread: 2-px (10 world) core, a lighter twist every few px, frayed fibres at both ends, cast shadow offset down-right
  const pts=[]; for(let k=0;k<52;k++){ const x=330+k*13, y=770+Math.sin(k*0.42)*24+k*1.3; pts.push([x,y]); }
  for(const [x,y] of pts) rect(c,g5(x+10),g5(y+15),15,10,'#2A1E1A');
  pts.forEach(([x,y],k)=>{ rect(c,g5(x),g5(y),15,10,'#A82A26'); if(k%3===0) rect(c,g5(x),g5(y),10,5,'#D8402F'); if(k%6===1) rect(c,g5(x+5),g5(y+5),5,5,'#F07850'); });
  for(const [ex,ey,d] of [[pts[0][0],pts[0][1],-1],[pts[51][0],pts[51][1],1]]) for(let f=0;f<4;f++){ const fx=ex+d*(10+f*8), fy=ey-10+f*8; rect(c,g5(fx),g5(fy),5,5,f%2?'#D8402F':'#F07850'); rect(c,g5(fx+d*5),g5(fy+(f-1.5)*4),5,5,'#A82A26'); }
  sakura(c,g5(1450),g5(720),2.4,0.5+Math.sin(t*2)*0.03);
  F.amb(WARM); F.light(c,960,450,700,'#FFC870',0.25,{ry:0.6}); },S42ctr);
// ---- O7: reverse angle from behind the counter: Jay seated across, the noren and lantern stirred by the gust
const O7old=F.SHOTS.find(s=>s.id==='O7'); const O7tr=O7old.tr;
const JX=g5(900-0.95*405), FYc=1180; const CY=()=>{ const [x,y]=pj(E6.KOC,0,0.8,1.8); return g5(y); };
shot5('O7',16.33,17.18,(c,t)=>{ const gust=inv(16.75,17.0,t)*(1-inv(17.0,17.18,t)); E6.overCounter(c,t,{snow:false,gust});
  E6.drawClip(c,'H','x_seat_resolve',1,JX,FYc,1,null,CY()); E6.overCounterFG(c,t,{}); F.FX.amb=[0.98,0.9,0.82]; },O7tr);
})(window);
