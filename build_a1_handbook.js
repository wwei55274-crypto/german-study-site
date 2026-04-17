const fs = require("fs");
const vm = require("vm");

function loadWindowObject(filePath, key) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(filePath, "utf8"), context);
  return context.window[key];
}

function writeWindowObject(filePath, variableName, object, comment) {
  const prefix = comment ? `// ${comment}\n` : "";
  fs.writeFileSync(filePath, `${prefix}window.${variableName} = ${JSON.stringify(object, null, 2)};\n`, "utf8");
}

function example(de, zh = "", note = "") {
  return { de, zh, note };
}

function choice(question, options, answerIndex, explanation) {
  return { type: "choice", question, options, answerIndex, explanation };
}

function fill(question, answers, explanation, displayAnswer = answers[0], placeholder = "输入完整答案") {
  return { type: "fill", question, placeholder, answers, displayAnswer, explanation };
}

const grammarData = loadWindowObject("grammar-data.js", "grammarData");
const studyTranslations = loadWindowObject("translations.js", "studyTranslations");

const a1Topics = [
  {
    id: "personal-pronouns",
    code: "A1-01",
    type: "代词",
    title: "人称代词：ich, du, er, sie, es, wir, ihr, sie, Sie",
    summary: "先把“人”和“东西”怎么用代词替换学稳，这是整本 A1 语法的起点。",
    overview: "本单元对应手册里人称代词的入门部分。要先分清单数、复数、正式称呼 Sie 和普通的 sie，还要会用 es / sie 指代物品。网页里保留了书上的使用顺序：先认代词，再放进真实对话和简短情境里练熟。",
    focus: [
      "区分 ich / du / er / sie / es / wir / ihr / sie / Sie 的人称和场景。",
      "正式称呼 Sie 的动词形式和复数 sie 一样，但书写时首字母大写。",
      "指物时要跟名词词性走：das Messer → es，die Gabel → sie。"
    ],
    tip: "A1 先不要死记表格本身，最好每个代词都配一个完整句子一起记。",
    examples: [
      example("Ich komme aus Seoul, aber wir wohnen jetzt in Berlin.", "我来自首尔，但我们现在住在柏林。"),
      example("Wo ist das Handy? Es liegt auf dem Tisch.", "手机在哪里？它在桌子上。"),
      example("Guten Tag, Frau Keller. Kommen Sie aus Wien?", "您好，Keller 女士。您来自维也纳吗？")
    ],
    exercises: [
      choice("正确的句子是：", ["Anna kommt aus Rom. Er lernt Deutsch.", "Anna kommt aus Rom. Sie lernt Deutsch.", "Anna kommt aus Rom. Es lernt Deutsch."], 1, "Anna 是女性，所以要用 sie。"),
      fill("用括号里的词完成句子：Das Buch ist neu. ___ liegt hier. (es)", ["Es"], "中性名词 das Buch 后面用 es 指代。"),
      fill("用括号里的词完成句子：Guten Tag, Herr Braun. Woher kommen ___? (Sie)", ["Sie"], "正式称呼对方时要用大写 Sie。")
    ],
    en: {
      title: "Personal Pronouns: ich, du, er, sie, es, wir, ihr, sie, Sie",
      summary: "Master the pronouns for people and things before building longer sentences.",
      overview: "This lesson follows the handbook sequence for A1 personal pronouns. It distinguishes singular and plural forms, the formal Sie, and pronouns for objects such as es and sie. The topic then moves quickly into short dialogues so the forms are learned in context."
    }
  },
  {
    id: "present-tense",
    code: "A1-02",
    type: "动词",
    title: "现在时变位：规则词尾与常见元音变化",
    summary: "A1 的核心不是背理论，而是让主语和动词形式自动搭配起来。",
    overview: "这一单元整合手册里 Präsens 规则变位和常见元音变化。先掌握标准词尾 -e / -st / -t / -en，再注意 du 与 er, sie, es 常见的元音变化，如 fahren → du fährst, lesen → er liest。网页练习会让你在规则变位和不规则变化之间切换，避免只会背一类。",
    focus: [
      "规则动词的现在时词尾最常出现：ich -e，du -st，er/sie/es -t，wir/sie/Sie -en。",
      "部分高频动词在 du 与 er/sie/es 形式中会发生元音变化。",
      "变位要和主语一起记，不要只记孤立的词尾。"
    ],
    tip: "看到句子时先找主语，再找和它匹配的动词形式，这样比机械背表格更稳。",
    examples: [
      example("Ich arbeite heute bis 18 Uhr.", "我今天工作到 18 点。"),
      example("Du fährst jeden Morgen mit dem Fahrrad.", "你每天早上骑自行车。"),
      example("Er liest abends gern Zeitung.", "他晚上很喜欢看报纸。")
    ],
    exercises: [
      choice("正确的一组是：", ["ich lerne - du lernst - wir lernen", "ich lernt - du lerne - wir lernst", "ich lernen - du lernst - wir lernt"], 0, "规则动词 lernen 的现在时要按主语变化。"),
      fill("用括号里的词完成句子：Am Wochenende ___ ich lange. (arbeiten)", ["arbeite"], "主语是 ich，所以词尾用 -e。"),
      fill("用括号里的词完成句子：Du ___ morgen nach Köln. (fahren)", ["fährst", "fahrst"], "fahren 在 du 形式里有元音变化：du fährst。")
    ],
    en: {
      title: "Present Tense: Regular Endings and Common Vowel Changes",
      summary: "Build automatic links between the subject and the correct present-tense verb form.",
      overview: "This lesson combines the handbook material on regular present-tense endings with the most common vowel-changing verbs. Learners first stabilize the core endings and then contrast them with forms such as du fährst and er liest so the two patterns can be handled together."
    }
  },
  {
    id: "sein-haben-special-verbs",
    code: "A1-03",
    type: "动词",
    title: "sein, haben 与高频特殊动词",
    summary: "sein 和 haben 是基础中的基础，möchten、wissen、tun 也非常高频。",
    overview: "这一单元承接书里关于 sein、haben、möchten、wissen、tun 的内容。A1 阶段要尽快熟悉这些高频动词，因为它们几乎出现在所有自我介绍、购物、问路、表达状态和请求的情境中。网页练习会把这些词放在真实表达里，而不是只让你背表格。",
    focus: [
      "sein 用于身份、状态、年龄与地点类表达。",
      "haben 常表示拥有，也常出现在固定搭配里，如 Zeit haben。",
      "möchten 比 wollen 更礼貌，wissen 与 tun 在口语和日常任务里很常见。"
    ],
    tip: "如果一句话想表达“是什么、在哪里、几岁、怎么样”，先考虑 sein。",
    examples: [
      example("Ich bin 22 Jahre alt und habe heute Zeit.", "我 22 岁，今天有时间。"),
      example("Wir möchten zwei Kaffee und ein Wasser.", "我们想要两杯咖啡和一杯水。"),
      example("Weißt du, wo der Bahnhof ist?", "你知道火车站在哪里吗？")
    ],
    exercises: [
      choice("正确的句子是：", ["Wir sind heute keine Zeit.", "Wir haben heute keine Zeit.", "Wir seid heute keine Zeit."], 1, "固定表达是 Zeit haben。"),
      fill("用括号里的词完成句子：Ich ___ einen Tee, bitte. (möchten)", ["möchte"], "礼貌表达愿望时常用 ich möchte。"),
      fill("用括号里的词完成句子：___ du, wo Paul wohnt? (wissen)", ["Weißt"], "du 对应 weißt。")
    ],
    en: {
      title: "sein, haben, and Other High-Frequency Special Verbs",
      summary: "Learn the special verbs that appear constantly in everyday A1 communication.",
      overview: "This lesson develops the handbook chapters on sein, haben, möchten, wissen, and tun. These verbs are essential in introductions, polite requests, daily routines, and simple conversations, so they are practiced in short functional contexts rather than as isolated charts."
    }
  },
  {
    id: "modal-verbs",
    code: "A1-04",
    type: "动词",
    title: "情态动词：构成、位置与基本意义",
    summary: "A1 要同时学会情态动词的变位、句子位置和它们表达的意义差别。",
    overview: "本单元把手册中三个情态动词章节合并到一个网页主题里：先看 können / wollen / möchten / müssen / sollen / dürfen 的现在时变位，再看它们在句中的位置，最后区分“能力、愿望、许可、义务、建议”等意义。这样处理更符合网页学习节奏，也保留了书里的内容脉络。",
    focus: [
      "情态动词本身放在变位位置，另一个动词以原形留在句末。",
      "möchten 更礼貌，wollen 更直接；dürfen 表示被允许，müssen 表示必须。",
      "同一个情态动词既要会变位，也要会用在真实句子里。"
    ],
    tip: "做题时先判断意思，再决定用哪个情态动词，不要只盯着词形。",
    examples: [
      example("Ich kann heute nicht kommen.", "我今天不能来。"),
      example("Wir möchten einen Tisch für zwei Personen.", "我们想订一张两人桌。"),
      example("Du musst morgen früh aufstehen.", "你明天必须早起。")
    ],
    exercises: [
      choice("正确的句子是：", ["Ich kann heute nicht kommen.", "Ich kann heute nicht komme.", "Ich heute kann nicht kommen."], 0, "情态动词 kann 变位后放在第二位，实义动词 kommen 原形放句末。"),
      choice("正确的一组是：", ["möchten = 更礼貌地表达愿望", "dürfen = 必须", "müssen = 被允许"], 0, "möchten 用来礼貌表达想要。"),
      fill("用括号里的词完成句子：Heute ___ ich lange arbeiten. (müssen)", ["muss"], "主语 ich 对应 muss。")
    ],
    en: {
      title: "Modal Verbs: Form, Sentence Position, and Core Meanings",
      summary: "A1 modal verbs need to be learned as form, position, and meaning together.",
      overview: "This lesson merges the handbook material on modal verb conjugation, sentence position, and use. Learners work with können, wollen, möchten, müssen, sollen, and dürfen in a single topic so they can connect grammar structure with everyday meanings such as ability, wish, permission, obligation, and advice."
    }
  },
  {
    id: "separable-verbs-a1",
    code: "A1-05",
    type: "动词",
    title: "可分动词：前缀分开、句框与从句位置",
    summary: "A1 可分动词要一起掌握三件事：重音、分离和句末位置。",
    overview: "本单元对应书里可分动词部分。网页里保留了三条核心规则：主句中前缀分到句尾；和情态动词连用时整个动词保持原形；进入从句时不再拆开，而是完整地待在句末。这样能覆盖书里的主要使用场景。",
    focus: [
      "主句：Ich stehe um sechs Uhr auf。",
      "和情态动词连用：Ich muss morgen früh aufstehen。",
      "从句：..., weil ich morgen früh aufstehe。"
    ],
    tip: "看到前缀先不要急着找它的位置，先判断现在是主句、从句还是情态动词结构。",
    examples: [
      example("Ich kaufe am Samstag im Supermarkt ein.", "我周六在超市买东西。"),
      example("Morgen muss ich früh aufstehen.", "明天我得早起。"),
      example("Ich gehe jetzt ins Bett, weil ich früh aufstehe.", "我现在去睡觉，因为我起得早。")
    ],
    exercises: [
      choice("下面哪一句是可分动词 aufstehen 的正确主句形式？", ["Ich aufstehe um sechs Uhr.", "Ich stehe um sechs Uhr auf.", "Ich stehe auf um sechs Uhr."], 1, "可分动词在主句里前缀放句末。"),
      fill("用括号里的词完成句子：Morgen ___ wir sehr früh ___. (abfahren)", ["fahren / ab", "fahren ab"], "主句里 abfahren 要拆开成 fahren ... ab。"),
      fill("用括号里的词完成句子：Ich muss morgen früh ___. (einkaufen)", ["einkaufen"], "情态动词后面整个可分动词保持原形，不拆开。")
    ],
    en: {
      title: "Separable Verbs: Split Prefixes, Sentence Frame, and Clause Position",
      summary: "Learn when the prefix separates, when it stays together, and where the verb belongs.",
      overview: "This lesson follows the handbook treatment of separable verbs. It covers the main-clause split pattern, the unsplit infinitive after modal verbs, and the full verb at the end of subordinate clauses so learners can handle the most common A1 contexts with confidence."
    }
  },
  {
    id: "imperative",
    code: "A1-06",
    type: "句型",
    title: "命令式：du / ihr / Sie",
    summary: "命令式不是只背一个形式，而是要按说话对象切换。",
    overview: "本单元依据手册里的 Imperativ 章节重组。网页里会把 du、ihr、Sie 三种命令式放在一个学习面板里，并加入 bitte 让表达更自然。重点不是死背规则，而是能根据对象迅速选对形式。",
    focus: [
      "du 命令式通常不带主语：Komm!, Lies!, Sprich langsamer!",
      "ihr 形式接近一般现在时复数：Kommt!, Lest!, Sprecht!",
      "Sie 形式最礼貌：Kommen Sie bitte ..., Lesen Sie bitte ..."
    ],
    tip: "先判断对象是谁，再决定命令式形式；对陌生人和正式场合优先想到 Sie-Imperativ。",
    examples: [
      example("Komm bitte schnell!", "快点来吧！"),
      example("Lest den Text noch einmal.", "你们再读一遍课文。"),
      example("Sprechen Sie bitte etwas langsamer.", "请您说慢一点。")
    ],
    exercises: [
      choice("对朋友说“过来！”最自然的是：", ["Kommen Sie!", "Komm!", "Kommt!"], 1, "对单数熟人用 du 形式。"),
      fill("用括号里的词完成句子：___ Sie bitte langsamer. (sprechen)", ["Sprechen"], "对 Sie 的命令式结构是动词原形 + Sie。"),
      fill("用括号里的词完成句子：___ doch mit! (kommen, du)", ["Komm"], "du 命令式通常不用主语。")
    ],
    en: {
      title: "The Imperative: du, ihr, and Sie",
      summary: "Choose the imperative form according to who you are speaking to.",
      overview: "This lesson reorganizes the handbook imperative chapter into one practical web lesson. The focus is on switching correctly between du, ihr, and Sie forms and softening commands naturally with bitte, rather than memorizing the forms in isolation."
    }
  },
  {
    id: "question-words",
    code: "A1-07",
    type: "问句",
    title: "W-问词：wer, was, wo, woher, wohin, wann, wie, warum",
    summary: "W-问句的第一步不是语序，而是先选对问题类型。",
    overview: "这一单元对应手册里的 Fragewörter。网页里按用途重组：问人、问事、问地点、问来源、问方向、问时间、问方式、问原因。这样可以更快把问词和语义绑定，而不是分散记忆。",
    focus: [
      "wer 问人，was 问事，wie 问方式或状态。",
      "wo 问地点，woher 问来源，wohin 问去向。",
      "wann / wie lange / wie oft 都属于时间表达，但提问角度不同。"
    ],
    tip: "先想清楚自己到底在问“谁 / 什么 / 哪里 / 从哪里 / 去哪里”，再写句子。",
    examples: [
      example("Wo wohnst du jetzt?", "你现在住在哪里？"),
      example("Woher kommt ihr?", "你们从哪里来？"),
      example("Warum lernst du Deutsch?", "你为什么学德语？")
    ],
    exercises: [
      choice("下面哪个问词通常用来询问地点？", ["wer", "wo", "warum"], 1, "问地点最常用 wo。"),
      fill("用合适的疑问词填空：___ kommst du? - Aus China.", ["Woher"], "询问来源要用 woher。"),
      fill("用合适的疑问词填空：___ machst du am Sonntag?", ["Was"], "询问“做什么”用 was。")
    ],
    en: {
      title: "W-Questions: wer, was, wo, woher, wohin, wann, wie, warum",
      summary: "Start by choosing the right question word before shaping the full sentence.",
      overview: "This lesson reorganizes the handbook material on question words by meaning: people, things, place, origin, destination, time, manner, and reason. That makes it easier to connect each W-word with the kind of answer it expects."
    }
  },
  {
    id: "questions",
    code: "A1-08",
    type: "问句",
    title: "一般疑问句与回答：Ja / Nein / Doch",
    summary: "A1 问句不仅要会提问，还要会自然回应。",
    overview: "本单元对应书里 Ja-/Nein-Fragen 与回答部分。网页里把构句和回答放在一起：先看动词置于句首的规则，再看 ja / nein / doch 的基本用法，尤其是否定问句后的 doch。这样更接近日常交流场景。",
    focus: [
      "一般疑问句里变位动词通常放句首：Kommst du heute?",
      "肯定回答常用 ja，否定回答用 nein。",
      "否定问句里要反驳对方时，常用 doch。"
    ],
    tip: "看到问号前，先检查动词是不是已经到了句首。",
    examples: [
      example("Lernen Sie Deutsch?", "您在学德语吗？"),
      example("Hast du keine Zeit? - Doch, ich habe Zeit.", "你没时间吗？- 不，我有时间。"),
      example("Kommt ihr morgen? - Ja, wir kommen.", "你们明天来吗？- 来。")
    ],
    exercises: [
      choice("哪一句是正确的一般疑问句？", ["Du kommst heute?", "Kommst du heute?", "Heute kommst du?"], 1, "一般疑问句需要把变位动词放到句首。"),
      fill("把句子改成一般疑问句：Sie sprechen Deutsch.", ["Sprechen Sie Deutsch?"], "陈述句变一般疑问句时，把变位动词提前。"),
      choice("正确的一组是：", ["Hast du keine Zeit? - Doch, ich habe Zeit.", "Hast du keine Zeit? - Ja, ich habe Zeit.", "Hast du keine Zeit? - Nein, ich habe Zeit."], 0, "对否定问句进行反驳时，德语里常用 doch。")
    ],
    en: {
      title: "Yes/No Questions and Answers: Ja, Nein, Doch",
      summary: "A1 learners need both the question pattern and the natural answer forms.",
      overview: "This lesson develops the handbook chapter on yes/no questions and answers. It brings together verb-first question formation and the reply words ja, nein, and doch, especially for negative questions where doch plays a key role."
    }
  },
  {
    id: "statement-word-order",
    code: "A1-09",
    type: "句型",
    title: "陈述句语序：动词第二位与前场位置",
    summary: "德语的“第二位”是第二个句子成分，不是第二个单词。",
    overview: "本单元对应书里 Position 2 im Satz。网页里会把“动词第二位”拆成更容易看的三步：先是普通主语开头句，然后是时间、地点或其他成分前置，最后是主语移到动词后面。这样能保留手册的规则，也更适合屏幕阅读。",
    focus: [
      "陈述句里变位动词稳定地待在第二位。",
      "第一位可以放时间、地点、宾语或整块短语，但动词仍保持第二位。",
      "如果前面已经有其他成分，主语通常要移到动词后。"
    ],
    tip: "看到句首不是主语时，立刻提醒自己：主语要往后走，动词不能丢掉第二位。",
    examples: [
      example("Am Montag arbeite ich zu Hause.", "周一我在家工作。"),
      example("Heute Abend essen wir Pizza.", "今天晚上我们吃披萨。"),
      example("Im Sommer fahre ich oft ans Meer.", "夏天我常去海边。")
    ],
    exercises: [
      choice("下面哪一句是正确的德语陈述句语序？", ["Heute ich lerne Deutsch.", "Heute lerne ich Deutsch.", "Ich heute lerne Deutsch."], 1, "时间成分前置后，变位动词仍在第二位。"),
      fill("按正确语序写句子：morgen / wir / in Berlin / arbeiten", ["Morgen arbeiten wir in Berlin"], "时间成分 morgen 占第一位后，arbeiten 要放第二位。"),
      fill("按正确语序写句子：am Abend / ich / mit Freunden / telefoniere", ["Am Abend telefoniere ich mit Freunden"], "Am Abend 占第一位，telefoniere 占第二位。")
    ],
    en: {
      title: "Statement Word Order: Verb in Second Position",
      summary: "The finite verb stays in second position even when another element comes first.",
      overview: "This lesson follows the handbook chapter on Position 2 in the sentence. It moves from simple subject-first statements to sentences with fronted time or place expressions so learners can see clearly that the finite verb keeps the second slot and the subject shifts rightward."
    }
  },
  {
    id: "sentence-bracket",
    code: "A1-10",
    type: "句型",
    title: "句框：动词第二位与句末成分",
    summary: "A1 里很多结构都像“句框”：前面一个变位部分，后面一个句末部分。",
    overview: "这一单元整合手册里两个固定位置的概念。网页里把可分动词、Perfekt、Verb + Verb、形容词补足语和常见动词搭配放在一起看，让学习者真正感受到德语句子的“前后夹层”。这能把书里分散的现象串成一条线。",
    focus: [
      "可分动词：Ich kaufe heute ein。",
      "动词 + 不定式：Ich gehe heute schwimmen。",
      "Perfekt 与固定搭配也常形成句框：Ich habe Tennis gespielt。"
    ],
    tip: "句首只盯住第二位还不够，做题时也要主动去找“句尾成分”有没有回到正确位置。",
    examples: [
      example("Ich gehe am Abend noch einkaufen.", "我晚上还要去买东西。"),
      example("Wir wollen heute zusammen kochen.", "我们今天想一起做饭。"),
      example("Er hat gestern Fußball gespielt.", "他昨天踢了足球。")
    ],
    exercises: [
      choice("正确的句子是：", ["Ich gehe heute schwimmen.", "Ich heute gehe schwimmen.", "Ich gehe schwimmen heute."], 0, "变位动词 gehe 在第二位，不定式 schwimmen 在句末。"),
      fill("用括号里的词完成句子：Heute ___ ich Tennis ___. (spielen)", ["spiele", "spiele Tennis"], "普通现在时里，Tennis spielen 作为固定搭配使用。"),
      fill("用括号里的词完成句子：Am Abend ___ wir noch ___. (einkaufen gehen)", ["gehen / einkaufen", "gehen einkaufen"], "gehen 变位放前面，einkaufen 留在句末。")
    ],
    en: {
      title: "The Sentence Frame: Second Position and the Clause Ending",
      summary: "Many A1 patterns form a sentence frame with one part near the front and one at the end.",
      overview: "This lesson reorganizes the handbook material on fixed sentence positions into one clear idea: German often builds a frame. The learner practices separable verbs, infinitive constructions, the perfect tense, and common verb combinations as variations of the same pattern."
    }
  },
  {
    id: "plural-nouns",
    code: "A1-11",
    type: "名词",
    title: "名词复数：复数形式与 die",
    summary: "复数不是只背词尾，而是要连同冠词一起记。",
    overview: "这一单元依据手册里的 Nomen: Plural。网页里保留书里的核心思路：复数形式不完全规则，所以要和名词一起学；同时强调复数冠词一律用 die。练习会把不规则变化、零冠词和数量表达放进一起训练。",
    focus: [
      "复数形式变化很多，最好每学一个名词就顺手记住复数。",
      "定冠词复数统一是 die。",
      "跟数字、数量表达连用时更容易暴露复数错误。"
    ],
    tip: "背单词时尽量直接背“三件套”：der Tisch - die Tische，而不是只背 Tisch。",
    examples: [
      example("Die Männer warten vor dem Kino.", "男人们在电影院前等。"),
      example("Wir haben zwei Babys und drei Katzen.", "我们有两个婴儿和三只猫。"),
      example("Die Bücher liegen auf dem Tisch.", "书放在桌子上。")
    ],
    exercises: [
      choice("das Kind 的复数是：", ["die Kinder", "die Kindes", "die Kinde"], 0, "das Kind 的复数是不规则形式 Kinder。"),
      fill("用括号里的词完成句子：Wir kaufen zwei ___ . (Auto)", ["Autos"], "数字后常直接暴露复数形式：zwei Autos。"),
      fill("用括号里的词完成句子：___ Frauen lernen Deutsch. (definiter Artikel)", ["Die"], "复数定冠词统一是 die。")
    ],
    en: {
      title: "Noun Plurals: Forms and the Article die",
      summary: "Learn plural forms together with the noun instead of treating them as an afterthought.",
      overview: "This lesson follows the handbook chapter on noun plurals. It emphasizes that plural forms are only partly predictable, that the definite article is always die in the plural, and that number expressions are a useful place to reinforce plural patterns."
    }
  },
  {
    id: "articles",
    code: "A1-12",
    type: "冠词",
    title: "冠词与否定：der / die / das, ein / eine, kein / nicht",
    summary: "A1 的冠词系统要和否定一起学，才能真正进入日常表达。",
    overview: "本单元把书里的冠词章节和基本否定合并。网页里先整理 definite / indefinite / kein 的最核心格局，再区分 kein 和 nicht 的使用：名词前常见 kein，句子成分或整句否定多见 nicht。这样更接近真实输入顺序。",
    focus: [
      "定冠词和不定冠词要跟名词词性一起记。",
      "kein 常用于否定名词性内容：Ich habe keine Zeit。",
      "nicht 常否定动词、形容词、副词或整句：Ich koche nicht。"
    ],
    tip: "遇到否定时先问自己：我是在否定“某样东西不存在”，还是在否定“动作 / 状态 / 整句”？",
    examples: [
      example("Der Kaffee ist heiß, aber das Wasser ist kalt.", "咖啡是热的，但水是冷的。"),
      example("Ich habe keinen Hunger, aber ich trinke einen Tee.", "我不饿，但我喝杯茶。"),
      example("Heute koche ich nicht.", "我今天不做饭。")
    ],
    exercises: [
      choice("名词 Tisch 前应使用哪个定冠词？", ["der", "die", "das"], 0, "Tisch 是阳性名词：der Tisch。"),
      choice("“我没有时间”最自然的是：", ["Ich habe nicht Zeit.", "Ich habe keine Zeit.", "Ich bin keine Zeit."], 1, "否定名词 Zeit 时用 keine。"),
      fill("用括号里的词完成句子：Heute ___ ich nicht. (kochen)", ["koche"], "句中否定动作时，nicht 常放在相关成分前后形成自然语序。")
    ],
    en: {
      title: "Articles and Negation: der/die/das, ein/eine, kein, nicht",
      summary: "A1 article work becomes clearer when it is learned together with basic negation.",
      overview: "This lesson merges the handbook chapters on articles and basic negation. Learners review definite and indefinite article patterns and then contrast kein for noun negation with nicht for verbs, adjectives, adverbs, and whole clauses."
    }
  },
  {
    id: "accusative",
    code: "A1-13",
    type: "格",
    title: "第四格 Akkusativ：直接宾语与阳性变化",
    summary: "Akkusativ 的关键不在概念，而在看出阳性形式真的变了。",
    overview: "这一单元对应书里的 Akkusativ 章节。网页里重点保留三个学习点：直接宾语的概念、阳性单数冠词变化，以及高频动词和第四格搭配。这样既能忠实承接原书，也能更适合做网页练习。",
    focus: [
      "第四格常标记直接宾语。",
      "阳性单数是最醒目的变化：der → den，ein → einen。",
      "sehen、kaufen、suchen、haben 等高频动词后常接 Akkusativ。"
    ],
    tip: "做 Akkusativ 题时，先锁定动词，再问“谁 / 什么”是被直接作用的对象。",
    examples: [
      example("Der Mann isst den Fisch.", "男人在吃鱼。"),
      example("Ich kaufe einen neuen Rucksack.", "我买一个新背包。"),
      example("Wir suchen die Schlüssel.", "我们在找钥匙。")
    ],
    exercises: [
      choice("下面哪个冠词通常表示阳性第四格？", ["der", "dem", "den"], 2, "阳性单数 Akkusativ 用 den。"),
      fill("用括号里的词完成句子：Ich sehe ___ Mann. (der)", ["den"], "阳性名词 Mann 在第四格里要变成 den Mann。"),
      fill("用括号里的词完成句子：Er kauft ___ Apfel. (ein)", ["einen"], "阳性单数不定冠词在第四格里是 einen。")
    ],
    en: {
      title: "The Accusative Case: Direct Objects and Masculine Change",
      summary: "The key A1 step is noticing how masculine forms change in the accusative.",
      overview: "This lesson follows the handbook chapter on the accusative. It centers on the direct object, the visible masculine singular changes such as der to den and ein to einen, and the high-frequency verbs that commonly take an accusative object."
    }
  },
  {
    id: "dative",
    code: "A1-14",
    type: "格",
    title: "第三格 Dativ：mit, bei, zu 与常见形式",
    summary: "Dativ 入门最重要的是把“和谁、给谁、跟谁一起”这种感觉建立起来。",
    overview: "这一单元对应书里的 Dativ 章节。网页里保留最核心的 A1 内容：mit / bei / zu 等常见支配第三格的结构、阳性和中性同形、以及复数第三格常见的 -n。练习会特别突出你最容易混淆的形式。",
    focus: [
      "mit、bei、zu 后面常用 Dativ。",
      "阳性和中性第三格都是 dem / einem。",
      "复数第三格很多时候名词要再补一个 -n。"
    ],
    tip: "遇到 mit / bei / zu 先不要想语义细节，先把 Dativ 形式拿稳。",
    examples: [
      example("Ich fahre mit dem Bus zur Arbeit.", "我坐公交去上班。"),
      example("Wir sind heute bei einer Freundin.", "我们今天在一个女朋友家。"),
      example("Sie geht mit den Kindern in den Park.", "她和孩子们去公园。")
    ],
    exercises: [
      choice("下面哪个介词通常支配第三格？", ["mit", "für", "durch"], 0, "mit 后面接 Dativ。"),
      fill("用括号里的词完成句子：Ich komme mit ___ Auto. (das)", ["dem"], "中性名词 Auto 在第三格里是 dem Auto。"),
      fill("用括号里的词完成句子：Wir spielen mit den ___ . (Kind)", ["Kindern"], "复数第三格常见 -n：mit den Kindern。")
    ],
    en: {
      title: "The Dative Case: mit, bei, zu, and Core Forms",
      summary: "Build a strong feel for the case used with common A1 dative prepositions.",
      overview: "This lesson follows the handbook chapter on the dative. It keeps the core A1 patterns: common prepositions such as mit, bei, and zu, the shared masculine and neuter forms dem and einem, and the extra -n that often appears in the dative plural."
    }
  },
  {
    id: "possessive-article-words",
    code: "A1-15",
    type: "冠词",
    title: "物主冠词 + welcher / dieser",
    summary: "会说“我的、你的、这一个、哪一个”，A1 的名词短语就一下子活起来了。",
    overview: "这一单元把手册里的 Possessivartikel 与 Artikelwörter 合并呈现。网页里会先建立 mein / dein / sein / ihr / unser 的直觉，再延伸到 welcher 和 dieser 这种“选择”和“指向”的表达。内容是重组的，但知识点覆盖保持完整。",
    focus: [
      "物主冠词的形式要跟后面的名词一起变化。",
      "welcher 用来问“哪一个”，dieser 用来指“这一个”。",
      "这两类词都像冠词一样站在名词前面。"
    ],
    tip: "不要孤立背 mein / dein，最好直接背 mein Bruder / meine Mutter / mein Kind 这种组合。",
    examples: [
      example("Das ist mein Bruder und das ist unsere Wohnung.", "这是我哥哥，这是我们的公寓。"),
      example("Welcher Bus fährt zum Bahnhof?", "哪一路公交去火车站？"),
      example("Dieser Kaffee ist für dich.", "这杯咖啡是给你的。")
    ],
    exercises: [
      choice("“这是 Anna 的书”最自然的是：", ["Das ist sein Buch.", "Das ist ihr Buch.", "Das ist unser Buch."], 1, "Anna 是女性，所以用 ihr Buch。"),
      fill("用括号里的词完成句子：___ Tasche meinst du? (welcher)", ["Welche"], "阴性名词 Tasche 前面用 Welche。"),
      fill("用括号里的词完成句子：Wir besuchen ___ Eltern am Sonntag. (unser)", ["unsere"], "复数名词 Eltern 对应 unsere。")
    ],
    en: {
      title: "Possessive Articles plus welcher and dieser",
      summary: "Learn to express ownership, selection, and pointing within one A1 topic.",
      overview: "This lesson combines the handbook chapters on possessive articles and article words such as welcher and dieser. It builds practical noun phrases for ownership, choosing, and identifying something in context."
    }
  },
  {
    id: "pronouns-cases",
    code: "A1-16",
    type: "代词",
    title: "人称代词第四格 / 第三格与 wen / wem / was",
    summary: "名词一变成代词，格的感觉要跟着一起变。",
    overview: "这一单元把手册中的 Akkusativ / Dativ 人称代词、双宾语动词和针对人 / 物的提问方式整合成一个网页主题。这样更接近日常交际流程：先知道要说谁，再决定用 ihn / ihr / ihm / ihnen 还是对应的 wen / wem / was 问句。",
    focus: [
      "sehen ihn / sie / es, helfen ihm / ihr / ihnen 这类搭配要一整块记。",
      "双宾语结构里常同时出现人和东西：Ich kaufe meinem Sohn einen Ball。",
      "问人和问物时要区分 wen / wem / was。"
    ],
    tip: "如果你能先判断是直接对象还是间接受益者，代词形式会容易很多。",
    examples: [
      example("Ich sehe Paul. Ich sehe ihn.", "我看见 Paul。我看见他。"),
      example("Ich helfe meiner Freundin. Ich helfe ihr.", "我帮助我的朋友。我帮助她。"),
      example("Wem schenkst du das Buch? - Meinem Bruder.", "你把书送给谁？- 我弟弟。")
    ],
    exercises: [
      choice("主语是 du，句子是“我帮助你”，正确代词是哪一个？", ["dich", "dir", "du"], 1, "helfen 支配第三格，所以是 dir。"),
      fill("用括号里的词完成句子：Ich sehe Anna. Ich sehe ___. (sie)", ["sie"], "sehen 后面用第四格代词。"),
      fill("用合适的疑问词填空：___ schenkst du was?", ["Wem"], "问“给谁”要用 wem。")
    ],
    en: {
      title: "Accusative and Dative Pronouns plus wen, wem, was",
      summary: "Once nouns become pronouns, the case choice becomes even more visible.",
      overview: "This lesson combines the handbook material on accusative and dative pronouns, verbs with two objects, and the question words used for people and things. It mirrors real communication by linking pronoun choice directly to sentence meaning."
    }
  },
  {
    id: "past-forms-basic",
    code: "A1-17",
    type: "时态",
    title: "过去表达入门：war / hatte 与 Perfekt mit haben",
    summary: "A1 先把最常说的过去表达搭起来，再慢慢扩展到更多动词。",
    overview: "本单元整合手册里 Präteritum: sein / haben、Perfekt mit haben 和时间使用的基础内容。网页里会先让你稳住 war / hatte，再进入“habe gemacht”这种最常见的完成时框架，并告诉你什么时候口语里更常用 Perfekt。",
    focus: [
      "sein 与 haben 在过去时里经常直接用 war / hatte。",
      "大多数普通动作在日常口语里常用 Perfekt：Ich habe gearbeitet。",
      "过去叙述里先问自己是在说“状态”，还是在说“做了什么事”。"
    ],
    tip: "描述昨天做了什么时，优先想到 Perfekt；描述过去状态时，先看能不能用 war / hatte。",
    examples: [
      example("Gestern war ich sehr müde.", "昨天我很累。"),
      example("Letztes Jahr hatten wir viel Stress.", "去年我们压力很大。"),
      example("Was hast du gestern gemacht?", "你昨天做了什么？")
    ],
    exercises: [
      choice("下面哪一句最自然地表达“昨天我很累”？", ["Gestern habe ich müde.", "Gestern war ich müde.", "Gestern bin ich müde gewesen."], 1, "A1 阶段表达过去状态最直接的是 war。"),
      fill("用括号里的词完成句子：Was ___ du gestern ___? (machen)", ["hast / gemacht", "hast gemacht"], "Perfekt 结构是 haben + Partizip II。"),
      fill("用括号里的词完成句子：Früher ___ wir wenig Zeit. (haben)", ["hatten"], "haben 的过去式是 hatte / hattest / hatte / hatten ...")
    ],
    en: {
      title: "Basic Past Expression: war, hatte, and the Perfect with haben",
      summary: "Start with the most frequent A1 ways of talking about the past.",
      overview: "This lesson merges the handbook material on the preterite of sein and haben, the perfect tense with haben, and basic tense use. Learners first stabilize forms such as war and hatte and then move into common spoken perfect-tense patterns like ich habe gemacht."
    }
  },
  {
    id: "perfect-sein-participle",
    code: "A1-18",
    type: "时态",
    title: "Perfekt mit sein 与 Partizip II",
    summary: "会不会选 haben / sein，决定了你的完成时像不像自然德语。",
    overview: "这一单元整合手册里的 Perfekt mit sein 和 Partizip Perfekt。网页里会把“运动 / 状态变化常用 sein”和“Partizip II 的基本构成”放进同一条学习线里，因为书里这两块本来就是互相支撑的。",
    focus: [
      "很多表示移动和状态变化的动词在 Perfekt 中用 sein。",
      "Partizip II 常见形式有 ge- + 词干 + -t / -en。",
      "不规则动词的 Partizip 要高频复现，不要只靠规则推。"
    ],
    tip: "做 Perfekt 题时先判断动词意义，再决定辅助动词，最后才去想 Partizip 形式。",
    examples: [
      example("Ich bin heute spät gekommen.", "我今天来晚了。"),
      example("Wir sind nach Hause gefahren.", "我们开车回家了。"),
      example("Er hat das Fenster geöffnet.", "他把窗户打开了。")
    ],
    exercises: [
      choice("像 kommen 这样的移动类动词，在完成时中常用哪个助动词？", ["haben", "sein", "werden"], 1, "kommen 通常和 sein 连用：ich bin gekommen。"),
      fill("用括号里的词完成句子：Wir sind spät ___. (ankommen)", ["angekommen"], "ankommen 的 Partizip II 是 angekommen。"),
      fill("用括号里的词完成句子：Ich habe das Buch ___. (kaufen)", ["gekauft"], "规则动词 kaufen 的 Partizip II 是 gekauft。")
    ],
    en: {
      title: "The Perfect with sein and the Past Participle",
      summary: "Choosing the right auxiliary is a major step toward natural A1 past tense.",
      overview: "This lesson combines the handbook chapters on the perfect with sein and on the formation of Partizip II. It keeps the focus on movement and change-of-state verbs with sein while also training the most common past participle patterns."
    }
  },
  {
    id: "reflexive-verbs-a1",
    code: "A1-19",
    type: "动词",
    title: "反身动词与基本反身代词",
    summary: "A1 反身结构要先学“自己做在自己身上”的感觉，再背代词。",
    overview: "本单元依据手册里的 reflexive verbs 内容重组。网页里先讲 sich waschen / sich freuen 这类最常见结构，再带到 wir treffen uns 这种互相动作。重点不在术语，而在把反身代词和主语正确配对。",
    focus: [
      "ich freue mich, du freust dich, er freut sich 这一组要整体熟悉。",
      "反身代词会跟主语变化。",
      "有些句子是“互相”，如 Wir treffen uns。"
    ],
    tip: "见到反身动词时，不要只看动词本体，要连同 sich / mich / dich 一起识别。",
    examples: [
      example("Ich wasche mich jeden Morgen kalt.", "我每天早上洗冷水澡。"),
      example("Er interessiert sich für Musik.", "他对音乐感兴趣。"),
      example("Wir treffen uns um acht Uhr vor dem Kino.", "我们八点在电影院前见面。")
    ],
    exercises: [
      choice("主语是 ich 时，正确的反身代词是哪一个？", ["mir", "mich", "dich"], 1, "A1 常见反身结构里 ich 对应 mich。"),
      fill("用括号里的词完成句子：Wir treffen ___ um 8 Uhr. (uns)", ["uns"], "主语是 wir，所以反身代词是 uns。"),
      fill("用括号里的词完成句子：Du ___ dich schnell. (waschen)", ["wäschst", "waschst"], "主语 du 时动词要变位，反身代词保留。")
    ],
    en: {
      title: "Reflexive Verbs and Basic Reflexive Pronouns",
      summary: "At A1, reflexive verbs are best learned as subject plus reflexive form together.",
      overview: "This lesson is based on the handbook chapter on reflexive verbs. It introduces frequent patterns such as sich waschen and sich freuen and then links them to reciprocal expressions like wir treffen uns so learners can match the correct reflexive pronoun to the subject."
    }
  },
  {
    id: "temporal-prepositions",
    code: "A1-20",
    type: "介词",
    title: "时间介词：im, am, um, von ... bis, nach, vor, seit, ab",
    summary: "A1 时间表达要和“什么时候、从何时到何时、多久以来”连起来学。",
    overview: "这一单元对应手册里的 temporale Präpositionen。网页里会按时间维度整理：钟点、星期日期、月份季节、区间、先后和起点。这样比单纯罗列介词更符合实际使用，也更完整地覆盖原书 A1 内容。",
    focus: [
      "um 常接钟点，am 常接星期和具体日期，im 常接月份和季节。",
      "von ... bis 描述时间区间，seit 表示“从过去开始到现在”。",
      "nach / vor 常用来表示前后顺序：nach dem Essen, vor dem Kurs。"
    ],
    tip: "如果你先判断自己在说“时点、日期、区间还是起点”，介词会更容易选。",
    examples: [
      example("Der Kurs beginnt um neun Uhr.", "课程九点开始。"),
      example("Am Montag arbeite ich im Büro.", "周一我在办公室工作。"),
      example("Seit einem Jahr wohne ich in Köln.", "我住在科隆已经一年了。")
    ],
    exercises: [
      choice("正确的一组是：", ["um 8 Uhr - am Montag - im Juli", "am 8 Uhr - im Montag - um Juli", "im 8 Uhr - an Montag - am Juli"], 0, "钟点、星期、月份分别要用 um / am / im。"),
      fill("用括号里的词完成句子：___ dem Essen trinke ich Kaffee. (nach)", ["Nach"], "表示“饭后”用 nach dem Essen。"),
      fill("用括号里的词完成句子：Ich lerne Deutsch ___ zwei Jahren. (seit)", ["seit"], "从过去持续到现在要用 seit。")
    ],
    en: {
      title: "Time Prepositions: im, am, um, von ... bis, nach, vor, seit, ab",
      summary: "Link each time preposition to the kind of time expression it normally introduces.",
      overview: "This lesson follows the handbook chapter on temporal prepositions. It groups the forms by function: clock time, weekdays and dates, months and seasons, time spans, sequence, and starting point, which makes the full A1 system easier to use."
    }
  },
  {
    id: "dative-prepositions",
    code: "A1-21",
    type: "介词",
    title: "固定第三格介词：aus, bei, mit, nach, seit, von, zu",
    summary: "这些介词最值得练的不是翻译，而是和 Dativ 的稳定连用。",
    overview: "这一单元对应书里 Präpositionen mit Dativ。网页里会按使用场景整理：来源、地点、陪同、交通方式、方向、起点和时间延续，并反复强化“这些介词后面稳定用第三格”的感觉。",
    focus: [
      "aus / von 常和来源、出处连用。",
      "mit 表示伴随、工具、交通方式，zu 常表示去某人那儿或去某活动。",
      "这组介词最大的学习重点是“意义 + 第三格形式”一起出现。"
    ],
    tip: "把介词和一个高频小短语捆着记，比如 mit dem Bus、zu Hause、bei meiner Freundin。",
    examples: [
      example("Ich komme aus Italien und arbeite bei Siemens.", "我来自意大利，在西门子工作。"),
      example("Wir fahren mit dem Zug nach Bonn.", "我们坐火车去波恩。"),
      example("Heute gehen wir zu unseren Freunden.", "今天我们去朋友家。")
    ],
    exercises: [
      choice("下面哪一组都通常要求第三格？", ["mit - zu - bei", "für - ohne - gegen", "durch - um - an"], 0, "mit / zu / bei 都稳定接 Dativ。"),
      fill("用括号里的词完成句子：Ich fahre ___ Zug zur Arbeit. (mit)", ["mit dem"], "mit 后要接第三格：mit dem Zug。"),
      fill("用括号里的词完成句子：Wir gehen heute ___ Freundin. (zu, eine)", ["zu einer"], "zu 后面用 Dativ：zu einer Freundin。")
    ],
    en: {
      title: "Dative Prepositions: aus, bei, mit, nach, seit, von, zu",
      summary: "These prepositions are best learned as meaning plus dative form together.",
      overview: "This lesson is based on the handbook chapter on dative prepositions. It organizes the forms by function such as origin, place, company, transport, direction, and time span while continuously reinforcing that these prepositions regularly take the dative."
    }
  },
  {
    id: "accusative-prepositions",
    code: "A1-22",
    type: "介词",
    title: "固定第四格介词：für, um, durch, ohne, gegen",
    summary: "A1 的 FUDOG 最好直接当成一个整体记住。",
    overview: "这一单元对应书里 Präpositionen mit Akkusativ。网页里保留原书最实用的学习方式：把 für, um, durch, ohne, gegen 作为稳定支配第四格的一组来练，不用每次都临时判断。这样做尤其适合初学者。",
    focus: [
      "für, um, durch, ohne, gegen 后面固定接 Akkusativ。",
      "这组介词常出现在方向、目的、缺失、反对和围绕等表达里。",
      "如果后面是阳性名词，冠词变化会更加明显。"
    ],
    tip: "把 FUDOG 当成固定套组记住，做题时会快很多。",
    examples: [
      example("Das Geschenk ist für dich.", "这个礼物是给你的。"),
      example("Wir laufen durch den Park.", "我们穿过公园。"),
      example("Ich trinke Kaffee ohne Zucker.", "我喝不加糖的咖啡。")
    ],
    exercises: [
      choice("下面哪一组通常都支配第四格？", ["für - ohne - gegen", "mit - zu - bei", "aus - nach - von"], 0, "FUDOG 都要求 Akkusativ。"),
      fill("用括号里的词完成句子：Der Schal ist ___ Bruder. (für, mein)", ["für meinen"], "für 后要接第四格：für meinen Bruder。"),
      fill("用括号里的词完成句子：Wir gehen ___ Park. (durch, der)", ["durch den"], "阳性名词 Park 在第四格里是 den Park。")
    ],
    en: {
      title: "Accusative Prepositions: für, um, durch, ohne, gegen",
      summary: "Treat the FUDOG group as one reliable accusative pattern.",
      overview: "This lesson follows the handbook chapter on accusative prepositions. It keeps the practical handbook strategy of learning für, um, durch, ohne, and gegen as a stable group that regularly takes the accusative."
    }
  },
  {
    id: "local-prepositions",
    code: "A1-23",
    type: "介词",
    title: "地点与方向：wo / wohin / woher，wechselnde Präpositionen",
    summary: "A1 地点表达真正的难点，是把“在哪儿、去哪儿、从哪儿来”彻底分开。",
    overview: "这一单元把手册中 Wechselpräpositionen、lokale Präpositionen 的 wo / wohin / woher 相关章节合并成一个完整网页主题。网页里会把静态位置、方向移动和来源出口并列起来学，同时保留 in / an / auf / zu / nach / aus / von 之间的差别。",
    focus: [
      "wo 常对应静态位置，多和 Dativ 连用。",
      "wohin 表示方向，多和 Akkusativ 或固定方向介词结构连用。",
      "woher 表示来源，常见搭配是 aus / von。"
    ],
    tip: "先判断句子在回答 wo、wohin 还是 woher，再选介词和格，错误会少很多。",
    examples: [
      example("Ich bin im Kino, aber meine Freunde gehen ins Kino.", "我在电影院，但我的朋友们正去电影院。"),
      example("Wir fahren am Wochenende an den See.", "我们周末去湖边。"),
      example("Ich komme gerade vom Arzt und aus der Stadt.", "我刚从医生那里和城里回来。")
    ],
    exercises: [
      choice("正确的一组是：", ["im Kino = wo, ins Kino = wohin", "ins Kino = wo, im Kino = wohin", "vom Kino = wohin"], 0, "静态位置和方向移动要区分。"),
      fill("用括号里的词完成句子：Heute Abend gehen wir ___ Kino. (in, das)", ["ins"], "表示去向时用 Akkusativ：ins Kino。"),
      fill("用括号里的词完成句子：Ich komme gerade ___ Arzt. (von, der)", ["vom"], "表示从人或固定活动地点回来时常用 von：vom Arzt。")
    ],
    en: {
      title: "Location and Direction: wo, wohin, woher, and Two-Way Prepositions",
      summary: "Separate location, destination, and origin before choosing the form.",
      overview: "This lesson merges the handbook material on two-way prepositions and local prepositions for wo, wohin, and woher. It contrasts static location, movement toward a destination, and movement away from a place while training the most useful forms such as in, an, auf, zu, nach, aus, and von."
    }
  },
  {
    id: "adjective-endings-a1",
    code: "A1-24",
    type: "形容词",
    title: "形容词词尾：Nominativ / Akkusativ / Dativ 基础",
    summary: "A1 先别追求完整术语体系，先把最常见的词尾信号看出来。",
    overview: "这一单元整合手册里两个 Adjektivdeklination 章节的 A1 核心部分。网页里不照搬原表格，而是保留书里的核心观察：形容词在名词前要带词尾，Akkusativ 阳性和 Dativ 是最值得优先记住的信号位置。同时加入 am + Datum 这类高频日期表达。",
    focus: [
      "形容词在名词前面时通常需要词尾，放在系动词后时则通常不变：Der Mann ist nett。",
      "阳性第四格和第三格最容易出现 -en 信号。",
      "看冠词和形容词谁承担了“信号”，比死记整张表更实用。"
    ],
    tip: "看到 dem / den / einem 这些形式时，先试着给后面的形容词也补一个 -en。",
    examples: [
      example("Das ist ein netter Mann.", "这是一个友善的男人。"),
      example("Ich sehe den netten Mann.", "我看见那位友善的男人。"),
      example("Ich spreche mit einer netten Lehrerin.", "我在和一位友善的女老师说话。")
    ],
    exercises: [
      choice("正确的一组是：", ["ein netter Mann - den netten Mann", "ein nette Mann - den nette Mann", "ein nettes Mann - den nettes Mann"], 0, "阳性名词前，形容词词尾要跟着冠词结构变化。"),
      fill("用括号里的词完成句子：Ich spreche mit einem neu___ Lehrer. (neu)", ["neuen"], "Dativ 里 einem 后面常见形容词 -en。"),
      fill("用括号里的词完成句子：Wir kaufen eine schön___ Tasche. (schön)", ["schöne"], "阴性单数 Akkusativ 常见 schöne Tasche。")
    ],
    en: {
      title: "Adjective Endings: Basic Nominative, Accusative, and Dative Patterns",
      summary: "At A1, focus on the clearest adjective-ending signals instead of the full abstract system.",
      overview: "This lesson reorganizes the core A1 material from the handbook chapters on adjective declension. It highlights the most important patterns, especially masculine accusative and the dative endings, and helps learners notice where the grammatical signal is carried by the article and where it is carried by the adjective."
    }
  },
  {
    id: "comparison-basic",
    code: "A1-25",
    type: "形容词",
    title: "比较级与最高级：als, wie, am ... -sten",
    summary: "A1 的比较句式要同时练形式和比较逻辑。",
    overview: "本单元把手册里的 Komparativ und Vergleichssätze 与 Superlativ 合并。网页里会先做比较级和 wie / als 对比，再进入 am ... -sten 和定语最高级。这样既保持书里的推进顺序，也更适合在线练习。",
    focus: [
      "比较级通常加 -er，部分形容词会发生 Umlaut。",
      "同等比较常用 so ... wie，不同程度比较常用 ... als。",
      "最高级常见 am schnellsten，也能出现在名词前：der schnellste Zug。"
    ],
    tip: "看到两个对象时先问自己：是在说“一样”，还是在说“更……”，再决定用 wie 还是 als。",
    examples: [
      example("Mein Fahrrad ist schneller als dein Fahrrad.", "我的自行车比你的快。"),
      example("Anna spricht genauso ruhig wie ihre Mutter.", "Anna 说话和她妈妈一样平静。"),
      example("Von allen läuft Paul am schnellsten.", "所有人里 Paul 跑得最快。")
    ],
    exercises: [
      choice("形容词 groß 的比较级是哪个？", ["größer", "größte", "mehr groß"], 0, "groß 的比较级是 größer。"),
      fill("用括号里的词完成句子：Heute ist es wärmer ___ gestern. (als / wie)", ["als"], "不同程度比较用 als。"),
      fill("用括号里的词完成句子：Von allen Kindern rennt Mia am ___. (schnell)", ["schnellsten"], "最高级副词结构是 am + 形容词 + -sten。")
    ],
    en: {
      title: "Comparative and Superlative: als, wie, am ... -sten",
      summary: "Train both the forms and the comparison logic at the same time.",
      overview: "This lesson merges the handbook chapters on the comparative, comparison sentences, and the superlative. It moves from basic -er forms and the contrast between wie and als to superlative patterns such as am schnellsten and attributive superlatives."
    }
  },
  {
    id: "sentence-connectors-a1",
    code: "A1-26",
    type: "连接词",
    title: "句子连接：und / aber / oder / denn，deshalb，以及 weil / wenn / dass 入门",
    summary: "A1 连接句子时，最关键的是知道动词位置会不会变化。",
    overview: "这一单元整合手册里 Hauptsätze verbinden 和基础 Nebensätze。网页里先讲不改主句语序的 und / aber / oder / denn，再讲 deshalb / dann 这类占位词，最后再引入 weil / wenn / dass 从句的句末动词。这样能保留书里的完整思路，但更利于逐步消化。",
    focus: [
      "并列连接词后仍是普通主句语序。",
      "deshalb / dann 常占据第一位，动词仍然在第二位。",
      "weil / wenn / dass 引导从句时，变位动词通常去句末。"
    ],
    tip: "一旦看到 weil / wenn / dass，就先往句末找动词；看到 und / aber / oder / denn，就继续按主句想。",
    examples: [
      example("Ich lerne Deutsch, aber mein Bruder lernt Englisch.", "我学德语，但我弟弟学英语。"),
      example("Es regnet, deshalb bleiben wir zu Hause.", "下雨了，所以我们待在家里。"),
      example("Ich bleibe zu Hause, weil ich krank bin.", "我待在家里，因为我病了。")
    ],
    exercises: [
      choice("下面哪一句的 weil 从句语序正确？", ["Ich bleibe zu Hause, weil ich bin krank.", "Ich bleibe zu Hause, weil krank ich bin.", "Ich bleibe zu Hause, weil ich krank bin."], 2, "weil 从句里变位动词通常在句末。"),
      fill("用 deshalb 连接：Es regnet. Ich nehme den Bus.", ["Es regnet, deshalb nehme ich den Bus", "Es regnet. Deshalb nehme ich den Bus"], "deshalb 占位后，主句动词仍在第二位。"),
      fill("用 and 合并句子：Ich koche. Meine Schwester deckt den Tisch.", ["Ich koche und meine Schwester deckt den Tisch"], "und 连接两个主句时，后面仍保持普通主句语序。")
    ],
    en: {
      title: "Connecting Sentences: und, aber, oder, denn, deshalb, and Basic weil/wenn/dass",
      summary: "The key A1 skill is knowing whether the verb position changes or stays the same.",
      overview: "This lesson merges the handbook chapters on coordinating sentence connections and basic subordinate clauses. It contrasts connectors that keep normal main-clause word order with forms such as deshalb and with subordinate-clause markers like weil, wenn, and dass that push the finite verb to the end."
    }
  },
  {
    id: "word-building-a1",
    code: "A1-27",
    type: "词汇",
    title: "A1 构词：复合词、组合动词、词性线索与常见小品词",
    summary: "手册后半段的 A1 内容不是附加项，而是帮助你“看懂新词”的钥匙。",
    overview: "这一单元整合书里 Kinderarzt oder Arztkinder、zusammengesetzte Verben、Genusregeln、Partikeln 和基础 Wortbildung。网页不照搬原书页码，而是把这些内容重新组织成“怎么看懂陌生词、怎么看懂小词”的主题：复合词看最后一个词，组合动词看整体意思，词尾和前后缀帮助猜词性，doch / denn / mal 等小词帮助理解语气。",
    focus: [
      "复合词的核心通常在最后一个词，冠词也跟最后一个词走。",
      "一些高频组合动词和状态表达在口语里非常常见，如 weg sein, an sein, dabei haben。",
      "词缀和小品词不会一下子全部学会，但 A1 要开始建立识别意识。"
    ],
    tip: "遇到长词先不要慌，先从最后一个部分找基本意思和冠词，再往前补信息。",
    examples: [
      example("Kinderarzt, Sonnenschirm und Haustür sind typische Komposita.", "Kinderarzt、Sonnenschirm 和 Haustür 都是典型复合词。"),
      example("Mein Handy ist weg, aber die Dokumente habe ich dabei.", "我的手机不见了，但文件我带着。"),
      example("Dieses kleine Wort denn macht die Frage oft freundlicher.", "这个小词 denn 常常会让问句更自然。")
    ],
    exercises: [
      choice("复合词 Sonnenschirm 的冠词跟哪个部分走？", ["Sonne", "Schirm", "两个都可以"], 1, "复合词的冠词通常跟最后一个词：der Schirm → der Sonnenschirm。"),
      choice("“我把文件带着了”最自然的是：", ["Ich bin die Dokumente.", "Ich habe die Dokumente dabei.", "Ich mache die Dokumente an."], 1, "dabei haben 是常见组合表达。"),
      fill("用括号里的词完成句子：Der Bildschirm ist aus. Jetzt ist er nicht mehr ___. (an)", ["an"], "an sein / aus sein 是高频状态表达。")
    ],
    en: {
      title: "A1 Word Building: Compounds, Combined Verbs, Gender Clues, and Small Particles",
      summary: "The later A1 handbook chapters help learners decode unfamiliar words and everyday small words.",
      overview: "This lesson reorganizes the handbook content on compounds, combined verbs, gender clues, particles, and basic word formation into one practical theme: how to understand unfamiliar vocabulary. Learners practice reading the last element of a compound, recognizing common combined verbs, and noticing the role of small particles such as denn or mal."
    }
  },
  {
    id: "negation-and-local-adverbs",
    code: "A1-28",
    type: "语法",
    title: "否定词与地点副词：nicht / nichts / noch nicht / nicht mehr；oben / nach oben，da / dorthin",
    summary: "A1 末段最容易混的，往往就是这些很短但很关键的小词。",
    overview: "这一单元整合手册里的 Negationswörter 和 lokale Adverbien。网页里会把否定体系和地点副词放在一起，是因为它们都属于“短词但高频、意义靠语境变化”的部分。你会在这里系统区分 nicht、nichts、noch nicht、nicht mehr，也会区分 oben / nach oben、da / dahin / dort / dorthin。",
    focus: [
      "nicht 否定句子成分，nichts 是代词，noch nicht 表示“还没”，nicht mehr 表示“不再”。",
      "oben / unten / vorn / hinten 等表示位置；nach oben / nach unten 等表示方向。",
      "da / dort 指位置，dahin / dorthin 指方向。"
    ],
    tip: "这些短词不要硬翻成中文后再决定，最好直接跟场景绑定：状态、方向、未发生、不再发生。",
    examples: [
      example("Ich habe noch nicht gegessen, aber ich habe keinen Hunger mehr.", "我还没吃饭，但我已经不饿了。"),
      example("Ich bin oben. Komm bitte auch nach oben.", "我在上面。你也上来吧。"),
      example("Warst du schon in Bern? - Nein, ich war noch nicht dort, aber ich möchte dorthin fahren.", "你去过伯尔尼吗？- 还没有，但我想去那儿。")
    ],
    exercises: [
      choice("正确的一组是：", ["noch nicht = 还没；nicht mehr = 不再", "noch nicht = 不再；nicht mehr = 还没", "nichts = 不再"], 0, "noch nicht 和 nicht mehr 的时间感觉正好不同。"),
      fill("用括号里的词完成句子：Ich bin oben. Komm auch nach ___. (oben)", ["oben"], "方向表达常用 nach oben。"),
      fill("用括号里的词完成句子：Ich war noch nie in Wien, aber ich möchte ___ fahren. (dorthin)", ["dorthin", "dahin"], "表示“去那里”要用方向副词 dorthin / dahin。")
    ],
    en: {
      title: "Negation Words and Local Adverbs: nicht, nichts, noch nicht, nicht mehr, oben, dorthin",
      summary: "The shortest A1 words often create the biggest confusion, so they need focused practice.",
      overview: "This lesson combines the handbook chapters on negation words and local adverbs. It helps learners separate nicht, nichts, noch nicht, and nicht mehr and then contrasts position and direction forms such as oben and nach oben or da and dorthin."
    }
  }
];

