// Сообщение при загрузке скрипта
console.log('ArtFlow Assistant v0.9 (с бэкендом) запущен!');

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
    function moveIdeaToProjects(id) {
        const idea = ideas.find(item => item.id === id);
        if (!idea) {
            alert('Идея не найдена');
            return;
        }

        // Получаем текущие проекты из localStorage (пока так)
        let projects = localStorage.getItem('artflow-projects-v2');
        let projectsArray = projects ? JSON.parse(projects) : [];

        const newProject = {
            id: Date.now(),
            name: idea.text,
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

        // Удаляем идею с сервера
        deleteIdea(id); // она сама обновит список

        // Обновляем трекер, если функция доступна
        if (typeof window.renderProjects === 'function') {
            window.renderProjects();
        }
        alert('Идея перенесена в проект!');
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