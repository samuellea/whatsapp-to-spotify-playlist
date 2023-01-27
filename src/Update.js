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

        // whether YT posts are found and processed or not, set new posts in state so they can be accessed later by our submission function.

        // before doing so, get all the Spotify Data for all .linkType = 'spotify' tracks
        const justNewSpotifyPosts = newPosts.filter(e => e.linkType === 'spotify');
        const newSpotifyPostsCompleteData = await u.getSpotifyTrackData(justNewSpotifyPosts, spotifyToken);
        console.log(newSpotifyPostsCompleteData);
        //   setNewPostsInState(newPosts);

        // if some of the posts are youtube links, find the closest matching results for these on spotify
        if (newPosts.some(e => e.linkType === 'youtube')) {
          const youtubeApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
          // get just the postObjs that are youtube videos
          const youtubePosts = [...newPosts.filter(e => e.linkType === 'youtube')];
          const { videoDataObjs, spotifyDataObjs } = await u.getYoutubeVideosAndClosestSpotifyMatches(youtubePosts, youtubeApiKey, spotifyToken);
          console.log(spotifyDataObjs);
          setConvertYoutubePosts({ youtubePosts: videoDataObjs, spotifyMatches: spotifyDataObjs });
          setInfoLoading(false);
          setScreen('youtube');
        } else {
          // skip YT conversion step and fetch spotify data for the objects in newPosts

          // then go straight to the Final Review screen
          setScreen('review');
        }

      } else {
        // handle error getting this playlist from firebase - server error, bad request, 
      }

    })
  }

  const handleConvertedPosts = (convertedPosts) => {
    console.log(convertedPosts)
    setConvertYoutubePosts({ youtubePosts: [], spotifyMatches: [] });

    // console.log('NEW POSTS IN STATE --------------------');
    // console.log(newPostsInState)
    // console.log('CONVERTED POSTS --------------------');
    // console.log(convertedPosts);

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
