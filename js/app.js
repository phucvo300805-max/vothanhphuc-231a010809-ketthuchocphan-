/* ==========================================================================
   DỮ LIỆU PHIM MẪU (Mock Data)
   ========================================================================== */
const moviesData = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    genres: ["Hành động", "Khoa học viễn tưởng", "Kịch tính"],
    rating: 8.8,
    director: "Christopher Nolan",
    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
    description: "Một tên trộm chuyên đánh cắp bí mật thông qua tiềm thức của mục tiêu trong trạng thái mơ được giao nhiệm vụ cấy một ý tưởng ngược lại vào tâm trí CEO.",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Interstellar",
    year: 2014,
    genres: ["Khoa học viễn tưởng", "Phiêu lưu", "Kịch tính"],
    rating: 8.7,
    director: "Christopher Nolan",
    cast: "Matthew McConaughey, Anne Hathaway, Jessica Chastain",
    description: "Một nhóm nhà thám hiểm không gian du hành qua một lỗ giun mới được phát hiện để đảm bảo sự sống còn cho nhân loại.",
    poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    genres: ["Hành động", "Tội phạm", "Kịch tính"],
    rating: 9.0,
    director: "Christopher Nolan",
    cast: "Christian Bale, Heath Ledger, Aaron Eckhart",
    description: "Khi mối đe dọa mang tên Joker tàn phá thành phố Gotham, Batman phải chấp nhận đối mặt với thử thách lớn nhất về tâm lý và thể xác.",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Spirited Away",
    year: 2001,
    genres: ["Hoạt hình", "Phiêu lưu", "Giả tưởng"],
    rating: 8.6,
    director: "Hayao Miyazaki",
    cast: "Rumi Hiiragi, Miyu Irino, Mari Natsuki",
    description: "Cô bé Chihiro lạc vào một thế giới kỳ lạ nơi cha mẹ bị biến thành heo. Cô phải làm việc tại nhà tắm của các vị thần để giải cứu gia đình.",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "The Matrix",
    year: 1999,
    genres: ["Hành động", "Khoa học viễn tưởng"],
    rating: 8.7,
    director: "Lana Wachowski, Lilly Wachowski",
    cast: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
    description: "Một hacker máy tính phát hiện ra rằng thực tại mà anh đang sống thực chất là một mô phỏng ảo được tạo ra bởi máy móc.",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop"
  }
];

/* ==========================================================================
   KHỞI TẠO ỨNG DỤNG & DOM ELEMENTS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDynamicFilters();
  renderMovies(moviesData);
  initModal();
});

/* ==========================================================================
   1. CHỨC NĂNG LIGHT / DARK MODE & LOCALSTORAGE
   ========================================================================== */
function initThemeToggle() {
  const themeCheckbox = document.getElementById('checkbox-theme');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeCheckbox) themeCheckbox.checked = true;
  }

  if (themeCheckbox) {
    themeCheckbox.addEventListener('change', function () {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }
}

/* ==========================================================================
   2. HIỂN THỊ DANH SÁCH PHIM (MOVIE CARDS)
   ========================================================================== */
function renderMovies(movies) {
  const gridContainer = document.querySelector('.movie-grid');
  if (!gridContainer) return;

  if (movies.length === 0) {
    gridContainer.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <i class="fa-solid fa-face-sad-tear" style="font-size: 2.5rem; margin-bottom: 0.5rem;"></i>
        <p>Không tìm thấy bộ phim phù hợp với tiêu chí của bạn!</p>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = movies.map(movie => `
    <article class="movie-card" data-id="${movie.id}">
      <div class="poster-wrapper">
        <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" loading="lazy">
        <span class="movie-badge">${movie.year}</span>
      </div>
      <div class="movie-info">
        <h3 class="movie-title">${movie.title}</h3>
        <p class="movie-year"><i class="fa-regular fa-calendar"></i> ${movie.year} &bull; ⭐ ${movie.rating}</p>
      </div>
    </article>
  `).join('');

  // Gắn sự kiện click mở modal cho từng card phim mới render
  document.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
      const movieId = Number(card.getAttribute('data-id'));
      openMovieModal(movieId);
    });
  });
}

/* ==========================================================================
   3. TẠO BỘ LỌC ĐỘNG & TÌM KIẾM (DEBOUNCE 400MS)
   ========================================================================== */
