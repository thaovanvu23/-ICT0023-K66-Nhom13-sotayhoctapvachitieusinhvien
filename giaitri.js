// giaitri.js - Đố vui lập trình + Nhạc Lofi (trang Giải trí)
const CAU_HOI = [
  {
    hoi: "Ngôn ngữ nào dùng để tạo cấu trúc trang web?",
    dapAn: ["Python", "HTML", "C++"],
    dung: 1,
  },
  {
    hoi: "Ngôn ngữ nào dùng để trang trí giao diện (màu sắc, bố cục)?",
    dapAn: ["CSS", "SQL", "Java"],
    dung: 0,
  },
  {
    hoi: "Ngôn ngữ nào chạy trực tiếp trên trình duyệt để tạo tương tác?",
    dapAn: ["PHP", "JavaScript", "Go"],
    dung: 1,
  },
  {
    hoi: "Thẻ HTML nào dùng để chèn hình ảnh?",
    dapAn: ["<img>", "<pic>", "<src>"],
    dung: 0,
  },
  {
    hoi: "localStorage dùng để làm gì?",
    dapAn: [
      "Gửi email",
      "Lưu dữ liệu ngay trong trình duyệt",
      "Biên dịch mã nguồn",
    ],
    dung: 1,
  },
  {
    hoi: "Thuộc tính HTML nào tạo liên kết đến trang khác?",
    dapAn: ["href", "src", "alt"],
    dung: 0,
  },
  {
    hoi: "CSS selector nào chọn phần tử có id=\"menu\"?",
    dapAn: [".menu", "#menu", "menu()"],
    dung: 1,
  },
  {
    hoi: "Từ khóa nào khai báo biến có thể gán lại trong JavaScript?",
    dapAn: ["const", "let", "static"],
    dung: 1,
  },
  {
    hoi: "Kiểu dữ liệu nào biểu diễn giá trị đúng hoặc sai trong JavaScript?",
    dapAn: ["Boolean", "String", "Array"],
    dung: 0,
  },
  {
    hoi: "Phương thức nào thêm một phần tử vào cuối mảng JavaScript?",
    dapAn: ["push()", "shift()", "pop()"],
    dung: 0,
  },
  {
    hoi: "Toán tử === trong JavaScript dùng để làm gì?",
    dapAn: [
      "So sánh bằng cả giá trị và kiểu dữ liệu",
      "Gán giá trị cho biến",
      "Nối hai chuỗi",
    ],
    dung: 0,
  },
  {
    hoi: "Sự kiện nào thường xảy ra khi người dùng bấm vào nút?",
    dapAn: ["submit", "click", "load"],
    dung: 1,
  },
  {
    hoi: "Phương thức nào tìm một phần tử HTML theo id?",
    dapAn: [
      "document.getElementById()",
      "document.createElement()",
      "document.append()",
    ],
    dung: 0,
  },
  {
    hoi: "Thẻ HTML nào tạo tiêu đề lớn nhất theo cấu trúc trang?",
    dapAn: ["<h6>", "<head>", "<h1>"],
    dung: 2,
  },
  {
    hoi: "Thuộc tính alt của hình ảnh giúp ích điều gì?",
    dapAn: [
      "Mô tả hình ảnh khi không tải được và hỗ trợ trình đọc màn hình",
      "Tự động phóng to hình ảnh",
      "Tạo đường viền cho hình ảnh",
    ],
    dung: 0,
  },
  {
    hoi: "CSS Flexbox thường được dùng để làm gì?",
    dapAn: [
      "Sắp xếp và căn chỉnh phần tử trong bố cục",
      "Lưu dữ liệu người dùng",
      "Tạo cấu trúc cơ sở dữ liệu",
    ],
    dung: 0,
  },
  {
    hoi: "JSON thường được dùng để làm gì?",
    dapAn: [
      "Định dạng trao đổi dữ liệu dạng văn bản",
      "Tạo kiểu chữ cho trang web",
      "Nén ảnh thành video",
    ],
    dung: 0,
  },
  {
    hoi: "Lệnh console.log() thường dùng để làm gì?",
    dapAn: [
      "Hiển thị thông tin trong bảng điều khiển để kiểm tra",
      "Xóa toàn bộ mã nguồn",
      "Tạo một nút mới trên trang",
    ],
    dung: 0,
  },
  {
    hoi: "Trong Git, commit dùng để làm gì?",
    dapAn: [
      "Lưu lại một mốc thay đổi trong lịch sử dự án",
      "Xóa một nhánh trên Internet",
      "Chạy trang web trên trình duyệt",
    ],
    dung: 0,
  },
  {
    hoi: "HTTP là giao thức thường dùng cho việc gì?",
    dapAn: [
      "Trao đổi dữ liệu giữa trình duyệt và máy chủ web",
      "Chỉnh sửa ảnh trên máy tính",
      "Tạo hoạt ảnh trong CSS",
    ],
    dung: 0,
  },
];

