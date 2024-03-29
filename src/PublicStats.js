import React, { useState, useEffect, useRef } from 'react';
import Spinner from './Spinner';
import axios from 'axios';
import * as h from './helpers';
import * as u from './utils';
import './styles/Stats.css';
import ContributorsSection from './ContributorsSection';
import OverviewSection from './OverviewSection';
import usePrevious from './customHooks/usePrevious';
import _ from 'lodash';
import toast, { Toaster } from 'react-hot-toast';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import ByYearSection from './ByYearSection';
import ByGenreSection from './ByGenreSection';
import ByPosterSection from './ByPosterSection';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import SharedNotAddedSection from './SharedNotAddedSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheckCircle, faStar, faMusic } from '@fortawesome/free-solid-svg-icons';
import FontFaceObserver from 'fontfaceobserver';
import SpotifyIconWhitePNG from './Spotify_Icon_RGB_White.png';
import SpotifyIconBlackPNG from './Spotify_Icon_RGB_Black.png';
import MusicSlash from './MusicSlash';

function PublicStats({ authLink, handleLogout }) {
  const history = useHistory();

  let { publicStatsId } = useParams();
  const token = localStorage.getItem('token');
  const spotifyToken = localStorage.getItem('spotifyToken');
  if (!token && publicStatsId !== 'undefined') localStorage.setItem('publicStatsHashNonAuth', publicStatsId)
  if (publicStatsId === 'undefined') {
    localStorage.removeItem(publicStatsId);
    history.push('/')
  };

  const [fontsLoaded, setFontsLoaded] = useState(false)
  useEffect(() => {
    const fontsArr = ['Raleway-Regular', 'Raleway-Bold', 'Raleway-Thin', 'Raleway-SemiBold']
    h.setLoadedFonts(fontsArr, setFontsLoaded)
  }, []);

  const [publicStatsObj, setPublicStatsObj] = useState(null);
  const [publicStatsError, setPublicStatsError] = useState(false);
  const [spotifyLoggedInBanner, setSpotifyLoggedInBanner] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);
  const [playlistArtworkLoaded, setPlaylistArtworkLoaded] = useState(false);
  const [tallied, setTallied] = useState([]);
  const [overview, setOverview] = useState([]);
  const [byYear, setByYear] = useState([]);
  const [colourMap, setColourMap] = useState([]);
  const [genresTallied, setGenresTallied] = useState({});

  useEffect(() => {
    console.log('!')
    const spotifyToken = window.localStorage.getItem('spotifyToken');
    const spotifyUserId = window.localStorage.getItem('spotifyUserId');
    if (spotifyToken && !spotifyUserId) {
      // console.log('BINGO')
      // We are a public user (not a registered, logged-in user with FB auth) who has logged into Spotify for making a playlist in ByPosters
      setSpotifyLoggedInBanner(true);
    }

    const getAndSetPublicStatsData = async () => {
      const getPublicStatsResponse = await u.getPublicStats(publicStatsId);
      if ([200, 204].includes(getPublicStatsResponse.status)) {
        const { data } = getPublicStatsResponse;
        if (!data) {
          setPublicStatsError(true)
          setPageLoading(false);
          return;
        };
        console.log('B')
        // console.log(data);
        setPublicStatsObj(data);
        setPageLoading(false);
      } else {
        setPublicStatsError(true);
        setPageLoading(false);
      }
    };
    getAndSetPublicStatsData();
  }, [])

  useEffect(() => {
    if (publicStatsObj) {
      const { processedPostsLog } = publicStatsObj.firebasePlaylistObj.obj;

      const lookup = publicStatsObj.firebaseMetaObj.lookup ? publicStatsObj.firebaseMetaObj.lookup : {};
      const contributions = h.tallyContributions(processedPostsLog, lookup);
      setTallied(contributions);

      const postsGroupedByYear = h.groupPostsByYear(processedPostsLog);
      setOverview(postsGroupedByYear);

      const postsByYear = h.groupPostsByPosterYearAndMonth(processedPostsLog, lookup)
      setByYear(postsByYear);

      const genresTalliedObj = h.tallyGenres(processedPostsLog, lookup);
      setGenresTallied(genresTalliedObj);

      const originalPosters = h.listAllPosters(processedPostsLog, lookup);
      const originalPostersColourMap = h.createColourMap(originalPosters);
      setColourMap(originalPostersColourMap);

      setPageLoading(false);
    }
  }, [publicStatsObj])


  // const history = useHistory();

  // const { processedPostsLog, spotifyPlaylistName } = publicStatsObj.firebasePlaylist.obj;

  const handleGoBack = () => {
    history.push('/home');
  };

  const handlePublicRegisterLogin = () => {
    handleLogout();
    history.push('/login');
  };

  const handleHome = () => {
    const token = localStorage.getItem('token');
    if (!token) return handlePublicRegisterLogin();
    return history.push('/home');
  };

  return (
    <div className="StatsContainer Flex Column">

      {publicStatsError ?
        <div className="PublicStatsError Flex Column">
          <MusicSlash />
          <h3>404</h3>
          <span>We couldn't find that...</span>
          <button type="button" onClick={handleHome}>Home</button>
        </div>
        :
        !pageLoading ?
          <div className="Stats">
            {spotifyLoggedInBanner ?
              <div className="SpotifyLoggedInBanner">
                Logged in Spotify
                <FontAwesomeIcon icon={faCheckCircle} pointerEvents="none" />
              </div>
              : null}
            <div className="StatsPadding">

              {token ? <div className="StatsGoBackContainer Flex">
                <button className="Flex Row" type="button" onClick={handleGoBack}>
                  <FontAwesomeIcon id="GoBack" icon={faArrowLeft} pointerEvents="none" />
                  <span>Back</span>
                </button>
              </div> : null}

              {!token ?
                <div className="PublicRegisterLoginContainer Flex Column" style={{
                  backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.289), transparent)',
                  // backgroundColor: 'transparent !important',
                  borderRadius: '15px 15px 0px 0px',
                }}>
                  <span>Turn your WhatsApp chats into Spotify playlists - sign up and try it out </span>
                  <button className="PublicRegisterLoginButton" type="button" onClick={handlePublicRegisterLogin}>Register / Login</button>
                </div>
                : null}

              <div className="StatsInfoPod Flex Column" style={{ fontSize: `${((100 / publicStatsObj.firebasePlaylistObj.obj.spotifyPlaylistName.length) * 2000) ** (0.3)}px` }}>
                <img src={publicStatsObj.spotifyPlaylistData.artwork} onLoad={() => setPlaylistArtworkLoaded(true)} className="SpotifyPlaylistArtwork" alt="Spotify Artwork" />
                <h1>{publicStatsObj.firebasePlaylistObj.obj.spotifyPlaylistName}</h1>
                <h2><span>{publicStatsObj.firebasePlaylistObj.obj.processedPostsLog.length}</span> tracks</h2>
                <span>last updated: {h.getLastUpdatedFromMeta(publicStatsObj.firebaseMetaObj)}</span>
                <a className="StatsInfoPodOpenButton Flex" href={`https://open.spotify.com/playlist/${publicStatsObj.firebaseMetaObj.spotifyPlaylistId}`} target="_blank">
                  <img id="SpotifyIconWhite" src={SpotifyIconWhitePNG} />
                  Open in Spotify</a>
              </div>


              <div className="ContributorsContainer">

                <ContributorsSection
                  tallied={tallied}
                  lookupInState={publicStatsObj.firebaseMetaObj.lookup || {}}
                />
              </div>

              <div className="ContributorsSpacer" />

              <div className="OverviewContainer Flex Column">

                <OverviewSection overview={overview} />

              </div>

              <div className="ContributorsSpacer" />

              <div className="ByYearContainer Flex Column">
                {byYear.length ?
                  <ByYearSection byYear={byYear} lookupInState={publicStatsObj.firebaseMetaObj.lookup || {}} colourMap={colourMap} />
                  : <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />}
              </div>

              <div className="ContributorsSpacer" />

              <div className="ByGenreContainer Flex Column">
                {JSON.stringify(genresTallied) !== '{}' ?
                  <ByGenreSection genresTallied={genresTallied} />
                  : null
                }
              </div>

              <div className="ContributorsSpacer" />

              <div className="ByPosterContainer Flex Column">
                <ByPosterSection
                  posters={tallied.map(e => e.poster).sort()}
                  posts={publicStatsObj.firebasePlaylistObj.obj.processedPostsLog}
                  lookup={publicStatsObj.firebaseMetaObj.lookup || {}}
                  playlistMetaInAppState={publicStatsObj.firebaseMetaObj}
                  isPublicStatsPage={true}
                  authLink={authLink}
                />
              </div>

            </div>
            <SharedNotAddedSection rawPostsLog={publicStatsObj.firebasePlaylistObj.obj.rawPostsLog} lookupInState={publicStatsObj.firebaseMetaObj.lookup || {}} colourMap={colourMap} isPublicStatsPage={true} token={token} />

            {!token ?
              <div className="PublicRegisterLoginContainer Flex Column" style={{ backgroundColor: '#4A4964' }}>
                <span>Turn your WhatsApp chats into Spotify playlists - sign up and try it out </span>
                <button className="PublicRegisterLoginButton" type="button" onClick={handlePublicRegisterLogin}>Register / Login</button>
              </div>
              : null}
            <div className="CopyrightFooter" style={{ borderRadius: '0px 0px 15px 15px', margin: '5% 0%' }}>
              <span> © Sam Lea 2023</span>
              <span>|</span>
              <span>Email the dev <a href="mailto:samuel.edward.lea@gmail.com">here</a></span>
            </div>
          </ div>
          : null
      }

      {pageLoading || !fontsLoaded ?
        <div className="StatsSpinnerContainer Flex Column">
          <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
        </div>
        : null}
      <Toaster />
    </div >
  );


};

export default PublicStats;