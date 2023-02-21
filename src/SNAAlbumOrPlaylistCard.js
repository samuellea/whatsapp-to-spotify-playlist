import React, { useState, useEffect } from 'react';
import PosterRibbon from './PosterRibbon';
import * as h from './helpers';
import './styles/SNAAlbumOrPlaylistCard.css';

function SNAAlbumOrPlaylistCard({ post, index, artistOrOwner, link, lookupInState, colourMap }) {
  const targetPoster = h.determineTargetPoster(post.poster, lookupInState);
  const posterColour = h.pickPosterColour(targetPoster, lookupInState, colourMap);
  return (
    // <a href={link} target="_blank">
    <div className="SharedNotAddedAlbumOrPlaylistCard" style={{ backgroundColor: index % 2 === 0 ? '#343750' : '#4C4F73' }}>

      <div className="SNA-AOP-PosterAndTracksContainer">

        <div className="SNA-AOP-PosterRibbonContainer">
          <PosterRibbon text={targetPoster} posterColour={posterColour} />
        </div>
        <div className="SNA-AOP-TotalTracks">{post.totalTracks} tracks</div>
      </div>

      <div className="SNA-AOP-InfoContainer Flex Row">
        <div className="SNA-AOP-ThumbContainer">
          <img src={post.thumbnailMed || post.thumbnailSmall} />
        </div>
        <div className="SNA-AOP-TitleAndArtist Flex Column">
          <div className="SNA-AOP-Title CurtailText Curtail2">{post.title}</div>
          <div className="SNA-AOP-Artist CurtailText Curtail2">{artistOrOwner}</div>
        </div>

      </div>

    </div>
    // </a>
  )
};

export default SNAAlbumOrPlaylistCard;


