import { createControlPanel } from '../components/controlspanel';
import PairSelector from '@/components/pairSelector';
import { GameStatusChecker } from '@/components/gamestatus';
import { SoundEffects } from '@/components/soundseffect';
import { GameSaver } from '@/components/savegame';
import { GameStats } from '@/components/statistic';

class RandomMode {
  constructor(container, updateScoreCallback) {
    this.container = container;
    this.pairSelector = new PairSelector(this.handlePairMatched.bind(this), 9);
    this.updateScoreCallback = updateScoreCallback;
    this.totalCellCount = 0;
    this.maxCells = 27;
    this.numbers = [];
    for (let i = 1; i <= 19; i++) if (i !== 10) this.numbers.push(i);
  }

  handlePairMatched(points) {
    if (this.updateScoreCallback) {
      this.updateScoreCallback(points);
    }
  }

  clearGrid() {
    this.container.innerHTML = '';
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  createCell(number) {
    const digits = number.toString().split('');
    digits.forEach(digit => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = digit;
      cell.dataset.index = this.totalCellCount;
      this.totalCellCount++;
      this.container.appendChild(cell);
      cell.addEventListener('click', () => {
        if (this.pairSelector.selectedCells.includes(cell)) {
          this.pairSelector.deselectCell(cell);
        } else {
          this.pairSelector.selectCell(cell);
        }
      });
    });
  }

  renderGrid() {
    this.clearGrid();
    let totalCells = 0;
    const maxCells = this.maxCells;
    const shuffledNumbers = this.shuffleArray([...this.numbers]);
    for (let number of shuffledNumbers) {
      const digitsCount = number.toString().length;
      if (totalCells + digitsCount > maxCells) break;
      this.createCell(number);
      totalCells += digitsCount;
    }
  }
   getGridContainer() {
    return this.container;
  }
}


export default class RandomModeScreen {
  constructor(rootElement, switchScreenCallback) {
    this.root = rootElement;
    this.switchScreen = switchScreenCallback;
    this.controlsInitialized = false;
    this.controlPanel = null;
    this.randomGrid = null;
    this.gameStatusChecker = null;
    this.soundEffects = new SoundEffects();
     this.gameSaver = new GameSaver();
  }

  createControls() {
    if (!this.controlsInitialized) {
      this.controlPanel = createControlPanel(this.root, this.randomGrid.pairSelector);
      this.controlsInitialized = true;
    }
     this.gameStatusChecker = new GameStatusChecker(
        this.randomGrid.pairSelector,
        100,
        50
      );
      this.controlsInitialized = true;
    }

  render(options = {}) {
    const { isContinue = false } = options;
    const oldH2 = this.root.querySelector('.h2');
    if (oldH2) oldH2.remove();

    let gridContainer = this.root.querySelector('.gridcontainer');
    if (gridContainer) gridContainer.remove();

    const h2 = document.createElement('h2');
    h2.classList.add('h2');
    h2.textContent = 'Random Mode';
    this.root.appendChild(h2);

    gridContainer = document.createElement('div');
    gridContainer.classList.add('gridcontainer');
    this.root.appendChild(gridContainer);

    if (!this.randomGrid) {
      this.randomGrid = new RandomMode(
        gridContainer,
        (points) => this.controlPanel.updateScore(points)
      );
    } else {
    this.randomGrid.container = gridContainer;
    this.randomGrid.totalCellCount = 0;
  }
    this.createControls();

    const savedGame = this.gameSaver.loadGame();

     if (isContinue && savedGame && savedGame.mode === 'random') {
    this.loadGameState(savedGame);
  } else {
    this.randomGrid.renderGrid();
  }

    this.connectHintsButton();
    this.connectAddNumbersButton();
    this.connectShuffleButton();
    this.connectEraserButton();
    this.connectRevertButton();
    this.connectResetButton();
    this.connectSaveButton();
    this.connectContinueButton();

    document.addEventListener('pairDeleted', () => {
      this.checkGameStatus();
    });
  }

  connectHintsButton() {
    const button = this.controlPanel.buttons.hints;
    const hintsLogic = this.controlPanel.hintsLogic;
    const counter = this.controlPanel.counters.hints;
    const gridContainer = this.randomGrid.getGridContainer();

    button.addEventListener('click', () => {
      const result = hintsLogic.useHint(gridContainer);

      if (result.success) {
        this.controlPanel.soundEffects.playHint();
        counter.textContent = result.remaining.toString();

        if (result.remaining === 0) {
          button.disabled = true;
          button.style.opacity = '0.5';
        }
      }
      });
}

