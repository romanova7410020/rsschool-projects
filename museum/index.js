

const swiper = new Swiper('.swiper', {
  // Автоматически считает количество слайдов
  loop: false, // Отключаем бесконечный цикл, чтобы нумерация была точной

  // Настройки пагинации
  pagination: {
    el: '.swiper_pagination',
    clickable: true, // Можно кликать по точкам для переключения
    dynamicBullets: false, // Отключаем динамическое изменение размера точек
  },
});

const swiper = new Swiper('.swiper', {
  // ... остальные настройки
  on: {
    init: function () {
      updatePagination(this);
    },
    slideChange: function () {
      updatePagination(this);
    },
  },
});

function updatePagination(swiper) {
  const current = swiper.realIndex + 1;
  const total = swiper.slides.length;
  
  document.querySelector('.current-slide').textContent = current;
  document.querySelector('.total-slides').textContent = total;
}
