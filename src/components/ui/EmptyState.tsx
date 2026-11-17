import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="h-16 w-16 rounded-full bg-primary-light text-primary flex items-center justify-center mb-4">
        <Icon size={28} />
      </div>
      <h3 className="text-[16px] font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-xs mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
