import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import App from './components/App.jsx';


const getLyrics = async () => {
  try {
    const res = await axios.get('/lyrics');
    return res.data.split('\n');
  } catch (error) {
    console.error(error);
  }
};

let lyrics;

const wait = async () => {
  lyrics = await getLyrics();
};

wait().then(() => {
  render(<App lyrics={lyrics} />, document.getElementById('app'));
});
