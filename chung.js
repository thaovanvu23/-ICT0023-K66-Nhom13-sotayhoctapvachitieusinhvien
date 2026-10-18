// chung.js - phần dùng chung cho mọi trang (chế độ tối, năm ở chân trang)
const CHE_DO_TOI_KEY = "che_do_toi";
const nutChuyenCheDo = document.getElementById("nutChuyenCheDo");

function docCheDoToi() {
  try {
    return localStorage.getItem(CHE_DO_TOI_KEY) === "true";
  } catch {
    return false;
  }
}

function capNhatCheDoToi(cheDoToi) {
  document.body.classList.toggle("dark-mode", cheDoToi);
  nutChuyenCheDo.setAttribute("aria-pressed", String(cheDoToi));
  nutChuyenCheDo.textContent = cheDoToi ? "☀️ Chế độ sáng" : "🌙 Chế độ tối";
}

capNhatCheDoToi(docCheDoToi());
nutChuyenCheDo.addEventListener("click", () => {
  const cheDoToi = !document.body.classList.contains("dark-mode");
  try {
    localStorage.setItem(CHE_DO_TOI_KEY, String(cheDoToi));
  } catch {}
  capNhatCheDoToi(cheDoToi);
});

const namChanTrang = document.getElementById("namHienTai");
if (namChanTrang) namChanTrang.textContent = new Date().getFullYear();

function parseCsvRows(text) {
  const noiDung = text.replace(/^\uFEFF/, "").trim();
  if (!noiDung) return [];
  return noiDung
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => line.split(",").map((value) => value.trim()));
}

function laNgayISOHopLe(value) {
  const parts = value.split("-");
  if (parts.length !== 3 || !/^\d{4}$/.test(parts[0])) return false;
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);
  const date = new Date(year, month - 1, day);
  return (
    /^\d{2}$/.test(parts[1]) &&
    /^\d{2}$/.test(parts[2]) &&
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}
