// ─── Konfigurasi API B-Glow ───────────────────────────────────────────────

// URL Backend VPS production (Flask di port 5050)
export const API_BASE_URL = 'http://bglow.store:5050';

// Endpoint BPOM Scan (live scraping via backend)
export const BPOM_API_URL = `${API_BASE_URL}/api/scan-bpom`;

// Konfigurasi Kunci Masuk Sosial (Social Login Client IDs)
export const GOOGLE_CLIENT_ID = '500914454868-ltefle3i4i285epof5sbdigut4ep8sa3.apps.googleusercontent.com';
export const APPLE_CLIENT_ID = '';