function initDynamicFilters() {
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  // Lấy danh sách thể loại độc lập (không trùng lặp) từ mảng dữ liệu
  const allGenres = [...new Set(moviesData.flatMap(movie => movie.genres))];

  // Render HTML cho bộ lọc vào Sidebar
  sidebar.innerHTML = `
    <div class="sidebar-section">
      <h3 class="sidebar-title"><i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm</h3>
      <div class="search-box-wrapper" style="margin-top: 0.75rem;">
        <input type="text" id="searchInput" placeholder="Nhập tên phim..." style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-primary); color: var(--text-primary); font-size: 0.9rem;">
      </div>
    </div>

    <div class="sidebar-section" style="margin-top: 1.5rem;">
      <h3 class="sidebar-title"><i class="fa-solid fa-filter"></i> Thể loại phim</h3>
      <div class="genre-checkboxes" style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.75rem;">
        ${allGenres.map(genre => `
          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; cursor: pointer; color: var(--text-primary);">
            <input type="checkbox" value="${genre}" class="genre-checkbox" style="accent-color: var(--accent-color); width: 16px; height: 16px;">
            ${genre}
          </label>
        `).join('')}
      </div>
    </div>
  `;

  // Xử lý sự kiện lọc kết hợp (Keyword & Genres)
  const searchInput = document.getElementById('searchInput');
  const genreCheckboxes = document.querySelectorAll('.genre-checkbox');

  function applyFilters() {
    const keyword = searchInput.value.trim().toLowerCase();
    const selectedGenres = Array.from(genreCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const filtered = moviesData.filter(movie => {
      // 1. Kiểm tra khớp tên phim
      const matchTitle = movie.title.toLowerCase().includes(keyword);

      // 2. Kiểm tra khớp thể loại (Phim phải chứa tất cả các thể loại được chọn)
      const matchGenres = selectedGenres.length === 0 || selectedGenres.every(g => movie.genres.includes(g));

      return matchTitle && matchGenres;
    });

    renderMovies(filtered);
  }

  // Áp dụng Debounce 400ms cho ô tìm kiếm
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFilters, 400);
  });

  // Lắng nghe sự kiện thay đổi checkbox thể loại
  genreCheckboxes.forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });
}

/* ==========================================================================
   4. MODAL CHI TIẾT PHIM
   ========================================================================== */
function initModal() {
  // Tạo khung Modal động gắn vào cuối thẻ body nếu chưa có
  if (!document.getElementById('movieModal')) {
    const modalHTML = `
      <div id="movieModal" class="movie-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(5px); z-index:1000; align-items:center; justify-content:center; padding:1rem;">
        <div class="modal-content" style="background:var(--bg-secondary); border-radius:16px; max-width:700px; width:100%; overflow:hidden; border:1px solid var(--border-color); box-shadow:var(--shadow-lg); position:relative; animation:scaleIn 0.3s ease;">
          <button id="closeModalBtn" style="position:absolute; top:1rem; right:1rem; background:rgba(0,0,0,0.5); border:none; color:#fff; width:36px; height:36px; border-radius:50%; font-size:1.2rem; cursor:pointer; display:flex; align-items:center; justify-content:center; z-index:10;"><i class="fa-solid fa-xmark"></i></button>
          <div id="modalBodyContainer"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('closeModalBtn').addEventListener('click', closeMovieModal);
    document.getElementById('movieModal').addEventListener('click', (e) => {
      if (e.target.id === 'movieModal') closeMovieModal();
    });
  }
}

function openMovieModal(movieId) {
  const movie = moviesData.find(m => m.id === movieId);
  if (!movie) return;

  const modalBody = document.getElementById('modalBodyContainer');
  modalBody.innerHTML = `
    <div style="display:flex; flex-direction:column; md-flex-direction:row;">
      <div style="width:100%; height:300px; overflow:hidden; position:relative;">
        <img src="${movie.poster}" alt="${movie.title}" style="width:100%; height:100%; object-fit:cover;">
        <div style="position:absolute; bottom:0; inset-x:0; background:linear-gradient(to top, rgba(0,0,0,0.9), transparent); padding:1.5rem; color:#fff;">
          <h2 style="font-size:1.75rem; font-weight:700; margin-bottom:0.25rem;">${movie.title} (${movie.year})</h2>
          <p style="font-size:0.9rem; opacity:0.9;">⭐ IMDb: ${movie.rating} &bull; ${movie.genres.join(', ')}</p>
        </div>
      </div>
      <div style="padding:1.5rem; display:flex; flex-direction:column; gap:1rem; color:var(--text-primary);">
        <div>
          <strong style="color:var(--accent-color);">Đạo diễn:</strong> ${movie.director}
        </div>
        <div>
          <strong style="color:var(--accent-color);">Diễn viên:</strong> ${movie.cast}
        </div>
        <div>
          <strong style="color:var(--accent-color);">Nội dung tóm tắt:</strong>
          <p style="margin-top:0.35rem; line-height:1.6; color:var(--text-secondary);">${movie.description}</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('movieModal').style.display = 'flex';
}

function closeMovieModal() {
  document.getElementById('movieModal').style.display = 'none';
}