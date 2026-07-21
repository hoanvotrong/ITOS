/* Mock data — Vinalogistics TTOS */

const PEOPLE = [
  { id: "u1",  name: "Nguyễn Văn An",       short: "NVA", role: "TGĐ",                       dept: "BOD",                color: 0 },
  { id: "u2",  name: "Trần Thị Mai",         short: "TTM", role: "PTGĐ Khai thác",            dept: "BOD",                color: 1 },
  { id: "u3",  name: "Phạm Minh Tuấn",       short: "PMT", role: "GĐ Khai thác",              dept: "Khai thác",          color: 2 },
  { id: "u4",  name: "Lê Hoàng Phương",      short: "LHP", role: "GĐ Hàng hải",               dept: "Hàng hải",           color: 3 },
  { id: "u5",  name: "Vũ Thanh Hà",          short: "VTH", role: "TP. Kinh doanh",            dept: "Kinh doanh",         color: 4 },
  { id: "u6",  name: "Hoàng Quốc Việt",      short: "HQV", role: "TP. Khai thác",             dept: "Khai thác",          color: 5 },
  { id: "u7",  name: "Đỗ Thị Lan",           short: "ĐTL", role: "TP. Kỹ thuật Vật tư",       dept: "KTVT",               color: 6 },
  { id: "u8",  name: "Bùi Đức Khải",         short: "BĐK", role: "Chuyên viên Khai thác",     dept: "Khai thác",          color: 7 },
  { id: "u9",  name: "Ngô Thanh Sơn",        short: "NTS", role: "Thuyền trưởng",             dept: "Hàng hải",           color: 0 },
  { id: "u10", name: "Trịnh Văn Bảo",        short: "TVB", role: "Chuyên viên KTVT",          dept: "KTVT",               color: 1 },
  { id: "u11", name: "Phan Thị Diễm",        short: "PTD", role: "Kế toán trưởng",            dept: "Tài chính",          color: 2 },
  { id: "u12", name: "Đinh Hữu Phước",       short: "ĐHP", role: "TP. QHSE",                  dept: "QHSE",               color: 3 },
  { id: "u13", name: "Cao Thuỳ Linh",        short: "CTL", role: "Chuyên viên HC",            dept: "Hành chính",         color: 4 },
];
const ME = PEOPLE[2]; // Phạm Minh Tuấn — GĐ Khai thác

const personById = id => PEOPLE.find(p => p.id === id);

/* ============================================================
 * OCC — Operations Command Center (BOD view)
 *   Bến phao · Tàu lai DVHH · Cẩu nổi VNL · Sà lan
 * Timeline window: 18/05/2026 → 31/05/2026 (14 days)
 * ============================================================ */

const OCC_WINDOW = { startDay: 18, endDay: 31, month: 5, year: 2026, todayDay: 20, todayHour: 10.5 };

const OCC_BERTHS = [
  { id: "BP-02",      group: "Bến phao Vinalogistics", label: "BP-02",      cap: "50.000 DWT" },
  { id: "BP-03",      group: "Bến phao Vinalogistics", label: "BP-03",      cap: "50.000 DWT" },
  { id: "BP-08",      group: "Bến phao Vinalogistics", label: "BP-08",      cap: "80.000 DWT" },
  { id: "BP-09",      group: "Bến phao Vinalogistics", label: "BP-09",      cap: "80.000 DWT" },
  { id: "VNL-BOU-11", group: "Bến phao Vinalogistics", label: "VNL-BOU-11", cap: "50.000 DWT" },
];

const OCC_TUGS = [
  { id: "VNL03",         hp: "3.200 HP", status: "active" },
  { id: "VNL05",         hp: "3.200 HP", status: "active" },
  { id: "VNL07",         hp: "2.800 HP", status: "active" },
  { id: "VNL EXPLORER",  hp: "2.800 HP", status: "maintenance" },
  { id: "VNL VOYAGER",   hp: "3.500 HP", status: "active" },
  { id: "VNL RUBY",      hp: "3.500 HP", status: "active" },
  { id: "VNL RELIANCE",  hp: "3.800 HP", status: "active" },
  { id: "VNL VISION",    hp: "3.500 HP", status: "active" },
  { id: "VNL FUTURE",    hp: "3.800 HP", status: "active" },
];

const OCC_CRANES = [
  { id: "ICD-VNL01", cap: "150T", status: "active" },
  { id: "ICD-VNL02", cap: "150T", status: "active" },
  { id: "ICD-VNL03", cap: "200T", status: "active" },
  { id: "ICD-VNL05", cap: "200T", status: "active" },
  { id: "ICD-VNL06", cap: "100T", status: "maintenance" },
  { id: "ICD-VNL07", cap: "120T", status: "active" },
];

