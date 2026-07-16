import { icons } from '../components/BottomNav.js';

const plans = [
  {
    id: 'basic',
    emoji: '🌱',
    name: 'Basic',
    tagline: 'Cocok untuk pemula',
    price: 'Gratis',
    priceSub: 'Selamanya',
    features: [
      'Scan AI (maks. 3x per hari)',
      'Jurnal Kulit Dasar',
      'Cek BPOM Produk',
      'Pengingat Rutinitas Manual',
    ],
    cta: 'Paket Saat Ini',
    cardClass: 'basic',
    popular: false,
  },
  {
    id: 'glow-plus',
    emoji: '✨',
    name: 'Glow Plus',
    tagline: 'Untuk kulit yang lebih terawat',
    price: 'Rp 20.000',
    priceSub: 'per bulan',
    features: [
      'Scan AI Tanpa Batas',
      'Analisis Rutinitas Mingguan',
      'Alarm UV Otomatis & Cerdas',
      'Bebas Iklan',
      'Semua fitur Basic',
    ],
    cta: 'Mulai Glow Plus',
    cardClass: 'glow-plus',
    popular: false,
  },
  {
    id: 'flawless',
    emoji: '👑',
    name: 'Flawless',
    tagline: 'Pengalaman skincare terbaik',
    price: 'Rp 35.000',
    priceSub: 'per bulan',
    features: [
      'Semua fitur Glow Plus',
      'Konsultasi Chat AI Pakar Kulit',
      'Laporan Tren Kulit Bulanan',
      'Rekomendasi Produk Personal',
      'Akses Eksklusif Event Skincare',
    ],
    cta: 'Mulai Flawless',
    cardClass: 'flawless',
    popular: true,
  },
];

export function renderSubscription() {
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
      ${plans.map((plan, idx) => `
        <div class="plan-card ${plan.cardClass} anim-fade-in-up" style="animation-delay: ${idx * 100}ms" data-plan="${plan.id}">
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

          <button class="plan-cta-btn" data-plan="${plan.id}">${plan.cta}</button>
        </div>
      `).join('')}
    </div>

    <p class="sub-footer-note">
      Pembayaran aman & dapat dibatalkan kapan saja.<br>
      Dengan berlangganan, kamu menyetujui Syarat & Ketentuan B-Glow.
    </p>
  `;

  // Back button
  page.querySelector('#sub-back-btn').addEventListener('click', () => {
    window.history.back();
  });

  // CTA buttons
  page.querySelectorAll('.plan-cta-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const planId = btn.dataset.plan;
      if (planId === 'basic') return;

      const { setSubscriptionPlan } = await import('../utils/store.js');
      setSubscriptionPlan(planId);

      // Show a simple confirmation toast
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
        background: linear-gradient(135deg, #1E1B4B, #312E81);
        color: white; padding: 14px 24px; border-radius: 50px;
        font-size: 0.85rem; font-weight: 600; z-index: 9999;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.15);
        white-space: nowrap;
        animation: slideUp 0.3s ease;
      `;
      toast.textContent = planId === 'glow-plus' ? '✨ Mengaktifkan Glow Plus...' : '👑 Mengaktifkan Flawless...';
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
        window.location.hash = '#/';
      }, 1500);
    });
  });

  return page;
}
