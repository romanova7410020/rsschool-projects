export default class Timer {
  constructor(container) {
    this.container = container;
    this.secondsElapsed = 0;
    this.timerId = null;
    this.start();
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  updateDisplay() {
    this.container.textContent = this.formatTime(this.secondsElapsed);
  }

  start() {
    this.timerId = setInterval(() => {
      this.secondsElapsed++;
      this.updateDisplay();
    }, 1000);
  }

  stop() {
    clearInterval(this.timerId);
  }

  reset() {
    this.secondsElapsed = 0;
    this.updateDisplay();
  }
}