// lienhe.js - biểu mẫu liên hệ / phản hồi (kiểm tra dữ liệu và lưu tại trình duyệt)
const PHAN_HOI_KEY = "phan_hoi_data";
const formLienHe = document.getElementById("formLienHe");
const thongBaoLienHe = document.getElementById("thongBaoLienHe");
const danhSachPhanHoi = document.getElementById("danhSachPhanHoi");

function docPhanHoi() {
  try {
    const data = JSON.parse(localStorage.getItem(PHAN_HOI_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function hienPhanHoi() {
  const ds = docPhanHoi();
  danhSachPhanHoi.replaceChildren();
  if (ds.length === 0) {
    const trong = document.createElement("li");
    trong.className = "trong";
    trong.textContent = "Chưa có phản hồi nào được gửi.";
    danhSachPhanHoi.append(trong);
    return;
  }
  ds.slice(0, 5).forEach((p) => {
    const li = document.createElement("li");
    const ten = document.createElement("b");
    ten.textContent = `${p.name} • ${p.topic} • ${"★".repeat(Number(p.rating))}`;
    const nd = document.createElement("small");
    nd.textContent = p.message;
    li.append(ten, nd);
    danhSachPhanHoi.append(li);
  });
}

function baoLoi(ten, thongDiep) {
  const o = formLienHe.elements[ten];
  const loi = document.getElementById("loi-" + ten);
  loi.textContent = thongDiep;
  o.classList.toggle("coLoi", Boolean(thongDiep));
  return !thongDiep;
}

formLienHe.addEventListener("submit", (event) => {
  event.preventDefault();
  const f = formLienHe.elements;
  const name = f.name.value.trim();
  const email = f.email.value.trim();
  const message = f.message.value.trim();

  const hopLe = [
    baoLoi("name", name.length < 2 ? "Vui lòng nhập họ tên (ít nhất 2 ký tự)." : ""),
    baoLoi(
      "email",
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Email chưa đúng định dạng.",
    ),
    baoLoi(
      "message",
      message.length < 10 ? "Nội dung cần ít nhất 10 ký tự." : "",
    ),
  ].every(Boolean);
  if (!hopLe) {
    thongBaoLienHe.textContent = "";
    return;
  }

  const ds = docPhanHoi();
  ds.unshift({
    id: Date.now(),
    name,
    email,
    topic: f.topic.value,
    rating: f.rating.value,
    message,
  });
  try {
    localStorage.setItem(PHAN_HOI_KEY, JSON.stringify(ds));
  } catch {}

  formLienHe.reset();
  thongBaoLienHe.textContent = `Cảm ơn ${name}! Phản hồi của bạn đã được ghi nhận.`;
  hienPhanHoi();
});

hienPhanHoi();
