const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const childProcess = require("node:child_process");
const { getDefaultUserDataRoot } = require("./platform_paths");

const HOST = process.env.LOCAL_SITE_HOST || "127.0.0.1";
const PORT = Number.parseInt(process.env.LOCAL_SITE_PORT || "8080", 10);
const ROOT_DIR = path.resolve(__dirname);
const ROOT_PREFIX = `${ROOT_DIR}${path.sep}`;
const AI_TARGET_HOST = process.env.AI_PROXY_HOST || "127.0.0.1";
const AI_TARGET_PORT = Number.parseInt(process.env.AI_PROXY_PORT || process.env.AI_BRIDGE_PORT || "8765", 10);
const PUBLISHED_OVERRIDES_FILE = path.join(ROOT_DIR, "published-overrides.json");
const LEGACY_USER_DATA_FILE = path.join(ROOT_DIR, "study-user-data.json");
const USER_DATA_ROOT = getDefaultUserDataRoot("GermanStudy");
const USER_DATA_DIR = path.join(USER_DATA_ROOT, "secure-data");
const USER_DATA_FILE = path.join(USER_DATA_DIR, "study-user-data.json");
const USER_DATA_BACKUP_FILE = path.join(USER_DATA_DIR, "study-user-data.backup.json");
const AI_CONFIG_FILE = path.join(USER_DATA_DIR, "ai-api-config.json");
const AI_CONFIG_BACKUP_FILE = path.join(USER_DATA_DIR, "ai-api-config.backup.json");
const PUBLISHED_SITE_DIR = path.join(USER_DATA_ROOT, "published-site");
const PUBLISHABLE_SITE_FILES = [
  "index.html",
  "list.html",
  "detail.html",
  "styles.css",
  "translations.js",
  "grammar-data.js",
  "a1-outline.js",
  "a1-subunits.js",
  "script.js",
  "progress.js",
  "published-overrides.json"
];
const SESSION_COOKIE_NAME = "german_study_session";
const PUBLIC_ENTRY_COOKIE_NAME = "german_study_public_home";
const PUBLIC_ENTRY_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 6;
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const PASSWORD_ITERATIONS = 120000;
const DEFAULT_AI_API_BASE_URL = String(process.env.AI_API_BASE_URL || "https://us.novaiapi.com/v1").trim() || "https://us.novaiapi.com/v1";
const DEFAULT_AI_MODEL = String(process.env.AI_API_DEFAULT_MODEL || "[次]grok-420-fast").trim() || "[次]grok-420-fast";

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function getCorsHeaders(request) {
  const origin = String(request?.headers?.origin || "").trim();
  const allowOrigin = origin || "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Study-Session",
    "Access-Control-Allow-Credentials": "true",
    Vary: "Origin"
  };
}

