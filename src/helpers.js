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

export const tallyContributions = (processedPostsLog, lookup) => {
  // console.log(processedPostsLog, ' <--- processedPostsLog')
  const { grouped = [], renamed = [] } = lookup;
  return processedPostsLog.reduce((acc, post) => {

    // let targetPoster;
    let targetPoster = post.poster

    if (grouped) {
      // check if this poster has been grouped
      const objInGrouped = grouped.find(e => e.poster === post.poster);
      if (objInGrouped) {
        const objInRenamed = renamed.find(e => e.poster === objInGrouped.on);
        targetPoster = objInRenamed ? objInRenamed.to : objInGrouped.on;
      }
    };

    if (renamed) {
      // if not, and renamed arr exists, check if this poster has been renamed
      const objInRenamed = renamed.find(e => e.poster === post.poster);
      if (objInRenamed) targetPoster = objInRenamed.to;
    }

    // finally, check if acc obj already exist for this poster - if yes, update, if not add new
    const indexInAcc = acc.findIndex(e => e.poster === targetPoster);
    if (indexInAcc === -1) {
      acc.push({ poster: targetPoster, totalPosts: 1 });
    } else {
      acc[indexInAcc].totalPosts++;
    }

    return acc;
  }, [])
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
}