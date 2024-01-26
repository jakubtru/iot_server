const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./db/iot_project.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

module.exports = db;

// const query1 = 'DELETE FROM TemperatureReadings';
// db.run(query1);
// const query2 = 'DELETE FROM HumidityReadings';
// db.run(query2);
// sensorId = 'qwer';
// for (let i = 0; i < 1000; i++) {
//   // reading = Math.random() * 30;
//   // timestamp = 1705166691 + i*10000;
// }

const query1 = 'INSERT INTO TemperatureReadings (reading, timestamp, sensorID) VALUES (?, ?, ?)';
const query2 = 'INSERT INTO HumidityReadings (reading, timestamp, sensorID) VALUES (?, ?, ?)';
sensorId = 'qwer';
for (let i = 0; i < 1000; i++) {
  humireading = Math.floor(20 + Math.random() * 30);
  tempreading = Math.floor(1 + Math.random() * 30);
  hour = 10 + Math.floor(Math.random() * 11);
  timestamp = `2024-01-18 ${hour}:00:00`;
  // db.run(query)

  db.run(query1, [tempreading, timestamp, sensorId], function (err) {
    if (err) {
      console.error(err.message);
    } else {
      // console.log(`Temperature reading saved for sensor ${sensorId}`);
    }
  });
  db.run(query2, [humireading, timestamp, sensorId], function (err) {
    if (err) {
      console.error(err.message);
    } else {
      // console.log(`Temperature reading saved for sensor ${sensorId}`);
    }
  });
}
