// Tạo thư mục dist/ (website tĩnh) từ src/. Chạy: npm run build
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const C = require(path.join(SRC, 'content'));
const T = require(path.join(SRC, 'templates'));
const { build, ROUTES } = require(path.join(SRC, 'pages'));

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name);
    const b = path.join(to, e.name);
    if (e.isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
}

(async () => {
  fs.rmSync(DIST, { recursive: true, force: true });
  copyDir(path.join(SRC, 'static'), DIST);

  // kích thước ảnh để tránh nhảy bố cục khi tải
  const dims = {};
  const media = path.join(DIST, 'media');
  for (const f of fs.readdirSync(media)) {
    const m = f.match(/^p(\d+)\.webp$/);
    if (!m) continue;
    const meta = await sharp(path.join(media, f)).metadata();
    dims[m[1]] = { w: meta.width, h: meta.height };
  }
  T.setDims(dims);

  const urls = [];
  for (const lang of ['vi', 'en']) {
    for (const key of Object.keys(ROUTES)) {
      const route = ROUTES[key][lang];
      const dir = path.join(DIST, route);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, 'index.html'), build(lang, key));
      urls.push(route);
    }
  }

  // trang 404
  const nf = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>404 | Minh Vy</title><link rel="stylesheet" href="/css/styles.css?v=${T.ver('css/styles.css')}"></head><body class="page-404"><main class="nf"><h1>404</h1><p>Không tìm thấy trang này. / Page not found.</p><p><a class="btn" href="/"><span>Về trang chủ</span></a></p></main></body></html>`;
  fs.writeFileSync(path.join(DIST, '404.html'), nf);

  // chỉ tạo sitemap và robots có địa chỉ tuyệt đối khi đã cấu hình siteUrl
  if (C.siteUrl) {
    const base = C.siteUrl.replace(/\/$/, '');
    const day = new Date().toISOString().slice(0, 10);
    const items = [];
    for (const key of Object.keys(ROUTES)) {
      const alts = ['vi', 'en'].map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${base}${ROUTES[key][l]}"/>`).join('\n');
      for (const l of ['vi', 'en']) {
        items.push(`  <url>\n    <loc>${base}${ROUTES[key][l]}</loc>\n    <lastmod>${day}</lastmod>\n${alts}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${ROUTES[key].vi}"/>\n    <priority>${key === 'home' ? '1.0' : '0.8'}</priority>\n  </url>`);
      }
    }
    fs.writeFileSync(path.join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${items.join('\n')}\n</urlset>\n`);
    fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
  } else {
    fs.writeFileSync(path.join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\n');
  }

  // header bảo mật và bộ nhớ đệm cho Cloudflare
  fs.writeFileSync(
    path.join(DIST, '_headers'),
    `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n\n/media/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/css/*\n  Cache-Control: public, max-age=3600\n\n/js/*\n  Cache-Control: public, max-age=3600\n`
  );
  console.log(`Đã tạo ${urls.length} trang trong dist/`);
})();
