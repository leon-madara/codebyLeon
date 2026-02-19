[CmdletBinding()]
param(
    [string]$InstallDir = "$env:LOCALAPPDATA\AntigravityWatchdog",
    [string]$TaskName = "Antigravity Stability Watchdog",
    [switch]$KeepFiles,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$resolvedInstallDir = [System.IO.Path]::GetFullPath($InstallDir)
$shimDir = Join-Path $env:LOCALAPPDATA "Microsoft\WindowsApps"
$shimPath = Join-Path $shimDir "antigravity-watchdog.cmd"
$installedWatchdogPath = Join-Path $resolvedInstallDir "antigravity-stability-watchdog.ps1"

if ($DryRun.IsPresent) {
    Write-Host "Dry run only. No files or scheduled task were changed."
}

$taskExists = $false
try {
    Get-ScheduledTask -TaskName $TaskName -ErrorAction Stop | Out-Null
    $taskExists = $true
} catch {
    $taskExists = $false
}

if ($taskExists) {
    if ($DryRun.IsPresent) {
        Write-Host "Would remove scheduled task: $TaskName"
    } else {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "Removed scheduled task: $TaskName"
    }
} else {
    Write-Host "Scheduled task not found: $TaskName"
}

if (Test-Path $shimPath) {
    $removeShim = $true
    try {
        $shimText = Get-Content -Path $shimPath -Raw
        if (-not [string]::IsNullOrWhiteSpace($shimText) -and -not $shimText.Contains($installedWatchdogPath)) {
            $removeShim = $false
            Write-Host "Global shim points to a different target, leaving in place: $shimPath"
        }
    } catch {
        $removeShim = $true
    }

    if ($removeShim) {
        if ($DryRun.IsPresent) {
            Write-Host "Would remove shim: $shimPath"
        } else {
            Remove-Item -Path $shimPath -Force
            Write-Host "Removed shim: $shimPath"
        }
    }
}

if (-not $KeepFiles.IsPresent -and (Test-Path $resolvedInstallDir)) {
    if ($DryRun.IsPresent) {
        Write-Host "Would remove install directory: $resolvedInstallDir"
    } else {
        Remove-Item -Path $resolvedInstallDir -Recurse -Force
        Write-Host "Removed install directory: $resolvedInstallDir"
    }
} elseif ($KeepFiles.IsPresent) {
    Write-Host "Keeping installed files at: $resolvedInstallDir"
}

if ($DryRun.IsPresent) {
    Write-Host "Would clear ANTIGRAVITY_WATCHDOG_HOME user variable."
} else {
    try {
        [Environment]::SetEnvironmentVariable("ANTIGRAVITY_WATCHDOG_HOME", $null, "User")
        Write-Host "Cleared ANTIGRAVITY_WATCHDOG_HOME user variable."
    } catch {
        Write-Warning "Could not clear ANTIGRAVITY_WATCHDOG_HOME: $($_.Exception.Message)"
    }
}
