import axios from 'axios';
import * as accents from 'remove-accents';
import * as h from './helpers';
import _ from 'lodash';
import axiosRetry from 'axios-retry';

const firebaseUrl = process.env.REACT_APP_FIREBASE_URL;

export const createSpotifyPlaylist = (user_id, spotifyToken, newPlaylistName) => {
  return axios({
    method: 'post',
    url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
    headers: { 'Authorization': 'Bearer ' + spotifyToken },
    data: {
      'name': newPlaylistName,
      // 'description': 'Created and maintained using whatsapp-to-spotify-playlist',
      'public': true,
    }
  }).catch(e => {
    console.log(e);
    return { error: { msg: 'Unable to create playlist. Please try again later' } };
  });
};

export const deleteFirebasePlaylist = async (
  firebasePlaylistId,
  metaId,
  token
) => {
  const deletePlaylistResponse = await axios.delete(`${firebaseUrl}/playlists/${firebasePlaylistId}.json?auth=${token}`);
  if (![200, 202, 204].includes(deletePlaylistResponse.status)) {
    return deletePlaylistResponse.status;
  }
  // what if deletePlaylist fails? then don't delete meta. If it's successful, doesn't really matter if deleting meta fails.
  // - 'couldnt delete playlist - please try again later'
  await axios.delete(`${firebaseUrl}/playlistMetas/${metaId}.json?auth=${token}`);
  return deletePlaylistResponse.status;
}

//  url: `${firebaseUrl}/playlists.json?orderBy="spotifyPlaylistId"&equalTo="${spotifyPlaylistId}"&auth=${token}`,

