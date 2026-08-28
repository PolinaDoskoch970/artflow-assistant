const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к БД
const db = new Database('./artflow.db');

// Создание таблиц
db.exec(`
    CREATE TABLE IF NOT EXISTS ideas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS stages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
    );
`);
console.log('✅ Таблицы созданы (или уже существуют)');

// 1. API для идей

app.get('/api/ideas', (req, res) => {
    try {
        const stmt = db.prepare('SELECT * FROM ideas ORDER BY created_at DESC');
        const ideas = stmt.all();
        res.json(ideas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/ideas', (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ error: 'Текст идеи обязателен' });
        }
        const stmt = db.prepare('INSERT INTO ideas (text) VALUES (?)');
        const info = stmt.run(text.trim());
        const newIdea = db.prepare('SELECT * FROM ideas WHERE id = ?').get(info.lastInsertRowid);
        res.status(201).json(newIdea);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/ideas/:id', (req, res) => {
    try {
        const id = req.params.id;
        const stmt = db.prepare('DELETE FROM ideas WHERE id = ?');
        const result = stmt.run(id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Идея не найдена' });
        }
        res.json({ message: 'Идея удалена' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


// 2. API для проектов

// GET /api/projects — получить все проекты с этапами
app.get('/api/projects', (req, res) => {
    try {
        const projectsStmt = db.prepare('SELECT * FROM projects ORDER BY created_at DESC');
        const projects = projectsStmt.all();
        const stagesStmt = db.prepare('SELECT * FROM stages WHERE project_id = ? ORDER BY id');
        const result = projects.map(project => {
            const stages = stagesStmt.all(project.id);
            return { ...project, stages };
        });
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/projects — создать проект с этапами по умолчанию
app.post('/api/projects', (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Название проекта обязательно' });
        }
        // Вставляем проект
        const projectStmt = db.prepare('INSERT INTO projects (name) VALUES (?)');
        const projectInfo = projectStmt.run(name.trim());
        const projectId = projectInfo.lastInsertRowid;
        // Создаём этапы по умолчанию
        const defaultStages = ['Эскиз', 'Цветовая основа', 'Детализация', 'Фон', 'Освещение'];
        const stageStmt = db.prepare('INSERT INTO stages (project_id, name, status) VALUES (?, ?, ?)');
        for (let i = 0; i < defaultStages.length; i++) {
            const status = (i === 0) ? 'current' : 'pending';
            stageStmt.run(projectId, defaultStages[i], status);
        }
        // Возвращаем созданный проект с этапами
        const newProject = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
        const stages = db.prepare('SELECT * FROM stages WHERE project_id = ?').all(projectId);
        res.status(201).json({ ...newProject, stages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/projects/:id — удалить проект (каскадно удаляет этапы)
app.delete('/api/projects/:id', (req, res) => {
    try {
        const id = req.params.id;
        const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
        const result = stmt.run(id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Проект не найден' });
        }
        res.json({ message: 'Проект удалён' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// PATCH /api/projects/:id/stage — отметить этап выполненным или переключить
app.patch('/api/projects/:id/stage', (req, res) => {
    try {
        const projectId = req.params.id;
        const { action } = req.body; // 'complete' или 'next'
        // Получаем все этапы проекта
        const stagesStmt = db.prepare('SELECT * FROM stages WHERE project_id = ? ORDER BY id');
        const stages = stagesStmt.all(projectId);
        if (stages.length === 0) {
            return res.status(404).json({ error: 'Этапы не найдены' });
        }
        let currentIndex = stages.findIndex(s => s.status === 'current');
        if (action === 'complete') {
            if (currentIndex === -1) {
                return res.status(400).json({ error: 'Нет текущего этапа' });
            }
            const updateStmt = db.prepare('UPDATE stages SET status = ? WHERE id = ?');
            updateStmt.run('done', stages[currentIndex].id);
            if (currentIndex + 1 < stages.length) {
                updateStmt.run('current', stages[currentIndex + 1].id);
            }
        } else if (action === 'next') {
            const updateStmt = db.prepare('UPDATE stages SET status = ? WHERE id = ?');
            if (currentIndex !== -1) {
                updateStmt.run('done', stages[currentIndex].id);
            }
            if (currentIndex + 1 < stages.length) {
                updateStmt.run('current', stages[currentIndex + 1].id);
            }
        } else {
            return res.status(400).json({ error: 'Неизвестное действие' });
        }
        // Возвращаем обновлённый проект
        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(projectId);
        const updatedStages = db.prepare('SELECT * FROM stages WHERE project_id = ? ORDER BY id').all(projectId);
        res.json({ ...project, stages: updatedStages });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Корневой маршрут (проверка)
app.get('/', (req, res) => {
    res.send('ArtFlow Assistant API работает!');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
});