// Tạo ảnh chia sẻ (og-image) và các biểu tượng cho SEO từ logo và ảnh thật. Chạy một lần khi đổi logo: node scripts/seo-assets.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'src/static');
const logo = path.join(root, '..', 'Logo', 'final', 'logo-minh-vy-41.png');

(async () => {
  // Ảnh chia sẻ 1200x630: logo bên trái, ảnh nón thật bên phải
  const left = await sharp(logo).resize({ height: 560, fit: 'inside' }).toBuffer();
  const right = await sharp(path.join(out, 'media/p22-lg.webp')).resize(560, 630, { fit: 'cover', position: 'attention' }).toBuffer();
  const rl = (await sharp(left).metadata()).width;
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#f3ead8' } })
    .composite([{ input: left, left: Math.round((640 - rl) / 2), top: 35 }, { input: right, left: 640, top: 0 }])
    .jpeg({ quality: 86 }).toFile(path.join(out, 'og-image.jpg'));

  // Biểu tượng: nền kem để dễ nhìn trên mọi giao diện
  const svg = fs.readFileSync(path.join(out, 'favicon.svg'));
  for (const [name, size] of [['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512], ['favicon-48.png', 48]]) {
    const pad = Math.round(size * 0.12);
    const icon = await sharp(svg, { density: 384 }).resize(size - pad * 2, size - pad * 2).toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background: '#0b0a0a' } })
      .composite([{ input: icon, left: pad, top: pad }]).png().toFile(path.join(out, name));
  }
  fs.writeFileSync(path.join(out, 'site.webmanifest'), JSON.stringify({
    name: 'Minh Vy - Xưởng may nón', short_name: 'Minh Vy', lang: 'vi', start_url: '/', display: 'browser',
    background_color: '#0b0a0a', theme_color: '#0b0a0a',
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  }, null, 2));
  console.log('Xong');
})();
