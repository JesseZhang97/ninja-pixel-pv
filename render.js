// Puppeteer driver (adapted from yinchuan-mg/render.js). node render.js --page index.html --frames 30,60 --out keyframes  |  --range 0:4774 --workers 6
const puppeteer=require('puppeteer-core'),fs=require('fs'),path=require('path');
const a=process.argv.slice(2),arg=(k,d)=>{const i=a.indexOf('--'+k);return i>=0?a[i+1]:d;};
let frames=[];if(arg('frames'))frames=arg('frames').split(',').map(Number);
else{const [s,e]=arg('range','0:0').split(':').map(Number);for(let i=s;i<=e;i++)frames.push(i);}
const page=arg('page','index.html'),out=arg('out','frames'),workers=+arg('workers',1),skip=a.includes('--skip-existing'),W=+arg('w',1920),H=+arg('h',1080),prefix=arg('prefix','f');
fs.mkdirSync(out,{recursive:true});
const name=i=>path.join(out,`${prefix}${String(i).padStart(5,'0')}.png`);
if(skip)frames=frames.filter(i=>!fs.existsSync(name(i)));
(async()=>{const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:'new',
  args:['--no-sandbox','--disable-gpu','--force-device-scale-factor=1','--font-render-hinting=none','--allow-file-access-from-files']});
  try{const chunks=[...Array(workers)].map((_,w)=>frames.filter((_,k)=>k%workers===w));const t0=Date.now();let done=0;
  await Promise.all(chunks.map(async ch=>{if(!ch.length)return;const p=await browser.newPage();await p.setViewport({width:W,height:H});
    p.on('pageerror',e=>console.error('PAGEERROR',e.message)); p.on('console',m=>{if(m.type()==='error')console.error('CONSOLE',m.text());});
    await p.goto('file://'+path.resolve(__dirname,page));
    await p.evaluate(async()=>{for(const f of ['12px "FusionPixel"','12px "FusionPixelJA"','700 30px "Noto Sans CJK SC"'])await document.fonts.load(f,'忍者いち樱');});
    for(const i of ch){const url=await p.evaluate(i=>{renderFrame(i);return document.getElementById('c').toDataURL('image/png');},i);
      fs.writeFileSync(name(i),Buffer.from(url.split(',')[1],'base64'));done++;
      if(done%60===0)console.log(`${done}/${frames.length} ${((Date.now()-t0)/done).toFixed(0)}ms/frame`);}}));
  console.log(`done ${frames.length} frames in ${((Date.now()-t0)/1000).toFixed(1)}s`);}finally{await browser.close();}})();
