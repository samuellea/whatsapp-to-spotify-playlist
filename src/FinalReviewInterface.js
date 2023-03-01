import React, { useState, useEffect } from 'react';
import FinalReviewPost from './FinalReviewPost';
import { mockSleep } from './helpers';
import { useHistory } from "react-router-dom";
import './styles/FinalReviewInterface.css';
import FontFaceObserver from 'fontfaceobserver';
import * as h from './helpers';
import GreenCircleRedCross from './GreenCircleRedCross';

function FinalReviewInterface({
  firebasePlaylistObj,
  spotifyPlaylistObj,
  newPosts,
  handleFinalSubmission,
  submissionSuccess,
  firebaseMetaId,
}) {
  let history = useHistory();

  const [fontsLoaded, setFontsLoaded] = useState(false)
  useEffect(() => {
    const fontsArr = ['Raleway-Regular', 'Raleway-Bold', 'Raleway-Thin', 'Raleway-SemiBold']
    h.setLoadedFonts(fontsArr, setFontsLoaded)
  }, []);

  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  const { processedPostsLog, spotifyPlaylistId, spotifyPlaylistName } = firebasePlaylistObj;

  useEffect(() => {
    if (submissionSuccess !== null && submissionSuccess) {
      setSubmissionFeedback('success')
      mockSleep(2500).then(() => history.push(`/stats?spotifyPlaylistId=${spotifyPlaylistId}&firebaseMetaId=${firebaseMetaId}`)); // NEED FIREBASEMETAID!
    };
    if (submissionSuccess !== null && !submissionSuccess) {
      setSubmissionFeedback('failure')
      mockSleep(2500).then(() => history.push(`/`));
    };
  }, [submissionSuccess]);

  const finalTrackIDs = newPosts.map(e => e.spotifyTrackID);

  const onFinalCancel = () => {
    let r = window.confirm(`Sure you want to cancel? Any conversions / changes will be lost`);
    if (r == true) {
      history.push(`/`);
    }
  };

  const onFinalClick = () => {
    let r = window.confirm(`Update Spotify playlist with these tracks?`);
    if (r == true) {
      handleFinalSubmission(finalTrackIDs);
    }
  };

  const screenToRender = () => {
    // console.log(processedPostsLog)
    const firebasePLAndSpotifyPLInSync = processedPostsLog?.length || 0 === spotifyPlaylistObj.tracks.total;

    if (!submissionFeedback) {
      return (
        <div className="FinalReviewInterfaceContainer Flex Column" style={{ opacity: fontsLoaded ? 1 : 0 }}>
          <>
            <div className="FinalReviewInterfaceHeaders">
              <h1>{spotifyPlaylistName}</h1>
              <h2><span>{processedPostsLog?.length || 0}</span> tracks</h2>
              <h3>Spotify: {spotifyPlaylistObj.tracks.total} tracks <span>{firebasePLAndSpotifyPLInSync ? '✅' : '⚠️'}</span></h3>

              <div className="FinalReviewHeader Flex Row">
                <span>{newPosts.length}</span>
                <span>new tracks will be added -</span>
              </div>
            </div>

            <div className="FinalReviewControlsContainer Flex Column">
              <div className="FinalReviewPostsDisplay Flex Column">
                {
                  newPosts.map((post, i) => {
                    // console.log(post)
                    return (<FinalReviewPost post={post} index={i} />)
                  })
                }
              </div>
              <div className="FinalReviewButtonsContainer">
                <button type="button" onClick={onFinalCancel}>Cancel</button>
                <button type="button" id="ReviewConfirm" onClick={onFinalClick}>Confirm</button>
              </div>

            </div>
          </>
        </div >
      )
    };

    if (submissionFeedback === 'success') {
      return (
        <div className="FinalReviewFeedback">
          <div className="FinalReviewFeedbackGreenCircleContainer">
            <GreenCircleRedCross type="GreenCircle" height={165} fadeInAnimation={true} />
          </div>
          <h1>Playlist updated successfully</h1>
        </div>
      )
    };

    if (submissionFeedback === 'failure') {
      return (
        <div className="FinalReviewFeedback">
          <div className="FinalReviewFeedbackGreenCircleContainer">
            <GreenCircleRedCross type="RedCross" height={165} fadeInAnimation={true} />
          </div>
          <h1>Couldn't update playlist...</h1>
          <h2 className="Message Failure">Please try again later</h2>
        </div >
      )
    };
  };

  return (
    screenToRender()
  )
}
export default FinalReviewInterface;
