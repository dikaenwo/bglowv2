/**
 * Geolocation Helper — Capacitor Native + Web Fallback
 * 
 * Menggunakan @capacitor/geolocation plugin untuk menangani permission flow
 * secara proper di Android. Fallback ke navigator.geolocation untuk web.
 */
import { Geolocation } from '@capacitor/geolocation';
import { NativeSettings, AndroidSettings } from 'capacitor-native-settings';

/**
 * Buka langsung halaman Pengaturan Lokasi (GPS) Android.
 */
export async function openLocationSettings() {
  try {
    await NativeSettings.openAndroid({
      option: AndroidSettings.Location
    });
  } catch (e) {
    console.warn('Gagal membuka pengaturan lokasi Android:', e);
    openAppSettings();
  }
}

/**
 * Buka langsung halaman Pengaturan Izin Aplikasi (Application Details) Android.
 */
export async function openAppSettings() {
  try {
    await NativeSettings.openAndroid({
      option: AndroidSettings.ApplicationDetails
    });
  } catch (e) {
    console.warn('Gagal membuka pengaturan aplikasi Android:', e);
  }
}

/**
 * Wait for Cordova LocationAccuracy plugin to be injected on Android window object
 */
async function getLocationAccuracyPlugin() {
  for (let i = 0; i < 30; i++) {
    if (
      typeof window !== 'undefined' &&
      window.cordova &&
      window.cordova.plugins &&
      window.cordova.plugins.locationAccuracy
    ) {
      return window.cordova.plugins.locationAccuracy;
    }
    await new Promise(r => setTimeout(r, 100));
  }
  return null;
}

/**
 * Triggers Google Play Services native system dialog:
 * "Untuk melanjutkan, perangkat Anda harus menggunakan Akurasi Lokasi... [Lain kali] [Aktifkan]"
 * Automatically turns on device GPS switch when user taps [Aktifkan].
 */
export async function promptTurnOnGps() {
  const accuracy = await getLocationAccuracyPlugin();
  if (!accuracy) {
    console.warn("LocationAccuracy plugin not found or not running on native mobile.");
    return false;
  }

  return new Promise((resolve) => {
    const requestDirectly = () => {
      const priority = accuracy.REQUEST_PRIORITY_HIGH_ACCURACY || 1;
      accuracy.request(
        (success) => {
          console.log("GPS successfully turned ON via Google Akurasi Lokasi dialog:", success);
          resolve(true);
        },
        (error) => {
          console.warn("GPS request dialog cancelled or error:", error);
          resolve(false);
        },
        priority
      );
    };

    if (typeof accuracy.canRequest === 'function') {
      accuracy.canRequest(
        (canReq) => {
          console.log("LocationAccuracy canRequest result:", canReq);
          requestDirectly();
        },
        (err) => {
          console.warn("LocationAccuracy canRequest error:", err);
          requestDirectly();
        }
      );
    } else {
      requestDirectly();
    }
  });
}

// ─── GMaps Location Modal (Singleton) ───

let _gmapsModalActive = false;

/**
 * Tampilkan Pop-up Dialog persis Google Maps (Akurasi Lokasi).
 * Singleton: hanya bisa tampil 1x di layar secara bersamaan.
 * 
 * @param {Object} options
 * @param {Function} options.onActivate - Callback saat tombol [Aktifkan] ditekan
 * @param {Function} options.onCancel - Callback saat tombol [Lain kali] ditekan
 * @returns {HTMLElement|null} overlay element, atau null jika sudah ada modal aktif
 */
