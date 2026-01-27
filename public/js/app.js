// Сообщение при загрузке скрипта
console.log('ArtFlow Assistant v0.1 запущен!');
// Полная загрузка  
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM готов');
     // ТЕСТОВАЯ КНОПКА
    const btn = document.getElementById('testBtn');
    const msg = document.getElementById('message');
    console.log('Найдена кнопка?', btn);
    console.log('Найдено сообщение?', msg);
    btn.addEventListener('click', () => {
        console.log('Кнопка нажата');
        msg.classList.remove('hidden');
        btn.disabled = true;
    }); 
    console.log('Система инициализирована');
// ===== БЛОКНОТ ИДЕЙ =====
    // Находим элементы для работы с идеями
    const ideaInput = document.getElementById('ideaInput');
    const addIdeaBtn = document.getElementById('addIdeaBtn');
    const ideasList = document.getElementById('ideasList');
    const ideasCount = document.getElementById('ideasCount');
    
    console.log('Найдены элементы для идей:', {
        input: ideaInput,
        button: addIdeaBtn,
        list: ideasList,
        counter: ideasCount
    });
});
    // Массив для хранения идей
    let ideas = [];
    // Функция для обновления счетчика
    function updateCounter() {
        if (ideasCount) {
            ideasCount.textContent = `(${ideas.length})`;
            console.log(`Счетчик: ${ideas.length} идей`);
        }
    }
    // Инициализируем счетчик
    updateCounter();
    // Функция для добавления новой идеи
    function addIdea() {
        if (!ideaInput) return;
        const text = ideaInput.value.trim();
        if (text === '') {
            console.log('Пустая идея - игнорирую');
            return;
        }
        console.log(`Добавляю идею: "${text}"`);
        // Добавляем в массив
        ideas.push(text);
        // Очищаем поле ввода
        ideaInput.value = '';
        // Обновляем счетчик
        updateCounter();  
        console.log(`Теперь идей: ${ideas.length}`);
    }