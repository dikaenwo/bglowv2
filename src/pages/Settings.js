import { icons } from '../components/BottomNav.js';
import { clearUserData, getUserId, getAuthHeaders } from '../utils/store.js';
import { showCustomAlert } from '../utils/helpers.js';
import { API_BASE_URL } from '../config.js';

export function renderSettings() {
  const page = document.createElement('div');
  page.className = 'page';

  page.innerHTML = `
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
        <div class="menu-item anim-fade-in-up anim-delay-4">
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
        <div class="menu-item anim-fade-in-up anim-delay-5">
          <div class="mi-icon amber">${icons.star}</div>
          <span class="mi-text">Nilai B-Glow</span>
          <span class="mi-arrow">${icons.chevronRight}</span>
        </div>
        <div class="menu-item anim-fade-in-up anim-delay-6">
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
          <select id="skin-type" class="auth-input" style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 12px; width: 100%; box-sizing: border-box; background: white;">
            <option value="Kombinasi" ${skinType === 'Kombinasi' ? 'selected' : ''}>Kombinasi (Combination)</option>
            <option value="Berminyak" ${skinType === 'Berminyak' ? 'selected' : ''}>Berminyak (Oily)</option>
            <option value="Kering" ${skinType === 'Kering' ? 'selected' : ''}>Kering (Dry)</option>
            <option value="Normal" ${skinType === 'Normal' ? 'selected' : ''}>Normal</option>
            <option value="Sensitif" ${skinType === 'Sensitif' ? 'selected' : ''}>Sensitif (Sensitive)</option>
          </select>
        </div>
        
        <div class="modal-field">
          <label>Level Jerawat</label>
          <select id="acne-level" class="auth-input" style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 12px; width: 100%; box-sizing: border-box; background: white;">
            <option value="Bersih" ${acneLevel === 'Bersih' ? 'selected' : ''}>Bersih (None)</option>
            <option value="Ringan — Grade 1" ${acneLevel === 'Ringan — Grade 1' ? 'selected' : ''}>Ringan (Mild — Grade 1)</option>
            <option value="Sedang — Grade 2" ${acneLevel === 'Sedang — Grade 2' ? 'selected' : ''}>Sedang (Moderate — Grade 2)</option>
            <option value="Parah" ${acneLevel === 'Parah' ? 'selected' : ''}>Parah (Severe)</option>
          </select>
        </div>
        
        <div class="modal-field">
          <label>Level Minyak</label>
          <select id="oil-level" class="auth-input" style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 12px; width: 100%; box-sizing: border-box; background: white;">
            <option value="Rendah" ${oilLevel === 'Rendah' ? 'selected' : ''}>Rendah (Low)</option>
            <option value="Normal" ${oilLevel === 'Normal' ? 'selected' : ''}>Normal</option>
            <option value="Sedang — T-Zone" ${oilLevel === 'Sedang — T-Zone' ? 'selected' : ''}>Sedang (Oily T-Zone)</option>
            <option value="Tinggi" ${oilLevel === 'Tinggi' ? 'selected' : ''}>Tinggi (High)</option>
          </select>
        </div>
        
        <div class="modal-field">
          <label>Kondisi Pori</label>
          <select id="pore-cond" class="auth-input" style="border: 1.5px solid var(--border); border-radius: var(--radius-md); padding: 12px; width: 100%; box-sizing: border-box; background: white;">
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

  return page;
}