/* Helper: parse "YYYY-MM-DD HH:MM" -> day-fraction in May 2026 (e.g. 18.5 = 18/05 12:00) */
const occDayFrac = (str) => {
  if (!str) return null;
  const [d, t] = str.split(" ");
  const day = parseInt(d.split("-")[2], 10);
  const [h, m] = t.split(":").map(Number);
  return day + (h + m / 60) / 24;
};

const OCC_JOBS = [
  {
    id: "JOB-26-0518-LH3",
    vessel: { name: "MV ATLANTIC PIONEER", flag: "PA", dwt: "76.500 DWT", imo: "9512347", loa: "225 m", type: "Bulk carrier" },
    cargo: { name: "Quặng sắt rời", qty: "72.500 MT", op: "Dỡ hàng" },
    berthId: "BP-08",
    customer: "CTCP Thép Hoà Phát Dung Quất",
    contract: "HĐ-2026-HP-018",
    pic: "u9",
    status: "in_progress",
    progress: 58,
    start: "2026-05-18 14:00",
    end:   "2026-05-22 06:00",
    eta:   "2026-05-18 12:00",
    etd:   "2026-05-22 08:00",
    revenue: "2.180.000.000 ₫",
    resources: [
      { type: "tug",   id: "VNL03", from: "2026-05-18 12:00", to: "2026-05-18 15:30", role: "Hỗ trợ cập phao" },
      { type: "tug",   id: "VNL05", from: "2026-05-18 12:00", to: "2026-05-18 15:30", role: "Hỗ trợ cập phao" },
      { type: "crane", id: "ICD-VNL03",  from: "2026-05-18 16:00", to: "2026-05-22 04:00", role: "Cẩu chính 250T" },
      { type: "crane", id: "ICD-VNL03",  from: "2026-05-19 06:00", to: "2026-05-21 18:00", role: "Cẩu phụ 200T" },
      { type: "barge", id: "SL-101",  from: "2026-05-19 08:00", to: "2026-05-21 20:00", role: "Sà lan chuyển tải" },
      { type: "barge", id: "SL-102",  from: "2026-05-19 08:00", to: "2026-05-21 20:00", role: "Sà lan chuyển tải" },
    ],
    notes: "Khách yêu cầu xong trước 22/05 để chuyển đoàn xe nội bộ. Tiến độ vượt kế hoạch 6 giờ.",
    risks: [],
    logs: [
      { at: "2026-05-20 09:30", by: "u9", text: "Đã dỡ 42.000 / 72.500 MT — năng suất 3.500 MT/ca, dự kiến xong sớm 6h." },
      { at: "2026-05-19 18:45", by: "u9", text: "Cẩu VNL-09 hoạt động ổn định, không có sự cố." },
      { at: "2026-05-18 15:10", by: "u4", text: "Tàu đã cập phao LH-03, lai dắt hoàn tất an toàn." },
      { at: "2026-05-18 12:30", by: "u4", text: "Hoa tiêu lên tàu, bắt đầu lai dắt vào phao." },
    ],
  },
  {
    id: "JOB-26-0519-LH5",
    vessel: { name: "MV PACIFIC STAR", flag: "MH", dwt: "82.000 DWT", imo: "9678123", loa: "229 m", type: "Bulk carrier" },
    cargo: { name: "Than cám 6a", qty: "65.000 MT", op: "Chuyển tải" },
    berthId: "BP-09",
    customer: "Tập đoàn Điện lực Việt Nam (EVN)",
    contract: "HĐ-2026-EVN-024",
    pic: "u4",
    status: "in_progress",
    progress: 38,
    start: "2026-05-19 06:00",
    end:   "2026-05-24 18:00",
    eta:   "2026-05-19 04:00",
    etd:   "2026-05-24 20:00",
    revenue: "1.950.000.000 ₫",
    resources: [
      { type: "tug",   id: "VNL07", from: "2026-05-19 04:00", to: "2026-05-19 07:00", role: "Hỗ trợ cập phao" },
      { type: "tug",   id: "VNL VOYAGER", from: "2026-05-19 04:00", to: "2026-05-19 07:00", role: "Hỗ trợ cập phao" },
      { type: "crane", id: "ICD-VNL05",  from: "2026-05-19 08:00", to: "2026-05-24 16:00", role: "Cẩu chính 200T" },
      { type: "crane", id: "ICD-VNL07",  from: "2026-05-20 06:00", to: "2026-05-24 12:00", role: "Cẩu phụ 120T" },
      { type: "barge", id: "SL-103",  from: "2026-05-19 10:00", to: "2026-05-24 14:00", role: "Sà lan chuyển tải" },
      { type: "barge", id: "SL-104",  from: "2026-05-19 10:00", to: "2026-05-24 14:00", role: "Sà lan chuyển tải" },
      { type: "barge", id: "SL-105",  from: "2026-05-20 06:00", to: "2026-05-24 12:00", role: "Sà lan chuyển tải" },
    ],
    notes: "Sản lượng đạt 38%. Thời tiết tuần này khả quan, không cần dừng do gió.",
    risks: [
      { level: "mid", text: "Dự báo gió cấp 6 ngày 22/05 — cần theo dõi, có thể tạm dừng cẩu 4h." },
    ],
    logs: [
      { at: "2026-05-20 08:15", by: "u4", text: "Đã chuyển 24.700 / 65.000 MT. Sản lượng ổn định." },
      { at: "2026-05-19 09:10", by: "u4", text: "Cẩu VNL-04 bắt đầu xuống hàng." },
    ],
  },
  {
    id: "JOB-26-0517-HG1",
    vessel: { name: "MV ORIENT EXPRESS", flag: "SG", dwt: "55.000 DWT", imo: "9456789", loa: "190 m", type: "General cargo" },
    cargo: { name: "Clinker xi măng", qty: "48.000 MT", op: "Xếp hàng" },
    berthId: "VNL-BOU-11",
    customer: "Xi măng Vissai Hà Nam",
    contract: "HĐ-2026-VS-009",
    pic: "u9",
    status: "delayed",
    progress: 72,
    start: "2026-05-17 10:00",
    end:   "2026-05-20 22:00",
    eta:   "2026-05-17 08:00",
    etd:   "2026-05-20 23:00",
    revenue: "1.420.000.000 ₫",
    resources: [
      { type: "tug",   id: "VNL RUBY", from: "2026-05-17 08:00", to: "2026-05-17 11:00", role: "Hỗ trợ cập phao" },
      { type: "crane", id: "ICD-VNL01",  from: "2026-05-17 12:00", to: "2026-05-20 20:00", role: "Cẩu chính 150T" },
      { type: "crane", id: "ICD-VNL02",  from: "2026-05-17 12:00", to: "2026-05-20 20:00", role: "Cẩu phụ 150T" },
      { type: "barge", id: "SL-201",  from: "2026-05-17 12:00", to: "2026-05-20 18:00", role: "Sà lan chuyển tải" },
      { type: "barge", id: "SL-202",  from: "2026-05-17 12:00", to: "2026-05-20 18:00", role: "Sà lan chuyển tải" },
    ],
    notes: "Trễ tiến độ do mưa lớn 19/05 phải dừng cẩu 5h. Đang chạy bù ca đêm.",
    risks: [
      { level: "high", text: "Trễ 14h so với kế hoạch, có thể phát sinh phí lưu phao theo HĐ điều 8.2." },
    ],
    logs: [
      { at: "2026-05-20 07:30", by: "u9", text: "Đang chạy ca đêm bù. Dự kiến xong 21/05 04:00 (trễ 14h)." },
      { at: "2026-05-19 14:00", by: "u9", text: "Tạm dừng do mưa lớn, gió 6m/s." },
      { at: "2026-05-17 11:30", by: "u4", text: "Tàu đã cập phao HG-01." },
    ],
  },
  {
    id: "JOB-26-0521-HG2",
    vessel: { name: "MV NORTHERN SUN", flag: "VN", dwt: "48.500 DWT", imo: "9712345", loa: "182 m", type: "Bulk carrier" },
    cargo: { name: "Apatit", qty: "42.000 MT", op: "Dỡ hàng" },
    berthId: "BP-03",
    customer: "Phân bón Lâm Thao",
    contract: "HĐ-2026-LT-011",
    pic: "u4",
    status: "planned",
    progress: 0,
    start: "2026-05-21 06:00",
    end:   "2026-05-25 12:00",
    eta:   "2026-05-21 04:00",
    etd:   "2026-05-25 14:00",
    revenue: "1.260.000.000 ₫",
    resources: [
      { type: "tug",   id: "VNL03", from: "2026-05-21 04:00", to: "2026-05-21 07:00", role: "Hỗ trợ cập phao" },
      { type: "tug",   id: "VNL05", from: "2026-05-21 04:00", to: "2026-05-21 07:00", role: "Hỗ trợ cập phao" },
      { type: "crane", id: "ICD-VNL02",  from: "2026-05-21 08:00", to: "2026-05-25 10:00", role: "Cẩu chính 120T" },
      { type: "crane", id: "ICD-VNL05",  from: "2026-05-22 06:00", to: "2026-05-25 06:00", role: "Cẩu phụ 100T" },
      { type: "barge", id: "SL-101",  from: "2026-05-22 08:00", to: "2026-05-25 08:00", role: "Sà lan chuyển tải" },
    ],
    notes: "ETA xác nhận sáng 21/05 04:00. Cấp phép cảng vụ đã hoàn tất.",
    risks: [],
    logs: [
      { at: "2026-05-20 10:00", by: "u9", text: "Hoa tiêu đã được phân công, sẵn sàng đón tàu." },
    ],
  },
  {
    id: "JOB-26-0519-CB1",
    vessel: { name: "MV BLUE OCEAN", flag: "VN", dwt: "28.000 DWT", imo: "9612340", loa: "168 m", type: "General cargo" },
    cargo: { name: "Gạo xuất khẩu", qty: "22.000 MT", op: "Xếp hàng" },
    berthId: "BP-02",
    customer: "Tổng Công ty Lương thực miền Bắc",
    contract: "HĐ-2026-VFC-006",
    pic: "u4",
    status: "in_progress",
    progress: 64,
    start: "2026-05-19 08:00",
    end:   "2026-05-22 18:00",
    eta:   "2026-05-19 06:00",
    etd:   "2026-05-22 20:00",
    revenue: "780.000.000 ₫",
    resources: [
      { type: "tug",   id: "VNL07", from: "2026-05-19 06:00", to: "2026-05-19 09:00", role: "Hỗ trợ cập phao" },
      { type: "crane", id: "ICD-VNL02",  from: "2026-05-19 10:00", to: "2026-05-22 16:00", role: "Cẩu chính 150T" },
      { type: "barge", id: "SL-301",  from: "2026-05-19 10:00", to: "2026-05-22 14:00", role: "Sà lan đóng bao" },
      { type: "barge", id: "SL-302",  from: "2026-05-19 10:00", to: "2026-05-22 14:00", role: "Sà lan đóng bao" },
    ],
    notes: "Hàng đóng bao 50kg, năng suất xếp ổn định.",
    risks: [],
    logs: [
      { at: "2026-05-20 09:00", by: "u4", text: "Đã xếp 14.080 / 22.000 MT." },
    ],
  },
  {
    id: "JOB-26-0524-LH1",
    vessel: { name: "MV GOLDEN HARBOR", flag: "HK", dwt: "52.000 DWT", imo: "9789456", loa: "189 m", type: "Bulk carrier" },
    cargo: { name: "Quặng sắt rời", qty: "45.000 MT", op: "Dỡ hàng" },
    berthId: "BP-02",
    customer: "Thép Việt Đức",
    contract: "HĐ-2026-VD-014",
    pic: "u9",
    status: "planned",
    progress: 0,
    start: "2026-05-24 08:00",
    end:   "2026-05-28 16:00",
    eta:   "2026-05-24 06:00",
    etd:   "2026-05-28 18:00",
    revenue: "1.380.000.000 ₫",
    resources: [
      { type: "tug",   id: "VNL VOYAGER", from: "2026-05-24 06:00", to: "2026-05-24 09:00", role: "Hỗ trợ cập phao" },
      { type: "tug",   id: "VNL RUBY", from: "2026-05-24 06:00", to: "2026-05-24 09:00", role: "Hỗ trợ cập phao" },
      { type: "crane", id: "ICD-VNL03",  from: "2026-05-24 10:00", to: "2026-05-28 14:00", role: "Cẩu chính 200T" },
      { type: "barge", id: "SL-103",  from: "2026-05-25 06:00", to: "2026-05-28 12:00", role: "Sà lan chuyển tải" },
    ],
    notes: "",
    risks: [],
    logs: [],
  },
  {
    id: "JOB-26-0526-LH2",
    vessel: { name: "MV SILVER DOLPHIN", flag: "PA", dwt: "48.000 DWT", imo: "9823456", loa: "184 m", type: "Bulk carrier" },
    cargo: { name: "Than cám", qty: "40.000 MT", op: "Chuyển tải" },
    berthId: "BP-03",
    customer: "Nhiệt điện Phả Lại",
    contract: "HĐ-2026-PL-008",
    pic: "u4",
    status: "planned",
    progress: 0,
    start: "2026-05-26 14:00",
    end:   "2026-05-30 22:00",
    eta:   "2026-05-26 12:00",
    etd:   "2026-05-30 23:00",
    revenue: "1.180.000.000 ₫",
    resources: [
      { type: "tug",   id: "VNL03", from: "2026-05-26 12:00", to: "2026-05-26 15:00", role: "Hỗ trợ cập phao" },
      { type: "crane", id: "ICD-VNL07",  from: "2026-05-26 16:00", to: "2026-05-30 20:00", role: "Cẩu chính 120T" },
      { type: "barge", id: "SL-201",  from: "2026-05-27 06:00", to: "2026-05-30 18:00", role: "Sà lan chuyển tải" },
    ],
    notes: "",
    risks: [],
    logs: [],
  },
  {
    id: "JOB-26-0515-COMPLETED",
    vessel: { name: "MV EASTERN WIND", flag: "VN", dwt: "45.000 DWT", imo: "9534789", loa: "180 m", type: "Bulk carrier" },
    cargo: { name: "Xi măng rời", qty: "38.000 MT", op: "Xếp hàng" },
    berthId: "VNL-BOU-11",
    customer: "Xi măng Bút Sơn",
    contract: "HĐ-2026-BS-005",
    pic: "u9",
    status: "completed",
    progress: 100,
    start: "2026-05-15 06:00",
    end:   "2026-05-17 08:00",
    eta:   "2026-05-15 04:00",
    etd:   "2026-05-17 10:00",
    revenue: "920.000.000 ₫",
    resources: [],
    notes: "Hoàn thành đúng tiến độ, hợp đồng đã thanh lý.",
    risks: [],
    logs: [],
  },
];

