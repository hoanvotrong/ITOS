<#
.SYNOPSIS
  Xuất dữ liệu OCC (bến phao, tàu lai, cẩu, job-tàu, DVHH, tác vụ tàu lai) từ
  database ETVNL thật ra data.jsx cho dashboard OCC dùng.

.DESCRIPTION
  KHÔNG lưu mật khẩu trong file này hay bất kỳ đâu trong repo (repo này public
  trên GitHub). Truyền mật khẩu qua tham số -Password mỗi lần chạy, hoặc set
  biến môi trường OCC_DB_PASSWORD trước khi chạy.

.EXAMPLE
  # Cách 1 — truyền trực tiếp (không lưu lại đâu cả sau khi đóng terminal)
  .\export-occ-data.ps1 -Password "<mật khẩu thật của bạn>"

  # Cách 2 — set biến môi trường trước (chỉ tồn tại trong phiên PowerShell hiện tại)
  $env:OCC_DB_PASSWORD = "<mật khẩu thật của bạn>"
  .\export-occ-data.ps1

.NOTES
  Lấy toàn bộ job/DVHH/tug-task có ETA rơi trong THÁNG HIỆN TẠI (xem lý do ở
  ghi chú ngay dưới param block), loại các booking có trạng thái
  Reject/Cancel/Important/Accident. Chạy lại bất cứ khi nào muốn làm mới dữ
  liệu — ghi đè trực tiếp lên data.jsx, bạn tự `git diff` / `git commit` khi
  thấy dữ liệu ổn (đúng tinh thần "cập nhật thủ công" đã chọn).
#>
param(
  [string]$Server   = $(if ($env:OCC_DB_SERVER)   { $env:OCC_DB_SERVER }   else { "192.168.1.6" }),
  [string]$Database = $(if ($env:OCC_DB_NAME)     { $env:OCC_DB_NAME }     else { "ETVNL" }),
  [string]$User     = $(if ($env:OCC_DB_USER)     { $env:OCC_DB_USER }     else { "vnl" }),
  [string]$Password = $(if ($env:OCC_DB_PASSWORD) { $env:OCC_DB_PASSWORD } else { $null }),
  [string]$OutFile  = "$PSScriptRoot\..\data.jsx"
)
# LƯU Ý: dashboard hiện chỉ vẽ Gantt/Timeline theo NGÀY-TRONG-THÁNG (bỏ qua tháng/năm khi
# so sánh vị trí trên trục thời gian — giới hạn từ thiết kế gốc, viết cho tháng 5/2026 cố định).
# Vì vậy script này CHỦ ĐỘNG giới hạn dữ liệu trong ĐÚNG 1 THÁNG DƯƠNG LỊCH (tháng hiện tại)
# để tránh job/task bị vẽ sai vị trí khi vắt qua ranh giới tháng. Nếu cần xem nhiều tháng
# cùng lúc, phải sửa lại phần vẽ Gantt trong screens-operations.jsx trước (tính theo ngày
# tuyệt đối thay vì ngày-trong-tháng).

if (-not $Password) {
  Write-Error "Thiếu mật khẩu. Truyền -Password '...' hoặc set `$env:OCC_DB_PASSWORD trước khi chạy."
  exit 1
}

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName "System.Data"

$connStr = "Server=$Server;Database=$Database;User Id=$User;Password=$Password;Encrypt=False;Connection Timeout=25;"
$conn = New-Object System.Data.SqlClient.SqlConnection($connStr)
$conn.Open()
Write-Host "Đã kết nối tới $Server/$Database." -ForegroundColor Green

function Query($sql, [hashtable]$params = @{}) {
  $cmd = $conn.CreateCommand()
  $cmd.CommandText = $sql
  foreach ($k in $params.Keys) { $cmd.Parameters.AddWithValue($k, $params[$k]) | Out-Null }
  $reader = $cmd.ExecuteReader()
  $dt = New-Object System.Data.DataTable
  $dt.Load($reader)
  # QUAN TRỌNG: DataTable implements IEnumerable qua .Rows, nên PowerShell sẽ tự
  # "unroll" nó thành DataRow rời rạc (hoặc rỗng) khi return bình thường qua ranh
  # giới function. Dùng toán tử comma (,) để ép trả về đúng 1 object DataTable.
  return ,$dt
}

