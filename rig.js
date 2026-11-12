// rig.js — "Jay" ninja cut-out rig. One model, drawn from parts with pivots; every shot uses this, never a redraw.
// Model units: 350 u = 1.75 m (200 u/m). Ground at y=0 under the pelvis. Angles in degrees, 0 = straight down,
// positive = toward the facing direction. Views: 'side' and 'q' (three-quarter). face: +1 right, -1 left.
(function(G){
const {P,clamp,lerp,D2R,poly,circ,ell,capsule,capsulePath,blob,mulberry}=G.K;
const U_PER_M=200;
const C0={ // costume palette (on-model)
  hair:P.ink, hairS:'#151826', hairL:'#343A57', skin:P.skin, skinS:P.skinS, skinD:P.skinD,
  jacket:P.ai, jacketS:P.aiS, jacketL:P.aiL, collar:P.paper, collarS:P.paper2,
  pants:P.ai, pantsS:P.aiS, wrap:'#24305A', wrapS:'#1A2342', strap:P.ink,
  boot:P.grey, bootS:P.greyS, sole:P.ink, belt:P.ink, beltK:P.shu,
  guard:'#24305A', guardS:'#1A2342', scarf:P.shu, scarfS:P.shuS, mask:P.shu, maskS:P.shuS,
  saya:P.ink, sayaS:'#0F121D', tsuba:P.ochre, ito:P.ink, itoK:P.shu, blade:'#DCD8CE', bladeS:'#AFAAA0', eye:P.ink, brow:P.ink
};
function palette(o){ if(!o) return C0; if(typeof o==='string'){const p={};for(const k in C0)p[k]=o;return p;} return Object.assign({},C0,o); }
function v(f,deg,len,qz){const a=deg*D2R;return [f*Math.sin(a)*len*(qz||1),Math.cos(a)*len];}
// shaded capsule: base + hard shadow on the back/lower side (offset disc clipped by base)
function sCap(c,A,r1,B,r2,col,colS,sh){ capsule(c,A[0],A[1],r1,B[0],B[1],r2,col); if(!colS) return;
  c.save();c.beginPath();capsulePath(c,A[0],A[1],r1,B[0],B[1],r2);c.clip();
  capsule(c,A[0]+sh[0],A[1]+sh[1],r1,B[0]+sh[0],B[1]+sh[1],r2,colS);c.restore();}
function defaults(p){return Object.assign({view:'side',face:1,x:0,y:0,s:1,pelvis:'auto',lean:0,head:0,
  armN:{sh:5,el:10},armF:{sh:-5,el:10},legN:{hip:0,knee:0,ank:0},legF:{hip:0,knee:0,ank:0},
  handN:'fist',handF:'fist',eyes:'open',mouth:'n',brow:0,mask:false,hood:false,scarf:{t:0,wind:0.25,lift:0,len:1},
  sword:'back',prop:null,pal:null,blink:false,qz:0.82},p);}

// ---------- parts ----------
function drawHead(c,p,C,f){ // local frame: origin = neck pivot; +x = facing (after f mirror), y down
  c.save();c.scale(f,1);
  const side=p.view==='side';
  const _m=c.getTransform(), lp=Math.hypot(_m.a,_m.b); // device px per head unit (low-res when rendered through pixel.js)
  const tiny=lp<0.55; // small sprite: draw eyes as guaranteed 1-2 px blocks so the face never disappears
  const eyeBlk=(x,y)=>{ const w=Math.max(6,2/lp), h=Math.max(3,1.6/lp); c.fillStyle='#0E1020'; c.fillRect(x-w/2,y-h/2,w,h); };
  if(side){
    // nape/neck
    capsule(c,-6,6,10,-2,-16,11,C.skinS);
    // skull + face
    circ(c,-2,-40,34,C.skin);
    poly(c,[[14,-60],[30,-50],[33,-40],[39,-31],[34,-27],[34,-21],[31,-16],[29,-9],[18,-4],[2,-6],[-14,-18],[-2,-40]],C.skin);
    // jaw shadow + ear
    poly(c,[[-14,-18],[2,-6],[18,-4],[12,-12],[-6,-22]],C.skinS);
    ell(c,-6,-32,7,9,0,C.skinS); ell(c,-5,-32,4,6,0,C.skinD);
    // eye (cool, narrow) + mouth
    if(tiny&&p.eyes!=='closed'&&!p.blink){ eyeBlk(23,-33); }
    else if(p.eyes==='closed'||p.blink){c.fillStyle=C.eye;c.fillRect(17,-37,9,Math.max(2.2,1/lp));} 
    else if(p.eyes==='wide'){ell(c,22,-37,4.2,5,0,C.eye);circ(c,23.5,-38.5,1.3,C.white||'#FBF6EA');}
    else {poly(c,[[17,-37],[22,-39.5],[27,-37.5],[25,-35],[19,-35]],C.eye);}
    if(p.mouth==='o') ell(c,30,-19,3,3.6,0,C.skinD);
    else if(p.mouth==='sing') poly(c,[[25,-21],[33,-21],[31,-15],[27,-15]],C.skinD);
    else if(p.mouth==='smirk') poly(c,[[24,-19],[32,-21],[32,-19.5],[25,-17.6]],C.skinD);
    else c.fillStyle=C.skinD, c.fillRect(25,-19.5,7,2);
    // nose shadow
    poly(c,[[33,-36],[39,-31],[34,-28]],C.skinS);
    // hair: heavy shaggy fringe over the brows, sideburn over ear top, nape
    blob(c,[[-42,-44],[-42,-74],[-16,-90],[16,-88],[36,-74],[44,-56],[40,-44]],C.hair); poly(c,[[-20,-80],[6,-84],[22,-76],[-2,-74]],C.hairL||'#343A57');
    poly(c,[[40,-56],[38,-40],[34,-46],[31,-38],[27,-47],[22,-39],[18,-48],[6,-50],[-6,-44],[-10,-28],[-16,-34],[-22,-20],[-28,-30],[-38,-12],[-40,-30],[-40,-50]],C.hair);
    poly(c,[[-14,-80],[14,-80],[2,-74],[-20,-70]],C.hairS);
    poly(c,[[-38,-48],[-24,-56],[-30,-30],[-38,-14]],C.hairS);
    if(p.brow){c.fillStyle=C.brow;c.save();c.translate(22,-42);c.rotate(p.brow*D2R);c.fillRect(-6,-1.5,12,3);c.restore();}
    if(p.mask){ poly(c,[[-6,-33],[12,-32],[30,-35],[41,-31],[37,-22],[33,-12],[24,-3],[4,-2],[-10,-12]],C.mask);
      poly(c,[[-10,-12],[4,-2],[24,-3],[18,-10],[0,-12]],C.maskS); c.fillStyle=C.maskS; c.fillRect(-8,-27,46,2.5); }
  } else { // three-quarter
    capsule(c,-4,6,11,0,-16,12,C.skinS);
    circ(c,-2,-40,36,C.skin);
    poly(c,[[-26,-28],[-22,-14],[-8,-2],[10,-1],[24,-10],[32,-26],[34,-40],[20,-50]],C.skin);
    poly(c,[[-26,-28],[-22,-14],[-8,-2],[4,-3],[-10,-14]],C.skinS); // far-from-light cheek shadow
    ell(c,-31,-32,6,9,0,C.skinS); ell(c,-30,-32,3.5,6,0,C.skinD);
    const ey=-36;
    if(tiny&&p.eyes!=='closed'&&!p.blink){ eyeBlk(2,-33); eyeBlk(25,-33); }
    else if(p.eyes==='closed'||p.blink){c.fillStyle=C.eye;c.fillRect(-4,ey,11,Math.max(2.4,1/lp));c.fillRect(20,ey,8,Math.max(2.2,1/lp));} 
    else if(p.eyes==='wide'){ell(c,1,ey,4.6,5.4,0,C.eye);ell(c,24,ey,3.4,5,0,C.eye);circ(c,2.5,ey-2,1.4,'#FBF6EA');circ(c,25,ey-2,1.1,'#FBF6EA');}
    else {poly(c,[[-4,ey],[2,ey-3],[8,ey-0.5],[6,ey+2.4],[-2,ey+2.2]],C.eye);poly(c,[[20,ey-0.5],[25,ey-2.6],[29,ey-0.4],[27,ey+2],[21,ey+2]],C.eye);}
    poly(c,[[24,-34],[30,-22],[22,-21]],C.skinS); // nose
    if(p.mouth==='o') ell(c,15,-12,3.4,4,0,C.skinD);
    else if(p.mouth==='sing') poly(c,[[9,-15],[21,-15],[18,-9],[11,-9]],C.skinD);
    else if(p.mouth==='smirk') poly(c,[[9,-12],[21,-14.5],[21,-12.6],[10,-10.5]],C.skinD);
    else {c.fillStyle=C.skinD;c.fillRect(10,-13,10,2.2);} 
    blob(c,[[-44,-42],[-40,-74],[-12,-92],[22,-88],[42,-70],[44,-50],[36,-42]],C.hair); poly(c,[[-14,-82],[12,-86],[30,-76],[4,-75]],C.hairL||'#343A57');
    poly(c,[[38,-58],[36,-40],[31,-47],[27,-39],[21,-48],[15,-39],[9,-48],[2,-40],[-4,-49],[-12,-42],[-18,-50],[-26,-40],[-30,-20],[-36,-30],[-41,-14],[-42,-50]],C.hair);
    poly(c,[[-10,-84],[18,-80],[4,-74],[-22,-72]],C.hairS);
    poly(c,[[-42,-50],[-30,-58],[-34,-28],[-41,-14]],C.hairS);
    if(p.brow){c.fillStyle=C.brow;c.save();c.translate(3,-42);c.rotate(p.brow*D2R);c.fillRect(-7,-1.6,13,3.2);c.restore();}
    if(p.mask){ poly(c,[[-27,-28],[-6,-30],[24,-33],[35,-30],[30,-14],[20,-3],[0,1],[-18,-6],[-26,-16]],C.mask);
      poly(c,[[-26,-16],[-18,-6],[0,1],[-2,-8],[-16,-12]],C.maskS); c.fillStyle=C.maskS; c.fillRect(-27,-26,62,2.5); }
  }
  c.restore();
}
function drawHand(c,type,C,f,ang,r){ // at current origin, rotated along forearm
  c.save();c.rotate(ang);c.scale(f,1);
  if(type==='open'){ blob(c,[[-r*0.8,-r*0.2],[r*0.9,-r*0.3],[r*1.05,r*1.4],[r*0.2,r*1.9],[-r*0.75,r*1.3]],C.skin); poly(c,[[r*0.8,0],[r*1.6,r*0.4],[r*1.2,r*0.8]],C.skin); poly(c,[[-r*0.75,r*1.0],[r*0.2,r*1.9],[-r*0.2,r*1.2]],C.skinS); }
  else if(type==='point'){ circ(c,0,r*0.5,r*0.9,C.skin); capsule(c,0,r*0.8,r*0.32,r*0.2,r*2.3,r*0.3,C.skin); circ(c,-r*0.2,r*0.8,r*0.5,C.skinS); }
  else if(type==='seal'){ circ(c,0,r*0.5,r*0.9,C.skin); capsule(c,0,r*0.3,r*0.34,0,-r*1.6,r*0.3,C.skin); capsule(c,r*0.3,r*0.3,r*0.3,r*0.3,-r*1.4,r*0.28,C.skinS);}
  else { circ(c,0,r*0.6,r*0.95,C.skin); poly(c,[[-r*0.9,r*0.6],[r*0.2,r*1.55],[-r*0.6,r*1.2]],C.skinS); }
  c.restore();
}
function drawFoot(c,A,ang,f,C,s){ // A ankle (px space), boot as wedge along +x
  c.save();c.translate(A[0],A[1]);c.rotate(ang*D2R*f);c.scale(f,1);
  poly(c,[[-14,-14],[10,-14],[26,-6],[34,2],[34,8],[-16,8],[-17,-6]],C.boot);
  poly(c,[[-16,4],[34,4],[34,8],[-16,8]],C.sole);
  poly(c,[[-17,-6],[-14,-14],[-4,-14],[-6,4],[-16,4]],C.bootS);
  c.fillStyle=C.bootS;c.fillRect(22,-6,2.4,10); // tabi split
  c.restore();
}
function scarfPts(N,A,p,f,t){ const sc=p.scarf||{}; const L=(sc.len||1)*180, wind=sc.wind==null?0.25:sc.wind, lift=sc.lift||0;
  const pts=[A.slice()]; let ang=-f*(lerp(8,82,wind)+lift); // from down, toward back
  let x=A[0],y=A[1];
  for(let k=1;k<=N;k++){ const w=Math.sin((sc.t||t||0)*7.0-k*0.75)*lerp(6,22,wind)*(k/N)+Math.sin((sc.t||0)*3.1-k*0.4)*6*wind;
    const a=(ang+ -f*w*0+ w)*D2R; const seg=L/N; x+=Math.sin(a)*seg; y+=Math.cos(a)*seg; pts.push([x,y]); ang*= lerp(0.86,1.0,clamp(wind/0.6)); }
  return pts; }
function drawScarfTail(c,p,C,f,A){ const N=14,pts=scarfPts(N,A,p,f,0);
  for(let k=0;k<N;k++){ const a=pts[k],b=pts[k+1],w0=lerp(16,8,k/N),w1=lerp(16,8,(k+1)/N);
    const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
    const flip=Math.sin(((p.scarf&&p.scarf.t)||0)*7.0-k*0.75); // twist sign -> show back face (shadow)
    poly(c,[[a[0]+nx*w0,a[1]+ny*w0],[b[0]+nx*w1,b[1]+ny*w1],[b[0]-nx*w1,b[1]-ny*w1],[a[0]-nx*w0,a[1]-ny*w0]],flip>0.35?C.scarfS:C.scarf);
  }
  const e=pts[N],d=pts[N-1]; const dx=e[0]-d[0],dy=e[1]-d[1],L=Math.hypot(dx,dy)||1; // forked tail end
  poly(c,[[e[0]-dy/L*8,e[1]+dx/L*8],[e[0]+dx/L*18-dy/L*4,e[1]+dy/L*18+dx/L*4],[e[0],e[1]],[e[0]+dx/L*16+dy/L*6,e[1]+dy/L*16-dx/L*6],[e[0]+dy/L*8,e[1]-dx/L*8]],C.scarf);
}
function drawSword(c,H,ang,C,len,f,sheathed){ // H = grip point, blade along ang (deg from down, signed with f)
  c.save();c.translate(H[0],H[1]);c.rotate(-ang*D2R*f);c.scale(f,1); // local +y = blade direction
  // handle (tsuka) goes -y from grip, blade +y
  c.fillStyle=C.ito;c.beginPath();c.roundRect(-5,-34,10,44,3);c.fill();
  for(let k=0;k<4;k++) poly(c,[[0,-28+k*10],[4,-23+k*10],[0,-18+k*10],[-4,-23+k*10]],C.itoK);
  ell(c,0,12,14,4,0,C.tsuba);
  if(sheathed){ c.fillStyle=C.saya;c.beginPath();c.roundRect(-6,15,12,len,[2,2,6,6]);c.fill(); c.fillStyle=C.sayaS;c.fillRect(1.5,15,4.5,len-4); c.fillStyle=C.tsuba;c.fillRect(-6,15+len*0.18,12,4); }
  else { poly(c,[[-4,15],[4,15],[4,15+len-22],[-3,15+len],[-4,15+len-24]],C.blade); poly(c,[[0.5,15],[4,15],[4,15+len-22],[0.5,15+len-6]],C.bladeS); }
  c.restore();
}
// ---------- full figure ----------
function drawJay(c,pin,t){ const p=defaults(pin), C=palette(p.pal), f=p.face, qz=p.view==='q'?p.qz:1;
  c.save(); c.translate(p.x,p.y); c.scale(p.s,p.s);
  if(p.pelvis==='auto'){ const low=L=>{const a1=L.hip,a2=L.hip-L.knee;const ky=84*Math.cos(a1*D2R),ay=ky+78*Math.cos(a2*D2R);return Math.max(ky+17,ay+9);};
    p.pelvis=Math.max(low(p.legN),low(p.legF))+6-(p.air||0); }
  const pel=[0,-p.pelvis];
  const hipN=[p.view==='q'?-8*f:3*f,pel[1]-6], hipF=[p.view==='q'?12*f:-3*f,pel[1]-6];
  const T=v(f,180+p.lean,96,qz); const neck=[pel[0]+T[0],pel[1]+T[1]];
  const sh=(k)=>[pel[0]+T[0]*k,pel[1]+T[1]*k];
  const shoN=(()=>{const b=sh(0.86);return p.view==='q'?[b[0]-22*f,b[1]+2]:[b[0]-2*f,b[1]];})();
  const shoF=(()=>{const b=sh(0.86);return p.view==='q'?[b[0]+16*f,b[1]-1]:[b[0]+2*f,b[1]];})();
  function leg(L,hip,far){ const a1=L.hip, a2=L.hip-L.knee; const K=[hip[0]+v(f,a1,84,qz)[0],hip[1]+v(f,a1,84,qz)[1]]; const A=[K[0]+v(f,a2,78,qz)[0],K[1]+v(f,a2,78,qz)[1]];
    const pc=far?{pants:C.pantsS,pantsS:C.wrapS,wrap:C.wrapS,wrapS:C.wrapS,boot:C.bootS,bootS:C.bootS,sole:C.sole,strap:C.strap}:C;
    sCap(c,hip,25,K,17,pc.pants,pc.pantsS,[-5*f,3]);
    sCap(c,[K[0]+v(f,a2,6)[0],K[1]+v(f,a2,6)[1]],15,A,10.5,pc.wrap,pc.wrapS,[-4*f,0]);
    for(let k=1;k<=3;k++){const q=0.25+k*0.18;const X=lerp(K[0],A[0],q),Y=lerp(K[1],A[1],q);c.save();c.translate(X,Y);c.rotate(-a2*D2R*f);c.fillStyle=pc.strap;c.fillRect(-14+k*0.6,-1.2,28-k*1.2,2.4);c.restore();}
    drawFoot(c,A,(a2+(L.ank||0))*0+ (L.ank||0)+ (Math.abs(a2)>40? -a2*0.5:0),f,{boot:pc.boot,bootS:pc.bootS,sole:pc.sole},1);
    return {K,A}; }
  function arm(Ar,sho,far,hand){ const a1=p.lean+Ar.sh, a2=a1+Ar.el; const E=[sho[0]+v(f,a1,58,qz)[0],sho[1]+v(f,a1,58,qz)[1]]; const W=[E[0]+v(f,a2,52,qz)[0],E[1]+v(f,a2,52,qz)[1]];
    const jc=far?C.jacketS:C.jacket, js=far?C.wrapS:C.jacketS, gc=far?C.guardS:C.guard, gs=far?C.guardS:C.guardS;
    sCap(c,sho,15.5,E,12.5,jc,js,[-4*f,2]);
    sCap(c,E,11.5,W,9.5,gc,gs,[-3*f,0]);
    c.save();c.translate(W[0],W[1]); drawHand(c,hand,far?Object.assign({},C,{skin:C.skinS,skinS:C.skinD}):C,f,-a2*D2R*f,10); c.restore();
    return {E,W,a2}; }
  const res={};
  // far arm & far leg
  res.armF=arm(p.armF,shoF,true,p.handF);
  res.legF=leg(p.legF,hipF,true);
  // scarf tail (behind body)
  const sA=[neck[0]-10*f,neck[1]+8]; drawScarfTail(c,p,C,f,sA);
  // sword on back
  if(p.sword==='back'){ const g=[neck[0]-10*f,neck[1]-16]; drawSword(c,g,-(48-p.lean),C,128,f,true); }
  // near leg
  res.legN=leg(p.legN,hipN,false);
  // torso (jacket) in torso frame
  c.save(); c.translate(pel[0],pel[1]); c.rotate(p.lean*D2R*f); c.scale(f,1);
  const W2=p.view==='q'?1.18:1;
  if(p.view==='q'){
    poly(c,[[-38,12],[-40,-30],[-36,-78],[-26,-96],[18,-96],[30,-80],[34,-30],[36,12]],C.jacket);
    poly(c,[[-38,12],[-40,-30],[-36,-78],[-26,-96],[-12,-96],[-22,-60],[-24,12]],C.jacketS);
    poly(c,[[-6,-96],[10,-96],[22,-70],[12,-50],[2,-60]],C.collar); poly(c,[[-6,-96],[2,-60],[-2,-58],[-12,-90]],C.collarS);
    poly(c,[[-14,-96],[2,-58],[12,-50],[6,-46],[-18,-86]],C.jacketL);
    c.fillStyle=C.belt;c.fillRect(-39,-22,74,16); c.fillStyle=C.beltK;c.fillRect(6,-22,5,16); poly(c,[[8,-8],[14,10],[6,10]],C.beltK);
    if(p.hood||true) blob(c,[[-30,-92],[-10,-104],[16,-100],[-4,-90]],C.jacketS);
  } else {
    poly(c,[[-24,12],[-26,-40],[-22,-84],[-12,-96],[14,-96],[22,-80],[26,-40],[28,12]],C.jacket);
    poly(c,[[-24,12],[-26,-40],[-22,-84],[-12,-96],[-4,-96],[-10,-50],[-8,12]],C.jacketS);
    poly(c,[[8,-96],[18,-92],[24,-74],[14,-66]],C.collar); poly(c,[[12,-94],[16,-70],[22,-74]],C.collarS);
    c.fillStyle=C.belt;c.fillRect(-26,-22,54,16); c.fillStyle=C.beltK;c.fillRect(18,-22,5,16);
    blob(c,[[-26,-90],[-14,-104],[8,-102],[-6,-90]],C.jacketS);
  }
  c.restore();
  // scarf wrap at neck
  c.save();c.translate(neck[0],neck[1]+6);c.scale(f,1); blob(c,[[-22,-6],[-6,-14],[18,-10],[22,4],[2,10],[-20,6]],C.scarf); poly(c,[[-20,6],[2,10],[22,4],[4,2]],C.scarfS); c.restore();
  // head
  c.save(); c.translate(neck[0],neck[1]-2); c.rotate((p.head+p.lean*0.4)*D2R*f); drawHead(c,p,C,1*f<0?-1:1); c.restore();
  // props held in near hand are drawn by caller using res; near arm
  res.armN=arm(p.armN,shoN,false,p.handN);
  res.neck=neck; res.pel=pel;
  c.restore();
  // convert key points to world px for props
  const tw=q=>[p.x+q[0]*p.s,p.y+q[1]*p.s];
  return {handN:tw(res.armN.W),handF:tw(res.armF.W),angN:res.armN.a2,angF:res.armF.a2,neck:tw(neck),head:tw([neck[0]+f*10,neck[1]-40]),s:p.s,f};
}
G.RIG={drawJay,drawSword,drawHead,palette,C0,U_PER_M};
})(typeof window!=='undefined'?window:globalThis);
