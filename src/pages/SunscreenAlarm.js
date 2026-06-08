import { icons } from '../components/BottomNav.js';
import { fetchWeather } from '../utils/weather.js';

export function renderSunscreenAlarm() {
  const page = document.createElement('div');
  page.className = 'page';

  const now = new Date();
  const hours = now.getHours();

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
            <div class="uv-level-text" id="uv-level-text">Memuat...</div>
            <div class="uv-level-desc" id="uv-level-desc">Mendeteksi tingkat UV saat ini...</div>
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
      
      const interval = chip.dataset.interval;
      if (interval === 'custom') {
        const mins = prompt("Berapa menit interval pengingat?");
        if (mins && !isNaN(mins)) {
          seconds = parseInt(mins) * 60;
        }
      } else {
        seconds = parseInt(interval) * 3600; // hours to seconds
      }
    });
  });

  // Fetch real weather and animate gauge
  fetchWeather().then(w => {
    if (!w) return;
    const uvIndex = w.uvIndex;
    const isHighUv = uvIndex >= 6;
    
    const levelText = page.querySelector('#uv-level-text');
    const levelDesc = page.querySelector('#uv-level-desc');
    
    if (levelText) {
      levelText.textContent = isHighUv ? 'Tinggi' : (uvIndex >= 3 ? 'Sedang' : 'Rendah');
      levelText.style.color = isHighUv ? '#EF4444' : (uvIndex >= 3 ? '#F59E0B' : '#10B981');
    }
    
    if (levelDesc) {
      levelDesc.textContent = isHighUv 
        ? 'Perlindungan diperlukan. Gunakan sunscreen SPF 30+ setiap 2 jam.' 
        : (uvIndex >= 3 ? 'Gunakan sunscreen jika beraktivitas di luar.' : 'Indeks UV aman. Perlindungan ringan cukup.');
    }

    const fill = page.querySelector('#uv-gauge-fill');
    const num = page.querySelector('#uv-number');
    if (fill && num) {
      const percent = Math.min(uvIndex / 11, 1);
      const offset = 251 - (251 * percent);
      fill.style.strokeDashoffset = offset;
      
      // Update color based on level
      if (isHighUv) {
        fill.style.stroke = '#EF4444';
      } else if (uvIndex >= 3) {
        fill.style.stroke = '#F59E0B';
      } else {
        fill.style.stroke = '#10B981';
      }

      let current = 0;
      const step = (uvIndex || 1) / 20;
      const timer = setInterval(() => {
        current += step;
        if (current >= uvIndex) { current = uvIndex; clearInterval(timer); }
        num.textContent = Math.round(current);
      }, 40);
    }
  }).catch(err => console.error('Gagal memuat UV:', err));

  // Countdown timer
  let seconds = 7200; // default 2 hours
  const countdownEl = page.querySelector('#countdown');
  
  const timerInterval = setInterval(() => {
    if (seconds > 0) {
      seconds--;
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      if (countdownEl) {
        countdownEl.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    } else {
      // Time is up!
      clearInterval(timerInterval);
      showAlarmPopup();
    }
  }, 1000);

  function showAlarmPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal" style="text-align:center;">
        <div class="modal-handle"></div>
        <div style="font-size: 3rem; margin-bottom: 10px;">☀️</div>
        <h2 style="margin-bottom: 10px; color: #F43F5E;">Waktunya Re-apply!</h2>
        <p style="color: var(--text-secondary); margin-bottom: 20px;">Indeks UV sedang tinggi. Segera oleskan ulang sunscreen-mu untuk perlindungan maksimal.</p>
        <button class="btn btn-primary" id="btn-done-reapply" style="width: 100%; margin-bottom: 10px; background: #F43F5E;">Sudah Re-apply</button>
        <button class="btn btn-outline" id="btn-snooze" style="width: 100%;">Ingatkan 10 menit lagi</button>
      </div>
    `;
    
    overlay.querySelector('#btn-done-reapply').addEventListener('click', () => {
      overlay.remove();
      seconds = 7200; // reset to 2 hours
      // In a real app we would restart the interval here
    });
    
    overlay.querySelector('#btn-snooze').addEventListener('click', () => {
      overlay.remove();
      seconds = 600; // 10 minutes
    });
    
    document.body.appendChild(overlay);
  }

  // Clear interval when leaving page to avoid memory leaks
  const originalRemove = page.remove;
  page.remove = function() {
    clearInterval(timerInterval);
    originalRemove.call(this);
  };

  return page;
}
