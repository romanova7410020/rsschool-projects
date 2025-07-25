
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

 document.addEventListener('DOMContentLoaded', function() {
            const video = document.getElementById('firstvideo');
            const playPauseBtn = document.getElementById('playPauseBtn');
            const progressBar = document.getElementById('progressBar');
            const muteBtn = document.getElementById('muteBtn');
            const progressBarVolume = document.getElementById('progressBarvolume');
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            const bigPlayBtn = document.getElementById('playpauseBTnig');

            // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
            
            function setProgressBarBackground(input, value, max) {
                const percent = max ? (value / max) * 100 : 0;
                input.style.background = 
                  `linear-gradient(to right, #710707 0%, #710707 ${percent}%, #C4C4C4 ${percent}%, #C4C4C4 100%)`;
            }
            function showBigPlay(show) {
                bigPlayBtn.style.display = show ? 'block' : 'none';
            }

            // === ПЛЕЙ/ПАУЗА ===
            function togglePlayPause() {
                if (video.paused || video.ended) {
                    video.play();
                } else {
                    video.pause();
                }
                updatePlayPauseIcon();
            }
            playPauseBtn.addEventListener('click', togglePlayPause);
            video.addEventListener('click', togglePlayPause);

            bigPlayBtn.addEventListener('click', function() {
                video.play();
            });

            video.addEventListener('play', function() {
                showBigPlay(false);
                updatePlayPauseIcon();
            });
            video.addEventListener('pause', function() {
                showBigPlay(true);
                updatePlayPauseIcon();
            });
            video.addEventListener('ended', function() {
                showBigPlay(true);
                updatePlayPauseIcon();
            });

            function updatePlayPauseIcon() {
                if (video.paused || video.ended) {
                    playPauseBtn.innerHTML = '<img src="./assets/svg/play.svg" alt="Play" width="23" height="31">';;
                } else {
                    playPauseBtn.innerHTML = '<img src="./assets/svg/pause.svg" alt="Pause" width="23" height="31">';;
                }
            }

            // === ПРОГРЕССБАР ===
            video.addEventListener('loadedmetadata', function() {
                progressBar.max = video.duration;
                setProgressBarBackground(progressBar, 0, video.duration);
            });
            video.addEventListener('timeupdate', function() {
                if (!isNaN(video.duration)) {
                    progressBar.value = video.currentTime;
                    setProgressBarBackground(progressBar, video.currentTime, video.duration);
                }
            });
            progressBar.addEventListener('input', function() {
                video.currentTime = progressBar.value;
                setProgressBarBackground(progressBar, progressBar.value, progressBar.max);
            });
            

            // === ГРОМКОСТЬ И MUTE ===
            muteBtn.addEventListener('click', toggleMute);
            progressBarVolume.addEventListener('input', function() {
                video.volume = progressBarVolume.value / 100;
                if (video.volume > 0) {
                    video.muted = false;
                }
                updateMuteIcon();
                setProgressBarBackground(progressBarVolume, progressBarVolume.value, 100);
            });
            function toggleMute() {
                video.muted = !video.muted;
                // Если muted, установить volume ползунок в 0 для визуального совпадения (не обязательно)
                if (video.muted) {
                    setProgressBarBackground(progressBarVolume, 0, 100);
                } else {
                    setProgressBarBackground(progressBarVolume, video.volume * 100, 100);
                }
                updateMuteIcon();
            }
            function updateMuteIcon() {
    if (video.muted || video.volume === 0) {
        muteBtn.innerHTML = '<img src="./assets/svg/mute.svg" alt="mute" width="36" height="30">';
    } else {
        muteBtn.innerHTML = '<img src="./assets/svg/volume.svg" alt="volume" width="36" height="30">';
    }
}

            // === ПОЛНОЭКРАННЫЙ РЕЖИМ ===
            fullscreenBtn.addEventListener('click', function() {
                if (!document.fullscreenElement) {
                    if (video.requestFullscreen) {
                        video.requestFullscreen().catch(err => {
                            console.error('Ошибка при входе в полноэкранный режим:', err);
                        });
                    }
                } else {
                    document.exitFullscreen();
                }
            });

            // === ИНИЦИАЛИЗАЦИЯ ===
            video.volume = progressBarVolume.value / 100;
    setProgressBarBackground(progressBarVolume, progressBarVolume.value, 100);
    setProgressBarBackground(progressBar, 0, video.duration || 1);
    updateMuteIcon();
    showBigPlay(video.paused);
    updatePlayPauseIcon();
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








