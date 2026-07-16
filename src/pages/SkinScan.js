import { icons } from '../components/BottomNav.js';
import { getUserId, getAuthHeaders } from '../utils/store.js';
import { API_BASE_URL, SKIN_SCAN_API_URL } from '../config.js';

// ─── SVG Icons for Skin Types ────────────────────────────────────────────────
const skinTypeIcons = {
  'Normal':    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: rgba(245, 158, 11, 0.12);"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  'Berminyak': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: rgba(59, 130, 246, 0.12);"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"/></svg>`,
  'Kombinasi': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: rgba(139, 92, 246, 0.12);"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 2v20"/></svg>`,
  'Kering':    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: rgba(16, 185, 129, 0.12);"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z"/><path d="M9 22v-4h4"/></svg>`,
  'Sensitif':  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill: rgba(239, 68, 68, 0.12);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
};

// ─── SVG Icons for Skin Problems ─────────────────────────────────────────────
const PROBLEM_ICONS = {
  'Jerawat':         `<svg class="problem-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; display:inline-block; vertical-align:middle;"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2.5"/><circle cx="7" cy="8" r="1"/><circle cx="16" cy="16" r="1"/></svg>`,
  'PIE':             `<svg class="problem-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; display:inline-block; vertical-align:middle;"><circle cx="8" cy="8" r="2.5"/><circle cx="16" cy="10" r="2"/><circle cx="11" cy="16" r="1.5"/></svg>`,
  'PIH':             `<svg class="problem-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; display:inline-block; vertical-align:middle;"><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9z"/><path d="M8 12h.01M12 8h.01M16 12h.01M12 16h.01"/></svg>`,
  'Bopeng':          `<svg class="problem-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; display:inline-block; vertical-align:middle;"><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9z"/><path d="M12 8c-2 0-3 1-3 3s1 3 3 3 3-1 3-3-1-3-3-3z"/></svg>`,
  'Hiperpigmentasi': `<svg class="problem-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; display:inline-block; vertical-align:middle;"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M5.64 18.36l-1.42 1.42M19.78 4.22l-1.42 1.42"/></svg>`,
  'Kemerahan':       `<svg class="problem-svg-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; display:inline-block; vertical-align:middle;"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`,
};

// ─── Palet warna per kategori permasalahan ───────────────────────────────────
const PROBLEM_COLORS = {
  'Jerawat':         { hex: '#FF3B3B', bg: '#FFF0F0' },
  'PIE':             { hex: '#3B7FFF', bg: '#EFF4FF' },
  'PIH':             { hex: '#FF8C00', bg: '#FFF5E6' },
  'Bopeng':          { hex: '#CC00CC', bg: '#F9EEFF' },
  'Hiperpigmentasi': { hex: '#CCCC00', bg: '#FEFEE6' },
  'Kemerahan':       { hex: '#00CC44', bg: '#EDFFF3' },
};

const PROBLEM_DESCRIPTIONS = {
  'Jerawat':         'Peradangan folikel rambut akibat sumbatan sebum dan bakteri.',
  'PIE':             'Post-Inflammatory Erythema — kemerahan sisa bekas jerawat.',
  'PIH':             'Post-Inflammatory Hyperpigmentation — bercak gelap bekas jerawat.',
  'Bopeng':          'Jaringan parut cekung akibat kerusakan kolagen dari jerawat parah.',
  'Hiperpigmentasi': 'Penggelapan kulit akibat produksi melanin berlebih.',
  'Kemerahan':       'Iritasi atau rosacea menyebabkan kulit tampak merah.',
};

// ─── Urutan prioritas medis ───────────────────────────────────────────────────
const MEDICAL_PRIORITY_ORDER = ['Jerawat', 'Kemerahan', 'PIE', 'PIH', 'Hiperpigmentasi', 'Bopeng'];

