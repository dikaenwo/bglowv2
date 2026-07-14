import { icons } from '../components/BottomNav.js';
import { getUserId, getAuthHeaders } from '../utils/store.js';
import { API_BASE_URL, SKIN_SCAN_API_URL } from '../config.js';

// ─── Palet warna per kategori permasalahan ───────────────────────────────────
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
          <h3>AI Gemini sedang menganalisis kulit Anda...</h3>
          <p>Mohon tunggu sebentar</p>
        </div>
        <div class="processing-steps">
          <div class="p-step active" id="step-1"><span class="step-dot"></span> Mengirim gambar ke Gemini AI</div>
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

    const skinTypeEmoji = {
      'Berminyak': '💦',
      'Kombinasi': '💧',
      'Kering': '🍂',
      'Normal': '✨',
    }[jenis_kulit] || '✨';

    const skinTypeDesc = {
      'Berminyak': 'Kulit berminyak memproduksi sebum berlebih di seluruh wajah. Rentan jerawat namun lebih lambat mengalami tanda penuaan.',
      'Kombinasi': 'Kulit kombinasi berminyak di area T-zone (dahi, hidung, dagu) namun normal atau kering di area pipi.',
      'Kering': 'Kulit kering kekurangan produksi minyak alami, mudah terasa kencang, kasar, dan rentan terhadap iritasi.',
      'Normal': 'Kulit seimbang dengan produksi sebum yang ideal. Tidak terlalu berminyak atau kering.',
    }[jenis_kulit] || `Jenis kulit terdeteksi: ${jenis_kulit}.`;

    // Build sorted skin journey steps based on medical priority
    const detectedLabels = (permasalahan || []).map(p => p.label);
    const journeySteps = MEDICAL_PRIORITY_ORDER
      .filter(label => detectedLabels.includes(label))
      .map((label, idx) => ({ label, stepNum: idx + 1, info: JOURNEY_INFO[label] || null, col: PROBLEM_COLORS[label] || { hex: '#888', bg: '#F5F5F5', emoji: '⚠️' } }));

    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Hasil Scan AI</h1>
      </div>
      <div class="scan-results anim-fade-in">

        <!-- Deteksi per-masalah: carousel slider -->
        ${permasalahan && permasalahan.length > 0 ? `
        <div class="detection-section">
          <div class="std-header" style="margin-bottom: 12px;">
            <span class="std-emoji">🔬</span>
            <span class="std-label">Deteksi Area Kulit</span>
            <span class="detection-count-badge">${permasalahan.length} area</span>
          </div>
          <div class="detection-slider-wrapper">
            <div class="detection-slider" id="detection-slider">
              ${permasalahan.map((p, idx) => {
                const col = PROBLEM_COLORS[p.label] || { hex: '#888', bg: '#F5F5F5', emoji: '⚠️' };
                return `
                <div class="detection-slide" data-idx="${idx}">
                  <div class="detection-slide-img-wrap">
                    <canvas class="detection-bbox-canvas" data-idx="${idx}" style="display: block; width: 100%; border-radius: 14px;"></canvas>
                    <div class="detection-slide-badge" style="background: ${col.hex};">
                      ${col.emoji} ${p.label}
                    </div>
                  </div>
                  <div class="detection-slide-footer" style="border-top: 2px solid ${col.hex}20;">
                    <div class="dsf-label" style="color: ${col.hex};">${col.emoji} ${p.label}</div>
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
          <div class="std-header">
            <span class="std-emoji">${skinTypeEmoji}</span>
            <span class="std-label">Jenis Kulit Terdeteksi</span>
          </div>
          <div class="std-card">
            <div class="std-icon">${skinTypeEmoji}</div>
            <div class="std-info">
              <h3>Kulit ${jenis_kulit}</h3>
              <p>${skinTypeDesc}</p>
            </div>
          </div>
        </div>

        <!-- Skin Journey Roadmap -->
        ${journeySteps.length > 0 ? `
        <div class="skin-journey-section anim-fade-in-up anim-delay-2">
          <div class="sj-header">
            <div class="sj-header-top">
              <span class="sj-icon">🗺️</span>
              <div>
                <div class="sj-title">Skin Journey Kamu</div>
                <div class="sj-subtitle">${journeySteps.length} tahap perawatan · mulai dari yang paling mendesak</div>
              </div>
            </div>
            <div class="sj-banner">
              💡 Selesaikan satu tahap sebelum lanjut ke tahap berikutnya untuk hasil yang optimal
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
                  <div class="sj-step-circle ${isActive ? 'sj-step-circle--active' : ''}" style="${isActive ? `background: ${col.hex}; border-color: ${col.hex};` : ''}">
                    ${isActive ? `<span style="color:#fff; font-size:15px;">${col.emoji}</span>` : `<span class="sj-step-num">${step.stepNum}</span>`}
                  </div>
                </div>
                <div class="sj-step-body">
                  <div class="sj-step-meta">
                    <span class="sj-step-status ${isActive ? 'sj-step-status--active' : 'sj-step-status--upcoming'}" style="${isActive ? `background:${col.hex}15; color:${col.hex}; border-color:${col.hex}40;` : ''}">
                      ${isActive ? '🎯 Fokus Sekarang' : `Tahap ${step.stepNum}`}
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
                    <div class="sj-ingredients">
                      <div class="sj-ing-label">Bahan aktif yang dicari:</div>
                      <div class="sj-ing-chips">
                        ${info.ingredients.map(ing => `<span class="sj-ing-chip" style="border-color: ${col.hex}40; color: ${col.hex};">${ing}</span>`).join('')}
                      </div>
                    </div>
                    <div class="sj-done-when">
                      <span class="sj-done-icon">✅</span>
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
          <div class="sj-clear-icon">🎉</div>
          <div class="sj-clear-title">Kulit Kamu Bersih!</div>
          <div class="sj-clear-desc">Tidak ada permasalahan kulit yang terdeteksi. Pertahankan rutinitas perawatan yang baik!</div>
        </div>
        `}

        <!-- CTA Buttons -->
        <div class="scan-cta-group anim-fade-in-up anim-delay-3">
          ${journeySteps.length > 0 ? `
          <button class="btn btn-journey btn-lg" id="start-journey-btn" style="background: ${journeySteps[0].col.hex};">
            ${journeySteps[0].col.emoji} Mulai Atasi ${journeySteps[0].label}
          </button>
          ` : `
          <button class="btn btn-primary btn-lg" id="start-journey-btn">
            ✨ Lihat Rekomendasi Produk
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

    // Event listeners
    page.querySelector('#back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });

    page.querySelector('#rescan-btn').addEventListener('click', () => {
      capturedImage = null;
      renderCamera();
    });

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
