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

// ===== Tab Tổng quan =====
function renderTongQuan() {
  const ct = window.getChiTieuSummary
    ? window.getChiTieuSummary()
    : { total: 0, recent: [] };
  const ht = window.getHocTapSummary
    ? window.getHocTapSummary()
    : { total: 0, done: 0 };

  document.getElementById("tongChiTieu").textContent =
    ct.total.toLocaleString("vi-VN") + " ₫";
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
}
