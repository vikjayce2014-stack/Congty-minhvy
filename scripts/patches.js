// Tách nền các miếng thêu trong ../Thêu (ảnh chụp trên vải đen) thành ảnh trong suốt cho website.
// Cách làm: viền miếng thêu sáng hơn vải đen -> lấp viền cho kín -> vùng tối nối với mép ảnh là nền -> phần còn lại là miếng thêu.
// Kết quả: src/static/media/emb-1.webp ... emb-5.webp. Dùng: node scripts/patches.js
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const SRC = path.join(root, '..', 'Thêu');
const MAXW = 760;
const BRIGHT = 105; // ngưỡng sáng của viền miếng thêu
const WALL = {};
const OPEN = { 2: 13, 3: 13 };
const ROI = { 2: [0.378, 0.688], 3: [0.374, 0.66] }; // miếng nằm sát mép ảnh: chỉ xét dải chứa miếng để vải tối bên dưới không bị coi là miếng

function dilate(m, w, h, r) {
  let cur = m;
  for (let k = 0; k < r; k++) {
    const nx = new Uint8Array(w * h);
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      nx[i] = cur[i] | cur[i - 1] | cur[i + 1] | cur[i - w] | cur[i + w] | cur[i - w - 1] | cur[i - w + 1] | cur[i + w - 1] | cur[i + w + 1];
    }
    cur = nx;
  }
  return cur;
}
function erode(m, w, h, r) {
  const inv = new Uint8Array(w * h);
  for (let i = 0; i < inv.length; i++) inv[i] = m[i] ? 0 : 1;
  const d = dilate(inv, w, h, r);
  for (let i = 0; i < d.length; i++) d[i] = d[i] ? 0 : 1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (x <= r || y <= r || x >= w - 1 - r || y >= h - 1 - r) d[y * w + x] = 0; // dải viền ảnh không thuộc miếng
  return d;
}

async function cut(n) {
  let img = sharp(path.join(SRC, `${n}.jpg`)).rotate();
  if (ROI[n]) {
    const m = await sharp(path.join(SRC, `${n}.jpg`)).rotate().toBuffer({ resolveWithObject: true });
    const top = Math.round(m.info.height * ROI[n][0]), hh = Math.round(m.info.height * (ROI[n][1] - ROI[n][0]));
    img = sharp(m.data).extract({ left: 0, top, width: m.info.width, height: hh });
  }
  const { data, info } = await img.resize({ width: MAXW, withoutEnlargement: true })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const bright = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    bright[i] = Math.max(r, g, b) > BRIGHT ? 1 : 0;
  }
  const wall = dilate(bright, w, h, WALL[n] || 3);
  // đổ loang từ mép ảnh qua các điểm không phải viền
  const bg = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => { const i = y * w + x; if (!wall[i] && !bg[i]) { bg[i] = 1; stack.push(i); } };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const i = stack.pop(), x = i % w, y = (i / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }
  let inside = new Uint8Array(w * h);
  for (let i = 0; i < inside.length; i++) inside[i] = bg[i] ? 0 : 1;
  inside = erode(inside, w, h, WALL[n] || 3);
  if (OPEN[n]) inside = dilate(erode(inside, w, h, OPEN[n]), w, h, OPEN[n]); // mở: cắt các cầu nối mảnh sang vùng vải tối
  // giữ lại mảng lớn nhất (bỏ nhiễu rời)
  const lab = new Int32Array(w * h); const sizes = [0]; let L = 0;
  for (let s = 0; s < w * h; s++) {
    if (!inside[s] || lab[s]) continue;
    L++; let c = 0; const st = [s]; lab[s] = L;
    while (st.length) {
      const i = st.pop(); c++;
      const x = i % w, y = (i / w) | 0;
      for (const j of [x > 0 ? i - 1 : -1, x < w - 1 ? i + 1 : -1, y > 0 ? i - w : -1, y < h - 1 ? i + w : -1]) {
        if (j >= 0 && inside[j] && !lab[j]) { lab[j] = L; st.push(j); }
      }
    }
    sizes[L] = c;
  }
  let best = 1; for (let k = 1; k <= L; k++) if (sizes[k] > sizes[best]) best = k;
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    if (lab[i] === best) {
      const x = i % w, y = (i / w) | 0;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      out[i * 4] = data[i * 4]; out[i * 4 + 1] = data[i * 4 + 1]; out[i * 4 + 2] = data[i * 4 + 2]; out[i * 4 + 3] = 255;
    }
  }
  const pad = 2;
  x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(w - 1, x1 + pad); y1 = Math.min(h - 1, y1 + pad);
  // làm mềm mép alpha một chút
  const alphaBlur = await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .extractChannel(3).blur(0.8).raw().toBuffer();
  for (let i = 0; i < w * h; i++) out[i * 4 + 3] = alphaBlur[i];
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .webp({ quality: 88, alphaQuality: 95 }).toFile(path.join(root, 'src/static/media', `emb-${n}.webp`));
  console.log(`emb-${n}`, x1 - x0 + 1, 'x', y1 - y0 + 1);
}

// Video thực tế ghép la bàn: nén nhẹ, bỏ tiếng, kèm ảnh bìa.
async function video() {
  const { execFileSync } = require('child_process');
  const ffmpeg = require('ffmpeg-static');
  const src = path.join(SRC, 'video ghép từng mảnh.mp4');
  const out = path.join(root, 'src/static/media/emb-video.mp4');
  execFileSync(ffmpeg, ['-v', 'error', '-y', '-i', src, '-vf', 'scale=432:-2', '-an', '-c:v', 'libx264', '-crf', '30', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  const frame = execFileSync(ffmpeg, ['-v', 'error', '-ss', '12', '-i', src, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], { maxBuffer: 1 << 28 });
  await sharp(frame).resize(432).webp({ quality: 80 }).toFile(path.join(root, 'src/static/media/emb-video.webp'));
  console.log('emb-video');
}

(async () => { for (const n of [1, 2, 3, 4, 5]) await cut(n); await video(); })();