function sendJson(request, response, statusCode, payload, extraHeaders = {}) {
  const body = Buffer.from(JSON.stringify(payload), "utf8");
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": body.length,
    "Cache-Control": "no-store",
    ...getCorsHeaders(request),
    ...extraHeaders
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

function readPublishedOverrides() {
  try {
    if (!fs.existsSync(PUBLISHED_OVERRIDES_FILE)) {
      return {};
    }

    const rawValue = fs.readFileSync(PUBLISHED_OVERRIDES_FILE, "utf8");
    const parsed = rawValue ? JSON.parse(rawValue) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writePublishedOverrides(store) {
  fs.writeFileSync(
    PUBLISHED_OVERRIDES_FILE,
    JSON.stringify(store && typeof store === "object" ? store : {}, null, 2),
    "utf8"
  );
}

function createUserDataStore() {
  return {
    users: {},
    sessions: {}
  };
}

function ensureUserDataDirectory() {
  fs.mkdirSync(USER_DATA_DIR, { recursive: true });
}

function ensurePublishedSiteDirectory() {
  fs.mkdirSync(PUBLISHED_SITE_DIR, { recursive: true });
}

function publishSiteSnapshot() {
  ensurePublishedSiteDirectory();

  for (const relativePath of PUBLISHABLE_SITE_FILES) {
    const sourcePath = path.join(ROOT_DIR, relativePath);
    const destinationPath = path.join(PUBLISHED_SITE_DIR, relativePath);

    if (!fs.existsSync(sourcePath)) {
      if (fs.existsSync(destinationPath)) {
        fs.unlinkSync(destinationPath);
      }
      continue;
    }

    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    fs.copyFileSync(sourcePath, destinationPath);
  }

  return {
    ok: true,
    publishedAt: new Date().toISOString(),
    destination: PUBLISHED_SITE_DIR
  };
}

function ensurePublishedSiteSnapshot() {
  const indexPath = path.join(PUBLISHED_SITE_DIR, "index.html");

  if (!fs.existsSync(indexPath)) {
    publishSiteSnapshot();
  }
}

function migrateLegacyUserDataIfNeeded() {
  if (!fs.existsSync(LEGACY_USER_DATA_FILE) || fs.existsSync(USER_DATA_FILE)) {
    return;
  }

  ensureUserDataDirectory();
  fs.copyFileSync(LEGACY_USER_DATA_FILE, USER_DATA_FILE);

  if (!fs.existsSync(USER_DATA_BACKUP_FILE)) {
    fs.copyFileSync(LEGACY_USER_DATA_FILE, USER_DATA_BACKUP_FILE);
  }

  try {
    fs.unlinkSync(LEGACY_USER_DATA_FILE);
  } catch {
    // Keep the legacy copy if Windows is still holding the file.
  }
}

function readUserDataStore() {
  try {
    ensureUserDataDirectory();
    migrateLegacyUserDataIfNeeded();

    if (!fs.existsSync(USER_DATA_FILE)) {
      return createUserDataStore();
    }

    const rawValue = fs.readFileSync(USER_DATA_FILE, "utf8");
    const parsed = rawValue ? JSON.parse(rawValue) : createUserDataStore();

    return {
      users: parsed?.users && typeof parsed.users === "object" ? parsed.users : {},
      sessions: parsed?.sessions && typeof parsed.sessions === "object" ? parsed.sessions : {}
    };
  } catch {
    return createUserDataStore();
  }
}

function writeUserDataStore(store) {
  ensureUserDataDirectory();
  migrateLegacyUserDataIfNeeded();

  const serialized = JSON.stringify(
    store && typeof store === "object" ? store : createUserDataStore(),
    null,
    2
  );
  const tempFile = `${USER_DATA_FILE}.tmp`;

  if (fs.existsSync(USER_DATA_FILE)) {
    fs.copyFileSync(USER_DATA_FILE, USER_DATA_BACKUP_FILE);
  }

  fs.writeFileSync(tempFile, serialized, "utf8");

  if (fs.existsSync(USER_DATA_FILE)) {
    fs.unlinkSync(USER_DATA_FILE);
  }

  fs.renameSync(tempFile, USER_DATA_FILE);
}

function createDefaultAiConfig() {
  return {
    baseUrl: DEFAULT_AI_API_BASE_URL,
    apiKey: String(process.env.AI_API_KEY || "").trim(),
    defaultModel: DEFAULT_AI_MODEL,
    modelIds: String(process.env.AI_MODEL_IDS || "").trim(),
    providerLabel: String(process.env.AI_PROVIDER_LABEL || "Novai Direct API").trim() || "Novai Direct API"
  };
}

function sanitizeAiConfigPayload(config) {
  const defaults = createDefaultAiConfig();
  const source = config && typeof config === "object" && !Array.isArray(config) ? config : {};

  return {
    baseUrl: String(source.baseUrl || "").trim() || defaults.baseUrl,
    apiKey: String(source.apiKey || "").trim(),
    defaultModel: String(source.defaultModel || "").trim() || defaults.defaultModel,
    modelIds: String(source.modelIds || "").trim(),
    providerLabel: String(source.providerLabel || "").trim() || defaults.providerLabel
  };
}

function readAiConfig() {
  try {
    ensureUserDataDirectory();

    if (!fs.existsSync(AI_CONFIG_FILE)) {
      return createDefaultAiConfig();
    }

    const rawValue = fs.readFileSync(AI_CONFIG_FILE, "utf8");
    const parsed = rawValue ? JSON.parse(rawValue) : {};
    return sanitizeAiConfigPayload(parsed);
  } catch {
    return createDefaultAiConfig();
  }
}

function writeAiConfig(config) {
  ensureUserDataDirectory();

  const sanitized = sanitizeAiConfigPayload(config);
  const serialized = JSON.stringify(sanitized, null, 2);
  const tempFile = `${AI_CONFIG_FILE}.tmp`;

  if (fs.existsSync(AI_CONFIG_FILE)) {
    fs.copyFileSync(AI_CONFIG_FILE, AI_CONFIG_BACKUP_FILE);
  }

  fs.writeFileSync(tempFile, serialized, "utf8");

  if (fs.existsSync(AI_CONFIG_FILE)) {
    fs.unlinkSync(AI_CONFIG_FILE);
  }

  fs.renameSync(tempFile, AI_CONFIG_FILE);
  return sanitized;
}

function parseCookies(request) {
  return String(request?.headers?.cookie || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((result, part) => {
      const separatorIndex = part.indexOf("=");

      if (separatorIndex === -1) {
        return result;
      }

      const key = decodeURIComponent(part.slice(0, separatorIndex).trim());
      const value = decodeURIComponent(part.slice(separatorIndex + 1).trim());
      result[key] = value;
      return result;
    }, {});
}

function getSessionTokenFromRequest(request) {
  const cookies = parseCookies(request);
  const cookieToken = cookies[SESSION_COOKIE_NAME];

  if (cookieToken) {
    return cookieToken;
  }

  const headerToken = String(request?.headers?.["x-study-session"] || "").trim();
  return headerToken || "";
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, 32, "sha256").toString("hex");
}

function normalizeUsername(username) {
  return String(username || "").trim();
}

function validateCredentials(username, password) {
  const normalizedUsername = normalizeUsername(username);
  const normalizedPassword = String(password || "");

  if (!/^[A-Za-z0-9_.-]{3,32}$/.test(normalizedUsername)) {
    return {
      ok: false,
      error: "Username must be 3-32 characters and use letters, numbers, dot, dash, or underscore."
    };
  }

  if (normalizedPassword.length < 4 || normalizedPassword.length > 128) {
    return {
      ok: false,
      error: "Password must be between 4 and 128 characters."
    };
  }

  return {
    ok: true,
    username: normalizedUsername,
    password: normalizedPassword
  };
}

function createEmptyProgress() {
  return {
    lastUnit: null,
    units: {}
  };
}

function sanitizeProgressPayload(progress) {
  const units = progress?.units && typeof progress.units === "object" ? progress.units : {};
  const sanitizedUnits = Object.fromEntries(
    Object.entries(units).filter(([unitKey, value]) => (
      String(unitKey || "").trim()
      && value
      && typeof value === "object"
      && !Array.isArray(value)
    ))
  );

  return {
    lastUnit: progress?.lastUnit && typeof progress.lastUnit === "object" ? progress.lastUnit : null,
    units: sanitizedUnits
  };
}

function buildSessionCookie(token) {
  return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
}

function buildClearedSessionCookie() {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

function pruneExpiredSessions(store) {
  const now = Date.now();
  let changed = false;

  for (const [token, session] of Object.entries(store.sessions || {})) {
    const expiresAt = Date.parse(session?.expiresAt || "");

    if (!expiresAt || expiresAt <= now) {
      delete store.sessions[token];
      changed = true;
    }
  }

  if (changed) {
    writeUserDataStore(store);
  }
}

function getAuthenticatedUser(request, store) {
  pruneExpiredSessions(store);

  const token = getSessionTokenFromRequest(request);

  if (!token) {
    return null;
  }

  const session = store.sessions?.[token];

  if (!session?.usernameKey) {
    return null;
  }

  const user = store.users?.[session.usernameKey];

  if (!user) {
    delete store.sessions[token];
    writeUserDataStore(store);
    return null;
  }

  return {
    token,
    usernameKey: session.usernameKey,
    user
  };
}

function createUserRecord(username, password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const createdAt = new Date().toISOString();

  return {
    username,
    salt,
    passwordHash: hashPassword(password, salt),
    createdAt,
    updatedAt: createdAt,
    progress: createEmptyProgress()
  };
}

function createSessionForUser(store, usernameKey) {
  const token = crypto.randomBytes(24).toString("hex");
  const now = Date.now();

  store.sessions[token] = {
    usernameKey,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + (SESSION_MAX_AGE_SECONDS * 1000)).toISOString()
  };

  return token;
}

function getRequestHostName(request) {
  return String(request?.headers?.host || "")
    .split(":")[0]
    .trim()
    .toLowerCase();
}

function isLocalHostName(hostName) {
  return hostName === "127.0.0.1"
    || hostName === "localhost"
    || hostName === "::1"
    || hostName === "[::1]";
}

function isLocalRequest(request) {
  return isLocalHostName(getRequestHostName(request));
}

function getRequestPathname(requestOrUrl) {
  const rawValue = typeof requestOrUrl === "string"
    ? requestOrUrl
    : String(requestOrUrl?.url || "/");

  try {
    const parsed = new URL(rawValue, "http://local-request");
    return decodeURIComponent(parsed.pathname || "/");
  } catch {
    return decodeURIComponent(String(rawValue || "/").split("?")[0] || "/");
  }
}

function hasPublicHomeCookie(request) {
  return parseCookies(request)[PUBLIC_ENTRY_COOKIE_NAME] === "1";
}

function buildPublicHomeCookie() {
  return `${PUBLIC_ENTRY_COOKIE_NAME}=1; Path=/; SameSite=Lax; Max-Age=${PUBLIC_ENTRY_COOKIE_MAX_AGE_SECONDS}`;
}

function hasSameHostReferrer(request) {
  const referrer = String(request?.headers?.referer || request?.headers?.referrer || "").trim();

  if (!referrer) {
    return false;
  }

  try {
    const parsed = new URL(referrer);
    return parsed.hostname.toLowerCase() === getRequestHostName(request);
  } catch {
    return false;
  }
}

function shouldRedirectPublicEntryToHome(request) {
  if (isLocalRequest(request)) {
    return false;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return false;
  }

  const pathname = getRequestPathname(request).toLowerCase();
  const isInternalHtmlPage = pathname === "/list.html" || pathname === "/detail.html";

  if (!isInternalHtmlPage) {
    return false;
  }

  return !hasSameHostReferrer(request) && !hasPublicHomeCookie(request);
}

function sendHomeRedirect(request, response) {
  response.writeHead(302, {
    Location: "/",
    "Cache-Control": "no-store",
    ...getCorsHeaders(request)
  });
  response.end();
}

function getStaticRootDirectory(request) {
  if (isLocalRequest(request)) {
    return ROOT_DIR;
  }

  ensurePublishedSiteSnapshot();
  return PUBLISHED_SITE_DIR;
}

function resolveFilePath(baseDir, urlPath) {
  const pathname = decodeURIComponent(urlPath.split("?")[0] || "/");
  const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const basePrefix = `${baseDir}${path.sep}`;
  const absolutePath = path.resolve(baseDir, relativePath);

  if (absolutePath !== baseDir && !absolutePath.startsWith(basePrefix)) {
    return null;
  }

  return absolutePath;
}

function serveFile(request, requestPath, response) {
  const filePath = resolveFilePath(getStaticRootDirectory(request), requestPath);

  if (!filePath) {
    sendJson(request, response, 403, { ok: false, error: "Forbidden" });
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        sendJson(request, response, 404, { ok: false, error: "Not found" });
        return;
      }

      sendJson(request, response, 500, { ok: false, error: error.message });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const responseHeaders = {
      "Content-Type": CONTENT_TYPES[extension] || "application/octet-stream",
      "Content-Length": content.length,
      "Cache-Control": "no-store",
      ...getCorsHeaders(request)
    };
    const pathname = getRequestPathname(requestPath).toLowerCase();

    if (!isLocalRequest(request) && (pathname === "/" || pathname === "/index.html")) {
      responseHeaders["Set-Cookie"] = buildPublicHomeCookie();
    }

    response.writeHead(200, {
      ...responseHeaders
    });
    response.end(content);
  });
}

function requireLocalRequest(request, response) {
  if (isLocalRequest(request)) {
    return true;
  }

  sendJson(request, response, 403, {
    ok: false,
    error: "This action is only available from the local computer."
  });
  return false;
}

function isTrustedLocalOrigin(request) {
  const origin = String(request?.headers?.origin || "").trim();

  if (!origin || origin === "null") {
    return true;
  }

  try {
    const parsed = new URL(origin);
    return isLocalHostName(String(parsed.hostname || "").toLowerCase());
  } catch {
    return false;
  }
}

function requireTrustedLocalControlRequest(request, response) {
  if (!requireLocalRequest(request, response)) {
    return false;
  }

  if (isTrustedLocalOrigin(request)) {
    return true;
  }

  sendJson(request, response, 403, {
    ok: false,
    error: "This local-only action must come from your local website or local file."
  });
  return false;
}

function stopAiBridgeByPort(port) {
  return new Promise((resolve, reject) => {
    if (process.platform === "win32") {
      const query = childProcess.spawn("powershell.exe", [
        "-NoProfile",
        "-Command",
        `Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique`
      ], {
        windowsHide: true,
        stdio: ["ignore", "pipe", "pipe"]
      });

      let stdout = "";
      let stderr = "";
      query.stdout.on("data", (chunk) => {
        stdout += String(chunk);
      });
      query.stderr.on("data", (chunk) => {
        stderr += String(chunk);
      });
      query.on("error", reject);
      query.on("close", () => {
        const processIds = stdout
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter((line) => /^\d+$/.test(line));

        if (!processIds.length) {
          resolve();
          return;
        }

        const killer = childProcess.spawn("powershell.exe", [
          "-NoProfile",
          "-Command",
          `Stop-Process -Id ${processIds.join(",")} -Force`
        ], {
          windowsHide: true,
          stdio: ["ignore", "ignore", "pipe"]
        });

        let killStderr = "";
        killer.stderr.on("data", (chunk) => {
          killStderr += String(chunk);
        });
        killer.on("error", reject);
        killer.on("close", (killCode) => {
          if (killCode === 0) {
            resolve();
            return;
          }

          reject(new Error(killStderr.trim() || stderr.trim() || "Failed to stop the current AI bridge."));
        });
      });
      return;
    }

    const lookup = childProcess.spawn("sh", [
      "-lc",
      `lsof -ti tcp:${port} | xargs -r kill -9`
    ], {
      stdio: "ignore"
    });

    lookup.on("error", reject);
    lookup.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error("Failed to stop the current AI bridge."));
    });
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForAiBridgeReady(timeoutMs = 12000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const attempt = () => {
      const probe = http.request({
        hostname: AI_TARGET_HOST,
        port: AI_TARGET_PORT,
        method: "GET",
        path: "/api/ai/status",
        timeout: 2000
      }, (probeResponse) => {
        probeResponse.resume();
        resolve();
      });

      probe.on("error", () => {
        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error("The AI bridge did not come back online in time."));
          return;
        }

        setTimeout(attempt, 350);
      });

      probe.on("timeout", () => {
        probe.destroy(new Error("timeout"));
      });

      probe.end();
    };

    attempt();
  });
}

