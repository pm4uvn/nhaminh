import { create } from "zustand";
import { fetchWeather, WeatherData } from "./weather";

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 phút

interface WeatherUiState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  coordsKey: string | null;
  loadWeather: (lat: number, lng: number) => Promise<void>;
}

function keyFor(lat: number, lng: number): string {
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

export const useWeatherUi = create<WeatherUiState>((set, get) => ({
  data: null,
  loading: false,
  error: null,
  coordsKey: null,

  loadWeather: async (lat, lng) => {
    const key = keyFor(lat, lng);
    const state = get();
    const isFresh =
      state.coordsKey === key && state.data && Date.now() - state.data.fetchedAt < CACHE_TTL_MS;
    if (isFresh || state.loading) return;

    set({ loading: true, error: null });
    try {
      const data = await fetchWeather(lat, lng);
      set({ data, coordsKey: key, loading: false, error: null });
    } catch {
      set({ loading: false, error: "Không tải được dự báo thời tiết. Kiểm tra kết nối mạng." });
    }
  },
}));
