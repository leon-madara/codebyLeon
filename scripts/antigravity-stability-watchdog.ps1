[CmdletBinding()]
param(
    [string]$AntigravityPath = "",
    [string[]]$AdditionalArgs = @(),
    [int]$RestartMinutes = 25,
    [int]$PollSeconds = 5,
    [double]$MemoryGbThreshold = 8,
    [double]$CpuPercentThreshold = 85,
    [int]$HighUsageSamples = 6,
    [string]$LogDirectory = "",
    [int]$MaxLogMb = 1024,
    [switch]$PruneLogs
)

$ErrorActionPreference = "Stop"

$script:DefaultGpuArgs = @(
    "--disable-gpu-driver-bug-workarounds",
    "--ignore-gpu-blacklist",
    "--enable-zero-copy"
)

$script:LanguageServerNames = @(
    "language_server_windows_x64",
    "language_server_linux_x64",
    "language_server"
)

$script:CpuSamples = @{}
$script:LastCpuSampleAt = Get-Date
$script:ProcessorCount = [Math]::Max([Environment]::ProcessorCount, 1)

function Resolve-AntigravityPath {
    param([string]$CandidatePath)

    if (-not [string]::IsNullOrWhiteSpace($CandidatePath)) {
        if (Test-Path $CandidatePath) {
            return (Resolve-Path $CandidatePath).Path
        }
        throw "Antigravity executable not found at '$CandidatePath'."
    }

    $pathCandidates = @(
        "$env:LOCALAPPDATA\Programs\Antigravity\Antigravity.exe",
        "$env:LOCALAPPDATA\Programs\Google Antigravity\Antigravity.exe",
        "$env:ProgramFiles\Antigravity\Antigravity.exe",
        "$env:ProgramFiles(x86)\Antigravity\Antigravity.exe"
    )

    foreach ($path in $pathCandidates) {
        if (Test-Path $path) {
            return (Resolve-Path $path).Path
        }
    }

    $command = Get-Command antigravity -ErrorAction SilentlyContinue
    if ($null -ne $command -and -not [string]::IsNullOrWhiteSpace($command.Source)) {
        return $command.Source
    }

    throw "Unable to locate Antigravity executable. Use -AntigravityPath to provide it explicitly."
}

function Resolve-LogDirectory {
    param([string]$CandidatePath)

    if (-not [string]::IsNullOrWhiteSpace($CandidatePath)) {
        return $CandidatePath
    }

    $defaultCandidates = @(
        "$env:APPDATA\Antigravity\logs",
        "$env:LOCALAPPDATA\Antigravity\logs",
        "$env:APPDATA\Google\Antigravity\logs",
        "$env:LOCALAPPDATA\Google\Antigravity\logs"
    )

    foreach ($path in $defaultCandidates) {
        if (Test-Path $path) {
            return $path
        }
    }

    return $defaultCandidates[0]
}

function Get-LanguageServerProcesses {
    return @(Get-Process -Name $script:LanguageServerNames -ErrorAction SilentlyContinue)
}

function Stop-AntigravityFamily {
    param([int[]]$ExcludeIds = @())

    $targets = @()
    $targets += @(Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue)
    $targets += @(Get-LanguageServerProcesses)
    $targets = $targets |
        Where-Object { $ExcludeIds -notcontains $_.Id } |
        Sort-Object -Property Id -Unique

    foreach ($process in $targets) {
        try {
            Stop-Process -Id $process.Id -Force -ErrorAction Stop
        } catch {
            Write-Warning "Failed to stop process '$($process.ProcessName)' ($($process.Id)): $($_.Exception.Message)"
        }
    }
}

function Start-AntigravityProcess {
    param(
        [string]$ExecutablePath,
        [string[]]$Arguments
    )

    $displayArgs = if ($Arguments.Count -gt 0) { $Arguments -join " " } else { "(none)" }
    Write-Host "Launching: $ExecutablePath $displayArgs"
    return Start-Process -FilePath $ExecutablePath -ArgumentList $Arguments -PassThru
}

