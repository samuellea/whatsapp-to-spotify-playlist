import './styles/Help.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faArrowsRotate, faSearch, faClose, faRotateLeft, faTrashAlt, faChartColumn } from "@fortawesome/free-solid-svg-icons";

function Help({ location, setShowHelp }) {
  const content = {
    'home': (
      <div className="HelpHomeContent Flex Column">
        <ul>
          <li>Tap <span id="HelpLiBold">Create</span> to make a new, empty playlist in your Spotify account</li>
          <li>Tap the <FontAwesomeIcon icon={faAdd} pointerEvents="none" /> icon on a playlist to update it with the latest chat export from your WhatsApp chat</li>
          <li>Tap <FontAwesomeIcon icon={faTrashAlt} pointerEvents="none" /> to delete</li>
          <li>Tap <FontAwesomeIcon icon={faChartColumn} pointerEvents="none" /> to view playlist stats</li>
        </ul>
      </div>
    ),
    'choose': (
      <div className="HelpChooseContent Flex Column">
        <ul>
          <li>If your WhatsApp chat is very active (many messages almost every day), pick <span id="HelpLiBold">Google Drive File</span></li>
          <li>If your WhatsApp is fairly or not very active (several messages a week or less), pick <span id="HelpLiBold">Paste Text</span></li>
        </ul>
        <span>If you have any issues copying and pasting text, try the Google Drive method instead</span>
      </div>
    ),
    'input': (
      <div className="HelpInputContent Flex Column">
        <ol>
          <li>Go to your WhatsApp chat and tap the <span id="HelpLiBold">3 dots ⋮</span> {'>'} <span id="HelpLiBold">More</span> {'>'} <span id="HelpLiBold">Export chat</span>  {'>'} <span id="HelpLiBold">Without media</span> </li>
          <li>When the app menu appears at the bottom of your screen, select your preferred Email app (Gmail, Outlook etc.) and send <span style={{ fontWeight: 900, textDecoration: 'underline' }}>to your own</span> email address</li>
          <li>In your email app, find the email containing the WhatsApp chat export  <span id="HelpLiBold">.txt</span> file - open it, highlight some of the text, tap  <span id="HelpLiBold">Select All</span>{'>'}  <span id="HelpLiBold">Copy</span></li>
          <li>Paste the text into the box on this page</li>
        </ol>
      </div >
    ),
    'google': (
      <div className="HelpGoogleContent Flex Column">
        <ol>
          <li>Go to your WhatsApp chat and tap the  <span id="HelpLiBold">3 dots ⋮ </span>
            {'>'}  <span id="HelpLiBold">More</span> {'>'}  <span id="HelpLiBold">Export chat</span> {'>'}  <span id="HelpLiBold">Without media</span></li>
          <li>When the app menu appears at the bottom of your screen, select  <span id="HelpLiBold">Google Drive</span></li>
          <li>Go to your Google Drive and find the  <span id="HelpLiBold">.txt</span> file WhatsApp has exported</li>
          <li>Tap the  <span id="HelpLiBold">3 dots ⋮ </span>on the file {'>'}  <span id="HelpLiBold">Copy Link</span></li>
          <li>Paste the link in the input bar on this page</li>
        </ol>
      </div>
    ),
    'youtube': (
      <div className="HelpYoutubeContent Flex Column">
        <span>Shared YouTube videos in your WhatsApp chat? The app tries to find matching songs on Spotify</span>
        <span>These may not be accurate, or the YouTube video may not match any songs on Spotify</span>
        <span>Carefully review these results and use the buttons to:</span>
        <ul>
          <li><FontAwesomeIcon icon={faSearch} pointerEvents="none" id="SvgMargin" /> Search for the correct song on Spotify</li>
          <li> <FontAwesomeIcon icon={faClose} pointerEvents="none" id="SvgMargin" /> Ignore this YouTube video (the found song won't be added to the playlist)</li>
          <li> <FontAwesomeIcon icon={faRotateLeft} pointerEvents="none" id="SvgMargin" /> Undo ignoring this YouTube video</li>
          <li><FontAwesomeIcon icon={faArrowsRotate} pointerEvents="none" id="SvgMargin" /> Undo any changes you made to the Spotify song</li>
        </ul>
        <span>When you are happy, tap <span id="HelpLiBold">Confirm</span></span>
      </div>
    ),
  }
  return (
    <div className="Help Flex Column">
      <div className="HelpTextDisplay Flex Column">
        {content[location]}
        <button type="button" onClick={() => setShowHelp(false)}>Close</button>
      </div>
      <div className="HelpBackdrop" />
    </div>
  )
};

export default Help;
