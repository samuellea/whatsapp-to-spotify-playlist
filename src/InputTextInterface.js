import './styles/InputTextInterface.css';
import React, { useState, useEffect } from 'react';

function InputTextInterface({ inputText, validInputText, handleChangeTextArea, handleSubmitInputText }) {
  useEffect(() => { }, []);

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
    <div className="InputTextInterface">
      <textarea id="w3review" name="w3review" onChange={handleChangeTextArea}></textarea>
      <div className="buttonArea">
        <button id="submitButton" type="button" onClick={handleSubmitInputText} disabled={!validInputText}>Submit</button>
      </div>
      {inputTextInfo()}
    </div>
  )
};

export default InputTextInterface;
