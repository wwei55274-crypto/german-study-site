const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { getDefaultUserDataRoot } = require("./platform_paths");

const HOST = process.env.AI_BRIDGE_HOST || "127.0.0.1";
const PORT = Number.parseInt(process.env.AI_BRIDGE_PORT || "8765", 10);
const MODEL_CACHE_TTL_MS = 5 * 60 * 1000;

const USER_DATA_ROOT = getDefaultUserDataRoot("GermanStudy");
const USER_DATA_DIR = path.join(USER_DATA_ROOT, "secure-data");
const AI_CONFIG_FILE = path.join(USER_DATA_DIR, "ai-api-config.json");

const ENV_CONFIG = {
  baseUrl: String(process.env.AI_API_BASE_URL || "https://us.novaiapi.com/v1").trim() || "https://us.novaiapi.com/v1",
  chatEndpoint: String(process.env.AI_API_CHAT_ENDPOINT || "/chat/completions").trim() || "/chat/completions",
  modelsEndpoint: String(process.env.AI_API_MODELS_ENDPOINT || "/models").trim() || "/models",
  apiKey: String(process.env.AI_API_KEY || "").trim(),
  timeoutMs: Number.parseInt(process.env.AI_API_TIMEOUT_MS || "120000", 10),
  defaultModel: String(process.env.AI_API_DEFAULT_MODEL || "[次]grok-420-fast").trim() || "[次]grok-420-fast",
  modelIds: String(process.env.AI_MODEL_IDS || "").trim(),
  modelOptionsJson: String(process.env.AI_MODEL_OPTIONS_JSON || "").trim(),
  providerLabel: String(process.env.AI_PROVIDER_LABEL || "Novai Direct API").trim() || "Novai Direct API"
};

let cachedModels = null;
let cachedAt = 0;
let cachedModelsKey = "";

