import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OrbitCrown } from './OrbitCrown';

const cards = [{ id: 'coffee', label: 'Caffeine', text: 'one more cup' }, { id: 'git', label: 'Git', text: 'push and pray' }];
afterEach(() => vi.useRealTimers());
const angle = () => Number(screen.getByRole('group', { name: 'Orbiting thoughts' }).getAttribute('data-angle'));

describe('OrbitCrown interaction', () => {
  it('orbits, pauses on hover, and resumes without resetting angle', () => {
    vi.useFakeTimers();
    render(<OrbitCrown cards={cards} headAnchor={{ x: 180, y: 200 }} width={360} />);
    act(() => vi.advanceTimersByTime(200));
    const before = angle();
    expect(before).toBeGreaterThan(0);
    fireEvent.pointerEnter(screen.getByRole('group', { name: 'Orbiting thoughts' }));
    act(() => vi.advanceTimersByTime(200));
    expect(angle()).toBe(before);
    fireEvent.pointerLeave(screen.getByRole('group', { name: 'Orbiting thoughts' }));
    act(() => vi.advanceTimersByTime(200));
    expect(angle()).toBeGreaterThan(before);
  });
  it('offers manual pause and keyboard rotation while focused', () => {
    render(<OrbitCrown cards={cards} headAnchor={{ x: 180, y: 200 }} width={360} />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause orbit' }));
    expect(screen.getByRole('button', { name: 'Resume orbit' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.keyDown(screen.getByRole('group', { name: 'Orbiting thoughts' }), { key: 'ArrowRight' });
    expect(angle()).toBeCloseTo(Math.PI / 12);
  });
  it('distinguishes touch tap from horizontal drag and preserves final angle', () => {
    render(<OrbitCrown cards={cards} headAnchor={{ x: 180, y: 200 }} width={360} />);
    const ring = screen.getByRole('group', { name: 'Orbiting thoughts' });
    fireEvent.pointerDown(ring, { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 100 });
    fireEvent.pointerUp(ring, { pointerId: 1, pointerType: 'touch', clientX: 105, clientY: 100 });
    expect(screen.getByRole('button', { name: 'Resume orbit' })).toBeVisible();
    fireEvent.pointerDown(ring, { pointerId: 2, pointerType: 'touch', clientX: 100, clientY: 100 });
    fireEvent.pointerMove(ring, { pointerId: 2, pointerType: 'touch', clientX: 140, clientY: 100 });
    const moved = angle();
    expect(moved).toBeGreaterThan(0);
    fireEvent.pointerUp(ring, { pointerId: 2, pointerType: 'touch', clientX: 140, clientY: 100 });
    expect(angle()).toBe(moved);
    expect(screen.getByRole('button', { name: 'Resume orbit' })).toBeVisible();
  });
  it('does not turn vertical swipe into pause or rotation', () => {
    render(<OrbitCrown cards={cards} headAnchor={{ x: 180, y: 200 }} width={360} />);
    const ring = screen.getByRole('group', { name: 'Orbiting thoughts' });
    fireEvent.pointerDown(ring, { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 100 });
    fireEvent.pointerMove(ring, { pointerId: 1, pointerType: 'touch', clientX: 103, clientY: 150 });
    fireEvent.pointerUp(ring, { pointerId: 1, pointerType: 'touch', clientX: 103, clientY: 150 });
    expect(angle()).toBe(0);
    expect(screen.getByRole('button', { name: 'Pause orbit' })).toBeVisible();
  });
  it('disables auto motion for reduced motion but permits manual rotation', () => {
    vi.useFakeTimers();
    vi.spyOn(window, 'matchMedia').mockImplementation(query => ({ matches: true, media: query, onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => true }));
    render(<OrbitCrown cards={cards} headAnchor={{ x: 180, y: 200 }} width={360} />);
    act(() => vi.advanceTimersByTime(500));
    expect(angle()).toBe(0);
    fireEvent.keyDown(screen.getByRole('group', { name: 'Orbiting thoughts' }), { key: 'ArrowRight' });
    expect(angle()).toBeGreaterThan(0);
  });
  it('holds current angle from pointer down so delayed drag cannot jump backward', () => {
    vi.useFakeTimers();
    render(<OrbitCrown cards={cards} headAnchor={{ x: 180, y: 200 }} width={360} />);
    const ring = screen.getByRole('group', { name: 'Orbiting thoughts' });
    fireEvent.pointerDown(ring, { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 100 });
    const start = angle();
    act(() => vi.advanceTimersByTime(2000));
    expect(angle()).toBe(start);
  });
  it('releases an uncaptured press outside the crown and permits another drag', () => {
    render(<OrbitCrown cards={cards} headAnchor={{ x: 180, y: 200 }} width={360} />);
    const ring = screen.getByRole('group', { name: 'Orbiting thoughts' });
    fireEvent.pointerDown(screen.getAllByRole('article')[0], { pointerId: 1, pointerType: 'mouse', clientX: 100, clientY: 100 });
    expect(ring).toHaveAttribute('data-paused', 'true');
    fireEvent.pointerUp(window, { pointerId: 1, pointerType: 'mouse', clientX: 102, clientY: 100 });
    expect(ring).toHaveAttribute('data-paused', 'false');
    fireEvent.pointerDown(ring, { pointerId: 2, pointerType: 'mouse', clientX: 100, clientY: 100 });
    fireEvent.pointerMove(ring, { pointerId: 2, pointerType: 'mouse', clientX: 140, clientY: 100 });
    expect(angle()).toBeGreaterThan(0);
  });
  it('holds orbit while keyboard focus moves between cards, resumes on exit', () => {
    vi.useFakeTimers();
    render(<OrbitCrown cards={cards} headAnchor={{ x: 180, y: 200 }} width={360} />);
    const articles = screen.getAllByRole('article');
    fireEvent.focus(articles[0]);
    const start = angle();
    act(() => vi.advanceTimersByTime(200));
    expect(angle()).toBe(start);
    fireEvent.blur(articles[0], { relatedTarget: articles[1] });
    fireEvent.focus(articles[1]);
    act(() => vi.advanceTimersByTime(200));
    expect(angle()).toBe(start);
    fireEvent.blur(articles[1], { relatedTarget: null });
    act(() => vi.advanceTimersByTime(200));
    expect(angle()).toBeGreaterThan(start);
  });
});
