import React, { useState, useEffect } from 'react';
import PosterRibbon from './PosterRibbon';
import SNAAlbumOrPlaylistCard from './SNAAlbumOrPlaylistCard';
import * as h from './helpers';
import * as u from './utils';
import './styles/SharedNotAddedSection.css';
import Oval from 'react-loading-icons/dist/esm/components/oval';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import SpotifyIconWhitePNG from './Spotify_Icon_RGB_White.png';

function SharedNotAddedSection({ rawPostsLog, lookupInState, colourMap, handleExportStats, sharingLink, appToast, isPublicStatsPage = false, token }) {

  const [isExporting, setIsExporting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

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
    const requiredKeys = ['artists', 'thumbnailSmall', 'thumbnailMed', 'title', 'totalTracks'];
    return hasCorrectLinkType && hasRequiredKeysAndValuesNotNull(obj, requiredKeys) ? true : false;
  };

  const isSpotifyPlaylist = (obj) => {
    const hasCorrectLinkType = obj.linkType === 'spotifyPlaylist';
    const requiredKeys = ['thumbnailSmall', 'thumbnailMed', 'title', 'totalTracks', 'owner'];
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

  const sharedNotAddedItemsPresent = () => {
    if (excludedYoutubePostPresent() || spotifyAlbumPresent() || spotifyPlaylistPresent()) return true;
    return false;
  };

  // if (!sharedNotAddedItemsPresent()) return null;
  // console.log(rawPostsLog)
  const excludedYoutubePosts = rawPostsLog.filter(e => isExcludedYoutubePost(e));
  const spotifyAlbums = rawPostsLog.filter(e => isSpotifyAlbum(e));
  const spotifyPlaylists = rawPostsLog.filter(e => isSpotifyPlaylist(e));

  const handleStartExport = async () => {
    // pack up and send off all relevant data to FB
    setIsExporting(true);
    const exportSuccess = await handleExportStats();
  }

  const handleCopy = () => {
    setLinkCopied(true);
    appToast('Link copied to clipboard!', { duration: 2000 })
  };

  return (
    <div className="SharedNotAddedSection Flex Column" style={{ borderBottomLeftRadius: token && isPublicStatsPage || !isPublicStatsPage ? '15px' : '0px', borderBottomRightRadius: token && isPublicStatsPage || !isPublicStatsPage ? '15px' : '0px' }}>
      {sharedNotAddedItemsPresent() ?
        <>
          < div className="BackgroundGradientBlock" />
          <div className="SharedNotAddedSectionPadding">
            <h4 className="SectionHeader">Not added to playlist...</h4>

            {excludedYoutubePostPresent() ?
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
                      <div className="SharedNotAddedYoutubeCard">
                        <a className="Flex Row" href={`https://youtu.be/${e.linkID}`} target="_blank">
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
                        </a>
                      </div>
                    )
                  })}
                </div>
                <div className="SharedNotAddedSegmentFooter" />
              </div>
              : null}

            {spotifyAlbumPresent() ?
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
                <div className="ChangeModalSpotifyArtworkLink Flex Row">
                  <img id="SpotifyIconWhite" src={SpotifyIconWhitePNG} />
                  <span>Tap album / EP to open in Spotify</span>
                </div>
              </div>
              : null}

            {spotifyPlaylistPresent() ?
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
                <div className="ChangeModalSpotifyArtworkLink Flex Row">
                  <img id="SpotifyIconWhite" src={SpotifyIconWhitePNG} />
                  <span>Tap playlist to open in Spotify</span>
                </div>
              </div>
              : null}

          </div>
        </>
        : null}
      {!isPublicStatsPage ?
        <div className="ShareLinkBannerAndButton Flex Column">
          {sharingLink && !linkCopied ? <span className="SharingLinkGeneratedBanner">Sharing link generated!</span> : null}
          {sharingLink ?
            <CopyToClipboard text={sharingLink}
              onCopy={handleCopy}>
              <button className="ExportButton" style={{ backgroundColor: linkCopied ? '#66B06E' : '#7316C6' }}>
                {linkCopied ?
                  <FontAwesomeIcon id="CheckCircle" icon={faCheckCircle} pointerEvents="none" />
                  : 'Copy Link To Clipboard'}
              </button>
            </CopyToClipboard>
            :
            <button className="ExportButton" onClick={handleStartExport} disabled={isExporting}>
              {isExporting ?
                <Oval stroke="#98FFAD" height={100} width={30} strokeWidth={8} />
                : 'Share This Page'}
            </button>
          }
        </div>
        : null
      }

    </div >
  )
};

export default SharedNotAddedSection;