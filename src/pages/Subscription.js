import { icons } from '../components/BottomNav.js';
import { getSubscriptionPlan } from '../utils/store.js';
import { initBilling, purchaseGlowPlus, restorePurchases } from '../utils/billing.js';

const plans = [
  {
    id: 'basic',
    emoji: '🌱',
    name: 'Free',
    tagline: 'Cocok untuk pemula',
    price: 'Gratis',
    priceSub: 'Selamanya',
    features: [
      'Scan AI (1x)',
      'Cek BPOM',
      'Rekomendasi Produk Terbatas',
    ],
    cardClass: 'basic',
    popular: false,
  },
  {
    id: 'glow-plus',
    emoji: '✨',
    name: 'Glow Plus',
    tagline: 'Untuk pengalaman perawatan kulit terbaik',
    price: 'Rp 30.000',
    priceSub: 'per bulan',
    features: [
      'Scan AI Tanpa Batas',
      'Rekomendasi Banyak Produk',
      'Alarm UV',
      'Rutinitas/Routine',
    ],
    cardClass: 'glow-plus',
    popular: true,
  },
];

export function renderSubscription() {
  const currentPlan = getSubscriptionPlan();
  const isGlowPlus = currentPlan === 'glow-plus' || currentPlan === 'flawless';

  const page = document.createElement('div');
  page.className = 'page subscription-page';

  page.innerHTML = `
    <!-- Header -->
    <header class="sub-header">
      <button class="sub-back-btn" id="sub-back-btn">
        ${icons.chevronLeft}
      </button>
      <span class="sub-header-title">Pilih Paket</span>
    </header>

    <!-- Hero -->
    <div class="sub-hero anim-fade-in">
      <span class="sub-crown-icon">👑</span>
      <h1 class="sub-hero-title">Upgrade ke<br><span>B-Glow Premium</span></h1>
      <p class="sub-hero-desc">Dapatkan akses fitur eksklusif dan raih kulit impianmu lebih cepat.</p>
    </div>

    <!-- Plans -->
    <div class="sub-plans">
      ${plans.map((plan, idx) => {
        const isActive = plan.id === 'glow-plus' ? isGlowPlus : (!isGlowPlus && plan.id === 'basic');
        const ctaText = isActive ? '✓ Paket Aktif' : (plan.id === 'glow-plus' ? 'Mulai Glow Plus (Google Play)' : 'Paket Gratis');
        
        return `
          <div class="plan-card ${plan.cardClass} ${isActive ? 'is-active' : ''} anim-fade-in-up" style="animation-delay: ${idx * 100}ms" data-plan="${plan.id}">
            ${plan.popular ? `<div class="plan-popular-badge">🔥 Terpopuler</div>` : ''}

            <div class="plan-top">
              <span class="plan-emoji">${plan.emoji}</span>
              <div>
                <div class="plan-name">${plan.name}</div>
                <div class="plan-tagline">${plan.tagline}</div>
              </div>
            </div>

            <div class="plan-price-row">
              <div class="plan-price">${plan.price}</div>
              <div class="plan-price-sub">${plan.priceSub}</div>
            </div>

            <ul class="plan-features">
              ${plan.features.map(f => `
                <li>
                  <span class="fi-check">✓</span>
                  ${f}
                </li>
              `).join('')}
            </ul>

            <button class="plan-cta-btn ${isActive ? 'active-btn' : ''}" data-plan="${plan.id}" ${isActive ? 'disabled' : ''}>
              ${ctaText}
            </button>
          </div>
        `;
      }).join('')}
    </div>

    <div class="sub-restore-box" style="text-align: center; margin-top: 16px;">
      <button id="restore-purchases-btn" style="background: none; border: none; color: #6366F1; font-size: 0.85rem; font-weight: 600; text-decoration: underline; cursor: pointer;">
        🔄 Pulihkan Pembelian Google Play
      </button>
    </div>

    <p class="sub-footer-note">
      Pembayaran aman via Google Play Store & dapat dibatalkan kapan saja.<br>
      Dengan berlangganan, kamu menyetujui Syarat & Ketentuan B-Glow.
    </p>
  `;

  // Helper Toast
  const showToast = (message, isError = false) => {
    const existing = document.querySelector('.sub-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'sub-toast';
    toast.style.cssText = `
      position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
      background: ${isError ? 'linear-gradient(135deg, #991B1B, #7F1D1D)' : 'linear-gradient(135deg, #1E1B4B, #312E81)'};
      color: white; padding: 14px 24px; border-radius: 50px;
      font-size: 0.85rem; font-weight: 600; z-index: 9999;
      box-shadow: 0 8px 30px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.15);
      white-space: nowrap;
      animation: slideUp 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  // Initialize Billing
  initBilling((result) => {
    if (result.success) {
      showToast('✨ Pembelian Glow Plus Berhasil!');
      setTimeout(() => {
        window.location.hash = '#/';
      }, 1500);
    } else if (result.error) {
      showToast('❌ ' + result.error, true);
    }
  });

  // Back button
  page.querySelector('#sub-back-btn').addEventListener('click', () => {
    window.history.back();
  });

  // Restore Purchases button
  page.querySelector('#restore-purchases-btn').addEventListener('click', async () => {
    showToast('🔍 Memeriksa pembelian Google Play...');
    const result = await restorePurchases();
    if (result.success) {
      showToast('✨ Pembelian berhasil dipulihkan!');
      setTimeout(() => {
        window.location.hash = '#/';
      }, 1500);
    } else {
      showToast('❌ Tidak ditemukan langganan aktif.', true);
    }
  });

  // CTA buttons
  page.querySelectorAll('.plan-cta-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const planId = btn.dataset.plan;
      if (planId === 'basic') return;

      btn.disabled = true;
      btn.textContent = 'Memproses...';
      showToast('💳 Membuka Google Play Billing...');

      try {
        const res = await purchaseGlowPlus();
        if (res && res.success && res.simulated) {
          // Web simulation mode
          showToast('✨ Selamat! Glow Plus berhasil diaktifkan (Simulasi).');
          setTimeout(() => { window.location.hash = '#/'; }, 1500);
        } else if (res && res.success && res.pending) {
          // Native purchase dimulai — tunggu callback dari listener approved/finished
          showToast('⏳ Menunggu konfirmasi Google Play...');
          // Tombol tetap disabled sampai listener callback menavigasi
        } else if (res && res.success) {
          showToast('✨ Selamat! Glow Plus berhasil diaktifkan.');
          setTimeout(() => { window.location.hash = '#/'; }, 1500);
        } else if (res && !res.success) {
          showToast('❌ ' + (res.error || 'Gagal memproses pembayaran.'), true);
          btn.disabled = false;
          btn.textContent = 'Mulai Glow Plus (Google Play)';
        }
      } catch (err) {
        console.error('[Subscription] Purchase error:', err);
        showToast('❌ Gagal memproses pembayaran Google Play.', true);
        btn.disabled = false;
        btn.textContent = 'Mulai Glow Plus (Google Play)';
      }
    });
  });

  return page;
}
