# OCC Dashboard — Data Schema

Tài liệu mô tả toàn bộ dữ liệu mà dashboard OCC (Trung tâm Điều hành Vận hành) cần để hiển thị. Hiện tại các bảng này được hard-code làm mock data trong [`data.jsx`](data.jsx) — khi có database thật, chỉ cần điền đúng các field dưới đây (hoặc export ra JSON đúng shape này) là dashboard chạy được ngay, không cần sửa code.

**8 thực thể (entities)**: `PEOPLE`, `OCC_WINDOW`, `OCC_BERTHS`, `OCC_TUGS`, `OCC_CRANES`, `OCC_JOBS`, `OCC_DVHH`, `OCC_TUG_TASKS` (+ `OCC_TUG_TASK_TYPES` là bảng tra cứu tĩnh, không cần data động).

---

## Sơ đồ quan hệ (foreign keys)

```
PEOPLE.id ─────────────┬──< OCC_JOBS.pic
                        └──< OCC_JOBS.logs[].by

OCC_BERTHS.id ─────────┬──< OCC_JOBS.berthId
                        └──< OCC_TUG_TASKS.berth   (optional)

OCC_TUGS.id / OCC_CRANES.id ──< OCC_JOBS.resources[].id   (khi resources[].type = "tug" | "crane")
OCC_TUGS.id ───────────┬──< OCC_TUG_TASKS.tugId
                        └──< OCC_DVHH.tugs[]

OCC_JOBS.id ───────────────< OCC_TUG_TASKS.linkJobId      (optional — task này phục vụ job nào)
OCC_DVHH.id ───────────────< OCC_TUG_TASKS.dvhhId         (optional — task này thuộc dịch vụ hàng hải nào)
OCC_TUG_TASK_TYPES key ────< OCC_TUG_TASKS.type
```

---

## 1. `PEOPLE` — Danh sách người phụ trách

Chỉ cần cho các trường `pic` (phụ trách job) và `logs[].by` (ai ghi log) hiển thị avatar + tên.

| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| `id` | string | ✓ | ID duy nhất, vd `"u9"` |
| `name` | string | ✓ | Họ tên đầy đủ |
| `short` | string | ✓ | Chữ viết tắt 3 ký tự hiển thị trên avatar tròn, vd `"NTS"` |
| `role` | string | ✓ | Chức danh, vd `"Thuyền trưởng"` |
| `dept` | string | ✓ | Phòng ban, vd `"Hàng hải"` |
| `color` | number (0–7) | ✓ | Chỉ số màu avatar (8 màu định sẵn trong CSS, chỉ cần số 0-7, dashboard tự chọn màu) |

```json
{ "id": "u9", "name": "Ngô Thanh Sơn", "short": "NTS", "role": "Thuyền trưởng", "dept": "Hàng hải", "color": 0 }
```

---

## 2. `OCC_WINDOW` — Cấu hình khung thời gian đang xem

⚠️ **Đây là object cấu hình duy nhất (không phải mảng)** — quyết định "hôm nay" là ngày nào và Gantt/Timeline hiển thị khoảng nào.

| Field | Type | Mô tả |
|---|---|---|
| `startDay` | number | Ngày bắt đầu khung nhìn mặc định (ngày trong tháng, vd `18`) |
| `endDay` | number | Ngày kết thúc khung nhìn mặc định, vd `31` |
| `month` | number | Tháng hiện tại (1-12) |
| `year` | number | Năm hiện tại |
| `todayDay` | number | Ngày hôm nay (dùng vẽ đường mốc "HÔM NAY" trên Gantt) |
| `todayHour` | number | Giờ hiện tại dạng thập phân, vd `10.5` = 10:30 |

```json
{ "startDay": 18, "endDay": 31, "month": 5, "year": 2026, "todayDay": 20, "todayHour": 10.5 }
```

> ⚠️ **Lưu ý quan trọng**: hiện tại con số này đang **hard-code cố định** (không tự lấy ngày giờ thực của hệ thống). Nếu muốn dashboard tự động theo ngày thực tế mỗi khi mở, cần một thay đổi nhỏ trong code (báo tôi khi có data thật, tôi sẽ làm luôn phần này).

---

## 3. `OCC_BERTHS` — Bến phao

| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| `id` | string | ✓ | ID duy nhất, vd `"BP-08"` |
| `group` | string | ✓ | Tên nhóm/khu vực để gộp hiển thị, vd `"Bến phao Vinalogistics"` |
| `label` | string | ✓ | Tên hiển thị (thường trùng `id`) |
| `cap` | string | ✓ | Sức chứa, vd `"80.000 DWT"` |

