// env.js — environment painters for the night picture-scroll. All flat fills, hard shadows, no outlines/gradients.
(function(G){
const {P,mulberry,hash,clamp,lerp,poly,rect,circ,ell,rrect,capsule,blob,kasumi,seigaiha}=G.K;
const E={};
E.sky=(c,col)=>{rect(c,0,0,1920,1080,col||P.night);};
E.moon=(c,x,y,r,opt={})=>{ circ(c,x,y,r,opt.col||P.moon); // hard crescent shadow + flat craters
  c.save();c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.clip(); circ(c,x+r*0.32,y+r*0.12,r*0.98,opt.colS||P.moon); 
  c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.arc(x+r*0.26,y-r*0.06,r*0.96,0,Math.PI*2,true);c.fillStyle=opt.colS||P.moonS;c.fill('evenodd');
  for(const [dx,dy,rr] of [[-0.3,-0.25,0.16],[0.2,0.3,0.11],[0.35,-0.35,0.08],[-0.1,0.45,0.07]]) circ(c,x+dx*r,y+dy*r,rr*r,opt.colS||P.moonS);
  c.restore(); };
E.clouds=(c,t,rows,col,seed)=>{ rows.forEach((rw,k)=>{ const w=rw.w,x=((rw.x+t*rw.v)%(1920+w*2)+(1920+w*2))%(1920+w*2)-w; kasumi(c,x,rw.y,w,rw.h,rw.col||col,(seed||7)+k*13); }); };
// machiya / temple roofline layer: tiled roofs with ridge caps, x in px world, base y px, scale k
E.roofRow=(c,x0,baseY,k,n,colRoof,colRib,colWall,seed,opt={})=>{ const r=mulberry(seed);
  let x=x0; for(let i=0;i<n;i++){ const w=(160+r()*170)*k, h=(46+r()*40)*k, wh=(70+r()*80)*k, top=baseY-wh-h;
    if(colWall){ rect(c,x+8*k,baseY-wh,w-16*k,wh+2,colWall); if(opt.lattice){ c.fillStyle=opt.lattice; for(let s=x+18*k;s<x+w-20*k;s+=9*k) c.fillRect(s,baseY-wh*0.75,2.5*k,wh*0.55);} if(opt.lamp&&r()<0.5){ const lx=x+w*0.5; rect(c,lx-12*k,baseY-wh*0.8,24*k,26*k,opt.lamp);} }
    poly(c,[[x-16*k,top+h],[x+w*0.16,top],[x+w*0.84,top],[x+w+16*k,top+h]],colRoof);
    if(colRib){ c.fillStyle=colRib; for(let s=x+w*0.12;s<x+w*0.9;s+=13*k){ const u=(s-x)/w; const yT=top, yB=top+h; c.fillRect(s,yT+4*k,3*k,yB-yT-6*k);} }
    rect(c,x+w*0.12,top-7*k,w*0.76,9*k,colRib?colRoof:colRoof); poly(c,[[x+w*0.12,top-7*k],[x+w*0.1,top-18*k],[x+w*0.16,top-7*k]],colRoof); poly(c,[[x+w*0.88,top-7*k],[x+w*0.9,top-18*k],[x+w*0.84,top-7*k]],colRoof);
    x+=w+(r()<0.3?40*k:6*k); }
  return x; };
E.ground=(c,y,col)=>rect(c,0,y,1920,1080-y,col);
// pebble field (玄关 / garden)
E.pebbles=(c,x,y,w,h,seed,cols)=>{const r=mulberry(seed);for(let i=0;i<w*h/260;i++){const px=x+r()*w,py=y+r()*h,rr=3+r()*6;ell(c,px,py,rr*1.3,rr,0,cols[(i%cols.length)]);}};
// paper lantern (chōchin)
E.lantern=(c,x,y,r,col,colS,rib)=>{ rrect(c,x-r*0.45,y-r*1.25,r*0.9,r*0.2,3,P.ink); ell(c,x,y,r,r*1.12,0,col); c.save();c.beginPath();c.ellipse(x,y,r,r*1.12,0,0,Math.PI*2);c.clip(); rect(c,x+r*0.25,y-r*1.2,r,r*2.4,colS); c.fillStyle=rib; for(let k=-4;k<=4;k++) c.fillRect(x-r,y+k*r*0.24,r*2,Math.max(1.5,r*0.04)); c.restore(); rrect(c,x-r*0.45,y+r*1.05,r*0.9,r*0.2,3,P.ink); };
// torii (single)
E.torii=(c,x,y,h,col,colS)=>{ const w=h*0.95,pw=h*0.085; rect(c,x-w*0.36-pw/2,y-h,pw,h,col); rect(c,x+w*0.36-pw/2,y-h,pw,h,col);
  rect(c,x-w*0.36-pw/2+pw*0.55,y-h,pw*0.45,h,colS); rect(c,x+w*0.36-pw/2+pw*0.55,y-h,pw*0.45,h,colS);
  rect(c,x-w*0.46,y-h*0.78,w*0.92,h*0.07,col); poly(c,[[x-w*0.62,y-h*0.98],[x+w*0.62,y-h*0.98],[x+w*0.55,y-h*0.88],[x-w*0.55,y-h*0.88]],col); rect(c,x-w*0.6,y-h*1.02,w*1.2,h*0.05,P.ink); rect(c,x-w*0.5,y-h*0.88,w,h*0.02,colS); };
// sakura blossom cluster canopy
E.sakuraCanopy=(c,cx,cy,R,seed,cols)=>{ const r=mulberry(seed);
  const lobes=[]; for(let i=0;i<9;i++){ const a=Math.PI*(1.05+i/8*0.9)+ (r()-0.5)*0.2; const d=R*(0.55+r()*0.25); lobes.push([cx+Math.cos(a)*d*1.25,cy+Math.sin(a)*d*0.7+R*0.25,R*(0.38+r()*0.14)]); }
  lobes.push([cx,cy-R*0.1,R*0.55],[cx-R*0.5,cy+R*0.05,R*0.45],[cx+R*0.5,cy+R*0.08,R*0.45]);
  const scallop=(x,y,rr,col)=>{ circ(c,x,y,rr,col); for(let k=0;k<10;k++){ const a=k/10*Math.PI*2; circ(c,x+Math.cos(a)*rr*0.92,y+Math.sin(a)*rr*0.92,rr*0.24,col);} };
  // branches peeking (behind)
  for(const [x,y] of lobes.slice(0,9)){ capsule(c,cx,cy+R*0.9,R*0.07,x,y,R*0.025,cols.B||'#5E3826'); }
  for(const [x,y,rr] of lobes) scallop(x,y+rr*0.16,rr,cols.S);
  for(const [x,y,rr] of lobes) scallop(x,y,rr*0.9,cols.M);
  for(const [x,y,rr] of lobes) scallop(x-rr*0.22,y-rr*0.26,rr*0.42,cols.L);
  // blossom specks on rims
  for(let i=0;i<70;i++){ const L=lobes[Math.floor(r()*lobes.length)]; const a=r()*Math.PI*2; const x=L[0]+Math.cos(a)*L[2]*1.02, y=L[1]+Math.sin(a)*L[2]*1.02; for(let p=0;p<5;p++){const q=p/5*Math.PI*2; circ(c,x+Math.cos(q)*5,y+Math.sin(q)*5,4.5,r()<0.5?cols.L:cols.M);} circ(c,x,y,2.4,cols.S); }
};
// pixel petal / particle: snapped to the 5-px (1 low-res px) grid, 2x2 or 3x2 block with a 1-px shade, flips by swapping shade side
E.petal=(c,x,y,s,rot,col,colS,flip)=>{ const g=5, X=Math.round(x/g)*g, Y=Math.round(y/g)*g, big=s>10; const f=Math.cos(rot)>0;
  c.fillStyle=flip>0?col:colS; c.fillRect(X,Y,big?3*g:2*g,2*g); c.fillStyle=flip>0?colS:col; c.fillRect(f?X:X+(big?2*g:g),Y+g,g,g); };
// bamboo stalk
E.bamboo=(c,x,yTop,yBot,w,col,colS,node,cut)=>{ rect(c,x-w/2,yTop,w,yBot-yTop,col); rect(c,x+w*0.12,yTop,w*0.38,yBot-yTop,colS); c.fillStyle=node; for(let y=yBot-w*6;y>yTop+w;y-=w*6.5){ c.fillRect(x-w/2-1,y,w+2,Math.max(2,w*0.16)); }
  if(cut){ poly(c,[[x-w/2,yTop],[x+w/2,yTop-w*0.9],[x+w/2,yTop+2],[x-w/2,yTop+2]],col); } };
// shuriken
E.shuriken=(c,x,y,r,rot,col,colS)=>{c.save();c.translate(x,y);c.rotate(rot);for(let k=0;k<4;k++){c.rotate(Math.PI/2);poly(c,[[0,0],[r*0.28,-r*0.28],[0,-r],[-r*0.12,-r*0.3]],k%2?colS:col);}circ(c,0,0,r*0.16,P.night);c.restore();};
// 8-bit helpers: single-pixel stars (twinkle on twos) and ordered-dither bands (checkerboard at 1 low-res px)
E.stars=(c,t,seed,n,yMax,cols)=>{ const r=mulberry(seed); for(let k=0;k<n;k++){ const x=Math.floor(r()*384)*5, y=Math.floor(r()*(yMax/5))*5, ph=r()*6, big=r()<0.15;
  const on=Math.sin(Math.floor(t*15)/15*2.2+ph)>-0.6; if(!on) continue; c.fillStyle=cols[k%cols.length]; c.fillRect(x,y,5,5); if(big){ c.fillRect(x-5,y,15,5); c.fillRect(x,y-5,5,15);} } };
E.dither=(c,x,y,w,h,col,dens)=>{ c.fillStyle=col; const X0=Math.floor(x/5),Y0=Math.floor(y/5); for(let j=0;j<Math.ceil(h/5);j++)for(let i=0;i<Math.ceil(w/5);i++){ const X=X0+i,Y=Y0+j; const m=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]][Y&3][X&3]/16; if(m<(typeof dens==='function'?dens(j/(h/5)):dens)) c.fillRect(X*5,Y*5,5,5); } };
G.E=E;
})(typeof window!=='undefined'?window:globalThis);
