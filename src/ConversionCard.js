import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faArrowsRotate, faAsterisk, faBan, faCaretDown, faCircleStop, faClose, faRotateLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import './styles/ConversionCard.css';

function ConversionCard({
  conversion,
  index,
  handleUndoMatchChanges,
  handleChangeMatch,
  handleExcludeMatch,
  handleIncludeMatch,
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

  const youtubeSegmentContent = (index) => {
    const { thumbnail, title } = youtubePost;
    return (
      <div className="SegmentWrapper YoutubeSegmentWrapper">
        <div className="YoutubeSegment">

          <div className="YoutubeThumbContainer Flex">
            <img className="YoutubeThumbnail" src={thumbnail} alt="Youtube Thumbnail" />
          </div>

          <div className="YoutubeInfoContainer Flex">
            <span className="CurtailText Curtail2">{title}</span>
          </div>

        </div>
        <a href={`https://youtu.be/${youtubePost.youtubeID}`} target="_blank" />
      </div>

    )
  }

  const spotifySegmentContent = (index) => {
    if (!spotifyMatch.spotifyTrackID) {
      return (
        <div className="SegmentWrapper SpotifySegmentWrapper">
          <div className="SpotifyNullSegment Flex Column" onClick={(e) => e.stopPropagation()} key={`matchCard-${index}`}>
            <p>No match found on Spotify - no track will be added to the Spotify playlist for this</p>
          </div>
        </div>
      )
    }

    const { artists, title, thumbnailMed } = spotifyMatch;

    return (
      <div className="SegmentWrapper SpotifySegmentWrapper">

        <div className="SpotifySegment Flex Row">
          <div className="ConversionSpotifyThumbnailContainer Flex Column">
            <img className="ConversionSpotifyThumbnail" src={thumbnailMed} alt="Spotify Thumbnail" />
          </div>

          <div className="ConversionSpotifyInfoContainer Flex Column">
            <div className="SpotifyTitle Flex Column">
              <span className="CurtailText Curtail3">{title} </span>
            </div>

            <div className="SpotifyArtists Flex Column">
              <span className="CurtailText Curtail2">{artists.join(', ')} </span>
            </div>
          </div>
        </div>
        <a href={`https://open.spotify.com/track/${spotifyMatch.spotifyTrackID}`} target="_blank" />
      </div>

    )
  };


  const conversionCard = () => {
    const { include } = spotifyMatch;
    console.log(include)
    const undoEnabled = spotifyMatch.spotifyTrackID !== spotifyMatches[index].spotifyTrackID;
    return (
      <div className="YTC-Wrapper Flex Row">
        <div className="ChangedAsterisk">
          {undoEnabled && include ? <FontAwesomeIcon icon={faAsterisk} pointerEvents="none" /> : null}
        </div>

        <div className={`YTC-ButtonsMenuContainer Flex Column ButtonsMenuContainer-Include-${include}`}>
          <button className={`CC-Side-Top2-${include}`} onClick={() => handleUndoMatchChanges(index)} disabled={!undoEnabled}> <FontAwesomeIcon icon={faArrowsRotate} pointerEvents="none" /></button>
          <button className={`CC-Side-Top2-${include}`} onClick={() => handleChangeMatch(spotifyMatch, index)} disabled={!include}><FontAwesomeIcon icon={faSearch} pointerEvents="none" /></button>
          <button className={`CC-Side-Exclude-${include}`} onClick={() => include ? handleExcludeMatch(index) : handleIncludeMatch(index)}>
            {include ?
              <FontAwesomeIcon icon={faClose} pointerEvents="none" /> :
              <FontAwesomeIcon icon={faRotateLeft} pointerEvents="none" />
            }
          </button>
        </div>

        <div className={`YoutubeConversionCard Flex Column`}>

          {!spotifyMatch.include ?
            <div className="ConversionExcludeWrapper">
              <div className="ConversionExcludeTint" />
              <div className="ConversionExcludeCrossIcon">
                <FontAwesomeIcon icon={faBan} pointerEvents="none" />
              </div>
            </div>
            : null}
          {youtubeSegmentContent(index)}
          {spotifySegmentContent(index)}
        </div>
      </div >
    )
  };

  return (
    conversionCard()
  )


};

export default ConversionCard;

