const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Используем изображения из конфигурации
const leftTeamImages = imageConfig.leftTeamImages;
const rightTeamImages = imageConfig.rightTeamImages;

let currentLeftIndex = 0;
let currentRightIndex = 0;

const leftImage = document.getElementById('left-image');
const rightImage = document.getElementById('right-image');
const leftImageContainer = leftImage.parentElement;
const rightImageContainer = rightImage.parentElement;

const leftPrevBtn = document.getElementById('left-prev');
const leftNextBtn = document.getElementById('left-next');
const rightPrevBtn = document.getElementById('right-prev');
const rightNextBtn = document.getElementById('right-next');
const saveButton = document.getElementById('save-button');

// Создаем индикаторы
const leftInfo = document.createElement('div');
leftInfo.className = 'participant-info';
leftInfo.textContent = '1/' + leftTeamImages.length;
leftImageContainer.parentElement.appendChild(leftInfo);

const rightInfo = document.createElement('div');
rightInfo.className = 'participant-info';
rightInfo.textContent = '1/' + rightTeamImages.length;
rightImageContainer.parentElement.appendChild(rightInfo);

// Функция для проверки прозрачности и включения свечения
function checkTransparencyAndAddGlow(imageElement, container) {
    if (imageElement.src.includes('.png')) {
        container.classList.add('glow-effect');
    } else {
        container.classList.remove('glow-effect');
    }
}

// Функция смены изображения с анимацией
function changeImage(imageElement, container, newSrc, infoElement, currentIndex, total) {
    imageElement.classList.add('image-changing');
    imageElement.src = newSrc;
    infoElement.textContent = (currentIndex + 1) + '/' + total;
    
    imageElement.onload = function() {
        checkTransparencyAndAddGlow(imageElement, container);
        setTimeout(() => {
            imageElement.classList.remove('image-changing');
        }, 300);
    };
    
    // Обработка ошибок загрузки
    imageElement.onerror = function() {
        console.error('Ошибка загрузки изображения:', newSrc);
        imageElement.alt = 'Изображение не загружено';
        container.classList.remove('glow-effect');
        setTimeout(() => {
            imageElement.classList.remove('image-changing');
        }, 300);
    };
}

// Функция для создания и сохранения скриншота
function saveScreenshot() {
    const screenshotArea = document.getElementById('screenshot-area');
    
    // Показываем индикатор загрузки
    saveButton.textContent = '📸 Сохраняем...';
    saveButton.disabled = true;
    
    // Создаем скриншот
    html2canvas(screenshotArea, {
        backgroundColor: '#000000',
        scale: 2, // Увеличиваем качество в 2 раза
        useCORS: true, // Разрешаем CORS для изображений
        allowTaint: true,
        logging: false
    }).then(canvas => {
        // Создаем ссылку для скачивания
        const link = document.createElement('a');
        link.download = `бегуны-против-лыжников-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
        // Восстанавливаем кнопку
        saveButton.textContent = '💾 Сохранить';
        saveButton.disabled = false;
        
        // Виброотклик при успешном сохранении
        if (tg.isVibrationSupported) {
            tg.HapticFeedback.impactOccurred('medium');
        }
    }).catch(error => {
        console.error('Ошибка при создании скриншота:', error);
        saveButton.textContent = '💾 Сохранить';
        saveButton.disabled = false;
        
        // Виброотклик при ошибке
        if (tg.isVibrationSupported) {
            tg.HapticFeedback.impactOccurred('error');
        }
    });
}

// Загрузка первых изображений
function loadInitialImages() {
    if (leftTeamImages.length > 0) {
        leftImage.src = leftTeamImages[currentLeftIndex];
    }
    if (rightTeamImages.length > 0) {
        rightImage.src = rightTeamImages[currentRightIndex];
    }
    
    leftImage.onload = function() {
        checkTransparencyAndAddGlow(leftImage, leftImageContainer);
    };
    rightImage.onload = function() {
        checkTransparencyAndAddGlow(rightImage, rightImageContainer);
    };
}

// Обработчики для левой команды
leftPrevBtn.addEventListener('click', () => {
    if (leftTeamImages.length > 0) {
        currentLeftIndex = (currentLeftIndex - 1 + leftTeamImages.length) % leftTeamImages.length;
        changeImage(leftImage, leftImageContainer, leftTeamImages[currentLeftIndex], leftInfo, currentLeftIndex, leftTeamImages.length);
    }
});

leftNextBtn.addEventListener('click', () => {
    if (leftTeamImages.length > 0) {
        currentLeftIndex = (currentLeftIndex + 1) % leftTeamImages.length;
        changeImage(leftImage, leftImageContainer, leftTeamImages[currentLeftIndex], leftInfo, currentLeftIndex, leftTeamImages.length);
    }
});

// Обработчики для правой команды
rightPrevBtn.addEventListener('click', () => {
    if (rightTeamImages.length > 0) {
        currentRightIndex = (currentRightIndex - 1 + rightTeamImages.length) % rightTeamImages.length;
        changeImage(rightImage, rightImageContainer, rightTeamImages[currentRightIndex], rightInfo, currentRightIndex, rightTeamImages.length);
    }
});

rightNextBtn.addEventListener('click', () => {
    if (rightTeamImages.length > 0) {
        currentRightIndex = (currentRightIndex + 1) % rightTeamImages.length;
        changeImage(rightImage, rightImageContainer, rightTeamImages[currentRightIndex], rightInfo, currentRightIndex, rightTeamImages.length);
    }
});

// Обработчик кнопки сохранения
saveButton.addEventListener('click', saveScreenshot);

// Обработка клавиатуры
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
            leftPrevBtn.click();
            break;
        case 'ArrowRight':
            leftNextBtn.click();
            break;
        case 'a':
        case 'A':
            leftPrevBtn.click();
            break;
        case 'd':
        case 'D':
            leftNextBtn.click();
            break;
        case 'ArrowUp':
            rightPrevBtn.click();
            break;
        case 'ArrowDown':
            rightNextBtn.click();
            break;
        case 'j':
        case 'J':
            rightPrevBtn.click();
            break;
        case 'l':
        case 'L':
            rightNextBtn.click();
            break;
        case 's':
        case 'S':
            saveButton.click();
            break;
    }
});

// Обработка свайпов
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].screenX;
    const touchEndY = event.changedTouches[0].screenY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    const touchX = event.changedTouches[0].clientX;
    const screenWidth = window.innerWidth;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (touchX < screenWidth / 2) {
            if (diffX > 0) {
                leftPrevBtn.click();
            } else {
                leftNextBtn.click();
            }
        } else {
            if (diffX > 0) {
                rightPrevBtn.click();
            } else {
                rightNextBtn.click();
            }
        }
    }
});

// Виброотклик для кнопок навигации
if (tg.isVibrationSupported) {
    const buttons = document.querySelectorAll('.nav-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            tg.HapticFeedback.impactOccurred('light');
        });
    });
}

// Инициализация
loadInitialImages();
