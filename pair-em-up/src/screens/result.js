export default class ResultScreen {
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