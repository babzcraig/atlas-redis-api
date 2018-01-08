// We'll be using ES6 via Babel

import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import morgan from 'morgan';
import path from 'path';
import apiRouter from './api';
import client from './client';

var app = express();


// In case of a redis connection error
client.on('error', (err) => {
  console.log("Error " + err);
});

// For the sake of brevity, inform us when redis is ready
client.on('ready', () => {
  console.log("Redis is ready");
 });

app.set('port', (process.env.PORT || 8080));

// Morgan will help output API calls to the console so we can keep track during development
app.use(morgan('dev'));

// Allow us to parse incoming form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Return the famous "Hello World!"
app.get('/', (req, res) => {
  res.send("Hello World!");
});

// We'll namespace our major routes to '/api' using express.Router()
app.use('/api', apiRouter);

// Start the app with express
const PORT = app.get('port');
app.listen(PORT, () => {
  console.log('Server listening on port: ', PORT);
});





