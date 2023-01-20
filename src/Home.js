import './App.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import * as u from './utils';
import CreatePlaylistCard from './CreatePlaylistCard';
import './styles/Home.css';

function Home({ handleLogout, userId, userEmail, token, spotifyUserInfo }) {
  let history = useHistory();
  // let location = useLocation();
  const spotifyToken = localStorage.getItem('spotifyToken');

  const [userPlaylists, setUserPlaylists] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('login');
    }
    // console.log(spotifyUserInfo, ' <-- spotifyUserInfo')
  }, []);


  const createNewPlaylist = (spotifyResponse) => {
    // if (spotifyResponse.status === 201) {
    //   const { data } = spotifyResponse;
    //   toast('Playlist created!', { duration: 1500 })
    //   // data.id
    //   // data.name
    // } else {
    //   toast(`Couldn't create playlist.`, { duration: 2000 })
    // }
  };

  const logoutClicked = () => {
    handleLogout();
    window.location.reload()
  };

  return (
    <div className="HomeScreenLoggedInSpotify">
      <button type="button" onClick={logoutClicked}>Logout</button>
      <p>logged in: {spotifyUserInfo.displayName}</p>
      <CreatePlaylistCard spotifyToken={spotifyToken} spotifyUserInfo={spotifyUserInfo} createNewPlaylist={createNewPlaylist} token={token} />
      <Toaster />
    </div >
  );


}

export default Home;
