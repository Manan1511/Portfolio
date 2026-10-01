import { useCallback, useEffect, useId, useRef, useState, type PointerEvent } from 'react';
import type { Point } from '../character/animation';
import { useReducedMotion } from '../shared/useReducedMotion';
import { draggedAngle, gestureKind, orbitPoint } from './orbit';
export interface OrbitCard { id: string; label: string; text: string }
export interface OrbitCrownProps { cards: OrbitCard[]; headAnchor: Point; width: number; orbitDuration?: number }
type Sample = { x: number; time: number };
type Gesture = {
  id: number; x: number; y: number; angle: number; direction: number;
  kind: 'tap' | 'drag' | 'scroll'; type: string; samples: Sample[];
};
const coastDecay = 650;
const sampleWindow = 100;
const maxSpeed = .006;

function sample(gesture: Gesture, x: number) {
  const time = performance.now();
  gesture.samples.push({ x, time });
  while (gesture.samples.length > 1 && gesture.samples[0].time < time - sampleWindow) gesture.samples.shift();
}

export function OrbitCrown({ cards, headAnchor, width, orbitDuration = 24000 }: OrbitCrownProps) {
  const reduced = useReducedMotion();
  const helpId = useId();
  const [angle, setAngle] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [holding, setHolding] = useState(false);
  const [coasting, setCoasting] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const pointer = useRef<Gesture | null>(null);
  const velocity = useRef(0);
  const orbitDirection = useRef(1);
  const reading = hovered || focused;
  // A deliberate flick can finish under the pointer. Ordinary auto rotation
  // still holds on hover/focus; explicit pause and reduced motion stop both.
  const paused = reduced || manualPause || dragging || holding || (reading && !coasting);
  const cardWidth = width < 500 ? 108 : 148;
  const radius = Math.max(0, Math.min(232, (width - cardWidth) / 2 - 5));
  const verticalRadius = width < 500 ? 44 : 46;
  const centerY = headAnchor.y - 100;
  const duration = orbitDuration > 0 ? orbitDuration : 24000;

  const stopCoast = useCallback(() => {
    velocity.current = 0;
    setCoasting(false);
  }, []);

  const finish = useCallback((event: Pick<globalThis.PointerEvent, 'pointerId' | 'clientX' | 'clientY'>, cancelled = false) => {
    const current = pointer.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const kind = current.kind === 'tap' ? gestureKind(dx, event.clientY - current.y) : current.kind;
    if (!cancelled && kind === 'drag') {
      // Up coordinates matter even when the browser skips the last move.
      setAngle(draggedAngle(current.angle, dx, radius, current.direction));
      sample(current, event.clientX);
      const first = current.samples[0];
      const last = current.samples[current.samples.length - 1];
      const elapsed = last.time - first.time;
      const speed = elapsed > 0 ? current.direction * (last.x - first.x) / Math.max(radius, 1) / elapsed : 0;
      if (speed !== 0) orbitDirection.current = Math.sign(speed);
      if (!reduced && !manualPause && Math.abs(speed) > Math.PI * 2 / duration) {
        velocity.current = Math.max(-maxSpeed, Math.min(maxSpeed, speed));
        setCoasting(true);
      }
    } else if (!cancelled && kind === 'tap' && current.type === 'touch') {
      setManualPause(value => !value);
    }
    pointer.current = null;
    setDragging(false);
    setHolding(false);
    if (root.current?.hasPointerCapture?.(event.pointerId)) root.current.releasePointerCapture(event.pointerId);
  }, [duration, manualPause, radius, reduced]);

  useEffect(() => {
    const clear = () => { pointer.current = null; setHolding(false); setDragging(false); stopCoast(); };
    const releaseOutside = (event: globalThis.PointerEvent) => {
      finish(event, event.type === 'pointercancel');
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
  }, [finish, stopCoast]);

  useEffect(() => {
    if (reduced || manualPause) stopCoast();
  }, [manualPause, reduced, stopCoast]);

  useEffect(() => {
    if (paused) return;
    let last = performance.now();
    let handle: number;
    const advance = (now: number) => {
      const delta = Math.min(64, Math.max(0, now - last));
      last = now;
      if (!document.hidden) {
        const base = reading ? 0 : orbitDirection.current * Math.PI * 2 / duration;
        let travel = base * delta;
        if (coasting) {
          // Integrate exponential friction, so different refresh rates give
          // the same travel and never jump when returning to idle speed.
          const decay = Math.exp(-delta / coastDecay);
          const extra = velocity.current - base;
          travel += extra * coastDecay * (1 - decay);
          velocity.current = base + extra * decay;
          if (Math.abs(velocity.current - base) < .000015) stopCoast();
        }
        setAngle(value => value + travel);
      }
      handle = requestAnimationFrame(advance);
    };
    handle = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(handle);
  }, [paused, duration, reading, coasting, stopCoast]);

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
    if (current.kind === 'drag') {
      sample(current, event.clientX);
      setAngle(draggedAngle(current.angle, dx, radius, current.direction));
    }
  };

  const rotate = (direction: number) => {
    stopCoast();
    setAngle(value => value + direction * Math.PI / 12);
  };

  return <div ref={root} className={`orbit-crown ${dragging ? 'is-dragging' : ''}`} role="group" aria-label="Orbiting thoughts"
    aria-describedby={helpId} tabIndex={0} data-angle={angle} data-paused={paused}
    onPointerEnter={event => { if (event.pointerType !== 'touch') { setHovered(true); if (!pointer.current) stopCoast(); } }}
    onPointerLeave={() => setHovered(false)}
    onFocusCapture={() => { setFocused(true); if (!pointer.current) stopCoast(); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
    onPointerDown={event => {
      if (pointer.current || event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
      // Avoid compatibility mouse focus cancelling a touch flick after up.
      // Page panning remains governed by touch-action: pan-y.
      event.preventDefault();
      stopCoast();
      const cardIndex = (event.target as HTMLElement).closest<HTMLElement>('[data-orbit-index]')?.dataset.orbitIndex;
      const depth = cardIndex === undefined ? 1 : orbitPoint(Number(cardIndex), cards.length, angle, radius, verticalRadius).depth;
      pointer.current = {
        id: event.pointerId, x: event.clientX, y: event.clientY, angle, direction: depth < 0 ? -1 : 1,
        kind: 'tap', type: event.pointerType, samples: [{ x: event.clientX, time: performance.now() }],
      };
      setHolding(true);
    }}
    onPointerMove={move} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)}
    onLostPointerCapture={event => {
      // Touch implicitly captures the pressed article before the root takes
      // over a drag. That child's capture-loss bubbles here and is harmless.
      if (event.target === event.currentTarget && pointer.current?.id === event.pointerId) {
        pointer.current = null; setDragging(false); setHolding(false); stopCoast();
      }
    }}
    onKeyDown={event => {
      if ((event.target as HTMLElement).closest('button')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); rotate(event.key === 'ArrowRight' ? 1 : -1);
      } else if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault(); setManualPause(value => !value);
      }
    }}>
    <div className="orbit-zone" aria-hidden="true" style={{ left: headAnchor.x - radius - cardWidth / 2, top: centerY - 104, width: radius * 2 + cardWidth, height: 208 }} />
    {cards.map((card, index) => {
      const point = orbitPoint(index, cards.length, angle, radius, verticalRadius);
      return <article className="thought-card" key={card.id} tabIndex={0} data-orbit-index={index}
        style={{ left: headAnchor.x, top: centerY, width: cardWidth, zIndex: point.zIndex,
          transform: `translate(-50%, -50%) translate(${point.x}px, ${point.y}px) scale(${point.scale})` }}>
        <span className="thought-glass" aria-hidden="true" />
        <span className={`thought-icon thought-icon-${index % 5}`} aria-hidden="true"><CardIcon index={index} /></span>
        <div className="thought-copy"><span className="thought-label">{card.label}</span><span className="thought-text">{card.text}</span></div>
      </article>;
    })}
    <div className="orbit-controls">
      <span className="orbit-hint" aria-hidden="true">drag or flick my thoughts</span>
      <div className="orbit-buttons">
        <button aria-label="Rotate thoughts left" onClick={() => rotate(-1)}>←</button>
        <button className="orbit-toggle" aria-label={manualPause ? 'Resume orbit' : 'Pause orbit'} aria-pressed={manualPause} onClick={() => setManualPause(value => !value)}>
          <span aria-hidden="true">{manualPause ? '▷' : 'Ⅱ'}</span>
        </button>
        <button aria-label="Rotate thoughts right" onClick={() => rotate(1)}>→</button>
      </div>
      <span className="sr-only" id={helpId}>Drag horizontally to rotate; flick to give thoughts momentum. Tap on mobile to pause or resume. Arrow keys rotate; space pauses. Hover or focus holds automatic rotation still. {reduced && 'Automatic animation and momentum disabled by your reduced-motion preference.'}</span>
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
