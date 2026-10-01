import { useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import type { Point } from '../character/animation';
import { useReducedMotion } from '../shared/useReducedMotion';
import { draggedAngle, gestureKind, orbitPoint } from './orbit';
export interface OrbitCard { id: string; label: string; text: string }
export interface OrbitCrownProps { cards: OrbitCard[]; headAnchor: Point; width: number; orbitDuration?: number }
export function OrbitCrown({ cards, headAnchor, width, orbitDuration = 24000 }: OrbitCrownProps) {
  const reduced = useReducedMotion();
  const helpId = useId();
  const [angle, setAngle] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [holding, setHolding] = useState(false);
  const pointer = useRef<{ id: number; x: number; y: number; angle: number; kind: 'tap' | 'drag' | 'scroll'; type: string } | null>(null);
  const paused = reduced || manualPause || hovered || focused || dragging || holding;
  const cardWidth = width < 500 ? 108 : 148;
  const radius = Math.max(0, Math.min(232, (width - cardWidth) / 2 - 5));
  const verticalRadius = width < 500 ? 44 : 46;
  const centerY = headAnchor.y - 100;
  const duration = orbitDuration > 0 ? orbitDuration : 24000;

  useEffect(() => {
    const clear = () => { pointer.current = null; setHolding(false); setDragging(false); };
    const releaseOutside = (event: globalThis.PointerEvent) => {
      if (pointer.current?.id === event.pointerId) clear();
    };
    // Before the drag threshold there is no explicit capture. A release outside
    // the hit area must still end the press without blocking vertical touch pan.
    window.addEventListener('pointerup', releaseOutside);
    window.addEventListener('pointercancel', releaseOutside);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('pointerup', releaseOutside);
      window.removeEventListener('pointercancel', releaseOutside);
      window.removeEventListener('blur', clear);
    };
  }, []);

  useEffect(() => {
    if (paused) return;
    let last = performance.now();
    let handle: number;
    const advance = (now: number) => {
      const delta = Math.min(64, Math.max(0, now - last));
      last = now;
      if (!document.hidden) setAngle(value => (value + delta * Math.PI * 2 / duration) % (Math.PI * 2));
      handle = requestAnimationFrame(advance);
    };
    handle = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(handle);
  }, [paused, duration]);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const current = pointer.current;
    if (!current || current.id !== event.pointerId || current.kind === 'scroll') return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (current.kind === 'tap') {
      current.kind = gestureKind(dx, dy);
      if (current.kind === 'scroll') setHolding(false);
      if (current.kind === 'drag') {
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }
    }
    if (current.kind === 'drag') setAngle(draggedAngle(current.angle, dx, radius));
  };

  const finish = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const current = pointer.current;
    if (!current || current.id !== event.pointerId) return;
    // Up coordinates also count: a fast swipe may deliver no pointermove.
    const kind = current.kind === 'tap' ? gestureKind(event.clientX - current.x, event.clientY - current.y) : current.kind;
    if (!cancelled && kind === 'tap' && current.type === 'touch') setManualPause(value => !value);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    pointer.current = null;
    setDragging(false);
    setHolding(false);
  };

  return <div className={`orbit-crown ${dragging ? 'is-dragging' : ''}`} role="group" aria-label="Orbiting thoughts"
    aria-describedby={helpId} tabIndex={0} data-angle={angle} data-paused={paused}
    onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true); }}
    onPointerLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
    onPointerDown={event => {
      if (pointer.current || event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
      pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, angle, kind: 'tap', type: event.pointerType };
      setHolding(true);
    }}
    onPointerMove={move} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)}
    onLostPointerCapture={() => { pointer.current = null; setDragging(false); setHolding(false); }}
    onKeyDown={event => {
      if ((event.target as HTMLElement).closest('button')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); setAngle(value => value + (event.key === 'ArrowRight' ? 1 : -1) * Math.PI / 12);
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault(); setManualPause(value => !value);
      }
    }}>
    <div className="orbit-zone" aria-hidden="true" style={{ left: headAnchor.x - radius - cardWidth / 2, top: centerY - 104, width: radius * 2 + cardWidth, height: 208 }} />
    {cards.map((card, index) => {
      const point = orbitPoint(index, cards.length, angle, radius, verticalRadius);
      return <article className="thought-card" key={card.id} tabIndex={0}
        style={{ left: headAnchor.x, top: centerY, width: cardWidth, zIndex: point.zIndex,
          transform: `translate(-50%, -50%) translate(${point.x}px, ${point.y}px) scale(${point.scale})` }}>
        <span className={`thought-icon thought-icon-${index % 5}`} aria-hidden="true"><CardIcon index={index} /></span>
        <div className="thought-copy"><span className="thought-label">{card.label}</span><span className="thought-text">{card.text}</span></div>
      </article>;
    })}
    <div className="orbit-controls">
      <span className="orbit-hint" aria-hidden="true">drag my thoughts around</span>
      <div className="orbit-buttons">
        <button aria-label="Rotate thoughts left" onClick={() => setAngle(value => value - Math.PI / 12)}>←</button>
        <button className="orbit-toggle" aria-label={manualPause ? 'Resume orbit' : 'Pause orbit'} aria-pressed={manualPause} onClick={() => setManualPause(value => !value)}>
          <span aria-hidden="true">{manualPause ? '▷' : 'Ⅱ'}</span>
        </button>
        <button aria-label="Rotate thoughts right" onClick={() => setAngle(value => value + Math.PI / 12)}>→</button>
      </div>
      <span className="sr-only" id={helpId}>Drag horizontally to rotate. Tap on mobile to pause or resume. Arrow keys rotate; space pauses. Hover or focus holds thoughts still. {reduced && 'Automatic animation disabled by your reduced-motion preference.'}</span>
    </div>
  </div>;
}

function CardIcon({ index }: { index: number }) {
  const paths = [
    'M8 2v3m0 6v3M2 8h3m6 0h3M5 5h6v6H5z',
    'M3 5h8v7H3zM11 6h3v4h-3M5 2v1m3-1v1M2 14h11',
    'M5 3v9m0-6h6V3M3 2h4v3H3zM9 1h4v3H9zM3 11h4v3H3z',
    'M11 2a6 6 0 1 0 3 9A6 6 0 0 1 11 2z',
    'M3 3h10v10H3zM6 6h4m-4 3h2M10 9v1',
  ];
  return <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square"><path d={paths[index % paths.length]} /></svg>;
}
