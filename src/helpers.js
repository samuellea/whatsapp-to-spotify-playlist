import _, { constant } from "lodash";
import FontFaceObserver from 'fontfaceobserver';
import getUserLocale from 'get-user-locale';

export const spotiTrackAlbumPlaylistOrYTRegex = () => {
  const spotiTrackAlbumPlaylistOrYTPattern = /(open.spotify.com\/track\/[^\s]*)|(open.spotify.com\/album\/[^\s]*)|(open.spotify.com\/playlist\/[^\s]*)|(youtu.be\/[^\s]*)|(youtube.com\/(?!shorts)[^\s]*)/g
  return spotiTrackAlbumPlaylistOrYTPattern;
};

export const spotiOrYTRegex = () => {
  const spotiYTRegexPattern = /(open.spotify.com\/track\/[^\s]*)|(youtu.be\/[^\s]*)|(youtube.com\/(?!shorts)[^\s]*)/g
  return spotiYTRegexPattern;
};

export const spotifyTrackIDRegex = () => {
  const spotifyTrackIDPattern = /(?:open.spotify.com\/track\/)(.*)/i
  return spotifyTrackIDPattern;
};

export const spotifyAlbumIDRegex = () => {
  const spotifyTrackIDPattern = /(?:open.spotify.com\/album\/)(.*)/i
  return spotifyTrackIDPattern;
}

export const spotifyPlaylistIDRegex = () => {
  const spotifyTrackIDPattern = /(?:open.spotify.com\/playlist\/)(.*)/i
  return spotifyTrackIDPattern;
}

export const youtubeVideoIDRegex = () => {
  const youtubeVideoIDPattern = /(?:v=|v\/|vi=|vi\/|youtu.be\/)([a-zA-Z0-9_-]{11})/i;
  return youtubeVideoIDPattern;
};

// 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 

export const splitTextIntoIndividualMessages = (inputText) => {
  const splitByMsgStart = inputText.split(/(\d{1,4}[\W\D]{1}\d{1,4}[\W\D]{1}\d{1,4}\,?\s{1}[0-9]{2}\:{1}[0-9]{2}\s{1}\-{1})/g);
  //
  let newStr = '';

  const individualMessages = splitByMsgStart.reduce((acc, e, i) => {
    if ((/^\d{1,4}[\W\D]{1}\d{1,4}[\W\D]{1}\d{1,4}\,?\s{1}[0-9]{2}\:{1}[0-9]{2}/gm).test(e)) {
      acc.push(newStr.trim());
      newStr = e;
    } else {
      newStr += (' ' + e);
    }
    if (i === splitByMsgStart.length - 1) acc.push(newStr.trim());
    return acc;
  }, []);
  const individualMessagesBlanksRemoved = individualMessages.filter(e => e.length);
  const newlinesReplacedWithSpaces = individualMessagesBlanksRemoved.map(e => e.replaceAll('\n', ' '));
  // console.log(newlinesReplacedWithSpaces);
  return newlinesReplacedWithSpaces;
};

// 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 




export const coerce2DigitYearTo4DigitYear = (twoDigitYearStr, currentYear) => {
  /* assume most recent message in the text was posted in current century (2099, uploading 2100) = 2199

what is current year?  "2100"
2 init century = current year first 2 digits
is (2 digit YEAR in most recent message (99) + 2 init century (2199)) GREATER than current YEAR?!
if yes, 2 init century = current year 1st 2 digits, coerce num MINUS ONE (21 --> 20)
if no, 2 init century = current year 1st 2 digits
result = 2 init century + 2 digit year
*/
  // const currentYear = new Date().getFullYear(); // 2023
  const currentYearFirstTwoDigits = `${currentYear.toString()[0]}${currentYear.toString()[1]}`;
  const proposedFourDigitYear = +`${currentYearFirstTwoDigits}${twoDigitYearStr}`;
  let twoInitCenturyMsgActual = currentYearFirstTwoDigits;
  if (proposedFourDigitYear > currentYear) twoInitCenturyMsgActual = +currentYearFirstTwoDigits - 1;
  const fourDigitYearMsgActual = `${twoInitCenturyMsgActual}${twoDigitYearStr}`;
  return fourDigitYearMsgActual;
};