/* Standalone DVHH (maritime services without berth occupation) */
const OCC_DVHH = [
  { id: "DV-2026-0520-CK",  title: "Lai dắt MV CARGO KING vào Cảng Hải Phòng",   from: "2026-05-20 06:00", to: "2026-05-20 09:30", tugs: ["VNL07","VNL VOYAGER"], customer: "Cảng Hải Phòng", status: "in_progress", revenue: "85.000.000 ₫" },
  { id: "DV-2026-0521-MB",  title: "Lai dắt MV MEGA BULK ra phao kiểm dịch",     from: "2026-05-21 14:00", to: "2026-05-21 17:00", tugs: ["VNL03","VNL05"], customer: "Vinacomin", status: "planned", revenue: "78.000.000 ₫" },
  { id: "DV-2026-0522-SF",  title: "Hỗ trợ neo MV STAR FORTUNE tại phao chờ",    from: "2026-05-22 08:00", to: "2026-05-22 10:00", tugs: ["VNL RUBY"], customer: "Maersk Việt Nam", status: "planned", revenue: "42.000.000 ₫" },
  { id: "DV-2026-0518-CMP", title: "Lai dắt MV CONTINENTAL vào nhà máy lọc dầu", from: "2026-05-18 22:00", to: "2026-05-19 02:00", tugs: ["VNL07","VNL VOYAGER"], customer: "BSR Dung Quất", status: "completed", revenue: "120.000.000 ₫" },
];

