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
    const centerLogoElement = document.querySelector('.center-logo-image');
    if (centerLogoElement && logoUrl) {
        console.log('Загружаем центральный логотип:', logoUrl);
        centerLogoElement.src = logoUrl;
        centerLogoElement.onload = function() {
            console.log('Центральный логотип загружен');
            // Убедимся, что логотип непрозрачный
            centerLogoElement.style.opacity = '1';
        };
        centerLogoElement.onerror = function() {
            console.error('Ошибка загрузки центрального логотипа:', logoUrl);
            // Заглушка для логотипа
            centerLogoElement.style.display = 'none';
        };
    } else {
        console.error('Центральный логотип или элемент не найден');
    }
}

// Функция смены изображения с анимацией ТОЛЬКО для этого изображения
function changeImage(imageElement, newSrc) {
    if (!imageElement) {
        console.error('Элемент изображения не найден');
        return;
    }
    
    // Добавляем анимацию только к этому конкретному изображению
    imageElement.classList.add('image-changing');
    imageElement.src = newSrc;
    
    imageElement.onload = function() {
        console.log('Изображение загружено:', newSrc);
        setTimeout(() => {
            imageElement.classList.remove('image-changing');
        }, 300);
    };
    
    // Обработка ошибок загрузки
    imageElement.onerror = function() {
        console.error('Ошибка загрузки изображения:', newSrc);
        imageElement.alt = 'Изображение не загружено';
        // Заглушка для ошибки
        imageElement.style.backgroundColor = '#333';
        imageElement.innerHTML = '<span style="color: white; font-size: 12px;">Ошибка загрузки</span>';
        setTimeout(() => {
            imageElement.classList.remove('image-changing');
        }, 300);
    };
}

// Функция обновления конкретного изображения с анимацией
function updateSingleImage(team, layerIndex) {
    const imageId = `${team}-image-${layerIndex + 1}`;
    const imageElement = document.getElementById(imageId);
    
    if (!imageElement) {
        console.error('Элемент не найден:', imageId);
        return;
    }
    
    const array = team === 'left' ? runners : skiers;
    const indices = team === 'left' ? leftIndices : rightIndices;
    const currentIndex = indices[layerIndex];
    
    console.log(`Обновление ${team} слой ${layerIndex + 1}, индекс:`, currentIndex, 'URL:', array[currentIndex]);
    
    if (array[currentIndex]) {
        changeImage(imageElement, array[currentIndex]);
    } else {
        console.error('Неверный индекс массива:', currentIndex, 'для команды', team);
    }
}

// Инициализация изображений (без анимации)
function loadInitialImages() {
    console.log('Начальная загрузка изображений...');
    
    // Загружаем все изображения без анимации
    for (let i = 0; i < 3; i++) {
        const leftImage = document.getElementById(`left-image-${i + 1}`);
        const rightImage = document.getElementById(`right-image-${i + 1}`);
        
        if (leftImage && runners[leftIndices[i]]) {
            console.log(`Загрузка левого изображения ${i + 1}:`, runners[leftIndices[i]]);
            leftImage.src = runners[leftIndices[i]];
            leftImage.onerror = function() {
                console.error('Ошибка загрузки начального изображения бегуна:', runners[leftIndices[i]]);
                this.style.backgroundColor = '#333';
            };
        } else {
            console.error('Не удалось найти элемент или URL для левого изображения', i + 1);
        }
        
        if (rightImage && skiers[rightIndices[i]]) {
            console.log(`Загрузка правого изображения ${i + 1}:`, skiers[rightIndices[i]]);
            rightImage.src = skiers[rightIndices[i]];
            rightImage.onerror = function() {
                console.error('Ошибка загрузки начального изображения лыжника:', skiers[rightIndices[i]]);
                this.style.backgroundColor = '#333';
            };
        } else {
            console.error('Не удалось найти элемент или URL для правого изображения', i + 1);
        }
    }
    
    // Загружаем логотип
    loadLogo();
}