# Format "YYYY-MM-DD HH:MM" như OCC_* mock data đang dùng. $null -> $null (job chưa có mốc này).
function FmtDT($v) {
  if ($null -eq $v -or $v -is [System.DBNull]) { return $null }
  return ([datetime]$v).ToString("yyyy-MM-dd HH:mm")
}
# Format số nguyên kiểu Việt Nam: 2180000000 -> "2.180.000.000 ₫"
function FmtVND($n) {
  if ($null -eq $n) { return "0 ₫" }
  return "{0:N0}" -f [decimal]$n -replace ",", "." | ForEach-Object { "$_ ₫" }
}
function FmtQty($n, $unit = "MT") {
  if ($null -eq $n) { return "0 $unit" }
  $s = "{0:N0}" -f [decimal]$n -replace ",", "."
  return "$s $unit"
}
# Cast an int cột từ DataRow, trả $null nếu DBNull thay vì throw (dữ liệu thật hay thiếu FK)
function SafeInt($v) {
  if ($null -eq $v -or $v -is [System.DBNull]) { return $null }
  return [int]$v
}

$now = Get-Date
$rangeStart = Get-Date -Year $now.Year -Month $now.Month -Day 1 -Hour 0 -Minute 0 -Second 0
$rangeEnd   = $rangeStart.AddMonths(1).AddSeconds(-1)   # 23:59:59 ngày cuối tháng hiện tại

# ============================================================
# OCC_WINDOW — tự tính theo tháng hiện tại (không hard-code nữa)
# ============================================================
$occWindow = [ordered]@{
  startDay  = 1
  endDay    = $rangeEnd.Day
  month     = $now.Month
  year      = $now.Year
  todayDay  = $now.Day
  todayHour = [math]::Round($now.Hour + $now.Minute / 60.0, 2)
}

# ============================================================
# OCC_BERTHS
# ============================================================
$berthRows = Query "SELECT PonToonBerthID, PonToonBerthName FROM PonToonBerths ORDER BY PonToonBerthID"
$occBerths = @()
foreach ($r in $berthRows.Rows) {
  $occBerths += [ordered]@{
    id    = "$($r.PonToonBerthName)".Trim()
    group = "Bến phao Vinalogistics"
    label = "$($r.PonToonBerthName)".Trim()
    cap   = ""   # không quản lý sức chứa trong hệ thống — UI ẩn dòng này khi rỗng
  }
}

# ============================================================
# OCC_TUGS
# ============================================================
$tugRows = Query "SELECT Id, TugboatName, TotalWattage FROM Tugboat ORDER BY TugboatName"
$occTugs = @()
$tugIdByDbId = @{}   # DB Id (int) -> tên hiển thị dùng làm id chuỗi trong OCC_*
foreach ($r in $tugRows.Rows) {
  $name = "$($r.TugboatName)".Trim()
  $tugIdByDbId[[int]$r.Id] = $name
  $wattage = if ($r.TotalWattage -is [System.DBNull]) { $null } else { [int]$r.TotalWattage }
  $occTugs += [ordered]@{
    id     = $name
    hp     = if ($wattage) { "$wattage kW" } else { "" }   # DB không có field HP, đang dùng TotalWattage — cần xác nhận đơn vị
    status = "active"   # Tugboat.Status không có data đáng tin cậy, mặc định active — sửa tay nếu biết tàu nào đang bảo dưỡng
  }
}

