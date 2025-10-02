// КОНФИГУРАЦИЯ ИЗОБРАЖЕНИЙ - УПРОЩЕННАЯ ВЕРСИЯ
// БАЗОВЫЙ URL ДЛЯ RAW-ФАЙЛОВ GITHUB
const baseGitHubUrl = 'https://raw.githubusercontent.com/msu4ainiki/VS_app/main/img/';

// ДОСТАТОЧНО УКАЗЫВАТЬ ТОЛЬКО ИМЕНА ФАЙЛОВ
const imageConfig = {
    // Папка с изображениями (если все в одной папке)
    imagesFolder: '', // Оставьте пустым, если файлы в корне папки img
    
    // Изображения для левой команды (Бегуны) - ТОЛЬКО ИМЕНА ФАЙЛОВ
    runners: [
    '1759151720282.png'
    ,'1759160744779.png'
    ,'1759387668551_copy_540x671.png'
    ,'1759176819638.png'
    ,'1759238335702.png'
    ,'1759238684512_copy_458x646.png'
    ,'1759176819638.png'
    ],
    
    // Изображения для правой команды (Лыжники) - ТОЛЬКО ИМЕНА ФАЙЛОВ
    skiers: [
    '1759160143809_copy_504x489.png'
    ,'1759143592630.png'
    ,'1759160422940.png'
    ,'1759176719425.png'
    ,'1759212657792_copy_343x438.png'
    ,'1759238483353.png'
    ,'1759238640181.png'
    ,'1759238731718_copy_434x681.png'
    ],

    // Логотип - ТОЛЬКО ИМЯ ФАЙЛА
    logo: 'bck_sm.png'
};

// ФУНКЦИЯ ДЛЯ ФОРМИРОВАНИЯ ПОЛНЫХ URL-АДРЕСОВ
function getFullImageUrls(filenames, folder = '') {
    return filenames.map(filename => baseGitHubUrl + folder + filename);
}

// ГОТОВЫЕ МАССИВЫ С ПОЛНЫМИ ССЫЛКАМИ
const runners = getFullImageUrls(imageConfig.runners, imageConfig.imagesFolder);
const skiers = getFullImageUrls(imageConfig.skiers, imageConfig.imagesFolder);
const logoUrl = baseGitHubUrl + imageConfig.imagesFolder + imageConfig.logo;

// Экспортируем как глобальные переменные для использования в script.js
window.imageConfig = imageConfig;
window.runners = runners;
window.skiers = skiers;
window.logoUrl = logoUrl;
