import { createControlPanel } from '../components/controlspanel';
import PairSelector from '@/components/PairSelector';

class ClassicMode {
  constructor(container) {
    this.container = container;
    this.pairSelector= new PairSelector();
    this.currentNumber = 1;
  }

  clearGrid() {
    this.container.innerHTML = '';
  }

  createCell(number) {
    const digits = number.toString().split('');
    digits.forEach(digit => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = digit;
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
}

export default class ClassicModeScreen {
  constructor(rootElement, switchScreenCallback) {
    this.root = rootElement;
    this.switchScreen = switchScreenCallback;
    this.controlsInitial = false;
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
      this.classicGrid = new ClassicMode(gridContainer);
    }
    this.classicGrid.renderGrid();

    if (!this.controlsInitial) {
      this.createControls();
      this.controlsInitial = true;
    }
  }
    createControls() {
    if (!this.controlsInitialized) {
      this.controlRefs = createControlPanel(this.root);
      this.controlsInitialized = true;
    }
  }
      }


