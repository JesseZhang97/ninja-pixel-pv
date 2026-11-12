本目录不收录音频（版权原因）。请自行放入官方曲目后再渲染。

需要的文件（二选一，或两个都放）：

1. `audio/ninja.mp3`  
   周杰伦《忍者》原曲，使用与 v9 成片相同的那条音轨（约 159.17 秒）。  
   运行 `./scripts/build.sh` 时，若还没有下面的 wav，脚本会用这条 mp3 生成母带。

2. `audio/ninja_audio_m14c.wav`  
   合成时实际使用的母带：48 kHz、立体声 PCM。  
   生成链与 v9 相同：`+10.85 dB`，再以 192 kHz（4 倍过采样）做 `alimiter=limit=0.78:attack=5:release=50:level=false`，然后回到 48 kHz。叠进 mp4 并经 AAC 后，响度约为 −14 LUFS、真峰值约 −1.7 dBTP。  
   若你已有按同一规格做好的 wav，放在这个路径即可，脚本不会再从 mp3 生成。

字幕时间在 `data.js` 的 `DATA.caps` 里，已经对齐 v9 所用的那条音轨（相对 lrclib 时间戳的同步偏移已写进 `t`，不要再额外加减）。若你的文件片头空白或版本不同，字幕可能会偏。
