import _, { constant } from "lodash";
import FontFaceObserver from 'fontfaceobserver';

export const spotiTrackAlbumPlaylistOrYTRegex = () => {
  const spotiTrackAlbumPlaylistOrYTPattern = /(open.spotify.com\/track\/[^\s]*)|(open.spotify.com\/album\/[^\s]*)|(open.spotify.com\/playlist\/[^\s]*)|(youtu.be\/[^\s]*)|(youtube.com\/(?!shorts)[^\s]*)/g
  return spotiTrackAlbumPlaylistOrYTPattern;
};

export const spotiOrYTRegex = () => {
  const spotiYTRegexPattern = /(open.spotify.com\/track\/[^\s]*)|(youtu.be\/[^\s]*)|(youtube.com\/(?!shorts)[^\s]*)/g
  return spotiYTRegexPattern;
};

export const spotifyTrackIDRegex = () => {
  const spotifyTrackIDPattern = /(?<=open.spotify.com\/track\/)(.*)/g
  return spotifyTrackIDPattern;
};

export const spotifyAlbumIDRegex = () => {
  const spotifyTrackIDPattern = /(?<=open.spotify.com\/album\/)(.*)/g
  return spotifyTrackIDPattern;
}

export const spotifyPlaylistIDRegex = () => {
  const spotifyTrackIDPattern = /(?<=open.spotify.com\/playlist\/)(.*)/g
  return spotifyTrackIDPattern;
}

export const youtubeVideoIDRegex = () => {
  const youtubeVideoIDPattern = /(?<=v=|v\/|vi=|vi\/|youtu.be\/)[a-zA-Z0-9_-]{11}/g;
  return youtubeVideoIDPattern;
};

export const splitTextIntoIndividualMessages = (inputText) => {
  const individualMessages = inputText.trim().split(/(?=\d{2}\/\d{2}\/\d{4})/m).filter(Boolean).map(e => e.trim())
  return individualMessages;
};

export const splitIndividualMessagesIntoPosts = (individualMessages) => {
  // iterate over individualMessages
  const messageDateTimeRegex = /\w{2}\/\w{2}\/\w{4},\s{1}\w{2}\:\w{2}/g
  const allPostsCrude = [];
  let postCounter = 0;

  for (let i = 0; i <= individualMessages.length; i++) {
    const singleMessage = individualMessages[i];

    if (spotiTrackAlbumPlaylistOrYTRegex().test(singleMessage)) { // if this msg contains one or more Spoti (track/album/pl) or YT links...
      // grab required data
      const dateTime = singleMessage.match(messageDateTimeRegex)[0]; // 14/01/2023, 15:00
      const poster = singleMessage.match(/(?<=-).*?(?=:)/g)[0].trim();

      const spotiOrYTLinks = [...singleMessage.matchAll(spotiTrackAlbumPlaylistOrYTRegex())].map(arrEl => arrEl[0].trim());
      // const spotiOrYTLinks = [...singleMessage.matchAll(spotiOrYTRegex())];

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

        if (linkType === 'spotify') linkID = link.match(spotifyTrackIDRegex())[0].split('?')[0];
        if (linkType === 'spotifyAlbum') linkID = link.match(spotifyAlbumIDRegex())[0].split('?')[0];
        if (linkType === 'spotifyPlaylist') linkID = link.match(spotifyPlaylistIDRegex())[0].split('?')[0];
        if (linkType === 'youtube') linkID = link.match(youtubeVideoIDRegex())[0];
        postCounter++;
        const postObj = {
          postId: postCounter,
          poster: poster,
          linkType: linkType,
          linkID: linkID,
          time: {
            day: dateTime.slice(0, 2),
            month: dateTime.slice(3, 5),
            year: dateTime.slice(6, 10),
            hour: dateTime.slice(12, 14),
            minute: dateTime.slice(15, 17),
          },
        };
        // then push this postObj into allPostsCrude
        allPostsCrude.push(postObj);
      });
    }
  };
  return allPostsCrude;
};

export const newPostsNotInRawPosts = (inputTextAsRawPosts, rawPostsLog) => {
  const onlyRequiredKeys = (obj) => ({
    poster: obj.poster, // could remove this
    linkType: obj.linkType,
    linkID: obj.linkID,
    time: obj.time,
  })
  const inputTextAsRawPostsOnlyReqKeys = inputTextAsRawPosts.map(e => onlyRequiredKeys(e));
  const rawPostsOnlyReqKeys = rawPostsLog.map(e => onlyRequiredKeys(e));
  const onlyNewPosts = inputTextAsRawPostsOnlyReqKeys.reduce((acc, post, i) => {
    if (!_.find(rawPostsOnlyReqKeys, post)) acc.push(inputTextAsRawPosts[i]);
    return acc;
  }, []);
  return onlyNewPosts;
};

export const findInputTextNewPosts = (inputText, rawPostsLog) => {
  const inputTextAsMessages = splitTextIntoIndividualMessages(inputText);
  const inputTextAsRawPosts = splitIndividualMessagesIntoPosts(inputTextAsMessages);
  const newPosts = newPostsNotInRawPosts(inputTextAsRawPosts, rawPostsLog);
  return newPosts;
};

export const inputTextIsValid = (inputText) => {
  let isValid = false;
  const whatsAppMessageRegex = /(\d{2}\/\d{2}\/\d{4}\,\s{1}\d{2}\:\d{2}\s{1}\-{1}\s{1}.*\:\s{1})+/g
  const containsWhatsAppMsgs = whatsAppMessageRegex.test(inputText.trim());
  if (containsWhatsAppMsgs) {
    const individualMessages = splitTextIntoIndividualMessages(inputText);
    const individualPosts = splitIndividualMessagesIntoPosts(individualMessages);
    individualPosts.length ? isValid = true : isValid = false
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
  console.log(promises)
  Promise.all([promises]).then(function () {
    fontsLoadedSetter(true);
  });
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