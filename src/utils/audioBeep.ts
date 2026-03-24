let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

export function playBeep(frequency: number = 800, duration: number = 0.1, volume: number = 0.3) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.error('Beep sound error:', error);
  }
}

export function playStrokeBeep() {
  playBeep(1000, 0.08, 0.25);
}

export function playIntervalBeep() {
  playBeep(1200, 0.1, 0.3);
  setTimeout(() => playBeep(1200, 0.1, 0.3), 150);
}

export function playWarningBeep() {
  playBeep(800, 0.12, 0.35);
  setTimeout(() => playBeep(900, 0.12, 0.35), 200);
  setTimeout(() => playBeep(1000, 0.12, 0.35), 400);
}
