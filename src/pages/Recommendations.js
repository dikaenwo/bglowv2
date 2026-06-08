import { icons } from '../components/BottomNav.js';
import { getUserId } from '../utils/store.js';

const cleanserIcon = `
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 32px; height: 32px;">
  <path d="M12 12 H26 L23 48 H15 L12 12 Z" fill="#DBEAFE" stroke="#2563EB" stroke-width="2.5" stroke-linejoin="round" />
  <path d="M14 20 H24" stroke="#2563EB" stroke-width="2" />
  <rect x="16" y="28" width="6" height="8" fill="white" stroke="#2563EB" stroke-width="1.8" />
  <rect x="17" y="48" width="4" height="6" fill="#93C5FD" stroke="#2563EB" stroke-width="1.8" />
  <rect x="25" y="32" width="26" height="22" rx="4" fill="#DBEAFE" stroke="#2563EB" stroke-width="2.5" />
  <rect x="28" y="26" width="20" height="6" rx="1.5" fill="#93C5FD" stroke="#2563EB" stroke-width="2.5" />
  <path d="M30 26 C30 20, 36 18, 38 22 C40 18, 46 20, 46 26" fill="#93C5FD" stroke="#2563EB" stroke-width="2" stroke-linecap="round" />
  <circle cx="38" cy="43" r="3" fill="white" stroke="#2563EB" stroke-width="1.8" />
</svg>
`;

const moisturizerIcon = `
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 32px; height: 32px;">
  <g transform="translate(38, 12) rotate(30)">
    <rect x="-14" y="-3" width="28" height="6" rx="1.5" fill="#6EE7B7" stroke="#059669" stroke-width="2.5" />
  </g>
  <path d="M22 34 C18 24, 38 18, 44 24 C50 18, 56 24, 52 34 Z" fill="#D1FAE5" stroke="#059669" stroke-width="2.5" stroke-linejoin="round" />
  <rect x="14" y="34" width="36" height="24" rx="5" fill="#D1FAE5" stroke="#059669" stroke-width="2.5" />
  <rect x="18" y="28" width="28" height="6" rx="1" fill="#6EE7B7" stroke="#059669" stroke-width="2.5" />
  <line x1="24" y1="46" x2="40" y2="46" stroke="#059669" stroke-width="2" stroke-linecap="round" />
</svg>
`;

const serumIcon = `
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 32px; height: 32px;">
  <rect x="25" y="16" width="14" height="8" rx="2" fill="#C4B5FD" stroke="#7C3AED" stroke-width="2.5" />
  <path d="M29 16 L29 10 C29 7, 35 7, 35 10 L35 16" fill="#EDE9FE" stroke="#7C3AED" stroke-width="2.5" />
  <path d="M19 28 C19 24, 45 24, 45 28 L45 56 C45 60, 19 60, 19 56 Z" fill="#EDE9FE" stroke="#7C3AED" stroke-width="2.5" stroke-linejoin="round" />
  <rect x="22" y="24" width="20" height="4" fill="#C4B5FD" stroke="#7C3AED" stroke-width="2" />
  <g transform="translate(36, 38)">
    <path d="M8 8 Q18 0, 20 14 Q10 18, 8 8 Z" fill="#C4B5FD" stroke="#7C3AED" stroke-width="2" stroke-linejoin="round" />
    <path d="M8 8 L16 12" stroke="#7C3AED" stroke-width="1.5" />
    <path d="M0 18 Q12 12, 18 22 Q6 28, 0 18 Z" fill="#C4B5FD" stroke="#7C3AED" stroke-width="2" stroke-linejoin="round" />
    <path d="M0 18 L12 22" stroke="#7C3AED" stroke-width="1.5" />
  </g>
</svg>
`;

const sunscreenIcon = `
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 32px; height: 32px;">
  <rect x="20" y="14" width="24" height="7" rx="1.5" fill="#FCD34D" stroke="#D97706" stroke-width="2.5" />
  <rect x="15" y="21" width="34" height="32" rx="6" fill="#FEF3C7" stroke="#D97706" stroke-width="2.5" />
  <g transform="translate(32, 38)">
    <path d="M-4 6 L4 -6" stroke="#D97706" stroke-width="2" stroke-linecap="round" />
    <path d="M-3 0 Q-10 -4, -7 -10 Q-1 -7, -3 0 Z" fill="#FCD34D" stroke="#D97706" stroke-width="1.8" />
    <path d="M1 -2 Q8 -6, 9 0 Q2 3, 1 -2 Z" fill="#FCD34D" stroke="#D97706" stroke-width="1.8" />
  </g>
</svg>
`;

const exfoliationIcon = `
<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 32px; height: 32px;">
  <path d="M12 18 L28 21 L22 56 L11 54 Z" fill="#F9A8D4" stroke="#DB2777" stroke-width="2.5" stroke-linejoin="round" />
  <line x1="12" y1="26" x2="26" y2="29" stroke="#DB2777" stroke-width="2" />
  <ellipse cx="44" cy="42" rx="17" ry="18" fill="#FCE7F3" stroke="#DB2777" stroke-width="2.5" />
  <ellipse cx="37" cy="39" rx="3" ry="2" fill="white" stroke="#DB2777" stroke-width="1.8" />
  <ellipse cx="51" cy="39" rx="3" ry="2" fill="white" stroke="#DB2777" stroke-width="1.8" />
  <ellipse cx="44" cy="51" rx="3" ry="1.5" fill="white" stroke="#DB2777" stroke-width="1.8" />
</svg>
`;

const categories = [
  { id: 'cleanser', label: 'Cleansers', icon: cleanserIcon, colorClass: 'cat-cleanser' },
  { id: 'moisturizer', label: 'Pelembab', icon: moisturizerIcon, colorClass: 'cat-moisturizer' },
  { id: 'serum', label: 'Serum', icon: serumIcon, colorClass: 'cat-serum' },
  { id: 'sunscreen', label: 'Sunscreen', icon: sunscreenIcon, colorClass: 'cat-sunscreen' },
  { id: 'toner', label: 'Eksfoliasi', icon: exfoliationIcon, colorClass: 'cat-exfoliation' },
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
      <div class="page-header" style="margin-bottom: 8px; justify-content: center;">
        <h1 style="text-align: center; width: 100%;">Rekomendasi ${categories.find(c => c.id === currentCat)?.label || ''}</h1>
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
          <button class="reco-cat ${c.colorClass} ${c.id === currentCat ? 'active' : ''}" data-cat="${c.id}">
            <div class="cat-icon">${c.icon}</div>
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
              <button class="product-cta btn-detail" data-idx="${i}">Lihat Detail</button>
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



    // Product detail
    page.querySelectorAll('.btn-detail').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        const product = products[idx];
        sessionStorage.setItem('bglow_selected_product', JSON.stringify(product));
        window.location.hash = '#/product-detail';
      });
    });
  }

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

  render();
  return page;
}
