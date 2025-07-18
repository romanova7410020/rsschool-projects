
/*
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
*/
const container = document.querySelector('.explore_image');
document.querySelector('.explore_slider').addEventListener('input', (e) => {
  container.style.setProperty('--position', `${e.target.value}%`);
})


document.querySelectorAll('.progress, .progress_volume').forEach(slider => {
  slider.addEventListener('input', function() {
    const value = this.value;
    this.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #C4C4C4 ${value}%, white 100%)`;
  });
});

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('firstvideo');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const muteBtn = document.getElementById('muteBtn');
    const progressBarVolume = document.getElementById('progressBarvolume');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    // Инициализация иконок
    updatePlayPauseIcon();
    updateMuteIcon();
    
    // Play/Pause
    playPauseBtn.addEventListener('click', togglePlayPause);
    video.addEventListener('click', togglePlayPause);
    
    function togglePlayPause() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
        updatePlayPauseIcon();
    }
    
    function updatePlayPauseIcon() {
        if (video.paused) {
            playPauseBtn.innerHTML = '<svg width="23" height="31" viewBox="0 0 24 24" fill="#808080"><path d="M8 5v14l11-7z"/></svg>';
        } else {
            playPauseBtn.innerHTML = '<svg width="23" height="31" viewBox="0 0 24 24" fill="#808080"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        }
    }
    
    // Прогрессбар
    video.addEventListener('loadedmetadata', function() {
        progressBar.max = video.duration;
    });
    
   video.addEventListener('timeupdate', function() {
    if (!isNaN(video.duration)) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        progressBar.style.setProperty('--progress', `${progressPercent}%`);
        progressBar.value = video.currentTime;
    }
});
    
    progressBar.addEventListener('input', function() {
        video.currentTime = progressBar.value;
    });
    
    // Громкость
    muteBtn.addEventListener('click', toggleMute);
    
    function toggleMute() {
        video.muted = !video.muted;
        updateMuteIcon();
    }
    
    function updateMuteIcon() {
        if (video.muted) {
            muteBtn.innerHTML = '<svg width="38" height="31" viewBox="0 0 24 24" fill="#808080"><path d="M16.5 12c0-1.77-1-3.29-2.5-4v8c1.5-.71 2.5-2.24 2.5-4zM19 8l-4 4h1l4 4z"/></svg>';
        } else {
            muteBtn.innerHTML = '<svg width="38" height="31" viewBox="0 0 24 24" fill="#808080"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1-3.29-2.5-4v8c1.5-.71 2.5-2.24 2.5-4zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4-.92 7-4.49 7-8.77s-3-7.85-7-8.77z"/></svg>';
        }
    }
    
    progressBarVolume.addEventListener('input', function() {
        video.volume = progressBarVolume.value / 100;
        video.muted = false;
        updateMuteIcon();
    });
    
    // Полноэкранный режим
    fullscreenBtn.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            video.requestFullscreen().catch(err => {
                console.error('Ошибка:', err);
            });
        } else {
            document.exitFullscreen();
        }
    });
    
    // Инициализация громкости
    video.volume = progressBarVolume.value / 100;
});



//бкргер-меню

document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.querySelector('.burger_button');
    const navigation = document.querySelector('.header_navigation');
    const welcomeColumn = document.querySelector('.welcome_column');
    const navLinks = document.querySelectorAll('.nav_link');
    
    function toggleMenu() {
        const isActive = burgerBtn.classList.toggle('active');
        navigation.classList.toggle('active');
        
        // Управление скроллом и welcome_column
        document.body.style.overflow = isActive ? 'hidden' : '';
        welcomeColumn.style.display = isActive ? 'none' : 'block';
    }
    
    burgerBtn.addEventListener('click', toggleMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            burgerBtn.classList.remove('active');
            navigation.classList.remove('active');
            document.body.style.overflow = '';
            welcomeColumn.style.display = 'block';
        });
    });
});

//перемешивание фото
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery_content');
    const images = Array.from(gallery.children);

    // Перемешиваем (если нужно)
    images.sort(() => Math.random() - 0.5);
    gallery.innerHTML = '';
    images.forEach(img => gallery.appendChild(img));

    // Поднимаем 6, 7, 8, 9, 10 фото (по новому порядку)
    const photosToLift = [5, 6, 7, 8, 9]; // Индексы 6-10 фото (нумерация с 0)
    photosToLift.forEach(index => {
        if (images[index]) {
            images[index].classList.add('lift-up');
        }
    });
});





