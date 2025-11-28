export class AddNumbersLogic {
  constructor(gridWidth = 9, pairSelector) {
    this.addNumberRemain = 10;
    this.maxAddNumbers = 10;
    this.gridWidth = gridWidth;
    this.maxRows = 50;
    this.pairSelector = pairSelector;
  }

  addNumbers(gridContainer, mode = 'classic') {
    if (this.addNumberRemain <= 0) {
      return { success: false };
    }

    const cells = Array.from(gridContainer.querySelectorAll('.cell'));
    const currentCellCount = cells.length;

    const maxTotalCells = this.maxRows * this.gridWidth;
    if (currentCellCount >= maxTotalCells) {
      return { success: false };
    }

    let digitsToAdd = [];

    if (mode === 'classic' || mode === 'random') {
      const nonEmptyDigits = [];
      cells.forEach(cell => {
        const text = cell.textContent.trim();
        if (text !== '') {
          nonEmptyDigits.push(text);
        }
      });

      if (nonEmptyDigits.length === 0) {
        return { success: false };
      }

      digitsToAdd = [...nonEmptyDigits];
      if (mode === 'random') {
        digitsToAdd = this.shuffleArray(digitsToAdd);
      }
    }
    else if (mode === 'chaotic') {
      const nonEmptyDigits = [];
      cells.forEach(cell => {
        const text = cell.textContent.trim();
        if (text !== '') {
          nonEmptyDigits.push(text);
        }
      });

      const countToAdd = nonEmptyDigits.length;
      for (let i = 0; i < countToAdd; i++) {
        const randomNum = Math.floor(Math.random() * 9) + 1;
        digitsToAdd.push(randomNum.toString());
      }
      digitsToAdd = this.shuffleArray(digitsToAdd);
    }

    if (digitsToAdd.length === 0) {
      return { success: false };
    }
    let cellsAdd = 0;
    digitsToAdd.forEach(digit => {
      if (currentCellCount + cellsAdd >= maxTotalCells) {
        return;
      }

      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = digit;
      cell.dataset.index = currentCellCount + cellsAdd;
      gridContainer.appendChild(cell);
      this.attachCellListener(cell);
      cellsAdd++;
    });

    if (cellsAdd === 0) {
      return { success: false };
    }

    this.reindexAllCells(gridContainer);
    this.addNumberRemain--;

    return {
      success: true,
      remaining: this.addNumberRemain,
      cellsAdded: cellsAdd
    };
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  attachCellListener(cell) {
    cell.addEventListener('click', () => {
      if (this.pairSelector.selectedCells.includes(cell)) {
        this.pairSelector.deselectCell(cell);
      } else {
        this.pairSelector.selectCell(cell);
      }
    });
  }

  reindexAllCells(gridContainer) {
    const allCells = Array.from(gridContainer.querySelectorAll('.cell'));
    allCells.forEach((cell, index) => {
      cell.dataset.index = index;
    });
  }

  canUseAddNumbers() {
    return this.addNumberRemain > 0;
  }

  reset() {
    this.addNumberRemain = this.maxAddNumbers;
  }

  getAddNumbersRemaining() {
    return this.addNumberRemain;
  }
}