const JOURNEY_INFO = {
  'Jerawat': {
    tagline: 'Atasi akar masalahnya dulu',
    why: 'Jerawat aktif adalah sumber utama dari PIE, PIH, dan bopeng. Selama jerawat masih muncul, perawatan bekas luka tidak akan efektif. Prioritas utama adalah menghentikan siklus peradangan.',
    ingredients: ['Salicylic Acid', 'Niacinamide', 'Benzoyl Peroxide', 'Tea Tree Oil'],
    duration: '4–8 minggu',
    done_when: 'Tidak ada jerawat aktif selama ≥ 2 minggu berturut-turut',
  },
  'Kemerahan': {
    tagline: 'Tenangkan peradangan kulit',
    why: 'Kemerahan berlebih menandakan kulit dalam kondisi inflamasi. Mengatasinya lebih awal mencegah memburuknya kondisi dan membuat kulit lebih siap menerima perawatan selanjutnya.',
    ingredients: ['Centella Asiatica', 'Azelaic Acid', 'Green Tea Extract', 'Aloe Vera'],
    duration: '6–10 minggu',
    done_when: 'Kemerahan berkurang signifikan dan kulit terasa lebih tenang',
  },
  'PIE': {
    tagline: 'Pudarkan kemerahan bekas jerawat',
    why: 'PIE adalah kemerahan sisa peradangan jerawat yang sudah sembuh. Setelah jerawat aktif terkontrol, kapiler kulit yang membesar bisa dipulihkan dengan bahan anti-inflamasi dan penenang.',
    ingredients: ['Azelaic Acid', 'Centella Asiatica', 'Niacinamide', 'Tranexamic Acid'],
    duration: '8–12 minggu',
    done_when: 'Kemerahan bekas jerawat memudar dan warna kulit lebih merata',
  },
  'PIH': {
    tagline: 'Cerahkan flek hitam bekas jerawat',
    why: 'Flek hitam (PIH) paling efektif diobati setelah peradangan reda. Produk pencerah bekerja optimal di kulit yang sudah stabil dan bebas dari jerawat aktif.',
    ingredients: ['Alpha Arbutin', 'Vitamin C', 'Kojic Acid', 'AHA (Glycolic/Lactic Acid)'],
    duration: '12–24 minggu',
    done_when: 'Flek hitam memudar dan warna kulit lebih merata',
  },
  'Hiperpigmentasi': {
    tagline: 'Ratakan warna kulit secara menyeluruh',
    why: 'Hiperpigmentasi umum perlu ditangani setelah kondisi jerawat stabil agar produk pencerah dapat bekerja optimal tanpa terganggu peradangan aktif.',
    ingredients: ['Vitamin C', 'Kojic Acid', 'Licorice Root Extract', 'Retinol'],
    duration: '12–20 minggu',
    done_when: 'Warna kulit lebih merata dan bercak gelap berkurang',
  },
  'Bopeng': {
    tagline: 'Pulihkan tekstur kulit',
    why: 'Bopeng adalah kerusakan struktural yang hanya dapat diatasi setelah kulit benar-benar bersih dari jerawat dan inflamasi. Ini adalah tahap akhir perjalanan perawatan kulit.',
    ingredients: ['Retinol', 'Peptide', 'Bakuchiol', 'Konsultasi dokter untuk prosedur'],
    duration: '6–12 bulan',
    done_when: 'Tekstur kulit membaik dan bekas luka cekung berkurang',
  },
};

