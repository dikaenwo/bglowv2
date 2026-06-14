import { icons } from '../components/BottomNav.js';
import { getStreak, getUserId } from '../utils/store.js';
import { showCustomAlert } from '../utils/helpers.js';
import { API_BASE_URL } from '../config.js';

function getProfilePhoto() {
  return localStorage.getItem('bglow_profile_photo_' + getUserId()) || null;
}

async function saveProfilePhoto(dataUrl) {
  const userId = getUserId();
  localStorage.setItem('bglow_profile_photo_' + userId, dataUrl);
  if (userId && userId !== 'guest') {
    try {
      await fetch(`${API_BASE_URL}/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_photo: dataUrl })
      });
    } catch (e) {
      console.error("Gagal menyimpan foto profil ke database:", e);
    }
  }
}

function openCropperModal(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const originalSrc = e.target.result;

    const overlay = document.createElement('div');
    overlay.className = 'profile-modal-overlay';

    overlay.innerHTML = `
      <div class="cropper-card">
        <div class="cropper-header">
          <h3>Potong Foto Profil</h3>
          <button class="cropper-close-btn" id="crop-close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="cropper-view-wrapper">
          <div class="cropper-outer-container">
            <img src="${originalSrc}" class="cropper-view-img" id="crop-target-img" alt="Crop Target" />
          </div>
        </div>
        <div class="cropper-zoom-row">
          <span>➖</span>
          <input type="range" class="cropper-zoom-slider" id="crop-zoom-slider" min="1" max="3" step="0.01" value="1" />
          <span>➕</span>
        </div>
        <div class="cropper-footer">
          <button class="cropper-btn cropper-btn-cancel" id="crop-cancel-btn">Batal</button>
          <button class="cropper-btn cropper-btn-save" id="crop-save-btn">Simpan</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const img = overlay.querySelector('#crop-target-img');
    const slider = overlay.querySelector('#crop-zoom-slider');
    const saveBtn = overlay.querySelector('#crop-save-btn');
    const cancelBtn = overlay.querySelector('#crop-cancel-btn');
    const closeBtn = overlay.querySelector('#crop-close-btn');

    let currentZoom = 1;
    let left = 0;
    let top = 0;
    let imgWidth = 0;
    let imgHeight = 0;
    const containerSize = 240;

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    const updateZoom = (newZoom) => {
      const cx = (containerSize / 2 - left) / currentZoom;
      const cy = (containerSize / 2 - top) / currentZoom;

      currentZoom = newZoom;

      img.style.width = (imgWidth * currentZoom) + 'px';
      img.style.height = (imgHeight * currentZoom) + 'px';

      left = containerSize / 2 - cx * currentZoom;
      top = containerSize / 2 - cy * currentZoom;

      constrainPosition();
    };

    const constrainPosition = () => {
      const w = imgWidth * currentZoom;
      const h = imgHeight * currentZoom;

      if (left > 0) left = 0;
      if (left + w < containerSize) left = containerSize - w;
      if (top > 0) top = 0;
      if (top + h < containerSize) top = containerSize - h;

      img.style.left = left + 'px';
      img.style.top = top + 'px';
    };

    img.onload = () => {
      if (img.naturalWidth > img.naturalHeight) {
        imgHeight = containerSize;
        imgWidth = (img.naturalWidth * containerSize) / img.naturalHeight;
      } else {
        imgWidth = containerSize;
        imgHeight = (img.naturalHeight * containerSize) / img.naturalWidth;
      }

      img.style.width = imgWidth + 'px';
      img.style.height = imgHeight + 'px';

      left = (containerSize - imgWidth) / 2;
      top = (containerSize - imgHeight) / 2;
      img.style.left = left + 'px';
      img.style.top = top + 'px';
    };

    // Drag events (Mouse)
    img.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDragging = true;
      startX = e.clientX - left;
      startY = e.clientY - top;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      left = e.clientX - startX;
      top = e.clientY - startY;
      constrainPosition();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Drag events (Touch)
    img.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      isDragging = true;
      startX = e.touches[0].clientX - left;
      startY = e.touches[0].clientY - top;
    });

    img.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      left = e.touches[0].clientX - startX;
      top = e.touches[0].clientY - startY;
      constrainPosition();
    });

    img.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Zoom event
    slider.addEventListener('input', () => {
      updateZoom(parseFloat(slider.value));
    });

    // Save event
    saveBtn.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');

      const F = 200 / containerSize;
      const W_draw = (imgWidth * currentZoom) * F;
      const H_draw = (imgHeight * currentZoom) * F;
      const X_draw = left * F;
      const Y_draw = top * F;

      ctx.drawImage(img, X_draw, Y_draw, W_draw, H_draw);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      overlay.remove();
      callback(dataUrl);
    });

    const closeModal = () => {
      overlay.remove();
    };

    cancelBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
  };
  reader.readAsDataURL(file);
}

