// 1. IP Public VPS utama kamu
export const API_IP = '103.247.8.169'; 

// 2. Fungsi dinamis untuk mendeteksi environment (lokal vs production)
const getHostname = () => {
  if (typeof window === 'undefined') return API_IP;
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') {
    return API_IP;
  }
  return hostname;
};

const host = getHostname();

// 3. Base URL untuk komunikasi API lewat Nginx
export const API_BASE_URL = `http://${host}`;

// 4. Endpoint integrasi khusus fitur Live Scraping Scan BPOM
export const BPOM_API_URL = `${API_BASE_URL}/api/scan-bpom`;

// 5. Konfigurasi Kunci Masuk Sosial (Social Login Client IDs)
export const GOOGLE_CLIENT_ID = '500914454868-ltefle3i4i285epof5sbdigut4ep8sa3.apps.googleusercontent.com';
export const APPLE_CLIENT_ID = '';