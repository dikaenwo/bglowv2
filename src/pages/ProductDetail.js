import { icons } from '../components/BottomNav.js';
import { getUserId, syncUserData } from '../utils/store.js';
import { showCustomAlert } from '../utils/helpers.js';

export function renderProductDetail() {
  const page = document.createElement('div');
  page.className = 'product-detail-page';

  const productDataStr = sessionStorage.getItem('bglow_selected_product');
  if (!productDataStr) {
    window.location.hash = '#/recommendations';
    return page;
  }

  const p = JSON.parse(productDataStr);

  const userId = getUserId();
  const favKey = 'bglow_favorites_' + userId;

  function getFavorites() {
    try {
      const data = localStorage.getItem(favKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function isFavorite(product) {
    const list = getFavorites();
    return list.some(item => item.name === product.name && item.brand === product.brand);
  }

  function toggleFavorite(product) {
    let list = getFavorites();
    const index = list.findIndex(item => item.name === product.name && item.brand === product.brand);
    let favorited = false;
    if (index >= 0) {
      list.splice(index, 1);
    } else {
      list.push(product);
      favorited = true;
    }
    localStorage.setItem(favKey, JSON.stringify(list));
    syncUserData({ favorites: JSON.stringify(list) });
    return favorited;
  }

  const heartOutline = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  const heartFill = `<svg viewBox="0 0 24 24" fill="#f43f5e" stroke="#f43f5e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

  const currentlyFav = isFavorite(p);
  const favBtnHtml = `
    <button class="pd-btn-fav ${currentlyFav ? 'active' : ''}" id="pd-btn-fav" title="Favorit">
      ${currentlyFav ? heartFill : heartOutline}
    </button>
  `;

  page.innerHTML = `
    <!-- Sticky Header -->
    <div class="page-header" style="justify-content: space-between;">
      <button class="back-btn" id="pd-back-btn">${icons.chevronLeft}</button>
      <h1 style="margin: 0; font-size: 1rem; font-weight: 700;">Detail Produk</h1>
      <div style="width:40px;"></div>
    </div>

    <!-- Scrollable Content -->
    <div class="pd-scroll-area">
      <div class="pd-hero-img" style="background:${p.bgColor}">
        <div class="pd-emoji">${p.emoji}</div>
      </div>

      <div class="pd-content">
        <div class="pd-price-lg">Rp ${p.price.toLocaleString()}</div>

        <div class="pd-title-section">
          <h2 class="pd-name">${p.name}</h2>
          <div class="pd-brand">${p.brand}</div>
        </div>

        <div class="pd-section">
          <h3 class="pd-section-title">Deskripsi</h3>
          <p class="pd-text">${p.desc}</p>
        </div>

        <div class="pd-section">
          <h3 class="pd-section-title">Ingredients Overview</h3>
          <p class="pd-text">
            Water, Glycerin, Sodium Cocoyl Glycinate, Lauryl Betaine, Hydroxypropyl Starch Phosphate,
            Citric Acid, PEG-60 Glyceryl Isostearate, Sodium Chloride, Glyceryl Stearate SE,
            Coco-Glucoside, Phenoxyethanol, Sodium Cocoyl Isethionate, Sodium Phytate,
            Ethylhexylglycerin, Polyquaternium-7, 1,2-Hexanediol, Quillaja Saponaria Bark Extract,
            Sodium Benzoate, Ceramide NP, Ceramide EOP, Hyaluronic Acid, Ceramide AP,
            Centella Asiatica Extract, Niacinamide, Ceramide AS, Panthenol, Ceramide NS.
          </p>
        </div>

        <div class="pd-section">
          <h3 class="pd-section-title">Ingredients Analysis 🔎</h3>
          <p class="pd-text-sm">Kandungan yang cocok untuk permasalahan kulit anda</p>

          <table class="pd-table">
            <thead>
              <tr>
                <th>Kandungan</th>
                <th>Manfaat</th>
                <th>Skor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ceramide</td>
                <td>memperkuat lapisan pelindung kulit (skin barrier)</td>
                <td class="text-center">1</td>
              </tr>
              <tr>
                <td>Niacinamide</td>
                <td>Niacinamide memperkuat fungsi penghalang kulit (skin barrier), membantu mengunci kelembapan</td>
                <td class="text-center">0.5</td>
              </tr>
              <tr>
                <td>Centella Asiatica</td>
                <td>menjaga kelembapan, mengurangi peradangan, mempercepat penyembuhan luka</td>
                <td class="text-center">0.5</td>
              </tr>
            </tbody>
          </table>

          <p class="pd-text-sm" style="margin-top: 16px;">Kandungan yang tidak cocok</p>
          <table class="pd-table table-danger">
            <thead>
              <tr>
                <th>Kandungan</th>
                <th>Efek Samping</th>
                <th>Skor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ethanol</td>
                <td>kulit menjadi kering, iritasi, kemerahan, dan perih</td>
                <td class="text-center">-2</td>
              </tr>
              <tr>
                <td>Fragrance</td>
                <td>iritasi kulit, reaksi alergi (dermatitis kontak), peradangan, kemerahan, gatal, bengkak, bahkan jerawat</td>
                <td class="text-center">-0.5</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pd-section">
          <h3 class="pd-section-title">Detail Perhitungan Bobot</h3>
          <p class="pd-text-sm"><b>Ingredients Order</b><br/>Di seluruh dunia (termasuk aturan BPOM dan FDA), urutan bahan pada label skincare wajib ditulis berdasarkan jumlah terbanyak → terdikit.</p>

          <table class="pd-table">
            <thead>
              <tr>
                <th>Posisi</th>
                <th>Bobot Skor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Utama (+)<br/>Utama (-)</td>
                <td class="text-center">1.0<br/>-2.0</td>
              </tr>
              <tr>
                <td>Menengah (+)<br/>Menengah (-)</td>
                <td class="text-center">0.5<br/>-1</td>
              </tr>
              <tr>
                <td>Minor (+)<br/>Minor (-)</td>
                <td class="text-center">0.2<br/>-0.5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Buttons -->
    <div class="pd-action-buttons">
      <button class="btn btn-primary pd-btn-buy">Dapatkan Produk</button>
      <button class="btn btn-outline pd-btn-routine">+ Tambah Ke Routine</button>
      ${favBtnHtml}
    </div>
  `;

  page.querySelector('#pd-back-btn').addEventListener('click', () => {
    window.history.back();
  });

  page.querySelector('.pd-btn-routine').addEventListener('click', () => {
    showAddToRoutineModal(p);
  });

  const favBtn = page.querySelector('#pd-btn-fav');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      const added = toggleFavorite(p);
      if (added) {
        favBtn.classList.add('active');
        favBtn.innerHTML = heartFill;
      } else {
        favBtn.classList.remove('active');
        favBtn.innerHTML = heartOutline;
      }
    });
  }

  function showAddToRoutineModal(product) {
    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal" style="text-align:center;">
        <div class="modal-handle"></div>
        <div style="font-size: 2rem; margin-bottom: 10px;">${product.emoji || '🧴'}</div>
        <h3 style="margin-bottom: 5px;">Tambah ke Rutinitas?</h3>
        <p style="font-size:0.9rem; color:var(--text-secondary); margin-bottom: 20px;">
          Ingin memasukkan <strong>${product.name}</strong> ke rutinitas yang mana?
        </p>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <button class="btn btn-outline btn-add-time" data-time="morning" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <img src="/pagi.png" alt="Pagi" style="width: 20px; height: 20px; object-fit: contain;" /> Pagi Hari
          </button>
          <button class="btn btn-outline btn-add-time" data-time="night" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <img src="/malam.png" alt="Malam" style="width: 20px; height: 20px; object-fit: contain;" /> Malam Hari
          </button>
          <button class="btn btn-primary btn-add-time" data-time="both" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
            <img src="/pagi.png" alt="Pagi" style="width: 20px; height: 20px; object-fit: contain; filter: brightness(0) invert(1);" /> & <img src="/malam.png" alt="Malam" style="width: 20px; height: 20px; object-fit: contain; filter: brightness(0) invert(1);" /> Keduanya
          </button>
        </div>
        <button class="btn" id="btn-cancel-add" style="margin-top: 15px; width: 100%; color:var(--text-secondary);">Batal</button>
      </div>
    `;

    overlay.querySelectorAll('.btn-add-time').forEach(btn => {
      btn.addEventListener('click', async () => {
        const time = btn.dataset.time;
        // dynamic import to avoid top level issues
        const { getRoutine, saveRoutine } = await import('../utils/store.js');
        const routine = getRoutine();
        
        const nameLower = product.name.toLowerCase();
        let catLabel = 'Pembersih'; // default fallback
        if (nameLower.includes('cleanser') || nameLower.includes('cleanse') || product.emoji === '🧴' || product.emoji === '🫧') {
          catLabel = 'Pembersih';
        } else if (nameLower.includes('moisture') || nameLower.includes('pelembab') || nameLower.includes('cream') || nameLower.includes('gel') || product.emoji === '🪴' || product.emoji === '💧' || product.emoji === '🐌') {
          catLabel = 'Pelembap';
        } else if (nameLower.includes('serum') || nameLower.includes('ampoule') || product.emoji === '✨' || product.emoji === '⚗️') {
          catLabel = 'Serum';
        } else if (nameLower.includes('sun') || nameLower.includes('spf') || nameLower.includes('uv') || product.emoji === '☀️' || product.emoji === '🌊' || product.emoji === '🛡️') {
          catLabel = 'Tabir Surya';
        } else if (nameLower.includes('toner') || nameLower.includes('essence') || product.emoji === '🌿' || product.emoji === '🍃' || product.emoji === '🌱') {
          catLabel = 'Toner';
        } else if (nameLower.includes('mask') || product.emoji === '🎭') {
          catLabel = 'Masker';
        } else if (nameLower.includes('exfoliat') || nameLower.includes('aha') || nameLower.includes('bha') || product.emoji === '🌟') {
          catLabel = 'Exfoliator';
        } else if (nameLower.includes('retinol') || product.emoji === '🌙') {
          catLabel = 'Retinol';
        } else if (nameLower.includes('eye') || product.emoji === '👁️') {
          catLabel = 'Eye Cream';
        }

        const newStep = {
          label: catLabel,
          product: product.name,
          brand: product.brand,
          emoji: product.emoji || '🧴',
          bg: product.bgColor || '#E3F2FD'
        };

        if (time === 'morning' || time === 'both') routine.morning.push(newStep);
        if (time === 'night' || time === 'both') routine.night.push(newStep);
        
        saveRoutine(routine);
        overlay.remove();
        
        showCustomAlert("Berhasil ditambahkan ke Rutinitas!", "Rutinitas Diperbarui");
      });
    });

    overlay.querySelector('#btn-cancel-add').addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  }

  return page;
}
