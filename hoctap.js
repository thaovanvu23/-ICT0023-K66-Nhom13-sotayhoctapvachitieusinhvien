// --- BƯỚC 1: TẠO DỮ LIỆU MẪU (Mảng chứa các đối tượng kế hoạch học tập) ---
let danhSachHocTap = [
    { id: 1, mon: "Lập trình Web", thoiGian: "08:00 - 10:00", thu: "Thứ Hai", trangThai: "Hoàn thành" },
    { id: 2, mon: "Cấu trúc dữ liệu", thoiGian: "14:00 - 16:00", thu: "Thứ Ba", trangThai: "Đang học" },
    { id: 3, mon: "Phương pháp giảng dạy", thoiGian: "09:00 - 11:00", thu: "Thứ Tư", trangThai: "Chưa học" }
];

// --- BƯỚC 2: HÀM HIỂN THỊ DỮ LIỆU RA MÀN HÌNH ---
function hienThiBangHocTap(mangHienThi) {
    const tbody = document.getElementById("bangHocTapBody");
    if (!tbody) return; // Nếu không tìm thấy thẻ HTML này thì dừng lại

    tbody.innerHTML = ""; // Xóa dữ liệu cũ trước khi vẽ lại

    // Nếu danh sách trống, báo không tìm thấy
    if (mangHienThi.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4' class='text-center text-muted'>Không tìm thấy dữ liệu phù hợp</td></tr>";
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

// Gọi hàm hiển thị dữ liệu khi trang vừa được tải xong
document.addEventListener("DOMContentLoaded", () => {
    hienThiBangHocTap(danhSachHocTap);
});