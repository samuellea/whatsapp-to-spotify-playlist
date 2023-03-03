import './styles/SpotifyLogo.css';
import React, { useState, useEffect } from 'react';
import SpotifyLogoPNG from './Spotify_Logo_RGB_White.png'

function SpotifyLogo() {
  return (
    <div className="SpotifyLogo">
      <img src={SpotifyLogoPNG} />
    </div>
  )
};

export default SpotifyLogo;
