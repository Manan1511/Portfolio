import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { CharacterSprite } from '../character/CharacterSprite';
import { manan } from '../character/manan';
import { useReducedMotion } from '../shared/useReducedMotion';
import { contactEntries } from './contactEntries';
import { playMenuCue } from './menuAudio';
import { pokedexCloseSequence, pokedexFramePosition, pokedexIndicatorLights, pokedexOpenSequence, pokedexScreenCutoutStyle, pokedexScreenUnderlay, pokedexSpriteSheet, type PokedexFrameIndex } from './pokedexFrames';

const frameDuration = 90;
const pressDuration = 120;
type Phase = 'opening' | 'open' | 'closing';

export function PokedexDialog({ onClose }: { onClose: () => void }) {
  const reduced = useReducedMotion();
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const timers = useRef(new Set<number>());
  const phase = useRef<Phase>('opening');
  const reducedAtOpen = useRef(reduced);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [frame, setFrame] = useState<PokedexFrameIndex>(reduced ? 3 : 0);
  const [phaseState, setPhaseState] = useState<Phase>('opening');
  const [entryIndex, setEntryIndex] = useState(0);
  const [selected, setSelected] = useState(false);
  const pressTimer = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach(timer => window.clearTimeout(timer));
    timers.current.clear();
    if (pressTimer.current !== null) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, delay);
    timers.current.add(timer);
    return timer;
  }, []);

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (!element.open) element.showModal();
    closeButton.current?.focus();
  }, []);

  useEffect(() => {
    if (reducedAtOpen.current) {
      phase.current = 'open';
      setPhaseState('open');
      setFrame(3);
      return clearTimers;
    }

    phase.current = 'opening';
    setPhaseState('opening');
    setFrame(0);
    let position = 1;
    const advance = () => {
      const next = pokedexOpenSequence[position];
      if (next === undefined) {
        phase.current = 'open';
        setPhaseState('open');
        return;
      }
      schedule(() => {
        setFrame(next);
        position += 1;
        advance();
      }, frameDuration);
    };
    advance();
    return clearTimers;
  }, [clearTimers, schedule]);

  useEffect(() => {
    if (!reduced || phase.current === 'closing') return;
    clearTimers();
    phase.current = 'open';
    setPhaseState('open');
    setFrame(3);
  }, [clearTimers, reduced]);

  const pressFrame = useCallback((pressed: PokedexFrameIndex) => {
    if (pressTimer.current !== null) window.clearTimeout(pressTimer.current);
    setFrame(pressed);
    pressTimer.current = window.setTimeout(() => {
      pressTimer.current = null;
      if (phase.current === 'open') setFrame(3);
    }, pressDuration);
  }, []);

  const changeEntry = useCallback((direction: -1 | 1, pressedFrame: PokedexFrameIndex) => {
    if (phase.current !== 'open') return;
    playMenuCue(direction === -1 ? 'navigate-left' : 'navigate-right');
    setEntryIndex(current => (current + direction + contactEntries.length) % contactEntries.length);
    setSelected(false);
    pressFrame(pressedFrame);
  }, [pressFrame]);

  const beginClose = useCallback(() => {
    if (phase.current === 'closing') return;
    playMenuCue('device-close');
    clearTimers();
    if (reduced) {
      phase.current = 'closing';
      setPhaseState('closing');
      setFrame(0);
      onCloseRef.current();
      return;
    }

    phase.current = 'closing';
    setPhaseState('closing');
    setFrame(7);
    const reverseFrames = pokedexCloseSequence.slice(1);
    let position = 0;
    const advance = () => {
      const next = reverseFrames[position];
      if (next === undefined) {
        schedule(() => onCloseRef.current(), frameDuration);
        return;
      }
      schedule(() => {
        setFrame(next);
        position += 1;
        advance();
      }, frameDuration);
    };
    advance();
  }, [clearTimers, reduced, schedule]);

  const selectEntry = () => {
    if (phase.current !== 'open') return;
    playMenuCue('select');
    setSelected(true);
    pressFrame(6);
    const entry = contactEntries[entryIndex]!;
    if (entry.openInNewTab) window.open(entry.href, '_blank', 'noopener,noreferrer');
    else window.location.href = entry.href;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      changeEntry(event.key === 'ArrowLeft' ? -1 : 1, 8);
    }
  };

  const current = contactEntries[entryIndex]!;
  const portraitStyle = pokedexScreenCutoutStyle(frame, 'portrait');
  const contactStyle = pokedexScreenCutoutStyle(frame, 'contact');
  const screensVisible = portraitStyle !== undefined && contactStyle !== undefined;
  const position = pokedexFramePosition(frame);
  const sheetStyle = {
    backgroundImage: `url("${pokedexSpriteSheet}")`,
    backgroundPosition: `${position.column * 50}% ${position.row * 50}%`,
  } as CSSProperties;
  const underlayStyle = { ...sheetStyle, backgroundImage: `url("${pokedexScreenUnderlay}")` };
  const indicatorLightStyle = { ...sheetStyle, backgroundImage: `url("${pokedexIndicatorLights}")` };
  const progressStyle = { '--pokedex-entry-index': entryIndex } as CSSProperties;

  return <dialog ref={dialog} className="pokedex-dialog" aria-labelledby="pokedex-title" data-testid="pokedex-dialog"
    data-frame={frame} data-phase={phaseState} onCancel={event => { event.preventDefault(); beginClose(); }} onKeyDown={handleKeyDown}>
    <h2 id="pokedex-title" className="sr-only">pokedex contact entries</h2>
    <div className="pokedex-device" data-testid="pokedex-device">
      <div className="pokedex-screen-underlay" data-testid="pokedex-screen-underlay" aria-hidden="true" style={underlayStyle} />
      <div className="pokedex-device-art" aria-hidden="true" style={sheetStyle} />
      <div className="pokedex-indicator-lights" data-testid="pokedex-indicator-lights" aria-hidden="true" style={indicatorLightStyle} />
      <div className="pokedex-screen pokedex-screen-portrait" aria-label="manan portrait" style={portraitStyle} hidden={!screensVisible}>
        <CharacterSprite definition={manan} clip="portrait" playing={false} scale={1} label="manan portrait"
          className="pokedex-portrait" style={{ width: '72%', height: 'auto' }} />
        <span className="pokedex-portrait-caption">manan · trainer</span>
      </div>
      <section className="pokedex-screen pokedex-screen-contact" aria-label="contact entry" aria-live="polite"
        data-testid="pokedex-contact-screen" data-entry-index={entryIndex} style={contactStyle} hidden={!screensVisible}>
        <div className="pokedex-screen-topline"><span>contact dex</span><span>{String(entryIndex + 1).padStart(2, '0')} / 04</span></div>
        <div className="pokedex-screen-rule" />
        <p className="pokedex-entry-eyebrow">{current.eyebrow}</p>
        <h3 className="pokedex-entry-title">{current.title}</h3>
        <p className="pokedex-entry-description">{current.description}</p>
        {selected && <p className="pokedex-entry-status" role="status">entry selected · {current.label}</p>}
        <div className="pokedex-progress" aria-hidden="true" style={progressStyle}>
          {contactEntries.map(entry => <span className="pokedex-progress-segment" key={entry.id} />)}
          <span className="pokedex-progress-cursor" />
        </div>
      </section>

      <button ref={closeButton} className="pokedex-key pokedex-key-close" type="button" aria-label="close pokedex"
        onClick={beginClose} />
      <button className="pokedex-key pokedex-key-previous" type="button" aria-label="previous entry"
        onClick={() => changeEntry(-1, 4)} />
      <button className="pokedex-key pokedex-key-next" type="button" aria-label="next entry"
        onClick={() => changeEntry(1, 5)} />
      <button className="pokedex-key pokedex-key-select" type="button" aria-label="select entry" onClick={selectEntry}><span aria-hidden="true">submit</span></button>
    </div>
  </dialog>;
}