function jsonResponse(response, statusCode, payload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8");
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": body.length,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  response.end(body);
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    request.on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeApiPath(value, fallback) {
  const rawValue = String(value || "").trim() || fallback;
  return rawValue.startsWith("/") ? rawValue : `/${rawValue}`;
}

function createRuntimeConfig(overrides = {}) {
  const rawBaseUrl = String(overrides.baseUrl || "").trim() || ENV_CONFIG.baseUrl;
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const providerLabel = String(overrides.providerLabel || "").trim()
    || ENV_CONFIG.providerLabel
    || "Novai Direct API";

  return {
    baseUrl,
    chatEndpoint: normalizeApiPath(ENV_CONFIG.chatEndpoint, "/chat/completions"),
    modelsEndpoint: normalizeApiPath(ENV_CONFIG.modelsEndpoint, "/models"),
    apiKey: String(overrides.apiKey || "").trim() || ENV_CONFIG.apiKey,
    timeoutMs: Number.isFinite(Number(overrides.timeoutMs))
      ? Math.max(5000, Number(overrides.timeoutMs))
      : (Number.isFinite(ENV_CONFIG.timeoutMs) ? Math.max(5000, ENV_CONFIG.timeoutMs) : 120000),
    defaultModel: String(overrides.defaultModel || "").trim() || ENV_CONFIG.defaultModel,
    modelIds: String(overrides.modelIds || "").trim() || ENV_CONFIG.modelIds,
    modelOptionsJson: String(overrides.modelOptionsJson || "").trim() || ENV_CONFIG.modelOptionsJson,
    providerLabel
  };
}

function getProviderLabel(config) {
  return String(config.providerLabel || "").trim() || "Novai Direct API";
}

function readStoredAiConfig() {
  try {
    if (!fs.existsSync(AI_CONFIG_FILE)) {
      return {};
    }

    const rawValue = fs.readFileSync(AI_CONFIG_FILE, "utf8");
    const parsed = rawValue ? JSON.parse(rawValue) : {};
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function getRuntimeConfig() {
  return createRuntimeConfig(readStoredAiConfig());
}

function extractText(content) {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => extractText(item))
      .filter(Boolean)
      .join("\n\n")
      .trim();
  }

  if (content && typeof content === "object") {
    if (typeof content.text === "string") {
      return content.text.trim();
    }

    if (typeof content.content === "string") {
      return content.content.trim();
    }
  }

  return "";
}

function normalizeRole(role) {
  const normalized = String(role || "user").trim().toLowerCase();
  if (normalized === "system" || normalized === "assistant" || normalized === "user" || normalized === "tool") {
    return normalized;
  }
  return "user";
}

function normalizeMessages(messages) {
  return (Array.isArray(messages) ? messages : [])
    .map((message) => {
      const content = extractText(message?.content);
      if (!content) {
        return null;
      }

      return {
        role: normalizeRole(message?.role),
        content
      };
    })
    .filter(Boolean);
}

function normalizeModeId(value) {
  return String(value || "").trim();
}

function prettyModelTitle(id) {
  const raw = normalizeModeId(id);
  if (!raw) {
    return "";
  }

  if (/[^A-Za-z0-9._-]/.test(raw)) {
    return raw;
  }

  return raw
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => {
      if (/^\d+(\.\d+)?$/.test(part)) {
        return part;
      }

      if (part.length <= 3) {
        return part.toUpperCase();
      }

      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function normalizeModelOptions(options) {
  const unique = new Map();

  for (const option of Array.isArray(options) ? options : []) {
    if (!option) {
      continue;
    }

    const id = normalizeModeId(typeof option === "string" ? option : option.id || option.model || option.name);
    if (!id || unique.has(id)) {
      continue;
    }

    unique.set(id, {
      id,
      title: String(
        typeof option === "string"
          ? prettyModelTitle(option)
          : option.title || option.label || option.name || prettyModelTitle(id)
      ).trim(),
      description: String(typeof option === "string" ? "" : option.description || "").trim()
    });
  }

  return Array.from(unique.values());
}

function parseConfiguredModelOptions(config) {
  if (config.modelOptionsJson) {
    try {
      return normalizeModelOptions(JSON.parse(config.modelOptionsJson));
    } catch {
      // Fall through to modelIds.
    }
  }

  if (!config.modelIds) {
    return [];
  }

  return normalizeModelOptions(
    config.modelIds
      .split(/[\r\n,;]+/)
      .map((entry) => entry.trim())
      .filter(Boolean)
  );
}

function mergeModelOptions(...groups) {
  return normalizeModelOptions(groups.flat());
}

function getFallbackModelOptions(config) {
  const configuredOptions = parseConfiguredModelOptions(config);

  if (config.defaultModel) {
    return mergeModelOptions(
      configuredOptions,
      [{ id: config.defaultModel, title: prettyModelTitle(config.defaultModel) }]
    );
  }

  return configuredOptions;
}

function getCurrentDefaultModel(modelOptions, config) {
  return modelOptions.find((option) => option.id === config.defaultModel)
    || modelOptions[0]
    || null;
}

function getConfiguredModeOptions(config) {
  return getFallbackModelOptions(config);
}

function extractApiErrorMessage(payload, statusCode) {
  if (!payload) {
    return `Official API returned ${statusCode}.`;
  }

  const candidates = [
    payload.error?.message,
    payload.error?.detail,
    payload.message,
    payload.detail
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }

    if (Array.isArray(candidate) && candidate.length) {
      const joined = candidate.map((item) => String(item)).join(" ");
      if (joined.trim()) {
        return joined.trim();
      }
    }
  }

  return `Official API returned ${statusCode}.`;
}

async function fetchJson(url, options = {}, timeoutMs = 120000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    const rawText = await response.text();
    let parsed = null;

    if (rawText) {
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = null;
      }
    }

    if (!response.ok) {
      throw new Error(extractApiErrorMessage(parsed, response.status));
    }

    return parsed ?? {};
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Official API request timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function getModelCacheKey(config) {
  return [
    config.baseUrl,
    config.apiKey,
    config.modelsEndpoint,
    config.defaultModel,
    config.modelIds,
    config.modelOptionsJson
  ].join("::");
}

function isLikelyChatModelId(id) {
  const normalized = String(id || "").trim().toLowerCase();

  if (!normalized) {
    return false;
  }

  const blockedKeywords = [
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
  ];

  return !blockedKeywords.some((keyword) => normalized.includes(keyword));
}

async function resolveRemoteModels(config, force = false) {
  if (!config.apiKey) {
    return getFallbackModelOptions(config);
  }

  const cacheKey = getModelCacheKey(config);
  if (!force && cachedModels && cachedModelsKey === cacheKey && Date.now() - cachedAt < MODEL_CACHE_TTL_MS) {
    return cachedModels;
  }

  const modelsUrl = `${config.baseUrl}${config.modelsEndpoint}`;
  const payload = await fetchJson(modelsUrl, {
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      Accept: "application/json"
    }
  }, 15000);

  const rawModels = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.models)
      ? payload.models
      : [];

  const remoteOptions = normalizeModelOptions(
    rawModels.map((item) => ({
      id: item?.id || item?.model || item?.name,
      title: item?.id || item?.name || item?.model,
      description: item?.owned_by ? `owned by ${item.owned_by}` : ""
    }))
  );
  const filteredRemoteOptions = remoteOptions.filter((option) => isLikelyChatModelId(option.id));

  const configuredOptions = parseConfiguredModelOptions(config);
  const resolved = mergeModelOptions(
    configuredOptions.length ? configuredOptions : filteredRemoteOptions,
    filteredRemoteOptions.length ? filteredRemoteOptions : remoteOptions,
    config.defaultModel ? [{ id: config.defaultModel, title: prettyModelTitle(config.defaultModel) }] : []
  );

  cachedModels = resolved;
  cachedModelsKey = cacheKey;
  cachedAt = Date.now();
  return resolved;
}