```json
{ "id": "BP-08", "group": "Bến phao Vinalogistics", "label": "BP-08", "cap": "80.000 DWT" }
```

---

## 4. `OCC_TUGS` — Đội tàu lai (VNL)

| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| `id` | string | ✓ | Tên/ID tàu lai, vd `"VNL03"`, `"VNL RUBY"` |
| `hp` | string | ✓ | Công suất, vd `"3.200 HP"` |
| `status` | enum | ✓ | `"active"` \| `"maintenance"` |

```json
{ "id": "VNL03", "hp": "3.200 HP", "status": "active" }
```

---

## 5. `OCC_CRANES` — Cẩu nổi ICD

| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| `id` | string | ✓ | ID cẩu, vd `"ICD-VNL03"` |
| `cap` | string | ✓ | Tải trọng, vd `"200T"` |
| `status` | enum | ✓ | `"active"` \| `"maintenance"` |

```json
{ "id": "ICD-VNL03", "cap": "200T", "status": "active" }
```

---

## 6. `OCC_JOBS` — Job-tàu (thực thể trung tâm)

Mỗi job = một lượt tàu vào cảng làm hàng tại bến phao.

| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| `id` | string | ✓ | ID duy nhất, vd `"JOB-26-0518-LH3"` |
| `vessel` | object | ✓ | Xem bảng con bên dưới |
| `cargo` | object | ✓ | Xem bảng con bên dưới |
| `berthId` | string (FK → `OCC_BERTHS.id`) | ✓ | Job đang ở bến phao nào |
| `customer` | string | ✓ | Tên khách hàng |
| `contract` | string | ✓ | Số hợp đồng |
| `pic` | string (FK → `PEOPLE.id`) | ✓ | Người phụ trách (thường là thuyền trưởng/PIC) |
| `status` | enum | ✓ | `"planned"` \| `"in_progress"` \| `"delayed"` \| `"completed"` |
| `progress` | number (0–100) | ✓ | % tiến độ khai thác |
| `start` | datetime string | ✓ | Bắt đầu khai thác thực tế/kế hoạch — format `"YYYY-MM-DD HH:MM"` |
| `end` | datetime string | ✓ | Kết thúc khai thác — cùng format |
| `eta` | datetime string | ✓ | ETA tàu tới |
| `etd` | datetime string | ✓ | ETD tàu rời |
| `revenue` | string | ✓ | Doanh thu, format `"<số>.<số>.<số> ₫"` — xem lưu ý format số bên dưới |
| `resources` | array | — | Danh sách tàu lai/cẩu/sà lan phục vụ job này. Xem bảng con |
| `notes` | string | — | Ghi chú tự do, có thể để `""` |
| `risks` | array | — | Rủi ro/cảnh báo. Xem bảng con |
| `logs` | array | — | Nhật ký cập nhật tiến độ. Xem bảng con |

### `vessel` (object con của job)
| Field | Type | Mô tả |
|---|---|---|
| `name` | string | Tên tàu, vd `"MV ATLANTIC PIONEER"` |
| `flag` | string | Mã quốc tịch 2 ký tự, vd `"PA"` |
| `dwt` | string | Trọng tải, vd `"76.500 DWT"` |
| `imo` | string | Số IMO |
| `loa` | string | Chiều dài tàu, vd `"225 m"` |
| `type` | string | Loại tàu, vd `"Bulk carrier"`, `"General cargo"` (tự do, không giới hạn enum) |

### `cargo` (object con của job)
| Field | Type | Mô tả |
|---|---|---|
| `name` | string | Tên hàng hoá, vd `"Quặng sắt rời"` |
| `qty` | string | Khối lượng, format `"<số> MT"` — **dashboard có parse số từ chuỗi này để tính tổng sản lượng**, xem lưu ý bên dưới |
| `op` | string | Loại thao tác: `"Dỡ hàng"` \| `"Xếp hàng"` \| `"Chuyển tải"` (tự do) |

### `resources[]` (mảng con của job)
| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| `type` | enum | ✓ | `"tug"` \| `"crane"` \| `"barge"` |
| `id` | string (FK → `OCC_TUGS.id` / `OCC_CRANES.id`, hoặc tự do nếu `type="barge"`) | ✓ | ID tài sản được điều động |
| `from` | datetime string | ✓ | Bắt đầu phục vụ job này |
| `to` | datetime string | ✓ | Kết thúc phục vụ |
| `role` | string | ✓ | Mô tả vai trò, vd `"Hỗ trợ cập phao"`, `"Cẩu chính 250T"` |