const a1Enrichment = {
  "personal-pronouns": {
    overview: "教材里这一课还特别强调了代词之间的组合关系，如 ich + du = wir，du + du = ihr，er + sie + es = sie。网页版把这些组合逻辑也一并吸收进练习里，帮助你更快从“单个代词”过渡到“句中代词”。",
    focus: [
      "人称代词既可以指人，也可以指物，所以要把名词词性和代词选择连起来记。",
      "du 和 Sie 都表示“你”，但正式程度完全不同；对应的动词形式也不同。",
      "复数人称代词最常出错的是 ihr 和 sie / Sie，需要在情境里反复区分。"
    ],
    examples: [
      example("Marc und Dominic wohnen in Köln. Sie lernen dort Deutsch.", "Marc 和 Dominic 住在科隆。他们在那里学德语。"),
      example("Wo ist die Gabel? Sie liegt neben dem Teller.", "叉子在哪里？它在盘子旁边。"),
      example("Hallo Anna, kommst du heute? - Ja, ich komme später.", "Anna，你今天来吗？- 来，我晚一点到。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Herr und Frau Keller kommen aus Bern. ___ lernen jetzt in Hamburg. (sie)", ["Sie", "sie"], "如果是普通第三人称复数可写 sie；句首大写时也会写 Sie。"),
      fill("用括号里的词完成句子：Peter und ich lernen zusammen. ___ wohnen auch zusammen. (wir)", ["Wir"], "Peter und ich 合起来用 wir。"),
      choice("正确的一组是：", ["du + du = ihr", "du + du = wir", "Sie + Sie = ihr"], 0, "教材里把这些组合关系作为基础代词感的一部分反复训练。")
    ]
  },
  "present-tense": {
    overview: "书里除了普通规则变位，还覆盖了词干以 -t / -d、-s / -ß / -z 结尾时的特殊词尾变化。网页版把这些常见变位细节也加进来了，这样你不会只会最基础的一种模式。",
    focus: [
      "词干以 -t 或 -d 结尾时，du / ihr 形式常多一个辅助元音：du arbeitest, ihr arbeitet。",
      "词干以 -s / -ß / -z 结尾时，du 形式常只有 -t：du heißt, du tanzt。",
      "现在时不仅用来表示“现在”，也常表示日常习惯和固定安排。"
    ],
    examples: [
      example("Du arbeitest heute sehr lange im Büro.", "你今天在办公室工作很久。"),
      example("Wie heißt du eigentlich?", "你到底叫什么名字？"),
      example("Unser Kurs beginnt immer um halb neun.", "我们的课总是在八点半开始。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Ihr ___ sehr früh. (arbeiten)", ["arbeitet"], "arbeiten 的 ihr 形式是 arbeitet。"),
      fill("用括号里的词完成句子：Wie ___ du? (heißen)", ["heißt", "heisst"], "heißen 的 du 形式常见为 heißt。"),
      choice("正确的一组是：", ["du arbeitest - ihr arbeitet", "du arbeitst - ihr arbeit", "du arbeitest - ihr arbeit"], 0, "词干以 -t 结尾时要注意额外的 -e-。")
    ]
  },
  "sein-haben-special-verbs": {
    overview: "教材在这一部分还安排了 mögen、möchten、wissen 和 tun 的使用场景。网页里因此加入了“礼貌愿望、知道信息、身体哪里痛、做什么”等高频情境，让这一单元更接近日常交流。",
    focus: [
      "mögen 常表示一般喜好，möchten 更常用来礼貌表达愿望。",
      "wissen 常接从句或疑问信息：Ich weiß, wo ... / Weißt du, wann ...?",
      "tun 在 A1 里很常见于 Was tust du? / Was tut weh? 这类口语句型。"
    ],
    examples: [
      example("Ich mag Kaffee, aber heute möchte ich lieber Tee.", "我喜欢咖啡，但今天我更想喝茶。"),
      example("Was tut dir weh? - Mein Rücken tut weh.", "你哪里疼？- 我的背疼。"),
      example("Niemand weiß, wann der Bus kommt.", "没人知道公交什么时候来。")
    ],
    exercises: [
      choice("哪一句更礼貌地表达点单愿望？", ["Ich will einen Kaffee.", "Ich möchte einen Kaffee.", "Ich mag einen Kaffee."], 1, "教材明确区分了 möchten 和更直接的 wollen。"),
      fill("用括号里的词完成句子：Was ___ dir weh? (tun)", ["tut"], "固定说法是 Was tut dir weh?"),
      fill("用括号里的词完成句子：Wir ___ nicht, ob er heute kommt. (wissen)", ["wissen"], "wir 对应 wissen。")
    ]
  },
  "modal-verbs": {
    overview: "教材把情态动词拆成“变位与位置”“意义 1”“意义 2”三步来练。网页版也把这些细节并进一个单元里，包括礼貌请求、规定、允许、建议和个人愿望的差别。",
    focus: [
      "können 常表示能力或可能性，也常用在礼貌请求里。",
      "sollen 常带有“别人希望 / 建议 / 规定你这么做”的意思。",
      "当语境已经很明确时，句末的不定式在口语里有时可以省略。"
    ],
    examples: [
      example("Kannst du mir bitte helfen?", "你能帮帮我吗？"),
      example("Du sollst morgen den Arzt anrufen.", "你明天应该给医生打电话。"),
      example("Hier darf man nicht rauchen.", "这里不允许吸烟。")
    ],
    exercises: [
      choice("“你应该多睡一点”最自然的是：", ["Du musst mehr schlafen.", "Du sollst mehr schlafen.", "Du darfst mehr schlafen."], 1, "如果是建议或别人提出的要求，教材更强调 sollen。"),
      fill("用括号里的词完成句子：Hier ___ man parken. (dürfen)", ["darf"], "表示被允许时用 dürfen。"),
      fill("用括号里的词完成句子：___ ihr heute Abend kommen? (können)", ["Könnt"], "ihr 对应 könnt。")
    ]
  },
  "separable-verbs-a1": {
    overview: "教材除了讲分离规则，还特别强调可分前缀的重音，以及常见前缀如 ab-, an-, auf-, aus-, ein-, mit-, vor-, zurück-。网页版在例句和练习里把这些前缀分散带入，不只围绕一个动词反复做。",
    focus: [
      "可分动词的重音通常落在前缀上，这也是判断是否可分的重要线索。",
      "主句里前缀跑到句末，但在从句里整个动词一起放到句末。",
      "和情态动词连用时，整个可分动词以不定式形式留在句末。"
    ],
    examples: [
      example("Der Kurs fängt um neun Uhr an.", "课程九点开始。"),
      example("Ich rufe dich heute Abend zurück.", "我今晚给你回电话。"),
      example("Weil der Laden um acht Uhr zumacht, gehen wir jetzt los.", "因为商店八点关门，我们现在就出发。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Der Zug ___ um 7 Uhr ___. (abfahren)", ["fährt / ab", "fährt ab"], "主句里可分动词拆开。"),
      fill("用括号里的词完成句子：Ich bleibe zu Hause, weil ich früh ___. (aufstehen)", ["aufstehe"], "从句里整个动词放句末，不分开。"),
      choice("下面哪一句是正确的？", ["Ich möchte heute Abend anrufen dich.", "Ich möchte dich heute Abend anrufen.", "Ich anrufe dich heute Abend."], 1, "情态动词后面 anrufen 作为不定式留在句末。")
    ]
  },
  "imperative": {
    overview: "教材里还专门练了规则动词、不规则动词和可分动词的命令式形式，并提醒用 bitte 可以让命令语气更自然。网页版把这些点也合并进来了。",
    focus: [
      "du 命令式里通常没有主语，很多时候也省掉词尾 -st。",
      "不规则动词里常见的元音变化不一定都保留到命令式，要单独熟悉高频形式。",
      "可分动词的命令式仍会把前缀放到句末：Ruf mich an!"
    ],
    examples: [
      example("Nimm bitte noch ein Stück Kuchen.", "请再拿一块蛋糕。"),
      example("Seid bitte pünktlich!", "请准时！"),
      example("Räum dein Zimmer auf!", "把你的房间整理好！")
    ],
    exercises: [
      fill("用括号里的词完成句子：___ das Fenster ___. (zumachen, du)", ["Mach / zu", "Mach zu"], "可分动词命令式仍保留前缀在句末。"),
      choice("对多个人说“请坐下！”最自然的是：", ["Setz dich bitte!", "Setzt euch bitte!", "Setzen Sie sich bitte!"], 1, "对熟悉的复数对象用 ihr 形式。"),
      fill("用括号里的词完成句子：___ Sie bitte kurz. (warten)", ["Warten"], "Sie-Imperativ 用原形 + Sie。")
    ]
  },
  "question-words": {
    overview: "教材里这部分不仅是单独认问词，还会把问词放回具体场景里，例如问职业、住址、来源、时间和原因。网页版因此加入了更多场景化例句，而不只是词汇对照。",
    focus: [
      "wer 常常要求回答人名或人物身份；was 常用来问事情、对象和动作内容。",
      "wo / wohin / woher 三组地点问词要和地点介词一起连起来练。",
      "wie 还能问状态、方式和拼写，如 Wie geht's? / Wie schreibt man das?"
    ],
    examples: [
      example("Wie heißt dein Lehrer?", "你的老师叫什么名字？"),
      example("Wann beginnt der Deutschkurs?", "德语课什么时候开始？"),
      example("Warum bist du heute zu Hause?", "你今天为什么在家？")
    ],
    exercises: [
      fill("用合适的疑问词填空：___ geht es dir heute?", ["Wie"], "询问状态常用 wie。"),
      fill("用合适的疑问词填空：___ beginnt der Film? - Um 20 Uhr.", ["Wann"], "询问时间点用 wann。"),
      choice("哪一句最自然地询问“你叫什么名字？”", ["Was heißt du?", "Wie heißt du?", "Wer heißt du?"], 1, "教材把 wie heißt du 作为最基础的自我介绍问句。")
    ]
  },
  "questions": {
    overview: "教材在这部分还穿插了礼貌问句，如 Würden Sie ...? / Könnten Sie ...? 这样的表达。网页版在基础问句之外，也加入了几道更接近日常交流的礼貌提问练习。",
    focus: [
      "一般疑问句里主语通常在动词后面，不要保留陈述句顺序。",
      "礼貌问句虽然比 A1 基础略难，但在服务、课堂和公共场所很常见。",
      "回答一般疑问句时，最自然的是先给 ja / nein / doch，再补全信息。"
    ],
    examples: [
      example("Haben Sie heute Abend Zeit?", "您今晚有时间吗？"),
      example("Könnten Sie mir bitte helfen?", "您能帮帮我吗？"),
      example("Ist das nicht zu teuer? - Doch, ein bisschen.", "这个不太贵吗？- 不，还是有点贵。")
    ],
    exercises: [
      fill("把句子改成一般疑问句：Du hast heute Unterricht.", ["Hast du heute Unterricht?"], "把变位动词 hast 提到句首。"),
      choice("更礼貌的问法是：", ["Geben Sie mir Wasser?", "Könnten Sie mir bitte Wasser geben?", "Sie geben mir Wasser?"], 1, "教材在问句部分已经引入更礼貌的服务场景表达。"),
      fill("用 ja / nein / doch 回答：Hast du kein Handy?", ["Doch"], "如果要反驳否定问句，常用 doch。")
    ]
  },
  "statement-word-order": {
    overview: "教材这部分会反复把时间、地点、方式等成分挪到句首训练，核心目的是让学习者真正形成“动词永远守第二位”的直觉。网页版增加了更多前场变换句型和纠错题。",
    focus: [
      "第一位只能有一个完整成分，这个成分本身可以很长。",
      "时间信息尤其爱放在句首，但无论谁在前面，变位动词都不动摇。",
      "德语语序训练非常适合做改错和重排练习，教材也反复这么设计。"
    ],
    examples: [
      example("Am Samstag kaufe ich auf dem Markt Gemüse.", "周六我在市场买蔬菜。"),
      example("In Berlin arbeitet meine Schwester als Ärztin.", "我姐姐在柏林当医生。"),
      example("Heute Nachmittag treffe ich meine Kollegin im Café.", "今天下午我在咖啡馆见同事。")
    ],
    exercises: [
      fill("按正确语序写句子：im Sommer / wir / oft / ans Meer / fahren", ["Im Sommer fahren wir oft ans Meer"], "时间成分前置后，动词 fahren 仍占第二位。"),
      choice("错误句子是：", ["Morgen beginnt der Kurs um neun Uhr.", "Um neun Uhr beginnt morgen der Kurs.", "Morgen der Kurs beginnt um neun Uhr."], 2, "第三句把动词挤到了第三位。"),
      fill("改正错误：Heute ich habe keine Zeit.", ["Heute habe ich keine Zeit"], "句首有 Heute 时，habe 必须去第二位。")
    ]
  },
  "sentence-bracket": {
    overview: "教材把“第二位 + 句末”看成德语句子的两个固定位置。网页版把这个句框概念再做厚一点，加入了固定搭配、形容词补足语和过去时框架，让你更容易识别整句骨架。",
    focus: [
      "sein + 形容词、Verb + Verb、名词-动词搭配也常呈现类似句框的效果。",
      "Perfekt、情态动词和可分动词是 A1 最典型的三种句框。",
      "只要先找到第二位和句末，很多长句都会容易拆开。"
    ],
    examples: [
      example("Heute Abend bin ich zu müde zum Lernen.", "今晚我太累，学不动。"),
      example("Am Wochenende gehen wir oft spazieren.", "周末我们经常去散步。"),
      example("Ich habe gestern lange ferngesehen.", "我昨天看电视看了很久。")
    ],
    exercises: [
      choice("最能体现句框的一句是：", ["Ich habe gestern lange gearbeitet.", "Ich gestern habe lange gearbeitet.", "Gestern ich habe lange gearbeitet."], 0, "habe 在前、gearbeitet 在后，形成典型句框。"),
      fill("按正确语序写句子：heute Abend / wir / fernsehen / wollen", ["Heute Abend wollen wir fernsehen"], "wollen 占第二位，fernsehen 留在句末。"),
      fill("用括号里的词完成句子：Am Samstag ___ wir einkaufen ___. (gehen)", ["gehen", "gehen"], "gehen + einkaufen 形成前后呼应的句框感。")
    ]
  },
  "plural-nouns": {
    overview: "教材里的复数部分不只是在讲词尾，还通过大量配图和分类让学习者意识到：复数形式必须和名词一起记。网页版于是把高频复数类型、复数冠词和数字表达一起补强了。",
    focus: [
      "很多复数形式会加 -e / -er / -n / -s，也有完全不变的形式。",
      "复数名词前的定冠词永远是 die，这一点比词尾还更值得先记牢。",
      "看到 zwei、drei、viele 这类数量词时，要立刻准备好复数。"
    ],
    examples: [
      example("Die Frauen sprechen mit den Kindern.", "女人们在和孩子们说话。"),
      example("Im Kurs sitzen viele Studenten und Studentinnen.", "教室里坐着很多男学生和女学生。"),
      example("Wir kaufen drei Tomaten, zwei Brote und vier Eier.", "我们买三个西红柿、两块面包和四个鸡蛋。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Auf dem Tisch liegen zwei ___. (Buch)", ["Bücher", "Buecher"], "Buch 的复数是 Bücher。"),
      choice("下面哪一组是正确的？", ["der Mann - die Männer", "der Mann - die Mannern", "der Mann - die Männern"], 0, "Mann 的复数是不规则形式 Männer。"),
      fill("用括号里的词完成句子：___ Leute sind sehr nett. (definiter Artikel)", ["Die"], "复数定冠词固定是 die。")
    ]
  },
  "articles": {
    overview: "教材在冠词部分同时处理了 definite、indefinite、kein 和基础否定，这样学习者会很快意识到：冠词不是孤立知识，而是句子里辨认词性和数量的入口。网页版把这条思路也保留下来了。",
    focus: [
      "der / die / das 先和最常见名词搭配记，比单背表格更有效。",
      "kein 的词尾变化方式和不定冠词、物主冠词有亲缘关系。",
      "nicht 的位置会随着被否定的成分变化，这也是 A1 需要开始有感觉的部分。"
    ],
    examples: [
      example("Das ist ein Tisch und das ist keine Lampe.", "这是桌子，那不是灯。"),
      example("Die Suppe ist heiß, aber das Brot ist nicht frisch.", "汤很热，但面包不新鲜。"),
      example("Er hat keinen Termin und keine Zeit.", "他没有预约，也没时间。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Das ist ___ Auto. (ein)", ["ein"], "中性名词 Auto 搭配不定冠词 ein。"),
      fill("用括号里的词完成句子：Ich habe ___ Hunger, aber ich habe Durst. (kein)", ["keinen"], "Hunger 是阳性，Akkusativ 里要用 keinen。"),
      choice("哪一句最自然？", ["Ich bin nicht Hunger.", "Ich habe keinen Hunger.", "Ich habe nicht Hunger."], 1, "教材重点对比了 keinen Hunger 和 nicht hungrig 这类表达。")
    ]
  },
  "accusative": {
    overview: "教材在第四格部分会持续把阳性变化和常见宾语动词放在一起练，所以网页版也补了更多“看动词、找宾语、改冠词”的训练，而不是只问概念。",
    focus: [
      "阳性单数的变化最重要：der Mann → den Mann，ein Hund → einen Hund。",
      "中性、阴性和复数的很多形式在第四格里和主格看起来一样，更容易误判。",
      "很多初学者错误不是不会变格，而是没先找出宾语。"
    ],
    examples: [
      example("Ich suche den Schlüssel und das Handy.", "我在找钥匙和手机。"),
      example("Sie kauft einen Mantel und eine Tasche.", "她买一件大衣和一个包。"),
      example("Wir hören die Musik jeden Abend.", "我们每天晚上都听音乐。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Ich habe ___ Hund. (ein)", ["einen"], "阳性单数 Akkusativ 用 einen。"),
      choice("哪一句是正确的？", ["Ich suche der Bahnhof.", "Ich suche den Bahnhof.", "Ich suche dem Bahnhof."], 1, "suchen 后面常接第四格宾语。"),
      fill("用括号里的词完成句子：Er liest ___ Zeitung. (die)", ["die"], "阴性单数在第四格里形式保持 die。")
    ]
  },
  "dative": {
    overview: "教材在第三格里不仅练介词，也大量练带人称角色的句子，比如 mit wem, bei wem, zu wem。网页版把这些“和谁、给谁、在谁那里”的感觉也加强了。",
    focus: [
      "Dativ 常跟“间接相关的人”有关，如帮谁、给谁、和谁一起。",
      "介词是识别 Dativ 的重要信号，但有些动词本身也会要求第三格。",
      "Dativ 复数的 -n 是教材里反复强调的细节。"
    ],
    examples: [
      example("Ich wohne bei meinen Eltern.", "我和父母住在一起。"),
      example("Kannst du mit dem Kind sprechen?", "你能和那个孩子说话吗？"),
      example("Wir fahren zu unseren Freunden.", "我们去朋友家。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Er geht zu ___ Nachbarin. (die)", ["der"], "zu 后面用 Dativ：zu der Nachbarin。"),
      choice("哪一句是正确的？", ["Ich fahre mit der Bus.", "Ich fahre mit dem Bus.", "Ich fahre mit den Bus."], 1, "mit 后面用 Dativ。"),
      fill("用括号里的词完成句子：Wir spielen mit den ___. (Freund)", ["Freunden"], "Dativ 复数常见 -n。")
    ]
  },
  "possessive-article-words": {
    overview: "教材里物主冠词不只是在单数里练，还反复带到 Eltern、Kinder、Freunde 这类高频复数名词里。网页版因此也加入了更多家庭和日常关系场景。",
    focus: [
      "mein / dein / sein / ihr / unser / euer / ihr / Ihr 要和后面的名词一起看。",
      "welcher 常用于从多个对象里挑一个；dieser 常用于眼前明确指出的对象。",
      "物主冠词在不同格里也会变化，所以不能只记主格。"
    ],
    examples: [
      example("Unser Sohn lernt in Hamburg, aber unsere Tochter wohnt noch zu Hause.", "我们的儿子在汉堡上学，但女儿还住在家。"),
      example("Welches Kleid gefällt dir besser?", "你更喜欢哪条裙子？"),
      example("Dieser Platz ist frei, aber jener Tisch ist schon reserviert.", "这个位置空着，但那张桌子已经被预订了。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Das sind ___ Bücher. (ich)", ["meine"], "复数名词 Bücher 要用 meine。"),
      choice("询问“哪一辆车是你的？”最自然的是：", ["Welches Auto ist dein?", "Welcher Wagen ist deiner?", "Welche Auto ist dein?"], 1, "教材会把 welcher 和后续代词/名词配合起来练。"),
      fill("用括号里的词完成句子：___ Frau dort ist meine Lehrerin. (dieser)", ["Diese"], "阴性单数主格用 diese。")
    ]
  },
  "pronouns-cases": {
    overview: "教材把人称代词 Akkusativ / Dativ 和双宾语动词连在一起练，比如 schenken, geben, zeigen, helfen。网页版也增加了更多“给谁什么”的双对象题型。",
    focus: [
      "Akkusativ 常回答 wen / was，Dativ 常回答 wem。",
      "给东西、寄东西、带东西给别人时，句子里常同时出现两个对象。",
      "代词出现后，格的区别往往会比名词更明显。"
    ],
    examples: [
      example("Ich schenke meinem Sohn einen Ball. Ich schenke ihm einen Ball.", "我送给儿子一个球。我送给他一个球。"),
      example("Du dankst mir und ich danke dir.", "你感谢我，我感谢你。"),
      example("Wem gibst du das Geld? - Ich gebe es ihr.", "你把钱给谁？- 我给她。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Ich danke ___. (du)", ["dir"], "danken 要接 Dativ。"),
      fill("用括号里的词完成句子：Er sieht Paul. Er sieht ___. (er)", ["ihn"], "sehen 后面用 Akkusativ 代词 ihn。"),
      choice("正确的一组是：", ["Wen fragst du? - Ich frage ihn.", "Wem fragst du? - Ich frage ihn.", "Was fragst du? - Ich frage ihn."], 0, "问直接对象人时用 wen。")
    ]
  },
  "past-forms-basic": {
    overview: "教材在过去表达入门里反复对比 war / hatte 和 Perfekt，所以网页版也加入了更多“过去状态 vs 过去动作”的切换练习，帮助你真正建立时态选择感。",
    focus: [
      "过去状态、身份和拥有关系很常直接用 war / hatte。",
      "口语里叙述昨天做了什么时，多数普通动词优先想到 Perfekt。",
      "同一个语境里可能同时出现 war 和 habe gemacht，这在教材里也很多。"
    ],
    examples: [
      example("Früher war ich in München, jetzt bin ich in Köln.", "以前我在慕尼黑，现在我在科隆。"),
      example("Letzte Woche hatte er keine Zeit und hat viel gearbeitet.", "上周他没时间，而且工作很多。"),
      example("Gestern Abend haben wir lange gesprochen.", "昨天晚上我们聊了很久。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Früher ___ ich in Berlin. (sein)", ["war"], "sein 的过去式高频形式是 war。"),
      fill("用括号里的词完成句子：Letztes Jahr ___ wir ein kleines Auto. (haben)", ["hatten"], "haben 的过去式复数是 hatten。"),
      choice("更自然地回答“昨天你做了什么？”的是：", ["Ich war Fußball.", "Ich habe Fußball gespielt.", "Ich bin Fußball gespielt."], 1, "普通动作在口语里常用 Perfekt。")
    ]
  },
  "perfect-sein-participle": {
    overview: "教材在这部分会把 Partizip II 的构成方式和助动词选择一起练。网页版因此补了更多“先选 haben / sein，再写 Partizip”的双步骤练习。",
    focus: [
      "表示移动、位置变化、到达离开的动词里，很多都会和 sein 连用。",
      "规则动词常见 ge-...-t，不规则动词常见 ge-...-en，但需要大量记忆。",
      "有些前缀动词 Partizip 里前缀和 ge- 会一起出现，如 angekommen, eingekauft。"
    ],
    examples: [
      example("Wir sind am Abend spät eingeschlafen.", "我们晚上很晚才睡着。"),
      example("Er hat im Supermarkt Brot und Gemüse eingekauft.", "他在超市买了面包和蔬菜。"),
      example("Ich bin mit dem Zug angekommen und habe sofort meine Mutter angerufen.", "我坐火车到了，马上给妈妈打了电话。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Sie ___ nach Hause ___. (gehen)", ["ist / gegangen", "ist gegangen"], "gehen 在 Perfekt 中和 sein 连用。"),
      fill("用括号里的词完成句子：Wir haben den Film ___. (sehen)", ["gesehen"], "sehen 的 Partizip II 是 gesehen。"),
      choice("哪一句是正确的？", ["Ich habe nach Hause gekommen.", "Ich bin nach Hause gekommen.", "Ich habe nach Hause gegangen."], 1, "kommen 通常和 sein 连用。")
    ]
  },
  "reflexive-verbs-a1": {
    overview: "教材里的反身部分还会对比“真正反身”和“互相”的意义，比如 sich waschen 与 sich treffen。网页版把这条区别也放进了例句和练习里。",
    focus: [
      "反身代词要跟主语同步变化：ich mich, du dich, er/sie/es sich, wir uns。",
      "有些动词离开反身代词就不自然，如 sich beeilen, sich interessieren。",
      "Wir treffen uns 这类句子虽然形式上是反身，语义上常表示“互相”。"
    ],
    examples: [
      example("Ich beeile mich, weil der Bus gleich kommt.", "我得快点，因为公交马上来了。"),
      example("Interessierst du dich für Musik oder für Sport?", "你对音乐还是对运动感兴趣？"),
      example("Am Wochenende treffen wir uns oft im Park.", "周末我们常在公园见面。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Er freut ___ auf den Urlaub. (sich)", ["sich"], "er/sie/es 的反身代词是 sich。"),
      fill("用括号里的词完成句子：Ich interessiere ___ für Deutsch. (mich)", ["mich"], "ich 对应 mich。"),
      choice("正确的一句是：", ["Wir treffen sich um acht.", "Wir treffen uns um acht.", "Wir uns treffen um acht."], 1, "主语是 wir，反身代词要用 uns。")
    ]
  },
  "temporal-prepositions": {
    overview: "教材在时间介词部分覆盖得非常细，从 Tageszeiten、Monate、Daten 到 seit / vor / nach / bis / ab 的区别。网页版把这些小点都补进同一个单元，方便统一复习。",
    focus: [
      "am 常见于 am Montag, am Abend, am 12. Mai。",
      "im 常见于 im Juli, im Winter, im August。",
      "seit 强调“从过去持续到现在”，vor 更像“多久以前”。"
    ],
    examples: [
      example("Im Winter fahren wir oft in die Berge.", "冬天我们常去山里。"),
      example("Am Freitag habe ich ab 18 Uhr Zeit.", "周五我从 18 点开始有时间。"),
      example("Vor dem Unterricht trinke ich immer Kaffee.", "上课前我总会喝咖啡。")
    ],
    exercises: [
      fill("用括号里的词完成句子：___ Freitag habe ich frei. (am)", ["Am"], "星期前常用 am。"),
      fill("用括号里的词完成句子：Wir wohnen ___ 2021 in Berlin. (seit)", ["seit"], "持续到现在用 seit。"),
      choice("哪一句最自然？", ["Ich habe im Montag Zeit.", "Ich habe am Montag Zeit.", "Ich habe um Montag Zeit."], 1, "星期前常用 am。")
    ]
  },
  "dative-prepositions": {
    overview: "教材把 aus, bei, mit, nach, seit, von, zu 作为一个整体去背，网页版也保留这条学习路线，并补充了更多地点、时间和交通的搭配。",
    focus: [
      "nach 最典型的是国家和城市名词前无冠词时的方向：nach Berlin, nach Italien。",
      "von 既能表示来源，也能表示所属关系：die Schwester von Maria。",
      "bei 既能表示“在某人那里”，也能表示“在某公司工作”。"
    ],
    examples: [
      example("Er kommt gerade vom Zahnarzt und geht jetzt zu seiner Schwester.", "他刚从牙医那里回来，现在去姐姐家。"),
      example("Meine Mutter arbeitet bei Siemens.", "我妈妈在西门子工作。"),
      example("Nach dem Essen gehen wir zu Ikea.", "饭后我们去宜家。")
    ],
    exercises: [
      choice("哪一句是正确的？", ["Ich fahre nach die Schweiz.", "Ich fahre in die Schweiz.", "Ich fahre zu die Schweiz."], 1, "带冠词的国家名称常用 in + Akkusativ，而不是 nach。"),
      fill("用括号里的词完成句子：Die Schwester ___ meiner Freundin ist nett. (von)", ["von"], "所属关系可用 von + Dativ。"),
      fill("用括号里的词完成句子：Ich arbeite ___ einer Bank. (bei)", ["bei"], "表示在某机构工作常用 bei。")
    ]
  },
  "accusative-prepositions": {
    overview: "教材会反复让学习者把 FUDOG 当成整组处理。网页版也继续沿用这个方法，并加入了围绕、穿过、反对、没有、为了这些常见场景。",
    focus: [
      "durch 强调穿过、经过一个空间。",
      "um 可以表示围绕，也可出现在部分固定搭配里。",
      "gegen 除了“反对”，还常见于 gegen Kopfschmerzen 这种表达。"
    ],
    examples: [
      example("Wir laufen um den See und durch den Wald.", "我们绕着湖走，再穿过森林。"),
      example("Hast du etwas gegen Kopfschmerzen?", "你有治头痛的药吗？"),
      example("Ohne meinen Schlüssel komme ich nicht rein.", "没有我的钥匙我进不去。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Das Geschenk ist ___ meine Mutter. (für)", ["für"], "表示“给……的”常用 für。"),
      fill("用括号里的词完成句子：Wir gehen ___ den Park. (durch)", ["durch"], "穿过公园常用 durch。"),
      choice("哪一句最自然？", ["Ich brauche Tabletten gegen Kopfschmerzen.", "Ich brauche Tabletten mit Kopfschmerzen.", "Ich brauche Tabletten zu Kopfschmerzen."], 0, "gegen Kopfschmerzen 是高频搭配。")
    ]
  },
  "local-prepositions": {
    overview: "教材把 wo、wohin、woher 以及 in / an / auf / zu / nach / aus / von 的体系讲得很细。网页版把这些点尽量都并进这个单元，所以它现在会比普通 A1 介词卡片更长、更完整。",
    focus: [
      "in / an / auf 这组三格-四格切换介词最适合从“静态位置 vs 方向移动”来理解。",
      "zu 常用于去人、机构、活动；nach 常用于无冠词国家和城市；nach Hause / zu Hause / von zu Hause 也要单独熟悉。",
      "woher 问来源时，地点常用 aus，人或活动场景常用 von。"
    ],
    examples: [
      example("Am Abend bin ich zu Hause, aber morgen fahre ich nach Hause zu meinen Eltern.", "晚上我在家，但明天我要回父母家。"),
      example("Die Kinder spielen im Garten und laufen dann in den Garten hinter dem Haus.", "孩子们在花园里玩，然后跑到房子后面的花园那边。"),
      example("Ich komme aus Spanien, aber gerade komme ich vom Markt.", "我来自西班牙，不过我现在是刚从市场回来。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Die Bücher liegen ___ Tisch. (auf, der)", ["auf dem"], "静态位置用 Dativ：auf dem Tisch。"),
      fill("用括号里的词完成句子：Ich lege das Buch ___ Tisch. (auf, der)", ["auf den"], "方向移动用 Akkusativ：auf den Tisch。"),
      choice("哪一句最自然？", ["Ich komme aus dem Arzt.", "Ich komme vom Arzt.", "Ich komme zu dem Arzt."], 1, "从人或固定活动场所回来常用 von / vom。")
    ]
  },
  "adjective-endings-a1": {
    overview: "教材在形容词词尾部分给了大量对照：定冠词、不定冠词、kein、物主冠词、以及右边表语不变。网页版把这些对照感也加强了，不再只停留在几个基础词尾。",
    focus: [
      "定冠词后词尾往往更轻，因为冠词已经承担了更多语法信息。",
      "不定冠词后形容词常承担更多语法信号，所以更值得单独练。",
      "形容词作表语时不带词尾：Der Hund ist klein."
    ],
    examples: [
      example("Das ist ein kleines Kind und ein sehr netter Lehrer.", "这是一个小孩和一位非常友善的老师。"),
      example("Wir sehen die schönen Häuser und den alten Bahnhof.", "我们看到漂亮的房子和老火车站。"),
      example("Mit dem neuen Chef spreche ich heute Abend.", "我今晚和新老板说话。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Das ist ein kalt___ Getränk. (kalt)", ["kaltes"], "中性单数不定冠词后常见 -es。"),
      fill("用括号里的词完成句子：Ich sehe den alt___ Mann. (alt)", ["alten"], "阳性 Akkusativ 后形容词常见 -en。"),
      choice("哪一句正确？", ["Die Frau ist nette.", "Die Frau ist nett.", "Die Frau ist netten."], 1, "表语位置不带形容词词尾。")
    ]
  },
  "comparison-basic": {
    overview: "教材在比较部分不仅讲形式，还训练 wie 和 als 的选择、besser / lieber / mehr 这些高频不规则形式，以及 am schnellsten 这类最高级。网页版把这些常见坑也都补进来了。",
    focus: [
      "gut → besser, viel → mehr, gern → lieber 需要直接整体记忆。",
      "so ... wie 用于同等比较，... als 用于差异比较。",
      "最高级既可以作副词也可以作定语。"
    ],
    examples: [
      example("Deutsch ist schwieriger als Englisch für ihn.", "对他来说德语比英语更难。"),
      example("Ich trinke lieber Tee als Kaffee.", "我更喜欢喝茶而不是咖啡。"),
      example("Von allen arbeitet Lea am konzentriertesten.", "所有人里 Lea 工作最专注。")
    ],
    exercises: [
      fill("用括号里的词完成句子：Mein Bruder ist ___ als ich. (groß)", ["größer", "groesser"], "groß 的比较级是 größer。"),
      choice("哪一句表示“和……一样快”？", ["Er läuft schneller als ich.", "Er läuft so schnell wie ich.", "Er läuft am schnellsten."], 1, "同等比较用 so ... wie。"),
      fill("用括号里的词完成句子：Ich esse ___ Pizza als Pasta. (gern)", ["lieber"], "gern 的比较级是不规则形式 lieber。")
    ]
  },
  "sentence-connectors-a1": {
    overview: "教材在连接句时的训练量很大，既有并列连接，也有 deshalb / dann / danach 这类位置词，还有 weil / wenn / dass 从句。网页版给这一单元追加了更多句型组合和改写练习。",
    focus: [
      "und / aber / oder / denn 后面继续用主句语序。",
      "deshalb / dann / danach 常自己占第一位，因此后面的动词仍要回到第二位。",
      "weil / wenn / dass 引导的从句里，变位动词通常移动到句末。"
    ],
    examples: [
      example("Ich habe keine Zeit, deshalb komme ich später.", "我没时间，所以我晚点来。"),
      example("Wenn ich Urlaub habe, fahre ich ans Meer.", "如果我有假期，我就去海边。"),
      example("Ich weiß, dass der Kurs heute ausfällt.", "我知道今天的课取消了。")
    ],
    exercises: [
      fill("用 wenn 连接：Ich habe Zeit. Ich komme vorbei.", ["Wenn ich Zeit habe, komme ich vorbei"], "wenn 从句里的动词要去句末。"),
      fill("用 dass 连接：Ich weiß es. Der Bus kommt später.", ["Ich weiß, dass der Bus später kommt"], "dass 从句里 comes/kommt 要放句末。"),
      choice("哪一句正确？", ["Es regnet, deshalb wir bleiben zu Hause.", "Es regnet, deshalb bleiben wir zu Hause.", "Es regnet, bleiben wir deshalb zu Hause."], 1, "deshalb 占第一位时，变位动词仍然在第二位。")
    ]
  },
  "word-building-a1": {
    overview: "教材在 A1 后段开始训练“见词猜义”的能力。网页版现在把复合词、组合动词、性别线索、小品词和基础词缀放得更完整，让这个单元不再只是点到为止。",
    focus: [
      "复合词的最后一个词决定词性和基本类别，前面的部分补充信息。",
      "组合动词里有很多高频口语表达，如 an sein, aus sein, dabei haben, weg sein。",
      "词尾如 -in, -ung, -er 等能提供词类和意义线索。"
    ],
    examples: [
      example("Der Regenschirm ist im Flur, aber die Sonnenbrille ist im Auto.", "雨伞在走廊里，但太阳镜在车里。"),
      example("Mein Handy ist weg, aber mein Portemonnaie habe ich dabei.", "我的手机不见了，但钱包带着。"),
      example("Lehrerin, Bäckerin und Zeitung zeigen schon通过词尾给出一些意思线索。", "Lehrerin、Bäckerin 和 Zeitung 这些词已经能从词尾看出一些线索。")
    ],
    exercises: [
      fill("复合词：die Sonne + der Schirm = ___", ["der Sonnenschirm"], "最后一个词 Schirm 决定冠词是 der。"),
      fill("用括号里的词完成句子：Die Tür ist nicht offen, sie ist ___. (zu)", ["zu"], "zu sein 是高频状态表达。"),
      choice("哪一个最可能表示“女老师”？", ["der Lehrung", "die Lehrerin", "das Lehrer"], 1, "-in 常提示女性职业名词。")
    ]
  },
  "negation-and-local-adverbs": {
    overview: "教材这部分会把否定词和位置/方向副词都做成大量短句训练，因为它们虽然短，却非常高频。网页版把这些短词的用法显著加厚了，让这一单元不再只有概念说明。",
    focus: [
      "noch nie 和 noch nicht 不一样：一个强调“从来没”，一个强调“还没”。",
      "nichts / niemand / nie 都是很高频的否定词，不能只靠一个 nicht 解决所有情况。",
      "oben / unten 等是副词，不是介词，所以后面不直接接名词。"
    ],
    examples: [
      example("Heute fährt die U-Bahn nicht mehr, wir müssen zu Fuß gehen.", "今天地铁已经不再运行了，我们得步行。"),
      example("Niemand ist da, aber ich kann nicht warten.", "没有人在，但我不能等了。"),
      example("Das Restaurant ist dort oben, wir gehen gleich nach oben.", "餐厅就在上面那边，我们马上上去。")
    ],
    exercises: [
      fill("用合适的否定词填空：Ich war ___ in Japan. (从来没)", ["noch nie", "nie"], "强调到目前为止从未去过时，教材很常用 noch nie。"),
      fill("用括号里的词完成句子：Komm bitte nach ___. (unten)", ["unten"], "方向副词常和 nach 一起出现。"),
      choice("哪一句最自然？", ["Ich habe nicht mehr Hunger.", "Ich habe keinen Hunger mehr.", "Ich habe nichts Hunger."], 1, "教材把 keinen Hunger mehr 作为高频固定搭配。")
    ]
  }
};

