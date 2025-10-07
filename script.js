const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Индексы для каждого участника
let leftIndices = [0, 1, 2];
let rightIndices = [0, 1, 2];

// Функция для загрузки логотипа
function loadLogo() {
    const logoElement = document.querySelector('.logo-image');
    if (logoElement && imageConfig.logo) {
        logoElement.src = imageConfig.logo;
        logoElement.onload = function() {
            logoElement.style.opacity = '1';
        };
        logoElement.onerror = function() {
            logoElement.style.display = 'none';
        };
    }
}

// Функция смены изображения с анимацией
function changeImage(imageElement, newSrc) {
    if (!imageElement) return;
    
    imageElement.classList.add('image-changing');
    imageElement.src = newSrc;
    
    imageElement.onload = function() {
        setTimeout(() => {
            imageElement.classList.remove('image-changing');
        }, 300);
    };
    
    imageElement.onerror = function() {
        imageElement.alt = 'Изображение не загружено';
        setTimeout(() => {
            imageElement.classList.remove('image-changing');
        }, 300);
    };
}

// Функция обновления конкретного изображения
function updateSingleImage(team, layerIndex) {
    const imageId = `${team}-image-${layerIndex + 1}`;
    const imageElement = document.getElementById(imageId);
    
    if (!imageElement) return;
    
    const array = team === 'left' ? imageConfig.runners : imageConfig.skiers;
    const indices = team === 'left' ? leftIndices : rightIndices;
    const currentIndex = indices[layerIndex];
    
    if (array[currentIndex]) {
        changeImage(imageElement, array[currentIndex]);
    }
}

// Инициализация изображений
function loadInitialImages() {
    for (let i = 0; i < 3; i++) {
        const leftImage = document.getElementById(`left-image-${i + 1}`);
        const rightImage = document.getElementById(`right-image-${i + 1}`);
        
        if (leftImage && imageConfig.runners[leftIndices[i]]) {
            leftImage.src = imageConfig.runners[leftIndices[i]];
        }
        
        if (rightImage && imageConfig.skiers[rightIndices[i]]) {
            rightImage.src = imageConfig.skiers[rightIndices[i]];
        }
    }
    loadLogo();
}

// Создание обработчиков для кнопок
function setupEventListeners() {
    for (let i = 0; i < 3; i++) {
        const prevBtn = document.getElementById(`left-prev-${i + 1}`);
        const nextBtn = document.getElementById(`left-next-${i + 1}`);
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                leftIndices[i] = (leftIndices[i] - 1 + imageConfig.runners.length) % imageConfig.runners.length;
                updateSingleImage('left', i);
            });
            
            nextBtn.addEventListener('click', () => {
                leftIndices[i] = (leftIndices[i] + 1) % imageConfig.runners.length;
                updateSingleImage('left', i);
            });
        }
    }
    
    for (let i = 0; i < 3; i++) {
        const prevBtn = document.getElementById(`right-prev-${i + 1}`);
        const nextBtn = document.getElementById(`right-next-${i + 1}`);
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                rightIndices[i] = (rightIndices[i] - 1 + imageConfig.skiers.length) % imageConfig.skiers.length;
                updateSingleImage('right', i);
            });
            
            nextBtn.addEventListener('click', () => {
                rightIndices[i] = (rightIndices[i] + 1) % imageConfig.skiers.length;
                updateSingleImage('right', i);
            });
        }
    }
}

// Функция для создания и отображения плаката
function createAndSharePoster() {
    const screenshotArea = document.getElementById('screenshot-area');
    const shareButton = document.getElementById('create-poster');
    
    if (!screenshotArea) return;
    
    const originalText = shareButton.textContent;
    shareButton.textContent = '📸 Создаём плакат...';
    shareButton.disabled = true;

    html2canvas(screenshotArea, {
        backgroundColor: '#000000',
        scale: 0.8,
        useCORS: true,
        allowTaint: false,
        logging: false
    }).then(canvas => {
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Создаем временную ссылку для скачивания
        const link = document.createElement('a');
        link.download = 'турнирный-плакат-бегуны-против-лыжников.jpg';
        link.href = imageDataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Восстанавливаем кнопку
        shareButton.textContent = originalText;
        shareButton.disabled = false;
        
        // Показываем уведомление
        alert('Плакат готов! Он сохранен в вашу галерею. Теперь вы можете отправить его друзьям.');
        
    }).catch(error => {
        console.error('Ошибка создания плаката:', error);
        shareButton.textContent = originalText;
        shareButton.disabled = false;
        alert('Не удалось создать плакат. Пожалуйста, попробуйте еще раз.');
    });
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadInitialImages();
    
    const shareButton = document.getElementById('create-poster');
    if (shareButton) {
        shareButton.addEventListener('click', createAndSharePoster);
    }
});

   // === НАЧАЛО: ПРИМЕР ИСПОЛЬЗОВАНИЯ ЗАМЕНЫ ТЕКСТА НА ИЗОБРАЖЕНИЕ ===
    // Раскомментируйте следующую строку, чтобы заменить текст на изображение:
   // replaceTitleWithImage('https://raw.githubusercontent.com/msu4ainiki/VS_app/refs/heads/main/img/1759856594359.png', 'XX');
    // === КОНЕЦ: ПРИМЕР ИСПОЛЬЗОВАНИЯ ЗАМЕНЫ ТЕКСТА НА ИЗОБРАЖЕНИЕ ===
});
