import { Camera, Image as ImageIcon } from "lucide-react";
import { seedGradient, cn } from "@/lib/utils";

export function PhotoPlaceholder({
  seed,
  src,
  className,
  iconSize = 20,
}: {
  seed?: string;
  src?: string;
  className?: string;
  iconSize?: number;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className={cn("object-cover w-full h-full", className)}
      />
    );
  }
  return (
    <div
      className={cn("flex items-center justify-center text-white/70", className)}
      style={{ background: seedGradient(seed) }}
    >
      {seed ? <Camera size={iconSize} /> : <ImageIcon size={iconSize} />}
    </div>
  );
}
