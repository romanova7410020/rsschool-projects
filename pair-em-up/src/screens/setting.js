export default class SettingScreen {
  constructor(rootElement, switchScreenCallback) {
    this.root = rootElement;
    this.switchScreen = switchScreenCallback;
  }

  render() {
    this.root.innerHTML = '';

    const container = document.createElement('div');
    container.classList.add('setting-container');

    const title = document.createElement('h2');
    title.textContent = 'Settings';
    container.appendChild(title);

    const soundSection = this.createSoundSection();
    container.appendChild(soundSection);
    this.root.appendChild(container);
  }

  createSoundSection() {
    const section = document.createElement('div');
    section.classList.add('setting-section');

    const title = document.createElement('h3');
    title.textContent = 'Sound Effects';
    section.appendChild(title);

    const soundSettings = this.getSoundSettings();

    const sounds = [
      { key: 'cellSelection', label: 'Cell Selection' },
      { key: 'pairMatching', label: 'Successful Pair Match' },
      { key: 'invalidPair', label: 'Invalid Pair Attempt' },
      { key: 'addNumbers', label: 'Add Numbers' },
      { key: 'shuffle', label: 'Shuffle' },
      { key: 'gameStart', label: 'Game Start' },
      { key: 'gameEnd', label: 'Game End' },
      { key: 'eraser', label: 'Eraser' },
      { key: 'revert', label: 'Revert' },
    ];

    sounds.forEach(({ key, label }) => {
      const div = document.createElement('div');
      div.classList.add('setting-item');

      const toggleLabel = document.createElement('label');
      toggleLabel.classList.add('toggle-switch');

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = soundSettings[key] !== false;
      
      input.addEventListener('change', () => {
        soundSettings[key] = input.checked;
        localStorage.setItem('soundSettings', JSON.stringify(soundSettings));
        document.dispatchEvent(new CustomEvent('soundSettingsChanged', { detail: soundSettings }));
      });

      const span = document.createElement('span');
      span.classList.add('slider');

      toggleLabel.appendChild(input);
      toggleLabel.appendChild(span);

      const labelText = document.createElement('label');
      labelText.classList.add('label-text');
      labelText.textContent = label;

      div.appendChild(toggleLabel);
      div.appendChild(labelText);
      section.appendChild(div);
    });

    return section;
  }

  getSoundSettings() {
    try {
      const saved = localStorage.getItem('soundSettings');
      return saved ? JSON.parse(saved) : {
        cellSelection: true,
        cellDeselection: true,
        pairMatching: true,
        invalidPair: true,
        addNumbers: true,
        shuffle: true,
        gameStart: true,
        gameEnd: true
      };
    } catch {
      return {
        cellSelection: true,
        cellDeselection: true,
        pairMatching: true,
        invalidPair: true,
        addNumbers: true,
        shuffle: true,
        gameStart: true,
        gameEnd: true
      };
    }
  }
}