import { icons } from '../components/BottomNav.js';
import { fetchWeather } from '../utils/weather.js';
import { getUserId, syncUserData } from '../utils/store.js';
import { showCustomAlert } from '../utils/helpers.js';

export function renderSunscreenAlarm() {
  const page = document.createElement('div');
  page.className = 'page';

  const now = new Date();

  const userId = getUserId();
  let currentInterval = parseInt(localStorage.getItem('bglow_sunscreen_interval_' + userId)) || 2;

  // Helper to calculate schedules dynamically
  function getSchedulesForInterval(intervalHrs) {
    const schedules = [];
    const labels = [
      'Pemakaian Pagi',
      'Oles Ulang Pertama',
      'Oles Ulang Kedua',
      'Oles Ulang Ketiga',
      'Oles Ulang Keempat',
      'Oles Ulang Kelima',
      'Oles Ulang Keenam',
      'Oles Ulang Ketujuh',
      'Oles Ulang Kedelapan',
      'Oles Ulang Kesembilan',
      'Oles Ulang Kesepuluh',
      'Oles Ulang Kesebelas',
      'Oles Ulang Kedua Belas'
    ];
    let currentHour = 7;
    let labelIdx = 0;
    while (currentHour <= 18) {
      const hStr = String(currentHour).padStart(2, '0');
      schedules.push({
        timeStr: `${hStr}:00`,
        label: labelIdx === 0 ? labels[0] : (labels[labelIdx] || 'Oles Ulang Berikutnya'),
        mins: currentHour * 60
      });
      currentHour += intervalHrs;
      labelIdx++;
    }
    return schedules;
  }

  // Helper to calculate the next schedule dynamically
  function getNextSchedule() {
    const d = new Date();
    const currentMins = d.getHours() * 60 + d.getMinutes();
    
    const schedules = getSchedulesForInterval(currentInterval);
    
    let next = schedules.find(s => s.mins > currentMins);
    if (!next) {
      next = { ...schedules[0], isTomorrow: true };
    }
    return next;
  }

  // Helper to get seconds remaining to next schedule
  function getSecondsRemaining(nextSchedule) {
    const d = new Date();
    const target = new Date();
    const [h, m] = nextSchedule.timeStr.split(':').map(Number);
    target.setHours(h, m, 0, 0);
    if (nextSchedule.isTomorrow) {
      target.setDate(target.getDate() + 1);
    }
    return Math.max(0, Math.floor((target.getTime() - d.getTime()) / 1000));
  }

  const initialSchedule = getNextSchedule();
  let seconds = getSecondsRemaining(initialSchedule);

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
          <button class="reminder-chip ${currentInterval === 2 ? 'active' : ''}" data-interval="2">2 jam</button>
          <button class="reminder-chip ${currentInterval === 3 ? 'active' : ''}" data-interval="3">3 jam</button>
          <button class="reminder-chip ${currentInterval !== 2 && currentInterval !== 3 ? 'active' : ''}" data-interval="custom">
            ${currentInterval !== 2 && currentInterval !== 3 ? `${currentInterval} jam` : 'Kustom'}
          </button>
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
        <div class="alarm-countdown" id="countdown">--:--:--</div>
        <div class="alarm-next-text" id="alarm-next-text">Menghitung jadwal...</div>
        <button class="btn btn-outline" id="btn-test-alarm" style="margin-top: 12px; width: 100%; border-color: rgba(255,255,255,0.4); color: white; padding: 8px; font-size: 0.85rem; border-radius: var(--radius-md); background: rgba(255,255,255,0.1); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
          🔔 Tes Bunyi Alarm
        </button>
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

  // Render timeline dynamically based on current time
  function renderTimeline() {
    const container = page.querySelector('#timeline-container');
    if (!container) return;
    container.innerHTML = '';

    const d = new Date();
    const currentMins = d.getHours() * 60 + d.getMinutes();
    
    const schedules = getSchedulesForInterval(currentInterval);

    let foundCurrent = false;
    schedules.forEach(item => {
      let status, state;
      if (item.mins <= currentMins) {
        status = 'applied';
        state = 'done';
      } else if (!foundCurrent) {
        status = 'pending';
        state = 'current';
        foundCurrent = true;
      } else {
        status = 'upcoming';
        state = 'upcoming';
      }

      const el = document.createElement('div');
      el.className = `timeline-item ${state}`;
      el.innerHTML = `
        <div class="tl-time">${item.timeStr}</div>
        <div class="tl-label">${item.label}</div>
        ${status !== 'upcoming' ? `<div class="tl-status ${status}">${status === 'applied' ? '✓ Sudah' : '⏳ Menunggu'}</div>` : ''}
      `;
      container.appendChild(el);
    });
  }

  // Initial timeline render
  renderTimeline();

  // Web Audio API Alarm sound synthesizer (Retro Digital Alarm Sound)
  function playAlarmSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      let count = 0;
      
      const interval = setInterval(() => {
        if (count >= 5) { // Beep 5 times
          clearInterval(interval);
          setTimeout(() => audioCtx.close(), 1000);
          return;
        }
        
        // Dual beep helper
        const playBeep = (delay) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + delay); // A5 note
          
          gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
          gain.gain.linearRampToValueAtTime(0.25, audioCtx.currentTime + delay + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + 0.15);
          
          osc.start(audioCtx.currentTime + delay);
          osc.stop(audioCtx.currentTime + delay + 0.18);
        };
        
        playBeep(0);
        playBeep(0.18);
        
        count++;
      }, 800);
    } catch (e) {
      console.error("Gagal memutar suara alarm:", e);
    }
  }

  // Test alarm button listener
  page.querySelector('#btn-test-alarm').addEventListener('click', (e) => {
    e.stopPropagation();
    playAlarmSound();
    
    // Show toast for testing
    const toast = page.querySelector('#toast');
    if (toast) {
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  });

  // Helper to show a custom interval popup modal instead of browser prompt
  function showCustomIntervalModal(callback) {
    const existing = document.querySelector('.custom-interval-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay custom-interval-overlay';
    overlay.innerHTML = `
      <div class="diary-modal custom-interval-modal anim-fade-in-up" style="max-width: 320px; padding: 24px; text-align: center; border-radius: var(--radius-lg); background: white;">
        <div class="modal-handle" style="width: 40px; height: 4px; background: var(--border-light); border-radius: var(--radius-full); margin: 0 auto 16px auto;"></div>
        <div style="font-size: 2.5rem; margin-bottom: 12px; animation: bounce 2s infinite;">⏱️</div>
        <h3 style="margin-bottom: 8px; font-weight: 700; color: var(--text-primary); font-size: 1.2rem;">Interval Kustom</h3>
        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 16px; line-height: 1.4;">
          Berapa jam interval pengingat sunscreen yang Anda inginkan?
        </p>
        
        <input type="number" id="custom-hrs-input" class="auth-input" min="1" max="24" value="${currentInterval !== 2 && currentInterval !== 3 ? currentInterval : 4}" style="text-align: center; font-size: 1.3rem; font-weight: 700; margin-bottom: 20px; padding: 12px; border: 1.5px solid var(--border-light); border-radius: var(--radius-md); width: 100%; box-sizing: border-box; color: var(--primary);" />
        
        <div style="display: flex; gap: 12px; width: 100%;">
          <button class="btn btn-outline" id="btn-custom-cancel" style="flex: 1; padding: 12px; font-size: 0.9rem; font-weight: 600; border-radius: var(--radius-md); cursor: pointer;">Batal</button>
          <button class="btn btn-primary" id="btn-custom-save" style="flex: 1; padding: 12px; font-size: 0.9rem; font-weight: 600; border-radius: var(--radius-md); cursor: pointer; background: var(--primary); color: white; border: none;">Simpan</button>
        </div>
      </div>
    `;

    overlay.querySelector('#btn-custom-cancel').addEventListener('click', () => {
      overlay.remove();
    });

    overlay.querySelector('#btn-custom-save').addEventListener('click', () => {
      const inputVal = overlay.querySelector('#custom-hrs-input').value;
      const hrs = parseInt(inputVal);
      if (hrs && !isNaN(hrs) && hrs > 0) {
        callback(hrs);
        overlay.remove();
      } else {
        showCustomAlert("Mohon masukkan angka jam yang valid (minimal 1 jam)!", "Validasi Gagal");
      }
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
    
    // Auto focus and select input
    setTimeout(() => {
      const input = overlay.querySelector('#custom-hrs-input');
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  // Reminder chips
  page.querySelectorAll('.reminder-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const nextTextEl = page.querySelector('#alarm-next-text');
      const interval = chip.dataset.interval;
      
      if (interval === 'custom') {
        showCustomIntervalModal((hrs) => {
          if (hrs && !isNaN(hrs) && hrs > 0) {
            currentInterval = hrs;
            page.querySelectorAll('.reminder-chip').forEach(c => {
              c.classList.remove('active');
              if (c.dataset.interval === 'custom') {
                c.textContent = `${hrs} jam`;
              } else {
                const baseInt = c.dataset.interval;
                c.textContent = `${baseInt} jam`;
              }
            });
            chip.classList.add('active');

            // Save locally and sync to database
            localStorage.setItem('bglow_sunscreen_interval_' + userId, currentInterval);
            syncUserData({ sunscreen_interval: currentInterval });

            renderTimeline();
            const next = getNextSchedule();
            seconds = getSecondsRemaining(next);
            if (nextTextEl) {
              nextTextEl.textContent = `Oles ulang sunscreen pukul ${next.timeStr}${next.isTomorrow ? ' (Besok)' : ''}`;
            }
          }
        });
      } else {
        currentInterval = parseInt(interval);
        page.querySelectorAll('.reminder-chip').forEach(c => {
          c.classList.remove('active');
          if (c.dataset.interval === 'custom') {
            c.textContent = 'Kustom';
          } else {
            const baseInt = c.dataset.interval;
            c.textContent = `${baseInt} jam`;
          }
        });
        chip.classList.add('active');

        // Save locally and sync to database
        localStorage.setItem('bglow_sunscreen_interval_' + userId, currentInterval);
        syncUserData({ sunscreen_interval: currentInterval });

        renderTimeline();
        const next = getNextSchedule();
        seconds = getSecondsRemaining(next);
        if (nextTextEl) {
          nextTextEl.textContent = `Oles ulang sunscreen pukul ${next.timeStr}${next.isTomorrow ? ' (Besok)' : ''}`;
        }
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

  // Initialize countdown labels
  const nextTextEl = page.querySelector('#alarm-next-text');
  if (nextTextEl) {
    nextTextEl.textContent = `Oles ulang sunscreen pukul ${initialSchedule.timeStr}${initialSchedule.isTomorrow ? ' (Besok)' : ''}`;
  }

  // Countdown timer
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
      playAlarmSound();
      showAlarmPopup();
      
      // Update timeline status dynamically since a slot just passed
      renderTimeline();
      
      // Recalculate next schedule
      const next = getNextSchedule();
      seconds = getSecondsRemaining(next);
      if (nextTextEl) {
        nextTextEl.textContent = `Oles ulang sunscreen pukul ${next.timeStr}${next.isTomorrow ? ' (Besok)' : ''}`;
      }
    }
  }, 1000);

  function showAlarmPopup() {
    // Prevent duplicate overlays
    const existing = document.querySelector('.alarm-popup-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay alarm-popup-overlay';
    overlay.innerHTML = `
      <div class="diary-modal" style="text-align:center;">
        <div class="modal-handle"></div>
        <div style="font-size: 3.5rem; margin-bottom: 15px; animation: pulse 1s infinite alternate;">☀️</div>
        <h2 style="margin-bottom: 10px; color: #F43F5E;">Waktunya Re-apply!</h2>
        <p style="color: var(--text-secondary); margin-bottom: 20px; line-height: 1.5;">Indeks UV saat ini memerlukan perlindungan aktif. Segera oleskan ulang sunscreen-mu untuk menjaga kulit dari sinar matahari.</p>
        <button class="btn btn-primary" id="btn-done-reapply" style="width: 100%; margin-bottom: 10px; background: #F43F5E; border: none; padding: 12px; font-weight: 600; border-radius: var(--radius-md); color: white; cursor: pointer;">Sudah Re-apply</button>
        <button class="btn btn-outline" id="btn-snooze" style="width: 100%; padding: 12px; font-weight: 600; border-radius: var(--radius-md); cursor: pointer;">Ingatkan 10 menit lagi</button>
      </div>
    `;
    
    overlay.querySelector('#btn-done-reapply').addEventListener('click', () => {
      overlay.remove();
      // Recalculate and reset
      const next = getNextSchedule();
      seconds = getSecondsRemaining(next);
      renderTimeline();
    });
    
    overlay.querySelector('#btn-snooze').addEventListener('click', () => {
      overlay.remove();
      seconds = 600; // snooze for 10 minutes
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
