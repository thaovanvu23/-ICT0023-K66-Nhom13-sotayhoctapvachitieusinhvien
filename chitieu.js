const STORAGE_KEY = "chiTieuList";

const form = document.getElementById("formChiTieu");
const tbody = document.getElementById("danhSachChiTieu");
const tongChiTieuElement = document.getElementById("tongChiTieu");
const tongSoDuElement = document.getElementById("tongSoDu");
const noiDungInput = document.getElementById("noiDung");
const soTienInput = document.getElementById("soTien");
const ngayChiTieuInput = document.getElementById("ngayChiTieu");

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function formatMoney(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateString) {
  if (!dateString) return "Chưa xác định";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getExpenses() {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : [];
  } catch (error) {
    console.error("Lỗi khi đọc dữ liệu chi tiêu:", error);
    return [];
  }
}

function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function createExpenseRow(expense) {
  const row = document.createElement("tr");

  const noiDungCell = document.createElement("td");
  const soTienCell = document.createElement("td");
  const ngayCell = document.createElement("td");
  const actionCell = document.createElement("td");

  noiDungCell.textContent = expense.noiDung;
  soTienCell.textContent = formatMoney(expense.soTien);
  ngayCell.textContent = formatDate(expense.ngay);

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "xoaBtn";
  deleteButton.textContent = "Xóa";
  deleteButton.addEventListener("click", () => {
    const updatedExpenses = getExpenses().filter(
      (item) => item.id !== expense.id,
    );
    saveExpenses(updatedExpenses);
    renderExpenses();
  });

  actionCell.appendChild(deleteButton);
  row.append(noiDungCell, soTienCell, ngayCell, actionCell);
  return row;
}

function renderExpenses() {
  if (!tbody) return;

  const expenses = getExpenses();
  const totalChiTieu = expenses.reduce(
    (sum, expense) => sum + Number(expense.soTien || 0),
    0,
  );
  const tongSoDu = totalChiTieu;

  if (tongChiTieuElement) {
    tongChiTieuElement.textContent = formatMoney(totalChiTieu);
  }

  if (tongSoDuElement) {
    tongSoDuElement.textContent = formatMoney(tongSoDu);
  }

  tbody.innerHTML = "";

  if (expenses.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.colSpan = 4;
    emptyCell.className = "emptyState";
    emptyCell.textContent = "Chưa có giao dịch nào.";
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
    return;
  }

  expenses.forEach((expense) => {
    tbody.appendChild(createExpenseRow(expense));
  });
}

function handleSubmit(event) {
  event.preventDefault();

  const noiDung = noiDungInput.value.trim();
  const soTienRaw = soTienInput.value
    .trim()
    .replace(/\./g, "")
    .replace(/,/g, "");
  const soTien = Number(soTienRaw);
  const ngay = ngayChiTieuInput.value || getToday();

  if (!noiDung || !Number.isFinite(soTien) || soTien <= 0) {
    alert("Vui lòng nhập nội dung và số tiền hợp lệ.");
    return;
  }

  const expenses = getExpenses();
  expenses.unshift({
    id: Date.now() + Math.random(),
    noiDung,
    soTien,
    ngay,
  });

  saveExpenses(expenses);
  form.reset();
  ngayChiTieuInput.value = getToday();
  renderExpenses();
}

if (form) {
  form.addEventListener("submit", handleSubmit);
  if (ngayChiTieuInput && !ngayChiTieuInput.value) {
    ngayChiTieuInput.value = getToday();
  }
  renderExpenses();
}
