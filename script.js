const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Инициализация темы
document.documentElement.dataset.mode = Telegram.WebApp.colorScheme;
Telegram.WebApp.onEvent('themeChanged', () => {
    document.documentElement.dataset.mode = Telegram.WebApp.colorScheme;
});

// Используем изображения из конфигурации
const runners = imageConfig.runners;
const skiers = imageConfig.skiers;
const logoUrl = imageConfig.logo;

// Индексы для каждого участника
let leftIndices = [0, 1, 2];
let rightIndices = [0, 1, 2];

// Функция для загрузки логотипа с обработкой ошибок
function loadLogo() {
    const centerLogoElement = document.querySelector('.center-logo-image');
    if (centerLogoElement && logoUrl) {
        console.log('Загружаем логотип:', logoUrl);
        centerLogoElement.src = logoUrl;
        centerLogoElement.onload = function() {
            console.log('Логотип успешно загружен');
            centerLogoElement.style.opacity = '1';
        };
        centerLogoElement.onerror = function() {
            console.error('Ошибка загрузки логотипа:', logoUrl);
            centerLogoElement.style.display = 'none';
        };
    } else {
        console.error('Логотип или элемент не найден');
    }
}

// Функция загрузки изображения с обработкой ошибок
function loadImageWithFallback(imgElement, src, alt) {
    return new Promise((resolve) => {
        imgElement.onload = () => {
            console.log('Изображение загружено:', src);
            resolve(true);
        };
        imgElement.onerror = () => {
            console.error('Ошибка загрузки изображения:', src);
            imgElement.alt = alt + ' (не загружено)';
            imgElement.style.backgroundColor = '#333';
            imgElement.innerHTML = '<div style="color: white; font-size: 12px; display: flex; align-items: center; justify-content: center; height: 100%;">Ошибка загрузки</div>';
            resolve(false);
        };
        imgElement.src = src;
    });
}

// Функция смены изображения с анимацией
function changeImage(imageElement, newSrc, alt) {
    if (!imageElement) return;
    
    imageElement.classList.add('image-changing');
    
    loadImageWithFallback(imageElement, newSrc, alt).then(success => {
        if (success) {
            setTimeout(() => {
                imageElement.classList.remove('image-changing');
            }, 300);
        } else {
            imageElement.classList.remove('image-changing');
        }
    });
}

// Функция обновления конкретного изображения
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
    const alt = team === 'left' ? `Бегун ${layerIndex + 1}` : `Лыжник ${layerIndex + 1}`;
    
    if (array[currentIndex]) {
        changeImage(imageElement, array[currentIndex], alt);
    } else {
        console.error('Неверный индекс массива:', currentIndex, 'для команды', team);
    }
}

// Инициализация изображений
async function loadInitialImages() {
    console.log('Начальная загрузка изображений...');
    
    const loadPromises = [];
    
    // Загружаем все изображения
    for (let i = 0; i < 3; i++) {
        const leftImage = document.getElementById(`left-image-${i + 1}`);
        const rightImage = document.getElementById(`right-image-${i + 1}`);
        
        if (leftImage && runners[leftIndices[i]]) {
            loadPromises.push(loadImageWithFallback(leftImage, runners[leftIndices[i]], `Бегун ${i + 1}`));
        }
        
        if (rightImage && skiers[rightIndices[i]]) {
            loadPromises.push(loadImageWithFallback(rightImage, skiers[rightIndices[i]], `Лыжник ${i + 1}`));
        }
    }
    
    // Ждем загрузки всех изображений
    await Promise.all(loadPromises);
    
    // Загружаем логотип
    loadLogo();
    
    console.log('Все изображения загружены');
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

// Функция для создания и отображения плаката
function createAndSharePoster() {
    const screenshotArea = document.getElementById('screenshot-area');
    const shareButton = document.getElementById('create-poster');
    
    if (!screenshotArea) {
        console.error('Элемент screenshot-area не найден');
        return;
    }
    
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
        
        showResultModal(imageDataUrl);
        
        shareButton.textContent = originalText;
        shareButton.disabled = false;
        
    }).catch(error => {
        console.error('Ошибка создания плаката:', error);
        shareButton.textContent = originalText;
        shareButton.disabled = false;
        alert('Не удалось создать плакат. Пожалуйста, попробуйте еще раз.');
    });
}

// Функция показа модального окна с результатом
function showResultModal(imageDataUrl) {
    let modal = document.getElementById('result-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'result-modal';
        modal.className = 'result-modal';
        modal.innerHTML = `
            <div class="result-modal-content">
                <h3>Ваш плакат готов! 🎉</h3>
                <img id="result-image" src="" alt="Ваш плакат" class="result-image">
                <div class="result-buttons">
                    <button id="download-btn" class="download-button">💾 Скачать плакат</button>
                    <button id="close-result" class="close-button">Закрыть</button>
                </div>
                <p class="result-instruction">Нажмите "Скачать плакат", затем нажмите и удерживайте изображение для сохранения в галерею</p>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('download-btn').addEventListener('click', function() {
            downloadImage(imageDataUrl);
        });
        
        document.getElementById('close-result').addEventListener('click', function() {
            modal.classList.remove('active');
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    document.getElementById('result-image').src = imageDataUrl;
    modal.classList.add('active');
}

// Функция для скачивания изображения
function downloadImage(imageDataUrl) {
    const link = document.createElement('a');
    link.download = 'турнирный-плакат-бегуны-против-лыжников.jpg';
    link.href = imageDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', async function() {
    try {
        setupEventListeners();
        await loadInitialImages();
        
        const shareButton = document.getElementById('create-poster');
        if (shareButton) {
            shareButton.addEventListener('click', createAndSharePoster);
        }
        
        console.log('Приложение инициализировано успешно');
    } catch (error) {
        console.error('Ошибка инициализации приложения:', error);
    }
});