  connectAddNumbersButton() {
  const button = this.controlPanel.buttons.addNumbers;
  const addNumbersLogic = this.controlPanel.addNumbersLogic;
  const counter = this.controlPanel.counters.add;
  const gridContainer = this.randomGrid.getGridContainer();
  

  button.addEventListener('click', () => {
    const result = addNumbersLogic.addNumbers(gridContainer, 'random');

    if (result.success) {
      this.controlPanel.soundEffects.playAddNumbers();
      counter.textContent = result.remaining.toString();

      if (result.remaining === 0) {
        button.disabled = true;
        button.style.opacity = '0.5';
      }
    }
  });
}
connectShuffleButton() {
  const button = this.controlPanel.buttons.shuffle;
  const shuffleLogic = this.controlPanel.shuffleLogic;
  const counter = this.controlPanel.counters.shuffle;
  const gridContainer = this.randomGrid.getGridContainer();

  button.addEventListener('click', () => {
    const result = shuffleLogic.shuffle(gridContainer);

    if (result.success) {
      this.controlPanel.soundEffects.playShuffle();
      counter.textContent = result.remaining.toString();

      if (result.remaining === 0) {
        button.disabled = true;
        button.style.opacity = '0.5';
      }
    }
  });
}
connectEraserButton() {
  const button = this.controlPanel.buttons.eraser;
  const eraserLogic = this.controlPanel.eraserLogic;
  const counter = this.controlPanel.counters.eraser;
  const gridContainer = this.randomGrid.getGridContainer();

  const observer = new MutationObserver(() => {
    if (!eraserLogic.isActive()) {
      button.style.backgroundColor = '';
      button.style.color = '';

      counter.textContent = eraserLogic.getEraserRemaining().toString();
    }
  });
  observer.observe(gridContainer, { childList: true, subtree: true });

  button.addEventListener('click', () => {
    const result = eraserLogic.activateEraser(gridContainer);

    if (result.success) {
      this.controlPanel.soundEffects.playEraser();

      if (result.isActive) {
        button.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
        button.style.color = 'white';
      } else {
        button.style.backgroundColor = '';
        button.style.color = '';
      }
      if (result.remaining !== undefined) {
        counter.textContent = result.remaining.toString();

        if (result.remaining === 0) {
          button.disabled = true;
          button.style.opacity = '0.5';
        }
      }
    }
  });
}
connectRevertButton() {
  const button = this.controlPanel.buttons.revert;
  const revertLogic = this.controlPanel.revertLogic;
  const gridContainer = this.randomGrid.getGridContainer();

  const activateRevertButton = () => {
    button.disabled = false;
    button.style.opacity = '1';
  };

  document.addEventListener('pairDeleted', activateRevertButton);

  button.addEventListener('click', () => {
    const result = revertLogic.revert(
      gridContainer,
      (score) => this.controlPanel.setScore(score)
    );

    if (result.success) {
      this.controlPanel.soundEffects.playRevert();
      this.reconnectCellListeners();
      button.disabled = true;
      button.style.opacity = '0.5';
    }
  });
}

reconnectCellListeners() {
  const gridContainer = this.randomGrid.getGridContainer();
  const cells = Array.from(gridContainer.querySelectorAll('.cell'));
  const pairSelector = this.randomGrid.pairSelector;

  cells.forEach(cell => {
    const newCell = cell.cloneNode(true);
    cell.parentNode.replaceChild(newCell, cell);

    newCell.addEventListener('click', () => {
      if (pairSelector.selectedCells.includes(newCell)) {
        pairSelector.deselectCell(newCell);
      } else {
        pairSelector.selectCell(newCell);
      }
    });
  });
}
checkGameStatus() {
    const currentScore = this.controlPanel.getScore();
    const gridContainer = this.randomGrid.getGridContainer();

    const assists = {
      addNumbers: this.controlPanel.addNumbersLogic.getAddNumbersRemaining(),
      shuffle: this.controlPanel.shuffleLogic.getShuffleRemaining(),
      eraser: this.controlPanel.eraserLogic.getEraserRemaining()
    };

    const status = this.gameStatusChecker.checkGameStatus(
      currentScore,
      gridContainer,
      assists
    );

    if (status.status === 'win') {
      this.showWinModal(status.message, currentScore);
    } else if (status.status === 'lose') {
      this.showLoseModal(status.message, currentScore);
    }
  }