// Создание обработчиков для кнопок
function setupEventListeners() {
    console.log('Настройка обработчиков событий...');
    
    // Обработчики для бегунов
    for (let i = 0; i < 3; i++) {
        const prevBtn = document.getElementById(`left-prev-${i + 1}`);
        const nextBtn = document.getElementById(`left-next-${i + 1}`);
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                leftIndices[i] = (leftIndices[i] - 1 + runners.length) % runners.length;
                console.log(`Левая кнопка назад, слой ${i + 1}, новый индекс:`, leftIndices[i]);
                updateSingleImage('left', i);
            });
            
            nextBtn.addEventListener('click', () => {
                leftIndices[i] = (leftIndices[i] + 1) % runners.length;
                console.log(`Левая кнопка вперед, слой ${i + 1}, новый индекс:`, leftIndices[i]);
                updateSingleImage('left', i);
            });
        } else {
            console.error('Не найдены кнопки для левого слоя', i + 1);
        }
    }
    
    // Обработчики для лыжников
    for (let i = 0; i < 3; i++) {
        const prevBtn = document.getElementById(`right-prev-${i + 1}`);
        const nextBtn = document.getElementById(`right-next-${i + 1}`);
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                rightIndices[i] = (rightIndices[i] - 1 + skiers.length) % skiers.length;
                console.log(`Правая кнопка назад, слой ${i + 1}, новый индекс:`, rightIndices[i]);
                updateSingleImage('right', i);
            });
            
            nextBtn.addEventListener('click', () => {
                rightIndices[i] = (rightIndices[i] + 1) % skiers.length;
                console.log(`Правая кнопка вперед, слой ${i + 1}, новый индекс:`, rightIndices[i]);
                updateSingleImage('right', i);
            });
        } else {
            console.error('Не найдены кнопки для правого слоя', i + 1);
        }
    }
}

// Функция для создания плаката
function createPoster() {
    const screenshotArea = document.getElementById('screenshot-area');
    const saveButton = document.getElementById('create-poster');
    
    if (!screenshotArea) {
        console.error('Не найдена область для скриншота');
        return;
    }
    
    // Показываем загрузку
    const originalText = saveButton.textContent;
    saveButton.textContent = '🖼️ Создаём...';
    saveButton.disabled = true;

    console.log('Начинаем создание плаката...');
    
    // Создаем плакат с помощью html2canvas
    html2canvas(screenshotArea, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: true, // Включаем логирование для отладки
        onclone: function(clonedDoc) {
            console.log('Клонирование документа для html2canvas');
            // Убедимся, что все изображения загружены в клоне
            const images = clonedDoc.querySelectorAll('img');
            images.forEach((img, index) => {
                console.log(`Изображение ${index + 1}:`, img.src, 'загружено:', img.complete);
            });
        }
    }).then(canvas => {
        console.log('Плакат успешно создан');
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
    
    if (!modal || !posterImage) {
        console.error('Не найдены элементы модального окна');
        return;
    }
    
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
    console.log('DOM загружен, инициализируем приложение...');
    
    // Настройка обработчиков кнопок
    setupEventListeners();
    
    // Загрузка начальных изображений
    loadInitialImages();
    
    // Обработчик кнопки создания плаката
    const createPosterBtn = document.getElementById('create-poster');
    if (createPosterBtn) {
        createPosterBtn.addEventListener('click', createPoster);
    } else {
        console.error('Не найдена кнопка создания плаката');
    }
    
    console.log('Приложение инициализировано');
});

// Добавляем глобальную обработку ошибок изображений
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.error('Глобальная ошибка загрузки изображения:', e.target.src);
        e.target.style.backgroundColor = '#333';
        e.target.innerHTML = '<span style="color: white; font-size: 12px;">Ошибка загрузки</span>';
    }
}, true);
