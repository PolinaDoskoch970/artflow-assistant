// Цветовая лаборатория
console.log('Цветовая лаборатория загружена');
document.addEventListener('DOMContentLoaded', function() {
    // Элементы
    const colorInput = document.getElementById('colorInput');
    const colorHex = document.getElementById('colorHex');
    const selectedColor = document.getElementById('selectedColor');
    const colorValue = document.getElementById('colorValue');
    const addColorBtn = document.getElementById('addColorBtn');
    const colorPalette = document.getElementById('colorPalette');
    const clearPaletteBtn = document.getElementById('clearPaletteBtn');
    // Массив для хранения палитры
    let palette = JSON.parse(localStorage.getItem('artflow-palette')) || [];
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
            colorPalette.innerHTML = '<p class="empty-message">Пока нет цветов в палитре</p>';
            return;
        } 
        palette.forEach(function(color, index) {
            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';
            colorItem.style.background = color;
            colorItem.title = color;      
            // Клик по цвету в палитре - выбирает его
            colorItem.addEventListener('click', function() {
                colorInput.value = color;
                updateSelectedColor(color);
            }); 
            // Двойной клик - удаляет из палитры
            colorItem.addEventListener('dblclick', function() {
                palette.splice(index, 1);
                localStorage.setItem('artflow-palette', JSON.stringify(palette));
                renderPalette();
            });  
            colorPalette.appendChild(colorItem);
        });
    }
    // События
    colorInput.addEventListener('input', function() {
        updateSelectedColor(this.value);
    });
    colorHex.addEventListener('change', function() {
        const color = this.value;
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            colorInput.value = color;
            updateSelectedColor(color);
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
        }
    });
    clearPaletteBtn.addEventListener('click', function() {
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
    console.log('Цветовая лаборатория готова');
});