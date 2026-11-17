"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/lib/store";
import { useWeatherUi } from "@/lib/weather-store";
import { weatherCodeMeta, rainAdvisory } from "@/lib/weather";
import { WeatherDetailSheet } from "./WeatherDetailSheet";

export function WeatherCard() {
  const location = useAppStore((s) => s.homeProfile?.location);
  const { data, loading, error, loadWeather } = useWeatherUi();
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (location) loadWeather(location.lat, location.lng);
  }, [location, loadWeather]);

  if (!location) {
    return (
      <Link href="/settings">
        <Card className="p-4 flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center shrink-0">
            <MapPin size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium">Thêm vị trí nhà</p>
            <p className="text-xs text-text-secondary">Để xem dự báo thời tiết khu vực</p>
          </div>
          <ChevronRight size={18} className="text-text-secondary shrink-0" />
        </Card>
      </Link>
    );
  }

  if (loading && !data) {
    return (
      <Card className="p-4">
        <div className="h-14 animate-pulse rounded-xl bg-surface-2" />
      </Card>
    );
  }

  if (error && !data) {
    return (
      <Card className="p-4">
        <p className="text-sm text-text-secondary">{error}</p>
      </Card>
    );
  }

  if (!data) return null;

  const meta = weatherCodeMeta(data.current.weatherCode);
  const Icon = meta.icon;
  const advisory = rainAdvisory(data.daily);

  return (
    <>
      <button onClick={() => setDetailOpen(true)} className="w-full text-left">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary-light text-primary-dark flex items-center justify-center shrink-0">
              <Icon size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold tabular-nums">{data.current.temperature}°</span>
                <span className="text-sm text-text-secondary">{meta.label}</span>
              </div>
              <p className="text-xs text-text-secondary truncate mt-0.5">
                {location.address ?? "Khu vực nhà bạn"}
              </p>
            </div>
            <ChevronRight size={18} className="text-text-secondary shrink-0" />
          </div>

          {advisory && (
            <div className="mt-3 flex items-start gap-2 rounded-xl bg-warning/10 px-3 py-2.5">
              <AlertTriangle size={15} className="text-warning mt-0.5 shrink-0" />
              <p className="text-xs text-text-primary leading-relaxed">{advisory}</p>
            </div>
          )}
        </Card>
      </button>

      <WeatherDetailSheet open={detailOpen} onClose={() => setDetailOpen(false)} />
    </>
  );
}
