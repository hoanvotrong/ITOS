/* Tàu đang cập CẦU BẾN cảng Hưng Thái — NHẬP TAY.

   VÌ SAO PHẢI NHẬP TAY: phần mềm đã có sẵn module cầu bến (bảng BerthInfo có
   BẾN 1, 2, 3, 4, 5, 5.2, 7) nhưng các bảng dữ liệu đi kèm đều RỖNG — chưa ai
   nhập: BerthBooking 0 dòng, LoadingUnloading 0 dòng, CargoBooking 0 dòng.
   Chừng nào bộ phận điều độ bắt đầu dùng module đó thì bỏ file này đi, script
   export sẽ lấy tự động và không phải gõ gì nữa.

   CÁCH DÙNG: thêm một dòng cho mỗi tàu đang ở cầu, tàu rời thì xoá dòng đó.
   Sửa xong commit + push là website cập nhật.

     berth   : tên cầu, nên dùng đúng tên trong hệ thống — "BẾN 1".."BẾN 7"
     vessel  : tên tàu
     voyage  : số chuyến (để trống nếu không có)
     cargo   : mô tả hàng, vd "Than đá · 12.000 MT"
     cranes  : các cẩu bờ đang phục vụ, theo mã trong HT_SHORE_CRANES
               ("VNL-01".."VNL-08"). Tàu được vẽ trải theo đúng các cẩu này.
     eta/etd : "YYYY-MM-DD HH:mm", để trống nếu chưa biết
     status  : "working" đang làm hàng · "berthed" đã cập, chưa làm · "departing" chuẩn bị rời */
const HT_QUAY_VESSELS = [
  // { berth: "BẾN 3", vessel: "HT GLORY", voyage: "V.2641N", cargo: "Than đá · 12.000 MT",
  //   cranes: ["VNL-03", "VNL-05"], eta: "2026-10-14 06:00", etd: "", status: "working" },
];

Object.assign(window, { HT_QUAY_VESSELS });
