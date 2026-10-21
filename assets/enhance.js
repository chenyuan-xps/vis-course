// =============================================================
// enhance.js — 章节学习闭环（所有 lesson 页共享）
//   1) 三态进度：未开始 / 学习中 / 已完成（不再把"打开"当"学完"）
//   2) 每节：学习目标 → 知识链接 → 预测 → 演示 → 小结 → 自测
//   3) 章节：前置知识 / 预计时间 / 本章重点 + 章末复习页
//   4) 全文搜索、学习清单、收藏、导入导出、快捷键
// 依赖：course-config.js / course-store.js / course-search.js
// =============================================================
(function () {
  'use strict';

  var CFG = window.COURSE_CONFIG;
  var Store = window.CourseStore;
  var Search = window.CourseSearch;
  if (!CFG || !Store) return;

  var nav = document.querySelector('.chapter-nav');
  if (!nav) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[data-chapter]'));
  if (!links.length) return;
  var ids = links.map(function (a) { return a.dataset.chapter; });

  var topbar = document.querySelector('.course-topbar');
  if (topbar && topbar.dataset.current) {
    document.body.setAttribute('data-chapter', topbar.dataset.current);
  }

  var CHKEY = (topbar && topbar.dataset.current) || '';
  var CH = CFG.chapters.filter(function (c) { return c.key === CHKEY; })[0];
  if (!CH) {
    CH = CFG.chapters.filter(function (c) {
      return location.pathname.indexOf(c.dir) !== -1;
    })[0];
  }
  if (!CH) return;
  CHKEY = CH.key;

  var SEC = {};
  CH.sections.forEach(function (s, i) {
    SEC[s.id] = { cfg: s, index: i };
  });

  /* ---------- 语言与文案 ---------- */
  function isEn() {
    return (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;
  }
  function L() { return isEn() ? 'en' : 'zh'; }
  function UI() { return CFG.ui[L()]; }

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
  function fillBi(el, zh, en) {
    var spans = el.querySelectorAll('[data-lang]');
    if (spans.length >= 2) {
      spans[0].textContent = zh;
      spans[1].textContent = en;
    } else {
      el.textContent = isEn() ? en : zh;
    }
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function listItems(ul, zhArr, enArr) {
    (zhArr || []).forEach(function (item, i) {
      var li = document.createElement('li');
      var a = el('span');
      a.setAttribute('data-lang', 'zh-CN'); a.textContent = item; a.hidden = isEn();
      var b = el('span');
      b.setAttribute('data-lang', 'en-US'); b.textContent = (enArr && enArr[i]) || item; b.hidden = !isEn();
      li.appendChild(a); li.appendChild(b);
      ul.appendChild(li);
    });
  }

  /* ---------- 提示条 ---------- */
  var toastWrap = el('div', 'ec-toasts');
  toastWrap.setAttribute('role', 'status');
  toastWrap.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastWrap);
  function toast(zh, en) {
    var t = el('div', 'ec-toast');
    t.appendChild(bi(zh, en));
    toastWrap.appendChild(t);
    window.setTimeout(function () {
      t.classList.add('is-out');
      window.setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 240);
    }, 2600);
  }

  /* ---------- 学习位置 / 进度 ---------- */
  var activeId = null;
  function currentId() {
    var h = location.hash.replace(/^#/, '');
    if (ids.indexOf(h) !== -1) return h;
    var act = document.querySelector('.chapter.active');
    if (act && ids.indexOf(act.id) !== -1) return act.id;
    return ids[0];
  }
  function markLearning(id) {
    if (!id) return;
    if (Store.getState(CHKEY, id) === 'new') Store.setState(CHKEY, id, 'learning');
  }
  function activate(id) {
    if (!id || ids.indexOf(id) === -1) return;
    activeId = id;
    markLearning(id);
    Store.setLast(CHKEY, id);
    syncProgressUI();
  }

  /* ---------- 顶部进度条 ---------- */
  var bar = el('div', 'ls-progress');
  bar.setAttribute('aria-hidden', 'true');
  bar.appendChild(el('i'));
  document.body.appendChild(bar);
  var barFill = bar.firstChild;

  /* ---------- 章节元信息（时间 / 前置 / 重点） ---------- */
  var header = document.querySelector('.lesson-header');
  var meta = el('section', 'ec-chmeta');
  meta.setAttribute('aria-label', CFG.ui[L()].chapterFocus);
  var metaGrid = el('div', 'ec-chmeta-grid');
  [
    { label: 'chapterTime', value: CH.zh.time, valueEn: CH.en.time },
    { label: 'chapterPrereq', value: CH.zh.prereq, valueEn: CH.en.prereq },
    { label: 'chapterFocus', value: (CH.zh.focus || []).join(' · '), valueEn: (CH.en.focus || []).join(' · ') }
  ].forEach(function (item) {
    var card = el('div', 'ec-chmeta-card');
    var k = el('span', 'ec-chmeta-k'); k.appendChild(bi(CFG.ui.zh[item.label], CFG.ui.en[item.label])); card.appendChild(k);
    var v = el('span', 'ec-chmeta-v'); v.appendChild(bi(item.value, item.valueEn)); card.appendChild(v);
    metaGrid.appendChild(card);
  });
  meta.appendChild(metaGrid);
  if (header && header.parentNode) header.parentNode.insertBefore(meta, header.nextSibling);
  else document.body.insertBefore(meta, document.body.firstChild);

  /* ---------- 小节步进器 ---------- */
  var stepper = el('nav', 'ls-stepper');
  stepper.setAttribute('aria-label', CFG.ui.zh.goals);
  var ol = el('ol', 'ls-steps');
  ids.forEach(function (id, i) {
    if (i > 0) {
      var sep = el('li', 'ls-sep');
      sep.setAttribute('aria-hidden', 'true');
      ol.appendChild(sep);
    }
    var li = el('li', 'ls-step');
    li.dataset.target = id;
    var btn = el('button');
    btn.type = 'button';
    btn.appendChild(el('span', 'ls-dot', String(i + 1)));
    btn.appendChild(el('span', 'ls-label'));
    li.appendChild(btn);
    ol.appendChild(li);
  });
  var countEl = el('span', 'ls-count');
  stepper.appendChild(ol);
  stepper.appendChild(countEl);
  if (header && header.parentNode) header.parentNode.insertBefore(stepper, meta.nextSibling);
  else document.body.insertBefore(stepper, document.body.firstChild);

  var stepEls = Array.prototype.slice.call(stepper.querySelectorAll('.ls-step'));

  function syncLabels() {
    stepEls.forEach(function (li, i) {
      var label = li.querySelector('.ls-label');
      var t = links[i].textContent.trim();
      label.textContent = t;
      li.querySelector('button').setAttribute('aria-label', t);
    });
  }

  function syncProgressUI() {
    var cur = activeId || currentId();
    var done = 0, learning = 0;
    stepEls.forEach(function (li) {
      var id = li.dataset.target;
      var st = Store.getState(CHKEY, id);
      if (st === 'done') done++;
      else if (st === 'learning') learning++;
      li.classList.toggle('active', id === cur);
      li.classList.toggle('done', st === 'done');
      li.classList.toggle('learning', st === 'learning' && id !== cur);
      var b = li.querySelector('button');
      if (id === cur) b.setAttribute('aria-current', 'step');
      else b.removeAttribute('aria-current');
    });
    var total = ids.length;
    countEl.innerHTML = '';
    var zh = document.createElement('span');
    zh.setAttribute('data-lang', 'zh-CN'); zh.hidden = isEn();
    zh.innerHTML = '已完成 <b>' + done + '</b>/' + total + (learning ? ' · 学习中 ' + learning : '');
    var en = document.createElement('span');
    en.setAttribute('data-lang', 'en-US'); en.hidden = !isEn();
    en.innerHTML = '<b>' + done + '</b>/' + total + ' completed' + (learning ? ' · ' + learning + ' in progress' : '');
    countEl.appendChild(zh); countEl.appendChild(en);
    barFill.style.width = (done / total * 100) + '%';
    stepEls.forEach(function (li) { paintSection(li.dataset.target); });
  }

  stepper.addEventListener('click', function (e) {
    var step = e.target.closest('.ls-step');
    if (!step) return;
    var idx = ids.indexOf(step.dataset.target);
    if (idx !== -1) links[idx].click();
  });

  links.forEach(function (a) {
    a.addEventListener('click', function () {
      var id = a.dataset.chapter;
      window.setTimeout(function () { activate(id); }, 0);
    });
  });
  window.addEventListener('hashchange', function () {
    var id = location.hash.replace(/^#/, '');
    if (id) activate(id);
    syncProgressUI();
  });

  /* ---------- 每节：目标 / 知识链接 / 预测 / 说明 / 小结 / 自测 ---------- */
  var records = {};
  var RELATED = {
    'ch-1-3': ['ch-1-4', 'ch-3-2', 'ch-4-2'],
    'ch-1-4': ['ch-1-5', 'ch-2-2'],
    'ch-1-5': ['ch-2-4'],
    'ch-2-2': ['ch-1-4', 'ch-2-3'],
    'ch-2-3': ['ch-2-2', 'ch-2-4'],
    'ch-2-4': ['ch-1-5', 'ch-2-3'],
    'ch-3-2': ['ch-1-3', 'ch-3-3'],
    'ch-3-3': ['ch-3-2', 'ch-3-4'],
    'ch-3-4': ['ch-3-5', 'ch-3-6'],
    'ch-3-5': ['ch-3-4', 'ch-3-8'],
    'ch-3-6': ['ch-3-2', 'ch-3-8'],
    'ch-3-8': ['ch-3-5', 'ch-3-6'],
    'ch-4-2': ['ch-1-3', 'ch-4-4'],
    'ch-4-3': ['ch-4-2', 'ch-1-4'],
    'ch-4-4': ['ch-4-2', 'ch-4-3'],
    'ch-4-5': ['ch-4-3', 'ch-5-2'],
    'ch-5-1': ['ch-5-2', 'ch-5-3'],
    'ch-5-2': ['ch-5-3', 'ch-4-3'],
    'ch-5-3': ['ch-5-1', 'ch-3-2'],
    'ch-5-4': ['ch-5-1', 'ch-5-3'],
    'ch-5-5': ['ch-4-3', 'ch-5-1']
  };

  function linkTo(targetId) {
    var loc = Store.findSection(targetId);
    if (!loc) return null;
    return {
      href: loc.chapter.key === CHKEY ? '#' + targetId : '../' + loc.chapter.dir + '/#' + targetId,
      zh: loc.section.zh.title,
      en: loc.section.en.title
    };
  }

  function buildGoals(id) {
    var rec = records[id];
    var s = rec.cfg;
    var wrap = el('section', 'ec-goals');
    wrap.setAttribute('aria-label', CFG.ui.zh.goals);

    var head = el('div', 'ec-goals-head');
    var kicker = el('p', 'ec-kicker');
    kicker.appendChild(bi(CFG.ui.zh.goals, CFG.ui.en.goals));
    head.appendChild(kicker);
    rec.badge = el('span', 'ec-state');
    rec.badge.appendChild(bi(CFG.ui.zh.stateNew, CFG.ui.en.stateNew));
    head.appendChild(rec.badge);
    wrap.appendChild(head);

    var hint = el('p', 'ec-goals-hint');
    hint.appendChild(bi(CFG.ui.zh.goalsHint, CFG.ui.en.goalsHint));
    wrap.appendChild(hint);

    var ul = el('ul', 'ec-goal-list');
    listItems(ul, s.zh.goals, s.en.goals);
    wrap.appendChild(ul);

    var foot = el('div', 'ec-goals-foot');
    rec.doneBtn = el('button', 'ec-done');
    rec.doneBtn.type = 'button';
    rec.doneBtn.appendChild(bi(CFG.ui.zh.markDone, CFG.ui.en.markDone));
    rec.doneBtn.addEventListener('click', function () {
      var st = Store.getState(CHKEY, id);
      if (st === 'done') {
        Store.removeState(CHKEY, id);
        Store.setState(CHKEY, id, 'learning');
        toast('已撤销完成标记', 'Completion removed');
      } else {
        Store.setState(CHKEY, id, 'done');
        toast('已标记完成：' + s.zh.title, 'Marked complete: ' + s.en.title);
      }
      paintSection(id);
      syncProgressUI();
    });
    foot.appendChild(rec.doneBtn);

    var rel = RELATED[id] || [];
    if (rel.length) {
      var relWrap = el('div', 'ec-related');
      var relLabel = el('span', 'ec-related-label');
      relLabel.appendChild(bi('相关小节', 'Related'));
      relWrap.appendChild(relLabel);
      rel.forEach(function (targetId) {
        var info = linkTo(targetId);
        if (!info) return;
        var a = el('a', 'ec-related-link');
        a.href = info.href;
        a.appendChild(bi(info.zh, info.en));
        relWrap.appendChild(a);
      });
      foot.appendChild(relWrap);
    }
    wrap.appendChild(foot);

    var tabs = rec.article.querySelector('.tabs');
    if (tabs && tabs.parentNode) tabs.parentNode.insertBefore(wrap, tabs);
    else rec.article.insertBefore(wrap, rec.article.firstChild);
  }

  function buildPredict(id) {
    var rec = records[id];
    var p = rec.cfg.zh.predict;
    if (!p) return;
    var panel = rec.article.querySelector('.tab-panel[data-panel="demo"]');
    if (!panel) return;
    var box = el('section', 'ec-predict');
    box.setAttribute('aria-label', CFG.ui.zh.predict);
    var kicker = el('p', 'ec-kicker');
    kicker.appendChild(bi(CFG.ui.zh.predict, CFG.ui.en.predict));
    box.appendChild(kicker);
    var hint = el('p', 'ec-predict-hint');
    hint.appendChild(bi(CFG.ui.zh.predictHint, CFG.ui.en.predictHint));
    box.appendChild(hint);
    var q = el('p', 'ec-predict-q');
    q.appendChild(bi(p.q, rec.cfg.en.predict.q));
    box.appendChild(q);

    var opts = el('div', 'ec-predict-opts');
    var buttons = [];
    p.opts.forEach(function (opt, i) {
      var b = el('button', 'ec-predict-opt');
      b.type = 'button';
      b.dataset.index = i;
      var mark = el('span', 'ec-opt-mark', String.fromCharCode(65 + i));
      b.appendChild(mark);
      b.appendChild(bi(opt, rec.cfg.en.predict.opts[i] || opt));
      b.addEventListener('click', function () {
        if (box.dataset.answered) return;
        box.dataset.answered = '1';
        var correct = i === p.answer;
        buttons.forEach(function (btn, j) {
          btn.disabled = true;
          if (j === p.answer) btn.classList.add('is-correct');
          if (j === i && !correct) btn.classList.add('is-wrong');
        });
        fb.hidden = false;
        fb.className = 'ec-predict-fb ' + (correct ? 'is-correct' : 'is-wrong');
        fillBi(fbTitle, correct ? CFG.ui.zh.predictRight : CFG.ui.zh.predictWrong,
                          correct ? CFG.ui.en.predictRight : CFG.ui.en.predictWrong);
        fbExp.innerHTML = '';
        fbExp.appendChild(bi('演示后的解释：' + p.explain, 'Explanation: ' + rec.cfg.en.predict.explain));
        savePrediction(id, i);
        markLearning(id);
        Store.setState(CHKEY, id, 'learning');
        syncProgressUI();
      });
      opts.appendChild(b);
      buttons.push(b);
    });
    box.appendChild(opts);

    var fb = el('div', 'ec-predict-fb');
    fb.hidden = true;
    var fbTitle = el('p', 'ec-predict-fb-title');
    fb.appendChild(fbTitle);
    var fbExp = el('p', 'ec-predict-exp');
    fb.appendChild(fbExp);
    box.appendChild(fb);

    // 已做过的预测：回显但不再重复庆祝
    var saved = readPredictions()[id];
    if (typeof saved === 'number' && p.opts[saved]) {
      box.dataset.answered = '1';
      buttons.forEach(function (btn, j) {
        btn.disabled = true;
        if (j === p.answer) btn.classList.add('is-correct');
        if (j === saved && saved !== p.answer) btn.classList.add('is-wrong');
      });
      fb.hidden = false;
      fb.className = 'ec-predict-fb ' + (saved === p.answer ? 'is-correct' : 'is-wrong');
      fillBi(fbTitle, CFG.ui.zh.yourPrediction, CFG.ui.en.yourPrediction);
      fbExp.innerHTML = '';
      fbExp.appendChild(bi('演示后的解释：' + p.explain, 'Explanation: ' + rec.cfg.en.predict.explain));
    }

    panel.insertBefore(box, panel.firstChild);
  }

  function buildLab(id) {
    var rec = records[id];
    var panel = rec.article.querySelector('.tab-panel[data-panel="demo"]');
    if (!panel) return;
    var s = rec.cfg;
    var box = el('section', 'ec-lab');
    var kicker = el('p', 'ec-kicker');
    kicker.appendChild(bi(CFG.ui.zh.lab, CFG.ui.en.lab));
    box.appendChild(kicker);
    var p = el('p', 'ec-lab-text');
    p.appendChild(bi(s.zh.lab, s.en.lab));
    box.appendChild(p);

    if (s.zh.controls && s.zh.controls.length) {
      var guide = el('div', 'ec-controls');
      var gk = el('p', 'ec-controls-title');
      gk.appendChild(bi(CFG.ui.zh.controls, CFG.ui.en.controls));
      guide.appendChild(gk);
      var ul = el('ul', 'ec-controls-list');
      s.zh.controls.forEach(function (pair, i) {
        var enPair = (s.en.controls && s.en.controls[i]) || pair;
        var li = el('li');
        var name = el('b', 'ec-control-name');
        name.appendChild(bi(pair[0], enPair[0]));
        li.appendChild(name);
        li.appendChild(bi(pair[1], enPair[1]));
        ul.appendChild(li);
      });
      guide.appendChild(ul);
      box.appendChild(guide);
    }

    var actions = el('div', 'ec-lab-actions');
    var reset = el('button', 'ec-btn ec-btn-ghost');
    reset.type = 'button';
    reset.appendChild(bi(CFG.ui.zh.reset, CFG.ui.en.reset));
    reset.addEventListener('click', function () {
      var mount = panel.querySelector('.demo-mount, [id^="demo-mount-"]');
      var ok = false;
      if (window.__lessonDemoReset) ok = window.__lessonDemoReset(mount);
      if (!ok && mount) {
        mount.innerHTML = '';
        mount.removeAttribute('data-rendered');
      }
      toast(CFG.ui.zh.resetDone, CFG.ui.en.resetDone);
    });
    actions.appendChild(reset);
    box.appendChild(actions);

    var mount = panel.querySelector('.demo-mount, [id^="demo-mount-"]');
    if (mount && mount.nextSibling) panel.insertBefore(box, mount.nextSibling);
    else panel.appendChild(box);

    // 数据性质与适用范围（有数据说明的章节持续显示）
    if (CH.dataNote) {
      var note = el('p', 'ec-data-note');
      var nt = el('b');
      nt.appendChild(bi(CFG.ui.zh.dataNote, CFG.ui.en.dataNote));
      note.appendChild(nt);
      note.appendChild(document.createTextNode(' '));
      note.appendChild(bi(CH.dataNote.zh, CH.dataNote.en));
      panel.appendChild(note);
    }

    // 操作演示即计入「学习中」
    panel.addEventListener('click', function (e) {
      if (e.target.closest('.ec-predict')) return;
      Store.setState(CHKEY, id, 'learning');
      syncProgressUI();
    });
  }

  function buildSummary(id) {
    var rec = records[id];
    var s = rec.cfg;
    var box = el('section', 'ec-summary');
    var kicker = el('p', 'ec-kicker');
    kicker.appendChild(bi(CFG.ui.zh.summary, CFG.ui.en.summary));
    box.appendChild(kicker);
    [['use', 'use'], ['care', 'care']].forEach(function (pair) {
      var row = el('p', 'ec-summary-row');
      var label = el('b');
      label.appendChild(bi(CFG.ui.zh[pair[1] === 'use' ? 'use' : 'care'],
                           CFG.ui.en[pair[1] === 'use' ? 'use' : 'care']));
      row.appendChild(label);
      row.appendChild(document.createTextNode(' '));
      row.appendChild(bi(s.zh[pair[1]], s.en[pair[1]]));
      box.appendChild(row);
    });

    if (s.zh.compare && s.en.compare) {
      var cmp = el('div', 'ec-compare');
      var ck = el('p', 'ec-compare-title');
      ck.appendChild(bi(CFG.ui.zh.compare, CFG.ui.en.compare));
      cmp.appendChild(ck);
      [
        ['bad', CFG.ui.zh.compareBad, CFG.ui.en.compareBad],
        ['good', CFG.ui.zh.compareGood, CFG.ui.en.compareGood],
        ['why', CFG.ui.zh.compareWhy, CFG.ui.en.compareWhy]
      ].forEach(function (t) {
        var line = el('p', 'ec-compare-row ec-compare-' + t[0]);
        var tag = el('b', 'ec-compare-tag');
        tag.appendChild(bi(t[1], t[2]));
        line.appendChild(tag);
        line.appendChild(bi(s.zh.compare[t[0]], s.en.compare[t[0]]));
        cmp.appendChild(line);
      });
      box.appendChild(cmp);
    }

    rec.article.appendChild(box);
  }

  function buildQuiz(id) {
    var rec = records[id];
    var s = rec.cfg;
    var quiz = s.zh.quiz || [];
    if (!quiz.length) return;
    var box = el('section', 'ec-quiz');
    box.setAttribute('aria-label', CFG.ui.zh.quiz);
    var head = el('div', 'ec-quiz-head');
    var kicker = el('p', 'ec-kicker');
    kicker.appendChild(bi(CFG.ui.zh.quiz, CFG.ui.en.quiz));
    head.appendChild(kicker);
    var stat = el('span', 'ec-quiz-stat');
    stat.appendChild(bi('0 / ' + quiz.length, '0 / ' + quiz.length));
    head.appendChild(stat);
    box.appendChild(head);
    var hint = el('p', 'ec-quiz-hint');
    hint.appendChild(bi(CFG.ui.zh.quizHint, CFG.ui.en.quizHint));
    box.appendChild(hint);

    var ol = el('ol', 'ec-quiz-list');
    var answered = {};
    var statSpans = stat.querySelectorAll('[data-lang]');
    function updateStat() {
      var n = Object.keys(answered).length;
      var right = Object.keys(answered).filter(function (k) {
        return answered[k].ok;
      }).length;
      statSpans[0].textContent = '已答 ' + n + '/' + quiz.length + (n === quiz.length ? ' · 正确 ' + right : '');
      statSpans[1].textContent = n + '/' + quiz.length + ' answered' + (n === quiz.length ? ' · ' + right + ' correct' : '');
      if (n === quiz.length && right === quiz.length) {
        if (Store.getState(CHKEY, id) !== 'done') {
          Store.setState(CHKEY, id, 'done');
          toast('自测全部正确，本节已标记完成', 'All self-check answers correct; section marked complete');
        }
        paintSection(id);
        syncProgressUI();
      }
    }

    quiz.forEach(function (q, qi) {
      var en = (s.en.quiz || [])[qi] || { q: q.q, opts: q.opts, why: q.why };
      var li = el('li', 'ec-quiz-q');
      var qt = el('p', 'ec-quiz-qtext');
      qt.appendChild(bi(q.q, en.q));
      li.appendChild(qt);

      var opts = el('div', 'ec-quiz-opts');
      var btns = [];
      q.opts.forEach(function (opt, oi) {
        var b = el('button', 'ec-quiz-opt');
        b.type = 'button';
        b.appendChild(el('span', 'ec-opt-mark', String.fromCharCode(65 + oi)));
        b.appendChild(bi(opt, (en.opts && en.opts[oi]) || opt));
        b.addEventListener('click', function () {
          if (li.dataset.answered) return;
          li.dataset.answered = '1';
          var ok = oi === q.answer;
          answered[qi] = { ok: ok };
          btns.forEach(function (btn, j) {
            btn.disabled = true;
            if (j === q.answer) btn.classList.add('is-correct');
            if (j === oi && !ok) btn.classList.add('is-wrong');
          });
          fb.hidden = false;
          fb.className = 'ec-quiz-fb ' + (ok ? 'is-correct' : 'is-wrong');
          fillBi(fbTitle, ok ? CFG.ui.zh.correct : CFG.ui.zh.wrong,
                        ok ? CFG.ui.en.correct : CFG.ui.en.wrong);
          why.innerHTML = '';
          var w = el('p');
          var wLabel = el('b');
          wLabel.appendChild(bi(CFG.ui.zh.why + '：', CFG.ui.en.why + ': '));
          w.appendChild(wLabel);
          w.appendChild(bi(q.why, en.why || q.why));
          why.appendChild(w);
          var back = el('button', 'ec-link-btn');
          back.type = 'button';
          back.appendChild(bi(CFG.ui.zh.backToText, CFG.ui.en.backToText));
          back.addEventListener('click', function () { showTab(id, 'explain', true); });
          why.appendChild(back);
          if (!ok) {
            var retry = el('button', 'ec-link-btn');
            retry.type = 'button';
            retry.appendChild(bi('再试一次', 'Try again'));
            retry.addEventListener('click', function () {
              delete li.dataset.answered;
              delete answered[qi];
              btns.forEach(function (btn) {
                btn.disabled = false;
                btn.classList.remove('is-correct', 'is-wrong');
              });
              fb.hidden = true;
              updateStat();
            });
            why.appendChild(retry);
          }
          updateStat();
        });
        opts.appendChild(b);
        btns.push(b);
      });
      li.appendChild(opts);

      var fb = el('div', 'ec-quiz-fb');
      fb.hidden = true;
      var fbTitle = el('p', 'ec-quiz-fb-title');
      fb.appendChild(fbTitle);
      var why = el('div', 'ec-quiz-why');
      fb.appendChild(why);
      li.appendChild(fb);
      ol.appendChild(li);
    });

    box.appendChild(ol);
    rec.article.appendChild(box);
  }

  function showTab(id, name, scroll) {
    var article = document.getElementById(id);
    if (!article) return;
    article.querySelectorAll('.tab-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.tab === name);
      b.setAttribute('aria-selected', b.dataset.tab === name ? 'true' : 'false');
    });
    article.querySelectorAll('.tab-panel').forEach(function (p) {
      p.classList.toggle('active', p.dataset.panel === name);
    });
    if (scroll) article.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- 章末复习页 ---------- */
  function buildReview() {
    var content = document.querySelector('.chapter-content');
    if (!content || !CH.review) return;
    var r = CH.review.zh, re = CH.review.en;
    var box = el('section', 'ec-review');
    box.id = 'chapter-review';
    var kicker = el('p', 'ec-kicker');
    kicker.appendChild(bi(CFG.ui.zh.review, CFG.ui.en.review));
    box.appendChild(kicker);
    var h = el('h2');
    h.appendChild(bi(CH.zh.title + ' · 复习', CH.en.title + ' · Review'));
    box.appendChild(h);

    var grid = el('div', 'ec-review-grid');
    [
      { label: 'reviewConcepts', zh: r.concepts, en: re.concepts },
      { label: 'reviewCan', zh: r.can, en: re.can },
      { label: 'reviewMistakes', zh: r.mistakes, en: re.mistakes }
    ].forEach(function (col) {
      var c = el('div', 'ec-review-col');
      var h3 = el('h3');
      h3.appendChild(bi(CFG.ui.zh[col.label], CFG.ui.en[col.label]));
      c.appendChild(h3);
      var ul = el('ul');
      listItems(ul, col.zh, col.en);
      c.appendChild(ul);
      grid.appendChild(c);
    });
    box.appendChild(grid);

    var foot = el('div', 'ec-review-foot');
    var label = el('span');
    label.appendChild(bi('回到各节自测：', 'Revisit self-checks: '));
    foot.appendChild(label);
    CH.sections.forEach(function (sec) {
      var a = el('a', 'ec-review-link');
      a.href = '#' + sec.id;
      a.appendChild(bi(sec.zh.title, sec.en.title));
      foot.appendChild(a);
    });
    box.appendChild(foot);
    content.appendChild(box);
  }

  /* ---------- 每个小节装配 ---------- */
  ids.forEach(function (id, i) {
    var article = document.getElementById(id);
    if (!article) return;
    var cfg = (SEC[id] && SEC[id].cfg) || {
      zh: { title: links[i].textContent.trim(), goals: [], quiz: [] },
      en: { title: links[i].textContent.trim(), goals: [], quiz: [] }
    };
    records[id] = { article: article, cfg: cfg, index: i };
    buildGoals(id);
    buildPredict(id);
    buildLab(id);
    buildSummary(id);
    buildQuiz(id);
  });

  /* ---------- 每节底部：上一节 / 下一节 ---------- */
  ids.forEach(function (id, i) {
    var article = document.getElementById(id);
    if (!article) return;
    var foot = el('div', 'ls-footnav');
    var prev = el('button', 'ls-prev');
    prev.type = 'button';
    prev.disabled = i === 0;
    prev.appendChild(bi('← 上一节', '← Previous'));
    var idx = el('span', 'ls-idx', (i + 1) + ' / ' + ids.length);
    var next = el('button', 'ls-next');
    next.type = 'button';
    next.disabled = i === ids.length - 1;
    next.appendChild(bi('下一节 →', 'Next →'));
    prev.addEventListener('click', function () { if (i > 0) links[i - 1].click(); });
    next.addEventListener('click', function () { if (i < ids.length - 1) links[i + 1].click(); });
    foot.appendChild(prev); foot.appendChild(idx); foot.appendChild(next);
    article.appendChild(foot);
  });

  /* ---------- 小节状态绘制 ---------- */
  function paintSection(id) {
    var rec = records[id];
    if (!rec) return;
    var st = Store.getState(CHKEY, id);
    var isDone = st === 'done';
    rec.article.dataset.state = st;
    if (rec.badge) {
      rec.badge.dataset.state = st;
      var zh = isDone ? CFG.ui.zh.stateDone : st === 'learning' ? CFG.ui.zh.stateLearning : CFG.ui.zh.stateNew;
      var en = isDone ? CFG.ui.en.stateDone : st === 'learning' ? CFG.ui.en.stateLearning : CFG.ui.en.stateNew;
      fillBi(rec.badge, zh, en);
    }
    if (rec.doneBtn) {
      rec.doneBtn.classList.toggle('is-done', isDone);
      rec.doneBtn.setAttribute('aria-pressed', isDone ? 'true' : 'false');
      fillBi(rec.doneBtn, isDone ? CFG.ui.zh.markUndone : CFG.ui.zh.markDone,
                         isDone ? CFG.ui.en.markUndone : CFG.ui.en.markDone);
    }
    var li = stepEls.filter(function (n) { return n.dataset.target === id; })[0];
    if (li) {
      li.classList.toggle('done', isDone);
      li.classList.toggle('learning', st === 'learning');
    }
  }

  /* ---------- 预测记录 ---------- */
  function readPredictions() {
    try { return JSON.parse(localStorage.getItem(CFG.storage.prediction) || '{}') || {}; } catch (e) { return {}; }
  }
  function savePrediction(id, choice) {
    var all = readPredictions();
    all[id] = choice;
    try { localStorage.setItem(CFG.storage.prediction, JSON.stringify(all)); } catch (e) {}
  }

  /* ---------- 顶部工具条 ---------- */
  var tools = el('div', 'ec-tools');
  var bookmarkBtn = el('button', 'lesson-tool ec-tool');
  bookmarkBtn.type = 'button';
  bookmarkBtn.appendChild(el('span', 'ec-tool-icon', '☆'));
  bookmarkBtn.appendChild(bi('收藏本节', 'Save section'));
  tools.appendChild(bookmarkBtn);

  var searchBtn = el('button', 'lesson-tool ec-tool');
  searchBtn.type = 'button';
  searchBtn.appendChild(el('span', 'ec-tool-icon', '⌕'));
  searchBtn.appendChild(bi('搜索', 'Search'));
  tools.appendChild(searchBtn);

  var listBtn = el('button', 'lesson-tool ec-tool');
  listBtn.type = 'button';
  listBtn.appendChild(el('span', 'ec-tool-icon', '☰'));
  listBtn.appendChild(bi('学习清单', 'Study list'));
  tools.appendChild(listBtn);

  var helpBtn = el('button', 'lesson-tool ec-tool ec-tool-iconbtn');
  helpBtn.type = 'button';
  helpBtn.textContent = '?';
  tools.appendChild(helpBtn);

  if (header) header.appendChild(tools);
  else document.body.insertBefore(tools, document.body.firstChild);

  function paintBookmark() {
    var id = activeId || currentId();
    var saved = Store.isBookmarked(CHKEY, id);
    bookmarkBtn.classList.toggle('is-saved', saved);
    bookmarkBtn.setAttribute('aria-pressed', saved ? 'true' : 'false');
    bookmarkBtn.querySelector('.ec-tool-icon').textContent = saved ? '★' : '☆';
    fillBi(bookmarkBtn, saved ? '已收藏本节' : '收藏本节',
                       saved ? 'Section saved' : 'Save section');
    bookmarkBtn.setAttribute('aria-label', saved ? 'Remove bookmark for this section' : 'Bookmark this section');
  }
  bookmarkBtn.addEventListener('click', function () {
    var id = activeId || currentId();
    var added = Store.toggleBookmark(CHKEY, id);
    paintBookmark();
    toast(added ? '已加入学习清单' : '已从学习清单移除',
          added ? 'Added to your study list' : 'Removed from your study list');
  });

  /* ---------- 通用弹层 ---------- */
  var lastFocus = null;
  var openLayer = null;

  function lockScroll(on) {
    document.body.classList.toggle('ec-locked', on);
  }
  function trapFocus(e, panel) {
    if (e.key !== 'Tab') return;
    var nodes = Array.prototype.slice.call(panel.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (n) { return n.offsetParent !== null; });
    if (!nodes.length) return;
    var first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openModal(modal, focusEl) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    openLayer = modal;
    lockScroll(true);
    window.setTimeout(function () { if (focusEl) focusEl.focus(); }, 30);
  }
  function closeModal(modal) {
    modal.hidden = true;
    if (openLayer === modal) openLayer = null;
    lockScroll(false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /* ---------- 全文搜索 ---------- */
  var searchModal = el('div', 'ec-modal');
  searchModal.hidden = true;
  searchModal.innerHTML =
    '<div class="ec-backdrop" data-close="search"></div>' +
    '<div class="ec-panel ec-search-panel" role="dialog" aria-modal="true" aria-labelledby="ec-search-title">' +
      '<div class="ec-search-head">' +
        '<label id="ec-search-title" class="ec-sr-only"></label>' +
        '<input type="search" class="ec-search-input" autocomplete="off" spellcheck="false" />' +
        '<button type="button" class="ec-close" data-close="search">×</button>' +
      '</div>' +
      '<div class="ec-scope" role="group">' +
        '<button type="button" data-scope="chapter" class="is-active"></button>' +
        '<button type="button" data-scope="all"></button>' +
      '</div>' +
      '<div class="ec-results" role="listbox"></div>' +
      '<p class="ec-hint"></p>' +
    '</div>';
  document.body.appendChild(searchModal);

  var searchInput = searchModal.querySelector('.ec-search-input');
  var searchResults = searchModal.querySelector('.ec-results');
  var searchHint = searchModal.querySelector('.ec-hint');
  var scope = 'chapter';
  var resultItems = [];
  var resultIndex = -1;
  var searchToken = 0;

  function localizeSearchUI() {
    var U = UI();
    searchModal.querySelector('#ec-search-title').textContent = U.searchPlaceholder;
    searchInput.placeholder = U.searchChapter;
    searchInput.setAttribute('aria-label', U.searchPlaceholder);
    searchModal.querySelector('.ec-close').setAttribute('aria-label', U.close);
    searchModal.querySelector('[data-scope="chapter"]').textContent = isEn() ? 'This chapter' : '本章';
    searchModal.querySelector('[data-scope="all"]').textContent = isEn() ? 'Whole course' : '全课程';
    searchHint.textContent = isEn() ? '↑ ↓ select · Enter open · Esc close' : '↑ ↓ 选择 · Enter 打开 · Esc 关闭';
  }

  function sectionList() {
    return CH.sections.map(function (s) {
      return { title: s.zh.title, titleEn: s.en.title, href: '#' + s.id };
    });
  }
  function drawStatic() {
    resultItems = sectionList();
    renderResults(resultItems.map(function (x) {
      return { href: x.href, title: x.title, titleEn: x.titleEn, chapter: CH[L()].title, snippet: '' };
    }));
  }
  function renderResults(items) {
    searchResults.innerHTML = '';
    resultIndex = items.length ? 0 : -1;
    if (!items.length) {
      var p = el('p', 'ec-empty');
      p.appendChild(bi(CFG.ui.zh.noResults, CFG.ui.en.noResults));
      searchResults.appendChild(p);
      return;
    }
    items.forEach(function (item, i) {
      var b = el('button', 'ec-result');
      b.type = 'button';
      b.setAttribute('role', 'option');
      b.dataset.href = item.href;
      var title = el('span', 'ec-result-title');
      title.appendChild(bi(item.title || item.titleEn, item.titleEn || item.title));
      b.appendChild(title);
      var meta = el('span', 'ec-result-meta', item.chapter || '');
      b.appendChild(meta);
      if (item.snippet) {
        var snip = el('span', 'ec-result-snip', item.snippet);
        b.appendChild(snip);
      }
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('mouseenter', function () {
        resultIndex = i;
        markActive();
      });
      b.addEventListener('click', function () { go(item.href); });
      searchResults.appendChild(b);
    });
    searchResults.setAttribute('aria-activedescendant', '');
  }
  function markActive() {
    Array.prototype.forEach.call(searchResults.querySelectorAll('.ec-result'), function (n, i) {
      n.classList.toggle('is-active', i === resultIndex);
    });
    var act = searchResults.querySelector('.ec-result.is-active');
    if (act) act.scrollIntoView({ block: 'nearest' });
  }
  function go(href) {
    closeModal(searchModal);
    var hash = href.indexOf('#') !== -1 ? href.slice(href.indexOf('#') + 1) : '';
    if (hash && ids.indexOf(hash) !== -1) {
      var link = links.filter(function (a) { return a.dataset.chapter === hash; })[0];
      if (link) { link.click(); return; }
    }
    location.href = href;
  }
  function runSearch(q) {
    var token = ++searchToken;
    var scopeKey = scope === 'chapter' ? CHKEY : null;
    if (!q || !q.trim()) { drawStatic(); return; }
    searchResults.innerHTML = '<p class="ec-empty"></p>';
    searchResults.firstChild.appendChild(bi(CFG.ui.zh.searching, CFG.ui.en.searching));
    Search.search(q, { chapterKey: scopeKey, limit: 24 }).then(function (list) {
      if (token !== searchToken) return;
      renderResults(list.map(function (r) {
        return {
          href: r.href,
          title: r.title,
          titleEn: r.title,
          chapter: r.chapter,
          snippet: r.snippet
        };
      }));
    });
  }

  function openSearch() {
    localizeSearchUI();
    openModal(searchModal, searchInput);
    searchInput.value = '';
    drawStatic();
  }
  searchInput.addEventListener('input', function () {
    window.clearTimeout(searchInput._t);
    searchInput._t = window.setTimeout(function () { runSearch(searchInput.value); }, 180);
  });
  searchInput.addEventListener('keydown', function (e) {
    var items = Array.prototype.slice.call(searchResults.querySelectorAll('.ec-result'));
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!items.length) return;
      resultIndex = (resultIndex + 1) % items.length; markActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!items.length) return;
      resultIndex = (resultIndex - 1 + items.length) % items.length; markActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      var act = searchResults.querySelector('.ec-result.is-active') || items[0];
      if (act) go(act.dataset.href);
    }
  });
  searchModal.querySelectorAll('[data-close="search"]').forEach(function (n) {
    n.addEventListener('click', function () { closeModal(searchModal); });
  });
  searchModal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); closeModal(searchModal); }
    else trapFocus(e, searchModal.querySelector('.ec-panel'));
  });
  searchModal.querySelectorAll('[data-scope]').forEach(function (b) {
    b.addEventListener('click', function () {
      scope = b.dataset.scope;
      searchModal.querySelectorAll('[data-scope]').forEach(function (x) {
        x.classList.toggle('is-active', x === b);
      });
      runSearch(searchInput.value);
    });
  });
  searchBtn.addEventListener('click', openSearch);

  /* ---------- 学习清单抽屉 ---------- */
  var drawer = el('div', 'ec-modal ec-drawer');
  drawer.hidden = true;
  drawer.innerHTML =
    '<div class="ec-backdrop" data-close="drawer"></div>' +
    '<aside class="ec-panel ec-drawer-panel" role="dialog" aria-modal="true" aria-labelledby="ec-drawer-title">' +
      '<div class="ec-drawer-head">' +
        '<div><p class="ec-kicker"></p><h2 id="ec-drawer-title"></h2></div>' +
        '<button type="button" class="ec-close" data-close="drawer">×</button>' +
      '</div>' +
      '<div class="ec-drawer-filter"><select class="ec-select" aria-label="Filter by chapter"></select></div>' +
      '<ul class="ec-bm-list"></ul>' +
      '<div class="ec-drawer-foot">' +
        '<button type="button" class="ec-btn ec-export"></button>' +
        '<button type="button" class="ec-btn ec-btn-ghost ec-import"></button>' +
        '<input type="file" class="ec-file" accept="application/json,.json" hidden />' +
      '</div>' +
      '<p class="ec-hint ec-import-hint"></p>' +
    '</aside>';
  document.body.appendChild(drawer);

  var drawerSelect = drawer.querySelector('.ec-select');
  var drawerList = drawer.querySelector('.ec-bm-list');
  var drawerFilter = 'all';

  function localizeDrawer() {
    var U = UI();
    drawer.querySelector('.ec-kicker').textContent = U.bookmarks;
    drawer.querySelector('#ec-drawer-title').textContent = U.bookmarks;
    drawer.querySelector('.ec-close').setAttribute('aria-label', U.close);
    drawer.querySelector('.ec-export').textContent = U.export;
    drawer.querySelector('.ec-import').textContent = U.import;
    drawer.querySelector('.ec-import-hint').textContent = U.importHint;
    drawer.querySelector('.ec-drawer-filter select').setAttribute('aria-label', U.bookmarks);
  }
  function renderDrawer() {
    var marks = Store.getBookmarks();
    drawerSelect.innerHTML = '';
    var allOpt = el('option', null, CFG.ui[L()].all);
    allOpt.value = 'all';
    drawerSelect.appendChild(allOpt);
    CFG.chapters.forEach(function (ch) {
      var o = el('option', null, ch[L()].title);
      o.value = ch.key;
      drawerSelect.appendChild(o);
    });
    drawerSelect.value = drawerFilter;

    drawerList.innerHTML = '';
    var list = marks.filter(function (b) { return drawerFilter === 'all' || b.chapter === drawerFilter; });
    if (!list.length) {
      var li = el('li', 'ec-bm-empty');
      li.appendChild(bi(CFG.ui.zh.bookmarksEmpty, CFG.ui.en.bookmarksEmpty));
      drawerList.appendChild(li);
      return;
    }
    list.forEach(function (b) {
      var ch = CFG.chapters.filter(function (c) { return c.key === b.chapter; })[0];
      if (!ch) return;
      var sec = ch.sections.filter(function (s) { return s.id === b.section; })[0];
      if (!sec) return;
      var li = el('li', 'ec-bm-item');
      var a = el('a', 'ec-bm-link');
      a.href = ch.key === CHKEY ? '#' + sec.id : '../' + ch.dir + '/#' + sec.id;
      var meta = el('span', 'ec-bm-ch', ch[L()].title);
      var title = el('strong', 'ec-bm-title');
      title.appendChild(bi(sec.zh.title, sec.en.title));
      a.appendChild(meta); a.appendChild(title);
      a.addEventListener('click', function (e) {
        if (ch.key === CHKEY) {
          e.preventDefault();
          closeModal(drawer);
          var link = links.filter(function (x) { return x.dataset.chapter === sec.id; })[0];
          if (link) link.click();
        }
      });
      var rm = el('button', 'ec-bm-remove');
      rm.type = 'button';
      rm.appendChild(bi('移除', 'Remove'));
      rm.addEventListener('click', function () {
        Store.removeBookmark(b.chapter, b.section);
        renderDrawer();
        paintBookmark();
      });
      li.appendChild(a); li.appendChild(rm);
      drawerList.appendChild(li);
    });
  }

  listBtn.addEventListener('click', function () {
    localizeDrawer();
    renderDrawer();
    openModal(drawer, drawer.querySelector('.ec-close'));
  });
  drawer.querySelectorAll('[data-close="drawer"]').forEach(function (n) {
    n.addEventListener('click', function () { closeModal(drawer); });
  });
  drawer.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); closeModal(drawer); }
    else trapFocus(e, drawer.querySelector('.ec-panel'));
  });
  drawerSelect.addEventListener('change', function () {
    drawerFilter = drawerSelect.value;
    renderDrawer();
  });
  drawer.querySelector('.ec-export').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify(Store.exportData(), null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vis-course-learning.json';
    document.body.appendChild(a);
    a.click();
    window.setTimeout(function () {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 200);
    toast('学习记录已导出', 'Learning record exported');
  });
  drawer.querySelector('.ec-import').addEventListener('click', function () {
    drawer.querySelector('.ec-file').click();
  });
  drawer.querySelector('.ec-file').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var res = Store.importData(reader.result);
      e.target.value = '';
      if (res.ok) {
        toast(CFG.ui.zh.imported, CFG.ui.en.imported);
        renderDrawer(); paintBookmark(); syncProgressUI();
      } else {
        toast(CFG.ui.zh.importFailed, CFG.ui.en.importFailed);
      }
    };
    reader.readAsText(file);
  });

  /* ---------- 快捷键说明 ---------- */
  var helpModal = el('div', 'ec-modal');
  helpModal.hidden = true;
  helpModal.innerHTML =
    '<div class="ec-backdrop" data-close="help"></div>' +
    '<div class="ec-panel ec-help-panel" role="dialog" aria-modal="true" aria-labelledby="ec-help-title">' +
      '<div class="ec-drawer-head">' +
        '<div><p class="ec-kicker"></p><h2 id="ec-help-title"></h2></div>' +
        '<button type="button" class="ec-close" data-close="help">×</button>' +
      '</div>' +
      '<dl class="ec-shortcuts"></dl>' +
    '</div>';
  document.body.appendChild(helpModal);

  function localizeHelp() {
    var U = UI();
    helpModal.querySelector('.ec-kicker').textContent = U.shortcuts;
    helpModal.querySelector('#ec-help-title').textContent = U.shortcuts;
    helpModal.querySelector('.ec-close').setAttribute('aria-label', U.close);
    var rows = [
      ['← / →', U.scPrevNext],
      ['Ctrl / Cmd + K', U.scSearch],
      ['/ ', U.scSearch],
      ['?', U.scHelp],
      ['Esc', U.scEsc]
    ];
    var dl = helpModal.querySelector('.ec-shortcuts');
    dl.innerHTML = '';
    rows.forEach(function (r) {
      var dt = el('dt', null, r[0]);
      var dd = el('dd', null, r[1]);
      dl.appendChild(dt); dl.appendChild(dd);
    });
  }
  function openHelp() {
    localizeHelp();
    openModal(helpModal, helpModal.querySelector('.ec-close'));
  }
  helpBtn.addEventListener('click', openHelp);
  helpModal.querySelectorAll('[data-close="help"]').forEach(function (n) {
    n.addEventListener('click', function () { closeModal(helpModal); });
  });
  helpModal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); closeModal(helpModal); }
    else trapFocus(e, helpModal.querySelector('.ec-panel'));
  });

  /* ---------- 键盘：←/→ 小节，Ctrl+K / “?” ---------- */
  document.addEventListener('keydown', function (e) {
    if (openLayer) return;
    if (e.key === 'Escape') return;
    var t = e.target;
    var inControl = t && (
      t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' ||
      t.isContentEditable || (t.closest && t.closest('.demo-mount, [role="slider"], [role="tablist"]'))
    );
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
      return;
    }
    if (inControl || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === '/' ) {
      e.preventDefault();
      openSearch();
    } else if (e.key === '?') {
      e.preventDefault();
      openHelp();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      var i = ids.indexOf(activeId || currentId());
      var j = e.key === 'ArrowRight' ? i + 1 : i - 1;
      if (j >= 0 && j < ids.length) {
        e.preventDefault();
        links[j].click();
      }
    }
  });

  /* ---------- 代码复制 / 演示未加载提示 ---------- */
  document.querySelectorAll('.tab-panel pre').forEach(function (pre) {
    var codeEl = pre.querySelector('code');
    var sourceText = (codeEl || pre).innerText;
    var btn = el('button', 'ec-copy');
    btn.type = 'button';
    btn.appendChild(bi(CFG.ui.zh.copy, CFG.ui.en.copy));
    btn.addEventListener('click', function () {
      var text = sourceText;
      function done() { toast(CFG.ui.zh.copied, CFG.ui.en.copied); }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = el('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) {}
        ta.remove();
        done();
      }
    });
    pre.appendChild(btn);
  });

  window.setTimeout(function () {
    document.querySelectorAll('.demo-mount, [id^="demo-mount-"]').forEach(function (mount) {
      if (mount.dataset.rendered || mount.children.length) return;
      var panel = mount.closest('.tab-panel');
      if (!panel || panel.querySelector('.ec-offline')) return;
      var p = el('p', 'ec-offline');
      p.appendChild(bi(CFG.ui.zh.offline, CFG.ui.en.offline));
      panel.insertBefore(p, panel.firstChild);
    });
  }, 4200);

  /* ---------- 事件同步 ---------- */
  document.addEventListener('wbl:storechange', function (e) {
    var type = e.detail && e.detail.type;
    if (type === 'bookmarks') paintBookmark();
    if (type === 'progress' || type === 'import') {
      syncProgressUI();
      paintSection(activeId || currentId());
    }
    if (type === 'bookmarks' && !drawer.hidden) renderDrawer();
  });
  document.addEventListener('wbl:localechange', function () {
    syncLabels();
    syncProgressUI();
    paintBookmark();
    localizeSearchUI();
    localizeDrawer();
    localizeHelp();
    if (!searchModal.hidden && !searchInput.value.trim()) drawStatic();
  });

  /* ---------- 初始化 ---------- */
  buildReview();
  syncLabels();
  activeId = currentId();
  activate(activeId);
  syncProgressUI();
  paintBookmark();
  localizeSearchUI();
  localizeDrawer();
  localizeHelp();
  if (window.__i18n && typeof window.__i18n.apply === 'function') window.__i18n.apply();
  else document.addEventListener('DOMContentLoaded', function () {
    if (window.__i18n) window.__i18n.apply();
  });
})();
