const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const DATA_DIR = './data';
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


let db = new sqlite3.Database('./db/iot_project.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});


app.get('/', (req, res) => {
    res.send("Hello!");
    //console.log("A")
})

app.get('/users', (req, res) => {
    db.all('SELECT * FROM Users', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Database error' });
            return;
        }
        res.json(rows);
    });
});

app.post('/users', (req, res) => {
    const { email, password, username, token } = req.body;

    if (!email || !password || !token) {
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

app.put('/users/:userID', (req, res) => {
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


app.delete('/users/:userID', (req, res) => {
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

app.get('/sensors', (req, res) => {
    db.all('SELECT * FROM Sensor', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Błąd bazy danych' });
            return;
        }
        res.json(rows);
    });
});


app.post('/sensors', (req, res) => {
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

app.put('/sensors/:sensorID', (req, res) => {
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



app.delete('/sensors/:sensorID', (req, res) => {
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

app.get('/linkages', (req, res) => {
    db.all('SELECT * FROM "User-Sensor Linkage"', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Błąd bazy danych' });
            return;
        }
        res.json(rows);
    });
});

app.post('/linkages', (req, res) => {
    const { userID, sensorID, role } = req.body;

    if (!userID || !sensorID || !role) {
        return res.status(400).json({ error: 'Brak wymaganych danych' });
    }

    const query = 'INSERT INTO "User-Sensor Linkage" (userID, sensorID, role) VALUES (?, ?, ?)';
    db.run(query, [userID, sensorID, role], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        res.status(201).json({ message: 'Nowe powiązanie zostało utworzone' });
    });
});

app.put('/linkages/:userID/:sensorID', (req, res) => {
    const userID = req.params.userID;
    const sensorID = req.params.sensorID;
    const { role } = req.body;

    const query = 'UPDATE "User-Sensor Linkage" SET role = ? WHERE userID = ? AND sensorID = ?';
    db.run(query, [role, userID, sensorID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Powiązanie nie istnieje' });
        }

        res.json({ message: 'Dane powiązania zostały zaktualizowane' });
    });
});

app.delete('/linkages/:userID/:sensorID', (req, res) => {
    const userID = req.params.userID;
    const sensorID = req.params.sensorID;

    const query = 'DELETE FROM "User-Sensor Linkage" WHERE userID = ? AND sensorID = ?';
    db.run(query, [userID, sensorID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Powiązanie nie istnieje' });
        }

        res.json({ message: 'Powiązanie zostało usunięte' });
    });
});

app.get('/readings', (req, res) => {
    db.all('SELECT * FROM Readings', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Błąd bazy danych' });
            return;
        }
        res.json(rows);
    });
});

app.post('/readings', (req, res) => {
    const { temperature, humidity, timestamp, sensorID } = req.body;

    if (!temperature || !humidity || !timestamp || !sensorID) {
        return res.status(400).json({ error: 'Brak wymaganych danych' });
    }

    const query = 'INSERT INTO Readings (temperature, humidity, timestamp, sensorID) VALUES (?, ?, ?, ?)';
    db.run(query, [temperature, humidity, timestamp, sensorID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }
        res.status(201).json({ message: 'Nowy odczyt został dodany' });
    });
});

app.delete('/readings/:readingID', (req, res) => {
    const readingID = req.params.readingID;
    const query = 'DELETE FROM Readings WHERE readingID = ?';
    db.run(query, [readingID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Błąd bazy danych' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Odczyt nie istnieje' });
        }
        res.json({ message: 'Odczyt został usunięty' });
    });
});

app.get('/readings/:sensorID', (req, res) => {
    const sensorID = req.params.sensorID;

    const query = 'SELECT * FROM Readings WHERE sensorID = ?';
    db.all(query, [sensorID], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Błąd bazy danych' });
            return;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

// db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Close the database connection.');
// });
