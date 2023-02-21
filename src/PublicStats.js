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
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import FontFaceObserver from 'fontfaceobserver';

function PublicStats({
  // userPlaylistMetas, 
  // fetchAndSetFirebasePlaylistMetas, 
}) {

  let { publicStatsId } = useParams();

  const [fontsLoaded, setFontsLoaded] = useState(false)
  useEffect(() => {
    const fontsArr = ['Raleway-Regular', 'Raleway-Bold', 'Raleway-Thin', 'Raleway-SemiBold']
    h.setLoadedFonts(fontsArr, setFontsLoaded)
  }, []);

  const [publicStatsObj, setPublicStatsObj] = useState(null);
  const [publicStatsError, setPublicStatsError] = useState(false);

  const [pageLoading, setPageLoading] = useState(true);
  const [playlistArtworkLoaded, setPlaylistArtworkLoaded] = useState(false);
  const [tallied, setTallied] = useState([]);
  const [overview, setOverview] = useState([]);
  const [byYear, setByYear] = useState([]);
  const [colourMap, setColourMap] = useState([]);
  const [genresTallied, setGenresTallied] = useState({});

  useEffect(() => {
    const getAndSetPublicStatsData = async () => {
      const getPublicStatsResponse = await u.getPublicStats(publicStatsId);
      if ([200, 204].includes(getPublicStatsResponse.status)) {
        const { data } = getPublicStatsResponse;
        console.log(data);
        setPublicStatsObj(data);
      } else {
        setPublicStatsError(true);
      }
    };
    getAndSetPublicStatsData();
  }, [])

  useEffect(() => {
    console.log('🚨')
    if (publicStatsObj) {
      console.log(publicStatsObj)
      const { processedPostsLog } = publicStatsObj.firebasePlaylistObj.obj;

      const { lookup } = publicStatsObj.firebaseMetaObj
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

      console.log('done stuf')
      setPageLoading(false);
    }
  }, [publicStatsObj])


  const history = useHistory();

  // const { processedPostsLog, spotifyPlaylistName } = publicStatsObj.firebasePlaylist.obj;

  const handleGoBack = () => {
    history.push('/');
  };

  return (
    <div className="StatsContainer Flex Column">

      {pageLoading || !playlistArtworkLoaded || !fontsLoaded ?
        <div className="StatsSpinnerContainer Flex Column">
          <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
        </div>
        : null}

      {
        pageLoading ?
          null :
          <div className="Stats" >

            <div className="StatsPadding">

              <div className="StatsGoBackContainer Flex">
                <button className="Flex Row" type="button" onClick={handleGoBack}>
                  <FontAwesomeIcon id="GoBack" icon={faArrowLeft} pointerEvents="none" />
                  <span>Back</span>
                </button>
              </div>

              <div className="StatsInfoPod Flex Column" style={{ fontSize: `${((100 / publicStatsObj.firebasePlaylistObj.obj.spotifyPlaylistName.length) * 2000) ** (0.3)}px` }}>
                <img src={publicStatsObj.spotifyPlaylistData.artwork} onLoad={() => setPlaylistArtworkLoaded(true)} className="SpotifyPlaylistArtwork" alt="Spotify Artwork" />
                <h1>{publicStatsObj.firebasePlaylistObj.obj.spotifyPlaylistName}</h1>
                <h2><span>{publicStatsObj.firebasePlaylistObj.obj.processedPostsLog.length}</span> tracks</h2>
                <span>last updated: {h.getLastUpdatedFromMeta(publicStatsObj.firebaseMetaObj)}</span>

              </div>


              <div className="ContributorsContainer">

                <ContributorsSection
                  tallied={tallied}
                  lookupInState={publicStatsObj.firebaseMetaObj.lookup}
                />
              </div>

              <div className="ContributorsSpacer" />

              <div className="OverviewContainer Flex Column">

                <OverviewSection overview={overview} />

              </div>

              <div className="ContributorsSpacer" />

              <div className="ByYearContainer Flex Column">
                {byYear.length ?
                  <ByYearSection byYear={byYear} lookupInState={publicStatsObj.firebaseMetaObj.lookup} colourMap={colourMap} />
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
                  lookup={publicStatsObj.firebaseMetaObj.lookup}
                  playlistMetaInAppState={publicStatsObj.firebaseMetaObj}
                />
              </div>

            </div>
            <SharedNotAddedSection rawPostsLog={publicStatsObj.firebasePlaylistObj.obj.rawPostsLog} lookupInState={publicStatsObj.firebaseMetaObj.lookup} colourMap={colourMap} isPublicStatsPage={true} />
          </ div>
      }
      <Toaster />
    </div >
  );


};

export default PublicStats;