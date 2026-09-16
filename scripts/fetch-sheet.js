/* Lấy bảng "Danh mục thiết bị" từ Google Sheets về một file JSON để
   export-occ-data.ps1 trộn vào data.jsx.

   CHẠY:  node scripts/fetch-sheet.js --out <duong-dan-file-json>

   XÁC THỰC: dùng service account. File khoá JSON phải nằm NGOÀI repo
   (repo này public). Đường dẫn lấy theo thứ tự:
     1. tham số  --key <duong-dan>
     2. biến môi trường  OCC_SHEETS_KEY
     3. mặc định  %LOCALAPPDATA%\ITOS-OCC\google-sheets-key.json

   MÃ THOÁT:  0 = xong · 2 = chưa có file khoá (bỏ qua, không phải lỗi) · 1 = lỗi

   CHỈ LẤY các cột cần cho dashboard. Cố tình BỎ QUA image/link (link OneDrive
   nội bộ) và mọi cột chứa email — data.jsx nằm trong repo public. */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const SPREADSHEET_ID = "1jhWO959KfEifWwNiUgl6CynUvgptgHROW-1V-MBsQRg";
const PREFERRED_GID = 1884868407;      // tab trong link người dùng gửi
const HEADER_KEY = "equipment_id";     // dùng để nhận diện đúng tab / đúng dòng tiêu đề
const SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

// Cột giữ lại -> tên field trong data.jsx
const KEEP = {
  equipment_id: "id",
  name: "name",
  equipment_detail: "detail",
  status: "status",
  category: "category",
  offline_since: "offlineSince",
};

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i > -1 ? process.argv[i + 1] : null;
}

function keyPath() {
  return (
    arg("--key") ||
    process.env.OCC_SHEETS_KEY ||
    path.join(process.env.LOCALAPPDATA || "", "ITOS-OCC", "google-sheets-key.json")
  );
}

function fail(msg, code = 1) {
  process.stderr.write(msg + "\n");
  process.exit(code);
}

// --- OAuth2: tự ký JWT rồi đổi lấy access token ---
async function getAccessToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claim = {
    iss: key.client_email,
    scope: SCOPE,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const body = `${b64(header)}.${b64(claim)}`;
  const sig = crypto.createSign("RSA-SHA256").update(body).sign(key.private_key, "base64url");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${body}.${sig}`,
    }),
  });
  const json = await res.json();
  if (!res.ok) fail(`Không lấy được access token (HTTP ${res.status}): ${JSON.stringify(json)}`);
  return json.access_token;
}

async function api(url, token) {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const json = await res.json();
  if (!res.ok) {
    const m = json?.error?.message || JSON.stringify(json);
    if (res.status === 403 || res.status === 404) {
      fail(
        `Google trả về HTTP ${res.status}: ${m}\n` +
        `Kiểm tra: đã chia sẻ sheet cho service account chưa, và đã bật Google Sheets API chưa?`
      );
    }
    fail(`Google API lỗi HTTP ${res.status}: ${m}`);
  }
  return json;
}

(async () => {
  const kp = keyPath();
  if (!fs.existsSync(kp)) {
    process.stderr.write(`Chưa có file khoá Google '${kp}' — bỏ qua phần Google Sheets.\n`);
    process.exit(2);
  }

  let key;
  try {
    key = JSON.parse(fs.readFileSync(kp, "utf8"));
  } catch (e) {
    fail(`File khoá '${kp}' không phải JSON hợp lệ: ${e.message}`);
  }
  if (!key.client_email || !key.private_key) {
    fail(`File khoá '${kp}' thiếu client_email hoặc private_key.`);
  }

  const token = await getAccessToken(key);

  // 1. Tìm đúng tab: ưu tiên gid trong link, không thấy thì tìm tab có cột equipment_id
  const meta = await api(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties(sheetId,title)`,
    token
  );
  const sheets = (meta.sheets || []).map((s) => s.properties);
  if (!sheets.length) fail("Không đọc được danh sách tab của spreadsheet.");

  let tab = sheets.find((s) => s.sheetId === PREFERRED_GID);
  let rows = null;

  const fetchRows = async (title) => {
    const r = await api(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/` +
        `${encodeURIComponent(title)}?majorDimension=ROWS`,
      token
    );
    return r.values || [];
  };

  const headerIndex = (vals) =>
    vals.findIndex((row) => row.some((c) => String(c).trim().toLowerCase() === HEADER_KEY));

  if (tab) {
    rows = await fetchRows(tab.title);
    if (headerIndex(rows) < 0) tab = null;   // gid trỏ tới tab khác -> tìm tiếp
  }
  if (!tab) {
    for (const s of sheets) {
      const vals = await fetchRows(s.title);
      if (headerIndex(vals) >= 0) { tab = s; rows = vals; break; }
    }
  }
  if (!tab) fail(`Không tìm thấy tab nào có cột '${HEADER_KEY}' trong spreadsheet.`);

  // 2. Đổi các dòng thành object theo tiêu đề, chỉ giữ cột trong KEEP
  const h = headerIndex(rows);
  const header = rows[h].map((c) => String(c).trim().toLowerCase());
  const cols = Object.keys(KEEP)
    .map((k) => ({ from: header.indexOf(k), to: KEEP[k] }))
    .filter((c) => c.from >= 0);

  const items = [];
  for (let i = h + 1; i < rows.length; i++) {
    const row = rows[i] || [];
    const o = {};
    for (const c of cols) o[c.to] = String(row[c.from] ?? "").trim();
    if (!o.id) continue;                       // bỏ dòng trống / dòng phân cách
    items.push(o);
  }

  const out = {
    fetchedAt: new Date().toISOString(),
    spreadsheetId: SPREADSHEET_ID,
    tab: { title: tab.title, sheetId: tab.sheetId },
    count: items.length,
    items,
  };

  const outPath = arg("--out");
  if (outPath) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
    process.stderr.write(`Đã lấy ${items.length} thiết bị từ tab '${tab.title}' -> ${outPath}\n`);
  } else {
    process.stdout.write(JSON.stringify(out, null, 2));
  }
})().catch((e) => fail(e.stack || String(e)));
