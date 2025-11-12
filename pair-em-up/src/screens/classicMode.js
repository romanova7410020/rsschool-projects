
import { createControlPanel } from '../components/controlspanel';
import PairSelector from '@/components/pairSelector';

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
  }

  render() {
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
    }
    this.createControls();
    this.connectHintsButton();
    this.classicGrid.renderGrid();
    this.connectAddNumbersButton();
    this.connectShuffleButton();
  }

  createControls() {
    if (!this.controlsInitialized) {
      this.controlPanel = createControlPanel(
        this.root,
        this.classicGrid.pairSelector
      );
      this.controlsInitialized = true;
    }
  }
  connectHintsButton() {
    const button = this.controlPanel.buttons.hints;
    const hintsLogic = this.controlPanel.hintsLogic;
    const counter = this.controlPanel.counters.hints;
    const gridContainer = this.classicGrid.getGridContainer();

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
  const gridContainer = this.classicGrid.getGridContainer();

  button.addEventListener('click', () => {
    const result = addNumbersLogic.addNumbers(gridContainer, 'classic');

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
  const gridContainer = this.classicGrid.getGridContainer();

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
}