export const coerceLanguageDateFormat = (splitBySeperator, locale) => {
  // console.log(splitBySeperator)
  // coerce any msg date in exported WhatsApp .txt to dd/mm/yyyy, return object with .day .month .year
  /*
  Supported locales and their date formats as exported in WhatsApp on a device with that system language locale:
  GB	      	= 28/02/2023	en-GB	dd/mm/yyyy	    DMY
  US	      	= 2/28/23	    en-US	(m)m/(d)d/yy  	MDY
  AUS	      	= 28/2/23	    en-AU	(d)d/(m)m/yy  	DMY
  CAN	      	= 2023-02-28	en-CA	yyyy-mm-dd	    YMD
  IRE	      	= 28/02/2023	en-IE	dd/mm/yyyy	    DMY
  NZ	      	= 28/02/23	  en-NZ	dd/mm/yy	      DMY
  SA	      	= 2023/02/28	en-ZA	yyyy/mm/dd	    YMD
  IND	      	= 28/02/23	  en-IN	dd/mm/yy	      DMY
  PH	      	= 2/28/23	    en-PH	(m)m/(d)d/yy	  MDY
  NED	      	= 28-02-2023	nl-NL	dd-mm-yyyy	    DMY
  TUR	      	= 28.02.2023 4.03.2023 tr-TR (d)d.mm.yyyy DMY
  FR    	  	= 28/02/2023	fr-FR	dd/mm/yyyy	    DMY
  FR CAN	  	= 2023-02-28	fr-CA	yyyy-mm-dd    	YMD
  GER	      	= 28.02.23	  de-DE	dd.mm.yy	      DMY
  SPAI   	  	= 28/2/23   	es-ES	(d)d/(m)m/yy	  DMY
  ITA	      	= 28/02/23	  it-IT	dd/mm/yy	      DMY
  SPAI USA	  = 28/2/2023   es-US	(d)d/(m)m/yyyy  DMY
  KOR	    	  = 23/2/28 !!	ko-KR	yy/(m)m/(d)d	  YMD
  JAP   	  	= 2023/02/28	ja-JP	yyyy/mm/dd	    YMD
  CHI SIMP  	= 2023/2/28	  zh-CN	yyyy/(m)m/(d)d	YMD
  CHI TRAD HK	= 28/2/2023 	zh-HK	(d)d/(m)m/yyyy	DMY
  CHI TRAD TW	= 2023/2/28	  zh-TW	yyyy/(m)m/(d)d	YMD
  */

  // splitBySeperator = arr eg. ['28','02','2023'] or ['2','28','23']

  const formatIndexes = {
    DMY: { dayIndex: 0, monthIndex: 1, yearIndex: 2 },
    MDY: { dayIndex: 1, monthIndex: 0, yearIndex: 2 },
    YMD: { dayIndex: 2, monthIndex: 1, yearIndex: 0 },
  };

  const locales = {
    'en-GB': formatIndexes.DMY,
    'en-US': formatIndexes.MDY,
    'en-AU': formatIndexes.DMY,
    'en-CA': formatIndexes.YMD,
    'en-IE': formatIndexes.DMY,
    'en-NZ': formatIndexes.DMY,
    'en-ZA': formatIndexes.YMD,
    'en-IN': formatIndexes.DMY,
    'en-PH': formatIndexes.MDY,
    'nl-NL': formatIndexes.DMY,
    'tr-TR': formatIndexes.DMY,
    'fr-FR': formatIndexes.DMY,
    'fr-CA': formatIndexes.YMD,
    'de-DE': formatIndexes.DMY,
    'es-ES': formatIndexes.DMY,
    'it-IT': formatIndexes.DMY,
    'es-US': formatIndexes.DMY,
    'ko-KR': formatIndexes.YMD,
    'ja-JP': formatIndexes.YMD,
    'zh-CN': formatIndexes.YMD,
    'zh-HK': formatIndexes.DMY,
    'zh-TW': formatIndexes.YMD,
  };

  // get array into correct order = DMY
  const correctOrder = [
    splitBySeperator[locales[locale].dayIndex],
    splitBySeperator[locales[locale].monthIndex],
    splitBySeperator[locales[locale].yearIndex],
  ]; // ['28','02','2023'] (day, month, year | DMY)

  // console.log(correctOrder, ' <-- correctOrder')
  // year index is last index. if element length at year index is < 4, add Init 2 Century Digits at start ('20')
  const yearIndex = correctOrder.length - 1;
  const currentYear = new Date().getFullYear(); // 2023
  correctOrder[yearIndex] = correctOrder[yearIndex].length === 4 ? correctOrder[yearIndex] : `${coerce2DigitYearTo4DigitYear(correctOrder[yearIndex], currentYear)}`

  // make any elements that are length 1 have an '0' at start
  const allMin2DigitsYear4Digits = correctOrder.map(e => e.length < 2 ? `0${e}` : e);
  // ['dd', 'mm', 'yyyy']
  return ({
    day: allMin2DigitsYear4Digits[0],
    month: allMin2DigitsYear4Digits[1],
    year: allMin2DigitsYear4Digits[2],
  });
};

