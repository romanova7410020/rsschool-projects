import { createControlPanel } from '../components/controlspanel';
import PairSelector from '@/components/pairSelector';

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
  }

  createControls() {
    if (!this.controlsInitialized) {
      this.controlPanel = createControlPanel(this.root, this.randomGrid.pairSelector);
      this.controlsInitialized = true;
    }
  }

  render() {
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
    }

    this.createControls();
    this.connectHintsButton();
    this.connectAddNumbersButton();
    this.connectShuffleButton();
    this.randomGrid.renderGrid();
    this.connectEraserButton();
  }

  connectHintsButton() {
    const button = this.controlPanel.buttons.hints;
    const hintsLogic = this.controlPanel.hintsLogic;
    const counter = this.controlPanel.counters.hints;
    const gridContainer = this.randomGrid.getGridContainer();

    button.addEventListener('click', () => {
      const result = hintsLogic.useHint(gridContainer);

      if (result.success) {
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

}
