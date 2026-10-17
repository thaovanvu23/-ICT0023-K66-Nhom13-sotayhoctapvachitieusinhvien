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
