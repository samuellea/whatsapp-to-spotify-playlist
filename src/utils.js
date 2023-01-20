import firebaseAxios from './firebaseAxios.js';
import axios from 'axios';

export const createSpotifyPlaylist = (user_id, spotifyToken, newPlaylistName) => {
  return axios({
    method: 'post',
    url: `https://api.spotify.com/v1/users/${user_id}/playlists`,
    headers: { 'Authorization': 'Bearer ' + spotifyToken },
    data: {
      'name': newPlaylistName,
      'description': 'New playlist description',
      'public': true,
    }
  });
};

export const createFirebasePlaylist = (newPlaylistName, firebaseToken) => {
  const data = { id: 1, info: newPlaylistName };
  const jsonifiedData = JSON.stringify(data);
  console.log(jsonifiedData);
  return axios({
    url: `https://whatsapp-to-spotify-playlist-default-rtdb.europe-west1.firebasedatabase.app/playlists.json?auth=${firebaseToken}`,
    method: 'POST',
    data: jsonifiedData, // you need to stringify this yourself
    headers: {
      'Content-Type': 'application/json'
    }
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
