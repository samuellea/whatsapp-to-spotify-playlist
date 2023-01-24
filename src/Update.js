import './styles/Update.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import YoutubeConversionInterface from './YoutubeConversionInterface';
import InputTextInterface from './InputTextInterface';
import * as u from './utils';
import * as h from './helpers';

function Update() {
  let history = useHistory();
  const { playlist_id } = useParams();

  const [inputText, setInputText] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);
  const [validInputText, setValidInputText] = useState(false);
  const [convertYoutubePosts, setConvertYoutubePosts] = useState({ youtubePosts: [], spotifyMatches: [] })
  const [newPosts, setNewPosts] = useState([]);

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
    setInputText('');
    setInfoLoading(false)
    setValidInputText(false)
    setConvertYoutubePosts({ youtubePosts: [], spotifyMatches: [] })
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
        console.log(newPosts)

        // if some of the posts are youtube links, find the closest matching results for these on spotify
        if (newPosts.some(e => e.linkType === 'youtube')) {
          const youtubeApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
          const { videoDataObjs, spotifyDataObjs } = await u.getYoutubeVideosAndClosestSpotifyMatches(newPosts, youtubeApiKey, spotifyToken);
          setInfoLoading(false);
          setConvertYoutubePosts({ youtubePosts: videoDataObjs, spotifyMatches: spotifyDataObjs });
          setNewPosts(newPosts);
        }

      } else {
        // handle error getting this playlist from firebase - server error, bad request, 
      }
    })
  }

  const handleConvertedPosts = (convertedPosts) => {
    console.log('NEW POSTS --------------------');
    console.log(newPosts)
    console.log('CONVERTED POSTS --------------------');
    console.log(convertedPosts);
  }


  return (
    <div className="Update">
      <button type="button" onClick={handleGoBack}>{'<- Back'}</button>
      <h1>Update page</h1>

      <div className="infoArea">
        {infoLoading ?
          <h1>⌛</h1>
          : convertYoutubePosts.youtubePosts.length
            ? <YoutubeConversionInterface convertYoutubePosts={convertYoutubePosts} handleConvertedPosts={handleConvertedPosts} />
            : <InputTextInterface inputText={inputText} validInputText={validInputText} handleChangeTextArea={handleChangeTextArea} handleSubmitInputText={handleSubmitInputText} />
        }
      </div>


    </div>
  )
};


export default Update;
