// chitieu.js - phần Thu / Chi (Thông)
// Dùng được trên mọi trang: trang Chi tiêu có form + danh sách,
// trang chủ chỉ cần đọc dữ liệu để tổng hợp.
var KHOA_CHI_TIEU = "chiTieu";
var KHOA_NGAN_SACH = "nganSachThang";
var danhSachChi = []; // mỗi khoản có type: "chi" hoặc "thu"

var DANH_MUC_CHI = ["Ăn uống", "Di chuyển", "Học tập", "Giải trí", "Khác"];
var DANH_MUC_THU = ["Gia đình gửi", "Làm thêm", "Học bổng", "Khác"];

var formChiTieu = document.getElementById("formChiTieu");
var khungDanhSach = document.getElementById("danhSachChiTieu");
var oNhapSoTien = formChiTieu ? formChiTieu.elements["amount"] : null;

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
    return true;
  } catch (e) {
    return false;
  }
}

function homNay() {
  var d = new Date();
  var thang = String(d.getMonth() + 1).padStart(2, "0");
  var ngay = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + thang + "-" + ngay;
}

function thangHienTai() {
  return homNay().slice(0, 7);
}

function hienThiNganSach() {
  var oThang = document.getElementById("thangThongKe");
  if (!oThang) return;

  var thang = oThang.value;
  var duChi = danhSachChi.filter(function (khoan) {
    return khoan.type !== "thu" && khoan.date.slice(0, 7) === thang;
  });
  var tongChiThang = duChi.reduce(function (tong, khoan) {
    return tong + Number(khoan.amount || 0);
  }, 0);
  document.getElementById("tongChiThang").textContent =
    dinhDangTien(tongChiThang);

  var oDuBao = document.getElementById("uocTinhThang");
  var canhBao = document.getElementById("canhBaoNganSach");
  var ngayChon = new Date(Number(thang.slice(0, 4)), Number(thang.slice(5, 7)) - 1, 1);
  var homNayDate = new Date();
  var ngayDauThangNay = new Date(
    homNayDate.getFullYear(),
    homNayDate.getMonth(),
    1,
  );
  var soNgayTrongThang = new Date(
    ngayChon.getFullYear(),
    ngayChon.getMonth() + 1,
    0,
  ).getDate();
  var soNgayDaQua = 0;
  if (ngayChon < ngayDauThangNay) {
    soNgayDaQua = soNgayTrongThang;
  } else if (
    ngayChon.getFullYear() === ngayDauThangNay.getFullYear() &&
    ngayChon.getMonth() === ngayDauThangNay.getMonth()
  ) {
    soNgayDaQua = homNayDate.getDate();
  }
  oDuBao.textContent = soNgayDaQua
    ? dinhDangTien(Math.round((tongChiThang / soNgayDaQua) * soNgayTrongThang))
    : "Chưa có dữ liệu để ước tính";

  try {
    var nganSachTheoThang = JSON.parse(
      localStorage.getItem(KHOA_NGAN_SACH) || "{}",
    );
    var nganSach = Number(nganSachTheoThang[thang] || 0);
    document.getElementById("nganSachThang").value =
      nganSach > 0 ? nganSach : "";
    if (!nganSach) {
      canhBao.textContent = "Nhập ngân sách tháng để bật cảnh báo.";
      canhBao.className = "thongBaoDuLieu";
    } else if (tongChiThang > nganSach) {
      canhBao.textContent =
        "Đã vượt ngân sách " + dinhDangTien(tongChiThang - nganSach) + ".";
      canhBao.className = "thongBaoDuLieu canhBaoVuot";
    } else if (tongChiThang === nganSach) {
      canhBao.textContent = "Bạn đã dùng hết ngân sách tháng.";
      canhBao.className = "thongBaoDuLieu canhBaoVuot";
    } else if (tongChiThang >= nganSach * 0.8) {
      canhBao.textContent =
        "Đã dùng " +
        Math.floor((tongChiThang / nganSach) * 100) +
        "% ngân sách. Bạn sắp chạm hạn mức.";
      canhBao.className = "thongBaoDuLieu canhBaoSapVuot";
    } else {
      canhBao.textContent =
        "Còn lại " + dinhDangTien(nganSach - tongChiThang) + " ngân sách.";
      canhBao.className = "thongBaoDuLieu";
    }
  } catch (error) {
    canhBao.textContent = "Không đọc được ngân sách đã lưu.";
    canhBao.className = "thongBaoDuLieu canhBaoVuot";
  }
}

