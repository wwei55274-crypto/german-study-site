#!/usr/bin/env bash
set -euo pipefail

AGENT_ID="com.wangwei.keep-awake"
AGENT_DIR="$HOME/Library/LaunchAgents"
AGENT_FILE="$AGENT_DIR/$AGENT_ID.plist"
USER_UID="$(id -u)"

mkdir -p "$AGENT_DIR"

cat >"$AGENT_FILE" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$AGENT_ID</string>
  <key>ProgramArguments</key>
  <array>
    <string>/usr/bin/caffeinate</string>
    <string>-i</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>ProcessType</key>
  <string>Background</string>
  <key>StandardOutPath</key>
  <string>$HOME/Library/Logs/$AGENT_ID.log</string>
  <key>StandardErrorPath</key>
  <string>$HOME/Library/Logs/$AGENT_ID.log</string>
</dict>
</plist>
PLIST

launchctl bootout "gui/$USER_UID/$AGENT_ID" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$USER_UID" "$AGENT_FILE"
launchctl kickstart -k "gui/$USER_UID/$AGENT_ID"

echo "Keep-awake agent installed."
echo "Label: $AGENT_ID"
echo "File: $AGENT_FILE"
