"use client";

import { Sheet } from "@/components/ui/Sheet";
import { useAppStore } from "@/lib/store";
import { useWeatherUi } from "@/lib/weather-store";
import { weatherCodeMeta, rainAdvisory } from "@/lib/weather";
import { AlertTriangle, Droplets, Wind, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];

function dayLabel(iso: string, index: number): string {
  if (index === 0) return "Hôm nay";
  if (index === 1) return "Ngày mai";
  const d = new Date(iso);
  return WEEKDAY_LABELS[d.getDay()];
}

export function WeatherDetailSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useAppStore((s) => s.homeProfile?.location);
  const { data } = useWeatherUi();

  if (!data || !location) return null;

  const advisory = rainAdvisory(data.daily);
  const currentMeta = weatherCodeMeta(data.current.weatherCode);
  const CurrentIcon = currentMeta.icon;

  return (
    <Sheet open={open} onClose={onClose} title="Dự báo thời tiết">
      <div className="pt-1 space-y-5">
        <div className="flex items-center gap-1.5 text-sm text-text-secondary">
          <MapPin size={14} />
          <span className="truncate">{location.address ?? "Khu vực nhà bạn"}</span>
        </div>

        <div className="rounded-2xl bg-primary-light p-5 text-center">
          <CurrentIcon size={40} className="text-primary mx-auto mb-2" />
          <p className="text-4xl font-bold text-primary-dark tabular-nums">
            {data.current.temperature}°
          </p>
          <p className="text-sm text-primary-dark mt-1">{currentMeta.label}</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-primary-dark/80">
            <span className="flex items-center gap-1">
              <Droplets size={13} /> Độ ẩm {data.current.humidity}%
            </span>
            <span className="flex items-center gap-1">
              <Wind size={13} /> Gió {data.current.windSpeed} km/h
            </span>
          </div>
        </div>

        {advisory && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-warning/10 px-4 py-3">
            <AlertTriangle size={16} className="text-warning mt-0.5 shrink-0" />
            <p className="text-sm text-text-primary leading-relaxed">{advisory}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-2">Dự báo 5 ngày</p>
          <div className="divide-y divide-border">
            {data.daily.map((day, i) => {
              const meta = weatherCodeMeta(day.weatherCode);
              const Icon = meta.icon;
              return (
                <div key={day.date} className="flex items-center gap-3 py-2.5">
                  <span className="text-sm font-medium w-16 shrink-0">{dayLabel(day.date, i)}</span>
                  <Icon size={18} className="text-primary shrink-0" />
                  <span className="text-xs text-text-secondary flex-1 truncate">{meta.label}</span>
                  <span
                    className={cn(
                      "text-xs tabular-nums shrink-0",
                      day.precipitationProbability >= 40 ? "text-primary font-medium" : "text-text-secondary"
                    )}
                  >
                    {day.precipitationProbability}% mưa
                  </span>
                  <span className="text-sm font-medium tabular-nums shrink-0 w-16 text-right">
                    {day.tempMin}° / {day.tempMax}°
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed">
          Dữ liệu từ Open-Meteo, chỉ mang tính tham khảo để sắp xếp công việc thi công ngoài trời.
        </p>
      </div>
    </Sheet>
  );
}
