import React, { useEffect, useState } from 'react';
import { Redirect, Link, useLocation } from "react-router-dom";
import axios from 'axios';
import Spinner from './Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import './styles/Auth.css';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import * as h from './helpers';
import logo from './chatchoons-icon-512.png'
import SpotifyLogo from './SpotifyLogo';
import getUserLocale from 'get-user-locale';

function Auth({ updateLoggedIn, loggedIn, showPrivacyPolicy }) { // this is our Login page if an existing user

  localStorage.removeItem('publicStatsHashNonAuth');

  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    const fontsArr = ['Raleway-Regular', 'Raleway-ExtraLight', 'Raleway-SemiBold']
    h.setLoadedFonts(fontsArr, setFontsLoaded);
  }, []);

  useEffect(() => {
    return function cleanup() {
      showPrivacyPolicy(false);
    }
  }, []);

  const [email, setEmail] = useState('samtest1@gmail.com');
  const [password, setPassword] = useState('klklkl00');
  const [loginPending, setLoginPending] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    if (e.target.id === 'email') setEmail(e.target.value)
    if (e.target.id === 'password') setPassword(e.target.value)
  }

  const performLogIn = () => {
    const authData = { email, password, returnSecureToken: true };
    axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`, authData)
      .then(async (res) => {
        console.log(res)
        const { data } = res;
        console.log(data, ' ****************************************************')
        const expirationDate = new Date(new Date().getTime() + (3480000)) // auto logout in 58 mins (ms)
        localStorage.setItem('token', data.idToken);
        localStorage.setItem('firebaseUserId', data.localId);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('email', data.email);
        localStorage.setItem('refreshToken', data.refreshToken);
        setLoginPending(false);
        updateLoggedIn();
      })
      .catch(err => {
        console.log(err);
        setLoginPending(false);
        setError(err.toString())
      })
  };

  const handleClick = () => {
    setLoginPending(true);
    setError(null);
    performLogIn();
  };

  /////////////////////////
  // const autoLogin = async () => {
  //   await h.mockSleep(1000);
  //   handleClick();
  // }
  // useEffect(() => {
  //   autoLogin();
  // }, []);
  //////////////////////////

  let spotifyToken = window.localStorage.getItem('spotifyToken');
  if (loggedIn && !spotifyToken) {
    return <Redirect to='/spotifylogin' />
  };

  const userLocale = getUserLocale();
  console.log(userLocale)

  return (
    <div className="Auth Flex Column" style={{ opacity: fontsLoaded ? 1 : 0 }}>
      <div className="InvisiBox" style={{ flex: 0.5 }} />
      <div className="AuthHeaders">
        <img src={logo} />
        <h1 className="Raleway-SemiBold">Chatchoons</h1>
        <h2 className="Raleway-ExtraLight">Make and maintain playlists of the songs shared in your WhatsApp chats</h2>
      </div>

      <div className="InvisiBox" style={{ flex: 0.25 }} />

      {!loginPending ?
        <form className="Flex Column" onSubmit={(event) => event.preventDefault()}>

          <div className="InputContainer">
            <span>Email</span>
            <input className="emailInput" type="text" id="email" onChange={(event) => handleChange(event)}></input>
          </div>

          <div className="InputContainer">
            <span>Password</span>
            <input type="password" id="password" onChange={(event) => handleChange(event)}></input>
          </div>


          <div className="submitButtonContainer">
            <button className="authSubmitButton" onClick={handleClick}>Login</button>
          </div>
          <Link to="/signup" style={{ color: '#c98cff' }}>No account? Sign up</Link>
          <span className="ByProceedingNotice">By proceeding, you confirm that you have read and agree to the terms of our <span onClick={() => showPrivacyPolicy(true)} id="PrivacyPolicyLink">Privacy Policy</span></span>

        </form>
        :
        <div className="AuthSpinnerContainer Flex Column">
          <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
        </div>
      }
      <div className="LoginErrorContainer">
        {error ? <span className="LoginErrorMsg Flex">
          <FontAwesomeIcon icon={faWarning} pointerEvents="none" />
          Could not login - please try again</span> : null}
      </div>

      <h2>{userLocale}</h2>

      <a href="https://developer.spotify.com/" target="_blank" id="SpotifyCreditFooterLink">
        <div className="SpotifyCreditFooter Flex Row">
          <SpotifyLogo />
          Built using the Spotify Web API
        </div>
      </a>


      <div className="CopyrightFooter" style={{ paddingTop: 0, paddingBottom: '10%' }}>
        <span> © Sam Lea 2023</span>
        <span>|</span>
        <span>Email the dev <a href="mailto:samuel.lea@live.co.uk">here</a></span>
        {/* <span>|</span> */}
        {/* <span id="PrivacyPolicyLink" onClick={() => showPrivacyPolicy(true)}>Privacy Policy</span> */}
      </div>


      <div className="InvisiBox" style={{ flex: 1 }} />
    </div>
  )

}

export default Auth;

