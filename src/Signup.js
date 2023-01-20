import React, { useState } from 'react';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
// import { apiKey } from './firebaseConfig';
import Spinner from './Spinner';
import './styles/Signup.css';

function Signup({ updateLoggedIn, loggedIn }) { // this is our Login page if an existing user


  const [email, setEmail] = useState({});
  const [password, setPassword] = useState({});
  const [signupPending, setSignupPending] = useState(false)
  const [error, setError] = useState(null);

  const handleChange = e => {
    if (e.target.id === 'email') setEmail(e.target.value)
    if (e.target.id === 'password') setPassword(e.target.value)
  }

  const performSignup = () => {
    // need to do some form validation for this at some point!!!
    console.log('performSignup')
    const signupData = { email, password, returnSecureToken: true };
    console.log(signupData);
    axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`, signupData)
      .then(({ data }) => {
        console.log(data, ' <--- data in .then of Auth')
        const expirationDate = new Date(new Date().getTime() + (data.expiresIn * 1000))
        localStorage.setItem('token', data.idToken);
        localStorage.setItem('expirationDate', expirationDate);
        setSignupPending(false);
        updateLoggedIn(data);
      })
      .catch(err => {
        console.log(err);
        setSignupPending(false);
        setError(err.toString())
      })
  };

  const handleClick = () => {
    console.log('handleClick')
    setSignupPending(true);
    setError(null);
    performSignup();
  };

  if (loggedIn) {
    return <Redirect to='/spotifylogin' />
  }

  return (
    <div className="Signup">
      {!signupPending ?
        <form onSubmit={(event) => event.preventDefault()}>
          <div><input className="emailInput" type="text" id="email" onChange={(event) => handleChange(event)}></input></div>
          <div className="passwordInput"><input type="password" id="password" onChange={(event) => handleChange(event)}></input></div>
          <div className="submitButtonContainer"><button className="authSubmitButton" onClick={handleClick}>Create Account</button></div>
          {error ? <h3 style={{ color: "red" }}>{error}</h3> : null}
          <Link to="/login">Already have an account? Login here</Link>
        </form>
        : <Spinner spinnerType="big" />
      }
    </div>
  )
}

export default Signup;

