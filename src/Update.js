import './styles/Update.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import YoutubeConversionInterface from './YoutubeConversionInterface';
import InputTextInterface from './InputTextInterface';
import FinalReviewInterface from './FinalReviewInterface';
import * as u from './utils';
import * as h from './helpers';
import NoNew from './NoNew';

function Update() {
  let history = useHistory();
  const params = new URLSearchParams(window.location.search);

  const spotifyPlaylistId = params.get('spotifyPlaylistId');
  const firebasePlaylistId = params.get('firebasePlaylistId');

  const [spotifyPlaylistInState, setSpotifyPlaylistInState] = useState(null);
  const [inputText, setInputText] = useState('');
  const [firebasePlaylistObj, setFirebasePlaylistObj] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [validInputText, setValidInputText] = useState(false);
  const [convertYoutubePosts, setConvertYoutubePosts] = useState({ youtubePosts: [], spotifyMatches: [] })
  const [newPostsInState, setNewPostsInState] = useState([]);
  const [screen, setScreen] = useState('input');
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  const firebaseUserId = localStorage.getItem('firebaseUserId');
  const token = localStorage.getItem('token');
  const spotifyToken = localStorage.getItem('spotifyToken');

  useEffect(() => {
    const inputTextIsValid = h.inputTextIsValid(inputText);
    setValidInputText(inputTextIsValid);
  }, [inputText]);

  const handleGoBack = () => {
    history.goBack();
  };

  const handleChangeTextArea = (e) => {
    const inputTextNoLineBreaks = e.target.value.replace(/(\r\n|\n|\r)/gm, " ");
    setInputText(inputTextNoLineBreaks);
  }

  const handleTextAreaClear = () => {
    setInputText('');
  }

  const handleSubmitInputText = async () => {
    setInfoLoading(true);
    const { data: spotifyPlaylistData, status } = await u.getSpotifyPlaylist(spotifyPlaylistId, spotifyToken);
    if (status === 200) setSpotifyPlaylistInState(spotifyPlaylistData);
    // pull down the Firebase object for this playlist
    u.getFirebasePlaylist(spotifyPlaylistId, token).then(async ({ status, data }) => {
      if ([200, 201].includes(status)) {
        // TO-DO: handle data being returned but empty?
        const [firebasePlaylistId, playlistObj] = Object.entries(data)[0];
        // set the firebase playlist object returned from firebase in state, for later access by other functions.
        setFirebasePlaylistObj({ firebasePlaylistId, playlistObj });

        const { rawPostsLog = [], processedPostsLog = [] } = playlistObj;
        // determine new posts by comparing input text's posts with .rawPosts
        const newPostsRaw = h.findInputTextNe
        wPosts(inputText, rawPostsLog);
        console.log(newPostsRaw, ' <-- newPostsRaw')

        // if there ARE no new posts found from the input text, feedback to user.
        if (!newPostsRaw.length) {
          console.log('fish')
          setInfoLoading(false);
          return setScreen('nonew')
        };

        console.log('ape')
        // first, get all the Spotify Data for all .linkType = 'spotify' posts
        const justNewSpotifyPosts = newPostsRaw.filter(e => e.linkType === 'spotify');
        const newSpotifyPostsCompleteData = await u.getSpotifyTrackData(justNewSpotifyPosts, spotifyToken);
        // // ❓❓❓❓ check newSpotifyPostsCompleteData
        // whether YT posts are found and processed or not, set new posts in state so they can be accessed later by our submission function.
        setNewPostsInState(newSpotifyPostsCompleteData)

        // second, handle any .linkType = 'youtube' posts
        const youtubePosts = [...newPostsRaw.filter(e => e.linkType === 'youtube')];

        // if any youtube posts in chat, find the closest matching results for these on spotify
        if (youtubePosts.length) {
          console.log('giraffe')
          const youtubeApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
          const { videoDataObjs, spotifyDataObjs } = await u.getYoutubeVideosAndClosestSpotifyMatches(youtubePosts, youtubeApiKey, spotifyToken);
          // ❓❓❓❓ check spotifyDataObjs
          setConvertYoutubePosts({ youtubePosts: videoDataObjs, spotifyMatches: spotifyDataObjs });
          setScreen('youtube');
          setInfoLoading(false);
        } else {
          console.log('hippo')
          setScreen('review');
          setInfoLoading(false);
        }
      } else {
        // handle error getting this playlist from firebase - server error, bad request, 
      }
    })
  }

  const handleConvertedPosts = (convertedPosts) => {
    setConvertYoutubePosts({ youtubePosts: [], spotifyMatches: [] });
    // mix convertedPosts with the spotify-type posts already in newPostsInState
    const combinedAndSortedSpotifyAndYoutubePosts = newPostsInState.concat(convertedPosts).sort((a, b) => (a.postId > b.postId) ? 1 : -1);
    setNewPostsInState(combinedAndSortedSpotifyAndYoutubePosts);
    setScreen('review');
  }

  const handleFinalSubmission = async (trackIDs) => {
    const { firebasePlaylistId, playlistObj } = firebasePlaylistObj;
    const { rawPostsLog = [], processedPostsLog = [] } = playlistObj;

    const newPostsRaw = h.findInputTextNewPosts(inputText, rawPostsLog);

    // scrape genres for each spotify track
    const newPostsInStatePlusGenres = await u.getGenresForSpotifyTracks(newPostsInState, spotifyToken);
    const newPostsInStateMinusUnnecessaryKeys = [...newPostsInStatePlusGenres]
    newPostsInStateMinusUnnecessaryKeys.forEach(e => delete e.postId);

    // create updated version of rawPostsLog and processedPostsLog with all the newly-found
    // and newly-processed posts, in order to then send off to FB.
    const updatedRawPosts = [...rawPostsLog, ...newPostsRaw];
    const updatedPosts = [...(processedPostsLog || []), ...newPostsInStateMinusUnnecessaryKeys];

    const updatedPlaylistObj = {
      ...playlistObj,
      rawPostsLog: updatedRawPosts,
      processedPostsLog: updatedPosts,
    };

    console.log(updatedPlaylistObj)

    // POST our updatedPlaylistObj off to FB.




    const firebaseStatus = await u.createOrUpdateFirebasePlaylist('PATCH', firebaseUserId, token, updatedPlaylistObj, firebasePlaylistId);
    // POST our new tracks to the Spotify playlist.
    const spotifyStatus = await u.postToSpotifyPlaylist(spotifyPlaylistId, spotifyToken, trackIDs) // <--- POSTING TRACKS TO SPOTIFY!!

    if ([200, 201].includes(firebaseStatus) && [200, 201].includes(spotifyStatus)) {
      console.log('SUCCESS!')
      setSubmissionSuccess(true);
    } else {
      setSubmissionSuccess(false);
      console.log('failure updating playlist - firebase or spotify')
    }
  }

  const screenToRender = () => {
    if (infoLoading) return (<h1>⌛</h1>);
    if (screen === 'input') {
      return (
        <InputTextInterface
          inputText={inputText}
          validInputText={validInputText}
          handleChangeTextArea={handleChangeTextArea}
          handleSubmitInputText={handleSubmitInputText}
          handleTextAreaClear={handleTextAreaClear}
        />
      )
    }
    if (screen === 'nonew') {
      return (
        <NoNew />
      )
    }
    if (screen === 'youtube') {
      return (
        <YoutubeConversionInterface
          convertYoutubePosts={convertYoutubePosts}
          handleConvertedPosts={handleConvertedPosts}
        />
      )
    }
    if (screen === 'review') {
      return (
        <FinalReviewInterface
          firebasePlaylistObj={firebasePlaylistObj.playlistObj}
          spotifyPlaylistObj={spotifyPlaylistInState}
          newPosts={newPostsInState}
          handleFinalSubmission={handleFinalSubmission}
          submissionSuccess={submissionSuccess}
          firebasePlaylistId={firebasePlaylistId}
        />
      )
    }


  };


  return (
    <div className="Update">
      <button type="button" onClick={handleGoBack}>{'<- Back'}</button>
      <h1>Update page</h1>

      <div className="infoArea">
        {screenToRender()}
      </div>

    </div>
  )
};


export default Update;
