import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { App } from './App';

const imageDecodes: Array<() => void> = [];

vi.mock('./hero/Hero', () => ({
  Hero: () => <div data-testid="hero" />,
}));

afterEach(() => {
  imageDecodes.length = 0;
  vi.unstubAllGlobals();
  vi.useRealTimers();
  window.history.replaceState({}, '', '/');
});

it('waits for every hero image and explicit entry before mounting the scene', async () => {
  vi.stubGlobal('Image', class {
    set src(_value: string) {}
    decode() { return new Promise<void>(resolve => imageDecodes.push(resolve)); }
  });

  render(<App />);

  expect(screen.queryByText(/loading assets/i)).not.toBeInTheDocument();
  expect(document.querySelector('.site-entry-ball')).toHaveClass('is-spinning');
  expect(screen.queryByTestId('hero')).not.toBeInTheDocument();
  expect(imageDecodes.length).toBeGreaterThan(1);

  await act(async () => imageDecodes.slice(0, -1).forEach(resolve => resolve()));
  expect(document.querySelector('.site-entry-ball')).toHaveClass('is-spinning');
  expect(screen.queryByRole('button', { name: /enter/i })).not.toBeInTheDocument();

  vi.useFakeTimers();
  await act(async () => imageDecodes.at(-1)?.());
  const enter = screen.getByRole('button', { name: /enter/i });
  expect(document.querySelector('.site-entry-ball-motion')).toHaveClass('is-raised');
  expect(document.querySelector('.site-entry-ball')).toHaveClass('is-upright');
  expect(enter).toHaveClass('is-pixelating', 'is-enter');
  expect(enter).not.toHaveClass('is-revealed');
  expect(enter).toBeDisabled();
  expect(enter.querySelector('.site-entry-button-surface')).toBeInTheDocument();
  const enterTiles = enter.querySelectorAll('.site-entry-pixel-mask > span');
  expect(enterTiles.length).toBeGreaterThan(100);
  fireEvent.mouseEnter(enter);
  expect(enter).not.toHaveClass('is-revealed');
  await act(async () => vi.advanceTimersByTime(1500));
  expect(enter).toHaveClass('is-revealed');
  expect(enter).toBeEnabled();
  expect(screen.queryByTestId('hero')).not.toBeInTheDocument();

  fireEvent.click(enter);
  expect(screen.getByTestId('hero')).toBeVisible();
});

it('offers a retry when a required asset fails to decode', async () => {
  vi.useFakeTimers();
  vi.stubGlobal('Image', class {
    set src(_value: string) {}
    decode() { return Promise.reject(new Error('asset unavailable')); }
  });

  render(<App />);

  await act(async () => { await Promise.resolve(); await Promise.resolve(); });
  expect(screen.getByRole('alert')).toHaveTextContent('loading failed');
  expect(document.querySelector('.site-entry-ball-motion')).toHaveClass('is-raised');
  expect(document.querySelector('.site-entry-ball')).toHaveClass('is-upright', 'is-grayscale');
  expect(screen.getByRole('alert').querySelectorAll('.site-entry-pixel-mask > span').length).toBeGreaterThan(100);
  expect(screen.queryByTestId('hero')).not.toBeInTheDocument();

  vi.stubGlobal('Image', class {
    set src(_value: string) {}
    decode() { return Promise.resolve(); }
  });
  const retry = screen.getByRole('button', { name: /retry/i });
  expect(retry).toHaveClass('is-pixelating');
  expect(retry).not.toHaveClass('is-revealed');
  expect(retry).toBeDisabled();
  expect(retry.querySelector('.site-entry-button-surface')).toBeInTheDocument();
  const retryTiles = retry.querySelectorAll('.site-entry-pixel-mask > span');
  expect(retryTiles.length).toBeGreaterThan(100);
  fireEvent.mouseEnter(retry);
  expect(retry).not.toHaveClass('is-revealed');
  await act(async () => vi.advanceTimersByTime(1600));
  expect(retry).toHaveClass('is-revealed');
  expect(retry).toBeEnabled();
  await act(async () => {
    fireEvent.click(retry);
    await Promise.resolve();
    await Promise.resolve();
  });

  expect(document.querySelector('.site-entry-ball')).toHaveClass('is-upright');
  expect(screen.getByRole('button', { name: /enter/i })).toBeVisible();
});