# ============================================================
# OCC_CRANES
# ============================================================
$craneRows = Query @"
SELECT c.CraneID, c.CraneName, ct.CapacityNormal
FROM Cranes c
LEFT JOIN CraneTechnicals ct ON ct.CraneID = c.CraneID
WHERE c.IsDelete = 0 OR c.IsDelete IS NULL
ORDER BY c.CraneName
"@
# CraneTechnicals có thể có nhiều dòng / 1 cẩu (lịch sử thông số) -> gộp về 1 dòng/cẩu,
# ưu tiên dòng có CapacityNormal khác rỗng, tránh trùng key khi render.
$craneById = [ordered]@{}
foreach ($r in $craneRows.Rows) {
  $id = "$($r.CraneName)".Trim()
  $cap = if ($r.CapacityNormal -is [System.DBNull] -or [string]::IsNullOrWhiteSpace("$($r.CapacityNormal)")) { "" } else { "$($r.CapacityNormal)".Trim() }
  if (-not $craneById.Contains($id)) {
    $craneById[$id] = $cap
  } elseif ([string]::IsNullOrWhiteSpace($craneById[$id]) -and -not [string]::IsNullOrWhiteSpace($cap)) {
    $craneById[$id] = $cap
  }
}
$occCranes = @()
foreach ($id in $craneById.Keys) {
  $occCranes += [ordered]@{
    id     = $id
    cap    = $craneById[$id]
    status = "active"   # Cranes.Status không có data đáng tin cậy, mặc định active
  }
}

# ============================================================
# OCC_JOBS + OCC_DVHH + OCC_TUG_TASKS
# ============================================================
# QUAN TRỌNG: bản đầu tự viết JOIN thẳng PonToonBerthBooking/TugboatBooking
# cho ra SỐ LIỆU KHÔNG KHỚP với màn "Kế hoạch chung" thật của hệ thống
# (thiếu rất nhiều booking). Lý do: hệ thống thật dùng model
# BookingCenter/BookingCenterService — mỗi "job" (JobCode) có thể có nhiều
# service con (Khai thác ở bến phao, DVHH tàu lai...), mỗi service lại ưu
# tiên lấy ETA/ETD/trạng thái theo tầng Uploading > ReviewBooking > Booking,
# và lọc theo khoảng ETA/ETD CHỒNG LẤN với kỳ xem chứ không chỉ ETA nằm
# trong tháng. Thay vì tự viết lại đúng hết logic đó, ta gọi thẳng 2 stored
# procedure mà hệ thống thật đang dùng cho màn Kế hoạch chung, đảm bảo khớp
# 100%: SP_LoadAllBookingBerth (job ở bến phao) và SP_LoadAllBookingTugboat
# (dịch vụ tàu lai/sà lan — vừa là DVHH độc lập, vừa là resource của job
# bến phao khi cùng JobCode/BookingCenterId).
$statusMap = @{ 1="planned"; 4="planned"; 5="planned"; 10="planned"; 7="in_progress"; 8="in_progress"; 9="completed"; 3="delayed" }
$excludedStatus = @(2,6,11,12)

function ExecProc($name, $from, $to) {
  $cmd = $conn.CreateCommand()
  $cmd.CommandText = $name
  $cmd.CommandType = [System.Data.CommandType]::StoredProcedure
  $cmd.CommandTimeout = 60
  $cmd.Parameters.AddWithValue("@FromDate", $from) | Out-Null
  $cmd.Parameters.AddWithValue("@ToDate", $to) | Out-Null
  $reader = $cmd.ExecuteReader()
  $dt = New-Object System.Data.DataTable
  $dt.Load($reader)
  return ,$dt
}

$berthNameById = @{}
foreach ($r in $berthRows.Rows) { $berthNameById[[int]$r.PonToonBerthID] = "$($r.PonToonBerthName)".Trim() }

# TugboatBookingTugboat.TugboatId thường trống trên data thật — nguồn đáng tin
# cậy là cột IDNo dạng "<loại>_<id>": loại 10 = Tugboat.Id, loại 11 = Barge.Id
# (xác nhận bằng cách đối chiếu mẫu dữ liệu thật trước khi viết phần này).
$bargeRows = Query "SELECT Id, BargeName FROM Barge"
$bargeNameById = @{}
foreach ($r in $bargeRows.Rows) { $bargeNameById[[int]$r.Id] = "$($r.BargeName)".Trim() }

