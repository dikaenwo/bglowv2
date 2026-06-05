import { icons } from '../components/BottomNav.js';

export function renderLogin() {
  const page = document.createElement('div');
  page.className = 'auth-page';

  page.innerHTML = `
    <div class="auth-brand">
      <div class="auth-logo">${icons.scan}</div>
      <h1>B-Glow</h1>
      <p>Asisten Skincare AI Anda</p>
    </div>

    <div class="auth-card">
      <h2>Selamat Datang Kembali</h2>

      <div class="auth-field">
        <label>Email</label>
        <input class="auth-input" type="email" id="login-email" placeholder="email@contoh.com" />
      </div>

      <div class="auth-field">
        <label>Kata Sandi</label>
        <div class="password-wrap">
          <input class="auth-input" type="password" id="login-password" placeholder="••••••••" />
        </div>
      </div>

      <button class="auth-submit" id="login-btn">Masuk</button>

      <div class="auth-divider">atau masuk dengan</div>

      <div class="auth-social">
        <button class="social-btn"><span class="social-icon">G</span> Google</button>
        <button class="social-btn"><span class="social-icon">🍎</span> Apple</button>
      </div>
    </div>

    <div class="auth-footer">
      Belum punya akun? <a id="go-register">Daftar</a>
    </div>
  `;

  page.querySelector('#login-btn').addEventListener('click', () => {
    localStorage.setItem('bglow_auth', '1');
    localStorage.setItem('bglow_user', JSON.stringify({ name: 'B-Glow User', email: page.querySelector('#login-email').value || 'user@bglow.app' }));
    window.location.hash = '#/';
  });

  page.querySelector('#go-register').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '#/register';
  });

  return page;
}
