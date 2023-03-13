import React, { useState, useEffect } from 'react';
import useDrivePicker from 'react-google-drive-picker'
import { useGoogleLogin } from '@react-oauth/google';
import * as u from './utils';
import { mockSleep } from './helpers';

function GooglePicker({ gTokenInState, setGTokenInState, setGetFileError }) {
  const [openPicker, authResponse] = useDrivePicker();

  useEffect(() => {
    console.log(gTokenInState, ' <-- gTokenInState in GooglePicker')
  }, [gTokenInState])

  const handleOpenPicker = (accessToken) => {
    console.log('handleOpenPicker ***')
    openPicker({
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      developerKey: process.env.REACT_APP_GOOGLE_API_KEY,
      // token: accessToken, // 
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      customScopes: ['https://www.googleapis.com/auth/drive.file'],
      // customViews: customViewsArray, // custom view
      callbackFunction: async (data) => {
        if (data.action === 'cancel') {
          console.log('User clicked cancel/close button')
        }
        console.log(data)

        if (data.docs) {
          const googleDriveFileID = data.docs[0].id;
          console.log(googleDriveFileID, ' <-- googleDriveFileID in GooglePicker')
          const getGoogleDriveResponse = await u.getGoogleDriveFile(googleDriveFileID, accessToken);
          if ([200, 201].includes(getGoogleDriveResponse.status)) {
            const { data } = getGoogleDriveResponse;
            console.log(data)
          } else {
            console.log("UH OH")
          };

        }
      },
    });

  }

  const handleLoginSuccess = async (tokenResponse) => {
    console.log(tokenResponse);
    if (tokenResponse && tokenResponse.access_token) {
      console.log('YES!');
      console.log(tokenResponse.access_token);
      console.log('---------------')
      // window.localStorage.setItem('gToken', tokenResponse.access_token);
      setGTokenInState(tokenResponse.access_token);
    } else {
      setGetFileError(true); // 🚫
    }
  };

  const login = useGoogleLogin({
    ux_mode: 'redirect',
    redirect_uri: 'http://localhost:3000',
    scope: 'https://www.googleapis.com/auth/drive.file',
    onSuccess: tokenResponse => handleLoginSuccess(tokenResponse),
    onError: () => {
      console.log('🚫')
      setGetFileError(true)
    },
    onNonOAuthError: () => {
      console.log('🚫 🚫')
      setGetFileError(true)
    },
  });


  const handleStartGoogle = () => {
    if (!gTokenInState) {
      login();
    } else {
      handleOpenPicker(gTokenInState);
    };
  };

  return (
    <div>
      {!gTokenInState ?
        <button onClick={() => handleStartGoogle()}>Sign In to Google</button>
        : <button onClick={() => handleOpenPicker(gTokenInState)}>Open Picker</button>
      }
    </div>
  );
};

export default GooglePicker;


