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
import { Redirect, useHistory } from 'react-router-dom';
import ByYearSection from './ByYearSection';
import ByGenreSection from './ByGenreSection';
import ByPosterSection from './ByPosterSection';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import SharedNotAddedSection from './SharedNotAddedSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import FontFaceObserver from 'fontfaceobserver';

function Stats({ userPlaylistMetas, fetchAndSetFirebasePlaylistMetas, userPlaylistsLoading, appToast }) {


  const [fontsLoaded, setFontsLoaded] = useState(false)
  useEffect(() => {
    const fontsArr = ['Raleway-Regular', 'Raleway-Bold', 'Raleway-Thin', 'Raleway-SemiBold']
    h.setLoadedFonts(fontsArr, setFontsLoaded)
  }, []);

  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const spotifyPlaylistId = params.get('spotifyPlaylistId');
  const firebaseMetaId = params.get('firebaseMetaId');

  const token = localStorage.getItem('token');
  const spotifyToken = localStorage.getItem('spotifyToken');

  const playlistMetaInAppState = userPlaylistMetas.find(e => e.metaId === firebaseMetaId);

  const [playlistArtworkLoaded, setPlaylistArtworkLoaded] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [firebasePlaylist, setFirebasePlaylist] = useState({ id: null, obj: {} });
  const [spotifyPlaylistData, setSpotifyPlaylistData] = useState(null);
  const [tallied, setTallied] = useState([]);
  const [overview, setOverview] = useState([]);
  const [byYear, setByYear] = useState([]);
  const [lookupInState, setLookupInState] = useState(playlistMetaInAppState.lookup || {});
  const [colourMap, setColourMap] = useState([]);
  const [genresTallied, setGenresTallied] = useState({});
  const [sharingLink, setSharingLink] = useState(null);

  const fakes = [
    // { poster: 'Sam', time: { year: '2022', month: '12' } },
    // { poster: 'Ben Belward', time: { year: '2022', month: '11' } },
    // { poster: 'Ben Belward', time: { year: '2022', month: '10' } },
    // { poster: 'Matt', time: { year: '2021', month: '08' } },
    // { poster: 'Matt', time: { year: '2021', month: '08' } },
    // { poster: 'Matt', time: { year: '2021', month: '08' } },
    // { poster: 'Matt', time: { year: '2021', month: '08' } },
    // { poster: 'Matt', time: { year: '2021', month: '08' } },
    // { poster: 'Matt', time: { year: '2021', month: '08' } },
    // { poster: 'Matt', time: { year: '2021', month: '08' } },
    // { poster: 'Matt', time: { year: '2021', month: '08' } },
    // { poster: 'Matt', time: { year: '2021', month: '08' } },
    // { poster: 'Matt', time: { year: '2021', month: '08' } },
    // { poster: 'Johnny Ratcliffe', time: { year: '2021', month: '01' } },
  ];

  // When stats loads, get FB playlist data, spotify playlist artwork and trigger fetch of metas
  useEffect(() => {
    setPageLoading(true);
    u.getFirebasePlaylist(spotifyPlaylistId, token).then((firebasePlaylistRes) => {
      u.getSpotifyPlaylist(spotifyPlaylistId, spotifyToken).then(async (spotifyRes) => {
        setSpotifyPlaylistData({ ...spotifyPlaylistData, artwork: spotifyRes.data.images[0].url })
        const { data } = firebasePlaylistRes;
        const firebasePlaylistId = Object.entries(data)[0][0];
        const firebasePlaylistObj = Object.entries(data)[0][1];
        setFirebasePlaylist({ id: firebasePlaylistId, obj: firebasePlaylistObj });

        // create colourmap
        const { processedPostsLog } = firebasePlaylistObj;
        const processedPostsPlusFakes = [...processedPostsLog, ...fakes];
        // console.log('');
        // console.log('');
        // console.log('');
        // console.log('');
        // console.log(processedPostsPlusFakes);

        const originalPosters = h.listAllPosters(processedPostsLog, lookupInState);
        const originalPostersColourMap = h.createColourMap(originalPosters);
        setColourMap(originalPostersColourMap);

        const playlistMetaInAppState = userPlaylistMetas.find(e => e.metaId === firebaseMetaId);
        // console.log(playlistMetaInAppState, ' <--- playlistMetaInAppState ! ! ! !! !')
        const lookupOnFB = playlistMetaInAppState?.lookup || {};
        // console.log(lookupOnFB)
        await fetchAndSetFirebasePlaylistMetas();

        h.groupPostsByYear(processedPostsLog, lookupInState);
        // setPageLoading(false);
        // what
      });
    }).catch(e => console.log(e));
  }, []);

  // When metas update, set .lookup in state, tally / re-tally contributors
  useEffect(() => {
    // console.log(firebasePlaylist.id, ' 🚨')
    // console.log(playlistMetaInAppState, ' <-- playlistMetaInAppState')

    if (firebasePlaylist.id !== null && playlistMetaInAppState) {
      // setPageLoading(true)
      // console.log('Got All We Need! 🚨 🚨 🚨🚨 🚨 🚨')
      const { processedPostsLog } = firebasePlaylist.obj;
      const playlistMetaInAppState = userPlaylistMetas.find(e => e.metaId === firebaseMetaId);
      const lookupOnFB = playlistMetaInAppState?.lookup || {};
      setLookupInState('lookup' in playlistMetaInAppState ? lookupOnFB : {});

      const processedPostsPlusFakes = [...processedPostsLog, ...fakes];

      // console.log(processedPostsLog)

      // 🚨 🚨 🚨 ---> processedPostsPlusFakes should be processedPostsLog!
      const contributions = h.tallyContributions(processedPostsLog, lookupInState);
      setTallied(contributions);

      // console.log(contributions);

      const postsGroupedByYear = h.groupPostsByYear(processedPostsLog);
      setOverview(postsGroupedByYear);

      const postsByYear = h.groupPostsByPosterYearAndMonth(processedPostsLog, lookupInState)
      setByYear(postsByYear);

      const genresTalliedObj = h.tallyGenres(processedPostsLog, lookupInState);
      setGenresTallied(genresTalliedObj);
      // setPageLoading(false);
      // 🚨 🚨 🚨 ---> processedPostsPlusFakes should be processedPostsLog!
      // console.log(lookupInState);
      // console.log(firebasePlaylist.obj.rawPostsLog)
      setPageLoading(false);
      // setPageLoading(false);
      // setPageLoading(false);
    }
  }, [userPlaylistMetas]);

  // If lookupInState changes to be different from the FB .lookup, post this updated lookup
  // and trigger refetch of metas
  useEffect(() => {
    const postLookupThenRefetchMetas = async () => {
      const updateLookupResponse = await u.updatePlaylistMetaLookup(lookupInState, firebaseMetaId, token);
      if ([200, 204].includes(updateLookupResponse.status)) {
        const fetchAndSetFirebasePlaylistMetasFinished = await fetchAndSetFirebasePlaylistMetas();
        if (fetchAndSetFirebasePlaylistMetasFinished) {
          // setPageLoading(false)
        };
      };
    };

    const playlistMetaInAppState = userPlaylistMetas.find(e => e.metaId === firebaseMetaId);
    const lookupOnFB = playlistMetaInAppState?.lookup || {};
    if (!_.isEqual(lookupOnFB, lookupInState)) {
      setPageLoading(true);
      console.log('🌳')
      console.log(lookupInState);
      // console.log(lookupOnFB);
      // console.log(lookupInState);
      // console.log('----------')
      // setPageLoading(true);
      // console.log('LOOKUPINSTATE DIFFERENT FROM LOOKUP ON FB!');
      postLookupThenRefetchMetas();
    } else {
      // setPageLoading(false)
    }
  }, [lookupInState]);

  const { processedPostsLog, spotifyPlaylistName } = firebasePlaylist.obj;

  const handleGoBack = () => {
    history.push('/');
  };

  const handleExportStats = async () => {
    const exportSuccessResponse = await u.exportStatsPage(firebasePlaylist, playlistMetaInAppState, spotifyPlaylistData, token);
    console.log(exportSuccessResponse)
    const { status } = exportSuccessResponse;
    if (![200, 201].includes(status)) {
      appToast('Sharing failed. Please try again later', { duration: 1500 });
    }
    const { name } = exportSuccessResponse.data;
    const sharingUrl = `http://localhost:3000/publicStats/${name}`;
    console.log(sharingUrl);
    setSharingLink(sharingUrl);
  }

  return (
    <div className="StatsContainer Flex Column">

      {pageLoading || !firebasePlaylist.id || !userPlaylistMetas.length || !playlistArtworkLoaded || !fontsLoaded ?
        <div className="StatsSpinnerContainer Flex Column">
          <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
        </div>
        : null}

      {
        pageLoading || !firebasePlaylist.id || !userPlaylistMetas.length ?
          null :
          <div className="Stats" >

            <div className="StatsPadding">

              <div className="StatsGoBackContainer Flex">
                <button className="Flex Row" type="button" onClick={handleGoBack}>
                  <FontAwesomeIcon id="GoBack" icon={faArrowLeft} pointerEvents="none" />
                  <span>Back</span>
                </button>
              </div>

              <div className="StatsInfoPod Flex Column" style={{ fontSize: `${((100 / spotifyPlaylistName.length) * 2000) ** (0.3)}px` }}>
                <img src={spotifyPlaylistData.artwork} onLoad={() => setPlaylistArtworkLoaded(true)} className="SpotifyPlaylistArtwork" alt="Spotify Artwork" />
                <h1>{spotifyPlaylistName}</h1>
                <h2><span>{processedPostsLog.length}</span> tracks</h2>
                <span>last updated: {h.getLastUpdatedFromMeta(playlistMetaInAppState)}</span>
              </div>


              <div className="ContributorsContainer">

                <ContributorsSection
                  tallied={tallied}
                  lookupInState={lookupInState}
                  setLookupInState={setLookupInState}
                />
              </div>

              <div className="ContributorsSpacer" />

              <div className="OverviewContainer Flex Column">

                <OverviewSection overview={overview} />

              </div>

              <div className="ContributorsSpacer" />

              <div className="ByYearContainer Flex Column">
                {byYear.length ?
                  <ByYearSection byYear={byYear} lookupInState={lookupInState} colourMap={colourMap} />
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
                  posts={firebasePlaylist.obj.processedPostsLog}
                  lookup={lookupInState}
                  playlistMetaInAppState={userPlaylistMetas.find(e => e.metaId === firebaseMetaId)}
                />
              </div>

            </div>
            <SharedNotAddedSection rawPostsLog={firebasePlaylist.obj.rawPostsLog} lookupInState={lookupInState} colourMap={colourMap} handleExportStats={handleExportStats} sharingLink={sharingLink} appToast={appToast} />
          </ div>
      }
      <Toaster />
    </div >
  );


};

export default Stats;



