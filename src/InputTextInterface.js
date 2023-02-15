import './styles/InputTextInterface.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faWarning } from '@fortawesome/free-solid-svg-icons';

function InputTextInterface({ inputText, validInputText, handleChangeTextArea, handleSubmitInputText, handleTextAreaClear }) {
  useEffect(() => { }, []);

  const inputTextInfo = () => {
    if (!inputText.length) return <span>Paste a WhatsApp chat export .txt file here</span>
    if (inputText.length && !validInputText) {
      return (
        <div className="InputTextWarning Flex Column">

          <span><FontAwesomeIcon icon={faWarning} pointerEvents="none" />The text you've pasted does not appear to either: </span>
          <ul>
            <li>be a correctly formatted WhatsApp chat text export</li>
            <li>contain any valid Spotify or Youtube links</li>
          </ul>
        </div>
      );
    }
    if (inputText.length && validInputText) return (
      <div className="ValidTextFeedback Flex Row">
        <FontAwesomeIcon icon={faCircleCheck} pointerEvents="none" />
      </div>
    )
  }

  return (
    <div className="InputTextInterfaceContainer Flex Column">

      <div className="InputTextInterfaceMessage">{inputTextInfo()}</div>

      <div className="InputTextInterface Flex Column">
        <textarea id="w3review" name="w3review" onChange={handleChangeTextArea} disabled={inputText.length} value={inputText}></textarea>
        <div className="InputTextButtonArea Flex Column">
          <button id="clear" type="button" onClick={handleTextAreaClear} disabled={!inputText.length}>Clear</button>
          <button id="submit" type="button" onClick={handleSubmitInputText} disabled={!validInputText}>Submit</button>
        </div>

      </div>
    </div>
  )
};

export default InputTextInterface;
