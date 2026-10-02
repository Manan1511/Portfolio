import { useEffect, useState } from 'react';
import { CharacterSprite } from '../character/CharacterSprite';
import { frameAt } from '../character/animation';
import { pokemon, type PokemonId } from './definitions';
import { useReducedMotion } from '../shared/useReducedMotion';

export default function PokemonPreview() {
  const [id, setId] = useState<PokemonId>('charizard');
  const [clip, setClip] = useState('flight');
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [inspect, setInspect] = useState<number | null>(null);
  const [mirror, setMirror] = useState(false);
  const reduced = useReducedMotion();
  const definition = pokemon[id].sprite;
  const selected = definition.clips[clip];
  const index = inspect ?? (reduced ? 0 : frameAt(selected, elapsed));
  const anchor = selected.frames[index].anchors?.mouth;
  useEffect(() => {
    if (!playing || reduced || inspect !== null) return;
    let last = performance.now(), timer = 0;
    const tick = (now: number) => { setElapsed(t => t + Math.min(now - last, 50)); last = now; timer = requestAnimationFrame(tick); };
    timer = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(timer);
  }, [playing, inspect, reduced]);
  return <main className="sprite-preview">
    <a href="./">← back to the little world</a>
    <h1>Pokémon, frame by frame.</h1>
    <p>Whole sprites. Original pixels. Transparent sheets.</p>
    <div className="preview-stage"><div style={{ position: 'relative', transform: mirror ? 'scaleX(-1)' : undefined }}>
      <CharacterSprite definition={definition} clip={clip} frameIndex={index} scale={2} label={pokemon[id].name} />
      {anchor && <span className="anchor-marker" style={{ left: anchor.x * 2, top: anchor.y * 2 }} aria-hidden="true" />}
    </div></div>
    <div className="preview-controls">{Object.values(pokemon).map(species => <button key={species.id}
      aria-pressed={id === species.id} onClick={() => { setId(species.id); setClip(species.habitat === 'sky' ? 'flight' : 'walk'); setElapsed(0); setInspect(null); }}>{species.name}</button>)}</div>
    <div className="preview-controls">{Object.keys(definition.clips).map(name => <button key={name} aria-pressed={clip === name}
      onClick={() => { setClip(name); setElapsed(0); setInspect(null); }}>{name}</button>)}</div>
    <div className="preview-controls">
      <button onClick={() => { setElapsed(0); setPlaying(!playing); }}>{playing ? 'Pause frames' : 'Play frames'}</button>
      <button aria-pressed={mirror} onClick={() => setMirror(!mirror)}>Mirror</button>
      <button aria-pressed={inspect !== null} onClick={() => setInspect(inspect === null ? 0 : null)}>Inspect frames</button>
    </div>
    {inspect !== null && <label className="frame-inspector">Frame {inspect + 1} / {selected.frames.length}
      <input aria-label="Animation frame" type="range" min={0} max={selected.frames.length - 1} step={1}
        value={inspect} onChange={event => setInspect(Number(event.target.value))} />
    </label>}
    <p className="preview-note">Pink marker shows the mouth anchor. Click attack to inspect its 1.2-second sequence.</p>
  </main>;
}
