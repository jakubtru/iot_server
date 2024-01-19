const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = require("../db");

const app = express.Router();
app.use(bodyParser.json());


app.get('', (req, res) => {
    db.all('SELECT * FROM Sensor', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Błąd bazy danych' });
            return;
        }
        res.json(rows);
    });
});


app.get('/:userID', (req, res) => {
    const id = req.params.userID;
    const query = 'SELECT sensorID, name FROM Sensor NATURAL JOIN "User-Sensor Linkage" WHERE userID = ?';
    db.all(query, [id], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Błąd bazy danych' });
            return;
        }
        res.json(rows);
    });
});


app.post('', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Brak wymaganych danych' });
    }
    const query = 'INSERT INTO Sensor (name) VALUES (?)';
    db.run(query, [name], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }
        res.status(201).json({ message: 'Sensor został dodany' });
    });
});

app.put('/:sensorID', (req, res) => {
    const sensorID = req.params.sensorID;
    const { name } = req.body;
    const query = 'UPDATE Sensor SET name = ? WHERE sensorID = ?';
    db.run(query, [name, sensorID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Sensor nie istnieje' });
        }
        res.json({ message: 'Dane sensora zostały zaktualizowane' });
    });
});



app.delete('/:sensorID', (req, res) => {
    const sensorID = req.params.sensorID;
    const query = 'DELETE FROM Sensor WHERE sensorID = ?';
    db.run(query, [sensorID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Sensor nie istnieje' });
        }
        res.json({ message: 'Sensor został usunięty' });
    });
});

module.exports = app;
