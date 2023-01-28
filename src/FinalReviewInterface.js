import './styles/FinalReviewInterface.css';
import React, { useState, useEffect } from 'react';
import FinalReviewPost from './FinalReviewPost';

function FinalReviewInterface({ firebasePlaylistObj, spotifyPlaylistObj, newPosts, handleFinalSubmission }) {

  const finalTrackIDs = newPosts.map(e => e.spotifyTrackID);

  const onFinalClick = () => {
    let r = window.confirm(`Update Spotify playlist? Cannot undo!`);
    if (r == true) {
      handleFinalSubmission(finalTrackIDs);
    }
  };

  const { posts, spotifyPlaylistId, spotifyPlaylistName } = firebasePlaylistObj;

  return (
    <div className="FinalReviewInterface">
      <h4>Playlist</h4>
      <h1>{spotifyPlaylistName}</h1>
      <h6>{posts?.length || 0} tracks</h6>
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
    </div>
  )
}
export default FinalReviewInterface;
