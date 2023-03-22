import React, { useState, useEffect } from 'react';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
// import { apiKey } from './firebaseConfig';
import Spinner from './Spinner';
import './styles/Signup.css';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import SpotifyLogo from './SpotifyLogo';
import logo from './chatchoons-icon-512.png'

function Signup({ updateLoggedIn, loggedIn, appToast, showPrivacyPolicy }) { // this is our Login page if an existing user

  localStorage.removeItem('publicStatsHashNonAuth');

  useEffect(() => {
    return function cleanup() {
      showPrivacyPolicy(false);
    }
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState({ email: false, password: false });
  const [signupPending, setSignupPending] = useState(false);
  const [error, setError] = useState(null);

  const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi;

  const handleChange = e => {
    setError(null);
    if (e.target.id === 'email') {
      if (email.length && !e.target.value.length) setFormError({ ...formError, email: false })
      if (!email.length && e.target.value.length) setFormError({ ...formError, email: false })
      if (email.length && e.target.value.length && validEmailRegex.test(e.target.value)) setFormError({ ...formError, email: false })
      setEmail(e.target.value)
    }
    if (e.target.id === 'password') {
      if (password.length && !e.target.value.length) setFormError({ ...formError, password: false })
      if (!password.length && e.target.value.length) setFormError({ ...formError, password: false })
      if (password.length && e.target.value.length && e.target.value.length >= 8) setFormError({ ...formError, password: false })
      setPassword(e.target.value)
    }
  }

  // useEffect(() => {
  //   const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi;
  //   if (email.length && !validEmailRegex.test(email)) {
  //     setEmailError(true);
  //   } else {
  //     setEmailError(false);
  //   }
  //   if (!email.length) setEmailError(false);

  //   if (password.length && password.length < 8) {
  //     setPasswordError(true);
  //   } else {
  //     setPasswordError(false);
  //   }
  //   if (!password.length) setPasswordError(false);

  // }, [email, password])

  const performSignup = () => {
    // need to do some form validation for this at some point!!!
    // console.log('performSignup')
    const signupData = { email, password, returnSecureToken: true };
    console.log(signupData);
    axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`, signupData)
      .then(({ data }) => {
        console.log(data, ' <--- data in .then of Auth')
        const expirationDate = new Date(new Date().getTime() + (data.expiresIn * 1000))
        localStorage.setItem('token', data.idToken);
        localStorage.setItem('firebaseUserId', data.localId);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('email', data.email);
        setSignupPending(false);
        updateLoggedIn(data);
      })
      .catch(err => {
        console.log(err);
        let errorMsg = err;
        if (/^4\d{2}$/g.test(err.response?.status)) errorMsg = err.response.data.error.message;
        setSignupPending(false);
        setError(errorMsg.toString())
        appToast('Sign up failed. Please try again', { duration: 2000 })
      })
  };

  const handleClick = () => {
    // console.log(email)
    // console.log(password)
    let updatedFormError = { ...formError };
    if (!email.length) updatedFormError.email = true;
    if (email.length && !validEmailRegex.test(email)) updatedFormError.email = true;
    if (!password.length) updatedFormError.password = true
    if (password.length && password.length < 8) updatedFormError.password = true
    if (updatedFormError.email || updatedFormError.password) return setFormError(updatedFormError);

    setSignupPending(true);
    setError(null);
    performSignup();
  };

  if (loggedIn) {
    return <Redirect to='/spotifylogin' />
  }

  return (
    <div className="Signup Flex Column">
      <div className="InvisiBox" style={{ flex: 0.5 }} />
      <div className="AuthHeaders">
        <a className="LandingPageLink" href="http://localhost:3000/">
          <img src={logo} />
          <h1 className="Raleway-SemiBold">Chatchoons</h1>
          <h2 className="Raleway-ExtraLight">Make and maintain playlists of the songs shared in your WhatsApp chats</h2>
        </a>
      </div>

      <div className="InvisiBox" style={{ flex: 0.25 }} />

      {!signupPending ?
        <form className="Flex Column" onSubmit={(event) => event.preventDefault()}>

          <div className="InputContainer">
            <span>Email</span>
            <input className={`emailInput SignupInputError-${formError.email}`} type="text" id="email" onChange={(event) => handleChange(event)}></input>
            <span id="SignupInputError">{formError.email ? '* Please enter a valid email' : null}</span>

          </div>

          <div className="InputContainer">
            <span>Password</span>
            <input className={`emailInput SignupInputError-${formError.password}`} type="password" id="password" onChange={(event) => handleChange(event)}></input>
            <span id="SignupInputError">{formError.password ? '* Please enter a password (at least 8 chars)' : null}</span>
          </div>

          <div className="submitButtonContainer">
            <button className="authSubmitButton" onClick={handleClick} disabled={Object.values(formError).some(e => e)}>Create Account</button>
          </div>

          <Link to="/login" style={{ color: '#94ec9d' }}>Already have an account? Login</Link>
          <span className="ByProceedingNotice">By proceeding, you confirm that you have read and agree to the terms of our <span onClick={() => showPrivacyPolicy(true)} id="PrivacyPolicyLink">Privacy Policy</span></span>
        </form>
        :
        <div className="AuthSpinnerContainer Flex Column">
          <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
        </div>
      }
      {/* <div className="InvisiBox" style={{ height: '20%' }} /> */}
      <div className="SignupErrorContainer Flex Row">
        {error ? <span className="SignupErrorMsg Flex">
          <FontAwesomeIcon icon={faWarning} pointerEvents="none" />
          {error}</span> : null}
      </div>

      <a href="https://developer.spotify.com/" target="_blank" id="SpotifyCreditFooterLink">
        <div className="SpotifyCreditFooter Flex Row">
          <SpotifyLogo />
          Built using the Spotify Web API
        </div>
      </a>

      <div className="CopyrightFooter" style={{ paddingTop: 0, paddingBottom: '10%' }}>
        <span> © Sam Lea 2023</span>
        <span>|</span>
        <span>Email the dev <a href="mailto:samuel.edward.lea@gmail.com">here</a></span>
        <span>|</span>
        <span id="PrivacyPolicyLink" onClick={() => showPrivacyPolicy(true)}>Privacy Policy</span>
      </div>
      <div className="InvisiBox" style={{ flex: 1 }} />

    </div>
  )
}

export default Signup;

