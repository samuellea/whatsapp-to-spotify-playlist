import './styles/PlaylistCard.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import * as u from './utils';
import * as h from './helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn, faAdd, faTrash, faDeleteLeft, faTrashAlt, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function PlaylistCard({ metaObj, firebaseUserId, token, deletePlaylistSuccess }) {
  let history = useHistory();

  const handleStats = () => {
    history.push(`/stats?spotifyPlaylistId=${metaObj.spotifyPlaylistId}&firebaseMetaId=${metaObj.metaId}`);
  };

  const handleUpdate = () => {
    history.push(`/update?spotifyPlaylistId=${metaObj.spotifyPlaylistId}&firebasePlaylistId=${metaObj.firebasePlaylistId}`);
  };

  const handleDelete = async () => {
    let r = window.confirm('Delete this playlist from the app? NB - the playlist will remain on Spotify. Delete it manually there too if desired.');
    if (r == true) {
      const deleteFirebasePlaylistStatus = await u.deleteFirebasePlaylist(metaObj.firebasePlaylistId, metaObj.metaId, token);
      return deletePlaylistSuccess(deleteFirebasePlaylistStatus);
    };
  };

  return (
    <div className="HomePlaylistCard Flex Column">

      <div className="HomePlaylistCardInfoContainer Flex Column">
        <h1 className="PlaylistCardCurtailText Curtail2">{metaObj.spotifyPlaylistName} </h1>
        <span id="count">{metaObj.totalTracks}<span id="tracks">tracks</span></span>

        <span id="lastUpdated">last updated {h.getLastUpdatedFromMeta(metaObj)}</span>
      </div>

      <div className="HomePlaylistCardButtonsContainer Flex">
        <button type="button" onClick={() => handleUpdate()}>
          <FontAwesomeIcon icon={faAdd} pointerEvents="none" />
        </button>
        <button type="button" onClick={() => handleStats()} disabled={metaObj.totalTracks === 0}>
          <FontAwesomeIcon icon={faChartColumn} pointerEvents="none" />
        </button>

        <button type="button" id="PlaylistCardTrashButton" onClick={() => handleDelete()}>
          <FontAwesomeIcon icon={faTrashAlt} pointerEvents="none" />
        </button>

      </div>
    </div >
  )
}

export default PlaylistCard;
