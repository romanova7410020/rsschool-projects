
export class HintsLogic {
  constructor(pairSelector) {
    this.hintsRemaining = 5;
    this.maxHints = 5;
    this.pairSelector = pairSelector;
  }

  findValidPairs(gridContainer) {
    const cells = Array.from(gridContainer.querySelectorAll('.cell'));
    const validPairs = [];

    for (let i = 0; i < cells.length; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const cell1 = cells[i];
        const cell2 = cells[j];

        if (cell1.textContent.trim() === '' || cell2.textContent.trim() === '') {
          continue;
        }
        if (!this.pairSelector.cellNeighborhood(cell1, cell2)) {
          continue;
        }

        const number1 = parseInt(cell1.textContent, 10);
        const number2 = parseInt(cell2.textContent, 10);

        if (isNaN(number1) || isNaN(number2)) {
          continue;
        }
        let isValidPair = false;
        let points = 0;
        if (number1 === number2) {
          isValidPair = true;
          points = number1 === 5 ? 3 : 1;
        }

        else if (number1 + number2 === 10) {
          isValidPair = true;
          points = 2;
        }
        if (isValidPair) {
          validPairs.push({
            cell1,
            cell2,
            number1,
            number2,
            points,
            type: number1 === number2 ? 'matching' : 'sum10'
          });
        }
      }
    }

    return validPairs;
  }

  useHint(gridContainer) {
    if (this.hintsRemaining <= 0) {
      return { success: false };
    }

    const validPairs = this.findValidPairs(gridContainer);

    if (validPairs.length === 0) {
      return { success: false };
    }

    const randomPair = validPairs[Math.floor(Math.random() * validPairs.length)];

    this.highlightPair(randomPair.cell1, randomPair.cell2);

    this.hintsRemaining--;

    return {
      success: true,
      remaining: this.hintsRemaining,
      pair: randomPair
    };
  }

  highlightPair(cell1, cell2) {
    cell1.classList.add('hint-highlight');
    cell2.classList.add('hint-highlight');

    setTimeout(() => {
      cell1.classList.remove('hint-highlight');
      cell2.classList.remove('hint-highlight');
    }, 2000);
  }

  canUseHint() {
    return this.hintsRemaining > 0;
  }

  reset() {
    this.hintsRemaining = this.maxHints;
  }

  getHintsRemaining() {
    return this.hintsRemaining;
  }
  setMaxHints(count) {
    this.maxHints = count;
    this.hintsRemaining = count;
  }
}
