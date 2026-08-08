import { icons } from '../components/BottomNav.js';
import { getUserId, syncUserData } from '../utils/store.js';

export function renderFavorites() {
  const page = document.createElement('div');
  page.className = 'page';

  const userId = getUserId();
  const favKey = 'bglow_favorites_' + userId;

  // Inject styles once
  if (!document.getElementById('fav-premium-styles')) {
    const s = document.createElement('style');
    s.id = 'fav-premium-styles';
    s.textContent = `
      .fav-hero {
        background: linear-gradient(135deg, #f43f5e 0%, #e11d48 60%, #9f1239 100%);
        padding: 20px 20px 40px;
        position: relative;
        overflow: hidden;
      }
      .fav-hero::before {
        content: '';
        position: absolute;
        top: -40px; right: -40px;
        width: 160px; height: 160px;
        border-radius: 50%;
        background: rgba(255,255,255,0.08);
      }
      .fav-hero::after {
        content: '';
        position: absolute;
        bottom: -30px; left: -20px;
        width: 120px; height: 120px;
        border-radius: 50%;
        background: rgba(255,255,255,0.05);
      }
      .fav-hero-back {
        background: rgba(255,255,255,0.15);
        border: none;
        width: 36px; height: 36px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        margin-bottom: 16px;
        backdrop-filter: blur(8px);
        color: white;
      }
      .fav-hero-back svg { stroke: white; }
      .fav-hero-title {
        font-size: 1.5rem;
        font-weight: 800;
        color: white;
        letter-spacing: -0.4px;
        margin: 0 0 4px 0;
      }
      .fav-hero-sub {
        font-size: 0.8rem;
        color: rgba(255,255,255,0.75);
        margin: 0;
        font-weight: 500;
      }
      .fav-count-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 20px;
        padding: 4px 12px;
        font-size: 0.75rem;
        font-weight: 700;
        color: white;
        margin-bottom: 12px;
      }
      .fav-body {
        background: #f8fafc;
        border-radius: 24px 24px 0 0;
        margin-top: -20px;
        padding: 20px 16px 100px;
        min-height: calc(100vh - 120px);
        position: relative;
        z-index: 1;
      }
      .fav-list-card {
        background: white;
        border-radius: 20px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        border: 1px solid rgba(0,0,0,0.04);
        overflow: hidden;
        display: flex;
        align-items: stretch;
        margin-bottom: 14px;
        cursor: pointer;
        transition: transform 0.18s ease, box-shadow 0.18s ease;
        position: relative;
      }
      .fav-list-card:active {
        transform: scale(0.98);
      }
      .fav-list-card:hover {
        box-shadow: 0 6px 24px rgba(0,0,0,0.1);
        transform: translateY(-2px);
      }
      .fav-card-img-wrap {
        width: 100px;
        flex-shrink: 0;
        position: relative;
        overflow: hidden;
      }
      .fav-card-img-wrap img {
        width: 100%; height: 100%;
        object-fit: cover;
      }
      .fav-card-img-placeholder {
        width: 100%; height: 100%;
        display: flex; align-items: center; justify-content: center;
        font-size: 2.5rem;
      }
      .fav-card-cat-badge {
        position: absolute;
        bottom: 6px; left: 6px;
        font-size: 8px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        padding: 3px 6px;
        border-radius: 6px;
        color: white;
      }
      .fav-card-body {
        padding: 14px 12px 14px 14px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 0;
      }
      .fav-card-name {
        font-size: 0.87rem;
        font-weight: 700;
        color: #0f172a;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-bottom: 4px;
      }
      .fav-card-kategori {
        font-size: 0.7rem;
        font-weight: 600;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        margin-bottom: 8px;
      }
      .fav-card-price {
        font-size: 1rem;
        font-weight: 800;
        color: #f43f5e;
        margin-bottom: 10px;
      }
      .fav-card-actions {
        display: flex;
        gap: 8px;
      }
      .fav-btn-detail {
        flex: 1;
        background: linear-gradient(135deg, #f43f5e, #e11d48);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 8px 0;
        font-size: 0.72rem;
        font-weight: 700;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      .fav-btn-detail:active { opacity: 0.85; }
      .fav-btn-remove {
        background: #fff1f2;
        border: 1px solid #fecdd3;
        border-radius: 10px;
        width: 34px;
        height: 34px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        color: #f43f5e;
        transition: all 0.2s;
      }
      .fav-btn-remove:hover { background: #ffe4e6; }
      .fav-btn-remove svg { width: 14px; height: 14px; fill: currentColor; stroke: none; }
      .fav-match-badge {
        font-size: 0.68rem;
        font-weight: 700;
        padding: 2px 7px;
        border-radius: 8px;
        display: inline-block;
        margin-bottom: 6px;
      }

      /* Empty State */
      .fav-empty {
        display: flex; flex-direction: column; align-items: center;
        justify-content: center;
        padding: 48px 24px;
        text-align: center;
      }
      .fav-empty-icon {
        width: 90px; height: 90px;
        background: linear-gradient(135deg, #fff1f2, #ffe4e6);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin-bottom: 20px;
        border: 3px solid #fecdd3;
      }
      .fav-empty h2 {
        font-size: 1.2rem; font-weight: 800; color: #0f172a;
        margin: 0 0 8px;
      }
      .fav-empty p {
        font-size: 0.85rem; color: #94a3b8; line-height: 1.6;
        margin: 0 0 28px;
      }
      .fav-explore-btn {
        background: linear-gradient(135deg, #f43f5e, #e11d48);
        color: white;
        border: none;
        border-radius: 14px;
        padding: 14px 32px;
        font-size: 0.9rem;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 4px 16px rgba(244,63,94,0.35);
        transition: all 0.2s;
      }
    `;
    document.head.appendChild(s);
  }

  const CAT_COLORS = {
    'Facial Wash': { bg: '#E0F2FE', text: '#0284C7', pill: '#0EA5E9' },
    'Moisturizer':  { bg: '#DCFCE7', text: '#16A34A', pill: '#22C55E' },
    'Serum':        { bg: '#FEF3C7', text: '#B45309', pill: '#F59E0B' },
    'Sunscreen':    { bg: '#FFF7ED', text: '#C2410C', pill: '#F97316' },
    'Eksfoliasi':   { bg: '#F5F3FF', text: '#6D28D9', pill: '#8B5CF6' },
  };

  function getFavorites() {
    try {
      const data = localStorage.getItem(favKey);
      return data ? JSON.parse(data) : [];
    } catch (e) { return []; }
  }

  function removeFromFavorites(index) {
    const list = getFavorites();
    list.splice(index, 1);
    localStorage.setItem(favKey, JSON.stringify(list));
    syncUserData({ favorites: JSON.stringify(list) });
  }

  function renderCard(p, i) {
    const kat = p.kategori || '';
    const catColor = CAT_COLORS[kat] || { bg: '#F1F5F9', text: '#64748B', pill: '#94A3B8' };
    const matchPct = p.match || (p.score ? Math.round(p.score * 100) : null);
    const hasImg = p.image_url && p.image_url !== 'nan' && p.image_url.startsWith('http');
    const price = typeof p.price === 'number' ? p.price : parseInt(p.price) || 0;

    return `
      <div class="fav-list-card anim-fade-in-up" data-idx="${i}" style="animation-delay:${i * 0.07}s">
        <div class="fav-card-img-wrap" style="background:${catColor.bg};">
          ${hasImg
            ? `<img src="${p.image_url}" alt="${p.name}"
                    onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
               <div class="fav-card-img-placeholder" style="display:none;">🧴</div>`
            : `<div class="fav-card-img-placeholder">🧴</div>`
          }
          ${kat ? `<span class="fav-card-cat-badge" style="background:${catColor.pill};">${kat}</span>` : ''}
        </div>
        <div class="fav-card-body">
          <div>
            ${matchPct ? `<span class="fav-match-badge" style="background:#F0FDF4;color:#16A34A;">${matchPct}% Cocok</span>` : ''}
            <div class="fav-card-name">${p.name}</div>
          </div>
          <div>
            <div class="fav-card-price">Rp${price.toLocaleString('id-ID')}</div>
            <div class="fav-card-actions">
              <button class="fav-btn-detail" data-idx="${i}">Lihat Detail</button>
              <button class="fav-btn-remove" data-idx="${i}" title="Hapus dari favorit">
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function render() {
    const favorites = getFavorites();

    if (favorites.length === 0) {
      page.innerHTML = `
        <div class="fav-hero">
          <button class="fav-hero-back" id="fav-back-btn">${icons.chevronLeft}</button>
          <h1 class="fav-hero-title">Produk Favorit</h1>
          <p class="fav-hero-sub">Simpan produk terbaik untukmu</p>
        </div>
        <div class="fav-body">
          <div class="fav-empty anim-fade-in">
            <div class="fav-empty-icon">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="#f43f5e">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h2>Belum Ada Favorit</h2>
            <p>Simpan produk yang kamu suka saat menjelajah halaman rekomendasi. Produkmu akan muncul di sini.</p>
            <button class="fav-explore-btn" id="explore-btn">🔍 Jelajahi Produk</button>
          </div>
        </div>
      `;
      setTimeout(() => {
        page.querySelector('#fav-back-btn')?.addEventListener('click', () => window.location.hash = '#/profile');
        page.querySelector('#explore-btn')?.addEventListener('click', () => window.location.hash = '#/recommendations');
      }, 0);
      return;
    }

    page.innerHTML = `
      <div class="fav-hero">
        <button class="fav-hero-back" id="fav-back-btn">${icons.chevronLeft}</button>
        <div class="fav-count-pill">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="white"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          ${favorites.length} Produk Tersimpan
        </div>
        <h1 class="fav-hero-title">Produk Favorit</h1>
        <p class="fav-hero-sub">Koleksi produk terbaik pilihanmu</p>
      </div>
      <div class="fav-body">
        <div id="fav-list">
          ${favorites.map((p, i) => renderCard(p, i)).join('')}
        </div>
      </div>
    `;

    setTimeout(() => {
      page.querySelector('#fav-back-btn')?.addEventListener('click', () => window.location.hash = '#/profile');

      page.querySelectorAll('.fav-btn-detail').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx);
          sessionStorage.setItem('bglow_selected_product', JSON.stringify(favorites[idx]));
          window.location.hash = '#/product-detail';
        });
      });

      page.querySelectorAll('.fav-list-card').forEach(card => {
        card.addEventListener('click', () => {
          const idx = parseInt(card.dataset.idx);
          sessionStorage.setItem('bglow_selected_product', JSON.stringify(favorites[idx]));
          window.location.hash = '#/product-detail';
        });
      });

      page.querySelectorAll('.fav-btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx);
          // Animate out
          const card = page.querySelector(`.fav-list-card[data-idx="${idx}"]`);
          if (card) {
            card.style.transition = 'all 0.25s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateX(40px)';
            setTimeout(() => {
              removeFromFavorites(idx);
              render();
            }, 250);
          }
        });
      });
    }, 0);
  }

  render();
  return page;
}
