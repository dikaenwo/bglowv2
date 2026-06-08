import { icons } from '../components/BottomNav.js';

// ⚙️ OpenUV API Key
const OPENUV_API_KEY = 'openuv-1wrnvrmfurl4n7-io';
const OPENUV_URL = 'https://api.openuv.io/api/v1/uv';

// ─── UV helpers ───────────────────────────────────────────
function getUVLevel(uv) {
  if (uv >= 11) return { label: 'Ekstrem',    color: '#7C3AED', bg: 'rgba(124,58,237,0.15)', spf: 50, interval: 1 };
  if (uv >= 8)  return { label: 'Sangat Tinggi', color: '#DC2626', bg: 'rgba(220,38,38,0.15)', spf: 50, interval: 1.5 };
  if (uv >= 6)  return { label: 'Tinggi',      color: '#EA580C', bg: 'rgba(234,88,12,0.15)',  spf: 30, interval: 2 };
  if (uv >= 3)  return { label: 'Sedang',      color: '#D97706', bg: 'rgba(217,119,6,0.15)',  spf: 15, interval: 3 };
  return          { label: 'Rendah',       color: '#059669', bg: 'rgba(5,150,105,0.15)',   spf: 15, interval: 4 };
}

function getUVAdvice(uv) {
  if (uv >= 11) return 'Hindari paparan matahari! Gunakan SPF 50+, pakaian pelindung & topi.';
  if (uv >= 8)  return 'Perlindungan ekstra wajib. SPF 50+, re-apply setiap 1.5 jam.';
  if (uv >= 6)  return 'Perlindungan diperlukan. Gunakan SPF 30+ dan re-apply setiap 2 jam.';
  if (uv >= 3)  return 'Gunakan sunscreen jika beraktivitas di luar ruangan.';
  return 'Indeks UV aman. Perlindungan ringan sudah cukup.';
}

function getUVIcon(uv) {
  if (uv >= 8)  return '🔥';
  if (uv >= 6)  return '☀️';
  if (uv >= 3)  return '⛅';
  return '🌤️';
}

function fmtTime(date) {
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function fmtHHMMSS(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// ─── Fetch UV dari OpenUV ─────────────────────────────────
async function fetchOpenUV(lat, lng) {
  const res = await fetch(`${OPENUV_URL}?lat=${lat}&lng=${lng}`, {
    headers: { 'x-access-token': OPENUV_API_KEY }
  });
  if (!res.ok) throw new Error(`OpenUV API error ${res.status}`);
  return res.json();
}

// ─── Reverse geocode city name ────────────────────────────
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'id', 'User-Agent': 'BGlowApp/1.0' } }
    );
    const data = await res.json();
    const addr = data.address || {};
    // Prioritas: village/suburb > city_district > city > town > county
    return addr.village || addr.suburb || addr.city_district
        || addr.city || addr.town || addr.county
        || addr.state || 'Lokasi Anda';
  } catch {
    return 'Lokasi Anda';
  }
}

// ─── Get geolocation dengan permission eksplisit ──────────
function getLocation() {
  return new Promise((resolve) => {
    const fallback = { lat: -6.2088, lng: 106.8456, city: 'Jakarta (default)' };

    if (!navigator.geolocation) {
      return resolve(fallback);
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const city = await reverseGeocode(lat, lng);
        resolve({ lat, lng, city });
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        resolve(fallback);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,   // cache 1 menit
      }
    );
  });
}

