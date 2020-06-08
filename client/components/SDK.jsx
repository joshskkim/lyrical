import React from 'react';
import Script from 'react-load-script';
import axios from 'axios';

const SDK = (props) => {
  const { token, uri, play } = props;

  const handleLoad = () => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'PLAYER',
        getOAuthToken: cb => {
          cb(token);
        },
        volume: 0.15
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        play(device_id, token, uri);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // State Updates
      player.addListener('player_state_changed', (state) => {
        console.log('Currently Playing: ', state.track_window.current_track);
        console.log('Position in Song: ', state.position);
        console.log('Duration of Song: ', state.duration);
      });

      player.connect()
        .then(success => {
          if(success) {
            console.log('Successful SDK connection to Spotify!');
          }
        });
    }
  }

  const handleCreate = () => {
    console.log('Script created');
  }

  const handleError = () => {
    console.log('Error with script');
  }

  return (
    <Script
      url="https://sdk.scdn.co/spotify-player.js"
      onCreate={handleCreate}
      onError={handleError}
      onLoad={handleLoad}
    />
  )
}

export default SDK;