function stripThinkingBlocks(text) {
  return String(text || "")
    .replace(/<think\b[^>]*>[\s\S]*?<\/think>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractAssistantContent(payload) {
  const direct = payload?.choices?.[0]?.message?.content;
  if (typeof direct === "string" && direct.trim()) {
    return stripThinkingBlocks(direct);
  }

  if (Array.isArray(direct)) {
    const joined = direct
      .map((item) => extractText(item))
      .filter(Boolean)
      .join("\n\n")
      .trim();
    if (joined) {
      return stripThinkingBlocks(joined);
    }
  }

  const altText = payload?.output_text;
  if (typeof altText === "string" && altText.trim()) {
    return stripThinkingBlocks(altText);
  }

  const altOutput = Array.isArray(payload?.output)
    ? payload.output
        .map((item) => extractText(item?.content || item?.text || item))
        .filter(Boolean)
        .join("\n\n")
        .trim()
    : "";

  if (altOutput) {
    return stripThinkingBlocks(altOutput);
  }

  return "";
}

async function sendChatCompletion(messages, requestedModel) {
  const config = getRuntimeConfig();
  const requestMessages = normalizeMessages(messages);
  if (!requestMessages.length) {
    throw new Error("No prompt content was provided.");
  }

  const modelOptions = await resolveRemoteModels(config);
  const fallbackModel = getCurrentDefaultModel(modelOptions, config);
  const chosenModel = normalizeModeId(requestedModel)
    || fallbackModel?.id
    || config.defaultModel;

  if (!config.apiKey) {
    throw new Error("Direct API is not configured yet. Paste the API key into the local-only AI panel first.");
  }

  if (!chosenModel) {
    throw new Error("No direct API model is configured.");
  }

  const endpoint = `${config.baseUrl}${config.chatEndpoint}`;
  const payload = await fetchJson(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      model: chosenModel,
      messages: requestMessages,
      stream: false
    })
  }, config.timeoutMs);

  const content = extractAssistantContent(payload);
  if (!content) {
    throw new Error("Direct API did not return any assistant text.");
  }

  const currentMode = modelOptions.find((option) => option.id === chosenModel)
    || { id: chosenModel, title: prettyModelTitle(chosenModel), description: "" };

  return {
    content,
    currentMode,
    modeOptions: mergeModelOptions(modelOptions, [currentMode]),
    provider: getProviderLabel(config)
  };
}

