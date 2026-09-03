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
  Lấy toàn bộ job/DVHH/tug-task có ETA/ETD chồng lấn với TRỌN VẸN 4 tháng
  dương lịch quanh hôm nay (2 tháng đầy đủ trước + tháng hiện tại + 1 tháng
  đầy đủ sau — xem $LookBackMonths/$LookForwardMonths). UI cho chọn xem
  đúng 1 trong các tháng đó qua dropdown, mỗi tháng luôn đầy đủ từ ngày 1
  đến ngày cuối, không bị cắt cụt giữa chừng. Loại các booking có trạng
  thái Reject/Cancel/Important/Accident. Chạy lại bất cứ khi nào muốn làm
  mới dữ liệu hoặc mở rộng thêm phạm vi xem — ghi đè trực tiếp lên data.jsx,
  bạn tự `git diff` / `git commit`
  khi thấy dữ liệu ổn (đúng tinh thần "cập nhật thủ công" đã chọn).
#>
param(
  [string]$Server   = $(if ($env:OCC_DB_SERVER)   { $env:OCC_DB_SERVER }   else { "192.168.1.6" }),
  [string]$Database = $(if ($env:OCC_DB_NAME)     { $env:OCC_DB_NAME }     else { "ETVNL" }),
  [string]$User     = $(if ($env:OCC_DB_USER)     { $env:OCC_DB_USER }     else { "vnl" }),
  [string]$Password = $(if ($env:OCC_DB_PASSWORD) { $env:OCC_DB_PASSWORD } else { $null }),
  [string]$OutFile  = "$PSScriptRoot\..\data.jsx"
)
# Gantt/Timeline vẽ theo ngày lệch (offset) so với OCC_WINDOW.refDate — không còn bị
# khoá trong 1 tháng dương lịch, nên job/task vắt qua ranh giới tháng vẫn hiển thị đúng.

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

# ============================================================
# OCC_WINDOW — lấy TRỌN VẸN từng tháng dương lịch (không cắt giữa tháng),
# quanh tháng hiện tại: LookBackMonths tháng đầy đủ về trước + tháng hiện
# tại + LookForwardMonths tháng đầy đủ về sau. Trước đây dùng cửa sổ theo
# SỐ NGÀY cố định (vd -45/+15) nên khi chọn xem tháng hiện tại trên UI,
# tháng đó bị cắt cụt giữa chừng (vd tháng 8 chỉ thấy tới ngày 18) do
# range chỉ nhìn tới trước 15 ngày — không đủ hết tháng. Giờ tính theo
# ranh giới THÁNG để mỗi tháng trong bộ chọn luôn đầy đủ từ ngày 1 đến
# ngày cuối cùng.
$LookBackMonths    = 2   # số tháng đầy đủ nhìn lại quá khứ (không tính tháng hiện tại)
$LookForwardMonths = 1   # số tháng đầy đủ nhìn tới tương lai (không tính tháng hiện tại)
$currentMonthStart = Get-Date -Year $now.Year -Month $now.Month -Day 1 -Hour 0 -Minute 0 -Second 0
$refDate    = $currentMonthStart.AddMonths(-$LookBackMonths)
$rangeStart = $refDate
$rangeEnd   = $currentMonthStart.AddMonths($LookForwardMonths + 1).AddSeconds(-1)   # 23:59:59 ngày cuối tháng cuối cùng
$windowDays = [int]($rangeEnd.Date - $refDate.Date).TotalDays + 1

