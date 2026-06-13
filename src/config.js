export const API_IP = '192.168.1.16';

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
export const GOOGLE_CLIENT_ID = '534452078793-porq14tnbklfibh77co76nb0uhbbup1i.apps.googleusercontent.com';
export const APPLE_CLIENT_ID = '';
