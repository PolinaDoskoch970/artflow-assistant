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
        // Перезагружаем идеи из localStorage
        const saved = localStorage.getItem('artflow-ideas');
        if (saved) {
            ideas = JSON.parse(saved);
        } else {
            ideas = [];
        }
        updateCounter(); // обновим счётчик
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
            <div class="idea-actions">
                <button class="move-to-project-btn" data-index="${index}" title="Перенести в трекер">📋</button>
                <button class="delete-btn" data-index="${index}" title="Удалить">🗑️</button>
            </div>
        `;
            ideasList.appendChild(ideaElement);
            
            // Добавляем обработчик удаления
            const deleteBtn = ideaElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                const deleteIndex = parseInt(this.getAttribute('data-index'));
                deleteIdea(deleteIndex);
            });
            // Обработчик переноса в трекер
            const moveBtn = ideaElement.querySelector('.move-to-project-btn');
            moveBtn.addEventListener('click', function() {
                const moveIndex = parseInt(this.getAttribute('data-index'));
                moveIdeaToProjects(moveIndex);
            });
        });
        console.log('Показано идей:', ideas.length);
    }
    window.showIdeas = showIdeas;
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
        // Функция переноса идеи в трекер проектов
    function moveIdeaToProjects(index) {
        const ideaText = ideas[index];
        if (!ideaText) return;
        
        // Получаем текущие проекты из localStorage
        let projects = localStorage.getItem('artflow-projects-v2');
        let projectsArray = projects ? JSON.parse(projects) : [];
        
        // Создаём новый проект с этапами по умолчанию
        const newProject = {
            id: Date.now(),
            name: ideaText,
            stages: [
                { name: 'Эскиз', status: 'current' },
                { name: 'Цветовая основа', status: 'pending' },
                { name: 'Детализация', status: 'pending' },
                { name: 'Фон', status: 'pending' },
                { name: 'Освещение', status: 'pending' }
            ],
            createdAt: new Date().toLocaleDateString()
        };
        projectsArray.push(newProject);
        localStorage.setItem('artflow-projects-v2', JSON.stringify(projectsArray));
        
        // Удаляем идею из блокнота
        ideas.splice(index, 1);
        localStorage.setItem('artflow-ideas', JSON.stringify(ideas));
        
        // Обновляем интерфейс блокнота
        updateCounter();
        showIdeas();
        
        // Обновляем трекер проектов (если функция renderProjects глобальна)
        if (typeof window.renderProjects === 'function') {
            window.renderProjects();
        }
        console.log(`Идея "${ideaText}" перенесена в трекер проектов`);
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
        // ===== ПЕРЕКЛЮЧЕНИЕ МЕЖДУ РАЗДЕЛАМИ =====
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            // Убираем активный класс у всех кнопок
            navButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            // Скрываем все секции
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            // Показываем нужную секцию
            const targetSection = document.getElementById(`${sectionId}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
                console.log(`Переключились на раздел: ${sectionId}`);
            }
        });
    });
    console.log('Навигация настроена');
});