import React, { useState, useEffect } from 'react';
import Script from 'react-load-script';
import axios from 'axios';
import "regenerator-runtime/runtime.js";
import SDK from './SDK.jsx';
import Player from './Player.jsx';
// import logo from './dist/logo.svg';
import style from '../styles/App.css';

const App = (props) => {
  const [config, setConfig] = useState({
    login: '',
    refresh: '',
    item: {},
    is_playing: '',
    progress_ms: 0,
  });
  const {
    login,
    refresh,
    item,
    is_playing,
    progress_ms,
  } = config;
  const { lyrics } = props;

  const getNowPlaying = async (token) => {
    const authStr = 'Bearer '.concat(token);

    const res = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: authStr,
      },
    });
    const { data } = res;
    return data;
  };

  const getHashParams = () => {
    const hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }

    // window.location.hash = '';

    return hashParams;
  };

  const play = (id, token, uri) => {
    const url = 'https://api.spotify.com/v1/me/player/play?device_id='.concat(id);
    const authStr = 'Bearer '.concat(token);
    axios.put(url, JSON.stringify({ uris: [uri] }), {
      headers: {
        Authorization: authStr,
      },
    });
  };

  const getDeviceId = async () => {
    const authStr = 'Bearer '.concat(login);
    const device = await axios.get('https://api.spotify.com/v1/me/player/devices', {
      headers: {
        Authorization: authStr,
      },
    });
    const { data } = device;
    const devid = data.devices[0].id;
    return devid;
  };

  const handlePlay = () => {
    const getId = async () => {
      const devid = await getDeviceId();
      play(devid, login, item.uri);
    };

    getId();
  };

  const handlePause = () => {
    const getId = async () => {
      const devid = await getDeviceId();
      const url = 'https://api.spotify.com/v1/me/player/pause?device_id='.concat(devid);
      const authStr = 'Bearer '.concat(login);
      axios.put(url, {}, {
        headers: {
          Authorization: authStr,
        },
      });
    };

    getId();
  };

  const handleRefresh = (e) => {
    const getToken = async () => {
      const res = await axios.get('/refresh_token', { refresh_token: refresh });
      const newToken = await res.json();
      setConfig({
        login: newToken,
      });
    };

    getToken();
  };

  useEffect(() => {
    const hash = getHashParams();
    const loginToken = hash.access_token;

    const updateConfig = async () => {
      const res = await getNowPlaying(loginToken);
      setConfig({
        login: loginToken,
        refresh: hash.refresh_token,
        item: res.item,
        is_playing: res.is_playing,
        progress_ms: res.progress_ms,
      });
    };

    if (loginToken) {
      updateConfig();
    }


    const id = setInterval(() => {
      updateConfig();
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={style.main}>
      <img src="./logo.svg" className={style.applogo} alt="logo" />
      {!login && (
        <a href="/login" className={style.logincontainer}>
          <button type="button" className={`${style.login} ${style.btn}`}>
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
              play={play}
            />
          </header>
          <div className={style.btn_container}>
            <button
              type="button"
              className={style.btn}
              onClick={handlePlay}
            >
              Play
            </button>
            <div className={style.divider} />
            <button
              type="button"
              className={style.btn}
              onClick={handlePause}
            >
              Pause
            </button>
            <div className={style.divider} />
            <button
              type="button"
              className={style.btn}
              onClick={handleRefresh}
            >
              Refresh Token
            </button>
          </div>
          {item && (
            <Player
              item={item}
              is_playing={is_playing}
              progress_ms={progress_ms}
              lyrics={lyrics}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
