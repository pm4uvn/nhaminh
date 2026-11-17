"use client";

import { formatCurrencyInput, parseCurrencyInput } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CurrencyInput({
  value,
  onChange,
  placeholder = "0",
  autoFocus,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        autoFocus={autoFocus}
        value={formatCurrencyInput(value)}
        onChange={(e) => onChange(parseCurrencyInput(e.target.value))}
        placeholder={placeholder}
        className={cn(
          "w-full h-14 rounded-2xl bg-surface-2 border border-border pl-4 pr-12 text-2xl font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary",
          className
        )}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary text-base font-medium">
        đ
      </span>
    </div>
  );
}
