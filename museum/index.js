//карта

document.addEventListener('DOMContentLoaded', function () {
    
    const map = L.map('map').setView([48.86091, 2.3364], 17);  

   
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([48.86091, 2.3364]).addTo(map).bindPopup('marker1');
    L.marker([48.8602, 2.3333]).addTo(map).bindPopup('marker2');
    L.marker([48.8607, 2.3397]).addTo(map).bindPopup('marker2');
    L.marker([48.8619, 2.3330]).addTo(map).bindPopup('marker2');
    L.marker([48.8625, 2.3365]).addTo(map).bindPopup('marker2');
  });

//галерея
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery_content');
    const images = Array.from(gallery.children);

    images.sort(() => Math.random() - 0.5);

    gallery.innerHTML = '';
    images.forEach(img => gallery.appendChild(img));

    // lift-up для средней колонки
    const photosToLift = [5, 6, 7, 8, 9];
    photosToLift.forEach(index => {
        if (images[index]) {
            images[index].classList.add('lift-up');
        }
    });
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.15 });

    images.forEach((img, i) => {
        img.style.transitionDelay = (i * 0.07) + 's';
        observer.observe(img);
    });
});


//слайдер welcome
document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper', {
    loop: true,
    speed: 300,
    navigation: {
      nextEl: '.right_arrow',
      prevEl: '.left_arrow',
    },
  });

  const bullets = document.querySelectorAll('.swiper-pagination_bullet');
  const currentSlideElem = document.querySelector('.current_slide');
  const totalSlidesElem = document.querySelector('.total-slides');

  const slidesCount = document.querySelectorAll('.swiper-slide').length;
  totalSlidesElem.textContent = slidesCount < 10 ? '0' + slidesCount : slidesCount;

  function updateCustomPagination() {
    const realIndex = swiper.realIndex;
    bullets.forEach((bullet, idx) => {
      bullet.classList.toggle('active', idx === realIndex);
    });
    let num = realIndex + 1;
    currentSlideElem.textContent = num < 10 ? '0' + num : num;
  }

  swiper.on('slideChange', updateCustomPagination);

  bullets.forEach((bullet, idx) => {
    bullet.addEventListener('click', () => swiper.slideToLoop(idx));
  });
  updateCustomPagination();
  
});


