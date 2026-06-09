// ─── Ripple Effect Utility ───
export function addRipple(element) {
  element.classList.add('ripple-container');
  element.addEventListener('click', (e) => {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    element.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

// ─── Stagger Animation ───
export function staggerChildren(container, selector, baseDelay = 80) {
  const children = container.querySelectorAll(selector);
  children.forEach((child, i) => {
    child.style.animationDelay = `${i * baseDelay}ms`;
  });
}

// ─── Intersection Observer for Animations ───
export function animateOnScroll(elements, animClass = 'anim-fade-in-up') {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animClass);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

// ─── Format Date ───
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }).format(date);
}

// ─── Random Int ───
export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Inject Premium Popup Styles once at module level
if (typeof document !== 'undefined' && !document.getElementById('custom-popup-styles')) {
  const style = document.createElement('style');
  style.id = 'custom-popup-styles';
  style.textContent = `
    @keyframes popupZoom {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .custom-popup-overlay {
      position: fixed !important;
      inset: 0 !important;
      background: rgba(15, 23, 42, 0.45) !important; /* Soft dark slate translucent overlay */
      z-index: 99999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      backdrop-filter: blur(8px);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      padding: 24px !important;
    }
    .custom-popup-modal {
      width: 100% !important;
      max-width: 360px !important;
      padding: 36px 28px !important;
      text-align: center !important;
      border-radius: 28px !important;
      background: #ffffff !important; /* Clean premium white card background */
      border: 1px solid rgba(15, 23, 42, 0.08) !important;
      box-shadow: 0 24px 50px rgba(15, 23, 42, 0.15) !important;
      color: #1e293b !important;
      animation: popupZoom 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both !important;
      box-sizing: border-box !important;
    }
    .custom-popup-modal * {
      box-sizing: border-box !important;
    }
    
    /* Subtle borders based on alert type */
    .custom-popup-modal.success {
      border-color: rgba(16, 185, 129, 0.2) !important;
    }
    .custom-popup-modal.warning {
      border-color: rgba(245, 158, 11, 0.2) !important;
    }
    .custom-popup-modal.info {
      border-color: rgba(59, 130, 246, 0.2) !important;
    }

    .custom-popup-icon-wrapper {
      width: 64px !important;
      height: 64px !important;
      border-radius: 50% !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 0 auto 20px auto !important;
      font-size: 1.8rem !important;
    }
    .custom-popup-icon-wrapper.success {
      background: rgba(16, 185, 129, 0.1) !important;
      border: 1px solid rgba(16, 185, 129, 0.25) !important;
      color: #10b981 !important;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1) !important;
    }
    .custom-popup-icon-wrapper.warning {
      background: rgba(245, 158, 11, 0.1) !important;
      border: 1px solid rgba(245, 158, 11, 0.25) !important;
      color: #f59e0b !important;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1) !important;
    }
    .custom-popup-icon-wrapper.info {
      background: rgba(59, 130, 246, 0.1) !important;
      border: 1px solid rgba(59, 130, 246, 0.25) !important;
      color: #3b82f6 !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1) !important;
    }
    
    .custom-popup-title {
      margin: 0 0 12px 0 !important;
      font-size: 1.25rem !important;
      font-weight: 700 !important;
      color: #0f172a !important;
      letter-spacing: -0.3px !important;
      line-height: 1.3 !important;
    }
    .custom-popup-message {
      color: #475569 !important;
      font-size: 0.95rem !important;
      line-height: 1.6 !important;
      margin: 0 0 28px 0 !important;
      white-space: pre-line !important;
      word-break: break-word !important;
    }
    .custom-popup-actions {
      display: flex !important;
      gap: 12px !important;
      width: 100% !important;
      justify-content: center !important;
    }
    
    .custom-btn-ok {
      flex: 1 !important;
      border: none !important;
      border-radius: 9999px !important;
      padding: 12px 24px !important;
      font-size: 0.95rem !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      text-transform: none !important;
      margin: 0 !important;
    }
    
    /* Type specific button coloring (Vibrant with White Text) */
    .success .custom-btn-ok {
      background: #10b981 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
    }
    .success .custom-btn-ok:hover {
      background: #059669 !important;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35) !important;
      transform: translateY(-1px) !important;
    }
    
    .warning .custom-btn-ok {
      background: #f59e0b !important;
      color: #ffffff !important;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2) !important;
    }
    .warning .custom-btn-ok:hover {
      background: #d97706 !important;
      box-shadow: 0 6px 16px rgba(245, 158, 11, 0.35) !important;
      transform: translateY(-1px) !important;
    }
    
    .info .custom-btn-ok {
      background: #3b82f6 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2) !important;
    }
    .info .custom-btn-ok:hover {
      background: #2563eb !important;
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35) !important;
      transform: translateY(-1px) !important;
    }
    
    .custom-btn-ok:active {
      transform: translateY(1px) !important;
    }
    
    .custom-btn-cancel {
      flex: 1 !important;
      background: #f1f5f9 !important;
      color: #475569 !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 9999px !important;
      padding: 12px 24px !important;
      font-size: 0.95rem !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      text-transform: none !important;
      margin: 0 !important;
    }
    .custom-btn-cancel:hover {
      background: #e2e8f0 !important;
      color: #0f172a !important;
      transform: translateY(-1px) !important;
    }
    .custom-btn-cancel:active {
      transform: translateY(1px) !important;
    }
  `;
  document.head.appendChild(style);
}

