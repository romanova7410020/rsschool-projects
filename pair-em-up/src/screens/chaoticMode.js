import { createControlPanel } from '../components/controlspanel';
import PairSelector from '@/components/pairSelector';


class chaoticMode {
  constructor(container) {
    this.container = container;
    this.pairSelector= new PairSelector();
    this.maxCells = 27;

    this.numbers = Array.from({length: this.maxCells }, () => this.getRandomNumber())
  }
  getRandomNumber() {
    return Math.floor(Math.random() * 9) + 1;
  }
  clearGrid() {
    this.container.innerHTML = '';
  }

  createCell(number) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = number;
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

}
export default class ChaoticModeScreen {
  constructor(rootElement, switchScreenCallback) {
    this.root = rootElement;
    this.switchScreen = switchScreenCallback;
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
  this.chaoticGrid = new chaoticMode (gridContainer);
  }
  this.chaoticGrid.renderGrid();

  if (!this.controlsInitialized) {
  this.createControls();
  this.controlsInitialized = true;
    }
}

  createControls() {
     this.controlRefs = createControlPanel(this.root);
    }
  }