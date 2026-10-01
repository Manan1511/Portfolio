import { useMemo, useState } from 'react';
import { CharacterSprite, SpriteMotion } from './CharacterSprite';
import { manan } from './manan';

export default function SpritePreview() {
  const [clip, setClip] = useState('standing-idle');
  const [playing, setPlaying] = useState(true);
  const [move, setMove] = useState(false);
  const [inspectFrame, setInspectFrame] = useState<number | null>(null);
  const frames = manan.clips[clip].frames;
  const definition = useMemo(() => inspectFrame === null ? manan : {
    ...manan,
    clips: { ...manan.clips, [clip]: { ...manan.clips[clip], frames: [manan.clips[clip].frames[inspectFrame]] } },
  }, [clip, inspectFrame]);
  return <main className="sprite-preview">
    <a href="./">← back to the little world</a>
    <h1>Manan, in pixels.</h1>
    <p>Same character. Different moods. No furniture attached.</p>
    <div className="preview-stage">
      <SpriteMotion className={move ? 'demo-moving' : ''}>
        <CharacterSprite clip={clip} definition={definition} playing={playing && inspectFrame === null} key={clip} scale={3} />
      </SpriteMotion>
    </div>
    <div className="preview-controls">
      {Object.keys(manan.clips).map(name => <button key={name} aria-pressed={name === clip} onClick={() => { setClip(name); setInspectFrame(null); }}>{name}</button>)}
    </div>
    <div className="preview-controls">
      <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause frames' : 'Play frames'}</button>
      <button aria-pressed={move} onClick={() => setMove(!move)}>Move wrapper</button>
      <button aria-pressed={inspectFrame !== null} onClick={() => setInspectFrame(inspectFrame === null ? 0 : null)}>Inspect frames</button>
    </div>
    {inspectFrame !== null && <label className="frame-inspector">
      <span>Frame {inspectFrame + 1} / {frames.length}</span>
      <input type="range" aria-label="Animation frame" min={0} max={frames.length - 1} step={1}
        value={inspectFrame} onChange={event => setInspectFrame(Number(event.target.value))} />
    </label>}
    <p className="preview-note">Movement demo translates the wrapper. It does not pretend to be a walk cycle.</p>
  </main>;
}
