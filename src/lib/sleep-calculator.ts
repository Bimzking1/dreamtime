export type CalculatorMode = 'wake' | 'sleep';
export interface CalculatorSettings { mode: CalculatorMode | null; time: string; fallAsleepMinutes: number }
export interface CycleResult { cycles: number; durationMinutes: number; time: string; dayOffset: number; recommended: boolean }

export const CYCLE_MINUTES = 90;
export const CYCLE_COUNTS = [6, 5, 4, 3] as const;
export const MIN_BUFFER = 5;
export const MAX_BUFFER = 40;
export const BUFFER_STEP = 5;
export const DEFAULT_BUFFER = 15;
const DAY = 1440;

export function parseTime(value: string): number | null {
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}
export function clampBuffer(v: number): number {
  if (!Number.isFinite(v)) return DEFAULT_BUFFER;
  const s = Math.round(v / BUFFER_STEP) * BUFFER_STEP;
  return Math.min(MAX_BUFFER, Math.max(MIN_BUFFER, s));
}
export function formatTime24(minutes: number): string {
  const m = ((minutes % DAY) + DAY) % DAY;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
export function formatTime12(hhmm: string): string {
  const mins = parseTime(hhmm);
  if (mins === null) return hhmm;
  const h = Math.floor(mins / 60);
  return `${h % 12 || 12}:${String(mins % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}
export function dayLabel(offset: number): string {
  if (offset === 0) return 'Same day';
  if (offset === -1) return 'Previous day';
  if (offset === 1) return 'Next day';
  return offset < 0 ? `${-offset} days before` : `${offset} days after`;
}
/** wake mode: `time` is the target wake-up time; sleep mode: `time` is the planned bedtime. Offsets are relative to `time`'s day. */
export function calculateSleepTimes(mode: CalculatorMode, time: string, fallAsleepMinutes: number): CycleResult[] {
  const base = parseTime(time);
  if (base === null) return [];
  const buffer = clampBuffer(fallAsleepMinutes);
  return CYCLE_COUNTS.map((cycles) => {
    const span = cycles * CYCLE_MINUTES + buffer;
    const total = mode === 'wake' ? base - span : base + span;
    return { cycles, durationMinutes: cycles * CYCLE_MINUTES, time: formatTime24(total), dayOffset: Math.floor(total / DAY), recommended: cycles >= 5 };
  });
}
