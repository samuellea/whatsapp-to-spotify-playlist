import './styles/ChangeModal.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Spinner from './Spinner';
import { mockSleep } from './helpers';
import * as h from './helpers';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import GreenCircleRedCross from './GreenCircleRedCross';
import Preview from './Preview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCircleStop } from '@fortawesome/free-solid-svg-icons';

function ChangeModal({ matchToChange, handleCancelChange, handleCorrectASpotifyResult }) {
  console.log(matchToChange)
  const spotifyToken = localStorage.getItem('spotifyToken');

  const [validTrackID, setValidTrackID] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [inputBarError, setInputBarError] = useState(false);
  const [inputBarErrorMsg, setInputBarErrorMsg] = useState('* Must be a valid Spotify track URL');
  const [spotifyObj, setSpotifyObj] = useState({
    ...matchToChange,
    artists: [], title: '', thumbnailSmall: '', thumbnailMed: '', spotifyTrackID: '', artistIDs: [],
  })
  const [searchLoading, setSearchLoading] = useState(false);
  const [replaceSuccess, setReplaceSuccess] = useState(false);
  const [changeMode, setChangeMode] = useState('search'); // 'paste'
  const [searchResults, setSearchResults] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [indexPlaying, setIndexPlaying] = useState(null);

  useEffect(() => {
    setSpotifyObj(matchToChange)
    // trigger a call to FB /playlists endpoint for this playlist obj - but where to store? Here, in update? Or up in home? Or even App?
  }, [matchToChange]);

  useEffect(() => {
    setValidTrackID('');
    setSearchInput('');
    setInputBarError(false);
    document.getElementById('ChangeModalInput').value = ''
  }, [changeMode]);

  useEffect(() => {
    if (indexPlaying !== selectedResult) setIndexPlaying(null);
  }, [selectedResult]);


  const inputBarChangeHandlers = {
    paste: (e) => {
      const inputString = e.target.value;
      setInputBarErrorMsg('* Must be a valid Spotify track URL');

      if (inputString.length) {
        setInputBarError(false);
        // const spotifyTrackIDRegex = /(?<=https:\/\/open.spotify.com\/track\/)(.*)/g;
        // const spotifyLink = inputString.match(spotifyTrackIDRegex);

        const spotifyLink = inputString.match(h.spotifyTrackIDRegex());

        if (spotifyLink) {
          const spotifyLinkNoFlags = spotifyLink[0].split('?')[0];
          setValidTrackID(spotifyLinkNoFlags);
        } else {
          setInputBarError(true);
        }
      } else {
        setValidTrackID('');
        setInputBarError(false);
      };
    },
    search: (e) => {
      const inputString = e.target.value;
      if (inputString.length) setInputBarError(false);
      setSearchInput(inputString);
    },
  }

  // const handleInputBarChange = (e) => {
  //   const inputString = e.target.value;
  //   setInputBarErrorMsg('* Must be a valid Spotify track URL');

  //   if (inputString.length) {
  //     setInputBarError(false);
  //     // const spotifyTrackIDRegex = /(?<=https:\/\/open.spotify.com\/track\/)(.*)/g;
  //     // const spotifyLink = inputString.match(spotifyTrackIDRegex);

  //     const spotifyLink = inputString.match(h.spotifyTrackIDRegex());

  //     if (spotifyLink) {
  //       const spotifyLinkNoFlags = spotifyLink[0].split('?')[0];
  //       setValidTrackID(spotifyLinkNoFlags);
  //     } else {
  //       setInputBarError(true);
  //     }
  //   } else {
  //     setValidTrackID('');
  //     setInputBarError(false);
  //   };
  // };

  const inputBarSearchFuncs = {
    paste: async () => {
      setSearchLoading(true);
      await axios.get(`https://api.spotify.com/v1/tracks/${validTrackID}`, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`
        }
      }).then(({ status, data }) => {
        setSearchLoading(false);
        if (status === 200) {
          const spotifyTrackData = { ...matchToChange };
          spotifyTrackData.artists = data.artists.map(artist => artist.name);
          spotifyTrackData.title = data.name;
          spotifyTrackData.thumbnailSmall = data.album.images[2].url;
          spotifyTrackData.thumbnailMed = data.album.images[1].url;
          spotifyTrackData.spotifyTrackID = data.id;
          spotifyTrackData.artistIDs = data.artists.map(artist => artist.id);
          spotifyTrackData.previewURL = data.preview_url;
          setSpotifyObj(spotifyTrackData);
        } else {
          setInputBarErrorMsg('Error retrieving Spotify track');
        }
      }).catch(err => {
        setSearchLoading(false);
        setInputBarErrorMsg('Error retrieving Spotify track');
        setInputBarError(true);
        console.log(err);
      });
    },
    search: async () => {
      setSearchLoading(true);
      await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchInput)}&type=track&market=GB&limit=10`, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`
        }
      }).then((response) => {
        if (response.status === 200) {
          const { data: { tracks: { items } } } = response;
          console.log(items);
          setSearchResults(items); // either an array with length, or empty array
          setSearchLoading(false);
        }
      })
    }
  };

  // const handleInputBarSearch = async () => {
  //   setSearchLoading(true);
  //   await axios.get(`https://api.spotify.com/v1/tracks/${validTrackID}`, {
  //     headers: {
  //       Authorization: `Bearer ${spotifyToken}`
  //     }
  //   }).then(({ status, data }) => {
  //     setSearchLoading(false);
  //     if (status === 200) {
  //       const spotifyTrackData = { ...matchToChange };
  //       spotifyTrackData.artists = data.artists.map(artist => artist.name);
  //       spotifyTrackData.title = data.name;
  //       spotifyTrackData.thumbnailSmall = data.album.images[2].url;
  //       spotifyTrackData.thumbnailMed = data.album.images[1].url;
  //       spotifyTrackData.spotifyTrackID = data.id;
  //       spotifyTrackData.artistIDs = data.artists.map(artist => artist.id);
  //       spotifyTrackData.previewURL = data.preview_url;
  //       setSpotifyObj(spotifyTrackData);
  //     } else {
  //       setInputBarErrorMsg('Error retrieving Spotify track');
  //     }
  //   }).catch(err => {
  //     setSearchLoading(false);
  //     setInputBarErrorMsg('Error retrieving Spotify track');
  //     setInputBarError(true);
  //     console.log(err);
  //   });
  // };

  const handleCancel = () => {
    handleCancelChange()
  };

  const handleSubmit = async () => {
    const confirmMessage = matchToChange.artists && matchToChange.title ? `Replace ${matchToChange.artists.join(',') || 'null'} - ${matchToChange.title} with ${spotifyObj.artists.join(',')} - ${spotifyObj.title}?` : `Add ${spotifyObj.artists.join(',')} - ${spotifyObj.title}?`;
    let r = window.confirm(confirmMessage);
    if (r == true) {
      setReplaceSuccess(true);
      await mockSleep(1000);
      handleCorrectASpotifyResult(spotifyObj);
    }
  };

  const trackIsUnchanged = () => {
    if (!_.isEqual(spotifyObj, matchToChange)) return false;
    return true;
  }

  const disableSearchButton = () => {
    if (changeMode === 'paste') {
      if (!validTrackID.length) return true;
      if (inputBarError) return true;
      return false;
    }
    if (changeMode === 'search') {
      if (!searchInput.length) return true;
      return false;
    }
  }

  const handleCancelSearch = () => {
    setIndexPlaying(null);
    setSelectedResult(null);
    setSearchResults(null);
  };

  const handleSelect = () => {
    const spotifyTrackData = { ...matchToChange };
    const result = searchResults[selectedResult];

    spotifyTrackData.artists = result.artists.map(artist => artist.name);
    spotifyTrackData.title = result.name;
    spotifyTrackData.thumbnailSmall = result.album.images[2].url;
    spotifyTrackData.thumbnailMed = result.album.images[1].url;
    spotifyTrackData.spotifyTrackID = result.id;
    spotifyTrackData.artistIDs = result.artists.map(artist => artist.id);
    spotifyTrackData.previewURL = result.preview_url;
    setSpotifyObj(spotifyTrackData);
    setIndexPlaying(null);
    setSelectedResult(null);
    setSearchResults(null);
  }

  const { artists, title, thumbnailSmall, thumbnailMed, spotifyTrackID } = spotifyObj;

  const replaceSuccessMessage = () => {
    return (
      <div className="ReplaceSuccessMessage Flex Column">
        <div className="ChangeModalGreenCircleContainer Flex">
          <GreenCircleRedCross type="GreenCircle" height={165} />
        </div>
        <span>Successfully replaced</span>
      </div>
    )
  }

  const trackInfo = () => {
    const inputPlaceholder = changeMode === 'search' ? 'Search for a track' : 'Paste a Spotify track URL here';
    const openURL = searchResults?.length && selectedResult ? `https://open.spotify.com/track/${searchResults[selectedResult].id}` : null;

    return (
      <div className="ChangeModalContentContainer">

        {searchResults !== null ?
          <div className="SearchResultsInfo Flex Column">
            {searchResults !== null && searchResults.length
              ?
              <div className="SearchResultsDisplay">
                {searchResults.map((result, i) => {
                  console.log(result)
                  const bgColor = i % 2 === 0 ? 'Odd' : 'Even';
                  const selected = selectedResult === i;
                  return (
                    <div className={`PosterPlaylistCard Flex Row ${bgColor} Selected-${selected}`} style={{ width: '100%' }} onClick={() => { setSelectedResult(i) }}>
                      <img src={result.album.images[2].url || result.album.images[1].url} />
                      <div className="PosterPlaylistCardInfo Flex Column">
                        <span className="CurtailText Curtail2">{result.name}</span>
                        <span className="CurtailText Curtail2">{result.artists.map(e => e.name).join(', ')}</span>
                      </div>


                      <div className="ChangeModalPreviewContainer">
                        <Preview index={i} url={result.preview_url} setIndexPlaying={setIndexPlaying} indexPlaying={indexPlaying} result={result} />
                        <span id="ChangeModalDuration">{h.millisToMinsAndSecs(result.duration_ms)}</span>
                      </div>

                    </div>
                  )
                })}
              </div>
              :
              <div className="NoSearchResultsMessage">
                No results!
              </div>
            }
            <div className="ResultsSelectCancelButtons Flex Row">
              <button type="button" onClick={handleCancelSearch}>Cancel</button>
              <a id="ChangeModelOpen" href={openURL} target="_blank" style={{ opacity: !selectedResult ? 0.5 : 1 }}>Open</a>
            </div>
            <button type="button" id="ChangeModalSelect" onClick={handleSelect} disabled={selectedResult === null}>Select</button>
          </div>
          : null
        }

        <div className="ChangeOptionsContainer Flex Row">
          <button type="button" className={`ChangeMode-${changeMode === 'search'} ChangeSearchButton`} onClick={() => setChangeMode('search')}>Search Spotify</button>
          <button type="button" className={`ChangeMode-${changeMode === 'paste'} ChangePasteButton`} onClick={() => setChangeMode('paste')}>Paste URL</button>
        </div>

        <div className="TrackInfo Flex Column" style={{ opacity: searchResults === null ? 1 : 0 }}>


          <div className="TrackArtContainer">
            {thumbnailMed ?
              <img className="SpotifyArtwork" src={thumbnailMed} alt="Spotify Artwork" />
              : <div className="SpotifyArtworkNull"><FontAwesomeIcon icon={faBan} pointerEvents="none" /></div>

            }
          </div>

          <div className="TitleArtistsContainer Flex Column">
            <div className="TitleContainer CurtailText Curtail3">
              {title || '-'}
            </div>
            <div className="ArtistsContainer TitleContainer CurtailText Curtail3">
              {artists?.join(', ') || '-'}
            </div>
          </div>

          <div className="ChangeModalControlsContainer">

            <input
              id="ChangeModalInput"
              className={`InputBarError-${inputBarError}`}
              type="text"
              placeholder={inputPlaceholder}
              onChange={(event) => inputBarChangeHandlers[changeMode](event)}
            />

            <div className="ErrorAndSearchContainer Flex Row">
              <div className="ErrorContainer Flex">
                <span className={`InputErrorMsg-${inputBarError}`}>{inputBarErrorMsg}</span>
              </div>
              <button type="button" onClick={inputBarSearchFuncs[changeMode]} disabled={disableSearchButton()}>{changeMode === 'search' ? <i id="Search" className="fas fa-search" /> : <i id="Search" className="fas fa-check" />}</button>
            </div>

            <button type="button" onClick={handleCancel}>Cancel</button>
            <button type="button" onClick={handleSubmit} disabled={trackIsUnchanged()} style={{ backgroundColor: trackIsUnchanged() ? '#7316C6' : '#66B06E' }}>{matchToChange.artists && matchToChange.title ? 'Replace' : 'Add'}</button>

          </div>

        </div>
      </div>
    )
  }

  return (
    <div className={`ChangeModal ChangeSearchLoading-${searchLoading} ChangeReplaceSuccess-${replaceSuccess}`}>
      {
        !replaceSuccess ?
          !searchLoading ?
            trackInfo()
            : <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
          : replaceSuccessMessage()
      }

    </div>
  )
};

export default ChangeModal;
