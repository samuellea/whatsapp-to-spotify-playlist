import {
  newMsgsNotInChatLog,
  accountForAliases,
  tallyGenres,
} from './helpers';
import _ from 'lodash';

describe('newMsgsNotInChatLog()', () => {
  it('', () => {
    const cLog = []; // chatLogSplit
    const iTxt = []; // inputTextSplit
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [];
    const iTxt = [1];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [1];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [];
    const iTxt = [1, 2];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [1, 2];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2];
    const iTxt = [1, 2];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2];
    const iTxt = [1, 2, 3];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [3];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2];
    const iTxt = [2, 3, 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [3, 4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3];
    const iTxt = [1, 2, 3, 2, 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3];
    const iTxt = [2, 3, 2, 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3];
    const iTxt = [1, 2, 'd', 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3];
    const iTxt = ['d', 3, 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3];
    const iTxt = [2, 'd', 2, 3, 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 'd', 5];
    const iTxt = [3, 'd', 5, 6];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [6];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 4, 3, 5];
    const iTxt = [3, 5, 6, 7];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [6, 7];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 4, 5, 6, 7];
    const iTxt = [1, 2, 3, 'd', 'd', 'd', 7, 8];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 'd', 'd', 8];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 4, 5, 6, 7];
    const iTxt = [1, 2, 3, 'd', 'd', 'd', 'd', 8];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 'd', 'd', 'd', 8];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 4, 5, 6, 7];
    const iTxt = [3, 'd', 'd', 'd', 7, 8];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 'd', 'd', 8];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 4, 5, 6, 7];
    const iTxt = ['d', 'd', 'd', 7, 8];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 'd', 'd', 8];
    expect(newMsgs).toEqual(expected);
  });
});

