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
            res.status(500).json({error: 'Błąd bazy danych'});
            return;
        }
        res.json(rows);
    });
});


app.get('/:userID', (req, res) => {
    const id = req.params.userID;
    const query = 'SELECT sensorID, name, role FROM Sensor NATURAL JOIN "User-Sensor Linkage" WHERE userID = ?';
    db.all(query, [id], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Błąd bazy danych'});
            return;
        }
        res.json(rows);
    });
});


app.post('', (req, res) => {
    const {name, sensorID, userID} = req.body;
    if (!name) {
        return res.status(400).json({error: 'Brak wymaganych danych'});
    }
    //check if sensor exists - na wypadek gdyby sensor istniał ale został usunięty z powiązań
    //wtedy zmieniamy tylko imię a historia zostaje
    const query1 = 'SELECT * FROM Sensor WHERE sensorID = ?';
    db.get(query1, [sensorID], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Błąd bazy danych'});
        }
        if (row) {
            //sensor exists w takim razie zmień tylko imię na nowe
            const query2 = 'UPDATE Sensor SET name = ? WHERE sensorID = ?';
            db.run(query2, [name, sensorID], function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({error: 'Błąd bazy danych'});
                }
                res.status(201).json({message: 'Nowy sensor został dodany'});
            });
        } else {
            const query = 'INSERT INTO Sensor (sensorID, name) VALUES (?, ?)';
            db.run(query, [sensorID, name], function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({error: 'Błąd bazy danych'});
                }
                res.status(201).json({message: 'Nowy sensor został dodany'});
            });
        }
    });
    const query2 = 'INSERT INTO "User-Sensor Linkage" (userID, sensorID, role) VALUES (?, ?, ?)';
    db.run(query2, [userID, sensorID, 1], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Błąd bazy danych'});
        }
    });
});

app.put('/:sensorID', (req, res) => {
    const sensorID = req.params.sensorID;
    const {name} = req.body;
    const query = 'UPDATE Sensor SET name = ? WHERE sensorID = ?';
    db.run(query, [name, sensorID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Błąd bazy danych'});
        }

        if (this.changes === 0) {
            return res.status(404).json({error: 'Sensor nie istnieje'});
        }
        res.json({message: 'Dane sensora zostały zaktualizowane'});
    });
});

app.delete('/:sensorID/permanent', (req, res) => {
    const sensorID = req.params.sensorID;

    const query1 = 'DELETE FROM TemperatureReadings WHERE sensorID = ?';
    db.run(query1, [sensorID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Błąd bazy danych'});
        }

    });
    const query2 = 'DELETE FROM HumidityReadings WHERE sensorID = ?';
    db.run(query2, [sensorID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Błąd bazy danych'});
        }

    });

    const query3 = 'DELETE FROM "User-Sensor Linkage" WHERE sensorID = ?';
    db.run(query3, [sensorID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Błąd bazy danych'});
        }
    });

    const query4 = 'DELETE FROM Sensor WHERE sensorID = ?';
    db.run(query4, [sensorID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Błąd bazy danych'});
        }

        if (this.changes === 0) {
            return res.status(404).json({error: 'Sensor nie istnieje'});
        }
        res.json({message: 'Sensor został usunięty'});
    });

});

module.exports = app;
