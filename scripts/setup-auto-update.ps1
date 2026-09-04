<#
.SYNOPSIS
  Cài đặt một lần: lưu mật khẩu DB (đã mã hoá) + đăng ký Task Scheduler chạy
  auto-update.ps1 mỗi 8 tiếng.

.DESCRIPTION
  Mật khẩu được mã hoá bằng DPAPI và lưu ở %LOCALAPPDATA%\ITOS-OCC\db.cred —
  NGOÀI repo, chỉ user Windows hiện tại trên chính máy này giải mã được.
  Không cần quyền Administrator.

  Tác vụ chạy 3 lần/ngày cách nhau 8 tiếng (mặc định 06:00, 14:00, 22:00),
  chỉ chạy khi bạn đã đăng nhập Windows, và tự chạy bù nếu lúc đó máy tắt.

.EXAMPLE
  .\setup-auto-update.ps1
  .\setup-auto-update.ps1 -Times 07:00,15:00,23:00 -Squash
  .\setup-auto-update.ps1 -Remove      # gỡ tác vụ
#>
param(
  [string[]]$Times = @("06:00", "14:00", "22:00"),
  [string]$TaskName = "ITOS OCC - Cap nhat du lieu",
  [switch]$Squash,
  [switch]$Remove,
  [switch]$SkipCredential
)

$ErrorActionPreference = "Stop"
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

$scriptPath = Join-Path $PSScriptRoot "auto-update.ps1"
$credFile   = "$env:LOCALAPPDATA\ITOS-OCC\db.cred"

if ($Remove) {
  if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "Đã gỡ tác vụ '$TaskName'." -ForegroundColor Yellow
  } else {
    Write-Host "Không tìm thấy tác vụ '$TaskName'." -ForegroundColor Yellow
  }
  Write-Host "File mật khẩu vẫn còn ở $credFile — xoá thủ công nếu muốn."
  return
}

if (-not (Test-Path $scriptPath)) { throw "Không tìm thấy $scriptPath" }

# --- 1. Lưu mật khẩu DB (mã hoá DPAPI, ngoài repo) ---
if (-not $SkipCredential) {
  $dir = Split-Path -Parent $credFile
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Write-Host ""
  Write-Host "Nhập mật khẩu của user SQL 'vnl' (gõ xong nhấn Enter, màn hình không hiện ký tự):" -ForegroundColor Cyan
  $sec = Read-Host -AsSecureString
  if ($sec.Length -eq 0) { throw "Mật khẩu rỗng — huỷ." }
  ConvertFrom-SecureString -SecureString $sec | Set-Content -Path $credFile -Encoding ASCII
  Write-Host "Đã lưu mật khẩu mã hoá vào $credFile" -ForegroundColor Green
}

# --- 2. Đăng ký tác vụ ---
# Truyền đường dẫn file mật khẩu tuyệt đối vào command line: tiến trình do Task
# Scheduler khởi chạy có thể không có sẵn biến %LOCALAPPDATA%.
$argLine = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`" -CredFile `"$credFile`""
if ($Squash) { $argLine += " -Squash" }

$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $argLine `
          -WorkingDirectory (Split-Path -Parent $PSScriptRoot)

$triggers = @()
foreach ($t in $Times) { $triggers += New-ScheduledTaskTrigger -Daily -At $t }

$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable `
            -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
            -ExecutionTimeLimit (New-TimeSpan -Minutes 20) `
            -MultipleInstances IgnoreNew

$principal = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" `
             -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $triggers `
  -Settings $settings -Principal $principal -Force `
  -Description "Xuat du lieu OCC tu ETVNL ra data.jsx roi commit + push len GitHub Pages." | Out-Null

Write-Host ""
Write-Host "Đã đăng ký tác vụ '$TaskName' — chạy lúc: $($Times -join ', ')" -ForegroundColor Green
Write-Host "Nhật ký chạy: $env:LOCALAPPDATA\ITOS-OCC\auto-update.log"
Write-Host ""
Write-Host "Chạy thử ngay:      Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "Xem lần chạy gần nhất: Get-ScheduledTaskInfo -TaskName '$TaskName'"
Write-Host "Gỡ bỏ:              .\setup-auto-update.ps1 -Remove"
