import './styles/Landing.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Landing() {
  const history = useHistory();

  const handleGoToLogin = () => {
    history.push('/login');
  };

  return (
    <div className="Landing">
      <h1>Home</h1>
      <button type="button" onClick={handleGoToLogin}>Start</button>
    </div>
  )
};

export default Landing;
