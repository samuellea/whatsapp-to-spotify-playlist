import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';
import './styles/Privacy.css';


function Privacy() {
  const history = useHistory();

  return (
    <div className="Privacy">
      <PrivacyPolicy showPrivacyPolicy={() => history.push('/')} privacyBottomButtonText="Home" />
    </div>
  )
};

export default Privacy;
