import { useState } from 'react';
import { CharacterSprite, SpriteMotion } from './CharacterSprite';
import { manan } from './manan';

export default function SpritePreview() {
  const [clip, setClip] = useState('standing-idle');
  const [playing, setPlaying] = useState(true);
  const [move, setMove] = useState(false);
  return <main className="sprite-preview">
    <a href="./">← back to the little world</a>
    <h1>Manan, in pixels.</h1>
    <p>Same character. Different moods. No furniture attached.</p>
    <div className="preview-stage">
      <SpriteMotion className={move ? 'demo-moving' : ''}>
        <CharacterSprite clip={clip} definition={manan} playing={playing} key={clip} scale={3} />
      </SpriteMotion>
    </div>
    <div className="preview-controls">
      {Object.keys(manan.clips).map(name => <button key={name} aria-pressed={name === clip} onClick={() => setClip(name)}>{name}</button>)}
    </div>
    <div className="preview-controls">
      <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause frames' : 'Play frames'}</button>
      <button aria-pressed={move} onClick={() => setMove(!move)}>Move wrapper</button>
    </div>
    <p className="preview-note">Movement demo translates the wrapper. It does not pretend to be a walk cycle.</p>
  </main>;
}
