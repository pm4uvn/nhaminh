import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  LucideIcon,
} from "lucide-react";

export interface WeatherNow {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

export interface WeatherDay {
  date: string; // ISO date
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
}

export interface WeatherData {
  current: WeatherNow;
  daily: WeatherDay[];
  fetchedAt: number;
}

interface WeatherCodeMeta {
  label: string;
  icon: LucideIcon;
}

// Mã thời tiết WMO dùng bởi Open-Meteo: https://open-meteo.com/en/docs
const WEATHER_CODE_META: Record<number, WeatherCodeMeta> = {
  0: { label: "Trời quang", icon: Sun },
  1: { label: "Quang mây", icon: Sun },
  2: { label: "Có mây", icon: CloudSun },
  3: { label: "Nhiều mây", icon: Cloud },
  45: { label: "Sương mù", icon: CloudFog },
  48: { label: "Sương mù", icon: CloudFog },
  51: { label: "Mưa phùn nhẹ", icon: CloudDrizzle },
  53: { label: "Mưa phùn", icon: CloudDrizzle },
  55: { label: "Mưa phùn dày", icon: CloudDrizzle },
  56: { label: "Mưa phùn lạnh", icon: CloudDrizzle },
  57: { label: "Mưa phùn lạnh", icon: CloudDrizzle },
  61: { label: "Mưa nhỏ", icon: CloudRain },
  63: { label: "Mưa vừa", icon: CloudRain },
  65: { label: "Mưa to", icon: CloudRain },
  66: { label: "Mưa lạnh", icon: CloudRain },
  67: { label: "Mưa lạnh to", icon: CloudRain },
  71: { label: "Tuyết nhẹ", icon: CloudSnow },
  73: { label: "Tuyết vừa", icon: CloudSnow },
  75: { label: "Tuyết to", icon: CloudSnow },
  77: { label: "Tuyết hạt", icon: CloudSnow },
  80: { label: "Mưa rào nhẹ", icon: CloudRain },
  81: { label: "Mưa rào", icon: CloudRain },
  82: { label: "Mưa rào mạnh", icon: CloudRain },
  85: { label: "Mưa tuyết nhẹ", icon: CloudSnow },
  86: { label: "Mưa tuyết to", icon: CloudSnow },
  95: { label: "Giông bão", icon: CloudLightning },
  96: { label: "Giông kèm mưa đá", icon: CloudLightning },
  99: { label: "Giông kèm mưa đá to", icon: CloudLightning },
};

export function weatherCodeMeta(code: number): WeatherCodeMeta {
  return WEATHER_CODE_META[code] ?? { label: "Không rõ", icon: Cloud };
}

export function isRainyCode(code: number): boolean {
  return (
    (code >= 51 && code <= 67) ||
    (code >= 80 && code <= 86) ||
    (code >= 95 && code <= 99)
  );
}

export async function fetchWeather(lat: number, lng: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lng.toFixed(4),
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
    forecast_days: "5",
    timezone: "auto",
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!res.ok) throw new Error("Không tải được dự báo thời tiết");
  const json = await res.json();

  const current: WeatherNow = {
    temperature: Math.round(json.current.temperature_2m),
    feelsLike: Math.round(json.current.apparent_temperature),
    humidity: Math.round(json.current.relative_humidity_2m),
    windSpeed: Math.round(json.current.wind_speed_10m),
    weatherCode: json.current.weather_code,
    isDay: json.current.is_day === 1,
  };

  const daily: WeatherDay[] = json.daily.time.map((date: string, i: number) => ({
    date,
    weatherCode: json.daily.weather_code[i],
    tempMax: Math.round(json.daily.temperature_2m_max[i]),
    tempMin: Math.round(json.daily.temperature_2m_min[i]),
    precipitationProbability: json.daily.precipitation_probability_max[i] ?? 0,
  }));

  return { current, daily, fetchedAt: Date.now() };
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | undefined> {
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      lat: lat.toFixed(6),
      lon: lng.toFixed(6),
    });
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return undefined;
    const json = await res.json();
    return json.display_name as string | undefined;
  } catch {
    return undefined;
  }
}

export function rainAdvisory(daily: WeatherDay[]): string | null {
  const upcoming = daily.slice(0, 3);
  const maxProb = Math.max(0, ...upcoming.map((d) => d.precipitationProbability));
  const hasStorm = upcoming.some((d) => d.weatherCode >= 95);

  if (hasStorm) {
    return "Có giông bão trong vài ngày tới — nên tạm dừng việc ngoài trời và che chắn vật liệu, giàn giáo.";
  }
  if (maxProb >= 60) {
    return "Mưa lớn dự kiến trong vài ngày tới — nên che chắn vật liệu và kiểm tra lại chống thấm trước khi mưa.";
  }
  if (maxProb >= 40) {
    return "Có khả năng mưa trong vài ngày tới — cân nhắc sắp xếp lại công việc ngoài trời.";
  }
  return null;
}
