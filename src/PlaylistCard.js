import './styles/PlaylistCard.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import * as u from './utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn, faAdd } from '@fortawesome/free-solid-svg-icons';

function PlaylistCard({ metaObj }) {
  console.log(metaObj)
  let history = useHistory();

  const handleStats = () => {
    history.push(`/stats?spotifyPlaylistId=${metaObj.spotifyPlaylistId}&firebaseMetaId=${metaObj.metaId}`);
  };

  const handleUpdate = () => {
    history.push(`/update?spotifyPlaylistId=${metaObj.spotifyPlaylistId}&firebasePlaylistId=${metaObj.firebasePlaylistId}`);
  };

  return (
    <div className="HomePlaylistCard Flex Column">

      <div className="HomePlaylistCardInfoContainer Flex Column">
        <h1>{metaObj.spotifyPlaylistName}</h1>
        <span id="count">{metaObj.totalTracks}<span id="tracks">tracks</span></span>

      </div>

      <div className="HomePlaylistCardButtonsContainer Flex">
        <button type="button" onClick={() => handleUpdate()}>
          <FontAwesomeIcon icon={faAdd} pointerEvents="none" />
        </button>
        <button type="button" onClick={() => handleStats()} disabled={metaObj.totalTracks === 0}>
          <FontAwesomeIcon icon={faChartColumn} pointerEvents="none" />
        </button>
        {/* <span>last updated</span> */}
      </div>

    </div >
  )
}

export default PlaylistCard;
