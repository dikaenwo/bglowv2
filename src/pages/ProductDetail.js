import { icons } from '../components/BottomNav.js';
import { getUserId, syncUserData, getAuthHeaders } from '../utils/store.js';
import { showCustomAlert } from '../utils/helpers.js';
import { API_BASE_URL } from '../config.js';

// ─── Badge icon mapping ───────────────────────────────────────────────────────
const BADGE_ICONS = {
  'acne fighter':      '🎯',
  'brightening':       '✨',
  'hydrating':         '💧',
  'antioxidant':       '🛡️',
  'niacinamide':       '🧬',
  'vitamin c':         '🍊',
  'exfoliant':         '🔬',
  'peptide':           '⚗️',
  'ceramide':          '🧱',
  'retinoid':          '🌙',
  'bha':               '🔬',
  'aha':               '🔬',
  'urea':              '💧',
  'zinc':              '🔩',
  'fragrance':         '⚠️',
  'sulfate':           '⚠️',
  'preservative':      '🧪',
  'oil':               '🫧',
  'coconut derived':   '🥥',
  'eu allergen':       '⚠️',
  'may feed fungal acne': '🍄',
  'reduces redness':   '🩹',
  'reduces irritation': '🩹',
  'good for oily skin': '💦',
  'good for texture':  '🪄',
  'reduces large pores': '🔎',
  'helps with dark spots': '🌑',
  'good for scar healing': '💚',
  'helps with barrier repair': '🧱',
  'helps with anti-aging': '⏳',
};

