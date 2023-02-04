import _ from "lodash";

export const spotiOrYTRegex = () => {
  const spotiYTRegexPattern = /(open.spotify.com\/track\/[^\s]*)|(youtu.be\/[^\s]*)|(youtube.com\/[^\s]*)/g
  return spotiYTRegexPattern;
};

export const spotifyTrackIDRegex = () => {
  const spotifyTrackIDPattern = /(?<=open.spotify.com\/track\/)(.*)/g
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
    if (spotiOrYTRegex().test(singleMessage)) { // if this message contains one or more Spoti or YT links...
      // grab required data
      const dateTime = singleMessage.match(messageDateTimeRegex)[0]; // 14/01/2023, 15:00
      const poster = singleMessage.match(/(?<=-).*?(?=:)/g)[0].trim();

      const spotiOrYTLinks = [...singleMessage.matchAll(spotiOrYTRegex())].map(arrEl => arrEl[0].trim());
      // const spotiOrYTLinks = [...singleMessage.matchAll(spotiOrYTRegex())];


      // console.log('-----')
      // console.log(spotiOrYTLinks);
      // iterate over all Spoti or YT links in this message, and compose a postObj for each link found
      spotiOrYTLinks.forEach(link => {
        const decideLinkType = (urlString) => {
          let linkType = 'spotify';
          if (/youtu.*/g.test(urlString)) linkType = 'youtube';
          return linkType;
        };

        /*
        [
          {id: 1a, aliases: ['+447595', 'Matthew (Work)'], displayName: 'Matt S.'},
          {id: 2b, aliases: ['Sam'], displayName: 'Sam' // default},
          {id: 3c, aliases: ['Jonny', 'Johnny Ratcliffe'], displayName: 'Jonny'},
        ]
        */

        const linkType = decideLinkType(link);
        let linkID;
        if (linkType === 'spotify') linkID = link.match(spotifyTrackIDRegex())[0].split('?')[0];
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
export const determineTargetPoster = (poster, lookup) => {
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
    months: [...e.months].sort((a, b) => (+a.month > +b.month) ? 1 : -1).map(f => ({ ...f, posts: [...f.posts].sort((a, b) => (+a.monthlyTotal > +b.monthlyTotal) ? 1 : -1) })),
    posters: [...e.posters].sort((a, b) => (+a.total < +b.total) ? 1 : -1)
  }))
  return monthsAndPostersSorted;
};

export const listAllPosters = (posts, lookup) => {
  const res = posts.reduce((acc, e) => {
    let targetPoster = determineTargetPoster(e.poster, lookup);
    const posterInAcc = acc.some(f => f === targetPoster);
    if (!posterInAcc) acc.push(targetPoster);
    return acc;
  }, []);
  console.log(res);
  return res;
};

export const createColourMap = (posters) => {
  // TO-DO: handle more than 24 posters / colours!
  const colourChoices = [
    'e74c3c',
    '3498db',
    'f1c40f',
    '2ecc71',
    'e67e22',
    'f5b7b1',
    'aed6f1',
    '9b59b6',
    'e6b0aa',
    '7fb3d5',
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
    targetPoster = renamedPosterIndex !== -1 ? renamed[renamedPosterIndex] : targetPoster;
  }
  const colour = colourMap.find(e => e.poster === targetPoster).colour;
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

/*
BY GENRE
[

  {
    timespan: allTime,
    posters: [
      {
        poster: allPosters,
        genresRanked: [ {count: 10, genre: Rock}, {count: 7, genre: Hip-Hop}... ]
      },
      {
        poster: Ben,
        genresRanked: [ {count: 4, genre: Soft-Rock}, {count: 3, genre: Disco }...]
      },
      ...
    ]
  },

    {
    timespan: 2020,
    posters: [
      {
        poster: allPosters,
        genresRanked: [ {count: 3, genre: Pop}, {count: 2, genre: Rock}... ]
      },
      {
        poster: Ben,
        genresRanked: [ {count: 2, genre: Rock}, {count: 1, genre: Dance }...]
      },
      ...
    ]
  },

]

*/









/*
BY YEAR
[
  { year: 2020,
    months: [
      { 
        month: 01,
        posts: [ // sorted by monthlyTotal
          { poster: Johnny, monthlyTotal: 20 },
          { poster: Ben, monthlyTotal: 12 },
          ...
        ],
      },
      ...
    ],

    posters: [
      {
        poster: Johnny,
        total: 29,
      }
    ],

  },
]
*/

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