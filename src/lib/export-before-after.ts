import { JournalEntry } from "./types";
import { formatDate } from "./format";
import { seedGradient } from "./utils";

const WIDTH = 1080;
const HEIGHT = 1350;
const MARGIN_X = 60;
const PHOTO_WIDTH = WIDTH - MARGIN_X * 2;
const PHOTO_HEIGHT = 540;
const GAP = 30;
const TOP = 190;
const RADIUS = 28;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function gradientColors(seed?: string): [string, string] {
  const css = seedGradient(seed);
  const matches = css.match(/#[0-9a-fA-F]{6}/g);
  return matches && matches.length >= 2 ? [matches[0], matches[1]] : ["#E6F2EE", "#286F65"];
}

async function drawPhotoBlock(
  ctx: CanvasRenderingContext2D,
  entry: JournalEntry,
  label: string,
  x: number,
  y: number,
  w: number,
  h: number
) {
  roundRectPath(ctx, x, y, w, h, RADIUS);
  ctx.save();
  ctx.clip();

  if (entry.photoUrl) {
    try {
      const img = await loadImage(entry.photoUrl);
      drawImageCover(ctx, img, x, y, w, h);
    } catch {
      fillPlaceholder();
    }
  } else {
    fillPlaceholder();
  }

  function fillPlaceholder() {
    const [from, to] = gradientColors(entry.photoSeed ?? entry.caption);
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, from);
    grad.addColorStop(1, to);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);
  }

  ctx.restore();

  // Nhãn "TRƯỚC"/"SAU"
  ctx.font = "700 34px 'Be Vietnam Pro', system-ui, sans-serif";
  const labelPaddingX = 24;
  const labelWidth = ctx.measureText(label).width + labelPaddingX * 2;
  const labelHeight = 56;
  const labelX = x + 24;
  const labelY = y + 24;
  ctx.fillStyle = "rgba(32, 87, 79, 0.85)";
  roundRectPath(ctx, labelX, labelY, labelWidth, labelHeight, labelHeight / 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.textBaseline = "middle";
  ctx.fillText(label, labelX + labelPaddingX, labelY + labelHeight / 2 + 2);

  // Ngày tháng
  const dateText = formatDate(entry.date);
  ctx.font = "500 28px 'Be Vietnam Pro', system-ui, sans-serif";
  const dateWidth = ctx.measureText(dateText).width + 32;
  const dateHeight = 46;
  const dateX = x + w - dateWidth - 24;
  const dateY = y + h - dateHeight - 24;
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  roundRectPath(ctx, dateX, dateY, dateWidth, dateHeight, dateHeight / 2);
  ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(dateText, dateX + 16, dateY + dateHeight / 2 + 1);
}

export async function composeBeforeAfterImage(
  before: JournalEntry,
  after: JournalEntry,
  homeName: string
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Không khởi tạo được canvas");

  ctx.fillStyle = "#F8F7F3";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.textAlign = "left";

  // Header: tên nhà
  ctx.fillStyle = "#202B29";
  ctx.font = "700 44px 'Be Vietnam Pro', system-ui, sans-serif";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(homeName, MARGIN_X, 90);

  ctx.fillStyle = "#71807A";
  ctx.font = "500 30px 'Be Vietnam Pro', system-ui, sans-serif";
  ctx.fillText("Trước & Sau", MARGIN_X, 140);

  await drawPhotoBlock(ctx, before, "TRƯỚC", MARGIN_X, TOP, PHOTO_WIDTH, PHOTO_HEIGHT);
  await drawPhotoBlock(
    ctx,
    after,
    "SAU",
    MARGIN_X,
    TOP + PHOTO_HEIGHT + GAP,
    PHOTO_WIDTH,
    PHOTO_HEIGHT
  );

  // Footer
  ctx.fillStyle = "#71807A";
  ctx.font = "500 28px 'Be Vietnam Pro', system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Nhà Mình · Xây nhà an tâm, mọi thứ trong tầm tay.", WIDTH / 2, HEIGHT - 36);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Không tạo được ảnh"));
    }, "image/png");
  });
}

export async function shareOrDownloadImage(blob: Blob, filename: string): Promise<"shared" | "downloaded"> {
  const file = new File([blob], filename, { type: "image/png" });

  if (
    typeof navigator !== "undefined" &&
    "share" in navigator &&
    "canShare" in navigator &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title: "Trước & Sau - Nhà Mình",
        text: "Hành trình xây nhà của tôi!",
      });
      return "shared";
    } catch {
      // người dùng hủy chia sẻ hoặc trình duyệt từ chối — rơi xuống tải ảnh
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return "downloaded";
}
