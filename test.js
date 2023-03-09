const spotifyTrackIDRegex = () => {
  // const spotifyTrackIDPattern = /(?<=open.spotify.com\/track\/)(.*)/g
  const spotifyTrackIDPattern = /(?:open.spotify.com\/track\/)(.*)/i
  return spotifyTrackIDPattern;
};

const link = `open.spotify.com/track/4TFtYsNd37rqc3rtYHM267?si=AsVuPxjxR86NzvLXpdyoRg`;

let linkID;

linkID = link.match(spotifyTrackIDRegex())[1].split('?')[0];

console.log(linkID);
