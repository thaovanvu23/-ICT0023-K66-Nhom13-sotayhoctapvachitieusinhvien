// --- BƯỚC 1: TẠO DỮ LIỆU MẪU (Mảng chứa các đối tượng kế hoạch học tập) ---
let danhSachHocTap = [
    { id: 1, mon: "Lập trình Web", thoiGian: "08:00 - 10:00", thu: "Thứ Hai", trangThai: "Hoàn thành" },
    { id: 2, mon: "Cấu trúc dữ liệu", thoiGian: "14:00 - 16:00", thu: "Thứ Ba", trangThai: "Đang tiến hành" },
    { id: 3, mon: "Phương pháp giảng dạy", thoiGian: "09:00 - 11:00", thu: "Thứ Tư", trangThai: "Chưa bắt đầu" }
];

// --- BƯỚC 2: HÀM HIỂN THỊ DỮ LIỆU RA MÀN HÌNH (Chức năng bắt buộc 1) ---
function hienThiBangHocTap(mangHienThi) {
    const tbody = document.getElementById("bangHocTapBody");
    if (!tbody) return; // Nếu không tìm thấy thẻ HTML này thì dừng lại
    
    tbody.innerHTML = ""; // Xóa dữ liệu cũ trước khi vẽ lại

    // Nếu danh sách trống, báo không tìm thấy
    if (mangHienThi.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4' class='text-center text-muted'>Không tìm thấy dữ liệu phù hợp!</td></tr>";
        return;
    }

    // Duyệt qua từng phần tử trong mảng để tạo các dòng <tr> trong bảng HTML
    mangHienThi.forEach((item, index) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.mon}</td>
            <td>${item.thu} (${item.thoiGian})</td>
            <td><span class="badge bg-primary">${item.trangThai}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Chạy hàm hiển thị ngay khi trang web vừa tải xong
document.addEventListener("DOMContentLoaded", function () {
    hienThiBangHocTap(danhSachHocTap);

    // --- BƯỚC 3: CHỨC NĂNG TÌM KIẾM / LỌC (Chức năng bắt buộc 2) ---
    const inputTimKiem = document.getElementById("inputTimKiemHocTap");
    if (inputTimKiem) {
        inputTimKiem.addEventListener("input", function (e) {
            let tuKhoa = e.target.value.toLowerCase().trim();
            
            // Lọc mảng dữ liệu gốc theo tên môn học hoặc thứ
            let ketQuaLọc = danhSachHocTap.filter(item => 
                item.mon.toLowerCase().includes(tuKhoa) || item.thu.toLowerCase().includes(tuKhoa)
            );
            
            hienThiBangHocTap(ketQuaLọc);
        });
    }

    // --- BƯỚC 4: XỬ LÝ FORM THÊM KẾ HOẠCH & KIỂM TRA LỖI (Chức năng bắt buộc 3) ---
    const formHocTap = document.getElementById("formThemHocTap");
    if (formHocTap) {
        formHocTap.addEventListener("submit", function (e) {
            e.preventDefault(); // Chặn hành vi load lại trang mặc định của form

            // Lấy giá trị người dùng nhập vào ô input
            let tenMon = document.getElementById("inputMonHoc").value.trim();
            let thoiGianHoc = document.getElementById("inputThoiGian").value.trim();
            let thongBaoLoi = document.getElementById("thongBaoLoiHocTap");

            // Kiểm tra lỗi dữ liệu rỗng (Validation)
            if (!tenMon || !thoiGianHoc) {
                thongBaoLoi.textContent = "Lỗi: Vui lòng nhập đầy đủ tên môn học và thời gian!";
                thongBaoLoi.className = "text-danger mt-2 fw-bold";
                return; // Dừng lại không thêm nữa
            }

            // Nếu nhập đầy đủ, thông báo thành công
            thongBaoLoi.textContent = "Thêm kế hoạch học tập thành công!";
            thongBaoLoi.className = "text-success mt-2 fw-bold";

            // Đưa dữ liệu mới vào mảng đối tượng
            danhSachHocTap.push({
                id: danhSachHocTap.length + 1,
                mon: tenMon,
                thoiGian: thoiGianHoc,
                thu: "Thứ Tự Do",
                trangThai: "Mới lên lịch"
            });

            // Cập nhật lại bảng hiển thị ngay lập tức
            hienThiBangHocTap(danhSachHocTap);

            // Xóa sạch ô nhập sau khi thêm thành công
            formHocTap.reset();
        });
    }
});