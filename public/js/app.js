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