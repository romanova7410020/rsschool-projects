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
      parent: element,
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

const keyWhiteClasses = ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'KeyM',];
const keyBlackClasses = ['KeyW','KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI'];
const keyMap = {
  KeyA: 'A',
  KeyS: 'S',
  KeyD: 'D',
  KeyF: 'F',
  KeyG: 'G',
  KeyH: 'H',
  KeyJ: 'J',
  KeyK: 'K',
  KeyL: 'L',
  KeyM: 'M',
  KeyW: 'W',
  KeyE: 'E',
  KeyR: 'R',
  KeyT: 'T',
  KeyY: 'Y',
  KeyU: 'U',
  KeyI: 'I',
};

const pastelColors = [
    '#FFD1DC', '#FFB347', '#B0E0E6', '#B4EEB4', '#E6E6FA',
    '#FFDAB9', '#FDFD96', '#CAE1FF', '#FF6961', '#CFCFC4'
];
const darkPastelColors = [
  '#CC8C8C', '#CC9933', '#7A9B9B', '#739973', '#7A7A9A',
  '#CCAA99', '#CCCC66', '#6699CC', '#CC6666', '#999966'
];
const soundKeyMap = {};
Object.entries(keyMap).forEach(([className, letter]) => {
  soundKeyMap[className] = letter;
});
const reverseKeyMap = {};
Object.entries(keyMap).forEach(([className, letter]) => {
  reverseKeyMap[letter] = className;
});


keyWhiteClasses.forEach(className => {
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
    text: keyMap[className],
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
    const isLetter = e.key.length === 1 && /^[a-zA-Z]$/.test(e.key);
    const controlKey = ['Backspace', 'Enter', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key);
    if (input.value.length >= 1 && isLetter && !controlKey) {
    e.preventDefault();
    return;
  }
    if (!isLetter && !controlKey) {
      e.preventDefault();
    }

    if (e.key === 'Enter') {
      const newLetter = input.value.toUpperCase();
      const isUnique = (() => {
        const upperLetter = newLetter.toUpperCase();
        return !Object.entries(keyMap).filter(([key]) => key !== className)
        .map(([, value]) => value.toUpperCase()).includes(upperLetter);
      }) ();

      if (!isUnique) {
        alert ('Please, choose another unique letter.');
        input.focus();
        input.select();
        return;
      }
      const oldLetter = keyMap[className];
      keyMap[className] = newLetter;
      label.textContent = newLetter;
      delete reverseKeyMap[oldLetter];
      reverseKeyMap[newLetter] = className;

      input.style.display = 'none';
      label.style.display = 'inline-block';
      keyButton.style.display = 'inline-block';
    }
  });
  input.addEventListener('input', e => {
    const filterLetter = e.target.value.replace(/[^a-zA-Z]/g, '');
    if (e.target.value !== filterLetter) {
      e.target.value = filterLetter;
    }
  })

  input.addEventListener('blur', () => {
  input.style.display = 'none';
  label.style.display = 'inline-block';
  keyButton.style.display = 'inline-block';
});
let sound;
  keyDiv.addEventListener('click', () => {
    const soundLetter = soundKeyMap[className];
    if (sound && !sound.paused) {
    sound.pause();
    sound.currentTime = 0;
  }
    sound = new Audio(`sounds/${soundLetter}.mp3`);

    keyDiv.classList.add('active');
   const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
   keyDiv.style.background = randomColor;
   
   sound.play();
   sound.addEventListener('ended', () => {
    keyDiv.classList.remove('active');
    keyDiv.style.background = '';
  });
  });

   keyDiv.addEventListener('mouseleave', () =>{
    if (sound && !sound.paused) {
    sound.pause();
    sound.currentTime = 0;
  }
  keyDiv.classList.remove('active');
  keyDiv.style.background = '';
  });
  });


