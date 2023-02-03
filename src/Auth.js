import React, { useEffect, useState } from 'react';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import Spinner from './Spinner';
import './styles/Auth.css';

function Auth({ updateLoggedIn, loggedIn }) { // this is our Login page if an existing user

  const [email, setEmail] = useState({});
  const [password, setPassword] = useState({});
  const [loginPending, setLoginPending] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    if (e.target.id === 'email') setEmail(e.target.value)
    if (e.target.id === 'password') setPassword(e.target.value)
  }

  const performLogIn = () => {
    const authData = { email, password, returnSecureToken: true };
    axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_API_KEY}`, authData)
      .then(async ({ data }) => {
        const expirationDate = new Date(new Date().getTime() + (1800000)) // auto logout in 30 mins (ms)
        localStorage.setItem('token', data.idToken);
        localStorage.setItem('firebaseUserId', data.localId);
        localStorage.setItem('expirationDate', expirationDate);
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

  let spotifyToken = window.localStorage.getItem('spotifyToken');
  if (loggedIn && !spotifyToken) {
    return <Redirect to='/spotifylogin' />
  };

  return (
    <div className="Auth">
      {!loginPending ?
        <form onSubmit={(event) => event.preventDefault()}>
          <div><input className="emailInput" type="text" id="email" onChange={(event) => handleChange(event)}></input></div>
          <div className="passwordInput"><input type="password" id="password" onChange={(event) => handleChange(event)}></input></div>
          <div className="submitButtonContainer"><button className="authSubmitButton" onClick={handleClick}>Login</button></div>
          {error ? <h3 style={{ color: "red" }}>{error}</h3> : null}
          <Link to="/signup">No account? Sign up here</Link>
        </form>
        : <Spinner spinnerType="big" />
      }
    </div>
  )

}

export default Auth;

