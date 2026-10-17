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
