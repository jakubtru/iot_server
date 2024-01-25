const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const db = require("../db");

const app = express.Router();
app.use(bodyParser.json());

app.get('/temperature/:sensorID/daily', (req, res) => {
    const sensorID = req.params.sensorID;
    console.log('sensorID: ' + sensorID);

    const query = 'SELECT ROUND(AVG(reading), 1) AS reading, strftime("%H", timestamp) AS time FROM TemperatureReadings WHERE sensorID = ? AND timestamp > datetime("now", "-1 day") GROUP BY time ORDER BY timestamp DESC';

    db.all(query, [sensorID], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Błąd bazy danych'});
            return;
        }

        const result = [];
        for (let i = 0; i < rows.length; i += 3) {
            result.push(rows[i]);
        }
        res.json(result);
    });
});

app.get('/humidity/:sensorID/daily', (req, res) => {
    const sensorID = req.params.sensorID;
    console.log('sensorID: ' + sensorID);

    const query = 'SELECT ROUND(AVG(reading), 1) AS reading, strftime("%H", timestamp) AS time FROM HumidityReadings WHERE sensorID = ? AND timestamp > datetime("now", "-1 day") GROUP BY time ORDER BY timestamp DESC';

    db.all(query, [sensorID], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Błąd bazy danych'});
            return;
        }

        const result = [];
        for (let i = 0; i < rows.length; i += 3) {
            result.push(rows[i]);
        }
        res.json(result);
    });
});

app.get('/temperature/:sensorID/weekly', (req, res) => {
    const sensorID = req.params.sensorID;
    console.log('sensorID: ' + sensorID);

    const query = 'SELECT ROUND(AVG(reading), 1) AS reading, strftime("%d-%m", timestamp) AS time FROM TemperatureReadings WHERE sensorID = ? AND timestamp > datetime("now", "-7 day") GROUP BY time ORDER BY timestamp DESC';

    db.all(query, [sensorID], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Błąd bazy danych'});
            return;
        }
        return res.json(rows);
    });
});

app.get('/humidity/:sensorID/weekly', (req, res) => {
    const sensorID = req.params.sensorID;
    console.log('sensorID: ' + sensorID);

    const query = 'SELECT ROUND(AVG(reading), 1) AS reading, strftime("%d-%m", timestamp) AS time FROM HumidityReadings WHERE sensorID = ? AND timestamp > datetime("now", "-7 day") GROUP BY time ORDER BY timestamp DESC';

    db.all(query, [sensorID], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Błąd bazy danych'});
            return;
        }

        return res.json(rows);
    });
});

app.get('/temperature/:sensorID/monthly', (req, res) => {
    const sensorID = req.params.sensorID;
    console.log('sensorID: ' + sensorID);

    const query = 'SELECT ROUND(AVG(reading), 1) AS reading, strftime("%d-%m", timestamp) AS time FROM TemperatureReadings WHERE sensorID = ? AND timestamp > datetime("now", "-1 month") GROUP BY time ORDER BY timestamp DESC';

    db.all(query, [sensorID], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Błąd bazy danych'});
            return;
        }

        const result = [];
        for (let i = 0; i < rows.length; i += 3) {
            result.push(rows[i]);
        }
        res.json(result);
    });
});

app.get('/humidity/:sensorID/monthly', (req, res) => {
    const sensorID = req.params.sensorID;
    console.log('sensorID: ' + sensorID);

    const query = 'SELECT ROUND(AVG(reading), 1) AS reading, strftime("%d-%m", timestamp) AS time FROM HumidityReadings WHERE sensorID = ? AND timestamp > datetime("now", "-1 month") GROUP BY time ORDER BY timestamp DESC';

    db.all(query, [sensorID], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Błąd bazy danych'});
            return;
        }

        const result = [];
        for (let i = 0; i < rows.length; i += 3) {
            result.push(rows[i]);
        }
        res.json(result);
    });
});

app.get('/temperature/:sensorID/all', (req, res) => {
    const sensorID = req.params.sensorID;
    console.log('sensorID: ' + sensorID);

    const query = 'SELECT ROUND(AVG(reading), 1) AS reading, strftime("%d-%m", timestamp) AS time FROM TemperatureReadings WHERE sensorID = ? GROUP BY time ORDER BY timestamp DESC';

    db.all(query, [sensorID], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Database error'});
        }

        res.json(rows);
    });
});

app.get('/humidity/:sensorID/all', (req, res) => {
    const sensorID = req.params.sensorID;
    console.log('sensorID: ' + sensorID);

    const query = 'SELECT ROUND(AVG(reading), 1) AS reading, strftime("%d-%m", timestamp) AS time FROM HumidityReadings WHERE sensorID = ? GROUP BY time ORDER BY timestamp DESC';

    db.all(query, [sensorID], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Database error'});
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
            return res.status(500).json({error: 'Database error'});
        }

        temperatureReading = temperatureRow;

        db.get(query2, [sensorID], (err, humidityRow) => {
            if (err) {
                console.error(err.message);
                return res.status(500).json({error: 'Database error'});
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

