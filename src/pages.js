const { ROUTES, layout, img, shot, video, ICON, C } = require('./templates');

// Mô tả ngắn cho từng ảnh (dùng làm alt và chú thích khi phóng to).
const ALT = {
  1: ['Nón vàng của trường, in logo lớp', 'Yellow school cap with a class logo'],
  2: ['Lô nón vàng đồng phục trường học', 'Batch of yellow school uniform caps'],
  3: ['Lô nón đen trơn chờ thêu', 'Batch of plain black caps ready for embroidery'],
  4: ['Nón be lưỡi trai xanh thêu chữ nổi', 'Cream cap with blue brim and raised lettering'],
  5: ['Nón nâu thêu logo công ty du lịch', 'Brown caps embroidered with a travel company logo'],
  6: ['Nón lưới thêu chữ nổi 3D, lưỡi trai đen', 'Mesh-back cap with raised 3D lettering, black brim'],
  7: ['Nón đen thêu nổi 3D nhiều màu chỉ', 'Black cap with multi-colour raised 3D embroidery'],
  8: ['Nón lưới lưỡi trai hồng thêu nổi', 'Mesh cap with pink brim and raised embroidery'],
  9: ['Nón lưới lưỡi trai xanh thêu nổi', 'Mesh cap with blue brim and raised embroidery'],
  10: ['Nhiều mẫu nón lưới nhiều màu', 'Mesh caps in many colours'],
  11: ['Nón xanh navy thêu chỉ vàng', 'Navy cap with gold thread embroidery'],
  12: ['Nón tai bèo xám thêu logo', 'Grey bucket hat with an embroidered logo'],
  13: ['Nón tai bèo xám thêu huy hiệu', 'Grey bucket hat with an embroidered crest'],
  14: ['Nón trắng thêu logo công ty du lịch', 'White caps embroidered with a tourism logo'],
  15: ['Nón đỏ thêu logo quán cà phê', 'Red cap with an embroidered cafe logo'],
  16: ['Nón trắng thêu logo trường học', 'White caps with a school logo'],
  17: ['Nón xanh nhạt thêu chữ theo thiết kế', 'Light blue caps with custom lettering'],
  18: ['Nón be lưỡi trai xanh navy thêu logo', 'Cream cap with navy brim and logo'],
  19: ['Nón đen thêu chữ nhỏ tinh tế', 'Black caps with fine script embroidery'],
  20: ['Nón be lưỡi trai navy thêu logo', 'Cream and navy caps with a logo'],
  21: ['Nón đỏ trắng thêu logo công ty du lịch', 'Red and white cap with a tour company logo'],
  22: ['Nón vàng thêu logo theo mẫu riêng', 'Yellow cap with a custom-designed logo'],
  23: ['Nón vàng lưỡi trai xanh lá thêu logo', 'Yellow cap with green brim and logo'],
  24: ['Nón tai bèo xám thêu huy hiệu', 'Grey bucket hats with a crest'],
  25: ['Nón tai bèo thêu tên công ty', 'Bucket hat embroidered with a company name'],
  28: ['Nón tai bèo đỏ và xám thêu logo', 'Red and grey bucket hats with a logo'],
  29: ['Chồng nón tai bèo chờ giao', 'Stack of bucket hats ready to ship'],
};
const alt = (n, lang) => ALT[n][lang === 'vi' ? 0 : 1];
const gal = (list, lang) => list.map((n) => shot(n, alt(n, lang))).join('');

// Vòng ảnh 3D ở trang chủ: [ảnh, nhãn vi, nhãn en]
const RING = [
  [7, 'Thêu nổi 3D', 'Raised 3D embroidery'],
  [9, 'Nón lưới', 'Mesh-back cap'],
  [22, 'Theo mẫu riêng', 'Custom design'],
  [13, 'Nón tai bèo', 'Bucket hat'],
  [18, 'Hai tông màu', 'Two-tone cap'],
  [11, 'Thêu chỉ vàng', 'Gold thread'],
  [21, 'Nón du lịch', 'Tour caps'],
  [23, 'Phối màu', 'Colour blocking'],
  [15, 'Nón thương hiệu', 'Brand caps'],
  [6, 'Chữ nổi', 'Raised lettering'],
  [14, 'Nón công ty', 'Company caps'],
  [12, 'Logo thêu', 'Embroidered logo'],
];

function head(lang, eyebrow, title, lead) {
  return `<div class="sec__head reveal"><span class="eyebrow">${eyebrow}</span><h2>${title}</h2>${lead ? `<p>${lead}</p>` : ''}</div>`;
}

function ctaBand(lang) {
  const t = (vi, en) => (lang === 'vi' ? vi : en);
  return `<section class="band"><div class="wrap band__in reveal">
  <div><h2>${t('Có mẫu nón muốn làm?', 'Have a cap in mind?')}</h2><p>${t('Gửi logo hoặc ý tưởng qua Zalo, xưởng tư vấn và báo giá cho cả đơn lẻ lẫn đơn sỉ.', 'Send your logo or idea on Zalo and we will advise and quote, for small orders and wholesale alike.')}</p></div>
  <div class="band__act"><a class="btn" href="tel:${C.tel}"><span>${ICON.phone}${C.phone}</span></a><a class="btn btn--ghost" href="${C.zalo}" target="_blank" rel="noopener"><span>${t('Nhắn Zalo', 'Message on Zalo')}</span></a></div>
</div></section>`;
}

