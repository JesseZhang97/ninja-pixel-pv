// env6.js — v5 sets built on a real one-point projection (camera height, horizon, focal length), so floors, walls, props
// and characters share one perspective. Sprites are never scaled: a sprite's size class fixes its depth
// (M = 135 px/m, L = 270 px/m, XL = 405 px/m in world px), and the set is laid out around those depths.
(function(G){
const {P,mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,rrect,capsule,blob}=G.K; const E=G.E, F=G.FILM, E4=G.E4, E5=G.E5, SPR=G.SPR; const W=1920,H=1080;
const g5=v=>Math.round(v/5)*5; const C=E4.C; const E6=G.E6={}; const fl=(t)=>0.9+0.1*Math.sin(t*23)*Math.sin(t*7.3);
// ---------- projection ----------
E6.SZ={M:135,L:270,XL:405};
E6.cam=(o)=>Object.assign({vx:960,h:520,camH:1.45,f:800},o||{});
const pj=(K,X,Y,Z)=>{ const s=K.f/Z; return [K.vx+X*s, K.h+(K.camH-Y)*s]; };
E6.pj=pj;
E6.Q=(c,K,pts,col)=>{ if(pts.some(p=>p[2]<=0.05)) return; poly(c,pts.map(p=>{ const [x,y]=pj(K,p[0],p[1],p[2]); return [g5(x),g5(y)]; }),col); };
E6.zOf=(K,size)=>K.f/E6.SZ[size];
E6.at=(K,X,size,Y)=>{ const Z=E6.zOf(K,size); const [x,y]=pj(K,X,Y||0,Z); return [g5(x),g5(y)]; };
E6.camFor=(size,footY,o)=>{ const K=E6.cam(o); K.h=footY-K.camH*E6.SZ[size]; return K; };   // camera whose `size` characters stand on footY
E6.shadow=(c,x,y,w,col)=>{ ell(c,g5(x),g5(y+5),w,Math.max(10,w*0.16),0,col||'#0E1020'); };
const Q=E6.Q;
// draw a sprite occluded below a world y (counter, sill...): pixels under clipY are not drawn, and the audit box is clamped the same way
E6.drawClip=(c,set,anim,k,x,y,face,remap,clipY)=>{ c.save(); c.beginPath(); c.rect(-5000,-5000,15000,5000+clipY); c.clip(); SPR.draw(c,set,anim,k,x,y,face,remap); c.restore();
  if(F.LOG&&F.LOG.length){ const e=F.LOG[F.LOG.length-1]; e.box[3]=Math.min(e.box[3],Math.floor(clipY/5)); } };
// box helper: axis-aligned box faces visible from the camera (front, side toward vx, top/bottom toward horizon)
E6.box=(c,K,x0,x1,y0,y1,z0,z1,cf,cs,ct)=>{ // front face at z0
  const sx=(x0+x1)/2*K.f/((z0+z1)/2)+K.vx;
  if(x1*K.f/z0+K.vx<K.vx||x1<0) Q(c,K,[[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],cs); // right side visible when box is left of centre
  if(x0>0) Q(c,K,[[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1]],cs);
  if(y1<K.camH&&ct) Q(c,K,[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],ct);
  if(y0>K.camH&&ct) Q(c,K,[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]],ct);
  Q(c,K,[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]],cf); };
const fogCol=(z,near,mid,far,zf)=>z<zf*0.33?near:(z<zf*0.66?mid:far);
// ---------- sky ----------
E6.sky=(c,t,o={})=>{ const h=o.h||540; rect(c,0,0,W,H,o.top||'#141A30'); rect(c,0,g5(h*0.45),W,H,o.mid||'#1C2238'); E.dither(c,0,g5(h*0.35),W,g5(h*0.2),o.mid||'#1C2238',f=>0.5); rect(c,0,g5(h*0.8),W,H,o.low||'#253052'); E.dither(c,0,g5(h*0.7),W,g5(h*0.1),o.low||'#253052',f=>0.5);
  if(o.stars!==false) E.stars(c,t,o.seed||7,70,h*0.7,['#F2E8D5','#4A5378']); };

// =================================================================================================
// BAMBOO GROVE (duel) — earth path receding to the vanishing point, stalks rooted at their depth, a stream
// =================================================================================================
E6.grove=(c,t,K,o={})=>{ const cam=o.cam||0; const zf=40; const X0=cam;
  E6.sky(c,t,{h:K.h,seed:21}); const mx=g5(1480-cam*8), my=g5(K.h-360); E.moon(c,mx,my,120,{}); F.light(c,mx,my,520,'#C8D4F0',0.18);
  // far ridge + mist at the horizon
  poly(c,[[-50,K.h+5],[-50,K.h-120],[300,K.h-160],[700,K.h-110],[1100,K.h-170],[1500,K.h-120],[1970,K.h-150],[1970,K.h+5]].map(([x,y])=>[x,g5(y)]),'#1C2238');
  // ground plane: moss, then the path (curving), leaf litter by depth
  rect(c,0,g5(K.h),W,H,'#16261E'); E.dither(c,0,g5(K.h),W,g5((H-K.h)*0.35),'#1C2238',f=>0.6-f*0.6);
  const px=(Z)=>Math.sin(Z*0.09+0.6)*1.6-X0*0.0;
  for(let Z=zf;Z>1.0;Z-=Z>8?2:0.5){ const Z2=Z-(Z>8?2:0.5); const a=px(Z)-cam, b=px(Z2)-cam; const w1=1.25, w2=1.25;
    Q(c,K,[[a-w1,0,Z],[a+w1,0,Z],[b+w2,0,Z2],[b-w2,0,Z2]],Z>16?'#2A1E1A':(Z>6?'#33201A':'#4A2A1C'));
    Q(c,K,[[a+w1,0,Z],[a+w1+0.25,0,Z],[b+w2+0.25,0,Z2],[b+w2,0,Z2]],'#22382A'); Q(c,K,[[a-w1-0.25,0,Z],[a-w1,0,Z],[b-w2,0,Z2],[b-w2-0.25,0,Z2]],'#22382A'); }
  // stream on the right: water strip with banks, moon glints and ripples
  const sx=(Z)=>4.6+Math.sin(Z*0.13)*1.2-cam;
  for(let Z=zf;Z>1.0;Z-=Z>8?2:0.5){ const Z2=Z-(Z>8?2:0.5); Q(c,K,[[sx(Z)-0.2,0,Z],[sx(Z)+2.2,0,Z],[sx(Z2)+2.2,0,Z2],[sx(Z2)-0.2,0,Z2]],'#1C262B'); Q(c,K,[[sx(Z),0,Z],[sx(Z)+2.0,0,Z],[sx(Z2)+2.0,0,Z2],[sx(Z2),0,Z2]],Z>10?'#1F4E5A':'#12303A'); }
  { const r=mulberry(4); for(let k=0;k<26;k++){ const Z=1.4+r()*20, X=sx(Z)+0.2+r()*1.6; const [x,y]=pj(K,X,0,Z); const s=K.f/Z; if(Math.sin(t*3+k*1.7)>0.1) rect(c,g5(x),g5(y),g5(Math.max(5,s*0.12)),5,k%3?'#5FB0A8':'#C8D4F0'); } }
  // litter: fallen leaves + stones on the path, size by depth
  { const r=mulberry(9); for(let k=0;k<160;k++){ const Z=1.3+r()*r()*30, X=(r()-0.5)*14-cam; const [x,y]=pj(K,X,0,Z); if(y>H) continue; const s=K.f/Z; const w=g5(Math.max(5,s*0.07)); rect(c,g5(x),g5(y),w,5,k%4===0?'#7C9A6E':(k%4===1?'#46613F':(k%4===2?'#93603C':'#2F4A3A'))); }
    for(let k=0;k<10;k++){ const Z=1.6+k*1.9+r(), X=px(Z)-cam+(r()-0.5)*1.2; const [x,y]=pj(K,X,0,Z); const s=K.f/Z; ell(c,g5(x),g5(y),g5(s*0.22),g5(Math.max(5,s*0.06)),0,'#43475A'); rect(c,g5(x-s*0.12),g5(y-Math.max(5,s*0.04)),g5(s*0.14),5,'#5A5F73'); } }
  // stalks rooted on the ground at their depth (far -> near), keep the duel lane (|X|<2.2, Z<5) clear
  const r=mulberry(o.seed||31); const st=[]; for(let k=0;k<120;k++){ const Z=1.2+r()*r()*zf, X=(r()-0.5)*26; const pX=px(Z); if(Math.abs(X-pX)<1.7) continue; if(Z<5.5&&Math.abs(X)<2.6) continue; if(X>sx(Z)+cam-0.4&&X<sx(Z)+cam+2.4) continue; st.push([Z,X,r()]); }
  st.sort((a,b)=>b[0]-a[0]);
  for(const [Z,X,q] of st){ const [x,y]=pj(K,X-cam*(1+0.6/Z),0,Z); const s=K.f/Z; const w=Math.max(5,g5(s*0.1)); if(x<-w||x>W+w) continue; const sway=g5(Math.sin(t*0.7+X)*s*0.02);
    const col=Z>18?['#1C2238','#253052','#141A30']:(Z>8?['#253A3F','#2C3D45','#1C262B']:(Z>3.5?['#2F4A3A','#3E5A4C','#22382A']:['#3E5A4C','#46613F','#2D4439']));
    poly(c,[[g5(x-w/2),g5(y)],[g5(x+w/2),g5(y)],[g5(x+w/2+sway),-20],[g5(x-w/2+sway),-20]],col[0]); rect(c,g5(x+w*0.1),-20,Math.max(5,g5(w*0.25)),g5(y+20),col[1]);
    for(let yy=y-s*0.45;yy>-20;yy-=s*0.5) rect(c,g5(x-w/2-2),g5(yy),w+5,Math.max(5,g5(s*0.02)),col[2]);
    if(Z<10){ ell(c,g5(x),g5(y+3),w,Math.max(5,g5(w*0.2)),0,'#0E1020'); } }
  // canopy leaves high up (near clusters only at the frame edges) and fog bands
  { const r2=mulberry(77); for(let k=0;k<26;k++){ const x=r2()*W, y=r2()*260, l=40+r2()*60, sw=Math.sin(t*1.2+k)*8; const col=k%3?'#22382A':'#2F4A3A'; poly(c,[[g5(x),g5(y)],[g5(x+l+sw),g5(y+12)],[g5(x+l*0.3),g5(y+22)]],col); } }
  for(const [yy,v,col,d] of [[K.h-20,12,'#2E3756',0.35],[K.h+30,-8,'#253052',0.3]]){ const x=((t*v)%240); E.dither(c,-240+x,g5(yy),2400,40,col,d); }
  for(const [x0,w] of [[380,80],[1150,60]]){ const x=x0+Math.sin(t*0.35+x0)*30-cam*20; F.shaft(c,[[x,0],[x+w,0],[x+w-260,H],[x-260,H]],'#C8D4F0',0.12,0.35); }
  const fr=mulberry(12); for(let k=0;k<12;k++){ const fx=fr()*W, fy=K.h-250+fr()*400, ph=fr()*6; if(Math.sin(t*3+ph)>0.2){ const x=g5(fx+Math.sin(t*0.7+ph)*60), y=g5(fy+Math.cos(t*0.9+ph)*40); rect(c,x,y,5,5,'#F2D27A'); F.light(c,x,y,25,'#F2D27A',0.15,{add:true}); } }
  F.amb([0.74,0.8,1.04]); F.light(c,mx,my+300,900,'#8C9CC8',0.18,{ry:0.7});
};
E6.groveFG=(c,t,K,cam)=>{ // two out-of-focus stalks very close to the lens at the frame edges (rooted below frame)
  for(const [X,Z] of [[-1.6,0.95],[1.9,0.9]]){ const [x]=pj(K,X-cam*1.6,0,Z); const w=g5(K.f/Z*0.1); rect(c,g5(x-w/2),-20,w,H+40,'#0E1020'); rect(c,g5(x+w*0.2),-20,10,H+40,'#16261E'); for(let y=60;y<H;y+=320) rect(c,g5(x-w/2-5),y,w+10,15,'#16261E'); } };

// =================================================================================================
// OVER-THE-COUNTER reverse (S23b resolve, S42a wake): camera at seated eye level behind the counter; Jay (XL) sits on a
// stool across it, the counter slab in the foreground hides him from the chest down; the shop front behind him.
// =================================================================================================
E6.KOC=E6.camFor('XL',1180,{camH:1.185,vx:900});
E6.overCounter=(c,t,o={})=>{ const K=E6.KOC; const sn=o.snow!==false;
  rect(c,0,0,W,H,'#2A1E1A');
  // back wall (Z=5.2) with the sliding glass door, a window, menu tags, a coat hook with the clear umbrella
  const Zw=3.9; Q(c,K,[[-7,0,Zw],[7,0,Zw],[7,2.5,Zw],[-7,2.5,Zw]],C.w2);
  for(let X=-6.5;X<7;X+=0.5){ Q(c,K,[[X,0,Zw],[X+0.04,0,Zw],[X+0.04,2.5,Zw],[X,2.5,Zw]],C.w1); }
  // ceiling + beams converging, side walls
  Q(c,K,[[-7,2.5,1.0],[7,2.5,1.0],[7,2.5,Zw],[-7,2.5,Zw]],C.w0); for(let Z=1.2;Z<Zw;Z+=0.8) Q(c,K,[[-7,2.45,Z],[7,2.45,Z],[7,2.45,Z+0.15],[-7,2.45,Z+0.15]],'#140E0C');
  Q(c,K,[[-3.2,0,1.0],[-3.2,0,Zw],[-3.2,2.5,Zw],[-3.2,2.5,1.0]],C.w1); Q(c,K,[[3.6,0,1.0],[3.6,0,Zw],[3.6,2.5,Zw],[3.6,2.5,1.0]],C.w1);
  // glass door: night street outside, snow, the lane lantern; wooden frame + lattice
  const dX0=-0.2, dX1=1.2; Q(c,K,[[dX0,0.05,Zw],[dX1,0.05,Zw],[dX1,2.05,Zw],[dX0,2.05,Zw]],'#1C2238');
  { const [x0,y0]=pj(K,dX0,2.05,Zw), [x1,y1]=pj(K,dX1,0.05,Zw); c.save(); c.beginPath(); c.rect(x0,y0,x1-x0,y1-y0); c.clip();
    rect(c,x0,y0,x1-x0,y1-y0,'#253052'); rect(c,x0,g5(y0+(y1-y0)*0.62),x1-x0,g5((y1-y0)*0.4),sn?'#C8D4F0':'#2E3756'); E.dither(c,x0,g5(y0+(y1-y0)*0.55),x1-x0,40,'#4A5378',0.5);
    for(let k=0;k<3;k++){ const hx=g5(x0+40+k*110); rect(c,hx,g5(y0+60),80,g5((y1-y0)*0.5),'#1C2238'); rect(c,hx+15,g5(y0+100),20,20,'#F09A48'); }
    { const lx=g5(x0+(x1-x0)*0.72), ly=g5(y0+(y1-y0)*0.3); rect(c,lx-2,ly-60,5,30,'#0E1020'); ell(c,lx,ly,28,34,0,'#D8402F'); rect(c,lx-28,ly-5,56,5,'#A82A26'); rect(c,lx-15,ly-34,30,6,'#0E1020'); F.light(c,lx,ly,140,'#F09A48',0.35); } if(sn){ c.translate(x0-200,y0); E.snow(c,t,301,40,{calm:1}); } c.restore();
    rect(c,g5(x0)-10,g5(y0)-10,g5(x1-x0)+20,15,C.w0); rect(c,g5(x0)-10,g5(y1)-5,g5(x1-x0)+20,15,C.w0); for(const f of [0,0.5,1]) rect(c,g5(x0+(x1-x0)*f)-5,g5(y0),10,g5(y1-y0),C.w0); for(const f of [0.33,0.66]) rect(c,g5(x0),g5(y0+(y1-y0)*f),g5(x1-x0),5,C.w0);
    F.light(c,(x0+x1)/2,(y0+y1)/2,300,'#8C9CC8',0.22,{ry:1.3}); }
  // noren over the door (indigo, crest), swaying a little
  { const [nx0,ny0]=pj(K,dX0-0.1,2.08,Zw-0.05), [nx1]=pj(K,dX1+0.1,2.08,Zw-0.05); E4.noren(c,g5(nx0),g5(ny0),g5(nx1-nx0),g5((nx1-nx0)*0.42),3,t,{part:0.08,crest:0,col:'#2B3A67',colS:'#1F2A4C'}); }
  // menu tags on the wall right of the door
  { for(let k=0;k<6;k++){ const X=1.5+k*0.26; const [x,y]=pj(K,X,2.1,Zw); rect(c,g5(x),g5(y),25,95,'#F2E8D5'); rect(c,g5(x)+5,g5(y)+10,15,5,'#0E1020'); rect(c,g5(x)+5,g5(y)+25,15,5,'#0E1020'); rect(c,g5(x)+5,g5(y)+45,15,10,'#0E1020'); if(k%3===0) rect(c,g5(x)+5,g5(y)+70,15,10,'#D8402F'); } }
  // coat hook + clear umbrella (dripping onto the floor) left of the door
  { const [ux,uy]=pj(K,-1.9,1.7,Zw-0.1); rect(c,g5(ux)-5,g5(uy)-15,15,10,'#7E7C76'); rect(c,g5(ux),g5(uy),5,130,'#5A5F73'); poly(c,[[g5(ux)-25,g5(uy)+20],[g5(ux)+5,g5(uy)],[g5(ux)+30,g5(uy)+20],[g5(ux)+10,g5(uy)+140]],'#8C9CC8'); E.dither(c,g5(ux)-20,g5(uy)+20,45,110,'#C8D4F0',0.4);
    const dp=(t*1.3)%1; rect(c,g5(ux)+10,g5(uy+140+dp*80),5,10,'#C8D4F0'); }
  // paper lantern hanging between Jay and the wall (warm key light on him)
  { const [lx,ly]=pj(K,-0.6,2.15,2.7); rect(c,g5(lx)-3,0,5,g5(ly)-40,'#0E1020'); E.lantern(c,g5(lx),g5(ly),45,'#F2E8D5','#E2D3B8',C.w1); F.light(c,lx,ly,600,'#FFC870',0.55*fl(t),{ry:0.9}); }
  // stools further along (empty), seen behind Jay's side
  for(const X of [0.2,1.1]){ const Z=2.25; const [x,y]=pj(K,X,0.62,Z); const s=K.f/Z; rect(c,g5(x-s*0.17),g5(y),g5(s*0.34),g5(s*0.07),C.w4); rect(c,g5(x-s*0.12),g5(y+s*0.07),g5(s*0.05),g5(s*0.55),C.w1); rect(c,g5(x+s*0.08),g5(y+s*0.07),g5(s*0.05),g5(s*0.55),C.w1); }
  F.amb([0.86,0.8,0.78]);
};
E6.overCounterFG=(c,t,o={})=>{ const K=E6.KOC; const Ct=0.8;
  // counter slab: top surface from Jay's edge (Z 1.8) to the lens; inner lip; wood grain converging to the vanishing point
  Q(c,K,[[-7,Ct,1.8],[7,Ct,1.8],[7,Ct,0.95],[-7,Ct,0.95]],C.w3);
  for(let X=-6;X<7;X+=0.6) Q(c,K,[[X,Ct,1.8],[X+0.03,Ct,1.8],[X+0.03,Ct,0.95],[X,Ct,0.95]],C.w2);
  Q(c,K,[[-7,Ct,1.8],[7,Ct,1.8],[7,Ct+0.004,1.78],[-7,Ct+0.004,1.78]],C.w5);
  { const [x0,y0]=pj(K,-7,Ct,1.8); rect(c,0,g5(y0)-5,W,10,C.w4); }
  // props: miso bowl (steaming), chopsticks on a rest, sake tokkuri + cup, the bell's glint reflected in the varnish
  const pr=(X,Z)=>pj(K,X,Ct,Z);
  { const [bx,by]=pr(o.bowlX!=null?o.bowlX:-0.25,1.4); ell(c,g5(bx),g5(by),95,30,0,'#0E1020'); ell(c,g5(bx),g5(by-10),90,28,0,'#4A2A1C'); ell(c,g5(bx),g5(by-18),78,20,0,'#93603C'); ell(c,g5(bx),g5(by-20),70,16,0,'#B8562E'); rect(c,g5(bx-30),g5(by-25),15,10,'#F2E8D5'); rect(c,g5(bx+10),g5(by-22),10,5,'#46613F');
    if(o.steam!==false) E4.steam(c,t,g5(bx),g5(by-30),4,{h:o.steamH||260}); }
  { const [cx,cy]=pr(0.2,1.25); rect(c,g5(cx)-120,g5(cy),240,10,'#93603C'); rect(c,g5(cx)-130,g5(cy)-5,30,15,'#5A5F73'); }
  { const [tx,ty]=pr(1.0,1.5); rect(c,g5(tx)-25,g5(ty)-110,50,110,'#E2D3B8'); rect(c,g5(tx)-15,g5(ty)-140,30,30,'#E2D3B8'); rect(c,g5(tx)-25,g5(ty)-70,50,15,'#2B3A67'); rect(c,g5(tx)+40,g5(ty)-35,40,35,'#E2D3B8'); rect(c,g5(tx)-20,g5(ty)-100,10,80,'#F2E8D5'); }
  F.light(c,W/2,1080,900,'#FFC870',0.2,{ry:0.4});
};

// =================================================================================================
// LANE (S21, reality, snow): one-point street — machiya rows converge, lanterns, wires, a vending machine
// =================================================================================================
E6.KLANE=E6.camFor('L',930,{vx:1250});
function machiya(c,K,side,Z0,Z1,seed,t,sn){ const xf=3.2*side, dir=-side; const r=mulberry(seed); const wall=r()<0.5?'#4A2A1C':'#33201A';
  Q(c,K,[[xf,0,Z0],[xf,0,Z1],[xf,5.0,Z1],[xf,5.0,Z0]],wall);
  // lower storey: koshi lattice windows (warm), door with noren
  const lit=r()<0.75; const zm=Z0+(Z1-Z0)*0.55;
  Q(c,K,[[xf,0.35,Z0+0.3],[xf,0.35,zm-0.2],[xf,2.0,zm-0.2],[xf,2.0,Z0+0.3]],lit?'#F09A48':'#1C1210');
  for(let z=Z0+0.3;z<zm-0.2;z+=0.12) Q(c,K,[[xf,0.35,z],[xf,0.35,z+0.04],[xf,2.0,z+0.04],[xf,2.0,z]],'#2A1E1A');
  Q(c,K,[[xf,0,zm],[xf,0,Z1-0.3],[xf,2.1,Z1-0.3],[xf,2.1,zm]],'#1C1210');
  Q(c,K,[[xf+dir*0.02,1.35,zm+0.05],[xf+dir*0.02,1.35,Z1-0.35],[xf+dir*0.02,2.0,Z1-0.35],[xf+dir*0.02,2.0,zm+0.05]],r()<0.5?'#2B3A67':'#6E1A1E');
  // first eave (snow on top) + upper storey slats
  Q(c,K,[[xf,2.35,Z0],[xf+dir*0.7,2.2,Z0],[xf+dir*0.7,2.2,Z1],[xf,2.35,Z1]],sn?'#C8D4F0':'#2E3756'); Q(c,K,[[xf+dir*0.7,2.2,Z0],[xf+dir*0.7,2.05,Z0],[xf+dir*0.7,2.05,Z1],[xf+dir*0.7,2.2,Z1]],'#1C2238');
  Q(c,K,[[xf,2.8,Z0+0.4],[xf,2.8,Z1-0.4],[xf,4.2,Z1-0.4],[xf,4.2,Z0+0.4]],'#E2D3B8');
  for(let z=Z0+0.4;z<Z1-0.4;z+=0.2) Q(c,K,[[xf,2.8,z],[xf,2.8,z+0.08],[xf,4.2,z+0.08],[xf,4.2,z]],'#4A2A1C');
  Q(c,K,[[xf,5.0,Z0],[xf+dir*0.9,4.75,Z0],[xf+dir*0.9,4.75,Z1],[xf,5.0,Z1]],sn?'#F2E8D5':'#1C2238');
  if(sn) Q(c,K,[[xf,0,Z0],[xf+dir*0.35,0,Z0],[xf+dir*0.35,0.25,Z1],[xf,0.3,Z1]],'#E2E8F0');
  // hanging lantern
  if(r()<0.7){ const [lx,ly]=pj(K,xf+dir*0.45,1.95,zm); const s=K.f/zm; const R=Math.max(10,s*0.16); rect(c,g5(lx)-2,g5(ly-R*2.2),5,g5(R),'#0E1020'); ell(c,g5(lx),g5(ly-R),g5(R),g5(R*1.15),0,'#D8402F'); rect(c,g5(lx-R),g5(ly-R),g5(R*2),5,'#A82A26'); F.light(c,lx,ly-R,s*1.1,'#F09A48',0.45*fl(t+seed)); }
  if(lit){ const [wx,wy]=pj(K,xf,1.2,(Z0+zm)/2); F.light(c,wx,wy,K.f/((Z0+zm)/2)*1.2,'#F09A48',0.3); } }
E6.lane=(c,t,o={})=>{ const K=o.K||E6.KLANE; const sn=o.snow!==false;
  E6.sky(c,t,{h:K.h,seed:3}); E.moon(c,420,170,80,{});
  poly(c,[[-50,K.h],[-50,K.h-60],[500,K.h-120],[1000,K.h-90],[1500,K.h-140],[1970,K.h-80],[1970,K.h]].map(([x,y])=>[x,g5(y)]),'#1C2238');
  E5.cityLights(c,t,600,1900,K.h-60,13);
  rect(c,0,g5(K.h),W,H,sn?'#A8B4D0':'#2E3756');
  // street: snow with tyre and foot tracks converging, gutter stones
  for(const X of [-0.9,-0.6,0.7,1.0]) Q(c,K,[[X,0,1.2],[X+0.12,0,1.2],[X+0.12,0,60],[X,0,60]],sn?'#8C9CC8':'#253052');
  for(const X of [-3.0,2.85]) for(let Z=1.2;Z<60;Z+=0.9) Q(c,K,[[X,0,Z],[X+0.15,0,Z],[X+0.15,0,Z+0.6],[X,0,Z+0.6]],'#5A6A9A');
  // houses far -> near on both sides
  const rows=[]; for(let k=0;k<12;k++){ const Z0=2+k*4.6; rows.push([-1,Z0,Z0+4.4,10+k]); rows.push([1,Z0+1.5,Z0+5.9,40+k]); }
  rows.sort((a,b)=>b[1]-a[1]); for(const [sd,z0,z1,sd2] of rows) machiya(c,K,sd,z0,z1,sd2,t,sn);
  // utility poles + sagging wires (reality)
  for(let Z=3;Z<50;Z+=9){ const X=2.6; const s=K.f/Z; const [x,y]=pj(K,X,0,Z), [x2,y2]=pj(K,X,7,Z); rect(c,g5(x-s*0.07),g5(y2),Math.max(5,g5(s*0.14)),g5(y-y2),'#141A30'); rect(c,g5(x-s*0.5),g5(y2+s*0.4),g5(s),Math.max(5,g5(s*0.05)),'#141A30');
    const [x3,y3]=pj(K,X,6.5,Z+9); c.fillStyle='#141A30'; for(let q=0;q<=20;q++){ const u=q/20; c.fillRect(g5(lerp(x-s*0.4,x3,u)),g5(lerp(y2+s*0.4,y3,u)+Math.sin(u*Math.PI)*s*0.25),5,5); } }
  // vending machine glowing on the left (Z 3.6)
  { const Z0=3.4, Z1=4.1, X=-3.15; Q(c,K,[[X,0,Z0],[X,0,Z1],[X,1.8,Z1],[X,1.8,Z0]],'#C8D4F0'); Q(c,K,[[X+0.01,0.9,Z0+0.08],[X+0.01,0.9,Z1-0.08],[X+0.01,1.6,Z1-0.08],[X+0.01,1.6,Z0+0.08]],'#5FB0A8');
    for(let q=0;q<4;q++) Q(c,K,[[X+0.02,1.05+q*0.13,Z0+0.12],[X+0.02,1.05+q*0.13,Z1-0.12],[X+0.02,1.1+q*0.13,Z1-0.12],[X+0.02,1.1+q*0.13,Z0+0.12]],q%2?'#D8402F':'#F2D27A');
    const [vx,vy]=pj(K,X,1.0,(Z0+Z1)/2); F.light(c,vx,vy,320,'#A8E0D0',0.5,{ry:0.8}); }
  F.amb([0.72,0.74,0.92]);
};
E6.laneFG=(c,t)=>{ E.snow(c,t,121,120,{}); };
// =================================================================================================
// COUNTER in perspective (S22, reality): the counter runs into depth; Jay on the nearest stool, the master across
// =================================================================================================
E6.KCTR=E6.camFor('L',930,{vx:860,camH:1.25});
E6.counterP=(c,t,o={})=>{ const K=E6.KCTR; const sn=o.snow!==false;
  rect(c,0,0,W,H,'#2A1E1A');
  // far wall with the entrance noren (Z 13), ceiling with beams, floor boards converging
  Q(c,K,[[-1.8,0,13],[2.6,0,13],[2.6,2.5,13],[-1.8,2.5,13]],C.w2); { const [x0,y0]=pj(K,-0.6,2.0,12.9), [x1,y1]=pj(K,0.6,0,12.9); rect(c,g5(x0),g5(y0),g5(x1-x0),g5(y1-y0),sn?'#8C9CC8':'#253052'); E4.noren(c,g5(x0)-10,g5(y0),g5(x1-x0)+20,g5((y1-y0)*0.4),3,t,{part:0.1,crest:0,col:'#2B3A67',colS:'#1F2A4C'}); }
  Q(c,K,[[-1.8,2.5,1.0],[2.6,2.5,1.0],[2.6,2.5,13],[-1.8,2.5,13]],C.w0); for(let Z=1.5;Z<13;Z+=1.1) Q(c,K,[[-1.8,2.45,Z],[2.6,2.45,Z],[2.6,2.45,Z+0.18],[-1.8,2.45,Z+0.18]],'#140E0C');
  Q(c,K,[[-1.8,0,1.0],[2.6,0,1.0],[2.6,0,13],[-1.8,0,13]],C.w1); for(let X=-1.6;X<2.6;X+=0.3) Q(c,K,[[X,0,1.0],[X+0.02,0,1.0],[X+0.02,0,13],[X,0,13]],C.w0);
  // left wall: window with snow outside, kamidana shelf with the big bell
  Q(c,K,[[-1.8,0,1.0],[-1.8,0,13],[-1.8,2.5,13],[-1.8,2.5,1.0]],C.w3); for(let Z=1.2;Z<13;Z+=0.6) Q(c,K,[[-1.8,0,Z],[-1.8,0,Z+0.03],[-1.8,2.5,Z+0.03],[-1.8,2.5,Z]],C.w2);
  Q(c,K,[[-1.79,1.1,5.0],[-1.79,1.1,7.4],[-1.79,2.0,7.4],[-1.79,2.0,5.0]],sn?'#5A6A9A':'#253052'); for(let Z=5.0;Z<7.4;Z+=0.4) Q(c,K,[[-1.78,1.1,Z],[-1.78,1.1,Z+0.05],[-1.78,2.0,Z+0.05],[-1.78,2.0,Z]],C.w0); Q(c,K,[[-1.78,1.53,5.0],[-1.78,1.53,7.4],[-1.78,1.57,7.4],[-1.78,1.57,5.0]],C.w0);
  // right: back shelves with bottles (X 2.6 plane) and lanterns
  Q(c,K,[[2.6,0,1.0],[2.6,0,13],[2.6,2.5,13],[2.6,2.5,1.0]],C.w1);
  for(const Y of [1.3,1.75,2.15]){ Q(c,K,[[2.59,Y,1.0],[2.59,Y,13],[2.59,Y+0.04,13],[2.59,Y+0.04,1.0]],C.w4); const r=mulberry(Y*10); for(let Z=1.6;Z<12;Z+=0.22){ const col=['#2F4A3A','#4A2A1C','#E2D3B8','#2B3A67','#93603C'][Math.floor(r()*5)]; Q(c,K,[[2.58,Y+0.04,Z],[2.58,Y+0.04,Z+0.1],[2.58,Y+0.33,Z+0.1],[2.58,Y+0.33,Z]],col); } }
  for(let Z=2.5;Z<12;Z+=2.4){ const [lx,ly]=pj(K,1.2,2.1,Z); const s=K.f/Z; const R=s*0.17; rect(c,g5(lx)-2,g5(ly-R*3),5,g5(R*2),'#0E1020'); ell(c,g5(lx),g5(ly-R),g5(R),g5(R*1.2),0,'#F2E8D5'); rect(c,g5(lx-R),g5(ly-R*1.1),g5(R*2),5,C.w1); F.light(c,lx,ly,s*2.2,'#FFC870',0.42*fl(t+Z)); }
  if(o.behind) o.behind(c,K);
  // the counter: top Y=0.8 from X 0.45 to 1.0, front face toward the customers, stools along it
  Q(c,K,[[0.45,0,1.3],[0.45,0,13],[0.45,0.8,13],[0.45,0.8,1.3]],C.w2); for(let Z=1.3;Z<13;Z+=0.5) Q(c,K,[[0.45,0,Z],[0.45,0,Z+0.03],[0.45,0.76,Z+0.03],[0.45,0.76,Z]],C.w1);
  Q(c,K,[[0.4,0.8,1.3],[1.25,0.8,1.3],[1.25,0.8,13],[0.4,0.8,13]],C.w4); Q(c,K,[[0.4,0.8,1.3],[0.4,0.8,13],[0.4,0.76,13],[0.4,0.76,1.3]],C.w5);
  for(let Z=3.5;Z<12.5;Z+=0.85){ const [x,y]=pj(K,0.05,0.62,Z), [x2,y2]=pj(K,0.05,0,Z); const s=K.f/Z; rect(c,g5(x-s*0.17),g5(y),g5(s*0.34),Math.max(5,g5(s*0.07)),C.w4); rect(c,g5(x-s*0.03),g5(y+s*0.07),Math.max(5,g5(s*0.06)),g5(y2-y-s*0.07),C.w1); }
  // counter props: bowls/cups along it (by depth)
  for(let Z=3.0;Z<12;Z+=1.7){ const [x,y]=pj(K,0.75,0.8,Z); const s=K.f/Z; ell(c,g5(x),g5(y),g5(s*0.1),Math.max(5,g5(s*0.03)),0,'#93603C'); }
  F.amb([0.95,0.86,0.8]);
};
E6.stool=(c,K,X,Z)=>{ const [x,y]=pj(K,X,0.62,Z), [x2,y2]=pj(K,X,0,Z); const s=K.f/Z; rect(c,g5(x-s*0.17),g5(y),g5(s*0.34),g5(s*0.07),C.w4); rect(c,g5(x-s*0.17),g5(y),g5(s*0.34),5,C.w5); rect(c,g5(x-s*0.13),g5(y+s*0.07),g5(s*0.05),g5(y2-y),C.w1); rect(c,g5(x+s*0.08),g5(y+s*0.07),g5(s*0.05),g5(y2-y),C.w1); E6.shadow(c,x,y2,g5(s*0.25)); };
// =================================================================================================
// SNOW GARDEN (S23a): pond in the ground plane, stepping stones, stone lantern, snow pine, garden wall
// =================================================================================================
E6.KGAR=E6.cam({vx:900,h:430,camH:1.7});
E6.snowGarden=(c,t,o={})=>{ const K=E6.KGAR;
  E6.sky(c,t,{h:K.h,seed:15}); E.moon(c,1380,150,95,{});
  // garden wall with tiled cap at Z 16, pines behind it
  { const r=mulberry(61); const tr=[]; for(let k=0;k<26;k++) tr.push([18+r()*14,(r()-0.5)*44,0.8+r()*0.5]); tr.sort((a,b)=>b[0]-a[0]); for(const [Z,X,hh] of tr){ const [x,y]=pj(K,X,0,Z); const s=K.f/Z, ht=s*9*hh; rect(c,g5(x-s*0.15),g5(y-ht*0.5),g5(s*0.3),g5(ht*0.5),'#1C262B'); for(let q=0;q<4;q++){ const yy=y-ht*(0.35+q*0.17), ww=s*(1.6-q*0.33); poly(c,[[g5(x-ww),g5(yy)],[g5(x),g5(yy-ht*0.22)],[g5(x+ww),g5(yy)]],Z>25?'#141A30':'#16261E'); poly(c,[[g5(x-ww*0.7),g5(yy-ht*0.04)],[g5(x),g5(yy-ht*0.2)],[g5(x+ww*0.2),g5(yy-ht*0.14)]],'#8C9CC8'); } } }
  { const [x0,y0]=pj(K,-5.5,4.6,26), [x1,y1]=pj(K,1.5,4.6,26), [xa,ya]=pj(K,-2,6.4,26); poly(c,[[g5(x0-40),g5(y0)],[g5(xa),g5(ya)],[g5(x1+40),g5(y0)]],'#1C2238'); poly(c,[[g5(x0-20),g5(y0-10)],[g5(xa),g5(ya+5)],[g5(x1+20),g5(y0-10)],[g5(x1-40),g5(y0-25)],[g5(xa),g5(ya+20)],[g5(x0+40),g5(y0-25)]],'#E2E8F0'); }
  Q(c,K,[[-12,0,16],[12,0,16],[12,2.2,16],[-12,2.2,16]],'#5A6A9A'); Q(c,K,[[-12,2.2,15.6],[12,2.2,15.6],[12,2.55,16.2],[-12,2.55,16.2]],'#1C2238'); Q(c,K,[[-12,2.5,15.8],[12,2.5,15.8],[12,2.62,16.2],[-12,2.62,16.2]],'#F2E8D5');
  for(let X=-11;X<12;X+=1.5) Q(c,K,[[X,0.1,16],[X+0.05,0.1,16],[X+0.05,2.1,16],[X,2.1,16]],'#4A5378');
  // snow ground
  rect(c,0,g5(pj(K,0,0,16)[1]),W,H,'#C8D4F0'); E.dither(c,0,g5(pj(K,0,0,16)[1]),W,60,'#A8B4D0',0.5);
  // pond: circle r=2.6 at Z 6.2 projected; ice rim, dark water, moon glint
  const pc=[0.6,6.2], R=2.6; const pts=(r)=>{ const a=[]; for(let k=0;k<32;k++){ const th=k/32*6.283; a.push([pc[0]+Math.cos(th)*r,0,pc[1]+Math.sin(th)*r*0.9]); } return a; };
  Q(c,K,pts(R+0.35),'#E2E8F0'); Q(c,K,pts(R),'#5A6A9A'); Q(c,K,pts(R-0.15),'#12303A');
  { const [mx,my]=pj(K,pc[0]+0.8,0,pc[1]+1.4); for(let j=0;j<6;j++){ const w=g5(36-j*4+Math.sin(t*3+j)*8), off=g5(Math.sin(t*4+j*1.7)*10); rect(c,g5(mx)+off-w,g5(my)+j*10,w*2,5,j%2?'#C8D4F0':'#8C9CC8'); } }
  if(o.mirror) o.mirror(c,K,pts(R-0.15),pc);
  F.ripples(c,t,{n:5,x0:pj(K,pc[0]-2,0,pc[1])[0],x1:pj(K,pc[0]+2,0,pc[1])[0],y0:pj(K,0,0,pc[1]+1.6)[1],y1:pj(K,0,0,pc[1]-1.6)[1],r0:5,r1:35,sq:0.3,col:'#5FB0A8',per:1.1,seed:23});
  // stepping stones toward the pond (snow-capped)
  for(let k=0;k<6;k++){ const Z=1.6+k*0.75, X=-0.4+Math.sin(k*1.3)*0.35; const [x,y]=pj(K,X,0,Z); const s=K.f/Z; ell(c,g5(x),g5(y+5),g5(s*0.28),g5(s*0.09),0,'#43475A'); ell(c,g5(x),g5(y),g5(s*0.26),g5(s*0.08),0,'#E2E8F0'); }
  // stone lantern (left, Z 3.0), lit window, snow cap
  { const Z=3.0, X=-2.4; E6.box(c,K,X-0.12,X+0.12,0,0.9,Z,Z+0.24,'#7E7C76','#5A5F73','#E2E8F0'); E6.box(c,K,X-0.3,X+0.3,0.9,1.25,Z-0.05,Z+0.55,'#7E7C76','#5A5F73','#E2E8F0');
    const [wx,wy]=pj(K,X-0.12,1.18,Z-0.06), [wx2,wy2]=pj(K,X+0.12,0.97,Z-0.06); rect(c,g5(wx),g5(wy),g5(wx2-wx),g5(wy2-wy),'#FFC870');
    Q(c,K,[[X-0.5,1.25,Z-0.25],[X+0.5,1.25,Z-0.25],[X,1.75,Z+0.25]],'#5A5F73'); Q(c,K,[[X-0.5,1.27,Z-0.25],[X+0.5,1.27,Z-0.25],[X+0.2,1.55,Z],[X-0.2,1.55,Z]],'#F2E8D5'); F.light(c,(wx+wx2)/2,(wy+wy2)/2,260,'#FFC870',0.55*fl(t)); }
  // snow pine (right, Z 4.5) and shrubs
  { const [x,y]=pj(K,3.4,0,4.5); const s=K.f/4.5; rect(c,g5(x-s*0.08),g5(y-s*2.6),g5(s*0.16),g5(s*2.6),'#33201A'); for(let k=0;k<4;k++){ const yy=y-s*(1.0+k*0.5), ww=s*(1.3-k*0.25); blob(c,[[x-ww,yy+s*0.15],[x-ww*0.3,yy-s*0.2],[x+ww*0.6,yy-s*0.15],[x+ww,yy+s*0.15]],'#16261E'); blob(c,[[x-ww*0.9,yy],[x-ww*0.2,yy-s*0.22],[x+ww*0.7,yy-s*0.18],[x+ww*0.9,yy-s*0.02]],'#E2E8F0'); } }
  for(const [X,Z] of [[-4,6],[4.5,8],[-1.8,9.5],[2.2,10.5]]){ const [x,y]=pj(K,X,0,Z); const s=K.f/Z; blob(c,[[x-s*0.6,y],[x-s*0.2,y-s*0.5],[x+s*0.5,y-s*0.4],[x+s*0.7,y]],'#22382A'); blob(c,[[x-s*0.55,y-s*0.15],[x-s*0.2,y-s*0.52],[x+s*0.45,y-s*0.42],[x+s*0.6,y-s*0.2]],'#E2E8F0'); }
  // shishi-odoshi (bamboo deer-scarer) at the pond edge: tips every 2 s
  { const [x,y]=pj(K,pc[0]+2.4,0,pc[1]-1.6); const s=K.f/(pc[1]-1.6); const ph=(t*0.5)%1, tip=ph>0.92; c.save(); c.translate(g5(x),g5(y-s*0.35)); c.rotate(tip?0.5:-0.25); rect(c,-s*0.45,-s*0.05,s*0.9,s*0.1,'#7C9A6E'); rect(c,-s*0.45,-s*0.05,s*0.9,5,'#A8C08A'); c.restore(); rect(c,g5(x-5),g5(y-s*0.4),10,g5(s*0.4),'#46613F'); }
  F.amb([0.8,0.84,1.0]);
};
// =================================================================================================
// TORII from the side (S24): near pillar row in front, the path between, far pillars behind; beams converge
// =================================================================================================
E6.KTOR=E6.camFor('L',930,{vx:960});
E6.toriiSide=(c,t,cam,o={})=>{ const K=E6.KTOR; const sn=o.snow!==false; const Zn=2.45, Zf=4.1;
  E6.sky(c,t,{h:K.h,seed:27}); E.moon(c,1500,160,90,{});
  // hillside forest behind: cedars rooted at depth, stone lanterns lit
  poly(c,[[-50,K.h+40],[-50,K.h-200],[700,K.h-260],[1300,K.h-180],[1970,K.h-240],[1970,K.h+40]].map(([x,y])=>[x,g5(y)]),'#16261E');
  { const r=mulberry(5); for(let k=0;k<40;k++){ const Z=6+r()*14, X=(r()-0.5)*40-cam*0.9; const [x,y]=pj(K,X,0,Z); if(x<-60||x>W+60) continue; const s=K.f/Z; rect(c,g5(x-s*0.12),g5(y-s*6),Math.max(5,g5(s*0.24)),g5(s*6),'#1C262B'); blob(c,[[x-s*0.9,y-s*3],[x,y-s*6.5],[x+s*0.9,y-s*3]],Z>13?'#141A30':'#16261E'); if(sn) blob(c,[[x-s*0.6,y-s*4],[x,y-s*6.3],[x+s*0.5,y-s*4.3]],'#5A6A9A'); } }
  rect(c,0,g5(pj(K,0,0,6)[1]),W,H,sn?'#A8B4D0':'#22382A');
  for(let X=Math.floor(cam/3)*3-9;X<cam+9;X+=3){ const Z=5.5; const [x,y]=pj(K,X-cam,0,Z); const s=K.f/Z; rect(c,g5(x-s*0.1),g5(y-s*0.9),g5(s*0.2),g5(s*0.9),'#7E7C76'); rect(c,g5(x-s*0.2),g5(y-s*1.2),g5(s*0.4),g5(s*0.3),'#7E7C76'); rect(c,g5(x-s*0.12),g5(y-s*1.15),g5(s*0.24),g5(s*0.2),'#FFC870'); rect(c,g5(x-s*0.28),g5(y-s*1.32),g5(s*0.56),Math.max(5,g5(s*0.08)),sn?'#F2E8D5':'#5A5F73'); F.light(c,x,y-s*1.05,s*1.4,'#FFC870',0.4*fl(t+X)); }
  // the path between the rows (stone slabs) and snow banks
  Q(c,K,[[-50,0,Zn-0.3],[50,0,Zn-0.3],[50,0,Zf+0.3],[-50,0,Zf+0.3]],'#5A5F73');
  for(let X=Math.floor(cam/0.8)*0.8-8;X<cam+8;X+=0.8) Q(c,K,[[X-cam,0,Zn-0.3],[X-cam+0.03,0,Zn-0.3],[X-cam+0.03,0,Zf+0.3],[X-cam,0,Zf+0.3]],'#43475A');
  if(sn){ Q(c,K,[[-50,0,Zf+0.3],[50,0,Zf+0.3],[50,0.12,Zf+0.6],[-50,0.12,Zf+0.6]],'#E2E8F0'); }
  const gates=[]; for(let X=Math.floor(cam/1.25)*1.25-8;X<cam+8;X+=1.25) gates.push(X-cam);
  const pillar=(X,Z)=>{ E6.box(c,K,X-0.1,X+0.1,0,2.6,Z-0.1,Z+0.1,'#B8302A','#7A1E1A',null); Q(c,K,[[X-0.12,0,Z-0.11],[X+0.12,0,Z-0.11],[X+0.12,0.25,Z-0.11],[X-0.12,0.25,Z-0.11]],'#0E1020'); };
  for(const X of gates){ pillar(X,Zf); }
  // beams (nuki + kasagi) spanning near->far, drawn over the far pillars
  for(const X of gates){ Q(c,K,[[X-0.08,2.15,Zn-0.25],[X+0.08,2.15,Zn-0.25],[X+0.08,2.15,Zf+0.25],[X-0.08,2.15,Zf+0.25]],'#B8302A'); Q(c,K,[[X-0.08,2.15,Zn-0.25],[X+0.08,2.15,Zn-0.25],[X+0.08,2.3,Zn-0.25],[X-0.08,2.3,Zn-0.25]],'#7A1E1A');
    Q(c,K,[[X-0.14,2.6,Zn-0.45],[X+0.14,2.6,Zn-0.45],[X+0.14,2.6,Zf+0.45],[X-0.14,2.6,Zf+0.45]],'#B8302A'); Q(c,K,[[X-0.16,2.72,Zn-0.5],[X+0.16,2.72,Zn-0.5],[X+0.16,2.6,Zn-0.45],[X-0.16,2.6,Zn-0.45]],'#0E1020');
    if(sn) Q(c,K,[[X-0.16,2.74,Zn-0.5],[X+0.16,2.74,Zn-0.5],[X+0.16,2.74,Zf+0.5],[X-0.16,2.74,Zf+0.5]],'#F2E8D5'); }
  E6.toriiNear=()=>{ for(const X of gates){ pillar(X,Zn); if(sn) Q(c,K,[[X-0.1,0,Zn-0.1],[X+0.25,0,Zn-0.1],[X+0.25,0.15,Zn-0.3],[X-0.1,0.15,Zn-0.3]],'#E2E8F0'); } };
  F.amb([0.76,0.78,0.98]);
};
// =================================================================================================
// TRAIN (side, elevated camera): roof plane in perspective, the side face below, catenary poles sweeping past
// size class fixes the roof centre depth Zc; world scrolls at v m/s while the camera tracks the train
// =================================================================================================
E6.trainSide=(c,t,K,o={})=>{ const Zc=o.Zc, v=o.v||18, wx=t*v+(o.shift||0), duo=!!o.duo, sn=!!o.snow;
  const A=duo?'#26304F':'#141A30', Am=duo?'#4A5378':'#1C2238', B=duo?'#8C8A7E':'#253052', Bd=duo?'#CFC3AA':'#C8D4F0';
  const body=duo?'#CFC3AA':'#A8B4D0', bodyS=duo?'#8C8A7E':'#5A6A9A', stripe=duo?'#4A5378':'#7C9A6E', roofC=duo?'#8C8A7E':'#5A6A9A', roofL=duo?'#CFC3AA':'#8C9CC8';
  if(duo){ rect(c,0,0,W,H,'#E2D3B8'); E.dither(c,0,0,W,g5(K.h),'#CFC3AA',0.5); } else { E6.sky(c,t,{h:K.h,seed:o.seed||41}); if(o.moon!==false) E.moon(c,o.mx||1500,o.my||180,o.mr||100,{}); }
  // far mountains, city on the plain below (Y -14), parallax by depth
  poly(c,[[-50,K.h+5],[-50,K.h-90],[400,K.h-140],[900,K.h-80],[1400,K.h-150],[1970,K.h-100],[1970,K.h+5]].map(([x,y])=>[x,g5(y)]),duo?'#8C8A7E':'#1C2238');
  rect(c,0,g5(K.h),W,H,duo?'#8C8A7E':'#141A30');
  { const r=mulberry(17); const bl=[]; for(let k=0;k<70;k++){ const Z=18+r()*r()*140, X0=r()*400, w=4+r()*10, ht=3+r()*r()*30; bl.push([Z,X0,w,ht,r()]); } bl.sort((a,b)=>b[0]-a[0]);
    for(const [Z,X0,w,ht,q] of bl){ const span=Z*2.6; const X=((X0-wx)%400+400)%400-200; if(Math.abs(X)>span) continue; const [x0,y0]=pj(K,X,-14,Z), [x1,y1]=pj(K,X+w,-14+ht,Z); if(x1<0||x0>W) continue;
      rect(c,g5(x0),g5(y1),Math.max(5,g5(x1-x0)),g5(y0-y1),duo?(Z>60?'#8C8A7E':'#4A5378'):(Z>60?'#1C2238':'#253052'));
      if(!duo){ const rr=mulberry(Math.floor(q*1000)); for(let yy=y1+10;yy<y0-5;yy+=Math.max(10,g5(800/Z*1.4))) for(let xx=x0+5;xx<x1-5;xx+=Math.max(10,g5(800/Z*1.2))) if(rr()<0.35) rect(c,g5(xx),g5(yy),5,5,rr()<0.7?'#F2D27A':'#F09A48'); }
      if(sn) rect(c,g5(x0),g5(y1),Math.max(5,g5(x1-x0)),5,Bd); } }
  // viaduct deck + far parapet (Y -4.4) and far-side catenary poles (Z Zc+2.6)
  Q(c,K,[[-60,-4.4,Zc+2.9],[60,-4.4,Zc+2.9],[60,-4.4,Zc-2.0],[-60,-4.4,Zc-2.0]],duo?'#4A5378':'#253052');
  Q(c,K,[[-60,-4.4,Zc+2.9],[60,-4.4,Zc+2.9],[60,-3.5,Zc+2.9],[-60,-3.5,Zc+2.9]],duo?'#8C8A7E':'#43475A'); if(sn) Q(c,K,[[-60,-3.5,Zc+2.9],[60,-3.5,Zc+2.9],[60,-3.45,Zc+2.95],[-60,-3.45,Zc+2.95]],Bd);
  const poleSp=24; const poles=(Z,col,wire)=>{ for(let k=-3;k<=3;k++){ const X=((k*poleSp-wx)%(poleSp*7)+poleSp*7*1.5)%(poleSp*7)-poleSp*3.5; const [x,y]=pj(K,X,-4.4,Z), [x2,y2]=pj(K,X,2.6,Z); if(x<-200||x>W+200) continue; const s=K.f/Z; rect(c,g5(x-s*0.1),g5(y2),Math.max(5,g5(s*0.2)),g5(y-y2),col); const [xa,ya]=pj(K,X,2.4,Z), [xb]=pj(K,X,2.4,Zc); rect(c,g5(Math.min(x,xb)),g5(ya),g5(Math.abs(xb-x))+5,Math.max(5,g5(s*0.06)),col); } };
  poles(Zc+2.6,A);
  // the cars: roof (Y 0) from Zc-1.45..Zc+1.45, side face at Zc-1.45 down to -3.4; gaps between cars
  const cars=o.cars||[[-30,-0.6],[0.6,30]];
  for(const [X0,X1] of cars){ Q(c,K,[[X0,0,Zc-1.45],[X1,0,Zc-1.45],[X1,0,Zc+1.45],[X0,0,Zc+1.45]],roofC);
    Q(c,K,[[X0,0,Zc-1.45],[X1,0,Zc-1.45],[X1,0,Zc-1.2],[X0,0,Zc-1.2]],roofL); Q(c,K,[[X0,0,Zc+1.2],[X1,0,Zc+1.2],[X1,0,Zc+1.45],[X0,0,Zc+1.45]],roofL);
    for(let X=X0+0.5;X<X1;X+=1.0) Q(c,K,[[X,0,Zc-1.2],[X+0.05,0,Zc-1.2],[X+0.05,0,Zc+1.2],[X,0,Zc+1.2]],duo?'#4A5378':'#4A5378');
    if(sn) for(let X=X0+0.4;X<X1-1.5;X+=2.3) Q(c,K,[[X,0,Zc+0.3],[X+1.1,0,Zc+0.1],[X+1.4,0,Zc+0.9],[X+0.2,0,Zc+1.1]],Bd);
    for(const vx of [X0+3,X1-3]) if(vx>X0+1&&vx<X1-1) E6.box(c,K,vx-0.6,vx+0.6,0,0.28,Zc-0.5,Zc+0.5,bodyS,Am,roofL);
    Q(c,K,[[X0,0,Zc-1.45],[X1,0,Zc-1.45],[X1,-3.2,Zc-1.45],[X0,-3.2,Zc-1.45]],body);
    Q(c,K,[[X0,-1.55,Zc-1.46],[X1,-1.55,Zc-1.46],[X1,-1.75,Zc-1.46],[X0,-1.75,Zc-1.46]],stripe);
    for(let k=0,X=X0+0.8;X<X1-1.4;k++,X+=1.9){ const zf=Zc-1.47; if(k%4===2){ Q(c,K,[[X,-0.15,zf],[X+1.3,-0.15,zf],[X+1.3,-2.9,zf],[X,-2.9,zf]],bodyS); Q(c,K,[[X+0.64,-0.15,zf-0.005],[X+0.66,-0.15,zf-0.005],[X+0.66,-2.9,zf-0.005],[X+0.64,-2.9,zf-0.005]],A);
        for(const dx of [0.15,0.8]) Q(c,K,[[X+dx,-0.45,zf-0.01],[X+dx+0.35,-0.45,zf-0.01],[X+dx+0.35,-1.3,zf-0.01],[X+dx,-1.3,zf-0.01]],duo?'#4A5378':'#F2D27A'); continue; }
      Q(c,K,[[X,-0.4,zf],[X+1.4,-0.4,zf],[X+1.4,-1.35,zf],[X,-1.35,zf]],Am); Q(c,K,[[X+0.06,-0.46,zf-0.005],[X+0.67,-0.46,zf-0.005],[X+0.67,-1.29,zf-0.005],[X+0.06,-1.29,zf-0.005]],duo?'#4A5378':'#F2D27A'); Q(c,K,[[X+0.73,-0.46,zf-0.005],[X+1.34,-0.46,zf-0.005],[X+1.34,-1.29,zf-0.005],[X+0.73,-1.29,zf-0.005]],duo?'#8C8A7E':'#F09A48');
      if(!duo){ const r=mulberry(Math.floor(X*13)); if(r()<0.6){ const px=X+0.2+r()*1.0; Q(c,K,[[px,-0.75,zf-0.008],[px+0.18,-0.75,zf-0.008],[px+0.18,-1.29,zf-0.008],[px,-1.29,zf-0.008]],'#4A2A1C'); } } }
    Q(c,K,[[X0,-0.02,Zc-1.47],[X1,-0.02,Zc-1.47],[X1,-0.12,Zc-1.47],[X0,-0.12,Zc-1.47]],bodyS);
    Q(c,K,[[X0,-3.2,Zc-1.4],[X1,-3.2,Zc-1.4],[X1,-3.9,Zc-1.4],[X0,-3.9,Zc-1.4]],A); }
  if(!duo){ const [lx,ly]=pj(K,0,-1,Zc-1.45); F.light(c,lx,ly+80,900,'#F2D27A',0.18,{ry:0.25}); }
  E6.trainNear=()=>{ if(o.nearPoles) poles(Math.max(1.0,Zc-2.5),A); const [,wy]=pj(K,0,2.4,Zc); rect(c,0,g5(wy),W,5,A); const [,wy2]=pj(K,0,2.4,Zc+2.6); rect(c,0,g5(wy2),W,5,Am);
    if(sn) E.snow(c,t,o.snowSeed||61,90,{wind:600}); if(o.speedLines!==false){ const r=mulberry(Math.floor(t*30)); for(let k=0;k<4;k++){ const y=g5(r()*H), x=g5(r()*W); rect(c,x,y,g5(200+r()*300),5,duo?'#E2D3B8':'#4A5378'); } } };
  if(duo) F.amb([1,1,1]); else F.amb([0.72,0.76,0.98]);
};
// silent-film dressing for the duotone train: letterbox bars with sprocket holes, gate jitter, scratches, grain, vignette
E6.silent=(c,t)=>{ const tq=Math.floor(t*12)/12; const A='#26304F',B='#8C8A7E',Bd='#CFC3AA'; const r=mulberry(Math.floor(t*12)*7+3);
  for(let k=0;k<70;k++){ const x=g5(r()*W), y=g5(110+r()*(H-220)); rect(c,x,y,5,5,r()<0.5?A:Bd); } if(r()<0.3){ const x=g5(r()*W); rect(c,x,110,5,H-220,'#E8DCC4'); }
  for(let k=0;k<8;k++){ E.dither(c,0,110+k*20,(8-k)*30,20,A,0.5); E.dither(c,W-(8-k)*30,110+k*20,(8-k)*30,20,A,0.5); E.dither(c,0,H-130-k*20,(8-k)*30,20,A,0.5); E.dither(c,W-(8-k)*30,H-130-k*20,(8-k)*30,20,A,0.5); }
  const j=Math.round((Math.sin(Math.floor(t*12)*12.9898)*43758.5%1)*4); rect(c,0,0,W,110+g5(j),'#14182A'); rect(c,0,H-110,W,110,'#14182A'); for(let x=20-((tq*240)%90);x<W;x+=90){ rrect(c,x,30,46,46,8,B); rrect(c,x,H-78,46,46,8,B); } };
// =================================================================================================
// KEEP ROOF: a ridge running along X at depth Zr; the near slope's tile rows converge below it; lower tiers, the
// castle compound and the city far below; moon, weather. Characters stand on the ridge top (Y 0).
// =================================================================================================
E6.keepRoof=(c,t,K,o={})=>{ const Zr=o.Zr, cam=o.cam||0, wx=o.wx||'snow', sil=!!o.sil, storm=wx==='storm', sn=wx==='snow'||storm&&false;
  const flash=o.flash||0;
  if(storm){ rect(c,0,0,W,H,flash?'#4A5378':'#0E1020'); rect(c,0,g5(K.h*0.5),W,H,flash?'#5A6A9A':'#141A30'); const r=mulberry(81); for(let k=0;k<14;k++){ const x=((r()*2400-t*40*(1+k%3))%2400+2400)%2400-240, y=r()*K.h*0.9, w=300+r()*500; ell(c,g5(x),g5(y),g5(w/2),g5(30+r()*40),0,flash?'#8C9CC8':(k%2?'#1C2238':'#253052')); } }
  else { E6.sky(c,t,{h:K.h,seed:o.seed||51,top:o.top,mid:o.mid,low:o.low}); }
  if(o.moon!==false&&!storm){ const m=o.moon||{x:1400,y:220,r:140}; E.moon(c,g5(m.x-cam*20),m.y,m.r,{}); F.light(c,m.x-cam*20,m.y,m.r*3.2,'#C8D4F0',0.2); }
  // distant mountains + city plain (Y -40)
  if(sil){ rect(c,0,g5(K.h-160),W,160,'#253052'); E.dither(c,0,g5(K.h-260),W,100,'#253052',0.5); rect(c,0,g5(K.h-60),W,60,'#2E3756'); } else poly(c,[[-50,K.h+5],[-50,K.h-70],[500,K.h-120],[1000,K.h-60],[1500,K.h-110],[1970,K.h-60],[1970,K.h+5]].map(([x,y])=>[x,g5(y)]),'#1C2238');
  rect(c,0,g5(K.h),W,H,sil?'#0E1020':'#141A30');
  // the castle town on the plain far below (Y -40): snowy roofs by depth, lantern-lit streets converging
  { const r=mulberry(23); const hs=[]; for(let k=0;k<300;k++){ const Z=36+r()*r()*420, X=(r()-0.5)*Z*2.8; hs.push([Z,X,r(),r(),r()]); } hs.sort((p,q)=>q[0]-p[0]);
    for(const [Z,X0,q1,q2,q3] of hs){ const X=X0-cam; const [x,y]=pj(K,X,-40,Z); if(y<K.h-5||y>H+40||x<-80||x>W+80) continue; const s=K.f/Z; const w=Math.max(5,s*(3+q1*4)), hw=Math.max(5,s*2.0), rh=Math.max(5,s*1.6);
      if(sil){ rect(c,g5(x-w/2),g5(y-hw),g5(w),g5(hw),'#0E1020'); continue; }
      rect(c,g5(x-w/2),g5(y-hw),g5(w),g5(hw),'#1C1210'); if(q2<0.55) rect(c,g5(x-w/4),g5(y-hw*0.7),Math.max(5,g5(w/5)),5,q3<0.7?'#F2D27A':'#F09A48');
      poly(c,[[g5(x-w/2-s*0.6),g5(y-hw)],[g5(x+w/2+s*0.6),g5(y-hw)],[g5(x+w/2-s*0.4),g5(y-hw-rh)],[g5(x-w/2+s*0.4),g5(y-hw-rh)]],wx==='snow'?(Z>120?'#4A5378':(q3<0.5?'#8C9CC8':'#5A6A9A')):(storm?'#253052':'#2E3756'));
      if(wx==='snow'&&q2<0.35&&Z<150) rect(c,g5(x-w/2+s*0.4),g5(y-hw-rh),g5(w-s*0.8),5,'#C8D4F0'); }
    if(!sil) for(const [X0,dir] of [[-30,0.5],[40,-0.4],[5,0.05]]){ for(let Z=30;Z<400;Z*=1.08){ const X=X0+dir*Z-cam; const [x,y]=pj(K,X,-40,Z); if(y<K.h||y>H||x<0||x>W) continue; rect(c,g5(x),g5(y),5,5,'#FFC870'); } } }
  if(!sil){ const r=mulberry(57); for(let k=0;k<40;k++){ const Z=20+r()*14, X=(r()-0.5)*50-cam; const [x,y]=pj(K,X,-31,Z); if(y>H+50) continue; const s=K.f/Z; blob(c,[[x-s*2,y],[x-s*1.2,y-s*2.2],[x+s*0.6,y-s*2.8],[x+s*2,y]],'#16261E'); if(wx==='snow') blob(c,[[x-s*1.2,y-s*1.9],[x+s*0.5,y-s*2.7],[x+s*1.2,y-s*2.0]],'#5A6A9A'); } E.dither(c,0,g5(K.h),W,40,'#253052',0.5); }
  // the honmaru walls and a corner turret below the keep
  if(o.tiers!==false){ const Yw=-30, z0=22, z1=48, x0=-18-cam*0.6, x1=14-cam*0.6; const wcol=sil?'#0E1020':'#C8D4A0', capc=sil?'#0E1020':(wx==='snow'?'#E2E8F0':'#2E3756');
    Q(c,K,[[x0,Yw,z1],[x1,Yw,z1],[x1,Yw+1.8,z1],[x0,Yw+1.8,z1]],wcol); Q(c,K,[[x0-0.3,Yw+1.8,z1+0.3],[x1+0.3,Yw+1.8,z1+0.3],[x1+0.3,Yw+2.2,z1-0.3],[x0-0.3,Yw+2.2,z1-0.3]],capc);
    for(const xx of [x0,x1]){ Q(c,K,[[xx,Yw,z0],[xx,Yw,z1],[xx,Yw+1.8,z1],[xx,Yw+1.8,z0]],sil?'#0E1020':'#A8B488'); Q(c,K,[[xx-0.3,Yw+2.2,z0],[xx-0.3,Yw+2.2,z1],[xx+0.3,Yw+1.8,z1],[xx+0.3,Yw+1.8,z0]],capc); }
    E6.box(c,K,x1-3,x1+3,Yw,Yw+5,z1-3,z1+3,wcol,sil?'#0E1020':'#A8B488',null); Q(c,K,[[x1-3.8,Yw+5,z1-3.8],[x1+3.8,Yw+5,z1-3.8],[x1+1.5,Yw+7.5,z1],[x1-1.5,Yw+7.5,z1]],capc); if(!sil){ const [lx,ly]=pj(K,x1,Yw+3,z1-3.01); rect(c,g5(lx-10),g5(ly),20,15,'#F2D27A'); } }
  if(o.pagoda){ const [px,py]=pj(K,o.pagoda[0]-cam,-40,o.pagoda[1]); const s=K.f/o.pagoda[1]; for(let k=0;k<5;k++){ const y=py-k*s*3.2, w=s*(5.2-k*0.7); rect(c,g5(px-w*0.35),g5(y-s*2.4),g5(w*0.7),g5(s*2.4),sil?'#0E1020':'#4A2A1C'); poly(c,[[g5(px-w),g5(y-s*2.4)],[g5(px+w),g5(y-s*2.4)],[g5(px+w*0.55),g5(y-s*3.3)],[g5(px-w*0.55),g5(y-s*3.3)]],sil?'#0E1020':'#1C2238'); if(!sil&&wx==='snow') rect(c,g5(px-w*0.9),g5(y-s*2.5),g5(w*1.8),5,'#E2E8F0'); if(!sil) rect(c,g5(px-10),g5(y-s*1.4),20,20,'#F2D27A'); }
    rect(c,g5(px-5),g5(py-s*20),10,g5(s*4.5),sil?'#0E1020':'#93603C'); for(let q=0;q<5;q++) rect(c,g5(px-s*0.6),g5(py-s*19+q*s*0.7),g5(s*1.2),5,sil?'#0E1020':'#93603C'); }
  if(o.farRidge){ const fr=o.farRidge; E6.box(c,K,fr.X0-cam,fr.X1-cam,fr.Y-0.35,fr.Y,fr.Z-0.2,fr.Z+0.2,sil?'#0E1020':'#43475A',sil?'#0E1020':'#43475A',sil?'#141A30':(wx==='snow'?'#E2E8F0':'#5A6A9A'));
    Q(c,K,[[fr.X0-cam,fr.Y-0.3,fr.Z-0.2],[fr.X1-cam,fr.Y-0.3,fr.Z-0.2],[fr.X1-cam,fr.Y-3,fr.Z-2.6],[fr.X0-cam,fr.Y-3,fr.Z-2.6]],sil?'#0E1020':'#253052'); }
  if(o.behind) o.behind(c,K);
  if(o.step){ const st=o.step; E6.box(c,K,-40,st.x-cam,st.y-0.35,st.y,Zr-0.22,Zr+0.22,sil?'#141A30':'#43475A',sil?'#141A30':'#43475A',sil?'#141A30':(wx==='snow'?'#E2E8F0':'#5A6A9A'));
    Q(c,K,[[st.x-cam,st.y,Zr-0.3],[st.x-cam,st.y,Zr+3],[st.x-cam,0.6,Zr+3],[st.x-cam,0.6,Zr-0.3]],sil?'#0E1020':'#C8D4A0'); Q(c,K,[[st.x-cam+0.02,st.y+0.9,Zr+0.3],[st.x-cam+0.02,st.y+0.9,Zr+1.0],[st.x-cam+0.02,st.y+1.5,Zr+1.0],[st.x-cam+0.02,st.y+1.5,Zr+0.3]],'#2A1E1A'); }
  // the ridge (Y -0.35..0) and the near slope with converging tile columns
  const sl=sil?'#0E1020':'#2E3756', sl2=sil?'#0E1020':'#1C2238'; let cap=sil?'#141A30':'#43475A';
  Q(c,K,[[-40,-0.3,Zr-0.2],[40,-0.3,Zr-0.2],[40,-3.2,Zr-3.4+Math.max(0,0.55-(Zr-3.4))+0],[-40,-3.2,Zr-3.4+Math.max(0,0.55-(Zr-3.4))]],sl);
  if(!sil){ const zl=Math.max(0.55,Zr-3.4); for(let X=Math.floor(cam/0.33)*0.33-14;X<cam+14;X+=0.33){ const x=X-cam; Q(c,K,[[x,-0.3,Zr-0.2],[x+0.1,-0.3,Zr-0.2],[x+0.1,-3.2,zl],[x,-3.2,zl]],sl2); }
    for(let k=1;k<9;k++){ const u=k/9; const Y=lerp(-0.3,-3.2,u), Z=lerp(Zr-0.2,zl,u); Q(c,K,[[-40,Y,Z],[40,Y,Z],[40,Y-0.03,Z-0.04],[-40,Y-0.03,Z-0.04]],'#141A30'); }
    if(wx==='snow'){ const r=mulberry(91); for(let k=0;k<22;k++){ const X=(r()-0.5)*20-cam*0, u=0.1+r()*0.8; const Y=lerp(-0.3,-3.2,u), Z=lerp(Zr-0.2,zl,u); const w=0.4+r()*0.9; Q(c,K,[[X-cam,Y,Z],[X-cam+w,Y,Z],[X-cam+w*0.8,Y-0.12,Z-0.15],[X-cam+0.1,Y-0.12,Z-0.15]],'#C8D4F0'); } }
    if(storm){ const r=mulberry(Math.floor(t*15)); for(let k=0;k<16;k++){ const X=(r()-0.5)*10, u=r(); const [x,y]=pj(K,X,lerp(-0.3,-3.2,u),lerp(Zr-0.2,zl,u)); rect(c,g5(x),g5(y),15,5,'#8C9CC8'); } } }
  E6.box(c,K,o.step?o.step.x-cam:-40,40,-0.35,0,Zr-0.22,Zr+0.22,cap,cap,sil?'#141A30':(wx==='snow'?'#E2E8F0':'#5A6A9A'));
  if(!sil){ Q(c,K,[[-40,-0.35,Zr-0.23],[40,-0.35,Zr-0.23],[40,-0.3,Zr-0.23],[-40,-0.3,Zr-0.23]],'#141A30'); }
  // shachihoko on the ridge end: golden carp, head down facing out, body arching back, forked tail up
  if(o.shachi!=null){ const X=o.shachi-cam; const [x,y]=pj(K,X,0,Zr); const s=K.f/Zr; const d=X>0?1:-1; const P2=(pts)=>pts.map(([a,b])=>[g5(x+a*s*d),g5(y-b*s)]);
    const gold=sil?'#0E1020':'#D9A441', gl=sil?'#141A30':'#F2D27A', gd=sil?'#0E1020':'#93603C';
    poly(c,P2([[-0.22,0],[0.3,0],[0.38,0.12],[0.3,0.22],[0.2,0.3],[0.24,0.5],[0.16,0.72],[0.02,0.86],[-0.08,0.98],[-0.1,0.86],[-0.2,0.62],[-0.26,0.36]]),gold);
    poly(c,P2([[-0.08,0.98],[0.2,1.18],[0.3,1.32],[0.06,1.16],[-0.06,1.3],[-0.12,1.12]]),gold);
    poly(c,P2([[0.3,0],[0.42,0.04],[0.38,0.12]]),gd); for(const [a,b] of [[0.0,0.2],[-0.05,0.4],[0.0,0.6],[-0.05,0.78]]) poly(c,P2([[a-0.1,b],[a+0.12,b],[a+0.01,b+0.07]]),gd);
    poly(c,P2([[0.14,0.3],[0.24,0.5],[0.12,0.64]]),gl); rect(c,g5(x+0.2*s*d)-5,g5(y-0.18*s),10,10,'#0E1020'); poly(c,P2([[-0.2,0.45],[-0.42,0.36],[-0.24,0.3]]),gd);
    if(!sil) F.light(c,x,y-s*0.6,s*0.9,'#F2D27A',0.22); }
  if(storm){ const r=mulberry(Math.floor(t*30)); for(let k=0;k<120;k++){ const x=g5(r()*W), y=g5(r()*H); poly(c,[[x,y],[x+5,y],[x-25,y+70],[x-30,y+70]],k%3?'#4A5378':'#8C9CC8'); } }
  F.amb(o.amb||(sil?[0.6,0.62,0.9]:(storm?[0.6,0.64,0.95]:[0.74,0.78,1.0])));
};
// lightning bolt (sky-only, one frame): jagged polyline, no full-frame washout
E6.bolt=(c,x,y0,y1,seed)=>{ const r=mulberry(seed); let px=x, py=y0; while(py<y1){ const nx=px+(r()-0.5)*120, ny=py+40+r()*60; const dx=nx-px, dy=ny-py, n=Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/5); for(let i=0;i<n;i++) rect(c,g5(px+dx*i/n),g5(py+dy*i/n),10,10,'#FFF8EC'); if(r()<0.25){ let bx=nx, by=ny; for(let j=0;j<4;j++){ const qx=bx+(r()-0.3)*80, qy=by+30+r()*40; const m=Math.ceil(Math.max(Math.abs(qx-bx),Math.abs(qy-by))/5); for(let i=0;i<m;i++) rect(c,g5(bx+(qx-bx)*i/m),g5(by+(qy-by)*i/m),5,5,'#C8D4F0'); bx=qx; by=qy; } } px=nx; py=ny; } F.light(c,x,(y0+y1)/2,500,'#C8D4F0',0.4,{add:true}); };
// =================================================================================================
// ATTIC: one-point interior, A-frame trusses at fixed depths (one at the M depth for the beam-croucher), moon shafts
// =================================================================================================
E6.KATT=E6.camFor('L',935,{vx:960,camH:1.5});
E6.attic=(c,t,K,o={})=>{ const cam=o.cam||0; const zs=[1.3,2.0,2.963,3.98,5.93,7.9,9.9,11.9]; const ZB=13.5, HW=4.2, YW=1.4, YR=4.4;
  rect(c,0,0,W,H,'#140E0C');
  // far gable wall with a lattice vent (moon behind it)
  Q(c,K,[[-HW-cam,0,ZB],[HW-cam,0,ZB],[HW-cam,YW,ZB],[-cam,YR,ZB],[-HW-cam,YW,ZB]],C.w1);
  { const [x0,y0]=pj(K,-0.8-cam,3.0,ZB), [x1,y1]=pj(K,0.8-cam,1.7,ZB); rect(c,g5(x0),g5(y0),g5(x1-x0),g5(y1-y0),'#8C9CC8'); circ(c,g5((x0+x1)/2+20),g5((y0+y1)/2),g5((x1-x0)*0.3),'#F2E8D5'); for(let x=x0;x<x1;x+=25) rect(c,g5(x),g5(y0),10,g5(y1-y0),C.w0); rect(c,g5(x0),g5((y0+y1)/2),g5(x1-x0),10,C.w0); F.light(c,(x0+x1)/2,(y0+y1)/2,260,'#C8D4F0',0.4); }
  // floor boards converging, side walls (knee walls) and the roof underside between trusses
  Q(c,K,[[-HW-cam,0,0.6],[HW-cam,0,0.6],[HW-cam,0,ZB],[-HW-cam,0,ZB]],C.w2); for(let X=-HW;X<HW;X+=0.35) Q(c,K,[[X-cam,0,0.6],[X-cam+0.03,0,0.6],[X-cam+0.03,0,ZB],[X-cam,0,ZB]],C.w1);
  Q(c,K,[[-HW-cam,0,0.6],[-HW-cam,0,ZB],[-HW-cam,YW,ZB],[-HW-cam,YW,0.6]],C.w1); Q(c,K,[[HW-cam,0,0.6],[HW-cam,0,ZB],[HW-cam,YW,ZB],[HW-cam,YW,0.6]],C.w1);
  Q(c,K,[[-HW-cam,YW,0.6],[-HW-cam,YW,ZB],[-cam,YR,ZB],[-cam,YR,0.6]],C.w0); Q(c,K,[[HW-cam,YW,0.6],[HW-cam,YW,ZB],[-cam,YR,ZB],[-cam,YR,0.6]],'#1E1512');
  for(let k=1;k<6;k++){ const u=k/6; Q(c,K,[[lerp(-HW,0,u)-cam,lerp(YW,YR,u),0.6],[lerp(-HW,0,u)-cam,lerp(YW,YR,u),ZB],[lerp(-HW,0,u)-cam,lerp(YW,YR,u)-0.06,ZB],[lerp(-HW,0,u)-cam,lerp(YW,YR,u)-0.06,0.6]],'#2A1E1A'); Q(c,K,[[lerp(HW,0,u)-cam,lerp(YW,YR,u),0.6],[lerp(HW,0,u)-cam,lerp(YW,YR,u),ZB],[lerp(HW,0,u)-cam,lerp(YW,YR,u)-0.06,ZB],[lerp(HW,0,u)-cam,lerp(YW,YR,u)-0.06,0.6]],'#2A1E1A'); }
  // moon shaft from the vent onto the floor
  { const pts=[[-0.6,2.9,ZB],[0.7,2.9,ZB],[1.6,0,5.5],[0.2,0,5.0]]; c.save(); c.globalAlpha=1; E6.Q(c,K,pts.map(p=>[p[0]-cam,p[1],p[2]]),'#33201A'); c.restore(); E.dither(c,...(()=>{ const [x0,y0]=pj(K,0.2-cam,0,5.5), [x1,y1]=pj(K,1.6-cam,0,5.0); return [g5(x0),g5(y0-10),g5(x1-x0),40]; })(),'#8C9CC8',0.5); }
  // props: crates, chests, straw bales, a lantern hook — rooted at their depth
  for(const [X,Z,w,h,d,col] of [[-3.6,3.2,1.0,0.9,0.9,'#5E3A26'],[-3.4,5.0,0.8,1.3,0.8,'#4A2A1C'],[3.0,3.6,1.1,0.7,0.8,'#5E3A26'],[3.3,6.5,0.8,0.8,0.8,'#33201A'],[-3.5,8.5,0.9,1.1,0.9,'#4A2A1C'],[2.9,9.5,1.0,0.6,0.7,'#5E3A26']]){ E6.box(c,K,X-cam,X+w-cam,0,h,Z,Z+d,col,C.w0,C.w3); }
  // trusses (far -> near): tie beam at YW+1.2, two rafters, king post
  const truss=(Z,dark)=>{ const s=K.f/Z, col=dark?'#0E0A08':C.w0, top=dark?'#140E0C':C.w3; const th=0.18;
    Q(c,K,[[-HW-cam,YW,Z],[-cam,YR,Z],[-cam,YR-th*1.6,Z],[-HW-cam+0.3,YW-0.05,Z]],col); Q(c,K,[[HW-cam,YW,Z],[-cam,YR,Z],[-cam,YR-th*1.6,Z],[HW-cam-0.3,YW-0.05,Z]],col);
    Q(c,K,[[-HW-cam,2.6,Z],[HW-cam,2.6,Z],[HW-cam,2.6-th,Z],[-HW-cam,2.6-th,Z]],col); Q(c,K,[[-HW-cam,2.6,Z],[HW-cam,2.6,Z],[HW-cam,2.6,Z+0.18],[-HW-cam,2.6,Z+0.18]],top);
    Q(c,K,[[-0.08-cam,YR,Z],[0.08-cam,YR,Z],[0.08-cam,2.45,Z],[-0.08-cam,2.45,Z]],col);
    for(const X of [-HW+0.15,HW-0.15]) Q(c,K,[[X-0.12-cam,0,Z],[X+0.12-cam,0,Z],[X+0.12-cam,2.6,Z],[X-0.12-cam,2.6,Z]],col); };
  for(const Z of zs.slice().reverse()) if(Z>2.5) truss(Z,false);
  if(o.candle!==false){ const [x,y]=pj(K,1.4-cam,0,3.4); rect(c,g5(x),g5(y-60),15,60,'#E2D3B8'); poly(c,[[g5(x),g5(y-60)],[g5(x+15),g5(y-60)],[g5(x+8),g5(y-90-Math.sin(t*20)*5)]],'#FFC870'); F.light(c,x,y-70,420,'#FFC870',0.55*fl(t)); }
  E6.atticNear=()=>{ for(const Z of zs) if(Z<=2.5) truss(Z,true); };
  F.amb([0.62,0.62,0.86]);
};
// =================================================================================================
// TATAMI ROOM (S36): mats laid on the real floor grid (0.9 x 1.8 m, no four-corner joints), tokonoma, shoji, andon
// =================================================================================================
E6.tatami=(c,t,K,o={})=>{ const HW=2.7, Z0=0.5, ZB=8.6, YC=2.4; const burn=o.burn!=null?Math.max(0,t-o.burn):0;
  rect(c,0,0,W,H,'#140E0C');
  // ceiling boards
  Q(c,K,[[-HW,YC,Z0],[HW,YC,Z0],[HW,YC,ZB],[-HW,YC,ZB]],C.w1); for(let X=-HW;X<HW;X+=0.45) Q(c,K,[[X,YC,Z0],[X+0.02,YC,Z0],[X+0.02,YC,ZB],[X,YC,ZB]],C.w0);
  // floor: tatami columns along Z (0.9 wide), rows of 1.8, alternate columns offset by 0.9
  Q(c,K,[[-HW,0,Z0],[HW,0,Z0],[HW,0,ZB],[-HW,0,ZB]],'#C8D4A0');
  for(let i=0;i<6;i++){ const X0=-HW+i*0.9, X1=X0+0.9; for(let Z=(i%2?-0.4:0.5);Z<ZB;Z+=1.8){ const za=Math.max(Z0,Z), zb=Math.min(ZB,Z+1.8); if(zb<=za) continue;
      Q(c,K,[[X0+0.03,0,za+0.02],[X1-0.03,0,za+0.02],[X1-0.03,0,zb-0.02],[X0+0.03,0,zb-0.02]],(i+Math.floor((Z+1)/1.8))%2?'#C8D4A0':'#A8B488');
      Q(c,K,[[X0,0,za],[X0+0.05,0,za],[X0+0.05,0,zb],[X0,0,zb]],'#2B3A67'); Q(c,K,[[X1-0.05,0,za],[X1,0,za],[X1,0,zb],[X1-0.05,0,zb]],'#2B3A67'); Q(c,K,[[X0,0,za],[X1,0,za],[X1,0,za+0.03],[X0,0,za+0.03]],'#5A5F73'); } }
  // far wall: tokonoma (left, raised), chigaidana shelves (right)
  Q(c,K,[[-HW,0,ZB],[HW,0,ZB],[HW,YC,ZB],[-HW,YC,ZB]],'#E2D3B8');
  Q(c,K,[[-HW,0,ZB],[0.6,0,ZB],[0.6,0.18,ZB],[-HW,0.18,ZB]],C.w3); Q(c,K,[[-HW,0.18,ZB-0.5],[0.6,0.18,ZB-0.5],[0.6,0.18,ZB],[-HW,0.18,ZB]],C.w4);
  Q(c,K,[[-HW,0.18,ZB-0.5],[0.6,0.18,ZB-0.5],[0.6,0,ZB-0.5],[-HW,0,ZB-0.5]],C.w2);
  Q(c,K,[[0.55,0,ZB],[0.7,0,ZB],[0.7,YC,ZB],[0.55,YC,ZB]],C.w1); Q(c,K,[[-HW,1.95,ZB],[0.6,1.95,ZB],[0.6,2.1,ZB],[-HW,2.1,ZB]],C.w1);
  for(const [Y,X0,X1] of [[0.6,0.9,2.6],[1.1,0.9,1.8],[1.25,1.8,2.6]]) Q(c,K,[[X0,Y,ZB-0.01],[X1,Y,ZB-0.01],[X1,Y+0.05,ZB-0.01],[X0,Y+0.05,ZB-0.01]],C.w1);
  // the scroll (a framed handscroll in the alcove): o.scroll draws into [x,y,w,h]
  { const [x0,y0]=pj(K,-2.25,1.75,ZB-0.02), [x1,y1]=pj(K,0.2,0.65,ZB-0.02); rect(c,g5(x0-10),g5(y0-10),g5(x1-x0+20),g5(y1-y0+20),C.w0); if(o.scroll) o.scroll(c,t,[g5(x0),g5(y0),g5(x1-x0),g5(y1-y0)]); else rect(c,g5(x0),g5(y0),g5(x1-x0),g5(y1-y0),'#E2D3B8'); }
  // side walls: shoji (paper glowing faintly blue) with lattice, a lintel (kamoi) and ranma above
  for(const sd of [-1,1]){ const X=HW*sd; Q(c,K,[[X,0,Z0],[X,0,ZB],[X,YC,ZB],[X,YC,Z0]],'#C8D4F0'); for(let Z=Z0;Z<ZB;Z+=0.3) Q(c,K,[[X,0,Z],[X,0,Z+0.03],[X,1.8,Z+0.03],[X,1.8,Z]],C.w1); for(let Y=0.3;Y<1.8;Y+=0.3) Q(c,K,[[X,Y,Z0],[X,Y,ZB],[X,Y+0.03,ZB],[X,Y+0.03,Z0]],C.w1);
    Q(c,K,[[X,1.8,Z0],[X,1.8,ZB],[X,1.95,ZB],[X,1.95,Z0]],C.w1); Q(c,K,[[X,1.95,Z0],[X,1.95,ZB],[X,YC,ZB],[X,YC,Z0]],C.w2); Q(c,K,[[X,0,Z0],[X,0,ZB],[X,0.08,ZB],[X,0.08,Z0]],C.w0);
    for(let Z=Z0+1.8;Z<ZB;Z+=1.8) Q(c,K,[[X,0,Z],[X,0,Z+0.08],[X,YC,Z+0.08],[X,YC,Z]],C.w1); }
  // andon lamp (right, Z 5.5) + a low table
  { const [x,y]=pj(K,1.9,0,5.5); const s=K.f/5.5; rect(c,g5(x-s*0.16),g5(y-s*0.75),g5(s*0.32),g5(s*0.6),'#F2E8D5'); rect(c,g5(x-s*0.16),g5(y-s*0.75),g5(s*0.32),5,C.w0); rect(c,g5(x-s*0.18),g5(y-s*0.15),g5(s*0.36),g5(s*0.15),C.w0); F.light(c,x,y-s*0.45,s*2.4,'#FFC870',0.5*fl(t)); }
  E6.box(c,K,-1.0,0.2,0,0.33,4.4,5.0,C.w2,C.w1,C.w4);
  // fire: the scroll burns, then the flames climb the left shoji toward the camera
  if(burn>0){ const r=mulberry(Math.floor(t*12)); const reach=Math.min(ZB, ZB-burn*4.5);
    for(let Z=ZB-0.1;Z>Math.max(Z0,reach);Z-=0.25){ const ht=0.6+r()*1.4*Math.min(1,(ZB-Z)/2+0.3); const [x,y]=pj(K,-HW+0.02,0,Z), [x2,y2]=pj(K,-HW+0.02,ht,Z); const s=K.f/Z; poly(c,[[g5(x-s*0.15),g5(y)],[g5(x+s*0.15),g5(y)],[g5(x2+(r()-0.5)*s*0.2),g5(y2)]],r()<0.5?'#F07850':'#D8402F'); poly(c,[[g5(x-s*0.07),g5(y)],[g5(x+s*0.07),g5(y)],[g5(x+(r()-0.5)*s*0.1),g5(y-(y-y2)*0.6)]],'#FFC870'); }
    const [fx,fy]=pj(K,-1.0,1.2,ZB-0.05); for(let k=0;k<10;k++){ const x=fx+(r()-0.5)*300, h=60+r()*200; poly(c,[[g5(x-25),g5(fy+120)],[g5(x+25),g5(fy+120)],[g5(x+(r()-0.5)*30),g5(fy+120-h)]],k%2?'#F07850':'#FFC870'); }
    F.light(c,fx,fy,700,'#F07850',0.7*fl(t),{add:true}); for(let k=0;k<30;k++){ const ph=r(); const ex=r()*W, ey=H-((t*200+ph*H)%H); rect(c,g5(ex),g5(ey),5,5,k%2?'#FFC870':'#F07850'); }
    E.dither(c,0,0,W,g5(pj(K,0,YC,4)[1])+100,'#2A1E1A',f=>Math.min(0.6,burn*0.4)); }
  F.amb(burn>0?[1.0,0.72,0.55]:[0.78,0.74,0.86]);
};
// =================================================================================================
// CASTLE GATE (S26): stone path to the yaguramon; ishigaki walls topped with white dobei both sides; the keep beyond
// =================================================================================================
E6.KGATE=E6.camFor('L',1000,{vx:1060,camH:1.6});
E6.castleGate=(c,t,K,o={})=>{ const ZG=13;
  E6.sky(c,t,{h:K.h,seed:63}); E.moon(c,1520,170,90,{}); F.light(c,1520,170,320,'#C8D4F0',0.2);
  // the keep beyond the gate (tiers stacked), lit windows
  { const kx=g5(pj(K,0.8,0,60)[0]); const base=g5(pj(K,0,6,60)[1]); for(let k=0;k<4;k++){ const w=g5(380-k*80), y=g5(base-k*95); rect(c,kx-w/2+20,y-60,w-40,60,'#C8D4A0'); for(let q=0;q<4-k;q++) rect(c,kx-w/2+50+q*((w-100)/Math.max(1,3-k)),y-45,20,25,'#F2D27A'); poly(c,[[kx-w/2-20,y-55],[kx+w/2+20,y-55],[kx+w/2-30,y-100],[kx-w/2+30,y-100]],'#2E3756'); rect(c,kx-w/2-20,y-60,w+40,10,'#E2E8F0'); }
    poly(c,[[kx-300,base+30],[kx+300,base+30],[kx+220,base-20],[kx-220,base-20]],'#43475A'); F.light(c,kx,base-200,420,'#F2D27A',0.12); }
  rect(c,0,g5(K.h),W,H,'#A8B4D0');
  // path of square stones converging to the gate
  Q(c,K,[[-1.4,0,1.0],[1.4,0,1.0],[1.4,0,ZG],[-1.4,0,ZG]],'#7E7C76'); for(let Z=1.0;Z<ZG;Z+=0.7) Q(c,K,[[-1.4,0,Z],[1.4,0,Z],[1.4,0,Z+0.04],[-1.4,0,Z+0.04]],'#5A5F73'); Q(c,K,[[-0.02,0,1],[0.02,0,1],[0.02,0,ZG],[-0.02,0,ZG]],'#5A5F73');
  Q(c,K,[[-1.4,0,1.0],[-0.9,0,1.0],[-1.0,0,ZG],[-1.4,0,ZG]],'#C8D4F0'); Q(c,K,[[1.4,0,1.0],[0.9,0,1.0],[1.0,0,ZG],[1.4,0,ZG]],'#C8D4F0');
  // the gate: two-storey yaguramon across the path at ZG
  { const X0=-3.2, X1=3.2; Q(c,K,[[X0,0,ZG],[X1,0,ZG],[X1,3.0,ZG],[X0,3.0,ZG]],'#33201A'); Q(c,K,[[-1.3,0,ZG-0.01],[1.3,0,ZG-0.01],[1.3,2.6,ZG-0.01],[-1.3,2.6,ZG-0.01]],'#1C1210');
    for(let X=-1.3;X<1.3;X+=0.65){ Q(c,K,[[X,0,ZG-0.02],[X+0.05,0,ZG-0.02],[X+0.05,2.6,ZG-0.02],[X,2.6,ZG-0.02]],'#5E3A26'); } for(const Y of [0.8,1.8]) Q(c,K,[[-1.3,Y,ZG-0.02],[1.3,Y,ZG-0.02],[1.3,Y+0.08,ZG-0.02],[-1.3,Y+0.08,ZG-0.02]],'#4A5378');
    Q(c,K,[[X0-0.6,3.0,ZG-0.8],[X1+0.6,3.0,ZG-0.8],[X1,3.6,ZG],[X0,3.6,ZG]],'#2E3756'); Q(c,K,[[X0-0.6,3.0,ZG-0.8],[X1+0.6,3.0,ZG-0.8],[X1+0.5,3.12,ZG-0.6],[X0-0.5,3.12,ZG-0.6]],'#E2E8F0');
    Q(c,K,[[X0+0.3,3.6,ZG],[X1-0.3,3.6,ZG],[X1-0.3,5.2,ZG],[X0+0.3,5.2,ZG]],'#E2D3B8'); for(let X=X0+0.8;X<X1-0.6;X+=1.1) Q(c,K,[[X,4.1,ZG-0.01],[X+0.5,4.1,ZG-0.01],[X+0.5,4.7,ZG-0.01],[X,4.7,ZG-0.01]],'#F2D27A');
    Q(c,K,[[X0-0.5,5.2,ZG-0.8],[X1+0.5,5.2,ZG-0.8],[X1-1.0,6.6,ZG],[X0+1.0,6.6,ZG]],'#2E3756'); Q(c,K,[[X0-0.5,5.2,ZG-0.8],[X1+0.5,5.2,ZG-0.8],[X1-0.6,5.9,ZG-0.4],[X0+0.6,5.9,ZG-0.4]],'#E2E8F0');
    const [gx,gy]=pj(K,0,4.4,ZG); F.light(c,gx,gy,300,'#F2D27A',0.3); for(const X of [-1.8,1.8]){ const [lx,ly]=pj(K,X,1.8,ZG-0.3); circ(c,g5(lx),g5(ly),20,'#F2E8D5'); F.light(c,lx,ly,200,'#FFC870',0.6*fl(t+X)); } }
  // ishigaki walls (battered stone) topped with white plaster dobei + tile cap, both sides, running into depth
  for(const sd of [-1,1]){ const Xb=3.0*sd, Xt=2.6*sd, Ys=2.6; Q(c,K,[[Xb,0,0.8],[Xb,0,ZG],[Xt,Ys,ZG],[Xt,Ys,0.8]],'#5A5F73');
    const r=mulberry(sd>0?3:4); for(let Z=0.8;Z<ZG;Z+=0.5) for(let Y=0.2;Y<Ys;Y+=0.45){ const u=Y/Ys, X=lerp(Xb,Xt,u); Q(c,K,[[X,Y,Z+0.02],[X,Y,Z+0.46*(0.6+r()*0.4)],[X,Y+0.04,Z+0.46*(0.6+r()*0.4)],[X,Y+0.04,Z+0.02]],'#43475A'); }
    Q(c,K,[[Xt,Ys,0.8],[Xt,Ys,ZG],[Xt,Ys+1.3,ZG],[Xt,Ys+1.3,0.8]],'#E2D3B8'); for(let Z=1.5;Z<ZG;Z+=2.2) Q(c,K,[[Xt,Ys+0.6,Z],[Xt,Ys+0.6,Z+0.3],[Xt,Ys+0.9,Z+0.3],[Xt,Ys+0.9,Z]],'#2A1E1A');
    Q(c,K,[[Xt+0.3*sd,Ys+1.3,0.8],[Xt+0.3*sd,Ys+1.3,ZG],[Xt-0.25*sd,Ys+1.6,ZG],[Xt-0.25*sd,Ys+1.6,0.8]],'#2E3756'); Q(c,K,[[Xt,Ys+1.55,0.8],[Xt,Ys+1.55,ZG],[Xt-0.2*sd,Ys+1.7,ZG],[Xt-0.2*sd,Ys+1.7,0.8]],'#E2E8F0');
    Q(c,K,[[Xb,0,0.8],[Xb,0,ZG],[Xb-0.35*sd,0,ZG],[Xb-0.35*sd,0,0.8]],'#E2E8F0'); }
  // stone lanterns at the gate
  for(const X of [-2.0,2.0]){ const Z=9; E6.box(c,K,X-0.1,X+0.1,0,0.8,Z,Z+0.2,'#7E7C76','#5A5F73','#E2E8F0'); E6.box(c,K,X-0.25,X+0.25,0.8,1.1,Z-0.05,Z+0.3,'#7E7C76','#5A5F73','#E2E8F0'); const [lx,ly]=pj(K,X,0.95,Z-0.06); rect(c,g5(lx-10),g5(ly-10),20,20,'#FFC870'); F.light(c,lx,ly,150,'#FFC870',0.5*fl(t+X)); }
  F.amb([0.74,0.78,1.0]);
};