### `risks[]` (mảng con của job)
| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| `level` | enum | ✓ | `"low"` \| `"mid"` \| `"high"` (hiện UI chỉ phân biệt `"high"` = màu đỏ, còn lại = màu vàng cảnh báo) |
| `text` | string | ✓ | Nội dung rủi ro |

### `logs[]` (mảng con của job)
| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| `at` | datetime string | ✓ | Thời điểm ghi log — format `"YYYY-MM-DD HH:MM"` |
| `by` | string (FK → `PEOPLE.id`) | ✓ | Người ghi log |
| `text` | string | ✓ | Nội dung cập nhật |

```json
{
  "id": "JOB-26-0518-LH3",
  "vessel": { "name": "MV ATLANTIC PIONEER", "flag": "PA", "dwt": "76.500 DWT", "imo": "9512347", "loa": "225 m", "type": "Bulk carrier" },
  "cargo": { "name": "Quặng sắt rời", "qty": "72.500 MT", "op": "Dỡ hàng" },
  "berthId": "BP-08",
  "customer": "CTCP Thép Hoà Phát Dung Quất",
  "contract": "HĐ-2026-HP-018",
  "pic": "u9",
  "status": "in_progress",
  "progress": 58,
  "start": "2026-05-18 14:00",
  "end": "2026-05-22 06:00",
  "eta": "2026-05-18 12:00",
  "etd": "2026-05-22 08:00",
  "revenue": "2.180.000.000 ₫",
  "resources": [
    { "type": "tug", "id": "VNL03", "from": "2026-05-18 12:00", "to": "2026-05-18 15:30", "role": "Hỗ trợ cập phao" },
    { "type": "crane", "id": "ICD-VNL03", "from": "2026-05-18 16:00", "to": "2026-05-22 04:00", "role": "Cẩu chính 250T" },
    { "type": "barge", "id": "SL-101", "from": "2026-05-19 08:00", "to": "2026-05-21 20:00", "role": "Sà lan chuyển tải" }
  ],
  "notes": "Khách yêu cầu xong trước 22/05 để chuyển đoàn xe nội bộ.",
  "risks": [
    { "level": "mid", "text": "Dự báo gió cấp 6 ngày 22/05 — cần theo dõi." }
  ],
  "logs": [
    { "at": "2026-05-20 09:30", "by": "u9", "text": "Đã dỡ 42.000 / 72.500 MT — năng suất 3.500 MT/ca." }
  ]
}
```

---

## 7. `OCC_DVHH` — Dịch vụ hàng hải độc lập

Các lượt lai dắt/hỗ trợ neo **không gắn với job bến phao** (tàu đi qua, không cập bến phao mình quản lý).

| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| `id` | string | ✓ | ID duy nhất, vd `"DV-2026-0520-CK"` |
| `title` | string | ✓ | Mô tả dịch vụ, vd `"Lai dắt MV CARGO KING vào Cảng Hải Phòng"` |
| `from` | datetime string | ✓ | Bắt đầu |
| `to` | datetime string | ✓ | Kết thúc |
| `tugs` | string[] (FK → `OCC_TUGS.id`) | ✓ | Danh sách tàu lai tham gia |
| `customer` | string | ✓ | Khách hàng |
| `status` | enum | ✓ | `"planned"` \| `"in_progress"` \| `"delayed"` \| `"completed"` |
| `revenue` | string | ✓ | Doanh thu, cùng format với job |

```json
{ "id": "DV-2026-0520-CK", "title": "Lai dắt MV CARGO KING vào Cảng Hải Phòng", "from": "2026-05-20 06:00", "to": "2026-05-20 09:30", "tugs": ["VNL07", "VNL VOYAGER"], "customer": "Cảng Hải Phòng", "status": "in_progress", "revenue": "85.000.000 ₫" }
```

---

## 8. `OCC_TUG_TASK_TYPES` — Bảng tra cứu loại tác vụ (tĩnh, không cần data động)

Đây là bảng cấu hình cố định, đã có sẵn trong code, **không cần cung cấp data** — liệt kê ở đây để biết `OCC_TUG_TASKS.type` chấp nhận giá trị nào:

| Key | Nhãn hiển thị |
|---|---|
| `mooring` | Hỗ trợ cập phao |
| `unmooring` | Hỗ trợ rời phao |
| `tow_in` | Lai dắt vào cảng |
| `tow_out` | Lai dắt ra phao |
| `anchor` | Hỗ trợ neo |
| `shift` | Di chuyển vị trí |
| `rescue` | Khẩn cấp / cứu hộ |

