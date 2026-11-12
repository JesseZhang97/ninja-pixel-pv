// film_main9.js (v9: audit log carries sprite anchors + shadow ellipse centres for the sole-to-shadow check) — forked from film_main8.js (v8: flat (undithered) light pools via F.FX.flat; ripple = clean circular reveal (no per-row shift / banding); 'dwipe' ordered-dither wipe; flash cuts = 1 paper-toned frame of the new shot (never a blank frame)) — forked from film_main7.js (v7: clean transitions — dissolve = per-pixel crossfade re-quantised to the palette (no coarse checker); ripple = soft water shimmer crossfade, no cyan ring) — forked from film_main3.js — renderFrame for the full film: shot lookup, pixel transitions, overlays, nearest-neighbour upscale.
(function(G){
const {P,inv,eo,eio}=G.K; const D=G.DATA, PX=G.PX, F=G.FILM; const W=1920,H=1080,FPS=D.FPS, LW=PX.LW, LH=PX.LH;
const out=document.getElementById('c').getContext('2d');
const [lcv,c]=PX.mk(LW,LH); const [bcv,bx]=PX.mk(LW,LH);
F.SHOTS.sort((a,b)=>a.t0-b.t0);
const BAYER=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];
function drawShot(s,t){ c.setTransform(1,0,0,1,0,0); c.imageSmoothingEnabled=false; c.globalAlpha=1; c.fillStyle='#0E1020'; c.fillRect(0,0,LW,LH);
  F.fxReset(); F.CUR=s; c.save(); c.setTransform(1/PX.UP,0,0,1/PX.UP,0,0); s.fn(c,t); c.restore(); c.setTransform(1,0,0,1,0,0); c.globalAlpha=1; flatLights(c); F.fxApply(c,t); PX.quantize(c); return shake(c.getImageData(0,0,LW,LH),t); }
function shake(img,t){ const [dx,dy]=F.shakeAt(t); if(!dx&&!dy) return img; const s=new Uint8ClampedArray(img.data), d=img.data; for(let y=0;y<LH;y++){ const sy=Math.min(LH-1,Math.max(0,y-dy)); for(let x=0;x<LW;x++){ const sx=Math.min(LW-1,Math.max(0,x-dx)); const a=(y*LW+x)*4, b=(sy*LW+sx)*4; d[a]=s[b]; d[a+1]=s[b+1]; d[a+2]=s[b+2]; } } return img; }
// ripple transition: rows displaced by a travelling sine whose amplitude peaks mid-cut, concentric ring mask hands A to B, teal light shift
function rippleT(A,B,u){ const a=A.data,b=B.data,o=new Uint8ClampedArray(a.length); const amp=Math.sin(u*Math.PI)*7; const cx=LW*(F.RIPC?F.RIPC[0]:0.5), cy=LH*(F.RIPC?F.RIPC[1]:0.6); const R=u*1.25*Math.hypot(LW,LH)*0.6;
  for(let y=0;y<LH;y++) for(let x=0;x<LW;x++){ const dd=Math.hypot(x-cx,(y-cy)*1.6); const sh=Math.round(Math.sin(dd*0.22-u*18)*amp); const sx=Math.min(LW-1,Math.max(0,x+sh)); const useB=dd<R-((BAYER[y&3][x&3])*10); const src=useB?b:a; const q=(y*LW+sx)*4, w=(y*LW+x)*4;
    const ring=Math.abs(dd-R)<3&&u>0.05&&u<0.95; o[w]=ring?0xA8:src[q]; o[w+1]=ring?0xE0:src[q+1]; o[w+2]=ring?0xD0:src[q+2]; o[w+3]=255; }
  const im=new ImageData(o,LW,LH); return im; }
// v8: flat light pools — hard stepped rings, no Bayer edge (applied before fxApply; divided by the ambient so the result matches a normal pool)
function flatLights(c){ const L=F.FX.flat; if(!L||!L.length) return; const im=c.getImageData(0,0,LW,LH), d=im.data; const am=F.FX.amb||[1,1,1];
  for(const l of L){ const R=l.r, RY=R*(l.ry||1); const x0=Math.max(0,Math.floor(l.x-R)), x1=Math.min(LW-1,Math.ceil(l.x+R)), y0=Math.max(0,Math.floor(l.y-RY)), y1=Math.min(LH-1,Math.ceil(l.y+RY));
    for(let y=y0;y<=y1;y++){ const dy=(y+0.5-l.y)/(l.ry||1); for(let x=x0;x<=x1;x++){ const dx=x+0.5-l.x; const dd=Math.sqrt(dx*dx+dy*dy)/R; if(dd>=1) continue;
      const lev=Math.ceil((1-dd)*l.steps)/l.steps; const q=(y*LW+x)*4; for(let ch=0;ch<3;ch++) d[q+ch]=Math.min(255,d[q+ch]*(1+l.col[ch]*l.k*lev/am[ch])); } } }
  c.putImageData(im,0,0); }
// v8 ripple: an expanding circle hands A to B through an 8-px soft front (palette re-quantised); no row displacement, so no banding
function rippleQ(A,B,u,cc){ const a=A.data,b=B.data,o=new Uint8ClampedArray(a.length); const cx=LW*(cc?cc[0]:0.5), cy=LH*(cc?cc[1]:0.55); const R=u*Math.hypot(LW,LH)*0.62, FR=8;
  for(let y=0;y<LH;y++) for(let x=0;x<LW;x++){ const dd=Math.hypot(x-cx,(y-cy)*1.25); const w=(y*LW+x)*4; let m=(R-dd)/FR; m=m<0?0:(m>1?1:m);
    if(m===0||m===1){ const s=m?b:a; o[w]=s[w]; o[w+1]=s[w+1]; o[w+2]=s[w+2]; o[w+3]=255; continue; }
    const p=PX.PAL[PX.nearest(a[w]*(1-m)+b[w]*m,a[w+1]*(1-m)+b[w+1]*m,a[w+2]*(1-m)+b[w+2]*m)]; o[w]=p[0]; o[w+1]=p[1]; o[w+2]=p[2]; o[w+3]=255; }
  return new ImageData(o,LW,LH); }
// v8 dither wipe: 2x2-px ordered-dither cells hand A to B outward from the centre (a designed, all-picture transition)
function dwipe(A,B,u){ const a=A.data,b=B.data; const cx=LW/2, cy=LH*0.55, md=Math.hypot(cx,cy);
  for(let y=0;y<LH;y++) for(let x=0;x<LW;x++){ const cell=(BAYER[(y>>1)&3][(x>>1)&3]+0.5)/16; const g=Math.hypot(x-cx,y-cy)/md; if(cell*0.4+g*0.6<u){ const q=(y*LW+x)*4; a[q]=b[q]; a[q+1]=b[q+1]; a[q+2]=b[q+2]; } }
  return A; }
// v8 flash: the first frame of a flash cut is the new shot printed in four paper tones (by luminance) — a designed paper flash with the
// picture readable — and the second frame is the shot itself, so no frame is ever blank
const PAPER4=[[0x7E,0x7C,0x76],[0xB9,0xB6,0xAC],[0xE2,0xD3,0xB8],[0xF2,0xE8,0xD5]];
function paperTone(img){ const d=img.data; for(let q=0;q<d.length;q+=4){ const L=0.3*d[q]+0.59*d[q+1]+0.11*d[q+2]; const p=PAPER4[L<24?0:(L<44?1:(L<90?2:3))]; d[q]=p[0]; d[q+1]=p[1]; d[q+2]=p[2]; } return img; }
// clean crossfade: linear mix of the two quantised frames, optional gentle per-row shimmer (|shift|<=2 px), then back onto the palette
function blendQ(A,B,u,amp,t){ const a=A.data,b=B.data,o=new Uint8ClampedArray(a.length);
  for(let y=0;y<LH;y++){ const sh=amp?Math.round(Math.sin(y*0.35+(t||0)*14)*amp):0; for(let x=0;x<LW;x++){ const sx=Math.min(LW-1,Math.max(0,x+sh)); const w=(y*LW+x)*4, qa=(y*LW+sx)*4, qb=w;
    const r=a[qa]*(1-u)+b[qb]*u, g=a[qa+1]*(1-u)+b[qb+1]*u, bb=a[qa+2]*(1-u)+b[qb+2]*u; const p=PX.PAL[PX.nearest(r,g,bb)]; o[w]=p[0]; o[w+1]=p[1]; o[w+2]=p[2]; o[w+3]=255; } }
  return new ImageData(o,LW,LH); }
function mosaic(img,b){ if(b<=1) return img; const d=img.data; for(let y=0;y<LH;y+=b) for(let x=0;x<LW;x+=b){ const sx=Math.min(LW-1,x+(b>>1)), sy=Math.min(LH-1,y+(b>>1)), o=(sy*LW+sx)*4;
  for(let yy=y;yy<Math.min(LH,y+b);yy++) for(let xx=x;xx<Math.min(LW,x+b);xx++){ const q=(yy*LW+xx)*4; d[q]=d[o]; d[q+1]=d[o+1]; d[q+2]=d[o+2]; } } return img; }
function mix(A,B,pick){ const a=A.data,b=B.data; for(let y=0;y<LH;y++) for(let x=0;x<LW;x++) if(pick(x,y)){ const q=(y*LW+x)*4; a[q]=b[q]; a[q+1]=b[q+1]; a[q+2]=b[q+2]; } return A; }
// transition into shot s (index i) at its t0
function compose(t){ const S=F.SHOTS; let i=S.findIndex(q=>t>=q.t0&&t<q.t1); if(i<0) i=t<S[0].t0?0:S.length-1;
  // is t inside the window of the transition into shot i, or into shot i+1?
  for(const j of [i,i+1]){ const s=S[j]; if(!s||j===0) continue; const tr=s.tr, d=tr.d||0, tc=s.t0; if(!d) continue;
    if(t>=tc-d/2&&t<tc+d/2){ const u=(t-(tc-d/2))/d, A=S[j-1], B=s;
      if(tr.k==='mosaic'){ const side=u<0.5; const k=side?u*2:(1-u)*2; const b=[1,2,4,8,12,16][Math.min(5,Math.floor(k*6))]; return mosaic(drawShot(side?A:B,t),b); }
      const ia=drawShot(A,t), ib=drawShot(B,t);
      if(tr.k==='ripple'){ return rippleQ(ia,ib,eio(u),tr.c); }
      if(tr.k==='dwipe') return dwipe(ia,ib,u);
      if(tr.k==='dissolve') return blendQ(ia,ib,eio(u),0);
      if(tr.k==='wipe') return mix(ia,ib,(x,y)=>u>((y%8)/8)*0.5+(y/LH)*0.5);
      if(tr.k==='slash'){ const k=(u*1.4-0.2); return mix(ia,ib,(x,y)=>((x/LW)+(1-y/LH))/2<k); }
      return u<0.5?ia:ib; } }
  const img=drawShot(S[i],t);
  // hard-cut flash: two paper frames right on the cut
  if(S[i].tr.k==='flash'&&t<S[i].t0+1/FPS){ paperTone(img); }
  return img; }
// moon iris close (end): circle radius stepped on the 4-px grid
function iris(img,cx,cy,r){ const d=img.data; for(let y=0;y<LH;y++) for(let x=0;x<LW;x++){ const X=(x>>1)<<1, Y=(y>>1)<<1; if((X-cx)**2+(Y-cy)**2>r*r){ const q=(y*LW+x)*4; d[q]=0x0E; d[q+1]=0x10; d[q+2]=0x20; } } return img; }
// ---------------- overlays ----------------
const INK='#0E1020', PAPER='#F2E8D5', SHU='#D8402F', SHUD='#A82A26';
function prect(x,y,w,h,col){ c.fillStyle=col; c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h)); }
function title(t){ const ta=inv(1.2,1.6,t)*(t<8.3?1:0); if(ta<=0) return; const dy=Math.round((1-eo(inv(1.2,1.7,t)))*6);
  PX.text(c,'忍',44,52+dy,{scale:4,color:PAPER,shadow:INK}); PX.text(c,'者',44,104+dy,{scale:4,color:PAPER,shadow:INK});
  if(t>2.3){ prect(96,52,14,14,SHU); PX.text(c,'周',97,53,{color:PAPER}); }
  const sub='周杰伦·范特西·二〇〇一'; const n=Math.floor(sub.length*inv(2.8,3.6,t)); for(let k=0;k<n;k++) PX.text(c,sub[k],26,54+k*12,{color:PAPER,shadow:INK}); }