// BALCONY (S39b): camera on the keep's top veranda looking out; planks recede to the red railing; storm beyond; eave above
E6.KBAL=E6.camFor('L',930,{vx:960,camH:1.5});
E6.balcony=(c,t,K,o={})=>{ const ZR=4.2; const flash=o.flash||0;
  rect(c,0,0,W,H,flash?'#4A5378':'#0E1020'); rect(c,0,g5(K.h*0.6),W,H,flash?'#5A6A9A':'#141A30');
  { const r=mulberry(83); for(let k=0;k<12;k++){ const x=((r()*2400-t*60*(1+k%3))%2400+2400)%2400-240, y=r()*K.h, w=300+r()*500; ell(c,g5(x),g5(y),g5(w/2),g5(30+r()*40),0,flash?'#8C9CC8':(k%2?'#1C2238':'#253052')); } }
  rect(c,0,g5(K.h),W,H,'#0E1020'); { const r=mulberry(29); for(let k=0;k<140;k++){ const Z=40+r()*r()*400, X=(r()-0.5)*Z*3; const [x,y]=pj(K,X,-35,Z); if(y<K.h||y>H) continue; rect(c,g5(x),g5(y),5,5,r()<0.6?'#F2D27A':'#F09A48'); } }
  if(o.behind) o.behind(c,K);
  // planks receding (Y 0) to the railing
  Q(c,K,[[-30,0,0.8],[30,0,0.8],[30,0,ZR],[-30,0,ZR]],C.w1); for(let X=-12;X<12;X+=0.3) Q(c,K,[[X,0,0.8],[X+0.03,0,0.8],[X+0.03,0,ZR],[X,0,ZR]],C.w0);
  { const r=mulberry(Math.floor(t*12)); for(let k=0;k<14;k++){ const X=(r()-0.5)*8, Z=1.5+r()*2.6; const [x,y]=pj(K,X,0,Z); rect(c,g5(x),g5(y),g5(800/Z*0.12),5,'#8C9CC8'); } }
  // railing: posts every 1.2 m, top rail with giboshi caps, lower rail
  for(const Y of [0.85,0.35]) Q(c,K,[[-30,Y,ZR],[30,Y,ZR],[30,Y+0.08,ZR],[-30,Y+0.08,ZR]],'#B8302A');
  for(let X=-12;X<12;X+=1.2){ Q(c,K,[[X-0.06,0,ZR],[X+0.06,0,ZR],[X+0.06,0.93,ZR],[X-0.06,0.93,ZR]],'#7A1E1A'); const [gx,gy]=pj(K,X,1.0,ZR); circ(c,g5(gx),g5(gy),10,'#D9A441'); }
  Q(c,K,[[-30,0,ZR],[30,0,ZR],[30,0.08,ZR+0.1],[-30,0.08,ZR+0.1]],'#33201A');
  // the eave above: rafters converging to the edge at ZR+0.6
  Q(c,K,[[-30,2.7,0.6],[30,2.7,0.6],[30,2.5,ZR+0.6],[-30,2.5,ZR+0.6]],C.w0); for(let X=-12;X<12;X+=0.4) Q(c,K,[[X,2.69,0.6],[X+0.1,2.69,0.6],[X+0.1,2.49,ZR+0.6],[X,2.49,ZR+0.6]],'#140E0C');
  Q(c,K,[[-30,2.5,ZR+0.6],[30,2.5,ZR+0.6],[30,2.35,ZR+0.62],[-30,2.35,ZR+0.62]],'#2A1E1A');
  { const r=mulberry(Math.floor(t*30)); for(let k=0;k<20;k++){ const X=(r()-0.5)*14; const [x,y]=pj(K,X,2.35,ZR+0.62); rect(c,g5(x),g5(y),5,g5(20+r()*40),'#8C9CC8'); } }
  for(let k=0,r=mulberry(Math.floor(t*30));k<90;k++){ const x=g5(r()*W), y=g5(r()*H); poly(c,[[x,y],[x+5,y],[x-20,y+60],[x-25,y+60]],k%3?'#4A5378':'#8C9CC8'); }
  F.amb([0.62,0.66,0.98]);
};
// =================================================================================================
// HOME (tatami room, S11–S14 / S30–S33 / S33b): one-point room, mats 1.8 x 0.9 m laid in staggered rows on the real
// floor plane, tokonoma alcove, city window, shoji/fusuma side walls, andon; Jay kneels on a zabuton at the L depth
// =================================================================================================
E6.HOME={HW:3.6, ZB:5.2, YC:2.45, JX:-0.35, VX:0.9};
E6.camHome=(pan,size,footY)=>E6.camFor(size||'L',footY||940,{vx:960-(pan||0),camH:1.2});
E6.home=(c,t,K,o={})=>{ const {HW,ZB,YC}=E6.HOME; const Zt=E6.zOf(K,'L'), sn=!!o.snow; const fl2=0.92+0.08*Math.sin(t*19)*Math.sin(t*5.3);
  rect(c,0,0,W,H,C.w0);
  // ceiling: boards + battens converging
  Q(c,K,[[-HW,YC,0.4],[HW,YC,0.4],[HW,YC,ZB],[-HW,YC,ZB]],C.w4); for(let X=-HW;X<HW;X+=0.45) Q(c,K,[[X,YC,0.4],[X+0.03,YC,0.4],[X+0.03,YC,ZB],[X,YC,ZB]],C.w3); for(let Z=1.2;Z<ZB;Z+=1.2) Q(c,K,[[-HW,YC-0.01,Z],[HW,YC-0.01,Z],[HW,YC-0.01,Z+0.08],[-HW,YC-0.01,Z+0.08]],C.w1);
  // back wall (plaster) + kamoi lintel + pillars
  Q(c,K,[[-HW,0,ZB],[HW,0,ZB],[HW,YC,ZB],[-HW,YC,ZB]],'#E2D3B8'); Q(c,K,[[-HW,1.85,ZB-0.01],[HW,1.85,ZB-0.01],[HW,1.97,ZB-0.01],[-HW,1.97,ZB-0.01]],C.w2);
  // tokonoma alcove (X -3.5..-1.5, recessed 0.6, raised 0.15): kakejiku (ink mountain), incense, bonsai
  { const X0=-3.5, X1=-1.5, ZA=ZB+0.6; Q(c,K,[[X0,0,ZA],[X1,0,ZA],[X1,YC,ZA],[X0,YC,ZA]],'#C9B48E'); Q(c,K,[[X1,0,ZB],[X1,0,ZA],[X1,YC,ZA],[X1,YC,ZB]],'#B5A07A');
    Q(c,K,[[X0,0.15,ZB],[X1,0.15,ZB],[X1,0.15,ZA],[X0,0.15,ZA]],C.w4); Q(c,K,[[X0,0,ZB],[X1,0,ZB],[X1,0.15,ZB],[X0,0.15,ZB]],C.w3); Q(c,K,[[X0,1.97,ZB],[X1,1.97,ZB],[X1,2.12,ZB],[X0,2.12,ZB]],C.w1);
    const [kx0,ky0]=pj(K,-2.85,1.85,ZA-0.01), [kx1,ky1]=pj(K,-2.15,0.45,ZA-0.01); const kw=kx1-kx0, kh=ky1-ky0; rect(c,g5(kx0),g5(ky0),g5(kw),g5(kh),'#F2E8D5'); rect(c,g5(kx0),g5(ky0),g5(kw),Math.max(5,g5(kh*0.05)),C.ai); rect(c,g5(kx0),g5(ky1-kh*0.05),g5(kw),Math.max(5,g5(kh*0.05)),C.ai);
    poly(c,[[kx0+kw*0.06,ky0+kh*0.8],[kx0+kw*0.3,ky0+kh*0.5],[kx0+kw*0.45,ky0+kh*0.6],[kx0+kw*0.7,ky0+kh*0.36],[kx0+kw*0.94,ky0+kh*0.7],[kx0+kw*0.94,ky0+kh*0.8]].map(([a,b])=>[g5(a),g5(b)]),'#B9B6AC'); poly(c,[[kx0+kw*0.2,ky0+kh*0.8],[kx0+kw*0.45,ky0+kh*0.66],[kx0+kw*0.6,ky0+kh*0.72],[kx0+kw*0.8,ky0+kh*0.58],[kx0+kw*0.94,ky0+kh*0.8]].map(([a,b])=>[g5(a),g5(b)]),'#7E7C76');
    circ(c,g5(kx0+kw*0.7),g5(ky0+kh*0.18),g5(kw*0.12),'#E2D3B8'); rect(c,g5(kx0+kw*0.78),g5(ky0+kh*0.86),10,10,'#A82A26');
    const [ix,iy]=pj(K,-1.85,0.15,ZB+0.3); rect(c,g5(ix-20),g5(iy-15),40,15,'#43475A'); E5.smoke(c,t,g5(ix),g5(iy-15),5,'#B9B6AC');
    const [bx,by]=pj(K,-3.2,0.15,ZB+0.3); const s=K.f/(ZB+0.3); rect(c,g5(bx-s*0.15),g5(by-s*0.1),g5(s*0.3),g5(s*0.1),'#5E3826'); capsule(c,bx,by-s*0.1,4,bx-s*0.04,by-s*0.4,3,C.w1); blob(c,[[bx-s*0.25,by-s*0.38],[bx,by-s*0.5],[bx+s*0.22,by-s*0.38],[bx,by-s*0.32]],C.fol2); blob(c,[[bx-s*0.12,by-s*0.42],[bx+s*0.05,by-s*0.54],[bx+s*0.18,by-s*0.42]],'#46613F'); }
  // the window (X -0.4..3.2, Y 0.55..1.85): modern city at night, rain or snow, half-open shoji on the right
  { const [x0,y0]=pj(K,-0.4,1.85,ZB-0.01), [x1,y1]=pj(K,3.2,0.55,ZB-0.01); const sw=x1-x0, shh=y1-y0; rect(c,g5(x0),g5(y0),g5(sw),g5(shh),'#141A30');
    c.save(); c.beginPath(); c.rect(x0,y0,sw,shh); c.clip(); E.stars(c,t,77,30,y1,['#8C9CC8']); if(sn) E.moon(c,g5(x0+sw*0.62),g5(y0+shh*0.22),Math.max(20,g5(sw*0.06)),{});
      const rr=mulberry(14); const bw=sw/16; for(let k=0;k<16;k++){ const bx=x0+k*bw, bh=shh*(0.15+rr()*0.45); rect(c,g5(bx),g5(y1-bh),g5(bw-5),g5(bh),k%2?'#1C2238':'#253052'); for(let wy=y1-bh+10;wy<y1;wy+=20) for(let wx=bx+5;wx<bx+bw-10;wx+=12) if(rr()<0.35) rect(c,g5(wx),g5(wy),5,10,rr()<0.7?'#B8562E':'#FFC870'); }
      rect(c,g5(x0+sw*0.68),g5(y0+shh*0.32),5,g5(shh*0.3),'#2E3756'); rect(c,g5(x0+sw*0.55),g5(y0+shh*0.32),g5(sw*0.26),5,'#2E3756'); if(Math.floor(t*1.5)%2) rect(c,g5(x0+sw*0.8),g5(y0+shh*0.31),10,10,'#D8402F');
      if(o.bamboo){ for(const [u,w] of [[0.08,0.035],[0.2,0.03],[0.33,0.04]]){ const bx=x0+sw*u; rect(c,g5(bx),g5(y0),g5(sw*w),g5(shh),'#22382A'); for(let y=y0+30;y<y1;y+=shh*0.22) rect(c,g5(bx-5),g5(y),g5(sw*w)+10,5,'#16261E'); } }
      if(sn){ rect(c,g5(x0),g5(y1-shh*0.08),g5(sw),g5(shh*0.08),'#DDE6F2'); const r3=mulberry(81); for(let k=0;k<50;k++){ const ph=r3(); const xx=x0+r3()*sw+Math.sin(t+k)*10, yy=y0+((ph*shh+t*(40+r3()*30))%shh); rect(c,g5(xx),g5(yy),5,5,'#F2E8D5'); } }
      else { const r2=mulberry(3); for(let k=0;k<40;k++){ const dx=g5(x0+r2()*sw), ph=r2(); const yy=y0+((ph*shh+t*(260+r2()*120))%shh); rect(c,dx,g5(yy),5,15,'#5A6A9A'); } }
    c.restore();
    for(let k=0;k<=4;k++) rect(c,g5(x0+sw*k/4)-5,g5(y0),10,g5(shh),C.w2); rect(c,g5(x0),g5(y0+shh/2)-5,g5(sw),10,C.w2); rect(c,g5(x0)-10,g5(y0)-10,g5(sw)+20,15,C.w1); rect(c,g5(x0)-10,g5(y1),g5(sw)+20,15,C.w1);
    const sx0=x0+sw*0.68; rect(c,g5(sx0),g5(y0),g5(x1-sx0),g5(shh),'#E8DCC4'); for(let x=sx0;x<=x1;x+=(x1-sx0)/4) rect(c,g5(x),g5(y0),5,g5(shh),C.w3); for(let y=y0;y<=y1;y+=shh/6) rect(c,g5(sx0),g5(y),g5(x1-sx0),5,C.w3);
    F.shaft(c,[[x0,y1],[sx0,y1],...(()=>{ const [a]=pj(K,2.2,0,2.4), [b]=pj(K,-0.9,0,2.4); const [,yy]=pj(K,0,0,2.4); return [[a,yy],[b,yy]]; })()],'#8C9CC8',0.1,0.35); }
  for(const X of [-HW,-1.5,-0.55,3.35,HW]) Q(c,K,[[X-0.06,0,ZB-0.02],[X+0.06,0,ZB-0.02],[X+0.06,YC,ZB-0.02],[X-0.06,YC,ZB-0.02]],C.w2);
  // side walls: shoji (left), fusuma with a pine painting (right); ranma above the lintel
  for(const sd of [-1,1]){ const X=HW*sd; Q(c,K,[[X,0,0.4],[X,0,ZB],[X,YC,ZB],[X,YC,0.4]],sd<0?'#E8DCC4':'#D4C4A4');
    if(sd<0){ for(let Z=0.4;Z<ZB;Z+=0.25) Q(c,K,[[X,0,Z],[X,0,Z+0.025],[X,1.85,Z+0.025],[X,1.85,Z]],C.w3); for(let Y=0.3;Y<1.85;Y+=0.3) Q(c,K,[[X,Y,0.4],[X,Y,ZB],[X,Y+0.025,ZB],[X,Y+0.025,0.4]],C.w3); }
    else { for(let Z=0.4;Z<ZB;Z+=0.9) Q(c,K,[[X,0,Z],[X,0,Z+0.03],[X,1.85,Z+0.03],[X,1.85,Z]],C.w2); Q(c,K,[[X,0.6,1.8],[X,1.1,2.8],[X,1.0,3.6],[X,0.75,3.1]],'#7C9A6E'); Q(c,K,[[X,0.5,3.0],[X,0.9,3.9],[X,0.7,4.4]],'#46613F'); }
    Q(c,K,[[X,1.85,0.4],[X,1.85,ZB],[X,1.97,ZB],[X,1.97,0.4]],C.w2); Q(c,K,[[X,1.97,0.4],[X,1.97,ZB],[X,YC,ZB],[X,YC,0.4]],C.w1); for(let Z=0.6;Z<ZB;Z+=0.3) Q(c,K,[[X,2.0,Z],[X,2.0,Z+0.15],[X,2.35,Z+0.15],[X,2.35,Z]],C.w3);
    Q(c,K,[[X,0,0.4],[X,0,ZB],[X,0.06,ZB],[X,0.06,0.4]],C.w1); }
  // tatami: rows 0.9 deep, mats 1.8 wide, alternate rows offset by 0.9 (no four-corner joints); woven texture + black heri
  Q(c,K,[[-HW,0,0.4],[HW,0,0.4],[HW,0,ZB],[-HW,0,ZB]],'#A8C08A');
  for(let row=0;row<6;row++){ const Zb=ZB-row*0.9, Za=Zb-0.9; if(Zb<0.45) break; const za=Math.max(0.45,Za); const off=row%2?0.9:0;
    for(let X=-HW-off;X<HW;X+=1.8){ const xa=Math.max(-HW,X), xb=Math.min(HW,X+1.8); if(xb-xa<0.05) continue; const shade=(row+Math.round((X+off)/1.8))%2;
      Q(c,K,[[xa,0,za],[xb,0,za],[xb,0,Zb],[xa,0,Zb]],shade?'#A8C08A':'#B4C894');
      for(let zz=za+0.06;zz<Zb;zz+=0.06) Q(c,K,[[xa+0.02,0,zz],[xb-0.02,0,zz],[xb-0.02,0,zz+0.015],[xa+0.02,0,zz+0.015]],'#93AD78');
      Q(c,K,[[xa,0,za],[xb,0,za],[xb,0,za+0.045],[xa,0,za+0.045]],'#2F4A3A'); Q(c,K,[[xa,0,Zb-0.045],[xb,0,Zb-0.045],[xb,0,Zb],[xa,0,Zb]],'#2F4A3A');
      if(X+1.8<HW) Q(c,K,[[X+1.8-0.02,0,za],[X+1.8+0.02,0,za],[X+1.8+0.02,0,Zb],[X+1.8-0.02,0,Zb]],'#5A7A52'); } }
  // andon lamp (X -1.35, Z 3.9) and its warm pool
  { const Z=3.9, X=-1.45; const [x,y]=pj(K,X,0,Z); const s=K.f/Z; rect(c,g5(x-s*0.17),g5(y-s*0.72),g5(s*0.34),g5(s*0.62),C.w1); rect(c,g5(x-s*0.14),g5(y-s*0.69),g5(s*0.28),g5(s*0.52),'#FFE7A8'); rect(c,g5(x-s*0.14),g5(y-s*0.69),g5(s*0.28),5,'#FFC870'); rect(c,g5(x)-2,g5(y-s*0.69),5,g5(s*0.52),C.w3); rect(c,g5(x-s*0.2),g5(y-s*0.1),g5(s*0.4),g5(s*0.1),C.w0);
    F.light(c,x,y-s*0.4,s*3.6,'#FFC870',0.38*fl2,{ry:0.7}); F.light(c,x,y-s*0.4,s*0.8,'#FFE7A8',0.25*fl2); F.cast(c,x,y-s*0.4,{a:0.3}); }
  // zabuton at Jay's place
  { const X=E6.HOME.JX; Q(c,K,[[X-0.32,0,Zt-0.3],[X+0.32,0,Zt-0.3],[X+0.32,0,Zt+0.3],[X-0.32,0,Zt+0.3]],C.ai); Q(c,K,[[X-0.32,0,Zt-0.3],[X+0.32,0,Zt-0.3],[X+0.32,0.06,Zt-0.3],[X-0.32,0.06,Zt-0.3]],C.aiL); }
  // phone on the tatami (left of him): buzzes, screen lights; gone once picked
  const ph=o.phone; if(ph){ const ring=t>=ph.t0&&t<ph.t1; if(!(ph.picked&&t>=ph.picked)){ const jit=ring&&Math.floor(t*30)%2?0.02:0; const X=-1.15+jit, Z=Zt-0.2;
      Q(c,K,[[X,0,Z],[X+0.16,0,Z],[X+0.16,0,Z+0.08],[X,0,Z+0.08]],'#141A30'); Q(c,K,[[X+0.02,0.01,Z+0.005],[X+0.14,0.01,Z+0.005],[X+0.14,0.01,Z+0.07],[X+0.02,0.01,Z+0.07]],ring?'#C8D4F0':'#253052');
      if(ring){ const [px,py]=pj(K,X+0.08,0,Z); for(const s2 of [-1,1]){ rect(c,g5(px+s2*45),g5(py-20),5,15,'#F2E8D5'); rect(c,g5(px+s2*60),g5(py-25),5,25,'#F2E8D5'); } F.light(c,px,py,120,'#C8D4F0',0.25,{add:true});
        const bx=g5(px-110), by=g5(py-150); rrect(c,bx,by,220,70,10,'#F2E8D5'); poly(c,[[bx+80,by+70],[bx+110,by+70],[bx+95,by+92]],'#F2E8D5'); rect(c,bx+15,by+20,30,30,'#5FB0A8'); c.save(); c.fillStyle='#0E1020'; c.font='60px "FusionPixelJA"'; c.textBaseline='top'; c.fillText('お母さん',bx+55,by+5); c.restore(); } } }
  if(o.behind) o.behind(c,K);
  F.amb(o.amb||[0.9,0.82,0.74]);
};
// the low table with the suiban + ikebana (drawn after Jay when he is behind it? it stands at his depth to his right, so draw after)
E6.homeTable=(c,t,K,o={})=>{ const Zt=E6.zOf(K,'L'); const X0=0.35, X1=1.85, Z0=Zt-0.35, Z1=Zt+0.35, Y=0.33;
  for(const [X,Z] of [[X0+0.08,Z0+0.05],[X1-0.12,Z0+0.05]]) Q(c,K,[[X,0,Z],[X+0.05,0,Z],[X+0.05,Y,Z],[X,Y,Z]],C.w1);
  Q(c,K,[[X0,Y,Z0],[X1,Y,Z0],[X1,Y,Z1],[X0,Y,Z1]],C.w4); Q(c,K,[[X0,Y,Z0],[X1,Y,Z0],[X1,Y-0.04,Z0],[X0,Y-0.04,Z0]],C.w2); E6.shadow(c,...pj(K,(X0+X1)/2,0,Zt),g5((X1-X0)*270*0.36),'#7C9A6E');
  const VX=E6.HOME.VX; const [vx,vy]=pj(K,VX,Y,Zt); const k=(K.f/Zt)/300; c.save(); c.translate(g5(vx),g5(vy)); c.scale(k,k);
  ell(c,0,5,110,22,0,'#12303A'); ell(c,0,0,104,18,0,'#1F4E5A'); ell(c,0,-2,90,13,0,'#2F7A80'); rect(c,-70,-4,40,5,'#A8E0D0'); rect(c,20,-2,20,5,'#5FB0A8');
  if(o.rip!=null){ for(let q=0;q<3;q++){ const u=((t-o.rip)*0.9-q*0.25); if(u>0&&u<1) F.ring(c,10,-2,lerp(5,95,eo(u)),0.15,q?'#5FB0A8':'#A8E0D0',u); } }
  if(!o.bamboo){ const br=[[0,-10],[-40,-130],[-110,-220],[-150,-310]]; for(let q=0;q<3;q++) capsule(c,br[q][0],br[q][1],7-q*1.5,br[q+1][0],br[q+1][1],5-q*1.5,C.w1);
    capsule(c,-40,-130,4,60,-210,3,C.w1); capsule(c,0,-10,4,90,-100,3,C.fol1);
    for(const [lx,ly,s] of [[-70,-170,1],[40,-190,-1],[-130,-260,1],[70,-90,-1],[-20,-60,1]]){ blob(c,[[lx,ly],[lx+28*s,ly-14],[lx+44*s,ly+2],[lx+18*s,ly+10]],C.fol2); rect(c,lx+10*s,ly-2,20,5,'#7C9A6E'); }
    for(const [px,py] of [[90,-104],[-150,-312],[55,-212]]){ circ(c,px,py,20,'#D8402F'); circ(c,px-5,py-4,10,'#F07850'); circ(c,px+4,py+2,6,'#D9A441'); } }
  else if(!o.cut){ for(const [bx,h] of [[30,330],[55,250]]){ rect(c,bx-14,-h,28,h,'#46613F'); rect(c,bx,-h,8,h,'#7C9A6E'); for(let y=-h+60;y<0;y+=70) rect(c,bx-16,y,32,6,'#2F4A3A'); poly(c,[[bx-14,-h],[bx+14,-h-25],[bx+14,-h+3],[bx-14,-h+3]],'#A8C08A'); } }
  c.restore();
  const [mx,my]=pj(K,0.55,Y,Zt-0.15); rect(c,g5(mx-20),g5(my-45),40,45,'#F2E8D5'); rect(c,g5(mx-20),g5(my-45),40,8,'#93603C'); E4.steam(c,t,g5(mx),g5(my-50),2,{h:140,s:0.6});
  const [kx,ky]=pj(K,1.55,Y,Zt-0.1); rect(c,g5(kx-30),g5(ky-5),60,5,'#7E7C76'); rect(c,g5(kx+25),g5(ky-10),15,15,'#A82A26');
  return [g5(vx),g5(vy),k];
};
})(window);
