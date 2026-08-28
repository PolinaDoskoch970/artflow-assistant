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

// ---------- API для идей ----------
// GET /api/ideas — получить все идеи
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

// POST /api/ideas — добавить новую идею
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

// DELETE /api/ideas/:id — удалить идею по id
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

// ---------- Корневой маршрут (проверка) ----------
app.get('/', (req, res) => {
    res.send('ArtFlow Assistant API работает!');
});

// ---------- Запуск сервера ----------
app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}`);
});