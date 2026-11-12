// spr.js — runtime for the hand-authored pixel sprites (sprites.js / character/sprites/sprites.json).
// Frames are indexed NINJA-32 arrays; we turn each into a canvas once (plus mirrored + palette-remapped variants)
// and blit them 1:1 onto the 384x216 frame at integer pixel positions. No scaling, no rotation, no smoothing.
(function(G){
const D=G.SPR_DATA, A32='0123456789ABCDEFGHIJKLMNOPQRSTUV';
const PAL=D.palette.map(h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]);
const lum=i=>0.3*PAL[i][0]+0.59*PAL[i][1]+0.11*PAL[i][2];
// palette remaps (index -> index)
const REMAP={
  none:null,
  // faceless shadow ninja: everything ink/indigo, skin becomes a pale eye-band, steel stays steel
  shadow:PAL.map((_,i)=>i===23||i===22?20:(i===30||i===21?i:(i===0?0:1))),
  // silent-film duotone (indigo / washi)
  duo:PAL.map((_,i)=>i===0?1:(lum(i)<70?4:(lum(i)<150?5:19))),
  // far clones: one step darker so depth reads without scaling
  far:PAL.map((_,i)=>({2:1,3:2,5:4,8:7,9:8,7:6,23:22,22:18,28:4,29:28,30:29,21:30,20:19,14:13})[i]??i),
  // the antagonist (Kage leader): shadow body, glowing red eye band, dark-red scarf
  leader:PAL.map((_,i)=>i===23||i===22?8:(i===8||i===9?6:(i===7?6:(i===30||i===21?i:(i===0?0:1))))),
  // vanishing (隐身): body steps toward the night values; at fade3 only the red scarf/mask survives
  fade1:PAL.map((_,i)=>({2:4,3:5,5:4,23:30,22:29,20:29,21:30,28:4,29:28})[i]??i),
  fade2:PAL.map((_,i)=>[7,8,9,6].includes(i)?i:(i===0?1:(lum(i)<60?1:4))),
  fade3:PAL.map((_,i)=>[7,8,9].includes(i)?i:-1),
  // silhouettes: story-scroll ink on washi, and moon-hill backlight (red scarf kept)
  ink:PAL.map(()=>16),
  // story-scroll ink with the red scarves/knots kept: the pupils' shared mark
  inkred:PAL.map((_,i)=>[7,8,9].includes(i)?i:16),
  sil:PAL.map((_,i)=>[7,8,9].includes(i)?i:0),
  silL:PAL.map((_,i)=>i===23||i===22?8:0),
};
const cache={};
function build(set,anim,k,remap,flip){
  const key=set+'/'+anim+'/'+k+'/'+(remap||'none')+'/'+(flip?1:0); if(cache[key]) return cache[key];
  const a=D.sets[set][anim], rows=a.frames[k], w=a.w, h=a.h, R=REMAP[remap||'none'];
  const cv=document.createElement('canvas'); cv.width=w; cv.height=h; const x=cv.getContext('2d'); const im=x.createImageData(w,h);
  for(let y=0;y<h;y++){ const r=rows[y]; for(let i=0;i<w;i++){ const ch=r[i]; if(ch==='.') continue; let v=A32.indexOf(ch); if(R) v=R[v]; if(v<0) continue;
    const X=flip?w-1-i:i, o=(y*w+X)*4; const p=PAL[v]; im.data[o]=p[0]; im.data[o+1]=p[1]; im.data[o+2]=p[2]; im.data[o+3]=255; } }
  x.putImageData(im,0,0); return cache[key]=cv;
}
// frame index for an animation started at t0 (seconds), using authored per-frame durations in 30 fps ticks
function frameAt(set,anim,t,t0){ const a=D.sets[set][anim]; let tick=Math.floor((t-(t0||0))*30+1e-6); if(tick<0) tick=0;
  const tot=a.dur.reduce((p,q)=>p+q,0); if(a.loop) tick%=tot; else if(tick>=tot) return a.dur.length-1;
  for(let k=0;k<a.dur.length;k++){ if(tick<a.dur[k]) return k; tick-=a.dur[k]; } return a.dur.length-1; }
function length(set,anim){ return D.sets[set][anim].dur.reduce((p,q)=>p+q,0)/30; }
// draw at world point (wx,wy) under the current transform of ctx c; face +1 right / -1 left
function draw(c,set,anim,k,wx,wy,face,remap,dx,dy){ const a=D.sets[set][anim]; const m=c.getTransform();
  const lx=Math.round(m.a*wx+m.c*wy+m.e+(dx||0)), ly=Math.round(m.b*wx+m.d*wy+m.f+(dy||0)); const flip=face<0;
  const cv=build(set,anim,k,remap,flip); const ox=flip?a.w-1-a.ox:a.ox;
  c.save(); c.setTransform(1,0,0,1,0,0); c.imageSmoothingEnabled=false; c.drawImage(cv,lx-ox,ly-a.oy); c.restore(); return [lx,ly]; }
// draw at an explicit low-res pixel (used by preview pages)
function blit(c,set,anim,k,lx,ly,face,remap){ const a=D.sets[set][anim]; const flip=face<0; const cv=build(set,anim,k,remap,flip); const ox=flip?a.w-1-a.ox:a.ox;
  c.save(); c.setTransform(1,0,0,1,0,0); c.imageSmoothingEnabled=false; c.drawImage(cv,Math.round(lx)-ox,Math.round(ly)-a.oy); c.restore(); }
G.SPR={draw,blit,frameAt,length,data:D,REMAP};
})(window);
