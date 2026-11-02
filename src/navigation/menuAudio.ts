type MenuCue = 'bag-open' | 'bag-close' | 'device-open' | 'device-close' | 'select';

type CueShape = { startHz: number; endHz: number; seconds: number; wave: OscillatorType };

const cues: Record<MenuCue, CueShape> = {
  'bag-open': { startHz: 620, endHz: 880, seconds: 0.075, wave: 'triangle' },
  'bag-close': { startHz: 880, endHz: 620, seconds: 0.075, wave: 'triangle' },
  'device-open': { startHz: 392, endHz: 784, seconds: 0.16, wave: 'square' },
  'device-close': { startHz: 784, endHz: 392, seconds: 0.16, wave: 'square' },
  select: { startHz: 988, endHz: 740, seconds: 0.06, wave: 'triangle' },
};

let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (sharedContext) return sharedContext;
  if (typeof window === 'undefined') return null;

  const audioWindow = window as Window & { webkitAudioContext?: typeof AudioContext };
  const ContextConstructor = window.AudioContext ?? audioWindow.webkitAudioContext;
  if (!ContextConstructor) return null;

  try {
    sharedContext = new ContextConstructor();
    return sharedContext;
  } catch {
    return null;
  }
}

/** Play a short synthesized cue after a user action. Audio is always optional. */
export function playMenuCue(kind: MenuCue): void {
  const context = getContext();
  if (!context) return;

  const cue = cues[kind];
  try {
    if (context.state === 'suspended') void context.resume().catch(() => undefined);

    const start = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = cue.wave;
    oscillator.frequency.setValueAtTime(cue.startHz, start);
    oscillator.frequency.exponentialRampToValueAtTime(cue.endHz, start + cue.seconds);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.035, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + cue.seconds);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + cue.seconds + 0.01);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  } catch {
    // Browser audio support varies; never make a menu action depend on it.
  }
}
