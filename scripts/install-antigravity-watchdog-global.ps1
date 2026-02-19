[CmdletBinding()]
param(
    [string]$InstallDir = "$env:LOCALAPPDATA\AntigravityWatchdog",
    [string]$TaskName = "Antigravity Stability Watchdog",
    [string]$AntigravityPath = "",
    [string]$LogDirectory = "",
    [int]$RestartMinutes = 25,
    [int]$PollSeconds = 5,
    [double]$MemoryGbThreshold = 8,
    [double]$CpuPercentThreshold = 85,
    [int]$HighUsageSamples = 6,
    [int]$MaxLogMb = 1024,
    [bool]$PruneLogs = $true,
    [string]$TaskXmlTemplatePath = "",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Escape-XmlText {
    param([string]$Text)
    if ($null -eq $Text) {
        return ""
    }
    return [System.Security.SecurityElement]::Escape($Text)
}

function Format-CommandToken {
    param([string]$Token)

    if ($null -eq $Token) {
        return '""'
    }

    if ($Token -match '[\s"]') {
        return '"' + $Token.Replace('"', '\"') + '"'
    }

    return $Token
}

function Join-CommandTokens {
    param([string[]]$Tokens)
    return ($Tokens | ForEach-Object { Format-CommandToken -Token $_ }) -join " "
}

function Get-InvariantText {
    param([object]$Value)
    return [Convert]::ToString($Value, [System.Globalization.CultureInfo]::InvariantCulture)
}

if ($PollSeconds -lt 2) {
    throw "-PollSeconds must be at least 2."
}

if ($RestartMinutes -lt 0) {
    throw "-RestartMinutes cannot be negative."
}

if ($HighUsageSamples -lt 1) {
    throw "-HighUsageSamples must be at least 1."
}

$resolvedInstallDir = [System.IO.Path]::GetFullPath($InstallDir)
$sourceWatchdogPath = Join-Path $PSScriptRoot "antigravity-stability-watchdog.ps1"
$installedWatchdogPath = Join-Path $resolvedInstallDir "antigravity-stability-watchdog.ps1"
$resolvedTemplatePath = if ([string]::IsNullOrWhiteSpace($TaskXmlTemplatePath)) {
    Join-Path $PSScriptRoot "tasks\antigravity-watchdog-logon.xml"
} else {
    [System.IO.Path]::GetFullPath($TaskXmlTemplatePath)
}
$resolvedPowerShellPath = Join-Path $env:SystemRoot "System32\WindowsPowerShell\v1.0\powershell.exe"
$generatedXmlPath = Join-Path $resolvedInstallDir "antigravity-watchdog-logon.xml"
$shimDir = Join-Path $env:LOCALAPPDATA "Microsoft\WindowsApps"
$shimPath = Join-Path $shimDir "antigravity-watchdog.cmd"

if (-not (Test-Path $sourceWatchdogPath)) {
    throw "Source watchdog script not found: $sourceWatchdogPath"
}

if (-not (Test-Path $resolvedTemplatePath)) {
    throw "Task XML template not found: $resolvedTemplatePath"
}

if (-not [string]::IsNullOrWhiteSpace($AntigravityPath) -and -not (Test-Path $AntigravityPath)) {
    throw "Antigravity executable not found at '$AntigravityPath'."
}

if (-not $DryRun.IsPresent) {
    New-Item -ItemType Directory -Path $resolvedInstallDir -Force | Out-Null
    Copy-Item -Path $sourceWatchdogPath -Destination $installedWatchdogPath -Force
}

$watchdogTokens = @(
    "-NoLogo",
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-WindowStyle", "Hidden",
    "-File", $installedWatchdogPath,
    "-RestartMinutes", (Get-InvariantText -Value $RestartMinutes),
    "-PollSeconds", (Get-InvariantText -Value $PollSeconds),
    "-MemoryGbThreshold", (Get-InvariantText -Value $MemoryGbThreshold),
    "-CpuPercentThreshold", (Get-InvariantText -Value $CpuPercentThreshold),
    "-HighUsageSamples", (Get-InvariantText -Value $HighUsageSamples),
    "-MaxLogMb", (Get-InvariantText -Value $MaxLogMb)
)

if ($PruneLogs) {
    $watchdogTokens += "-PruneLogs"
}

if (-not [string]::IsNullOrWhiteSpace($AntigravityPath)) {
    $resolvedAntigravityPath = (Resolve-Path $AntigravityPath).Path
    $watchdogTokens += "-AntigravityPath"
    $watchdogTokens += $resolvedAntigravityPath
}

if (-not [string]::IsNullOrWhiteSpace($LogDirectory)) {
    $watchdogTokens += "-LogDirectory"
    $watchdogTokens += $LogDirectory
}

$identity = [System.Security.Principal.WindowsIdentity]::GetCurrent()
$userSid = $identity.User.Value
$author = if ([string]::IsNullOrWhiteSpace($identity.Name)) {
    "$env:USERDOMAIN\$env:USERNAME"
} else {
    $identity.Name
}
$taskUri = if ($TaskName.StartsWith("\")) { $TaskName } else { "\" + $TaskName }
$taskDate = (Get-Date).ToUniversalTime().ToString("s") + "Z"
$argumentsText = Join-CommandTokens -Tokens $watchdogTokens
$templateXml = Get-Content -Path $resolvedTemplatePath -Raw

$resolvedXml = $templateXml
$resolvedXml = $resolvedXml.Replace("__TASK_DATE__", (Escape-XmlText -Text $taskDate))
$resolvedXml = $resolvedXml.Replace("__AUTHOR__", (Escape-XmlText -Text $author))
$resolvedXml = $resolvedXml.Replace("__TASK_URI__", (Escape-XmlText -Text $taskUri))
$resolvedXml = $resolvedXml.Replace("__USER_ID__", (Escape-XmlText -Text $userSid))
$resolvedXml = $resolvedXml.Replace("__POWERSHELL_PATH__", (Escape-XmlText -Text $resolvedPowerShellPath))
$resolvedXml = $resolvedXml.Replace("__POWERSHELL_ARGS__", (Escape-XmlText -Text $argumentsText))
$resolvedXml = $resolvedXml.Replace("__WORKING_DIR__", (Escape-XmlText -Text $resolvedInstallDir))

if ($DryRun.IsPresent) {
    Write-Host "Dry run only. No files or scheduled task were changed."
    Write-Host "InstallDir: $resolvedInstallDir"
    Write-Host "TaskName: $TaskName"
    Write-Host "Generated XML would be written to: $generatedXmlPath"
    Write-Host "Scheduled task arguments: $argumentsText"
    return
}

[System.IO.File]::WriteAllText($generatedXmlPath, $resolvedXml, [System.Text.Encoding]::Unicode)
Register-ScheduledTask -TaskName $TaskName -Xml $resolvedXml -Force | Out-Null

try {
    Start-ScheduledTask -TaskName $TaskName -ErrorAction Stop
} catch {
    Write-Warning "Task registered but not started immediately: $($_.Exception.Message)"
}

$shimContent = @"
@echo off
"$resolvedPowerShellPath" -NoLogo -NoProfile -ExecutionPolicy Bypass -File "$installedWatchdogPath" %*
"@

try {
    if (Test-Path $shimDir) {
        [System.IO.File]::WriteAllText($shimPath, $shimContent, [System.Text.UTF8Encoding]::new($false))
    } else {
        Write-Warning "Shim directory not found, skipping command shim: $shimDir"
    }
} catch {
    Write-Warning "Could not create global shim '$shimPath': $($_.Exception.Message)"
}

try {
    [Environment]::SetEnvironmentVariable("ANTIGRAVITY_WATCHDOG_HOME", $resolvedInstallDir, "User")
} catch {
    Write-Warning "Could not set ANTIGRAVITY_WATCHDOG_HOME user variable: $($_.Exception.Message)"
}

Write-Host "Global watchdog install complete."
Write-Host "Installed script: $installedWatchdogPath"
Write-Host "Task XML: $generatedXmlPath"
Write-Host "Task name: $TaskName"
Write-Host "Command shim: $shimPath"
