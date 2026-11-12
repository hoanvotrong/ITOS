# Điều độ khai thác — bản chạy thử 1 job (pilot)

Port từ prototype TTOS v61 (11/11/2026), BRD Điều độ khai thác v2.6. Chung tên miền với Kho (`/warehouse`) và OCC.
React 18 UMD + Babel standalone, không npm / bundler. Dùng chung project Supabase và `../warehouse/config.js` (chỉ khoá anon).

| Trang | Ai dùng | Đăng nhập |
|---|---|---|
| `index.html` | KHTH, Trưởng phòng (TP), ĐPVT | Supabase Auth + có trong `dd_users` |
| `tally.html` | Tài khoản tally ca × dịch vụ | Supabase Auth, `dd_users.role = TALLY` |
| `taixe.html` | Tài xế xe ngoài | Biển số + mã lệnh ca, không tài khoản (3 hàm RPC) |

## Cài đặt Supabase

1. SQL Editor → chạy toàn bộ `supabase/schema.sql` (chạy lại được, không đụng bảng của Kho).
2. Authentication → Users → Add user (tick Auto Confirm User) cho từng người.
3. Thêm vào `dd_users` (xem cuối `schema.sql`). Vai trò: `KHTH`, `TP`, `TALLY` (kèm `tally_acc`: `tc-icd-1`, `tc-icd-2`, `tc-bp-1`, `tc-bp-2`), `DPVT`, `TAIXE`.
4. Nạp danh mục thật vào `dd_catalog` (kind: `customer`, `berth`, `vehicle`, `equip`, `line`). **Không commit danh mục / dữ liệu thật** — repo công khai.

## Dữ liệu và đồng bộ (`js/sync.js`)

- Mỗi phần tử của các mảng toàn cục (`DD_JOBS`, `DD_ORDERS`…) là một dòng `dd_docs(coll, id, data)`.
- Sau mỗi thao tác và mỗi 4 giây: so sánh từng phần tử với lần đồng bộ trước → upsert phần thay đổi. Thiết bị khác nhận qua Realtime.
- Mất mạng: thay đổi giữ trong localStorage, tự gửi khi có mạng / mở lại trang. Ảnh chưa tải lên được chỉ giữ trong bộ nhớ (đóng trang là mất).
- Thời gian: trong mã dạng `dd/mm/yyyy HH:mm` GMT+7; trong CSDL ISO UTC.

## Giới hạn đã chấp nhận cho pilot

- **Ghi đè: bản ghi sau thắng, theo cả phần tử.** Hai thiết bị sửa cùng một job trong vài giây (VD tally Gate Out đúng lúc tài xế gắn cont) có thể làm mất thay đổi của bên ghi trước.
- Phân quyền: chỉ chặn theo trang (KHTH/TP/ĐPVT vs tally) và nút duyệt ngoại lệ (chỉ TP). Ma trận chi tiết BRD mục VII chưa áp dụng.
- RLS cho mọi thành viên `dd_users` đọc / ghi `dd_docs`; chỉ KHTH / TP sửa `dd_catalog`.
- Không làm: Cổng đối tác, Kho nhúng, Depot, cân treo / cầu cân, E-Office, nhắc NV KD, khách hàng tạm (FR-DP-09). Dịch vụ GTGT bãi chưa lưu CSDL.
- Người xử lý sự cố chỉ chọn trong `dd_users`.

## Khác prototype

- **Sản lượng luôn 2 chữ số thập phân** (`ddQty`, `DdQtyInput` trong `js/shared.jsx`): nhập được phần thập phân với mọi đơn vị, hiển thị dạng `1.234,50`. Riêng số cont là số nguyên.
- **Duyệt sản lượng theo ca cho mọi dịch vụ** (prototype chỉ Bến phao): bản ghi trong ca ở trạng thái `shift` ("Trong ca"); tally bấm Kết ca → cả ca chuyển `pending` và lên màn Chờ duyệt › Sản lượng ca; văn phòng duyệt → `ok`. Job hoàn thành (tự động hoặc KHTH đánh dấu / đóng sớm) khi còn ca mở thì tự kết các ca đó.
- **Xe ngoài danh sách lệnh ca:** tally tự nhập biển số và ghi nhận sản lượng bình thường (bản ghi gắn cờ `offList`); hệ thống tự tạo 1 sự cố "Xe không có trong danh sách" / xe / lệnh về KHTH. Ở màn Sự cố, KHTH bổ sung xe vào lệnh (biển số điền sẵn).
- **Nhật ký job ghi từng bước:** tạo / gửi / sửa lệnh ca, tally xem lệnh, từng bản ghi, sửa / xin sửa, báo sự cố, xe ngoài danh sách, kết ca, duyệt.

- Biển số so khớp bỏ qua khoảng trắng, dấu chấm, gạch ngang.
- Mã lệnh ca `LV-ddmmyy-nn`; mã sự cố / bản ghi / gate dạng `TIỀNTỐ-ddmm-HHmm-xxx` để không trùng giữa thiết bị.
- Tally vẫn thấy lệnh ngày trước chưa kết ca (ca qua nửa đêm).
- Web tài xế chỉ còn tab Xe ngoài; hỏi lại máy chủ mỗi 15 giây; sai mã 10 lần / 15 phút thì khoá.

## Kiểm tra đã chạy

- `schema.sql` trên Postgres (PGlite) với giả lập auth/storage: 30/30 (RLS, 3 hàm tài xế, khoá thử sai, ảnh).
- Kịch bản A bước 1–17 trên 3 tab (KHTH / tally / tài xế) với Supabase giả lập: đạt (bước 10 chưa kiểm vì job thử không có seal kế hoạch).
- Supabase thật: anon bị từ chối đọc `dd_docs`, `dd_users`, `dd_catalog`, `dd_driver_check`; RPC tài xế trả lời đúng.
