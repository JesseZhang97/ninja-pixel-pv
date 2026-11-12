// env3.js — v2 sets for the re-staged climax: low-angle castle, ridge-line against the moon, castle attic (beams + moon shafts)
(function(G){
const {P,mulberry,clamp,lerp,poly,rect,circ}=G.K; const E=G.E; const W=1920,H=1080, g5=v=>Math.round(v/5)*5;
// background zoom: draw a set scaled about (cx,cy) — sets are vector fills snapped to the palette afterwards; sprites are never scaled
E.zoom=(c,z,cx,cy,fn)=>{ c.save(); c.translate(960,540); c.scale(z,z); c.translate(-cx,-cy); fn(); c.restore(); };
// low angle on the castle: the keep towers over the frame, foreground eave cuts the top-left corner (parallax)
E.castleLow=(c,t,o={})=>{ const sn=o.snow, dy=g5(o.tilt||0);
  rect(c,0,0,W,H,'#1C2238'); E.stars(c,t,201,80,1080,['#F2E8D5','#4A5378']); E.moon(c,o.moonX||1450,220+dy*0.2,150,{});
  c.save(); c.translate(0,dy*0.4); E.castle(c,t,1050,1420,2.6,{snow:sn,banners:null}); c.restore();
  // stone wall base filling the bottom
  c.save(); c.translate(0,dy); poly(c,[[-50,1080],[-50,960],[1970,900],[1970,1080]],'#43475A'); c.fillStyle='#2E3756'; for(let x=0;x<1960;x+=90) c.fillRect(x,930-x*0.03,6,160); rect(c,-50,950,2100,10,sn?'#F2E8D5':'#565C70'); c.restore();
  // foreground eave (near, fast parallax)
  c.save(); c.translate(g5(-(o.par||0)),dy*1.6); poly(c,[[-100,-20],[760,-20],[620,120],[-100,250]],'#0E1020'); for(let x=-80;x<700;x+=40) rect(c,x,150-x*0.18,14,40,'#1C2238'); c.restore();
};
// ridge-line silhouette against a huge moon (figures stand on y=ridge)
E.ridgeMoon=(c,t,o={})=>{ const ry=o.ridge||930;
  rect(c,0,0,W,H,'#1C2238'); E.stars(c,t,211,70,700,['#F2E8D5','#4A5378','#EBA9A5']); E.moon(c,o.moonX||960,o.moonY||560,o.moonR||460,{});
  E.dither(c,0,ry-200,W,200,'#2E3756',f=>f*0.25);
  rect(c,-20,ry,W+40,H-ry,'#0E1020'); rect(c,-20,ry-10,W+40,12,'#0E1020');
  for(const ex of [60,1800]) poly(c,[[ex,ry],[ex+30,ry-80],[ex+80,ry-110],[ex+60,ry-50],[ex+90,ry]],'#0E1020');
  if(o.snow) E.snowCap(c,-20,ry-8,W+40,9);
};
// castle attic: heavy beams, moonlight shafts through the slats, candle, optional burning scroll on the back wall
E.attic=(c,t,o={})=>{ const cam=g5(o.cam||0);
  rect(c,0,0,W,H,'#2A1E1A');
  c.save(); c.translate(-cam*0.4,0);
  // back wall planks + slat window with moon shafts
  c.fillStyle='#3A2A22'; for(let x=-200;x<2400;x+=120) c.fillRect(x,0,8,H);
  for(let k=0;k<4;k++){ const sx=200+k*520; rect(c,sx,140,180,120,'#1C2238'); for(let j=0;j<5;j++) rect(c,sx+j*40,140,10,120,'#3A2A22');
    E.dither(c,sx-40,260,300,670,'#7A4B34',f=>0.18+0.1*(1-f)); }
  if(o.scroll){ o.scroll(c,t); }
  c.restore();
  // floor
  rect(c,0,930,W,150,'#4A2A1C'); c.fillStyle='#3A2A22'; for(let x=-((cam*0.9)%160);x<W;x+=160) c.fillRect(g5(x),930,6,150); rect(c,0,926,W,8,'#7A4B34');
  // mid beams
  c.save(); c.translate(-cam*0.8,0); rect(c,-200,360,2600,60,'#4A2A1C'); rect(c,-200,360,2600,10,'#7A4B34'); for(const x of [100,900,1700,2500]){ rect(c,x,0,70,930,'#4A2A1C'); rect(c,x+50,0,20,930,'#3A2A22'); } c.restore();
  // candle (warm)
  if(o.candle!==false){ const cx=g5(1500-cam*0.8); rect(c,cx,860,20,70,'#F2E8D5'); const fl=Math.floor(t*12)%2; rect(c,cx+5,830-fl*5,10,30,'#D9A441'); rect(c,cx+7,840,6,15,'#FFF8EC'); }
};
// foreground beam passing in front (parallax), drawn last
E.atticFG=(c,t,cam)=>{ const x=g5(((-cam*1.8)%2600+2600)%2600-400); rect(c,x,-20,110,1120,'#140E0C'); rect(c,x+90,-20,20,1120,'#2A1E1A'); };
G.E=E;
})(window);