async function getStatusPayload() {
  const config = getRuntimeConfig();

  if (!config.apiKey) {
    const fallbackOptions = getConfiguredModeOptions(config);
    const fallbackMode = getCurrentDefaultModel(fallbackOptions, config);
    return {
      ok: false,
      model: fallbackMode?.id || "",
      modelLabel: fallbackMode?.title || "",
      models: fallbackOptions.map((option) => option.id),
      modelOptions: fallbackOptions,
      message: "Direct API is not configured.",
      details: "Paste the Novai API key into the local-only AI panel, or set AI_API_KEY in .env.",
      provider: getProviderLabel(config)
    };
  }

  try {
    const modelOptions = await resolveRemoteModels(config);
    const currentMode = getCurrentDefaultModel(modelOptions, config)
      || { id: config.defaultModel, title: prettyModelTitle(config.defaultModel), description: "" };

    return {
      ok: true,
      model: currentMode?.id || "",
      modelLabel: currentMode?.title || "",
      models: modelOptions.map((option) => option.id),
      modelOptions,
      message: "ready",
      provider: getProviderLabel(config)
    };
  } catch (error) {
    const fallbackOptions = getConfiguredModeOptions(config);
    const fallbackMode = getCurrentDefaultModel(fallbackOptions, config);
    return {
      ok: false,
      model: fallbackMode?.id || config.defaultModel,
      modelLabel: fallbackMode?.title || prettyModelTitle(config.defaultModel),
      models: fallbackOptions.map((option) => option.id),
      modelOptions: fallbackOptions,
      message: "Direct API is not reachable.",
      details: error instanceof Error ? error.message : String(error),
      provider: getProviderLabel(config)
    };
  }
}

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    jsonResponse(response, 404, { ok: false, error: "Not found" });
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/api/ai/status") {
    try {
      jsonResponse(response, 200, await getStatusPayload());
    } catch (error) {
      jsonResponse(response, 200, {
        ok: false,
        model: "",
        modelLabel: "",
        models: [],
        modelOptions: [],
        message: "AI bridge is not reachable.",
        details: error instanceof Error ? error.message : String(error),
        provider: ""
      });
    }
    return;
  }

  if (request.method === "POST" && request.url === "/api/ai/chat") {
    try {
      const rawBody = await readRequestBody(request);
      const payload = JSON.parse(rawBody || "{}");
      const result = await sendChatCompletion(payload.messages, payload.model);

      jsonResponse(response, 200, {
        ok: true,
        model: result.currentMode.id,
        modelLabel: result.currentMode.title,
        models: result.modeOptions.map((option) => option.id),
        modelOptions: result.modeOptions,
        provider: result.provider,
        message: {
          role: "assistant",
          content: result.content
        }
      });
    } catch (error) {
      jsonResponse(response, 502, {
        ok: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
    return;
  }

  jsonResponse(response, 404, { ok: false, error: "Not found" });
});

server.listen(PORT, HOST, () => {
  const config = getRuntimeConfig();
  console.log(`AI bridge running at http://${HOST}:${PORT}`);
  console.log(`AI config file: ${AI_CONFIG_FILE}`);
if (config.apiKey) {
  console.log(`Using ${getProviderLabel(config)} at ${config.baseUrl}`);
} else {
  console.log("AI bridge is waiting for a local direct API key.");
}
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    server.close(() => process.exit(0));
    await sleep(50);
  });
}
