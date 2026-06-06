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

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,weather_code&daily=uv_index_max&timezone=auto`;
  
  const res = await fetch(url);
  const data = await res.json();
  
  const code = data.current.weather_code;
  const isDay = data.current.is_day === 1;
  
  let condition = 'Cerah';
  let icon = isDay ? '☀️' : '🌙';
  
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
  
  return {
    temp: Math.round(data.current.temperature_2m),
    condition,
    icon,
    uvIndex: data.daily && data.daily.uv_index_max ? Math.round(data.daily.uv_index_max[0]) : 0,
    humidity: data.current.relative_humidity_2m
  };
}
