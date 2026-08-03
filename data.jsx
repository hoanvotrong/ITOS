/* Mock data — Vinalogistics TTOS */

const PEOPLE = [
  { id: "u1",  name: "Nguyễn Văn An",       short: "NVA", role: "TGĐ",                       dept: "BOD",                color: 0 },
  { id: "u2",  name: "Trần Thị Mai",         short: "TTM", role: "PTGĐ Khai thác",            dept: "BOD",                color: 1 },
  { id: "u3",  name: "Phạm Minh Tuấn",       short: "PMT", role: "GĐ Khai thác",              dept: "Khai thác",          color: 2 },
];
const ME = PEOPLE[2];

const personById = id => PEOPLE.find(p => p.id === id);

/* ============================================================
 * OCC — Operations Command Center (BOD view)
 * Xuất tự động từ database ETVNL lúc 2026-08-03 11:14 bởi scripts/export-occ-data.ps1
 * Chạy lại script này để làm mới. XEM GHI CHÚ TODO rải rác bên dưới —
 * vài field (revenue, contract, pic, progress %, phân loại tug task)
 * còn là giá trị tạm/ước lượng, cần bổ sung nguồn dữ liệu thật.
 * ============================================================ */

const OCC_WINDOW = {
    "startDay":  1,
    "endDay":  31,
    "month":  8,
    "year":  2026,
    "todayDay":  3,
    "todayHour":  11.23
};

const OCC_BERTHS = [
    {
        "id":  "BP 02",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP 02",
        "cap":  ""
    },
    {
        "id":  "BP 03",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP 03",
        "cap":  ""
    },
    {
        "id":  "BP 08",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP 08",
        "cap":  ""
    },
    {
        "id":  "BP 09",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP 09",
        "cap":  ""
    },
    {
        "id":  "BP 11",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP 11",
        "cap":  ""
    },
    {
        "id":  "BP 04",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP 04",
        "cap":  ""
    },
    {
        "id":  "BP 07",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP 07",
        "cap":  ""
    },
    {
        "id":  "BP ITC 02",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP ITC 02",
        "cap":  ""
    },
    {
        "id":  "BP ITC 03",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP ITC 03",
        "cap":  ""
    },
    {
        "id":  "BP TL 02",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP TL 02",
        "cap":  ""
    },
    {
        "id":  "BP 15",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP 15",
        "cap":  ""
    },
    {
        "id":  "BP 10",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP 10",
        "cap":  ""
    },
    {
        "id":  "BP TL 10",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP TL 10",
        "cap":  ""
    },
    {
        "id":  "BP TL 6-8",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP TL 6-8",
        "cap":  ""
    },
    {
        "id":  "BP TA 06",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP TA 06",
        "cap":  ""
    },
    {
        "id":  "BP 12",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP 12",
        "cap":  ""
    },
    {
        "id":  "BP 13",
        "group":  "Bến phao Vinalogistics",
        "label":  "BP 13",
        "cap":  ""
    }
];

const OCC_TUGS = [
    {
        "id":  "TAN CANG 86",
        "hp":  "",
        "status":  "active"
    },
    {
        "id":  "Tàu lai ngoài",
        "hp":  "",
        "status":  "active"
    },
    {
        "id":  "Tàu lai ngoài 02",
        "hp":  "",
        "status":  "active"
    },
    {
        "id":  "VNL 03",
        "hp":  "2400 kW",
        "status":  "active"
    },
    {
        "id":  "VNL 05",
        "hp":  "2400 kW",
        "status":  "active"
    },
    {
        "id":  "VNL 07",
        "hp":  "1600 kW",
        "status":  "active"
    },
    {
        "id":  "VNL EXPLORER",
        "hp":  "5000 kW",
        "status":  "active"
    },
    {
        "id":  "VNL FUTURE",
        "hp":  "5000 kW",
        "status":  "active"
    },
    {
        "id":  "VNL RELIANCE",
        "hp":  "",
        "status":  "active"
    },
    {
        "id":  "VNL RUBY",
        "hp":  "5000 kW",
        "status":  "active"
    },
    {
        "id":  "VNL VISION",
        "hp":  "",
        "status":  "active"
    },
    {
        "id":  "VNL VOYAGER",
        "hp":  "5000 kW",
        "status":  "active"
    }
];

