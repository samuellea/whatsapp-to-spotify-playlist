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
  const [posterAliasesInState, setPosterAliasesInState] = useState([]);
  const [contributors, setContributors] = useState([]);

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
        setPosterAliasesInState(metaObj.posterAliases || [])
        // setPosterAliasesInState([{ main: 'Sam', aliases: ['Sam', 'Sam (Work)'] }]);
      });
    });
  }, []);

  const { processedPostsLog, spotifyPlaylistName } = firebasePlaylist.obj;

  useEffect(() => {
    if (firebasePlaylist.id !== null) {
      // create contributors tally object
      const contributorsTally = processedPostsLog.reduce((acc, e) => {
        if (!acc.some(obj => obj.poster === e.poster)) acc.push({ poster: e.poster, totalPosts: 0 });
        const indexOfPoster = acc.findIndex(obj => obj.poster === e.poster);
        acc[indexOfPoster].totalPosts++;
        return acc;
      }, []).sort((a, b) => (a.totalPosts < b.totalPosts) ? 1 : -1);
      // then, account for aliases stored on the meta obj
      const contributorsTallyAccountingForAliases = h.accountForAliases(contributorsTally, posterAliasesInState);
      setContributors(contributorsTallyAccountingForAliases);
      setLoading(false);
    }
  }, [posterAliasesInState])



  /*
  1) contributorsTally
  {poster: 'Sam', totalPosts: 5},
  {poster: 'Ben Belward', totalPosts: 2},
  {poster: 'Sam (Work)', totalPosts: 1},
  {poster: 'Johnny Ratcliffe', totalPosts: 1},

  2) contributorsGroupedByAlias

fb.playlists/:id/.posterAliases

  {
    aliases: [
      {
        main: 'Sam', // this is the one the user SELECTS (not types)
        // - after selecting multiple and clicking 'Group', radio buttons appear
        // with values = the selected names,
        // 'which SINGLE NAME should these posts be grouped under'? - clicking
        // this sets the value of this alias obj's .main key
        // NB!!! need to ensure, after selecting a saving,
        // one can't then go and click group again and group a name 
        // that's already been group with ANOTHER name that wasn't in that
        // ORIGINAL group! - i guess just check if that name exists 
        // in any '.aliases' arrays in any objects in posterAliases
        aliases: ['Sam', 'Sam (Work)'],
      } 
    ],
}

  */

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
              <ContributorsSection contributors={contributors} posterAliasesInState={posterAliasesInState} setPosterAliasesInState={setPosterAliasesInState} />
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