// Tủ 4 ngăn: cuộn xuống thì từng ngăn mở ra, mẫu nón được đưa lên cùng vài thông tin.
// Ảnh dùng tạm ảnh thật của xưởng; muốn đổi sang ảnh quảng cáo chỉ cần đổi số ảnh ở đây.
const VAULT = [
  { id: 'cap', ad: 'ad-cap', n: 4, vi: ['Nón kết', 'Dáng lưỡi trai quen thuộc, hợp mọi lứa tuổi. Phối hai tông màu giữa thân và lưỡi trai, logo thêu ở mặt trước.', ['Thêu phẳng hoặc nổi', 'Phối nhiều tông màu', 'Sỉ và lẻ']], en: ['Baseball cap', 'The familiar curved-brim cap for every age. Two-tone body and brim with the logo embroidered on the front.', ['Flat or raised embroidery', 'Many colour pairings', 'Bulk and single']] },
  { id: 'mesh', ad: 'ad-mesh', n: 9, vi: ['Nón lưới', 'Mặt trước thêu chữ nổi 3D, lưng lưới thoáng khí. Nhiều màu lưỡi trai để phối.', ['Thêu nổi 3D', 'Lưng lưới thoáng', 'Nhiều màu lưỡi trai']], en: ['Mesh-back cap', 'Raised 3D lettering on the front with a breathable mesh back, and many brim colours to pair.', ['Raised 3D embroidery', 'Breathable mesh back', 'Many brim colours']] },
  { id: 'bucket', ad: 'ad-bucket', n: 13, vi: ['Nón tai bèo', 'Vành rộng che nắng, hợp công trường, du lịch và sự kiện ngoài trời. Thêu logo hoặc tên công ty ở thân nón.', ['Vành rộng che nắng', 'Thêu huy hiệu, tên công ty', 'Hợp du lịch, sự kiện']], en: ['Bucket hat', 'A wide brim for sun cover on worksites, trips and outdoor events, with a logo or company name embroidered on the crown.', ['Wide sun brim', 'Crest or company name', 'Made for travel and events']] },
  { id: 'custom', ad: 'ad-custom', n: 22, vi: ['Nón theo mẫu riêng', 'Bạn gửi logo hoặc ý tưởng, xưởng lên mẫu và thêu đúng thiết kế cho trường học, công ty du lịch, shop nón và từng cá nhân.', ['Theo thiết kế của bạn', 'Chọn vải, phối màu', 'Nhận cả đơn lẻ']], en: ['Made to your design', 'Send a logo or an idea and we sample it and embroider it exactly, for schools, tour companies, cap shops and individuals.', ['Your own design', 'Choose fabric and colours', 'Small orders welcome']] },
];

function vault(lang) {
  const t = (vi, en) => (lang === 'vi' ? vi : en);
  const k = lang === 'vi' ? 'vi' : 'en';
  const pad = (i) => String(i + 1).padStart(2, '0');
  const drawers = VAULT.map((v, i) => `<div class="drawer" data-i="${i}"><span class="drawer__in"></span><div class="drawer__front"><span class="drawer__no">${pad(i)}</span><span class="drawer__name">${v[k][0]}</span><i class="drawer__handle"></i></div></div>`).join('');
  const items = VAULT.map((v, i) => `<article class="item" data-i="${i}">
      <figure class="item__img"><video class="item__vid" muted loop playsinline preload="none" poster="/media/${v.ad}.webp" data-vsrc="/media/${v.ad}.mp4" width="540" height="722" aria-label="${v[k][0]}"></video></figure>
      <div class="item__txt"><span class="item__no">${pad(i)} / ${pad(VAULT.length - 1)}</span><h3>${v[k][0]}</h3><p>${v[k][1]}</p>
        <ul class="tags">${v[k][2].map((x) => `<li>${x}</li>`).join('')}</ul>
        <a class="link" href="${ROUTES.products[lang]}#${v.id}">${t('Xem thêm mẫu', 'See more')}${ICON.arrow || ''}</a></div>
    </article>`).join('');
  return `<section class="vault" id="vault" aria-label="${t('Tủ mẫu nón', 'Cap sample cabinet')}">
  <div class="vault__track"><div class="vault__sticky"><div class="wrap">
    <div class="vault__head"><span class="eyebrow">${t('Tủ mẫu', 'Sample cabinet')}</span><h2>${t('Mở từng ngăn, xem từng mẫu nón', 'Open each drawer, meet each cap')}</h2></div>
    <div class="vault__grid"><div class="cabinet" aria-hidden="true">${drawers}</div><div class="vault__stage">${items}</div></div>
  </div></div></div>
</section>`;
}

// Phần "Chuyên thêu logo": giới thiệu, cuộn qua các miếng thêu thật, rồi ghép thành la bàn.
const EMB_CAPS = [
  ['Nhiều mảng màu, hình nhỏ vẫn rõ', 'Many colour fields, small figures stay clear'],
  ['Chữ thêu nhỏ, nét mảnh vẫn sắc', 'Fine script and thin lines stay crisp'],
  ['Viền gọn, mép đều', 'Clean, even borders'],
  ['Chuyển sắc mềm, nhiều lớp chỉ', 'Soft tonal shifts in layered thread'],
  ['Huy hiệu tròn, viền thêu nổi', 'Round badge with a raised stitched rim'],
];
const COMPASS = `<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
  <circle cx="100" cy="100" r="99" fill="#d9cdb0"/><circle cx="100" cy="100" r="86" fill="#fbfaf6" stroke="#bfae86" stroke-width="1.2"/>
  <g fill="#e2b13a">${Array.from({ length: 24 }, (_, i) => `<rect x="98.6" y="24" width="2.8" height="7" rx="1" transform="rotate(${i * 15} 100 100)"/>`).join('')}</g>
  <g font-family="Georgia,serif" font-weight="700" font-size="9" fill="#6b5a3a" text-anchor="middle"><text x="100" y="12">N</text><text x="190" y="103">E</text><text x="100" y="196">S</text><text x="10" y="103">W</text></g>
  ${[0, 90, 180, 270].map((r, k) => `<g class="arm arm${k}" transform="rotate(${r} 100 100)"><g class="arm__in"><polygon points="100,30 88,90 100,100" fill="${k === 1 ? '#e0524a' : '#7fd0e0'}"/><polygon points="100,30 112,90 100,100" fill="${k === 1 ? '#a8302b' : '#2b8fb4'}"/></g></g>`).join('')}
  <circle cx="100" cy="100" r="24" fill="#fff" stroke="#e6dfcb" stroke-width="1.5"/>
</svg>`;