export function renderSkinScan() {
  const page = document.createElement('div');
  page.className = 'page';
  let stream = null;
  const userId = getUserId();
  let capturedImage = localStorage.getItem('bglow_captured_image_' + userId) || null;

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
  }

  // Auto-cleanup camera on page navigation/hash change
  const handleHashChange = () => {
    stopCamera();
    window.removeEventListener('hashchange', handleHashChange);
  };
  window.addEventListener('hashchange', handleHashChange);

  // ─── CAMERA PHASE ─────────────────────────────────────────────────────────
  function renderCamera() {
    capturedImage = null;
    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Scan Kulit AI</h1>
      </div>
      <div class="scan-camera">
        <div class="camera-feed">
          <video id="webcam" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover; display: none; transform: scaleX(-1); position: absolute; top: 0; left: 0; z-index: 1;"></video>

          <div class="camera-placeholder" id="camera-placeholder" style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1; color: rgba(255,255,255,0.6); gap: 16px; cursor: pointer; text-align: center; padding: 20px;">
            <div class="placeholder-icon" style="width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; animation: pulseGlow 2s ease-in-out infinite;">
              <svg viewBox="0 0 24 24" style="width: 32px; height: 32px; stroke: currentColor; fill: none; stroke-width: 2;"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <span style="font-size: var(--font-sm); font-weight: 500;">Mengaktifkan kamera...</span>
          </div>

          <div class="face-outline" style="z-index: 2;"></div>
          <div class="scan-line" style="z-index: 2;"></div>
          <div class="detection-points" id="det-points" style="z-index: 3;"></div>
          <div class="scan-status" style="z-index: 4;">
            <span class="shimmer-text">Menganalisis kondisi kulit Anda...</span>
          </div>
        </div>
        <div class="scan-controls" style="z-index: 5;">
          <button class="scan-btn-main" id="start-scan">${icons.camera}</button>
        </div>
      </div>

      <!-- Input camera (fallback) -->
      <input type="file" accept="image/*" capture="user" id="camera-file-input" style="display: none;" />
      <!-- Input upload galeri -->
      <input type="file" accept="image/*" id="gallery-file-input" style="display: none;" />

      <div class="page-content" style="text-align:center; padding-top:20px;">
        <p style="color:var(--text-tertiary); font-size:var(--font-sm); margin-bottom: 16px;">
          Posisikan wajah Anda dalam garis batas lalu ketuk tombol scan
        </p>

        <!-- Divider -->
        <div style="display: flex; align-items: center; gap: 12px; padding: 0 24px; margin-bottom: 14px;">
          <div style="flex:1; height:1px; background: var(--border, rgba(255,255,255,0.12));"></div>
          <span style="color: var(--text-tertiary); font-size: var(--font-xs); white-space: nowrap;">atau</span>
          <div style="flex:1; height:1px; background: var(--border, rgba(255,255,255,0.12));"></div>
        </div>

        <!-- Tombol Upload Gambar -->
        <button id="upload-img-btn" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: calc(100% - 48px);
          margin: 0 auto;
          padding: 13px 20px;
          border-radius: 14px;
          border: 1.5px dashed var(--primary, #A78BFA);
          background: transparent;
          color: var(--primary, #A78BFA);
          font-size: var(--font-sm);
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        ">
          <svg viewBox="0 0 24 24" style="width:20px;height:20px;stroke:currentColor;fill:none;stroke-width:2;flex-shrink:0;">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload Gambar dari Galeri
        </button>
      </div>
    `;

    const video = page.querySelector('#webcam');
    const placeholder = page.querySelector('#camera-placeholder');
    const placeholderText = placeholder.querySelector('span');
    const fileInput = page.querySelector('#camera-file-input');

    const setupFallbackMode = (message) => {
      if (placeholderText) placeholderText.textContent = message;
      placeholder.addEventListener('click', () => fileInput.click());
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      })
      .then(s => {
        stream = s;
        if (video) {
          video.srcObject = s;
          video.style.display = 'block';
          if (placeholder) placeholder.style.display = 'none';
        }
      })
      .catch(err => {
        console.warn('Gagal mengakses kamera:', err);
        setupFallbackMode('Kamera terblokir. Ketuk di sini untuk mengambil foto.');
      });
    } else {
      setupFallbackMode('Ketuk di sini untuk membuka kamera.');
    }

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        capturedImage = event.target.result;
        localStorage.setItem('bglow_captured_image_' + userId, capturedImage);
        let imgPreview = page.querySelector('#captured-preview');
        if (!imgPreview) {
          imgPreview = document.createElement('img');
          imgPreview.id = 'captured-preview';
          imgPreview.style.cssText = 'width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; z-index: 1;';
          page.querySelector('.camera-feed').appendChild(imgPreview);
        }
        imgPreview.src = capturedImage;
        if (video) video.style.display = 'none';
        if (placeholder) placeholder.style.display = 'none';
        startScanning();
      };
      reader.readAsDataURL(file);
    });

    // ── Handler tombol Upload Galeri ──────────────────────────────────────────
    const galleryInput = page.querySelector('#gallery-file-input');
    const uploadBtn = page.querySelector('#upload-img-btn');

    uploadBtn.addEventListener('mouseenter', () => {
      uploadBtn.style.background = 'rgba(167,139,250,0.08)';
      uploadBtn.style.transform = 'scale(1.01)';
    });
    uploadBtn.addEventListener('mouseleave', () => {
      uploadBtn.style.background = 'transparent';
      uploadBtn.style.transform = 'scale(1)';
    });

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
        localStorage.setItem('bglow_captured_image_' + userId, capturedImage);
        // Tampilkan preview di camera feed
        let imgPreview = page.querySelector('#captured-preview');
        if (!imgPreview) {
          imgPreview = document.createElement('img');
          imgPreview.id = 'captured-preview';
          imgPreview.style.cssText = 'width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; z-index: 1;';
          page.querySelector('.camera-feed').appendChild(imgPreview);
        }
        imgPreview.src = capturedImage;
        if (video) video.style.display = 'none';
        if (placeholder) placeholder.style.display = 'none';
        startScanning();
      };
      reader.readAsDataURL(file);
    });

    page.querySelector('#back-btn').addEventListener('click', () => {
      stopCamera();
      window.location.hash = '#/';
    });

    page.querySelector('#start-scan').addEventListener('click', () => {
      if (video && stream) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          capturedImage = canvas.toDataURL('image/jpeg', 0.85);
          localStorage.setItem('bglow_captured_image_' + userId, capturedImage);
        } catch (err) {
          console.error('Gagal menangkap gambar:', err);
        }
        startScanning();
      } else {
        fileInput.click();
      }
    });
  }

  // ─── SCANNING ANIMATION + API CALL ────────────────────────────────────────
  function startScanning() {
    const pointsContainer = page.querySelector('#det-points');
    const positions = [
      { top: '30%', left: '38%' },
      { top: '38%', left: '55%' },
      { top: '50%', left: '42%' },
      { top: '42%', left: '62%' },
      { top: '58%', left: '48%' },
      { top: '35%', left: '48%' },
      { top: '55%', left: '55%' },
    ];

    positions.forEach((pos, i) => {
      setTimeout(() => {
        const dot = document.createElement('div');
        dot.className = 'det-point';
        dot.style.top = pos.top;
        dot.style.left = pos.left;
        dot.style.animationDelay = `${i * 100}ms`;
        if (pointsContainer) pointsContainer.appendChild(dot);
      }, 400 + i * 300);
    });

    // Stop camera and go to processing screen after animation
    setTimeout(() => {
      stopCamera();
      renderProcessing();
    }, 2800);
  }

  // ─── PROCESSING PHASE ─────────────────────────────────────────────────────
  function renderProcessing() {
    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Menganalisis</h1>
      </div>
      <div class="scan-processing anim-fade-in">
        <div class="processing-loader">
          <div class="loader-ring"></div>
          <div class="loader-ring"></div>
          <div class="loader-ring"></div>
          <div class="loader-glow"></div>
          <div class="loader-center-icon"><img src="/face-chip-logo.png" class="loader-face-chip" alt="Face Chip Logo" /></div>
          <div class="particles">
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
          </div>
        </div>
        <div class="processing-text">
          <h3>AI B-Glow sedang menganalisis kulit Anda...</h3>
          <p>Mohon tunggu sebentar</p>
        </div>
        <div class="processing-steps">
          <div class="p-step active" id="step-1"><span class="step-dot"></span> Mengirim gambar ke AI B-Glow</div>
          <div class="p-step" id="step-2"><span class="step-dot"></span> Mengidentifikasi jenis kulit</div>
          <div class="p-step" id="step-3"><span class="step-dot"></span> Mendeteksi permasalahan kulit</div>
          <div class="p-step" id="step-4"><span class="step-dot"></span> Menyiapkan hasil analisis</div>
        </div>
      </div>
    `;

    page.querySelector('#back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });

    // Animate steps
    const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
    steps.forEach((id, i) => {
      setTimeout(() => {
        if (i > 0) {
          const prev = page.querySelector(`#${steps[i - 1]}`);
          if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
        }
        const el = page.querySelector(`#${id}`);
        if (el) el.classList.add('active');
      }, i * 900);
    });

    // Call Gemini AI API
    callGeminiAPI();
  }

  // ─── GEMINI API CALL ──────────────────────────────────────────────────────
  async function callGeminiAPI() {
    try {
      const reqBody = { image: capturedImage };
      if (userId && userId !== 'guest') {
        reqBody.user_id = parseInt(userId, 10);
      }

      const response = await fetch(SKIN_SCAN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(userId && userId !== 'guest' ? getAuthHeaders() : {}),
        },
        body: JSON.stringify(reqBody),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || `HTTP ${response.status}`);
      }

      const result = await response.json();

      // Save results to localStorage
      localStorage.setItem('bglow_has_scanned_' + userId, '1');
      localStorage.setItem('bglow_skin_type_' + userId, result.jenis_kulit);
      localStorage.setItem('bglow_acne_level_' + userId, result.acne_level);
      localStorage.setItem('bglow_oil_level_' + userId, result.oil_level);
      localStorage.setItem('bglow_pore_condition_' + userId, result.pore_condition);
      localStorage.setItem('bglow_skin_score_' + userId, String(result.skin_score));
      localStorage.setItem('bglow_skin_problems_' + userId, JSON.stringify(result.permasalahan || []));

      // Append to scan history
      try {
        const historyKey = 'bglow_scan_history_' + userId;
        let historyList = JSON.parse(localStorage.getItem(historyKey) || '[]');
        historyList.unshift({
          id: 'scan_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          date: new Date().toLocaleDateString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }),
          skin_type: result.jenis_kulit,
          acne_level: result.acne_level,
          oil_level: result.oil_level,
          pore_condition: result.pore_condition,
          skin_score: result.skin_score,
          image: capturedImage,
        });
        localStorage.setItem(historyKey, JSON.stringify(historyList));
      } catch (e) {
        console.error('Gagal menyimpan ke riwayat scan:', e);
      }

      renderResults(result);

    } catch (err) {
      console.error('Gagal analisis Gemini AI:', err);
      renderError(err.message || 'Terjadi kesalahan saat menghubungi server.');
    }
  }

  // ─── ERROR PHASE ──────────────────────────────────────────────────────────
  function renderError(message) {
    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Gagal Menganalisis</h1>
      </div>
      <div class="scan-processing anim-fade-in" style="gap: 20px;">
        <div style="font-size: 64px; text-align:center;">❌</div>
        <div class="processing-text">
          <h3 style="color: var(--danger, #EF4444);">Analisis Gagal</h3>
          <p style="color: var(--text-secondary); font-size: var(--font-sm); padding: 0 16px; text-align:center;">${message}</p>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px; padding: 0 24px; width:100%;">
          <button class="btn btn-primary btn-lg" id="retry-btn">🔄 Coba Lagi</button>
          <button class="scan-again-btn" id="back-home-btn">Kembali ke Beranda</button>
        </div>
      </div>
    `;
    page.querySelector('#back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });
    page.querySelector('#retry-btn').addEventListener('click', () => {
      renderCamera();
    });
    page.querySelector('#back-home-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });
  }

  // ─── RESULTS PHASE ────────────────────────────────────────────────────────
  function renderResults(result) {
    const { jenis_kulit, permasalahan, skin_score, acne_level, oil_level, pore_condition } = result;

    // Inject styles for button and modal
    if (!document.getElementById('adjust-modal-styles')) {
      const style = document.createElement('style');
      style.id = 'adjust-modal-styles';
      style.textContent = `
        .adjust-profile-btn {
          width: 100%;
          box-sizing: border-box;
          padding: 12px 16px;
          border: 1.5px solid var(--primary, #3B82F6);
          background: #ffffff;
          color: var(--primary, #3B82F6);
          font-size: 13px;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .adjust-profile-btn:hover {
          background: #EFF6FF !important;
          border-color: #2563EB;
          color: #2563EB;
        }
        .adjust-profile-btn:active {
          transform: scale(0.98);
        }
        .adjust-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .adjust-modal-container {
          background: #ffffff;
          width: 100%;
          max-width: 430px;
          border-top-left-radius: 24px;
          border-top-right-radius: 24px;
          padding: 24px;
          box-sizing: border-box;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 90vh;
          overflow-y: auto;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .adjust-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 8px;
          text-align: center;
        }
        .adjust-subtitle {
          font-size: var(--font-xs);
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 24px;
        }
        .adjust-section {
          margin-bottom: 20px;
          text-align: left;
        }
        .adjust-section-title {
          font-size: var(--font-sm);
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }
        .adjust-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .adjust-pill {
          padding: 10px 14px;
          background: #f8fafc;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-full);
          font-size: var(--font-sm);
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          user-select: none;
        }
        .adjust-pill:hover {
          border-color: var(--primary);
          background: var(--bg-overlay);
          color: var(--primary-dark);
        }
        .adjust-pill.active {
          border-color: var(--primary) !important;
          background: var(--bg-overlay) !important;
          color: var(--primary-dark) !important;
          box-shadow: 0 0 0 1px var(--primary-light);
        }
        .adjust-pill svg {
          width: 18px;
          height: 18px;
        }
        .adjust-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }
        .adjust-btn-save {
          flex: 1;
          padding: 14px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          font-size: var(--font-sm);
        }
        .adjust-btn-cancel {
          flex: 1;
          padding: 14px;
          background: #f1f5f9;
          color: var(--text-secondary);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          font-size: var(--font-sm);
        }
        /* Custom colors for pill SVGs inside Modal */
        .adjust-pill[data-skin-type="Normal"] svg { stroke: #F59E0B; fill: rgba(245, 158, 11, 0.12); }
        .adjust-pill[data-skin-type="Berminyak"] svg { stroke: #3B82F6; fill: rgba(59, 130, 246, 0.12); }
        .adjust-pill[data-skin-type="Kombinasi"] svg { stroke: #8B5CF6; fill: rgba(139, 92, 246, 0.12); }
        .adjust-pill[data-skin-type="Kering"] svg { stroke: #10B981; fill: rgba(16, 185, 129, 0.12); }
        .adjust-pill[data-skin-type="Sensitif"] svg { stroke: #EF4444; fill: rgba(239, 68, 68, 0.12); }

        .adjust-pill[data-problem="Jerawat"] svg { stroke: #EF4444; fill: rgba(239, 68, 68, 0.12); }
        .adjust-pill[data-problem="PIE"] svg { stroke: #EC4899; fill: rgba(236, 72, 153, 0.12); }
        .adjust-pill[data-problem="PIH"] svg { stroke: #F97316; fill: rgba(249, 115, 22, 0.12); }
        .adjust-pill[data-problem="Bopeng"] svg { stroke: #8B5CF6; fill: rgba(139, 92, 246, 0.12); }
        .adjust-pill[data-problem="Hiperpigmentasi"] svg { stroke: #9CA3AF; fill: rgba(156, 163, 175, 0.12); }
        .adjust-pill[data-problem="Kemerahan"] svg { stroke: #EF4444; fill: rgba(239, 68, 68, 0.12); }
      `;
      document.head.appendChild(style);
    }

    const skinTypeDesc = {
      'Berminyak': 'Kulit berminyak memproduksi sebum berlebih di seluruh wajah. Rentan jerawat namun lebih lambat mengalami tanda penuaan.',
      'Kombinasi': 'Kulit kombinasi berminyak di area T-zone (dahi, hidung, dagu) namun normal atau kering di area pipi.',
      'Kering': 'Kulit kering kekurangan produksi minyak alami, mudah terasa kencang, kasar, dan rentan terhadap iritasi.',
      'Normal': 'Kulit seimbang dengan produksi sebum yang ideal. Tidak terlalu berminyak atau kering.',
      'Sensitif': 'Kulit sensitif sangat rentan terhadap iritasi, kemerahan, rasa gatal, atau sensasi terbakar.'
    }[jenis_kulit] || `Jenis kulit terdeteksi: ${jenis_kulit}.`;

    // Build sorted skin journey steps based on medical priority
    const detectedLabels = (permasalahan || []).map(p => p.label || p);
    const journeySteps = MEDICAL_PRIORITY_ORDER
      .filter(label => detectedLabels.includes(label))
      .map((label, idx) => ({ label, stepNum: idx + 1, info: JOURNEY_INFO[label] || null, col: PROBLEM_COLORS[label] || { hex: '#888', bg: '#F5F5F5' } }));

    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Hasil Scan AI</h1>
      </div>
      <div class="scan-results anim-fade-in">

        <!-- Deteksi per-masalah: carousel slider -->
        ${permasalahan && permasalahan.length > 0 ? `
        <div class="detection-section">
          <div class="std-header" style="margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
            <span class="std-label">Deteksi Area Kulit</span>
            <span class="detection-count-badge">${permasalahan.length} area</span>
          </div>
          <div class="detection-slider-wrapper">
            <div class="detection-slider" id="detection-slider">
              ${permasalahan.map((p, idx) => {
                const col = PROBLEM_COLORS[p.label] || { hex: '#888', bg: '#F5F5F5' };
                return `
                <div class="detection-slide" data-idx="${idx}">
                  <div class="detection-slide-img-wrap">
                    <canvas class="detection-bbox-canvas" data-idx="${idx}" style="display: block; width: 100%; border-radius: 14px;"></canvas>
                    <div class="detection-slide-badge" style="background: ${col.hex}; display: inline-flex; align-items: center; gap: 4px; color: #fff; padding: 4px 8px; font-size: 11px; font-weight: 700; border-radius: 20px;">
                      ${PROBLEM_ICONS[p.label] || ''}
                      <span>${p.label}</span>
                    </div>
                  </div>
                  <div class="detection-slide-footer" style="border-top: 2px solid ${col.hex}20;">
                    <div class="dsf-label" style="color: ${col.hex}; display: inline-flex; align-items: center; gap: 6px; font-weight: 700;">
                      ${PROBLEM_ICONS[p.label] || ''}
                      <span>${p.label}</span>
                    </div>
                    <div class="dsf-desc">${PROBLEM_DESCRIPTIONS[p.label] || p.label}</div>
                  </div>
                </div>`;
              }).join('')}
            </div>
            ${permasalahan.length > 1 ? `
            <div class="detection-slider-dots" id="slider-dots">
              ${permasalahan.map((p, idx) => {
                const col = PROBLEM_COLORS[p.label] || { hex: '#888' };
                return `<div class="slider-dot ${idx === 0 ? 'active' : ''}" data-idx="${idx}" style="--dot-color: ${col.hex};"></div>`;
              }).join('')}
            </div>` : ''}
          </div>
        </div>
        ` : `
        <div class="result-face-card" style="position: relative; overflow: hidden;">
          <div id="face-img-container" style="position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 16px; background: #111;">
            ${capturedImage ? `<img id="result-face-img" src="${capturedImage}" style="width: 100%; height: 100%; object-fit: cover; display: block;" alt="Foto wajah" />` : ''}
          </div>
        </div>
        `}

        <!-- Jenis Kulit -->
        <div class="skin-type-detail anim-fade-in-up anim-delay-1" style="margin-top: 16px;">
          <div class="std-header" style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary, #3B82F6)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            <span class="std-label">Jenis Kulit Terdeteksi</span>
          </div>
          <div class="std-card">
            <div class="std-icon" style="background: ${jenis_kulit === 'Normal' ? '#FEF3C7' : jenis_kulit === 'Berminyak' ? '#EFF6FF' : jenis_kulit === 'Kombinasi' ? '#F3E8FF' : jenis_kulit === 'Kering' ? '#D1FAE5' : '#FEE2E2'}; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: var(--radius-md); flex-shrink: 0;">
              ${skinTypeIcons[jenis_kulit] || skinTypeIcons['Normal']}
            </div>
            <div class="std-info">
              <h3>Kulit ${jenis_kulit}</h3>
              <p>${skinTypeDesc}</p>
            </div>
          </div>

          <!-- Disclaimer AI Accuracy -->
          <div class="scan-info-disclaimer" style="margin-top: 12px; padding: 12px; background: #FFFDF5; border: 1.5px solid #FEF3C7; border-radius: var(--radius-lg); display: flex; gap: 10px; align-items: flex-start; text-align: left;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; margin-top: 1px;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div>
              <div style="font-weight: 700; font-size: 11px; color: #B45309; margin-bottom: 2px;">Analisis AI Bisa Saja Tidak Akurat</div>
              <div style="font-size: 10.5px; color: #B45309; line-height: 1.4;">
                Gunakan hasil deteksi ini sebagai panduan awal. Jika Anda merasa prediksi AI kurang sesuai, Anda dapat menyesuaikannya secara manual di bawah ini.
              </div>
            </div>
          </div>

          <!-- Opsi Sesuaikan Manual -->
          <div style="text-align: center; margin-top: 16px; margin-bottom: 8px; padding: 0 16px;">
            <button class="adjust-profile-btn" id="adjust-profile-btn" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              <span>Sesuaikan jenis & masalah kulit secara manual</span>
            </button>
          </div>
        </div>

        <!-- Skin Journey Roadmap -->
        ${journeySteps.length > 0 ? `
        <div class="skin-journey-section anim-fade-in-up anim-delay-2">
          <div class="sj-header">
            <div class="sj-header-top">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);"><path d="M14.12 3.88 16 5.76"/><path d="M16 18.24 14.12 20.12"/><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
              <div>
                <div class="sj-title">Skin Journey Kamu</div>
                <div class="sj-subtitle">${journeySteps.length} tahap perawatan · mulai dari yang paling mendesak</div>
              </div>
            </div>
            <div class="sj-banner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
              <span>Selesaikan satu tahap sebelum lanjut ke tahap berikutnya untuk hasil yang optimal</span>
            </div>
          </div>

          <div class="sj-steps">
            ${journeySteps.map((step, idx) => {
              const isActive = idx === 0;
              const col = step.col;
              const info = step.info;
              if (!info) return '';
              return `
              <div class="sj-step ${isActive ? 'sj-step--active' : 'sj-step--locked'}" data-step="${idx}">
                <div class="sj-step-connector ${idx === journeySteps.length - 1 ? 'sj-step-connector--last' : ''}"></div>
                <div class="sj-step-left">
                  <div class="sj-step-circle ${isActive ? 'sj-step-circle--active' : ''}" style="${isActive ? `background: #fff; border-color: ${col.hex}; border-width: 2px; color: ${col.hex}; display: flex; align-items: center; justify-content: center;` : ''}">
                    <span class="sj-step-num" style="${isActive ? `color: ${col.hex}; font-weight: 800;` : ''}">${step.stepNum}</span>
                  </div>
                </div>
                <div class="sj-step-body">
                  <div class="sj-step-meta">
                    <span class="sj-step-status ${isActive ? 'sj-step-status--active' : 'sj-step-status--upcoming'}" style="${isActive ? `background:${col.hex}15; color:${col.hex}; border-color:${col.hex}40;` : ''}">
                      ${isActive ? '🎯 Fokus Utama' : `Tahap ${step.stepNum}`}
                    </span>
                    <span class="sj-step-duration">⏱ ${info.duration}</span>
                  </div>
                  <div class="sj-step-name" style="${isActive ? `color: ${col.hex};` : ''}">${step.label}</div>
                  <div class="sj-step-tagline">${info.tagline}</div>

                  ${isActive ? `
                  <div class="sj-step-detail">
                    <div class="sj-why">
                      <div class="sj-why-label">Kenapa duluan?</div>
                      <div class="sj-why-text">${info.why}</div>
                    </div>
                    <div class="sj-done-when">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-right:4px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <span class="sj-done-text">Lanjut ke tahap berikutnya jika: <em>${info.done_when}</em></span>
                    </div>
                  </div>
                  ` : `
                  <div class="sj-step-locked-hint">Selesaikan <strong>${journeySteps[idx-1]?.label || 'tahap sebelumnya'}</strong> terlebih dahulu</div>
                  `}
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>
        ` : `
        <div class="sj-clear anim-fade-in-up anim-delay-2">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 12px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          <div class="sj-clear-title">Kulit Kamu Bersih!</div>
          <div class="sj-clear-desc">Tidak ada permasalahan kulit yang terdeteksi. Pertahankan rutinitas perawatan yang baik!</div>
        </div>
        `}

        <!-- CTA Buttons -->
        <div class="scan-cta-group anim-fade-in-up anim-delay-3">
          ${journeySteps.length > 0 ? `
          <button class="btn btn-journey btn-lg" id="start-journey-btn" style="background: ${journeySteps[0].col.hex}; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="m9 18 6-6-6-6v12z"/></svg>
            <span>Mulai Atasi ${journeySteps[0].label}</span>
          </button>
          ` : `
          <button class="btn btn-primary btn-lg" id="start-journey-btn" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            <span>Lihat Rekomendasi Produk</span>
          </button>
          `}
          <button class="scan-again-btn" id="rescan-btn">Scan Ulang</button>
        </div>
      </div>
    `;

    // Draw per-detection bounding boxes: each problem gets its OWN canvas
    if (capturedImage && permasalahan && permasalahan.length > 0) {
      const sourceImg = new Image();
      sourceImg.src = capturedImage;

      const drawSingleBox = (canvas, item) => {
        // Use natural canvas resolution
        const displayW = canvas.parentElement ? canvas.parentElement.offsetWidth : 320;
        const aspect = sourceImg.naturalHeight / sourceImg.naturalWidth;
        const displayH = Math.round(displayW * aspect);
        canvas.width = displayW;
        canvas.height = displayH;

        const ctx = canvas.getContext('2d');

        // Draw the base image scaled to canvas
        ctx.drawImage(sourceImg, 0, 0, displayW, displayH);

        if (!item.box_2d) {
          return; // Skip box drawing if manual override without box coordinates
        }

        const [ymin, xmin, ymax, xmax] = item.box_2d;
        const col = (PROBLEM_COLORS[item.label] || { hex: '#AAAAAA' }).hex;
        const confPct = Math.round((item.confidence || 0.5) * 100);

        const x1 = xmin / 1000 * displayW;
        const y1 = ymin / 1000 * displayH;
        const bw = (xmax - xmin) / 1000 * displayW;
        const bh = (ymax - ymin) / 1000 * displayH;

        // Dim overlay outside the bounding box only
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.50)';
        // top strip
        ctx.fillRect(0, 0, displayW, y1);
        // bottom strip
        ctx.fillRect(0, y1 + bh, displayW, displayH - y1 - bh);
        // left strip
        ctx.fillRect(0, y1, x1, bh);
        // right strip
        ctx.fillRect(x1 + bw, y1, displayW - x1 - bw, bh);
        ctx.restore();

        // Draw rounded rectangle border
        ctx.save();
        ctx.strokeStyle = col;
        ctx.lineWidth = 3;
        ctx.shadowColor = col;
        ctx.shadowBlur = 12;
        const r = 8;
        ctx.beginPath();
        ctx.moveTo(x1 + r, y1);
        ctx.lineTo(x1 + bw - r, y1);
        ctx.quadraticCurveTo(x1 + bw, y1, x1 + bw, y1 + r);
        ctx.lineTo(x1 + bw, y1 + bh - r);
        ctx.quadraticCurveTo(x1 + bw, y1 + bh, x1 + bw - r, y1 + bh);
        ctx.lineTo(x1 + r, y1 + bh);
        ctx.quadraticCurveTo(x1, y1 + bh, x1, y1 + bh - r);
        ctx.lineTo(x1, y1 + r);
        ctx.quadraticCurveTo(x1, y1, x1 + r, y1);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      };

      const canvases = page.querySelectorAll('.detection-bbox-canvas');
      const doDrawAll = () => {
        canvases.forEach((canvas, idx) => {
          if (permasalahan[idx]) drawSingleBox(canvas, permasalahan[idx]);
        });
      };

      if (sourceImg.complete && sourceImg.naturalWidth > 0) {
        doDrawAll();
      } else {
        sourceImg.onload = doDrawAll;
      }

      // Slider interaction
      const slider = page.querySelector('#detection-slider');
      const dots = page.querySelectorAll('.slider-dot');
      if (slider && dots.length > 0) {
        slider.addEventListener('scroll', () => {
          const slideW = slider.offsetWidth;
          const activeIdx = Math.round(slider.scrollLeft / slideW);
          dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeIdx);
          });
        }, { passive: true });

        dots.forEach(dot => {
          dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.idx);
            slider.scrollTo({ left: idx * slider.offsetWidth, behavior: 'smooth' });
          });
        });
      }
    }

    // Modal definition for Adjust Profile
    function showAdjustProfileModal(currentType, currentProblems) {
      const existing = document.querySelector('.adjust-modal-overlay');
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.className = 'adjust-modal-overlay';
      
      const manualSkinTypes = ['Normal', 'Berminyak', 'Kombinasi', 'Kering', 'Sensitif'];
      const skinProblems = [
        { id: 'Jerawat', label: 'Berjerawat' },
        { id: 'PIE', label: 'PIE' },
        { id: 'PIH', label: 'PIH' },
        { id: 'Bopeng', label: 'Aging / Kerutan' },
        { id: 'Hiperpigmentasi', label: 'Kusam' },
        { id: 'Kemerahan', label: 'Kemerahan' }
      ];

      const currentProbLabels = (currentProblems || []).map(p => p.label || p);
      let selectedType = currentType;
      let selectedProblems = [...currentProbLabels];

      overlay.innerHTML = `
        <div class="adjust-modal-container">
          <div class="adjust-title">Sesuaikan Profil Kulit</div>
          <div class="adjust-subtitle">Sesuaikan jenis dan masalah kulit jika prediksi AI kurang akurat</div>

          <div class="adjust-section">
            <div class="adjust-section-title">Jenis Kulit</div>
            <div class="adjust-grid">
              ${manualSkinTypes.map(st => {
                const isActive = st === selectedType;
                return `
                  <div class="adjust-pill ${isActive ? 'active' : ''}" data-skin-type="${st}">
                    ${skinTypeIcons[st] || ''}
                    <span>${st}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="adjust-section">
            <div class="adjust-section-title">Masalah Kulit</div>
            <div class="adjust-grid">
              ${skinProblems.map(p => {
                const isActive = selectedProblems.includes(p.id);
                return `
                  <div class="adjust-pill ${isActive ? 'active' : ''}" data-problem="${p.id}">
                    ${PROBLEM_ICONS[p.id] || ''}
                    <span>${p.label}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="adjust-actions">
            <button class="adjust-btn-cancel" id="adjust-cancel">Batal</button>
            <button class="adjust-btn-save" id="adjust-save">Simpan Perubahan</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Event handlers inside modal
      const typePills = overlay.querySelectorAll('[data-skin-type]');
      typePills.forEach(pill => {
        pill.addEventListener('click', () => {
          selectedType = pill.dataset.skinType;
          typePills.forEach(p => p.classList.toggle('active', p.dataset.skinType === selectedType));
        });
      });

      const problemPills = overlay.querySelectorAll('[data-problem]');
      problemPills.forEach(pill => {
        pill.addEventListener('click', () => {
          const val = pill.dataset.problem;
          const idx = selectedProblems.indexOf(val);
          if (idx === -1) {
            selectedProblems.push(val);
            pill.classList.add('active');
          } else {
            selectedProblems.splice(idx, 1);
            pill.classList.remove('active');
          }
        });
      });

      overlay.querySelector('#adjust-cancel').addEventListener('click', () => {
        overlay.remove();
      });

      overlay.querySelector('#adjust-save').addEventListener('click', async () => {
        const formattedProblems = selectedProblems.map(p => ({ label: p, confidence: 0.95 }));
        localStorage.setItem('bglow_skin_type_' + userId, selectedType);
        localStorage.setItem('bglow_skin_problems_' + userId, JSON.stringify(formattedProblems));
        
        // Sync to server database
        const { syncUserData } = await import('../utils/store.js');
        if (userId && userId !== 'guest') {
          syncUserData({
            skin_type: selectedType
          });
        }

        // Re-render scan results dynamically
        overlay.remove();
        renderResults({
          jenis_kulit: selectedType,
          permasalahan: formattedProblems,
          skin_score: 85,
          acne_level: selectedProblems.includes('Jerawat') ? 'Ringan — Grade 1' : 'Bersih',
          oil_level: selectedType === 'Berminyak' ? 'Tinggi' : selectedType === 'Kering' ? 'Rendah' : 'Normal',
          pore_condition: 'Minimal'
        });
      });
    }

    // Event listeners
    page.querySelector('#back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });

    page.querySelector('#rescan-btn').addEventListener('click', () => {
      capturedImage = null;
      renderCamera();
    });

    const adjustBtn = page.querySelector('#adjust-profile-btn');
    if (adjustBtn) {
      adjustBtn.addEventListener('click', () => {
        showAdjustProfileModal(jenis_kulit, permasalahan);
      });
    }

    const journeyBtn = page.querySelector('#start-journey-btn');
    if (journeyBtn) {
      journeyBtn.addEventListener('click', () => {
        const countKey = 'bglow_scan_count_' + userId;
        const current = parseInt(localStorage.getItem(countKey) || '0');
        localStorage.setItem(countKey, String(current + 1));
        // Save current journey step label for recommendations page to filter by
        if (journeySteps.length > 0) {
          localStorage.setItem('bglow_journey_priority_' + userId, journeySteps[0].label);
        }
        window.location.hash = '#/recommendations';
      });
    }
  }

  // Start with camera
  renderCamera();

  return page;
}
