#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -f "$SCRIPT_DIR/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$SCRIPT_DIR/.env"
  set +a
fi

export GERMAN_STUDY_DATA_DIR="${GERMAN_STUDY_DATA_DIR:-$HOME/Library/Application Support/GermanStudy}"

cd "$SCRIPT_DIR"
exec /opt/homebrew/bin/node local_site_server.js