async function restartAiBridge() {
  try {
    await stopAiBridgeByPort(AI_TARGET_PORT);
  } catch {
    // It is fine if nothing was listening yet.
  }

  await wait(300);

  const child = childProcess.spawn(process.execPath, [path.join(ROOT_DIR, "local_ai_bridge.js")], {
    cwd: ROOT_DIR,
    detached: true,
    windowsHide: true,
    stdio: "ignore",
    env: {
      ...process.env,
      AI_BRIDGE_HOST: AI_TARGET_HOST,
      AI_BRIDGE_PORT: String(AI_TARGET_PORT)
    }
  });
  child.unref();

  await waitForAiBridgeReady();
}

function proxyToAi(request, response) {
  const proxyRequest = http.request({
    hostname: AI_TARGET_HOST,
    port: AI_TARGET_PORT,
    method: request.method,
    path: request.url,
    headers: {
      ...request.headers,
      host: `${AI_TARGET_HOST}:${AI_TARGET_PORT}`
    }
  }, (proxyResponse) => {
    response.writeHead(proxyResponse.statusCode || 502, {
      ...proxyResponse.headers,
      "Cache-Control": "no-store"
    });
    proxyResponse.pipe(response);
  });

  proxyRequest.on("error", (error) => {
    sendJson(request, response, 502, {
      ok: false,
      error: `AI bridge proxy failed: ${error.message}`
    });
  });

  request.pipe(proxyRequest);
}

