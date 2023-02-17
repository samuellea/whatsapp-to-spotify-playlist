import React, { useState, useEffect } from 'react';
import PosterRibbon from './PosterRibbon';
import SNAAlbumOrPlaylistCard from './SNAAlbumOrPlaylistCard';
import * as h from './helpers';
import './styles/SharedNotAddedSection.css';

function SharedNotAddedSection({ rawPostsLog, lookupInState, colourMap }) {
  console.log(rawPostsLog)

  const hasRequiredKeysAndValuesNotNull = (obj, requiredKeys) => {
    const hasRequiredAdditionalKeys = Object.entries(obj).filter(entriesArr => requiredKeys.includes(entriesArr[0])).length > 0;
    const requiredKeysAllNotNull = requiredKeys.every(e => e[1] !== null);
    return hasRequiredAdditionalKeys && requiredKeysAllNotNull ? true : false;
  };

  const isExcludedYoutubePost = (obj) => {
    const hasCorrectLinkType = obj.linkType === 'youtube';
    const requiredKeys = ['thumbnail', 'title'];
    return hasCorrectLinkType && hasRequiredKeysAndValuesNotNull(obj, requiredKeys) ? true : false;
  };

  const isSpotifyAlbum = (obj) => {
    const hasCorrectLinkType = obj.linkType === 'spotifyAlbum';
    const requiredKeys = ['artists', 'thumbnail', 'title', 'totalTracks'];
    return hasCorrectLinkType && hasRequiredKeysAndValuesNotNull(obj, requiredKeys) ? true : false;
  };

  const isSpotifyPlaylist = (obj) => {
    const hasCorrectLinkType = obj.linkType === 'spotifyPlaylist';
    const requiredKeys = ['thumbnail', 'title', 'totalTracks', 'owner'];
    return hasCorrectLinkType && hasRequiredKeysAndValuesNotNull(obj, requiredKeys) ? true : false;
  };

  const excludedYoutubePostPresent = obj => {
    return rawPostsLog.some(e => (isExcludedYoutubePost(e))) ? true : false;
  }

  const spotifyAlbumPresent = obj => {
    return rawPostsLog.some(e => (isSpotifyAlbum(e))) ? true : false;
  }

  const spotifyPlaylistPresent = obj => {
    return rawPostsLog.some(e => (isSpotifyPlaylist(e))) ? true : false;
  }

  const sharedNotAddedItemsPresent = rawPostsLog.some(e => {
    if (excludedYoutubePostPresent(e) || spotifyAlbumPresent(e) || spotifyPlaylistPresent(e)) return true;
    return false;
  })

  if (!sharedNotAddedItemsPresent) return null;

  const excludedYoutubePosts = rawPostsLog.filter(e => isExcludedYoutubePost(e));
  const spotifyAlbums = rawPostsLog.filter(e => isSpotifyAlbum(e));
  const spotifyPlaylists = rawPostsLog.filter(e => isSpotifyPlaylist(e));

  return (
    <div className="SharedNotAddedSection Flex Column">
      <div className="BackgroundGradientBlock" />
      <div className="SharedNotAddedSectionPadding">
        <h4 className="SectionHeader">Shared, but not added to playlist -</h4>

        {excludedYoutubePostPresent ?
          <div className="SharedNotAddedSegment YoutubeNotAdded">
            <div className="SharedNotAddedSegmentTopper">
              <h4 className="SectionHeader">YouTube</h4>
              <span>Songs that aren't on Spotify / aren't songs</span>
            </div>
            <div className="SharedNotAddedSegmentContent">
              {excludedYoutubePosts.map((e, i) => {
                const targetPoster = h.determineTargetPoster(e.poster, lookupInState);
                const posterColour = h.pickPosterColour(targetPoster, lookupInState, colourMap);
                return (
                  <a href={`https://youtu.be/${e.linkID}`} target="_blank">
                    <div className="SharedNotAddedYoutubeCard">
                      <div className="SNA-YT-ThumbContainer">
                        <div className="SNA-YT-PosterRibbonContainer">
                          <PosterRibbon text={targetPoster} posterColour={posterColour} />
                        </div>
                        <img src={e.thumbnail} />
                      </div>
                      <div className="SNA-YT-TitleContainer">
                        <span className="CurtailText Curtail5">
                          {e.title}
                        </span>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
            <div className="SharedNotAddedSegmentFooter" />
          </div>
          : null}

        {spotifyAlbumPresent ?
          <div className="SharedNotAddedSegment AlbumNotAdded">
            <div className="SharedNotAddedSegmentTopper">
              <h4 className="SectionHeader">Albums / EPs</h4>
              <span>These are never added to the playlist</span>
            </div>
            <div className="SharedNotAddedSegmentContent">
              {spotifyAlbums.map((e, i) => {
                return (
                  <SNAAlbumOrPlaylistCard
                    post={e}
                    index={i}
                    artistOrOwner={e.artists.join(', ')}
                    link={`https://open.spotify.com/album/${e.linkID}`}
                    lookupInState={lookupInState}
                    colourMap={colourMap}
                  />
                )
              })}
            </div>
            <div className="SharedNotAddedSegmentFooter" />
          </div>
          : null}

        {spotifyPlaylistPresent ?
          <div className="SharedNotAddedSegment PlaylistNotAdded">
            <div className="SharedNotAddedSegmentTopper">
              <h4 className="SectionHeader">Other Playlists</h4>
              <span>These are never added to the playlist</span>
            </div>
            <div className="SharedNotAddedSegmentContent">
              {spotifyPlaylists.map((e, i) => (
                <SNAAlbumOrPlaylistCard
                  post={e}
                  index={i}
                  artistOrOwner={e.owner}
                  link={`https://open.spotify.com/playlist/${e.linkID}`}
                  lookupInState={lookupInState}
                  colourMap={colourMap}
                />
              ))}
            </div>
            <div className="SharedNotAddedSegmentFooter" />
          </div>
          : null}

      </div>
    </div >
  )
};

export default SharedNotAddedSection;


