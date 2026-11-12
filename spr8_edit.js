// spr8_edit.js — v8 native-resolution sprite edits (no scaling): row moves / row repeats only, on the original pixel grid.
(function(G){
const top=(fr)=>{ for(let y=0;y<fr.length;y++) if(/[^.]/.test(fr[y])) return y; return 0; };
const ext=(row)=>{ let a=-1,b=-1; for(let x=0;x<row.length;x++) if(row[x]!=='.'){ if(a<0) a=x; b=x; } return [a,b]; };
const merge=(lo,hi)=>{ let s=''; for(let x=0;x<lo.length;x++) s+=hi[x]!=='.'?hi[x]:lo[x]; return s; };
// tall kneel (hips raised off the heels, thighs vertical) from a seiza frame: upper body lifted by `lift` rows, vertical thighs drawn
// under the hips (outline + two shades), shins + feet on the floor kept, the seiza thigh/knee in front trimmed away
function tallKneel(fr,hip,lift){ const H=fr.length, Wd=fr[0].length, blank='.'.repeat(Wd); const out=new Array(H).fill(blank);
  for(let y=0;y<hip;y++) if(y-lift>=0) out[y-lift]=fr[y];
  const [a,b]=ext(fr[hip-1]); const x0=a+2, x1=Math.min(b-3,a+15);
  const row=(l,m,r)=>{ let s=''; for(let x=0;x<Wd;x++) s+=x===x0||x===x1?'0':(x>x0&&x<x1?(x<x0+3?l:(x>x1-2?r:m)):'.'); return s; };
  // thighs slant forward toward the knee (1 px per 2 rows), so the pose reads as lowering onto the knees, not as short legs
  const sl=y=>Math.round((y-(hip-lift))*0.5), sh=(r,k)=>k>0?'.'.repeat(k)+r.slice(0,Wd-k):r;
  for(let y=hip-lift;y<hip+6;y++) out[y]=merge(out[y]||blank,sh(row('1','2','2'),sl(y)));
  const kx=x1+sl(hip+5);
  for(let y=hip+6;y<H;y++){ let s=''; for(let x=0;x<Wd;x++) s+=x<=kx+1?fr[y][x]:'.'; out[y]=merge(s,y===hip+6?sh(row('1','2','0'),sl(hip+5)):blank);
    if(out[y][kx+1]!=='.'||out[y][kx]!=='.') out[y]=out[y].slice(0,kx+1)+'0'+out[y].slice(kx+2); }
  return out; }
// breathing in-between: everything above `hip` drops by dy rows (the legs stay planted)
function bob(fr,hip,dy){ const H=fr.length, Wd=fr[0].length, blank='.'.repeat(Wd); const out=fr.slice();
  for(let y=hip-1;y>=0;y--){ out[y+dy]=y+dy>=hip?merge(fr[y+dy],fr[y]):fr[y]; } for(let y=0;y<dy;y++) out[y]=blank; return out; }
G.SPR8EDIT={top,ext,tallKneel,bob};
})(typeof window!=='undefined'?window:global);
