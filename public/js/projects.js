// Трекер проектов
console.log('📋 Трекер проектов загружен');
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализирую трекер проектов...');
    // Элементы
    const projectInput = document.getElementById('projectInput');
    const addProjectBtn = document.getElementById('addProjectBtn');
    if (!projectInput || !addProjectBtn) {
        console.log('Элементы трекера проектов не найдены');
        return;
    }
    console.log('✅ Элементы трекера проектов найдены');
 // Массив для проектов
    let projects = [];
    // Загружаем из localStorage
    const savedProjects = localStorage.getItem('artflow-projects');
    if (savedProjects) {
        projects = JSON.parse(savedProjects);
        console.log('Загружено проектов:', projects.length);
    }
    // Функция для сохранения
    function saveProjects() {
        localStorage.setItem('artflow-projects', JSON.stringify(projects));
        console.log('Проекты сохранены:', projects.length);
    }
     // Функция добавления нового проекта
    function addProject() {
        const text = projectInput.value.trim();
        if (text === '') {
            console.log('Пустое название проекта - игнорирую');
            return;
        }
        console.log('Добавляю проект:', text);
        // Создаем объект проекта
        const project = {
            id: Date.now(), // уникальный ID
            text: text,
            column: 'planning', // начальная колонка
            createdAt: new Date().toLocaleDateString()
        };
        projects.push(project);
        saveProjects();
        // Очищаем поле ввода
        projectInput.value = '';
        renderProjects();
        console.log('Проект добавлен. Всего:', projects.length);
    }
        // Обработчики событий
    addProjectBtn.addEventListener('click', addProject);
    projectInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            console.log('Нажат Enter для добавления проекта');
            addProject();
        }
    });  
    console.log('✅ Трекер проектов готов к добавлению проектов');
    //Функция отображения проектов
    function renderProjects() {
        console.log('Отрисовываю проекты...');
        const planningColumn = document.getElementById('column-planning');
        if (!planningColumn) return;
        planningColumn.innerHTML = '';
         // Фильтруем проекты для колонки "planning"
        const planningProjects = projects.filter(p => p.column === 'planning');
        // Если проектов нет
        if (planningProjects.length=== 0) {
            planningColumn.innerHTML = '<p class ="empty-message">Пока нет проектов</р>';
            return;
        }
        // Создаем карточки для каждого проекта
        planningProjects.forEach(function(project) {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.textContent = project.text;
            planningColumn.appendChild(projectCard);
        });
        console.log('Отображено проектов в "Планирую":', planningProjects.length);        
    }
});