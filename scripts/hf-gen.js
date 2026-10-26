// Tạo ảnh quảng cáo bằng Higgsfield API. Dùng: node scripts/hf-gen.js <tên-file> "<prompt>" [endpoint] [aspect]
// Khóa API đọc từ file .env (HF_API_KEY_ID, HF_API_KEY_SECRET), không in ra màn hình.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
for (const line of fs.readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)) {
  const i = line.indexOf('=');
  if (i > 0) process.env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
}
// Nếu ô SECRET đã chứa sẵn "id:secret" (dán cả chuỗi từ console) thì dùng nguyên chuỗi đó.
const SECRET = process.env.HF_API_KEY_SECRET;
const AUTH = SECRET.includes(':') ? `Key ${SECRET}` : `Key ${process.env.HF_API_KEY_ID}:${SECRET}`;
const [name, prompt, endpoint = 'higgsfield-ai/soul/v2/standard', aspect = '3:4'] = process.argv.slice(2);
if (!name || !prompt) { console.error('Thiếu tên file hoặc prompt'); process.exit(1); }

(async () => {
  const sub = await fetch(`https://api.higgsfield.ai/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: AUTH, 'Content-Type': 'application/json', 'Idempotency-Key': `mv-${name}-${Date.now()}` },
    body: JSON.stringify({ prompt, aspect_ratio: aspect }),
  });
  const first = await sub.json();
  if (!sub.ok) { console.error('Lỗi gửi yêu cầu', sub.status, JSON.stringify(first).slice(0, 400)); process.exit(1); }
  console.log('Đã gửi', first.request_id, first.status);
  let res = first;
  for (let n = 0; n < 60 && !['completed', 'failed', 'nsfw', 'canceled'].includes(res.status); n++) {
    await new Promise((r) => setTimeout(r, 4000));
    res = await (await fetch(first.status_url, { headers: { Authorization: AUTH } })).json();
  }
  console.log('Trạng thái:', res.status);
  if (res.status !== 'completed' || !res.images || !res.images[0]) { console.error(JSON.stringify(res).slice(0, 400)); process.exit(1); }
  const out = path.join(root, 'ads', `${name}.jpg`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(await (await fetch(res.images[0].url)).arrayBuffer()));
  console.log('Đã lưu', out);
})();
