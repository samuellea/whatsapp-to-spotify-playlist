import './styles/PlaylistCard.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import * as u from './utils';

function PlaylistCard({ playlistObj }) {
  let history = useHistory();

  const handleUpdate = (spotifyPlaylistId) => {
    console.log('!')
    history.push(`/update/${spotifyPlaylistId}`);
  };

  return (
    <div className="PlaylistCard">
      <h4>{playlistObj.spotifyPlaylistName}</h4>
      <p>tracks: {playlistObj.totalTracks}</p>
      <button type="button" onClick={() => handleUpdate(playlistObj.spotifyPlaylistId)}>Update</button>
    </div>
  )
}

export default PlaylistCard;
