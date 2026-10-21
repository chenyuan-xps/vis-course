/* =============================================================
 * portal.js — 门户共享脚本（零依赖）
 *   1) 知识地图 / 课程数据一览：数据来自 course-config.js
 *      · SVG 节点可用键盘聚焦、Enter 打开
 *      · 每个图形后附等价的 HTML 列表
 *   2) 全课程正文搜索：按概念、关键词与小节内容检索
 *      · ↑ ↓ 选择 / Enter 打开 / Esc 关闭
 *      · 焦点循环 + 锁定背景滚动
 *   3) 继续上次学习、学习进度、学习清单、导入导出
 * 依赖：course-config.js / course-store.js / course-search.js
 * ============================================================= */
(function () {
  'use strict';

  var CFG = window.COURSE_CONFIG;
  var Store = window.CourseStore;
  var Search = window.CourseSearch;
  if (!CFG) return;

  var NS = 'http://www.w3.org/2000/svg';

  function isEn() {
    return (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  }
  function L() { return isEn() ? 'en' : 'zh'; }
  function U() { return CFG.ui[L()]; }

  function bi(zh, en, tag, cls) {
    var wrap = document.createElement(tag || 'span');
    if (cls) wrap.className = cls;
    var a = document.createElement('span');
    a.setAttribute('data-lang', 'zh-CN');
    a.textContent = zh;
    a.hidden = isEn();
    var b = document.createElement('span');
    b.setAttribute('data-lang', 'en-US');
    b.textContent = en;
    b.hidden = !isEn();
    wrap.appendChild(a);
    wrap.appendChild(b);
    return wrap;
  }
  function setBi(node, zh, en) {
    if (!node) return;
    var spans = node.querySelectorAll('[data-lang]');
    if (spans.length >= 2) {
      spans[0].textContent = zh;
      spans[1].textContent = en;
    } else {
      node.textContent = isEn() ? en : zh;
    }
  }
  function el(tag, attrs, text) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ==========================================================
   * 1. 知识地图
   * ========================================================== */
  var mapSvg = document.getElementById('course-map');
  var mapDetails = null;

  function renderMap() {
    if (!mapSvg) return;
    mapSvg.innerHTML = '';
    var cx0 = 100, gap = 200, nodeY = 52;

    CFG.chapters.forEach(function (ch, i) {
      var cx = cx0 + i * gap;

      if (i < CFG.chapters.length - 1) {
        mapSvg.appendChild(el('line', {
          x1: cx + 30, y1: nodeY, x2: cx + gap - 34, y2: nodeY,
          stroke: 'currentColor', 'stroke-width': 2, 'stroke-opacity': 0.22
        }));
        mapSvg.appendChild(el('path', {
          d: 'M' + (cx + gap - 38) + ' ' + (nodeY - 5) + ' l6 5 l-6 5',
          fill: 'none', stroke: 'currentColor', 'stroke-opacity': 0.4, 'stroke-width': 2
        }));
      }

      var g = el('g', {
        class: 'map-chapter',
        'data-href': ch.href,
        role: 'button',
        tabindex: '0',
        'aria-label': (isEn() ? 'Chapter ' : '第 ') + (i + 1) + (isEn() ? ': ' : ' 章：') + ch[L()].title
      });

      g.appendChild(el('circle', { cx: cx, cy: nodeY, r: 26, class: 'map-node' }));
      g.appendChild(el('text', { x: cx, y: nodeY + 6, class: 'map-num', 'text-anchor': 'middle' }, String(i + 1)));
      g.appendChild(el('text', { x: cx, y: nodeY + 46, class: 'map-title', 'text-anchor': 'middle' }, ch[L()].title));

      (ch.points[L()] || []).forEach(function (p, j) {
        var py = nodeY + 64 + j * 30;
        g.appendChild(el('line', {
          x1: cx, y1: nodeY + 52, x2: cx, y2: py,
          class: 'map-thread', 'stroke-width': 1.5
        }));
        var chip = el('g', { class: 'map-chip' });
        chip.appendChild(el('rect', { x: cx - 90, y: py, width: 180, height: 23, rx: 11 }));
        var label = p.length > 16 ? p.slice(0, 15) + '…' : p;
        chip.appendChild(el('text', { x: cx, y: py + 15, class: 'map-point', 'text-anchor': 'middle' }, label));
        chip.appendChild(el('title', {}, p));
        g.appendChild(chip);
      });

      function open() { location.href = ch.href; }
      g.addEventListener('click', open);
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
      mapSvg.appendChild(g);
    });

    renderMapList();
  }

  function renderMapList() {
    if (!mapSvg) return;
    var wrap = mapSvg.parentNode;
    if (!mapDetails) {
      mapDetails = h('details', 'pt-details');
      var summary = h('summary');
      mapDetails.appendChild(summary);
      mapDetails.appendChild(h('ul', 'pt-chapter-list'));
      wrap.appendChild(mapDetails);
    }
    setBi(mapDetails.querySelector('summary'),
      '文字版课程地图（无需读图）', 'Text version of the course map');
    var ul = mapDetails.querySelector('ul');
    ul.innerHTML = '';
    CFG.chapters.forEach(function (ch, i) {
      var li = h('li');
      var a = h('a');
      a.href = ch.href;
      a.appendChild(bi(ch.zh.title, ch.en.title));
      li.appendChild(h('span', 'pt-ch-num', String(i + 1).padStart(2, '0')));
      li.appendChild(a);
      li.appendChild(h('span', 'pt-ch-meta', ch.sections.length + ' ' + U().sectionsWord));
      ul.appendChild(li);
    });
  }

  /* ==========================================================
   * 2. 数据一览
   * ========================================================== */
  var statsSvg = document.getElementById('course-stats');
  var statsDetails = null;

  function renderStats() {
    if (!statsSvg) return;
    statsSvg.innerHTML = '';
    var x0 = 230, unit = 58, maxU = 8, rowH = 50, top = 46;
    var labels = isEn()
      ? ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4', 'Ch 5']
      : ['第 1 章', '第 2 章', '第 3 章', '第 4 章', '第 5 章'];

    for (var u = 0; u <= maxU; u += 2) {
      var gx = x0 + u * unit;
      statsSvg.appendChild(el('line', {
        x1: gx, y1: top - 18, x2: gx, y2: top + CFG.chapters.length * rowH - 12,
        class: 'stat-grid', 'stroke-width': 1
      }));
      statsSvg.appendChild(el('text', {
        x: gx, y: top + CFG.chapters.length * rowH + 6, class: 'stat-axis', 'text-anchor': 'middle'
      }, String(u)));
    }
    statsSvg.appendChild(el('text', {
      x: x0 + maxU * unit / 2, y: top + CFG.chapters.length * rowH + 26,
      class: 'stat-axis', 'text-anchor': 'middle'
    }, isEn() ? 'Sections per chapter' : '各章小节数'));

    CFG.chapters.forEach(function (ch, i) {
      var y = top + i * rowH;
      var sections = ch.sections.length;
      var points = (ch.points[L()] || []).length;
      var g = el('g', {
        class: 'stat-row',
        role: 'button',
        tabindex: '0',
        'aria-label': labels[i] + ' ' + ch[L()].title + ': ' + sections + ' ' + U().sectionsWord
      });

      g.appendChild(el('circle', { cx: 22, cy: y, r: 13, class: 'stat-node' }));
      g.appendChild(el('text', { x: 22, y: y + 4, class: 'stat-num', 'text-anchor': 'middle' }, String(i + 1)));
      var title = ch[L()].title;
      if (title.length > 9) title = title.slice(0, 8) + '…';
      g.appendChild(el('text', { x: 44, y: y + 4, class: 'stat-ch-title' }, title));
      g.appendChild(el('rect', { class: 'bar', x: x0, y: y - 11, width: sections * unit, height: 22, rx: 5 }));
      g.appendChild(el('text', {
        x: x0 + sections * unit + 10, y: y + 4, class: 'stat-value'
      }, String(sections)));

      var dotsX = x0 + maxU * unit + 46;
      for (var j = 0; j < points; j++) {
        g.appendChild(el('circle', { cx: dotsX + j * 18, cy: y, r: 5.5, class: 'stat-dot' }));
      }

      g.appendChild(el('title', {}, ch[L()].title + ' — ' + sections + ' / ' + points));
      function open() { location.href = ch.href; }
      g.addEventListener('click', open);
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
      statsSvg.appendChild(g);
    });

    statsSvg.appendChild(el('text', {
      x: x0 + maxU * unit + 46, y: top - 18, class: 'stat-axis'
    }, isEn() ? 'Knowledge points' : '知识点数'));

    renderStatsList();
  }

  function renderStatsList() {
    if (!statsSvg) return;
    if (!statsDetails) {
      statsDetails = h('details', 'pt-details');
      statsDetails.appendChild(h('summary'));
      var table = h('table', 'pt-stat-table');
      table.innerHTML = '<thead><tr></tr></thead><tbody></tbody>';
      statsDetails.appendChild(table);
      statsSvg.parentNode.appendChild(statsDetails);
    }
    setBi(statsDetails.querySelector('summary'),
      '文字版数据表（无需读图）', 'Text version of the chart');
    var head = statsDetails.querySelector('thead tr');
    head.innerHTML = '';
    (isEn() ? ['Chapter', 'Sections', 'Knowledge points'] : ['章节', '小节数', '知识点数'])
      .forEach(function (label) {
        var th = h('th', null, label);
        th.scope = 'col';
        head.appendChild(th);
      });
    var body = statsDetails.querySelector('tbody');
    body.innerHTML = '';
    CFG.chapters.forEach(function (ch, i) {
      var tr = h('tr');
      var th = h('th', null, (isEn() ? 'Ch ' : '第 ') + (i + 1) + (isEn() ? '' : ' 章'));
      th.scope = 'row';
      tr.appendChild(th);
      var td1 = h('td');
      var a = h('a');
      a.href = ch.href;
      a.appendChild(bi(ch.zh.title, ch.en.title));
      td1.appendChild(a);
      tr.appendChild(td1);
      tr.appendChild(h('td', null, String(ch.sections.length)));
      tr.appendChild(h('td', null, String((ch.points[L()] || []).length)));
      body.appendChild(tr);
    });
  }

  /* ==========================================================
   * 3. 继续上次学习 / 进度
   * ========================================================== */
  function deriveLast() {
    var last = Store.getLast();
    if (last) return last;
    var progress = Store.getProgress();
    var best = null;
    Object.keys(progress).forEach(function (chKey) {
      Object.keys(progress[chKey]).forEach(function (sid) {
        var item = progress[chKey][sid];
        if (!item || !item.at) return;
        if (!best || item.at > best.at) best = { chapterKey: chKey, sectionId: sid, at: item.at };
      });
    });
    return best;
  }

  function renderContinue() {
    var card = document.getElementById('continue-card');
    if (!card) return;
    var section = card.closest('section');
    var last = deriveLast();
    var link = card.querySelector('.pt-continue-link');
    if (!last) { card.hidden = true; if (section) section.hidden = true; return; }
    var loc = Store.findSection(last.sectionId);
    if (!loc) { card.hidden = true; if (section) section.hidden = true; return; }
    card.hidden = false;
    if (section) section.hidden = false;

    var kicker = card.querySelector('.pt-continue-kicker');
    setBi(kicker, U().continueTitle, U().continueTitle);
    var title = card.querySelector('.pt-continue-title');
    title.innerHTML = '';
    title.appendChild(bi(loc.chapter.zh.title + ' · ' + loc.section.zh.title,
                         loc.chapter.en.title + ' · ' + loc.section.en.title));
    var hint = card.querySelector('.pt-continue-hint');
    setBi(hint, U().continueHint, U().continueHint);

    var marks = Store.getBookmarks().length;
    var totals = Store.totals();
    var meta = card.querySelector('.pt-continue-meta');
    meta.innerHTML = '';
    meta.appendChild(bi(
      '全课程已完成 ' + totals.done + '/' + totals.total + ' 节 · 收藏 ' + marks + ' 节',
      totals.done + '/' + totals.total + ' sections completed · ' + marks + ' saved'
    ));
    link.href = loc.chapter.dir + '/#' + loc.sectionId;
    setBi(link, U().continueBtn, U().continueBtn);
    var fill = card.querySelector('.pt-continue-fill');
    if (fill) fill.style.width = (totals.done / totals.total * 100) + '%';
  }

  function renderFacts() {
    var facts = document.getElementById('course-facts');
    if (!facts) return;
    var totals = Store.totals();
    var chapters = CFG.chapters.length;
    facts.innerHTML = '';
    facts.appendChild(bi(
      chapters + ' 个章节 · ' + totals.total + ' 个小节 · 已完成 ' + totals.done,
      chapters + ' chapters · ' + totals.total + ' sections · ' + totals.done + ' completed'
    ));
  }

  /* ==========================================================
   * 4. 章节卡片进度
   * ========================================================== */
  function renderCardProgress() {
    document.querySelectorAll('.card[data-ch]').forEach(function (card) {
      var key = card.getAttribute('data-ch');
      var ch = CFG.chapters.filter(function (c) { return c.key === key; })[0];
      if (!ch) return;
      var index = CFG.chapters.indexOf(ch);
      var counts = Store.chapterCounts(key);
      var total = ch.sections.length;

      // 标题 / 路径 / 编号 / 标签都以课程配置为准，避免页面与配置各写一份
      card.setAttribute('href', ch.dir + '/');
      var titleEl = card.querySelector('h3');
      if (titleEl) titleEl.textContent = ch[L()].title;
      var numEl = card.querySelector('.card-num');
      if (numEl) {
        numEl.textContent = isEn() ? 'Chapter ' + (index + 1) : '第 ' + (index + 1) + ' 章';
      }
      var tagList = card.querySelector('.card-tags');
      if (tagList) {
        tagList.innerHTML = '';
        (ch.points[L()] || []).slice(0, 5).forEach(function (point) {
          tagList.appendChild(h('li', null, point));
        });
      }
      var line = card.querySelector('.card-progress');
      if (!line) {
        line = h('div', 'card-progress');
        line.appendChild(h('span', 'card-progress-bar')).appendChild(h('i'));
        line.appendChild(h('span', 'card-progress-label'));
        var meta = card.querySelector('.card-meta');
        if (meta && meta.parentNode) meta.parentNode.insertBefore(line, meta.nextSibling);
        else card.appendChild(line);
      }
      line.querySelector('i').style.width = (counts.done / total * 100) + '%';
      setBi(line.querySelector('.card-progress-label'),
        '已完成 ' + counts.done + ' / ' + total,
        counts.done + ' / ' + total + ' completed');

      // 小节数来自配置，避免 HTML 里的数字与课程数据脱节
      var meta = card.querySelector('.card-meta');
      if (meta) {
        var spans = meta.querySelectorAll('[data-lang]');
        if (spans.length >= 2) {
          spans[0].textContent = total + ' 小节 · 3 个学习环节';
          spans[1].textContent = total + ' sections · 3 learning activities';
        }
      }
    });
  }

  /* ==========================================================
   * 5. 学习档案面板（chapters.html）
   * ========================================================== */
  function renderStudyPanel() {
    var panel = document.getElementById('study-panel');
    if (!panel) return;
    var totals = Store.totals();
    var done = document.getElementById('study-done');
    var learning = document.getElementById('study-learning');
    var totalEl = document.getElementById('study-total');
    if (done) done.textContent = totals.done;
    if (learning) learning.textContent = totals.learning;
    if (totalEl) totalEl.textContent = totals.total;
    var fill = document.getElementById('study-fill');
    if (fill) fill.style.width = (totals.done / totals.total * 100) + '%';

    var cont = panel.querySelector('.pt-study-continue');
    var last = deriveLast();
    if (cont) {
      if (last) {
        var loc = Store.findSection(last.sectionId);
        if (loc) {
          cont.hidden = false;
          cont.href = loc.chapter.dir + '/#' + loc.sectionId;
          setBi(cont, U().continueBtn, U().continueBtn);
        } else cont.hidden = true;
      } else cont.hidden = true;
    }

    setBi(panel.querySelector('.pt-study-title'), U().bookmarks, U().bookmarks);
    setBi(panel.querySelector('.pt-study-sub'), U().continueHint, U().continueHint);
    setBi(panel.querySelector('.pt-export'), U().export, U().export);
    setBi(panel.querySelector('.pt-import'), U().import, U().import);

    var select = panel.querySelector('.pt-filter');
    if (select) {
      var current = select.value || 'all';
      select.innerHTML = '';
      var allOpt = h('option', null, U().all);
      allOpt.value = 'all';
      select.appendChild(allOpt);
      CFG.chapters.forEach(function (ch) {
        var o = h('option', null, ch[L()].title);
        o.value = ch.key;
        select.appendChild(o);
      });
      select.value = current;
    }
    renderMarks(select ? select.value : 'all');
  }
  window.__portalFilter = 'all';

  function renderMarks(filter) {
    var list = document.getElementById('study-marks');
    if (!list) return;
    list.innerHTML = '';
    var marks = Store.getBookmarks().filter(function (b) {
      return filter === 'all' || b.chapter === filter;
    });
    setBi(document.getElementById('study-marks-title'), U().bookmarks, U().bookmarks);
    if (!marks.length) {
      var empty = h('li', 'pt-marks-empty');
      empty.appendChild(bi(U().bookmarksEmpty, U().bookmarksEmpty));
      list.appendChild(empty);
      return;
    }
    marks.forEach(function (b) {
      var ch = CFG.chapters.filter(function (c) { return c.key === b.chapter; })[0];
      if (!ch) return;
      var sec = ch.sections.filter(function (s) { return s.id === b.section; })[0];
      if (!sec) return;
      var li = h('li', 'pt-mark');
      var a = h('a', 'pt-mark-link');
      a.href = ch.dir + '/#' + sec.id;
      a.appendChild(h('span', 'pt-mark-ch', ch[L()].title));
      var title = h('strong', 'pt-mark-title');
      title.appendChild(bi(sec.zh.title, sec.en.title));
      a.appendChild(title);
      var state = Store.getState(b.chapter, b.section);
      var badge = h('span', 'pt-mark-state');
      badge.appendChild(bi(
        state === 'done' ? U().stateDone : state === 'learning' ? U().stateLearning : U().stateNew,
        state === 'done' ? U().stateDone : state === 'learning' ? U().stateLearning : U().stateNew
      ));
      badge.dataset.state = state;
      var rm = h('button', 'pt-mark-remove');
      rm.type = 'button';
      rm.appendChild(bi(U().remove, U().remove));
      rm.addEventListener('click', function (e) {
        e.preventDefault();
        Store.removeBookmark(b.chapter, b.section);
      });
      li.appendChild(a);
      li.appendChild(badge);
      li.appendChild(rm);
      list.appendChild(li);
    });
  }

  function bindStudyPanel() {
    var panel = document.getElementById('study-panel');
    if (!panel) return;
    var select = panel.querySelector('.pt-filter');
    if (select) {
      select.addEventListener('change', function () { renderMarks(select.value); });
    }
    panel.querySelector('.pt-export').addEventListener('click', function () {
      var blob = new Blob([JSON.stringify(Store.exportData(), null, 2)], { type: 'application/json' });
      var a = h('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'vis-course-learning.json';
      document.body.appendChild(a);
      a.click();
      window.setTimeout(function () {
        URL.revokeObjectURL(a.href);
        a.remove();
      }, 200);
    });
    panel.querySelector('.pt-import').addEventListener('click', function () {
      panel.querySelector('.pt-file').click();
    });
    panel.querySelector('.pt-file').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var res = Store.importData(reader.result);
        e.target.value = '';
        var msg = panel.querySelector('.pt-import-msg');
        if (msg) {
          msg.hidden = false;
          setBi(msg, res.ok ? U().imported : U().importFailed,
                     res.ok ? U().imported : U().importFailed);
          msg.classList.toggle('is-error', !res.ok);
        }
        if (res.ok) renderAll();
      };
      reader.readAsText(file);
    });
  }

  function renderAll() {
    renderMap();
    renderStats();
    renderCardProgress();
    renderContinue();
    renderFacts();
    renderStudyPanel();
  }

  /* ==========================================================
   * 7. 全课程正文搜索
   * ========================================================== */
  var modal = h('div', 'portal-command-palette');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="portal-palette-backdrop"></div>' +
    '<div class="portal-palette-panel" role="dialog" aria-modal="true" aria-labelledby="portal-search-label">' +
      '<div class="portal-palette-search">' +
        '<span aria-hidden="true">⌕</span>' +
        '<label id="portal-search-label" class="pt-sr-only"></label>' +
        '<input type="search" autocomplete="off" spellcheck="false" />' +
        '<button type="button" class="pt-close" aria-label="Close">×</button>' +
      '</div>' +
      '<div class="portal-palette-results" role="listbox"></div>' +
      '<div class="portal-palette-hint"></div>' +
    '</div>';
  document.body.appendChild(modal);

  var backdrop = modal.querySelector('.portal-palette-backdrop');
  var input = modal.querySelector('input');
  var results = modal.querySelector('.portal-palette-results');
  var hint = modal.querySelector('.portal-palette-hint');
  var label = modal.querySelector('#portal-search-label');
  var closeBtn = modal.querySelector('.pt-close');
  var lastFocus = null;
  var activeIndex = -1;
  var token = 0;

  function scopeText() {
    return {
      placeholder: U().searchPlaceholder,
      hint: (isEn() ? '↑ ↓ select · Enter open · Esc close' : '↑ ↓ 选择 · Enter 打开 · Esc 关闭'),
      empty: U().noResults,
      loading: U().searching
    };
  }
  function localizeSearch() {
    var s = scopeText();
    label.textContent = s.placeholder;
    input.placeholder = s.placeholder;
    input.setAttribute('aria-label', s.placeholder);
    closeBtn.setAttribute('aria-label', U().close);
    hint.textContent = s.hint;
  }

  function quickItems() {
    var out = CFG.chapters.map(function (ch, i) {
      return {
        href: ch.dir + '/',
        title: ch[L()].title,
        meta: (isEn() ? 'Chapter ' : '第 ') + (i + 1) + (isEn() ? '' : ' 章') + ' · ' + ch.sections.length + ' ' + U().sectionsWord,
        snippet: ch[L()].focus.join(' · ')
      };
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      var spans = a.querySelectorAll('[data-lang]');
      var text = '';
      if (spans.length) {
        spans.forEach(function (s) {
          if (s.getAttribute('data-lang') === (isEn() ? 'en-US' : 'zh-CN')) {
            text = (s.textContent || '').replace(/\s+/g, ' ').trim();
          }
        });
      }
      if (!text) text = (a.textContent || '').replace(/\s+/g, ' ').trim();
      if (!text) return;
      out.push({ href: a.getAttribute('href'), title: text, meta: '', snippet: '' });
    });
    return out;
  }

  function drawItems(items) {
    results.innerHTML = '';
    activeIndex = items.length ? 0 : -1;
    if (!items.length) {
      var p = h('p', 'portal-palette-empty');
      p.appendChild(bi(scopeText().empty, scopeText().empty));
      results.appendChild(p);
      return;
    }
    items.forEach(function (item, i) {
      var a = h('a', 'portal-palette-item');
      a.href = item.href;
      a.setAttribute('role', 'option');
      a.dataset.index = i;
      var main = h('span', 'pt-result-main');
      var t = h('span', 'pt-result-title');
      t.textContent = item.title;
      main.appendChild(t);
      if (item.meta) main.appendChild(h('span', 'pt-result-meta', item.meta));
      if (item.snippet) main.appendChild(h('span', 'pt-result-snippet', item.snippet));
      a.appendChild(main);
      a.appendChild(h('small', 'pt-result-arrow', '↗'));
      if (i === 0) a.classList.add('is-active');
      a.addEventListener('mouseenter', function () { activeIndex = i; markActive(); });
      results.appendChild(a);
    });
  }
  function markActive() {
    Array.prototype.forEach.call(results.querySelectorAll('.portal-palette-item'), function (n, i) {
      n.classList.toggle('is-active', i === activeIndex);
    });
    var act = results.querySelector('.portal-palette-item.is-active');
    if (act) act.scrollIntoView({ block: 'nearest' });
  }

  function runSearch(q) {
    var s = scopeText();
    var query = (q || '').trim();
    if (!query) { drawItems(quickItems()); return; }
    var my = ++token;
    results.innerHTML = '';
    var loading = h('p', 'portal-palette-empty');
    loading.appendChild(bi(s.loading, s.loading));
    results.appendChild(loading);
    Search.search(query, { limit: 24 }).then(function (list) {
      if (my !== token) return;
      drawItems(list.map(function (r) {
        return { href: r.href, title: r.title, meta: r.chapter, snippet: r.snippet };
      }));
    });
  }

  function openPalette() {
    lastFocus = document.activeElement;
    localizeSearch();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('pt-locked');
    input.value = '';
    drawItems(quickItems());
    window.setTimeout(function () { input.focus(); }, 30);
  }
  function closePalette() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('pt-locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  input.addEventListener('input', function () {
    window.clearTimeout(input._t);
    input._t = window.setTimeout(function () { runSearch(input.value); }, 180);
  });
  input.addEventListener('keydown', function (e) {
    var items = Array.prototype.slice.call(results.querySelectorAll('.portal-palette-item'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!items.length) return;
      activeIndex = (activeIndex + 1) % items.length;
      markActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!items.length) return;
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      markActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      var act = results.querySelector('.portal-palette-item.is-active') || items[0];
      if (act) location.href = act.getAttribute('href');
    }
  });
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); closePalette(); return; }
    if (e.key !== 'Tab') return;
    var focusables = Array.prototype.slice.call(
      modal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])')
    ).filter(function (n) { return n.offsetParent !== null; });
    if (!focusables.length) return;
    var first = focusables[0], last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  backdrop.addEventListener('click', closePalette);
  closeBtn.addEventListener('click', closePalette);

  var trigger = document.querySelector('.portal-search-trigger');
  if (!trigger) {
    trigger = h('button', 'portal-search-trigger');
    trigger.type = 'button';
    var topbar = document.querySelector('.course-topbar');
    if (topbar) topbar.appendChild(trigger);
  }
  trigger.innerHTML = '';
  trigger.appendChild(document.createTextNode('⌕ '));
  var triggerLabel = h('span');
  triggerLabel.appendChild(bi(isEn() ? 'Search' : '搜索', isEn() ? 'Search' : '搜索'));
  trigger.appendChild(triggerLabel);
  var kbd = h('kbd', null, 'Ctrl K');
  trigger.appendChild(kbd);
  trigger.setAttribute('aria-label', U().searchPlaceholder);
  trigger.addEventListener('click', openPalette);

  document.addEventListener('keydown', function (e) {
    if (modal.classList.contains('is-open')) return;
    var t = e.target;
    var typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openPalette();
    } else if (e.key === '/' && !typing) {
      e.preventDefault();
      openPalette();
    }
  });

  /* ==========================================================
   * 8. 返回顶部 / 初始化
   * ========================================================== */
  var topButton = h('button', 'back-to-top', '↑');
  topButton.type = 'button';
  topButton.setAttribute('aria-label', isEn() ? 'Back to top' : '返回顶部');
  document.body.appendChild(topButton);
  function updateScrollState() {
    topButton.classList.toggle('is-visible', window.scrollY > 420);
  }
  window.addEventListener('scroll', updateScrollState, { passive: true });
  topButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  updateScrollState();

  document.addEventListener('wbl:localechange', function () {
    topButton.setAttribute('aria-label', isEn() ? 'Back to top' : '返回顶部');
    localizeSearch();
    renderAll();
  });
  document.addEventListener('wbl:storechange', function () {
    renderCardProgress();
    renderContinue();
    renderFacts();
    renderStudyPanel();
  });

  bindStudyPanel();
  localizeSearch();
  if (window.__i18n) renderAll();
  else document.addEventListener('DOMContentLoaded', function () {
    window.setTimeout(renderAll, 0);   // 等 module 版 i18n.js 初始化
  });
})();
