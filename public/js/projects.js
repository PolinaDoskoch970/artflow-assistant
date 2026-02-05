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
});