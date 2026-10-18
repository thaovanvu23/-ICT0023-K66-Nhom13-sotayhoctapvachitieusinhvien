// hoctap.js - phần Học tập (Vân)
// Dùng được trên mọi trang: trang Học tập có form + danh sách,
// trang chủ chỉ cần đọc dữ liệu để tổng hợp.
const HOC_TAP_KEY = "hoc_tap_data";
const LICH_TUAN_KEY = "lich_tuan_data";
let danhSachCongViec = [];
let danhSachLichTuan = [];

try {
  const duLieuHocTap = JSON.parse(localStorage.getItem(HOC_TAP_KEY) || "[]");
  if (Array.isArray(duLieuHocTap)) danhSachCongViec = duLieuHocTap;
} catch {
  danhSachCongViec = [];
}

try {
  const duLieuLichTuan = JSON.parse(localStorage.getItem(LICH_TUAN_KEY) || "[]");
  if (Array.isArray(duLieuLichTuan)) danhSachLichTuan = duLieuLichTuan;
} catch {
  danhSachLichTuan = [];
  thongBaoLichTuan("Không thể đọc lịch đã lưu trong trình duyệt.", true);
}

function luuDanhSachHocTap() {
  try {
    localStorage.setItem(HOC_TAP_KEY, JSON.stringify(danhSachCongViec));
    return true;
  } catch (error) {
    thongBaoCsvHocTap("Không thể lưu dữ liệu trên trình duyệt.", true);
    return false;
  }
}

function dinhDangNgayHocTap(ngay) {
  if (!ngay) return "Không có deadline";
  const [nam, thang, ngayTrongThang] = ngay.split("-");
  return `${ngayTrongThang}/${thang}/${nam}`;
}

function thongBaoLichTuan(noiDung, laLoi) {
  const thongBao = document.getElementById("thongBaoLichTuan");
  if (!thongBao) return;
  thongBao.textContent = noiDung;
  thongBao.className = laLoi
    ? "thongBaoDuLieu canhBaoVuot"
    : "thongBaoDuLieu";
}

function luuLichTuan() {
  try {
    localStorage.setItem(LICH_TUAN_KEY, JSON.stringify(danhSachLichTuan));
    return true;
  } catch (error) {
    thongBaoLichTuan("Không thể lưu lịch trong trình duyệt.", true);
    return false;
  }
}

function renderLichTuan() {
  const danhSach = document.getElementById("danhSachLichTuan");
  if (!danhSach) return;
  const ngayTrongTuan = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  danhSach.replaceChildren();
  if (danhSachLichTuan.length === 0) {
    const trong = document.createElement("li");
    trong.className = "trong";
    trong.textContent = "Chưa có hoạt động nào trong lịch tuần.";
    danhSach.append(trong);
    return;
  }

  danhSachLichTuan
    .slice()
    .sort((a, b) => {
      const thuA = Number(a.day) === 0 ? 7 : Number(a.day);
      const thuB = Number(b.day) === 0 ? 7 : Number(b.day);
      return thuA - thuB || a.start.localeCompare(b.start);
    })
    .forEach((hoatDong) => {
      const muc = document.createElement("li");
      muc.className = "mucLichTuan";
      const thongTin = document.createElement("div");
      const ten = document.createElement("strong");
      ten.textContent = hoatDong.activity;
      const chiTiet = document.createElement("small");
      chiTiet.textContent =
        ngayTrongTuan[Number(hoatDong.day)] +
        " • " +
        hoatDong.start +
        "–" +
        hoatDong.end;
      thongTin.append(ten, chiTiet);

      const nutXoa = document.createElement("button");
      nutXoa.type = "button";
      nutXoa.className = "nutXoa";
      nutXoa.textContent = "Xóa";
      nutXoa.addEventListener("click", () => {
        danhSachLichTuan = danhSachLichTuan.filter(
          (mucHienTai) => mucHienTai.id !== hoatDong.id,
        );
        if (luuLichTuan()) renderLichTuan();
      });
      muc.append(thongTin, nutXoa);
      danhSach.append(muc);
    });
}

function themHoatDongVaoLich(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const activity = form.elements.activity.value.trim();
  const day = Number(form.elements.day.value);
  const start = form.elements.start.value;
  const end = form.elements.end.value;
  if (!activity || !start || !end || start >= end) {
    thongBaoLichTuan("Nhập tên hoạt động và giờ kết thúc sau giờ bắt đầu.", true);
    return;
  }

  const biTrung = danhSachLichTuan.some(
    (muc) => Number(muc.day) === day && start < muc.end && end > muc.start,
  );
  if (biTrung) {
    thongBaoLichTuan("Khung giờ này bị trùng với hoạt động khác trong ngày.", true);
    return;
  }

  const hoatDong = { id: Date.now(), activity, day, start, end };
  danhSachLichTuan.push(hoatDong);
  if (!luuLichTuan()) {
    danhSachLichTuan.pop();
    return;
  }
  form.reset();
  renderLichTuan();
  thongBaoLichTuan("Đã thêm hoạt động vào lịch tuần.", false);
}

function datLaiLichTuan() {
  danhSachLichTuan = [
    { id: Date.now(), activity: "Học tiếng Anh", day: 1, start: "08:00", end: "09:00" },
    { id: Date.now() + 1, activity: "Làm bài tập", day: 3, start: "14:00", end: "16:00" },
  ];
  if (luuLichTuan()) {
    renderLichTuan();
    thongBaoLichTuan("Đã đặt lại bằng 2 hoạt động mẫu.", false);
  }
}

