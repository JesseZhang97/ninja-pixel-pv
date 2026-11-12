// film_b.js — ACT II shots (pursuit, training, the raid, the first defeat)
(function(G){
const {P,mulberry,hash,clamp,lerp,inv,eio,eo,ei,twos,poly,rect,circ,capsule,blob,seigaiha}=G.K;
const E=G.E, D=G.DATA, SPR=G.SPR, RIG=G.RIG, F=G.FILM; const W=1920,H=1080;
const {g5,seq,J,Ja,fxW,poof,bell,shot}=F;
const FLIPS=[['jump',2,3],['jump',3,3],['jump',4,3],['jump',5,3]];
F.JUMP=[['jump',0,6],['jump',1,3],...FLIPS,...FLIPS,['jump',6,4]]; // 37 ticks: take-off, double somersault, landing reach
// smoke bomb: flat pixel puffs that grow until the frame is covered
F.smoke=(c,t,ts,cx,cy,opt={})=>{ const u=t-ts; if(u<0) return; const life=1-inv(ts+1.0,ts+1.9,t); if(life<=0) return; const r=mulberry(opt.seed||3); for(let k=0;k<28;k++){ const a=r()*6.28, d=r()*900*Math.min(1,u*1.6), R=g5(Math.min(420,(80+r()*120)*(0.4+u*2.2))*life); if(R<5) continue;
  const x=g5(cx+Math.cos(a)*d), y=g5(cy+Math.sin(a)*d*0.6-u*60); circ(c,x,y,R,k%3?'#B9B6AC':'#E2D3B8'); circ(c,x-R*0.3,y-R*0.3,R*0.5,'#F2E8D5'); } };
// moving-train roof chase. o: {t0, jayX, chase:[{x,anim,remap,face}], jumpT, ph}
function trainChase(c,t,o){ const lt=t-o.t0; const scroll=(t-o.base)*1400+o.ph; const sn=o.snow; const tr=E.trainRun(c,t,scroll,{snow:sn}); const GY=755;
  // Jay
  let jx=o.jayX, jy=GY; const JT=o.jumpT;
  if(JT!=null&&t>=JT&&t<JT+37/30){ const q=seq(F.JUMP,t,JT); const u=clamp((t-JT-0.2)/(37/30-0.2),0,1); jx=g5(o.jayX+u*o.jumpDX); jy=GY-Math.sin(u*Math.PI)*260; J(c,q[0],q[1],jx,jy,1); }
  else if(JT!=null&&t>=JT+37/30){ jx=o.jayX+o.jumpDX; Ja(c,'land',t,JT+37/30,jx,GY,1); }
  else if(o.throwT!=null&&t>=o.throwT&&t<o.throwT+22/30) Ja(c,'throw',t,o.throwT,jx,GY,o.throwFace||1);
  else if(o.slashT!=null&&t>=o.slashT&&t<o.slashT+43/30) Ja(c,'slash',t,o.slashT,jx,GY,1);
  else Ja(c,'run',t,o.t0,jx,GY,1);
  (o.chase||[]).forEach(s=>{ if(s.until!=null&&t>=s.until){ poof(c,s.x,GY-110,t,s.until); return; } if(s.from!=null&&t<s.from) return;
    if(s.throwT!=null&&t>=s.throwT&&t<s.throwT+22/30) Ja(c,'throw',t,s.throwT,s.x,GY,s.face,s.remap); else Ja(c,'run',t,o.t0+(s.ph||0),s.x,GY,s.face,s.remap);
    if(s.bell) bell(c,s.x+s.face*60,GY-200,t); if(s.from!=null) poof(c,s.x,GY-110,t,s.from); });
  // projectiles: [t0,t1,x0,x1,y]
  (o.shots||[]).forEach(p=>{ const u=inv(p[0],p[1],t); if(u>0&&u<1) fxW(c,'shuriken',Math.floor(t*15)%2,g5(lerp(p[2],p[3],u)),p[4],1); if(p[5]&&t>=p[1]&&t<p[1]+0.15){ rect(c,p[3]-20,p[4]-5,40,10,'#FFF8EC'); rect(c,p[3]-5,p[4]-20,10,40,'#FFF8EC'); } });
  if(o.smokeT) F.smoke(c,t,o.smokeT,o.smokeX||400,GY-120,{seed:7});
  if(sn) E.snow(c,t,61,110,{wind:600});
}
F.trainChase=trainChase;
const PH=(()=>{ const off=(t)=>((t*1400)%1640); return (870-off(36.5-28.49)+16400)%1640; })();
// S09 28.49–32.97: train-roof chase, wide; the thief ahead with the bell; Jay throws, it misses (ducked)
shot('S09',28.49,32.97,(c,t)=>trainChase(c,t,{t0:28.49,base:28.49,ph:PH,jayX:560,throwT:30.75,
  chase:[{x:1560,face:1,remap:'shadow',bell:true,ph:0.1}],shots:[[30.98,31.5,660,1700,640]]}),{k:'mosaic',d:0.6});
// S10 32.97–37.22: tighter — it throws back, Jay deflects with a slash, the thief poofs away; 「嘿」= somersault over the coupling gap
shot('S10',32.97,37.22,(c,t)=>trainChase(c,t,{t0:32.97,base:28.49,ph:PH,jayX:400,slashT:33.62,jumpT:35.92,jumpDX:380,
  chase:[{x:1260,face:-1,remap:'shadow',bell:true,throwT:33.55,until:35.1}],shots:[[33.78,34.25,1170,520,640,true]]}));
// rooftop under the moon (plain ridge): S11 thinking, S12 frustrated slashes
function rooftop(c,t,o){ E.castleRoof(c,t,o.camX||0,{plain:true,moonX:o.moonX||1300,moonR:o.moonR||170,snow:o.snow,ridgeY:760}); if(o.train){ const u=t-o.t0; for(let k=0;k<9;k++){ const x=g5(300+k*40+u*260); if(x<1400) rect(c,x,655,25,10,'#D9A441'); } }
  o.jay(c,t); if(o.leaves) F.leaves(c,t,o.leaves,22,{}); if(o.snow) E.snow(c,t,71,90,{}); }
F.rooftop=rooftop;
shot('S11',37.22,39.37,(c,t)=>rooftop(c,t,{t0:37.22,train:true,jay:(c,t)=>{ const GY=752; if(t<37.4) Ja(c,'land',t,37.13,900,GY,1); else if(t<38.05) Ja(c,'idle',t,37.4,900,GY,-1); else Ja(c,'seal',t,38.05,900,GY,-1); }}),{k:'dissolve',d:0.5});
shot('S12',39.37,41.56,(c,t)=>rooftop(c,t,{t0:39.37,moonX:500,moonR:220,leaves:23,jay:(c,t)=>{ const GY=752;
  if(t<39.55) Ja(c,'idle',t,39.37,960,GY,1); else if(t<40.95) Ja(c,'slash',t,39.55,960,GY,1); else Ja(c,'slash',t,40.95,960,GY,-1);
  for(const [ts,dir] of [[39.55+19/30,1],[40.95+19/30,-1]]){ const u=inv(ts,ts+0.8,t); if(u>0&&u<1){ const x0=960+dir*170; for(const s of [-1,1]){ c.save(); c.translate(g5(x0+s*u*40),g5(520+u*u*300)); poly(c,[[0,-12],[5,0],[0,0],[-5,0]].map(p=>[p[0],p[1]*s]),P.moss); c.restore(); } } } }}));
// ikebana room (S13/S14 and winter S23/S31/S32). o.jay(c,t), o.snow opens the shoji onto the snowy garden, o.bamboo puts cut bamboo in the vase
function room(c,t,o){ const lt=t-o.t0; const m=330;
  const camX=g5(o.pan?lerp(o.pan[0],o.pan[1],lt/(o.pan[2]||4)):0); c.save(); c.translate(-camX,0);
  rect(c,-200,0,W+400,H,'#EADFC8');
  rect(c,120,120,520,700,'#DCCCAE'); rect(c,120,120,520,40,P.woodS); rect(c,600,120,40,700,P.wood); rect(c,120,800,520,40,P.wood);
  rect(c,280,170,200,520,P.paper); rect(c,280,170,200,24,P.ai); rect(c,280,666,200,24,P.ai); circ(c,380,330,52,P.ochre); circ(c,396,322,46,P.paper); poly(c,[[300,640],[372,430],[380,432],[316,640]],P.ink2); poly(c,[[330,640],[420,470],[426,474],[344,640]],P.ink2);
  rect(c,180,760,400,14,P.ink); rect(c,200,730,14,40,P.wood); rect(c,546,730,14,40,P.wood); if(!o.noSword) RIG.drawSword(c,[520,752],90,RIG.C0,330,-1,true);
  const sx=1180; rect(c,sx,140,600,560,'#F4EBD6'); c.save(); c.beginPath(); c.rect(sx,140,600,560); c.clip(); circ(c,sx+400,330,120,'#E7D8B5'); poly(c,[[sx+80,700],[sx+150,520],[sx+170,520],[sx+120,700]],'#D9C9A6'); c.restore();
  if(o.snow){ rect(c,sx+300,140,300,560,'#1C2238'); c.save(); c.beginPath(); c.rect(sx+300,140,300,560); c.clip(); E.moon(c,sx+460,260,60,{}); rect(c,sx+300,600,300,100,'#F2E8D5'); E.snow(c,t,81,60,{calm:1}); c.restore(); }
  c.fillStyle=P.wood; for(let x=sx;x<=sx+600;x+=100) if(!o.snow||x<=sx+300) c.fillRect(x-5,140,10,560); for(let y=140;y<=700;y+=80) c.fillRect(sx,y-4,o.snow?300:600,8); rect(c,sx-20,130,640,20,P.wood); rect(c,sx-20,700,640,20,P.wood);
  rect(c,-200,840,W+400,640,P.tatami); c.fillStyle=P.tatamiS; for(let y=846;y<H+400;y+=14) c.fillRect(-200,y,W+400,3); rect(c,-200,840,W+400,16,'#2F3B2A'); rect(c,640,840,16,640,'#2F3B2A');
  if(o.table!==false){ rect(c,1080,858,520,22,P.woodS); rect(c,1080,846,520,14,P.wood); rect(c,1110,880,26,80,P.woodS); rect(c,1540,880,26,80,P.woodS);
    const vx=1330,vy=846; poly(c,[[vx-60,vy],[vx+60,vy],[vx+48,vy-90],[vx+26,vy-120],[vx-26,vy-120],[vx-48,vy-90]],P.ai); poly(c,[[vx+10,vy],[vx+60,vy],[vx+48,vy-90],[vx+26,vy-120],[vx+10,vy-120]],P.aiS); rect(c,vx-30,vy-126,60,8,P.aiS);
    const br=[[vx,vy-124],[vx-40,vy-240],[vx-110,vy-330],[vx-150,vy-420]]; for(let k=0;k<3;k++) capsule(c,br[k][0],br[k][1],7-k*1.5,br[k+1][0],br[k+1][1],5-k*1.5,P.woodS);
    capsule(c,vx-40,vy-240,4,vx+60,vy-320,3,P.woodS); capsule(c,vx,vy-124,4,vx+90,vy-210,3,P.mossS);
    if(o.bamboo){ E.bamboo(c,vx+30,vy-430,vy-120,30,P.moss,P.mossS,'#2F452B',true); poly(c,[[vx+15,vy-430],[vx+45,vy-450],[vx+45,vy-428]],P.mossL); }
    const r=mulberry(77); for(let k=0;k<16;k++){ const q=r(); const seg=Math.min(2,Math.floor(q*3)); const u=r(); const px=lerp(br[seg][0],br[seg+1][0],u)+(r()-0.5)*30, py=lerp(br[seg][1],br[seg+1][1],u)+(r()-0.5)*30; for(let p=0;p<5;p++){const a=p/5*Math.PI*2; circ(c,px+Math.cos(a)*8,py+Math.sin(a)*8,7,P.sakura);} circ(c,px,py,4,P.shu);}
    circ(c,vx+90,vy-214,20,P.shu); circ(c,vx+96,vy-218,9,P.ochre); blob(c,[[vx+60,vy-180],[vx+86,vy-200],[vx+70,vy-160]],P.moss); }
  o.jay(c,t,lt); c.restore();
}
F.room=room;
const snipJay=(c,t,lt)=>{ Ja(c,'seiza_snip',lt<0.6?0:lt,0,1010,960,1,null,'L'); const hx=1010+28*5/1.17, hy=960-34*5/1.17; const fall=((lt*1.2)%1); capsule(c,hx+30,hy-10+fall*120,3,hx+50,hy+fall*120,2,P.woodS); };
F.snipJay=snipJay;
shot('S13',41.56,44.03,(c,t)=>room(c,t,{t0:41.56,jay:snipJay}),{k:'dissolve',d:0.5});
// bows on 「はいはいはい」, mouth on 「分かりました」 — standing, facing the alcove (sword gone from the stand: he wears it)
const BOWS=[['bow',0,2],['bow',1,3],['bow',2,4],['bow',1,3],['bow',2,4],['bow',1,3],['bow',2,8],['bow',1,4],['bow',0,6]];
F.bowJay=(c,t,t0,tTalk,tEnd,x,remap,maskT)=>{ const y=930;
  if(maskT!=null&&t>=maskT) return Ja(c,'react_mask',t,maskT,x,y,-1,remap,'L');
  if(t<tTalk){ const q=seq(BOWS,t,t0); J(c,q[0],q[1],x,y,-1,remap,'L'); }
  else if(t<tEnd) Ja(c,'talk',t,tTalk,x,y,-1,remap,'L'); else Ja(c,'idle',t,tEnd,x,y,-1,remap,'L'); };
shot('S14',44.03,46.02,(c,t)=>room(c,t,{t0:44.03,table:false,noSword:true,jay:(c,t)=>F.bowJay(c,t,44.03,45.02,45.9,1000)}));
// S15 46.02–50.55: sakura courtyard — Jay walks in; the masked leader appears on the wall holding the bell; time freezes; he points
function sakura(c,t,o){ E.sky(c,P.night); E.stars(c,t,8,50,600,['#F2E8D5','#4A5378','#EBA9A5']); E.dither(c,0,480,1920,160,'#2E3756',f=>f*0.7); E.moon(c,1180,190,96);
  E.clouds(c,t,[{x:200,y:240,w:800,h:24,v:5,col:P.night2},{x:1100,y:330,w:600,h:20,v:-4,col:P.night2}],P.night2,51);
  E.roofRow(c,-80,640,0.8,12,P.night3,null,'#323B5E',61,{lattice:'#2A3252'});
  rect(c,0,640,W,60,'#D9CDB4'); rect(c,0,640,W,12,P.ink2); rect(c,0,700,W,380,'#C9BFA8'); c.fillStyle='#BCB29A'; for(let y=720;y<H;y+=22) c.fillRect(0,y,W,4);
  const tx=520; poly(c,[[tx-46,1000],[tx+40,1000],[tx+30,640],[tx+90,420],[tx+60,410],[tx+4,600],[tx-40,470],[tx-66,480],[tx-26,640]],P.woodS); poly(c,[[tx+6,1000],[tx+40,1000],[tx+30,640],[tx+90,420],[tx+76,416],[tx+14,620]],'#4A2C1F');
  E.sakuraCanopy(c,tx+10,330,340,9,{M:P.sakura,S:P.sakuraS,L:P.sakuraL,B:P.woodS});
  const lx=1500; rect(c,lx-40,900,80,100,P.stone); rect(c,lx-70,880,140,24,P.stoneS); rect(c,lx-50,790,100,90,P.stone); rect(c,lx-24,815,48,40,P.ochre); poly(c,[[lx-100,790],[lx,730],[lx+100,790]],P.stoneS); rect(c,lx-12,700,24,32,P.stoneS); rect(c,lx+10,790,40,90,P.stoneS);
  const fz=o.fz; // leader on the wall
  if(t>=o.lead) { Ja(c,'idle',t<fz?t:fz,o.lead,1250,640,-1,'leader'); bell(c,1250-60,640-170,t<fz?t:fz); } poof(c,1250,530,t,o.lead-0.05);
  F.petals(c,t,5,160,{freeze:fz});
  const y=905; poly(c,[[o.stop+50,y+4],[o.stop-90,y+4],[o.stop-200,y+40],[o.stop-20,y+40]],'#7E7C76'); if(o.noJay) return;
  if(t<o.walkEnd){ const x=g5(lerp(o.walkFrom,o.stop,(t-o.t0)/(o.walkEnd-o.t0))); Ja(c,'walk',t,o.t0,x,y,1); }
  else if(t<fz-5/30) Ja(c,'idle',t,o.walkEnd,o.stop,y,1); else Ja(c,'point',t,fz-5/30,o.stop,y,1);
}
F.sakura=sakura;
shot('S15',46.02,50.55,(c,t)=>sakura(c,t,{t0:46.02,walkFrom:620,stop:860,walkEnd:48.3,lead:48.3,fz:49.737}),{k:'mosaic',d:0.6});
// S16 50.55–55.10: night raid on the rooftops — two shadows ambush; one is cut down; the other's smoke bomb swallows the frame
shot('S16',50.55,55.10,(c,t)=>{ const lt=t-50.55; const camX=g5(Math.min(lt,1.5)*520); E.castleRoof(c,t,camX,{plain:true,moonX:600,moonR:150,ridgeY:760});
  c.save(); c.translate(-camX,0); const GY=752, s1=1700, s2=1980;
  const jx=600+Math.min(lt,1.5)*520;
  if(lt<1.5) Ja(c,'run',t,50.55,jx,GY,1); else if(t<52.4) Ja(c,'idle',t,52.05,jx,GY,1); else { const st=inv(52.4+12/30,52.4+19/30,t); Ja(c,'slash',t,52.4,g5(jx+st*120),GY,1); }
  if(t>=51.75){ if(t<52.4+19/30) Ja(c,'idle',t,51.75,s1,GY,-1,'shadow'); poof(c,s1,GY-110,t,52.4+19/30); } poof(c,s1,GY-110,t,51.7);
  if(t>=52.3){ if(t<54.1) Ja(c,'idle',t,52.3,s2,GY,-1,'shadow'); else Ja(c,'throw',t,54.1,s2,GY,-1,'shadow'); } poof(c,s2,GY-110,t,52.25);
  const u=inv(54.25,54.5,t); if(u>0&&u<1) fxW(c,'shuriken',0,g5(lerp(s2-60,jx+200,u)),GY-150,1);
  c.restore(); F.smoke(c,t,54.45,jx-camX+200,GY-140,{seed:11}); });
// story scroll (ink silhouettes on washi). o.mode 'oath' | 'twist'
function scrollShot(c,t,o){ const lt=t-o.t0; const [x0,y0,w,h]=E.scroll(c,t); const pan=g5(lt*30);
  const draw=(dx,dy)=>{ c.save(); c.translate(dx-pan,dy); const GY=y0+h-80;
    if(o.mode==='oath'){ J(c,'seiza',0,560,GY,1,'ink','L'); const q=seq(BOWS,t,o.t0+0.6); J(c,q[0],q[1],1060,GY,-1,'ink'); J(c,q[0],q[1],1280,GY,-1,'ink');
      // the master's gift: a single bell between them
      F.fxW(c,'bell',0,810,GY-30,1,'ink'); }
    else { const s1=SPR.frameAt('M','slash',t,o.t0+0.3+ (Math.floor((lt-0.3)/1.5))*1.5), s2=SPR.frameAt('M','slash',t,o.t0+0.45+(Math.floor((lt-0.45)/1.5))*1.5);
      J(c,'slash',lt<0.3?0:s1,760,GY,1,'ink'); J(c,'slash',lt<0.45?0:s2,1240,GY,-1,t>=o.turn?'silL':'ink'); }
    c.restore(); };
  if(o.cut&&t>=o.cut){ const u=eo(inv(o.cut,o.cut+0.5,t)); // the paper is cut on a diagonal; halves drift apart
    const diag=(s)=>{ c.beginPath(); if(s<0){ c.moveTo(0,0); c.lineTo(1100,0); c.lineTo(820,H); c.lineTo(0,H); } else { c.moveTo(1100,0); c.lineTo(W,0); c.lineTo(W,H); c.lineTo(820,H); } c.closePath(); };
    rect(c,0,0,W,H,'#1C2238'); for(const s of [-1,1]){ c.save(); diag(s); c.clip(); c.translate(g5(s*u*40),g5(s*u*30)); rect(c,x0,y0,w,h,'#F2E8D5'); rect(c,x0,y0,w,30,'#E2D3B8'); rect(c,x0,y0+h-30,w,30,'#E2D3B8'); draw(0,0); c.restore(); }
    if(t<o.cut+0.1) poly(c,[[1095,0],[1110,0],[825,H],[810,H]],'#FFF8EC'); }
  else draw(0,0);
  if(o.burn&&t>=o.burn){ const u=inv(o.burn,o.burn+1.6,t); const fx=g5(lerp(x0+w,x0+w*0.48,u)); const r=mulberry(Math.floor(t*12));
    rect(c,fx,y0-60,x0+w-fx+80,h+120,'#1C2238'); for(let y=y0;y<y0+h;y+=10){ const j=g5(r()*40); rect(c,fx-j-10,y,j+10,10,'#D8402F'); rect(c,fx-j-20,y,10,10,'#D9A441'); if(r()<0.3) rect(c,fx+g5(r()*120),y-g5(r()*80),5,5,'#D9A441'); } }
}
F.scrollShot=scrollShot;
shot('S17',55.10,59.62,(c,t)=>scrollShot(c,t,{t0:55.10,mode:'oath',cut:57.934}),{k:'dissolve',d:0.6});
// S18 59.62–64.16: 「隐身要彻底」 — on a roof under the moon Jay seals and fades by count; only the red scarf is left, and it blows away
function vanish(c,t,o){ E.castleRoof(c,t,0,{plain:!o.castle,moonX:o.moonX||960,moonR:o.moonR||260,ridgeY:760,snow:o.snow}); const GY=752, x=o.x;
  const st=[o.c1,o.c2,o.c3,o.c4]; const lv=st.filter(q=>t>=q).length; const R=[null,'fade1','fade2','fade3','fade3'][lv];
  if(o.leader) o.leader(c,t);
  if(lv<4){ if(t<o.seal) Ja(c,'idle',t,o.t0,x,GY,o.face); else Ja(c,'seal',t,o.seal,x,GY,o.face,R); }
  else { const u=t-o.c4; const k=SPR.frameAt('M','seal',o.c4,o.seal); // scarf/mask remnants fly off with the wind
    if(u<1.6) J(c,'seal',k,g5(x+u*u*600),g5(GY-u*200),o.face,'fade3'); }
  if(o.after) o.after(c,t);
  if(o.snow) E.snow(c,t,91,100,{}); else F.petals(c,t,17,40,{wind:120}); }
F.vanish=vanish;
shot('S18',59.62,64.16,(c,t)=>vanish(c,t,{t0:59.62,x:900,face:1,seal:59.95,c1:60.209,c2:60.767,c3:61.324,c4:61.881}));
// S19 64.16–72.90: bamboo duel (approved choreography from the sprite phase)
function bamboo(c,t){ const lt=t-64.157; const cam=lt*90;
  E.sky(c,'#1C2238'); E.stars(c,t,10,40,700,['#F2E8D5','#4A5378']); E.moon(c,1450,200,150,{});
  const layers=[{k:0.25,col:'#2C3D45',s:'#263640',n:'#22313A',w:26,seed:3},{k:0.55,col:'#3E5A4C',s:'#344D41',n:'#2D4439',w:40,seed:5},{k:1,col:P.mossS,s:'#3A5234',n:'#2F452B',w:62,seed:8}];
  layers.forEach((L,li)=>{ const r=mulberry(L.seed); let x=-((cam*L.k)%280)-200; const sp=li===2?330:li===1?190:120; for(let i=0;x<W+200;i++){ const xx=x+r()*60; const cut=li===2&&r()<0.25; E.bamboo(c,xx,cut?380+r()*200:-20,H,L.w,L.col,L.s,L.n,cut); if(li===0&&r()<0.5) blob(c,[[xx,200+r()*300],[xx+80,220+r()*300],[xx+20,260+r()*300]],L.s); x+=sp+r()*80; } if(li===0) rect(c,0,860,W,220,'#202B33'); });
  rect(c,0,900,W,180,'#1C262B'); rect(c,0,900,W,10,'#2A3A34');
  const GY=925; const tJ=0.9, tAir=tJ+0.2, tLand=tJ+37/30, tS0=tLand+16/30, tCut=tS0+19/30, tS1=tS0+43/30;
  const ct=inv(tCut,tCut+0.9,lt); if(ct>0&&ct<1){ c.save(); c.translate(1330+ct*90,380+ct*ct*520); c.rotate(Math.round(ct*6)/10); E.bamboo(c,0,-260,0,62,P.mossS,'#3A5234','#2F452B',false); poly(c,[[-31,0],[31,-50],[31,4],[-31,4]],P.mossL); c.restore(); }
  const pA=(wx,wy,tp)=>poof(c,wx,wy,lt,tp);
  if(lt<tCut+0.05){ if(lt<tCut-0.35) Ja(c,'idle',lt,0.3,1420,GY,-1,'shadow'); else J(c,'slash',2,1420,GY,-1,'shadow'); }
  pA(1420,GY-110,tCut+0.04);
  const tRel=4.8+7/30, tHit=tRel+0.36;
  if(lt>=4.25&&lt<tHit) Ja(c,'idle',lt,4.25,1680,GY,-1,'shadow'); pA(1680,GY-110,4.2); pA(1680,GY-110,tHit);
  let jx,jy=GY,an,fr;
  if(lt<tJ){ jx=lerp(260,700,lt/tJ); an='run'; fr=SPR.frameAt('M','run',lt,0); }
  else if(lt<tLand){ const q=seq(F.JUMP,lt,tJ); an=q[0]; fr=q[1]; const u=clamp((lt-tAir)/(tLand-tAir),0,1); jx=lerp(700,1150,u); jy=GY-Math.sin(u*Math.PI)*300; }
  else if(lt<tS0){ jx=1150; an='land'; fr=SPR.frameAt('M','land',lt,tLand); }
  else if(lt<tS1){ const st=inv(tS0+12/30,tS0+19/30,lt); jx=Math.round(lerp(1150,1230,st)/5)*5; an='slash'; fr=SPR.frameAt('M','slash',lt,tS0); }
  else if(lt<4.8){ jx=1230; an='idle'; fr=SPR.frameAt('M','idle',lt,tS1); }
  else if(lt<6.6){ jx=1230; an='throw'; fr=SPR.frameAt('M','throw',lt,4.8); if(lt>4.8+22/30){ an='idle'; fr=SPR.frameAt('M','idle',lt,5.6);} }
  else { jx=lerp(1230,2150,(lt-6.6)/2.0); an='run'; fr=SPR.frameAt('M','run',lt,6.6); }
  const JL=J(c,an,fr,jx,jy,1);
  if(lt>=tLand&&lt<tLand+0.35){ SPR.blit(c,'FX','dust',SPR.frameAt('FX','dust',lt,tLand),JL[0],JL[1]-3,1); }
  if(lt>=tRel&&lt<tHit){ const u=(lt-tRel)/(tHit-tRel); const m=c.getTransform(); const x0=JL[0]+19, x1=Math.round(m.a*1680+m.e)-2; SPR.blit(c,'FX','shuriken',Math.floor(lt*15)%2,Math.round(lerp(x0,x1,u)),JL[1]-31,1); }
  F.leaves(c,lt,19,26,{});
}
F.bambooFn=bamboo;
shot('S19',64.16,72.90,bamboo,{k:'dissolve',d:0.6});
// S20 72.90–81.39: moon hill — the duel with the leader; Jay is thrown down; first snow; he gets back to one knee
shot('S20',72.90,81.39,(c,t)=>{ const lt=t-72.9; E.moonHill(c,t); const GY=790; const tc=76.603;
  // leader
  let lx, la='run', lk=0, ly=GY;
  if(t<74.5){ lx=g5(lerp(2050,1220,inv(72.9,74.5,t))); lk=SPR.frameAt('M','run',t,72.9); }
  else if(t<75.9){ lx=1220; la='idle'; lk=SPR.frameAt('M','idle',t,74.5); }
  else if(t<tc){ const u=inv(75.9,tc,t); lx=g5(lerp(1220,1010,u)); ly=GY-Math.sin(u*Math.PI*0.5)*180; la='jump'; lk=Math.min(6,SPR.frameAt('M','jump',t,75.9)); }
  else if(t<77.2){ const u=inv(tc,77.2,t); lx=g5(lerp(1010,1250,u)); ly=GY-Math.sin((0.5+u*0.5)*Math.PI)*180; la='jump'; lk=6; }
  else { lx=1250; la='land'; lk=SPR.frameAt('M','land',t,77.2); if(t>77.6){ la='idle'; lk=SPR.frameAt('M','idle',t,77.6);} }
  if(t<78.88){ J(c,la,lk,lx,ly,-1,'leader'); if(t>=77.2) bell(c,lx-60,ly-170,t); } poof(c,1250,GY-110,t,78.878);
  // Jay
  let jx,ja='run',jk=0,jy=GY,face=1;
  if(t<74.5){ jx=g5(lerp(-130,700,inv(72.9,74.5,t))); jk=SPR.frameAt('M','run',t,72.9); }
  else if(t<75.9){ jx=700; ja='idle'; jk=SPR.frameAt('M','idle',t,74.5); }
  else if(t<tc){ const u=inv(75.9,tc,t); jx=g5(lerp(700,910,u)); jy=GY-Math.sin(u*Math.PI*0.5)*180; ja='jump'; jk=Math.min(6,SPR.frameAt('M','jump',t,75.9)); }
  else if(t<77.2){ const u=inv(tc,77.2,t); jx=g5(lerp(910,690,u)); jy=GY-Math.sin((0.5+u*0.5)*Math.PI)*180+u*20; ja='down'; jk=0; }
  else if(t<79.4){ jx=690; ja='down'; jk=0; }
  else if(t<80.5){ jx=690; ja='down'; jk=1; }
  else { jx=690; ja='idle'; jk=SPR.frameAt('M','idle',t,80.5); }
  J(c,ja,jk,jx,jy,face,'sil');
  if(t>=tc&&t<tc+0.45) F.fxW(c,'poof',SPR.frameAt('FX','poof',t,tc),960,GY-260,1);
  if(t>=77.2&&t<77.55) F.fxW(c,'dust',SPR.frameAt('FX','dust',t,77.2),690,GY,1);
  // first snow: density builds after the defeat
  if(t>77.0){ const n=Math.floor(Math.min(120,(t-77)*40)); E.snow(c,t,101,n,{calm:1}); } },{k:'flash'});
})(window);
