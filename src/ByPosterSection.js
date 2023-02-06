import React, { useState, useEffect } from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
// import _ from 'lodash';
import * as h from './helpers';
import * as u from './utils';
import './styles/ByPosterSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Oval } from 'react-loading-icons';

function ByPosterSection({ posters, posts, lookup, playlistMetaInAppState }) {

  const [posterIndex, setPosterIndex] = useState(0);
  const [posterPosts, setPosterPosts] = useState(null);
  const [creation, setCreation] = useState({
    success: false,
    error: false,
    pending: false,
  })

  useEffect(() => {
    const postsByPoster = h.groupPostsByPoster(posters[posterIndex], posts, lookup);
    console.log(postsByPoster)
    setPosterPosts(postsByPoster);
  }, [posterIndex]);

  const handleOptionClick = (e) => {
    const atStart = posterIndex === 0;
    const atEnd = posterIndex === posters.length - 1;
    const { value } = e.target;
    if (value === 'left' && !atStart) {
      const newIndex = posterIndex - 1;
      setPosterIndex(newIndex);
    }
    if (value === 'right' && !atEnd) {
      const newIndex = posterIndex + 1;
      setPosterIndex(newIndex);
    }
  };

  const handleMakePlaylistClick = async () => {
    const spotifyToken = window.localStorage.getItem('spotifyToken');
    const spotifyUserId = window.localStorage.getItem('spotifyUserId');

    let r = window.confirm(`This will create a new playlist in your Spotify account`);
    if (r == true) {
      setCreation({ success: false, error: false, pending: true });
      const { spotifyPlaylistName } = playlistMetaInAppState;
      const date = h.dateTodayDdMmYyyy();
      const newPosterPlaylistName = `${posters[posterIndex]} - ${spotifyPlaylistName} [${date}]`;
      const posterTrackIDs = posterPosts.map(e => e.spotifyTrackID);

      const createPosterPlaylistAttempt = await u.createPosterPlaylist(newPosterPlaylistName, spotifyToken, spotifyUserId, posterTrackIDs);
      console.log(createPosterPlaylistAttempt)
      if (!createPosterPlaylistAttempt.error) {
        console.log(createPosterPlaylistAttempt, ' oooooppopopp')
        const { newPlaylistInfo } = createPosterPlaylistAttempt;
        setCreation({ success: true, error: false, pending: false, newPlaylistInfo });
      } else {
        setCreation({ success: false, error: createPosterPlaylistAttempt.error, pending: false });
      }

    }
  };

  const handleBack = () => {
    setCreation({
      success: false,
      error: false,
      pending: false,
    })
  };

  if (!posterPosts) return null;

  const toRender = () => {
    const { success, error, pending } = creation;
    if (pending) {
      return (
        <div className="ByPosterPendingScreen Flex Column">
          <Oval stroke="#07eda8" height={100} width={100} strokeWidth={4} />
          <span>Creating playlist...</span>
        </div>
      );
    };

    if (error) {
      return (
        <div className="ByPosterCreationFeedback Flex Column">
          <h1>Hmmm...</h1>
          <h4>{creation.error.msg}</h4>
          <button className="ByPosterButtonBig" type="button" onClick={handleBack}>
            <span>Back</span>
          </button>
        </div>
      );
    }

    if (success) {
      console.log(creation, ' <------ creation')
      const newPlaylistId = creation.newPlaylistInfo?.id || null;
      return (
        <div className="ByPosterCreationFeedback Flex Column">
          <div className="GreenCircleContainer">
            <div className="GreenCircle">
              <span><i class="fa fa-check"></i></span>
            </div>
          </div>
          <h4>Made playlist</h4>
          <h1>{creation.newPlaylistInfo?.name || 'BLAH'}</h1>

          <button className="ByPosterButtonBig" type="button" onClick={handleBack}>
            <span>Back</span>
          </button>
          <button className="ByPosterButtonBig" type="button">
            <a href={`https://open.spotify.com/playlist/${newPlaylistId}`} target="_blank">Open</a>
          </button>

        </div>
      );
    }

    if (!success && !error && !pending) {
      return (
        <div className="ByPosterSectionContentWrapper Flex Column">
          <div className="PosterOptionContainer Flex Row">
            <span>{posters[posterIndex]}</span>
            <div className="OptionButtonsContainer Flex Row">
              {posterIndex !== 0 ? <button type="text" value="left" onClick={(event) => handleOptionClick(event)}>
                <FontAwesomeIcon icon={faChevronLeft} pointerEvents="none" />
              </button> : null}
              {posterIndex !== posters.length - 1 ? <button type="text" value="right" onClick={(event) => handleOptionClick(event)}>
                <FontAwesomeIcon icon={faChevronRight} pointerEvents="none" />
              </button> : null}
            </div>
          </div>

          <div className="PosterPlaylistContainer">
            {posterPosts.map(post => (
              <div className="PosterPlaylistCard Flex Row">
                <img src={post.thumbnail} />
                <div className="PosterPlaylistCardInfo Flex Column">
                  <span>{post.title}</span>
                  <span>{post.artists.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="PosterMakeButtonContainer Flex Row">
            <button className="ByPosterButtonBig" type="button" onClick={handleMakePlaylistClick}><span>Make Playlist</span></button>
          </div>
        </div>
      );
    }

  };


  return (
    <div className="ByPosterSection Flex Column">
      {toRender()}
    </div>

  )
};

export default ByPosterSection;


