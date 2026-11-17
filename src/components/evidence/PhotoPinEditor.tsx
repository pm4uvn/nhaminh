"use client";

import { PhotoPin } from "@/lib/types";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { cn } from "@/lib/utils";

export function PhotoPinEditor({
  photoUrl,
  photoSeed,
  pins,
  onAddPin,
  onSelectPin,
  readOnly,
  className,
}: {
  photoUrl?: string;
  photoSeed?: string;
  pins: PhotoPin[];
  onAddPin?: (x: number, y: number) => void;
  onSelectPin?: (pin: PhotoPin) => void;
  readOnly?: boolean;
  className?: string;
}) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly || !onAddPin) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onAddPin(Math.round(x * 10) / 10, Math.round(y * 10) / 10);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative w-full rounded-2xl overflow-hidden",
        !readOnly && "cursor-crosshair",
        className
      )}
    >
      <PhotoPlaceholder src={photoUrl} seed={photoSeed} className="w-full h-full" iconSize={28} />

      {pins.map((pin, i) => (
        <button
          key={pin.id}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectPin?.(pin);
          }}
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-terracotta text-white text-xs font-semibold flex items-center justify-center shadow-md ring-2 ring-white"
          aria-label={pin.label}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
