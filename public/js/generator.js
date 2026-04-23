// Генератор идей - конструктор (жанр + сюжет + техника + цвет + настроение)
console.log('🎲 Генератор-конструктор загружен');

document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateIdeaBtn');
    const saveBtn = document.getElementById('saveIdeaToNotebookBtn');
    const ideaDisplay = document.getElementById('generatedIdea');
    
    if (!generateBtn || !saveBtn || !ideaDisplay) {
        console.error('Элементы генератора не найдены');
        return;
    }
    
    // ===== БАЗА ДАННЫХ ДЛЯ КОНСТРУКТОРА =====
    const genres = [
        'пейзаж', 'портрет', 'натюрморт', 'комикс', 
        'абстракция', 'иллюстрация', 'фэнтези', 'урбан-скетч'
    ];
    
    const subjects = {
        пейзаж: ['лес', 'море', 'горы', 'город', 'поле', 'пустыня', 'водопад', 'осенний парк'],
        портрет: ['девушка', 'мужчина', 'ребёнок', 'пожилой человек', 'автопортрет', 'знаменитость'],
        натюрморт: ['фрукты', 'цветы', 'книги', 'посуда', 'музыкальные инструменты', 'череп'],
        комикс: ['супергерой', 'злодей', 'повседневность', 'фантастика', 'исторический момент'],
        абстракция: ['геометрические фигуры', 'цветовые пятна', 'линии и ритм', 'текстуры'],
        иллюстрация: ['сказочный персонаж', 'городская жизнь', 'животные', 'мечты'],
        фэнтези: ['дракон', 'эльф', 'магический лес', 'замок', 'волшебник', 'единорог'],
        'урбан-скетч': ['кафе', 'улица', 'архитектура', 'метро', 'площадь']
    };
    
    const techniques = [
        'акварель', 'масло', 'акрил', 'карандаш', 'пастель', 
        'уголь', 'цифровая графика', 'коллаж', 'тушь', 'гуашь'
    ];
    
    const colorSchemes = [
        'тёплые тона', 'холодные тона', 'монохром', 
        'комплементарные цвета', 'аналоговые цвета', 'яркие цвета', 
        'пастельные тона', 'земляные тона', 'неоновые цвета'
    ];
    
    const moods = [
        'радостное', 'меланхоличное', 'таинственное', 
        'динамичное', 'спокойное', 'драматичное', 
        'ностальгическое', 'футуристическое'
    ];
        // ===== ГЕНЕРАТОР ТЕХНИК РИСОВАНИЯ =====
    const techniquesWithTools = [
        { name: 'Акварель', tools: 'кисти, бумага для акварели, вода' },
        { name: 'Масло', tools: 'кисти, холст, масло, разбавитель' },
        { name: 'Акрил', tools: 'кисти, холст/бумага, вода' },
        { name: 'Карандаш', tools: 'карандаши разной твердости, бумага, ластик' },
        { name: 'Пастель', tools: 'пастельные мелки, бумага с зернистостью, фиксатив' },
        { name: 'Уголь', tools: 'угольные палочки, бумага, клячка' },
        { name: 'Цифровая графика', tools: 'планшет, стилус, программа (Photoshop, Procreate)' },
        { name: 'Коллаж', tools: 'ножницы, клей, журналы/бумага, основа' },
        { name: 'Тушь', tools: 'тушь, перо/кисть, бумага' },
        { name: 'Гуашь', tools: 'гуашь, кисти, бумага, вода' }
    ];

    let currentTechnique = '';
    // Текущая сгенерированная идея
    let currentIdea = '';
    
    // Функция получения случайного элемента из массива
    function randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    // Генерация полной идеи
    function generateIdea() {
        // 1. Выбираем жанр
        const genre = randomItem(genres);
        
        // 2. Выбираем сюжет в зависимости от жанра (если есть), иначе общий
       let subject = subjects[genre] ? randomItem(subjects[genre]) : 'интересный объект';
        const technique = randomItem(techniques);
        const color = randomItem(colorSchemes);
        const includeMood = Math.random() < 0.8;
        const mood = includeMood ? randomItem(moods) : '';
        
        // Собираем строку через разделители, без падежей
        let parts = [`Жанр: ${genre}`, `Сюжет: ${subject}`, `Техника: ${technique}`, `Цвет: ${color}`];
        if (mood) parts.push(`Настроение: ${mood}`);
        
        return parts.join('\n');
    }
    
    function displayRandomIdea() {
        currentIdea = generateIdea();
        ideaDisplay.innerHTML = currentIdea.replace(/\n/g, '<br>');
        console.log('Сгенерирована идея:', currentIdea);
    }
    
    function saveIdeaToNotebook() {
        if (!currentIdea) {
            alert('Сначала сгенерируйте идею!');
            return;
        }
        let savedIdeas = localStorage.getItem('artflow-ideas');
        let ideasArray = savedIdeas ? JSON.parse(savedIdeas) : [];
        const compactIdea = currentIdea.replace(/\n/g, '; ');
        ideasArray.push(compactIdea);  
        localStorage.setItem('artflow-ideas', JSON.stringify(ideasArray));
        console.log('Вызываю showIdeas...');
        if (typeof window.showIdeas === 'function') {
            window.showIdeas();
            console.log('showIdeas вызвана');
        } else {
            console.warn('showIdeas не функция');
        }

        alert('Идея сохранена в блокнот!');
    }
    
    generateBtn.addEventListener('click', displayRandomIdea);
    saveBtn.addEventListener('click', saveIdeaToNotebook);
    displayRandomIdea();
    console.log('✅ Генератор-конструктор готов');
});