function thongBaoCsvHocTap(noiDung, laLoi) {
  const thongBao = document.getElementById("thongBaoCsvHocTap");
  if (!thongBao) return;
  thongBao.textContent = noiDung;
  thongBao.style.color = laLoi ? "#d6452f" : "";
}

function docTepCsvHocTap(tep) {
  const doc = new FileReader();
  doc.onload = () => {
    document.getElementById("csvHocTap").value = doc.result;
    thongBaoCsvHocTap("Đã đọc tệp. Bấm nút nhập để tiếp tục.", false);
  };
  doc.onerror = () => {
    thongBaoCsvHocTap("Không đọc được tệp CSV trên thiết bị.", true);
  };
  doc.readAsText(tep, "UTF-8");
}

function nhapCsvHocTap() {
  const rows = parseCsvRows(document.getElementById("csvHocTap").value);
  const cot = ["mon_hoc", "noi_dung", "deadline"];
  if (rows.length === 0) {
    thongBaoCsvHocTap("Tệp CSV rỗng. Hãy chọn tệp hoặc dán dữ liệu.", true);
    return;
  }
  if (rows[0].join(",") !== cot.join(",")) {
    thongBaoCsvHocTap(
      `Tên cột không đúng. Cần đúng thứ tự: ${cot.join(", ")}`,
      true,
    );
    return;
  }
  if (rows.length === 1) {
    thongBaoCsvHocTap("CSV chưa có dòng dữ liệu nào.", true);
    return;
  }

  const loi = [];
  const viecMoi = [];
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const soDong = i + 1;
    if (row.length !== cot.length) {
      loi.push(`Dòng ${soDong}: thiếu hoặc thừa trường.`);
      continue;
    }
    const [subject, task, deadline] = row;
    if (!subject || !task) {
      loi.push(`Dòng ${soDong}: thiếu môn học hoặc nội dung.`);
      continue;
    }
    if (deadline && !laNgayISOHopLe(deadline)) {
      loi.push(`Dòng ${soDong}: deadline không hợp lệ (YYYY-MM-DD).`);
      continue;
    }

    const congViec = {
      id: Date.now() + i,
      subject,
      task,
      deadline,
      done: false,
    };
    const biTrung = danhSachCongViec.concat(viecMoi).some((item) =>
      item.subject.toLowerCase() === subject.toLowerCase() &&
      item.task.toLowerCase() === task.toLowerCase() &&
      item.deadline === deadline
    );
    if (biTrung) {
      loi.push(`Dòng ${soDong}: bài tập này đã bị trùng.`);
      continue;
    }
    viecMoi.push(congViec);
  }

  if (loi.length) {
    thongBaoCsvHocTap(loi.join(" "), true);
    return;
  }
  if (!viecMoi.length) {
    thongBaoCsvHocTap("CSV chưa có bài tập hợp lệ để nhập.", true);
    return;
  }

  const danhSachCu = danhSachCongViec;
  danhSachCongViec = danhSachCongViec.concat(viecMoi);
  if (!luuDanhSachHocTap()) {
    danhSachCongViec = danhSachCu;
    return;
  }
  renderDanhSachHocTap();
  document.getElementById("csvHocTap").value = "";
  document.getElementById("tepCsvHocTap").value = "";
  thongBaoCsvHocTap(`Đã nhập ${viecMoi.length} bài tập / công việc.`, false);
}

function datLaiDuLieuMauHocTap() {
  const ngay = new Date();
  ngay.setDate(ngay.getDate() + 2);
  const deadline =
    ngay.getFullYear() +
    "-" +
    String(ngay.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(ngay.getDate()).padStart(2, "0");
  const mau = [
    { id: Date.now(), subject: "Toán", task: "Ôn tập chương 1", deadline, done: false },
    { id: Date.now() + 1, subject: "Lập trình", task: "Làm bài thực hành", deadline, done: true },
  ];
  const danhSachCu = danhSachCongViec;
  danhSachCongViec = mau;
  if (!luuDanhSachHocTap()) {
    danhSachCongViec = danhSachCu;
    return;
  }
  renderDanhSachHocTap();
  thongBaoCsvHocTap("Đã đặt lại bằng 2 bài tập mẫu để kiểm thử.", false);
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

    if (deadline && !laNgayISOHopLe(deadline)) {
      thongBaoCsvHocTap("Vui lòng nhập deadline hợp lệ.", true);
      return;
    }
    const congViec = {
      id: Date.now(),
      subject,
      task,
      deadline,
      done: false,
    };
    danhSachCongViec.unshift(congViec);
    if (!luuDanhSachHocTap()) {
      danhSachCongViec.shift();
      return;
    }
    form.reset();
    renderDanhSachHocTap();
    thongBaoCsvHocTap("Đã thêm bài tập / công việc.", false);
  });

  renderDanhSachHocTap();
  const tepCsv = document.getElementById("tepCsvHocTap");
  tepCsv.addEventListener("change", () => {
    if (tepCsv.files && tepCsv.files[0]) docTepCsvHocTap(tepCsv.files[0]);
  });
  document
    .getElementById("nutNhapCsvHocTap")
    .addEventListener("click", nhapCsvHocTap);
  document
    .getElementById("nutDatLaiHocTap")
    .addEventListener("click", datLaiDuLieuMauHocTap);
}

const formLichTuan = document.getElementById("formLichTuan");
if (formLichTuan) {
  formLichTuan.addEventListener("submit", themHoatDongVaoLich);
  document
    .getElementById("nutDatLaiLichTuan")
    .addEventListener("click", datLaiLichTuan);
  renderLichTuan();
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
