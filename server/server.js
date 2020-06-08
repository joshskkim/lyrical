const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const request = require('request');

// MUSIXMATCH AUTH
// const mm = require('./mm.js');

// SPOTIFY AUTHENTICATION VARIABLES
const { client_id, client_secret } = require('./spotify.js');

const redirect_uri = 'http://localhost:9010/callback';
const stateKey = 'spotify_auth_state';

// COOKIE GENERATOR
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// MIDDLEWARE
const app = express();

app.use(express.static(path.join(__dirname, '../public/')))
   .use(cors())
   .use(compression())
   .use(bodyParser.urlencoded({ extended: true }))
   .use(bodyParser.json())
   .use(cookieParser());

// LOGIN ROUTE
app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  res.cookie(stateKey, state);

  const scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

// REFRESH AFTER LOGIN
app.get('/callback', (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    const authOptions = {
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {

        let access_token = body.access_token,
            refresh_token = body.refresh_token;

        let options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, (error, response, body) => {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// GET A NEW ACCESS TOKEN
app.get('/refresh_token', (req, res) => {
  const refresh_token = req.query.refresh_token;
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});


// MVP local subtitle route
app.get('/lyrics', (req, res) => {
  const subPath = path.resolve('Justin-Bieber-Sorry.lrc')
  fs.readFile(subPath, (err, data) => {
    res.send(data.toString());
  });
})

// musiXmatch routes
// // GET TRACK ID
// app.get('/lyrics/:title/:artist', (req, res) => {
//   const { title, artist } = req.params;
//   const url = `http://api.musixmatch.com/ws/1.1/matcher.track.get?q_track=${title}&q_artist=${artist}&apikey=${mm}`;
//   request.get(url, (error, response, body) => {
//     if(!error && response.statusCode === 200) {
//       const resp = JSON.parse(response.body);
//       const id = resp.message.body.track.track_id;
//       res.json(id);
//     }
//   })
// })

// // GET SUBTITLES
// app.get('/subtitles/:id', (req, res) => {
//   const { id } = req.params;
//   const url = `http://api.musixmatch.com/ws/1.1/track.subtitle.translation.get?commontrack_id=10074988&selected_language=en&apikey=${mm}`;
//   request.get(url, (error, response, body) => {
//     if(!error && response.statusCode === 200) {
//       const resp = JSON.parse(response.body);
//       console.log(resp);
//     } else {
//       console.error('ERR:', error);
//     }
//   })
// })

module.exports = app;
