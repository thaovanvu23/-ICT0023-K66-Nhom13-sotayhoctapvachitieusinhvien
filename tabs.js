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
const SO_DU_BAN_DAU_KEY = "so_du_ban_dau";

function renderTongQuan() {
  const ct = window.getChiTieuSummary
    ? window.getChiTieuSummary()
    : { total: 0, recent: [] };
  const ht = window.getHocTapSummary
    ? window.getHocTapSummary()
    : { total: 0, done: 0 };

  document.getElementById("tongChiTieu").textContent =
    ct.total.toLocaleString("vi-VN") + " ₫";
  const soDuBanDau = Number(localStorage.getItem(SO_DU_BAN_DAU_KEY) || 0);
  document.getElementById("soDuHienTai").textContent =
    (soDuBanDau - ct.total).toLocaleString("vi-VN") + " ₫";
  document.getElementById("tienDoHocTapTongQuan").textContent =
    ht.done + "/" + ht.total;

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

document.getElementById("formSoDu").addEventListener("submit", (e) => {
  e.preventDefault();
  const soDuBanDau = Number(e.target.soDuBanDau.value);
  if (!Number.isFinite(soDuBanDau) || soDuBanDau < 0) return;

  localStorage.setItem(SO_DU_BAN_DAU_KEY, String(soDuBanDau));
  e.target.reset();
  renderTongQuan();
});
