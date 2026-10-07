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

  expect(screen.queryByText(/loading assets/i)).not.toBeInTheDocument();
  expect(document.querySelector('.site-entry-ball')).toHaveClass('is-spinning');
  expect(screen.queryByTestId('hero')).not.toBeInTheDocument();
  expect(imageDecodes.length).toBeGreaterThan(1);

  await act(async () => imageDecodes.slice(0, -1).forEach(resolve => resolve()));
  expect(document.querySelector('.site-entry-ball')).toHaveClass('is-spinning');
  expect(screen.queryByRole('button', { name: /enter/i })).not.toBeInTheDocument();

  await act(async () => imageDecodes.at(-1)?.());
  const enter = await screen.findByRole('button', { name: /enter/i });
  expect(document.querySelector('.site-entry-ball-motion')).toHaveClass('is-raised');
  expect(document.querySelector('.site-entry-ball')).toHaveClass('is-parked');
  expect(enter).toHaveClass('is-pixelating');
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

  expect(await screen.findByRole('alert')).toHaveTextContent('loading failed');
  expect(document.querySelector('.site-entry-ball-motion')).toHaveClass('is-raised');
  expect(document.querySelector('.site-entry-ball')).toHaveClass('is-grayscale');
  expect(screen.queryByTestId('hero')).not.toBeInTheDocument();

  vi.stubGlobal('Image', class {
    set src(_value: string) {}
    decode() { return Promise.resolve(); }
  });
  const retry = screen.getByRole('button', { name: /retry/i });
  expect(retry).toHaveClass('is-pixelating');
  fireEvent.click(retry);

  expect(document.querySelector('.site-entry-ball')).toHaveClass('is-spinning');
  expect(await screen.findByRole('button', { name: /enter/i })).toBeVisible();
});
