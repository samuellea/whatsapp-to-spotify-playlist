import './styles/CreatePlaylistCard.css';
import React, { useState, useEffect } from 'react';
import * as u from './utils';

function CreatePlaylistCard({ spotifyToken, spotifyUserInfo, createNewPlaylist, token }) {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [cardMode, setCardMode] = useState('newMode');
  const [creatingNewPlaylist, setCreatingNewPlaylist] = useState(false);

  // useEffect(() => {
  //   // Component did mount
  // }, []);

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
    u.createFirebasePlaylist(newPlaylistName, token);
    // u.createSpotifyPlaylist(spotifyUserId, spotifyToken, newPlaylistName).then(spotifyRes => {
    //   setCreatingNewPlaylist(false);
    //   createNewPlaylist(spotifyRes);
    // })
  };

  const newMode = () => {
    return (
      <div className="newMode">
        <p>Create +</p>
        <button onClick={handleStartCreate}>Create</button>
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
