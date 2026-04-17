const grammarData = window.grammarData || {
  A1: { description: "", items: [] },
  A2: { description: "", items: [] }
};
const readingData = window.readingData || {
  A1: { description: "", items: [] },
  A2: { description: "", items: [] }
};

const a1SubunitData = window.a1SubunitData || {};
const studyTranslations = window.studyTranslations || { ui: { zh: {}, en: {} }, content: { en: {} } };
const LANGUAGE_STORAGE_KEY = "german-study-language";
const outlineUi = {
  zh: {
    groupGuideTitle: "单元说明",
    subunitsTitle: "子单元目录",
    subunitsNote: "先按大单元整理结构，具体讲解与练习下一步再逐个补全。",
    groupOpenCard: "查看子单元目录",
    groupCount: "{count} 个大单元 · 点击进入子单元目录",
    subunitTag: "小单元",
    subunitComingSoon: "内容即将补充"
  },
  en: {
    groupGuideTitle: "Unit Overview",
    subunitsTitle: "Subunit Outline",
    subunitsNote: "The structure is in place first. Detailed explanations and exercises will be added subunit by subunit next.",
    groupOpenCard: "Open subunit outline",
    groupCount: "{count} major units · open a unit to view its subunits",
    subunitTag: "Subunit",
    subunitComingSoon: "Content coming next"
  }
};

const aiUi = {
  zh: {
    modalTitle: "题目问 AI",
    inputLabel: "发送给 AI",
    inputPlaceholder: "题干会自动带入这里，你也可以补充自己的疑问。",
    askButton: "询问 AI",
    close: "关闭",
    reset: "重新开始",
    send: "发送",
    sending: "发送中…",
    empty: "点题目旁边的“询问 AI”，题干会自动带进来。你只需要再点一次发送就可以开始对话。",
    statusChecking: "正在连接本地 AI…",
    statusReady: "已连接",
    statusBusy: "思考中…",
    statusUnavailable: "还没有连接到本地 AI。请先启动本地 AI bridge，然后再回来提问。",
    statusError: "当前无法连接到本地 AI，请确认本地 bridge 已启动。",
    contextLabel: "题目",
    roleUser: "你",
    roleAssistant: "AI 老师",
    resetHint: "已切换到新题目，题干已经放进输入框里了。"
  },
  en: {
    modalTitle: "Ask AI About This Task",
    inputLabel: "Send to AI",
    inputPlaceholder: "The task will be inserted here automatically. You can add your own question too.",
    askButton: "Ask AI",
    close: "Close",
    reset: "Start Over",
    send: "Send",
    sending: "Sending…",
    empty: "Click “Ask AI” beside any task. The prompt will be inserted automatically, and you only need one more click to send it.",
    statusChecking: "Connecting to your local AI…",
    statusReady: "Connected",
    statusBusy: "Thinking…",
    statusUnavailable: "Your local AI bridge is not reachable yet. Start the local AI bridge first.",
    statusError: "The local AI is not reachable right now. Please make sure the bridge is running.",
    contextLabel: "Task",
    roleUser: "You",
    roleAssistant: "AI Tutor",
    resetHint: "New task loaded. The prompt is ready in the composer."
  }
};

let currentExercises = [];
let currentPracticeContext = null;
let currentLang = getPreferredLanguage();
const DEFAULT_AI_MODE_OPTIONS = [
  { id: "[次]grok-420-fast", title: "Grok 420 Fast", description: "Fast direct replies" },
  { id: "[次]grok-4", title: "Grok 4", description: "Stronger reasoning" },
  { id: "[次]grok-420-thinking", title: "Grok 420 Thinking", description: "Thinking mode" }
];

function resolveAiBridgeBase() {
  const configuredBase = typeof window !== "undefined"
    ? String(window.AI_BRIDGE_BASE || "").trim()
    : "";

  if (configuredBase) {
    return configuredBase.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined" && window.location?.protocol === "file:") {
    return "http://127.0.0.1:8765/api/ai";
  }

  return "/api/ai";
}

const aiState = {
  bridgeBase: resolveAiBridgeBase(),
  model: DEFAULT_AI_MODE_OPTIONS[0].id,
  modelLabel: DEFAULT_AI_MODE_OPTIONS[0].title,
  preferredModel: DEFAULT_AI_MODE_OPTIONS[0].id,
  manualModelSelection: false,
  activeModel: "",
  activeModelLabel: "",
  modelOptions: DEFAULT_AI_MODE_OPTIONS.map((option) => ({ ...option })),
  available: false,
  checked: false,
  checking: false,
  sending: false,
  open: false,
  status: "idle",
  messages: [],
  draft: "",
  contextLabel: ""
};

const DETAIL_OVERRIDE_STORAGE_KEY = "german-study-detail-overrides";
const PUBLISHED_DETAIL_OVERRIDE_PATH = "/published-overrides.json";
const A1_LIST_PART_STORAGE_KEY = "german-study-a1-list-part";
const A1_LIST_PARTS = ["grammar", "reading", "listening", "writing"];
const DEFAULT_A1_LIST_PART = "grammar";
const detailEditorState = {
  enabled: false,
  pageKey: "",
  pageType: "",
  level: "",
  topicId: "",
  subunitCode: "",
  feedbackMessage: "",
  feedbackVariant: "info"
};
const homePublishState = {
  feedbackMessage: "",
  feedbackVariant: "info",
  publishing: false
};
const homeApiConfigState = {
  loaded: false,
  loading: false,
  saving: false,
  feedbackMessage: "",
  feedbackVariant: "info",
  form: {
    baseUrl: "https://us.novaiapi.com/v1",
    apiKey: "",
    defaultModel: "[次]grok-420-fast",
    modelIds: "",
    providerLabel: "Novai Direct API"
  }
};
const publishedDetailOverrideState = {
  store: {},
  loaded: false,
  loading: false
};
const listPageState = {
  a1Part: DEFAULT_A1_LIST_PART
};

function canUseLocalDetailEditor() {
  if (typeof window === "undefined" || !window.location) {
    return false;
  }

  const protocol = String(window.location.protocol || "").toLowerCase();
  const host = String(window.location.hostname || "").toLowerCase();
  return protocol === "file:" || host === "localhost" || host === "127.0.0.1" || host === "::1";
}

detailEditorState.enabled = canUseLocalDetailEditor();

function normalizeDeveloperJumpKey(value) {
  return String(value || "")
    .trim()
    .replace(/[^A-Za-z0-9_-]+/g, "-");
}

function getPracticeTargetId(kind, key) {
  return `practice-${normalizeDeveloperJumpKey(kind)}-${normalizeDeveloperJumpKey(key)}`;
}

function getEditorTargetId(kind, key) {
  return `editor-${normalizeDeveloperJumpKey(kind)}-${normalizeDeveloperJumpKey(key)}`;
}

function getPracticeModeForTargetId(targetId) {
  const value = String(targetId || "");

  if (value.startsWith("practice-quick-")) {
    return "quick";
  }

  if (value.startsWith("practice-book-") || value.startsWith("practice-reference-")) {
    return "book";
  }

  return "";
}

