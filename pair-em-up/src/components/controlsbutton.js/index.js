import createResetButton from './Reset';
import createSaveButton from './save';
import createContinueButton from './continue';
import createRevertButton from './revert';
import createAddNumbersButton from './addnumbers';
import createHintsButton from './hints';
import createShuffleButton from './shuffle';
import createEraserButton from './eraser';

export function createControlPanel(container, callbacks) {
  const panel = document.createElement('div');
  panel.classList.add('control-panel');

  const resetButton = createResetButton(callbacks.onReset);
  const saveButton = createSaveButton(callbacks.onSave);
  const continueButton = createContinueButton(callbacks.onContinue);
  const revertButton = createRevertButton(callbacks.onRevert);
  const addNumbersButton = createAddNumbersButton(callbacks.onAddNumbers);
  const hintsButton = createHintsButton(callbacks.onHints);
  const shuffleButton = createShuffleButton(callbacks.onShuffle);
  const EraserButton = createEraserButton(callbacks.onEraser);

  panel.append(resetButton, saveButton, continueButton, revertButton, addNumbersButton, hintsButton, shuffleButton, EraserButton);
  container.appendChild(panel);
  return panel;
}