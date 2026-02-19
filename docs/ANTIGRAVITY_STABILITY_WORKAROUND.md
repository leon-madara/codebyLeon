# Antigravity Stability Watchdog (Windows)

This repo includes both a local runner and a global installer to mitigate the Antigravity language-server crash/leak behavior:

- Forces GPU-related launch flags
- Monitors `language_server_*` + main Antigravity process RAM/CPU
- Restarts Antigravity on sustained high usage
- Optionally prunes oversized log directories to prevent disk-fill loops

## Files

- Local watchdog runner: `scripts/antigravity-stability-watchdog.ps1`
- Global installer: `scripts/install-antigravity-watchdog-global.ps1`
- Global uninstaller: `scripts/uninstall-antigravity-watchdog-global.ps1`
- Task template: `scripts/tasks/antigravity-watchdog-logon.xml`

## Quick Start (Local)

Run in PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\antigravity-stability-watchdog.ps1 -PruneLogs
```

If the executable is not auto-detected, provide it explicitly:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\antigravity-stability-watchdog.ps1 `
  -AntigravityPath "C:\Users\<you>\AppData\Local\Programs\Antigravity\Antigravity.exe" `
  -PruneLogs
```

## Global Install (All Projects + Auto-Start at Login)

Run once:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-antigravity-watchdog-global.ps1
```

What this does:

- Copies watchdog script to `%LOCALAPPDATA%\AntigravityWatchdog`
- Generates concrete task XML at `%LOCALAPPDATA%\AntigravityWatchdog\antigravity-watchdog-logon.xml`
- Registers scheduled task `Antigravity Stability Watchdog` at logon
- Starts the task immediately
- Creates global shim `%LOCALAPPDATA%\Microsoft\WindowsApps\antigravity-watchdog.cmd`

Use custom executable path:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-antigravity-watchdog-global.ps1 `
  -AntigravityPath "C:\Users\<you>\AppData\Local\Programs\Antigravity\Antigravity.exe"
```

Dry-run preview:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install-antigravity-watchdog-global.ps1 -DryRun
```

## Manual XML Import

If you prefer manual registration, install first (or run with `-DryRun` and generate your own values), then:

```powershell
$xmlPath = "$env:LOCALAPPDATA\AntigravityWatchdog\antigravity-watchdog-logon.xml"
Register-ScheduledTask -TaskName "Antigravity Stability Watchdog" -Xml (Get-Content $xmlPath -Raw) -Force
```

## Global Uninstall

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\uninstall-antigravity-watchdog-global.ps1
```

Dry-run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\uninstall-antigravity-watchdog-global.ps1 -DryRun
```

## Useful Overrides

- `-RestartMinutes 20`  
  Scheduled restart cadence (set `0` to disable scheduled restarts).
- `-MemoryGbThreshold 6`  
  Restart trigger for sustained high RAM use.
- `-CpuPercentThreshold 80`  
  Restart trigger for sustained high CPU use.
- `-HighUsageSamples 6`  
  Number of consecutive hot samples before restart.
- `-PollSeconds 5`  
  Monitoring interval.
- `-MaxLogMb 1024`  
  Log directory soft limit. With `-PruneLogs`, oldest files are removed until under 80% of this value.
- `-AdditionalArgs @("--your-flag")`  
  Adds extra Antigravity launch flags.

## Notes

- Stop local watchdog with `Ctrl + C`.
- The script auto-applies:
  - `--disable-gpu-driver-bug-workarounds`
  - `--ignore-gpu-blacklist`
  - `--enable-zero-copy`
- This is a mitigation layer, not a permanent upstream fix.
