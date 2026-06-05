import { icons } from '../components/BottomNav.js';

// ── Day names ──
const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const dayShort  = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// ── Base routine (used every day, editable) ──
const baseRoutine = {
  morning: [
    { label: 'Pembersih', product: 'Gentle Hydrating Cleanser', brand: 'Skintific', emoji: '🧴', bg: '#E8F5E9' },
    { label: 'Toner', product: 'AHA/BHA Toner', brand: 'COSRX', emoji: '🌿', bg: '#F1F8E9' },
    { label: 'Serum', product: '10% Niacinamide Serum', brand: 'Somethinc', emoji: '✨', bg: '#E8EAF6' },
    { label: 'Pelembap', product: '5X Ceramide Barrier Gel', brand: 'Skintific', emoji: '💧', bg: '#E1F5FE' },
    { label: 'Tabir Surya', product: 'Aqua Sun Gel SPF 50', brand: 'Skin Aqua', emoji: '☀️', bg: '#FFFDE7' },
  ],
  night: [
    { label: 'Pembersih', product: 'Low pH Gel Cleanser', brand: 'COSRX', emoji: '🫧', bg: '#E3F2FD' },
    { label: 'Toner', product: 'Mugwort Essence Toner', brand: 'Isntree', emoji: '🍃', bg: '#E8F5E9' },
    { label: 'Pelembap', product: 'Snail Repair Cream', brand: 'COSRX', emoji: '🐌', bg: '#FFF3E0' },
  ],
};

// ── Special products for certain days (dynamic, user-editable) ──
// dayIndex: 0=Minggu, 1=Senin, 2=Selasa, 3=Rabu, 4=Kamis, 5=Jumat, 6=Sabtu
const specialSchedule = {
  morning: {},
  night: {
    1: [
      { label: 'Serum Exfo', product: 'AHA 7 Whitehead Power', brand: 'COSRX', emoji: '⚗️', bg: '#FCE4EC', insertAfter: 'Toner' },
    ],
    2: [
      { label: 'Serum Exfo', product: 'AHA BHA PHA 30 Days Serum', brand: 'Some By Mi', emoji: '⚗️', bg: '#FCE4EC', insertAfter: 'Toner' },
    ],
    3: [
      { label: 'Masker', product: 'Mugwort Mask', brand: "I'm From", emoji: '🧖', bg: '#E8F5E9', insertAfter: 'Toner' },
    ],
    4: [
      { label: 'Masker', product: 'Centella Calming Mask', brand: 'Mediheal', emoji: '🧖', bg: '#E8F5E9', insertAfter: 'Toner' },
    ],
    5: [
      { label: 'Serum Retinol', product: 'Retinol 0.5% Serum', brand: 'Avoskin', emoji: '🌟', bg: '#FFF3E0', insertAfter: 'Toner' },
    ],
    6: [
      { label: 'Masker', product: 'Wash-Off Clay Mask', brand: 'Innisfree', emoji: '🧖', bg: '#E8F5E9', insertAfter: 'Pembersih' },
    ],
    0: [
      { label: 'Serum Retinol', product: 'Retinol 0.3% in Squalane', brand: 'The Ordinary', emoji: '🌟', bg: '#FFF3E0', insertAfter: 'Toner' },
    ],
  },
};

// ── Streak data (simulated) ──
const streakData = { current: 7, best: 14, completedDays: [true, true, true, true, true, true, true] };

// ── Step type options ──
const stepTypes = [
  { label: 'Pembersih', emoji: '🧴', bg: '#E8F5E9' },
  { label: 'Toner', emoji: '🌿', bg: '#F1F8E9' },
  { label: 'Serum', emoji: '✨', bg: '#E8EAF6' },
  { label: 'Pelembap', emoji: '💧', bg: '#E1F5FE' },
  { label: 'Tabir Surya', emoji: '☀️', bg: '#FFFDE7' },
  { label: 'Masker', emoji: '🧖', bg: '#FCE4EC' },
  { label: 'Exfoliator', emoji: '🫧', bg: '#E3F2FD' },
  { label: 'Retinol', emoji: '🌟', bg: '#FFF3E0' },
  { label: 'Eye Cream', emoji: '👁️', bg: '#F3E5F5' },
  { label: 'Lainnya', emoji: '💎', bg: '#ECEFF1' },
];

