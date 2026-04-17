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
    
    // Вспомогательная функция для защиты от XSS
    function escapeHtml(str) {
        return str.replace(/[&<>]/g, function(m) {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
    
    // Добавление проекта
    function addProject() {
        const name = projectInput.value.trim();
        if (!name) {
            alert('Введите название проекта');
            return;
        }
        
        // Стандартные этапы для художника
        const stages = [
            { name: 'Эскиз', status: 'current' },
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
    
    // Отметить этап выполненным
    function completeStage(projectId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;
        
        const stages = project.stages;
        const currentIndex = stages.findIndex(s => s.status === 'current');
        if (currentIndex === -1) return;
        
        // Отмечаем текущий этап как done
        stages[currentIndex].status = 'done';
        
        // Если есть следующий этап, делаем его current
        if (currentIndex + 1 < stages.length) {
            stages[currentIndex + 1].status = 'current';
        }
        
        saveProjects();
        renderProjects();
        console.log(`Этап "${stages[currentIndex].name}" завершен для проекта "${project.name}"`);
    }
    
    // Перейти к следующему этапу (без отметки текущего как done, просто переключить current)
    function nextStage(projectId) {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;
        
        const stages = project.stages;
        const currentIndex = stages.findIndex(s => s.status === 'current');
        if (currentIndex === -1) return;
        
        // Можно отметить текущий как done (как и в completeStage) для единообразия
        stages[currentIndex].status = 'done';
        
        if (currentIndex + 1 < stages.length) {
            stages[currentIndex + 1].status = 'current';
        }
        
        saveProjects();
        renderProjects();
        console.log(`Переход к следующему этапу для проекта "${project.name}"`);
    }
    
    // Удалить проект
    function deleteProject(projectId) {
        if (!confirm('Удалить проект?')) return;
        projects = projects.filter(p => p.id !== projectId);
        saveProjects();
        renderProjects();
        console.log('Проект удален');
    }
    
    // Отрисовка проектов
    function renderProjects() {
        // Перезагружаем проекты из localStorage
        const saved = localStorage.getItem('artflow-projects-v2');
        if (saved) {
            projects = JSON.parse(saved);
        } else {
            projects = [];
        }
        console.log('renderProjects: загружено проектов', projects.length);
        console.log('Отрисовка проектов...');
        projectsList.innerHTML = '';
        if (projects.length === 0) {
            projectsList.innerHTML = '<p class="empty-message">Пока нет проектов. Добавьте первый!</p>';
            return;
        }
        
        projects.forEach(project => {
            const completed = project.stages.filter(s => s.status === 'done').length;
            const percent = Math.round(completed / project.stages.length * 100);
            
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
                    ${project.stages.map(stage => {
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
        
        // Добавляем обработчики на кнопки (через делегирование)
        document.querySelectorAll('.stage-done-btn, .stage-next-btn, .stage-delete-btn').forEach(btn => {
            btn.removeEventListener('click', handleButtonClick);
            btn.addEventListener('click', handleButtonClick);
        });
    }
    window.renderProjects = renderProjects;
    function handleButtonClick(e) {
        const btn = e.currentTarget;
        const projectId = parseInt(btn.getAttribute('data-id'));
        const action = btn.getAttribute('data-action');
        
        if (action === 'complete') completeStage(projectId);
        else if (action === 'next') nextStage(projectId);
        else if (action === 'delete') deleteProject(projectId);
    }
    
    // Обработчики для добавления
    addBtn.addEventListener('click', addProject);
    projectInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addProject();
    });
    
    // Инициализация
    renderProjects();
    console.log('✅ Новый трекер проектов готов');
});