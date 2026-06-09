import { icons } from '../components/BottomNav.js';
import { getRoutine, getProgress, getUserId, syncUserData } from '../utils/store.js';

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
  return [];
}

function saveDiaryEntries(entries) {
  localStorage.setItem('bglow_diary_entries_' + getUserId(), JSON.stringify(entries));
  syncUserData({ diary_entries: JSON.stringify(entries) });
}

const acneData = [3, 5, 4, 2, 3, 1, 2]; // week data
const oilData = [6, 7, 5, 6, 4, 5, 3];
const conditionData = [60, 55, 65, 70, 68, 75, 80]; // percentage
const dayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export function renderSkinDiary() {
  const page = document.createElement('div');
  page.className = 'page';

  const now = new Date();
  let currentMonth = now.getMonth();
  let currentYear = now.getFullYear();
  let selectedDay = now.getDate();
  let isFutureDate = false;

  function renderCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const monthName = new Date(year, month).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

    // Parse entriedDays from actual diary entries
    const entries = getDiaryEntries();
    const entriedDays = [];
    entries.forEach(entry => {
      try {
        const parts = entry.date.split(' '); // e.g. ['8', 'Jun', '2026']
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const monthStr = parts[1].toLowerCase();
          const entryYear = parseInt(parts[2]);
          
          const monthMap = {
            'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'mei': 4, 'jun': 5,
            'jul': 6, 'agu': 7, 'sep': 8, 'okt': 9, 'nov': 10, 'des': 11
          };
          
          let mIdx = -1;
          for (const key in monthMap) {
            if (monthStr.startsWith(key)) {
              mIdx = monthMap[key];
              break;
            }
          }
          
          if (entryYear === year && mIdx === month) {
            entriedDays.push(day);
          }
        }
      } catch (e) {
        console.error("Gagal parse tanggal diary:", e);
      }
    });

    let daysHTML = '';
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      daysHTML += `<div class="cal-day other-month">${prevDays - i}</div>`;
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
      const isSelected = d === selectedDay;
      const hasEntry = entriedDays.includes(d);
      
      // Check if this day is in the future
      const isFuture = (year > now.getFullYear()) || 
                       (year === now.getFullYear() && month > now.getMonth()) ||
                       (year === now.getFullYear() && month === now.getMonth() && d > now.getDate());

      daysHTML += `<div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isFuture ? 'future-day' : ''}" data-day="${d}">
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
    isFutureDate = (currentYear > now.getFullYear()) ||
                   (currentYear === now.getFullYear() && currentMonth > now.getMonth()) ||
                   (currentYear === now.getFullYear() && currentMonth === now.getMonth() && selectedDay > now.getDate());

    const { monthName, daysHTML } = renderCalendar(currentYear, currentMonth);

    page.innerHTML = `
      <div class="page-header">
        <button class="back-btn" id="back-btn">${icons.chevronLeft}</button>
        <h1 style="width: 100%; text-align: center; margin-right: 40px;">Diary Kulit</h1>
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
      <button class="diary-fab" id="diary-fab" style="display: ${isFutureDate ? 'none' : 'flex'}">${icons.plus}</button>
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

    // Day selection events
    page.querySelectorAll('.cal-days .cal-day').forEach(dayEl => {
      dayEl.addEventListener('click', () => {
        const day = parseInt(dayEl.dataset.day);
        if (day) {
          selectedDay = day;
          render();
        }
      });
    });

    const prevBtn = page.querySelector('#cal-prev');
    const nextBtn = page.querySelector('#cal-next');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
        if (currentMonth === now.getMonth() && currentYear === now.getFullYear()) {
          selectedDay = now.getDate();
        } else {
          selectedDay = 1;
        }
        render();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }
        if (currentMonth === now.getMonth() && currentYear === now.getFullYear()) {
          selectedDay = now.getDate();
        } else {
          selectedDay = 1;
        }
        render();
      });
    }

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
    if (isFutureDate) {
      container.innerHTML = `
        <div class="empty-state anim-fade-in" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 40px 20px; text-align:center; background: var(--bg-card); border-radius: 16px; border: 1px dashed var(--border-light); margin: 16px 0;">
          <div style="font-size:3.5rem; margin-bottom:16px;">🔒</div>
          <h3 style="color:var(--text-secondary); font-size:0.95rem; font-weight:500; line-height: 1.5;">Belum dapat mengisi catatan dan perkembangan</h3>
        </div>
      `;
      return;
    }

    const entries = getDiaryEntries();
    const dateStr = new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const filteredEntries = entries.filter(e => e.date === dateStr);

    if (filteredEntries.length === 0) {
      container.innerHTML = `
        <div class="empty-state anim-fade-in" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 40px 20px; text-align:center; background: var(--bg-card); border-radius: 16px; border: 1px dashed var(--border-light); margin: 16px 0;">
          <div style="font-size:3.5rem; margin-bottom:16px;">📔</div>
          <h3 style="margin-bottom:8px; color: var(--text-primary); font-size: 1.1rem; font-weight: 600;">Belum Ada Catatan</h3>
          <p style="color:var(--text-secondary); margin-bottom:16px; line-height:1.5; font-size:0.85rem;">
            Catat perkembangan kulit Anda pada tanggal <strong>${dateStr}</strong> dengan menekan tombol "+" di bawah.
          </p>
        </div>
      `;
      return;
    }

    let html = '<div class="diary-entries">';
    filteredEntries.forEach((entry, idx) => {
      const originalIdx = entries.findIndex(e => e.date === entry.date && e.notes === entry.notes);
      html += `
        <div class="diary-entry-card" data-idx="${originalIdx}">
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
    if (isFutureDate) {
      container.innerHTML = `
        <div class="empty-state anim-fade-in" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 40px 20px; text-align:center; background: var(--bg-card); border-radius: 16px; border: 1px dashed var(--border-light); margin: 16px 0;">
          <div style="font-size:3.5rem; margin-bottom:16px;">🔒</div>
          <h3 style="color:var(--text-secondary); font-size:0.95rem; font-weight:500; line-height: 1.5;">Belum dapat mengisi catatan dan perkembangan</h3>
        </div>
      `;
      return;
    }

    const entries = getDiaryEntries();
    if (entries.length === 0) {
      container.innerHTML = `
        <div class="empty-state anim-fade-in" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 40px 20px; text-align:center; background: var(--bg-card); border-radius: 16px; border: 1px dashed var(--border-light); margin: 16px 0;">
          <div style="font-size:3.5rem; margin-bottom:16px;">📈</div>
          <h3 style="margin-bottom:8px; color: var(--text-primary); font-size: 1.1rem; font-weight: 600;">Belum Ada Analisis</h3>
          <p style="color:var(--text-secondary); line-height:1.5; font-size:0.85rem;">
            Grafik perkembangan akan muncul setelah Anda mulai menyimpan catatan diary harian Anda.
          </p>
        </div>
      `;
      return;
    }

    // Get current week's dates (Monday to Sunday) relative to selectedDay
    const selectedDateObj = new Date(currentYear, currentMonth, selectedDay);
    const dayOfWeek = selectedDateObj.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const distanceToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(selectedDateObj);
    monday.setDate(selectedDateObj.getDate() - distanceToMonday);

    const weekEntries = []; // length 7, for Sen to Min
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      
      // Find entry for this date
      const found = entries.find(e => e.date === dateStr);
      weekEntries.push(found || null);
    }

    // Map weekEntries to acne level, oil level, and condition percentage
    const acneData = weekEntries.map(entry => {
      if (!entry) return 0;
      let score = 1; // baseline if entered
      const conds = entry.conditions || [];
      if (conds.some(c => c.label === 'Berjerawat')) score += 3;
      if (conds.some(c => c.label === 'Sensitif')) score += 1;
      return Math.min(5, score);
    });

    const oilData = weekEntries.map(entry => {
      if (!entry) return 0;
      let score = 4; // baseline is balanced (4)
      const conds = entry.conditions || [];
      if (conds.some(c => c.label === 'Berminyak')) score = 6;
      else if (conds.some(c => c.label === 'Kering')) score = 2;
      return score;
    });

    const conditionData = weekEntries.map(entry => {
      if (!entry) return null; // Use null for days without entries to skip drawing
      let pct = 60; // base percentage
      const conds = entry.conditions || [];
      conds.forEach(c => {
        if (c.type === 'good') pct += 20;
        else if (c.type === 'warn') pct -= 10;
        else if (c.type === 'bad') pct -= 20;
      });
      return Math.max(0, Math.min(100, pct));
    });

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
      if (val === null) {
        dot.style.visibility = 'hidden';
      } else {
        dot.style.marginBottom = `${val * 0.7}px`;
      }
      condChart.appendChild(dot);
    });
  }

  function showNewEntryModal() {
    let selectedImageURL = null;
    let localStream = null;

    const stopLocalStream = () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
      }
    };

    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal">
        <div class="modal-handle"></div>
        <div class="modal-title">Catatan Diary Baru</div>

        <div class="modal-field">
          <label>Foto Kulit (Opsional)</label>
          <div class="image-upload-wrapper">
            <input type="file" id="diary-image-camera" accept="image/*" capture="environment" style="display:none;" />
            <input type="file" id="diary-image-gallery" accept="image/*" style="display:none;" />
            
            <div id="upload-buttons-container" style="display:flex; gap: 10px;">
              <button class="image-upload-btn" id="camera-trigger-btn" style="flex: 1; padding: 12px; font-size: 0.85rem; justify-content: center;">
                ${icons.camera || '📷'} Ambil Foto
              </button>
              <button class="image-upload-btn" id="gallery-trigger-btn" style="flex: 1; padding: 12px; font-size: 0.85rem; justify-content: center;">
                🖼️ Pilih Galeri
              </button>
            </div>

            <!-- Webcam stream container -->
            <div id="camera-stream-container" style="display:none; flex-direction:column; gap:10px; align-items:center; margin-top:10px;">
              <video id="diary-webcam" autoplay playsinline style="width: 100%; max-height: 240px; border-radius: 12px; background: #000; object-fit: cover; transform: scaleX(-1);"></video>
              <div style="display:flex; gap: 10px; width: 100%;">
                <button class="btn btn-outline" id="camera-cancel-btn" style="flex: 1; padding: 8px; font-size: 0.8rem; height: 36px; display: flex; align-items: center; justify-content: center;">Batal</button>
                <button class="btn btn-primary" id="camera-capture-btn" style="flex: 1; padding: 8px; font-size: 0.8rem; height: 36px; display: flex; align-items: center; justify-content: center;">Jepret</button>
              </div>
            </div>
            
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
    const cameraInput = overlay.querySelector('#diary-image-camera');
    const galleryInput = overlay.querySelector('#diary-image-gallery');
    const cameraBtn = overlay.querySelector('#camera-trigger-btn');
    const galleryBtn = overlay.querySelector('#gallery-trigger-btn');
    const buttonsContainer = overlay.querySelector('#upload-buttons-container');
    const cameraStreamContainer = overlay.querySelector('#camera-stream-container');
    const captureBtn = overlay.querySelector('#camera-capture-btn');
    const cancelCaptureBtn = overlay.querySelector('#camera-cancel-btn');
    const videoElement = overlay.querySelector('#diary-webcam');
    
    const previewContainer = overlay.querySelector('#image-preview-container');
    const previewImg = overlay.querySelector('#diary-image-preview');
    const removeImgBtn = overlay.querySelector('#remove-img-btn');

    // "Ambil Foto" click handler - try webcam getUserMedia
    cameraBtn.addEventListener('click', () => {
      buttonsContainer.style.display = 'none';
      cameraStreamContainer.style.display = 'flex';
      
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
      })
      .then(s => {
        localStream = s;
        if (videoElement) {
          videoElement.srcObject = s;
          videoElement.play();
        }
      })
      .catch(err => {
        console.warn("Gagal membuka webcam, fallback ke input camera intent:", err);
        // Stop stream if any, clean up UI
        stopLocalStream();
        cameraStreamContainer.style.display = 'none';
        buttonsContainer.style.display = 'flex';
        // Fallback: trigger system native camera
        cameraInput.click();
      });
    });

    // "Jepret" click handler
    captureBtn.addEventListener('click', () => {
      if (videoElement && localStream) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = videoElement.videoWidth || 640;
          canvas.height = videoElement.videoHeight || 480;
          const ctx = canvas.getContext('2d');
          
          // Mirror image for front camera feel
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
          
          selectedImageURL = canvas.toDataURL('image/jpeg', 0.85);
          previewImg.src = selectedImageURL;
          previewContainer.style.display = 'block';
          
          stopLocalStream();
          cameraStreamContainer.style.display = 'none';
        } catch (e) {
          console.error("Gagal menangkap gambar dari webcam stream:", e);
        }
      }
    });

    // Cancel webcam capture handler
    cancelCaptureBtn.addEventListener('click', () => {
      stopLocalStream();
      cameraStreamContainer.style.display = 'none';
      buttonsContainer.style.display = 'flex';
    });

    // "Pilih Galeri" click handler
    galleryBtn.addEventListener('click', () => galleryInput.click());

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Ukuran foto terlalu besar. Maksimal 5MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const maxSize = 600; // max size of 600px is great for diary photos
            let w = img.width;
            let h = img.height;
            if (w > h) {
              if (w > maxSize) { h = (h * maxSize) / w; w = maxSize; }
            } else {
              if (h > maxSize) { w = (w * maxSize) / h; h = maxSize; }
            }
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            
            selectedImageURL = canvas.toDataURL('image/jpeg', 0.85);
            previewImg.src = selectedImageURL;
            previewContainer.style.display = 'block';
            buttonsContainer.style.display = 'none';
          };
          img.src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    cameraInput.addEventListener('change', handleImageChange);
    galleryInput.addEventListener('change', handleImageChange);

    removeImgBtn.addEventListener('click', () => {
      selectedImageURL = null;
      cameraInput.value = '';
      galleryInput.value = '';
      previewContainer.style.display = 'none';
      buttonsContainer.style.display = 'flex';
    });

    // Condition chips
    overlay.querySelectorAll('.condition-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
      });
    });

    overlay.querySelector('#modal-cancel').addEventListener('click', () => {
      stopLocalStream();
      overlay.remove();
    });

    overlay.querySelector('#modal-save').addEventListener('click', () => {
      const selectedConditions = Array.from(overlay.querySelectorAll('.condition-chip.selected')).map(chip => ({
        label: chip.dataset.val,
        type: chip.dataset.type
      }));

      const products = overlay.querySelector('#entry-products').value;
      const notes = overlay.querySelector('#entry-notes').value;

      const dateStr = new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const newEntry = {
        date: dateStr,
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
      
      stopLocalStream();
      overlay.remove();
      render(); // re-render diary
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        stopLocalStream();
        overlay.remove();
      }
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
