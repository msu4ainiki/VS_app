const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Используем изображения из конфигурации
const runners = imageConfig.runners;
const skiers = imageConfig.skiers;
const logoUrl = imageConfig.logo;

// Индексы для каждого участника
let leftIndices = [0, 1, 2];
let rightIndices = [0, 1, 2];

// Функция для загрузки логотипа
function loadLogo() {
    const centerLogoElement = document.querySelector('.center-logo-image');
    if (centerLogoElement && logoUrl) {
        centerLogoElement.src = logoUrl;
        centerLogoElement.onload = function() {
            centerLogoElement.style.opacity = '1';
        };
        centerLogoElement.onerror = function() {
            centerLogoElement.style.display = 'none';
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
    
    const array = team === 'left' ? runners : skiers;
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
        
        if (leftImage && runners[leftIndices[i]]) {
            leftImage.src = runners[leftIndices[i]];
        }
        
        if (rightImage && skiers[rightIndices[i]]) {
            rightImage.src = skiers[rightIndices[i]];
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
                leftIndices[i] = (leftIndices[i] - 1 + runners.length) % runners.length;
                updateSingleImage('left', i);
            });
            
            nextBtn.addEventListener('click', () => {
                leftIndices[i] = (leftIndices[i] + 1) % runners.length;
                updateSingleImage('left', i);
            });
        }
    }
    
    for (let i = 0; i < 3; i++) {
        const prevBtn = document.getElementById(`right-prev-${i + 1}`);
        const nextBtn = document.getElementById(`right-next-${i + 1}`);
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                rightIndices[i] = (rightIndices[i] - 1 + skiers.length) % skiers.length;
                updateSingleImage('right', i);
            });
            
            nextBtn.addEventListener('click', () => {
                rightIndices[i] = (rightIndices[i] + 1) % skiers.length;
                updateSingleImage('right', i);
            });
        }
    }
}

// Функция для создания и пересылки плаката
function createAndSharePoster() {
    const screenshotArea = document.getElementById('screenshot-area');
    const shareButton = document.getElementById('create-poster');
    
    if (!screenshotArea) return;
    
    const originalText = shareButton.textContent;
    shareButton.textContent = '📤 Готовим плакат...';
    shareButton.disabled = true;

    html2canvas(screenshotArea, {
        backgroundColor: '#000000',
        scale: 0.8,
        useCORS: true,
        allowTaint: false,
        logging: false
    }).then(canvas => {
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        const shareText = `🏆 Мой турнирный плакат "Бегуны против Лыжников"!\n\nСоздай свой тут: ${getAppLink()}`;
        
        if (window.Telegram && window.Telegram.WebApp) {
            Telegram.WebApp.shareMessage({
                text: shareText,
                media: {
                    type: 'photo',
                    url: imageDataUrl
                }
            });
        } else {
            fallbackShare(imageDataUrl);
        }
        
        shareButton.textContent = originalText;
        shareButton.disabled = false;
        
    }).catch(error => {
        console.error('Ошибка создания плаката:', error);
        shareButton.textContent = originalText;
        shareButton.disabled = false;
        alert('Не удалось создать плакат. Пожалуйста, попробуйте еще раз.');
    });
}

// Функция для получения ссылки на приложение
function getAppLink() {
    return 'https://t.me/RunnersSkiers_bot?startapp=poster';
}

// Запасной вариант, если основной метод не сработает
function fallbackShare(imageDataUrl) {
    const link = document.createElement('a');
    link.download = 'турнирный-плакат.jpg';
    link.href = imageDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Плакат готов! Он сохранен в вашу галерею. Теперь вы можете отправить его друзьям вручную.');
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