function emb(lang) {
  const t = (vi, en) => (lang === 'vi' ? vi : en);
  const k = lang === 'vi' ? 0 : 1;
  const feats = [
    [t('Sắc nét từng chi tiết', 'Sharp in every detail'), t('Chữ nhỏ, đường mảnh vẫn rõ ràng sau khi thêu.', 'Small lettering and thin lines stay clear once stitched.')],
    [t('Nhiều màu chỉ, chuyển sắc', 'Many thread colours'), t('Phối nhiều mảng màu và chuyển sắc ngay trong một logo.', 'Blend many colour fields and tonal shifts inside one logo.')],
    [t('Theo thiết kế riêng', 'Made to your design'), t('Bạn gửi file hoặc hình vẽ, xưởng thêu đúng mẫu của bạn.', 'Send a file or a sketch and we stitch your own design.')],
    [t('Thêu phẳng hoặc nổi 3D', 'Flat or raised 3D'), t('Chọn thêu phẳng tinh tế hoặc thêu nổi khối cho logo nổi bật.', 'Choose fine flat stitching or raised 3D for a logo that stands out.')],
  ].map(([h, p], i) => `<div class="feat reveal"><span class="feat__n">0${i + 1}</span><h3>${h}</h3><p>${p}</p></div>`).join('');
  const pieces = [1, 2, 3, 4, 5].map((n, i) => `<img class="piece${i === 4 ? ' piece--round' : ''}" data-i="${i}" src="/media/emb-${n}.webp" alt="" loading="lazy" decoding="async">`).join('');
  const dots = EMB_CAPS.map((c, i) => `<i data-i="${i}"></i>`).join('');
  return `<section class="emb" id="embroidery" aria-labelledby="emb-h">
  <div class="wrap emb__intro">
    <div class="sec__head reveal"><span class="eyebrow">${t('Thêu logo', 'Logo embroidery')}</span><h2 id="emb-h">${t('Chuyên thêu logo, thiết kế riêng, sắc nét từng chi tiết', 'Logo embroidery made to your design, sharp in every detail')}</h2>
      <p>${t('Gửi xưởng logo hoặc hình vẽ của bạn, xưởng thêu lại đúng từng đường nét. Thêu trên nón, trên áo, hoặc làm miếng thêu rời (patch) để gắn lên đồng phục, balo.', 'Send us your logo or artwork and we stitch every line faithfully, on caps, on shirts, or as loose patches to sew onto uniforms and bags.')}</p></div>
    <div class="feats">${feats}</div>
  </div>
  <div class="emb__track"><div class="emb__sticky"><div class="wrap emb__grid">
    <div class="emb__cap" aria-live="off"><span class="eyebrow" id="embK">${t('Mẫu xưởng đã thực hiện', 'Made at our workshop')}</span><h3 id="embT">${t('Khởi Nguồn 2019', 'Khoi Nguon 2019')}</h3><p id="embS">${EMB_CAPS[0][k]}</p><div class="emb__dots" aria-hidden="true">${dots}</div></div>
    <div class="emb__stage" id="embStage"><div class="emb__glow"></div><div class="compass" id="embCompass">${COMPASS}</div>${pieces}</div>
  </div></div></div>
  <p class="sr-only">${t('Bốn miếng thêu hình quạt và một huy hiệu tròn có bản đồ Việt Nam của sự kiện Khởi Nguồn 2019, ghép lại thành một la bàn.', 'Four fan-shaped embroidered patches and a round badge with a map of Vietnam from the Khoi Nguon 2019 event, assembled into a compass.')}</p>
  <div class="wrap emb__after reveal">
    <div class="emb__vid"><video muted loop playsinline preload="none" poster="/media/emb-video.webp" data-src="/media/emb-video.mp4" aria-label="${t('Ghép từng miếng thêu thành la bàn tại xưởng', 'Assembling the embroidered patches into a compass at the workshop')}"></video></div>
    <div><span class="eyebrow">${t('Quay tại xưởng', 'Filmed at the workshop')}</span><h3>${t('Từng miếng thêu khớp nhau chính xác', 'Every patch fits exactly')}</h3>
      <p>${t('Mỗi miếng được thêu riêng rồi ghép lại, nên viền và kích thước phải đều và khớp. Bạn có ý tưởng logo hay bộ miếng thêu riêng, gửi xưởng để được tư vấn.', 'Each piece is stitched separately and then joined, so edges and sizes must match. Got a logo or a patch set in mind? Send it over for advice.')}</p>
      <div class="band__act"><a class="btn" href="${C.zalo}" target="_blank" rel="noopener"><span>${t('Gửi logo qua Zalo', 'Send your logo on Zalo')}</span></a><a class="btn btn--ghost" href="tel:${C.tel}"><span>${ICON.phone}${C.phone}</span></a></div></div>
  </div>
</section>`;
}

