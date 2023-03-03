import './styles/FinalReviewPost.css';
import React, { useState, useEffect } from 'react';
import SpotifyIconWhitePNG from './Spotify_Icon_RGB_White.png';

function FinalReviewPost({ post, index }) {
  const { title, artists, thumbnailMed } = post;
  const bgColor = index % 2 === 0 ? 'Odd' : 'Even';
  return (
    <div className={`FinalReviewPost ${bgColor} Flex Row`}>
      <a href={`https://open.spotify.com/track/${post.spotifyTrackID}`} target="_blank" />

      <div className="FinalReviewPostThumb">
        <img src={thumbnailMed} alt="Spotify Thumbnail" />
      </div>


      <div className="FinalReviewInfoContainer Flex Column">
        <div className="FinalReviewTitle Flex Column">
          <span className="CurtailText Curtail2">{title}</span>
        </div>

        <div className="FinalReviewArtists Flex Column">
          <span className="CurtailText Curtail2">{artists.join(', ')}</span>
        </div>
      </div>

      <img id="SpotifyIconWhite" src={SpotifyIconWhitePNG} />
    </div >
  )
}
export default FinalReviewPost;
