import './App.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import * as u from './utils';
import * as h from './helpers';
import PlaylistCard from './PlaylistCard';
import CreatePlaylistCard from './CreatePlaylistCard';
import Help from './Help';
import { Oval } from 'react-loading-icons';
import './styles/Home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight, faCircleQuestion, faCircleXmark, faClose, faQuestion, faQuestionCircle, faUserCircle, faCoffee, faCog } from '@fortawesome/free-solid-svg-icons';

import RecordSleeveIcon from './RecordSleeveIcon';

function Home({
  loggedIn,
  handleLogout,
  userPlaylistMetas,
  fetchAndSetFirebasePlaylistMetas,
  userPlaylistsLoading,
  appToast,
  spotifyUserDisplayName,
  showHelpTooltip,
  setShowHelpTooltip,
  showPrivacyPolicy,
  privacyPolicy,
  setModalBackdrop,
  showHelp,
  setShowHelp,
}) {
  // console.log(userPlaylistMetas)
  const history = useHistory();
  const token = localStorage.getItem('token');
  const spotifyToken = localStorage.getItem('spotifyToken');
  const firebaseUserId = localStorage.getItem('firebaseUserId');

  // console.log(token);
  // console.log(spotifyToken);
  // console.log(spotifyToken);

  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    const fontsArr = ['Raleway-Regular', 'Raleway-Bold', 'Raleway-Thin', 'Raleway-SemiBold']
    h.setLoadedFonts(fontsArr, setFontsLoaded);
    console.log(userPlaylistMetas)
  }, []);

  const [viewCreateModal, setViewCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [creatingNewPlaylist, setCreatingNewPlaylist] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [deleteUserLoading, setDeleteUserLoading] = useState(false);

  useEffect(() => {
    if (!privacyPolicy) setShowUserSettings(false);
  }, [privacyPolicy]);

  useEffect(() => {
    if (viewCreateModal === true) setModalBackdrop(true);
    if (viewCreateModal === false) setModalBackdrop(false);
  }, [viewCreateModal]);

  const newPlaylistSuccess = async (status) => {
    console.log(status, ' <--- status')
    if ([200, 201].includes(status)) {
      appToast('Playlist created!', { duration: 1500 })
      // pull down users playlists again, so we can display the newly-created playlist
      fetchAndSetFirebasePlaylistMetas();
    } else {
      appToast(`Couldn't create playlist.`, { duration: 2000 })
    }
  };

  const deletePlaylistSuccess = async (status) => {
    if ([200, 202, 204].includes(status)) {
      appToast('Playlist deleted', { duration: 1500 })
      // pull down users playlists again, so we can display the newly-created playlist
      fetchAndSetFirebasePlaylistMetas();
    } else {
      appToast(`Couldn't delete playlst. Please try again later`, { duration: 2000 })
    }
  };

  const logoutClicked = () => {
    handleLogout();
    history.push('/login')
    // window.location.reload()
  };

  const handleSubmitNewPlaylist = () => {
    setCreatingNewPlaylist(true)
    const spotifyUserId = window.localStorage.getItem('spotifyUserId');
    // create spotify playlist
    u.createSpotifyPlaylist(spotifyUserId, spotifyToken, newPlaylistName).then(({ status, data }) => {
      if ([200, 201].includes(status)) {
        const { id: spotifyPlaylistId, name: spotifyPlaylistName } = data;
        // create playlist object on the FB /playlists endpoint - doing this, if successful, should then trigger creation of metadata object
        const playlistData = {
          rawPostsLog: [],
          processedPostsLog: [],
          spotifyUserId: spotifyUserId,
          spotifyPlaylistId: spotifyPlaylistId,
          spotifyPlaylistName: spotifyPlaylistName,
        };

        u.createOrUpdateFirebasePlaylist('POST', firebaseUserId, token, playlistData).then((status) => {
          newPlaylistSuccess(status)
          setCreatingNewPlaylist(false);
          setNewPlaylistName('');
          setViewCreateModal(false);
        })
      } else {
        newPlaylistSuccess(status)
        setCreatingNewPlaylist(false);
        setNewPlaylistName('');
        setViewCreateModal(false);
        console.log('creating spotify playlist failed.')
      }
    });
  };

  const handleCancelCreate = () => {
    setNewPlaylistName('');
    setViewCreateModal(false);
  };

  const handlePlaylistNameChange = (e) => {
    setNewPlaylistName(e.target.value);
  };

  const alphabetizedMetas = (metasArr) => {
    return metasArr.sort((a, b) => a.spotifyPlaylistName.toLowerCase() > b.spotifyPlaylistName.toLowerCase() ? 1 : -1)
  };

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem('token');
    const firebaseUserId = localStorage.getItem('firebaseUserId');
    // console.log(token)
    let r = window.confirm(`Delete your account and all created playlists? This cannot be undone!`);
    if (r == true) {
      setDeleteUserLoading(true);
      const deleteAccount = await u.deleteAccountAndPlaylists(userPlaylistMetas, firebaseUserId, token);
      setDeleteUserLoading(false);
      appToast(`Your account was deleted successfully`, { duration: 2500 })
      if (deleteAccount === 200) return handleLogout();
      setDeleteUserLoading(false);
      appToast(`Something went wrong whilst deleting your account. Please try again, or contact the dev if the issue persists`, { duration: 2500 })
    }
  };

  return (

    <div className="HomeScreenLoggedInSpotify Flex Column" style={{ opacity: fontsLoaded ? 1 : 0 }}>
      <div className="HomeContainer Flex Column">

        <div className="HowToButtonContainer Flex Row" style={{
          backgroundColor: showHelpTooltip ? '#010102' : '#292B3E',
        }}>
          <button type="button" id="UserSettingsButton" onClick={() => setShowUserSettings(true)} style={{ opacity: showHelpTooltip ? 0.25 : 1 }}>
            <FontAwesomeIcon icon={faCog} pointerEvents="none" />
          </button>
          <button className="HelpButton" type="button" onClick={() => setShowHelp(true)}
            style={{
              backgroundColor: showHelpTooltip ? '#40435d' : '#2a2b3e',
            }}>?</button>
        </div>

        {showHelpTooltip ?
          <div className="HelpTooltipContainer Flex" style={{ animation: 'tooltipFadeIn 1s' }}>
            <div className="HelpTooltip Flex Column">
              <div className="HelpTooltipArrowContainer Flex Row">
                <div className="HelpTooltipArrowBox">
                  <div className="HelpTooltipArrow" />
                </div>
              </div>
              <div className="HelpTooltipBody Flex Column">
                Click the Help button whenever it appears on a page to see instructions!
                <button type="button" onClick={() => setShowHelpTooltip(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
          : null}

        {showUserSettings ?
          <div className="UserSettingsContainer Flex">
            {deleteUserLoading ?
              <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
              : <div className="UserSettings Flex Column">
                <div className="UserSettingsCloseContainer Flex Row">
                  <button type="button" id="UserSettingsCloseButton" onClick={() => setShowUserSettings(false)}>
                    <FontAwesomeIcon icon={faClose} pointerEvents="none" />
                  </button>
                </div>
                <span id="UserSettingsHeader">Privacy Policy</span>
                <span id="UserSettingsDescription">View our privacy policy <button id="UserSettingsPrivacyButton" onClick={() => showPrivacyPolicy(true)}>here</button></span>
                <span id="UserSettingsHeader">Delete User Account</span>
                <span id="UserSettingsDescription">Deleting your account permanently removes all your created playlists and playlist data from the app. This data will be unrecoverable.</span>
                <button type="button" id="DeleteAccountButton" onClick={handleDeleteAccount}>
                  Delete My Account
                </button>
              </div>}
          </div>
          : null}

        <div className="UserContainer Flex Row" style={{ opacity: showHelpTooltip ? 0 : 1 }}>
          <FontAwesomeIcon icon={faUserCircle} pointerEvents="none" />
          <div className="UsernameAndSignOut Flex Column">
            <span className={`Raleway-Regular Empty-${!spotifyUserDisplayName}`}>{spotifyUserDisplayName}</span>
            <div className="SignOutAndSettingsContainer Flex Row">
              <button type="button" onClick={logoutClicked}>
                sign out
                <FontAwesomeIcon icon={faArrowAltCircleRight} pointerEvents="none" />
              </button>
            </div>
          </div>
        </div>

        {
          <>
            <div className="HomePlaylistCardsContainer">
              {userPlaylistMetas?.length > 0 ?
                alphabetizedMetas(userPlaylistMetas).map((metaObj, i) => <PlaylistCard metaObj={metaObj} firebaseUserId={firebaseUserId} token={token} key={`card-${i}`} deletePlaylistSuccess={deletePlaylistSuccess} />)
                : userPlaylistsLoading ?
                  <Oval className="HomePlaylistCardsContainerSpinner" stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
                  : <div className="NoPlaylistsMessage Flex Column">
                    <RecordSleeveIcon fill='#646480' />
                    No playlists yet.
                  </div>}
            </div>

            <div className="HomeCreatePlaylistButtonContainer Flex Column">
              {userPlaylistsLoading ? null : <button type="button" onClick={() => setViewCreateModal(true)}>Create</button>}
            </div>

            <div className="InvisiBox" style={{ flex: 0.1 }} />

            {viewCreateModal ?
              <div className="HomeCreatePlaylistModalContainer Flex Column">
                <div className="HomeCreatePlaylistModal Flex Column">
                  {!creatingNewPlaylist ?
                    <div className="HomeCreatePlaylistModalContents Flex Column">
                      <input type="text" onChange={handlePlaylistNameChange} placeholder="Enter new playlist name"></input>
                      <button type="button" onClick={handleCancelCreate}>Cancel</button>
                      <button type="button" onClick={handleSubmitNewPlaylist} disabled={!newPlaylistName.length}>Create New Playlist</button>
                    </div> :
                    <Oval stroke="#98FFAD" height={100} width={100} strokeWidth={4} />
                  }
                </div>
              </div>
              : null}

            <div className="CreatePlaylistModalBackdrop" style={{ visibility: `${viewCreateModal ? 'visible' : 'hidden'}` }}>

            </div>
          </>
        }
        {showHelp ? <Help location="home" setShowHelp={setShowHelp} /> : null}

      </div>

    </div>

  );


}

export default Home;