describe.only('tallyGenres()', () => {

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['rock']
      }
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'rock', count: 1 }],
        allTime: [{ genre: 'rock', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'rock', count: 1 }],
        allTime: [{ genre: 'rock', count: 1 }],
      },
    }
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['rock', 'pop']
      }
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
      },
    }
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['pop']
      }
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
      },
    }
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['pop']
      },
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['pop']
      }
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'pop', count: 2 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'pop', count: 2 }, { genre: 'rock', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'pop', count: 2 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'pop', count: 2 }, { genre: 'rock', count: 1 }],
      },
    }
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['rock']
      },
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'rock', count: 1 }],
        2021: [{ genre: 'rock', count: 1 }],
        allTime: [{ genre: 'rock', count: 2 }],
      },
      sam: {
        2020: [{ genre: 'rock', count: 1 }],
        2021: [{ genre: 'rock', count: 1 }],
        allTime: [{ genre: 'rock', count: 2 }],
      },
    }
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['rock']
      },
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'rock', count: 1 }],
        2021: [{ genre: 'rock', count: 2 }],
        allTime: [{ genre: 'rock', count: 3 }],
      },
      sam: {
        2020: [{ genre: 'rock', count: 1 }],
        2021: [{ genre: 'rock', count: 2 }],
        allTime: [{ genre: 'rock', count: 3 }],
      },
    }
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['dance']
      },
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'rock', count: 2 }, { genre: 'dance', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'rock', count: 2 }, { genre: 'dance', count: 1 }],
      },
    }
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['dance']
      },
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['dance']
      },
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
      },
    }
    console.log(JSON.stringify(res));
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['dance']
      },
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: []
      },
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['dance']
      },
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
      },
    }
    console.log(JSON.stringify(res));
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['dance']
      },
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['rock']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['dance']
      },
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
      },
    }
    console.log(JSON.stringify(res));
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['dance']
      },
      {
        poster: 'ben',
        time: { year: 2020 },
        genres: ['dance']
      },
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'dance', count: 2 }],
        allTime: [{ genre: 'dance', count: 2 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }],
        allTime: [{ genre: 'dance', count: 1 }],
      },
      ben: {
        2020: [{ genre: 'dance', count: 1 }],
        allTime: [{ genre: 'dance', count: 1 }],
      },
    }
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['dance']
      },
      {
        poster: 'ben',
        time: { year: 2020 },
        genres: ['pop']
      },
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'dance', count: 1 }, { genre: 'pop', count: 1 }],
        allTime: [{ genre: 'dance', count: 1 }, { genre: 'pop', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }],
        allTime: [{ genre: 'dance', count: 1 }],
      },
      ben: {
        2020: [{ genre: 'pop', count: 1 }],
        allTime: [{ genre: 'pop', count: 1 }],
      },
    }
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['dance']
      },
      {
        poster: 'ben',
        time: { year: 2021 },
        genres: ['pop']
      },
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'dance', count: 1 }],
        2021: [{ genre: 'pop', count: 1 }],
        allTime: [{ genre: 'dance', count: 1 }, { genre: 'pop', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }],
        allTime: [{ genre: 'dance', count: 1 }],
      },
      ben: {
        2021: [{ genre: 'pop', count: 1 }],
        allTime: [{ genre: 'pop', count: 1 }],
      },
    }
    expect(_.isEqual(res, expected)).toEqual(true);
  });

  it('', () => {
    const lookup = { renamed: [], grouped: [] };
    const processedPosts = [
      {
        poster: 'sam',
        time: { year: 2020 },
        genres: ['dance']
      },
      {
        poster: 'ben',
        time: { year: 2021 },
        genres: ['pop']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['dance']
      },
      {
        poster: 'ben',
        time: { year: 2021 },
        genres: ['jazz']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['pop', 'jazz']
      },
      {
        poster: 'sam',
        time: { year: 2021 },
        genres: ['rock', 'blues']
      },
      {
        poster: 'jon',
        time: { year: 2021 },
        genres: ['rock', 'jazz', 'blues', 'flamenco']
      },
      {
        poster: 'jon',
        time: { year: 2022 },
        genres: ['flamenco', 'classical']
      },
    ];
    const res = tallyGenres(processedPosts, lookup);
    const expected = {
      allPosters: {
        2020: [{ genre: 'dance', count: 1 }],
        2021: [{ genre: 'jazz', count: 3 }, { genre: 'blues', count: 2 }, { genre: 'pop', count: 2 }, { genre: 'rock', count: 2 }, { genre: 'dance', count: 1 }, { genre: 'flamenco', count: 1 }],
        2022: [{ genre: 'classical', count: 1 }, { genre: 'flamenco', count: 1 }],
        allTime: [{ genre: 'jazz', count: 3 }, { genre: 'blues', count: 2 }, { genre: 'dance', count: 2 }, { genre: 'flamenco', count: 2 }, { genre: 'pop', count: 2 }, { genre: 'rock', count: 2 }, { genre: 'classical', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }],
        2021: [{ genre: 'blues', count: 1 }, { genre: 'dance', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
        allTime: [{ genre: 'dance', count: 2 }, { genre: 'blues', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
      },
      ben: {
        2021: [{ genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }],
        allTime: [{ genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }],
      },
      jon: {
        2021: [{ genre: 'blues', count: 1 }, { genre: 'flamenco', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'rock', count: 1 },],
        2022: [{ genre: 'classical', count: 1 }, { genre: 'flamenco', count: 1 }],
        allTime: [{ genre: 'flamenco', count: 2 }, { genre: 'blues', count: 1 }, { genre: 'classical', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'rock', count: 1 }],
      },
    }
    console.log(JSON.stringify(res))
    expect(_.isEqual(res, expected)).toEqual(true);
  });


});


/*
    const posterAliases = [
      { main: 'Sam (Work)', aliases: ['Sam', 'Sam (Work)'] },
    ];

*/



/*

{"allPosters":
  {
    "2020":[{"genre":"dance","count":1}],
    "2021":[{"genre":"jazz","count":3},{"genre":"blues","count":2},{"genre":"pop","count":2},   
      {"genre":"rock","count":2},{"genre":"dance","count":1},{"genre":"flamenco","count":1}],
    "2022":[{"genre":"classical","count":1},{"genre":"flamenco","count":1}],
    "allTime":[{"genre":"jazz","count":3},{"genre":"blues","count":2},{"genre":"dance","count":2},{"genre":"flamenco","count":2},{"genre":"pop","count":2},{"genre":"rock","count":2},{"genre":"classical","count":1}]
  },
  "sam":
    {"2020":[{"genre":"dance","count":1}],
    "2021":[{"genre":"blues","count":1},{"genre":"dance","count":1},{"genre":"jazz","count":1},{"genre":"pop","count":1},{"genre":"rock","count":1}],
    "allTime":[{"genre":"dance","count":2},{"genre":"blues","count":1},{"genre":"jazz","count":1},{"genre":"pop","count":1},{"genre":"rock","count":1}]
  },
  "ben":{
    "2021":[{"genre":"jazz","count":1},{"genre":"pop","count":1}],"allTime":[{"genre":"jazz","count":1},{"genre":"pop","count":1}]
  },
  "jon":{
    "2021":[{"genre":"blues","count":1},{"genre":"flamenco","count":1},{"genre":"jazz","count":1},{"genre":"rock","count":1}],
    "2022":[{"genre":"classical","count":1},{"genre":"flamenco","count":1}],"allTime":[{"genre":"flamenco","count":2},{"genre":"blues","count":1},{"genre":"classical","count":1},{"genre":"jazz","count":1},{"genre":"rock","count":1}]}}

    */