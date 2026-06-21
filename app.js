// State
let movies = [];
let isAdmin = false;
let currentGenreFilter = 'all';
let currentTypeFilter = 'all';
let searchQuery = '';
let sortBy = 'rating-desc';
let visitorWatched = [];
let hideWatchedFilter = false;

// Predefined Gradient Fallbacks for Covers based on Genres
const GENRE_GRADIENTS = {
  action: 'linear-gradient(135deg, #f12711, #f5af19)',
  horror: 'linear-gradient(135deg, #1b0000, #050508, #4a0e17)',
  thriller: 'linear-gradient(135deg, #1f4068, #162447, #0f1016)',
  war: 'linear-gradient(135deg, #283048, #0e121a, #859398)',
  'sci-fi': 'linear-gradient(135deg, #0575e6, #021b79, #08080c)',
  drama: 'linear-gradient(135deg, #3a7bd5, #3a6073, #12121a)',
  mystery: 'linear-gradient(135deg, #4b6cb7, #182848, #0a0e17)',
  default: 'linear-gradient(135deg, #2c3e50, #000000, #1f242d)'
};

// DOM Elements
const movieGrid = document.getElementById('movie-grid');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const typeFilters = document.getElementById('type-filters');
const genreFilters = document.getElementById('genre-filters');
const excludeWatchedBtn = document.getElementById('exclude-watched-btn');
const watchedCountEl = document.getElementById('watched-count');
const resultsCount = document.getElementById('results-count');
const displayTitle = document.getElementById('display-title');
const logoBtn = document.getElementById('logo-btn');

// Stats Elements
const statTotal = document.getElementById('stat-total');
const statAvgRating = document.getElementById('stat-avg-rating');
const statMovies = document.getElementById('stat-movies');
const statSeries = document.getElementById('stat-series');

// Admin Elements
const curatorTrigger = document.getElementById('curator-trigger');
const adminLogoutBtn = document.getElementById('admin-logout-btn');
const addMovieBtn = document.getElementById('add-movie-btn');
const changePasscodeBtn = document.getElementById('change-passcode-btn');
const adminBadgeContainer = document.getElementById('admin-badge-container');
const exportBtn = document.getElementById('export-btn');
const importBtnTrigger = document.getElementById('import-btn-trigger');
const importFile = document.getElementById('import-file');

// Modals
const detailModal = document.getElementById('detail-modal');
const loginModal = document.getElementById('login-modal');
const editModal = document.getElementById('edit-modal');
const passcodeModal = document.getElementById('passcode-modal');

// Modal Close Triggers
const detailCloseBtn = document.getElementById('detail-modal-close-btn');
const detailBackdrop = document.getElementById('detail-modal-close-backdrop');
const loginCloseBtn = document.getElementById('login-modal-close-btn');
const loginBackdrop = document.getElementById('login-modal-close-backdrop');
const loginCancelBtn = document.getElementById('login-modal-cancel-btn');
const editCloseBtn = document.getElementById('edit-modal-close-btn');
const editBackdrop = document.getElementById('edit-modal-close-backdrop');
const editCancelBtn = document.getElementById('edit-modal-cancel-btn');
const passcodeCloseBtn = document.getElementById('passcode-modal-close-btn');
const passcodeBackdrop = document.getElementById('passcode-modal-close-backdrop');
const passcodeCancelBtn = document.getElementById('passcode-modal-cancel-btn');

// Drawer / Hamburger elements
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const sidebar = document.querySelector('.sidebar');
const sidebarBackdrop = document.getElementById('sidebar-backdrop');
const sidebarCloseBtn = document.getElementById('sidebar-close-btn');

// Forms
const loginForm = document.getElementById('login-form');
const editForm = document.getElementById('edit-movie-form');
const changePasscodeForm = document.getElementById('change-passcode-form');
const passcodeInput = document.getElementById('passcode-input');

// Surprise Me Button
const surpriseBtn = document.getElementById('surprise-btn');

