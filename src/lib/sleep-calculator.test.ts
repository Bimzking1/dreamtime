import { describe, expect, it } from 'vitest';
import { calculateSleepTimes, clampBuffer, parseTime } from './sleep-calculator';
const times = (r: ReturnType<typeof calculateSleepTimes>) => r.map((x) => x.time);
describe('sleep calculator', () => {
  it('wake mode matches spec example', () => {
    const r = calculateSleepTimes('wake', '06:00', 15);
    expect(times(r)).toEqual(['20:45', '22:15', '23:45', '01:15']);
    expect(r.map((x) => x.dayOffset)).toEqual([-1, -1, -1, 0]);
  });
  it('sleep mode matches spec example', () => {
    const r = calculateSleepTimes('sleep', '22:00', 15);
    expect(times(r)).toEqual(['07:15', '05:45', '04:15', '02:45']);
    expect(r.map((x) => x.dayOffset)).toEqual([1, 1, 1, 1]);
  });
  it('handles same day and midnight crossings', () => {
    expect(calculateSleepTimes('sleep', '00:30', 15)[3]).toMatchObject({ time: '05:15', dayOffset: 0 });
    expect(calculateSleepTimes('wake', '23:00', 5)[3]).toMatchObject({ time: '18:25', dayOffset: 0 });
  });
  it('respects buffer and flags recommendations', () => {
    expect(calculateSleepTimes('sleep', '22:00', 30)[0].time).toBe('07:30');
    expect(calculateSleepTimes('sleep', '22:00', 15).map((x) => x.recommended)).toEqual([true, true, false, false]);
  });
  it('validates input', () => {
    expect(parseTime('')).toBeNull(); expect(parseTime('25:00')).toBeNull(); expect(parseTime('07:05')).toBe(425);
    expect(calculateSleepTimes('wake', '', 15)).toEqual([]);
    expect(clampBuffer(2)).toBe(5); expect(clampBuffer(99)).toBe(40);
  });
});