// =====================================================================
// TRANG CHỦ
// =====================================================================
function home(lang) {
  const t = (vi, en) => (lang === 'vi' ? vi : en);
  const meta = {
    title: t('Xưởng may nón Minh Vy TP.HCM | Thêu logo, may nón sỉ và lẻ', 'Minh Vy Cap Factory, Ho Chi Minh City | Custom Embroidery'),
    desc: t('Xưởng may nón Minh Vy (TP.HCM), hơn 20 năm kinh nghiệm: may nón sỉ và lẻ, thêu logo theo thiết kế riêng cho trường học, công ty du lịch, shop nón. Hotline 0777 222 426.', 'Minh Vy cap factory in Ho Chi Minh City, 20+ years of experience: wholesale and retail caps with custom logo embroidery for schools, tour companies and shops.'),
  };
  const cards = RING.concat(RING, RING)
    .map(([n, vi, en]) => `<div class="card"><img src="/media/p${n}.webp" alt="" width="260" height="347" decoding="async"><i>${t(vi, en)}</i></div>`)
    .join('');
  const cats = [
    ['cap', 4, t('Nón kết', 'Baseball caps'), t('Dáng lưỡi trai quen thuộc, phối màu nhiều tông, thêu logo phẳng hoặc nổi.', 'The classic curved-brim cap in many colour combinations, flat or raised embroidery.')],
    ['mesh', 9, t('Nón lưới', 'Mesh-back caps'), t('Mặt trước thêu nổi 3D, lưng lưới thoáng, nhiều màu lưỡi trai.', 'Raised 3D front, breathable mesh back, a wide choice of brim colours.')],
    ['bucket', 13, t('Nón tai bèo', 'Bucket hats'), t('Vành rộng che nắng, hợp công trường, du lịch và sự kiện ngoài trời.', 'Wide brim for sun cover: worksites, travel and outdoor events.')],
    ['school', 1, t('Nón trường học', 'School caps'), t('Số lượng lớn, đồng màu, logo trường hoặc logo lớp rõ nét.', 'Large runs in one colour with a crisp school or class logo.')],
    ['travel', 21, t('Nón du lịch và sự kiện', 'Tour & event caps'), t('Nón đoàn, nón công ty, nón quà tặng theo màu thương hiệu.', 'Group caps, company caps and giveaways in your brand colours.')],
    ['custom', 22, t('Nón theo mẫu riêng', 'Fully custom caps'), t('Bạn đưa thiết kế, xưởng chọn vải, phối màu và làm đúng mẫu.', 'You bring the design; we pick fabric, match colours and make it to spec.')],
  ]
    .map(([id, n, name, desc]) => `<a class="cat reveal" href="${ROUTES.products[lang]}#${id}">${img(n, alt(n, lang))}<span class="cat__body"><b>${name}</b><span>${desc}</span></span><span class="cat__go">${ICON.arrow}</span></a>`)
    .join('');
  const services = [
    [ICON.box, t('Sản xuất sỉ', 'Wholesale production'), t(`Công suất khoảng ${C.capacity} đơn mỗi tháng, giao đều và đúng hẹn cho đơn lớn.`, `Around ${C.capacity} orders a month, steady and on-time delivery for big runs.`)],
    [ICON.needle, t('Thêu logo', 'Logo embroidery'), t('Thêu phẳng và thêu nổi 3D, đường chỉ sắc nét, giữ đúng màu thương hiệu.', 'Flat and raised 3D embroidery with crisp stitching that keeps your brand colours.')],
    [ICON.design, t('Gia công theo thiết kế', 'Made to your design'), t('Nhận thiết kế riêng của trường, công ty và shop; chọn vải và phối màu theo mẫu.', 'We take designs from schools, companies and shops, then choose fabric and colours to match.')],
    [ICON.user, t('Cá nhân hóa, nhận cả đơn lẻ', 'Personalised, small orders welcome'), t('Một chiếc nón thêu tên hoặc hình riêng cho từng người cũng nhận làm.', 'A single cap with your own name or artwork is welcome too.')],
  ]
    .map(([ic, name, desc]) => `<div class="svc reveal"><span class="svc__ic">${ic}</span><h3>${name}</h3><p>${desc}</p></div>`)
    .join('');
  const clients = [
    [ICON.school, t('Trường học', 'Schools'), t('Nón đồng phục theo lớp, theo khối, in thêu logo trường.', 'Uniform caps by class or grade with the school logo.')],
    [ICON.plane, t('Công ty du lịch', 'Tour companies'), t('Nón đoàn đồng bộ màu, dễ nhận diện giữa đám đông.', 'Matching group caps that stand out in a crowd.')],
    [ICON.shop, t('Shop nón', 'Cap shops'), t('Đặt theo mẫu thiết kế riêng của shop, sản xuất số lượng.', 'Made to the shop’s own designs, in volume.')],
    [ICON.user, t('Khách cá nhân', 'Individuals'), t('Thiết kế riêng cho từng cá nhân, đặt từ số lượng ít.', 'A personal design for each customer, from very small quantities.')],
  ]
    .map(([ic, name, desc]) => `<div class="cli reveal"><span class="svc__ic">${ic}</span><h3>${name}</h3><p>${desc}</p></div>`)
    .join('');

  const body = `
<section class="hero" id="hero">
  <div class="hero__stars" id="stars" aria-hidden="true"><i id="stA"></i><i id="stB"></i></div>
  <div class="hero__copy">
    <div class="badge rise" style="--i:1"><i>${ICON.needle}</i><b>${t('Hơn 20 năm kinh nghiệm may nón', 'Over 20 years making caps')}</b></div>
    <h1><span class="rise" style="--i:2">${t('Xưởng may nón', 'Cap workshop')}</span><span class="rise" style="--i:3">${t('Thêu theo ý bạn', 'Embroidered your way')}</span></h1>
    <p class="hero__sub rise" style="--i:4">${t('Sản xuất sỉ và lẻ mọi loại nón. Thêu logo theo thiết kế riêng cho trường học, công ty du lịch, shop nón và từng khách hàng.', 'Wholesale and retail caps and hats of every kind, with logo embroidery to the design of schools, tour companies, cap shops and individual customers.')}</p>
    <div class="hero__cta rise" style="--i:5"><a class="btn btn--lg" href="${ROUTES.products[lang]}"><span>${t('Xem sản phẩm', 'See products')}</span></a><a class="btn btn--ghost btn--lg" href="tel:${C.tel}"><span>${ICON.phone}${C.phone}</span></a></div>
  </div>
  <div class="hero__stage rise" style="--i:6" id="stage">
    <div class="stage__canvas" id="canvas">
      <div class="ring" id="ring" aria-hidden="true">${cards}</div>
      <div class="window">
        <div class="window__bar"><span class="dots"><i></i><i></i><i></i></span><span class="window__url">${t('minhvy · xưởng thêu nón', 'minhvy · embroidery floor')}</span></div>
        <div class="window__body"><video id="reel" muted loop playsinline preload="metadata" poster="/media/v-showreel.webp" data-src="/media/v-showreel.mp4" aria-label="${t('Máy thêu nón đang chạy', 'Embroidery machines at work')}"></video></div>
      </div>
    </div>
  </div>
</section>

<section class="stats"><div class="wrap stats__grid">
  <div class="stat reveal"><b data-count="${C.years}" data-suffix="+">${C.years}+</b><span>${t('năm kinh nghiệm', 'years of experience')}</span></div>
  <div class="stat reveal"><b data-count="10000">${C.capacity}</b><span>${t('đơn mỗi tháng', 'orders a month')}</span></div>
  <div class="stat reveal"><b>${t('Sỉ và lẻ', 'Bulk & single')}</b><span>${t('nhận mọi số lượng', 'any quantity welcome')}</span></div>
  <div class="stat reveal"><b>${t('Mọi loại nón', 'Every style')}</b><span>${t('theo mẫu thiết kế riêng', 'to your own design')}</span></div>
</div></section>

${vault(lang)}

${emb(lang)}

<section class="sec"><div class="wrap">
  ${head(lang, t('Sản phẩm', 'Products'), t('Làm được mọi loại nón', 'Every kind of cap and hat'), t('Từ nón kết, nón lưới đến nón tai bèo. Bạn chỉ cần có ý tưởng, xưởng lo phần còn lại.', 'From baseball caps and mesh caps to bucket hats. Bring the idea and we handle the rest.'))}
  <div class="cats">${cats}</div>
</div></section>

<section class="sec sec--tint"><div class="wrap">
  ${head(lang, t('Dịch vụ', 'Services'), t('Sản xuất sỉ, thêu logo, làm theo mẫu', 'Wholesale, embroidery, made to order'), '')}
  <div class="grid4">${services}</div>
</div></section>

<section class="sec"><div class="wrap split">
  <div class="split__txt reveal">
    <span class="eyebrow">${t('Quy trình', 'Process')}</span>
    <h2>${t('Nhìn tận mắt cách một chiếc nón ra đời', 'See how a cap is made, up close')}</h2>
    <p>${t('Thêu, may ráp, ép định hình rồi kiểm tra: mỗi công đoạn có người làm nghề theo dõi. Đây là cảnh thật tại xưởng.', 'Embroidery, sewing, forming and inspection, each watched by people who know the trade. These are real scenes from our workshop.')}</p>
    <a class="link" href="${ROUTES.process[lang]}">${t('Xem quy trình', 'View the process')}${ICON.arrow}</a>
  </div>
  <div class="split__vid reveal"><div class="vid">${video('forming')}</div><div class="vid">${video('embroidery')}</div></div>
</div></section>

<section class="sec sec--tint"><div class="wrap">
  ${head(lang, t('Khách hàng', 'Customers'), t('Chúng tôi làm nón cho ai', 'Who we make caps for'), '')}
  <div class="grid4">${clients}</div>
</div></section>

<section class="sec"><div class="wrap">
  ${head(lang, t('Sản phẩm đã thực hiện', 'Work we have made'), t('Một số mẫu nón của xưởng', 'A few caps from our workshop'), t('Bấm vào ảnh để xem lớn hơn.', 'Tap a photo to view it larger.'))}
  <div class="gallery">${gal([7, 9, 22, 13, 18, 21, 23, 5, 14, 15, 24, 11], lang)}</div>
  <p class="center reveal"><a class="link" href="${ROUTES.products[lang]}#all">${t('Xem tất cả sản phẩm', 'See all products')}${ICON.arrow}</a></p>
</div></section>

${ctaBand(lang)}`;
  return { meta, body };
}

