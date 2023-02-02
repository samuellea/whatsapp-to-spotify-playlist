import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';
import * as h from './helpers';
import * as u from './utils';
import './styles/Stats.css';
import ContributorsSection from './ContributorsSection';

function Stats({ userPlaylistMetas }) {
  const params = new URLSearchParams(window.location.search);
  const spotifyPlaylistId = params.get('spotifyPlaylistId');
  const token = localStorage.getItem('token');
  const spotifyToken = localStorage.getItem('spotifyToken');

  const metaObj = userPlaylistMetas.filter(meta => meta.spotifyPlaylistId === spotifyPlaylistId);

  const [loading, setLoading] = useState(true);
  const [firebasePlaylist, setFirebasePlaylist] = useState({ id: null, obj: {} });
  const [spotifyArtwork, setSpotifyArtwork] = useState(null);
  const [lookupInState, setLookupInState] = useState(null);
  const [tallied, setTallied] = useState([]); // 'contributos' has accounted for aliases in the init useEffect

  useEffect(() => {
    // get the firebase playlist object
    u.getFirebasePlaylist(spotifyPlaylistId, token).then((firebaseRes) => {
      // get the spotify playlist artwork
      u.getSpotifyPlaylist(spotifyPlaylistId, spotifyToken).then(async (spotifyRes) => {
        setSpotifyArtwork(spotifyRes.data.images[0].url)
        const { status, data } = firebaseRes;
        const firebasePlaylistId = Object.entries(data)[0][0];
        const firebasePlaylistObj = Object.entries(data)[0][1];
        setFirebasePlaylist({
          id: firebasePlaylistId,
          obj: firebasePlaylistObj,
        });
        setLookupInState(metaObj.lookupInState || {})
      });
    });
  }, []);

  const { processedPostsLog, spotifyPlaylistName } = firebasePlaylist.obj;

  useEffect(() => {
    if (firebasePlaylist.id !== null) {
      const contributions = h.tallyContributions(processedPostsLog, lookupInState);
      console.log(contributions)
      setTallied(contributions);
      setLoading(false);
    }
  }, [lookupInState])

  return (
    <div className="StatsContainer">
      {
        !loading ?
          <div className="Stats">
            <h4>Stats</h4>
            <img src={spotifyArtwork} className="SpotifyPlaylistArtwork" alt="Spotify Artwork" />
            <h1>{spotifyPlaylistName}</h1>
            <h2>{processedPostsLog.length} tracks</h2>

            <div className="ContributorsContainer">
              <ContributorsSection
                tallied={tallied}
                lookupInState={lookupInState}
                setLookupInState={setLookupInState}
              />
            </div>

            <div className="OverviewSection Flex Column">
              <h4 className="SectionHeader">Overview</h4>
            </div>

            <div className="ByYearSection Flex Column">
              <h4 className="SectionHeader">By Year</h4>
            </div>

            <div className="ByGenreSection Flex Column">
              <h4 className="SectionHeader">By Genre</h4>
            </div>

          </ div>
          : <Spinner />
      }
    </div >
  );


};

export default Stats;



