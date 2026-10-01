import { describe, expect, it } from 'vitest';
import { activityAt } from './activity';

describe('desk character activity', () => {
  it('speaks greeting before typing and rests after each two-second burst', () => {
    expect(activityAt(0)).toBe('talking');
    expect(activityAt(1999)).toBe('talking');
    expect(activityAt(2000)).toBe('typing');
    expect(activityAt(3999)).toBe('typing');
    expect(activityAt(4000)).toBe('seated-idle');
    expect(activityAt(6999)).toBe('seated-idle');
    expect(activityAt(7000)).toBe('typing');
  });
});
