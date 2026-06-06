import { icons } from '../components/BottomNav.js';
import { addRipple, staggerChildren } from '../utils/helpers.js';
import { getRoutine, getProgress, getStreak } from '../utils/store.js';
import { fetchWeather } from '../utils/weather.js';


export function renderHome() {
  const page = document.createElement('div');
  page.className = 'page home-page';
  
  const routine = getRoutine();
  const progress = getProgress();
  const streak = getStreak();
  
  const currentHour = new Date().getHours();
  const timeOfDay = currentHour < 15 ? 'Pagi' : 'Malam';
  const routineKey = currentHour < 15 ? 'morning' : 'night';
  
  const totalSteps = routine[routineKey].length;
  const completedSteps = progress[routineKey].length;
  let progressPct = 0;
  
  if (totalSteps > 0) {
    progressPct = Math.round((completedSteps / totalSteps) * 100);
  }
  
  // Data UV is now handled inside fetchWeather

  let userName = 'Glowers';
  const userStr = localStorage.getItem('bglow_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.name) userName = user.name.split(' ')[0]; // use first name
    } catch (e) {}
  }

  page.innerHTML = `
    <!-- Header -->
    <header class="home-header anim-fade-in">
      <div class="home-header-top">
        <div>
          <div class="home-greeting">Selamat ${timeOfDay}, ${userName} ✨</div>
          <div class="home-name">Dashboard Kulitmu</div>
        </div>
        <button class="home-notif-btn" id="notif-btn" style="color: #F59E0B;">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
        </button>
      </div>
    </header>

    <!-- Dashboard Content -->
    <section class="dashboard-content">
      
      <!-- Weather & Env Widget -->
      <div class="weather-widget anim-fade-in-up">
        <div class="weather-main">
          <div class="weather-icon-wrap" id="w-icon">⏳</div>
          <div>
            <div class="weather-temp" id="w-temp">--°C</div>
            <div class="weather-desc" id="w-desc">Memuat cuaca...</div>
          </div>
        </div>
        <div class="weather-details">
          <div class="w-detail-item">
            <span>UV Index:</span>
            <span class="w-detail-val" id="w-uv">-</span>
          </div>
          <div class="w-detail-item">
            <span>Kelembapan:</span>
            <span class="w-detail-val" id="w-humid">-%</span>
          </div>
        </div>
      </div>

      <!-- Routine Summary Card -->
      <div class="routine-summary-card anim-fade-in-up anim-delay-1">
        <div class="rsc-header">
          <h3 class="rsc-title">Rutinitas ${timeOfDay}</h3>
          <span class="rsc-badge">${completedSteps}/${totalSteps} Selesai</span>
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
            <div class="qa-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <span class="qa-label">Scan AI</span>
          </div>
          <div class="qa-item" data-action="diary">
            <div class="qa-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
            <span class="qa-label">Jurnal</span>
          </div>
          <div class="qa-item" data-action="alarm">
            <div class="qa-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/></svg>
            </div>
            <span class="qa-label">Alarm UV</span>
          </div>
          <div class="qa-item" data-action="bpom">
            <div class="qa-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <span class="qa-label">Cek BPOM</span>
          </div>
        </div>
      </div>

      <!-- Daily Tip -->
      <div class="daily-tip-card anim-fade-in-up anim-delay-3">
        <div class="tip-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EAB308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
        </div>
        <div class="tip-content">
          <h4>Tips Harian</h4>
          <p id="daily-tip-text">Memuat tips kulit...</p>
        </div>
      </div>

      <!-- Streak Consistency -->
      <div class="streak-card anim-fade-in-up anim-delay-4">
        <div class="sc-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
        </div>
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

  // Fetch real weather and update DOM
  fetchWeather().then(w => {
    if (!w) return;
    const isHighUv = w.uvIndex >= 6;
    
    const elIcon = page.querySelector('#w-icon');
    const elTemp = page.querySelector('#w-temp');
    const elDesc = page.querySelector('#w-desc');
    const elUv = page.querySelector('#w-uv');
    const elHumid = page.querySelector('#w-humid');
    const elTip = page.querySelector('#daily-tip-text');
    
    if (elIcon) elIcon.innerHTML = w.icon;
    if (elTemp) elTemp.innerHTML = w.temp + '°C';
    if (elDesc) elDesc.innerHTML = w.condition;
    
    if (elUv) {
      elUv.innerHTML = w.uvIndex + (isHighUv ? ' (Tinggi)' : '');
      elUv.className = 'w-detail-val ' + (isHighUv ? 'danger' : '');
    }
    if (elHumid) elHumid.innerHTML = w.humidity + '%';
    
    if (elTip) {
      elTip.innerHTML = isHighUv 
        ? 'UV Index lumayan tinggi hari ini! Wajib gunakan sunscreen dan re-apply tiap 2 jam ya.' 
        : 'Cuaca bersahabat, tapi jangan lupa tetap hidrasi kulitmu dari dalam dengan minum air putih.';
    }
  }).catch(err => console.error('Gagal memuat cuaca:', err));

  return page;
}
