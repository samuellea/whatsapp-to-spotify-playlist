import './App.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import * as u from './utils';
import PlaylistCard from './PlaylistCard';
import CreatePlaylistCard from './CreatePlaylistCard';
import { Oval } from 'react-loading-icons';
import './styles/Home.css';

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

  return (
    <div className="HomeScreenLoggedInSpotify">
      {userPlaylistsLoading ?
        <Oval stroke="#07eda8" height={100} width={100} strokeWidth={4} />
        :
        <div className="HomeScreen">
          <button type="button" onClick={logoutClicked}>Logout</button>
          <p>logged in: {spotifyUserDisplayName}</p>
          {userPlaylistMetas?.length > 0 ?
            userPlaylistMetas.map((metaObj, i) => <PlaylistCard metaObj={metaObj} key={`card-${i}`} />)
            : null}
          <CreatePlaylistCard
            spotifyToken={spotifyToken}
            newPlaylistSuccess={newPlaylistSuccess}
            firebaseUserId={firebaseUserId}
          />
          <Toaster />
        </div>
      }


    </div >
  );


}

export default Home;
