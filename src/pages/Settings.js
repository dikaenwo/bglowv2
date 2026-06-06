import { icons } from '../components/BottomNav.js';
<<<<<<< HEAD
import { clearUserData } from '../utils/store.js';
=======
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229

export function renderSettings() {
  const page = document.createElement('div');
  page.className = 'page';

  page.innerHTML = `
    <div class="page-header">
      <h1>Pengaturan</h1>
    </div>
    <div class="profile-menu">
      <div class="menu-section">
<<<<<<< HEAD
=======
        <div class="menu-section-title">Notifikasi</div>
        <div class="menu-item anim-fade-in-up anim-delay-1">
          <div class="mi-icon blue">${icons.bell}</div>
          <span class="mi-text">Notifikasi Push</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-2">
          <div class="mi-icon amber">${icons.sun}</div>
          <span class="mi-text">Pengingat Sunscreen</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
      </div>

      <div class="menu-section">
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229
        <div class="menu-section-title">Aplikasi</div>
        <div class="menu-item anim-fade-in-up anim-delay-3">
          <div class="mi-icon blue">${icons.settings}</div>
          <span class="mi-text">Umum</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-4">
          <div class="mi-icon green">${icons.shield}</div>
          <span class="mi-text">Privasi & Keamanan</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-5">
          <div class="mi-icon blue">${icons.droplet}</div>
          <span class="mi-text">Profil Kulit</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-section-title">Dukungan</div>
        <div class="menu-item anim-fade-in-up anim-delay-5">
          <div class="mi-icon amber">${icons.star}</div>
          <span class="mi-text">Nilai B-Glow</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-6">
          <div class="mi-icon red">${icons.alert}</div>
          <span class="mi-text">Bantuan & Dukungan</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-7" id="logout-btn" style="cursor:pointer;">
          <div class="mi-icon red">${icons.chevronLeft}</div>
          <span class="mi-text" style="color:var(--danger);">Keluar</span>
          <span class="mi-arrow"></span>
        </div>
      </div>
    </div>
    <div class="profile-version">B-Glow v1.0.0</div>
  `;

  page.querySelector('#logout-btn').addEventListener('click', () => {
<<<<<<< HEAD
    clearUserData();
=======
    localStorage.removeItem('bglow_auth');
    localStorage.removeItem('bglow_user');
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229
    window.location.hash = '#/login';
  });

  return page;
}
