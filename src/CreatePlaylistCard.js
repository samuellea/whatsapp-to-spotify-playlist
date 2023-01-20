import './styles/CreatePlaylistCard.css';
import React, { useState, useEffect } from 'react';
import * as u from './utils';

function CreatePlaylistCard({ spotifyToken, spotifyUserInfo, newPlaylistSuccess, token, userId }) {
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
    u.createSpotifyPlaylist(spotifyUserInfo.id, spotifyToken, newPlaylistName).then(({ data, status }) => {
      if (status === 201 | status === 200) {
        const { id, name } = data;
        u.createFirebasePlaylist(id, name, userId, token).then(fbRes => {
          if (status === 201 | status === 200) {
            setCreatingNewPlaylist(false);
            newPlaylistSuccess(true)

          } else {
            setCreatingNewPlaylist(false);
            newPlaylistSuccess(false)
            // delete the new playlist we created on spoti - can't delete spotify playlist via API :/ - could handle FB first, but we wanted the spotify PL id for that...
            console.log('posting new playlist info to firebase failed.')
          }
        })
      } else {
        setCreatingNewPlaylist(false);
        newPlaylistSuccess(false)
        console.log('creating spotify playlist failed.')
      }
    })

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
