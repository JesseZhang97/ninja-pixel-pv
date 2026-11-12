// fx3.js — v3 effects layer (pixel-art style: every light/water effect is banded in palette steps, hard edges, no blur/bloom).
// Shot functions declare effects while drawing (world coords, converted through the current transform); film_main3.js applies
// them to the 384x216 frame BEFORE palette quantisation, so every result snaps back to NINJA-56.
(function(G){
const {mulberry,clamp,lerp,inv,eio,eo,poly,rect,circ,capsule}=G.K; const PX=G.PX, SPR=G.SPR, F=G.FILM, LW=PX.LW, LH=PX.LH;
const BAY=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]].map(r=>r.map(v=>(v+0.5)/16));
const hex=h=>[parseInt(h.slice(1,3),16)/255,parseInt(h.slice(3,5),16)/255,parseInt(h.slice(5,7),16)/255];
F.hex=hex;
F.fxReset=()=>{ F.FX={moon:null,amb:null,lights:[],shafts:[],refl:[],rim:null,cast:null,flash:0,tint:null,mirrors:[]}; };
F.fxReset();
const L2=(c,x,y)=>{ const m=c.getTransform(); return [m.a*x+m.c*y+m.e, m.b*x+m.d*y+m.f, m.a]; };
// ---- declarations (call inside shot fns) ----
F.amb=(rgb)=>{ F.FX.amb=rgb; };                       // e.g. [0.78,0.82,1.0] for moonlit night
F.light=(c,x,y,r,col,k,o={})=>{ const [lx,ly,s]=L2(c,x,y); F.FX.lights.push({x:lx,y:ly,r:r*s,ry:o.ry||1,col:typeof col==='string'?hex(col):col,k,steps:o.steps||3,add:!!o.add,mr:o.moonR?o.moonR*s:0}); };
F.shaft=(c,pts,col,k,dens)=>{ const m=c.getTransform(); F.FX.shafts.push({pts:pts.map(([x,y])=>[m.a*x+m.e,m.d*y+m.f]),col:typeof col==='string'?hex(col):col,k,dens:dens==null?0.5:dens}); };
F.reflect=(c,o)=>{ const m=c.getTransform(); const T=(x,y)=>[m.a*x+m.e,m.d*y+m.f];
  const [x0,y0]=T(o.x0??-9999,o.y0), [x1,y1]=T(o.x1??9999,o.y1??1080);
  F.FX.refl.push({x0:Math.max(0,Math.round(x0)),x1:Math.min(LW,Math.round(x1)),y0:Math.round(y0),y1:Math.min(LH,Math.round(y1)),k:o.k??0.5,dark:o.dark??0.6,amp:o.amp??1.5,t:o.t||0,
    tint:o.tint?hex(o.tint):[0.75,0.85,1.0],pud:(o.puddles||[]).map(p=>{ const [px,py]=T(p[0],p[1]); return [px,py,p[2]*m.a,p[3]*m.a]; }),only:o.only}); };
F.rim=(dir,col,top)=>{ F.FX.rim={dir,col:col||'#8C9CC8',top:top!==false}; };
F.cast=(c,x,y,o={})=>{ const [lx,ly]=L2(c,x,y); F.FX.cast={x:lx,y:ly,a:o.a??0.45,sq:o.sq??0.32,max:o.max??3}; };
F.flashL=(k)=>{ F.FX.flash=Math.max(F.FX.flash,k); };
F.tintL=(rgb)=>{ F.FX.tint=rgb; };
// timeline events: screen shake + whole-scene flash light (sword flash / lightning / impacts)
F.SHAKES=[]; F.FLASHES=[];
F.shakeAt=(t)=>{ let dx=0,dy=0; for(const s of F.SHAKES){ const u=t-s.t; if(u>=0&&u<s.d){ const a=Math.round(s.a*(1-u/s.d)); const k=Math.floor(u*30); dx+=[a,-a,a>>1,-(a>>1),0][k%5]; dy+=[-a>>1,a>>1,a,0,-a][(k+2)%5]; } } return [dx,dy]; };
F.flashAt=(t)=>{ let k=0; for(const s of F.FLASHES){ const u=t-s.t; if(u>=0&&u<s.d) k=Math.max(k,s.k*(u<1/30?1:0.5)); } return k; };

