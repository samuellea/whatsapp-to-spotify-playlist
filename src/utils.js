import axios from 'axios';
import * as accents from 'remove-accents';

export const createSpotifyPlaylist = (user_id, spotifyToken, newPlaylistName) => {
  return axios({
    method: 'post',
    url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
    headers: { 'Authorization': 'Bearer ' + spotifyToken },
    data: {
      'name': newPlaylistName,
      'description': 'Created and maintained using whatsapp-to-sptofiy-playlist',
      'public': true,
    }
  });
};

// create playlist metadata object on this user's FB /users/:user_id endpoint
export const createFirebasePlaylistMetadata = (spotifyPlaylistId, spotifyPlaylistName, userId, token) => {
  const playlistMetadata = {
    spotifyPlaylistId: spotifyPlaylistId,
    spotifyPlaylistName: spotifyPlaylistName,
    totalTracks: 0,
  };
  return axios({
    url: `https://whatsapp-to-spotify-playlist-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/playlistMetas.json?auth=${token}`,
    method: 'POST',
    data: JSON.stringify(playlistMetadata),
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// create playlist object on the FB /playlists endpoint
export const createOrUpdateFirebasePlaylist = (method, firebaseUserId, token, playlistData) => {
  return axios({
    url: `https://whatsapp-to-spotify-playlist-default-rtdb.europe-west1.firebasedatabase.app/playlists.json?auth=${token}`,
    method: method,
    data: JSON.stringify(playlistData),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((firebaseRes => {
    if ([200, 201].includes(firebaseRes.status)) {
      // create a metadata on /users/:user_id
      const { spotifyPlaylistId, spotifyPlaylistName } = playlistData;
      return createFirebasePlaylistMetadata(spotifyPlaylistId, spotifyPlaylistName, firebaseUserId, token).then((firebaseRes2 => {
        if ([200, 201].includes(firebaseRes2.status)) {
          return { success: true }
        } else {
          // TO-DO delete playlist obj on firebase /playlists endpoint
          return { success: false }
        }
      }))
    } else {
      // error - dont bother creating metadata object, just return false and stop FB playlist creation on the 2 endpoints here.
      console.log('6');
      return { success: false }
    }
  }));
};

export const getUserFirebasePlaylistsMetadata = (userId, token) => {
  return axios({
    url: `https://whatsapp-to-spotify-playlist-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=${token}`,
    method: 'GET',
  });
};

export const getFirebasePlaylist = (spotifyPlaylistId, token) => {
  return axios({
    url: `https://whatsapp-to-spotify-playlist-default-rtdb.europe-west1.firebasedatabase.app/playlists.json?orderBy="spotifyPlaylistId"&equalTo="${spotifyPlaylistId}"&auth=${token}`,
    method: 'GET',
  });
};


export const getYoutubeVideosAndClosestSpotifyMatches = async (youtubePosts, youtubeApiKey, spotifyToken) => {
  // HANDLE ANY YOUTUBE LINKS
  const youtubeApiBaseURL1 = 'https://content-youtube.googleapis.com/youtube/v3/videos?id=';
  const youtubeApiBaseURL2 = `&part=snippet%2CcontentDetails%2Cstatistics&key=${youtubeApiKey}`;

  if (youtubePosts.length) {
    // extract the YT video IDs from those, and create GET promises with them.
    const videoDataQueries = youtubePosts.map(youtubePost => {
      const youtubeIDRegex = /(?<=v=|v\/|vi=|vi\/|youtu.be\/)[a-zA-Z0-9_-]*/g;
      const videoID = youtubePost.linkURL.match(youtubeIDRegex);
      const youtubeQuery = `${youtubeApiBaseURL1}${videoID}${youtubeApiBaseURL2}`;
      return youtubeQuery;
    })

    const youtubeGetResponses = await Promise.all(
      videoDataQueries.map(async (query) => (await axios.get(query)))
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

    // search Spotify API using these returned YT titles
    const spotifySearchQueries = videoDataObjs.map(el => el?.title ? `https://api.spotify.com/v1/search?q=${el.title}&type=track&limit=5` : null);

    const spotifyGetResponses = await Promise.all(
      spotifySearchQueries.map(async (query) => {
        if (!query) { return null } else {
          return await axios.get(query, {
            headers: {
              Authorization: `Bearer ${spotifyToken}`
            }
          })
        }
      })
    );

    // see if we can decide out of the 5 spotify tracks returned for each search with a video title
    // WHICH is the most likely correct result.
    // return the FIRST result in either an array of tracks scored for similarity with the youtube title,
    // or the original array of 5 (the limit) tracks returned to us for each search by Spotify.

    const closestMatchInEachSpotifySearchResponse = spotifyGetResponses.map((spotiRes, i) => {
      const correspondingVideoTitle = videoDataObjs[i] ? accents.remove(videoDataObjs[i].title) : null;
      if (!spotiRes) { return null } else {

        const fiveTracksCondensed = spotiRes.data.tracks.items.map(item => {
          const title = accents.remove(item.name);
          const artists = accents.remove(item.artists.map(artist => artist.name).join(' '));
          const titleAndArtists = [title, artists].join(' ');
          return titleAndArtists;
        })

        const fiveTracksScored = fiveTracksCondensed.map((titleAndArtistsJoined, i) => {
          const scoreSimilarity = (aVideoTitle, aString) => {
            let count = 0;
            const videoTitleTerms = aVideoTitle.split(' ').filter(term => {
              const termsToRemove = ['&', '-', '+'];
              if (!termsToRemove.includes(term)) return term;
            });
            videoTitleTerms.forEach(term => aString.includes(term) ? count++ : null)
            return count;
          };
          const similarity = scoreSimilarity(correspondingVideoTitle, titleAndArtistsJoined);
          return { similarity: similarity, trackMeta: titleAndArtistsJoined, itemsIndex: i };
        })

        // choose the most likely index of spotiRes.data.tracks.items
        const highestScore = Math.max(...fiveTracksScored.map(e => e.similarity));
        const highestScoringCandidates = fiveTracksScored.filter(e => e.similarity === highestScore);
        const highestScoringCandidate = highestScoringCandidates[0];
        return spotiRes.data.tracks.items[highestScoringCandidate.itemsIndex];
      }

    });

    const spotifyDataObjs = closestMatchInEachSpotifySearchResponse.map((el, i) => {
      const spotifyTrackData = { ...youtubePosts[i] };
      spotifyTrackData.artist = el?.artists.map(artist => artist.name).join(', ') || null;
      spotifyTrackData.title = el?.name || null;
      spotifyTrackData.thumbnail = el?.album.images[1].url || null;
      spotifyTrackData.spotifyTrackID = el?.id || null;
      spotifyTrackData.include = el ? true : false;
      return spotifyTrackData;
    });
    // console.log('🍿 --------------------');
    // console.log(videoDataObjs);
    // console.log('💿 --------------------');
    // console.log(spotifyDataObjs);

    // const spotifyDataObjsWithCorrespondingPostIDs = spotifyDataObjs.map((obj, i) => ({ postId: youtubePosts[i].postId, data: obj ? { ...obj } : null }));

    // return { videoDataObjs, spotifyDataObjs: spotifyDataObjsWithCorrespondingPostIDs };
    return { videoDataObjs, spotifyDataObjs: spotifyDataObjs };
  } else {
    return null;
  }
};

export const getSpotifyTrackData = async (spotifyPosts) => {
  console.log(spotifyPosts);

};
