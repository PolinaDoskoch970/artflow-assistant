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
        if (typeof updateComplementary === 'function') updateComplementary();
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
    // Круг Иттена 
    const ittenColors = [
        "#FF0000", "#FF7F00", "#FFFF00", "#BFFF00",
        "#00FF00", "#00FF7F", "#00FFFF", "#007FFF",
        "#0000FF", "#7F00FF", "#FF00FF", "#FF007F"
    ];

    function drawIttenWheel() {
        const wheel = document.getElementById('colorWheel');
        if (!wheel) return;
        wheel.innerHTML = '';
        const sectorCount = ittenColors.length;
        const sectorAngle = 360 / sectorCount; // 30 градусов
        for (let i = 0; i < sectorCount; i++) {
            const sector = document.createElement('div');
            sector.className = 'wheel-sector';
            const rotate = i * sectorAngle;
            sector.style.transform = `rotate(${rotate}deg) skewY(${90 - sectorAngle}deg)`;
            sector.style.backgroundColor = ittenColors[i];
            sector.style.transformOrigin = '100% 100%';
            sector.addEventListener('click', (function(color) {
                return function() {
                    colorInput.value = color;
                    colorHex.value = color;
                    updateSelectedColor(color);
                };
            })(ittenColors[i]));
            wheel.appendChild(sector);
        }
    }
    drawIttenWheel();
    // Комплементарная палитра 
    function hexToRgb(hex) {
        let h = hex.slice(1);
        if (h.length === 3) h = h.split('').map(c => c + c).join('');
        const r = parseInt(h.substring(0,2), 16);
        const g = parseInt(h.substring(2,4), 16);
        const b = parseInt(h.substring(4,6), 16);
        return { r, g, b };
    }

    function rgbToHex(r,g,b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

        function getComplementary(hex) {
        const normalizedHex = hex.toUpperCase();
        const index = ittenColors.indexOf(normalizedHex);
        if (index !== -1) {
            const compIndex = (index + 6) % 12;
            return [normalizedHex, ittenColors[compIndex]];
        }
        // fallback: инверсия RGB (как работало раньше)
        const rgb = hexToRgb(hex);
        const invR = 255 - rgb.r;
        const invG = 255 - rgb.g;
        const invB = 255 - rgb.b;
        return [hex, rgbToHex(invR, invG, invB)];
    }
    // Триада (через 4 и 8 секторов)
    function getTriadic(hex) {
        const index = ittenColors.indexOf(hex.toUpperCase());
        if (index !== -1) {
            const idx1 = (index + 4) % 12;
            const idx2 = (index + 8) % 12;
            return [hex, ittenColors[idx1], ittenColors[idx2]];
        }
        return [hex, hex, hex];
    }
        function renderHarmonies(baseColor) {
        const container = document.getElementById('harmoniesContainer');
        if (!container) return;
        const comp = getComplementary(baseColor);
        const tri = getTriadic(baseColor);
        container.innerHTML = `
            <div class="palette-card">
                <div class="palette-title">Комплементарная</div>
                <div class="palette-colors">
                    <div class="palette-color" style="background: ${comp[0]};" data-hex="${comp[0]}"></div>
                    <div class="palette-color" style="background: ${comp[1]};" data-hex="${comp[1]}"></div>
                </div>
                <button class="save-palette-btn" data-palette="comp">💾 Сохранить палитру</button>
            </div>
            <div class="palette-card">
                <div class="palette-title">Триада</div>
                <div class="palette-colors">
                    <div class="palette-color" style="background: ${tri[0]};" data-hex="${tri[0]}"></div>
                    <div class="palette-color" style="background: ${tri[1]};" data-hex="${tri[1]}"></div>
                    <div class="palette-color" style="background: ${tri[2]};" data-hex="${tri[2]}"></div>
                </div>
                <button class="save-palette-btn" data-palette="tri">💾 Сохранить палитру</button>
            </div>
        `;
        // Копирование HEX при клике на цвет
        document.querySelectorAll('.palette-color').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const hex = el.getAttribute('data-hex');
                navigator.clipboard.writeText(hex);
                alert(`Скопировано: ${hex}`);
            });
        });
        // Сохранение палитр
        document.querySelectorAll('.save-palette-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                let colorsToSave = [];
                if (btn.dataset.palette === 'comp') colorsToSave = comp;
                else if (btn.dataset.palette === 'tri') colorsToSave = tri;
                colorsToSave.forEach(color => {
                    if (!palette.includes(color)) palette.push(color);
                });
                localStorage.setItem('artflow-palette', JSON.stringify(palette));
                renderPalette();
                alert('Палитра добавлена в "Моя палитра"');
            });
        });
    }
    // При изменении цвета обновляем комплементарную палитру
    function updateComplementary() {
        const currentColor = colorInput.value;
        renderHarmonies(currentColor);
    }
    colorInput.addEventListener('input', updateComplementary);
    colorHex.addEventListener('change', updateComplementary);
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