function luuNganSachThang() {
  var thang = document.getElementById("thangThongKe").value;
  var nganSach = Number(document.getElementById("nganSachThang").value);
  var canhBao = document.getElementById("canhBaoNganSach");
  if (!thang || !Number.isSafeInteger(nganSach) || nganSach <= 0) {
    canhBao.textContent = "Nhập ngân sách là số nguyên lớn hơn 0.";
    canhBao.className = "thongBaoDuLieu canhBaoVuot";
    return;
  }

  try {
    var nganSachTheoThang = JSON.parse(
      localStorage.getItem(KHOA_NGAN_SACH) || "{}",
    );
    nganSachTheoThang[thang] = nganSach;
    localStorage.setItem(KHOA_NGAN_SACH, JSON.stringify(nganSachTheoThang));
  } catch (error) {
    canhBao.textContent = "Không thể lưu ngân sách trong trình duyệt.";
    canhBao.className = "thongBaoDuLieu canhBaoVuot";
    return;
  }
  hienThiNganSach();
}

function thongBaoNhapChiTieu(noiDung, laLoi) {
  var thongBao = document.getElementById("thongBaoCsvChiTieu");
  if (!thongBao) return;
  thongBao.textContent = noiDung;
  thongBao.style.color = laLoi ? "#d6452f" : "";
}

function docTepCsvChiTieu(tep) {
  var doc = new FileReader();
  doc.onload = function () {
    document.getElementById("csvChiTieu").value = doc.result;
    thongBaoNhapChiTieu("Đã đọc tệp. Bấm nút nhập để tiếp tục.", false);
  };
  doc.onerror = function () {
    thongBaoNhapChiTieu("Không đọc được tệp CSV trên thiết bị.", true);
  };
  doc.readAsText(tep, "UTF-8");
}

function nhapCsvChiTieu() {
  var rows = parseCsvRows(document.getElementById("csvChiTieu").value);
  var cot = ["loai", "noi_dung", "so_tien", "danh_muc", "ngay"];
  if (rows.length === 0) {
    thongBaoNhapChiTieu("Tệp CSV rỗng. Hãy chọn tệp hoặc dán dữ liệu.", true);
    return;
  }
  if (rows[0].join(",") !== cot.join(",")) {
    thongBaoNhapChiTieu(
      "Tên cột không đúng. Cần đúng thứ tự: " + cot.join(", "),
      true,
    );
    return;
  }
  if (rows.length === 1) {
    thongBaoNhapChiTieu("CSV chưa có dòng dữ liệu nào.", true);
    return;
  }

  var loi = [];
  var khoanMoi = [];
  for (var i = 1; i < rows.length; i += 1) {
    var row = rows[i];
    var soDong = i + 1;
    if (row.length !== cot.length) {
      loi.push("Dòng " + soDong + ": thiếu hoặc thừa trường.");
      continue;
    }
    if (row.some(function (value) { return value === ""; })) {
      loi.push("Dòng " + soDong + ": còn thiếu trường bắt buộc.");
      continue;
    }

    var type = row[0];
    var amountText = row[2];
    var amount = Number(amountText);
    var category = row[3];
    if (type !== "chi" && type !== "thu") {
      loi.push("Dòng " + soDong + ": loại khoản phải là “chi” hoặc “thu”.");
      continue;
    }
    if (
      !/^\d+$/.test(amountText) ||
      !Number.isSafeInteger(amount) ||
      amount <= 0
    ) {
      loi.push("Dòng " + soDong + ": số tiền phải là số nguyên dương hợp lệ.");
      continue;
    }
    if (
      !(type === "thu" ? DANH_MUC_THU : DANH_MUC_CHI).includes(category)
    ) {
      loi.push("Dòng " + soDong + ": danh mục không hợp lệ với loại khoản.");
      continue;
    }
    if (!laNgayISOHopLe(row[4])) {
      loi.push("Dòng " + soDong + ": ngày không hợp lệ (YYYY-MM-DD).");
      continue;
    }

    var khoan = {
      id: Date.now() + i,
      type: type,
      name: row[1],
      amount: amount,
      category: category,
      date: row[4],
    };
    var biTrung = danhSachChi.concat(khoanMoi).some(function (item) {
      return item.type === khoan.type &&
        item.name.toLowerCase() === khoan.name.toLowerCase() &&
        item.amount === khoan.amount &&
        item.category === khoan.category &&
        item.date === khoan.date;
    });
    if (biTrung) {
      loi.push("Dòng " + soDong + ": khoản này đã bị trùng.");
      continue;
    }
    khoanMoi.push(khoan);
  }

  if (loi.length) {
    thongBaoNhapChiTieu(loi.join(" "), true);
    return;
  }
  if (!khoanMoi.length) {
    thongBaoNhapChiTieu("CSV chưa có khoản hợp lệ để nhập.", true);
    return;
  }

  var danhSachCu = danhSachChi;
  danhSachChi = danhSachChi.concat(khoanMoi);
  if (!luuDuLieu()) {
    danhSachChi = danhSachCu;
    thongBaoNhapChiTieu(
      "Không thể lưu dữ liệu trên trình duyệt. CSV chưa được nhập.",
      true,
    );
    return;
  }
  hienThiChiTieu();
  document.getElementById("csvChiTieu").value = "";
  document.getElementById("tepCsvChiTieu").value = "";
  thongBaoNhapChiTieu(
    "Đã nhập " + khoanMoi.length + " khoản thu / chi.",
    false,
  );
}

