// Сообщение при загрузке скрипта
console.log('ArtFlow Assistant v0.2 запущен!');
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
    // Массив для хранения идей
    let ideas = [];
    // Загружаем сохраненные идеи из localStorage
    const savedIdeas = localStorage.getItem('artflow-ideas');
    if (savedIdeas) {
        ideas = JSON.parse(savedIdeas);
        console.log('Загружено идей из localStorage:', ideas.length);
    }
    // Функция для обновления счетчика
    function updateCounter() {
        if (ideasCount) {
            ideasCount.textContent = `(${ideas.length})`;
            console.log(`Счетчик: ${ideas.length} идей`);
        }
    }
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
        localStorage.setItem('artflow-ideas', JSON.stringify(ideas));
        // Очищаем поле ввода
        ideaInput.value = '';
        // Обновляем счетчик
        updateCounter();  
        showIdeas(); // ПОКАЗЫВАЕМ ИДЕИ В СПИСКЕ
        console.log(`Теперь идей: ${ideas.length}`);
    }
     // Функция для показа идей в списке
     function showIdeas() {
        console.log('Показываю идеи...')
        //Очищаем список
        ideasList.innerHTML = '';
        //Сообщение, если нет идей
        if (ideas.length === 0) {
             ideasList.innerHTML = '<p class="empty-message">Пока нет идей. Добавьте первую!</p>';
            return;
         }
         //Для каждой идеи создаем элемент
        ideas.forEach(function(ideaText, index) {
            const ideaElement = document.createElement('div');
            ideaElement.className = 'idea-item';
            ideaElement.innerHTML = `
                <span class="idea-text">${ideaText}</span>
                <button class="delete-btn" data-index="${index}">🗑️</button>
            `;
            ideasList.appendChild(ideaElement);
            
            // Добавляем обработчик удаления
            const deleteBtn = ideaElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                const deleteIndex = parseInt(this.getAttribute('data-index'));
                deleteIdea(deleteIndex);
            });
        });
        console.log('Показано идей:', ideas.length);
     }
    // Функция для удаления идеи
    function deleteIdea(index) {
        console.log(`Удаляю идею с индексом ${index}: "${ideas[index]}"`);
        // Удаляем из массива
        ideas.splice(index, 1);
        // Сохраняем в localStorage
        localStorage.setItem('artflow-ideas', JSON.stringify(ideas)); 
        // Обновляем интерфейс
        updateCounter();
        showIdeas();
    }     
     // Обработчик для кнопки "Добавить идею"
    if (addIdeaBtn) {
        addIdeaBtn.addEventListener('click', addIdea);
        console.log('Обработчик добавлен на кнопку');
    }
        // Обработчик для клавиши Enter
    if (ideaInput) {
        ideaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Нажат Enter');
                addIdea();
            }
        });
    }
    // Инициализируем счетчик
    updateCounter();
    showIdeas(); //Показываем сохраненные идеи
    console.log('✅ Блокнот идей готов к работе');
    });