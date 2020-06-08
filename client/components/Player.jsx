import React from 'react';
import style from '../styles/Player.css';

const Player = (props) => {
  const { item, is_playing, progress_ms, lyrics } = props;

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

  const toMS = (str) => {
    const msArr = str.split(':');
    const min = parseInt(msArr[0]) * 60000;
    const sec = parseInt(msArr[1]) * 1000;
    return min + sec;
  }

  const showLyrics = () => {
    let currentLyrics = '';
    let i, end = lyrics.length;
    for (i = 0; i < end; i += 1) {
      if (toMS(lyrics[i].substring(2, 6)) <= progress_ms){
        // console.log(lyrics[i].substring(2, 6), showTime(progress_ms));
        currentLyrics = lyrics[i].substring(10) + '\n' + lyrics[i + 1].substring(10) + '\n' + lyrics[i + 2].substring(10) + '\n';
        // console.log(currentLyrics);
      }
    }
    console.log(currentLyrics);
    return currentLyrics;
  }

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
      <div className="lyrics" style={ {'white-space':'pre-wrap'} }>
        {showLyrics()};
      </div>
    </div>
  );
}

export default Player;