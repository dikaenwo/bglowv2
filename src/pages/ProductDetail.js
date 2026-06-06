import { icons } from '../components/BottomNav.js';

export function renderProductDetail() {
  const page = document.createElement('div');
  page.className = 'product-detail-page';

  const productDataStr = sessionStorage.getItem('bglow_selected_product');
  if (!productDataStr) {
    window.location.hash = '#/recommendations';
    return page;
  }

  const p = JSON.parse(productDataStr);

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
    </div>
  `;

  page.querySelector('#pd-back-btn').addEventListener('click', () => {
    window.history.back();
  });

  page.querySelector('.pd-btn-routine').addEventListener('click', () => {
    showAddToRoutineModal(p);
  });

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
          <button class="btn btn-outline btn-add-time" data-time="morning">🌅 Pagi Hari</button>
          <button class="btn btn-outline btn-add-time" data-time="night">🌙 Malam Hari</button>
          <button class="btn btn-primary btn-add-time" data-time="both">🌅 & 🌙 Keduanya</button>
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
        
        const newStep = {
          label: 'Produk Baru',
          product: product.name,
          brand: product.brand,
          emoji: product.emoji || '🧴',
          bg: product.bgColor || '#E3F2FD'
        };

        if (time === 'morning' || time === 'both') routine.morning.push(newStep);
        if (time === 'night' || time === 'both') routine.night.push(newStep);
        
        saveRoutine(routine);
        overlay.remove();
        
        alert("Berhasil ditambahkan ke Rutinitas!");
      });
    });

    overlay.querySelector('#btn-cancel-add').addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  }

  return page;
}
