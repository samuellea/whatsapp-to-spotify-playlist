import React, { useState, useEffect } from 'react';
import style from './styles/PrivacyPolicy.css';

function PrivacyPolicy({ showPrivacyPolicy }) {
  return (
    <div className="PrivacyPolicyContainer">
      <div className="PrivacyPolicy Flex Column">
        <span>Privacy Policy</span>
        <h3>Use of Spotify account</h3>
        <p>This web app creates playlists in your Spotify account and adds tracks only to these created playlists. <br /><br /> It cannot change any other aspect of your Spotify collection, nor does it collect or store any of the personal data associated with your Spotify user account. <br /><br /> By linking your Spotify account with our app, you grant permission for the app to create playlists and add tracks to these playlists.</p>
        <h3>Use of Google account</h3>
        <p>By using the Google Drive functionality in this app, you agree to let the app read the contents only of any file(s) you provide a URL link to. The app cannot read, edit, create or delete any other files in your Google Drive, nor does it retain any of the personal data associated with your Google account.</p>
        <h3>Use of chat text</h3>
        <p>By sharing any pasted chat text or chats stored as .txt files in Google Drive, you give permission for this web app to scrape only the stated URL hyperlinks from the chat necessary to compile playlists. <br /><br />Handling and parsing of chat text is done entirely client-side in the user's browser, and only the found URL hyperlinks necessary for compiling playlists are stored on our server. <br /><br />No other portion of the shared text is retained by the app, barring </p>
        <ul><li>any URL hyperlinks to external media present in the shared text</li><li>the time and date these were posted</li><li>the name of the person who posted them, as that name appears in the shared text</li></ul>
        <button type="button" onClick={() => showPrivacyPolicy(false)}>Close</button>
      </div>
    </div>
  )
};

export default PrivacyPolicy;
