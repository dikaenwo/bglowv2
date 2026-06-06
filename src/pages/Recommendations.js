import { icons } from '../components/BottomNav.js';
<<<<<<< HEAD
import { getUserId } from '../utils/store.js';
=======
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229

const categories = [
  { id: 'cleanser', label: 'Pembersih', emoji: '🧴' },
  { id: 'moisturizer', label: 'Pelembap', emoji: '💧' },
  { id: 'serum', label: 'Serum', emoji: '✨' },
  { id: 'sunscreen', label: 'Tabir Surya', emoji: '☀️' },
  { id: 'toner', label: 'Toner', emoji: '🌿' },
];

const productData = {
  cleanser: [
    { name: 'Gentle Hydrating Cleanser', brand: 'Skintific', rating: 4.5, price: 89000, emoji: '🧴', match: 95, desc: 'A gentle, pH-balanced cleanser with 5X Ceramide Complex that effectively removes dirt and impurities without stripping the skin barrier.', ingredients: ['Ceramide NP', 'Hyaluronic Acid', 'Centella Asiatica', 'Niacinamide'], bgColor: '#E8F5E9' },
    { name: 'Low pH Gel Cleanser', brand: 'COSRX', rating: 4.7, price: 125000, emoji: '🫧', match: 92, desc: 'Mild cleanser with tea tree oil that calms acne-prone skin while maintaining optimal pH level of 5.5.', ingredients: ['Tea Tree Oil', 'Betaine Salicylate', 'Allantoin'], bgColor: '#E3F2FD' },
    { name: 'Centella Cleansing Gel', brand: 'Skin1004', rating: 4.3, price: 95000, emoji: '🌱', match: 88, desc: 'Soothing gel cleanser infused with Centella Asiatica extract for sensitive and irritated skin.', ingredients: ['Centella Asiatica', 'Green Tea', 'Aloe Vera'], bgColor: '#F1F8E9' },
    { name: 'Rice Water Cleanser', brand: 'Somethinc', rating: 4.4, price: 79000, emoji: '🍚', match: 85, desc: 'Brightening cleanser with fermented rice water that gently exfoliates and evens out skin tone.', ingredients: ['Rice Ferment', 'Niacinamide', 'Vitamin C'], bgColor: '#FFFDE7' },
  ],
  moisturizer: [
    { name: '5X Ceramide Barrier Gel', brand: 'Skintific', rating: 4.6, price: 145000, emoji: '💧', match: 96, desc: 'Lightweight gel moisturizer packed with 5 types of ceramides to strengthen skin barrier and lock in moisture.', ingredients: ['Ceramide EOP', 'Ceramide NP', 'Hyaluronic Acid', 'Squalane'], bgColor: '#E1F5FE' },
    { name: 'Aloe Vera Moisture Gel', brand: 'Nature Republic', rating: 4.2, price: 65000, emoji: '🪴', match: 82, desc: 'Multi-purpose gel with 92% aloe vera to soothe and hydrate dry, irritated skin.', ingredients: ['Aloe Vera', 'Carbomer', 'Glycerin'], bgColor: '#E8F5E9' },
    { name: 'Snail Repair Cream', brand: 'COSRX', rating: 4.8, price: 185000, emoji: '🐌', match: 90, desc: 'Rich cream with 92% snail mucin for intense repair and moisture. Great for acne scars and fine lines.', ingredients: ['Snail Secretion', 'Shea Butter', 'Adenosine'], bgColor: '#FFF3E0' },
    { name: 'Cica Moisture Cream', brand: 'Wardah', rating: 4.1, price: 55000, emoji: '🌿', match: 78, desc: 'Calming moisturizer with Centella Asiatica for redness-prone and sensitive skin.', ingredients: ['Centella Asiatica', 'Panthenol', 'Allantoin'], bgColor: '#F1F8E9' },
  ],
  serum: [
    { name: '10% Niacinamide Serum', brand: 'Somethinc', rating: 4.7, price: 99000, emoji: '✨', match: 97, desc: 'Powerful brightening serum with 10% Niacinamide + Zinc to minimize pores, reduce oiliness, and fade dark spots.', ingredients: ['Niacinamide 10%', 'Zinc PCA', 'Hyaluronic Acid'], bgColor: '#E8EAF6' },
    { name: 'AHA BHA Serum', brand: 'Avoskin', rating: 4.5, price: 135000, emoji: '⚗️', match: 88, desc: 'Exfoliating serum with alpha and beta hydroxy acids for smoother, clearer skin. Great for unclogging pores.', ingredients: ['Glycolic Acid', 'Salicylic Acid', 'Lactic Acid'], bgColor: '#FCE4EC' },
    { name: 'Hyaluronic Acid 2%', brand: 'The Ordinary', rating: 4.6, price: 115000, emoji: '💎', match: 91, desc: 'Hydration serum with multi-weight hyaluronic acid for deep, lasting moisture.', ingredients: ['HA Low MW', 'HA High MW', 'Vitamin B5'], bgColor: '#E1F5FE' },
    { name: 'Vitamin C Serum', brand: 'Lacoco', rating: 4.3, price: 89000, emoji: '🍊', match: 84, desc: 'Antioxidant serum with stable Vitamin C derivative for brightening and protecting skin from UV damage.', ingredients: ['Ascorbyl Glucoside', 'Vitamin E', 'Ferulic Acid'], bgColor: '#FFF8E1' },
  ],
  sunscreen: [
    { name: 'UV Shield SPF 50', brand: 'Wardah', rating: 4.4, price: 48000, emoji: '☀️', match: 93, desc: 'Lightweight sunscreen with broad-spectrum SPF 50 PA++++ protection. Non-greasy formula suitable for daily use.', ingredients: ['Zinc Oxide', 'Titanium Dioxide', 'Niacinamide', 'Aloe Vera'], bgColor: '#FFFDE7' },
    { name: 'Aqua Sun Gel SPF 50', brand: 'Skin Aqua', rating: 4.7, price: 55000, emoji: '🌊', match: 95, desc: 'Water-based gel sunscreen that feels like skincare. Ultra-light with moisture-boosting hyaluronic acid.', ingredients: ['HA', 'Collagen', 'Vitamin E'], bgColor: '#E0F7FA' },
    { name: 'Tone Up Sunscreen', brand: 'Emina', rating: 4.0, price: 35000, emoji: '🪞', match: 80, desc: 'Sunscreen with tone-up effect for instant brightening while protecting from UV rays.', ingredients: ['SPF 30', 'Niacinamide', 'Vitamin C'], bgColor: '#FCE4EC' },
    { name: 'Cica Sun Essence', brand: 'Skintific', rating: 4.6, price: 89000, emoji: '🛡️', match: 91, desc: 'Soothing sun essence with Cica complex for sensitive skin. Calms and protects simultaneously.', ingredients: ['Centella', 'SPF 50', 'Zinc', 'Ceramide'], bgColor: '#E8F5E9' },
  ],
  toner: [
    { name: 'AHA/BHA Toner', brand: 'COSRX', rating: 4.5, price: 145000, emoji: '🌿', match: 89, desc: 'Gentle exfoliating toner with natural BHA from willow bark water. Minimizes pores and prevents breakouts.', ingredients: ['Willow Bark Water', 'AHA', 'BHA'], bgColor: '#F1F8E9' },
    { name: 'Mugwort Essence Toner', brand: 'Isntree', rating: 4.6, price: 165000, emoji: '🍃', match: 86, desc: 'Calming toner with 100% mugwort extract for soothing irritated, redness-prone skin.', ingredients: ['Mugwort Extract', 'Panthenol', 'Allantoin'], bgColor: '#E8F5E9' },
    { name: 'Hyaluronic Toner', brand: 'Hada Labo', rating: 4.4, price: 75000, emoji: '💦', match: 90, desc: 'Hydrating toner with 4 types of hyaluronic acid for intense multi-layer hydration.', ingredients: ['HA 4 Types', 'Glycerin', 'Ceramide'], bgColor: '#E1F5FE' },
    { name: 'Green Tea Toner', brand: 'Innisfree', rating: 4.3, price: 125000, emoji: '🍵', match: 83, desc: 'Antioxidant-rich toner with fresh Jeju green tea for oil control and pore care.', ingredients: ['Green Tea', 'Amino Acids', 'Betaine'], bgColor: '#E8F5E9' },
  ],
};

