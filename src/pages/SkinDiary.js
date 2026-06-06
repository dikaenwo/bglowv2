import { icons } from '../components/BottomNav.js';
import { getRoutine, getProgress, getUserId } from '../utils/store.js';

const defaultEntries = [
  {
    date: '13 Mar 2026',
    mood: '😊',
    conditions: [
      { label: 'Kulit Bersih', type: 'good' },
      { label: 'Sedikit Berminyak', type: 'warn' },
    ],
    products: 'Somethinc Niacinamide, Wardah Sunscreen',
    notes: 'Kulit terasa lembap hari ini. T-zone sedikit berminyak di siang hari.',
    image: 'https://images.unsplash.com/photo-1616688587122-eb193c6f443c?auto=format&fit=crop&q=80&w=400'
  },
  {
    date: '12 Mar 2026',
    mood: '😐',
    conditions: [
      { label: 'Jerawat Kecil', type: 'bad' },
      { label: 'Kulit Kering', type: 'warn' },
    ],
    products: 'CeraVe Cleanser, The Ordinary HA',
    notes: 'Muncul jerawat baru di dagu. Mungkin karena moisturizer baru.',
  },
  {
    date: '11 Mar 2026',
    mood: '😊',
    conditions: [
      { label: 'Tekstur Halus', type: 'good' },
      { label: 'Terhidrasi', type: 'good' },
    ],
    products: 'Avoskin Serum, Emina Moisturizer',
    notes: 'Hari yang bagus untuk kulit! Rutinitas pagi bekerja dengan baik.',
  },
];

function getDiaryEntries() {
  const data = localStorage.getItem('bglow_diary_entries_' + getUserId());
  if (data) return JSON.parse(data);
  return [...defaultEntries];
}

function saveDiaryEntries(entries) {
  localStorage.setItem('bglow_diary_entries_' + getUserId(), JSON.stringify(entries));
}

