import { SoundEffects } from './soundseffect'

export default class PairSelector {
  constructor(onPairMatchedCallback, gridWidth) {
    this.selectedCells = [];
    this.onPairMatched = onPairMatchedCallback;
    this.gridWidth = gridWidth;
    this.revertLogic = null;
    this.getScoreCallback = null;
    this.soundEffects = new SoundEffects();
  }
  setRevertLogic(revertLogic) {
    this.revertLogic = revertLogic;
  }
  setGetScoreCallback(callback) {
    this.getScoreCallback = callback;
  }
  selectCell(cell) {
    if (cell.textContent.trim() === '') return;
    if (this.selectedCells.length < 2 && !this.selectedCells.includes(cell)) {
      this.selectedCells.push(cell);
      cell.classList.add('selected');
      if (this.selectedCells.length === 2) {
        this.checkPair();
      }
    }
  }

  deselectCell(cell) {
    this.selectedCells = this.selectedCells.filter(c => c !== cell);
    cell.classList.remove('selected');
  }

  clearSelection() {
    this.selectedCells.forEach(c => c.classList.remove('selected'));
    this.selectedCells = [];
  }

  reindexCells() {
    const cells = Array.from(document.querySelectorAll('.cell'));
    cells.forEach((cell, idx) => {
      cell.dataset.index = idx;
    });
  }

  buildGrid() {

    this.reindexCells();

    const totalCells = Array.from(document.querySelectorAll('.cell'));
    const grid = [];
    const rows = Math.ceil(totalCells.length / this.gridWidth);
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < this.gridWidth; c++) {
        const idx = r * this.gridWidth + c;
        grid[r][c] = idx < totalCells.length ? totalCells[idx].textContent.trim() : '';
      }
    }
    return grid;
  }

  isBoundaryConnected(grid, row1, col1, row2, col2) {
    const topRow = Math.min(row1, row2);
    const bottomRow = Math.max(row1, row2);
    const topCol = (topRow === row1) ? col1 : col2;
    const bottomCol = (bottomRow === row2) ? col2 : col1;

    let topIsLast = true;
    for (let c = topCol + 1; c < grid[topRow].length; c++) {
      if (grid[topRow][c] !== '') {
        topIsLast = false;
        break;
      }
    }

    let bottomIsFirst = true;
    for (let c = 0; c < bottomCol; c++) {
      if (grid[bottomRow][c] !== '') {
        bottomIsFirst = false;
        break;
      }
    }

    if (!topIsLast || !bottomIsFirst) {
      return false;
    }

    for (let r = topRow + 1; r < bottomRow; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] !== '') {
          return false;
        }
      }
    }
    return true;
  }

  cellNeighborhood(cell1, cell2) {
    const index1 = parseInt(cell1.dataset.index, 10);
    const index2 = parseInt(cell2.dataset.index, 10);

    const row1 = Math.floor(index1 / this.gridWidth);
    const col1 = index1 % this.gridWidth;
    const row2 = Math.floor(index2 / this.gridWidth);
    const col2 = index2 % this.gridWidth;

    if ((row1 === row2 && Math.abs(col1 - col2) === 1) ||
        (col1 === col2 && Math.abs(row1 - row2) === 1)) {
      return true;
    }

    if (row1 === row2) {
      const start = Math.min(col1, col2) + 1;
      const end = Math.max(col1, col2);
      for (let c = start; c < end; c++) {
        const betweenIndex = row1 * this.gridWidth + c;
        const betweenCell = document.querySelector(`[data-index='${betweenIndex}']`);
        if (betweenCell && betweenCell.textContent.trim() !== '') return false;
      }
      return true;
    }

    if (col1 === col2) {
      const start = Math.min(row1, row2) + 1;
      const end = Math.max(row1, row2);
      for (let r = start; r < end; r++) {
        const betweenIndex = r * this.gridWidth + col1;
        const betweenCell = document.querySelector(`[data-index='${betweenIndex}']`);
        if (betweenCell && betweenCell.textContent.trim() !== '') return false;
      }
      return true;
    }

    const grid = this.buildGrid();
    if (this.isBoundaryConnected(grid, row1, col1, row2, col2)) {
      return true;
    }

    return false;
  }

  checkPair() {
    const [cell1, cell2] = this.selectedCells;

    if (!this.cellNeighborhood(cell1, cell2)) {
      this.soundEffects.playFailure();
      setTimeout(() => this.clearSelection(), 300);
      return;
    }

    const number1 = parseInt(cell1.textContent, 10);
    const number2 = parseInt(cell2.textContent, 10);

    if (isNaN(number1) || isNaN(number2)) {
      this.soundEffects.playFailure();
      setTimeout(() => this.clearSelection(), 300);
      return;
    }

    let isValidPair = false;
    let points = 0;
    if (number1 === number2) {
      isValidPair = true;
      points = number1 === 5 ? 3 : 1;
    } else if (number1 + number2 === 10) {
      isValidPair = true;
      points = 2;
    }

    console.log('Pair validation:', { isValidPair, points });

    if (isValidPair) {
      this.soundEffects.playSuccess();
       if (this.revertLogic && this.getScoreCallback) {
        const gridContainer = cell1.parentElement;
        const currentScore = this.getScoreCallback();
        this.revertLogic.saveState(gridContainer, currentScore);
      }
      this.clearSelection();
      cell1.textContent = '';
      cell2.textContent = '';
      cell1.classList.remove('selected');
      cell2.classList.remove('selected');
      this.reindexCells();
      if (typeof this.onPairMatched === 'function') {
        this.onPairMatched(points);
      }
      this.emitPairDeletedEvent();
    } else {
      this.soundEffects.playFailure();
      console.log('Invalid number pair');
      setTimeout(() => this.clearSelection(), 300);
    }
  }
  emitPairDeletedEvent() {
    const event = new CustomEvent('pairDeleted');
    document.dispatchEvent(event);
  }
}