$occWindow = [ordered]@{
  refDate   = $refDate.ToString("yyyy-MM-dd")   # ngày dương lịch thật của cột lưới số 1
  startDay  = 1
  endDay    = $windowDays
  month     = $now.Month      # tháng/năm/ngày THẬT của hôm nay — chỉ dùng để hiển thị nhãn, không dùng để vẽ vị trí cột
  year      = $now.Year
  todayDate = $now.Day
  todayCol  = [int]($now.Date - $refDate.Date).TotalDays + 1   # cột lưới (offset) tương ứng với hôm nay
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

  # ---- Các DỊCH VỤ con của job (đúng như bảng "BẢNG DỊCH VỤ" trên hệ thống thật):
  # 1 JobCode (BookingCenter) gồm nhiều BookingCenterService — ServiceId 1 = DVHH
  # (hàng hải: cập/rời/shifting...), 2 = Khai thác (làm hàng tại bến). Remark chính
  # là dòng mô tả người điều hành nhập ("VIET THUAN 80-03 - CẬP", "EPIC 05 - rời"...).
  $svcRows = Query "SELECT Id, ServiceId, BookingStatusId, IsMain, Remark FROM BookingCenterService WHERE BookingCenterId = @bc ORDER BY Id" -params @{ "@bc" = [int]$r.IDBookingCenter }
  $services = @()
  foreach ($sv in $svcRows.Rows) {
    $svStatusId = SafeInt $sv.BookingStatusId
    if ($null -ne $svStatusId -and $excludedStatus -contains $svStatusId) { continue }
    $services += [ordered]@{
      kind   = if ((SafeInt $sv.ServiceId) -eq 2) { "khai_thac" } else { "dvhh" }
      label  = if ([System.DBNull]::Value.Equals($sv.Remark)) { "" } else { "$($sv.Remark)".Trim() }
      status = if ($svStatusId -and $statusMap[$svStatusId]) { $statusMap[$svStatusId] } else { "planned" }
      isMain = [bool]$sv.IsMain
    }
  }

  # ---- Các CA LÀM HÀNG (khai thác) + THIẾT BỊ dùng cho từng ca.
  # ICDUploadingCargo (BookingType=3 = bến phao) ghi từng ca: mốc giờ, đã làm, còn lại
  # và DeviceTypeID -> ICDBookingDeviceType.Id -> IDNo dạng "<loại>_<id>";
  # loại 12 = FloatingCranes (tàu đặt cẩu / cẩu nổi) — đây là thiết bị KHAI THÁC thật sự,
  # khác hoàn toàn với tàu lai (dịch vụ hàng hải).
  $cargoOps = @()
  $qtyTotal = 0; $qtyFinish = 0; $qtyRemain = 0
  $opRows = Query @"
SELECT u.StartTime, u.EndTime, u.QtyTotal, u.QtyFinish, u.QtyRemain, fc.FloatingCraneName AS DeviceName
FROM ICDUploadingCargo u
LEFT JOIN ICDBookingDeviceType d ON d.Id = u.DeviceTypeID
LEFT JOIN FloatingCranes fc ON d.IDNo LIKE '12[_]%' AND fc.FloatingCraneID = TRY_CAST(SUBSTRING(d.IDNo, 4, 10) AS int)
WHERE u.BookingId = @bk AND u.BookingType = 3
ORDER BY u.StartTime, u.Id
"@ -params @{ "@bk" = $bookingId }
  foreach ($op in $opRows.Rows) {
    $f = if ([System.DBNull]::Value.Equals($op.QtyFinish)) { 0 } else { [decimal]$op.QtyFinish }
    $qtyFinish += $f
    if (-not [System.DBNull]::Value.Equals($op.QtyTotal))  { $qtyTotal  = [math]::Max($qtyTotal, [decimal]$op.QtyTotal) }
    if (-not [System.DBNull]::Value.Equals($op.QtyRemain)) { $qtyRemain = [decimal]$op.QtyRemain }
    $cargoOps += [ordered]@{
      from   = FmtDT $op.StartTime
      to     = FmtDT $op.EndTime
      qty    = FmtQty $f
      device = if ([System.DBNull]::Value.Equals($op.DeviceName)) { "" } else { "$($op.DeviceName)".Trim() }
    }
  }
  # Thiết bị khai thác đang/đã dùng cho job (gộp từ các ca, bỏ trùng)
  $equipment = @($cargoOps | ForEach-Object { $_.device } | Where-Object { $_ } | Select-Object -Unique)

  # Tiến độ THẬT theo sản lượng (thay cho ước lượng thô 0/50/100 theo trạng thái)
  $realProgress = if ($qtyTotal -gt 0) { [int][math]::Round(($qtyFinish / $qtyTotal) * 100) }
                  elseif ($status -eq "completed") { 100 } elseif ($status -eq "planned") { 0 } else { 50 }

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
    progress = $realProgress   # % theo sản lượng thật (QtyFinish/QtyTotal) khi có số liệu làm hàng
    start    = if ($vd -and -not [System.DBNull]::Value.Equals($vd.TimeMooring)) { FmtDT $vd.TimeMooring } else { FmtDT $r.ETA }
    end      = if ($vd -and -not [System.DBNull]::Value.Equals($vd.ToLeave))    { FmtDT $vd.ToLeave }    else { FmtDT $r.ETD }
    eta      = FmtDT $r.ETA
    etd      = FmtDT $r.ETD
    revenue  = "0 ₫"   # chưa tìm thấy nguồn doanh thu/giá dịch vụ đáng tin cậy trong DB — cần xác nhận thêm
    resources = $resources
    services  = $services     # các dịch vụ con: hàng hải (DVHH) + khai thác
    cargoOps  = $cargoOps     # từng ca làm hàng: giờ, sản lượng, thiết bị
    equipment = $equipment    # thiết bị khai thác đã dùng (cẩu nổi / tàu đặt cẩu)
    qtyTotal  = FmtQty $qtyTotal
    qtyFinish = FmtQty $qtyFinish
    qtyRemain = FmtQty $qtyRemain
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
  # DVHH (đặc biệt lai dắt) thường là việc ngắn (15 phút - vài giờ) — nhân viên hay
  # không quay lại cập nhật status hành chính thành "hoàn thành" sau khi xong việc,
  # nên trạng thái hiển thị cho BOD phải suy theo GIỜ THỰC TẾ so với ETA/ETD, không
  # thể tin tuyệt đối vào BookingStatusID (trừ khi hệ thống đã đánh dấu "delayed" —
  # tín hiệu đó vẫn có giá trị dù chưa tới giờ bắt đầu).
  $dvhhStatus = if ($meta.ETD -lt $now) { "completed" }
                elseif ($meta.ETA -le $now -and $meta.ETD -ge $now) { "in_progress" }
                elseif ($status -eq "delayed") { "delayed" }
                else { "planned" }
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
      status   = $dvhhStatus
      revenue  = "0 ₫"
    }
  }

  # OCC_TUG_TASKS: mỗi tàu lai (bỏ sà lan — schema chỉ cho phép tugId trỏ về OCC_TUGS)
  # trong nhóm này = 1 task, dùng để vẽ Gantt chi tiết theo từng tàu lai.
  # Real DB KHÔNG có phân loại mooring/unmooring/tow_in/tow_out/anchor/shift/rescue
  # rõ ràng như OCC_TUG_TASK_TYPES — tạm gán "tow_in" cho tất cả.
  # OCC_TUG_TASKS.status là trạng thái THEO THỜI GIAN THỰC (done/in_progress/planned
  # theo DATA_SCHEMA.md), KHÁC với status hành chính của booking (planned/in_progress/
  # delayed/completed dùng cho job/DVHH) — so ETA/ETD với giờ chạy script để tính,
  # tránh việc 1 task đã qua giờ nhưng vẫn hiện "Sắp tới" chỉ vì booking status hành
  # chính chưa được cập nhật trên hệ thống thật.
  $taskStatus = if ($meta.ETD -lt $now) { "done" }
                elseif ($meta.ETA -le $now -and $meta.ETD -ge $now) { "in_progress" }
                else { "planned" }

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
      status   = $taskStatus
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
// Mọi vị trí trên Gantt đều tính theo SỐ NGÀY LỆCH so với OCC_WINDOW.refDate
// (ngày dương lịch thật của cột lưới số 1) — không giả định mọi thứ nằm
// trong 1 tháng, nên job/task vắt qua ranh giới tháng vẫn vẽ đúng vị trí.
const occRefEpoch = () => {
  const [ry, rmo, rda] = OCC_WINDOW.refDate.split("-").map(Number);
  return Date.UTC(ry, rmo - 1, rda);
};
const occDayFrac = (str) => {
  if (!str) return null;
  const [d, t] = str.split(" ");
  const [y, mo, da] = d.split("-").map(Number);
  const [h, m] = t.split(":").map(Number);
  const dayOffset = Math.round((Date.UTC(y, mo - 1, da) - occRefEpoch()) / 86400000);
  return (dayOffset + 1) + (h + m / 60) / 24;
};
// Đổi ngược: cột lưới (offset, có thể có phần thập phân giờ) -> Date thật (UTC)
// để hiển thị nhãn ngày/tháng/thứ đúng cho từng cột, kể cả khi cửa sổ vắt qua
// nhiều tháng khác nhau.
const occColToDate = (col) => {
  const dt = new Date(occRefEpoch());
  dt.setUTCDate(dt.getUTCDate() + (Math.floor(col) - 1));
  return dt;
};
// Chiều ngược lại occColToDate: cho năm/tháng/ngày dương lịch thật -> cột lưới
// tương ứng (offset so với refDate) — dùng để chọn hiển thị đúng 1 tháng cụ thể.
const occColForDate = (y, mo, da) => {
  const dayOffset = Math.round((Date.UTC(y, mo - 1, da) - occRefEpoch()) / 86400000);
  return dayOffset + 1;
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
  OCC_WINDOW, OCC_BERTHS, OCC_TUGS, OCC_CRANES, OCC_JOBS, OCC_DVHH, occDayFrac, occColToDate, occColForDate,
  OCC_TUG_TASKS, OCC_TUG_TASK_TYPES,
});
'@

($out -join "`n") | Out-File -FilePath $OutFile -Encoding utf8 -NoNewline
Write-Host "Đã ghi $OutFile" -ForegroundColor Green
