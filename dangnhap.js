const formDangNhap = document.querySelector("#formDangNhap");
const truongTenNguoiDung = document.querySelector("#tenNguoiDung");

formDangNhap.addEventListener("submit", (event) => {
  event.preventDefault();

  truongTenNguoiDung.value = truongTenNguoiDung.value.trim();
  if (!formDangNhap.reportValidity()) {
    return;
  }

  sessionStorage.setItem("tenNguoiDung", truongTenNguoiDung.value);
  window.location.assign("trangchu.html");
});