let chiSoCauHoi = 0;
let diemQuiz = 0;
let daTraLoi = false;

const cauHoiQuiz = document.getElementById("cauHoiQuiz");
const luaChonQuiz = document.getElementById("luaChonQuiz");
const ketQuaQuiz = document.getElementById("ketQuaQuiz");
const nutCauTiep = document.getElementById("nutCauTiep");

function hienCauHoi() {
  if (!cauHoiQuiz) return;
  const cau = CAU_HOI[chiSoCauHoi];
  daTraLoi = false;
  cauHoiQuiz.textContent = `Câu ${chiSoCauHoi + 1}/${CAU_HOI.length}: ${cau.hoi}`;
  ketQuaQuiz.textContent = "";
  nutCauTiep.hidden = true;
  luaChonQuiz.replaceChildren();
  cau.dapAn.forEach((noiDung, viTri) => {
    const nut = document.createElement("button");
    nut.type = "button";
    nut.className = "nutChonDapAn";
    nut.textContent = `${"ABC"[viTri]}. ${noiDung}`;
    nut.addEventListener("click", () => chonDapAn(viTri, nut));
    luaChonQuiz.append(nut);
  });
}

function chonDapAn(viTri, nut) {
  if (daTraLoi) return;
  daTraLoi = true;
  const cau = CAU_HOI[chiSoCauHoi];
  const dung = viTri === cau.dung;
  if (dung) diemQuiz += 1;
  ketQuaQuiz.textContent = dung
    ? "✅ Chính xác!"
    : `❌ Chưa đúng. Đáp án đúng: ${"ABC"[cau.dung]}.`;
  ketQuaQuiz.className = dung ? "ketQuaDung" : "ketQuaSai";
  luaChonQuiz.children[cau.dung].classList.add("dapAnDung");
  if (!dung) nut.classList.add("dapAnSai");
  nutCauTiep.hidden = false;
  nutCauTiep.textContent =
    chiSoCauHoi === CAU_HOI.length - 1 ? "Xem kết quả" : "Câu tiếp theo →";
}

function ketThucQuiz() {
  cauHoiQuiz.textContent = `Hoàn thành! Bạn đúng ${diemQuiz}/${CAU_HOI.length} câu.`;
  luaChonQuiz.replaceChildren();
  ketQuaQuiz.textContent =
    diemQuiz === CAU_HOI.length ? "🎉 Xuất sắc!" : "Thử lại để đạt điểm cao hơn nhé.";
  ketQuaQuiz.className = "";
  nutCauTiep.hidden = false;
  nutCauTiep.textContent = "Chơi lại";
  chiSoCauHoi = -1; // lần bấm tiếp theo sẽ quay về câu 1
  diemQuiz = 0;
}

if (nutCauTiep) {
  nutCauTiep.addEventListener("click", () => {
    if (chiSoCauHoi === CAU_HOI.length - 1) {
      ketThucQuiz();
      return;
    }
    chiSoCauHoi += 1;
    hienCauHoi();
  });
  hienCauHoi();
}

// chuyển giữa Đố vui và Lofi
function chuyenTabGiaiTri(tab) {
  document.getElementById("noiDungQuiz").hidden = tab !== "quiz";
  document.getElementById("noiDungLofi").hidden = tab !== "lofi";
  document.querySelectorAll(".nutGiaiTri").forEach((nut) => {
    nut.classList.toggle("dangChon", nut.dataset.tab === tab);
  });
}

document.querySelectorAll(".nutGiaiTri").forEach((nut) => {
  nut.addEventListener("click", () => chuyenTabGiaiTri(nut.dataset.tab));
});
