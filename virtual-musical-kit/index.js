const bodyElement = document.body;
bodyElement.classList.add('body');


function createElement(options) {
  const { tag = 'div', text = '', parent, classes = [] } = options;
  const element = document.createElement(tag);
  element.textContent = text;
  if (classes.length > 0) {
    element.classList.add(...classes);
  }
  if (parent !== null) {
    parent.appendChild(element);
  }
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
keyWhiteClasses.forEach(className => {
  createElement({
    tag: 'div',
    classes: ['keyWhite', className],
    parent: mainElement,
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