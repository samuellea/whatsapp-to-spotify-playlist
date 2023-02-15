import './styles/CreatePlaylistCard.css';
import React, { useState, useEffect } from 'react';
import * as u from './utils';

function CreatePlaylistCard({ spotifyToken, spotifyUserInfo, newPlaylistSuccess, firebaseUserId, setViewCreateModal }) {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [cardMode, setCardMode] = useState('newMode');
  const [creatingNewPlaylist, setCreatingNewPlaylist] = useState(false);

  const token = localStorage.getItem('token');

  const handleStartCreate = () => {
    setCardMode('namePlaylistMode');
    setViewCreateModal(true);
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
    const spotifyUserId = window.localStorage.getItem('spotifyUserId');
    // create spotify playlist
    u.createSpotifyPlaylist(spotifyUserId, spotifyToken, newPlaylistName).then(({ status, data }) => {
      if ([200, 201].includes(status)) {
        const { id: spotifyPlaylistId, name: spotifyPlaylistName } = data;
        // create playlist object on the FB /playlists endpoint - doing this, if successful, should then trigger creation of metadata object
        const playlistData = {
          rawPostsLog: [],
          processedPostsLog: [],
          spotifyUserId: spotifyUserId,
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
      <div className="newMode Flex Row">
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
    <div className="CreatePlaylistCard Flex Column">
      {cardModeLookup[cardMode]()}
    </div >
  );
}

export default CreatePlaylistCard;
