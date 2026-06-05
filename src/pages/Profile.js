import { icons } from '../components/BottomNav.js';

export function renderProfile() {
  const page = document.createElement('div');
  page.className = 'page';

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
          <span class="mi-arrow">${icons.chevronRight || '>'}</span>
        </div>
      </div>
    </div>

    <div class="profile-version">B-Glow v1.0.0</div>
  `;

  // Attach navigation events
  setTimeout(() => {
    const bpom = page.querySelector('#menu-bpom');
    const alarm = page.querySelector('#menu-alarm');
    const diary = page.querySelector('#menu-diary');

    if (bpom) bpom.addEventListener('click', () => window.location.hash = '#/bpom');
    if (alarm) alarm.addEventListener('click', () => window.location.hash = '#/alarm');
    if (diary) diary.addEventListener('click', () => window.location.hash = '#/diary');
  }, 0);

  return page;
}