function datLaiDuLieuMauChiTieu() {
  var ngay = homNay();
  var mau = [
    {
      id: Date.now(),
      type: "chi",
      name: "Cà phê",
      amount: 25000,
      category: "Ăn uống",
      date: ngay,
    },
    {
      id: Date.now() + 1,
      type: "chi",
      name: "Xe buýt",
      amount: 7000,
      category: "Di chuyển",
      date: ngay,
    },
    {
      id: Date.now() + 2,
      type: "thu",
      name: "Tiền làm thêm",
      amount: 500000,
      category: "Làm thêm",
      date: ngay,
    },
  ];
  var danhSachCu = danhSachChi;
  danhSachChi = mau;
  if (!luuDuLieu()) {
    danhSachChi = danhSachCu;
    thongBaoNhapChiTieu("Không thể lưu dữ liệu mẫu trên trình duyệt.", true);
    return;
  }
  hienThiChiTieu();
  thongBaoNhapChiTieu("Đã đặt lại bằng 3 khoản mẫu để kiểm thử.", false);
}

// đổi danh mục theo loại đang chọn
function capNhatDanhMuc() {
  if (!formChiTieu) return;
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

// bảng chi tiêu theo danh mục (trang Chi tiêu)
function hienThiBangDanhMuc() {
  var tbody = document.getElementById("bangChiTheoDanhMuc");
  if (!tbody) return;
  var tongHop = window.getChiTieuSummary().byCategory;
  var dong = Object.keys(tongHop).sort(function (a, b) {
    return tongHop[b].total - tongHop[a].total;
  });
  tbody.innerHTML = "";
  if (dong.length === 0) {
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.colSpan = 3;
    td.className = "bangTrong";
    td.textContent = "Chưa có khoản chi tiêu nào.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
  dong.forEach(function (ten) {
    var tr = document.createElement("tr");
    [ten, tongHop[ten].count, dinhDangTien(tongHop[ten].total)].forEach(
      function (giaTri) {
        var td = document.createElement("td");
        td.textContent = giaTri;
        tr.appendChild(td);
      },
    );
    tbody.appendChild(tr);
  });
}

function hienThiChiTieu() {
  if (!khungDanhSach) return;
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

  document.getElementById("tongTienThu").textContent = dinhDangTien(tongThu);
  document.getElementById("tongTienChiTieu").textContent =
    dinhDangTien(tongChi);
  hienThiBangDanhMuc();
  hienThiNganSach();
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

docDuLieu();

if (formChiTieu) {
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

    var soTien = Number(String(du.get("amount")).replace(/\D/g, ""));
    var tenKhoan = String(du.get("name")).trim();
    var ngay = String(du.get("date"));
    var khoan = {
      id: Date.now(),
      type: du.get("type"),
      name: tenKhoan,
      amount: soTien,
      category: du.get("category"),
      date: ngay,
    };
    if (!tenKhoan || !Number.isSafeInteger(soTien) || soTien <= 0) {
      thongBaoNhapChiTieu(
        "Tên khoản và số tiền nguyên dương hợp lệ là bắt buộc.",
        true,
      );
      return;
    }
    if (!laNgayISOHopLe(ngay)) {
      thongBaoNhapChiTieu("Vui lòng nhập ngày hợp lệ.", true);
      return;
    }
    var loai = du.get("type");
    danhSachChi.push(khoan);
    if (!luuDuLieu()) {
      danhSachChi.pop();
      thongBaoNhapChiTieu("Không thể lưu dữ liệu trên trình duyệt.", true);
      return;
    }
    hienThiChiTieu();
    formChiTieu.reset();
    formChiTieu.elements["type"].value = loai; // giữ loại vừa chọn
    capNhatDanhMuc();
    formChiTieu.elements["date"].value = homNay();
  });

  formChiTieu.elements["date"].value = homNay();
  document.getElementById("thangThongKe").value = thangHienTai();
  capNhatDanhMuc();
  hienThiChiTieu();
  document
    .getElementById("thangThongKe")
    .addEventListener("change", hienThiNganSach);
  document
    .getElementById("nutLuuNganSach")
    .addEventListener("click", luuNganSachThang);
  hienThiNganSach();

  var tepCsv = document.getElementById("tepCsvChiTieu");
  tepCsv.addEventListener("change", function () {
    if (tepCsv.files && tepCsv.files[0]) {
      docTepCsvChiTieu(tepCsv.files[0]);
    }
  });
  document
    .getElementById("nutNhapCsvChiTieu")
    .addEventListener("click", nhapCsvChiTieu);
  document
    .getElementById("nutDatLaiChiTieu")
    .addEventListener("click", datLaiDuLieuMauChiTieu);
}
