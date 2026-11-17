export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(amount)) + "đ";
}

export function formatCurrencyCompact(amount: number): string {
  if (amount >= 1_000_000_000) {
    const v = amount / 1_000_000_000;
    return `${trimZero(v)} tỷ`;
  }
  if (amount >= 1_000_000) {
    const v = amount / 1_000_000;
    return `${trimZero(v)} triệu`;
  }
  return formatCurrency(amount);
}

function trimZero(n: number): string {
  return n % 1 === 0 ? n.toString() : n.toFixed(1);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function parseCurrencyInput(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function formatCurrencyInput(value: number): string {
  if (!value) return "";
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatWeeksRemaining(weeks: number): string {
  if (weeks <= 12) return `khoảng ${weeks} tuần`;
  const months = Math.round(weeks / 4.345);
  return `khoảng ${months} tháng`;
}

export function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 11) return "Chào buổi sáng! 👋";
  if (h < 14) return "Chào buổi trưa! 👋";
  if (h < 18) return "Chào buổi chiều! 👋";
  return "Chào buổi tối! 👋";
}
