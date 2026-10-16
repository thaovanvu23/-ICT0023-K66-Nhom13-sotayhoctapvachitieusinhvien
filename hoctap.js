const HOCTAP_KEY = "hoctap_data";
let hocTaps = JSON.parse(localStorage.getItem(HOCTAP_KEY) || "[]");

function saveHocTap() {
  localStorage.setItem(HOCTAP_KEY, JSON.stringify(hocTaps));
}

function addHocTap(e) {
  e.preventDefault();
  const form = e.target;
  const subject = form.subject.value.trim();
  const task = form.task.value.trim();
  const deadline = form.deadline.value;

  if (!subject || !task) {
    alert("Vui lòng nhập môn học và nội dung bài tập!");
    return;
  }

  hocTaps.unshift({ id: Date.now(), subject, task, deadline, done: false });
  saveHocTap();
  form.reset();
  renderHocTap();
  renderTongQuan();
}

function toggleHocTap(id) {
  const item = hocTaps.find((h) => h.id === id);
  if (item) item.done = !item.done;
  saveHocTap();
  renderHocTap();
  renderTongQuan();
}

function deleteHocTap(id) {
  hocTaps = hocTaps.filter((h) => h.id !== id);
  saveHocTap();
  renderHocTap();
  renderTongQuan();
}

function renderHocTap() {
  const list = document.getElementById("danhSachHocTap");
  const progress = document.getElementById("tienDoHocTap");
  if (!list) return;

  const done = hocTaps.filter((h) => h.done).length;
  progress.textContent = `${done}/${hocTaps.length}`;

  if (hocTaps.length === 0) {
    list.innerHTML = '<p class="trong">Chưa có bài tập nào.</p>';
    return;
  }

  list.innerHTML = hocTaps
    .map(
      (h) => `
    <li class="muc ${h.done ? "hoanThanh" : ""}">
      <input type="checkbox" ${h.done ? "checked" : ""} onchange="toggleHocTap(${h.id})" />
      <div class="mucThongTin">
        <span class="mucTen">${h.task}</span>
        <span class="mucChiTiet">${h.subject}${h.deadline ? " · Hạn: " + h.deadline : ""}</span>
      </div>
      <button class="nutXoa" onclick="deleteHocTap(${h.id})" title="Xóa">✕</button>
    </li>`,
    )
    .join("");
}

window.getHocTapSummary = function () {
  const done = hocTaps.filter((h) => h.done).length;
  return {
    total: hocTaps.length,
    done,
  };
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("formHocTap").addEventListener("submit", addHocTap);
  renderHocTap();
  renderTongQuan();
});
