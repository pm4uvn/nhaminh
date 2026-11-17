import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FieldLabel({ children, optional }: { children: ReactNode; optional?: boolean }) {
  return (
    <label className="block text-sm font-medium text-text-primary mb-1.5">
      {children}
      {optional && (
        <span className="text-text-secondary font-normal"> (không bắt buộc)</span>
      )}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full h-12 rounded-2xl bg-surface-2 border border-border px-4 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-text-secondary",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full min-h-24 rounded-2xl bg-surface-2 border border-border px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-text-secondary resize-none",
        className
      )}
      {...props}
    />
  );
}
