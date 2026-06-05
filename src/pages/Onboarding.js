import { icons } from '../components/BottomNav.js';

const slides = [
  {
    cls: 'ob-slide-1',
    icon: icons.camera,
    title: 'Analisis Kulit AI',
    desc: 'Temukan kebutuhan kulit Anda yang sebenarnya dengan pemindai AI canggih kami. Dapatkan wawasan instan dan akurat tentang jenis serta masalah kulit Anda.',
  },
  {
    cls: 'ob-slide-2',
    icon: icons.shield,
    title: 'Rekomendasi Cerdas',
    desc: 'Dapatkan rekomendasi produk skincare yang dipersonalisasi sesuai profil kulit unik Anda. Hanya produk yang terverifikasi dan aman.',
  },
  {
    cls: 'ob-slide-3',
    icon: icons.star,
    title: 'Pantau Perjalanan Kulitmu',
    desc: 'Pantau perjalanan kulit Anda dengan rutinitas harian, grafik perkembangan, dan pengingat cerdas. Saksikan transformasi kulit Anda.',
  },
];

export function renderOnboarding() {
  const page = document.createElement('div');
  page.className = 'onboarding';
  let current = 0;

  page.innerHTML = `
    <div class="onboarding-slides" id="ob-slides">
      ${slides.map((s, i) => `
        <div class="onboarding-slide ${s.cls} ${i === 0 ? 'active' : ''}" data-idx="${i}">
          <div class="ob-illustration">
            <div class="ob-icon-main">${s.icon}</div>
            <div class="ob-dot"></div>
            <div class="ob-dot"></div>
            <div class="ob-dot"></div>
            <div class="ob-dot"></div>
          </div>
          <div class="ob-text">
            <div class="ob-title">${s.title}</div>
            <div class="ob-desc">${s.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="ob-controls">
      <div class="ob-dots" id="ob-dots">
        ${slides.map((_, i) => `<div class="ob-dot-indicator ${i === 0 ? 'active' : ''}" data-idx="${i}"></div>`).join('')}
      </div>
      <button class="ob-btn ob-btn-primary" id="ob-next">Lanjut</button>
      <button class="ob-skip" id="ob-skip">Lewati</button>
    </div>
  `;

  const allSlides = page.querySelectorAll('.onboarding-slide');
  const allDots = page.querySelectorAll('.ob-dot-indicator');
  const nextBtn = page.querySelector('#ob-next');
  const skipBtn = page.querySelector('#ob-skip');

  function goTo(idx) {
    allSlides.forEach((s, i) => {
      s.classList.remove('active', 'exit');
      if (i < idx) s.classList.add('exit');
      if (i === idx) s.classList.add('active');
    });
    allDots.forEach((d, i) => d.classList.toggle('active', i === idx));
    current = idx;
    nextBtn.textContent = idx === slides.length - 1 ? 'Mulai Sekarang' : 'Lanjut';
  }

  function finish() {
    localStorage.setItem('bglow_onboarded', '1');
    window.location.hash = '#/login';
  }

  nextBtn.addEventListener('click', () => {
    if (current < slides.length - 1) {
      goTo(current + 1);
    } else {
      finish();
    }
  });

  skipBtn.addEventListener('click', finish);

  return page;
}
