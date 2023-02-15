import './styles/FinalReviewPost.css';
import React, { useState, useEffect } from 'react';

function FinalReviewPost({ post, index }) {
  const { title, artists, thumbnail } = post;
  const bgColor = index % 2 === 0 ? 'Odd' : 'Even';
  return (
    <div className={`FinalReviewPost ${bgColor} Flex Row`}>
      <div className="FinalReviewPostThumb">
        <img src={thumbnail} alt="Spotify Thumbnail" />
      </div>


      <div className="FinalReviewInfoContainer Flex Column">
        <div className="FinalReviewTitle Flex Column">
          <span className="CurtailText Curtail2">{title}</span>
        </div>

        <div className="FinalReviewArtists Flex Column">
          <span className="CurtailText Curtail2">{artists.join(', ')}</span>
        </div>
      </div>
    </div >
  )
}
export default FinalReviewPost;
