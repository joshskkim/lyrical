import React, { useState, useEffect } from 'react';
import "regenerator-runtime/runtime.js";

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

  // const getNowPlaying = () => {
  //   spotifyAPI.getMyCurrentPlaybackState()
  //     .then((res) => {
  //       console.log(res);
  //     })
  // }

  useEffect(() => {
    let loginToken = hash.access_token;

    if (loginToken) {
      setToken(loginToken);
      spotifyAPI.setAccessToken(token);
    }
  }, []);

  return (
    <div className="App">
      {!token && (
        <a
          className="btn btn-primary"
          href="/login"
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