function setPracticeMode(modeId) {
  const nextMode = String(modeId || "").trim();

  if (!nextMode) {
    return;
  }

  document.querySelectorAll("[data-practice-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.practiceMode === nextMode);
  });

  document.querySelectorAll("[data-practice-panel]").forEach((panel) => {
    const isActive = panel.dataset.practicePanel === nextMode;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

function jumpToDeveloperTarget(targetId) {
  const resolvedId = String(targetId || "").trim();

  if (!resolvedId) {
    return;
  }

  const modeId = getPracticeModeForTargetId(resolvedId);
  if (modeId) {
    setPracticeMode(modeId);
  }

  requestAnimationFrame(() => {
    const target = document.getElementById(resolvedId);

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    const focusTarget = target.matches("textarea, input, button")
      ? target
      : target.querySelector("textarea, input, button");

    if (focusTarget instanceof HTMLElement) {
      focusTarget.focus({ preventScroll: true });
    }
  });
}

function getPublishedDetailOverrideUrl() {
  const cacheSuffix = `?ts=${Date.now()}`;

  if (typeof window === "undefined" || !window.location) {
    return `${PUBLISHED_DETAIL_OVERRIDE_PATH}${cacheSuffix}`;
  }

  if (window.location.protocol === "file:") {
    return `http://127.0.0.1:8080${PUBLISHED_DETAIL_OVERRIDE_PATH}${cacheSuffix}`;
  }

  return `${PUBLISHED_DETAIL_OVERRIDE_PATH}${cacheSuffix}`;
}

function getLocalSiteControlBase() {
  return "http://127.0.0.1:8080";
}

function getLocalEditorApiUrl(path = "") {
  return `${getLocalSiteControlBase()}/api/editor${path}`;
}

function getLocalAiConfigApiUrl() {
  return `${getLocalSiteControlBase()}/api/local/ai-config`;
}

async function loadPublishedDetailOverrides(force = false) {
  if (publishedDetailOverrideState.loading) {
    return publishedDetailOverrideState.store;
  }

  if (publishedDetailOverrideState.loaded && !force) {
    return publishedDetailOverrideState.store;
  }

  publishedDetailOverrideState.loading = true;

  try {
    const response = await fetch(getPublishedDetailOverrideUrl(), {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const store = await response.json();
    publishedDetailOverrideState.store = store && typeof store === "object" ? store : {};
    publishedDetailOverrideState.loaded = true;
    return publishedDetailOverrideState.store;
  } catch {
    publishedDetailOverrideState.store = {};
    publishedDetailOverrideState.loaded = true;
    return publishedDetailOverrideState.store;
  } finally {
    publishedDetailOverrideState.loading = false;
  }
}

function getDetailOverrideStore() {
  try {
    const rawValue = window.localStorage.getItem(DETAIL_OVERRIDE_STORAGE_KEY);
    const parsed = rawValue ? JSON.parse(rawValue) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeDetailOverrideStore(store) {
  try {
    window.localStorage.setItem(DETAIL_OVERRIDE_STORAGE_KEY, JSON.stringify(store || {}));
  } catch {
    // Ignore storage write failures and keep the page usable.
  }
}

function sanitizeDetailOverrideStore(store = {}) {
  return Object.fromEntries(
    Object.entries(store || {}).filter(([pageKey, overrides]) => (
      String(pageKey || "").trim()
      && overrides
      && typeof overrides === "object"
      && !Array.isArray(overrides)
      && Object.keys(overrides).length > 0
    ))
  );
}

function getLocalDraftPageCount() {
  return Object.keys(sanitizeDetailOverrideStore(getDetailOverrideStore())).length;
}

function getDetailPageKey(level, topicId, subunitCode = "") {
  return [String(level || "").trim(), String(topicId || "").trim(), String(subunitCode || "").trim() || "topic"]
    .filter(Boolean)
    .join("::");
}

function getDetailPageOverrides(pageKey) {
  if (!pageKey) {
    return {};
  }

  return getDetailOverrideStore()[pageKey] || {};
}

function setDetailPageOverrides(pageKey, overrides) {
  if (!pageKey) {
    return;
  }

  const store = getDetailOverrideStore();
  store[pageKey] = overrides || {};
  writeDetailOverrideStore(store);
}

function clearDetailPageOverrides(pageKey) {
  if (!pageKey) {
    return;
  }

  const store = getDetailOverrideStore();
  delete store[pageKey];
  writeDetailOverrideStore(store);
}

function sanitizeLocalAiConfigForm(form = {}) {
  return {
    baseUrl: String(form.baseUrl || "").trim() || "https://us.novaiapi.com/v1",
    apiKey: String(form.apiKey || "").trim(),
    defaultModel: String(form.defaultModel || "").trim() || "[次]grok-420-fast",
    modelIds: String(form.modelIds || "").trim(),
    providerLabel: String(form.providerLabel || "").trim() || "Novai Direct API"
  };
}

function updateLocalAiConfigState(updates = {}) {
  homeApiConfigState.form = sanitizeLocalAiConfigForm({
    ...homeApiConfigState.form,
    ...updates
  });
}

function splitEditorLines(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function deepCloneJson(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function deepMergeObjects(base, override) {
  const result = isPlainObject(base) ? deepCloneJson(base) : {};

  if (!isPlainObject(override)) {
    return result;
  }

  Object.entries(override).forEach(([key, value]) => {
    if (isPlainObject(value)) {
      result[key] = deepMergeObjects(result[key], value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((entry) => (
        isPlainObject(entry) ? deepCloneJson(entry) : entry
      ));
    } else {
      result[key] = value;
    }
  });

  return result;
}

function splitEditorPipeCells(value) {
  return String(value || "")
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell) => cell.length > 0);
}

function serializeEditorPipeRow(values) {
  return (values || [])
    .map((value) => String(value || "").trim())
    .filter((value) => value.length > 0)
    .join(" | ");
}

function serializeEditorPipeMatrix(rows) {
  return (rows || [])
    .map((row) => serializeEditorPipeRow(row))
    .filter(Boolean)
    .join("\n");
}

function parseEditorPipeMatrix(value) {
  return splitEditorLines(value)
    .map((line) => splitEditorPipeCells(line))
    .filter((row) => row.length > 0);
}

function serializeRulePairs(items) {
  return (items || [])
    .map((item) => serializeEditorPipeRow([item?.label || "", item?.value || ""]))
    .filter(Boolean)
    .join("\n");
}

function parseRulePairs(value) {
  return splitEditorLines(value)
    .map((line) => {
      const [label = "", ...rest] = splitEditorPipeCells(line);
      const joinedValue = rest.join(" | ").trim();

      if (!label && !joinedValue) {
        return null;
      }

      return {
        label,
        value: joinedValue
      };
    })
    .filter(Boolean);
}

function getReferenceExerciseDescription(referenceExercise) {
  if (referenceExercise && Object.prototype.hasOwnProperty.call(referenceExercise, "description")) {
    return String(referenceExercise.description ?? "");
  }

  return currentLang === "en"
    ? "Read the original scene first, then write who or what each sie / Sie refers to."
    : "先读原书里的这段对话，再写出每个 sie / Sie 具体指谁或指什么。";
}

function getDefaultPracticeUiConfig() {
  if (currentLang === "en") {
    return {
      tabs: {
        book: "Book Practice",
        quick: "Interactive Practice",
        answers: "Answer Sheet"
      },
      book: {
        showCheckButton: true,
        showAnswerButton: true,
        showAiButton: true,
        showInputLabels: true,
        showBlankLabels: true,
        showFeedback: true,
        blankLabelTemplate: "Blank {n}",
        inputLabelTemplate: "Answer {n}",
        inputPlaceholder: "",
        checkLabel: "Check",
        showAnswerLabel: "Show answer",
        aiLabel: "Ask AI",
        pendingMessage: "Fill in every blank first.",
        correctMessage: "Correct. The pronoun fits the sentence.",
        incorrectTemplate: "Not quite yet. Suggested answer: {answer}",
        revealTemplate: "Suggested answer: {answer}"
      },
      reference: {
        showCheckButton: true,
        showAnswerButton: true,
        showAiButton: true,
        showInputLabels: true,
        showFeedback: true,
        inputLabel: "Person or thing",
        inputPlaceholder: "",
        checkLabel: "Check",
        showAnswerLabel: "Show answer",
        aiLabel: "Ask AI",
        pendingMessage: "Write the referent first.",
        correctMessage: "Correct. You found the referent.",
        incorrectTemplate: "Not quite yet. Suggested answer: {answer}",
        revealTemplate: "Suggested answer: {answer}"
      },
      quick: {
        showCheckButton: true,
        showAnswerButton: true,
        showAiButton: true,
        showFeedback: true,
        fillPlaceholder: "",
        checkLabel: "Check",
        showAnswerLabel: "Show answer",
        aiLabel: "Ask AI",
        choiceTypeLabel: "Choice",
        fillTypeLabel: "Fill",
        correctTitle: "Correct. This task is done.",
        incorrectTitle: "Not quite yet.",
        incorrectSoftTitle: "Almost there.",
        revealTitle: "Suggested answer",
        tryFillTitle: "Type an answer first",
        correctAnswerTemplate: "Suggested answer: {answer}",
        youChoseTemplate: "You chose: {answer}",
        tryFillText: "Type an answer first, then check it."
      }
    };
  }

  return {
    tabs: {
      book: "原书练习",
      quick: "交互练习",
      answers: "答案总览"
    },
    book: {
      showCheckButton: true,
      showAnswerButton: true,
      showAiButton: true,
      showInputLabels: true,
      showBlankLabels: true,
      showFeedback: true,
      blankLabelTemplate: "空 {n}",
      inputLabelTemplate: "答案 {n}",
      inputPlaceholder: "",
      checkLabel: "检查",
      showAnswerLabel: "显示答案",
      aiLabel: "询问 AI",
      pendingMessage: "先把这一题的空都填完。",
      correctMessage: "答对了，这个代词和句子搭配正确。",
      incorrectTemplate: "还差一点，参考答案：{answer}",
      revealTemplate: "参考答案：{answer}"
    },
    reference: {
      showCheckButton: true,
      showAnswerButton: true,
      showAiButton: true,
      showInputLabels: true,
      showFeedback: true,
      inputLabel: "填写人物或事物",
      inputPlaceholder: "",
      checkLabel: "检查",
      showAnswerLabel: "显示答案",
      aiLabel: "询问 AI",
      pendingMessage: "先写出这个代词指代的对象。",
      correctMessage: "答对了，你找到了这个代词的指代对象。",
      incorrectTemplate: "还差一点，参考答案：{answer}",
      revealTemplate: "参考答案：{answer}"
    },
    quick: {
      showCheckButton: true,
      showAnswerButton: true,
      showAiButton: true,
      showFeedback: true,
      fillPlaceholder: "",
      checkLabel: "检查",
      showAnswerLabel: "显示答案",
      aiLabel: "询问 AI",
      choiceTypeLabel: "选择题",
      fillTypeLabel: "填空题",
      correctTitle: "答对了，这一题已经完成。",
      incorrectTitle: "还不对，再试一次。",
      incorrectSoftTitle: "还差一点。",
      revealTitle: "参考答案",
      tryFillTitle: "先填写答案",
      correctAnswerTemplate: "参考答案：{answer}",
      youChoseTemplate: "你选择的是：{answer}",
      tryFillText: "先填写答案，再点击检查。"
    }
  };
}

function getResolvedPracticeUiConfig(config = {}) {
  return deepMergeObjects(getDefaultPracticeUiConfig(), config);
}

function getCurrentPracticeUiConfig() {
  return getResolvedPracticeUiConfig(currentPracticeContext?.practiceUi || {});
}

function getExerciseCollectionKey(item) {
  if (Array.isArray(item?.quickExercises)) {
    return "quickExercises";
  }

  if (Array.isArray(item?.localizedExercises)) {
    return "localizedExercises";
  }

  return "";
}

function cloneAnswerSheetEntries(entries) {
  return (entries || []).map((entry) => (
    entry && typeof entry === "object"
      ? { ...entry }
      : entry
  ));
}

function cloneRuleBlocks(rules) {
  return (rules || []).map((rule) => ({
    ...rule,
    headers: [...(rule.headers || [])],
    rows: (rule.rows || []).map((row) => [...(row || [])]),
    items: (rule.items || []).map((item) => ({ ...item }))
  }));
}

function cloneDetailRecord(item) {
  if (!item) {
    return null;
  }

  return {
    ...item,
    focus: [...(item.focus || [])],
    examples: (item.examples || []).map((example) => ({ ...example })),
    localizedExamples: (item.localizedExamples || []).map((example) => ({ ...example })),
    quickExercises: (item.quickExercises || []).map((exercise) => ({ ...exercise })),
    localizedExercises: (item.localizedExercises || []).map((exercise) => ({ ...exercise })),
    practiceUi: getResolvedPracticeUiConfig(deepCloneJson(item.practiceUi || {})),
    rules: cloneRuleBlocks(item.rules || []),
    bookExercises: (item.bookExercises || []).map((exercise) => ({
      ...exercise,
      options: [...(exercise.options || [])],
      lines: [...(exercise.lines || [])],
      answers: [...(exercise.answers || [])],
      explanations: [...(exercise.explanations || [])]
    })),
    referenceChecks: item.referenceChecks
      ? {
          ...item.referenceChecks,
          passage: [...(item.referenceChecks.passage || [])],
          checks: (item.referenceChecks.checks || []).map((check) => ({ ...check }))
        }
      : item.referenceChecks,
    answerSheet: cloneAnswerSheetEntries(item.answerSheet || [])
  };
}

function getPublishedDetailPageOverrides(pageKey) {
  if (!pageKey) {
    return {};
  }

  return publishedDetailOverrideState.store?.[pageKey] || {};
}

function applyStructuredDetailOverrides(item, overrides = {}) {
  const cloned = cloneDetailRecord(item);

  if (!cloned) {
    return cloned;
  }

  const langKey = currentLang === "en" ? "en" : "zh";
  const langOverrides = overrides.languages?.[langKey] || {};
  const answerOverrides = overrides.answers || {};
  const exerciseCollectionKey = getExerciseCollectionKey(cloned);

  if (Object.prototype.hasOwnProperty.call(langOverrides, "overview")) {
    cloned.overview = String(langOverrides.overview || "");
  }

  if (Object.prototype.hasOwnProperty.call(langOverrides, "heroTitle")) {
    cloned.heroTitle = String(langOverrides.heroTitle || "");
  }

  if (Object.prototype.hasOwnProperty.call(langOverrides, "summary")) {
    cloned.summary = String(langOverrides.summary || "");
  }

  if (Object.prototype.hasOwnProperty.call(langOverrides, "tip")) {
    cloned.tip = String(langOverrides.tip || "");
  }

  if (Array.isArray(langOverrides.focus)) {
    cloned.focus = [...langOverrides.focus];
  }

  if (Array.isArray(langOverrides.rules)) {
    cloned.rules = cloneRuleBlocks(langOverrides.rules);
  }

  if (Object.prototype.hasOwnProperty.call(langOverrides, "answerSheetNote")) {
    cloned.answerSheetNote = String(langOverrides.answerSheetNote || "");
  }

  if (exerciseCollectionKey) {
    const questionOverrides = langOverrides.quickExerciseQuestions || {};
    const explanationOverrides = langOverrides.quickExerciseExplanations || {};
    cloned[exerciseCollectionKey] = (cloned[exerciseCollectionKey] || []).map((exercise, index) => (
      ({
        ...exercise,
        question: Object.prototype.hasOwnProperty.call(questionOverrides, String(index))
          ? String(questionOverrides[String(index)] || "")
          : exercise.question,
        explanation: Object.prototype.hasOwnProperty.call(explanationOverrides, String(index))
          ? String(explanationOverrides[String(index)] || "")
          : exercise.explanation
      })
    ));
  }

  const exampleOverrides = langOverrides.exampleContents || {};
  if (Array.isArray(cloned.localizedExamples)) {
    cloned.localizedExamples = cloned.localizedExamples.map((example, index) => (
      ({
        ...example,
        de: Object.prototype.hasOwnProperty.call(exampleOverrides, String(index))
          ? String(exampleOverrides[String(index)] || "")
          : (example.de || "")
      })
    ));
  }

  if (Array.isArray(cloned.examples)) {
    cloned.examples = cloned.examples.map((example, index) => (
      ({
        ...example,
        de: Object.prototype.hasOwnProperty.call(exampleOverrides, String(index))
          ? String(exampleOverrides[String(index)] || "")
          : (example.de || "")
      })
    ));
  }

  if (Array.isArray(cloned.bookExercises)) {
    const bookTitleOverrides = langOverrides.bookTitles || {};
    const bookOptionOverrides = langOverrides.bookOptions || {};
    const bookPromptOverrides = langOverrides.bookPrompts || {};
    const bookExplanationOverrides = langOverrides.bookExplanations || {};
    const bookAnswerOverrides = answerOverrides.book || {};
    cloned.bookExercises = cloned.bookExercises.map((exercise) => ({
      ...exercise,
      title: Object.prototype.hasOwnProperty.call(bookTitleOverrides, String(exercise.id))
        ? String(bookTitleOverrides[String(exercise.id)] || "")
        : exercise.title,
      options: (exercise.options || []).map((option, index) => {
        const key = `${exercise.id}:${index}`;
        return Object.prototype.hasOwnProperty.call(bookOptionOverrides, key)
          ? String(bookOptionOverrides[key] || "")
          : option;
      }),
      lines: (exercise.lines || []).map((line, index) => {
        const key = `${exercise.id}:${index}`;
        return Object.prototype.hasOwnProperty.call(bookPromptOverrides, key)
          ? String(bookPromptOverrides[key] || "")
          : line;
      }),
      answers: (exercise.answers || []).map((answer, index) => {
        const key = `${exercise.id}:${index}`;
        return Object.prototype.hasOwnProperty.call(bookAnswerOverrides, key)
          ? String(bookAnswerOverrides[key] || "")
          : answer;
      }),
      explanations: (exercise.lines || []).map((_, index) => {
        const key = `${exercise.id}:${index}`;
        return Object.prototype.hasOwnProperty.call(bookExplanationOverrides, key)
          ? String(bookExplanationOverrides[key] || "")
          : (exercise.explanations?.[index] || "");
      })
    }));
  }

  if (cloned.referenceChecks?.checks?.length) {
    const referencePromptOverrides = langOverrides.referencePrompts || {};
    const referenceExplanationOverrides = langOverrides.referenceExplanations || {};
    const referenceOverrides = answerOverrides.reference || {};
    cloned.referenceChecks = {
      ...cloned.referenceChecks,
      title: Object.prototype.hasOwnProperty.call(langOverrides, "referenceTitle")
        ? String(langOverrides.referenceTitle || "")
        : cloned.referenceChecks.title,
      description: Object.prototype.hasOwnProperty.call(langOverrides, "referenceDescription")
        ? String(langOverrides.referenceDescription || "")
        : cloned.referenceChecks.description,
      passage: Array.isArray(langOverrides.referencePassage)
        ? [...langOverrides.referencePassage]
        : [...(cloned.referenceChecks.passage || [])],
      checks: cloned.referenceChecks.checks.map((check, index) => (
        ({
          ...check,
          prompt: Object.prototype.hasOwnProperty.call(referencePromptOverrides, String(index))
            ? String(referencePromptOverrides[String(index)] || "")
            : check.prompt,
          explanation: Object.prototype.hasOwnProperty.call(referenceExplanationOverrides, String(index))
            ? String(referenceExplanationOverrides[String(index)] || "")
            : (check.explanation || ""),
          answer: Object.prototype.hasOwnProperty.call(referenceOverrides, String(index))
            ? String(referenceOverrides[String(index)] || "")
            : check.answer
        })
      ))
    };
  }

  if (Array.isArray(answerOverrides.answerSheet)) {
    cloned.answerSheet = cloneAnswerSheetEntries(answerOverrides.answerSheet);
  }

  return cloned;
}

function applyPublishedDetailOverrides(item, metadata = {}) {
  const pageKey = getDetailPageKey(metadata.level, metadata.topicId || item?.id, metadata.subunitCode);
  return applyStructuredDetailOverrides(item, getPublishedDetailPageOverrides(pageKey));
}

function applyLocalDetailOverrides(item, metadata = {}) {
  if (!detailEditorState.enabled) {
    return cloneDetailRecord(item);
  }

  const pageKey = getDetailPageKey(metadata.level, metadata.topicId || item?.id, metadata.subunitCode);
  return applyStructuredDetailOverrides(item, getDetailPageOverrides(pageKey));
}

function getLocalEditorUi() {
  if (currentLang === "en") {
    return {
      title: "Local Draft Editor",
      note: "Visible only on this computer when you open the site locally. Public visitors cannot use these edits.",
      save: "Save Local Draft",
      publish: "Publish To Site",
      reset: "Reload Draft",
      publishHelp: "Published changes become visible to website visitors after they refresh the page.",
      publishReady: "Local draft saved. Publish when you are ready.",
      publishDone: "Published. Visitors will see the update after refreshing.",
      publishFailed: "Publishing failed.",
      heroTitle: "Lesson title",
      summary: "Page summary",
      overview: "Knowledge explanation",
      tip: "Study tip",
      focus: "Key points",
      focusHint: "One point per line.",
      materialsTitle: "Page materials",
      rulesTitle: "Rule cards",
      ruleCardLabel: "Rule card",
      ruleTitleLabel: "Card title",
      ruleSubtitleLabel: "Card subtitle",
      ruleHeadersLabel: "Table headers",
      ruleHeadersHint: "Use | to separate cells.",
      ruleRowsLabel: "Table rows",
      ruleRowsHint: "One row per line, use | between cells.",
      rulePairsLabel: "Pair items",
      rulePairsHint: "One pair per line: label | value",
      ruleNoteLabel: "Card note",
      ruleTextLabel: "Card text",
      sourcesTitle: "Original materials",
      exerciseTitleLabel: "Exercise title",
      descriptionLabel: "Description",
      passageLabel: "Passage",
      passageHint: "One paragraph per line.",
      answers: "Answer notes",
      answerSheet: "Answer sheet",
      answerSheetHint: "One line per answer-sheet entry.",
      answerSheetNote: "Answer-sheet note",
      quickTitle: "Quick exercise explanations",
      readingTextsTitle: "Reading texts",
      readingTextLabel: "Reading text",
      bookTitle: "Book exercise answers",
      referenceTitle: "Reference answers",
      questionLabel: "Question",
      promptLabel: "Prompt",
      explanationLabel: "Explanation",
      answerLabel: "Suggested answer",
      practiceUiTitle: "Question UI",
      practiceUiLabel: "UI config (JSON)",
      practiceUiHint: "Edit button visibility, labels, placeholders and feedback copy here. Use false to hide UI and empty strings to remove text.",
      jumpToEditor: "Edit this task",
      jumpToQuestion: "Back to task",
      noAnswerArea: "This page does not have editable answer notes yet."
    };
  }

  return {
    title: "本地编辑模式",
    note: "只有你在本机用本地方式打开页面时才会看到这里。公网访客看不到，也无法编辑这些内容。",
    save: "保存本地草稿",
    reset: "重新载入",
    heroTitle: "页面主标题",
    summary: "页面摘要",
    overview: "知识讲解",
    tip: "学习提示",
    focus: "要点列表",
    focusHint: "每行一个要点。",
    materialsTitle: "页面材料",
    rulesTitle: "规则卡片",
    ruleCardLabel: "规则卡",
    ruleTitleLabel: "卡片标题",
    ruleSubtitleLabel: "卡片副标题",
    ruleHeadersLabel: "表头",
    ruleHeadersHint: "用 | 分隔每一格。",
    ruleRowsLabel: "表格内容",
    ruleRowsHint: "每行一行，用 | 分隔每一格。",
    rulePairsLabel: "成对内容",
    rulePairsHint: "每行一组：左侧 | 右侧",
    ruleNoteLabel: "卡片备注",
    ruleTextLabel: "卡片正文",
    sourcesTitle: "原书材料",
    exerciseTitleLabel: "练习标题",
    descriptionLabel: "说明文字",
    passageLabel: "正文材料",
    passageHint: "每行一个段落。",
    answers: "答案解析",
    answerSheet: "答案总览",
    answerSheetHint: "每行一条答案总览内容。",
    answerSheetNote: "答案总览备注",
    quickTitle: "交互练习解析",
    readingTextsTitle: "阅读原文",
    readingTextLabel: "原文",
    bookTitle: "原书练习参考答案",
    referenceTitle: "指代题参考答案",
    questionLabel: "题干",
    promptLabel: "题干",
    explanationLabel: "解析",
    answerLabel: "参考答案",
    practiceUiTitle: "题目 UI 配置",
    practiceUiLabel: "UI 配置（JSON）",
    practiceUiHint: "这里可以改按钮显隐、文字、占位字和反馈文案。写 false 可以隐藏 UI，留空字符串就能去掉文字。",
    jumpToEditor: "编辑这题",
    jumpToQuestion: "回到题目",
    noAnswerArea: "这个页面目前没有可编辑的答案解析项。"
  };
}

function getHomePublishUi() {
  if (currentLang === "en") {
    return {
      title: "Publish Website",
      note: "The public website now uses a published snapshot. Local code or draft edits will not appear online until you publish here.",
      publish: "Publish Website",
      refresh: "Reload Status",
      localCount: "Local drafts",
      publishedCount: "Published pages",
      noDrafts: "No local drafts are waiting, but you can still publish the current website snapshot.",
      publishing: "Publishing the current website snapshot...",
      done: "Published. Visitors will see the update after refreshing.",
      failed: "Publishing failed. Please make sure the local website service is still running.",
      detailHint: "Detail pages now only save drafts. Publishing is handled here on the home page."
    };
  }

  return {
    title: "发布网站",
    note: "公网网站现在读取的是一份已发布快照。本地代码或草稿改动不会自动同步，只有在这里点发布后才会上线。",
    publish: "发布网站",
    refresh: "重新读取状态",
    localCount: "本地草稿",
    publishedCount: "已发布页面",
    noDrafts: "当前没有等待发布的本地草稿，但你仍然可以发布当前网站快照。",
    publishing: "正在发布当前网站快照……",
    done: "发布完成，别人刷新页面后就能看到更新。",
    failed: "发布失败，请确认本地网站服务仍在运行。",
    detailHint: "详情页现在只负责保存草稿，正式发布统一在首页完成。"
  };
}

function getHomeApiConfigUi() {
  if (currentLang === "en") {
    return {
      title: "AI Key",
      note: "Local only. Paste your direct API key here. The site will connect to Novai's OpenAI-compatible endpoint.",
      apiKey: "Direct API Key",
      save: "Save and Use",
      saving: "Saving and reconnecting AI...",
      loading: "Loading local API settings...",
      loadFailed: "Could not load the local API settings.",
      saveDone: "Saved. The AI bridge is reconnecting now.",
      saveFailed: "Saving failed. Please make sure the local website service is still running.",
      apiKeyPlaceholder: "Paste your Novai API key here",
      saveMissing: "Paste the key first."
    };
  }

  return {
    title: "AI 密钥",
    note: "仅本机可见。这里直接连接 Novai 的 OpenAI 兼容接口，不再走网页中转。",
    apiKey: "直连 API Key",
    save: "保存并使用",
    saving: "正在保存并重连 AI…",
    loading: "正在读取本机 API 设置…",
    loadFailed: "读取本机 API 设置失败。",
    saveDone: "已保存，AI bridge 正在重连。",
    saveFailed: "保存失败，请确认本地网站服务仍在运行。",
    apiKeyPlaceholder: "把 Novai 的 API key 填在这里",
    saveMissing: "先把密钥填进去。"
  };
}

function serializeAnswerSheetEntries(answerSheet) {
  return (answerSheet || [])
    .map((entry) => {
      if (entry && typeof entry === "object") {
        return `${entry.label || ""}: ${entry.value || ""}`.trim();
      }

      return String(entry || "");
    })
    .join("\n");
}

function buildDetailOverridesFromEditor(container, baseOverrides = {}) {
  const langKey = currentLang === "en" ? "en" : "zh";
  const existingLangOverrides = {
    ...(((baseOverrides.languages || {})[langKey]) || {})
  };
  const nextOverrides = {
    ...baseOverrides,
    languages: {
      ...(baseOverrides.languages || {})
    },
    answers: {
      ...(baseOverrides.answers || {}),
      book: {
        ...((baseOverrides.answers || {}).book || {})
      },
      reference: {
        ...((baseOverrides.answers || {}).reference || {})
      }
    }
  };

  nextOverrides.languages[langKey] = {
    ...existingLangOverrides,
    quickExerciseQuestions: {},
    quickExerciseExplanations: {},
    exampleContents: {},
    bookOptions: {},
    bookPrompts: {},
    bookExplanations: {},
    referencePrompts: {},
    referenceExplanations: {},
    bookTitles: {}
  };

  const heroTitleField = container.querySelector('[data-local-editor-field="heroTitle"]');
  if (heroTitleField) {
    nextOverrides.languages[langKey].heroTitle = heroTitleField.value || "";
  }

  const summaryField = container.querySelector('[data-local-editor-field="summary"]');
  if (summaryField) {
    nextOverrides.languages[langKey].summary = summaryField.value || "";
  }

  const overviewField = container.querySelector('[data-local-editor-field="overview"]');
  if (overviewField) {
    nextOverrides.languages[langKey].overview = overviewField.value || "";
  }

  const tipField = container.querySelector('[data-local-editor-field="tip"]');
  if (tipField) {
    nextOverrides.languages[langKey].tip = tipField.value || "";
  }

  const focusField = container.querySelector('[data-local-editor-field="focus"]');
  if (focusField) {
    nextOverrides.languages[langKey].focus = splitEditorLines(focusField.value || "");
  }

  const answerSheetNoteField = container.querySelector('[data-local-editor-field="answerSheetNote"]');
  if (answerSheetNoteField) {
    nextOverrides.languages[langKey].answerSheetNote = answerSheetNoteField.value || "";
  }

  const ruleBlocks = Array.from(container.querySelectorAll("[data-local-editor-rule-block]"));
  if (ruleBlocks.length) {
    nextOverrides.languages[langKey].rules = ruleBlocks.map((block) => {
      const kind = String(block.dataset.localEditorRuleKind || "callout");
      const rule = {
        kind,
        title: block.querySelector("[data-local-editor-rule-title]")?.value || ""
      };

      if (kind === "table") {
        rule.subtitle = block.querySelector("[data-local-editor-rule-subtitle]")?.value || "";
        rule.headers = splitEditorPipeCells(block.querySelector("[data-local-editor-rule-headers]")?.value || "");
        rule.rows = parseEditorPipeMatrix(block.querySelector("[data-local-editor-rule-rows]")?.value || "");
        rule.note = block.querySelector("[data-local-editor-rule-note]")?.value || "";
      } else if (kind === "pairs") {
        rule.items = parseRulePairs(block.querySelector("[data-local-editor-rule-pairs]")?.value || "");
        rule.note = block.querySelector("[data-local-editor-rule-note]")?.value || "";
      } else {
        rule.text = block.querySelector("[data-local-editor-rule-text]")?.value || "";
      }

      return rule;
    });
  }

  container.querySelectorAll("[data-local-editor-question-index]").forEach((field) => {
    nextOverrides.languages[langKey].quickExerciseQuestions[field.dataset.localEditorQuestionIndex] = field.value || "";
  });

  container.querySelectorAll("[data-local-editor-example-index]").forEach((field) => {
    nextOverrides.languages[langKey].exampleContents[field.dataset.localEditorExampleIndex] = field.value || "";
  });

  container.querySelectorAll("[data-local-editor-book-title]").forEach((field) => {
    nextOverrides.languages[langKey].bookTitles[field.dataset.localEditorBookTitle] = field.value || "";
  });

  container.querySelectorAll("[data-local-editor-book-option]").forEach((field) => {
    nextOverrides.languages[langKey].bookOptions[field.dataset.localEditorBookOption] = field.value || "";
  });

  container.querySelectorAll("[data-local-editor-explanation-index]").forEach((field) => {
    nextOverrides.languages[langKey].quickExerciseExplanations[field.dataset.localEditorExplanationIndex] = field.value || "";
  });

  container.querySelectorAll("[data-local-editor-book-prompt]").forEach((field) => {
    nextOverrides.languages[langKey].bookPrompts[field.dataset.localEditorBookPrompt] = field.value || "";
  });

  container.querySelectorAll("[data-local-editor-book-explanation]").forEach((field) => {
    nextOverrides.languages[langKey].bookExplanations[field.dataset.localEditorBookExplanation] = field.value || "";
  });

  container.querySelectorAll("[data-local-editor-book-answer]").forEach((field) => {
    nextOverrides.answers.book[field.dataset.localEditorBookAnswer] = field.value || "";
  });

  container.querySelectorAll("[data-local-editor-reference-prompt]").forEach((field) => {
    nextOverrides.languages[langKey].referencePrompts[field.dataset.localEditorReferencePrompt] = field.value || "";
  });

  container.querySelectorAll("[data-local-editor-reference-explanation]").forEach((field) => {
    nextOverrides.languages[langKey].referenceExplanations[field.dataset.localEditorReferenceExplanation] = field.value || "";
  });

  container.querySelectorAll("[data-local-editor-reference-answer]").forEach((field) => {
    nextOverrides.answers.reference[field.dataset.localEditorReferenceAnswer] = field.value || "";
  });

  const referenceTitleField = container.querySelector('[data-local-editor-field="referenceTitle"]');
  if (referenceTitleField) {
    nextOverrides.languages[langKey].referenceTitle = referenceTitleField.value || "";
  }

  const referenceDescriptionField = container.querySelector('[data-local-editor-field="referenceDescription"]');
  if (referenceDescriptionField) {
    nextOverrides.languages[langKey].referenceDescription = referenceDescriptionField.value || "";
  }

  const referencePassageField = container.querySelector('[data-local-editor-field="referencePassage"]');
  if (referencePassageField) {
    nextOverrides.languages[langKey].referencePassage = splitEditorLines(referencePassageField.value || "");
  }

  const answerSheetField = container.querySelector('[data-local-editor-field="answerSheet"]');

  if (answerSheetField) {
    nextOverrides.answers.answerSheet = splitEditorLines(answerSheetField.value || "");
  }

  return nextOverrides;
}

function renderLocalDetailEditor(item, metadata = {}) {
  const container = document.getElementById("detail-local-editor");

  if (!container) {
    return;
  }

  if (!detailEditorState.enabled || !item || metadata.pageType === "outline") {
    container.hidden = true;
    container.innerHTML = "";
    detailEditorState.pageKey = "";
    return;
  }

  const ui = getLocalEditorUi();
  const isSubunitPage = metadata.pageType === "subunit";
  const isReadingTopic = metadata.sourcePart === "reading" || Array.isArray(item.readingBlocks);
  const showLeadSupportFields = !isSubunitPage;
  const exerciseCollectionKey = getExerciseCollectionKey(item);
  const quickExercises = exerciseCollectionKey ? (item[exerciseCollectionKey] || []) : [];
  const readingTexts = (isReadingTopic ? (item.localizedExamples || item.examples || []) : []).map((example, index) => ({
    index,
    text: example?.de || ""
  }));
  const ruleBlocks = isSubunitPage ? getVisibleSubunitRuleBlocks(item.rules || []) : (item.rules || []);
  const bookMaterials = (item.bookExercises || []).map((exercise) => ({
    id: exercise.id,
    title: exercise.title || ""
  }));
  const referenceMaterial = item.referenceChecks?.checks?.length ? {
    id: item.referenceChecks.id || "7",
    title: item.referenceChecks.title || "",
    description: getReferenceExerciseDescription(item.referenceChecks),
    passage: (item.referenceChecks.passage || []).join("\n")
  } : null;
  const bookAnswers = (item.bookExercises || []).flatMap((exercise) => (
    (exercise.lines || []).map((line, lineIndex) => ({
      key: `${exercise.id}:${lineIndex}`,
      practiceKey: `${exercise.id}-${lineIndex}`,
      label: `Book ${exercise.id} · ${currentLang === "en" ? "Line" : "小题"} ${lineIndex + 1}`,
      prompt: line,
      value: exercise.answers?.[lineIndex] || "",
      explanation: exercise.explanations?.[lineIndex] || ""
    }))
  ));
  const referenceAnswers = (item.referenceChecks?.checks || []).map((check, index) => ({
    key: String(index),
    practiceKey: `${item.referenceChecks?.id || "7"}-${index}`,
    label: `${currentLang === "en" ? "Reference" : "指代题"} ${index + 1}`,
    prompt: check.prompt,
    value: check.answer || "",
    explanation: check.explanation || ""
  }));
  const hasAnswerArea = quickExercises.length || bookAnswers.length || referenceAnswers.length || (item.answerSheet || []).length || item.answerSheetNote;
  const overviewEditorCard = isSubunitPage ? `
    <div id="${escapeHtml(getEditorTargetId("overview", "main"))}" class="local-editor-card">
      <div class="local-editor-card-head">
        <span>${escapeHtml(ui.overview)}</span>
        <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="detail-guide-panel">${escapeHtml(ui.jumpToQuestion)}</button>
      </div>
      <label class="local-editor-field">
        <span>${escapeHtml(ui.overview)}</span>
        <textarea data-local-editor-field="overview" rows="8">${escapeHtml(item.overview || "")}</textarea>
      </label>
    </div>
  ` : "";
  const hasMaterialsEditor = Boolean(overviewEditorCard || ruleBlocks.length || bookMaterials.length || referenceMaterial);
  const nextPageKey = getDetailPageKey(metadata.level, metadata.topicId || item.id, metadata.subunitCode);
  const publishLabel = ui.publish || (currentLang === "en" ? "Publish To Site" : "发布到网站");
  const publishHelp = ui.publishHelp || (currentLang === "en"
    ? "Published changes become visible to website visitors after they refresh the page."
    : "点发布后，会写入网站正式内容；别人刷新页面后就能看到更新。");
  const feedbackVariant = ["success", "error", "info"].includes(detailEditorState.feedbackVariant)
    ? detailEditorState.feedbackVariant
    : "info";

  if (detailEditorState.pageKey && detailEditorState.pageKey !== nextPageKey) {
    detailEditorState.feedbackMessage = "";
    detailEditorState.feedbackVariant = "info";
  }

  detailEditorState.pageKey = nextPageKey;
  detailEditorState.pageType = metadata.pageType || "topic";
  detailEditorState.level = metadata.level || "";
  detailEditorState.topicId = metadata.topicId || item.id || "";
  detailEditorState.subunitCode = metadata.subunitCode || "";

  const mirrorBookGroups = (item.bookExercises || []).map((exercise) => ({
    id: exercise.id,
    title: exercise.title || "",
    options: (exercise.options || []).map((option, optionIndex) => {
      const parsedOption = parseBookOptionText(option, optionIndex);
      return {
        key: `${exercise.id}:${optionIndex}`,
        label: parsedOption.label,
        value: option || ""
      };
    }),
    entries: (exercise.lines || []).map((line, lineIndex) => ({
      key: `${exercise.id}:${lineIndex}`,
      practiceKey: `${exercise.id}-${lineIndex}`,
      prompt: line,
      value: exercise.answers?.[lineIndex] || ""
    }))
  }));
  const mirrorReferenceMaterial = item.referenceChecks?.checks?.length ? {
    id: item.referenceChecks.id || "7",
    title: item.referenceChecks.title || "",
    description: getReferenceExerciseDescription(item.referenceChecks),
    passage: (item.referenceChecks.passage || []).join("\n"),
    checks: (item.referenceChecks.checks || []).map((check, index) => ({
      key: String(index),
      practiceKey: `${item.referenceChecks?.id || "7"}-${index}`,
      prompt: check.prompt,
      value: check.answer || ""
    }))
  } : null;
  const mirrorHasAnswerArea = quickExercises.length || (item.answerSheet || []).length || item.answerSheetNote;
  const heroEditorSection = (Object.prototype.hasOwnProperty.call(item, "heroTitle") || Object.prototype.hasOwnProperty.call(item, "summary")) ? `
    <section class="detail-panel local-editor-preview-panel">
      <div class="panel-header detail-panel-header">
        <div>
          <p class="section-kicker">${escapeHtml(currentLang === "en" ? "Header" : "页面开头")}</p>
          <h2>${escapeHtml(currentLang === "en" ? "Page Header" : "页面开头")}</h2>
        </div>
      </div>
      <div class="local-editor-inline-grid">
        ${Object.prototype.hasOwnProperty.call(item, "heroTitle") ? `
          <label class="local-editor-field">
            <span>${escapeHtml(ui.heroTitle)}</span>
            <textarea data-local-editor-field="heroTitle" rows="3">${escapeHtml(item.heroTitle || "")}</textarea>
          </label>
        ` : ""}
        ${Object.prototype.hasOwnProperty.call(item, "summary") ? `
          <label class="local-editor-field">
            <span>${escapeHtml(ui.summary)}</span>
            <textarea data-local-editor-field="summary" rows="4">${escapeHtml(item.summary || "")}</textarea>
          </label>
        ` : ""}
      </div>
    </section>
  ` : "";
  const guideEditorSection = `
    <section id="${escapeHtml(getEditorTargetId("overview", "main"))}" class="detail-panel local-editor-preview-panel">
      <div class="panel-header detail-panel-header">
        <div>
          <p class="section-kicker">Grammar Guide</p>
          <h2>${escapeHtml(currentLang === "en" ? "Knowledge Explanation" : "知识讲解")}</h2>
        </div>
        <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="detail-guide-panel">${escapeHtml(ui.jumpToQuestion)}</button>
      </div>
      <label class="local-editor-field">
        <span>${escapeHtml(ui.overview)}</span>
        <textarea data-local-editor-field="overview" rows="8">${escapeHtml(item.overview || "")}</textarea>
      </label>
    </section>
  `;
  const supportEditorSection = showLeadSupportFields ? `
    <section class="detail-panel local-editor-preview-panel">
      <div class="panel-header detail-panel-header">
        <div>
          <p class="section-kicker">Study Notes</p>
          <h2>${escapeHtml(currentLang === "en" ? "Tips And Key Points" : "学习提示与要点")}</h2>
        </div>
      </div>
      <div class="local-editor-inline-grid">
        <label class="local-editor-field">
          <span>${escapeHtml(ui.tip)}</span>
          <textarea data-local-editor-field="tip" rows="3">${escapeHtml(item.tip || "")}</textarea>
        </label>
        <label class="local-editor-field">
          <span>${escapeHtml(ui.focus)}</span>
          <small>${escapeHtml(ui.focusHint)}</small>
          <textarea data-local-editor-field="focus" rows="6">${escapeHtml((item.focus || []).join("\n"))}</textarea>
        </label>
      </div>
    </section>
  ` : "";
  const rulesEditorSection = ruleBlocks.length ? `
    <section class="detail-panel detail-panel-wide local-editor-preview-panel">
      <div class="panel-header detail-panel-header">
        <div>
          <p class="section-kicker">Examples</p>
          <h2>${escapeHtml(currentLang === "en" ? "Core Tables" : "核心表格")}</h2>
        </div>
      </div>
      <div class="rule-grid">
        ${ruleBlocks.map((rule, index) => `
          <article
            id="${escapeHtml(getEditorTargetId("rule", index))}"
            class="rule-card ${escapeHtml(rule.kind === "table" ? "rule-card-table" : rule.kind === "pairs" ? "rule-card-pairs" : "rule-card-callout")}"
            data-local-editor-rule-block
            data-local-editor-rule-kind="${escapeHtml(rule.kind || "callout")}"
          >
            <div class="rule-card-head">
              <div>
                <h3>${escapeHtml(`${ui.ruleCardLabel} ${index + 1}`)}</h3>
              </div>
              <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("rule", index))}">${escapeHtml(ui.jumpToQuestion)}</button>
            </div>
            <label class="local-editor-field">
              <span>${escapeHtml(ui.ruleTitleLabel)}</span>
              <textarea data-local-editor-rule-title rows="2">${escapeHtml(rule.title || "")}</textarea>
            </label>
            ${rule.kind === "table" ? `
              <label class="local-editor-field">
                <span>${escapeHtml(ui.ruleSubtitleLabel)}</span>
                <textarea data-local-editor-rule-subtitle rows="2">${escapeHtml(rule.subtitle || "")}</textarea>
              </label>
              <label class="local-editor-field">
                <span>${escapeHtml(ui.ruleHeadersLabel)}</span>
                <small>${escapeHtml(ui.ruleHeadersHint)}</small>
                <textarea data-local-editor-rule-headers rows="2">${escapeHtml(serializeEditorPipeRow(rule.headers || []))}</textarea>
              </label>
              <label class="local-editor-field">
                <span>${escapeHtml(ui.ruleRowsLabel)}</span>
                <small>${escapeHtml(ui.ruleRowsHint)}</small>
                <textarea data-local-editor-rule-rows rows="6">${escapeHtml(serializeEditorPipeMatrix(rule.rows || []))}</textarea>
              </label>
              <label class="local-editor-field">
                <span>${escapeHtml(ui.ruleNoteLabel)}</span>
                <textarea data-local-editor-rule-note rows="3">${escapeHtml(rule.note || "")}</textarea>
              </label>
            ` : ""}
            ${rule.kind === "pairs" ? `
              <label class="local-editor-field">
                <span>${escapeHtml(ui.rulePairsLabel)}</span>
                <small>${escapeHtml(ui.rulePairsHint)}</small>
                <textarea data-local-editor-rule-pairs rows="5">${escapeHtml(serializeRulePairs(rule.items || []))}</textarea>
              </label>
              <label class="local-editor-field">
                <span>${escapeHtml(ui.ruleNoteLabel)}</span>
                <textarea data-local-editor-rule-note rows="3">${escapeHtml(rule.note || "")}</textarea>
              </label>
            ` : ""}
            ${rule.kind !== "table" && rule.kind !== "pairs" ? `
              <label class="local-editor-field">
                <span>${escapeHtml(ui.ruleTextLabel)}</span>
                <textarea data-local-editor-rule-text rows="4">${escapeHtml(rule.text || "")}</textarea>
              </label>
            ` : ""}
          </article>
        `).join("")}
      </div>
    </section>
  ` : "";
  const sourceEditorSection = (mirrorBookGroups.length || mirrorReferenceMaterial) ? `
    <section class="detail-panel detail-panel-wide local-editor-preview-panel">
      <div class="panel-header detail-panel-header">
        <div>
          <p class="section-kicker">Practice</p>
          <h2>${escapeHtml(currentLang === "en" ? "Original Materials" : "原书材料")}</h2>
        </div>
      </div>
      <div class="source-stack">
        ${mirrorBookGroups.map((exercise) => `
          <article id="${escapeHtml(getEditorTargetId("book-meta", exercise.id))}" class="source-card">
            <div class="source-card-head">
              <div>
                <span class="exercise-index">Book ${escapeHtml(exercise.id)}</span>
                <h3>${escapeHtml(currentLang === "en" ? "Editable Exercise" : "可编辑练习")}</h3>
              </div>
              <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("book-meta", exercise.id))}">${escapeHtml(ui.jumpToQuestion)}</button>
            </div>
            <label class="local-editor-field">
              <span>${escapeHtml(ui.exerciseTitleLabel)}</span>
              <textarea data-local-editor-book-title="${escapeHtml(exercise.id)}" rows="2">${escapeHtml(exercise.title || "")}</textarea>
            </label>
            ${exercise.options.length ? `
              <div class="local-editor-subgroup">
                ${exercise.options.map((optionEntry) => `
                  <label class="local-editor-field">
                    <span>${escapeHtml(`${currentLang === "en" ? "Option" : "选项"} ${optionEntry.label}`)}</span>
                    <textarea data-local-editor-book-option="${escapeHtml(optionEntry.key)}" rows="2">${escapeHtml(optionEntry.value || "")}</textarea>
                  </label>
                `).join("")}
              </div>
            ` : ""}
            <div class="local-editor-subgroup">
              ${exercise.entries.map((entry, lineIndex) => `
                <div id="${escapeHtml(getEditorTargetId("book", entry.practiceKey))}" class="local-editor-card">
                  <div class="local-editor-card-head">
                    <span>${escapeHtml(`Book ${exercise.id} · ${currentLang === "en" ? "Line" : "小题"} ${lineIndex + 1}`)}</span>
                    <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("book", entry.practiceKey))}">${escapeHtml(ui.jumpToQuestion)}</button>
                  </div>
                  <label class="local-editor-field">
                    <span>${escapeHtml(ui.promptLabel)}</span>
                    <textarea data-local-editor-book-prompt="${escapeHtml(entry.key)}" rows="3">${escapeHtml(entry.prompt || "")}</textarea>
                  </label>
                  <label class="local-editor-field">
                    <span>${escapeHtml(ui.answerLabel)}</span>
                    <textarea data-local-editor-book-answer="${escapeHtml(entry.key)}" rows="2">${escapeHtml(entry.value || "")}</textarea>
                  </label>
                </div>
              `).join("")}
            </div>
          </article>
        `).join("")}
        ${mirrorReferenceMaterial ? `
          <article id="${escapeHtml(getEditorTargetId("reference-meta", mirrorReferenceMaterial.id))}" class="source-card source-card-reference">
            <div class="source-card-head">
              <div>
                <span class="exercise-index">Book ${escapeHtml(mirrorReferenceMaterial.id)}</span>
                <h3>${escapeHtml(currentLang === "en" ? "Editable Reference" : "可编辑指代材料")}</h3>
              </div>
              <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("reference-meta", mirrorReferenceMaterial.id))}">${escapeHtml(ui.jumpToQuestion)}</button>
            </div>
            <label class="local-editor-field">
              <span>${escapeHtml(ui.exerciseTitleLabel)}</span>
              <textarea data-local-editor-field="referenceTitle" rows="2">${escapeHtml(mirrorReferenceMaterial.title || "")}</textarea>
            </label>
            <label class="local-editor-field">
              <span>${escapeHtml(ui.descriptionLabel)}</span>
              <textarea data-local-editor-field="referenceDescription" rows="3">${escapeHtml(mirrorReferenceMaterial.description || "")}</textarea>
            </label>
            <label class="local-editor-field">
              <span>${escapeHtml(ui.passageLabel)}</span>
              <small>${escapeHtml(ui.passageHint)}</small>
              <textarea data-local-editor-field="referencePassage" rows="10">${escapeHtml(mirrorReferenceMaterial.passage || "")}</textarea>
            </label>
            <div class="local-editor-subgroup">
              ${mirrorReferenceMaterial.checks.map((entry, index) => `
                <div id="${escapeHtml(getEditorTargetId("reference", entry.practiceKey))}" class="local-editor-card">
                  <div class="local-editor-card-head">
                    <span>${escapeHtml(`${currentLang === "en" ? "Reference" : "指代题"} ${index + 1}`)}</span>
                    <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("reference", entry.practiceKey))}">${escapeHtml(ui.jumpToQuestion)}</button>
                  </div>
                  <label class="local-editor-field">
                    <span>${escapeHtml(ui.promptLabel)}</span>
                    <textarea data-local-editor-reference-prompt="${escapeHtml(entry.key)}" rows="3">${escapeHtml(entry.prompt || "")}</textarea>
                  </label>
                  <label class="local-editor-field">
                    <span>${escapeHtml(ui.answerLabel)}</span>
                    <textarea data-local-editor-reference-answer="${escapeHtml(entry.key)}" rows="2">${escapeHtml(entry.value || "")}</textarea>
                  </label>
                </div>
              `).join("")}
            </div>
          </article>
        ` : ""}
      </div>
    </section>
  ` : "";
  const readingTextsEditorSection = readingTexts.length ? `
    <section class="detail-panel detail-panel-wide local-editor-preview-panel">
      <div class="panel-header detail-panel-header">
        <div>
          <p class="section-kicker">Reading</p>
          <h2>${escapeHtml(ui.readingTextsTitle || (currentLang === "en" ? "Reading texts" : "阅读原文"))}</h2>
        </div>
      </div>
      <div class="local-editor-subgroup">
        ${readingTexts.map((itemData) => `
          <div id="${escapeHtml(getEditorTargetId("reading", itemData.index))}" class="local-editor-card">
            <div class="local-editor-card-head">
              <span>${escapeHtml(`${ui.readingTextLabel || (currentLang === "en" ? "Reading text" : "原文")} ${itemData.index + 1}`)}</span>
              <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("reading", itemData.index))}">${escapeHtml(ui.jumpToQuestion)}</button>
            </div>
            <label class="local-editor-field">
              <span>${escapeHtml(ui.readingTextLabel || (currentLang === "en" ? "Reading text" : "原文"))}</span>
              <textarea data-local-editor-example-index="${itemData.index}" rows="12">${escapeHtml(itemData.text || "")}</textarea>
            </label>
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";
  const quickEditorSection = quickExercises.length ? `
    <section class="detail-panel detail-panel-wide local-editor-preview-panel">
      <div class="panel-header detail-panel-header">
        <div>
          <p class="section-kicker">Practice</p>
          <h2>${escapeHtml(ui.quickTitle)}</h2>
        </div>
      </div>
      <div class="local-editor-subgroup">
        ${quickExercises.map((exercise, index) => `
          <div id="${escapeHtml(getEditorTargetId("quick", index))}" class="local-editor-card">
            <div class="local-editor-card-head">
              <span>${escapeHtml(`${ui.questionLabel} ${index + 1}`)}</span>
              <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("quick", index))}">${escapeHtml(ui.jumpToQuestion)}</button>
            </div>
            <label class="local-editor-field">
              <span>${escapeHtml(ui.questionLabel)}</span>
              <textarea data-local-editor-question-index="${index}" rows="3">${escapeHtml(exercise.question || "")}</textarea>
            </label>
            <label class="local-editor-field">
              <span>${escapeHtml(ui.explanationLabel)}</span>
              <textarea data-local-editor-explanation-index="${index}" rows="4">${escapeHtml(exercise.explanation || "")}</textarea>
            </label>
          </div>
        `).join("")}
      </div>
    </section>
  ` : "";
  const answersEditorSection = ((item.answerSheet || []).length || Object.prototype.hasOwnProperty.call(item, "answerSheetNote")) ? `
    <section class="detail-panel detail-panel-wide local-editor-preview-panel">
      <div class="panel-header detail-panel-header">
        <div>
          <p class="section-kicker">Answers</p>
          <h2>${escapeHtml(currentLang === "en" ? "Answer Overview" : "答案总览")}</h2>
        </div>
      </div>
      <div class="local-editor-subgroup">
        ${(item.answerSheet || []).length ? `
          <label class="local-editor-field">
            <span>${escapeHtml(ui.answerSheet)}</span>
            <small>${escapeHtml(ui.answerSheetHint)}</small>
            <textarea data-local-editor-field="answerSheet" rows="6">${escapeHtml(serializeAnswerSheetEntries(item.answerSheet || []))}</textarea>
          </label>
        ` : ""}
        ${Object.prototype.hasOwnProperty.call(item, "answerSheetNote") ? `
          <label class="local-editor-field">
            <span>${escapeHtml(ui.answerSheetNote)}</span>
            <textarea data-local-editor-field="answerSheetNote" rows="3">${escapeHtml(item.answerSheetNote || "")}</textarea>
          </label>
        ` : ""}
      </div>
    </section>
  ` : "";
  const practiceUiEditorSection = "";

  container.hidden = false;
  container.innerHTML = `
    <div class="panel-header detail-panel-header local-editor-head">
      <div>
        <p class="section-kicker">Local Only</p>
        <h2>${escapeHtml(ui.title)}</h2>
      </div>
      <div class="local-editor-actions">
        <button id="detail-local-editor-save" class="primary-button" type="button">${escapeHtml(ui.save)}</button>
        <button id="detail-local-editor-reset" class="ghost-button" type="button">${escapeHtml(ui.reset)}</button>
      </div>
    </div>
    <p class="section-note local-editor-note">${escapeHtml(ui.note)}</p>
    <p class="section-note local-editor-note local-editor-help">${escapeHtml(getHomePublishUi().detailHint)}</p>
    ${detailEditorState.feedbackMessage ? `<p class="local-editor-feedback local-editor-feedback-${feedbackVariant}">${escapeHtml(detailEditorState.feedbackMessage)}</p>` : ""}
    <div class="local-editor-preview-stack">
      ${heroEditorSection}
      ${guideEditorSection}
      ${supportEditorSection}
      ${rulesEditorSection}
      ${sourceEditorSection}
      ${readingTextsEditorSection}
      ${quickEditorSection}
      ${answersEditorSection}
      ${practiceUiEditorSection}
      ${!mirrorHasAnswerArea && !ruleBlocks.length && !mirrorBookGroups.length && !mirrorReferenceMaterial ? `<p class="detail-body">${escapeHtml(ui.noAnswerArea)}</p>` : ""}
    </div>
  `;
  return;

  container.hidden = false;
  container.innerHTML = `
    <div class="panel-header detail-panel-header local-editor-head">
      <div>
        <p class="section-kicker">Local Only</p>
        <h2>${escapeHtml(ui.title)}</h2>
      </div>
      <div class="local-editor-actions">
        <button id="detail-local-editor-save" class="primary-button" type="button">${escapeHtml(ui.save)}</button>
        <button id="detail-local-editor-reset" class="ghost-button" type="button">${escapeHtml(ui.reset)}</button>
      </div>
    </div>
    <p class="section-note local-editor-note">${escapeHtml(ui.note)}</p>
    <p class="section-note local-editor-note local-editor-help">${escapeHtml(getHomePublishUi().detailHint)}</p>
    ${detailEditorState.feedbackMessage ? `<p class="local-editor-feedback local-editor-feedback-${feedbackVariant}">${escapeHtml(detailEditorState.feedbackMessage)}</p>` : ""}
    <div class="local-editor-grid">
      ${Object.prototype.hasOwnProperty.call(item, "heroTitle") ? `
        <label class="local-editor-field">
          <span>${escapeHtml(ui.heroTitle)}</span>
          <textarea data-local-editor-field="heroTitle" rows="3">${escapeHtml(item.heroTitle || "")}</textarea>
        </label>
      ` : ""}
      ${Object.prototype.hasOwnProperty.call(item, "summary") ? `
        <label class="local-editor-field">
          <span>${escapeHtml(ui.summary)}</span>
          <textarea data-local-editor-field="summary" rows="4">${escapeHtml(item.summary || "")}</textarea>
        </label>
      ` : ""}
      ${!isSubunitPage ? `
        <label class="local-editor-field">
          <span>${escapeHtml(ui.overview)}</span>
          <textarea data-local-editor-field="overview" rows="7">${escapeHtml(item.overview || "")}</textarea>
        </label>
      ` : ""}
      ${showLeadSupportFields ? `
        <label class="local-editor-field">
          <span>${escapeHtml(ui.tip)}</span>
          <textarea data-local-editor-field="tip" rows="3">${escapeHtml(item.tip || "")}</textarea>
        </label>
        <label class="local-editor-field">
          <span>${escapeHtml(ui.focus)}</span>
          <small>${escapeHtml(ui.focusHint)}</small>
          <textarea data-local-editor-field="focus" rows="6">${escapeHtml((item.focus || []).join("\n"))}</textarea>
        </label>
      ` : ""}
    </div>
    ${hasMaterialsEditor ? `
      <div class="local-editor-block">
        <h3>${escapeHtml(ui.materialsTitle)}</h3>
        ${overviewEditorCard}
        ${ruleBlocks.length ? `
          <div class="local-editor-subgroup">
            <h4>${escapeHtml(ui.rulesTitle)}</h4>
            ${ruleBlocks.map((rule, index) => `
              <div
                id="${escapeHtml(getEditorTargetId("rule", index))}"
                class="local-editor-card"
                data-local-editor-rule-block
                data-local-editor-rule-kind="${escapeHtml(rule.kind || "callout")}"
              >
                <div class="local-editor-card-head">
                  <span>${escapeHtml(`${ui.ruleCardLabel} ${index + 1}`)}</span>
                  <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("rule", index))}">${escapeHtml(ui.jumpToQuestion)}</button>
                </div>
                <label class="local-editor-field">
                  <span>${escapeHtml(ui.ruleTitleLabel)}</span>
                  <textarea data-local-editor-rule-title rows="2">${escapeHtml(rule.title || "")}</textarea>
                </label>
                ${rule.kind === "table" ? `
                  <label class="local-editor-field">
                    <span>${escapeHtml(ui.ruleSubtitleLabel)}</span>
                    <textarea data-local-editor-rule-subtitle rows="2">${escapeHtml(rule.subtitle || "")}</textarea>
                  </label>
                  <label class="local-editor-field">
                    <span>${escapeHtml(ui.ruleHeadersLabel)}</span>
                    <small>${escapeHtml(ui.ruleHeadersHint)}</small>
                    <textarea data-local-editor-rule-headers rows="2">${escapeHtml(serializeEditorPipeRow(rule.headers || []))}</textarea>
                  </label>
                  <label class="local-editor-field">
                    <span>${escapeHtml(ui.ruleRowsLabel)}</span>
                    <small>${escapeHtml(ui.ruleRowsHint)}</small>
                    <textarea data-local-editor-rule-rows rows="6">${escapeHtml(serializeEditorPipeMatrix(rule.rows || []))}</textarea>
                  </label>
                  <label class="local-editor-field">
                    <span>${escapeHtml(ui.ruleNoteLabel)}</span>
                    <textarea data-local-editor-rule-note rows="3">${escapeHtml(rule.note || "")}</textarea>
                  </label>
                ` : ""}
                ${rule.kind === "pairs" ? `
                  <label class="local-editor-field">
                    <span>${escapeHtml(ui.rulePairsLabel)}</span>
                    <small>${escapeHtml(ui.rulePairsHint)}</small>
                    <textarea data-local-editor-rule-pairs rows="5">${escapeHtml(serializeRulePairs(rule.items || []))}</textarea>
                  </label>
                  <label class="local-editor-field">
                    <span>${escapeHtml(ui.ruleNoteLabel)}</span>
                    <textarea data-local-editor-rule-note rows="3">${escapeHtml(rule.note || "")}</textarea>
                  </label>
                ` : ""}
                ${rule.kind !== "table" && rule.kind !== "pairs" ? `
                  <label class="local-editor-field">
                    <span>${escapeHtml(ui.ruleTextLabel)}</span>
                    <textarea data-local-editor-rule-text rows="4">${escapeHtml(rule.text || "")}</textarea>
                  </label>
                ` : ""}
              </div>
            `).join("")}
          </div>
        ` : ""}
        ${bookMaterials.length || referenceMaterial ? `
          <div class="local-editor-subgroup">
            <h4>${escapeHtml(ui.sourcesTitle)}</h4>
            ${bookMaterials.map((exercise) => `
              <div id="${escapeHtml(getEditorTargetId("book-meta", exercise.id))}" class="local-editor-card">
                <div class="local-editor-card-head">
                  <span>${escapeHtml(`Book ${exercise.id}`)}</span>
                  <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("book-meta", exercise.id))}">${escapeHtml(ui.jumpToQuestion)}</button>
                </div>
                <label class="local-editor-field">
                  <span>${escapeHtml(ui.exerciseTitleLabel)}</span>
                  <textarea data-local-editor-book-title="${escapeHtml(exercise.id)}" rows="2">${escapeHtml(exercise.title || "")}</textarea>
                </label>
              </div>
            `).join("")}
            ${referenceMaterial ? `
              <div id="${escapeHtml(getEditorTargetId("reference-meta", referenceMaterial.id))}" class="local-editor-card">
                <div class="local-editor-card-head">
                  <span>${escapeHtml(`Book ${referenceMaterial.id}`)}</span>
                  <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("reference-meta", referenceMaterial.id))}">${escapeHtml(ui.jumpToQuestion)}</button>
                </div>
                <label class="local-editor-field">
                  <span>${escapeHtml(ui.exerciseTitleLabel)}</span>
                  <textarea data-local-editor-field="referenceTitle" rows="2">${escapeHtml(referenceMaterial.title || "")}</textarea>
                </label>
                <label class="local-editor-field">
                  <span>${escapeHtml(ui.descriptionLabel)}</span>
                  <textarea data-local-editor-field="referenceDescription" rows="3">${escapeHtml(referenceMaterial.description || "")}</textarea>
                </label>
                <label class="local-editor-field">
                  <span>${escapeHtml(ui.passageLabel)}</span>
                  <small>${escapeHtml(ui.passageHint)}</small>
                  <textarea data-local-editor-field="referencePassage" rows="10">${escapeHtml(referenceMaterial.passage || "")}</textarea>
                </label>
              </div>
            ` : ""}
          </div>
        ` : ""}
      </div>
    ` : ""}
    <div class="local-editor-block">
      <h3>${escapeHtml(ui.answers)}</h3>
      ${hasAnswerArea ? `
        ${(item.answerSheet || []).length ? `
          <label class="local-editor-field">
            <span>${escapeHtml(ui.answerSheet)}</span>
            <small>${escapeHtml(ui.answerSheetHint)}</small>
            <textarea data-local-editor-field="answerSheet" rows="6">${escapeHtml(serializeAnswerSheetEntries(item.answerSheet || []))}</textarea>
          </label>
        ` : ""}
        ${Object.prototype.hasOwnProperty.call(item, "answerSheetNote") ? `
          <label class="local-editor-field">
            <span>${escapeHtml(ui.answerSheetNote)}</span>
            <textarea data-local-editor-field="answerSheetNote" rows="3">${escapeHtml(item.answerSheetNote || "")}</textarea>
          </label>
        ` : ""}
        ${quickExercises.length ? `
          <div class="local-editor-subgroup">
            <h4>${escapeHtml(ui.quickTitle)}</h4>
            ${quickExercises.map((exercise, index) => `
              <label id="${escapeHtml(getEditorTargetId("quick", index))}" class="local-editor-field">
                <span>${escapeHtml(`${ui.questionLabel} ${index + 1}`)}</span>
                <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("quick", index))}">${escapeHtml(ui.jumpToQuestion)}</button>
                <textarea data-local-editor-question-index="${index}" rows="3">${escapeHtml(exercise.question || "")}</textarea>
              </label>
              <label class="local-editor-field">
                <span>${escapeHtml(`${ui.explanationLabel} ${index + 1}`)}</span>
                <textarea data-local-editor-explanation-index="${index}" rows="4">${escapeHtml(exercise.explanation || "")}</textarea>
              </label>
            `).join("")}
          </div>
        ` : ""}
        ${bookAnswers.length ? `
          <div class="local-editor-subgroup">
            <h4>${escapeHtml(ui.bookTitle)}</h4>
            ${bookAnswers.map((itemData) => `
              <label id="${escapeHtml(getEditorTargetId("book", itemData.practiceKey))}" class="local-editor-field">
                <span>${escapeHtml(itemData.label)}</span>
                <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("book", itemData.practiceKey))}">${escapeHtml(ui.jumpToQuestion)}</button>
                <small>${escapeHtml(ui.promptLabel)}</small>
                <textarea data-local-editor-book-prompt="${escapeHtml(itemData.key)}" rows="3">${escapeHtml(itemData.prompt || "")}</textarea>
              </label>
              <label class="local-editor-field">
                <span>${escapeHtml(itemData.label)}</span>
                <small>${escapeHtml(ui.answerLabel)}</small>
                <textarea data-local-editor-book-answer="${escapeHtml(itemData.key)}" rows="2">${escapeHtml(itemData.value || "")}</textarea>
              </label>
              <label class="local-editor-field">
                <span>${escapeHtml(itemData.label)}</span>
                <small>${escapeHtml(ui.explanationLabel)}</small>
                <textarea data-local-editor-book-explanation="${escapeHtml(itemData.key)}" rows="4">${escapeHtml(itemData.explanation || "")}</textarea>
              </label>
            `).join("")}
          </div>
        ` : ""}
        ${referenceAnswers.length ? `
          <div class="local-editor-subgroup">
            <h4>${escapeHtml(ui.referenceTitle)}</h4>
            ${referenceAnswers.map((itemData) => `
              <label id="${escapeHtml(getEditorTargetId("reference", itemData.practiceKey))}" class="local-editor-field">
                <span>${escapeHtml(itemData.label)}</span>
                <button class="ghost-button developer-jump-button developer-jump-back" type="button" data-jump-to-question="${escapeHtml(getPracticeTargetId("reference", itemData.practiceKey))}">${escapeHtml(ui.jumpToQuestion)}</button>
                <small>${escapeHtml(ui.promptLabel)}</small>
                <textarea data-local-editor-reference-prompt="${escapeHtml(itemData.key)}" rows="3">${escapeHtml(itemData.prompt || "")}</textarea>
              </label>
              <label class="local-editor-field">
                <span>${escapeHtml(itemData.label)}</span>
                <small>${escapeHtml(ui.answerLabel)}</small>
                <textarea data-local-editor-reference-answer="${escapeHtml(itemData.key)}" rows="2">${escapeHtml(itemData.value || "")}</textarea>
              </label>
              <label class="local-editor-field">
                <span>${escapeHtml(itemData.label)}</span>
                <small>${escapeHtml(ui.explanationLabel)}</small>
                <textarea data-local-editor-reference-explanation="${escapeHtml(itemData.key)}" rows="4">${escapeHtml(itemData.explanation || "")}</textarea>
              </label>
            `).join("")}
          </div>
        ` : ""}
      ` : `<p class="detail-body">${escapeHtml(ui.noAnswerArea)}</p>`}
    </div>
  `;
}

