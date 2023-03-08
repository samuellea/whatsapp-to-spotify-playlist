import './styles/InputTextInterface.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faWarning } from '@fortawesome/free-solid-svg-icons';
import Oval from 'react-loading-icons/dist/esm/components/oval';

function InputTextInterface({ inputText, validInputText, handleChangeTextArea, handleSubmitInputText, handleTextAreaClear, infoLoading }) {

  const [validError, setValidError] = useState(false);

  useEffect(() => {
    console.log('BONGO')
    if (!inputText.length) setValidError(false);
    if (inputText.length && validInputText) setValidError(false);
    if (inputText.length && !validInputText) setValidError(true);
  }, [validInputText, inputText]);

  const inputTextInfo = () => {
    if (!inputText.length) {
      return <span>Paste a WhatsApp chat export .txt file here</span>
    } else {
      if (validInputText) return (
        <div className="ValidTextFeedback Flex Row">
          <FontAwesomeIcon icon={faCircleCheck} pointerEvents="none" />
        </div>
      )
      if (!validInputText) {
        return (
          <div className="InputTextWarning Flex Column">
            <span><FontAwesomeIcon icon={faWarning} pointerEvents="none" />The text you've pasted does not appear to either: </span>
            <ul>
              <li>contain any valid Spotify or Youtube links</li>
              <li>be a correctly formatted WhatsApp chat text export - ensure you set your device's clock to <span>24 hour</span> time <span>before</span> exporting your WhatsApp chat</li>
            </ul>
          </div>
        );
      }
    }
  }

  return (
    <div className="InputTextInterfaceContainer Flex Column">
      <div className="InputTextInterfaceMessage">{inputTextInfo()}</div>

      <div className="InputTextInterface Flex Column">

        {!infoLoading ?
          <textarea
            autofocus
            id="w3review"
            name="w3review"
            onChange={handleChangeTextArea}
            disabled={inputText.length}
            value={inputText}
          >
          </textarea>
          :
          <Oval className="InputTextAreaSpinner" stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
        }
        <div className="InputTextButtonArea Flex Column">
          <button id="clear" type="button" onClick={handleTextAreaClear} disabled={!inputText.length || infoLoading}>Clear</button>
          <button id="submit" type="button" onClick={handleSubmitInputText} disabled={!validInputText || infoLoading}>Submit</button>
        </div>


      </div>

    </div>
  )
};

export default InputTextInterface;
