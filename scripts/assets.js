// Tối ưu ảnh và video gốc thành file nhẹ cho website.
// Nguồn: ../hình nón (ảnh) và ../Video sản phẩm (video). Kết quả ghi vào src/static/media.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');
const ffmpeg = require('ffmpeg-static');

const ROOT = path.resolve(__dirname, '..');
const PHOTOS = path.resolve(ROOT, '..', 'hình nón');
const VIDEOS = path.resolve(ROOT, '..', 'Video sản phẩm');
const OUT = path.join(ROOT, 'src', 'static', 'media');
fs.mkdirSync(OUT, { recursive: true });

// Bỏ các ảnh có mặt học sinh (26, 27, 30, 31) để giữ riêng tư cho trẻ em.
const SKIP = new Set([26, 27, 30, 31]);

// Video: [tên ra, file gốc, giây bắt đầu, độ dài (giây, 0 = hết), rộng tối đa]
const VIDEO_JOBS = [
  ['showreel', '6.mp4', 0, 14, 960],
  ['embroidery', '5.mp4', 0, 10, 540],
  ['forming', '2.mp4', 0, 12, 540],
  ['mold', '3.mp4', 0, 10, 540],
  ['sewing', '8.mp4', 0, 0, 540],
  ['finished', '4.mp4', 0, 9, 540],
];

async function photos() {
  const files = fs.readdirSync(PHOTOS).filter((f) => /\.jpe?g$/i.test(f));
  for (const f of files) {
    const n = parseInt(f, 10);
    if (SKIP.has(n)) continue;
    const src = path.join(PHOTOS, f);
    const base = sharp(src).rotate();
    await base.clone().resize({ width: 800, withoutEnlargement: true }).webp({ quality: 74 }).toFile(path.join(OUT, `p${n}.webp`));
    await base.clone().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 }).toFile(path.join(OUT, `p${n}-lg.webp`));
    process.stdout.write(`ảnh ${n} `);
  }
  console.log();
}

function videos() {
  for (const [name, file, ss, dur, w] of VIDEO_JOBS) {
    const src = path.join(VIDEOS, file);
    const args = ['-y', '-loglevel', 'error', '-ss', String(ss)];
    if (dur) args.push('-t', String(dur));
    args.push('-i', src, '-an', '-vf', `scale='min(${w},iw)':-2`, '-c:v', 'libx264', '-crf', '30', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(OUT, `v-${name}.mp4`));
    execFileSync(ffmpeg, args);
    // ảnh bìa
    execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-ss', String(ss + 0.8), '-i', src, '-frames:v', '1', '-vf', `scale='min(${w},iw)':-2`, path.join(OUT, `v-${name}.tmp.jpg`)]);
    console.log('video', name);
  }
}

(async () => {
  await photos();
  videos();
  for (const [name] of VIDEO_JOBS) {
    const t = path.join(OUT, `v-${name}.tmp.jpg`);
    await sharp(t).webp({ quality: 70 }).toFile(path.join(OUT, `v-${name}.webp`));
    fs.unlinkSync(t);
  }
  const size = fs.readdirSync(OUT).reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0);
  console.log('Tổng dung lượng media:', (size / 1048576).toFixed(1), 'MB');
})();
