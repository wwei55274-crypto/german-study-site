#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -f "$SCRIPT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/.env"
  set +a
fi

cd "$SCRIPT_DIR"
export AI_API_BASE_URL="${AI_API_BASE_URL:-https://api.x.ai/v1}"
export AI_API_DEFAULT_MODEL="${AI_API_DEFAULT_MODEL:-grok-4}"
exec node local_ai_bridge.js
