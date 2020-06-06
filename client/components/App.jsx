import React, { useState, useEffect } from 'react';
import Player from './Player.jsx';
import clientId from '../spotify.js';
import "regenerator-runtime/runtime.js";

export const authEndpoint = 'https://accounts.spotify.com/authorize';

const redirectURI = 'http://localhost:9010';
const scopes = ['user-read-currently-playing', 'user-read-playback-state'];

const hash = window.location.hash
  .substring(1)
  .split('&')
  .reduce((init, item) => {
    if (item) {
      let parts = item.split('=');
      init[parts[0]] = decodeURIComponent(parts[1]);
    }
    return init;
  }, {});

window.location.hash = '';

const App = () => {
  const [token, setToken] = useState('');
  const [item, setItem] = useState({});
  const [is_playing, setPlaying] = useState('Paused');
  const [progress_ms, setProgress] = useState(0);

  const getPlaying = async(token) => {
    const response = await fetch('https://api.spotify.com/v1/me/player', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(data);
    return data;
  }

  const getPlayer = async() => {
    try {
      const res = await getPlaying(token);
      setItem(res.item);
      setPlaying(res.is_playing);
      setProgress(res.progress_ms);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    let loginToken = hash.access_token;

    if (loginToken) {
      setToken(loginToken);
      getPlayer();
    }
  }, []);

  return (
    <div className="App">
      {!token && (
        <a
          className="btn btn--loginApp-link"
          href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectURI}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`}
        >
          Login to Spotify
        </a>
      )}
      {token && (
        <div>
          YOU LOGGED IN DAWG
          {/* <Player
            item={item}
            is_playing={is_playing}
            progress_ms={progress_ms}
          /> */}
        </div>
      )}
    </div>
  )
}

export default App;