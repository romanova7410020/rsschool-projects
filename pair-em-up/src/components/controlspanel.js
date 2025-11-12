import Timer from '../components/timer';
import { HintsLogic} from './controlsbutton/hints';
import { AddNumbersLogic } from './controlsbutton/addnumbers';

export function createControlPanel(container, pairSelector) {
  const hintsLogic = new HintsLogic(pairSelector);
  const addNumbersLogic = new AddNumbersLogic(9, pairSelector);
  const Score = document.createElement('h3');
    Score.classList.add('h3');
    Score.textContent = "Score: "

    const scoreSpan = document.createElement('span');
    scoreSpan.id = 'current-score';
    scoreSpan.style.color = '#FFD700';
    scoreSpan.textContent = '0';
    Score.appendChild(scoreSpan);
    container.appendChild(Score);

    const targetScore = document.createElement('h3');
    targetScore.classList.add('h3');
    targetScore.innerHTML = 'Target Score: <span style="color: #FFD700; font-weight: bold;">100</span>';
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
    const counterHint = document.createElement('span');
    counterHint.classList.add('counter');
    counterHint.textContent = hintsLogic.getHintsRemaining().toString();
    hintsButton.appendChild(counterHint);

    const revertButton = document.createElement('button');
    revertButton.classList.add('revert-button');
    revertButton.textContent = "Revert";
    assistButtons.appendChild(revertButton);

    const addNumbers = document.createElement('button');
    addNumbers.classList.add('addNumbers-button');
    addNumbers.textContent = "Add Numbers";
    assistButtons.appendChild(addNumbers);
    const counterAdd = document.createElement('span');
    counterAdd.classList.add('counter');
    counterAdd.textContent =addNumbersLogic.getAddNumbersRemaining().toString();
    addNumbers.appendChild(counterAdd);

    const shuffleButton = document.createElement('button');
    shuffleButton.classList.add('shuffle-button');
    shuffleButton.textContent = "Shuffle";
    assistButtons.appendChild(shuffleButton);
    const counterShuffle = document.createElement('span');
    counterShuffle.classList.add('counter');
    counterShuffle.textContent = "5";
    shuffleButton.appendChild(counterShuffle);

    const eraserButton = document.createElement('button');
    eraserButton.classList.add('eraser-button');
    eraserButton.textContent = "Eraser";
    assistButtons.appendChild(eraserButton);
    const counterEraser = document.createElement('span');
    counterEraser.classList.add('counter');
    counterEraser.textContent = "5";
    eraserButton.appendChild(counterEraser);

    let currentScore = 0;

  return {
  updateScore(points) {
    currentScore += points;
    scoreSpan.textContent = currentScore;
  },
  getScore() {
    return currentScore;
  },
  resetScore() {
    currentScore = 0;
    scoreSpan.textContent = currentScore;
  },
  timer,
  buttons: {
    reset: resetButton,
    save: saveGameButton,
    continue: continueButton,
    hints: hintsButton,
    revert: revertButton,
    addNumbers: addNumbers,
    shuffle: shuffleButton,
    eraser: eraserButton
  },
  counters: {
    hints: counterHint,
    add: counterAdd,
    shuffle: counterShuffle,
    eraser: counterEraser
  },
  hintsLogic,
  pairSelector,
  addNumbersLogic,
};
}