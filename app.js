// We'll be using ES6 via Babel

import express from 'express';
import bodyParser from 'body-parser';
// we can test the speed of our APIs with this. Curious to see how fast we can get redis here
import responseTime from 'response-time';
import axios from 'axios';
import apiRouter from './api';
import client from './client';
import morgan from 'morgan';

var app = express();

// In case of a redis connection error
client.on('error', function (err) {
  console.log("Error " + err);
});

// For the sake of brevity, inform us when redis is ready
client.on('ready',function() {
  console.log("Redis is ready");
 });

app.set('port', (process.env.PORT || 5000));

// Morgan will help output API calls to the console so we can keep track during development
app.use(morgan('dev'))

// Allow us to parse incoming form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(responseTime());

// Return the famous "Hello World!"
app.get('/', function(req, res) {
  res.send("Hello World!");
});

// We'll namespace our major routes using express.Router()
app.use('/api', apiRouter);

// Start the app with express
const PORT = app.get('port');
app.listen(PORT, function() {
  console.log('Server listening on port: ', PORT);
});





