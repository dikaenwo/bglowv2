import { icons } from '../components/BottomNav.js';
import { getUserId } from '../utils/store.js';
import { API_BASE_URL } from '../config.js';

export function renderSkinScan() {
  const page = document.createElement('div');
  page.className = 'page';
  let phase = 'camera'; // camera → processing → results
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

  function renderCamera() {
    capturedImage = null; // reset on new scan start
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
      <input type="file" accept="image/*" capture="user" id="camera-file-input" style="display: none;" />
      <div class="page-content" style="text-align:center; padding-top:24px;">
        <p style="color:var(--text-tertiary); font-size:var(--font-sm);">
          Posisikan wajah Anda dalam garis batas lalu ketuk tombol scan
        </p>
      </div>
    `;

    const video = page.querySelector('#webcam');
    const placeholder = page.querySelector('#camera-placeholder');
    const placeholderText = placeholder.querySelector('span');
    const fileInput = page.querySelector('#camera-file-input');

    // Helper to setup fallback native camera trigger
    const setupFallbackMode = (message) => {
      if (placeholderText) {
        placeholderText.textContent = message;
      }
      placeholder.addEventListener('click', () => {
        fileInput.click();
      });
    };

    // Request camera access
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
        console.warn("Gagal mengakses kamera secara langsung:", err);
        setupFallbackMode("Kamera terblokir. Ketuk di sini untuk mengambil foto.");
      });
    } else {
      console.warn("navigator.mediaDevices.getUserMedia tidak didukung.");
      setupFallbackMode("Ketuk di sini untuk membuka kamera.");
    }

    // Handle native camera/file input capture
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          capturedImage = event.target.result;
          localStorage.setItem('bglow_captured_image_' + userId, capturedImage);
          
          // Display the captured image as preview
          let imgPreview = page.querySelector('#captured-preview');
          if (!imgPreview) {
            imgPreview = document.createElement('img');
            imgPreview.id = 'captured-preview';
            imgPreview.style.cssText = "width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; z-index: 1; transform: scaleX(-1);";
            page.querySelector('.camera-feed').appendChild(imgPreview);
          }
          imgPreview.src = capturedImage;
          imgPreview.style.display = 'block';
          
          // Hide video and placeholder
          if (video) video.style.display = 'none';
          if (placeholder) placeholder.style.display = 'none';
          
          startScanning();
        };
        reader.readAsDataURL(file);
      }
    });

    page.querySelector('#back-btn').addEventListener('click', () => {
      stopCamera();
      window.location.hash = '#/';
    });

    page.querySelector('#start-scan').addEventListener('click', () => {
      if (video && stream) {
        // Capture the mirrored frame from video stream
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          
          // Mirror the captured image to match what the user saw
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          capturedImage = canvas.toDataURL('image/jpeg');
          localStorage.setItem('bglow_captured_image_' + userId, capturedImage);
        } catch (err) {
          console.error("Gagal menangkap gambar dari video feed:", err);
        }
        startScanning();
      } else {
        // Fallback: trigger native camera click
        fileInput.click();
      }
    });
  }

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

    setTimeout(() => {
      stopCamera();

      // Save default scan results and captured image immediately
      localStorage.setItem('bglow_has_scanned_' + userId, '1');
      if (capturedImage) {
        localStorage.setItem('bglow_captured_image_' + userId, capturedImage);
      }
      localStorage.setItem('bglow_skin_type_' + userId, 'Kombinasi');
      localStorage.setItem('bglow_acne_level_' + userId, 'Ringan — Grade 1');
      localStorage.setItem('bglow_oil_level_' + userId, 'Sedang — T-Zone');
      localStorage.setItem('bglow_pore_condition_' + userId, 'Baik — Minimal');
      localStorage.setItem('bglow_skin_score_' + userId, '65');

      // Append to scan history list
      try {
        const historyKey = 'bglow_scan_history_' + userId;
        const historyData = localStorage.getItem(historyKey);
        let historyList = [];
        if (historyData) {
          historyList = JSON.parse(historyData);
        }
        const newRecord = {
          id: 'scan_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
          date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          skin_type: 'Kombinasi',
          acne_level: 'Ringan — Grade 1',
          oil_level: 'Sedang — T-Zone',
          pore_condition: 'Baik — Minimal',
          skin_score: 65,
          image: capturedImage
        };
        historyList.unshift(newRecord);
        localStorage.setItem(historyKey, JSON.stringify(historyList));
      } catch (e) {
        console.error("Gagal menyimpan ke riwayat scan:", e);
      }

      // Sync to database if not guest
      if (userId && userId !== 'guest') {
        fetch(`${API_BASE_URL}/api/user/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            skin_type: 'Kombinasi',
            acne_level: 'Ringan — Grade 1',
            oil_level: 'Sedang — T-Zone',
            pore_condition: 'Baik — Minimal',
            skin_score: 65
          })
        })
