# Cài dữ liệu dùng chung (Supabase)

Khi `config.js` có cấu hình Supabase, mọi người đăng nhập và dùng chung một bộ dữ liệu, cập nhật tức thì.
Để trống `config.js` thì ứng dụng chạy chế độ lưu riêng trên trình duyệt như trước.

## 1. Tạo project (một lần)

1. Đăng ký / đăng nhập https://supabase.com → **New project**.
   - Region: **Southeast Asia (Singapore)**.
   - Database password: tự đặt, lưu lại (không cần gửi cho ai).
2. **SQL Editor → New query**: dán toàn bộ nội dung `schema.sql` → **Run**.
3. Thêm quản trị viên (đổi email):
   ```sql
   insert into app_users (email, role) values ('ban@congty.vn', 'admin')
   on conflict (email) do update set role = excluded.role;
   ```
4. **Authentication → Sign In / Providers → Email**: tắt **Confirm email** (tài khoản do quản trị tạo sẵn, không cần gửi email xác nhận).
5. **Project Settings → API**: chép **Project URL** và khóa **anon / publishable** vào `config.js`.
   Không dùng khóa **service_role / secret**.

## 2. Thêm người dùng

Mỗi người cần cả hai bước:

1. **Authentication → Users → Add user → Create new user**: nhập email + mật khẩu, tick **Auto Confirm User**.
2. **SQL Editor**:
   ```sql
   insert into app_users (email, role) values ('nhanvien@congty.vn', 'staff');
   ```

Bỏ quyền: `delete from app_users where email = 'nhanvien@congty.vn';`

## 3. Gộp và nạp dữ liệu người test

1. Mỗi người test (bản cũ, lưu trên trình duyệt) vào **Sao lưu dữ liệu → Tải bản sao lưu**, gửi file JSON.
2. Để các file vào thư mục **ngoài repo**, ví dụ `D:\Dự án ITOS\data-gom\` (repo đang công khai).
3. Gộp:
   ```
   node warehouse/tools/merge-backups.mjs "D:\Dự án ITOS\data-gom"
   ```
   Kết quả: `merged.json` và `merged-report.txt` (khách hàng trùng mã khác tên, khu đổi mã, khu chồng nhau, lô âm tồn).
4. Quản trị viên đăng nhập bản dùng chung → **Sao lưu dữ liệu → Khôi phục từ file** → chọn `merged.json`.
   Thao tác này thay toàn bộ dữ liệu dùng chung.

## Cách dữ liệu được bảo vệ

- Chỉ email trong `app_users` đọc/ghi được (Row Level Security).
- Phiếu chỉ ghi/xóa qua hàm `post_txn` / `delete_txn`: máy chủ khóa sổ, cấp số phiếu liên tục và từ chối
  nếu làm tồn của một lô bị âm ở bất kỳ ngày nào (kể cả khi hai người xuất cùng lô một lúc).
- Chỉ quản trị viên (`role = 'admin'`) được khôi phục / xóa toàn bộ dữ liệu.
- Gói miễn phí tạm dừng project nếu 7 ngày không ai dùng: vào Supabase bấm **Restore project**.
