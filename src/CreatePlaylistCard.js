import './styles/CreatePlaylistCard.css';
import React, { useState, useEffect } from 'react';
import * as u from './utils';

function CreatePlaylistCard({ spotifyToken, spotifyUserInfo, newPlaylistSuccess, firebaseUserId }) {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [cardMode, setCardMode] = useState('newMode');
  const [creatingNewPlaylist, setCreatingNewPlaylist] = useState(false);

  const token = localStorage.getItem('token');

  const handleStartCreate = () => {
    setCardMode('namePlaylistMode')
  };

  const handleCancelCreate = () => {
    setNewPlaylistName('');
    setCardMode('newMode')
  };

  const handlePlaylistNameChange = (e) => {
    setNewPlaylistName(e.target.value);
  };

  const handleSubmitNewPlaylist = () => {
    setCreatingNewPlaylist(true)
    // create spotify playlist
    u.createSpotifyPlaylist(spotifyUserInfo.id, spotifyToken, newPlaylistName).then(({ status, data }) => {
      if ([200, 201].includes(status)) {
        const { id: spotifyPlaylistId, name: spotifyPlaylistName } = data;
        // create playlist object on the FB /playlists endpoint - doing this, if successful, should then trigger creation of metadata object
        const playlistData = {
          rawPostsLog: [],
          processedPostsLog: [],
          spotifyUserId: spotifyUserInfo.id,
          spotifyPlaylistId: spotifyPlaylistId,
          spotifyPlaylistName: spotifyPlaylistName,
        };

        u.createOrUpdateFirebasePlaylist('POST', firebaseUserId, token, playlistData).then((status) => {
          newPlaylistSuccess(status)
          setCreatingNewPlaylist(false);
          setNewPlaylistName('');
          setCardMode('newMode')
        })
      } else {
        newPlaylistSuccess(status)
        setCreatingNewPlaylist(false);
        setNewPlaylistName('');
        setCardMode('newMode');
        console.log('creating spotify playlist failed.')
      }
    });
  };

  const newMode = () => {
    return (
      <div className="newMode">
        <p>Create +</p>
        <button onClick={handleStartCreate} type="button">Create</button>
      </div >
    )
  }

  const namePlaylistMode = () => {
    return (
      <div className="namePlaylistMode">
        {
          creatingNewPlaylist ?
            <h1>Creating...</h1>
            :
            <div className="namePlaylistInputs">
              <input type="text" onChange={handlePlaylistNameChange}></input>
              <button onClick={handleCancelCreate}>Cancel</button>
              <button onClick={handleSubmitNewPlaylist} disabled={!newPlaylistName.length}>Submit</button>
            </div>
        }
      </div >
    )
  }

  const cardModeLookup = {
    'newMode': () => newMode(),
    'namePlaylistMode': () => namePlaylistMode(),
  };

  return (
    <div className="CreatePlaylistCard">
      {cardModeLookup[cardMode]()}
    </div >
  );
}

export default CreatePlaylistCard;
