import './styles/ChangeModal.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import Spinner from './Spinner';
import { mockSleep } from './helpers';
import * as h from './helpers';
import Oval from 'react-loading-icons/dist/esm/components/oval';

function ChangeModal({ matchToChange, handleCancelChange, handleCorrectASpotifyResult }) {
  const spotifyToken = localStorage.getItem('spotifyToken');

  const [validTrackID, setValidTrackID] = useState('');
  const [inputBarError, setInputBarError] = useState(false);
  const [inputBarErrorMsg, setInputBarErrorMsg] = useState('* Must be a valid Spotify track URL');
  const [spotifyObj, setSpotifyObj] = useState({
    ...matchToChange,
    artists: [], title: '', thumbnail: '', spotifyTrackID: '', artistIDs: [],
  })
  const [searchLoading, setSearchLoading] = useState(false);
  const [replaceSuccess, setReplaceSuccess] = useState(false);

  useEffect(() => {
    setSpotifyObj(matchToChange)
    // trigger a call to FB /playlists endpoint for this playlist obj - but where to store? Here, in update? Or up in home? Or even App?
  }, [matchToChange]);

  const handleInputBarChange = (e) => {
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
  };

  const handleInputBarSearch = async () => {
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
        spotifyTrackData.thumbnail = data.album.images[1].url;
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
  };

  const handleCancel = () => {
    handleCancelChange()
  };

  const handleSubmit = async () => {
    let r = window.confirm(`Sure you want to replace using this track?`);
    if (r == true) {
      setReplaceSuccess(true);
      await mockSleep(1500);
      handleCorrectASpotifyResult(spotifyObj);
    }
  };

  const trackIsUnchanged = () => {
    if (!_.isEqual(spotifyObj, matchToChange)) return false;
    return true;
  }

  const disableSearchButton = () => {
    if (!validTrackID.length) return true;
    if (inputBarError) return true;
    return false;
  }

  const { artists, title, thumbnail, spotifyTrackID } = spotifyObj;

  const replaceSuccessMessage = () => {
    return (
      <div className="ReplaceSuccessMessage Flex Column">
        <div className="GreenCircle">
          <span><i class="fa fa-check"></i></span>
        </div>
        <span>Successfully replaced</span>
      </div>
    )
  }

  const trackInfo = () => {
    return (
      <div className="TrackInfo Flex Column">
        {/* <div className="ChangeModalInfoContainer Flex Column"> */}

        <div className="TrackArtContainer">
          <img className="SpotifyArtwork" src={thumbnail} alt="Spotify Thumbnail" />
        </div>

        <div className="TitleArtistsContainer Flex Column">
          <div className="TitleContainer CurtailText Curtail3">
            {title}
          </div>
          <div className="ArtistsContainer TitleContainer CurtailText Curtail3">
            {artists.join(', ')}
          </div>

          {/* </div> */}

        </div>


        <div className="ChangeModalControlsContainer">

          <input className={`InputBarError-${inputBarError}`} type="text" placeholder="Paste a link to a Spotify track" onChange={(event) => handleInputBarChange(event)} />

          <div className="ErrorAndSearchContainer Flex Row">
            <div className="ErrorContainer Flex">
              <span className={`InputErrorMsg-${inputBarError}`}>{inputBarErrorMsg}</span>
            </div>
            <button type="button" onClick={handleInputBarSearch} disabled={disableSearchButton()}><i id="Search" className="fas fa-search" /></button>
          </div>

          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={trackIsUnchanged()}>Replace</button>

        </div>



        {/* <div className="TrackArtContainer">
          <img className="SpotifyArtwork" src={thumbnail} alt="Spotify Thumbnail" />
        </div>

        <div className="TitleArtistsContainer">
          <div className="TitleContainer">
            {title}
          </div>
          <div className="ArtistsContainer">
            {artists.join(', ')}
          </div>
        </div>

        <div className="InputContainer">

          <div className="InputAndErrorContainer">
            <div className="InputBarAndButtonContainer">
              <div className="InputBarContainer">
                <input className={`InputBarError-${inputBarError}`} type="text" placeholder="Paste a link to a Spotify track" onChange={(event) => handleInputBarChange(event)} />
              </div>
              <div className="SearchButtonContainer">
                <button type="button" onClick={handleInputBarSearch} disabled={disableSearchButton()}><i id="Search" className="fas fa-search" /></button>
              </div>
            </div>
            <div className="InputErrorMessageContainer">
              <span className={`InputErrorMsg-${inputBarError}`}>{inputBarErrorMsg}</span>
            </div>
          </div>

        </div>

        <div className="Buttons">
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={trackIsUnchanged()}>Replace</button>
        </div> */}

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
