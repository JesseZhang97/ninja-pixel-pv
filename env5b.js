// env5b.js — v4 reality + duel sets: HOME (ikebana room, modern Kyoto apartment), BAMBOO STREAM (duel), ALLEY CORNER (这里),
// big readable shrine bell for the izakaya, falling cut bamboo.
(function(G){
const {P,mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,rrect,capsule,blob}=G.K; const E=G.E, F=G.FILM, E4=G.E4, E5=G.E5; const W=1920,H=1080;
const g5=v=>Math.round(v/5)*5; const C=E4.C;
const smoke=(c,t,x,y,n,col)=>{ for(let k=0;k<n;k++){ const ph=((t*0.25)+k/n)%1; const sx=x+Math.sin(ph*7+k*2)*20*ph, sy=y-ph*260; if(ph>0.85) continue; rect(c,g5(sx),g5(sy),5,15,col||'#B9B6AC'); if(ph>0.3) rect(c,g5(sx+10*Math.sin(ph*9)),g5(sy-20),5,10,col||'#B9B6AC'); } };
E5.smoke=smoke;
// ---------------- HOME ----------------
E5.VASE=[1330,836];
E5.home=(c,t,o={})=>{ const camX=g5(o.camX||0); c.save(); c.translate(-camX,0);
  rect(c,-300,0,W+600,90,C.w0); for(let x=-280;x<W+300;x+=220){ rect(c,x,0,30,90,C.w1); } rect(c,-300,80,W+600,15,C.w2);
  rect(c,-300,95,W+600,620,'#E2D3B8'); const r=mulberry(9); for(let k=0;k<220;k++){ rect(c,g5(-300+r()*(W+600)),g5(100+r()*600),r()<0.5?10:5,5,r()<0.5?'#F2E8D5':'#D4C4A4'); }
  F.planks(c,-300,715,W+600,125,25,[C.w3,C.w2,C.w4,C.w1],31,false);
  for(const x of [-60,660,1100,1820]){ rect(c,x,95,40,745,C.w2); rect(c,x+30,95,10,745,C.w1); rect(c,x,95,8,745,C.w4); }
  // tokonoma alcove: scroll (ink mountain + seal), incense with smoke, a small pine bonsai
  rect(c,120,140,520,680,'#C9B48E'); rect(c,120,140,520,30,C.w1); rect(c,120,800,520,40,C.w3); rect(c,120,795,520,8,C.w5);
  rect(c,300,180,160,520,'#F2E8D5'); rect(c,300,180,160,26,C.ai); rect(c,300,674,160,26,C.ai); rect(c,292,170,176,12,C.w1); rect(c,292,698,176,14,C.w1);
  poly(c,[[310,620],[350,470],[380,520],[420,400],[450,560],[450,620]],'#B9B6AC'); poly(c,[[330,620],[370,540],[400,580],[430,500],[450,620]],'#7E7C76'); circ(c,410,260,26,'#E2D3B8'); rect(c,430,640,15,15,'#A82A26');
  rect(c,520,770,50,25,'#43475A'); rect(c,515,765,60,8,'#7E7C76'); smoke(c,t,545,760,5,'#B9B6AC');
  rect(c,180,760,90,35,'#5E3826'); capsule(c,225,760,6,215,700,5,C.w1); blob(c,[[170,700],[215,670],[265,700],[215,715]],C.fol2); blob(c,[[195,690],[230,660],[260,690]],'#46613F');
  // window: modern Kyoto at night (city lights, a crane's red beacon), rain streaks / snow, shoji half open
  const sx=1180, sy=140, sw=600, sh=560; rect(c,sx,sy,sw,sh,'#141A30'); c.save(); c.beginPath(); c.rect(sx,sy,sw,sh); c.clip();
  E.stars(c,t,77,30,500,['#8C9CC8']); if(o.snow) E.moon(c,sx+460,sy+110,50,{});
  const rr=mulberry(14); for(let k=0;k<14;k++){ const bx=sx+k*45, bh=80+rr()*220; rect(c,bx,sy+sh-bh,42,bh,k%2?'#1C2238':'#253052'); for(let wy=sy+sh-bh+15;wy<sy+sh;wy+=25) for(let wx=bx+6;wx<bx+38;wx+=12) if(rr()<0.35) rect(c,wx,wy,5,10,rr()<0.7?'#B8562E':'#FFC870'); }
  rect(c,sx+420,sy+190,5,170,'#2E3756'); rect(c,sx+330,sy+190,180,5,'#2E3756'); if(Math.floor(t*1.5)%2) rect(c,sx+505,sy+185,10,10,'#D8402F');
  if(o.snow){ rect(c,sx,sy+sh-50,sw,50,'#DDE6F2'); c.save(); c.translate(sx-100,0); E.snow(c,t,81,50,{calm:1}); c.restore(); }
  else { const r2=mulberry(3); for(let k=0;k<22;k++){ const dx=g5(sx+r2()*sw), ph=r2(); const yy=sy+((ph*sh+t*(120+r2()*80))%sh); rect(c,dx,g5(yy),5,15,'#5A6A9A'); rect(c,dx,g5(yy)+15,5,5,'#8C9CC8'); } F.rain(c,t,{seed:9,splash:false,dens:0.35}); }
  c.restore();
  c.fillStyle=C.w2; for(let x=sx;x<=sx+sw;x+=150) c.fillRect(x-5,sy,10,sh); c.fillRect(sx,sy+sh/2-5,sw,10); rect(c,sx-20,sy-12,sw+40,16,C.w1); rect(c,sx-20,sy+sh,sw+40,18,C.w1);
  rect(c,sx+sw-220,sy,220,sh,'#E8DCC4'); c.fillStyle=C.w3; for(let x=sx+sw-220;x<=sx+sw;x+=55) c.fillRect(x,sy,5,sh); for(let y=sy;y<=sy+sh;y+=70) c.fillRect(sx+sw-220,y,220,5);
  // tatami floor (weave + borders)
  rect(c,-300,840,W+600,700,'#A8C08A'); for(let y=845;y<1540;y+=10) rect(c,-300,y,W+600,5,'#7C9A6E'); rect(c,-300,840,W+600,15,'#2F4A3A'); rect(c,650,840,15,700,'#2F4A3A'); rect(c,1700,840,15,700,'#2F4A3A'); for(let x=-300;x<W+300;x+=40) rect(c,x,840,10,5,'#46613F');
  // andon lamp (warm, flickers)
  const ax=860; rect(c,ax-45,700,90,140,C.w1); rect(c,ax-38,708,76,120,'#FFE7A8'); rect(c,ax-38,708,76,8,'#FFC870'); rect(c,ax-3,708,6,120,C.w3); rect(c,ax-38,766,76,5,C.w3); rect(c,ax-50,830,100,12,C.w0);
  // zabuton + low table + suiban vase with water + ikebana
  rect(c,880,948,260,22,C.ai); rect(c,880,948,260,6,C.aiL);
  rect(c,1080,858,520,22,C.w2); rect(c,1080,846,520,14,C.w4); rect(c,1080,846,520,5,C.w5); rect(c,1110,880,26,80,C.w1); rect(c,1540,880,26,80,C.w1);
  const [vx,vy]=E5.VASE; ell(c,vx,vy+5,110,22,0,'#12303A'); ell(c,vx,vy,104,18,0,'#1F4E5A'); ell(c,vx,vy-2,90,13,0,'#2F7A80'); rect(c,vx-70,vy-4,40,5,'#A8E0D0'); rect(c,vx+20,vy-2,20,5,'#5FB0A8');
  if(o.rip!=null){ for(let q=0;q<3;q++){ const u=((t-o.rip)*0.9-q*0.25); if(u>0&&u<1) F.ring(c,vx+10,vy-2,lerp(5,95,eo(u)),0.15,q?'#5FB0A8':'#A8E0D0',u); } }
  const br=[[vx,vy-10],[vx-40,vy-130],[vx-110,vy-220],[vx-150,vy-310]]; for(let k=0;k<3;k++) capsule(c,br[k][0],br[k][1],7-k*1.5,br[k+1][0],br[k+1][1],5-k*1.5,C.w1);
  capsule(c,vx-40,vy-130,4,vx+60,vy-210,3,C.w1); capsule(c,vx,vy-10,4,vx+90,vy-100,3,C.fol1);
  for(const [lx,ly,s] of [[vx-70,vy-170,1],[vx+40,vy-190,-1],[vx-130,vy-260,1],[vx+70,vy-90,-1],[vx-20,vy-60,1]]){ blob(c,[[lx,ly],[lx+28*s,ly-14],[lx+44*s,ly+2],[lx+18*s,ly+10]],C.fol2); rect(c,lx+10*s,ly-2,20,5,'#7C9A6E'); }
  for(const [px,py] of [[vx+90,vy-104],[vx-150,vy-312],[vx+55,vy-212]]){ circ(c,px,py,20,'#D8402F'); circ(c,px-5,py-4,10,'#F07850'); circ(c,px+4,py+2,6,'#D9A441'); }
  if(o.bamboo){ for(const [bx,h] of [[vx+30,330],[vx+55,250]]){ rect(c,bx-14,vy-h,28,h,'#46613F'); rect(c,bx,vy-h,8,h,'#7C9A6E'); for(let y=vy-h+60;y<vy;y+=70) rect(c,bx-16,y,32,6,'#2F4A3A'); poly(c,[[bx-14,vy-h],[bx+14,vy-h-25],[bx+14,vy-h+3],[bx-14,vy-h+3]],'#A8C08A'); } }
  const mx=1180; rect(c,mx,800,40,46,'#F2E8D5'); rect(c,mx+40,810,12,25,'#F2E8D5'); rect(c,mx,800,40,8,'#93603C'); E4.steam(c,t,mx+20,795,2,{h:140,s:0.6});
  rect(c,1450,836,60,6,'#7E7C76'); rect(c,1505,830,15,15,'#A82A26');
  // phone on the tatami: buzzes (vibration ticks), screen lights, call bubble
  const ph=o.phone; if(ph!==false){ const ring=ph&&t>=ph.t0&&t<ph.t1; const pjx=ring&&Math.floor(t*30)%2?5:0, px=(ph&&ph.picked&&t>=ph.picked)?-999:740;
    if(px>0){ rect(c,px+pjx,930,70,30,'#141A30'); rect(c,px+5+pjx,935,60,20,ring?'#C8D4F0':'#253052'); if(ring){ rect(c,px+20+pjx,940,30,5,'#2B3A67'); for(const s of [-1,1]){ rect(c,px+35+s*60,925,5,15,'#F2E8D5'); rect(c,px+35+s*75,920,5,25,'#F2E8D5'); } F.light(c,px+35,940,120,'#C8D4F0',0.25,{add:true}); }
      if(ring){ const bx=px-60, by=830; rrect(c,bx,by,220,70,10,'#F2E8D5'); poly(c,[[bx+80,by+70],[bx+110,by+70],[bx+95,by+92]],'#F2E8D5'); rect(c,bx+15,by+20,30,30,'#5FB0A8'); c.save(); c.fillStyle='#0E1020'; c.font='60px "FusionPixelJA"'; c.textBaseline='top'; c.fillText('お母さん',bx+55,by+5); c.restore(); } } }
  c.restore();
  c.save(); c.translate(-camX,0); const fl=0.92+0.08*Math.sin(t*19)*Math.sin(t*5.3);
  F.amb(o.amb||[0.9,0.82,0.74]); F.light(c,ax,760,820,'#FFC870',0.36*fl,{ry:0.7}); F.light(c,ax,760,200,'#FFE7A8',0.25*fl); F.light(c,1330,500,700,'#FFE7A8',0.1,{ry:0.8});
  F.shaft(c,[[sx,sy+sh],[sx+sw-220,sy+sh],[sx+sw-60,1080],[sx+150,1080]],'#8C9CC8',0.1,0.35); F.cast(c,ax,760,{a:0.35}); c.restore(); };
// ---------------- BAMBOO STREAM (duel) ----------------
E5.GYD=930;
E5.bambooDuel=(c,t,o={})=>{ const cam=o.cam||0; const GY=E5.GYD;
  E5.SKY(c,t,10,700); E.moon(c,1450,200,150,{});
  const stalks=(par,col,colS,node,w,seed,yTop,leaf)=>{ c.save(); c.translate(g5(-cam*par),0); const r=mulberry(seed); for(let x=-300;x<2600;x+=w*4+r()*w*4){ const sway=g5(Math.sin(t*0.8+x)*w*0.15); poly(c,[[x,H],[x+w,H],[x+w+sway,yTop],[x+sway,yTop]],col); rect(c,x+w*0.6,yTop,w*0.3,H-yTop,colS); for(let y=H-w*5;y>yTop;y-=w*6) rect(c,x-2,y,w+4,Math.max(5,w*0.18),node);
      if(leaf&&r()<0.6){ const ly=200+r()*400; for(let j=0;j<5;j++){ const lx=x+sway+(j-2)*w*0.9, lyy=ly+j*12+Math.sin(t*1.5+j+x)*6; poly(c,[[lx,lyy],[lx+w*1.6,lyy+8],[lx+w*0.4,lyy+14]],j%2?leaf[0]:leaf[1]); } } } c.restore(); };
  stalks(0.12,'#253052','#2E3756','#1C2238',18,3,-20); E.dither(c,0,300,W,600,'#4A5378',f=>0.15+0.15*f);
  stalks(0.35,'#2C3D45','#33464E','#22313A',30,5,-20,['#2F4A3A','#22382A']);
  stalks(0.7,'#3E5A4C','#4E6E5C','#2D4439',46,8,-20,['#46613F','#2F4A3A']);
  for(const [x0,w] of [[300,90],[900,60],[1350,110]]){ const x=x0+Math.sin(t*0.4+x0)*40; F.shaft(c,[[x,0],[x+w,0],[x+w-380,1080],[x-380,1080]],'#C8D4F0',0.18,0.4); }
  // stream: banks, water, stones, glints, reflections, ripples
  rect(c,0,GY-20,W,25,'#1C262B'); rect(c,0,GY-20,W,5,'#2A3A34'); rect(c,0,GY,W,H-GY,'#12303A'); c.save(); c.translate(g5(-cam),0); const r=mulberry(6); for(let k=0;k<30;k++){ const x=r()*2600-300, y=GY+20+r()*140; ell(c,g5(x),g5(y),25+r()*30,8,0,'#1F4E5A'); rect(c,g5(x-10),g5(y-5),20,5,'#2F7A80'); } c.restore();
  for(let j=0;j<10;j++){ const w=g5(40+Math.sin(t*3+j)*15), off=g5(Math.sin(t*4+j*1.7)*20); rect(c,1450+off-w,GY+20+j*14,w*2,5,j%2?'#C8D4F0':'#8C9CC8'); }
  F.ripples(c,t,{n:7,x0:0,x1:1920,y0:GY+15,y1:H-10,r0:5,r1:40,sq:0.25,col:'#5FB0A8',per:1.2,seed:66});
  F.reflect(c,{y0:GY,y1:H,k:0.55,dark:0.65,amp:1.5,t,tint:'#A8E0D0'});
  const fr=mulberry(12); for(let k=0;k<14;k++){ const fx=fr()*W, fy=300+fr()*500, ph=fr()*6; if(Math.sin(t*3+ph)>0.1){ const x=g5(fx+Math.sin(t*0.7+ph)*60), y=g5(fy+Math.cos(t*0.9+ph)*40); rect(c,x,y,5,5,'#F2D27A'); F.light(c,x,y,25,'#F2D27A',0.15,{add:true}); } }
  F.amb([0.8,0.86,1.0]);
};
E5.bambooFG=(c,t,cam)=>{ for(const [x0,w] of [[200,70],[1750,90]]){ const x=g5(((x0-cam*1.6)%2600+2600)%2600-300); rect(c,x,-20,w,H+40,'#0E1020'); rect(c,x+w-15,-20,10,H+40,'#16261E'); for(let y=100;y<H;y+=280) rect(c,x-4,y,w+8,10,'#16261E'); } };
E5.fallingBamboo=(c,t,tc,x,top)=>{ const u=inv(tc,tc+0.9,t); if(u<=0||u>=1) return; c.save(); c.translate(g5(x+u*120),g5((top||300)+u*u*600)); c.rotate(Math.round(u*6)/10); rect(c,-30,-360,60,360,'#46613F'); rect(c,8,-360,15,360,'#7C9A6E'); for(let y=-300;y<0;y+=90) rect(c,-34,y,68,10,'#2F4A3A'); poly(c,[[-30,0],[30,-50],[30,5],[-30,5]],'#A8C08A'); c.restore(); };
// ---------------- ALLEY CORNER (这里 close) ----------------
E5.corner=(c,t,o={})=>{ const sn=o.snow;
  rect(c,0,0,W,H,'#1C1210'); F.planks(c,0,0,W,900,90,['#33201A','#2A1E1A','#4A2A1C','#140E0C'],44,true);
  // back passage gap: cold moonlight
  rect(c,1500,60,170,840,'#141A30'); rect(c,1530,60,110,840,'#253052'); rect(c,1570,60,30,840,'#5A6A9A'); if(sn){ c.save(); c.beginPath(); c.rect(1530,60,110,840); c.clip(); c.translate(1300,0); E.snow(c,t,55,30,{calm:1}); c.restore(); }
  rect(c,1490,50,190,15,C.w0); rect(c,1490,50,15,860,C.w0); rect(c,1665,50,15,860,C.w0);
  // sake crates stacked + komodaru barrel + bottles
  for(const [x,y,w,h] of [[180,700,300,200],[220,520,260,180],[1100,720,320,180]]){ rect(c,x,y,w,h,C.w2); rect(c,x,y,w,10,C.w4); rect(c,x,y+h-10,w,10,C.w0); rect(c,x+10,y+20,w-20,h-40,C.w1); rect(c,x+w/2-30,y+50,60,60,'#E2D3B8'); rect(c,x+w/2-15,y+60,30,10,'#0E1020'); rect(c,x+w/2-5,y+70,10,30,'#0E1020'); }
  const bx=720; ell(c,bx,900,170,25,0,'#2A1E1A'); rect(c,bx-160,600,320,300,'#C9965E'); for(let y=610;y<900;y+=20) rect(c,bx-160,y,320,5,'#A8744A'); rect(c,bx-160,650,320,15,'#5E3826'); rect(c,bx-160,840,320,15,'#5E3826'); rect(c,bx-90,690,180,130,'#F2E8D5'); rect(c,bx-70,700,140,30,'#A82A26'); rect(c,bx-15,740,30,70,'#0E1020'); ell(c,bx,600,160,22,0,'#A8744A');
  for(let k=0;k<6;k++) { const x=1150+k*40; rect(c,x,620,25,100,k%2?C.tealL:C.w1); rect(c,x+8,600,10,20,k%2?C.tealL:C.w1); rect(c,x+5,650,15,30,'#F2E8D5'); }
  // drip from a pipe into a bucket (ripple)
  rect(c,1350,0,25,300,'#43475A'); rect(c,1340,290,45,20,'#43475A'); const dp=(t*1.3)%1; rect(c,1360,g5(310+dp*520),5,10,'#8C9CC8'); rect(c,1300,850,130,60,'#43475A'); ell(c,1365,850,65,10,0,'#12303A'); if(dp<0.25) F.ring(c,1365,850,lerp(5,50,dp*4),0.2,'#8C9CC8',dp*4);
  rect(c,0,900,W,180,'#2A2F45'); for(let y=900;y<1080;y+=45) for(let x=((y/45)%2)*50;x<W;x+=100){ rect(c,x,y,95,40,'#33384F'); rect(c,x,y,95,5,'#43475A'); }
  F.amb(o.amb||[0.55,0.58,0.82]); F.light(c,o.lx||1100,o.ly||640,520,'#8C9CC8',0.35,{ry:0.8}); F.shaft(c,[[1530,60],[1640,60],[1300,1080],[1100,1080]],'#C8D4F0',0.22,0.45); F.light(c,-100,700,700,'#F09A48',0.3,{ry:0.7}); };
// ---------------- big readable bell for the izakaya kamidana ----------------
E5.bellProp=(c,t,camX,o={})=>{ const kx=E4.KAMI.x+134-g5(camX||0), ky=E4.KAMI.y; c.save(); rect(c,kx-4,ky-80,8,80,C.w1);
  const amp=o.ring!=null?Math.max(0,1-(t-o.ring)/1.6)*0.25:0; const ang=amp*Math.sin((t-(o.ring||0))*11); c.translate(kx,ky); c.rotate(ang);
  E4.bellBig(c,0,60,36,t,{sw:0}); c.restore();
  if(o.glint){ const gl=(t*0.7)%1; if(gl<0.12){ const gx=kx-12,gy=ky+30; rect(c,gx-30,gy,20,5,'#FFF8EC'); rect(c,gx+20,gy,20,5,'#FFF8EC'); rect(c,gx,gy-30,5,20,'#FFF8EC'); rect(c,gx,gy+20,5,20,'#FFF8EC'); } }
  if(o.ring!=null){ const u=t-o.ring; for(let q=0;q<3;q++){ const uu=(u-q*0.3); if(uu>0&&uu<1.2){ const R=g5(lerp(40,150,uu/1.2)); for(let a=-1.1;a<=1.1;a+=0.18){ for(const s of [-1,1]) rect(c,g5(kx+s*Math.cos(a)*R),g5(ky+48+Math.sin(a)*R),5,5,uu<0.6?'#FFE7A8':'#F2D27A'); } } } }
  F.light(c,kx,ky+48,140,'#FFE7A8',0.25); };
})(window);
