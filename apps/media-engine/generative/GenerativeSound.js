// apps/media-engine/generative/GenerativeSound.js
// Real-time generative audio engine for EPIC TECH AIGENT avatars

export class GenerativeSound {
  constructor() {
    this.audioContext = null;
    this.oscillators = [];
    this.gain = null;
    this.isPlaying = false;
  }

  init() {
    if (typeof window !== 'undefined' && !this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.gain = this.audioContext.createGain();
      this.gain.gain.value = 0.15;
      this.gain.connect(this.audioContext.destination);
    }
  }

  playFractalNote(note = 'C', octave = 4, duration = 800, type = 'sine') {
    if (!this.audioContext) this.init();
    if (!this.audioContext) return;

    const freqMap = { C: 261.63, 'C#': 277.18, D: 293.66, 'D#': 311.13, E: 329.63, F: 349.23, 'F#': 369.99, G: 392.0, 'G#': 415.3, A: 440.0, 'A#': 466.16, B: 493.88 };
    const frequency = freqMap[note] * Math.pow(2, octave - 4);

    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.type = type;
    osc.frequency.value = frequency;

    filter.type = 'lowpass';
    filter.frequency.value = 1200 + Math.random() * 800;

    gainNode.gain.value = 0.6;

    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.6, now);
    gainNode.gain.linearRampToValueAtTime(0.001, now + duration / 1000);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.gain);

    osc.start(now);
    osc.stop(now + duration / 1000);

    this.oscillators.push(osc);
    setTimeout(() => {
      this.oscillators = this.oscillators.filter(o => o !== osc);
    }, duration + 100);
  }

  triggerMutationSound(intensity = 0.5, personality = 'Architect') {
    const notes = ['C', 'D#', 'F', 'G#', 'A#'];
    const note = notes[Math.floor(Math.random() * notes.length)];
    const octave = 3 + Math.floor(intensity * 3);
    const duration = 400 + intensity * 600;
    const type = intensity > 0.7 ? 'sawtooth' : 'sine';

    this.playFractalNote(note, octave, duration, type);

    // Occasional harmonic layer for rich fractal feel
    if (intensity > 0.6) {
      setTimeout(() => {
        this.playFractalNote(notes[(notes.indexOf(note) + 2) % 5], octave + 1, duration * 0.6, 'triangle');
      }, 120);
    }
  }

  stopAll() {
    this.oscillators.forEach(osc => osc.stop());
    this.oscillators = [];
    this.isPlaying = false;
  }
}

export const generativeSound = new GenerativeSound();
