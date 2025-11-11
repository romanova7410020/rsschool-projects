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
      this.controlPanel = createControlPanel(this.root);
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

    this.createControls();

    if (!this.randomGrid) {
      this.randomGrid = new RandomMode(gridContainer, this.controlPanel.updateScore);
    }
    this.randomGrid.renderGrid();
  }
}