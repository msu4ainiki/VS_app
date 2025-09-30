const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Используем изображения из конфигурации
const runners = imageConfig.runners;
const skiers = imageConfig.skiers;
const logoUrl = imageConfig.logo; // Получаем URL логотипа

// Индексы для каждого участника
let leftIndices = [0, 1, 2]; // Бегуны
let rightIndices = [0, 1, 2]; // Лыжники

// Функция для загрузки логотипа
function loadLogo() {
    const logoElement = document.querySelector('.logo-image');
    if (logoElement && logoUrl) {
        logoElement.src = logoUrl;
        logoElement.onload = function() {
            console.log('Логотип загружен');
        };
        logoElement.onerror = function() {
            console.error('Ошибка загрузки логотипа');
        };
    }
}

// Функция смены изображения с анимацией ТОЛЬКО для этого изображения
function changeImage(imageElement, newSrc) {
    // Добавляем анимацию только к этому конкретному изображению
    imageElement.classList.add('image-changing');
    imageElement.src = newSrc;
    
    imageElement.onload = function() {
        setTimeout(() => {
            imageElement.classList.remove('image-changing');
        }, 300);
    };
    
    // Обработка ошибок загрузки
    imageElement.onerror = function() {
        console.error('Ошибка загрузки изображения:', newSrc);
        imageElement.alt = 'Изображение не загружено';
        setTimeout(() => {
            imageElement.classList.remove('image-changing');
        }, 300);
    };
}

// Функция обновления конкретного изображения с анимацией
function updateSingleImage(team, layerIndex) {
    const imageElement = document.getElementById(`${team}-image-${layerIndex + 1}`);
    if (!imageElement) return;
    
    const array = team === 'left' ? runners : skiers;
    const currentIndex = team === 'left' ? leftIndices[layerIndex] : rightIndices[layerIndex];
    
    if (array[currentIndex]) {
        changeImage(imageElement, array[currentIndex]);
    }
}

// Инициализация изображений (без анимации)
function loadInitialImages() {
    // Загружаем все изображения без анимации
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
    
// Загружаем логотип
    loadLogo();
}

// Создание обработчиков для кнопок
function setupEventListeners() {
    // Обработчики для бегунов
    for (let i = 0; i < 3; i++) {
        const prevBtn = document.getElementById(`left-prev-${i + 1}`);
        const nextBtn = document.getElementById(`left-next-${i + 1}`);
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                leftIndices[i] = (leftIndices[i] - 1 + runners.length) % runners.length;
                // Обновляем только это конкретное изображение
                updateSingleImage('left', i);
            });
            
            nextBtn.addEventListener('click', () => {
                leftIndices[i] = (leftIndices[i] + 1) % runners.length;
                // Обновляем только это конкретное изображение
                updateSingleImage('left', i);
            });
        }
    }
    
    // Обработчики для лыжников
    for (let i = 0; i < 3; i++) {
        const prevBtn = document.getElementById(`right-prev-${i + 1}`);
        const nextBtn = document.getElementById(`right-next-${i + 1}`);
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                rightIndices[i] = (rightIndices[i] - 1 + skiers.length) % skiers.length;
                // Обновляем только это конкретное изображение
                updateSingleImage('right', i);
            });
            
            nextBtn.addEventListener('click', () => {
                rightIndices[i] = (rightIndices[i] + 1) % skiers.length;
                // Обновляем только это конкретное изображение
                updateSingleImage('right', i);
            });
        }
    }
}

// Функция для создания плаката
function createPoster() {
    const screenshotArea = document.getElementById('screenshot-area');
    const saveButton = document.getElementById('create-poster');
    
    // Показываем загрузку
    const originalText = saveButton.textContent;
    saveButton.textContent = '🖼️ Создаём...';
    saveButton.disabled = true;

    // Создаем плакат с помощью html2canvas
    html2canvas(screenshotArea, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false
    }).then(canvas => {
        // Конвертируем canvas в Data URL
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        
        // Показываем модальное окно с результатом
        showPosterModal(dataUrl);
        
        // Восстанавливаем кнопку
        saveButton.textContent = originalText;
        saveButton.disabled = false;
        
        // Виброотклик
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
    }).catch(error => {
        console.error('Ошибка создания плаката:', error);
        saveButton.textContent = originalText;
        saveButton.disabled = false;
        alert('Ошибка создания плаката. Попробуйте еще раз.');
    });
}

// Функция показа модального окна с плакатом
function showPosterModal(imageUrl) {
    const modal = document.getElementById('poster-modal');
    const posterImage = document.getElementById('poster-result');
    const closeButton = document.getElementById('close-poster');
    const shareButton = document.getElementById('share-poster');
    
    // Устанавливаем изображение
    posterImage.src = imageUrl;
    
    // Показываем модальное окно
    modal.classList.add('active');
    
    // Обработчик закрытия
    closeButton.onclick = () => {
        modal.classList.remove('active');
    };
    
    // Обработчик кнопки "Поделиться"
    shareButton.onclick = () => {
        sharePoster(imageUrl);
    };
    
    // Закрытие по клику на фон
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    };
}

// Функция для шаринга плаката
function sharePoster(imageUrl) {
    // Создаем временную ссылку для скачивания
    const link = document.createElement('a');
    link.download = `бегуны-против-лыжников-${Date.now()}.png`;
    link.href = imageUrl;
    
    try {
        // Пытаемся скачать (работает в браузерах)
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.log('Прямое скачивание недоступно');
    }
    
    // Показываем инструкцию для Telegram
    alert('Плакат готов! Вы можете:\n\n1. Сохранить изображение долгим нажатием\n2. Отправить его в любой чат\n3. Установить как обои');
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Настройка обработчиков кнопок
    setupEventListeners();
    
    // Загрузка начальных изображений
    loadInitialImages();
    
    // Обработчик кнопки создания плаката
    const createPosterBtn = document.getElementById('create-poster');
    if (createPosterBtn) {
        createPosterBtn.addEventListener('click', createPoster);
    }
});

// Обработка клавиатуры для быстрого доступа
document.addEventListener('keydown', (event) => {
    // Можно добавить горячие клавиши при необходимости
});
