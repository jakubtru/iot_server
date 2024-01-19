const express = require('express');
const bodyParser = require('body-parser');
const db = require("../db");
const sqlite3 = require('sqlite3').verbose();

const app = express.Router();
app.use(bodyParser.json());


app.get('', (req, res) => {
    db.all('SELECT * FROM "User-Sensor Linkage"', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Błąd bazy danych' });
            return;
        }
        res.json(rows);
    });
});

app.get('/:userID', (req, res) => {
    const userID = req.params.userID
    const query = 'SELECT * FROM "User-Sensor Linkage" WHERE userID = ?';
    db.all(query, [userID] ,(err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Błąd bazy danych' });
            return;
        }
        res.json(rows);
    });
});

app.post('', (req, res) => {
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

app.put('/:userID/:sensorID', (req, res) => {
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

app.delete('/:userID/:sensorID', (req, res) => {
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



app.post('/:ownerID', async (req, res) => {
    const ownerID = req.params.ownerID;
    const { emailAddress } = req.body;
    console.log(ownerID);
    console.log(emailAddress)


    try {
        // Step 1: Check if the user with the provided emailAddress exists
        let observerUser = await db.get('SELECT userID FROM Users WHERE email = ?', [emailAddress]);
        console.log("observer: " + observerUser);

        if (!observerUser || observerUser.userID === undefined) {
            return res.status(404).json({ error: 'User not found for the provided email address' });
        }

        const observerID = observerUser.userID;
        console.log("observerID: " + observerID);

        // Step 2: Retrieve all sensors belonging to the ownerID
        const sensorsQuery = 'SELECT sensorID FROM "User-Sensor Linkage" WHERE userID = ?';
        const sensorRows = await db.all(sensorsQuery, [ownerID]);

        if (sensorRows.length === 0) {
            return res.status(404).json({ error: 'No sensors found for the provided ownerID' });
        }

        console.log(sensorRows)

        // Step 3: Create user-sensor linkages for each sensor (if not already existing)
        const linkagesQuery = 'INSERT INTO "User-Sensor Linkage" (userID, sensorID, role) VALUES (?, ?, ?)';
        const linkagesPromises = sensorRows.map(async (sensorRow) => {
            const sensorID = sensorRow.sensorID;

            // Check if the linkage already exists
            const existingLinkageQuery = 'SELECT * FROM "User-Sensor Linkage" WHERE userID = ? AND sensorID = ?';
            const existingLinkage = await db.get(existingLinkageQuery, [observerID, sensorID]);

            if (!existingLinkage) {
                await db.run(linkagesQuery, [observerID, sensorID, 'observer']);
            }
        });

        // Wait for all linkages to be created (or checked)
        await Promise.all(linkagesPromises);

        res.status(201).json({ message: 'Observers added successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = app;
