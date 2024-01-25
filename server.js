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
const readingsController = require('./controllers/readingController');

app.use('/users', userController);
app.use('/sensors', sensorController);
app.use('/linkages', linkageController);
app.use('/readings', readingsController);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});