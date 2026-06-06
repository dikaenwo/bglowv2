import { icons } from '../components/BottomNav.js';
<<<<<<< HEAD
import { getStreak, getUserId } from '../utils/store.js';

function getProfilePhoto() {
  return localStorage.getItem('bglow_profile_photo_' + getUserId()) || null;
}

function saveProfilePhoto(dataUrl) {
  localStorage.setItem('bglow_profile_photo_' + getUserId(), dataUrl);
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
=======
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229

export function renderProfile() {
  const page = document.createElement('div');
  page.className = 'page';

<<<<<<< HEAD
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
=======
  page.innerHTML = `
    <!-- Profile Header -->
    <div class="profile-header-card anim-fade-in">
      <div class="profile-avatar">B</div>
      <div class="profile-name">Pengguna B-Glow</div>
      <div class="profile-email">user@bglow.app</div>
      <div class="profile-stats-row">
        <div class="profile-stat anim-fade-in-up anim-delay-1">
          <div class="ps-value">78</div>
          <div class="ps-label">Skor Kulit</div>
        </div>
        <div class="profile-stat anim-fade-in-up anim-delay-2">
          <div class="ps-value">12</div>
          <div class="ps-label">Scans</div>
        </div>
        <div class="profile-stat anim-fade-in-up anim-delay-3">
          <div class="ps-value">7</div>
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229
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
        <div class="menu-item anim-fade-in-up anim-delay-5">
          <div class="mi-icon green">${icons.shield || '🛡️'}</div>
          <span class="mi-text">Produk Favorit</span>
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
<<<<<<< HEAD
        <div class="menu-item anim-fade-in-up anim-delay-6" id="menu-settings">
          <div class="mi-icon gray">${icons.settings || '⚙️'}</div>
          <span class="mi-text">Pengaturan Akun</span>
=======
        <div class="menu-item anim-fade-in-up anim-delay-6">
          <div class="mi-icon amber">${icons.star || '⭐'}</div>
          <span class="mi-text">Target Kulit</span>
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-section-title">Pengaturan</div>
        <div class="menu-item anim-fade-in-up anim-delay-6">
          <div class="mi-icon blue">${icons.bell || '🔔'}</div>
          <span class="mi-text">Notifikasi</span>
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-7">
          <div class="mi-icon blue">${icons.settings || '⚙️'}</div>
          <span class="mi-text">Pengaturan Aplikasi</span>
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-8">
          <div class="mi-icon red">${icons.alert || '⚠️'}</div>
          <span class="mi-text">Bantuan & Dukungan</span>
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
      </div>
    </div>

    <div class="profile-version">B-Glow v1.0.0</div>
  `;

<<<<<<< HEAD
=======
  // Attach navigation events
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229
  setTimeout(() => {
    const bpom = page.querySelector('#menu-bpom');
    const alarm = page.querySelector('#menu-alarm');
    const diary = page.querySelector('#menu-diary');
<<<<<<< HEAD
    const settings = page.querySelector('#menu-settings');
=======
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229

    if (bpom) bpom.addEventListener('click', () => window.location.hash = '#/bpom');
    if (alarm) alarm.addEventListener('click', () => window.location.hash = '#/alarm');
    if (diary) diary.addEventListener('click', () => window.location.hash = '#/diary');
<<<<<<< HEAD
    if (settings) settings.addEventListener('click', () => window.location.hash = '#/settings');

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
          alert('Ukuran foto terlalu besar. Maksimal 5MB.');
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
=======
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229
  }, 0);

  return page;
}