// =====================================================================
// GIỚI THIỆU
// =====================================================================
function about(lang) {
  const t = (vi, en) => (lang === 'vi' ? vi : en);
  const meta = {
    title: t('Giới thiệu xưởng may nón Minh Vy | Hơn 20 năm kinh nghiệm', 'About Minh Vy | Cap factory with 20+ years of experience'),
    desc: t('Minh Vy là xưởng may nón với hơn 20 năm kinh nghiệm, công suất khoảng 10.000 đơn mỗi tháng, nhận cả đơn lẻ và đơn sỉ.', 'Minh Vy is a cap workshop with over 20 years of experience, around 10,000 orders a month, taking both small and wholesale orders.'),
  };
  const body = `
<section class="pagehead"><div class="wrap">
  <span class="eyebrow">${t('Giới thiệu', 'About us')}</span>
  <h1>${t('Hơn 20 năm làm nón, từ chiếc đầu tiên đến hàng nghìn chiếc', 'Over 20 years of making caps, from one to thousands')}</h1>
  <p>${t('Minh Vy là xưởng sản xuất và gia công nón vải tại TP. Hồ Chí Minh. Chúng tôi may và thêu nón cho trường học, công ty du lịch, shop nón và khách đặt theo thiết kế riêng.', 'Minh Vy is a cap manufacturing and subcontracting workshop in Ho Chi Minh City. We sew and embroider caps for schools, tour companies, cap shops and customers with their own designs.')}</p>
</div></section>

<section class="sec"><div class="wrap split">
  <div class="split__txt reveal">
    <h2>${t('Xưởng làm nón, làm từ gốc', 'A workshop that makes caps from scratch')}</h2>
    <p>${t('Từ thêu, may ráp đến ép định hình đều thực hiện tại xưởng, nên chúng tôi kiểm soát được chất lượng, màu sắc và thời gian giao hàng cho từng đơn.', 'Embroidery, sewing and forming are all done in our own workshop, so we control quality, colour and delivery time on every order.')}</p>
    <p>${t('Đơn lẻ hay đơn sỉ, chúng tôi đều nhận. Một chiếc nón thêu tên riêng hay cả nghìn chiếc đồng phục cho trường đều được làm cẩn thận như nhau.', 'Small or wholesale, we take both. A single cap with a personal name and a thousand school uniform caps get the same careful work.')}</p>
  </div>
  <div class="split__vid reveal"><div class="vid vid--wide">${video('showreel')}</div></div>
</div></section>

<section class="sec sec--tint"><div class="wrap">
  <div class="stats__grid">
    <div class="stat reveal"><b data-count="${C.years}" data-suffix="+">${C.years}+</b><span>${t('năm kinh nghiệm', 'years of experience')}</span></div>
    <div class="stat reveal"><b data-count="10000">${C.capacity}</b><span>${t('đơn mỗi tháng', 'orders a month')}</span></div>
    <div class="stat reveal"><b>${t('Sỉ và lẻ', 'Bulk & single')}</b><span>${t('không giới hạn số lượng tối thiểu', 'no strict minimum')}</span></div>
    <div class="stat reveal"><b>${t('Mọi loại nón', 'Every style')}</b><span>${t('thêu theo thiết kế riêng', 'embroidered to your design')}</span></div>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  ${head(lang, t('Giá trị', 'What we stand for'), t('Điều khách hàng nhận được', 'What you can expect'), '')}
  <div class="grid3">
    <div class="svc reveal"><span class="svc__ic">${ICON.needle}</span><h3>${t('Đường thêu sắc nét', 'Crisp stitching')}</h3><p>${t('Thêu phẳng hoặc thêu nổi 3D, giữ đúng hình và màu logo của bạn.', 'Flat or raised 3D embroidery that keeps your logo’s shape and colour.')}</p></div>
    <div class="svc reveal"><span class="svc__ic">${ICON.design}</span><h3>${t('Làm đúng thiết kế', 'Built to your design')}</h3><p>${t('Bạn đưa mẫu, xưởng lo vải, phối màu và làm đúng mẫu đó.', 'You bring the design; we handle fabric, colours and match it.')}</p></div>
    <div class="svc reveal"><span class="svc__ic">${ICON.box}</span><h3>${t('Giao đúng hẹn', 'On-time delivery')}</h3><p>${t('Sản xuất liên tục, công suất lớn nên đơn sỉ vẫn giao đều.', 'Continuous production and high capacity keep wholesale orders on schedule.')}</p></div>
  </div>
</div></section>

<section class="sec sec--tint"><div class="wrap">
  ${head(lang, t('Một góc xưởng', 'Inside the workshop'), t('Nón đã làm tại xưởng', 'Caps made in our workshop'), '')}
  <div class="gallery">${gal([3, 2, 10, 29, 28, 19, 20, 17], lang)}</div>
</div></section>
${ctaBand(lang)}`;
  return { meta, body };
}

