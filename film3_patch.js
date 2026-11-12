// film3_patch.js — v3: new cinematic opening (8.93–18.60 s, shots O1–O9) replacing v2 S02–S04, the izakaya / street
// rebuilt in the v3 sets for continuity (S21, S22, S41, S42), ripple slips into the ninja world, and the film-wide
// effects pass (pixel lighting, rim light, cast shadows, rain/water, train light sweeps, bamboo shafts, hit shake/flash).
(function(G){
const {P,mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,capsule,blob}=G.K; const E=G.E, E4=G.E4, F=G.FILM, SPR=G.SPR, D=G.DATA; const W=1920,H=1080;
const {g5,J,Ja,poof}=F; const shot=F.shot; const C=E4.C;
F.SHOTS=F.SHOTS.filter(s=>!['S02','S03','S04','S21','S22','S41','S42'].includes(s.id));
F.V3=true;
// ---- extra runtime remaps (index space of the 32-colour sprite palette) ----
const N32=32; const R=SPR.REMAP;
R.paper=Array.from({length:N32},()=>29);                         // silhouette on lit shoji paper
R.passer=Array.from({length:N32},(_,i)=>i===0?0:([14,13,15].includes(i)?29:([23,22,12].includes(i)?22:(i===21||i===20?30:4))));
R.fgdark=Array.from({length:N32},(_,i)=>i===0?0:1);              // out-of-focus foreground silhouette
R.fgshade=Array.from({length:N32},(_,i)=>({17:16,18:17,16:0,29:28,30:29,23:22,22:18,20:30,21:30,13:16,14:13})[i]??i); // foreground, one ramp step darker
R.mirror=Array.from({length:N32},(_,i)=>i===0?-1:(i===23||i===22?30:0)); // reflection of the shadow ninja (ink, pale eye band)
const T=(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,'T');
const Lr=(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,'L');
const fl=(t)=>0.9+0.1*Math.sin(t*23)*Math.sin(t*7.3);

// small contained poof (bell vanishing): 9 puffs, max radius 110, gone in 0.55 s
function puff(c,t,ts,x,y){ const u=t-ts; if(u<0||u>0.55) return; const r=mulberry(9); for(let k=0;k<9;k++){ const a=r()*6.28, d=(40+r()*120)*eo(u/0.3), R=g5((40+r()*70)*(u<0.3?eo(u/0.3):1-(u-0.3)/0.25)); if(R<5) continue; const px=g5(x+Math.cos(a)*d), py=g5(y+Math.sin(a)*d*0.7-u*80); circ(c,px,py,R,k%3?'#B9B6AC':'#E2D3B8'); circ(c,px-R*0.3,py-R*0.3,R*0.45,'#F2E8D5'); } }
// ======================= O1 8.93–10.38 — rainy lane, tilt down =======================
shot('O1',8.93,10.38,(c,t)=>{ const lt=t-8.93; const ty=g5(lerp(760,0,eio(inv(0,1.15,lt)))), camX=g5(lerp(-60,40,lt/1.45));
  F.rim(1,'#FFC870'); F.cast(c,760-camX,520+ty,{a:0.35});
  E4.street(c,t,{camX,ty});
  c.save(); c.translate(g5(-camX*0.7),g5(ty*0.7)); { const u=inv(0,1.45,lt); T(c,'cat_walk',t,8.93,g5(lerp(-300,260,u)),680,1); } c.restore();
  c.save(); c.translate(g5(-camX),g5(ty)); Ja(c,'walk',t,8.93,g5(lerp(1900,1450,lt/1.45)),870,-1,'passer');
  const ju=inv(0.55,1.45,lt); if(ju>0) T(c,'walk_umb',t,9.48,g5(lerp(-120,420,ju)),930,1); c.restore();
  F.rain(c,t,{seed:11,gy:840+ty,x0:0,x1:1920,depth:240,ns:18});
  c.save(); c.translate(g5(-camX),g5(ty)); F.ripples(c,t,{n:8,x0:400,x1:1900,y0:900,y1:1060,r0:5,r1:45,sq:0.3,col:'#5A6A9A',per:0.8,seed:5,mask:(x,y)=>E4.PUD.some(p=>((x-p[0])/p[2])**2+((y-p[1])/p[3])**2<1)});
  F.reflect(c,{y0:840,y1:1080,k:0.55,dark:0.75,amp:1.5,t,puddles:E4.PUD,tint:'#C8D4F0'});
  F.amb([0.6,0.66,0.95]); F.light(c,760,540,520,'#F09A48',0.85*fl(t),{ry:0.85}); F.light(c,760,540,160,'#FFE7A8',0.4*fl(t)); F.light(c,1010,640,420,'#F09A48',0.45,{ry:0.7}); F.light(c,490,590,330,'#F09A48',0.35);
  c.restore(); },{k:'mosaic',d:0.6});

// ======================= O2 10.38–11.52 — at the door (medium) =======================
shot('O2',10.38,11.52,(c,t)=>{ const lt=t-10.38; const z=1.6, cx=g5(lerp(1000,1040,lt/1.14)), cy=930-390/z;
  F.rim(-1,'#FFC870'); E.zoom(c,z,cx,cy,()=>{ F.cast(c,760,520,{a:0.4}); E4.street(c,t,{camX:0,ty:0}); F.amb([0.6,0.66,0.95]); F.light(c,760,540,520,'#F09A48',0.9*fl(t),{ry:0.85}); F.light(c,760,540,150,'#FFE7A8',0.4*fl(t)); F.light(c,1010,640,420,'#F09A48',0.5,{ry:0.7}); });
  T(c,'cat_sit',t,10.38,1380,930,-1);
  const jx=g5(lerp(560,760,eo(inv(0,0.35,lt)))); if(lt<0.35) T(c,'walk_umb',t,10.38,jx,930,1); else T(c,'umb_close',t,10.73,jx,930,1);
  // splash: his step breaks the puddle (ring + droplets)
  const sp=t-10.62; if(sp>0&&sp<0.7){ F.ring(c,jx+40,1000,lerp(20,240,eo(sp/0.7)),0.18,'#8C9CC8',sp/0.7); if(sp<0.3) for(let k=0;k<7;k++){ const a=-0.3-k*0.4, v=380; c.fillStyle='#C8D4F0'; c.fillRect(g5(jx+40+Math.cos(a)*v*sp),g5(985+Math.sin(a)*v*sp+1200*sp*sp),5,5); } }
  F.rain(c,t,{seed:12,gy:930,x0:0,x1:1920,depth:120,ns:16,layers:[[50,'#4A5378',3,1500],[30,'#8C9CC8',4,1900],[14,'#C8D4F0',8,2600]]});
  F.reflect(c,{y0:935,y1:1080,k:0.55,dark:0.75,amp:1.5,t,puddles:[[760,1000,300,45],[1450,1010,230,35],[180,1030,240,30]],tint:'#C8D4F0'});
});

// ======================= O3 11.52–12.63 — inside, POV through the noren =======================
const MASTER=1300, SEAT=900;
const regulars=(c,t)=>{ T(c,'r1_drink',t,0,480,930,1); T(c,'r2_laugh',t,0.4,1750,930,-1); };
shot('O3',11.52,12.63,(c,t)=>{ const lt=t-11.52; const camX=g5(lerp(140,330,eo(lt/1.11)));
  F.rim(1,'#FFC870'); E4.izakaya3(c,t,{camX,glint:true,behind:(c)=>T(c,'m_nod',t,11.95,MASTER,930,-1),front:(c)=>regulars(c,t)});
  // foreground noren parting (POV), parallax faster than the room
  const u=eo(inv(0,0.55,lt)); const back=Math.sin(inv(0.55,1.1,lt)*Math.PI)*0.08; E4.noren(c,-200,-60,2320,lerp(560,380,u),4,t,{part:u-back,crest:0,col:'#2B3A67',colS:'#1F2A4C'});
});

// ======================= O4 12.63–14.35 — the bowl (insert, top-down) =======================
shot('O4',12.63,14.35,(c,t)=>{ const lt=t-12.63; const by=g5(lerp(-30,0,eo(inv(0,0.4,lt))));
  const lift=t>13.95?g5(-eo(inv(13.95,14.35,t))*25):0;
  E4.bowl(c,t,{dy:by+lift,rip:t>14.0,rings:[[12.75,0,0],[13.38,140,150],[13.62,140,150],[14.17,-60,-30]],shadowPass:inv(14.0,14.28,t)});
  const m=c.getTransform(); const bx=960, byy=520+by+lift;
  if(t<13.1){ const k=SPR.frameAt('T','hands_master',t,12.63); const ry=t>12.95?g5(-eo(inv(12.95,13.1,t))*300):0; J(c,'hands_master',k,bx,byy+ry,1,null,'T'); }
  if(t>=13.08){ const k=SPR.frameAt('T','hands_jay',t,13.08); const ry=g5((1-eo(inv(13.08,13.3,t)))*300); J(c,'hands_jay',k,bx,byy+ry,1,null,'T'); }
  // a drop from the eaves (ominous), lands at 14.17
  const dp=inv(13.95,14.17,t); if(dp>0&&dp<1){ rect(c,900,g5(lerp(-40,490+by,ei(dp))),10,20,'#C8D4F0'); }
});

// ======================= O5 14.35–15.49 — the garden pond =======================
shot('O5',14.35,15.49,(c,t)=>{ const lt=t-14.35; const camX=g5(lerp(-40,120,lt/1.14));
  E4.garden(c,t,{camX,mirror:(c,pond)=>{ const u=inv(0.35,1.0,lt); if(u>0&&u<1){ const m=c.getTransform(); const ly=Math.round(m.d*pond[0]+m.f), y1=Math.round(m.d*pond[1]+m.f);
    F.mirrorSprite(c,'M','run',SPR.frameAt('M','run',t,14.35),g5(lerp(1500,500,u)),pond[0]+5,-1,'mirror',t,1.5,[0,ly,384,y1-ly]); } }});
},{k:'ripple',d:0.5,c:[0.47,0.43]});

// ======================= O6 15.49–16.33 — reverse-side medium on Jay (mirrored room), a silhouette crosses the shoji =======================
shot('O6',15.49,16.33,(c,t)=>{ const lt=t-15.49; const z=lerp(1.22,1.32,lt/0.84); const cx=860, cy=930-390/z;
  const gut=(t>15.86&&t<16.02)?0.45:1;
  F.rim(-1,'#8C9CC8',true);
  // the room seen from the other side: background mirrored (lossless flip of the vector set, re-quantised), sprites un-mirrored
  c.save(); c.translate(1920,0); c.scale(-1,1);
  E.zoom(c,z,cx,cy,()=>{ E4.izakaya3(c,t,{camX:0,flick:gut,stools:[480,1300],behind:(c)=>T(c,'m_stir',t,0,MASTER,930,-1),
    shoji:(c,r)=>{ const u=inv(0.12,0.62,lt); if(u>0&&u<1){ c.save(); c.beginPath(); c.rect(r[0],r[1],r[2]-r[0],r[3]-r[1]); c.clip(); Ja(c,'run',t,15.6,g5(lerp(450,1400,u)),r[3]+5,-1,'paper'); c.restore(); } }}); });
  c.restore();
  const sx=g5(1920-(960+(SEAT-cx)*z)); T(c,'glance',t,15.62,sx,930,-1);
  E4.steam(c,t,sx-110,700,3,{h:200});
  // foreground: a paper lantern hanging close to the lens (parallax, partly out of frame)
  const fx=g5(lerp(260,200,lt/0.84)); rect(c,fx-4,0,8,80,'#0E1020'); ell(c,fx,250,150,180,0,'#E2D3B8'); rect(c,fx-150,80,300,22,'#0E1020'); rect(c,fx-150,400,300,22,'#0E1020'); for(let k=-3;k<=3;k++) rect(c,fx-150,250+k*45,300,5,'#C9965E'); rect(c,fx+60,90,60,320,'#F2E8D5');
  F.light(c,fx,250,420,'#FFE7A8',0.25*gut);
});

// ======================= O7 16.33–17.18 — reverse angle from behind the counter =======================
shot('O7',16.33,17.18,(c,t)=>{ const lt=t-16.33; const camX=g5(lerp(0,-60,lt/0.85)); const gust=inv(16.75,17.0,t)*(1-inv(17.0,17.18,t));
  F.rim(-1,'#FFC870');
  E4.izakayaRev(c,t,{camX,gust,norenSway:1+gust*2,lanSway:1+gust*3,mid:(c)=>T(c,'tap',t,16.4,1150,930,-1),front:(c)=>{ T(c,'m_stir',t,0,170,1130,1,'fgshade'); }});
});

// ======================= O8 17.18–17.74 — kamidana insert: the bell vanishes on the beat =======================
shot('O8',17.18,17.74,(c,t)=>{ const lt=t-17.18; const on=t<17.183+2/30;
  E4.kamidanaClose(c,t,{dy:g5(lerp(10,-10,lt/0.56)),bellOn:on,swing:on?0:0.6,tb:17.2,gust:1.2});
  if(!on) puff(c,t,17.19,1400,500);
  const u=inv(17.3,17.74,t); if(u>0){ const x=g5(1400+Math.sin(u*9)*80), y=g5(lerp(440,900,u)); c.save(); c.translate(x,y); c.rotate(Math.round(u*12)/2); poly(c,[[0,-30],[12,0],[0,30],[-12,0]],'#0E1020'); rect(c,-2,-30,4,60,'#2E3756'); c.restore(); }
});

// ======================= O9 17.74–18.60 — the thief bolts, Jay goes after him =======================
shot('O9',17.74,18.60,(c,t)=>{ const lt=t-17.74; const camX=-250; const gust=inv(17.8,17.95,t)*(1-inv(18.3,18.6,t))+inv(18.42,18.5,t);
  F.rim(1,'#FFC870');
  E4.izakaya3(c,t,{camX,bell:'off',gust:gust*1.4,norenSway:1+gust*3,lanSway:1+gust*2,behind:(c)=>{ if(t<17.8) T(c,'m_stir',t,0,MASTER,930,-1); else T(c,'m_startle',t,17.8,MASTER,930,-1); },
    front:(c)=>{ T(c,'r1_drink',t,0,480,930,1);
      const tu=inv(17.76,18.08,t); if(tu>0&&tu<1) Ja(c,'run',t,17.76,g5(lerp(420,-300,tu)),930,-1,'shadow');
      if(t<18.25) Lr(c,'react_seat',t,17.74,SEAT,930,-1); else { const u=inv(18.25,18.6,t); Lr(c,'run',t,18.25,g5(lerp(SEAT,-260,ei(u))),930,-1); } } });
  // rain spray blown in through the door
  if(gust>0.05){ const r=mulberry(Math.floor(t*15)); c.fillStyle='#C8D4F0'; for(let k=0;k<26*gust;k++){ const x=g5(-420+250+r()*420), y=g5(300+r()*600); c.fillRect(x,y,10,5); } }
  if(t>18.45){ const sp=t-18.45; F.ring(c,30,1010,lerp(10,200,eo(sp/0.3)),0.2,'#8C9CC8',sp/0.3); }
});
// slip into the ninja world through the doorstep puddle
F.SHOTS.filter(s=>s.id==='S05').forEach(s=>s.tr={k:'ripple',d:0.6,c:[0.06,0.9]});

// ======================= continuity rebuilds in the v3 sets =======================
// S21 81.39–84.27: winter — the same lane under snow, Jay alone with the umbrella (no bell to come home to)
shot('S21',81.39,84.27,(c,t)=>{ const lt=t-81.39; const camX=g5(lerp(-80,80,lt/2.88));
  F.rim(1,'#FFC870'); c.save(); c.translate(g5(-camX),0); F.cast(c,760,520,{a:0.35}); c.restore();
  E4.street(c,t,{camX,ty:0,snow:true}); c.save(); c.translate(g5(-camX),0); T(c,'walk_umb',t,81.39,g5(lerp(80,640,lt/2.88)),930,1);
  F.reflect(c,{y0:840,y1:1080,k:0.35,dark:0.7,amp:0.5,t,puddles:E4.PUD,tint:'#C8D4F0'}); F.amb([0.66,0.7,0.95]); F.light(c,760,540,520,'#F09A48',0.8*fl(t),{ry:0.85}); F.light(c,1010,640,420,'#F09A48',0.4,{ry:0.7}); c.restore();
  E.snow(c,t,121,120,{}); },{k:'mosaic',d:0.6});
// S22 84.27–86.53: inside, the empty bell post; slow pan from the kamidana to Jay alone at the counter
shot('S22',84.27,86.53,(c,t)=>{ const lt=t-84.27; const camX=g5(lerp(-250,100,lt/2.26));
  F.rim(1,'#FFC870'); E4.izakaya3(c,t,{camX,bell:'off',snow:true,behind:(c)=>T(c,'m_stir',t,0,MASTER,930,-1),front:(c)=>Lr(c,'chew',t,84.27,SEAT,930,1)}); });
// S41 152.37–155.20: home — he hangs the bell back on the kamidana (glint); the regulars are back
const BELLX=E4.KAMI.x+134, BELLY=E4.KAMI.y+5;
shot('S41',152.37,155.20,(c,t)=>{ const camX=-250; const put=153.6;
  F.rim(1,'#FFC870'); E4.izakaya3(c,t,{camX,bell:t>=put?'on':'off',snow:true,glint:t>=put,behind:(c)=>T(c,t<153.9?'m_stir':'m_nod',t,153.9,MASTER,930,-1),
    front:(c)=>{ regulars(c,t); T(c,'cat_sit',t,0,-150,930,1); const k=SPR.frameAt('L','reach',t,152.6); J(c,'reach',k,BELLX-125,930,1,null,'L'); if(t<put){ F.bell(c,BELLX-125+(k?60:90),930-(k?470:390),t); } } }); },{k:'dissolve',d:0.6});
// S42 155.20–159.17: miso steam, everyone home; the moon-iris closes on the bell
const S42cam=t=>g5(lerp(-250,-170,eio(inv(155.2,157.2,t))));
shot('S42',155.20,159.17,(c,t)=>{ const camX=S42cam(t);
  F.rim(1,'#FFC870'); E4.izakaya3(c,t,{camX,bell:'on',snow:true,glint:true,behind:(c)=>T(c,'m_stir',t,0,MASTER,930,-1),front:(c)=>{ regulars(c,t); T(c,'cat_sit',t,0,-150,930,1); Lr(c,'chew',t,155.2,SEAT,930,1); E4.steam(c,t,SEAT+110,700,3,{h:200}); } }); });
F.IRIS=t=>{ if(t<157.2) return null; const u=inv(157.2,158.5,t); const cam=S42cam(t); return [Math.round((BELLX-cam)/5),Math.round((BELLY-15)/5),Math.round(lerp(260,0,eio(u))/2)*2]; };

// S30 109.44–111.66: the castle in snow, now over its moat — the moon's reflection breaks in the ripples, snow melts into the water
F.SHOTS=F.SHOTS.filter(s=>s.id!=='S30');
shot('S30',109.44,111.66,(c,t)=>{ const GY=930; E.sky(c,'#1C2238'); E.stars(c,t,41,70,800,['#F2E8D5','#4A5378']); E.moon(c,1500,200,120,{});
  poly(c,[[-100,1080],[-100,760],[600,700],[1400,700],[2000,760],[2000,1080]],'#22382A'); E.castle(c,t,1250,860,1.9,{snow:true,banners:()=>1});
  rect(c,-100,880,2100,60,'#43475A'); for(let x=-100;x<2000;x+=60){ rect(c,x,885,55,25,'#5A5F73'); rect(c,x+30,912,55,25,'#5A5F73'); } rect(c,-100,872,2100,14,'#F2E8D5');
  rect(c,-100,940,2100,200,'#12303A'); rect(c,-100,940,2100,6,'#0E1020');
  for(let j=0;j<8;j++){ const w=g5(60-j*5+Math.sin(t*3+j)*12), off=g5(Math.sin(t*4+j*1.7)*18); rect(c,1500+off-w,960+j*14,w*2,5,j%2?'#C8D4F0':'#8C9CC8'); }
  F.ripples(c,t,{n:10,x0:-100,x1:2000,y0:960,y1:1070,r0:5,r1:30,sq:0.3,col:'#5FB0A8',per:0.7,seed:30});
  F.reflect(c,{y0:940,y1:1080,k:0.5,dark:0.6,amp:1.5,t,tint:'#A8E0D0'});
  if(t<110.0) Ja(c,'idle',t,109.44,560,GY-60,1,null,'L'); else Ja(c,'seal',t,110.0,560,GY-60,1,null,'L'); E.snow(c,t,131,110,{}); },{k:'dissolve',d:0.5});
// ======================= film-wide effects pass (declared before each shot draws) =======================
const NIGHT=(dir,col)=>(c,t)=>{ F.amb([0.84,0.87,1.0]); F.rim('auto',col||'#8C9CC8'); };
const SNOWN=(dir)=>(c,t)=>{ F.amb([0.86,0.9,1.0]); F.rim('auto','#C8D4F0'); };
const ROOM=(c,t)=>{ F.amb([0.97,0.92,0.86]); F.light(c,960,200,1100,'#FFE7A8',0.12,{ry:0.7}); };
const TRAIN=(snow)=>(c,t)=>{ F.amb([0.82,0.86,1.0]); F.rim(1,snow?'#C8D4F0':'#8C9CC8'); for(let k=0;k<2;k++){ const u=((t*1.4+k*0.5)%1); const x=lerp(2400,-700,u); F.shaft(c,[[x,0],[x+160,0],[x+60,1080],[x-100,1080]],'#FFC870',0.22,0.5); } };
const BAMBOO=(snow)=>(c,t)=>{ F.amb([0.8,0.86,1.0]); F.rim(1,snow?'#C8D4F0':'#8C9CC8'); for(const [x0,w] of [[300,90],[900,60],[1350,110]]){ const x=x0+Math.sin(t*0.4+x0)*40; F.shaft(c,[[x,0],[x+w,0],[x+w-380,1080],[x-380,1080]],'#C8D4F0',0.2,0.4); } };
const ATTIC=(c,t)=>{ F.amb([0.8,0.8,0.92]); F.rim(1,'#8C9CC8'); F.light(c,1505,840,300,'#FFC870',0.5*fl(t)); F.cast(c,1505,840,{a:0.35}); };
const PRE={S01:NIGHT(-1),S05:NIGHT(1),S06:NIGHT(1),S07:NIGHT(1),S09:TRAIN(false),S10:TRAIN(false),S11:NIGHT(-1),S12:NIGHT(-1),S13:ROOM,S14:ROOM,S15:NIGHT(1),S16:NIGHT(1),S18:NIGHT(1),
  S19:BAMBOO(false),S20:NIGHT(-1),S23:ROOM,S24:SNOWN(1),S25:SNOWN(1),S26:SNOWN(1),S28:TRAIN(true),S29:TRAIN(true),S30:SNOWN(1),S31:BAMBOO(true),S32:ROOM,S33:ROOM,
  S34:SNOWN(1),S35:ATTIC,S36:ATTIC,S37:NIGHT(1),S38:NIGHT(1),S39a:NIGHT(1),S39b:NIGHT(1),S39c:NIGHT(1),S40:SNOWN(1)};
for(const s of F.SHOTS){ const p=PRE[s.id]; if(p){ const f=s.fn; s.fn=(c,t)=>{ p(c,t); f(c,t); }; } }
// slips into the dream world through water
F.SHOTS.filter(s=>s.id==='S15').forEach(s=>s.tr={k:'ripple',d:0.6,c:[0.5,0.55]});
F.SHOTS.filter(s=>s.id==='S34').forEach(s=>s.tr={k:'ripple',d:0.6,c:[0.5,0.55]});
// hits: screen shake + 1–2 frame flash light (sword flashes, impacts, the reveal)
F.SHAKES.push(...[[39.5,0.25,3],[40.85,0.25,3],[54.45,0.3,2],[76.6,0.35,4],[78.878,0.25,3],[122.633,0.3,4],[124.2,0.25,2],[130.0,0.4,4],[135.42,0.25,2],[145.64,0.3,3],[147.93,0.3,3],[150.45,0.35,4],[17.19,0.2,2]].map(([t,d,a])=>({t,d,a})));
F.FLASHES.push(...[[39.5,0.07,0.5],[40.85,0.07,0.5],[76.62,0.07,0.6],[122.633,0.07,0.55],[130.03,0.1,0.6],[150.45,0.07,0.5]].map(([t,d,k])=>({t,d,k})));
})(window);
