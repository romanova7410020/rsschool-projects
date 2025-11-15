import winSound from '../assets/winpair.mp3';
import loseSound from '../assets/losepair.mp3';
import winGameSound from '../assets/win.mp3';
import loseGameSound from '../assets/lose.mp3';
import shuffleSound from '../assets/shuffle.mp3';
import addNumberSound from '../assets/addnumb.mp3';
import eraserSound from '../assets/eraser.mp3';
import hintSound from '../assets/hint.mp3';
import revertSound from '../assets/revert.mp3';

export class SoundEffects {
  constructor() {
    this.successSound = new Audio(winSound);
    this.failureSound = new Audio(loseSound);
    this.winGameSound = new Audio(winGameSound);
    this.loseGameSound = new Audio(loseGameSound);
    this.shuffleSound = new Audio(shuffleSound);
    this.addNumberSound = new Audio(addNumberSound);
    this.eraserSound = new Audio(eraserSound);
    this.revertSound = new Audio(revertSound);
    this.hintSound = new Audio(hintSound);
    this.successSound.volume = 0.5;
    this.failureSound.volume = 0.5;
    this.winGameSound.volume = 1;
    this.loseGameSound.volume = 1;
    this.shuffleSound.volume = 0.5;
    this.addNumberSound.volume = 0.5;
    this.eraserSound.volume = 0.5;
    this.hintSound.volume = 0.5;
    this.revertSound.volume = 0.5;
  }

  playSuccess() {
    this.successSound.currentTime = 0;
    this.successSound.play().catch(err => console.log('Success sound error:', err));
  }

  playFailure() {
    this.failureSound.currentTime = 0;
    this.failureSound.play().catch(err => console.log('Failure sound error:', err));
  }
    playWinGame() {
    this.winGameSound.currentTime = 0;
    this.winGameSound.play().catch(err => console.log('Win game:', err.message));
  }
  playLoseGame() {
    this.loseGameSound.currentTime = 0;
    this.loseGameSound.play().catch(err => console.log('Lose game:', err.message));
  }
  playAddNumbers() {
    this.addNumberSound.currentTime = 0;
    this.addNumberSound.play().catch(err => console.log('Add numbers:', err.message));
  }

  playShuffle() {
    this.shuffleSound.currentTime = 0;
    this.shuffleSound.play().catch(err => console.log('Shuffle:', err.message));
  }

  playEraser() {
    this.eraserSound.currentTime = 0;
    this.eraserSound.play().catch(err => console.log('Eraser:', err.message));
  }
  playHint() {
    this.hintSound.currentTime = 0;
    this.hintSound.play().catch(err => console.log('Hint:', err.message));
  }

  playRevert() {
    this.revertSound.currentTime = 0;
    this.revertSound.play().catch(err => console.log('Revert:', err.message));
  }
  setVolume(volume) {
    this.successSound.volume = volume;
    this.failureSound.volume = volume;
    this.winGameSound.volume = volume;
    this.loseGameSound.volume = volume;
    this.addNumbersSound.volume = volume;
    this.shuffleSound.volume = volume;
    this.eraserSound.volume = volume;
    this.revertSound.volume = volume;
    this.hintSound.volume = volume;
  }
}
