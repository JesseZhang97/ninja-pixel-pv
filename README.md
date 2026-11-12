# 周杰伦《忍者》8-bit 像素 PV（v9）

粉丝向非商业二创。本仓库只放能把最终成片重新渲染出来的源码和素材，是私有备份。`audio/` 里有周杰伦《忍者》原曲，有版权，仓库必须保持 **private**，不要公开。

成片规格：159.17 秒，4775 帧，1920×1080、30 fps，H.264 + AAC，−14 LUFS。画面在 384×216 的像素画布上逐帧绘制，再整数倍放大 5 倍。

## 技术栈

手写 JavaScript 在 Canvas 上画每一帧（`film9.html` 及其加载的脚本和精灵数据），Node 通过 puppeteer-core 驱动无界面 Chrome 截 PNG，再用 ffmpeg 与母带音频合成。

字幕字体是 Fusion Pixel 12px（`fonts/`，SIL OFL 1.1，见 `fonts/OFL.txt`）。

## 环境

- Node.js ≥ 22.12（`npm ci` 会装 `puppeteer-core@25.17.0`）
- Google Chrome 或 Chromium（默认路径 `/usr/bin/google-chrome`，也可设 `CHROME_PATH`）
- ffmpeg（需 `libx264`、AAC）

## 生成成片

```bash
npm ci
./scripts/build.sh
```

输出 `out/ninja_pv.mp4`。可用 `WORKERS=8`、`CHROME_PATH=...`、`OUT=...` 覆盖默认值。

分步也可以：

```bash
npm ci
node render.js --page film9.html --range 0:4774 --workers 6 --out frames
ffmpeg -y -framerate 30 -i frames/f%05d.png -i audio/ninja_audio_m14c.wav \
  -c:v libx264 -preset slow -crf 16 -tune animation -pix_fmt yuv420p \
  -c:a aac -b:a 256k -ar 48000 -ac 2 -shortest -movflags +faststart \
  out/ninja_pv.mp4
```

`audio/ninja.mp3` 是原曲；`audio/ninja_audio_m14c.wav` 是 v9 使用的 −14 LUFS 母带（+10.85 dB 后砖墙限制），合成时请用这份 wav，响度才能和成片一致。

抽检若干帧：

```bash
node render.js --page film9.html --frames 0,480,2040,2700,4530,4774 --out frames
```

脚底与字幕检查（可选）：

```bash
node tools/film_audit9.js film9.html audit.json 1
```

## 不包含什么

渲染产物（成片、逐帧 PNG）、旧版 `film1`–`film8` 页面、未使用的字体和精灵文件、`node_modules`、测试与分析数据都不在仓库里，可用上面的命令重新生成成片。
