import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GRADIENTS = [
  ["#E6F2EE", "#286F65"],
  ["#FBE9DE", "#D98C68"],
  ["#FDECEC", "#D85C5C"],
  ["#FFF3DE", "#D99A32"],
  ["#E5F3EC", "#2F8B69"],
  ["#EAF0EF", "#20574F"],
];

export function seedGradient(seed?: string): string {
  if (!seed) return "linear-gradient(135deg, #E6F2EE, #286F65)";
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % GRADIENTS.length;
  }
  const [from, to] = GRADIENTS[Math.abs(hash) % GRADIENTS.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
}
