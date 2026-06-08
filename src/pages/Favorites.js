import { icons } from '../components/BottomNav.js';
import { getUserId, syncUserData } from '../utils/store.js';

export function renderFavorites() {
  const page = document.createElement('div');
  page.className = 'page';

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

  function removeFromFavorites(index) {
    const list = getFavorites();
    list.splice(index, 1);
    localStorage.setItem(favKey, JSON.stringify(list));
    syncUserData({ favorites: JSON.stringify(list) });
  }

  function render() {
    const favorites = getFavorites();

    if (favorites.length === 0) {
      page.innerHTML = `
        <div class="page-header">
          <button class="back-btn" id="fav-back-btn">${icons.chevronLeft}</button>
          <h1 style="width: 100%; text-align: center; margin-right: 40px;">Produk Favorit</h1>
        </div>
        <div class="empty-state anim-fade-in" style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:70vh; padding:20px; text-align:center;">
          <div style="font-size:5rem; margin-bottom:24px; color:#f43f5e;">❤️</div>
          <h2 style="margin-bottom:12px; color: var(--text-primary);">Belum Ada Favorit</h2>
          <p style="color:var(--text-secondary); margin-bottom:32px; line-height:1.6; font-size:0.95rem;">
            Simpan produk yang Anda sukai saat menjelajah detail produk agar mudah menemukannya kembali di sini.
          </p>
          <button class="btn btn-primary" id="explore-btn" style="width:100%; padding:14px; border-radius:12px; font-weight:600; display:flex; align-items:center; justify-content:center; gap:8px;">
            Jelajahi Produk
          </button>
        </div>
      `;

      setTimeout(() => {
        const backBtn = page.querySelector('#fav-back-btn');
        if (backBtn) backBtn.addEventListener('click', () => window.location.hash = '#/profile');

        const exploreBtn = page.querySelector('#explore-btn');
        if (exploreBtn) exploreBtn.addEventListener('click', () => window.location.hash = '#/recommendations');
      }, 0);
      return;
    }

    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="fav-back-btn">${icons.chevronLeft}</button>
        <h1 style="width: 100%; text-align: center; margin-right: 40px;">Produk Favorit</h1>
      </div>
      <div class="page-content" style="padding-top: 16px; overflow-y: auto; height: calc(100vh - 140px);">
        <div class="product-grid" id="product-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px;">
          ${favorites.map((p, i) => `
            <div class="product-card anim-fade-in-up" style="position: relative; background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-light); overflow: hidden; display: flex; flex-direction: column;" data-idx="${i}">
              <button class="remove-fav-btn" data-idx="${i}" style="position: absolute; top: 8px; right: 8px; background: white; border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1); cursor: pointer; color: #f43f5e; z-index: 10; padding: 0;">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" stroke-width="0"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
              <div class="product-img" style="background:${p.bgColor || '#F1F5F9'}; height: 120px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">
                <div class="img-placeholder">${p.emoji || '🧴'}</div>
              </div>
              <div class="product-info" style="padding: 12px; display: flex; flex-direction: column; flex-grow: 1;">
                <div class="product-name" style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-bottom: 2px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 34px;">${p.name}</div>
                <div class="product-brand" style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 8px;">${p.brand}</div>
                <div class="product-rating" style="display: flex; align-items: center; gap: 4px; font-size: 0.75rem; color: #f59e0b; margin-bottom: 8px;">
                  <span class="stars">${'★'.repeat(Math.floor(p.rating || 4.5))}${p.rating % 1 ? '½' : ''}</span>
                  <span class="rating-num" style="color: var(--text-secondary);">(${p.rating || 4.5})</span>
                </div>
                <div class="product-price" style="font-size: 0.9rem; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; margin-top: auto;">Rp${p.price.toLocaleString()}</div>
                <button class="product-cta btn-detail" data-idx="${i}" style="width: 100%; border: 1px solid var(--primary); background: transparent; color: var(--primary); padding: 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">Lihat Detail</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    setTimeout(() => {
      const backBtn = page.querySelector('#fav-back-btn');
      if (backBtn) backBtn.addEventListener('click', () => window.location.hash = '#/profile');

      page.querySelectorAll('.btn-detail').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          const product = favorites[idx];
          sessionStorage.setItem('bglow_selected_product', JSON.stringify(product));
          window.location.hash = '#/product-detail';
        });
      });

      page.querySelectorAll('.remove-fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.idx);
          removeFromFavorites(idx);
          render();
        });
      });
    }, 0);
  }

  render();
  return page;
}
