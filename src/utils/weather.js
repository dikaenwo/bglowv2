// Kunci API OpenWeatherMap — Silakan isi dengan API Key Anda agar data UV Index terhubung secara langsung
const OPENWEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY';

export async function fetchWeather() {
  let lat = -6.2088; // Default Jakarta
  let lon = 106.8456;
  
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });
    lat = pos.coords.latitude;
    lon = pos.coords.longitude;
  } catch(e) {}

  // 1. Ambil data cuaca umum dari Open-Meteo
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code&timezone=auto`;
  
  let temp = 28;
  let condition = 'Cerah';
  let isDay = true;
  let icon = '☀️';
  let humidity = 80;

  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data && data.current) {
      const code = data.current.weather_code;
      isDay = data.current.is_day === 1;
      
      condition = 'Cerah';
      icon = isDay ? '☀️' : '🌙';
      
      if (code >= 1 && code <= 3) {
        condition = 'Berawan';
        icon = isDay ? '⛅' : '☁️';
      } else if (code >= 45 && code <= 48) {
        condition = 'Berkabut';
        icon = '🌫️';
      } else if (code >= 51 && code <= 67) {
        condition = 'Hujan';
        icon = '🌧️';
      } else if (code >= 71 && code <= 77) {
        condition = 'Salju';
        icon = '❄️';
      } else if (code >= 95) {
        condition = 'Badai';
        icon = '⛈️';
      }

      temp = Math.round(data.current.temperature_2m);
      humidity = data.current.relative_humidity_2m;
    }
  } catch(e) {
    console.error("Gagal mengambil data cuaca dari Open-Meteo:", e);
  }

  // 2. Ambil data UV Index dari OpenWeatherMap
  let uvIndex = 0;
  
  if (OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'YOUR_OPENWEATHER_API_KEY') {
    try {
      // Menggunakan endpoint resmi UV Index API OpenWeatherMap
      const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
      const uvRes = await fetch(uvUrl);
      if (uvRes.ok) {
        const uvData = await uvRes.json();
        if (uvData && typeof uvData.value === 'number') {
          uvIndex = Math.round(uvData.value);
        }
      } else {
        console.warn(`OpenWeatherMap API mengembalikan status: ${uvRes.status}`);
      }
    } catch(e) {
      console.error("Gagal mengambil data UV dari OpenWeatherMap:", e);
    }
  } else {
    // Estimasi/Simulasi UV Index berbasis waktu lokal sebagai cadangan jika API Key belum diisi
    const localHour = new Date().getHours();
    const isNight = localHour >= 18 || localHour < 6;
    if (!isNight) {
      if (localHour >= 11 && localHour <= 13) {
        uvIndex = 8; // Puncak UV siang hari
      } else if ((localHour >= 9 && localHour < 11) || (localHour > 13 && localHour <= 15)) {
        uvIndex = 5; // Sedang
      } else {
        uvIndex = 2; // Rendah
      }
    }
  }
  
  return {
    temp,
    condition,
    icon,
    uvIndex,
    humidity
  };
}
