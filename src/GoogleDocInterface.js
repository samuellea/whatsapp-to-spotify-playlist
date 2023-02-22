import './styles/GoogleDocInterface.css';
import React, { useState, useEffect } from 'react';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import * as h from './helpers';
import * as u from './utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faWarning } from '@fortawesome/free-solid-svg-icons';
import { Oval } from 'react-loading-icons';
import GreenCircleRedCross from './GreenCircleRedCross';
// import { convertGoogleDocumentToJson, convertJsonToMarkdown } from './googleDocParser.js';

function GoogleDocInterface({
  inputText,
  validInputText,
  handleChangeGoogleDriveFileTextArea,
  handleSubmitInputText,
  handleTextAreaClear,
  infoLoading,
}) {
  const [googleLoginFailure, setGoogleLoginFailure] = useState(false);
  const [googleAccessToken, setGoogleAccessToken] = useState(null);
  const [googleFileURL, setGoogleFileURL] = useState('');
  const [validationError, setValidationError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getFileError, setGetFileError] = useState(false);

  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleGoogleLoginSuccess = (res) => {
    console.log('handleGoogleLoginSuccess! ', res.profileObj);
    const accessToken = gapi.auth.getToken().access_token;
    console.log(accessToken);
    setGoogleAccessToken(accessToken);
  };

  const handleGoogleLoginFailure = async (res) => {
    setGoogleLoginFailure(true);
  };

  const handleChange = (e) => {
    if (validationError) setValidationError(false);
    console.log(e.target.value);
    setGoogleFileURL(e.target.value);
  }

  const handleSubmitGoogleDoc = async () => {
    const googleDriveFileID = h.getIdFromGoogleDriveURL(googleFileURL);
    console.log(googleDriveFileID)
    if (!googleDriveFileID) return setValidationError(true);
    setLoading(true);
    const getGoogleDriveResponse = await u.getGoogleDrive(googleDriveFileID, googleAccessToken);

    if ([200, 201].includes(getGoogleDriveResponse.status)) {
      const { data } = getGoogleDriveResponse;
      handleChangeGoogleDriveFileTextArea(data);
      setLoading(false);
    } else {
      setLoading(false);
      setGetFileError(true);
    };
  };

  const handleTryAgain = () => {
    handleTextAreaClear();
    setValidationError(false);
    setGetFileError(false);
  };

  const inputTextInfo = () => {
    if (!validationError) return (
      <>
        <span>Paste a Google Drive .txt file URL here</span>
        <span id="ExampleLink">eg. 'https://drive.google.com/file/d/1KRfX0fSl...' </span>
      </>
    )
    if (validationError) {
      return (
        <div className="InputTextWarning Flex Column">
          <span><FontAwesomeIcon icon={faWarning} pointerEvents="none" />This does not appear to be a valid Google Drive file URL</span>
        </div>
      );
    };
  }

  return (
    <div className="GoogleDocInterface Flex Column">
      {googleAccessToken ?
        loading ?
          <Oval stroke="#98FFAD" height={100} width={75} strokeWidth={6} />
          :
          getFileError ?
            <div className="GoogleErrorDisplayContainer">
              <div className="GoogleErrorGreenCircleContainer">
                <GreenCircleRedCross type="RedCross" height={125} />
              </div>
              <h1>Couldn't get Google Drive file</h1>
              <button className="GoogleFileSubmitButton" style={{ backgroundColor: '#66B06E' }} type="button" onClick={handleTryAgain} >Try Another File</button>
            </div>
            :
            !inputText ?
              <>
                <div className="GoogleInputTextInterfaceMessage Flex Column">{inputTextInfo()}</div>

                <div className="GoogleInputTextInterface Flex Column" style={{ height: '180px' }}>
                  <input className={`GoogleFileInput GoogleInputError-${validationError}`} type="text" onChange={handleChange} style={{ marginBottom: '10px' }} placeholder="Paste URL here"></input>
                  <button className="GoogleFileSubmitButton" type="button" onClick={handleSubmitGoogleDoc} disabled={validationError}>Submit</button>
                </div>
                <div className="InvisiBox" style={{ flex: 1 }} />

              </>
              :
              <div className="GoogleInputTextInterface Flex Column" style={{ flex: 1 }}>
                <textarea className="GoogleInputTextArea" name="w3review" onChange={handleChangeGoogleDriveFileTextArea} disabled value={inputText}></textarea>
                <div className="GoogleInputTextButtonArea Flex Column">
                  <button id="clear" type="button" onClick={handleTextAreaClear} disabled={!inputText.length || infoLoading}>Cancel</button>
                  <button id="submit" type="button" onClick={handleSubmitInputText} disabled={!validInputText || infoLoading}>Submit</button>
                </div>
              </div>

        :
        <div className="GoogleLogin Flex Column">
          {!googleLoginFailure ?
            <>
              <div className="LoginToGoogleText Flex Column">
                <span>Login To Google</span>
              </div>
              <GoogleLogin
                clientId={GOOGLE_CLIENT_ID}
                buttonText="Login"
                onSuccess={handleGoogleLoginSuccess}
                onFailure={handleGoogleLoginFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
              />
            </>
            :
            <div className="GoogleErrorDisplayContainer">
              <div className="GoogleErrorGreenCircleContainer">
                <GreenCircleRedCross type="RedCross" height={125} />
              </div>
              <h1>Couldn't log in to Google</h1>
              <h2 className="Message Failure">Please try again later</h2>
            </div>
          }

        </div>
      }
    </div>
  )
};

export default GoogleDocInterface;