function openPreviewModal(imageSrc) {
  const overlay = document.createElement('div');
  overlay.className = 'preview-modal-overlay';
  overlay.innerHTML = `
    <button class="preview-close-btn" id="preview-close-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="preview-img-container">
      <img src="${imageSrc}" class="preview-large-img" alt="Pratinjau Foto Profil" />
    </div>
  `;

  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('#preview-close-btn');
  const closeModal = () => {
    overlay.remove();
  };

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}

function getScanCount() {
  const val = localStorage.getItem('bglow_scan_count_' + getUserId());
  return val ? parseInt(val) : 0;
}

function getSkinScore() {
  const key = 'bglow_diary_entries_' + getUserId();
  const data = localStorage.getItem(key);
  if (!data) return 0;
  try {
    const entries = JSON.parse(data);
    if (!entries || entries.length === 0) return 0;

    // Calculate score based on diary condition entries
    let totalScore = 0;
    const recentEntries = entries.slice(0, 10); // last 10 entries
    recentEntries.forEach(entry => {
      if (!entry.conditions || entry.conditions.length === 0) {
        totalScore += 50; // neutral
        return;
      }
      let entryScore = 50;
      entry.conditions.forEach(c => {
        if (c.type === 'good') entryScore += 15;
        else if (c.type === 'warn') entryScore -= 5;
        else if (c.type === 'bad') entryScore -= 15;
      });
      totalScore += Math.max(0, Math.min(100, entryScore));
    });
    return Math.round(totalScore / recentEntries.length);
  } catch (e) {
    return 0;
  }
}

