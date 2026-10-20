// =============================================================
// enhance.js — 章节学习体验增强（所有 lesson 页共享）
// 功能：
//   1) 小节步进器（stepper）：从左侧目录自动生成，可点击跳转，
//      标记「当前小节 / 已学小节」，学习进度本地持久化
//   2) 顶部学习进度条：已学小节数 / 总小节数
//   3) 每节底部「上一节 / 下一节」导航 + 键盘 ←/→ 切换
//   4) 回到顶部悬浮按钮
// 零依赖；双语标签复用 i18n.js 的 [data-lang] 双 DOM 机制。
// =============================================================
(function () {
  'use strict';

  var nav = document.querySelector('.chapter-nav');
  if (!nav) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[data-chapter]'));
  if (!links.length) return;
  var ids = links.map(function (a) { return a.dataset.chapter; });

  // 章节主题色贯穿：把顶栏 data-current 写到 body，供 enhance.css 的
  // body[data-chapter="N"] 变量（--ls-accent 等）着色步进器/tab/导航/按钮
  var topbar = document.querySelector('.course-topbar');
  if (topbar && topbar.dataset.current) {
    document.body.setAttribute('data-chapter', topbar.dataset.current);
  }

  // ---------- 已学进度（localStorage 持久化） ----------
  var key = 'vis-progress:' + location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  var visited = [];
  try { visited = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { visited = []; }
  if (!Array.isArray(visited)) visited = [];
  function addVisited(id) {
    if (id && visited.indexOf(id) === -1) {
      visited.push(id);
      try { localStorage.setItem(key, JSON.stringify(visited)); } catch (e) {}
    }
  }

  // 双语片段：与 i18n.js 的 [data-lang] 机制一致
  function bi(zh, en) {
    return '<span data-lang="zh-CN">' + zh + '</span>' +
           '<span data-lang="en-US" hidden>' + en + '</span>';
  }

  // ---------- 顶部进度条 ----------
  var bar = document.createElement('div');
  bar.className = 'ls-progress';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<i></i>';
  document.body.appendChild(bar);
  var barFill = bar.firstChild;

  // ---------- 小节步进器 ----------
  var stepper = document.createElement('nav');
  stepper.className = 'ls-stepper';
  var html = '<ol class="ls-steps">';
  ids.forEach(function (id, i) {
    if (i > 0) html += '<li class="ls-sep" aria-hidden="true"></li>';
    html += '<li class="ls-step" data-target="' + id + '">' +
              '<button type="button">' +
                '<span class="ls-dot">' + (i + 1) + '</span>' +
                '<span class="ls-label"></span>' +
              '</button></li>';
  });
  html += '</ol><span class="ls-count"></span>';
  stepper.innerHTML = html;

  var header = document.querySelector('.lesson-header');
  if (header && header.parentNode) header.parentNode.insertBefore(stepper, header.nextSibling);
  else document.body.insertBefore(stepper, document.body.firstChild);

  var stepEls = Array.prototype.slice.call(stepper.querySelectorAll('.ls-step'));
  var countEl = stepper.querySelector('.ls-count');

  // 标签文本直接取侧边栏（i18n 翻译后）的文本，语言切换时同步
  function syncLabels() {
    stepEls.forEach(function (li, i) {
      li.querySelector('.ls-label').textContent = links[i].textContent.trim();
    });
  }

  function current() {
    var h = location.hash.replace(/^#/, '');
    if (ids.indexOf(h) !== -1) return h;
    var act = document.querySelector('.chapter.active');
    return act && ids.indexOf(act.id) !== -1 ? act.id : ids[0];
  }

  function sync() {
    var cur = current();
    addVisited(cur);
    stepEls.forEach(function (li) {
      var id = li.dataset.target;
      li.classList.toggle('active', id === cur);
      li.classList.toggle('done', visited.indexOf(id) !== -1 && id !== cur);
    });
    countEl.innerHTML = bi('已学 <b>' + visited.length + '</b>/' + ids.length + ' 节',
                           'Learned <b>' + visited.length + '</b>/' + ids.length);
    barFill.style.width = (visited.length / ids.length * 100) + '%';
    document.dispatchEvent(new CustomEvent('ls:sync'));
  }

  stepper.addEventListener('click', function (e) {
    var btn = e.target.closest('.ls-step');
    if (!btn) return;
    var idx = ids.indexOf(btn.dataset.target);
    if (idx !== -1) links[idx].click();
  });

  // ---------- 每节底部：上一节 / 下一节 ----------
  ids.forEach(function (id, i) {
    var c = document.getElementById(id);
    if (!c) return;
    var foot = document.createElement('div');
    foot.className = 'ls-footnav';
    var prevLabel = bi('← 上一节', '← Previous');
    var nextLabel = bi('下一节 →', 'Next →');
    foot.innerHTML =
      '<button type="button" class="ls-prev"' + (i === 0 ? ' disabled' : '') + '>' + prevLabel + '</button>' +
      '<span class="ls-idx">' + (i + 1) + ' / ' + ids.length + '</span>' +
      '<button type="button" class="ls-next"' + (i === ids.length - 1 ? ' disabled' : '') + '>' + nextLabel + '</button>';
    foot.querySelector('.ls-prev').addEventListener('click', function () { if (i > 0) links[i - 1].click(); });
    foot.querySelector('.ls-next').addEventListener('click', function () { if (i < ids.length - 1) links[i + 1].click(); });
    c.appendChild(foot);
  });

  // ---------- 键盘 ←/→ 切换小节 ----------
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    var i = ids.indexOf(current());
    var j = e.key === 'ArrowRight' ? i + 1 : i - 1;
    if (j >= 0 && j < ids.length) { e.preventDefault(); links[j].click(); }
  });

  // ---------- 回到顶部 ----------
  var topBtn = document.createElement('button');
  topBtn.type = 'button';
  topBtn.className = 'ls-top';
  topBtn.innerHTML = '↑';
  topBtn.setAttribute('aria-label', 'Back to top');
  topBtn.addEventListener('click', function () {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
  document.body.appendChild(topBtn);
  window.addEventListener('scroll', function () {
    topBtn.classList.toggle('show', window.scrollY > 480);
  }, { passive: true });

  // ---------- 状态同步 ----------
  var content = document.querySelector('.chapter-content') || document.body;
  new MutationObserver(sync).observe(content, { subtree: true, attributes: true, attributeFilter: ['class'] });
  window.addEventListener('hashchange', sync);

  // i18n：语言切换后同步步进器标签；初始化时套用当前语言
  document.addEventListener('wbl:localechange', function () { syncLabels(); sync(); });
  syncLabels();
  sync();
  if (window.__i18n && typeof window.__i18n.apply === 'function') window.__i18n.apply();
})();
