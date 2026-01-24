// Сообщение при загрузке скрипта
console.log('ArtFlow Assistant v0.1 запущен!');
// Полная загрузка  
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM готов');
     // Получаем элементы со страницы
    const btn = document.getElementById('testBtn');
    const msg = document.getElementById('message');
    
    console.log('Найдена кнопка?', btn);
    console.log('Найдено сообщение?', msg);
     // Обработчик клика по кнопке
    btn.addEventListener('click', () => {
        console.log('Кнопка нажата');
        msg.classList.remove('hidden');
        btn.disabled = true;
    });
    
    console.log('Система инициализирована');
});