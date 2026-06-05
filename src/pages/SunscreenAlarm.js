import { icons } from '../components/BottomNav.js';

export function renderSunscreenAlarm() {
  const page = document.createElement('div');
  page.className = 'page';

  const now = new Date();
  const hours = now.getHours();
  const uvIndex = 6;

  const timelineData = [
    { time: '07:00', label: 'Pemakaian Pagi', status: 'applied', state: 'done' },
    { time: '09:00', label: 'Oles Ulang Pertama', status: 'applied', state: 'done' },
    { time: '11:00', label: 'Oles Ulang Kedua', status: 'applied', state: 'done' },
    { time: '13:00', label: 'Oles Ulang Siang', status: 'pending', state: 'current' },
    { time: '15:00', label: 'Oles Ulang Berikutnya', status: 'upcoming', state: 'upcoming' },
    { time: '17:00', label: 'Oles Ulang Sore', status: 'upcoming', state: 'upcoming' },
  ];

  page.innerHTML = `
    <div class="page-header">
      <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
      <h1>Alarm Sunscreen</h1>
    </div>
    <div class="page-content">
      <!-- Dasbor UV -->
      <div class="uv-dashboard anim-fade-in-up">
        <div class="uv-dash-header">
          <div class="uv-title">Indeks UV</div>
          <div class="uv-date">${now.toLocaleDateString('id-ID', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        </div>
        <div class="uv-gauge-wrap">
          <div class="uv-gauge">
            <svg viewBox="0 0 100 100">
              <circle class="gauge-bg" cx="50" cy="50" r="40"/>
              <circle class="gauge-fill" cx="50" cy="50" r="40" id="uv-gauge-fill"/>
            </svg>
            <div class="gauge-value">
              <div class="gauge-number" id="uv-number">0</div>
              <div class="gauge-label">UV</div>
            </div>
          </div>
          <div class="uv-info-right">
            <div class="uv-level-text">Tinggi</div>
            <div class="uv-level-desc">Perlindungan diperlukan. Gunakan sunscreen SPF 30+ setiap 2 jam.</div>
            <div class="sun-animated">${icons.sun}</div>
          </div>
        </div>
      </div>

      <!-- Reminder Schedule -->
      <div class="reminder-section anim-fade-in-up anim-delay-2">
        <div class="reminder-title">Interval Pengingat</div>
        <div class="reminder-options">
          <button class="reminder-chip active" data-interval="2">2 jam</button>
          <button class="reminder-chip" data-interval="3">3 jam</button>
          <button class="reminder-chip" data-interval="custom">Kustom</button>
        </div>
      </div>

      <!-- Timeline -->
      <div class="reminder-section anim-fade-in-up anim-delay-3">
        <div class="reminder-title">Jadwal Hari Ini</div>
        <div class="alarm-timeline" id="timeline-container"></div>
      </div>

      <!-- Active Alarm Card -->
      <div class="active-alarm-card anim-fade-in-up anim-delay-5">
        <div class="alarm-card-header">
          ${icons.bell}
          <span>Pengingat Berikutnya</span>
        </div>
        <div class="alarm-countdown" id="countdown">01:42:30</div>
        <div class="alarm-next-text">Oles ulang sunscreen pukul 13:00</div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast-notification" id="toast">
      <span class="toast-icon">☀️</span>
      <span class="toast-text">Waktunya oles ulang sunscreen ☀️</span>
    </div>
  `;

  // Back button
  page.querySelector('#back-btn').addEventListener('click', () => {
    window.location.hash = '#/';
  });

  // Timeline
  const container = page.querySelector('#timeline-container');
  timelineData.forEach(item => {
    const el = document.createElement('div');
    el.className = `timeline-item ${item.state}`;
    el.innerHTML = `
      <div class="tl-time">${item.time}</div>
      <div class="tl-label">${item.label}</div>
      ${item.status !== 'upcoming' ? `<div class="tl-status ${item.status}">${item.status === 'applied' ? '✓ Sudah' : '⏳ Menunggu'}</div>` : ''}
    `;
    container.appendChild(el);
  });

  // Reminder chips
  page.querySelectorAll('.reminder-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      page.querySelectorAll('.reminder-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // UV gauge animation
  setTimeout(() => {
    const fill = page.querySelector('#uv-gauge-fill');
    const num = page.querySelector('#uv-number');
    if (fill) {
      const percent = uvIndex / 11;
      const offset = 251 - (251 * percent);
      fill.style.strokeDashoffset = offset;

      let current = 0;
      const step = uvIndex / 20;
      const timer = setInterval(() => {
        current += step;
        if (current >= uvIndex) { current = uvIndex; clearInterval(timer); }
        num.textContent = Math.round(current);
      }, 40);
    }
  }, 500);

  // Countdown timer
  let seconds = 6150; // ~1:42:30
  const countdownEl = page.querySelector('#countdown');
  setInterval(() => {
    seconds = Math.max(0, seconds - 1);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (countdownEl) {
      countdownEl.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  }, 1000);

  // Show toast after 3 seconds for demo
  setTimeout(() => {
    const toast = page.querySelector('#toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }
  }, 3000);

  return page;
}
