import { icons } from '../components/BottomNav.js';
import { addRipple, staggerChildren } from '../utils/helpers.js';

// Mock data for the dashboard
const weatherData = {
  temp: 32,
  condition: 'Cerah',
  icon: '☀️',
  uvIndex: 8,
  humidity: 70
};

const routineData = {
  timeOfDay: 'Pagi', // or 'Malam'
  completedSteps: 2,
  totalSteps: 5
};

export function renderHome() {
  const page = document.createElement('div');
  page.className = 'page home-page';
  
  // Calculate routine progress percentage
  const progressPct = Math.round((routineData.completedSteps / routineData.totalSteps) * 100);
  
  // Determine UV warning
  const isHighUv = weatherData.uvIndex >= 6;

  page.innerHTML = `
    <!-- Header -->
    <header class="home-header anim-fade-in">
      <div class="home-header-top">
        <div>
          <div class="home-greeting">Selamat Pagi, Glowers ✨</div>
          <div class="home-name">Dashboard Kulitmu</div>
        </div>
        <button class="home-notif-btn" id="notif-btn">
          ${icons.crown}
        </button>
      </div>
    </header>

    <!-- Dashboard Content -->
    <section class="dashboard-content">
      
      <!-- Weather & Env Widget -->
      <div class="weather-widget anim-fade-in-up">
        <div class="weather-main">
          <div class="weather-icon-wrap">${weatherData.icon}</div>
          <div>
            <div class="weather-temp">${weatherData.temp}°C</div>
            <div class="weather-desc">${weatherData.condition}</div>
          </div>
        </div>
        <div class="weather-details">
          <div class="w-detail-item">
            <span>UV Index:</span>
            <span class="w-detail-val ${isHighUv ? 'danger' : ''}">${weatherData.uvIndex} ${isHighUv ? '(Tinggi)' : ''}</span>
          </div>
          <div class="w-detail-item">
            <span>Kelembapan:</span>
            <span class="w-detail-val">${weatherData.humidity}%</span>
          </div>
        </div>
      </div>

      <!-- Routine Summary Card -->
      <div class="routine-summary-card anim-fade-in-up anim-delay-1">
        <div class="rsc-header">
          <h3 class="rsc-title">Rutinitas ${routineData.timeOfDay}</h3>
          <span class="rsc-badge">${routineData.completedSteps}/${routineData.totalSteps} Selesai</span>
        </div>
        <div class="rsc-progress-wrap">
          <div class="rsc-progress-text">
            <span>Progres</span>
            <span>${progressPct}%</span>
          </div>
          <div class="rsc-progress-bar">
            <div class="rsc-progress-fill" style="width: ${progressPct}%"></div>
          </div>
        </div>
        <button class="rsc-btn" id="btn-continue-routine">Lanjutkan Rutinitas</button>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section anim-fade-in-up anim-delay-2">
        <h3 class="section-title">Aksi Cepat</h3>
        <div class="quick-actions-grid">
          <div class="qa-item" data-action="scan">
            <div class="qa-icon-wrap">🤖</div>
            <span class="qa-label">Scan AI</span>
          </div>
          <div class="qa-item" data-action="diary">
            <div class="qa-icon-wrap">📓</div>
            <span class="qa-label">Jurnal</span>
          </div>
          <div class="qa-item" data-action="alarm">
            <div class="qa-icon-wrap">⏰</div>
            <span class="qa-label">Alarm UV</span>
          </div>
          <div class="qa-item" data-action="bpom">
            <div class="qa-icon-wrap">🛡️</div>
            <span class="qa-label">Cek BPOM</span>
          </div>
        </div>
      </div>

      <!-- Daily Tip -->
      <div class="daily-tip-card anim-fade-in-up anim-delay-3">
        <div class="tip-icon">💡</div>
        <div class="tip-content">
          <h4>Tips Harian</h4>
          <p>${isHighUv ? 'UV Index sangat tinggi hari ini! Wajib gunakan sunscreen dan re-apply tiap 2 jam ya.' : 'Cuaca bersahabat, tapi jangan lupa tetap hidrasi kulitmu dari dalam dengan minum air putih.'}</p>
        </div>
      </div>

      <!-- Streak Consistency -->
      <div class="streak-card anim-fade-in-up anim-delay-4">
        <div class="sc-icon">🔥</div>
        <div class="sc-content">
          <h4>7 Hari Beruntun!</h4>
          <p>Luar biasa! Kamu konsisten merawat kulit minggu ini. Pertahankan terus ya!</p>
        </div>
      </div>

    </section>
  `;

  // Attach Events
  page.querySelectorAll('.rsc-btn, .qa-item').forEach(el => addRipple(el));

  const btnContinue = page.querySelector('#btn-continue-routine');
  if (btnContinue) {
    btnContinue.addEventListener('click', () => {
      window.location.hash = '#/routine';
    });
  }

  page.querySelectorAll('.qa-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      window.location.hash = '#/' + action;
    });
  });

  page.querySelector('#notif-btn').addEventListener('click', () => {
    window.location.hash = '#/subscription';
  });

  return page;
}