function getBadgeIcon(badgeText) {
  const lower = badgeText.toLowerCase();
  for (const [key, icon] of Object.entries(BADGE_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '🏷️';
}

// ─── Status colors ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  'positif':  { color: '#16a34a', bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)',  icon: '✓', label: 'Cocok' },
  'negatif':  { color: '#dc2626', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  icon: '✗', label: 'Hindari' },
  'campuran': { color: '#d97706', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', icon: '◐', label: 'Campuran' },
  'netral':   { color: '#6b7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.15)', icon: '·', label: 'Netral' },
};



const fallbackBottleIcon = `<svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.6;"><path d="M12 2v4M8 6h8v14a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6z"/></svg>`;

function getDefaultMockReviews(kategori, productName) {
  return [];
}

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

  let reviews = [];

  function getUserProfileString(uid) {
    const skinType = localStorage.getItem('bglow_skin_type_' + uid) || 'Normal';
    const priority = localStorage.getItem('bglow_journey_priority_' + uid);
    if (priority) {
      return `Kulit ${skinType} | Goal: ${priority}`;
    }
    return `Kulit ${skinType}`;
  }


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

  // ── WSM Data ────────────────────────────────────────────────────────────────
  const wsmDetail = p.wsm_detail || {};
  const wsmScore = p.score || 0;
  const wsmPercent = Math.round(wsmScore * 100);
  const kategoriRek = p.kategori_rekomendasi || 'Tidak Direkomendasikan';
  const analysis = p.ingredients_analysis || [];

  // Separate positive, negative, neutral ingredients
  const positifList = analysis.filter(a => a.status === 'positif' || a.status === 'campuran');
  const negatifList = analysis.filter(a => a.status === 'negatif' || a.status === 'campuran');

  // WSM bar color
  const wsmBarColor = wsmPercent >= 75 ? '#22c55e' : wsmPercent >= 50 ? '#eab308' : '#ef4444';
  const wsmBadgeBg = wsmPercent >= 75 ? 'rgba(34,197,94,0.12)' : wsmPercent >= 50 ? 'rgba(251,191,36,0.12)' : 'rgba(239,68,68,0.1)';
  const wsmBadgeColor = wsmPercent >= 75 ? '#16a34a' : wsmPercent >= 50 ? '#d97706' : '#dc2626';



  // Build ingredients analysis rows
  function renderIngRow(a) {
    const st = STATUS_CONFIG[a.status] || STATUS_CONFIG['netral'];
    const badges = (a.badge || '').split(' | ').filter(b => b.trim());
    const badgeHtml = badges.slice(0, 4).map(b =>
      `<span class="pd-ing-badge" style="color:${st.color};border-color:${st.border};background:${st.bg};">${b.trim()}</span>`
    ).join('');

    const bucketLabel = { 'awal': 'Awal', 'tengah': 'Tengah', 'akhir': 'Akhir' }[a.bucket] || a.bucket;

    return `
      <div class="pd-ing-row" style="border-left: 3px solid ${st.color};">
        <div class="pd-ing-header">
          <span class="pd-ing-name">${a.name}</span>
          <span class="pd-ing-status-pill" style="background:${st.bg};color:${st.color};border:1px solid ${st.border};">${st.icon} ${st.label}</span>
        </div>
        ${badgeHtml ? `<div class="pd-ing-badges">${badgeHtml}</div>` : ''}
        ${a.deskripsi ? `<div class="pd-ing-meta"><span class="pd-ing-desc">${a.deskripsi}</span></div>` : ''}
      </div>
    `;
  }

  // Get ingredients lists
  const allIngs = [...positifList, ...negatifList, ...analysis.filter(a => a.status === 'netral')];

  page.innerHTML = `
    <!-- Sticky Header -->
    <div class="page-header" style="justify-content: space-between;">
      <button class="back-btn" id="pd-back-btn">${icons.chevronLeft}</button>
      <h1 style="margin: 0; font-size: 1rem; font-weight: 700;">Detail Produk</h1>
      <div style="width:40px;"></div>
    </div>

    <!-- Scrollable Content -->
    <div class="pd-scroll-area">
      <div class="pd-hero-img" style="background:${p.bgColor}; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative;">
        ${p.image_url && p.image_url !== 'nan'
          ? `<img src="${p.image_url}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:20px;" onerror="this.style.display='none';this.nextElementSibling.style.display='block';" />
             <div class="pd-svg-fallback" style="display:none; color: var(--text-secondary); opacity: 0.7; height: 48px; width: 48px;">${fallbackBottleIcon}</div>`
          : `<div class="pd-svg-fallback" style="color: var(--text-secondary); opacity: 0.7; height: 48px; width: 48px;">${fallbackBottleIcon}</div>`
        }
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

        <!-- Ingredients Analysis (Dynamic) -->
        ${allIngs.length > 0 ? `
        <div class="pd-section">
          <h3 class="pd-section-title">Analisis Ingredien</h3>
          <p class="pd-text-sm" style="margin-bottom:12px;">Berdasarkan jenis kulit & masalah kulit Anda, berikut analisis ingredien produk ini:</p>

          ${allIngs.slice(0, 5).map(a => renderIngRow(a)).join('')}
          
          ${allIngs.length > 5 ? `
            <div class="ing-list-more" style="display:none;">
              ${allIngs.slice(5).map(a => renderIngRow(a)).join('')}
            </div>
            <button class="pd-show-all-btn" id="show-all-ings-btn">Tampilkan Semua (${allIngs.length})</button>
          ` : ''}
        </div>
        ` : `
        <div class="pd-section">
          <h3 class="pd-section-title">Analisis Ingredien</h3>
          <p class="pd-text-sm">Tidak ada data analisis ingredien untuk produk ini.</p>
        </div>
        `}

        <!-- Review Section -->
        <div class="pd-section reviews-section" style="border-top: 1px solid var(--border-light); padding-top: var(--space-lg); margin-top: var(--space-lg);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 class="pd-section-title" style="margin-bottom: 0;">Review Pengguna</h3>
            <button class="btn-tulis-review" id="btn-open-review-form" style="background: none; border: none; color: var(--primary); font-weight: 600; font-size: var(--font-sm); cursor: pointer; display: flex; align-items: center; gap: 4px; padding: 0;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              Tulis Review
            </button>
          </div>
          
          <div id="reviews-container-wrap"></div>
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

  // Buy button → open product link
  page.querySelector('.pd-btn-buy').addEventListener('click', () => {
    if (p.link && p.link !== 'nan' && p.link.startsWith('http')) {
      window.open(p.link, '_blank');
    } else {
      showCustomAlert('Link produk tidak tersedia.', 'Info');
    }
  });

  page.querySelector('.pd-btn-routine').addEventListener('click', () => {
    showAddToRoutineModal(p);
  });

  // Show All logic
  page.querySelector('#show-all-ings-btn')?.addEventListener('click', (e) => {
    page.querySelector('.ing-list-more').style.display = 'block';
    e.target.style.display = 'none';
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
        <div style="width: 60px; height: 60px; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px; background: ${product.bgColor || '#F1F5F9'}">
          ${product.image_url && product.image_url !== 'nan'
            ? `<img src="${product.image_url}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover;" />`
            : fallbackBottleIcon
          }
        </div>
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
            <img src="/pagi.png" alt="Pagi" style="width: 20px; height: 20px; object-fit: contain; filter: brightness(0) invert(1);" />
            &
            <img src="/malam.png" alt="Malam" style="width: 20px; height: 20px; object-fit: contain; filter: brightness(0) invert(1);" />
            Keduanya
          </button>
        </div>
        <button class="btn" id="btn-cancel-add" style="margin-top: 15px; width: 100%; color:var(--text-secondary);">Batal</button>
      </div>
    `;

    overlay.querySelectorAll('.btn-add-time').forEach(btn => {
      btn.addEventListener('click', async () => {
        const time = btn.dataset.time;
        const { getRoutine, saveRoutine } = await import('../utils/store.js');
        const routine = getRoutine();
        
        const nameLower = product.name.toLowerCase();
        let catLabel = 'Pembersih';
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

  // ── Initialize Reviews and Bind Events ──
  const usersIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-secondary);"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
  const thumbUpIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--success);"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>`;
  const editBigIcon = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-tertiary); opacity: 0.8; margin-bottom: 8px;"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`;

  function updateReviewsDOM() {
    const totalReviews = reviews.length;
    const totalStars = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgScore = totalReviews > 0 ? (totalStars / totalReviews).toFixed(1) : '0.0';
    
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      starCounts[r.rating] = (starCounts[r.rating] || 0) + 1;
    });
    
    const recommendedCount = reviews.filter(r => r.recommends).length;
    const recoPercent = totalReviews > 0 ? Math.round((recommendedCount / totalReviews) * 100) : 0;

    const reviewsListHtml = totalReviews > 0
      ? reviews.map(rev => `
      <div class="review-item-card" style="background: var(--bg-card); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: var(--space-md); display: flex; flex-direction: column; gap: 8px; text-align: left; box-shadow: var(--shadow-sm);">
        <div style="display: flex; gap: 10px; align-items: center;">
          <div style="width: 36px; height: 36px; border-radius: var(--radius-full); background: var(--bg-soft); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary); border: 1px solid var(--border); font-size: 1rem; flex-shrink: 0;">
            ${rev.name.charAt(0).toUpperCase()}
          </div>
          <div style="display: flex; flex-direction: column; flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
              <span style="font-size: var(--font-sm); font-weight: 700; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${rev.name}</span>
              <span style="font-size: var(--font-xs); color: var(--text-tertiary); flex-shrink: 0;">${rev.date}</span>
            </div>
            <span style="font-size: var(--font-xs); color: var(--text-secondary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${rev.profile || 'General User'}</span>
          </div>
        </div>
        
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: var(--font-xs);">
          <div style="color: #f59e0b;">
            ${'★'.repeat(rev.rating)}${'☆'.repeat(5 - rev.rating)}
          </div>
          ${rev.recommends
            ? `<span style="color: var(--success); font-weight: 600; display: flex; align-items: center; gap: 4px;">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                 Merekomendasikan
               </span>`
            : `<span style="color: var(--danger); font-weight: 600; display: flex; align-items: center; gap: 4px;">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                 Tidak merekomendasikan
               </span>`
          }
        </div>
        
        <p style="font-size: var(--font-sm); color: var(--text-secondary); line-height: 1.5; margin: 0; white-space: pre-wrap;">${rev.comment}</p>
      </div>
    `).join('')
      : `
        <div class="empty-reviews-state" style="text-align: center; padding: 24px 16px; color: var(--text-secondary); background: var(--bg-soft); border-radius: var(--radius-md); border: 1px dashed var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center;">
          ${editBigIcon}
          <div style="font-weight: 700; margin-bottom: 4px; color: var(--text-primary); font-size: var(--font-sm);">Belum Ada Ulasan</div>
          <div style="font-size: var(--font-xs);">Jadilah yang pertama memberikan ulasan untuk produk ini!</div>
        </div>
      `;

    const container = page.querySelector('#reviews-container-wrap');
    if (container) {
      container.innerHTML = `
        <div class="review-summary-card" style="display: flex; background: var(--bg-soft); border-radius: var(--radius-lg); padding: var(--space-md); gap: 16px; margin-bottom: 16px; border: 1px solid var(--border-light); text-align: left;">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 40%; border-right: 1px solid var(--border-light); padding-right: 8px;">
            <span style="font-size: 3rem; font-weight: 800; color: var(--text-primary); line-height: 1;">${avgScore}</span>
            <div style="color: #f59e0b; font-size: 1.1rem; margin-top: var(--space-xs); margin-bottom: var(--space-xs);">
              ${'★'.repeat(Math.round(avgScore))}${'☆'.repeat(5 - Math.round(avgScore))}
            </div>
            <span style="font-size: var(--font-xs); color: var(--text-secondary); text-align: center;">${totalReviews} Ulasan</span>
          </div>
          
          <div style="flex: 1; display: flex; flex-direction: column; gap: 4px; justify-content: center;">
            ${[5, 4, 3, 2, 1].map(stars => {
              const count = starCounts[stars] || 0;
              const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
              return `
                <div style="display: flex; align-items: center; gap: 8px; font-size: var(--font-xs); color: var(--text-secondary);">
                  <span style="width: 10px; text-align: right; font-weight: 500;">${stars}</span>
                  <div style="flex: 1; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden;">
                    <div style="height: 100%; width: ${percent}%; background: #f59e0b; border-radius: 3px;"></div>
                  </div>
                  <span style="width: 25px; text-align: left;">${count}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        
        <div class="review-stats-card" style="display: flex; background: var(--bg-soft); border-radius: var(--radius-md); padding: var(--space-sm) var(--space-md); justify-content: space-between; align-items: center; margin-bottom: 16px; border: 1px solid var(--border-light); font-size: var(--font-xs); color: var(--text-secondary); text-align: left;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>${usersIcon}</span>
            <div>
              <strong style="color: var(--text-primary);">${totalReviews} Pengguna</strong>
              <div>Telah mereview</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span>${thumbUpIcon}</span>
            <div>
              <strong style="color: var(--text-primary);">${recoPercent}% Pengguna</strong>
              <div>Merekomendasikan</div>
            </div>
          </div>
        </div>

        <div class="review-list" style="display: flex; flex-direction: column; gap: 12px;">
          ${reviewsListHtml}
        </div>
      `;
    }
  }

  // Populate initially
  setTimeout(() => {
    updateReviewsDOM();

    // Bind event for Tulis Review button
    const openReviewBtn = page.querySelector('#btn-open-review-form');
    if (openReviewBtn) {
      openReviewBtn.addEventListener('click', () => {
        const reviewOverlay = document.createElement('div');
        reviewOverlay.className = 'diary-modal-overlay';
        reviewOverlay.style.zIndex = '99999';
        reviewOverlay.innerHTML = `
          <div class="diary-modal" style="text-align:left; max-height: 90vh; overflow-y: auto; padding: 20px;">
            <div class="modal-handle" style="margin-left: auto; margin-right: auto; margin-bottom: 15px;"></div>
            <h3 style="margin-bottom: 8px; text-align: center; font-size: 1.15rem; font-weight: 700;">Tulis Review Produk</h3>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom: 20px; text-align: center; line-height: 1.4;">
              Bagikan pengalaman Anda menggunakan <strong>${p.name}</strong>
            </p>
            
            <form id="review-form" style="display:flex; flex-direction:column; gap:16px;">
              <!-- Star Rating Picker -->
              <div>
                <label style="font-weight:600; font-size:0.875rem; color:var(--text-primary); display:block; margin-bottom:6px;">Rating Anda</label>
                <div class="star-rating-picker" style="display:flex; gap:12px; font-size:2rem; color: var(--text-tertiary); cursor:pointer; line-height: 1; width: fit-content;">
                  <span data-val="1">★</span>
                  <span data-val="2">★</span>
                  <span data-val="3">★</span>
                  <span data-val="4">★</span>
                  <span data-val="5">★</span>
                </div>
                <input type="hidden" id="review-rating" value="0" />
              </div>

              <!-- Recommendation Option -->
              <div>
                <label style="font-weight:600; font-size:0.875rem; color:var(--text-primary); display:block; margin-bottom:6px;">Apakah Anda merekomendasikan produk ini?</label>
                <div style="display:flex; gap:20px;">
                  <label style="display:flex; align-items:center; gap:6px; font-size:0.875rem; cursor:pointer;">
                    <input type="radio" name="review-recommends" value="true" checked style="accent-color: var(--primary); transform: scale(1.1);" /> Ya, merekomendasikan
                  </label>
                  <label style="display:flex; align-items:center; gap:6px; font-size:0.875rem; cursor:pointer;">
                    <input type="radio" name="review-recommends" value="false" style="accent-color: var(--primary); transform: scale(1.1);" /> Tidak
                  </label>
                </div>
              </div>

              <!-- Review Comment Textarea -->
              <div>
                <label for="review-comment" style="font-weight:600; font-size:0.875rem; color:var(--text-primary); display:block; margin-bottom:6px;">Review & Komentar</label>
                <textarea id="review-comment" placeholder="Tulis komentar atau ulasan Anda mengenai tekstur, aroma, hasil pemakaian, dll..." style="width:100%; height:120px; padding:12px; border-radius:8px; border:1px solid var(--border); font-family:var(--font-family); font-size:0.875rem; resize:none; line-height:1.5; outline:none; box-sizing: border-box;" required minlength="5"></textarea>
              </div>

              <!-- Submit and Cancel Buttons -->
              <div style="display:flex; gap:10px; margin-top:8px;">
                <button type="button" class="btn btn-outline" id="btn-cancel-review" style="flex:1; padding: 12px 0;">Batal</button>
                <button type="submit" class="btn btn-primary" style="flex:1; padding: 12px 0;">Kirim Review</button>
              </div>
            </form>
          </div>
        `;

        // Star rating selection interaction
        const stars = reviewOverlay.querySelectorAll('.star-rating-picker span');
        stars.forEach(star => {
          star.addEventListener('click', () => {
            const val = parseInt(star.dataset.val);
            reviewOverlay.querySelector('#review-rating').value = val;
            stars.forEach(s => {
              const sVal = parseInt(s.dataset.val);
              if (sVal <= val) {
                s.style.color = '#f59e0b';
              } else {
                s.style.color = 'var(--text-tertiary)';
              }
            });
          });
        });

        reviewOverlay.querySelector('#btn-cancel-review').addEventListener('click', () => reviewOverlay.remove());

        reviewOverlay.querySelector('#review-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const ratingVal = parseInt(reviewOverlay.querySelector('#review-rating').value);
          if (ratingVal === 0) {
            showCustomAlert('Silakan pilih rating bintang terlebih dahulu!', 'Rating Diperlukan');
            return;
          }
          const recommendsVal = reviewOverlay.querySelector('input[name="review-recommends"]:checked').value === 'true';
          const commentVal = reviewOverlay.querySelector('#review-comment').value.trim();

          try {
            const body = {
              product_name: p.name,
              rating: ratingVal,
              recommends: recommendsVal,
              comment: commentVal
            };
            const resp = await fetch(`${API_BASE_URL}/api/reviews`, {
              method: 'POST',
              headers: getAuthHeaders(),
              body: JSON.stringify(body)
            });

            if (!resp.ok) {
              const errData = await resp.json();
              throw new Error(errData.detail || 'Gagal mengirim review');
            }

            // Close modal
            reviewOverlay.remove();

            // Refresh the DOM section by reloading reviews from backend
            await loadReviewsFromBackend();
            showCustomAlert('Review Anda berhasil ditambahkan!', 'Ulasan Dikirim');
          } catch (err) {
            console.error("Gagal menyimpan review ke database:", err);
            showCustomAlert(err.message || 'Gagal mengirim ulasan ke database. Pastikan Anda sudah masuk/login.', 'Error');
          }
        });

        document.body.appendChild(reviewOverlay);
      });
    }
  }, 0);

  async function loadReviewsFromBackend() {
    try {
      const resp = await fetch(`${API_BASE_URL}/api/reviews?product_name=${encodeURIComponent(p.name)}`);
      if (resp.ok) {
        const data = await resp.json();
        reviews = data.reviews || [];
      } else {
        reviews = [];
      }
    } catch (e) {
      console.error("Gagal memuat review dari database:", e);
      reviews = [];
    }
    updateReviewsDOM();
  }

  // Populate initially
  setTimeout(() => {
    loadReviewsFromBackend();
  }, 0);

  return page;
}
