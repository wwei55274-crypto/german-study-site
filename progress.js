(function () {
  const AUTH_MODAL_ID = "study-auth-modal";
  const LEAVE_MODAL_ID = "study-leave-modal";
  const DETAIL_PROGRESS_PANEL_ID = "detail-progress-panel";
  const SESSION_API_PATH = "/api/auth/session";
  const REGISTER_API_PATH = "/api/auth/register";
  const LOGIN_API_PATH = "/api/auth/login";
  const LOGOUT_API_PATH = "/api/auth/logout";
  const PROGRESS_API_PATH = "/api/progress";
  const PROGRESS_SAVE_API_PATH = "/api/progress/save";
  const SESSION_STORAGE_KEY = "study_session_token";
  const WINDOW_NAME_TOKEN_PREFIX = "study_session_token:";

  const uiText = {
    zh: {
      authTitleLogin: "登录账号",
      authTitleRegister: "创建账号",
      authLogin: "登录",
      authRegister: "创建账号",
      authLogout: "退出登录",
      authUsername: "账号",
      authPassword: "密码",
      authUsernamePlaceholder: "输入账号名",
      authPasswordPlaceholder: "输入密码",
      authSwitchLogin: "已有账号？去登录",
      authSwitchRegister: "没有账号？创建一个",
      authClose: "关闭",
      authCurrentUser: "当前账号：{username}",
      authPromptLogin: "登录后即可把学习进度和账号绑定。",
      authPromptRegister: "创建账号后，你的学习进度会和这个账号绑定。",
      authNeedLogin: "请先登录账号，再保存进度。",
      authLoggedOut: "已退出登录。",
      authLoginSuccess: "登录成功。",
      authRegisterSuccess: "账号创建成功，已自动登录。",
      authLoadFailed: "读取账号状态失败。",
      memoryKicker: "学习进度",
      resumeEmptyTitle: "登录后开始同步你的学习记录",
      resumeEmptyText: "同一个账号下，已完成、进行中和中途保存的内容都会分开记录，不会和其他人混在一起。",
      resumeText: "上次保存到 {level} · {title}，当前状态：{summary}",
      resumeAction: "继续学习",
      progressStudied: "已学习",
      progressInProgress: "进行中",
      progressCompleted: "已完成",
      status: {
        new: "未开始",
        studied: "已学习",
        in_progress: "进行中",
        completed: "已完成"
      },
      summaryNew: "还没有开始这个单元",
      summaryStudied: "已打开过，但还没完成答题",
      summaryInProgress: "已完成 {completed}/{total} 题",
      summaryCompleted: "这个单元已全部完成",
      savePanelTitle: "账号进度保存",
      savePanelLoginHint: "登录后可以把这个单元的完成情况绑定到你的账号。",
      savePanelDraftHint: "做完最后一题后可以保存；如果还没做完，也可以在页面最下方点这里保存当前进度。",
      savePanelSave: "保存当前进度",
      savePanelSaveCompleted: "保存并标记已完成",
      savePanelLoginButton: "登录后保存",
      savePanelSaving: "正在保存进度……",
      savePanelSaved: "进度已保存到当前账号。",
      savePanelSaveFailed: "保存失败，请确认本地网站服务仍在运行。",
      savePanelQuestions: "已完成题目",
      savePanelAccount: "绑定账号",
      savePanelDirty: "当前页面有未保存改动",
      savePanelClean: "当前页面已和账号进度同步",
      savePanelUnauthed: "未登录",
      savePanelSavedAt: "上次保存：{time}",
      leaveConfirm: "当前单元有未保存进度。是否先保存再离开？\n选择“确定”会保存，选择“取消”则直接离开且不保存。",
      browserLeaveHint: "当前页面有未保存进度，离开前请先保存。",
      saveBeforeLogout: "当前页面有未保存进度。要先保存再退出登录吗？",
      leaveModalTitle: "离开这个单元？",
      leaveModalBody: "当前页面还有未保存进度。你可以直接退出，或者先保存再退出。",
      leaveModalDiscard: "直接退出",
      leaveModalSaveExit: "保存并退出",
      leaveModalSaving: "正在保存…"
    },
    en: {
      authTitleLogin: "Sign In",
      authTitleRegister: "Create Account",
      authLogin: "Sign In",
      authRegister: "Create Account",
      authLogout: "Sign Out",
      authUsername: "Username",
      authPassword: "Password",
      authUsernamePlaceholder: "Enter a username",
      authPasswordPlaceholder: "Enter a password",
      authSwitchLogin: "Already have an account? Sign in",
      authSwitchRegister: "Need an account? Create one",
      authClose: "Close",
      authCurrentUser: "Signed in as {username}",
      authPromptLogin: "Sign in to bind learning progress to your account.",
      authPromptRegister: "Create an account and your learning progress will be stored under it.",
      authNeedLogin: "Please sign in before saving progress.",
      authLoggedOut: "Signed out.",
      authLoginSuccess: "Signed in.",
      authRegisterSuccess: "Account created and signed in.",
      authLoadFailed: "Could not load account status.",
      memoryKicker: "Learning Progress",
      resumeEmptyTitle: "Sign in to sync your progress",
      resumeEmptyText: "Completed units, partial work, and saved checkpoints are kept separate for each account.",
      resumeText: "Last saved at {level} · {title}. Current status: {summary}",
      resumeAction: "Continue",
      progressStudied: "Studied",
      progressInProgress: "In Progress",
      progressCompleted: "Completed",
      status: {
        new: "Not Started",
        studied: "Studied",
        in_progress: "In Progress",
        completed: "Completed"
      },
      summaryNew: "This unit has not been started yet",
      summaryStudied: "Opened before, but not completed yet",
      summaryInProgress: "{completed}/{total} questions completed",
      summaryCompleted: "This unit is fully completed",
      savePanelTitle: "Account Progress",
      savePanelLoginHint: "Sign in to bind this unit to your account.",
      savePanelDraftHint: "You can save after the last question, or scroll to the bottom and save partial progress at any time.",
      savePanelSave: "Save Current Progress",
      savePanelSaveCompleted: "Save as Completed",
      savePanelLoginButton: "Sign In to Save",
      savePanelSaving: "Saving progress...",
      savePanelSaved: "Progress saved to your account.",
      savePanelSaveFailed: "Saving failed. Please make sure the local website service is still running.",
      savePanelQuestions: "Questions completed",
      savePanelAccount: "Account",
      savePanelDirty: "This page has unsaved changes",
      savePanelClean: "This page matches your saved account progress",
      savePanelUnauthed: "Not signed in",
      savePanelSavedAt: "Last saved: {time}",
      leaveConfirm: "This unit has unsaved progress. Save before leaving?\nChoose OK to save, or Cancel to leave without saving.",
      browserLeaveHint: "This page has unsaved progress. Save before leaving.",
      saveBeforeLogout: "This page has unsaved progress. Save before signing out?",
      leaveModalTitle: "Leave this unit?",
      leaveModalBody: "This page still has unsaved progress. You can leave now or save before leaving.",
      leaveModalDiscard: "Leave now",
      leaveModalSaveExit: "Save and leave",
      leaveModalSaving: "Saving..."
    }
  };

  const authState = {
    loaded: false,
    loading: false,
    open: false,
    mode: "login",
    user: null,
    sessionToken: "",
    statusMessage: "",
    statusVariant: "info",
    submitting: false
  };

  const progressState = {
    loaded: false,
    loading: false,
    cache: createProgress(),
    currentUnit: null,
    currentDraft: null,
    dirty: false,
    restoring: false,
    saving: false,
    restoreAppliedForKey: "",
    resumeTargetApplied: "",
    beaconQueued: false
  };

  const leaveState = {
    open: false,
    destination: "",
    saving: false,
    suppressBeforeUnload: false,
    historyGuardArmed: false
  };

  if (
    typeof renderAll !== "function"
    || typeof getLevelKey !== "function"
    || typeof getTopicById !== "function"
    || typeof buildTopicUrl !== "function"
  ) {
    return;
  }

  function getText() {
    return currentLang === "en" ? uiText.en : uiText.zh;
  }

  function getApiUrl(path) {
    if (typeof window !== "undefined" && window.location?.protocol === "file:") {
      return `http://127.0.0.1:8080${path}`;
    }

    return path;
  }

  function readStoredSessionToken() {
    try {
      const localToken = String(window.localStorage.getItem(SESSION_STORAGE_KEY) || "");

      if (localToken) {
        return localToken;
      }
    } catch {
      // Ignore and continue to the fallback below.
    }

    try {
      const windowName = String(window.name || "");
      return windowName.startsWith(WINDOW_NAME_TOKEN_PREFIX)
        ? windowName.slice(WINDOW_NAME_TOKEN_PREFIX.length)
        : "";
    } catch {
      return "";
    }
  }

  function writeStoredSessionToken(token) {
    try {
      if (!token) {
        window.localStorage.removeItem(SESSION_STORAGE_KEY);
        return;
      }

      window.localStorage.setItem(SESSION_STORAGE_KEY, String(token));
    } catch {
      // Ignore localStorage failures and fall back to cookie auth.
    }

    try {
      window.name = token ? `${WINDOW_NAME_TOKEN_PREFIX}${String(token)}` : "";
    } catch {
      // Ignore if window.name is unavailable.
    }
  }

  async function apiRequest(path, options = {}) {
    const sessionToken = authState.sessionToken || readStoredSessionToken();

    const response = await fetch(getApiUrl(path), {
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(sessionToken ? { "X-Study-Session": sessionToken } : {}),
        ...(options.headers || {})
      }
    });

    const text = await response.text();
    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { ok: false, error: text || `HTTP ${response.status}` };
    }

    if (!response.ok) {
      throw new Error(data?.error || `HTTP ${response.status}`);
    }

    return data;
  }

  function createProgress() {
    return {
      lastUnit: null,
      units: {}
    };
  }

  function createUnitProgress(meta = {}) {
    return {
      level: meta.level || "",
      topicId: meta.topicId || "",
      subunitCode: meta.subunitCode || "",
      title: meta.title || "",
      visited: false,
      lastViewedAt: "",
      savedAt: "",
      scrollY: 0,
      lastFocusTarget: "",
      quickStates: {},
      bookStates: {},
      referenceStates: {},
      completedQuestions: 0,
      totalQuestions: Number(meta.totalQuestions || 0),
      status: "new"
    };
  }

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getUnitKey(meta) {
    return [
      String(meta.level || "").trim(),
      String(meta.topicId || "").trim(),
      String(meta.subunitCode || "").trim() || "topic"
    ].filter(Boolean).join("::");
  }

  function countBookQuestions(bookExercises) {
    return (bookExercises || []).reduce((total, exercise) => total + ((exercise?.lines || []).length), 0);
  }

  function countReferenceQuestions(referenceExercise) {
    return (referenceExercise?.checks || []).length;
  }

  function getTopicRaw(level, topicId) {
    return getTopicById(getLevelKey(level), topicId);
  }

  function getSubunitRaw(level, topicId, subunitCode) {
    if (typeof getSubunitByCode !== "function" || !subunitCode) {
      return null;
    }

    return getSubunitByCode(getLevelKey(level), topicId, subunitCode);
  }

  function getCurrentUnitContext() {
    if (!document.body.classList.contains("page-detail")) {
      return null;
    }

    const params = new URLSearchParams(window.location.search);
    const level = getLevelKey(params.get("level") || "A1");
    const topic = getTopicRaw(level, params.get("topic"));

    if (!topic) {
      return null;
    }

    const rawSubunit = getSubunitRaw(level, topic.id, params.get("subunit"));
    const totalQuestions = rawSubunit
      ? (currentPracticeContext
        ? (currentPracticeContext.quickExercises || []).length
          + countBookQuestions(currentPracticeContext.bookExercises || [])
          + countReferenceQuestions(currentPracticeContext.referenceExercise || null)
        : (rawSubunit.quickExercises || []).length
          + countBookQuestions(rawSubunit.bookExercises || [])
          + countReferenceQuestions(rawSubunit.referenceChecks || null))
      : (currentPracticeContext?.quickExercises || topic.exercises || []).length;
    const title = rawSubunit
      ? `${rawSubunit.code || ""} ${rawSubunit.heroTitle || rawSubunit.title || ""}`.trim()
      : topic.title;

    return {
      level,
      topicId: topic.id,
      subunitCode: rawSubunit?.code || "",
      title,
      totalQuestions,
      key: getUnitKey({
        level,
        topicId: topic.id,
        subunitCode: rawSubunit?.code || ""
      })
    };
  }

  function getUnitContextsForTopic(level, topicId) {
    const normalizedLevel = getLevelKey(level);
    const topic = getTopicRaw(normalizedLevel, topicId);

    if (!topic) {
      return [];
    }

    const rawMap = a1SubunitData?.[normalizedLevel]?.[topicId];
    const byCode = new Map();

    Object.values(rawMap || {}).forEach((item) => {
      if (item?.code && !byCode.has(item.code)) {
        byCode.set(item.code, item);
      }
    });

    if (byCode.size > 0) {
      return Array.from(byCode.values()).map((subunit) => ({
        level: normalizedLevel,
        topicId: topic.id,
        subunitCode: subunit.code || "",
        title: `${subunit.code || ""} ${subunit.heroTitle || subunit.title || ""}`.trim(),
        totalQuestions: (subunit.quickExercises || []).length
          + countBookQuestions(subunit.bookExercises || [])
          + countReferenceQuestions(subunit.referenceChecks || null),
        key: getUnitKey({
          level: normalizedLevel,
          topicId: topic.id,
          subunitCode: subunit.code || ""
        })
      }));
    }

    return [{
      level: normalizedLevel,
      topicId: topic.id,
      subunitCode: "",
      title: topic.title,
      totalQuestions: (topic.exercises || []).length,
      key: getUnitKey({
        level: normalizedLevel,
        topicId: topic.id
      })
    }];
  }

  function sanitizeUnitStates(states) {
    return states && typeof states === "object" ? states : {};
  }

  function hasQuickActivity(state) {
    return Boolean(
      (typeof state?.status === "string" && state.status)
      || (typeof state?.inputValue === "string" && state.inputValue.trim())
      || Number.isInteger(state?.selectedIndex)
    );
  }

  function hasBookActivity(state) {
    return Boolean(
      (typeof state?.status === "string" && state.status)
      || (Array.isArray(state?.values) && state.values.some((value) => String(value || "").trim()))
      || (typeof state?.value === "string" && state.value.trim())
    );
  }

  function isCompletedStatus(status) {
    return status === "correct" || status === "incorrect" || status === "revealed";
  }

  function getUnitStats(meta, entryInput) {
    const entry = entryInput || createUnitProgress(meta);
    let startedQuestions = 0;
    let completedQuestions = 0;

    Object.values(sanitizeUnitStates(entry.quickStates)).forEach((state) => {
      if (hasQuickActivity(state)) {
        startedQuestions += 1;
      }

      if (isCompletedStatus(state?.status)) {
        completedQuestions += 1;
      }
    });

    Object.values(sanitizeUnitStates(entry.bookStates)).forEach((state) => {
      if (hasBookActivity(state)) {
        startedQuestions += 1;
      }

      if (isCompletedStatus(state?.status)) {
        completedQuestions += 1;
      }
    });

    Object.values(sanitizeUnitStates(entry.referenceStates)).forEach((state) => {
      if (hasBookActivity(state)) {
        startedQuestions += 1;
      }

      if (isCompletedStatus(state?.status)) {
        completedQuestions += 1;
      }
    });

    const totalQuestions = Number(meta?.totalQuestions || entry.totalQuestions || 0);
    let status = "new";

    if (totalQuestions > 0 && completedQuestions >= totalQuestions) {
      status = "completed";
    } else if (startedQuestions > 0) {
      status = "in_progress";
    } else if (entry.visited) {
      status = "studied";
    }

    return {
      totalQuestions,
      startedQuestions,
      completedQuestions,
      status
    };
  }

  function normalizeUnitProgress(meta, entryInput) {
    const entry = {
      ...createUnitProgress(meta),
      ...(entryInput || {}),
      level: meta.level,
      topicId: meta.topicId,
      subunitCode: meta.subunitCode || "",
      title: meta.title || entryInput?.title || "",
      quickStates: sanitizeUnitStates(entryInput?.quickStates),
      bookStates: sanitizeUnitStates(entryInput?.bookStates),
      referenceStates: sanitizeUnitStates(entryInput?.referenceStates)
    };
    const stats = getUnitStats(meta, entry);

    return {
      ...entry,
      ...stats
    };
  }

  function normalizeProgressCache(progressInput) {
    const progress = progressInput && typeof progressInput === "object" ? progressInput : createProgress();
    const units = {};

    Object.entries(progress.units || {}).forEach(([unitKey, value]) => {
      if (!unitKey || !value || typeof value !== "object" || Array.isArray(value)) {
        return;
      }

      const meta = {
        level: value.level || unitKey.split("::")[0] || "",
        topicId: value.topicId || unitKey.split("::")[1] || "",
        subunitCode: value.subunitCode || (unitKey.split("::")[2] === "topic" ? "" : (unitKey.split("::")[2] || "")),
        title: value.title || "",
        totalQuestions: Number(value.totalQuestions || 0)
      };

      units[unitKey] = normalizeUnitProgress(meta, value);
    });

    return {
      lastUnit: progress.lastUnit && typeof progress.lastUnit === "object" ? progress.lastUnit : null,
      units
    };
  }

  function getSavedUnitProgress(meta) {
    return normalizeUnitProgress(meta, progressState.cache.units?.[meta.key]);
  }

  function ensureCurrentDraft(meta) {
    const sameUnit = progressState.currentUnit?.key === meta?.key;

    if (sameUnit && progressState.currentDraft) {
      progressState.currentUnit = meta;
      progressState.currentDraft = normalizeUnitProgress(meta, progressState.currentDraft);
      return;
    }

    progressState.currentUnit = meta;
    progressState.currentDraft = authState.user && progressState.loaded
      ? getSavedUnitProgress(meta)
      : createUnitProgress(meta);
    progressState.currentDraft = normalizeUnitProgress(meta, progressState.currentDraft);
    progressState.currentDraft.visited = true;
    progressState.currentDraft.lastViewedAt = new Date().toISOString();
    progressState.dirty = false;
    progressState.restoreAppliedForKey = "";
  }

  function setCurrentDraftState(kind, stateKey, nextValue, options = {}) {
    const meta = progressState.currentUnit || getCurrentUnitContext();

    if (!meta) {
      return null;
    }

    ensureCurrentDraft(meta);

    const bucketName = kind === "book"
      ? "bookStates"
      : (kind === "reference" ? "referenceStates" : "quickStates");
    const currentBucket = sanitizeUnitStates(progressState.currentDraft?.[bucketName]);

    if (!nextValue || typeof nextValue !== "object") {
      delete currentBucket[stateKey];
    } else {
      currentBucket[stateKey] = {
        ...(currentBucket[stateKey] || {}),
        ...nextValue,
        updatedAt: new Date().toISOString()
      };
    }

    progressState.currentDraft = normalizeUnitProgress(meta, {
      ...progressState.currentDraft,
      [bucketName]: currentBucket,
      lastFocusTarget: String(options.focusTarget || progressState.currentDraft?.lastFocusTarget || "").trim(),
      visited: true,
      lastViewedAt: new Date().toISOString()
    });

    if (options.markDirty !== false) {
      progressState.dirty = true;
      armLeaveHistoryGuard();
    }

    renderDetailProgressPanel();
    enhanceHomePage();
    enhanceListPage();
    return progressState.currentDraft;
  }

  function updateQuickState(exerciseIndex, nextValue, options = {}) {
    return setCurrentDraftState("quick", String(exerciseIndex), nextValue, {
      ...options,
      focusTarget: options.focusTarget || `quick:${String(exerciseIndex)}`
    });
  }

  function updateBookState(lineId, nextValue, options = {}) {
    return setCurrentDraftState("book", String(lineId), nextValue, {
      ...options,
      focusTarget: options.focusTarget || `book:${String(lineId)}`
    });
  }

  function updateReferenceState(lineId, nextValue, options = {}) {
    return setCurrentDraftState("reference", String(lineId), nextValue, {
      ...options,
      focusTarget: options.focusTarget || `reference:${String(lineId)}`
    });
  }

  function getSummaryText(stats) {
    const ui = getText();

    if (!stats || stats.status === "new") {
      return ui.summaryNew;
    }

    if (stats.status === "completed") {
      return ui.summaryCompleted;
    }

    if (stats.status === "in_progress") {
      return formatText(ui.summaryInProgress, {
        completed: stats.completedQuestions || 0,
        total: stats.totalQuestions || 0
      });
    }

    return ui.summaryStudied;
  }

  function getAggregateTopicStats(level, topicId) {
    const contexts = getUnitContextsForTopic(level, topicId);
    const normalizedEntries = contexts.map((meta) => normalizeUnitProgress(meta, progressState.cache.units?.[meta.key]));
    const completedUnits = normalizedEntries.filter((entry) => entry.status === "completed").length;
    const startedUnits = normalizedEntries.filter((entry) => entry.status !== "new").length;
    const hasInProgress = normalizedEntries.some((entry) => entry.status === "in_progress" || entry.status === "studied");

    let status = "new";

    if (normalizedEntries.length && completedUnits === normalizedEntries.length) {
      status = "completed";
    } else if (hasInProgress) {
      status = "in_progress";
    } else if (startedUnits > 0) {
      status = "studied";
    }

    return {
      status,
      totalUnits: normalizedEntries.length,
      completedUnits,
      startedUnits,
      entries: normalizedEntries
    };
  }

  function getLastUnitRecord() {
    const lastUnit = progressState.cache?.lastUnit;

    if (!lastUnit?.unitKey) {
      return null;
    }

    const unit = progressState.cache.units?.[lastUnit.unitKey];

    if (!unit) {
      return null;
    }

    return {
      ...lastUnit,
      ...unit,
      summary: getSummaryText(unit)
    };
  }

  function inferLastFocusTarget(unit) {
    const explicitTarget = String(unit?.lastFocusTarget || "").trim();

    if (explicitTarget) {
      return explicitTarget;
    }

    const entries = [];
    const collect = (bucket, kind) => {
      Object.entries(bucket || {}).forEach(([key, state]) => {
        if (!state || typeof state !== "object") {
          return;
        }

        const updatedAt = Date.parse(state.updatedAt || "");
        const numericScore = Number(String(key).split(/[:\-]/).pop());
        entries.push({
          target: `${kind}:${key}`,
          updatedAt: Number.isFinite(updatedAt) ? updatedAt : 0,
          numericScore: Number.isFinite(numericScore) ? numericScore : 0
        });
      });
    };

    collect(unit?.quickStates, "quick");
    collect(unit?.bookStates, "book");
    collect(unit?.referenceStates, "reference");

    if (!entries.length) {
      return "";
    }

    entries.sort((left, right) => {
      if (left.updatedAt !== right.updatedAt) {
        return right.updatedAt - left.updatedAt;
      }

      return right.numericScore - left.numericScore;
    });

    return entries[0]?.target || "";
  }

  function getLastUnitHref(lastRecord) {
    if (!lastRecord?.level || !lastRecord?.topicId) {
      return "";
    }

    const baseHref = buildTopicUrl(lastRecord.level, lastRecord.topicId);
    const detailHref = lastRecord.subunitCode
      ? `${baseHref}&subunit=${encodeURIComponent(lastRecord.subunitCode)}`
      : baseHref;
    const focusTarget = inferLastFocusTarget(lastRecord);

    return focusTarget
      ? `${detailHref}&resumeTarget=${encodeURIComponent(focusTarget)}`
      : detailHref;
  }

  function getToolbarHost() {
    return document.querySelector(
      document.body.classList.contains("page-home")
        ? ".hero-toolbar"
        : (document.body.classList.contains("page-list") ? ".list-toolbar" : ".detail-topbar")
    );
  }

  function ensureAuthModal() {
    let modal = document.getElementById(AUTH_MODAL_ID);

    if (modal) {
      return modal;
    }

    modal = document.createElement("div");
    modal.id = AUTH_MODAL_ID;
    modal.className = "auth-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="auth-modal-backdrop" data-auth-close></div>
      <section class="auth-modal-panel" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <div class="auth-modal-head">
          <div>
            <p class="section-kicker">Account</p>
            <h2 id="auth-modal-title"></h2>
          </div>
          <button class="ghost-button" type="button" data-auth-close></button>
        </div>
        <div class="auth-modal-tabs">
          <button class="auth-tab-button" type="button" data-auth-tab="login"></button>
          <button class="auth-tab-button" type="button" data-auth-tab="register"></button>
        </div>
        <p id="auth-modal-prompt" class="auth-modal-prompt"></p>
        <label class="auth-field">
          <span id="auth-username-label"></span>
          <input id="auth-username-input" class="auth-input" type="text" autocomplete="username">
        </label>
        <label class="auth-field">
          <span id="auth-password-label"></span>
          <input id="auth-password-input" class="auth-input" type="password" autocomplete="current-password">
        </label>
        <p id="auth-status" class="auth-status is-info" hidden></p>
        <div class="auth-modal-actions">
          <button id="auth-submit-button" class="primary-button" type="button"></button>
        </div>
        <button id="auth-switch-button" class="auth-switch-button" type="button"></button>
      </section>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  function renderAuthChrome() {
    const host = getToolbarHost();

    if (!host) {
      return;
    }

    let toolbar = host.querySelector(".auth-toolbar");

    if (!toolbar) {
      toolbar = document.createElement("div");
      toolbar.className = "auth-toolbar";
      host.appendChild(toolbar);
    }

    const ui = getText();
    const userLabel = authState.user?.username || "";

    toolbar.innerHTML = authState.user
      ? `
        <div class="auth-user-chip">
          <span class="auth-user-label">${escapeHtml(formatText(ui.authCurrentUser, { username: userLabel }))}</span>
          <button class="ghost-button" type="button" data-auth-logout>${escapeHtml(ui.authLogout)}</button>
        </div>
      `
      : `
        <div class="auth-toolbar-actions">
          <button class="ghost-button" type="button" data-auth-open="login">${escapeHtml(ui.authLogin)}</button>
          <button class="primary-button" type="button" data-auth-open="register">${escapeHtml(ui.authRegister)}</button>
        </div>
      `;
  }

  function renderAuthModal() {
    const modal = ensureAuthModal();
    const ui = getText();
    const isLogin = authState.mode !== "register";
    const title = isLogin ? ui.authTitleLogin : ui.authTitleRegister;
    const prompt = isLogin ? ui.authPromptLogin : ui.authPromptRegister;
    const closeButton = modal.querySelector("button[data-auth-close]");

    modal.hidden = !authState.open;
    modal.classList.toggle("is-open", authState.open);
    modal.querySelector("#auth-modal-title").textContent = title;
    if (closeButton) {
      closeButton.textContent = ui.authClose;
    }
    modal.querySelector('[data-auth-tab="login"]').textContent = ui.authLogin;
    modal.querySelector('[data-auth-tab="register"]').textContent = ui.authRegister;
    modal.querySelector('[data-auth-tab="login"]').classList.toggle("is-active", isLogin);
    modal.querySelector('[data-auth-tab="register"]').classList.toggle("is-active", !isLogin);
    modal.querySelector("#auth-modal-prompt").textContent = prompt;
    modal.querySelector("#auth-username-label").textContent = ui.authUsername;
    modal.querySelector("#auth-password-label").textContent = ui.authPassword;
    modal.querySelector("#auth-username-input").placeholder = ui.authUsernamePlaceholder;
    modal.querySelector("#auth-password-input").placeholder = ui.authPasswordPlaceholder;
    modal.querySelector("#auth-password-input").autocomplete = isLogin ? "current-password" : "new-password";
    modal.querySelector("#auth-submit-button").textContent = isLogin ? ui.authLogin : ui.authRegister;
    modal.querySelector("#auth-switch-button").textContent = isLogin ? ui.authSwitchRegister : ui.authSwitchLogin;

    const statusNode = modal.querySelector("#auth-status");
    const hasStatus = Boolean(authState.statusMessage);
    statusNode.hidden = !hasStatus;
    statusNode.className = `auth-status is-${authState.statusVariant || "info"}`;
    statusNode.textContent = authState.statusMessage || "";
    modal.querySelector("#auth-submit-button").disabled = authState.submitting;
  }

  function setAuthStatus(message, variant = "info") {
    authState.statusMessage = message || "";
    authState.statusVariant = variant;
    renderAuthModal();
  }

  function openAuthModal(mode = "login") {
    authState.mode = mode === "register" ? "register" : "login";
    authState.open = true;
    authState.statusMessage = "";
    renderAuthModal();
  }

  function closeAuthModal() {
    authState.open = false;
    authState.statusMessage = "";
    renderAuthModal();
  }

  function ensureLeaveModal() {
    let modal = document.getElementById(LEAVE_MODAL_ID);

    if (modal) {
      return modal;
    }

    modal = document.createElement("div");
    modal.id = LEAVE_MODAL_ID;
    modal.className = "leave-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="leave-modal-backdrop" data-leave-close></div>
      <section class="leave-modal-panel" role="dialog" aria-modal="true" aria-labelledby="leave-modal-title">
        <div class="leave-modal-head">
          <div>
            <h2 id="leave-modal-title"></h2>
            <p class="leave-modal-body" id="leave-modal-body"></p>
          </div>
        </div>
        <div class="leave-modal-actions">
          <button class="ghost-button" type="button" data-leave-discard></button>
          <button class="primary-button" type="button" data-leave-save></button>
        </div>
      </section>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  function renderLeaveModal() {
    const modal = ensureLeaveModal();
    const ui = getText();
    const titleNode = modal.querySelector("#leave-modal-title");
    const bodyNode = modal.querySelector("#leave-modal-body");
    const discardButton = modal.querySelector("[data-leave-discard]");
    const saveButton = modal.querySelector("[data-leave-save]");

    modal.hidden = !leaveState.open;
    modal.setAttribute("aria-hidden", leaveState.open ? "false" : "true");

    titleNode.textContent = ui.leaveModalTitle;
    bodyNode.textContent = ui.leaveModalBody;
    discardButton.textContent = ui.leaveModalDiscard;
    saveButton.textContent = leaveState.saving ? ui.leaveModalSaving : ui.leaveModalSaveExit;
    discardButton.disabled = leaveState.saving;
    saveButton.disabled = leaveState.saving;
  }

  function closeLeaveModal() {
    leaveState.open = false;
    leaveState.destination = "";
    leaveState.saving = false;
    leaveState.suppressBeforeUnload = false;
    renderLeaveModal();
  }

  function navigateWithLeaveBypass(destination) {
    if (!destination) {
      return;
    }

    leaveState.suppressBeforeUnload = true;
    leaveState.historyGuardArmed = false;
    progressState.beaconQueued = false;
    closeLeaveModal();
    window.location.assign(destination);
  }

  function openLeaveModal(destination) {
    if (!destination) {
      return;
    }

    leaveState.suppressBeforeUnload = false;
    leaveState.destination = destination;
    leaveState.saving = false;
    leaveState.open = true;
    renderLeaveModal();
  }

  function getFallbackLeaveDestination() {
    const referrer = String(document.referrer || "").trim();

    if (referrer && referrer !== window.location.href) {
      return referrer;
    }

    return document.body.classList.contains("page-detail") ? "index.html" : window.location.href;
  }

  function armLeaveHistoryGuard() {
    if (
      leaveState.historyGuardArmed
      || typeof window.history?.pushState !== "function"
      || !document.body.classList.contains("page-detail")
    ) {
      return;
    }

    window.history.pushState(
      {
        ...(window.history.state || {}),
        __studyLeaveGuard: true
      },
      "",
      window.location.href
    );
    leaveState.historyGuardArmed = true;
  }

  async function loadSessionState() {
    authState.loading = true;
    authState.sessionToken = authState.sessionToken || readStoredSessionToken();

    try {
      const payload = await apiRequest(SESSION_API_PATH);
      authState.user = payload?.authenticated ? payload.user : null;
      authState.sessionToken = payload?.sessionToken || authState.sessionToken || "";
      writeStoredSessionToken(authState.user ? authState.sessionToken : "");
      authState.loaded = true;
      authState.loading = false;
      renderAuthChrome();
      renderAuthModal();
      return authState.user;
    } catch (error) {
      authState.user = null;
      authState.sessionToken = "";
      writeStoredSessionToken("");
      authState.loaded = true;
      authState.loading = false;
      setAuthStatus(getText().authLoadFailed, "error");
      renderAuthChrome();
      throw error;
    }
  }

  async function loadProgressState(options = {}) {
    progressState.loading = true;

    try {
      if (!authState.user) {
        progressState.cache = createProgress();
        progressState.loaded = true;
      } else {
        const payload = await apiRequest(PROGRESS_API_PATH);
        progressState.cache = normalizeProgressCache(payload?.progress);
        progressState.loaded = true;
      }

      const meta = getCurrentUnitContext();

      if (meta) {
        const shouldPreserveDirtyDraft = Boolean(options.preserveDirtyDraft && progressState.dirty && progressState.currentDraft);

        progressState.currentUnit = meta;
        progressState.currentDraft = shouldPreserveDirtyDraft
          ? normalizeUnitProgress(meta, progressState.currentDraft)
          : (authState.user ? getSavedUnitProgress(meta) : createUnitProgress(meta));
        progressState.currentDraft = normalizeUnitProgress(meta, progressState.currentDraft);
        progressState.restoreAppliedForKey = "";
        progressState.dirty = shouldPreserveDirtyDraft;
      } else {
        progressState.currentUnit = null;
        progressState.currentDraft = null;
        progressState.dirty = false;
      }

      progressState.loading = false;
      renderAll();
      return progressState.cache;
    } catch (error) {
      progressState.loading = false;
      progressState.loaded = true;
      console.error("Load progress failed:", error);
      renderAll();
      return progressState.cache;
    }
  }

  async function submitAuth(mode) {
    const modal = ensureAuthModal();
    const username = modal.querySelector("#auth-username-input").value.trim();
    const password = modal.querySelector("#auth-password-input").value;
    const ui = getText();

    authState.submitting = true;
    setAuthStatus("", "info");
    renderAuthModal();

    try {
      const payload = await apiRequest(mode === "register" ? REGISTER_API_PATH : LOGIN_API_PATH, {
        method: "POST",
        body: JSON.stringify({ username, password })
      });

      authState.user = payload?.user || null;
      authState.sessionToken = payload?.sessionToken || authState.sessionToken || "";
      writeStoredSessionToken(authState.sessionToken);
      authState.loaded = true;
      authState.submitting = false;
      setAuthStatus(mode === "register" ? ui.authRegisterSuccess : ui.authLoginSuccess, "success");
      renderAuthChrome();
      closeAuthModal();
      await loadProgressState({ preserveDirtyDraft: true });
    } catch (error) {
      authState.submitting = false;
      setAuthStatus(error.message || ui.authLoadFailed, "error");
    }
  }

  async function logoutAccount() {
    if (progressState.dirty && authState.user) {
      const shouldSave = window.confirm(getText().saveBeforeLogout);

      if (shouldSave) {
        const saved = await saveProgressNow({ silent: true });

        if (!saved) {
          return;
        }
      }
    }

    try {
      await apiRequest(LOGOUT_API_PATH, { method: "POST", body: JSON.stringify({}) });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    authState.user = null;
    authState.sessionToken = "";
    writeStoredSessionToken("");
    progressState.cache = createProgress();
    progressState.loaded = true;
    progressState.dirty = false;
    progressState.restoreAppliedForKey = "";
    renderAll();
  }

  function bindAuthUi() {
    if (document.body.dataset.authBound === "true") {
      return;
    }

    document.body.dataset.authBound = "true";

    document.addEventListener("click", (event) => {
      const openButton = event.target.closest("[data-auth-open]");

      if (openButton) {
        openAuthModal(openButton.dataset.authOpen);
        return;
      }

      if (event.target.closest("[data-auth-close]")) {
        closeAuthModal();
        return;
      }

      const tabButton = event.target.closest("[data-auth-tab]");

      if (tabButton) {
        openAuthModal(tabButton.dataset.authTab);
        return;
      }

      if (event.target.closest("#auth-switch-button")) {
        openAuthModal(authState.mode === "login" ? "register" : "login");
        return;
      }

      if (event.target.closest("#auth-submit-button")) {
        submitAuth(authState.mode);
        return;
      }

      if (event.target.closest("[data-auth-logout]")) {
        logoutAccount();
      }
    });

    document.addEventListener("keydown", (event) => {
      const modal = document.getElementById(AUTH_MODAL_ID);

      if (!authState.open || !modal) {
        return;
      }

      if (event.key === "Escape") {
        closeAuthModal();
        return;
      }

      if (event.key === "Enter" && event.target.closest(`#${AUTH_MODAL_ID}`)) {
        event.preventDefault();
        submitAuth(authState.mode);
      }
    });
  }

  function formatSavedTime(value) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(currentLang === "en" ? "en-US" : "zh-CN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function ensureDetailProgressPanel() {
    if (!document.body.classList.contains("page-detail")) {
      return null;
    }

    const main = document.querySelector(".detail-main");

    if (!main) {
      return null;
    }

    const localEditor = document.getElementById("detail-local-editor");

    let panel = document.getElementById(DETAIL_PROGRESS_PANEL_ID);

    if (!panel) {
      panel = document.createElement("section");
      panel.id = DETAIL_PROGRESS_PANEL_ID;
      panel.className = "detail-panel detail-panel-wide detail-progress-panel";
    }

    if (localEditor) {
      main.insertBefore(panel, localEditor);
    } else if (panel.parentElement !== main) {
      main.appendChild(panel);
    }

    return panel;
  }

  function renderDetailProgressPanel() {
    const panel = ensureDetailProgressPanel();

    if (!panel) {
      return;
    }

    const meta = getCurrentUnitContext();

    if (!meta || Number(meta.totalQuestions || 0) <= 0) {
      panel.hidden = true;
      return;
    }

    ensureCurrentDraft(meta);

    const ui = getText();
    const draft = normalizeUnitProgress(meta, progressState.currentDraft);
    const saveLabel = ui.savePanelSave;

    progressState.currentDraft = draft;
    panel.hidden = false;
    panel.classList.add("is-compact");
    panel.innerHTML = `
      <div class="detail-progress-actions">
        ${authState.user
          ? `<button class="primary-button" type="button" data-progress-save>${escapeHtml(progressState.saving ? ui.savePanelSaving : saveLabel)}</button>`
          : `<button class="primary-button" type="button" data-progress-login>${escapeHtml(ui.savePanelLoginButton)}</button>`
        }
      </div>
    `;

    const actionButton = panel.querySelector("[data-progress-save]");

    if (actionButton) {
      actionButton.disabled = progressState.saving;
    }
  }

  async function saveProgressNow(options = {}) {
    const meta = getCurrentUnitContext();

    if (!meta) {
      return false;
    }

    if (!authState.user) {
      if (!options.silent) {
        openAuthModal("login");
        setAuthStatus(getText().authNeedLogin, "info");
      }
      return false;
    }

    if (progressState.saving) {
      return false;
    }

    ensureCurrentDraft(meta);
    progressState.saving = true;
    renderDetailProgressPanel();

    try {
      const savedAt = new Date().toISOString();
      const draft = normalizeUnitProgress(meta, {
        ...progressState.currentDraft,
        savedAt,
        scrollY: 0,
        visited: true,
        lastViewedAt: savedAt
      });
      const nextProgress = normalizeProgressCache(progressState.cache);

      nextProgress.units[meta.key] = draft;
      nextProgress.lastUnit = {
        unitKey: meta.key,
        level: meta.level,
        topicId: meta.topicId,
        subunitCode: meta.subunitCode || "",
        title: meta.title,
        savedAt,
        status: draft.status,
        lastFocusTarget: draft.lastFocusTarget || ""
      };

      const payload = await apiRequest(PROGRESS_SAVE_API_PATH, {
        method: "POST",
        body: JSON.stringify({ progress: nextProgress })
      });

      progressState.cache = normalizeProgressCache(payload?.progress || nextProgress);
      progressState.currentDraft = getSavedUnitProgress(meta);
      progressState.currentUnit = meta;
      progressState.dirty = false;
      progressState.restoreAppliedForKey = meta.key;
      progressState.saving = false;
      renderAuthChrome();
      renderDetailProgressPanel();
      enhanceHomePage();
      enhanceListPage();
      return true;
    } catch (error) {
      progressState.saving = false;
      console.error("Save progress failed:", error);

      if (!options.silent) {
        window.alert(getText().savePanelSaveFailed);
      }

      renderDetailProgressPanel();
      return false;
    }
  }

  function queueProgressBeacon() {
    if (
      !authState.user
      || !progressState.dirty
      || !progressState.currentUnit
      || !progressState.currentDraft
      || typeof navigator?.sendBeacon !== "function"
    ) {
      return false;
    }

    const meta = progressState.currentUnit;
    const savedAt = new Date().toISOString();
    const draft = normalizeUnitProgress(meta, {
      ...progressState.currentDraft,
      savedAt,
      scrollY: 0,
      visited: true,
      lastViewedAt: savedAt
    });
    const nextProgress = normalizeProgressCache(progressState.cache);

    nextProgress.units[meta.key] = draft;
    nextProgress.lastUnit = {
      unitKey: meta.key,
      level: meta.level,
      topicId: meta.topicId,
      subunitCode: meta.subunitCode || "",
      title: meta.title,
      savedAt,
      status: draft.status,
      lastFocusTarget: draft.lastFocusTarget || ""
    };

    const body = new Blob([JSON.stringify({ progress: nextProgress })], {
      type: "application/json"
    });

    return navigator.sendBeacon(getApiUrl(PROGRESS_SAVE_API_PATH), body);
  }

  function bindLeaveProtection() {
    if (document.body.dataset.leaveProtectionBound === "true") {
      return;
    }

    document.body.dataset.leaveProtectionBound = "true";

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-leave-close]")) {
        closeLeaveModal();
        return;
      }

      if (event.target.closest("[data-leave-discard]")) {
        navigateWithLeaveBypass(leaveState.destination);
        return;
      }

      if (event.target.closest("[data-leave-save]")) {
        if (leaveState.saving) {
          return;
        }

        leaveState.saving = true;
        renderLeaveModal();

        Promise.resolve(saveProgressNow({ silent: false }))
          .then((saved) => {
            if (saved) {
              navigateWithLeaveBypass(leaveState.destination);
              return;
            }

            leaveState.saving = false;
            renderLeaveModal();
          })
          .catch(() => {
            leaveState.saving = false;
            renderLeaveModal();
          });
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!leaveState.open) {
        return;
      }

      if (event.key === "Escape") {
        closeLeaveModal();
      }
    });

    window.addEventListener("popstate", () => {
      if (!leaveState.historyGuardArmed || leaveState.suppressBeforeUnload) {
        return;
      }

      if (!authState.user || !progressState.dirty) {
        leaveState.historyGuardArmed = false;
        window.setTimeout(() => {
          if (!leaveState.suppressBeforeUnload) {
            window.history.back();
          }
        }, 0);
        return;
      }

      openLeaveModal(getFallbackLeaveDestination());
      window.history.pushState(
        {
          ...(window.history.state || {}),
          __studyLeaveGuard: true
        },
        "",
        window.location.href
      );
    });

    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");

      if (
        !link
        || !authState.user
        || !progressState.dirty
        || event.defaultPrevented
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
        || link.target === "_blank"
      ) {
        return;
      }

      const href = link.getAttribute("href");

      if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
        return;
      }

      event.preventDefault();
      const destination = link.href;
      openLeaveModal(destination);
    }, true);

    window.addEventListener("beforeunload", (event) => {
      if (leaveState.suppressBeforeUnload || !authState.user || !progressState.dirty) {
        return;
      }

      progressState.beaconQueued = true;
      event.preventDefault();
      event.returnValue = getText().browserLeaveHint;
    });

    window.addEventListener("pagehide", () => {
      if (progressState.beaconQueued) {
        queueProgressBeacon();
        progressState.beaconQueued = false;
      }
    });
  }

  function normalizeBookValue(value) {
    return String(value || "").trim();
  }

  function getBookAnswerParts(answerText) {
    if (typeof getBookBlankAnswers === "function") {
      return getBookBlankAnswers(answerText || "");
    }

    return [String(answerText || "")];
  }

  function setBookFeedback(feedbackNode, variant, message) {
    if (!feedbackNode) {
      return;
    }

    feedbackNode.hidden = false;
    feedbackNode.className = `book-line-feedback is-${variant}`;
    feedbackNode.textContent = message;
  }

  function hideFeedback(feedbackNode) {
    if (!feedbackNode) {
      return;
    }

    feedbackNode.hidden = true;
    feedbackNode.className = "book-line-feedback";
    feedbackNode.textContent = "";
  }

  function getBookFeedbackMessage(answerText, status) {
    if (status === "correct") {
      return currentLang === "en"
        ? "Correct. The sentence is complete."
        : "答对了，这一题已经完成。";
    }

    if (status === "incorrect") {
      return currentLang === "en"
        ? `Checked. Suggested answer: ${answerText}`
        : `已检查，参考答案：${answerText}`;
    }

    return currentLang === "en"
      ? `Suggested answer: ${answerText}`
      : `参考答案：${answerText}`;
  }

  function getReferenceFeedbackMessage(answerText, status) {
    if (status === "correct") {
      return currentLang === "en"
        ? "Correct. You found the referent."
        : "答对了，你找到了指代对象。";
    }

    if (status === "incorrect") {
      return currentLang === "en"
        ? `Checked. Suggested answer: ${answerText}`
        : `已检查，参考答案：${answerText}`;
    }

    return currentLang === "en"
      ? `Suggested answer: ${answerText}`
      : `参考答案：${answerText}`;
  }

  function getFeedbackStatus(feedbackNode) {
    if (!feedbackNode || feedbackNode.hidden) {
      return "";
    }

    if (feedbackNode.classList.contains("is-correct")) {
      return "correct";
    }

    if (feedbackNode.classList.contains("is-incorrect")) {
      return "incorrect";
    }

    if (feedbackNode.classList.contains("is-reveal")) {
      return "revealed";
    }

    if (feedbackNode.classList.contains("is-pending")) {
      return "pending";
    }

    return "";
  }

  function getInputResultStatus(input) {
    if (!input) {
      return "";
    }

    if (input.classList.contains("is-correct")) {
      return "correct";
    }

    if (input.classList.contains("is-incorrect")) {
      return "incorrect";
    }

    return "";
  }

  function getAggregateInputResultStatus(inputs) {
    const statuses = (inputs || []).map((input) => getInputResultStatus(input)).filter(Boolean);

    if (!statuses.length) {
      return "";
    }

    if (statuses.every((status) => status === "correct")) {
      return "correct";
    }

    return "incorrect";
  }

  function applyInputResultStatus(input, status) {
    if (!input) {
      return;
    }

    input.classList.remove("is-correct", "is-incorrect");

    if (status === "correct" || status === "incorrect") {
      input.classList.add(`is-${status}`);
    }
  }

  function syncStoredBookChoiceSelection(container, lineId, resultStatus = "") {
    if (!container || !lineId) {
      return;
    }

    const normalizedStatus = resultStatus === "correct" || resultStatus === "incorrect"
      ? resultStatus
      : "";
    const selectedValue = normalizeBookValue(
      container.querySelector(`[data-book-input^="${lineId}-"]`)?.value || ""
    ).toUpperCase();

    container.querySelectorAll(`[data-book-choice="${lineId}"]`).forEach((button) => {
      const buttonValue = normalizeBookValue(button.dataset.choiceValue || "").toUpperCase();
      const isSelected = Boolean(selectedValue) && selectedValue === buttonValue;
      button.classList.toggle("is-selected", isSelected);
      button.classList.remove("is-correct", "is-incorrect");

      if (isSelected && normalizedStatus) {
        button.classList.add(`is-${normalizedStatus}`);
      }
    });
  }

  function setStoredExplanationVisibility(panel, visible) {
    if (!panel || panel.dataset.empty === "true") {
      if (panel) {
        panel.hidden = true;
      }
      return;
    }

    panel.hidden = !visible;
  }

  function restoreBookAndReferenceState(container) {
    if (!container || !progressState.currentDraft) {
      return;
    }

    Object.entries(sanitizeUnitStates(progressState.currentDraft.bookStates)).forEach(([lineId, state]) => {
      const inputs = Array.from(container.querySelectorAll(`[data-book-input^="${lineId}-"]`));
      const feedback = container.querySelector(`[data-book-feedback="${lineId}"]`);
      const explanationPanel = container.querySelector(`[data-book-explanation-panel="${lineId}"]`);
      const answerText = feedback?.dataset.answer || "";

      inputs.forEach((input, index) => {
        input.value = Array.isArray(state?.values) ? (state.values[index] || "") : "";
        applyInputResultStatus(input, Array.isArray(state?.inputStatuses) ? state.inputStatuses[index] : "");
      });

      const storedLineStatus = Array.isArray(state?.inputStatuses) && state.inputStatuses.length
        ? state.inputStatuses[0]
        : (state?.status === "correct" || state?.status === "incorrect" ? state.status : "");
      syncStoredBookChoiceSelection(container, lineId, storedLineStatus);

      if (state?.status === "revealed") {
        setBookFeedback(feedback, state.status === "revealed" ? "reveal" : state.status, getBookFeedbackMessage(answerText, state.status));
        setStoredExplanationVisibility(explanationPanel, true);
      } else {
        hideFeedback(feedback);
        setStoredExplanationVisibility(explanationPanel, false);

        if ((!Array.isArray(state?.inputStatuses) || !state.inputStatuses.length) && state?.status) {
          inputs.forEach((input) => {
            applyInputResultStatus(input, state.status);
          });
        }
      }
    });

    Object.entries(sanitizeUnitStates(progressState.currentDraft.referenceStates)).forEach(([lineId, state]) => {
      const input = container.querySelector(`[data-reference-input="${lineId}"]`);
      const feedback = container.querySelector(`[data-reference-feedback="${lineId}"]`);
      const explanationPanel = container.querySelector(`[data-reference-explanation-panel="${lineId}"]`);
      const answerText = feedback?.dataset.answer || "";

      if (input) {
        input.value = state?.value || "";
        applyInputResultStatus(input, state?.inputStatus || "");
      }

      if (state?.status === "revealed") {
        setBookFeedback(feedback, state.status === "revealed" ? "reveal" : state.status, getReferenceFeedbackMessage(answerText, state.status));
        setStoredExplanationVisibility(explanationPanel, true);
      } else {
        hideFeedback(feedback);
        setStoredExplanationVisibility(explanationPanel, false);

        if (input && !state?.inputStatus && state?.status) {
          applyInputResultStatus(input, state.status);
        }
      }
    });
  }

  function bindBookAndReferencePersistence() {
    const container = document.getElementById("practice-list");

    if (!container || container.dataset.progressPersistenceBound === "true") {
      return;
    }

    container.dataset.progressPersistenceBound = "true";

    container.addEventListener("input", (event) => {
      const bookInput = event.target.closest("[data-book-input]");

      if (bookInput) {
        const parts = String(bookInput.dataset.bookInput || "").split("-");
        const lineId = `${parts[0]}-${parts[1]}`;
        const values = Array.from(container.querySelectorAll(`[data-book-input^="${lineId}-"]`)).map((node) => node.value || "");
        updateBookState(lineId, { values, status: "", inputStatuses: [] });
        syncStoredBookChoiceSelection(container, lineId, "");
        return;
      }

      const referenceInput = event.target.closest("[data-reference-input]");

      if (referenceInput) {
        updateReferenceState(referenceInput.dataset.referenceInput, {
          value: referenceInput.value || "",
          status: "",
          inputStatus: ""
        });
      }
    });

    container.addEventListener("click", (event) => {
      const bookButton = event.target.closest("[data-book-check], [data-book-show]");
      const referenceButton = event.target.closest("[data-reference-check], [data-reference-show]");

      if (!bookButton && !referenceButton) {
        return;
      }

      requestAnimationFrame(() => {
        if (bookButton) {
          const lineId = bookButton.dataset.bookCheck || bookButton.dataset.bookShow;
          const inputs = Array.from(container.querySelectorAll(`[data-book-input^="${lineId}-"]`));
          const values = inputs.map((node) => node.value || "");
          const feedback = container.querySelector(`[data-book-feedback="${lineId}"]`);
          const feedbackStatus = getFeedbackStatus(feedback);
          const inputStatuses = inputs.map((node) => getInputResultStatus(node));
          updateBookState(lineId, {
            values,
            status: feedbackStatus || getAggregateInputResultStatus(inputs),
            inputStatuses
          });
          syncStoredBookChoiceSelection(
            container,
            lineId,
            inputStatuses[0] || (feedbackStatus === "correct" || feedbackStatus === "incorrect" ? feedbackStatus : "")
          );
          return;
        }

        const lineId = referenceButton.dataset.referenceCheck || referenceButton.dataset.referenceShow;
        const input = container.querySelector(`[data-reference-input="${lineId}"]`);
        const feedback = container.querySelector(`[data-reference-feedback="${lineId}"]`);
        const feedbackStatus = getFeedbackStatus(feedback);
        const inputStatus = getInputResultStatus(input);
        updateReferenceState(lineId, {
          value: input?.value || "",
          status: feedbackStatus || inputStatus,
          inputStatus
        });
      });
    });
  }

  function restoreQuickState() {
    const container = document.getElementById("practice-list");

    if (!container || !progressState.currentDraft) {
      return;
    }

    progressState.restoring = true;

    try {
      Array.from(container.querySelectorAll(".exercise-card")).forEach((card) => {
        const exerciseIndex = String(card.dataset.exerciseIndex || "");
        const state = progressState.currentDraft.quickStates?.[exerciseIndex];

        if (!state) {
          return;
        }

        if (card.dataset.exerciseType === "choice") {
          if (state.status === "revealed") {
            window.revealChoiceExercise(card);
            return;
          }

          if (Number.isInteger(state.selectedIndex)) {
            window.checkChoiceExercise(card, state.selectedIndex);
          }
          return;
        }

        const input = card.querySelector(".fill-input");

        if (input && typeof state.inputValue === "string") {
          input.value = state.inputValue;
        }

        if (state.status === "revealed") {
          window.checkFillExercise(card, true);
          return;
        }

        if (state.status === "correct" || state.status === "incorrect") {
          window.checkFillExercise(card, false);
        }
      });
    } finally {
      progressState.restoring = false;
    }
  }

  function bindScrollPersistence() {
    return;
  }

  function getResumeTargetFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return String(params.get("resumeTarget") || "").trim();
  }

  function getPracticeElementIdFromResumeTarget(target) {
    const [kind, rawKey] = String(target || "").split(":");
    const key = String(rawKey || "").trim();

    if (!kind || !key) {
      return "";
    }

    if (kind === "quick") {
      return `practice-quick-${key}`;
    }

    if (kind === "book") {
      return `practice-book-${key}`;
    }

    if (kind === "reference") {
      return `practice-reference-${key}`;
    }

    return "";
  }

  function getPracticeModeFromResumeTarget(target) {
    const kind = String(target || "").split(":")[0] || "";
    if (kind === "quick") {
      return "quick";
    }

    if (kind === "book" || kind === "reference") {
      return "book";
    }

    return "";
  }

  function applyResumeTargetScroll(meta) {
    const resumeTarget = getResumeTargetFromUrl();

    if (!resumeTarget) {
      return;
    }

    const appliedKey = `${meta.key}::${resumeTarget}`;
    if (progressState.resumeTargetApplied === appliedKey) {
      return;
    }

    const practiceMode = getPracticeModeFromResumeTarget(resumeTarget);
    if (practiceMode && typeof setPracticeMode === "function") {
      setPracticeMode(practiceMode);
    }

    requestAnimationFrame(() => {
      const elementId = getPracticeElementIdFromResumeTarget(resumeTarget);
      const target = elementId ? document.getElementById(elementId) : null;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      target.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      const focusTarget = target.querySelector("input, button, textarea");
      if (focusTarget instanceof HTMLElement) {
        focusTarget.focus({ preventScroll: true });
      }

      progressState.resumeTargetApplied = appliedKey;
      const url = new URL(window.location.href);
      url.searchParams.delete("resumeTarget");
      window.history.replaceState({}, "", url.toString());
    });
  }

  function restoreScrollPosition() {
    return;
  }

  function restoreDetailProgress() {
    if (!document.body.classList.contains("page-detail")) {
      return;
    }

    const meta = getCurrentUnitContext();

    if (!meta) {
      return;
    }

    ensureCurrentDraft(meta);
    renderDetailProgressPanel();
    bindDetailSaveAction();
    bindBookAndReferencePersistence();
    bindScrollPersistence();

    restoreQuickState();
    restoreBookAndReferenceState(document.getElementById("practice-list"));
    applyResumeTargetScroll(meta);
    restoreScrollPosition();
    progressState.restoreAppliedForKey = meta.key;
  }

  function buildHomeMemoryMarkup() {
    const ui = getText();
    const lastRecord = getLastUnitRecord();
    const completedCount = Object.values(progressState.cache.units || {}).filter((entry) => entry.status === "completed").length;
    const startedCount = Object.values(progressState.cache.units || {}).filter((entry) => entry.status !== "new").length;

    if (!authState.user) {
      return `
        <div class="panel-header">
          <div>
            <p class="section-kicker">Account Progress</p>
            <h2>${escapeHtml(ui.resumeEmptyTitle)}</h2>
          </div>
        </div>
        <p class="section-note auth-home-note">${escapeHtml(ui.resumeEmptyText)}</p>
        <div class="detail-progress-actions">
          <button class="primary-button" type="button" data-auth-open="login">${escapeHtml(ui.authLogin)}</button>
          <button class="ghost-button" type="button" data-auth-open="register">${escapeHtml(ui.authRegister)}</button>
        </div>
      `;
    }

    return `
      <div class="panel-header">
        <div>
          <p class="section-kicker">Account Progress</p>
          <h2>${escapeHtml(formatText(ui.authCurrentUser, { username: authState.user.username }))}</h2>
        </div>
        <p class="section-note">${escapeHtml(lastRecord ? formatText(ui.resumeText, {
          level: lastRecord.level || "",
          title: lastRecord.title || "",
          summary: lastRecord.summary || ""
        }) : ui.resumeEmptyText)}</p>
      </div>
      <div class="detail-progress-metrics">
        <article class="detail-progress-metric">
          <span>${escapeHtml(ui.progressCompleted)}</span>
          <strong>${completedCount}</strong>
        </article>
        <article class="detail-progress-metric">
          <span>${escapeHtml(ui.progressStudied)}</span>
          <strong>${startedCount}</strong>
        </article>
        <article class="detail-progress-metric">
          <span>${escapeHtml(ui.memoryKicker)}</span>
          <strong>${escapeHtml(lastRecord?.status ? (ui.status?.[lastRecord.status] || lastRecord.status) : ui.status.new)}</strong>
        </article>
      </div>
      ${lastRecord ? `
        <div class="detail-progress-actions">
          <a class="primary-button home-progress-resume-button" href="${escapeHtml(getLastUnitHref(lastRecord))}">${escapeHtml(ui.resumeAction)}</a>
        </div>
      ` : ""}
    `;
  }

  function enhanceHomePage() {
    if (!document.body.classList.contains("page-home")) {
      return;
    }

    const host = document.querySelector(".content-stack");

    if (!host) {
      return;
    }

    let panel = document.getElementById("home-progress-panel");

    if (!panel) {
      panel = document.createElement("section");
      panel.id = "home-progress-panel";
      panel.className = "panel home-progress-panel is-visible";
      const publishPanel = document.getElementById("home-local-publish-panel");

      if (publishPanel) {
        publishPanel.insertAdjacentElement("afterend", panel);
      } else {
        host.prepend(panel);
      }
    }

    panel.innerHTML = buildHomeMemoryMarkup();

    const lastRecord = authState.user ? getLastUnitRecord() : null;
    const resumeHref = getLastUnitHref(lastRecord);

    if (resumeHref) {
      panel.dataset.resumeHref = resumeHref;
      panel.classList.add("is-resumable");
      panel.tabIndex = 0;
      panel.setAttribute("role", "link");
      return;
    }

    delete panel.dataset.resumeHref;
    panel.classList.remove("is-resumable");
    panel.removeAttribute("tabindex");
    panel.removeAttribute("role");
  }

  function enhanceListPage() {
    if (!document.body.classList.contains("page-list")) {
      return;
    }

    document.querySelectorAll("#grammar-list .grammar-card").forEach((card) => {
      const existing = card.querySelector(".progress-pill");

      if (!authState.user) {
        if (existing) {
          existing.remove();
        }
        delete card.dataset.progressStatus;
        return;
      }

      const url = new URL(card.href, window.location.href);
      const level = getLevelKey(url.searchParams.get("level") || "A1");
      const topicId = url.searchParams.get("topic");

      if (!topicId) {
        return;
      }

      const stats = getAggregateTopicStats(level, topicId);
      const ui = getText();
      if (existing) {
        existing.remove();
      }

      const header = card.querySelector(".grammar-card-header");

      if (!header) {
        return;
      }

      const pill = document.createElement("span");
      pill.className = `progress-pill is-${stats.status}`;
      pill.textContent = ui.status?.[stats.status] || stats.status;
      header.appendChild(pill);

      card.dataset.progressStatus = stats.status;
    });
  }

  function bindDetailSaveAction() {
    if (document.body.dataset.detailProgressBound === "true") {
      return;
    }

    document.body.dataset.detailProgressBound = "true";

    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-progress-save]")) {
        saveProgressNow();
        return;
      }

      if (event.target.closest("[data-progress-login]")) {
        openAuthModal("login");
      }
    });

    document.addEventListener("input", (event) => {
      const fillInput = event.target.closest(".fill-input");

      if (!fillInput) {
        return;
      }

      const card = fillInput.closest(".exercise-card");

      if (!card) {
        return;
      }

      updateQuickState(card.dataset.exerciseIndex, {
        inputValue: fillInput.value || "",
        status: ""
      });
    });
  }

  function bindHomeProgressPanel() {
    if (document.body.dataset.homeProgressBound === "true") {
      return;
    }

    document.body.dataset.homeProgressBound = "true";

    document.addEventListener("click", (event) => {
      const panel = event.target.closest("#home-progress-panel.is-resumable");

      if (!panel || event.target.closest("a, button, input, textarea, select, label")) {
        return;
      }

      const resumeHref = String(panel.dataset.resumeHref || "");

      if (resumeHref) {
        window.location.assign(resumeHref);
      }
    });

    document.addEventListener("keydown", (event) => {
      const panel = event.target.closest("#home-progress-panel.is-resumable");

      if (!panel || (event.key !== "Enter" && event.key !== " ")) {
        return;
      }

      const resumeHref = String(panel.dataset.resumeHref || "");

      if (!resumeHref) {
        return;
      }

      event.preventDefault();
      window.location.assign(resumeHref);
    });
  }

  const originalRenderHomePage = window.renderHomePage;
  const originalRenderListPage = window.renderListPage;
  const originalRenderDetailPage = window.renderDetailPage;
  const originalCheckChoiceExercise = window.checkChoiceExercise;
  const originalRevealChoiceExercise = window.revealChoiceExercise;
  const originalCheckFillExercise = window.checkFillExercise;

  window.renderHomePage = function wrappedRenderHomePage(...args) {
    const result = originalRenderHomePage.apply(this, args);
    renderAuthChrome();
    renderAuthModal();
    enhanceHomePage();
    return result;
  };

  window.renderListPage = function wrappedRenderListPage(...args) {
    const result = originalRenderListPage.apply(this, args);
    renderAuthChrome();
    renderAuthModal();
    enhanceListPage();
    return result;
  };

  window.renderDetailPage = function wrappedRenderDetailPage(...args) {
    const result = originalRenderDetailPage.apply(this, args);
    renderAuthChrome();
    renderAuthModal();
    restoreDetailProgress();
    return result;
  };

  window.checkChoiceExercise = function wrappedCheckChoiceExercise(card, selectedIndex, ...rest) {
    const result = originalCheckChoiceExercise.call(this, card, selectedIndex, ...rest);

    if (!progressState.restoring && card) {
      const feedback = card.querySelector(".exercise-feedback");
      updateQuickState(card.dataset.exerciseIndex, {
        selectedIndex,
        status: getFeedbackStatus(feedback)
      });
    }

    return result;
  };

  window.revealChoiceExercise = function wrappedRevealChoiceExercise(card, ...rest) {
    const result = originalRevealChoiceExercise.call(this, card, ...rest);

    if (!progressState.restoring && card) {
      updateQuickState(card.dataset.exerciseIndex, {
        selectedIndex: -1,
        status: "revealed"
      });
    }

    return result;
  };

  window.checkFillExercise = function wrappedCheckFillExercise(card, revealOnly, ...rest) {
    const input = card?.querySelector(".fill-input");
    const result = originalCheckFillExercise.call(this, card, revealOnly, ...rest);

    if (!progressState.restoring && card) {
      const feedback = card.querySelector(".exercise-feedback");
      const inputStatus = getInputResultStatus(input);
      updateQuickState(card.dataset.exerciseIndex, {
        inputValue: input?.value || "",
        status: revealOnly ? (getFeedbackStatus(feedback) || "revealed") : inputStatus
      });
    }

    return result;
  };

  bindAuthUi();
  bindLeaveProtection();
  bindDetailSaveAction();
  bindHomeProgressPanel();
  loadSessionState()
    .catch(() => null)
    .then(() => loadProgressState({ preserveDirtyDraft: true }));
  renderAll();
})();
