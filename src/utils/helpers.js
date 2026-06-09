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

// ─── Custom Alert Modal ───
export function showCustomAlert(message, title = 'B-Glow', callback = null) {
  const existing = document.querySelector('.custom-alert-overlay');
  if (existing) existing.remove();

  // Ensure styles are added to head
  if (!document.getElementById('custom-popup-styles')) {
    const style = document.createElement('style');
    style.id = 'custom-popup-styles';
    style.textContent = `
      @keyframes popupZoom {
        from { transform: scale(0.9); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .custom-popup-overlay {
        position: fixed !important;
        inset: 0 !important;
        background: rgba(0, 0, 0, 0.6) !important;
        z-index: 99999 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        backdrop-filter: blur(1px);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      }
      .custom-popup-modal {
        width: 90% !important;
        max-width: 440px !important;
        padding: 24px 28px !important;
        text-align: left !important;
        border-radius: 20px !important;
        background: #141f15 !important; /* Dark green background */
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6) !important;
        color: #ffffff !important;
        animation: popupZoom 0.22s cubic-bezier(0.16, 1, 0.3, 1) both !important;
        overflow: visible !important;
        box-sizing: border-box !important;
      }
      .custom-popup-modal * {
        box-sizing: border-box !important;
      }
      .custom-popup-title {
        margin: 0 0 16px 0 !important;
        font-size: 1.15rem !important;
        font-weight: 700 !important;
        color: #ffffff !important;
        letter-spacing: -0.2px !important;
        line-height: 1.3 !important;
      }
      .custom-popup-message {
        color: #cbd5e1 !important;
        font-size: 0.95rem !important;
        line-height: 1.6 !important;
        margin: 0 0 24px 0 !important;
        white-space: pre-line !important;
        word-break: break-word !important;
      }
      .custom-popup-actions {
        display: flex !important;
        justify-content: flex-end !important;
        width: 100% !important;
        gap: 12px !important;
      }
      .custom-btn-ok {
        background: #9ee3b4 !important; /* Pastel light green */
        color: #0f1810 !important;
        border: 2px solid #0f1810 !important;
        outline: 2px solid #9ee3b4 !important;
        outline-offset: 2px !important;
        border-radius: 9999px !important;
        padding: 8px 24px !important;
        font-size: 0.95rem !important;
        font-weight: 700 !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
        margin-right: 4px !important;
        margin-bottom: 4px !important;
        text-transform: none !important;
      }
      .custom-btn-ok:hover {
        background: #b2ebd4 !important;
        outline-color: #b2ebd4 !important;
        transform: translateY(-1px) !important;
      }
      .custom-btn-ok:active {
        transform: translateY(1px) !important;
      }
      .custom-btn-cancel {
        background: transparent !important;
        color: #ffffff !important;
        border: 2px solid rgba(255, 255, 255, 0.25) !important;
        border-radius: 9999px !important;
        padding: 8px 20px !important;
        font-size: 0.95rem !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.15s ease !important;
        text-transform: none !important;
      }
      .custom-btn-cancel:hover {
        border-color: #ffffff !important;
        background: rgba(255, 255, 255, 0.08) !important;
        transform: translateY(-1px) !important;
      }
      .custom-btn-cancel:active {
        transform: translateY(1px) !important;
      }
    `;
    document.head.appendChild(style);
  }

  const hostTitle = `${window.location.host || 'localhost'} says`;

  const overlay = document.createElement('div');
  overlay.className = 'custom-popup-overlay custom-alert-overlay';
  overlay.innerHTML = `
    <div class="custom-popup-modal">
      <h3 class="custom-popup-title">${hostTitle}</h3>
      <div class="custom-popup-message">
        ${title && title !== 'B-Glow' ? `<strong style="display: block; font-size: 1.05rem; margin-bottom: 8px; color: #ffffff;">${title}</strong>` : ''}
        ${message}
      </div>
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

  // Make sure style tag exists
  showCustomAlert('', 'B-Glow');
  const tempAlert = document.querySelector('.custom-alert-overlay');
  if (tempAlert) tempAlert.remove();

  const hostTitle = `${window.location.host || 'localhost'} says`;

  const overlay = document.createElement('div');
  overlay.className = 'custom-popup-overlay custom-confirm-overlay';
  overlay.innerHTML = `
    <div class="custom-popup-modal">
      <h3 class="custom-popup-title">${hostTitle}</h3>
      <div class="custom-popup-message">
        ${title && title !== 'Konfirmasi' && title !== 'B-Glow' ? `<strong style="display: block; font-size: 1.05rem; margin-bottom: 8px; color: #ffffff;">${title}</strong>` : ''}
        ${message}
      </div>
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
