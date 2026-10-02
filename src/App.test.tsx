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
  window.history.replaceState({}, '', '/');
});

it('waits for every hero image and explicit entry before mounting the scene', async () => {
  vi.stubGlobal('Image', class {
    set src(_value: string) {}
    decode() { return new Promise<void>(resolve => imageDecodes.push(resolve)); }
  });

  render(<App />);

  expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  expect(screen.queryByTestId('hero')).not.toBeInTheDocument();
  expect(imageDecodes.length).toBeGreaterThan(1);

  await act(async () => imageDecodes.slice(0, -1).forEach(resolve => resolve()));
  expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  expect(screen.queryByRole('button', { name: /enter/i })).not.toBeInTheDocument();

  await act(async () => imageDecodes.at(-1)?.());
  const enter = await screen.findByRole('button', { name: /enter/i });
  expect(screen.queryByTestId('hero')).not.toBeInTheDocument();

  fireEvent.click(enter);
  expect(screen.getByTestId('hero')).toBeVisible();
});

it('offers a retry when a required asset fails to decode', async () => {
  vi.stubGlobal('Image', class {
    set src(_value: string) {}
    decode() { return Promise.reject(new Error('asset unavailable')); }
  });

  render(<App />);

  expect(await screen.findByRole('alert')).toHaveTextContent(/couldn’t load/i);
  expect(screen.queryByTestId('hero')).not.toBeInTheDocument();

  vi.stubGlobal('Image', class {
    set src(_value: string) {}
    decode() { return Promise.resolve(); }
  });
  fireEvent.click(screen.getByRole('button', { name: /retry/i }));

  expect(await screen.findByRole('button', { name: /enter/i })).toBeVisible();
});