export const msgTimeComponents = (singleMessage, locale) => {
  // console.log(singleMessage, ' <-- singleMessage')
  const msgTrimmed = singleMessage.trim();
  // if a message found to NOT BE 24 HOUR TIME, return null. 
  if (/^\d{1,4}[\W\D]{1}\d{1,4}[\W\D]{1}\d{1,4}\,?\s{1}[0-9]{2}\:{1}[0-9]{2}(?:\s{1}\-{1})/gm.test(msgTrimmed) === false) return null;
  // const yes = singleMessage.includes('05re487C0a3bJNZnPfDqMp');
  // handles times in 12hr or 24hr format, as well as glitched ASCII as can be copied/pasted
  // from exports handled on mobile (eg. '12:30^£_pm);

  const dateTime = msgTrimmed.trim().slice(0, msgTrimmed.indexOf(' - ')).trim(); // boundary of the date and time and then the poster name! eg dd-mm-yyyy, 12:30 - Sam


  const noCommas = dateTime.replace(',', '');
  const datePortion = noCommas.split(' ')[0].trim();
  const timePortion = noCommas.split(' ')[1].trim();
  // console.log(datePortion.trim(), '<-- datePortion ' + datePortion.length)


  let separator = '/';
  if (datePortion.includes('.')) separator = '.';
  if (datePortion.includes('-')) separator = '-';
  if (datePortion.includes('/')) separator = '/';
  if (datePortion.includes(',')) separator = ',';
  const splitBySeperator = datePortion.split(separator);
  // console.log(splitBySeperator, ' <-- splitBySeperator');
  // const datePortionDoubleDigits = splitBySeperator.map(e => {
  //   if (e.length >= 4) return e;
  //   if (e.length < 2) return `0${e}`;
  //   return e;
  // }).join('/');
  // console.log(datePortionDoubleDigits, ' <-- datePortionDoubleDigits');

  const localeDateCoerced = coerceLanguageDateFormat(splitBySeperator, locale); // ['dd', 'mm', 'yyyy']

  const colonIndex = timePortion.indexOf(':');
  let hourPortion = timePortion.slice(0, colonIndex); // * NB 'let'
  const minutePortion = timePortion.slice(colonIndex + 1, colonIndex + 3);

  // 🚨 🚨 🚨 - 12 HOUR CLOCK FORMAT ALSO APPEARS TO BE LOCALIZED ('8:09 abend' in Germany, 'gece 8:09' in Turkey etc.) - AM|PM can not always be handled!
  // instead, we are going to make user check / set their system time to 24 hours BEFORE THEY EXPORT W/A CHAT.
  const is12Hr = (['am', 'pm'].includes(timePortion.slice(-2)));
  if (is12Hr) {
    const amOrPm = timePortion.slice(-2);
    if (amOrPm === 'am') hourPortion = `0${hourPortion}`.slice(-2);
    if (amOrPm === 'pm' && hourPortion !== '12') hourPortion = +hourPortion + 12;
    if (amOrPm === 'am' && hourPortion === '12') hourPortion = '00';
  };
  // 🚨 🚨 🚨

  return {
    day: localeDateCoerced.day,
    month: localeDateCoerced.month,
    year: localeDateCoerced.year,
    hour: `${hourPortion}`,
    minute: minutePortion,
  };
};

