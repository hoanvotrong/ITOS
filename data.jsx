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
 * Xuất tự động từ database ETVNL lúc 2026-08-03 13:55 bởi scripts/export-occ-data.ps1
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
    "todayHour":  13.92
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

const occDayFrac = (str) => {
  if (!str) return null;
  const [d, t] = str.split(" ");
  const [y, mo, da] = d.split("-").map(Number);
  const [h, m] = t.split(":").map(Number);
  // Số ngày tính từ ngày 1 của THÁNG ĐANG XEM (OCC_WINDOW), có tính đúng năm/tháng
  // thực của mốc thời gian — không chỉ lấy "ngày trong tháng" như trước (bug cũ
  // khiến job/task vắt qua ranh giới tháng bị vẽ sai vị trí, ví dụ ETA 27/07 bị
  // hiểu nhầm thành ngày 27 của tháng đang xem dù đó là tháng trước).
  const refStart = Date.UTC(OCC_WINDOW.year, OCC_WINDOW.month - 1, 1);
  const thisDay = Date.UTC(y, mo - 1, da);
  const dayOffset = Math.round((thisDay - refStart) / 86400000);
  return (dayOffset + 1) + (h + m / 60) / 24;
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
        "from":  "2026-08-02 16:00",
        "to":  "2026-08-02 17:00",
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
        "to":  "2026-08-02 15:00",
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
        "from":  "2026-08-02 07:00",
        "to":  "2026-08-02 12:00",
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
        "to":  "2026-08-02 12:00",
        "tugs":  [
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
        "from":  "2026-08-02 16:00",
        "to":  "2026-08-02 17:00",
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
        "from":  "2026-08-02 16:00",
        "to":  "2026-08-02 17:00",
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
        "to":  "2026-08-02 15:00",
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
        "to":  "2026-08-02 15:00",
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
        "from":  "2026-08-02 07:00",
        "to":  "2026-08-02 12:00",
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
        "from":  "2026-08-02 07:00",
        "to":  "2026-08-02 12:00",
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
        "from":  "2026-08-02 07:00",
        "to":  "2026-08-02 12:00",
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
        "tugId":  "VNL RUBY",
        "from":  "2026-08-02 00:00",
        "to":  "2026-08-02 12:00",
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
    }
];

Object.assign(window, {
  PEOPLE, ME, personById,
  OCC_WINDOW, OCC_BERTHS, OCC_TUGS, OCC_CRANES, OCC_JOBS, OCC_DVHH, occDayFrac,
  OCC_TUG_TASKS, OCC_TUG_TASK_TYPES,
});