// ---- application (called by film_main3 on the low-res ctx before quantize) ----
const [mcv,mx]=PX.mk(LW,LH);
F.fxApply=(c,t)=>{ const X=F.FX; const fl=Math.max(X.flash,F.flashAt(t));
  if(!X.refl.length&&!X.amb&&!X.lights.length&&!X.shafts.length&&!fl&&!X.tint) return;
  const im=c.getImageData(0,0,LW,LH), d=im.data;
  // 1) reflections: mirrored about y0, palette-darkened + tinted, ripple-distorted per row
  for(const r of X.refl){ const src=new Uint8ClampedArray(d);
    for(let y=Math.max(0,r.y0);y<r.y1;y++){ const depth=y-r.y0; const sy=r.y0-depth-1; if(sy<0) continue;
      const sh=Math.round(Math.sin(y*1.9+r.t*7.0)*r.amp*Math.min(1,depth/6)+Math.sin(y*0.7-r.t*3.1)*r.amp*0.5);
      const fade=r.k*(1-0.5*depth/Math.max(1,r.y1-r.y0));
      for(let x=r.x0;x<r.x1;x++){
        if(r.pud.length){ let inP=false; for(const p of r.pud){ const ex=(x-p[0])/p[2], ey=(y-p[1])/p[3]; if(ex*ex+ey*ey<1){ inP=true; break; } } if(!inP) continue; }
        const sx=clamp(x+sh,0,LW-1); const si=(sy*LW+sx)*4, di=(y*LW+x)*4;
        if(BAY[y&3][x&3]>0.5+fade*0.5&&fade<0.6) continue;   // dithered fall-off
        for(let ch=0;ch<3;ch++){ const v=src[si+ch]*r.dark*r.tint[ch]; d[di+ch]=d[di+ch]*(1-fade)+v*fade+ (ch===2?4:0); } } } }
  // flash frames (whole frame paper): no scene lighting on them
  { let pc=0,tot=0; for(let y=4;y<LH;y+=12) for(let x=4;x<LW;x+=12){ const q=(y*LW+x)*4; tot++; if(d[q]>225&&d[q+1]>215&&d[q+2]>195) pc++; } if(pc>tot*0.8){ c.putImageData(im,0,0); return; } }
  // 2) light accumulation (ambient multiplier + banded pools + dithered shafts)
  const n=LW*LH; const am=X.amb||[1,1,1]; const LR=new Float32Array(n).fill(am[0]), LG=new Float32Array(n).fill(am[1]), LB=new Float32Array(n).fill(am[2]); const AR=new Float32Array(n), AG=new Float32Array(n), AB=new Float32Array(n);
  for(const l of X.lights){ if(l.mr){ // moon halo only when the sky around the moon is actually visible (not covered by paper / a flash)
      let inF=0,lit=0; for(let q8=0;q8<8;q8++){ const a8=q8/8*6.283; const xx=Math.round(l.x+Math.cos(a8)*l.mr*1.3), yy=Math.round(l.y+Math.sin(a8)*l.mr*1.3); if(xx<0||xx>=LW||yy<0||yy>=LH) continue; inF++; const q=(yy*LW+xx)*4; if(d[q]+d[q+1]+d[q+2]>420) lit++; } if(!inF||lit*2>=inF) continue; }
    const R=l.r, RY=R*l.ry; const x0=Math.max(0,Math.floor(l.x-R)), x1=Math.min(LW-1,Math.ceil(l.x+R)), y0=Math.max(0,Math.floor(l.y-RY)), y1=Math.min(LH-1,Math.ceil(l.y+RY));
    for(let y=y0;y<=y1;y++){ const dy=(y+0.5-l.y)/l.ry; for(let x=x0;x<=x1;x++){ const dx=x+0.5-l.x; const dd=Math.sqrt(dx*dx+dy*dy)/R; if(dd>=1) continue;
      const q=(1-dd)*l.steps; const lev=Math.max(0,Math.min(l.steps,Math.floor(q+(BAY[y&3][x&3]-0.5)*0.55+0.35)))/l.steps; if(!lev) continue;
      const j=y*LW+x, kk=lev*l.k; if(l.add){ AR[j]+=l.col[0]*kk*255; AG[j]+=l.col[1]*kk*255; AB[j]+=l.col[2]*kk*255; } else { LR[j]+=l.col[0]*kk; LG[j]+=l.col[1]*kk; LB[j]+=l.col[2]*kk; } } } }
  for(const s of X.shafts){ mx.setTransform(1,0,0,1,0,0); mx.clearRect(0,0,LW,LH); mx.fillStyle='#fff'; mx.beginPath(); s.pts.forEach(([x,y],i)=>i?mx.lineTo(x,y):mx.moveTo(x,y)); mx.closePath(); mx.fill();
    const md=mx.getImageData(0,0,LW,LH).data; for(let j=0;j<n;j++){ if(md[j*4+3]<128) continue; const x=j%LW,y=(j/LW)|0; if(BAY[y&3][x&3]>s.dens) continue; LR[j]+=s.col[0]*s.k; LG[j]+=s.col[1]*s.k; LB[j]+=s.col[2]*s.k; } }
  const ti=X.tint;
  for(let j=0;j<n;j++){ const i=j*4; let r=d[i]*LR[j]+AR[j], g=d[i+1]*LG[j]+AG[j], b=d[i+2]*LB[j]+AB[j];
    if(ti){ r=r*(1-ti[3])+ti[0]*255*ti[3]; g=g*(1-ti[3])+ti[1]*255*ti[3]; b=b*(1-ti[3])+ti[2]*255*ti[3]; }
    if(fl){ r+= (255-r)*fl; g+=(255-g)*fl; b+=(255-b)*fl; }
    d[i]=r; d[i+1]=g; d[i+2]=b; }
  c.putImageData(im,0,0); };

