import './styles/styles.scss';


import StartScreen from '@/screens/startScreen';
import ClassicModeScreen from '@/screens/classicMode';
import ChaoticModeScreen from '@/screens/chaoticMode';
import RandomModeScreen from '@/screens/randomMode';
import ResultScreen from '@/screens/result';
import SettingScreen from '@/screens/setting';

const root = document.createElement('div');
document.body.appendChild(root);

function switchScreen(screenName) {
  if (screenName === 'start') {
    const startScreen = new StartScreen(root,  switchScreen)
    startScreen.render();
  } else if (screenName === 'classic') {
    const classicModeScreen = new ClassicModeScreen(root,  switchScreen)
    classicModeScreen.render();
  } else if (screenName === 'random') {
    const randomModeScreen = new RandomModeScreen(root,  switchScreen)
    randomModeScreen.render();
  } else if (screenName === 'chaotic') {
    const chaoticModeScreen = new ChaoticModeScreen(root,  switchScreen)
    chaoticModeScreen.render();
  } else if (screenName === 'setting') {
    const settingScreen = new SettingScreen(root,  switchScreen)
    settingScreen.render();
  } else if (screenName === 'result') {
    const resultScreen = new ResultScreen(root,  switchScreen)
    resultScreen.render();
  }
}
switchScreen('start');