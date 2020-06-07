import React, { useState, useEffect } from 'react';
import Script from 'react-load-script';
import axios from 'axios';
import "regenerator-runtime/runtime.js";
import SDK from './SDK.jsx';
import Player from './Player.jsx';

const App = () => {
  const [count, setCount] = useState(0);
  const [config, setConfig] = useState({
    login: '',
    refresh: '',
    item: {},
    is_playing: '',
    progres_ms: 0
  })

  const getNowPlaying = async(token) => {
    const authStr = 'Bearer '.concat(token);

    const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Authorization': authStr,
          }
        });
    const { data } = res;
    return data;
  }

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
    const getToken = async() => {
      const res = await axios.get('/refresh_token', { 'refresh_token': refresh });
      const newToken = await res.json();
      setConfig({
        login: newToken,
      })
    }
  }

  useEffect(() => {
    let hash = getHashParams();
    let loginToken = hash.access_token;
    const updateConfig = async() => {
      const res = await getNowPlaying(loginToken);
      setConfig({
        login: loginToken,
        refresh: hash.refresh_token,
        item: res.item,
        is_playing: res.is_playing,
        progress_ms: res.progress_ms
      });
    }

    if (loginToken) {
      updateConfig();
    }


    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const { login, refresh, item, is_playing, progress_ms } = config;

  return (
    <div className="App">
      {!login && (
        <a href="/login">
          <button>
            Login to Spotify
          </button>
        </a>
      )}
      {(login && item) && (
        <div>
          <header>
            <SDK
              token={login}
              uri={item.uri}
            />
          </header>
          <button
            onClick={handleRefresh}
          >
            Refresh Token
          </button>
          {is_playing && (
          <Player
            item={item}
            is_playing={is_playing}
            progress_ms={progress_ms}
          />
          )}
        </div>
      )}
    </div>
  )
}

export default App;