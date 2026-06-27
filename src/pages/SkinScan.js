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

    // Score color
    const scoreColor = skin_score >= 80 ? '#22c55e' : skin_score >= 60 ? '#f59e0b' : '#ef4444';
    const scoreLabel = skin_score >= 80 ? 'Sangat Baik' : skin_score >= 60 ? 'Cukup Baik' : 'Perlu Perhatian';

    // Build problem cards HTML
    let problemCardsHTML = '';
    if (!permasalahan || permasalahan.length === 0) {
      problemCardsHTML = `
        <div style="text-align:center; padding: 20px; background: #F0FDF4; border-radius: 16px; border: 1px solid #86EFAC;">
          <div style="font-size: 40px; margin-bottom: 8px;">🎉</div>
          <p style="color: #16A34A; font-weight: 600; margin: 0;">Tidak ada permasalahan kulit terdeteksi!</p>
          <p style="color: #4ADE80; font-size: var(--font-xs); margin: 4px 0 0;">Kulit Anda dalam kondisi yang sangat baik.</p>
        </div>
      `;
    } else {
      problemCardsHTML = permasalahan.map(p => {
        const col = PROBLEM_COLORS[p.label] || { hex: '#888', bg: '#F5F5F5', emoji: '⚠️' };
        const desc = PROBLEM_DESCRIPTIONS[p.label] || p.label;
        const confPct = Math.round((p.confidence || 0.5) * 100);
        return `
          <div class="problem-card">
            <div class="pc-icon" style="background:${col.bg}; font-size: 22px;">${col.emoji}</div>
            <div class="pc-info">
              <h4>${p.label}</h4>
              <p>${desc}</p>
              <div style="margin-top: 6px; display: flex; align-items: center; gap: 6px;">
                <div style="flex:1; height: 4px; border-radius: 2px; background: #E5E7EB; overflow: hidden;">
                  <div style="height:100%; width: ${confPct}%; background: ${col.hex}; border-radius: 2px; transition: width 0.8s ease;"></div>
                </div>
                <span style="font-size: var(--font-xs); color: var(--text-tertiary); white-space: nowrap;">
                  ${confPct}% keyakinan
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Hasil Scan AI</h1>
      </div>
      <div class="scan-results anim-fade-in">

        <!-- Face image dengan canvas overlay bounding box -->
        <div class="result-face-card" style="position: relative; overflow: hidden;">
          <div id="face-img-container" style="position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; border-radius: 16px; background: #111;">
            ${capturedImage ? `<img id="result-face-img" src="${capturedImage}" style="width: 100%; height: 100%; object-fit: cover; display: block;" alt="Foto wajah" />` : ''}
            <canvas id="bbox-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2;"></canvas>
          </div>
          ${permasalahan && permasalahan.length > 0 ? `
            <div style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;">
              ${permasalahan.map(p => {
                const col = PROBLEM_COLORS[p.label] || { hex: '#888', bg: '#F5F5F5' };
                return `<span style="font-size: var(--font-xs); padding: 3px 10px; border-radius: 100px; background: ${col.bg}; color: ${col.hex}; font-weight: 600; border: 1px solid ${col.hex}40;">${p.label}</span>`;
              }).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Skin Score -->
        <div class="skin-type-detail anim-fade-in-up anim-delay-1" style="margin-top: 16px;">
          <div class="std-header">
            <span class="std-emoji">📊</span>
            <span class="std-label">Skor Kesehatan Kulit</span>
          </div>
          <div class="std-card" style="flex-direction: column; align-items: flex-start; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 16px; width: 100%;">
              <div style="font-size: 42px; font-weight: 800; color: ${scoreColor}; line-height:1;">${skin_score}</div>
              <div style="flex: 1;">
                <div style="font-size: var(--font-sm); font-weight: 600; color: ${scoreColor};">${scoreLabel}</div>
                <div style="height: 8px; background: #E5E7EB; border-radius: 4px; overflow: hidden; margin-top: 6px;">
                  <div id="score-bar" style="height: 100%; width: 0%; background: ${scoreColor}; border-radius: 4px; transition: width 1.2s ease;"></div>
                </div>
              </div>
              <div style="font-size: var(--font-xs); color: var(--text-tertiary);">/100</div>
            </div>
          </div>
        </div>

        <!-- Jenis Kulit -->
        <div class="skin-type-detail anim-fade-in-up anim-delay-1">
          <div class="std-header">
            <span class="std-emoji">✨</span>
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

        <!-- Permasalahan Kulit -->
        <div class="skin-problems anim-fade-in-up anim-delay-2">
          <div class="std-header">
            <span class="std-emoji">🔍</span>
            <span class="std-label">Permasalahan Kulit</span>
          </div>
          ${permasalahan && permasalahan.length > 0
            ? `<p class="sp-desc">Ditemukan <strong>${permasalahan.length} permasalahan</strong> pada kulit Anda:</p>`
            : '<p class="sp-desc">Tidak ada permasalahan yang terdeteksi.</p>'
          }
          <div class="problem-cards">
            ${problemCardsHTML}
          </div>
        </div>

        <!-- Detail Analisis -->
        <div class="result-title anim-fade-in-up anim-delay-3">Detail Analisis</div>
        <div class="result-cards">
          <div class="result-card">
            <div class="rc-icon" style="background:#EFF6FF;">💧</div>
            <div class="rc-info">
              <div class="rc-label">Level Minyak</div>
              <div class="rc-value" style="font-size: var(--font-sm);">${oil_level}</div>
            </div>
          </div>
          <div class="result-card">
            <div class="rc-icon" style="background:#FEF2F2;">🔴</div>
            <div class="rc-info">
              <div class="rc-label">Level Jerawat</div>
              <div class="rc-value" style="font-size: var(--font-sm);">${acne_level}</div>
            </div>
          </div>
          <div class="result-card">
            <div class="rc-icon" style="background:#FEF3C7;">🟡</div>
            <div class="rc-info">
              <div class="rc-label">Kondisi Pori</div>
              <div class="rc-value" style="font-size: var(--font-sm);">${pore_condition}</div>
            </div>
          </div>
          <div class="result-card">
            <div class="rc-icon" style="background:#F0FDF4;">🌿</div>
            <div class="rc-info">
              <div class="rc-label">Analisis oleh</div>
              <div class="rc-value" style="font-size: var(--font-sm);">Gemini AI</div>
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="scan-cta-group anim-fade-in-up anim-delay-4">
          <button class="btn btn-primary btn-lg" id="get-reco-btn">
            ✨ Dapatkan Rekomendasi Produk
          </button>
          <button class="scan-again-btn" id="rescan-btn">Scan Ulang</button>
        </div>
      </div>
    `;

    // Draw bounding boxes on canvas
    if (capturedImage && permasalahan && permasalahan.length > 0) {
      const img = page.querySelector('#result-face-img');
      const canvas = page.querySelector('#bbox-canvas');
      const container = page.querySelector('#face-img-container');

      const drawBoxes = () => {
        const w = container.offsetWidth;
        const h = container.offsetHeight;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, w, h);

        permasalahan.forEach(item => {
          const [ymin, xmin, ymax, xmax] = item.box_2d;
          const col = (PROBLEM_COLORS[item.label] || { hex: '#AAAAAA' }).hex;
          const confPct = Math.round((item.confidence || 0.5) * 100);

          const x1 = xmin / 1000 * w;
          const y1 = ymin / 1000 * h;
          const bw = (xmax - xmin) / 1000 * w;
          const bh = (ymax - ymin) / 1000 * h;

          // Dim outside area
          ctx.save();
          ctx.fillStyle = 'rgba(0,0,0,0.35)';
          ctx.fillRect(0, 0, w, h);
          ctx.clearRect(x1, y1, bw, bh);
          ctx.restore();

          // Draw box
          ctx.save();
          ctx.strokeStyle = col;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = col;
          ctx.shadowBlur = 8;
          const r = 6;
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

          // Label background
          const labelText = `${item.label} ${confPct}%`;
          ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
          const textW = ctx.measureText(labelText).width;
          const labelX = x1;
          const labelY = Math.max(y1 - 26, 4);
          const padX = 8, padY = 4;

          ctx.save();
          ctx.fillStyle = col;
          ctx.beginPath();
          ctx.roundRect(labelX, labelY, textW + padX * 2, 20, 4);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(labelText, labelX + padX, labelY + 14);
          ctx.restore();
        });
      };

      if (img.complete) {
        drawBoxes();
      } else {
        img.addEventListener('load', drawBoxes);
      }
    }

    // Animate score bar
    setTimeout(() => {
      const scoreBar = page.querySelector('#score-bar');
      if (scoreBar) scoreBar.style.width = `${skin_score}%`;
    }, 300);

    // Event listeners
    page.querySelector('#back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });

    page.querySelector('#rescan-btn').addEventListener('click', () => {
      capturedImage = null;
      renderCamera();
    });

    page.querySelector('#get-reco-btn').addEventListener('click', () => {
      const countKey = 'bglow_scan_count_' + userId;
      const current = parseInt(localStorage.getItem(countKey) || '0');
      localStorage.setItem(countKey, String(current + 1));
      window.location.hash = '#/recommendations';
    });
  }

  // Start with camera
  renderCamera();

  return page;
}