for (const topic of a1Topics) {
  const extra = a1Enrichment[topic.id];

  if (!extra) {
    continue;
  }

  if (extra.overview) {
    topic.overview = `${topic.overview} ${extra.overview}`;
  }

  if (extra.focus?.length) {
    topic.focus = topic.focus.concat(extra.focus);
  }

  if (extra.examples?.length) {
    topic.examples = topic.examples.concat(extra.examples);
  }

  if (extra.exercises?.length) {
    topic.exercises = topic.exercises.concat(extra.exercises);
  }
}

grammarData.A1 = {
  description: "依据《Grammatik aktiv A1-B1》A1 内容重组：覆盖人称代词、现在时、特殊动词、情态动词、可分动词、命令式、问句、动词第二位、句框、名词与冠词、Akkusativ、Dativ、过去表达、反身动词、时间与地点介词、形容词词尾、比较级、连词、构词、否定词和地点副词等核心知识面。",
  items: a1Topics.map(({ en, ...topic }) => topic)
};

studyTranslations.content = studyTranslations.content || {};
studyTranslations.content.en = studyTranslations.content.en || {};
studyTranslations.content.en.A1 = Object.fromEntries(
  a1Topics.map((topic) => [topic.id, topic.en])
);

writeWindowObject(
  "grammar-data.js",
  "grammarData",
  grammarData,
  "Generated from Grammatik aktiv A1-B1 [2. aktualisierte Ausgabe] with A1 content reorganized for the study app"
);

writeWindowObject(
  "translations.js",
  "studyTranslations",
  studyTranslations,
  "Updated with English metadata for the rebuilt A1 handbook content"
);
