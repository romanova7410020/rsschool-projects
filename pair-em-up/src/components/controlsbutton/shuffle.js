export class ShuffleLogic {
  constructor() {
    this.shuffleRemaining = 5;
    this.maxShuffles = 5;
  }

  shuffle(gridContainer) {
    if (this.shuffleRemaining <= 0) {
      return {success: false};
    }

  const cells = Array.from(gridContainer.querySelectorAll('.cell'));
  if (cells.length === 0) {
    return {success: false};
  }
  const nonEmptyCells = [];
  cells.forEach((cell) => {
    const text = cell.textContent.trim();
    if(text !== '') {
      nonEmptyCells.push({
        element: cell,
        text: text,
      });
    }
  });
  if (nonEmptyCells.length === 0) {
    return {success: false};
  }
  const shuffledText = this.shuffleArray(nonEmptyCells.map(c => c.text));
  nonEmptyCells.forEach((cell, i) => {
    cell.element.textContent = shuffledText[i];
  });
   this.reindexAllCells(gridContainer);
   this.shuffleRemaining--;
   return {
      success: true,
      remaining: this.shuffleRemaining,
      cellsShuffled: nonEmptyCells.length
    };
  }

    shuffleArray(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  reindexAllCells(gridContainer) {
    const allCells = Array.from(gridContainer.querySelectorAll('.cell'));
    allCells.forEach((cell, index) => {
      cell.dataset.index = index;
    });
  }

  canUseShuffle() {
    return this.shuffleRemaining > 0;
  }

  reset() {
    this.shuffleRemaining = this.maxShuffles;
  }

  getShuffleRemaining() {
    return this.shuffleRemaining;
  }
}
