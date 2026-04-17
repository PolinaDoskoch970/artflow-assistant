// Трекер проектов - новая версия (прогресс с этапами)
console.log('📋 Новый трекер проектов загружен');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация нового трекера...');
    
    // Элементы
    const projectInput = document.getElementById('projectNameInput');
    const addBtn = document.getElementById('addProjectBtn');
    const projectsList = document.getElementById('projects-list');
    
    if (!projectInput || !addBtn || !projectsList) {
        console.error('Элементы нового трекера не найдены');
        return;
    }
    
    console.log('✅ Элементы найдены');
    
    // Массив проектов
    let projects = [];
    
    // Загрузка из localStorage
    const saved = localStorage.getItem('artflow-projects-v2');
    if (saved) {
        projects = JSON.parse(saved);
        console.log('Загружено проектов:', projects.length);
    }
    
    // Сохранение
    function saveProjects() {
        localStorage.setItem('artflow-projects-v2', JSON.stringify(projects));
        console.log('Сохранено проектов:', projects.length);
    }
    
    // Добавление проекта
    function addProject() {
        const name = projectInput.value.trim();
        if (!name) return;
        
        // Стандартные этапы для художника
        const stages = [
            { name: 'Эскиз', status: 'pending' },
            { name: 'Цветовая основа', status: 'pending' },
            { name: 'Детализация', status: 'pending' },
            { name: 'Фон', status: 'pending' },
            { name: 'Освещение', status: 'pending' }
        ];
        
        const newProject = {
            id: Date.now(),
            name: name,
            stages: stages,
            createdAt: new Date().toLocaleDateString()
        };
        
        projects.push(newProject);
        saveProjects();
        projectInput.value = '';
        renderProjects();
        console.log('Добавлен проект:', name);
    }
    
    // Обработчики
    addBtn.addEventListener('click', addProject);
    projectInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addProject();
    });
    
    // Функция отображения (пока заглушка)
    function renderProjects() {
        console.log('Отрисовка проектов...');
        projectsList.innerHTML = '';
        if (projects.length === 0) {
            projectsList.innerHTML = '<p class="empty-message">Пока нет проектов. Добавьте первый!</p>';
            return;
        }
        // TODO: добавить отрисовку карточек
    }
    
    // Инициализация
    renderProjects();
    console.log('✅ Новый трекер проектов готов');
});