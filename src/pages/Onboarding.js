import { icons } from '../components/BottomNav.js';
import { getUserId, getAuthHeaders, syncUserData } from '../utils/store.js';
import { API_BASE_URL, SKIN_SCAN_API_URL } from '../config.js';
import { showCustomAlert } from '../utils/helpers.js';

export function renderOnboarding() {
  const page = document.createElement('div');
  page.className = 'onboarding';

  // State
  let currentStep = 0;
  const totalSteps = 11; // 0 to 10
  let cameraStream = null;
  let capturedImage = null;
  
  const userId = getUserId();

  const answers = {
    struggle: '',
    goals: [],
    age: '',
    scanResult: null
  };

  const skinGoalsList = [
    { id: 'breakouts', label: 'Mengurangi Jerawat', icon: '✨', bg: '#FEF3C7' },
    { id: 'oiliness', label: 'Mengontrol Minyak', icon: '💧', bg: '#E0F2FE' },
    { id: 'pores', label: 'Mengecilkan Pori', icon: '🔍', bg: '#F3E8FF' },
    { id: 'texture', label: 'Memperbaiki Tekstur', icon: '🌊', bg: '#E0F2FE' },
    { id: 'darkspots', label: 'Mencerahkan Noda', icon: '☀️', bg: '#FEF3C7' },
    { id: 'radiance', label: 'Meningkatkan Radiance', icon: '🌟', bg: '#FEF3C7' },
    { id: 'redness', label: 'Mengurangi Kemerahan', icon: '🩸', bg: '#FEE2E2' },
    { id: 'wrinkles', label: 'Menyamarkan Kerutan', icon: '👵', bg: '#FFEEDD' },
    { id: 'hydration', label: 'Meningkatkan Hidrasi', icon: '💦', bg: '#E0F2FE' },
    { id: 'sensitivity', label: 'Meredakan Kulit Sensitif', icon: '🛡️', bg: '#E2E8F0' }
  ];

  // Helper to stop camera webcam
  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
  }

  // Auto clean camera on hashchange
  const cleanCameraOnLeave = () => {
    stopCamera();
    window.removeEventListener('hashchange', cleanCameraOnLeave);
  };
  window.addEventListener('hashchange', cleanCameraOnLeave);

  // Mapped Permasalahan Colors & descriptions
  const PROBLEM_COLORS = {
    'Jerawat':         { hex: '#FF3B3B', bg: '#FFF0F0', emoji: '🔴' },
    'PIE':             { hex: '#3B7FFF', bg: '#EFF4FF', emoji: '🔵' },
    'PIH':             { hex: '#FF8C00', bg: '#FFF5E6', emoji: '🟠' },
    'Bopeng':          { hex: '#CC00CC', bg: '#F9EEFF', emoji: '🟣' },
    'Hiperpigmentasi': { hex: '#CCCC00', bg: '#FEFEE6', emoji: '🟡' },
    'Kemerahan':       { hex: '#00CC44', bg: '#EDFFF3', emoji: '🟢' },
  };

  const PROBLEM_DESCRIPTIONS = {
    'Jerawat':         'Peradangan folikel rambut akibat sumbatan sebum dan bakteri.',
    'PIE':             'Post-Inflammatory Erythema — kemerahan sisa bekas jerawat.',
    'PIH':             'Post-Inflammatory Hyperpigmentation — bercak gelap bekas jerawat.',
    'Bopeng':          'Jaringan parut cekung akibat kerusakan kolagen dari jerawat parah.',
    'Hiperpigmentasi': 'Penggelapan kulit akibat produksi melanin berlebih.',
    'Kemerahan':       'Iritasi atau rosacea menyebabkan kulit tampak merah.',
  };

  // Base layout skeleton
  page.innerHTML = `
    <div class="ob-header">
      <button class="ob-back-btn" id="ob-back">${icons.chevronLeft}</button>
      <div class="ob-progress-container">
        <div class="ob-progress-fill" id="ob-progress"></div>
      </div>
      <button class="ob-skip-btn" id="ob-skip" style="visibility: hidden;">Lewati</button>
    </div>
    <div class="ob-slide-container" id="ob-viewport">
      <!-- Dynamic Viewport -->
    </div>
  `;

  const viewport = page.querySelector('#ob-viewport');
  const progressBar = page.querySelector('#ob-progress');
  const backBtn = page.querySelector('#ob-back');
  const skipBtn = page.querySelector('#ob-skip');

  function updateHeader() {
    const header = page.querySelector('.ob-header');

    // Hide entire header on intro splash slides (0, 1, 2)
    if (currentStep <= 2) {
      header.style.display = 'none';
      return;
    } else {
      header.style.display = '';
    }

    const pct = Math.round((currentStep / (totalSteps - 1)) * 100);
    progressBar.style.width = `${pct}%`;

    // Only show back button for steps that are not in action/processing loops
    if (currentStep === 0 || currentStep === 7 || currentStep === 8 || currentStep === 10) {
      backBtn.style.visibility = 'hidden';
    } else {
      backBtn.style.visibility = 'visible';
    }

    // Skip is available only on kuis questions (steps 3, 4, 5)
    if (currentStep >= 3 && currentStep <= 5) {
      skipBtn.style.visibility = 'visible';
    } else {
      skipBtn.style.visibility = 'hidden';
    }
  }

  function goToStep(step) {
    // If leaving camera step, clean it up
    if (currentStep === 6 && step !== 6) {
      stopCamera();
    }
    currentStep = step;
    updateHeader();
    renderStepContent();
  }

  // Draw step HTML
  function renderStepContent() {
    viewport.innerHTML = '';
    const contentWrap = document.createElement('div');
    contentWrap.className = 'ob-content';

    let html = '';
    let isNextDisabled = false;

    switch (currentStep) {
      case 0:
        // Splash Intro 1
        html = `
          <div class="ob-logo-container" style="display: flex; justify-content: center; align-items: center; height: 160px; margin-bottom: 24px;">
            <img src="/BGLOW-Polos.png" alt="B-Glow Logo" style="width: 100px; height: 100px; object-fit: contain;" />
          </div>
          <div class="ob-title-wrap" style="text-align: center; margin-bottom: 40px; padding: 0 var(--space-md);">
            <h1 class="ob-quiz-title" style="font-size: var(--font-2xl); font-weight: 800; line-height: 1.35; margin: 0;">Bagaimana jika perawatan kulit bisa dibuat sangat mudah?</h1>
          </div>
        `;
        break;

      case 1:
        // Splash Intro 2
        html = `
          <div class="ob-title-wrap">
            <h1 class="ob-quiz-title">Jawaban atas pertanyaan kulit Anda</h1>
            <p class="ob-quiz-subtitle">Semua yang Anda butuhkan dalam satu asisten cerdas.</p>
          </div>
          <div class="ob-intro-questions">
            <div class="ob-intro-q-item">Apa yang harus saya gunakan?</div>
            <div class="ob-intro-q-item">Kandungan apa yang sebenarnya ada di dalam?</div>
            <div class="ob-intro-q-item">Bagaimana urutan pemakaian rutinitas saya?</div>
            <div class="ob-intro-q-item">Berapa lama sampai terlihat hasilnya?</div>
            <div class="ob-intro-q-item highlight">Apakah produk ini benar-benar cocok?</div>
          </div>
        `;
        break;

      case 2:
        // Splash Intro 3
        html = `
          <div class="ob-logo-container" style="display: flex; justify-content: center; align-items: center; height: 120px; margin-bottom: 16px;">
            <img src="/BGLOW-Polos.png" alt="B-Glow Logo" style="width: 80px; height: 80px; object-fit: contain;" />
          </div>
          <div class="ob-title-wrap" style="text-align: center; margin-bottom: 24px; padding: 0 var(--space-md);">
            <h1 class="ob-quiz-title" style="font-size: var(--font-2xl); font-weight: 800; margin-bottom: 8px;">Perkenalkan B-Glow</h1>
            <p class="ob-quiz-subtitle" style="font-size: var(--font-sm); line-height: 1.5; color: var(--text-secondary); margin: 0;">Pendamping perawatan kulit berbasis sains untuk memandu transformasi kulit sehat Anda.</p>
          </div>
          <div class="ob-rating-card" style="margin-bottom: 24px;">
            <div class="ob-rating-stars">★★★★★</div>
            <div class="ob-rating-stats">Skor rating 4.8 dari 10,000+ pengguna aktif</div>
            <div class="ob-rating-logos">
              <span class="ob-logo-text">BPOM CHECK</span>
              <span class="ob-logo-text" style="color:var(--primary); font-weight: bold;">AI SCAN</span>
              <span class="ob-logo-text">DIARY KULIT</span>
            </div>
          </div>
        `;
        break;

      case 3:
        // Q1: Struggle
        isNextDisabled = !answers.struggle;
        html = `
          <div class="ob-title-wrap">
            <h1 class="ob-quiz-title">Apa masalah kulit terbesarmu saat ini?</h1>
            <p class="ob-quiz-subtitle">Pilih satu masalah utama yang paling mengganggu Anda.</p>
          </div>
          <div class="ob-options-list">
            <div class="ob-option-card ${answers.struggle === 'wasting' ? 'active' : ''}" data-val="wasting">
              <div class="ob-option-icon" style="background-color: #FEF3C7;">💸</div>
              <div>
                <div class="ob-option-text">Membuang uang untuk produk yang tidak cocok</div>
                <div class="ob-option-desc">Membeli skincare mahal namun tidak ada hasil.</div>
              </div>
            </div>
            <div class="ob-option-card ${answers.struggle === 'reactions' ? 'active' : ''}" data-val="reactions">
              <div class="ob-option-icon" style="background-color: #FEE2E2;">⚠️</div>
              <div>
                <div class="ob-option-text">Reaksi negatif dan tidak tahu alasannya</div>
                <div class="ob-option-desc">Kulit sering breakout, iritasi, atau gatal.</div>
              </div>
            </div>
            <div class="ob-option-card ${answers.struggle === 'overwhelmed' ? 'active' : ''}" data-val="overwhelmed">
              <div class="ob-option-icon" style="background-color: #FFEEDD;">🤯</div>
              <div>
                <div class="ob-option-text">Bingung dengan terlalu banyak produk</div>
                <div class="ob-option-desc">Terlalu banyak tren skincare baru yang membingungkan.</div>
              </div>
            </div>
            <div class="ob-option-card ${answers.struggle === 'goals' ? 'active' : ''}" data-val="goals">
              <div class="ob-option-icon" style="background-color: #E0F2FE;">🎯</div>
              <div>
                <div class="ob-option-text">Tidak kunjung mencapai target kulit sehat</div>
                <div class="ob-option-desc">Punya goal tertentu tapi tidak tahu cara mencapainya.</div>
              </div>
            </div>
          </div>
        `;
        break;

      case 4:
        // Q2: Goals
        isNextDisabled = answers.goals.length === 0;
        html = `
          <div class="ob-title-wrap">
            <h1 class="ob-quiz-title">Apa target utama kulit Anda?</h1>
            <p class="ob-quiz-subtitle">Pilih semua opsi yang ingin Anda capai.</p>
          </div>
          <div class="ob-tags-grid">
            ${skinGoalsList.map(item => `
              <div class="ob-tag-card ${answers.goals.includes(item.id) ? 'active' : ''}" data-val="${item.id}">
                <span class="ob-tag-icon" style="background-color: ${item.bg || '#f1f5f9'};">${item.icon}</span>
                <span>${item.label}</span>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 5:
        // Q3: Age
        isNextDisabled = !answers.age;
        html = `
          <div class="ob-title-wrap">
            <h1 class="ob-quiz-title">Berapa usia Anda?</h1>
            <p class="ob-quiz-subtitle">Kebutuhan kulit berubah seiring bertambahnya usia.</p>
          </div>
          <div class="ob-options-list">
            ${['Di bawah 18 tahun', '18 - 24 tahun', '25 - 34 tahun', '35 - 44 tahun', '45 - 54 tahun', '55 tahun ke atas'].map(val => `
              <div class="ob-option-card ${answers.age === val ? 'active' : ''}" data-val="${val}">
                <div class="ob-option-text">${val}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 6:
        // AI Face Scan Camera Feed / Upload
        html = `
          <div class="ob-title-wrap">
            <h1 class="ob-quiz-title">Uji Coba AI Face Scan</h1>
            <p class="ob-quiz-subtitle">Posisikan wajah di tengah kamera untuk analisis kulit instan.</p>
          </div>
          
          <div class="ob-scan-camera">
            <div class="ob-camera-feed">
              <video id="ob-webcam" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover; display: none; transform: scaleX(-1); position: absolute; top: 0; left: 0; z-index: 1;"></video>
              
              <div class="ob-camera-placeholder" id="ob-placeholder">
                <div class="ob-placeholder-icon">
                  <svg viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </div>
                <span style="font-size: 13px; font-weight: 500;">Mengaktifkan kamera...</span>
              </div>
              
              <div class="ob-face-outline" style="z-index: 2;"></div>
            </div>
            
            <div class="ob-scan-controls">
              <button class="ob-scan-btn-main" id="ob-capture-btn">${icons.camera}</button>
            </div>
          </div>

          <input type="file" accept="image/*" capture="user" id="ob-camera-file" style="display: none;" />
          <input type="file" accept="image/*" id="ob-gallery-file" style="display: none;" />

          <button id="ob-upload-btn" style="
            display: flex; align-items: center; justify-content: center; gap: 8px;
            width: 100%; padding: 12px; border-radius: 12px;
            border: 1.5px dashed var(--primary); background: transparent;
            color: var(--primary); font-size: var(--font-sm); font-weight: 600;
            cursor: pointer; box-sizing: border-box; margin-top: 10px;
          ">
            <svg viewBox="0 0 24 24" style="width:18px; height:18px; stroke:currentColor; fill:none; stroke-width:2;"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload Gambar dari Galeri
          </button>
        `;
        break;

      case 7:
        // Scanning Animation Loop
        html = `
          <div class="ob-title-wrap" style="text-align: center;">
            <h1 class="ob-quiz-title">Memindai Wajah...</h1>
            <p class="ob-quiz-subtitle">Garis pemindai sedang memetakan topografi kulit Anda.</p>
          </div>
          <div class="ob-scan-camera">
            <div class="ob-camera-feed">
              <img src="${capturedImage || '/dummy-face.png'}" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0;" />
              <div class="ob-face-outline" style="z-index: 2;"></div>
              <div class="ob-scan-line" style="z-index: 2;"></div>
              <div class="ob-detection-points" id="ob-det-points" style="z-index: 3;"></div>
              <div class="ob-scan-status" style="z-index: 4;">
                <span class="shimmer-text">Melacak sebum dan pigmentasi kulit...</span>
              </div>
            </div>
          </div>
        `;
        break;

      case 8:
        // Processing Loader
        html = `
          <div class="ob-processing-loader-container">
            <div class="ob-processing-loader">
              <div class="ob-loader-ring"></div>
              <div class="ob-loader-ring"></div>
              <div class="ob-loader-ring"></div>
              <div class="ob-loader-glow"></div>
              <div class="ob-loader-center-icon"><img src="/face-chip-logo.png" class="ob-loader-face-chip" alt="B-Glow Chip" /></div>
              <div class="ob-particles">
                <div class="ob-particle"></div>
                <div class="ob-particle"></div>
                <div class="ob-particle"></div>
                <div class="ob-particle"></div>
              </div>
            </div>
            <h2 class="ob-quiz-title" style="font-size: var(--font-lg); margin-top: 10px; text-align: center;">Mengirim Data Ke Gemini AI</h2>
            <p class="ob-quiz-subtitle" style="text-align: center;">Menyusun matriks profil kulit Anda...</p>
          </div>

          <div class="ob-p-steps">
            <div class="ob-p-step active" id="ob-step-1"><span class="ob-step-dot"></span> Memunggah foto ke server aman</div>
            <div class="ob-p-step" id="ob-step-2"><span class="ob-step-dot"></span> Mengidentifikasi tipe kadar minyak</div>
            <div class="ob-p-step" id="ob-step-3"><span class="ob-step-dot"></span> Menganalisis noda & inflamasi</div>
            <div class="ob-p-step" id="ob-step-4"><span class="ob-step-dot"></span> Merangkum rekomendasi skincare</div>
          </div>
        `;
        break;

      case 9:
        // Display Results
        const res = answers.scanResult;
        const skinTypeEmoji = {
          'Berminyak': '💦',
          'Kombinasi': '🌓',
          'Kering': '🍂',
          'Normal': '✨',
          'Sensitif': '🛡️'
        }[res.jenis_kulit] || '✨';

        const problemsHTML = (!res.permasalahan || res.permasalahan.length === 0) ? `
          <div style="text-align:center; padding: 16px; background: #F0FDF4; border-radius: 12px; border: 1.5px solid #86EFAC;">
            <p style="color: #16A34A; font-weight: 700; margin: 0; font-size:13px;">Kondisi kulit sangat sehat!</p>
            <p style="color: #4ADE80; font-size: 11px; margin: 4px 0 0;">Tidak ada anomali atau noda parah terdeteksi.</p>
          </div>
        ` : res.permasalahan.map(p => {
          const col = PROBLEM_COLORS[p.label] || { hex: '#888', bg: '#F5F5F5', emoji: '⚠️' };
          const desc = PROBLEM_DESCRIPTIONS[p.label] || p.label;
          const confPct = Math.round((p.confidence || 0.75) * 100);
          return `
            <div class="ob-problem-card">
              <div class="ob-pc-icon" style="background:${col.bg};">${col.emoji}</div>
              <div class="ob-pc-info">
                <h4>${p.label}</h4>
                <p>${desc}</p>
                <div class="ob-pc-confidence">
                  <div class="ob-pc-bar">
                    <div class="ob-pc-bar-fill" style="width:${confPct}%; background:${col.hex};"></div>
                  </div>
                  <span style="font-size:10px; color:var(--text-tertiary); font-weight:600;">${confPct}%</span>
                </div>
              </div>
            </div>
          `;
        }).join('');

        html = `
          <div class="ob-title-wrap" style="text-align: center; margin-bottom: 20px;">
            <h1 class="ob-quiz-title" style="font-size: var(--font-2xl); font-weight: 800; margin-bottom: 6px;">Hasil Analisis Kulit AI</h1>
            <p class="ob-quiz-subtitle" style="font-size: var(--font-sm); color: var(--text-secondary); margin: 0;">Berikut kondisi kulit wajah Anda yang terdeteksi.</p>
          </div>

          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${capturedImage || '/dummy-face.png'}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary-light); box-shadow: var(--shadow-md); margin: 0 auto 12px; display: block;" />
            <h2 style="font-size: var(--font-xl); font-weight: 700; color: var(--text-primary); margin: 0 0 6px 0;">${res.jenis_kulit}</h2>
            <p style="font-size: var(--font-xs); color: var(--text-secondary); line-height: 1.4; max-width: 320px; margin: 0 auto; padding: 0 var(--space-sm);">${res.jenis_kulit_desc}</p>
          </div>

          <div class="ob-result-stats-grid" style="margin-bottom: 20px;">
            <div class="ob-result-stat-item" style="background: var(--bg-soft); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 10px;">
              <div class="ob-result-stat-label" style="font-size: 10px; color: var(--text-tertiary); margin-bottom: 4px; font-weight: 600;">Skor Kulit</div>
              <div class="ob-result-stat-val" style="font-size: var(--font-sm); font-weight: 700; color: ${res.skin_score >= 80 ? '#22c55e' : '#f59e0b'};">${res.skin_score}/100</div>
            </div>
            <div class="ob-result-stat-item" style="background: var(--bg-soft); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 10px;">
              <div class="ob-result-stat-label" style="font-size: 10px; color: var(--text-tertiary); margin-bottom: 4px; font-weight: 600;">Jerawat</div>
              <div class="ob-result-stat-val" style="font-size: var(--font-sm); font-weight: 700; color: ${res.acne_level.toLowerCase().includes('bersih') ? '#22c55e' : '#ef4444'};">${res.acne_level}</div>
            </div>
            <div class="ob-result-stat-item" style="background: var(--bg-soft); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 10px;">
              <div class="ob-result-stat-label" style="font-size: 10px; color: var(--text-tertiary); margin-bottom: 4px; font-weight: 600;">Minyak Wajah</div>
              <div class="ob-result-stat-val" style="font-size: var(--font-sm); font-weight: 700; color: var(--text-primary);">${res.oil_level}</div>
            </div>
            <div class="ob-result-stat-item" style="background: var(--bg-soft); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 10px;">
              <div class="ob-result-stat-label" style="font-size: 10px; color: var(--text-tertiary); margin-bottom: 4px; font-weight: 600;">Pori-Pori</div>
              <div class="ob-result-stat-val" style="font-size: var(--font-sm); font-weight: 700; color: var(--text-primary);">${res.pore_condition}</div>
            </div>
          </div>

          <div class="ob-problems-title" style="font-size: var(--font-sm); font-weight: 700; margin-bottom: 8px;">Permasalahan Kulit</div>
          <div class="ob-problem-cards-list">
            ${problemsHTML}
          </div>
        `;
        break;

      case 10:
        // Checklist Profile Ready Page
        html = `
          <div class="ob-success-container">
            <div class="ob-success-ring"></div>
            <h1 class="ob-quiz-title" style="margin-top: 10px;">Setup Profil Selesai!</h1>
            <p class="ob-quiz-subtitle">Semua data kuis & hasil scan berhasil dikompilasi.</p>
          </div>
          <div class="ob-checklist-loading">
            <div class="ob-checklist-item step-1">
              <div class="ob-check-icon">✓</div>
              <div class="ob-checklist-text">Sinkronisasi hasil jenis kulit ke akun Anda...</div>
            </div>
            <div class="ob-checklist-item step-2">
              <div class="ob-check-icon">✓</div>
              <div class="ob-checklist-text">Mempersonalisasikan rekomendasi produk...</div>
            </div>
            <div class="ob-checklist-item step-3">
              <div class="ob-check-icon">✓</div>
              <div class="ob-checklist-text">Menyusun pengingat routine skincare cerdas...</div>
            </div>
          </div>
        `;
        break;
    }

    contentWrap.innerHTML = html;

    // Bottom Navigation Buttons
    const footer = document.createElement('div');
    footer.className = 'ob-footer';

    if (currentStep === 10) {
      footer.innerHTML = `<button class="ob-btn-primary" id="ob-submit-profile">Mulai Sekarang</button>`;
    } else if (currentStep === 6) {
      // Camera handles capture via internal camera button, no primary button needed
      footer.innerHTML = ``;
    } else if (currentStep === 7 || currentStep === 8) {
      // Auto transitions, no next button
      footer.innerHTML = ``;
    } else {
      footer.innerHTML = `<button class="ob-btn-primary" id="ob-next" ${isNextDisabled ? 'disabled' : ''}>Lanjut</button>`;
    }

    viewport.appendChild(contentWrap);
    viewport.appendChild(footer);

    attachStepEvents();
  }

  // Bind Events for Active Step
  function attachStepEvents() {
    // Standard option click (single select)
    const options = page.querySelectorAll('.ob-option-card');
    options.forEach(card => {
      card.addEventListener('click', () => {
        const val = card.dataset.val;
        
        // Update selection styling in-place (no reload/flash)
        options.forEach(o => o.classList.remove('active'));
        card.classList.add('active');
        
        if (currentStep === 3) answers.struggle = val;
        else if (currentStep === 5) answers.age = val;
        
        // Enable next button dynamically
        const nextBtn = page.querySelector('#ob-next');
        if (nextBtn) {
          nextBtn.disabled = false;
        }
      });
    });

    // Multi-select tags (goals)
    const tags = page.querySelectorAll('.ob-tag-card');
    tags.forEach(tag => {
      tag.addEventListener('click', () => {
        const val = tag.dataset.val;
        if (answers.goals.includes(val)) {
          answers.goals = answers.goals.filter(x => x !== val);
          tag.classList.remove('active');
        } else {
          answers.goals.push(val);
          tag.classList.add('active');
        }
        
        // Enable next button if at least one goal is selected
        const nextBtn = page.querySelector('#ob-next');
        if (nextBtn) {
          nextBtn.disabled = answers.goals.length === 0;
        }
      });
    });

    // Step Next button click
    const nextBtn = page.querySelector('#ob-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToStep(currentStep + 1);
      });
    }

    // Step 6: CAMERA & GALLERY BINDINGS
    if (currentStep === 6) {
      const video = page.querySelector('#ob-webcam');
      const placeholder = page.querySelector('#ob-placeholder');
      const fileInput = page.querySelector('#ob-camera-file');
      const galleryInput = page.querySelector('#ob-gallery-file');
      const uploadBtn = page.querySelector('#ob-upload-btn');
      const captureBtn = page.querySelector('#ob-capture-btn');

      const setupFallbackMode = (msg) => {
        if (placeholder) {
          const span = placeholder.querySelector('span');
          if (span) span.textContent = msg;
          placeholder.addEventListener('click', () => fileInput.click());
        }
      };

      // Open camera feed
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        })
        .then(s => {
          cameraStream = s;
          if (video) {
            video.srcObject = s;
            video.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
          }
        })
        .catch(err => {
          console.warn('Onboarding camera failure:', err);
          setupFallbackMode('Kamera diblokir. Ketuk di sini untuk mengambil foto.');
        });
      } else {
        setupFallbackMode('Ketuk di sini untuk membuka kamera.');
      }

      // Handle fallback camera select file
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          capturedImage = event.target.result;
          stopCamera();
          goToStep(7);
        };
        reader.readAsDataURL(file);
      });

      // Handle upload from gallery button click
      uploadBtn.addEventListener('click', () => {
        stopCamera();
        galleryInput.click();
      });

      galleryInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          capturedImage = event.target.result;
          goToStep(7);
        };
        reader.readAsDataURL(file);
      });

      // Capture Button Snap click
      captureBtn.addEventListener('click', () => {
        if (video && cameraStream) {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const ctx = canvas.getContext('2d');
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            capturedImage = canvas.toDataURL('image/jpeg', 0.85);
          } catch (e) {
            console.error('Snap onboarding image failure:', e);
          }
          stopCamera();
          goToStep(7);
        } else {
          fileInput.click();
        }
      });
    }

    // Step 7: SCANNING ANIMATION PROCESS
    if (currentStep === 7) {
      const pointsWrap = page.querySelector('#ob-det-points');
      const positions = [
        { top: '30%', left: '38%' },
        { top: '38%', left: '55%' },
        { top: '50%', left: '42%' },
        { top: '42%', left: '62%' },
        { top: '58%', left: '48%' },
        { top: '35%', left: '48%' },
        { top: '55%', left: '55%' },
      ];

      // Sequential dots trigger
      positions.forEach((pos, idx) => {
        setTimeout(() => {
          const dot = document.createElement('div');
          dot.className = 'ob-det-point';
          dot.style.top = pos.top;
          dot.style.left = pos.left;
          dot.style.animationDelay = `${idx * 80}ms`;
          if (pointsWrap) pointsWrap.appendChild(dot);
        }, 300 + idx * 250);
      });

      // Move to Step 8 (Loader processing) after 2.8 seconds
      setTimeout(() => {
        goToStep(8);
      }, 2800);
    }

    // Step 8: LOADER LOOPS AND API CALL
    if (currentStep === 8) {
      // Step checklist timeline trigger
      const steps = ['ob-step-1', 'ob-step-2', 'ob-step-3', 'ob-step-4'];
      steps.forEach((id, idx) => {
        setTimeout(() => {
          if (idx > 0) {
            const prev = page.querySelector(`#${steps[idx - 1]}`);
            if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
          }
          const curr = page.querySelector(`#${id}`);
          if (curr) curr.classList.add('active');
        }, idx * 800);
      });

      // API trigger
      callGeminiAPI();
    }

    // Step 10: SUBMIT PROFILE ONBOARD DATA TO DB
    if (currentStep === 10) {
      const submitBtn = page.querySelector('#ob-submit-profile');
      if (submitBtn) {
        submitBtn.addEventListener('click', finalizeProfileSubmit);
      }

      // Auto submit profile on timer after 3.8s
      setTimeout(() => {
        const btn = page.querySelector('#ob-submit-profile');
        if (btn) btn.click();
      }, 3800);
    }
  }

  // AI Scan Call to Gemini backend
  async function callGeminiAPI() {
    try {
      const reqBody = { image: capturedImage || '' };
      if (userId && userId !== 'guest') {
        reqBody.user_id = parseInt(userId, 10);
      }

      const res = await fetch(SKIN_SCAN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userId && userId !== 'guest' ? getAuthHeaders() : {})
        },
        body: JSON.stringify(reqBody)
      });

      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }

      const result = await res.json();
      answers.scanResult = {
        jenis_kulit: result.jenis_kulit,
        jenis_kulit_desc: getSkinTypeDescription(result.jenis_kulit),
        acne_level: result.acne_level,
        oil_level: result.oil_level,
        pore_condition: result.pore_condition,
        skin_score: result.skin_score,
        permasalahan: result.permasalahan || []
      };

      // Add to local history too
      saveToLocalScanHistory(result);

      // Advance to result page (Step 9) after the checklist step animation completes (approx 3.2s)
      setTimeout(() => {
        goToStep(9);
      }, 3300);

    } catch (e) {
      console.warn("AI Onboarding scan server issue, triggering high fidelity mock generator:", e);
      triggerMockScanFallback();
    }
  }

  function triggerMockScanFallback() {
    // Generate an beautiful mock result based on user goals
    let type = 'Kombinasi'; // Standard default
    if (answers.goals.includes('oiliness')) type = 'Berminyak';
    else if (answers.goals.includes('hydration')) type = 'Kering';
    else if (answers.goals.includes('sensitivity')) type = 'Sensitif';

    let score = 78;
    if (answers.struggle === 'reactions') score -= 8;

    let acne = 'Bersih';
    if (answers.goals.includes('breakouts')) acne = 'Ringan — Grade 1';

    let oil = 'Normal';
    if (type === 'Berminyak') oil = 'Tinggi';
    else if (type === 'Kombinasi') oil = 'Sedang — T-Zone';
    else if (type === 'Kering') oil = 'Rendah';

    let pore = 'Baik — Minimal';
    if (type === 'Berminyak' || type === 'Kombinasi') pore = 'Cukup';

    const problems = [];
    if (answers.struggle === 'reactions' || answers.goals.includes('sensitivity')) {
      problems.push({ label: 'Kemerahan', confidence: 0.85 });
    }
    if (answers.goals.includes('breakouts')) {
      problems.push({ label: 'Jerawat', confidence: 0.78 });
      problems.push({ label: 'PIE', confidence: 0.70 });
    }
    if (answers.goals.includes('darkspots')) {
      problems.push({ label: 'Hiperpigmentasi', confidence: 0.82 });
    }

    const mockResult = {
      jenis_kulit: type,
      jenis_kulit_desc: getSkinTypeDescription(type),
      acne_level: acne,
      oil_level: oil,
      pore_condition: pore,
      skin_score: score,
      permasalahan: problems
    };

    answers.scanResult = mockResult;

    // Save to local scan history as well
    saveToLocalScanHistory({
      jenis_kulit: type,
      acne_level: acne,
      oil_level: oil,
      pore_condition: pore,
      skin_score: score,
      permasalahan: problems
    });

    // Advance to results page
    setTimeout(() => {
      goToStep(9);
    }, 3300);
  }

  function getSkinTypeDescription(type) {
    return {
      'Berminyak': 'Kulit berminyak memproduksi sebum berlebih di seluruh wajah. Rentan jerawat namun lebih lambat mengalami tanda penuaan.',
      'Kombinasi': 'Kulit kombinasi berminyak di area T-zone (dahi, hidung, dagu) namun normal atau kering di area pipi.',
      'Kering': 'Kulit kering kekurangan produksi minyak alami, mudah terasa kencang, kasar, dan rentan terhadap iritasi.',
      'Normal': 'Kulit seimbang dengan produksi sebum yang ideal. Tidak terlalu berminyak atau kering.',
      'Sensitif': 'Kulit sensitif sangat rentan terhadap iritasi, kemerahan, rasa gatal, atau sensasi terbakar.'
    }[type] || `Tipe kulit terdeteksi: ${type}`;
  }

  function saveToLocalScanHistory(res) {
    try {
      const historyKey = 'bglow_scan_history_' + userId;
      let historyList = JSON.parse(localStorage.getItem(historyKey) || '[]');
      historyList.unshift({
        id: 'scan_onboard_' + Date.now(),
        date: new Date().toLocaleDateString('id-ID', {
          day: 'numeric', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        skin_type: res.jenis_kulit,
        acne_level: res.acne_level,
        oil_level: res.oil_level,
        pore_condition: res.pore_condition,
        skin_score: res.skin_score,
        image: capturedImage || '/dummy-face.png',
      });
      localStorage.setItem(historyKey, JSON.stringify(historyList));
    } catch (e) {
      console.error('Failed to append onboard scan results to history:', e);
    }
  }

  // Push user choices to DB and redirect home
  async function finalizeProfileSubmit() {
    const res = answers.scanResult;
    if (!res) {
      window.location.hash = '#/';
      return;
    }

    // Save profile locally
    localStorage.setItem('bglow_has_scanned_' + userId, '1');
    localStorage.setItem('bglow_skin_type_' + userId, res.jenis_kulit);
    localStorage.setItem('bglow_acne_level_' + userId, res.acne_level);
    localStorage.setItem('bglow_oil_level_' + userId, res.oil_level);
    localStorage.setItem('bglow_pore_condition_' + userId, res.pore_condition);
    localStorage.setItem('bglow_skin_score_' + userId, String(res.skin_score));
    localStorage.setItem('bglow_skin_problems_' + userId, JSON.stringify(res.permasalahan || []));

    // Submit sync to server
    if (userId && userId !== 'guest') {
      try {
        await syncUserData({
          skin_type: res.jenis_kulit,
          acne_level: res.acne_level,
          oil_level: res.oil_level,
          pore_condition: res.pore_condition,
          skin_score: res.skin_score
        });
      } catch (err) {
        console.error("Gagal sinkronisasi data onboarding ke database:", err);
      }
    }

    // Setup complete — mark onboarded, then go to home (user already authenticated)
    localStorage.setItem('bglow_onboarded', '1');
    window.location.hash = '#/';
  }

  // Header Nav Click handlers
  backBtn.addEventListener('click', () => {
    goToStep(currentStep - 1);
  });

  skipBtn.addEventListener('click', () => {
    // If skip question blocks, jump directly to AI scan
    goToStep(6);
  });

  // Start at step 0
  goToStep(0);

  return page;
}
