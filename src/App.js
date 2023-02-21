import './App.css';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Redirect } from "react-router-dom";
import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Auth from './Auth';
import Signup from './Signup';
import Update from './Update';
import axios from 'axios';
import Stats from './Stats';
import * as u from './utils';
import Spinner from './Spinner';
import { mockSleep } from './helpers';
import toast, { Toaster } from 'react-hot-toast';
import PublicStats from './PublicStats';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  // const [spotifyUserInfo, setSpotifyUserInfo] = useState({ id: '', displayName: '' });
  const [welcome, setWelcome] = useState(false);
  const [token, setToken] = useState(null);
  const [userPlaylistMetas, setUserPlaylistMetas] = useState([]);
  const [userPlaylistsLoading, setUserPlaylistsLoading] = useState(true);

  // SPOTIFY CREDENTIALS
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const REDIRECT_URI = 'http://localhost:3000/';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token';
  const SCOPES = 'playlist-modify-private playlist-modify-public';

  const authLink = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

  useEffect(() => {
    let spotifyToken = window.localStorage.getItem('spotifyToken');
    const hash = window.location.hash;
    if (!spotifyToken && hash) {
      spotifyToken = hash.substring(1).split('&').find(e => e.startsWith('access_token')).split('=')[1];
      window.localStorage.setItem('spotifyToken', spotifyToken);
      window.location.hash = '';

      const getSpotifyUserId = async (spotifyToken) => {
        return await axios({
          method: 'get',
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + spotifyToken },
        }).then(({ data }) => {
          window.localStorage.setItem('spotifyUserId', data.id);
          window.localStorage.setItem('spotifyUserDisplayName', data.display_name);
          // const spotifyUserId = window.localStorage.getItem('spotifyUserId');
          // const spotifyUserDisplayName = window.localStorage.getItem('spotifyUserDisplayName');
          // setSpotifyUserInfo({ id: spotifyUserId, displayName: spotifyUserDisplayName });
          setLoggedIn(true);
        });
      };

      getSpotifyUserId(spotifyToken);

    };
  }, []);

  const fetchAndSetFirebasePlaylistMetas = async () => {
    setUserPlaylistsLoading(true);
    const token = localStorage.getItem('token');
    const firebaseUserId = localStorage.getItem('firebaseUserId');
    return await u.getUserFirebasePlaylistsMetadata(firebaseUserId, token).then(async ({ data, status }) => {
      if (status === 200) {
        // console.log(status, ' <-- fetchAndSetFirebasePlaylistMetasStatus!');
        // await mockSleep(5000) // ❓ ❓ ❓ ❓
        if (data) {
          const userPlaylistMetas = Object.entries(data).map(e => ({ metaId: e[0], ...e[1] }));
          setUserPlaylistMetas(userPlaylistMetas);
          setUserPlaylistsLoading(false);
          return true;
        }
      }
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
      fetchAndSetFirebasePlaylistMetas();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (loggedIn) {
        const expirationDate = localStorage.getItem('expirationDate');
        const expirationTime = new Date(expirationDate);
        // console.log(expirationTime)
        // console.log(new Date())
        if (expirationTime <= new Date()) {
          handleLogout();
        };
      };
    }, 2000);

    return () => clearInterval(interval);
  }, [loggedIn]);

  const handleLogout = () => {
    // console.log('handleLogout!')
    localStorage.clear();
    setLoggedIn(false);
    // setSpotifyUserInfo({ id: '', displayName: '' });
  }

  const updateLoggedIn = async () => {
    setLoggedIn(true);
  };

  const spotifyLoginScreen = () => { // TO DO - turn into seperate component
    let spotifyToken = window.localStorage.getItem('spotifyToken');
    // console.log(spotifyToken);
    return (
      <div className="SpotifyLoginContainer Flex Column">
        {!spotifyToken ?
          <div className="SpotifyLoginScreen Flex Column">
            <h1 className="Raleway-SemiBold">Login to Spotify</h1>
            <a href={authLink}>Login</a>
          </div>
          :
          <Redirect to='/' />}
        <div className="InvisiBox" style={{ height: '10%' }} />
      </div>
    )
  };

  let spotifyToken = window.localStorage.getItem('spotifyToken');

  return (
    <div className="App">
      <div className="AppView">
        <Router>
          <Route path="/publicStats/:publicStatsId">
            <PublicStats />
          </Route>
          <Route path="/login">
            {!loggedIn ?
              <Auth updateLoggedIn={updateLoggedIn} loggedIn={loggedIn} />
              : !spotifyToken ? <Redirect to='/spotifylogin' /> : <Redirect to='/' />
            }
          </Route>
          <Route path="/signup">
            <Signup updateLoggedIn={updateLoggedIn} loggedIn={loggedIn} />
          </Route>
          <PrivateRoute exact path="/">
            <Home
              loggedIn={loggedIn}
              handleLogout={handleLogout}
              userPlaylistMetas={userPlaylistMetas}
              fetchAndSetFirebasePlaylistMetas={fetchAndSetFirebasePlaylistMetas}
              userPlaylistsLoading={userPlaylistsLoading}
              appToast={toast}
            />
            <Toaster />
          </PrivateRoute>
          <Route path="/spotifylogin" >
            {spotifyLoginScreen()}
          </Route>
          <PrivateRoute path="/update">
            <Update userPlaylistMetas={userPlaylistMetas} fetchAndSetFirebasePlaylistMetas={fetchAndSetFirebasePlaylistMetas} />
          </PrivateRoute>
          <PrivateRoute path="/stats">
            {userPlaylistMetas.length ?
              <Stats
                userPlaylistMetas={userPlaylistMetas}
                fetchAndSetFirebasePlaylistMetas={fetchAndSetFirebasePlaylistMetas}
                userPlaylistsLoading={userPlaylistsLoading}
                appToast={toast}
              />
              : null}
          </PrivateRoute>
        </Router>
      </div >
    </div>
  );
}

export default App;