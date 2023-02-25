import {
  msgTimeComponents,
  findInputPostInRawPostsLog,
  newMsgsNotInChatLog,
  accountForAliases,
  tallyGenres,
} from './helpers';
import _ from 'lodash';

xdescribe('msgTimeComponents()', () => {
  it('', () => {
    const individualMessage = `11/01/2023, 23:41 - Dan Brown-Smith: Well. 
    
    open.spotify.com/track/109132098s989sdhjk`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '23', minute: '41' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 00:01 - Dan Brown-Smith: Well. 
    
    open.spotify.com/track/109132098s989sdhjk`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '01' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 12:30 - Dan Brown-Smith: Well. 
    
    open.spotify.com/track/109132098s989sdhjk`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '12', minute: '30' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 12:40am - Dan Brown-Smith: Well.

    open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '40' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 1:30am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '01', minute: '30' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 2:00am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '02', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 3:00am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '03', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 4:00am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '04', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 5:00am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '05', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 6:00am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '06', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 7:00am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '07', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 8:00am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '08', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 9:59am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '09', minute: '59' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 10:00am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '10', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 11:00am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '11', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 12:00am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 12:59am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '59' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 12:59am - Dan - Brown-Smith: The Revenge: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '59' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 12:00pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '12', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 1:00pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '13', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 2:00pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '14', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 3:00pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '15', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 4:00pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '16', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 5:00pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '17', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 6:00pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '18', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 7:00pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '19', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 8:00pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '20', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 9:30pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '21', minute: '30' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `25/12/2023, 10:00pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '25', month: '12', year: '2023', hour: '22', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 11:00pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '23', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 11:59pm - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '23', minute: '59' };
    console.log(res, ' <---------')
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 12:00am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '00' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
  it('', () => {
    const individualMessage = `11/01/2023, 12:01am - Dan Brown-Smith: Well.

  open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
    const res = msgTimeComponents(individualMessage);
    const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '01' };
    expect(_.isEqual(res, expected)).toEqual(true);
  });
});

const timeObjInMs = (timeObj) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const timeAsString = `${months[+timeObj.month - 1]} ${+timeObj.day}, ${timeObj.year} ${timeObj.hour}:${timeObj.minute}:00`;
  const timeStringAsDate = new Date(timeAsString);
  const timeAsMilliseconds = timeStringAsDate.getTime();
  return timeAsMilliseconds;
};

describe.only('findInputPostInRawPostsLog()', () => {
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '00', minute: '00' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).not.toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 9, linkType: 'youtube', linkID: 'xyz101112', time: { year: '2020', month: '02', day: '01', hour: '00', minute: '00' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 9, linkType: 'youtube', linkID: 'xyz101112', time: { year: '2022', month: '12', day: '25', hour: '00', minute: '00' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).not.toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '23', minute: '59' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).not.toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '01', day: '31', hour: '10', minute: '00' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).not.toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '01', day: '31', hour: '09', minute: '01' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).not.toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '01', day: '31', hour: '09', minute: '00' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '02', hour: '08', minute: '59' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).not.toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '02', hour: '09', minute: '00' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '01' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).not.toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '30' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).not.toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '10', minute: '30' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).not.toEqual(expected);
  });
  it('', () => {
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '01', minute: '00' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).not.toEqual(expected);
  });
  it('', () => {
    // different link, same day as a rawPost that already exists
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 9, linkType: 'youtube', linkID: 'xyz101112', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).toEqual(expected);
  });
  it('', () => {
    // same link, but posted 24 hrs before or after one a post with the same link (already posted)
    const rawPostsLog = [
      { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
      { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
      { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
    ];
    const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2021', month: '11', day: '25', hour: '12', minute: '00' } };
    const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
    const expected = undefined;
    console.log(res)
    expect(res).toEqual(expected);
  });
});


xdescribe('newMsgsNotInChatLog()', () => {
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

xdescribe('tallyGenres()', () => {

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
        allYears: [{ genre: 'rock', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'rock', count: 1 }],
        allYears: [{ genre: 'rock', count: 1 }],
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
        allYears: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
        allYears: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
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
        allYears: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
        allYears: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
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
        allYears: [{ genre: 'pop', count: 2 }, { genre: 'rock', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'pop', count: 2 }, { genre: 'rock', count: 1 }],
        allYears: [{ genre: 'pop', count: 2 }, { genre: 'rock', count: 1 }],
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
        allYears: [{ genre: 'rock', count: 2 }],
      },
      sam: {
        2020: [{ genre: 'rock', count: 1 }],
        2021: [{ genre: 'rock', count: 1 }],
        allYears: [{ genre: 'rock', count: 2 }],
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
        allYears: [{ genre: 'rock', count: 3 }],
      },
      sam: {
        2020: [{ genre: 'rock', count: 1 }],
        2021: [{ genre: 'rock', count: 2 }],
        allYears: [{ genre: 'rock', count: 3 }],
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
        allYears: [{ genre: 'rock', count: 2 }, { genre: 'dance', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allYears: [{ genre: 'rock', count: 2 }, { genre: 'dance', count: 1 }],
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
        allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
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
        allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
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
        allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
        allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
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
        allYears: [{ genre: 'dance', count: 2 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }],
        allYears: [{ genre: 'dance', count: 1 }],
      },
      ben: {
        2020: [{ genre: 'dance', count: 1 }],
        allYears: [{ genre: 'dance', count: 1 }],
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
        allYears: [{ genre: 'dance', count: 1 }, { genre: 'pop', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }],
        allYears: [{ genre: 'dance', count: 1 }],
      },
      ben: {
        2020: [{ genre: 'pop', count: 1 }],
        allYears: [{ genre: 'pop', count: 1 }],
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
        allYears: [{ genre: 'dance', count: 1 }, { genre: 'pop', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }],
        allYears: [{ genre: 'dance', count: 1 }],
      },
      ben: {
        2021: [{ genre: 'pop', count: 1 }],
        allYears: [{ genre: 'pop', count: 1 }],
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
        allYears: [{ genre: 'jazz', count: 3 }, { genre: 'blues', count: 2 }, { genre: 'dance', count: 2 }, { genre: 'flamenco', count: 2 }, { genre: 'pop', count: 2 }, { genre: 'rock', count: 2 }, { genre: 'classical', count: 1 }],
      },
      sam: {
        2020: [{ genre: 'dance', count: 1 }],
        2021: [{ genre: 'blues', count: 1 }, { genre: 'dance', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
        allYears: [{ genre: 'dance', count: 2 }, { genre: 'blues', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
      },
      ben: {
        2021: [{ genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }],
        allYears: [{ genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }],
      },
      jon: {
        2021: [{ genre: 'blues', count: 1 }, { genre: 'flamenco', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'rock', count: 1 },],
        2022: [{ genre: 'classical', count: 1 }, { genre: 'flamenco', count: 1 }],
        allYears: [{ genre: 'flamenco', count: 2 }, { genre: 'blues', count: 1 }, { genre: 'classical', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'rock', count: 1 }],
      },
    }
    console.log(JSON.stringify(res))
    expect(_.isEqual(res, expected)).toEqual(true);
  });


});