const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const C = require('./content');

// Mã phiên bản theo nội dung file, để trình duyệt tải lại CSS/JS ngay khi có thay đổi
const ver = (rel) => { try { return crypto.createHash('md5').update(fs.readFileSync(path.join(__dirname, 'static', rel))).digest('hex').slice(0, 8); } catch (e) { return '0'; } };

// ---------- Đường dẫn ----------
const ROUTES = {
  home: { vi: '/', en: '/en/' },
  about: { vi: '/gioi-thieu/', en: '/en/about/' },
  products: { vi: '/san-pham/', en: '/en/products/' },
  process: { vi: '/quy-trinh/', en: '/en/process/' },
  contact: { vi: '/lien-he/', en: '/en/contact/' },
};
const other = (l) => (l === 'vi' ? 'en' : 'vi');

// ---------- Ảnh ----------
let DIMS = {};
const setDims = (d) => { DIMS = d; };
function img(n, alt, cls = '', opts = {}) {
  const d = DIMS[n] || { w: 800, h: 1067 };
  const lazy = opts.eager ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"';
  return `<img${cls ? ` class="${cls}"` : ''} src="/media/p${n}.webp" alt="${alt}" width="${d.w}" height="${d.h}" ${lazy}>`;
}
function shot(n, alt, cap) {
  return `<a class="shot reveal" href="/media/p${n}-lg.webp" data-lb data-cap="${cap || alt}">${img(n, alt)}<span class="shot__zoom" aria-hidden="true"></span></a>`;
}
const video = (name, cls = '') => `<video class="${cls}" muted loop playsinline preload="none" poster="/media/v-${name}.webp" data-src="/media/v-${name}.mp4"></video>`;

// ---------- Biểu tượng ----------
const MARK = `<svg class="mark" viewBox="0 0 48 48" aria-hidden="true"><rect x="2.5" y="7" width="43" height="34" rx="9" fill="#d23a30"/><rect x="2.5" y="7" width="43" height="34" rx="9" fill="none" stroke="#f3ead8" stroke-width="2.4" stroke-dasharray=".1 4" stroke-linecap="round"/><path d="M13 29c0-9 5-14 11-14 5.5 0 9 4 9.6 9.3l6 1.2c1.4.3 1.4 2.3-.2 2.3H14.5c-1 0-1.5-.7-1.5-1.6z" fill="#f3ead8"/></svg>`;
const ICON = {
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5 9 3l1.8 4.3-1.9 1.3a11 11 0 0 0 5.5 5.5l1.3-1.9L20 14l-.5 2.4a2.5 2.5 0 0 1-2.5 2A14.5 14.5 0 0 1 4.6 6a2.5 2.5 0 0 1 2-2.5z" fill="currentColor"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12zm0-9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zm1.5 1.5 7.5 5.2 7.5-5.2" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  needle: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 38 36 8" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><ellipse cx="33" cy="12" rx="1.6" ry="4.5" transform="rotate(40 33 12)" fill="currentColor"/><path d="M33 10c8-6 12 4 5 8s-9 10-2 14" fill="none" stroke="#d23a30" stroke-width="2.4" stroke-linecap="round"/></svg>',
  box: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 15 24 6l18 9v20L24 44 6 35zM6 15l18 9 18-9M24 24v20" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>',
  design: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 40V28L30 6l12 12L20 40zM26 10l12 12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M8 40h12" stroke="#d23a30" stroke-width="3" stroke-linecap="round"/></svg>',
  user: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="16" r="8" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M8 42c1-9 8-14 16-14s15 5 16 14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M30 8c3 1 5 3 5 6" stroke="#d23a30" stroke-width="3" stroke-linecap="round"/></svg>',
  school: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 18 24 8l20 10-20 10zM12 24v10c4 4 20 4 24 0V24M44 18v14" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  plane: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M5 26 43 8 31 42l-7-12zM24 30l19-22" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>',
  shop: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 18 10 6h28l4 12M6 18c0 4 4 5 6 5s6-1 6-5c0 4 4 5 6 5s6-1 6-5c0 4 4 5 6 5s6-1 6-5M10 24v18h28V24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-5-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  zalo: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5C13 5 5 12.6 5 22c0 5.2 2.5 9.8 6.5 12.9L10 43l7.4-3.8C19.5 40 21.7 40.3 24 40.3 35 40.3 43 32.7 43 22S35 5 24 5z" fill="#fff"/><text x="24" y="28" text-anchor="middle" font-family="Arial" font-weight="900" font-size="15" fill="#0068ff">Zalo</text></svg>',
};

