import React, { useState, useEffect } from 'react';
import Script from 'react-load-script';
import axios from 'axios';
import "regenerator-runtime/runtime.js";
import Player from './SDK.jsx';
// import Spotify from 'spotify-web-api-js';

// const spotify = new Spotify();

const App = () => {
  const [login, setLogin] = useState('');
  const [refresh, setRefresh] = useState('');
  // const [item, setItem] = useState({});
  // const [is_playing, setPlaying] = useState('Paused');
  // const [progress_ms, setProgress] = useState(0);

  // const getNowPlaying = () => {
  //   spotify.getMyCurrentPlaybackState()
  //     .then((res) => {
  //       console.log(res);
  //     })
  // }

  const getHashParams = () => {
    const hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }

    window.location.hash = '';

    return hashParams;
  }

  const handleRefresh = (e) => {
    axios.get('/refresh_token', {
      'refresh_token': refresh
    }).then((data) => {
      setLogin(data.access_token);
    })
  }

  useEffect(() => {
    let hash = getHashParams();
    let loginToken = hash.access_token;

    if (loginToken) {
      setLogin(loginToken);
      setRefresh(hash.refresh_token);
      // spotify.setAccessToken(login);
      // getNowPlaying();
    }
  }, []);

  return (
    <div className="App">
      {!login && (
        <a href="/login">
          <button>
            Login to Spotify
          </button>
        </a>
      )}
      {login && (
        <div>
          <header>
            <Player
              token={login}
            />
          </header>
          <button
            onClick={handleRefresh}
          >
            Refresh Token
          </button>
        </div>
      )}
    </div>
  )
}

export default App;