const OCC_CRANES = [
    {
        "id":  "123",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Cẩu bờ VNL 01",
        "cap":  "152 Kw – cont (260 Kw at 40%ED)",
        "status":  "active"
    },
    {
        "id":  "Cẩu bờ VNL 02",
        "cap":  "152 Kw – cont (260 Kw at 40%ED)",
        "status":  "active"
    },
    {
        "id":  "Cẩu bờ VNL 03",
        "cap":  "150 Kw – cont (250 Kw at 40%ED)",
        "status":  "active"
    },
    {
        "id":  "Cẩu bờ VNL 05",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Cẩu bờ VNL 06",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Cẩu bờ VNL 07",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Cẩu bờ VNL 08",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Cẩu bờ VNL 09",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Cẩu nổi FC 06",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Cẩu nổi FC 06 - 01",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Cẩu nổi FC 06 - 02",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Cẩu nổi VNL 08",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Cẩu nổi VNL 09",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Cẩu tàu",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Test",
        "cap":  "",
        "status":  "active"
    },
    {
        "id":  "Tét",
        "cap":  "585.56",
        "status":  "active"
    }
];

const occDayFrac = (str) => {
  if (!str) return null;
  const [d, t] = str.split(" ");
  const day = parseInt(d.split("-")[2], 10);
  const [h, m] = t.split(":").map(Number);
  return day + (h + m / 60) / 24;
};

const OCC_JOBS = [
    {
        "id":  "JOB-6067",
        "vessel":  {
                       "name":  "VIET THUAN 80-05/ FC",
                       "flag":  "170",
                       "dwt":  "76596",
                       "imo":  "9326536",
                       "loa":  "224.94",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "",
                      "qty":  "0 MT",
                      "op":  ""
                  },
        "berthId":  "BP 03",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "in_progress",
        "progress":  50,
        "start":  "2026-08-02 01:00",
        "end":  "2026-08-09 12:00",
        "eta":  "2026-08-02 01:00",
        "etd":  "2026-08-09 12:00",
        "revenue":  "0 ₫",
        "resources":  [

                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "JOB-6068",
        "vessel":  {
                       "name":  "CERVIA/ FC",
                       "flag":  "126",
                       "dwt":  "93311",
                       "imo":  "9570838",
                       "loa":  "230",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "",
                      "qty":  "0 MT",
                      "op":  ""
                  },
        "berthId":  "BP 02",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "planned",
        "progress":  0,
        "start":  "2026-08-14 01:00",
        "end":  "2026-08-22 12:00",
        "eta":  "2026-08-14 01:00",
        "etd":  "2026-08-22 12:00",
        "revenue":  "0 ₫",
        "resources":  [

                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    }
];

const OCC_DVHH = [];

const OCC_TUG_TASK_TYPES = {
  mooring:       { label: "Hỗ trợ cập phao",  color: "#0E7A38" },
  unmooring:     { label: "Hỗ trợ rời phao",  color: "#1E5FB7" },
  tow_in:        { label: "Lai dắt vào cảng", color: "#E85D2F" },
  tow_out:       { label: "Lai dắt ra phao",  color: "#B45309" },
  anchor:        { label: "Hỗ trợ neo",       color: "#7C5BE0" },
  shift:         { label: "Di chuyển vị trí", color: "#5A6472" },
  rescue:        { label: "Khẩn cấp / cứu hộ",color: "#B91C1C" },
};

const OCC_TUG_TASKS = [];

Object.assign(window, {
  PEOPLE, ME, personById,
  OCC_WINDOW, OCC_BERTHS, OCC_TUGS, OCC_CRANES, OCC_JOBS, OCC_DVHH, occDayFrac,
  OCC_TUG_TASKS, OCC_TUG_TASK_TYPES,
});