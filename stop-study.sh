#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_DIR="$SCRIPT_DIR/.runtime"
LOG_DIR="$RUNTIME_DIR/logs"

kill_from_pid_file() {
  local pid_file="$1"
  local label="$2"

  if [[ ! -f "$pid_file" ]]; then
    return 0
  fi

  local pid=""
  pid="$(cat "$pid_file" 2>/dev/null || true)"

  if [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1; then
    kill "$pid" >/dev/null 2>&1 || true
    sleep 0.2
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill -9 "$pid" >/dev/null 2>&1 || true
    fi
    echo "Stopped $label."
  fi

  rm -f "$pid_file"
}

kill_from_pid_file "$RUNTIME_DIR/site.pid" "local site"
kill_from_pid_file "$RUNTIME_DIR/ai-bridge.pid" "AI bridge"
kill_from_pid_file "$RUNTIME_DIR/keep-awake.pid" "sleep prevention"

cat <<EOF
German Study has been stopped.
Logs remain in: $LOG_DIR
EOF
