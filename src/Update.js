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
  const { playlist_id } = useParams();

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
    setInputText(e.target.value)
  }

  const handleSubmitInputText = async () => {
    setInfoLoading(true);
    const { data: spotifyPlaylistData, status } = await u.getSpotifyPlaylist(playlist_id, spotifyToken);
    if (status === 200) setSpotifyPlaylistInState(spotifyPlaylistData);
    // pull down the Firebase object for this playlist
    u.getFirebasePlaylist(playlist_id, token).then(async ({ status, data }) => {
      if ([200, 201].includes(status)) {
        // TO-DO: handle data being returned but empty?
        const playlistObj = Object.values(data)[0];
        setFirebasePlaylistObj(playlistObj);
        const { chatLog, posts } = playlistObj;
        // determine new messages by comparing input text with chat log
        const chatLogSplit = h.splitTextIntoIndividualMessages(chatLog);
        const inputTextSplit = h.splitTextIntoIndividualMessages(inputText);
        const newMessages = h.newMsgsNotInChatLog(chatLogSplit, inputTextSplit);
        // extract posts from these new messages
        const newPosts = h.splitIndividualMessagesIntoPosts(newMessages);
        console.log('newPosts original -----------------------');
        console.log(newPosts);
        // whether YT posts are found and processed or not, set new posts in state so they can be accessed later by our submission function.

        // before doing so, get all the Spotify Data for all .linkType = 'spotify' tracks
        const justNewSpotifyPosts = newPosts.filter(e => e.linkType === 'spotify');
        const newSpotifyPostsCompleteData = await u.getSpotifyTrackData(justNewSpotifyPosts, spotifyToken);
        setNewPostsInState(newSpotifyPostsCompleteData)
        //   setNewPostsInState(newPosts);
        const youtubePosts = [...newPosts.filter(e => e.linkType === 'youtube')];

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

    // concat the new messages from the input text to the end of the firebase PL's chatLog, creating one big updated string
    // this will be the NEW fb .chatLog property value, we'll post to it

    const { chatLog, posts } = firebasePlaylistObj;
    const chatLogSplit = h.splitTextIntoIndividualMessages(chatLog);
    const inputTextSplit = h.splitTextIntoIndividualMessages(inputText);
    const newMessages = h.newMsgsNotInChatLog(chatLogSplit, inputTextSplit);
    // extract posts from these new messages
    const newPosts = h.splitIndividualMessagesIntoPosts(newMessages);

    // create a new .posts array, combining the .posts array downloaded from FB with the newPostsInState
    // this will be the NEW fb .posts property value, we'll post to it



    // await u.postToSpotifyPlaylist(playlist_id, spotifyToken, trackIDs) // <--- POSTING TRACKS TO SPOTIFY!!

    // ⭐⭐⭐ we should be adding a latestPostMostRecentUpdate prop - which is just the last post obj whenever we 
    // do a confirmed update / submission. Post that obj to the .latestPostMostRecentUpdate prop on the /users/playlistMetas/:id
    // endpoint - that's important
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
          firebasePlaylistObj={firebasePlaylistObj}
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
