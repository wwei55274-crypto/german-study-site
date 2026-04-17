#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_DIR="$SCRIPT_DIR/.runtime"
TUNNEL_NAME="${1:-german-study}"
HOSTNAME_TO_BIND="${2:-study.luoge.us.ci}"
TUNNEL_TOKEN_FILE="$RUNTIME_DIR/cloudflared-token.txt"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

resolve_cloudflared() {
  local local_bin="$SCRIPT_DIR/tools/cloudflared"

  if [[ -x "$local_bin" ]]; then
    echo "$local_bin"
    return 0
  fi

  if command -v cloudflared >/dev/null 2>&1; then
    command -v cloudflared
    return 0
  fi

  return 1
}

CLOUDFLARED_BIN="$(resolve_cloudflared || true)"

if [[ -z "$CLOUDFLARED_BIN" ]]; then
  require_command cloudflared
  CLOUDFLARED_BIN="$(command -v cloudflared)"
fi

get_tunnel_id() {
  "$CLOUDFLARED_BIN" tunnel list --output json --name "$TUNNEL_NAME" | node -e '
    let data = "";
    process.stdin.on("data", (chunk) => { data += chunk; });
    process.stdin.on("end", () => {
      try {
        const parsed = JSON.parse(data);
        const item = Array.isArray(parsed) ? parsed[0] : null;
        if (item && item.id) {
          process.stdout.write(String(item.id));
          return;
        }
      } catch {}
      process.exit(1);
    });
  '
}

echo "Step 1/3: Login to Cloudflare in the browser window that opens."
"$CLOUDFLARED_BIN" tunnel login

echo "Step 2/3: Create tunnel $TUNNEL_NAME if it does not already exist."
TUNNEL_ID="$(get_tunnel_id || true)"

if [[ -z "$TUNNEL_ID" ]]; then
  "$CLOUDFLARED_BIN" tunnel create "$TUNNEL_NAME" >/dev/null
  TUNNEL_ID="$(get_tunnel_id)"
fi

echo "Step 3/3: Bind DNS hostname $HOSTNAME_TO_BIND to $TUNNEL_NAME."
"$CLOUDFLARED_BIN" tunnel route dns --overwrite-dns "$TUNNEL_NAME" "$HOSTNAME_TO_BIND"

echo "Step 4/4: Fetch a reusable tunnel token for this Mac."
mkdir -p "$RUNTIME_DIR"
"$CLOUDFLARED_BIN" tunnel token "$TUNNEL_NAME" >"$TUNNEL_TOKEN_FILE"
chmod 600 "$TUNNEL_TOKEN_FILE"

cat <<EOF
Tunnel setup finished.
Tunnel name: $TUNNEL_NAME
Tunnel ID: $TUNNEL_ID
Hostname: $HOSTNAME_TO_BIND

You can now start it with:
./start-fixed-tunnel.sh
EOF
