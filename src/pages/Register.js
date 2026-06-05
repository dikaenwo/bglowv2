import { icons } from '../components/BottomNav.js';

export function renderRegister() {
  const page = document.createElement('div');
  page.className = 'auth-page';

  page.innerHTML = `
    <div class="auth-brand">
      <div class="auth-logo">${icons.scan}</div>
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
        <button class="social-btn"><span class="social-icon">G</span> Google</button>
        <button class="social-btn"><span class="social-icon">🍎</span> Apple</button>
      </div>
    </div>

    <div class="auth-footer">
      Sudah punya akun? <a id="go-login">Masuk</a>
    </div>
  `;

  page.querySelector('#register-btn').addEventListener('click', () => {
    const name = page.querySelector('#reg-name').value || 'B-Glow User';
    const email = page.querySelector('#reg-email').value || 'user@bglow.app';
    localStorage.setItem('bglow_auth', '1');
    localStorage.setItem('bglow_user', JSON.stringify({ name, email }));
    window.location.hash = '#/';
  });

  page.querySelector('#go-login').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.hash = '#/login';
  });

  return page;
}
