@echo off
cd /d "%~dp0"
if exist ".env.bat" call ".env.bat"
if not defined AI_API_BASE_URL set "AI_API_BASE_URL=https://us.novaiapi.com/v1"
if not defined AI_API_DEFAULT_MODEL set "AI_API_DEFAULT_MODEL=[次]grok-420-fast"
node local_ai_bridge.js