// ─── Main render ──────────────────────────────────────────
export function renderSunscreenAlarm() {
  const page = document.createElement('div');
  page.className = 'page';

  // State
  let timerInterval = null;
  let countdownSec = 7200;
  let alarmIntervalHours = 2;
  let currentUV = 0;
  let nextAlarmTime = null;
  let alarmActive = false;
  let reapplyLog = JSON.parse(localStorage.getItem('ss_reapply_log') || '[]');
  const today = new Date().toDateString();
  reapplyLog = reapplyLog.filter(t => new Date(t).toDateString() === today);

  // ── Build skeleton UI ──────────────────────────────────
  page.innerHTML = `
    <div class="page-header">
      <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
      <h1>Alarm Sunscreen</h1>
      <button id="refresh-uv-btn" style="background:none;border:none;cursor:pointer;padding:6px;margin-left:auto;opacity:0.7;" title="Refresh UV">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
      </button>
    </div>

    <div class="page-content">

      <!-- UV Dashboard -->
      <div class="uv-dashboard anim-fade-in-up" id="uv-dashboard">
        <div class="uv-dash-header">
          <div>
            <div class="uv-title">Indeks UV Real-Time</div>
            <div class="uv-date" id="uv-location-text">📍 Mendeteksi lokasi...</div>
          </div>
          <div id="uv-icon-big" style="font-size:2rem;">⏳</div>
        </div>

        <div class="uv-gauge-wrap">
          <div class="uv-gauge" id="uv-gauge-container">
            <svg viewBox="0 0 100 100">
              <circle class="gauge-bg" cx="50" cy="50" r="40"/>
              <circle class="gauge-fill" cx="50" cy="50" r="40" id="uv-gauge-fill"/>
            </svg>
            <div class="gauge-value">
              <div class="gauge-number" id="uv-number">--</div>
              <div class="gauge-label">UV</div>
            </div>
          </div>
          <div class="uv-info-right">
            <div class="uv-level-text" id="uv-level-text" style="font-size:1.3rem;font-weight:700;">Memuat...</div>
            <div class="uv-level-desc" id="uv-level-desc" style="font-size:0.78rem;opacity:0.8;margin-top:6px;line-height:1.5;">
              Mengambil data UV dari OpenUV...
            </div>
            <div id="uv-spf-badge" style="display:none;margin-top:10px;padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;background:rgba(255,255,255,0.15);display:inline-block;width:fit-content;"></div>
            <div id="uv-updated" style="margin-top:8px;font-size:0.72rem;opacity:0.55;"></div>
          </div>
        </div>

        <!-- UV Forecast Bar -->
        <div id="uv-forecast-bar" style="margin-top:14px;display:none;">
          <div style="font-size:0.75rem;opacity:0.6;margin-bottom:6px;">Prakiraan UV hari ini</div>
          <div id="uv-forecast-items" style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;"></div>
        </div>
      </div>

      <!-- Alarm Toggle -->
      <div class="reminder-section anim-fade-in-up anim-delay-1" style="padding:var(--space-lg);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-md);">
          <div>
            <div style="font-weight:600;font-size:0.95rem;">Aktifkan Alarm</div>
            <div style="font-size:0.78rem;opacity:0.6;margin-top:2px;">Notifikasi pengingat oles ulang</div>
          </div>
          <label class="ss-toggle">
            <input type="checkbox" id="alarm-toggle" checked>
            <span class="ss-toggle-slider"></span>
          </label>
        </div>

        <div id="alarm-controls">
          <div class="reminder-title" style="margin-bottom:10px;">Interval Pengingat</div>
          <div class="reminder-options">
            <button class="reminder-chip active" data-interval="1">1 jam</button>
            <button class="reminder-chip active" data-interval="2">2 jam</button>
            <button class="reminder-chip" data-interval="3">3 jam</button>
            <button class="reminder-chip" data-interval="custom">Kustom</button>
          </div>
          <div id="custom-input-wrap" style="display:none;margin-top:12px;">
            <input id="custom-minutes" type="number" min="15" max="360" placeholder="Menit (15–360)"
              style="width:100%;padding:10px 14px;border-radius:var(--radius-md);border:1.5px solid var(--border);background:var(--bg-soft);color:var(--text-primary);font-size:0.9rem;">
          </div>
        </div>
      </div>

      <!-- Countdown Card -->
      <div class="active-alarm-card anim-fade-in-up anim-delay-2" id="countdown-card">
        <div class="alarm-card-header">
          ${icons.bell}
          <span>Pengingat Berikutnya</span>
          <span id="alarm-status-badge" style="margin-left:auto;font-size:0.7rem;padding:2px 10px;border-radius:20px;background:rgba(16,185,129,0.2);color:#10B981;">AKTIF</span>
        </div>
        <div class="alarm-countdown" id="countdown">--:--:--</div>
        <div class="alarm-next-text" id="alarm-next-text">Memuat jadwal...</div>

        <!-- Reapply Button -->
        <button id="reapply-btn" style="
          width:100%;margin-top:14px;padding:12px;border-radius:var(--radius-md);
          background:linear-gradient(135deg,#F59E0B,#EF4444);color:white;
          font-weight:700;font-size:0.9rem;border:none;cursor:pointer;
          box-shadow:0 4px 15px rgba(239,68,68,0.3);
          transition:transform 0.15s ease,box-shadow 0.15s ease;
        ">
          ☀️ Sudah Re-apply Sunscreen!
        </button>
      </div>

      <!-- Re-apply Log Today -->
      <div class="reminder-section anim-fade-in-up anim-delay-3" style="padding:var(--space-lg);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div class="reminder-title" style="margin:0;">Log Hari Ini</div>
          <span id="reapply-count-badge" style="font-size:0.75rem;padding:2px 10px;border-radius:20px;background:rgba(245,158,11,0.15);color:#D97706;font-weight:600;">0x</span>
        </div>
        <div id="reapply-log-list"></div>
      </div>

      <!-- Tips Section -->
      <div class="reminder-section anim-fade-in-up anim-delay-4" style="padding:var(--space-lg) var(--space-lg) 100px;">
        <div class="reminder-title" style="margin-bottom:12px;">Tips Sunscreen</div>
        <div id="tips-container"></div>
      </div>

    </div>

    <!-- Toast -->
    <div class="toast-notification" id="toast" style="display:none;">
      <span class="toast-icon">☀️</span>
      <span class="toast-text">Waktunya oles ulang sunscreen!</span>
    </div>

    <style>
      /* ─── Toggle Switch ─── */
      .ss-toggle { position:relative;display:inline-block;width:48px;height:26px; }
      .ss-toggle input { opacity:0;width:0;height:0; }
      .ss-toggle-slider {
        position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;
        background:#ccc;transition:.3s;border-radius:26px;
      }
      .ss-toggle-slider:before {
        position:absolute;content:"";height:20px;width:20px;
        left:3px;bottom:3px;background:white;transition:.3s;border-radius:50%;
        box-shadow:0 2px 6px rgba(0,0,0,0.2);
      }
      input:checked + .ss-toggle-slider { background: linear-gradient(135deg,#F59E0B,#EF4444); }
      input:checked + .ss-toggle-slider:before { transform:translateX(22px); }

      /* ─── Reapply btn hover ─── */
      #reapply-btn:hover { transform:translateY(-2px);box-shadow:0 8px 20px rgba(239,68,68,0.4); }
      #reapply-btn:active { transform:translateY(0); }

      /* ─── Forecast item ─── */
      .forecast-item {
        flex:0 0 52px;text-align:center;
        padding:8px 4px;border-radius:var(--radius-sm);
        background:rgba(255,255,255,0.08);font-size:0.72rem;
      }
      .forecast-item.current { background:rgba(245,158,11,0.2);border:1px solid rgba(245,158,11,0.4); }
      .forecast-uv { font-weight:700;font-size:1rem;margin-top:4px; }

      /* ─── Log item ─── */
      .log-item {
        display:flex;align-items:center;gap:10px;
        padding:10px 12px;border-radius:var(--radius-md);
        background:var(--bg-soft);margin-bottom:8px;
        animation:fadeInUp 0.3s ease;
      }
      .log-item .log-dot { width:8px;height:8px;border-radius:50%;background:#10B981;flex-shrink:0; }
      .log-item .log-time { font-size:0.85rem;font-weight:600;color:var(--text-primary); }
      .log-item .log-sub { font-size:0.75rem;color:var(--text-tertiary);margin-left:auto; }

      /* ─── Tip card ─── */
      .tip-card {
        display:flex;gap:12px;align-items:flex-start;
        padding:12px;border-radius:var(--radius-md);
        background:var(--bg-soft);margin-bottom:10px;
      }
      .tip-icon { font-size:1.4rem;flex-shrink:0; }
      .tip-text { font-size:0.82rem;line-height:1.6;color:var(--text-secondary); }
      .tip-title { font-weight:600;font-size:0.85rem;color:var(--text-primary);margin-bottom:2px; }

      /* ─── Alarm modal ─── */
      .alarm-modal-anim { animation:alarmPulse 0.6s ease; }
      @keyframes alarmPulse {
        0%{transform:scale(0.85);opacity:0}
        60%{transform:scale(1.05)}
        100%{transform:scale(1);opacity:1}
      }

      /* ─── Reminder chip active fix ─── */
      .reminder-chip.active { background:linear-gradient(135deg,#F59E0B,#EF4444) !important;color:white !important;border-color:transparent !important; }
    </style>
  `;

  // ── Back button ────────────────────────────────────────
  page.querySelector('#back-btn').addEventListener('click', () => {
    cleanup();
    window.location.hash = '#/';
  });

  // ── Tips data ──────────────────────────────────────────
  const tips = [
    { icon: '🧴', title: 'Oleskan 15 Menit Sebelum Keluar', text: 'Beri waktu sunscreen menyerap ke kulit sebelum terpapar sinar matahari.' },
    { icon: '🔁', title: 'Re-apply Setiap 2 Jam', text: 'Efektivitas sunscreen berkurang karena keringat, air, dan paparan UV terus-menerus.' },
    { icon: '💧', title: 'Gunakan Jumlah yang Cukup', text: 'Gunakan sekitar ½ sendok teh untuk wajah & leher. Kurang dari itu → proteksi berkurang.' },
    { icon: '⛱️', title: 'UV Tinggi Jam 10–14', text: 'Hindari paparan langsung di jam puncak UV. Cari teduh atau gunakan payung.' },
  ];
  const tipsContainer = page.querySelector('#tips-container');
  tips.forEach(t => {
    tipsContainer.innerHTML += `
      <div class="tip-card">
        <div class="tip-icon">${t.icon}</div>
        <div><div class="tip-title">${t.title}</div><div class="tip-text">${t.text}</div></div>
      </div>`;
  });

  // ── Render log ─────────────────────────────────────────
  function renderLog() {
    const list = page.querySelector('#reapply-log-list');
    const badge = page.querySelector('#reapply-count-badge');
    badge.textContent = `${reapplyLog.length}x`;
    if (reapplyLog.length === 0) {
      list.innerHTML = `<div style="text-align:center;padding:16px;opacity:0.5;font-size:0.85rem;">Belum ada catatan hari ini</div>`;
      return;
    }
    list.innerHTML = reapplyLog.map((t, i) => `
      <div class="log-item">
        <div class="log-dot"></div>
        <div class="log-time">${fmtTime(new Date(t))}</div>
        <div class="log-sub">Re-apply #${i+1}</div>
      </div>`).join('');
  }
  renderLog();

  // ── Alarm timer logic ──────────────────────────────────
  function startCountdown() {
    if (timerInterval) clearInterval(timerInterval);
    nextAlarmTime = new Date(Date.now() + countdownSec * 1000);
    updateCountdownUI();

    timerInterval = setInterval(() => {
      countdownSec--;
      if (countdownSec <= 0) {
        clearInterval(timerInterval);
        countdownSec = 0;
        updateCountdownUI();
        if (alarmActive) showAlarmModal();
      } else {
        updateCountdownUI();
      }
    }, 1000);
  }

  function updateCountdownUI() {
    const el = page.querySelector('#countdown');
    const nextText = page.querySelector('#alarm-next-text');
    if (el) el.textContent = fmtHHMMSS(Math.max(0, countdownSec));
    if (nextText && nextAlarmTime) {
      nextText.textContent = `Oles ulang sunscreen pukul ${fmtTime(nextAlarmTime)}`;
    }
  }

  function resetAlarm(hours) {
    alarmIntervalHours = hours;
    countdownSec = Math.round(hours * 3600);
    startCountdown();
  }

  // ── Alarm toggle ───────────────────────────────────────
  const alarmToggle = page.querySelector('#alarm-toggle');
  const alarmStatusBadge = page.querySelector('#alarm-status-badge');

  alarmToggle.addEventListener('change', () => {
    alarmActive = alarmToggle.checked;
    if (alarmActive) {
      alarmStatusBadge.textContent = 'AKTIF';
      alarmStatusBadge.style.background = 'rgba(16,185,129,0.2)';
      alarmStatusBadge.style.color = '#10B981';
      startCountdown();
    } else {
      alarmStatusBadge.textContent = 'NONAKTIF';
      alarmStatusBadge.style.background = 'rgba(156,163,175,0.2)';
      alarmStatusBadge.style.color = '#9CA3AF';
      if (timerInterval) clearInterval(timerInterval);
    }
  });
  alarmActive = true;

  // ── Reminder chip ──────────────────────────────────────
  const chips = page.querySelectorAll('.reminder-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const customWrap = page.querySelector('#custom-input-wrap');
      if (chip.dataset.interval === 'custom') {
        customWrap.style.display = 'block';
        const inp = page.querySelector('#custom-minutes');
        inp.focus();
        inp.addEventListener('change', () => {
          const mins = parseInt(inp.value);
          if (mins >= 15 && mins <= 360) resetAlarm(mins / 60);
        });
      } else {
        customWrap.style.display = 'none';
        resetAlarm(parseFloat(chip.dataset.interval));
      }
    });
  });

  // ── Re-apply button ────────────────────────────────────
  page.querySelector('#reapply-btn').addEventListener('click', () => {
    const now = new Date();
    reapplyLog.push(now.toISOString());
    localStorage.setItem('ss_reapply_log', JSON.stringify(reapplyLog));
    renderLog();
    resetAlarm(alarmIntervalHours);

    // Flash animation
    const btn = page.querySelector('#reapply-btn');
    btn.textContent = '✅ Tercatat! Timer direset';
    btn.style.background = 'linear-gradient(135deg,#10B981,#059669)';
    setTimeout(() => {
      btn.textContent = '☀️ Sudah Re-apply Sunscreen!';
      btn.style.background = 'linear-gradient(135deg,#F59E0B,#EF4444)';
    }, 2000);

    showToast('✅ Re-apply tercatat! Timer direset.');
  });

  // ── Refresh button ─────────────────────────────────────
  page.querySelector('#refresh-uv-btn').addEventListener('click', () => {
    loadUVData();
  });

  // ── Alarm modal ────────────────────────────────────────
  function showAlarmModal() {
    // Try browser notification first
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('B-Glow ☀️', {
        body: `Waktunya re-apply sunscreen! UV saat ini: ${currentUV}`,
        icon: '/favicon.ico'
      });
    }

    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal alarm-modal-anim" style="text-align:center;">
        <div class="modal-handle"></div>
        <div style="font-size:3rem;margin-bottom:8px;animation:pulse 1.2s infinite ease-in-out;">☀️</div>
        <h2 style="margin-bottom:6px;color:#F59E0B;font-size:1.3rem;">Waktunya Re-apply!</h2>
        <p style="color:var(--text-secondary);margin-bottom:6px;font-size:0.85rem;">
          Indeks UV saat ini: <strong style="color:#EF4444;">${currentUV.toFixed(1)}</strong>
        </p>
        <p style="color:var(--text-secondary);margin-bottom:20px;font-size:0.82rem;line-height:1.6;">
          Segera oleskan ulang sunscreen-mu untuk perlindungan maksimal.
        </p>
        <button class="btn btn-primary" id="btn-done-reapply"
          style="width:100%;margin-bottom:10px;background:linear-gradient(135deg,#F59E0B,#EF4444);border:none;padding:14px;border-radius:var(--radius-md);color:white;font-weight:700;cursor:pointer;">
          ✅ Sudah Re-apply
        </button>
        <button class="btn btn-outline" id="btn-snooze"
          style="width:100%;padding:12px;border-radius:var(--radius-md);border:1.5px solid var(--border);background:none;color:var(--text-secondary);cursor:pointer;">
          🕐 Ingatkan 10 menit lagi
        </button>
      </div>
    `;

    overlay.querySelector('#btn-done-reapply').addEventListener('click', () => {
      overlay.remove();
      const now = new Date();
      reapplyLog.push(now.toISOString());
      localStorage.setItem('ss_reapply_log', JSON.stringify(reapplyLog));
      renderLog();
      resetAlarm(alarmIntervalHours);
    });

    overlay.querySelector('#btn-snooze').addEventListener('click', () => {
      overlay.remove();
      countdownSec = 600;
      startCountdown();
    });

    document.body.appendChild(overlay);
  }

  // ── Toast ──────────────────────────────────────────────
  function showToast(msg) {
    const toast = page.querySelector('#toast');
    if (!toast) return;
    toast.querySelector('.toast-text').textContent = msg;
    toast.style.display = 'flex';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.style.display = 'none', 400);
    }, 3000);
  }

  // ── Load UV Data from OpenUV ───────────────────────────
  async function loadUVData() {
    const refreshBtn = page.querySelector('#refresh-uv-btn');
    if (refreshBtn) refreshBtn.style.opacity = '0.3';

    try {
      const { lat, lng, city } = await getLocation();
      const locationText = page.querySelector('#uv-location-text');
      if (locationText) locationText.textContent = `📍 ${city}`;

      const data = await fetchOpenUV(lat, lng);
      const uv = data.result.uv;
      const uvMax = data.result.uv_max;
      const uvTime = new Date(data.result.uv_time);
      currentUV = uv;

      const level = getUVLevel(uv);
      const advice = getUVAdvice(uv);

      // ── Update gauge ──────────────────────────────────
      const fill = page.querySelector('#uv-gauge-fill');
      const num = page.querySelector('#uv-number');
      const dashboard = page.querySelector('#uv-dashboard');

      if (dashboard) {
        dashboard.style.borderLeft = `4px solid ${level.color}`;
        dashboard.style.boxShadow = `0 4px 30px ${level.color}30`;
      }

      if (fill) {
        const percent = Math.min(uv / 12, 1);
        const circ = 2 * Math.PI * 40;
        fill.style.strokeDasharray = circ;
        fill.style.strokeDashoffset = circ - (circ * percent);
        fill.style.stroke = level.color;
      }

      if (num) {
        let cur = 0;
        const step = Math.max(uv / 25, 0.1);
        const t = setInterval(() => {
          cur = Math.min(cur + step, uv);
          num.textContent = cur.toFixed(1);
          if (cur >= uv) clearInterval(t);
        }, 40);
      }

      // ── Update text ───────────────────────────────────
      const levelText = page.querySelector('#uv-level-text');
      const levelDesc = page.querySelector('#uv-level-desc');
      const spfBadge = page.querySelector('#uv-spf-badge');
      const uvUpdated = page.querySelector('#uv-updated');
      const uvIconBig = page.querySelector('#uv-icon-big');

      if (levelText) {
        levelText.textContent = `${getUVIcon(uv)} ${level.label}`;
        levelText.style.color = level.color;
      }
      if (levelDesc) levelDesc.textContent = advice;
      if (spfBadge) {
        spfBadge.style.display = 'inline-block';
        spfBadge.textContent = `Rekomendasi SPF ${level.spf}+`;
        spfBadge.style.background = `${level.color}25`;
        spfBadge.style.color = level.color;
      }
      if (uvUpdated) uvUpdated.textContent = `Diperbarui: ${fmtTime(uvTime)} · Maks hari ini: ${uvMax.toFixed(1)}`;
      if (uvIconBig) uvIconBig.textContent = getUVIcon(uv);

      // ── Auto-adjust alarm interval based on UV ────────
      const suggestedInterval = level.interval;
      chips.forEach(c => c.classList.remove('active'));
      const matchChip = page.querySelector(`.reminder-chip[data-interval="${suggestedInterval}"]`);
      if (matchChip) {
        matchChip.classList.add('active');
        alarmIntervalHours = suggestedInterval;
        countdownSec = suggestedInterval * 3600;
      }

      // ── Forecast bar ──────────────────────────────────
      if (data.result.sun_info) {
        const forecastBar = page.querySelector('#uv-forecast-bar');
        const forecastItems = page.querySelector('#uv-forecast-items');
        if (forecastBar && forecastItems) {
          forecastBar.style.display = 'block';
          // Generate hourly estimates using safe UV window
          const sunRise = new Date(data.result.sun_info.sun_times.sunrise);
          const sunSet = new Date(data.result.sun_info.sun_times.sunset);
          const nowH = new Date().getHours();
          forecastItems.innerHTML = '';
          for (let h = sunRise.getHours(); h <= sunSet.getHours(); h += 2) {
            const peak = (sunRise.getHours() + sunSet.getHours()) / 2;
            const factor = Math.max(0, 1 - Math.pow((h - peak) / ((sunSet.getHours() - sunRise.getHours()) / 2), 2));
            const estUV = (uvMax * factor).toFixed(1);
            const estLevel = getUVLevel(parseFloat(estUV));
            const isCur = h === nowH || (h <= nowH && h + 2 > nowH);
            forecastItems.innerHTML += `
              <div class="forecast-item ${isCur ? 'current' : ''}">
                <div style="opacity:0.7;">${String(h).padStart(2,'0')}:00</div>
                <div class="forecast-uv" style="color:${estLevel.color};">${estUV}</div>
              </div>`;
          }
        }
      }

      // Start countdown with recommended interval
      startCountdown();

      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }

    } catch (err) {
      console.error('OpenUV fetch error:', err);
      const levelText = page.querySelector('#uv-level-text');
      const levelDesc = page.querySelector('#uv-level-desc');
      const locationText = page.querySelector('#uv-location-text');
      if (levelText) levelText.textContent = '⚠️ Gagal memuat';
      if (levelDesc) levelDesc.textContent = `Error: ${err.message}. Pastikan terhubung ke internet.`;
      if (locationText) locationText.textContent = '📍 Gagal deteksi';

      // Still start countdown with default
      startCountdown();
    }

    if (refreshBtn) refreshBtn.style.opacity = '0.7';
  }

  // ── Cleanup on page remove ─────────────────────────────
  function cleanup() {
    if (timerInterval) clearInterval(timerInterval);
  }

  const origRemove = page.remove.bind(page);
  page.remove = () => { cleanup(); origRemove(); };

  // ── Initial load ───────────────────────────────────────
  // Start default countdown immediately, then update when UV loads
  startCountdown();
  loadUVData();

  return page;
}