// Toast notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = '';
  if (type === 'success') {
    icon = `<svg style="width:18px;height:18px;fill:#2ecc71;" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
  } else if (type === 'error') {
    icon = `<svg style="width:18px;height:18px;fill:#ff5252;" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`;
  } else {
    icon = `<svg style="width:18px;height:18px;fill:var(--primary-accent);" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;
  }

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove toast
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Check admin status
function checkAdminStatus() {
  isAdmin = localStorage.getItem('cineshelf_admin') === 'true';
  updateAdminUI();
}

function updateAdminUI() {
  if (isAdmin) {
    adminLogoutBtn.style.display = 'inline-flex';
    addMovieBtn.style.display = 'inline-flex';
    changePasscodeBtn.style.display = 'inline-flex';
    exportBtn.style.display = 'inline-flex';
    importBtnTrigger.style.display = 'inline-flex';
    adminBadgeContainer.innerHTML = `
      <div class="admin-badge-floating">
        <svg style="width:12px;height:12px;fill:currentColor;" viewBox="0 0 24 24">
          <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H8.9V6z"/>
        </svg>
        Curator Mode
      </div>
    `;
  } else {
    adminLogoutBtn.style.display = 'none';
    addMovieBtn.style.display = 'none';
    changePasscodeBtn.style.display = 'none';
    exportBtn.style.display = 'none';
    importBtnTrigger.style.display = 'none';
    adminBadgeContainer.innerHTML = '';
  }
}

// Load Movies from Storage or seed data
function loadMovies() {
  const stored = localStorage.getItem('cineshelf_movies');
  if (stored) {
    try {
      movies = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse localStorage movies, falling back to seeds.", e);
      movies = [...INITIAL_MOVIES];
    }
  } else {
    movies = [...INITIAL_MOVIES];
    saveToLocalStorage();
  }

  // Load visitor watched list
  const storedWatched = localStorage.getItem('cineshelf_visitor_watched');
  if (storedWatched) {
    try {
      visitorWatched = JSON.parse(storedWatched);
    } catch (e) {
      visitorWatched = [];
    }
  } else {
    visitorWatched = [];
  }
}

function saveToLocalStorage() {
  localStorage.setItem('cineshelf_movies', JSON.stringify(movies));
}

function saveVisitorWatched() {
  localStorage.setItem('cineshelf_visitor_watched', JSON.stringify(visitorWatched));
}

// Update Stats Board
function updateStats(filteredMovies) {
  statTotal.textContent = movies.length;
  
  const movieCount = movies.filter(m => m.type === 'movie').length;
  const seriesCount = movies.filter(m => m.type === 'series').length;
  
  statMovies.textContent = movieCount;
  statSeries.textContent = seriesCount;

  if (movies.length > 0) {
    const sum = movies.reduce((acc, m) => acc + parseFloat(m.personalRating || 0), 0);
    const avg = sum / movies.length;
    statAvgRating.textContent = avg.toFixed(1);
  } else {
    statAvgRating.textContent = '0.0';
  }
}