---

## 9. `OCC_TUG_TASKS` — Tác vụ chi tiết của từng tàu lai

Đây là dữ liệu **chi tiết nhất** (5-10 tác vụ/tàu lai/ngày hoạt động) — dùng vẽ Gantt chi tiết và popover "lịch trực trong ngày" của mỗi tàu lai.

| Field | Type | Bắt buộc | Mô tả |
|---|---|---|---|
| `id` | string | ✓ | ID duy nhất, vd `"TT-2001"` |
| `tugId` | string (FK → `OCC_TUGS.id`) | ✓ | Tàu lai thực hiện tác vụ |
| `from` | datetime string | ✓ | Bắt đầu |
| `to` | datetime string | ✓ | Kết thúc |
| `type` | enum (FK → `OCC_TUG_TASK_TYPES` key) | ✓ | Xem bảng mục 8 |
| `vessel` | string | ✓ | Tên tàu được phục vụ (hoặc mô tả nếu là `shift`, vd `"Di chuyển HG → LH"`) |
| `customer` | string | ✓ | Khách hàng (dùng `"Nội bộ"` nếu là di chuyển nội bộ) |
| `berth` | string (FK → `OCC_BERTHS.id`) | — | Bến phao liên quan, nếu có |
| `linkJobId` | string (FK → `OCC_JOBS.id`) | — | Job-tàu liên quan, nếu tác vụ này phục vụ trực tiếp 1 job |
| `dvhhId` | string (FK → `OCC_DVHH.id`) | — | Dịch vụ hàng hải liên quan, nếu có |
| `status` | enum | ✓ | `"done"` \| `"in_progress"` \| `"planned"` |
| `revenue` | string | ✓ | Doanh thu tác vụ, dùng `"0 ₫"` nếu miễn phí (vd tác vụ nội bộ) |

```json
{ "id": "TT-2001", "tugId": "VNL03", "from": "2026-05-20 01:00", "to": "2026-05-20 01:45", "type": "mooring", "vessel": "MV NORTHERN PEARL", "customer": "Hoà Phát", "berth": "BP-03", "status": "done", "revenue": "12.500.000 ₫" }
```

---

## ⚠️ Lưu ý quan trọng khi chuẩn bị data

1. **Định dạng ngày giờ**: mọi field ngày giờ dùng chuỗi `"YYYY-MM-DD HH:MM"` (24h, có khoảng trắng giữa ngày và giờ — **không phải** ISO chuẩn `T`). Ví dụ đúng: `"2026-05-20 09:30"`.

2. **Số tiền/khối lượng đang là chuỗi đã format sẵn**, không phải số thuần: `revenue: "2.180.000.000 ₫"`, `cargo.qty: "72.500 MT"`. Code hiện tại **bóc tách số bằng cách xoá hết ký tự không phải chữ số** (vd để tính tổng sản lượng tháng), nên:
   - Dùng dấu `.` làm phân cách hàng nghìn (kiểu Việt Nam), **không dùng dấu phẩy**.
   - Không được có phần thập phân trong các số này.
   - **Đề xuất**: nếu data từ database của bạn là số thuần (integer), tôi khuyên nên gửi số thuần (vd `revenue: 2180000000`) — tôi sẽ sửa code để tự format hiển thị đúng chuẩn Việt Nam. Cách này bền hơn nhiều so với phải tự format chuỗi từ phía database. Báo tôi nếu muốn đổi theo hướng này.

3. **`OCC_WINDOW` đang hard-code**, không tự lấy ngày thực. Khi có data thật, nói tôi biết để sửa thành tự động lấy ngày hệ thống.

4. **Toàn bộ ID là string tự chọn**, miễn duy nhất trong phạm vi từng bảng và khớp đúng ở các field FK tham chiếu tới.

5. **Không bắt buộc phải giữ nguyên field optional** (`berth`, `linkJobId`, `dvhhId`, `notes`, `resources`, `risks`, `logs`) — có thể bỏ qua hoặc để mảng rỗng `[]` / chuỗi rỗng `""` nếu không có dữ liệu.

---

Khi bạn có data thật (dù là file JSON/CSV export hay kết nối API), báo tôi — tôi sẽ:
- Nạp trực tiếp vào `data.jsx` nếu là data tĩnh, hoặc
- Viết lớp `fetch()` gọi API thật nếu bạn có backend, và
- Sửa phần format số/ngày nếu bạn muốn dùng số thuần thay vì chuỗi đã format.
