// env5.js — v4 "daydream cut": no rim light, a film-wide wind field, lightning, splash, auto clash sparks,
// and every fantasy set rebuilt to the v3-opening level (hand-placed texture, 4–7 parallax layers, ambient life,
// palette-stepped light declared to fx3). Also the reality HOME set, the bamboo-stream duel set, and the 这里 alley corner.
(function(G){
const {P,mulberry,hash,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,rrect,capsule,blob,kasumi}=G.K; const E=G.E, F=G.FILM, SPR=G.SPR, D=G.DATA; const W=1920,H=1080;
const g5=v=>Math.round(v/5)*5; const E5=G.E5={}; const C=G.E4.C;
F.V4=true;
// ---------------- 1. no rim light (Jesse: "为什么人物多了stroke") ----------------
F.rim=()=>{};
// ---------------- 2. wind field: gusts push every petal / snowflake (integrated displacement, so nothing pops) -------------
F.GUSTS=[[47.0,1.6,900],[52.6,1.4,700],[60.6,1.8,1000],[62.4,1.6,1400],[65.0,1.4,600],[69.2,1.2,800],[73.6,1.6,900],[78.9,2.2,1100],[83.0,1.4,300],
  [91.6,1.4,800],[95.6,1.2,700],[119.0,1.5,900],[121.0,0.8,500],[125.4,1.2,700],[133.2,1.6,1000],[137.5,1.6,1100],[140.0,1.4,900],[143.2,1.6,1200],[146.6,1.2,900],[151.3,1.6,700]];
F.windD=(t)=>{ let d=0; for(const [t0,du,a] of F.GUSTS){ const u=clamp((t-t0)/du,0,1); if(u>0) d+=a*du*(u-Math.sin(2*Math.PI*u)/(2*Math.PI))*0.5; } return d; };
F.windV=(t)=>{ let v=0; for(const [t0,du,a] of F.GUSTS){ const u=(t-t0)/du; if(u>0&&u<1) v+=a*0.5*(1-Math.cos(2*Math.PI*u)); } return v; };
F.petals=(c,t,seed,n,opt={})=>{ const r=mulberry(seed); const tp=opt.freeze!=null&&t>opt.freeze?opt.freeze:t; const wd=F.windD(tp), wv=F.windV(tp);
  for(let k=0;k<n;k++){ const x0=r()*2200-100, sp=(opt.sp||50)+r()*60, ph=r()*20, sz=7+r()*7, rs=r()*2; const dep=0.45+sz/14*0.55;
    const y=((ph*80+tp*sp)%1180)-60+Math.sin(tp*3+k)*wv*0.04*dep; const x=x0+Math.sin(tp*0.8+k)*40-tp*(opt.wind||20)-wd*dep;
    E.petal(c,((x%2100)+2100)%2100-90,y,sz,tp*rs+k+wv*0.002,P.sakuraL,P.sakuraS,Math.cos(tp*2+k+wv*0.004)); } };
E.snow=(c,t,seed,n,opt={})=>{ const r=mulberry(seed); const tt=opt.freeze!=null?Math.min(t,opt.freeze):t; const wd=F.windD(tt)*(opt.calm?0.25:0.8), wv=F.windV(tt);
  for(let k=0;k<n;k++){ const x0=r()*2100, sp=40+r()*70, ph=r()*30, big=r()<0.25; const dep=big?1:0.6; const sway=Math.sin(tt*1.3+k)*20*(opt.calm?0.3:1);
    const x=((x0+sway-tt*(opt.wind||25)-wd*dep)%2100+2100)%2100-90, y=((ph*60+tt*sp+Math.sin(tt*2+k)*wv*0.03)%(H+60))-30; c.fillStyle=k%5===0?'#E2D3B8':'#FFF8EC'; c.fillRect(g5(x),g5(y),big?10:5,big?10:5); } };
// ---------------- 3. lightning, splash, sparks ----------------
F.lightning=(c,t,t0,x,yTop,yBot,seed)=>{ const u=t-t0; if(u<0||u>0.32) return; const on=u<0.07||(u>0.13&&u<0.19); if(!on) return; const r=mulberry(seed||7);
  let px=x, py=yTop; const pts=[[px,py]]; while(py<yBot){ py+=40+r()*50; px+=(r()-0.5)*140; pts.push([px,py]); }
  for(let i=0;i<pts.length-1;i++){ const [a,b]=[pts[i],pts[i+1]]; const n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/5); for(let s=0;s<=n;s++){ const xx=g5(lerp(a[0],b[0],s/n)), yy=g5(lerp(a[1],b[1],s/n)); rect(c,xx-5,yy,15,5,'#C8D4F0'); rect(c,xx,yy,5,5,'#FFF8EC'); }
    if(r()<0.4){ let qx=b[0],qy=b[1]; for(let j=0;j<3;j++){ const nx=qx+(r()-0.5)*90, ny=qy+30+r()*30; const m=Math.ceil(Math.hypot(nx-qx,ny-qy)/5); for(let s=0;s<=m;s++) rect(c,g5(lerp(qx,nx,s/m)),g5(lerp(qy,ny,s/m)),5,5,'#8C9CC8'); qx=nx; qy=ny; } } }
  F.flashL(u<0.07?0.75:0.4); };
F.splash=(c,t,ts,x,y,big)=>{ const u=t-ts; if(u<0||u>0.9) return; const k=big?1.6:1;
  for(let q=0;q<3;q++){ const uu=u-q*0.15; if(uu>0&&uu<0.75) F.ring(c,x,y,lerp(20,280*k,eo(uu/0.75)),0.2,q?'#5FB0A8':'#A8E0D0',uu/0.75); }
  if(u<0.6){ const r=mulberry(77); for(let i=0;i<22;i++){ const a=-Math.PI*(0.1+r()*0.8), v=(300+r()*500)*k; const px=x+Math.cos(a)*v*u, py=y+Math.sin(a)*v*u+1500*u*u; if(py>y+10) continue; c.fillStyle=i%3?'#A8E0D0':'#FFF8EC'; c.fillRect(g5(px),g5(py),5,i%4?5:10); } }
  if(u<0.25){ const h=g5(lerp(40,160*k,eo(u/0.25))); for(let i=-3;i<=3;i++) rect(c,g5(x+i*22),y-h*(1-Math.abs(i)/4),10,h*(1-Math.abs(i)/4),i%2?'#5FB0A8':'#A8E0D0'); } };
F.CLASH=[ // [t, worldX, worldY, shotId] — every sword clash in the film gets a spark burst (+ a short shake)
 [34.253,770,600,'S10'],[53.033,1140,670,'S16'],[76.603,960,560,'S20'],[103.883,1050,610,'S28'],[124.233,1140,650,'S35'],[122.633,1060,640,'S34'],
 [135.6,1250,690,'S37'],[146.273,1150,592,'S39a'],[148.563,760,690,'S39b'],[150.45,960,700,'S39c']];
F.SHAKES.push(...F.CLASH.map(([t])=>({t,d:0.2,a:2})));
// ---------------- 4. upgraded fantasy sets ----------------
const SKY=(c,t,seed,horizon)=>{ rect(c,0,0,W,H,'#141A30'); E.dither(c,0,0,W,horizon*0.55,'#1C2238',f=>0.2+f*0.5); rect(c,0,horizon*0.55,W,H,'#1C2238'); E.dither(c,0,horizon*0.6,W,horizon*0.4,'#253052',f=>f*0.75); E.stars(c,t,seed,70,horizon,['#F2E8D5','#8C9CC8','#4A5378']); };
const mountains=(c,par,base,amp,col,seed,cap)=>{ const r=mulberry(seed); const pts=[[-300,H]]; for(let x=-300;x<=2600;x+=120){ pts.push([x-par,base-amp*(0.4+0.6*Math.abs(Math.sin(x*0.0021+seed)))-r()*30]); } pts.push([2600,H]); poly(c,pts,col);
  if(cap){ for(let i=1;i<pts.length-2;i+=2){ const [x,y]=pts[i]; if(y<base-amp*0.75) poly(c,[[x-30,y+20],[x,y],[x+35,y+22],[x+10,y+15]],cap); } } };
const cityLights=(c,t,x0,x1,y,seed,col)=>{ const r=mulberry(seed); for(let k=0;k<70;k++){ const x=g5(x0+r()*(x1-x0)), yy=g5(y+r()*90), ph=r()*9; if(Math.sin(t*1.3+ph)>-0.7) rect(c,x,yy,5,5,k%4?(col||'#F09A48'):'#FFE7A8'); } };
const clouds=(c,t,rows)=>{ for(const [y,h,v,w,col,ph] of rows){ const x=((ph+t*v)%(W+w*2)+(W+w*2))%(W+w*2)-w; rect(c,g5(x),g5(y),g5(w),h,col); rect(c,g5(x+w*0.15),g5(y-h+5),g5(w*0.5),h-5,col); E.dither(c,g5(x-60),g5(y),60,h,col,0.5); E.dither(c,g5(x+w),g5(y),60,h,col,0.5); } };
E5.SKY=SKY; E5.mountains=mountains; E5.cityLights=cityLights; E5.clouds=clouds;
// TRAIN (7 layers): sky / mountains / city windows / roofs / masts+wires (pantograph sparks) / carriages / foreground posts. Geometry unchanged.
E.trainRun=(c,t,scroll,opt={})=>{ const sn=opt.snow;
  SKY(c,t,23,700); E.moon(c,1450,190,110,{});
  c.save(); c.translate(-g5((scroll*0.015)%1200),0); mountains(c,0,640,170,'#2E3756',3,sn?'#DDE6F2':'#4A5378'); c.restore();
  c.save(); c.translate(-g5((scroll*0.04)%1600),0); for(let x=-200;x<3600;x+=1600){ const r=mulberry(5); for(let k=0;k<26;k++){ const bx=x+k*62, bh=60+r()*120; rect(c,bx,700-bh,56,bh+20,'#1C2238'); for(let wy=700-bh+15;wy<690;wy+=25) for(let wx=bx+8;wx<bx+50;wx+=16) if(r()<0.35&&Math.sin(t*0.7+wx*0.13+wy)>-0.8) rect(c,wx,wy,5,10,r()<0.8?'#B8562E':'#FFC870'); } } c.restore();
  c.save(); c.translate(-g5((scroll*0.1)%1600),0); E.roofRow(c,-200,740,0.7,40,'#0E1020',null,'#141A30',43,{lamp:'#B8562E',lattice:'#1C2238'}); E.roofRow(c,1400,740,0.7,40,'#0E1020',null,'#141A30',43,{lamp:'#B8562E',lattice:'#1C2238'}); if(sn) for(let x=-200;x<3200;x+=160) E.snowCap(c,x,652,140,x); c.restore();
  for(let k=0;k<7;k++){ const px=g5(((k*380-scroll*1.0)%2660+2660)%2660-300); rect(c,px,210,20,660,'#0E1020'); rect(c,px+15,210,5,660,'#2E3756'); rect(c,px-10,220,120,14,'#0E1020'); rect(c,px+60,234,10,20,'#43475A'); }
  rect(c,0,232,W,5,'#0E1020'); for(let x=0;x<W;x+=60) rect(c,x,245+((x/60)%2)*5,30,5,'#141A30');
  const L=1500, Gp=140, period=L+Gp, off=((scroll%period)+period)%period;
  for(let k=-1;k<3;k++){ const x0=g5(k*period-off);
    rrect(c,x0,760,L,300,[30,30,0,0],'#2B3A67'); rect(c,x0,760,L,16,'#3E4E86'); rect(c,x0,776,L,5,'#5A6A9A'); rect(c,x0,940,L,120,'#1C2238'); rect(c,x0,935,L,8,'#3E4E86');
    for(let s=x0+150;s<x0+L;s+=300) rect(c,s,781,5,155,'#1C2238');
    for(let s=x0+20;s<x0+L-10;s+=30) rect(c,s,790,5,5,'#3E4E86');
    if(sn) rect(c,x0+10,750,L-20,12,'#F2E8D5');
    for(let w=0;w<9;w++){ const wx=x0+120+w*150; rect(c,wx-5,825,106,100,'#141A30'); rect(c,wx,830,96,90,'#D9A441'); rect(c,wx,830,96,16,'#8A5A1E'); rect(c,wx+45,830,6,90,'#8A5A1E');
      const r=mulberry(w*7+k*31+11); for(let p=0;p<2;p++) if(r()<0.6){ const hx=wx+15+p*45+Math.floor(r()*3)*5; circ(c,hx+10,870,11,'#5E3826'); rect(c,hx-2,880,25,40,'#5E3826'); }
      rect(c,wx+20,846,5,14,'#5E3826'); rect(c,wx+70,846,5,14,'#5E3826');
      if(!sn){ const rr=mulberry(w+k*5); for(let d=0;d<4;d++){ const dx=wx+5+Math.floor(rr()*17)*5, ph=rr(); const yy=830+((ph*90+t*160)%90); rect(c,dx,g5(yy),5,10,'#F2D27A'); rect(c,dx+5,g5(yy)+10,5,5,'#C9965E'); } } }
    for(const dx of [x0+50,x0+L-90]){ rect(c,dx,800,40,130,'#1F2A4C'); rect(c,dx+10,815,20,40,'#B8562E'); }
    for(let v=0;v<3;v++){ rect(c,x0+260+v*480,738,120,22,'#43475A'); rect(c,x0+260+v*480,738,120,5,'#7E7C76'); }
    const pg=x0+L*0.5; for(const sd of [-1,1]){ capsule(c,pg+sd*50,740,4,pg,480,4,'#0E1020'); capsule(c,pg,480,4,pg+sd*30,250,4,'#0E1020'); } rect(c,pg-60,236,120,10,'#0E1020');
    const sp=(Math.floor(t*15)+k*5)%11; if(sp<2&&pg>0&&pg<W){ rect(c,pg-20,225,40,5,'#C8D4F0'); rect(c,pg-5,215,10,25,'#FFF8EC'); rect(c,pg+20,220,10,5,'#8C9CC8'); F.light(c,pg,236,140,'#8C9CC8',0.25,{add:true}); }
    for(let gx=0;gx<6;gx++){ const ph=((t*2.2+gx*0.37+k*0.2)%1); const gxx=x0+ph*L; rect(c,g5(gxx),760,30,5,'#8C9CC8'); }
    F.light(c,x0+L/2,870,700,'#FFC870',0.18,{ry:0.25}); }
  rect(c,0,1000,W,80,'#0E1020'); for(let x=-((scroll*1.2)%80);x<W;x+=80) rect(c,g5(x),1010,40,10,'#1C2238');
  { const fx=g5(((-scroll*2.4)%3400+3400)%3400-500); rect(c,fx,0,60,H,'#0E1020'); rect(c,fx+50,0,10,H,'#141A30'); }
  if(!sn) F.rain(c,t,{seed:71,gy:760,x0:0,x1:1920,depth:30,ns:10,wind:-3,layers:[[50,'#4A5378',3,1800],[25,'#8C9CC8',4,2200]]});
  return {L,G:Gp,period,off};
};
// CASTLE ROOF / ROOFTOPS: far mountains / city + lanterns / kawara slope with tile ends + moon sheen / ridge + onigawara / puddles
E.castleRoof=(c,t,camX,opt={})=>{ const sn=opt.snow, ry=opt.ridgeY||760;
  SKY(c,t,31,620); E.moon(c,opt.moonX||1300,260,opt.moonR||170,{});
  clouds(c,t,[[300,15,8,500,'#253052',200],[420,10,-6,380,'#2E3756',1100]]);
  c.save(); c.translate(g5(-camX*0.08),0); mountains(c,0,ry-150,120,'#253052',7,sn?'#DDE6F2':null); c.restore();
  c.save(); c.translate(g5(-camX*0.25),0); E.roofRow(c,-300,ry-60,0.55,30,'#1C2238',null,'#1C2238',61,{lamp:'#B8562E',lattice:'#141A30'}); cityLights(c,t,-300,2400,ry-140,61); if(sn) for(let x=-300;x<2600;x+=180) E.snowCap(c,x,ry-120,120,x+3); c.restore();
  c.save(); c.translate(g5(-camX),0);
  poly(c,[[-400,ry+20],[2600,ry+20],[2600,1080],[-400,1080]],'#2B3A67');
  for(let y=ry+30,row=0;y<1100;y+=45,row++){ rect(c,-400,y+30,3000,10,'#1C2238'); for(let x=-400+(row%2)*20;x<2600;x+=40){ rect(c,x,y,10,40,'#1C2238'); rect(c,x+12,y+28,22,12,'#3E4E86'); rect(c,x+14,y+28,8,5,'#5A6A9A'); } }
  E.dither(c,-400,ry+20,3000,90,'#5A6A9A',f=>0.25*(1-f));
  rect(c,-400,ry-6,3000,30,'#0E1020'); rect(c,-400,ry-16,3000,12,sn?'#F2E8D5':'#4A5378'); for(let x=-400;x<2600;x+=60) rect(c,x,ry-16,5,12,'#2E3756');
  if(!opt.plain) for(const ex of [140,1690]){ poly(c,[[ex,ry-6],[ex+30,ry-90],[ex+80,ry-120],[ex+60,ry-60],[ex+90,ry-6]],'#D9A441'); poly(c,[[ex+30,ry-90],[ex+55,ry-104],[ex+50,ry-70]],'#F2D27A'); rect(c,ex+46,ry-100,10,10,'#0E1020'); }
  if(sn) for(let x=-400;x<2600;x+=200) E.snowCap(c,x,ry+40,120,x);
  const PUD=[[300,ry+80,140,14],[1050,ry+110,180,16],[1650,ry+75,120,12],[2200,ry+95,150,14]];
  if(!sn){ for(const [px,py,rx,ry2] of PUD){ ell(c,px,py,rx,ry2,0,'#141A30'); rect(c,g5(px-rx*0.4),g5(py-5),g5(rx*0.5),5,'#8C9CC8'); }
    F.ripples(c,t,{n:8,x0:-400,x1:2600,y0:ry+60,y1:ry+130,r0:5,r1:40,sq:0.25,col:'#8C9CC8',per:0.9,seed:41,mask:(x,y)=>PUD.some(p=>((x-p[0])/p[2])**2+((y-p[1])/p[3])**2<1)});
    F.reflect(c,{y0:ry,y1:ry+150,k:0.5,dark:0.6,amp:1,t,puddles:PUD,tint:'#C8D4F0'}); }
  c.restore();
  if(opt.rain) F.rain(c,t,{seed:33,gy:ry+40,x0:0,x1:1920,depth:80,ns:14});
};
// MOON HILL: cloud bands crossing the moon / 2 far ridges / crest with wind grass / foreground tufts
E.moonHill=(c,t,opt={})=>{ SKY(c,t,29,780); E.moon(c,960,560,400,{});
  clouds(c,t,[[420,20,14,700,'#2E3756',100],[520,10,-9,500,'#4A5378',900],[260,15,6,420,'#253052',1500]]);
  mountains(c,0,820,110,'#253052',11,null); mountains(c,0,840,60,'#1C2238',17,null);
  poly(c,[[-50,1080],[-50,830],[300,790],[700,770],[1100,772],[1500,790],[1970,830],[1970,1080]],'#0E1020');
  const wv=F.windV(t), r=mulberry(4); for(let k=0;k<150;k++){ const x=r()*1920; const y=790+Math.abs(x-900)*0.04-8; const h=15+r()*30; const lean=Math.sin(t*2.4+x*0.02)*8+wv*0.012+6; capsule(c,g5(x),g5(y),2.5,g5(x+lean),g5(y-h),1.5,'#0E1020'); }
  for(const [x,s] of [[60,1],[1860,-1],[260,1]]){ for(let k=0;k<9;k++){ const lean=Math.sin(t*2+k)*10+F.windV(t)*0.02; capsule(c,x+k*14*s,1080,6,x+k*14*s+lean+(k-4)*8*s,1080-110-((k*37)%60),3,'#0E1020'); } }
};
// CASTLE: ishigaki stones, tile ribs, flickering lit windows, gold shachihoko with highlight, banners (geometry unchanged)
E.castle=(c,t,x,y,k,opt={})=>{ const sn=opt.snow, wall=opt.wall||'#E2D3B8', roof=opt.roof||'#2B3A67', stone=opt.stone||'#43475A'; const plainCol=!!opt.wall&&opt.wall===opt.roof;
  poly(c,[[x-260*k,y],[x+260*k,y],[x+200*k,y-120*k],[x-200*k,y-120*k]],stone);
  if(!plainCol){ const r=mulberry(19); for(let row=0;row<6;row++){ const yy=y-row*20*k-20*k; const half=260*k-(row+0.5)*10*k; for(let xx=x-half;xx<x+half-12*k;xx+=(28+r()*20)*k){ rect(c,xx,yy,(24+r()*14)*k,16*k,row%2?'#5A5F73':'#4E5468'); rect(c,xx,yy,(14)*k,3*k,'#7E7C76'); } } }
  const tiers=[[200,90],[150,80],[100,70]]; let yy=y-120*k;
  tiers.forEach(([w,h],i)=>{ rect(c,x-w*k*0.8,yy-h*k,w*k*1.6,h*k,wall); if(!plainCol){ rect(c,x-w*k*0.8,yy-h*k*0.25,w*k*1.6,h*k*0.25,'#2E3756'); for(let lx=x-w*k*0.8;lx<x+w*k*0.8;lx+=20*k) rect(c,lx,yy-h*k*0.25,3*k,h*k*0.25,'#43475A'); }
    c.fillStyle='#2E3756'; let wi=0; for(let wx=x-w*k*0.6;wx<x+w*k*0.6;wx+=40*k,wi++){ const lit=!plainCol&&Math.sin(t*1.1+wi*2.3+i*1.7)>-0.2&&((wi+i)%3!==0); c.fillStyle=lit?'#F09A48':'#2E3756'; c.fillRect(wx,yy-h*k*0.7,14*k,22*k); if(lit){ c.fillStyle='#FFC870'; c.fillRect(wx,yy-h*k*0.7,7*k,8*k); F.light(c,wx+7*k,yy-h*k*0.6,40*k,'#F09A48',0.12,{add:true}); } }
    yy-=h*k; poly(c,[[x-w*k*1.1,yy+12*k],[x+w*k*1.1,yy+12*k],[x+w*k*0.7,yy-40*k],[x-w*k*0.7,yy-40*k]],roof);
    if(!plainCol){ c.fillStyle='#1C2238'; for(let rx=-1.0;rx<=1.0;rx+=0.09){ const bx=x+rx*w*k*1.05, tx=x+rx*w*k*0.68; poly(c,[[bx,yy+10*k],[bx+3*k,yy+10*k],[tx+3*k,yy-38*k],[tx,yy-38*k]],'#1C2238'); } rect(c,x-w*k*1.1,yy+8*k,w*k*2.2,4*k,'#3E4E86'); }
    poly(c,[[x-w*k*1.1,yy+12*k],[x-w*k*1.25,yy-6*k],[x-w*k*0.95,yy+2*k]],roof); poly(c,[[x+w*k*1.1,yy+12*k],[x+w*k*1.25,yy-6*k],[x+w*k*0.95,yy+2*k]],roof);
    if(sn) rect(c,x-w*k*0.7,yy-44*k,w*k*1.4,10*k,'#F2E8D5'); yy-=40*k; });
  for(const sx of [-1,1]){ poly(c,[[x+sx*60*k,yy+4*k],[x+sx*72*k,yy-26*k],[x+sx*80*k,yy-10*k],[x+sx*68*k,yy+4*k]],'#D9A441'); if(!plainCol) rect(c,x+sx*70*k,yy-20*k,3*k,6*k,'#F2D27A'); }
  if(opt.banners){ const bw=Math.sin(Math.floor(t*15)/15*3); for(let i=0;i<9;i++){ const bx=x-420*k+i*105*k, by=y+10*k, up=opt.banners(i); if(up<=0) continue; rect(c,bx,by-260*k*up,6*k,260*k*up,'#0E1020'); poly(c,[[bx+6*k,by-250*k*up],[bx+56*k+bw*6*k,by-246*k*up],[bx+56*k,by-120*k*up],[bx+6*k,by-120*k*up]],i%2?'#D8402F':'#2B3A67'); if(!plainCol) circ(c,bx+31*k,by-200*k*up,8*k,'#F2E8D5'); } }
};
const _castleLow=E.castleLow; E.castleLow=(c,t,o={})=>{ _castleLow(c,t,o); const dy=g5(o.tilt||0); for(const [yy,v,col,d] of [[760,20,'#4A5378',0.35],[860,-14,'#5A6A9A',0.25]]){ const x=((t*v)%1200+1200)%1200; c.save(); c.translate(0,dy*0.8); E.dither(c,-1200+x,yy,2400,70,col,d); E.dither(c,1200+x,yy,2400,70,col,d); c.restore(); } };
const _ridge=E.ridgeMoon; E.ridgeMoon=(c,t,o={})=>{ const ry=o.ridge||930; _ridge(c,t,o); clouds(c,t,[[(o.moonY||560)-60,15,10,520,'#2E3756',300],[(o.moonY||560)+120,10,-7,420,'#4A5378',1200]]);
  rect(c,-20,ry,W+40,H-ry,'#0E1020'); rect(c,-20,ry-10,W+40,12,'#0E1020'); for(let x=0;x<W;x+=40) rect(c,x,ry-14,20,5,'#1C2238'); for(const ex of [60,1800]) poly(c,[[ex,ry],[ex+30,ry-80],[ex+80,ry-110],[ex+60,ry-50],[ex+90,ry]],'#0E1020'); if(o.snow) E.snowCap(c,-20,ry-8,W+40,9); };
// ATTIC: plank grain, beams with grain + iron, scroll shelf, rope, dust motes in moving shafts, candle (geometry unchanged)
E.attic=(c,t,o={})=>{ const cam=g5(o.cam||0);
  rect(c,0,0,W,H,'#2A1E1A');
  c.save(); c.translate(-cam*0.4,0);
  F.planks(c,-300,0,2800,930,120,['#33201A','#2A1E1A','#4A2A1C','#1C1210'],17,true);
  for(let k=0;k<4;k++){ const sx=200+k*520; rect(c,sx-10,130,200,140,'#1C1210'); rect(c,sx,140,180,120,'#141A30'); E.stars(c,t,k+5,6,120,['#8C9CC8']); for(let j=0;j<5;j++) rect(c,sx+j*40,140,10,120,'#3A2A22');
    const sw=Math.sin(t*0.5+k)*40; F.shaft(c,[[sx,260],[sx+180,260],[sx+340+sw,930],[sx+60+sw,930]],'#C8D4F0',0.18,0.35);
    const r=mulberry(k*13+3); for(let d=0;d<10;d++){ const ph=(r()+t*0.08*(0.5+r()))%1; const dx=sx+20+r()*200+ph*160+Math.sin(t+d)*15, dy=260+ph*640; rect(c,g5(dx),g5(dy),5,5,d%3?'#C9965E':'#E2D3B8'); } }
  rect(c,1180,420,420,14,'#5E3826'); rect(c,1180,434,420,6,'#1C1210'); for(let s=0;s<7;s++){ rect(c,1200+s*55,380,45,40,s%2?'#E2D3B8':'#C9965E'); rect(c,1200+s*55,395,45,6,'#A82A26'); circ(c,1222+s*55,400,10,'#5E3826'); }
  { const rx=880, sw=g5(Math.sin(t*1.2)*10); capsule(c,rx,0,5,rx+sw,420,5,'#93603C'); for(let y=20;y<420;y+=20) rect(c,rx-5+sw*y/420,y,10,5,'#5E3826'); circ(c,rx+sw,450,30,'#93603C'); circ(c,rx+sw,450,15,'#2A1E1A'); }
  if(o.scroll){ o.scroll(c,t); }
  c.restore();
  F.planks(c,0,930,W,150,30,['#4A2A1C','#33201A','#5E3826','#1C1210'],23,false); rect(c,0,926,W,8,'#7A4B34'); c.fillStyle='#33201A'; for(let x=-((cam*0.9)%160);x<W;x+=160) c.fillRect(g5(x),930,6,150);
  c.save(); c.translate(-cam*0.8,0); rect(c,-200,360,2600,60,'#4A2A1C'); rect(c,-200,360,2600,10,'#7A4B34'); for(let x=-200;x<2400;x+=90) rect(c,x,385,50,5,'#33201A');
  for(const x of [100,900,1700,2500]){ rect(c,x,0,70,930,'#4A2A1C'); rect(c,x+50,0,20,930,'#3A2A22'); rect(c,x+10,0,5,930,'#5E3826'); rect(c,x-5,350,80,20,'#43475A'); rect(c,x+5,355,5,5,'#7E7C76'); rect(c,x+55,355,5,5,'#7E7C76'); } c.restore();
  if(o.candle!==false){ const cx=g5(1500-cam*0.8); rect(c,cx-20,925,60,10,'#43475A'); rect(c,cx,860,20,70,'#F2E8D5'); rect(c,cx+12,860,8,70,'#C9965E'); const fl=Math.floor(t*12)%2; rect(c,cx+5,830-fl*5,10,30,'#D9A441'); rect(c,cx+7,840,6,15,'#FFF8EC'); F.light(c,cx+10,840,60,'#FFC870',0.25,{add:true}); }
};
// TORII TUNNEL: far hill + stone-lantern lights / mid torii / stone path texture / near torii with shading / mist
E.toriiTunnel=(c,t,camX,opt={})=>{ const sn=opt.snow;
  SKY(c,t,17,700); E.moon(c,1500,170,80,{});
  c.save(); c.translate(g5(-camX*0.08),0); mountains(c,0,560,140,'#253052',23,sn?'#DDE6F2':null); c.restore();
  c.save(); c.translate(g5(-camX*0.2),0); poly(c,[[-200,700],[600,520],[1300,600],[2400,480],[2400,1080],[-200,1080]],'#22382A'); const r=mulberry(4); for(let k=0;k<60;k++){ const x=r()*2600-200, y=560+r()*200; blob(c,[[x,y],[x+40,y-30],[x+80,y]],'#16261E'); } c.restore();
  c.save(); c.translate(g5(-camX*0.5),0); for(let k=-2;k<30;k++){ const x=k*150; rect(c,x,560,18,320,'#6E1A1E'); rect(c,x-30,560,90,16,'#6E1A1E'); rect(c,x-36,548,102,10,'#0E1020'); if(k%3===0){ rect(c,x+60,800,20,80,'#43475A'); rect(c,x+50,780,40,24,'#7E7C76'); const on=Math.sin(t*9+k)>-0.5; rect(c,x+60,785,20,14,on?'#FFC870':'#F09A48'); F.light(c,x+70,790,70,'#F09A48',0.18*(on?1:0.7),{add:true}); } } c.restore();
  E.dither(c,0,700,W,140,'#4A5378',f=>0.3*f);
  rect(c,0,860,W,220,sn?'#E2D3B8':'#43475A'); rect(c,0,860,W,10,sn?'#F2E8D5':'#7E7C76');
  c.save(); c.translate(-g5(((camX)%140+140)%140),0); for(let y=880,row=0;y<1080;y+=40,row++) for(let x=-140+(row%2)*70;x<W+140;x+=140){ rect(c,x+5,y+5,125,30,sn?'#DDE6F2':'#5A5F73'); rect(c,x+5,y+5,125,5,sn?'#FFF8EC':'#7E7C76'); } c.restore();
  if(sn) E.snowCap(c,0,862,W,5);
  c.save(); const off=((camX)%240+240)%240; c.translate(-g5(off),0); for(let k=-1;k<11;k++){ const x=k*240; rect(c,x,320,36,560,'#D8402F'); rect(c,x+24,320,12,560,'#A82A26'); rect(c,x+2,320,5,560,'#F07850'); rect(c,x-60,350,240,26,'#D8402F'); rect(c,x-60,370,240,6,'#A82A26'); rect(c,x-80,310,280,30,'#0E1020'); rect(c,x-70,300,260,12,'#A82A26'); if(sn) rect(c,x-80,300,280,10,'#F2E8D5'); rect(c,x-6,840,48,24,'#0E1020'); rect(c,x+40,380,10,30,'#0E1020'); for(let j=0;j<4;j++) rect(c,x+44,390+j*12,5,8,'#F2E8D5'); } c.restore();
};
// SCROLL: washi fibres, brocade mounting, ink-wash mountains, seal stamps, rod caps
E.scroll=(c,t,opt={})=>{ rect(c,0,0,W,H,'#141A30'); E.stars(c,t,37,40,1080,['#4A5378']); E.dither(c,0,0,W,H,'#1C2238',0.5);
  const y0=200,y1=880; rect(c,40,y0-20,1840,y1-y0+40,'#6E1A1E'); for(let x=40;x<1880;x+=40){ rect(c,x,y0-20,20,10,'#D9A441'); rect(c,x+20,y1+10,20,10,'#D9A441'); }
  rect(c,60,y0,1800,y1-y0,'#F2E8D5'); const r=mulberry(5); for(let k=0;k<260;k++){ const x=g5(60+r()*1780), y=g5(y0+20+r()*(y1-y0-40)); rect(c,x,y,r()<0.5?15:5,5,r()<0.5?'#E2D3B8':'#FFF8EC'); }
  rect(c,60,y0,1800,30,'#E2D3B8'); rect(c,60,y1-30,1800,30,'#E2D3B8');
  const mt=[[60,y1-140],[260,y1-300],[420,y1-200],[640,y1-380],[900,y1-220],[1150,y1-330],[1400,y1-180],[1650,y1-290],[1860,y1-160],[1860,y1-30],[60,y1-30]]; poly(c,mt,'#E2D3B8'); E.dither(c,60,y1-380,1800,350,'#B9B6AC',f=>0.12+f*0.2);
  circ(c,1700,y0+120,14,'#A82A26'); rect(c,1690,y0+150,20,20,'#A82A26'); rect(c,1694,y0+154,12,12,'#F2E8D5');
  for(const xr of [40,1860]){ rect(c,xr-20,y0-40,40,y1-y0+80,'#7A4B34'); rect(c,xr-12,y0-40,8,y1-y0+80,'#93603C'); rect(c,xr-28,y0-56,56,30,'#0E1020'); rect(c,xr-28,y1+26,56,30,'#0E1020'); rect(c,xr-20,y0-50,40,5,'#D9A441'); rect(c,xr-20,y1+40,40,5,'#D9A441'); }
  return [60,y0,1800,y1-y0]; };
// SAKURA COURT (redefined): layered roofs with lit lattice, plaster wall with tile cap, stone lanterns w/ light, petal carpet, wind
F.sakura=function(c,t,o){ const {J,Ja,poof,bell}=F; SKY(c,t,8,640); E.moon(c,1180,190,96);
  clouds(c,t,[[240,15,5,800,'#253052',200],[330,10,-4,600,'#2E3756',1100]]);
  mountains(c,0,560,90,'#253052',31,null);
  E.roofRow(c,-80,640,0.8,12,'#1C2238',null,'#2E3756',61,{lattice:'#B8562E',lamp:'#F09A48'});
  rect(c,0,600,W,50,'#2B3A67'); for(let x=0;x<W;x+=30){ rect(c,x,600,20,40,'#1C2238'); rect(c,x+2,630,16,10,'#3E4E86'); } rect(c,0,640,W,60,'#D9CDB4'); rect(c,0,640,W,12,'#2E3756'); for(let x=0;x<W;x+=120) rect(c,x,652,5,48,'#BCB29A');
  rect(c,0,700,W,380,'#C9BFA8'); const r=mulberry(3); for(let y=720;y<H;y+=22){ rect(c,0,y,W,4,'#BCB29A'); }
  for(let k=0;k<160;k++){ const x=g5(r()*W), y=g5(720+r()*360); rect(c,x,y,10,5,k%3?'#EBA9A5':'#F8D8D0'); if(k%4===0) rect(c,x+5,y+5,5,5,'#C86C78'); }
  const tx=520; poly(c,[[tx-46,1000],[tx+40,1000],[tx+30,640],[tx+90,420],[tx+60,410],[tx+4,600],[tx-40,470],[tx-66,480],[tx-26,640]],P.woodS); poly(c,[[tx+6,1000],[tx+40,1000],[tx+30,640],[tx+90,420],[tx+76,416],[tx+14,620]],'#4A2C1F'); for(let y=660;y<1000;y+=40) rect(c,tx-20,y,25,5,'#3A2418');
  E.sakuraCanopy(c,tx+10,330+g5(Math.sin(t*1.5)*4),340,9,{M:P.sakura,S:P.sakuraS,L:P.sakuraL,B:P.woodS});
  for(const lx of [1500,180]){ rect(c,lx-40,900,80,100,P.stone); rect(c,lx-70,880,140,24,P.stoneS); rect(c,lx-50,790,100,90,P.stone); const on=Math.sin(t*11+lx)>-0.6; rect(c,lx-24,815,48,40,on?'#FFC870':P.ochre); poly(c,[[lx-100,790],[lx,730],[lx+100,790]],P.stoneS); rect(c,lx-12,700,24,32,P.stoneS); rect(c,lx+10,790,40,90,P.stoneS); F.light(c,lx,835,260,'#F09A48',0.3,{ry:0.6}); }
  const fz=o.fz; if(t>=o.lead){ Ja(c,'idle',t<fz?t:fz,o.lead,1250,640,-1,'leader'); bell(c,1250-60,640-170,t<fz?t:fz); } poof(c,1250,530,t,o.lead-0.05);
  F.petals(c,t,5,160,{freeze:fz});
  const y=905; poly(c,[[o.stop+50,y+4],[o.stop-90,y+4],[o.stop-200,y+40],[o.stop-20,y+40]],'#7E7C76'); if(o.noJay) return;
  if(t<o.walkEnd){ const x=g5(lerp(o.walkFrom,o.stop,(t-o.t0)/(o.walkEnd-o.t0))); Ja(c,'walk',t,o.t0,x,y,1); }
  else if(t<fz-5/30) Ja(c,'idle',t,o.walkEnd,o.stop,y,1); else Ja(c,'point',t,fz-5/30,o.stop,y,1); };
// SILENT FILM: wrap with gate weave grain, vignette, passengers in the windows
const _yam=F.yamanote; F.yamanote=function(c,t,o){ _yam(c,t,o); const tq=Math.floor(t*12)/12; const A='#26304F',Bd='#CFC3AA';
  const r=mulberry(Math.floor(t*12)*7+3); for(let k=0;k<90;k++){ const x=g5(r()*W), y=g5(110+r()*(H-220)); rect(c,x,y,5,5,r()<0.5?A:Bd); }
  if(r()<0.25){ const x=g5(r()*W); rect(c,x,110,5,H-220,'#E8DCC4'); }
  for(let k=0;k<8;k++){ E.dither(c,0,110+k*20,(8-k)*30,20,A,0.5); E.dither(c,W-(8-k)*30,110+k*20,(8-k)*30,20,A,0.5); E.dither(c,0,H-130-k*20,(8-k)*30,20,A,0.5); E.dither(c,W-(8-k)*30,H-130-k*20,(8-k)*30,20,A,0.5); } };
// CLONES WIDE (redefined with upgraded layers): castle-roof slopes with tile texture, city lights, cloud bands
F.clonesWide=(c,t)=>{ const {J,Ja,poof,bell}=F; SKY(c,t,9,800); E.moon(c,960,520,430,{});
  clouds(c,t,[[640,20,16,900,'#2E3756',0],[560,15,-12,800,'#4A5378',1100],[300,15,10,600,'#253052',300]]);
  mountains(c,0,800,80,'#253052',41,'#4A5378'); E.roofRow(c,-100,820,0.9,10,'#1C2238',null,'#1C2238',81,{lamp:'#B8562E',lattice:'#141A30'}); cityLights(c,t,-100,2000,700,81);
  [[860,'#1C2238','#141A30','#3E4E86'],[1000,'#141A30','#0E1020','#2B3A67']].forEach(([y,col,rib,hi])=>{ poly(c,[[-40,y],[W+40,y-30],[W+40,H],[-40,H]],col); for(let x=-40;x<W;x+=30){ const yy=y-(x+40)/(W+80)*30; rect(c,x,yy+12,9,300,rib); for(let j=0;j<6;j++) rect(c,x+12,yy+40+j*45,14,8,hi); } poly(c,[[-40,y-12],[W+40,y-42],[W+40,y-22],[-40,y+8]],rib); for(let x=-40;x<W;x+=60) rect(c,x,y-12-(x+40)/(W+80)*30,5,10,hi); });
  const cnt=D.counts.filter(q=>q.t>=136.57&&q.t<=t); const cs=cnt.length; const n=Math.min(8,Math.pow(2,Math.min(3,cs)));
  const lf=cs%2?1:-1; Ja(c,'hold',t,136.57,960,930,lf,null,'K'); bell(c,960+lf*60,760,t);
  const POSE=[['seal',null],['slash',5],['crouch',1],['point',1],['throw',0],['seal',null],['idle',null],['slash',1]];
  const spots=[[620,935,1,0],[1300,930,-1,0],[400,905,1,0],[1540,888,-1,0],[180,912,1,1],[1760,866,-1,1],[790,862,1,1],[1130,858,-1,1]];
  const born=k=>k===0?null:D.counts.filter(q=>q.t>=136.57)[Math.ceil(Math.log2(k+1))-1];
  const order=[...Array(n).keys()].sort((a,b)=>spots[a][1]-spots[b][1]);
  for(const k of order){ const [x,y,f,far]=spots[k]; const [an,fix]=POSE[k]; const b=born(k); const tb=b?b.t:-99;
    if(k===0||t>=tb+0.1){ const fr=fix==null?SPR.frameAt('M',an,t,tb+k*0.13):fix; J(c,an,fr,x,y,f,far?'far':null); }
    if(k>0) poof(c,x,y-110,t,tb); }
  const r=mulberry(91), wd=F.windD(t); for(let k=0;k<220;k++){ const x0=r()*2400, sp=180+r()*240, sz=6+r()*8; const x=((x0-t*sp-wd*0.6)%2400+2400)%2400-200; const y=(r()*1200+t*sp*0.35)%1180-60; E.petal(c,x,y,sz,t*3+k,P.sakuraL,P.sakuraS,Math.cos(t*4+k)); } };
G.E=E;
})(window);