// =====================================================================
// SẢN PHẨM
// =====================================================================
function products(lang) {
  const t = (vi, en) => (lang === 'vi' ? vi : en);
  const meta = {
    title: t('Nón kết, nón lưới, nón tai bèo thêu logo theo mẫu | Minh Vy', 'Baseball caps, mesh caps, bucket hats with custom logo | Minh Vy'),
    desc: t('Nón kết, nón lưới, nón tai bèo, nón trường học, nón du lịch và nón theo mẫu riêng. Thêu phẳng và thêu nổi 3D, nhận sỉ và lẻ.', 'Baseball caps, mesh caps, bucket hats, school and tour caps and fully custom designs. Flat and raised 3D embroidery, wholesale and retail.'),
  };
  const groups = [
    ['cap', t('Nón kết', 'Baseball caps'), t('Dáng lưỡi trai quen thuộc, hợp mọi lứa tuổi. Phối hai tông màu giữa thân và lưỡi trai, thêu logo ở mặt trước.', 'The familiar curved-brim cap that suits every age. Two-tone body and brim, with the logo embroidered on the front.'), [4, 11, 18, 20, 19]],
    ['mesh', t('Nón lưới', 'Mesh-back caps'), t('Mặt trước thêu chữ nổi 3D, lưng lưới thoáng khí. Có nhiều màu lưỡi trai để phối.', 'Raised 3D lettering on the front and a breathable mesh back, with plenty of brim colours to pair.'), [6, 7, 9, 8, 10]],
    ['bucket', t('Nón tai bèo', 'Bucket hats'), t('Vành rộng che nắng, thêu logo hoặc tên công ty ở thân nón. Hợp công trường, du lịch và sự kiện ngoài trời.', 'A wide brim for sun cover, with a logo or company name on the crown. Good for worksites, travel and outdoor events.'), [13, 12, 24, 25, 28, 29]],
    ['school', t('Nón trường học', 'School caps'), t('Số lượng lớn, đồng màu theo lớp hoặc theo khối, có logo trường hoặc logo lớp.', 'Large runs in one colour per class or grade, with the school or class logo.'), [1, 2, 16, 17]],
    ['travel', t('Nón du lịch và sự kiện', 'Tour & event caps'), t('Nón đoàn đồng bộ màu, nón công ty, nón quà tặng theo màu thương hiệu.', 'Matching group caps, company caps and giveaways in your brand colours.'), [5, 14, 21, 15]],
    ['custom', t('Nón theo mẫu riêng', 'Fully custom caps'), t('Bạn gửi thiết kế, xưởng chọn vải, phối màu và làm đúng mẫu. Nhận cả đơn cá nhân hóa từ số lượng ít.', 'Send your design and we choose fabric, match colours and make it to spec. Personalised orders from small quantities are welcome.'), [22, 23, 3]],
  ];
  const sections = groups
    .map(([id, name, desc, list], i) => `<section class="sec${i % 2 ? ' sec--tint' : ''}" id="${id}"><div class="wrap">
  <div class="sec__head reveal"><span class="eyebrow">0${i + 1}</span><h2>${name}</h2><p>${desc}</p></div>
  <div class="gallery gallery--sm">${gal(list, lang)}</div></div></section>`)
    .join('');
  const techniques = [
    [t('Thêu phẳng', 'Flat embroidery'), t('Logo và chữ thêu phẳng, đường chỉ mịn, phù hợp hầu hết mẫu nón.', 'Smooth flat logos and lettering, suitable for almost every cap.')],
    [t('Thêu nổi 3D', 'Raised 3D embroidery'), t('Chữ và hình nổi lên mặt nón, tạo cảm giác dày dặn, cá tính.', 'Letters and shapes that rise from the cap for a bold, textured look.')],
    [t('Thêu tên, thêu theo cá nhân', 'Names & personalised'), t('Thêu tên riêng hoặc hình riêng cho từng người, đặt từ số lượng ít.', 'Personal names or artwork for each wearer, even in small quantities.')],
  ].map(([n, d]) => `<div class="svc reveal"><span class="svc__ic">${ICON.needle}</span><h3>${n}</h3><p>${d}</p></div>`).join('');
  const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 28, 29];
  const body = `
<section class="pagehead"><div class="wrap">
  <span class="eyebrow">${t('Sản phẩm', 'Products')}</span>
  <h1>${t('Mọi loại nón, thêu theo thiết kế của bạn', 'Every kind of cap, embroidered to your design')}</h1>
  <p>${t('Đây là các nhóm nón xưởng thường làm. Nếu bạn cần kiểu khác, cứ gửi mẫu, xưởng sẽ tư vấn cách làm.', 'These are the groups we make most often. If you need something else, send us a sample and we will advise how to make it.')}</p>
  <div class="chips">${groups.map(([id, name]) => `<a href="#${id}">${name}</a>`).join('')}</div>
</div></section>
${sections}
<section class="sec sec--tint"><div class="wrap">
  ${head(lang, t('Kỹ thuật thêu', 'Embroidery'), t('Thêu đẹp là điểm làm nên chiếc nón', 'Good embroidery makes the cap'), '')}
  <div class="grid3">${techniques}</div>
</div></section>
<section class="sec" id="all"><div class="wrap">
  ${head(lang, t('Tất cả', 'Everything'), t('Toàn bộ sản phẩm đã thực hiện', 'All the work we have made'), t('Bấm vào ảnh để xem lớn hơn.', 'Tap a photo to view it larger.'))}
  <div class="gallery gallery--sm">${gal(all, lang)}</div>
</div></section>
${ctaBand(lang)}`;
  return { meta, body };
}

