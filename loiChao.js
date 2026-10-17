const tenNguoiDung = localStorage.getItem("tenNguoiDung");
const loiChao = document.querySelector("#loiChao");

if (tenNguoiDung) {
  loiChao.textContent = `Chào mừng ${tenNguoiDung}!`;
}