 showWinModal(message, score) {
  this.soundEffects.playWinGame();
  let completionTime = 0;
  if (this.controlPanel.timer) {
    completionTime = this.controlPanel.timer.secondsElapsed || 0;
    this.controlPanel.timer.stop();
  }
  const moves = Math.floor(score / 2);
  const gameStats = new GameStats();
  gameStats.saveGameResult({
    mode: 'random',
    score: score,
    isWin: true,
    completionTime: completionTime,
    moves: moves
  });
  const modal = document.createElement('div');
  modal.className = 'game-modal win-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>😀 YOU WIN! 😀</h2>
      <p>${message}</p>
      <p>Final Score: <strong>${score}</strong></p>
    </div>
  `;

  this.root.appendChild(modal);

  modal.addEventListener('click', () => {
    modal.style.animation = 'popoverOut 0.3s ease-out';
    setTimeout(() => modal.remove(), 300);
  });
  if (this.controlPanel.timer) {
    this.controlPanel.timer.stop();
  }
}

showLoseModal(message, score) {
  this.soundEffects.playLoseGame();
  let completionTime = 0;
  if (this.controlPanel.timer) {
    completionTime = this.controlPanel.timer.secondsElapsed || 0;
    this.controlPanel.timer.stop();
  }
  const moves = Math.floor(score / 2);
  const gameStats = new GameStats();
  gameStats.saveGameResult({
    mode: 'random',
    score: score,
    isWin: false,
    completionTime: completionTime,
    moves: moves
  });
  const modal = document.createElement('div');
  modal.className = 'game-modal lose-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>😭 GAME OVER 😭</h2>
      <p>${message}</p>
      <p>Final Score: <strong>${score}</strong></p>
    </div>
  `;

  this.root.appendChild(modal);

  modal.addEventListener('click', () => {
    modal.style.animation = 'popoverOut 0.3s ease-out';
    setTimeout(() => modal.remove(), 30000);
  });

  setTimeout(() => {
    if (modal.parentNode) {
      modal.style.animation = 'popoverOut 0.3s ease-out';
      setTimeout(() => modal.remove(), 30000);
    }
  }, 4000);

  if (this.controlPanel.timer) {
    this.controlPanel.timer.stop();
  }
}
connectResetButton() {
  const button = this.controlPanel.buttons.reset;
  button.addEventListener('click', () => {

    this.randomGrid.clearGrid();
    this.randomGrid.renderGrid();
    this.controlPanel.resetScore();
    this.controlPanel.resetAllAssists();
    this.reconnectCellListeners();
    if (this.controlPanel.timer) {
      this.controlPanel.timer.reset();
      this.controlPanel.timer.start();
    }
  });
}
connectSaveButton() {
  const button = this.controlPanel.buttons.save;

  button.addEventListener('click', () => {
    const gameState = {
      mode: 'random',
      score: this.controlPanel.getScore(),
      timerTime: this.controlPanel.timer?.getTime?.() || 0,
      assists: {
        hintsRemaining: this.controlPanel.hintsLogic.getHintsRemaining(),
        addNumbersRemaining: this.controlPanel.addNumbersLogic.getAddNumbersRemaining(),
        shuffleRemaining: this.controlPanel.shuffleLogic.getShuffleRemaining(),
        eraserRemaining: this.controlPanel.eraserLogic.getEraserRemaining()
      },
      cellStates: this.getCellStates()
    };

    this.gameSaver.saveGame(gameState);
    console.log('Saved to localStorage');
    document.dispatchEvent(new CustomEvent('gameSaved', { detail: { mode: 'random' } }));
  });
}

connectContinueButton() {
  const button = this.controlPanel.buttons.continue;

  button.addEventListener('click', () => {
    const savedGame = this.gameSaver.loadGame();
    if (!savedGame || savedGame.mode !== 'random') {
      button.disabled = true;
      button.style.opacity = '0.5';
      button.style.cursor = 'not-allowed';
      return;
    }

    this.loadGameState(savedGame);
  });
}

getCellStates() {
  const gridContainer = this.randomGrid.getGridContainer();
  const cells = Array.from(gridContainer.querySelectorAll('.cell'));
  return cells.map(cell => ({
    index: cell.dataset.index,
    textContent: cell.textContent
  }));
}

loadGameState(gameState) {
  this.randomGrid.renderGrid();

  if (gameState.cellStates) {
    const gridContainer = this.randomGrid.getGridContainer();
    const cells = Array.from(gridContainer.querySelectorAll('.cell'));
    
    gameState.cellStates.forEach(savedCell => {
      const cell = cells[parseInt(savedCell.index)];
      if (cell && savedCell.textContent === '') {
        cell.textContent = '';
      }
    });
  }

  this.controlPanel.setScore(gameState.score);

  if (this.controlPanel.timer && gameState.timerTime) {
    this.controlPanel.timer.setTime(gameState.timerTime);
    this.controlPanel.timer.start();
  }

  if (gameState.assists) {
    this.restoreAssists(gameState.assists);
  }

  this.reconnectCellListeners();
}

restoreAssists(assists) {
  this.controlPanel.hintsLogic.remaining = assists.hintsRemaining;
  this.controlPanel.addNumbersLogic.remaining = assists.addNumbersRemaining;
  this.controlPanel.shuffleLogic.remaining = assists.shuffleRemaining;
  this.controlPanel.eraserLogic.remaining = assists.eraserRemaining;

  this.controlPanel.counters.hints.textContent = assists.hintsRemaining;
  this.controlPanel.counters.add.textContent = assists.addNumbersRemaining;
  this.controlPanel.counters.shuffle.textContent = assists.shuffleRemaining;
  this.controlPanel.counters.eraser.textContent = assists.eraserRemaining;
}
}

