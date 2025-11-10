import './styles/styles.scss';


import StartScreen from '@/screens/startScreen';
import ClassicModeScreen from '@/screens/classicMode';
import ChaoticModeScreen from '@/screens/chaoticMode';
import RandomModeScreen from '@/screens/randomMode';
import ResultScreen from '@/screens/result';
import SettingScreen from '@/screens/setting';

 import logoSrc from './assets/logo-leaves.png';

const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');
document.body.appendChild(wrapper);

const header = document.createElement('header');
header.classList.add('header');
wrapper.appendChild(header);

const nav = document.createElement('nav');
nav.classList.add('navigation');
header.appendChild(nav);

const logoImg = document.createElement('img');
    logoImg.src = logoSrc;
    logoImg.alt = 'Pair em Up Logo';
    logoImg.classList.add('logo-image');
    logoImg.style.cursor = 'pointer';
    logoImg.onclick = (e) => {
      e.preventDefault();
      switchScreen('start');
    };
    nav.appendChild(logoImg);

    const ul = document.createElement('ul');
    nav.appendChild(ul);

    const liSettings = document.createElement('li');
    const linkSettings = document.createElement('a');
    linkSettings.textContent = 'Setting';
    linkSettings.href = '#';
    linkSettings.classList.add('setting-link','glass-card');
    linkSettings.onclick = (e) => {
      e.preventDefault();
      switchScreen('setting');
    };
    liSettings.appendChild(linkSettings);

    const liResults = document.createElement('li');
    const linkResults = document.createElement('a');
    linkResults.textContent = 'Result';
    linkResults.href = '#';
    linkResults.classList.add('result-link', 'glass-card');
    linkResults.onclick = (e) => {
      e.preventDefault();
      switchScreen('result');
    };
    liResults.appendChild(linkResults);
    ul.append(liSettings, liResults);

    const main = document.createElement('main');
    main.classList.add('main');
    wrapper.appendChild(main);

    const footer = document.createElement('footer');
    footer.classList.add('footer');
    wrapper.appendChild(footer);

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


function switchScreen(screenName) {
  if (screenName === 'start') {
    const startScreen = new StartScreen(main,  switchScreen)
    startScreen.render();
  } else if (screenName === 'classic') {
    const classicModeScreen = new ClassicModeScreen(main,  switchScreen)
    classicModeScreen.render();
  } else if (screenName === 'random') {
    const randomModeScreen = new RandomModeScreen(main,  switchScreen)
    randomModeScreen.render();
  } else if (screenName === 'chaotic') {
    const chaoticModeScreen = new ChaoticModeScreen(main,  switchScreen)
    chaoticModeScreen.render();
  } else if (screenName === 'setting') {
    const settingScreen = new SettingScreen(main,  switchScreen)
    settingScreen.render();
  } else if (screenName === 'result') {
    const resultScreen = new ResultScreen(main,  switchScreen)
    resultScreen.render();
  }
}
switchScreen('start');