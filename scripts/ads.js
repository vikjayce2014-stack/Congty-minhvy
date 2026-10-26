// Biến video nón xoay (ads/vid-*.mp4, tạo bằng scripts/hf-video.js) thành video lặp mượt cho website.
// Mỗi video được ghép xuôi rồi ngược để vòng lặp không bị giật, nén nhẹ, kèm ảnh bìa lấy từ khung hình đầu.
// Kết quả: src/static/media/ad-<tên>.mp4 và ad-<tên>.webp. Dùng: node scripts/ads.js
const path = require('path');
const { execFileSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const NAMES = ['cap', 'mesh', 'bucket', 'custom'];

(async () => {
  for (const n of NAMES) {
    const src = path.join(root, 'ads', `vid-${n}.mp4`);
    const out = path.join(root, 'src/static/media', `ad-${n}.mp4`);
    execFileSync(ffmpeg, ['-v', 'error', '-y', '-i', src, '-filter_complex',
      '[0:v]scale=540:-2,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[v]', '-map', '[v]',
      '-an', '-c:v', 'libx264', '-crf', '30', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
    const frame = execFileSync(ffmpeg, ['-v', 'error', '-i', src, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], { maxBuffer: 1 << 28 });
    await sharp(frame).resize(540).webp({ quality: 82 }).toFile(path.join(root, 'src/static/media', `ad-${n}.webp`));
    console.log('ad-' + n);
  }
})();
