import React, { useState, useEffect, useRef } from 'react';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import * as h from './helpers';
import * as u from './utils';
import usePrevious from './customHooks/usePrevious';
import './styles/ByPosterSection.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Oval } from 'react-loading-icons';
import Preview from './Preview';
import { Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import GreenCircleRedCross from './GreenCircleRedCross';

function ByPosterSection({ posters, posts, lookup, playlistMetaInAppState, isPublicStatsPage = false, authLink }) {
  const history = useHistory();

  console.log('---------------------------------------')
  console.log('processesPostsLog coming into ByPosterSection:')
  console.log(posts)
  console.log('---------------------------------------')

  // useEffect(() => {
  //   console.log('⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ')
  // }, []);


  // const initPosterPosts = h.groupPostsByPoster(posters[0], posts, lookup);
  // console.log(initPosterPosts, ' 🐙🐙🐙🐙🐙🐙🐙🐙🐙')
  // console.log(posters)
  // console.log(posts)
  // console.log(lookup)

  const posterPlaylistRef = useRef();

  const [posterIndex, setPosterIndex] = useState(0);
  const [posterPosts, setPosterPosts] = useState([]);
  const [creation, setCreation] = useState({
    success: false,
    error: false,
    pending: false,
  })
  const [indexPlaying, setIndexPlaying] = useState(null);

  const [thumbsReady, setThumbsReady] = useState(false);

  const prevPosters = usePrevious(posters);

  useEffect(() => {
    // console.log('💡 💡 💡 💡 ')
    // console.log(posters)
    if (posters !== prevPosters) {
      // reset the posterIndex to zero
      setPosterIndex(0);
    }
    const postsByPoster = h.groupPostsByPoster(posters[posterIndex], posts, lookup);
    // console.log(postsByPoster)
    setPosterPosts(postsByPoster);
    setIndexPlaying(null);
    if (posterPlaylistRef) {
      posterPlaylistRef.current.scroll({
        top: 0,
      });
    }
    // if (prevIndex !== posterIndex) { }
  }, [posterIndex, posters]);

  const handleOptionClick = (e) => {
    setThumbsReady(false)
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

  const handleCreatePosterPlaylist = async (spotifyToken, spotifyUserId) => {
    setCreation({ success: false, error: false, pending: true });
    const { spotifyPlaylistName } = playlistMetaInAppState;
    const date = h.dateTodayDdMmYyyy();
    const newPosterPlaylistName = `${posters[posterIndex]} - ${spotifyPlaylistName} [${date}]`;
    const posterTrackIDs = posterPosts.map(e => e.spotifyTrackID);
    const createPosterPlaylistAttempt = await u.createPosterPlaylist(newPosterPlaylistName, spotifyToken, spotifyUserId, posterTrackIDs);
    if (!createPosterPlaylistAttempt.error) {
      const { newPlaylistInfo } = createPosterPlaylistAttempt;
      setCreation({ success: true, error: false, pending: false, newPlaylistInfo });
    } else {
      setCreation({ success: false, error: createPosterPlaylistAttempt.error, pending: false });
    }
  };

  const handleMakePlaylistClickPrivate = async () => {
    const spotifyToken = window.localStorage.getItem('spotifyToken');
    const spotifyUserId = window.localStorage.getItem('spotifyUserId');

    let r = window.confirm(`This will create a new playlist in your Spotify account`);
    if (r == true) {
      await handleCreatePosterPlaylist(spotifyToken, spotifyUserId);
    }
  };

  const handleMakePlaylistClickPublic = async () => {
    const spotifyToken = window.localStorage.getItem('spotifyToken');
    let spotifyUserId = window.localStorage.getItem('spotifyUserId');
    let r = window.confirm(`This will create a new playlist in your Spotify account`);
    if (r == true) {
      if (!spotifyToken) {
        console.log('fambo?')
        window.location.href = authLink;
        return;
      }
      if (!spotifyUserId) {
        const { data } = await axios({ method: 'get', url: 'https://api.spotify.com/v1/me', headers: { 'Authorization': 'Bearer ' + spotifyToken } })
        window.localStorage.setItem('spotifyUserId', data.id);
      };
      spotifyUserId = window.localStorage.getItem('spotifyUserId');
      await handleCreatePosterPlaylist(spotifyToken, spotifyUserId);
    }
  };


  const handleBack = () => {
    setCreation({
      success: false,
      error: false,
      pending: false,
    });
    setIndexPlaying(null);
  };

  const onLoad = (index) => {
    if (index === posterPosts.length - 1) setThumbsReady(true)
  };

  if (!posterPosts) return null;

  const toRender = () => {
    const { success, error, pending } = creation;
    if (pending) {
      return (
        <div className="ByPosterPendingScreen Flex Column">
          <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
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
      const newPlaylistId = creation.newPlaylistInfo?.id || null;
      return (
        <div className="ByPosterCreationFeedback Flex Column">

          <div className="ByPosterSectionGreenCircleContainer Flex">
            <GreenCircleRedCross type="GreenCircle" height={200} />
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
      const spotifyToken = window.localStorage.getItem('spotifyToken');
      return (
        <div className="ByPosterSectionContentWrapper Flex Column">
          <h4 className="SectionHeader">Contributors' tracks</h4>
          <div className="PosterOptionContainer Flex Row">
            <span>{posters[posterIndex]}</span>
            <div className="OptionButtonsContainer Flex Row">
              <button type="text" value="left" onClick={(event) => handleOptionClick(event)} style={{ visibility: posterIndex !== 0 ? 'visible' : 'hidden' }}>
                <FontAwesomeIcon icon={faChevronLeft} pointerEvents="none" />
              </button>
              <button type="text" value="right" onClick={(event) => handleOptionClick(event)} style={{ visibility: posterIndex !== posters.length - 1 ? 'visible' : 'hidden' }}>
                <FontAwesomeIcon icon={faChevronRight} pointerEvents="none" />
              </button>
            </div>
          </div>


          <div className="PosterPlaylistAndSpinnerContainer">

            {!thumbsReady ?
              <div className="PosterPlaylistSpinnerContainer Flex">
                <Oval stroke="#98FFAD" height={100} width={50} strokeWidth={6} />
              </div>
              : null}

            <div className="PosterPlaylistContainer" ref={posterPlaylistRef}>
              {posterPosts.map((post, i) => {
                // console.log(post)
                const bgColor = i % 2 === 0 ? 'Odd' : 'Even';
                return (
                  <div className={`PosterPlaylistCard Flex Row ${bgColor}`}>

                    <img src={post.thumbnailSmall} onLoad={() => onLoad(i)} />

                    <div className="PosterPlaylistCardInfo Flex Column">
                      <span className="CurtailText Curtail2">{post.title}</span>
                      <span className="CurtailText Curtail2">{post.artists.join(', ')}</span>
                      {/* <span>{post.time.day + '/' + post.time.month + '/' + post.time.year + ' ' + post.time.hour + ':' + post.time.minute}</span> */}
                    </div>
                    <Preview index={i} url={post.previewURL} setIndexPlaying={setIndexPlaying} indexPlaying={indexPlaying} post={post} />
                  </div>
                )
              })
              }
            </div>

          </div>


          <div className="PosterMakeButtonContainer Flex Row">
            <button className="ByPosterButtonBig Flex" type="button" onClick={isPublicStatsPage ? () => handleMakePlaylistClickPublic() : () => handleMakePlaylistClickPrivate()}><span>{spotifyToken ? 'Make Playlist' : 'Make Playlist (Log Into Spotify)'}</span></button>
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


