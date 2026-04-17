#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_DIR="$SCRIPT_DIR/.runtime"
LAUNCH_DOMAIN="gui/$(id -u)"
AI_LABEL="com.wangwei.german-study.ai"
SITE_LABEL="com.wangwei.german-study.site"
TUNNEL_LABEL="com.wangwei.german-study.tunnel"

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

stop_launch_agent() {
  local label="$1"

  if launchctl bootout "$LAUNCH_DOMAIN/$label" >/dev/null 2>&1; then
    echo "Stopped $label."
  fi
}

stop_launch_agent "$TUNNEL_LABEL"
stop_launch_agent "$SITE_LABEL"
stop_launch_agent "$AI_LABEL"
kill_from_pid_file "$RUNTIME_DIR/fixed-tunnel.pid" "fixed tunnel"
"$SCRIPT_DIR/stop-study.sh"
