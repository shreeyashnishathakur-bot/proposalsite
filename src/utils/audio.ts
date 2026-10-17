/**
 * Web Audio API Sound Synthesizer for Romantic Proposal
 * 100% self-contained, zero external mp3 dependencies, zero 404s.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private musicInterval: number | null = null;
  private isMusicPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isMusicPlaying) {
      this.stopMusic();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  /**
   * Playful bouncy spring/whoosh sound when NO button dodges
   */
  public playWhoosh() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime;
      const duration = 0.22;

      osc.type = 'sine';
      // playful wobble pitch
      osc.frequency.setValueAtTime(320, startTime);
      osc.frequency.exponentialRampToValueAtTime(750, startTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(280, startTime + duration);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  /**
   * Sweet click / pop sound on heart taps
   */
  public playPop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const startTime = ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, startTime);
      osc.frequency.exponentialRampToValueAtTime(880, startTime + 0.06);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.09);
    } catch {
      // Ignore
    }
  }

  /**
   * Heavenly romantic harp chime arpeggio for the YES celebration
   */
  public playYesCelebration() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // Arpeggio notes: F4, A4, C5, E5, F5, A5, C6 (dreamy romantic Fmaj9 chord)
      const notes = [349.23, 440.0, 523.25, 659.25, 698.46, 880.0, 1046.5];

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = index * 0.09;
        const startTime = ctx.currentTime + delay;
        const duration = 1.4;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        // Gentle vibrato on sustain
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        vibrato.frequency.value = 5.5;
        vibratoGain.gain.value = 4.0;
        vibrato.connect(osc.frequency);
        vibrato.start(startTime);
        vibrato.stop(startTime + duration);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.22, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Soft, romantic music box lullaby loop
   */
  public startRomanticMusic() {
    if (this.isMuted || this.isMusicPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.isMusicPlaying = true;

    // A sweet 16-note romantic music box melody
    // F - C - Dm - Bb progression notes
    const melody = [
      523.25, 659.25, 698.46, 783.99,
      698.46, 659.25, 523.25, 587.33,
      659.25, 523.25, 440.00, 523.25,
      587.33, 659.25, 698.46, 880.00
    ];

    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isMusicPlaying || this.isMuted) return;
      const currentCtx = this.getContext();
      if (!currentCtx) return;

      const freq = melody[noteIndex % melody.length];
      noteIndex++;

      try {
        const osc = currentCtx.createOscillator();
        const gain = currentCtx.createGain();
        const startTime = currentCtx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.07, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.55);

        osc.connect(gain);
        gain.connect(currentCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.55);
      } catch {
        // Ignore
      }
    };

    // Play every 360ms
    playNextNote();
    this.musicInterval = window.setInterval(playNextNote, 360);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startRomanticMusic();
      return true;
    }
  }
}

export const sound = new SoundEngine();
