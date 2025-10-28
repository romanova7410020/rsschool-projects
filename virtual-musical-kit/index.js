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
const pastelColors = [
    '#FFD1DC', '#FFB347', '#B0E0E6', '#B4EEB4', '#E6E6FA',
    '#FFDAB9', '#FDFD96', '#CAE1FF', '#FF6961', '#CFCFC4'
];
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

   const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
   keyDiv.style.background = randomColor;

   keyDiv.addEventListener('mouseleave', () =>{
    keyDiv.style.background = 'white';
    sound.pause();
    sound.currentTime = 0;
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

window.addEventListener('keydown', (event) => {
  const pressedKey = event.code;
  if (!pressedKey.startsWith('Key')) return;
  const keyLetter = pressedKey.slice(3);
  const className = 'key_' + keyLetter;

if (keyWhiteClasses.includes(className)) {
    const sound = soundMap[className];
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      sound.play();
    }

    const keyDiv = document.querySelector(`.${className}`);
    if (keyDiv) {
      const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
      keyDiv.style.background = randomColor;
      setTimeout(() => {
        keyDiv.style.background = 'white';
      }, 300);
    }
  }
});

const canvas = document.createElement('canvas');
canvas.classList.add('canvas');
document.body.appendChild(canvas);

const dpr = window.devicePixelRatio || 1;
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
const ctx = canvas.getContext('2d');

const canvasWrap = createElement({
  classes: ['canvas__wrap'],
  tag: 'section',
  parent: canvas,
});

let mouse = {
   x: undefined,
   y: undefined,
}
let maxRadius = 100;
let minRadius = 30;

window.addEventListener('mousemove', function(event) {
  mouse.x = (event.clientX - rect.left) * (canvas.width / rect.width);
  mouse.y = ( event.clientY - rect.top) * (canvas.height / rect.height);
})

function Circle(x, y, dx, dy, radius, type) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.type = type;

  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

     let grad;
    if (this.type === 1) {
      grad = ctx.createRadialGradient(this.x, this.y, 5, this.x, this.y, this.radius);
      grad.addColorStop(0, 'rgb(35, 151, 247)');
      grad.addColorStop(1, 'rgb(248, 208, 30)');
    } else if (this.type === 2) {
      grad = ctx.createRadialGradient(this.x, this.y, 5, this.x, this.y, this.radius);
      grad.addColorStop(0, 'rgb(236, 200, 40)');
      grad.addColorStop(1, 'rgb(50, 149, 230)');
    }

    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = this.type === 1 ? 'rgb(248, 208, 30)' : 'rgb(50, 149, 230)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  this.update = function() {
    if (this.x + this.radius > canvas.width /dpr ||
        this.x - this.radius < 0) {
        this.dx = - this.dx;
  }
  if (this.y + this.radius > canvas.height / dpr ||
      this.y - this.radius < 0) {
      this.dy = - this.dy;
  }
    this.x += this.dx;
    this.y += this.dy;

    if (
  mouse.x - this.x < 50 && mouse.x - this.x > -50 &&
  mouse.y - this.y < 50 && mouse.y - this.y > -50
) {
  if (this.radius < maxRadius) {
    this.radius += 1;
  }
} else {
  if (this.radius > minRadius) {
    this.radius -= 1;
  }
}

    this.draw();
  }

}
let circleArray = [];

for (let i = 0; i < 4; i++) {
  let radius = 30;
  let x = Math.random() * (canvas.width / dpr - radius * 2) + radius;
  let dx = (Math.random() - 0.5) * 8;
  let y = Math.random() * (canvas.height / dpr - radius * 2) + radius;
  let dy = (Math.random() - 0.5) * 8;
  let type = i % 2 === 0 ? 1 : 2;
  circleArray.push(new Circle(x, y, dx,dy,radius, type));
}




function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,canvas.width, canvas.height);


  for( let i = 0; i < circleArray.length; i++) {
    circleArray[i].update();
  }

}

animate();




