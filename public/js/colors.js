// Цветовая лаборатория
console.log('Цветовая лаборатория загружена');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализирую цветовую лабораторию...');

    // Элементы
    const colorInput = document.getElementById('colorInput');
    const colorHex = document.getElementById('colorHex');
    const selectedColor = document.getElementById('selectedColor');
    const colorValue = document.getElementById('colorValue');
    const addColorBtn = document.getElementById('addColorBtn');
    const colorPalette = document.getElementById('colorPalette');
    const clearPaletteBtn = document.getElementById('clearPaletteBtn');
    // Проверяем элементы
    if (!colorInput || !colorPalette) {
        console.error('Не найдены элементы цветовой лаборатории');
        return;
    }
     console.log('✅ Все элементы цветовой лаборатории найдены');
    // Загружаем сохраненную палитру
    let palette = [];
    try {
        const saved = localStorage.getItem('artflow-palette');
        if (saved) {
            palette = JSON.parse(saved);
            console.log('Загружена палитра из localStorage:', palette.length, 'цветов');
        }
    } catch (e) {
        console.error('Ошибка загрузки палитры:', e);
    }
    // Обновляем выбранный цвет
    function updateSelectedColor(color) {
        selectedColor.style.background = color;
        colorValue.textContent = color;
        colorHex.value = color;
    }
    // Отображаем палитру
    function renderPalette() {
        colorPalette.innerHTML = '';  
        if (palette.length === 0) {
            colorPalette.innerHTML = '<p class="empty-message">Пока нет цветов в палитре. Добавьте первый цвет!</p>';
            return;
        } 
        palette.forEach(function(color, index) {
            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';
            colorItem.style.background = color;
            colorItem.title = color + ' (клик - выбрать, двойной клик - удалить)';   
            // Клик по цвету в палитре - выбирает его
            colorItem.addEventListener('click', function() {
                colorInput.value = color;
                updateSelectedColor(color);
                console.log('Выбран цвет:', color);
            }); 
            // Двойной клик - удаляет из палитры
            colorItem.addEventListener('dblclick', function() {
                 if (confirm('Удалить этот цвет из палитры?')) {
                    palette.splice(index, 1);
                    localStorage.setItem('artflow-palette', JSON.stringify(palette));
                    renderPalette();
                    console.log('Удален цвет:', color);
                }
            });  
            colorPalette.appendChild(colorItem);
        });
    }
    // События
    colorInput.addEventListener('input', function() {
        updateSelectedColor(this.value);
        console.log('Выбран цвет:', this.value);
    });
    colorHex.addEventListener('change', function() {
        const color = this.value;
        // Простая проверка HEX кода
        if (color.startsWith('#') && (color.length === 4 || color.length === 7)) {
            colorInput.value = color;
            updateSelectedColor(color);
            console.log('Введен HEX:', color);
        }
    });
    addColorBtn.addEventListener('click', function() {
        const color = colorInput.value;
        // Проверяем, нет ли уже такого цвета
        if (!palette.includes(color)) {
            palette.push(color);
            localStorage.setItem('artflow-palette', JSON.stringify(palette));
            renderPalette();
            console.log('Цвет добавлен в палитру:', color);
            // Маленькая анимация
            addColorBtn.textContent = '✓ Добавлено!';
            setTimeout(() => {
                addColorBtn.textContent = 'Добавить в палитру';
            }, 1000);
        } else {
            console.log('Этот цвет уже есть в палитре');
            addColorBtn.textContent = 'Уже в палитре!';
            setTimeout(() => {
                addColorBtn.textContent = 'Добавить в палитру';
            }, 1000);
        }
    });
    clearPaletteBtn.addEventListener('click', function() {
        if (palette.length === 0) {
            alert('Палитра уже пустая!');
            return;
        }
        if (confirm('Очистить всю палитру?')) {
            palette = [];
            localStorage.removeItem('artflow-palette');
            renderPalette();
            console.log('Палитра очищена');
        }
    });
    // Инициализация
    updateSelectedColor(colorInput.value);
    renderPalette();
    console.log('✅ Цветовая лаборатория готова к работе');
    console.log('Инструкция:');
    console.log('1. Выберите цвет через палитру или введите HEX');
    console.log('2. Нажмите "Добавить в палитру"');
    console.log('3. Клик на цвете в палитре - выбирает его');
    console.log('4. Двойной клик - удаляет из палитры');
});