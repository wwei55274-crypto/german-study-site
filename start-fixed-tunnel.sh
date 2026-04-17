#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUNTIME_DIR="$SCRIPT_DIR/.runtime"
LOG_DIR="$RUNTIME_DIR/logs"
PUBLIC_URL="${CLOUDFLARED_PUBLIC_URL:-https://study.luoge.us.ci}"
TUNNEL_TOKEN_FILE="$RUNTIME_DIR/cloudflared-token.txt"
SERVICE_APP_DIR="${GERMAN_STUDY_SERVICE_APP_DIR:-$HOME/Library/Application Support/GermanStudy/service-app}"
LAUNCH_DOMAIN="gui/$(id -u)"
AI_LABEL="com.wangwei.german-study.ai"
SITE_LABEL="com.wangwei.german-study.site"
TUNNEL_LABEL="com.wangwei.german-study.tunnel"
AI_PLIST="$HOME/Library/LaunchAgents/$AI_LABEL.plist"
SITE_PLIST="$HOME/Library/LaunchAgents/$SITE_LABEL.plist"
TUNNEL_PLIST="$HOME/Library/LaunchAgents/$TUNNEL_LABEL.plist"

mkdir -p "$LOG_DIR"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

sync_service_copy() {
  mkdir -p "$SERVICE_APP_DIR" "$SERVICE_APP_DIR/.runtime/logs"
  rsync -a --delete \
    --exclude '.git/' \
    --exclude '.runtime/' \
    --exclude 'node_modules/' \
    --exclude '.DS_Store' \
    "$SCRIPT_DIR/" "$SERVICE_APP_DIR/"
  cp "$TUNNEL_TOKEN_FILE" "$SERVICE_APP_DIR/.runtime/cloudflared-token.txt"
  chmod 600 "$SERVICE_APP_DIR/.runtime/cloudflared-token.txt"
}

wait_for_port() {
  local port="$1"
  local label="$2"

  for _ in {1..40}; do
    if lsof -tiTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.25
  done

  echo "$label did not become ready on port $port."
  return 1
}

restart_launch_agent() {
  local label="$1"
  local plist="$2"

  if [[ ! -f "$plist" ]]; then
    echo "Missing LaunchAgent plist: $plist"
    exit 1
  fi

  launchctl bootout "$LAUNCH_DOMAIN/$label" >/dev/null 2>&1 || true
  launchctl bootstrap "$LAUNCH_DOMAIN" "$plist"
  launchctl kickstart -k "$LAUNCH_DOMAIN/$label" >/dev/null 2>&1 || true
}

require_command launchctl
require_command lsof
require_command rsync

if [[ ! -x "$SCRIPT_DIR/run-study-ai.sh" || ! -x "$SCRIPT_DIR/run-study-site.sh" || ! -x "$SCRIPT_DIR/run-study-tunnel.sh" ]]; then
  echo "The launchd runner scripts are missing or not executable."
  exit 1
fi

if [[ ! -s "$TUNNEL_TOKEN_FILE" ]]; then
  cat <<EOF
The fixed tunnel has not been authorized on this Mac yet.

Run:
./setup-fixed-tunnel.sh

This will open the Cloudflare login flow and store a local tunnel token.
EOF
  exit 1
fi

sync_service_copy
restart_launch_agent "$AI_LABEL" "$AI_PLIST"
restart_launch_agent "$SITE_LABEL" "$SITE_PLIST"
wait_for_port 8765 "AI bridge"
wait_for_port 8080 "Local site"
restart_launch_agent "$TUNNEL_LABEL" "$TUNNEL_PLIST"
sleep 2

cat <<EOF
Fixed public URL:
$PUBLIC_URL

Keep your iMac online and logged in.
This startup mode is now managed by macOS LaunchAgents for better stability.
EOF
