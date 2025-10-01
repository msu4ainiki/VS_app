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

// Функция для создания и отображения плаката
function createAndSharePoster() {
    const shareButton = document.getElementById('create-poster');
    
    // Меняем текст кнопки на время загрузки
    const originalText = shareButton.textContent;
    shareButton.textContent = '📸 Создаём плакат...';
    shareButton.disabled = true;

    // Создаем скриншот ВСЕЙ страницы
    html2canvas(document.body, {
        backgroundColor: '#000000',
        scale: 0.8, // Уменьшаем масштаб для оптимального размера файла
        useCORS: true,
        allowTaint: false,
        logging: false,
        scrollY: -window.scrollY // Убедимся, что захватываем верх страницы
    }).then(canvas => {
        // Конвертируем Canvas в Data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Показываем модальное окно с результатом
        showResultModal(imageDataUrl);
        
        // Возвращаем исходное состояние кнопки
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
    // Создаем или находим модальное окно
    let modal = document.getElementById('result-modal');
    
    if (!modal) {
        // Создаем модальное окно, если его нет
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
        
        // Обработчики для кнопок в модальном окне
        document.getElementById('download-btn').addEventListener('click', function() {
            downloadImage(imageDataUrl);
        });
        
        document.getElementById('close-result').addEventListener('click', function() {
            modal.classList.remove('active');
        });
        
        // Закрытие по клику вне окна
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Устанавливаем изображение и показываем окно
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
    
    // Виброотклик при успешном скачивании
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadInitialImages();
    
    const shareButton = document.getElementById('create-poster');
    if (shareButton) {
        shareButton.addEventListener('click', createAndSharePoster);
        shareButton.textContent = '📸 Создать плакат';
    }
});
