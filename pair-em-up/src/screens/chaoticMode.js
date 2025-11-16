import { createControlPanel } from '../components/controlspanel';
import PairSelector from '@/components/pairSelector';
import { GameStatusChecker } from '@/components/gamestatus';
import { SoundEffects } from '@/components/soundseffect';
import { GameSaver } from '@/components/savegame';



class ChaoticMode {
  constructor(container, updateScoreCallback) {
    this.container = container;
    this.pairSelector= new PairSelector(this.handlePairMatched.bind(this), 9);
    this.updateScoreCallback = updateScoreCallback;
    this.totalCellCount = 0;
    this.maxCells = 27;

    this.numbers = Array.from({length: this.maxCells }, () => this.getRandomNumber())
  }
  getRandomNumber() {
    return Math.floor(Math.random() * 9) + 1;
  }
  handlePairMatched(points) {
    if (this.updateScoreCallback) {
      this.updateScoreCallback(points);
    }
  }
  clearGrid() {
    this.container.innerHTML = '';
    this.totalCellCount = 0;
  }

  createCell(number) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = number;
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
  }

  renderGrid() {
    this.clearGrid();
    this.numbers.forEach(number => this.createCell(number));
  }
  addNumbers(count) {
    for (let i = 0; i < count; i++) {
      this.numbers[i] = this.getRandomNumber();
    }
    this.renderGrid();
  }
  getGridContainer() {
    return this.container;
  }

}
export default class ChaoticModeScreen {
  constructor(rootElement, switchScreenCallback) {
    this.root = rootElement;
    this.switchScreen = switchScreenCallback;
    this.controlsInitialized = false;
    this.controlPanel = null;
    this.chaoticGrid = null;
    this.gameStatusChecker = null;
    this.soundEffects = new SoundEffects();
    this.gameSaver = new GameSaver();

  }
  createControls() {
    if (!this.controlsInitialized) {
      this.controlPanel = createControlPanel(this.root, this.chaoticGrid.pairSelector);
    }
     this.gameStatusChecker = new GameStatusChecker(
        this.chaoticGrid.pairSelector,
        100,
        50,
      );

      this.controlsInitialized = true;
    }
render(options = {}) {
  const { isNewGame = false, isContinue = false } = options;

  const oldH2 = this.root.querySelector('.h2');
  if (oldH2) oldH2.remove();

  let gridContainer = this.root.querySelector('.gridcontainer');
  if (gridContainer) {
    gridContainer.remove();
  }

  const h2 = document.createElement('h2');
  h2.classList.add('h2');
  h2.textContent = 'Chaotic Mode';
  this.root.appendChild(h2);

  gridContainer = document.createElement('div');
  gridContainer.classList.add('gridcontainer');
  this.root.appendChild(gridContainer);

  if (!this.chaoticGrid) {
    this.chaoticGrid = new ChaoticMode(
      gridContainer,
      (points) => this.controlPanel.updateScore(points)
    );
  } else {
    this.chaoticGrid.container = gridContainer;
    this.chaoticGrid.totalCellCount = 0;
  }

  this.createControls();

  if (isContinue) {
  const savedGame = this.gameSaver.loadGame();
  if (savedGame && savedGame.mode === 'chaotic' && savedGame.numbers) {
    this.chaoticGrid.numbers = [...savedGame.numbers];
    this.loadGameState(savedGame);
  } else {
    this.chaoticGrid.renderGrid();
  }
} else {
  this.chaoticGrid.renderGrid();
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
    const gridContainer = this.chaoticGrid.getGridContainer();

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
  const gridContainer = this.chaoticGrid.getGridContainer();

  button.addEventListener('click', () => {
    const result = addNumbersLogic.addNumbers(gridContainer, 'chaotic');

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
  const gridContainer = this.chaoticGrid.getGridContainer();

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
  const gridContainer = this.chaoticGrid.getGridContainer();

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
  const gridContainer = this.chaoticGrid.getGridContainer();

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
  const gridContainer = this.chaoticGrid.getGridContainer();
  const cells = Array.from(gridContainer.querySelectorAll('.cell'));
  const pairSelector = this.chaoticGrid.pairSelector;

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
    const gridContainer = this.chaoticGrid.getGridContainer();

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
    this.chaoticGrid.clearGrid();

    this.chaoticGrid.numbers = Array.from(
      { length: this.chaoticGrid.maxCells },
      () => this.chaoticGrid.getRandomNumber()
    );

    this.chaoticGrid.renderGrid();
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
      mode: 'chaotic',
      numbers: this.chaoticGrid.numbers,
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
    document.dispatchEvent(new CustomEvent('gameSaved', { detail: { mode: 'classic' } }));
  });
}

connectContinueButton() {
  const button = this.controlPanel.buttons.continue;
  const savedGame = this.gameSaver.loadGame();

  if (!savedGame || savedGame.mode !== 'chaotic') {
    button.disabled = true;
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';
    return;
  }
  button.disabled = false;
  button.style.opacity = '1';
  button.style.cursor = 'pointer';

  button.addEventListener('click', () => {
    const savedGame = this.gameSaver.loadGame();
    if (!savedGame) return;
    this.loadGameState(savedGame);
  });
}

getCellStates() {
  const gridContainer = this.chaoticGrid.getGridContainer();
  const cells = Array.from(gridContainer.querySelectorAll('.cell'));
  return cells.map(cell => ({
    index: cell.dataset.index,
    textContent: cell.textContent
  }));
}

loadGameState(gameState) {
  if (gameState.numbers) {
    this.chaoticGrid.numbers = [...gameState.numbers];
  } else {
    this.chaoticGrid.numbers = Array.from(
      { length: this.chaoticGrid.maxCells },
      () => this.chaoticGrid.getRandomNumber()
    );
  }
  this.chaoticGrid.renderGrid();

  if (gameState.cellStates) {
    const gridContainer = this.chaoticGrid.getGridContainer();
    const cells = Array.from(gridContainer.querySelectorAll('.cell'));

    gameState.cellStates.forEach((savedCell, index) => {
      const cell = cells[index];
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

