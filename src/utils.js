import axios from 'axios';

export const spotiOrYTRegex = () => {
  const spotiYTRegexPattern = '(open.spotify.com\/track\/.*)|(youtu.be\/.*)|(youtube.com\/.*)'
  const spotifyOrYoutubeLinkRegex = new RegExp(`${spotiYTRegexPattern}`, 'g');
  return spotifyOrYoutubeLinkRegex;
};

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


// ?orderBy="spotifyPlaylistId"&equalTo=${spotifyPlaylistId}

export const splitTextIntoIndividualMessages = (inputText) => {
  const individualMessages = inputText.trim().split(/(?=^\d{1,2}\/\d{1,2}\/\d{4})/m).filter(Boolean)

  // iterate over individualMessages
  const messageDateTimeRegex = /\w{2}\/\w{2}\/\w{4},\s{1}\w{2}\:\w{2}/g
  const allPostsCrude = [];
  let postCounter = 0;

  for (let i = 0; i <= individualMessages.length; i++) {
    const singleMessage = individualMessages[i];
    if (spotiOrYTRegex().test(singleMessage)) { // if this message contains one or more Spoti or YT links...
      // grab required data
      const dateTime = singleMessage.match(messageDateTimeRegex)[0]; // 14/01/2023, 15:00
      const poster = singleMessage.match(/-\s{1}.*:/g)[0].match(/-\s{1}(\S*)/g)[0].slice(2).replace(/\:$/, ''); // 'Sam'
      const spotiOrYTLinks = [...singleMessage.matchAll(spotiOrYTRegex())].map(arrEl => arrEl[0].trim());

      // iterate over all Spoti or YT links in this message, and compose a postObj for each link found
      spotiOrYTLinks.forEach(link => {
        const decideLinkType = (urlString) => {
          let linkType = 'spotify';
          if (/youtu.*/g.test(urlString)) linkType = 'youtube';
          return linkType;
        };

        postCounter++;
        const postObj = {
          postId: postCounter,
          poster: poster,
          dateTime: dateTime,
          linkType: decideLinkType(link),
          linkURL: link,
        };
        // then push this postObj into allPostsCrude
        allPostsCrude.push(postObj);
      });
    }
  };
  return allPostsCrude;
};