function ResolveIDNo($idno) {
  if ([string]::IsNullOrWhiteSpace("$idno") -or "$idno" -notmatch '^(\d+)_(\d+)$') { return $null }
  $kindCode = [int]$Matches[1]; $assetId = [int]$Matches[2]
  if ($kindCode -eq 10 -and $tugIdByDbId.ContainsKey($assetId)) { return [ordered]@{ kind = "tug"; name = $tugIdByDbId[$assetId] } }
  if ($kindCode -eq 11 -and $bargeNameById.ContainsKey($assetId)) { return [ordered]@{ kind = "barge"; name = $bargeNameById[$assetId] } }
  return $null
}

$berthProcRows = ExecProc "SP_LoadAllBookingBerth" $rangeStart $rangeEnd
$tugProcRows   = ExecProc "SP_LoadAllBookingTugboat" $rangeStart $rangeEnd

# Proc chỉ trả VesselName (không trả VesselId) — lấy thêm chi tiết tàu +
# mốc cập/rời thực tế (LoadingUnloading) theo BookingId riêng.
$vesselByBookingId = @{}
if ($berthProcRows.Rows.Count -gt 0) {
  $bookingIds = ($berthProcRows.Rows | ForEach-Object { [int]$_.ID }) -join ","
  $vRows = Query @"
SELECT pb.Id AS BookingId, v.IMO, v.DeadweightTonnage, v.LengthOverallAll, v.FlagId, v.ShipType,
       lu.LoadingUnloadingID, lu.TimeMooring, lu.ToLeave
FROM PonToonBerthBooking pb
LEFT JOIN Vessel v ON v.Id = pb.VesselId
LEFT JOIN LoadingUnloading lu ON lu.BerthBookingID = pb.Id
WHERE pb.Id IN ($bookingIds)
"@
  foreach ($r in $vRows.Rows) { $vesselByBookingId[[int]$r.BookingId] = $r }
}

$occJobs = @()
$jobIdByBookingCenter = @{}   # IDBookingCenter -> job id, để gắn resource tàu lai đúng job

