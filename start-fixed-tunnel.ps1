$ErrorActionPreference = "Stop"

$workdir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $workdir

$cloudflaredPath = Join-Path $workdir "tools\cloudflared.exe"
$bridgeLog = Join-Path $workdir "fixed-bridge.log"
$siteLog = Join-Path $workdir "fixed-site.log"
$tunnelLog = Join-Path $workdir "fixed-tunnel.log"
$publicUrl = "https://study.luoge.us.ci"

function Has-Process($pattern) {
  $processes = Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -and $_.CommandLine -match $pattern }
  return [bool]($processes | Select-Object -First 1)
}

function Start-HiddenProcess($filePath, $arguments, $redirectPath) {
  Start-Process -FilePath $filePath -ArgumentList $arguments -WorkingDirectory $workdir -WindowStyle Hidden -RedirectStandardOutput $redirectPath -RedirectStandardError $redirectPath
}

if (-not (Has-Process "local_ai_bridge\.js")) {
  Start-HiddenProcess "cmd.exe" '/c cd /d "' + $workdir + '" && start-ai-bridge.bat' $bridgeLog
  Start-Sleep -Seconds 6
}

if (-not (Has-Process "local_site_server\.js")) {
  Start-HiddenProcess "node.exe" "local_site_server.js" $siteLog
  Start-Sleep -Seconds 2
}

if (-not (Has-Process "cloudflared.*tunnel run german-study")) {
  Start-HiddenProcess $cloudflaredPath "tunnel run german-study" $tunnelLog
  Start-Sleep -Seconds 4
}

Write-Host ""
Write-Host "Fixed public URL:"
Write-Host $publicUrl
Write-Host ""
Write-Host "Keep your computer online."
Write-Host "If AI behaves oddly after a long time, run stop-fixed-tunnel.bat and then start-fixed-tunnel.bat."
