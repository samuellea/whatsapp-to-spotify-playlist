import './styles/Update.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import * as u from './utils';

function Update() {
  let history = useHistory();
  const { playlist_id } = useParams();

  const [inputText, setInputText] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);
  const [youtubePostsFound, setYoutubePostsFound] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    // trigger a call to FB /playlists endpoint for this playlist obj - but where to store? Here, in update? Or up in home? Or even App?
  }, []);

  const handleChange = (e) => {
    setInputText(e.target.value)
  }

  const handleSubmit = () => {
    setInfoLoading(true);
    // STEP ONE - determine NEW messages in input text by comparing input text with any pre-existing chatlogs for this playlist (if they exist on Firebase)
    // pull down this playlist's playlistObj from firebase
    u.getFirebasePlaylist(playlist_id, token).then(({ status, data }) => {
      if ([200, 201].includes(status)) {
        const playlistObj = Object.values(data)[0];
        const { chatLog, posts } = playlistObj;
        const chatLogSplit = u.splitTextIntoIndividualMessages(chatLog);
        const inputTextSplit = u.splitTextIntoIndividualMessages(inputText); ⭐⭐⭐⭐⭐ // REFACTOR SPLITTEXTINTOINDIVUDALMESSAGES to just do into messages, atm its doing it into posts
        console.log(chatLogSplit);
        console.log(inputTextSplit);

        // if (chatLog.length) {
        //   // you've updated this playlist before, so let's check to see if there are any NEW messages in the input text since the
        //   // last message in the old chat log.
        //   // So, split chat log into individual messages
        //   u.splitTextIntoIndividualMessages(inputText)
        // } else {
        //   // this playlist's chat log is empty, meaning you haven't updated it using input text before!
        //   // that's fine, don't need to find 'newest' messages in the input text - THEY'RE ALL new!
        // }

      };
    })
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
        some info
      </div>
      <div className="buttonArea">
        <button id="submitButton" type="button" onClick={handleSubmit} disabled={inputText.length === 0}>Submit</button>
      </div>
    </div>
  )
};


export default Update;
