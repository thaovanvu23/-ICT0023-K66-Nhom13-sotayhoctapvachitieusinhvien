# Đóng góp của các thành viên

Dự án **Quản Lý Chi Tiêu và Học Tập** là bài tập nhóm gồm 4 thành viên: **Hoàng, Vân, Thông, Nga**.

## 1. Phân công chính

Hoàng phụ trách giao diện HTML của `index.html`, `trangchu.html`, `chitieu.html`, `hoctap.html`, `giaitri.html`, `huongdan.html` và `lienhe.html`.

Vân phụ trách `hoctap.js` và `template-hoc-tap.csv`. Thông phụ trách `chitieu.js` và `template.csv`.
Nga phụ trách `style.css`.

## 2. Chi tiết theo thành viên

### Hoàng, giao diện HTML

Hoàng xây dựng cấu trúc 7 trang gồm Đăng nhập, Trang chủ, Chi tiêu, Học tập, Giải trí, Hướng dẫn và Liên hệ. Hoàng cũng thống nhất khung chung cho tiêu đề, nút chế độ tối, thanh điều hướng và chân trang; viết nội dung Hướng dẫn và Câu hỏi thường gặp; thêm các thuộc tính truy cập `aria-*`, `role` và `label` cho biểu mẫu và điều hướng.

### Vân, `hoctap.js`

Vân làm chức năng thêm, xóa và đánh dấu hoàn thành bài tập, đồng thời sắp xếp bài theo deadline. Phần lập kế hoạch tuần kiểm tra giờ hợp lệ và phát hiện khung giờ bị trùng. Chức năng nhập CSV kiểm tra cột, ngày và dữ liệu trùng lặp. Chế độ tập trung học có đồng hồ đếm ngược, tạm dừng, tiếp tục, đặt lại và thời lượng tùy chỉnh từ 1 đến 180 phút. Tệp cung cấp `window.getHocTapSummary()` cho Trang chủ.

### Thông, `chitieu.js`

Thông làm chức năng ghi khoản thu chi, định dạng số tiền khi nhập và chọn danh mục theo loại khoản. Phần ngân sách tháng hiển thị tổng chi, ước tính cuối tháng và cảnh báo khi sử dụng ít nhất 80% hoặc vượt hạn mức. Chức năng nhập CSV kiểm tra loại khoản, số tiền, danh mục, ngày và dữ liệu trùng lặp. Tệp cũng có bảng chi tiêu theo danh mục, dữ liệu mẫu và cung cấp `window.getChiTieuSummary()` cho Trang chủ.

### Nga, `style.css`

Nga thiết kế giao diện chung gồm bảng màu, khung, nút, biểu mẫu, danh sách và bảng. Tệp có chế độ tối dùng biến CSS `body.dark-mode`, bố cục thích ứng cho lưới thẻ tổng quan, thanh tab và đồng hồ tập trung, cùng kiểu hiển thị cho các thành phần Học tập, Giải trí, Hướng dẫn và Liên hệ.

## 3. Các tệp bổ sung

Ngoài phần chính, Hoàng thực hiện `dangnhap.js` để xử lý đăng nhập và lưu tên người dùng, `loiChao.js` để hiển thị lời chào .

Vân thực hiện `giaitri.js` cho phần đố vui và chuyển tab Lofi, cùng `chung.js` cho chế độ tối, năm chân trang và các hàm `parseCsvRows`, `laNgayISOHopLe`.

Thông thực hiện `tongquan.js` để tổng hợp dữ liệu cho Trang chủ và tài liệu `CONTRIBUTIONS.md` kiểm tra dữ liệu và lưu phản hồi, thư mục `img/` cho hình ảnh và favicon, và `README.md` để giới thiệu dự án, hướng dẫn chạy và mô tả cấu trúc.

Nga thực hiện `dangnhap.css` cho giao diện đăng nhập, `lienhe.js` cho biểu mẫu liên hệ, cùng `SOURCES.md` để ghi nguồn tham khảo và tài nguyên.

## 4. Phối hợp chung

Cả nhóm cùng thống nhất các khóa `localStorage` và hai hàm tổng hợp dùng giữa các tệp. Các thành viên cùng kiểm thử và đối chiếu lỗi giữa HTML, CSS và JavaScript.

Nếu có thông tin, nhóm có thể bổ sung số buổi họp, cách chia việc qua Git, Zalo hoặc Drive, liên kết kho mã nguồn và lịch sử commit.

