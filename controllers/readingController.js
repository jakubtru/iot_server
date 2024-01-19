const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = require("../db");

const app = express.Router();
app.use(bodyParser.json());


app.get('/temperature/:sensorID', (req, res) => {
    const sensorID = req.params.sensorID;

    const query = 'SELECT * FROM TemperatureReadings WHERE sensorID = ?';
    db.all(query, [sensorID], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Błąd bazy danych' });
            return;
        }
        res.json(rows);
    });
});

app.get('/humidity/:sensorID', (req, res) => {
    const sensorID = req.params.sensorID;

    const query = 'SELECT * FROM TemperatureReadings WHERE sensorID = ?';
    db.all(query, [sensorID], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Błąd bazy danych' });
            return;
        }
        res.json(rows);
    });
});

app.get('/:sensorID/newest', (req, res) => {
    const sensorID = req.params.sensorID;

    const query1 = 'SELECT * FROM TemperatureReadings WHERE sensorID = ? ORDER BY timestamp DESC LIMIT 1';
    const query2 = 'SELECT * FROM HumidityReadings WHERE sensorID = ? ORDER BY timestamp DESC LIMIT 1';

    let temperatureReading, humidityReading;

    db.get(query1, [sensorID], (err, temperatureRow) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Database error' });
        }

        temperatureReading = temperatureRow;

        db.get(query2, [sensorID], (err, humidityRow) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Database error' });
            }
            humidityReading = humidityRow;

            const combinedReading = {
                temperature: temperatureReading ? temperatureReading.reading : null,
                humidity: humidityReading ? humidityReading.reading : null,
            };
            res.json(combinedReading);
        });
    });
});

module.exports = app;

