/* Minh Vy - hành vi trang: menu, vòng ảnh 3D, hiện dần khi cuộn, video lười tải, xem ảnh lớn */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Menu trên màn hình hẹp ---------- */
  var nav = $('#nav'), burger = $('.burger'), menu = $('#navmenu');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); }
  });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1020) setMenu(false); });

  /* ---------- Giao diện sáng / tối ---------- */
  var root = document.documentElement, themeBtn = $('.theme'), themeMeta = $('meta[name="theme-color"]');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-pressed', t === 'light' ? 'true' : 'false');
    if (themeMeta) themeMeta.content = t === 'light' ? '#fdf2cc' : '#0b0a0a';
  }
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem('mv-theme', next); } catch (e) {}
  });

  /* ---------- Hiện dần khi cuộn ---------- */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el, i) { el.style.setProperty('--d', (i % 4) * 70 + 'ms'); io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Đếm số ---------- */
  var lang = document.documentElement.lang === 'en' ? 'en-US' : 'vi-VN';
  $$('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce || !('IntersectionObserver' in window)) return;
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      o.disconnect();
      var t0 = performance.now(), dur = 1400;
      (function tick(t) {
        var p = Math.min((t - t0) / dur, 1), v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.textContent = v.toLocaleString(lang) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    }, { threshold: 0.6 });
    o.observe(el);
  });

  /* ---------- Video chỉ tải và chạy khi nhìn thấy ---------- */
  var vids = $$('video[data-src]');
  if ('IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          if (!v.src) v.src = v.getAttribute('data-src');
          if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (v.src) { v.pause(); }
      });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { vo.observe(v); });
  } else {
    vids.forEach(function (v) { v.src = v.getAttribute('data-src'); });
  }

  /* ---------- Xem ảnh lớn ---------- */
  var lb = $('#lb');
  if (lb) {
    var shots = $$('[data-lb]'), cur = -1, opener = null;
    var lbImg = $('img', lb), lbCap = $('figcaption', lb);
    var show = function (i) {
      cur = (i + shots.length) % shots.length;
      lbImg.src = shots[cur].getAttribute('href');
      lbImg.alt = shots[cur].getAttribute('data-cap') || '';
      lbCap.textContent = lbImg.alt;
    };
    var close = function () { lb.hidden = true; document.body.style.overflow = ''; if (opener) opener.focus(); };
    shots.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        e.preventDefault(); opener = a; show(i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('.lb__x', lb).focus();
      });
    });
    $('.lb__x', lb).addEventListener('click', close);
    $('.lb__prev', lb).addEventListener('click', function () { show(cur - 1); });
    $('.lb__next', lb).addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  /* ---------- Tủ mẫu 4 ngăn: tiến độ cuộn điều khiển từng ngăn ---------- */
  var vault = $('#vault');
  if (vault && !reduce) {
    var vTrack = $('.vault__track', vault), vItems = $$('.item', vault), vVids = vItems.map(function (it) { return $('.item__vid', it); }), vDrawers = $$('.drawer', vault);
    var ease = function (x) { return 1 - Math.pow(1 - x, 3); };
    var clamp01 = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
    var vTick = false;
    var vRender = function () {
      vTick = false;
      var r = vTrack.getBoundingClientRect(), span = r.height - window.innerHeight;
      var p = span > 0 ? clamp01(-r.top / span) : 0, N = vItems.length, seg = p * N;
      for (var i = 0; i < N; i++) {
        var u = seg - i, inn = ease(clamp01(u / 0.4)), out = i < N - 1 ? ease(clamp01((u - 0.8) / 0.2)) : 0;
        var vis = inn * (1 - out), y = (1 - inn) * 70 - out * 50;
        var it = vItems[i];
        it.style.opacity = vis.toFixed(3);
        it.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0) scale(' + (0.92 + 0.08 * inn - 0.04 * out).toFixed(4) + ')';
        var on = vis > 0.5;
        it.classList.toggle('is-on', on);
        var vv = vVids[i];
        if (vv) {
          if (on) { if (!vv.getAttribute('src')) vv.src = vv.getAttribute('data-vsrc'); if (vv.paused) { var pp = vv.play(); if (pp && pp.catch) pp.catch(function () {}); } }
          else if (!vv.paused) vv.pause();
        }
        vDrawers[i].style.setProperty('--o', vis.toFixed(3));
        vDrawers[i].classList.toggle('is-on', vis > 0.5);
      }
    };
    var vReq = function () { if (!vTick) { vTick = true; requestAnimationFrame(vRender); } };
    window.addEventListener('scroll', vReq, { passive: true });
    window.addEventListener('resize', vReq);
    vRender();
  }

  /* ---------- Hero: sao nền + vòng ảnh 3D ---------- */
  var hero = $('#hero');
  if (!hero) return;

  // Sao: hai lớp 1px, toàn bộ nằm trong một danh sách box-shadow.
  function stars() {
    var w = hero.offsetWidth, h = hero.offsetHeight;
    function make(n, blur, a0, a1) {
      var s = [];
      for (var i = 0; i < n; i++) {
        s.push(Math.round(Math.random() * w) + 'px ' + Math.round(Math.random() * h) + 'px ' + blur + 'px 0 rgba(255,255,255,' + (a0 + Math.random() * (a1 - a0)).toFixed(2) + ')');
      }
      return s.join(',');
    }
    $('#stA').style.boxShadow = make(150, 0, 0.05, 0.3);
    $('#stB').style.boxShadow = make(18, 1.2, 0.35, 0.7);
  }
  stars();

  // Tỷ lệ: khung thiết kế rộng 1172px, thu nhỏ để vừa chiều ngang màn hình.
  // Điện thoại và máy tính bảng chỉ lấy phần giữa của khung (cắt hai bên) để ảnh không bị quá nhỏ.
  var stage = $('#stage');
  function scale() {
    var vw = window.innerWidth;
    var visible = vw <= 640 ? 760 : vw <= 1020 ? 1000 : 1172;
    var k = Math.min(vw / visible, 1.35);
    stage.style.setProperty('--k', k.toFixed(4));
  }
  scale();
  var rt;
  window.addEventListener('resize', function () { scale(); clearTimeout(rt); rt = setTimeout(stars, 300); });

  // Vòng 3D: các thẻ nằm trên mặt trụ, camera đặt đúng tâm vòng nên mỗi thẻ luôn hướng thẳng vào camera.
  // R = 891 (cũng là perspective), bước = 360/n, chỉ vẽ thẻ trong góc ±42° (nửa sau bị ẩn).
  var cards = $$('.card', $('#ring'));
  var n = cards.length, R = 891, step = 360 / n, CULL = 42, SPEED = 2.4, phase = -2, last = 0;
  function place() {
    for (var i = 0; i < n; i++) {
      var a = (((i * step + phase) % 360) + 540) % 360 - 180;
      var el = cards[i];
      if (Math.abs(a) > CULL) { el.style.visibility = 'hidden'; continue; }
      el.style.visibility = 'visible';
      var r = a * Math.PI / 180, c = Math.cos(r);
      el.style.transform = 'translate3d(' + (R * Math.sin(r)).toFixed(2) + 'px,0,' + (R * (1 - c)).toFixed(2) + 'px) rotateY(' + (-a).toFixed(3) + 'deg)';
      el.style.filter = 'brightness(' + (0.84 + 0.5 * (1 / c - 1)).toFixed(3) + ')';
    }
  }
  function tick(t) {
    if (!last) last = t;
    var dt = Math.min((t - last) / 1000, 0.1);
    last = t;
    phase -= SPEED * dt;
    place();
    raf = requestAnimationFrame(tick);
  }
  var raf = 0;
  place();
  if (!reduce) {
    raf = requestAnimationFrame(tick);
    document.addEventListener('visibilitychange', function () {
      last = 0;
      if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(tick);
    });
  }
})();
