import './styles/Update.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

function Update() {
  let history = useHistory();

  const [inputText, setInputText] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);

  const handleChange = (e) => {
    setInputText(e.target.value)
  }

  const handleSubmit = () => {
    console.log(inputText);
  }

  return (
    <div className="Update">
      <button type="button" onClick={() => history.goBack()}>{'<- Back'}</button>
      <h1>Update page</h1>
      <textarea id="w3review" name="w3review" onChange={handleChange}></textarea>
      <div className="infoArea">
        {infoLoading ?
          <h1>⌛</h1>
          : null
        }
        some info
      </div>
      <div className="buttonArea">
        <button id="submitButton" onClick={handleSubmit} disabled={inputText.length === 0}>Submit</button>
      </div>
    </div>
  )
};


export default Update;