function Get-TrackedProcesses {
    param([System.Diagnostics.Process]$Parent)

    $tracked = @()
    if ($null -ne $Parent -and -not $Parent.HasExited) {
        $tracked += $Parent
    }
    $tracked += @(Get-LanguageServerProcesses)
    return @($tracked | Sort-Object -Property Id -Unique)
}

function Get-ResourceSnapshot {
    param([System.Diagnostics.Process[]]$Processes)

    $memoryMb = 0.0
    $cpuDelta = 0.0
    $nextCpuSamples = @{}
    $now = Get-Date
    $intervalSec = [Math]::Max(($now - $script:LastCpuSampleAt).TotalSeconds, 0.5)

    foreach ($proc in $Processes) {
        try {
            $memoryMb += ($proc.WorkingSet64 / 1MB)

            $cpuSec = [double]$proc.CPU
            $nextCpuSamples[$proc.Id] = $cpuSec
            if ($script:CpuSamples.ContainsKey($proc.Id)) {
                $delta = $cpuSec - [double]$script:CpuSamples[$proc.Id]
                if ($delta -gt 0) {
                    $cpuDelta += $delta
                }
            }
        } catch {
            continue
        }
    }

    $script:CpuSamples = $nextCpuSamples
    $script:LastCpuSampleAt = $now
    $cpuPercent = ($cpuDelta / $intervalSec / $script:ProcessorCount) * 100.0

    return [PSCustomObject]@{
        MemoryMb = [Math]::Round($memoryMb, 1)
        CpuPercent = [Math]::Round($cpuPercent, 1)
    }
}

function Get-DirectorySizeBytes {
    param([string]$Path)

    if (-not (Test-Path $Path)) {
        return 0L
    }

    $files = Get-ChildItem -Path $Path -File -Recurse -ErrorAction SilentlyContinue
    $sum = ($files | Measure-Object -Property Length -Sum).Sum
    if ($null -eq $sum) {
        return 0L
    }
    return [int64]$sum
}