foreach ($r in $berthProcRows.Rows) {
  $statusId = SafeInt $r.BookingStatusID
  if ($null -eq $statusId -or $excludedStatus -contains $statusId) { continue }
  $status = $statusMap[$statusId]
  if (-not $status) { continue }

  $bookingId = [int]$r.ID
  $jobId = "$($r.JobCode)".Trim()
  $jobIdByBookingCenter[[int]$r.IDBookingCenter] = $jobId

  $vd = $vesselByBookingId[$bookingId]
  $berthId = if ($berthNameById.ContainsKey([int]$r.ShipPairLocation)) { $berthNameById[[int]$r.ShipPairLocation] } else { "" }

  # resources: crane — từ LoadingUnloadingDetails (nếu có phiên LoadingUnloading gắn với job)
  $resources = @()
  if ($vd -and -not [System.DBNull]::Value.Equals($vd.LoadingUnloadingID)) {
    $craneDetailRows = Query "SELECT Crane, StartTime, EndTime FROM LoadingUnloadingDetails WHERE LoadingUnloadingID = @lid" -params @{ "@lid" = [int]$vd.LoadingUnloadingID }
    foreach ($cd in $craneDetailRows.Rows) {
      if ([System.DBNull]::Value.Equals($cd.Crane) -or [string]::IsNullOrWhiteSpace("$($cd.Crane)")) { continue }
      $resources += [ordered]@{
        type = "crane"; id = "$($cd.Crane)".Trim()
        from = FmtDT $cd.StartTime; to = FmtDT $cd.EndTime
        role = "Cẩu phục vụ dỡ/xếp hàng"
      }
    }
  }
  # resources: tug/barge — gắn sau khi duyệt xong $tugProcRows (cần biết jobIdByBookingCenter trước)

  $occJobs += [ordered]@{
    id       = $jobId
    vessel   = [ordered]@{
      name = "$($r.VesselName)".Trim()
      flag = if ($vd -and -not [System.DBNull]::Value.Equals($vd.FlagId)) { "$($vd.FlagId)" } else { "" }
      dwt  = if ($vd -and -not [System.DBNull]::Value.Equals($vd.DeadweightTonnage)) { "$($vd.DeadweightTonnage)".Trim() } else { "" }
      imo  = if ($vd -and -not [System.DBNull]::Value.Equals($vd.IMO)) { "$($vd.IMO)".Trim() } else { "" }
      loa  = if ($vd -and -not [System.DBNull]::Value.Equals($vd.LengthOverallAll)) { "$($vd.LengthOverallAll)".Trim() } else { "" }
      type = ""   # ShipType là mã số, chưa map ra tên loại tàu — để trống, có thể bổ sung bảng tra cứu sau
    }
    cargo    = [ordered]@{
      name = if ([System.DBNull]::Value.Equals($r.NameCargo)) { "" } else { "$($r.NameCargo)".Trim() }
      qty  = if ([System.DBNull]::Value.Equals($r.Cargo)) { FmtQty 0 } else { FmtQty $r.Cargo }
      op   = ""
    }
    berthId  = $berthId
    customer = if ([System.DBNull]::Value.Equals($r.CompanyName)) { "" } else { "$($r.CompanyName)".Trim() }
    contract = ""   # chưa tìm thấy field số hợp đồng tương ứng trong DB — để trống, UI ẩn dòng này
    pic      = ""   # PEOPLE hiện là bảng mock riêng, chưa map với UserAccounts — để trống tạm thời
    status   = $status
    progress = if ($status -eq "completed") { 100 } elseif ($status -eq "planned") { 0 } else { 50 }  # DB không có % tiến độ trực tiếp — ước lượng thô theo trạng thái, cần cải thiện sau
    start    = if ($vd -and -not [System.DBNull]::Value.Equals($vd.TimeMooring)) { FmtDT $vd.TimeMooring } else { FmtDT $r.ETA }
    end      = if ($vd -and -not [System.DBNull]::Value.Equals($vd.ToLeave))    { FmtDT $vd.ToLeave }    else { FmtDT $r.ETD }
    eta      = FmtDT $r.ETA
    etd      = FmtDT $r.ETD
    revenue  = "0 ₫"   # chưa tìm thấy nguồn doanh thu/giá dịch vụ đáng tin cậy trong DB — cần xác nhận thêm
    resources = $resources
    notes    = ""
    risks    = @()
    logs     = @()
  }
}

# Gộp các dòng SP_LoadAllBookingTugboat theo TugboatBooking.Id (mỗi dòng = 1
# tàu lai/sà lan được gán cho cùng 1 booking — 1 booking có thể có nhiều dòng).
# LƯU Ý: dùng key kiểu string ("bk-<id>"), KHÔNG dùng int trực tiếp — OrderedDictionary
# trong PowerShell coi indexer int là vị trí (positional), không phải key, gây lỗi
# "argument out of range" khi gán vào dictionary rỗng.
$tugGroups = [ordered]@{}
foreach ($r in $tugProcRows.Rows) {
  $asset = ResolveIDNo $r.ShipPairLocation2
  if (-not $asset) { continue }   # không parse được / tài sản không nằm trong danh sách đang quản lý
  $bkId = [int]$r.ID
  $bkKey = "bk-$bkId"
  if (-not $tugGroups.Contains($bkKey)) { $tugGroups[$bkKey] = [ordered]@{ bkId = $bkId; meta = $r; assets = @() } }
  $tugGroups[$bkKey].assets += $asset
}

