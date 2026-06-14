export const API_IP = '192.168.1.58';

const getHostname = () => {
  if (typeof window === 'undefined') return API_IP;
  const hostname = window.location.hostname;
  if (!hostname || hostname === 'localhost' || hostname === '127.0.0.1') {
    return API_IP;
  }
  return hostname;
};

const host = getHostname();
export const API_BASE_URL = `http://${host}:8000`;
export const BPOM_API_URL = `http://${host}:7000/cekbpom`;

// Konfigurasi Kunci Masuk Sosial (Social Login Client IDs)
// Silakan isi nilai Client ID di bawah ini jika ingin menghubungkannya ke akun developer Google/Apple riil.
export const GOOGLE_CLIENT_ID = '500914454868-ltefle3i4i285epof5sbdigut4ep8sa3.apps.googleusercontent.com';
export const APPLE_CLIENT_ID = '';
