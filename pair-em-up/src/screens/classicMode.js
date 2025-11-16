
import { createControlPanel } from '../components/controlspanel';
import PairSelector from '@/components/pairSelector';
import { GameStatusChecker } from '@/components/gamestatus';
import { SoundEffects } from '@/components/soundseffect';
import { GameSaver } from '@/components/savegame';
import { GameStats } from '@/components/statistic';

class ClassicMode {
  constructor(container, updateScoreCallback) {
    this.container = container;
    this.pairSelector = new PairSelector(this.handlePairMatched.bind(this), 9);
    this.currentNumber = 1;
    this.totalCellCount = 0;
    this.updateScoreCallback = updateScoreCallback;
  }

  handlePairMatched(points) {
    if (this.updateScoreCallback) {
      this.updateScoreCallback(points);
    }
  }

  clearGrid() {
    this.container.innerHTML = '';
    this.totalCellCount = 0;
    this.currentNumber = 1;
  }

  createCell(number) {
    const digits = number.toString().split('');
    digits.forEach(digit => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = digit;
      cell.dataset.index = this.totalCellCount;
      this.container.appendChild(cell);

      cell.addEventListener('click', () => {
        if (this.pairSelector.selectedCells.includes(cell)) {
          this.pairSelector.deselectCell(cell);
        } else {
          this.pairSelector.selectCell(cell);
        }
      });

      this.totalCellCount++;
    });
  }

  renderGrid() {
    this.clearGrid();

    let totalCell = 0;
    const MaxCells = 27;
    while (totalCell < MaxCells) {
      if (this.currentNumber === 10) {
        this.currentNumber++;
        continue;
      }
      const digits = this.currentNumber.toString().split('');
      if (totalCell + digits.length > MaxCells) {
        break;
      }
      this.createCell(this.currentNumber);

      if (this.currentNumber === 19) {
        break;
      }
      this.currentNumber++;
      totalCell += digits.length;
    }
  }
  getGridContainer() {
    return this.container;
  }
}

export default class ClassicModeScreen {
  constructor(rootElement, switchScreenCallback) {
    this.root = rootElement;
    this.switchScreen = switchScreenCallback;
    this.controlsInitialized = false;
    this.gameStatusChecker = null;
    this.soundEffects = new SoundEffects();
    this.gameSaver = new GameSaver();
  }

  render(options = {}) {
    const { isContinue = false } = options;
    const oldH2 = this.root.querySelector('.h2');
    if (oldH2) oldH2.remove();
    let gridContainer = this.root.querySelector('.gridcontainer');
    if (gridContainer) {
      gridContainer.remove();
    }

    const h2 = document.createElement('h2');
    h2.classList.add('h2');
    h2.textContent = 'Classic Mode';
    this.root.appendChild(h2);

    gridContainer = document.createElement('div');
    gridContainer.classList.add('gridcontainer');
    this.root.appendChild(gridContainer);
    if (!this.classicGrid) {
      this.classicGrid = new ClassicMode(
        gridContainer,
        (points) => this.controlPanel.updateScore(points)
      );
    } else {
      this.classicGrid.container = gridContainer;
      this.classicGrid.currentNumber = 1;
      this.classicGrid.totalCellCount = 0;
    }

    this.createControls();

    const savedGame = this.gameSaver.loadGame();
  if (isContinue && savedGame && savedGame.mode === 'classic') {
    this.loadGameState(savedGame);
  } else {
    this.classicGrid.renderGrid();
  }
    this.connectHintsButton();
    this.connectAddNumbersButton();
    this.connectShuffleButton();
    this.connectEraserButton();
    this.connectRevertButton();
    this.connectResetButton();
    this.connectSaveButton();
    const continueButton = this.controlPanel.buttons.continue;
    const savedGameCheck = this.gameSaver.loadGame();

    if (!savedGameCheck || savedGameCheck.mode !== 'classic') {
      continueButton.disabled = true;
      continueButton.style.opacity = '0.5';
      continueButton.style.cursor = 'not-allowed';
    } else {
      continueButton.disabled = false;
      continueButton.style.opacity = '1';
      continueButton.style.cursor = 'pointer';
    }

    this.connectContinueButton();

    document.addEventListener('pairDeleted', () => {
      this.checkGameStatus();
    });
  }

  createControls() {
    if (!this.controlsInitialized) {
      this.controlPanel = createControlPanel(
        this.root,
        this.classicGrid.pairSelector
      );
      if (this.controlPanel.timer) {
      this.controlPanel.timer.start();
    }
      this.controlsInitialized = true;
    };
    this.gameStatusChecker = new GameStatusChecker(
        this.classicGrid.pairSelector,
        100,
        50,
      );

      this.controlsInitialized = true;
    }

  connectHintsButton() {
    const button = this.controlPanel.buttons.hints;
    const hintsLogic = this.controlPanel.hintsLogic;
    const counter = this.controlPanel.counters.hints;
    const gridContainer = this.classicGrid.getGridContainer();

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
  const gridContainer = this.classicGrid.getGridContainer();

  button.addEventListener('click', () => {
    const result = addNumbersLogic.addNumbers(gridContainer, 'classic');

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
  const gridContainer = this.classicGrid.getGridContainer();

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
  const gridContainer = this.classicGrid.getGridContainer();

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
  const gridContainer = this.classicGrid.getGridContainer();

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
  const gridContainer = this.classicGrid.getGridContainer();
  const cells = Array.from(gridContainer.querySelectorAll('.cell'));
  const pairSelector = this.classicGrid.pairSelector;

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
    const gridContainer = this.classicGrid.getGridContainer();

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
    mode: 'classic',
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
    mode: 'classic',
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
    setTimeout(() => modal.remove(), 300);
  });

  setTimeout(() => {
    if (modal.parentNode) {
      modal.style.animation = 'popoverOut 0.3s ease-out';
      setTimeout(() => modal.remove(), 300);
    }
  }, 3000);
}

connectResetButton() {
  const button = this.controlPanel.buttons.reset;
  button.addEventListener('click', () => {

    this.classicGrid.clearGrid();
    this.classicGrid.currentNumber = 1;

    this.classicGrid.renderGrid();

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
    const timerTime = this.controlPanel.timer?.getTime?.();
    const gameState = {
      mode: 'classic',
      score: this.controlPanel.getScore(),
      timerTime: timerTime || 0,
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
    document.dispatchEvent(new CustomEvent('gameSaved', { detail: { mode: 'classic' } }));

  });
}


connectContinueButton() {
  const button = this.controlPanel.buttons.continue;

  button.addEventListener('click', () => {
    const savedGame = this.gameSaver.loadGame();

    if (!savedGame || savedGame.mode !== 'classic') {
      button.disabled = true;
      button.style.opacity = '0.5';
      button.style.cursor = 'not-allowed';
      return;
    }

    this.loadGameState(savedGame);
  });
}

getCellStates() {
  const gridContainer = this.classicGrid.getGridContainer();
  const cells = Array.from(gridContainer.querySelectorAll('.cell'));
  return cells.map(cell => ({
    index: cell.dataset.index,
    textContent: cell.textContent
  }));
}

loadGameState(gameState) {
  this.classicGrid.renderGrid();

  if (gameState.cellStates) {
    const gridContainer = this.classicGrid.getGridContainer();
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


