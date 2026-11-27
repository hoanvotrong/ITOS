# Tổng hợp thay đổi — Module Điều độ khai thác (bản chạy thử) so với prototype TTOS v61

Thời gian: 11/11/2026 → 26/11/2026 · Repo `hoanvotrong/ITOS`, thư mục `dieudo/` · Đã chạy trên GitHub Pages.
Nguồn gốc: gói bàn giao `DieuDo_ChayThu_v61` (HUONG_DAN_CLAUDE_CODE.md, prototype_v61, supabase_dieudo.sql, KICH_BAN_CHAY_THU.md).
Dùng tài liệu này để đồng bộ lại prototype / BRD Điều độ khai thác v2.6.

---

## 1. Quyết định đã chốt khi triển khai

| Câu hỏi (mục 8 hướng dẫn) | Quyết định |
|---|---|
| Kho đăng nhập Supabase thế nào? | Kho dùng **Supabase Auth (email + mật khẩu) + bảng `app_users` + RLS**. Điều độ dùng chung project và cấu hình với Kho. |
| Phân quyền Điều độ | **Bảng `dd_users` riêng** (email, tên, vai trò, tài khoản tally ca). Không lấy vai trò từ `user_metadata` (người dùng tự sửa được → tự nâng quyền). Tài khoản Kho không thấy dữ liệu Điều độ. |
| Đường dẫn | `…/ITOS/dieudo/` (index = KHTH/TP, `tally.html`, `taixe.html`) |
| Job chạy thử | ICD container, có xe ngoài, không có vận tải VNL |
| Admin | Tài khoản admin của Kho (`app_users.role = admin`) = Trưởng phòng (TP) bên Điều độ |

Vai trò trong `dd_users`: `KHTH`, `TP` (Trưởng phòng — duyệt ngoại lệ, làm được mọi việc của KHTH), `TALLY` (kèm `tally_acc`: `tc-icd-1`, `tc-icd-2`, `tc-bp-1`, `tc-bp-2`), `DPVT`, `TAIXE`.

---

## 2. Kiến trúc (giữ cách dựng của prototype)

- React 18 UMD + Babel standalone, không npm/bundler. Mã module giữ nguyên các file `dd.jsx, tally.jsx, ops.jsx, gate.jsx, river.jsx, yard.jsx, vt.jsx, svc.jsx`; bỏ `bridge.jsx, partner.jsx, kho_embed.jsx, occ.jsx, mockdata.jsx, appshell.jsx`.
- Trạng thái vẫn là **mảng / đối tượng toàn cục** (`DD_JOBS`, `DD_ORDERS`, `DD_RECORDS`…). Thêm lớp đồng bộ `js/sync.js`:
  - Mỗi phần tử = 1 dòng `dd_docs(coll, id, data jsonb)`; danh mục ở `dd_catalog(kind, id, data)`.
  - Sau mỗi thao tác và mỗi 4 giây: so sánh JSON từng phần tử → upsert phần đổi. Thiết bị khác nhận qua Realtime, cập nhật tại chỗ.
  - Mất mạng: thay đổi giữ trong máy, tự gửi khi có mạng. **Ghi đè: bản ghi sau thắng (theo cả phần tử).**
  - Thời gian: trong mã `dd/mm/yyyy HH:mm` GMT+7; trong CSDL ISO UTC.
- Tài xế xe ngoài không tài khoản: 3 hàm RPC `dd_driver_login / attach / unassign` (khoá anon chỉ gọi được 3 hàm này, không đọc bảng). Sai mã 10 lần / 15 phút → khoá.
- Ảnh thật (gắn cont, sự cố): Storage bucket private `dieudo-photos`; tài xế chỉ được tải lên thư mục `driver/`.

---

## 3. Thay thế bắt buộc so với prototype (theo hướng dẫn)

