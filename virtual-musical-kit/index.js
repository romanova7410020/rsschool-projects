const bodyElement = document.body;
bodyElement.classList.add('body');


function createElement(options) {
  const { tag = 'div', text = '', parent, classes = [], children = [] } = options;
  const element = document.createElement(tag);
  element.textContent = text;

  if (classes.length > 0) {
    element.classList.add(...classes);
  }
  if (parent !== null) {
    parent.appendChild(element);
  }
  children.forEach (childOptions => {
    createElement ({
      ...childOptions,
      parent: element
    });
  });
  return element;
}

const headerElement = createElement ({
  tag: 'h1',
  text: 'Virtual Child Piano',
  parent: bodyElement,
});

const mainElement = createElement({
  tag: 'div',
  classes: ['piano'],
  parent: bodyElement,
})

const keyWhiteClasses = ['key_A', 'key_S', 'key_D', 'key_F', 'key_G', 'key_H', 'key_J', 'key_K', 'key_L', 'key_M',];
const keyLabels = {
  key_A: 'A',
  key_S: 'S',
  key_D: 'D',
  key_F: 'F',
  key_G: 'G',
  key_H: 'H',
  key_J: 'J',
  key_K: 'K',
  key_L: 'L',
  key_M: 'M',
};

const soundMap = {};
keyWhiteClasses.forEach(className => {
  const note = keyLabels[className];
  soundMap[className] = new Audio (`sounds/${note}.mp3`);

 const keyDiv = createElement({
    tag: 'div',
    classes: ['keyWhite', className],
    parent: mainElement,
  });

  const labelWrapper = createElement({
    tag: 'div',
    classes: ['label-wrapper'],
    parent: keyDiv,
  });

  const label = createElement({
    tag: 'span',
    text: keyLabels[className],
    parent: labelWrapper,
  });

 const keyButton = createElement({
    tag: 'button',
    classes: ['edit-button'],
    parent: labelWrapper,
  });

  const input = createElement({
    tag: 'input',
    classes: ['key-input'],
    parent: keyDiv,
  });
  input.style.display = 'none';

  keyButton.addEventListener('click', () => {
    label.style.display = 'none';
    keyButton.style.display = 'none';
    input.style.display ='inline-block';
    input.value =label.textContent;
     input.focus();
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      label.textContent = input.value.toUpperCase();
      input.style.display = 'none';
      label.style.display = 'inline-block';
      keyButton.style.display = 'inline-block';
    }
  });

  input.addEventListener('blur', () => {
  input.style.display = 'none';
  label.style.display = 'inline-block';
  keyButton.style.display = 'inline-block';
});
  keyDiv.addEventListener('click', () => {
    const sound =soundMap[className];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      sound.play();
    }
    const pastelColors = [
    '#FFD1DC', '#FFB347', '#B0E0E6', '#B4EEB4', '#E6E6FA',
    '#FFDAB9', '#FDFD96', '#CAE1FF', '#FF6961', '#CFCFC4'
  ];
   const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
   keyDiv.style.background = randomColor;

   keyDiv.addEventListener('mouseleave', () =>{
    keyDiv.style.background = 'white';
    sound.pause();
  });
  });
});
const keyBlackClasses = ['key_W','key_E', 'key_R', 'key_Y', 'key_U', 'key_I', 'key_O']
keyBlackClasses.forEach(className => {
  createElement({
    tag: 'div',
    classes: ['keyBlack', className],
    parent: mainElement,
  });
});

