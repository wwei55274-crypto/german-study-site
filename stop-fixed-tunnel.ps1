$patterns = @(
  'local_ai_bridge\.js',
  'local_site_server\.js',
  'cloudflared.*tunnel run german-study'
)

Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
  Where-Object {
    $cmd = $_.CommandLine
    $cmd -and ($patterns | Where-Object { $cmd -match $_ } | Select-Object -First 1)
  } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force }

Write-Host "Stopped the fixed-domain website, AI bridge, and named tunnel."
