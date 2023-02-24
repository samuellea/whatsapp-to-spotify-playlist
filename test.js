const correspondingVideoTitle = `Meredith Brooks i'm a bitch i'm a lover (with lyrics)`;
const titleAndArtistsJoined = 'bitch meredith brooks';

const scoreSimilarity = (aVideoTitle, aString) => {
  console.log('aString:')
  console.log(aString)
  let count = 0;
  const videoTitleTerms = aVideoTitle.split(' ').filter(term => {
    const termsToRemove = ['&', '-', '+'];
    if (!termsToRemove.includes(term)) return term;
  });
  console.log('videoTitleTerms:')
  console.log(videoTitleTerms)
  console.log(aString.split(' '));
  videoTitleTerms.forEach(term => {
    if (aString.split(' ').includes(term)) count++;
  });

  // handle karaoke versions - if 'karaoke' not in vid title, and 'karoke' found in Spoti result title, set similarity = 0
  // if (!h.stringContainsKaraoke(aVideoTitle) && h.stringContainsKaraoke(aString)) count = 0;

  return count;
};

const similarity = scoreSimilarity(correspondingVideoTitle.toLowerCase(), titleAndArtistsJoined.toLowerCase());

console.log(similarity);