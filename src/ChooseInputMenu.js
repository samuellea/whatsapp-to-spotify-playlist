

import React, { useState, useEffect } from 'react';
import './styles/ChooseInputMenu.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaste, faLink, faClock } from '@fortawesome/free-solid-svg-icons';

function ChooseInputMenu({ setScreen, handleTextAreaClear }) {

  const [timeWarningClicked, setTimeWarningClicked] = useState(false);

  useEffect(() => {
    handleTextAreaClear();
  }, []);

  return (
    <div className="ChooseInputMenu Flex Column">
      {/* {timeWarningClicked ? <> */}
      <div className="ChooseInputMenuText Flex Column">
        <span>How do you want to input your WhatsApp chat?</span>
      </div>
      <button type="button" id="ChooseInputMenuGoogleButton" onClick={() => setScreen('google')}>
        Google Drive File
        <FontAwesomeIcon id="ChooseInputMenuButtonIcon" icon={faLink} pointerEvents="none" />
      </button>
      <button type="button" onClick={() => setScreen('input')}>
        Paste Text
        <FontAwesomeIcon id="ChooseInputMenuButtonIcon" icon={faPaste} pointerEvents="none" />
      </button>

      {/* </> : <>
          <FontAwesomeIcon icon={faClock} pointerEvents="none" id="TimeConfirmIcon" />
          <span id="ChooseTimeWarning">⚠️ Ensure your device clock is set to <span id="HelpLiBold">24 hour</span> format (eg. 13:00) <span id="TimeWarningUnderline">not</span> 12 hour (eg. 1:00pm)</span>
          <button type="button" id="ChooseTimeWarningButton" onClick={() => setTimeWarningClicked(true)}>
            Confirm
          </button>
        </>
      } */}

    </div >
  )
};

export default ChooseInputMenu;
