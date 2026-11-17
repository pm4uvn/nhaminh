import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-2xl shadow-[0_1px_2px_rgba(32,43,41,0.04)]",
        className
      )}
      {...props}
    />
  );
}
