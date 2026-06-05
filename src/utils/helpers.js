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
