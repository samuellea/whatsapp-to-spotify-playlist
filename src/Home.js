import './App.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import * as u from './utils';
import PlaylistCard from './PlaylistCard';
import CreatePlaylistCard from './CreatePlaylistCard';
import './styles/Home.css';

function Home({ handleLogout, userId, userEmail, token, spotifyUserInfo }) {
  let history = useHistory();

  const spotifyToken = localStorage.getItem('spotifyToken');
  const firebaseUserId = localStorage.getItem('firebaseUserId');

  const [userPlaylistMetas, setUserPlaylistMetas] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('login');
    }
    u.getUserFirebasePlaylistsMetadata(firebaseUserId, token).then(({ data, status }) => {
      if (status === 200) {
        if (data) {
          console.log(data)
          const userPlaylistMetas = Object.values(data);
          setUserPlaylistMetas(userPlaylistMetas);
        }
      }
    })
    // console.log(spotifyUserInfo, ' <-- spotifyUserInfo')
  }, []);

  const newPlaylistSuccess = (status) => {
    console.log(status, ' <--- status')
    if ([200, 201].includes(status)) {
      toast('Playlist created!', { duration: 1500 })
      // pull down users playlists again, so we can display the newly-created playlist
      u.getUserFirebasePlaylistsMetadata(firebaseUserId, token).then(({ data, status }) => {
        if (status === 200) {
          console.log(Object.entries(data)[0][0])
          console.log(typeof Object.entries(data)[0][0])
          const userPlaylistMetas = Object.values(data);
          setUserPlaylistMetas(userPlaylistMetas);
        }
      })
    } else {
      toast(`Couldn't create playlist.`, { duration: 2000 })
    }
  };

  const logoutClicked = () => {
    handleLogout();
    window.location.reload()
  };

  return (
    <div className="HomeScreenLoggedInSpotify">
      <button type="button" onClick={logoutClicked}>Logout</button>
      <p>logged in: {spotifyUserInfo.displayName}</p>
      {userPlaylistMetas?.length > 0 ?
        userPlaylistMetas.map((metaObj, i) => <PlaylistCard metaObj={metaObj} key={`card-${i}`} />)
        : null}
      <CreatePlaylistCard
        spotifyToken={spotifyToken}
        spotifyUserInfo={spotifyUserInfo}
        newPlaylistSuccess={newPlaylistSuccess}
        token={token}
        firebaseUserId={firebaseUserId}
      />
      <Toaster />
    </div >
  );


}

export default Home;
