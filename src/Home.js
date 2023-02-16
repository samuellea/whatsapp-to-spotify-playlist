import './App.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import * as u from './utils';
import PlaylistCard from './PlaylistCard';
import CreatePlaylistCard from './CreatePlaylistCard';
import { Oval } from 'react-loading-icons';
import './styles/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import RecordSleeveIcon from './RecordSleeveIcon';

function Home({
  loggedIn,
  handleLogout,
  userPlaylistMetas,
  fetchAndSetFirebasePlaylistMetas,
  userPlaylistsLoading,
}) {
  const history = useHistory();
  const token = localStorage.getItem('token');
  const spotifyToken = localStorage.getItem('spotifyToken');
  const firebaseUserId = localStorage.getItem('firebaseUserId');
  const spotifyUserDisplayName = localStorage.getItem('spotifyUserDisplayName');

  const [viewCreateModal, setViewCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creatingNewPlaylist, setCreatingNewPlaylist] = useState(false);

  const newPlaylistSuccess = (status) => {
    console.log(status, ' <--- status')
    if ([200, 201].includes(status)) {
      toast('Playlist created!', { duration: 1500 })
      // pull down users playlists again, so we can display the newly-created playlist
      fetchAndSetFirebasePlaylistMetas();
    } else {
      toast(`Couldn't create playlist.`, { duration: 2000 })
    }
  };

  const logoutClicked = () => {
    handleLogout();
    history.push('/login')
    // window.location.reload()
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
          setViewCreateModal(false);
        })
      } else {
        newPlaylistSuccess(status)
        setCreatingNewPlaylist(false);
        setNewPlaylistName('');
        setViewCreateModal(false);
        console.log('creating spotify playlist failed.')
      }
    });
  };

  const handleCancelCreate = () => {
    setNewPlaylistName('');
    setViewCreateModal(false);
  };

  const handlePlaylistNameChange = (e) => {
    setNewPlaylistName(e.target.value);
  };

  const alphabetizedMetas = (metasArr) => {
    return metasArr.sort((a, b) => a.spotifyPlaylistName.toLowerCase() > b.spotifyPlaylistName.toLowerCase() ? 1 : -1)
  };

  return (

    <div className="HomeScreenLoggedInSpotify Flex Column">
      {userPlaylistsLoading ?
        <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
        :

        <div className="HomeContainer Flex Column">

          <div className="UserContainer Flex Row">
            <FontAwesomeIcon icon={faUserCircle} pointerEvents="none" />
            <div className="UsernameAndSignOut Flex Column">
              <span className="Raleway-Regular">{spotifyUserDisplayName}</span>
              <button type="button" onClick={logoutClicked}>
                sign out
                <FontAwesomeIcon icon={faArrowAltCircleRight} pointerEvents="none" />
              </button>
            </div>
          </div>

          <div className="HomePlaylistCardsContainer">
            {userPlaylistMetas?.length > 0 ?
              alphabetizedMetas(userPlaylistMetas).map((metaObj, i) => <PlaylistCard metaObj={metaObj} key={`card-${i}`} />)
              : <div className="NoPlaylistsMessage Flex Column">
                <RecordSleeveIcon fill='#646480' />
                No playlists yet.
              </div>}
          </div>


          {/* <CreatePlaylistCard
            spotifyToken={spotifyToken}
            newPlaylistSuccess={newPlaylistSuccess}
            firebaseUserId={firebaseUserId}
            setViewCreateModal={setViewCreateModal}
          /> */}


          <div className="HomeCreatePlaylistButtonContainer Flex Column">
            <button type="button" onClick={() => setViewCreateModal(true)}>Create</button>
          </div>

          <Toaster />
          {viewCreateModal ?
            <div className="HomeCreatePlaylistModalContainer Flex Column">
              <div className="HomeCreatePlaylistModal Flex Column">
                {!creatingNewPlaylist ?
                  <div className="HomeCreatePlaylistModalContents Flex Column">
                    <input type="text" onChange={handlePlaylistNameChange}></input>
                    <button type="button" onClick={handleCancelCreate}>Cancel</button>
                    <button type="button" onClick={handleSubmitNewPlaylist} disabled={!newPlaylistName.length}>Create New Playlist</button>
                  </div> :
                  <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
                }
              </div>
            </div>
            : null}

          <div className="CreatePlaylistModalBackdrop" style={{ visibility: `${viewCreateModal ? 'visible' : 'hidden'}` }}>

          </div>

        </div>
      }


    </div>

  );


}

export default Home;