// Filter and Sort movies
function getFilteredAndSortedMovies() {
  let result = [...movies];

  // Genre Filter
  if (currentGenreFilter !== 'all') {
    result = result.filter(m => m.genres && m.genres.includes(currentGenreFilter));
  }

  // Type Filter
  if (currentTypeFilter !== 'all') {
    result = result.filter(m => m.type === currentTypeFilter);
  }

  // Hide Watched Filter
  if (hideWatchedFilter) {
    result = result.filter(m => !visitorWatched.includes(m.id));
  }

  // Search Filter
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    result = result.filter(m => 
      m.title.toLowerCase().includes(query) ||
      (m.director && m.director.toLowerCase().includes(query)) ||
      (m.cast && m.cast.toLowerCase().includes(query)) ||
      (m.review && m.review.toLowerCase().includes(query))
    );
  }

  // Sorting
  result.sort((a, b) => {
    switch (sortBy) {
      case 'rating-desc':
        return parseFloat(b.rating || 0) - parseFloat(a.rating || 0);
      case 'personal-desc':
        return parseFloat(b.personalRating || 0) - parseFloat(a.personalRating || 0);
      case 'year-desc':
        return parseInt(b.year || 0) - parseInt(a.year || 0);
      case 'year-asc':
        return parseInt(a.year || 0) - parseInt(b.year || 0);
      case 'title-asc':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return result;
}

// Render Genre Counts dynamically
function updateFilterCounts() {
  // Update Type counts
  document.getElementById('count-all').textContent = movies.length;
  document.getElementById('count-movies').textContent = movies.filter(m => m.type === 'movie').length;
  document.getElementById('count-series').textContent = movies.filter(m => m.type === 'series').length;

  // Update Genre counts
  const genresList = ['horror', 'thriller', 'action', 'war', 'sci-fi', 'drama', 'mystery'];
  
  document.getElementById('genre-count-all').textContent = movies.length;
  
  genresList.forEach(genre => {
    const count = movies.filter(m => m.genres && m.genres.includes(genre)).length;
    const elementId = `genre-count-${genre.replace('-', '')}`;
    const el = document.getElementById(elementId);
    if (el) el.textContent = count;
  });

  // Update Visitor Watched count
  if (watchedCountEl) {
    watchedCountEl.textContent = visitorWatched.length;
  }
}

// Main Render Loop
function render() {
  const filtered = getFilteredAndSortedMovies();
  resultsCount.textContent = filtered.length;
  
  // Render display title
  let typeTitle = currentTypeFilter === 'all' ? 'All' : (currentTypeFilter === 'movie' ? 'Movies' : 'Series');
  let genreTitle = currentGenreFilter === 'all' ? 'Titles' : `${currentGenreFilter.charAt(0).toUpperCase() + currentGenreFilter.slice(1)}`;
  displayTitle.innerHTML = `${typeTitle} ${genreTitle}`;

  // Clear Grid
  movieGrid.innerHTML = '';

  if (filtered.length === 0) {
    movieGrid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <h4>No movies found</h4>
        <p>Try adjusting your filters or search keywords.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(movie => {
    // Determine Cover Art style
    let coverHTML = '';
    if (movie.coverUrl && movie.coverUrl.trim() !== '') {
      coverHTML = `<img src="${movie.coverUrl}" alt="${movie.title}" class="card-poster" loading="lazy">`;
    } else {
      // Create fallback beautiful gradient
      const primaryGenre = movie.genres && movie.genres.length > 0 ? movie.genres[0] : 'default';
      const gradient = GENRE_GRADIENTS[primaryGenre] || GENRE_GRADIENTS.default;
      coverHTML = `
        <div style="background: ${gradient}; width:100%; height:100%; position:absolute; top:0; left:0; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:1.5rem; text-align:center;">
          <svg style="width:40px;height:40px;fill:rgba(255,255,255,0.15);margin-bottom:1rem;" viewBox="0 0 24 24">
            <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
          </svg>
          <div style="font-family:var(--font-heading); font-weight:800; font-size:1.1rem; color:#fff; text-shadow: 0 2px 8px rgba(0,0,0,0.6);">${movie.title}</div>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.5rem; text-transform:uppercase; letter-spacing:0.05em;">No Poster Available</div>
        </div>
      `;
    }

    // Genre Tag rendering (show top 2 tags)
    const genreTagsHTML = movie.genres ? movie.genres.slice(0, 2).map(g => `<span class="genre-tag">${g}</span>`).join('') : '';

    // Admin action buttons
    const adminActionsHTML = isAdmin ? `
      <div class="card-actions" onclick="event.stopPropagation();">
        <button class="action-btn-circle" onclick="editMovie('${movie.id}')" title="Edit movie">
          <svg style="width:14px;height:14px;fill:currentColor;" viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="action-btn-circle delete" onclick="deleteMovie('${movie.id}')" title="Delete movie">
          <svg style="width:14px;height:14px;fill:currentColor;" viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      </div>
    ` : '';

    // Card element creation
    const card = document.createElement('div');
    const isWatched = visitorWatched.includes(movie.id);
    card.className = `movie-card ${isWatched ? 'visitor-watched' : ''}`;
    card.dataset.id = movie.id;
    card.onclick = () => openDetailModal(movie.id);

    card.innerHTML = `
      <div class="card-poster-container">
        ${coverHTML}
        <div class="card-overlay-badges">
          <span class="type-badge ${movie.type}">${movie.type}</span>
          <span class="rating-badge">
            <svg viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
            ${movie.rating || 'N/A'}
          </span>
        </div>
        <button class="watched-toggle ${isWatched ? 'active' : ''}" onclick="event.stopPropagation(); toggleVisitorWatched('${movie.id}')" title="${isWatched ? 'Mark as unwatched' : 'Mark as watched'}">
          <svg style="width:14px;height:14px;fill:currentColor;" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </button>
      </div>
      <div class="card-content">
        <div class="card-genres">${genreTagsHTML}</div>
        <h4 class="card-title" title="${movie.title}">${movie.title}</h4>
        <div class="card-meta">${movie.year} &bull; Dir: ${movie.director || 'Unknown'}</div>
        <p class="card-review-preview">${movie.review || 'No review written.'}</p>
        <div class="card-footer">
          <div class="personal-rating-container">
            <span class="personal-rating-label">CineScore</span>
            <span class="personal-rating-value"><span>★</span> ${movie.personalRating || 'N/A'}/10</span>
          </div>
          ${adminActionsHTML}
        </div>
      </div>
    `;
    movieGrid.appendChild(card);
  });

  // Re-sync stats based on current database state
  updateStats(filtered);
  updateFilterCounts();
}

// Modal Toggle Helpers
function toggleModal(modal, show) {
  if (show) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Detail Modal
function openDetailModal(id) {
  const movie = movies.find(m => m.id === id);
  if (!movie) return;

  const titleEl = document.getElementById('detail-title');
  const yearEl = document.getElementById('detail-year');
  const typeEl = document.getElementById('detail-type-badge');
  const directorEl = document.getElementById('detail-director');
  const castEl = document.getElementById('detail-cast');
  const personalRatingEl = document.getElementById('detail-personal-rating');
  const publicRatingEl = document.getElementById('detail-public-rating');
  const reviewEl = document.getElementById('detail-review');
  const trailerBtn = document.getElementById('detail-trailer-btn');
  const posterImg = document.getElementById('detail-poster');
  const genresContainer = document.getElementById('detail-genres');
  const directorLabel = document.getElementById('detail-director-label');

  // Fill content
  titleEl.textContent = movie.title;
  yearEl.textContent = movie.year;
  
  typeEl.className = `type-badge ${movie.type}`;
  typeEl.textContent = movie.type;

  if (movie.director) {
    directorEl.textContent = movie.director;
    directorLabel.style.display = 'inline';
  } else {
    directorLabel.style.display = 'none';
  }

  castEl.textContent = movie.cast && movie.cast.trim() !== '' ? movie.cast : 'Not specified';
  personalRatingEl.textContent = movie.personalRating || 'N/A';
  publicRatingEl.textContent = movie.rating || 'N/A';
  reviewEl.textContent = movie.review || 'No review written yet.';

  // Genres
  genresContainer.innerHTML = '';
  if (movie.genres) {
    movie.genres.forEach(g => {
      const span = document.createElement('span');
      span.className = 'genre-tag';
      span.textContent = g;
      genresContainer.appendChild(span);
    });
  }

  // Cover image fallback
  if (movie.coverUrl && movie.coverUrl.trim() !== '') {
    posterImg.src = movie.coverUrl;
    posterImg.style.display = 'block';
  } else {
    // Generate static preview poster style instead of broken image
    const primaryGenre = movie.genres && movie.genres.length > 0 ? movie.genres[0] : 'default';
    const gradient = GENRE_GRADIENTS[primaryGenre] || GENRE_GRADIENTS.default;
    posterImg.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="270" viewBox="0 0 200 270"><rect width="200" height="270" fill="url(%23grad)"/><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%232c3e50;stop-opacity:1"/><stop offset="100%" style="stop-color:%23000000;stop-opacity:1"/></linearGradient></defs><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" fill="white" font-size="16">CineShelf</text></svg>`;
  }

  // Links
  if (movie.linkUrl && movie.linkUrl.trim() !== '') {
    trailerBtn.href = movie.linkUrl;
    trailerBtn.style.display = 'inline-flex';
  } else {
    trailerBtn.style.display = 'none';
  }

  toggleModal(detailModal, true);
}

// Edit/Add modal
function openEditModal(id = null) {
  const isEdit = id !== null;
  const titleEl = document.getElementById('edit-modal-title');
  const saveBtn = document.getElementById('save-movie-btn');

  // Reset form
  editForm.reset();
  document.getElementById('edit-movie-id').value = id || '';
  
  // Uncheck all genre checkboxes
  const checkboxes = document.querySelectorAll('#edit-genres-container input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);

  if (isEdit) {
    const movie = movies.find(m => m.id === id);
    if (!movie) return;

    titleEl.textContent = 'Edit Recommendation';
    saveBtn.textContent = 'Save Changes';

    // Populate Fields
    document.getElementById('edit-title').value = movie.title;
    document.getElementById('edit-year').value = movie.year;
    document.getElementById('edit-type').value = movie.type;
    document.getElementById('edit-personal-rating').value = movie.personalRating;
    document.getElementById('edit-rating').value = movie.rating;
    document.getElementById('edit-director').value = movie.director || '';
    document.getElementById('edit-cast').value = movie.cast || '';
    document.getElementById('edit-cover').value = movie.coverUrl || '';
    document.getElementById('edit-link').value = movie.linkUrl || '';
    document.getElementById('edit-review').value = movie.review || '';

    // Check movie genres
    if (movie.genres) {
      movie.genres.forEach(g => {
        const checkbox = document.querySelector(`#edit-genres-container input[value="${g}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }
  } else {
    titleEl.textContent = 'Add Recommendation';
    saveBtn.textContent = 'Add Recommendation';
  }

  toggleModal(editModal, true);
}

// Edit and Delete triggers exported globally so inline HTML onclick handlers can find them
window.editMovie = function(id) {
  openEditModal(id);
};

window.deleteMovie = function(id) {
  const movie = movies.find(m => m.id === id);
  if (!movie) return;

  if (confirm(`Are you sure you want to delete the recommendation for "${movie.title}"?`)) {
    movies = movies.filter(m => m.id !== id);
    saveToLocalStorage();
    showToast(`Deleted "${movie.title}" successfully`, 'success');
    render();
  }
};

// Form submit helper for Add/Edit
editForm.onsubmit = function(event) {
  event.preventDefault();

  const id = document.getElementById('edit-movie-id').value;
  const isEdit = id !== '';

  const title = document.getElementById('edit-title').value.trim();
  const year = parseInt(document.getElementById('edit-year').value);
  const type = document.getElementById('edit-type').value;
  const personalRating = parseFloat(document.getElementById('edit-personal-rating').value);
  const rating = parseFloat(document.getElementById('edit-rating').value);
  const director = document.getElementById('edit-director').value.trim();
  const cast = document.getElementById('edit-cast').value.trim();
  const coverUrl = document.getElementById('edit-cover').value.trim();
  const linkUrl = document.getElementById('edit-link').value.trim();
  const review = document.getElementById('edit-review').value.trim();

  // Selected genres
  const checkboxes = document.querySelectorAll('#edit-genres-container input[type="checkbox"]:checked');
  const selectedGenres = Array.from(checkboxes).map(cb => cb.value);

  if (selectedGenres.length === 0) {
    showToast('Please select at least one genre.', 'error');
    return;
  }

  if (isEdit) {
    // Update existing
    const idx = movies.findIndex(m => m.id === id);
    if (idx !== -1) {
      movies[idx] = {
        ...movies[idx],
        title,
        year,
        type,
        personalRating,
        rating,
        director,
        cast,
        coverUrl,
        linkUrl,
        review,
        genres: selectedGenres
      };
      showToast(`Updated "${title}" successfully`, 'success');
    }
  } else {
    // Add new
    const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const newMovie = {
      id: newId,
      title,
      year,
      type,
      personalRating,
      rating,
      director,
      cast,
      coverUrl,
      linkUrl,
      review,
      genres: selectedGenres
    };
    movies.unshift(newMovie);
    showToast(`Added "${title}" to CineShelf`, 'success');
  }

  saveToLocalStorage();
  toggleModal(editModal, false);
  render();
};

// Admin authentication passcode handling
loginForm.onsubmit = function(event) {
  event.preventDefault();
  const password = passcodeInput.value;
  const correctPasscode = localStorage.getItem('cineshelf_passcode') || 'admin';

  if (password === correctPasscode) {
    isAdmin = true;
    localStorage.setItem('cineshelf_admin', 'true');
    checkAdminStatus();
    toggleModal(loginModal, false);
    showToast('Authenticated as Curator successfully!', 'success');
    
    // Rerender so that edit/delete controls appear on cards
    render();
  } else {
    showToast('Invalid passcode. Try again.', 'error');
    passcodeInput.value = '';
    passcodeInput.focus();
  }
};

// Change Passcode Form handling
changePasscodeForm.onsubmit = function(event) {
  event.preventDefault();
  const currentPass = document.getElementById('current-passcode-input').value;
  const newPass = document.getElementById('new-passcode-input').value;
  const confirmPass = document.getElementById('confirm-passcode-input').value;
  
  const correctPasscode = localStorage.getItem('cineshelf_passcode') || 'admin';
  
  if (currentPass !== correctPasscode) {
    showToast('Current passcode is incorrect.', 'error');
    return;
  }
  
  if (newPass.length < 4) {
    showToast('New passcode must be at least 4 characters.', 'error');
    return;
  }
  
  if (newPass !== confirmPass) {
    showToast('Confirm passcode does not match new passcode.', 'error');
    return;
  }
  
  localStorage.setItem('cineshelf_passcode', newPass);
  toggleModal(passcodeModal, false);
  showToast('Passcode updated successfully!', 'success');
};

// Logout
adminLogoutBtn.onclick = function() {
  isAdmin = false;
  localStorage.setItem('cineshelf_admin', 'false');
  checkAdminStatus();
  showToast('Logged out from curator mode', 'info');
  render();
};

// "Surprise Me" Randomizer
surpriseBtn.onclick = function() {
  const filtered = getFilteredAndSortedMovies();
  if (filtered.length === 0) {
    showToast('No titles available to recommend based on current filters.', 'error');
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filtered.length);
  const randomMovie = filtered[randomIndex];
  
  showToast(`How about watching "${randomMovie.title}"?`, 'info');
  
  // Show detail modal
  setTimeout(() => {
    openDetailModal(randomMovie.id);
  }, 300);
};

// Search trigger
searchInput.oninput = function(e) {
  searchQuery = e.target.value;
  render();
};

// Sorting trigger
sortSelect.onchange = function(e) {
  sortBy = e.target.value;
  render();
};

// Type filter click handlers
typeFilters.addEventListener('click', e => {
  const btn = e.target.closest('.filter-chip');
  if (!btn) return;

  // Set active class
  typeFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');

  currentTypeFilter = btn.dataset.type;
  render();
});

// Genre filter click handlers
genreFilters.addEventListener('click', e => {
  const btn = e.target.closest('.filter-chip');
  if (!btn) return;

  // Set active class
  genreFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');

  currentGenreFilter = btn.dataset.genre;
  render();
});

// Logo resets all filters
logoBtn.onclick = function() {
  searchInput.value = '';
  searchQuery = '';
  
  sortSelect.value = 'rating-desc';
  sortBy = 'rating-desc';

  typeFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  typeFilters.querySelector('[data-type="all"]').classList.add('active');
  currentTypeFilter = 'all';

  genreFilters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  genreFilters.querySelector('[data-genre="all"]').classList.add('active');
  currentGenreFilter = 'all';

  hideWatchedFilter = false;
  if (excludeWatchedBtn) excludeWatchedBtn.classList.remove('active');

  render();
  showToast('Filters cleared', 'info');
};

// Toggle visitor watched state helper
window.toggleVisitorWatched = function(id) {
  const index = visitorWatched.indexOf(id);
  const movie = movies.find(m => m.id === id);
  const title = movie ? movie.title : 'Title';
  
  if (index === -1) {
    visitorWatched.push(id);
    showToast(`Marked "${title}" as watched`, 'success');
  } else {
    visitorWatched.splice(index, 1);
    showToast(`Removed "${title}" from watched list`, 'info');
  }
  
  saveVisitorWatched();
  render();
};

// Exclude watched filter trigger
if (excludeWatchedBtn) {
  excludeWatchedBtn.onclick = function() {
    hideWatchedFilter = !hideWatchedFilter;
    if (hideWatchedFilter) {
      excludeWatchedBtn.classList.add('active');
      showToast('Hiding titles you have watched', 'info');
    } else {
      excludeWatchedBtn.classList.remove('active');
      showToast('Showing all titles', 'info');
    }
    render();
  };
}

// Backup/JSON exports and imports
exportBtn.onclick = function() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(movies, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `cineshelf_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Database exported successfully', 'success');
};

importBtnTrigger.onclick = function() {
  importFile.click();
};

importFile.onchange = function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const importedData = JSON.parse(evt.target.result);
      if (Array.isArray(importedData)) {
        // Validate at least one item
        if (importedData.length === 0 || (importedData[0].title && importedData[0].id)) {
          movies = importedData;
          saveToLocalStorage();
          render();
          showToast(`Successfully imported ${importedData.length} recommendations!`, 'success');
        } else {
          showToast('Invalid data format. Expected CineShelf structure.', 'error');
        }
      } else {
        showToast('Invalid data format. Expected JSON Array.', 'error');
      }
    } catch (err) {
      showToast('Error parsing file: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
  // Reset input file value
  importFile.value = '';
};

// Event Listeners for Modal Toggles
if (curatorTrigger) {
  curatorTrigger.onclick = () => {
    passcodeInput.value = '';
    toggleModal(loginModal, true);
    setTimeout(() => passcodeInput.focus(), 150);
  };
}
addMovieBtn.onclick = () => openEditModal();
changePasscodeBtn.onclick = () => {
  changePasscodeForm.reset();
  toggleModal(passcodeModal, true);
  setTimeout(() => document.getElementById('current-passcode-input').focus(), 150);
};

// Modal Close Listeners
detailCloseBtn.onclick = () => toggleModal(detailModal, false);
detailBackdrop.onclick = () => toggleModal(detailModal, false);

loginCloseBtn.onclick = () => toggleModal(loginModal, false);
loginBackdrop.onclick = () => toggleModal(loginModal, false);
loginCancelBtn.onclick = () => toggleModal(loginModal, false);

editCloseBtn.onclick = () => toggleModal(editModal, false);
editBackdrop.onclick = () => toggleModal(editModal, false);
editCancelBtn.onclick = () => toggleModal(editModal, false);

passcodeCloseBtn.onclick = () => toggleModal(passcodeModal, false);
passcodeBackdrop.onclick = () => toggleModal(passcodeModal, false);
passcodeCancelBtn.onclick = () => toggleModal(passcodeModal, false);

// Escape key to close any active modal or drawer
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    toggleModal(detailModal, false);
    toggleModal(loginModal, false);
    toggleModal(editModal, false);
    toggleModal(passcodeModal, false);
    closeDrawer();
  }
});

// Hamburger Drawer helpers
function openDrawer() {
  sidebar.classList.add('active');
  sidebarBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  sidebar.classList.remove('active');
  sidebarBackdrop.classList.remove('active');
  document.body.style.overflow = '';
}

// Hamburger Drawer event listeners
if (menuToggleBtn) menuToggleBtn.onclick = openDrawer;
if (sidebarCloseBtn) sidebarCloseBtn.onclick = closeDrawer;
if (sidebarBackdrop) sidebarBackdrop.onclick = closeDrawer;

// Close drawer automatically when a filter is selected on mobile
[typeFilters, genreFilters].forEach(group => {
  if (!group) return;
  group.addEventListener('click', () => {
    if (window.innerWidth <= 1024) closeDrawer();
  });
});

const excludeWatchedBtnEl = document.getElementById('exclude-watched-btn');
if (excludeWatchedBtnEl) {
  excludeWatchedBtnEl.addEventListener('click', () => {
    if (window.innerWidth <= 1024) closeDrawer();
  });
}

// Initialization
function init() {
  loadMovies();
  checkAdminStatus();
  render();
}

window.onload = init;
