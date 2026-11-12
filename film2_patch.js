// film2_patch.js — v2 re-staging. Loads after film_a/b/c.js (v1 shot library) and replaces shots by id.
// Grammar: wide shots stay as establishers; medium = L sprite (~96 px), close = XL sprite (~140 px) or the leader's KL/KXL sets.
// Sprites are never scaled; only background sets are zoomed (vector fills, re-snapped to NINJA-32).
(function(G){
const {P,mulberry,hash,clamp,lerp,inv,eio,eo,ei,twos,poly,rect,circ,capsule,blob}=G.K;
const E=G.E, D=G.DATA, SPR=G.SPR, F=G.FILM; const W=1920,H=1080;
const {g5,seq,J,Ja,fxW,poof,bell}=F; F.V2=true;
const REPL=new Set(['S04','S05','S06','S09','S10','S11','S12','S14','S15','S16','S17','S18','S19','S20','S23','S24','S28','S29','S30','S31','S33','S34','S35','S36','S37','S38','S39a','S39b','S39c','S40']);
F.SHOTS=F.SHOTS.filter(s=>!REPL.has(s.id));
const shot=F.shot, GY=930;  // feet line for L / XL sprites (low-res y 186, just above the caption band)
const bellAt=(c,x,y,t)=>bell(c,x,y,t);
// shorter, lighter smoke (v2): grows for 0.6 s, gone by 1.3 s, max radius 340
F.smoke=(c,t,ts,cx,cy,opt={})=>{ const u=t-ts; if(u<0) return; const life=1-inv(ts+0.6,ts+1.3,t); if(life<=0) return; const r=mulberry(opt.seed||3);
  for(let k=0;k<22;k++){ const a=r()*6.28, d=r()*720*Math.min(1,u*1.8), R=g5(Math.min(340,(70+r()*110)*(0.4+u*2.2))*life); if(R<5) continue;
    const x=g5(cx+Math.cos(a)*d), y=g5(cy+Math.sin(a)*d*0.55-u*60); circ(c,x,y,R,k%3?'#B9B6AC':'#E2D3B8'); circ(c,x-R*0.3,y-R*0.3,R*0.5,'#F2E8D5'); } };
const flashW=(c,t,t0,n)=>{ if(t>=t0&&t<t0+(n||2)/30) rect(c,0,0,W,H,'#F2E8D5'); };
const spark=(c,x,y,t,t0)=>{ if(t>=t0&&t<t0+0.15){ rect(c,x-30,y-5,60,10,'#FFF8EC'); rect(c,x-5,y-30,10,60,'#FFF8EC'); rect(c,x-15,y-15,30,30,'#F2D27A'); } };
// readable leaves (v2): 12x5 px pixel leaves with outline; cut in two at tc, halves fly apart with a white slice line
function bigLeaf(c,x,y,cut,u,dir){ const L=[[0,10],[10,0],[40,-10],[60,0],[40,12],[10,14]];
  const draw=(dx,dy,half)=>{ c.save(); c.translate(g5(x+dx),g5(y+dy)); c.scale(2.6,2.6); poly(c,L.map(p=>[p[0]-32,p[1]]).map(p=>[p[0]+(-5),p[1]]),'#0E1020');
    const pts=[[-27,5],[-22,0],[3,-7],[22,0],[3,8],[-22,9]]; poly(c,pts,'#46613F'); poly(c,[[-22,0],[3,-7],[22,0],[3,1]],'#7C9A6E'); rect(c,-25,2,45,3,'#22382A'); c.restore(); };
  if(!cut){ draw(0,0); return; }
  c.save(); c.beginPath(); c.rect(x-200,y-200,200,400); c.clip(); draw(-u*80*dir,-u*40+u*u*300); c.restore();
  c.save(); c.beginPath(); c.rect(x,y-200,200,400); c.clip(); draw(u*80*dir,u*20+u*u*340); c.restore();
  if(u<0.12) rect(c,x-5,y-90,10,180,'#FFF8EC'); }
// ======================= ACT I =======================
// S04 16.33–18.60 (continuity fix): Jay stays SEATED at the same counter spot as S02; on the poof he turns to the shelf, hand to the hilt
shot('S04',16.33,18.60,(c,t)=>F.izakaya(c,t,{t0:16.33,cam:[-260,-240,0,2.2],bell:17.18,thief:[17.3,18.1,700,1900],jay:{mode:'fn',fn:(c,t)=>{
  const tr=17.32; if(t<tr){ Ja(c,'chew',t,16.33,820,850,1,null,'L'); return [820+22*5,850-46*5]; }
  const k=SPR.frameAt('L','react_seat',t,tr); J(c,'react_seat',k,820,850,k===0?1:-1,null,'L'); }}}));
// S05 18.60–20.72: wide torii run → 4-frame flash of the leader (his hood silhouette, red eyes, red knot) → medium run (L)
shot('S05',18.60,20.72,(c,t)=>{ const lt=t-18.60;
  if(t<19.754){ E.toriiTunnel(c,t,lt*900,{}); Ja(c,'run',t,18.6,760,880,1); }
  else if(t<19.754+4/30){ rect(c,0,0,W,H,'#F2E8D5'); J(c,'hold',0,960,GY,-1,'sil','KL'); }
  else { E.zoom(c,1.5,900,620,()=>E.toriiTunnel(c,t,lt*1300,{})); Ja(c,'run',t,18.6,820,GY,1,null,'L'); } },{k:'wipe',d:0.5});
// corner set (no figures) for the medium mask shot
function cornerBG(c,t,sn){ E.sky(c,P.night); E.stars(c,t,6,40,560,['#F2E8D5','#4A5378']); E.moon(c,420,190,110,{}); E.roofRow(c,-120,520,0.7,10,P.night3,null,P.night3,31);
  rect(c,0,700,W,380,sn?'#B9B6AC':'#2A3150'); const bx=1120; rect(c,bx,240,W-bx,600,'#3B3047'); rect(c,bx,240,40,600,'#2D2436'); c.fillStyle='#2A2133'; for(let x=bx+70;x<W;x+=18) c.fillRect(x,380,6,380);
  poly(c,[[bx-60,250],[W,170],[W,250],[bx-30,300]],P.ink); c.save(); c.translate(bx+360,420); rect(c,-30,-120,60,10,P.ink); E.lantern(c,0,0,52,P.ochre,P.ochreS,P.ochreS); c.restore(); }
// S06 20.72–22.87: medium — he pulls the mask up at the corner (L), then the wide blowgun
shot('S06',20.72,22.87,(c,t)=>{ if(t<21.3){ E.zoom(c,1.7,1000,700,()=>cornerBG(c,t,false)); Ja(c,'react_mask',t,20.72,840,GY,-1,null,'L'); }
  else F.corner(c,t,{t0:20.72,tBlow:21.86,target:{kind:'run',t0:20.72,tp:22.3}}); });
// ======================= ACT II =======================
// medium train roof: the same set lowered so the roof sits under the L feet line
function trainMed(c,t,scroll,sn){ rect(c,0,0,W,H,'#1C2238'); c.save(); c.translate(0,175); E.trainRun(c,t,scroll,{snow:sn}); c.restore(); rect(c,0,0,W,175,'#1C2238'); E.stars(c,t,23,30,175,['#F2E8D5']); }
const PH=(()=>{ const off=(t)=>((t*1400)%1640); return (870-off(36.5-28.49)+16400)%1640; })();
// S09 28.49–32.97: wide establishing → medium: Jay (L) runs, throws ahead at the thief (out of frame right)
shot('S09',28.49,32.97,(c,t)=>{ if(t<30.5) F.trainChase(c,t,{t0:28.49,base:28.49,ph:PH,jayX:560,chase:[{x:1560,face:1,remap:'shadow',bell:true,ph:0.1}]});
  else { const sc=(t-28.49)*1400+PH; trainMed(c,t,sc,false); if(t>=30.75&&t<30.75+22/30) Ja(c,'throw',t,30.75,700,GY,1,null,'L'); else Ja(c,'run',t,28.49,700,GY,1,null,'L');
    const u=inv(30.98,31.4,t); if(u>0&&u<1) fxW(c,'shuriken',Math.floor(t*15)%2,g5(lerp(900,2000,u)),GY-310,1); } },{k:'mosaic',d:0.6});
// S10 32.97–35.75 medium two-shot: thief (L) throws back, Jay deflects with a slash spark, thief poofs; 35.75–37.22 wide somersault over the gap
shot('S10',32.97,37.22,(c,t)=>{ if(t>=35.75) return F.trainChase(c,t,{t0:32.97,base:28.49,ph:PH,jayX:400,jumpT:35.92,jumpDX:380});
  const sc=(t-28.49)*1400+PH; trainMed(c,t,sc,false); const jx=520, sx=1450;
  if(t>=33.62&&t<33.62+43/30) Ja(c,'slash',t,33.62,jx,GY,1,null,'L'); else Ja(c,'run',t,32.97,jx,GY,1,null,'L');
  if(t<35.1){ if(t>=33.4&&t<33.4+22/30) Ja(c,'throw',t,33.4,sx,GY,-1,'shadow','L'); else Ja(c,'run',t,32.9,sx,GY,-1,'shadow','L'); bellAt(c,sx-60,GY-300,t); }
  poof(c,sx,GY-250,t,35.1); poof(c,sx-60,GY-150,t,35.15);
  const u=inv(33.62,33.62+19/30,t); if(u>0&&u<1) fxW(c,'shuriken',Math.floor(t*15)%2,g5(lerp(sx-120,jx+240,u)),GY-330,1); spark(c,jx+250,GY-330,t,33.62+19/30); });
// S11 37.22–39.37: wide landing on the roof (train lights recede) → medium thinking seal (L)
shot('S11',37.22,39.37,(c,t)=>{ if(t<38.05) return F.rooftop(c,t,{t0:37.22,train:true,jay:(c,t)=>{ if(t<37.4) Ja(c,'land',t,37.13,900,752,1); else Ja(c,'idle',t,37.4,900,752,-1); }});
  E.castleRoof(c,t,0,{plain:true,moonX:1350,moonR:200,ridgeY:938}); Ja(c,'seal',t,38.05,900,GY,-1,null,'L'); F.leaves(c,t,31,10,{}); },{k:'dissolve',d:0.5});
// S12 39.37–41.56: medium — two frustrated slashes (L) that cut big, readable falling leaves in half
shot('S12',39.37,41.56,(c,t)=>{ E.castleRoof(c,t,0,{plain:true,moonX:520,moonR:240,ridgeY:938});
  const jx=920; const s1=39.5, s2=40.85;
  if(t<s1) Ja(c,'idle',t,39.37,jx,GY,1,null,'L'); else if(t<s2) Ja(c,'slash',t,s1,jx,GY,1,null,'L'); else Ja(c,'slash',t,s2,jx,GY,-1,null,'L');
  for(const [ts,dir] of [[s1,1],[s2,-1]]){ const tc=ts+19/30; const x=jx+dir*300, yc=GY-300; const fall=inv(tc-1.3,tc,t);
    if(t<tc){ if(fall>0) bigLeaf(c,x+Math.sin(fall*5)*30,lerp(-40,yc,fall),false); } else { const u=inv(tc,tc+0.9,t); if(u<1) bigLeaf(c,x,yc,true,u,dir); } }
  F.leaves(c,t,23,10,{}); });
// S14 44.03–46.02 (now a dissolve: time jump from the seated ikebana)
shot('S14',44.03,46.02,(c,t)=>F.room(c,t,{t0:44.03,table:false,noSword:true,jay:(c,t)=>F.bowJay(c,t,44.03,45.02,45.9,1000)}),{k:'dissolve',d:0.4});
// S15 46.02–50.55: wide walk-in → low-angle medium of the LEADER on the wall with the bell → Jay (L) points as the petals freeze
function wallLow(c,t,fz){ E.sky(c,P.night); E.stars(c,t,8,60,700,['#F2E8D5','#4A5378','#EBA9A5']); E.moon(c,1300,300,170,{});
  E.sakuraCanopy(c,200,250,380,9,{M:P.sakura,S:P.sakuraS,L:P.sakuraL,B:P.woodS}); rect(c,0,938,W,142,'#D9CDB4'); rect(c,0,930,W,14,P.ink2); rect(c,0,990,W,90,'#C9BFA8'); F.petals(c,t,5,90,{freeze:fz}); }
shot('S15',46.02,50.55,(c,t)=>{ const fz=49.737;
  if(t<48.3) return F.sakura(c,t,{t0:46.02,walkFrom:620,stop:860,walkEnd:48.3,lead:99,fz});
  if(t<49.16){ wallLow(c,t,fz); poof(c,1150,GY-250,t,48.25); if(t>=48.3){ Ja(c,'hold',t,48.3,1150,GY,-1,null,'KL'); bellAt(c,1150-90,GY-290,t); } return; }
  E.zoom(c,1.6,860,760,()=>F.sakura(c,t<fz?t:fz,{t0:46.02,walkFrom:860,stop:860,walkEnd:46.03,lead:999,fz:999,noJay:true}));
  F.petals(c,t,41,60,{freeze:fz}); const tp=fz-5/30; if(t<tp) Ja(c,'idle',t,49.16,800,GY,1,null,'L'); else Ja(c,'point',t,tp,800,GY,1,null,'L'); },{k:'mosaic',d:0.6});
// S16 50.55–55.10: wide rooftop run → medium: ambush, slash (L vs L), the second shadow's smoke bomb (shorter)
shot('S16',50.55,55.10,(c,t)=>{ const lt=t-50.55;
  if(t<52.0){ const camX=g5(lt*520); E.castleRoof(c,t,camX,{plain:true,moonX:600,moonR:150,ridgeY:760}); c.save(); c.translate(-camX,0); Ja(c,'run',t,50.55,600+lt*520,752,1); poof(c,1700,642,t,51.7); if(t>=51.75) Ja(c,'idle',t,51.75,1700,752,-1,'shadow'); c.restore(); return; }
  E.castleRoof(c,t,0,{plain:true,moonX:1500,moonR:180,ridgeY:938}); const jx=640, s1=1180, s2=1620, tc=52.4+19/30;
  if(t<52.4) Ja(c,'idle',t,52.0,jx,GY,1,null,'L'); else { const st=inv(52.4+12/30,tc,t); Ja(c,'slash',t,52.4,g5(jx+st*160),GY,1,null,'L'); }
  if(t<tc) Ja(c,'idle',t,52.0,s1,GY,-1,'shadow','L'); poof(c,s1,GY-250,t,tc); spark(c,s1-40,GY-260,t,tc);
  poof(c,s2,GY-250,t,52.25); if(t>=52.3){ if(t<54.1) Ja(c,'idle',t,52.3,s2,GY,-1,'shadow','L'); else Ja(c,'throw',t,54.1,s2,GY,-1,'shadow','L'); }
  F.smoke(c,t,54.45,jx+300,GY-260,{seed:11}); });
// story scroll v2: the pupils' RED scarves are the only colour in the ink (the shared mark); master ties them on
function scroll2(c,t,o){ const lt=t-o.t0; const [x0,y0,w,h]=E.scroll(c,t); const pan=g5(lt*30); const GYs=y0+h-80;
  const draw=()=>{ c.save(); c.translate(-pan,0);
    if(o.mode==='oath'){ J(c,'seiza',0,560,GYs,1,'ink','L'); const q=seq([['bow',0,10],['bow',1,4],['bow',2,40],['bow',1,4],['bow',0,80]],t,o.t0+0.4);
      J(c,q[0],q[1],1040,GYs,-1,'inkred'); J(c,q[0],q[1],1280,GYs,-1,'inkred'); F.fxW(c,'bell',0,810,GYs-30,1,'ink'); }
    else { const s1=SPR.frameAt('M','slash',t,o.t0+0.3+Math.floor(Math.max(0,lt-0.3)/1.5)*1.5), s2=SPR.frameAt('M','slash',t,o.t0+0.45+Math.floor(Math.max(0,lt-0.45)/1.5)*1.5);
      J(c,'slash',lt<0.3?0:s1,760,GYs,1,'inkred'); if(t<o.turn) J(c,'slash',lt<0.45?0:s2,1240,GYs,-1,'inkred'); else J(c,'slash',s2,1240,GYs,-1,'sil','K'); }
    c.restore(); };
  if(o.cut&&t>=o.cut){ const u=eo(inv(o.cut,o.cut+0.5,t)); const diag=(s)=>{ c.beginPath(); if(s<0){ c.moveTo(0,0); c.lineTo(1100,0); c.lineTo(820,H); c.lineTo(0,H); } else { c.moveTo(1100,0); c.lineTo(W,0); c.lineTo(W,H); c.lineTo(820,H); } c.closePath(); };
    rect(c,0,0,W,H,'#1C2238'); for(const s of [-1,1]){ c.save(); diag(s); c.clip(); c.translate(g5(s*u*40),g5(s*u*30)); rect(c,x0,y0,w,h,'#F2E8D5'); rect(c,x0,y0,w,30,'#E2D3B8'); rect(c,x0,y0+h-30,w,30,'#E2D3B8'); draw(); c.restore(); }
    if(t<o.cut+0.1) poly(c,[[1095,0],[1110,0],[825,H],[810,H]],'#FFF8EC'); } else draw();
  if(o.burn&&t>=o.burn){ const u=inv(o.burn,o.burn+1.6,t); const fx=g5(lerp(x0+w,x0+w*0.55,u)); const r=mulberry(Math.floor(t*12));
    rect(c,fx,y0-60,x0+w-fx+80,h+120,'#1C2238'); for(let y=y0;y<y0+h;y+=10){ const j=g5(r()*40); rect(c,fx-j-10,y,j+10,10,'#D8402F'); rect(c,fx-j-20,y,10,10,'#D9A441'); if(r()<0.3) rect(c,fx+g5(r()*120),y-g5(r()*80),5,5,'#D9A441'); } } }
F.scroll2=scroll2;
shot('S17',55.10,59.62,(c,t)=>scroll2(c,t,{t0:55.10,mode:'oath',cut:57.934}),{k:'dissolve',d:0.6});
// S18 59.62–64.16: medium (L) — the seal and the palette-step fade; only the red scarf is left, then the wind takes it
shot('S18',59.62,64.16,(c,t)=>{ E.castleRoof(c,t,0,{plain:true,moonX:960,moonR:300,ridgeY:938}); const x=900, st=[60.209,60.767,61.324,61.881];
  const lv=st.filter(q=>t>=q).length; const R=[null,'fade1','fade2','fade3','fade3'][lv];
  if(lv<4){ if(t<59.95) Ja(c,'idle',t,59.62,x,GY,1,null,'L'); else Ja(c,'seal',t,59.95,x,GY,1,R,'L'); }
  else { const u=t-61.881; const k=SPR.frameAt('L','seal',61.881,59.95); if(u<1.6) J(c,'seal',k,g5(x+u*u*700),g5(GY-u*260),1,'fade3','L'); }
  F.petals(c,t,17,40,{wind:120}); });
// S19 64.16–72.90: bamboo duel — wide, with a MEDIUM insert for the landing slash (66.70–68.30)
const bambooWide=F.SHOTS.find(s=>s.id==='S19')||null;
function bambooMed(c,t){ const lt=t-64.157; E.sky(c,'#1C2238'); E.moon(c,1450,200,150,{});
  E.zoom(c,1.8,1100,600,()=>{ const r=mulberry(8); for(let k=0;k<10;k++){ const x=k*230+r()*60; E.bamboo(c,x,-20,H,62,P.mossS,'#3A5234','#2F452B',false); } rect(c,0,900,W,180,'#1C262B'); });
  const tS0=0.9+37/30+16/30, tCut=tS0+19/30; const jx=760, sx=1220;
  Ja(c,'slash',lt,tS0,g5(jx+inv(tS0+12/30,tCut,lt)*120),GY,1,null,'L');
  if(lt<tCut+0.03){ if(lt<tCut-0.35) Ja(c,'idle',lt,0.3,sx,GY,-1,'shadow','L'); else J(c,'slash',2,sx,GY,-1,'shadow','L'); }
  poof(c,sx,GY-250,lt,tCut+0.04); spark(c,sx-40,GY-280,lt,tCut); F.leaves(c,lt,19,16,{}); }
shot('S19',64.16,72.90,(c,t)=>{ if(t>=66.70&&t<68.30) return bambooMed(c,t); return F.bambooFn(c,t); },{k:'dissolve',d:0.6});
// S20 72.90–81.39: moon hill — wide approach, shot/reverse-shot medium silhouettes, wide clash,
// XL CLOSE: Jay on one knee, hurt (snow begins), the leader small on the crest behind him vanishes with the bell; wide: he rises alone
function hillMed(c,t,mx){ E.zoom(c,1.6,mx,700,()=>E.moonHill(c,t)); }
shot('S20',72.90,81.39,(c,t)=>{ const tc=76.603;
  if(t<74.5){ E.moonHill(c,t); const u=inv(72.9,74.5,t); Ja(c,'run',t,72.9,g5(lerp(-130,700,u)),790,1,'sil'); Ja(c,'run',t,72.9,g5(lerp(2050,1220,u)),790,-1,'sil','K'); return; }
  if(t<75.2){ hillMed(c,t,760); Ja(c,'idle',t,74.5,760,GY,1,'sil','L'); return; }
  if(t<75.9){ hillMed(c,t,1160); Ja(c,'idle',t,75.2,1160,GY,-1,'sil','KL'); return; }
  if(t<77.2){ E.moonHill(c,t); const GYh=790;
    let u=inv(75.9,tc,t), lx,ly,jx,jy; if(t<tc){ lx=g5(lerp(1220,1010,u)); jx=g5(lerp(700,910,u)); ly=jy=GYh-Math.sin(u*Math.PI*0.5)*180; J(c,'jump',Math.min(6,SPR.frameAt('M','jump',t,75.9)),lx,ly,-1,'sil','K'); J(c,'jump',Math.min(6,SPR.frameAt('M','jump',t,75.9)),jx,jy,1,'sil'); }
    else { u=inv(tc,77.2,t); lx=g5(lerp(1010,1250,u)); ly=GYh-Math.sin((0.5+u*0.5)*Math.PI)*180; jx=g5(lerp(910,690,u)); jy=GYh-Math.sin((0.5+u*0.5)*Math.PI)*180+u*20; J(c,'jump',6,lx,ly,-1,'sil','K'); J(c,'down',0,jx,jy,1,'sil'); }
    if(t>=tc&&t<tc+0.45) fxW(c,'poof',SPR.frameAt('FX','poof',t,tc),960,GYh-260,1); flashW(c,t,tc,2); return; }
  if(t<79.4){ hillMed(c,t,900); // close: the defeat
    if(t<78.878){ Ja(c,'hold',t,77.2,1500,700,-1,'sil','K'); bellAt(c,1440,530,t); } poof(c,1500,590,t,78.878);
    Ja(c,'hurt',t,77.2,760,GY,1,null,'XL'); E.snow(c,t,101,Math.floor(Math.min(120,(t-77)*40)),{calm:1}); return; }
  E.moonHill(c,t); const GYh=790; if(t<80.5) J(c,'down',1,690,GYh,1,'sil'); else Ja(c,'idle',t,80.5,690,GYh,1,'sil'); E.snow(c,t,101,120,{calm:1}); },{k:'flash'});
// ======================= ACT III =======================
// S23 86.53–91.05: seiza in the room (L) → XL close: eyes open on 「叫做禅」, brows set
shot('S23',86.53,91.05,(c,t)=>{ if(t<89.2) return F.room(c,t,{t0:86.53,snow:true,table:false,pan:[0,-60,4.5],jay:(c,t)=>J(c,'seiza',0,1050,960,1,null,'L')});
  E.zoom(c,1.7,1250,620,()=>F.room(c,t,{t0:86.53,snow:true,table:false,jay:()=>{}})); const q=t<90.2?0:(t<90.4?1:2); J(c,'resolve',q,820,GY,1,null,'XL');
  const r=mulberry(3); for(let k=0;k<5;k++){ const ph=((t*0.4+k/5)%1); rect(c,g5(560+Math.sin(ph*7+k)*20),g5(880-ph*400),5,10,'#E2D3B8'); } },{k:'dissolve',d:0.6});
// S24 91.05–93.18: torii in snow — medium walk (L); flash of the castle
shot('S24',91.05,93.18,(c,t)=>{ const lt=t-91.05; E.zoom(c,1.5,900,620,()=>E.toriiTunnel(c,t,lt*330,{snow:true})); Ja(c,'walk',t,91.05,860,GY,1,null,'L'); E.snow(c,t,121,110,{});
  if(t>=92.206&&t<92.206+4/30){ rect(c,0,0,W,H,'#F2E8D5'); E.castle(c,t,960,900,1.3,{wall:'#4A2A1C',roof:'#4A2A1C',stone:'#4A2A1C'}); } });
const PH2=(()=>{ const off=(t)=>((t*1400)%1640); return (870+300-off(108.5-100.94)+16400)%1640; })();
// S28 100.94–105.42: wide (three shadows chase him) → medium: two shadows (L) behind, one throws, Jay deflects
shot('S28',100.94,105.42,(c,t)=>{ if(t<102.6) return F.trainChase(c,t,{t0:100.94,base:100.94,ph:PH2,jayX:1300,snow:true,chase:[{x:300,face:1,remap:'shadow',ph:0.1},{x:520,face:1,remap:'shadow',ph:0.2},{x:120,face:1,remap:'far',ph:0.05}]});
  const sc=(t-100.94)*1400+PH2; trainMed(c,t,sc,true); const jx=1300;
  Ja(c,'run',t,100.9,380,GY,1,'shadow','L'); if(t>=103.2&&t<103.2+22/30) Ja(c,'throw',t,103.2,720,GY,1,'shadow','L'); else Ja(c,'run',t,100.95,720,GY,1,'shadow','L');
  if(t>=103.25&&t<103.25+43/30) Ja(c,'slash',t,103.25,jx,GY,-1,null,'L'); else Ja(c,'run',t,100.94,jx,GY,1,null,'L');
  const u=inv(103.43,103.25+19/30,t); if(u>0&&u<1) fxW(c,'shuriken',Math.floor(t*15)%2,g5(lerp(820,jx-240,u)),GY-320,1); spark(c,jx-250,GY-320,t,103.25+19/30); E.snow(c,t,61,90,{wind:600}); },{k:'mosaic',d:0.6});
// S29 105.42–109.44: medium — he throws his own smoke back (shorter cloud), the shadows are lost; wide somersault over the gap
shot('S29',105.42,109.44,(c,t)=>{ if(t>=107.85) return F.trainChase(c,t,{t0:105.42,base:100.94,ph:PH2,jayX:1000,snow:true,jumpT:107.92,jumpDX:300});
  const sc=(t-100.94)*1400+PH2; trainMed(c,t,sc,true); const jx=1250;
  for(const [x,tp,ph] of [[420,107.0,0.1],[760,107.1,0.2]]){ if(t<tp) Ja(c,'run',t,100.9+ph,x,GY,1,'shadow','L'); poof(c,x,GY-250,t,tp); }
  if(t>=106.3&&t<106.3+22/30) Ja(c,'throw',t,106.3,jx,GY,-1,null,'L'); else Ja(c,'run',t,105.42,jx,GY,1,null,'L');
  F.smoke(c,t,106.55,700,GY-240,{seed:7}); E.snow(c,t,61,90,{wind:600}); });
// S30 109.44–111.66: medium — the plan (L seal) under the looming castle
shot('S30',109.44,111.66,(c,t)=>{ E.sky(c,'#1C2238'); E.stars(c,t,41,70,800,['#F2E8D5','#4A5378']); E.moon(c,1500,200,120,{});
  poly(c,[[-100,1080],[-100,760],[600,700],[1400,700],[2000,760],[2000,1080]],'#22382A'); E.castle(c,t,1250,860,1.9,{snow:true,banners:()=>1});
  rect(c,-100,938,2100,200,'#43475A'); rect(c,-100,930,2100,14,'#F2E8D5');
  if(t<110.0) Ja(c,'idle',t,109.44,560,GY,1,null,'L'); else Ja(c,'seal',t,110.0,560,GY,1,null,'L'); E.snow(c,t,131,110,{}); },{k:'dissolve',d:0.5});
// S31 111.66–113.98: medium — one clean cut through a big stalk (L)
shot('S31',111.66,113.98,(c,t)=>{ E.sky(c,'#1C2238'); E.moon(c,1400,200,130,{});
  const r=mulberry(8); for(let k=0;k<9;k++){ const x=k*230+r()*60-40; E.bamboo(c,x,-20,H,40,'#3E5A4C','#344D41','#2D4439',false); rect(c,x-25,300+r()*300,50,10,'#F2E8D5'); }
  rect(c,0,938,W,142,'#E2D3B8'); rect(c,0,930,W,10,'#F2E8D5');
  const ts=112.4, tc=ts+19/30, bx=1240;
  if(t<tc) E.bamboo(c,bx,-20,935,90,P.mossS,'#3A5234','#2F452B',false);
  else { E.bamboo(c,bx,640,935,90,P.mossS,'#3A5234','#2F452B',true); const u=inv(tc,tc+0.9,t); c.save(); c.translate(g5(bx+u*160),g5(320+u*u*600)); c.rotate(Math.round(u*5)/10); E.bamboo(c,0,-340,320,90,P.mossS,'#3A5234','#2F452B',false); c.restore(); if(u<0.12) rect(c,bx-120,630,240,10,'#FFF8EC'); }
  if(t<ts) Ja(c,'idle',t,111.66,980,GY,1,null,'L'); else Ja(c,'slash',t,ts,980,GY,1,null,'L'); E.snow(c,t,141,110,{}); });
// S33 116.49–118.45: bows, then XL CLOSE — the mask goes up
shot('S33',116.49,118.45,(c,t)=>{ if(t<117.7) return F.room(c,t,{t0:116.49,table:false,noSword:true,snow:true,jay:(c,t)=>F.bowJay(c,t,116.49,117.36,117.65,1000)});
  E.zoom(c,1.8,500,520,()=>F.room(c,t,{t0:116.49,table:false,noSword:true,snow:true,jay:()=>{}})); Ja(c,'mask_pull',t,117.7,1000,GY,-1,null,'XL'); },{k:'dissolve',d:0.4});
// ======================= CLIMAX (re-staged) =======================
const stage=(c,t,o={})=>E.castleRoof(c,t,o.cam||0,{snow:true,moonX:o.moonX||1300,moonR:o.moonR||200,ridgeY:o.ridge||938});
const nearTiles=(c,t,cam)=>{ const off=g5(((cam*1.6)%160+160)%160); for(let x=-off-160;x<W+160;x+=160){ rect(c,x,1010,120,80,'#1C2238'); rect(c,x,1010,120,10,'#3E4E86'); } }; // foreground parallax layer
// S34 118.45–123.00
shot('S34',118.45,123.00,(c,t)=>{ const fz=122.195, un=122.0+19/30;
  if(t<119.9){ const u=inv(118.45,119.9,t); E.castleLow(c,t,{snow:true,tilt:-u*60,par:u*300}); // LOW ANGLE: he leaps up the eaves
    const q=seq(F.JUMP,t,118.6); const p=clamp((t-118.8)/1.0,0,1); J(c,q[0],q[1],g5(lerp(380,980,p)),g5(lerp(900,560,p)-Math.sin(p*Math.PI)*160),1); E.snow(c,t,151,70,{}); return; }
  if(t<121.6){ E.ridgeMoon(c,t,{snow:true}); // RIDGE SILHOUETTE: the two pupils face each other across the moon
    Ja(c,'idle',t,119.9,640,930,1,'sil'); Ja(c,'hold',t,119.9,1320,930,-1,'sil','K'); bellAt(c,1260,760,t); F.petals(c,t,23,60,{}); return; }
  if(t<fz){ stage(c,t,{moonX:700,moonR:260}); Ja(c,'hold',t,121.6,1100,GY,-1,null,'KL'); bellAt(c,1010,GY-290,t); F.petals(c,t,23,70,{}); nearTiles(c,t,0); return; }  // the leader, medium
  // the freeze, and Jay's slash breaking it (medium)
  const frozen=t<un; stage(c,t,{moonX:1500,moonR:240}); Ja(c,'slash',t,122.0,820,GY,1,null,'L'); F.petals(c,frozen?fz:t,23,90,{freeze:frozen?fz:null,wind:frozen?20:500}); E.snow(c,frozen?fz:t,151,60,{}); flashW(c,t,un,2); },{k:'mosaic',d:0.6});
// S35 123.00–127.55: the ATTIC fight — beams, moon shafts, foreground beam parallax; alternate medium / wide / medium / leader
shot('S35',123.00,127.55,(c,t)=>{ const cam=(t-123)*60;
  if(t<124.75){ E.attic(c,t,{cam}); const jx=760, sx=1180, tc=123.6+19/30;
    if(t<123.6) Ja(c,'idle',t,123,jx,GY,1,null,'L'); else Ja(c,'slash',t,123.6,g5(jx+inv(123.6+12/30,tc,t)*120),GY,1,null,'L');
    if(t<tc) Ja(c,'idle',t,123,sx,GY,-1,'shadow','L'); poof(c,sx,GY-250,t,tc); poof(c,sx,GY-250,t,122.98); spark(c,sx-40,GY-280,t,tc); E.atticFG(c,t,cam); return; }
  if(t<125.6){ E.attic(c,t,{cam:-300}); // wide: a shadow crouched on the high beam, the shuriken (M sprites = wide)
    Ja(c,'throw',t,124.75,600,GY,1); const tr=124.75+7/30, th=tr+0.35; if(t<th) Ja(c,'crouch',t,124,1380,362,-1,'shadow'); poof(c,1380,300,t,th);
    const u=inv(tr,th,t); if(u>0&&u<1) fxW(c,'shuriken',Math.floor(t*15)%2,g5(lerp(700,1370,u)),g5(lerp(770,320,u)),1); return; }
  if(t<126.45){ E.attic(c,t,{cam:cam+40}); Ja(c,'look',t,125.6,960,GY,1,null,'L'); // two drop from the beams
    for(const [x,t0,f] of [[520,125.75,1],[1420,125.85,-1]]){ const u=clamp((t-t0)/0.35,0,1); if(t>=t0) J(c,'land',u<1?0:SPR.frameAt('L','land',t,t0+0.35),x,g5(lerp(300,GY,u*u)),f,'shadow','L'); } E.atticFG(c,t,cam); return; }
  stage(c,t,{moonX:400,moonR:220}); Ja(c,'throw',t,126.45,1150,GY,-1,null,'KL'); F.smoke(c,t,126.7,800,GY-260,{seed:13}); nearTiles(c,t,(t-126)*200); });
// S36 127.55–132.08: the burning-scroll room — pupils in ink with red scarves; XL REVEAL: the hood tears, the same red knot; the scroll burns
function scrollOnWall(o){ return (c,t)=>{ c.save(); c.translate(960,500); c.scale(0.62,0.62); c.translate(-960,-540); scroll2(c,t,o); c.restore(); }; }
shot('S36',127.55,132.08,(c,t)=>{
  if(t<129.823){ E.zoom(c,1.25,960,520,()=>E.attic(c,t,{cam:0,scroll:scrollOnWall({t0:127.55,mode:'twist',turn:999})})); return; }
  if(t<131.0){ E.attic(c,t,{cam:200,candle:false}); E.dither(c,0,0,W,H,'#6E1A1E',f=>0.12); const torn=t>=130.0;
    J(c,torn?'reveal':'hood',SPR.frameAt('KXL','hood',t,129.823),1060,GY,-1,null,'KXL'); bellAt(c,1060-27*5,GY-87*5,t); flashW(c,t,130.0,2); return; }
  E.zoom(c,1.25,960,520,()=>E.attic(c,t,{cam:0,scroll:scrollOnWall({t0:127.55,mode:'twist',turn:129.823,burn:130.6})})); },{k:'dissolve',d:0.6});
// S37 132.08–136.57: vanishing as a technique (L, fades on the counts) → the leader searches (KL) → Jay reappears behind him
shot('S37',132.08,136.57,(c,t)=>{ const st=[132.656,133.213,133.77,134.351];
  if(t<134.35){ stage(c,t,{moonX:1250,moonR:230}); const lv=st.filter(q=>t>=q).length; const R=[null,'fade1','fade2','fade3','fade3'][lv];
    if(t<132.3) Ja(c,'idle',t,132.08,860,GY,1,null,'L'); else Ja(c,'seal',t,132.3,860,GY,1,R,'L'); F.petals(c,t,29,40,{}); return; }
  if(t<135.45){ stage(c,t,{moonX:600,moonR:260}); const f=t<134.75?-1:(t<135.1?1:-1); Ja(c,'look',t,134.35,1000,GY,f,null,'KL'); bellAt(c,1000+f*90,GY-290,t); F.petals(c,t,29,40,{}); nearTiles(c,t,0); return; }
  stage(c,t,{moonX:600,moonR:260}); Ja(c,'look',t,134.35,800,GY,-1,null,'KL'); bellAt(c,710,GY-290,t); poof(c,1300,GY-250,t,135.42); if(t>=135.488) J(c,'slash',t<135.8?0:1,1300,GY,-1,null,'L'); nearTiles(c,t,0); },{k:'flash'});
// S38 136.57–145.64: the clones — medium (L clones appear on the counts) → wide 8 → ridge silhouettes leaping → close on the leader
shot('S38',136.57,145.64,(c,t)=>{ const cnt=D.counts.filter(q=>q.t>=136.57&&q.t<=t);
  if(t<138.88){ stage(c,t,{moonX:960,moonR:320}); const lf=cnt.length%2?1:-1; Ja(c,'look',t,136.57,960,GY,lf,null,'KL'); bellAt(c,960+lf*90,GY-290,t);
    const sp=[[420,1,136.58],[1500,-1,137.183],[620,1,137.741],[1300,-1,138.298]]; sp.forEach(([x,f,tb],k)=>{ if(t>=tb+0.1){ if(k%2) J(c,'slash',5,x,GY-(k>1?40:0),f,k>1?'far':null,'L'); else Ja(c,'seal',t,tb,x,GY-(k>1?40:0),f,k>1?'far':null,'L'); } poof(c,x,GY-250,t,tb); });
    F.petals(c,t,91,80,{wind:200}); return; }
  if(t<141.12){ return F.clonesWide(c,t); }
  if(t<143.4){ E.ridgeMoon(c,t,{moonR:520,moonY:600}); Ja(c,'hold',t,141.12,960,930,1,'sil','K'); bellAt(c,1020,760,t);
    const xs=[160,380,600,780,1140,1320,1540,1760]; xs.forEach((x,k)=>{ const t0=141.12+k*0.12; const q=seq(F.JUMP,t,t0); const u=clamp((t-t0-0.2)/1.0,0,1); J(c,q[0],q[1],x,g5(930-Math.sin(u*Math.PI)*220),x<960?1:-1,'sil'); });
    F.petals(c,t,91,80,{wind:300}); return; }
  stage(c,t,{moonX:1500,moonR:260}); [[300,1,143.4],[620,1,143.9],[1700,-1,144.4]].forEach(([x,f,tb])=>{ if(t>=tb) Ja(c,'seal',t,tb,x,GY-60,f,'far','L'); poof(c,x,GY-300,t,tb-0.05); });
  Ja(c,'hood',t,143.4,1150,GY,(Math.floor((t-143.4)/0.6)%2)?1:-1,null,'KXL'); F.petals(c,t,91,100,{wind:300}); nearTiles(c,t,0); },{k:'mosaic',d:0.6});
// S39a–c: three slashes: wide roof / medium two-shot / ridge silhouette (the leader breaks into smoke, the bell falls)
shot('S39a',145.64,147.93,(c,t)=>{ stage(c,t,{moonX:1300,moonR:200,ridge:760}); const ts=145.64, tc=ts+19/30; Ja(c,'idle',t,ts,1150,752,-1,null,'K');
  Ja(c,'slash',t,ts,g5(620+inv(ts+12/30,tc,t)*200),752,1); if(t>=tc&&t<tc+3/30) poly(c,[[890,452],[910,452],[1410,732],[1390,732]],'#FFF8EC'); F.petals(c,t,29,80,{wind:300}); E.snow(c,t,171,60,{}); },{k:'flash'});
shot('S39b',147.93,150.19,(c,t)=>{ stage(c,t,{moonX:500,moonR:260}); const ts=147.93, tc=ts+19/30; Ja(c,'look',t,ts,760,GY,1,null,'KL'); bellAt(c,850,GY-290,t);
  Ja(c,'slash',t,ts,g5(1320-inv(ts+12/30,tc,t)*220),GY,-1,null,'L'); if(t>=tc&&t<tc+3/30) poly(c,[[480,480],[500,480],[1040,900],[1020,900]],'#FFF8EC'); F.petals(c,t,29,60,{wind:300}); nearTiles(c,t,(t-ts)*150); },{k:'flash'});
shot('S39c',150.19,151.20,(c,t)=>{ E.ridgeMoon(c,t,{moonR:500}); const ts=150.19-12/30, tc=ts+19/30, gone=150.45;
  if(t<gone) Ja(c,'idle',t,ts,1000,930,-1,'sil','K'); poof(c,1000,820,t,gone); const u=inv(gone,gone+0.7,t); bellAt(c,1000,g5(760+Math.min(1,u)*170),t);
  Ja(c,'slash',t,ts,g5(560+inv(ts+12/30,tc,t)*220),930,1,'sil'); if(t>=tc&&t<tc+3/30) poly(c,[[740,640],[760,640],[1260,900],[1240,900]],'#FFF8EC'); F.petals(c,t,29,80,{wind:300}); },{k:'flash'});
// S40 151.20–152.37: XL CLOSE — he catches the bell, eyes close in relief
shot('S40',151.20,152.37,(c,t)=>{ E.castleRoof(c,t,0,{plain:true,moonX:1250,moonR:320,ridgeY:938}); Ja(c,'catch',t,151.2,860,GY,1,null,'XL');
  const u=inv(151.2,151.45,t); bellAt(c,860+27*5,g5(lerp(GY-700,GY-87*5,eo(u))),t); E.snow(c,t,181,25,{calm:1}); });
})(window);
