/* Quy tắc suy theo THỜI GIAN THỰC — dùng chung cho mọi màn hình.

   VÌ SAO CẦN: trạng thái job trong DB là trạng thái BOOKING HÀNH CHÍNH
   (BookingStatusId), chỉ đổi khi điều độ bấm đóng. Thực tế nhiều booking quá
   ETD cả tuần vẫn còn "đang khai thác" — tại thời điểm viết là 5/10 job, khiến
   một bến phao hiện tới hai tàu cùng lúc.

   Quy ước: tàu CÒN Ở BẾN khi đã tới ETA và CHƯA quá ETD. Quá ETD thì coi như
   đã rời bến, nhưng KHÔNG xoá khỏi danh sách job — nó hiện ở nhóm riêng
   "Quá ETD" để điều độ biết mà đóng booking.

   Dùng đồng hồ máy người xem (không phải giờ lúc chạy export) để tàu rời bến
   ngay khi qua ETD, không phải đợi tới lần cập nhật dữ liệu kế tiếp. */

const occNow = () => {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

// Booking còn đang mở trên hệ thống (chưa tính tới giờ giấc)
const occJobOpen = (j) => j && (j.status === "in_progress" || j.status === "delayed");

// Quá ETD mà booking vẫn mở — dữ liệu cần điều độ xử lý
const occPastEtd = (j) => !!(occJobOpen(j) && j.etd && j.etd < occNow());

// Tàu thực sự đang ở bến lúc này
const occAtBerth = (j) => {
  if (!occJobOpen(j)) return false;
  const now = occNow();
  if (j.eta && j.eta > now) return false;   // chưa cập
  if (j.etd && j.etd < now) return false;   // đã quá giờ rời
  return true;
};

Object.assign(window, { occNow, occJobOpen, occPastEtd, occAtBerth });
