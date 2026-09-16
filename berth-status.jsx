/* Trạng thái bến phao — NHẬP TAY.

   DB ETVNL chưa có trường trạng thái cho bến phao, còn data.jsx bị script
   export ghi đè mỗi 8 tiếng — nên trạng thái đặc biệt khai báo ở file này.
   Script export không bao giờ ghi vào đây.

   Muốn đổi: thêm / sửa / xoá một dòng rồi commit + push.

     status : "repair" — sửa chữa / nâng cấp: tô đỏ, không tính là bến đang dùng
     label  : chữ hiển thị trên badge, VD "Đang nâng cấp"
     from   : ngày bắt đầu "YYYY-MM-DD"
     to     : ngày dự kiến xong "YYYY-MM-DD", để null nếu chưa biết */
const OCC_BERTH_STATUS = {
  "BP 11": { status: "repair", label: "Đang nâng cấp", from: "2026-09-15", to: null },
};

/* Trạng thái lấy theo thứ tự: khai báo tay ở trên TRƯỚC, không có thì lấy theo
   Google Sheet kỹ thuật (OCC_BERTHS[].status = "repair" khi sheet ghi OFFLINE). */
const occBerthStatus = (berthId) => {
  if (OCC_BERTH_STATUS[berthId]) return OCC_BERTH_STATUS[berthId];
  const b = (typeof OCC_BERTHS !== "undefined" ? OCC_BERTHS : []).find(x => x.id === berthId);
  if (b && b.status === "repair") {
    return { status: "repair", label: "Đang sửa chữa", from: (b.offlineSince || "").replace(/\//g, "-"), to: null };
  }
  return null;
};
const occBerthInRepair = (berthId) => occBerthStatus(berthId)?.status === "repair";
const occFmtDate = (s) => (s ? `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)}` : "");
