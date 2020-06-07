import React from 'react';

const Player = (props) => {
  const { item, is_playing, progress_ms } = props;

  const backgroundStyles = {
    backgroundImage:`url(${item.album.images[0].url})`,
  };

  const progressBarStyles = {
    width: (progress_ms * 100 / item.duration_ms) + '%'
  };

  return (
    <div className="App">
      <div className="main-wrapper">
        <div className="now-playing_img">
          <img src={item.album.images[0].url} />
        </div>
        <div className="now-playing_side">
          <div className="now-playing_name">{item.name}</div>
          <div className="now-playing_artist">
            {item.artists[0].name}
          </div>
          <div className="now-playing_status">
            {is_playing ? "Playing" : "Paused"}
          </div>
          <div className="progress">
            <div
              className="progress_bar"
              style={progressBarStyles}
            />
          </div>
        </div>
        <div className="background" style={backgroundStyles} />{" "}
      </div>
    </div>
  );
}

export default Player;