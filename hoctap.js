// hoctap.js - phần Học tập (Vân)
// Dùng được trên mọi trang: trang Học tập có form + danh sách,
// trang chủ chỉ cần đọc dữ liệu để tổng hợp.
const HOC_TAP_KEY = "hoc_tap_data";
let danhSachCongViec = [];

try {
  const duLieuHocTap = JSON.parse(localStorage.getItem(HOC_TAP_KEY) || "[]");
  if (Array.isArray(duLieuHocTap)) danhSachCongViec = duLieuHocTap;
} catch {
  danhSachCongViec = [];
}

function luuDanhSachHocTap() {
  localStorage.setItem(HOC_TAP_KEY, JSON.stringify(danhSachCongViec));
}

function dinhDangNgayHocTap(ngay) {
  if (!ngay) return "Không có deadline";
  const [nam, thang, ngayTrongThang] = ngay.split("-");
  return `${ngayTrongThang}/${thang}/${nam}`;
}

window.getHocTapSummary = function () {
  const viecChuaXong = danhSachCongViec.filter((congViec) => !congViec.done);
  const coDeadline = viecChuaXong
    .filter((congViec) => congViec.deadline)
    .sort((a, b) => a.deadline.localeCompare(b.deadline));

  return {
    total: danhSachCongViec.length,
    done: danhSachCongViec.filter((congViec) => congViec.done).length,
    nearest: coDeadline[0] || null,
  };
};

function renderDanhSachHocTap() {
  const danhSach = document.getElementById("danhSachHocTap");
  if (!danhSach) return;
  const tongHop = window.getHocTapSummary();
  document.getElementById("tienDoHocTap").textContent =
    `${tongHop.done}/${tongHop.total}`;

  if (danhSachCongViec.length === 0) {
    danhSach.innerHTML =
      '<li class="trong">Chưa có bài tập hoặc công việc nào.</li>';
    return;
  }

  danhSach.replaceChildren();
  danhSachCongViec
    .slice()
    .sort((a, b) =>
      (a.deadline || "9999-12-31").localeCompare(b.deadline || "9999-12-31"),
    )
    .forEach((congViec) => {
      const muc = document.createElement("li");
      muc.className = `muc mucHocTap${congViec.done ? " hoanThanh" : ""}`;

      const thongTin = document.createElement("div");
      thongTin.className = "mucThongTin";
      const monHoc = document.createElement("strong");
      monHoc.textContent = congViec.subject;
      const noiDung = document.createElement("span");
      noiDung.textContent = congViec.task;
      const deadline = document.createElement("small");
      deadline.textContent = `Deadline: ${dinhDangNgayHocTap(congViec.deadline)}`;
      thongTin.append(monHoc, noiDung, deadline);

      const hanhDong = document.createElement("div");
      hanhDong.className = "hanhDongHocTap";
      const nutHoanThanh = document.createElement("button");
      nutHoanThanh.type = "button";
      nutHoanThanh.className = "nutTrangThaiHocTap";
      nutHoanThanh.textContent = congViec.done ? "Đã xong" : "Hoàn thành";
      nutHoanThanh.setAttribute("aria-pressed", String(Boolean(congViec.done)));
      nutHoanThanh.addEventListener("click", () => {
        congViec.done = !congViec.done;
        luuDanhSachHocTap();
        renderDanhSachHocTap();
      });

      const nutXoa = document.createElement("button");
      nutXoa.type = "button";
      nutXoa.className = "nutXoa";
      nutXoa.textContent = "Xóa";
      nutXoa.addEventListener("click", () => {
        danhSachCongViec = danhSachCongViec.filter(
          (mucHienTai) => mucHienTai.id !== congViec.id,
        );
        luuDanhSachHocTap();
        renderDanhSachHocTap();
      });

      hanhDong.append(nutHoanThanh, nutXoa);
      muc.append(thongTin, hanhDong);
      danhSach.append(muc);
    });
}

const formHocTap = document.getElementById("formHocTap");
if (formHocTap) {
  formHocTap.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const subject = form.elements.subject.value.trim();
    const task = form.elements.task.value.trim();
    const deadline = form.elements.deadline.value;
    if (!subject || !task) return;

    danhSachCongViec.unshift({
      id: Date.now(),
      subject,
      task,
      deadline,
      done: false,
    });
    luuDanhSachHocTap();
    form.reset();
    renderDanhSachHocTap();
  });

  renderDanhSachHocTap();
}

