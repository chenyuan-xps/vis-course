/* =============================================================
 * theme.js — 亮 / 暗主题切换（零依赖，≈3KB）
 *   1) 在 <head> 中同步引入：尽早写入 <html data-theme>，避免首屏闪烁
 *   2) DOM 就绪后注入切换按钮：门户塞进 .nav，章节页塞进 .course-topbar
 *   3) localStorage('wbl-theme') 持久化；未选择时跟随系统偏好
 * ============================================================= */
(function () {
  'use strict';

  var KEY = 'wbl-theme';
  var root = document.documentElement;

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function systemPref() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark' : 'light';
  }
  function current() { return root.getAttribute('data-theme') || 'light'; }

  /* ---- 1) 立即生效（脚本在 <head> 中同步执行，先于样式表加载） ---- */
  root.setAttribute('data-theme', stored() || systemPref());

  var ICON_SUN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/>' +
    '<path d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1' +
    'M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5"/></svg>';
  var ICON_MOON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M20.2 14.6A8.6 8.6 0 1 1 9.4 3.8a6.9 6.9 0 0 0 10.8 10.8z"/></svg>';

  function paint(btn) {
    var dark = current() === 'dark';
    btn.innerHTML = dark ? ICON_SUN : ICON_MOON;
    btn.setAttribute('aria-label', dark ? '切换到浅色模式 / Light mode' : '切换到深色模式 / Dark mode');
    btn.setAttribute('title', dark ? '浅色 / Light' : '深色 / Dark');
  }

  function inject() {
    if (document.querySelector('.theme-toggle')) return;
    var host = document.querySelector('.course-topbar') || document.querySelector('.nav');
    if (!host) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      paint(btn);
      document.dispatchEvent(new CustomEvent('wbl:themechange', { detail: { theme: next } }));
    });
    paint(btn);
    host.appendChild(btn);
  }

  /* ---- 2) DOM 就绪后注入按钮 ---- */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();

  /* ---- 3) 未手动选择时跟随系统 ---- */
  if (window.matchMedia) {
    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (stored()) return;
        root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      });
    } catch (_) {}
  }
})();
