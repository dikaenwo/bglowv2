import { icons } from '../components/BottomNav.js';
import { clearUserData } from '../utils/store.js';
import { showCustomAlert } from '../utils/helpers.js';
import { API_BASE_URL } from '../config.js';

export function renderLogin() {
  const page = document.createElement('div');
  page.className = 'auth-page';

  page.innerHTML = `
    <div class="auth-brand">
      <div class="auth-logo">
        <img src="/BGLOW-Polos.png" alt="B-Glow Logo" />
      </div>
      <h1>B-Glow</h1>
      <p>Asisten Skincare AI Anda</p>
    </div>

    <div class="auth-card">
      <h2>Selamat Datang Kembali</h2>

      <div class="auth-field">
        <label>Email</label>
        <input class="auth-input" type="email" id="login-email" placeholder="email@contoh.com" />
        <div class="auth-error-text" id="email-error" style="display: none;"></div>
      </div>

      <div class="auth-field">
        <label>Kata Sandi</label>
        <div class="password-wrap">
          <input class="auth-input" type="password" id="login-password" placeholder="••••••••" />
        </div>
        <div class="auth-error-text" id="password-error" style="display: none;"></div>
      </div>

      <button class="auth-submit" id="login-btn">Masuk</button>

      <div style="text-align: right; margin-top: 12px;">
        <a id="go-forgot-password" style="font-size: var(--font-sm); color: var(--primary); font-weight: 600; cursor: pointer; text-decoration: none;">Lupa Kata Sandi?</a>
      </div>

      <div class="auth-divider">atau masuk dengan</div>

      <div class="auth-social">
        <button class="social-btn" id="google-login-btn">
          <span class="social-icon">
            <svg viewBox="0 0 48 48" width="20px" height="20px">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          </span>
          Google
        </button>
        <button class="social-btn" id="apple-login-btn">
          <span class="social-icon">
            <svg viewBox="0 0 384 512" width="20px" height="20px" fill="currentColor">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
            </svg>
          </span>
          Apple
        </button>
      </div>
    </div>

    <div class="auth-footer">
      Belum punya akun? <a id="go-register">Daftar</a>
    </div>
  `;

  // Helper functions for displaying input field errors
  const showFieldError = (inputEl, errorEl, msg) => {
    inputEl.classList.add('error');
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  };

  const clearErrors = () => {
    const inputs = page.querySelectorAll('.auth-input');
    const errors = page.querySelectorAll('.auth-error-text');
    inputs.forEach(el => el.classList.remove('error'));
    errors.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  };

  // ─── Manual Form Login ───
  page.querySelector('#login-btn').addEventListener('click', async () => {
    const emailInput = page.querySelector('#login-email');
    const passwordInput = page.querySelector('#login-password');
    const emailError = page.querySelector('#email-error');
    const passwordError = page.querySelector('#password-error');

    clearErrors();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    let hasError = false;
    if (!email) {
      showFieldError(emailInput, emailError, 'Email tidak boleh kosong!');
      hasError = true;
    }
    if (!password) {
      showFieldError(passwordInput, passwordError, 'Kata sandi tidak boleh kosong!');
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        clearUserData();
        localStorage.setItem('bglow_auth', '1');
        localStorage.setItem('bglow_user', JSON.stringify({ 
          id: data.user.id,
          name: data.user.name, 
          email: data.user.email 
        }));
        if (data.user.profile_photo) {
          localStorage.setItem('bglow_profile_photo_' + data.user.id, data.user.profile_photo);
        }
        if (data.user.skin_type) {
          localStorage.setItem('bglow_has_scanned_' + data.user.id, '1');
          localStorage.setItem('bglow_skin_type_' + data.user.id, data.user.skin_type);
          localStorage.setItem('bglow_acne_level_' + data.user.id, data.user.acne_level);
          localStorage.setItem('bglow_oil_level_' + data.user.id, data.user.oil_level);
          localStorage.setItem('bglow_pore_condition_' + data.user.id, data.user.pore_condition);
          localStorage.setItem('bglow_skin_score_' + data.user.id, data.user.skin_score);
        }
        if (data.user.sunscreen_interval) {
          localStorage.setItem('bglow_sunscreen_interval_' + data.user.id, data.user.sunscreen_interval);
        }
        if (data.user.favorites) {
          localStorage.setItem('bglow_favorites_' + data.user.id, data.user.favorites);
        }
        if (data.user.diary_entries) {
          localStorage.setItem('bglow_diary_entries_' + data.user.id, data.user.diary_entries);
        }
        if (data.user.routine) {
          localStorage.setItem('bglow_routine_' + data.user.id, data.user.routine);
        }
        if (data.user.special_schedule) {
          localStorage.setItem('bglow_special_schedule_' + data.user.id, data.user.special_schedule);
        }
        if (data.user.streak) {
          localStorage.setItem('bglow_streak_' + data.user.id, data.user.streak);
        }
        if (data.user.routine_progress) {
          localStorage.setItem('bglow_routine_progress_' + data.user.id, data.user.routine_progress);
        }
        window.location.hash = '#/';
      } else {
        const detail = data.detail || '';
        if (detail.includes('Email tidak ditemukan')) {
          showFieldError(emailInput, emailError, 'Email tidak ditemukan');
        } else if (detail.includes('Kata sandi salah')) {
          showFieldError(passwordInput, passwordError, 'Password salah');
        } else {
          showCustomAlert(detail || "Login gagal", "Login Gagal");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      showCustomAlert("Gagal terhubung ke server. Pastikan backend Python menyala.", "Koneksi Bermasalah");
    }
  });

  // ─── Social Login Handler ───
  const handleSocialLogin = async (provider, email, name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/social-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, email, name })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        clearUserData();
        localStorage.setItem('bglow_auth', '1');
        localStorage.setItem('bglow_user', JSON.stringify({ 
          id: data.user.id,
          name: data.user.name, 
          email: data.user.email 
        }));
        if (data.user.profile_photo) {
          localStorage.setItem('bglow_profile_photo_' + data.user.id, data.user.profile_photo);
        }
        if (data.user.skin_type) {
          localStorage.setItem('bglow_has_scanned_' + data.user.id, '1');
          localStorage.setItem('bglow_skin_type_' + data.user.id, data.user.skin_type);
          localStorage.setItem('bglow_acne_level_' + data.user.id, data.user.acne_level);
          localStorage.setItem('bglow_oil_level_' + data.user.id, data.user.oil_level);
          localStorage.setItem('bglow_pore_condition_' + data.user.id, data.user.pore_condition);
          localStorage.setItem('bglow_skin_score_' + data.user.id, data.user.skin_score);
        }
        if (data.user.sunscreen_interval) {
          localStorage.setItem('bglow_sunscreen_interval_' + data.user.id, data.user.sunscreen_interval);
        }
        if (data.user.favorites) {
          localStorage.setItem('bglow_favorites_' + data.user.id, data.user.favorites);
        }
        if (data.user.diary_entries) {
          localStorage.setItem('bglow_diary_entries_' + data.user.id, data.user.diary_entries);
        }
        if (data.user.routine) {
          localStorage.setItem('bglow_routine_' + data.user.id, data.user.routine);
        }
        if (data.user.special_schedule) {
          localStorage.setItem('bglow_special_schedule_' + data.user.id, data.user.special_schedule);
        }
        if (data.user.streak) {
          localStorage.setItem('bglow_streak_' + data.user.id, data.user.streak);
        }
        if (data.user.routine_progress) {
          localStorage.setItem('bglow_routine_progress_' + data.user.id, data.user.routine_progress);
        }
        window.location.hash = '#/';
      } else {
        showCustomAlert(data.detail || "Social login gagal", "Autentikasi Gagal");
      }
    } catch (error) {
      console.error('Error:', error);
      showCustomAlert("Gagal terhubung ke server. Pastikan backend Python menyala.", "Koneksi Bermasalah");
    }
  };

  // Helper for displaying a gorgeous mock overlay prompting social login
  const showMockSocialLogin = (provider, onSelect) => {
    const existing = document.querySelector('.social-login-overlay');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.className = 'social-login-overlay';
    
    if (!document.getElementById('social-login-styles')) {
      const style = document.createElement('style');
      style.id = 'social-login-styles';
      style.textContent = `
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .social-login-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', sans-serif;
        }
        .social-login-card {
          background: #ffffff;
          border-radius: 24px;
          width: 100%;
          max-width: 360px;
          padding: 32px 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          animation: modalFadeIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
          text-align: center;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .social-login-header {
          margin-bottom: 24px;
        }
        .social-login-logo {
          width: 48px;
          height: 48px;
          margin: 0 auto 16px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }
        .social-login-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
        }
        .social-login-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 6px;
        }
        .social-account-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }
        .social-account-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #ffffff;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }
        .social-account-item:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }
        .social-account-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--primary);
          font-size: 0.95rem;
        }
        .social-account-info {
          flex: 1;
        }
        .social-account-name {
          font-size: 0.9rem;
          font-weight: 600;
          color: #0f172a;
        }
        .social-account-email {
          font-size: 0.75rem;
          color: #64748b;
        }
        .social-login-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 0;
        }
        .social-spinner {
          width: 40px;
          height: 40px;
          border: 3.5px solid #f3f3f3;
          border-top: 3.5px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    const logoSvg = provider === 'Google' 
      ? `<svg viewBox="0 0 48 48" width="36px" height="36px"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`
      : `<svg viewBox="0 0 384 512" width="32px" height="32px" fill="#000000"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>`;
      
    const email = provider === 'Google' ? 'pengguna.google@gmail.com' : 'pengguna.apple@icloud.com';
    const name = provider === 'Google' ? 'Pengguna Google' : 'Pengguna Apple';
    const initial = provider === 'Google' ? 'G' : 'A';
    
    overlay.innerHTML = `
      <div class="social-login-card">
        <div class="social-login-header">
          <div class="social-login-logo">${logoSvg}</div>
          <h3 class="social-login-title">Masuk dengan ${provider}</h3>
          <p class="social-login-subtitle">Pilih akun untuk melanjutkan ke B-Glow</p>
        </div>
        
        <div class="social-account-list">
          <button class="social-account-item" id="btn-social-select">
            <div class="social-account-avatar">${initial}</div>
            <div class="social-account-info">
              <div class="social-account-name">${name}</div>
              <div class="social-account-email">${email}</div>
            </div>
          </button>
        </div>
        
        <button class="custom-btn-cancel" id="btn-social-cancel" style="width: 100%; border-radius: var(--radius-lg); padding: 12px; color: #475569; border: 1px solid #cbd5e1; background: #ffffff;">Batal</button>
      </div>
    `;
    
    overlay.querySelector('#btn-social-cancel').addEventListener('click', () => {
      overlay.remove();
    });
    
    overlay.querySelector('#btn-social-select').addEventListener('click', () => {
      const card = overlay.querySelector('.social-login-card');
      card.innerHTML = `
        <div class="social-login-loading">
          <div class="social-spinner"></div>
          <h3 class="social-login-title">Menghubungkan...</h3>
          <p class="social-login-subtitle">Sedang memproses autentikasi ${provider}</p>
        </div>
      `;
      
      setTimeout(() => {
        overlay.remove();
        onSelect({ email, name });
      }, 1200);
    });
    
    document.body.appendChild(overlay);
  };

  page.querySelector('#google-login-btn').addEventListener('click', () => {
    showMockSocialLogin('Google', (user) => {
      handleSocialLogin('google', user.email, user.name);
    });
  });

  page.querySelector('#apple-login-btn').addEventListener('click', () => {
    showMockSocialLogin('Apple', (user) => {
      handleSocialLogin('apple', user.email, user.name);
    });
  });

  page.querySelector('#go-register').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '#/register';
  });

  page.querySelector('#go-forgot-password').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '#/forgot-password';
  });

  return page;
}
