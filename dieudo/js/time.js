/* Giờ GMT+7 dùng chung cho mọi trang Điều độ (quyết định dự án: lưu UTC, hiển thị GMT+7) */
(function () {
  'use strict';
  const VN_FMT = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' });
  const WD = { Mon: 'Thứ Hai', Tue: 'Thứ Ba', Wed: 'Thứ Tư', Thu: 'Thứ Năm', Fri: 'Thứ Sáu', Sat: 'Thứ Bảy', Sun: 'Chủ Nhật' };
  window.ddVnNow = function (d) {
    const p = {}; VN_FMT.formatToParts(d || new Date()).forEach(x => { p[x.type] = x.value; });
    const date = `${p.day}/${p.month}/${p.year}`, time = `${p.hour}:${p.minute}`;
    return { date, time, at: `${date} ${time}`, weekday: WD[p.weekday] || '' };
  };
  /* "dd/mm/yyyy HH:mm" (GMT+7) ↔ ISO UTC */
  window.ddAtToIso = function (s) {
    const m = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/.exec(s); if (!m) return s;
    return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1], +m[4] - 7, +m[5])).toISOString();
  };
  window.ddIsoToAt = function (s) { const d = new Date(s); return isNaN(d) ? s : window.ddVnNow(d).at; };

})();
