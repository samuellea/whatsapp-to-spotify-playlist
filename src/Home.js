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

        <textarea style={{ maxHeight: '50px' }} value={`
        08/04/2020, 22:45 - Ben Belward: <Media omitted>
        09/04/2020, 10:45 - Johnny Ratcliffe: <Media omitted>
        09/04/2020, 11:41 - Johnny Ratcliffe: <Media omitted>
        09/04/2020, 19:26 - +44 7788 257647: Wait, you’ve got TIMBALAND round your house???
        
        https://youtu.be/QgwQB5a8920
        11/04/2020, 14:28 - +44 7788 257647: Wait, where did dubstep go?
        11/04/2020, 14:59 - Sam Lea: It's always in the last place you left it
        11/04/2020, 15:00 - Sam Lea: https://www.youtube.com/watch?v=q9_jXaGX708
        11/04/2020, 15:08 - Johnny Ratcliffe: It’ll always be in the last place you look when you find it
        11/04/2020, 17:19 - +44 7788 257647: <Media omitted>
        14/04/2020, 18:28 - Johnny Ratcliffe: <Media omitted>
        16/04/2020, 22:15 - +44 7788 257647: <Media omitted>
        16/04/2020, 22:54 - Johnny Ratcliffe: https://www.youtube.com/watch?v=wuCK-oiE3rM
        16/04/2020, 22:55 - Johnny Ratcliffe: Croatia 2k10 with the lads
        16/04/2020, 22:55 - Johnny Ratcliffe: Linen shirts, boat shoes, stubbies and puss
        16/04/2020, 23:49 - +44 7788 257647: *putsch
        17/04/2020, 14:18 - Sam Lea: <Media omitted>
        17/04/2020, 14:18 - Sam Lea: a story in three acts
        24/04/2020, 20:15 - Johnny Ratcliffe: <Media omitted>
        24/04/2020, 21:47 - +44 7788 257647: <Media omitted>
        24/04/2020, 22:40 - Johnny Ratcliffe: Here’s a song for you… Spanish Dance No. 5 by Mantovani
        https://open.spotify.com/track/2OrD47vqXuRslFPJRBDwfi?si=KiXa3YBJTP2-frZ7As9yqg
        
        
        24/04/2020, 22:40 - Johnny Ratcliffe: Here’s a song for you… Spanish Dance No. 5 by Mantovani
        https://open.spotify.com/track/2OrD47vqXuRslFPJRBDwfi?si=KiXa3YBJTP2-frZ7As9yqg
        01/05/2020, 20:32 - +44 7788 257647: <Media omitted>
        01/05/2020, 20:32 - Johnny Ratcliffe: <Media omitted>
        01/05/2020, 20:33 - Johnny Ratcliffe: <Media omitted>
        01/05/2020, 20:33 - Johnny Ratcliffe: <Media omitted>
        01/05/2020, 20:34 - Johnny Ratcliffe: Last one was Ben
        01/05/2020, 20:35 - Johnny Ratcliffe: <Media omitted>
        01/05/2020, 21:39 - Johnny Ratcliffe: Is this a hoax?
        01/05/2020, 22:59 - Johnny Ratcliffe: <Media omitted>
        01/05/2020, 23:43 - Sam Lea: <Media omitted>
        01/05/2020, 23:45 - +44 7788 257647: “choons”
        01/05/2020, 23:47 - Sam Lea: Erykah Baduh Guided Meditation
        02/05/2020, 23:23 - +44 7788 257647: <Media omitted>
        07/05/2020, 16:47 - Ben Belward: hey fuckers
        07/05/2020, 16:47 - Ben Belward: https://www.youtube.com/watch?v=BORwhLvPgD8 ******************************
        07/05/2020, 16:47 - Ben Belward: https://youtu.be/TEXZSzPpZqo
        07/05/2020, 16:50 - Johnny Ratcliffe: <Media omitted>
        07/05/2020, 16:57 - Ben Belward: aaaaallluuuuuuh
        07/05/2020, 16:57 - Johnny Ratcliffe: <Media omitted>
        20/05/2020, 18:20 - +44 7788 257647: As polycules come out to play in ally pally, slack lines poking out of their huckletree tote, a few songs to celebrate the sun, and it’s life-giving powers:
        
        https://open.spotify.com/playlist/73LFLxYf6kf6IOIBTVWMPJ?si=2DzfFl21Qym1K3xgWZgCTw
        
        This one’s for all the steppers.
        21/05/2020, 09:04 - Johnny Ratcliffe: <Media omitted>
        21/05/2020, 09:14 - Ben Belward: Nice R Kelly quote bro
        21/05/2020, 09:15 - Ben Belward: Oh I see you’ve lifted a few Knxledge samples
        21/05/2020, 09:15 - Ben Belward: Edgy!
        21/05/2020, 09:15 - Ben Belward: Wings! Yay!
        21/05/2020, 09:56 - Ben Belward: <Media omitted>
        21/05/2020, 09:57 - Sam Lea: _That_ is an _absolute *Benson*_
        21/05/2020, 10:50 - Ben Belward: <Media omitted>
        21/05/2020, 11:06 - +44 7788 257647: Who dat?
        21/05/2020, 11:08 - Sam Lea: https://www.youtube.com/watch?v=BJuXDF-MgN4
        21/05/2020, 11:11 - Sam Lea: though for _my_ monopoly money, he's better on his own...
        21/05/2020, 11:11 - Sam Lea: https://open.spotify.com/track/6tXmaJoCBeo2w0OzN1Ufag?si=VYECIyMWQruiDfHMEKasYw
        21/05/2020, 11:20 - Ben Belward: Oh Sam
        21/05/2020, 11:20 - Ben Belward: You’ve fallen right into the neggy Sarlacc pit I’m afraid...
        21/05/2020, 12:48 - Ben Belward: <Media omitted>
        21/05/2020, 13:02 - Johnny Ratcliffe: <Media omitted>
        21/05/2020, 13:52 - +44 7788 257647: <Media omitted>
        21/05/2020, 13:58 - Sam Lea: Fa-yeh in the booth
        21/05/2020, 18:22 - Johnny Ratcliffe: Quick sundowner session at Waterlow if anyone fancies
        21/05/2020, 18:22 - Ben Belward: On my way!
        21/05/2020, 18:22 - Ben Belward: Sorry wrong thread
        21/05/2020, 18:22 - Johnny Ratcliffe: 🤣
        21/05/2020, 18:22 - Ben Belward: NO I’M ACTUALLY COMING
        21/05/2020, 18:22 - Johnny Ratcliffe: Reply all and BCC Matthew in Northern Folk
        21/05/2020, 18:35 - Johnny Ratcliffe: Bring your cigarettes
        24/05/2020, 18:31 - Sam Lea: In Wideboys feat. Dennis G's seminal "Sambuca", what is meant by 'a lyrical dan'
        24/05/2020, 18:31 - Sam Lea: Are Dans above-average lyrical? Or below?
        24/05/2020, 18:32 - Ben Belward: <Media omitted>
        28/05/2020, 18:39 - Johnny Ratcliffe: https://open.spotify.com/track/4TFtYsNd37rqc3rtYHM267?si=AsVuPxjxR86NzvLXpdyoRg
        
        New Moby Album.
        
        One of the better tracks.
        28/05/2020, 19:36 - +44 7788 257647: https://open.spotify.com/track/0PkFYR7jFtyJR2k0MomOaI?si=VNjDSoVES6-H98wK8QSAoQ
        28/05/2020, 19:45 - Sam Lea: more
        29/05/2020, 12:18 - Sam Lea: https://www.crowdfunder.co.uk/save-the-jazz-cafe
        29/05/2020, 12:18 - Sam Lea: whaddawe reckon lads
        29/05/2020, 12:19 - Sam Lea: The idea is you buy tickets now redeemable for future events so they have the cashflow to pay current overheads. Looks like they're a bit buggered otherwise...
        29/05/2020, 12:19 - Johnny Ratcliffe: Yep
        30/05/2020, 13:21 - Ben Belward: Here’s a song for you… Only One by James Taylor
        https://open.spotify.com/track/05re487C0a3bJNZnPfDqMp?si=7IpsCBB6SAy-46V_T7Qx9w
        
        
        14/09/2020, 14:59 - Ben Belward: guys, does anyone know what the song in the background of this is? 
        
        
        https://www.youtube.com/watch?v=X6l1MLMLZ8M
        15/09/2020, 13:34 - Ben Belward: https://open.spotify.com/track/1gqk2dawfdLdn4XamF27cx?si=_cEsXGtqQcK5QlbVsSyC_w
        15/09/2020, 18:32 - +44 7788 257647: _Beaut weekend climbing the O2 with these lovelies_
        16/09/2020, 10:06 - Ben Belward: Shared on the Belward family chat this morn
        
        https://open.spotify.com/track/7wSj4FQxskWcmNPdHFVLkU?si=dxtlXWWlTJieolAO0QDfaQ
        17/09/2020, 11:18 - Ben Belward: <Media omitted>
        17/09/2020, 19:29 - Johnny Ratcliffe: “It’s like catching lightning.
        The chances of finding someone like you. 
        It’s one in a million, the chances to feeling the way we do.”
        
        A year ago today my wonderfull wifey @Janette and me redid our vowels to this song. Love you babe xx
        
        
        
        Here’s a song for you… May I Have This Dance - EMBRZ Remix by Meadowlark
        https://open.spotify.com/track/5RJTUwGmseVONMulYQc04C?si=dCbOBaZRSNybD73b3fEVWg
        17/09/2020, 19:31 - Johnny Ratcliffe: <Media omitted>
        17/09/2020, 23:13 - Sam Lea: Where's this from??
        19/09/2020, 10:22 - +44 7788 257647: <Media omitted>
        19/09/2020, 15:53 - +44 7788 257647: <Media omitted>
        20/09/2020, 19:09 - +44 7788 257647: <Media omitted>
        21/09/2020, 17:24 - Johnny Ratcliffe: Here’s an album for you… A Hero's Death by Fontaines D.C.
        https://open.spotify.com/album/5uvoX0fFiT1QFpZXntsI3j?si=kwjehdY1QjSLVFoR2LrQZw
        24/09/2020, 19:00 - Johnny Ratcliffe: <Media omitted>
        24/09/2020, 19:01 - Sam Lea: They don't make 'em like that any more
        24/09/2020, 19:05 - Johnny Ratcliffe: You're not not right
        24/09/2020, 19:06 - Johnny Ratcliffe: Curry at the Shalimar later, Sam?
        24/09/2020, 19:06 - Sam Lea: Reminiscing over mixed meat bhunas of old
        24/09/2020, 19:15 - Sam Lea: <Media omitted>
        24/09/2020, 19:29 - Johnny Ratcliffe: I'll take that as a NO then
        24/09/2020, 19:30 - Sam Lea: I woulda, I've just had a salmon supper with Rob and Alison
        29/09/2020, 09:03 - Ben Belward: guys, could we all give it up for Tanner please? Wait to 1:52 https://www.youtube.com/watch?v=YxmhpCevGMg
        
        
        25/02/2022, 18:33 - +44 7788 257647: https://open.spotify.com/track/0Rv6i40Z4y2NdEb6ybOB0o?si=6LzBVKGdTdyuuBxvomGC2g
        25/02/2022, 18:44 - +44 7788 257647: Quatre langues, c’est pas mal
        28/02/2022, 12:01 - Johnny Ratcliffe: <Media omitted>
        28/02/2022, 13:14 - Sam Lea: Roll over Ben-thoven!
        28/02/2022, 14:04 - Ben Belward: Shall I get us lads all a ticket? 
        
        https://link.dice.fm/buiBBeE70nb
        28/02/2022, 14:45 - Sam Lea: Choons outing
        28/02/2022, 15:17 - Johnny Ratcliffe: Ye
        28/02/2022, 15:22 - Sam Lea: 👍
        28/02/2022, 20:54 - +44 7788 257647: Aaandrew
        28/02/2022, 20:54 - +44 7788 257647: Anddd 1 4 me plz
        28/02/2022, 20:56 - Ben Belward: <Media omitted>
        28/02/2022, 20:58 - +44 7788 257647: Honestly…
        28/02/2022, 21:02 - Ben Belward: <Media omitted>
        02/03/2022, 16:33 - Johnny Ratcliffe: https://open.spotify.com/track/3A4cpTBPaIQdtPFb5JxtaX?si=0ATZEb76ST-J52eoP6jA_w
        02/03/2022, 16:33 - Johnny Ratcliffe: 👊 💦
        02/03/2022, 17:29 - Ben Belward: twista
        02/03/2022, 17:29 - Ben Belward: https://open.spotify.com/playlist/37i9dQZF1DX0AtsZ32JWUn?si=e4cd8dd83c054538
        02/03/2022, 18:17 - Ben Belward: <Media omitted>
        02/03/2022, 18:28 - Sam Lea: Sorry sir
        02/03/2022, 18:28 - Johnny Ratcliffe: When’s your house warming Sam?
        02/03/2022, 18:29 - Johnny Ratcliffe: Having the lads over for some tinnies?
        
        16/07/2022, 21:36 - Matthew Shribman: <Media omitted>
        16/07/2022, 23:09 - +44 7788 257647: <Media omitted>
        16/07/2022, 23:12 - +44 7788 257647: Club Med, the gift that keeps on giving https://open.spotify.com/album/1PBw30oj8VdileUpLUzhhS?si=n_2-l19IRYeRhK__1TJR_g
        
        
        
        
        
        18/01/2023, 18:42 - +44 7735 892966: https://open.spotify.com/track/5FqP8lzXGF86hpESwGPEct?si=619d9068e02f4cb4
        18/01/2023, 19:20 - +44 7735 892966: https://open.spotify.com/track/0yrprIEMM99mThlgrdewdw?si=b7487448e3c243dd
        20/01/2023, 10:35 - Sam Lea: <Media omitted>
        20/01/2023, 10:48 - Johnny Ratcliffe: https://www.instagram.com/reel/CnmVperKabC/?igshid=MDJmNzVkMjY=
        20/01/2023, 12:32 - Sam Lea: whispy boi
        20/01/2023, 18:31 - +44 7735 892966: Fresh in from _Bede_:
        
        https://open.spotify.com/track/0NHMIpUN5tk0zbHNvkIiav?si=aac1356015354959
        20/01/2023, 18:52 - Ben Belward: <Media omitted>
        21/01/2023, 02:30 - Johnny Ratcliffe: https://open.spotify.com/track/5ZQ2slXNqImBi0SdomcjYN?si=I2ImQ6thQPia0wzWOIqeJA
        21/01/2023, 02:31 - Johnny Ratcliffe: I quite like this. Now in this very moment.
        21/01/2023, 04:13 - +44 7788 257647: You klubbing, Johnny?
        21/01/2023, 14:30 - +44 7788 257647: This is a Mac Tribute Chat, isn’t it?
        https://open.spotify.com/album/2Ao4brMpPgMyyuh9dPK4oK?si=hyttz5K7RUSWpjR-aC0xjA
        23/01/2023, 23:33 - +44 7735 892966: <Media omitted>
        26/01/2023, 13:40 - Johnny Ratcliffe: One for Ben
        
        https://open.spotify.com/track/3qNdddxA3KCQbgS73aWeca?si=250897489a654948
        27/01/2023, 16:33 - +44 7735 892966: https://open.spotify.com/track/6l8TmeqmjElMGn2XmlGTZz?si=fcc5ea0b902f4954        
        `}></textarea>

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
                      <button type="button" onClick={handleSubmitNewPlaylist} disabled={!newPlaylistName.length}>Create New Playlist</button>
                      <button type="button" onClick={handleCancelCreate}>Cancel</button>
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