function saveLocalDetailEditor() {
  const container = document.getElementById("detail-local-editor");
  const preservedPracticeState = capturePracticeState();

  if (!container || container.hidden || !detailEditorState.pageKey) {
    return;
  }

  let readyMessage = (
    currentLang === "en"
      ? "Local draft saved. Return to the home page when you are ready to publish."
      : "本地草稿已保存，确认无误后可以发布到网站。"
  );
  if (currentLang !== "en") {
    readyMessage = "本地草稿已保存，需要正式同步时请回到首页点发布网站。";
  }

  try {
    const nextOverrides = buildDetailOverridesFromEditor(container, getDetailPageOverrides(detailEditorState.pageKey));
    setDetailPageOverrides(detailEditorState.pageKey, nextOverrides);
    detailEditorState.feedbackMessage = readyMessage;
    detailEditorState.feedbackVariant = "info";
  } catch (error) {
    detailEditorState.feedbackMessage = error?.message || (currentLang === "en" ? "Saving failed." : "保存失败。");
    detailEditorState.feedbackVariant = "error";
  }

  renderAll();
  restorePracticeState(preservedPracticeState);
}

async function publishLocalDetailEditor() {
  const container = document.getElementById("detail-local-editor");
  const preservedPracticeState = capturePracticeState();

  if (!container || container.hidden || !detailEditorState.pageKey) {
    return;
  }

  const publishDoneMessage = getLocalEditorUi().publishDone || (
    currentLang === "en"
      ? "Published. Visitors will see the update after refreshing."
      : "已发布成功，别人刷新页面后就能看到更新。"
  );
  const publishFailedMessage = getLocalEditorUi().publishFailed || (
    currentLang === "en"
      ? "Publishing failed."
      : "发布失败，请确认本地网站服务仍在运行。"
  );
  let nextLocalOverrides;
  let nextPublishedOverrides;

  try {
    nextLocalOverrides = buildDetailOverridesFromEditor(container, getDetailPageOverrides(detailEditorState.pageKey));
    nextPublishedOverrides = buildDetailOverridesFromEditor(
      container,
      getPublishedDetailPageOverrides(detailEditorState.pageKey)
    );
  } catch (error) {
    detailEditorState.feedbackMessage = error?.message || publishFailedMessage;
    detailEditorState.feedbackVariant = "error";
    renderAll();
    restorePracticeState(preservedPracticeState);
    return;
  }

  setDetailPageOverrides(detailEditorState.pageKey, nextLocalOverrides);

  try {
    const response = await fetch(getLocalEditorApiUrl("/publish"), {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pageKey: detailEditorState.pageKey,
        overrides: nextPublishedOverrides
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.error || `HTTP ${response.status}`);
    }

    await loadPublishedDetailOverrides(true);
    detailEditorState.feedbackMessage = publishDoneMessage;
    detailEditorState.feedbackVariant = "success";
  } catch (error) {
    console.error("Publish failed:", error);
    detailEditorState.feedbackMessage = publishFailedMessage;
    detailEditorState.feedbackVariant = "error";
  }

  renderAll();
  restorePracticeState(preservedPracticeState);
}

