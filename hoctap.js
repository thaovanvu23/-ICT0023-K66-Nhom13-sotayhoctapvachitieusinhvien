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

function ngayHomNayISO() {
  const homNay = new Date();
  const nam = homNay.getFullYear();
  const thang = String(homNay.getMonth() + 1).padStart(2, "0");
  const ngay = String(homNay.getDate()).padStart(2, "0");
  return `${nam}-${thang}-${ngay}`;
}

function dinhDangNgayHocTap(ngay) {
  if (!ngay) return "Không có deadline";
  const [nam, thang, ngayTrongThang] = ngay.split("-");
  return `${ngayTrongThang}/${thang}/${nam}`;
}

function renderDanhSachHocTap() {
  const danhSach = document.getElementById("danhSachHocTap");
  const tongHop = window.getHocTapSummary();
  const tienDo = `${tongHop.done}/${tongHop.total}`;
  document.getElementById("tienDoHocTap").textContent = tienDo;

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
        renderTongQuan();
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
        renderTongQuan();
      });

      hanhDong.append(nutHoanThanh, nutXoa);
      muc.append(thongTin, hanhDong);
      danhSach.append(muc);
    });
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

document.getElementById("formHocTap").addEventListener("submit", (event) => {
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
  renderTongQuan();
});

renderDanhSachHocTap();
