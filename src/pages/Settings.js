import { icons } from '../components/BottomNav.js';
import { clearUserData, getUserId, getAuthHeaders } from '../utils/store.js';
import { showCustomAlert, showCustomConfirm } from '../utils/helpers.js';
import { API_BASE_URL } from '../config.js';

export function renderSettings() {
  const page = document.createElement('div');
  page.className = 'page';

  page.innerHTML = `
    <style>
      .premium-select {
        appearance: none !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") !important;
        background-repeat: no-repeat !important;
        background-position: right 14px center !important;
        background-size: 16px !important;
        padding-right: 40px !important;
        cursor: pointer !important;
        background-color: white !important;
        font-family: inherit !important;
        transition: all 0.2s ease !important;
      }
      .premium-select:focus {
        border-color: var(--primary) !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        outline: none !important;
      }
    </style>
    <div class="page-header">
      <h1>Pengaturan</h1>
    </div>
    <div class="profile-menu">
      <div class="menu-section">
        <div class="menu-section-title">Aplikasi</div>
        <div class="menu-item anim-fade-in-up anim-delay-3" id="menu-edit-profile" style="cursor:pointer;">
          <div class="mi-icon blue">${icons.profile}</div>
          <span class="mi-text">Edit Profil</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-4" id="menu-privacy" style="cursor:pointer;">
          <div class="mi-icon green">${icons.shield}</div>
          <span class="mi-text">Privasi & Keamanan</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-5" id="menu-skin-profile" style="cursor:pointer;">
          <div class="mi-icon blue">${icons.droplet}</div>
          <span class="mi-text">Profil Kulit</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
      </div>

      <div class="menu-section">
        <div class="menu-section-title">Dukungan</div>
        <div class="menu-item anim-fade-in-up anim-delay-5" id="menu-rate-bglow" style="cursor:pointer;">
          <div class="mi-icon amber">${icons.star}</div>
          <span class="mi-text">Nilai B-Glow</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-6" id="menu-help" style="cursor:pointer;">
          <div class="mi-icon blue">${icons.info}</div>
          <span class="mi-text">Bantuan & Dukungan</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-7" id="logout-btn" style="cursor:pointer;">
          <div class="mi-icon red">${icons.logout}</div>
          <span class="mi-text" style="color:var(--danger);">Keluar</span>
          <span class="mi-arrow"></span>
        </div>
      </div>
    </div>
    <div class="profile-version">B-Glow v1.0.0</div>
  `;

  // Attach Events
  setTimeout(() => {
    const logoutBtn = page.querySelector('#logout-btn');
    const editProfileBtn = page.querySelector('#menu-edit-profile');
    const skinProfileBtn = page.querySelector('#menu-skin-profile');
    const privacyBtn = page.querySelector('#menu-privacy');
    const rateBtn = page.querySelector('#menu-rate-bglow');
    const helpBtn = page.querySelector('#menu-help');

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        clearUserData();
        localStorage.setItem('bglow_auth', '0');
        localStorage.removeItem('bglow_user');
        localStorage.removeItem('bglow_token'); // Hapus JWT token saat logout
        window.location.hash = '#/login';
      });
    }

    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', () => {
        openEditProfileModal();
      });
    }

    if (skinProfileBtn) {
      skinProfileBtn.addEventListener('click', () => {
        openSkinProfileModal();
      });
    }

    if (privacyBtn) {
      privacyBtn.addEventListener('click', () => {
        openPrivacyModal();
      });
    }

    if (rateBtn) {
      rateBtn.addEventListener('click', () => {
        openRateModal();
      });
    }

    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        openHelpModal();
      });
    }
  }, 0);

  function openEditProfileModal() {
    const userId = getUserId();
    let userName = '';
    let userEmail = '';
    
    const userStr = localStorage.getItem('bglow_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userName = user.name || '';
        userEmail = user.email || '';
      } catch (e) {}
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal" style="border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
        <div class="modal-handle"></div>
        <div class="modal-title">Edit Profil</div>
        
        <div class="modal-field">
          <label>Nama Lengkap</label>
          <input type="text" id="edit-name" class="auth-input" value="${userName}" style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 12px; width: 100%; box-sizing: border-box;" />
        </div>
        
        <div class="modal-field">
          <label>Email</label>
          <input type="email" id="edit-email" class="auth-input" value="${userEmail}" style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 12px; width: 100%; box-sizing: border-box;" />
        </div>
        
        <div class="modal-actions" style="display:flex; gap:10px; margin-top:20px;">
          <button class="btn btn-outline" id="btn-cancel-edit" style="flex:1; padding: 12px; border-radius: var(--radius-md); font-weight:600; cursor:pointer;">Batal</button>
          <button class="btn btn-primary" id="btn-save-edit" style="flex:1; padding: 12px; border-radius: var(--radius-md); font-weight:600; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color:white; border:none; cursor:pointer;">Simpan</button>
        </div>
      </div>
    `;
    
    overlay.querySelector('#btn-cancel-edit').addEventListener('click', () => overlay.remove());
    
    overlay.querySelector('#btn-save-edit').addEventListener('click', async () => {
      const newName = overlay.querySelector('#edit-name').value.trim();
      const newEmail = overlay.querySelector('#edit-email').value.trim();
      
      if (!newName || !newEmail) {
        showCustomAlert("Nama dan email tidak boleh kosong!", "Validasi Gagal");
        return;
      }
      
      if (userId && userId !== 'guest') {
        try {
          overlay.querySelector('#btn-save-edit').textContent = 'Menyimpan...';
          overlay.querySelector('#btn-save-edit').disabled = true;
          
          const res = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name: newName, email: newEmail })
          });
          
          if (res.ok) {
            const result = await res.json();
            localStorage.setItem('bglow_user', JSON.stringify({
              id: result.user.id,
              name: result.user.name,
              email: result.user.email
            }));
            showCustomAlert("Profil berhasil diperbarui!", "Profil Diperbarui", () => {
              overlay.remove();
              window.location.hash = '#/profile';
            });
          } else {
            const data = await res.json();
            showCustomAlert(data.detail || "Gagal memperbarui profil", "Gagal Memperbarui");
            overlay.querySelector('#btn-save-edit').textContent = 'Simpan';
            overlay.querySelector('#btn-save-edit').disabled = false;
          }
        } catch (err) {
          console.error(err);
          showCustomAlert("Gagal terhubung ke server. Pastikan backend menyala.", "Koneksi Bermasalah");
          overlay.querySelector('#btn-save-edit').textContent = 'Simpan';
          overlay.querySelector('#btn-save-edit').disabled = false;
        }
      } else {
        localStorage.setItem('bglow_user', JSON.stringify({ id: 'guest', name: newName, email: newEmail }));
        showCustomAlert("Profil (Guest) diperbarui!", "Profil Diperbarui", () => {
          overlay.remove();
          window.location.hash = '#/profile';
        });
      }
    });
    
    document.body.appendChild(overlay);
  }

  function openSkinProfileModal() {
    const userId = getUserId();
    
    const skinType = localStorage.getItem('bglow_skin_type_' + userId) || 'Kombinasi';
    const acneLevel = localStorage.getItem('bglow_acne_level_' + userId) || 'Ringan — Grade 1';
    const oilLevel = localStorage.getItem('bglow_oil_level_' + userId) || 'Sedang — T-Zone';
    const poreCond = localStorage.getItem('bglow_pore_condition_' + userId) || 'Baik — Minimal';
    const skinScore = localStorage.getItem('bglow_skin_score_' + userId) || '65';
    
    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal" style="border-radius: var(--radius-lg) var(--radius-lg) 0 0; max-height:85vh;">
        <div class="modal-handle"></div>
        <div class="modal-title">Profil Kulit Anda</div>
        
        <div class="modal-field">
          <label>Jenis Kulit</label>
          <select id="skin-type" class="auth-input premium-select" style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 12px; width: 100%; box-sizing: border-box; background: white;">
            <option value="Kombinasi" ${skinType === 'Kombinasi' ? 'selected' : ''}>Kombinasi (Combination)</option>
            <option value="Berminyak" ${skinType === 'Berminyak' ? 'selected' : ''}>Berminyak (Oily)</option>
            <option value="Kering" ${skinType === 'Kering' ? 'selected' : ''}>Kering (Dry)</option>
            <option value="Normal" ${skinType === 'Normal' ? 'selected' : ''}>Normal</option>
            <option value="Sensitif" ${skinType === 'Sensitif' ? 'selected' : ''}>Sensitif (Sensitive)</option>
          </select>
        </div>
        
        <div class="modal-field">
          <label>Level Jerawat</label>
          <select id="acne-level" class="auth-input premium-select" style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 12px; width: 100%; box-sizing: border-box; background: white;">
            <option value="Bersih" ${acneLevel === 'Bersih' ? 'selected' : ''}>Bersih (None)</option>
            <option value="Ringan — Grade 1" ${acneLevel === 'Ringan — Grade 1' ? 'selected' : ''}>Ringan (Mild — Grade 1)</option>
            <option value="Sedang — Grade 2" ${acneLevel === 'Sedang — Grade 2' ? 'selected' : ''}>Sedang (Moderate — Grade 2)</option>
            <option value="Parah" ${acneLevel === 'Parah' ? 'selected' : ''}>Parah (Severe)</option>
          </select>
        </div>
        
        <div class="modal-field">
          <label>Level Minyak</label>
          <select id="oil-level" class="auth-input premium-select" style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 12px; width: 100%; box-sizing: border-box; background: white;">
            <option value="Rendah" ${oilLevel === 'Rendah' ? 'selected' : ''}>Rendah (Low)</option>
            <option value="Normal" ${oilLevel === 'Normal' ? 'selected' : ''}>Normal</option>
            <option value="Sedang — T-Zone" ${oilLevel === 'Sedang — T-Zone' ? 'selected' : ''}>Sedang (Oily T-Zone)</option>
            <option value="Tinggi" ${oilLevel === 'Tinggi' ? 'selected' : ''}>Tinggi (High)</option>
          </select>
        </div>
        
        <div class="modal-field">
          <label>Kondisi Pori</label>
          <select id="pore-cond" class="auth-input premium-select" style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 12px; width: 100%; box-sizing: border-box; background: white;">
            <option value="Baik — Minimal" ${poreCond === 'Baik — Minimal' ? 'selected' : ''}>Baik (Minimal)</option>
            <option value="Cukup" ${poreCond === 'Cukup' ? 'selected' : ''}>Cukup (Moderate)</option>
            <option value="Kurang Baik" ${poreCond === 'Kurang Baik' ? 'selected' : ''}>Kurang Baik (Enlarged)</option>
          </select>
        </div>
        
        <div class="modal-field">
          <label id="skin-score-label">Skor Kulit (${skinScore})</label>
          <input type="range" id="skin-score" min="0" max="100" value="${skinScore}" style="width:100%; cursor:pointer;" />
        </div>
        
        <div class="modal-actions" style="display:flex; gap:10px; margin-top:20px;">
          <button class="btn btn-outline" id="btn-cancel-skin" style="flex:1; padding: 12px; border-radius: var(--radius-md); font-weight:600; cursor:pointer;">Batal</button>
          <button class="btn btn-primary" id="btn-save-skin" style="flex:1; padding: 12px; border-radius: var(--radius-md); font-weight:600; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color:white; border:none; cursor:pointer;">Simpan</button>
        </div>
      </div>
    `;
    
    const scoreInput = overlay.querySelector('#skin-score');
    const scoreLabel = overlay.querySelector('#skin-score-label');
    scoreInput.addEventListener('input', (e) => {
      scoreLabel.textContent = `Skor Kulit (${e.target.value})`;
    });
    
    overlay.querySelector('#btn-cancel-skin').addEventListener('click', () => overlay.remove());
    
    overlay.querySelector('#btn-save-skin').addEventListener('click', async () => {
      const selectedSkinType = overlay.querySelector('#skin-type').value;
      const selectedAcneLevel = overlay.querySelector('#acne-level').value;
      const selectedOilLevel = overlay.querySelector('#oil-level').value;
      const selectedPoreCond = overlay.querySelector('#pore-cond').value;
      const selectedSkinScore = parseInt(scoreInput.value);
      
      if (userId && userId !== 'guest') {
        try {
          overlay.querySelector('#btn-save-skin').textContent = 'Menyimpan...';
          overlay.querySelector('#btn-save-skin').disabled = true;
          
          const res = await fetch(`${API_BASE_URL}/api/user/${userId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              skin_type: selectedSkinType,
              acne_level: selectedAcneLevel,
              oil_level: selectedOilLevel,
              pore_condition: selectedPoreCond,
              skin_score: selectedSkinScore
            })
          });
          
          if (res.ok) {
            localStorage.setItem('bglow_has_scanned_' + userId, '1');
            localStorage.setItem('bglow_skin_type_' + userId, selectedSkinType);
            localStorage.setItem('bglow_acne_level_' + userId, selectedAcneLevel);
            localStorage.setItem('bglow_oil_level_' + userId, selectedOilLevel);
            localStorage.setItem('bglow_pore_condition_' + userId, selectedPoreCond);
            localStorage.setItem('bglow_skin_score_' + userId, String(selectedSkinScore));
            
            showCustomAlert("Profil kulit berhasil diperbarui!", "Profil Kulit Diperbarui", () => {
              overlay.remove();
            });
          } else {
            const data = await res.json();
            showCustomAlert(data.detail || "Gagal memperbarui profil kulit", "Gagal Memperbarui");
            overlay.querySelector('#btn-save-skin').textContent = 'Simpan';
            overlay.querySelector('#btn-save-skin').disabled = false;
          }
        } catch (err) {
          console.error(err);
          showCustomAlert("Gagal terhubung ke server. Pastikan backend menyala.", "Koneksi Bermasalah");
          overlay.querySelector('#btn-save-skin').textContent = 'Simpan';
          overlay.querySelector('#btn-save-skin').disabled = false;
        }
      } else {
        localStorage.setItem('bglow_has_scanned_' + userId, '1');
        localStorage.setItem('bglow_skin_type_' + userId, selectedSkinType);
        localStorage.setItem('bglow_acne_level_' + userId, selectedAcneLevel);
        localStorage.setItem('bglow_oil_level_' + userId, selectedOilLevel);
        localStorage.setItem('bglow_pore_condition_' + userId, selectedPoreCond);
        localStorage.setItem('bglow_skin_score_' + userId, String(selectedSkinScore));
        showCustomAlert("Profil kulit (Guest) diperbarui!", "Profil Kulit Diperbarui", () => {
          overlay.remove();
        });
      }
    });
    
    document.body.appendChild(overlay);
  }

  function openPrivacyModal() {
    const userId = getUserId();
    
    const analysisVal = localStorage.getItem('privacy_skin_analysis_' + userId) !== '0';
    const localVal = localStorage.getItem('privacy_local_storage_' + userId) !== '0';
    const cloudVal = localStorage.getItem('privacy_cloud_backup_' + userId) === '1';
    
    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal" style="border-radius: var(--radius-lg) var(--radius-lg) 0 0; max-height:85vh;">
        <style>
          .privacy-toggle-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1.5px solid var(--border-light);
          }
          .privacy-toggle-info {
            flex: 1;
            padding-right: 16px;
          }
          .privacy-toggle-title {
            font-weight: 600;
            color: var(--text-primary);
            font-size: 14px;
            margin-bottom: 4px;
          }
          .privacy-toggle-desc {
            font-size: 12px;
            color: var(--text-secondary);
            line-height: 1.4;
          }
          .ios-switch {
            position: relative;
            display: inline-block;
            width: 46px;
            height: 26px;
            flex-shrink: 0;
          }
          .ios-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .ios-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: var(--border);
            transition: .2s ease;
            border-radius: 26px;
          }
          .ios-slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .2s ease;
            border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          }
          .ios-switch input:checked + .ios-slider {
            background-color: var(--success);
          }
          .ios-switch input:checked + .ios-slider:before {
            transform: translateX(20px);
          }
          .danger-zone {
            margin-top: var(--space-lg);
            padding: var(--space-md);
            border: 1.5px solid var(--danger-bg);
            background: var(--bg-soft);
            border-radius: var(--radius-md);
          }
          .danger-zone-title {
            font-weight: 700;
            color: var(--danger);
            font-size: 14px;
            margin-bottom: 6px;
          }
          .danger-zone-desc {
            font-size: 12px;
            color: var(--text-secondary);
            margin-bottom: 12px;
            line-height: 1.4;
          }
        </style>
        <div class="modal-handle"></div>
        <div class="modal-title">Privasi & Keamanan</div>
        
        <div style="background:var(--bg-overlay); border: 1px solid rgba(59, 130, 246, 0.15); padding: 12px var(--space-md); border-radius: var(--radius-md); font-size: 12px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.5; display: flex; gap: 10px; align-items: flex-start;">
          <span style="font-size:16px;">🛡️</span>
          <span>Kami berkomitmen menjaga privasi Anda. Foto hasil scan wajah Anda diproses di perangkat lokal Anda dan tidak disalahgunakan.</span>
        </div>
        
        <div class="privacy-toggle-item">
          <div class="privacy-toggle-info">
            <div class="privacy-toggle-title">Data Analisis Kulit</div>
            <div class="privacy-toggle-desc">Izinkan AI menganalisis foto wajah untuk memberikan saran produk skincare yang cocok.</div>
          </div>
          <label class="ios-switch">
            <input type="checkbox" id="privacy-analysis" ${analysisVal ? 'checked' : ''} />
            <span class="ios-slider"></span>
          </label>
        </div>

        <div class="privacy-toggle-item">
          <div class="privacy-toggle-info">
            <div class="privacy-toggle-title">Enkripsi Penyimpanan Lokal</div>
            <div class="privacy-toggle-desc">Amankan data riwayat harian kulit Anda menggunakan database terenkripsi di perangkat.</div>
          </div>
          <label class="ios-switch">
            <input type="checkbox" id="privacy-local" ${localVal ? 'checked' : ''} />
            <span class="ios-slider"></span>
          </label>
        </div>

        <div class="privacy-toggle-item" style="border-bottom:none;">
          <div class="privacy-toggle-info">
            <div class="privacy-toggle-title">Sinkronisasi Cloud Backup</div>
            <div class="privacy-toggle-desc">Cadangkan data riwayat scan kulit Anda secara aman ke cloud agar tidak hilang saat ganti perangkat.</div>
          </div>
          <label class="ios-switch">
            <input type="checkbox" id="privacy-cloud" ${cloudVal ? 'checked' : ''} />
            <span class="ios-slider"></span>
          </label>
        </div>
        
        <div class="danger-zone">
          <div class="danger-zone-title">Zona Bahaya</div>
          <div class="danger-zone-desc">Menghapus seluruh data profil, riwayat scan, riwayat harian kulit, serta alarm sunscreen secara permanen.</div>
          <button class="btn btn-outline" id="btn-delete-all-data" style="width:100%; border-color:var(--danger); color:var(--danger); padding:10px; font-weight:600; cursor:pointer; background:transparent;">Hapus Seluruh Data Akun</button>
        </div>
        
        <div class="modal-actions" style="display:flex; gap:10px; margin-top:20px;">
          <button class="btn btn-outline" id="btn-cancel-privacy" style="flex:1; padding: 12px; border-radius: var(--radius-md); font-weight:600; cursor:pointer;">Batal</button>
          <button class="btn btn-primary" id="btn-save-privacy" style="flex:1; padding: 12px; border-radius: var(--radius-md); font-weight:600; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color:white; border:none; cursor:pointer;">Simpan</button>
        </div>
      </div>
    `;
    
    overlay.querySelector('#btn-cancel-privacy').addEventListener('click', () => overlay.remove());
    
    overlay.querySelector('#btn-save-privacy').addEventListener('click', () => {
      const isAnalysisChecked = overlay.querySelector('#privacy-analysis').checked;
      const isLocalChecked = overlay.querySelector('#privacy-local').checked;
      const isCloudChecked = overlay.querySelector('#privacy-cloud').checked;
      
      localStorage.setItem('privacy_skin_analysis_' + userId, isAnalysisChecked ? '1' : '0');
      localStorage.setItem('privacy_local_storage_' + userId, isLocalChecked ? '1' : '0');
      localStorage.setItem('privacy_cloud_backup_' + userId, isCloudChecked ? '1' : '0');
      
      showCustomAlert("Pengaturan privasi berhasil diperbarui!", "Privasi Diperbarui", () => {
        overlay.remove();
      });
    });
    
    overlay.querySelector('#btn-delete-all-data').addEventListener('click', () => {
      showCustomConfirm(
        "Apakah Anda yakin ingin menghapus seluruh data akun? Tindakan ini akan menghapus semua riwayat scan dan harian kulit Anda secara permanen. Anda juga akan dikeluarkan dari aplikasi.",
        () => {
          clearUserData();
          localStorage.setItem('bglow_auth', '0');
          
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('bglow_') || key.startsWith('privacy_')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(k => localStorage.removeItem(k));
          
          overlay.remove();
          showCustomAlert("Seluruh data berhasil dihapus.", "Data Dihapus", () => {
            window.location.hash = '#/login';
          });
        },
        "Konfirmasi Hapus Data"
      );
    });
    
    document.body.appendChild(overlay);
  }

  function openRateModal() {
    const userId = getUserId();
    const existingRating = localStorage.getItem('bglow_app_rating_' + userId) || '0';
    const existingFeedback = localStorage.getItem('bglow_app_feedback_' + userId) || '';
    
    let selectedRating = parseInt(existingRating);
    
    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal" style="border-radius: var(--radius-lg) var(--radius-lg) 0 0; text-align:center;">
        <style>
          .rating-stars-container {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin: 20px 0;
          }
          .rating-star-btn {
            background: none;
            border: none;
            font-size: 36px;
            cursor: pointer;
            color: var(--text-tertiary);
            transition: transform 0.1s ease, color 0.1s ease;
            padding: 4px;
          }
          .rating-star-btn:hover {
            transform: scale(1.2);
          }
          .rating-star-btn.active {
            color: #F59E0B;
          }
          .rating-text-feedback {
            text-align: center;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 20px;
            font-size: 15px;
            min-height: 22px;
          }
        </style>
        <div class="modal-handle"></div>
        <div class="modal-title">Nilai Aplikasi B-Glow</div>
        <p style="color:var(--text-secondary); font-size:14px; margin-bottom:15px;">Bagaimana pengalaman Anda menggunakan B-Glow? Penilaian Anda membantu kami terus berkembang!</p>
        
        <div class="rating-stars-container">
          <button class="rating-star-btn" data-star="1">★</button>
          <button class="rating-star-btn" data-star="2">★</button>
          <button class="rating-star-btn" data-star="3">★</button>
          <button class="rating-star-btn" data-star="4">★</button>
          <button class="rating-star-btn" data-star="5">★</button>
        </div>
        
        <div class="rating-text-feedback" id="rating-status-text">Ketuk bintang untuk memberi nilai</div>
        
        <div class="modal-field" style="text-align:left;">
          <label>Masukan Anda (Opsional)</label>
          <textarea id="rating-comment" class="modal-textarea" style="width:100%; min-height:90px; box-sizing:border-box; padding:12px;" placeholder="Tulis kritik, saran, atau masukan Anda di sini...">${existingFeedback}</textarea>
        </div>
        
        <div class="modal-actions" style="display:flex; gap:10px; margin-top:20px;">
          <button class="btn btn-outline" id="btn-cancel-rate" style="flex:1; padding: 12px; border-radius: var(--radius-md); font-weight:600; cursor:pointer;">Batal</button>
          <button class="btn btn-primary" id="btn-submit-rate" style="flex:1; padding: 12px; border-radius: var(--radius-md); font-weight:600; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color:white; border:none; cursor:pointer;">Kirim Penilaian</button>
        </div>
      </div>
    `;
    
    const stars = overlay.querySelectorAll('.rating-star-btn');
    const statusText = overlay.querySelector('#rating-status-text');
    const commentInput = overlay.querySelector('#rating-comment');
    
    const ratingTexts = {
      0: "Ketuk bintang untuk memberi nilai",
      1: "Sangat Buruk 😞",
      2: "Buruk 🙁",
      3: "Cukup Baik 😐",
      4: "Sangat Baik 😊",
      5: "Luar Biasa! 😍"
    };
    
    function updateStarsDisplay(rating) {
      stars.forEach(star => {
        const starVal = parseInt(star.getAttribute('data-star'));
        if (starVal <= rating) {
          star.classList.add('active');
        } else {
          star.classList.remove('active');
        }
      });
      statusText.textContent = ratingTexts[rating];
    }
    
    updateStarsDisplay(selectedRating);
    
    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-star'));
        updateStarsDisplay(selectedRating);
      });
      
      star.addEventListener('mouseenter', () => {
        const hoverVal = parseInt(star.getAttribute('data-star'));
        updateStarsDisplay(hoverVal);
      });
    });
    
    overlay.querySelector('.rating-stars-container').addEventListener('mouseleave', () => {
      updateStarsDisplay(selectedRating);
    });
    
    overlay.querySelector('#btn-cancel-rate').addEventListener('click', () => overlay.remove());
    
    overlay.querySelector('#btn-submit-rate').addEventListener('click', () => {
      if (selectedRating === 0) {
        showCustomAlert("Silakan pilih rating bintang terlebih dahulu!", "Rating Diperlukan");
        return;
      }
      
      const comment = commentInput.value.trim();
      
      localStorage.setItem('bglow_app_rating_' + userId, String(selectedRating));
      localStorage.setItem('bglow_app_feedback_' + userId, comment);
      
      let successMsg = "Terima kasih atas ulasan Anda! Ulasan Anda telah disimpan secara lokal.";
      if (selectedRating >= 4) {
        successMsg = "Terima kasih banyak atas dukungannya! 😍 Kami senang Anda menyukai B-Glow.";
      }
      
      showCustomAlert(successMsg, "Penilaian Dikirim", () => {
        overlay.remove();
      });
    });
    
    document.body.appendChild(overlay);
  }

  function openHelpModal() {
    const overlay = document.createElement('div');
    overlay.className = 'diary-modal-overlay';
    overlay.innerHTML = `
      <div class="diary-modal" style="border-radius: var(--radius-lg) var(--radius-lg) 0 0; max-height:85vh; padding-bottom: 40px;">
        <style>
          .faq-section {
            margin-top: 15px;
            margin-bottom: 25px;
          }
          .faq-search-box {
            position: relative;
            margin-bottom: 16px;
          }
          .faq-search-input {
            width: 100%;
            padding: 12px 16px 12px 40px;
            border: 1.5px solid var(--border);
            border-radius: var(--radius-md);
            font-size: 14px;
            background: var(--bg-soft);
            box-sizing: border-box;
            transition: all 0.2s ease;
          }
          .faq-search-input:focus {
            border-color: var(--primary);
            background: white;
            outline: none;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
          }
          .faq-search-icon {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-tertiary);
            pointer-events: none;
            font-size: 16px;
          }
          .faq-item {
            border: 1.5px solid var(--border-light);
            border-radius: var(--radius-md);
            margin-bottom: 10px;
            overflow: hidden;
            background: var(--bg);
            transition: all 0.2s ease;
          }
          .faq-header {
            padding: 14px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            font-weight: 600;
            color: var(--text-primary);
            font-size: 13.5px;
            user-select: none;
          }
          .faq-header:hover {
            background: var(--bg-soft);
          }
          .faq-arrow {
            transition: transform 0.2s ease;
            color: var(--text-secondary);
            display: flex;
            align-items: center;
            font-size: 12px;
          }
          .faq-item.active {
            border-color: var(--primary-light);
          }
          .faq-item.active .faq-arrow {
            transform: rotate(180deg);
            color: var(--primary);
          }
          .faq-body {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.25s ease-out;
            background: var(--bg-soft);
            font-size: 12.5px;
            color: var(--text-secondary);
            line-height: 1.5;
          }
          .faq-body-content {
            padding: 14px 16px;
            border-top: 1px solid var(--border-light);
          }
          .support-cards {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 25px;
          }
          .support-card {
            border: 1.5px solid var(--border);
            border-radius: var(--radius-md);
            padding: 14px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .support-card:hover {
            border-color: var(--primary);
            transform: translateY(-2px);
            box-shadow: var(--shadow-sm);
          }
          .support-card-icon {
            font-size: 24px;
            margin-bottom: 8px;
          }
          .support-card-title {
            font-weight: 600;
            color: var(--text-primary);
            font-size: 13px;
            margin-bottom: 2px;
          }
          .support-card-desc {
            font-size: 11px;
            color: var(--text-secondary);
          }
          .ticket-form {
            border: 1.5px solid var(--border-light);
            border-radius: var(--radius-md);
            padding: 16px;
            background: var(--bg-soft);
          }
          .custom-select-container {
            position: relative;
            width: 100%;
          }
          .custom-select-trigger {
            width: 100%;
            padding: 12px 14px;
            border: 1.5px solid var(--border);
            border-radius: var(--radius-md);
            background: white;
            font-size: 13px;
            color: var(--text-primary);
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            box-sizing: border-box;
            transition: all 0.2s ease;
          }
          .custom-select-trigger:hover {
            border-color: var(--primary-light);
          }
          .custom-select-container.open .custom-select-trigger {
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
          .custom-select-arrow {
            font-size: 9px;
            color: var(--text-secondary);
            transition: transform 0.2s ease;
          }
          .custom-select-container.open .custom-select-arrow {
            transform: rotate(180deg);
            color: var(--primary);
          }
          .custom-select-options {
            position: absolute;
            top: calc(100% + 6px);
            left: 0;
            right: 0;
            background: white;
            border: 1.5px solid var(--border-light);
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
            transition: all 0.2s ease;
            max-height: 180px;
            overflow-y: auto;
          }
          .custom-select-container.open .custom-select-options {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
          }
          .custom-select-option {
            padding: 10px 14px;
            font-size: 13px;
            color: var(--text-secondary);
            cursor: pointer;
            text-align: left;
            transition: all 0.2s ease;
          }
          .custom-select-option:hover {
            background: var(--bg-soft);
            color: var(--primary);
          }
          .custom-select-option.active {
            background: var(--bg-overlay);
            color: var(--primary);
            font-weight: 600;
          }
        </style>
        <div class="modal-handle"></div>
        <div class="modal-title">Bantuan & Dukungan</div>
        
        <div class="faq-search-box">
          <span class="faq-search-icon">🔍</span>
          <input type="text" class="faq-search-input" id="faq-search" placeholder="Cari topik bantuan atau FAQ..." />
        </div>
        
        <h4 style="margin: 0 0 10px 0; font-size:14px; font-weight:700; color:var(--text-primary);">Tanya Jawab Populer (FAQ)</h4>
        
        <div class="faq-section" id="faq-container">
          <div class="faq-item" data-keywords="scan ai analisis foto kulit wajah jerawat">
            <div class="faq-header">
              <span>Bagaimana B-Glow menganalisis kondisi kulit?</span>
              <span class="faq-arrow">▼</span>
            </div>
            <div class="faq-body">
              <div class="faq-body-content">
                B-Glow menggunakan algoritma Computer Vision AI yang menganalisis foto wajah untuk mendeteksi jerawat, mengukur tingkat sebum minyak, memantau kemerahan kulit, serta mengidentifikasi ukuran pori-pori.
              </div>
            </div>
          </div>
          
          <div class="faq-item" data-keywords="aman foto privasi database server simpan">
            <div class="faq-header">
              <span>Apakah data foto wajah saya aman?</span>
              <span class="faq-arrow">▼</span>
            </div>
            <div class="faq-body">
              <div class="faq-body-content">
                Sangat aman. Kami memproses dan menganalisis gambar langsung secara lokal di perangkat Anda. Data numerik hasil scan yang dikirim ke server pun dilindungi oleh enkripsi modern dan tidak dibagikan ke pihak ketiga.
              </div>
            </div>
          </div>
          
          <div class="faq-item" data-keywords="alarm sunscreen notifikasi berbunyi mati">
            <div class="faq-header">
              <span>Mengapa alarm sunscreen saya tidak berbunyi?</span>
              <span class="faq-arrow">▼</span>
            </div>
            <div class="faq-body">
              <div class="faq-body-content">
                Umumnya hal ini disebabkan oleh pembatasan notifikasi di HP Anda. Pastikan Anda telah memberikan izin notifikasi penuh untuk aplikasi B-Glow di Pengaturan Sistem HP Anda dan mematikan mode hemat baterai untuk B-Glow.
              </div>
            </div>
          </div>
          
          <div class="faq-item" data-keywords="bpom barcode cari kecocokan bahan produk">
            <div class="faq-header">
              <span>Bagaimana cara kerja cek produk BPOM?</span>
              <span class="faq-arrow">▼</span>
            </div>
            <div class="faq-body">
              <div class="faq-body-content">
                Anda hanya perlu memasukkan nomor registrasi BPOM atau memindai barcode produk skincare. Aplikasi kami akan mencocokkan bahan aktif produk dengan profil kulit Anda untuk menghasilkan skor kecocokan yang dipersonalisasi.
              </div>
            </div>
          </div>
          
          <div class="faq-item" data-keywords="ubah ganti profil kulit jenis manual">
            <div class="faq-header">
              <span>Bagaimana cara merubah profil kulit saya?</span>
              <span class="faq-arrow">▼</span>
            </div>
            <div class="faq-body">
              <div class="faq-body-content">
                Anda dapat memperbarui profil kulit secara manual kapan saja dengan masuk ke menu <strong>Pengaturan > Profil Kulit</strong>, lalu memilih jenis kulit, level minyak, dan tingkat jerawat yang sesuai.
              </div>
            </div>
          </div>
        </div>
        
        <h4 style="margin: 0 0 10px 0; font-size:14px; font-weight:700; color:var(--text-primary);">Hubungi Dukungan</h4>
        <div class="support-cards">
          <a class="support-card" href="https://wa.me/6281234567890" target="_blank">
            <span class="support-card-icon">💬</span>
            <span class="support-card-title">WhatsApp Support</span>
            <span class="support-card-desc">Respon cepat 09.00 - 18.00</span>
          </a>
          <a class="support-card" href="mailto:support@bglow.com">
            <span class="support-card-icon">✉️</span>
            <span class="support-card-title">Email Dukungan</span>
            <span class="support-card-desc">Kirim pesan kapan saja</span>
          </a>
        </div>
        
        <h4 style="margin: 0 0 10px 0; font-size:14px; font-weight:700; color:var(--text-primary);">Kirim Laporan Kendala</h4>
        <div class="ticket-form">
          <div class="modal-field">
            <label style="font-size:12px;">Kategori Masalah</label>
            <div class="custom-select-container" id="select-category-container">
              <div class="custom-select-trigger">
                <span class="custom-select-value">Scan AI & Kamera</span>
                <span class="custom-select-arrow">▼</span>
              </div>
              <div class="custom-select-options">
                <div class="custom-select-option active" data-value="Scan AI & Kamera">Scan AI & Kamera</div>
                <div class="custom-select-option" data-value="Alarm Sunscreen">Alarm Sunscreen</div>
                <div class="custom-select-option" data-value="Pencarian & BPOM">Pencarian & BPOM</div>
                <div class="custom-select-option" data-value="Masalah Akun & Login">Masalah Akun & Login</div>
                <div class="custom-select-option" data-value="Lainnya">Lainnya</div>
              </div>
              <input type="hidden" id="ticket-category" value="Scan AI & Kamera" />
            </div>
          </div>
          
          <div class="modal-field">
            <label style="font-size:12px;">Deskripsi Kendala</label>
            <textarea id="ticket-desc" class="modal-textarea" style="width:100%; min-height:80px; box-sizing:border-box; padding:10px; font-size:13px;" placeholder="Jelaskan detail kendala yang Anda alami..."></textarea>
          </div>
          
          <button class="btn btn-primary" id="btn-submit-ticket" style="width:100%; padding: 12px; border-radius: var(--radius-md); font-weight:600; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color:white; border:none; cursor:pointer;">Kirim Laporan</button>
        </div>
        
        <div class="modal-actions" style="display:flex; gap:10px; margin-top:20px;">
          <button class="btn btn-outline" id="btn-close-help" style="width:100%; padding: 12px; border-radius: var(--radius-md); font-weight:600; cursor:pointer;">Tutup</button>
        </div>
      </div>
    `;
    
    const faqItems = overlay.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const header = item.querySelector('.faq-header');
      const body = item.querySelector('.faq-body');
      
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem.querySelector('.faq-body').style.maxHeight = '0';
          }
        });
        
        if (isActive) {
          item.classList.remove('active');
          body.style.maxHeight = '0';
        } else {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    });
    
    const searchInput = overlay.querySelector('#faq-search');
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      
      faqItems.forEach(item => {
        const keywords = item.getAttribute('data-keywords').toLowerCase();
        const headerText = item.querySelector('.faq-header span').textContent.toLowerCase();
        const bodyText = item.querySelector('.faq-body-content').textContent.toLowerCase();
        
        if (keywords.includes(query) || headerText.includes(query) || bodyText.includes(query)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
    
    // Custom select trigger and click outside handling
    const selectContainer = overlay.querySelector('#select-category-container');
    const selectTrigger = selectContainer.querySelector('.custom-select-trigger');
    const selectValue = selectContainer.querySelector('.custom-select-value');
    const hiddenInput = selectContainer.querySelector('#ticket-category');
    const selectOptions = selectContainer.querySelectorAll('.custom-select-option');

    selectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      selectContainer.classList.toggle('open');
    });

    selectOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = option.getAttribute('data-value');
        selectValue.textContent = val;
        hiddenInput.value = val;
        
        selectOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        selectContainer.classList.remove('open');
      });
    });

    const closeSelectOutside = () => {
      selectContainer.classList.remove('open');
    };
    document.addEventListener('click', closeSelectOutside);

    overlay.querySelector('#btn-close-help').addEventListener('click', () => {
      document.removeEventListener('click', closeSelectOutside);
      overlay.remove();
    });
    
    overlay.querySelector('#btn-submit-ticket').addEventListener('click', () => {
      const category = hiddenInput.value;
      const desc = overlay.querySelector('#ticket-desc').value.trim();
      
      if (!desc) {
        showCustomAlert("Silakan tuliskan deskripsi kendala Anda terlebih dahulu!", "Deskripsi Diperlukan");
        return;
      }
      
      const userId = getUserId();
      const existingTicketsStr = localStorage.getItem('bglow_support_tickets_' + userId) || '[]';
      let tickets = [];
      try {
        tickets = JSON.parse(existingTicketsStr);
      } catch (e) {}
      
      tickets.push({
        id: 'TKT-' + Date.now(),
        category,
        desc,
        date: new Date().toISOString(),
        status: 'Diproses'
      });
      localStorage.setItem('bglow_support_tickets_' + userId, JSON.stringify(tickets));
      
      showCustomAlert(
        `Laporan kendala mengenai "${category}" berhasil dikirim! Tim kami akan meninjau keluhan Anda dan menghubungi lewat email dalam 24 jam.`,
        "Laporan Terkirim",
        () => {
          overlay.querySelector('#ticket-desc').value = '';
        }
      );
    });
    
    document.body.appendChild(overlay);
  }

  return page;
}
