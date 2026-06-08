import { icons } from '../components/BottomNav.js';
import { getUserId } from '../utils/store.js';

export function renderSkinScan() {
  const page = document.createElement('div');
  page.className = 'page';
  let phase = 'camera'; // camera → processing → results

  function renderCamera() {
    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Scan Kulit AI</h1>
      </div>
      <div class="scan-camera">
        <div class="camera-feed">
          <div class="face-outline"></div>
          <div class="scan-line"></div>
          <div class="detection-points" id="det-points"></div>
          <div class="scan-status">
            <span class="shimmer-text">Menganalisis kondisi kulit Anda...</span>
          </div>
        </div>
        <div class="scan-controls">
          <button class="scan-btn-main" id="start-scan">${icons.camera}</button>
        </div>
      </div>
      <div class="page-content" style="text-align:center; padding-top:24px;">
        <p style="color:var(--text-tertiary); font-size:var(--font-sm);">
          Posisikan wajah Anda dalam garis batas lalu ketuk tombol scan
        </p>
      </div>
    `;

    page.querySelector('#back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });

    page.querySelector('#start-scan').addEventListener('click', () => {
      startScanning();
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
        pointsContainer.appendChild(dot);
      }, 400 + i * 300);
    });

    setTimeout(() => renderProcessing(), 3000);
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
          <div class="loader-center-icon">${icons.skinScan}</div>
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
    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Hasil Scan</h1>
      </div>
      <div class="scan-results anim-fade-in">
        <div class="result-face-card">
          <div class="result-face-img">
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
              <h3>Kulit Kombinasi (Combination)</h3>
              <p>Kulit kombinasi memiliki karakteristik berminyak di area T-zone (dahi, hidung, dagu) namun cenderung normal atau kering di area pipi. Membutuhkan perawatan yang menyeimbangkan kedua kondisi ini.</p>
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
                <p>Mild — Grade 1. Terdapat beberapa komedo dan papula kecil di area dahi dan dagu.</p>
              </div>
            </div>
            <div class="problem-card">
              <div class="pc-icon" style="background:#FFFBEB;">✨</div>
              <div class="pc-info">
                <h4>Minyak Berlebih (Oily T-Zone)</h4>
                <p>Produksi sebum berlebih di area T-zone. Level sedang, perlu kontrol minyak yang tepat.</p>
              </div>
            </div>
            <div class="problem-card">
              <div class="pc-icon" style="background:#FEF3C7;">🟡</div>
              <div class="pc-info">
                <h4>Pori-pori Terbuka</h4>
                <p>Pori-pori tampak membesar di area hidung dan pipi. Perlu perawatan untuk meminimalisir.</p>
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
              <div class="rc-label">Jenis Kulit</div>
              <div class="rc-value">Kombinasi</div>
              <div class="rc-bar"><div class="rc-bar-fill" style="width:65%;background:var(--primary);"></div></div>
            </div>
          </div>
          <div class="result-card">
            <div class="rc-icon" style="background:#FEF2F2;">🔴</div>
            <div class="rc-info">
              <div class="rc-label">Level Jerawat</div>
              <div class="rc-value">Ringan — Grade 1</div>
              <div class="rc-bar"><div class="rc-bar-fill" style="width:30%;background:#EF4444;"></div></div>
            </div>
          </div>
          <div class="result-card">
            <div class="rc-icon" style="background:#FFFBEB;">✨</div>
            <div class="rc-info">
              <div class="rc-label">Level Minyak</div>
              <div class="rc-value">Sedang — T-Zone</div>
              <div class="rc-bar"><div class="rc-bar-fill" style="width:55%;background:#F59E0B;"></div></div>
            </div>
          </div>
          <div class="result-card">
            <div class="rc-icon" style="background:#ECFDF5;">🟢</div>
            <div class="rc-info">
              <div class="rc-label">Kondisi Pori</div>
              <div class="rc-value">Baik — Minimal</div>
              <div class="rc-bar"><div class="rc-bar-fill" style="width:25%;background:#10B981;"></div></div>
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
      renderCamera();
    });

    page.querySelector('#get-reco-btn').addEventListener('click', async () => {
      const userId = getUserId();
      localStorage.setItem('bglow_has_scanned_' + userId, '1');
      
      // Simpan kondisi lokal
      localStorage.setItem('bglow_skin_type_' + userId, 'Kombinasi');
      localStorage.setItem('bglow_acne_level_' + userId, 'Ringan — Grade 1');
      localStorage.setItem('bglow_oil_level_' + userId, 'Sedang — T-Zone');
      localStorage.setItem('bglow_pore_condition_' + userId, 'Baik — Minimal');
      localStorage.setItem('bglow_skin_score_' + userId, '65');

      // Increment scan count
      const countKey = 'bglow_scan_count_' + userId;
      const current = parseInt(localStorage.getItem(countKey) || '0');
      localStorage.setItem(countKey, String(current + 1));

      // Kirim hasil scan ke database
      if (userId && userId !== 'guest') {
        try {
          await fetch(`http://localhost:8000/api/user/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              skin_type: 'Kombinasi',
              acne_level: 'Ringan — Grade 1',
              oil_level: 'Sedang — T-Zone',
              pore_condition: 'Baik — Minimal',
              skin_score: 65
            })
          });
        } catch (e) {
          console.error("Gagal menyimpan data kulit ke server:", e);
        }
      }

      window.location.hash = '#/recommendations';
    });
  }

  renderCamera();
  return page;
}
