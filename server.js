const express = require('express');
const cors = require('cors');
const mqttClient = require('./mqtt_client');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));


const userController = require('./controllers/userController');
const sensorController = require('./controllers/sensorController');
const linkageController = require('./controllers/linkageController');

app.use('/users', userController);
app.use('/sensors', sensorController);
app.use('/linkages', linkageController);
app.use('/readings', linkageController);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



//
// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs').promises;
// const path = require('path');
// const cors = require('cors');
// const DATA_DIR = './data';
// const sqlite3 = require('sqlite3').verbose();
// const mqttClient = require('./mqtt_client');
//
// const app = express();
// const PORT = process.env.PORT || 3000;
//
// app.use(bodyParser.json());
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }));
//
// let db = new sqlite3.Database('./db/iot_project.db', sqlite3.OPEN_READWRITE, (err) => {
//     if (err) {
//         console.error(err.message);
//     }
//     console.log('Connected to the database.');
// });
//
//
//
// app.get('/', (req, res) => {
//     res.send("Hello!");
//     //console.log("A")
// })
//
// app.get('/users', (req, res) => {
//     db.all('SELECT * FROM Users', (err, rows) => {
//         if (err) {
//             console.error(err.message);
//             res.status(500).json({ error: 'Database error' });
//             return;
//         }
//         res.json(rows);
//     });
// });
//
// app.get('/users/:email', (req, res) => {
//     const email = req.params.email;
//     const query = 'SELECT * FROM Users WHERE email = ?';
//     db.get(query, [email], (err, row) => {
//         if (err) {
//             console.error(err.message);
//             res.status(500).json({ error: 'Database error' });
//             return;
//         }
//
//         if (!row) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//
//         res.json(row);
//     });
// });
//
// app.post('/users', (req, res) => {
//     const { email, password, username, token } = req.body;
//
//     if (!username || !email || !password || !token) {
//         return res.status(400).json({ error: 'Brak wymaganych danych' });
//     }
//     const query = 'INSERT INTO Users (email, password, username, token) VALUES (?, ?, ?, ?)';
//     console.log('Zapytanie SQL:', query);
//     console.log('Wartości:', [email, password, username, token]);
//
//     db.run(query, [email, password, username, token], function (err) {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Błąd bazy danych' });
//         }
//         res.status(201).json({ message: 'Użytkownik został dodany' });
//     });
// });
//
// app.put('/users/:userID', (req, res) => {
//     const userID = req.params.userID;
//     const { email, password, username, token } = req.body;
//
//     const query = 'UPDATE Users SET email = ?, password = ?, username = ?, token = ? WHERE userID = ?';
//     db.run(query, [email, password, username, token, userID], function (err) {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Błąd bazy danych' });
//         }
//
//         if (this.changes === 0) {
//             return res.status(404).json({ error: 'Użytkownik nie istnieje' });
//         }
//
//         res.json({ message: 'Dane użytkownika zostały zaktualizowane' });
//     });
// });
//
//
// app.delete('/users/:userID', (req, res) => {
//     const userID = req.params.userID;
//     const query = 'DELETE FROM Users WHERE userID = ?';
//     db.run(query, [userID], function (err) {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Błąd bazy danych' });
//         }
//
//         if (this.changes === 0) {
//             return res.status(404).json({ error: 'Użytkownik nie istnieje' });
//         }
//         res.json({ message: 'Użytkownik został usunięty' });
//     });
// });
//
// app.get('/sensors', (req, res) => {
//     db.all('SELECT * FROM Sensor', (err, rows) => {
//         if (err) {
//             console.error(err.message);
//             res.status(500).json({ error: 'Błąd bazy danych' });
//             return;
//         }
//         res.json(rows);
//     });
// });
//
//
// app.get('/sensors/:userID', (req, res) => {
//     const id = req.params.userID;
//     const query = 'SELECT sensorID, name FROM Sensor NATURAL JOIN "User-Sensor Linkage" WHERE userID = ?';
//     db.all(query, [id], (err, rows) => {
//         if (err) {
//             console.error(err.message);
//             res.status(500).json({ error: 'Błąd bazy danych' });
//             return;
//         }
//         res.json(rows);
//     });
// });
//
//
// app.post('/sensors', (req, res) => {
//     const { name } = req.body;
//     if (!name) {
//         return res.status(400).json({ error: 'Brak wymaganych danych' });
//     }
//     const query = 'INSERT INTO Sensor (name) VALUES (?)';
//     db.run(query, [name], function (err) {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Błąd bazy danych' });
//         }
//         res.status(201).json({ message: 'Sensor został dodany' });
//     });
// });
//
// app.put('/sensors/:sensorID', (req, res) => {
//     const sensorID = req.params.sensorID;
//     const { name } = req.body;
//     const query = 'UPDATE Sensor SET name = ? WHERE sensorID = ?';
//     db.run(query, [name, sensorID], function (err) {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Błąd bazy danych' });
//         }
//
//         if (this.changes === 0) {
//             return res.status(404).json({ error: 'Sensor nie istnieje' });
//         }
//         res.json({ message: 'Dane sensora zostały zaktualizowane' });
//     });
// });
//
//
//
// app.delete('/sensors/:sensorID', (req, res) => {
//     const sensorID = req.params.sensorID;
//     const query = 'DELETE FROM Sensor WHERE sensorID = ?';
//     db.run(query, [sensorID], function (err) {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Błąd bazy danych' });
//         }
//
//         if (this.changes === 0) {
//             return res.status(404).json({ error: 'Sensor nie istnieje' });
//         }
//         res.json({ message: 'Sensor został usunięty' });
//     });
// });
//
// app.get('/linkages', (req, res) => {
//     db.all('SELECT * FROM "User-Sensor Linkage"', (err, rows) => {
//         if (err) {
//             console.error(err.message);
//             res.status(500).json({ error: 'Błąd bazy danych' });
//             return;
//         }
//         res.json(rows);
//     });
// });
//
// app.get('/linkages/:userID', (req, res) => {
//     const userID = req.params.userID
//     const query = 'SELECT * FROM "User-Sensor Linkage" WHERE userID = ?';
//     db.all(query, [userID] ,(err, rows) => {
//         if (err) {
//             console.error(err.message);
//             res.status(500).json({ error: 'Błąd bazy danych' });
//             return;
//         }
//         res.json(rows);
//     });
// });
//
// app.post('/linkages', (req, res) => {
//     const { userID, sensorID, role } = req.body;
//
//     if (!userID || !sensorID || !role) {
//         return res.status(400).json({ error: 'Brak wymaganych danych' });
//     }
//
//     const query = 'INSERT INTO "User-Sensor Linkage" (userID, sensorID, role) VALUES (?, ?, ?)';
//     db.run(query, [userID, sensorID, role], function (err) {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Błąd bazy danych' });
//         }
//
//         res.status(201).json({ message: 'Nowe powiązanie zostało utworzone' });
//     });
// });
//
// app.put('/linkages/:userID/:sensorID', (req, res) => {
//     const userID = req.params.userID;
//     const sensorID = req.params.sensorID;
//     const { role } = req.body;
//
//     const query = 'UPDATE "User-Sensor Linkage" SET role = ? WHERE userID = ? AND sensorID = ?';
//     db.run(query, [role, userID, sensorID], function (err) {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Błąd bazy danych' });
//         }
//
//         if (this.changes === 0) {
//             return res.status(404).json({ error: 'Powiązanie nie istnieje' });
//         }
//
//         res.json({ message: 'Dane powiązania zostały zaktualizowane' });
//     });
// });
//
// app.delete('/linkages/:userID/:sensorID', (req, res) => {
//     const userID = req.params.userID;
//     const sensorID = req.params.sensorID;
//
//     const query = 'DELETE FROM "User-Sensor Linkage" WHERE userID = ? AND sensorID = ?';
//     db.run(query, [userID, sensorID], function (err) {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Błąd bazy danych' });
//         }
//
//         if (this.changes === 0) {
//             return res.status(404).json({ error: 'Powiązanie nie istnieje' });
//         }
//
//         res.json({ message: 'Powiązanie zostało usunięte' });
//     });
// });
//
//
// app.get('/readings/temperature/:sensorID', (req, res) => {
//     const sensorID = req.params.sensorID;
//
//     const query = 'SELECT * FROM TemperatureReadings WHERE sensorID = ?';
//     db.all(query, [sensorID], (err, rows) => {
//         if (err) {
//             console.error(err.message);
//             res.status(500).json({ error: 'Błąd bazy danych' });
//             return;
//         }
//         res.json(rows);
//     });
// });
//
// app.get('/readings/humidity/:sensorID', (req, res) => {
//     const sensorID = req.params.sensorID;
//
//     const query = 'SELECT * FROM TemperatureReadings WHERE sensorID = ?';
//     db.all(query, [sensorID], (err, rows) => {
//         if (err) {
//             console.error(err.message);
//             res.status(500).json({ error: 'Błąd bazy danych' });
//             return;
//         }
//         res.json(rows);
//     });
// });
//
// app.get('/readings/:sensorID/newest', (req, res) => {
//     const sensorID = req.params.sensorID;
//
//     const query1 = 'SELECT * FROM TemperatureReadings WHERE sensorID = ? ORDER BY timestamp DESC LIMIT 1';
//     const query2 = 'SELECT * FROM HumidityReadings WHERE sensorID = ? ORDER BY timestamp DESC LIMIT 1';
//
//     let temperatureReading, humidityReading;
//
//     db.get(query1, [sensorID], (err, temperatureRow) => {
//         if (err) {
//             console.error(err.message);
//             return res.status(500).json({ error: 'Database error' });
//         }
//
//         temperatureReading = temperatureRow;
//
//         db.get(query2, [sensorID], (err, humidityRow) => {
//             if (err) {
//                 console.error(err.message);
//                 return res.status(500).json({ error: 'Database error' });
//             }
//             humidityReading = humidityRow;
//
//             const combinedReading = {
//                 temperature: temperatureReading ? temperatureReading.reading : null,
//                 humidity: humidityReading ? humidityReading.reading : null,
//             };
//             res.json(combinedReading);
//         });
//     });
// });
//
//
// app.post('/addObserver/:ownerID', async (req, res) => {
//     const ownerID = req.params.ownerID;
//     const { emailAddress } = req.body;
//     console.log(ownerID);
//     console.log(emailAddress)
//
//
//     try {
//         // Step 1: Check if the user with the provided emailAddress exists
//         let observerUser = await db.get('SELECT userID FROM Users WHERE email = ?', [emailAddress]);
//         console.log("observer: " + observerUser);
//
//         if (!observerUser || observerUser.userID === undefined) {
//             return res.status(404).json({ error: 'User not found for the provided email address' });
//         }
//
//         const observerID = observerUser.userID;
//         console.log("observerID: " + observerID);
//
//         // Step 2: Retrieve all sensors belonging to the ownerID
//         const sensorsQuery = 'SELECT sensorID FROM "User-Sensor Linkage" WHERE userID = ?';
//         const sensorRows = await db.all(sensorsQuery, [ownerID]);
//
//         if (sensorRows.length === 0) {
//             return res.status(404).json({ error: 'No sensors found for the provided ownerID' });
//         }
//
//         console.log(sensorRows)
//
//         // Step 3: Create user-sensor linkages for each sensor (if not already existing)
//         const linkagesQuery = 'INSERT INTO "User-Sensor Linkage" (userID, sensorID, role) VALUES (?, ?, ?)';
//         const linkagesPromises = sensorRows.map(async (sensorRow) => {
//             const sensorID = sensorRow.sensorID;
//
//             // Check if the linkage already exists
//             const existingLinkageQuery = 'SELECT * FROM "User-Sensor Linkage" WHERE userID = ? AND sensorID = ?';
//             const existingLinkage = await db.get(existingLinkageQuery, [observerID, sensorID]);
//
//             if (!existingLinkage) {
//                 await db.run(linkagesQuery, [observerID, sensorID, 'observer']);
//             }
//         });
//
//         // Wait for all linkages to be created (or checked)
//         await Promise.all(linkagesPromises);
//
//         res.status(201).json({ message: 'Observers added successfully' });
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
//
//
//
// app.listen(PORT, () => {
//     console.log(`Serwer działa na porcie ${PORT}`);
// });
