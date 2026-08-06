import { setSubscriptionPlan } from './store.js';

export const PRODUCT_GLOW_PLUS = 'glow_plus_monthly';

let isInitialized = false;
let initPromise = null;
let _onStatusUpdate = null;

/**
 * Cek apakah aplikasi berjalan di native Android (Capacitor)
 */
function isNativeAndroid() {
  return typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
}

/**
 * Helper untuk mengambil instance CdvPurchase / store
 */
function getCdvPurchase() {
  if (typeof window === 'undefined') return null;
  if (window.CdvPurchase && window.CdvPurchase.store) return window.CdvPurchase;
  if (window.store && window.store.register) {
    return {
      store: window.store,
      ProductType: window.CdvPurchase?.ProductType || window.store.ProductType || {},
      Platform: window.CdvPurchase?.Platform || window.store.Platform || {},
      LogLevel: window.CdvPurchase?.LogLevel || window.store.LogLevel || {}
    };
  }
  if (window.CdvPurchase) {
    return {
      store: window.CdvPurchase.store || window.CdvPurchase,
      ProductType: window.CdvPurchase.ProductType || {},
      Platform: window.CdvPurchase.Platform || {},
      LogLevel: window.CdvPurchase.LogLevel || {}
    };
  }
  return null;
}

/**
 * Polling untuk menunggu plugin CdvPurchase / store siap di window
 */
function waitForCdvPurchase(timeoutMs = 6000) {
  return new Promise((resolve) => {
    if (getCdvPurchase()) {
      resolve(getCdvPurchase());
      return;
    }

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const instance = getCdvPurchase();
      if (instance) {
        clearInterval(interval);
        console.log(`[Billing] CdvPurchase siap setelah ${attempts * 100}ms polling.`);
        resolve(instance);
      } else if (attempts * 100 >= timeoutMs) {
        clearInterval(interval);
        console.warn(`[Billing] Polling timeout (${timeoutMs}ms).`);
        resolve(null);
      }
    }, 100);

    document.addEventListener('deviceready', () => {
      const instance = getCdvPurchase();
      if (instance) {
        clearInterval(interval);
        console.log('[Billing] CdvPurchase siap via deviceready.');
        resolve(instance);
      }
    }, false);
  });
}

/**
 * Inisialisasi Google Play Billing Store
 */
export function initBilling(onStatusUpdate) {
  if (onStatusUpdate) _onStatusUpdate = onStatusUpdate;

  if (initPromise) return initPromise;

  initPromise = _doInit();
  return initPromise;
}

async function _doInit() {
  if (typeof window === 'undefined') return false;

  const instance = await waitForCdvPurchase(6000);

  if (!instance || !instance.store) {
    console.log('[Billing] Plugin CdvPurchase tidak terdeteksi.');
    return false;
  }

  const store = instance.store;
  const Platform = instance.Platform || {};
  const ProductType = instance.ProductType || {};
  const googlePlatform = Platform.GOOGLE_PLAY || 'google-play';

  try {
    if (store.verbosity !== undefined) {
      store.verbosity = instance.LogLevel?.DEBUG || 4;
    }

    // 1. Registrasi produk langganan GlowPlus SEBELUM initialize
    console.log('[Billing] Registrasi produk:', PRODUCT_GLOW_PLUS);
    store.register([{
      id: PRODUCT_GLOW_PLUS,
      type: ProductType.PAID_SUBSCRIPTION || 'paid subscription',
      platform: googlePlatform
    }]);

    // 2. Setup Event Listeners
    store.when()
      .approved(async (transaction) => {
        console.log('[Billing] Transaksi APPROVED oleh Google Play:', transaction);
        try {
          await transaction.finish();
          console.log('[Billing] Transaksi FINISHED.');
        } catch (e) {
          console.warn('[Billing] Finish transaction warning:', e);
        }
        setSubscriptionPlan('glow-plus');
        if (_onStatusUpdate) _onStatusUpdate({ success: true, plan: 'glow-plus' });
      })
      .finished((transaction) => {
        console.log('[Billing] Transaksi FINISHED:', transaction);
        setSubscriptionPlan('glow-plus');
        if (_onStatusUpdate) _onStatusUpdate({ success: true, plan: 'glow-plus' });
      })
      .verified((receipt) => {
        console.log('[Billing] Resi VERIFIED:', receipt);
        if (receipt && receipt.finish) receipt.finish();
        setSubscriptionPlan('glow-plus');
      })
      .error((error) => {
        console.error('[Billing] Store error:', error);
        if (_onStatusUpdate) {
          _onStatusUpdate({ success: false, error: error.message || 'Gagal memproses transaksi.' });
        }
      });

    // 3. Inisialisasi Platform Adapter dan TUNGGU hingga siap
    console.log('[Billing] Inisialisasi Google Play platform adapter...');
    if (store.initialize) {
      await store.initialize([googlePlatform]);
    }

    // 4. Tunggu sampai store adapter benar-benar READY
    await new Promise((resolve) => {
      if (store.ready) {
        resolve();
        return;
      }
      if (store.when) {
        store.when().ready(() => resolve());
      }
      setTimeout(() => resolve(), 4000);
    });

    isInitialized = true;
    console.log('[Billing] ✅ Google Play Billing Adapter SUDAH SIAP (READY)!');
    return true;

  } catch (err) {
    console.error('[Billing] ❌ Gagal inisialisasi store adapter:', err);
    return false;
  }
}

