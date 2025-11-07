export default class StartScreen {
  constructor (rootElement, switchScreenCallback) {
    this.root = rootElement;
    this.switchScreen = switchScreenCallback;
  }
  render() {
    this.root.innerHTML = '';

    const body = document.body;
    body.classList.add('startscreen');

    const container = document.createElement('div');
    container.classList.add('wrapper');
    body.appendChild(container);
    const header = document.createElement('header');
    header.classList.add('header');
    container.appendChild(header);

    const nav = document.createElement('nav');
    nav.classList.add('navigation');
    header.append(nav);

    const logoImg = document.createElement('img');
    logoImg.src = '/logo-leaves (1).png';
    logoImg.alt = 'Pair em Up Logo';
    logoImg.classList.add('logo-image');
    logoImg.href = '#';
    logoImg.onclick = (e) => {
      e.preventDefault();
      switchScreen('start');
    };
    nav.appendChild(logoImg);

    const ul = document.createElement('ul');
    nav.appendChild(ul);

    const liSettings = document.createElement('li');
    const linkSettings = document.createElement('a');
    linkSettings.textContent = 'Settings';
    linkSettings.href = '#';
    linkSettings.classList.add('glass-card');
    linkSettings.onclick = (e) => {
      e.preventDefault();
      switchScreen('settings');
    };
    liSettings.appendChild(linkSettings);

    const liResults = document.createElement('li');
    const linkResults = document.createElement('a');
    linkResults.textContent = 'Results';
    linkResults.href = '#';
    linkResults.classList.add('glass-card');
    linkResults.onclick = (e) => {
      e.preventDefault();
      switchScreen('results');
    };
    liResults.appendChild(linkResults);
    ul.append(liSettings, liResults);


    const h1 = document.createElement('h1');
    h1.classList.add('title');
    h1.textContent = 'Pair em Up';
    container.appendChild(h1);

    const cards = document.createElement('div');
    cards.classList.add('cards');
    container.appendChild(cards);

    const createCard = (text, screenName) => {
    const card = document.createElement('button');
    card.classList.add('card', 'glass-card');
    card.textContent = text;
    card.onclick = (e) => {
      e.preventDefault();
      switchScreen(screenName);
      };
    return card;
    };

    const classic = createCard('Classic', 'classic');
    const random = createCard('Random', 'random');
    const chaotic = createCard('Chaotic', 'chaotic');
    cards.append(classic, random, chaotic);

    const linkContinue = document.createElement('button');
    linkContinue.classList.add('continue', 'glass-card');
    container.append(linkContinue);
    linkContinue.textContent = 'Continue game';
    linkContinue.onclick = (e) => {
      e.preventDefault();
      switchScreen(screenName);
      };

      const footer = document.createElement('footer');
      footer.classList.add('footer');
      container.appendChild(footer);

      const changeButton = document.createElement('button');
      changeButton.classList.add('changeBtn', 'glass-card');
      changeButton.textContent = "Change theme";
      footer.appendChild(changeButton);

      const linkAuthor = document.createElement('a');
      linkAuthor.classList.add('link-github');
      linkAuthor.textContent = 'Romanova Nastassia 2025';
      linkAuthor.href = 'https://github.com/romanova7410020';
      linkAuthor.target = '_blank';
      footer.appendChild(linkAuthor);
  }

}