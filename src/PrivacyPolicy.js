import React, { useState, useEffect } from 'react';
import style from './styles/PrivacyPolicy.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

function PrivacyPolicy({ showPrivacyPolicy, privacyBottomButtonText = 'Close' }) {
  return (
    <div className="PrivacyPolicyContainer">
      <div className="PrivacyPolicy Flex Column">
        <span>Privacy Policy</span>
        <p style={{ textAlign: 'center', border: '1px solid white', margin: '10px 10px 20px 10px', }}>By using this web app, you confirm you have read and accept the terms of the privacy policy as stated below -</p>
        <h3>Use of Spotify account</h3>
        <p>This web app creates playlists in your Spotify account and adds tracks only to these created playlists. <br /><br /> It cannot change any other aspect of your Spotify collection, nor does it collect or store any of the personal data associated with your Spotify user account. <br /><br /> By linking your Spotify account with our app, you grant permission for the app to create playlists and add tracks to these playlists.</p>
        <h3>Use of Google account</h3>
        <p>By using the Google Drive functionality in this app, you agree to grant the app
          *read-only* access to your Google Drive and its files. This is necessary to allow the app to read the chat text file you have saved to Google Drive. <br /><br />The app cannot delete, create or edit files in your Google Drive, nor does it retain any of the personal data associated with your Google account, or share it with any third party.
          <br /><br />
          Signing out of the app clears and removes all credentials supplied by Google for accessing Google Drive files. You can also remove access by visting <a href="https://myaccount.google.com/permissions" style={{ color: 'white', fontWeight: 900 }} target="_blank">Account Settings</a> in your Google account (under 'Third-party apps with account access') </p>
        <h3>Use of chat text</h3>
        <p>By sharing any pasted chat text or chats stored as .txt files in Google Drive, you give permission for this web app to scrape only the stated URL hyperlinks from the chat necessary to compile playlists. <br /><br />Handling and parsing of chat text is done entirely browser-side on your device, and only the found URL hyperlinks necessary for compiling playlists are stored on our server. <br /><br />No other portion of the shared text is retained by the app, except for </p>
        <ul><li>any URL hyperlinks to songs or videos in the shared text</li><li>the time and date these were sent as messages</li><li>the name of the person who sent them as a message, as that name appears on the message in the shared text</li></ul>
        <h3>Closing your app account</h3>
        <p>
          Should you wish to close your account and remove any stored data from the app, this can be done at any time. Once logged in, tap the <FontAwesomeIcon icon={faCog} pointerEvents="none" style={{ margin: '0px 5px' }} /> icon at the top of the screen and then <span style={{
            fontFamily: "Raleway-Bold",
            fontWeight: 900,
            textDecoration: 'none',
            fontSize: '13px',
          }}>Delete My Account</span> to permanently delete both your user account and all related data stored in our database.
        </p>
        <button type="button" onClick={() => showPrivacyPolicy(false)}>{privacyBottomButtonText}</button>
      </div>
    </div>
  )
};

export default PrivacyPolicy;