function getStepsForDay(dayIndex, timeOfDay) {
  const base = baseRoutine[timeOfDay].map(s => ({ ...s, _source: 'base' }));
  const schedule = specialSchedule[timeOfDay];

  if (schedule && schedule[dayIndex]) {
    schedule[dayIndex].forEach(sp => {
      const item = { ...sp, _source: 'special' };
      const insertIdx = base.findIndex(s => s.label === sp.insertAfter);
      if (insertIdx !== -1) {
        base.splice(insertIdx + 1, 0, item);
      } else {
        base.push(item);
      }
    });
  }

  base.forEach((s, i) => { s.step = `Langkah ${i + 1}`; });
  return base;
}

export function renderRoutine() {
  const page = document.createElement('div');
  page.className = 'page';

  const today = new Date();
  let selectedDay = today.getDay();
  let currentTime = 'morning';
  let checkedSteps = {};

  for (let d = 0; d < 7; d++) {
    checkedSteps[`${d}_morning`] = new Set();
    checkedSteps[`${d}_night`] = new Set();
  }

  function getKey() { return `${selectedDay}_${currentTime}`; }

  function getProgress() {
    const steps = getStepsForDay(selectedDay, currentTime);
    const done = checkedSteps[getKey()] ? checkedSteps[getKey()].size : 0;
    return steps.length > 0 ? Math.round((done / steps.length) * 100) : 0;
  }

  function hasSpecial(dayIdx) {
    return (specialSchedule.morning[dayIdx] && specialSchedule.morning[dayIdx].length > 0) ||
           (specialSchedule.night[dayIdx] && specialSchedule.night[dayIdx].length > 0);
  }

  function getSpecialLabels(dayIdx) {
    const labels = [];
    ['morning', 'night'].forEach(t => {
      if (specialSchedule[t][dayIdx]) {
        specialSchedule[t][dayIdx].forEach(s => {
          if (!labels.includes(s.label)) labels.push(s.label);
        });
      }
    });
    return labels.join(', ');
  }

  function render() {
    const steps = getStepsForDay(selectedDay, currentTime);
    const progress = getProgress();
    const key = getKey();
    if (!checkedSteps[key]) checkedSteps[key] = new Set();
    const doneCount = checkedSteps[key].size;
    const isToday = selectedDay === today.getDay();
    const specialLabels = getSpecialLabels(selectedDay);

    page.innerHTML = `
      <div class="page-header">
        <h1>Rutinitas Saya</h1>
      </div>
      <div class="page-content">
        <!-- Streak Banner -->
        <div class="streak-banner anim-fade-in">
          <div class="streak-fire">🔥</div>
          <div class="streak-info">
            <div class="streak-count">${streakData.current} Hari Beruntun!</div>
            <div class="streak-sub">Rekor terbaik: ${streakData.best} hari</div>
          </div>
          <div class="streak-dots">
            ${Array.from({length: 7}).map((_, i) => {
              const dayIdx = (today.getDay() - 6 + i + 7) % 7;
              return `<div class="streak-dot ${streakData.completedDays[i] ? 'done' : ''} ${i === 6 ? 'today' : ''}">
                <span class="sd-label">${dayShort[dayIdx]}</span>
              </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Weekly Day Selector -->
        <div class="week-selector anim-fade-in-up anim-delay-1">
          ${dayShort.map((d, i) => `
            <button class="week-day ${i === selectedDay ? 'active' : ''} ${i === today.getDay() ? 'is-today' : ''}" data-day="${i}">
              <span class="wd-name">${d}</span>
              ${hasSpecial(i) ? '<span class="wd-special-dot"></span>' : ''}
            </button>
          `).join('')}
        </div>

        <!-- Day Info -->
        <div class="day-info-bar anim-fade-in-up anim-delay-2">
          <div class="dib-day">${dayNames[selectedDay]}${isToday ? ' (Hari ini)' : ''}</div>
          ${specialLabels ? `<div class="dib-special">⭐ ${specialLabels}</div>` : '<div class="dib-special dib-normal">Rutinitas biasa</div>'}
        </div>

        <!-- Progress Ring -->
        <div class="routine-progress-card anim-fade-in-up anim-delay-2">
          <div class="routine-ring">
            <svg viewBox="0 0 80 80">
              <circle class="rr-bg" cx="40" cy="40" r="35"/>
              <circle class="rr-fill" cx="40" cy="40" r="35" id="routine-ring-fill"/>
            </svg>
            <div class="rr-value" id="routine-percent">0%</div>
          </div>
          <div class="routine-progress-info">
            <h3>${progress === 100 ? 'Selesai Semua! ✨' : 'Terus Lanjutkan!'}</h3>
            <p>${doneCount} dari ${steps.length} langkah selesai</p>
          </div>
        </div>

        <!-- Toggle -->
        <div class="routine-toggle">
          <button class="routine-toggle-btn ${currentTime === 'morning' ? 'active' : ''}" data-time="morning">
            <span class="toggle-emoji">🌅</span> Pagi
          </button>
          <button class="routine-toggle-btn ${currentTime === 'night' ? 'active' : ''}" data-time="night">
            <span class="toggle-emoji">🌙</span> Malam
          </button>
        </div>

        <!-- Steps -->
        <div class="routine-steps" id="routine-steps">
          ${steps.map((s, i) => {
            const isDone = checkedSteps[key].has(i);
            const isSpecial = s._source === 'special';
            return `
            <div class="routine-step ${isDone ? 'done' : ''} ${isSpecial ? 'special-step' : ''}" data-idx="${i}">
              <div class="rs-icon" style="background:${s.bg}">${s.emoji}</div>
              <div class="rs-info">
                <div class="rs-step-label">
                  ${s.step} — ${s.label}
                  ${isSpecial ? '<span class="special-star">⭐</span>' : ''}
                </div>
                <div class="rs-product-name">${s.product}</div>
                <div class="rs-product-brand">${s.brand}${isSpecial ? ` · Khusus ${dayNames[selectedDay]}` : ''}</div>
              </div>
              <div class="rs-actions">
                <div class="rs-check ${isDone ? 'checked' : ''}" data-idx="${i}">
                  ${icons.check}
                </div>
                <button class="rs-delete" data-idx="${i}" data-source="${s._source}" title="Hapus langkah">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          `}).join('')}
        </div>

        <!-- Action Buttons -->
        <div class="routine-action-group">
          <button class="add-step-btn" id="add-step-btn">
            ${icons.plus} Tambah Langkah Harian
          </button>
          <button class="add-step-btn add-special-btn" id="add-special-btn">
            ⭐ Tambah Produk Khusus Hari Tertentu
          </button>
        </div>
      </div>
    `;

    // ── Event Listeners ──
    page.querySelectorAll('.week-day').forEach(btn => {
      btn.addEventListener('click', () => { selectedDay = parseInt(btn.dataset.day); render(); });
    });

    page.querySelectorAll('.routine-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => { currentTime = btn.dataset.time; render(); });
    });

    page.querySelectorAll('.rs-check').forEach(chk => {
      chk.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(chk.dataset.idx);
        checkedSteps[key].has(idx) ? checkedSteps[key].delete(idx) : checkedSteps[key].add(idx);
        
        // Check if just reached 100%
        const newProgress = getProgress();
        if (newProgress === 100 && !chk.classList.contains('checked')) {
          createFireAnimation();
        }

        render();
      });
    });

  function createFireAnimation() {
    for (let i = 0; i < 30; i++) {
      const fire = document.createElement('div');
      fire.className = 'fire-particle';
      fire.textContent = '🔥';
      fire.style.left = Math.random() * 100 + 'vw';
      fire.style.animationDelay = Math.random() * 1.5 + 's';
      fire.style.fontSize = (Math.random() * 2 + 1) + 'rem';
      document.body.appendChild(fire);
      setTimeout(() => fire.remove(), 2500);
    }
  }

    page.querySelector('#add-step-btn').addEventListener('click', () => showAddStepModal(false));
    page.querySelector('#add-special-btn').addEventListener('click', () => showAddStepModal(true));

    page.querySelectorAll('.rs-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        const source = btn.dataset.source;
        const step = steps[idx];
        showDeleteConfirm(idx, step, source);
      });
    });

    // Animate progress ring
    setTimeout(() => {
      const fill = page.querySelector('#routine-ring-fill');
      const pct = page.querySelector('#routine-percent');
      if (fill) fill.style.strokeDashoffset = 220 - (220 * progress / 100);
      if (pct) {
        let cur = 0;
        const sv = progress / 20;
        const timer = setInterval(() => {
          cur += sv;
          if (cur >= progress) { cur = progress; clearInterval(timer); }
          pct.textContent = `${Math.round(cur)}%`;
        }, 30);
      }
    }, 300);
  }

  // ── Delete Confirm ──
  function showDeleteConfirm(idx, step, source) {
    const isSpecial = source === 'special';
    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal delete-confirm-modal">
        <div class="modal-handle"></div>
        <div class="delete-confirm-icon">${isSpecial ? '⭐' : '🗑️'}</div>
        <div class="modal-title">${isSpecial ? 'Hapus Produk Khusus?' : 'Hapus Langkah?'}</div>
        <p class="delete-confirm-text">
          ${isSpecial
            ? `Yakin ingin menghapus <strong>${step.product}</strong> (${step.label}) dari jadwal <strong>${dayNames[selectedDay]}</strong> ${currentTime === 'morning' ? 'pagi' : 'malam'}?`
            : `Yakin ingin menghapus <strong>${step.product}</strong> (${step.label}) dari rutinitas harian ${currentTime === 'morning' ? 'pagi' : 'malam'}?`
          }
        </p>
        <div class="modal-actions">
          <button class="btn btn-outline" id="del-cancel">Batal</button>
          <button class="btn btn-danger" id="del-confirm">Hapus</button>
        </div>
      </div>
    `;

    overlay.querySelector('#del-cancel').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#del-confirm').addEventListener('click', () => {
      if (isSpecial) {
        // Find and remove from specialSchedule
        const specials = specialSchedule[currentTime][selectedDay];
        if (specials) {
          const spIdx = specials.findIndex(s => s.product === step.product && s.label === step.label);
          if (spIdx !== -1) specials.splice(spIdx, 1);
          if (specials.length === 0) delete specialSchedule[currentTime][selectedDay];
        }
      } else {
        // Find the correct base index (exclude specials before this idx)
        let baseIdx = 0;
        const allSteps = getStepsForDay(selectedDay, currentTime);
        for (let i = 0; i < idx; i++) {
          if (allSteps[i]._source === 'base') baseIdx++;
        }
        baseRoutine[currentTime].splice(baseIdx, 1);
      }
      checkedSteps[getKey()] = new Set();
      overlay.remove();
      render();
    });

    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  // ── Add Step Modal (dual mode: daily base step OR special per-day step) ──
  function showAddStepModal(isSpecialMode) {
    let selectedType = null;
    let selectedDays = isSpecialMode ? new Set() : null;
    let selectedInsertAfter = null;
    let targetTime = currentTime; // default to current view

    const getBaseLabels = (time) => baseRoutine[time].map(s => s.label);
    
    // We need to re-render insert options if time changes in special mode
    function updateInsertOptions(overlay, time) {
      if (!isSpecialMode) return;
      const bLabels = getBaseLabels(time);
      const container = overlay.querySelector('.insert-after-options');
      container.innerHTML = bLabels.map(l => `
        <button class="insert-pick-chip" data-label="${l}">${l}</button>
      `).join('') + '<button class="insert-pick-chip" data-label="_last">Di Akhir</button>';

      container.querySelectorAll('.insert-pick-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          container.querySelectorAll('.insert-pick-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
          selectedInsertAfter = chip.dataset.label;
        });
      });
      selectedInsertAfter = null; // reset
    }

    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal add-step-modal">
        <div class="modal-handle"></div>
        <div class="modal-title">${isSpecialMode ? '⭐ Tambah Produk Khusus' : 'Tambah Langkah Harian'}</div>
        ${isSpecialMode ? '<p class="modal-subtitle">Produk ini hanya muncul di hari yang dipilih</p>' : ''}

        <div class="modal-field">
          <label>Waktu Rutinitas</label>
          <div class="time-picker-modal">
            <button class="time-pick-btn ${targetTime === 'morning' ? 'active' : ''}" data-time="morning">🌅 Pagi</button>
            <button class="time-pick-btn ${targetTime === 'night' ? 'active' : ''}" data-time="night">🌙 Malam</button>
          </div>
        </div>

        <div class="modal-field">
          <label>Jenis Produk</label>
          <div class="step-type-grid">
            ${stepTypes.map((t, i) => `
              <button class="step-type-chip" data-idx="${i}">
                <span class="stc-emoji">${t.emoji}</span>
                <span class="stc-label">${t.label}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="modal-field">
          <label>Nama Produk</label>
          <input class="auth-input" type="text" id="step-product" placeholder="cth: Retinol 0.5% Serum" />
        </div>

        <div class="modal-field">
          <label>Brand / Merek</label>
          <input class="auth-input" type="text" id="step-brand" placeholder="cth: Avoskin" />
        </div>

        ${isSpecialMode ? `
          <div class="modal-field">
            <label>Pilih Hari</label>
            <div class="day-picker">
              ${dayShort.map((d, i) => `
                <button class="day-pick-chip" data-day="${i}">${d}</button>
              `).join('')}
            </div>
          </div>

          <div class="modal-field">
            <label>Sisipkan Setelah</label>
            <div class="insert-after-options">
              <!-- populated dynamically -->
            </div>
          </div>
        ` : ''}

        <div class="modal-actions">
          <button class="btn btn-outline" id="modal-cancel">Batal</button>
          <button class="btn btn-primary" id="modal-save">${isSpecialMode ? 'Tambah Khusus' : 'Tambah'}</button>
        </div>
      </div>
    `;

    // Time picker
    overlay.querySelectorAll('.time-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        overlay.querySelectorAll('.time-pick-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        targetTime = btn.dataset.time;
        if (isSpecialMode) updateInsertOptions(overlay, targetTime);
      });
    });

    if (isSpecialMode) {
      updateInsertOptions(overlay, targetTime);
    }

    // Type chips
    overlay.querySelectorAll('.step-type-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        overlay.querySelectorAll('.step-type-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        selectedType = parseInt(chip.dataset.idx);
      });
    });

    // Day picker (special mode)
    if (isSpecialMode) {
      overlay.querySelectorAll('.day-pick-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const day = parseInt(chip.dataset.day);
          if (selectedDays.has(day)) {
            selectedDays.delete(day);
            chip.classList.remove('selected');
          } else {
            selectedDays.add(day);
            chip.classList.add('selected');
          }
        });
      });
    }

    overlay.querySelector('#modal-cancel').addEventListener('click', () => overlay.remove());

    overlay.querySelector('#modal-save').addEventListener('click', () => {
      const productName = overlay.querySelector('#step-product').value.trim();
      const brandName = overlay.querySelector('#step-brand').value.trim();

      if (selectedType === null || !productName) {
        shakeModal(overlay);
        return;
      }

      if (isSpecialMode && selectedDays.size === 0) {
        shakeModal(overlay);
        return;
      }

      const type = stepTypes[selectedType];
      const targetLabels = getBaseLabels(targetTime);

      if (isSpecialMode) {
        // Add to each selected day
        const insertLabel = selectedInsertAfter === '_last' ? null : selectedInsertAfter;
        selectedDays.forEach(day => {
          if (!specialSchedule[targetTime][day]) specialSchedule[targetTime][day] = [];
          specialSchedule[targetTime][day].push({
            label: type.label,
            product: productName,
            brand: brandName || '-',
            emoji: type.emoji,
            bg: type.bg,
            insertAfter: insertLabel || (targetLabels.length > 0 ? targetLabels[targetLabels.length - 1] : null),
          });
        });
      } else {
        // Add to base routine
        baseRoutine[targetTime].push({
          label: type.label,
          product: productName,
          brand: brandName || '-',
          emoji: type.emoji,
          bg: type.bg,
        });
      }

      overlay.remove();
      // auto-switch to target time to show the newly added step
      currentTime = targetTime;
      render();
    });

    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  function shakeModal(overlay) {
    const modal = overlay.querySelector('.add-step-modal') || overlay.querySelector('.diary-modal');
    modal.style.animation = 'none';
    modal.offsetHeight;
    modal.style.animation = 'shake 0.4s ease';
  }

  render();
  return page;
}
