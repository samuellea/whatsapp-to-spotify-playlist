import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faArrowsRotate, faBan, faCaretDown, faCircleStop, faClose, faRotateLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
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
    // return null;
  }

  const youtubeSegmentContent = (index) => {
    const { thumbnail, title } = youtubePost;
    return (
      <div className="YoutubeSegment">

        <div className="YoutubeThumbContainer Flex" onClick={() => handleConversionCardClick(index)}>
          <img className="YoutubeThumbnail" src={thumbnail} alt="Youtube Thumbnail" />
        </div>

        <div className="YoutubeInfoContainer Flex" onClick={() => handleConversionCardClick(index)}>
          <span className="CurtailText Curtail2">{title}</span>

        </div>
        <a href={`https://youtu.be/${youtubePost.youtubeID}`} target="_blank">
          <FontAwesomeIcon icon={faArrowRightFromBracket} pointerEvents="none" />
        </a>

      </div>

    )
  }

  const spotifySegmentContent = (index) => {
    if (!spotifyMatch.spotifyTrackID) {
      return (
        <div className="SpotifyNullSegment" onClick={(e) => e.stopPropagation()} key={`matchCard-${index}`}>
          <p>Spotify match not found</p>
        </div>
      )
    }

    const { artists, title, thumbnailSmall, thumbnailMed } = spotifyMatch;

    return (
      <div className="SpotifySegment Flex">
        <img className="ConversionSpotifyThumbnail" src={thumbnailMed} alt="Spotify Thumbnail" />

        <div className="ConversionSpotifyInfoContainer Flex Column" onClick={() => handleConversionCardClick(index)}>
          <div className="SpotifyTitle Flex Column">
            <span className="CurtailText Curtail3">{title}</span>
          </div>

          <div className="SpotifyArtists Flex Column" onClick={() => handleConversionCardClick(index)}>
            <span className="CurtailText Curtail3">{artists.join(', ')}</span>
          </div>

        </div>
        <a href={`https://open.spotify.com/track/${spotifyMatch.spotifyTrackID}`} target="_blank">
          <FontAwesomeIcon icon={faArrowRightFromBracket} pointerEvents="none" />
        </a>
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
    <div className="YoutubeConversionCard YTCC-Inspected Flex Column">
      {matchInspectedMenu()}
    </div>
  );

  const conversionCardNotInspectedState = () => (
    <div className={`YoutubeConversionCard Flex Column ${!spotifyMatch.include ? 'YTCC-Excluded' : null}`}>
      {!spotifyMatch.include ?
        <div className="ConversionExcludeWrapper" onClick={() => handleConversionCardClick(index)}>
          <div className="ConversionExcludeTint" />
          <div className="ConversionExcludeCrossIcon">
            <FontAwesomeIcon icon={faBan} pointerEvents="none" />
          </div>
        </div>
        : null}
      {youtubeSegmentContent(index)}
      <FontAwesomeIcon id="caretDown" icon={faCaretDown} pointerEvents="none" />
      {spotifySegmentContent(index)}

    </div>
  );

  return (
    matchInspected === index
      ? conversionCardInspectedState()
      : conversionCardNotInspectedState()
  )


};

export default ConversionCard;

