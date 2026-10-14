// --- JAVASCRIPT CHO PHẦN DEADLINE / HỌC TẬP ---

document.addEventListener('DOMContentLoaded', () => {
  const deadlineForm = document.getElementById('deadline-form');
  const deadlineList = document.getElementById('deadline-list');
  const filterTrangThai = document.getElementById('filter-trang-thai');
  const searchDeadline = document.getElementById('search-deadline');

  // Lấy dữ liệu từ localStorage hoặc mảng rỗng
  let deadlines = JSON.parse(localStorage.getItem('list_deadlines')) || [];

  // Hàm lưu và render lại
  function saveAndRender() {
    localStorage.setItem('list_deadlines', JSON.stringify(deadlines));
    renderDeadlines();
  }

  // Format lại ngày giờ hiển thị đẹp hơn
  function formatDateTime(datetimeStr) {
    if (!datetimeStr) return '';
    const date = new Date(datetimeStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Render danh sách ra bảng
  function renderDeadlines() {
    let filtered = [...deadlines];

    // Lọc theo trạng thái
    const statusVal = filterTrangThai.value;
    if (statusVal !== 'tat-ca') {
      filtered = filtered.filter(item => item.trangThai === statusVal);
    }

    // Tìm kiếm theo môn học hoặc việc cần làm
    const keyword = searchDeadline.value.toLowerCase().trim();
    if (keyword) {
      filtered = filtered.filter(item => 
        item.monHoc.toLowerCase().includes(keyword) || 
        item.viecCanLam.toLowerCase().includes(keyword)
      );
    }

    // Kiểm tra nếu danh sách trống
    if (filtered.length === 0) {
      deadlineList.innerHTML = `
        <tr>
          <td colspan="5" class="empty-row">Không tìm thấy deadline nào phù hợp.</td>
        </tr>
      `;
      return;
    }

    // Đổ dữ liệu vào HTML
    deadlineList.innerHTML = filtered.map((item, index) => {
      // Tìm vị trí thật trong mảng gốc để thao tác đúng index
      const realIndex = deadlines.findIndex(d => d.id === item.id);
      
      const statusBadge = item.trangThai === 'da-hoan-thanh' 
        ? `<span class="badge da-hoan-thanh">Đã hoàn thành</span>` 
        : `<span class="badge chua-hoan-thanh">Chưa hoàn thành</span>`;

      const priorityBadge = item.mucDo === 'khan-cap' 
        ? `<span class="badge khan-cap">Khẩn cấp</span>` : '';

      return `
        <tr>
          <td><strong>${escapeHtml(item.monHoc)}</strong> ${priorityBadge}</td>
          <td>${escapeHtml(item.viecCanLam)}</td>
          <td>${formatDateTime(item.hanChot)}</td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn-action btn-complete" onclick="toggleComplete(${realIndex})">
              ${item.trangThai === 'da-hoan-thanh' ? 'Hoàn tác' : 'Hoàn thành'}
            </button>
            <button class="btn-action btn-delete" onclick="deleteDeadline(${realIndex})">Xóa</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Chống lỗi XSS cơ bản cho dữ liệu người dùng nhập
  function escapeHtml(text) {
    const map = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  // Sự kiện Submit Form thêm deadline
  deadlineForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const monHoc = document.getElementById('mon-hoc').value.trim();
    const viecCanLam = document.getElementById('viec-can-lam').value.trim();
    const hanChot = document.getElementById('han-chot').value;
    const mucDo = document.getElementById('muc-do').value;

    const newDeadline = {
      id: Date.now().toString(),
      monHoc,
      viecCanLam,
      hanChot,
      mucDo,
      trangThai: 'chua-hoan-thanh'
    };

    deadlines.push(newDeadline);
    saveAndRender();
    deadlineForm.reset();
  });

  // Gắn các hàm thao tác vào window để nút bấm gọi được trực tiếp từ HTML onclick
  window.toggleComplete = function(index) {
    deadlines[index].trangThai = deadlines[index].trangThai === 'da-hoan-thanh' 
      ? 'chua-hoan-thanh' 
      : 'da-hoan-thanh';
    saveAndRender();
  }

  window.deleteDeadline = function(index) {
    if (confirm('Bạn có chắc muốn xóa deadline này không?')) {
      deadlines.splice(index, 1);
      saveAndRender();
    }
  }

  // Sự kiện khi thay đổi bộ lọc hoặc ô tìm kiếm
  filterTrangThai.addEventListener('change', renderDeadlines);
  searchDeadline.addEventListener('input', renderDeadlines);

  // Chạy render lần đầu khi tải trang
  renderDeadlines();
});