
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// ЗАМЕНИТЕ ССЫЛКИ НА ВАШИ ИЗОБРАЖЕНИЯ!
const leftTeamImages = [
    'https://raw.githubusercontent.com/msu4ainiki/VS_app/refs/heads/main/img/Screenshot_20250928-234623%7E3.png', // PNG с прозрачностью
    'https://www.mortalkombatwarehouse.com/mk3/screenshots/03.png',
    'https://downloader.disk.yandex.ru/preview/aaae4a6267a6936ff454352f40e2019187fcaa7ca3663eb5db4c7e1d486af008/68da3268/ur7gGOcVd1KdbK4R9CA6d_fV0hdqEO2wYfyZV77TUkZvZlvDtZ2bhMmlu4NHnd8yUfVFkvoX0DJAEHG3iEINPg%3D%3D?uid=0&filename=Screenshot_20250928-234623~3.png&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&tknv=v3&size=XXXL&crop=0'
];

const rightTeamImages = [
    'https://raw.githubusercontent.com/msu4ainiki/VS_app/b78a29d593a1bc549fb58a527fe78b9a3383d384/img/Screenshot_20250928-234623%7E4.png', // PNG с прозрачностью
    'https://disk.yandex.ru/i/tyvL_ZAMsfVJdQ',
    'https://s297klg.storage.yandex.net/rdisk/4c4edb65037a4bc15808a878ee915984f32e664498257496a7cb498d5965bd5e/68da3268/ZQR_a0yN6_t_b6ztngYWwuEL_-X0xkhTt616cGVhMRpAm-HBRUAF2RxqnPJ7FMCwJdRibYJwGY4oOGx40pgARA==?uid=0&filename=Screenshot_20250928-234623~3.png&disposition=inline&hash=&limit=0&content_type=image%2Fjpeg&owner_uid=0&fsize=56804&hid=d851f711f3f4c28424aee760dc52daca&media_type=image&tknv=v3&etag=88ccee64f3f65ae8d9283533760ca7a9&ts=63feb6ba36a00&s=bf71474ec9ffcabab0b88b15903d7e6912b12d87008717d2c833bb87d4d9acb3&pb=U2FsdGVkX1-aAYEQhuGCaq910S-sA34N5N4zegsI0aLto7GLpiIILLIh97vf1zc6ucfeblD_210nL7ehGTWzHHUHnR4YA0tMAf87fMJzo6E'
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
    // Для простоты предполагаем, что все PNG с прозрачностью имеют свечение
    // В реальном проекте здесь была бы сложная логика анализа пикселей
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

    const touchX = event.changedTouches[0].clientX;
    const screenWidth = window.innerWidth;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (touchX < screenWidth / 2) {
            // Левая половина экрана - левая команда
            if (diffX > 0) {
                leftPrevBtn.click();
            } else {
                leftNextBtn.click();
            }
        } else {
            // Правая половина экрана - правая команда
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
                
