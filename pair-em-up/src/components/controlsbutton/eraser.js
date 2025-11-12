export class EraserLogic {
  constructor() {
    this.eraserRemaining = 5;
    this.maxErasers = 5;
    this.isEraserMode = false;
  }
  activateEraser(gridContainer) {
    if (this.eraserRemaining <= 0) {
      return {success: false};
    }
    this.isEraserMode = !this.isEraserMode;
    if (this.isEraserMode) {
      this.addEraserListeners(gridContainer);
      return {
        success: true,
        message: 'Click a cell to erase',
        isActive: true,
      };
    } else {
      this.removeEraserListeners(gridContainer);
      return {
        success: true,
        isActive: false,
      };
    }
  }
   addEraserListeners(gridContainer) {
    const cells = Array.from(gridContainer.querySelectorAll('.cell'));

    cells.forEach(cell => {
      cell.classList.add('eraser-mode');
      const eraserClickHandler = (e) => {
        if (this.isEraserMode) {
          e.stopPropagation();
          this.eraseCell(cell, gridContainer);
        }
      };

      cell._eraserHandler = eraserClickHandler;
      cell.addEventListener('click', eraserClickHandler);
    });
  }

   removeEraserListeners(gridContainer) {
    const cells = Array.from(gridContainer.querySelectorAll('.cell'));
    cells.forEach(cell => {
      cell.classList.remove('eraser-mode');
    });
  }

  eraseCell(cell, gridContainer) {
    if (cell.textContent.trim() === '') {
      return { success: false};
    }

    cell.textContent = '';

    this.reindexAllCells(gridContainer);
    this.eraserRemaining--;

    this.isEraserMode = false;
    this.removeEraserListeners(gridContainer);

    return {
      success: true,
      remaining: this.eraserRemaining,
    };
  }

  reindexAllCells(gridContainer) {
    const allCells = Array.from(gridContainer.querySelectorAll('.cell'));
    allCells.forEach((cell, index) => {
      cell.dataset.index = index;
    });
  }

  canUseEraser() {
    return this.eraserRemaining > 0;
  }

  reset() {
    this.eraserRemaining = this.maxErasers;
    this.isEraserMode = false;
  }

  getEraserRemaining() {
    return this.eraserRemaining;
  }

  isActive() {
    return this.isEraserMode;
  }
}