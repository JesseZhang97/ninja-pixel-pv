// film_a.js — shared helpers + ACT I shots for the full film (renders via film_main.js).
(function(G){
const {P,mulberry,hash,clamp,lerp,inv,eio,eo,ei,eback,twos,poly,rect,circ,ell,rrect,capsule,blob,kasumi,seigaiha}=G.K;
const E=G.E, D=G.DATA, PX=G.PX, SPR=G.SPR, RIG=G.RIG; const W=1920,H=1080;
const F=G.FILM={SHOTS:[]};
F.shot=(id,t0,t1,fn,tr)=>F.SHOTS.push({id,t0,t1,fn,tr:tr||{k:'cut'}});
F.g5=v=>Math.round(v/5)*5;
F.seq=(list,t,t0)=>{ let tick=Math.floor((t-t0)*30+1e-6); if(tick<0) return list[0]; for(const q of list){ if(tick<q[2]) return q; tick-=q[2]; } return list[list.length-1]; };
F.J=(c,anim,k,x,y,face,remap,set)=>SPR.draw(c,set||'M',anim,k,x,y,face,remap);
F.Ja=(c,anim,t,t0,x,y,face,remap,set)=>SPR.draw(c,set||'M',anim,SPR.frameAt(set||'M',anim,t,t0),x,y,face,remap);
F.fxW=(c,anim,k,wx,wy,face,remap)=>{ const m=c.getTransform(); SPR.blit(c,'FX',anim,k,Math.round(m.a*wx+m.e),Math.round(m.d*wy+m.f),face||1,remap); };
F.poof=(c,wx,wy,t,tp)=>{ if(t>=tp&&t<tp+0.5) F.fxW(c,'poof',SPR.frameAt('FX','poof',t,tp),wx,wy,1); };
F.bell=(c,wx,wy,t)=>F.fxW(c,'bell',Math.floor(t*2.2)%2,wx,wy,1);
F.SEC=Object.fromEntries(D.sections.map(s=>[s.id,s.t]));
const {g5,seq,J,Ja,fxW,poof,bell,SEC}=F; const shot=F.shot;
// a leaf/petal field helper (frozen at tf)
F.petals=(c,t,seed,n,opt={})=>{ const r=mulberry(seed); const tp=opt.freeze!=null&&t>opt.freeze?opt.freeze:t; for(let k=0;k<n;k++){ const x0=r()*2200-100, sp=(opt.sp||50)+r()*60, ph=r()*20, sz=7+r()*7, rs=r()*2; const y=((ph*80+tp*sp)%1180)-60; const x=x0+Math.sin(tp*0.8+k)*40-tp*(opt.wind||20); E.petal(c,((x%2100)+2100)%2100-90,y,sz,tp*rs+k,P.sakuraL,P.sakuraS,Math.cos(tp*2+k)); } };
F.leaves=(c,t,seed,n,opt={})=>{ const r=mulberry(seed); for(let k=0;k<n;k++){ const x=(r()*W-t*140*(0.6+r()))%W; const y=(r()*H+t*60)%H; c.save(); c.translate(g5((x+W)%W),g5(y)); c.rotate(Math.round((t*2+k)*4)/4); poly(c,[[0,-12],[5,0],[0,12],[-5,0]],k%2?(opt.a||P.moss):(opt.b||P.mossS)); c.restore(); } };

// ======================= ACT I — 序：小神龛的铃 =======================
// S01 0–8.93: scroll unrolls on the moon; tilt down to Jay crouched on a ridge; he drops into the town on the downbeat
function intro(c,t){
  E.sky(c,P.night); const tilt=eio(inv(3.4,7.0,t));
  E.stars(c,t,4,60,1080,['#F2E8D5','#4A5378','#E2D3B8']); E.moon(c,1240,lerp(470,250,tilt),250);
  E.clouds(c,t,[{x:-200,y:lerp(760,560,tilt),w:900,h:34,v:14,col:P.night3},{x:900,y:lerp(640,430,tilt),w:700,h:26,v:-10,col:P.night2},{x:300,y:lerp(420,250,tilt),w:520,h:22,v:8,col:P.night2}],P.night2,3);
  const by=lerp(1300,700,tilt); E.roofRow(c,-80,by+40,0.62,14,P.night3,null,P.night3,11);
  E.clouds(c,t,[{x:0,y:by-60,w:1300,h:30,v:20,col:P.night2},{x:1400,y:by-20,w:800,h:24,v:20,col:P.night2}],P.night2,9);
  const ry=by+lerp(300,190,tilt), rs=-0.035, ridgeY=x=>ry+(x-200)*rs;
  E.dither(c,0,by-120,1920,140,'#2E3756',f=>f*0.6);
  poly(c,[[-60,ridgeY(-60)+20],[1700,ridgeY(1700)+20],[1980,H+40],[-60,H+40]],'#2E3756');
  for(let x=-60;x<1700;x+=40){ const y0=ridgeY(x)+20; poly(c,[[x,y0],[x+15,y0],[x+15+(x-820)*0.25,H+40],[x+(x-820)*0.25,H+40]],'#1C2238'); }
  poly(c,[[-60,ridgeY(-60)-6],[1700,ridgeY(1700)-6],[1700,ridgeY(1700)+24],[-60,ridgeY(-60)+24]],'#0E1020');
  poly(c,[[-60,ridgeY(-60)-14],[1700,ridgeY(1700)-14],[1700,ridgeY(1700)-4],[-60,ridgeY(-60)-4]],'#4A5378');
  const ox=1700,oy2=ridgeY(1700); poly(c,[[ox-10,oy2+26],[ox-10,oy2-40],[ox+20,oy2-70],[ox+60,oy2-62],[ox+70,oy2-20],[ox+50,oy2+26]],'#0E1020'); circ(c,ox+30,oy2-24,12,'#4A5378');
  const drop=ei(inv(8.4,8.93,t)); const x=1180, y=ridgeY(1180)-8+drop*900;
  if(t<6.2) Ja(c,'crouch',t,0,x,y+4,-1); else if(t<8.2) Ja(c,'idle',t,6.2,x,y+4,-1); else Ja(c,'jump',t,8.2,x,y+4,-1);
  // the red scarf is the first colour we see once the scroll opens
  const u=eio(inv(0.25,1.9,t)); if(u<1){ const half=lerp(0,980,u); rect(c,0,0,960-half,H,P.paper); rect(c,960+half,0,960-half+2,H,P.paper);
    for(const xr of [960-half,960+half]){ rect(c,xr-18,0,36,H,P.wood); rect(c,xr+2,0,10,H,P.woodS); rect(c,xr-26,-4,52,40,P.ink); rect(c,xr-26,H-36,52,40,P.ink);} }
}
shot('S01',0,8.93,intro);

// izakaya interior (dollhouse cutaway). o: {t0,cam:[a,b,t0,t1], bell:'on'|'off'|number(vanish time)|{put:t}, jay:{mode,x,y,face,t0}, snow, window, ticks}
const KY=1000-1.95*300;
F.BELL_X=60; F.BELL_Y=KY-6;
function izakaya(c,t,o){ const lt=t-o.t0; const m=300; const cam=o.cam||[0,0,0,1];
  const camX=g5(lerp(cam[0],cam[1],eio(inv(cam[2],cam[3],lt))));
  c.save(); c.translate(-camX,0); o._camX=camX;
  rect(c,-400,0,2800,H,'#E9DCC2'); rect(c,-400,0,2800,120,P.woodS); rect(c,-400,110,2800,22,P.wood);
  for(const x of [-260,560,1500]){ rect(c,x,120,46,800,P.wood); rect(c,x+30,120,16,800,P.woodS);}
  const ky=KY; rect(c,-220,ky,330,22,P.woodL); rect(c,-220,ky+22,330,10,P.woodS);
  poly(c,[[-150,ky],[-150,ky-90],[30,ky-90],[30,ky]],P.paper2); poly(c,[[-172,ky-90],[-60,ky-136],[52,ky-90]],P.wood); rect(c,-172,ky-96,224,10,P.woodS); rect(c,-90,ky-80,60,80,P.wood); circ(c,-60,ky-56,12,P.ochre);
  for(const sx of [-190,80]){ capsule(c,sx,ky-6,6,sx,ky-50,7,P.moss); blob(c,[[sx-20,ky-60],[sx,ky-92],[sx+22,ky-62],[sx,ky-48]],P.moss); poly(c,[[sx,ky-92],[sx+22,ky-62],[sx,ky-56]],P.mossS);}
  rect(c,-220,ky-150,330,14,P.ochre); rect(c,-220,ky-142,330,6,P.ochreS);
  for(const zx of [-170,-60,50]){ poly(c,[[zx,ky-136],[zx+16,ky-136],[zx+6,ky-118],[zx+20,ky-118],[zx+8,ky-98],[zx-4,ky-98],[zx+6,ky-118],[zx-8,ky-118]],P.white); }
  // the shrine bell (suzu) with its red-white rope: the film's MacGuffin
  let bellOn=o.bell==='on'||(typeof o.bell==='number'&&t<o.bell)||(o.bell&&o.bell.put!=null&&t>=o.bell.put);
  if(bellOn){ rect(c,F.BELL_X-5,ky-110,10,80,'#4A2A1C'); bell(c,F.BELL_X,F.BELL_Y-20,t); for(let k=0;k<6;k++) rect(c,F.BELL_X-4,ky-10+k*24,8,24,k%2?'#D8402F':'#F5F1E8'); }
  else rect(c,F.BELL_X-5,ky-110,10,80,'#4A2A1C');
  if(typeof o.bell==='number') poof(c,F.BELL_X,F.BELL_Y-30,t,o.bell-0.05);
  if(o.bell&&o.bell.put!=null) { const gl=t-o.bell.put; if(gl>=0&&gl<0.6&&Math.floor(gl*10)%2===0){ rect(c,F.BELL_X-40,F.BELL_Y-25,15,5,'#FFF8EC'); rect(c,F.BELL_X+25,F.BELL_Y-25,15,5,'#FFF8EC'); rect(c,F.BELL_X-3,F.BELL_Y-80,5,15,'#FFF8EC'); } }
  for(let k=0;k<6;k++){ rect(c,640+k*58,190,44,150,k%2?P.woodL:'#EFE3C9'); rect(c,640+k*58,190,44,8,P.woodS);}
  // small high window (night outside; snow in winter)
  const wx=1260,wy=360; rect(c,wx,wy,200,190,'#1C2238'); if(o.snow){ c.save(); c.beginPath(); c.rect(wx,wy,200,190); c.clip(); E.snow(c,t,5,40,{calm:1}); c.restore(); } else { circ(c,wx+140,wy+60,30,P.moon); }
  c.fillStyle=P.wood; c.fillRect(wx+96,wy,8,190); c.fillRect(wx,wy+92,200,8); rect(c,wx-10,wy-10,220,12,P.wood); rect(c,wx-10,wy+188,220,12,P.wood);
  const lsw=Math.sin(twos(t)*2.4)*0.04; c.save(); c.translate(1180,140); c.rotate(lsw); rect(c,-3,0,6,90,P.ink); E.lantern(c,0,200,88,P.shu,P.shuS,P.shuS); c.restore();
  const cy=1000-1.0*m;
  // ---- Jay
  const j=o.jay||{mode:'none'}; let steam=null;
  if(j.mode==='eat'){ const ek=SPR.frameAt('L','eat',t,j.t0); J(c,'eat',ek,j.x,j.y,1,null,'L'); const bo=[[20,-42],[20,-54],[18,-62]][ek]; if(ek!==2) steam=[j.x+bo[0]*5,j.y+bo[1]*5]; }
  else if(j.mode==='chew'){ Ja(c,'chew',t,j.t0||0,j.x,j.y,j.face||1,null,'L'); steam=[j.x+(j.face||1)*22*5,j.y-46*5]; }
  else if(j.mode==='react'){ // eating → bell poof → he turns, hand to the hilt
    if(t<j.tr) Ja(c,'chew',t,j.t0||0,j.x,j.y,j.face,null,'L'); else Ja(c,'react',t,j.tr,j.x,j.y-0,j.face,null,'L'); if(t<j.tr) steam=[j.x+j.face*22*5,j.y-46*5]; }
  else if(j.mode==='reach'){ const k=SPR.frameAt('L','reach',t,j.t0); J(c,'reach',k,j.x,j.y,1,null,'L'); if(t<o.bell.put){ const hx=j.x+(k?12:18)*5, hy=j.y-(k?108:78)*5; bell(c,hx,hy,t); } }
  else if(j.mode==='walkout'){ /* empty seat */ }
  else if(j.mode==='fn'){ const r=j.fn(c,t); if(r) steam=r; }
  if(steam&&o.steam!==false) for(let k=0;k<3;k++){ const ph=(twos(t)*0.6+k/3)%1; const sx=steam[0]-20+k*20+Math.sin(ph*6+k)*10, sy=steam[1]-20-ph*160; const a=1-ph; if(a>0.15){ capsule(c,sx,sy,6*a+2,sx+8,sy-36,4*a+1,'#F6EEDD'); capsule(c,sx+8,sy-36,4*a+1,sx-2,sy-66,2.5*a+1,'#F6EEDD'); } }
  if(o.thief){ const q=o.thief; const u=inv(q[0],q[1],t); if(u>0&&u<1){ Ja(c,'run',t,q[0],g5(lerp(q[2],q[3],u)),930,q[2]<q[3]?1:-1,'shadow'); } }
  rect(c,-400,cy,2800,40,P.woodL); rect(c,-400,cy+40,2800,H-cy,P.wood); rect(c,-400,cy+40,2800,14,P.woodS);
  for(let x=-380;x<2400;x+=160) rect(c,x,cy+70,8,H,P.woodS);
  rect(c,560,cy-110,40,110,'#EFE3C9'); rect(c,572,cy-140,16,30,'#EFE3C9'); rect(c,560,cy-60,40,12,P.ai); rect(c,588,cy-110,12,110,P.paper2);
  rect(c,980,cy-6,110,6,P.woodS);
  const gx=1560; rect(c,gx,120,1.0*m+40,880,o.snow?'#4A5378':'#3A2A22'); if(o.snow){ c.save(); c.beginPath(); c.rect(gx,120,340,880); c.clip(); E.snow(c,t,9,30,{calm:1}); c.restore(); }
  E.pebbles(c,gx+20,930,1.0*m,70,5,[P.stone,P.stoneL,P.stoneS]); rect(c,gx+20,900,1.0*m,30,P.woodL);
  const nsw=Math.sin(twos(t)*1.8)*6; c.save(); c.beginPath(); c.rect(gx-10,140,1.0*m+60,300); c.clip();
  for(let k=0;k<3;k++){ const nx=gx+k*(m/3+14), w=m/3+8; c.save(); c.beginPath(); c.rect(nx+nsw*(k*0.4),150,w,280); c.clip(); rect(c,nx-20,150,w+40,280,P.ai); seigaiha(c,nx-20,330,w+40,120,22,P.ai,P.aiL); c.restore(); }
  c.restore(); rect(c,gx-20,140,1.0*m+80,16,P.wood);
  if(o.ticks){ const tk=inv(0,0.4,lt-o.ticks)*(1-inv(1.6,2.0,lt-o.ticks)); if(tk>0){ const yy=1010; const ww=1.0*m*eo(tk); rect(c,gx+20,yy,ww,6,P.shu); rect(c,gx+20,yy-18,6,30,P.shu); if(tk>0.95) rect(c,gx+14+1.0*m,yy-18,6,30,P.shu); } }
  c.restore();
}
F.izakaya=izakaya;
// S02 8.93–14.33: truck from the kamidana (the bell glints) to Jay at the counter; miso on 「我坐着喝味噌汤」
shot('S02',8.93,14.33,(c,t)=>izakaya(c,t,{t0:8.93,cam:[-260,0,0,2.9],bell:'on',ticks:2.88,jay:{mode:'eat',x:820,y:850,t0:8.93+4.05-10/30}}),{k:'mosaic',d:0.6});
// S03 14.33–16.33: exterior cutaway — a faceless shadow runs the izakaya roofline while Jay eats inside
shot('S03',14.33,16.33,(c,t)=>{ const lt=t-14.33; const camX=g5(lerp(0,80,lt/2)); E.facade(c,t,camX,{silhouette:true});
  c.save(); c.translate(-camX,0); const u=inv(0.35,1.6,lt); if(u>0&&u<1) Ja(c,'run',t,14.68,g5(lerp(1700,-150,u)),178,-1,'shadow'); c.restore(); });
// S04 16.33–18.60: reverse angle — the bell vanishes in a puff; Jay turns, hand on the hilt; the thief slips out through the noren
shot('S04',16.33,18.60,(c,t)=>izakaya(c,t,{t0:16.33,cam:[-260,-240,0,2.2],bell:17.18,thief:[17.3,18.1,700,1900],jay:{mode:'react',x:1150,y:930,face:-1,t0:16.33,tr:17.32}}));
// S05 18.60–20.72: torii tunnel chase (Jay runs, camera tracks); 「闪过一个画面」 = 3-frame flash of the leader
shot('S05',18.60,20.72,(c,t)=>{ const lt=t-18.60; E.toriiTunnel(c,t,lt*900,{}); Ja(c,'run',t,18.6,760,880,1);
  if(t>=19.754&&t<19.754+4/30){ rect(c,0,0,W,H,'#F2E8D5'); J(c,'idle',0,960,960,-1,'silL','L'); } },{k:'wipe',d:0.5});
// S06 20.72–22.87: alley corner — masked, the blowgun dart on 「吹暗箭」; the thief poofs away just before it lands
function corner(c,t,o){ const lt=t-o.t0, sn=o.snow;
  E.sky(c,P.night); E.stars(c,t,6,40,560,['#F2E8D5','#4A5378']); E.moon(c,420,190,110,{});
  E.clouds(c,t,[{x:-100,y:300,w:700,h:20,v:6,col:P.night2}],P.night2,21); E.roofRow(c,-120,520,0.7,10,P.night3,null,P.night3,31);
  if(sn) for(let x=-120;x<2000;x+=170) E.snowCap(c,x,440,150,x);
  rect(c,0,700,W,380,sn?'#B9B6AC':'#2A3150'); poly(c,[[0,820],[W,760],[W,H],[0,H]],sn?'#E2D3B8':'#323A5C');
  const bx=1120; rect(c,bx,240,W-bx,600,'#3B3047'); rect(c,bx,240,40,600,'#2D2436'); c.fillStyle='#2A2133'; for(let x=bx+70;x<W;x+=18) c.fillRect(x,380,6,380);
  poly(c,[[bx-60,250],[W,170],[W,250],[bx-30,300]],P.ink); c.fillStyle='#262B40'; for(let x=bx-40;x<W;x+=26) c.fillRect(x,206-(x-bx)*0.04,8,70); if(sn) poly(c,[[bx-60,250],[W,170],[W,182],[bx-60,262]],'#F2E8D5');
  poly(c,[[bx+200,840],[bx+520,840],[bx+640,1080],[bx+80,1080]],sn?'#F2E8D5':'#3E4466');
  c.save(); c.translate(bx+360,420); rect(c,-30,-120,60,10,P.ink); E.lantern(c,0,0,52,P.ochre,P.ochreS,P.ochreS); c.restore();
  const x=bx-30,y=930; poly(c,[[x-60,y+4],[x+220,y+4],[x+380,y+70],[x+40,y+70]],sn?'#B9B6AC':'#252B45');
  // target: runs away down the street (thief) or a sentinel standing guard (winter)
  const tg=o.target; let hit=false;
  if(tg.kind==='run'){ const u=inv(tg.t0,tg.t0+1.9,t); if(t<tg.tp&&u>0) Ja(c,'run',t,tg.t0,g5(lerp(760,120,u)),905,-1,'shadow'); poof(c,g5(lerp(760,120,inv(tg.t0,tg.t0+1.9,tg.tp))),800,t,tg.tp); }
  else { if(t<tg.tp) Ja(c,'idle',t,0,300,905,1,'shadow'); poof(c,300,800,t,tg.tp); }
  const tB=o.tBlow-16/30; const L0=t<tB?Ja(c,'crouch',t,o.t0,x,y,-1):Ja(c,'blowgun',t,tB,x,y,-1);
  const df=inv(o.tBlow,o.tBlow+0.6,t); if(df>0&&df<1){ const mx=L0[0]-27, my=L0[1]-27; const m=c.getTransform(); const tx=tg.kind==='run'?-20:Math.round(m.a*330+m.e); SPR.blit(c,'FX','dart',0,Math.round(lerp(mx-4,tx,eo(df))),my,-1); }
  if(sn) E.snow(c,t,21,90,{});
}
F.corner=corner;
shot('S06',20.72,22.87,(c,t)=>corner(c,t,{t0:20.72,tBlow:21.86,target:{kind:'run',t0:20.72,tp:22.3}}));
// S07 22.87–25.08: 「幕府又重现」 — tilt up from the street to the Shadow castle; banners rise on the beats
function castleShot(c,t,o){ const lt=t-o.t0; const tilt=eio(inv(0,1.6,lt)); const dy=g5(lerp(-420,0,tilt))*-1; const sn=o.snow;
  E.sky(c,'#1C2238'); E.stars(c,t,41,70,800,['#F2E8D5','#4A5378']); c.save(); c.translate(0,dy*0.3); E.moon(c,1380,220,140,{}); c.restore();
  c.save(); c.translate(0,dy);
  poly(c,[[-100,1080],[-100,820],[500,700],[900,640],[1400,660],[2000,760],[2000,1080]],'#22382A'); if(sn) poly(c,[[500,700],[900,640],[1400,660],[1400,680],[900,660],[500,720]],'#F2E8D5');
  E.castle(c,t,1000,650,1.0,{snow:sn,banners:i=>clamp((t-o.t0-0.6-i*0.14)/0.25,0,1)});
  // stone wall foreground, a shadow runs the parapet toward the castle
  rect(c,-100,900,2100,200,'#43475A'); c.fillStyle='#2E3756'; for(let x=-100;x<2000;x+=80) c.fillRect(x,900,6,200); rect(c,-100,890,2100,14,sn?'#F2E8D5':'#565C70');
  c.restore();
  if(o.runner||o.jay){ const u=inv(0.6,2.1,lt); if(u>0&&u<1) Ja(c,'run',t,o.t0,g5(lerp(-80,1200,u)),885,1,o.jay?null:o.runner); }
  if(sn) E.snow(c,t,43,110,{});
}
F.castleShot=castleShot;
shot('S07',22.87,25.08,(c,t)=>castleShot(c,t,{t0:22.87,runner:'shadow'}));
// S08 25.08–28.49: memory as a silent film (scanline wipe in) — the thief rides the far carriage with the bell; Jay on the near roof
function yamanote(c,t,o){ const tq=Math.floor(t*12)/12; const m=100; const A='#26304F',B='#E8DCC4',Bm='#B8AE9A',Am='#3E4870',Bd='#CFC3AA';
  rect(c,0,0,W,H,B); E.moon(c,1480,300,110,{col:'#F3EAD6',colS:'#DCD0B8'});
  E.clouds(c,tq,[{x:100,y:250,w:600,h:20,v:-30,col:Bd},{x:900,y:390,w:500,h:16,v:-40,col:Bd}],Bd,5);
  const deck=840, scroll=tq*620;
  c.save(); c.translate(-((scroll*0.15)%1400),0); E.roofRow(c,-200,deck-40,0.6,30,Bm,null,Bm,41); c.restore();
  const wireY=deck-0.95*m-3.35*m-2.3*m;
  for(let k=0;k<6;k++){ const px=((k*420-scroll)%2520+2520)%2520-300; rect(c,px,wireY-16,14,deck-wireY+16,A); rect(c,px-6,wireY-16,90,10,A); }
  rect(c,0,wireY,W,3,A);
  rect(c,0,deck,W,34,A); rect(c,0,deck+34,W,H,A); const off=scroll%240; for(let x=-off-240;x<W+240;x+=240){ c.beginPath(); c.arc(x+120,deck+200,86,Math.PI,0); c.lineTo(x+206,H); c.lineTo(x+34,H); c.closePath(); c.fillStyle=B; c.fill(); }
  const cx=-260, L=17*m, bodyB=deck-0.95*m, bodyT=bodyB-3.0*m, roofT=bodyT-0.35*m;
  for(const ox of [0,L+40]){ const x0=cx+ox;
    rrect(c,x0,roofT,L,(bodyB-roofT),[46,46,6,6],A); rect(c,x0,bodyT+2.0*m,L,8,Bm);
    for(let k=0;k<10;k++){ const ww=(L-260)/10; const wx=x0+130+k*ww; rrect(c,wx+8,bodyT+0.55*m,ww-30,1.05*m,6,B); rect(c,wx+8+(ww-30)*0.58,bodyT+0.55*m,(ww-30)*0.42,1.05*m,Bd); }
    rrect(c,x0+40,bodyT+0.4*m,64,2.3*m,6,Am); rrect(c,x0+L-104,bodyT+0.4*m,64,2.3*m,6,Am);
    poly(c,[[x0+40,roofT+6],[x0+L-40,roofT+6],[x0+L-80,roofT-10],[x0+80,roofT-10]],Am);
    for(const bx of [x0+240,x0+L-240]){ rect(c,bx-130,bodyB,260,22,Am); for(const wx of [bx-75,bx+75]){ circ(c,wx,deck-0.42*m,0.42*m,A); circ(c,wx,deck-0.42*m,0.16*m,Bm); const a=tq*14; rect(c,wx+Math.cos(a)*24-5,deck-0.42*m+Math.sin(a)*24-5,10,10,B);} }
    const pg=x0+L*0.18; poly(c,[[pg-60,roofT-10],[pg,wireY+4],[pg+60,roofT-10],[pg,roofT-40]],A); rect(c,pg-70,wireY,140,8,A); }
  Ja(c,'ride',tq,0,1040,roofT-12,1,'duo');
  (o.riders||[]).forEach((x,k)=>Ja(c,'ride',tq,k*0.1,x,roofT-12,-1,'shadow'));
  if(o.bellX){ bell(c,o.bellX,roofT-150,t); }
  if(o.snow){ const r=mulberry(Math.floor(t*12)); for(let k=0;k<70;k++){ const sx=((r()*2200-tq*500)%2000+2000)%2000-40, sy=r()*H; rect(c,g5(sx),g5(sy),5,5,B);} }
  const j=Math.round((hash(Math.floor(t*12))-0.5)*4); const bar=110; rect(c,0,0,W,bar+j,'#14182A'); rect(c,0,H-bar+j,W,bar,'#14182A');
  for(let x=20-((tq*240)%90);x<W;x+=90){ rrect(c,x,30+j,46,46,8,B); rrect(c,x,H-bar+32+j,46,46,8,B); }
  const r=mulberry(Math.floor(t*12)); for(let k=0;k<2;k++){ if(r()<0.6){ const sx=r()*W; rect(c,sx,bar,2,H-2*bar,Bd); } }
}
F.yamanote=yamanote;
shot('S08',25.08,28.49,(c,t)=>yamanote(c,t,{riders:[1760],bellX:1700}),{k:'wipe',d:0.6});
})(window);