| Prototype | Bản chạy thử |
|---|---|
| `DD_TODAY = "02/11/2026"`, `tlClock()`, `RV_NOW` (giờ giả lập) | Giờ thật GMT+7 |
| `DD_ME = DD_PEOPLE[0]`, chọn tài khoản tally giả lập | Người đăng nhập thật; tally đăng nhập bằng tài khoản ca |
| Nút "Xem với vai trò (prototype)", "(Demo TP) Duyệt" | Theo vai trò thật; chỉ TP thấy nút duyệt ngoại lệ |
| Mật khẩu tài xế VNL không kiểm tra | Bỏ tab tài xế VNL (pilot không có vận tải VNL); chỉ còn xe ngoài |
| Nút "Lấy số từ cân treo / cầu cân (giả lập)" | Ẩn |
| `ddDrvCode()` băm theo id | 6 số ngẫu nhiên, không trùng mã đang hiệu lực |
| Dữ liệu mẫu (job, lệnh, bản ghi, sự cố, bãi, sà lan, vận tải…) | Bỏ hết; dữ liệu thật từ Supabase |
| `KD_CUSTOMERS`, OCC_BERTHS/CRANES mẫu | Danh mục `dd_catalog`: khách hàng (287, từ file CompanyInfo), bến phao (OCC) + bến ICD VNL-01/02/03/05/06/07, cẩu/xe nâng/gàu ngoạm/xe đầu kéo (lấy từ OCC_EQUIPMENT, bỏ thiết bị OFFLINE) |
| Ngoại lệ chưa HĐ đẩy E-Office (`bridge.jsx`) | TP duyệt ngay ở màn Chờ duyệt › Ngoại lệ |
| Nhắc NV KD tự động | Bỏ (PTKD chưa kết nối) |

---

## 4. Thay đổi nghiệp vụ / quy tắc (cần cập nhật BRD & prototype)

