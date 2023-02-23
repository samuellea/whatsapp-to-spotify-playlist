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

function GoogleDocInterface({
  inputText,
  validInputText,
  handleChangeGoogleDriveFileTextArea,
  handleSubmitInputText,
  handleTextAreaClear,
  infoLoading,
}) {

  const [tokenClient, setTokenClient] = useState({});
  const [googleFileURL, setGoogleFileURL] = useState('');
  const [validationError, setValidationError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [getFileError, setGetFileError] = useState(false);

  useEffect(() => {
    /* global google */
    const SCOPES = "https://www.googleapis.com/auth/drive.file";

    const getGoogleDriveFile = async (accessToken) => {
      console.log(googleFileURL, ' <-- googleFileURL');
      console.log(accessToken, ' <-- accessToken');
      const googleDriveFileID = h.getIdFromGoogleDriveURL(googleFileURL);
      const getGoogleDriveResponse = await u.getGoogleDrive(googleDriveFileID, accessToken);
      if ([200, 201].includes(getGoogleDriveResponse.status)) {
        const { data } = getGoogleDriveResponse;
        console.log(data)
        // NOW, at this point, you could send data off to our backend endpoint for processing/parsing, keep the spinner spinning
        handleChangeGoogleDriveFileTextArea(data);
        setLoading(false);
      } else {
        setLoading(false);
        setGetFileError(true);
      };
    };

    //tokenClient
    setTokenClient(google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: SCOPES,
      callback: async (tokenResponse) => {
        console.log(tokenResponse)
        console.log(googleFileURL)
        // We now have a cces to al ive token to use for ANY google API (based on or SCOPES)
        if (tokenResponse && tokenResponse.access_token) {
          getGoogleDriveFile(tokenResponse.access_token)
        } else {
          setLoading(false);
          setGetFileError(true);
        }
      }
    }));

  }, [googleFileURL]);

  const handleChange = (e) => {
    if (validationError) setValidationError(false);
    console.log(e.target.value);
    setGoogleFileURL(e.target.value);
  }

  const handleSubmitGoogleFileURL = async () => {
    const googleDriveFileID = h.getIdFromGoogleDriveURL(googleFileURL);
    console.log(googleDriveFileID)
    if (!googleDriveFileID) return setValidationError(true);
    setLoading(true);
    tokenClient.requestAccessToken(); // this prompts user to sign-in with google
    // once they do that, the '.callback' func in SetTokenClient is called
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
      {
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
                  <button className="GoogleFileSubmitButton" type="button" onClick={handleSubmitGoogleFileURL} disabled={validationError}>Submit</button>
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
      }
    </div>
  )
};

export default GoogleDocInterface;