function Limit-LogDirectory {
    param(
        [string]$Path,
        [int]$MaxMb,
        [bool]$ShouldPrune
    )

    $maxBytes = [int64]($MaxMb * 1MB)
    $sizeBytes = Get-DirectorySizeBytes -Path $Path
    if ($sizeBytes -lt $maxBytes) {
        return [Math]::Round($sizeBytes / 1MB, 1)
    }

    $sizeMb = [Math]::Round($sizeBytes / 1MB, 1)
    if (-not $ShouldPrune) {
        Write-Warning "Log directory '$Path' is ${sizeMb}MB (limit ${MaxMb}MB). Enable -PruneLogs to auto-clean."
        return $sizeMb
    }

    if (-not (Test-Path $Path)) {
        return 0.0
    }

    $targetBytes = [int64]($maxBytes * 0.8)
    $files = Get-ChildItem -Path $Path -File -Recurse -ErrorAction SilentlyContinue |
        Sort-Object -Property LastWriteTimeUtc

    foreach ($file in $files) {
        if ($sizeBytes -le $targetBytes) {
            break
        }

        try {
            $sizeBytes -= [int64]$file.Length
            Remove-Item -Path $file.FullName -Force -ErrorAction Stop
        } catch {
            Write-Warning "Could not remove log file '$($file.FullName)': $($_.Exception.Message)"
        }
    }

    $afterMb = [Math]::Round((Get-DirectorySizeBytes -Path $Path) / 1MB, 1)
    Write-Host "Pruned logs in '$Path'. Current size: ${afterMb}MB."
    return $afterMb
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

$exePath = Resolve-AntigravityPath -CandidatePath $AntigravityPath
$resolvedLogDir = Resolve-LogDirectory -CandidatePath $LogDirectory

$args = @()
foreach ($arg in ($script:DefaultGpuArgs + $AdditionalArgs)) {
    if ([string]::IsNullOrWhiteSpace($arg)) {
        continue
    }
    if ($args -notcontains $arg) {
        $args += $arg
    }
}

Write-Host "Antigravity watchdog started."
Write-Host "Executable: $exePath"
Write-Host "Restart cadence: $RestartMinutes minute(s)"
Write-Host "Resource thresholds: ${MemoryGbThreshold}GB RAM, ${CpuPercentThreshold}% CPU for $HighUsageSamples sample(s)"
Write-Host "Log directory: $resolvedLogDir (limit: ${MaxLogMb}MB, prune: $($PruneLogs.IsPresent))"

$parent = Start-AntigravityProcess -ExecutablePath $exePath -Arguments $args
$nextRestartAt = if ($RestartMinutes -eq 0) { [datetime]::MaxValue } else { (Get-Date).AddMinutes($RestartMinutes) }
$nextLogCheckAt = (Get-Date).AddSeconds(30)
$highUsageCount = 0

while ($true) {
    Start-Sleep -Seconds $PollSeconds

    if ((Get-Date) -ge $nextLogCheckAt) {
        Limit-LogDirectory -Path $resolvedLogDir -MaxMb $MaxLogMb -ShouldPrune $PruneLogs.IsPresent | Out-Null
        $nextLogCheckAt = (Get-Date).AddSeconds(30)
    }

    $parentRunning = $null
    try {
        $parentRunning = Get-Process -Id $parent.Id -ErrorAction Stop
    } catch {
        $parentRunning = $null
    }

    if ($null -eq $parentRunning) {
        Write-Warning "Antigravity exited unexpectedly. Restarting."
        Stop-AntigravityFamily
        $parent = Start-AntigravityProcess -ExecutablePath $exePath -Arguments $args
        $nextRestartAt = if ($RestartMinutes -eq 0) { [datetime]::MaxValue } else { (Get-Date).AddMinutes($RestartMinutes) }
        $highUsageCount = 0
        $script:CpuSamples = @{}
        $script:LastCpuSampleAt = Get-Date
        continue
    }

    $trackedProcesses = Get-TrackedProcesses -Parent $parentRunning
    $snapshot = Get-ResourceSnapshot -Processes $trackedProcesses
    $memoryThresholdMb = $MemoryGbThreshold * 1024
    $memoryHot = $snapshot.MemoryMb -ge $memoryThresholdMb
    $cpuHot = $snapshot.CpuPercent -ge $CpuPercentThreshold
    $sampleHot = $memoryHot -or $cpuHot

    if ($sampleHot) {
        $highUsageCount += 1
    } else {
        $highUsageCount = 0
    }

    $procSummary = ($trackedProcesses | ForEach-Object { "$($_.ProcessName)#$($_.Id)" }) -join ", "
    Write-Host ("[{0}] mem={1}MB cpu={2}% hot={3}/{4} procs={5}" -f (Get-Date -Format "HH:mm:ss"), $snapshot.MemoryMb, $snapshot.CpuPercent, $highUsageCount, $HighUsageSamples, $procSummary)

    $restartReasons = @()
    if ((Get-Date) -ge $nextRestartAt) {
        $restartReasons += "scheduled-$RestartMinutes-min-restart"
    }
    if ($highUsageCount -ge $HighUsageSamples) {
        $restartReasons += "resource-threshold-breach"
    }

    if ($restartReasons.Count -gt 0) {
        Write-Warning ("Restarting Antigravity: {0}" -f ($restartReasons -join ", "))
        Stop-AntigravityFamily
        Start-Sleep -Seconds 2
        $parent = Start-AntigravityProcess -ExecutablePath $exePath -Arguments $args
        $nextRestartAt = if ($RestartMinutes -eq 0) { [datetime]::MaxValue } else { (Get-Date).AddMinutes($RestartMinutes) }
        $highUsageCount = 0
        $script:CpuSamples = @{}
        $script:LastCpuSampleAt = Get-Date
    }
}
