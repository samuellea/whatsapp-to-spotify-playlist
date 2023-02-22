

import React, { useState, useEffect } from 'react';
import './styles/ChooseInputMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste, faLink } from '@fortawesome/free-solid-svg-icons';

function ChooseInputMenu({ setScreen, handleTextAreaClear }) {

  useEffect(() => {
    handleTextAreaClear();
  }, []);

  return (
    <div className="ChooseInputMenu Flex Column">

      <div className="ChooseInputMenuText Flex Column">
        <span>How do you want to input your WhatsApp chat?</span>
      </div>
      <button type="button" onClick={() => setScreen('input')}>
        Paste Text
        <FontAwesomeIcon id="ChooseInputMenuButtonIcon" icon={faPaste} pointerEvents="none" />
      </button>
      <button type="button" id="ChooseInputMenuGoogleButton" onClick={() => setScreen('google')}>
        Google Drive File
        <FontAwesomeIcon id="ChooseInputMenuButtonIcon" icon={faLink} pointerEvents="none" />
      </button>
    </div>
  )
};

export default ChooseInputMenu;
