const express = require('express');
const bodyParser = require('body-parser');
const db = require("../db");
const sqlite3 = require('sqlite3').verbose();

const app = express.Router();
app.use(bodyParser.json());


app.get('', (req, res) => {
    db.all('SELECT DISTINCT * FROM "User-Sensor Linkage"', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Błąd bazy danych'});
            return;
        }
        res.json(rows);
    });
});

app.get('/:userID', (req, res) => {
    const userID = req.params.userID
    const query = 'SELECT DISTINCT * FROM "User-Sensor Linkage" WHERE userID = ?';
    db.all(query, [userID], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({error: 'Błąd bazy danych'});
            return;
        }
        res.json(rows);
    });
});

app.post('', (req, res) => {
    const {userID, sensorID, role} = req.body;

    if (!userID || !sensorID || !role) {
        return res.status(400).json({error: 'Brak wymaganych danych'});
    }

    const query = 'INSERT INTO "User-Sensor Linkage" (userID, sensorID, role) VALUES (?, ?, ?)';
    db.run(query, [userID, sensorID, role], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Błąd bazy danych'});
        }

        res.status(201).json({message: 'Nowe powiązanie zostało utworzone'});
    });
});

app.put('/:userID/:sensorID', (req, res) => {
    const userID = req.params.userID;
    const sensorID = req.params.sensorID;
    const {role} = req.body;

    const query = 'UPDATE "User-Sensor Linkage" SET role = ? WHERE userID = ? AND sensorID = ?';
    db.run(query, [role, userID, sensorID], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Błąd bazy danych'});
        }

        if (this.changes === 0) {
            return res.status(404).json({error: 'Powiązanie nie istnieje'});
        }

        res.json({message: 'Dane powiązania zostały zaktualizowane'});
    });
});

app.delete('/:userID/:sensorID', (req, res) => {
    const userID = req.params.userID;
    const sensorID = req.params.sensorID;
    //get linkage to check if user role was 1 or 2
    const query1 = 'SELECT DISTINCT * FROM "User-Sensor Linkage" WHERE userID = ? AND sensorID = ?';
    db.get(query1, [userID, sensorID], async function (err, row) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Błąd bazy danych'});
        }
        if (!row) {
            return res.status(404).json({error: 'Powiązanie nie istnieje'});
        }
        const role = row.role;
        if (role === 1) {
            const query2 = 'DELETE FROM "User-Sensor Linkage" WHERE sensorID = ?';
            db.run(query2, [sensorID], function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({error: 'Błąd bazy danych'});
                }
                res.json({message: 'Powiązania zostały usunięte'});
            });
        } else if (role === 2) {
            const query = 'DELETE FROM "User-Sensor Linkage" WHERE userID = ? AND sensorID = ?';
            db.run(query, [userID, sensorID], function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({error: 'Błąd bazy danych'});
                }

                if (this.changes === 0) {
                    return res.status(404).json({error: 'Powiązanie nie istnieje'});
                }

                res.json({message: 'Powiązanie zostało usunięte'});
            });
        }
    });


});


app.post('/:ownerID', async (req, res) => {
    const ownerID = req.params.ownerID;
    const {emailAddress} = req.body;
    console.log(ownerID);
    console.log(emailAddress)
    const query = 'SELECT userID FROM Users WHERE email = ?';

    db.get(query, [emailAddress], async function (err, row) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({error: 'Błąd bazy danych'});
        }
        if (!row) {
            return res.status(404).json({error: 'Użytkownik nie istnieje'});
        }
        const userID = row.userID;
        //get all sensorIDs for ownerID and then add user sensor linkage with role=2 to userID if they dont exist
        const query2 = 'SELECT sensorID DISTINCT FROM "User-Sensor Linkage" WHERE userID = ? AND role = 1';
        db.all(query2, [ownerID], async function (err, rows) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({error: 'Błąd bazy danych'});
            }
            const sensorIDs = rows.map(row => row.sensorID);
            console.log(sensorIDs);
            for (const sensorID of sensorIDs) {
                const query3 = 'SELECT DISTINCT * FROM "User-Sensor Linkage" WHERE userID = ? AND sensorID = ?';
                db.get(query3, [userID, sensorID], async function (err, row) {
                    if (err) {
                        console.error(err.message);
                        return res.status(500).json({error: 'Błąd bazy danych'});
                    }
                    if (!row) {
                        const query4 = 'INSERT INTO "User-Sensor Linkage" (userID, sensorID, role) VALUES (?, ?, ?)';
                        db.run(query4, [userID, sensorID, 2], function (err) {
                            if (err) {
                                console.error(err.message);
                                return res.status(500).json({error: 'Błąd bazy danych'});
                            }
                        });
                    }
                });
            }
            res.json({message: 'Użytkownik został dodany do powiązań'});
        });

    });

});


module.exports = app;
