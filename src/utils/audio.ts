/**
 * Pure Web Audio API synthesizers for in-game notifications
 * Zero external asset dependencies - works instantly in browser
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playUpgradeCompleteSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Melodic CoC victory chime: C5 -> E5 -> G5 -> C6 fanfare
  const freqs = [523.25, 659.25, 783.99, 1046.50];
  const durations = [0.12, 0.12, 0.15, 0.35];
  let timeOffset = 0;

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = i === freqs.length - 1 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now + timeOffset);

    gain.gain.setValueAtTime(0, now + timeOffset);
    gain.gain.linearRampToValueAtTime(0.25, now + timeOffset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + durations[i]);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + timeOffset);
    osc.stop(now + timeOffset + durations[i]);

    timeOffset += durations[i] * 0.85;
  });
}

export function playWarAlertSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Brass war horn tone: Bb3 with slight detune
  [233.08, 235.1, 466.16].forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = idx === 2 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.65);
  });
}

export function playTapSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
}