function normalizeAiModeOptions(options) {
  const resolved = Array.isArray(options) && options.length
    ? options
    : DEFAULT_AI_MODE_OPTIONS;
  const seen = new Set();

  return resolved
    .map((option) => {
      const id = String(option?.id || option?.value || option?.modeId || "").trim();
      const title = String(option?.title || option?.label || option?.name || id).trim();
      const description = String(option?.description || "").trim();
      return id && title ? { id, title, description } : null;
    })
    .filter((option) => option && isLikelyAiChatModelId(option.id))
    .filter((option) => option && !seen.has(option.id) && seen.add(option.id));
}

function isLikelyAiChatModelId(id) {
  const value = String(id || "").trim().toLowerCase();

  if (!value) {
    return false;
  }

  return ![
    "image",
    "imagine",
    "video",
    "diffusion",
    "sora",
    "seedance",
    "seedream",
    "veo",
    "banana",
    "tts",
    "speech",
    "audio",
    "voice",
    "transcribe",
    "embedding",
    "rerank",
    "moderation",
    "whisper"
  ].some((keyword) => value.includes(keyword));
}

function getAiModeLookupValue(value) {
  return String(value || "").trim().toLowerCase();
}

function findAiModeOption(options, id = "", label = "") {
  const normalizedId = getAiModeLookupValue(id);
  const normalizedLabel = getAiModeLookupValue(label);

  return options.find((option) => option.id === id)
    || options.find((option) => getAiModeLookupValue(option.id) === normalizedId)
    || options.find((option) => option.title === label)
    || options.find((option) => getAiModeLookupValue(option.title) === normalizedLabel)
    || null;
}

