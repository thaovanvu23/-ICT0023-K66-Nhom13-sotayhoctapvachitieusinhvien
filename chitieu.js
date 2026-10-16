const CHITIEU_KEY = "chitieu_data";
let chiTieus = JSON.parse(localStorage.getItem(CHITIEU_KEY) || "[]");

function saveChiTieu() {
  localStorage.setItem(CHITIEU_KEY, JSON.stringify(chiTieus));
}

function formatMoney(value) {
  return value.toLocaleString("vi-VN") + " ₫";
}

function addChiTieu(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const amount = Number(form.amount.value);
  const category = form.category.value;
  const date = form.date.value;

  if (!name || !Number.isFinite(amount) || amount <= 0) {
    alert("Vui lòng nhập tên khoản chi và số tiền hợp lệ!");
    return;
  }

  chiTieus.unshift({ id: Date.now(), name, amount, category, date });
  saveChiTieu();
  form.reset();
  renderChiTieu();
  renderTongQuan();
}

function deleteChiTieu(id) {
  chiTieus = chiTieus.filter((c) => c.id !== id);
  saveChiTieu();
  renderChiTieu();
  renderTongQuan();
}

function renderChiTieu() {
  const list = document.getElementById("danhSachChiTieu");
  const total = document.getElementById("tongTienChiTieu");
  if (!list) return;

  const sum = chiTieus.reduce((s, c) => s + c.amount, 0);
  total.textContent = formatMoney(sum);

  if (chiTieus.length === 0) {
    list.innerHTML = '<p class="trong">Chưa có khoản chi tiêu nào.</p>';
    return;
  }

  list.innerHTML = chiTieus
    .map(
      (c) => `
    <li class="muc">
      <div class="mucThongTin">
        <span class="mucTen">${c.name}</span>
        <span class="mucChiTiet">${c.category} · ${c.date}</span>
      </div>
      <div class="mucPhai">
        <span class="mucSoTien">-${formatMoney(c.amount)}</span>
        <button class="nutXoa" onclick="deleteChiTieu(${c.id})" title="Xóa">✕</button>
      </div>
    </li>`,
    )
    .join("");
}

window.getChiTieuSummary = function () {
  const theoDanhMuc = chiTieus.reduce((summary, chiTieu) => {
    const category = chiTieu.category || "Khác";
    if (!summary[category]) summary[category] = { count: 0, total: 0 };
    summary[category].count += 1;
    summary[category].total += chiTieu.amount;
    return summary;
  }, {});

  return {
    total: chiTieus.reduce((s, c) => s + c.amount, 0),
    recent: chiTieus.slice(0, 5),
    byCategory: theoDanhMuc,
  };
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formChiTieu").addEventListener("submit", addChiTieu);
  renderChiTieu();
  renderTongQuan();
});
