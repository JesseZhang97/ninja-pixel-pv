// core.js — palette, seeded rng, easing, flat-shape helpers. Pure functions only (deterministic).
(function(G){
const P = {
  paper:'#F2E8D5', paper2:'#E2D3B8', night:'#1C2238', night2:'#2E3756', night3:'#3A456A',
  ai:'#2B3A67', aiS:'#1F2A4C', aiL:'#3B4E85', shu:'#C8372D', shuS:'#952A27', shuL:'#DD5A44',
  sakura:'#EBA9A5', sakuraS:'#C86C78', sakuraL:'#F8D8D0', ochre:'#D9A441', ochreS:'#B9832C', moon:'#F4E9C8', moonS:'#E6D6A8',
  wood:'#7A4B34', woodS:'#5E3826', woodL:'#9A6646', tatami:'#BFB27A', tatamiS:'#A39560', moss:'#5C7A55', mossS:'#46613F', mossL:'#7C9A6E',
  ink:'#1E2233', ink2:'#2A2F45', skin:'#F0C8A0', skinS:'#C48D69', skinD:'#A8744A', grey:'#5A5F73', greyS:'#43475A', white:'#FBF6EA',
  snow:'#F5F1E8', stone:'#7E7C76', stoneS:'#43475A', stoneL:'#B9B6AC', gold:'#E3B34E'
};
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function hash(n){let x=Math.sin(n*127.1+311.7)*43758.5453;return x-Math.floor(x);}
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,t)=>a+(b-a)*t;
const inv=(a,b,x)=>clamp((x-a)/(b-a));
const eio=t=>(t=clamp(t),t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2);
const eo=t=>(t=clamp(t),1-Math.pow(1-t,3));
const ei=t=>(t=clamp(t),t*t*t);
const eback=t=>{t=clamp(t);const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2);};
const spring=(t,f=3,d=5)=>t<=0?0:1-Math.exp(-d*t)*Math.cos(f*Math.PI*2*t*0.5);
const twos=(t,fps=30)=>Math.floor(t*fps/2)*2/fps; // hold every value 2 frames (cut-out limbs on twos)
const D2R=Math.PI/180;
// shapes
function poly(c,pts,fill){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();c.fillStyle=fill;c.fill();}
function rect(c,x,y,w,h,fill){c.fillStyle=fill;c.fillRect(x,y,w,h);}
function circ(c,x,y,r,fill){c.beginPath();c.arc(x,y,Math.max(0,r),0,Math.PI*2);c.fillStyle=fill;c.fill();}
function ell(c,x,y,rx,ry,rot,fill){c.beginPath();c.ellipse(x,y,Math.max(0,rx),Math.max(0,ry),rot||0,0,Math.PI*2);c.fillStyle=fill;c.fill();}
function rrect(c,x,y,w,h,r,fill){c.beginPath();c.roundRect(x,y,w,h,r);c.fillStyle=fill;c.fill();}
// tapered capsule from (x1,y1) radius r1 to (x2,y2) radius r2 (union of two discs + tangent quad)
function capsulePath(c,x1,y1,r1,x2,y2,r2){
  const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy)||1e-6,a=Math.atan2(dy,dx),s=Math.asin(clamp((r1-r2)/L,-1,1));
  const t1=a+Math.PI/2+s,t2=a-Math.PI/2-s;
  c.moveTo(x1+r1*Math.cos(t1),y1+r1*Math.sin(t1));c.arc(x1,y1,r1,t1,t2+Math.PI*2,false);c.arc(x2,y2,r2,t2,t1,false);c.closePath();}
function capsule(c,x1,y1,r1,x2,y2,r2,fill){c.beginPath();capsulePath(c,x1,y1,r1,x2,y2,r2);c.fillStyle=fill;c.fill('nonzero');}
// smooth closed blob through points (quadratic midpoints)
function blob(c,pts,fill){const n=pts.length;c.beginPath();const m=(i)=>[(pts[i%n][0]+pts[(i+1)%n][0])/2,(pts[i%n][1]+pts[(i+1)%n][1])/2];
  let s=m(n-1);c.moveTo(s[0],s[1]);for(let i=0;i<n;i++){const e=m(i);c.quadraticCurveTo(pts[i][0],pts[i][1],e[0],e[1]);}c.closePath();c.fillStyle=fill;c.fill();}
function path(c,fn,fill){c.beginPath();fn(c);c.closePath();c.fillStyle=fill;c.fill();}
// clip helper: draw fn clipped to path
function clipTo(c,pathFn,draw){c.save();c.beginPath();pathFn(c);c.clip();draw();c.restore();}
// flat ukiyo-e cloud band (kasumi): long rounded bar with square-stepped lobes
function kasumi(c,x,y,w,h,fill,seed){const r=mulberry(seed||1);c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,h/2);c.fill();
  let k=x+h*0.6;while(k<x+w-h*1.2){const lw=h*(1.2+r()*2.2);c.beginPath();c.roundRect(k,y-h*0.55,lw,h*0.9,h*0.45);c.fill();k+=lw+h*(0.8+r()*2.5);}}
// seigaiha pattern fill in rect (clip by caller)
function seigaiha(c,x0,y0,w,h,R,cA,cB){for(let row=0;row*R*0.5<h+R;row++){const y=y0+row*R*0.5,off=(row%2)*R;for(let x=x0-R*2+off;x<x0+w+R*2;x+=R*2){for(let k=4;k>=1;k--){circ(c,x,y,R*k/4,k%2?cA:cB);}}}}
function asanoha(c,x0,y0,w,h,s,col){c.strokeStyle=col;c.lineWidth=Math.max(1,s*0.06);c.beginPath();const H=s*Math.sqrt(3)/2;
  for(let y=y0-H;y<y0+h+H;y+=H){const off=(Math.round((y-y0)/H)%2)?s/2:0;for(let x=x0-s+off;x<x0+w+s;x+=s){c.moveTo(x,y);c.lineTo(x+s,y);c.moveTo(x,y);c.lineTo(x+s/2,y+H);c.moveTo(x+s,y);c.lineTo(x+s/2,y+H);c.moveTo(x+s/2,y+H/3);c.lineTo(x,y);c.moveTo(x+s/2,y+H/3);c.lineTo(x+s,y);c.moveTo(x+s/2,y+H/3);c.lineTo(x+s/2,y+H);}}c.stroke();}
G.K = {P,mulberry,hash,clamp,lerp,inv,eio,eo,ei,eback,spring,twos,D2R,poly,rect,circ,ell,rrect,capsule,capsulePath,blob,path,clipTo,kasumi,seigaiha,asanoha};
})(typeof window!=='undefined'?window:globalThis);