// ---------- Khung trang ----------
function layout(lang, key, meta, body) {
  const t = (vi, en) => (lang === 'vi' ? vi : en);
  const links = [
    ['home', t('Trang chủ', 'Home')],
    ['about', t('Giới thiệu', 'About')],
    ['products', t('Sản phẩm', 'Products')],
    ['process', t('Quy trình', 'Process')],
    ['contact', t('Liên hệ', 'Contact')],
  ];
  const abs = (p) => (C.siteUrl ? C.siteUrl.replace(/\/$/, '') + p : '');
  const canonical = C.siteUrl
    ? `<link rel="canonical" href="${abs(ROUTES[key][lang])}">
<link rel="alternate" hreflang="vi" href="${abs(ROUTES[key].vi)}">
<link rel="alternate" hreflang="en" href="${abs(ROUTES[key].en)}">
<link rel="alternate" hreflang="x-default" href="${abs(ROUTES[key].vi)}">`
    : '';
  const base = C.siteUrl ? C.siteUrl.replace(/\/$/, '') : '';
  const pageUrl = base + ROUTES[key][lang];
  const biz = {
    '@type': 'LocalBusiness',
    '@id': base + '/#business',
    name: t('Minh Vy - Xưởng may nón', 'Minh Vy - Cap factory'),
    alternateName: 'Minh Vy',
    description: t('Xưởng may nón và thêu logo tại TP.HCM, hơn 20 năm kinh nghiệm, nhận đơn sỉ và lẻ.', 'Cap manufacturer and logo embroidery workshop in Ho Chi Minh City with 20+ years of experience, taking wholesale and retail orders.'),
    telephone: '+84' + C.tel.slice(1),
    address: { '@type': 'PostalAddress', streetAddress: '78/8 Nguyễn Văn Quá, Phường Đông Hưng Thuận', addressLocality: 'Thành phố Hồ Chí Minh', addressCountry: 'VN' },
    areaServed: { '@type': 'Country', name: 'Việt Nam' },
    knowsAbout: ['may nón', 'thêu logo', 'nón kết', 'nón lưới', 'nón tai bèo', 'miếng thêu patch'],
    contactPoint: [{ '@type': 'ContactPoint', telephone: '+84' + C.tel.slice(1), contactType: 'sales', availableLanguage: ['vi', 'en'] }],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t('Sản phẩm và dịch vụ', 'Products and services'),
      itemListElement: [
        t('May nón sỉ và lẻ', 'Wholesale and retail caps'), t('Thêu logo lên nón', 'Logo embroidery on caps'),
        t('Làm nón theo thiết kế riêng', 'Custom-designed caps'), t('Thêu miếng patch rời', 'Loose embroidered patches'),
      ].map((n) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n } })),
    },
    ...(base ? { url: base + '/', logo: { '@type': 'ImageObject', url: base + '/icon-512.png' }, image: base + '/og-image.jpg' } : {}),
    ...(C.email ? { email: C.email } : {}),
  };
  const graph = [biz];
  if (base) {
    graph.push({ '@type': 'WebSite', '@id': base + '/#website', url: base + '/', name: 'Minh Vy', inLanguage: ['vi', 'en'], publisher: { '@id': base + '/#business' } });
    const pageName = (links.find(([k]) => k === key) || [])[1];
    if (key !== 'home') {
      graph.push({ '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('Trang chủ', 'Home'), item: base + ROUTES.home[lang] },
        { '@type': 'ListItem', position: 2, name: pageName, item: pageUrl },
      ] });
    }
    graph.push({ '@type': 'WebPage', '@id': pageUrl + '#page', url: pageUrl, name: meta.title, description: meta.desc, inLanguage: lang, isPartOf: { '@id': base + '/#website' }, about: { '@id': base + '/#business' } });
  }
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  const nav = links
    .map(([k, label]) => `<a href="${ROUTES[k][lang]}"${k === key ? ' aria-current="page"' : ''}>${label}</a>`)
    .join('');
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${meta.title}</title>
<meta name="description" content="${meta.desc}">
<meta name="theme-color" content="#0b0a0a">
<meta property="og:title" content="${meta.title}">
<meta property="og:description" content="${meta.desc}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${lang === 'vi' ? 'vi_VN' : 'en_US'}">
<meta property="og:site_name" content="Minh Vy">
${base ? `<meta property="og:url" content="${pageUrl}">\n` : ''}<meta property="og:image" content="${abs('/og-image.jpg') || '/og-image.jpg'}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${t('Logo Minh Vy và nón thêu logo', 'Minh Vy logo and an embroidered cap')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${meta.title}">
<meta name="twitter:description" content="${meta.desc}">
<meta name="twitter:image" content="${abs('/og-image.jpg') || '/og-image.jpg'}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
<meta name="geo.region" content="VN-SG">
<meta name="geo.placename" content="Thành phố Hồ Chí Minh">
${canonical}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-48.png" sizes="48x48" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css?v=${ver('css/styles.css')}">
<script>(function(d){d.classList.add('js');var t='dark';try{t=localStorage.getItem('mv-theme')||'dark'}catch(e){}var q=/[?&]theme=(light|dark)/.exec(location.search);if(q)t=q[1];d.setAttribute('data-theme',t==='light'?'light':'dark');var m=d.querySelector('meta[name=theme-color]');if(m&&t==='light')m.content='#fdf2cc'})(document.documentElement)</script>
<script type="application/ld+json">${ld}</script>
</head>
<body class="page-${key}">
<a class="skip" href="#main">${t('Bỏ qua đến nội dung', 'Skip to content')}</a>
<header class="nav" id="nav">
  <a class="nav__brand" href="${ROUTES.home[lang]}" aria-label="Minh Vy">${MARK}<span class="nav__word"><small>${t('XƯỞNG MAY NÓN VẢI', 'CAP WORKSHOP')}</small><b>MINH VY</b></span></a>
  <button class="burger" type="button" aria-label="${t('Mở menu', 'Open menu')}" aria-expanded="false" aria-controls="navmenu"><span></span><span></span><span></span></button>
  <div class="nav__menu" id="navmenu">
    <nav class="nav__links" aria-label="${t('Chính', 'Main')}">${nav}</nav>
    <div class="nav__actions">
      <button class="theme" type="button" aria-label="${t('Đổi giao diện sáng hoặc tối', 'Switch light or dark theme')}"><svg class="theme__sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><svg class="theme__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z" fill="currentColor"/></svg></button>
      <a class="lang" href="${ROUTES[key][other(lang)]}" hreflang="${other(lang)}" lang="${other(lang)}" aria-label="${t('Switch to English', 'Chuyển sang tiếng Việt')}">${lang === 'vi' ? 'EN' : 'VI'}</a>
      <a class="btn btn--sm" href="tel:${C.tel}"><span>${t('Gọi ngay', 'Call now')}</span></a>
    </div>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="wrap foot__grid">
    <div>
      <a class="nav__brand" href="${ROUTES.home[lang]}">${MARK}<span class="nav__word"><small>${t('XƯỞNG MAY NÓN VẢI', 'CAP WORKSHOP')}</small><b>MINH VY</b></span></a>
      <p class="foot__about">${t('Sản xuất sỉ và lẻ mọi loại nón, thêu logo theo thiết kế riêng. Hơn 20 năm kinh nghiệm.', 'Wholesale and retail caps and hats of every kind, embroidered to your own design. Over 20 years of experience.')}</p>
    </div>
    <div>
      <h3>${t('Điều hướng', 'Pages')}</h3>
      <ul>${links.map(([k, label]) => `<li><a href="${ROUTES[k][lang]}">${label}</a></li>`).join('')}</ul>
    </div>
    <div>
      <h3>${t('Liên hệ', 'Contact')}</h3>
      <ul class="foot__contact">
        <li>${ICON.phone}<span><a href="tel:${C.tel}">${C.phone}</a> · <a href="${C.zalo}" rel="noopener" target="_blank">Zalo</a></span></li>
        <li>${ICON.pin}<span>${C.address}</span></li>
        ${C.email ? `<li>${ICON.mail}<a href="mailto:${C.email}">${C.email}</a></li>` : ''}
      </ul>
    </div>
  </div>
  <div class="wrap foot__bar"><span>© ${new Date().getFullYear()} Minh Vy. ${t('Bảo lưu mọi quyền.', 'All rights reserved.')}</span><a class="lang" href="${ROUTES[key][other(lang)]}" hreflang="${other(lang)}">${lang === 'vi' ? 'English' : 'Tiếng Việt'}</a></div>
</footer>
<div class="fab" aria-label="${t('Liên hệ nhanh', 'Quick contact')}">
  <a class="fab__btn fab__zalo" href="${C.zalo}" target="_blank" rel="noopener" aria-label="Zalo">${ICON.zalo}</a>
  <a class="fab__btn fab__call" href="tel:${C.tel}" aria-label="${t('Gọi', 'Call')} ${C.phone}">${ICON.phone}</a>
</div>
<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="${t('Xem ảnh', 'Image viewer')}"><button class="lb__x" type="button" aria-label="${t('Đóng', 'Close')}">×</button><button class="lb__n lb__prev" type="button" aria-label="${t('Ảnh trước', 'Previous')}">‹</button><button class="lb__n lb__next" type="button" aria-label="${t('Ảnh sau', 'Next')}">›</button><figure><img alt=""><figcaption></figcaption></figure></div>
<script src="/js/main.js?v=${ver('js/main.js')}" defer></script>
</body>
</html>`;
}

module.exports = { ROUTES, other, layout, img, shot, video, ICON, MARK, setDims, ver, C };
