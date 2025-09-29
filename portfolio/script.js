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