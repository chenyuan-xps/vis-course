/* =============================================================
 * portal.js — 门户各页共享脚本（零依赖）
 *   1) 开屏动画控制：仅首次访问播放一次（localStorage 记忆），
 *      点击 / 按键可跳过；支持「重播」按钮重新插入动画节点
 *   2) 知识地图 / 课程数据一览 / 卡片标签胶囊渲染（按页有无该
 *      SVG 自动跳过，双语随 i18n 切换重绘）
 * ============================================================= */
(function () {
  'use strict';

  /* ==========================================================
   * 1. 开屏动画
   * ========================================================== */
  var KEY = 'wbl-splash';
  var splash = document.getElementById('splash');
  var splashHTML = splash ? splash.outerHTML : '';
  var timer = 0;

  function readSeen() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function markSeen() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  function bind(s) {
    /* 点击任意处 / 按任意键立即跳过（仅首次播放时生效） */
    s.addEventListener('click', skip);
    document.addEventListener('keydown', skip, { once: true });
  }

  function skip() {
    if (!splash) return;
    window.clearTimeout(timer);
    splash.classList.add('is-out');       // 由 CSS 直接隐藏，不再参与布局
    markSeen();
  }

  function finish() {
    if (splash && splash.parentNode) splash.parentNode.removeChild(splash);
    splash = null;
    window.clearTimeout(timer);
  }

  /* 注意：子元素的 splash-rise 动画同样会冒泡 animationend，需按 target 过滤 */
  function watchEnd(s) {
    s.addEventListener('animationend', function (e) {
      if (e.target === s && e.animationName === 'splash-out') finish();
    });
  }

  if (splash) {
    if (readSeen()) {
      /* 已看过：head 中的前置脚本已把它藏起来，这里直接移出 DOM */
      finish();
    } else {
      bind(splash);
      watchEnd(splash);
      timer = window.setTimeout(finish, 3300);   // CSS 动画 3.15s 结束
    }
  }

  /* 「重播开屏」：重新插入一份全新节点，动画自然从头播放 */
  var replay = document.querySelector('[data-replay-splash]');
  if (replay) {
    replay.addEventListener('click', function () {
      if (splash) return;                 // 正在播放中
      if (!splashHTML) return;
      document.body.insertAdjacentHTML('afterbegin', splashHTML);
      splash = document.getElementById('splash');
      if (!splash) return;
      bind(splash);
      watchEnd(splash);
      window.clearTimeout(timer);
      timer = window.setTimeout(finish, 3300);
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

  /* ==========================================================
   * 2. 知识地图 / 数据一览 / 标签胶囊
   * ========================================================== */
  var CHAPTERS = [
    { href: 'lesson-01/', key: '01', color: '#2563eb' },
    { href: 'lesson-02/', key: '02', color: '#7c3aed' },
    { href: 'lesson-03/', key: '03', color: '#db2777' },
    { href: 'lesson-04/', key: '04', color: '#ea580c' },
    { href: 'lesson-05/', key: '05', color: '#059669' }
  ];
  var SECTIONS = [5, 4, 8, 5, 5];
  var NS = 'http://www.w3.org/2000/svg';

  var mapSvg = document.getElementById('course-map');
  var statsSvg = document.getElementById('course-stats');

  function el(name, attrs, text) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function t(key) {
    return (window.__i18n && window.__i18n.t(key)) || key;
  }

  /* ---- 课程知识地图 ---- */
  function renderMap() {
    if (!mapSvg) return;
    mapSvg.innerHTML = '';
    var cx0 = 100, gap = 200, nodeY = 52;

    CHAPTERS.forEach(function (ch, i) {
      var cx = cx0 + i * gap;

      // 章间连线 + 箭头
      if (i < CHAPTERS.length - 1) {
        mapSvg.appendChild(el('line', { x1: cx + 30, y1: nodeY, x2: cx + gap - 34, y2: nodeY,
          stroke: '#cbd5e1', 'stroke-width': 2 }));
        mapSvg.appendChild(el('path', { d: 'M' + (cx + gap - 38) + ' ' + (nodeY - 5) +
          ' l6 5 l-6 5', fill: 'none', stroke: '#94a3b8', 'stroke-width': 2 }));
      }

      var g = el('g', { class: 'map-chapter', 'data-href': ch.href });
      g.style.cursor = 'pointer';

      // 章节点
      g.appendChild(el('circle', { cx: cx, cy: nodeY, r: 26, fill: ch.color }));
      g.appendChild(el('text', { x: cx, y: nodeY + 6, class: 'map-num', 'text-anchor': 'middle' },
        String(i + 1)));
      g.appendChild(el('text', { x: cx, y: nodeY + 46, class: 'map-title', 'text-anchor': 'middle' },
        t('card-' + ch.key + '.title')));

      // 知识点胶囊（纵向树）
      var points = t('card-' + ch.key + '.tags').split(' · ');
      points.forEach(function (p, j) {
        var py = nodeY + 64 + j * 30;
        g.appendChild(el('line', { x1: cx, y1: nodeY + 52, x2: cx, y2: py,
          stroke: ch.color, 'stroke-opacity': 0.28, 'stroke-width': 1.5 }));
        var chip = el('g', { class: 'map-chip' });
        chip.appendChild(el('rect', { x: cx - 90, y: py, width: 180, height: 23, rx: 11,
          fill: '#fff', stroke: ch.color, 'stroke-opacity': 0.4 }));
        var label = p.length > 16 ? p.slice(0, 15) + '…' : p;
        chip.appendChild(el('text', { x: cx, y: py + 15, class: 'map-point', 'text-anchor': 'middle' }, label));
        var tip = el('title', {}, p);
        chip.insertBefore(tip, chip.firstChild);
        g.appendChild(chip);
      });

      g.addEventListener('click', function () { location.href = ch.href; });
      mapSvg.appendChild(g);
    });
  }

  /* ---- 课程数据一览：条形 = 小节数，圆点 = 知识点数 ---- */
  function renderStats() {
    if (!statsSvg) return;
    statsSvg.innerHTML = '';
    var x0 = 230, unit = 58, maxU = 8, rowH = 50, top = 46;

    for (var u = 0; u <= maxU; u += 2) {
      var gx = x0 + u * unit;
      statsSvg.appendChild(el('line', { x1: gx, y1: top - 18, x2: gx, y2: top + SECTIONS.length * rowH - 12,
        stroke: '#e2e8f0', 'stroke-width': 1 }));
      statsSvg.appendChild(el('text', { x: gx, y: top + SECTIONS.length * rowH + 6, class: 'stat-axis',
        'text-anchor': 'middle' }, String(u)));
    }
    statsSvg.appendChild(el('text', { x: x0 + maxU * unit / 2, y: top + SECTIONS.length * rowH + 26,
      class: 'stat-axis', 'text-anchor': 'middle' }, t('portal.stats.axis')));

    CHAPTERS.forEach(function (ch, i) {
      var y = top + i * rowH;
      var points = t('card-' + ch.key + '.tags').split(' · ').length;
      var g = el('g', { class: 'stat-row' });
      g.style.cursor = 'pointer';

      g.appendChild(el('circle', { cx: 22, cy: y, r: 13, fill: ch.color }));
      g.appendChild(el('text', { x: 22, y: y + 4, class: 'stat-num', 'text-anchor': 'middle' }, String(i + 1)));
      var title = t('card-' + ch.key + '.title');
      if (title.length > 9) title = title.slice(0, 8) + '…';
      g.appendChild(el('text', { x: 44, y: y + 4, class: 'stat-ch-title' }, title));

      g.appendChild(el('rect', { class: 'bar', x: x0, y: y - 11, width: SECTIONS[i] * unit, height: 22,
        rx: 5, fill: ch.color }));
      g.appendChild(el('text', { x: x0 + SECTIONS[i] * unit + 10, y: y + 4, class: 'stat-value',
        fill: ch.color }, String(SECTIONS[i])));

      var dotsX = x0 + maxU * unit + 46;
      for (var j = 0; j < points; j++) {
        g.appendChild(el('circle', { cx: dotsX + j * 18, cy: y, r: 5.5, fill: ch.color,
          'fill-opacity': 0.85 }));
      }

      g.appendChild(el('title', {}, t('card-' + ch.key + '.title') + ' — ' + SECTIONS[i] + ' / ' + points));
      g.addEventListener('click', function () { location.href = ch.href; });
      statsSvg.appendChild(g);
    });

    statsSvg.appendChild(el('text', { x: x0 + maxU * unit + 46, y: top - 18, class: 'stat-axis' },
      t('portal.stats.dots')));
  }

  /* ---- 卡片标签胶囊（随语言重建） ---- */
  function renderTagPills() {
    document.querySelectorAll('.card-tags[data-tags]').forEach(function (ul) {
      var parts = t(ul.getAttribute('data-tags')).split(' · ');
      ul.innerHTML = parts.map(function (p) { return '<li>' + p + '</li>'; }).join('');
    });
  }

  function renderAll() { renderMap(); renderStats(); renderTagPills(); }
  var topButton = document.createElement('button');
  topButton.className = 'back-to-top'; topButton.type = 'button'; topButton.setAttribute('aria-label', 'Back to top'); topButton.textContent = '↑';
  document.body.appendChild(topButton);
  function updateScrollState() { topButton.classList.toggle('is-visible', window.scrollY > 420); }
  window.addEventListener('scroll', updateScrollState, { passive: true });
  topButton.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  updateScrollState();

  // 门户级快速启动：Ctrl/Cmd + K 搜索课程、章节和平台页面
  var portalPalette = document.createElement('div');
  portalPalette.className = 'portal-command-palette';
  portalPalette.innerHTML = '<div class="portal-palette-backdrop"></div><div class="portal-palette-panel"><div class="portal-palette-search">⌕<input placeholder="搜索课程、章节或页面…" aria-label="Search the course portal"></div><div class="portal-palette-results"></div><div class="portal-palette-hint">Ctrl K 打开 · Esc 关闭</div></div>';
  document.body.appendChild(portalPalette);
  var portalInput = portalPalette.querySelector('input'), portalResults = portalPalette.querySelector('.portal-palette-results');
  function portalItems() { var out = []; document.querySelectorAll('.nav-links a, .card.available').forEach(function (a) { out.push({ label: (a.textContent || '').replace(/\s+/g, ' ').trim(), href: a.href }); }); return out; }
  function drawPortalResults(query) { var q = query.toLowerCase(), items = portalItems().filter(function (x) { return x.label.toLowerCase().indexOf(q) !== -1; }).slice(0, 12); portalResults.innerHTML = items.map(function (x) { return '<a class="portal-palette-item" href="' + x.href + '"><span>' + x.label + '</span><small>↗</small></a>'; }).join('') || '<p class="portal-palette-empty">没有找到匹配内容</p>'; }
  function openPortalPalette() { portalPalette.classList.add('is-open'); portalInput.value = ''; drawPortalResults(''); portalInput.focus(); }
  function closePortalPalette() { portalPalette.classList.remove('is-open'); }
  var searchTrigger = document.createElement('button'); searchTrigger.className = 'portal-search-trigger'; searchTrigger.type = 'button'; searchTrigger.innerHTML = '⌕ <span>搜索</span><kbd>Ctrl K</kbd>'; searchTrigger.addEventListener('click', openPortalPalette); var portalNav = document.querySelector('.course-topbar'); if (portalNav) portalNav.appendChild(searchTrigger);
  portalInput.addEventListener('input', function () { drawPortalResults(portalInput.value); }); portalPalette.querySelector('.portal-palette-backdrop').addEventListener('click', closePortalPalette); document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPortalPalette(); } if (e.key === 'Escape') closePortalPalette(); });

  document.addEventListener('wbl:localechange', renderAll);
  if (window.__i18n) renderAll();
  else document.addEventListener('DOMContentLoaded', function () {
    setTimeout(renderAll, 0);   // 等 module 版 i18n.js 初始化
  });
})();
