import {
  newMsgsNotInChatLog,
  accountForAliases,
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

describe.only('accountForAliases()', () => {
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 5 },
      { poster: 'Ben Belward', totalPosts: 2 },
      { poster: 'Sam (Work)', totalPosts: 1 },
      { poster: 'Johnny Ratcliffe', totalPosts: 1 },
    ];

    const posterAliases = [
      { main: 'Sam', aliases: ['Sam', 'Sam (Work)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam', totalPosts: 6 },
      { poster: 'Ben Belward', totalPosts: 2 },
      { poster: 'Johnny Ratcliffe', totalPosts: 1 },
    ];
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 5 },
      { poster: 'Sam (Work)', totalPosts: 1 },
    ];

    const posterAliases = [];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam', totalPosts: 5 },
      { poster: 'Sam (Work)', totalPosts: 1 },
    ];
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 5 },
      { poster: 'Sam (Work)', totalPosts: 1 },
    ];

    const posterAliases = [
      { main: 'Sam', aliases: ['Sam', 'Sam (Work)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam', totalPosts: 6 },
    ];
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 5 },
      { poster: 'Sam (Work)', totalPosts: 1 },
    ];

    const posterAliases = [
      { main: 'Sam (Work)', aliases: ['Sam', 'Sam (Work)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam (Work)', totalPosts: 6 },
    ];
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 1 },
      { poster: 'Sam (Work)', totalPosts: 2 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
    ];

    const posterAliases = [];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam', totalPosts: 1 },
      { poster: 'Sam (Work)', totalPosts: 2 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
    ];
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 1 },
      { poster: 'Sam (Work)', totalPosts: 2 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
    ];

    const posterAliases = [
      { main: 'Sam', aliases: ['Sam', 'Sam (Work)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam', totalPosts: 3 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
    ];
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 4 },
      { poster: 'Sam (Work)', totalPosts: 2 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
    ];

    const posterAliases = [
      { main: 'Sam (Work)', aliases: ['Sam', 'Sam (Work)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam (Work)', totalPosts: 6 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
    ];
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 1 },
      { poster: 'Sam (Work)', totalPosts: 2 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
    ];

    const posterAliases = [
      { main: 'Sam', aliases: ['Sam', 'Sam (Work)', 'Sam (Abroad)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam', totalPosts: 6 },
    ];
    console.log(res)
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 2 },
      { poster: 'Sam (Work)', totalPosts: 2 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
    ];

    const posterAliases = [
      { main: 'Bingo', aliases: ['Sam', 'Sam (Work)', 'Sam (Abroad)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Bingo', totalPosts: 7 },
    ];
    console.log(res)
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 1 },
      { poster: 'Sam (Work)', totalPosts: 2 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
      { poster: 'Ben', totalPosts: 1 },
    ];

    const posterAliases = [
      { main: 'Sam', aliases: ['Sam', 'Sam (Work)', 'Sam (Abroad)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam', totalPosts: 6 },
      { poster: 'Ben', totalPosts: 1 },
    ];
    console.log(res)
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 1 },
      { poster: 'Sam (Work)', totalPosts: 2 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
      { poster: 'Ben', totalPosts: 1 },
      { poster: 'Ben (Work)', totalPosts: 2 },
    ];

    const posterAliases = [
      { main: 'Sam', aliases: ['Sam', 'Sam (Work)', 'Sam (Abroad)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam', totalPosts: 6 },
      { poster: 'Ben', totalPosts: 1 },
      { poster: 'Ben (Work)', totalPosts: 2 },
    ];
    console.log(res)
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 1 },
      { poster: 'Sam (Work)', totalPosts: 2 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
      { poster: 'Ben', totalPosts: 1 },
      { poster: 'Ben (Work)', totalPosts: 2 },
    ];

    const posterAliases = [
      { main: 'Sam', aliases: ['Sam', 'Sam (Work)', 'Sam (Abroad)'] },
      { main: 'Ben', aliases: ['Ben', 'Ben (Work)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam', totalPosts: 6 },
      { poster: 'Ben', totalPosts: 3 },
    ];
    console.log(res)
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 1 },
      { poster: 'Sam (Work)', totalPosts: 2 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
      { poster: 'Ben', totalPosts: 1 },
      { poster: 'Ben (Work)', totalPosts: 2 },
      { poster: 'Johnny Ratcliffe', totalPosts: 1 },
    ];

    const posterAliases = [
      { main: 'Sam', aliases: ['Sam', 'Sam (Work)', 'Sam (Abroad)'] },
      { main: 'Ben', aliases: ['Ben', 'Ben (Work)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam', totalPosts: 6 },
      { poster: 'Ben', totalPosts: 3 },
      { poster: 'Johnny Ratcliffe', totalPosts: 1 },
    ];
    console.log(res)
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const contributorsTally = [
      { poster: 'Sam', totalPosts: 1 },
      { poster: 'Sam (Work)', totalPosts: 2 },
      { poster: 'Sam (Abroad)', totalPosts: 3 },
      { poster: 'Ben', totalPosts: 1 },
      { poster: 'Ben (Work)', totalPosts: 2 },
      { poster: 'Johnny Ratcliffe', totalPosts: 1 },
    ];

    const posterAliases = [
      { main: 'Sam', aliases: ['Sam', 'Sam (Work)', 'Sam (Abroad)'] },
      { main: 'Mando', aliases: ['Ben', 'Ben (Work)'] },
    ];

    const res = accountForAliases(contributorsTally, posterAliases);
    const expected = [
      { poster: 'Sam', totalPosts: 6 },
      { poster: 'Mando', totalPosts: 3 },
      { poster: 'Johnny Ratcliffe', totalPosts: 1 },
    ];
    console.log(res)
    expect(_.isEqual(res, expected)).toEqual(true);
  });
});


/*
    const posterAliases = [
      { main: 'Sam (Work)', aliases: ['Sam', 'Sam (Work)'] },
    ];

*/