/* =============================================================
 * course-search.js — 课程正文全文检索（零依赖）
 * 索引来源：
 *   1) 各章 index.html 的 .tab-panel 正文（讲解 / 代码说明）
 *   2) course-config.js 中的小节标题、学习目标、小结与自测
 * 页面首次搜索时懒加载各章 HTML，解析后缓存在内存。
 * 若 fetch 不可用（file:// 或离线），自动退回配置元数据检索。
 * 暴露：window.CourseSearch = { search(q, opts), ready() }
 * ============================================================= */
window.CourseSearch = (function () {
  'use strict';

  var CFG = window.COURSE_CONFIG;
  var cache = {};          // dir -> Promise<section[]>
  var configIndex = null;  // 配置元数据索引
  var textCache = {};      // dir -> section[]（已完成）

  function locale() {
    var l = (document.documentElement.lang || 'zh-CN').toLowerCase();
    return l.indexOf('en') === 0 ? 'en' : 'zh';
  }
  function chapterTitle(ch) {
    var loc = ch[locale()] || ch.zh || ch.en || {};
    return loc.title || '';
  }
  function collapse(s) {
    return (s || '').replace(/\s+/g, ' ').trim();
  }
  function inLessonDir() {
    return /\/lesson-0\d\//.test(location.pathname);
  }
  function hrefFor(ch, id) {
    return (inLessonDir() ? '../' : '') + ch.dir + '/#' + id;
  }

  /* ---------- 配置索引：标题 / 目标 / 小结 / 自测 ---------- */
  var configLang = null;
  function buildConfigIndex() {
    if (configIndex && configLang === locale()) return configIndex;
    configLang = locale();
    configIndex = [];
    CFG.chapters.forEach(function (ch) {
      ch.sections.forEach(function (sec) {
        var zh = sec.zh || {}, en = sec.en || {};
        var curr = locale() === 'en' ? en : zh;
        var bits = [
          curr.title, (curr.goals || []).join(' '), curr.use, curr.care,
          (curr.quiz || []).map(function (q) { return q.q + ' ' + (q.opts || []).join(' '); }).join(' ')
        ];
        configIndex.push({
          chapterKey: ch.key,
          chapter: chapterTitle(ch),
          sectionId: sec.id,
          title: curr.title,
          text: collapse(bits.join(' ')),
          href: hrefFor(ch, sec.id)
        });
      });
    });
    return configIndex;
  }

  /* ---------- 正文索引：抓取各章 HTML ---------- */
  function loadChapter(ch) {
    if (textCache[ch.dir]) return Promise.resolve(textCache[ch.dir]);
    if (cache[ch.dir]) return cache[ch.dir];

    var prefix = inLessonDir() ? '../' : '';
    cache[ch.dir] = fetch(prefix + ch.dir + '/index.html')
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        // 只保留当前语言的节点，避免中英双 DOM 让摘要混排
        var dropLang = locale() === 'en' ? 'zh-CN' : 'en-US';
        doc.querySelectorAll('[data-lang="' + dropLang + '"], [hidden]').forEach(function (n) {
          if (n.parentNode) n.parentNode.removeChild(n);
        });
        var out = [];
        doc.querySelectorAll('.chapter').forEach(function (article) {
          var id = article.id;
          if (!id) return;
          var titleEl = article.querySelector('h2');
          var title = titleEl ? collapse(titleEl.textContent) : id;
          var text = '';
          article.querySelectorAll('.tab-panel').forEach(function (panel) {
            panel.querySelectorAll('.demo-mount, .demo-hint, script, style').forEach(function (n) {
              if (n.parentNode) n.parentNode.removeChild(n);
            });
            text += ' ' + panel.textContent;
          });
          out.push({ id: id, title: title, text: collapse(text) });
        });
        textCache[ch.dir] = out;
        return out;
      })
      .catch(function () {
        textCache[ch.dir] = [];  // 不再重复请求失败页
        return [];
      });
    return cache[ch.dir];
  }

  function loadAll() {
    return Promise.all(CFG.chapters.map(loadChapter));
  }

  function snippet(text, terms) {
    var lower = text.toLowerCase();
    var at = -1;
    for (var i = 0; i < terms.length; i++) {
      var p = lower.indexOf(terms[i]);
      if (p !== -1 && (at === -1 || p < at)) at = p;
    }
    if (at === -1) return text.slice(0, 96) + (text.length > 96 ? '…' : '');
    var start = Math.max(0, at - 42);
    var end = Math.min(text.length, at + 96);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  function scoreOne(hay, terms) {
    var s = 0;
    var titleLower = hay.title.toLowerCase();
    var bodyLower = hay.text.toLowerCase();
    terms.forEach(function (t) {
      if (!t) return;
      if (titleLower.indexOf(t) !== -1) s += 8;
      var idx = bodyLower.indexOf(t);
      if (idx !== -1) {
        s += 2;
        var count = bodyLower.split(t).length - 1;
        s += Math.min(count, 5) * 0.4;
      }
    });
    return s;
  }

  function makeResult(ch, hit, terms) {
    return {
      href: hrefFor(ch, hit.id || hit.sectionId),
      chapterKey: ch.key,
      chapter: chapterTitle(ch),
      sectionId: hit.id || hit.sectionId,
      title: hit.title,
      snippet: snippet(hit.text, terms),
      score: scoreOne(hit, terms)
    };
  }

  /**
   * @param {string} q 查询词
   * @param {{chapterKey?:string, limit?:number}} opts
   * @returns {Promise<Array>}
   */
  function search(q, opts) {
    opts = opts || {};
    var query = (q || '').trim();
    var terms = query.toLowerCase().split(/[\s,，;；]+/).filter(Boolean);
    if (!terms.length) terms = [];
    var useTerms = terms.length ? terms : [''];

    var chapters = CFG.chapters.filter(function (ch) {
      return !opts.chapterKey || ch.key === opts.chapterKey;
    });

    return Promise.all(chapters.map(function (ch) {
      return loadChapter(ch).then(function (sections) {
        return { ch: ch, sections: sections };
      });
    })).then(function (groups) {
      var results = [];
      groups.forEach(function (g) {
        var byId = {};
        g.sections.forEach(function (s) { byId[s.id] = s; });

        // 配置元数据：标题 / 目标 / 小结 / 自测
        buildConfigIndex().forEach(function (meta) {
          if (meta.chapterKey !== g.ch.key) return;
          var body = byId[meta.sectionId];
          var merged = {
            id: meta.sectionId,
            title: meta.title || (body && body.title) || meta.sectionId,
            text: collapse((body ? body.text : '') + ' ' + meta.text)
          };
          var r = makeResult(g.ch, merged, useTerms);
          if (r.score > 0) results.push(r);
        });

        // 正文中有、配置中没有的小节（容错）
        g.sections.forEach(function (s) {
          var known = buildConfigIndex().some(function (m) {
            return m.chapterKey === g.ch.key && m.sectionId === s.id;
          });
          if (!known) {
            var r = makeResult(g.ch, s, useTerms);
            if (r.score > 0) results.push(r);
          }
        });
      });

      results.sort(function (a, b) { return b.score - a.score; });
      return results.slice(0, opts.limit || 30);
    });
  }

  function ready() {
    return loadAll();
  }

  return { search: search, ready: ready };
})();