function captions(t){ const cur=D.caps.find(q=>t>=q.t&&t<q.end); if(!cur) return; const all=D.caps.filter(q=>q.line===cur.line);
  const gap=8, ws=all.map(q=>PX.measure(q.text,{jp:q.jp})), total=ws.reduce((a,b)=>a+b,0)+gap*(all.length-1); let x=Math.round(192-total/2); const y=195;   // v8: caption band 3 px lower (feet-to-caption gap >= 9 low-res px everywhere)
  prect(x-9,y,3,13,SHU); F.CAP={x0:x-9,y0:y,x1:x-9+total+9,y1:y+14,line:cur.line,text:all.filter(q=>q.t<=t).map(q=>q.text).join(' ')};
  all.forEach((q,k)=>{ if(q.t<=t){ const dy=t<q.t+0.1?2:0; PX.text(c,q.text,x,y+dy,{jp:q.jp,color:PAPER,shadow:INK}); } x+=ws[k]+gap; }); }
function stamps(t){ const g=[]; for(let k=0;k<D.counts.length;k+=4){ const grp=D.counts.slice(k,k+4); const end=grp[0].t+((k+4<D.counts.length&&D.counts[k+4].t-grp[0].t<3)?(D.counts[k+4].t-grp[0].t-0.05):4.45); if(t>=grp[0].t&&t<end) g.push(...grp); }
  const CH=['一','二','三','四']; g.forEach(q=>{ if(t<q.t) return; const big=t<q.t+0.1; const s=big?28:22, x=Math.round(278+q.n*26-(s-22)/2), y=Math.round(18-(s-22)/2)+[0,1,0,1][q.n];
    prect(x,y,s,s,SHUD); prect(x+1,y+1,s-2,s-2,SHU); prect(x+2,y+2,s-4,1,'#F07850'); PX.text(c,CH[q.n],x+s/2,y+(s-14)/2,{align:'center',color:PAPER,shadow:big?null:SHUD}); }); }