/**
 * Memulai alur pembelian langganan GlowPlus via Google Play Billing
 */
export async function purchaseGlowPlus() {
  console.log('[Billing] purchaseGlowPlus() dipanggil');

  // Pastikan inisialisasi dijalankan dan DITUNGGU sampai selesai
  await initBilling();

  const instance = getCdvPurchase();
  const store = instance ? instance.store : null;

  if (store) {
    const Platform = instance.Platform || {};
    const platformGoogle = Platform.GOOGLE_PLAY || 'google-play';

    // Jika store belum initialized, jalankan initialize paksa
    if (!isInitialized && store.initialize) {
      try {
        console.log('[Billing] Memaksa store.initialize([googlePlatform])...');
        await store.initialize([platformGoogle]);
        isInitialized = true;
      } catch (e) {
        console.warn('[Billing] Retry initialize warning:', e);
      }
    }

    // Cek produk dari memory store
    let product = store.get ? store.get(PRODUCT_GLOW_PLUS, platformGoogle) : null;
    if (!product && store.get) {
      product = store.get(PRODUCT_GLOW_PLUS);
    }

    console.log('[Billing] Product object di memory store:', product);

    try {
      if (product) {
        const offer = product.offers && product.offers.length > 0
          ? product.offers[0]
          : (product.getOffer ? product.getOffer() : null);

        if (offer && store.order) {
          console.log('[Billing] Ordering offer:', offer);
          const res = await store.order(offer);
          if (res && res.isError) {
            console.error('[Billing] Order offer error:', res);
            return { success: false, error: res.message || 'Pembelian dibatalkan atau gagal.' };
          }
          return { success: true, pending: true };
        }
      }

      // Order produk ID langsung jika offer belum terbaca
      if (store.order) {
        console.log('[Billing] Memanggil store.order dengan ID:', PRODUCT_GLOW_PLUS);
        const res = await store.order(PRODUCT_GLOW_PLUS);
        if (res && res.isError) {
          console.error('[Billing] Order product error:', res);
          return { success: false, error: res.message || 'Gagal membuka Google Play Billing.' };
        }
        return { success: true, pending: true };
      }

    } catch (err) {
      console.error('[Billing] Order exception:', err);
      return { success: false, error: err.message || 'Gagal memproses pesanan di Google Play.' };
    }
  }

  // Fallback Web Browser (Non-Native)
  if (!isNativeAndroid()) {
    console.log('[Billing] Web Simulation Mode: Mengaktifkan Glow Plus...');
    setSubscriptionPlan('glow-plus');
    return { success: true, simulated: true };
  }

  // Android Native tapi store gagal load
  return { 
    success: false, 
    error: 'Google Play Billing adapter belum siap. Pastikan koneksi internet aktif.' 
  };
}

/**
 * Memulihkan (restore) pembelian langganan Google Play sebelumnya
 */
export async function restorePurchases() {
  await initBilling();

  const instance = getCdvPurchase();
  const store = instance ? instance.store : null;

  if (store && store.restorePurchases) {
    try {
      await store.restorePurchases();
      return { success: true };
    } catch (err) {
      console.error('[Billing] Restore purchases failed:', err);
      return { success: false, error: err.message };
    }
  }

  if (!isNativeAndroid()) {
    setSubscriptionPlan('glow-plus');
    return { success: true, simulated: true };
  }

  return { success: false, error: 'Tidak dapat terhubung ke Google Play Store.' };
}
