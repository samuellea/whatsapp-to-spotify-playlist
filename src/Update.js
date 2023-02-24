import './styles/Update.css';
import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import YoutubeConversionInterface from './YoutubeConversionInterface';
import InputTextInterface from './InputTextInterface';
import FinalReviewInterface from './FinalReviewInterface';
import * as u from './utils';
import * as h from './helpers';
import { mockSleep } from './helpers';
import NoNew from './NoNew';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import GoogleDocInterface from './GoogleDocInterface';
// import { gapi } from 'gapi-script';
import ChooseInputMenu from './ChooseInputMenu';

function Update({ userPlaylistMetas }) {
  let history = useHistory();
  const params = new URLSearchParams(window.location.search);

  const spotifyPlaylistId = params.get('spotifyPlaylistId');
  const firebasePlaylistId = params.get('firebasePlaylistId');

  const playlistMetaInAppState = userPlaylistMetas.find(e => e.spotifyPlaylistId === spotifyPlaylistId);
  if (!playlistMetaInAppState) history.push('/');
  const firebaseMetaId = playlistMetaInAppState.metaId;

  const [spotifyPlaylistInState, setSpotifyPlaylistInState] = useState(null);
  const [inputText, setInputText] = useState('');
  const [firebasePlaylistObj, setFirebasePlaylistObj] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [validInputText, setValidInputText] = useState(false);

  const [newPostsInState, setNewPostsInState] = useState([]); // <------------
  const [convertYoutubePosts, setConvertYoutubePosts] = useState({ youtubePosts: [], spotifyMatches: [] }) // <------------

  // const [screen, setScreen] = useState('input');
  const [screen, setScreen] = useState('choose');
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [newPostsRawStored, setNewPostsRawStored] = useState([]);

  const firebaseUserId = localStorage.getItem('firebaseUserId');
  const token = localStorage.getItem('token');
  const spotifyToken = localStorage.getItem('spotifyToken');

  useEffect(() => {
    /*
    const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    console.log(GOOGLE_API_KEY);
    console.log(GOOGLE_CLIENT_ID);
    // const SCOPES = "https://www.googleapis.com/auth/documents.readonly";
    const SCOPES = "https://www.googleapis.com/auth/drive.file";
    function start() {
      console.log(gapi);
      console.log(gapi.client)
      gapi.client.init({
        apiKey: GOOGLE_API_KEY,
        clientId: GOOGLE_CLIENT_ID,
        scope: SCOPES,
      })
    };
    gapi.load('client:auth2', start);
    */

    if (!spotifyPlaylistId || !firebasePlaylistId) return history.push('/');

  }, []);

  useEffect(() => {
    setInfoLoading(true);
    const inputTextIsValid = h.inputTextIsValid(inputText);
    setValidInputText(inputTextIsValid);
    setInfoLoading(false);
  }, [inputText]);

  const handleGoBack = () => {
    if (screen === 'choose' || screen === 'youtube' || screen === 'nonew' || screen === 'review') history.goBack();
    if (screen === 'google' || screen === 'input') setScreen('choose');
  };

  const handleChangeTextArea = (e) => {
    // const inputTextNoLineBreaks = e.target.value.replace(/(\r\n|\n|\r)/gm, " "); // <-- this regex was REALLY slow! c. 50 seconds this way vs. c. 5 seconds below!
    // setInputText(inputTextNoLineBreaks);


    const inputTextReplaceOne = e.target.value.replace('\n', " ");
    const inputTextReplaceTwo = inputTextReplaceOne.replace('\r', " ");
    const inputTextReplaceThree = inputTextReplaceTwo.replace('\r\n', " ");
    setInputText(inputTextReplaceThree);

    // setInfoLoading(false);
  };

  const handleChangeGoogleDriveFileTextArea = (googleDriveFileText) => {
    // const inputTextNoLineBreaks = googleDriveFileText.replace(/(\r\n|\n|\r)/gm, " "); // <-- this regex was REALLY slow! c. 50 seconds this way vs. c. 5 seconds below!
    // setInputText(inputTextNoLineBreaks);

    const inputTextReplaceOne = googleDriveFileText.replace('\n', " ");
    const inputTextReplaceTwo = inputTextReplaceOne.replace('\r', " ");
    const inputTextReplaceThree = inputTextReplaceTwo.replace('\r\n', " ");
    setInputText(inputTextReplaceThree);

    // setInfoLoading(false);
  };

  const handleTextAreaClear = () => {
    setInputText('');
  }

  /* 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️  */
  const handleSubmitInputText = async () => {
    setInfoLoading(true);
    const { data: spotifyPlaylistData, status } = await u.getSpotifyPlaylist(spotifyPlaylistId, spotifyToken);
    if (status === 200) setSpotifyPlaylistInState(spotifyPlaylistData);
    // pull down the Firebase object for this playlist
    u.getFirebasePlaylist(spotifyPlaylistId, token).then(async ({ status, data }) => {
      if ([200, 201].includes(status)) {
        // TO-DO: handle data being returned but empty?
        const [firebasePlaylistId, playlistObj] = Object.entries(data)[0];
        // set the firebase playlist object returned from firebase in state, for later access by other functions.
        setFirebasePlaylistObj({ firebasePlaylistId, playlistObj });

        const { rawPostsLog = [], processedPostsLog = [] } = playlistObj;

        console.log(inputText);
        console.log(rawPostsLog);

        // determine new posts by comparing input text's posts with .rawPosts
        const newPostsRaw = h.findInputTextNewPosts(inputText, rawPostsLog);
        console.log(newPostsRaw)

        // if there ARE no new posts found from the input text, feedback to user.
        if (!newPostsRaw.length) {
          console.log('fish')
          setInfoLoading(false);
          return setScreen('nonew');
        };

        // first, get all the Spotify Data for all .linkType = 'spotify' posts
        const justNewSpotifyPosts = newPostsRaw.filter(e => e.linkType === 'spotify'); // these are just Spotify TRACKs! (not playlists or albums)
        const newSpotifyPostsCompleteData = await u.getSpotifyTrackData(justNewSpotifyPosts, spotifyToken);
        if (!newSpotifyPostsCompleteData) {
          console.log('Spotify API server error when trying to fetch data for Spotify tracks!');
          toast(`Couldn't fetch data for Spotify tracks - Spotify API server error. Please try again later`, { duration: 2000 })
          await mockSleep(2000)
          return history.push(`/`);
        } else {
          // // ❓❓❓❓ check newSpotifyPostsCompleteData
          // whether YT posts are found and processed or not, set new posts in state so they can be accessed later by our submission function.
          setNewPostsInState(newSpotifyPostsCompleteData)

          // second, handle any .linkType = 'youtube' posts
          const youtubePosts = [...newPostsRaw.filter(e => e.linkType === 'youtube')];
          // console.log('🔍 🔍 🔍 🔍 🔍 🔍 🔍 🔍 🔍 🔍 🔍 🔍 🔍 🔍 🔍 🔍 ')
          // console.log('youtubePosts just prior to going and finding possible Spotify matches')
          // console.log(youtubePosts)

          // if any youtube posts in chat, find the closest matching results for these on spotify
          if (youtubePosts.length) {
            const youtubeApiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
            const { videoDataObjs, spotifyDataObjs } = await u.getYoutubeVideosAndClosestSpotifyMatches(youtubePosts, youtubeApiKey, spotifyToken);
            // console.log('❗ ❗ ❗ ❗ ❗ ❗ ❗ ❗ ❗ ❗ ❗ ❗ ❗ ❗ ❗ ❗ ')
            // console.log('videoDataObjs + spotifyDataObjs ater finding possible Spoti matches for YT vids')
            // console.log({ videoDataObjs, spotifyDataObjs })
            // even when a GET for YT vid data returned a deleted/private vid, we still returned a corresponding SpotifyDataObj value
            // of null. This is to preserve the array length so as not to mess with index-based referencing when re-making arrays.
            // Now, we need to turn any 'null's in spotifiyDataObjs into an empty obj with a single .include key of 'false'
            const spotifyDataObjsHandlingNulls = spotifyDataObjs.map(e => !e ? { include: false } : e);
            setConvertYoutubePosts({ youtubePosts: videoDataObjs, spotifyMatches: spotifyDataObjsHandlingNulls });
            // setInputText('');
            setScreen('youtube');
            setInfoLoading(false);
          } else {
            // setInputText('');
            setScreen('review');
            setInfoLoading(false);
          }
        }
      } else {
        // handle error getting this playlist from firebase - server error, bad request, 
      }
    }).catch(e => console.log(e))
  }
  /* 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️ 🖊️  */


  const handleConvertedPosts = (convertedPosts) => {
    // console.log('---------------------------------------')
    // console.log('convertedPosts coming up out from YoutubeConversionInterface:')
    // console.log(convertedPosts)
    // console.log('---------------------------------------')
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    // console.log('convertYoutubePosts as stored up in Update state (originals, before YTConversionInterface modified them')
    // console.log(convertYoutubePosts)
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    // mix convertedPosts with the spotify-type posts already in newPostsInState
    const combinedAndSortedSpotifyAndYoutubePosts = newPostsInState.concat(convertedPosts).sort((a, b) => (a.postId > b.postId) ? 1 : -1);
    setNewPostsInState(combinedAndSortedSpotifyAndYoutubePosts);
    setScreen('review');
  }


  /* 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩  */
  const handleFinalSubmission = async (trackIDs) => {
    setInfoLoading(true);
    const { firebasePlaylistId, playlistObj } = firebasePlaylistObj;
    const { rawPostsLog = [], processedPostsLog = [] } = playlistObj;



    const newPostsRaw = h.findInputTextNewPosts(inputText, rawPostsLog);
    console.log(newPostsRaw, ' <-- newPostsRaw') // this will have our 'spotifyAlbum' and 'spotifyPlaylist' .linkType posts included

    // get album info for any Spotify albums posted, and map onto those 'spotifyAlbum'-type posts in newPostsRaw
    const albumTypePosts = newPostsRaw.filter(e => e.linkType === 'spotifyAlbum');
    const spotifyAlbumsData = await u.getSpotifyAlbumsData(albumTypePosts, spotifyToken);
    if (!spotifyAlbumsData) {
      setInfoLoading(false);
      setSubmissionSuccess(false);
      console.log('Spotify API server error when trying to fetch data for Albums in chat!');
      return;
    }
    spotifyAlbumsData.forEach(obj => {
      const indexOfCorrespondingRawPostObj = newPostsRaw.findIndex(e => e.linkType === 'spotifyAlbum' && e.linkID === obj.linkID);
      newPostsRaw[indexOfCorrespondingRawPostObj] = {
        ...newPostsRaw[indexOfCorrespondingRawPostObj],
        artists: obj.artists,
        thumbnailSmall: obj.thumbnailSmall,
        thumbnailMed: obj.thumbnailMed,
        title: obj.title,
        totalTracks: obj.totalTracks,
      }
    });

    // get playlist info for any Spotify playlists posted, and map onto those 'spotifyPlaylist'-type posts in newPostsRaw
    const playlistTypePosts = newPostsRaw.filter(e => e.linkType === 'spotifyPlaylist');
    console.log(playlistTypePosts, ' <--- playlistTypePosts')
    const spotifyPlaylistsData = await u.getSpotifyPlaylistsData(playlistTypePosts, spotifyToken);
    if (!spotifyPlaylistsData) {
      setInfoLoading(false);
      setSubmissionSuccess(false);
      console.log('Spotify API server error when trying to fetch data for Playlists in chat!');
      return;
    }

    spotifyPlaylistsData.forEach(obj => {
      console.log('???????')
      console.log(obj)
      if (obj) { // !== null (ie. playlist data WAS found for it this playlist type post obj...)
        const indexOfCorrespondingRawPostObj = newPostsRaw.findIndex(e => e.linkType === 'spotifyPlaylist' && e.linkID === obj.linkID);
        console.log(newPostsRaw[indexOfCorrespondingRawPostObj])
        console.log('........')
        newPostsRaw[indexOfCorrespondingRawPostObj] = {
          ...newPostsRaw[indexOfCorrespondingRawPostObj],
          thumbnailSmall: obj.thumbnailSmall,
          thumbnailMed: obj.thumbnailMed,
          title: obj.title,
          totalTracks: obj.totalTracks,
          owner: obj.owner,
        }
      }
    });

    // scrape genres for each spotify track
    const newPostsInStatePlusGenres = await u.getGenresForSpotifyTracks(newPostsInState, spotifyToken);
    if (!newPostsInStatePlusGenres) {
      setInfoLoading(false);
      setSubmissionSuccess(false);
      console.log('Spotify API server error when trying to fetch Genres');
      return;
    }

    const newPostsInStateMinusUnnecessaryKeys = [...newPostsInStatePlusGenres]
    newPostsInStateMinusUnnecessaryKeys.forEach(e => delete e.postId);

    // create updated version of rawPostsLog and processedPostsLog with all the newly-found
    // and newly-processed posts, in order to then send off to FB.
    const updatedRawPosts = [...rawPostsLog, ...newPostsRaw];
    const updatedPosts = [...(processedPostsLog || []), ...newPostsInStateMinusUnnecessaryKeys];

    // youtube posts will have been manually excluded by user if flagged as a Youtube post that may be able to be converted,
    // but no corresponding Spotify track could be found. In which case, the user will click to exclude that Youtube post.
    // However, we want to hang on to the retrieved data for these excluded Youtube videos all the same, because we
    // want to include as part of the FB .rawPostsLog, so we can display these excluded YT videos to the user on the Stats page!
    const excludedYoutubePosts = convertYoutubePosts.youtubePosts.reduce((acc, e) => {
      if (!e) return acc;
      if (!updatedPosts.some(obj => obj.linkType === 'youtube' && obj.linkID === e.youtubeID)) acc.push(e)
      return acc;
    }, []);

    // modify updatedRawPosts, adding .title and .thumbnail of any *excluded* YT posts to their corresponding rawPosts objects
    excludedYoutubePosts.forEach(obj => {
      const indexOfCorrespondingRawPostObj = updatedRawPosts.findIndex(e => e.linkType === 'youtube' && e.linkID === obj.youtubeID);
      updatedRawPosts[indexOfCorrespondingRawPostObj] = {
        ...updatedRawPosts[indexOfCorrespondingRawPostObj],
        thumbnail: obj.thumbnail,
        title: obj.title,
      }
    });

    console.log(updatedRawPosts)

    const updatedPlaylistObj = {
      ...playlistObj,
      rawPostsLog: updatedRawPosts,
      processedPostsLog: updatedPosts,
    };

    // POST our updatedPlaylistObj off to FB.
    const firebaseStatus = await u.createOrUpdateFirebasePlaylist('PATCH', firebaseUserId, token, updatedPlaylistObj, firebasePlaylistId);
    // POST our new tracks to the Spotify playlist.
    const spotifyStatus = await u.postToSpotifyPlaylist(spotifyPlaylistId, spotifyToken, trackIDs) // <--- POSTING TRACKS TO SPOTIFY!!

    if ([200, 201].includes(firebaseStatus) && [200, 201].includes(spotifyStatus)) {
      setInfoLoading(false);
      console.log('SUCCESS!')
      setSubmissionSuccess(true);
    } else {
      setInfoLoading(false);
      setSubmissionSuccess(false);
      console.log('failure updating playlist - firebase or spotify')
    }
  }
  /* 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩 📩  */


  const screenToRender = () => {
    if (infoLoading) return (
      <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} style={{ margin: 'auto auto' }} />
    );

    if (screen === 'choose') {
      return (
        <ChooseInputMenu setScreen={setScreen} handleTextAreaClear={handleTextAreaClear} />
      )
    }


    if (screen === 'google') {
      return (
        <GoogleDocInterface
          inputText={inputText}
          validInputText={validInputText}
          handleChangeGoogleDriveFileTextArea={handleChangeGoogleDriveFileTextArea}
          handleSubmitInputText={handleSubmitInputText}
          handleTextAreaClear={handleTextAreaClear}
          infoLoading={infoLoading}
          setInfoLoading={setInfoLoading}
        />
      )
    }

    if (screen === 'input') {
      return (
        <InputTextInterface
          inputText={inputText}
          validInputText={validInputText}
          handleChangeTextArea={handleChangeTextArea}
          handleSubmitInputText={handleSubmitInputText}
          handleTextAreaClear={handleTextAreaClear}
          infoLoading={infoLoading}
        />
      )
    }
    if (screen === 'nonew') {
      return (
        <NoNew />
      )
    }
    if (screen === 'youtube') {
      return (
        <YoutubeConversionInterface
          convertYoutubePosts={convertYoutubePosts}
          handleConvertedPosts={handleConvertedPosts}
        />
      )
    }
    if (screen === 'review') {
      return (
        <FinalReviewInterface
          firebasePlaylistObj={firebasePlaylistObj.playlistObj}
          spotifyPlaylistObj={spotifyPlaylistInState}
          newPosts={newPostsInState}
          handleFinalSubmission={handleFinalSubmission}
          submissionSuccess={submissionSuccess}
          firebaseMetaId={firebaseMetaId}
        />
      )
    }


  };


  return (
    <div className="Update Flex Column">
      <div className="UpdateGoBackContainer Flex">
        <button className="Flex Row" type="button" onClick={handleGoBack}>
          <FontAwesomeIcon id="GoBack" icon={faArrowLeft} pointerEvents="none" />
          <span>Back</span>
        </button>
      </div>

      <div className="InfoArea Flex Column">
        {screenToRender()}
        <Toaster />
      </div>

    </div>
  )
};


export default Update;