// ─── Custom Alert Modal ───
export function showCustomAlert(message, title = 'B-Glow', callback = null) {
  const existing = document.querySelector('.custom-alert-overlay');
  if (existing) existing.remove();

  // Determine icon type based on title/message
  const title_lower = (title || '').toLowerCase();
  const msg_lower = (message || '').toLowerCase();
  
  let icon_type = 'info';
  let icon_char = '🔔';
  
  if (title_lower.includes('profil') || title_lower.includes('akun') || title_lower.includes('user') || msg_lower.includes('profil') || msg_lower.includes('akun') || msg_lower.includes('user')) {
    icon_type = 'success';
    icon_char = '👤'; // Human profile icon
  } else if (title_lower.includes('sukses') || title_lower.includes('berhasil') || title_lower.includes('diperbarui') || title_lower.includes('pendaftaran') || msg_lower.includes('berhasil') || msg_lower.includes('sukses')) {
    icon_type = 'success';
    icon_char = '✨';
  } else if (title_lower.includes('gagal') || title_lower.includes('salah') || title_lower.includes('kosong') || title_lower.includes('masalah') || title_lower.includes('kunci') || title_lower.includes('belum') || title_lower.includes('terkunci') || title_lower.includes('batal') || title_lower.includes('peringatan') || msg_lower.includes('gagal') || msg_lower.includes('belum')) {
    icon_type = 'warning';
    icon_char = (title_lower.includes('kunci') || title_lower.includes('belum') || title_lower.includes('terkunci') || msg_lower.includes('belum')) ? '🔒' : '⚠️';
  }

  const overlay = document.createElement('div');
  overlay.className = 'custom-popup-overlay custom-alert-overlay';
  
  // Use subheader if custom title, otherwise default title
  const displayTitle = title && title !== 'B-Glow' ? title : 'Info';

  overlay.innerHTML = `
    <div class="custom-popup-modal ${icon_type}">
      <div class="custom-popup-icon-wrapper ${icon_type}">
        <span>${icon_char}</span>
      </div>
      <h3 class="custom-popup-title">${displayTitle}</h3>
      <div class="custom-popup-message">${message}</div>
      <div class="custom-popup-actions">
        <button class="custom-btn-ok" id="btn-alert-ok">OK</button>
      </div>
    </div>
  `;

  const closeAlert = () => {
    overlay.remove();
    if (callback) callback();
  };

  overlay.querySelector('#btn-alert-ok').addEventListener('click', closeAlert);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeAlert();
  });

  document.body.appendChild(overlay);
}

// ─── Custom Confirm Modal ───
export function showCustomConfirm(message, callback, title = 'Konfirmasi') {
  const existing = document.querySelector('.custom-confirm-overlay');
  if (existing) existing.remove();

  // Determine icon type based on title/message
  const title_lower = (title || '').toLowerCase();
  const msg_lower = (message || '').toLowerCase();
  
  let icon_type = 'info';
  let icon_char = '❓';
  
  if (title_lower.includes('profil') || title_lower.includes('akun') || title_lower.includes('user') || msg_lower.includes('profil') || msg_lower.includes('akun') || msg_lower.includes('user')) {
    icon_type = 'info';
    icon_char = '👤'; // Human profile icon
  } else if (title_lower.includes('hapus') || msg_lower.includes('hapus') || title_lower.includes('yakin') || msg_lower.includes('yakin')) {
    icon_type = 'warning';
    icon_char = '⚠️';
  }

  const overlay = document.createElement('div');
  overlay.className = 'custom-popup-overlay custom-confirm-overlay';
  overlay.innerHTML = `
    <div class="custom-popup-modal ${icon_type}">
      <div class="custom-popup-icon-wrapper ${icon_type}">
        <span>${icon_char}</span>
      </div>
      <h3 class="custom-popup-title">${title}</h3>
      <div class="custom-popup-message">${message}</div>
      <div class="custom-popup-actions">
        <button class="custom-btn-cancel" id="btn-confirm-cancel">Batal</button>
        <button class="custom-btn-ok" id="btn-confirm-ok">OK</button>
      </div>
    </div>
  `;

  overlay.querySelector('#btn-confirm-cancel').addEventListener('click', () => {
    overlay.remove();
  });

  overlay.querySelector('#btn-confirm-ok').addEventListener('click', () => {
    overlay.remove();
    callback();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.body.appendChild(overlay);
}