export function renderRecommendations() {
  const page = document.createElement('div');
  page.className = 'page';
<<<<<<< HEAD
  
  const hasScanned = localStorage.getItem('bglow_has_scanned_' + getUserId());
  if (!hasScanned) {
    page.innerHTML = `
      <div class="empty-state anim-fade-in" style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:80vh;padding:20px;text-align:center;">
        <div style="font-size:5rem;margin-bottom:24px;color:var(--primary);">${icons.brain || '🤖'}</div>
        <h2 style="margin-bottom:12px;">Belum Ada Rekomendasi</h2>
        <p style="color:var(--text-secondary);margin-bottom:32px;line-height:1.6;font-size:0.95rem;">
          Sistem belum mengetahui kondisi kulit Anda. Lakukan Scan AI wajah terlebih dahulu untuk mendapatkan kurasi produk yang paling cocok dengan kebutuhan Anda.
        </p>
        <button class="btn btn-primary" id="go-scan-btn" style="width:100%;padding:14px;border-radius:12px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;">
          Mulai Scan AI
        </button>
      </div>
    `;
    setTimeout(() => {
      const btn = page.querySelector('#go-scan-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          window.location.hash = '#/scan';
        });
      }
    }, 0);
    return page;
  }

=======
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229
  let currentCat = 'cleanser';
  let filterMin = null;
  let filterMax = null;

  function render() {
    let products = productData[currentCat] || [];
    
    if (filterMin !== null) {
      products = products.filter(p => p.price >= filterMin);
    }
    if (filterMax !== null) {
      products = products.filter(p => p.price <= filterMax);
    }

    page.innerHTML = `
<<<<<<< HEAD
      <div class="page-header" style="margin-bottom: 8px; justify-content: center;">
        <h1 style="text-align: center; width: 100%;">Rekomendasi ${categories.find(c => c.id === currentCat)?.label || ''}</h1>
=======
      <div class="page-header" style="margin-bottom: 8px;">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Rekomendasi ${categories.find(c => c.id === currentCat)?.label || ''}</h1>
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229
      </div>

      <!-- Price Filter -->
      <div class="price-filter-container anim-fade-in">
        <div class="filter-label">Filter range harga</div>
        <div class="price-filter-bar">
          <input type="number" class="price-input" placeholder="Rp. 0" id="min-price" value="${filterMin || ''}">
          <span class="price-separator">—</span>
          <input type="number" class="price-input" placeholder="Rp. 150000" id="max-price" value="${filterMax || ''}">
          <button class="btn-terapkan" id="btn-apply-filter">Terapkan</button>
        </div>
      </div>

      <!-- Category Tabs -->
      <div class="reco-categories" id="cat-tabs">
        ${categories.map(c => `
          <button class="reco-cat ${c.id === currentCat ? 'active' : ''}" data-cat="${c.id}">
            <div class="cat-icon">${c.emoji}</div>
            <span class="cat-label">${c.label}</span>
          </button>
        `).join('')}
      </div>

      <!-- Product Grid -->
      <div class="product-grid" id="product-grid">
        ${products.map((p, i) => `
          <div class="product-card" data-idx="${i}">
            <div class="product-img" style="background:${p.bgColor}">
              <div class="img-placeholder">${p.emoji}</div>
              ${p.match >= 90 ? `<div class="product-match-badge">${p.match}% Match</div>` : ''}
            </div>
            <div class="product-info">
              <div class="product-name">${p.name}</div>
              <div class="product-brand">${p.brand}</div>
              <div class="product-rating">
                <span class="stars">${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 ? '½' : ''}</span>
                <span class="rating-num">(${p.rating})</span>
              </div>
              <div class="product-price">Rp${p.price.toLocaleString()}</div>
<<<<<<< HEAD
              <button class="product-cta btn-detail" data-idx="${i}">Lihat Detail</button>
=======
              <button class="product-cta">Lihat Detail</button>
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // Category tabs
    page.querySelectorAll('.reco-cat').forEach(tab => {
      tab.addEventListener('click', () => {
        currentCat = tab.dataset.cat;
        filterMin = null;
        filterMax = null;
        render();
      });
    });

    // Apply filter
    page.querySelector('#btn-apply-filter')?.addEventListener('click', () => {
      const minVal = page.querySelector('#min-price').value;
      const maxVal = page.querySelector('#max-price').value;
      
      filterMin = minVal ? parseInt(minVal) : null;
      filterMax = maxVal ? parseInt(maxVal) : null;
      render();
    });

<<<<<<< HEAD


    // Product detail
    page.querySelectorAll('.btn-detail').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
=======
    // Back button
    page.querySelector('#back-btn').addEventListener('click', () => {
      window.location.hash = '#/scan';
    });

    // Product cards → detail page
    page.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.idx);
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229
        const product = products[idx];
        sessionStorage.setItem('bglow_selected_product', JSON.stringify(product));
        window.location.hash = '#/product-detail';
      });
    });
  }

<<<<<<< HEAD
  function showAddToRoutineModal(product) {
    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal" style="text-align:center;">
        <div class="modal-handle"></div>
        <div style="font-size: 2rem; margin-bottom: 10px;">${product.emoji}</div>
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
        // dynamic import of store to avoid top-level issues if any
        const { getRoutine, saveRoutine } = await import('../utils/store.js');
        const routine = getRoutine();
        
        const catObj = categories.find(c => c.id === currentCat);
        const newStep = {
          label: catObj ? catObj.label : 'Produk',
          product: product.name,
          brand: product.brand,
          emoji: product.emoji,
          bg: product.bgColor
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
=======
>>>>>>> 221ed206d3114e292a0efe6041cbc8b13e7fd229

  render();
  return page;
}
