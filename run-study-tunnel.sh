#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOKEN_FILE="$SCRIPT_DIR/.runtime/cloudflared-token.txt"
LOCAL_SITE_URL="${CLOUDFLARED_LOCAL_URL:-http://127.0.0.1:8080}"

if [[ ! -s "$TOKEN_FILE" ]]; then
  echo "Missing tunnel token file: $TOKEN_FILE" >&2
  exit 1
fi

cd "$SCRIPT_DIR"
exec "$SCRIPT_DIR/tools/cloudflared" tunnel --no-autoupdate run --token-file "$TOKEN_FILE" --url "$LOCAL_SITE_URL"
