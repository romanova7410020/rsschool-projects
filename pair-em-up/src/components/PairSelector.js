export default class PairSelector {
  constructor(onPairMatchedCallback, gridWidth) {
    this.selectedCells = [];
    this.onPairMatched = onPairMatchedCallback;
    this.gridWidth = gridWidth;
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

  buildGrid() {
    const totalCells = document.querySelectorAll('.cell');
    const grid = [];
    const rows = Math.ceil(totalCells.length / this.gridWidth);
    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < this.gridWidth; c++) {
        const index = r * this.gridWidth + c;
        grid[r][c] = index < totalCells.length ? totalCells[index].textContent.trim() : '';
      }
    }
    return grid;
  }

  isPathAvailable(grid, start, end) {
    const rows = grid.length;
    const cols = this.gridWidth;
    const queue = [start];
    const visited = new Set([`${start[0]},${start[1]}`]);

    while (queue.length > 0) {
      const [r, c] = queue.shift();
      if (r === end[0] && c === end[1]) return true;
      const neighbors = [
        [r, c + 1],
        [r, c - 1],
        [r + 1, c],
        [r - 1, c],
      ];
      if (c === cols - 1 && r + 1 < rows) {
        neighbors.push([r + 1, 0]);
      }
      if (c === 0 && r - 1 >= 0) {
        neighbors.push([r - 1, cols - 1]);
      }

      for (const [nr, nc] of neighbors) {
        const key = `${nr},${nc}`;
        if (visited.has(key)) continue;

        const isSpecialTransition =
          (c === cols - 1 && nc === 0 && nr === r + 1) ||
          (c === 0 && nc === cols - 1 && nr === r - 1);
        if (!isSpecialTransition) {
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        }

        if (grid[nr] && grid[nr][nc] !== undefined) {
          if (grid[nr][nc] === '' || (nr === end[0] && nc === end[1])) {
            queue.push([nr, nc]);
            visited.add(key);
          }
        }
      }
    }
    return false;
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

    if ((col1 === this.gridWidth - 1 && col2 === 0 && row2 === row1 + 1) ||
        (col2 === this.gridWidth - 1 && col1 === 0 && row1 === row2 + 1)) {
      return true;
    }

    const grid = this.buildGrid();
    return this.isPathAvailable(grid, [row1, col1], [row2, col2]);
  }

  checkPair() {
    const [cell1, cell2] = this.selectedCells;

    if (!this.cellNeighborhood(cell1, cell2)) {
      console.log('Cells are not connected');
      setTimeout(() => this.clearSelection(), 300);
      return;
    }

    const number1 = parseInt(cell1.textContent, 10);
    const number2 = parseInt(cell2.textContent, 10);

    if (isNaN(number1) || isNaN(number2)) {
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
      this.clearSelection();
      cell1.textContent = '';
      cell2.textContent = '';
      cell1.classList.remove('selected');
      cell2.classList.remove('selected');
      if (typeof this.onPairMatched === 'function') {
        this.onPairMatched(points);
      }
    } else {
      console.log('Invalid number pair');
      setTimeout(() => this.clearSelection(), 300);
    }
  }
}