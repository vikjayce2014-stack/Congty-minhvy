// Tạo video nón xoay từ một ảnh (đường dẫn ảnh công khai của Higgsfield). Khóa API đọc từ .env.
// Dùng: node scripts/hf-video.js <tên-file> <image_url hoặc request_id ảnh> ["prompt"] [endpoint]
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
for (const line of fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)) {
  const i = line.indexOf('=');
  if (i > 0) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
}
const SECRET = process.env.HF_API_KEY_SECRET;
const AUTH = SECRET.includes(':') ? `Key ${SECRET}` : `Key ${process.env.HF_API_KEY_ID}:${SECRET}`;
const PROMPT = 'The cap sits on an invisible turntable and rotates smoothly and steadily through one full 360 degree turn, showing the front, side, back and the other side. Static camera, identical dark studio background and soft warm lighting throughout, no zoom, no cuts, the cap keeps its exact shape, colours and embroidery.';
const [name, src, prompt = PROMPT, endpoint = 'kling-video/v2.5-turbo/standard/image-to-video'] = process.argv.slice(2);
if (!name || !src) { console.error('Thiếu tên file hoặc ảnh'); process.exit(1); }

const get = async (url) => (await fetch(url, { headers: { Authorization: AUTH } })).json();
const done = (s) => ['completed', 'failed', 'nsfw', 'canceled'].includes(s);

(async () => {
  let imageUrl = src;
  if (!/^https?:/.test(src)) imageUrl = (await get(`https://api.higgsfield.ai/requests/${src}/status`)).images[0].url;
  const sub = await fetch(`https://api.higgsfield.ai/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Idempotency-Key': `mv-vid-${name}-${Date.now()}` },
    body: JSON.stringify({ prompt, image_url: imageUrl, duration: 5 }),
  });
  const first = await sub.json();
  if (!sub.ok) { console.error('Lỗi gửi yêu cầu', sub.status, JSON.stringify(first).slice(0, 500)); process.exit(1); }
  console.log('Đã gửi', first.request_id, first.status);
  let res = first;
  for (let n = 0; n < 90 && !done(res.status); n++) {
    await new Promise((r) => setTimeout(r, 5000));
    res = await get(first.status_url);
  }
  console.log('Trạng thái:', res.status);
  const url = res.video && res.video.url;
  if (res.status !== 'completed' || !url) { console.error(JSON.stringify(res).slice(0, 500)); process.exit(1); }
  const out = path.join(root, 'ads', `${name}.mp4`);
  fs.writeFileSync(out, Buffer.from(await (await fetch(url)).arrayBuffer()));
  console.log('Đã lưu', out);
})();
