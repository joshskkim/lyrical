import React from 'react';
import style from '../styles/Player.css';
import axios from 'axios';

const Player = (props) => {
  const { item, is_playing, progress_ms } = props;

  const backgroundStyles = {
    backgroundImage:`url(${item.album.images[0].url})`,
  };

  const progressBarStyles = {
    width: (progress_ms * 100 / item.duration_ms) + '%'
  };

  const showTime = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = ((ms % 60000) / 1000).toFixed(0);
    return `${min}:${sec < 10 ? '0': ''}${sec}`;
  }

  const getLyrics = (e) => {
    axios.get('/lyrics')
      .then((data) => {
        console.log(data);
      })
  };

  return (
    <div className={style.mainWrapper}>
      <div className={style.nowPlaying_img}>
        <img src={item.album.images[0].url} />
      </div>
      <div className={style.nowPlaying_side}>
        <div className={style.nowPlaying_name}>
          {item.name}
        </div>
        <div className={style.nowPlaying_artist}>
          {item.artists[0].name}
        </div>
        <div className={style.nowPlaying_status}>
          {is_playing ? "Playing" : "Paused"}
        </div>
        <div className={style.progress}>
          {showTime(progress_ms)}
          <div
            className={style.progress_bar}
            style={progressBarStyles}
          />
          {showTime(item.duration_ms)}
        </div>
      </div>
      <div className="background" style={backgroundStyles} />{" "}
      <button
        onClick={getLyrics}
      >
        Show Lyrics
      </button>
    </div>
  );
}

export default Player;