//слайдер в эксплоэре
const container = document.querySelector('.explore_image');
document.querySelector('.explore_slider').addEventListener('input', (e) => {
  container.style.setProperty('--position', `${e.target.value}%`);
})
//видео биг
 document.addEventListener('DOMContentLoaded', function() {
            const video = document.getElementById('firstvideo');
            const playPauseBtn = document.getElementById('playPauseBtn');
            const progressBar = document.getElementById('progressBar');
            const muteBtn = document.getElementById('muteBtn');
            const progressBarVolume = document.getElementById('progressBarvolume');
            const fullscreenBtn = document.getElementById('fullscreenBtn');
            const bigPlayBtn = document.getElementById('playpauseBTnig');

            //прогресс бар красный
            function setProgressBarBackground(input, value, max) {
                const percent = max ? (value / max) * 100 : 0;
                input.style.background = 
                  `linear-gradient(to right, #710707 0%, #710707 ${percent}%, #C4C4C4 ${percent}%, #C4C4C4 100%)`;
            }
            function showBigPlay(show) {
                bigPlayBtn.style.display = show ? 'block' : 'none';
            }

            // запуск=
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

            // перемотка видео
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
            

            // громкость
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

            // большой экран
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



//синхронизация цен на главной и в попе
const prices = {
  permanent: { basic: 20, senior: 10 },
  temporary: { basic: 25, senior: 12.5 },
  combined: { basic: 40, senior: 20 }
};

const ticketTypeRadios = document.querySelectorAll('input[name="ticket_type"]');
const quantityWrappers = document.querySelectorAll('.amount_option .quantity_wrapper');
const basicQtyInput = quantityWrappers[0].querySelector('input.quantity_value');
const seniorQtyInput = quantityWrappers[1].querySelector('input.quantity_value');
const totalEl = document.querySelector('.amount_total');

const popupSelect = document.getElementById('popup_select');
const basicCountElem = document.getElementById('basic-count');
const seniorCountElem = document.getElementById('senior-count');

const selectedExhibitionElem = document.getElementById('selected-exhibition');
const overviewTickets = document.querySelector('.overview-tickets');
const overviewTotalElem = document.querySelector('.overview-total .total-bold');

function saveToStorage(type, basicQty, seniorQty) {
  localStorage.setItem('ticket_type', type);
  localStorage.setItem('basic_qty', basicQty);
  localStorage.setItem('senior_qty', seniorQty);
}

function loadFromStorage() {
  const storedType = localStorage.getItem('ticket_type');
  const storedBasic = localStorage.getItem('basic_qty');
  const storedSenior = localStorage.getItem('senior_qty');

  if (storedType && Array.from(ticketTypeRadios).some(r => r.value === storedType)) {
    ticketTypeRadios.forEach(radio => {
      radio.checked = radio.value === storedType;
    });
    if (popupSelect) popupSelect.value = storedType;
  }

  if (storedBasic !== null && !isNaN(parseInt(storedBasic))) {
    basicQtyInput.value = clamp(parseInt(storedBasic), 0, 10);
    if (basicCountElem) basicCountElem.textContent = basicQtyInput.value;
  }

  if (storedSenior !== null && !isNaN(parseInt(storedSenior))) {
    seniorQtyInput.value = clamp(parseInt(storedSenior), 0, 10);
    if (seniorCountElem) seniorCountElem.textContent = seniorQtyInput.value;
  }
}

function clamp(value, min, max) {
  if (isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function updateTotal() {
  const selectedType = document.querySelector('input[name="ticket_type"]:checked')?.value;
  if (!selectedType) return;

  const basicQty = clamp(parseInt(basicQtyInput.value), 0, 10);
  const seniorQty = clamp(parseInt(seniorQtyInput.value), 0, 10);

  const priceBasic = prices[selectedType].basic;
  const priceSenior = prices[selectedType].senior;

  const total = basicQty * priceBasic + seniorQty * priceSenior;
  totalEl.innerHTML = `Total <span class="euro">€</span>${total.toFixed(2)}`;

  saveToStorage(selectedType, basicQty, seniorQty);

  syncQuantitiesToPopup();
  syncTypeFromMainToPopup();
  updateDisplayPopup();
}

function syncQuantitiesToPopup() {
  basicCountElem.textContent = basicQtyInput.value;
  seniorCountElem.textContent = seniorQtyInput.value;
}

function syncTypeFromMainToPopup() {
  const selectedType = document.querySelector('input[name="ticket_type"]:checked')?.value;
  if (selectedType) {
    popupSelect.value = selectedType;
  }
}

function getPricesPopup() {
  const type = popupSelect.value;
  const basicPrice = prices[type]?.basic || 0;
  const seniorPrice = prices[type]?.senior || 0;
  return { basicPrice, seniorPrice, type };
}

function updateDisplayPopup() {
  const { basicPrice, seniorPrice, type } = getPricesPopup();

  const basicTicketRow = document.querySelector('.ticket-row:nth-child(1)');
  const seniorTicketRow = document.querySelector('.ticket-row:nth-child(2)');
  if (basicTicketRow) {
    const textNode = Array.from(basicTicketRow.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = `Basic 18+ (${basicPrice} €) `;
  }
  if (seniorTicketRow) {
    const textNode = Array.from(seniorTicketRow.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
    if (textNode) textNode.textContent = `Senior 65+ (${seniorPrice} €) `;
  }

  const basicCount = clamp(parseInt(basicCountElem.textContent), 0, 10);
  const seniorCount = clamp(parseInt(seniorCountElem.textContent), 0, 10);

  const basicSum = basicPrice * basicCount;
  const seniorSum = seniorPrice * seniorCount;
  const total = basicSum + seniorSum;

  overviewTickets.innerHTML = `
    <div class="ticket-cont">
      <div>
        <span class="ticket-count">${basicCount}</span> Basic (${basicPrice} €)
      </div>
      <div>${basicSum.toFixed(2)} €</div>
    </div>
    <div class="ticket-cont">
      <div>
        <span class="ticket-count">${seniorCount}</span> Senior (${seniorPrice} €)
      </div>
      <div>${seniorSum.toFixed(2)} €</div>
    </div>
  `;

  if (overviewTotalElem) {
    overviewTotalElem.textContent = `${total.toFixed(2)} €`;
  }

  if (selectedExhibitionElem) {
    const selectedOption = popupSelect.selectedOptions[0]?.textContent.trim() || '';
    selectedExhibitionElem.textContent = selectedOption;
  }

  saveToStorage(type, basicCount, seniorCount);
  updateMainUIFromStorage();
}

function changeCountPopup(countElem, delta) {
  let count = clamp(parseInt(countElem.textContent) || 0, 0, 10);
  count += delta;
  count = clamp(count, 0, 10);
  countElem.textContent = count;
  updateDisplayPopup();
}

function updateMainUIFromStorage() {
  const storedType = localStorage.getItem('ticket_type');
  const storedBasic = localStorage.getItem('basic_qty');
  const storedSenior = localStorage.getItem('senior_qty');

  if (storedType) {
    ticketTypeRadios.forEach(r => {
      r.checked = r.value === storedType;
    });
  }
  if (storedBasic !== null && !isNaN(parseInt(storedBasic))) {
    basicQtyInput.value = clamp(parseInt(storedBasic), 0, 10);
  }
  if (storedSenior !== null && !isNaN(parseInt(storedSenior))) {
    seniorQtyInput.value = clamp(parseInt(storedSenior), 0, 10);
  }

  updateTotal();
}

function updateRadioFromSelect() {
  const val = popupSelect.value;
  ticketTypeRadios.forEach(radio => {
    radio.checked = radio.value === val;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  updateTotal();
  updateDisplayPopup();
});

ticketTypeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    saveToStorage(radio.value, basicQtyInput.value, seniorQtyInput.value);
    syncTypeFromMainToPopup();
    updateTotal();
    updateDisplayPopup();
  });
});


function setupQuantityControls(wrapper, onChange) {
  const minusBtn = wrapper.querySelector('button.minus');
  const plusBtn = wrapper.querySelector('button.plus');
  const input = wrapper.querySelector('input.quantity_value');

  minusBtn.addEventListener('click', () => {
    let val = clamp(parseInt(input.value) - 1, parseInt(input.min), parseInt(input.max));
    input.value = val;
    onChange();
  });
  plusBtn.addEventListener('click', () => {
    let val = clamp(parseInt(input.value) + 1, parseInt(input.min), parseInt(input.max));
    input.value = val;
    onChange();
  });
  input.addEventListener('input', () => {
    let val = clamp(parseInt(input.value), parseInt(input.min), parseInt(input.max));
    input.value = val;
    onChange();
  });
}
setupQuantityControls(quantityWrappers[0], () => {
  updateTotal();
  syncQuantitiesToPopup();
  updateDisplayPopup();
});
setupQuantityControls(quantityWrappers[1], () => {
  updateTotal();
  syncQuantitiesToPopup();
  updateDisplayPopup();
});

document.querySelectorAll('.ticket-wrap .ticket-row').forEach(row => {
  const minusBtn = row.querySelector('button.minus');
  const plusBtn = row.querySelector('button.plus');
  const countElem = row.querySelector('.count');

  minusBtn?.addEventListener('click', () => {
    changeCountPopup(countElem, -1);
  });
  plusBtn?.addEventListener('click', () => {
    changeCountPopup(countElem, 1);
  });
});

popupSelect.addEventListener('change', () => {
  updateRadioFromSelect();
  updateDisplayPopup();
});


function openPopup() {
  document.getElementById('popup-overlay').classList.add('show');
  document.getElementById('popup').classList.add('show');

  document.body.style.overflow = 'hidden';

  loadFromStorage();
  syncQuantitiesToPopup();
  updateSelectFromRadio();
  updateDisplayPopup();
}
function closePopup() {
  document.getElementById('popup-overlay').classList.remove('show');
  document.getElementById('popup').classList.remove('show');

  document.body.style.overflow = '';
}
function updateSelectFromRadio() {
  ticketTypeRadios.forEach(radio => {
    if (radio.checked) {
      popupSelect.value = radio.value;
    }
  });
}

document.querySelectorAll('.buy_now_btn').forEach(btn => {
  btn.addEventListener('click', openPopup);
});
document.getElementById('popup-overlay').addEventListener('click', closePopup);
document.getElementById('popup-close').addEventListener('click', closePopup);
//календарь
const dateInput = document.getElementById('date-input');
const selectedDateSpan = document.getElementById('selected-date');

function pad(num) {
  return num < 10 ? '0' + num : num;
}

function formatDateToYYYYMMDD(date) {
  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
}

function formatDateToReadable(date) {
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

const today = new Date();
const minDateStr = formatDateToYYYYMMDD(today);
dateInput.setAttribute('min', minDateStr);

dateInput.addEventListener('change', () => {
  const selectedDateValue = dateInput.value; 
  if (!selectedDateValue) return;

  const parts = selectedDateValue.split('-');
  const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);

  selectedDateSpan.textContent = formatDateToReadable(dateObj);
});

dateInput.value = minDateStr;
selectedDateSpan.textContent = formatDateToReadable(today);

//время
const timeDisplay = document.getElementById('time-display');
const timeOptions = document.getElementById('time-options');
const selectedTime = document.getElementById('selected-time');
const timeSelector = document.querySelector('.time-selector');

function generateTimeOptions() {
    const options = [];
    for (let hour = 9; hour <= 18; hour++) {
    options.push(`${hour.toString().padStart(2, '0')}:00`);
    
    if (hour < 18) {
     options.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    }
    return options;
}

const timeSlots = generateTimeOptions();
timeSlots.forEach(time => {
 const option = document.createElement('div');
option.className = 'time-option';
 option.textContent = time;
option.addEventListener('click', () => {
    timeDisplay.value = time;
    selectedTime.textContent = time;
    timeSelector.classList.remove('active');
});
    timeOptions.appendChild(option);
});
 timeDisplay.addEventListener('click', () => {
 timeSelector.classList.toggle('active');
});
document.addEventListener('click', (e) => {
 if (!timeSelector.contains(e.target)) {
timeSelector.classList.remove('active');
}
});


//валидации
const form = document.getElementById('booking-form');

  const usernameInput = document.getElementById('username');
  const usernameError = document.getElementById('username-error');

  const emailInput = document.getElementById('email');
  const emailError = document.getElementById('email-error');

  const phoneInput = document.getElementById('phone');
  const phoneError = document.getElementById('phone-error');

  
  function validateUserName(name) {
    if (name.length < 3 || name.length > 15) return false;
    const regex = /^[a-zA-Zа-яА-ЯёЁ ]+$/;
    return regex.test(name);
  }

 
  const emailRegex = /^[a-zA-Z0-9_-]{3,15}@[a-zA-Z]{4,}\.[a-zA-Z]{2,}$/;
  function validateEmail(email) {
    return emailRegex.test(email);
  }

  function validatePhone(phone) {
    const digitsOnly = phone.replace(/[\s-]/g, '');
    if (!/^\d+$/.test(digitsOnly)) return false;      
    if (digitsOnly.length > 10) return false;        

    const groups = phone.split(/[\s-]+/);
    if (groups.some(g => g.length < 2 || g.length > 3)) return false;

    return true;
  }

  usernameInput.addEventListener('input', () => {
    const name = usernameInput.value.trim();
    if (validateUserName(name)) {
      usernameError.textContent = '';
      usernameError.style.display = 'none';
      usernameInput.setCustomValidity('');
      usernameInput.classList.remove('invalid');
    } else {
      usernameError.textContent = 'Имя должно содержать от 3 до 15 символов, только буквы и пробелы.';
      usernameError.style.display = 'block';
      usernameInput.setCustomValidity('Неверный формат имени');
      usernameInput.classList.add('invalid');
    }
  });

  emailInput.addEventListener('input', () => {
    const emailValue = emailInput.value.trim();
    if (validateEmail(emailValue)) {
      emailError.textContent = '';
      emailError.style.display = 'none';
      emailInput.setCustomValidity('');
      emailInput.classList.remove('invalid');
    } else {
      emailError.textContent = 'Введите корректный email в формате: username@example.com';
      emailError.style.display = 'block';
      emailInput.setCustomValidity('Неверный формат email');
      emailInput.classList.add('invalid');
    }
  });

  phoneInput.addEventListener('input', () => {
    const phoneValue = phoneInput.value.trim();
    if (validatePhone(phoneValue)) {
      phoneError.textContent = '';
      phoneError.style.display = 'none';
      phoneInput.setCustomValidity('');
      phoneInput.classList.remove('invalid');
    } else {
      phoneError.textContent = 'Номер должен содержать только цифры, разделённые пробелами или дефисами на группы по 2-3 цифры, всего не более 10 цифр.';
      phoneError.style.display = 'block';
      phoneInput.setCustomValidity('Неверный формат номера телефона');
      phoneInput.classList.add('invalid');
    }
  });

  form.addEventListener('submit', (e) => {
    const name = usernameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const phoneValue = phoneInput.value.trim();

    let valid = true;

    if (!validateUserName(name)) {
      usernameError.textContent = 'Имя должно содержать от 3 до 15 символов, только буквы и пробелы.';
      usernameError.style.display = 'block';
      usernameInput.setCustomValidity('Неверный формат имени');
      valid = false;
    } else {
      usernameError.textContent = '';
      usernameError.style.display = 'none';
      usernameInput.setCustomValidity('');
    }

    if (!validateEmail(emailValue)) {
      emailError.textContent = 'Введите корректный email в формате: username@example.com';
      emailError.style.display = 'block';
      emailInput.setCustomValidity('Неверный формат email');
      valid = false;
    } else {
      emailError.textContent = '';
      emailError.style.display = 'none';
      emailInput.setCustomValidity('');
    }

    if (!validatePhone(phoneValue)) {
      phoneError.textContent = 'Номер должен содержать только цифры, разделённые пробелами или дефисами на группы по 2–3 цифры, всего не более 10 цифр.';
      phoneError.style.display = 'block';
      phoneInput.setCustomValidity('Неверный формат номера телефона');
      valid = false;
    } else {
      phoneError.textContent = '';
      phoneError.style.display = 'none';
      phoneInput.setCustomValidity('');
    }

    if (!valid) {
      e.preventDefault();
      if (!validateUserName(name)) {
        usernameInput.focus();
      } else if (!validateEmail(emailValue)) {
        emailInput.focus();
      } else if (!validatePhone(phoneValue)) {
        phoneInput.focus();
      }
    }
  });


//картва
ymaps.ready(init);
  function init() {
    var myMap = new ymaps.Map('map', {
      center: [48.86091, 2.3364],
      zoom: 16
    });

    var places = [
      { name: 'marker1', coords: [48.86091, 2.3364] },
      { name: 'marker2', coords: [48.8602, 2.3333] },
      { name: 'marker3', coords: [48.8607, 2.3397] }
    ];

    places.forEach(function(place) {
      var placemark = new ymaps.Placemark(place.coords, {
        balloonContent: place.name
      });
      myMap.geoObjects.add(placemark);
    });
  }