// black
const keyBlackDivs = [];
keyBlackClasses.forEach(className => {

  const keyBlackDiv = createElement({
    tag: 'div',
    classes: ['keyBlack', className],
    parent: mainElement,
  });
   keyBlackDivs.push(keyBlackDiv); keyBlackDiv.addEventListener('click', () => {
    const soundLetter = soundKeyMap[className];
    const sound = new Audio(`sounds/${soundLetter}.mp3`);
    sound.pause();
    sound.currentTime = 0;
    sound.play();

    const colorIndex = darkPastelColors[Math.floor(Math.random() * darkPastelColors.length)];
    keyBlackDiv.style.background = colorIndex;
  });

  keyBlackDiv.addEventListener('mouseleave', () => {
    keyBlackDiv.style.background = '';
    const soundLetter = soundKeyMap[className];
    const sound = new Audio(`sounds/${soundLetter}.mp3`);
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  });
});



let isActiveKey = false;
window.addEventListener('keydown', (event) => {
  if (isActiveKey) return;
  isActiveKey = true;

    const letter = event.code.replace('Key', '');
    const className = reverseKeyMap[letter];
      if (!className) return;

    const soundLetter = soundKeyMap[className];
      if (soundLetter) {
    const sound = new Audio(`sounds/${soundLetter}.mp3`);
    sound.pause();
    sound.currentTime = 0;
    sound.play();
  }

    const keyDiv = document.querySelector(`.${className}`);
    if (keyDiv) {
      const isWhite = keyWhiteClasses.includes(className);
      const colors = isWhite ? pastelColors : darkPastelColors;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      keyDiv.style.background = randomColor;

      setTimeout(() => {
        keyDiv.style.background = isWhite ? 'white' : '';
      }, 300);
    }
  });

window.addEventListener('keyup', () => {
  isActiveKey = false;
});

//melody
const melody  = createElement ({
  tag: 'section',
  classes: ['melody'],
  parent: bodyElement,
});
const melodytitle  = createElement ({
  tag: 'h3',
  classes: ['melody-title'],
  parent: melody,
  text: 'Enter the key sequence for the melody'
});
const melodyInput = createElement ({
  tag: 'input',
  classes: ['melody-input'],
  parent: melody,
});
const melodyButton  = createElement ({
  tag: 'button',
  classes: ['melody-button'],
  parent: melody,
  text: 'Play',
});
const allowedKeys = Object.values(keyMap);
const maxLength = allowedKeys.length * 2;
function playSoundByLetter(letter){
  const className = reverseKeyMap[letter];
  if (!className) return Promise.resolve();
  return new Promise( resolve => {
    const soundLetter = soundKeyMap[className];
    const sound = new Audio(`sounds/${soundLetter}.mp3`);
    const keyDiv = document.querySelector(`.${className}`);
    let isWhite;
   
    if (keyDiv) {
      isWhite = keyWhiteClasses.includes(className);
      const colors = isWhite ? pastelColors : darkPastelColors;
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      keyDiv.style.background = randomColor;
    } 
    let resolved = false;
    function cleanup() {
      if (resolved) return;
      resolved = true;
      if (keyDiv) {
       keyDiv.style.background = '';
      }
      if (!sound.paused) {
        sound.pause();
        sound.currentTime = 0;
      }
      resolve();
    }
    sound.play();

    sound.addEventListener('ended', cleanup);
    const timeoutId = setTimeout(() => {
      cleanup();
      clearTimeout(timeoutId);
    }, 500);
});
}
melodyInput.maxLength = maxLength;
async function playSequence(sequence) {
  melodyInput.disabled = true;
  melodyButton.disabled = true;
  melodyInput.classList.add('disabled');
  melodyButton.classList.add('disabled');

  for (const letter of sequence) {
    await playSoundByLetter(letter);
    await new Promise(r => setTimeout(r, 100));
  }

  melodyInput.disabled = false;
  melodyButton.disabled = false;
  melodyInput.classList.remove('disabled');
  melodyButton.classList.remove('disabled');
};
melodyButton.addEventListener('click', () => {
  let input = melodyInput.value.toUpperCase();
  const filtered = input.split('').filter((char) => allowedKeys.includes(char));
  if (filtered.length === 0) {
    alert ('Please, enter the key sequence for the melody in English letters only');
    return
  }
  if (filtered.length > maxLength) {
    alert ('Sequence is too long');
    return
  }
  playSequence(filtered);
});
melodyInput.addEventListener('input', e => {
  const filtered = e.target.value.toUpperCase().split('').filter(ch => allowedKeys.includes(ch)).join('');
  if (e.target.value.toUpperCase() !== filtered) {
    e.target.value = filtered;
  }
});


//canvas with circles
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




