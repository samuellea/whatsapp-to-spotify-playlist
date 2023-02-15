import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faBan, faCaretDown, faCircleStop, faClose, faRotateLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import './styles/ConversionCard.css';

function ConversionCard({
  conversion,
  index,
  handleCancelInspect,
  handleUndoMatchChanges,
  handleChangeMatch,
  handleExcludeMatch,
  handleConversionCardClick,
  handleIncludeMatch,
  matchInspected,
  spotifyMatches,
}) {

  const youtubePost = conversion[0];
  const spotifyMatch = conversion[1];

  if (youtubePost === null) {
    return (
      <div className="NullCard Flex Column">
        <span>Youtube video not found</span>
      </div>
    )
  }

  const youtubeSegmentContent = () => {
    const { thumbnail, title } = youtubePost;
    return (
      <div className="YoutubeSegment">

        <div className="YoutubeThumbContainer Flex">
          <img className="YoutubeThumbnail" src={thumbnail} alt="Youtube Thumbnail" />
        </div>

        <div className="YoutubeInfoContainer Flex">
          <span className="CurtailText Curtail2">{title}</span>
        </div>
      </div>

    )
  }

  const spotifySegmentContent = () => {
    if (!spotifyMatch.spotifyTrackID) {
      return (
        <div className="SpotifyNullSegment" onClick={(e) => e.stopPropagation()} key={`matchCard-${index}`}>
          <p>Spotify match not found</p>
        </div>
      )
    }

    const { artists, title, thumbnail } = spotifyMatch;

    return (
      <div className="SpotifySegment Flex">
        <img className="ConversionSpotifyThumbnail" src={thumbnail} alt="Spotify Thumbnail" />
        <div className="ConversionSpotifyInfoContainer Flex Column">
          <div className="SpotifyTitle Flex Column">
            <span className="CurtailText Curtail2">{title}</span>
          </div>

          <div className="SpotifyArtists Flex Column">
            <span className="CurtailText Curtail2">{artists.join(', ')}</span>
          </div>
        </div>
      </div>
    )
  };

  const matchInspectedMenu = () => {
    console.log('matchInspectedMenu!')
    console.log(`matchInspected: ${matchInspected}`)
    console.log('------')
    const { include } = spotifyMatch;
    const undoEnabled = spotifyMatch.spotifyTrackID !== spotifyMatches[index].spotifyTrackID;
    const matchInspectedMenuContent = () => {
      if (matchInspected === index && include) {
        // menu options when post is set to be included .include = true
        return (
          <div className="MatchInspectedMenuInclude Flex Column">
            <button type="button" onClick={() => handleCancelInspect()}>Cancel</button>
            <button type="button" onClick={() => handleUndoMatchChanges(index)} disabled={!undoEnabled} >Undo Change
              <FontAwesomeIcon icon={faArrowsRotate} pointerEvents="none" />
            </button>
            <button type="button" onClick={() => handleChangeMatch(spotifyMatch, index)}>Change
              <FontAwesomeIcon icon={faSearch} pointerEvents="none" />
            </button>
            <button type="button" onClick={() => handleExcludeMatch(index)}>Exclude
              <FontAwesomeIcon icon={faClose} pointerEvents="none" />
            </button>
          </div>
        )
      }
      if (matchInspected === index && !include) {
        // menu options when post is set to be excluded .include = false
        return (
          <div className="MatchInspectedMenuInclude Flex Column">
            <button type="button" id="ReIncludeButton" onClick={() => handleIncludeMatch(index)}>
              Include
              <FontAwesomeIcon icon={faRotateLeft} pointerEvents="none" />
            </button>
          </div>

        )
      }
    };
    return (
      <div className="MatchInspectedMenu">
        {matchInspectedMenuContent()}
      </div>
    )
  };

  const conversionCardInspectedState = () => (
    <div className="YoutubeConversionCard Flex Column">
      {matchInspectedMenu()}
    </div>
  );

  const conversionCardNotInspectedState = () => (
    <div className="YoutubeConversionCard Flex Column" onClick={() => handleConversionCardClick(index)}>
      {!spotifyMatch.include ?
        <div className="ConversionExcludeWrapper">
          <div className="ConversionExcludeTint" />
          <div className="ConversionExcludeCrossIcon">
            <FontAwesomeIcon icon={faBan} pointerEvents="none" />
          </div>
        </div>
        : null}
      {youtubeSegmentContent()}
      <FontAwesomeIcon id="caretDown" icon={faCaretDown} pointerEvents="none" />
      {spotifySegmentContent()}

    </div>
  );

  return (
    matchInspected === index
      ? conversionCardInspectedState()
      : conversionCardNotInspectedState()
  )


};

export default ConversionCard;

