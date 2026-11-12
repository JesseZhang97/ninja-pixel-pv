// film_c.js — ACT III (winter): resolve, infiltration, the castle-roof showdown, the bell comes home
(function(G){
const {P,mulberry,hash,clamp,lerp,inv,eio,eo,ei,twos,poly,rect,circ,capsule,blob}=G.K;
const E=G.E, D=G.DATA, SPR=G.SPR, F=G.FILM; const W=1920,H=1080;
const {g5,seq,J,Ja,fxW,poof,bell,shot}=F;
// S21 81.39–84.27: snow; Jay trudges back to the izakaya alone, footprints behind him
shot('S21',81.39,84.27,(c,t)=>{ const lt=t-81.39; E.facade(c,t,0,{snow:true,silhouette:false}); const x=g5(lerp(560,880,lt/2.88)), y=905;
  for(let px=480;px<x-40;px+=50) rect(c,px,y+5,15,5,'#B9B6AC'); Ja(c,'walk',t,81.39,x,y,1); E.snow(c,t,111,130,{}); },{k:'mosaic',d:0.8});
// S22 84.27–86.53: same counter, now the kamidana hook is empty; he eats without looking up
shot('S22',84.27,86.53,(c,t)=>F.izakaya(c,t,{t0:84.27,cam:[-260,-200,0,2.3],bell:'off',snow:true,jay:{mode:'chew',x:820,y:850,face:1,t0:84.27}}));
// S23 86.53–91.05: seiza by the open shoji (snow garden); eyes open on 「叫做禅」 — resolve
shot('S23',86.53,91.05,(c,t)=>F.room(c,t,{t0:86.53,snow:true,table:false,pan:[0,-60,4.5],jay:(c,t)=>{ const q=t<90.2?['seiza',0]:(t<90.477?['seiza',1]:['seiza',2]); J(c,q[0],q[1],1050,960,1,null,'L');
  // incense curl beside him
  const r=mulberry(3); rect(c,860,920,20,40,P.woodS); for(let k=0;k<5;k++){ const ph=((t*0.4+k/5)%1); rect(c,g5(870+Math.sin(ph*7+k)*20),g5(910-ph*300),5,10,'#E2D3B8'); } }}),{k:'dissolve',d:0.6});
// S24 91.05–93.18: torii tunnel in snow, walking now (resolve, not panic); 「闪过一个画面」= flash of the castle
shot('S24',91.05,93.18,(c,t)=>{ const lt=t-91.05; E.toriiTunnel(c,t,lt*220,{snow:true}); Ja(c,'walk',t,91.05,860,880,1); E.snow(c,t,121,110,{});
  if(t>=92.206&&t<92.206+4/30){ rect(c,0,0,W,H,'#F2E8D5'); E.castle(c,t,960,900,1.3,{wall:'#4A2A1C',roof:'#4A2A1C',stone:'#4A2A1C'}); } });
// S25 93.18–95.43: same corner, snow — this time the dart lands: a sentinel drops
shot('S25',93.18,95.43,(c,t)=>F.corner(c,t,{t0:93.18,tBlow:94.308,snow:true,target:{kind:'stand',tp:94.308+0.5}}));
// S26 95.43–97.53: the castle in snow; Jay runs the outer wall
shot('S26',95.43,97.53,(c,t)=>F.castleShot(c,t,{t0:95.43,snow:true,runner:null,jay:true}));
// S27 97.53–100.94: silent film again — now three shadows ride behind him
shot('S27',97.53,100.94,(c,t)=>F.yamanote(c,t,{riders:[1640,1800,1960],snow:true}),{k:'wipe',d:0.6});
// S28–S29 100.94–109.44: train-roof chase reversed: three shadows chase Jay; his smoke bomb; 「嘿」 somersault over the gap
const PH2=(()=>{ const off=(t)=>((t*1400)%1640); return (870+300-off(108.5-100.94)+16400)%1640; })();
shot('S28',100.94,105.42,(c,t)=>F.trainChase(c,t,{t0:100.94,base:100.94,ph:PH2,jayX:1300,snow:true,
  chase:[{x:300,face:1,remap:'shadow',ph:0.1},{x:520,face:1,remap:'shadow',ph:0.2,throwT:103.2},{x:120,face:1,remap:'far',ph:0.05}],shots:[[103.43,103.9,600,1200,640,true]],slashT:103.25}),{k:'mosaic',d:0.6});
shot('S29',105.42,109.44,(c,t)=>F.trainChase(c,t,{t0:105.42,base:100.94,ph:PH2,jayX:1000,snow:true,throwT:106.3,throwFace:-1,smokeT:106.55,smokeX:600,jumpT:107.92,jumpDX:300,
  chase:[{x:460,face:1,remap:'shadow',ph:0.1,until:107.2},{x:640,face:1,remap:'shadow',ph:0.2,until:107.3},{x:250,face:1,remap:'shadow',ph:0.05,until:107.1}]}));
// S30 109.44–111.66: at the castle wall — the plan (seal), castle looming above
shot('S30',109.44,111.66,(c,t)=>{ E.sky(c,'#1C2238'); E.stars(c,t,41,70,800,['#F2E8D5','#4A5378']); E.moon(c,1500,200,120,{});
  poly(c,[[-100,1080],[-100,760],[600,700],[1400,700],[2000,760],[2000,1080]],'#22382A'); E.castle(c,t,1150,700,1.5,{snow:true,banners:()=>1});
  rect(c,-100,900,2100,200,'#43475A'); c.fillStyle='#2E3756'; for(let x=-100;x<2000;x+=80) c.fillRect(x,900,6,200); rect(c,-100,890,2100,14,'#F2E8D5');
  if(t<110.0) Ja(c,'idle',t,109.44,520,888,1); else Ja(c,'seal',t,110.0,520,888,1); E.snow(c,t,131,110,{}); },{k:'dissolve',d:0.5});
// S31 111.66–113.98: snowy grove — one clean cut (the stalk he will arrange)
shot('S31',111.66,113.98,(c,t)=>{ const lt=t-111.66; E.sky(c,'#1C2238'); E.moon(c,1400,200,130,{});
  const r=mulberry(8); for(let k=0;k<9;k++){ const x=k*230+r()*60-40; E.bamboo(c,x,-20,H,40,'#3E5A4C','#344D41','#2D4439',false); rect(c,x-25,300+r()*300,50,10,'#F2E8D5'); }
  rect(c,0,900,W,180,'#E2D3B8'); rect(c,0,895,W,10,'#F2E8D5');
  const ts=112.4, tc=ts+19/30; E.bamboo(c,1250,tc<=t?-20:-20,H-180,62,P.mossS,'#3A5234','#2F452B',false);
  if(t>=tc){ const u=inv(tc,tc+0.9,t); rect(c,1200,0,100,g5(500),'#1C2238'); c.save(); c.translate(g5(1250+u*120),g5(250+u*u*500)); c.rotate(Math.round(u*5)/10); E.bamboo(c,0,-250,250,62,P.mossS,'#3A5234','#2F452B',false); c.restore(); poly(c,[[1219,500],[1281,470],[1281,505],[1219,505]],P.mossL); }
  if(t<ts) Ja(c,'idle',t,111.66,1020,925,1); else Ja(c,'slash',t,ts,1020,925,1); E.snow(c,t,141,110,{}); });
// S32 113.98–116.49: ikebana, now with the cut bamboo — calm before the raid
shot('S32',113.98,116.49,(c,t)=>F.room(c,t,{t0:113.98,snow:true,bamboo:true,jay:F.snipJay}),{k:'dissolve',d:0.5});
// S33 116.49–118.45: the bows again, and this time the mask goes up
shot('S33',116.49,118.45,(c,t)=>F.room(c,t,{t0:116.49,table:false,noSword:true,snow:true,jay:(c,t)=>F.bowJay(c,t,116.49,117.36,117.9,1000,null,117.9)}));
// castle roof stage for the showdown
const RY=760, GY=752;
function stage(c,t,camX,o={}){ E.castleRoof(c,t,camX,{snow:true,moonX:o.moonX||1300,moonR:o.moonR||200,ridgeY:RY}); }
// S34 118.45–123.00: the leader waits on the ridge with the bell; Jay arrives; petals+snow freeze on 「凝结了空气」, his slash breaks it
shot('S34',118.45,123.00,(c,t)=>{ stage(c,t,0); const fz=122.195, un=122.0+19/30;
  const frozen=t>=fz&&t<un; const tl=frozen?fz:t;
  Ja(c,'idle',tl,118.45,1400,GY,-1,'leader'); bell(c,1340,GY-170,tl);
  if(t<119.9) Ja(c,'run',t,118.45,g5(lerp(-100,760,inv(118.45,119.9,t))),GY,1); else if(t<122.0) Ja(c,'idle',tl,119.9,760,GY,1); else Ja(c,'slash',t,122.0,760,GY,1);
  F.petals(c,t,23,90,{freeze:frozen?fz:null,wind:t>=un?400:20}); E.snow(c,frozen?fz:t,151,90,{});
  if(t>=un&&t<un+2/30) rect(c,0,0,W,H,'#F2E8D5'); },{k:'mosaic',d:0.6});
// S35 123.00–127.55: the raid on the castle roof — three shadows; slash, throw, and the leader's smoke bomb
shot('S35',123.00,127.55,(c,t)=>{ stage(c,t,0,{moonX:500,moonR:240}); const x=900;
  const sh=[[1250,123.02,123.6+19/30],[560,123.6,124.75+7/30+0.3],[1500,124.16,99]];
  sh.forEach(([sx,tb,td],k)=>{ poof(c,sx,GY-110,t,tb-0.05); if(t>=tb&&t<td) Ja(c,k===2&&t>=126.2?'throw':'idle',t,k===2&&t>=126.2?126.2:tb,sx,GY,sx>x?-1:1,'shadow'); poof(c,sx,GY-110,t,td); });
  Ja(c,'idle',t,123,1750,GY,-1,'leader');
  if(t<123.6) Ja(c,'idle',t,123,x,GY,1); else if(t<124.75) Ja(c,'slash',t,123.6,x,GY,1); else if(t<125.6) Ja(c,'throw',t,124.75,x,GY,-1); else Ja(c,'idle',t,125.6,x,GY,1);
  const u=inv(124.75+7/30,124.75+7/30+0.3,t); if(u>0&&u<1) fxW(c,'shuriken',Math.floor(t*15)%2,g5(lerp(x-100,620,u)),GY-150,1);
  const v=inv(126.3,126.45,t); if(v>0&&v<1) fxW(c,'shuriken',0,g5(lerp(1440,x+150,v)),GY-160,1);
  F.smoke(c,t,126.45,x+100,GY-140,{seed:13}); E.snow(c,t,161,80,{}); });
// S36 127.55–132.08: story scroll II — two pupils, side by side; the other one turns; the scroll burns
shot('S36',127.55,132.08,(c,t)=>F.scrollShot(c,t,{t0:127.55,mode:'twist',turn:129.823,burn:130.374}),{k:'dissolve',d:0.6});
// S37 132.08–136.57: vanishing, second time with purpose — he fades on the counts, the leader searches, Jay reappears behind him
shot('S37',132.08,136.57,(c,t)=>F.vanish(c,t,{t0:132.08,x:700,face:1,seal:132.3,c1:132.656,c2:133.213,c3:133.77,c4:134.351,moonX:1100,moonR:220,snow:true,castle:true,
  leader:(c,t)=>{ const f=t<134.6?-1:(t<135.2?1:-1); Ja(c,'idle',t,132.08,1300,GY,f,'leader'); bell(c,1300+f*60,GY-170,t); },
  after:(c,t)=>{ poof(c,1560,GY-110,t,135.45); if(t>=135.488) J(c,'slash',t<135.8?0:1,1560,GY,-1); }}),{k:'flash'});
// S38 136.57–145.64: the clones — 1→2→4→8 on the counts, surrounding the leader under the giant moon
F.clonesWide=(c,t)=>{ E.sky(c,P.night); E.stars(c,t,9,70,700,['#F2E8D5','#4A5378','#EBA9A5']); E.dither(c,0,620,1920,200,'#2E3756',f=>f*0.7); E.moon(c,960,520,430,{});
  E.clouds(c,t,[{x:-200,y:640,w:900,h:30,v:16,col:P.night2},{x:1100,y:560,w:800,h:26,v:-12,col:P.night2},{x:200,y:300,w:600,h:22,v:10,col:P.night3}],P.night2,71);
  E.roofRow(c,-100,820,0.9,10,P.night3,null,P.night3,81);
  [[860,P.ink2,'#252A40'],[1000,P.ink,'#191C2B']].forEach(([y,col,rib])=>{ poly(c,[[-40,y],[W+40,y-30],[W+40,H],[-40,H]],col); c.fillStyle=rib; for(let x=-40;x<W;x+=30) c.fillRect(x,y-(x+40)/(W+80)*30+12,9,300); poly(c,[[-40,y-12],[W+40,y-42],[W+40,y-22],[-40,y+8]],rib); });
  const cnt=D.counts.filter(q=>q.t>=136.57&&q.t<=t); const cs=cnt.length; const n=Math.min(8,Math.pow(2,Math.min(3,cs)));
  // the leader at centre: he turns toward each new clone
  const lf=cs%2?1:-1; if(F.V2) Ja(c,'hold',t,136.57,960,930,lf,null,'K'); else Ja(c,'idle',t,136.57,960,930,lf,'leader'); bell(c,960+lf*60,760,t);
  const POSE=[['seal',null],['slash',5],['crouch',1],['point',1],['throw',0],['seal',null],['idle',null],['slash',1]];
  const spots=[[620,935,1,0],[1300,930,-1,0],[400,905,1,0],[1540,888,-1,0],[180,912,1,1],[1760,866,-1,1],[790,862,1,1],[1130,858,-1,1]];
  const born=k=>k===0?null:D.counts.filter(q=>q.t>=136.57)[Math.ceil(Math.log2(k+1))-1];
  const order=[...Array(n).keys()].sort((a,b)=>spots[a][1]-spots[b][1]);
  for(const k of order){ const [x,y,f,far]=spots[k]; const [an,fix]=POSE[k]; const b=born(k); const tb=b?b.t:-99;
    if(k===0||t>=tb+0.1){ const fr=fix==null?SPR.frameAt('M',an,t,tb+k*0.13):fix; J(c,an,fr,x,y,f,far?'far':null); }
    if(k>0) poof(c,x,y-110,t,tb); }
  const r=mulberry(91); for(let k=0;k<220;k++){ const x0=r()*2400, sp=180+r()*240, sz=6+r()*8; const x=((x0-t*sp)%2400+2400)%2400-200; const y=(r()*1200+t*sp*0.35)%1180-60; E.petal(c,x,y,sz,t*3+k,P.sakuraL,P.sakuraS,Math.cos(t*4+k)); } };
shot('S38',136.57,145.64,F.clonesWide,{k:'mosaic',d:0.6});
// S39a–c 145.64 / 147.93 / 150.19: three cuts, three slashes (one per line); the leader breaks into smoke; the bell falls
function strike(c,t,o){ stage(c,t,o.cam||0,{moonX:o.moonX,moonR:o.moonR}); const ts=o.t0, tc=ts+19/30;
  if(!o.gone||t<o.gone) Ja(c,'idle',t,ts,o.lx,GY,o.lf,'leader'); if(o.gone){ poof(c,o.lx,GY-110,t,o.gone); const u=inv(o.gone,o.gone+0.7,t); if(u>0) bell(c,o.lx,g5(GY-170+Math.min(1,u)*150),t); }
  const st=inv(ts+12/30,tc,t); Ja(c,'slash',t,ts,g5(o.jx+st*o.dx),GY,o.jf);
  if(t>=tc&&t<tc+3/30){ poly(c,[[o.lx-260,GY-300],[o.lx-240,GY-300],[o.lx+260,GY-20],[o.lx+240,GY-20]],'#FFF8EC'); }
  F.petals(c,t,29,80,{wind:300}); E.snow(c,t,171,60,{}); }
shot('S39a',145.64,147.93,(c,t)=>strike(c,t,{t0:145.64,lx:1150,lf:-1,jx:620,jf:1,dx:200,moonX:1300,moonR:200}),{k:'flash'});
shot('S39b',147.93,150.19,(c,t)=>strike(c,t,{t0:147.93,lx:760,lf:1,jx:1300,jf:-1,dx:-200,moonX:500,moonR:240}),{k:'flash'});
shot('S39c',150.19,151.20,(c,t)=>strike(c,t,{t0:150.19-12/30,lx:1000,lf:-1,jx:560,jf:1,dx:220,gone:150.45,moonX:1000,moonR:300}),{k:'flash'});
// S40 151.20–152.37: close — the bell in his hand, snow stops
shot('S40',151.20,152.37,(c,t)=>{ E.castleRoof(c,t,0,{plain:true,moonX:1250,moonR:300,ridgeY:900}); Ja(c,'hold_bell',t,151.2,900,930,1,null,'L'); E.snow(c,t,181,30,{calm:1}); });
// S41 152.37–155.20: home — he hangs the bell back on the kamidana (a glint)
shot('S41',152.37,155.20,(c,t)=>F.izakaya(c,t,{t0:152.37,cam:[-400,-400,0,1],bell:{put:153.6},snow:true,jay:{mode:'reach',x:-110,y:930,t0:152.6}}),{k:'dissolve',d:0.6});
// S42 155.20–159.17: miso steam, the bell rings in the corner; the moon iris closes on the bell
shot('S42',155.20,159.17,(c,t)=>F.izakaya(c,t,{t0:155.2,cam:[-400,-400,0,1],bell:'on',snow:true,jay:{mode:'chew',x:820,y:850,face:1,t0:155.2}}));
F.IRIS=t=>{ if(t<157.2) return null; const u=inv(157.2,158.5,t); return [Math.round((F.BELL_X+400)/5),Math.round((F.BELL_Y-20)/5),Math.round(lerp(260,0,eio(u))/2)*2]; };
})(window);
