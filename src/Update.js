import './styles/Update.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import YoutubeConversionInterface from './YoutubeConversionInterface';
import InputTextInterface from './InputTextInterface';
import FinalReviewInterface from './FinalReviewInterface';
import * as u from './utils';
import * as h from './helpers';

function Update() {
  let history = useHistory();
  const { playlist_id } = useParams(); // spotify playlist id!

  const [spotifyPlaylistInState, setSpotifyPlaylistInState] = useState(null);
  const [inputText, setInputText] = useState('');
  const [firebasePlaylistObj, setFirebasePlaylistObj] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [validInputText, setValidInputText] = useState(false);
  const [convertYoutubePosts, setConvertYoutubePosts] = useState({ youtubePosts: [], spotifyMatches: [] })
  const [newPostsInState, setNewPostsInState] = useState([]);
  const [screen, setScreen] = useState('input');

  const token = localStorage.getItem('token');
  const spotifyToken = localStorage.getItem('spotifyToken');

  useEffect(() => {
    const inputTextIsValid = h.inputTextIsValid(inputText);
    setValidInputText(inputTextIsValid);
  }, [inputText]);

  const handleGoBack = () => {
    // setInputText('');
    // setInfoLoading(false)
    // setValidInputText(false)
    // setConvertYoutubePosts({ youtubePosts: [], spotifyMatches: [] })
    // setScreen('')
    history.goBack()
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
    const { data: spotifyPlaylistData, status } = await u.getSpotifyPlaylist(playlist_id, spotifyToken);
    if (status === 200) setSpotifyPlaylistInState(spotifyPlaylistData);
    // pull down the Firebase object for this playlist
    u.getFirebasePlaylist(playlist_id, token).then(async ({ status, data }) => {
      if ([200, 201].includes(status)) {
        // TO-DO: handle data being returned but empty?
        // console.log(Object.entries(data))
        const [firebasePlaylistId, playlistObj] = Object.entries(data)[0];
        setFirebasePlaylistObj({ firebasePlaylistId, playlistObj });
        // rawPosts
        const { rawPostsLog = [], processedPostsLog = [] } = playlistObj;
        console.log(rawPostsLog);
        console.log(processedPostsLog);
        // determine new posts by comparing input text's posts with .rawPosts
        const newPostsRaw = h.findInputTextNewPosts(inputText, rawPostsLog);

        // before handling any YT-type posts, get all the Spotify Data for all .linkType = 'spotify' tracks
        const justNewSpotifyPosts = newPostsRaw.filter(e => e.linkType === 'spotify');
        const newSpotifyPostsCompleteData = await u.getSpotifyTrackData(justNewSpotifyPosts, spotifyToken);
        // whether YT posts are found and processed or not, set new posts in state so they can be accessed later by our submission function.
        setNewPostsInState(newSpotifyPostsCompleteData)

        // handle any YT-type posts
        const youtubePosts = [...newPostsRaw.filter(e => e.linkType === 'youtube')];

        // if any youtube posts in chat, find the closest matching results for these on spotify
        if (youtubePosts.length) {
          const youtubeApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
          const { videoDataObjs, spotifyDataObjs } = await u.getYoutubeVideosAndClosestSpotifyMatches(youtubePosts, youtubeApiKey, spotifyToken);
          setConvertYoutubePosts({ youtubePosts: videoDataObjs, spotifyMatches: spotifyDataObjs });
          setScreen('youtube');
          setInfoLoading(false);
        } else {
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

    const newPostsInStateMinusPostIds = [...newPostsInState]
    newPostsInStateMinusPostIds.forEach(e => delete e.postId);

    // create updated version of rawPostsLog and processedPostsLog with all the newly-found
    // and newly-processed posts, in order to then send off to FB.
    const updatedRawPosts = [...rawPostsLog, ...newPostsRaw];
    const updatedPosts = [...(processedPostsLog || []), ...newPostsInStateMinusPostIds];

    const updatedPlaylistObj = {
      ...playlistObj,
      rawPostsLog: updatedRawPosts,
      processedPostsLog: updatedPosts,
    };

    // POST our updatedPlaylistObj off to FB.
    await u.updateFirebasePlaylist(firebasePlaylistId, token, updatedPlaylistObj);
    // POST our new tracks to the Spotify playlist.
    await u.postToSpotifyPlaylist(playlist_id, spotifyToken, trackIDs) // <--- POSTING TRACKS TO SPOTIFY!!
  };

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
