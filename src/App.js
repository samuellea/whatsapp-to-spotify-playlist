import './App.css';
import React, { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router } from "react-router-dom";
import { Redirect, useLocation } from "react-router-dom";
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
import SpotifyIconGreen from './Spotify_Icon_RGB_Green.png';
import SpotifyLogoWhitePNG from './Spotify_Logo_RGB_White.png';
import PrivacyPolicy from './PrivacyPolicy';


function App() {

  const publicStatsHashNonAuth = localStorage.getItem('publicStatsHashNonAuth')
  if (publicStatsHashNonAuth && publicStatsHashNonAuth === 'undefined') localStorage.removeItem('publicStatsHashNonAuth');

  const [loggedIn, setLoggedIn] = useState(false);
  // const [spotifyUserInfo, setSpotifyUserInfo] = useState({ id: '', displayName: '' });
  const [welcome, setWelcome] = useState(false);
  const [token, setToken] = useState(null);
  const [userPlaylistMetas, setUserPlaylistMetas] = useState([]);
  const [userPlaylistsLoading, setUserPlaylistsLoading] = useState(true);
  const [spotifyUserDisplayName, setSpotifyUserDisplayName] = useState(null);
  const [privacyPolicy, showPrivacyPolicy] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // SPOTIFY CREDENTIALS
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
  const REDIRECT_URI = 'https://whatsapp-to-spotify.netlify.app';
  // const REDIRECT_URI = 'http://localhost:3000/';
  const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
  const RESPONSE_TYPE = 'token';
  const SCOPES = 'playlist-modify-private playlist-modify-public';

  const authLink = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

  useEffect(() => {
    let spotifyUserDisplayName = window.localStorage.getItem('spotifyUserDisplayName');
    setSpotifyUserDisplayName(spotifyUserDisplayName)
    const hash = window.location.hash;
    let spotifyToken = window.localStorage.getItem('spotifyToken');
    if (!spotifyToken && hash) {
      console.log('POW')
      spotifyToken = hash.substring(1).split('&').find(e => e.startsWith('access_token')).split('=')[1];
      window.localStorage.setItem('spotifyToken', spotifyToken);
      window.location.hash = '';

      const getSpotifyUserId = async (spotifyToken) => {
        return await axios({
          method: 'get',
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + spotifyToken },
        }).then(({ data }) => {
          console.log(data, ' <---- spotify data after login')
          window.localStorage.setItem('spotifyUserId', data.id);
          window.localStorage.setItem('spotifyUserDisplayName', data.display_name);
          let spotifyUserDisplayName = window.localStorage.getItem('spotifyUserDisplayName');
          setSpotifyUserDisplayName(spotifyUserDisplayName)
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
    console.log(token);
    console.log(firebaseUserId);
    return await u.getUserFirebasePlaylistsMetadata(firebaseUserId, token).then(async ({ data, status }) => {
      if (status === 200) {
        console.log('BOP')
        // console.log(status, ' <-- fetchAndSetFirebasePlaylistMetasStatus!');
        // await mockSleep(5000) // ❓ ❓ ❓ ❓
        if (data) {
          console.log('BLEP')
          const userPlaylistMetas = Object.entries(data).map(e => ({ metaId: e[0], ...e[1] }));
          console.log(userPlaylistMetas)
          setUserPlaylistMetas(userPlaylistMetas);
          setUserPlaylistsLoading(false);
          return true;
        }
      }
    });
  };

  const handleResize = () => {
    return window.innerWidth < 720 ? setIsMobile(true) : setIsMobile(false);
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.innerWidth < 720 ? setIsMobile(true) : setIsMobile(false);
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

  // TO DO - turn into seperate component
  const SpotifyLoginScreen = () => {
    let spotifyToken = window.localStorage.getItem('spotifyToken');
    return (
      <div className="SpotifyLoginContainer Flex Column">
        {!spotifyToken ?
          <>
            <img id="SpotifyLogoWhiteLarge" src={SpotifyLogoWhitePNG} />
            <a href={authLink}>
              {/* <img src={SpotifyIconGreen} /> */}
              Login
            </a>
            <span onClick={() => showPrivacyPolicy(true)}>By proceeding, you agree that you have read the terms of our <span id="SpotifyLoginPrivacyPolicy">Privacy Policy</span></span>
          </>
          :
          publicStatsHashNonAuth !== null ? <Redirect to={`/publicStats/${publicStatsHashNonAuth}`} />
            : <Redirect to='/' />
        }
        <div className="InvisiBox" style={{ height: '10%' }} />
      </div >
    )
  };

  let spotifyToken = window.localStorage.getItem('spotifyToken');

  return (
    <div className="App">
      <div className="AppView">
        {isMobile ? null : <span id="MobileWarning">⚠ This webapp is best viewed on mobile</span>}
        <Router>
          <Route path="/publicStats/:publicStatsId">
            <PublicStats authLink={authLink} handleLogout={handleLogout} />
          </Route>
          <Route path="/login">
            {!loggedIn ?
              <Auth updateLoggedIn={updateLoggedIn} loggedIn={loggedIn} showPrivacyPolicy={showPrivacyPolicy} />
              : !spotifyToken ? <Redirect to='/spotifylogin' /> : <Redirect to='/' />
            }
          </Route>
          <Route path="/signup">
            <Signup updateLoggedIn={updateLoggedIn} loggedIn={loggedIn} appToast={toast} showPrivacyPolicy={showPrivacyPolicy} />
          </Route>
          <PrivateRoute exact path="/" publicStatsHashNonAuth={publicStatsHashNonAuth}>
            <Home
              loggedIn={loggedIn}
              handleLogout={handleLogout}
              userPlaylistMetas={userPlaylistMetas}
              fetchAndSetFirebasePlaylistMetas={fetchAndSetFirebasePlaylistMetas}
              userPlaylistsLoading={userPlaylistsLoading}
              appToast={toast}
              spotifyUserDisplayName={spotifyUserDisplayName}
            />
          </PrivateRoute>
          <Route path="/spotifylogin" >
            <SpotifyLoginScreen />
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
          <Toaster />

        </Router>
        {privacyPolicy ?
          <PrivacyPolicy showPrivacyPolicy={showPrivacyPolicy} />
          : null}
      </div >
    </div>
  );
}

export default App;