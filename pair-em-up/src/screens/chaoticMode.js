export default class ChaoticModeScreen {
  constructor(rootElement, switchScreenCallback) {
    this.root = rootElement;
    this.switchScreen = switchScreenCallback;
  }
  render() {
    const main = document.querySelector('main');
  if (main) {
    main.innerHTML = '';
  }
  }
}