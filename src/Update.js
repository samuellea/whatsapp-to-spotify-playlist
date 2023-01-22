import './styles/Update.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import * as u from './utils';
import * as h from './helpers';

function Update() {
  let history = useHistory();
  const { playlist_id } = useParams();

  const [inputText, setInputText] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);
  const [youtubePostsFound, setYoutubePostsFound] = useState(false);
  const [validInputText, setValidInputText] = useState(false);

  const token = localStorage.getItem('token');
  const spotifyToken = localStorage.getItem('spotifyToken');

  useEffect(() => {
    // trigger a call to FB /playlists endpoint for this playlist obj - but where to store? Here, in update? Or up in home? Or even App?
  }, []);

  useEffect(() => {
    const inputTextIsValid = h.inputTextIsValid(inputText);
    setValidInputText(inputTextIsValid);
  }, [inputText]);


  const handleChange = (e) => {
    setInputText(e.target.value)
  }

  const handleSubmit = () => {
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
        if (newPosts.some(e => /youtu.*/g.test(e.linkURL))) {
          const youtubeApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
          const { videoDataObjs, spotifyDataObjs } = await u.getYoutubeVideosAndClosestSpotifyMatches(newPosts, youtubeApiKey, spotifyToken);
          console.log('🍿 --------------------');
          console.log(videoDataObjs);
          console.log('💿 --------------------');
          console.log(spotifyDataObjs);
        }

      } else {
        // handle error getting this playlist from firebase - server error, bad request, 
      }
    })
  }

  const inputTextInfo = () => {
    if (!inputText.length) return <p>Paste a WhatsApp chat export .txt file here</p>
    if (inputText.length && !validInputText) {
      return (
        <div className="inputTextWarning">
          <p>The text you've pasted does not appear to either: </p>
          <p>- be a correctly formatted WhatsApp chat text export</p>
          <p>- contain any valid Spotify or Youtube links</p>
        </div>
      );
    }
    if (inputText.length && validInputText) return <h2>✅</h2>
  }

  return (
    <div className="Update">
      <button type="button" onClick={() => history.goBack()}>{'<- Back'}</button>
      <h1>Update page</h1>

      <div className="infoArea">
        {infoLoading ?
          <h1>⌛</h1>
          : youtubePostsFound ?
            <h1>Youtube Conversion Screen</h1>
            : <textarea id="w3review" name="w3review" onChange={handleChange}></textarea>
        }
        {inputTextInfo()}
      </div>
      <div className="buttonArea">
        <button id="submitButton" type="button" onClick={handleSubmit} disabled={!validInputText}>Submit</button>
      </div>
    </div>
  )
};


export default Update;