function endcard(t){ if(t<158.0) return; prect(184,100,16,16,SHU); PX.text(c,'完',185,101,{color:PAPER}); }
G.renderFrame=function(i){ const t=i/FPS; let img=compose(t);
  if(F.IRIS){ const r=F.IRIS(t); if(r!=null) img=iris(img,r[0],r[1],r[2]); }
  c.setTransform(1,0,0,1,0,0); c.putImageData(img,0,0);
  title(t); captions(t); stamps(t); endcard(t);
  out.imageSmoothingEnabled=false; out.drawImage(lcv,0,0,LW*PX.UP,LH*PX.UP); };
// ---- audit hooks: tight sprite bboxes per frame + caption rect (used by tools/film_audit.js)
const SPR=G.SPR, _draw=SPR.draw, BB={};
function tight(set,anim,k){ const key=set+anim+k; if(BB[key]) return BB[key]; const a=SPR.data.sets[set][anim], rows=a.frames[k]; let x0=1e9,y0=1e9,x1=-1,y1=-1;
  rows.forEach((r,y)=>{ for(let x=0;x<r.length;x++) if(r[x]!=='.'){ x0=Math.min(x0,x); x1=Math.max(x1,x); y0=Math.min(y0,y); y1=Math.max(y1,y);} }); return BB[key]=[x0,y0,x1,y1,a.w,a.ox,a.oy]; }
SPR.draw=function(c,set,anim,k,wx,wy,face,remap,dx,dy){ const r=_draw.apply(null,arguments); if(F.LOG&&remap!=='fade3'){ const [x0,y0,x1,y1,w,ox,oy]=tight(set,anim,k); const flip=face<0; const OX=flip?w-1-ox:ox;
  const X0=flip?w-1-x1:x0, X1=flip?w-1-x0:x1; F.LOG.push({set,anim,k,remap:remap||null,face:face<0?-1:1,lx:r[0],ly:r[1],oy,y1,box:[r[0]-OX+X0,r[1]-oy+y0,r[0]-OX+X1,r[1]-oy+y1]}); } return r; };
G.AUDIT=function(i){ F.LOG=[]; F.SHLOG=[]; F.CAP=null; G.renderFrame(i); const L=F.LOG, S=F.SHLOG; F.LOG=null; F.SHLOG=null; return {sprites:L,shadows:S,cap:F.CAP}; };
G.SCENE={SHOTS:F.SHOTS};
})(window);
