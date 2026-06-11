import { icons } from '../components/BottomNav.js';
import { showCustomAlert } from '../utils/helpers.js';
import { API_BASE_URL } from '../config.js';

export function renderRegister() {
  const page = document.createElement('div');
  page.className = 'auth-page';

  page.innerHTML = `
    <div class="auth-brand">
      <div class="auth-logo">
        <img src="/BGLOW-Polos.png" alt="B-Glow Logo" />
      </div>
      <h1>B-Glow</h1>
      <p>Mulai perjalanan glow-up Anda</p>
    </div>

    <div class="auth-card">
      <h2>Buat Akun</h2>

      <div class="auth-field">
        <label>Nama Lengkap</label>
        <input class="auth-input" type="text" id="reg-name" placeholder="Nama lengkap Anda" />
      </div>

      <div class="auth-field">
        <label>Email</label>
        <input class="auth-input" type="email" id="reg-email" placeholder="email@contoh.com" />
      </div>

      <div class="auth-field">
        <label>Kata Sandi</label>
        <div class="password-wrap">
          <input class="auth-input" type="password" id="reg-password" placeholder="Min. 8 karakter" />
        </div>
      </div>

      <button class="auth-submit" id="register-btn">Buat Akun</button>

      <div class="auth-divider">atau daftar dengan</div>

      <div class="auth-social">
        <button class="social-btn"><span class="social-icon"><svg viewBox="0 0 48 48" width="20px" height="20px"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg></span> Google</button>
        <button class="social-btn"><span class="social-icon"><svg viewBox="0 0 384 512" width="20px" height="20px" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg></span> Apple</button>
      </div>
    </div>

    <div class="auth-footer">
      Sudah punya akun? <a id="go-login">Masuk</a>
    </div>
  `;

  page.querySelector('#register-btn').addEventListener('click', async () => {
    const name = page.querySelector('#reg-name').value;
    const email = page.querySelector('#reg-email').value;
    const password = page.querySelector('#reg-password').value;
    
    if (!name || !email || !password) {
      showCustomAlert("Mohon isi semua data!", "Validasi Gagal");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showCustomAlert("Pendaftaran berhasil! Silakan masuk.", "Pendaftaran Sukses", () => {
          window.location.hash = '#/login';
        });
      } else {
        showCustomAlert(data.detail || "Pendaftaran gagal", "Pendaftaran Gagal");
      }
    } catch (error) {
      console.error('Error:', error);
      showCustomAlert("Gagal terhubung ke server. Pastikan backend Python menyala.", "Koneksi Bermasalah");
    }
  });

  page.querySelector('#go-login').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '#/login';
  });

  return page;
}
