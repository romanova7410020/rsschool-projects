import { GameSaver } from '@/components/savegame';
export default class StartScreen {
  constructor (rootElement, switchScreenCallback) {
    this.root = rootElement;
    this.switchScreen = switchScreenCallback;
    this.gameSaver = new GameSaver();
  }
  render() {
    this.root.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.classList.add('title');
    h1.textContent = 'Pair em Up';
    this.root.appendChild(h1);

    const cards = document.createElement('div');
    cards.classList.add('cards');
    this.root.appendChild(cards);

    const createCard = (text, screenName) => {
  const card = document.createElement('button');
  card.classList.add('card', 'glass-card');
  card.textContent = text;
  card.onclick = (e) => {
    e.preventDefault();
    this.switchScreen(screenName, { isNewGame: true });
  };
  return card;
};

    const classic = createCard('Classic', 'classic');
    const random = createCard('Random', 'random');
    const chaotic = createCard('Chaotic', 'chaotic');
    cards.append(classic, random, chaotic);

    const linkContinue = document.createElement('button');
    linkContinue.classList.add('continue', 'glass-card');
    this.root.append(linkContinue);
    linkContinue.textContent = 'Continue game';
    this.updateContinueButton(linkContinue);
     document.addEventListener('gameSaved', (e) => {
      this.updateContinueButton(linkContinue);
    });
  }
    updateContinueButton(button) {
    const savedGame = this.gameSaver.loadGame();

    if (!savedGame) {
      button.disabled = true;
      button.style.opacity = '0.5';
      button.style.cursor = 'not-allowed';
      button.onclick = null;
    } else {
      button.disabled = false;
      button.style.opacity = '1';
      button.style.cursor = 'pointer';

      button.onclick = (e) => {
        e.preventDefault();
        this.switchScreen(savedGame.mode, { isContinue: true });
      };
    }
  }
  }