export const splitIndividualMessagesIntoPosts = (individualMessages) => {
  // iterate over individualMessages
  // const messageDateTimeRegex = /\w{2}\/\w{2}\/\w{4},\s{1}.*(?=\s{1}-\s{1}.*\:)/g
  const allPostsCrude = [];
  let postCounter = 0;

  // (1[0-2]|0?[1-9]):[0-5][0-9].*((am|pm)(?=\s{1}-\s{1}.*\:))
  // console.log(individualMessages)

  let error12HrFound = false;

  const locale = getUserLocale();

  for (let i = 0; i < individualMessages.length; i++) {
    const singleMessage = individualMessages[i].trim();
    // console.log(singleMessage);

    const timeComponentsObj = msgTimeComponents(singleMessage.trim(), locale);
    // console.log(timeComponentsObj)
    if (!timeComponentsObj) {
      // console.log('12hr!!! ERROR')
      error12HrFound = true;
      return;
    }

    if (spotiTrackAlbumPlaylistOrYTRegex().test(singleMessage)) { // if this msg contains one or more Spoti (track/album/pl) or YT links...

      // grab required data
      const poster = singleMessage.match(/(?:-)(.*?)(?=:)/i)[1].trim();
      const spotiOrYTLinks = [...singleMessage.matchAll(spotiTrackAlbumPlaylistOrYTRegex())].map(arrEl => arrEl[0].trim());

      // iterate over all Spoti or YT links in this message, and compose a postObj for each link found
      spotiOrYTLinks.forEach(link => {

        const decideLinkType = (urlString) => {
          let linkType = 'spotify';
          if (/open.spotify.com\/track\/.*/g.test(urlString)) linkType = 'spotify';
          if (/open.spotify.com\/album\/.*/g.test(urlString)) linkType = 'spotifyAlbum';
          if (/open.spotify.com\/playlist\/.*/g.test(urlString)) linkType = 'spotifyPlaylist';
          if (/youtu.*/g.test(urlString)) linkType = 'youtube';
          return linkType;
        };

        const linkType = decideLinkType(link);
        let linkID;

        if (linkType === 'spotify') linkID = link.match(spotifyTrackIDRegex())[1].split('?')[0];
        if (linkType === 'spotifyAlbum') linkID = link.match(spotifyAlbumIDRegex())[1].split('?')[0];
        if (linkType === 'spotifyPlaylist') linkID = link.match(spotifyPlaylistIDRegex())[1].split('?')[0];
        if (linkType === 'youtube') linkID = link.match(youtubeVideoIDRegex())[1];

        postCounter++;
        const postObj = {
          postId: postCounter,
          poster: poster,
          linkType: linkType,
          linkID: linkID,
          time: timeComponentsObj,
        };
        // then push this postObj into allPostsCrude
        allPostsCrude.push(postObj);
      });
    }
  };

  if (error12HrFound) { console.log('error12HrFound!'); return null; }
  return allPostsCrude;
};

export const timeObjInMs = (timeObj) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const timeAsString = `${months[+timeObj.month - 1]} ${+timeObj.day}, ${timeObj.year} ${timeObj.hour}:${timeObj.minute}:00`;
  const timeStringAsDate = new Date(timeAsString);
  const timeAsMilliseconds = timeStringAsDate.getTime();
  return timeAsMilliseconds;
};

export const findInputPostInRawPostsLog = (inputPost, rawPostsLog) => {
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
  return postWithSameLinkAndWithin24HrsAlreadyInRawPostsLog; // 'undefined' if not found, a matching rawPostsLog obj if found
};

export const newPostsNotInRawPosts = (inputTextAsRawPosts, rawPostsLog) => {
  console.log(inputTextAsRawPosts);

  console.log(rawPostsLog);
  // when checking new inputText against rawPostsLog from previous updates,
  // poster cannot be relied upon (this can change based on user's contacts list at the time of exporting WhatsApp chat)
  // time cannot be relied upon - time on exported chats is based on phone's system time, so times on msgs in exported chats can be different
  //                            - 12 hour / 24 hour mode might have been changes on phone, or user might be using network time in a different timezone
  // interestingly, day, month and year are preserved - the issue is with the HH:MM / H:MM(am|pm) time.
  // So we've decided to check - is there an obj in rawPostsLog with linkID === input post linkID && linkType === input post linkType?
  //                           - AND is this rawPostsLog obj's time IN MS LESS than input post + 24 hours (in MS) AND GREATER than input post - 24 hours (in MS)?

  const onlyNewPosts = inputTextAsRawPosts.reduce((acc, inputPost, i) => {
    const samePostFound = findInputPostInRawPostsLog(inputPost, rawPostsLog); // 'undefined' if not found, a matching rawPostsLog obj if found
    // if undefined, no objects exist in rawPostsLog that a) have inputPost's link, and b) have a time within +24/-24 hours of inputPost's time
    // therefore, our inputPost hasn't been made before. It's new. So add it to our onlyNewPosts array!
    if (!samePostFound) acc.push(inputPost);
    return acc;
  }, []);

  return onlyNewPosts;
};

export const findInputTextNewPosts = (inputText, rawPostsLog) => {
  const inputTextAsMessages = splitTextIntoIndividualMessages(inputText);
  console.log(inputTextAsMessages);
  const inputTextAsRawPosts = splitIndividualMessagesIntoPosts(inputTextAsMessages);
  console.log(inputTextAsRawPosts);
  const newPosts = newPostsNotInRawPosts(inputTextAsRawPosts, rawPostsLog);
  return newPosts;
};

export const inputTextIsValid = (inputText) => {
  let isValid = false;
  // should not include am|pm, abend, gece etc.
  const contains24HrFormatMsgStart = /(\d{1,4}[\W\D]{1}\d{1,4}[\W\D]{1}\d{1,4}\,?\s{1}[0-9]{2}\:{1}[0-9]{2}\s{1}\-{1})/gm.test(inputText);
  if (contains24HrFormatMsgStart) {
    // then check actually msgs containing Spoti/YT links
    const individualMessages = splitTextIntoIndividualMessages(inputText);
    const individualPosts = splitIndividualMessagesIntoPosts(individualMessages);
    if (individualPosts) individualPosts.length ? isValid = true : isValid = false;
  }
  return isValid;
};

