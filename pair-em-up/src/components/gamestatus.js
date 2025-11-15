export class GameStatusChecker {
  constructor(pairSelector, targetScore = 100, maxRows = 50) {
    this.pairSelector = pairSelector;
    this.targetScore = targetScore;
    this.maxRows = maxRows;
  }

  checkWin(currentScore) {
    return currentScore >= this.targetScore;
  }

  checkLose(gridContainer, assists) {
    if (this.hasReachedMaxRows(gridContainer)) {
      return { isLose: true, reason: 'Reached maximum 50 rows' };
    }

    if (this.noValidMovesLeft(gridContainer) && this.allAssistsUsed(assists)) {
      return { isLose: true, reason: 'No valid moves and all assists used' };
    }

    return { isLose: false };
  }

  hasReachedMaxRows(gridContainer) {
    const cells = Array.from(gridContainer.querySelectorAll('.cell'));
    const rowCount = Math.ceil(cells.length / this.pairSelector.gridWidth);
    return rowCount >= this.maxRows;
  }

  noValidMovesLeft(gridContainer) {
    const cells = Array.from(gridContainer.querySelectorAll('.cell'));
    const nonEmptyCells = cells.filter(cell => cell.textContent.trim() !== '');

    for (let i = 0; i < nonEmptyCells.length; i++) {
      for (let j = i + 1; j < nonEmptyCells.length; j++) {
        const num1 = parseInt(nonEmptyCells[i].textContent, 10);
        const num2 = parseInt(nonEmptyCells[j].textContent, 10);

        const isValidPair = (num1 === num2) || (num1 + num2 === 10);
        if (isValidPair &&
            this.pairSelector.cellNeighborhood(nonEmptyCells[i], nonEmptyCells[j])) {
          return false;
        }
      }
    }

    return true;
  }

  allAssistsUsed(assists) {
    return assists.hints <= 0 &&
           assists.addNumbers <= 0 &&
           assists.shuffle <= 0 &&
           assists.eraser <= 0;
  }

  checkGameStatus(currentScore, gridContainer, assists) {
    if (this.checkWin(currentScore)) {
      return {
        status: 'win',
        message: `Congratulations! You reached ${currentScore} points!`
      };
    }

    const loseCheck = this.checkLose(gridContainer, assists);
    if (loseCheck.isLose) {
      return {
        status: 'lose',
        message: `Game Over! ${loseCheck.reason}`
      };
    }

    return { status: 'playing', message: 'Game in progress' };
  }
}