$occDvhh = @()
$occTugTasks = @()
foreach ($bkKey in $tugGroups.Keys) {
  $g = $tugGroups[$bkKey]
  $bkId = $g.bkId
  $meta = $g.meta
  $statusId = SafeInt $meta.BookingStatusID
  if ($null -ne $statusId -and $excludedStatus -contains $statusId) { continue }
  $status = if ($statusId -and $statusMap[$statusId]) { $statusMap[$statusId] } else { "planned" }
  $vesselOrVoyage = if ([System.DBNull]::Value.Equals($meta.VesselName) -or [string]::IsNullOrWhiteSpace("$($meta.VesselName)")) { "chuyến $($meta.VoyageNumber)" } else { "$($meta.VesselName)".Trim() }
  $bcId = if ([System.DBNull]::Value.Equals($meta.IDBookingCenter)) { $null } else { [int]$meta.IDBookingCenter }
  $linkedJobId = if ($bcId -and $jobIdByBookingCenter.ContainsKey($bcId)) { $jobIdByBookingCenter[$bcId] } else { $null }

  if ($linkedJobId) {
    # Là resource (tàu lai/sà lan) của 1 job bến phao đã có ở trên — gắn vào job.resources
    $job = $occJobs | Where-Object { $_.id -eq $linkedJobId } | Select-Object -First 1
    if ($job) {
      foreach ($asset in $g.assets) {
        $job.resources += [ordered]@{
          type = $asset.kind; id = $asset.name
          from = FmtDT $meta.ETA; to = FmtDT $meta.ETD
          role = "Hỗ trợ cập/rời phao"
        }
      }
    }
  } else {
    # Dịch vụ tàu lai độc lập, không gắn job bến phao nào ta đang quản lý -> OCC_DVHH
    $tugNames = $g.assets | ForEach-Object { $_.name } | Select-Object -Unique
    $occDvhh += [ordered]@{
      id       = "DV-$bkId"
      title    = "Lai dắt $vesselOrVoyage"
      from     = FmtDT $meta.ETA
      to       = FmtDT $meta.ETD
      tugs     = @($tugNames)
      customer = if ([System.DBNull]::Value.Equals($meta.CompanyName)) { "" } else { "$($meta.CompanyName)".Trim() }
      status   = $status
      revenue  = "0 ₫"
    }
  }

  # OCC_TUG_TASKS: mỗi tàu lai (bỏ sà lan — schema chỉ cho phép tugId trỏ về OCC_TUGS)
  # trong nhóm này = 1 task, dùng để vẽ Gantt chi tiết theo từng tàu lai.
  # Real DB KHÔNG có phân loại mooring/unmooring/tow_in/tow_out/anchor/shift/rescue
  # rõ ràng như OCC_TUG_TASK_TYPES — tạm gán "tow_in" cho tất cả.
  $assetIdx = 0
  foreach ($asset in $g.assets) {
    $assetIdx++
    if ($asset.kind -ne "tug") { continue }
    $task = [ordered]@{
      id       = "TT-$bkId-$assetIdx"
      tugId    = $asset.name
      from     = FmtDT $meta.ETA
      to       = FmtDT $meta.ETD
      type     = "tow_in"   # placeholder — chưa xác định nguồn phân loại thật
      vessel   = $vesselOrVoyage
      customer = if ([System.DBNull]::Value.Equals($meta.CompanyName)) { "" } else { "$($meta.CompanyName)".Trim() }
      status   = $status
      revenue  = "0 ₫"
    }
    if ($linkedJobId) { $task.linkJobId = $linkedJobId } else { $task.dvhhId = "DV-$bkId" }
    $occTugTasks += $task
  }
}

$conn.Close()
Write-Host "Đã đóng kết nối. Job: $($occJobs.Count) | DVHH: $($occDvhh.Count) | Tug tasks: $($occTugTasks.Count) | Bến phao: $($occBerths.Count) | Tàu lai: $($occTugs.Count) | Cẩu: $($occCranes.Count)" -ForegroundColor Green