/* Granular tug tasks — port assist, mooring, tow, anchor — 5-10 per tug per active day.
 * Used by Gantt + day-roster popover. Status: done | in_progress | planned */
const OCC_TUG_TASK_TYPES = {
  mooring:       { label: "Hỗ trợ cập phao",  color: "#0E7A38" },
  unmooring:     { label: "Hỗ trợ rời phao",  color: "#1E5FB7" },
  tow_in:        { label: "Lai dắt vào cảng", color: "#E85D2F" },
  tow_out:       { label: "Lai dắt ra phao",  color: "#B45309" },
  anchor:        { label: "Hỗ trợ neo",       color: "#7C5BE0" },
  shift:         { label: "Di chuyển vị trí", color: "#5A6472" },
  rescue:        { label: "Khẩn cấp / cứu hộ",color: "#B91C1C" },
};

const OCC_TUG_TASKS = [
  /* === DVHH-01 — busy schedule (8 tasks day 19, 9 tasks day 20, 7 tasks day 21) === */
  // Day 19
  { id: "TT-1901", tugId: "VNL03", from: "2026-05-19 02:30", to: "2026-05-19 03:15", type: "mooring",   vessel: "MV PACIFIC STAR",   customer: "EVN",            berth: "BP-09", linkJobId: "JOB-26-0519-LH5", status: "done", revenue: "12.500.000 ₫" },
  { id: "TT-1902", tugId: "VNL03", from: "2026-05-19 05:30", to: "2026-05-19 06:15", type: "tow_in",    vessel: "MV CONTINENTAL",    customer: "BSR Dung Quất",  status: "done", revenue: "28.000.000 ₫" },
  { id: "TT-1903", tugId: "VNL03", from: "2026-05-19 08:00", to: "2026-05-19 08:45", type: "unmooring", vessel: "MV EASTERN WIND",   customer: "Xi măng Bút Sơn", berth: "VNL-BOU-11", linkJobId: "JOB-26-0515-COMPLETED", status: "done", revenue: "11.000.000 ₫" },
  { id: "TT-1904", tugId: "VNL03", from: "2026-05-19 10:30", to: "2026-05-19 11:45", type: "tow_out",   vessel: "MV SEA PHOENIX",    customer: "Vinacomin",      status: "done", revenue: "32.000.000 ₫" },
  { id: "TT-1905", tugId: "VNL03", from: "2026-05-19 14:00", to: "2026-05-19 14:30", type: "shift",     vessel: "Di chuyển HG → LH", customer: "Nội bộ",         status: "done", revenue: "0 ₫" },
  { id: "TT-1906", tugId: "VNL03", from: "2026-05-19 16:00", to: "2026-05-19 16:50", type: "mooring",   vessel: "MV BLUE OCEAN",     customer: "VFC miền Bắc",   berth: "BP-02", linkJobId: "JOB-26-0519-CB1", status: "done", revenue: "12.500.000 ₫" },
  { id: "TT-1907", tugId: "VNL03", from: "2026-05-19 19:30", to: "2026-05-19 20:30", type: "anchor",    vessel: "MV OCEAN PRIDE",    customer: "Maersk VN",      status: "done", revenue: "18.500.000 ₫" },
  { id: "TT-1908", tugId: "VNL03", from: "2026-05-19 22:00", to: "2026-05-19 22:45", type: "tow_in",    vessel: "MV CARGO KING",     customer: "Cảng Hải Phòng", status: "done", revenue: "24.000.000 ₫" },
  // Day 20 (today) — most relevant
  { id: "TT-2001", tugId: "VNL03", from: "2026-05-20 01:00", to: "2026-05-20 01:45", type: "mooring",   vessel: "MV NORTHERN PEARL", customer: "Hoà Phát",       berth: "BP-03", status: "done", revenue: "12.500.000 ₫" },
  { id: "TT-2002", tugId: "VNL03", from: "2026-05-20 03:30", to: "2026-05-20 04:15", type: "tow_in",    vessel: "MV CONTINENTAL",    customer: "BSR Dung Quất",  status: "done", revenue: "28.000.000 ₫" },
  { id: "TT-2003", tugId: "VNL03", from: "2026-05-20 06:30", to: "2026-05-20 07:30", type: "anchor",    vessel: "MV STAR FORTUNE",   customer: "Maersk VN",      status: "done", revenue: "18.500.000 ₫" },
  { id: "TT-2004", tugId: "VNL03", from: "2026-05-20 09:00", to: "2026-05-20 09:30", type: "unmooring", vessel: "MV EASTERN WIND",   customer: "Xi măng Bút Sơn", berth: "VNL-BOU-11", status: "in_progress", revenue: "11.000.000 ₫" },
  { id: "TT-2005", tugId: "VNL03", from: "2026-05-20 11:00", to: "2026-05-20 12:00", type: "tow_out",   vessel: "MV MEGA BULK",      customer: "Vinacomin",      status: "planned", revenue: "32.000.000 ₫" },
  { id: "TT-2006", tugId: "VNL03", from: "2026-05-20 14:00", to: "2026-05-20 14:45", type: "mooring",   vessel: "MV SAIGON GLORY",   customer: "Tổng KS",        berth: "BP-03", status: "planned", revenue: "12.500.000 ₫" },
  { id: "TT-2007", tugId: "VNL03", from: "2026-05-20 16:30", to: "2026-05-20 17:00", type: "shift",     vessel: "Di chuyển HG → LH", customer: "Nội bộ",         status: "planned", revenue: "0 ₫" },
  { id: "TT-2008", tugId: "VNL03", from: "2026-05-20 19:00", to: "2026-05-20 20:30", type: "tow_in",    vessel: "MV CARGO KING",     customer: "Cảng Hải Phòng", status: "planned", revenue: "26.000.000 ₫" },
  { id: "TT-2009", tugId: "VNL03", from: "2026-05-20 22:00", to: "2026-05-20 22:45", type: "mooring",   vessel: "MV GOLDEN HARBOR",  customer: "Thép Việt Đức",  berth: "BP-02", linkJobId: "JOB-26-0524-LH1", status: "planned", revenue: "13.500.000 ₫" },
  // Day 21
  { id: "TT-2101", tugId: "VNL03", from: "2026-05-21 02:00", to: "2026-05-21 02:45", type: "unmooring", vessel: "MV NORTHERN PEARL", customer: "Hoà Phát",       berth: "BP-03", status: "planned", revenue: "11.000.000 ₫" },
  { id: "TT-2102", tugId: "VNL03", from: "2026-05-21 04:00", to: "2026-05-21 05:00", type: "mooring",   vessel: "MV NORTHERN SUN",   customer: "Lâm Thao",       berth: "BP-03", linkJobId: "JOB-26-0521-HG2", status: "planned", revenue: "12.500.000 ₫" },
  { id: "TT-2103", tugId: "VNL03", from: "2026-05-21 07:30", to: "2026-05-21 08:30", type: "anchor",    vessel: "MV BLUE PHOENIX",   customer: "EVN",            status: "planned", revenue: "18.500.000 ₫" },
  { id: "TT-2104", tugId: "VNL03", from: "2026-05-21 11:00", to: "2026-05-21 12:30", type: "tow_in",    vessel: "MV SEA TIGER",      customer: "Cảng HP",        status: "planned", revenue: "28.000.000 ₫" },
  { id: "TT-2105", tugId: "VNL03", from: "2026-05-21 14:00", to: "2026-05-21 17:00", type: "tow_out",   vessel: "MV MEGA BULK",      customer: "Vinacomin",      status: "planned", revenue: "78.000.000 ₫", dvhhId: "DV-2026-0521-MB" },
  { id: "TT-2106", tugId: "VNL03", from: "2026-05-21 19:00", to: "2026-05-21 19:45", type: "mooring",   vessel: "MV PACIFIC HOPE",   customer: "EVN",            berth: "BP-08", status: "planned", revenue: "12.500.000 ₫" },
  { id: "TT-2107", tugId: "VNL03", from: "2026-05-21 22:30", to: "2026-05-21 23:30", type: "tow_in",    vessel: "MV ATLANTIC II",    customer: "Hoà Phát",       status: "planned", revenue: "26.000.000 ₫" },

  /* === DVHH-02 — second busiest === */
  // Day 20
  { id: "TT-2010", tugId: "VNL05", from: "2026-05-20 02:00", to: "2026-05-20 02:45", type: "mooring",   vessel: "MV NORTHERN PEARL", customer: "Hoà Phát",       berth: "BP-03", status: "done", revenue: "12.500.000 ₫" },
  { id: "TT-2011", tugId: "VNL05", from: "2026-05-20 05:00", to: "2026-05-20 05:45", type: "unmooring", vessel: "MV SAIGON STAR",    customer: "VFC",            berth: "BP-03", status: "done", revenue: "11.000.000 ₫" },
  { id: "TT-2012", tugId: "VNL05", from: "2026-05-20 08:30", to: "2026-05-20 09:30", type: "tow_out",   vessel: "MV OCEAN BREEZE",   customer: "Maersk VN",      status: "in_progress", revenue: "28.000.000 ₫" },
  { id: "TT-2013", tugId: "VNL05", from: "2026-05-20 12:00", to: "2026-05-20 13:00", type: "anchor",    vessel: "MV SILVER WAVE",    customer: "Vinacomin",      status: "planned", revenue: "18.500.000 ₫" },
  { id: "TT-2014", tugId: "VNL05", from: "2026-05-20 15:00", to: "2026-05-20 16:00", type: "tow_in",    vessel: "MV CARGO QUEEN",    customer: "Cảng HP",        status: "planned", revenue: "26.000.000 ₫" },
  { id: "TT-2015", tugId: "VNL05", from: "2026-05-20 18:30", to: "2026-05-20 19:00", type: "mooring",   vessel: "MV SAIGON GLORY",   customer: "Tổng KS",        berth: "BP-03", status: "planned", revenue: "12.500.000 ₫" },
  { id: "TT-2016", tugId: "VNL05", from: "2026-05-20 21:30", to: "2026-05-20 22:30", type: "tow_in",    vessel: "MV ORIENT GLORY",   customer: "Hoà Phát",       status: "planned", revenue: "26.000.000 ₫" },
  // Day 21
  { id: "TT-2108", tugId: "VNL05", from: "2026-05-21 04:00", to: "2026-05-21 05:00", type: "mooring",   vessel: "MV NORTHERN SUN",   customer: "Lâm Thao",       berth: "BP-03", linkJobId: "JOB-26-0521-HG2", status: "planned", revenue: "12.500.000 ₫" },
  { id: "TT-2109", tugId: "VNL05", from: "2026-05-21 08:00", to: "2026-05-21 09:00", type: "unmooring", vessel: "MV NORTHERN PEARL", customer: "Hoà Phát",       berth: "BP-03", status: "planned", revenue: "11.000.000 ₫" },
  { id: "TT-2110", tugId: "VNL05", from: "2026-05-21 11:30", to: "2026-05-21 12:30", type: "anchor",    vessel: "MV STAR FORTUNE II",customer: "Maersk VN",      status: "planned", revenue: "18.500.000 ₫" },
  { id: "TT-2111", tugId: "VNL05", from: "2026-05-21 14:00", to: "2026-05-21 17:00", type: "tow_out",   vessel: "MV MEGA BULK",      customer: "Vinacomin",      status: "planned", revenue: "78.000.000 ₫", dvhhId: "DV-2026-0521-MB" },
  { id: "TT-2112", tugId: "VNL05", from: "2026-05-21 20:00", to: "2026-05-21 20:45", type: "mooring",   vessel: "MV TIGER EXPRESS",  customer: "Hoà Phát",       berth: "BP-02", status: "planned", revenue: "12.500.000 ₫" },

  /* === DVHH-03 — moderate === */
  { id: "TT-2020", tugId: "VNL07", from: "2026-05-20 04:00", to: "2026-05-20 05:00", type: "mooring",   vessel: "MV PACIFIC STAR",   customer: "EVN",            berth: "BP-09", linkJobId: "JOB-26-0519-LH5", status: "done", revenue: "12.500.000 ₫" },
  { id: "TT-2021", tugId: "VNL07", from: "2026-05-20 06:00", to: "2026-05-20 09:30", type: "tow_in",    vessel: "MV CARGO KING",     customer: "Cảng HP",        status: "in_progress", revenue: "85.000.000 ₫", dvhhId: "DV-2026-0520-CK" },
  { id: "TT-2022", tugId: "VNL07", from: "2026-05-20 11:30", to: "2026-05-20 12:15", type: "unmooring", vessel: "MV SAIGON STAR",    customer: "VFC",            berth: "BP-03", status: "planned", revenue: "11.000.000 ₫" },
  { id: "TT-2023", tugId: "VNL07", from: "2026-05-20 15:00", to: "2026-05-20 16:30", type: "anchor",    vessel: "MV BLUE PHOENIX",   customer: "EVN",            status: "planned", revenue: "22.500.000 ₫" },
  { id: "TT-2024", tugId: "VNL07", from: "2026-05-20 19:30", to: "2026-05-20 20:00", type: "mooring",   vessel: "MV SEA EAGLE",      customer: "Lâm Thao",       berth: "BP-02", status: "planned", revenue: "12.500.000 ₫" },

  /* === DVHH-05 === */
  { id: "TT-2030", tugId: "VNL VOYAGER", from: "2026-05-20 04:00", to: "2026-05-20 05:00", type: "mooring",   vessel: "MV PACIFIC STAR",   customer: "EVN",            berth: "BP-09", linkJobId: "JOB-26-0519-LH5", status: "done", revenue: "12.500.000 ₫" },
  { id: "TT-2031", tugId: "VNL VOYAGER", from: "2026-05-20 06:00", to: "2026-05-20 09:30", type: "tow_in",    vessel: "MV CARGO KING",     customer: "Cảng HP",        status: "in_progress", revenue: "85.000.000 ₫", dvhhId: "DV-2026-0520-CK" },
  { id: "TT-2032", tugId: "VNL VOYAGER", from: "2026-05-20 12:00", to: "2026-05-20 13:30", type: "tow_out",   vessel: "MV OCEAN BREEZE",   customer: "Maersk VN",      status: "planned", revenue: "32.000.000 ₫" },
  { id: "TT-2033", tugId: "VNL VOYAGER", from: "2026-05-20 16:00", to: "2026-05-20 17:00", type: "anchor",    vessel: "MV SEA TIGER",      customer: "Vinacomin",      status: "planned", revenue: "22.500.000 ₫" },
  { id: "TT-2034", tugId: "VNL VOYAGER", from: "2026-05-20 20:00", to: "2026-05-20 21:30", type: "tow_in",    vessel: "MV ATLANTIC II",    customer: "Hoà Phát",       status: "planned", revenue: "28.000.000 ₫" },
  // Day 24
  { id: "TT-2401", tugId: "VNL VOYAGER", from: "2026-05-24 06:00", to: "2026-05-24 09:00", type: "mooring",   vessel: "MV GOLDEN HARBOR",  customer: "Thép Việt Đức",  berth: "BP-02", linkJobId: "JOB-26-0524-LH1", status: "planned", revenue: "13.500.000 ₫" },

  /* === DVHH-06 === */
  { id: "TT-2040", tugId: "VNL RUBY", from: "2026-05-20 03:00", to: "2026-05-20 03:45", type: "mooring",   vessel: "MV ORIENT EXPRESS", customer: "Vissai",         berth: "VNL-BOU-11", linkJobId: "JOB-26-0517-HG1", status: "done", revenue: "12.500.000 ₫" },
  { id: "TT-2041", tugId: "VNL RUBY", from: "2026-05-20 08:00", to: "2026-05-20 09:00", type: "anchor",    vessel: "MV NORTHERN BREEZE",customer: "Maersk VN",      status: "in_progress", revenue: "18.500.000 ₫" },
  { id: "TT-2042", tugId: "VNL RUBY", from: "2026-05-20 13:00", to: "2026-05-20 14:30", type: "tow_in",    vessel: "MV CARGO QUEEN",    customer: "Cảng HP",        status: "planned", revenue: "28.000.000 ₫" },
  { id: "TT-2043", tugId: "VNL RUBY", from: "2026-05-20 18:00", to: "2026-05-20 18:45", type: "unmooring", vessel: "MV SILVER WAVE",    customer: "Vinacomin",      berth: "VNL-BOU-11", status: "planned", revenue: "11.000.000 ₫" },
  // Day 22
  { id: "TT-2201", tugId: "VNL RUBY", from: "2026-05-22 08:00", to: "2026-05-22 10:00", type: "anchor",    vessel: "MV STAR FORTUNE",   customer: "Maersk VN",      status: "planned", revenue: "42.000.000 ₫", dvhhId: "DV-2026-0522-SF" },
];

Object.assign(window, {
  PEOPLE, ME, personById,
  OCC_WINDOW, OCC_BERTHS, OCC_TUGS, OCC_CRANES, OCC_JOBS, OCC_DVHH, occDayFrac,
  OCC_TUG_TASKS, OCC_TUG_TASK_TYPES,
});
