#!/bin/zsh
SCRIPT_DIR=${0:A:h}
exec zsh -lc "cd \"$SCRIPT_DIR\" && ./stop-study.sh"
