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
 * Xuất tự động từ database ETVNL lúc 2026-08-03 15:51 bởi scripts/export-occ-data.ps1
 * Chạy lại script này để làm mới. XEM GHI CHÚ TODO rải rác bên dưới —
 * vài field (revenue, contract, pic, progress %, phân loại tug task)
 * còn là giá trị tạm/ước lượng, cần bổ sung nguồn dữ liệu thật.
 * ============================================================ */

const OCC_WINDOW = {
    "refDate":  "2026-06-19",
    "startDay":  1,
    "endDay":  61,
    "month":  8,
    "year":  2026,
    "todayDate":  3,
    "todayCol":  46,
    "todayHour":  15.85
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
    }
];

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

const OCC_JOBS = [
    {
        "id":  "2607-335",
        "vessel":  {
                       "name":  "CERVIA/ FC",
                       "flag":  "126",
                       "dwt":  "93311",
                       "imo":  "9570838",
                       "loa":  "230",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "90.000 MT",
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
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-08-14 01:00",
                              "to":  "2026-08-14 12:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-08-14 01:00",
                              "to":  "2026-08-14 12:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-331",
        "vessel":  {
                       "name":  "VIET THUAN 80-05/ FC",
                       "flag":  "170",
                       "dwt":  "76596",
                       "imo":  "9326536",
                       "loa":  "224.94",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "74.500 MT",
                      "op":  ""
                  },
        "berthId":  "BP 03",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "in_progress",
        "progress":  50,
        "start":  "2026-08-03 07:00",
        "end":  "2026-08-10 12:00",
        "eta":  "2026-08-03 07:00",
        "etd":  "2026-08-10 12:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-08-03 09:00",
                              "to":  "2026-08-03 10:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-08-03 09:00",
                              "to":  "2026-08-03 10:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-08-03 01:00",
                              "to":  "2026-08-03 12:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-08-03 01:00",
                              "to":  "2026-08-03 12:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-307",
        "vessel":  {
                       "name":  "SAMUDRA MAJU 1 \u0026 SAMUDRA MAJU 2",
                       "flag":  "241",
                       "dwt":  "10942",
                       "imo":  "",
                       "loa":  "126.73",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "",
                      "qty":  "0 MT",
                      "op":  ""
                  },
        "berthId":  "BP 13",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-26 10:55",
        "end":  "2026-07-30 10:00",
        "eta":  "2026-07-26 10:55",
        "etd":  "2026-07-30 10:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-30 10:00",
                              "to":  "2026-07-30 10:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-30 10:00",
                              "to":  "2026-07-30 10:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-26 10:05",
                              "to":  "2026-07-26 10:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-26 10:05",
                              "to":  "2026-07-26 10:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-241",
        "vessel":  {
                       "name":  "SAMUDRA BINTANG 2 \u0026 SAMUDRA BINTANG 3",
                       "flag":  "134",
                       "dwt":  "9500",
                       "imo":  "",
                       "loa":  "96.62",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "",
                      "qty":  "0 MT",
                      "op":  ""
                  },
        "berthId":  "BP 07",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-23 08:00",
        "end":  "2026-07-28 06:30",
        "eta":  "2026-07-23 08:00",
        "etd":  "2026-07-28 06:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-28 06:00",
                              "to":  "2026-07-28 06:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-28 06:00",
                              "to":  "2026-07-28 06:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-23 06:50",
                              "to":  "2026-07-23 08:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-23 06:50",
                              "to":  "2026-07-23 08:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-237",
        "vessel":  {
                       "name":  "MACALLAN 17 \u0026 GRACIA",
                       "flag":  "134",
                       "dwt":  "9500",
                       "imo":  "",
                       "loa":  "95.44",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "",
                      "qty":  "0 MT",
                      "op":  ""
                  },
        "berthId":  "BP 12",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-22 22:10",
        "end":  "2026-07-27 02:30",
        "eta":  "2026-07-22 22:10",
        "etd":  "2026-07-27 02:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-27 04:35",
                              "to":  "2026-07-27 05:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-27 04:35",
                              "to":  "2026-07-27 05:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-22 20:35",
                              "to":  "2026-07-22 22:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-22 20:35",
                              "to":  "2026-07-22 22:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-223",
        "vessel":  {
                       "name":  "ROYAL 39",
                       "flag":  "241",
                       "dwt":  "10942",
                       "imo":  "",
                       "loa":  "126.73",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "",
                      "qty":  "0 MT",
                      "op":  ""
                  },
        "berthId":  "BP 07",
        "customer":  "Công Ty TNHH Thương Mại \u0026 Logistics Thái Bình Dương (PACIFIC)",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-21 06:55",
        "end":  "2026-07-21 19:30",
        "eta":  "2026-07-21 06:55",
        "etd":  "2026-07-21 19:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-21 19:20",
                              "to":  "2026-07-21 20:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-21 06:10",
                              "to":  "2026-07-21 06:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-190",
        "vessel":  {
                       "name":  "PATRIA NAWASENA 3/ SC",
                       "flag":  "103",
                       "dwt":  "56124",
                       "imo":  "9514327",
                       "loa":  "",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "55.000 MT",
                      "op":  ""
                  },
        "berthId":  "BP 11",
        "customer":  "CÔNG TY CỔ PHẦN THUẬN HẢI COMMODITIES",
        "contract":  "",
        "pic":  "",
        "status":  "in_progress",
        "progress":  50,
        "start":  "2026-07-31 06:00",
        "end":  "2026-08-06 12:00",
        "eta":  "2026-07-31 06:00",
        "etd":  "2026-08-06 12:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-31 04:40",
                              "to":  "2026-07-31 06:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-31 04:40",
                              "to":  "2026-07-31 06:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-163",
        "vessel":  {
                       "name":  "HIGHLINE 59 \u0026 HIGHLINE 58",
                       "flag":  "134",
                       "dwt":  "9500",
                       "imo":  "",
                       "loa":  "95.3",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "",
                      "qty":  "0 MT",
                      "op":  ""
                  },
        "berthId":  "BP 12",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-16 14:50",
        "end":  "2026-07-22 15:00",
        "eta":  "2026-07-16 14:50",
        "etd":  "2026-07-22 15:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-22 14:45",
                              "to":  "2026-07-22 15:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-22 14:45",
                              "to":  "2026-07-22 15:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-16 14:00",
                              "to":  "2026-07-16 14:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-16 14:00",
                              "to":  "2026-07-16 14:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-154",
        "vessel":  {
                       "name":  "VIET THUAN 80-07/ FC",
                       "flag":  "170",
                       "dwt":  "76466",
                       "imo":  "9284855",
                       "loa":  "225",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "74.500 MT",
                      "op":  ""
                  },
        "berthId":  "BP 09",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "in_progress",
        "progress":  50,
        "start":  "2026-08-01 18:00",
        "end":  "2026-08-08 12:00",
        "eta":  "2026-08-01 18:00",
        "etd":  "2026-08-08 12:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-08-03 06:00",
                              "to":  "2026-08-03 06:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "Tàu lai ngoài",
                              "from":  "2026-08-03 06:00",
                              "to":  "2026-08-03 06:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-08-02 10:45",
                              "to":  "2026-08-02 11:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-08-02 10:45",
                              "to":  "2026-08-02 11:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "Tàu lai ngoài 02",
                              "from":  "2026-08-01 15:30",
                              "to":  "2026-08-01 17:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "Tàu lai ngoài",
                              "from":  "2026-08-01 15:30",
                              "to":  "2026-08-01 17:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-144",
        "vessel":  {
                       "name":  "MAUBERT/ SC",
                       "flag":  "126",
                       "dwt":  "53827.7",
                       "imo":  "9358864",
                       "loa":  "190",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "53.200 MT",
                      "op":  ""
                  },
        "berthId":  "BP 11",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-16 17:00",
        "end":  "2026-07-24 09:30",
        "eta":  "2026-07-16 17:00",
        "etd":  "2026-07-24 09:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-24 09:25",
                              "to":  "2026-07-24 10:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-24 09:25",
                              "to":  "2026-07-24 10:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-24 08:50",
                              "to":  "2026-07-24 09:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-24 08:50",
                              "to":  "2026-07-24 09:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-22 06:50",
                              "to":  "2026-07-22 07:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-22 06:50",
                              "to":  "2026-07-22 07:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-22 01:00",
                              "to":  "2026-07-22 01:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-22 01:00",
                              "to":  "2026-07-22 01:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-20 23:15",
                              "to":  "2026-07-20 23:59",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-20 23:15",
                              "to":  "2026-07-20 23:59",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-20 23:15",
                              "to":  "2026-07-20 23:59",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-20 23:15",
                              "to":  "2026-07-20 23:59",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-19 23:40",
                              "to":  "2026-07-20 00:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-19 23:40",
                              "to":  "2026-07-20 00:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-17 22:40",
                              "to":  "2026-07-17 23:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-17 22:40",
                              "to":  "2026-07-17 23:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-16 14:20",
                              "to":  "2026-07-16 16:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-16 14:20",
                              "to":  "2026-07-16 16:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-16 14:20",
                              "to":  "2026-07-16 16:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-16 14:20",
                              "to":  "2026-07-16 16:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-136",
        "vessel":  {
                       "name":  "ORIENT U/ FC",
                       "flag":  "126",
                       "dwt":  "79754",
                       "imo":  "9469493",
                       "loa":  "229",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "76.305 MT",
                      "op":  ""
                  },
        "berthId":  "BP 03",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "in_progress",
        "progress":  50,
        "start":  "2026-07-27 05:10",
        "end":  "2026-08-02 15:30",
        "eta":  "2026-07-27 05:10",
        "etd":  "2026-08-02 15:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-08-02 15:30",
                              "to":  "2026-08-02 16:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-08-02 15:30",
                              "to":  "2026-08-02 16:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-08-02 11:45",
                              "to":  "2026-08-02 13:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-08-02 11:45",
                              "to":  "2026-08-02 13:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-08-02 05:00",
                              "to":  "2026-08-02 05:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-08-02 05:00",
                              "to":  "2026-08-02 05:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-08-02 05:00",
                              "to":  "2026-08-02 05:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-08-02 05:00",
                              "to":  "2026-08-02 05:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-08-01 04:40",
                              "to":  "2026-08-01 05:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "Tàu lai ngoài",
                              "from":  "2026-08-01 04:40",
                              "to":  "2026-08-01 05:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-08-01 03:45",
                              "to":  "2026-08-01 04:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-08-01 03:45",
                              "to":  "2026-08-01 04:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-30 13:20",
                              "to":  "2026-07-30 14:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-30 13:20",
                              "to":  "2026-07-30 14:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-30 11:35",
                              "to":  "2026-07-30 12:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-30 11:35",
                              "to":  "2026-07-30 12:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-28 20:50",
                              "to":  "2026-07-28 21:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-28 20:50",
                              "to":  "2026-07-28 21:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-28 19:00",
                              "to":  "2026-07-28 19:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-28 19:00",
                              "to":  "2026-07-28 19:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-27 10:00",
                              "to":  "2026-07-27 10:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-27 10:00",
                              "to":  "2026-07-27 10:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-27 10:00",
                              "to":  "2026-07-27 10:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-27 10:00",
                              "to":  "2026-07-27 10:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-27 06:20",
                              "to":  "2026-07-27 07:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-27 06:20",
                              "to":  "2026-07-27 07:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-27 05:20",
                              "to":  "2026-07-27 06:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-27 05:20",
                              "to":  "2026-07-27 06:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-27 02:50",
                              "to":  "2026-07-27 05:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-27 02:50",
                              "to":  "2026-07-27 05:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-134",
        "vessel":  {
                       "name":  "SARGAS/ FC",
                       "flag":  "126",
                       "dwt":  "82167",
                       "imo":  "1067603",
                       "loa":  "229",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Viên gỗ nén",
                      "qty":  "57.450 MT",
                      "op":  ""
                  },
        "berthId":  "BP 02",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ CẢNG THỊ VẢI",
        "contract":  "",
        "pic":  "",
        "status":  "in_progress",
        "progress":  50,
        "start":  "2026-07-22 23:00",
        "end":  "2026-08-04 12:00",
        "eta":  "2026-07-22 23:00",
        "etd":  "2026-08-04 12:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-28 19:40",
                              "to":  "2026-07-28 20:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-28 19:40",
                              "to":  "2026-07-28 20:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-23 09:25",
                              "to":  "2026-07-23 10:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-23 09:25",
                              "to":  "2026-07-23 10:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-23 01:50",
                              "to":  "2026-07-23 02:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-23 01:50",
                              "to":  "2026-07-23 02:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-22 20:55",
                              "to":  "2026-07-22 23:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-22 20:55",
                              "to":  "2026-07-22 23:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-112",
        "vessel":  {
                       "name":  "MACALLAN 1 \u0026 MOUTON",
                       "flag":  "241",
                       "dwt":  "10942",
                       "imo":  "",
                       "loa":  "126.73",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "",
                      "qty":  "0 MT",
                      "op":  ""
                  },
        "berthId":  "BP 13",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-14 04:25",
        "end":  "2026-07-23 15:30",
        "eta":  "2026-07-14 04:25",
        "etd":  "2026-07-23 15:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-23 15:15",
                              "to":  "2026-07-23 16:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-23 15:15",
                              "to":  "2026-07-23 16:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-14 03:30",
                              "to":  "2026-07-14 04:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-14 03:30",
                              "to":  "2026-07-14 04:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-059",
        "vessel":  {
                       "name":  "VIET THUAN 80-06/ FC",
                       "flag":  "170",
                       "dwt":  "76596",
                       "imo":  "9342839",
                       "loa":  "224.94",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "73.600 MT",
                      "op":  ""
                  },
        "berthId":  "BP 09",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-20 08:15",
        "end":  "2026-08-01 05:00",
        "eta":  "2026-07-20 08:15",
        "etd":  "2026-08-01 05:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "Tàu lai ngoài 02",
                              "from":  "2026-08-01 05:00",
                              "to":  "2026-08-01 06:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "Tàu lai ngoài",
                              "from":  "2026-08-01 05:00",
                              "to":  "2026-08-01 06:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-31 20:45",
                              "to":  "2026-07-31 21:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-31 20:45",
                              "to":  "2026-07-31 21:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-30 14:50",
                              "to":  "2026-07-30 15:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-30 14:50",
                              "to":  "2026-07-30 15:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-30 13:55",
                              "to":  "2026-07-30 14:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-30 13:55",
                              "to":  "2026-07-30 14:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-29 09:15",
                              "to":  "2026-07-29 10:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-29 09:15",
                              "to":  "2026-07-29 10:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-29 08:30",
                              "to":  "2026-07-29 09:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-29 08:30",
                              "to":  "2026-07-29 09:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-28 03:45",
                              "to":  "2026-07-28 04:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-28 03:45",
                              "to":  "2026-07-28 04:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-28 03:00",
                              "to":  "2026-07-28 03:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-28 03:00",
                              "to":  "2026-07-28 03:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-27 03:25",
                              "to":  "2026-07-27 04:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-27 03:25",
                              "to":  "2026-07-27 04:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-26 18:30",
                              "to":  "2026-07-26 19:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-26 18:30",
                              "to":  "2026-07-26 19:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-26 17:45",
                              "to":  "2026-07-26 18:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-26 17:45",
                              "to":  "2026-07-26 18:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-25 18:15",
                              "to":  "2026-07-25 19:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-25 18:15",
                              "to":  "2026-07-25 19:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-25 17:15",
                              "to":  "2026-07-25 18:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-25 17:15",
                              "to":  "2026-07-25 18:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-24 18:00",
                              "to":  "2026-07-24 19:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-24 18:00",
                              "to":  "2026-07-24 19:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-24 09:00",
                              "to":  "2026-07-24 09:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-24 09:00",
                              "to":  "2026-07-24 09:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-22 22:30",
                              "to":  "2026-07-22 23:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-22 22:30",
                              "to":  "2026-07-22 23:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-22 15:00",
                              "to":  "2026-07-22 16:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-22 15:00",
                              "to":  "2026-07-22 16:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-20 06:10",
                              "to":  "2026-07-20 08:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-20 06:10",
                              "to":  "2026-07-20 08:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-007",
        "vessel":  {
                       "name":  "JADE/ FC",
                       "flag":  "",
                       "dwt":  "",
                       "imo":  "",
                       "loa":  "",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "75.430 MT",
                      "op":  ""
                  },
        "berthId":  "BP 09",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-10 11:25",
        "end":  "2026-07-19 17:30",
        "eta":  "2026-07-10 11:25",
        "etd":  "2026-07-19 17:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-19 17:25",
                              "to":  "2026-07-19 18:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-19 17:25",
                              "to":  "2026-07-19 18:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-19 17:15",
                              "to":  "2026-07-19 18:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-19 17:15",
                              "to":  "2026-07-19 18:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-19 16:50",
                              "to":  "2026-07-19 17:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-19 16:50",
                              "to":  "2026-07-19 17:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-18 05:10",
                              "to":  "2026-07-18 05:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-18 05:10",
                              "to":  "2026-07-18 05:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-17 22:10",
                              "to":  "2026-07-17 22:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-17 22:10",
                              "to":  "2026-07-17 22:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-17 12:25",
                              "to":  "2026-07-17 13:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-17 10:30",
                              "to":  "2026-07-17 12:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-17 10:30",
                              "to":  "2026-07-17 12:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-16 11:35",
                              "to":  "2026-07-16 12:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-16 11:35",
                              "to":  "2026-07-16 12:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-16 10:35",
                              "to":  "2026-07-16 11:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-16 10:35",
                              "to":  "2026-07-16 11:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-16 09:50",
                              "to":  "2026-07-16 10:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-16 09:50",
                              "to":  "2026-07-16 10:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-15 09:35",
                              "to":  "2026-07-15 10:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-15 09:35",
                              "to":  "2026-07-15 10:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-15 08:40",
                              "to":  "2026-07-15 09:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-15 08:40",
                              "to":  "2026-07-15 09:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-14 13:55",
                              "to":  "2026-07-14 14:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-14 13:55",
                              "to":  "2026-07-14 14:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-14 13:00",
                              "to":  "2026-07-14 13:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-14 13:00",
                              "to":  "2026-07-14 13:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-13 13:10",
                              "to":  "2026-07-13 13:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-13 13:10",
                              "to":  "2026-07-13 13:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-13 11:55",
                              "to":  "2026-07-13 13:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-13 11:55",
                              "to":  "2026-07-13 13:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-13 11:00",
                              "to":  "2026-07-13 11:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-13 11:00",
                              "to":  "2026-07-13 11:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-12 11:10",
                              "to":  "2026-07-12 11:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-12 11:10",
                              "to":  "2026-07-12 11:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-11 17:15",
                              "to":  "2026-07-11 18:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-11 17:15",
                              "to":  "2026-07-11 18:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-11 11:10",
                              "to":  "2026-07-11 11:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-11 11:10",
                              "to":  "2026-07-11 11:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-10 17:00",
                              "to":  "2026-07-10 17:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-10 17:00",
                              "to":  "2026-07-10 17:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-10 14:20",
                              "to":  "2026-07-10 15:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-10 14:20",
                              "to":  "2026-07-10 15:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-10 13:20",
                              "to":  "2026-07-10 14:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-10 13:20",
                              "to":  "2026-07-10 14:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-10 09:10",
                              "to":  "2026-07-10 11:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-10 09:10",
                              "to":  "2026-07-10 11:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-006",
        "vessel":  {
                       "name":  "KING MILO/ FC",
                       "flag":  "170",
                       "dwt":  "77198",
                       "imo":  "9609512",
                       "loa":  "225",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "74.438 MT",
                      "op":  ""
                  },
        "berthId":  "BP 03",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-15 14:30",
        "end":  "2026-07-26 11:30",
        "eta":  "2026-07-15 14:30",
        "etd":  "2026-07-26 11:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-26 11:05",
                              "to":  "2026-07-26 12:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-26 11:05",
                              "to":  "2026-07-26 12:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-26 10:30",
                              "to":  "2026-07-26 11:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-26 10:30",
                              "to":  "2026-07-26 11:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-24 18:15",
                              "to":  "2026-07-24 19:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-24 18:15",
                              "to":  "2026-07-24 19:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-24 18:15",
                              "to":  "2026-07-24 19:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-24 18:15",
                              "to":  "2026-07-24 19:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-22 23:15",
                              "to":  "2026-07-22 23:59",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-22 23:15",
                              "to":  "2026-07-22 23:59",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-21 07:00",
                              "to":  "2026-07-21 07:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-21 07:00",
                              "to":  "2026-07-21 07:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-21 05:30",
                              "to":  "2026-07-21 06:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-21 05:30",
                              "to":  "2026-07-21 06:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-21 00:20",
                              "to":  "2026-07-21 01:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-21 00:20",
                              "to":  "2026-07-21 01:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-18 23:20",
                              "to":  "2026-07-18 23:59",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-18 23:20",
                              "to":  "2026-07-18 23:59",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-17 05:25",
                              "to":  "2026-07-17 06:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-17 05:25",
                              "to":  "2026-07-17 06:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-15 20:25",
                              "to":  "2026-07-15 21:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-15 20:25",
                              "to":  "2026-07-15 21:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-15 20:25",
                              "to":  "2026-07-15 21:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-15 20:25",
                              "to":  "2026-07-15 21:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-15 18:40",
                              "to":  "2026-07-15 20:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-15 18:40",
                              "to":  "2026-07-15 20:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-15 13:00",
                              "to":  "2026-07-15 14:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-15 13:00",
                              "to":  "2026-07-15 14:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-15 13:00",
                              "to":  "2026-07-15 14:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-15 13:00",
                              "to":  "2026-07-15 14:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2607-005",
        "vessel":  {
                       "name":  "SHI DAI 11/ FC",
                       "flag":  "45",
                       "dwt":  "75467",
                       "imo":  "9591727",
                       "loa":  "225",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "74.600 MT",
                      "op":  ""
                  },
        "berthId":  "BP 02",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-13 13:00",
        "end":  "2026-07-22 15:30",
        "eta":  "2026-07-13 13:00",
        "etd":  "2026-07-22 15:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-22 15:30",
                              "to":  "2026-07-22 16:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-22 15:30",
                              "to":  "2026-07-22 16:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-22 15:00",
                              "to":  "2026-07-22 16:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-22 15:00",
                              "to":  "2026-07-22 16:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-22 15:00",
                              "to":  "2026-07-22 16:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-22 14:00",
                              "to":  "2026-07-22 15:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-22 14:00",
                              "to":  "2026-07-22 15:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-21 00:55",
                              "to":  "2026-07-21 01:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-21 00:55",
                              "to":  "2026-07-21 01:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-20 00:00",
                              "to":  "2026-07-20 00:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-20 00:00",
                              "to":  "2026-07-20 00:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-18 06:10",
                              "to":  "2026-07-18 07:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-18 06:10",
                              "to":  "2026-07-18 07:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-18 05:15",
                              "to":  "2026-07-18 06:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-18 05:15",
                              "to":  "2026-07-18 06:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-17 00:00",
                              "to":  "2026-07-17 00:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-17 00:00",
                              "to":  "2026-07-17 00:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-16 14:50",
                              "to":  "2026-07-16 16:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-16 14:50",
                              "to":  "2026-07-16 16:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-16 13:50",
                              "to":  "2026-07-16 14:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-16 13:50",
                              "to":  "2026-07-16 14:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-13 19:45",
                              "to":  "2026-07-13 20:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-13 19:45",
                              "to":  "2026-07-13 20:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-13 14:00",
                              "to":  "2026-07-13 15:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-13 14:00",
                              "to":  "2026-07-13 15:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-13 11:10",
                              "to":  "2026-07-13 13:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-13 11:10",
                              "to":  "2026-07-13 13:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2606-234",
        "vessel":  {
                       "name":  "KRAIT/ SC",
                       "flag":  "138",
                       "dwt":  "56100",
                       "imo":  "9622837",
                       "loa":  "189.99",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "54.800 MT",
                      "op":  ""
                  },
        "berthId":  "BP 09",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-01 15:35",
        "end":  "2026-07-09 15:30",
        "eta":  "2026-07-01 15:35",
        "etd":  "2026-07-09 15:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-09 15:50",
                              "to":  "2026-07-09 16:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-09 15:50",
                              "to":  "2026-07-09 16:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-09 15:10",
                              "to":  "2026-07-09 15:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-09 15:10",
                              "to":  "2026-07-09 15:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-07 07:40",
                              "to":  "2026-07-07 08:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-07 07:40",
                              "to":  "2026-07-07 08:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-06 16:55",
                              "to":  "2026-07-06 17:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-06 16:55",
                              "to":  "2026-07-06 17:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-04 06:15",
                              "to":  "2026-07-04 06:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-04 06:15",
                              "to":  "2026-07-04 06:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-04 05:20",
                              "to":  "2026-07-04 06:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-04 05:20",
                              "to":  "2026-07-04 06:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-02 05:40",
                              "to":  "2026-07-02 06:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-02 05:40",
                              "to":  "2026-07-02 06:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-01 13:10",
                              "to":  "2026-07-01 15:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-01 13:10",
                              "to":  "2026-07-01 15:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2606-201",
        "vessel":  {
                       "name":  "ASP HOPE/ SC",
                       "flag":  "170",
                       "dwt":  "57295",
                       "imo":  "9445629",
                       "loa":  "190",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "55.000 MT",
                      "op":  ""
                  },
        "berthId":  "BP 11",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-04 16:50",
        "end":  "2026-07-13 05:00",
        "eta":  "2026-07-04 16:50",
        "etd":  "2026-07-13 05:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-13 05:15",
                              "to":  "2026-07-13 06:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-13 05:15",
                              "to":  "2026-07-13 06:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-13 03:30",
                              "to":  "2026-07-13 04:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-13 03:30",
                              "to":  "2026-07-13 04:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-10 08:30",
                              "to":  "2026-07-10 09:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-10 08:30",
                              "to":  "2026-07-10 09:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-09 16:00",
                              "to":  "2026-07-09 16:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-09 16:00",
                              "to":  "2026-07-09 16:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-07 14:45",
                              "to":  "2026-07-07 15:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-07 14:45",
                              "to":  "2026-07-07 15:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-07 13:00",
                              "to":  "2026-07-07 13:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-07 13:00",
                              "to":  "2026-07-07 13:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-04 22:50",
                              "to":  "2026-07-04 23:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-04 22:50",
                              "to":  "2026-07-04 23:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-07-04 15:05",
                              "to":  "2026-07-04 16:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-04 15:05",
                              "to":  "2026-07-04 16:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2606-200",
        "vessel":  {
                       "name":  "MELIA/ FC",
                       "flag":  "138",
                       "dwt":  "76225",
                       "imo":  "9286968",
                       "loa":  "225",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "74.340 MT",
                      "op":  ""
                  },
        "berthId":  "BP 02",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-02 16:55",
        "end":  "2026-07-10 08:00",
        "eta":  "2026-07-02 16:55",
        "etd":  "2026-07-10 08:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-10 08:30",
                              "to":  "2026-07-10 10:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-07-10 08:30",
                              "to":  "2026-07-10 10:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-09 23:00",
                              "to":  "2026-07-09 23:59",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-09 23:00",
                              "to":  "2026-07-09 23:59",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-10 00:25",
                              "to":  "2026-07-10 01:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-10 00:25",
                              "to":  "2026-07-10 01:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-09 22:20",
                              "to":  "2026-07-09 23:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-09 22:20",
                              "to":  "2026-07-09 23:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-08 21:15",
                              "to":  "2026-07-08 22:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-08 21:15",
                              "to":  "2026-07-08 22:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-08 20:20",
                              "to":  "2026-07-08 21:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-08 20:20",
                              "to":  "2026-07-08 21:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-07 14:20",
                              "to":  "2026-07-07 15:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-07-07 14:20",
                              "to":  "2026-07-07 15:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-07 13:30",
                              "to":  "2026-07-07 14:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-07-07 13:30",
                              "to":  "2026-07-07 14:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-06 18:10",
                              "to":  "2026-07-06 18:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-06 18:10",
                              "to":  "2026-07-06 18:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-06 13:40",
                              "to":  "2026-07-06 18:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-06 13:40",
                              "to":  "2026-07-06 18:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-06 13:40",
                              "to":  "2026-07-06 18:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-06 16:40",
                              "to":  "2026-07-06 17:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-07-06 16:40",
                              "to":  "2026-07-06 17:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-05 12:20",
                              "to":  "2026-07-05 13:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-05 12:20",
                              "to":  "2026-07-05 13:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-05 11:30",
                              "to":  "2026-07-05 12:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-05 11:30",
                              "to":  "2026-07-05 12:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-04 11:40",
                              "to":  "2026-07-04 12:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-04 11:40",
                              "to":  "2026-07-04 12:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-04 10:45",
                              "to":  "2026-07-04 11:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-04 10:45",
                              "to":  "2026-07-04 11:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-04 11:00",
                              "to":  "2026-07-04 11:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-04 11:00",
                              "to":  "2026-07-04 11:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-03 15:40",
                              "to":  "2026-07-03 16:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-03 15:40",
                              "to":  "2026-07-03 16:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-03 14:45",
                              "to":  "2026-07-03 15:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-03 14:45",
                              "to":  "2026-07-03 15:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-02 18:45",
                              "to":  "2026-07-02 20:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-02 18:45",
                              "to":  "2026-07-02 20:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-02 18:55",
                              "to":  "2026-07-02 20:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-07-02 18:55",
                              "to":  "2026-07-02 20:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VISION",
                              "from":  "2026-07-02 17:35",
                              "to":  "2026-07-02 18:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-07-02 17:35",
                              "to":  "2026-07-02 18:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-07-02 13:40",
                              "to":  "2026-07-02 16:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-02 13:40",
                              "to":  "2026-07-02 16:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2606-179",
        "vessel":  {
                       "name":  "ORIENTAL GOLD/ FC",
                       "flag":  "241",
                       "dwt":  "68591",
                       "imo":  "9104469",
                       "loa":  "224",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "65.500 MT",
                      "op":  ""
                  },
        "berthId":  "BP ITC 02",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-06-21 14:15",
        "end":  "2026-06-29 05:00",
        "eta":  "2026-06-21 14:15",
        "etd":  "2026-06-29 05:00",
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
        "id":  "2606-167",
        "vessel":  {
                       "name":  "LL JEANNY \u0026 LL 3027",
                       "flag":  "134",
                       "dwt":  "8000",
                       "imo":  "",
                       "loa":  "88",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "",
                      "qty":  "0 MT",
                      "op":  ""
                  },
        "berthId":  "BP 13",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-06-22 10:25",
        "end":  "2026-06-24 10:00",
        "eta":  "2026-06-22 10:25",
        "etd":  "2026-06-24 10:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-24 10:00",
                              "to":  "2026-06-24 10:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-22 09:35",
                              "to":  "2026-06-22 10:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2606-113",
        "vessel":  {
                       "name":  "MACALLAN 1 \u0026 MOUTON",
                       "flag":  "134",
                       "dwt":  "9000",
                       "imo":  "9668001",
                       "loa":  "95.83",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "",
                      "qty":  "0 MT",
                      "op":  ""
                  },
        "berthId":  "BP 12",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-06-15 09:45",
        "end":  "2026-06-21 17:30",
        "eta":  "2026-06-15 09:45",
        "etd":  "2026-06-21 17:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-21 17:30",
                              "to":  "2026-06-21 18:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-21 17:30",
                              "to":  "2026-06-21 18:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2606-097",
        "vessel":  {
                       "name":  "OCEAN DALIAN/ FC",
                       "flag":  "100",
                       "dwt":  "75599",
                       "imo":  "9493640",
                       "loa":  "225",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "74.712 MT",
                      "op":  ""
                  },
        "berthId":  "BP 03",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-07-05 08:48",
        "end":  "2026-07-15 05:00",
        "eta":  "2026-07-05 08:48",
        "etd":  "2026-07-15 05:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL RELIANCE",
                              "from":  "2026-07-15 05:20",
                              "to":  "2026-07-15 07:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-15 05:20",
                              "to":  "2026-07-15 07:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-14 19:45",
                              "to":  "2026-07-14 21:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-14 19:45",
                              "to":  "2026-07-14 21:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-14 19:00",
                              "to":  "2026-07-14 19:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-14 19:00",
                              "to":  "2026-07-14 19:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-12 17:10",
                              "to":  "2026-07-12 17:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-12 17:10",
                              "to":  "2026-07-12 17:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-12 09:30",
                              "to":  "2026-07-12 10:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-07-12 09:30",
                              "to":  "2026-07-12 10:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-11 03:00",
                              "to":  "2026-07-11 04:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-11 03:00",
                              "to":  "2026-07-11 04:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-09 14:45",
                              "to":  "2026-07-09 15:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-07-09 14:45",
                              "to":  "2026-07-09 15:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-08 01:40",
                              "to":  "2026-07-08 02:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-08 01:40",
                              "to":  "2026-07-08 02:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-07 18:10",
                              "to":  "2026-07-07 19:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-07 18:10",
                              "to":  "2026-07-07 19:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-07 17:25",
                              "to":  "2026-07-07 18:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-07 17:25",
                              "to":  "2026-07-07 18:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-05 12:35",
                              "to":  "2026-07-05 13:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-05 12:35",
                              "to":  "2026-07-05 13:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-07-05 11:45",
                              "to":  "2026-07-05 12:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-07-05 11:45",
                              "to":  "2026-07-05 12:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-05 09:20",
                              "to":  "2026-07-05 10:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-05 09:20",
                              "to":  "2026-07-05 10:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-05 05:45",
                              "to":  "2026-07-05 06:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-07-05 06:05",
                              "to":  "2026-07-05 08:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-07-05 06:05",
                              "to":  "2026-07-05 08:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2606-096",
        "vessel":  {
                       "name":  "VIET THUAN 80-05/ FC",
                       "flag":  "170",
                       "dwt":  "76596",
                       "imo":  "9326536",
                       "loa":  "224.94",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "74.500 MT",
                      "op":  ""
                  },
        "berthId":  "BP 09",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-06-22 10:40",
        "end":  "2026-06-27 11:00",
        "eta":  "2026-06-22 10:40",
        "etd":  "2026-06-27 11:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-06-27 10:40",
                              "to":  "2026-06-27 11:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-06-27 10:40",
                              "to":  "2026-06-27 11:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-06-27 06:15",
                              "to":  "2026-06-27 06:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-27 06:15",
                              "to":  "2026-06-27 06:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-26 11:05",
                              "to":  "2026-06-26 11:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-26 11:05",
                              "to":  "2026-06-26 11:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-26 05:50",
                              "to":  "2026-06-26 06:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-06-26 05:50",
                              "to":  "2026-06-26 06:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-06-25 17:40",
                              "to":  "2026-06-25 18:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-25 17:40",
                              "to":  "2026-06-25 18:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-06-25 16:05",
                              "to":  "2026-06-25 16:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-25 16:05",
                              "to":  "2026-06-25 16:50",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-25 02:25",
                              "to":  "2026-06-25 03:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-06-25 02:25",
                              "to":  "2026-06-25 03:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-25 00:50",
                              "to":  "2026-06-25 01:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-06-25 00:50",
                              "to":  "2026-06-25 01:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-24 11:20",
                              "to":  "2026-06-24 12:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-24 11:20",
                              "to":  "2026-06-24 12:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-24 09:30",
                              "to":  "2026-06-24 10:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "Tàu lai ngoài",
                              "from":  "2026-06-24 09:30",
                              "to":  "2026-06-24 10:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-23 16:40",
                              "to":  "2026-06-23 17:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-23 16:40",
                              "to":  "2026-06-23 17:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-23 15:50",
                              "to":  "2026-06-23 16:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-23 15:50",
                              "to":  "2026-06-23 16:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-23 05:10",
                              "to":  "2026-06-23 05:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-23 05:10",
                              "to":  "2026-06-23 05:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-23 04:10",
                              "to":  "2026-06-23 04:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-23 04:10",
                              "to":  "2026-06-23 04:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-22 14:20",
                              "to":  "2026-06-22 15:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "Tàu lai ngoài",
                              "from":  "2026-06-22 14:20",
                              "to":  "2026-06-22 15:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-06-22 08:10",
                              "to":  "2026-06-22 10:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-06-22 08:10",
                              "to":  "2026-06-22 10:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2606-094",
        "vessel":  {
                       "name":  "UNITY MARIA/ SC",
                       "flag":  "16",
                       "dwt":  "55705",
                       "imo":  "9543615",
                       "loa":  "187.88",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "54.260 MT",
                      "op":  ""
                  },
        "berthId":  "BP 11",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-06-26 02:40",
        "end":  "2026-07-02 14:30",
        "eta":  "2026-06-26 02:40",
        "etd":  "2026-07-02 14:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-02 14:25",
                              "to":  "2026-07-02 15:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-02 14:25",
                              "to":  "2026-07-02 15:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-07-02 13:45",
                              "to":  "2026-07-02 14:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-07-02 13:45",
                              "to":  "2026-07-02 14:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-30 22:15",
                              "to":  "2026-06-30 23:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-30 22:15",
                              "to":  "2026-06-30 23:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-30 20:30",
                              "to":  "2026-06-30 21:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-30 20:30",
                              "to":  "2026-06-30 21:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-28 20:00",
                              "to":  "2026-06-28 20:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-28 20:00",
                              "to":  "2026-06-28 20:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-28 12:50",
                              "to":  "2026-06-28 13:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-28 12:50",
                              "to":  "2026-06-28 13:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-06-26 10:30",
                              "to":  "2026-06-26 11:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-06-26 10:30",
                              "to":  "2026-06-26 11:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-06-26 00:50",
                              "to":  "2026-06-26 02:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-06-26 00:50",
                              "to":  "2026-06-26 02:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2606-064",
        "vessel":  {
                       "name":  "SHI DAI 11/ FC",
                       "flag":  "45",
                       "dwt":  "75467",
                       "imo":  "9591727",
                       "loa":  "225",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "74.800 MT",
                      "op":  ""
                  },
        "berthId":  "BP 02",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-06-20 09:06",
        "end":  "2026-06-27 03:00",
        "eta":  "2026-06-20 09:06",
        "etd":  "2026-06-27 03:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-06-27 03:00",
                              "to":  "2026-06-27 04:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-06-27 03:00",
                              "to":  "2026-06-27 04:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-06-27 03:05",
                              "to":  "2026-06-27 03:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-27 03:05",
                              "to":  "2026-06-27 03:40",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-06-27 02:25",
                              "to":  "2026-06-27 03:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-27 02:25",
                              "to":  "2026-06-27 03:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-06-27 01:45",
                              "to":  "2026-06-27 02:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-27 01:45",
                              "to":  "2026-06-27 02:25",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-06-25 18:10",
                              "to":  "2026-06-25 18:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-25 18:10",
                              "to":  "2026-06-25 18:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-06-25 15:35",
                              "to":  "2026-06-25 16:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-25 15:35",
                              "to":  "2026-06-25 16:20",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-06-23 10:25",
                              "to":  "2026-06-23 10:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-23 10:25",
                              "to":  "2026-06-23 10:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-06-23 10:00",
                              "to":  "2026-06-23 10:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-23 10:00",
                              "to":  "2026-06-23 10:30",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-06-23 08:50",
                              "to":  "2026-06-23 09:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-23 08:50",
                              "to":  "2026-06-23 09:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-22 01:25",
                              "to":  "2026-06-22 02:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-22 01:25",
                              "to":  "2026-06-22 02:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-21 19:00",
                              "to":  "2026-06-21 19:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-21 19:00",
                              "to":  "2026-06-21 19:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-06-20 12:25",
                              "to":  "2026-06-20 13:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-20 12:25",
                              "to":  "2026-06-20 13:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-06-20 08:15",
                              "to":  "2026-06-20 11:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-06-20 08:15",
                              "to":  "2026-06-20 11:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-20 09:20",
                              "to":  "2026-06-20 10:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-06-20 09:20",
                              "to":  "2026-06-20 10:35",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL EXPLORER",
                              "from":  "2026-06-20 07:05",
                              "to":  "2026-06-20 09:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-06-20 07:05",
                              "to":  "2026-06-20 09:10",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2606-037",
        "vessel":  {
                       "name":  "JEN LR/ FC",
                       "flag":  "170",
                       "dwt":  "82411",
                       "imo":  "9947249",
                       "loa":  "228.99",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Viên gỗ nén",
                      "qty":  "60.126 MT",
                      "op":  ""
                  },
        "berthId":  "BP 03",
        "customer":  "CÔNG TY TNHH HOÀNG ĐẠI VƯƠNG",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-06-14 14:15",
        "end":  "2026-06-26 10:30",
        "eta":  "2026-06-14 14:15",
        "etd":  "2026-06-26 10:30",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL FUTURE",
                              "from":  "2026-06-26 10:40",
                              "to":  "2026-06-26 11:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "TAN CANG 86",
                              "from":  "2026-06-26 10:40",
                              "to":  "2026-06-26 11:55",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-26 07:05",
                              "to":  "2026-06-26 09:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL VOYAGER",
                              "from":  "2026-06-26 07:05",
                              "to":  "2026-06-26 09:15",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    },
    {
        "id":  "2606-031",
        "vessel":  {
                       "name":  "VIET THUAN 56-06/ SC",
                       "flag":  "170",
                       "dwt":  "55557",
                       "imo":  "9278820",
                       "loa":  "189.99",
                       "type":  ""
                   },
        "cargo":  {
                      "name":  "Than đá",
                      "qty":  "53.885 MT",
                      "op":  ""
                  },
        "berthId":  "BP 11",
        "customer":  "CÔNG TY TNHH VẬN TẢI VIỆT THUẬN",
        "contract":  "",
        "pic":  "",
        "status":  "completed",
        "progress":  100,
        "start":  "2026-06-13 13:45",
        "end":  "2026-06-21 08:00",
        "eta":  "2026-06-13 13:45",
        "etd":  "2026-06-21 08:00",
        "revenue":  "0 ₫",
        "resources":  [
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-21 07:50",
                              "to":  "2026-06-21 09:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL RUBY",
                              "from":  "2026-06-21 07:50",
                              "to":  "2026-06-21 09:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-21 00:00",
                              "to":  "2026-06-21 00:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 05",
                              "from":  "2026-06-21 00:00",
                              "to":  "2026-06-21 00:45",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-19 12:15",
                              "to":  "2026-06-19 13:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-19 12:15",
                              "to":  "2026-06-19 13:05",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 03",
                              "from":  "2026-06-19 11:15",
                              "to":  "2026-06-19 12:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          },
                          {
                              "type":  "tug",
                              "id":  "VNL 07",
                              "from":  "2026-06-19 11:15",
                              "to":  "2026-06-19 12:00",
                              "role":  "Hỗ trợ cập/rời phao"
                          }
                      ],
        "notes":  "",
        "risks":  [

                  ],
        "logs":  [

                 ]
    }
];

const OCC_DVHH = [
    {
        "id":  "DV-28085",
        "title":  "Lai dắt DUC TRI 289",
        "from":  "2026-08-03 11:00",
        "to":  "2026-08-03 11:30",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28083",
        "title":  "Lai dắt SEAWAY HAWK",
        "from":  "2026-08-01 05:45",
        "to":  "2026-08-01 12:40",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL FUTURE",
                     "VNL 05",
                     "VNL RUBY",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28081",
        "title":  "Lai dắt LL RACHEL LUI \u0026 LL 3223",
        "from":  "2026-08-03 06:00",
        "to":  "2026-08-03 06:30",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28080",
        "title":  "Lai dắt JASPER",
        "from":  "2026-08-03 17:00",
        "to":  "2026-08-03 18:00",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "planned",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28079",
        "title":  "Lai dắt JASPER",
        "from":  "2026-08-03 06:30",
        "to":  "2026-08-03 07:30",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28078",
        "title":  "Lai dắt COSCO SHIPPING CHANG SHENG",
        "from":  "2026-08-03 06:00",
        "to":  "2026-08-03 07:00",
        "tugs":  [
                     "VNL EXPLORER",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28077",
        "title":  "Lai dắt SEA NOBLE",
        "from":  "2026-08-02 22:00",
        "to":  "2026-08-02 22:45",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28076",
        "title":  "Lai dắt VIET TRUNG 135",
        "from":  "2026-08-02 22:00",
        "to":  "2026-08-02 22:45",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH MAI NGÂN TRÍ",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28075",
        "title":  "Lai dắt GRAND WINNER 9",
        "from":  "2026-08-02 17:35",
        "to":  "2026-08-02 18:40",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY TNHH MTV VẬN TẢI XĂNG DẦU DẦU KHÍ VIỆT NAM (PVOIL TRANS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28074",
        "title":  "Lai dắt TAN CANG 375",
        "from":  "2026-08-02 14:00",
        "to":  "2026-08-02 16:30",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28072",
        "title":  "Lai dắt H-401",
        "from":  "2026-08-02 10:00",
        "to":  "2026-08-02 12:05",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28069",
        "title":  "Lai dắt SEA NOBLE",
        "from":  "2026-08-02 05:05",
        "to":  "2026-08-02 05:45",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28068",
        "title":  "Lai dắt XINGHE EXPRESS",
        "from":  "2026-08-02 04:10",
        "to":  "2026-08-02 04:55",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28067",
        "title":  "Lai dắt SEAWAY SWAN",
        "from":  "2026-08-02 00:00",
        "to":  "2026-08-02 10:15",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL EXPLORER",
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28066",
        "title":  "Lai dắt VIET TRUNG 135",
        "from":  "2026-08-01 23:15",
        "to":  "2026-08-01 23:59",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH MAI NGÂN TRÍ",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28065",
        "title":  "Lai dắt PAULA",
        "from":  "2026-08-01 12:30",
        "to":  "2026-08-01 14:35",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL FUTURE",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28064",
        "title":  "Lai dắt THANH DAT 86",
        "from":  "2026-08-01 10:00",
        "to":  "2026-08-01 10:40",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28063",
        "title":  "Lai dắt LOUIS",
        "from":  "2026-08-01 10:30",
        "to":  "2026-08-01 12:05",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL FUTURE",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28062",
        "title":  "Lai dắt TENMA",
        "from":  "2026-08-01 07:00",
        "to":  "2026-08-01 13:25",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "CTY CP SME WORLDWIDE LOGISTICS",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28061",
        "title":  "Lai dắt LL RACHEL LUI \u0026 LL 3223",
        "from":  "2026-08-01 11:00",
        "to":  "2026-08-01 11:45",
        "tugs":  [
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28055",
        "title":  "Lai dắt ULTRA KUROSHI",
        "from":  "2026-07-31 14:25",
        "to":  "2026-07-31 15:10",
        "tugs":  [
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28054",
        "title":  "Lai dắt VIETSOVPETRO 05",
        "from":  "2026-07-31 10:00",
        "to":  "2026-07-31 11:10",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28053",
        "title":  "Lai dắt TAN CANG 375",
        "from":  "2026-07-31 13:00",
        "to":  "2026-07-31 16:00",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28052",
        "title":  "Lai dắt TRUNG NAM S 05",
        "from":  "2026-07-31 06:45",
        "to":  "2026-07-31 09:00",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28051",
        "title":  "Lai dắt HPS 01",
        "from":  "2026-07-31 14:00",
        "to":  "2026-07-31 14:45",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28050",
        "title":  "Lai dắt FC06",
        "from":  "2026-07-30 16:00",
        "to":  "2026-07-30 18:00",
        "tugs":  [
                     "VNL 05",
                     "VNL 07",
                     "VNL RUBY"
                 ],
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28049",
        "title":  "Lai dắt ZIM MOUNT ELBRUS",
        "from":  "2026-07-31 20:50",
        "to":  "2026-07-31 21:55",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28048",
        "title":  "Lai dắt ZIM MOUNT ELBRUS",
        "from":  "2026-07-30 19:45",
        "to":  "2026-07-30 21:15",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28046",
        "title":  "Lai dắt PISTI",
        "from":  "2026-07-30 13:00",
        "to":  "2026-07-30 14:30",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN VŨNG TÀU (VTOSA)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28040",
        "title":  "Lai dắt XINGHE EXPRESS",
        "from":  "2026-07-31 03:45",
        "to":  "2026-07-31 04:35",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28039",
        "title":  "Lai dắt DAIWAN LEADER",
        "from":  "2026-07-29 10:45",
        "to":  "2026-07-29 11:35",
        "tugs":  [
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28036",
        "title":  "Lai dắt KANWAY FORTUNE",
        "from":  "2026-07-29 20:10",
        "to":  "2026-07-29 21:00",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28035",
        "title":  "Lai dắt KANWAY FORTUNE",
        "from":  "2026-07-29 07:40",
        "to":  "2026-07-29 08:25",
        "tugs":  [
                     "VNL EXPLORER",
                     "Tàu lai ngoài"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28034",
        "title":  "Lai dắt GANGES",
        "from":  "2026-07-29 20:00",
        "to":  "2026-07-29 21:00",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28033",
        "title":  "Lai dắt GANGES",
        "from":  "2026-07-29 03:30",
        "to":  "2026-07-29 04:35",
        "tugs":  [
                     "VNL FUTURE",
                     "Tàu lai ngoài"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28030",
        "title":  "Lai dắt BULK GUATEMALA",
        "from":  "2026-07-29 03:30",
        "to":  "2026-07-29 04:20",
        "tugs":  [
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "VOSA SAIGON",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28026",
        "title":  "Lai dắt HPS 01",
        "from":  "2026-07-28 21:10",
        "to":  "2026-07-28 21:55",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28025",
        "title":  "Lai dắt HPS 01",
        "from":  "2026-07-28 19:20",
        "to":  "2026-07-28 20:00",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28024",
        "title":  "Lai dắt HUB 21 \u0026 HIGHLINE 65",
        "from":  "2026-07-28 05:00",
        "to":  "2026-07-28 05:30",
        "tugs":  [
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28023",
        "title":  "Lai dắt ALRAYAN",
        "from":  "2026-07-28 11:00",
        "to":  "2026-07-28 11:55",
        "tugs":  [
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-28021",
        "title":  "Lai dắt SEAWAY HAWK",
        "from":  "2026-07-27 14:30",
        "to":  "2026-08-01 05:45",
        "tugs":  [
                     "VNL RELIANCE"
                 ],
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27050",
        "title":  "Lai dắt AL AIN",
        "from":  "2026-07-28 13:30",
        "to":  "2026-07-28 14:30",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27049",
        "title":  "Lai dắt AL AIN",
        "from":  "2026-07-27 18:30",
        "to":  "2026-07-28 13:30",
        "tugs":  [
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27048",
        "title":  "Lai dắt AL AIN",
        "from":  "2026-07-27 16:35",
        "to":  "2026-07-27 18:30",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27047",
        "title":  "Lai dắt HPS 01",
        "from":  "2026-07-27 11:30",
        "to":  "2026-07-27 12:15",
        "tugs":  [
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27046",
        "title":  "Lai dắt FORTUNE RICH",
        "from":  "2026-07-27 08:00",
        "to":  "2026-07-27 08:45",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27041",
        "title":  "Lai dắt MTT BANGKOK",
        "from":  "2026-07-27 07:40",
        "to":  "2026-07-27 08:25",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL FUTURE"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27040",
        "title":  "Lai dắt MTT BANGKOK",
        "from":  "2026-07-26 18:30",
        "to":  "2026-07-26 19:35",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27039",
        "title":  "Lai dắt DAIWAN LEADER",
        "from":  "2026-07-26 17:35",
        "to":  "2026-07-26 18:30",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27038",
        "title":  "Lai dắt TRUNG THANG 558",
        "from":  "2026-07-26 09:55",
        "to":  "2026-07-26 10:35",
        "tugs":  [
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27037",
        "title":  "Lai dắt HUB 21 \u0026 HIGHLINE 65",
        "from":  "2026-07-26 05:00",
        "to":  "2026-07-26 05:45",
        "tugs":  [
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27036",
        "title":  "Lai dắt ALLEGRA",
        "from":  "2026-07-27 07:30",
        "to":  "2026-07-27 08:20",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27035",
        "title":  "Lai dắt ALLEGRA",
        "from":  "2026-07-26 03:15",
        "to":  "2026-07-26 04:15",
        "tugs":  [
                     "VNL 05",
                     "VNL RUBY"
                 ],
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27034",
        "title":  "Lai dắt ANTWERP",
        "from":  "2026-07-27 04:00",
        "to":  "2026-07-27 04:55",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27033",
        "title":  "Lai dắt ANTWERP",
        "from":  "2026-07-26 02:30",
        "to":  "2026-07-26 03:40",
        "tugs":  [
                     "VNL VISION",
                     "VNL FUTURE",
                     "VNL EXPLORER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27032",
        "title":  "Lai dắt BBC MACAU",
        "from":  "2026-07-25 09:10",
        "to":  "2026-07-25 09:55",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27031",
        "title":  "Lai dắt HĐ: 169-26/BDV/TCO-VNL",
        "from":  "2026-07-25 01:00",
        "to":  "2026-08-31 12:00",
        "tugs":  [
                     "VNL VISION"
                 ],
        "customer":  "CÔNG TY CP DỊCH VỤ BIỂN TÂN CẢNG (TCO)",
        "status":  "in_progress",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27019",
        "title":  "Lai dắt MINH PHAT 36",
        "from":  "2026-07-24 17:30",
        "to":  "2026-07-24 18:00",
        "tugs":  [
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27018",
        "title":  "Lai dắt APL CHARLESTON",
        "from":  "2026-07-24 15:35",
        "to":  "2026-07-25 18:30",
        "tugs":  [
                     "VNL FUTURE"
                 ],
        "customer":  "CÔNG TY CP DỊCH VỤ BIỂN TÂN CẢNG (TCO)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27017",
        "title":  "Lai dắt THINH LONG 89",
        "from":  "2026-07-23 16:30",
        "to":  "2026-07-23 17:00",
        "tugs":  [
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27016",
        "title":  "Lai dắt SHENZHEN",
        "from":  "2026-07-25 18:10",
        "to":  "2026-07-25 19:15",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27015",
        "title":  "Lai dắt SHENZHEN",
        "from":  "2026-07-24 16:55",
        "to":  "2026-07-24 18:05",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER",
                     "Tàu lai ngoài"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27012",
        "title":  "Lai dắt SON OF GENGHIS",
        "from":  "2026-07-22 07:00",
        "to":  "2026-07-22 14:55",
        "tugs":  [
                     "VNL VISION"
                 ],
        "customer":  "CÔNG TY CP DỊCH VỤ BIỂN TÂN CẢNG (TCO)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27007",
        "title":  "Lai dắt STAITHES",
        "from":  "2026-07-23 14:20",
        "to":  "2026-07-23 15:25",
        "tugs":  [
                     "VNL VISION",
                     "VNL VOYAGER"
                 ],
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27006",
        "title":  "Lai dắt FORTUNE RICH",
        "from":  "2026-07-23 16:30",
        "to":  "2026-07-23 17:15",
        "tugs":  [
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27005",
        "title":  "Lai dắt ZIM MOUNT KILIMANJARO",
        "from":  "2026-07-24 16:25",
        "to":  "2026-07-24 17:35",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL VISION",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27004",
        "title":  "Lai dắt ZIM MOUNT KILIMANJARO",
        "from":  "2026-07-23 14:30",
        "to":  "2026-07-23 15:50",
        "tugs":  [
                     "VNL RUBY",
                     "VNL RELIANCE",
                     "VNL FUTURE"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27003",
        "title":  "Lai dắt GLORY SKY",
        "from":  "2026-07-23 07:30",
        "to":  "2026-07-23 09:00",
        "tugs":  [
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI LONG HẢI",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-27002",
        "title":  "Lai dắt XUONG NOI CAU 1000 T",
        "from":  "2026-07-23 04:15",
        "to":  "2026-07-23 05:05",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ THƯƠNG MẠI MTP",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26990",
        "title":  "Lai dắt SAN DIEGO",
        "from":  "2026-07-22 21:50",
        "to":  "2026-07-22 22:55",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL VISION",
                     "VNL FUTURE"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26989",
        "title":  "Lai dắt SAN DIEGO",
        "from":  "2026-07-22 08:05",
        "to":  "2026-07-22 09:20",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL FUTURE",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26988",
        "title":  "Lai dắt VIET THUAN 80-05/ FC",
        "from":  "2026-07-23 07:50",
        "to":  "2026-07-23 08:55",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26987",
        "title":  "Lai dắt VIET THUAN 12-02",
        "from":  "2026-07-23 02:30",
        "to":  "2026-07-23 03:05",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26986",
        "title":  "Lai dắt VIET THUAN 12-02",
        "from":  "2026-07-22 07:15",
        "to":  "2026-07-22 08:00",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26985",
        "title":  "Lai dắt VIET THUAN 11-05",
        "from":  "2026-07-22 01:00",
        "to":  "2026-07-22 01:45",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26984",
        "title":  "Lai dắt STAITHES",
        "from":  "2026-07-21 19:35",
        "to":  "2026-07-21 20:40",
        "tugs":  [
                     "VNL 03",
                     "VNL RUBY"
                 ],
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26983",
        "title":  "Lai dắt BULK GUATEMALA",
        "from":  "2026-07-21 20:00",
        "to":  "2026-07-21 21:10",
        "tugs":  [
                     "VNL 05",
                     "VNL VOYAGER"
                 ],
        "customer":  "VOSA SAIGON",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26982",
        "title":  "Lai dắt TRINH XUAN 03",
        "from":  "2026-07-21 14:35",
        "to":  "2026-07-21 15:15",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26981",
        "title":  "Lai dắt ALRAYAN",
        "from":  "2026-07-21 14:40",
        "to":  "2026-07-21 15:30",
        "tugs":  [
                     "VNL 05",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26980",
        "title":  "Lai dắt ZIM SPINEL",
        "from":  "2026-07-22 06:50",
        "to":  "2026-07-22 07:50",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL FUTURE"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26979",
        "title":  "Lai dắt ZIM SPINEL",
        "from":  "2026-07-21 12:50",
        "to":  "2026-07-21 13:50",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26977",
        "title":  "Lai dắt VTC DRAGON",
        "from":  "2026-07-23 07:40",
        "to":  "2026-07-23 08:25",
        "tugs":  [
                     "VNL VISION",
                     "VNL FUTURE"
                 ],
        "customer":  "VOSA SAIGON",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26976",
        "title":  "Lai dắt VTC DRAGON",
        "from":  "2026-07-21 13:40",
        "to":  "2026-07-21 14:25",
        "tugs":  [
                     "VNL 05",
                     "VNL VOYAGER"
                 ],
        "customer":  "VOSA SAIGON",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26975",
        "title":  "Lai dắt TORM STRENGTH",
        "from":  "2026-07-22 13:45",
        "to":  "2026-07-22 14:45",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL FUTURE"
                 ],
        "customer":  "CÔNG TY TNHH MTV VẬN TẢI XĂNG DẦU DẦU KHÍ VIỆT NAM (PVOIL TRANS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26974",
        "title":  "Lai dắt TORM STRENGTH",
        "from":  "2026-07-21 12:00",
        "to":  "2026-07-21 13:00",
        "tugs":  [
                     "Tàu lai ngoài 02",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY TNHH MTV VẬN TẢI XĂNG DẦU DẦU KHÍ VIỆT NAM (PVOIL TRANS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26973",
        "title":  "Lai dắt PV DRILLING VIII",
        "from":  "2026-07-21 05:45",
        "to":  "2026-07-21 16:00",
        "tugs":  [
                     "VNL VISION",
                     "VNL FUTURE",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26971",
        "title":  "Lai dắt VIET HOANG 05",
        "from":  "2026-07-21 12:50",
        "to":  "2026-07-21 13:30",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26968",
        "title":  "Lai dắt VIET THUAN 11-05",
        "from":  "2026-07-21 11:40",
        "to":  "2026-07-21 12:25",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26967",
        "title":  "Lai dắt VIET THUAN 10-03",
        "from":  "2026-07-21 08:00",
        "to":  "2026-07-21 08:45",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26966",
        "title":  "Lai dắt EASTERN REPUBLIC",
        "from":  "2026-07-21 06:45",
        "to":  "2026-07-21 07:40",
        "tugs":  [
                     "VNL 05",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26958",
        "title":  "Lai dắt BUDVA",
        "from":  "2026-07-20 12:40",
        "to":  "2026-07-20 13:45",
        "tugs":  [
                     "VNL 05",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26957",
        "title":  "Lai dắt WAN HAI 371",
        "from":  "2026-07-20 12:20",
        "to":  "2026-07-20 13:05",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26956",
        "title":  "Lai dắt WAN HAI 371",
        "from":  "2026-07-20 06:25",
        "to":  "2026-07-20 07:30",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL FUTURE"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26949",
        "title":  "Lai dắt VIET THUAN 10-03",
        "from":  "2026-07-20 18:55",
        "to":  "2026-07-20 19:35",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26948",
        "title":  "Lai dắt VIET THUAN 11-01",
        "from":  "2026-07-20 18:00",
        "to":  "2026-07-20 18:40",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26947",
        "title":  "Lai dắt VIET THUAN 11-01",
        "from":  "2026-07-20 06:45",
        "to":  "2026-07-20 07:35",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26946",
        "title":  "Lai dắt VIET THUAN 11-03",
        "from":  "2026-07-20 05:50",
        "to":  "2026-07-20 06:30",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26945",
        "title":  "Lai dắt VIET THUAN 11-03",
        "from":  "2026-07-19 18:40",
        "to":  "2026-07-19 19:30",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26942",
        "title":  "Lai dắt PHUONG NAM 46",
        "from":  "2026-07-17 16:30",
        "to":  "2026-07-17 17:15",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26941",
        "title":  "Lai dắt GOLDEN SHINE",
        "from":  "2026-07-19 12:00",
        "to":  "2026-07-19 12:40",
        "tugs":  [
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26940",
        "title":  "Lai dắt EASTERN REPUBLIC",
        "from":  "2026-07-19 11:00",
        "to":  "2026-07-19 12:10",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26939",
        "title":  "Lai dắt VIET THUAN 12-06",
        "from":  "2026-07-18 23:00",
        "to":  "2026-07-18 23:40",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26937",
        "title":  "Lai dắt VS GLORY",
        "from":  "2026-07-18 17:00",
        "to":  "2026-07-18 17:50",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH HÀNG HẢI BẢO TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26936",
        "title":  "Lai dắt VIET KHANG 89",
        "from":  "2026-07-18 12:00",
        "to":  "2026-07-18 12:50",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26935",
        "title":  "Lai dắt NEPTUNE HP66",
        "from":  "2026-07-18 16:20",
        "to":  "2026-07-18 17:10",
        "tugs":  [
                     "VNL 05",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26934",
        "title":  "Lai dắt ALRAYAN",
        "from":  "2026-07-18 11:00",
        "to":  "2026-07-18 11:50",
        "tugs":  [
                     "VNL 05",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26933",
        "title":  "Lai dắt ZIM MOUNT OLYMPUS",
        "from":  "2026-07-19 22:50",
        "to":  "2026-07-19 23:45",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL VISION",
                     "VNL FUTURE"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26932",
        "title":  "Lai dắt ZIM MOUNT OLYMPUS",
        "from":  "2026-07-18 11:35",
        "to":  "2026-07-18 13:30",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26928",
        "title":  "Lai dắt GOLDEN SHINE",
        "from":  "2026-07-17 21:30",
        "to":  "2026-07-17 22:20",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26926",
        "title":  "Lai dắt VIET THUAN 12-06",
        "from":  "2026-07-17 23:15",
        "to":  "2026-07-17 23:59",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26925",
        "title":  "Lai dắt VIET THUAN 10-05",
        "from":  "2026-07-17 15:50",
        "to":  "2026-07-17 16:35",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26921",
        "title":  "Lai dắt THANG LOI 168",
        "from":  "2026-07-17 10:10",
        "to":  "2026-07-17 10:55",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26920",
        "title":  "Lai dắt VETAG 8",
        "from":  "2026-07-17 04:00",
        "to":  "2026-07-17 17:15",
        "tugs":  [
                     "VNL VISION"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN XÂY LẮP CÔNG TRÌNH NĂNG LƯỢNG BIỂN (OEI)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26918",
        "title":  "Lai dắt DAI PHUC 18",
        "from":  "2026-07-17 06:20",
        "to":  "2026-07-17 07:05",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26916",
        "title":  "Lai dắt DA KANG",
        "from":  "2026-07-17 05:15",
        "to":  "2026-07-17 06:00",
        "tugs":  [
                     "VNL 05",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26915",
        "title":  "Lai dắt NEPTUNE HP66",
        "from":  "2026-07-16 21:05",
        "to":  "2026-07-16 22:10",
        "tugs":  [
                     "VNL 05",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26914",
        "title":  "Lai dắt VIET THUAN 10-05",
        "from":  "2026-07-16 22:00",
        "to":  "2026-07-16 22:40",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26906",
        "title":  "Lai dắt VIET THUAN 80-05/ FC",
        "from":  "2026-07-16 14:10",
        "to":  "2026-07-16 17:20",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26905",
        "title":  "Lai dắt LAN HAI FANG ZHOU",
        "from":  "2026-07-15 21:00",
        "to":  "2026-07-15 21:45",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26902",
        "title":  "Lai dắt VIET HUNG 08",
        "from":  "2026-07-15 13:35",
        "to":  "2026-07-15 14:20",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26899",
        "title":  "Lai dắt LANPAN CB9",
        "from":  "2026-07-15 08:10",
        "to":  "2026-07-15 12:45",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26898",
        "title":  "Lai dắt BO RUN YONG LI",
        "from":  "2026-07-15 13:00",
        "to":  "2026-07-15 14:20",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "S5 Vietnam Ltd",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26897",
        "title":  "Lai dắt GOJIRA 1 \u0026 KAIJU CATEGORY 1",
        "from":  "2026-07-15 09:00",
        "to":  "2026-07-15 09:30",
        "tugs":  [
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ TIẾP VẬN VÀ THƯƠNG MẠI SÀI GÒN CỬU LONG (SGCL)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26896",
        "title":  "Lai dắt AQUAPRIMA",
        "from":  "2026-07-15 08:45",
        "to":  "2026-07-15 10:00",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26895",
        "title":  "Lai dắt KANWAY FORTUNE",
        "from":  "2026-07-15 20:20",
        "to":  "2026-07-15 21:10",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26894",
        "title":  "Lai dắt KANWAY FORTUNE",
        "from":  "2026-07-15 07:45",
        "to":  "2026-07-15 08:40",
        "tugs":  [
                     "VNL 05",
                     "Tàu lai ngoài"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26893",
        "title":  "Lai dắt COLORADO",
        "from":  "2026-07-15 21:50",
        "to":  "2026-07-15 22:45",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL VISION"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26892",
        "title":  "Lai dắt COLORADO",
        "from":  "2026-07-15 08:05",
        "to":  "2026-07-15 09:15",
        "tugs":  [
                     "VNL RELIANCE",
                     "VNL VISION"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26885",
        "title":  "Lai dắt SDTR GLORIA",
        "from":  "2026-07-14 13:00",
        "to":  "2026-07-14 14:15",
        "tugs":  [
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26884",
        "title":  "Lai dắt ECHO.GR",
        "from":  "2026-07-14 13:05",
        "to":  "2026-07-14 14:15",
        "tugs":  [
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26883",
        "title":  "Lai dắt ALRAYAN",
        "from":  "2026-07-15 05:30",
        "to":  "2026-07-15 06:30",
        "tugs":  [
                     "VNL 05",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26882",
        "title":  "Lai dắt ZHONG YUAN SHUN",
        "from":  "2026-07-14 13:10",
        "to":  "2026-07-14 14:00",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26881",
        "title":  "Lai dắt DA KANG",
        "from":  "2026-07-14 03:30",
        "to":  "2026-07-14 04:40",
        "tugs":  [
                     "VNL 05",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26880",
        "title":  "Lai dắt CABLE RETRIEVER",
        "from":  "2026-07-13 21:00",
        "to":  "2026-07-13 21:40",
        "tugs":  [
                     "VNL 07",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26879",
        "title":  "Lai dắt BAO LONG 06",
        "from":  "2026-07-13 18:45",
        "to":  "2026-07-13 19:30",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26878",
        "title":  "Lai dắt PHUC HOANG 26",
        "from":  "2026-07-13 13:50",
        "to":  "2026-07-13 14:25",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY TNHH HÀNG HẢI BẢO TÍN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26871",
        "title":  "Lai dắt TAN CANG 375",
        "from":  "2026-07-11 08:30",
        "to":  "2026-07-11 11:30",
        "tugs":  [
                     "VNL FUTURE"
                 ],
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26870",
        "title":  "Lai dắt VS GLORY",
        "from":  "2026-07-13 11:40",
        "to":  "2026-07-13 13:40",
        "tugs":  [
                     "VNL 05",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26869",
        "title":  "Lai dắt LAN HAI FANG ZHOU",
        "from":  "2026-07-12 18:25",
        "to":  "2026-07-12 19:20",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26868",
        "title":  "Lai dắt SRIWANGI V",
        "from":  "2026-07-12 11:30",
        "to":  "2026-07-12 12:20",
        "tugs":  [
                     "VNL VISION"
                 ],
        "customer":  "CHI NHÁNH CÔNG TY TNHH THORESEN – VINAMA TẠI BÀ RỊA - VŨNG TÀU",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26867",
        "title":  "Lai dắt CHUANG XIN 6",
        "from":  "2026-07-12 11:25",
        "to":  "2026-07-12 12:10",
        "tugs":  [
                     "VNL 03",
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26866",
        "title":  "Lai dắt CABLE RETRIEVER",
        "from":  "2026-07-12 10:45",
        "to":  "2026-07-12 11:55",
        "tugs":  [
                     "VNL 07",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26865",
        "title":  "Lai dắt MINH PHUC 555",
        "from":  "2026-07-12 09:30",
        "to":  "2026-07-12 10:15",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26864",
        "title":  "Lai dắt HPS 01",
        "from":  "2026-07-12 10:05",
        "to":  "2026-07-12 10:45",
        "tugs":  [
                     "VNL 03",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26863",
        "title":  "Lai dắt HPS 01",
        "from":  "2026-07-11 19:20",
        "to":  "2026-07-11 20:05",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26862",
        "title":  "Lai dắt ZHONG YUAN SHUN",
        "from":  "2026-07-11 17:10",
        "to":  "2026-07-11 18:00",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26861",
        "title":  "Lai dắt MTT BANGKOK",
        "from":  "2026-07-11 17:30",
        "to":  "2026-07-11 18:30",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26860",
        "title":  "Lai dắt MTT BANGKOK",
        "from":  "2026-07-11 09:30",
        "to":  "2026-07-11 10:40",
        "tugs":  [
                     "VNL 03",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26859",
        "title":  "Lai dắt HONG PHU 18",
        "from":  "2026-07-11 10:00",
        "to":  "2026-07-11 10:45",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26858",
        "title":  "Lai dắt LANPAN CB9",
        "from":  "2026-07-11 06:00",
        "to":  "2026-07-11 10:05",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26856",
        "title":  "Lai dắt CHANG DA 368",
        "from":  "2026-07-13 19:45",
        "to":  "2026-07-13 20:25",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26855",
        "title":  "Lai dắt CHANG DA 368",
        "from":  "2026-07-11 04:00",
        "to":  "2026-07-11 05:00",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26851",
        "title":  "Lai dắt ZIM EMERALD",
        "from":  "2026-07-10 23:00",
        "to":  "2026-07-11 00:50",
        "tugs":  [
                     "VNL FUTURE",
                     "Tàu lai ngoài"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26850",
        "title":  "Lai dắt ZIM EMERALD",
        "from":  "2026-07-10 10:20",
        "to":  "2026-07-10 11:40",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26842",
        "title":  "Lai dắt TU CUONG 68",
        "from":  "2026-07-10 10:10",
        "to":  "2026-07-10 11:00",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26841",
        "title":  "Lai dắt VIET THUAN 11-06",
        "from":  "2026-07-10 09:10",
        "to":  "2026-07-10 09:55",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26840",
        "title":  "Lai dắt BRAVE QUEST",
        "from":  "2026-07-10 08:35",
        "to":  "2026-07-10 09:50",
        "tugs":  [
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26836",
        "title":  "Lai dắt GOJIRA 1 \u0026 KAIJU CATEGORY 1",
        "from":  "2026-07-10 09:00",
        "to":  "2026-07-10 09:30",
        "tugs":  [
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ TIẾP VẬN VÀ THƯƠNG MẠI SÀI GÒN CỬU LONG (SGCL)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26835",
        "title":  "Lai dắt STRATEGIC HARMONY",
        "from":  "2026-07-11 09:00",
        "to":  "2026-07-11 09:45",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-26834",
        "title":  "Lai dắt STRATEGIC HARMONY",
        "from":  "2026-07-10 04:35",
        "to":  "2026-07-10 05:50",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-25838",
        "title":  "Lai dắt MANDARIN RIVER",
        "from":  "2026-07-09 23:20",
        "to":  "2026-07-10 00:10",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-25837",
        "title":  "Lai dắt ZIM MOUNT VINSON",
        "from":  "2026-07-10 23:30",
        "to":  "2026-07-11 00:45",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-25836",
        "title":  "Lai dắt ZIM MOUNT VINSON",
        "from":  "2026-07-09 22:10",
        "to":  "2026-07-09 23:40",
        "tugs":  [
                     "TAN CANG 86",
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-25831",
        "title":  "Lai dắt MICLYN 2510",
        "from":  "2026-07-09 08:15",
        "to":  "2026-07-09 14:00",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-25830",
        "title":  "Lai dắt AQUAPRIMA",
        "from":  "2026-07-09 07:40",
        "to":  "2026-07-09 09:10",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-25829",
        "title":  "Lai dắt MACALLAN 9 \u0026 ANGELUS",
        "from":  "2026-07-09 02:00",
        "to":  "2026-07-09 02:45",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24829",
        "title":  "Lai dắt BBC WASHINGTON",
        "from":  "2026-07-08 14:25",
        "to":  "2026-07-08 15:10",
        "tugs":  [
                     "VNL 03"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24828",
        "title":  "Lai dắt CHUANG XIN 6",
        "from":  "2026-07-08 15:20",
        "to":  "2026-07-08 16:15",
        "tugs":  [
                     "VNL 03",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24824",
        "title":  "Lai dắt DANUBE",
        "from":  "2026-07-08 19:30",
        "to":  "2026-07-08 20:40",
        "tugs":  [
                     "TAN CANG 86",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24823",
        "title":  "Lai dắt DANUBE",
        "from":  "2026-07-08 00:00",
        "to":  "2026-07-08 01:10",
        "tugs":  [
                     "TAN CANG 86",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24822",
        "title":  "Lai dắt TAN CANG 375",
        "from":  "2026-07-07 13:30",
        "to":  "2026-07-07 19:30",
        "tugs":  [
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24817",
        "title":  "Lai dắt MACALLAN 9 \u0026 ANGELUS",
        "from":  "2026-07-06 16:45",
        "to":  "2026-07-06 18:05",
        "tugs":  [
                     "VNL 03"
                 ],
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24816",
        "title":  "Lai dắt MANDARIN RIVER",
        "from":  "2026-07-06 12:10",
        "to":  "2026-07-06 13:10",
        "tugs":  [
                     "VNL 05",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24815",
        "title":  "Lai dắt EASTERN REPUBLIC",
        "from":  "2026-07-06 10:10",
        "to":  "2026-07-06 14:15",
        "tugs":  [
                     "VNL FUTURE"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24800",
        "title":  "Lai dắt JIALI",
        "from":  "2026-07-05 23:30",
        "to":  "2026-07-06 00:15",
        "tugs":  [
                     "VNL 05",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24799",
        "title":  "Lai dắt FORTUNE VICTORY",
        "from":  "2026-07-05 12:15",
        "to":  "2026-07-05 13:00",
        "tugs":  [
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24798",
        "title":  "Lai dắt TIPM NO.514001",
        "from":  "2026-07-07 06:10",
        "to":  "2026-07-07 11:00",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24796",
        "title":  "Lai dắt MICLYN 2510",
        "from":  "2026-07-04 09:50",
        "to":  "2026-07-09 08:00",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24795",
        "title":  "Lai dắt PV DRILLING VIII",
        "from":  "2026-07-04 07:00",
        "to":  "2026-07-04 15:00",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24794",
        "title":  "Lai dắt INCE BOSPHORUS",
        "from":  "2026-07-04 06:20",
        "to":  "2026-07-04 07:55",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24793",
        "title":  "Lai dắt ESL OMAN",
        "from":  "2026-07-04 11:00",
        "to":  "2026-07-04 12:00",
        "tugs":  [
                     "Tàu lai ngoài 02",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY TNHH TIẾP VẬN HỪNG Á (ESL)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24792",
        "title":  "Lai dắt ESL OMAN",
        "from":  "2026-07-03 21:30",
        "to":  "2026-07-03 22:25",
        "tugs":  [
                     "VNL VISION",
                     "TAN CANG 86"
                 ],
        "customer":  "CÔNG TY TNHH TIẾP VẬN HỪNG Á (ESL)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24786",
        "title":  "Lai dắt TIPM NO.514001",
        "from":  "2026-07-03 05:10",
        "to":  "2026-07-03 09:30",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24785",
        "title":  "Lai dắt WAN HAI 901",
        "from":  "2026-07-03 15:00",
        "to":  "2026-07-03 16:15",
        "tugs":  [
                     "VNL VISION",
                     "TAN CANG 86"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24784",
        "title":  "Lai dắt WAN HAI 901",
        "from":  "2026-07-03 06:20",
        "to":  "2026-07-03 07:25",
        "tugs":  [
                     "TAN CANG 86",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24783",
        "title":  "Lai dắt PAVIDA NAREE",
        "from":  "2026-07-04 06:30",
        "to":  "2026-07-04 07:20",
        "tugs":  [
                     "VNL VISION",
                     "VNL 03"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN VŨNG TÀU (VTOSA)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24782",
        "title":  "Lai dắt PAVIDA NAREE",
        "from":  "2026-07-02 21:15",
        "to":  "2026-07-02 22:20",
        "tugs":  [
                     "VNL 03",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN VŨNG TÀU (VTOSA)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24778",
        "title":  "Lai dắt VNL09",
        "from":  "2026-07-02 16:40",
        "to":  "2026-07-02 20:25",
        "tugs":  [
                     "VNL 03",
                     "VNL EXPLORER"
                 ],
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24777",
        "title":  "Lai dắt ACE GOLD",
        "from":  "2026-07-02 15:00",
        "to":  "2026-07-02 15:45",
        "tugs":  [
                     "VNL 07",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24774",
        "title":  "Lai dắt VTT 99",
        "from":  "2026-07-02 16:10",
        "to":  "2026-07-02 16:55",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24770",
        "title":  "Lai dắt ZIM MOUNT EVEREST",
        "from":  "2026-07-04 15:30",
        "to":  "2026-07-04 16:20",
        "tugs":  [
                     "VNL VISION",
                     "VNL EXPLORER",
                     "Tàu lai ngoài"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24769",
        "title":  "Lai dắt ZIM MOUNT EVEREST",
        "from":  "2026-07-02 22:25",
        "to":  "2026-07-02 23:30",
        "tugs":  [
                     "VNL VISION",
                     "Tàu lai ngoài 02",
                     "Tàu lai ngoài"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24768",
        "title":  "Lai dắt LANPAN CB9",
        "from":  "2026-07-02 11:15",
        "to":  "2026-07-02 16:15",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24767",
        "title":  "Lai dắt FORTUNE VICTORY",
        "from":  "2026-07-02 09:20",
        "to":  "2026-07-02 10:25",
        "tugs":  [
                     "VNL 03"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24764",
        "title":  "Lai dắt TAN CANG 375",
        "from":  "2026-07-01 11:15",
        "to":  "2026-07-01 16:30",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24763",
        "title":  "Lai dắt MICLYN 2510",
        "from":  "2026-06-30 11:15",
        "to":  "2026-06-30 23:59",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24762",
        "title":  "Lai dắt MISSISSIPPI",
        "from":  "2026-07-01 21:35",
        "to":  "2026-07-01 22:25",
        "tugs":  [
                     "TAN CANG 86",
                     "VNL EXPLORER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24761",
        "title":  "Lai dắt MISSISSIPPI",
        "from":  "2026-07-01 04:20",
        "to":  "2026-07-01 05:25",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24760",
        "title":  "Lai dắt MICLYN 2510",
        "from":  "2026-07-01 00:00",
        "to":  "2026-07-01 05:10",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24759",
        "title":  "Lai dắt TIPM NO.514001",
        "from":  "2026-06-30 22:50",
        "to":  "2026-07-01 03:25",
        "tugs":  [
                     "VNL RUBY"
                 ],
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24756",
        "title":  "Lai dắt HONG TAI 616",
        "from":  "2026-06-30 14:30",
        "to":  "2026-06-30 15:05",
        "tugs":  [
                     "TAN CANG 86"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24755",
        "title":  "Lai dắt JIALI",
        "from":  "2026-06-30 13:35",
        "to":  "2026-06-30 14:30",
        "tugs":  [
                     "TAN CANG 86",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24754",
        "title":  "Lai dắt SEA MEADOW 12",
        "from":  "2026-06-30 10:25",
        "to":  "2026-06-30 14:00",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH HẢI DƯƠNG (HADUCO)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24753",
        "title":  "Lai dắt DAI PHUC 19",
        "from":  "2026-06-29 20:40",
        "to":  "2026-06-29 21:25",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24752",
        "title":  "Lai dắt MARINE MOON",
        "from":  "2026-06-29 12:05",
        "to":  "2026-06-29 12:50",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH VẬN TẢI LOGISTICS TRUNG KIÊN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24751",
        "title":  "Lai dắt INCE BOSPHORUS",
        "from":  "2026-06-29 13:00",
        "to":  "2026-06-29 14:45",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24750",
        "title":  "Lai dắt YU PENG",
        "from":  "2026-06-29 08:15",
        "to":  "2026-06-29 09:00",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24749",
        "title":  "Lai dắt VNL09",
        "from":  "2026-06-29 07:00",
        "to":  "2026-06-29 09:00",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24748",
        "title":  "Lai dắt FC06",
        "from":  "2026-06-29 04:50",
        "to":  "2026-06-29 07:20",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24747",
        "title":  "Lai dắt VNL09",
        "from":  "2026-06-29 03:40",
        "to":  "2026-06-29 04:40",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24746",
        "title":  "Lai dắt JASPER",
        "from":  "2026-06-29 19:50",
        "to":  "2026-06-29 20:50",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24745",
        "title":  "Lai dắt JASPER",
        "from":  "2026-06-29 04:05",
        "to":  "2026-06-29 05:10",
        "tugs":  [
                     "TAN CANG 86",
                     "VNL VOYAGER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24744",
        "title":  "Lai dắt ROTTERDAM",
        "from":  "2026-06-30 08:30",
        "to":  "2026-06-30 09:40",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24743",
        "title":  "Lai dắt ROTTERDAM",
        "from":  "2026-06-29 02:40",
        "to":  "2026-06-29 03:55",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86",
                     "VNL VOYAGER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24742",
        "title":  "Lai dắt VNL08",
        "from":  "2026-06-28 09:50",
        "to":  "2026-06-28 11:30",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24741",
        "title":  "Lai dắt HAI NAM 79",
        "from":  "2026-06-28 06:55",
        "to":  "2026-06-28 07:40",
        "tugs":  [
                     "VNL 05",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ TIẾP VẬN VÀ THƯƠNG MẠI SÀI GÒN CỬU LONG (SGCL)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24740",
        "title":  "Lai dắt HONG TAI 616",
        "from":  "2026-06-28 04:20",
        "to":  "2026-06-28 05:05",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24739",
        "title":  "Lai dắt SUN TZU + SON OF GENGHIS",
        "from":  "2026-06-28 02:15",
        "to":  "2026-06-28 03:00",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24738",
        "title":  "Lai dắt BH XIBAIPO",
        "from":  "2026-06-27 11:30",
        "to":  "2026-06-27 12:20",
        "tugs":  [
                     "VNL RUBY",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY TNHH VẬN TẢI MÔI GIỚI THUÊ TÀU BIỂN ĐÔNG Á SÀI GÒN – SAIGON EAST ASIA SHIPPING CO., LTD (SEAC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24737",
        "title":  "Lai dắt TIPM NO.514001",
        "from":  "2026-06-27 05:30",
        "to":  "2026-06-27 11:15",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86",
                     "VNL 03",
                     "VNL VOYAGER"
                 ],
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24734",
        "title":  "Lai dắt VNL09",
        "from":  "2026-06-27 06:15",
        "to":  "2026-06-27 07:15",
        "tugs":  [
                     "VNL 03"
                 ],
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24733",
        "title":  "Lai dắt LANPAN CB9",
        "from":  "2026-06-27 05:30",
        "to":  "2026-06-27 08:10",
        "tugs":  [
                     "Tàu lai ngoài 02",
                     "TAN CANG 86",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24729",
        "title":  "Lai dắt SSI DOMINATOR",
        "from":  "2026-06-27 02:00",
        "to":  "2026-06-27 04:05",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24728",
        "title":  "Lai dắt ZIM MOUNT FUJI",
        "from":  "2026-06-28 03:00",
        "to":  "2026-06-28 04:10",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86",
                     "VNL EXPLORER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24727",
        "title":  "Lai dắt ZIM MOUNT FUJI",
        "from":  "2026-06-27 01:00",
        "to":  "2026-06-27 02:30",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86",
                     "VNL VOYAGER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24726",
        "title":  "Lai dắt FORTUNE GENESIS",
        "from":  "2026-06-29 07:45",
        "to":  "2026-06-29 08:35",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24725",
        "title":  "Lai dắt FORTUNE GENESIS",
        "from":  "2026-06-27 01:00",
        "to":  "2026-06-27 02:00",
        "tugs":  [
                     "Tàu lai ngoài 02",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24724",
        "title":  "Lai dắt CHIEN TRUONG 66",
        "from":  "2026-06-26 23:20",
        "to":  "2026-06-26 23:59",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24723",
        "title":  "Lai dắt MTT BANGKOK",
        "from":  "2026-06-27 02:00",
        "to":  "2026-06-27 03:10",
        "tugs":  [
                     "VNL 03",
                     "Tàu lai ngoài"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24722",
        "title":  "Lai dắt MTT BANGKOK",
        "from":  "2026-06-26 18:30",
        "to":  "2026-06-26 19:00",
        "tugs":  [
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24716",
        "title":  "Lai dắt TIAN QI",
        "from":  "2026-06-26 05:40",
        "to":  "2026-06-26 06:25",
        "tugs":  [
                     "VNL 03",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24715",
        "title":  "Lai dắt AN VINH 18",
        "from":  "2026-06-26 05:00",
        "to":  "2026-06-26 05:45",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24714",
        "title":  "Lai dắt ACE GOLD",
        "from":  "2026-06-26 03:10",
        "to":  "2026-06-26 03:55",
        "tugs":  [
                     "VNL 05",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-24713",
        "title":  "Lai dắt DEMA",
        "from":  "2026-06-26 01:00",
        "to":  "2026-06-26 01:50",
        "tugs":  [
                     "VNL 05",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-23724",
        "title":  "Lai dắt YU PENG",
        "from":  "2026-06-25 18:40",
        "to":  "2026-06-25 19:50",
        "tugs":  [
                     "VNL 05",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-23723",
        "title":  "Lai dắt DA KANG",
        "from":  "2026-06-25 16:45",
        "to":  "2026-06-25 17:30",
        "tugs":  [
                     "VNL 05",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-23718",
        "title":  "Lai dắt POE GIANT 11",
        "from":  "2026-06-25 09:10",
        "to":  "2026-06-25 10:00",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22712",
        "title":  "Lai dắt AN THANH 18",
        "from":  "2026-06-24 23:30",
        "to":  "2026-06-24 23:59",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22711",
        "title":  "Lai dắt PHUONG NAM 46",
        "from":  "2026-06-24 17:25",
        "to":  "2026-06-24 18:05",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22708",
        "title":  "Lai dắt POE GIANT 11",
        "from":  "2026-06-24 14:00",
        "to":  "2026-06-24 15:15",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22707",
        "title":  "Lai dắt HAI NAM 79",
        "from":  "2026-06-24 10:20",
        "to":  "2026-06-24 11:10",
        "tugs":  [
                     "VNL 05",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ TIẾP VẬN VÀ THƯƠNG MẠI SÀI GÒN CỬU LONG (SGCL)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22706",
        "title":  "Lai dắt NESTOS",
        "from":  "2026-06-24 17:00",
        "to":  "2026-06-24 18:05",
        "tugs":  [
                     "TAN CANG 86",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22705",
        "title":  "Lai dắt NESTOS",
        "from":  "2026-06-24 10:00",
        "to":  "2026-06-24 11:00",
        "tugs":  [
                     "TAN CANG 86",
                     "VNL EXPLORER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22704",
        "title":  "Lai dắt BH XIBAIPO",
        "from":  "2026-06-24 09:35",
        "to":  "2026-06-24 10:35",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY TNHH VẬN TẢI MÔI GIỚI THUÊ TÀU BIỂN ĐÔNG Á SÀI GÒN – SAIGON EAST ASIA SHIPPING CO., LTD (SEAC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22703",
        "title":  "Lai dắt LANPAN CB9",
        "from":  "2026-06-24 01:50",
        "to":  "2026-06-24 09:15",
        "tugs":  [
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22698",
        "title":  "Lai dắt TIAN QI",
        "from":  "2026-06-24 16:35",
        "to":  "2026-06-24 17:45",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22697",
        "title":  "Lai dắt TIAN QI",
        "from":  "2026-06-23 14:55",
        "to":  "2026-06-23 15:50",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22696",
        "title":  "Lai dắt SSI DOMINATOR",
        "from":  "2026-06-23 13:35",
        "to":  "2026-06-23 15:40",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL RUBY"
                 ],
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22695",
        "title":  "Lai dắt BRILLIANT KNIGHT",
        "from":  "2026-06-23 10:35",
        "to":  "2026-06-23 11:55",
        "tugs":  [
                     "TAN CANG 86",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22694",
        "title":  "Lai dắt JTN 253",
        "from":  "2026-06-23 09:00",
        "to":  "2026-06-23 11:50",
        "tugs":  [
                     "VNL 03",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22690",
        "title":  "Lai dắt ZIM XIAMEN",
        "from":  "2026-06-23 22:30",
        "to":  "2026-06-23 23:40",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22689",
        "title":  "Lai dắt ZIM XIAMEN",
        "from":  "2026-06-23 08:40",
        "to":  "2026-06-23 09:50",
        "tugs":  [
                     "Tàu lai ngoài 02",
                     "VNL 03",
                     "Tàu lai ngoài"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22688",
        "title":  "Lai dắt LANPAN CB9",
        "from":  "2026-06-23 05:45",
        "to":  "2026-06-23 10:20",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22687",
        "title":  "Lai dắt DEMA",
        "from":  "2026-06-23 01:15",
        "to":  "2026-06-23 02:15",
        "tugs":  [
                     "VNL 05",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22686",
        "title":  "Lai dắt BIG DECK 1",
        "from":  "2026-06-22 19:50",
        "to":  "2026-06-22 20:30",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22685",
        "title":  "Lai dắt SUN TZU + SON OF GENGHIS",
        "from":  "2026-06-22 19:15",
        "to":  "2026-06-22 20:00",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22684",
        "title":  "Lai dắt TAN CANG 375",
        "from":  "2026-06-23 05:55",
        "to":  "2026-06-23 09:55",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86",
                     "Tàu lai ngoài"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22683",
        "title":  "Lai dắt TAN CANG 375",
        "from":  "2026-06-22 13:35",
        "to":  "2026-06-22 15:50",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL VOYAGER",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22682",
        "title":  "Lai dắt THANH BINH 05",
        "from":  "2026-06-22 15:30",
        "to":  "2026-06-22 16:15",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22678",
        "title":  "Lai dắt KANWAY FORTUNE",
        "from":  "2026-06-23 01:00",
        "to":  "2026-06-23 01:50",
        "tugs":  [
                     "TAN CANG 86",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22677",
        "title":  "Lai dắt KANWAY FORTUNE",
        "from":  "2026-06-22 14:10",
        "to":  "2026-06-22 15:00",
        "tugs":  [
                     "TAN CANG 86",
                     "VNL EXPLORER"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22676",
        "title":  "Lai dắt VIET THUAN 10-03",
        "from":  "2026-06-22 07:15",
        "to":  "2026-06-22 08:00",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22675",
        "title":  "Lai dắt DA KANG",
        "from":  "2026-06-22 00:20",
        "to":  "2026-06-22 01:30",
        "tugs":  [
                     "VNL 05",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22672",
        "title":  "Lai dắt BAO LONG 05",
        "from":  "2026-06-21 16:20",
        "to":  "2026-06-21 17:00",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22671",
        "title":  "Lai dắt FC06",
        "from":  "2026-06-21 13:00",
        "to":  "2026-06-21 15:50",
        "tugs":  [
                     "VNL 03",
                     "VNL RUBY"
                 ],
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22670",
        "title":  "Lai dắt THAI SON 16",
        "from":  "2026-06-20 17:40",
        "to":  "2026-06-20 18:20",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22669",
        "title":  "Lai dắt EPIC 09",
        "from":  "2026-06-21 01:15",
        "to":  "2026-06-21 02:00",
        "tugs":  [
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH VẬN TẢI LOGISTICS TRUNG KIÊN",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22668",
        "title":  "Lai dắt SAN DIEGO",
        "from":  "2026-06-22 09:30",
        "to":  "2026-06-22 10:45",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22667",
        "title":  "Lai dắt SAN DIEGO",
        "from":  "2026-06-21 18:20",
        "to":  "2026-06-21 19:35",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22665",
        "title":  "Lai dắt BRILLIANT KNIGHT",
        "from":  "2026-06-21 17:40",
        "to":  "2026-06-21 18:55",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22664",
        "title":  "Lai dắt SINCERITY DIVA",
        "from":  "2026-06-21 14:45",
        "to":  "2026-06-21 16:10",
        "tugs":  [
                     "VNL EXPLORER",
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22663",
        "title":  "Lai dắt JTN 253",
        "from":  "2026-06-21 12:20",
        "to":  "2026-06-21 14:20",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22659",
        "title":  "Lai dắt GLORY BLUE",
        "from":  "2026-06-20 06:55",
        "to":  "2026-06-20 07:40",
        "tugs":  [
                     "VNL FUTURE",
                     "VNL RUBY"
                 ],
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI LONG HẢI",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22658",
        "title":  "Lai dắt VNL08",
        "from":  "2026-06-20 05:40",
        "to":  "2026-06-20 07:15",
        "tugs":  [
                     "VNL 03",
                     "VNL 07"
                 ],
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22657",
        "title":  "Lai dắt BIG DECK 1",
        "from":  "2026-06-19 14:50",
        "to":  "2026-06-19 15:45",
        "tugs":  [
                     "VNL 03",
                     "VNL EXPLORER"
                 ],
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22656",
        "title":  "Lai dắt DUY BINH 25",
        "from":  "2026-06-19 12:55",
        "to":  "2026-06-19 13:35",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22650",
        "title":  "Lai dắt MICLYN 2510",
        "from":  "2026-06-19 17:30",
        "to":  "2026-06-19 18:20",
        "tugs":  [
                     "VNL 05"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22649",
        "title":  "Lai dắt ZIM MOUNT DENALI",
        "from":  "2026-06-20 15:30",
        "to":  "2026-06-20 14:45",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22648",
        "title":  "Lai dắt ZIM MOUNT DENALI",
        "from":  "2026-06-19 06:30",
        "to":  "2026-06-19 08:00",
        "tugs":  [
                     "VNL FUTURE",
                     "TAN CANG 86",
                     "VNL RUBY"
                 ],
        "customer":  "ZIM VIETNAM LLC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22646",
        "title":  "Lai dắt TAN CANG 375",
        "from":  "2026-06-19 02:30",
        "to":  "2026-06-19 06:15",
        "tugs":  [
                     "VNL VOYAGER"
                 ],
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-22643",
        "title":  "Lai dắt TONG XIANG",
        "from":  "2026-06-19 16:15",
        "to":  "2026-06-19 17:00",
        "tugs":  [
                     "VNL 05",
                     "VNL 07"
                 ],
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-20173",
        "title":  "Lai dắt HĐ: 093-26/BDV/TOS-VNL",
        "from":  "2026-04-28 18:00",
        "to":  "2026-07-13 02:00",
        "tugs":  [
                     "VNL RELIANCE"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    },
    {
        "id":  "DV-19953",
        "title":  "Lai dắt HĐ: 093-26/BDV/TOS-VNL",
        "from":  "2026-04-10 12:00",
        "to":  "2026-06-30 12:00",
        "tugs":  [
                     "VNL VISION"
                 ],
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "completed",
        "revenue":  "0 ₫"
    }
];

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
    {
        "id":  "TT-28085-1",
        "tugId":  "VNL 07",
        "from":  "2026-08-03 11:00",
        "to":  "2026-08-03 11:30",
        "type":  "tow_in",
        "vessel":  "DUC TRI 289",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28085"
    },
    {
        "id":  "TT-28084-1",
        "tugId":  "VNL 05",
        "from":  "2026-08-03 09:00",
        "to":  "2026-08-03 10:00",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-331"
    },
    {
        "id":  "TT-28084-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-08-03 09:00",
        "to":  "2026-08-03 10:00",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-331"
    },
    {
        "id":  "TT-28083-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-08-01 05:45",
        "to":  "2026-08-01 12:40",
        "type":  "tow_in",
        "vessel":  "SEAWAY HAWK",
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28083"
    },
    {
        "id":  "TT-28083-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-08-01 05:45",
        "to":  "2026-08-01 12:40",
        "type":  "tow_in",
        "vessel":  "SEAWAY HAWK",
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28083"
    },
    {
        "id":  "TT-28083-3",
        "tugId":  "VNL 05",
        "from":  "2026-08-01 05:45",
        "to":  "2026-08-01 12:40",
        "type":  "tow_in",
        "vessel":  "SEAWAY HAWK",
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28083"
    },
    {
        "id":  "TT-28083-4",
        "tugId":  "VNL RUBY",
        "from":  "2026-08-01 05:45",
        "to":  "2026-08-01 12:40",
        "type":  "tow_in",
        "vessel":  "SEAWAY HAWK",
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28083"
    },
    {
        "id":  "TT-28083-5",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-08-01 05:45",
        "to":  "2026-08-01 12:40",
        "type":  "tow_in",
        "vessel":  "SEAWAY HAWK",
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28083"
    },
    {
        "id":  "TT-28082-1",
        "tugId":  "VNL 07",
        "from":  "2026-08-03 06:00",
        "to":  "2026-08-03 06:30",
        "type":  "tow_in",
        "vessel":  "MINH QUANG 01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-154"
    },
    {
        "id":  "TT-28082-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-08-03 06:00",
        "to":  "2026-08-03 06:30",
        "type":  "tow_in",
        "vessel":  "MINH QUANG 01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-154"
    },
    {
        "id":  "TT-28081-1",
        "tugId":  "VNL 05",
        "from":  "2026-08-03 06:00",
        "to":  "2026-08-03 06:30",
        "type":  "tow_in",
        "vessel":  "LL RACHEL LUI \u0026 LL 3223",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28081"
    },
    {
        "id":  "TT-28080-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-08-03 17:00",
        "to":  "2026-08-03 18:00",
        "type":  "tow_in",
        "vessel":  "JASPER",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "planned",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28080"
    },
    {
        "id":  "TT-28080-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-08-03 17:00",
        "to":  "2026-08-03 18:00",
        "type":  "tow_in",
        "vessel":  "JASPER",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "planned",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28080"
    },
    {
        "id":  "TT-28079-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-08-03 06:30",
        "to":  "2026-08-03 07:30",
        "type":  "tow_in",
        "vessel":  "JASPER",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28079"
    },
    {
        "id":  "TT-28079-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-08-03 06:30",
        "to":  "2026-08-03 07:30",
        "type":  "tow_in",
        "vessel":  "JASPER",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28079"
    },
    {
        "id":  "TT-28078-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-08-03 06:00",
        "to":  "2026-08-03 07:00",
        "type":  "tow_in",
        "vessel":  "COSCO SHIPPING CHANG SHENG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28078"
    },
    {
        "id":  "TT-28078-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-08-03 06:00",
        "to":  "2026-08-03 07:00",
        "type":  "tow_in",
        "vessel":  "COSCO SHIPPING CHANG SHENG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28078"
    },
    {
        "id":  "TT-28077-1",
        "tugId":  "VNL 05",
        "from":  "2026-08-02 22:00",
        "to":  "2026-08-02 22:45",
        "type":  "tow_in",
        "vessel":  "SEA NOBLE",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28077"
    },
    {
        "id":  "TT-28076-1",
        "tugId":  "VNL 07",
        "from":  "2026-08-02 22:00",
        "to":  "2026-08-02 22:45",
        "type":  "tow_in",
        "vessel":  "VIET TRUNG 135",
        "customer":  "CÔNG TY TNHH MAI NGÂN TRÍ",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28076"
    },
    {
        "id":  "TT-28075-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-08-02 17:35",
        "to":  "2026-08-02 18:40",
        "type":  "tow_in",
        "vessel":  "GRAND WINNER 9",
        "customer":  "CÔNG TY TNHH MTV VẬN TẢI XĂNG DẦU DẦU KHÍ VIỆT NAM (PVOIL TRANS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28075"
    },
    {
        "id":  "TT-28075-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-08-02 17:35",
        "to":  "2026-08-02 18:40",
        "type":  "tow_in",
        "vessel":  "GRAND WINNER 9",
        "customer":  "CÔNG TY TNHH MTV VẬN TẢI XĂNG DẦU DẦU KHÍ VIỆT NAM (PVOIL TRANS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28075"
    },
    {
        "id":  "TT-28074-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-08-02 14:00",
        "to":  "2026-08-02 16:30",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28074"
    },
    {
        "id":  "TT-28074-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-08-02 14:00",
        "to":  "2026-08-02 16:30",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28074"
    },
    {
        "id":  "TT-28073-1",
        "tugId":  "VNL 05",
        "from":  "2026-08-02 10:45",
        "to":  "2026-08-02 11:25",
        "type":  "tow_in",
        "vessel":  "MINH QUANG 01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-154"
    },
    {
        "id":  "TT-28073-2",
        "tugId":  "VNL 07",
        "from":  "2026-08-02 10:45",
        "to":  "2026-08-02 11:25",
        "type":  "tow_in",
        "vessel":  "MINH QUANG 01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-154"
    },
    {
        "id":  "TT-28072-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-08-02 10:00",
        "to":  "2026-08-02 12:05",
        "type":  "tow_in",
        "vessel":  "H-401",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28072"
    },
    {
        "id":  "TT-28072-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-08-02 10:00",
        "to":  "2026-08-02 12:05",
        "type":  "tow_in",
        "vessel":  "H-401",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28072"
    },
    {
        "id":  "TT-28072-3",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-08-02 10:00",
        "to":  "2026-08-02 12:05",
        "type":  "tow_in",
        "vessel":  "H-401",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28072"
    },
    {
        "id":  "TT-28071-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-08-02 15:30",
        "to":  "2026-08-02 16:30",
        "type":  "tow_in",
        "vessel":  "ORIENT U/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28071-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-08-02 15:30",
        "to":  "2026-08-02 16:30",
        "type":  "tow_in",
        "vessel":  "ORIENT U/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28070-1",
        "tugId":  "VNL 05",
        "from":  "2026-08-02 11:45",
        "to":  "2026-08-02 13:00",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28070-2",
        "tugId":  "VNL 07",
        "from":  "2026-08-02 11:45",
        "to":  "2026-08-02 13:00",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28069-1",
        "tugId":  "VNL 05",
        "from":  "2026-08-02 05:05",
        "to":  "2026-08-02 05:45",
        "type":  "tow_in",
        "vessel":  "SEA NOBLE",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28069"
    },
    {
        "id":  "TT-28068-1",
        "tugId":  "VNL 05",
        "from":  "2026-08-02 04:10",
        "to":  "2026-08-02 04:55",
        "type":  "tow_in",
        "vessel":  "XINGHE EXPRESS",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28068"
    },
    {
        "id":  "TT-28067-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-08-02 00:00",
        "to":  "2026-08-02 10:15",
        "type":  "tow_in",
        "vessel":  "SEAWAY SWAN",
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28067"
    },
    {
        "id":  "TT-28067-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-08-02 00:00",
        "to":  "2026-08-02 10:15",
        "type":  "tow_in",
        "vessel":  "SEAWAY SWAN",
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28067"
    },
    {
        "id":  "TT-28067-3",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-08-02 00:00",
        "to":  "2026-08-02 10:15",
        "type":  "tow_in",
        "vessel":  "SEAWAY SWAN",
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28067"
    },
    {
        "id":  "TT-28067-4",
        "tugId":  "VNL RUBY",
        "from":  "2026-08-02 00:00",
        "to":  "2026-08-02 10:15",
        "type":  "tow_in",
        "vessel":  "SEAWAY SWAN",
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28067"
    },
    {
        "id":  "TT-28066-1",
        "tugId":  "VNL 07",
        "from":  "2026-08-01 23:15",
        "to":  "2026-08-01 23:59",
        "type":  "tow_in",
        "vessel":  "VIET TRUNG 135",
        "customer":  "CÔNG TY TNHH MAI NGÂN TRÍ",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28066"
    },
    {
        "id":  "TT-28065-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-08-01 12:30",
        "to":  "2026-08-01 14:35",
        "type":  "tow_in",
        "vessel":  "PAULA",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28065"
    },
    {
        "id":  "TT-28065-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-08-01 12:30",
        "to":  "2026-08-01 14:35",
        "type":  "tow_in",
        "vessel":  "PAULA",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28065"
    },
    {
        "id":  "TT-28065-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-08-01 12:30",
        "to":  "2026-08-01 14:35",
        "type":  "tow_in",
        "vessel":  "PAULA",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28065"
    },
    {
        "id":  "TT-28064-1",
        "tugId":  "VNL 07",
        "from":  "2026-08-01 10:00",
        "to":  "2026-08-01 10:40",
        "type":  "tow_in",
        "vessel":  "THANH DAT 86",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28064"
    },
    {
        "id":  "TT-28063-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-08-01 10:30",
        "to":  "2026-08-01 12:05",
        "type":  "tow_in",
        "vessel":  "LOUIS",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28063"
    },
    {
        "id":  "TT-28063-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-08-01 10:30",
        "to":  "2026-08-01 12:05",
        "type":  "tow_in",
        "vessel":  "LOUIS",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28063"
    },
    {
        "id":  "TT-28063-3",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-08-01 10:30",
        "to":  "2026-08-01 12:05",
        "type":  "tow_in",
        "vessel":  "LOUIS",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28063"
    },
    {
        "id":  "TT-28062-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-08-01 07:00",
        "to":  "2026-08-01 13:25",
        "type":  "tow_in",
        "vessel":  "TENMA",
        "customer":  "CTY CP SME WORLDWIDE LOGISTICS",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28062"
    },
    {
        "id":  "TT-28062-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-08-01 07:00",
        "to":  "2026-08-01 13:25",
        "type":  "tow_in",
        "vessel":  "TENMA",
        "customer":  "CTY CP SME WORLDWIDE LOGISTICS",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28062"
    },
    {
        "id":  "TT-28061-1",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-08-01 11:00",
        "to":  "2026-08-01 11:45",
        "type":  "tow_in",
        "vessel":  "LL RACHEL LUI \u0026 LL 3223",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28061"
    },
    {
        "id":  "TT-28060-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-08-02 05:00",
        "to":  "2026-08-02 05:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28060-2",
        "tugId":  "VNL 07",
        "from":  "2026-08-02 05:00",
        "to":  "2026-08-02 05:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28060-3",
        "tugId":  "VNL FUTURE",
        "from":  "2026-08-02 05:00",
        "to":  "2026-08-02 05:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28060-4",
        "tugId":  "VNL 07",
        "from":  "2026-08-02 05:00",
        "to":  "2026-08-02 05:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28059-1",
        "tugId":  "VNL 07",
        "from":  "2026-08-01 04:40",
        "to":  "2026-08-01 05:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28059-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-08-01 04:40",
        "to":  "2026-08-01 05:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28058-1",
        "tugId":  "VNL 05",
        "from":  "2026-08-01 03:45",
        "to":  "2026-08-01 04:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28058-2",
        "tugId":  "VNL 07",
        "from":  "2026-08-01 03:45",
        "to":  "2026-08-01 04:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28057-1",
        "tugId":  "Tàu lai ngoài 02",
        "from":  "2026-08-01 05:00",
        "to":  "2026-08-01 06:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-06/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28057-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-08-01 05:00",
        "to":  "2026-08-01 06:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-06/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28056-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-31 20:45",
        "to":  "2026-07-31 21:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28056-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-31 20:45",
        "to":  "2026-07-31 21:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28055-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-31 14:25",
        "to":  "2026-07-31 15:10",
        "type":  "tow_in",
        "vessel":  "ULTRA KUROSHI",
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28055"
    },
    {
        "id":  "TT-28054-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-31 10:00",
        "to":  "2026-07-31 11:10",
        "type":  "tow_in",
        "vessel":  "VIETSOVPETRO 05",
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28054"
    },
    {
        "id":  "TT-28054-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-31 10:00",
        "to":  "2026-07-31 11:10",
        "type":  "tow_in",
        "vessel":  "VIETSOVPETRO 05",
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28054"
    },
    {
        "id":  "TT-28053-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-31 13:00",
        "to":  "2026-07-31 16:00",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28053"
    },
    {
        "id":  "TT-28053-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-31 13:00",
        "to":  "2026-07-31 16:00",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28053"
    },
    {
        "id":  "TT-28052-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-31 06:45",
        "to":  "2026-07-31 09:00",
        "type":  "tow_in",
        "vessel":  "TRUNG NAM S 05",
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28052"
    },
    {
        "id":  "TT-28052-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-31 06:45",
        "to":  "2026-07-31 09:00",
        "type":  "tow_in",
        "vessel":  "TRUNG NAM S 05",
        "customer":  "LIÊN DOANH VIỆT - NGA VIETSOVPETRO (VSP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28052"
    },
    {
        "id":  "TT-28051-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-31 14:00",
        "to":  "2026-07-31 14:45",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28051"
    },
    {
        "id":  "TT-28051-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-31 14:00",
        "to":  "2026-07-31 14:45",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28051"
    },
    {
        "id":  "TT-28050-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-30 16:00",
        "to":  "2026-07-30 18:00",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28050"
    },
    {
        "id":  "TT-28050-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-30 16:00",
        "to":  "2026-07-30 18:00",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28050"
    },
    {
        "id":  "TT-28050-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-30 16:00",
        "to":  "2026-07-30 18:00",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28050"
    },
    {
        "id":  "TT-28049-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-31 20:50",
        "to":  "2026-07-31 21:55",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT ELBRUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28049"
    },
    {
        "id":  "TT-28049-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-31 20:50",
        "to":  "2026-07-31 21:55",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT ELBRUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28049"
    },
    {
        "id":  "TT-28049-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-31 20:50",
        "to":  "2026-07-31 21:55",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT ELBRUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28049"
    },
    {
        "id":  "TT-28048-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-30 19:45",
        "to":  "2026-07-30 21:15",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT ELBRUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28048"
    },
    {
        "id":  "TT-28048-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-30 19:45",
        "to":  "2026-07-30 21:15",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT ELBRUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28048"
    },
    {
        "id":  "TT-28048-3",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-30 19:45",
        "to":  "2026-07-30 21:15",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT ELBRUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28048"
    },
    {
        "id":  "TT-28047-1",
        "tugId":  "Tàu lai ngoài 02",
        "from":  "2026-08-01 15:30",
        "to":  "2026-08-01 17:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-07/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-154"
    },
    {
        "id":  "TT-28047-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-08-01 15:30",
        "to":  "2026-08-01 17:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-07/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-154"
    },
    {
        "id":  "TT-28046-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-30 13:00",
        "to":  "2026-07-30 14:30",
        "type":  "tow_in",
        "vessel":  "PISTI",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN VŨNG TÀU (VTOSA)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28046"
    },
    {
        "id":  "TT-28046-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-30 13:00",
        "to":  "2026-07-30 14:30",
        "type":  "tow_in",
        "vessel":  "PISTI",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN VŨNG TÀU (VTOSA)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28046"
    },
    {
        "id":  "TT-28045-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-30 14:50",
        "to":  "2026-07-30 15:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28045-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-30 14:50",
        "to":  "2026-07-30 15:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28044-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-30 13:55",
        "to":  "2026-07-30 14:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28044-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-30 13:55",
        "to":  "2026-07-30 14:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28043-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-30 10:00",
        "to":  "2026-07-30 10:50",
        "type":  "tow_in",
        "vessel":  "SAMUDRA MAJU 1 \u0026 SAMUDRA MAJU 2",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-307"
    },
    {
        "id":  "TT-28043-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-30 10:00",
        "to":  "2026-07-30 10:50",
        "type":  "tow_in",
        "vessel":  "SAMUDRA MAJU 1 \u0026 SAMUDRA MAJU 2",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-307"
    },
    {
        "id":  "TT-28042-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-30 13:20",
        "to":  "2026-07-30 14:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28042-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-30 13:20",
        "to":  "2026-07-30 14:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28041-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-30 11:35",
        "to":  "2026-07-30 12:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28041-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-30 11:35",
        "to":  "2026-07-30 12:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28040-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-31 03:45",
        "to":  "2026-07-31 04:35",
        "type":  "tow_in",
        "vessel":  "XINGHE EXPRESS",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28040"
    },
    {
        "id":  "TT-28039-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-29 10:45",
        "to":  "2026-07-29 11:35",
        "type":  "tow_in",
        "vessel":  "DAIWAN LEADER",
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28039"
    },
    {
        "id":  "TT-28039-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-29 10:45",
        "to":  "2026-07-29 11:35",
        "type":  "tow_in",
        "vessel":  "DAIWAN LEADER",
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28039"
    },
    {
        "id":  "TT-28038-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-29 09:15",
        "to":  "2026-07-29 10:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28038-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-29 09:15",
        "to":  "2026-07-29 10:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28037-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-29 08:30",
        "to":  "2026-07-29 09:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-06",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28037-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-29 08:30",
        "to":  "2026-07-29 09:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-06",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-28036-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-29 20:10",
        "to":  "2026-07-29 21:00",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28036"
    },
    {
        "id":  "TT-28036-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-29 20:10",
        "to":  "2026-07-29 21:00",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28036"
    },
    {
        "id":  "TT-28035-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-29 07:40",
        "to":  "2026-07-29 08:25",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28035"
    },
    {
        "id":  "TT-28035-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-29 07:40",
        "to":  "2026-07-29 08:25",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28035"
    },
    {
        "id":  "TT-28034-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-29 20:00",
        "to":  "2026-07-29 21:00",
        "type":  "tow_in",
        "vessel":  "GANGES",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28034"
    },
    {
        "id":  "TT-28034-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-29 20:00",
        "to":  "2026-07-29 21:00",
        "type":  "tow_in",
        "vessel":  "GANGES",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28034"
    },
    {
        "id":  "TT-28033-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-29 03:30",
        "to":  "2026-07-29 04:35",
        "type":  "tow_in",
        "vessel":  "GANGES",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28033"
    },
    {
        "id":  "TT-28033-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-29 03:30",
        "to":  "2026-07-29 04:35",
        "type":  "tow_in",
        "vessel":  "GANGES",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28033"
    },
    {
        "id":  "TT-28032-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-08-14 01:00",
        "to":  "2026-08-14 12:00",
        "type":  "tow_in",
        "vessel":  "CERVIA/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "planned",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-335"
    },
    {
        "id":  "TT-28032-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-08-14 01:00",
        "to":  "2026-08-14 12:00",
        "type":  "tow_in",
        "vessel":  "CERVIA/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "planned",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-335"
    },
    {
        "id":  "TT-28031-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-08-03 01:00",
        "to":  "2026-08-03 12:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-05/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-331"
    },
    {
        "id":  "TT-28031-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-08-03 01:00",
        "to":  "2026-08-03 12:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-05/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-331"
    },
    {
        "id":  "TT-28030-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-29 03:30",
        "to":  "2026-07-29 04:20",
        "type":  "tow_in",
        "vessel":  "BULK GUATEMALA",
        "customer":  "VOSA SAIGON",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28030"
    },
    {
        "id":  "TT-28030-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-29 03:30",
        "to":  "2026-07-29 04:20",
        "type":  "tow_in",
        "vessel":  "BULK GUATEMALA",
        "customer":  "VOSA SAIGON",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28030"
    },
    {
        "id":  "TT-28029-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-28 19:40",
        "to":  "2026-07-28 20:40",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-134"
    },
    {
        "id":  "TT-28029-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-28 19:40",
        "to":  "2026-07-28 20:40",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-134"
    },
    {
        "id":  "TT-28028-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-28 20:50",
        "to":  "2026-07-28 21:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28028-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-28 20:50",
        "to":  "2026-07-28 21:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28027-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-28 19:00",
        "to":  "2026-07-28 19:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28027-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-28 19:00",
        "to":  "2026-07-28 19:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-28026-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-28 21:10",
        "to":  "2026-07-28 21:55",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28026"
    },
    {
        "id":  "TT-28026-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-28 21:10",
        "to":  "2026-07-28 21:55",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28026"
    },
    {
        "id":  "TT-28025-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-28 19:20",
        "to":  "2026-07-28 20:00",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28025"
    },
    {
        "id":  "TT-28025-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-28 19:20",
        "to":  "2026-07-28 20:00",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28025"
    },
    {
        "id":  "TT-28024-1",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-28 05:00",
        "to":  "2026-07-28 05:30",
        "type":  "tow_in",
        "vessel":  "HUB 21 \u0026 HIGHLINE 65",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28024"
    },
    {
        "id":  "TT-28023-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-28 11:00",
        "to":  "2026-07-28 11:55",
        "type":  "tow_in",
        "vessel":  "ALRAYAN",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28023"
    },
    {
        "id":  "TT-28023-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-28 11:00",
        "to":  "2026-07-28 11:55",
        "type":  "tow_in",
        "vessel":  "ALRAYAN",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28023"
    },
    {
        "id":  "TT-28022-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-28 06:00",
        "to":  "2026-07-28 06:50",
        "type":  "tow_in",
        "vessel":  "SAMUDRA BINTANG 2 \u0026 SAMUDRA BINTANG 3",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-241"
    },
    {
        "id":  "TT-28022-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-28 06:00",
        "to":  "2026-07-28 06:50",
        "type":  "tow_in",
        "vessel":  "SAMUDRA BINTANG 2 \u0026 SAMUDRA BINTANG 3",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-241"
    },
    {
        "id":  "TT-28021-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-27 14:30",
        "to":  "2026-08-01 05:45",
        "type":  "tow_in",
        "vessel":  "SEAWAY HAWK",
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ GIAO NHẬN GAC VIỆT NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-28021"
    },
    {
        "id":  "TT-27051-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-26 10:05",
        "to":  "2026-07-26 10:55",
        "type":  "tow_in",
        "vessel":  "SAMUDRA MAJU 1 \u0026 SAMUDRA MAJU 2",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-307"
    },
    {
        "id":  "TT-27051-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-26 10:05",
        "to":  "2026-07-26 10:55",
        "type":  "tow_in",
        "vessel":  "SAMUDRA MAJU 1 \u0026 SAMUDRA MAJU 2",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-307"
    },
    {
        "id":  "TT-27050-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-28 13:30",
        "to":  "2026-07-28 14:30",
        "type":  "tow_in",
        "vessel":  "AL AIN",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27050"
    },
    {
        "id":  "TT-27050-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-28 13:30",
        "to":  "2026-07-28 14:30",
        "type":  "tow_in",
        "vessel":  "AL AIN",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27050"
    },
    {
        "id":  "TT-27049-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-27 18:30",
        "to":  "2026-07-28 13:30",
        "type":  "tow_in",
        "vessel":  "AL AIN",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27049"
    },
    {
        "id":  "TT-27048-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-27 16:35",
        "to":  "2026-07-27 18:30",
        "type":  "tow_in",
        "vessel":  "AL AIN",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27048"
    },
    {
        "id":  "TT-27048-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-27 16:35",
        "to":  "2026-07-27 18:30",
        "type":  "tow_in",
        "vessel":  "AL AIN",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27048"
    },
    {
        "id":  "TT-27047-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-27 11:30",
        "to":  "2026-07-27 12:15",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27047"
    },
    {
        "id":  "TT-27047-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-27 11:30",
        "to":  "2026-07-27 12:15",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27047"
    },
    {
        "id":  "TT-27046-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-27 08:00",
        "to":  "2026-07-27 08:45",
        "type":  "tow_in",
        "vessel":  "FORTUNE RICH",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27046"
    },
    {
        "id":  "TT-27045-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-27 10:00",
        "to":  "2026-07-27 10:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-27045-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-27 10:00",
        "to":  "2026-07-27 10:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-27045-3",
        "tugId":  "VNL 05",
        "from":  "2026-07-27 10:00",
        "to":  "2026-07-27 10:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-27045-4",
        "tugId":  "VNL 07",
        "from":  "2026-07-27 10:00",
        "to":  "2026-07-27 10:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-27044-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-27 06:20",
        "to":  "2026-07-27 07:30",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-27044-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-27 06:20",
        "to":  "2026-07-27 07:30",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-27043-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-27 05:20",
        "to":  "2026-07-27 06:00",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-27043-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-27 05:20",
        "to":  "2026-07-27 06:00",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-27042-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-27 04:35",
        "to":  "2026-07-27 05:20",
        "type":  "tow_in",
        "vessel":  "MACALLAN 17 \u0026 GRACIA",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-237"
    },
    {
        "id":  "TT-27042-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-27 04:35",
        "to":  "2026-07-27 05:20",
        "type":  "tow_in",
        "vessel":  "MACALLAN 17 \u0026 GRACIA",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-237"
    },
    {
        "id":  "TT-27041-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-27 07:40",
        "to":  "2026-07-27 08:25",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27041"
    },
    {
        "id":  "TT-27041-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-27 07:40",
        "to":  "2026-07-27 08:25",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27041"
    },
    {
        "id":  "TT-27040-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-26 18:30",
        "to":  "2026-07-26 19:35",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27040"
    },
    {
        "id":  "TT-27040-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-26 18:30",
        "to":  "2026-07-26 19:35",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27040"
    },
    {
        "id":  "TT-27039-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-26 17:35",
        "to":  "2026-07-26 18:30",
        "type":  "tow_in",
        "vessel":  "DAIWAN LEADER",
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27039"
    },
    {
        "id":  "TT-27039-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-26 17:35",
        "to":  "2026-07-26 18:30",
        "type":  "tow_in",
        "vessel":  "DAIWAN LEADER",
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27039"
    },
    {
        "id":  "TT-27038-1",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-26 09:55",
        "to":  "2026-07-26 10:35",
        "type":  "tow_in",
        "vessel":  "TRUNG THANG 558",
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27038"
    },
    {
        "id":  "TT-27037-1",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-26 05:00",
        "to":  "2026-07-26 05:45",
        "type":  "tow_in",
        "vessel":  "HUB 21 \u0026 HIGHLINE 65",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27037"
    },
    {
        "id":  "TT-27036-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-27 07:30",
        "to":  "2026-07-27 08:20",
        "type":  "tow_in",
        "vessel":  "ALLEGRA",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27036"
    },
    {
        "id":  "TT-27036-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-27 07:30",
        "to":  "2026-07-27 08:20",
        "type":  "tow_in",
        "vessel":  "ALLEGRA",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27036"
    },
    {
        "id":  "TT-27035-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-26 03:15",
        "to":  "2026-07-26 04:15",
        "type":  "tow_in",
        "vessel":  "ALLEGRA",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27035"
    },
    {
        "id":  "TT-27035-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-26 03:15",
        "to":  "2026-07-26 04:15",
        "type":  "tow_in",
        "vessel":  "ALLEGRA",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27035"
    },
    {
        "id":  "TT-27034-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-27 04:00",
        "to":  "2026-07-27 04:55",
        "type":  "tow_in",
        "vessel":  "ANTWERP",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27034"
    },
    {
        "id":  "TT-27034-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-27 04:00",
        "to":  "2026-07-27 04:55",
        "type":  "tow_in",
        "vessel":  "ANTWERP",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27034"
    },
    {
        "id":  "TT-27034-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-27 04:00",
        "to":  "2026-07-27 04:55",
        "type":  "tow_in",
        "vessel":  "ANTWERP",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27034"
    },
    {
        "id":  "TT-27033-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-26 02:30",
        "to":  "2026-07-26 03:40",
        "type":  "tow_in",
        "vessel":  "ANTWERP",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27033"
    },
    {
        "id":  "TT-27033-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-26 02:30",
        "to":  "2026-07-26 03:40",
        "type":  "tow_in",
        "vessel":  "ANTWERP",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27033"
    },
    {
        "id":  "TT-27033-3",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-26 02:30",
        "to":  "2026-07-26 03:40",
        "type":  "tow_in",
        "vessel":  "ANTWERP",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27033"
    },
    {
        "id":  "TT-27032-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-25 09:10",
        "to":  "2026-07-25 09:55",
        "type":  "tow_in",
        "vessel":  "BBC MACAU",
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27032"
    },
    {
        "id":  "TT-27032-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-25 09:10",
        "to":  "2026-07-25 09:55",
        "type":  "tow_in",
        "vessel":  "BBC MACAU",
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27032"
    },
    {
        "id":  "TT-27031-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-25 01:00",
        "to":  "2026-08-31 12:00",
        "type":  "tow_in",
        "vessel":  "HĐ: 169-26/BDV/TCO-VNL",
        "customer":  "CÔNG TY CP DỊCH VỤ BIỂN TÂN CẢNG (TCO)",
        "status":  "in_progress",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27031"
    },
    {
        "id":  "TT-27030-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-28 03:45",
        "to":  "2026-07-28 04:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-06",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27030-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-28 03:45",
        "to":  "2026-07-28 04:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-06",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27029-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-28 03:00",
        "to":  "2026-07-28 03:35",
        "type":  "tow_in",
        "vessel":  "EPIC 05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27029-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-28 03:00",
        "to":  "2026-07-28 03:35",
        "type":  "tow_in",
        "vessel":  "EPIC 05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27028-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-27 03:25",
        "to":  "2026-07-27 04:10",
        "type":  "tow_in",
        "vessel":  "EPIC 05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27028-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-27 03:25",
        "to":  "2026-07-27 04:10",
        "type":  "tow_in",
        "vessel":  "EPIC 05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27027-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-26 18:30",
        "to":  "2026-07-26 19:25",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27027-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-26 18:30",
        "to":  "2026-07-26 19:25",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27026-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-26 17:45",
        "to":  "2026-07-26 18:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27026-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-26 17:45",
        "to":  "2026-07-26 18:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27025-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-25 18:15",
        "to":  "2026-07-25 19:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27025-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-25 18:15",
        "to":  "2026-07-25 19:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27024-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-25 17:15",
        "to":  "2026-07-25 18:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27024-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-25 17:15",
        "to":  "2026-07-25 18:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27023-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-24 18:00",
        "to":  "2026-07-24 19:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27023-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-24 18:00",
        "to":  "2026-07-24 19:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27022-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-26 11:05",
        "to":  "2026-07-26 12:10",
        "type":  "tow_in",
        "vessel":  "KING MILO/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-27022-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-26 11:05",
        "to":  "2026-07-26 12:10",
        "type":  "tow_in",
        "vessel":  "KING MILO/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-27021-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-26 10:30",
        "to":  "2026-07-26 11:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-27021-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-26 10:30",
        "to":  "2026-07-26 11:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-27020-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-24 18:15",
        "to":  "2026-07-24 19:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-27020-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-24 18:15",
        "to":  "2026-07-24 19:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-27020-3",
        "tugId":  "VNL 05",
        "from":  "2026-07-24 18:15",
        "to":  "2026-07-24 19:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-27020-4",
        "tugId":  "VNL 07",
        "from":  "2026-07-24 18:15",
        "to":  "2026-07-24 19:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-27019-1",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-24 17:30",
        "to":  "2026-07-24 18:00",
        "type":  "tow_in",
        "vessel":  "MINH PHAT 36",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27019"
    },
    {
        "id":  "TT-27018-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-24 15:35",
        "to":  "2026-07-25 18:30",
        "type":  "tow_in",
        "vessel":  "APL CHARLESTON",
        "customer":  "CÔNG TY CP DỊCH VỤ BIỂN TÂN CẢNG (TCO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27018"
    },
    {
        "id":  "TT-27017-1",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-23 16:30",
        "to":  "2026-07-23 17:00",
        "type":  "tow_in",
        "vessel":  "THINH LONG 89",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27017"
    },
    {
        "id":  "TT-27016-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-25 18:10",
        "to":  "2026-07-25 19:15",
        "type":  "tow_in",
        "vessel":  "SHENZHEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27016"
    },
    {
        "id":  "TT-27016-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-25 18:10",
        "to":  "2026-07-25 19:15",
        "type":  "tow_in",
        "vessel":  "SHENZHEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27016"
    },
    {
        "id":  "TT-27016-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-25 18:10",
        "to":  "2026-07-25 19:15",
        "type":  "tow_in",
        "vessel":  "SHENZHEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27016"
    },
    {
        "id":  "TT-27015-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-24 16:55",
        "to":  "2026-07-24 18:05",
        "type":  "tow_in",
        "vessel":  "SHENZHEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27015"
    },
    {
        "id":  "TT-27015-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-24 16:55",
        "to":  "2026-07-24 18:05",
        "type":  "tow_in",
        "vessel":  "SHENZHEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27015"
    },
    {
        "id":  "TT-27015-3",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-24 16:55",
        "to":  "2026-07-24 18:05",
        "type":  "tow_in",
        "vessel":  "SHENZHEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27015"
    },
    {
        "id":  "TT-27012-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-22 07:00",
        "to":  "2026-07-22 14:55",
        "type":  "tow_in",
        "vessel":  "SON OF GENGHIS",
        "customer":  "CÔNG TY CP DỊCH VỤ BIỂN TÂN CẢNG (TCO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27012"
    },
    {
        "id":  "TT-27011-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-24 09:00",
        "to":  "2026-07-24 09:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27011-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-24 09:00",
        "to":  "2026-07-24 09:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-27010-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-24 09:25",
        "to":  "2026-07-24 10:20",
        "type":  "tow_in",
        "vessel":  "MAUBERT/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-27010-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-24 09:25",
        "to":  "2026-07-24 10:20",
        "type":  "tow_in",
        "vessel":  "MAUBERT/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-27009-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-24 08:50",
        "to":  "2026-07-24 09:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-27009-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-24 08:50",
        "to":  "2026-07-24 09:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-27008-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-23 15:15",
        "to":  "2026-07-23 16:05",
        "type":  "tow_in",
        "vessel":  "MACALLAN 1 \u0026 MOUTON",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-112"
    },
    {
        "id":  "TT-27008-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-23 15:15",
        "to":  "2026-07-23 16:05",
        "type":  "tow_in",
        "vessel":  "MACALLAN 1 \u0026 MOUTON",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-112"
    },
    {
        "id":  "TT-27007-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-23 14:20",
        "to":  "2026-07-23 15:25",
        "type":  "tow_in",
        "vessel":  "STAITHES",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27007"
    },
    {
        "id":  "TT-27007-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-23 14:20",
        "to":  "2026-07-23 15:25",
        "type":  "tow_in",
        "vessel":  "STAITHES",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27007"
    },
    {
        "id":  "TT-27006-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-23 16:30",
        "to":  "2026-07-23 17:15",
        "type":  "tow_in",
        "vessel":  "FORTUNE RICH",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27006"
    },
    {
        "id":  "TT-27005-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-24 16:25",
        "to":  "2026-07-24 17:35",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT KILIMANJARO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27005"
    },
    {
        "id":  "TT-27005-2",
        "tugId":  "VNL VISION",
        "from":  "2026-07-24 16:25",
        "to":  "2026-07-24 17:35",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT KILIMANJARO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27005"
    },
    {
        "id":  "TT-27005-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-24 16:25",
        "to":  "2026-07-24 17:35",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT KILIMANJARO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27005"
    },
    {
        "id":  "TT-27004-1",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-23 14:30",
        "to":  "2026-07-23 15:50",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT KILIMANJARO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27004"
    },
    {
        "id":  "TT-27004-2",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-23 14:30",
        "to":  "2026-07-23 15:50",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT KILIMANJARO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27004"
    },
    {
        "id":  "TT-27004-3",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-23 14:30",
        "to":  "2026-07-23 15:50",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT KILIMANJARO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27004"
    },
    {
        "id":  "TT-27003-1",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-23 07:30",
        "to":  "2026-07-23 09:00",
        "type":  "tow_in",
        "vessel":  "GLORY SKY",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI LONG HẢI",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27003"
    },
    {
        "id":  "TT-27002-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-23 04:15",
        "to":  "2026-07-23 05:05",
        "type":  "tow_in",
        "vessel":  "XUONG NOI CAU 1000 T",
        "customer":  "CÔNG TY TNHH VẬN TẢI VÀ THƯƠNG MẠI MTP",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-27002"
    },
    {
        "id":  "TT-27001-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-23 09:25",
        "to":  "2026-07-23 10:45",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-134"
    },
    {
        "id":  "TT-27001-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-23 09:25",
        "to":  "2026-07-23 10:45",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-134"
    },
    {
        "id":  "TT-27000-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-23 01:50",
        "to":  "2026-07-23 02:50",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-134"
    },
    {
        "id":  "TT-27000-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-23 01:50",
        "to":  "2026-07-23 02:50",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-134"
    },
    {
        "id":  "TT-26999-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-22 23:15",
        "to":  "2026-07-22 23:59",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26999-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-22 23:15",
        "to":  "2026-07-22 23:59",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26998-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-22 22:30",
        "to":  "2026-07-22 23:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-26998-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-22 22:30",
        "to":  "2026-07-22 23:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-26997-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-22 15:00",
        "to":  "2026-07-22 16:30",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-26997-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-22 15:00",
        "to":  "2026-07-22 16:30",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-26996-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-22 15:30",
        "to":  "2026-07-22 16:15",
        "type":  "tow_in",
        "vessel":  "SHI DAI 11/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26996-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-22 15:30",
        "to":  "2026-07-22 16:15",
        "type":  "tow_in",
        "vessel":  "SHI DAI 11/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26994-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-22 15:00",
        "to":  "2026-07-22 16:00",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26994-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-22 15:00",
        "to":  "2026-07-22 16:00",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26994-3",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-22 15:00",
        "to":  "2026-07-22 16:00",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26993-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-22 14:00",
        "to":  "2026-07-22 15:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 189",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26993-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-22 14:00",
        "to":  "2026-07-22 15:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 189",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26992-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-22 14:45",
        "to":  "2026-07-22 15:30",
        "type":  "tow_in",
        "vessel":  "HIGHLINE 59 \u0026 HIGHLINE 58",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-163"
    },
    {
        "id":  "TT-26992-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-22 14:45",
        "to":  "2026-07-22 15:30",
        "type":  "tow_in",
        "vessel":  "HIGHLINE 59 \u0026 HIGHLINE 58",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-163"
    },
    {
        "id":  "TT-26990-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-22 21:50",
        "to":  "2026-07-22 22:55",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26990"
    },
    {
        "id":  "TT-26990-2",
        "tugId":  "VNL VISION",
        "from":  "2026-07-22 21:50",
        "to":  "2026-07-22 22:55",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26990"
    },
    {
        "id":  "TT-26990-3",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-22 21:50",
        "to":  "2026-07-22 22:55",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26990"
    },
    {
        "id":  "TT-26990-4",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-22 21:50",
        "to":  "2026-07-22 22:55",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26990"
    },
    {
        "id":  "TT-26990-5",
        "tugId":  "VNL VISION",
        "from":  "2026-07-22 21:50",
        "to":  "2026-07-22 22:55",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26990"
    },
    {
        "id":  "TT-26990-6",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-22 21:50",
        "to":  "2026-07-22 22:55",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26990"
    },
    {
        "id":  "TT-26989-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-22 08:05",
        "to":  "2026-07-22 09:20",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26989"
    },
    {
        "id":  "TT-26989-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-22 08:05",
        "to":  "2026-07-22 09:20",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26989"
    },
    {
        "id":  "TT-26989-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-22 08:05",
        "to":  "2026-07-22 09:20",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26989"
    },
    {
        "id":  "TT-26988-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-23 07:50",
        "to":  "2026-07-23 08:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-05/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26988"
    },
    {
        "id":  "TT-26988-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-23 07:50",
        "to":  "2026-07-23 08:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-05/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26988"
    },
    {
        "id":  "TT-26987-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-23 02:30",
        "to":  "2026-07-23 03:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26987"
    },
    {
        "id":  "TT-26987-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-23 02:30",
        "to":  "2026-07-23 03:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26987"
    },
    {
        "id":  "TT-26986-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-22 07:15",
        "to":  "2026-07-22 08:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26986"
    },
    {
        "id":  "TT-26986-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-22 07:15",
        "to":  "2026-07-22 08:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26986"
    },
    {
        "id":  "TT-26985-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-22 01:00",
        "to":  "2026-07-22 01:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26985"
    },
    {
        "id":  "TT-26985-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-22 01:00",
        "to":  "2026-07-22 01:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26985"
    },
    {
        "id":  "TT-26984-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-21 19:35",
        "to":  "2026-07-21 20:40",
        "type":  "tow_in",
        "vessel":  "STAITHES",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26984"
    },
    {
        "id":  "TT-26984-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-21 19:35",
        "to":  "2026-07-21 20:40",
        "type":  "tow_in",
        "vessel":  "STAITHES",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26984"
    },
    {
        "id":  "TT-26983-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-21 20:00",
        "to":  "2026-07-21 21:10",
        "type":  "tow_in",
        "vessel":  "BULK GUATEMALA",
        "customer":  "VOSA SAIGON",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26983"
    },
    {
        "id":  "TT-26983-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-21 20:00",
        "to":  "2026-07-21 21:10",
        "type":  "tow_in",
        "vessel":  "BULK GUATEMALA",
        "customer":  "VOSA SAIGON",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26983"
    },
    {
        "id":  "TT-26982-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-21 14:35",
        "to":  "2026-07-21 15:15",
        "type":  "tow_in",
        "vessel":  "TRINH XUAN 03",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26982"
    },
    {
        "id":  "TT-26981-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-21 14:40",
        "to":  "2026-07-21 15:30",
        "type":  "tow_in",
        "vessel":  "ALRAYAN",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26981"
    },
    {
        "id":  "TT-26981-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-21 14:40",
        "to":  "2026-07-21 15:30",
        "type":  "tow_in",
        "vessel":  "ALRAYAN",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26981"
    },
    {
        "id":  "TT-26980-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-22 06:50",
        "to":  "2026-07-22 07:50",
        "type":  "tow_in",
        "vessel":  "ZIM SPINEL",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26980"
    },
    {
        "id":  "TT-26980-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-22 06:50",
        "to":  "2026-07-22 07:50",
        "type":  "tow_in",
        "vessel":  "ZIM SPINEL",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26980"
    },
    {
        "id":  "TT-26979-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-21 12:50",
        "to":  "2026-07-21 13:50",
        "type":  "tow_in",
        "vessel":  "ZIM SPINEL",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26979"
    },
    {
        "id":  "TT-26979-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-21 12:50",
        "to":  "2026-07-21 13:50",
        "type":  "tow_in",
        "vessel":  "ZIM SPINEL",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26979"
    },
    {
        "id":  "TT-26978-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-23 06:50",
        "to":  "2026-07-23 08:00",
        "type":  "tow_in",
        "vessel":  "SAMUDRA BINTANG 2 \u0026 SAMUDRA BINTANG 3",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-241"
    },
    {
        "id":  "TT-26978-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-23 06:50",
        "to":  "2026-07-23 08:00",
        "type":  "tow_in",
        "vessel":  "SAMUDRA BINTANG 2 \u0026 SAMUDRA BINTANG 3",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-241"
    },
    {
        "id":  "TT-26977-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-23 07:40",
        "to":  "2026-07-23 08:25",
        "type":  "tow_in",
        "vessel":  "VTC DRAGON",
        "customer":  "VOSA SAIGON",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26977"
    },
    {
        "id":  "TT-26977-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-23 07:40",
        "to":  "2026-07-23 08:25",
        "type":  "tow_in",
        "vessel":  "VTC DRAGON",
        "customer":  "VOSA SAIGON",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26977"
    },
    {
        "id":  "TT-26976-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-21 13:40",
        "to":  "2026-07-21 14:25",
        "type":  "tow_in",
        "vessel":  "VTC DRAGON",
        "customer":  "VOSA SAIGON",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26976"
    },
    {
        "id":  "TT-26976-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-21 13:40",
        "to":  "2026-07-21 14:25",
        "type":  "tow_in",
        "vessel":  "VTC DRAGON",
        "customer":  "VOSA SAIGON",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26976"
    },
    {
        "id":  "TT-26975-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-22 13:45",
        "to":  "2026-07-22 14:45",
        "type":  "tow_in",
        "vessel":  "TORM STRENGTH",
        "customer":  "CÔNG TY TNHH MTV VẬN TẢI XĂNG DẦU DẦU KHÍ VIỆT NAM (PVOIL TRANS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26975"
    },
    {
        "id":  "TT-26975-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-22 13:45",
        "to":  "2026-07-22 14:45",
        "type":  "tow_in",
        "vessel":  "TORM STRENGTH",
        "customer":  "CÔNG TY TNHH MTV VẬN TẢI XĂNG DẦU DẦU KHÍ VIỆT NAM (PVOIL TRANS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26975"
    },
    {
        "id":  "TT-26974-1",
        "tugId":  "Tàu lai ngoài 02",
        "from":  "2026-07-21 12:00",
        "to":  "2026-07-21 13:00",
        "type":  "tow_in",
        "vessel":  "TORM STRENGTH",
        "customer":  "CÔNG TY TNHH MTV VẬN TẢI XĂNG DẦU DẦU KHÍ VIỆT NAM (PVOIL TRANS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26974"
    },
    {
        "id":  "TT-26974-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-21 12:00",
        "to":  "2026-07-21 13:00",
        "type":  "tow_in",
        "vessel":  "TORM STRENGTH",
        "customer":  "CÔNG TY TNHH MTV VẬN TẢI XĂNG DẦU DẦU KHÍ VIỆT NAM (PVOIL TRANS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26974"
    },
    {
        "id":  "TT-26973-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-21 05:45",
        "to":  "2026-07-21 16:00",
        "type":  "tow_in",
        "vessel":  "PV DRILLING VIII",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26973"
    },
    {
        "id":  "TT-26973-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-21 05:45",
        "to":  "2026-07-21 16:00",
        "type":  "tow_in",
        "vessel":  "PV DRILLING VIII",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26973"
    },
    {
        "id":  "TT-26973-3",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-21 05:45",
        "to":  "2026-07-21 16:00",
        "type":  "tow_in",
        "vessel":  "PV DRILLING VIII",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26973"
    },
    {
        "id":  "TT-26972-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-22 20:35",
        "to":  "2026-07-22 22:10",
        "type":  "tow_in",
        "vessel":  "MACALLAN 17 \u0026 GRACIA",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-237"
    },
    {
        "id":  "TT-26972-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-22 20:35",
        "to":  "2026-07-22 22:10",
        "type":  "tow_in",
        "vessel":  "MACALLAN 17 \u0026 GRACIA",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-237"
    },
    {
        "id":  "TT-26971-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-21 12:50",
        "to":  "2026-07-21 13:30",
        "type":  "tow_in",
        "vessel":  "VIET HOANG 05",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26971"
    },
    {
        "id":  "TT-26970-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-21 19:20",
        "to":  "2026-07-21 20:05",
        "type":  "tow_in",
        "vessel":  "ROYAL 39",
        "customer":  "Công Ty TNHH Thương Mại \u0026 Logistics Thái Bình Dương (PACIFIC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-223"
    },
    {
        "id":  "TT-26969-1",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-21 06:10",
        "to":  "2026-07-21 06:55",
        "type":  "tow_in",
        "vessel":  "ROYAL 39",
        "customer":  "Công Ty TNHH Thương Mại \u0026 Logistics Thái Bình Dương (PACIFIC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-223"
    },
    {
        "id":  "TT-26968-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-21 11:40",
        "to":  "2026-07-21 12:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26968"
    },
    {
        "id":  "TT-26968-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-21 11:40",
        "to":  "2026-07-21 12:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26968"
    },
    {
        "id":  "TT-26968-3",
        "tugId":  "VNL 03",
        "from":  "2026-07-21 11:40",
        "to":  "2026-07-21 12:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26968"
    },
    {
        "id":  "TT-26968-4",
        "tugId":  "VNL 07",
        "from":  "2026-07-21 11:40",
        "to":  "2026-07-21 12:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26968"
    },
    {
        "id":  "TT-26967-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-21 08:00",
        "to":  "2026-07-21 08:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26967"
    },
    {
        "id":  "TT-26967-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-21 08:00",
        "to":  "2026-07-21 08:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26967"
    },
    {
        "id":  "TT-26966-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-21 06:45",
        "to":  "2026-07-21 07:40",
        "type":  "tow_in",
        "vessel":  "EASTERN REPUBLIC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26966"
    },
    {
        "id":  "TT-26966-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-21 06:45",
        "to":  "2026-07-21 07:40",
        "type":  "tow_in",
        "vessel":  "EASTERN REPUBLIC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26966"
    },
    {
        "id":  "TT-26965-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-21 07:00",
        "to":  "2026-07-21 07:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26965-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-21 07:00",
        "to":  "2026-07-21 07:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26964-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-21 05:30",
        "to":  "2026-07-21 06:50",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26964-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-21 05:30",
        "to":  "2026-07-21 06:50",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26963-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-22 06:50",
        "to":  "2026-07-22 07:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26963-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-22 06:50",
        "to":  "2026-07-22 07:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26962-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-22 01:00",
        "to":  "2026-07-22 01:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26962-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-22 01:00",
        "to":  "2026-07-22 01:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26961-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-20 23:15",
        "to":  "2026-07-20 23:59",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26961-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-20 23:15",
        "to":  "2026-07-20 23:59",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26961-3",
        "tugId":  "VNL 03",
        "from":  "2026-07-20 23:15",
        "to":  "2026-07-20 23:59",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26961-4",
        "tugId":  "VNL 07",
        "from":  "2026-07-20 23:15",
        "to":  "2026-07-20 23:59",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26959-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-31 04:40",
        "to":  "2026-07-31 06:45",
        "type":  "tow_in",
        "vessel":  "PATRIA NAWASENA 3/ SC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-190"
    },
    {
        "id":  "TT-26959-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-31 04:40",
        "to":  "2026-07-31 06:45",
        "type":  "tow_in",
        "vessel":  "PATRIA NAWASENA 3/ SC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-190"
    },
    {
        "id":  "TT-26958-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-20 12:40",
        "to":  "2026-07-20 13:45",
        "type":  "tow_in",
        "vessel":  "BUDVA",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26958"
    },
    {
        "id":  "TT-26958-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-20 12:40",
        "to":  "2026-07-20 13:45",
        "type":  "tow_in",
        "vessel":  "BUDVA",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26958"
    },
    {
        "id":  "TT-26957-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-20 12:20",
        "to":  "2026-07-20 13:05",
        "type":  "tow_in",
        "vessel":  "WAN HAI 371",
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26957"
    },
    {
        "id":  "TT-26957-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-20 12:20",
        "to":  "2026-07-20 13:05",
        "type":  "tow_in",
        "vessel":  "WAN HAI 371",
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26957"
    },
    {
        "id":  "TT-26956-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-20 06:25",
        "to":  "2026-07-20 07:30",
        "type":  "tow_in",
        "vessel":  "WAN HAI 371",
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26956"
    },
    {
        "id":  "TT-26956-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-20 06:25",
        "to":  "2026-07-20 07:30",
        "type":  "tow_in",
        "vessel":  "WAN HAI 371",
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26956"
    },
    {
        "id":  "TT-26955-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-19 23:40",
        "to":  "2026-07-20 00:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 26-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26955-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-19 23:40",
        "to":  "2026-07-20 00:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 26-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26954-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-21 00:55",
        "to":  "2026-07-21 01:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 189",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26954-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-21 00:55",
        "to":  "2026-07-21 01:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 189",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26953-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-20 00:00",
        "to":  "2026-07-20 00:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26953-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-20 00:00",
        "to":  "2026-07-20 00:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26952-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-19 17:25",
        "to":  "2026-07-19 18:15",
        "type":  "tow_in",
        "vessel":  "JADE/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26952-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-19 17:25",
        "to":  "2026-07-19 18:15",
        "type":  "tow_in",
        "vessel":  "JADE/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26951-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-19 17:15",
        "to":  "2026-07-19 18:00",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26951-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-19 17:15",
        "to":  "2026-07-19 18:00",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26950-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-19 16:50",
        "to":  "2026-07-19 17:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26950-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-19 16:50",
        "to":  "2026-07-19 17:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26949-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-20 18:55",
        "to":  "2026-07-20 19:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26949"
    },
    {
        "id":  "TT-26949-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-20 18:55",
        "to":  "2026-07-20 19:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26949"
    },
    {
        "id":  "TT-26948-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-20 18:00",
        "to":  "2026-07-20 18:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26948"
    },
    {
        "id":  "TT-26948-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-20 18:00",
        "to":  "2026-07-20 18:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26948"
    },
    {
        "id":  "TT-26947-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-20 06:45",
        "to":  "2026-07-20 07:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26947"
    },
    {
        "id":  "TT-26947-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-20 06:45",
        "to":  "2026-07-20 07:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26947"
    },
    {
        "id":  "TT-26946-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-20 05:50",
        "to":  "2026-07-20 06:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26946"
    },
    {
        "id":  "TT-26946-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-20 05:50",
        "to":  "2026-07-20 06:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26946"
    },
    {
        "id":  "TT-26945-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-19 18:40",
        "to":  "2026-07-19 19:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26945"
    },
    {
        "id":  "TT-26945-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-19 18:40",
        "to":  "2026-07-19 19:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26945"
    },
    {
        "id":  "TT-26944-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-21 00:20",
        "to":  "2026-07-21 01:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26944-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-21 00:20",
        "to":  "2026-07-21 01:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26943-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-18 23:20",
        "to":  "2026-07-18 23:59",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26943-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-18 23:20",
        "to":  "2026-07-18 23:59",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26942-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-17 16:30",
        "to":  "2026-07-17 17:15",
        "type":  "tow_in",
        "vessel":  "PHUONG NAM 46",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26942"
    },
    {
        "id":  "TT-26941-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-19 12:00",
        "to":  "2026-07-19 12:40",
        "type":  "tow_in",
        "vessel":  "GOLDEN SHINE",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26941"
    },
    {
        "id":  "TT-26941-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-19 12:00",
        "to":  "2026-07-19 12:40",
        "type":  "tow_in",
        "vessel":  "GOLDEN SHINE",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26941"
    },
    {
        "id":  "TT-26940-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-19 11:00",
        "to":  "2026-07-19 12:10",
        "type":  "tow_in",
        "vessel":  "EASTERN REPUBLIC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26940"
    },
    {
        "id":  "TT-26940-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-19 11:00",
        "to":  "2026-07-19 12:10",
        "type":  "tow_in",
        "vessel":  "EASTERN REPUBLIC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26940"
    },
    {
        "id":  "TT-26939-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-18 23:00",
        "to":  "2026-07-18 23:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-06",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26939"
    },
    {
        "id":  "TT-26939-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-18 23:00",
        "to":  "2026-07-18 23:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-06",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26939"
    },
    {
        "id":  "TT-26937-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-18 17:00",
        "to":  "2026-07-18 17:50",
        "type":  "tow_in",
        "vessel":  "VS GLORY",
        "customer":  "CÔNG TY TNHH HÀNG HẢI BẢO TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26937"
    },
    {
        "id":  "TT-26936-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-18 12:00",
        "to":  "2026-07-18 12:50",
        "type":  "tow_in",
        "vessel":  "VIET KHANG 89",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26936"
    },
    {
        "id":  "TT-26935-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-18 16:20",
        "to":  "2026-07-18 17:10",
        "type":  "tow_in",
        "vessel":  "NEPTUNE HP66",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26935"
    },
    {
        "id":  "TT-26935-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-18 16:20",
        "to":  "2026-07-18 17:10",
        "type":  "tow_in",
        "vessel":  "NEPTUNE HP66",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26935"
    },
    {
        "id":  "TT-26934-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-18 11:00",
        "to":  "2026-07-18 11:50",
        "type":  "tow_in",
        "vessel":  "ALRAYAN",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26934"
    },
    {
        "id":  "TT-26934-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-18 11:00",
        "to":  "2026-07-18 11:50",
        "type":  "tow_in",
        "vessel":  "ALRAYAN",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26934"
    },
    {
        "id":  "TT-26933-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-19 22:50",
        "to":  "2026-07-19 23:45",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT OLYMPUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26933"
    },
    {
        "id":  "TT-26933-2",
        "tugId":  "VNL VISION",
        "from":  "2026-07-19 22:50",
        "to":  "2026-07-19 23:45",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT OLYMPUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26933"
    },
    {
        "id":  "TT-26933-3",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-19 22:50",
        "to":  "2026-07-19 23:45",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT OLYMPUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26933"
    },
    {
        "id":  "TT-26932-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-18 11:35",
        "to":  "2026-07-18 13:30",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT OLYMPUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26932"
    },
    {
        "id":  "TT-26932-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-18 11:35",
        "to":  "2026-07-18 13:30",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT OLYMPUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26932"
    },
    {
        "id":  "TT-26932-3",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-18 11:35",
        "to":  "2026-07-18 13:30",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT OLYMPUS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26932"
    },
    {
        "id":  "TT-26931-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-18 06:10",
        "to":  "2026-07-18 07:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26931-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-18 06:10",
        "to":  "2026-07-18 07:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26930-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-18 05:15",
        "to":  "2026-07-18 06:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 168",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26930-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-18 05:15",
        "to":  "2026-07-18 06:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 168",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26929-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-18 05:10",
        "to":  "2026-07-18 05:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26929-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-18 05:10",
        "to":  "2026-07-18 05:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26928-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-17 21:30",
        "to":  "2026-07-17 22:20",
        "type":  "tow_in",
        "vessel":  "GOLDEN SHINE",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26928"
    },
    {
        "id":  "TT-26927-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-17 22:40",
        "to":  "2026-07-17 23:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 26-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26927-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-17 22:40",
        "to":  "2026-07-17 23:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 26-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26926-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-17 23:15",
        "to":  "2026-07-17 23:59",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-06",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26926"
    },
    {
        "id":  "TT-26926-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-17 23:15",
        "to":  "2026-07-17 23:59",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-06",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26926"
    },
    {
        "id":  "TT-26925-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-17 15:50",
        "to":  "2026-07-17 16:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26925"
    },
    {
        "id":  "TT-26925-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-17 15:50",
        "to":  "2026-07-17 16:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26925"
    },
    {
        "id":  "TT-26924-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-17 22:10",
        "to":  "2026-07-17 22:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26924-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-17 22:10",
        "to":  "2026-07-17 22:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26923-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-17 12:25",
        "to":  "2026-07-17 13:00",
        "type":  "tow_in",
        "vessel":  "ITC-02",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26922-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-17 10:30",
        "to":  "2026-07-17 12:05",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26922-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-17 10:30",
        "to":  "2026-07-17 12:05",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26921-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-17 10:10",
        "to":  "2026-07-17 10:55",
        "type":  "tow_in",
        "vessel":  "THANG LOI 168",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26921"
    },
    {
        "id":  "TT-26920-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-17 04:00",
        "to":  "2026-07-17 17:15",
        "type":  "tow_in",
        "vessel":  "VETAG 8",
        "customer":  "CÔNG TY CỔ PHẦN XÂY LẮP CÔNG TRÌNH NĂNG LƯỢNG BIỂN (OEI)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26920"
    },
    {
        "id":  "TT-26919-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-17 05:25",
        "to":  "2026-07-17 06:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26919-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-17 05:25",
        "to":  "2026-07-17 06:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26918-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-17 06:20",
        "to":  "2026-07-17 07:05",
        "type":  "tow_in",
        "vessel":  "DAI PHUC 18",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26918"
    },
    {
        "id":  "TT-26917-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-27 02:50",
        "to":  "2026-07-27 05:10",
        "type":  "tow_in",
        "vessel":  "ORIENT U/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-26917-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-27 02:50",
        "to":  "2026-07-27 05:10",
        "type":  "tow_in",
        "vessel":  "ORIENT U/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-136"
    },
    {
        "id":  "TT-26916-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-17 05:15",
        "to":  "2026-07-17 06:00",
        "type":  "tow_in",
        "vessel":  "DA KANG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26916"
    },
    {
        "id":  "TT-26916-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-17 05:15",
        "to":  "2026-07-17 06:00",
        "type":  "tow_in",
        "vessel":  "DA KANG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26916"
    },
    {
        "id":  "TT-26915-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-16 21:05",
        "to":  "2026-07-16 22:10",
        "type":  "tow_in",
        "vessel":  "NEPTUNE HP66",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26915"
    },
    {
        "id":  "TT-26915-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-16 21:05",
        "to":  "2026-07-16 22:10",
        "type":  "tow_in",
        "vessel":  "NEPTUNE HP66",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26915"
    },
    {
        "id":  "TT-26914-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-16 22:00",
        "to":  "2026-07-16 22:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26914"
    },
    {
        "id":  "TT-26914-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-16 22:00",
        "to":  "2026-07-16 22:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26914"
    },
    {
        "id":  "TT-26913-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-17 00:00",
        "to":  "2026-07-17 00:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 168",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26913-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-17 00:00",
        "to":  "2026-07-17 00:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 168",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26912-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-16 14:50",
        "to":  "2026-07-16 16:00",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26912-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-16 14:50",
        "to":  "2026-07-16 16:00",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26911-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-16 13:50",
        "to":  "2026-07-16 14:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26911-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-16 13:50",
        "to":  "2026-07-16 14:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26910-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-16 11:35",
        "to":  "2026-07-16 12:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26910-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-16 11:35",
        "to":  "2026-07-16 12:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26909-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-16 10:35",
        "to":  "2026-07-16 11:25",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26909-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-16 10:35",
        "to":  "2026-07-16 11:25",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26908-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-16 09:50",
        "to":  "2026-07-16 10:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26908-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-16 09:50",
        "to":  "2026-07-16 10:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26907-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-16 14:00",
        "to":  "2026-07-16 14:50",
        "type":  "tow_in",
        "vessel":  "HIGHLINE 59 \u0026 HIGHLINE 58",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-163"
    },
    {
        "id":  "TT-26907-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-16 14:00",
        "to":  "2026-07-16 14:50",
        "type":  "tow_in",
        "vessel":  "HIGHLINE 59 \u0026 HIGHLINE 58",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-163"
    },
    {
        "id":  "TT-26906-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-16 14:10",
        "to":  "2026-07-16 17:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-05/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26906"
    },
    {
        "id":  "TT-26906-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-16 14:10",
        "to":  "2026-07-16 17:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-05/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26906"
    },
    {
        "id":  "TT-26905-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-15 21:00",
        "to":  "2026-07-15 21:45",
        "type":  "tow_in",
        "vessel":  "LAN HAI FANG ZHOU",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26905"
    },
    {
        "id":  "TT-26904-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-15 20:25",
        "to":  "2026-07-15 21:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26904-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-15 20:25",
        "to":  "2026-07-15 21:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26904-3",
        "tugId":  "VNL 03",
        "from":  "2026-07-15 20:25",
        "to":  "2026-07-15 21:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26904-4",
        "tugId":  "VNL 07",
        "from":  "2026-07-15 20:25",
        "to":  "2026-07-15 21:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26903-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-15 18:40",
        "to":  "2026-07-15 20:10",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26903-2",
        "tugId":  "VNL 03",
        "from":  "2026-07-15 18:40",
        "to":  "2026-07-15 20:10",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-26902-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-15 13:35",
        "to":  "2026-07-15 14:20",
        "type":  "tow_in",
        "vessel":  "VIET HUNG 08",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26902"
    },
    {
        "id":  "TT-26901-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-15 09:35",
        "to":  "2026-07-15 10:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26901-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-15 09:35",
        "to":  "2026-07-15 10:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26900-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-15 08:40",
        "to":  "2026-07-15 09:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26900-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-15 08:40",
        "to":  "2026-07-15 09:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26899-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-15 08:10",
        "to":  "2026-07-15 12:45",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26899"
    },
    {
        "id":  "TT-26899-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-15 08:10",
        "to":  "2026-07-15 12:45",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26899"
    },
    {
        "id":  "TT-26898-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-15 13:00",
        "to":  "2026-07-15 14:20",
        "type":  "tow_in",
        "vessel":  "BO RUN YONG LI",
        "customer":  "S5 Vietnam Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26898"
    },
    {
        "id":  "TT-26898-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-15 13:00",
        "to":  "2026-07-15 14:20",
        "type":  "tow_in",
        "vessel":  "BO RUN YONG LI",
        "customer":  "S5 Vietnam Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26898"
    },
    {
        "id":  "TT-26897-1",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-15 09:00",
        "to":  "2026-07-15 09:30",
        "type":  "tow_in",
        "vessel":  "GOJIRA 1 \u0026 KAIJU CATEGORY 1",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ TIẾP VẬN VÀ THƯƠNG MẠI SÀI GÒN CỬU LONG (SGCL)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26897"
    },
    {
        "id":  "TT-26896-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-15 08:45",
        "to":  "2026-07-15 10:00",
        "type":  "tow_in",
        "vessel":  "AQUAPRIMA",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26896"
    },
    {
        "id":  "TT-26896-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-15 08:45",
        "to":  "2026-07-15 10:00",
        "type":  "tow_in",
        "vessel":  "AQUAPRIMA",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26896"
    },
    {
        "id":  "TT-26895-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-15 20:20",
        "to":  "2026-07-15 21:10",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26895"
    },
    {
        "id":  "TT-26895-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-15 20:20",
        "to":  "2026-07-15 21:10",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26895"
    },
    {
        "id":  "TT-26894-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-15 07:45",
        "to":  "2026-07-15 08:40",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26894"
    },
    {
        "id":  "TT-26894-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-15 07:45",
        "to":  "2026-07-15 08:40",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26894"
    },
    {
        "id":  "TT-26893-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-15 21:50",
        "to":  "2026-07-15 22:45",
        "type":  "tow_in",
        "vessel":  "COLORADO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26893"
    },
    {
        "id":  "TT-26893-2",
        "tugId":  "VNL VISION",
        "from":  "2026-07-15 21:50",
        "to":  "2026-07-15 22:45",
        "type":  "tow_in",
        "vessel":  "COLORADO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26893"
    },
    {
        "id":  "TT-26892-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-15 08:05",
        "to":  "2026-07-15 09:15",
        "type":  "tow_in",
        "vessel":  "COLORADO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26892"
    },
    {
        "id":  "TT-26892-2",
        "tugId":  "VNL VISION",
        "from":  "2026-07-15 08:05",
        "to":  "2026-07-15 09:15",
        "type":  "tow_in",
        "vessel":  "COLORADO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26892"
    },
    {
        "id":  "TT-26891-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-15 05:20",
        "to":  "2026-07-15 07:00",
        "type":  "tow_in",
        "vessel":  "OCEAN DALIAN/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26891-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-15 05:20",
        "to":  "2026-07-15 07:00",
        "type":  "tow_in",
        "vessel":  "OCEAN DALIAN/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26890-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-14 19:45",
        "to":  "2026-07-14 21:15",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26890-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-14 19:45",
        "to":  "2026-07-14 21:15",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26889-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-14 19:00",
        "to":  "2026-07-14 19:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-03",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26889-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-14 19:00",
        "to":  "2026-07-14 19:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-03",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26888-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-16 14:20",
        "to":  "2026-07-16 16:00",
        "type":  "tow_in",
        "vessel":  "MAUBERT/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26888-2",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-16 14:20",
        "to":  "2026-07-16 16:00",
        "type":  "tow_in",
        "vessel":  "MAUBERT/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26888-3",
        "tugId":  "VNL VISION",
        "from":  "2026-07-16 14:20",
        "to":  "2026-07-16 16:00",
        "type":  "tow_in",
        "vessel":  "MAUBERT/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26888-4",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-16 14:20",
        "to":  "2026-07-16 16:00",
        "type":  "tow_in",
        "vessel":  "MAUBERT/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-144"
    },
    {
        "id":  "TT-26887-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-14 13:55",
        "to":  "2026-07-14 14:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26887-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-14 13:55",
        "to":  "2026-07-14 14:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26886-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-14 13:00",
        "to":  "2026-07-14 13:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26886-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-14 13:00",
        "to":  "2026-07-14 13:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26885-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-14 13:00",
        "to":  "2026-07-14 14:15",
        "type":  "tow_in",
        "vessel":  "SDTR GLORIA",
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26885"
    },
    {
        "id":  "TT-26884-1",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-14 13:05",
        "to":  "2026-07-14 14:15",
        "type":  "tow_in",
        "vessel":  "ECHO.GR",
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26884"
    },
    {
        "id":  "TT-26883-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-15 05:30",
        "to":  "2026-07-15 06:30",
        "type":  "tow_in",
        "vessel":  "ALRAYAN",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26883"
    },
    {
        "id":  "TT-26883-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-15 05:30",
        "to":  "2026-07-15 06:30",
        "type":  "tow_in",
        "vessel":  "ALRAYAN",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI MACS",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26883"
    },
    {
        "id":  "TT-26882-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-14 13:10",
        "to":  "2026-07-14 14:00",
        "type":  "tow_in",
        "vessel":  "ZHONG YUAN SHUN",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26882"
    },
    {
        "id":  "TT-26881-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-14 03:30",
        "to":  "2026-07-14 04:40",
        "type":  "tow_in",
        "vessel":  "DA KANG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26881"
    },
    {
        "id":  "TT-26881-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-14 03:30",
        "to":  "2026-07-14 04:40",
        "type":  "tow_in",
        "vessel":  "DA KANG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26881"
    },
    {
        "id":  "TT-26880-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-13 21:00",
        "to":  "2026-07-13 21:40",
        "type":  "tow_in",
        "vessel":  "CABLE RETRIEVER",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26880"
    },
    {
        "id":  "TT-26880-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-13 21:00",
        "to":  "2026-07-13 21:40",
        "type":  "tow_in",
        "vessel":  "CABLE RETRIEVER",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26880"
    },
    {
        "id":  "TT-26879-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-13 18:45",
        "to":  "2026-07-13 19:30",
        "type":  "tow_in",
        "vessel":  "BAO LONG 06",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26879"
    },
    {
        "id":  "TT-26878-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-13 13:50",
        "to":  "2026-07-13 14:25",
        "type":  "tow_in",
        "vessel":  "PHUC HOANG 26",
        "customer":  "CÔNG TY TNHH HÀNG HẢI BẢO TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26878"
    },
    {
        "id":  "TT-26877-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-13 19:45",
        "to":  "2026-07-13 20:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26877-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-13 19:45",
        "to":  "2026-07-13 20:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26876-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-13 14:00",
        "to":  "2026-07-13 15:20",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26876-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-13 14:00",
        "to":  "2026-07-13 15:20",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-26875-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-13 13:10",
        "to":  "2026-07-13 13:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26875-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-13 13:10",
        "to":  "2026-07-13 13:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26874-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-13 11:55",
        "to":  "2026-07-13 13:00",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26874-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-13 11:55",
        "to":  "2026-07-13 13:00",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26873-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-13 11:00",
        "to":  "2026-07-13 11:45",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26873-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-13 11:00",
        "to":  "2026-07-13 11:45",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26872-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-22 20:55",
        "to":  "2026-07-22 23:35",
        "type":  "tow_in",
        "vessel":  "SARGAS/ FC",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN VŨNG TÀU (VTOSA)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-134"
    },
    {
        "id":  "TT-26872-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-22 20:55",
        "to":  "2026-07-22 23:35",
        "type":  "tow_in",
        "vessel":  "SARGAS/ FC",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN VŨNG TÀU (VTOSA)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-134"
    },
    {
        "id":  "TT-26871-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-11 08:30",
        "to":  "2026-07-11 11:30",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26871"
    },
    {
        "id":  "TT-26870-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-13 11:40",
        "to":  "2026-07-13 13:40",
        "type":  "tow_in",
        "vessel":  "VS GLORY",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26870"
    },
    {
        "id":  "TT-26870-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-13 11:40",
        "to":  "2026-07-13 13:40",
        "type":  "tow_in",
        "vessel":  "VS GLORY",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26870"
    },
    {
        "id":  "TT-26869-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-12 18:25",
        "to":  "2026-07-12 19:20",
        "type":  "tow_in",
        "vessel":  "LAN HAI FANG ZHOU",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26869"
    },
    {
        "id":  "TT-26868-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-12 11:30",
        "to":  "2026-07-12 12:20",
        "type":  "tow_in",
        "vessel":  "SRIWANGI V",
        "customer":  "CHI NHÁNH CÔNG TY TNHH THORESEN – VINAMA TẠI BÀ RỊA - VŨNG TÀU",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26868"
    },
    {
        "id":  "TT-26867-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-12 11:25",
        "to":  "2026-07-12 12:10",
        "type":  "tow_in",
        "vessel":  "CHUANG XIN 6",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26867"
    },
    {
        "id":  "TT-26867-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-12 11:25",
        "to":  "2026-07-12 12:10",
        "type":  "tow_in",
        "vessel":  "CHUANG XIN 6",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26867"
    },
    {
        "id":  "TT-26866-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-12 10:45",
        "to":  "2026-07-12 11:55",
        "type":  "tow_in",
        "vessel":  "CABLE RETRIEVER",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26866"
    },
    {
        "id":  "TT-26866-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-12 10:45",
        "to":  "2026-07-12 11:55",
        "type":  "tow_in",
        "vessel":  "CABLE RETRIEVER",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26866"
    },
    {
        "id":  "TT-26866-3",
        "tugId":  "VNL 07",
        "from":  "2026-07-12 10:45",
        "to":  "2026-07-12 11:55",
        "type":  "tow_in",
        "vessel":  "CABLE RETRIEVER",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26866"
    },
    {
        "id":  "TT-26866-4",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-12 10:45",
        "to":  "2026-07-12 11:55",
        "type":  "tow_in",
        "vessel":  "CABLE RETRIEVER",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26866"
    },
    {
        "id":  "TT-26865-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-12 09:30",
        "to":  "2026-07-12 10:15",
        "type":  "tow_in",
        "vessel":  "MINH PHUC 555",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26865"
    },
    {
        "id":  "TT-26864-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-12 10:05",
        "to":  "2026-07-12 10:45",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26864"
    },
    {
        "id":  "TT-26864-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-12 10:05",
        "to":  "2026-07-12 10:45",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26864"
    },
    {
        "id":  "TT-26863-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-11 19:20",
        "to":  "2026-07-11 20:05",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26863"
    },
    {
        "id":  "TT-26863-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-11 19:20",
        "to":  "2026-07-11 20:05",
        "type":  "tow_in",
        "vessel":  "HPS 01",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26863"
    },
    {
        "id":  "TT-26862-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-11 17:10",
        "to":  "2026-07-11 18:00",
        "type":  "tow_in",
        "vessel":  "ZHONG YUAN SHUN",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26862"
    },
    {
        "id":  "TT-26861-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-11 17:30",
        "to":  "2026-07-11 18:30",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26861"
    },
    {
        "id":  "TT-26861-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-11 17:30",
        "to":  "2026-07-11 18:30",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26861"
    },
    {
        "id":  "TT-26860-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-11 09:30",
        "to":  "2026-07-11 10:40",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26860"
    },
    {
        "id":  "TT-26860-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-11 09:30",
        "to":  "2026-07-11 10:40",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26860"
    },
    {
        "id":  "TT-26859-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-11 10:00",
        "to":  "2026-07-11 10:45",
        "type":  "tow_in",
        "vessel":  "HONG PHU 18",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26859"
    },
    {
        "id":  "TT-26858-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-11 06:00",
        "to":  "2026-07-11 10:05",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26858"
    },
    {
        "id":  "TT-26858-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-11 06:00",
        "to":  "2026-07-11 10:05",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26858"
    },
    {
        "id":  "TT-26857-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-14 03:30",
        "to":  "2026-07-14 04:25",
        "type":  "tow_in",
        "vessel":  "MACALLAN 1 \u0026 MOUTON",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-112"
    },
    {
        "id":  "TT-26857-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-14 03:30",
        "to":  "2026-07-14 04:25",
        "type":  "tow_in",
        "vessel":  "MACALLAN 1 \u0026 MOUTON",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-112"
    },
    {
        "id":  "TT-26856-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-13 19:45",
        "to":  "2026-07-13 20:25",
        "type":  "tow_in",
        "vessel":  "CHANG DA 368",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26856"
    },
    {
        "id":  "TT-26855-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-11 04:00",
        "to":  "2026-07-11 05:00",
        "type":  "tow_in",
        "vessel":  "CHANG DA 368",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26855"
    },
    {
        "id":  "TT-26854-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-12 17:10",
        "to":  "2026-07-12 17:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-03",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26854-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-12 17:10",
        "to":  "2026-07-12 17:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-03",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26853-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-12 09:30",
        "to":  "2026-07-12 10:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 168",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26853-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-12 09:30",
        "to":  "2026-07-12 10:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 168",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26852-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-11 03:00",
        "to":  "2026-07-11 04:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 168",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26852-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-11 03:00",
        "to":  "2026-07-11 04:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 168",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-26851-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-10 23:00",
        "to":  "2026-07-11 00:50",
        "type":  "tow_in",
        "vessel":  "ZIM EMERALD",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26851"
    },
    {
        "id":  "TT-26851-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-10 23:00",
        "to":  "2026-07-11 00:50",
        "type":  "tow_in",
        "vessel":  "ZIM EMERALD",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26851"
    },
    {
        "id":  "TT-26850-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-10 10:20",
        "to":  "2026-07-10 11:40",
        "type":  "tow_in",
        "vessel":  "ZIM EMERALD",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26850"
    },
    {
        "id":  "TT-26850-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-10 10:20",
        "to":  "2026-07-10 11:40",
        "type":  "tow_in",
        "vessel":  "ZIM EMERALD",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26850"
    },
    {
        "id":  "TT-26848-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-12 11:10",
        "to":  "2026-07-12 11:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26848-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-12 11:10",
        "to":  "2026-07-12 11:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26847-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-11 17:15",
        "to":  "2026-07-11 18:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26847-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-11 17:15",
        "to":  "2026-07-11 18:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26846-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-11 11:10",
        "to":  "2026-07-11 11:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26846-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-11 11:10",
        "to":  "2026-07-11 11:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26845-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-10 17:00",
        "to":  "2026-07-10 17:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26845-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-10 17:00",
        "to":  "2026-07-10 17:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26844-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-10 14:20",
        "to":  "2026-07-10 15:05",
        "type":  "tow_in",
        "vessel":  "ITC-02",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26844-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-10 14:20",
        "to":  "2026-07-10 15:05",
        "type":  "tow_in",
        "vessel":  "ITC-02",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26843-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-10 13:20",
        "to":  "2026-07-10 14:10",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26843-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-10 13:20",
        "to":  "2026-07-10 14:10",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-26842-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-10 10:10",
        "to":  "2026-07-10 11:00",
        "type":  "tow_in",
        "vessel":  "TU CUONG 68",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26842"
    },
    {
        "id":  "TT-26841-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-10 09:10",
        "to":  "2026-07-10 09:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-06",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26841"
    },
    {
        "id":  "TT-26841-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-10 09:10",
        "to":  "2026-07-10 09:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-06",
        "customer":  "CÔNG TY CỔ PHẦN THƯƠNG MẠI VẬN TẢI XNK THIÊN PHÚC (TP)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26841"
    },
    {
        "id":  "TT-26840-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-10 08:35",
        "to":  "2026-07-10 09:50",
        "type":  "tow_in",
        "vessel":  "BRAVE QUEST",
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26840"
    },
    {
        "id":  "TT-26839-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-13 05:15",
        "to":  "2026-07-13 06:10",
        "type":  "tow_in",
        "vessel":  "ASP HOPE/ SC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-26839-2",
        "tugId":  "VNL 03",
        "from":  "2026-07-13 05:15",
        "to":  "2026-07-13 06:10",
        "type":  "tow_in",
        "vessel":  "ASP HOPE/ SC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-26838-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-13 03:30",
        "to":  "2026-07-13 04:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-26838-2",
        "tugId":  "VNL 03",
        "from":  "2026-07-13 03:30",
        "to":  "2026-07-13 04:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-26837-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-10 08:30",
        "to":  "2026-07-10 09:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-26837-2",
        "tugId":  "VNL 03",
        "from":  "2026-07-10 08:30",
        "to":  "2026-07-10 09:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-26836-1",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-10 09:00",
        "to":  "2026-07-10 09:30",
        "type":  "tow_in",
        "vessel":  "GOJIRA 1 \u0026 KAIJU CATEGORY 1",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ TIẾP VẬN VÀ THƯƠNG MẠI SÀI GÒN CỬU LONG (SGCL)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26836"
    },
    {
        "id":  "TT-26835-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-11 09:00",
        "to":  "2026-07-11 09:45",
        "type":  "tow_in",
        "vessel":  "STRATEGIC HARMONY",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26835"
    },
    {
        "id":  "TT-26835-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-11 09:00",
        "to":  "2026-07-11 09:45",
        "type":  "tow_in",
        "vessel":  "STRATEGIC HARMONY",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26835"
    },
    {
        "id":  "TT-26834-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-10 04:35",
        "to":  "2026-07-10 05:50",
        "type":  "tow_in",
        "vessel":  "STRATEGIC HARMONY",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26834"
    },
    {
        "id":  "TT-26834-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-10 04:35",
        "to":  "2026-07-10 05:50",
        "type":  "tow_in",
        "vessel":  "STRATEGIC HARMONY",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-26834"
    },
    {
        "id":  "TT-25842-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-10 08:30",
        "to":  "2026-07-10 10:00",
        "type":  "tow_in",
        "vessel":  "MELIA/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-25842-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-10 08:30",
        "to":  "2026-07-10 10:00",
        "type":  "tow_in",
        "vessel":  "MELIA/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-25841-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-09 23:00",
        "to":  "2026-07-09 23:59",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-25841-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-09 23:00",
        "to":  "2026-07-09 23:59",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-25840-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-10 00:25",
        "to":  "2026-07-10 01:40",
        "type":  "tow_in",
        "vessel":  "ITC-02",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-25840-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-10 00:25",
        "to":  "2026-07-10 01:40",
        "type":  "tow_in",
        "vessel":  "ITC-02",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-25839-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-09 22:20",
        "to":  "2026-07-09 23:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-25839-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-09 22:20",
        "to":  "2026-07-09 23:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-25838-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-09 23:20",
        "to":  "2026-07-10 00:10",
        "type":  "tow_in",
        "vessel":  "MANDARIN RIVER",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25838"
    },
    {
        "id":  "TT-25838-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-09 23:20",
        "to":  "2026-07-10 00:10",
        "type":  "tow_in",
        "vessel":  "MANDARIN RIVER",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25838"
    },
    {
        "id":  "TT-25837-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-10 23:30",
        "to":  "2026-07-11 00:45",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT VINSON",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25837"
    },
    {
        "id":  "TT-25837-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-10 23:30",
        "to":  "2026-07-11 00:45",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT VINSON",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25837"
    },
    {
        "id":  "TT-25837-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-10 23:30",
        "to":  "2026-07-11 00:45",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT VINSON",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25837"
    },
    {
        "id":  "TT-25836-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-09 22:10",
        "to":  "2026-07-09 23:40",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT VINSON",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25836"
    },
    {
        "id":  "TT-25836-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-09 22:10",
        "to":  "2026-07-09 23:40",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT VINSON",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25836"
    },
    {
        "id":  "TT-25836-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-09 22:10",
        "to":  "2026-07-09 23:40",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT VINSON",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25836"
    },
    {
        "id":  "TT-25836-4",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-09 22:10",
        "to":  "2026-07-09 23:40",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT VINSON",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25836"
    },
    {
        "id":  "TT-25836-5",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-09 22:10",
        "to":  "2026-07-09 23:40",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT VINSON",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25836"
    },
    {
        "id":  "TT-25836-6",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-09 22:10",
        "to":  "2026-07-09 23:40",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT VINSON",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25836"
    },
    {
        "id":  "TT-25835-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-09 16:00",
        "to":  "2026-07-09 16:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-25835-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-09 16:00",
        "to":  "2026-07-09 16:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-25834-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-09 15:50",
        "to":  "2026-07-09 16:55",
        "type":  "tow_in",
        "vessel":  "KRAIT/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-25834-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-09 15:50",
        "to":  "2026-07-09 16:55",
        "type":  "tow_in",
        "vessel":  "KRAIT/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-25833-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-09 15:10",
        "to":  "2026-07-09 15:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 169",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-25833-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-09 15:10",
        "to":  "2026-07-09 15:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 169",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-25832-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-09 14:45",
        "to":  "2026-07-09 15:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 189",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-25832-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-09 14:45",
        "to":  "2026-07-09 15:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 189",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-25831-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-09 08:15",
        "to":  "2026-07-09 14:00",
        "type":  "tow_in",
        "vessel":  "MICLYN 2510",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25831"
    },
    {
        "id":  "TT-25831-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-09 08:15",
        "to":  "2026-07-09 14:00",
        "type":  "tow_in",
        "vessel":  "MICLYN 2510",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25831"
    },
    {
        "id":  "TT-25830-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-09 07:40",
        "to":  "2026-07-09 09:10",
        "type":  "tow_in",
        "vessel":  "AQUAPRIMA",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25830"
    },
    {
        "id":  "TT-25830-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-09 07:40",
        "to":  "2026-07-09 09:10",
        "type":  "tow_in",
        "vessel":  "AQUAPRIMA",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25830"
    },
    {
        "id":  "TT-25829-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-09 02:00",
        "to":  "2026-07-09 02:45",
        "type":  "tow_in",
        "vessel":  "MACALLAN 9 \u0026 ANGELUS",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-25829"
    },
    {
        "id":  "TT-24831-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-08 21:15",
        "to":  "2026-07-08 22:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24831-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-08 21:15",
        "to":  "2026-07-08 22:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24830-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-08 20:20",
        "to":  "2026-07-08 21:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24830-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-08 20:20",
        "to":  "2026-07-08 21:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24829-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-08 14:25",
        "to":  "2026-07-08 15:10",
        "type":  "tow_in",
        "vessel":  "BBC WASHINGTON",
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24829"
    },
    {
        "id":  "TT-24828-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-08 15:20",
        "to":  "2026-07-08 16:15",
        "type":  "tow_in",
        "vessel":  "CHUANG XIN 6",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24828"
    },
    {
        "id":  "TT-24828-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-08 15:20",
        "to":  "2026-07-08 16:15",
        "type":  "tow_in",
        "vessel":  "CHUANG XIN 6",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24828"
    },
    {
        "id":  "TT-24827-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-08 01:40",
        "to":  "2026-07-08 02:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 189",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24827-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-08 01:40",
        "to":  "2026-07-08 02:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 189",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24826-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-07 18:10",
        "to":  "2026-07-07 19:15",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24826-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-07 18:10",
        "to":  "2026-07-07 19:15",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24825-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-07 17:25",
        "to":  "2026-07-07 18:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24825-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-07 17:25",
        "to":  "2026-07-07 18:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24824-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-08 19:30",
        "to":  "2026-07-08 20:40",
        "type":  "tow_in",
        "vessel":  "DANUBE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24824"
    },
    {
        "id":  "TT-24824-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-08 19:30",
        "to":  "2026-07-08 20:40",
        "type":  "tow_in",
        "vessel":  "DANUBE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24824"
    },
    {
        "id":  "TT-24823-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-08 00:00",
        "to":  "2026-07-08 01:10",
        "type":  "tow_in",
        "vessel":  "DANUBE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24823"
    },
    {
        "id":  "TT-24823-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-08 00:00",
        "to":  "2026-07-08 01:10",
        "type":  "tow_in",
        "vessel":  "DANUBE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24823"
    },
    {
        "id":  "TT-24822-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-07 13:30",
        "to":  "2026-07-07 19:30",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24822"
    },
    {
        "id":  "TT-24822-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-07 13:30",
        "to":  "2026-07-07 19:30",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24822"
    },
    {
        "id":  "TT-24821-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-07 14:45",
        "to":  "2026-07-07 15:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-24821-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-07 14:45",
        "to":  "2026-07-07 15:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-24820-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-07 13:00",
        "to":  "2026-07-07 13:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 26-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-24820-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-07 13:00",
        "to":  "2026-07-07 13:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 26-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-24819-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-07 07:40",
        "to":  "2026-07-07 08:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 169",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-24819-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-07 07:40",
        "to":  "2026-07-07 08:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 169",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-24818-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-06 16:55",
        "to":  "2026-07-06 17:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-24818-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-06 16:55",
        "to":  "2026-07-06 17:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-24817-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-06 16:45",
        "to":  "2026-07-06 18:05",
        "type":  "tow_in",
        "vessel":  "MACALLAN 9 \u0026 ANGELUS",
        "customer":  "CÔNG TY TNHH VẬN TẢI BIỂN LONG THANH",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24817"
    },
    {
        "id":  "TT-24816-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-06 12:10",
        "to":  "2026-07-06 13:10",
        "type":  "tow_in",
        "vessel":  "MANDARIN RIVER",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24816"
    },
    {
        "id":  "TT-24816-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-06 12:10",
        "to":  "2026-07-06 13:10",
        "type":  "tow_in",
        "vessel":  "MANDARIN RIVER",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24816"
    },
    {
        "id":  "TT-24815-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-06 10:10",
        "to":  "2026-07-06 14:15",
        "type":  "tow_in",
        "vessel":  "EASTERN REPUBLIC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24815"
    },
    {
        "id":  "TT-24814-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-07 14:20",
        "to":  "2026-07-07 15:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24814-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-07 14:20",
        "to":  "2026-07-07 15:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24813-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-07 13:30",
        "to":  "2026-07-07 14:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24813-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-07 13:30",
        "to":  "2026-07-07 14:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24812-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-06 18:10",
        "to":  "2026-07-06 18:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24812-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-06 18:10",
        "to":  "2026-07-06 18:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24811-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-06 13:40",
        "to":  "2026-07-06 18:00",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24811-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-06 13:40",
        "to":  "2026-07-06 18:00",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24811-3",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-06 13:40",
        "to":  "2026-07-06 18:00",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24810-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-06 16:40",
        "to":  "2026-07-06 17:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24810-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-06 16:40",
        "to":  "2026-07-06 17:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24809-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-05 12:20",
        "to":  "2026-07-05 13:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24809-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-05 12:20",
        "to":  "2026-07-05 13:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24808-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-05 11:30",
        "to":  "2026-07-05 12:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24808-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-05 11:30",
        "to":  "2026-07-05 12:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24807-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-05 12:35",
        "to":  "2026-07-05 13:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24807-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-05 12:35",
        "to":  "2026-07-05 13:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24806-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-05 11:45",
        "to":  "2026-07-05 12:25",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24806-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-05 11:45",
        "to":  "2026-07-05 12:25",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24804-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-05 09:20",
        "to":  "2026-07-05 10:20",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24804-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-05 09:20",
        "to":  "2026-07-05 10:20",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24803-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-05 05:45",
        "to":  "2026-07-05 06:55",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-24802-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-20 06:10",
        "to":  "2026-07-20 08:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-06/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-24802-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-20 06:10",
        "to":  "2026-07-20 08:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-06/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-059"
    },
    {
        "id":  "TT-24801-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-10 09:10",
        "to":  "2026-07-10 11:25",
        "type":  "tow_in",
        "vessel":  "JADE/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-24801-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-10 09:10",
        "to":  "2026-07-10 11:25",
        "type":  "tow_in",
        "vessel":  "JADE/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-007"
    },
    {
        "id":  "TT-24800-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-05 23:30",
        "to":  "2026-07-06 00:15",
        "type":  "tow_in",
        "vessel":  "JIALI",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24800"
    },
    {
        "id":  "TT-24800-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-05 23:30",
        "to":  "2026-07-06 00:15",
        "type":  "tow_in",
        "vessel":  "JIALI",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24800"
    },
    {
        "id":  "TT-24799-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-05 12:15",
        "to":  "2026-07-05 13:00",
        "type":  "tow_in",
        "vessel":  "FORTUNE VICTORY",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24799"
    },
    {
        "id":  "TT-24798-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-07 06:10",
        "to":  "2026-07-07 11:00",
        "type":  "tow_in",
        "vessel":  "TIPM NO.514001",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24798"
    },
    {
        "id":  "TT-24798-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-07 06:10",
        "to":  "2026-07-07 11:00",
        "type":  "tow_in",
        "vessel":  "TIPM NO.514001",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24798"
    },
    {
        "id":  "TT-24798-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-07 06:10",
        "to":  "2026-07-07 11:00",
        "type":  "tow_in",
        "vessel":  "TIPM NO.514001",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24798"
    },
    {
        "id":  "TT-24797-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-04 22:50",
        "to":  "2026-07-04 23:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 26-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-24797-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-04 22:50",
        "to":  "2026-07-04 23:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 26-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-24796-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-04 09:50",
        "to":  "2026-07-09 08:00",
        "type":  "tow_in",
        "vessel":  "MICLYN 2510",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24796"
    },
    {
        "id":  "TT-24795-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-04 07:00",
        "to":  "2026-07-04 15:00",
        "type":  "tow_in",
        "vessel":  "PV DRILLING VIII",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24795"
    },
    {
        "id":  "TT-24795-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-04 07:00",
        "to":  "2026-07-04 15:00",
        "type":  "tow_in",
        "vessel":  "PV DRILLING VIII",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24795"
    },
    {
        "id":  "TT-24795-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-04 07:00",
        "to":  "2026-07-04 15:00",
        "type":  "tow_in",
        "vessel":  "PV DRILLING VIII",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24795"
    },
    {
        "id":  "TT-24794-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-04 06:20",
        "to":  "2026-07-04 07:55",
        "type":  "tow_in",
        "vessel":  "INCE BOSPHORUS",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24794"
    },
    {
        "id":  "TT-24794-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-04 06:20",
        "to":  "2026-07-04 07:55",
        "type":  "tow_in",
        "vessel":  "INCE BOSPHORUS",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24794"
    },
    {
        "id":  "TT-24793-1",
        "tugId":  "Tàu lai ngoài 02",
        "from":  "2026-07-04 11:00",
        "to":  "2026-07-04 12:00",
        "type":  "tow_in",
        "vessel":  "ESL OMAN",
        "customer":  "CÔNG TY TNHH TIẾP VẬN HỪNG Á (ESL)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24793"
    },
    {
        "id":  "TT-24793-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-04 11:00",
        "to":  "2026-07-04 12:00",
        "type":  "tow_in",
        "vessel":  "ESL OMAN",
        "customer":  "CÔNG TY TNHH TIẾP VẬN HỪNG Á (ESL)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24793"
    },
    {
        "id":  "TT-24792-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-03 21:30",
        "to":  "2026-07-03 22:25",
        "type":  "tow_in",
        "vessel":  "ESL OMAN",
        "customer":  "CÔNG TY TNHH TIẾP VẬN HỪNG Á (ESL)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24792"
    },
    {
        "id":  "TT-24792-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-03 21:30",
        "to":  "2026-07-03 22:25",
        "type":  "tow_in",
        "vessel":  "ESL OMAN",
        "customer":  "CÔNG TY TNHH TIẾP VẬN HỪNG Á (ESL)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24792"
    },
    {
        "id":  "TT-24791-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-04 11:40",
        "to":  "2026-07-04 12:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24791-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-04 11:40",
        "to":  "2026-07-04 12:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24790-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-04 10:45",
        "to":  "2026-07-04 11:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24790-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-04 10:45",
        "to":  "2026-07-04 11:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24789-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-04 11:00",
        "to":  "2026-07-04 11:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24789-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-04 11:00",
        "to":  "2026-07-04 11:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24788-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-03 15:40",
        "to":  "2026-07-03 16:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24788-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-03 15:40",
        "to":  "2026-07-03 16:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24787-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-03 14:45",
        "to":  "2026-07-03 15:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24787-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-03 14:45",
        "to":  "2026-07-03 15:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24786-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-03 05:10",
        "to":  "2026-07-03 09:30",
        "type":  "tow_in",
        "vessel":  "TIPM NO.514001",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24786"
    },
    {
        "id":  "TT-24786-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-03 05:10",
        "to":  "2026-07-03 09:30",
        "type":  "tow_in",
        "vessel":  "TIPM NO.514001",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24786"
    },
    {
        "id":  "TT-24786-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-03 05:10",
        "to":  "2026-07-03 09:30",
        "type":  "tow_in",
        "vessel":  "TIPM NO.514001",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24786"
    },
    {
        "id":  "TT-24785-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-03 15:00",
        "to":  "2026-07-03 16:15",
        "type":  "tow_in",
        "vessel":  "WAN HAI 901",
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24785"
    },
    {
        "id":  "TT-24785-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-03 15:00",
        "to":  "2026-07-03 16:15",
        "type":  "tow_in",
        "vessel":  "WAN HAI 901",
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24785"
    },
    {
        "id":  "TT-24784-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-03 06:20",
        "to":  "2026-07-03 07:25",
        "type":  "tow_in",
        "vessel":  "WAN HAI 901",
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24784"
    },
    {
        "id":  "TT-24784-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-03 06:20",
        "to":  "2026-07-03 07:25",
        "type":  "tow_in",
        "vessel":  "WAN HAI 901",
        "customer":  "CÔNG TY CỔ PHẦN CẢNG CÁI MÉP GEMADEPT – TERMINAL LINK (GML)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24784"
    },
    {
        "id":  "TT-24783-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-04 06:30",
        "to":  "2026-07-04 07:20",
        "type":  "tow_in",
        "vessel":  "PAVIDA NAREE",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN VŨNG TÀU (VTOSA)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24783"
    },
    {
        "id":  "TT-24783-2",
        "tugId":  "VNL 03",
        "from":  "2026-07-04 06:30",
        "to":  "2026-07-04 07:20",
        "type":  "tow_in",
        "vessel":  "PAVIDA NAREE",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN VŨNG TÀU (VTOSA)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24783"
    },
    {
        "id":  "TT-24782-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-02 21:15",
        "to":  "2026-07-02 22:20",
        "type":  "tow_in",
        "vessel":  "PAVIDA NAREE",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN VŨNG TÀU (VTOSA)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24782"
    },
    {
        "id":  "TT-24782-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-02 21:15",
        "to":  "2026-07-02 22:20",
        "type":  "tow_in",
        "vessel":  "PAVIDA NAREE",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN VŨNG TÀU (VTOSA)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24782"
    },
    {
        "id":  "TT-24781-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-02 18:45",
        "to":  "2026-07-02 20:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24781-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-02 18:45",
        "to":  "2026-07-02 20:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24780-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-02 18:55",
        "to":  "2026-07-02 20:00",
        "type":  "tow_in",
        "vessel":  "ITC-02",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24780-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-02 18:55",
        "to":  "2026-07-02 20:00",
        "type":  "tow_in",
        "vessel":  "ITC-02",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24779-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-02 17:35",
        "to":  "2026-07-02 18:40",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24779-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-02 17:35",
        "to":  "2026-07-02 18:40",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-24778-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-02 16:40",
        "to":  "2026-07-02 20:25",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24778"
    },
    {
        "id":  "TT-24778-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-02 16:40",
        "to":  "2026-07-02 20:25",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24778"
    },
    {
        "id":  "TT-24778-3",
        "tugId":  "VNL 03",
        "from":  "2026-07-02 16:40",
        "to":  "2026-07-02 20:25",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24778"
    },
    {
        "id":  "TT-24778-4",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-02 16:40",
        "to":  "2026-07-02 20:25",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24778"
    },
    {
        "id":  "TT-24777-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-02 15:00",
        "to":  "2026-07-02 15:45",
        "type":  "tow_in",
        "vessel":  "ACE GOLD",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24777"
    },
    {
        "id":  "TT-24777-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-02 15:00",
        "to":  "2026-07-02 15:45",
        "type":  "tow_in",
        "vessel":  "ACE GOLD",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24777"
    },
    {
        "id":  "TT-24776-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-02 14:25",
        "to":  "2026-07-02 15:15",
        "type":  "tow_in",
        "vessel":  "UNITY MARIA/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24776-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-02 14:25",
        "to":  "2026-07-02 15:15",
        "type":  "tow_in",
        "vessel":  "UNITY MARIA/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24775-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-02 13:45",
        "to":  "2026-07-02 14:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24775-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-02 13:45",
        "to":  "2026-07-02 14:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24774-1",
        "tugId":  "VNL 07",
        "from":  "2026-07-02 16:10",
        "to":  "2026-07-02 16:55",
        "type":  "tow_in",
        "vessel":  "VTT 99",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24774"
    },
    {
        "id":  "TT-24773-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-04 06:15",
        "to":  "2026-07-04 06:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-24773-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-04 06:15",
        "to":  "2026-07-04 06:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-24772-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-04 05:20",
        "to":  "2026-07-04 06:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-24772-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-04 05:20",
        "to":  "2026-07-04 06:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-24771-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-02 05:40",
        "to":  "2026-07-02 06:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-24771-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-02 05:40",
        "to":  "2026-07-02 06:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-24770-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-04 15:30",
        "to":  "2026-07-04 16:20",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT EVEREST",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24770"
    },
    {
        "id":  "TT-24770-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-04 15:30",
        "to":  "2026-07-04 16:20",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT EVEREST",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24770"
    },
    {
        "id":  "TT-24770-3",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-04 15:30",
        "to":  "2026-07-04 16:20",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT EVEREST",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24770"
    },
    {
        "id":  "TT-24769-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-02 22:25",
        "to":  "2026-07-02 23:30",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT EVEREST",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24769"
    },
    {
        "id":  "TT-24769-2",
        "tugId":  "Tàu lai ngoài 02",
        "from":  "2026-07-02 22:25",
        "to":  "2026-07-02 23:30",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT EVEREST",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24769"
    },
    {
        "id":  "TT-24769-3",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-07-02 22:25",
        "to":  "2026-07-02 23:30",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT EVEREST",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24769"
    },
    {
        "id":  "TT-24768-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-02 11:15",
        "to":  "2026-07-02 16:15",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24768"
    },
    {
        "id":  "TT-24768-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-02 11:15",
        "to":  "2026-07-02 16:15",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24768"
    },
    {
        "id":  "TT-24768-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-02 11:15",
        "to":  "2026-07-02 16:15",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24768"
    },
    {
        "id":  "TT-24767-1",
        "tugId":  "VNL 03",
        "from":  "2026-07-02 09:20",
        "to":  "2026-07-02 10:25",
        "type":  "tow_in",
        "vessel":  "FORTUNE VICTORY",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24767"
    },
    {
        "id":  "TT-24766-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-15 13:00",
        "to":  "2026-07-15 14:30",
        "type":  "tow_in",
        "vessel":  "KING MILO/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-24766-2",
        "tugId":  "VNL VISION",
        "from":  "2026-07-15 13:00",
        "to":  "2026-07-15 14:30",
        "type":  "tow_in",
        "vessel":  "KING MILO/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-24766-3",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-07-15 13:00",
        "to":  "2026-07-15 14:30",
        "type":  "tow_in",
        "vessel":  "KING MILO/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-24766-4",
        "tugId":  "VNL VISION",
        "from":  "2026-07-15 13:00",
        "to":  "2026-07-15 14:30",
        "type":  "tow_in",
        "vessel":  "KING MILO/ FC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-006"
    },
    {
        "id":  "TT-24765-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-13 11:10",
        "to":  "2026-07-13 13:10",
        "type":  "tow_in",
        "vessel":  "SHI DAI 11/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-24765-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-13 11:10",
        "to":  "2026-07-13 13:10",
        "type":  "tow_in",
        "vessel":  "SHI DAI 11/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2607-005"
    },
    {
        "id":  "TT-24764-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-01 11:15",
        "to":  "2026-07-01 16:30",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24764"
    },
    {
        "id":  "TT-24764-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-01 11:15",
        "to":  "2026-07-01 16:30",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24764"
    },
    {
        "id":  "TT-24764-3",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-07-01 11:15",
        "to":  "2026-07-01 16:30",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24764"
    },
    {
        "id":  "TT-24763-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-30 11:15",
        "to":  "2026-06-30 23:59",
        "type":  "tow_in",
        "vessel":  "MICLYN 2510",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24763"
    },
    {
        "id":  "TT-24762-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-01 21:35",
        "to":  "2026-07-01 22:25",
        "type":  "tow_in",
        "vessel":  "MISSISSIPPI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24762"
    },
    {
        "id":  "TT-24762-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-01 21:35",
        "to":  "2026-07-01 22:25",
        "type":  "tow_in",
        "vessel":  "MISSISSIPPI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24762"
    },
    {
        "id":  "TT-24761-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-07-01 04:20",
        "to":  "2026-07-01 05:25",
        "type":  "tow_in",
        "vessel":  "MISSISSIPPI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24761"
    },
    {
        "id":  "TT-24761-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-01 04:20",
        "to":  "2026-07-01 05:25",
        "type":  "tow_in",
        "vessel":  "MISSISSIPPI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24761"
    },
    {
        "id":  "TT-24760-1",
        "tugId":  "VNL 05",
        "from":  "2026-07-01 00:00",
        "to":  "2026-07-01 05:10",
        "type":  "tow_in",
        "vessel":  "MICLYN 2510",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24760"
    },
    {
        "id":  "TT-24760-2",
        "tugId":  "VNL 07",
        "from":  "2026-07-01 00:00",
        "to":  "2026-07-01 05:10",
        "type":  "tow_in",
        "vessel":  "MICLYN 2510",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24760"
    },
    {
        "id":  "TT-24759-1",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-30 22:50",
        "to":  "2026-07-01 03:25",
        "type":  "tow_in",
        "vessel":  "TIPM NO.514001",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24759"
    },
    {
        "id":  "TT-24758-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-30 22:15",
        "to":  "2026-06-30 23:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24758-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-30 22:15",
        "to":  "2026-06-30 23:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24757-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-30 20:30",
        "to":  "2026-06-30 21:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24757-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-30 20:30",
        "to":  "2026-06-30 21:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24756-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-30 14:30",
        "to":  "2026-06-30 15:05",
        "type":  "tow_in",
        "vessel":  "HONG TAI 616",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24756"
    },
    {
        "id":  "TT-24755-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-30 13:35",
        "to":  "2026-06-30 14:30",
        "type":  "tow_in",
        "vessel":  "JIALI",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24755"
    },
    {
        "id":  "TT-24755-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-30 13:35",
        "to":  "2026-06-30 14:30",
        "type":  "tow_in",
        "vessel":  "JIALI",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24755"
    },
    {
        "id":  "TT-24754-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-30 10:25",
        "to":  "2026-06-30 14:00",
        "type":  "tow_in",
        "vessel":  "SEA MEADOW 12",
        "customer":  "CÔNG TY TNHH HẢI DƯƠNG (HADUCO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24754"
    },
    {
        "id":  "TT-24754-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-30 10:25",
        "to":  "2026-06-30 14:00",
        "type":  "tow_in",
        "vessel":  "SEA MEADOW 12",
        "customer":  "CÔNG TY TNHH HẢI DƯƠNG (HADUCO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24754"
    },
    {
        "id":  "TT-24753-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-29 20:40",
        "to":  "2026-06-29 21:25",
        "type":  "tow_in",
        "vessel":  "DAI PHUC 19",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24753"
    },
    {
        "id":  "TT-24752-1",
        "tugId":  "VNL 07",
        "from":  "2026-06-29 12:05",
        "to":  "2026-06-29 12:50",
        "type":  "tow_in",
        "vessel":  "MARINE MOON",
        "customer":  "CÔNG TY TNHH VẬN TẢI LOGISTICS TRUNG KIÊN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24752"
    },
    {
        "id":  "TT-24751-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-29 13:00",
        "to":  "2026-06-29 14:45",
        "type":  "tow_in",
        "vessel":  "INCE BOSPHORUS",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24751"
    },
    {
        "id":  "TT-24751-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-29 13:00",
        "to":  "2026-06-29 14:45",
        "type":  "tow_in",
        "vessel":  "INCE BOSPHORUS",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ TÀU BIỂN HẢI NAM",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24751"
    },
    {
        "id":  "TT-24750-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-29 08:15",
        "to":  "2026-06-29 09:00",
        "type":  "tow_in",
        "vessel":  "YU PENG",
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24750"
    },
    {
        "id":  "TT-24750-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-29 08:15",
        "to":  "2026-06-29 09:00",
        "type":  "tow_in",
        "vessel":  "YU PENG",
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24750"
    },
    {
        "id":  "TT-24749-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-29 07:00",
        "to":  "2026-06-29 09:00",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24749"
    },
    {
        "id":  "TT-24749-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-29 07:00",
        "to":  "2026-06-29 09:00",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24749"
    },
    {
        "id":  "TT-24748-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-29 04:50",
        "to":  "2026-06-29 07:20",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24748"
    },
    {
        "id":  "TT-24748-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-29 04:50",
        "to":  "2026-06-29 07:20",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24748"
    },
    {
        "id":  "TT-24747-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-29 03:40",
        "to":  "2026-06-29 04:40",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24747"
    },
    {
        "id":  "TT-24747-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-29 03:40",
        "to":  "2026-06-29 04:40",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24747"
    },
    {
        "id":  "TT-24746-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-29 19:50",
        "to":  "2026-06-29 20:50",
        "type":  "tow_in",
        "vessel":  "JASPER",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24746"
    },
    {
        "id":  "TT-24746-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-29 19:50",
        "to":  "2026-06-29 20:50",
        "type":  "tow_in",
        "vessel":  "JASPER",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24746"
    },
    {
        "id":  "TT-24745-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-29 04:05",
        "to":  "2026-06-29 05:10",
        "type":  "tow_in",
        "vessel":  "JASPER",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24745"
    },
    {
        "id":  "TT-24745-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-29 04:05",
        "to":  "2026-06-29 05:10",
        "type":  "tow_in",
        "vessel":  "JASPER",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24745"
    },
    {
        "id":  "TT-24745-3",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-29 04:05",
        "to":  "2026-06-29 05:10",
        "type":  "tow_in",
        "vessel":  "JASPER",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24745"
    },
    {
        "id":  "TT-24745-4",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-29 04:05",
        "to":  "2026-06-29 05:10",
        "type":  "tow_in",
        "vessel":  "JASPER",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24745"
    },
    {
        "id":  "TT-24744-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-30 08:30",
        "to":  "2026-06-30 09:40",
        "type":  "tow_in",
        "vessel":  "ROTTERDAM",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24744"
    },
    {
        "id":  "TT-24744-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-30 08:30",
        "to":  "2026-06-30 09:40",
        "type":  "tow_in",
        "vessel":  "ROTTERDAM",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24744"
    },
    {
        "id":  "TT-24744-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-30 08:30",
        "to":  "2026-06-30 09:40",
        "type":  "tow_in",
        "vessel":  "ROTTERDAM",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24744"
    },
    {
        "id":  "TT-24743-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-29 02:40",
        "to":  "2026-06-29 03:55",
        "type":  "tow_in",
        "vessel":  "ROTTERDAM",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24743"
    },
    {
        "id":  "TT-24743-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-29 02:40",
        "to":  "2026-06-29 03:55",
        "type":  "tow_in",
        "vessel":  "ROTTERDAM",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24743"
    },
    {
        "id":  "TT-24743-3",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-29 02:40",
        "to":  "2026-06-29 03:55",
        "type":  "tow_in",
        "vessel":  "ROTTERDAM",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24743"
    },
    {
        "id":  "TT-24742-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-28 09:50",
        "to":  "2026-06-28 11:30",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24742"
    },
    {
        "id":  "TT-24742-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-28 09:50",
        "to":  "2026-06-28 11:30",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24742"
    },
    {
        "id":  "TT-24741-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-28 06:55",
        "to":  "2026-06-28 07:40",
        "type":  "tow_in",
        "vessel":  "HAI NAM 79",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ TIẾP VẬN VÀ THƯƠNG MẠI SÀI GÒN CỬU LONG (SGCL)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24741"
    },
    {
        "id":  "TT-24741-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-28 06:55",
        "to":  "2026-06-28 07:40",
        "type":  "tow_in",
        "vessel":  "HAI NAM 79",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ TIẾP VẬN VÀ THƯƠNG MẠI SÀI GÒN CỬU LONG (SGCL)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24741"
    },
    {
        "id":  "TT-24740-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-28 04:20",
        "to":  "2026-06-28 05:05",
        "type":  "tow_in",
        "vessel":  "HONG TAI 616",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24740"
    },
    {
        "id":  "TT-24739-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-28 02:15",
        "to":  "2026-06-28 03:00",
        "type":  "tow_in",
        "vessel":  "SUN TZU + SON OF GENGHIS",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24739"
    },
    {
        "id":  "TT-24738-1",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-27 11:30",
        "to":  "2026-06-27 12:20",
        "type":  "tow_in",
        "vessel":  "BH XIBAIPO",
        "customer":  "CÔNG TY TNHH VẬN TẢI MÔI GIỚI THUÊ TÀU BIỂN ĐÔNG Á SÀI GÒN – SAIGON EAST ASIA SHIPPING CO., LTD (SEAC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24738"
    },
    {
        "id":  "TT-24738-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-27 11:30",
        "to":  "2026-06-27 12:20",
        "type":  "tow_in",
        "vessel":  "BH XIBAIPO",
        "customer":  "CÔNG TY TNHH VẬN TẢI MÔI GIỚI THUÊ TÀU BIỂN ĐÔNG Á SÀI GÒN – SAIGON EAST ASIA SHIPPING CO., LTD (SEAC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24738"
    },
    {
        "id":  "TT-24738-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-27 11:30",
        "to":  "2026-06-27 12:20",
        "type":  "tow_in",
        "vessel":  "BH XIBAIPO",
        "customer":  "CÔNG TY TNHH VẬN TẢI MÔI GIỚI THUÊ TÀU BIỂN ĐÔNG Á SÀI GÒN – SAIGON EAST ASIA SHIPPING CO., LTD (SEAC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24738"
    },
    {
        "id":  "TT-24738-4",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-27 11:30",
        "to":  "2026-06-27 12:20",
        "type":  "tow_in",
        "vessel":  "BH XIBAIPO",
        "customer":  "CÔNG TY TNHH VẬN TẢI MÔI GIỚI THUÊ TÀU BIỂN ĐÔNG Á SÀI GÒN – SAIGON EAST ASIA SHIPPING CO., LTD (SEAC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24738"
    },
    {
        "id":  "TT-24737-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-27 05:30",
        "to":  "2026-06-27 11:15",
        "type":  "tow_in",
        "vessel":  "TIPM NO.514001",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24737"
    },
    {
        "id":  "TT-24737-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-27 05:30",
        "to":  "2026-06-27 11:15",
        "type":  "tow_in",
        "vessel":  "TIPM NO.514001",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24737"
    },
    {
        "id":  "TT-24737-3",
        "tugId":  "VNL 03",
        "from":  "2026-06-27 05:30",
        "to":  "2026-06-27 11:15",
        "type":  "tow_in",
        "vessel":  "TIPM NO.514001",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24737"
    },
    {
        "id":  "TT-24737-4",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-27 05:30",
        "to":  "2026-06-27 11:15",
        "type":  "tow_in",
        "vessel":  "TIPM NO.514001",
        "customer":  "Công ty Cổ phần Chế tạo Giàn khoan Dầu khí (PV Shipyard)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24737"
    },
    {
        "id":  "TT-24736-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-27 10:40",
        "to":  "2026-06-27 11:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-05/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-24736-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-27 10:40",
        "to":  "2026-06-27 11:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-05/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-24735-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-27 06:15",
        "to":  "2026-06-27 06:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-24735-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-27 06:15",
        "to":  "2026-06-27 06:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-24734-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-27 06:15",
        "to":  "2026-06-27 07:15",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24734"
    },
    {
        "id":  "TT-24733-1",
        "tugId":  "Tàu lai ngoài 02",
        "from":  "2026-06-27 05:30",
        "to":  "2026-06-27 08:10",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24733"
    },
    {
        "id":  "TT-24733-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-27 05:30",
        "to":  "2026-06-27 08:10",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24733"
    },
    {
        "id":  "TT-24733-3",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-27 05:30",
        "to":  "2026-06-27 08:10",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24733"
    },
    {
        "id":  "TT-24732-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-27 03:00",
        "to":  "2026-06-27 04:00",
        "type":  "tow_in",
        "vessel":  "SHI DAI 11/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-24732-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-27 03:00",
        "to":  "2026-06-27 04:00",
        "type":  "tow_in",
        "vessel":  "SHI DAI 11/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-24731-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-27 03:05",
        "to":  "2026-06-27 03:40",
        "type":  "tow_in",
        "vessel":  "ITC-02",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-24731-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-27 03:05",
        "to":  "2026-06-27 03:40",
        "type":  "tow_in",
        "vessel":  "ITC-02",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-24730-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-27 02:25",
        "to":  "2026-06-27 03:05",
        "type":  "tow_in",
        "vessel":  "ITC-01",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-24730-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-27 02:25",
        "to":  "2026-06-27 03:05",
        "type":  "tow_in",
        "vessel":  "ITC-01",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-24729-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-27 02:00",
        "to":  "2026-06-27 04:05",
        "type":  "tow_in",
        "vessel":  "SSI DOMINATOR",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24729"
    },
    {
        "id":  "TT-24729-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-27 02:00",
        "to":  "2026-06-27 04:05",
        "type":  "tow_in",
        "vessel":  "SSI DOMINATOR",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24729"
    },
    {
        "id":  "TT-24728-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-28 03:00",
        "to":  "2026-06-28 04:10",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT FUJI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24728"
    },
    {
        "id":  "TT-24728-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-28 03:00",
        "to":  "2026-06-28 04:10",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT FUJI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24728"
    },
    {
        "id":  "TT-24728-3",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-28 03:00",
        "to":  "2026-06-28 04:10",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT FUJI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24728"
    },
    {
        "id":  "TT-24727-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-27 01:00",
        "to":  "2026-06-27 02:30",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT FUJI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24727"
    },
    {
        "id":  "TT-24727-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-27 01:00",
        "to":  "2026-06-27 02:30",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT FUJI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24727"
    },
    {
        "id":  "TT-24727-3",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-27 01:00",
        "to":  "2026-06-27 02:30",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT FUJI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24727"
    },
    {
        "id":  "TT-24726-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-29 07:45",
        "to":  "2026-06-29 08:35",
        "type":  "tow_in",
        "vessel":  "FORTUNE GENESIS",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24726"
    },
    {
        "id":  "TT-24726-2",
        "tugId":  "VNL 05",
        "from":  "2026-06-29 07:45",
        "to":  "2026-06-29 08:35",
        "type":  "tow_in",
        "vessel":  "FORTUNE GENESIS",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24726"
    },
    {
        "id":  "TT-24725-1",
        "tugId":  "Tàu lai ngoài 02",
        "from":  "2026-06-27 01:00",
        "to":  "2026-06-27 02:00",
        "type":  "tow_in",
        "vessel":  "FORTUNE GENESIS",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24725"
    },
    {
        "id":  "TT-24725-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-27 01:00",
        "to":  "2026-06-27 02:00",
        "type":  "tow_in",
        "vessel":  "FORTUNE GENESIS",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24725"
    },
    {
        "id":  "TT-24724-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-26 23:20",
        "to":  "2026-06-26 23:59",
        "type":  "tow_in",
        "vessel":  "CHIEN TRUONG 66",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24724"
    },
    {
        "id":  "TT-24723-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-27 02:00",
        "to":  "2026-06-27 03:10",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24723"
    },
    {
        "id":  "TT-24723-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-27 02:00",
        "to":  "2026-06-27 03:10",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24723"
    },
    {
        "id":  "TT-24722-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-26 18:30",
        "to":  "2026-06-26 19:00",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24722"
    },
    {
        "id":  "TT-24722-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-26 18:30",
        "to":  "2026-06-26 19:00",
        "type":  "tow_in",
        "vessel":  "MTT BANGKOK",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24722"
    },
    {
        "id":  "TT-24721-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-28 20:00",
        "to":  "2026-06-28 20:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24721-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-28 20:00",
        "to":  "2026-06-28 20:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24720-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-28 12:50",
        "to":  "2026-06-28 13:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24720-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-28 12:50",
        "to":  "2026-06-28 13:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24719-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-26 10:30",
        "to":  "2026-06-26 11:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24719-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-26 10:30",
        "to":  "2026-06-26 11:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-24718-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-26 10:40",
        "to":  "2026-06-26 11:55",
        "type":  "tow_in",
        "vessel":  "JEN LR/ FC",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ VẬN TẢI HIGH SEA",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-037"
    },
    {
        "id":  "TT-24718-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-26 10:40",
        "to":  "2026-06-26 11:55",
        "type":  "tow_in",
        "vessel":  "JEN LR/ FC",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ VẬN TẢI HIGH SEA",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-037"
    },
    {
        "id":  "TT-24717-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-26 07:05",
        "to":  "2026-06-26 09:15",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-037"
    },
    {
        "id":  "TT-24717-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-26 07:05",
        "to":  "2026-06-26 09:15",
        "type":  "tow_in",
        "vessel":  "VNL09",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-037"
    },
    {
        "id":  "TT-24716-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-26 05:40",
        "to":  "2026-06-26 06:25",
        "type":  "tow_in",
        "vessel":  "TIAN QI",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24716"
    },
    {
        "id":  "TT-24716-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-26 05:40",
        "to":  "2026-06-26 06:25",
        "type":  "tow_in",
        "vessel":  "TIAN QI",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24716"
    },
    {
        "id":  "TT-24715-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-26 05:00",
        "to":  "2026-06-26 05:45",
        "type":  "tow_in",
        "vessel":  "AN VINH 18",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24715"
    },
    {
        "id":  "TT-24714-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-26 03:10",
        "to":  "2026-06-26 03:55",
        "type":  "tow_in",
        "vessel":  "ACE GOLD",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24714"
    },
    {
        "id":  "TT-24714-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-26 03:10",
        "to":  "2026-06-26 03:55",
        "type":  "tow_in",
        "vessel":  "ACE GOLD",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24714"
    },
    {
        "id":  "TT-24713-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-26 01:00",
        "to":  "2026-06-26 01:50",
        "type":  "tow_in",
        "vessel":  "DEMA",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24713"
    },
    {
        "id":  "TT-24713-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-26 01:00",
        "to":  "2026-06-26 01:50",
        "type":  "tow_in",
        "vessel":  "DEMA",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-24713"
    },
    {
        "id":  "TT-23724-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-25 18:40",
        "to":  "2026-06-25 19:50",
        "type":  "tow_in",
        "vessel":  "YU PENG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-23724"
    },
    {
        "id":  "TT-23724-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-25 18:40",
        "to":  "2026-06-25 19:50",
        "type":  "tow_in",
        "vessel":  "YU PENG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-23724"
    },
    {
        "id":  "TT-23723-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-25 16:45",
        "to":  "2026-06-25 17:30",
        "type":  "tow_in",
        "vessel":  "DA KANG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-23723"
    },
    {
        "id":  "TT-23723-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-25 16:45",
        "to":  "2026-06-25 17:30",
        "type":  "tow_in",
        "vessel":  "DA KANG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-23723"
    },
    {
        "id":  "TT-23722-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-04 15:05",
        "to":  "2026-07-04 16:50",
        "type":  "tow_in",
        "vessel":  "ASP HOPE/ SC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-23722-2",
        "tugId":  "VNL 05",
        "from":  "2026-07-04 15:05",
        "to":  "2026-07-04 16:50",
        "type":  "tow_in",
        "vessel":  "ASP HOPE/ SC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-201"
    },
    {
        "id":  "TT-23721-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-27 01:45",
        "to":  "2026-06-27 02:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-23721-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-27 01:45",
        "to":  "2026-06-27 02:25",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-23720-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-25 18:10",
        "to":  "2026-06-25 18:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-23720-2",
        "tugId":  "VNL 03",
        "from":  "2026-06-25 18:10",
        "to":  "2026-06-25 18:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 198",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-23719-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-25 15:35",
        "to":  "2026-06-25 16:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-23719-2",
        "tugId":  "VNL 03",
        "from":  "2026-06-25 15:35",
        "to":  "2026-06-25 16:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-23718-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-25 09:10",
        "to":  "2026-06-25 10:00",
        "type":  "tow_in",
        "vessel":  "POE GIANT 11",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-23718"
    },
    {
        "id":  "TT-23717-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-26 11:05",
        "to":  "2026-06-26 11:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23717-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-26 11:05",
        "to":  "2026-06-26 11:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23716-1",
        "tugId":  "VNL 07",
        "from":  "2026-06-26 05:50",
        "to":  "2026-06-26 06:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23716-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-26 05:50",
        "to":  "2026-06-26 06:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23715-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-25 17:40",
        "to":  "2026-06-25 18:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23715-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-25 17:40",
        "to":  "2026-06-25 18:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23714-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-25 16:05",
        "to":  "2026-06-25 16:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23714-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-25 16:05",
        "to":  "2026-06-25 16:50",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23713-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-25 02:25",
        "to":  "2026-06-25 03:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23713-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-25 02:25",
        "to":  "2026-06-25 03:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23712-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-25 00:50",
        "to":  "2026-06-25 01:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23712-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-25 00:50",
        "to":  "2026-06-25 01:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-23711-1",
        "tugId":  "VNL VISION",
        "from":  "2026-07-01 13:10",
        "to":  "2026-07-01 15:35",
        "type":  "tow_in",
        "vessel":  "KRAIT/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-23711-2",
        "tugId":  "VNL 03",
        "from":  "2026-07-01 13:10",
        "to":  "2026-07-01 15:35",
        "type":  "tow_in",
        "vessel":  "KRAIT/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-234"
    },
    {
        "id":  "TT-22712-1",
        "tugId":  "VNL 07",
        "from":  "2026-06-24 23:30",
        "to":  "2026-06-24 23:59",
        "type":  "tow_in",
        "vessel":  "AN THANH 18",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22712"
    },
    {
        "id":  "TT-22711-1",
        "tugId":  "VNL 07",
        "from":  "2026-06-24 17:25",
        "to":  "2026-06-24 18:05",
        "type":  "tow_in",
        "vessel":  "PHUONG NAM 46",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22711"
    },
    {
        "id":  "TT-22710-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-02 13:40",
        "to":  "2026-07-02 16:55",
        "type":  "tow_in",
        "vessel":  "MELIA/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-22710-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-07-02 13:40",
        "to":  "2026-07-02 16:55",
        "type":  "tow_in",
        "vessel":  "MELIA/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-200"
    },
    {
        "id":  "TT-22709-1",
        "tugId":  "VNL 07",
        "from":  "2026-06-24 10:00",
        "to":  "2026-06-24 10:45",
        "type":  "tow_in",
        "vessel":  "LL JEANNY \u0026 LL 3027",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-167"
    },
    {
        "id":  "TT-22708-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-24 14:00",
        "to":  "2026-06-24 15:15",
        "type":  "tow_in",
        "vessel":  "POE GIANT 11",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22708"
    },
    {
        "id":  "TT-22707-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-24 10:20",
        "to":  "2026-06-24 11:10",
        "type":  "tow_in",
        "vessel":  "HAI NAM 79",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ TIẾP VẬN VÀ THƯƠNG MẠI SÀI GÒN CỬU LONG (SGCL)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22707"
    },
    {
        "id":  "TT-22707-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-24 10:20",
        "to":  "2026-06-24 11:10",
        "type":  "tow_in",
        "vessel":  "HAI NAM 79",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ TIẾP VẬN VÀ THƯƠNG MẠI SÀI GÒN CỬU LONG (SGCL)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22707"
    },
    {
        "id":  "TT-22706-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-24 17:00",
        "to":  "2026-06-24 18:05",
        "type":  "tow_in",
        "vessel":  "NESTOS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22706"
    },
    {
        "id":  "TT-22706-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-24 17:00",
        "to":  "2026-06-24 18:05",
        "type":  "tow_in",
        "vessel":  "NESTOS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22706"
    },
    {
        "id":  "TT-22705-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-24 10:00",
        "to":  "2026-06-24 11:00",
        "type":  "tow_in",
        "vessel":  "NESTOS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22705"
    },
    {
        "id":  "TT-22705-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-24 10:00",
        "to":  "2026-06-24 11:00",
        "type":  "tow_in",
        "vessel":  "NESTOS",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22705"
    },
    {
        "id":  "TT-22704-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-24 09:35",
        "to":  "2026-06-24 10:35",
        "type":  "tow_in",
        "vessel":  "BH XIBAIPO",
        "customer":  "CÔNG TY TNHH VẬN TẢI MÔI GIỚI THUÊ TÀU BIỂN ĐÔNG Á SÀI GÒN – SAIGON EAST ASIA SHIPPING CO., LTD (SEAC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22704"
    },
    {
        "id":  "TT-22704-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-24 09:35",
        "to":  "2026-06-24 10:35",
        "type":  "tow_in",
        "vessel":  "BH XIBAIPO",
        "customer":  "CÔNG TY TNHH VẬN TẢI MÔI GIỚI THUÊ TÀU BIỂN ĐÔNG Á SÀI GÒN – SAIGON EAST ASIA SHIPPING CO., LTD (SEAC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22704"
    },
    {
        "id":  "TT-22703-1",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-24 01:50",
        "to":  "2026-06-24 09:15",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22703"
    },
    {
        "id":  "TT-22702-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-24 11:20",
        "to":  "2026-06-24 12:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22702-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-24 11:20",
        "to":  "2026-06-24 12:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-03",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22701-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-24 09:30",
        "to":  "2026-06-24 10:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22701-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-24 09:30",
        "to":  "2026-06-24 10:15",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22700-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-23 16:40",
        "to":  "2026-06-23 17:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22700-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-23 16:40",
        "to":  "2026-06-23 17:20",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22699-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-23 15:50",
        "to":  "2026-06-23 16:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22699-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-23 15:50",
        "to":  "2026-06-23 16:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22698-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-24 16:35",
        "to":  "2026-06-24 17:45",
        "type":  "tow_in",
        "vessel":  "TIAN QI",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22698"
    },
    {
        "id":  "TT-22698-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-24 16:35",
        "to":  "2026-06-24 17:45",
        "type":  "tow_in",
        "vessel":  "TIAN QI",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22698"
    },
    {
        "id":  "TT-22697-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-23 14:55",
        "to":  "2026-06-23 15:50",
        "type":  "tow_in",
        "vessel":  "TIAN QI",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22697"
    },
    {
        "id":  "TT-22697-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-23 14:55",
        "to":  "2026-06-23 15:50",
        "type":  "tow_in",
        "vessel":  "TIAN QI",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22697"
    },
    {
        "id":  "TT-22696-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-23 13:35",
        "to":  "2026-06-23 15:40",
        "type":  "tow_in",
        "vessel":  "SSI DOMINATOR",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22696"
    },
    {
        "id":  "TT-22696-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-23 13:35",
        "to":  "2026-06-23 15:40",
        "type":  "tow_in",
        "vessel":  "SSI DOMINATOR",
        "customer":  "ATTA - An Trung Tin Shipping Agency and Trading Co., Ltd",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22696"
    },
    {
        "id":  "TT-22695-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-23 10:35",
        "to":  "2026-06-23 11:55",
        "type":  "tow_in",
        "vessel":  "BRILLIANT KNIGHT",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22695"
    },
    {
        "id":  "TT-22695-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-23 10:35",
        "to":  "2026-06-23 11:55",
        "type":  "tow_in",
        "vessel":  "BRILLIANT KNIGHT",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22695"
    },
    {
        "id":  "TT-22694-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-23 09:00",
        "to":  "2026-06-23 11:50",
        "type":  "tow_in",
        "vessel":  "JTN 253",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22694"
    },
    {
        "id":  "TT-22694-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-23 09:00",
        "to":  "2026-06-23 11:50",
        "type":  "tow_in",
        "vessel":  "JTN 253",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22694"
    },
    {
        "id":  "TT-22693-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-23 10:25",
        "to":  "2026-06-23 10:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22693-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-23 10:25",
        "to":  "2026-06-23 10:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22692-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-23 10:00",
        "to":  "2026-06-23 10:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22692-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-23 10:00",
        "to":  "2026-06-23 10:30",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 235-05",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22691-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-23 08:50",
        "to":  "2026-06-23 09:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22691-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-23 08:50",
        "to":  "2026-06-23 09:35",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22690-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-23 22:30",
        "to":  "2026-06-23 23:40",
        "type":  "tow_in",
        "vessel":  "ZIM XIAMEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22690"
    },
    {
        "id":  "TT-22690-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-23 22:30",
        "to":  "2026-06-23 23:40",
        "type":  "tow_in",
        "vessel":  "ZIM XIAMEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22690"
    },
    {
        "id":  "TT-22690-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-23 22:30",
        "to":  "2026-06-23 23:40",
        "type":  "tow_in",
        "vessel":  "ZIM XIAMEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22690"
    },
    {
        "id":  "TT-22689-1",
        "tugId":  "Tàu lai ngoài 02",
        "from":  "2026-06-23 08:40",
        "to":  "2026-06-23 09:50",
        "type":  "tow_in",
        "vessel":  "ZIM XIAMEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22689"
    },
    {
        "id":  "TT-22689-2",
        "tugId":  "VNL 03",
        "from":  "2026-06-23 08:40",
        "to":  "2026-06-23 09:50",
        "type":  "tow_in",
        "vessel":  "ZIM XIAMEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22689"
    },
    {
        "id":  "TT-22689-3",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-23 08:40",
        "to":  "2026-06-23 09:50",
        "type":  "tow_in",
        "vessel":  "ZIM XIAMEN",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22689"
    },
    {
        "id":  "TT-22688-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-23 05:45",
        "to":  "2026-06-23 10:20",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22688"
    },
    {
        "id":  "TT-22688-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-23 05:45",
        "to":  "2026-06-23 10:20",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22688"
    },
    {
        "id":  "TT-22688-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-23 05:45",
        "to":  "2026-06-23 10:20",
        "type":  "tow_in",
        "vessel":  "LANPAN CB9",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22688"
    },
    {
        "id":  "TT-22687-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-23 01:15",
        "to":  "2026-06-23 02:15",
        "type":  "tow_in",
        "vessel":  "DEMA",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22687"
    },
    {
        "id":  "TT-22687-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-23 01:15",
        "to":  "2026-06-23 02:15",
        "type":  "tow_in",
        "vessel":  "DEMA",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22687"
    },
    {
        "id":  "TT-22686-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-22 19:50",
        "to":  "2026-06-22 20:30",
        "type":  "tow_in",
        "vessel":  "BIG DECK 1",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22686"
    },
    {
        "id":  "TT-22686-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-22 19:50",
        "to":  "2026-06-22 20:30",
        "type":  "tow_in",
        "vessel":  "BIG DECK 1",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22686"
    },
    {
        "id":  "TT-22685-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-22 19:15",
        "to":  "2026-06-22 20:00",
        "type":  "tow_in",
        "vessel":  "SUN TZU + SON OF GENGHIS",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI SÀI GÒN (SMC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22685"
    },
    {
        "id":  "TT-22684-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-23 05:55",
        "to":  "2026-06-23 09:55",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22684"
    },
    {
        "id":  "TT-22684-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-23 05:55",
        "to":  "2026-06-23 09:55",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22684"
    },
    {
        "id":  "TT-22684-3",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-23 05:55",
        "to":  "2026-06-23 09:55",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22684"
    },
    {
        "id":  "TT-22683-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-22 13:35",
        "to":  "2026-06-22 15:50",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22683"
    },
    {
        "id":  "TT-22683-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-22 13:35",
        "to":  "2026-06-22 15:50",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22683"
    },
    {
        "id":  "TT-22683-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-22 13:35",
        "to":  "2026-06-22 15:50",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22683"
    },
    {
        "id":  "TT-22682-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-22 15:30",
        "to":  "2026-06-22 16:15",
        "type":  "tow_in",
        "vessel":  "THANH BINH 05",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22682"
    },
    {
        "id":  "TT-22681-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-23 05:10",
        "to":  "2026-06-23 05:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22681-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-23 05:10",
        "to":  "2026-06-23 05:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-05",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22680-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-23 04:10",
        "to":  "2026-06-23 04:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22680-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-23 04:10",
        "to":  "2026-06-23 04:55",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22679-1",
        "tugId":  "VNL 07",
        "from":  "2026-06-22 14:20",
        "to":  "2026-06-22 15:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22679-2",
        "tugId":  "Tàu lai ngoài",
        "from":  "2026-06-22 14:20",
        "to":  "2026-06-22 15:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-22678-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-23 01:00",
        "to":  "2026-06-23 01:50",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22678"
    },
    {
        "id":  "TT-22678-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-23 01:00",
        "to":  "2026-06-23 01:50",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22678"
    },
    {
        "id":  "TT-22677-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-22 14:10",
        "to":  "2026-06-22 15:00",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22677"
    },
    {
        "id":  "TT-22677-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-22 14:10",
        "to":  "2026-06-22 15:00",
        "type":  "tow_in",
        "vessel":  "KANWAY FORTUNE",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22677"
    },
    {
        "id":  "TT-22676-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-22 07:15",
        "to":  "2026-06-22 08:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 10-03",
        "customer":  "CÔNG TY CỔ PHẦN THORESEN – VI NA MA TUG (TVT)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22676"
    },
    {
        "id":  "TT-22675-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-22 00:20",
        "to":  "2026-06-22 01:30",
        "type":  "tow_in",
        "vessel":  "DA KANG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22675"
    },
    {
        "id":  "TT-22675-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-22 00:20",
        "to":  "2026-06-22 01:30",
        "type":  "tow_in",
        "vessel":  "DA KANG",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22675"
    },
    {
        "id":  "TT-22674-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-22 01:25",
        "to":  "2026-06-22 02:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22674-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-22 01:25",
        "to":  "2026-06-22 02:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-07",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22673-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-21 19:00",
        "to":  "2026-06-21 19:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22673-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-21 19:00",
        "to":  "2026-06-21 19:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22672-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-21 16:20",
        "to":  "2026-06-21 17:00",
        "type":  "tow_in",
        "vessel":  "BAO LONG 05",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22672"
    },
    {
        "id":  "TT-22671-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-21 13:00",
        "to":  "2026-06-21 15:50",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22671"
    },
    {
        "id":  "TT-22671-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-21 13:00",
        "to":  "2026-06-21 15:50",
        "type":  "tow_in",
        "vessel":  "FC06",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22671"
    },
    {
        "id":  "TT-22670-1",
        "tugId":  "VNL 07",
        "from":  "2026-06-20 17:40",
        "to":  "2026-06-20 18:20",
        "type":  "tow_in",
        "vessel":  "THAI SON 16",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22670"
    },
    {
        "id":  "TT-22669-1",
        "tugId":  "VNL 07",
        "from":  "2026-06-21 01:15",
        "to":  "2026-06-21 02:00",
        "type":  "tow_in",
        "vessel":  "EPIC 09",
        "customer":  "CÔNG TY TNHH VẬN TẢI LOGISTICS TRUNG KIÊN",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22669"
    },
    {
        "id":  "TT-22668-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-22 09:30",
        "to":  "2026-06-22 10:45",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22668"
    },
    {
        "id":  "TT-22668-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-22 09:30",
        "to":  "2026-06-22 10:45",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22668"
    },
    {
        "id":  "TT-22668-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-22 09:30",
        "to":  "2026-06-22 10:45",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22668"
    },
    {
        "id":  "TT-22667-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-21 18:20",
        "to":  "2026-06-21 19:35",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22667"
    },
    {
        "id":  "TT-22667-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-21 18:20",
        "to":  "2026-06-21 19:35",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22667"
    },
    {
        "id":  "TT-22667-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-21 18:20",
        "to":  "2026-06-21 19:35",
        "type":  "tow_in",
        "vessel":  "SAN DIEGO",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22667"
    },
    {
        "id":  "TT-22666-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-21 17:30",
        "to":  "2026-06-21 18:10",
        "type":  "tow_in",
        "vessel":  "MACALLAN 1 \u0026 MOUTON",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-113"
    },
    {
        "id":  "TT-22666-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-21 17:30",
        "to":  "2026-06-21 18:10",
        "type":  "tow_in",
        "vessel":  "MACALLAN 1 \u0026 MOUTON",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI AN BÌNH",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-113"
    },
    {
        "id":  "TT-22665-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-21 17:40",
        "to":  "2026-06-21 18:55",
        "type":  "tow_in",
        "vessel":  "BRILLIANT KNIGHT",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22665"
    },
    {
        "id":  "TT-22665-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-21 17:40",
        "to":  "2026-06-21 18:55",
        "type":  "tow_in",
        "vessel":  "BRILLIANT KNIGHT",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22665"
    },
    {
        "id":  "TT-22664-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-21 14:45",
        "to":  "2026-06-21 16:10",
        "type":  "tow_in",
        "vessel":  "SINCERITY DIVA",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22664"
    },
    {
        "id":  "TT-22664-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-21 14:45",
        "to":  "2026-06-21 16:10",
        "type":  "tow_in",
        "vessel":  "SINCERITY DIVA",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22664"
    },
    {
        "id":  "TT-22663-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-21 12:20",
        "to":  "2026-06-21 14:20",
        "type":  "tow_in",
        "vessel":  "JTN 253",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22663"
    },
    {
        "id":  "TT-22663-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-21 12:20",
        "to":  "2026-06-21 14:20",
        "type":  "tow_in",
        "vessel":  "JTN 253",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22663"
    },
    {
        "id":  "TT-22662-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-20 12:25",
        "to":  "2026-06-20 13:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22662-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-20 12:25",
        "to":  "2026-06-20 13:10",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 215-02",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22661-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-20 08:15",
        "to":  "2026-06-20 11:15",
        "type":  "tow_in",
        "vessel":  "ITC-01",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22661-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-20 08:15",
        "to":  "2026-06-20 11:15",
        "type":  "tow_in",
        "vessel":  "ITC-01",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22660-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-20 09:20",
        "to":  "2026-06-20 10:35",
        "type":  "tow_in",
        "vessel":  "ITC-02",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22660-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-20 09:20",
        "to":  "2026-06-20 10:35",
        "type":  "tow_in",
        "vessel":  "ITC-02",
        "customer":  "CÔNG TY CỔ PHẦN VẬN TÀI VÀ THƯƠNG MẠI QUỐC TẾ (ITC)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-22659-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-20 06:55",
        "to":  "2026-06-20 07:40",
        "type":  "tow_in",
        "vessel":  "GLORY BLUE",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI LONG HẢI",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22659"
    },
    {
        "id":  "TT-22659-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-20 06:55",
        "to":  "2026-06-20 07:40",
        "type":  "tow_in",
        "vessel":  "GLORY BLUE",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI LONG HẢI",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22659"
    },
    {
        "id":  "TT-22658-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-20 05:40",
        "to":  "2026-06-20 07:15",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22658"
    },
    {
        "id":  "TT-22658-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-20 05:40",
        "to":  "2026-06-20 07:15",
        "type":  "tow_in",
        "vessel":  "VNL08",
        "customer":  "VINA LOGISTICS CORPORATION",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22658"
    },
    {
        "id":  "TT-22657-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-19 14:50",
        "to":  "2026-06-19 15:45",
        "type":  "tow_in",
        "vessel":  "BIG DECK 1",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22657"
    },
    {
        "id":  "TT-22657-2",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-19 14:50",
        "to":  "2026-06-19 15:45",
        "type":  "tow_in",
        "vessel":  "BIG DECK 1",
        "customer":  "CÔNG TY TNHH ĐẠI LÝ \u0026 MÔI GIỚI VẬN TẢI BIỂN QUỐC TẾ  (AGE-LINES CO.,LTD)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22657"
    },
    {
        "id":  "TT-22656-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-19 12:55",
        "to":  "2026-06-19 13:35",
        "type":  "tow_in",
        "vessel":  "DUY BINH 25",
        "customer":  "CÔNG TY CP CẢNG DỊCH VỤ DẦU KHÍ TỔNG HỢP PHÚ MỸ (PTSC PM)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22656"
    },
    {
        "id":  "TT-22655-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-21 07:50",
        "to":  "2026-06-21 09:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 56-06/ SC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-031"
    },
    {
        "id":  "TT-22655-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-21 07:50",
        "to":  "2026-06-21 09:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 56-06/ SC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-031"
    },
    {
        "id":  "TT-22654-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-21 00:00",
        "to":  "2026-06-21 00:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-031"
    },
    {
        "id":  "TT-22654-2",
        "tugId":  "VNL 05",
        "from":  "2026-06-21 00:00",
        "to":  "2026-06-21 00:45",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-031"
    },
    {
        "id":  "TT-22653-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-19 12:15",
        "to":  "2026-06-19 13:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-031"
    },
    {
        "id":  "TT-22653-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-19 12:15",
        "to":  "2026-06-19 13:05",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 12-01",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-031"
    },
    {
        "id":  "TT-22652-1",
        "tugId":  "VNL 03",
        "from":  "2026-06-19 11:15",
        "to":  "2026-06-19 12:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-031"
    },
    {
        "id":  "TT-22652-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-19 11:15",
        "to":  "2026-06-19 12:00",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 11-02",
        "customer":  "CÔNG TY TNHH THƯƠNG MẠI VẬN TẢI VIỆT TÍN",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-031"
    },
    {
        "id":  "TT-22651-1",
        "tugId":  "VNL 07",
        "from":  "2026-06-22 09:35",
        "to":  "2026-06-22 10:25",
        "type":  "tow_in",
        "vessel":  "LL JEANNY \u0026 LL 3027",
        "customer":  "CÔNG TY TNHH DỊCH VỤ HÀNG HẢI VÀ ĐẠI LÝ OCEANIC",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-167"
    },
    {
        "id":  "TT-22650-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-19 17:30",
        "to":  "2026-06-19 18:20",
        "type":  "tow_in",
        "vessel":  "MICLYN 2510",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22650"
    },
    {
        "id":  "TT-22649-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-20 15:30",
        "to":  "2026-06-20 14:45",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT DENALI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22649"
    },
    {
        "id":  "TT-22649-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-20 15:30",
        "to":  "2026-06-20 14:45",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT DENALI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22649"
    },
    {
        "id":  "TT-22649-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-20 15:30",
        "to":  "2026-06-20 14:45",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT DENALI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22649"
    },
    {
        "id":  "TT-22648-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-19 06:30",
        "to":  "2026-06-19 08:00",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT DENALI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22648"
    },
    {
        "id":  "TT-22648-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-19 06:30",
        "to":  "2026-06-19 08:00",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT DENALI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22648"
    },
    {
        "id":  "TT-22648-3",
        "tugId":  "VNL RUBY",
        "from":  "2026-06-19 06:30",
        "to":  "2026-06-19 08:00",
        "type":  "tow_in",
        "vessel":  "ZIM MOUNT DENALI",
        "customer":  "ZIM VIETNAM LLC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22648"
    },
    {
        "id":  "TT-22646-1",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-19 02:30",
        "to":  "2026-06-19 06:15",
        "type":  "tow_in",
        "vessel":  "TAN CANG 375",
        "customer":  "CÔNG TY CẢNG DỊCH VỤ DẦU KHÍ (PTSC SB)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22646"
    },
    {
        "id":  "TT-22643-1",
        "tugId":  "VNL 05",
        "from":  "2026-06-19 16:15",
        "to":  "2026-06-19 17:00",
        "type":  "tow_in",
        "vessel":  "TONG XIANG",
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22643"
    },
    {
        "id":  "TT-22643-2",
        "tugId":  "VNL 07",
        "from":  "2026-06-19 16:15",
        "to":  "2026-06-19 17:00",
        "type":  "tow_in",
        "vessel":  "TONG XIANG",
        "customer":  "CÔNG TY TNHH CLIO SHIPPING AND LOGISTICS VIỆT NAM - INC",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-22643"
    },
    {
        "id":  "TT-21646-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-22 08:10",
        "to":  "2026-06-22 10:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-05/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-21646-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-22 08:10",
        "to":  "2026-06-22 10:40",
        "type":  "tow_in",
        "vessel":  "VIET THUAN 80-05/ FC",
        "customer":  "CÔNG TY CỔ PHẦN HÀNG HẢI TIÊN PHONG (TIMACO)",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-096"
    },
    {
        "id":  "TT-21637-1",
        "tugId":  "VNL FUTURE",
        "from":  "2026-06-26 00:50",
        "to":  "2026-06-26 02:30",
        "type":  "tow_in",
        "vessel":  "UNITY MARIA/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-21637-2",
        "tugId":  "TAN CANG 86",
        "from":  "2026-06-26 00:50",
        "to":  "2026-06-26 02:30",
        "type":  "tow_in",
        "vessel":  "UNITY MARIA/ SC",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI SUNRISE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-094"
    },
    {
        "id":  "TT-21594-1",
        "tugId":  "TAN CANG 86",
        "from":  "2026-07-05 06:05",
        "to":  "2026-07-05 08:35",
        "type":  "tow_in",
        "vessel":  "OCEAN DALIAN/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-21594-2",
        "tugId":  "VNL RUBY",
        "from":  "2026-07-05 06:05",
        "to":  "2026-07-05 08:35",
        "type":  "tow_in",
        "vessel":  "OCEAN DALIAN/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-097"
    },
    {
        "id":  "TT-21575-1",
        "tugId":  "VNL EXPLORER",
        "from":  "2026-06-20 07:05",
        "to":  "2026-06-20 09:10",
        "type":  "tow_in",
        "vessel":  "SHI DAI 11/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-21575-2",
        "tugId":  "VNL VOYAGER",
        "from":  "2026-06-20 07:05",
        "to":  "2026-06-20 09:10",
        "type":  "tow_in",
        "vessel":  "SHI DAI 11/ FC",
        "customer":  "CÔNG TY TNHH TREE MARINE",
        "status":  "done",
        "revenue":  "0 ₫",
        "linkJobId":  "2606-064"
    },
    {
        "id":  "TT-20173-1",
        "tugId":  "VNL RELIANCE",
        "from":  "2026-04-28 18:00",
        "to":  "2026-07-13 02:00",
        "type":  "tow_in",
        "vessel":  "HĐ: 093-26/BDV/TOS-VNL",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-20173"
    },
    {
        "id":  "TT-19953-1",
        "tugId":  "VNL VISION",
        "from":  "2026-04-10 12:00",
        "to":  "2026-06-30 12:00",
        "type":  "tow_in",
        "vessel":  "HĐ: 093-26/BDV/TOS-VNL",
        "customer":  "CÔNG TY CỔ PHẦN DỊCH VỤ HÀNG HẢI THIÊN NAM (TOS)",
        "status":  "done",
        "revenue":  "0 ₫",
        "dvhhId":  "DV-19953"
    }
];

Object.assign(window, {
  PEOPLE, ME, personById,
  OCC_WINDOW, OCC_BERTHS, OCC_TUGS, OCC_CRANES, OCC_JOBS, OCC_DVHH, occDayFrac, occColToDate, occColForDate,
  OCC_TUG_TASKS, OCC_TUG_TASK_TYPES,
});