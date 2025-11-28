export class RevertLogic {
  constructor() {
    this.history = [];
    this.canRevert = false;
  }

  saveState(gridContainer, score) {
    const cells = Array.from(gridContainer.querySelectorAll('.cell'));
    const state = {
      cells: cells.map(cell => ({
        text: cell.textContent,
        index: cell.dataset.index
      })),
      score: score,
      timestamp: Date.now()
    };

    this.history = [state];
    this.canRevert = true;

    return { success: true };
  }

  revert(gridContainer, updateScoreCallback) {
    if (!this.canRevert || this.history.length === 0) {
      return { success: false,};
    }

    const lastState = this.history[0];
    gridContainer.innerHTML = '';

    lastState.cells.forEach(cellData => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = cellData.text;
      cell.dataset.index = cellData.index;
      gridContainer.appendChild(cell);
    });

    if (updateScoreCallback) {
      updateScoreCallback(lastState.score);
    }
    this.history = [];
    this.canRevert = false;

    return {
      success: true,
      restoredScore: lastState.score
    };
  }

  clearHistory() {
    this.history = [];
    this.canRevert = false;
  }

  canUseRevert() {
    return this.canRevert;
  }

  reset() {
    this.history = [];
    this.canRevert = false;
  }
}