const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8080;

// Раздача статических файлов (страница поиска)
app.use(express.static(path.join(__dirname, 'public')));

// Функция для загрузки документов в память
function loadDocuments() {
    const folderPath = path.join(__dirname, 'data');
    const files = fs.readdirSync(folderPath);
    let documents = [];

    files.forEach(file => {
        const content = fs.readFileSync(path.join(folderPath, file), 'utf-8');
        documents.push({ filename: file, content });
    });

    return documents;
}

// Загружаем документы (предполагаем, что у вас есть файлы в папке `data/`)
const documents = loadDocuments();

// Функция поиска
function searchDocuments(query) {
    const words = query.toLowerCase().trim().split(/\s+/); // Разбиваем запрос на слова
    let results = [];

    documents.forEach(doc => {
        const contentLower = doc.content.toLowerCase();
        
        // Проверяем, содержит ли документ ВСЕ слова из запроса
        if (words.every(word => contentLower.includes(word))) {
            results.push(doc);
        }
    });

    return results;
}

// Обработка поиска
app.get('/search', (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.json({ error: 'Введите поисковый запрос' });
    }

    const results = searchDocuments(query);
    res.json(results);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