export function renderProfile() {
  const page = document.createElement('div');
  page.className = 'page';

  let userName = 'Pengguna B-Glow';
  let userEmail = 'user@bglow.app';
  let userInitial = 'B';

  const userStr = localStorage.getItem('bglow_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.name) {
        userName = user.name;
        userInitial = user.name.charAt(0).toUpperCase();
      }
      if (user && user.email) {
        userEmail = user.email;
      }
    } catch (e) {}
  }

  // Dynamic stats from real data
  const streakData = getStreak();
  const skinScore = getSkinScore();
  const scanCount = getScanCount();
  const streakCount = streakData.current;

  // Profile photo
  const profilePhoto = getProfilePhoto();
  const avatarContent = profilePhoto
    ? `<img src="${profilePhoto}" alt="Profile" class="profile-avatar-img" />`
    : `<span class="profile-avatar-initial">${userInitial}</span>`;

  page.innerHTML = `
    <!-- Profile Header -->
    <div class="profile-header-card anim-fade-in">
      <div class="profile-avatar-wrapper" id="avatar-wrapper">
        <div class="profile-avatar">
          ${avatarContent}
        </div>
        <div class="profile-avatar-edit" id="avatar-edit-btn" title="Ubah foto profil">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <input type="file" id="profile-photo-input" accept="image/*" style="display:none;" />
      </div>
      <div class="profile-name">${userName}</div>
      <div class="profile-email">${userEmail}</div>
      <div class="profile-stats-row">
        <div class="profile-stat anim-fade-in-up anim-delay-1">
          <div class="ps-value">${skinScore}</div>
          <div class="ps-label">Skor Kulit</div>
        </div>
        <div class="profile-stat anim-fade-in-up anim-delay-2">
          <div class="ps-value">${scanCount}</div>
          <div class="ps-label">Scans</div>
        </div>
        <div class="profile-stat anim-fade-in-up anim-delay-3">
          <div class="ps-value">${streakCount}</div>
          <div class="ps-label">Beruntun</div>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <div class="profile-menu">
      <div class="menu-section">
        <div class="menu-section-title">Akses Cepat</div>
        <div class="menu-item anim-fade-in-up anim-delay-2" id="menu-bpom">
          <div class="mi-icon green">${icons.shield || '🛡️'}</div>
          <span class="mi-text">Cek BPOM Produk</span>
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-3" id="menu-alarm">
          <div class="mi-icon amber">${icons.sun || '☀️'}</div>
          <span class="mi-text">Alarm Sunscreen</span>
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-4" id="menu-diary">
          <div class="mi-icon purple">${icons.book || '📔'}</div>
          <span class="mi-text">Diary Kulit</span>
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-section-title">Perawatan Kulit</div>
        <div class="menu-item anim-fade-in-up anim-delay-4" id="menu-history">
          <div class="mi-icon blue">${icons.camera || '📷'}</div>
          <span class="mi-text">Riwayat Scan</span>
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-5" id="menu-favorites">
          <div class="mi-icon red">${icons.heart || '❤️'}</div>
          <span class="mi-text">Produk Favorit</span>
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-6" id="menu-settings">
          <div class="mi-icon gray">${icons.settings || '⚙️'}</div>
          <span class="mi-text">Pengaturan Akun</span>
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
      </div>
    </div>

    <div class="profile-version">B-Glow v1.0.0</div>
  `;

  setTimeout(() => {
    const bpom = page.querySelector('#menu-bpom');
    const alarm = page.querySelector('#menu-alarm');
    const diary = page.querySelector('#menu-diary');
    const settings = page.querySelector('#menu-settings');
    const favorites = page.querySelector('#menu-favorites');
    const history = page.querySelector('#menu-history');

    if (bpom) bpom.addEventListener('click', () => window.location.hash = '#/bpom');
    if (alarm) alarm.addEventListener('click', () => window.location.hash = '#/alarm');
    if (diary) diary.addEventListener('click', () => window.location.hash = '#/diary');
    if (settings) settings.addEventListener('click', () => window.location.hash = '#/settings');
    if (favorites) favorites.addEventListener('click', () => window.location.hash = '#/favorites');
    if (history) history.addEventListener('click', () => window.location.hash = '#/scan-history');
    // Profile photo edit & preview
    const editBtn = page.querySelector('#avatar-edit-btn');
    const fileInput = page.querySelector('#profile-photo-input');
    const avatarView = page.querySelector('.profile-avatar');

    if (editBtn && fileInput) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
      });

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showCustomAlert('Ukuran foto terlalu besar. Maksimal 5MB.', 'Validasi Foto');
          return;
        }

        openCropperModal(file, (croppedDataUrl) => {
          saveProfilePhoto(croppedDataUrl);

          // Update avatar immediately
          const avatarEl = page.querySelector('.profile-avatar');
          if (avatarEl) {
            avatarEl.innerHTML = `<img src="${croppedDataUrl}" alt="Profile" class="profile-avatar-img" />`;
          }
        });

        // Reset file input value
        fileInput.value = '';
      });
    }

    if (avatarView && fileInput) {
      avatarView.addEventListener('click', (e) => {
        e.stopPropagation();
        const photo = getProfilePhoto();
        if (photo) {
          openPreviewModal(photo);
        } else {
          fileInput.click();
        }
      });
    }

    // Sync profile data from backend
    (async () => {
      const userId = getUserId();
      if (userId && userId !== 'guest') {
        try {
          const res = await fetch(`${API_BASE_URL}/api/user/${userId}`);
          if (res.ok) {
            const user = await res.json();
            
            // Sync with local cache
            localStorage.setItem('bglow_user', JSON.stringify({
              id: user.id,
              name: user.name,
              email: user.email
            }));
            
            if (user.profile_photo) {
              localStorage.setItem('bglow_profile_photo_' + userId, user.profile_photo);
            }
            if (user.skin_type) {
              localStorage.setItem('bglow_has_scanned_' + userId, '1');
              localStorage.setItem('bglow_skin_type_' + userId, user.skin_type);
              localStorage.setItem('bglow_acne_level_' + userId, user.acne_level);
              localStorage.setItem('bglow_oil_level_' + userId, user.oil_level);
              localStorage.setItem('bglow_pore_condition_' + userId, user.pore_condition);
              localStorage.setItem('bglow_skin_score_' + userId, user.skin_score);
            }
            if (user.sunscreen_interval) {
              localStorage.setItem('bglow_sunscreen_interval_' + userId, user.sunscreen_interval);
            }
            if (user.favorites) {
              localStorage.setItem('bglow_favorites_' + userId, user.favorites);
            }
            if (user.diary_entries) {
              localStorage.setItem('bglow_diary_entries_' + userId, user.diary_entries);
            }
            if (user.routine) {
              localStorage.setItem('bglow_routine_' + userId, user.routine);
            }
            if (user.special_schedule) {
              localStorage.setItem('bglow_special_schedule_' + userId, user.special_schedule);
            }
            if (user.streak) {
              localStorage.setItem('bglow_streak_' + userId, user.streak);
            }
            if (user.routine_progress) {
              localStorage.setItem('bglow_routine_progress_' + userId, user.routine_progress);
            }

            // Update DOM dynamically
            const nameEl = page.querySelector('.profile-name');
            const emailEl = page.querySelector('.profile-email');
            const avatarEl = page.querySelector('.profile-avatar');
            
            if (nameEl && user.name) nameEl.textContent = user.name;
            if (emailEl && user.email) emailEl.textContent = user.email;
            
            if (avatarEl && user.profile_photo) {
              avatarEl.innerHTML = `<img src="${user.profile_photo}" alt="Profile" class="profile-avatar-img" />`;
            } else if (avatarEl) {
              const initial = user.name ? user.name.charAt(0).toUpperCase() : 'B';
              avatarEl.innerHTML = `<span class="profile-avatar-initial">${initial}</span>`;
            }

            if (user.skin_score) {
              const scoreEl = page.querySelector('.profile-stat:nth-child(1) .ps-value');
              if (scoreEl) scoreEl.textContent = user.skin_score;
            }
          }
        } catch (err) {
          console.error("Gagal sinkronisasi profil dari server:", err);
        }
      }
    })();
  }, 0);

  return page;
}
