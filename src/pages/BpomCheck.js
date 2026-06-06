import { icons } from '../components/BottomNav.js';

// Mock BPOM data
const bpomData = [
  { name: 'Somethinc Niacinamide Serum', regNo: 'NA18210100123', manufacturer: 'PT Beautyhaul Indonesia', status: 'registered' },
  { name: 'Wardah UV Shield Sunscreen', regNo: 'NA18200500456', manufacturer: 'PT Paragon Technology', status: 'registered' },
  { name: 'Skintific 5X Ceramide Moisturizer', regNo: 'NA18220300789', manufacturer: 'PT Skintific Indonesia', status: 'registered' },
  { name: 'MS Glow Whitening Cream', regNo: 'NA18190700321', manufacturer: 'PT Kosmetika Global', status: 'registered' },
  { name: 'Unknown Beauty Cream X', regNo: '-', manufacturer: 'Unknown', status: 'not-registered' },
];

export function renderBpomCheck() {
  const page = document.createElement('div');
  page.className = 'page';

  function renderMain() {
    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Cek BPOM</h1>
      </div>

      <!-- Scanner -->
      <div class="bpom-scanner">
        <div class="scanner-feed">
          <div class="barcode-frame">
            <div class="barcode-corner-tr"></div>
            <div class="barcode-corner-bl"></div>
            <div class="laser-line"></div>
            <div class="barcode-graphic" id="barcode-graphic"></div>
          </div>
        </div>
        <div class="scanner-label">Arahkan kamera ke barcode</div>
      </div>

      <!-- Search -->
      <div class="bpom-search anim-fade-in-up">
        <div class="search-divider">atau cari berdasarkan nama</div>
        <div class="search-input-wrap">
          ${icons.search}
          <input type="text" id="bpom-search-input" placeholder="Masukkan nama produk..." />
        </div>
        <button class="bpom-search-btn" id="bpom-search-btn" style="margin-top:16px;">Cari Produk</button>

        <!-- Recent Checks -->
        <div class="recent-checks" style="margin-top: 24px;">
          <div class="section-title">Pengecekan Terakhir</div>
          <div id="recent-list"></div>
        </div>
      </div>
    `;

    // Generate barcode bars
    const barcodeGraphic = page.querySelector('#barcode-graphic');
    for (let i = 0; i < 30; i++) {
      const bar = document.createElement('div');
      bar.className = 'barcode-bar';
      bar.style.height = `${30 + Math.random() * 40}px`;
      bar.style.width = `${Math.random() > 0.5 ? 2 : 3}px`;
      barcodeGraphic.appendChild(bar);
    }

    // Recent checks
    const recentList = page.querySelector('#recent-list');
    bpomData.slice(0, 3).forEach(item => {
      const div = document.createElement('div');
      div.className = 'recent-item';
      div.innerHTML = `
        <div class="ri-icon">${icons.bpom}</div>
        <div class="ri-info">
          <div class="ri-name">${item.name}</div>
          <div class="ri-status">${item.status === 'registered' ? '✅ Terdaftar' : '❌ Tidak Ditemukan'}</div>
        </div>
      `;
      div.addEventListener('click', () => showResult(item));
      recentList.appendChild(div);
    });

    page.querySelector('#back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });

    page.querySelector('#bpom-search-btn').addEventListener('click', () => {
      const query = page.querySelector('#bpom-search-input').value.trim();
      if (query.length > 0) {
        startSearch(query);
      }
    });

    page.querySelector('#bpom-search-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query.length > 0) startSearch(query);
      }
    });
  }

  function startSearch(query) {
    // Show loading
    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Mencari...</h1>
      </div>
      <div class="bpom-loading anim-fade-in">
        <p class="shimmer-text" style="display:inline-block; background: linear-gradient(90deg, var(--text-tertiary), var(--primary), var(--text-tertiary)); background-size: 200% 100%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 2s infinite;">
          Mencari di database BPOM...
        </p>
        <div class="skeleton-cards">
          <div class="skeleton-card">
            <div class="sk-icon skeleton"></div>
            <div class="sk-lines">
              <div class="sk-line w-80 skeleton"></div>
              <div class="sk-line w-60 skeleton"></div>
            </div>
          </div>
          <div class="skeleton-card">
            <div class="sk-icon skeleton"></div>
            <div class="sk-lines">
              <div class="sk-line w-80 skeleton"></div>
              <div class="sk-line w-60 skeleton"></div>
            </div>
          </div>
          <div class="skeleton-card">
            <div class="sk-icon skeleton"></div>
            <div class="sk-lines">
              <div class="sk-line w-80 skeleton"></div>
              <div class="sk-line w-60 skeleton"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    page.querySelector('#back-btn').addEventListener('click', () => renderMain());

    // Find match or show not found
    setTimeout(() => {
      const match = bpomData.find(d =>
        d.name.toLowerCase().includes(query.toLowerCase())
      );
      showResult(match || { name: query, regNo: '-', manufacturer: 'Unknown', status: 'not-registered' });
    }, 2000);
  }

  function showResult(product) {
    const isRegistered = product.status === 'registered';

    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Hasil Produk</h1>
      </div>
      <div class="bpom-result anim-fade-in">
        <div style="text-align:center; margin-bottom:var(--space-lg);">
          <div class="bpom-status-badge ${isRegistered ? 'registered' : 'not-registered'}">
            ${isRegistered ? icons.check : icons.alert}
            ${isRegistered ? 'Terdaftar BPOM ✓' : 'Tidak Terdaftar ✗'}
          </div>
        </div>

        <div class="bpom-info-cards">
          <div class="bpom-info-card">
            <div class="info-label">Nama Produk</div>
            <div class="info-value">${product.name}</div>
          </div>
          <div class="bpom-info-card">
            <div class="info-label">Nomor Registrasi BPOM</div>
            <div class="info-value">${product.regNo}</div>
          </div>
          <div class="bpom-info-card">
            <div class="info-label">Produsen</div>
            <div class="info-value">${product.manufacturer}</div>
          </div>
          <div class="bpom-info-card">
            <div class="info-label">Status Produk</div>
            <div class="info-value" style="color: ${isRegistered ? 'var(--success)' : 'var(--danger)'};">
              ${isRegistered ? '✅ Terdaftar dan Terverifikasi' : '⚠️ Tidak Ditemukan di Database BPOM'}
            </div>
          </div>
        </div>

        <button class="bpom-search-btn" id="new-search-btn" style="margin-top:24px;">Cek Produk Lain</button>
      </div>
    `;

    page.querySelector('#back-btn').addEventListener('click', () => renderMain());
    page.querySelector('#new-search-btn').addEventListener('click', () => renderMain());
  }

  renderMain();
  return page;
}
