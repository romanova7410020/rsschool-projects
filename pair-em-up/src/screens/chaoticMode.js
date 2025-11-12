import { createControlPanel } from '../components/controlspanel';
import PairSelector from '@/components/pairSelector';


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
  }
  createControls() {
    if (!this.controlsInitialized) {
      this.controlPanel = createControlPanel(this.root, this.chaoticGrid.pairSelector);
      this.controlsInitialized = true;
    }
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
    }

    this.createControls();
    this.connectHintsButton();
    this.connectAddNumbersButton();
    this.chaoticGrid.renderGrid();
    this.connectShuffleButton();

  }

  connectHintsButton() {
    const button = this.controlPanel.buttons.hints;
    const hintsLogic = this.controlPanel.hintsLogic;
    const counter = this.controlPanel.counters.hints;
    const gridContainer = this.chaoticGrid.getGridContainer();

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
  const gridContainer = this.chaoticGrid.getGridContainer();

  button.addEventListener('click', () => {
    const result = addNumbersLogic.addNumbers(gridContainer, 'chaotic');

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
  const gridContainer = this.chaoticGrid.getGridContainer();

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
