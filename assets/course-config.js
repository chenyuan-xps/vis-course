/* =============================================================
 * course-config.js — 课程单一数据源（章节 / 小节 / 学习目标 / 自测）
 * 所有页面共享；增强脚本与门户脚本都从这里读取课程元数据。
 * 内容字段均为 { zh, en } 双语对象。
 * ============================================================= */
window.COURSE_CONFIG = {
  version: 6,
  storage: {
    progress: 'vis-progress:v2',
    last: 'vis-last',
    bookmarks: 'vis-bookmarks:v2',
    prediction: 'vis-predictions'
  },

  ui: {
    zh: {
      goals: '学习目标', goalsHint: '学完本节，你应该能够：',
      predict: '先预测，再看结果', predictHint: '先凭直觉选一个，再操作演示验证。',
      predictRight: '预测正确。现在操作演示，观察差异。', predictWrong: '和演示结果不同，这很正常——带着问题继续操作。',
      yourPrediction: '你的预测', answer: '演示后的解释',
      lab: '演示说明', controls: '控制项说明', reset: '重置演示', resetDone: '演示已恢复到初始状态',
      compare: '错误方案 → 改进方案', compareBad: '错误方案', compareGood: '改进方案', compareWhy: '为什么',
      dataNote: '数据说明',
      offline: '演示脚本未加载。请检查网络（D3.js 来自 CDN），或按 README 用本地服务器打开。',
      summary: '小结', use: '适用', care: '慎用',
      quiz: '自测', quizHint: '选一个答案，立即看到解析。',
      correct: '回答正确', wrong: '再想想', why: '解析', backToText: '回到讲解',
      markDone: '标记本节已完成', markUndone: '已完成 · 点击撤销',
      completeHint: '完成自测或亲手操作演示后，再把本节标记为完成。',
      stateNew: '未开始', stateLearning: '学习中', stateDone: '已完成',
      progressDone: '已完成', learningNow: '进行中',
      review: '本章复习', reviewConcepts: '关键概念', reviewCan: '你应该会做',
      reviewMistakes: '常见错误', reviewQuiz: '回到各节自测',
      bookmarks: '学习清单', bookmarksEmpty: '还没有收藏。打开小节后点右上角 ☆ 收藏本节。',
      all: '全部', remove: '移除', open: '打开',
      export: '导出学习记录', import: '导入学习记录', importHint: '选择之前导出的 JSON 文件，合并进度与收藏。',
      imported: '学习记录已导入', importFailed: '文件格式不正确，未导入。',
      continueTitle: '继续上次学习', continueHint: '从上次离开的小节接着学。',
      continueBtn: '继续学习 →', lastTime: '上次学到',
      searchPlaceholder: '搜索概念、关键词或小节内容…', searchChapter: '搜索本章或全课程内容…',
      searching: '正在检索课程正文…', noResults: '没有找到匹配内容', section: '小节',
      shortcuts: '快捷键', shortcutHelp: '? 打开快捷键说明',
      scPrevNext: '上一节 / 下一节', scSearch: '打开内容搜索', scHelp: '打开或关闭本说明', scEsc: '关闭弹层',
      copy: '复制代码', copied: '已复制', close: '关闭',
      progressLabel: '学习进度', sectionsWord: '节',
      chapterTime: '预计学习时间', chapterPrereq: '前置知识', chapterFocus: '本章重点',
      completedOf: '已完成'
    },
    en: {
      goals: 'Learning goals', goalsHint: 'By the end of this section you should be able to:',
      predict: 'Predict before you look', predictHint: 'Choose an answer first, then run the demo to check it.',
      predictRight: 'Your prediction matches. Now run the demo and observe the difference.', predictWrong: 'It differs from the demo. That is fine - keep the question in mind as you explore.',
      yourPrediction: 'Your prediction', answer: 'Explanation after the demo',
      lab: 'What the controls do', controls: 'Control guide', reset: 'Reset demo', resetDone: 'Demo restored to its initial state',
      compare: 'Weak approach -> better approach', compareBad: 'Weak approach', compareGood: 'Better approach', compareWhy: 'Why',
      dataNote: 'About the data',
      offline: 'The demo script did not load. Check your connection (D3.js is loaded from a CDN), or serve the site locally as described in the README.',
      summary: 'Summary', use: 'Use when', care: 'Avoid when',
      quiz: 'Check yourself', quizHint: 'Pick one answer to see the explanation immediately.',
      correct: 'Correct', wrong: 'Not quite', why: 'Why', backToText: 'Back to the explanation',
      markDone: 'Mark section complete', markUndone: 'Completed - click to undo',
      completeHint: 'Mark the section complete after the self-check or after trying the demo yourself.',
      stateNew: 'Not started', stateLearning: 'In progress', stateDone: 'Completed',
      progressDone: 'completed', learningNow: 'in progress',
      review: 'Chapter review', reviewConcepts: 'Key concepts', reviewCan: 'You should be able to',
      reviewMistakes: 'Common mistakes', reviewQuiz: 'Revisit section self-checks',
      bookmarks: 'Study list', bookmarksEmpty: 'No bookmarks yet. Open a section and click the star to save it.',
      all: 'All', remove: 'Remove', open: 'Open',
      export: 'Export progress', import: 'Import progress', importHint: 'Choose a previously exported JSON file to merge progress and bookmarks.',
      imported: 'Progress imported', importFailed: 'This file is not valid; nothing was imported.',
      continueTitle: 'Continue where you left off', continueHint: 'Pick up from the last section you visited.',
      continueBtn: 'Continue learning', lastTime: 'Last section',
      searchPlaceholder: 'Search concepts, keywords, or section text...', searchChapter: 'Search this chapter or the whole course...',
      searching: 'Indexing course text...', noResults: 'No matching content', section: 'Section',
      shortcuts: 'Keyboard shortcuts', shortcutHelp: '? for shortcuts',
      scPrevNext: 'Previous / next section', scSearch: 'Search course content', scHelp: 'Toggle this help', scEsc: 'Close a dialog',
      copy: 'Copy code', copied: 'Copied', close: 'Close',
      progressLabel: 'Progress', sectionsWord: 'sections',
      chapterTime: 'Estimated time', chapterPrereq: 'Prerequisites', chapterFocus: 'Chapter focus',
      completedOf: 'completed'
    }
  },

  chapters: [
    /* ================= 第 1 章 · 数据 ================= */
    {
      key: '1', dir: 'lesson-01', href: 'lesson-01/', color: '#0e765d',
      zh: { title: '数据', time: '60–75 分钟', prereq: '无需前置课程，建议作为起点', focus: ['质量边界', 'DIKW', '测量尺度 × 视觉通道', 'D3 数据流'] },
      en: { title: 'Data', time: '60-75 min', prereq: 'No prerequisites; start here', focus: ['Quality limits', 'DIKW', 'Scales x channels', 'D3 data flow'] },
      points: { zh: ['DIKW 金字塔', 'Stevens 4 尺度', 'Mackinlay 通道排序', '8 个 D3 变换函数', 'Selection 三态'], en: ['DIKW pyramid', 'Stevens scales', 'Mackinlay ranking', 'D3 array helpers', 'Join states'] },
      dataNote: { zh: '本章演示使用 DeepSeek 合成的 80 条新生数据。姓名、籍贯均为虚构，仅用于教学，不能用于真实人口分析。', en: 'Demos use 80 synthetic new-student records generated by DeepSeek. Names and hometowns are fictional and must not be used for real demographic analysis.' },
      review: {
        zh: {
          concepts: ['数据质量四维度：准确性 / 完整性 / 一致性 / 时效性', 'DIKW：可视化主要完成 Data → Information', 'Stevens 四尺度：名义 / 序数 / 区间 / 比率', 'Mackinlay：位置最准，色相最适合分类', 'Data-Join：enter / update / exit'],
          can: ['把中文 CSV 列名映射成英文变量，并在 row 回调里转换类型', '给一组数据判断测量尺度，并选配合适的视觉通道', '用 group / rollup 做分组与聚合', '用 key 函数保持元素身份，避免过渡动画错乱'],
          mistakes: ['把合成数据当成真实分布', '用彩虹色编码连续数值', '类别数据用 scaleLinear，出现"0.5 班"', '不写 row 回调，导致 age 仍是字符串']
        },
        en: {
          concepts: ['Data quality: accuracy / completeness / consistency / timeliness', 'DIKW: visualization mostly moves Data to Information', 'Stevens scales: nominal / ordinal / interval / ratio', 'Mackinlay: position is most accurate; hue is best for categories', 'Data-Join: enter / update / exit'],
          can: ['Map Chinese CSV columns to English keys and cast types in a row callback', 'Classify a variable by scale and pick a matching visual channel', 'Group and aggregate with group / rollup', 'Use a key function to keep element identity during transitions'],
          mistakes: ['Treating synthetic data as a real distribution', 'Encoding continuous values with a rainbow palette', 'Using scaleLinear for categories', 'Skipping the row callback, leaving age as a string']
        }
      },
      sections: [
        {
          id: 'ch-1-1',
          zh: {
            title: '1.1 数据生成',
            goals: ['说清 AI 合成数据在准确性、完整性上的边界', '把 CSV 中文列名映射成英文变量并完成类型转换', '用 d3.csv 的 row 回调边读边转，而不是读完再 map'],
            predict: { q: '跳过 row 回调、直接 await d3.csv(...) 时，age 字段在 JS 里是什么类型？', opts: ['Number', 'String', 'Date'], answer: 1, explain: 'CSV 读进来的每一列默认都是字符串；row 回调里的 +d["年龄"] 才把它转成 Number。' },
            lab: '「重新加载」会重新请求 CSV，并在控制台与表格中展示字段映射、类型转换的结果。',
            controls: [['「重新加载」', '重新请求 CSV，重跑字段映射与类型转换，刷新表格与控制台日志']],
            use: '需要把外部表格接入网页、并保证字段类型正确时。',
            care: '数据来源本身不可信时，先解决质量问题，再谈可视化。',
            quiz: [{ q: '在 transformRow 里给 name 调用 trim()，主要是为了避免什么？', opts: ['姓名重复', '首尾空格导致过滤/聚合失败', '中文乱码'], answer: 1, why: '「软件工程1班 」末尾的空格会让分组键与其它行不一致，导致统计时被拆成两类。' }]
          },
          en: {
            title: '1.1 Data generation',
            goals: ['Explain the accuracy and completeness limits of AI-synthesized data', 'Map Chinese CSV headers to English keys and cast their types', 'Transform rows inside the d3.csv callback instead of mapping afterwards'],
            predict: { q: 'If you skip the row callback and just await d3.csv(...), what is the type of age in JS?', opts: ['Number', 'String', 'Date'], answer: 1, explain: 'Every CSV column arrives as a string; +d["age"] inside the row callback is what makes it a Number.' },
            lab: 'Reload requests the CSV again and shows the field mapping and type conversions in the table and console.',
            controls: [['Reload', 'Requests the CSV again, reruns field mapping and type casting, and refreshes the table and console log']],
            use: 'When connecting an external table to a web page and the field types must be correct.',
            care: 'When the source itself is untrustworthy: fix data quality first, then visualize.',
            quiz: [{ q: 'Why call trim() on name inside transformRow?', opts: ['To remove duplicate names', 'Leading/trailing spaces break filtering and aggregation', 'To fix Chinese encoding'], answer: 1, why: 'A trailing space in "Software 1 " makes the group key differ from other rows, splitting one class into two.' }]
          }
        },
        {
          id: 'ch-1-2',
          zh: {
            title: '1.2 数据定义',
            goals: ['按 DIKW 四层给一个具体问题定位', '解释可视化为什么主要完成 Data → Information', '说明可视化在 Knowledge / Wisdom 层的边界'],
            predict: { q: '点击金字塔的「知识」层，它对应的典型可视化是什么？', opts: ['原始 CSV 表格', '统计模型与机器学习预测', '战略仪表盘'], answer: 1, explain: '知识层回答「如何」，通常靠统计模型、聚类或预测来提炼模式；仪表盘更接近智慧层的决策支持。' },
            lab: '点击金字塔任意一层，右侧会显示该层的定义、回答的问题与典型可视化。',
            controls: [['金字塔各层', '点击任意一层，右侧显示该层定义、回答的问题与典型可视化']],
            use: '需要向非专业读者解释「图表能做什么、不能做什么」时。',
            care: '把 DIKW 当成严格的科学分层：它更像教学脚手架，层与层之间存在重叠。',
            quiz: [{ q: '按照本章观点，可视化最擅长完成哪一步？', opts: ['Data → Information', 'Information → Knowledge', 'Knowledge → Wisdom'], answer: 0, why: '图表把原始数据组织成可读结构，主要提升到信息层；知识需要模型辅助，智慧涉及决策。' }]
          },
          en: {
            title: '1.2 Defining data',
            goals: ['Place a concrete question on the four DIKW levels', 'Explain why visualization mainly moves Data to Information', 'State the limits of visualization at the Knowledge and Wisdom levels'],
            predict: { q: 'Click the "Knowledge" layer: which visualization is typical there?', opts: ['A raw CSV table', 'Statistical models and machine-learning predictions', 'A strategic dashboard'], answer: 1, explain: 'Knowledge answers "how" and is usually produced by models, clustering or prediction; dashboards lean toward decision support.' },
            lab: 'Click a pyramid layer to see its definition, the question it answers and typical visualizations.',
            controls: [['Pyramid layers', 'Click a layer to see its definition, the question it answers and typical visualizations']],
            use: 'When explaining to a non-specialist what a chart can and cannot do.',
            care: 'Treating DIKW as a strict scientific hierarchy: it is a teaching scaffold with overlapping layers.',
            quiz: [{ q: 'According to this chapter, which step does visualization handle best?', opts: ['Data to Information', 'Information to Knowledge', 'Knowledge to Wisdom'], answer: 0, why: 'Charts organize raw data into a readable structure (information); knowledge needs models, and wisdom involves judgment.' }]
          }
        },
        {
          id: 'ch-1-3',
          zh: {
            title: '1.3 数据属性',
            goals: ['区分名义、序数、区间、比率四种测量尺度', '把尺度匹配到位置、亮度、色相等视觉通道', '解释为什么位置比颜色更适合表达数值'],
            predict: { q: '把年龄（17–22 岁）映射成彩虹色相，读者最可能得到什么印象？', opts: ['能准确比较大小', '只能看出"不同"，看不出谁大谁小', '颜色越暖数值一定越大'], answer: 1, explain: '色相是定性通道，能区分类别但不擅长表达量级；数值应优先用位置、长度等定量通道。' },
            lab: '四组小图分别展示类别→色相、序数→亮度、数值→位置，以及数值→色相的错误示范。',
            controls: [['（静态对照图）', '无交互控件；直接比较四组小图的映射方式与可读性']],
            compare: {
              bad: '把年龄、成绩等数值映射成彩虹色相',
              good: '把数值映射到位置或长度，色相只用于区分类别',
              why: '色相是定性通道，读者只能判断「不同」，无法准确比较大小；位置和长度的感知顺序与数值顺序一致。'
            },
            use: '拿到新字段时，先判断尺度，再选通道；这是所有图表设计的第一步。',
            care: '不要给区间尺度做乘除（例如把 20°C 说成比 10°C 热一倍）。',
            quiz: [{ q: '「班级序号（1 班、2 班、3 班）」属于哪种测量尺度？', opts: ['名义', '序数', '比率'], answer: 1, why: '班级之间有顺序，但班与班之间的"距离"没有定量含义，因此是序数尺度。' }]
          },
          en: {
            title: '1.3 Data attributes',
            goals: ['Distinguish nominal, ordinal, interval and ratio scales', 'Match each scale to position, lightness, hue and other channels', 'Explain why position beats color for quantities'],
            predict: { q: 'If age (17-22) is encoded with a rainbow hue scale, what will readers most likely perceive?', opts: ['They can compare magnitudes accurately', 'They see difference but not who is larger', 'Warmer colors always mean larger values'], answer: 1, explain: 'Hue is an identity channel: good for categories, poor for magnitude. Use position or length for quantities.' },
            lab: 'Four small charts show category-to-hue, ordinal-to-lightness, value-to-position, and the wrong case of value-to-hue.',
            controls: [['(Static comparison)', 'No interactive controls; compare the four mapping choices and their readability directly']],
            compare: {
              bad: 'Mapping values such as age or score to a rainbow hue scale',
              good: 'Mapping values to position or length, and reserving hue for categories',
              why: 'Hue is an identity channel: readers can tell items apart but cannot compare magnitudes accurately. Position and length preserve the order of the values.'
            },
            use: 'Every time you receive a new field: identify the scale first, then choose the channel.',
            care: 'Do not multiply or divide interval values (20 C is not twice as hot as 10 C).',
            quiz: [{ q: 'A class number (Class 1, 2, 3) is which measurement scale?', opts: ['Nominal', 'Ordinal', 'Ratio'], answer: 1, why: 'Classes have an order, but distances between them carry no quantitative meaning, so the scale is ordinal.' }]
          }
        },
        {
          id: 'ch-1-4',
          zh: {
            title: '1.4 数据变换',
            goals: ['说明这组函数为什么是不可变、可链式的', '区分 group 与 rollup 的返回结果', '用 map / filter / reduce 组合出一次统计'],
            predict: { q: 'd3.rollup(students, v => v.length, s => s.class) 返回什么？', opts: ['一个数组', '一个 Map', '一个普通对象'], answer: 1, explain: 'rollup 返回 Map：键是分组值，值是该组的聚合结果；需要数组时再用 Array.from(...)。' },
            lab: '下拉框切换 map / reduce / cross / group / rollup 等函数，下方同步显示输入与输出。',
            controls: [['函数下拉框', '切换 map / group / rollup 等函数，下方同步显示该函数的输入与输出']],
            use: '需要在绘图前做清洗、聚合、宽长转换时。',
            care: '百万级数组上连续链式 map / filter 会反复创建新数组，需要留意性能。',
            quiz: [{ q: '哪个函数会保留每组的全部原始元素？', opts: ['rollup', 'group', 'reduce'], answer: 1, why: 'group 返回「键 → 原始元素数组」的 Map；rollup 则把每组归约成一个值。' }]
          },
          en: {
            title: '1.4 Data transformation',
            goals: ['Explain why these helpers are immutable and chainable', 'Distinguish the return values of group and rollup', 'Combine map / filter / reduce into one statistic'],
            predict: { q: 'What does d3.rollup(students, v => v.length, s => s.class) return?', opts: ['An array', 'A Map', 'A plain object'], answer: 1, explain: 'rollup returns a Map keyed by group, with the aggregated value; use Array.from(...) when you need an array.' },
            lab: 'Use the dropdown to switch between map, reduce, cross, group, rollup; input and output update below.',
            controls: [['Function dropdown', 'Switches between map, group, rollup and others; the input and output below update to match']],
            use: 'When cleaning, aggregating or reshaping data before drawing.',
            care: 'On million-row arrays, repeated chained map / filter creates many temporary arrays.',
            quiz: [{ q: 'Which helper keeps all original elements of each group?', opts: ['rollup', 'group', 'reduce'], answer: 1, why: 'group returns a Map from key to the array of original elements; rollup reduces each group to a single value.' }]
          }
        },
        {
          id: 'ch-1-5',
          zh: {
            title: '1.5 D3 数据选择器',
            goals: ['用 enter / update / exit 解释一次数据更新', '说明 key 函数如何保持元素身份', '区分 select 与 selectAll 的适用场景'],
            predict: { q: '数据从 [1,2,3] 变为 [1,2,3,4] 时，哪个圆会以 enter 的绿色出现？', opts: ['全部四个', '只有新增的第 4 个', '只有原有的三个'], answer: 1, explain: '数据比元素多出的部分进入 enter；已有元素进入 update，不会重新以 enter 创建。' },
            lab: '「添加 / 更新 / 删除 / 重置」四个按钮分别触发 enter、update、exit 三态，颜色对应三种状态。',
            controls: [
              ['「+ 添加」', '数据增加一项，新元素以 enter 状态（绿色）出现'],
              ['「⇆ 更新」', '替换部分数据的值，观察 update 选择集原地更新属性'],
              ['「− 删除」', '移除数据项，退出元素进入 exit 状态后淡出'],
              ['「重置」', '恢复初始数据，回到三态演示的起点']
            ],
            compare: {
              bad: '每次数据更新都清空并重建全部 DOM 元素',
              good: '用 key 函数绑定身份，复用 update，只让新增 / 删除的元素走 enter / exit',
              why: '重建会丢失过渡、焦点与事件状态；key 让元素在重排后保持身份，动画只作用于真正变化的元素。'
            },
            use: '数据会动态变化，且需要平滑增删元素时。',
            care: '没有 key 函数时，数据重排会被当成"逐个更新"，过渡动画容易错乱。',
            quiz: [{ q: 'key 函数最直接的作用是什么？', opts: ['提升渲染速度', '让元素在数据重排后仍保持身份', '自动排序数据'], answer: 1, why: 'key 把数据项与 DOM 元素稳定绑定；重排时元素只是移动，而不是被当作不同元素重建。' }]
          },
          en: {
            title: '1.5 D3 selections',
            goals: ['Explain a data update in terms of enter / update / exit', 'Show how a key function keeps element identity', 'Choose between select and selectAll'],
            predict: { q: 'Data changes from [1,2,3] to [1,2,3,4]. Which circle enters (green)?', opts: ['All four', 'Only the new fourth one', 'Only the original three'], answer: 1, explain: 'Data items without a matching element enter; existing elements update and are not recreated.' },
            lab: 'Add / update / remove / reset trigger the enter, update and exit states; colors show which state is active.',
            controls: [
              ['Add', 'Adds one data item; the new element appears in the enter state (green)'],
              ['Update', 'Replaces some values so you can watch the update selection change attributes in place'],
              ['Remove', 'Removes an item; the exiting element fades out through the exit state'],
              ['Reset', 'Restores the initial data and returns to the start of the three-state demo']
            ],
            compare: {
              bad: 'Clearing and rebuilding every DOM element on each data update',
              good: 'Using a key function to keep identity, reusing update, and sending only new or removed items through enter / exit',
              why: 'Rebuilding loses transitions, focus and event state; a key keeps identity across reorders so animation only touches elements that actually changed.'
            },
            use: 'When data changes and elements must be added or removed smoothly.',
            care: 'Without a key function, reordered data is treated as per-index updates and transitions break.',
            quiz: [{ q: 'What does a key function do?', opts: ['Speeds up rendering', 'Keeps element identity when data is reordered', 'Sorts the data automatically'], answer: 1, why: 'The key binds a data item to a DOM element, so reordering moves elements instead of rebuilding them.' }]
          }
        }
      ]
    },

    /* ================= 第 2 章 · 流程 ================= */
    {
      key: '2', dir: 'lesson-02', href: 'lesson-02/', color: '#0e765d',
      zh: { title: '数据可视化流程', time: '70–90 分钟', prereq: '建议先学第 1 章（数据类型与 D3 基础）', focus: ['Card 数据流', 'rollup 聚合', '树布局', '事件与动画'] },
      en: { title: 'Visualization process', time: '70-90 min', prereq: 'Chapter 1 (data types and D3 basics) first', focus: ['Card pipeline', 'rollup', 'Tree layout', 'Events and motion'] },
      points: { zh: ['Card 模型', 'd3.rollup', 'Reingold-Tilford', '事件委托'], en: ['Card model', 'd3.rollup', 'Reingold-Tilford', 'Event delegation'] },
      dataNote: { zh: '本章分类树与树形列表使用与第 1 章相同的 80 条 DeepSeek 合成新生数据，仅用于演示层级结构，不代表真实专业分布。', en: 'The classification tree and tree list reuse the 80 synthetic new-student records from chapter 1. They illustrate hierarchy only, not real major distributions.' },
      review: {
        zh: {
          concepts: ['Card 管道：原始数据 → 数据表 → 视觉结构 → 视图', 'Mackinlay 自动选通道，van Wijk 强调反馈环', '数据变换四操作：清洗 / 聚合 / 连接 / 派生', 'Reingold-Tilford 用位置编码层级'],
          can: ['用 rollup 做二维分桶聚合', '用 hierarchy + tree + linkHorizontal 画横向树', '用事件委托替代逐项绑定', '用 transition + duration 表达变化过程'],
          mistakes: ['把三个流程模型当成互相冲突的理论', 'rollup 结果当数组直接 .map', '横向树忘记交换 x / y', 'toggle 按钮不 stopPropagation，误触发选中']
        },
        en: {
          concepts: ['Card pipeline: raw data -> data table -> visual structure -> view', 'Mackinlay automates channel choice; van Wijk adds a feedback loop', 'Four transforms: clean / aggregate / join / derive', 'Reingold-Tilford encodes hierarchy with position'],
          can: ['Aggregate two dimensions with rollup', 'Draw a horizontal tree with hierarchy + tree + linkHorizontal', 'Replace per-item listeners with event delegation', 'Express change over time with transition + duration'],
          mistakes: ['Treating the three process models as conflicting', 'Calling .map on a rollup Map', 'Forgetting to swap x / y in a horizontal tree', 'Letting a toggle click bubble into selection']
        }
      },
      sections: [
        {
          id: 'ch-2-1',
          zh: {
            title: '2.1 数据可视化流程',
            goals: ['复述 Card 模型的四段管道', '说明三个流程模型是叠加而非冲突', '解释 van Wijk 反馈环为什么重要'],
            predict: { q: '「原始数据 → 数据表」对应 Card 管道的哪一段？', opts: ['数据变换 D → T', '视觉映射 T → V', '视图渲染 V → C'], answer: 0, explain: '从原始数据整理成结构化数据表属于数据变换；之后才是视觉映射与渲染。' },
            lab: '点击流程图节点，查看 Card、Mackinlay、van Wijk 三个模型在该环节的对应解释。',
            controls: [['流程图四个节点', '点击「原始数据 / 数据变换 / 视觉映射 / 视图渲染」，下方显示三个模型对该环节的不同说法']],
            use: '需要向团队说明"一张图从数据到屏幕经过哪些步骤"时。',
            care: '不要把流程图当成一次性线性流程：真实分析往往在反馈环里反复迭代。',
            quiz: [{ q: 'van Wijk 模型相比 Card 模型最强调什么？', opts: ['配色规范', '交互反馈循环', '数据压缩'], answer: 1, why: 'van Wijk 把 View、Filter、Param 与其它视图连成回路，强调用户操作如何反过来影响视图。' }]
          },
          en: {
            title: '2.1 Visualization process',
            goals: ['Recite the four stages of the Card pipeline', 'Explain that the three process models stack rather than conflict', 'Explain why the van Wijk feedback loop matters'],
            predict: { q: 'Raw data -> data table is which stage of the Card pipeline?', opts: ['Data transformation D -> T', 'Visual mapping T -> V', 'View rendering V -> C'], answer: 0, explain: 'Turning raw data into a structured table is transformation; mapping and rendering come next.' },
            lab: 'Click a node in the flow chart to see how Card, Mackinlay and van Wijk describe that stage.',
            controls: [['Four flow nodes', 'Click raw data, transformation, mapping or rendering to see how each model describes that stage below']],
            use: 'When explaining to a team which steps turn data into a chart on screen.',
            care: 'Do not treat the pipeline as one-way: real analysis loops through the feedback cycle.',
            quiz: [{ q: 'What does van Wijk emphasize compared with Card?', opts: ['Color rules', 'The interaction feedback loop', 'Data compression'], answer: 1, why: 'Van Wijk connects view, filter, parameter and other views into a loop, so user actions change the view.' }]
          }
        },
        {
          id: 'ch-2-2',
          zh: {
            title: '2.2 数据分类树（rollup）',
            goals: ['说出数据变换的四类操作', '用 d3.rollup 完成专业 × 班级的双层聚合', '从「软件工程1班」中提取专业名'],
            predict: { q: '对 students 做 rollup(..., d => d.major, d => d.class) 后，外层 Map 的值是什么？', opts: ['一个数字', '一个内层 Map（班级 → 人数）', '一个数组'], answer: 1, explain: '多个 key 会生成嵌套 Map：外层是专业，内层是班级，最内层才是聚合值。' },
            lab: '调整专业 / 班级的聚合维度，观察嵌套 Map 的结构与计数如何变化。',
            controls: [
              ['第一个下拉框', '选择外层分组字段：性别 / 专业 / 班级 / 籍贯'],
              ['第二个下拉框', '选择内层分组字段；选「无」时只做单层聚合'],
              ['第三个下拉框', '选择聚合方式：计数、年龄列表或平均年龄']
            ],
            compare: {
              bad: '把 d3.rollup 返回的 Map 直接当数组调用 .map',
              good: '先用 Array.from(map) 或遍历 map.entries()，再映射成节点数组',
              why: 'rollup 返回的是嵌套 Map，不是数组；直接 .map 会抛错，转成数组后才能绑定给树布局。'
            },
            use: '做下钻、分组统计、为树形结构准备层级数据时。',
            care: 'rollup 返回 Map，不是数组；直接 .map 会报错，需要先用 Array.from 转换。',
            quiz: [{ q: '从「软件工程1班」提取「软件工程」，正则中的 .+? 为什么必须非贪婪？', opts: ['让匹配更快', '把末尾的「1班」留给后面的分组', '避免中文乱码'], answer: 1, why: '非贪婪让中间部分尽量短，末尾 \\d+班 才能匹配到「1班」，从而稳定地拿到专业名。' }]
          },
          en: {
            title: '2.2 Grouping with rollup',
            goals: ['List the four data-transformation operations', 'Aggregate by major x class with d3.rollup', 'Extract the major name from a class label'],
            predict: { q: 'After rollup(students, ..., d => d.major, d => d.class), what is each outer Map value?', opts: ['A number', 'An inner Map (class -> count)', 'An array'], answer: 1, explain: 'Multiple keys produce nested Maps: major outside, class inside, with the aggregate at the innermost level.' },
            lab: 'Change the aggregation dimensions to see the nested Map structure and counts update.',
            controls: [
              ['First dropdown', 'Chooses the outer grouping field: gender, major, class or hometown'],
              ['Second dropdown', 'Chooses the inner grouping field; "none" keeps a single-level aggregation'],
              ['Third dropdown', 'Chooses the aggregate: count, list of ages, or average age']
            ],
            compare: {
              bad: 'Calling .map directly on the Map returned by d3.rollup',
              good: 'Converting with Array.from(map) or iterating map.entries() before mapping to nodes',
              why: 'rollup returns nested Maps, not arrays; calling .map throws, and the array form is what a tree layout can bind.'
            },
            use: 'For drill-down, grouped statistics, or preparing hierarchy data for a tree.',
            care: 'rollup returns a Map, not an array; call Array.from before .map.',
            quiz: [{ q: 'To extract "Software" from "Software 1", why must .+? be non-greedy?', opts: ['It matches faster', 'It leaves the trailing "1" for the next group', 'It avoids encoding errors'], answer: 1, why: 'Non-greedy keeps the middle short so \\d+班 can match "1", yielding a stable major name.' }]
          }
        },
        {
          id: 'ch-2-3',
          zh: {
            title: '2.3 树布局算法',
            goals: ['用位置通道解释树布局在做什么', '按 hierarchy → tree → links 三步画出横向树', '用 separation 控制兄弟节点间距'],
            predict: { q: 'd3.tree() 计算后，哪个坐标是"深度方向"？', opts: ['x', 'y', '两者都不是'], answer: 0, explain: 'tree 的 x 表示层级深度、y 表示横向位置；画横向树时需要在 link 与节点上交换 x / y。' },
            lab: '拖动 separation 滑块，观察兄弟节点与不同父节点之间的间距如何变化。',
            controls: [
              ['层级路径下拉', '切换树的层级顺序：专业→班级、专业→班级→性别等'],
              ['separation 滑块', '调整同级节点之间的水平间隔，树会重新分配整棵布局']
            ],
            use: '层级关系明确（组织、分类、目录）且需要看清结构时。',
            care: '节点过多时树会迅速变宽；此时考虑可折叠树、矩形树图或聚合视图。',
            quiz: [{ q: '树布局算法主要用哪种视觉通道编码层级？', opts: ['颜色', '位置', '面积'], answer: 1, why: 'Reingold-Tilford 通过计算 x / y 坐标，把父子层级编码为位置关系。' }]
          },
          en: {
            title: '2.3 Tree layout',
            goals: ['Explain tree layout as encoding with the position channel', 'Draw a horizontal tree in three steps: hierarchy, tree, links', 'Control sibling spacing with separation'],
            predict: { q: 'After d3.tree(), which coordinate runs along depth?', opts: ['x', 'y', 'Neither'], answer: 0, explain: 'In tree, x is depth and y is the cross axis; a horizontal tree swaps x and y for links and nodes.' },
            lab: 'Drag the separation slider to see spacing between siblings and between different parents change.',
            controls: [
              ['Hierarchy dropdown', 'Switches the tree hierarchy: major to class, major to class to gender, and so on'],
              ['separation slider', 'Changes horizontal spacing between siblings; the whole layout is recomputed']
            ],
            use: 'When hierarchy is clear (organization, taxonomy, folders) and structure must be legible.',
            care: 'With many nodes a tree grows wide quickly; consider collapsible trees, treemaps or aggregation.',
            quiz: [{ q: 'Which channel does tree layout primarily use to encode hierarchy?', opts: ['Color', 'Position', 'Area'], answer: 1, why: 'Reingold-Tilford computes x / y coordinates, turning parent-child relations into position.' }]
          }
        },
        {
          id: 'ch-2-4',
          zh: {
            title: '2.4 树形列表渲染',
            goals: ['复述 DOM 事件的捕获 / 目标 / 冒泡三阶段', '用 stopPropagation 区分折叠与选中', '解释 duration 对"看见变化"的影响'],
            predict: { q: '把过渡时长设为 0，学生会看到什么？', opts: ['平滑的展开过程', '直接跳到最终状态', '页面报错'], answer: 1, explain: 'duration=0 表示属性立即变成终值，过程被压缩掉，因此看不到"如何变化"。' },
            lab: '拖动时长滑块并点击节点：时长越短越像跳变，越长越能看清移动路径。',
            controls: [
              ['「全部展开 / 全部折叠」', '一次开合所有节点，观察 transition 如何作用到每个元素'],
              ['「动画时长」滑块', '修改 D3 transition 的 duration，对比 0ms 与 1500ms 的视觉差别'],
              ['条目上的 toggle / 选中', '点击折叠或选中，日志区按顺序显示事件冒泡与委托处理']
            ],
            compare: {
              bad: '每个条目单独绑定 click，且折叠按钮不阻断冒泡',
              good: '在父容器上做事件委托，折叠按钮内调用 stopPropagation',
              why: '逐项绑定在列表重绘后失效且开销大；不阻断冒泡会让折叠同时触发父级选中。'
            },
            use: '列表需要折叠、选中、批量新增，且元素数量较多时。',
            care: '过渡时长超过 1.5 秒会拖慢课堂节奏；交互频繁的视图应保持短促。',
            quiz: [{ q: '折叠按钮的点击若没有 stopPropagation，会发生什么？', opts: ['折叠失效', '同时触发父节点的选中', '事件不会触发'], answer: 1, why: '点击会继续冒泡到父级监听器，于是折叠和选中同时发生，用户会感到困惑。' }]
          },
          en: {
            title: '2.4 Rendering an interactive tree list',
            goals: ['Recite the capture / target / bubble phases', 'Separate collapse from selection with stopPropagation', 'Explain how duration changes what users see'],
            predict: { q: 'With transition duration 0, what do students see?', opts: ['A smooth expansion', 'An instant jump to the final state', 'An error'], answer: 1, explain: 'Duration 0 applies the final value immediately, so the process of change is invisible.' },
            lab: 'Drag the duration slider and click nodes: short durations jump, long durations reveal the path of motion.',
            controls: [
              ['Expand all / Collapse all', 'Opens or closes every node at once so you can watch the transition on each element'],
              ['Duration slider', 'Changes the D3 transition duration; compare 0ms with 1500ms'],
              ['Toggle / select on an item', 'Clicking logs the event bubbling and delegated handling order in the log area']
            ],
            compare: {
              bad: 'Binding click on every item and letting the collapse button bubble',
              good: 'Using event delegation on the parent and calling stopPropagation in the collapse button',
              why: 'Per-item listeners break after a redraw and cost more; without stopping the bubble, collapsing also fires the parent selection.'
            },
            use: 'When a list needs collapse, selection and bulk insertion with many elements.',
            care: 'Transitions longer than 1.5 s slow a lecture; frequent interactions should stay brief.',
            quiz: [{ q: 'What happens if the collapse button does not call stopPropagation?', opts: ['Collapse stops working', 'The parent selection fires too', 'Nothing fires'], answer: 1, why: 'The click bubbles to the parent listener, so collapse and selection happen together and confuse users.' }]
          }
        }
      ]
    },

    /* ================= 第 3 章 · 色彩专题 ================= */
    {
      key: '3', dir: 'lesson-03', href: 'lesson-03/', color: '#0e765d',
      zh: { title: '色彩专题', time: '80–100 分钟', prereq: '可在任意阶段插入；建议先了解第 1 章的视觉通道', focus: ['颜色空间', 'colormap 选型', '色系搭配', 'CVD 可访问性'] },
      en: { title: 'Color', time: '80-100 min', prereq: 'Can be taken anytime; chapter 1 channels help', focus: ['Color spaces', 'Colormap choice', 'Harmony rules', 'CVD access'] },
      points: { zh: ['4 颜色空间 + CVD', 'Wong / Paul Tol', '5 大色系规则', '鲜艳 + 低饱和', 'CVD 论文图测'], en: ['Color spaces + CVD', 'Wong / Paul Tol', 'Harmony rules', 'Vivid but muted', 'CVD testing'] },
      dataNote: { zh: '本章配色演示为教学构造的色板与示意数据，用于对比可读性，不代表任何真实论文的统计结论。', en: 'Palettes and example data here are constructed for teaching readability comparisons, not real study results.' },
      review: {
        zh: {
          concepts: ['RGB / HSL 不感知均匀，Lab 才是 colormap 插值的基准', '顺序型 / 发散型 / 定性型对应三种数据语义', 'CVD：绿色盲最常见，红绿对比最危险', '类别数 ≤ 7，颜色多时改用连续 colormap'],
          can: ['按数据语义选择 colormap 类型', '用 Wong / Paul Tol 等 CVD 友好色板', '识别彩虹谱、红绿对比、颜色过多三类错误', '用 CVD 模拟检查一张图是否仍可读'],
          mistakes: ['用发散型色板画有序数据', '在 RGB 空间直接插值设计渐变色', '红绿对比表达实验组 / 对照组', '12 个类别硬塞 12 种颜色']
        },
        en: {
          concepts: ['RGB and HSL are not perceptually uniform; Lab is the base for colormap interpolation', 'Sequential / diverging / qualitative match three data semantics', 'CVD: deuteranopia is most common; red-green is the riskiest pair', 'Keep categories at 7 or fewer; switch to a continuous map beyond that'],
          can: ['Choose a colormap type from data semantics', 'Use CVD-friendly palettes such as Wong or Paul Tol', 'Spot rainbow, red-green and too-many-colors errors', 'Run a CVD simulation before publishing'],
          mistakes: ['Using a diverging map for ordered data', 'Interpolating in RGB to design a gradient', 'Red-green for treatment vs control', 'Squeezing 12 categories into 12 hues']
        }
      },
      sections: [
        {
          id: 'ch-3-1',
          zh: {
            title: '3.1 颜色模型基础',
            goals: ['说出 RGB / HSL / Lab / CMYK 各自擅长的场景', '解释为什么 colormap 要在感知均匀空间插值', '区分三种常见色觉缺陷'],
            predict: { q: '在 RGB 空间里从蓝到黄插值，和 Lab 空间相比会怎样？', opts: ['更平滑', '出现发灰的过渡带', '完全一样'], answer: 1, explain: 'RGB 不是感知均匀的，等量数值变化在中间会显得灰暗；Lab 中插值更接近人眼感知的均匀过渡。' },
            lab: '切换颜色空间，观察同一组端色在 RGB、HSL、Lab 中插值出的中间色差异。',
            controls: [['R / G / B 滑块', '分别调整红、绿、蓝通道值，实时预览颜色与十六进制结果']],
            use: '需要自己生成渐变色、设计 colormap 或排查"颜色看起来脏"时。',
            care: '网页输出最终仍是 sRGB；Lab 是设计时的中间空间，不是最终格式。',
            quiz: [{ q: '最常见的色觉缺陷是哪一种？', opts: ['红色盲', '绿色盲', '蓝色盲'], answer: 1, why: '绿色盲（deuteranopia）约占男性 6%，是三种中最常见的。' }]
          },
          en: {
            title: '3.1 Color models',
            goals: ['State what RGB / HSL / Lab / CMYK are each good for', 'Explain why colormaps should interpolate in a perceptually uniform space', 'Distinguish the three common types of color vision deficiency'],
            predict: { q: 'Interpolating blue to yellow in RGB, compared with Lab, tends to produce what?', opts: ['A smoother ramp', 'A muddy grey band in the middle', 'Exactly the same result'], answer: 1, explain: 'RGB is not perceptually uniform; equal numeric steps look muddy in the middle. Lab interpolation follows perceived lightness more closely.' },
            lab: 'Switch color spaces to compare the middle colors produced by RGB, HSL and Lab interpolation.',
            controls: [['R / G / B sliders', 'Adjust the red, green and blue channels to preview the color and its hex value live']],
            use: 'When generating gradients, designing colormaps, or diagnosing a muddy color ramp.',
            care: 'The web still outputs sRGB; Lab is a design space, not a final format.',
            quiz: [{ q: 'Which color vision deficiency is most common?', opts: ['Protanopia', 'Deuteranopia', 'Tritanopia'], answer: 1, why: 'Deuteranopia affects about 6% of men, making it the most common of the three.' }]
          }
        },
        {
          id: 'ch-3-2',
          zh: {
            title: '3.2 colormap 三类选择',
            goals: ['按数据语义选择顺序 / 发散 / 定性 colormap', '识别"发散色板画有序数据"的误用', '说出 CVD 友好的 colormap 清单'],
            predict: { q: '用 RdBu 发散色板画 50 州谋杀率，中段接近白色的州意味着什么？', opts: ['谋杀率最高', '谋杀率处在有意义的中间值', '没有任何语义，纯属误导'], answer: 2, explain: '谋杀率没有天然的"中点"，白色会被误读成一个不存在的基准，这是典型的色板类型误用。' },
            lab: '三张速记表与条形图并列展示顺序 / 发散 / 定性三类 colormap，重点看发散型画有序数据的误导效果。',
            controls: [['（静态对照表）', '无交互控件；三张速记表与条形图并列，直接对照颜色与数值的关系']],
            compare: {
              bad: '用发散型 RdBu 画「50 州谋杀率」这类有序数据',
              good: '有序数值用顺序型 Viridis 或 Cividis',
              why: '发散型的浅色代表「偏离中点」，而谋杀率没有语义中点；读者会把中段数值误读为「接近零」或「正常」。'
            },
            use: '顺序型用于单调量（人口、温度）；发散型用于有真实中点的偏差（正负、距均值）。',
            care: '数据没有中点时不要用发散型；类别无序时不要用顺序型。',
            quiz: [{ q: '数据有明确中点（例如相对 0 的正负偏差）时，应选哪类 colormap？', opts: ['顺序型', '发散型', '定性型'], answer: 1, why: '发散型用两端异色、中间浅色强调"偏离中点"的方向与幅度。' }]
          },
          en: {
            title: '3.2 Choosing a colormap',
            goals: ['Pick sequential / diverging / qualitative from data semantics', 'Recognize a diverging map used on ordered data', 'Name CVD-friendly colormaps'],
            predict: { q: 'A diverging RdBu map is used for murder rates across 50 states. What does a near-white state mean?', opts: ['Highest murder rate', 'A meaningful middle value', 'Nothing: it is misleading'], answer: 2, explain: 'Murder rate has no natural midpoint; white suggests a baseline that does not exist.' },
            lab: 'Three reference tables and bar charts compare sequential, diverging and qualitative maps, highlighting how a diverging map misleads on ordered data.',
            controls: [['(Static reference)', 'No interactive controls; the three tables and bar charts compare how color relates to value']],
            compare: {
              bad: 'Using the diverging RdBu map for an ordered quantity such as state murder rates',
              good: 'Using a sequential map such as Viridis or Cividis for ordered values',
              why: 'In a diverging map the pale middle means "near the midpoint", but murder rate has no meaningful midpoint; readers misread mid-range values as "near zero" or "normal".'
            },
            use: 'Sequential for monotonic values; diverging for real deviations around a midpoint.',
            care: 'Do not use diverging without a midpoint, or sequential for unordered categories.',
            quiz: [{ q: 'Data with a meaningful midpoint (positive/negative deviation) calls for which type?', opts: ['Sequential', 'Diverging', 'Qualitative'], answer: 1, why: 'Diverging maps use two hues with a light middle to emphasize direction and size of deviation.' }]
          }
        },
        {
          id: 'ch-3-3',
          zh: {
            title: '3.3 CIE Lab 色域图',
            goals: ['解释 Lab 的感知均匀性', '说出 sRGB / Adobe RGB / Rec.2020 的嵌套关系', '说明超出色域的颜色为什么会被 clamp'],
            predict: { q: '一个超出 sRGB 的纯绿色显示在普通屏幕上会怎样？', opts: ['完整显示', '被压缩到色域边界', '变成黑色'], answer: 1, explain: '普通屏幕只能显示 sRGB 范围，超出部分会被 clamp 到边界，颜色因此失真。' },
            lab: '拖动 L* 滑块，观察亮度变化如何收缩可用色域，以及哪些 Lab 坐标超出 sRGB。',
            controls: [['「L* 亮度」滑块', '改变 Lab 空间的明度，观察可用色域面积与 sRGB 裁切范围如何变化']],
            use: '设计跨屏幕、跨印刷媒介的配色方案时。',
            care: '只在 4K / 印刷设备上存在的颜色，不要用来承载网页中的关键区分。',
            quiz: [{ q: '设计平滑 colormap 时，为什么推荐 d3.interpolateLab？', opts: ['它更快', '它在感知均匀空间插值，过渡更自然', '它自动适配 CVD'], answer: 1, why: 'Lab 中相等的数值步长更接近人眼感知的相等差异，渐变不会在中段发灰。' }]
          },
          en: {
            title: '3.3 CIE Lab gamut',
            goals: ['Explain the perceptual uniformity of Lab', 'State how sRGB, Adobe RGB and Rec.2020 nest', 'Explain why out-of-gamut colors are clamped'],
            predict: { q: 'A pure green outside sRGB is shown on an ordinary screen. What happens?', opts: ['It displays fully', 'It is clamped to the gamut boundary', 'It turns black'], answer: 1, explain: 'An ordinary screen can only show sRGB, so out-of-gamut colors are clamped and distorted.' },
            lab: 'Drag the L* slider to see how lightness shrinks the usable gamut and which Lab coordinates fall outside sRGB.',
            controls: [['L* lightness slider', 'Changes lightness in Lab space and shows how the usable gamut and sRGB clipping change']],
            use: 'When designing colors for multiple screens or print.',
            care: 'Do not rely on colors that only exist on 4K or print devices to encode key distinctions on the web.',
            quiz: [{ q: 'Why use d3.interpolateLab for a smooth colormap?', opts: ['It is faster', 'It interpolates in a perceptually uniform space', 'It automatically fixes CVD'], answer: 1, why: 'Equal numeric steps in Lab approximate equal perceived differences, avoiding a muddy middle.' }]
          }
        },
        {
          id: 'ch-3-4',
          zh: {
            title: '3.4 色系搭配规则（5 大类）',
            goals: ['说出单色 / 类比 / 互补 / 三等分 / 分裂互补的差别', '按表达目的选择色系策略', '避免互补色造成刺眼或语义冲突'],
            predict: { q: '要突出「实验组 vs 对照组」，最合适的色系策略是？', opts: ['单色', '互补色', '三等分'], answer: 1, explain: '互补色对比最强，适合强调两组对立关系；但大面积使用时要降低饱和度以免刺眼。' },
            lab: '拖动主色 H 滑块，五张配色方案随色相旋转同步重算。',
            controls: [['「主色 H」滑块', '旋转主色色相，单色 / 类比 / 互补 / 三等分 / 分裂互补五张方案同步重算']],
            use: '单色用于严肃科研，类比用于分组，互补用于突出重点。',
            care: '三类别以上不要硬用互补；互补色面积过大时刺眼。',
            quiz: [{ q: '恰好 3 个并列类别时，最常用哪种色系？', opts: ['三等分', '单色', '互补'], answer: 0, why: '三等分取色轮上 120° 的三个点，三种颜色既区分又平衡。' }]
          },
          en: {
            title: '3.4 Color harmony rules',
            goals: ['Distinguish monochromatic, analogous, complementary, triadic and split-complementary', 'Choose a harmony strategy from the communication goal', 'Avoid glare and semantic clashes from complementary pairs'],
            predict: { q: 'To highlight treatment versus control, which harmony works best?', opts: ['Monochromatic', 'Complementary', 'Triadic'], answer: 1, explain: 'Complementary colors give the strongest contrast for two opposing groups; lower saturation for large areas.' },
            lab: 'Drag the base hue slider: all five harmony schemes recompute as the hue rotates.',
            controls: [['Base hue slider', 'Rotates the base hue; monochromatic, analogous, complementary, triadic and split-complementary schemes all recompute']],
            use: 'Monochromatic for serious science, analogous for grouping, complementary for emphasis.',
            care: 'Do not force complementary colors onto more than two groups; large complementary areas glare.',
            quiz: [{ q: 'With exactly three peer categories, which harmony is most common?', opts: ['Triadic', 'Monochromatic', 'Complementary'], answer: 0, why: 'Triadic takes three points 120 degrees apart, giving balanced separation.' }]
          }
        },
        {
          id: 'ch-3-5',
          zh: {
            title: '3.5 科研经典配色',
            goals: ['说出 Wong / Paul Tol / Okabe-Ito 的共同优点', '解释"类别数 ≤ 7"的经验边界', '为深色底与浅色底选择合适色板'],
            predict: { q: 'Tableau10 虽然流行，但对色盲读者的主要问题是？', opts: ['颜色太少', '红绿搭配不易区分', '亮度全部相同'], answer: 1, explain: 'Tableau10 含红绿组合，绿色盲读者容易把两者看成同色；科研场景应优先 CVD 友好色板。' },
            lab: '切换 Wong、Paul Tol、Okabe-Ito、Tableau10 等色板，比较类别区分度与灰度打印效果。',
            controls: [['配色方案标签', '点击切换 Wong / Paul Tol / Okabe-Ito 等方案，用同一组数据与折线对比效果']],
            use: '论文、报告、课堂图表需要长期复用的一套类别色时。',
            care: 'Paired 等 12 色色板在类别少时容易过载，不要因为"颜色多"而使用。',
            quiz: [{ q: 'Wong 色板被广泛推荐的核心原因是？', opts: ['颜色最鲜艳', 'CVD 友好且灰度打印仍可区分', '颜色数量最多'], answer: 1, why: 'Wong 2011 的 8 色方案兼顾色觉缺陷与灰度打印，是科研图表的稳妥选择。' }]
          },
          en: {
            title: '3.5 Established scientific palettes',
            goals: ['Name the shared strengths of Wong, Paul Tol and Okabe-Ito', 'Explain the practical limit of about seven categories', 'Choose palettes for light and dark backgrounds'],
            predict: { q: 'Tableau10 is popular, but what is its main problem for color-blind readers?', opts: ['Too few colors', 'Its red-green pairs are hard to separate', 'All colors have equal lightness'], answer: 1, explain: 'Tableau10 includes red-green pairs that merge for deuteranopes; scientific work should prefer CVD-friendly palettes.' },
            lab: 'Switch among Wong, Paul Tol, Okabe-Ito and Tableau10 to compare separation and greyscale printing.',
            controls: [['Palette tabs', 'Click a palette such as Wong, Paul Tol or Okabe-Ito to compare the same data and lines across schemes']],
            use: 'When a paper, report or lecture needs one reusable set of categorical colors.',
            care: 'Do not use 12-color palettes such as Paired for a handful of categories.',
            quiz: [{ q: 'Why is the Wong palette widely recommended?', opts: ['It is the most vivid', 'It is CVD-friendly and survives greyscale printing', 'It has the most colors'], answer: 1, why: 'The eight-color Wong 2011 scheme works for color vision deficiency and greyscale printing.' }]
          }
        },
        {
          id: 'ch-3-6',
          zh: {
            title: '3.6 对错案例对比',
            goals: ['识别彩虹谱、红绿对比、颜色过多三类错误', '用 CVD 与感知均匀性解释"为什么错"', '给出每种错误的替代方案'],
            predict: { q: '四张图里，哪一张最符合科研可读性要求？', opts: ['彩虹谱 Jet', '红绿对比', 'Wong 8 色'], answer: 2, explain: 'Wong 8 色类别数适中、CVD 友好、灰度打印仍可区分；Jet 与红绿对比都有明确的感知缺陷。' },
            lab: '点击四张候选图，查看错误原因、受影响人群与推荐替代色板。',
            controls: [['四张候选图', '点击你认为正确的那张，页面标出对错并给出原因']],
            compare: {
              bad: '用彩虹 Jet 或红绿对比编码 8 个类别',
              good: '用 Wong 8 色等色盲友好的定性色板，类别数控制在 7 左右',
              why: 'Jet 不是感知均匀且对色盲与灰度打印都不友好；红绿对红绿色盲几乎不可分辨（约 6% 男性）。'
            },
            use: '课堂上做"先选后讲"的诊断练习，或评审他人图表时。',
            care: '只凭"好看"判断配色；好看与可读经常不是一回事。',
            quiz: [{ q: 'Nature 等期刊禁用彩虹谱 Jet 的主要原因是？', opts: ['颜色不够多', '非感知均匀、CVD 不友好、易产生假边界', '无法打印彩色'], answer: 1, why: 'Jet 的亮度变化不单调，会在数据中制造并不存在的边界，同时对色觉缺陷不友好。' }]
          },
          en: {
            title: '3.6 Right and wrong cases',
            goals: ['Identify rainbow, red-green and too-many-colors errors', 'Explain each failure with perceptual uniformity and CVD', 'Offer a replacement for each error'],
            predict: { q: 'Which of the four figures is most readable for scientific use?', opts: ['Rainbow Jet', 'Red-green contrast', 'Wong 8-color'], answer: 2, explain: 'Wong 8 has a sensible category count, CVD safety and greyscale legibility; Jet and red-green have clear perceptual failures.' },
            lab: 'Click each candidate to see why it fails, who is affected, and which palette to use instead.',
            controls: [['Four candidate charts', 'Click the one you think is right; the page marks correct and wrong answers and explains why']],
            compare: {
              bad: 'Encoding eight categories with rainbow Jet or a red-green contrast',
              good: 'Using a colour-blind-safe qualitative palette such as Wong 8, keeping categories near seven',
              why: 'Jet is not perceptually uniform and fails for colour blindness and greyscale printing; red and green are nearly indistinguishable to red-green colour-blind viewers (about 6% of men).'
            },
            use: 'As a choose-then-explain exercise in class, or when reviewing someone else chart.',
            care: 'Judging palettes only by looks; attractive and readable are not the same.',
            quiz: [{ q: 'Why do journals such as Nature reject rainbow Jet?', opts: ['It has too few colors', 'It is not perceptually uniform, is CVD-hostile, and creates false boundaries', 'It cannot be printed in color'], answer: 1, why: 'Jet lightness is non-monotonic, inventing edges that are not in the data, and it fails for color vision deficiency.' }]
          }
        },
        {
          id: 'ch-3-7',
          zh: {
            title: '3.7 鲜艳 + 低饱和 哲学',
            goals: ['复述"≤7 色、高色相区分、低饱和"三条规则', '解释主色与配套色的饱和度分工', '生成一套可直接使用的 5–7 色方案'],
            predict: { q: '类别从 7 种增加到 12 种，最可能发生什么？', opts: ['读者仍能轻松区分', '相邻颜色开始难以分辨', '图表更有层次'], answer: 1, explain: '人眼可稳定区分的类别色大约在 7 个以内；继续增加会让相邻色差距缩小，区分度下降。' },
            lab: '调整主色 H / S / L，实时生成一套不超过 7 色的搭配。',
            controls: [['主色 H / S / L 滑块', '调整色相、饱和度与明度，实时生成不超过 7 色的搭配']],
            use: '需要一套既鲜明又耐看的类别配色，且类别数不超过 7 时。',
            care: '把"低饱和"理解成"所有颜色都灰"；主色仍应保留足够色相区分。',
            quiz: [{ q: '该配色哲学中，配套色的饱和度建议控制在什么范围？', opts: ['70–80%', '30–50%', '5–10%'], answer: 1, why: '主色可用 70–80% 保持鲜明，配套色降到 30–50% 更耐看、不抢主色。' }]
          },
          en: {
            title: '3.7 Vivid but muted palettes',
            goals: ['Recite the three rules: at most 7 colors, wide hue separation, low saturation', 'Explain the saturation split between primary and supporting colors', 'Generate a usable 5-7 color scheme'],
            predict: { q: 'Going from 7 to 12 categories most likely causes what?', opts: ['Readers still separate them easily', 'Neighboring colors become hard to tell apart', 'The chart gains hierarchy'], answer: 1, explain: 'People reliably separate roughly seven categorical colors; beyond that, neighboring hues converge.' },
            lab: 'Adjust the base H / S / L and generate a palette of at most seven colors in real time.',
            controls: [['Base H / S / L sliders', 'Adjust hue, saturation and lightness to regenerate a palette of at most seven colors']],
            use: 'When you need a vivid yet comfortable categorical palette with seven or fewer categories.',
            care: 'Reading "muted" as "everything grey"; the primary colors still need hue separation.',
            quiz: [{ q: 'In this palette philosophy, what saturation range is suggested for supporting colors?', opts: ['70-80%', '30-50%', '5-10%'], answer: 1, why: 'Primaries at 70-80% stay vivid; supporting colors at 30-50% are calmer and do not compete.' }]
          }
        },
        {
          id: 'ch-3-8',
          zh: {
            title: '3.8 CVD 论文图测',
            goals: ['复述 CVD 模拟测试的三步流程', '判断一张图在绿色盲下是否仍可读', '用亮度、形状、标签作为颜色的兜底编码'],
            predict: { q: '经典红绿对比图在绿色盲读者眼中最可能变成什么？', opts: ['更鲜艳', '两种几乎相同的颜色', '黑白图'], answer: 1, explain: '绿色盲对红绿的感知通道受损，红绿在亮度接近时会合并成难以区分的色调。' },
            lab: '三张论文图并列展示正常视觉、红色盲与绿色盲模拟，比较类别是否仍可区分。',
            controls: [['（静态模拟图）', '无交互控件；三张论文图并列，直接比较正常视觉与色盲模拟下的类别区分']],
            use: '论文投稿、公开报告、课堂演示前的最后一道检查。',
            care: '只做一次模拟就放心；不同显示器与打印输出仍可能改变对比。',
            quiz: [{ q: 'CVD 测试流程的第一步是什么？', opts: ['直接改配色', '把图导出为 PNG', '询问读者'], answer: 1, why: '先把图导出成图片，再用 Coblis / Color Oracle 等工具做模拟，才能稳定比较。' }]
          },
          en: {
            title: '3.8 CVD testing',
            goals: ['Recite the three-step CVD simulation workflow', 'Judge whether a figure survives deuteranopia', 'Add lightness, shape and labels as backup encodings'],
            predict: { q: 'A classic red-green figure, seen by a deuteranope, most likely becomes what?', opts: ['More vivid', 'Two nearly identical colors', 'A black-and-white figure'], answer: 1, explain: 'Deuteranopia impairs red-green discrimination; similar lightness makes the two colors merge.' },
            lab: 'Three paper figures sit side by side under normal vision and red-green simulations so you can compare separability.',
            controls: [['(Static simulation)', 'No interactive controls; the three figures compare separability under normal vision and colour-blind simulation']],
            use: 'As a final check before submission, a public talk or a classroom demo.',
            care: 'Running one simulation and stopping; displays and print can still change contrast.',
            quiz: [{ q: 'What is the first step of a CVD check?', opts: ['Change the palette immediately', 'Export the figure as PNG', 'Ask readers'], answer: 1, why: 'Export first, then simulate with Coblis or Color Oracle so comparisons are stable.' }]
          }
        }
      ]
    },

    /* ================= 第 4 章 · 低维数据可视化 ================= */
    {
      key: '4', dir: 'lesson-04', href: 'lesson-04/', color: '#0e765d',
      zh: { title: '低维数据可视化', time: '70–90 分钟', prereq: '建议先学第 1 章尺度与第 2 章流程；会用到第 3 章 colormap', focus: ['宽长格式', '三层坐标', '曲线拟合', '45° 倾角', '等值线'] },
      en: { title: 'Low-dimensional visualization', time: '70-90 min', prereq: 'Chapters 1-2 first; colormaps from chapter 3 help', focus: ['Wide to long', 'Three coordinate spaces', 'Curves', '45-degree angle', 'Contours'] },
      points: { zh: ['三层坐标变换', '10 种曲线', 'Cleveland 45°', 'Marching Squares'], en: ['Coordinate spaces', '10 curves', 'Cleveland 45 degrees', 'Marching Squares'] },
      dataNote: { zh: '本章使用 1985 年美国 50 州犯罪统计数据（教学用）。它反映的是历史截面，不能代表当前治安状况。', en: 'This chapter uses 1985 U.S. state crime statistics for teaching. They are a historical snapshot, not current public safety data.' },
      review: {
        zh: {
          concepts: ['长格式适合过滤与 join，宽格式适合人读', '数据空间 → 坐标系空间 → 屏幕空间', '插值经过数据点，拟合只反映趋势', 'Cleveland：45° 附近斜率估计最准', 'Marching Squares：4 角 × 2 状态 = 16 种 case'],
          can: ['用 flatMap 把宽表转成长表', '为跨数量级数据选择 log 或 sqrt 比例尺', '按数据特征选择 line.curve', '按单元格 4 角状态追踪等值线'],
          mistakes: ['人口用线性轴，小州全挤在左侧', '抖动数据用 linear 画出锯齿', '把插值曲线当作拟合结论', '斜率接近 0° 或 90° 时比较趋势']
        },
        en: {
          concepts: ['Long format suits filtering and joins; wide format suits human reading', 'Data space -> coordinate space -> screen space', 'Interpolation passes through points; fitting shows only trend', 'Cleveland: slope estimates are most accurate near 45 degrees', 'Marching Squares: 4 corners x 2 states = 16 cases'],
          can: ['Reshape a wide table into long format with flatMap', 'Choose log or sqrt scales for wide ranges', 'Pick a line.curve from the data character', 'Trace contours from four-corner cell states'],
          mistakes: ['A linear axis crushes small states to the left', 'Linear curves turn noisy data into sawteeth', 'Treating an interpolated curve as a fitted conclusion', 'Comparing trends near 0 or 90 degrees']
        }
      },
      sections: [
        {
          id: 'ch-4-1',
          zh: {
            title: '4.1 数据转换',
            goals: ['区分宽格式与长格式的适用场景', '用 flatMap + 键名循环完成宽转长', '用 d3.autoType 自动推断列类型'],
            predict: { q: '把 50 州 × 8 个犯罪指标从宽表转成长表，行数会变成多少？', opts: ['50 行', '400 行', '8 行'], answer: 1, explain: '长表每个「州 × 指标」占一行，50 × 8 = 400 行；这正是 d3 join 需要的形状。' },
            lab: '左右并列展示宽格式与长格式：列如何变成行，以及长表为何更利于绑定。',
            controls: [['（静态对照）', '无交互控件；左右两栏并列，直接对照宽表与长表的行列结构']],
            use: '需要按指标过滤、分组，或用 d3 join 绑定到图元时。',
            care: '人眼阅读的展示表通常用宽格式；不要为了"技术正确"牺牲可读性。',
            quiz: [{ q: '哪种格式更适合直接绑定到 D3 图元？', opts: ['宽格式', '长格式', '两种一样'], answer: 1, why: '长格式每行一个观测，字段统一，便于过滤、分组和逐项绑定。' }]
          },
          en: {
            title: '4.1 Reshaping data',
            goals: ['Distinguish when to use wide and long formats', 'Convert wide to long with flatMap and a key loop', 'Infer column types with d3.autoType'],
            predict: { q: 'Reshaping 50 states x 8 crime metrics from wide to long yields how many rows?', opts: ['50', '400', '8'], answer: 1, explain: 'Long format uses one row per state-metric pair: 50 x 8 = 400 rows, exactly what a join needs.' },
            lab: 'Wide and long layouts sit side by side: see columns become rows and why long data binds more directly.',
            controls: [['(Static comparison)', 'No interactive controls; the two panels compare the row and column structure of wide and long tables']],
            use: 'When filtering by metric, grouping, or binding rows to marks.',
            care: 'Tables meant for human reading usually work better as wide format.',
            quiz: [{ q: 'Which format binds directly to D3 marks?', opts: ['Wide', 'Long', 'Both equally'], answer: 1, why: 'Long format has one row per observation with uniform fields, which suits filtering, grouping and binding.' }]
          }
        },
        {
          id: 'ch-4-2',
          zh: {
            title: '4.2 坐标轴变换',
            goals: ['说出数据空间 / 坐标系空间 / 屏幕空间的分工', '为跨数量级数据选择 log 或 sqrt', '用 margin 约定解释屏幕空间的偏移'],
            predict: { q: '人口从 53 万到 2700 万，用线性轴画散点会发生什么？', opts: ['分布很均匀', '小值全部挤在左侧', '大值消失'], answer: 1, explain: '线性轴按绝对差分配空间，小州之间几万的差异被压缩，大州占据大部分宽度。' },
            lab: '切换 linear / log / sqrt 比例尺，观察点的分布与读数难易如何变化。',
            controls: [['x 轴尺度单选（linear / log / sqrt）', '改变数据空间到坐标空间的映射，比较同一批点在三种尺度下的疏密']],
            compare: {
              bad: '人口这种跨数量级的字段直接用 linear 轴',
              good: '人口用 log 轴，展开低值区、压缩高值区',
              why: '人口从几万到几千万，线性轴把大多数州挤在左侧；log 把比例差异映射为等距，便于比较相对大小。'
            },
            use: '多层空间分离能让尺寸变化时只重算屏幕偏移，复用坐标计算结果。',
            care: 'log 轴会改变"距离"的含义，读者可能把 1 到 100 看成与 100 到 10000 一样远。',
            quiz: [{ q: '用圆的面积编码数值，应优先选哪种比例尺？', opts: ['scaleLinear', 'scaleSqrt', 'scaleBand'], answer: 1, why: '面积与半径平方成正比，sqrt 比例尺能让面积与数值成正比，避免大值被夸大。' }]
          },
          en: {
            title: '4.2 Coordinate transforms',
            goals: ['Explain the roles of data, coordinate and screen space', 'Choose log or sqrt for wide ranges', 'Explain screen offsets with the margin convention'],
            predict: { q: 'Population ranges from 530k to 27M. A linear scatter axis produces what?', opts: ['An even spread', 'Small values crushed to the left', 'Large values disappearing'], answer: 1, explain: 'A linear axis allocates by absolute difference, compressing small-state differences and giving large states most of the width.' },
            lab: 'Switch linear, log and sqrt scales to compare point distribution and readability.',
            controls: [['x scale radio (linear / log / sqrt)', 'Changes the mapping from data space to coordinate space; compare the density of the same points under three scales']],
            compare: {
              bad: 'Putting a multi-order-of-magnitude field such as population on a linear axis',
              good: 'Using a log axis for population to open up low values and compress high values',
              why: 'Population ranges from tens of thousands to tens of millions; a linear axis crushes most states to the left. Log maps ratios to equal distances, making relative size comparable.'
            },
            use: 'Separating spaces lets a resize recompute only screen offsets and reuse coordinate results.',
            care: 'A log axis changes what distance means; readers may read 1-100 as equal to 100-10000.',
            quiz: [{ q: 'To encode values by circle area, which scale should you use?', opts: ['scaleLinear', 'scaleSqrt', 'scaleBand'], answer: 1, why: 'Area grows with radius squared; sqrt keeps area proportional to value and prevents exaggeration.' }]
          }
        },
        {
          id: 'ch-4-3',
          zh: {
            title: '4.3 曲线拟合（10 种）',
            goals: ['区分插值与拟合', '按数据特征选择 line.curve', '用 monotoneX 避免伪震荡'],
            predict: { q: '数据有轻微抖动、又必须保持单调趋势时，应选哪种 curve？', opts: ['curveCatmullRom', 'curveMonotoneX', 'curveStep'], answer: 1, explain: 'monotoneX 在保持单调的同时平滑连接，不会像普通样条那样在局部产生上下摆动。' },
            lab: '切换 10 种 line.curve，观察同一组点在每种曲线下的形态差异。',
            controls: [['10 个曲线类型标签', '切换 linear / monotoneX / natural / step 等算法，比较插值与平滑的差别']],
            use: '折线需要表达趋势时；离散状态切换用 step 系。',
            care: '插值曲线会经过每个噪声点，可能让人误以为数据比实际更平滑或更有规律。',
            quiz: [{ q: 'curveStep 最适合什么场景？', opts: ['连续温度变化', '离散状态切换（如开关、档位）', '平滑趋势'], answer: 1, why: 'step 保持分段常值，只在状态变化处跳变，适合离散状态。' }]
          },
          en: {
            title: '4.3 Curve fitting (10 types)',
            goals: ['Distinguish interpolation from fitting', 'Choose a line.curve from data character', 'Avoid false oscillation with monotoneX'],
            predict: { q: 'Slightly noisy data that must stay monotonic calls for which curve?', opts: ['curveCatmullRom', 'curveMonotoneX', 'curveStep'], answer: 1, explain: 'monotoneX stays smooth while preserving monotonicity, avoiding the local overshoot of ordinary splines.' },
            lab: 'Switch among ten line.curve types to compare the shape produced by the same points.',
            controls: [['Ten curve-type tabs', 'Switch between linear, monotoneX, natural, step and others to compare interpolation with smoothing']],
            use: 'When a line must express trend; use step curves for discrete state changes.',
            care: 'Interpolated curves pass through every noisy point and can imply more smoothness than exists.',
            quiz: [{ q: 'curveStep is best for what?', opts: ['Continuous temperature', 'Discrete state changes such as on/off', 'Smooth trends'], answer: 1, why: 'Step keeps piecewise constant values and jumps only at state changes.' }]
          }
        },
        {
          id: 'ch-4-4',
          zh: {
            title: '4.4 倾角感知（45°）',
            goals: ['复述 Cleveland 的 U 型误差结论', '解释 45° 为什么是视觉"中点"', '用 log 轴把关键斜率调回 30°–60°'],
            predict: { q: '直线斜率接近 0°（几乎水平）时，人眼估计斜率的误差会怎样？', opts: ['最小', '最大', '没有变化'], answer: 1, explain: 'Cleveland 实验发现误差在 0° 与 90° 附近最大，在 45° 附近最小，整体呈 U 型。' },
            lab: '拖动斜率滑块，比较真实斜率与主观感受，观察误差在哪些角度最大。',
            controls: [['「角度」滑块', '改变斜率在屏幕上的倾角，比较人眼估计值与真实值的偏差']],
            compare: {
              bad: '为了让「趋势更明显」，随意拉长或压缩坐标轴',
              good: '固定纵横比例，或让关键趋势接近 45°',
              why: '人眼对倾角的估计是非线性的，45° 附近最准确；拉伸坐标轴会放大视觉斜率，却没有改变任何数据。'
            },
            use: '需要让读者比较增长快慢、变化幅度时。',
            care: '在 5° 以下或 85° 以上做趋势对比，读者几乎无法可靠判断差异。',
            quiz: [{ q: '本章推荐的"黄金倾角"是多少？', opts: ['0°', '45°', '90°'], answer: 1, why: '45° 附近人眼对斜率的估计最准确，误差最小。' }]
          },
          en: {
            title: '4.4 Perceiving slope (45 degrees)',
            goals: ['Recite Cleveland U-shaped error result', 'Explain why 45 degrees is the visual midpoint', 'Use a log axis to bring key slopes into 30-60 degrees'],
            predict: { q: 'For a nearly horizontal line (0 degrees), how accurate are slope estimates?', opts: ['Most accurate', 'Least accurate', 'Unchanged'], answer: 1, explain: 'Cleveland found errors peak near 0 and 90 degrees and are smallest near 45 degrees, forming a U.' },
            lab: 'Drag the slope slider to compare true and perceived slope and see where error peaks.',
            controls: [['Angle slider', 'Changes the on-screen tilt of the slope so you can compare perceived with actual angle']],
            compare: {
              bad: 'Stretching or squeezing axes arbitrarily to make a trend look stronger',
              good: 'Fixing the aspect ratio, or keeping the key trend near 45 degrees',
              why: 'Perceived tilt is non-linear and most accurate near 45 degrees; stretching an axis exaggerates the visual slope without changing any data.'
            },
            use: 'When readers must compare growth rates or magnitudes of change.',
            care: 'Below 5 or above 85 degrees, trend comparisons become unreliable.',
            quiz: [{ q: 'What is the recommended golden angle in this chapter?', opts: ['0 degrees', '45 degrees', '90 degrees'], answer: 1, why: 'Slope estimates are most accurate and errors smallest near 45 degrees.' }]
          }
        },
        {
          id: 'ch-4-5',
          zh: {
            title: '4.5 等值线（Marching Squares）',
            goals: ['解释 Marching Squares 如何把标量场变成曲线', '说出 16 种 case 的编码方式', '知道 3D 扩展 Marching Cubes 的来源'],
            predict: { q: '一个网格单元有 4 个角，每个角只有"高于阈值 / 不高于"两种状态，共多少种组合？', opts: ['8', '16', '64'], answer: 1, explain: '2⁴ = 16。每种组合对应 0、1 或 2 条线段，把高于与低于阈值的区域分开。' },
            lab: '拖动阈值滑块，观察等值线如何在标量场上移动与合并。',
            controls: [['「阈值」滑块', '移动等值线阈值，观察 Marching Squares 追踪出的曲线如何移动与合并']],
            use: '地形等高线、密度等值图、温度 / 气压场、医学影像等值面。',
            care: '网格分辨率过低时，等值线会出现明显折角；插值方法也会影响形状。',
            quiz: [{ q: 'Marching Squares 扩展到三维后叫什么？', opts: ['Marching Cubes', 'Iso Surface', 'Contour Plot'], answer: 0, why: 'Marching Cubes（Lorensen & Cline 1987）把 4 角 16 种 case 扩展为 8 角 256 种。' }]
          },
          en: {
            title: '4.5 Contours (Marching Squares)',
            goals: ['Explain how Marching Squares turns a scalar field into curves', 'Describe the 16-case encoding', 'Name the 3D extension Marching Cubes'],
            predict: { q: 'A cell has 4 corners, each above or below a threshold. How many combinations exist?', opts: ['8', '16', '64'], answer: 1, explain: '2^4 = 16. Each case maps to 0, 1 or 2 segments that separate the above and below regions.' },
            lab: 'Drag the threshold slider to watch contours move and merge across the scalar field.',
            controls: [['Threshold slider', 'Moves the contour threshold so you can watch Marching Squares traces move and merge']],
            use: 'Terrain contours, density isolines, temperature or pressure fields, medical iso-surfaces.',
            care: 'Coarse grids produce visible corners; interpolation choices also change the contour shape.',
            quiz: [{ q: 'What is the 3D extension of Marching Squares called?', opts: ['Marching Cubes', 'Iso Surface', 'Contour Plot'], answer: 0, why: 'Marching Cubes (Lorensen & Cline 1987) extends 4-corner 16 cases to 8-corner 256 cases.' }]
          }
        }
      ]
    },

    /* ================= 第 5 章 · 时序数据可视化 ================= */
    {
      key: '5', dir: 'lesson-05', href: 'lesson-05/', color: '#0e765d',
      zh: { title: '时序数据可视化', time: '70–90 分钟', prereq: '建议先学第 1、2、4 章；会复用折线与坐标轴知识', focus: ['5 个时间属性', '折线图', '日历热图', '螺旋', 'Storyline'] },
      en: { title: 'Time-series visualization', time: '70-90 min', prereq: 'Chapters 1, 2 and 4 first; reuses lines and axes', focus: ['Five time properties', 'Line charts', 'Calendar heatmap', 'Spiral', 'Storyline'] },
      points: { zh: ['时间分解', '日历 colormap', '极坐标变换', 'Storygraph'], en: ['Time decomposition', 'Calendar colormap', 'Polar transform', 'Storygraph'] },
      dataNote: { zh: '本章使用 2024 年北京每日最高气温、法国人名历史频率与电影情节数据，均为教学示例，不用于气候或人口结论。', en: 'Demos use 2024 Beijing daily maximum temperature, historical French name frequencies and film events for teaching only.' },
      review: {
        zh: {
          concepts: ['时间五属性：有序 / 连续 / 周期 / 独立于空间 / 结构性', '折线图擅长趋势，不擅长周期', '日历热图：年 = 行 / 周 = 列，适合发现周期与异常', '螺旋：等速展开，突出循环', 'Storyline：生命线靠拢表示角色相遇'],
          can: ['先列出时间属性，再选图型', '用折线 + hover + 时间段筛选讲趋势', '用日历热图定位周末效应与节假日异常', '用螺旋与 Storyline 表达周期和多角色叙事'],
          mistakes: ['忽略周期性，把季节趋势抹平', '把没有周期的时间硬做成螺旋', '日历热图用发散色板', 'Storyline 用 monotoneX 导致线条过直、失去叙事感']
        },
        en: {
          concepts: ['Five time properties: order, continuity, periodicity, space independence, structure', 'Lines excel at trend, not repetition', 'Calendar heatmap: years as rows, weeks as columns, good for cycles and anomalies', 'Spiral: constant expansion foregrounds repetition', 'Storyline: converging lifelines mean characters meet'],
          can: ['List time properties before choosing a chart', 'Tell a trend with a line, hover and time filter', 'Locate weekend effects and holiday anomalies on a calendar heatmap', 'Use a spiral and Storyline for cycles and multi-actor narratives'],
          mistakes: ['Ignoring periodicity and flattening seasonal trends', 'Forcing a spiral onto non-cyclic time', 'Using a diverging palette for a calendar heatmap', 'Using monotoneX in a Storyline and losing the flow']
        }
      },
      sections: [
        {
          id: 'ch-5-1',
          zh: {
            title: '5.1 时间属性',
            goals: ['说出时间的 5 个核心属性', '把每个属性对应到一种设计决策', '识别忽略属性导致的常见错误'],
            predict: { q: '如果忽略时间的周期性，最可能发生什么？', opts: ['数据无法排序', '季节性规律被抹平', '日期解析失败'], answer: 1, explain: '只看年度总量或线性趋势时，周、季节的循环结构会被平均掉，图上看不到真正的周期。' },
            lab: '点击五张属性卡片，查看每个属性对应的可视化策略与反例。',
            controls: [['五张属性卡片', '点击任一属性，下方显示定义、实际例子与它对可视化设计的影响']],
            use: '拿到任何时序数据时，先花一分钟判断五个属性。',
            care: '不要把"有日期列"等同于"有周期性"；周期必须由数据与业务共同确认。',
            quiz: [{ q: '「60 秒 = 1 分钟」体现的是时间的哪个属性？', opts: ['连续性', '结构性', '周期性'], answer: 1, why: '时间尺度有层级结构，其中部分分割（如 60 秒）是人为约定，属于结构性。' }]
          },
          en: {
            title: '5.1 Properties of time',
            goals: ['Name the five core properties of time', 'Map each property to a design decision', 'Recognize errors caused by ignoring a property'],
            predict: { q: 'If periodicity is ignored, what is the most likely result?', opts: ['The data cannot be sorted', 'Seasonal structure is flattened', 'Date parsing fails'], answer: 1, explain: 'Annual totals or a single linear trend average away weekly and seasonal cycles.' },
            lab: 'Click the five property cards to see the matching visualization strategy and a counterexample.',
            controls: [['Five property cards', 'Click a card to see its definition, a real example, and how it affects visualization design']],
            use: 'Whenever you receive time-series data, spend a minute checking all five properties.',
            care: 'A date column does not guarantee periodicity; confirm cycles with the domain.',
            quiz: [{ q: '"60 seconds = 1 minute" reflects which property?', opts: ['Continuity', 'Structure', 'Periodicity'], answer: 1, why: 'Time scales have a hierarchy, and divisions such as 60 seconds are conventions, which is structure.' }]
          }
        },
        {
          id: 'ch-5-2',
          zh: {
            title: '5.2 标准时间可视化（折线图）',
            goals: ['说明折线图在趋势表达上的优势', '解释折线图为什么难以表达周期性', '按数据点数选择 curve 与图型'],
            predict: { q: '数据点超过 500 个、又很密集时，更适合用什么？', opts: ['普通折线', '面积图或箱形图等聚合视图', '饼图'], answer: 1, explain: '过密的折线会糊成一团；聚合成面积、箱形或分面视图更能看清整体结构。' },
            lab: '勾选或取消人名系列，控制折线的显示与隐藏，观察多条线叠加后的可读性。',
            controls: [['人名系列复选标签', '勾选或取消某个人名系列，控制对应折线的显示与隐藏']],
            use: '数据点不多、重点是变化趋势与转折点时。',
            care: '想表达"每年同月"的循环时，折线不如日历或螺旋直观。',
            quiz: [{ q: '折线图最不擅长表达什么？', opts: ['长期趋势', '周期性', '单个峰值'], answer: 1, why: '折线沿线性时间轴展开，循环结构在视觉上被拉平，这正是日历图与螺旋图要解决的问题。' }]
          },
          en: {
            title: '5.2 Standard time charts (lines)',
            goals: ['Explain the strength of lines for trend', 'Explain why lines fail at periodicity', 'Choose a curve and chart from the point count'],
            predict: { q: 'With more than 500 dense points, what works better?', opts: ['A plain line', 'An aggregate view such as area or box plots', 'A pie chart'], answer: 1, explain: 'Very dense lines smear together; aggregating into area, box or faceted views reveals structure.' },
            lab: 'Toggle name series on and off to control which lines are drawn and see how readability changes as lines stack.',
            controls: [['Name-series checkboxes', 'Check or uncheck a name series to show or hide its line']],
            use: 'When points are few and the goal is trend and turning points.',
            care: 'To show a recurring month each year, a line is less clear than a calendar or spiral.',
            quiz: [{ q: 'What are lines worst at expressing?', opts: ['Long-term trend', 'Periodicity', 'A single peak'], answer: 1, why: 'Lines unfold along a linear time axis, flattening cycles; calendar and spiral views address this.' }]
          }
        },
        {
          id: 'ch-5-3',
          zh: {
            title: '5.3 日历热图（van Wijk）',
            goals: ['复述日历热图的行列布局', '说明它适合发现哪些模式', '用月度分隔线提升可读性'],
            predict: { q: '日历热图选择周一还是周日作为每周起点，会影响什么？', opts: ['颜色数量', '周末在视觉上的位置', '数据总量'], answer: 1, explain: '起点不同会让周六、周日落在网格的不同列，影响读者对"周末效应"的感知位置。' },
            lab: '切换 colormap，观察周末分布与异常日期在不同色带下是否更容易被发现。',
            controls: [['「colormap」下拉框', '切换 RdYlBu / Viridis / Cividis 三套色带，比较可读性与色盲友好度']],
            compare: {
              bad: '日历热图使用 RdYlBu 这类发散色带',
              good: '用 Viridis / Cividis 等顺序色带',
              why: '日历计数是有序数据，发散色带的浅色中点会被误读成「零」；顺序色带明度单调，更适合比较大小。'
            },
            use: '一年以上、日粒度、关心星期效应与节假日异常的数据。',
            care: '数据本身没有明显周/月结构时，日历热图只是把折线切碎。',
            quiz: [{ q: '日历热图应使用哪类 colormap？', opts: ['发散型', '顺序型', '定性型'], answer: 1, why: '温度等数值是单调量，顺序型 colormap 才能正确表达大小。' }]
          },
          en: {
            title: '5.3 Calendar heatmap (van Wijk)',
            goals: ['Recite the row/column layout of a calendar heatmap', 'Explain which patterns it reveals', 'Use month dividers to improve readability'],
            predict: { q: 'Choosing Monday versus Sunday as the week start changes what?', opts: ['The number of colors', 'Where weekends appear visually', 'The data total'], answer: 1, explain: 'The start day shifts Saturday and Sunday into different columns, changing where readers perceive weekend effects.' },
            lab: 'Switch the colormap to see whether weekends and anomalies become easier to spot.',
            controls: [['colormap dropdown', 'Switches between RdYlBu, Viridis and Cividis to compare readability and colour-blind safety']],
            compare: {
              bad: 'Using a diverging map such as RdYlBu for a calendar heatmap',
              good: 'Using a sequential map such as Viridis or Cividis',
              why: 'Daily counts are ordered data; the pale midpoint of a diverging map is misread as zero. A sequential map has monotonic lightness, which suits magnitude comparison.'
            },
            use: 'Daily data over a year or more where weekday effects and holidays matter.',
            care: 'Without weekly or monthly structure, a calendar merely chops up a line chart.',
            quiz: [{ q: 'Which colormap suits a calendar heatmap?', opts: ['Diverging', 'Sequential', 'Qualitative'], answer: 1, why: 'Temperature and similar values are monotonic, so a sequential map encodes magnitude correctly.' }]
          }
        },
        {
          id: 'ch-5-4',
          zh: {
            title: '5.4 周期时间可视化（阿基米德螺旋）',
            goals: ['对比螺旋与折线在周期表达上的差异', '写出阿基米德螺旋 r = a + bθ 的含义', '解释 Δθ 为什么要随半径变化'],
            predict: { q: '螺旋布局最适合哪类时间数据？', opts: ['没有周期的长趋势', '有明显年 / 季 / 周循环的数据', '只含两个时间点的数据'], answer: 1, explain: '每转一圈代表一个周期，循环数据在径向对齐后更容易比较"同相位"的数值。' },
            lab: '切换每周起始（周日 / 周一），观察同一日期在日历列与螺旋中的位置变化。',
            controls: [['「每周起始」下拉框', '切换周日 / 周一，观察跨年周如何重新排列']],
            use: '数据有稳定周期，且你想比较不同周期的同一相位时。',
            care: '周期不稳定或太长时，螺旋会退化成难读的折线；此时优先用折线或日历。',
            quiz: [{ q: '阿基米德螺旋 r = a + bθ 中，b 表示什么？', opts: ['每圈半径增加量', '角速度', '颜色数量'], answer: 0, why: 'θ 每增加 2π（转一圈），半径增加 2πb，因此 b 控制圈与圈之间的间距。' }]
          },
          en: {
            title: '5.4 Cyclic time (Archimedean spiral)',
            goals: ['Compare spirals and lines for showing cycles', 'Explain r = a + b(theta)', 'Explain why the angle step changes with radius'],
            predict: { q: 'A spiral suits which kind of time data?', opts: ['Long trends with no cycle', 'Data with clear yearly, seasonal or weekly cycles', 'Data with only two timestamps'], answer: 1, explain: 'Each turn is one cycle; cyclic data aligns radially so the same phase is easy to compare.' },
            lab: 'Switch the week start between Sunday and Monday to see the same dates move across calendar columns and spiral turns.',
            controls: [['Week-start dropdown', 'Switches between Sunday and Monday to show how cross-year weeks are rearranged']],
            use: 'When cycles are stable and you want to compare the same phase across cycles.',
            care: 'With unstable or very long cycles, the spiral degrades into a hard-to-read line.',
            quiz: [{ q: 'In r = a + b(theta), what does b represent?', opts: ['Radius added per turn', 'Angular speed', 'Number of colors'], answer: 0, why: 'Each full turn adds 2 pi b to the radius, so b controls spacing between turns.' }]
          }
        },
        {
          id: 'ch-5-5',
          zh: {
            title: '5.5 Storyline 时间线（侏罗纪公园）',
            goals: ['解释生命线靠拢 / 分离的含义', '说明 Catmull-Rom 张力系数的作用', '用事件层标注关键转折'],
            predict: { q: '两条角色生命线在某一时刻靠近，通常表示什么？', opts: ['两个角色相遇或冲突', '时间暂停', '数据缺失'], answer: 0, explain: 'Storyline 用纵向距离编码关系：靠拢表示相遇、合作或冲突，分离表示各自发展。' },
            lab: '拖动曲线张力滑块，观察多条生命线的弯曲程度与交叉点如何变化。',
            controls: [['「曲线张力」滑块', '调整 storyline 控制点的张力 alpha，改变线条弯曲程度与交叉位置']],
            use: '多角色、多进程、事件驱动的叙事型时间数据。',
            care: '角色过多时线条会缠绕；需要分组、折叠或只保留主线角色。',
            quiz: [{ q: 'Storyline 为什么常选 Catmull-Rom 而不是 monotoneX？', opts: ['Catmull-Rom 更快', '它保留叙事所需的自然流动感', 'monotoneX 不支持时间轴'], answer: 1, why: 'monotoneX 过于笔直，Catmull-Rom 在张力 0.5 时既有流动感又不过度弯曲。' }]
          },
          en: {
            title: '5.5 Storyline timelines',
            goals: ['Explain what converging and separating lifelines mean', 'Describe the role of the Catmull-Rom tension', 'Mark turning points with an event layer'],
            predict: { q: 'Two character lifelines converge at a moment. What does that usually mean?', opts: ['They meet or conflict', 'Time pauses', 'Data is missing'], answer: 0, explain: 'Storyline encodes relationships as vertical distance: converging means meeting, cooperating or conflict.' },
            lab: 'Drag the curve tension slider to change how lifelines bend and where they cross.',
            controls: [['Curve tension slider', 'Adjusts the storyline control-point tension alpha, changing curvature and crossing points']],
            use: 'Narrative time data with multiple actors or parallel processes.',
            care: 'Too many characters tangle the lines; group, collapse, or keep only the main actors.',
            quiz: [{ q: 'Why does Storyline often use Catmull-Rom instead of monotoneX?', opts: ['It is faster', 'It keeps the natural flow a narrative needs', 'monotoneX cannot use a time axis'], answer: 1, why: 'monotoneX is too straight; Catmull-Rom at tension 0.5 flows without overshooting.' }]
          }
        }
      ]
    }
  ]
};

/* 便捷派生：总小节数不再单独硬编码 */
window.COURSE_CONFIG.totalSections = window.COURSE_CONFIG.chapters.reduce(function (n, c) {
  return n + c.sections.length;
}, 0);