# ============================================================
# Ghi ra data.jsx — giữ nguyên PEOPLE/ME/personById thủ công (mock),
# chỉ thay phần OCC_* bằng data thật vừa lấy.
# ============================================================
function ToJs($obj) {
  # -InputObject (không pipe) để tránh PowerShell "unroll" mảng rỗng thành không có gì
  $json = ConvertTo-Json -InputObject $obj -Depth 12 -Compress:$false
  if ($null -eq $obj -or ($obj -is [array] -and $obj.Count -eq 0)) { return "[]" }
  return $json
}

$occDayFracJs = @'
const occDayFrac = (str) => {
  if (!str) return null;
  const [d, t] = str.split(" ");
  const day = parseInt(d.split("-")[2], 10);
  const [h, m] = t.split(":").map(Number);
  return day + (h + m / 60) / 24;
};
'@

$peopleBlock = @'
/* Mock data — Vinalogistics TTOS */

const PEOPLE = [
  { id: "u1",  name: "Nguyễn Văn An",       short: "NVA", role: "TGĐ",                       dept: "BOD",                color: 0 },
  { id: "u2",  name: "Trần Thị Mai",         short: "TTM", role: "PTGĐ Khai thác",            dept: "BOD",                color: 1 },
  { id: "u3",  name: "Phạm Minh Tuấn",       short: "PMT", role: "GĐ Khai thác",              dept: "Khai thác",          color: 2 },
];
const ME = PEOPLE[2];

const personById = id => PEOPLE.find(p => p.id === id);
'@

$out = @()
$out += $peopleBlock
$out += ""
$out += "/* ============================================================"
$out += " * OCC — Operations Command Center (BOD view)"
$out += " * Xuất tự động từ database ETVNL lúc $($now.ToString('yyyy-MM-dd HH:mm')) bởi scripts/export-occ-data.ps1"
$out += " * Chạy lại script này để làm mới. XEM GHI CHÚ TODO rải rác bên dưới —"
$out += " * vài field (revenue, contract, pic, progress %, phân loại tug task)"
$out += " * còn là giá trị tạm/ước lượng, cần bổ sung nguồn dữ liệu thật."
$out += " * ============================================================ */"
$out += ""
$out += "const OCC_WINDOW = $(ToJs $occWindow);"
$out += ""
$out += "const OCC_BERTHS = $(ToJs $occBerths);"
$out += ""
$out += "const OCC_TUGS = $(ToJs $occTugs);"
$out += ""
$out += "const OCC_CRANES = $(ToJs $occCranes);"
$out += ""
$out += $occDayFracJs
$out += ""
$out += "const OCC_JOBS = $(ToJs $occJobs);"
$out += ""
$out += "const OCC_DVHH = $(ToJs $occDvhh);"
$out += ""
$out += @'
const OCC_TUG_TASK_TYPES = {
  mooring:       { label: "Hỗ trợ cập phao",  color: "#0E7A38" },
  unmooring:     { label: "Hỗ trợ rời phao",  color: "#1E5FB7" },
  tow_in:        { label: "Lai dắt vào cảng", color: "#E85D2F" },
  tow_out:       { label: "Lai dắt ra phao",  color: "#B45309" },
  anchor:        { label: "Hỗ trợ neo",       color: "#7C5BE0" },
  shift:         { label: "Di chuyển vị trí", color: "#5A6472" },
  rescue:        { label: "Khẩn cấp / cứu hộ",color: "#B91C1C" },
};
'@
$out += ""
$out += "const OCC_TUG_TASKS = $(ToJs $occTugTasks);"
$out += ""
$out += @'
Object.assign(window, {
  PEOPLE, ME, personById,
  OCC_WINDOW, OCC_BERTHS, OCC_TUGS, OCC_CRANES, OCC_JOBS, OCC_DVHH, occDayFrac,
  OCC_TUG_TASKS, OCC_TUG_TASK_TYPES,
});
'@

($out -join "`n") | Out-File -FilePath $OutFile -Encoding utf8 -NoNewline
Write-Host "Đã ghi $OutFile" -ForegroundColor Green
