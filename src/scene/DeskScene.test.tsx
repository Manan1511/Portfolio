import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { DeskScene } from './DeskScene';

afterEach(() => vi.useRealTimers());

it('animates speech while greeting appears, then starts typing and rests', () => {
  vi.useFakeTimers();
  render(<DeskScene scale={3} />);
  expect(screen.getByRole('img', { name: /Manan/ })).toHaveAttribute('data-clip', 'talking');
  act(() => vi.advanceTimersByTime(240));
  expect(screen.getByRole('img', { name: /Manan/ })).not.toHaveAttribute('data-frame', '0');
  act(() => vi.advanceTimersByTime(1760));
  expect(screen.getByRole('img', { name: /Manan/ })).toHaveAttribute('data-clip', 'typing');
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByRole('img', { name: /Manan/ })).toHaveAttribute('data-clip', 'seated-idle');
  fireEvent.click(screen.getByRole('button', { name: /Replay greeting/ }));
  expect(screen.getByRole('img', { name: /Manan/ })).toHaveAttribute('data-clip', 'talking');
});

it('shows complete greeting with static seated sprite for reduced motion', () => {
  vi.spyOn(window, 'matchMedia').mockImplementation(query => ({
    matches: true, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => true,
  }));
  render(<DeskScene scale={3} />);
  expect(screen.getByRole('img', { name: /Manan/ })).toHaveAttribute('data-clip', 'seated-idle');
  expect(screen.getByText('hey, I’m Manan')).toBeVisible();
});