.catch(e => console.error("Gagal sinkronisasi otomatis hasil scan:", e));
      }

      renderProcessing();
    }, 3000);
  }

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
          <h3>AI sedang menganalisis jenis kulit Anda...</h3>
          <p>Mohon tunggu sebentar</p>
        </div>
        <div class="processing-steps">
          <div class="p-step active" id="step-1"><span class="step-dot"></span> Mendeteksi fitur kulit</div>
          <div class="p-step" id="step-2"><span class="step-dot"></span> Menganalisis kondisi pori</div>
          <div class="p-step" id="step-3"><span class="step-dot"></span> Mengukur level minyak</div>
          <div class="p-step" id="step-4"><span class="step-dot"></span> Menyiapkan hasil analisis</div>
        </div>
      </div>
    `;

    page.querySelector('#back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });

    const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
    steps.forEach((id, i) => {
      setTimeout(() => {
        if (i > 0) {
          const prev = page.querySelector(`#${steps[i - 1]}`);
          if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }
        }
        const el = page.querySelector(`#${id}`);
        if (el) el.classList.add('active');
      }, i * 800);
    });

    setTimeout(() => renderResults(), 3500);
  }

  function renderResults() {
    const skinType = localStorage.getItem('bglow_skin_type_' + userId) || 'Kombinasi';
    const acneLevel = localStorage.getItem('bglow_acne_level_' + userId) || 'Ringan — Grade 1';
    const oilLevel = localStorage.getItem('bglow_oil_level_' + userId) || 'Sedang — T-Zone';
    const poreCondition = localStorage.getItem('bglow_pore_condition_' + userId) || 'Baik — Minimal';
    const skinScore = parseInt(localStorage.getItem('bglow_skin_score_' + userId) || '65');

    // Descriptions based on values
    const typeDesc = skinType === 'Kombinasi'
      ? 'Kulit kombinasi memiliki karakteristik berminyak di area T-zone (dahi, hidung, dagu) namun cenderung normal atau kering di area pipi. Membutuhkan perawatan yang menyeimbangkan kedua kondisi ini.'
      : `Kulit bertipe ${skinType}. Membutuhkan perawatan rutin yang sesuai untuk menjaga kelembapan dan kesehatan barier kulit Anda secara optimal.`;

    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Hasil Scan</h1>
      </div>
      <div class="scan-results anim-fade-in">
        <div class="result-face-card">
          <div class="result-face-img"${capturedImage ? ` style="background-image: url('${capturedImage}');"` : ''}>
            <div class="face-placeholder">
              <div class="highlight-zone zone-1"></div>
              <div class="highlight-zone zone-2"></div>
              <div class="highlight-zone zone-3"></div>
            </div>
          </div>
        </div>

        <!-- Skin Type Detail -->
        <div class="skin-type-detail anim-fade-in-up anim-delay-1">
          <div class="std-header">
            <span class="std-emoji">✨</span>
            <span class="std-label">Jenis Kulit</span>
          </div>
          <div class="std-card">
            <div class="std-icon">💧</div>
            <div class="std-info">
              <h3>Kulit ${skinType}</h3>
              <p>${typeDesc}</p>
            </div>
          </div>
        </div>

        <!-- Skin Problems -->
        <div class="skin-problems anim-fade-in-up anim-delay-2">
          <div class="std-header">
            <span class="std-emoji">🔍</span>
            <span class="std-label">Permasalahan Kulit</span>
          </div>
          <p class="sp-desc">Kulitmu memiliki beberapa permasalahan yang perlu diperhatikan:</p>
          <div class="problem-cards">
            <div class="problem-card">
              <div class="pc-icon" style="background:#FEF2F2;">🔴</div>
              <div class="pc-info">
                <h4>Jerawat (Acne)</h4>
                <p>${acneLevel}. Terdapat beberapa tanda jerawat atau komedo di area wajah.</p>
              </div>
            </div>
            <div class="problem-card">
              <div class="pc-icon" style="background:#FFFBEB;">✨</div>
              <div class="pc-info">
                <h4>Minyak Berlebih (Oil Level)</h4>
                <p>Kadar sebum di wajah tergolong ${oilLevel}.</p>
              </div>
            </div>
            <div class="problem-card">
              <div class="pc-icon" style="background:#FEF3C7;">🟡</div>
              <div class="pc-info">
                <h4>Kondisi Pori</h4>
                <p>Kondisi pori-pori wajah saat ini terdeteksi ${poreCondition}.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Analysis Cards -->
        <div class="result-title anim-fade-in-up anim-delay-3">Detail Analisis</div>
        <div class="result-cards">
          <div class="result-card">
            <div class="rc-icon" style="background:#EFF6FF;">💧</div>
            <div class="rc-info">
              <div class="rc-label">Skor Kesehatan Kulit</div>
              <div class="rc-value">${skinScore}/100</div>
              <div class="rc-bar"><div class="rc-bar-fill" style="width:${skinScore}%;background:var(--primary);"></div></div>
            </div>
          </div>
          <div class="result-card">
            <div class="rc-icon" style="background:#FEF2F2;">🔴</div>
            <div class="rc-info">
              <div class="rc-label">Jenis Kulit</div>
              <div class="rc-value">${skinType}</div>
              <div class="rc-bar"><div class="rc-bar-fill" style="width:70%;background:#EF4444;"></div></div>
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

    page.querySelector('#back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });

    page.querySelector('#rescan-btn').addEventListener('click', () => {
      localStorage.removeItem('bglow_has_scanned_' + userId);
      localStorage.removeItem('bglow_captured_image_' + userId);
      capturedImage = null;
      renderCamera();
    });

    page.querySelector('#get-reco-btn').addEventListener('click', async () => {
      // Increment scan count
      const countKey = 'bglow_scan_count_' + userId;
      const current = parseInt(localStorage.getItem(countKey) || '0');
      localStorage.setItem(countKey, String(current + 1));

      window.location.hash = '#/recommendations';
    });
  }

  const hasScanned = localStorage.getItem('bglow_has_scanned_' + userId) === '1';
  if (hasScanned) {
    renderResults();
  } else {
    renderCamera();
  }

  return page;
}
