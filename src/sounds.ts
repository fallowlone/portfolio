export class SoundManager {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean;

  constructor() {
    this.enabled = localStorage.getItem("terminal-sound") === "true";
  }

  private getCtx(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  private playTone(frequency: number, durationMs: number, gain = 0.05): void {
    if (!this.enabled) return;
    try {
      const ctx = this.getCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.frequency.value = frequency;
      gainNode.gain.value = gain;
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Ignore audio errors silently
    }
  }

  playKey(): void {
    this.playTone(800, 20);
  }

  playEnter(): void {
    this.playTone(400, 40);
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem("terminal-sound", String(this.enabled));
    return this.enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(value: boolean): void {
    this.enabled = value;
    localStorage.setItem("terminal-sound", String(value));
  }
}
