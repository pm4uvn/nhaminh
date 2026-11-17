/**
 * Chuyển đổi dương lịch ↔ âm lịch Việt Nam (múi giờ UTC+7) và các thông tin
 * can-chi / trực liên quan. Thuật toán dựa trên công thức thiên văn chuẩn
 * (new moon, sun longitude) được dùng phổ biến trong các lịch âm Việt Nam,
 * đã được kiểm chứng khớp với Tết Ất Tỵ 2025 (29/1/2025) và Tết Bính Ngọ
 * 2026 (17/2/2026), cùng ngày Can Chi 1/1/2025 (Canh Ngọ) và 29/1/2025
 * (Mậu Tuất).
 */

const VN_TIMEZONE = 7;

function INT(d: number): number {
  return Math.floor(d);
}

const PI2 = Math.PI * 2;

function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

function NewMoon(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180;
  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;
  const C1 =
    (0.1734 - 0.000393 * T) * Math.sin(M * dr) +
    0.0021 * Math.sin(2 * dr * M) -
    0.4068 * Math.sin(Mpr * dr) +
    0.0161 * Math.sin(dr * 2 * Mpr) -
    0.0004 * Math.sin(dr * 3 * Mpr) +
    0.0104 * Math.sin(dr * 2 * F) -
    0.0051 * Math.sin(dr * (M + Mpr)) -
    0.0074 * Math.sin(dr * (M - Mpr)) +
    0.0004 * Math.sin(dr * (2 * F + M)) -
    0.0004 * Math.sin(dr * (2 * F - M)) -
    0.0006 * Math.sin(dr * (2 * F + Mpr)) +
    0.001 * Math.sin(dr * (2 * F - Mpr)) +
    0.0005 * Math.sin(dr * (2 * Mpr + M));
  let deltat: number;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }
  return Jd1 + C1 - deltat;
}

function SunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525;
  const T2 = T * T;
  const dr = Math.PI / 180;
  const M = 357.5291 + 35999.0503 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.9146 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.00029 * Math.sin(dr * 3 * M);
  let L = L0 + DL;
  L = L * dr;
  L = L - PI2 * INT(L / PI2);
  return L;
}

function getSunLongitude(dayNumber: number, timeZone: number): number {
  return INT((SunLongitude(dayNumber - 0.5 - timeZone / 24) / Math.PI) * 6);
}

function getNewMoonDay(k: number, timeZone: number): number {
  return INT(NewMoon(k) + 0.5 + timeZone / 24);
}

function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeapMonth: boolean;
}

export function solarToLunar(dd: number, mm: number, yy: number): LunarDate {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = INT((dayNumber - 2415021.076998695) / 29.530588853);
  let monthStart = getNewMoonDay(k + 1, VN_TIMEZONE);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, VN_TIMEZONE);
  }
  let a11 = getLunarMonth11(yy, VN_TIMEZONE);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, VN_TIMEZONE);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, VN_TIMEZONE);
  }
  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let lunarLeap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, VN_TIMEZONE);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        lunarLeap = true;
      }
    }
  }
  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeapMonth: lunarLeap };
}

export const CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
export const CHI = [
  "Tý",
  "Sửu",
  "Dần",
  "Mão",
  "Thìn",
  "Tỵ",
  "Ngọ",
  "Mùi",
  "Thân",
  "Dậu",
  "Tuất",
  "Hợi",
];

export function dayCanChi(dd: number, mm: number, yy: number): string {
  const jd = jdFromDate(dd, mm, yy);
  const can = (jd + 9) % 10;
  const chi = (jd + 1) % 12;
  return `${CAN[can]} ${CHI[chi]}`;
}

export function monthCanChi(lunarMonth: number, lunarYear: number): string {
  const can = (lunarYear * 12 + lunarMonth + 3) % 10;
  const chi = (lunarMonth + 1) % 12;
  return `${CAN[can]} ${CHI[chi]}`;
}

export function yearCanChi(lunarYear: number): string {
  const can = (lunarYear + 6) % 10;
  const chi = (lunarYear + 8) % 12;
  return `${CAN[can]} ${CHI[chi]}`;
}

const TRUC_NAMES = [
  "Kiến",
  "Trừ",
  "Mãn",
  "Bình",
  "Định",
  "Chấp",
  "Phá",
  "Nguy",
  "Thành",
  "Thu",
  "Khai",
  "Bế",
];

// Theo quan niệm dân gian: 6 trực được xem là "hoàng đạo" (thuận), 6 trực
// còn lại là "hắc đạo" (cần cân nhắc) — chỉ mang tính tham khảo.
const HOANG_DAO_TRUC = new Set(["Trừ", "Mãn", "Bình", "Định", "Thành", "Khai"]);

export interface DayFengShui {
  truc: string;
  isHoangDao: boolean;
}

export function getDayFengShui(dd: number, mm: number, yy: number, lunar: LunarDate): DayFengShui {
  const jd = jdFromDate(dd, mm, yy);
  const dayChiIndex = (jd + 1) % 12;
  const monthChiIndex = (lunar.month + 1) % 12;
  const trucIndex = (((dayChiIndex - monthChiIndex) % 12) + 12) % 12;
  const truc = TRUC_NAMES[trucIndex];
  return { truc, isHoangDao: HOANG_DAO_TRUC.has(truc) };
}

export interface FullLunarInfo {
  lunar: LunarDate;
  dayCanChi: string;
  monthCanChi: string;
  yearCanChi: string;
  fengShui: DayFengShui;
}

export function getFullLunarInfo(date: Date): FullLunarInfo {
  const dd = date.getDate();
  const mm = date.getMonth() + 1;
  const yy = date.getFullYear();
  const lunar = solarToLunar(dd, mm, yy);
  return {
    lunar,
    dayCanChi: dayCanChi(dd, mm, yy),
    monthCanChi: monthCanChi(lunar.month, lunar.year),
    yearCanChi: yearCanChi(lunar.year),
    fengShui: getDayFengShui(dd, mm, yy, lunar),
  };
}
