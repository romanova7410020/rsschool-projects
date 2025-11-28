const burgerMenu = document.querySelector(".burger");
const navigation = document.querySelector('.navigation');
const body = document.body;
const menuLinks = document.querySelectorAll('.navigation a');

if (burgerMenu) {
  burgerMenu.addEventListener('click', function(e){
    burgerMenu.classList.toggle('_active');
    if (navigation) {
      navigation.classList.toggle('navigation_active');
    }
    body.classList.toggle('body-block');
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      burgerMenu.classList.remove('_active');
      navigation.classList.remove('navigation_active');
      body.classList.remove('body-block');
    });
  });
}

const bookButton = document.querySelectorAll('.book-button');
const popup = document.querySelector('.popup');
const closeButton = document.querySelector('.close-button');
const bodyBlock = document.body;

document.addEventListener('keydown', function(event) {
console.log(event.code);
if(event.code === 'Escape'){
popup.classList.toggle('hidden')
}
});



bookButton.forEach(button => {
button.addEventListener('click', () => {
  popup.classList.toggle('hidden')
   bodyBlock.classList.add('body-block')
});
});

closeButton.addEventListener('click', () =>{
  popup.classList.toggle('hidden')
  bodyBlock.classList.remove('body-block')
});

popup.addEventListener('click', (event) => {
if (event.target.classList.contains('popup')) {
  popup.classList.toggle('hidden')
  bodyBlock.classList.remove('body-block')
}
});

window.addEventListener('load', () =>{
  const slider = document.querySelector('.gallery-slider');
  const leftScroll = document.querySelector('.left-scroll');
  const rightScroll = document.querySelector('.right-scroll');

  const visibleWidth = slider.clientWidth;
  const totalWidth = slider.scrollWidth;

  const centerScrollPosition = (totalWidth / 2) -(visibleWidth / 2);
  slider.scrollLeft = centerScrollPosition;


  let scrollInterval = null;
  const scrollSpeed = 8;

  function startScroll(direction){
    if(scrollInterval) return;
    scrollInterval = requestAnimationFrame(function scrollStep(){
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      let newScrollleft = slider.scrollLeft + direction * scrollSpeed;
      if (newScrollleft < 0) newScrollleft = 0;
      if(newScrollleft > maxScrollLeft) newScrollleft = maxScrollLeft;

      slider.scrollLeft = newScrollleft;
      if(newScrollleft === 0 || newScrollleft === maxScrollLeft){
        stopScroll();
        return;
      }
      scrollInterval = requestAnimationFrame(scrollStep);
    });
  }
function stopScroll(){
  if (scrollInterval) {
    cancelAnimationFrame(scrollInterval);
    scrollInterval = null;
  }
}
rightScroll.addEventListener('mouseenter',() => startScroll(-1));
rightScroll.addEventListener('mouseleave', stopScroll);
leftScroll.addEventListener('mouseenter', () => startScroll(1));
leftScroll.addEventListener('mouseleave', stopScroll);


let isTouchg = false;
let startX = 0;
let scrollStart = 0;

slider.addEventListener('touchstart', (e) => {
isTouchg = true;
startX = e.touches[0].pageX;
scrollStart = slider.scrollLeft;
});

slider.addEventListener('touchmove', (e) => {
  if (!isTouchg) return;

  const currentX = e.touches[0].pageX;
  const deltaX = startX - currentX;

  slider.scrollLeft = scrollStart + deltaX;
  e.preventDefault();

});
slider.addEventListener('touchend', () => {
isTouchg = false
});
});


const storageKey = 'accordeonStatus';

function saveAccordeonStatus() {
  const accordeonItems = document.getElementsByName('accordeon-group');
  const status ={};

  Array.from(accordeonItems).forEach(item => {
    status[item.id] = item.open;
  })
sessionStorage.setItem(storageKey, JSON.stringify(status));
};

function restoreAccordionStatus() {
  const saveStatus = sessionStorage.getItem(storageKey);
  if (saveStatus) {
    const status = JSON.parse(saveStatus);

    Object.keys(status).forEach(itemId => {
      const element =document.getElementById(itemId);

      if (element)
        element.open = status[itemId];
      });
      }  else {
        const firstAccordeon = document.getElementById('accordeon-item1');
        if (firstAccordeon)
            firstAccordeon.open = true;
         saveAccordeonStatus();
      }
    }

document.addEventListener('DOMContentLoaded', function(){
  restoreAccordionStatus();

const accordeonItems = document.getElementsByName('accordeon-group');
 Array.from(accordeonItems).forEach(item => {
  item.addEventListener('toggle', saveAccordeonStatus);

  window.addEventListener('beforeunload', saveAccordeonStatus)
})
});