export const mockSleep = async (milliseconds) => {
  const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  const sleep = async (fn, ...args) => await timeout(milliseconds);
  await sleep();
  return;
};

export const equalSpacedPosters = (arr, string) => {
  console.log(string)
  const longestNameLength = Math.max(...(arr.map(e => e.poster.length)));
  const diff = longestNameLength - string.length;
  const nameSpaced = string + new Array(diff + 1).join('\u00a0');
  return nameSpaced;
};

export const curtailString = (string, limit) => {
  let ender = '…';
  if (string.slice(-1) === '\u00a0') ender = '\u00a0';
  if (string.length > limit) return string.slice(0, limit - 1).concat(ender);
  return string;
}

// 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 
// this determines the key to use when a poster has been renamed or grouped
// NOT FOR determining the ORIGINAL poster!
export const determineTargetPoster = (poster, lookup, findOriginal = false) => {
  const { grouped = [], renamed = [] } = lookup;
  let targetPoster = poster;

  if (grouped) {
    // check if this poster has been grouped
    const objInGrouped = grouped.find(e => e.poster === poster);
    if (objInGrouped) {
      const objInRenamed = renamed.find(e => e.poster === objInGrouped.on);
      targetPoster = objInRenamed ? objInRenamed.to : objInGrouped.on;
    }
  };

  if (renamed) {
    // if not, and renamed arr exists, check if this poster has been renamed
    const objInRenamed = renamed.find(e => e.poster === poster);
    if (objInRenamed) targetPoster = objInRenamed.to;
    // if (objInRenamed) targetPoster = objInRenamed.poster;
  }
  return targetPoster;
};
// 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 🕵️ 🎯 



export const tallyContributions = (processedPostsLog, lookup) => {
  const res = processedPostsLog.reduce((acc, post) => {
    const { poster } = post;
    const targetPoster = determineTargetPoster(poster, lookup);
    // // let targetPoster;
    // let targetPoster = post.poster

    // if (grouped) {
    //   // check if this poster has been grouped
    //   const objInGrouped = grouped.find(e => e.poster === post.poster);
    //   if (objInGrouped) {
    //     const objInRenamed = renamed.find(e => e.poster === objInGrouped.on);
    //     targetPoster = objInRenamed ? objInRenamed.to : objInGrouped.on;
    //   }
    // };

    // if (renamed) {
    //   // if not, and renamed arr exists, check if this poster has been renamed
    //   const objInRenamed = renamed.find(e => e.poster === post.poster);
    //   if (objInRenamed) targetPoster = objInRenamed.to;
    // }

    // finally, check if acc obj already exist for this poster - if yes, update, if not add new
    const indexInAcc = acc.findIndex(e => e.poster === targetPoster);
    if (indexInAcc === -1) {
      acc.push({ poster: targetPoster, totalPosts: 1 });
    } else {
      acc[indexInAcc].totalPosts++;
    }
    return acc;
  }, [])
  const tallySorted = res.sort((a, b) => (+a.totalPosts < +b.totalPosts) ? 1 : -1)

  return tallySorted;
};

export const calcGroupTally = (grouped = [], renamed = []) => {
  const groups = grouped.reduce((acc, groupee, i) => {
    let targetOn = groupee.on;
    const onInRenamed = renamed.find(e => e.poster === groupee.on);
    if (onInRenamed) targetOn = onInRenamed.to;
    const indexInAcc = acc.findIndex(e => e.groupName === targetOn);
    if (indexInAcc !== -1) acc[indexInAcc].groupees.push(groupee.poster);
    if (indexInAcc === -1) acc.push({ groupName: targetOn, groupees: [groupee.poster] });
    return acc;
  }, []);

  const groupsWithGroupOnInGroupees = groups.map(group => {
    const { groupName, groupees } = group;
    let targetGroupName = groupName;
    const groupNameOriginal = renamed.find(e => e.to === groupName);
    if (groupNameOriginal) targetGroupName = groupNameOriginal.poster;
    const updated = { ...group, groupees: [...groupees, targetGroupName].sort() }
    return updated;
  });
  return groupsWithGroupOnInGroupees;
};

export const isContributorAGroup = (lookupInState, poster) => {
  const { grouped = [], renamed = [] } = lookupInState;
  return calcGroupTally(grouped, renamed).find(e => e.groupName === poster);
};

