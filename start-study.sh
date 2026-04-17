#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_DIR="$SCRIPT_DIR/.runtime"
LOG_DIR="$RUNTIME_DIR/logs"
SITE_URL="http://127.0.0.1:8080"
KEEP_AWAKE_PID_FILE="$RUNTIME_DIR/keep-awake.pid"

mkdir -p "$LOG_DIR"

if [[ -f "$SCRIPT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/.env"
  set +a
fi

export GERMAN_STUDY_DATA_DIR="${GERMAN_STUDY_DATA_DIR:-$HOME/Library/Application Support/GermanStudy}"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

pid_is_running() {
  local pid="$1"

  [[ -n "$pid" ]] && kill -0 "$pid" >/dev/null 2>&1
}

is_port_listening() {
  lsof -tiTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
}

wait_for_port() {
  local port="$1"
  local name="$2"

  for _ in {1..40}; do
    if is_port_listening "$port"; then
      return 0
    fi
    sleep 0.25
  done

  echo "$name did not become ready on port $port."
  return 1
}

start_background() {
  local name="$1"
  shift

  (
    cd "$SCRIPT_DIR"
    nohup "$@" >"$LOG_DIR/$name.log" 2>&1 &
    echo $! >"$RUNTIME_DIR/$name.pid"
  )
}

ensure_keep_awake() {
  local pid=""

  if [[ -f "$KEEP_AWAKE_PID_FILE" ]]; then
    pid="$(cat "$KEEP_AWAKE_PID_FILE" 2>/dev/null || true)"
    if pid_is_running "$pid"; then
      return 0
    fi
    rm -f "$KEEP_AWAKE_PID_FILE"
  fi

  (
    cd "$SCRIPT_DIR"
    nohup caffeinate -i >"$LOG_DIR/keep-awake.log" 2>&1 &
    echo $! >"$KEEP_AWAKE_PID_FILE"
  )
}

require_command node
require_command lsof
require_command open
require_command caffeinate

ensure_keep_awake

if ! is_port_listening 8765; then
  start_background "ai-bridge" node local_ai_bridge.js
fi

if ! is_port_listening 8080; then
  start_background "site" node local_site_server.js
fi

wait_for_port 8765 "AI bridge"
wait_for_port 8080 "Local site"
open "$SITE_URL" >/dev/null 2>&1 || true

cat <<EOF
German Study is ready.
Local site: $SITE_URL
Data folder: $GERMAN_STUDY_DATA_DIR
Logs: $LOG_DIR
Sleep prevention: active while this site is running.
EOF
