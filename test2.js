const timeObjInMs = (timeObj) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const timeAsString = `${months[+timeObj.month - 1]} ${+timeObj.day}, ${timeObj.year} ${timeObj.hour}:${timeObj.minute}:00`;
  const timeStringAsDate = new Date(timeAsString);
  const timeAsMilliseconds = timeStringAsDate.getTime();
  return timeAsMilliseconds;
};



const rawPostsLog = [
  { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: 2020, month: 01, day: 30, hour: 13, minute: 00 } },
  { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: 2020, month: 02, day: 01, hour: 09, minute: 00 } },
  { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: 2020, month: 02, day: 14, hour: 20, minute: 30 } },
];

const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: 2020, month: 02, day: 01, hour: 00, minute: 00 } };


const postWithSameLinkAndWithin24HrsAlreadyInRawPostsLog = rawPostsLog.find(rawPost => {
  const sameLink = rawPost.linkID === inputPost.linkID && rawPost.linkType === inputPost.linkType;
  const rawPostTimeMs = timeObjInMs(rawPost.time);
  const inputPostTimeMs = timeObjInMs(inputPost.time);
  const hrs24InMs = 86400000;
  const inputPostTimePlus24HrsMs = inputPostTimeMs + hrs24InMs;
  const inputPostTimeMinus24HrsMs = inputPostTimeMs - hrs24InMs;
  const within24Hrs = rawPostTimeMs < inputPostTimePlus24HrsMs && rawPostTimeMs > inputPostTimeMinus24HrsMs;
  return within24Hrs && sameLink;
});

console.log(postWithSameLinkAndWithin24HrsAlreadyInRawPostsLog)