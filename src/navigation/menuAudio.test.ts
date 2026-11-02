import { afterEach, describe, expect, it, vi } from 'vitest';

type AudioModule = { playMenuCue(kind: string): void };
const modules = import.meta.glob('./menuAudio.ts');

async function loadAudio() {
  const loader = modules['./menuAudio.ts'];
  expect(loader, 'menuAudio.ts must provide guarded sound cues').toBeDefined();
  return loader ? await loader() as AudioModule : undefined;
}

afterEach(() => vi.unstubAllGlobals());

describe('menu audio', () => {
  it('does not block a menu action when Web Audio is unavailable', async () => {
    vi.resetModules();
    vi.stubGlobal('AudioContext', undefined);
    const audio = await loadAudio();
    expect(() => audio?.playMenuCue('bag-open')).not.toThrow();
  });

  it('swallows a browser rejection when an audio context cannot resume', async () => {
    vi.resetModules();
    const resume = vi.fn(() => Promise.reject(new Error('audio is suspended')));
    class SuspendedAudioContext {
      currentTime = 0;
      destination = {};
      state = 'suspended';
      resume = resume;
      createOscillator() {
        return { frequency: { setValueAtTime() {}, linearRampToValueAtTime() {} }, connect() {}, start() {}, stop() {}, type: 'triangle' };
      }
      createGain() {
        return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} };
      }
    }
    vi.stubGlobal('AudioContext', SuspendedAudioContext);
    const audio = await loadAudio();

    expect(() => audio?.playMenuCue('bag-open')).not.toThrow();
    expect(resume).toHaveBeenCalledTimes(1);
  });
});
