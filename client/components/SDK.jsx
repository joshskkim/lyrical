import React from 'react';
import Script from 'react-load-script';

const Player = (props) => {
  const { token } = props;

  const handleLoad = () => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'PLAYER',
        getOAuthToken: cb => {
          cb(token);
        }
      });

      // Error handling
      player.addListener('initialization_error', ({ message }) => { console.error(message); });
      player.addListener('authentication_error', ({ message }) => { console.error(message); });
      player.addListener('account_error', ({ message }) => { console.error(message); });
      player.addListener('playback_error', ({ message }) => { console.error(message); });

      // Playback status updates
      player.addListener('player_state_changed', state => { console.log(state); });

      // Ready
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });

      // Not Ready
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
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

export default Player;