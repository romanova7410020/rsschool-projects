import Timer from '../components/timer';

class ClassicMode {
  constructor(container) {
    this.container = container;
    this.currentNumber = 1;
  }

  clearGrid() {
    this.container.innerHTML = '';
  }

  createCell(number) {
    const digits = number.toString().split('');
    digits.forEach(digit => {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = digit;
      this.container.appendChild(cell);
    });
  }

  renderGrid() {
    this.clearGrid();

    let totalCell = 0;
    const MaxCells = 27;
    while (totalCell < MaxCells) {
      if (this.currentNumber === 10) {
        this.currentNumber++;
        continue;
      }
      const digits = this.currentNumber.toString().split('');
      if (totalCell + digits.length > MaxCells) {
        break;
      }
      this.createCell(this.currentNumber);
      if (this.currentNumber === 19) {
        break;
      }
      this.currentNumber++;
      totalCell += digits.length;
    }
  }
}

export default class ClassicModeScreen {
  constructor(rootElement, switchScreenCallback) {
    this.root = rootElement;
    this.switchScreen = switchScreenCallback;
  }
  render() {
    const main = document.querySelector('main');
  if (main) {
    main.innerHTML = '';
  }
    const container = document.querySelector('.wrapper');

    const h2 = document.createElement('h2');
    h2.classList.add('h2');
    h2.textContent = 'Classic Mode';
    container.appendChild(h2);

    const gridContainer = document.createElement('div');
    gridContainer.classList.add('gridcontainer');
    container.appendChild(gridContainer);

    this.classicGrid = new ClassicMode(gridContainer);
    this.classicGrid.renderGrid();

    const Score = document.createElement('h3');
    Score.classList.add('h3');
    Score.textContent = "Score: "

    const span = document.createElement('span');
    span.id = 'current-score';
    span.textContent = '0';
    Score.appendChild(span);
    container.appendChild(Score);

    const targetScore = document.createElement('h3');
    targetScore.classList.add('h3');
    targetScore.textContent = "Target Score: 100 "
    container.appendChild(targetScore);

    const timerContainer = document.createElement('div');
    timerContainer.id = 'timer';
    timerContainer.textContent = '00:00';
    container.appendChild(timerContainer);

    const timer = new Timer(timerContainer);

    const controlsButton = document.createElement('div');
    controlsButton.classList.add('contols-buttons');
    container.appendChild(controlsButton);

    const resetButton = document.createElement('button');
    resetButton.classList.add('reset-button');
    resetButton.textContent = "Reset";
    controlsButton.appendChild(resetButton);

    const saveGameButton = document.createElement('button');
    saveGameButton.classList.add('saveGame-button');
    saveGameButton.textContent = "Save Game"
    controlsButton.appendChild(saveGameButton);
    
    const continueButton = document.createElement('button');
    continueButton.classList.add('continue-button');
    continueButton.textContent = "Continue Game";
    controlsButton.appendChild(continueButton);

    const assistTitle = document.createElement('h4');
    assistTitle.classList.add('assist-title');
    assistTitle.textContent = "Assist Buttons";
    container.appendChild(assistTitle);

    const assistButtons = document.createElement('div');
    assistButtons.classList.add('assist-buttons');
    container.appendChild(assistButtons);


    const hintsButton = document.createElement('button');
    hintsButton.classList.add('hints-button');
    hintsButton.textContent = "Hints";
    assistButtons.appendChild(hintsButton);

    const revetButton = document.createElement('button');
    revetButton.classList.add('revert-button');
    revetButton.textContent = "Revert";
    assistButtons.appendChild(revetButton);

    const addNumbers = document.createElement('button');
    addNumbers.classList.add('addNumbers-button');
    addNumbers.textContent = "Add Numbers";
    assistButtons.appendChild(addNumbers);

    const shuffleButton = document.createElement('button');
    shuffleButton.classList.add('shuffle-button');
    shuffleButton.textContent = "Shuffle";
    assistButtons.appendChild(shuffleButton);

    const eraserButton = document.createElement('button');
    eraserButton.classList.add('eraser-button');
    eraserButton.textContent = "Eraser";
    assistButtons.appendChild(eraserButton);
  }

}