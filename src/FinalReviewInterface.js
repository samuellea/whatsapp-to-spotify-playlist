import './styles/FinalReviewInterface.css';
import React, { useState, useEffect } from 'react';
import FinalReviewPost from './FinalReviewPost';
import { mockSleep } from './helpers';
import { useHistory } from "react-router-dom";


function FinalReviewInterface({
  firebasePlaylistObj,
  spotifyPlaylistObj,
  newPosts,
  handleFinalSubmission,
  submissionSuccess,
}) {
  let history = useHistory();

  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  const { processedPostsLog, spotifyPlaylistId, spotifyPlaylistName } = firebasePlaylistObj;

  useEffect(() => {
    if (submissionSuccess !== null && submissionSuccess) {
      setSubmissionFeedback('success')
      mockSleep(2500).then(() => history.push(`/stats?spotifyPlaylistId=${spotifyPlaylistId}`));
    };
    if (submissionSuccess !== null && !submissionSuccess) {
      setSubmissionFeedback('failure')
      mockSleep(2500).then(() => history.push(`/`));
    };
  }, [submissionSuccess]);

  const finalTrackIDs = newPosts.map(e => e.spotifyTrackID);

  const onFinalClick = () => {
    let r = window.confirm(`Update Spotify playlist? Cannot undo!`);
    if (r == true) {
      handleFinalSubmission(finalTrackIDs);
    }
  };

  const screenToRender = () => {
    if (!submissionFeedback) {
      return (
        <div className="FinalReviewInterface" >
          <h4>Playlist</h4>
          <h1>{spotifyPlaylistName}</h1>
          <h6>{processedPostsLog?.length || 0} tracks</h6>
          <h6>(Spotify: {spotifyPlaylistObj.tracks.total} tracks)</h6>

          <h2>{newPosts.length}</h2>
          <h6>new tracks are about to be added</h6>

          <div className="PostsContainer">
            {
              newPosts.map((post, i) => {
                return (<FinalReviewPost post={post} index={i} />)
              })
            }
          </div>
          <button type="button" className="FinalConfirmButton" onClick={onFinalClick}>Confirm?</button>
        </div >
      )
    };

    if (submissionFeedback === 'success') {
      return (
        <div className="FinalReviewFeedback">
          <div className="SuccessIcon Green">
            <span><i class="fa fa-check"></i></span>
          </div>
          <h2 className="Message Success">Playlist updated successfully</h2>
        </div>
      )
    };

    if (submissionFeedback === 'failure') {
      return (
        <div className="FinalReviewFeedback">
          <div className="SuccessIcon Red">
            <span><i class="fa fa-times"></i></span>
          </div>
          <h2 className="Message Failure">Couldn't update playlist -</h2>
          <h2 className="Message Failure">please try again later</h2>
        </div>
      )
    };
  };

  return (
    screenToRender()
  )
}
export default FinalReviewInterface;
