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
        console.log('Проект добавлен. Всего:', projects.length);
    }
});