// ---- sprite wrapper: lantern cast shadows (drawn first) + palette rim light (drawn after) ----
const PIX={}; const [scv,sx]=PX.mk(320,320);
function spritePix(set,anim,k,face,remap){ const key=set+anim+k+face+remap; if(PIX[key]) return PIX[key]; const a=SPR.data.sets[set][anim];
  sx.setTransform(1,0,0,1,0,0); sx.clearRect(0,0,320,320); SPR.blit(sx,set,anim,k,a.ox+ (face<0?(a.w-1-2*a.ox):0),a.oy,face,remap);
  const w=Math.min(320,a.w), h=Math.min(320,a.h); const dd=sx.getImageData(0,0,w,h).data; const op=new Uint8Array(w*h), dark=new Uint8Array(w*h);
  for(let j=0;j<w*h;j++){ op[j]=dd[j*4+3]>0?1:0; dark[j]=(dd[j*4]<40&&dd[j*4+1]<40&&dd[j*4+2]<60)?1:0; }
  return PIX[key]={w,h,op,dark,ox:face<0?a.w-1-a.ox:a.ox,oy:a.oy}; }
const _draw=SPR.draw; const NORIM={fade3:1,ink:1,inkred:1,fade2:1};
SPR.draw=function(c,set,anim,k,wx,wy,face,remap,dx,dy){ const X=F.FX; if(set==='FX'||(!X.rim&&!X.cast)) return _draw.apply(null,arguments);
  const m=c.getTransform(); const lx=Math.round(m.a*wx+m.c*wy+m.e+(dx||0)), ly=Math.round(m.b*wx+m.d*wy+m.f+(dy||0));
  const S=spritePix(set,anim,k,face<0?-1:1,remap||'none'); const X0=lx-S.ox, Y0=ly-S.oy;
  if(X.cast&&!NORIM[remap]){ const C=X.cast; const sh=clamp((lx-C.x)/45,-C.max,C.max); c.save(); c.setTransform(1,0,0,1,0,0); c.fillStyle=`rgba(14,16,32,${C.a})`; c.beginPath();
    for(let y=0;y<S.h;y++){ const hgt=S.oy-y; if(hgt<0) continue; const syy=ly-Math.round(hgt*C.sq); const sxo=Math.round(hgt*C.sq*sh); for(let x=0;x<S.w;x++) if(S.op[y*S.w+x]) c.rect(X0+x+sxo,syy,1,1); }
    c.fill(); c.restore(); }
  const r=_draw.apply(null,arguments);
  if(X.rim&&!NORIM[remap]){ const R=Object.assign({},X.rim); if(R.dir==='auto') R.dir=X.moon!=null?(X.moon>=lx?1:-1):1; c.save(); c.setTransform(1,0,0,1,0,0); c.fillStyle=R.col; c.beginPath(); const W=S.w;
    for(let y=0;y<S.h;y++) for(let x=0;x<W;x++){ const j=y*W+x; if(!S.op[j]||S.dark[j]) continue; const nx=x+R.dir; const sideOpen=nx<0||nx>=W||!S.op[j+R.dir]||S.dark[j+R.dir]; const topOpen=R.top&&(y===0||!S.op[j-W]||S.dark[j-W]);
      if(sideOpen||topOpen){ // only the outermost lit band: check the pixel two steps out is open too (keeps it 1 px)
        c.rect(X0+x,Y0+y,1,1); } }
    c.fill(); c.restore(); }
  return r; };
