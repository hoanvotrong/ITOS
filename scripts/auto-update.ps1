<#
.SYNOPSIS
  Tự động làm mới data.jsx từ DB ETVNL rồi commit + push lên GitHub Pages.

.DESCRIPTION
  Dành cho Windows Task Scheduler chạy định kỳ (mặc định 8 tiếng/lần).
  KHÔNG chứa mật khẩu. Mật khẩu được đọc từ file đã mã hoá bằng DPAPI nằm
  NGOÀI repo (%LOCALAPPDATA%\ITOS-OCC\db.cred) — chỉ đúng user Windows này
  trên đúng máy này mới giải mã được. Tạo file đó một lần bằng
  scripts\setup-auto-update.ps1.

  Máy chạy script này BẮT BUỘC phải ở trong mạng LAN thấy được 192.168.1.6.

.PARAMETER Squash
  Gộp snapshot mới vào commit tự động trước đó (amend + force-push) thay vì
  tạo commit mới mỗi lần. Giữ lịch sử git gọn, đổi lại có ghi đè lịch sử.

.EXAMPLE
  .\auto-update.ps1            # chạy thử một lần
  .\auto-update.ps1 -NoPush    # chỉ cập nhật + commit, không push
#>
param(
  [string]$CredFile = "$env:LOCALAPPDATA\ITOS-OCC\db.cred",
  [switch]$NoPush,
  [switch]$Squash
)

$ErrorActionPreference = "Stop"
try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch {}

# Tiến trình do Task Scheduler khởi chạy có thể thiếu biến môi trường của profile,
# khiến "$env:LOCALAPPDATA..." rút lại thành đường dẫn cụt. Dựng lại cho chắc.
if (-not $env:USERPROFILE -and $env:HOMEDRIVE -and $env:HOMEPATH) {
  $env:USERPROFILE = "$env:HOMEDRIVE$env:HOMEPATH"
}
if ($CredFile -notmatch "^[A-Za-z]:\\") {
  $base = [Environment]::GetFolderPath("LocalApplicationData")
  if (-not $base -and $env:USERPROFILE) { $base = Join-Path $env:USERPROFILE "AppData\Local" }
  if (-not $base) { throw "Không xác định được thư mục LocalAppData — hãy truyền -CredFile <đường dẫn tuyệt đối>." }
  $CredFile = Join-Path $base "ITOS-OCC\db.cred"
}

$repo    = Split-Path -Parent $PSScriptRoot
$stateDir = Split-Path -Parent $CredFile
$logFile = Join-Path $stateDir "auto-update.log"
$AUTO_TAG = "[auto-data]"

if (-not (Test-Path $stateDir)) { New-Item -ItemType Directory -Path $stateDir -Force | Out-Null }

function Log($msg, $level = "INFO") {
  $line = "{0} [{1}] {2}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $level, $msg
  Write-Host $line
  try { Add-Content -Path $logFile -Value $line -Encoding UTF8 } catch {}
}

# Cắt log khi vượt 1MB, giữ lại 500 dòng cuối
if ((Test-Path $logFile) -and ((Get-Item $logFile).Length -gt 1MB)) {
  $keep = Get-Content $logFile -Tail 500
  Set-Content -Path $logFile -Value $keep -Encoding UTF8
}

# Gọi git an toàn: git ghi tiến trình ra stderr, đừng để PowerShell coi đó là lỗi
function Invoke-Git([string[]]$argv) {
  $prev = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  # .ToString() để lấy đúng dòng chữ git in ra, không kèm khung lỗi của PowerShell
  $out = (& git -C $repo @argv 2>&1 | ForEach-Object { $_.ToString() }) -join " | "
  $code = $LASTEXITCODE
  $ErrorActionPreference = $prev
  $txt = $out.Trim()
  if ($txt) { Log ("git " + ($argv -join " ") + " -> " + ($txt -replace "\s*\r?\n\s*", " | ")) }
  return $code
}

Log "=== Bắt đầu cập nhật tự động ==="

try {
  if (-not (Test-Path $CredFile)) {
    throw "Chưa có file mật khẩu '$CredFile'. Chạy scripts\setup-auto-update.ps1 một lần để tạo."
  }

  # 1) Đồng bộ với remote TRƯỚC khi sinh dữ liệu (lúc này cây làm việc còn sạch,
  #    nên rebase không thể đụng độ với data.jsx vừa sinh ra)
  $dirty = (& git -C $repo status --porcelain | Out-String).Trim()
  if ($dirty) {
    Log "Cây làm việc còn thay đổi chưa commit — bỏ qua bước pull để không đụng vào file của bạn." "WARN"
  } else {
    if ((Invoke-Git @("pull", "--rebase", "origin", "master")) -ne 0) {
      Log "pull thất bại (mất mạng hoặc lịch sử lệch) — vẫn chạy tiếp, sẽ push ở lần sau." "WARN"
    }
  }

  # 2) Giải mã mật khẩu vào RAM, xuất dữ liệu, rồi xoá ngay
  $sec  = (Get-Content $CredFile -Raw).Trim() | ConvertTo-SecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec)
  try {
    $env:OCC_DB_PASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  } finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }

  try {
    & "$PSScriptRoot\export-occ-data.ps1"
  } finally {
    $env:OCC_DB_PASSWORD = $null
    Remove-Item Env:\OCC_DB_PASSWORD -ErrorAction SilentlyContinue
  }

  # 3) Chỉ commit khi data.jsx thực sự đổi
  $changed = (& git -C $repo status --porcelain -- "data.jsx" | Out-String).Trim()
  if (-not $changed) {
    Log "data.jsx không đổi — không cần commit."
    Log "=== Xong (không có thay đổi) ==="
    exit 0
  }

  if ((Invoke-Git @("add", "data.jsx")) -ne 0) { throw "git add thất bại." }

  $stamp = Get-Date -Format "dd/MM/yyyy HH:mm"
  $msg   = "$AUTO_TAG Refresh the OCC data snapshot to $stamp"

  # Nếu bật -Squash và commit gần nhất cũng là commit tự động thì amend đè lên nó
  $lastMsg = (& git -C $repo log -1 --pretty=%s | Out-String).Trim()
  $doAmend = $Squash -and $lastMsg.StartsWith($AUTO_TAG)

  if ($doAmend) {
    if ((Invoke-Git @("commit", "--amend", "-m", $msg)) -ne 0) { throw "git commit --amend thất bại." }
    Log "Đã gộp vào commit tự động trước đó."
  } else {
    if ((Invoke-Git @("commit", "-m", $msg)) -ne 0) { throw "git commit thất bại." }
    Log "Đã tạo commit mới."
  }

  # 4) Push
  if ($NoPush) {
    Log "Bỏ qua push (-NoPush)."
  } else {
    $pushArgs = if ($doAmend) { @("push", "--force-with-lease", "origin", "master") } else { @("push", "origin", "master") }
    if ((Invoke-Git $pushArgs) -ne 0) {
      throw "git push thất bại — dữ liệu đã commit ở máy, lần chạy sau sẽ push tiếp."
    }
    Log "Đã push lên GitHub Pages."
  }

  Log "=== Xong ==="
  exit 0

} catch {
  Log $_.Exception.Message "ERROR"
  Log "=== Kết thúc do lỗi ==="
  exit 1
}
