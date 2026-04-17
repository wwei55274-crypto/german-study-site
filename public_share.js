const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const https = require("node:https");
const path = require("node:path");
const os = require("node:os");

const ROOT_DIR = __dirname;
const PUBLIC_URL_FILE = path.join(ROOT_DIR, "public-url.txt");
const CLOUDflared_LOCAL_PATH = path.join(ROOT_DIR, "tools", process.platform === "win32" ? "cloudflared.exe" : "cloudflared");
const QUICK_TUNNEL_TARGET = "http://127.0.0.1:8080";
const BRIDGE_STATUS_URL = "http://127.0.0.1:8765/api/ai/status";
const SITE_STATUS_URL = "http://127.0.0.1:8080/__health";
const QUICK_TUNNEL_HOME = path.join(ROOT_DIR, ".runtime", "quick-tunnel-home");

const managedChildren = [];

function log(message) {
  console.log(`[share] ${message}`);
}

function fileExists(filePath) {
  try {
    return Boolean(filePath) && fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function parseSimpleEnvFile(filePath) {
  if (!fileExists(filePath)) {
    return {};
  }

  const result = {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const envMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);

    if (!envMatch) {
      continue;
    }

    let [, key, value] = envMatch;
    value = value.trim();

    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

function parseBatEnvFile(filePath) {
  if (!fileExists(filePath)) {
    return {};
  }

  const result = {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith("::") || /^@?echo\s+/i.test(line) || /^rem\s+/i.test(line)) {
      continue;
    }

    const quotedMatch = line.match(/^set\s+"([^=]+)=(.*)"$/i);
    const plainMatch = line.match(/^set\s+([^=]+)=(.*)$/i);
    const match = quotedMatch || plainMatch;

    if (!match) {
      continue;
    }

    const key = String(match[1] || "").trim();
    const value = String(match[2] || "").trim();

    if (key) {
      result[key] = value;
    }
  }

  return result;
}

function buildRuntimeEnv() {
  const fileEnv = {
    ...parseSimpleEnvFile(path.join(ROOT_DIR, ".env")),
    ...parseBatEnvFile(path.join(ROOT_DIR, ".env.bat"))
  };

  const runtimeEnv = {
    ...fileEnv,
    ...process.env
  };

  runtimeEnv.AI_BRIDGE_HOST = runtimeEnv.AI_BRIDGE_HOST || "127.0.0.1";
  runtimeEnv.AI_BRIDGE_PORT = runtimeEnv.AI_BRIDGE_PORT || "8765";
  runtimeEnv.LOCAL_SITE_HOST = runtimeEnv.LOCAL_SITE_HOST || "127.0.0.1";
  runtimeEnv.LOCAL_SITE_PORT = runtimeEnv.LOCAL_SITE_PORT || "8080";
  runtimeEnv.AI_PROXY_HOST = runtimeEnv.AI_PROXY_HOST || runtimeEnv.AI_BRIDGE_HOST;
  runtimeEnv.AI_PROXY_PORT = runtimeEnv.AI_PROXY_PORT || runtimeEnv.AI_BRIDGE_PORT;

  return runtimeEnv;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

async function isUrlReady(url) {
  try {
    await fetchJson(url);
    return true;
  } catch {
    return false;
  }
}

async function waitForUrl(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    if (await isUrlReady(url)) {
      return true;
    }

    await delay(500);
  }

  return false;
}

function prefixOutput(stream, prefix) {
  let buffered = "";
  stream.on("data", (chunk) => {
    buffered += chunk.toString("utf8");
    const parts = buffered.split(/\r?\n/);
    buffered = parts.pop() || "";

    for (const part of parts) {
      if (part.trim()) {
        console.log(`${prefix}${part}`);
      }
    }
  });
}

function spawnManagedProcess(name, scriptName, env) {
  const child = spawn(process.execPath, [path.join(ROOT_DIR, scriptName)], {
    cwd: ROOT_DIR,
    env,
    stdio: ["ignore", "pipe", "pipe"]
  });

  managedChildren.push(child);
  prefixOutput(child.stdout, `[${name}] `);
  prefixOutput(child.stderr, `[${name}] `);

  child.on("exit", (code) => {
    console.log(`[${name}] exited with code ${code ?? "null"}`);
  });

  return child;
}

function commandPath(command) {
  const lookup = spawnSync(process.platform === "win32" ? "where.exe" : "which", [command], {
    cwd: ROOT_DIR,
    encoding: "utf8"
  });

  if (lookup.status !== 0) {
    return "";
  }

  const firstLine = String(lookup.stdout || "").split(/\r?\n/).map((line) => line.trim()).find(Boolean);
  return firstLine || "";
}

function downloadFile(url, destinationPath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      reject(new Error("Too many redirects while downloading cloudflared."));
      return;
    }

    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });

    const request = https.get(url, {
      headers: {
        "User-Agent": "codex-share-setup"
      }
    }, (response) => {
      if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        downloadFile(response.headers.location, destinationPath, redirectCount + 1).then(resolve, reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with HTTP ${response.statusCode || "unknown"}.`));
        return;
      }

      const fileStream = fs.createWriteStream(destinationPath);
      response.pipe(fileStream);

      fileStream.on("finish", () => {
        fileStream.close(() => resolve(destinationPath));
      });

      fileStream.on("error", reject);
    });

    request.on("error", reject);
  });
}

async function ensureCloudflared(runtimeEnv) {
  if (fileExists(runtimeEnv.CLOUDFLARED_PATH)) {
    return runtimeEnv.CLOUDFLARED_PATH;
  }

  if (fileExists(CLOUDflared_LOCAL_PATH)) {
    return CLOUDflared_LOCAL_PATH;
  }

  const globalPath = commandPath("cloudflared");

  if (globalPath) {
    return globalPath;
  }

  if (process.platform !== "win32") {
    throw new Error("cloudflared is not installed. Install it first or set CLOUDFLARED_PATH.");
  }

  log("cloudflared not found. Downloading a local copy...");
  const downloadUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe";
  await downloadFile(downloadUrl, CLOUDflared_LOCAL_PATH);
  return CLOUDflared_LOCAL_PATH;
}

async function ensureBridge(runtimeEnv) {
  if (await isUrlReady(BRIDGE_STATUS_URL)) {
    log("Using the existing local AI bridge on port 8765.");
    return null;
  }

  log("Starting the local AI bridge...");
  spawnManagedProcess("bridge", "local_ai_bridge.js", runtimeEnv);

  if (!await waitForUrl(BRIDGE_STATUS_URL, 30000)) {
    throw new Error("The local AI bridge did not become ready in time.");
  }

  return true;
}

async function ensureSite(runtimeEnv) {
  if (await isUrlReady(SITE_STATUS_URL)) {
    log("Using the existing local website server on port 8080.");
    return null;
  }

  log("Starting the local website server...");
  spawnManagedProcess("site", "local_site_server.js", runtimeEnv);

  if (!await waitForUrl(SITE_STATUS_URL, 15000)) {
    throw new Error("The local website server did not become ready in time.");
  }

  return true;
}

function cleanup() {
  for (const child of managedChildren.splice(0)) {
    if (!child.killed) {
      child.kill();
    }
  }
}

async function startQuickTunnel(cloudflaredPath) {
  fs.mkdirSync(QUICK_TUNNEL_HOME, { recursive: true });
  fs.writeFileSync(PUBLIC_URL_FILE, "", "utf8");

  return new Promise((resolve, reject) => {
    const env = {
      ...process.env,
      HOME: QUICK_TUNNEL_HOME,
      USERPROFILE: QUICK_TUNNEL_HOME
    };

    const child = spawn(cloudflaredPath, [
      "tunnel",
      "--url",
      QUICK_TUNNEL_TARGET,
      "--no-autoupdate"
    ], {
      cwd: ROOT_DIR,
      env,
      stdio: ["ignore", "pipe", "pipe"]
    });

    managedChildren.push(child);

    let resolved = false;
    const handleChunk = (prefix, chunk) => {
      const text = chunk.toString("utf8");
      process.stdout.write(`${prefix}${text}`);

      const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);

      if (match && !resolved) {
        resolved = true;
        fs.writeFileSync(PUBLIC_URL_FILE, `${match[0]}\n`, "utf8");
        resolve({ child, url: match[0] });
      }
    };

    child.stdout.on("data", (chunk) => handleChunk("[tunnel] ", chunk));
    child.stderr.on("data", (chunk) => handleChunk("[tunnel] ", chunk));

    child.on("exit", (code) => {
      if (!resolved) {
        reject(new Error(`cloudflared exited before creating a tunnel (code ${code ?? "null"}).`));
      }
    });
  });
}

async function main() {
  const runtimeEnv = buildRuntimeEnv();

  process.on("SIGINT", () => {
    log("Stopping the public share...");
    cleanup();
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    cleanup();
    process.exit(0);
  });

  process.on("exit", cleanup);

  await ensureBridge(runtimeEnv);
  await ensureSite(runtimeEnv);
  const cloudflaredPath = await ensureCloudflared(runtimeEnv);
  const { url } = await startQuickTunnel(cloudflaredPath);

  log(`Public share URL: ${url}`);
  log(`Saved the URL to ${PUBLIC_URL_FILE}`);
  log("Keep this window open. Press Ctrl+C when you want to stop sharing.");

  await new Promise(() => {});
}

main().catch((error) => {
  console.error(`[share] ${error instanceof Error ? error.message : String(error)}`);
  cleanup();
  process.exit(1);
});
