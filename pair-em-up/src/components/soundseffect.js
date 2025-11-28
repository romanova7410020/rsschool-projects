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

    this.soundSettings = this.loadSoundSettings();

    document.addEventListener('soundSettingsChanged', (e) => {
      this.soundSettings = e.detail;
    });
  }

  loadSoundSettings() {
    try {
      const saved = localStorage.getItem('soundSettings');
      return saved ? JSON.parse(saved) : {
        cellSelection: true,
        cellDeselection: true,
        pairMatching: true,
        invalidPair: true,
        addNumbers: true,
        shuffle: true,
        gameStart: true,
        gameEnd: true
      };
    } catch {
      return {
        cellSelection: true,
        cellDeselection: true,
        pairMatching: true,
        invalidPair: true,
        addNumbers: true,
        shuffle: true,
        gameStart: true,
        gameEnd: true
      };
    }
  }

  isSoundEnabled(soundType) {
    return this.soundSettings[soundType] !== false;
  }

  playSuccess() {
    if (this.isSoundEnabled('pairMatching')) {
      this.successSound.currentTime = 0;
      this.successSound.play().catch(err => console.log('Success sound error:', err));
    }
  }

  playFailure() {
    if (this.isSoundEnabled('invalidPair')) {
      this.failureSound.currentTime = 0;
      this.failureSound.play().catch(err => console.log('Failure sound error:', err));
    }
  }

  playWinGame() {
    if (this.isSoundEnabled('gameEnd')) {
      this.winGameSound.currentTime = 0;
      this.winGameSound.play().catch(err => console.log('Win game:', err.message));
    }
  }

  playLoseGame() {
    if (this.isSoundEnabled('gameEnd')) {
      this.loseGameSound.currentTime = 0;
      this.loseGameSound.play().catch(err => console.log('Lose game:', err.message));
    }
  }

  playAddNumbers() {
    if (this.isSoundEnabled('addNumbers')) {
      this.addNumberSound.currentTime = 0;
      this.addNumberSound.play().catch(err => console.log('Add numbers:', err.message));
    }
  }

  playShuffle() {
    if (this.isSoundEnabled('shuffle')) {
      this.shuffleSound.currentTime = 0;
      this.shuffleSound.play().catch(err => console.log('Shuffle:', err.message));
    }
  }

  playEraser() {
    if (this.isSoundEnabled('eraser')) {
      this.eraserSound.currentTime = 0;
      this.eraserSound.play().catch(err => console.log('Eraser:', err.message));
    }
  }

  playHint() {
    if (this.isSoundEnabled('cellSelection')) {
      this.hintSound.currentTime = 0;
      this.hintSound.play().catch(err => console.log('Hint:', err.message));
    }
  }

  playRevert() {
    if (this.isSoundEnabled('revert')) {
      this.revertSound.currentTime = 0;
      this.revertSound.play().catch(err => console.log('Revert:', err.message));
    }
  }

  setVolume(volume) {
    this.successSound.volume = volume;
    this.failureSound.volume = volume;
    this.winGameSound.volume = volume;
    this.loseGameSound.volume = volume;
    this.addNumberSound.volume = volume;
    this.eraserSound.volume = volume;
    this.revertSound.volume = volume;
    this.hintSound.volume = volume;
  }
}

