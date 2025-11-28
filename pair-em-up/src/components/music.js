export class Music {
  constructor(audioPath = './main_theme.mp3') {
    this.audio = new Audio(audioPath);
    this.audio.loop = true;
    this.audio.volume = 0.2;
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.audio.play().catch(err => {
        console.log('Auto-play blocked:', err);
      });
      this.isPlaying = true;
    }
  }

  pause() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume() {
    return this.audio.volume;
  }
}