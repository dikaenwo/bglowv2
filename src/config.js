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