export const groupPostsByYear = (posts = []) => {

  const res = posts.reduce((acc, e) => {
    const indexOfYearObjInAcc = acc.findIndex(obj => obj.year === e.time.year);
    if (indexOfYearObjInAcc === -1) {
      const newYearObj = { year: e.time.year, posts: [e] }
      acc.push(newYearObj);
    } else {
      acc[indexOfYearObjInAcc].posts.push(e);
    }
    return acc;
  }, []);
  return res.sort((a, b) => (+a.year > +b.year) ? 1 : -1)
};

/* 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱  */
/* 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱  */
/* 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱  */
/* 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱  */
/* 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱  */
/* 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱 🌱  */


export const groupPostsByPosterYearAndMonth = (posts = [], lookup) => {

  const res = posts.reduce((acc, post) => {
    const { year, month } = post.time;
    const { poster } = post;
    const targetPoster = determineTargetPoster(poster, lookup);
    // create a year object in the acc if doesn't yet exist, or find its index if it does
    const yearObjInAcc = acc.find(e => e.year === year);
    if (!yearObjInAcc) acc.push({ year: year, months: [], posters: [] });
    const yearAccIndex = acc.findIndex(e => e.year === year);

    // update the months arr objects for this year object (creating if dont yet exist)
    const monthObjInYearMonths = acc[yearAccIndex].months.find(e => e.month === month);
    if (!monthObjInYearMonths) acc[yearAccIndex].months.push({ month: month, posts: [] });
    const monthYearAccIndex = acc[yearAccIndex].months.findIndex(e => e.month === month);

    const posterObjInMonthPosters = acc[yearAccIndex].months[monthYearAccIndex].posts.find(e => e.poster === targetPoster);
    if (!posterObjInMonthPosters) acc[yearAccIndex].months[monthYearAccIndex].posts.push({ poster: targetPoster, monthlyTotal: 0 });

    const postsMonthYearAccIndex = acc[yearAccIndex].months[monthYearAccIndex].posts.findIndex(e => e.poster === targetPoster);
    acc[yearAccIndex].months[monthYearAccIndex].posts[postsMonthYearAccIndex].monthlyTotal++;

    // update the posters arr objects for this year object (creating if dont yet exist)
    const posterObjInYearPosters = acc[yearAccIndex].posters.find(e => e.poster === targetPoster);
    if (!posterObjInYearPosters) acc[yearAccIndex].posters.push({ poster: targetPoster, total: 0 })
    const posterYearAccIndex = acc[yearAccIndex].posters.findIndex(e => e.poster === targetPoster);
    acc[yearAccIndex].posters[posterYearAccIndex].total++;
    return acc;
  }, []);

  // finally, sort various arrays and subarrays
  const sortedByYear = [...res].sort((a, b) => (+a.year > +b.year) ? 1 : -1);
  const monthsAndPostersSorted = sortedByYear.map(e => ({
    year: e.year,
    months: [...e.months].sort((a, b) => (+a.month > +b.month) ? 1 : -1).map(f => ({
      ...f, posts: [...f.posts].sort(function (a, b) {
        if (a.monthlyTotal > b.monthlyTotal) return 1;
        if (a.monthlyTotal < b.monthlyTotal) return -1;
        return (a.poster < b.poster) ? 1 : -1;
      }),
    })),
    posters: [...e.posters].sort((a, b) => (+a.total < +b.total) ? 1 : -1)
  }));
  return monthsAndPostersSorted;
};

export const determineOriginalPoster = () => {

};

export const listAllPosters = (posts, lookup) => {
  const res = posts.reduce((acc, e) => {
    let targetPoster = e.poster;
    const posterInAcc = acc.some(f => f === targetPoster);
    if (!posterInAcc) acc.push(targetPoster);
    return acc;
  }, []);
  return res;
};

export const createColourMap = (posters) => {
  // console.log(posters, ' <--- posters')
  // TO-DO: handle more than 24 posters / colours!
  const colourChoices = [
    'F78080',
    '9796F0',
    'ECDF6C',
    '66B06E',
    'CA9F45',
    '81DCFF',
    'FBA8F8',
    '96F0C4',
    'FCFFC8',
    'FFBCBC',
    'f9e79f',
    'abebc6',
    'f8c471',
    'fadbd8',
    'd1f2eb',
    'd2b4de',
    '78281f',
    '154360',
    'b7950b',
    '196f3d',
    '9c640c',
    '17a589',
    '1f618d',
    '4a235a',
  ];
  return posters.map((poster, i) => ({ poster: poster, colour: colourChoices[i] }))
};

export const pickPosterColour = (poster, lookup, colourMap) => {
  let targetPoster = poster;
  if (lookup.renamed) {
    const { renamed } = lookup;
    const renamedPosterIndex = renamed.findIndex(e => e.to === poster);
    targetPoster = renamedPosterIndex !== -1 ? renamed[renamedPosterIndex].poster : targetPoster;
  }
  const colour = colourMap.find(e => {
    return e.poster === targetPoster
  })?.colour || 'black';
  return colour;
};

