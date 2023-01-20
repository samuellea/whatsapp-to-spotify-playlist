import firebaseAxios from './firebaseAxios.js';
import axios from 'axios';

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

export const createFirebasePlaylist = (newSpotifyPlaylistId, newSpotifyPlaylistName, userId, token) => {
  const data = { spotifyPlaylistId: newSpotifyPlaylistId, spotifyPlaylistName: newSpotifyPlaylistName, totalTracks: 0 };
  return axios({
    url: `https://whatsapp-to-spotify-playlist-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/playlists.json?auth=${token}`,
    method: 'POST',
    data: JSON.stringify(data), // you need to stringify this yourself
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getUserFirebasePlaylists = (userId, token) => {

  /*
   firebaseAxios.get(`/artists.json?auth=${token}&orderBy="artist"&equalTo=${artistEncrypted}`).then(({ dat
  */
  console.log('userId: ' + userId);

  return axios({
    // url: `https://whatsapp-to-spotify-playlist-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}/playlists.json?auth=${token}`,
    url: `https://whatsapp-to-spotify-playlist-default-rtdb.europe-west1.firebasedatabase.app/users/${userId}.json?auth=${token}`,
    method: 'GET',
  });
};

// export const getUserPlaylists = (firebaseEndpoint, userId, token) => {
//   console.log('getUserPlaylists')
//   return new Promise((resolve, reject) => {
//     try {
//       return firebaseAxios.get(`${firebaseEndpoint}?auth=${token}`).then(({ data }) => {
//         console.log(data);
//         if (data !== null) {
//           // const { isLastPage, posts } = Object.values(data)[0]
//           // const allPostsSorted = ([...decryptPosts(posts), ...statePosts]).sort((a, b) => Number(b.postId) - Number(a.postId));
//           // return resolve({ isLastPage, allPostsSorted, reqError: false });
//         } else {
//           // console.log('Nothing on the request FB page_ currently!')
//           // return resolve({ isLastPage: null, allPostsSorted: null, reqError: true })
//         };
//       }).catch(err => { console.log('💩'); console.log(err) })
//     } catch (e) {
//       console.log('🧟‍♀️')
//     }
//   });
// };
