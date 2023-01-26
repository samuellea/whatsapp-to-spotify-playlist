import './styles/YoutubeConversionInterface.css';
import React, { useState, useEffect } from 'react';
import ChangeModal from './ChangeModal';

function YoutubeConversionInterface({ convertYoutubePosts, handleConvertedPosts }) {

  const { youtubePosts, spotifyMatches } = convertYoutubePosts;

  const [changeModal, setChangeModal] = useState({ show: false, matchToChange: {}, index: null });
  const [spotifyMatchesAfterReview, setSpotifyMatchesAfterReview] = useState([]);
  const [matchInspected, setMatchInspected] = useState(null);

  useEffect(() => {
    if (spotifyMatches.length) {
      setSpotifyMatchesAfterReview(spotifyMatches);
    }
  }, [spotifyMatches]);

  const handleSpotifyMatchClick = (index) => {
    setMatchInspected(index);
  };

  const handleCancelInspect = () => setMatchInspected(null);

  const handleChangeMatch = (spotifyMatch, index) => {
    setChangeModal({ show: true, matchToChange: spotifyMatch, index: index });
  };

  const handleUndoMatchChanges = (index) => {
    let r = window.confirm(`Undo changes made to this match?`);
    if (r == true) {
      const updatedSpotifyMatches = [...spotifyMatchesAfterReview];
      const originalSpotifyMatch = spotifyMatches[index];
      originalSpotifyMatch.include = true;
      updatedSpotifyMatches[index] = originalSpotifyMatch;
      setSpotifyMatchesAfterReview(updatedSpotifyMatches);
      handleCancelInspect();
    }
  };

  const handleExcludeMatch = (index) => {
    const updatedSpotifyMatches = [...spotifyMatchesAfterReview];
    const spotifyMatchToExclude = updatedSpotifyMatches[index];
    const excludedSpotifyMatch = { ...spotifyMatchToExclude, include: false };
    updatedSpotifyMatches[index] = excludedSpotifyMatch;
    setSpotifyMatchesAfterReview(updatedSpotifyMatches);
    handleCancelInspect();
  };

  const handleIncludeMatch = (index) => {
    const updatedSpotifyMatches = [...spotifyMatchesAfterReview];
    const spotifyMatchToInclude = updatedSpotifyMatches[index];
    const includedSpotifyMatch = { ...spotifyMatchToInclude, include: true };
    updatedSpotifyMatches[index] = includedSpotifyMatch;
    setSpotifyMatchesAfterReview(updatedSpotifyMatches);
    handleCancelInspect();
  };

  const handleCancelChange = () => {
    setChangeModal({ show: false, matchToChange: {}, index: null });
    handleCancelInspect();
  }

  const handleCorrectASpotifyResult = (newSpotifyObj) => {
    const updatedSpotifyMatches = [...spotifyMatchesAfterReview];
    updatedSpotifyMatches[changeModal.index] = newSpotifyObj;
    setChangeModal({ show: false, matchToChange: {}, index: null });
    setSpotifyMatchesAfterReview(updatedSpotifyMatches);
    handleCancelInspect();
  };

  const handleConfirmConversions = () => {
    setMatchInspected(null);
    let r = window.confirm(`Convert these Youtube videos to Spotify tracks?`);
    if (r == true) {
      handleConvertedPosts(spotifyMatchesAfterReview);
    }
  };

  return (
    <div className="YoutubeConversionInterface">
      <h4>Youtube Conversion Screen</h4>
      {changeModal.show ?
        <div className="ChangeModalContainer">
          <ChangeModal matchToChange={changeModal.matchToChange} handleCancelChange={handleCancelChange} handleCorrectASpotifyResult={handleCorrectASpotifyResult} />
        </div>
        : null}
      <div className="YoutubeConversionColumnsContainer">
        <div className="YoutubeColumn">
          {youtubePosts.map(youtubePost => {
            if (!youtubePost) {
              return (
                <div className="NullPost">
                  <p>Youtube video not found</p>
                </div>
              )
            } else {
              const { thumbnail, title } = youtubePost;
              return (
                <div className="YoutubePost">
                  <div className="YoutubeThumbContainer">
                    <img className="YoutubeThumbnail" src={thumbnail} alt="Youtube Thumbnail" />
                  </div>
                  <div className="YoutubeInfoContainer">
                    <span className="CurtailText Curtail2">{title}</span>
                  </div>
                </div>
              )
            }
          })}
        </div>
        <div className="DividerColumn">
          {youtubePosts.map(e => <div className="DividerIcon">⮕</div>)}
        </div>
        <div className="SpotifyColumn">
          {spotifyMatchesAfterReview.map((spotifyMatch, index) => {
            if (!spotifyMatch.spotifyTrackID) {
              return (
                <div className="NullPost" onClick={(e) => e.stopPropagation()} key={`matchCard-${index}`}>
                  <p>Spotify match not found</p>
                </div>
              )
            } else {
              const { include, artist, title, thumbnail } = spotifyMatch;
              const undoEnabled = spotifyMatch.spotifyTrackID !== spotifyMatches[index].spotifyTrackID;
              if (matchInspected === index && include) {
                return (
                  <div className={`SpotifyMatchInspected Include-${include}`} key={`matchCard-${index}`}>
                    <button type="button" onClick={handleCancelInspect}>Cancel</button>
                    <button type="button" onClick={() => handleChangeMatch(spotifyMatch, index)}>Change</button>
                    <button type="button" onClick={() => handleUndoMatchChanges(index)} disabled={!undoEnabled} >Undo</button>
                    <button type="button" onClick={() => handleExcludeMatch(index)}>Exclude</button>
                  </div>
                )
              } else if (matchInspected === index && !include) {
                return (
                  <div className={`SpotifyMatchInspected Include-${include}`} key={`matchCard-${index}`}>
                    <button type="button" onClick={() => handleIncludeMatch(index)}>Include</button>
                  </div>
                )
              } else {
                return (
                  <div className={`SpotifyMatch Include-${include}`} onClick={() => handleSpotifyMatchClick(index)} key={`matchCard-${index}`}>

                    <div className="SpotifyThumbContainer">
                      <img className="SpotifyThumbnail" src={thumbnail} alt="Spotify Thumbnail" />
                    </div>

                    <div className="SpotifyInfoContainer">
                      <div className="SpotifyTitle">
                        <span className="CurtailText Curtail1">{title}</span>
                      </div>

                      <div className="SpotifyArtists">
                        <span className="CurtailText Curtail1">{artist}</span>
                      </div>
                    </div>

                  </div>
                )
              }
            }
          })}
        </div>
      </div>
      <button type="button" onClick={handleConfirmConversions}>Confirm</button>
    </div>
  )
};

export default YoutubeConversionInterface;
