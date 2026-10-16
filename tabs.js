document.querySelectorAll(".nutTab").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".nutTab")
      .forEach((b) => b.classList.remove("dangChon"));
    document
      .querySelectorAll(".khungTab")
      .forEach((p) => p.classList.remove("dangChon"));
    btn.classList.add("dangChon");
    document.getElementById(btn.dataset.tab).classList.add("dangChon");
    if (btn.dataset.tab === "tongQuan") renderTongQuan();
  });
});

const CHE_DO_TOI_KEY = "che_do_toi";
const nutChuyenCheDo = document.getElementById("nutChuyenCheDo");

function capNhatCheDoToi(cheDoToi) {
  document.body.classList.toggle("dark-mode", cheDoToi);
  nutChuyenCheDo.setAttribute("aria-pressed", String(cheDoToi));
  nutChuyenCheDo.textContent = cheDoToi ? "☀️ Chế độ sáng" : "🌙 Chế độ tối";
}

capNhatCheDoToi(localStorage.getItem(CHE_DO_TOI_KEY) === "true");
nutChuyenCheDo.addEventListener("click", () => {
  const cheDoToi = !document.body.classList.contains("dark-mode");
  localStorage.setItem(CHE_DO_TOI_KEY, String(cheDoToi));
  capNhatCheDoToi(cheDoToi);
});

// ===== Tab Tổng quan =====
function vuaKichThuocSoDu() {
  const soDu = document.getElementById("soDuHienTai");
  soDu.style.fontSize = "30px";
  if (!soDu.clientWidth) return;

  const tiLe = Math.min(1, soDu.clientWidth / soDu.scrollWidth);
  if (tiLe < 1) {
    soDu.style.fontSize = Math.max(8, 30 * tiLe) + "px";
  }
}

window.addEventListener("resize", vuaKichThuocSoDu);

function renderTongQuan() {
  const ct = window.getChiTieuSummary
    ? window.getChiTieuSummary()
    : { total: 0, recent: [] };
  const ht = window.getHocTapSummary
    ? window.getHocTapSummary()
    : { total: 0, done: 0 };

  document.getElementById("tongChiTieu").textContent =
    ct.total.toLocaleString("vi-VN") + " ₫";
  const conLai = Number(ct.remaining ?? Number(ct.income || 0) - ct.total);
  document.getElementById("soDuHienTai").textContent =
    conLai.toLocaleString("vi-VN") + " ₫";
  vuaKichThuocSoDu();
  document.getElementById("tienDoHocTapTongQuan").textContent =
    ht.done + "/" + ht.total;

  const deadlineGanNhat = document.getElementById("deadlineGanNhat");
  deadlineGanNhat.replaceChildren();
  if (!ht.nearest) {
    const trong = document.createElement("li");
    trong.textContent = "Chưa có deadline sắp tới.";
    deadlineGanNhat.append(trong);
  } else {
    const muc = document.createElement("li");
    muc.className = "mucDeadlineGanNhat";

    const thongTin = document.createElement("span");
    thongTin.className = "thongTinDeadline";
    const tieuDe = document.createElement("strong");
    tieuDe.textContent = ht.nearest.subject;
    const noiDung = document.createElement("span");
    noiDung.textContent = ht.nearest.task;
    thongTin.append(tieuDe, noiDung);

    const ngayHetHan = new Date(`${ht.nearest.deadline}T00:00:00`);
    const homNay = new Date();
    homNay.setHours(0, 0, 0, 0);
    const soNgay = Math.round((ngayHetHan - homNay) / 86400000);
    const trangThai =
      soNgay < 0
        ? `Quá hạn ${Math.abs(soNgay)} ngày`
        : soNgay === 0
          ? "Hạn hôm nay"
          : `Còn ${soNgay} ngày`;
    const han = document.createElement("span");
    han.className = `hanDeadline${soNgay < 0 ? " quaHan" : ""}`;
    const ngay = document.createElement("strong");
    ngay.textContent = ht.nearest.deadline.split("-").reverse().join("/");
    const nhanTrangThai = document.createElement("small");
    nhanTrangThai.textContent = trangThai;
    han.append(ngay, nhanTrangThai);

    muc.append(thongTin, han);
    deadlineGanNhat.append(muc);
  }

  const recent = document.getElementById("hoatDongGanDay");
  recent.innerHTML = ct.recent.length
    ? ct.recent
        .map(
          (c) =>
            `<li><span>${c.name}</span><b>${c.amount.toLocaleString("vi-VN")} ₫</b></li>`,
        )
        .join("")
    : "<li>Chưa có hoạt động gần đây.</li>";

  const chiTieuTheoDanhMuc = document.getElementById("chiTieuTheoDanhMuc");
  const danhMucs = Object.entries(ct.byCategory || {});
  chiTieuTheoDanhMuc.innerHTML = danhMucs.length
    ? danhMucs
        .sort((a, b) => b[1].total - a[1].total)
        .map(
          ([category, summary]) => `
            <tr>
              <td>${category}</td>
              <td>${summary.count}</td>
              <td>${summary.total.toLocaleString("vi-VN")} ₫</td>
            </tr>`,
        )
        .join("")
    : '<tr><td colspan="3" class="bangTrong">Chưa có khoản chi tiêu nào.</td></tr>';
}
