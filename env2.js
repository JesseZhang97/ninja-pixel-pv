// env2.js — extra environments for the full film (flat fills on the 1920 world, quantized to NINJA-32 later).
(function(G){
const {P,mulberry,hash,clamp,lerp,poly,rect,circ,ell,rrect,capsule,blob,kasumi,seigaiha}=G.K; const E=G.E;
const W=1920,H=1080, g5=v=>Math.round(v/5)*5;  // snap to the low-res pixel grid
// falling snow on the 5-px grid; frozen=true holds positions (time-stop)
E.snow=(c,t,seed,n,opt={})=>{ const r=mulberry(seed); const tt=opt.freeze!=null?Math.min(t,opt.freeze):t;
  for(let k=0;k<n;k++){ const x0=r()*2100, sp=40+r()*70, ph=r()*30, big=r()<0.25; const sway=Math.sin(tt*1.3+k)*20*(opt.calm?0.3:1);
    const x=((x0+sway-tt*(opt.wind||25))%2100+2100)%2100-90, y=((ph*60+tt*sp)%(H+60))-30; c.fillStyle=k%5===0?'#E2D3B8':'#FFF8EC'; c.fillRect(g5(x),g5(y),big?10:5,big?10:5); } };
// ground snow cap on a horizontal surface
E.snowCap=(c,x,y,w,seed)=>{ const r=mulberry(seed); rect(c,x,y-10,w,12,'#F2E8D5'); for(let s=x;s<x+w;s+=20){ if(r()<0.5) rect(c,s,y-15,20,6,'#F2E8D5'); } };
// izakaya street facade (exterior): warm window, noren, red lantern, neighbours
E.facade=(c,t,camX,opt={})=>{ const sn=opt.snow;
  rect(c,0,0,W,H,P.night); E.stars(c,t,13,50,500,['#F2E8D5','#4A5378']); E.moon(c,opt.moonX||1500,180,90,{});
  c.save(); c.translate(g5(-camX*0.3),0); E.roofRow(c,-300,560,0.8,16,P.night3,null,'#323B5E',91,{lattice:'#2A3252',lamp:'#8A5A1E'}); if(sn) for(let x=-300;x<2600;x+=200) E.snowCap(c,x,480,180,x); c.restore();
  c.save(); c.translate(g5(-camX),0);
  // street
  rect(c,-600,860,3200,300,sn?'#E2D3B8':'#2A3150'); rect(c,-600,860,3200,8,sn?'#B9B6AC':'#3E4466');
  for(const [bx,bw,col] of [[-560,520,'#3B3047'],[1500,700,'#33384F']]){ rect(c,bx,330,bw,530,col); poly(c,[[bx-40,340],[bx+bw+40,340],[bx+bw,290],[bx,290]],P.ink); if(sn) E.snowCap(c,bx-30,292,bw+60,bx); c.fillStyle='#2A2133'; for(let x=bx+30;x<bx+bw-20;x+=18) c.fillRect(x,430,6,300); }
  // the izakaya
  const ix=0, iw=1460; rect(c,ix,250,iw,610,'#5E3826'); rect(c,ix,250,iw,30,'#4A2A1C');
  poly(c,[[ix-80,260],[ix+iw+80,260],[ix+iw+20,170],[ix-20,170]],'#2B3A67'); c.fillStyle='#1C2238'; for(let x=ix-60;x<ix+iw+60;x+=26) c.fillRect(x,180,8,80); if(sn) E.snowCap(c,ix-70,175,iw+140,7);
  // warm window (lattice) with the counter glow; opt.silhouette draws a seated figure shadow
  const wx=180, wy=420, ww=620, wh=300; rect(c,wx,wy,ww,wh,'#D9A441'); rect(c,wx,wy+wh-80,ww,80,'#8A5A1E');
  if(opt.silhouette){ const sx=wx+380, sy=wy+wh-80; circ(c,sx,sy-150,42,'#8A5A1E'); poly(c,[[sx-55,sy],[sx+55,sy],[sx+45,sy-110],[sx-45,sy-110]],'#8A5A1E'); }
  c.fillStyle='#4A2A1C'; for(let x=wx;x<=wx+ww;x+=62) c.fillRect(x-4,wy,8,wh); for(let y=wy;y<=wy+wh;y+=75) c.fillRect(wx,y-4,ww,8); rect(c,wx-14,wy-14,ww+28,14,'#4A2A1C'); rect(c,wx-14,wy+wh,ww+28,14,'#4A2A1C');
  if(sn) E.snowCap(c,wx-14,wy+wh+2,ww+28,3);
  // door + noren (indigo, 3 panels, sways)
  const dx=980, dw=320; rect(c,dx,400,dw,460,'#2A1E1A'); rect(c,dx,560,dw,300,'#D9A441'); const nsw=Math.sin(Math.floor(t*15)/15*1.8)*6;
  for(let k=0;k<3;k++){ c.save(); c.beginPath(); c.rect(dx+k*(dw/3)+2+nsw*k*0.3,410,dw/3-4,230); c.clip(); rect(c,dx-20,410,dw+40,230,'#2B3A67'); seigaiha(c,dx-20,560,dw+40,80,20,'#2B3A67','#3E4E86'); c.restore(); }
  rect(c,dx-20,396,dw+40,16,'#4A2A1C');
  // red chōchin by the door
  const lsw=Math.sin(Math.floor(t*15)/15*2.2)*0.05; c.save(); c.translate(dx-80,330); c.rotate(lsw); rect(c,-3,0,6,40,P.ink); E.lantern(c,0,110,60,'#D8402F','#A82A26','#A82A26'); c.restore();
  c.restore();
};
// torii tunnel (side view): dense vermilion torii scrolling past; far hill + lanterns
E.toriiTunnel=(c,t,camX,opt={})=>{ const sn=opt.snow;
  rect(c,0,0,W,H,'#1C2238'); E.stars(c,t,17,40,400,['#F2E8D5']); E.moon(c,1500,170,80,{});
  c.save(); c.translate(g5(-camX*0.2),0); poly(c,[[-200,700],[600,520],[1300,600],[2400,480],[2400,1080],[-200,1080]],'#22382A'); c.restore();
  c.save(); c.translate(g5(-camX*0.5),0); for(let k=-2;k<30;k++){ const x=k*150; rect(c,x,560,18,320,'#6E1A1E'); rect(c,x-30,560,90,16,'#6E1A1E'); } c.restore();
  rect(c,0,860,W,220,sn?'#E2D3B8':'#43475A'); rect(c,0,860,W,10,sn?'#F2E8D5':'#7E7C76');
  if(sn) E.snowCap(c,0,862,W,5);
  c.save(); const off=((camX)%240+240)%240; c.translate(-g5(off),0); for(let k=-1;k<11;k++){ const x=k*240; rect(c,x,320,36,560,'#D8402F'); rect(c,x+24,320,12,560,'#A82A26'); rect(c,x-60,350,240,26,'#D8402F'); rect(c,x-80,310,280,30,'#0E1020'); rect(c,x-70,300,260,12,'#A82A26'); if(sn) rect(c,x-80,300,280,10,'#F2E8D5'); rect(c,x-6,840,48,24,'#0E1020'); } c.restore();
};
// castle on the hill (幕府): stone base, white walls, three roof tiers, gold shachihoko, nobori banners
E.castle=(c,t,x,y,k,opt={})=>{ const sn=opt.snow, wall=opt.wall||'#E2D3B8', roof=opt.roof||'#2B3A67', stone=opt.stone||'#43475A';
  poly(c,[[x-260*k,y],[x+260*k,y],[x+200*k,y-120*k],[x-200*k,y-120*k]],stone); c.fillStyle='#2E3756'; for(let r=0;r<4;r++) c.fillRect(x-240*k+r*12*k,y-30*k*(r+1),480*k-r*24*k,4*k);
  const tiers=[[200,90],[150,80],[100,70]]; let yy=y-120*k;
  tiers.forEach(([w,h],i)=>{ rect(c,x-w*k*0.8,yy-h*k,w*k*1.6,h*k,wall); c.fillStyle='#2E3756'; for(let wx=x-w*k*0.6;wx<x+w*k*0.6;wx+=40*k) c.fillRect(wx,yy-h*k*0.7,14*k,22*k);
    yy-=h*k; poly(c,[[x-w*k*1.1,yy+12*k],[x+w*k*1.1,yy+12*k],[x+w*k*0.7,yy-40*k],[x-w*k*0.7,yy-40*k]],roof); poly(c,[[x-w*k*1.1,yy+12*k],[x-w*k*1.25,yy-6*k],[x-w*k*0.95,yy+2*k]],roof); poly(c,[[x+w*k*1.1,yy+12*k],[x+w*k*1.25,yy-6*k],[x+w*k*0.95,yy+2*k]],roof);
    if(sn) rect(c,x-w*k*0.7,yy-44*k,w*k*1.4,10*k,'#F2E8D5'); yy-=40*k; });
  for(const sx of [-1,1]) poly(c,[[x+sx*60*k,yy+4*k],[x+sx*72*k,yy-26*k],[x+sx*80*k,yy-10*k],[x+sx*68*k,yy+4*k]],'#D9A441');
  if(opt.banners){ const bw=Math.sin(Math.floor(t*15)/15*3); for(let i=0;i<9;i++){ const bx=x-420*k+i*105*k, by=y+10*k, up=opt.banners(i); if(up<=0) continue; rect(c,bx,by-260*k*up,6*k,260*k*up,'#0E1020'); poly(c,[[bx+6*k,by-250*k*up],[bx+56*k+bw*6*k,by-246*k*up],[bx+56*k,by-120*k*up],[bx+6*k,by-120*k*up]],i%2?'#D8402F':'#2B3A67'); } }
};
// moving train, night palette, side-on (carriage roofs at roofY); scroll = world px travelled
E.trainRun=(c,t,scroll,opt={})=>{ const sn=opt.snow;
  rect(c,0,0,W,H,'#1C2238'); E.stars(c,t,23,50,500,['#F2E8D5','#4A5378']); E.moon(c,1450,190,110,{});
  c.save(); c.translate(-g5((scroll*0.08)%1600),0); E.roofRow(c,-200,700,0.7,40,'#2E3756',null,'#2E3756',43); E.roofRow(c,1400,700,0.7,40,'#2E3756',null,'#2E3756',43); if(sn) for(let x=-200;x<3200;x+=160) E.snowCap(c,x,612,140,x); c.restore();
  // catenary masts (fast)
  for(let k=0;k<7;k++){ const px=((k*380-scroll*1.0)%2660+2660)%2660-300; rect(c,g5(px),210,20,660,'#0E1020'); rect(c,g5(px)-10,220,120,14,'#0E1020'); }
  rect(c,0,232,W,4,'#0E1020');
  // carriages: 17 m bodies with gaps; roof top at y=760 (Jay's feet line 755)
  const L=1500, G=140, period=L+G, off=((scroll%period)+period)%period;
  for(let k=-1;k<3;k++){ const x0=g5(k*period-off);
    rrect(c,x0,760,L,300,[30,30,0,0],'#2B3A67'); rect(c,x0,760,L,16,'#3E4E86'); if(sn) rect(c,x0+10,750,L-20,12,'#F2E8D5');
    for(let w=0;w<9;w++){ rect(c,x0+120+w*150,830,96,90,'#D9A441'); rect(c,x0+120+w*150,830,96,16,'#8A5A1E'); }
    for(let v=0;v<3;v++) rect(c,x0+260+v*480,738,120,22,'#43475A');
    const pg=x0+L*0.5; for(const sd of [-1,1]){ capsule(c,pg+sd*50,740,4,pg,480,4,'#0E1020'); capsule(c,pg,480,4,pg+sd*30,250,4,'#0E1020'); } rect(c,pg-60,236,120,10,'#0E1020'); }
  rect(c,0,1000,W,80,'#0E1020');
  return {L,G,period,off};
};
// hill crest under a giant moon (backlit silhouettes)
E.moonHill=(c,t,opt={})=>{ rect(c,0,0,W,H,'#1C2238'); E.stars(c,t,29,70,700,['#F2E8D5','#4A5378','#EBA9A5']); E.dither(c,0,500,W,300,'#2E3756',f=>f*0.6);
  E.moon(c,960,560,400,{});
  poly(c,[[-50,1080],[-50,830],[300,790],[700,770],[1100,772],[1500,790],[1970,830],[1970,1080]],'#0E1020');
  const r=mulberry(4); c.fillStyle='#0E1020'; for(let k=0;k<70;k++){ const x=r()*1920; const y=790+Math.abs(x-900)*0.04-10; c.fillRect(g5(x),g5(y-15-r()*20),5,30); }
};
// castle roof close (the final stage): big tiled slope + ridge at ridgeY, gold shachihoko, city below
E.castleRoof=(c,t,camX,opt={})=>{ const sn=opt.snow, ry=opt.ridgeY||760;
  rect(c,0,0,W,H,'#1C2238'); E.stars(c,t,31,60,600,['#F2E8D5','#4A5378']); E.dither(c,0,420,W,200,'#2E3756',f=>f*0.6); E.moon(c,opt.moonX||1300,260,opt.moonR||170,{});
  c.save(); c.translate(g5(-camX*0.25),0); E.roofRow(c,-300,700,0.55,30,'#2E3756',null,'#2E3756',61,{lamp:'#8A5A1E'}); c.restore();
  c.save(); c.translate(g5(-camX),0);
  poly(c,[[-400,ry+20],[2600,ry+20],[2600,1080],[-400,1080]],'#2B3A67'); c.fillStyle='#1C2238'; for(let x=-400;x<2600;x+=40) c.fillRect(x,ry+30,12,300);
  rect(c,-400,ry-6,3000,30,'#0E1020'); rect(c,-400,ry-16,3000,12,sn?'#F2E8D5':'#4A5378');
  if(!opt.plain) for(const ex of [140,1690]){ poly(c,[[ex,ry-6],[ex+30,ry-90],[ex+80,ry-120],[ex+60,ry-60],[ex+90,ry-6]],'#D9A441'); rect(c,ex+46,ry-100,10,10,'#0E1020'); }
  if(sn) for(let x=-400;x<2600;x+=200) E.snowCap(c,x,ry+40,120,x);
  c.restore();
};
// story scroll (makimono): washi band with rods; returns band rect
E.scroll=(c,t,opt={})=>{ rect(c,0,0,W,H,'#1C2238'); E.stars(c,t,37,40,1080,['#4A5378']);
  const y0=200,y1=880; rect(c,60,y0,1800,y1-y0,'#F2E8D5'); rect(c,60,y0,1800,30,'#E2D3B8'); rect(c,60,y1-30,1800,30,'#E2D3B8');
  for(const xr of [40,1860]){ rect(c,xr-20,y0-40,40,y1-y0+80,'#7A4B34'); rect(c,xr-28,y0-56,56,30,'#0E1020'); rect(c,xr-28,y1+26,56,30,'#0E1020'); }
  return [60,y0,1800,y1-y0]; };
G.E=E;
})(window);
