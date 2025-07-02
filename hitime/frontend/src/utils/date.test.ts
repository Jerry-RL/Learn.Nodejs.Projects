import { formatDate, isSameDay } from './date';
import { describe, it, expect } from 'vitest';

describe('date utils', () => {
  it('formatDate returns correct string', () => {
    const date = new Date('2024-01-01T12:00:00Z');
    expect(formatDate(date)).toMatch(/2024/);
  });

  it('isSameDay returns true for same day', () => {
    expect(isSameDay('2024-01-01', '2024-01-01')).toBe(true);
  });

  it('isSameDay returns false for different days', () => {
    expect(isSameDay('2024-01-01', '2024-01-02')).toBe(false);
  });
}); 