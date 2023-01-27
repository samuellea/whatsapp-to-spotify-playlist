import './styles/Update.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import YoutubeConversionInterface from './YoutubeConversionInterface';
import InputTextInterface from './InputTextInterface';
import FinalReviewInterface from './FinalReviewInterface';
import * as u from './utils';
import * as h from './helpers';
import { zip } from 'lodash';

function Update() {
  let history = useHistory();
  const { playlist_id } = useParams();

  const [inputText, setInputText] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);
  const [validInputText, setValidInputText] = useState(false);
  const [convertYoutubePosts, setConvertYoutubePosts] = useState({ youtubePosts: [], spotifyMatches: [] })
  const [newPostsInState, setNewPostsInState] = useState([]);
  const [screen, setScreen] = useState('input');

  const token = localStorage.getItem('token');
  const spotifyToken = localStorage.getItem('spotifyToken');

  useEffect(() => {
    // trigger a call to FB /playlists endpoint for this playlist obj - but where to store? Here, in update? Or up in home? Or even App?
  }, []);

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

  const handleSubmitInputText = () => {
    setInfoLoading(true);
    // pull down the Firebase object for this playlist
    u.getFirebasePlaylist(playlist_id, token).then(async ({ status, data }) => {
      if ([200, 201].includes(status)) {
        // TO-DO: handle data being returned but empty?
        const playlistObj = Object.values(data)[0];
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
          newPosts={newPostsInState}
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
