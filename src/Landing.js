import './styles/Landing.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import logo from './chatchoons-icon-512.png'
import LandingSVG1 from './landingSVGs/LandingSVG1';
import LandingSVG2 from './landingSVGs/LandingSVG2';
import LandingSVG3 from './landingSVGs/LandingSVG3';
import LandingSVG4 from './landingSVGs/LandingSVG4';
import LandingSVG5 from './landingSVGs/LandingSVG5';
import SpotifyLogo from './SpotifyLogo';

function Landing({ showPrivacyPolicy }) {
  const history = useHistory();

  const handleGoToLogin = () => {
    history.push('/login');
  };

  return (
    <div className="Landing">

      <div className="LandingHeaders">
        <a className="LandingPageLink" href="http://localhost:3000/">
          <img src={logo} />
          <h1 className="Raleway-SemiBold">Chatchoons</h1>
          <h2 className="Raleway-ExtraLight">Make and maintain playlists of the songs shared in your WhatsApp chats</h2>
        </a>


        <button type="button" onClick={handleGoToLogin}>Start</button>
      </div>

      <div className="LandingGradientBlock"></div>

      <div className="LandingInfoArea">

        <LandingSVG1 fill="white" height="150" />

        <span>Have group chats with your friends <br /> for sharing music together?</span>
        <span>Easily compile Spotify playlists <br /> from them using Chatchoons</span>


        <LandingSVG2 fill="white" height="150" />
        <span>Chatchoons is a tool that lets you <br /> turn exported WhatsApp chats into <br /> Spotify playlists,
          without the effort</span>
        <span>Simply paste an exported chat text file, <br /> or provide a URL for a text file <br /> in your Google Drive - </span>
        <span>Chatchoons finds all the <br /> Spotify tracks and YouTube videos <br /> you and your friends have shared!</span>


        <LandingSVG4 fill="white" height="150" />
        <span>You can decide which tracks make the cut before the playlist is compiled.</span>
        <span>Once your playlist is done, <br /> it's ready to share with your friends - <br /> listening back to all your shared songs <br /> just got a whole lot easier.</span>
        <span>No more tedious hours spent <br /> sifting through old messages, <br /> compiling your playlist by hand.</span>


        <LandingSVG5 fill="white" height="150" />
        <span>See insights into the songs you and your friends share - who's sharing the most, how often people are sharing, and which genres are making the group tick...</span>

        <LandingSVG3 fill="white" height="150" />

        <span>To see how Chatchoons uses the data you provide and works with third-party services, please see our <span onClick={() => showPrivacyPolicy(true)} style={{ textDecoration: 'underline', margin: '0' }}>Privacy Policy</span> before using.</span>

        <button type="button" onClick={handleGoToLogin} style={{ marginTop: '75px' }}>Start</button>

      </div>

      <div className="LandingGradientBlock" style={{ transform: "rotate(180deg)", height: '100px' }}></div>

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

    </div>
  )
};

export default Landing;
