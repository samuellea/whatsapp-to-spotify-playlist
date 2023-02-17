// const trackString = 'https://open.spotify.com/track/1gqk2dawfdLdn4XamF27cx?si=_cEsXGtqQcK5QlbVsSyC_w';
// const albumString = 'https://open.spotify.com/album/5uvoX0fFiT1QFpZXntsI3j?si=kwjehdY1QjSLVFoR2LrQZw';
// const playlistString = 'https://open.spotify.com/playlist/73LFLxYf6kf6IOIBTVWMPJ?si=2DzfFl21Qym1K3xgWZgCTw';

// let urlString = playlistString;

// let linkType;
// if (/open.spotify.com\/track\/.*/g.test(urlString)) linkType = 'spotify';
// if (/open.spotify.com\/album\/.*/g.test(urlString)) linkType = 'spotifyAlbum';
// if (/open.spotify.com\/playlist\/.*/g.test(urlString)) linkType = 'spotifyPlaylist';
// // console.log(linkType);



// const spotifyTrackIDRegex = () => {
//   const spotifyTrackIDPattern = /(?<=open.spotify.com\/track\/)(.*)/g
//   return spotifyTrackIDPattern;
// }

// const spotifyAlbumIDRegex = () => {
//   const spotifyTrackIDPattern = /(?<=open.spotify.com\/album\/)(.*)/g
//   return spotifyTrackIDPattern;
// }

// const spotifyPlaylistIDRegex = () => {
//   const spotifyTrackIDPattern = /(?<=open.spotify.com\/playlist\/)(.*)/g
//   return spotifyTrackIDPattern;
// }

// const link = urlString;
// let linkID;
// if (linkType === 'spotify') linkID = link.match(spotifyTrackIDRegex())[0].split('?')[0];
// if (linkType === 'spotifyAlbum') linkID = link.match(spotifyAlbumIDRegex())[0].split('?')[0];
// if (linkType === 'spotifyPlaylist') linkID = link.match(spotifyPlaylistIDRegex())[0].split('?')[0];

// console.log(linkID);

const obj = {
  id: 1,
  linkType: 'youtube',
  thumbnail: 'somejpeg.jpg',
  title: 'My Youtube Video lol'
};

const neededKeys = ['thumbnail', 'title'];

// console.log(neededKeys.every(key => Object.entries(obj).includes(key)));
const requiredKeys = Object.entries(obj).filter(entriesArr => neededKeys.includes(entriesArr[0]));
console.log(requiredKeys.every(e => e[1]))