# Quản Lý Chi Tiêu và Học Tập

Website tĩnh giúp sinh viên theo dõi **thu chi hằng ngày** và quản lý **bài tập, deadline, lịch tuần** ở cùng một nơi. Toàn bộ dữ liệu được lưu ngay trong trình duyệt (`localStorage`), không cần máy chủ hay tài khoản.

Bài tập nhóm gồm Hoàng, Vân, Thông và Nga.

## Tính năng

### Đăng nhập (`index.html`)
Nhập tên để vào ứng dụng. Tên được lưu trong `localStorage` và hiển thị lời chào ở Trang chủ.

### Trang chủ (`trangchu.html`)
Trang chủ hiển thị số dư hiện tại (tổng thu trừ tổng chi), tổng chi tiêu và tiến độ học tập. Trang cũng cho biết deadline gần nhất, số ngày còn lại hoặc đã quá hạn, 5 khoản chi gần đây và bảng chi tiêu theo danh mục.

### Chi tiêu (`chitieu.html`)
Có thể thêm khoản thu hoặc chi cùng nội dung, số tiền, danh mục và ngày. Số tiền được tự định dạng, ví dụ `35.000`. Danh mục chi gồm Ăn uống, Di chuyển, Học tập, Giải trí và Khác. Danh mục thu gồm Gia đình gửi, Làm thêm, Học bổng và Khác.

Phần ngân sách tháng cho phép đặt hạn mức, xem tổng chi và ước tính chi tiêu cuối tháng. Ứng dụng cảnh báo khi đã dùng ít nhất 80% ngân sách hoặc vượt hạn mức. Có thể nhập CSV bằng cách chọn tệp hoặc dán nội dung. Dữ liệu được kiểm tra về cột, số tiền, danh mục, ngày và trùng lặp. Trang cũng có bảng chi tiêu theo danh mục, nút xóa từng khoản và nút đặt lại dữ liệu mẫu.

### Học tập (`hoctap.html`)
Có thể quản lý bài tập theo môn học, nội dung và deadline; đánh dấu hoàn thành hoặc xóa. Bài tập được sắp xếp theo deadline gần nhất. Phần lập kế hoạch tuần cho phép thêm hoạt động theo thứ và khung giờ, đồng thời báo lỗi nếu các hoạt động trong cùng ngày bị trùng giờ. Có thể nhập bài tập từ CSV và để trống deadline.

Chế độ tập trung học có đồng hồ đếm ngược 15, 25, 45 hoặc 60 phút, hoặc thời lượng tùy chỉnh từ 1 đến 180 phút. Đồng hồ có thể tạm dừng, tiếp tục và đặt lại.

### Giải trí (`giaitri.html`)
Trang có 20 câu đố trắc nghiệm lập trình kèm chấm điểm và playlist Lofi nhúng từ Spotify.

### Hướng dẫn (`huongdan.html`) và Liên hệ (`lienhe.html`)
Trang Hướng dẫn có chỉ dẫn từng bước và câu hỏi thường gặp. Biểu mẫu Liên hệ kiểm tra dữ liệu và lưu 5 phản hồi gần nhất trên thiết bị. Trang này cũng có bảng thành viên nhóm.

### Dùng chung
Chế độ tối hoặc sáng được áp dụng trên mọi trang và ứng dụng ghi nhớ lựa chọn. Giao diện thích ứng với kích thước màn hình và hỗ trợ trình đọc màn hình thông qua `aria-*` và `role`.

## Công nghệ

Dự án dùng HTML5, CSS3 (biến CSS, Grid, Flexbox và media query) cùng JavaScript thuần (ES6+). Dữ liệu được lưu bằng `localStorage`; `FileReader` dùng để đọc tệp CSV ngay trên trình duyệt. Dự án không dùng framework hay thư viện bên ngoài.

## Cấu trúc thư mục

Các trang HTML gồm `index.html` (đăng nhập), `trangchu.html` (Trang chủ), `chitieu.html` (Chi tiêu), `hoctap.html` (Học tập), `giaitri.html` (Giải trí), `huongdan.html` (Hướng dẫn và hỏi đáp) và `lienhe.html` (Liên hệ và phản hồi).

Tệp giao diện gồm `style.css` và `dangnhap.css`. Các tệp JavaScript là `chung.js` (chế độ tối, năm chân trang, các hàm CSV và ngày dùng chung), `dangnhap.js` (xử lý đăng nhập), `loiChao.js` (lời chào theo tên người dùng), `chitieu.js` (thu chi, ngân sách và CSV), `hoctap.js` (bài tập, lịch tuần và đồng hồ tập trung), `tongquan.js` (tổng hợp dữ liệu cho Trang chủ), `giaitri.js` (đố vui và chuyển tab Lofi) và `lienhe.js` (biểu mẫu phản hồi).

Các tệp dữ liệu mẫu là `template.csv` cho thu chi và `template-hoc-tap.csv` cho học tập. Thư mục `img/` chứa `favicon.jpg` và `brdau.png`.

## Cách chạy

Tải hoặc clone dự án về máy, sau đó mở `index.html` bằng trình duyệt hoặc dùng Live Server của VS Code. Nhập tên rồi bấm **Vào trang chủ**.

Tiện ích Lofi cần kết nối Internet để tải Spotify.

## Định dạng CSV

Mẫu thu chi trong `template.csv` dùng thứ tự cột sau:

```csv
loai,noi_dung,so_tien,danh_muc,ngay
chi,Cà phê,25000,Ăn uống,2026-10-18
thu,Tiền làm thêm,500000,Làm thêm,2026-10-18
```

Trường `loai` nhận `chi` hoặc `thu`, `so_tien` là số nguyên dương và `ngay` có định dạng `YYYY-MM-DD`. Danh mục phải khớp với loại khoản như mô tả trong phần Chi tiêu.

Mẫu học tập trong `template-hoc-tap.csv`:

```csv
mon_hoc,noi_dung,deadline
Toán,Ôn tập chương 1,2026-10-20
```

Trường `deadline` có định dạng `YYYY-MM-DD` và có thể để trống. Không đặt dấu phẩy hoặc xuống dòng bên trong một ô.

## Lưu ý về dữ liệu

`localStorage` lưu các thông tin sau: `tenNguoiDung` là tên đăng nhập, `chiTieu` là danh sách khoản thu chi, `nganSachThang` là ngân sách từng tháng, `hoc_tap_data` là danh sách bài tập, `lich_tuan_data` là lịch tuần, `phan_hoi_data` là phản hồi đã gửi và `che_do_toi` là lựa chọn chế độ tối hoặc sáng.

Dữ liệu chỉ nằm trên trình duyệt của thiết bị đang dùng; đổi máy hoặc xóa dữ liệu trang web sẽ làm mất dữ liệu.

## Hạn chế đã biết

Hiện chưa có chức năng sửa khoản đã nhập; cần xóa khoản đó rồi nhập lại. Đăng nhập chỉ dùng để cá nhân hóa lời chào, không có mật khẩu hay bảo mật. Trang Hướng dẫn nhắc đến "Hoàn thành", nhưng bài tập mới chỉ có thể đánh dấu xong hoặc chưa xong, chưa có chức năng lọc.

## Thành viên và phân công

Xem chi tiết tại [CONTRIBUTIONS.md](CONTRIBUTIONS.md). Nguồn tham khảo và tài nguyên bên thứ ba xem tại [SOURCES.md](SOURCES.md).

Hoàng phụ trách giao diện HTML, Vân phụ trách `hoctap.js`, Thông phụ trách `chitieu.js` và Nga phụ trách `style.css`.
