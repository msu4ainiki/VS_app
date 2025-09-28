const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// ЗАМЕНИТЕ ССЫЛКИ НА ВАШИ ИЗОБРАЖЕНИЯ!
const leftTeamImages = [
    'https://disk.yandex.ru/i/tyvL_ZAMsfVJdQ', // PNG с прозрачностью
    'https://disk.yandex.ru/i/lhIcNLu7VOIxMg',
    'https://example.com/left-participant-3.png'
];

const rightTeamImages = [
    'https://disk.yandex.ru/i/lhIcNLu7VOIxMg', // PNG с прозрачностью
    'https://disk.yandex.ru/i/tyvL_ZAMsfVJdQ',
    'https://example.com/right-participant-3.png'
];

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
    // Создаем временное изображение для проверки
    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous";
    tempImg.src = imageElement.src;
    
    tempImg.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = tempImg.width;
        canvas.height = tempImg.height;
        ctx.drawImage(tempImg, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let hasTransparency = false;
        
        // Проверяем наличие прозрачных пикселей
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 255) {
                hasTransparency = true;
                break;
            }
        }
        
        // Добавляем или убираем свечение
        if (hasTransparency) {
            container.classList.add('glow-effect');
        } else {
            container.classList.remove('glow-effect');
        }
    };
}

// Функция смены изображения с анимацией
function changeImage(imageElement, container, newSrc, infoElement, currentIndex, total) {
    imageElement.classList.add('image-changing');
    imageElement.src = newSrc;
    infoElement.textContent = (currentIndex + 1) + '/' + total;
    
    // Проверяем прозрачность после загрузки
    imageElement.onload = function() {
        checkTransparencyAndAddGlow(imageElement, container);
        setTimeout(() => {
            imageElement.classList.remove('image-changing');
        }, 300);
    };
}

// Загрузка первых изображений
function loadInitialImages() {
    leftImage.src = leftTeamImages[currentLeftIndex];
    rightImage.src = rightTeamImages[currentRightIndex];
    
    // Проверяем прозрачность начальных изображений
    leftImage.onload = function() {
        checkTransparencyAndAddGlow(leftImage, leftImageContainer);
    };
    rightImage.onload = function() {
        checkTransparencyAndAddGlow(rightImage, rightImageContainer);
    };
}

// Обработчики для левой команды
leftPrevBtn.addEventListener('click', () => {
    currentLeftIndex = (currentLeftIndex - 1 + leftTeamImages.length) % leftTeamImages.length;
    changeImage(leftImage, leftImageContainer, leftTeamImages[currentLeftIndex], leftInfo, currentLeftIndex, leftTeamImages.length);
});

leftNextBtn.addEventListener('click', () => {
    currentLeftIndex = (currentLeftIndex + 1) % leftTeamImages.length;
    changeImage(leftImage, leftImageContainer, leftTeamImages[currentLeftIndex], leftInfo, currentLeftIndex, leftTeamImages.length);
});

// Обработчики для правой команды
rightPrevBtn.addEventListener('click', () => {
    currentRightIndex = (currentRightIndex - 1 + rightTeamImages.length) % rightTeamImages.length;
    changeImage(rightImage, rightImageContainer, rightTeamImages[currentRightIndex], rightInfo, currentRightIndex, rightTeamImages.length);
});

rightNextBtn.addEventListener('click', () => {
    currentRightIndex = (currentRightIndex + 1) % rightTeamImages.length;
    changeImage(rightImage, rightImageContainer, rightTeamImages[currentRightIndex], rightInfo, currentRightIndex, rightTeamImages.length);
});

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

    const touchY = event.changedTouches[0].clientY;
    const screenHeight = window.innerHeight;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (touchY < screenHeight / 2) {
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

// Виброотклик
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
