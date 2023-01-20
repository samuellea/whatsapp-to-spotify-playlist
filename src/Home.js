import './App.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import * as u from './utils';
import PlaylistCard from './PlaylistCard';
import CreatePlaylistCard from './CreatePlaylistCard';
import './styles/Home.css';

function Home({ handleLogout, userId, userEmail, token, spotifyUserInfo }) {
  let history = useHistory();
  // let location = useLocation();
  const spotifyToken = localStorage.getItem('spotifyToken');
  const firebaseUserId = localStorage.getItem('firebaseUserId');

  const [userPlaylists, setUserPlaylists] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('login');
    }
    u.getUserFirebasePlaylists(firebaseUserId, token).then(({ data, status }) => {
      if (status === 200) {
        // insert an 'if data = something, not nothing' block for this
        const userPlaylists = Object.values(data.playlists);
        setUserPlaylists(userPlaylists);
      }
    })
    // console.log(spotifyUserInfo, ' <-- spotifyUserInfo')
  }, []);


  const newPlaylistSuccess = (success) => {
    if (success) {
      toast('Playlist created!', { duration: 1500 })
      // pull down users playlists again, so we can display the newly-created playlist
      u.getUserFirebasePlaylists(firebaseUserId, token).then(({ data, status }) => {
        if (status === 200) {
          const userPlaylists = Object.values(data.playlists);
          setUserPlaylists(userPlaylists);
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
      {userPlaylists?.length > 0 ?
        userPlaylists.map((playlistObj, i) => <PlaylistCard playlistObj={playlistObj} key={`card-${i}`} />)
        : null}
      <CreatePlaylistCard
        spotifyToken={spotifyToken}
        spotifyUserInfo={spotifyUserInfo}
        newPlaylistSuccess={newPlaylistSuccess}
        token={token}
        userId={userId}
      />
      <Toaster />
    </div >
  );


}

export default Home;