export const determineMostPostsInAMonth = (byYear) => {
  const monthlyTotals = byYear.reduce((acc, yearObj) => {
    yearObj.months.forEach(monthObj => {
      let monthlyTotalAllPosters = 0;
      monthObj.posts.forEach(postObj => monthlyTotalAllPosters += postObj.monthlyTotal);
      acc.push(monthlyTotalAllPosters);
    })
    return acc;
  }, []);

  const highestMonthlyPosts = Math.max(...monthlyTotals);
  return highestMonthlyPosts;
};

export const calcTotalForMonth = (index, byYear, slide) => {
  const monthObjIndex = byYear[slide - 1]?.months.findIndex(e => +e.month === index + 1);

  let monthlyTotalOverall = null;
  let totalsByPoster = null;

  if (monthObjIndex !== -1) {
    monthlyTotalOverall = byYear[slide - 1]?.months[monthObjIndex].posts.reduce((acc, e) => {
      acc += e.monthlyTotal;
      return acc;
    }, 0);

    totalsByPoster = byYear[slide - 1]?.months[monthObjIndex].posts
  };
  return { monthlyTotalOverall, totalsByPoster };
};

export const tallyGenres = (posts, lookup) => {

  const tallyObj = posts.reduce((acc, post) => {

    const { poster, time: { year }, genres } = post;
    if (!genres || !genres.length) return acc;
    const tPoster = determineTargetPoster(poster, lookup);

    // handle creation of keys if they dont yet exist
    if (!acc.allPosters[year]) acc.allPosters[year] = [];
    if (!acc[tPoster]) acc[tPoster] = { allYears: [] };
    if (!acc[tPoster][year]) acc[tPoster][year] = [];

    // iterate over post's genres arr
    genres.forEach(lowercaseGenre => {
      const genre = lowercaseGenre.split(' ').map(e => _.capitalize(e)).join(' ');
      // allPosters.allYears
      const genreObjInAllPostersAllYears = acc.allPosters.allYears.find(e => e.genre === genre);
      if (!genreObjInAllPostersAllYears) acc.allPosters.allYears.push({ genre: genre, count: 0 });
      const indexOfGenreObjInAllPostersAllYears = acc.allPosters.allYears.findIndex(e => e.genre === genre);
      acc.allPosters.allYears[indexOfGenreObjInAllPostersAllYears].count++;
      // allPosters[year]
      const genreObjInAllPostersYear = acc.allPosters[year].find(e => e.genre === genre);
      if (!genreObjInAllPostersYear) acc.allPosters[year].push({ genre: genre, count: 0 });
      const indexOfGenreObjInAllPostersYear = acc.allPosters[year].findIndex(e => e.genre === genre);
      acc.allPosters[year][indexOfGenreObjInAllPostersYear].count++;
      // [tPoster].allYears
      const genreObjInPosterAllYears = acc[tPoster].allYears.find(e => e.genre === genre);
      if (!genreObjInPosterAllYears) acc[tPoster].allYears.push({ genre: genre, count: 0 });
      const indexOfGenreObjInPosterAllYears = acc[tPoster].allYears.findIndex(e => e.genre === genre);
      acc[tPoster].allYears[indexOfGenreObjInPosterAllYears].count++;
      // [tPoster][year]
      const genreObjInPosterYear = acc[tPoster][year].find(e => e.genre === genre);
      if (!genreObjInPosterYear) acc[tPoster][year].push({ genre: genre, count: 0 });
      const indexOfGenreObjInPosterYear = acc[tPoster][year].findIndex(e => e.genre === genre);
      acc[tPoster][year][indexOfGenreObjInPosterYear].count++;
    });


    return acc;
  }, { allPosters: { allYears: [] } });

  const tallyObjGenresRanked = { ...tallyObj };
  for (const key in tallyObjGenresRanked) {
    const obj = tallyObjGenresRanked[key];
    for (let subKey in obj) {
      obj[subKey] = obj[subKey].sort((a, b) => {
        // if counts are equal, sort alphabetically on genre, else sort by count in desc.
        if (+a.count === +b.count) {
          return a.genre < b.genre ? -1 : 1
        } else {
          return +a.count < +b.count ? 1 : -1
        }
      })
    }
  }

  // sort object keys alphabetically
  const sortedKeys = Object.entries(tallyObjGenresRanked).sort((a, b) => (a[0].toLowerCase() > b[0].toLowerCase()) ? 1 : -1);

  const finalTallyObj = sortedKeys.reduce((acc, e) => {
    acc[e[0]] = e[1];
    return acc;
  }, {})
  return tallyObjGenresRanked;
  // return finalTallyObj;
};

