// film_audit9.js (v9: + SOLE-TO-SHADOW check — per character sprite per frame, the lowest opaque row of the frame (clamped to the animation's ground row when a blade hangs lower) vs the centre row of the contact shadow drawn under it; pass |d|<=1 art px. Airborne frames, clipped (occluded-feet) sprites and FX are reported separately.) Forked from film_audit8.js (v8: caption SAFE ZONE — no character bbox may touch the caption box grown by 6 px (30 world px) vertically / 6 px horizontally (low-res px), FX sprites excluded) — per-frame audit of the film page: sprite boxes vs caption box, caption onset sync vs LRC, shot list.
// node tools/film_audit.js film.html out.json [step]
const puppeteer=require('puppeteer-core'),fs=require('fs'),path=require('path');
const [page,outp,step]=[process.argv[2]||'film.html',process.argv[3]||'tests/review/audit.json',+(process.argv[4]||1)];
(async()=>{ const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
  const p=await b.newPage(); await p.setViewport({width:1920,height:1080}); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(page));
  await p.evaluate(async()=>{for(const f of ['12px "FusionPixel"','12px "FusionPixelJA"'])await document.fonts.load(f,'忍者いち');});
  const res=await p.evaluate((step)=>{ const PADV=6, PADH=6; const N=Math.round(DATA.DUR*30); const coll=[], sole={pass:0,fail:[],uncovered:[],air:[],occluded:[],seated:0,scroll:0,ghost:0,offFrame:0,noShadow:[]}, onsets=[], offscreen=[]; let lastCap=null;
    for(let i=0;i<N;i+=step){ const a=AUDIT(i); const cap=a.cap; const key=cap?cap.text:null;
      if(key!==lastCap){ onsets.push({i,t:i/30,text:key}); lastCap=key; }
      if(cap) for(const s of a.sprites){ if(s.set==='FX') continue; const [x0,y0,x1,y1]=s.box; const P=PADV, Px=PADH; if(x1>=cap.x0-Px&&x0<=cap.x1+Px&&y1>=cap.y0-P&&y0<=cap.y1+P) coll.push({i,t:+(i/30).toFixed(2),anim:s.anim,box:s.box,cap:[cap.x0,cap.y0,cap.x1,cap.y1]}); }
      // sole-to-shadow
      const t=i/30, shot=(SCENE.SHOTS.find(s=>t>=s.t0&&t<s.t1)||{}).id;
      for(const s of a.sprites){ if(s.set==='FX'||s.remap==='fade3') continue; const g=FILM.GROUND[s.set+'/'+s.anim]; if(g==null) continue;
        const gp=s.ly-s.oy+g, lowF=s.ly-s.oy+s.y1; const rec={i,t:+t.toFixed(2),shot,sa:s.set+'/'+s.anim,k:s.k,lx:s.lx};
        if(FILM.SEATED.has(s.anim)){ sole.seated++; continue; } if(FILM.isGhost(shot,s.set,s.anim,s.remap)){ sole.ghost++; continue; } if(FILM.isScroll(shot,t)){ sole.scroll++; continue; }
        if(s.box[3]<lowF){ sole.occluded.push(rec); continue; }
        if(lowF<gp){ sole.air.push(rec); continue; }
        const so=gp; let best=null; for(const h of a.shadows){ if(Math.abs(h.x-s.lx)>Math.max(8,h.rx*0.7)) continue; const d=(h.y-0.5)-so; if(d<-4||d>16) continue; if(best==null||Math.abs(d)<Math.abs(best)) best=d; }
        if(best==null){ if(FILM.SEATED&&FILM.SEATED.has(s.anim)) sole.seated++; else if(FILM.isScroll&&FILM.isScroll(shot,t)) sole.scroll++; else if(so>=214) sole.offFrame++; else sole.noShadow.push(rec); continue; } rec.d=+best.toFixed(2); if(Math.abs(best)>1){ sole.fail.push(rec); continue; }
        // feet coverage: both outermost sole pixels (bottom 3 rows) must lie inside a shadow on that row
        { const A=SPR.data.sets[s.set][s.anim], fr=A.frames[s.k]; let a0=1e9,a1=-1; for(let y=Math.max(0,s.oy-2);y<=Math.min(fr.length-1,s.oy);y++){ const r=fr[y]; for(let x=0;x<r.length;x++) if(r[x]!=='.'){ if(x<a0)a0=x; if(x>a1)a1=x; } }
          if(a1>=0){ const ox=s.face<0?A.w-1-A.ox:A.ox, X0=s.face<0?A.w-1-a1:a0, X1=s.face<0?A.w-1-a0:a1; const fx0=s.lx-ox+X0, fx1=s.lx-ox+X1;
            const cov=a.shadows.some(h=>Math.abs((h.y-0.5)-so-best)<=1.01&&fx0>=h.x-h.rx&&fx1<=h.x+h.rx); if(!cov){ rec.feet=[fx0,fx1]; sole.uncovered.push(rec); continue; } } }
        sole.pass++; }
    }
    return {N,coll,sole,onsets,shots:SCENE.SHOTS.map(s=>({id:s.id,t0:s.t0,t1:s.t1,tr:s.tr.k}))}; },step);
  res.errors=errs; fs.mkdirSync(path.dirname(outp),{recursive:true}); fs.writeFileSync(outp,JSON.stringify(res,null,1));
  console.log('frames',res.N,'collisions',res.coll.length,'sole pass',res.sole.pass,'fail',res.sole.fail.length,'feet-uncovered',res.sole.uncovered.length,'air',res.sole.air.length,'occluded',res.sole.occluded.length,'noShadow',res.sole.noShadow.length,'exempt seated/scroll/ghost/offFrame',res.sole.seated,res.sole.scroll,res.sole.ghost,res.sole.offFrame,'caption onsets',res.onsets.length,'errors',errs.length); await b.close(); })();