### 4.1 Sản lượng
1. **Sản lượng luôn 3 chữ số thập phân** với mọi đơn vị (nhập và hiển thị `1.234,500`; trước PR #20 là 2 chữ số). Riêng **số cont là số nguyên**. Áp dụng: keypad tally (cân xe, bill, nhập tay), khối lượng kế hoạch, mục tiêu ca, lũy kế job, số tịnh khi cân, sửa khi duyệt, mọi màn hiển thị.
2. **Duyệt sản lượng theo ca cho MỌI dịch vụ** (prototype: chỉ Bến phao — US-BP-03):
   - Bản ghi trong ca: trạng thái mới **"Trong ca"** (`shift`).
   - Tally bấm **Kết ca** → toàn bộ bản ghi của ca chuyển **"Chờ duyệt"** (`pending`) → màn Chờ duyệt › **Sản lượng ca** → văn phòng duyệt (`ok`) hoặc đánh dấu "Cần xem lại".
   - Sản lượng vẫn cộng vào luỹ kế job ngay khi tally ghi (để theo dõi), duyệt là chốt chính thức.
   - **Job hoàn thành khi còn ca mở** (tự động khi đủ cont, KHTH "Đánh dấu hoàn thành", "Đóng sớm") → tự kết các ca đó để sản lượng lên Chờ duyệt.

### 4.2 Kết ca — hàng container
3. **Chưa hạ bãi thì chưa kết ca:** cont đã Gate In trong ca mà chưa có vị trí bãi → tally và KHTH không kết ca được; màn kết ca liệt kê cont còn thiếu + nút **Hạ bãi ngay**. Job tự hoàn thành cũng không tự kết ca có cont chưa hạ bãi.

### 4.3 Xe ngoài danh sách lệnh ca (mới)
4. Ở bước chọn xe (hàng rời và Gate In/Out cont), tally bấm **"+ Xe không có trong danh sách · nhập biển số"** → nhập biển (+ nhà xe, không bắt buộc) → **ghi nhận sản lượng bình thường**.
   - Hệ thống **tự tạo sự cố "Xe không có trong danh sách" về KHTH** — 1 lần / xe / lệnh ca. Bản ghi gắn cờ `offList`, Chờ duyệt hiện nhãn "Xe ngoài DS".
   - Xe đó hiện trong danh sách cho các chuyến sau (nhãn "Ngoài danh sách · đã báo KHTH"). Lưu ở `orders.extraVeh[]`.
   - Màn Sự cố của KHTH: biển số điền sẵn để "Thêm vào lệnh ca & đóng sự cố".
   - (Prototype cũ: nút này chỉ mở form báo sự cố, không cho ghi sản lượng.)

### 4.4 Nhật ký job ghi từng bước (mới)
5. `jobs.log` ghi: tạo / gửi / sửa lệnh ca (kèm mã tài xế), tally xem lệnh, **từng bản ghi** (ghi nhận / Gate In-Out kèm xe), sửa & xin sửa bản ghi, báo sự cố, xe ngoài danh sách, **hạ bãi / đảo chuyển**, kết ca (số bản ghi + tổng sản lượng gửi duyệt), duyệt.

### 4.5 Hợp đồng
6. PTKD chưa kết nối → hợp đồng nhập vào `dd_catalog` (kind = `contract`): `{ id, customer, title, from, to, services, note }`. Trạng thái tính theo ngày (đang hiệu lực / sắp hết hạn < 30 ngày / hết hạn). Form tạo job và "Gắn HĐ" đọc danh sách này. Có 1 HĐ mẫu `HĐ-2026-TCIT-01` cho khách TCIT.

### 4.6 Phân công xử lý sự cố
7. Danh sách người xử lý = người dùng Điều độ trong `dd_users` (trừ tài khoản tally ca). Prototype dùng người mẫu cố định (kỹ thuật, QHSE) — chưa có trong pilot.

### 4.7 Hàng rời — cách ghi nhận từng chuyến (mới)
8. Thêm cách ghi nhận **"Số trên bill nhà máy"** bên cạnh các cách cũ (đổi tên cân xe thành "Cân xe qua cầu cân"; móc cẩu nổi, đếm, nhập tay giữ nguyên).
   - **Tally chọn cách cho từng chuyến**; cách mặc định của job được chọn sẵn. Chuyến theo bill **bắt buộc nhập số bill**.
   - Cách ghi nhận và số bill lưu trên bản ghi (`meth`, `billNo`), hiện ở Bản ghi ca, Chờ duyệt và nhật ký job.

### 4.8 Lệnh làm việc ca — mục tiêu không bắt buộc
9. **Mục tiêu sản lượng ca không bắt buộc**: lưu / gửi lệnh được khi để trống. Các màn (tally, chi tiết job, lịch tuần, Chờ duyệt, màn dịch vụ) hiện "—" / "chưa đặt" và bỏ % + thanh tiến độ khi không có mục tiêu.

### 4.9 Sửa job sau khi tạo (mới)
10. Nút **"Sửa job"** ở chi tiết job (job Kế hoạch / Đang thực hiện; KHTH và TP):
    - Sửa: hàng, thời gian, bến, bãi, tàu / phương tiện KH, KHTH phụ trách, ghi chú.
    - Hàng rời: thêm khối lượng kế hoạch, cách ghi nhận mặc định; **đơn vị** chỉ sửa được khi chưa có bản ghi.
    - Hàng cont: sửa loại / mã booking / tình trạng của cont **chưa làm**.
    - **Khoá**: khách hàng, dịch vụ, loại hàng (rời / cont).
    - Mỗi thay đổi ghi vào nhật ký job dạng cũ → mới; job đang thực hiện thì **bắt buộc nhập lý do**.

### 4.10 Bãi container ICD
11. **Tối đa 5 tầng** (trước giả định 4): xếp bãi trên tally, chọn tầng trên sơ đồ, kiểm tra chồng cont đều theo `YD_TIERS = 5`.
12. **Cont 40' / 45' vẽ thành 1 khối** phủ 2 ô 20' liền nhau trên sơ đồ block (nhãn 40 / 45 + đuôi số cont); 45' viền nét đứt; có chú thích. Đánh số hàng liên tục 01, 02, 03…; sức chứa giữ theo bản vẽ (box × 2 = 12.386 TEU).
13. Mã ISO cont 45' thật (`L5G1`, `L5GP`, …) → **45HC**; `45G1` / `45GP` vẫn là **40' cao** (40HC).

---

## 5. Thay đổi giao diện / thao tác

| Màn | Thay đổi |
|---|---|
| Tạo job · bảng kiểm tra danh sách cont | **Sửa loại từng cont** (ô chọn ở cột "ISO · loại"). Thêm loại 45HC, 20OT, 40OT, 20FR, 40FR, 20TK. |
| Tạo job · nhập Excel cont | Nhận thêm mã hãng: HDM/HMM/HDMU → HMM; OOCL/OOLU; ZIM/ZIMU; PIL/PCIU; SITC/SITU; KMTC/KMTU. |
| Tạo job · file mẫu cont | Thêm 2 cột **Tình trạng cont** và **Mã booking** (sau "Số seal"); sửa được ở bảng kiểm tra, lưu trên từng cont (`cond`, `booking`), hiện dưới số cont ở chi tiết job. File cũ 12 cột vẫn nhập được. |
| Tạo job | Ngày mặc định = hôm nay → +4 ngày; bến mặc định = bến đầu danh mục. Mã job `JOB-yyyy-nnnn` theo năm hiện tại. |
| Lệnh làm việc ca | Danh sách ngày = hôm nay + 6 ngày (nhãn thứ tính theo ngày thật); màn tuần bắt đầu thứ Hai tuần hiện tại. Mã lệnh `LV-ddmmyy-nn`. |
| Chi tiết job · bảng lệnh ca | Tách cột Tally (tên tài khoản ca) / Thiết bị / Phương tiện; Phương tiện hiện số xe + 3 biển đầu + "+N xe" (mở/thu gọn). Xe ngoài tô cam. |
| App tally · chọn xe | **Ô tìm biển số** (khớp một phần, bỏ khoảng trắng/chấm/gạch). Không tìm thấy → biển vừa gõ điền sẵn vào "Xe không có trong danh sách". |
| App tally · Gate In/Out, Đảo chuyển; Web tài xế · chọn cont | **Bỏ bàn phím số trên màn**, thay bằng ô nhập thật (bàn phím điện thoại); tìm theo số cont đầy đủ/đuôi hoặc biển xe đã gắn. |
| App tally · danh sách lệnh | Lệnh ngày trước chưa kết ca vẫn hiện (ca qua nửa đêm). Thứ trong tuần theo ngày thật. Thanh trạng thái: trạng thái đồng bộ + Đăng xuất. |
| App Tally / Web tài xế phía KHTH | Bỏ điện thoại giả lập; thay bằng thẻ "Mở App Tally" / "Mở web tài xế" (link). |
| Web tài xế xe ngoài | Biển số so khớp bỏ khoảng trắng/chấm/gạch ("51c 888 21" = "51C-888.21"). Hỏi lại máy chủ mỗi 15 giây → báo "Phiên đăng nhập đã hết hạn" khi kết ca / job xong / đổi mã. |
| Toàn module | Mã sự cố / bản ghi / gate dạng `TIỀNTỐ-ddmm-HHmm-xxx` (không trùng giữa thiết bị). Ẩn Kho, Depot, Cổng đối tác, đăng ký lượt cập nhà sà lan. |

---

## 6. Chưa làm / giới hạn của bản chạy thử

- Ma trận phân quyền chi tiết (BRD mục VII) chưa áp dụng — chỉ chặn theo trang và nút duyệt ngoại lệ (TP).
- Ghi đè "bản ghi sau thắng" theo cả phần tử: 2 thiết bị sửa cùng job trong vài giây có thể mất thay đổi của bên ghi trước.
- Chưa kết nối cân treo / cầu cân, E-Office, PTKD (khách hàng tạm FR-DP-09, báo giá), Kho nhúng, Depot.
- Dịch vụ GTGT ở bãi chưa lưu CSDL; ảnh chưa tải lên khi mất mạng chỉ giữ trong bộ nhớ.
- Sửa job không đổi được khách hàng / dịch vụ / loại hàng; không thêm / bớt cont của job.
- Sơ đồ bãi: còn giả định chưa xác nhận — 4 cột mỗi hàng, block lạnh B1–B3, khu E chỉ cont rỗng.
- Xin sửa bản ghi chỉ đổi số, chưa có thao tác xoá bản ghi trên giao diện (xoá phải qua SQL của quản trị).
- Vận tải VNL / tài xế VNL chưa dùng (job chạy thử không có).

---

## 7. Lịch sử PR (đã merge vào `master`)

| PR | Nội dung |
|---|---|
| #2 | Bản chạy thử 1 job: port prototype v61, đồng bộ Supabase, `dd_users`, RPC tài xế, ảnh |
| #3 | Sản lượng 2 chữ số thập phân; duyệt sau khi kết ca (mọi dịch vụ) |
| #4 | Xe ngoài danh sách; nhật ký job từng bước; tự kết ca khi job hoàn thành |
| #5 | Chưa hạ bãi thì chưa kết ca; sửa loại từng cont khi tạo job |
| #6 / #7 | Mã hãng HMM…; hợp đồng trong danh mục (kind = contract) |
| #8 | Tìm biển số ở bước chọn xe của tally |
| #9 | Gọn bảng lệnh ca; phân công sự cố theo người dùng thật |
| #10 | Ô nhập số cont bằng bàn phím điện thoại |
| #15 | File mẫu cont thêm cột Tình trạng cont và Mã booking |
| #16 | Hàng rời ghi nhận theo cân xe hoặc bill nhà máy, tally chọn từng chuyến |
| #17 | Mục tiêu sản lượng ca không bắt buộc |
| #18 | Sửa job sau khi tạo |
| #19 | Bãi cont 5 tầng; cont 40'/45' vẽ thành 1 khối; mã ISO 45' |
| #20 | Sản lượng 3 chữ số thập phân |

Kiểm tra: SQL chạy thử trên Postgres (30/30 mục RLS, hàm tài xế, ảnh); giao diện chạy thử với Supabase giả lập (kịch bản A bước 1–17 + từng thay đổi); Supabase thật: khoá anon không đọc được `dd_docs`, `dd_users`, `dd_catalog`.
