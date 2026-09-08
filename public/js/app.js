// Сообщение при загрузке скрипта
console.log('ArtFlow Assistant v1.0 (с бэкендом) запущен!');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM готов');

    // ===== ТЕСТОВАЯ КНОПКА =====
    const btn = document.getElementById('testBtn');
    const msg = document.getElementById('message');
    if (btn && msg) {
        btn.addEventListener('click', () => {
            console.log('Кнопка нажата');
            msg.classList.remove('hidden');
            btn.disabled = true;
        });
    }

    // ===== БЛОКНОТ ИДЕЙ (с сервером) =====
    const ideaInput = document.getElementById('ideaInput');
    const addIdeaBtn = document.getElementById('addIdeaBtn');
    const ideasList = document.getElementById('ideasList');
    const ideasCount = document.getElementById('ideasCount');

    let ideas = []; // массив объектов { id, text, created_at }

    // ---- Вспомогательные функции ----
    function updateCounter() {
        if (ideasCount) {
            ideasCount.textContent = `(${ideas.length})`;
        }
    }

    // ---- Загрузка идей с сервера ----
    async function showIdeas() {
        try {
            const response = await fetch('http://localhost:3000/api/ideas');
            if (!response.ok) throw new Error('Ошибка загрузки');
            ideas = await response.json();
            updateCounter();

            ideasList.innerHTML = '';
            if (ideas.length === 0) {
                ideasList.innerHTML = '<p class="empty-message">Пока нет идей. Добавьте первую!</p>';
                return;
            }

            ideas.forEach(idea => {
                const ideaElement = document.createElement('div');
                ideaElement.className = 'idea-item';
                ideaElement.innerHTML = `
                    <span class="idea-text">${idea.text}</span>
                    <div class="idea-actions">
                        <button class="move-to-project-btn" data-id="${idea.id}" title="Перенести в трекер">📋</button>
                        <button class="delete-btn" data-id="${idea.id}" title="Удалить">🗑️</button>
                    </div>
                `;
                ideasList.appendChild(ideaElement);
            });

            // Обработчики для кнопок (делегирование)
            ideasList.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(btn.getAttribute('data-id'));
                    deleteIdea(id);
                });
            });

            ideasList.querySelectorAll('.move-to-project-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(btn.getAttribute('data-id'));
                    moveIdeaToProjects(id);
                });
            });

            console.log('Идеи загружены:', ideas.length);

        } catch (err) {
            console.error('Ошибка загрузки идей:', err);
            ideasList.innerHTML = '<p class="empty-message">⚠️ Ошибка загрузки идей с сервера</p>';
        }
    }

    // ---- Добавление идеи (POST) ----
    async function addIdea() {
        if (!ideaInput) return;
        const text = ideaInput.value.trim();
        if (text === '') {
            console.log('Пустая идея');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/ideas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            if (!response.ok) throw new Error('Ошибка добавления');
            const newIdea = await response.json();
            console.log('Добавлена идея:', newIdea);
            ideaInput.value = '';
            await showIdeas(); // обновляем список
        } catch (err) {
            console.error(err);
            alert('Не удалось добавить идею на сервер');
        }
    }

    // ---- Удаление идеи (DELETE) ----
    async function deleteIdea(id) {
        if (!confirm('Удалить идею?')) return;
        try {
            const response = await fetch(`http://localhost:3000/api/ideas/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Ошибка удаления');
            console.log(`Идея ${id} удалена`);
            await showIdeas();
        } catch (err) {
            console.error(err);
            alert('Не удалось удалить идею с сервера');
        }
    }

    // ---- Перенос идеи в проект (пока локально) ----
    async function moveIdeaToProjects(id) {
        const idea = ideas.find(item => item.id === id);
        if (!idea) {
            alert('Идея не найдена');
            return;
        }
        try {
        // 1. Создаём проект через API
        const response = await fetch('http://localhost:3000/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: idea.text })
        });
        if (!response.ok) throw new Error('Ошибка создания проекта');
        const newProject = await response.json();
        console.log('Проект создан:', newProject);

        // 2. Удаляем идею через API
        const deleteResponse = await fetch(`http://localhost:3000/api/ideas/${id}`, {
            method: 'DELETE'
        });
        if (!deleteResponse.ok) throw new Error('Ошибка удаления идеи');

        // 3. Обновляем интерфейс
        await showIdeas();
        if (typeof window.renderProjects === 'function') {
            window.renderProjects();
        }
        alert('Идея перенесена в проект!');
    } catch (err) {
        console.error(err);
        alert('Ошибка при переносе идеи в проект');
    }
}

    // ---- Обработчики событий ----
    if (addIdeaBtn) {
        addIdeaBtn.addEventListener('click', addIdea);
    }
    if (ideaInput) {
        ideaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addIdea();
        });
    }

    // ---- Инициализация ----
    showIdeas();
    console.log('✅ Блокнот идей с бэкендом готов');

    // ===== НАВИГАЦИЯ =====
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            localStorage.setItem('activeSection', sectionId);
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            contentSections.forEach(section => section.classList.remove('active'));
            const targetSection = document.getElementById(`${sectionId}-section`);
            if (targetSection) targetSection.classList.add('active');
        });
    });

    // Восстанавливаем активную вкладку
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
        const savedBtn = document.querySelector(`.nav-btn[data-section="${savedSection}"]`);
        if (savedBtn) savedBtn.click();
    }

    console.log('✅ Навигация настроена');
});