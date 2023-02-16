import React, { useState, useEffect } from 'react';
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

function Stats({ userPlaylistMetas, fetchAndSetFirebasePlaylistMetas, userPlaylistsLoading }) {

  // function Stats({ userPlaylistMetas, fetchAndSetFirebasePlaylistMetas }) {
  // const userPlaylistsLoading = true;

  const history = useHistory();
  const params = new URLSearchParams(window.location.search);
  const spotifyPlaylistId = params.get('spotifyPlaylistId');
  const firebaseMetaId = params.get('firebaseMetaId');

  const token = localStorage.getItem('token');
  const spotifyToken = localStorage.getItem('spotifyToken');

  const [pageLoading, setPageLoading] = useState(true);
  // const pageLoading = true;
  // const setPageLoading = () => console.log('bing')

  const [firebasePlaylist, setFirebasePlaylist] = useState({ id: null, obj: {} });
  const [spotifyArtwork, setSpotifyArtwork] = useState(null);
  const [tallied, setTallied] = useState([]);
  const [overview, setOverview] = useState([]);
  const [byYear, setByYear] = useState([]);
  const [lookupInState, setLookupInState] = useState({});
  const [colourMap, setColourMap] = useState([]);
  const [genresTallied, setGenresTallied] = useState({});

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

  // When metas update, set .lookup in state, tally / re-tally contributors
  useEffect(() => {
    console.log(firebasePlaylist.id, ' 🚨')
    console.log(playlistMetaInAppState, ' <-- playlistMetaInAppState')

    if (firebasePlaylist.id !== null && playlistMetaInAppState) {
      setPageLoading(true);
      console.log('Got All We Need! 🚨 🚨 🚨🚨 🚨 🚨')
      const { processedPostsLog } = firebasePlaylist.obj;
      const playlistMetaInAppState = userPlaylistMetas.find(e => e.metaId === firebaseMetaId);
      const lookupOnFB = playlistMetaInAppState?.lookup || {};
      setLookupInState('lookup' in playlistMetaInAppState ? lookupOnFB : {});

      const processedPostsPlusFakes = [...processedPostsLog, ...fakes];

      console.log(processedPostsLog)

      // 🚨 🚨 🚨 ---> processedPostsPlusFakes should be processedPostsLog!
      const contributions = h.tallyContributions(processedPostsPlusFakes, lookupInState);
      setTallied(contributions);

      console.log(contributions);

      const postsGroupedByYear = h.groupPostsByYear(processedPostsPlusFakes);
      setOverview(postsGroupedByYear);

      const postsByYear = h.groupPostsByPosterYearAndMonth(processedPostsPlusFakes, lookupInState)
      setByYear(postsByYear);

      const genresTalliedObj = h.tallyGenres(processedPostsPlusFakes, lookupInState);
      setGenresTallied(genresTalliedObj);
      setPageLoading(false);
      // 🚨 🚨 🚨 ---> processedPostsPlusFakes should be processedPostsLog!
    }
  }, [userPlaylistMetas]);

  // When stats loads, get FB playlist data, spotify playlist artwork and trigger fetch of metas
  useEffect(() => {
    setPageLoading(true);
    u.getFirebasePlaylist(spotifyPlaylistId, token).then((firebasePlaylistRes) => {
      u.getSpotifyPlaylist(spotifyPlaylistId, spotifyToken).then(async (spotifyRes) => {
        setSpotifyArtwork(spotifyRes.data.images[0].url)
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

        const originalPosters = h.listAllPosters(processedPostsPlusFakes, lookupInState);
        const originalPostersColourMap = h.createColourMap(originalPosters);
        setColourMap(originalPostersColourMap);

        const playlistMetaInAppState = userPlaylistMetas.find(e => e.metaId === firebaseMetaId);
        console.log(playlistMetaInAppState, ' <--- playlistMetaInAppState ! ! ! !! !')
        const lookupOnFB = playlistMetaInAppState?.lookup || {};
        console.log(lookupOnFB)
        await fetchAndSetFirebasePlaylistMetas();

        h.groupPostsByYear(processedPostsLog, lookupInState);
        setPageLoading(false);
        // what
      });
    }).catch(e => console.log(e));
  }, []);

  // If lookupInState changes to be different from the FB .lookup, post this updated lookup
  // and trigger refetch of metas
  useEffect(() => {
    const postLookupThenRefetchMetas = async () => {
      const updateLookupResponse = await u.updatePlaylistMetaLookup(lookupInState, firebaseMetaId, token);
      if ([200, 204].includes(updateLookupResponse.status)) {
        await fetchAndSetFirebasePlaylistMetas();
        // setPageLoading(false)
      };
    };

    const playlistMetaInAppState = userPlaylistMetas.find(e => e.metaId === firebaseMetaId);
    const lookupOnFB = playlistMetaInAppState?.lookup || {};
    if (!_.isEqual(lookupOnFB, lookupInState)) {
      // setPageLoading(true);
      // console.log('LOOKUPINSTATE DIFFERENT FROM LOOKUP ON FB!');
      postLookupThenRefetchMetas();
    } else {
      // setPageLoading(false)
    }
  }, [lookupInState]);


  const playlistMetaInAppState = userPlaylistMetas.find(e => e.metaId === firebaseMetaId);
  const lookupOnFB = playlistMetaInAppState?.lookup || {};

  const { processedPostsLog, spotifyPlaylistName } = firebasePlaylist.obj;

  return (
    <div className="StatsContainer Flex Column">
      {
        !pageLoading ?
          <div className="Stats">

            <div className="StatsInfoPod Flex Column">
              <img src={spotifyArtwork} className="SpotifyPlaylistArtwork" alt="Spotify Artwork" />
              <h1>{spotifyPlaylistName}</h1>
              <h2><span>{processedPostsLog.length}</span> tracks</h2>
              <span>last updated</span>
            </div>


            <div className="ContributorsContainer">
              {!userPlaylistsLoading ?
                <ContributorsSection
                  tallied={tallied}
                  lookupInState={lookupInState}
                  setLookupInState={setLookupInState}
                />
                : <Spinner />}
            </div>

            <div className="ContributorsSpacer" />

            <div className="OverviewContainer Flex Column">
              {!userPlaylistsLoading ?
                <OverviewSection overview={overview} />
                : <Spinner />}
            </div>

            <div className="ContributorsSpacer" />

            <div className="ByYearContainer Flex Column">
              {byYear.length ?
                <ByYearSection byYear={byYear} lookupInState={lookupInState} colourMap={colourMap} />
                : <Spinner />}
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


          </ div>
          : <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
      }
      <Toaster />
    </div >
  );


};

export default Stats;



