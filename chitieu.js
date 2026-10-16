// chitieu.js - phần Thu / Chi (Thông)
var KHOA_CHI_TIEU = "chiTieu";
var danhSachChi = []; // mỗi khoản có type: "chi" hoặc "thu"

var DANH_MUC_CHI = ["Ăn uống", "Di chuyển", "Học tập", "Giải trí", "Khác"];
var DANH_MUC_THU = ["Gia đình gửi", "Làm thêm", "Học bổng", "Khác"];

var formChiTieu = document.getElementById("formChiTieu");
var khungDanhSach = document.getElementById("danhSachChiTieu");
var oNhapSoTien = formChiTieu.elements["amount"];

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
  document.getElementById("tongTienChiTieu").textContent =
    dinhDangTien(tongChi);
  if (typeof renderTongQuan === "function") renderTongQuan();
}

window.getChiTieuSummary = function () {
  var chiTieu = danhSachChi.filter(function (khoan) {
    return khoan.type !== "thu";
  });
  var tongChi = chiTieu.reduce(function (tong, khoan) {
    return tong + Number(khoan.amount || 0);
  }, 0);
  var tongThu = danhSachChi.reduce(function (tong, khoan) {
    return tong + (khoan.type === "thu" ? Number(khoan.amount || 0) : 0);
  }, 0);
  var byCategory = chiTieu.reduce(function (summary, khoan) {
    var category = khoan.category || "Khác";
    if (!summary[category]) summary[category] = { count: 0, total: 0 };
    summary[category].count += 1;
    summary[category].total += Number(khoan.amount || 0);
    return summary;
  }, {});
  var recent = chiTieu.slice().sort(function (a, b) {
    return b.date.localeCompare(a.date) || b.id - a.id;
  });

  return {
    total: tongChi,
    income: tongThu,
    remaining: tongThu - tongChi,
    recent: recent.slice(0, 5),
    byCategory: byCategory,
  };
};

formChiTieu.elements["type"].addEventListener("change", capNhatDanhMuc);

oNhapSoTien.addEventListener("input", function () {
  var viTriConTro = oNhapSoTien.selectionStart;
  var soChuSoTruocConTro = oNhapSoTien.value
    .slice(0, viTriConTro)
    .replace(/\D/g, "").length;
  var chuoiSo = oNhapSoTien.value.replace(/\D/g, "");
  var daDinhDang = chuoiSo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  oNhapSoTien.value = daDinhDang;
  var viTriMoi = 0;
  var soChuSoDaGap = 0;
  while (viTriMoi < daDinhDang.length && soChuSoDaGap < soChuSoTruocConTro) {
    if (/\d/.test(daDinhDang[viTriMoi])) soChuSoDaGap += 1;
    viTriMoi += 1;
  }
  oNhapSoTien.setSelectionRange(viTriMoi, viTriMoi);
});

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

  var loai = du.get("type");
  luuDuLieu();
  hienThiChiTieu();
  formChiTieu.reset();
  formChiTieu.elements["type"].value = loai; // giữ loại vừa chọn
  capNhatDanhMuc();
  formChiTieu.elements["date"].value = homNay();
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
