"use client";

import { useRef } from "react";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImagePicker({
  value,
  onChange,
  className,
  label = "Thêm ảnh",
}: {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  className?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (value) {
    return (
      <div className={cn("relative rounded-2xl overflow-hidden h-40", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/50 text-white flex items-center justify-center"
          aria-label="Xóa ảnh"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={cn(
        "w-full h-40 rounded-2xl bg-surface-2 border border-dashed border-border flex flex-col items-center justify-center gap-2 text-text-secondary hover:bg-border/40 transition-colors",
        className
      )}
    >
      <Camera size={24} />
      <span className="text-sm">{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </button>
  );
}
