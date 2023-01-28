const spotiOrYTRegex = () => {
  const spotiYTRegexPattern = '(open.spotify.com\/track\/[^\s]*)|(youtu.be\/[^\s]*)|(youtube.com\/[^\s]*)'
  const spotifyOrYoutubeLinkRegex = new RegExp(`${spotiYTRegexPattern}`, 'm');
  return spotifyOrYoutubeLinkRegex;
};
const link = 'https://open.spotify.com/track/1CcnE9kM0wxQsxx9nonIfo';

const res = link.match(/(open.spotify.com\/track\/[^\s]*)|(youtu.be\/[^\s]*)|(youtube.com\/[^\s]*)/g);
console.log(res)