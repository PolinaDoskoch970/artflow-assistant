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