// Трекер проектов - версия с бэкендом
console.log('📋 Трекер проектов (с бэкендом) загружен');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация трекера...');
    
    const projectInput = document.getElementById('projectNameInput');
    const addBtn = document.getElementById('addProjectBtn');
    const projectsList = document.getElementById('projects-list');
    
    if (!projectInput || !addBtn || !projectsList) {
        console.error('Элементы трекера не найдены');
        return;
    }
    
    let projects = [];
    
    // ---- Защита от XSS ----
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // ---- Загрузка проектов с сервера ----
    async function renderProjects() {
        try {
            const response = await fetch('http://localhost:3000/api/projects');
            if (!response.ok) throw new Error('Ошибка загрузки проектов');
            projects = await response.json();
            console.log('Загружено проектов:', projects.length);
            
            projectsList.innerHTML = '';
            if (projects.length === 0) {
                projectsList.innerHTML = '<p class="empty-message">Пока нет проектов. Добавьте первый!</p>';
                return;
            }
            
            projects.forEach(project => {
                const stages = project.stages || [];
                const completed = stages.filter(s => s.status === 'done').length;
                const percent = stages.length ? Math.round(completed / stages.length * 100) : 0;
                
                const card = document.createElement('div');
                card.className = 'project-card';
                card.innerHTML = `
                    <h3>🎨 ${escapeHtml(project.name)}</h3>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percent}%"></div>
                        </div>
                        <span class="progress-text">${percent}%</span>
                    </div>
                    <div class="stages">
                        ${stages.map(stage => {
                            let icon = '';
                            if (stage.status === 'done') icon = '✅';
                            else if (stage.status === 'current') icon = '⏳';
                            else icon = '✗';
                            return `<div class="stage stage-${stage.status}">${icon} ${escapeHtml(stage.name)}</div>`;
                        }).join('')}
                    </div>
                    <div class="project-actions">
                        <button class="btn-small stage-done-btn" data-id="${project.id}" data-action="complete">✓</button>
                        <button class="btn-small stage-next-btn" data-id="${project.id}" data-action="next">→</button>
                        <button class="btn-small stage-delete-btn" data-id="${project.id}" data-action="delete">✗</button>
                    </div>
                `;
                projectsList.appendChild(card);
            });
            
            // Обработчики через делегирование
            document.querySelectorAll('.stage-done-btn, .stage-next-btn, .stage-delete-btn').forEach(btn => {
                btn.addEventListener('click', handleButtonClick);
            });
            
        } catch (err) {
            console.error('Ошибка загрузки проектов:', err);
            projectsList.innerHTML = '<p class="empty-message">⚠️ Ошибка загрузки проектов с сервера</p>';
        }
    }
    window.renderProjects = renderProjects;
    
    // ---- Добавление проекта ----
    async function addProject() {
        const name = projectInput.value.trim();
        if (!name) {
            alert('Введите название проекта');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            if (!response.ok) throw new Error('Ошибка добавления');
            const newProject = await response.json();
            console.log('Проект добавлен:', newProject);
            projectInput.value = '';
            await renderProjects();
        } catch (err) {
            console.error(err);
            alert('Не удалось добавить проект на сервер');
        }
    }
    
    // ---- Удаление проекта ----
    async function deleteProject(projectId) {
        if (!confirm('Удалить проект?')) return;
        try {
            const response = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Ошибка удаления');
            console.log('Проект удалён');
            await renderProjects();
        } catch (err) {
            console.error(err);
            alert('Не удалось удалить проект с сервера');
        }
    }
    
    // ---- Отметить этап выполненным ----
    async function completeStage(projectId) {
        try {
            const response = await fetch(`http://localhost:3000/api/projects/${projectId}/stage`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'complete' })
            });
            if (!response.ok) throw new Error('Ошибка обновления');
            await renderProjects();
        } catch (err) {
            console.error(err);
            alert('Не удалось обновить этап');
        }
    }
    
    // ---- Перейти к следующему этапу ----
    async function nextStage(projectId) {
        try {
            const response = await fetch(`http://localhost:3000/api/projects/${projectId}/stage`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'next' })
            });
            if (!response.ok) throw new Error('Ошибка обновления');
            await renderProjects();
        } catch (err) {
            console.error(err);
            alert('Не удалось обновить этап');
        }
    }
    
    // ---- Обработчик кликов по кнопкам ----
    function handleButtonClick(e) {
        const btn = e.currentTarget;
        const projectId = parseInt(btn.getAttribute('data-id'));
        const action = btn.getAttribute('data-action');
        if (action === 'complete') completeStage(projectId);
        else if (action === 'next') nextStage(projectId);
        else if (action === 'delete') deleteProject(projectId);
    }
    
    // ---- Обработчики для добавления ----
    addBtn.addEventListener('click', addProject);
    projectInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addProject();
    });
    
    // ---- Инициализация ----
    renderProjects();
    console.log('✅ Трекер проектов с бэкендом готов');
});