const server = http.createServer((request, response) => {
  if (!request.url) {
    sendJson(request, response, 400, { ok: false, error: "Bad request" });
    return;
  }

  if (request.method === "OPTIONS" && request.url.startsWith("/api/")) {
    response.writeHead(204, {
      ...getCorsHeaders(request)
    });
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/__health") {
    sendJson(request, response, 200, { ok: true, message: "local site ready" });
    return;
  }

  if (request.url.startsWith("/api/ai/")) {
    proxyToAi(request, response);
    return;
  }

  if (request.method === "GET" && request.url === "/api/editor/published") {
    if (!requireTrustedLocalControlRequest(request, response)) {
      return;
    }

    sendJson(request, response, 200, {
      ok: true,
      store: readPublishedOverrides()
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/site/publish") {
    if (!requireTrustedLocalControlRequest(request, response)) {
      return;
    }

    try {
      const result = publishSiteSnapshot();
      sendJson(request, response, 200, result);
    } catch (error) {
      sendJson(request, response, 500, {
        ok: false,
        error: error.message
      });
    }
    return;
  }

  if (request.method === "GET" && request.url === "/api/local/ai-config") {
    if (!requireTrustedLocalControlRequest(request, response)) {
      return;
    }

    sendJson(request, response, 200, {
      ok: true,
      config: readAiConfig()
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/local/ai-config") {
    if (!requireTrustedLocalControlRequest(request, response)) {
      return;
    }

    readRequestBody(request)
      .then(async (rawBody) => {
        const payload = JSON.parse(rawBody || "{}");
        const config = writeAiConfig(payload.config || {});
        await restartAiBridge();

        sendJson(request, response, 200, {
          ok: true,
          config,
          restarted: true
        });
      })
      .catch((error) => {
        sendJson(request, response, 500, { ok: false, error: error.message });
      });
    return;
  }

  if (request.method === "GET" && request.url === "/api/auth/session") {
    const store = readUserDataStore();
    const auth = getAuthenticatedUser(request, store);

    sendJson(request, response, 200, {
      ok: true,
      authenticated: Boolean(auth),
      user: auth ? { username: auth.user.username } : null,
      sessionToken: auth?.token || null
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/auth/register") {
    readRequestBody(request)
      .then((rawBody) => {
        const payload = JSON.parse(rawBody || "{}");
        const validation = validateCredentials(payload.username, payload.password);

        if (!validation.ok) {
          sendJson(request, response, 400, { ok: false, error: validation.error });
          return;
        }

        const store = readUserDataStore();
        const usernameKey = validation.username.toLowerCase();

        if (store.users[usernameKey]) {
          sendJson(request, response, 409, { ok: false, error: "This username already exists." });
          return;
        }

        store.users[usernameKey] = createUserRecord(validation.username, validation.password);
        const token = createSessionForUser(store, usernameKey);
        writeUserDataStore(store);

        sendJson(
          request,
          response,
          200,
          {
            ok: true,
            user: { username: store.users[usernameKey].username },
            sessionToken: token
          },
          { "Set-Cookie": buildSessionCookie(token) }
        );
      })
      .catch((error) => {
        sendJson(request, response, 500, { ok: false, error: error.message });
      });
    return;
  }

  if (request.method === "POST" && request.url === "/api/auth/login") {
    readRequestBody(request)
      .then((rawBody) => {
        const payload = JSON.parse(rawBody || "{}");
        const validation = validateCredentials(payload.username, payload.password);

        if (!validation.ok) {
          sendJson(request, response, 400, { ok: false, error: validation.error });
          return;
        }

        const store = readUserDataStore();
        const usernameKey = validation.username.toLowerCase();
        const user = store.users[usernameKey];

        if (!user || hashPassword(validation.password, user.salt) !== user.passwordHash) {
          sendJson(request, response, 401, { ok: false, error: "Username or password is incorrect." });
          return;
        }

        const token = createSessionForUser(store, usernameKey);
        user.updatedAt = new Date().toISOString();
        writeUserDataStore(store);

        sendJson(
          request,
          response,
          200,
          {
            ok: true,
            user: { username: user.username },
            sessionToken: token
          },
          { "Set-Cookie": buildSessionCookie(token) }
        );
      })
      .catch((error) => {
        sendJson(request, response, 500, { ok: false, error: error.message });
      });
    return;
  }

  if (request.method === "POST" && request.url === "/api/auth/logout") {
    const store = readUserDataStore();
    const auth = getAuthenticatedUser(request, store);

    if (auth?.token) {
      delete store.sessions[auth.token];
      writeUserDataStore(store);
    }

    sendJson(
      request,
      response,
      200,
      { ok: true },
      { "Set-Cookie": buildClearedSessionCookie() }
    );
    return;
  }

  if (request.method === "GET" && request.url === "/api/progress") {
    const store = readUserDataStore();
    const auth = getAuthenticatedUser(request, store);

    if (!auth) {
      sendJson(request, response, 401, { ok: false, error: "Authentication required." });
      return;
    }

    sendJson(request, response, 200, {
      ok: true,
      progress: sanitizeProgressPayload(auth.user.progress || createEmptyProgress())
    });
    return;
  }

  if (request.method === "POST" && request.url === "/api/progress/save") {
    readRequestBody(request)
      .then((rawBody) => {
        const payload = JSON.parse(rawBody || "{}");
        const progress = sanitizeProgressPayload(payload.progress || {});
        const store = readUserDataStore();
        const auth = getAuthenticatedUser(request, store);

        if (!auth) {
          sendJson(request, response, 401, { ok: false, error: "Authentication required." });
          return;
        }

        store.users[auth.usernameKey].progress = progress;
        store.users[auth.usernameKey].updatedAt = new Date().toISOString();
        writeUserDataStore(store);

        sendJson(request, response, 200, {
          ok: true,
          progress
        });
      })
      .catch((error) => {
        sendJson(request, response, 500, { ok: false, error: error.message });
      });
    return;
  }

  if (request.method === "POST" && request.url === "/api/editor/publish") {
    if (!requireTrustedLocalControlRequest(request, response)) {
      return;
    }

    readRequestBody(request)
      .then((rawBody) => {
        const payload = JSON.parse(rawBody || "{}");
        const pageKey = String(payload.pageKey || "").trim();
        const overrides = payload.overrides;

        if (!pageKey || !overrides || typeof overrides !== "object" || Array.isArray(overrides)) {
          sendJson(request, response, 400, { ok: false, error: "A pageKey and overrides object are required." });
          return;
        }

        const store = readPublishedOverrides();
        if (Object.keys(overrides).length === 0) {
          delete store[pageKey];
        } else {
          store[pageKey] = overrides;
        }
        writePublishedOverrides(store);
        sendJson(request, response, 200, { ok: true, pageKey, store });
      })
      .catch((error) => {
        sendJson(request, response, 500, { ok: false, error: error.message });
      });
    return;
  }

  if (request.method === "POST" && request.url === "/api/editor/publish-all") {
    if (!requireTrustedLocalControlRequest(request, response)) {
      return;
    }

    readRequestBody(request)
      .then((rawBody) => {
        const payload = JSON.parse(rawBody || "{}");
        const incomingStore = payload.store;

        if (!incomingStore || typeof incomingStore !== "object" || Array.isArray(incomingStore)) {
          sendJson(request, response, 400, { ok: false, error: "A store object is required." });
          return;
        }

        const nextStore = Object.fromEntries(
          Object.entries(incomingStore).filter(([pageKey, overrides]) => (
            String(pageKey || "").trim()
            && overrides
            && typeof overrides === "object"
            && !Array.isArray(overrides)
            && Object.keys(overrides).length > 0
          ))
        );

        writePublishedOverrides(nextStore);
        sendJson(request, response, 200, {
          ok: true,
          pageCount: Object.keys(nextStore).length,
          store: nextStore
        });
      })
      .catch((error) => {
        sendJson(request, response, 500, { ok: false, error: error.message });
      });
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    sendJson(request, response, 405, { ok: false, error: "Method not allowed" });
    return;
  }

  if (shouldRedirectPublicEntryToHome(request)) {
    sendHomeRedirect(request, response);
    return;
  }

  serveFile(request, request.url, response);
});

server.listen(PORT, HOST, () => {
  console.log(`Local site server running at http://${HOST}:${PORT}`);
});
