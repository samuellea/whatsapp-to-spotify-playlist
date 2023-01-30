import './styles/FinalReviewPost.css';
import React, { useState, useEffect } from 'react';

function FinalReviewPost({ post, index }) {
  const { title, artists, thumbnail } = post;
  const bgColor = index % 2 === 0 ? 'Odd' : 'Even';
  return (
    <div className={`FinalReviewPost ${bgColor}`}>
      <div className="ThumbContainer">
        <img className="SpotifyThumb" src={thumbnail} alt="Spotify Thumbnail" />
      </div>
      <div className="PostInfoContainer">

        <p className="Title">{title}</p>
        <p className="Artist">{artists.join(', ')}</p>
      </div>
    </div >
  )
}
export default FinalReviewPost;
