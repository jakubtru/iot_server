const mqtt = require('mqtt')
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/iot_project.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

const url = 'mqtt://127.0.0.1/1883'
const readingSeparator = ' '

const options = {
    clean: true,
    connectTimeout: 4000,
    clientId: '0',
    username: 'app-server',
    password: 'secret',
}

const client = mqtt.connect(url, options)

client.on('connect', () => {
    console.log('Mqtt client connected')
    client.subscribe('sensor/humidity/+', function (err) {
        if (err) {
            console.log('Subscribe to topic error', err)
        }
    })
    client.subscribe('sensor/temperature/+', function (err) {
        if (err) {
            console.log('Subscribe to topic error', err)
        }
    })
})

client.on('message', function (topic, message) {
    console.log(message.toString())
    parseReadings(topic, message)

})


function parseReadings(topic, message) {
    const topicParts = topic.split('/')
    const readingType = topicParts[1]
    const sensorId = topicParts[2]
    const mess = message.toString()
    if (readingType === "humidity") {
        humidityService(mess, sensorId)
    } else if (readingType === "temperature") {
        temperatureService(mess, sensorId)
    } else {
        humidityService(mess, sensorId)
    }

}

function humidityService(message, sensorId) {
    const mess = message.toString()
    const reading = mess.split(readingSeparator)[0]
    const timestamp = mess.split(readingSeparator)[1] + " " + mess.split(readingSeparator)[2]

    const query = 'INSERT INTO HumidityReadings (reading, timestamp, sensorID) VALUES (?, ?, ?)';
    db.run(query, [reading, timestamp, sensorId], function (err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`Humidity reading saved for sensor ${sensorId}`);
        }
    });
}

function temperatureService(message, sensorId) {
    const mess = message.toString()
    const reading = mess.split(readingSeparator)[0]
    const timestamp = mess.split(readingSeparator)[1] + " " + mess.split(readingSeparator)[2]

    const query = 'INSERT INTO TemperatureReadings (reading, timestamp, sensorID) VALUES (?, ?, ?)';
    db.run(query, [reading, timestamp, sensorId], function (err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`Temperature reading saved for sensor ${sensorId}`);
        }
    });
}
