const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const path = require('path');
const querystring = require('querystring');

// SPOTIFY AUTHENTICATION VARIABLES
const { client_id, client_secret } = require('./spotify.js');
const redirect_uri = 'http://localhost:9010';
const stateKey = 'spotify_auth_state';

// COOKIE GENERATOR
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// MIDDLEWARE
const app = express();

app.use(express.static(path.join(__dirname, '../public/')))
   .use(cors())
   .use(compression())
   .use(bodyParser.urlencoded({ extended: true }))
   .use(bodyParser.json())
   .use(cookieParser());

app.get('/api', (req, res) => {

});

module.exports = app;
