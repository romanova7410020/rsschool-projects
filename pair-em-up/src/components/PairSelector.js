export default class PairSelector {
  constructor() {
    this.selectedCells = [];
  }

  selectCell(cell) {
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
}