export function showGmapsLocationModal({ onActivate, onCancel } = {}) {
  // Singleton guard — cegah pop-up muncul lebih dari 1 kali
  if (_gmapsModalActive) {
    console.log('[Geolocation] GMaps modal sudah aktif, skip duplikat.');
    return null;
  }
  _gmapsModalActive = true;

  // Hapus sisa overlay lama jika ada di DOM
  document.querySelectorAll('.gmaps-location-overlay').forEach(el => el.remove());

  // Inject keyframe animation CSS (sekali saja)
  if (!document.getElementById('gmaps-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'gmaps-modal-styles';
    style.textContent = `
      @keyframes gmapsFadeIn {
        from { opacity: 0; transform: scale(0.92); }
        to { opacity: 1; transform: scale(1); }
      }
      .gmaps-location-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(0, 0, 0, 0.72);
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
      }
      .gmaps-location-card {
        background: #202124;
        color: #e8eaed;
        border-radius: 28px;
        width: 100%;
        max-width: 360px;
        padding: 24px;
        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        animation: gmapsFadeIn 0.22s cubic-bezier(0.2, 0, 0, 1);
        box-sizing: border-box;
      }
      .gmaps-btn-hover:active {
        background: rgba(138, 180, 248, 0.24) !important;
      }
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.className = 'gmaps-location-overlay';
  overlay.innerHTML = `
    <div class="gmaps-location-card">
      <h3 style="font-size: 1.15rem; font-weight: 500; color: #ffffff; margin: 0 0 16px 0; line-height: 1.4; text-align: left;">
        Untuk melanjutkan, perangkat Anda harus menggunakan Akurasi Lokasi
      </h3>
      
      <div style="font-size: 0.85rem; color: #e2e8f0; margin-bottom: 16px; text-align: left;">
        Setelan berikut harus diaktifkan:
      </div>

      <!-- Item 1: Lokasi Perangkat -->
      <div style="display: flex; gap: 16px; align-items: flex-start; margin-bottom: 18px;">
        <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #8ab4f8; margin-top: 1px;">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
        <div style="text-align: left;">
          <div style="font-size: 0.92rem; font-weight: 500; color: #ffffff; line-height: 1.3;">Lokasi perangkat</div>
        </div>
      </div>

      <!-- Item 2: Akurasi Lokasi -->
      <div style="display: flex; gap: 16px; align-items: flex-start; margin-bottom: 16px;">
        <div style="width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #8ab4f8; margin-top: 1px;">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
          </svg>
        </div>
        <div style="text-align: left;">
          <div style="font-size: 0.92rem; font-weight: 500; color: #ffffff; margin-bottom: 4px; line-height: 1.3;">Akurasi Lokasi</div>
          <div style="font-size: 0.78rem; color: #bdc1c6; line-height: 1.45;">
            Akurasi Lokasi, yang memberikan lokasi yang lebih akurat untuk aplikasi dan layanan. Agar dapat melakukannya, Google secara berkala memproses informasi tentang sensor perangkat dan sinyal nirkabel dari perangkat Anda untuk melakukan crowdsource lokasi sinyal nirkabel. Informasi ini digunakan tanpa mengidentifikasi Anda untuk meningkatkan akurasi lokasi serta layanan yang berbasis lokasi, serta untuk meningkatkan, menyediakan, dan mengelola layanan Google berdasarkan kepentingan sah Google dan pihak ketiga untuk melayani kebutuhan pengguna.
          </div>
        </div>
      </div>

      <!-- Footer Note -->
      <div style="font-size: 0.75rem; color: #9aa0a6; text-align: left; margin-bottom: 24px; line-height: 1.4;">
        Anda dapat mengubahnya kapan saja di setelan lokasi. <span id="gmaps-link-settings" style="color: #8ab4f8; text-decoration: underline; cursor: pointer;">Kelola setelan</span> atau <span id="gmaps-link-help" style="color: #8ab4f8; text-decoration: underline; cursor: pointer;">pelajari lebih lanjut</span>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px;">
        <button id="gmaps-btn-cancel" class="gmaps-btn-hover" style="background: none; border: none; color: #8ab4f8; font-size: 0.9rem; font-weight: 600; padding: 10px 16px; border-radius: 20px; cursor: pointer; outline: none; transition: background 0.2s;">
          Lain kali
        </button>
        <button id="gmaps-btn-activate" class="gmaps-btn-hover" style="background: none; border: none; color: #8ab4f8; font-size: 0.9rem; font-weight: 700; padding: 10px 16px; border-radius: 20px; cursor: pointer; outline: none; transition: background 0.2s;">
          Aktifkan
        </button>
      </div>
    </div>
  `;

  // Helper: tutup modal & reset flag
  const closeModal = () => {
    _gmapsModalActive = false;
    if (overlay.parentNode) overlay.remove();
  };

  overlay.querySelector('#gmaps-btn-cancel').addEventListener('click', () => {
    closeModal();
    if (onCancel) onCancel();
  });

  overlay.querySelector('#gmaps-btn-activate').addEventListener('click', () => {
    // Hapus overlay DULU agar tidak memblokir dialog native Google Play Services
    closeModal();
    if (onActivate) onActivate();
  });

  overlay.querySelector('#gmaps-link-settings')?.addEventListener('click', () => {
    closeModal();
    openLocationSettings();
  });

  overlay.querySelector('#gmaps-link-help')?.addEventListener('click', () => {
    alert("Akurasi Lokasi menggunakan GPS, Wi-Fi, dan jaringan seluler untuk mendeteksi posisi Anda dengan cepat dan akurat.");
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
      if (onCancel) onCancel();
    }
  });

  document.body.appendChild(overlay);
  return overlay;
}

// ─── Location Request API ───

/**
 * Minta izin lokasi dan langsung ambil koordinat.
 * Jika GPS mati dan silent=false, otomatis tampilkan pop-up GMaps lalu aktifkan GPS.
 * 
 * @param {Object} options
 * @param {boolean} options.silent - true = tidak tampilkan pop-up apapun
 * @param {number} options.timeout - Timeout dalam ms (default 10000)
 * @param {number} options.maxRetries - Jumlah retry (default 1)
 * @returns {Promise<{lat, lon, error}>}
 */
export async function requestLocationWithPermission({ silent = false, timeout = 10000, maxRetries = 1 } = {}) {
  // 1. Cek permission
  try {
    let permStatus = await Geolocation.checkPermissions();
    const isGranted = permStatus.location === 'granted' || permStatus.coarseLocation === 'granted';

    if (!isGranted) {
      // Jika silent, jangan minta permission (mengganggu user)
      if (silent) {
        return { lat: null, lon: null, error: 'PERMISSION_NOT_GRANTED' };
      }
      permStatus = await Geolocation.requestPermissions();
      const isNowGranted = permStatus.location === 'granted' || permStatus.coarseLocation === 'granted';
      if (!isNowGranted) {
        return { lat: null, lon: null, error: 'PERMISSION_DENIED' };
      }
    }
  } catch (permErr) {
    console.warn('[Geolocation] Permission check error:', permErr);
  }

  // 2. Coba ambil posisi langsung (mungkin GPS sudah nyala)
  const quickResult = await _tryGetPosition(timeout);
  if (quickResult && quickResult.lat !== null) {
    return quickResult;
  }

  // 3. GPS kemungkinan mati — jika silent, kembalikan saja hasilnya
  if (silent) {
    return quickResult || { lat: null, lon: null, error: 'GPS_OFF' };
  }

  // 4. Tidak silent → Tampilkan pop-up GMaps untuk minta user aktifkan lokasi
  return new Promise((resolve) => {
    const modal = showGmapsLocationModal({
      onActivate: async () => {
        // User tekan "Aktifkan" → overlay sudah di-remove oleh closeModal()
        // Panggil native Google Play Services dialog untuk nyalakan GPS
        await promptTurnOnGps();

        // Tunggu sebentar agar GPS sempat menyala
        await new Promise(r => setTimeout(r, 1500));

        // Coba ambil posisi lagi setelah GPS dinyalakan
        const freshResult = await _tryGetPosition(8000);
        resolve(freshResult || { lat: null, lon: null, error: 'GPS_STILL_OFF' });
      },
      onCancel: () => {
        resolve({ lat: null, lon: null, error: 'CANCELLED_BY_USER' });
      }
    });

    // Jika modal gagal muncul (singleton guard), langsung resolve
    if (!modal) {
      resolve(quickResult || { lat: null, lon: null, error: 'MODAL_BLOCKED' });
    }
  });
}

/**
 * Internal: Coba ambil posisi GPS, return { lat, lon } atau { lat: null, lon: null }.
 * Tidak ada modal, tidak ada prompt — murni fetch posisi saja.
 */
async function _tryGetPosition(timeout = 8000) {
  try {
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: timeout,
      maximumAge: 5000
    });

    if (position && position.coords) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      localStorage.setItem('bglow_user_lat', lat);
      localStorage.setItem('bglow_user_lon', lon);
      return { lat, lon, error: null };
    }
  } catch (err) {
    console.warn('[Geolocation] getCurrentPosition error:', err);

    // Web fallback
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      try {
        const webPos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 5000
          });
        });
        if (webPos && webPos.coords) {
          const lat = webPos.coords.latitude;
          const lon = webPos.coords.longitude;
          localStorage.setItem('bglow_user_lat', lat);
          localStorage.setItem('bglow_user_lon', lon);
          return { lat, lon, error: null };
        }
      } catch (webErr) {
        console.warn('[Geolocation] Web fallback error:', webErr);
      }
    }
  }

  return { lat: null, lon: null, error: 'GPS_OFF' };
}

/**
 * Cek apakah permission lokasi sudah granted.
 * @returns {Promise<boolean>}
 */
export async function isLocationPermissionGranted() {
  try {
    const permStatus = await Geolocation.checkPermissions();
    return permStatus.location === 'granted' || permStatus.coarseLocation === 'granted';
  } catch (e) {
    console.warn('checkPermissions error:', e);
    return false;
  }
}

/**
 * Watch posisi lokasi secara continuous.
 * Mengembalikan watchId yang bisa dipakai untuk clearWatch.
 * 
 * @param {Function} onPosition - Callback saat posisi berubah: ({ lat, lon }) => void
 * @param {Function} onError - Callback saat error
 * @returns {Promise<string|null>} watchId
 */
export async function watchLocation(onPosition, onError) {
  try {
    const watchId = await Geolocation.watchPosition(
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 },
      (position, err) => {
        if (err) {
          if (onError) onError(err);
          return;
        }
        if (position && position.coords) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          localStorage.setItem('bglow_user_lat', lat);
          localStorage.setItem('bglow_user_lon', lon);
          if (onPosition) onPosition({ lat, lon });
        }
      }
    );
    return watchId;
  } catch (e) {
    console.warn('watchPosition error:', e);
    if (onError) onError(e);
    return null;
  }
}

/**
 * Stop watching posisi.
 * @param {string} watchId
 */
export async function clearLocationWatch(watchId) {
  if (watchId != null) {
    try {
      await Geolocation.clearWatch({ id: watchId });
    } catch (e) {
      console.warn('clearWatch error:', e);
    }
  }
}
