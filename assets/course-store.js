/* =============================================================
 * course-store.js — 学习记录单一读写入口（localStorage）
 *   · 三态进度：new / learning / done（按章节 + 小节存储）
 *   · 收藏清单、上次学习位置
 *   · 旧版数据迁移（vis-progress:<path> / vis-bookmarks）
 *   · JSON 导出与合并导入
 * 所有页面通过 window.CourseStore 访问，避免各脚本各写一份。
 * ============================================================= */
window.CourseStore = (function () {
  'use strict';

  var CFG = window.COURSE_CONFIG;
  var K = CFG.storage;
  var RANK = { new: 0, learning: 1, done: 2 };

  function read(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key) || 'null');
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function emit(type) {
    document.dispatchEvent(new CustomEvent('wbl:storechange', { detail: { type: type } }));
  }

  /* ---------- 旧数据迁移 ---------- */
  (function migrate() {
    var progress = read(K.progress, null);
    if (!progress || typeof progress !== 'object') progress = {};
    var changed = false;

    // 旧版：vis-progress:<pathname> → 学习状态
    try {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf('vis-progress:') === 0) keys.push(k);
      }
      keys.forEach(function (key) {
        var dir = key.replace('vis-progress:', '');
        var ch = CFG.chapters.filter(function (c) {
          return dir.indexOf(c.dir) !== -1;
        })[0];
        var list = read(key, []);
        if (!ch || !Array.isArray(list)) return;
        var bucket = progress[ch.key] || (progress[ch.key] = {});
        list.forEach(function (id) {
          if (!bucket[id]) { bucket[id] = { state: 'learning', at: Date.now() }; changed = true; }
        });
        try { localStorage.removeItem(key); } catch (e) {}
      });
    } catch (e) {}

    if (changed) write(K.progress, progress);

    // 旧版收藏：["/lesson-01/#ch-1-1"] → [{chapter, section}]
    var legacy = read('vis-bookmarks', null);
    if (Array.isArray(legacy) && legacy.length && !read(K.bookmarks, []).length) {
      var list = [];
      legacy.forEach(function (raw) {
        if (typeof raw !== 'string') return;
        var parts = raw.split('#');
        var section = parts[1];
        var ch = CFG.chapters.filter(function (c) { return parts[0].indexOf(c.dir) !== -1; })[0];
        if (ch && section) list.push({ chapter: ch.key, section: section, at: Date.now() });
      });
      write(K.bookmarks, list);
      try { localStorage.removeItem('vis-bookmarks'); } catch (e) {}
    }
  })();

  /* ---------- 进度 ---------- */
  function getProgress() {
    var p = read(K.progress, {});
    return (p && typeof p === 'object') ? p : {};
  }
  function getState(chapterKey, sectionId) {
    var bucket = getProgress()[chapterKey] || {};
    var item = bucket[sectionId];
    return (item && item.state) || 'new';
  }
  function setState(chapterKey, sectionId, state, silent) {
    if (!chapterKey || !sectionId || !(state in RANK)) return;
    var progress = getProgress();
    var bucket = progress[chapterKey] || (progress[chapterKey] = {});
    var prev = (bucket[sectionId] && bucket[sectionId].state) || 'new';
    // 不做降级：完成后再打开只更新时间，不回退成学习中
    bucket[sectionId] = {
      state: RANK[state] >= RANK[prev] ? state : prev,
      at: Date.now()
    };
    write(K.progress, progress);
    if (!silent) emit('progress');
  }
  function removeState(chapterKey, sectionId) {
    var progress = getProgress();
    var bucket = progress[chapterKey];
    if (!bucket || !bucket[sectionId]) return;
    delete bucket[sectionId];
    write(K.progress, progress);
    emit('progress');
  }
  function chapterCounts(chapterKey) {
    var bucket = getProgress()[chapterKey] || {};
    var done = 0, learning = 0;
    Object.keys(bucket).forEach(function (id) {
      if (bucket[id].state === 'done') done++;
      else if (bucket[id].state === 'learning') learning++;
    });
    return { done: done, learning: learning };
  }
  function totals() {
    var done = 0, learning = 0;
    CFG.chapters.forEach(function (ch) {
      var c = chapterCounts(ch.key);
      done += c.done;
      learning += c.learning;
    });
    return { done: done, learning: learning, total: CFG.totalSections };
  }

  /* ---------- 上次学习位置 ---------- */
  function getLast() {
    var v = read(K.last, null);
    return (v && typeof v === 'object' && v.chapterKey) ? v : null;
  }
  function setLast(chapterKey, sectionId) {
    if (!chapterKey || !sectionId) return;
    write(K.last, { chapterKey: chapterKey, sectionId: sectionId, at: Date.now() });
    emit('last');
  }

  /* ---------- 收藏 ---------- */
  function getBookmarks() {
    var list = read(K.bookmarks, []);
    return Array.isArray(list) ? list.filter(function (b) {
      return b && b.chapter && b.section;
    }) : [];
  }
  function isBookmarked(chapterKey, sectionId) {
    return getBookmarks().some(function (b) {
      return b.chapter === chapterKey && b.section === sectionId;
    });
  }
  function toggleBookmark(chapterKey, sectionId) {
    var list = getBookmarks();
    var idx = -1;
    list.forEach(function (b, i) {
      if (b.chapter === chapterKey && b.section === sectionId) idx = i;
    });
    if (idx === -1) list.push({ chapter: chapterKey, section: sectionId, at: Date.now() });
    else list.splice(idx, 1);
    write(K.bookmarks, list);
    emit('bookmarks');
    return idx === -1;
  }
  function removeBookmark(chapterKey, sectionId) {
    var list = getBookmarks().filter(function (b) {
      return !(b.chapter === chapterKey && b.section === sectionId);
    });
    write(K.bookmarks, list);
    emit('bookmarks');
  }

  /* ---------- 导出 / 导入 ---------- */
  function exportData() {
    return {
      app: 'vis-course',
      version: CFG.version,
      exportedAt: new Date().toISOString(),
      progress: getProgress(),
      bookmarks: getBookmarks(),
      last: getLast()
    };
  }
  function importData(text) {
    var data;
    try { data = JSON.parse(text); } catch (e) { return { ok: false }; }
    if (!data || typeof data !== 'object') return { ok: false };
    var progress = data.progress;
    var bookmarks = data.bookmarks;
    if (!progress && !bookmarks) return { ok: false };
    if (progress && typeof progress === 'object') {
      var current = getProgress();
      Object.keys(progress).forEach(function (chKey) {
        if (!progress[chKey] || typeof progress[chKey] !== 'object') return;
        var bucket = current[chKey] || (current[chKey] = {});
        Object.keys(progress[chKey]).forEach(function (sid) {
          var incoming = progress[chKey][sid];
          if (!incoming || !incoming.state) return;
          var exist = bucket[sid];
          if (!exist || RANK[incoming.state] > RANK[exist.state]) {
            bucket[sid] = { state: incoming.state, at: incoming.at || Date.now() };
          }
        });
      });
      write(K.progress, current);
    }
    if (Array.isArray(bookmarks)) {
      var list = getBookmarks();
      bookmarks.forEach(function (b) {
        if (!b || !b.chapter || !b.section) return;
        var dup = list.some(function (x) { return x.chapter === b.chapter && x.section === b.section; });
        if (!dup) list.push({ chapter: b.chapter, section: b.section, at: b.at || Date.now() });
      });
      write(K.bookmarks, list);
    }
    if (data.last && data.last.chapterKey) write(K.last, data.last);
    emit('import');
    return { ok: true, progress: totals(), bookmarks: getBookmarks().length };
  }

  function findSection(sectionId) {
    for (var i = 0; i < CFG.chapters.length; i++) {
      var ch = CFG.chapters[i];
      for (var j = 0; j < ch.sections.length; j++) {
        if (ch.sections[j].id === sectionId) return { chapter: ch, section: ch.sections[j], index: j };
      }
    }
    return null;
  }

  return {
    getState: getState,
    setState: setState,
    removeState: removeState,
    chapterCounts: chapterCounts,
    totals: totals,
    getLast: getLast,
    setLast: setLast,
    getBookmarks: getBookmarks,
    isBookmarked: isBookmarked,
    toggleBookmark: toggleBookmark,
    removeBookmark: removeBookmark,
    exportData: exportData,
    importData: importData,
    findSection: findSection,
    getProgress: getProgress
  };
})();