// mirrored sprite into water (lossless vertical mirror, per-row ripple offset, darkened via remap)
F.mirrorSprite=(c,set,anim,k,wx,wy,face,remap,t,amp,clip)=>{ const m=c.getTransform(); const lx=Math.round(m.a*wx+m.e), ly=Math.round(m.d*wy+m.f);
  const S=spritePix(set,anim,k,face<0?-1:1,remap||'none'); sx.setTransform(1,0,0,1,0,0); sx.clearRect(0,0,320,320); const a=SPR.data.sets[set][anim];
  SPR.blit(sx,set,anim,k,S.ox,S.oy,face,remap); c.save(); c.setTransform(1,0,0,1,0,0); c.imageSmoothingEnabled=false;
  if(clip){ c.beginPath(); c.rect(clip[0],clip[1],clip[2],clip[3]); c.clip(); }
  for(let y=0;y<=S.oy;y++){ const off=Math.round(Math.sin((S.oy-y)*1.3+t*6)*(amp||1)); if((y&1)&&(S.oy-y)>S.oy*0.6) continue; c.drawImage(scv,0,y,S.w,1,lx-S.ox+off,ly+(S.oy-y),S.w,1); }
  c.restore(); };

// ---- auto lights for the v1/v2 sets: every moon gets a banded halo (and becomes the rim-light side), every paper lantern a warm pool
const _moon=G.E.moon; G.E.moon=(c,x,y,r,o)=>{ _moon(c,x,y,r,o); if(!F.V3) return; F.light(c,x,y,r*2.6,'#8C9CC8',0.10,{add:true,steps:3,moonR:r}); F.light(c,x,y,r*4.5,'#C8D4F0',0.06,{steps:2,moonR:r}); const m=c.getTransform(); F.FX.moon=m.a*x+m.e; };
const _lan=G.E.lantern; G.E.lantern=(c,x,y,r,col,colS,rib)=>{ _lan(c,x,y,r,col,colS,rib); if(!F.V3) return; F.light(c,x,y,r*1.8,'#F09A48',0.10,{add:true}); F.light(c,x,y+r*2,r*6,'#FFC870',0.3,{ry:0.7}); };
// ---- particles ----
// rain in 3 depth layers (far / mid / near), with ground splashes; world coords, x range [x0,x1]
F.rain=(c,t,o={})=>{ const r=mulberry(o.seed||5); const gy=o.gy??1080, wind=o.wind??-1; const L=o.layers||[[70,'#4A5378',2,1500],[45,'#8C9CC8',3,1900],[16,'#C8D4F0',6,2600]];
  for(const [n,col,len,sp] of L){ c.fillStyle=col; for(let k=0;k<n*(o.dens||1);k++){ const x0=r()*2400-240, ph=r(); const y=((ph*1300+t*sp)%1300)-120; const x=x0+((y/5)|0)*wind*1.0;
      const X=Math.round(x/5)*5, Y=Math.round(y/5)*5; if(Y>gy) continue; for(let i=0;i<len;i++) c.fillRect(X+i*wind*5*0.5|0,Y+i*5,5,5); } }
  if(o.splash!==false){ const tk=Math.floor(t*12); for(let k=0;k<(o.ns||14);k++){ const rr=mulberry(tk*31+k*7+(o.seed||5)); const x=Math.round((rr()*(o.x1-o.x0||1920)+(o.x0||0))/5)*5; const y=Math.round((gy+rr()*(o.depth||60))/5)*5; const f=(t*12)%1;
      c.fillStyle=o.scol||'#C8D4F0'; if(f<0.5){ c.fillRect(x-5,y-5,5,5); c.fillRect(x+5,y-5,5,5); c.fillRect(x,y-10,5,5); } else { c.fillRect(x-10,y-5,5,5); c.fillRect(x+10,y-5,5,5); } } } };