// =====================================================================
// QUY TRÌNH
// =====================================================================
function process(lang) {
  const t = (vi, en) => (lang === 'vi' ? vi : en);
  const meta = {
    title: t('Quy trình may nón và thêu logo tại xưởng | Minh Vy', 'How we make caps and embroider logos | Minh Vy'),
    desc: t('Quy trình làm nón tại xưởng Minh Vy: nhận thiết kế, thêu, may ráp, ép định hình, kiểm tra và giao hàng.', 'How Minh Vy makes caps: receiving your design, embroidery, sewing, forming, inspection and delivery.'),
  };
  const steps = [
    [t('Nhận thiết kế', 'Receive the design'), t('Bạn gửi logo, màu sắc, kiểu nón và số lượng qua Zalo hoặc điện thoại. Xưởng tư vấn chất liệu và cách thêu phù hợp, rồi báo giá.', 'Send the logo, colours, cap style and quantity by Zalo or phone. We advise on fabric and the best embroidery method, then give a quote.'), null],
    [t('Thêu', 'Embroidery'), t('Các mảnh nón được thêu logo bằng máy thêu. Thêu phẳng hoặc thêu nổi 3D tùy thiết kế.', 'Cap panels are embroidered on machines, flat or raised 3D depending on the design.'), 'embroidery'],
    [t('May ráp', 'Sewing'), t('Thợ may ráp các mảnh thân, lưỡi trai và các chi tiết thành chiếc nón hoàn chỉnh.', 'Our sewers join the crown, brim and details into a finished cap.'), 'sewing'],
    [t('Ép định hình', 'Forming'), t('Nón được ép trên khuôn để lên form chuẩn, đều dáng và đẹp.', 'Caps are pressed on a mould to hold a clean, even shape.'), 'forming'],
    [t('Kiểm tra và giao hàng', 'Inspect & deliver'), t('Kiểm tra từng chiếc về đường thêu, đường may và dáng nón rồi đóng gói giao đúng hẹn.', 'Each cap is checked for stitching, seams and shape, then packed and delivered on schedule.'), 'finished'],
  ];
  const list = steps
    .map(([name, desc, vid], i) => `<article class="step reveal${i % 2 ? ' step--rev' : ''}">
  <div class="step__txt"><span class="step__n">0${i + 1}</span><h3>${name}</h3><p>${desc}</p></div>
  <div class="step__vid">${vid ? `<div class="vid">${video(vid)}</div>` : `<div class="vid vid--still">${img(22, alt(22, lang))}</div>`}</div>
</article>`)
    .join('');
  const body = `
<section class="pagehead"><div class="wrap">
  <span class="eyebrow">${t('Quy trình', 'Process')}</span>
  <h1>${t('Từ ý tưởng đến chiếc nón hoàn chỉnh', 'From idea to finished cap')}</h1>
  <p>${t('Năm bước chính trong quy trình làm nón. Các đoạn video dưới đây là cảnh thật tại xưởng.', 'The five main steps of making a cap. The clips below are real scenes from our workshop.')}</p>
</div></section>
<section class="sec"><div class="wrap steps">${list}</div></section>
${ctaBand(lang)}`;
  return { meta, body };
}