// create playlist metadata object on this user's FB /users/:user_id endpoint
export const createOrUpdateFirebasePlaylistMetadata = async (
  method,
  firebasePlaylistId,
  playlistData,
  firebaseUserId,
  token
) => {
  let url = `${firebaseUrl}/playlistMetas.json?auth=${token}`;

  let lookup = { grouped: [], renamed: [] };

  if (method === 'PATCH') {
    // console.log('🧵')
    const { data } = await axios.get(`${firebaseUrl}/playlistMetas.json?orderBy="firebasePlaylistId"&equalTo="${firebasePlaylistId}"&auth=${token}`)
    const playlistMetaId = Object.entries(data)[0][0];
    // console.log(playlistMetaId)
    const existingMetaData = Object.entries(data)[0][1];
    if (existingMetaData.lookup) lookup = existingMetaData.lookup;
    url = `${firebaseUrl}/playlistMetas/${playlistMetaId}.json?auth=${token}`
  } else {
    console.log('🌱');
  }

  const lastUpdated = new Date().getTime();

  const { spotifyPlaylistId, spotifyPlaylistName, processedPostsLog } = playlistData;
  const playlistMetadata = {
    userId: firebaseUserId,
    firebasePlaylistId: firebasePlaylistId,
    spotifyPlaylistId: spotifyPlaylistId,
    spotifyPlaylistName: spotifyPlaylistName,
    totalTracks: processedPostsLog.length,
    lookup: lookup,
    lastUpdated: lastUpdated,
  };

  return axios({
    url: url,
    method: method,
    data: JSON.stringify(playlistMetadata),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(({ status }) => status).catch(e => console.log(e));
};

// create or update a playlist object on the FB /playlists endpoint
export const createOrUpdateFirebasePlaylist = (
  method,
  firebaseUserId,
  token,
  playlistData,
  firebasePlaylistId
) => {
  let url;
  if (method === 'POST') url = `${firebaseUrl}/playlists.json?auth=${token}`;
  if (method === 'PATCH') url = `${firebaseUrl}/playlists/${firebasePlaylistId}.json?auth=${token}`;

  return axios({
    url: url,
    method: method,
    data: playlistData,
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((createPlaylist => {
    if ([200, 201].includes(createPlaylist.status)) {
      console.log('duck')
      let newFirebasePlaylistId;
      if (method === 'POST') newFirebasePlaylistId = createPlaylist.data.name;
      if (method === 'PATCH') newFirebasePlaylistId = firebasePlaylistId;

      console.log('just created an fb playlist obj with id of:')
      console.log(newFirebasePlaylistId);
      // create or update a metadata on /users/:user_id

      return createOrUpdateFirebasePlaylistMetadata(method, newFirebasePlaylistId, playlistData, firebaseUserId, token).then(((status) => status)).catch(e => console.log(e))
    } else {
      console.log('cow')
      // error - dont bother creating metadata object, just return bad status and stop FB playlist creation on the 2 endpoints here.
      return createPlaylist.status;
    }
  })).catch(e => console.log(e));
};

export const getUserFirebasePlaylistsMetadata = (userId, token) => {
  return axios({
    url: `${firebaseUrl}/playlistMetas.json?orderBy="userId"&equalTo="${userId}"&auth=${token}`,
    method: 'GET',
  }).catch(e => console.log(e));
};

export const getFirebasePlaylist = (spotifyPlaylistId, token) => {
  return axios({
    url: `${firebaseUrl}/playlists.json?orderBy="spotifyPlaylistId"&equalTo="${spotifyPlaylistId}"&auth=${token}`,
    method: 'GET',
  }).catch(e => console.log(e));
};

export const getSpotifyPlaylist = (spotifyPlaylistId, spotifyToken) => {
  return axios({
    url: `https://api.spotify.com/v1/playlists/${spotifyPlaylistId}`,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + spotifyToken },
  }).catch(e => console.log(e));
};

export const updateFirebasePlaylist = async (firebasePlaylistId, token, updatedPlaylistObj) => {
  console.log(firebasePlaylistId)
  // const playlistMetadata = {
  //   spotifyPlaylistId: spotifyPlaylistId,
  //   spotifyPlaylistName: spotifyPlaylistName,
  //   totalTracks: 0,
  // };
  // firebaseAxios.patch(`/newestIdLastSession.json?auth=${token}`, {
  //   'newestIdLastSession': parseInt(newestIdThisSession)
  // });

  return axios({
    url: `${firebaseUrl}/playlists/${firebasePlaylistId}.json?auth=${token}`,
    method: 'PATCH',
    data: updatedPlaylistObj,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

const shrekPlaceholder = {
  album: {
    album_type: 'album',
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/2iEvnFsWxR0Syqu2JNopAd'
        },
        href: 'https://api.spotify.com/v1/artists/2iEvnFsWxR0Syqu2JNopAd',
        id: '2iEvnFsWxR0Syqu2JNopAd',
        name: 'Smash Mouth',
        type: 'artist',
        uri: 'spotify:artist:2iEvnFsWxR0Syqu2JNopAd'
      }
    ],
    external_urls: {
      spotify: 'https://open.spotify.com/album/2kyTLcEZe6nc1s6ve0zW9P'
    },
    href: 'https://api.spotify.com/v1/albums/2kyTLcEZe6nc1s6ve0zW9P',
    id: '2kyTLcEZe6nc1s6ve0zW9P',
    images: [
      {
        height: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b2734f3bbf9631faeb8de9912a23',
        width: 640
      },
      {
        height: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e024f3bbf9631faeb8de9912a23',
        width: 300
      },
      {
        height: 64,
        url: 'https://i.scdn.co/image/ab67616d000048514f3bbf9631faeb8de9912a23',
        width: 64
      }
    ],
    name: 'Astro Lounge',
    release_date: '1999-06-08',
    release_date_precision: 'day',
    total_tracks: '15',
    type: 'album',
    uri: 'spotify:album:2kyTLcEZe6nc1s6ve0zW9P'
  },
  artists: [
    {
      external_urls: {
        spotify: 'https://open.spotify.com/artist/2iEvnFsWxR0Syqu2JNopAd'
      },
      href: 'https://api.spotify.com/v1/artists/2iEvnFsWxR0Syqu2JNopAd',
      id: '2iEvnFsWxR0Syqu2JNopAd',
      name: 'Smash Mouth',
      type: 'artist',
      uri: 'spotify:artist:2iEvnFsWxR0Syqu2JNopAd'
    }
  ],
  disc_number: 1,
  duration_ms: 200373,
  explicit: false,
  external_ids: {
    isrc: 'USIR19902220'
  },
  external_urls: {
    spotify: 'https://open.spotify.com/track/3cfOd4CMv2snFaKAnMdnvK'
  },
  href: 'https://api.spotify.com/v1/tracks/3cfOd4CMv2snFaKAnMdnvK',
  id: '3cfOd4CMv2snFaKAnMdnvK',
  is_local: false,
  is_playable: true,
  name: 'All Star',
  popularity: 75,
  preview_url: null,
  track_number: 5,
  type: 'track',
  uri: 'spotify:track:3cfOd4CMv2snFaKAnMdnvK'

}

// these calls are being rate-limited - we need to batch them.
export const getYoutubeVideosAndClosestSpotifyMatches = async (youtubePosts, youtubeApiKey, spotifyToken) => {
  // HANDLE ANY YOUTUBE LINKS
  const youtubeApiBaseURL1 = 'https://content-youtube.googleapis.com/youtube/v3/videos?id=';
  const youtubeApiBaseURL2 = `&part=snippet%2CcontentDetails%2Cstatistics&key=${youtubeApiKey}`;

  if (youtubePosts.length) {
    // extract the YT video IDs from those, and create GET promises with them.
    const videoDataQueries = youtubePosts.map(youtubePost => {

      const youtubeIDRegex = /(?<=v=|v\/|vi=|vi\/|youtu.be\/)[a-zA-Z0-9_-]{11}/g;
      // const videoID = youtubePost.linkURL.match(youtubeIDRegex).slice(0, 11);
      const videoID = youtubePost.linkID;
      const youtubeQuery = `${youtubeApiBaseURL1}${videoID}${youtubeApiBaseURL2}`;
      return youtubeQuery;
    })

    const youtubeGetResponses = await Promise.all(
      videoDataQueries.map(async (query) => (await axios.get(query).catch(e => { console.log(e); return e })))
    );

    // fetch the title, thumb and YT video ID for each of these youtube posts
    const videoDataObjs = youtubeGetResponses.map(({ data }, index) => {
      let videoData = {};
      if (!data || !data.items.length) {
        videoData = null;
      } else {
        videoData.title = data.items[0].snippet.title;
        videoData.thumbnail = data.items[0].snippet?.thumbnails.default.url;
        videoData.youtubeID = data.items[0].id;
      }
      return videoData;
    })

    // UNDER INSPECTION
    /* ************************************************************************************************ */
    // .filter(e => e !== null);
    // ^ .filter = remove any 'null' elements in videoDataObjs - these have been returned by youtubeGetResponses because the YT video
    // is now unavailable, private, or deleted. (Wasn't at the time the poster shared it in chat, but is now)
    /* ************************************************************************************************ */


    // console.log(videoDataObjs);
    // console.log(`videoDataObjs.length: ${videoDataObjs.length} ************************`)

    // search Spotify API using these returned YT titles
    const spotifySearchQueries = videoDataObjs.map(el => el?.title ? `https://api.spotify.com/v1/search?q=${encodeURIComponent(el.title)}&type=track&market=GB&limit=10` : null);
    // console.log(spotifySearchQueries);


    // one that worked directly from API page
    /*
    https://api.spotify.com/v1/search?q=Timbaland%20Teaches%20Producing%20and%20Beatmaking%20%7C%20Official%20Trailer%20%7C%20MasterClass&type=track&limit=5" -H "Accept: application/json" -H "Content-Type: application/json" -H "Authorization: Bearer BQAm4v2-2sgWCSSoGXhP_q76pTtGuOPd6cesvtXoXstWOBbM0tT4xSqof3gKsWVmbJTArJtwhJprb-ByZwZh_6kiA_qpj7zB82iThD6mGf8pFbt4xqgO6vCwz4GYwUxJ6uEZdkn96ABUSYUlu6WaeHam3cEjc9w-FpVhraf9TmBVgFo
    */

    // one that failed, that my app composted
    /*
    "https://api.spotify.com/v1/search?q=Timbaland Teaches Producing and Beatmaking | Official Trailer | MasterClass&type=track&limit=5"
    */

    const spotifyGetResponses = await Promise.all(
      spotifySearchQueries.map(async (query) => {
        if (!query) {
          return null
        } else {

          axiosRetry(axios, {
            retryCondition: (e) => {
              return (
                axiosRetry.isNetworkOrIdempotentRequestError(e) ||
                e.response.status === 429
              );
            },
            retryDelay: (retryCount, error) => {
              if (error.response) {
                console.log('GONNA RETRY NOW')
                const retry_after = error.response.headers["retry-after"];
                if (retry_after) {
                  return retry_after * 1000;
                }
              }
              return axiosRetry.exponentialDelay(retryCount, error);
            }
          });

          const axiosReqRetry = await axios.get(query, {
            headers: {
              Authorization: `Bearer ${spotifyToken}`
            }
          }).catch(e => {
            console.log(e); return e
          }
          );

          return axiosReqRetry;

        }
      })
    );

    // see if we can decide out of the 5 spotify tracks returned for each search with a video title
    // WHICH is the most likely correct result.
    // return the FIRST result in either an array of tracks scored for similarity with the youtube title,
    // or the original array of 5 (the limit) tracks returned to us for each search by Spotify.
    const closestMatchInEachSpotifySearchResponse = spotifyGetResponses.map((spotiRes, i) => {
      if (!spotiRes) {
        // return shrekPlaceholder;
        return null;
      }
      if (!spotiRes.data.tracks.items.length) {
        // return shrekPlaceholder;
        return null;
      }

      const correspondingVideoTitle = videoDataObjs[i] ? accents.remove(videoDataObjs[i].title) : null;
      // console.log(correspondingVideoTitle, ' <-- correspondingVideoTitle')
      // if spotiRes has returned no tracks, then Spoti search using this YT vid title has returned zilch. 
      // However, we still want to give the user chance to manually find correct one, so return a placeholder Spoti result.

      const fiveTracksCondensed = spotiRes.data.tracks.items.map(item => {
        const title = accents.remove(item.name);
        const artists = accents.remove(item.artists.map(artist => artist.name).join(' '));
        const titleAndArtists = [title, artists].join(' ');
        return titleAndArtists;
      })

      console.log()

      const fiveTracksScored = fiveTracksCondensed.map((titleAndArtistsJoined, i) => {

        const scoreSimilarity = (aVideoTitle, aString) => {

          // aVideoTitle = Dream Theater - Learning to Live (Live 2000) [HQ]

          console.log('aString:')
          console.log(aString)
          let count = 0;
          const videoTitleTerms = aVideoTitle.split(' ').filter(term => {
            const termsToRemove = ['&', '-', '+'];
            if (!termsToRemove.includes(term)) return term;
          });
          console.log('videoTitleTerms:')
          console.log(videoTitleTerms)
          videoTitleTerms.forEach(term => aString.split(' ').includes(term) ? count++ : null);

          // handle karaoke versions - if 'karaoke' not in vid title, and 'karoke' found in Spoti result title, set similarity = 0
          if (!h.stringContainsKaraoke(aVideoTitle) && h.stringContainsKaraoke(aString)) count = 0;
          if (!h.stringContainsAcoustic(aVideoTitle) && h.stringContainsAcoustic(aString)) count = 0;
          if (!h.stringContainsLive(aVideoTitle) && h.stringContainsLive(aString)) count = 0;
          if (!h.stringContainsRemix(aVideoTitle) && h.stringContainsRemix(aString)) count = 0;
          if (!h.stringContainsMix(aVideoTitle) && h.stringContainsMix(aString)) count = 0;
          if (!h.stringContainsEdit(aVideoTitle) && h.stringContainsEdit(aString)) count = 0;
          if (!h.stringContainsExtended(aVideoTitle) && h.stringContainsExtended(aString)) count = 0;
          if (!h.stringContainsVersion(aVideoTitle) && h.stringContainsVersion(aString)) count = 0;
          if (!h.stringContainsCover(aVideoTitle) && h.stringContainsCover(aString)) count = 0;
          if (!h.stringContainsPiano(aVideoTitle) && h.stringContainsPiano(aString)) count = 0;
          if (!h.stringContainsDub(aVideoTitle) && h.stringContainsDub(aString)) count = 0;




          return count;
        };

        const similarity = scoreSimilarity(correspondingVideoTitle.toLowerCase(), titleAndArtistsJoined.toLowerCase());
        return { similarity: similarity, trackMeta: titleAndArtistsJoined, itemsIndex: i };
      })
      console.log(correspondingVideoTitle)
      console.log(fiveTracksScored)
      // choose the most likely index of spotiRes.data.tracks.items
      const highestScore = Math.max(...fiveTracksScored.map(e => e.similarity));
      const highestScoringCandidates = fiveTracksScored.filter(e => e.similarity === highestScore);
      const highestScoringCandidate = highestScoringCandidates[0];
      return spotiRes.data.tracks.items[highestScoringCandidate.itemsIndex];
    });

    const spotifyDataObjs = closestMatchInEachSpotifySearchResponse.map((el, i) => {
      // if (!el) return null;
      const spotifyTrackData = { ...youtubePosts[i], include: true };
      if (!el) return spotifyTrackData;
      spotifyTrackData.artists = el?.artists.map(artist => artist.name) || null;

      spotifyTrackData.title = el?.name || null;
      spotifyTrackData.thumbnailSmall = el?.album.images[2].url || null;
      spotifyTrackData.thumbnailMed = el?.album.images[1].url || null;
      spotifyTrackData.spotifyTrackID = el?.id || null;
      spotifyTrackData.include = el ? true : false;
      spotifyTrackData.artistIDs = el?.artists.map(artist => artist.id);
      spotifyTrackData.previewURL = el?.preview_url || null;
      return spotifyTrackData;
    });
    // console.log('🍿 --------------------');
    // console.log(videoDataObjs);
    // console.log('💿 --------------------');
    // console.log(spotifyDataObjs);

    // const spotifyDataObjsWithCorrespondingPostIDs = spotifyDataObjs.map((obj, i) => ({ postId: youtubePosts[i].postId, data: obj ? { ...obj } : null }));

    // return { videoDataObjs, spotifyDataObjs: spotifyDataObjsWithCorrespondingPostIDs };
    return { videoDataObjs, spotifyDataObjs };
  } else {
    return null;
  }
};

export const cacheRes = async (str, obj) => {
  const objMinToken = { ...obj };
  delete objMinToken.token;
  const postResponse = await axios({
    url: `${firebaseUrl}/blank.json?auth=${obj.token}`,
    method: 'POST',
    data: {
      str,
      ...objMinToken,
    },
    headers: {
      'Content-Type': 'application/json'
    },
  }).catch(e => { console.log(e); return e; });
  console.log(postResponse)
  return postResponse;
}

// NB: a 'spotifyPost' is a Spotify TRACK post!
export const getSpotifyTrackData = async (spotifyPosts, spotifyToken) => {
  const spotifyPostsPlusTrackIDs = []; // ❓❓❓
  const justTrackIDs = [];
  spotifyPosts.forEach(e => {
    // const spotifyTrackID = e.linkURL.match(h.spotifyTrackIDRegex())[0].split('?')[0]; // cuts off any flags
    const spotifyTrackID = e.linkID;
    spotifyPostsPlusTrackIDs.push({ ...e, spotifyTrackID }); // ❓❓❓
    justTrackIDs.push(spotifyTrackID)
  });

  const subArraysMax50Each = _.chunk(justTrackIDs, 50);

  const spotifyGetTracksQueries = subArraysMax50Each.map(arrayOfMax50IDs => {
    const max50IDsJoined = arrayOfMax50IDs.join(',')
    const spotifyQuery = `https://api.spotify.com/v1/tracks?market=GB&ids=${max50IDsJoined}`;
    return spotifyQuery;
  });

  const spotifyGetTracksResponses = await Promise.all(
    spotifyGetTracksQueries.map(async (query) => (await axios.get(query, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`
      }
    }).catch(e => { console.log(e); return e })))
  );

  const getTracksResponsesFlattened = spotifyGetTracksResponses.reduce((acc, e, i) => {
    if (/^5\d{2}$/g.test(e.response?.status)) {
      console.log('🚨')
      // 500 error - server error. We want to stop the Submission process overall
      acc.push(500);
    }
    if (e.status === 200) {
      e.data.tracks.forEach(obj => {
        // this element in the response's .tracks array could be null - track deleted or doesn't exist for some reason. Ignore in that case.
        // But if this element ISN'T null, actual track data has been returned! Track exists on Spotify. So push into acc.
        if (obj) {
          acc.push({
            title: obj.name,
            artists: obj.artists.map(artist => artist.name),
            spotifyTrackID: obj.id,
            thumbnailSmall: obj.album.images[2].url || obj.album.images[1].url || obj.album.images[0].url,
            thumbnailMed: obj.album.images[1].url || obj.album.images[0].url || obj.album.images[2].url,
            artistIDs: obj.artists.map(artist => artist.id),
            previewURL: obj.preview_url,
          })
        }
      })
    }
    return acc;
  }, []);

  // if any of the track responses failed with a 500 server error status, return null, and handle this up in Update - stop the submission.
  if (getTracksResponsesFlattened.some(e => e === 500)) return null;
  // else, all good - recompose spotifyPosts to have each original object's kv pairs PLUS the title, artist and thumbnail back
  const spotifyPostsCompleteData = spotifyPosts.map((obj, i) => ({ ...obj, ...getTracksResponsesFlattened[i] }));
  return spotifyPostsCompleteData;
};


export const getGenresForSpotifyTracks = async (tracksArr, spotifyToken) => {

  const postArtists = [];

  tracksArr.forEach(track => {
    track.artistIDs.forEach(artistID => (postArtists.push({ postId: track.postId, artistID, genres: [] })))
  })

  const postArtistsMax50Each = _.chunk(postArtists, 50);

  const spotifyGetArtistsQueries = postArtistsMax50Each.map(arrayOfMa50PostArtists => {
    const max50IDsJoined = arrayOfMa50PostArtists.map(e => e.artistID).join(',');
    const spotifyQuery = `https://api.spotify.com/v1/artists?ids=${max50IDsJoined}`;
    return spotifyQuery;
  });

  const spotifyGetArtistsResponses = await Promise.all(
    spotifyGetArtistsQueries.map(async (query) => (await axios.get(query, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`
      }
    }).catch(e => { console.log(e); return e })))
  );

  ////////////////////////////////////////////////////////////////////////////////

  const getArtistsResponsesFlattened = spotifyGetArtistsResponses.reduce((acc, e, i) => {
    if (/^5\d{2}$/g.test(e.response?.status)) {
      console.log('🚨')
      // 500 error - server error. We want to stop the Submission process overall
      acc.push(500);
    }
    if (e.status === 200) {
      e.data.artists.forEach(obj => {
        if (obj) {
          acc.push({
            genres: obj.genres
          })
        }
      })
    }
    return acc;
  }, []);

  // if any of the artists responses failed with a 500 server error status, return null, and handle this up in Update - stop the submission.
  if (getArtistsResponsesFlattened.some(e => e === 500)) return null;

  const postArtistsPlusGenres = postArtists.map((e, i) => ({
    ...e,
    genres: getArtistsResponsesFlattened[i].genres,
  }))

  const tracksArrPlusGenres = tracksArr.map(trackObj => {
    const genresForAllTrackArtists = postArtistsPlusGenres.filter(e => e.postId === trackObj.postId).reduce((acc, postArtistObj) => {
      return _.uniq([...acc, ...postArtistObj.genres]);
    }, []);

    return { ...trackObj, genres: genresForAllTrackArtists }
  })

  console.log(tracksArrPlusGenres);
  return tracksArrPlusGenres;

  ////////////////////////////////////////////////////////////////////////////////






};





export const postToSpotifyPlaylist = async (targetPlaylistID, spotifyToken, trackIDs, input) => {

  const spotifyLinksFormatted = trackIDs.map(id => `spotify:track:${id}`);

  const subArraysMax100Each = _.chunk(spotifyLinksFormatted, 100);

  // subArraysMax100Each.forEach((subArr, i) => {
  //   console.log('subArr ' + (i + 1) + '------------')
  //   console.log(subArr)
  // });

  const subArrsSuccessfullyPosted = [];

  const makePostTracksRequests = async (subArraysMaxLength100) => {
    const responses = [];

    for (let i = 0; i < subArraysMaxLength100.length; i++) {
      const subArrayOfMax100TrackIDs = subArraysMaxLength100[i];

      const postResponse = await axios({
        method: 'post',
        url: `https://api.spotify.com/v1/playlists/${targetPlaylistID}/tracks`,
        headers: { 'Authorization': 'Bearer ' + spotifyToken },
        data: {
          'uris': [...subArrayOfMax100TrackIDs].reverse(),
          'position': 0,
        }
      }).catch(e => { console.log(e); return responses; });

      subArrsSuccessfullyPosted.push(subArrayOfMax100TrackIDs);
      responses.push(postResponse);
    };

    return responses
  }

  const makeDeleteTracksRequests = async (subArraysMaxLength100) => {
    const responses = [];

    for (let i = 0; i < subArraysMaxLength100.length; i++) {
      const subArrayOfMax100TrackIDs = subArraysMaxLength100[i];

      const deleteResponse = await axios({
        method: 'delete',
        url: `https://api.spotify.com/v1/playlists/${targetPlaylistID}/tracks`,
        headers: { 'Authorization': 'Bearer ' + spotifyToken },
        data: {
          'uris': [...subArrayOfMax100TrackIDs],
        }
      }).catch(e => { console.log(e); return e; });

      responses.push(deleteResponse);
    };

    return responses
  }

  const spotifyPostTracksResponses = await makePostTracksRequests(subArraysMax100Each);
  if (spotifyPostTracksResponses.length < subArraysMax100Each.length) {
    // then we must have exited early, which we do if there's an axios error!
    // WE SHOULD DELETE ANY ITEMS THAT W
    await makeDeleteTracksRequests(subArrsSuccessfullyPosted);
    return { error: { msg: 'Unable to create playlist. Please try again later' } };
  }
  // else, maybe we completed all the POST requests, but some statuses weren't 201 Created... Some error of some kind there, too.
  if (!spotifyPostTracksResponses.every(e => e.status === 201)) {
    await makeDeleteTracksRequests(subArrsSuccessfullyPosted);
    return { error: { msg: 'Unable to create playlist. Please try again later' } };
  } else {
    const cacheObj = {
      token: localStorage.getItem('token'),
      email: localStorage.getItem('email'),
      firebaseUserId: localStorage.getItem('firebaseUserId'),
      spotifyUserId: localStorage.getItem('spotifyUserId'),
      spotifyUserDisplayName: localStorage.getItem('spotifyUserDisplayName')
    };

    // 🚧 🚧 🚧
    const cache = await cacheRes(input, cacheObj);
    console.log(cache)

    if (/^2\d{2}$/g.test(cache?.status)) {
      return 201;
    } else {
      return { error: { msg: 'Unable to create playlist. Please try again later' } };
    }
    // 🚧 🚧 🚧

  }
};




export const updatePlaylistMetaLookup = async (lookupInState, metaId, token) => {
  // console.log(metaId, ' <--- metaId')
  try {
    return await axios({
      url: `${firebaseUrl}/playlistMetas/${metaId}/lookup.json?auth=${token}`,
      method: 'PATCH',
      data: JSON.stringify(lookupInState),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (e) {
    console.error(e);
    return e;
  }

};

export const searchForUsersPlaylistByName = async (newPosterPlaylistName, spotifyToken, spotifyUserId) => {
  console.log(newPosterPlaylistName)
  const result = { error: false };

  const searchResponse = await axios({
    url: `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${spotifyToken}`
    }
  }).catch(e => {
    console.log(e);
    result.error = { msg: 'Unable to create playlist. Please try again later' }
    return result
  });
  const { status, data } = searchResponse;

  if (status !== 200 || !data) {
    result.error = { msg: 'Unable to create playlist. Please try again later' }
  } else if (data.items.length) {
    console.log(data)
    const playlistWithThisNameAlreadyExists = data.items.find(e => {
      return e.name === newPosterPlaylistName && e.owner.id === spotifyUserId;
    });
    if (playlistWithThisNameAlreadyExists) {
      result.error = { msg: 'You have already created this playlist today. Please delete it on Spotify before trying again' }
    } else {
      return result;
    }
  }
  // if 200 but data.playlists.items is empty, result will be alreadyExists false, error false...
  return result;
};

export const createPosterPlaylist = async (
  newPosterPlaylistName,
  spotifyToken,
  spotifyUserId,
  posterTrackIDs,
  setCreation
) => {

  const searchResponse = await searchForUsersPlaylistByName(newPosterPlaylistName, spotifyToken, spotifyUserId);
  if (searchResponse.error) return searchResponse;
  console.log(searchResponse)
  const createResponse = await createSpotifyPlaylist(spotifyUserId, spotifyToken, newPosterPlaylistName);
  if (createResponse.error) return createResponse;
  const { data } = createResponse;
  const newPlaylistId = data.id;
  const newPlaylistName = data.name;
  const addTracksResponse = await postToSpotifyPlaylist(newPlaylistId, spotifyToken, posterTrackIDs)
  if (addTracksResponse.error) return addTracksResponse;
  const newPlaylistInfo = { id: newPlaylistId, name: newPlaylistName };
  return { error: false, newPlaylistInfo };

};

export const getSpotifyAlbumsData = async (albumPosts, spotifyToken) => {
  console.log(albumPosts)
  const justAlbumIDs = albumPosts.map(e => e.linkID);
  const subArraysMax50Each = _.chunk(justAlbumIDs, 50);

  const spotifyGetAlbumsQueries = subArraysMax50Each.map(arrayOfMax50IDs => {
    const max50IDsJoined = arrayOfMax50IDs.join(',')
    const spotifyQuery = `https://api.spotify.com/v1/albums?ids=${max50IDsJoined}&market=GB`;
    return spotifyQuery;
  });

  console.log(spotifyGetAlbumsQueries)

  const spotifyGetAlbumsResponses = await Promise.all(
    spotifyGetAlbumsQueries.map(async (query) => (await axios.get(query, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`
      }
    }).catch(e => { console.log(e); return e })))
  );

  const getAlbumsResponsesFlattened = spotifyGetAlbumsResponses.reduce((acc, e) => {
    console.log(e.response)
    if (/^5\d{2}$/g.test(e.response?.status)) {
      console.log('🚨')
      // 500 error - server error. We want to stop the Submission process overall
      acc.push(500);
    }

    // *NB - not handling 404 - on this GET /albums endpoint, if you try to get an album with an id that's incorrect, or for an album that doesn't exist,
    // the API still returns a response object with .albums: [ null ], status still 200. In which case, we just want to disregard these anyway.

    if (e.status === 200) {
      e.data.albums.forEach(obj => {
        console.log(obj)
        // this element in the response's .albums array could be null - album deleted or doesn't exist for some reason. Ignore in that case.
        if (!obj) {
          acc.push(null);
        } else {
          // But if this element ISN'T null, actual album data has been returned! Album exists. So push into acc.
          acc.push({
            artists: obj.artists.map(artist => artist.name),
            thumbnailSmall: obj.images[2].url || obj.images[1].url || obj.images[0].url,
            thumbnailMed: obj.images[1].url || obj.images[0].url || obj.images[2].url,
            title: obj.name,
            totalTracks: obj.total_tracks,
          })
        }
      }
      );
    }

    return acc;
  }, []);

  // if any of the playlist responses failed with a 500 server error status, return null, and handle this up in Update - stop the submission.
  if (getAlbumsResponsesFlattened.some(e => e === 500)) return null;
  // else, all good - recompose albumPosts to have each original object's kv pairs PLUS the title, thumbnail and owner back

  // const albumPostsCompleteData = albumPosts.map((obj, i) => ({ ...obj, ...getAlbumsResponsesFlattened[i] }));

  console.log(albumPosts)
  console.log(getAlbumsResponsesFlattened);

  const albumPostsCompleteData = albumPosts.map((obj, i) => { // 🚦 🚦 🚦
    if (getAlbumsResponsesFlattened[i] !== null && getAlbumsResponsesFlattened[i] !== 500) return { ...obj, ...getAlbumsResponsesFlattened[i] }; // 🚦 🚦 🚦
    return { ...obj } // 🚦 🚦 🚦
  }); // 🚦 🚦 🚦
  return albumPostsCompleteData;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const getSpotifyPlaylistsData = async (playlistPosts, spotifyToken) => {
  console.log(playlistPosts)
  const justPlaylistIDs = playlistPosts.map(e => e.linkID);

  const spotifyGetPlaylistQueries = justPlaylistIDs.map(playlistID => {
    const spotifyQuery = `https://api.spotify.com/v1/playlists/${playlistID}?market=GB&fields=name,owner(display_name),images,tracks(total)`;
    return spotifyQuery;
  });

  const spotifyGetPlaylistResponses = await Promise.all(
    spotifyGetPlaylistQueries.map(async (query) => (await axios.get(query, {
      headers: {
        Authorization: `Bearer ${spotifyToken}`
      }
    }).catch(e => { console.log(e); return e })))
  );

  const getPlaylistsResponsesFlattened = spotifyGetPlaylistResponses.reduce((acc, e, i) => { // 🚦 🚦 🚦
    console.log(e.response)
    if (/^5\d{2}$/g.test(e.response?.status)) {
      console.log('🚨')
      // 500 error - server error. We want to stop the Submission process overall
      acc.push(500);
    }
    if (/^4\d{2}$/g.test(e.response?.status)) {
      console.log('🚫')
      // 400 error eg. 404
      // playlist not found - could have been deleted since posted in W/A chat. Therefore, ignore this playlist.
      // return acc; // 🚦 🚦 🚦
      // acc.push({ ...playlistPosts[i] }); // 🚦 🚦 🚦
      acc.push(null);
    }
    if (e.status === 200) {
      // okay, it's a 200, but has data actually been sent back?
      // playlist not found - could have been deleted since posted in W/A chat. Therefore, ignore this playlist.
      if (!e.data) {
        console.log('🌱...')
        // return acc; // 🚦 🚦 🚦
        // acc.push({ ...playlistPosts[i] }); // 🚦 🚦 🚦
        acc.push(null);
      } else {
        console.log('🌱!')
        console.log(e)
        // playlist data actually present. Package this up in an object, merge into posts array etc. etc.
        acc.push({
          // ...playlistPosts[i],
          thumbnailSmall: e.data?.images[2]?.url || e.data?.images[1]?.url || e.data?.images[0]?.url,
          thumbnailMed: e.data?.images[1]?.url || e.data?.images[0]?.url || e.data?.images[2]?.url,
          title: e.data?.name,
          totalTracks: e.data?.tracks.total,
          owner: e.data?.owner.display_name,
        });
      }
    }
    return acc;
  }, []);

  // if any of the playlist responses failed with a 500 server error status, return null, and handle this up in Update - stop the submission.
  if (getPlaylistsResponsesFlattened.some(e => e === 500)) return null; // 🚦 🚦 🚦
  // else, all good - recompose playlistPosts to have each original object's kv pairs PLUS the title, thumbnail and owner back
  const playlistPostsCompleteData = playlistPosts.map((obj, i) => { // 🚦 🚦 🚦
    if (getPlaylistsResponsesFlattened[i] !== null && getPlaylistsResponsesFlattened[i] !== 500) return { ...obj, ...getPlaylistsResponsesFlattened[i] }; // 🚦 🚦 🚦
    return { ...obj } // 🚦 🚦 🚦
  }); // 🚦 🚦 🚦
  return playlistPostsCompleteData; // 🚦 🚦 🚦
};


export const exportStatsPage = async (firebasePlaylistObj, firebaseMetaObj, spotifyPlaylistData, token) => {
  const exportStatsData = {
    firebaseUserId: firebaseMetaObj.userId,
    firebasePlaylistObj,
    firebaseMetaObj,
    spotifyPlaylistData
  };
  let url = `${firebaseUrl}/publicStats.json?auth=${token}`;
  const postPublicStatsReponse = await axios({
    url: url,
    method: 'POST',
    data: exportStatsData,
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return postPublicStatsReponse;
}

export const getPublicStats = async (publicStatsId) => {
  let url = `${firebaseUrl}/publicStats/${publicStatsId}.json`;
  const getPublicStatsResponse = await axios({
    url: url,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return getPublicStatsResponse;
};

export const getGoogleDriveFile = async (googleDriveFileID, googleToken) => {
  console.log(googleToken);
  const getGoogleDocResponse = await axios({
    url: `https://www.googleapis.com/drive/v2/files/${googleDriveFileID}?alt=media`,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + googleToken,
      'Content-Type': 'application/json'
    },
  });
  return getGoogleDocResponse;
};

export const searchSpotifyTrack = async (searchInput) => {

};

export const deleteAccountAndPlaylists = async (userPlaylistMetas, firebaseUserId, firebaseToken) => {
  console.log(firebaseToken)
  // first, try and delete user's playlists, playlistMetas and publicStats

  // first, get all firebase playlist objs' ids
  const firebasePlaylistIdsAndMetaIds = userPlaylistMetas.map(e => ({
    firebasePlaylistId: e.firebasePlaylistId,
    metaId: e.metaId,
  }));

  // then do deleteFirebasePlaylist() for each of those
  const deletePlaylistsAndMetaResponses = await Promise.all(
    firebasePlaylistIdsAndMetaIds.map(async (obj) => (await deleteFirebasePlaylist(obj.firebasePlaylistId, obj.metaId, firebaseToken).then(res => res))
    ));

  console.log(deletePlaylistsAndMetaResponses)

  const deletePlaylistsAndMetaResponsesAll200Or204 = deletePlaylistsAndMetaResponses.every(e => e === 200 || e === 204);

  if (!deletePlaylistsAndMetaResponsesAll200Or204) return null;

  const correspPublicStats = await axios.get(`${firebaseUrl}/publicStats.json?orderBy="firebaseUserId"&equalTo="${firebaseUserId}"&auth=${firebaseToken}`);

  if (correspPublicStats.status === 200) {
    console.log('b')
    const { data } = correspPublicStats;
    const publicStatsIds = Object.keys(data); // ['-as98a7sduh', ...]
    const deletePublicStatsQueries = publicStatsIds.map(publicStatsId => (`${firebaseUrl}/publicStats/${publicStatsId}.json?auth=${firebaseToken}`));

    const deletePublicStatsResponses = await Promise.all(deletePublicStatsQueries.map(async (query) => (await axios.delete(query).catch(e => { console.log(e); return e }))));

    const deletePublicStatsResponsesAll200Or204 = deletePublicStatsResponses.every(e => [200, 204].includes(e.status));

    if (!deletePublicStatsResponsesAll200Or204) return null;

    // if that all goes okay, can fully delete the user's account
    const token = localStorage.getItem('token');

    // exchange refresh token for new ID token
    const refreshToken = localStorage.getItem('refreshToken');

    const refreshBody = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    const refreshResponse = await axios.post(`https://securetoken.googleapis.com/v1/token?key=${process.env.REACT_APP_API_KEY}`, refreshBody).then(res => res).catch(e => e.response);

    console.log(refreshResponse)

    if (refreshResponse.status !== 200) return null;

    const newIdToken = refreshResponse.data.id_token;
    localStorage.setItem('token', newIdToken);

    const deleteRequestBody = {
      idToken: newIdToken,
    };

    const userDeleteResponse = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${process.env.REACT_APP_API_KEY}`, deleteRequestBody).catch(e => { console.log(e); return e.response.status });
    console.log(userDeleteResponse);
    if ([200, 204].includes(userDeleteResponse.status)) {
      return 200;
    } else {
      return null;
    }

  } else {
    return null;
  }

};

/*
.playlistMetas = .userId is firebaseUserId
and each playlistMeta has a .firebasePlaylistId
 
.playlists on .playlists.json have a -ID which is a .firebasePlaylistId on corresp. playlistMeta
 
.publicStats = .userId is firebaseUserId
*/