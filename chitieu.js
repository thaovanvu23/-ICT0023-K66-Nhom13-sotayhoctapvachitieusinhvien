// chitieu.js - phần Thu / Chi (Thông)
var KHOA_CHI_TIEU = "chiTieu";
var danhSachChi = []; // mỗi khoản có type: "chi" hoặc "thu"

var DANH_MUC_CHI = ["Ăn uống", "Di chuyển", "Học tập", "Giải trí", "Khác"];
var DANH_MUC_THU = ["Gia đình gửi", "Làm thêm", "Học bổng", "Khác"];

var formChiTieu = document.getElementById("formChiTieu");
var khungDanhSach = document.getElementById("danhSachChiTieu");

function dinhDangTien(so) {
  return so.toLocaleString("vi-VN") + " ₫";
}

function docDuLieu() {
  try {
    var data = JSON.parse(localStorage.getItem(KHOA_CHI_TIEU));
    if (Array.isArray(data)) danhSachChi = data;
  } catch (e) {}
}

function luuDuLieu() {
  try {
    localStorage.setItem(KHOA_CHI_TIEU, JSON.stringify(danhSachChi));
  } catch (e) {}
}

// đổi danh mục theo loại đang chọn
function capNhatDanhMuc() {
  var loai = formChiTieu.elements["type"].value;
  var ds = loai === "thu" ? DANH_MUC_THU : DANH_MUC_CHI;
  var o = formChiTieu.elements["category"];
  o.innerHTML = "";
  ds.forEach(function (ten) {
    var op = document.createElement("option");
    op.value = ten;
    op.textContent = ten;
    o.appendChild(op);
  });
}

function hienThiChiTieu() {
  var tongThu = 0;
  var tongChi = 0;
  khungDanhSach.innerHTML = "";

  var sapXep = danhSachChi.slice().sort(function (a, b) {
    return b.date.localeCompare(a.date) || b.id - a.id;
  });

  if (sapXep.length === 0) {
    khungDanhSach.innerHTML = "<li class='trong'>Chưa có khoản nào.</li>";
  }

  sapXep.forEach(function (khoan) {
    var laThu = khoan.type === "thu";
    if (laThu) tongThu += khoan.amount;
    else tongChi += khoan.amount;

    var ngay = khoan.date.split("-").reverse().join("/");

    var li = document.createElement("li");
    li.className = "mucChiTieu";

    var chu = document.createElement("div");
    var ten = document.createElement("b");
    ten.textContent = khoan.name;
    var chiTiet = document.createElement("small");
    chiTiet.textContent = khoan.category + " • " + ngay;
    chu.appendChild(ten);
    chu.appendChild(chiTiet);

    var tien = document.createElement("span");
    tien.className = "soTien " + (laThu ? "thu" : "chi");
    tien.textContent = (laThu ? "+" : "−") + dinhDangTien(khoan.amount);

    var nutXoa = document.createElement("button");
    nutXoa.type = "button";
    nutXoa.className = "nutXoa";
    nutXoa.textContent = "Xóa";
    nutXoa.onclick = function () {
      danhSachChi = danhSachChi.filter(function (k) {
        return k.id !== khoan.id;
      });
      luuDuLieu();
      hienThiChiTieu();
    };

    li.appendChild(chu);
    li.appendChild(tien);
    li.appendChild(nutXoa);
    khungDanhSach.appendChild(li);
  });

  var conLai = tongThu - tongChi;
  document.getElementById("tongTienThu").textContent = dinhDangTien(tongThu);
  document.getElementById("tongTienChiTieu").textContent = dinhDangTien(tongChi);
  // tab Tổng quan
  document.getElementById("tongChiTieu").textContent = dinhDangTien(tongChi);
  document.getElementById("tongThu").textContent = dinhDangTien(tongThu);
  var oConLai = document.getElementById("conLai");
  oConLai.textContent = dinhDangTien(conLai);
  oConLai.style.color = conLai < 0 ? "#d6452f" : "";
}

formChiTieu.elements["type"].addEventListener("change", capNhatDanhMuc);

formChiTieu.addEventListener("submit", function (e) {
  e.preventDefault();
  var du = new FormData(formChiTieu);

  // bỏ dấu chấm, dấu phẩy: "35.000" -> 35000
  var soTien = Number(String(du.get("amount")).replace(/\D/g, ""));
  if (soTien <= 0) {
    alert("Số tiền phải lớn hơn 0");
    return;
  }

  danhSachChi.push({
    id: Date.now(),
    type: du.get("type"),
    name: du.get("name").trim(),
    amount: soTien,
    category: du.get("category"),
    date: du.get("date"),
  });

<<<<<<< HEAD
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
=======
  var loai = du.get("type");
  luuDuLieu();
  hienThiChiTieu();
  formChiTieu.reset();
  formChiTieu.elements["type"].value = loai; // giữ loại vừa chọn
  capNhatDanhMuc();
  formChiTieu.elements["date"].value = homNay();
>>>>>>> 6b2703b26ace445957b458ac42ff064daec5c12a
});

function homNay() {
  var d = new Date();
  var thang = String(d.getMonth() + 1).padStart(2, "0");
  var ngay = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + thang + "-" + ngay;
}

formChiTieu.elements["date"].value = homNay();
docDuLieu();
capNhatDanhMuc();
hienThiChiTieu();
