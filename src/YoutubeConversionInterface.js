import './styles/YoutubeConversionInterface.css';
import React, { useState, useEffect } from 'react';
import ChangeModal from './ChangeModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import ConversionCard from './ConversionCard';

function YoutubeConversionInterface({ convertYoutubePosts, handleConvertedPosts }) {

  const { youtubePosts, spotifyMatches } = convertYoutubePosts;

  const [changeModal, setChangeModal] = useState({ show: false, matchToChange: {}, index: null });
  const [spotifyMatchesAfterReview, setSpotifyMatchesAfterReview] = useState(spotifyMatches);

  useEffect(() => {
    if (spotifyMatches.length) {
      setSpotifyMatchesAfterReview(spotifyMatches);
    }
  }, [spotifyMatches]);

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
    }
  };

  const handleExcludeMatch = (index) => {
    const updatedSpotifyMatches = [...spotifyMatchesAfterReview];
    const spotifyMatchToExclude = updatedSpotifyMatches[index];
    console.log(spotifyMatchToExclude, ' 🍕');
    const excludedSpotifyMatch = { ...spotifyMatchToExclude, include: false };
    updatedSpotifyMatches[index] = excludedSpotifyMatch;
    setSpotifyMatchesAfterReview(updatedSpotifyMatches);
  };

  const handleIncludeMatch = (index) => {
    const updatedSpotifyMatches = [...spotifyMatchesAfterReview];
    const spotifyMatchToInclude = updatedSpotifyMatches[index];
    const includedSpotifyMatch = { ...spotifyMatchToInclude, include: true };
    updatedSpotifyMatches[index] = includedSpotifyMatch;
    setSpotifyMatchesAfterReview(updatedSpotifyMatches);
  };

  const handleCancelChange = () => {
    setChangeModal({ show: false, matchToChange: {}, index: null });
  }

  const handleCorrectASpotifyResult = (newSpotifyObj) => {
    const updatedSpotifyMatches = [...spotifyMatchesAfterReview];
    updatedSpotifyMatches[changeModal.index] = newSpotifyObj;
    setChangeModal({ show: false, matchToChange: {}, index: null });
    setSpotifyMatchesAfterReview(updatedSpotifyMatches);
  };

  const handleConfirmConversions = () => {
    let r = window.confirm(`Convert these Youtube videos to Spotify tracks?`);
    console.log(spotifyMatchesAfterReview)
    if (r == true) {
      const onlySpotifyMatchesWhereIncludeIsTrue = spotifyMatchesAfterReview.filter(e => e.include)
      const matchesMinusIncludeKey = onlySpotifyMatchesWhereIncludeIsTrue.map(obj => {
        const { include, ...objMinusIncludeKey } = obj;
        return objMinusIncludeKey
      });
      handleConvertedPosts(matchesMinusIncludeKey);
    }
  };

  const youtubeConversions = youtubePosts.map((youtubePost, i) => {
    return [youtubePost, spotifyMatchesAfterReview[i]]
  });
  console.log(youtubeConversions);

  return (
    <div className="YoutubeConversionInterface Flex Column">

      <div className="YoutubeConversionsHeader Flex Column">
        <span>YouTube videos were found.</span>
        <span>
          Convert to these Spotify tracks? (Tap an item to edit)
        </span>
      </div>

      <div className="YoutubeConversionsDisplayContainer Flex Column">

        <div className="YoutubeConversionsList">
          {youtubeConversions.map((conversion, index) => (<ConversionCard
            conversion={conversion}
            index={index}
            handleUndoMatchChanges={handleUndoMatchChanges}
            handleChangeMatch={handleChangeMatch}
            handleExcludeMatch={handleExcludeMatch}
            handleIncludeMatch={handleIncludeMatch}
            spotifyMatches={spotifyMatches}
          />
          )
          )}

        </div>

        <button className="YoutubeConversionsConfirmButton" type="button" onClick={handleConfirmConversions}>Confirm</button>
      </div>

      {changeModal.show ?
        <div className="ChangeModalContainer">
          <ChangeModal matchToChange={changeModal.matchToChange} handleCancelChange={handleCancelChange} handleCorrectASpotifyResult={handleCorrectASpotifyResult} />
        </div>
        : null}

    </div >
  )
};

export default YoutubeConversionInterface;
