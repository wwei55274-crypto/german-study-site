#!/usr/bin/env bash
set -euo pipefail

AGENT_ID="com.wangwei.keep-awake"
AGENT_FILE="$HOME/Library/LaunchAgents/$AGENT_ID.plist"
USER_UID="$(id -u)"

launchctl bootout "gui/$USER_UID/$AGENT_ID" >/dev/null 2>&1 || true
rm -f "$AGENT_FILE"

echo "Keep-awake agent removed."
echo "File deleted: $AGENT_FILE"