const luaChonThoiLuong = document.getElementById("thoiLuongDongHo");
const dongHo = document.getElementById("thoiGianConLai");
if (luaChonThoiLuong && dongHo) {
  const oNhapSoPhut = document.getElementById("soPhutTuyChinh");
  const nhanSoPhutTuyChinh = document.getElementById("nhanSoPhutTuyChinh");
  const thanhTienDo = document.getElementById("thanhTienDoDongHo");
  const trangThaiDongHo = document.getElementById("trangThaiDongHo");
  const nutBatDau = document.getElementById("batDauDongHo");
  const nutTamDung = document.getElementById("tamDungDongHo");
  const nutTiepTuc = document.getElementById("tiepTucDongHo");
  const nutDatLai = document.getElementById("datLaiDongHo");

  let tongSoGiay = 25 * 60;
  let soGiayConLai = tongSoGiay;
  let mocKetThuc = null;
  let boDem = null;
  let dangChay = false;
  let dangTamDung = false;

  function hienThiThoiGian() {
    const phut = Math.floor(soGiayConLai / 60);
    const giay = soGiayConLai % 60;
    dongHo.textContent = `${String(phut).padStart(2, "0")}:${String(giay).padStart(2, "0")}`;
    thanhTienDo.max = String(tongSoGiay);
    thanhTienDo.value = String(tongSoGiay - soGiayConLai);
  }

  function capNhatNutDieuKhien() {
    nutBatDau.disabled = dangChay || dangTamDung;
    nutTamDung.disabled = !dangChay;
    nutTiepTuc.disabled = !dangTamDung;
    nutDatLai.disabled = !dangChay && !dangTamDung && soGiayConLai === tongSoGiay;
    luaChonThoiLuong.disabled = dangChay;
    oNhapSoPhut.disabled = dangChay;
  }

  function dungBoDem() {
    window.clearInterval(boDem);
    boDem = null;
    mocKetThuc = null;
    dangChay = false;
    dangTamDung = false;
  }

  function capNhatBoDem() {
    soGiayConLai = Math.max(0, Math.ceil((mocKetThuc - Date.now()) / 1000));
    hienThiThoiGian();

    if (soGiayConLai === 0) {
      dungBoDem();
      trangThaiDongHo.textContent = "Hoàn thành phiên tập trung! Hãy nghỉ ngơi một chút.";
    }
    capNhatNutDieuKhien();
  }

  function docThoiLuongDaChon() {
    if (luaChonThoiLuong.value !== "custom") {
      return Number(luaChonThoiLuong.value);
    }

    const soPhut = Number(oNhapSoPhut.value);
    if (!Number.isInteger(soPhut) || soPhut < 1 || soPhut > 180) {
      trangThaiDongHo.textContent = "Vui lòng nhập số phút từ 1 đến 180.";
      oNhapSoPhut.setAttribute("aria-invalid", "true");
      oNhapSoPhut.focus();
      return null;
    }

    oNhapSoPhut.removeAttribute("aria-invalid");
    return soPhut;
  }

  function datThoiLuongMoi() {
    const soPhut = docThoiLuongDaChon();
    if (soPhut === null) return;

    dungBoDem();
    tongSoGiay = soPhut * 60;
    soGiayConLai = tongSoGiay;
    trangThaiDongHo.textContent = "Sẵn sàng bắt đầu.";
    hienThiThoiGian();
    capNhatNutDieuKhien();
  }

  function batDauDongHo() {
    tongSoGiay = docThoiLuongDaChon() * 60;
    if (!Number.isFinite(tongSoGiay) || tongSoGiay <= 0) return;

    soGiayConLai = tongSoGiay;
    dangChay = true;
    dangTamDung = false;
    mocKetThuc = Date.now() + soGiayConLai * 1000;
    trangThaiDongHo.textContent = "Đang tập trung học.";
    boDem = window.setInterval(capNhatBoDem, 250);
    capNhatBoDem();
  }

  luaChonThoiLuong.addEventListener("change", () => {
    const tuyChinh = luaChonThoiLuong.value === "custom";
    oNhapSoPhut.hidden = !tuyChinh;
    nhanSoPhutTuyChinh.hidden = !tuyChinh;
    oNhapSoPhut.required = tuyChinh;
    if (!tuyChinh) oNhapSoPhut.removeAttribute("aria-invalid");

    if (tuyChinh && !oNhapSoPhut.value) {
      oNhapSoPhut.value = "25";
    }
    datThoiLuongMoi();
  });
  oNhapSoPhut.addEventListener("change", datThoiLuongMoi);
  nutBatDau.addEventListener("click", batDauDongHo);
  nutTamDung.addEventListener("click", () => {
    soGiayConLai = Math.max(0, Math.ceil((mocKetThuc - Date.now()) / 1000));
    window.clearInterval(boDem);
    boDem = null;
    mocKetThuc = null;
    dangChay = false;
    dangTamDung = soGiayConLai > 0;
    trangThaiDongHo.textContent = dangTamDung
      ? "Đã tạm dừng."
      : "Hoàn thành phiên tập trung! Hãy nghỉ ngơi một chút.";
    hienThiThoiGian();
    capNhatNutDieuKhien();
  });
  nutTiepTuc.addEventListener("click", () => {
    dangChay = true;
    dangTamDung = false;
    mocKetThuc = Date.now() + soGiayConLai * 1000;
    trangThaiDongHo.textContent = "Đang tập trung học.";
    boDem = window.setInterval(capNhatBoDem, 250);
    capNhatBoDem();
  });
  nutDatLai.addEventListener("click", () => {
    dungBoDem();
    soGiayConLai = tongSoGiay;
    trangThaiDongHo.textContent = "Đã đặt lại. Sẵn sàng bắt đầu.";
    hienThiThoiGian();
    capNhatNutDieuKhien();
  });

  hienThiThoiGian();
  capNhatNutDieuKhien();
}