// =====================================================================
// LIÊN HỆ
// =====================================================================
function contact(lang) {
  const t = (vi, en) => (lang === 'vi' ? vi : en);
  const meta = {
    title: t('Liên hệ Minh Vy | Báo giá may nón sỉ, thêu logo TP.HCM', 'Contact Minh Vy | Quotes for wholesale caps and logo embroidery'),
    desc: t('Liên hệ xưởng Minh Vy: 0777 222 426 (gọi, Zalo). 78/8 Nguyễn Văn Quá, Phường Đông Hưng Thuận, TP. Hồ Chí Minh.', 'Contact Minh Vy: +84 777 222 426 (call or Zalo). 78/8 Nguyen Van Qua, Dong Hung Thuan Ward, Ho Chi Minh City.'),
  };
  const mapQ = encodeURIComponent(C.address);
  const body = `
<section class="pagehead"><div class="wrap">
  <span class="eyebrow">${t('Liên hệ', 'Contact')}</span>
  <h1>${t('Gọi hoặc nhắn Zalo để được báo giá', 'Call or message us on Zalo for a quote')}</h1>
  <p>${t('Gửi logo, kiểu nón và số lượng, xưởng sẽ tư vấn và báo giá. Nhận cả đơn lẻ và đơn sỉ.', 'Send your logo, cap style and quantity and we will advise and quote. Small orders and wholesale both welcome.')}</p>
</div></section>
<section class="sec"><div class="wrap contact">
  <div class="contact__cards">
    <a class="ccard reveal" href="tel:${C.tel}"><span class="svc__ic">${ICON.phone}</span><span><small>${t('Điện thoại', 'Phone')}</small><b>${C.phone}</b></span></a>
    <a class="ccard reveal" href="${C.zalo}" target="_blank" rel="noopener"><span class="svc__ic zalo">${ICON.zalo}</span><span><small>Zalo</small><b>${C.phone}</b></span></a>
    <a class="ccard reveal" href="https://www.google.com/maps/search/?api=1&query=${mapQ}" target="_blank" rel="noopener"><span class="svc__ic">${ICON.pin}</span><span><small>${t('Địa chỉ xưởng', 'Workshop address')}</small><b>${C.address}</b></span></a>
    ${C.email ? `<a class="ccard reveal" href="mailto:${C.email}"><span class="svc__ic">${ICON.mail}</span><span><small>Email</small><b>${C.email}</b></span></a>` : ''}
    <div class="note reveal"><b>${t('Khi liên hệ, bạn nên gửi sẵn', 'When you get in touch, please send')}</b><ul><li>${t('Logo hoặc hình thiết kế (file ảnh càng rõ càng tốt)', 'Your logo or artwork (the clearer the file the better)')}</li><li>${t('Kiểu nón và màu mong muốn', 'Cap style and colours you want')}</li><li>${t('Số lượng và thời gian cần nhận', 'Quantity and when you need them')}</li></ul></div>
  </div>
  <div class="map reveal"><iframe title="${t('Bản đồ xưởng Minh Vy', 'Minh Vy workshop map')}" src="https://www.google.com/maps?q=${mapQ}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>
</div></section>`;
  return { meta, body };
}

const PAGES = { home, about, products, process, contact };

function build(lang, key) {
  const { meta, body } = PAGES[key](lang);
  return layout(lang, key, meta, body);
}

module.exports = { build, PAGES, ROUTES };
