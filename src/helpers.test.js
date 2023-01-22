import { newMsgsNotInChatLog } from './helpers';

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