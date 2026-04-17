#!/bin/zsh
SCRIPT_DIR=${0:A:h}
exec zsh -lc "cd \"$SCRIPT_DIR\" && ./start-fixed-tunnel.sh"