// expanding ring ripples (puddles / pond), drawn as pixel ellipse outlines that thin out (dither) as they grow
F.ripples=(c,t,o)=>{ const per=o.per||1.1; for(let k=0;k<o.n;k++){ const rr=mulberry((o.seed||9)+k*13); const ph=rr()*per; const cyc=Math.floor((t+ph)/per); const u=((t+ph)%per)/per; const r2=mulberry(cyc*97+k*5+(o.seed||9));
    const cx=o.x0+r2()*(o.x1-o.x0), cy=o.y0+r2()*(o.y1-o.y0); if(o.mask&&!o.mask(cx,cy)) continue; const R=lerp(o.r0||6,o.r1||48,eo(u)); ripple(c,cx,cy,R,o.sq||0.35,o.col||'#8C9CC8',u); } };
function ripple(c,cx,cy,R,sq,col,u){ c.fillStyle=col; const N=Math.max(8,Math.round(R*0.9)); for(let i=0;i<N;i++){ if(u>0.55&&i%2) continue; if(u>0.8&&i%4) continue; const a=i/N*6.283; c.fillRect(Math.round((cx+Math.cos(a)*R)/5)*5,Math.round((cy+Math.sin(a)*R*sq)/5)*5,5,5); } }
F.ring=ripple;
// sparks (sword clash): short streaks flying out, gravity, 0.35 s
F.sparks=(c,t,ts,x,y,seed)=>{ const u=t-ts; if(u<0||u>0.4) return; const r=mulberry(seed||3); for(let k=0;k<14;k++){ const a=r()*6.28, v=300+r()*500; const px=x+Math.cos(a)*v*u, py=y+Math.sin(a)*v*u+900*u*u;
  c.fillStyle=u<0.12?'#FFE7A8':(k%2?'#FFC870':'#F09A48'); c.fillRect(Math.round(px/5)*5,Math.round(py/5)*5,5,5); if(u<0.2) c.fillRect(Math.round((px-Math.cos(a)*15)/5)*5,Math.round((py-Math.sin(a)*15)/5)*5,5,5); } };
// a wooden texture helper: planks with hand-placed grain + knots (deterministic)
F.planks=(c,x,y,w,h,pw,cols,seed,vertical)=>{ const r=mulberry(seed||1); const [base,dark,lite,line]=cols; rect(c,x,y,w,h,base);
  if(vertical){ for(let px=x;px<x+w;px+=pw){ rect(c,px,y,5,h,line); for(let g=0;g<4;g++){ const gx=px+10+Math.floor(r()*(pw-20)/5)*5; let yy=y+r()*h*0.3; while(yy<y+h){ const L=40+r()*120; rect(c,gx,yy,5,Math.min(L,y+h-yy),r()<0.5?dark:lite); yy+=L+20+r()*80; } }
      if(r()<0.5){ const kx=px+15+r()*(pw-30), ky=y+r()*h; rect(c,kx,ky,10,15,dark); rect(c,kx-5,ky+5,5,5,dark); } } }
  else { for(let py=y;py<y+h;py+=pw){ rect(c,x,py,w,5,line); for(let g=0;g<4;g++){ const gy=py+10+Math.floor(r()*(pw-20)/5)*5; let xx=x+r()*w*0.2; while(xx<x+w){ const L=60+r()*220; rect(c,xx,gy,Math.min(L,x+w-xx),5,r()<0.5?dark:lite); xx+=L+30+r()*120; } } } } };
})(window);
