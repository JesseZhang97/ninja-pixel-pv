// film9_patch.js — v9: (1) sprite ground anchor fixed at the root (every set, every animation): soles now land on the world foot point,
// so contact shadows (centred on the foot point) sit under and overlap the soles in every shot; (2) the duel's thin bamboo stalk moved out of the
// two-shot action area; (3) zen-room incense smoke is a thin wavering wisp that fades out within ~25 art px. Logs shadows for the sole audit.
(function(G){
const {P,mulberry,clamp,lerp,inv,eio,eo,ei,poly,rect,circ,ell,blob,capsule,rrect}=G.K; const E=G.E, E4=G.E4, E5=G.E5, E6=G.E6, E7=G.E7, F=G.FILM, SPR=G.SPR, D=G.DATA, PX=G.PX; const {g5,J,Ja,seq,fxW,poof,bell}=F; const pj=E6.pj, Q=E6.Q; const W=1920,H=1080; const C=E4.C;
F.NEW9=[]; const shot9=(id,t0,t1,fn,tr)=>{ F.NEW9.push(id); F.SHOTS=F.SHOTS.filter(s=>s.id!==id); F.shot(id,t0,t1,fn,tr); };
const S=(set)=>(c,anim,t,t0,x,y,face,remap)=>Ja(c,anim,t,t0,x,y,face,remap,set); const Hs=S('H'), Ls=S('L'), Ms=S('M'), Ks=S('K'), KL=S('KL'), XL=S('XL'), XLs=XL, Ds=S('D'), DX=S('DX');
const sh=(c,x,y,w,col)=>E6.shadow(c,x,y,w,col);
const fl=(t)=>0.92+0.08*Math.sin(t*19)*Math.sin(t*5.3);
const SD=SPR.data.sets; const getShot=id=>F.SHOTS.find(s=>s.id===id);

// ======================= (1) ROOT FIX — sprite ground anchor =======================
// Cause (measured on the sprite data): every character animation was authored with 1–3 transparent padding rows under the soles, and
// draw() places the anchor row oy (not the sole row) on the world foot point: M/K tiers soles 1 px above it, L/H/KL/T 2 px, DX/XL/KXL 3 px.
// E6.shadow centres its ellipse on the foot point (+1 world row), so soles floated 1.5–3.5 art px above the shadow centre (DX duel worst).
// Fix: each animation's anchor row becomes its ground row = the most common lowest-opaque row among its grounded frames (frames within 4 px
// of the old anchor; airborne run/jump frames and blades hanging below the feet don't move it). Applied once to the data, before any draw,
// so it holds for every shot and every sprite; FX and the disembodied hand inserts are left alone.
const lowRow=fr=>{ let y=fr.length-1; while(y>=0&&!/[^.]/.test(fr[y])) y--; return y; };
F.GROUND={}; F.GROUND_FIX=[];
for(const [set,anims] of Object.entries(SD)){ if(set==='FX') continue; for(const [an,a] of Object.entries(anims)){
  const near=a.frames.map(lowRow).filter(l=>l<=a.oy&&l>=a.oy-4); if(!near.length) continue; const cnt={}; near.forEach(l=>cnt[l]=(cnt[l]||0)+1);
  const g=+Object.entries(cnt).sort((p,q)=>q[1]-p[1]||q[0]-p[0])[0][0]; const d=a.oy-g; F.GROUND[set+'/'+an]=g; if(d>0){ a.v9dy=d; a.oy=g; F.GROUND_FIX.push(set+'/'+an+':'+d); } } }
// props held in a hand are placed relative to the old anchor: the FX bell drawn right after its holder moves down with the holder
{ const _d=SPR.draw; let last=null; const fr=F.fxReset; F.fxReset=function(){ last=null; return fr.apply(this,arguments); };
  SPR.draw=function(c,set,anim,k,wx,wy,face,remap,dx,dy){ if(set==='FX'){ if(anim==='bell'&&last&&last.d){ const m=c.getTransform(); const lx=m.a*wx+m.c*wy+m.e; if(Math.abs(lx-last.x)<60) dy=(dy||0)+last.d; } last=null; return _d.call(this,c,set,anim,k,wx,wy,face,remap,dx,dy); }
    const r=_d.call(this,c,set,anim,k,wx,wy,face,remap,dx,dy); last={d:SD[set][anim].v9dy||0,x:r[0]}; return r; }; }
// every contact shadow is recorded per frame (centre in low-res px): used by the auto contact shadow below and by the sole audit
F.SHF=[]; { const fr=F.fxReset; F.fxReset=function(){ F.SHF=[]; return fr.apply(this,arguments); };
  const s0=E6.shadow; E6.shadow=(c,x,y,w,col)=>{ s0(c,x,y,w,col); const m=c.getTransform(); const e={x:m.a*g5(x)+m.e, y:m.d*g5(y+5)+m.f, rx:m.a*w, ry:m.d*Math.max(10,w*0.16), col:col||'#0E1020'}; F.SHF.push(e); if(F.SHLOG) F.SHLOG.push(e); }; }
// AUTO CONTACT SHADOW: older shots (v2–v4 izakaya street, storeroom, home room, snow garden, procession, attic, roofs, film-strip memory) drew
// grounded characters with no contact shadow at all. Any grounded character frame that has no contact shadow under it now gets one, drawn
// immediately before the sprite (so it sits on the ground, under the feet): centred on the foot point like E6.shadow, as wide as the feet
// + 2 px each side, coloured as the ground under the feet darkened to 45% (palette-snapped later). Not drawn for: seated/behind-counter
// animations, the ink-scroll illustrations (S16, S17, S36 scroll), airborne frames, feet below the frame, hand inserts and FX.
F.SEATED=new Set(['m_stir','m_nod','m_serve','m_startle','r1_drink','r2_laugh','chew','eat','react_seat','glance','m_smile','tap','x_seat_resolve','cat_sit','hands_master','hands_jay','hands_side']);
F.NOAUTO_SHOTS=new Set(['S16','S17']); F.AUTOSH_LOG=[];
F.isGhost=(id,set,anim,remap)=>remap==='paper'||remap==='silL'||((id==='S07'||id==='S08')&&set==='L'&&anim==='look'); // shoji shadow-play runners; the 幕府 apparition
F.isScroll=(id,t)=>id==='S16'||id==='S17'||(id==='S36'&&t>=128.55&&t<131.5);
{ const feet=(set,anim,k)=>{ const a=SD[set][anim], fr=a.frames[k]; let x0=1e9,x1=-1; for(let y=Math.max(0,a.oy-2);y<=Math.min(fr.length-1,a.oy);y++){ const r=fr[y]; for(let x=0;x<r.length;x++) if(r[x]!=='.'){ if(x<x0)x0=x; if(x>x1)x1=x; } } return x1<0?null:[x0,x1]; };
  const _d=SPR.draw; SPR.draw=function(c,set,anim,k,wx,wy,face,remap,dx,dy){
    if(set!=='FX'&&!F.SEATED.has(anim)&&!dx&&!dy&&F.GROUND[set+'/'+anim]!=null&&remap!=='fade3'){ const a=SD[set][anim], fr=a.frames[k]; const m=c.getTransform(); const lx=m.a*wx+m.c*wy+m.e, ly=m.b*wx+m.d*wy+m.f;
      const cur=F.CUR, id=cur&&cur.id, T=F.TNOW;
      const lowF=lowRow(fr); const grounded=lowF>=a.oy; const scroll=F.isScroll(id,T)||F.isGhost(id,set,anim,remap);
      if(grounded&&!scroll&&ly<214&&ly>0&&m.a>0){ const near=F.SHF.filter(h=>Math.abs(h.x-lx)<=Math.max(8,h.rx*0.7)&&Math.abs((h.y-0.5)-Math.round(ly))<=4); const has=near.length>0;
        // wide stances: if a foot sticks out past the shadow drawn for this character, the shadow is widened to the feet span (same centre row and colour)
        if(has){ const ft=feet(set,anim,k); if(ft){ const ox=face<0?(a.w-1-a.ox):a.ox; const X0=face<0?a.w-1-ft[1]:ft[0], X1=face<0?a.w-1-ft[0]:ft[1]; const fx0=Math.round(lx)-ox+X0, fx1=Math.round(lx)-ox+X1;
            const cov=near.some(h=>fx0>=h.x-h.rx+1&&fx1<=h.x+h.rx-1); if(!cov){ const h=near[0]; const cxl=(fx0+fx1+1)/2; const wcx=wx+(cxl-lx)/m.a; E6.shadow(c,wcx,wy,Math.round(((fx1-fx0+1)/2+2)/m.a),h.col); } } }
        if(!has){ const ft=feet(set,anim,k); if(ft){ const wpx=(ft[1]-ft[0]+1)+4; let col='#0E1020';
            try{ const p=c.getImageData(Math.round(lx),Math.round(ly)+1,1,1).data; if(p[3]>0) col='#'+[p[0],p[1],p[2]].map(v=>Math.round(v*0.45).toString(16).padStart(2,'0')).join(''); }catch(e){}
            const ox=face<0?(a.w-1-a.ox):a.ox, cx=face<0?(a.w-1-(ft[0]+ft[1])/2):(ft[0]+ft[1])/2; const wcx=wx+(cx-ox)/m.a;
            E6.shadow(c,wcx,wy,Math.round(wpx/2/m.a),col); if(F.SHLOG) F.AUTOSH_LOG.push(id+' '+set+'/'+anim); } } } }
    return _d.call(this,c,set,anim,k,wx,wy,face,remap,dx,dy); }; }

// ======================= (2) duel S19: the cut stalk moves out of the two-shot =======================
// It stood at X 0.05 (screen centre) between the fighters until the push-off cut; now it stands at the left edge (X -2.65, Z 2.6, screen x≈145),
// behind and clear of Jay's guard reach; the cut flash + falling top follow it there.
{ const BT=n=>64.157+n*0.5571; const HS=[BT(4),BT(5),BT(6),BT(11),BT(13)]; const hitstop=t=>{ for(const h of HS){ if(t>=h&&t<h+3/30) return h; } return t; };
  const KXL=E6.camFor('XL',1010), KLd=E6.camFor('L',950); const xlX=X=>g5(960+X*405); const lX=X=>g5(960+X*270);
  const bigText=(c,txt,wx,wy,scale,col,shadow)=>{ c.save(); c.setTransform(1,0,0,1,0,0); PX.text(c,txt,Math.round(wx/5),Math.round(wy/5),{scale,color:col,shadow,align:'center'}); c.restore(); };
  const s19=getShot('S19'); let src=s19.fn.toString(); const rep=(a,b)=>{ if(!src.includes(a)) throw new Error('S19v9 miss '+a.slice(0,60)); src=src.split(a).join(b); };
  rep("[bx,by]=pj(KXL,0.05,0,Zs)","[bx,by]=pj(KXL,-2.65,0,Zs)");
  // the drop-in: during the fall he holds the airborne land frame 0 (the crouch frames only on contact)
  rep("Ls(c,'land',t,64.16,jx,y,1)","J(c,'land',0,jx,y,1,null,'L')");
  // the anchor fix put the soles 2 px lower; the wide establishing ground line moves 2 px up the floor plane (10 world px) so the waiting
  // ronin keeps the 6-px caption safe zone during the 63.97–64.16 dissolve under the S18 lyric
  rep("const fy=g5(KLd.h+KLd.camH*270);","const fy=g5(KLd.h+KLd.camH*270)-10;");
  rep('c.translate(xlX(0.05),g5(fy-450))','c.translate(g5(pj(KXL,-2.65,0,2.6)[0]),g5(pj(KXL,-2.65,0,2.6)[1]-KXL.f/2.6*1.1))');
  shot9('S19',64.16,72.90,eval('('+src+')'),s19.tr); }


// ======================= sole audit follow-ups =======================
// (a) S20 jump pair: the push-off frame (jump 1, feet extended on the ground) was shown for 0.1 s after the rise began (feet 2–11 px above
//     their shadow); it now plays on the ground just before take-off (crouch 0.1 s earlier), the rise starts on the tucked frame.
{ const s20=getShot('S20'); const fn=s20.fn, tr=s20.tr; const KWM=E6.camFor('M',860,{camH:0.25}); const fMd=860, tc=76.603, TA=76.15, HANG=2/30, HP=170, TR=tc-TA, G2=2*HP/(TR*TR), TL=tc+HANG+TR;
  const yAt=t=>{ if(t<=TA) return fMd; if(t<tc) return fMd-HP+0.5*G2*(tc-t)*(tc-t); if(t<tc+HANG) return fMd-HP; const u=t-tc-HANG; return Math.min(fMd,fMd-HP+0.5*G2*u*u); };
  const frameAt=t=>{ if(t<TA-0.1) return 0; if(t<TA) return 1; if(t<tc-0.15) return 2; if(t<tc-0.03) return 3; if(t<tc+HANG+0.05) return 4; if(t<TL-0.12) return 5; return 6; };
  const pose=(c,t,x,face,set)=>{ const y=g5(yAt(t)); const d=fMd-y; sh(c,x,fMd,g5(Math.max(10,35*(1-d/240))),'#0E1020');
    if(t>=TL){ const k=t<TL+3/30?0:1; J(c,'land',k,x,fMd,face,'sil',set); } else J(c,'jump',frameAt(t),x,y,face,'sil',set); };
  shot9('S20',72.90,81.39,(c,t)=>{ if(t<75.9||t>=77.2) return fn(c,t);
    E7.moonField(c,t,KWM,{moon:{x:960,y:380,r:250}});
    const air=t<TA?0:(t<tc?(t-TA)/TR:1), fall=t<tc+HANG?0:Math.min(1,(t-tc-HANG)/TR);
    const xL=t<tc+HANG?lerp(1220,1010,air):lerp(1010,1250,fall), xJ=t<tc+HANG?lerp(700,910,air):lerp(910,690,fall);
    pose(c,t,g5(xL),-1,'K'); pose(c,t,g5(xJ),1,undefined);
    if(t>=TL&&t<TL+0.4){ F.fxW(c,'dust',SPR.frameAt('FX','dust',t,TL),g5(xJ),fMd,1); F.fxW(c,'dust',SPR.frameAt('FX','dust',t,TL),g5(xL),fMd,-1); }
    if(t>=tc&&t<tc+0.1){ circ(c,960,g5(fMd-250),g5(70-(t-tc)*400),'#FFF8EC'); F.light(c,960,fMd-250,320,'#FFE7A8',0.6,{add:true}); }
    F.sparks(c,t,tc,960,fMd-250,7); if(t>=tc&&t<tc+0.45) F.fxW(c,'poof',SPR.frameAt('FX','poof',t,tc),960,g5(fMd-260),1);
    E7.moonFieldFG(c,t,KWM,{}); },tr); }
// (b) the shared somersault timing F.JUMP (S10/S29 car-gap jumps, S34, S40 pupils) took off after 6 ticks but still showed the grounded
//     push-off frame for 3 ticks in the air: those 3 ticks now use the first airborne (tucked) frame.
{ const J0=F.JUMP; if(J0[1][0]==='jump'&&J0[1][1]===1) J0[1]=['jump',2,3]; }
// ======================= (3) zen room: incense smoke =======================
// was 14 stacked 1x3-px dashes rising 72 px (a dashed vertical line); now a 1-px wisp that wavers (two travelling sines, amplitude growing
// with height), steps light→mid→dim grey and breaks up into sparse, slowly drifting dots, gone 25 art px above the burner.
{ const pjz=(K,X,Y,Z)=>{ const z=Math.max(0.3,Z-(K.dz||0)); const s=K.f/z; return [K.vx+X*s, K.h+(K.camH-Y)*s]; };
  const Qz=(c,K,pts,col)=>{ const dz=K.dz||0; if(pts.every(p=>p[2]-dz<=0.05)) return; poly(c,pts.map(p=>{ const [x,y]=pjz(K,p[0],p[1],p[2]); return [g5(x),g5(y)]; }),col); };
  const boxz=(c,K,x0,x1,y0,y1,z0,z1,cf,cs,ct)=>{ const zz=z0-(K.dz||0); if(x1*K.f/zz+K.vx<K.vx||x1<0) Qz(c,K,[[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],cs); if(x0>0) Qz(c,K,[[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1]],cs);
    if(y1<K.camH&&ct) Qz(c,K,[[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],ct); if(y0>K.camH&&ct) Qz(c,K,[[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]],ct); Qz(c,K,[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]],cf); };
  F.wisp=(c,t,x0,y0,gust)=>{ const ph=Math.floor(t*5); for(let j=0;j<26;j++){ const amp=Math.min(1,j/7)*(3+j*0.55);
      const sx=x0+Math.sin(j*0.33-t*2.3)*amp+Math.sin(j*0.12+t*0.8)*amp*0.45+(gust||0)*j*j*0.35;
      if(j>=16&&((j+ph)%2)) continue; if(j>=21&&((j+ph)%3)) continue; rect(c,g5(sx),g5(y0-j*5),5,5,j<11?'#E2D3B8':(j<18?'#B9B6AC':'#9C9A92')); } };
  let src=E6.zen.toString(); const smokeA="for(let k=0;k<14;k++){ const ph=((t*0.3)+k/14)%1;"; const i0=src.indexOf(smokeA); if(i0<0) throw new Error('zen smoke miss');
  const i1=src.indexOf("} }",src.indexOf("'#B9B6AC'); }",i0)); // end of the smoke for-loop
  src=src.slice(0,i0)+"F.wisp(c,t,ix,iy-s*0.12,gust); "+src.slice(src.indexOf("}",src.indexOf("'#B9B6AC'); }",i0)+12)+1);
  src=src.replace(/\bpj\(/g,'pjz(').replace(/\bQ\(/g,'Qz(').replace(/E6\.box\(/g,'boxz(');
  const HW=3.6, ZB=6.3, YC=2.5; const zen9=eval('('+src+')'); E6.zen9=zen9;
  const KZ=E6.camFor('L',930,{vx:960,camH:1.15}); KZ.dz=1.1; const Zj=E6.zOf(KZ,'L'), JX=-0.5, JXZ=g5(960+JX*270), CU=0.08, JY=g5(930-CU*270);
  const cushion=(c)=>{ const P=(X,Y,Z)=>{ const [x,y]=pj(KZ,X,Y,Z); return [g5(x),g5(y)]; }; const x0=JX-0.34, x1=JX+0.34, z0=Zj-0.3, z1=Zj+0.36;
    const [sx,sy]=P(JX-0.06,0,Zj+0.02); ell(c,sx,sy,g5(0.5*270),g5(0.16*270),0,'#46613F'); ell(c,sx+5,sy,g5(0.42*270),g5(0.12*270),0,'#24382A');
    poly(c,[P(x0,CU,z0),P(x1,CU,z0),P(x1,CU,z1),P(x0,CU,z1)],'#D9A441'); poly(c,[P(x0,0,z0),P(x1,0,z0),P(x1,CU,z0),P(x0,CU,z0)],'#8A5A1E');
    poly(c,[P(x0+0.03,CU,z0+0.02),P(x1-0.03,CU,z0+0.02),P(x1-0.03,CU,z0+0.05),P(x0+0.03,CU,z0+0.05)],'#F2D27A');
    for(const X of [x0,x1]){ const [tx,ty]=P(X,CU,z0); rect(c,tx-5,ty-5,10,10,'#A82A26'); }
    // body contact shadow pressed into the cushion top, centred on his foot point (logged for the sole audit)
    E6.shadow(c,JXZ,JY-5,g5(0.28*270),'#8A5A1E'); };
  const seiza=(c,t,tA,tB)=>{ const k=t<tA?0:(t<tB?1:2); cushion(c); J(c,'seiza',k,JXZ,JY,1,null,'H'); };
  const s23=getShot('S23'), s23fn=G.FILM.S23_V6||null;
  const s23old=s23.fn; shot9('S23',86.53,91.05,(c,t)=>{ if(t<88.78) return s23old(c,t); zen9(c,t,KZ,{snow:true}); seiza(c,t,90.2,90.477); F.lightFlat(c,JXZ,JY-230,300,'#FFE7A8',0.1); },s23.tr);
  const o7=getShot('O7'); shot9('O7',16.33,17.18,(c,t)=>{ const gust=inv(16.75,17.0,t)*(1-inv(17.0,17.18,t)); zen9(c,t,KZ,{snow:false,gust}); seiza(c,t,99,99); },o7.tr); }
// current shot time for the per-shot rules above
for(const sh_ of F.SHOTS){ const f=sh_.fn; sh_.fn=function(c,t){ F.TNOW=t; return f.call(this,c,t); }; }
})(window);
