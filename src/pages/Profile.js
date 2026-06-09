import { icons } from '../components/BottomNav.js';
import { getStreak, getUserId } from '../utils/store.js';
import { showCustomAlert } from '../utils/helpers.js';

function getProfilePhoto() {
  return localStorage.getItem('bglow_profile_photo_' + getUserId()) || null;
}

async function saveProfilePhoto(dataUrl) {
  const userId = getUserId();
  localStorage.setItem('bglow_profile_photo_' + userId, dataUrl);
  if (userId && userId !== 'guest') {
    try {
      await fetch(`http://localhost:8000/api/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_photo: dataUrl })
      });
    } catch (e) {
      console.error("Gagal menyimpan foto profil ke database:", e);
    }
  }
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
        <div class="menu-item anim-fade-in-up anim-delay-4">
          <div class="mi-icon blue">${icons.camera || '📷'}</div>
          <span class="mi-text">Riwayat Scan</span>
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-5" id="menu-favorites">
          <div class="mi-icon green">${icons.shield || '🛡️'}</div>
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

    if (bpom) bpom.addEventListener('click', () => window.location.hash = '#/bpom');
    if (alarm) alarm.addEventListener('click', () => window.location.hash = '#/alarm');
    if (diary) diary.addEventListener('click', () => window.location.hash = '#/diary');
    if (settings) settings.addEventListener('click', () => window.location.hash = '#/settings');
    if (favorites) favorites.addEventListener('click', () => window.location.hash = '#/favorites');

    // Profile photo edit
    const editBtn = page.querySelector('#avatar-edit-btn');
    const fileInput = page.querySelector('#profile-photo-input');

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

        const reader = new FileReader();
        reader.onload = (evt) => {
          // Resize image to save localStorage space
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxSize = 200;
            let w = img.width;
            let h = img.height;
            if (w > h) {
              if (w > maxSize) { h = (h * maxSize) / w; w = maxSize; }
            } else {
              if (h > maxSize) { w = (w * maxSize) / h; h = maxSize; }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            saveProfilePhoto(dataUrl);

            // Update avatar immediately
            const avatarEl = page.querySelector('.profile-avatar');
            if (avatarEl) {
              avatarEl.innerHTML = `<img src="${dataUrl}" alt="Profile" class="profile-avatar-img" />`;
            }
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    // Sync profile data from backend
    (async () => {
      const userId = getUserId();
      if (userId && userId !== 'guest') {
        try {
          const res = await fetch(`http://localhost:8000/api/user/${userId}`);
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
