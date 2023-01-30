import './styles/PlaylistCard.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import * as u from './utils';

function PlaylistCard({ metaObj, }) {
  let history = useHistory();

  const handleStats = () => {
    history.push(`/stats?spotifyPlaylistId=${metaObj.spotifyPlaylistId}`);
  };

  const handleUpdate = () => {
    history.push(`/update?spotifyPlaylistId=${metaObj.spotifyPlaylistId}&firebasePlaylistId=${metaObj.firebasePlaylistId}`);
  };

  return (
    <div className="PlaylistCard">
      <h4>{metaObj.spotifyPlaylistName}</h4>
      <p>tracks: {metaObj.totalTracks}</p>
      <div className="CardButtons">
        <button type="button" onClick={() => handleStats()} disabled={metaObj.totalTracks === 0}>Stats</button>
        <button type="button" onClick={() => handleUpdate()}>Update</button>
      </div>
    </div>
  )
}

export default PlaylistCard;
