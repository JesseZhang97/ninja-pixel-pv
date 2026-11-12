// pixel3.js (v3: NINJA-56 = NINJA-32 + 24 hand-picked ramp colours; base 32 unchanged so sprites stay exact) — was pixel.js — 8-bit pipeline: 384x216 internal frame (x5 nearest upscale to 1920x1080), fixed 32-colour palette,
// crisp sprites (alpha threshold + palette snap + 1-px ink outline), pixel-font text (Fusion Pixel 12px, OFL).
(function(G){
const LW=384, LH=216, UP=5;
const PAL_HEX=[ // "NINJA-32" palette, in ramps (dark -> light)
 '#0E1020','#1C2238','#2B3A67','#3E4E86', '#2E3756','#4A5378',
 '#6E1A1E','#A82A26','#D8402F','#F07850', '#C86C78','#EBA9A5','#F8D8D0',
 '#8A5A1E','#D9A441','#F2D27A', '#4A2A1C','#7A4B34','#A8744A',
 '#E2D3B8','#F2E8D5','#FFF8EC', '#C48D69','#F0C8A0',
 '#22382A','#46613F','#7C9A6E','#A8C08A', '#43475A','#7E7C76','#B9B6AC', '#BFB27A',
 // v3 +24: warm lantern ramp
 '#3A1E1A','#5C2E22','#B8562E','#F09A48','#FFC870','#FFE7A8',
 // cool moonlight steps
 '#141A30','#253052','#5A6A9A','#8C9CC8','#C8D4F0',
 // water / teal
 '#12303A','#1F4E5A','#2F7A80','#5FB0A8','#A8E0D0',
 // interior wood
 '#33201A','#5E3826','#93603C','#C9965E',
 // night foliage, plum shadow, snow
 '#16261E','#2F4A3A','#6A4A5A','#DDE6F2'];
const PAL=PAL_HEX.map(h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]);
const OUT=PAL[0];
const cache=new Map();
function nearest(r,g,b){ const k=(r<<16)|(g<<8)|b; let v=cache.get(k); if(v!==undefined) return v; let best=0,bd=1e9;
  for(let i=0;i<PAL.length;i++){ const p=PAL[i]; const dr=r-p[0],dg=g-p[1],db=b-p[2]; const d=dr*dr*0.30+dg*dg*0.59+db*db*0.11; if(d<bd){bd=d;best=i;} } cache.set(k,best); return best; }
function quantize(ctx){ const im=ctx.getImageData(0,0,LW,LH), d=im.data; for(let i=0;i<d.length;i+=4){ const p=PAL[nearest(d[i],d[i+1],d[i+2])]; d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255; } ctx.putImageData(im,0,0); }
// sprite: threshold alpha, snap colours, add 1-px outline around the silhouette
function sprite(ctx,outline=true,outCol){ const im=ctx.getImageData(0,0,LW,LH), d=im.data; const n=LW*LH; const op=new Uint8Array(n);
  for(let j=0;j<n;j++){ const i=j*4; if(d[i+3]>=110){ op[j]=1; const a=d[i+3]/255; const p=PAL[nearest(Math.min(255,d[i]/a)|0,Math.min(255,d[i+1]/a)|0,Math.min(255,d[i+2]/a)|0)]; d[i]=p[0];d[i+1]=p[1];d[i+2]=p[2];d[i+3]=255; } else d[i+3]=0; }
  if(outline){ const oc=outCol||OUT; for(let y=0;y<LH;y++)for(let x=0;x<LW;x++){ const j=y*LW+x; if(op[j]) continue; if((x>0&&op[j-1])||(x<LW-1&&op[j+1])||(y>0&&op[j-LW])||(y<LH-1&&op[j+LW])){ const i=j*4; d[i]=oc[0];d[i+1]=oc[1];d[i+2]=oc[2];d[i+3]=255; } } }
  ctx.putImageData(im,0,0); }
function mk(w,h){ const cv=document.createElement('canvas'); cv.width=w; cv.height=h; const x=cv.getContext('2d',{willReadFrequently:true}); return [cv,x]; }
// crisp pixel text: render at 12px native, threshold, then integer-scale onto target (nearest)
const [tcv,tx]=mk(512,64);
function text(dst,str,x,y,opt={}){ const sc=opt.scale||1, col=opt.color||'#F2E8D5', sh=opt.shadow, font=opt.jp?'FusionPixelJA':'FusionPixel', align=opt.align||'left';
  tx.setTransform(1,0,0,1,0,0); tx.clearRect(0,0,512,64); tx.font=`12px "${font}"`; tx.textBaseline='top'; const w=Math.ceil(tx.measureText(str).width);
  tx.fillStyle=col; tx.fillText(str,1,1); const im=tx.getImageData(0,0,w+4,16), d=im.data; for(let i=0;i<d.length;i+=4){ d[i+3]=d[i+3]>=100?255:0; } tx.putImageData(im,0,0);
  let X=Math.round(align==='center'?x-(w*sc)/2:align==='right'?x-w*sc:x), Y=Math.round(y);
  dst.save(); dst.setTransform(1,0,0,1,0,0); dst.imageSmoothingEnabled=false;
  if(sh){ // hard 1-px drop shadow in the shadow colour
    const [scv,sx]=mk(w+4,16); sx.drawImage(tcv,0,0,w+4,16,0,0,w+4,16); sx.globalCompositeOperation='source-in'; sx.fillStyle=sh; sx.fillRect(0,0,w+4,16);
    dst.drawImage(scv,0,0,w+4,16,X+sc,Y+sc,(w+4)*sc,16*sc); }
  dst.drawImage(tcv,0,0,w+4,16,X,Y,(w+4)*sc,16*sc); dst.restore(); return w*sc; }
function measure(str,opt={}){ tx.font=`12px "${opt.jp?'FusionPixelJA':'FusionPixel'}"`; return Math.ceil(tx.measureText(str).width)*(opt.scale||1); }
G.PX={LW,LH,UP,PAL_HEX,PAL,quantize,sprite,text,measure,mk,nearest};
})(window);
