import { createControlPanel } from '../components/controlspanel';

class randomMode {
  constructor(container) {
    this.container = container;
    this.currentNumber = 1;
    this.maxCells =27;
    this.numbers = [];
    for (let i  = 1; i <= 19; i++) {
      if (i !== 10) this.numbers.push (i);
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
      this.container.appendChild(cell);
    });
  }
  renderGrid() {
    this.clearGrid();

    let totalCellcount = 0;
    const maxCells = this.maxCells;
    const shuffledNumbers = this.shuffleArray([...this.numbers]);
    for(let number of shuffledNumbers) {
      const digitsCount = number.toString().length;
      if (totalCellcount + digitsCount > maxCells) {
        break;
      }
      this.createCell(number);
      totalCellcount += digitsCount
    }
  }
}


export default class RandomModeScreen {
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
    h2.textContent = 'Random Mode';
    this.root.appendChild(h2);

    gridContainer = document.createElement('div');
    gridContainer.classList.add('gridcontainer');
    this.root.appendChild(gridContainer);

    if (!this.randomGrid) {
      this.randomGrid = new randomMode(gridContainer);
    }
    this.randomGrid.renderGrid();

    if (!this.controlsInitialized) {
      this.createControls();
      this.controlsInitialized = true;
    }
  }

  createControls() {
    this.controlRefs = createControlPanel(this.root);
  }
}
