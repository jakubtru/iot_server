const express = require('express');
const bodyParser = require('body-parser');
const db = require("../db");
const sqlite3 = require('sqlite3').verbose();

const app = express.Router();
app.use(bodyParser.json());


app.get('', (req, res) => {
    db.all('SELECT * FROM Users', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(rows);
    });
});

app.get('/:email', (req, res) => {
    const email = req.params.email;
    const query = 'SELECT * FROM Users WHERE email = ?';
    db.get(query, [email], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(row);
    });
});

app.post('', (req, res) => {
    const { email, password, username, token } = req.body;

    if (!username || !email || !password || !token) {
        return res.status(400).json({ error: 'Brak wymaganych danych' });
    }
    const query = 'INSERT INTO Users (email, password, username, token) VALUES (?, ?, ?, ?)';
    console.log('Zapytanie SQL:', query);
    console.log('Wartości:', [email, password, username, token]);

    db.run(query, [email, password, username, token], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }
        res.status(201).json({ message: 'Użytkownik został dodany' });
    });
});

app.put('/:userID', (req, res) => {
    const userID = req.params.userID;
    const { email, password, username, token } = req.body;

    const query = 'UPDATE Users SET email = ?, password = ?, username = ?, token = ? WHERE userID = ?';
    db.run(query, [email, password, username, token, userID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Użytkownik nie istnieje' });
        }

        res.json({ message: 'Dane użytkownika zostały zaktualizowane' });
    });
});


app.delete('/:userID', (req, res) => {
    const userID = req.params.userID;
    const query = 'DELETE FROM Users WHERE userID = ?';
    db.run(query, [userID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Użytkownik nie istnieje' });
        }
        res.json({ message: 'Użytkownik został usunięty' });
    });
});

module.exports = app;