export const rgbFromLetters = (word) => {
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  const wordSplit = word.split('').slice(0, 3);
  const rgbVals = wordSplit.map(letter => {
    if (letters.indexOf(letter.toLowerCase()) === -1) return 0;
    return Math.trunc(letters.indexOf(letter.toLowerCase()) * 9.8);
  });
  return `rgb(${rgbVals[0]}, ${rgbVals[0]}, ${rgbVals[0]})`;
};

export const stringToColour = (str) => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

export const formatForPie = (genresArray) => {
  if (genresArray) {
    const res = genresArray.map(e => ({
      title: e.genre, value: e.count, color: stringToColour(e.genre)
    }))
    return res;
  } else {
    const res = [{
      title: null, value: 1, color: '#09090D',
    }];
    return res;
  }
};

export const groupPostsByPoster = (poster, posts, lookup) => {
  const aliasGroupsMappedToPosts = posts.map(post => {
    const { poster } = post;
    const tPoster = determineTargetPoster(poster, lookup);
    return { ...post, poster: tPoster };
  }, []);
  return aliasGroupsMappedToPosts.filter(e => e.poster === poster);
};

export const dateTodayDdMmYyyy = () => {
  const date = new Date(); // today's date
  const format = 'dd/mm/yyyy';
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yy: date.getFullYear().toString().slice(-2),
    yyyy: date.getFullYear()
  }
  return format.replace(/dd|mm|yyyy/gi, matched => map[matched])
};

export const getLastUpdatedFromMeta = (playlistMetaInAppState) => {
  if (playlistMetaInAppState?.lastUpdated) {
    const dateBits = new Date(playlistMetaInAppState.lastUpdated).toString().split(' ');
    const lastUpdatedForDisplay = `${dateBits[2]} ${dateBits[1]} ${dateBits[3]} ${dateBits[4]?.slice(0, 5) || null}`
    return lastUpdatedForDisplay;
  };
  return 'never'
};

export const setLoadedFonts = async (fontsArr, fontsLoadedSetter) => {
  const promises = fontsArr.map(e => new FontFaceObserver(e).load());
  // console.log(promises)
  Promise.all([promises]).then(function () {
    fontsLoadedSetter(true);
  });
};

export const getIdFromGoogleDriveURL = (url) => {
  const googleDriveRegex = /(?:drive.google.com\/file\/d\/)(.*)/i;
  const match = url.match(googleDriveRegex);
  if (match) return match[1].split('/')[0];
  return match;
};

export const stringContainsKaraoke = (str) => {
  if (str.toLowerCase().includes('karaoke')) return true;
  if (str.toLowerCase().includes('karaoki')) return true;
  if (str.toLowerCase().includes('kareoke')) return true;
  if (str.toLowerCase().includes('kareoki')) return true;
  if (str.toLowerCase().includes('karioke')) return true;
  if (str.toLowerCase().includes('karioki')) return true;
  if (str.toLowerCase().includes('karaeoke')) return true;
  return false;
};

export const stringContainsAcoustic = (str) => str.toLowerCase().includes('acoustic') ? true : false;

export const stringContainsLive = (str) => {
  // console.log(str, ' <')
  return str.toLowerCase().includes('live') ? true : false
};

export const stringContainsRemix = (str) => str.toLowerCase().includes('remix') ? true : false;

export const stringContainsMix = (str) => str.toLowerCase().includes('mix') ? true : false;

export const stringContainsEdit = (str) => str.toLowerCase().includes('edit') ? true : false;

export const stringContainsExtended = (str) => str.toLowerCase().includes('extended') ? true : false;

export const stringContainsVersion = (str) => str.toLowerCase().includes('version') ? true : false;

export const stringContainsCover = (str) => str.toLowerCase().includes('cover') ? true : false;

export const stringContainsPiano = (str) => str.toLowerCase().includes('piano') ? true : false;

export const stringContainsDub = (str) => str.toLowerCase().includes('dub') ? true : false;

export const millisToMinsAndSecs = (millis) => {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

/*
RED e74c3c
BLUE 3498db
YELLOW f1c40f
GREEN 2ecc71
ORANGE e67e22
PINK f5b7b1
CYAN aed6f1
PURPLE 9b59b6

pale---
RED e6b0aa
BLUE 7fb3d5
YELLOW f9e79f
GREEN abebc6
ORANGE f8c471
PINK fadbd8
CYAN d1f2eb
PURPLE d2b4de

dark---
RED 78281f
BLUE 154360
YELLOW b7950b
GREEN 196f3d
ORANGE 9c640c
PINK 17a589
CYAN 1f618d
PURPLE 4a235a


*/