function applyAiModelPayload(data = {}, preserveUserSelection = aiState.manualModelSelection) {
  const options = normalizeAiModeOptions(
    Array.isArray(data.modelOptions) && data.modelOptions.length
      ? data.modelOptions
      : Array.isArray(data.models)
        ? data.models.map((model) => ({ id: model, title: model }))
        : aiState.modelOptions
  );

  aiState.modelOptions = options;

  const requestedId = String(data.model || "").trim();
  const requestedLabel = String(data.modelLabel || "").trim();
  const reported = findAiModeOption(options, requestedId, requestedLabel)
    || findAiModeOption(options, aiState.model, aiState.modelLabel)
    || options[0];

  if (preserveUserSelection) {
    const preferred = findAiModeOption(options, aiState.preferredModel, aiState.modelLabel)
      || findAiModeOption(options, aiState.model, aiState.modelLabel);

    if (preferred) {
      aiState.model = preferred.id;
      aiState.modelLabel = preferred.title;
      return;
    }
  }

  if (reported) {
    aiState.model = reported.id;
    aiState.modelLabel = reported.title;
    aiState.preferredModel = reported.id;
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function formatText(template, values = {}) {
  return String(template || "").replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

function splitSentences(text) {
  return String(text || "")
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function containsChinese(text) {
  return /[\u4e00-\u9fff]/.test(String(text || ""));
}

function getPreferredLanguage() {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

function clearLegacyThemeArtifacts() {
  if (typeof document !== "undefined" && document.body) {
    document.body.classList.remove("theme-professional");
    delete document.body.dataset.theme;
    delete document.body.dataset.themeSwitchBound;
  }

  try {
    window.localStorage.removeItem("german-study-theme");
  } catch {
    // Ignore localStorage cleanup failures.
  }
}

function setPreferredLanguage(lang) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    return;
  }
}

function getUi() {
  return studyTranslations.ui?.[currentLang] || studyTranslations.ui?.zh || {};
}

function getOutlineUi() {
  return outlineUi[currentLang] || outlineUi.zh;
}

function getAiUi() {
  return aiUi[currentLang] || aiUi.zh;
}

function getAiApiUrl(path) {
  return `${aiState.bridgeBase}${path}`;
}

function getLevelKey(rawLevel) {
  return String(rawLevel).toUpperCase() === "A2" ? "A2" : "A1";
}

function getTopicById(level, topicId, part = "grammar") {
  const normalizedPart = normalizeA1ListPart(part) || DEFAULT_A1_LIST_PART;
  const source = normalizedPart === "reading" ? readingData : grammarData;
  const items = source[level]?.items || [];
  const matched = items.find((item) => item.id === topicId);
  return matched || items[0] || null;
}

function buildTopicUrl(level, topicId, part = "grammar") {
  const normalizedPart = normalizeA1ListPart(part) || DEFAULT_A1_LIST_PART;
  const partQuery = normalizedPart !== "grammar"
    ? `&part=${encodeURIComponent(normalizedPart)}`
    : "";
  return `detail.html?level=${encodeURIComponent(level)}&topic=${encodeURIComponent(topicId)}${partQuery}`;
}

function buildSubunitUrl(level, topicId, subunitCode) {
  return `detail.html?level=${encodeURIComponent(level)}&topic=${encodeURIComponent(topicId)}&subunit=${encodeURIComponent(subunitCode)}`;
}

function getSubunitByCode(level, topicId, subunitCode) {
  if (getLevelKey(level) !== "A1") {
    return null;
  }

  const topicUnits = a1SubunitData?.A1?.[topicId];

  if (topicUnits?.[subunitCode]) {
    return topicUnits[subunitCode];
  }

  return Object.values(topicUnits || {}).find((item) => item.code === subunitCode) || null;
}

function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[.,!?;:，。！？；：/()[\]"]/g, " ")
    .replace(/\s+/g, " ");
}

function setText(id, text) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = text;
  }
}

function shortenText(text, maxLength = 88) {
  const value = String(text || "").trim();
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function getAiElements() {
  const modal = document.getElementById("ai-chat-modal");

  if (!modal) {
    return null;
  }

  return {
    modal,
    title: document.getElementById("ai-chat-title"),
    modelSelect: document.getElementById("ai-chat-model-select"),
    status: document.getElementById("ai-chat-status"),
    context: document.getElementById("ai-chat-context"),
    messages: document.getElementById("ai-chat-messages"),
    inputLabel: document.getElementById("ai-chat-input-label"),
    input: document.getElementById("ai-chat-input"),
    send: document.getElementById("ai-chat-send"),
    reset: document.getElementById("ai-chat-reset"),
    close: document.getElementById("ai-chat-close")
  };
}

function getPracticePathLabel() {
  if (!currentPracticeContext) {
    return document.getElementById("detail-title")?.textContent || "German Grammar";
  }

  return [
    currentPracticeContext.level,
    currentPracticeContext.topicTitle,
    currentPracticeContext.subunitTitle
  ].filter(Boolean).join(" · ");
}

function getAiStatusText() {
  const ui = getAiUi();

  if (aiState.status === "busy") {
    return aiState.activeModelLabel ? `${ui.statusBusy} (${aiState.activeModelLabel})` : ui.statusBusy;
  }

  if (aiState.status === "error") {
    return ui.statusError;
  }

  if (aiState.status === "ready") {
    return ui.statusReady;
  }

  if (aiState.status === "unavailable") {
    return ui.statusUnavailable;
  }

  return ui.statusChecking;
}

function renderAiMessages() {
  const elements = getAiElements();
  const ui = getAiUi();

  if (!elements?.messages) {
    return;
  }

  if (!aiState.messages.length) {
    elements.messages.innerHTML = `<div class="ai-chat-empty">${escapeHtml(ui.empty)}</div>`;
    return;
  }

  elements.messages.innerHTML = aiState.messages.map((message) => `
    <article class="ai-chat-message is-${escapeHtml(message.role)}">
      <p class="ai-chat-role">${escapeHtml(message.role === "user" ? ui.roleUser : ui.roleAssistant)}${message.modelLabel ? ` · ${escapeHtml(message.modelLabel)}` : ""}</p>
      <p class="ai-chat-text">${escapeHtml(message.content).replace(/\n/g, "<br>")}</p>
    </article>
  `).join("");

  elements.messages.scrollTop = elements.messages.scrollHeight;
}

function renderAiChat() {
  const elements = getAiElements();
  const ui = getAiUi();

  if (!elements) {
    return;
  }

  if (elements.title) {
    elements.title.textContent = ui.modalTitle;
  }

  if (elements.modelSelect) {
    const options = normalizeAiModeOptions(aiState.modelOptions);
    aiState.modelOptions = options;

    if (!options.some((option) => option.id === aiState.model) && options[0]) {
      aiState.model = options[0].id;
      aiState.modelLabel = options[0].title;
    }

    const optionsMarkup = options.map((option) => `
      <option value="${escapeHtml(option.id)}">${escapeHtml(option.title)}</option>
    `).join("");

    if (elements.modelSelect.innerHTML !== optionsMarkup) {
      elements.modelSelect.innerHTML = optionsMarkup;
    }

    elements.modelSelect.value = aiState.model;
    elements.modelSelect.disabled = aiState.sending || !aiState.available;
    elements.modelSelect.setAttribute("aria-label", "AI mode");
    elements.modelSelect.title = options.find((option) => option.id === aiState.model)?.description || "";
  }

  if (elements.inputLabel) {
    elements.inputLabel.textContent = ui.inputLabel;
  }

  if (elements.input) {
    elements.input.placeholder = ui.inputPlaceholder;
    elements.input.disabled = aiState.sending;
  }

  if (elements.send) {
    elements.send.textContent = aiState.sending ? ui.sending : ui.send;
    elements.send.disabled = aiState.sending || !aiState.available;
  }

  if (elements.reset) {
    elements.reset.textContent = ui.reset;
  }

  if (elements.close) {
    elements.close.textContent = ui.close;
  }

  if (elements.status) {
    elements.status.textContent = getAiStatusText();
    elements.status.className = `ai-chat-status is-${aiState.status === "idle" ? "checking" : aiState.status}`;
  }

  if (elements.context) {
    elements.context.hidden = !aiState.contextLabel;
    elements.context.textContent = aiState.contextLabel ? `${ui.contextLabel} · ${aiState.contextLabel}` : "";
  }

  renderAiMessages();

  if (elements.modal) {
    elements.modal.hidden = !aiState.open;
    elements.modal.setAttribute("aria-hidden", aiState.open ? "false" : "true");
  }

  document.body.classList.toggle("has-ai-chat-open", aiState.open);
}

async function checkAiAvailability(force = false) {
  if (aiState.checking) {
    return aiState.available;
  }

  if (aiState.checked && !force) {
    return aiState.available;
  }

  aiState.checking = true;
  aiState.status = "checking";
  renderAiChat();

  try {
    const response = await fetch(getAiApiUrl("/status"), {
      method: "GET",
      mode: "cors",
      cache: "no-store"
    });
    const data = await response.json();
    applyAiModelPayload(data, aiState.manualModelSelection);
    aiState.available = Boolean(data.ok);
    aiState.checked = true;
    aiState.status = aiState.available ? "ready" : "unavailable";
    return aiState.available;
  } catch {
    aiState.available = false;
    aiState.checked = true;
    aiState.status = "unavailable";
    return false;
  } finally {
    aiState.checking = false;
    renderAiChat();
  }
}

function buildAiSystemPrompt() {
  if (currentLang === "en") {
    return "You are a German grammar tutor for beginners. Be concise: 1) name the grammar point, 2) give the answer, 3) add a short reason. Only expand if the user asks.";
  }

  return "你是一位德语初学者老师。回答尽量简洁：1）指出考点，2）给答案，3）用一两句说明理由。除非用户追问，不要展开太多。";
}

function buildQuickExercisePrompt(index) {
  const exercise = currentPracticeContext?.quickExercises?.[index];

  if (!exercise) {
    return null;
  }

  const options = exercise.type === "choice"
    ? `\n${(exercise.options || []).map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`).join("\n")}`
    : "";
  const questionType = exercise.type === "choice"
    ? (currentLang === "en" ? "Multiple choice" : "选择题")
    : (currentLang === "en" ? "Fill in the blank" : "填空题");
  const label = `${currentLang === "en" ? "Task" : "题目"} ${index + 1} · ${shortenText(exercise.question, 56)}`;
  const prompt = currentLang === "en"
    ? `German task.\n${questionType}\n${exercise.question}${options}\nPlease answer briefly: grammar point, answer, short reason.`
    : `德语题。\n${questionType}\n${exercise.question}${options}\n请简短回答：考点、答案、简短理由。`;

  return { label, prompt };
}

function buildBookExercisePrompt(exerciseId, lineIndex) {
  const exercise = (currentPracticeContext?.bookExercises || []).find((item) => String(item.id) === String(exerciseId));
  const line = exercise?.lines?.[lineIndex];

  if (!exercise || !line) {
    return null;
  }

  const label = `Book ${exercise.id} · ${currentLang === "en" ? "Line" : "小题"} ${lineIndex + 1}`;
  const prompt = currentLang === "en"
    ? `German task.\n${line}\nPlease answer briefly: grammar point, answer, short reason.`
    : `德语题。\n${line}\n请简短回答：考点、答案、简短理由。`;

  return { label, prompt };
}

function buildReferencePrompt(referenceId) {
  const referenceExercise = currentPracticeContext?.referenceExercise;

  if (!referenceExercise?.checks?.length) {
    return null;
  }

  const [, rawIndex] = String(referenceId).split("-");
  const checkIndex = Number(rawIndex);
  const item = referenceExercise.checks?.[checkIndex];

  if (!item) {
    return null;
  }

  const passage = (referenceExercise.passage || []).join("\n");
  const label = `Book ${referenceExercise.id || "7"} · ${shortenText(item.prompt, 52)}`;
  const prompt = currentLang === "en"
    ? `Pronoun reference task.\nPassage:\n${passage}\nQuestion: ${item.prompt}\nPlease answer briefly: referent and short reason.`
    : `代词指代题。\n原文：\n${passage}\n问题：${item.prompt}\n请简短回答：指代对象和简短理由。`;

  return { label, prompt };
}

function getAiPayloadFromTrigger(trigger) {
  if (!trigger) {
    return null;
  }

  const kind = trigger.dataset.askAi;

  if (kind === "quick") {
    return buildQuickExercisePrompt(Number(trigger.dataset.exerciseIndex));
  }

  if (kind === "book") {
    return buildBookExercisePrompt(trigger.dataset.exerciseId, Number(trigger.dataset.lineIndex));
  }

  if (kind === "reference") {
    return buildReferencePrompt(trigger.dataset.referenceId);
  }

  return null;
}

function openAiChat(payload) {
  const elements = getAiElements();

  if (!elements || !payload) {
    return;
  }

  aiState.open = true;
  aiState.messages = [];
  aiState.draft = payload.prompt;
  aiState.contextLabel = payload.label;
  aiState.status = aiState.checked ? (aiState.available ? "ready" : "unavailable") : "checking";
  renderAiChat();
  elements.input.value = payload.prompt;
  elements.input.focus();
  checkAiAvailability(!aiState.checked);
}

function closeAiChat() {
  aiState.open = false;
  renderAiChat();
}

function resetAiChat() {
  const elements = getAiElements();

  aiState.messages = [];
  aiState.status = aiState.available ? "ready" : "unavailable";
  renderAiChat();

  if (elements?.input) {
    elements.input.value = aiState.draft;
    elements.input.focus();
  }
}

async function sendAiMessage() {
  const elements = getAiElements();
  const inputValue = elements?.input?.value?.trim();

  if (!elements?.input || !inputValue || aiState.sending) {
    return;
  }

  const available = await checkAiAvailability(!aiState.available || !aiState.checked);

  if (!available) {
    aiState.status = "unavailable";
    renderAiChat();
    return;
  }

  aiState.sending = true;
  aiState.status = "busy";
  const requestModel = String(elements.modelSelect?.value || aiState.model || aiState.preferredModel || DEFAULT_AI_MODE_OPTIONS[0].id).trim();
  const requestModelOption = findAiModeOption(normalizeAiModeOptions(aiState.modelOptions), requestModel);
  aiState.messages.push({
    role: "user",
    content: inputValue,
    model: requestModel,
    modelLabel: requestModelOption?.title || requestModel
  });
  elements.input.value = "";
  aiState.model = requestModel;
  aiState.preferredModel = aiState.model;
  aiState.manualModelSelection = true;
  aiState.activeModel = requestModel;
  aiState.activeModelLabel = requestModelOption?.title || requestModel;
  renderAiChat();

  try {
    const response = await fetch(getAiApiUrl("/chat"), {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: requestModel,
        messages: aiState.messages.map((message) => ({
          role: message.role,
          content: message.content
        }))
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const actualModel = String(data?.model || "").trim();
    const actualModelLabel = String(data?.modelLabel || "").trim();
    const actualModelOption = findAiModeOption(normalizeAiModeOptions(data?.modelOptions || aiState.modelOptions), actualModel, actualModelLabel);

    applyAiModelPayload(data, false);
    const assistantText = data?.message?.content || "";

    aiState.messages.push({
      role: "assistant",
      model: actualModel || requestModel,
      modelLabel: actualModelOption?.title || actualModelLabel || requestModelOption?.title || requestModel,
      content: assistantText || (currentLang === "en" ? "No response text returned." : "本地 AI 没有返回文本内容。")
    });
    aiState.status = "ready";
  } catch {
    aiState.messages.push({
      role: "assistant",
      model: requestModel,
      modelLabel: requestModelOption?.title || requestModel,
      content: currentLang === "en"
        ? "I couldn't reach the local AI just now. Please make sure the local AI bridge is running and then try again."
        : "我刚刚没能连上本地 AI。请先确认本地 AI bridge 正在运行，然后再试一次。"
    });
    aiState.status = "error";
  } finally {
    aiState.sending = false;
    aiState.activeModel = "";
    aiState.activeModelLabel = "";
    renderAiChat();
  }
}

function bindAiInterface() {
  if (document.body.dataset.aiBound === "true") {
    return;
  }

  document.body.dataset.aiBound = "true";

  document.addEventListener("click", (event) => {
    const askButton = event.target.closest("[data-ask-ai]");

    if (askButton) {
      const payload = getAiPayloadFromTrigger(askButton);

      if (payload) {
        openAiChat(payload);
      }
      return;
    }

    if (event.target.closest("[data-ai-close]")) {
      closeAiChat();
      return;
    }

    if (event.target.closest("#ai-chat-send")) {
      sendAiMessage();
      return;
    }

    if (event.target.closest("#ai-chat-reset")) {
      resetAiChat();
    }
  });

  document.addEventListener("change", (event) => {
    if (event.target?.id !== "ai-chat-model-select") {
      return;
    }

    const options = normalizeAiModeOptions(aiState.modelOptions);
    const selected = options.find((option) => option.id === event.target.value) || options[0];

    if (!selected) {
      return;
    }

    aiState.model = selected.id;
    aiState.modelLabel = selected.title;
    aiState.preferredModel = selected.id;
    aiState.manualModelSelection = true;
    renderAiChat();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && aiState.open) {
      closeAiChat();
      return;
    }

    const isComposer = event.target.id === "ai-chat-input";

    if (isComposer && event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      sendAiMessage();
    }
  });
}

function bindLocalDetailEditor() {
  if (document.body.dataset.localDetailEditorBound === "true") {
    return;
  }

  document.body.dataset.localDetailEditorBound = "true";

  document.addEventListener("click", (event) => {
    const jumpToEditorButton = event.target.closest("[data-jump-to-editor]");

    if (jumpToEditorButton) {
      event.preventDefault();
      jumpToDeveloperTarget(jumpToEditorButton.dataset.jumpToEditor);
      return;
    }

    const jumpToQuestionButton = event.target.closest("[data-jump-to-question]");

    if (jumpToQuestionButton) {
      event.preventDefault();
      jumpToDeveloperTarget(jumpToQuestionButton.dataset.jumpToQuestion);
      return;
    }

    if (event.target.closest("#detail-local-editor-save")) {
      saveLocalDetailEditor();
      return;
    }

    if (event.target.closest("#detail-local-editor-reset")) {
      renderAll();
      return;
    }
  });
}

function translateType(type) {
  const types = getUi().types || {};
  return types[type] || type;
}

function getTranslatedTypeTip(type) {
  const ui = getUi();

  if (currentLang === "en") {
    return ui.typeTips?.[type] || "Review the rule once, then test it with the exercises below.";
  }

  return "先看规则，再做单点练习，最后回到例句复盘。";
}

function getLevelDescription(level, part = "grammar") {
  const normalizedPart = normalizeA1ListPart(part) || DEFAULT_A1_LIST_PART;
  const source = normalizedPart === "reading" ? readingData : grammarData;
  const current = source[level];

  if (currentLang === "en" && current?.descriptionEn) {
    return current.descriptionEn;
  }

  if (currentLang === "zh") {
    return current?.description || "";
  }

  const descriptions = {
    A1: "Sentence structure, the present tense, modal verbs, separable verbs, articles, plurals, the accusative, the dative, negation, basic prepositions, the imperative, the perfect tense and coordinating conjunctions.",
    A2: "More advanced word order, pronouns, reflexive verbs, two-way prepositions, adjective endings, comparison, the preterite, weil and wenn clauses, polite expressions, the passive, genitive alternatives and word formation."
  };

  return descriptions[level] || "";
}

function getTopicTranslation(level, topicId) {
  return studyTranslations.content?.en?.[level]?.[topicId] || null;
}

function getLocalizedField(item, key) {
  if (!item) {
    return "";
  }

  if (currentLang === "en") {
    return item[`${key}En`] || item[key] || "";
  }

  return item[key] || "";
}

function localizeSubunits(subunits) {
  return (subunits || []).map((subunit) => ({
    ...subunit,
    localizedTitle: getLocalizedField(subunit, "title"),
    localizedNote: getLocalizedField(subunit, "note")
  }));
}

function localizeKeywords(keywords) {
  if (currentLang === "zh") {
    return keywords || [];
  }

  return (keywords || []).map((keyword) => translateType(keyword));
}

function translateExerciseQuestion(question, type) {
  if (currentLang === "zh") {
    return question;
  }

  const patterns = [
    [/^正确的句子是：$/, "Choose the correct sentence:"],
    [/^正确的一组是：$/, "Choose the correct set:"],
    [/^哪一句是正确的一般疑问句？$/, "Which sentence is the correct yes/no question?"],
    [/^正确的一般疑问句是哪一句？$/, "Which sentence is the correct yes/no question?"],
    [/^询问“(.+?)”应该说：$/, 'How do you ask "$1"?'],
    [/^按正确语序写句子：(.*)$/, "Put the words in the correct order: $1"],
    [/^用括号里的词完成句子：(.*)$/, "Complete the sentence with the word in brackets: $1"],
    [/^把句子改成一般疑问句：(.*)$/, "Turn this into a yes/no question: $1"],
    [/^用合适的疑问词填空：(.*)$/, "Fill in the blank with the correct question word: $1"],
    [/^用 and 合并句子：(.*)$/, 'Combine the sentences with "und": $1'],
    [/^用 deshalb 连接：(.*)$/, 'Connect the clauses with "deshalb": $1'],
    [/^用 von 结构改写：(.*)$/, 'Rewrite with a "von" phrase: $1'],
    [/^用名字属格改写：(.*)$/, "Rewrite with the genitive name form: $1"],
    [/^das Kind 的复数是：$/, 'What is the plural of "das Kind"?'],
    [/^“女同事”最自然的是：$/, 'Which option most naturally means "female colleague"?'],
    [/^“没有工作”最自然的是：$/, 'Which option most naturally means "no work" or "without work"?'],
    [/^对朋友说“过来！”最自然的是：$/, 'Which form is the most natural way to say "Come here!" to a friend?'],
    [/^对多人说“请安静！”最自然的是：$/, 'Which form is the most natural way to say "Be quiet, please!" to several people?'],
    [/^名词 (.+) 前应使用哪个定冠词？$/, 'Which definite article fits the noun "$1"?'],
    [/^下面哪个问词通常用来询问地点？$/, "Which question word is typically used to ask about place?"],
    [/^下面哪个介词通常支配第三格？$/, "Which preposition usually takes the dative?"],
    [/^下面哪一句是正确的德语陈述句语序？$/, "Which sentence has the correct word order in a German statement?"],
    [/^下面哪一句是可分动词 (.+) 的正确主句形式？$/, 'Which sentence shows the correct main-clause form of the separable verb "$1"?'],
    [/^像 (.+) 这样的移动类动词，在完成时中常用哪个助动词？$/, 'Which auxiliary is usually used in the perfect tense with motion verbs like "$1"?'],
    [/^形容词 (.+) 的比较级是哪个？$/, 'What is the comparative form of "$1"?'],
    [/^下面哪一句的 weil 从句语序正确？$/, "Which sentence has the correct word order in a weil clause?"],
    [/^主语是 (.+) 时，正确的反身代词是哪一个？$/, 'Which reflexive pronoun matches the subject "$1"?'],
    [/^在句子 (.+) 中，句末的不定式是哪个词？$/, 'In the sentence "$1", which word is the infinitive at the end?']
  ];

  for (const [pattern, replacement] of patterns) {
    if (pattern.test(question)) {
      return question.replace(pattern, replacement);
    }
  }

  if (type === "fill" && question.includes("___")) {
    return containsChinese(question) ? "Complete the sentence using the grammar rule above." : `Complete the sentence: ${question}`;
  }

  if (type === "choice" && containsChinese(question)) {
    return "Choose the correct answer based on the rule above.";
  }

  return question;
}

function localizeExercises(exercises, topicSummary) {
  if (currentLang === "zh") {
    return exercises || [];
  }

  const explanation = `${topicSummary} Review the rule above and compare it with the correct form.`;

  return (exercises || []).map((exercise) => ({
    ...exercise,
    placeholder: exercise.type === "fill" ? "Type your answer" : exercise.placeholder,
    question: translateExerciseQuestion(exercise.question, exercise.type),
    explanation
  }));
}

function buildLocalizedTopic(level, topic) {
  if (!topic) {
    return null;
  }

  const inlineTitle = getLocalizedField(topic, "title");
  const inlineSummary = getLocalizedField(topic, "summary");
  const inlineOverview = getLocalizedField(topic, "overview");
  const inlineTip = getLocalizedField(topic, "tip");
  const inlineFocus = currentLang === "en" ? (topic.focusEn || topic.focus || []) : (topic.focus || []);
  const inlineKeywords = currentLang === "en" ? (topic.keywordsEn || topic.keywords || []) : (topic.keywords || []);
  const localizedType = currentLang === "en" ? (topic.typeEn || translateType(topic.type)) : translateType(topic.type);
  const localizedSubunits = localizeSubunits(topic.subunits);

  if (currentLang === "zh") {
    return {
      ...topic,
      title: inlineTitle || topic.title,
      summary: inlineSummary || topic.summary,
      overview: inlineOverview || topic.overview,
      tip: inlineTip || topic.tip,
      focus: inlineFocus,
      practiceUi: getResolvedPracticeUiConfig(topic.practiceUi || {}),
      localizedType,
      localizedKeywords: inlineKeywords,
      localizedExamples: topic.examples || [],
      localizedExercises: topic.exercises || [],
      localizedSubunits
    };
  }

  const translation = getTopicTranslation(level, topic.id) || {};
  const overview = translation.overview || inlineOverview || topic.overview;
  const summary = translation.summary || inlineSummary || splitSentences(overview)[0] || topic.summary;

  return {
    ...topic,
    title: translation.title || inlineTitle || topic.title,
    summary,
    overview,
    focus: translation.overview ? splitSentences(overview).slice(0, 3) : inlineFocus,
    tip: inlineTip || getTranslatedTypeTip(localizedType),
    practiceUi: getResolvedPracticeUiConfig(topic.practiceUi || {}),
    localizedType,
    localizedKeywords: inlineKeywords.length ? inlineKeywords : localizeKeywords(topic.keywords),
    localizedExamples: topic.examples || [],
    localizedExercises: localizeExercises(topic.exercises || [], summary),
    localizedSubunits
  };
}

function isGroupedTopic(topic) {
  return Array.isArray(topic?.localizedSubunits) && topic.localizedSubunits.length > 0;
}

function getListCountText(level, current) {
  if (level === "A1" && current.items.some((item) => Array.isArray(item.subunits) && item.subunits.length > 0)) {
    return formatText(getOutlineUi().groupCount, { count: current.items.length });
  }

  return formatText(getUi().listCount, { count: current.items.length });
}

function getListOpenText(item) {
  if (Array.isArray(item?.subunits) && item.subunits.length > 0) {
    return getOutlineUi().groupOpenCard;
  }

  return getUi().listOpenCard;
}

function normalizeA1ListPart(part) {
  const value = String(part || "").trim().toLowerCase();
  return A1_LIST_PARTS.includes(value) ? value : "";
}

function readStoredA1ListPart() {
  try {
    return normalizeA1ListPart(window.localStorage.getItem(A1_LIST_PART_STORAGE_KEY));
  } catch {
    return "";
  }
}

function writeStoredA1ListPart(part) {
  const normalized = normalizeA1ListPart(part) || DEFAULT_A1_LIST_PART;

  try {
    window.localStorage.setItem(A1_LIST_PART_STORAGE_KEY, normalized);
  } catch {
    // Ignore localStorage write failures.
  }
}

function getA1ListPartUi() {
  if (currentLang === "en") {
    return {
      ariaLabel: "A1 parts",
      grammar: "Grammar",
      reading: "Reading",
      listening: "Listening",
      writing: "Writing",
      grammarTitle: "A1 Major Units",
      readingTitle: "A1 Reading",
      readingCount: "Reading module is being prepared",
      readingPlaceholderTitle: "Reading module coming soon",
      readingPlaceholderText: "The switch is already active. We can plug your reading materials in here next, without changing the page structure.",
      listeningTitle: "A1 Listening",
      listeningCount: "Listening module is being prepared",
      listeningPlaceholderTitle: "Listening module coming soon",
      listeningPlaceholderText: "The switch is already active. We can add listening tasks and audio-based practice here in the next step.",
      writingTitle: "A1 Writing",
      writingCount: "Writing module is being prepared",
      writingPlaceholderTitle: "Writing module coming soon",
      writingPlaceholderText: "The switch is already active. We can add sentence writing and guided writing tasks here next."
    };
  }

  return {
    ariaLabel: "A1 分区切换",
    grammar: "语法",
    reading: "阅读",
    listening: "听力",
    writing: "写作",
    grammarTitle: "A1 大单元",
    readingTitle: "A1 阅读",
    readingCount: "阅读模块正在制作中",
    readingPlaceholderTitle: "阅读模块即将上线",
    readingPlaceholderText: "切换功能已经做好了，后续你把阅读内容给我，我会直接接到这个分区里。",
    listeningTitle: "A1 听力",
    listeningCount: "听力模块正在制作中",
    listeningPlaceholderTitle: "听力模块即将上线",
    listeningPlaceholderText: "切换功能已经做好了，后续你把听力材料给我，我会直接接到这个分区里。",
    writingTitle: "A1 写作",
    writingCount: "写作模块正在制作中",
    writingPlaceholderTitle: "写作模块即将上线",
    writingPlaceholderText: "切换功能已经做好了，后续你把写作任务给我，我会直接接到这个分区里。"
  };
}

function setA1ListPart(part, syncUrl = true) {
  const normalized = normalizeA1ListPart(part) || DEFAULT_A1_LIST_PART;
  listPageState.a1Part = normalized;
  writeStoredA1ListPart(normalized);

  if (!syncUrl || !document.body.classList.contains("page-list")) {
    return normalized;
  }

  const params = new URLSearchParams(window.location.search);
  const currentLevel = getLevelKey(params.get("level") || "A1");

  if (currentLevel !== "A1") {
    return normalized;
  }

  params.set("part", normalized);
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
  window.history.replaceState({}, "", nextUrl);
  return normalized;
}

function renderListCards(level, items, part = "grammar") {
  const normalizedPart = normalizeA1ListPart(part) || DEFAULT_A1_LIST_PART;
  const openText = normalizedPart === "reading"
    ? (currentLang === "en" ? "Open reading task" : "进入阅读题")
    : "";

  return (items || []).map((item, index) => {
    const localized = buildLocalizedTopic(level, item);

    return `
      <a class="grammar-card grammar-card-link" href="${buildTopicUrl(level, item.id, normalizedPart)}" style="animation-delay:${index * 70}ms">
        <div class="grammar-card-header">
          <span class="grammar-card-tag">${level}</span>
          <span class="grammar-card-meta">${escapeHtml(localized.localizedType)}</span>
        </div>
        <h3>${escapeHtml(localized.title)}</h3>
        <p>${escapeHtml(localized.summary)}</p>
        <div class="grammar-keywords">
          ${(localized.localizedKeywords || []).map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}
        </div>
        <span class="card-link card-link-inline">${escapeHtml(openText || getListOpenText(item))}</span>
      </a>
    `;
  }).join("");
}

function bindListPartSwitch() {
  if (document.body.dataset.listPartBound === "true") {
    return;
  }

  document.body.dataset.listPartBound = "true";

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-a1-list-part]");

    if (!button || !document.body.classList.contains("page-list")) {
      return;
    }

    const nextPart = normalizeA1ListPart(button.dataset.a1ListPart);

    if (!nextPart || nextPart === listPageState.a1Part) {
      return;
    }

    setA1ListPart(nextPart, true);
    renderListPage();
  });
}

function renderSubunits(topicId, subunits) {
  const ui = getOutlineUi();

  return (subunits || []).map((subunit, index) => {
    const code = subunit.code || String(index + 1);
    const hasDetail = Boolean(getSubunitByCode("A1", topicId, code));
    const tagName = hasDetail ? "a" : "article";
    const href = hasDetail ? ` href="${buildSubunitUrl("A1", topicId, code)}"` : "";
    const extraClass = hasDetail ? " subunit-link is-ready" : "";
    const note = hasDetail
      ? (currentLang === "en" ? "Open the full lesson preview" : "打开这个已完成的小单元预览")
      : (subunit.localizedNote || ui.subunitComingSoon);

    return `
      <${tagName} class="subunit-card${extraClass}"${href} style="animation-delay:${index * 65}ms">
        <div class="subunit-card-head">
          <span class="subunit-index">${escapeHtml(ui.subunitTag)} ${escapeHtml(code)}</span>
        </div>
        <h3>${escapeHtml(subunit.localizedTitle || subunit.title || "")}</h3>
        <p>${escapeHtml(note)}</p>
      </${tagName}>
    `;
  }).join("");
}

function buildLocalizedSubunit(level, topicId, subunit) {
  if (!subunit) {
    return null;
  }

  return {
    ...subunit,
    title: getLocalizedField(subunit, "title") || subunit.title,
    heroTitle: getLocalizedField(subunit, "heroTitle") || subunit.heroTitle || subunit.title,
    summary: getLocalizedField(subunit, "summary") || subunit.summary || "",
    overview: getLocalizedField(subunit, "overview") || subunit.overview || "",
    tip: getLocalizedField(subunit, "tip") || subunit.tip || "",
    focus: currentLang === "en" ? (subunit.focusEn || subunit.focus || []) : (subunit.focus || []),
    practiceUi: getResolvedPracticeUiConfig(subunit.practiceUi || {}),
    quickExercises: localizeExercises(subunit.quickExercises || [], getLocalizedField(subunit, "summary") || subunit.summary || ""),
    rules: subunit.rules || [],
    bookExercises: subunit.bookExercises || [],
    referenceChecks: subunit.referenceChecks || [],
    answerSheet: subunit.answerSheet || [],
    answerSheetNote: getLocalizedField(subunit, "answerSheetNote") || subunit.answerSheetNote || "",
    topicId,
    level
  };
}

function getVisibleSubunitRuleBlocks(rules) {
  return (rules || []).filter((rule) => String(rule?.kind || "").trim() === "table");
}

function renderRuleBlocks(rules) {
  const jumpText = detailEditorState.enabled ? getLocalEditorUi().jumpToEditor : "";

  return (rules || []).map((rule, index) => {
    if (rule.kind === "table") {
      return `
        <article id="${escapeHtml(getPracticeTargetId("rule", index))}" class="rule-card rule-card-table" style="animation-delay:${index * 60}ms">
          <div class="rule-card-head">
            <div>
              <h3>${escapeHtml(rule.title)}</h3>
              ${rule.subtitle ? `<p>${escapeHtml(rule.subtitle)}</p>` : ""}
            </div>
            ${detailEditorState.enabled ? `<button class="ghost-button developer-jump-button" type="button" data-jump-to-editor="${escapeHtml(getEditorTargetId("rule", index))}">${escapeHtml(jumpText)}</button>` : ""}
          </div>
          <div class="rule-table-shell">
            <table class="rule-table">
              <thead>
                <tr>${(rule.headers || []).map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${(rule.rows || []).map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
              </tbody>
            </table>
          </div>
          ${rule.note ? `<p class="rule-note">${escapeHtml(rule.note)}</p>` : ""}
        </article>
      `;
    }

    if (rule.kind === "pairs") {
      return `
        <article id="${escapeHtml(getPracticeTargetId("rule", index))}" class="rule-card rule-card-pairs" style="animation-delay:${index * 60}ms">
          <div class="rule-card-head">
            <div>
              <h3>${escapeHtml(rule.title)}</h3>
            </div>
            ${detailEditorState.enabled ? `<button class="ghost-button developer-jump-button" type="button" data-jump-to-editor="${escapeHtml(getEditorTargetId("rule", index))}">${escapeHtml(jumpText)}</button>` : ""}
          </div>
          <div class="rule-pairs">
            ${(rule.items || []).map((item) => `
              <div class="rule-pair">
                <span>${escapeHtml(item.label)}</span>
                <strong>${escapeHtml(item.value)}</strong>
              </div>
            `).join("")}
          </div>
          ${rule.note ? `<p class="rule-note">${escapeHtml(rule.note)}</p>` : ""}
        </article>
      `;
    }

    return `
      <article id="${escapeHtml(getPracticeTargetId("rule", index))}" class="rule-card rule-card-callout" style="animation-delay:${index * 60}ms">
        <div class="rule-card-head">
          <div>
            <h3>${escapeHtml(rule.title || "Note")}</h3>
          </div>
          ${detailEditorState.enabled ? `<button class="ghost-button developer-jump-button" type="button" data-jump-to-editor="${escapeHtml(getEditorTargetId("rule", index))}">${escapeHtml(jumpText)}</button>` : ""}
        </div>
        <p class="rule-note">${escapeHtml(rule.text || "")}</p>
      </article>
    `;
  }).join("");
}

function getBookBlankAnswers(answer) {
  return String(answer || "")
    .split("/")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeBookInput(value) {
  return String(value || "")
    .trim()
    .replace(/[.,!?;:]+$/g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function renderPracticeUiCheckbox(scope, key, label, checked) {
  return `
    <label class="inline-ui-check">
      <input type="checkbox" data-practice-ui-key="${escapeHtml(key)}"${checked ? " checked" : ""}>
      <span>${escapeHtml(label)}</span>
    </label>
  `;
}

function renderPracticeUiField(scope, key, label, value, rows = 1, placeholder = "") {
  if (rows > 1) {
    return `
      <label class="local-editor-field inline-ui-field">
        <span>${escapeHtml(label)}</span>
        <textarea data-practice-ui-key="${escapeHtml(key)}" rows="${rows}" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value || "")}</textarea>
      </label>
    `;
  }

  return `
    <label class="local-editor-field inline-ui-field">
      <span>${escapeHtml(label)}</span>
      <input type="text" data-practice-ui-key="${escapeHtml(key)}" value="${escapeHtml(value || "")}" placeholder="${escapeHtml(placeholder)}">
    </label>
  `;
}

function renderInlinePracticeUiEditor(scope, config) {
  return "";
}

function collectInlinePracticeUiConfig() {
  const practiceRoot = document.getElementById("practice-list");

  if (!practiceRoot) {
    return null;
  }

  const config = deepCloneJson(getCurrentPracticeUiConfig());
  const editorSections = Array.from(practiceRoot.querySelectorAll("[data-practice-ui-scope]"));

  if (!editorSections.length) {
    return null;
  }

  editorSections.forEach((section) => {
    const scope = String(section.dataset.practiceUiScope || "").trim();
    if (!scope) {
      return;
    }

    const nextScopeConfig = isPlainObject(config[scope]) ? { ...config[scope] } : {};
    section.querySelectorAll("[data-practice-ui-key]").forEach((field) => {
      const key = String(field.dataset.practiceUiKey || "").trim();
      if (!key) {
        return;
      }

      nextScopeConfig[key] = field.type === "checkbox" ? Boolean(field.checked) : String(field.value || "");
    });
    config[scope] = nextScopeConfig;
  });

  return getResolvedPracticeUiConfig(config);
}

function mergeInlinePracticeUiIntoOverrides(overrides = {}) {
  const inlineConfig = collectInlinePracticeUiConfig();

  if (!inlineConfig) {
    return overrides;
  }

  const langKey = currentLang === "en" ? "en" : "zh";
  return {
    ...overrides,
    languages: {
      ...(overrides.languages || {}),
      [langKey]: {
        ...(((overrides.languages || {})[langKey]) || {}),
        practiceUi: deepCloneJson(inlineConfig)
      }
    }
  };
}

function parseBookOptionText(optionText, fallbackIndex = 0) {
  const fallbackLabel = String.fromCharCode(65 + Math.max(0, Number(fallbackIndex) || 0));
  const raw = String(optionText || "").trim();

  if (!raw) {
    return {
      label: fallbackLabel,
      text: "",
      explicitLabel: false
    };
  }

  const splitMatch = raw.match(/^([A-Z])(?:\s*[.．、:：)\-]\s*|\s+)([\s\S]*)$/i);
  if (splitMatch) {
    return {
      label: String(splitMatch[1] || "").toUpperCase(),
      text: String(splitMatch[2] || "").trim(),
      explicitLabel: true
    };
  }

  const letterOnlyMatch = raw.match(/^([A-Z])$/i);
  if (letterOnlyMatch) {
    return {
      label: String(letterOnlyMatch[1] || "").toUpperCase(),
      text: "",
      explicitLabel: true
    };
  }

  return {
    label: fallbackLabel,
    text: raw,
    explicitLabel: false
  };
}

function renderBookLinePreview(line, answerParts, practiceUi = getDefaultPracticeUiConfig()) {
  if (!/_{2,}/.test(String(line || ""))) {
    return escapeHtml(String(line || ""));
  }

  const pieces = String(line || "").split(/_{2,}/g);
  const blankCount = Math.max(pieces.length - 1, answerParts.length || 1);
  let markup = "";

  for (let index = 0; index < blankCount; index += 1) {
    markup += escapeHtml(pieces[index] || "");
    markup += `<span class="blank-chip is-empty" aria-hidden="true"></span>`;
  }

  markup += escapeHtml(pieces[blankCount] || pieces[pieces.length - 1] || "");
  return markup;
}

function renderBookLineInputs(exerciseId, lineIndex, answerParts, practiceUi = getDefaultPracticeUiConfig(), choiceOptions = []) {
  const bookUi = getResolvedPracticeUiConfig(practiceUi).book;
  const blankCount = Math.max(answerParts.length, 1);
  const isLetterMatch = blankCount === 1 && /^[A-Z]$/.test(String(answerParts[0] || "").trim());
  const choiceLetters = isLetterMatch
    ? choiceOptions
      .map((item, optionIndex) => parseBookOptionText(item, optionIndex))
      .filter((option) => option.explicitLabel)
      .map((option) => option.label)
      .filter(Boolean)
    : [];

  if (isLetterMatch && choiceLetters.length) {
    const lineId = `${exerciseId}-${lineIndex}`;
    return `
      <div class="book-choice-group" data-book-choice-group="${escapeHtml(lineId)}">
        ${choiceLetters.map((letter) => `
          <button
            type="button"
            class="book-choice-option"
            data-book-choice="${escapeHtml(lineId)}"
            data-choice-value="${escapeHtml(letter)}"
          >${escapeHtml(letter)}</button>
        `).join("")}
      </div>
      <input
        class="book-line-input is-letter-match is-choice-hidden-input"
        type="text"
        autocomplete="off"
        maxlength="1"
        autocapitalize="characters"
        spellcheck="false"
        placeholder="${escapeHtml(bookUi.inputPlaceholder ?? "")}"
        data-book-input="${escapeHtml(exerciseId)}-${lineIndex}-0"
        aria-hidden="true"
        tabindex="-1"
      >
    `;
  }

  return Array.from({ length: blankCount }, (_, blankIndex) => {
    return `
      <label class="book-input-wrap is-label-hidden${isLetterMatch ? " is-letter-match" : ""}">
        <input
          class="book-line-input${isLetterMatch ? " is-letter-match" : ""}"
          type="text"
          autocomplete="off"
          ${isLetterMatch ? 'maxlength="1" autocapitalize="characters" spellcheck="false"' : ""}
          placeholder="${escapeHtml(bookUi.inputPlaceholder ?? "")}"
          data-book-input="${escapeHtml(exerciseId)}-${lineIndex}-${blankIndex}"
        >
      </label>
    `;
  }).join("");
}

function renderBookExercises(bookExercises, referenceExercise, practiceUi = getDefaultPracticeUiConfig()) {
  const resolvedPracticeUi = getResolvedPracticeUiConfig(practiceUi);
  const bookUi = resolvedPracticeUi.book;
  const referenceUi = resolvedPracticeUi.reference;
  const checkText = bookUi.checkLabel ?? "";
  const revealText = bookUi.showAnswerLabel ?? "";
  const askAiText = bookUi.aiLabel ?? "";
  const jumpText = detailEditorState.enabled ? getLocalEditorUi().jumpToEditor : "";

  const exerciseCards = (bookExercises || []).map((exercise) => {
    const choiceOptions = Array.isArray(exercise.options) ? exercise.options : [];
    return `
      <article id="${escapeHtml(getPracticeTargetId("book-meta", exercise.id))}" class="source-card">
        <div class="source-card-head">
          <div>
            <span class="exercise-index">Book ${escapeHtml(exercise.id)}</span>
            <h3>${escapeHtml(exercise.title)}</h3>
          </div>
          ${detailEditorState.enabled ? `<button class="ghost-button developer-jump-button" type="button" data-jump-to-editor="${escapeHtml(getEditorTargetId("book-meta", exercise.id))}">${escapeHtml(jumpText)}</button>` : ""}
        </div>
        ${choiceOptions.length ? `
          <div class="book-options-block">
            <div class="book-options-list">
              ${choiceOptions.map((option, optionIndex) => {
          const parsedOption = parseBookOptionText(option, optionIndex);
          return `
                  <div class="book-option-item${parsedOption.explicitLabel ? "" : " is-plain"}">
                    ${parsedOption.explicitLabel ? `<span class="book-option-key">${escapeHtml(parsedOption.label)}</span>` : ""}
                    <span class="book-option-text">${escapeHtml(parsedOption.text)}</span>
                  </div>
                `;
        }).join("")}
            </div>
          </div>
        ` : ""}
        <div class="book-lines">
          ${(exercise.lines || []).map((line, lineIndex) => {
          const answerText = exercise.answers?.[lineIndex] || "";
          const explanationText = exercise.explanations?.[lineIndex] || "";
          const answerParts = getBookBlankAnswers(answerText);
          const feedbackId = `${exercise.id}-${lineIndex}`;

          return `
            <div id="${escapeHtml(getPracticeTargetId("book", feedbackId))}" class="book-line" data-book-line="${escapeHtml(feedbackId)}">
              <div class="book-line-main">
                <span class="book-line-order">${lineIndex + 1}</span>
                <div class="book-line-copy">
                  <p class="book-line-text">${renderBookLinePreview(line, answerParts, resolvedPracticeUi)}</p>
                  <div class="practice-explanation" data-book-explanation-panel="${escapeHtml(feedbackId)}"${explanationText ? " hidden" : ` data-empty="true" hidden`}>
                    <p class="practice-explanation-text">${escapeHtml(explanationText)}</p>
                  </div>
                </div>
              </div>
              <div class="book-line-work">
                <div class="book-input-grid">
                  ${renderBookLineInputs(exercise.id, lineIndex, answerParts, resolvedPracticeUi, choiceOptions)}
                </div>
                <div class="book-line-actions">
                  ${bookUi.showCheckButton ? `<button class="primary-button" type="button" data-book-check="${escapeHtml(feedbackId)}">${escapeHtml(checkText)}</button>` : ""}
                  ${bookUi.showAnswerButton ? `<button class="ghost-button" type="button" data-book-show="${escapeHtml(feedbackId)}">${escapeHtml(revealText)}</button>` : ""}
                  ${bookUi.showAiButton ? `<button class="ghost-button ai-trigger-button" type="button" data-ask-ai="book" data-exercise-id="${escapeHtml(exercise.id)}" data-line-index="${lineIndex}">${escapeHtml(askAiText)}</button>` : ""}
                  ${detailEditorState.enabled ? `<button class="ghost-button developer-jump-button" type="button" data-jump-to-editor="${escapeHtml(getEditorTargetId("book", feedbackId))}">${escapeHtml(jumpText)}</button>` : ""}
                </div>
                ${bookUi.showFeedback ? `
                  <div
                    class="book-line-feedback"
                    data-book-feedback="${escapeHtml(feedbackId)}"
                    data-answer="${escapeHtml(answerText)}"
                    hidden
                  ></div>
                ` : ""}
              </div>
            </div>
          `;
          }).join("")}
        </div>
        </article>
      `;
  }).join("");

  const referenceTitle = referenceExercise && Object.prototype.hasOwnProperty.call(referenceExercise, "title")
    ? String(referenceExercise.title ?? "")
    : (currentLang === "en" ? "Pronoun Reference" : "代词指代练习");
  const referenceDescription = getReferenceExerciseDescription(referenceExercise);
  const referenceCard = referenceExercise?.checks?.length ? `
    <article id="${escapeHtml(getPracticeTargetId("reference-meta", referenceExercise.id || "7"))}" class="source-card source-card-reference">
      <div class="source-card-head">
        <div>
          <span class="exercise-index">Book ${escapeHtml(referenceExercise.id || "7")}</span>
          <h3>${escapeHtml(referenceTitle)}</h3>
        </div>
        ${detailEditorState.enabled ? `<button class="ghost-button developer-jump-button" type="button" data-jump-to-editor="${escapeHtml(getEditorTargetId("reference-meta", referenceExercise.id || "7"))}">${escapeHtml(jumpText)}</button>` : ""}
      </div>
      ${referenceDescription ? `<p class="source-description">${escapeHtml(referenceDescription)}</p>` : ""}
      <div class="source-passage">
        ${(referenceExercise.passage || []).map((line) => `<p class="source-dialogue">${escapeHtml(line)}</p>`).join("")}
      </div>
      <div class="reference-checks">
        ${(referenceExercise.checks || []).map((item, index) => {
          const checkId = `${referenceExercise.id || "7"}-${index}`;
          const explanationText = item.explanation || "";

          return `
            <div id="${escapeHtml(getPracticeTargetId("reference", checkId))}" class="reference-check-card" data-reference-line="${escapeHtml(checkId)}">
              <p class="reference-check-prompt">${escapeHtml(item.prompt)}</p>
              <div class="practice-explanation" data-reference-explanation-panel="${escapeHtml(checkId)}"${explanationText ? " hidden" : ` data-empty="true" hidden`}>
                <p class="practice-explanation-text">${escapeHtml(explanationText)}</p>
              </div>
              <div class="book-input-grid">
                <label class="book-input-wrap${referenceUi.showInputLabels ? "" : " is-label-hidden"}">
                  <span>${escapeHtml(referenceUi.inputLabel ?? "")}</span>
                  <input
                    class="book-line-input"
                    type="text"
                    autocomplete="off"
                    placeholder="${escapeHtml(referenceUi.inputPlaceholder ?? "")}"
                    data-reference-input="${escapeHtml(checkId)}"
                  >
                </label>
              </div>
              <div class="book-line-actions">
                ${referenceUi.showCheckButton ? `<button class="primary-button" type="button" data-reference-check="${escapeHtml(checkId)}">${escapeHtml(referenceUi.checkLabel ?? "")}</button>` : ""}
                ${referenceUi.showAnswerButton ? `<button class="ghost-button" type="button" data-reference-show="${escapeHtml(checkId)}">${escapeHtml(referenceUi.showAnswerLabel ?? "")}</button>` : ""}
                ${referenceUi.showAiButton ? `<button class="ghost-button ai-trigger-button" type="button" data-ask-ai="reference" data-reference-id="${escapeHtml(checkId)}">${escapeHtml(referenceUi.aiLabel ?? "")}</button>` : ""}
                ${detailEditorState.enabled ? `<button class="ghost-button developer-jump-button" type="button" data-jump-to-editor="${escapeHtml(getEditorTargetId("reference", checkId))}">${escapeHtml(jumpText)}</button>` : ""}
              </div>
              ${referenceUi.showFeedback ? `
                <div
                  class="book-line-feedback"
                  data-reference-feedback="${escapeHtml(checkId)}"
                  data-answer="${escapeHtml(item.answer)}"
                  hidden
                ></div>
              ` : ""}
            </div>
          `;
        }).join("")}
      </div>
    </article>
  ` : "";

  return `
    <div class="source-stack">
      ${renderInlinePracticeUiEditor("book", bookUi)}
      ${exerciseCards}
      ${referenceExercise?.checks?.length ? renderInlinePracticeUiEditor("reference", referenceUi) : ""}
      ${referenceCard}
    </div>
  `;
}

function renderAnswerSheet(answerSheet, note) {
  const entries = (answerSheet || []).map((line) => {
    const dividerIndex = String(line).indexOf(":");

    if (dividerIndex === -1) {
      return { label: currentLang === "en" ? "Answer" : "答案", value: String(line) };
    }

    return {
      label: String(line).slice(0, dividerIndex).trim(),
      value: String(line).slice(dividerIndex + 1).trim()
    };
  });

  return `
    <article class="answer-sheet">
      <p class="answer-sheet-kicker">${escapeHtml(currentLang === "en" ? "Answer Overview" : "答案总览")}</p>
      <div class="answer-sheet-grid">
        ${entries.map((entry) => `
          <div class="answer-chip">
            <span>${escapeHtml(entry.label)}</span>
            <strong>${escapeHtml(entry.value)}</strong>
          </div>
        `).join("")}
      </div>
      ${note ? `<p class="answer-sheet-note">${escapeHtml(note)}</p>` : ""}
    </article>
  `;
}

function renderSubunitPractice(subunit, quickExercises) {
  const practiceUi = getResolvedPracticeUiConfig(subunit.practiceUi || {});
  const modes = practiceUi.tabs || getDefaultPracticeUiConfig().tabs;
  const panels = [];

  if ((subunit.bookExercises || []).length) {
    panels.push({
      id: "book",
      label: modes.book,
      content: renderBookExercises(subunit.bookExercises || [], subunit.referenceChecks || [], practiceUi)
    });
  }

  if ((quickExercises || []).length) {
    panels.push({
      id: "quick",
      label: modes.quick,
      content: `
        ${renderInlinePracticeUiEditor("quick", practiceUi.quick)}
        <div class="practice-list practice-list-inline">${renderExercises(quickExercises || [], practiceUi)}</div>
      `
    });
  }

  if ((subunit.answerSheet || []).length) {
    panels.push({
      id: "answers",
      label: modes.answers,
      content: renderAnswerSheet(subunit.answerSheet || [], subunit.answerSheetNote || "")
    });
  }

  return `
    <div class="practice-deck practice-deck-simple">
      ${panels.map((panel) => `
        <section class="practice-mode-panel is-active" data-practice-panel="${escapeHtml(panel.id)}">
          ${panel.content}
        </section>
      `).join("")}
    </div>
  `;
}

function bindSubunitInteractions(container) {
  if (!container || container.dataset.subunitBound === "true") {
    return;
  }

  container.dataset.subunitBound = "true";
  const practiceUi = getCurrentPracticeUiConfig();

  const setBookFeedback = (feedbackNode, variant, message) => {
    if (!feedbackNode) {
      return;
    }

    feedbackNode.hidden = false;
    feedbackNode.className = `book-line-feedback is-${variant}`;
    feedbackNode.textContent = message;
  };

  const evaluateBookLine = (lineId, revealAnswer) => {
    const feedback = container.querySelector(`[data-book-feedback="${lineId}"]`);

    if (!feedback) {
      return;
    }

    const answerText = feedback.dataset.answer || "";
    const answerParts = getBookBlankAnswers(answerText);
    const inputs = Array.from(container.querySelectorAll(`[data-book-input^="${lineId}-"]`));
    const values = inputs.map((input) => normalizeBookInput(input.value));
    const normalizedAnswers = answerParts.map((answer) => normalizeBookInput(answer));

    if (revealAnswer) {
      setBookFeedback(
        feedback,
        "reveal",
        formatText(practiceUi.book.revealTemplate ?? "", { answer: answerText })
      );
      return;
    }

    if (values.some((value) => !value)) {
      setBookFeedback(
        feedback,
        "pending",
        practiceUi.book.pendingMessage ?? ""
      );
      return;
    }

    const isCorrect = normalizedAnswers.length === values.length
      && normalizedAnswers.every((answer, index) => answer === values[index]);

    setBookFeedback(
      feedback,
      isCorrect ? "correct" : "incorrect",
      isCorrect
        ? (practiceUi.book.correctMessage ?? "")
        : formatText(practiceUi.book.incorrectTemplate ?? "", { answer: answerText })
      );
  };

  const evaluateReferenceLine = (lineId, revealAnswer) => {
    const feedback = container.querySelector(`[data-reference-feedback="${lineId}"]`);

    if (!feedback) {
      return;
    }

    const answerText = feedback.dataset.answer || "";
    const input = container.querySelector(`[data-reference-input="${lineId}"]`);
    const value = normalizeBookInput(input?.value || "");
    const normalizedAnswer = normalizeBookInput(answerText);

    if (revealAnswer) {
      setBookFeedback(
        feedback,
        "reveal",
        formatText(practiceUi.reference.revealTemplate ?? "", { answer: answerText })
      );
      return;
    }

    if (!value) {
      setBookFeedback(
        feedback,
        "pending",
        practiceUi.reference.pendingMessage ?? ""
      );
      return;
    }

    setBookFeedback(
      feedback,
      value === normalizedAnswer ? "correct" : "incorrect",
      value === normalizedAnswer
        ? (practiceUi.reference.correctMessage ?? "")
        : formatText(practiceUi.reference.incorrectTemplate ?? "", { answer: answerText })
    );
  };

  container.addEventListener("click", (event) => {
    const modeButton = event.target.closest("[data-practice-mode]");

    if (modeButton) {
      const nextMode = modeButton.dataset.practiceMode;
      container.querySelectorAll("[data-practice-mode]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.practiceMode === nextMode);
      });
      container.querySelectorAll("[data-practice-panel]").forEach((panel) => {
        const isActive = panel.dataset.practicePanel === nextMode;
        panel.hidden = !isActive;
        panel.classList.toggle("is-active", isActive);
        });
        return;
      }

      const bookCheckButton = event.target.closest("[data-book-check]");

      if (bookCheckButton) {
        evaluateBookLine(bookCheckButton.dataset.bookCheck, false);
        return;
      }

      const bookShowButton = event.target.closest("[data-book-show]");

      if (bookShowButton) {
        evaluateBookLine(bookShowButton.dataset.bookShow, true);
        return;
      }

      const referenceCheckButton = event.target.closest("[data-reference-check]");

      if (referenceCheckButton) {
        evaluateReferenceLine(referenceCheckButton.dataset.referenceCheck, false);
        return;
      }

      const referenceShowButton = event.target.closest("[data-reference-show]");

      if (referenceShowButton) {
        evaluateReferenceLine(referenceShowButton.dataset.referenceShow, true);
        return;
      }
    });

  container.addEventListener("keydown", (event) => {
    const bookInput = event.target.closest("[data-book-input]");

    if (!bookInput || event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    const parts = bookInput.dataset.bookInput.split("-");
    const lineId = `${parts[0]}-${parts[1]}`;
    evaluateBookLine(lineId, false);
  });

  container.addEventListener("keydown", (event) => {
    const referenceInput = event.target.closest("[data-reference-input]");

    if (!referenceInput || event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    evaluateReferenceLine(referenceInput.dataset.referenceInput, false);
  });
}

function renderExamples(examples) {
  const ui = getUi();

  return examples.map((example, index) => {
    const translation = example.zh ? `<p class="example-zh">${escapeHtml(example.zh)}</p>` : "";
    const note = example.note ? `<p class="example-note">${escapeHtml(example.note)}</p>` : "";

    return `
      <article class="example-card" style="animation-delay:${index * 70}ms">
        <div class="example-card-head">
          <span class="example-index">${escapeHtml(formatText(ui.exampleLabel, { index: index + 1 }))}</span>
        </div>
        <p class="example-de">${escapeHtml(example.de)}</p>
        ${translation}
        ${note}
      </article>
    `;
  }).join("");
}

function renderExercises(exercises, practiceUi = getDefaultPracticeUiConfig(), startIndex = 0) {
  const ui = getUi();
  const quickUi = getResolvedPracticeUiConfig(practiceUi).quick;
  const askAiText = quickUi.aiLabel ?? "";
  const jumpText = detailEditorState.enabled ? getLocalEditorUi().jumpToEditor : "";
  const showAnswerText = quickUi.showAnswerLabel ?? "";
  const checkText = quickUi.checkLabel ?? "";
  const choiceTypeText = quickUi.choiceTypeLabel ?? "";
  const fillTypeText = quickUi.fillTypeLabel ?? "";

  return exercises.map((exercise, index) => {
    const absoluteIndex = startIndex + index;

    if (exercise.type === "choice") {
      return `
        <article id="${escapeHtml(getPracticeTargetId("quick", absoluteIndex))}" class="exercise-card" data-exercise-index="${absoluteIndex}" data-exercise-type="choice">
          <div class="exercise-card-head">
            <span class="exercise-index">${escapeHtml(formatText(ui.exerciseLabel, { index: absoluteIndex + 1 }))}</span>
            <span class="exercise-type">${escapeHtml(choiceTypeText)}</span>
          </div>
          <h3>${escapeHtml(exercise.question)}</h3>
          <div class="option-list">
            ${exercise.options.map((option, optionIndex) => `
              <button type="button" class="option-button" data-option-index="${optionIndex}">
                <span class="option-badge">${String.fromCharCode(65 + optionIndex)}</span>
                <span>${escapeHtml(option)}</span>
              </button>
            `).join("")}
            </div>
            <div class="exercise-actions">
              ${quickUi.showAiButton ? `<button type="button" class="ghost-button ai-trigger-button" data-ask-ai="quick" data-exercise-index="${absoluteIndex}">${escapeHtml(askAiText)}</button>` : ""}
              ${quickUi.showAnswerButton ? `<button type="button" class="ghost-button" data-show-answer>${escapeHtml(showAnswerText)}</button>` : ""}
              ${detailEditorState.enabled ? `<button type="button" class="ghost-button developer-jump-button" data-jump-to-editor="${escapeHtml(getEditorTargetId("quick", absoluteIndex))}">${escapeHtml(jumpText)}</button>` : ""}
            </div>
            ${quickUi.showFeedback ? `<div class="exercise-feedback" hidden></div>` : ""}
          </article>
      `;
    }

    return `
      <article id="${escapeHtml(getPracticeTargetId("quick", absoluteIndex))}" class="exercise-card" data-exercise-index="${absoluteIndex}" data-exercise-type="fill">
        <div class="exercise-card-head">
          <span class="exercise-index">${escapeHtml(formatText(ui.exerciseLabel, { index: absoluteIndex + 1 }))}</span>
          <span class="exercise-type">${escapeHtml(fillTypeText)}</span>
        </div>
        <h3>${escapeHtml(exercise.question)}</h3>
        <div class="fill-row">
          <input class="fill-input" type="text" placeholder="${escapeHtml(quickUi.fillPlaceholder ?? "")}" autocomplete="off">
        </div>
          <div class="exercise-actions">
            ${quickUi.showCheckButton ? `<button type="button" class="primary-button" data-check-answer>${escapeHtml(checkText)}</button>` : ""}
            ${quickUi.showAnswerButton ? `<button type="button" class="ghost-button" data-show-answer>${escapeHtml(showAnswerText)}</button>` : ""}
            ${quickUi.showAiButton ? `<button type="button" class="ghost-button ai-trigger-button" data-ask-ai="quick" data-exercise-index="${absoluteIndex}">${escapeHtml(askAiText)}</button>` : ""}
            ${detailEditorState.enabled ? `<button type="button" class="ghost-button developer-jump-button" data-jump-to-editor="${escapeHtml(getEditorTargetId("quick", absoluteIndex))}">${escapeHtml(jumpText)}</button>` : ""}
          </div>
          ${quickUi.showFeedback ? `<div class="exercise-feedback" hidden></div>` : ""}
        </article>
    `;
  }).join("");
}

function renderReadingFlow(topic, practiceUi = getDefaultPracticeUiConfig()) {
  const examples = topic.localizedExamples || [];
  const exercises = topic.localizedExercises || [];
  const jumpText = detailEditorState.enabled ? getLocalEditorUi().jumpToEditor : "";
  const blocks = Array.isArray(topic.readingBlocks) && topic.readingBlocks.length
    ? topic.readingBlocks
    : [{ textIndex: 0, questionStart: 0, questionEnd: exercises.length }];

  return blocks.map((block, blockIndex) => {
    const textIndex = Number(block.textIndex) || 0;
    const start = Math.max(0, Number(block.questionStart) || 0);
    const end = Math.min(exercises.length, Number(block.questionEnd) || exercises.length);
    const text = examples[textIndex] || { de: "", zh: "", note: "" };
    const questionList = exercises.slice(start, end);
    const lines = String(text.de || "").split("\n");

    while (lines.length && !lines[0].trim()) {
      lines.shift();
    }

    const firstLine = lines[0]?.trim() || "";
    const hasInlineTextTitle = /^text\s*\d+$/i.test(firstLine);
    const textTitle = hasInlineTextTitle ? firstLine : `Text ${textIndex + 1}`;

    if (hasInlineTextTitle) {
      lines.shift();

      while (lines.length && !lines[0].trim()) {
        lines.shift();
      }
    }

    const textBody = lines.join("\n");
    const paragraphBlocks = textBody
      .split(/\n\s*\n/g)
      .map((blockText) => blockText.split("\n").map((line) => line.trim()).filter(Boolean))
      .filter((blockLines) => blockLines.length > 0);

    const paragraphHtml = paragraphBlocks.map((blockLines) => {
      let content = escapeHtml(blockLines[0]);

      for (let i = 1; i < blockLines.length; i += 1) {
        const previousLine = blockLines[i - 1];
        const currentLine = escapeHtml(blockLines[i]);
        const appendAsSentence = /[.!?;,，。！？；:：)]$/.test(previousLine);
        content += appendAsSentence ? ` ${currentLine}` : `<br>${currentLine}`;
      }

      return `<p>${content}</p>`;
    }).join("");

    return `
      <section class="reading-flow-block" data-reading-block="${blockIndex + 1}">
        <article id="${escapeHtml(getPracticeTargetId("reading", textIndex))}" class="reading-text-card">
          <div class="reading-text-head">
            <h3 class="reading-text-title">${escapeHtml(textTitle)}</h3>
            ${detailEditorState.enabled ? `<button type="button" class="ghost-button developer-jump-button" data-jump-to-editor="${escapeHtml(getEditorTargetId("reading", textIndex))}">${escapeHtml(jumpText)}</button>` : ""}
          </div>
          <div class="reading-text-body">${paragraphHtml || `<p>${escapeHtml(textBody)}</p>`}</div>
        </article>
        <div class="reading-question-list">
          ${renderExercises(questionList, practiceUi, start)}
        </div>
      </section>
    `;
  }).join("");
}

function setFeedback(card, variant, title, answerText, explanation, practiceUi = getDefaultPracticeUiConfig()) {
  const feedback = card.querySelector(".exercise-feedback");
  const quickUi = getResolvedPracticeUiConfig(practiceUi).quick;

  if (!feedback || !quickUi.showFeedback) {
    return;
  }

  feedback.hidden = false;
  feedback.className = `exercise-feedback is-${variant}`;
  feedback.innerHTML = `
    <p class="feedback-title">${escapeHtml(title)}</p>
    ${answerText ? `<p class="feedback-answer">${escapeHtml(answerText)}</p>` : ""}
    ${explanation ? `<p class="feedback-text">${escapeHtml(explanation)}</p>` : ""}
  `;
}

function updateChoiceState(card, exercise, selectedIndex, revealOnly) {
  const buttons = card.querySelectorAll(".option-button");
  const correctIndex = exercise.answerIndex;

  buttons.forEach((button, index) => {
    button.classList.remove("is-selected", "is-correct", "is-incorrect");

    if (index === correctIndex) {
      button.classList.add("is-correct");
    }

    if (!revealOnly && index === selectedIndex) {
      button.classList.add("is-selected");

      if (selectedIndex !== correctIndex) {
        button.classList.add("is-incorrect");
      }
    }
  });
}

function checkChoiceExercise(card, selectedIndex) {
  const practiceUi = getCurrentPracticeUiConfig();
  const quickUi = practiceUi.quick;
  const exercise = currentExercises[Number(card.dataset.exerciseIndex)];
  const correctIndex = exercise.answerIndex;
  const selectedOption = exercise.options[selectedIndex];
  const answerText = formatText(quickUi.correctAnswerTemplate || "", { answer: exercise.options[correctIndex] });
  const isCorrect = selectedIndex === correctIndex;

  updateChoiceState(card, exercise, selectedIndex, false);
  setFeedback(
    card,
    isCorrect ? "correct" : "incorrect",
    isCorrect ? (quickUi.correctTitle ?? "") : (quickUi.incorrectTitle ?? ""),
    isCorrect ? formatText(quickUi.youChoseTemplate ?? "", { answer: selectedOption }) : answerText,
    exercise.explanation || "",
    practiceUi
  );
}

function revealChoiceExercise(card) {
  const practiceUi = getCurrentPracticeUiConfig();
  const quickUi = practiceUi.quick;
  const exercise = currentExercises[Number(card.dataset.exerciseIndex)];

  updateChoiceState(card, exercise, -1, true);
  setFeedback(
    card,
    "reveal",
    quickUi.revealTitle ?? "",
    formatText(quickUi.correctAnswerTemplate ?? "", { answer: exercise.options[exercise.answerIndex] }),
    exercise.explanation || "",
    practiceUi
  );
}

function checkFillExercise(card, revealOnly) {
  const practiceUi = getCurrentPracticeUiConfig();
  const quickUi = practiceUi.quick;
  const exercise = currentExercises[Number(card.dataset.exerciseIndex)];
  const input = card.querySelector(".fill-input");
  const inputValue = input ? input.value : "";
  const normalizedInput = normalizeAnswer(inputValue);
  const isCorrect = (exercise.answers || []).some((answer) => normalizeAnswer(answer) === normalizedInput);

  if (input) {
    input.classList.remove("is-correct", "is-incorrect");

    if (!revealOnly && normalizedInput) {
      input.classList.add(isCorrect ? "is-correct" : "is-incorrect");
    }
  }

  if (revealOnly) {
    setFeedback(
      card,
      "reveal",
      quickUi.revealTitle ?? "",
      formatText(quickUi.correctAnswerTemplate ?? "", { answer: exercise.displayAnswer || exercise.answers[0] }),
      exercise.explanation || "",
      practiceUi
    );
    return;
  }

  if (!normalizedInput) {
    setFeedback(
      card,
      "incorrect",
      quickUi.tryFillTitle ?? "",
      formatText(quickUi.correctAnswerTemplate ?? "", { answer: exercise.displayAnswer || exercise.answers[0] }),
      quickUi.tryFillText ?? "",
      practiceUi
    );
    return;
  }

  setFeedback(
    card,
    isCorrect ? "correct" : "incorrect",
    isCorrect ? (quickUi.correctTitle ?? "") : (quickUi.incorrectSoftTitle ?? quickUi.incorrectTitle ?? ""),
    formatText(quickUi.correctAnswerTemplate ?? "", { answer: exercise.displayAnswer || exercise.answers[0] }),
    exercise.explanation || "",
    practiceUi
  );
}

function bindPracticeInteractions(container) {
  if (!container || container.dataset.bound === "true") {
    return;
  }

  container.dataset.bound = "true";

  container.addEventListener("click", (event) => {
    const optionButton = event.target.closest(".option-button");
    const actionButton = event.target.closest("[data-check-answer], [data-show-answer]");

    if (optionButton) {
      const card = optionButton.closest(".exercise-card");
      checkChoiceExercise(card, Number(optionButton.dataset.optionIndex));
      return;
    }

    if (!actionButton) {
      return;
    }

    const card = actionButton.closest(".exercise-card");

    if (actionButton.hasAttribute("data-check-answer")) {
      checkFillExercise(card, false);
      return;
    }

    if (card.dataset.exerciseType === "choice") {
      const feedback = card.querySelector(".exercise-feedback");
      if (feedback && !feedback.hidden && feedback.classList.contains("is-reveal")) {
        feedback.hidden = true;
        feedback.innerHTML = "";
        return;
      }

      revealChoiceExercise(card);
      return;
    }

    checkFillExercise(card, true);
  });

  container.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || !event.target.classList.contains("fill-input")) {
      return;
    }

    event.preventDefault();
    const card = event.target.closest(".exercise-card");
    checkFillExercise(card, false);
  });
}

function bindHomeTabs() {
  const buttons = document.querySelectorAll("[data-view-target]");
  const panels = document.querySelectorAll("[data-view]");

  if (!buttons.length || !panels.length) {
    return;
  }

  const setHomeView = (target) => {
    const nextTarget = String(target || "").trim() || "grammar";
    document.body.dataset.homeView = nextTarget;
    buttons.forEach((item) => item.classList.toggle("is-active", item.dataset.viewTarget === nextTarget));
    panels.forEach((panel) => {
      panel.classList.toggle("is-visible", panel.dataset.view === nextTarget);
    });
  };

  buttons.forEach((button) => {
    if (button.dataset.bound === "true") {
      return;
    }

    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      setHomeView(button.dataset.viewTarget);
    });
  });

  setHomeView(document.body.dataset.homeView || "grammar");
}

function updateLanguageButtons() {
  document.querySelectorAll("[data-lang-option]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.langOption === currentLang);
  });

  document.documentElement.lang = currentLang === "en" ? "en" : "zh-CN";
}

function bindLanguageControls() {
  document.querySelectorAll("[data-lang-option]").forEach((button) => {
    if (button.dataset.bound === "true") {
      return;
    }

    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      const nextLang = button.dataset.langOption;

      if (nextLang === currentLang) {
        return;
      }

      currentLang = nextLang === "en" ? "en" : "zh";
      setPreferredLanguage(currentLang);
      renderAll();
    });
  });
}

async function ensureLocalAiConfigLoaded(force = false) {
  if (homeApiConfigState.loading) {
    return homeApiConfigState.form;
  }

  if (homeApiConfigState.loaded && !force) {
    return homeApiConfigState.form;
  }

  homeApiConfigState.loading = true;
  renderAll();

  try {
    const response = await fetch(getLocalAiConfigApiUrl(), {
      method: "GET",
      mode: "cors",
      cache: "no-store"
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.error || `HTTP ${response.status}`);
    }

    const payload = await response.json();
    updateLocalAiConfigState(payload?.config || {});
    homeApiConfigState.feedbackMessage = "";
    homeApiConfigState.feedbackVariant = "info";
  } catch (error) {
    console.error("Failed to load local AI config:", error);
    homeApiConfigState.feedbackMessage = getHomeApiConfigUi().loadFailed;
    homeApiConfigState.feedbackVariant = "error";
  } finally {
    homeApiConfigState.loading = false;
    homeApiConfigState.loaded = true;
    renderAll();
  }

  return homeApiConfigState.form;
}

function renderHomeApiConfigPanel() {
  const panel = document.getElementById("home-local-ai-config-panel");

  if (!panel) {
    return;
  }

  if (!document.body.classList.contains("page-home") || !detailEditorState.enabled) {
    panel.hidden = true;
    panel.innerHTML = "";
    return;
  }

  if (!homeApiConfigState.loaded && !homeApiConfigState.loading) {
    ensureLocalAiConfigLoaded();
  }

  const ui = getHomeApiConfigUi();
  const feedbackVariant = ["success", "error", "info"].includes(homeApiConfigState.feedbackVariant)
    ? homeApiConfigState.feedbackVariant
    : "info";

  panel.hidden = false;
  panel.classList.add("home-api-config-panel");
  panel.innerHTML = `
    <div class="panel-header home-publish-head">
      <div>
        <p class="section-kicker">LOCAL ONLY</p>
        <h2>${escapeHtml(ui.title)}</h2>
        <p class="section-note home-api-panel-note">${escapeHtml(ui.note)}</p>
      </div>
    </div>
    <div class="home-api-form-grid is-single">
      <label class="local-settings-field">
        <span>${escapeHtml(ui.apiKey)}</span>
        <input
          id="home-local-ai-api-key"
          class="local-settings-input"
          type="password"
          autocomplete="off"
          spellcheck="false"
          value="${escapeHtml(homeApiConfigState.form.apiKey)}"
          placeholder="${escapeHtml(ui.apiKeyPlaceholder)}"
        >
      </label>
    </div>
    <div class="home-publish-actions">
      <button
        id="home-local-ai-save"
        class="primary-button"
        type="button"
        ${homeApiConfigState.loading || homeApiConfigState.saving ? "disabled" : ""}
      >${escapeHtml(homeApiConfigState.saving ? ui.saving : ui.save)}</button>
    </div>
    ${homeApiConfigState.loading ? `<p class="local-editor-feedback local-editor-feedback-info">${escapeHtml(ui.loading)}</p>` : ""}
    ${!homeApiConfigState.loading && homeApiConfigState.feedbackMessage ? `<p class="local-editor-feedback local-editor-feedback-${feedbackVariant}">${escapeHtml(homeApiConfigState.feedbackMessage)}</p>` : ""}
  `;
}

async function saveLocalAiConfig() {
  const ui = getHomeApiConfigUi();
  const apiKey = String(homeApiConfigState.form.apiKey || "").trim();

  if (!apiKey) {
    homeApiConfigState.feedbackMessage = ui.saveMissing;
    homeApiConfigState.feedbackVariant = "error";
    renderAll();
    return;
  }

  homeApiConfigState.saving = true;
  homeApiConfigState.feedbackMessage = ui.saving;
  homeApiConfigState.feedbackVariant = "info";
  renderAll();

  try {
    const response = await fetch(getLocalAiConfigApiUrl(), {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        config: {
          baseUrl: "https://us.novaiapi.com/v1",
          apiKey,
          defaultModel: homeApiConfigState.form.defaultModel || DEFAULT_AI_MODE_OPTIONS[0].id,
          modelIds: "",
          providerLabel: "Novai Direct API"
        }
      })
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.error || `HTTP ${response.status}`);
    }

    const payload = await response.json();
    updateLocalAiConfigState(payload?.config || {});
    homeApiConfigState.loaded = true;
    aiState.checked = false;
    aiState.available = false;

    const statusResponse = await fetch(getAiApiUrl("/status"), {
      method: "GET",
      mode: "cors",
      cache: "no-store"
    });
    const statusPayload = await statusResponse.json().catch(() => ({}));

    if (!statusResponse.ok || !statusPayload?.ok) {
      throw new Error(statusPayload?.details || statusPayload?.message || `HTTP ${statusResponse.status}`);
    }

    applyAiModelPayload(statusPayload, aiState.manualModelSelection);
    aiState.available = true;
    aiState.checked = true;
    aiState.status = "ready";
    homeApiConfigState.feedbackMessage = ui.saveDone;
    homeApiConfigState.feedbackVariant = "success";
  } catch (error) {
    console.error("Failed to save local AI config:", error);
    homeApiConfigState.feedbackMessage = error instanceof Error && error.message
      ? `${ui.saveFailed} ${error.message}`
      : ui.saveFailed;
    homeApiConfigState.feedbackVariant = "error";
  } finally {
    homeApiConfigState.saving = false;
    renderAll();
  }
}

function bindHomeApiConfigPanel() {
  if (document.body.dataset.homeApiConfigBound === "true") {
    return;
  }

  document.body.dataset.homeApiConfigBound = "true";

  document.addEventListener("input", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (target.id === "home-local-ai-api-key") {
      updateLocalAiConfigState({ apiKey: target.value });
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("#home-local-ai-save")) {
      saveLocalAiConfig();
    }
  });
}

function renderHomePublishPanel() {
  const panel = document.getElementById("home-local-publish-panel");

  if (!panel) {
    return;
  }

  if (!document.body.classList.contains("page-home") || !detailEditorState.enabled) {
    panel.hidden = true;
    panel.innerHTML = "";
    return;
  }

  const ui = getHomePublishUi();
  const feedbackVariant = ["success", "error", "info"].includes(homePublishState.feedbackVariant)
    ? homePublishState.feedbackVariant
    : "info";

  panel.hidden = false;
  panel.classList.add("is-minimal");
  panel.innerHTML = `
    <div class="home-publish-actions">
      <button
        id="home-publish-all"
        class="primary-button"
        type="button"
        ${homePublishState.publishing ? "disabled" : ""}
      >${escapeHtml(homePublishState.publishing ? ui.publishing : ui.publish)}</button>
    </div>
    ${homePublishState.feedbackMessage ? `<p class="local-editor-feedback local-editor-feedback-${feedbackVariant}">${escapeHtml(homePublishState.feedbackMessage)}</p>` : ""}
  `;
}

async function publishAllLocalDetailDrafts() {
  const ui = getHomePublishUi();
  const store = sanitizeDetailOverrideStore(getDetailOverrideStore());
  const pageCount = Object.keys(store).length;

  homePublishState.publishing = true;
  homePublishState.feedbackMessage = ui.publishing;
  homePublishState.feedbackVariant = "info";
  renderAll();

  try {
    if (pageCount > 0) {
      const response = await fetch(getLocalEditorApiUrl("/publish-all"), {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ store })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error || `HTTP ${response.status}`);
      }
    }

    const sitePublishResponse = await fetch(getLocalEditorApiUrl("/site/publish"), {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });

    if (!sitePublishResponse.ok) {
      const payload = await sitePublishResponse.json().catch(() => ({}));
      throw new Error(payload?.error || `HTTP ${sitePublishResponse.status}`);
    }

    await loadPublishedDetailOverrides(true);
    homePublishState.feedbackMessage = ui.done;
    homePublishState.feedbackVariant = "success";
  } catch (error) {
    console.error("Publish all drafts failed:", error);
    homePublishState.feedbackMessage = ui.failed;
    homePublishState.feedbackVariant = "error";
  } finally {
    homePublishState.publishing = false;
    renderAll();
  }
}

function bindHomePublishPanel() {
  if (document.body.dataset.homePublishBound === "true") {
    return;
  }

  document.body.dataset.homePublishBound = "true";

  document.addEventListener("click", (event) => {
    if (event.target.closest("#home-publish-all")) {
      publishAllLocalDetailDrafts();
      return;
    }

    if (event.target.closest("#home-publish-refresh")) {
      loadPublishedDetailOverrides(true).then(() => {
        renderAll();
      });
    }
  });
}

function renderHomePage() {
  if (!document.body.classList.contains("page-home")) {
    return;
  }

  const ui = getUi();
  const fav1 = buildLocalizedTopic("A1", getTopicById("A1", "verben-1"));
  const fav2 = buildLocalizedTopic("A1", getTopicById("A1", "pronomen-nomen-artikel"));
  const fav3 = buildLocalizedTopic("A2", getTopicById("A2", "subordinate-clauses"));

  document.title = ui.appTitle;
  setText("nav-grammar-button", ui.navGrammar);
  setText("nav-favorites-button", ui.navFavorites);
  setText("home-hero-title", ui.homeHeroTitle);
  setText("home-hero-text", ui.homeHeroText);
  setText("home-levels-title", ui.homeLevelsTitle);
  setText("home-levels-note", ui.homeLevelsNote);
  setText("home-a1-title", ui.homeA1Title);
  setText("home-a1-text", ui.homeA1Text);
  setText("home-a1-link", ui.homeA1Link);
  setText("home-a2-title", ui.homeA2Title);
  setText("home-a2-text", ui.homeA2Text);
  setText("home-a2-link", ui.homeA2Link);
  setText("home-favorites-title", ui.homeFavoritesTitle);
  setText("home-favorites-note", ui.homeFavoritesNote);

  if (fav1) {
    setText("home-fav-1-title", fav1.title);
    setText("home-fav-1-text", fav1.summary);
  }

  if (fav2) {
    setText("home-fav-2-title", fav2.title);
    setText("home-fav-2-text", fav2.summary);
  }

  if (fav3) {
    setText("home-fav-3-title", fav3.title);
    setText("home-fav-3-text", fav3.summary);
  }

  setText("home-fav-1-link", ui.homeFavoriteLink);
  setText("home-fav-2-link", ui.homeFavoriteLink);
  setText("home-fav-3-link", ui.homeFavoriteLink);
  updateThemeButtons();
  renderHomePublishPanel();
}

function renderListPage() {
  const title = document.getElementById("level-title");
  const description = document.getElementById("level-description");
  const list = document.getElementById("grammar-list");
  const count = document.getElementById("item-count");
  const partSwitch = document.getElementById("list-part-switch");
  const partPlaceholder = document.getElementById("list-part-placeholder");

  if (!title || !description || !list || !count) {
    return;
  }

  const ui = getUi();
  const params = new URLSearchParams(window.location.search);
  const level = getLevelKey(params.get("level") || "A1");
  const urlPart = normalizeA1ListPart(params.get("part"));
  const activePart = setA1ListPart(
    urlPart || listPageState.a1Part || readStoredA1ListPart() || DEFAULT_A1_LIST_PART,
    false
  );
  const current = grammarData[level];
  const readingCurrent = readingData[level] || { description: "", items: [] };

  if (!current) {
    return;
  }

  document.title = `${level} ${ui.listTitleSuffix}`;
  setText("list-home-link", ui.listBackHome);
  setText(
    "list-section-title",
    level === "A1" && current.items.some((item) => Array.isArray(item.subunits) && item.subunits.length > 0)
      ? (currentLang === "en" ? "Major Units" : "A1 大单元")
      : ui.listSectionTitle
  );
  title.textContent = level;
  description.textContent = getLevelDescription(level, "grammar");
  const hasGroupedOutline = level === "A1"
    && current.items.some((item) => Array.isArray(item.subunits) && item.subunits.length > 0);

  if (!hasGroupedOutline) {
    if (partSwitch) {
      partSwitch.hidden = true;
      partSwitch.innerHTML = "";
    }

    if (partPlaceholder) {
      partPlaceholder.hidden = true;
      partPlaceholder.innerHTML = "";
    }

    list.hidden = false;
    count.textContent = getListCountText(level, current);
    list.innerHTML = renderListCards(level, current.items, "grammar");
    return;
  }

  const partUi = getA1ListPartUi();
  description.textContent = getLevelDescription(level, activePart);

  if (partSwitch) {
    partSwitch.hidden = false;
    partSwitch.innerHTML = `
      <div class="list-part-tabs" role="tablist" aria-label="${escapeHtml(partUi.ariaLabel)}">
        ${A1_LIST_PARTS.map((part) => {
          const label = partUi[part] || part;
          const isActive = part === activePart;
          return `
          <button
            class="list-part-button${isActive ? " is-active" : ""}"
            type="button"
            role="tab"
            aria-selected="${isActive ? "true" : "false"}"
            data-a1-list-part="${escapeHtml(part)}"
          >${escapeHtml(label)}</button>
        `;
        }).join("")}
      </div>
    `;
  }

  if (activePart === "grammar") {
    setText("list-section-title", partUi.grammarTitle);
    count.textContent = getListCountText(level, current);
    list.hidden = false;
    list.innerHTML = renderListCards(level, current.items, "grammar");

    if (partPlaceholder) {
      partPlaceholder.hidden = true;
      partPlaceholder.innerHTML = "";
    }

    return;
  }

  const isReading = activePart === "reading";
  const isListening = activePart === "listening";
  const titleText = isReading
    ? partUi.readingTitle
    : (isListening ? partUi.listeningTitle : partUi.writingTitle);
  const countText = isReading
    ? partUi.readingCount
    : (isListening ? partUi.listeningCount : partUi.writingCount);
  const placeholderTitle = isReading
    ? partUi.readingPlaceholderTitle
    : (isListening ? partUi.listeningPlaceholderTitle : partUi.writingPlaceholderTitle);
  const placeholderText = isReading
    ? partUi.readingPlaceholderText
    : (isListening ? partUi.listeningPlaceholderText : partUi.writingPlaceholderText);
  const placeholderTag = isReading
    ? partUi.readingTitle
    : (isListening ? partUi.listeningTitle : partUi.writingTitle);

  if (isReading && Array.isArray(readingCurrent.items) && readingCurrent.items.length > 0) {
    setText("list-section-title", partUi.readingTitle);
    count.textContent = currentLang === "en"
      ? `${readingCurrent.items.length} reading sets`
      : `${readingCurrent.items.length} 个阅读题组`;
    list.hidden = false;
    list.innerHTML = renderListCards(level, readingCurrent.items, "reading");

    if (partPlaceholder) {
      partPlaceholder.hidden = true;
      partPlaceholder.innerHTML = "";
    }

    return;
  }

  setText("list-section-title", titleText);
  count.textContent = countText;
  list.innerHTML = "";
  list.hidden = true;

  if (partPlaceholder) {
    partPlaceholder.hidden = false;
    partPlaceholder.innerHTML = `
      <article class="list-placeholder-card">
        <span class="list-placeholder-tag">${escapeHtml(placeholderTag)}</span>
        <h3>${escapeHtml(placeholderTitle)}</h3>
        <p>${escapeHtml(placeholderText)}</p>
      </article>
    `;
  }
}

function renderReadingTopicPage(level, topic, elements, sourcePart = "reading") {
  const {
    title,
    summary,
    overview,
    focusList,
    exampleList,
    practiceList,
    subunitsPanel,
    stats,
    exampleSection,
    practiceSection
  } = elements;

  const backLink = document.getElementById("detail-back-link");
  const breadcrumb = document.getElementById("detail-breadcrumb");
  const levelBadge = document.getElementById("detail-level-badge");
  const type = document.getElementById("detail-type");
  const exerciseCount = document.getElementById("detail-exercise-count");
  const guideGrid = document.getElementById("detail-guide-grid");
  const notePanel = document.getElementById("detail-note-panel");
  const practiceHeader = practiceSection?.querySelector(".detail-panel-header");
  const practiceNote = document.getElementById("detail-practice-note");
  const heroCopy = document.querySelector(".detail-hero-copy");
  const hero = document.querySelector(".detail-hero");

  document.title = `${level} | ${topic.title}`;
  document.body.classList.add("detail-reading-mode");

  if (hero) {
    hero.classList.add("detail-hero-compact");
  }

  if (heroCopy) {
    heroCopy.hidden = true;
  }

  if (backLink) {
    backLink.href = `list.html?level=${encodeURIComponent(level)}&part=${encodeURIComponent(sourcePart)}`;
    backLink.textContent = currentLang === "en" ? `Back to ${level} Reading` : `返回${level}阅读`;
  }

  if (breadcrumb) {
    breadcrumb.href = "index.html";
    breadcrumb.textContent = currentLang === "en" ? "Back Home" : "返回主页";
    breadcrumb.setAttribute("aria-label", currentLang === "en" ? "Back to home page" : "返回主页");
  }

  if (levelBadge) {
    levelBadge.textContent = level;
  }

  if (type) {
    type.textContent = currentLang === "en" ? "Reading" : "阅读";
  }

  if (title) {
    title.textContent = topic.title;
  }

  if (summary) {
    summary.textContent = topic.summary;
    summary.hidden = true;
  }

  if (overview) {
    overview.textContent = topic.overview;
  }

  if (exerciseCount) {
    exerciseCount.textContent = String((topic.localizedExercises || []).length);
  }

  if (focusList) {
    focusList.hidden = true;
    focusList.innerHTML = "";
  }

  if (stats) {
    stats.hidden = true;
  }

  if (guideGrid) {
    guideGrid.hidden = true;
  }

  if (notePanel) {
    notePanel.hidden = true;
  }

  if (subunitsPanel) {
    subunitsPanel.hidden = true;
  }

  if (exampleSection) {
    exampleSection.hidden = true;
  }

  if (exampleList) {
    exampleList.className = "example-list";
    exampleList.innerHTML = "";
  }

  if (practiceSection) {
    practiceSection.hidden = false;
    practiceSection.classList.add("reading-practice-shell");
  }

  if (practiceHeader) {
    practiceHeader.hidden = false;
  }

  setText("detail-practice-title", currentLang === "en" ? "Texts & Questions" : "原文与题目");

  if (practiceNote) {
    practiceNote.textContent = "";
    practiceNote.hidden = true;
  }

  currentExercises = topic.localizedExercises || [];
  currentPracticeContext = {
    level,
    topicTitle: topic.title,
    subunitTitle: "",
    quickExercises: topic.localizedExercises || [],
    bookExercises: [],
    referenceExercise: null,
    practiceUi: topic.practiceUi || getDefaultPracticeUiConfig()
  };

  practiceList.className = "practice-list reading-practice-list reading-flow-list";
  practiceList.innerHTML = renderReadingFlow(topic, currentPracticeContext.practiceUi);
  bindPracticeInteractions(practiceList);
  renderLocalDetailEditor(topic, {
    level,
    topicId: topic.id,
    pageType: "topic",
    sourcePart: "reading"
  });
}

function renderSubunitPage(level, topic, subunit, elements) {
  const ui = getUi();
  const {
    title,
    summary,
    overview,
    focusList,
    exampleList,
    practiceList,
    subunitsPanel,
    stats,
    exampleSection,
    practiceSection
  } = elements;

  const backLink = document.getElementById("detail-back-link");
  const breadcrumb = document.getElementById("detail-breadcrumb");
  const levelBadge = document.getElementById("detail-level-badge");
  const type = document.getElementById("detail-type");
  const tip = document.getElementById("detail-tip");
  const exerciseCount = document.getElementById("detail-exercise-count");
  const notePanel = document.getElementById("detail-note-panel");
  const guideGrid = document.getElementById("detail-guide-grid");
  const guidePanelHeader = document.querySelector("#detail-guide-panel .detail-panel-header");
  const heroEyebrow = document.querySelector(".detail-hero-copy .eyebrow");
  const heroMeta = document.querySelector(".detail-hero-meta");
  const practiceHeader = practiceSection?.querySelector(".detail-panel-header");
  const hasQuickExercises = (subunit.quickExercises || []).length > 0;
  const overviewEditorTarget = getEditorTargetId("overview", "main");
  const visibleRuleBlocks = getVisibleSubunitRuleBlocks(subunit.rules || []).map((rule) => ({
    ...rule,
    note: ""
  }));

  document.title = `${level} | ${subunit.code} ${subunit.title}`;
  setText("detail-stats-exercises", currentLang === "en" ? "Tasks" : "题目数");
  setText("detail-guide-title", currentLang === "en" ? "Knowledge Explanation" : "知识讲解");
  setText("detail-tip-title", ui.detailTipTitle);
  setText("detail-examples-title", currentLang === "en" ? "Core Tables" : "核心表格");
  setText("detail-practice-title", currentLang === "en" ? "Practice Studio" : "练习工作台");
  setText(
    "detail-practice-note",
    hasQuickExercises
      ? (currentLang === "en" ? "Switch between the original book tasks, interactive practice, and the answer sheet." : "可以在原书练习、交互练习和答案总览之间切换。")
      : (currentLang === "en" ? "Work through the original book tasks and use the answer sheet when you need to check." : "先做原书练习，需要核对时再看答案总览。")
  );
  setText("detail-tip-tag-1", currentLang === "en" ? "Read the table" : "先看表格");
  setText("detail-tip-tag-2", currentLang === "en" ? "Locate the referent" : "先找指代");
  setText("detail-tip-tag-3", currentLang === "en" ? "Practice in context" : "再进语境");

  if (backLink) {
    backLink.href = buildTopicUrl(level, topic.id);
    backLink.textContent = currentLang === "en" ? `Back to ${topic.title}` : `返回 ${topic.title}`;
  }

  if (breadcrumb) {
    breadcrumb.href = "index.html";
    breadcrumb.textContent = currentLang === "en" ? "Back Home" : "返回主页";
    breadcrumb.setAttribute("aria-label", currentLang === "en" ? "Back to home page" : "返回主页");
  }

  if (levelBadge) {
    levelBadge.textContent = level;
  }

  if (type) {
    type.textContent = currentLang === "en" ? "Subunit" : "小单元";
  }

  title.textContent = `${subunit.code} ${subunit.heroTitle}`;
  summary.textContent = subunit.summary;
  summary.hidden = false;
  overview.textContent = subunit.overview;

  if (tip) {
    tip.textContent = subunit.tip;
  }

  if (exerciseCount) {
    exerciseCount.textContent = String((subunit.bookExercises || []).length + (subunit.quickExercises || []).length);
  }

  if (heroEyebrow) {
    heroEyebrow.hidden = true;
  }

  if (heroMeta) {
    heroMeta.hidden = true;
  }

  if (stats) {
    stats.hidden = false;
  }

  if (guideGrid) {
    guideGrid.classList.add("detail-grid-single");
  }

  if (focusList) {
    focusList.hidden = true;
    focusList.innerHTML = "";
  }

  if (notePanel) {
    notePanel.hidden = true;
  }

  if (guidePanelHeader) {
    let jumpButton = guidePanelHeader.querySelector("[data-jump-to-editor]");

    if (detailEditorState.enabled) {
      if (!jumpButton) {
        jumpButton = document.createElement("button");
        jumpButton.type = "button";
        jumpButton.className = "ghost-button developer-jump-button";
        guidePanelHeader.appendChild(jumpButton);
      }

      jumpButton.dataset.jumpToEditor = overviewEditorTarget;
      jumpButton.textContent = getLocalEditorUi().jumpToEditor;
    } else if (jumpButton) {
      jumpButton.remove();
    }
  }

  if (exampleSection) {
    exampleSection.hidden = false;
  }

  if (practiceSection) {
    practiceSection.hidden = false;
  }

  if (practiceHeader) {
    practiceHeader.hidden = true;
  }

  if (subunitsPanel) {
    subunitsPanel.hidden = true;
  }

  focusList.innerHTML = "";
  exampleList.className = "rule-grid";
  practiceList.className = "practice-stage";
  exampleList.innerHTML = renderRuleBlocks(visibleRuleBlocks);
  currentExercises = subunit.quickExercises || [];
  currentPracticeContext = {
    level,
    topicTitle: topic.title,
    subunitTitle: `${subunit.code} ${subunit.heroTitle}`,
    quickExercises: subunit.quickExercises || [],
    bookExercises: subunit.bookExercises || [],
    referenceExercise: subunit.referenceChecks || null,
    practiceUi: subunit.practiceUi || getDefaultPracticeUiConfig()
  };
  practiceList.innerHTML = renderSubunitPractice(subunit, currentExercises);
  bindPracticeInteractions(practiceList);
  bindSubunitInteractions(practiceList);
  renderLocalDetailEditor(subunit, {
    level,
    topicId: topic.id,
    subunitCode: subunit.code,
    pageType: "subunit"
  });
}

function renderDetailPage() {
  const title = document.getElementById("detail-title");
  const summary = document.getElementById("detail-summary");
  const overview = document.getElementById("detail-overview");
  const focusList = document.getElementById("detail-focus");
  const exampleList = document.getElementById("example-list");
  const practiceList = document.getElementById("practice-list");
  const subunitsPanel = document.getElementById("detail-subunits-panel");
  const subunitsTitle = document.getElementById("detail-subunits-title");
  const subunitsNote = document.getElementById("detail-subunits-note");
  const subunitsMeta = document.getElementById("detail-subunits-meta");
  const subunitsList = document.getElementById("detail-subunits-list");
  const stats = document.querySelector(".detail-stats");
  const exampleSection = exampleList?.closest("section");
  const practiceSection = practiceList?.closest("section");
  const notePanel = document.getElementById("detail-note-panel");
  const guideGrid = document.getElementById("detail-guide-grid");
  const guidePanelHeader = document.querySelector("#detail-guide-panel .detail-panel-header");
  const heroEyebrow = document.querySelector(".detail-hero-copy .eyebrow");
  const heroMeta = document.querySelector(".detail-hero-meta");
  const heroCopy = document.querySelector(".detail-hero-copy");
  const hero = document.querySelector(".detail-hero");
  const practiceHeader = practiceSection?.querySelector(".detail-panel-header");

  if (!title || !summary || !overview || !focusList || !exampleList || !practiceList) {
    return;
  }

  if (practiceSection) {
    practiceSection.classList.remove("reading-practice-shell");
  }

  document.body.classList.remove("detail-reading-mode");

  if (hero) {
    hero.classList.remove("detail-hero-compact");
  }

  if (heroCopy) {
    heroCopy.hidden = false;
  }

  const ui = getUi();
  const params = new URLSearchParams(window.location.search);
  const level = getLevelKey(params.get("level") || "A1");
  const topicId = params.get("topic");
  const subunitCode = params.get("subunit");
  const part = normalizeA1ListPart(params.get("part")) || DEFAULT_A1_LIST_PART;
  const sourcePart = part === "reading" ? "reading" : "grammar";
  const baseTopic = buildLocalizedTopic(level, getTopicById(level, topicId, sourcePart));
  const baseSubunit = sourcePart === "grammar"
    ? buildLocalizedSubunit(level, topicId, getSubunitByCode(level, topicId, subunitCode))
    : null;
  const topic = applyLocalDetailOverrides(
    applyPublishedDetailOverrides(baseTopic, {
      level,
      topicId: baseTopic?.id || topicId
    }),
    {
      level,
      topicId: baseTopic?.id || topicId
    }
  );
  const subunit = sourcePart === "grammar"
    ? applyLocalDetailOverrides(
      applyPublishedDetailOverrides(baseSubunit, {
        level,
        topicId: baseTopic?.id || topicId,
        subunitCode: baseSubunit?.code || subunitCode
      }),
      {
        level,
        topicId: baseTopic?.id || topicId,
        subunitCode: baseSubunit?.code || subunitCode
      }
    )
    : null;

  if (!topic) {
    return;
  }

  if (sourcePart === "reading") {
    renderReadingTopicPage(level, topic, {
      title,
      summary,
      overview,
      focusList,
      exampleList,
      practiceList,
      subunitsPanel,
      stats,
      exampleSection,
      practiceSection
    }, sourcePart);
    return;
  }

  summary.hidden = false;
  focusList.hidden = false;

  if (heroEyebrow) {
    heroEyebrow.hidden = false;
  }

  if (heroMeta) {
    heroMeta.hidden = false;
  }

  if (notePanel) {
    notePanel.hidden = false;
  }

  if (practiceHeader) {
    practiceHeader.hidden = false;
  }

  if (guideGrid) {
    guideGrid.classList.remove("detail-grid-single");
  }

  if (guidePanelHeader) {
    guidePanelHeader.querySelector("[data-jump-to-editor]")?.remove();
  }

  if (subunit) {
    renderSubunitPage(level, topic, subunit, {
      title,
      summary,
      overview,
      focusList,
      exampleList,
      practiceList,
      subunitsPanel,
      stats,
      exampleSection,
      practiceSection
    });
    return;
  }

  document.title = `${level} | ${topic.title}`;
  setText("detail-stats-exercises", currentLang === "en" ? "Tasks" : "题目数");
  setText("detail-guide-title", ui.detailGuideTitle);
  setText("detail-tip-title", ui.detailTipTitle);
  setText("detail-examples-title", ui.detailExamplesTitle);
  setText("detail-practice-title", ui.detailPracticeTitle);
  setText("detail-practice-note", ui.detailPracticeNote);
  setText("detail-tip-tag-1", ui.detailTipTag1);
  setText("detail-tip-tag-2", ui.detailTipTag2);
  setText("detail-tip-tag-3", ui.detailTipTag3);

  const backLink = document.getElementById("detail-back-link");
  const breadcrumb = document.getElementById("detail-breadcrumb");
  const levelBadge = document.getElementById("detail-level-badge");
  const type = document.getElementById("detail-type");
  const tip = document.getElementById("detail-tip");
  const exerciseCount = document.getElementById("detail-exercise-count");

  if (backLink) {
    const partQuery = sourcePart !== "grammar" ? `&part=${encodeURIComponent(sourcePart)}` : "";
    backLink.href = `list.html?level=${level}${partQuery}`;
    backLink.textContent = formatText(ui.detailBackList, { level });
  }

  if (breadcrumb) {
    breadcrumb.href = "index.html";
    breadcrumb.textContent = currentLang === "en" ? "Back Home" : "返回主页";
    breadcrumb.setAttribute("aria-label", currentLang === "en" ? "Back to home page" : "返回主页");
  }

  if (levelBadge) {
    levelBadge.textContent = level;
  }

  if (type) {
    type.textContent = topic.localizedType;
  }

  title.textContent = topic.title;
  summary.textContent = topic.summary;
  overview.textContent = topic.overview;

  if (tip) {
    tip.textContent = topic.tip;
  }

  if (exerciseCount) {
    exerciseCount.textContent = String((topic.localizedExercises || []).length);
  }

  focusList.innerHTML = (topic.focus || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("");
  exampleList.className = "example-list";
  practiceList.className = "practice-list";

  if (isGroupedTopic(topic)) {
    if (stats) {
      stats.hidden = true;
    }

    if (exampleSection) {
      exampleSection.hidden = true;
    }

    if (practiceSection) {
      practiceSection.hidden = true;
    }

    if (subunitsPanel) {
      subunitsPanel.hidden = false;
    }

    setText("detail-guide-title", getOutlineUi().groupGuideTitle);
    setText("detail-subunits-title", getOutlineUi().subunitsTitle);
    setText("detail-subunits-note", getOutlineUi().subunitsNote);

    if (subunitsMeta) {
      subunitsMeta.innerHTML = (topic.localizedKeywords || [])
        .map((keyword) => `<span>${escapeHtml(keyword)}</span>`)
        .join("");
    }

    if (subunitsList) {
      subunitsList.innerHTML = renderSubunits(topic.id, topic.localizedSubunits || []);
    }

    currentExercises = [];
    currentPracticeContext = null;
    exampleList.innerHTML = "";
    practiceList.innerHTML = "";
    renderLocalDetailEditor(null, { pageType: "outline" });
    return;
  }

  if (stats) {
    stats.hidden = false;
  }

  if (exampleSection) {
    exampleSection.hidden = false;
  }

  if (practiceSection) {
    practiceSection.hidden = false;
  }

  if (subunitsPanel) {
    subunitsPanel.hidden = true;
  }

  exampleList.innerHTML = renderExamples(topic.localizedExamples || []);
  currentExercises = topic.localizedExercises || [];
  currentPracticeContext = {
    level,
    topicTitle: topic.title,
    subunitTitle: "",
    quickExercises: topic.localizedExercises || [],
    bookExercises: [],
    referenceExercise: null,
    practiceUi: topic.practiceUi || getDefaultPracticeUiConfig()
  };
  practiceList.innerHTML = renderExercises(currentExercises, currentPracticeContext.practiceUi);
  bindPracticeInteractions(practiceList);
  renderLocalDetailEditor(topic, {
    level,
    topicId: topic.id,
    pageType: "topic"
  });
}

function renderAll() {
  clearLegacyThemeArtifacts();
  updateLanguageButtons();
  bindHomeTabs();
  bindListPartSwitch();
  bindHomeApiConfigPanel();
  bindHomePublishPanel();
  bindAiInterface();
  bindLocalDetailEditor();
  renderHomeApiConfigPanel();
  renderHomePage();
  renderListPage();
  renderDetailPage();
  renderAiChat();
}

function normalizeAnswer(value) {
  return String(value || "")
    .trim()
    .replace(/盲/g, "ae")
    .replace(/枚/g, "oe")
    .replace(/眉/g, "ue")
    .replace(/脽/g, "ss")
    .replace(/[.,!?;:锛屻€傦紒锛燂紱锛?()[\]"]/g, " ")
    .replace(/\s+/g, " ");
}

function normalizeBookInput(value) {
  return String(value || "")
    .trim()
    .replace(/[.,!?;:]+$/g, "")
    .replace(/\s+/g, " ");
}

function bindSubunitInteractions(container) {
  if (!container || container.dataset.subunitBound === "true") {
    return;
  }

  container.dataset.subunitBound = "true";
  const practiceUi = getCurrentPracticeUiConfig();

  const setBookFeedback = (feedbackNode, variant, message) => {
    if (!feedbackNode) {
      return;
    }

    feedbackNode.hidden = false;
    feedbackNode.className = `book-line-feedback is-${variant}`;
    feedbackNode.textContent = message;
  };

  const hideBookFeedback = (feedbackNode) => {
    if (!feedbackNode) {
      return;
    }

    feedbackNode.hidden = true;
    feedbackNode.className = "book-line-feedback";
    feedbackNode.textContent = "";
  };

  const setExplanationVisibility = (panel, visible) => {
    if (!panel || panel.dataset.empty === "true") {
      if (panel) {
        panel.hidden = true;
      }
      return;
    }

    panel.hidden = !visible;
  };

  const clearInputStates = (inputs) => {
    inputs.forEach((input) => input.classList.remove("is-correct", "is-incorrect"));
  };

  const syncBookChoiceSelection = (lineId, resultStatus = "") => {
    const normalizedStatus = resultStatus === "correct" || resultStatus === "incorrect"
      ? resultStatus
      : "";
    const selectedValue = normalizeBookInput(
      container.querySelector(`[data-book-input^="${lineId}-"]`)?.value || ""
    );

    container.querySelectorAll(`[data-book-choice="${lineId}"]`).forEach((button) => {
      const buttonValue = normalizeBookInput(button.dataset.choiceValue || "");
      const isSelected = Boolean(selectedValue) && selectedValue === buttonValue;
      button.classList.toggle("is-selected", isSelected);
      button.classList.remove("is-correct", "is-incorrect");

      if (isSelected && normalizedStatus) {
        button.classList.add(`is-${normalizedStatus}`);
      }
    });
  };

  const evaluateBookLine = (lineId, revealAnswer) => {
    const feedback = container.querySelector(`[data-book-feedback="${lineId}"]`);
    const explanationPanel = container.querySelector(`[data-book-explanation-panel="${lineId}"]`);

    if (!feedback) {
      return;
    }

    const answerText = feedback.dataset.answer || "";
    const answerParts = getBookBlankAnswers(answerText);
    const inputs = Array.from(container.querySelectorAll(`[data-book-input^="${lineId}-"]`));
    const values = inputs.map((input) => normalizeBookInput(input.value));
    const normalizedAnswers = answerParts.map((answer) => normalizeBookInput(answer));

    clearInputStates(inputs);
    syncBookChoiceSelection(lineId);

    if (revealAnswer) {
      if (!feedback.hidden || (explanationPanel && !explanationPanel.hidden)) {
        hideBookFeedback(feedback);
        setExplanationVisibility(explanationPanel, false);
        syncBookChoiceSelection(lineId);
        return;
      }

      setBookFeedback(
        feedback,
        "reveal",
        formatText(practiceUi.book.revealTemplate ?? "", { answer: answerText })
      );
      setExplanationVisibility(explanationPanel, true);
      syncBookChoiceSelection(lineId);
      return;
    }

    hideBookFeedback(feedback);
    setExplanationVisibility(explanationPanel, false);

    if (values.some((value) => !value)) {
      container.querySelector(`[data-book-choice="${lineId}"]`)?.focus();
      inputs.find((input) => !String(input.value || "").trim())?.focus();
      return;
    }

    inputs.forEach((input, index) => {
      input.classList.add(normalizedAnswers[index] === values[index] ? "is-correct" : "is-incorrect");
    });

    const firstInput = inputs[0];
    const resultStatus = firstInput?.classList.contains("is-correct")
      ? "correct"
      : (firstInput?.classList.contains("is-incorrect") ? "incorrect" : "");
    syncBookChoiceSelection(lineId, resultStatus);
  };

  const evaluateReferenceLine = (lineId, revealAnswer) => {
    const feedback = container.querySelector(`[data-reference-feedback="${lineId}"]`);
    const explanationPanel = container.querySelector(`[data-reference-explanation-panel="${lineId}"]`);

    if (!feedback) {
      return;
    }

    const answerText = feedback.dataset.answer || "";
    const input = container.querySelector(`[data-reference-input="${lineId}"]`);
    const value = normalizeBookInput(input?.value || "");
    const normalizedAnswer = normalizeBookInput(answerText);

    input?.classList.remove("is-correct", "is-incorrect");

    if (revealAnswer) {
      if (!feedback.hidden || (explanationPanel && !explanationPanel.hidden)) {
        hideBookFeedback(feedback);
        setExplanationVisibility(explanationPanel, false);
        return;
      }

      setBookFeedback(
        feedback,
        "reveal",
        formatText(practiceUi.reference.revealTemplate ?? "", { answer: answerText })
      );
      setExplanationVisibility(explanationPanel, true);
      return;
    }

    hideBookFeedback(feedback);
    setExplanationVisibility(explanationPanel, false);

    if (!value) {
      input?.focus();
      return;
    }

    input?.classList.add(value === normalizedAnswer ? "is-correct" : "is-incorrect");
  };

  container.addEventListener("click", (event) => {
    const modeButton = event.target.closest("[data-practice-mode]");

    if (modeButton) {
      const nextMode = modeButton.dataset.practiceMode;
      container.querySelectorAll("[data-practice-mode]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.practiceMode === nextMode);
      });
      container.querySelectorAll("[data-practice-panel]").forEach((panel) => {
        const isActive = panel.dataset.practicePanel === nextMode;
        panel.hidden = !isActive;
        panel.classList.toggle("is-active", isActive);
      });
      return;
    }

    const choiceButton = event.target.closest("[data-book-choice]");

    if (choiceButton) {
      const lineId = String(choiceButton.dataset.bookChoice || "");
      const value = String(choiceButton.dataset.choiceValue || "");
      const input = container.querySelector(`[data-book-input^="${lineId}-"]`);

      if (!lineId || !input) {
        return;
      }

      input.value = value;
      input.classList.remove("is-correct", "is-incorrect");
      hideBookFeedback(container.querySelector(`[data-book-feedback="${lineId}"]`));
      setExplanationVisibility(container.querySelector(`[data-book-explanation-panel="${lineId}"]`), false);
      syncBookChoiceSelection(lineId);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    const bookCheckButton = event.target.closest("[data-book-check]");

    if (bookCheckButton) {
      evaluateBookLine(bookCheckButton.dataset.bookCheck, false);
      return;
    }

    const bookShowButton = event.target.closest("[data-book-show]");

    if (bookShowButton) {
      evaluateBookLine(bookShowButton.dataset.bookShow, true);
      return;
    }

    const referenceCheckButton = event.target.closest("[data-reference-check]");

    if (referenceCheckButton) {
      evaluateReferenceLine(referenceCheckButton.dataset.referenceCheck, false);
      return;
    }

    const referenceShowButton = event.target.closest("[data-reference-show]");

    if (referenceShowButton) {
      evaluateReferenceLine(referenceShowButton.dataset.referenceShow, true);
      return;
    }
  });

  container.addEventListener("keydown", (event) => {
    const bookInput = event.target.closest("[data-book-input]");

    if (!bookInput || event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    const parts = bookInput.dataset.bookInput.split("-");
    const lineId = `${parts[0]}-${parts[1]}`;
    evaluateBookLine(lineId, false);
  });

  container.addEventListener("keydown", (event) => {
    const referenceInput = event.target.closest("[data-reference-input]");

    if (!referenceInput || event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    evaluateReferenceLine(referenceInput.dataset.referenceInput, false);
  });

  container.addEventListener("input", (event) => {
    const bookInput = event.target.closest("[data-book-input]");

    if (bookInput) {
      if (bookInput.classList.contains("is-letter-match")) {
        bookInput.value = String(bookInput.value || "")
          .replace(/[^a-z]/ig, "")
          .slice(0, 1)
          .toUpperCase();
      }

      bookInput.classList.remove("is-correct", "is-incorrect");
      const parts = String(bookInput.dataset.bookInput || "").split("-");
      const lineId = `${parts[0]}-${parts[1]}`;
      hideBookFeedback(container.querySelector(`[data-book-feedback="${lineId}"]`));
      setExplanationVisibility(container.querySelector(`[data-book-explanation-panel="${lineId}"]`), false);
      syncBookChoiceSelection(lineId);
      return;
    }

    const referenceInput = event.target.closest("[data-reference-input]");

    if (referenceInput) {
      referenceInput.classList.remove("is-correct", "is-incorrect");
      hideBookFeedback(container.querySelector(`[data-reference-feedback="${referenceInput.dataset.referenceInput}"]`));
      setExplanationVisibility(container.querySelector(`[data-reference-explanation-panel="${referenceInput.dataset.referenceInput}"]`), false);
    }
  });
}

function checkFillExercise(card, revealOnly) {
  const practiceUi = getCurrentPracticeUiConfig();
  const quickUi = practiceUi.quick;
  const exercise = currentExercises[Number(card.dataset.exerciseIndex)];
  const input = card.querySelector(".fill-input");
  const inputValue = input ? input.value : "";
  const normalizedInput = normalizeAnswer(inputValue);
  const isCorrect = (exercise.answers || []).some((answer) => normalizeAnswer(answer) === normalizedInput);
  const feedback = card.querySelector(".exercise-feedback");

  if (input) {
    input.classList.remove("is-correct", "is-incorrect");

    if (!revealOnly && normalizedInput) {
      input.classList.add(isCorrect ? "is-correct" : "is-incorrect");
    }
  }

  if (revealOnly) {
    if (feedback && !feedback.hidden && feedback.classList.contains("is-reveal")) {
      feedback.hidden = true;
      feedback.innerHTML = "";
      return;
    }

    setFeedback(
      card,
      "reveal",
      quickUi.revealTitle ?? "",
      formatText(quickUi.correctAnswerTemplate ?? "", { answer: exercise.displayAnswer || exercise.answers[0] }),
      exercise.explanation || "",
      practiceUi
    );
    return;
  }

  if (feedback) {
    feedback.hidden = true;
    feedback.innerHTML = "";
  }

  if (!normalizedInput) {
    setFeedback(
      card,
      "incorrect",
      quickUi.tryFillTitle ?? "",
      formatText(quickUi.correctAnswerTemplate ?? "", { answer: exercise.displayAnswer || exercise.answers[0] }),
      quickUi.tryFillText ?? "",
      practiceUi
    );
    input?.focus();
    return;
  }

  setFeedback(
    card,
    isCorrect ? "correct" : "incorrect",
    isCorrect ? (quickUi.correctTitle ?? "") : (quickUi.incorrectSoftTitle ?? quickUi.incorrectTitle ?? ""),
    formatText(quickUi.correctAnswerTemplate ?? "", { answer: exercise.displayAnswer || exercise.answers[0] }),
    exercise.explanation || "",
    practiceUi
  );
}

function bindPracticeInteractions(container) {
  if (!container || container.dataset.bound === "true") {
    return;
  }

  container.dataset.bound = "true";

  container.addEventListener("click", (event) => {
    const optionButton = event.target.closest(".option-button");
    const actionButton = event.target.closest("[data-check-answer], [data-show-answer]");

    if (optionButton) {
      const card = optionButton.closest(".exercise-card");
      checkChoiceExercise(card, Number(optionButton.dataset.optionIndex));
      return;
    }

    if (!actionButton) {
      return;
    }

    const card = actionButton.closest(".exercise-card");

    if (actionButton.hasAttribute("data-check-answer")) {
      checkFillExercise(card, false);
      return;
    }

    if (card.dataset.exerciseType === "choice") {
      const feedback = card.querySelector(".exercise-feedback");
      if (feedback && !feedback.hidden && feedback.classList.contains("is-reveal")) {
        feedback.hidden = true;
        feedback.innerHTML = "";
        return;
      }

      revealChoiceExercise(card);
      return;
    }

    checkFillExercise(card, true);
  });

  container.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || !event.target.classList.contains("fill-input")) {
      return;
    }

    event.preventDefault();
    const card = event.target.closest(".exercise-card");
    checkFillExercise(card, false);
  });

  container.addEventListener("input", (event) => {
    const input = event.target.closest(".fill-input");

    if (!input) {
      return;
    }

    input.classList.remove("is-correct", "is-incorrect");
    const card = input.closest(".exercise-card");
    const feedback = card?.querySelector(".exercise-feedback");
    if (feedback) {
      feedback.hidden = true;
      feedback.innerHTML = "";
    }
  });
}

function capturePracticeState() {
  const root = document.getElementById("practice-list");

  if (!root) {
    return null;
  }

  const state = {
    book: {},
    reference: {},
    quickFill: {}
  };

  root.querySelectorAll("[data-book-line]").forEach((card) => {
    const lineId = String(card.dataset.bookLine || "").trim();
    if (!lineId) {
      return;
    }

    const inputs = Array.from(card.querySelectorAll("[data-book-input]"));
    state.book[lineId] = {
      values: inputs.map((input) => String(input.value || "")),
      checked: inputs.some((input) => input.classList.contains("is-correct") || input.classList.contains("is-incorrect"))
    };
  });

  root.querySelectorAll("[data-reference-line]").forEach((card) => {
    const lineId = String(card.dataset.referenceLine || "").trim();
    const input = card.querySelector("[data-reference-input]");

    if (!lineId || !input) {
      return;
    }

    state.reference[lineId] = {
      value: String(input.value || ""),
      checked: input.classList.contains("is-correct") || input.classList.contains("is-incorrect")
    };
  });

  root.querySelectorAll('.exercise-card[data-exercise-type="fill"]').forEach((card) => {
    const exerciseIndex = String(card.dataset.exerciseIndex || "").trim();
    const input = card.querySelector(".fill-input");

    if (!exerciseIndex || !input) {
      return;
    }

    state.quickFill[exerciseIndex] = {
      value: String(input.value || ""),
      checked: input.classList.contains("is-correct") || input.classList.contains("is-incorrect")
    };
  });

  return state;
}

function restorePracticeState(state) {
  if (!state) {
    return;
  }

  const restore = () => {
    const root = document.getElementById("practice-list");

    if (!root) {
      return;
    }

    const syncBookChoiceSelection = (lineId, resultStatus = "") => {
      const normalizedStatus = resultStatus === "correct" || resultStatus === "incorrect"
        ? resultStatus
        : "";
      const selectedValue = normalizeBookInput(
        root.querySelector(`[data-book-input^="${lineId}-"]`)?.value || ""
      );

      root.querySelectorAll(`[data-book-choice="${lineId}"]`).forEach((button) => {
        const buttonValue = normalizeBookInput(button.dataset.choiceValue || "");
        const isSelected = Boolean(selectedValue) && selectedValue === buttonValue;
        button.classList.toggle("is-selected", isSelected);
        button.classList.remove("is-correct", "is-incorrect");

        if (isSelected && normalizedStatus) {
          button.classList.add(`is-${normalizedStatus}`);
        }
      });
    };

    Object.entries(state.book || {}).forEach(([lineId, lineState]) => {
      const card = root.querySelector(`[data-book-line="${lineId}"]`);

      if (!card) {
        return;
      }

      const inputs = Array.from(card.querySelectorAll("[data-book-input]"));
      inputs.forEach((input, index) => {
        input.value = lineState.values?.[index] || "";
      });
      syncBookChoiceSelection(lineId);

      if (lineState.checked) {
        card.querySelector(`[data-book-check="${lineId}"]`)?.click();
      }
    });

    Object.entries(state.reference || {}).forEach(([lineId, lineState]) => {
      const card = root.querySelector(`[data-reference-line="${lineId}"]`);
      const input = card?.querySelector("[data-reference-input]");

      if (!card || !input) {
        return;
      }

      input.value = lineState.value || "";

      if (lineState.checked) {
        card.querySelector(`[data-reference-check="${lineId}"]`)?.click();
      }
    });

    Object.entries(state.quickFill || {}).forEach(([exerciseIndex, lineState]) => {
      const card = root.querySelector(`.exercise-card[data-exercise-type="fill"][data-exercise-index="${exerciseIndex}"]`);
      const input = card?.querySelector(".fill-input");

      if (!card || !input) {
        return;
      }

      input.value = lineState.value || "";

      if (lineState.checked) {
        card.querySelector("[data-check-answer]")?.click();
      }
    });
  };

  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(restore);
    return;
  }

  restore();
}

bindLanguageControls();
renderAll();
loadPublishedDetailOverrides().then(() => {
  renderAll();
});
