import './App.css';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router } from "react-router-dom";
import Home from './Home';
import Auth from './Auth';
import Signup from './Signup';
import axios from 'axios';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [spotifyTokenInState, setSpotifyTokenInState] = useState(null);
  const [spotifyUserInfo, setSpotifyUserInfo] = useState({ id: '', displayName: '' });

  // SPOTIFY CREDENTIALS
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const REDIRECT_URI = 'http://localhost:3000/';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token';
  const SCOPES = 'playlist-modify-private playlist-modify-public'

  const authLink = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

  useEffect(() => {
    const hash = window.location.hash;
    console.log(hash, ' <-- hash')
    let spotifyToken = window.localStorage.getItem('spotifyToken');
    if (!spotifyToken && hash) {
      spotifyToken = hash.substring(1).split('&').find(e => e.startsWith('access_token')).split('=')[1];
      window.localStorage.setItem('spotifyToken', spotifyToken);
      setSpotifyTokenInState(spotifyToken);
      window.location.hash = '';

      const getSpotifyUserId = async (spotifyToken) => {
        return await axios({
          method: 'get',
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + spotifyToken },
        }).then(({ data }) => {
          window.localStorage.setItem('spotifyUserId', data.id);
          window.localStorage.setItem('spotifyUserDisplayName', data.display_name);
          const spotifyUserId = window.localStorage.getItem('spotifyUserId');
          const spotifyUserDisplayName = window.localStorage.getItem('spotifyUserDisplayName');
          setSpotifyUserInfo({ id: spotifyUserId, displayName: spotifyUserDisplayName })
        });
      };
      getSpotifyUserId(spotifyToken);

    };
    if (spotifyToken && !spotifyTokenInState) setSpotifyTokenInState(spotifyToken);
  }, []);

  useEffect(() => {
    const spotifyUserId = window.localStorage.getItem('spotifyUserId');
    const spotifyUserDisplayName = window.localStorage.getItem('spotifyUserDisplayName');
    setSpotifyUserInfo({ id: spotifyUserId, displayName: spotifyUserDisplayName })
  }, []);


  const handleLogout = () => {
    console.log('handleLogout');
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    localStorage.removeItem('spotifyToken');
    localStorage.removeItem('spotifyUserId');
    localStorage.removeItem('spotifyUserDisplayName');
    setLoggedIn(false);
    setToken(null);
    setUserId(null);
    setUserEmail(null);
    setSpotifyUserInfo({ id: '', displayName: '' });
  }

  const updateLoggedIn = (data) => {
    const { idToken, localId, expiresIn, email } = data; // idToken is the FB token, localId is the FB user id
    setLoggedIn(true);
    setToken(idToken);
    setUserId(localId);
    setUserEmail(email);

    setTimeout(() => {
      handleLogout();
    }, expiresIn * 3600000)
  };


  useEffect(() => {
    // Component did mount
    const token = localStorage.getItem('token');
    const persistentUserId = localStorage.getItem('userId');
    if (!token) {
      handleLogout()
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      const persistentUserId = localStorage.getItem('userId');
      const timeRemaining = ((expirationDate.getTime() - new Date().getTime()));
      console.log('timeRemaining: ' + timeRemaining)
      if (expirationDate <= new Date()) { // HAD a valid token, but it has since expired
        handleLogout()
      } else { // HAD a valid token, AND the current time is still less than the expirationDate
        setLoggedIn(true);
        setToken(token);
        setUserId(persistentUserId)
      }
    };
  }, []);

  const spotifyLoginScreen = () => ( // TO DO - turn into seperate component
    <div>
      <h1>Auth</h1>
      <a href={authLink}>Login to Spotify</a>
    </div>
  );

  return (
    <div className="App">
      <Router>
        <Route exact path="/">
          <Home handleLogout={handleLogout} userId={userId} userEmail={userEmail} token={token} spotifyUserInfo={spotifyUserInfo} />
        </Route>
        <Route path="/login">
          <Auth updateLoggedIn={updateLoggedIn} loggedIn={loggedIn} />
        </Route>
        <Route path="/signup">
          <Signup updateLoggedIn={updateLoggedIn} loggedIn={loggedIn} />
        </Route>
        <Route path="/spotifylogin">
          {spotifyLoginScreen()}
        </Route>
      </Router>
    </div >
  );
}

export default App;

/*

          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />

*/