const acneData = [3, 5, 4, 2, 3, 1, 2]; // week data
const oilData = [6, 7, 5, 6, 4, 5, 3];
const conditionData = [60, 55, 65, 70, 68, 75, 80]; // percentage
const dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export function renderSkinDiary() {
  const page = document.createElement('div');
  page.className = 'page';

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  function renderCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const monthName = new Date(year, month).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    const entriedDays = [3, 5, 8, 10, 11, 12, 13, 15, 18, 20, 22, 25];

    let daysHTML = '';
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      daysHTML += `<div class="cal-day other-month">${prevDays - i}</div>`;
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
      const hasEntry = entriedDays.includes(d);
      daysHTML += `<div class="cal-day ${isToday ? 'today' : ''}" data-day="${d}">
        ${d}
        ${hasEntry ? '<span class="day-dot"></span>' : ''}
      </div>`;
    }

    // Next month days
    const totalCells = startDay + daysInMonth;
    const remaining = 7 - (totalCells % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        daysHTML += `<div class="cal-day other-month">${i}</div>`;
      }
    }

    return { monthName, daysHTML };
  }

  let activeTab = 'entries';

  function render() {
    const { monthName, daysHTML } = renderCalendar(currentYear, currentMonth);

    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1>Diary Kulit</h1>
      </div>
      <div class="page-content">
        <!-- Calendar -->
        <div class="diary-calendar anim-fade-in">
          <div class="calendar-header">
            <div class="cal-month">${monthName}</div>
            <div class="cal-nav">
              <button id="cal-prev">${icons.chevronLeft}</button>
              <button id="cal-next">${icons.chevronRight}</button>
            </div>
          </div>
          <div class="cal-weekdays">
            <span>Sn</span><span>Sl</span><span>Rb</span><span>Km</span><span>Jm</span><span>Sb</span><span>Mg</span>
          </div>
          <div class="cal-days">${daysHTML}</div>
        </div>

        <!-- Tabs -->
        <div class="diary-tabs">
          <button class="diary-tab ${activeTab === 'entries' ? 'active' : ''}" data-tab="entries">Catatan</button>
          <button class="diary-tab ${activeTab === 'progress' ? 'active' : ''}" data-tab="progress">Perkembangan</button>
        </div>

        <!-- Tab Content -->
        <div id="tab-content"></div>
      </div>

      <!-- FAB -->
      <button class="diary-fab" id="diary-fab">${icons.plus}</button>
    `;

    // Render tab content
    const tabContent = page.querySelector('#tab-content');
    if (activeTab === 'entries') {
      renderEntries(tabContent);
    } else {
      renderProgress(tabContent);
    }

    // Events
    page.querySelector('#back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });

    page.querySelectorAll('.diary-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        render();
      });
    });

    page.querySelector('#diary-fab').addEventListener('click', () => {
      showNewEntryModal();
    });
    
    // Auto trigger
    if (window.location.hash.includes('?new=true')) {
      showNewEntryModal();
      window.location.hash = '#/diary';
    }
  }

  function renderEntries(container) {
    const entries = getDiaryEntries();
    let html = '<div class="diary-entries">';
    entries.forEach((entry, idx) => {
      html += `
        <div class="diary-entry-card" data-idx="${idx}">
          ${entry.image ? `<div class="de-img-thumb" style="background-image: url('${entry.image}')"></div>` : ''}
          <div class="de-content">
            <div class="de-header">
              <div class="de-date">${entry.date}</div>
              <div class="de-mood">${entry.mood}</div>
            </div>
            <div class="de-condition">
              ${entry.conditions.map(c => `<span class="de-tag ${c.type}">${c.label}</span>`).join('')}
            </div>
            <div class="de-products"><strong>Produk:</strong> ${entry.products}</div>
            <div class="de-notes">${entry.notes}</div>
          </div>
        </div>
      `;
    });
    html += '</div>';
    container.innerHTML = html;

    // Attach click to open detail
    container.querySelectorAll('.diary-entry-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.idx);
        showEntryDetailModal(entries[idx]);
      });
    });
  }

  function showEntryDetailModal(entry) {
    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal detail-modal">
        <div class="modal-handle"></div>
        <div class="detail-header">
          <div class="dh-date">${entry.date}</div>
          <div class="dh-mood">${entry.mood}</div>
        </div>
        
        ${entry.image ? `<div class="detail-image" style="background-image: url('${entry.image}')"></div>` : ''}
        
        <div class="detail-section">
          <h4>Kondisi Kulit</h4>
          <div class="de-condition">
            ${entry.conditions.map(c => `<span class="de-tag ${c.type}">${c.label}</span>`).join('')}
          </div>
        </div>

        <div class="detail-section">
          <h4>Produk Digunakan</h4>
          <p>${entry.products || '-'}</p>
        </div>

        <div class="detail-section">
          <h4>Catatan & Reaksi</h4>
          <p>${entry.notes || '-'}</p>
        </div>

        <button class="btn btn-primary detail-close-btn" style="margin-top:20px; width:100%">Tutup</button>
      </div>
    `;

    overlay.querySelector('.detail-close-btn').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  }

  function renderProgress(container) {
    container.innerHTML = `
      <div class="progress-section">
        <!-- Acne Chart -->
        <div class="chart-card anim-fade-in-up">
          <div class="chart-title">Level Jerawat (minggu ini)</div>
          <div class="bar-chart" id="acne-chart"></div>
        </div>

        <!-- Oil Level Chart -->
        <div class="chart-card anim-fade-in-up anim-delay-2">
          <div class="chart-title">Level Minyak (minggu ini)</div>
          <div class="bar-chart" id="oil-chart"></div>
        </div>

        <!-- Skin Condition Trend -->
        <div class="chart-card anim-fade-in-up anim-delay-4">
          <div class="chart-title">Tren Kondisi Kulit</div>
          <div class="line-chart" id="condition-chart"></div>
        </div>
      </div>
    `;

    // Acne bars
    const acneChart = container.querySelector('#acne-chart');
    acneData.forEach((val, i) => {
      const col = document.createElement('div');
      col.className = 'bar-col';
      col.innerHTML = `
        <div class="bar-fill" style="height:${val * 15}px; background: ${val > 3 ? '#EF4444' : val > 1 ? '#F59E0B' : '#10B981'};"></div>
        <span class="bar-label">${dayLabels[i]}</span>
      `;
      acneChart.appendChild(col);
    });

    // Oil bars
    const oilChart = container.querySelector('#oil-chart');
    oilData.forEach((val, i) => {
      const col = document.createElement('div');
      col.className = 'bar-col';
      col.innerHTML = `
        <div class="bar-fill" style="height:${val * 12}px; background: linear-gradient(to top, var(--primary), var(--secondary));"></div>
        <span class="bar-label">${dayLabels[i]}</span>
      `;
      oilChart.appendChild(col);
    });

    // Condition dots (positioned vertically based on value)
    const condChart = container.querySelector('#condition-chart');
    conditionData.forEach((val) => {
      const dot = document.createElement('div');
      dot.className = 'line-dot';
      dot.style.marginBottom = `${val * 0.7}px`;
      condChart.appendChild(dot);
    });
  }

  function showNewEntryModal() {
    let selectedImageURL = null;

    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal">
        <div class="modal-handle"></div>
        <div class="modal-title">Catatan Diary Baru</div>

        <div class="modal-field">
          <label>Foto Kulit (Opsional)</label>
          <div class="image-upload-wrapper">
            <input type="file" id="diary-image-upload" accept="image/*" style="display:none;" />
            <button class="image-upload-btn" id="upload-trigger-btn">
              ${icons.camera || '📷'} Ambil / Pilih Foto
            </button>
            <div id="image-preview-container" style="display:none; margin-top: 10px; position:relative;">
              <img id="diary-image-preview" src="" alt="Preview" style="border-radius:12px; max-width:100%; height:auto;" />
              <button class="remove-img-btn" id="remove-img-btn" style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.5); color:white; border:none; border-radius:50%; width:28px; height:28px; cursor:pointer;">×</button>
            </div>
          </div>
        </div>

        <div class="modal-field">
          <label>Bagaimana kondisi kulitmu hari ini?</label>
          <div class="condition-options">
            <button class="condition-chip" data-val="Bersih" data-type="good">😊 Bersih</button>
            <button class="condition-chip" data-val="Berminyak" data-type="warn">😐 Berminyak</button>
            <button class="condition-chip" data-val="Kering" data-type="warn">🤔 Kering</button>
            <button class="condition-chip" data-val="Berjerawat" data-type="bad">😟 Berjerawat</button>
            <button class="condition-chip" data-val="Sensitif" data-type="bad">😣 Sensitif</button>
          </div>
        </div>

        <div class="modal-field">
          <label>Produk yang Digunakan</label>
          <textarea id="entry-products" class="modal-textarea" placeholder="cth: Niacinamide Serum, Sunscreen SPF 50..."></textarea>
        </div>

        <div class="modal-field">
          <label>Catatan & Reaksi</label>
          <textarea id="entry-notes" class="modal-textarea" placeholder="Bagaimana kondisi kulit hari ini? Ada reaksi?"></textarea>
        </div>

        <div class="modal-actions">
          <button class="btn btn-outline" id="modal-cancel">Batal</button>
          <button class="btn btn-primary" id="modal-save">Simpan</button>
        </div>
      </div>
    `;

    // Pre-fill products if available
    const routine = getRoutine();
    const progress = getProgress();
    const allDoneProducts = [];
    ['morning', 'night'].forEach(time => {
      if (routine[time] && progress[time]) {
        progress[time].forEach(idx => {
          if (routine[time][idx]) allDoneProducts.push(routine[time][idx].product);
        });
      }
    });
    if (allDoneProducts.length > 0) {
      overlay.querySelector('#entry-products').value = [...new Set(allDoneProducts)].join(', ');
    }

    // Image Upload Logic
    const uploadInput = overlay.querySelector('#diary-image-upload');
    const uploadBtn = overlay.querySelector('#upload-trigger-btn');
    const previewContainer = overlay.querySelector('#image-preview-container');
    const previewImg = overlay.querySelector('#diary-image-preview');
    const removeImgBtn = overlay.querySelector('#remove-img-btn');

    uploadBtn.addEventListener('click', () => uploadInput.click());

    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        selectedImageURL = URL.createObjectURL(file);
        previewImg.src = selectedImageURL;
        previewContainer.style.display = 'block';
        uploadBtn.style.display = 'none';
      }
    });

    removeImgBtn.addEventListener('click', () => {
      selectedImageURL = null;
      previewInput.value = '';
      previewContainer.style.display = 'none';
      uploadBtn.style.display = 'flex';
    });

    // Condition chips
    overlay.querySelectorAll('.condition-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
      });
    });

    overlay.querySelector('#modal-cancel').addEventListener('click', () => {
      overlay.remove();
    });

    overlay.querySelector('#modal-save').addEventListener('click', () => {
      const selectedConditions = Array.from(overlay.querySelectorAll('.condition-chip.selected')).map(chip => ({
        label: chip.dataset.val,
        type: chip.dataset.type
      }));

      const products = overlay.querySelector('#entry-products').value;
      const notes = overlay.querySelector('#entry-notes').value;

      const newEntry = {
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        mood: selectedConditions.length > 0 && selectedConditions.some(c => c.type === 'bad') ? '😟' : '😊',
        conditions: selectedConditions,
        products: products || '-',
        notes: notes || '-',
        image: selectedImageURL
      };

      // Add to beginning to show immediately
      const entries = getDiaryEntries();
      entries.unshift(newEntry);
      saveDiaryEntries(entries);
      
      overlay.remove();
      render(); // re-render diary
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    document.body.appendChild(overlay);
  }

  render();
  
  // Auto-open modal if ?new=true
  if (window.location.hash.includes('?new=true')) {
    setTimeout(showNewEntryModal, 300);
    // remove hash param silently
    window.history.replaceState(null, '', window.location.pathname + '#/diary');
  }
  
  return page;
}
