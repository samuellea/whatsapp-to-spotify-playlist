import {
  findInputPostInRawPostsLog,
  newMsgsNotInChatLog,
  accountForAliases,
  tallyGenres,
  coerce2DigitYearTo4DigitYear,
  coerceLanguageDateFormat,
  msgTimeComponents,
} from './helpers';
import _ from 'lodash';

// xdescribe('msgTimeComponents()', () => {
//   it('', () => {
//     const individualMessage = `11/01/2023, 23:41 - Dan Brown-Smith: Well. 

//     open.spotify.com/track/109132098s989sdhjk`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '23', minute: '41' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 00:01 - Dan Brown-Smith: Well. 

//     open.spotify.com/track/109132098s989sdhjk`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '01' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 12:30 - Dan Brown-Smith: Well. 

//     open.spotify.com/track/109132098s989sdhjk`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '12', minute: '30' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 12:40am - Dan Brown-Smith: Well.

//     open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '40' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 1:30am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '01', minute: '30' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 2:00am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '02', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 3:00am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '03', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 4:00am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '04', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 5:00am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '05', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 6:00am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '06', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 7:00am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '07', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 8:00am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '08', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 9:59am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '09', minute: '59' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 10:00am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '10', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 11:00am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '11', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 12:00am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 12:59am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '59' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 12:59am - Dan - Brown-Smith: The Revenge: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '59' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 12:00pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '12', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 1:00pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '13', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 2:00pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '14', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 3:00pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '15', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 4:00pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '16', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 5:00pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '17', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 6:00pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '18', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 7:00pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '19', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 8:00pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '20', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 9:30pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '21', minute: '30' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `25/12/2023, 10:00pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '25', month: '12', year: '2023', hour: '22', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 11:00pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '23', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 11:59pm - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '23', minute: '59' };
//     console.log(res, ' <---------')
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 12:00am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '00' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
//   it('', () => {
//     const individualMessage = `11/01/2023, 12:01am - Dan Brown-Smith: Well.

//   open.spotify.com/track/109132098s989sdhjk. Pretty good, right?`;
//     const res = msgTimeComponents(individualMessage);
//     const expected = { day: '11', month: '01', year: '2023', hour: '00', minute: '01' };
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });
// });

// const timeObjInMs = (timeObj) => {
//   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//   const timeAsString = `${months[+timeObj.month - 1]} ${+timeObj.day}, ${timeObj.year} ${timeObj.hour}:${timeObj.minute}:00`;
//   const timeStringAsDate = new Date(timeAsString);
//   const timeAsMilliseconds = timeStringAsDate.getTime();
//   return timeAsMilliseconds;
// };

// xdescribe('findInputPostInRawPostsLog()', () => {
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '00', minute: '00' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     // console.log(res)
//     expect(res).not.toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 9, linkType: 'youtube', linkID: 'xyz101112', time: { year: '2020', month: '02', day: '01', hour: '00', minute: '00' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     // console.log(res)
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 9, linkType: 'youtube', linkID: 'xyz101112', time: { year: '2022', month: '12', day: '25', hour: '00', minute: '00' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).not.toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '23', minute: '59' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).not.toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '01', day: '31', hour: '10', minute: '00' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).not.toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '01', day: '31', hour: '09', minute: '01' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).not.toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '01', day: '31', hour: '09', minute: '00' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '02', hour: '08', minute: '59' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).not.toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '02', hour: '09', minute: '00' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '01' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).not.toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '30' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).not.toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '10', minute: '30' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).not.toEqual(expected);
//   });
//   it('', () => {
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '01', minute: '00' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).not.toEqual(expected);
//   });
//   it('', () => {
//     // different link, same day as a rawPost that already exists
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 9, linkType: 'youtube', linkID: 'xyz101112', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     // same link, but posted 24 hrs before or after one a post with the same link (already posted)
//     const rawPostsLog = [
//       { id: 1, linkType: 'youtube', linkID: 'abc123', time: { year: '2020', month: '01', day: '30', hour: '13', minute: '00' } },
//       { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2020', month: '02', day: '01', hour: '09', minute: '00' } },
//       { id: 3, linkType: 'youtube', linkID: 'ghi789', time: { year: '2020', month: '02', day: '14', hour: '20', minute: '30' } },
//     ];
//     const inputPost = { id: 2, linkType: 'youtube', linkID: 'def456', time: { year: '2021', month: '11', day: '25', hour: '12', minute: '00' } };
//     const res = findInputPostInRawPostsLog(inputPost, rawPostsLog);
//     const expected = undefined;
//     console.log(res)
//     expect(res).toEqual(expected);
//   });
// });


// xdescribe('newMsgsNotInChatLog()', () => {
//   it('', () => {
//     const cLog = []; // chatLogSplit
//     const iTxt = []; // inputTextSplit
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = [];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [];
//     const iTxt = [1];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = [1];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [];
//     const iTxt = [1, 2];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = [1, 2];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2];
//     const iTxt = [1, 2];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = [];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2];
//     const iTxt = [1, 2, 3];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = [3];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2];
//     const iTxt = [2, 3, 4];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = [3, 4];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2, 3];
//     const iTxt = [1, 2, 3, 2, 4];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = [4];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2, 3];
//     const iTxt = [2, 3, 2, 4];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = [4];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2, 3];
//     const iTxt = [1, 2, 'd', 4];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = ['d', 4];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2, 3];
//     const iTxt = ['d', 3, 4];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = ['d', 4];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2, 3];
//     const iTxt = [2, 'd', 2, 3, 4];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = ['d', 4];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2, 3, 'd', 5];
//     const iTxt = [3, 'd', 5, 6];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = [6];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2, 3, 4, 3, 5];
//     const iTxt = [3, 5, 6, 7];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = [6, 7];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2, 3, 4, 5, 6, 7];
//     const iTxt = [1, 2, 3, 'd', 'd', 'd', 7, 8];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = ['d', 'd', 'd', 8];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2, 3, 4, 5, 6, 7];
//     const iTxt = [1, 2, 3, 'd', 'd', 'd', 'd', 8];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = ['d', 'd', 'd', 'd', 8];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2, 3, 4, 5, 6, 7];
//     const iTxt = [3, 'd', 'd', 'd', 7, 8];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = ['d', 'd', 'd', 8];
//     expect(newMsgs).toEqual(expected);
//   });
//   it('', () => {
//     const cLog = [1, 2, 3, 4, 5, 6, 7];
//     const iTxt = ['d', 'd', 'd', 7, 8];
//     const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
//     const expected = ['d', 'd', 'd', 8];
//     expect(newMsgs).toEqual(expected);
//   });
// });

// xdescribe('tallyGenres()', () => {

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['rock']
//       }
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'rock', count: 1 }],
//       },
//       sam: {
//         2020: [{ genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'rock', count: 1 }],
//       },
//     }
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['rock', 'pop']
//       }
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
//       },
//       sam: {
//         2020: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
//       },
//     }
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['pop']
//       }
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
//       },
//       sam: {
//         2020: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
//       },
//     }
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['pop']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['pop']
//       }
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'pop', count: 2 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'pop', count: 2 }, { genre: 'rock', count: 1 }],
//       },
//       sam: {
//         2020: [{ genre: 'pop', count: 2 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'pop', count: 2 }, { genre: 'rock', count: 1 }],
//       },
//     }
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['rock']
//       },
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'rock', count: 1 }],
//         2021: [{ genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'rock', count: 2 }],
//       },
//       sam: {
//         2020: [{ genre: 'rock', count: 1 }],
//         2021: [{ genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'rock', count: 2 }],
//       },
//     }
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['rock']
//       },
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'rock', count: 1 }],
//         2021: [{ genre: 'rock', count: 2 }],
//         allYears: [{ genre: 'rock', count: 3 }],
//       },
//       sam: {
//         2020: [{ genre: 'rock', count: 1 }],
//         2021: [{ genre: 'rock', count: 2 }],
//         allYears: [{ genre: 'rock', count: 3 }],
//       },
//     }
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['dance']
//       },
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'rock', count: 1 }],
//         2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'rock', count: 2 }, { genre: 'dance', count: 1 }],
//       },
//       sam: {
//         2020: [{ genre: 'rock', count: 1 }],
//         2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'rock', count: 2 }, { genre: 'dance', count: 1 }],
//       },
//     }
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['dance']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['dance']
//       },
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
//       },
//       sam: {
//         2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
//       },
//     }
//     console.log(JSON.stringify(res));
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['dance']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: []
//       },
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['dance']
//       },
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
//       },
//       sam: {
//         2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
//       },
//     }
//     console.log(JSON.stringify(res));
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['dance']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['rock']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['dance']
//       },
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
//       },
//       sam: {
//         2020: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         2021: [{ genre: 'dance', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'dance', count: 2 }, { genre: 'rock', count: 2 }],
//       },
//     }
//     console.log(JSON.stringify(res));
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['dance']
//       },
//       {
//         poster: 'ben',
//         time: { year: 2020 },
//         genres: ['dance']
//       },
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'dance', count: 2 }],
//         allYears: [{ genre: 'dance', count: 2 }],
//       },
//       sam: {
//         2020: [{ genre: 'dance', count: 1 }],
//         allYears: [{ genre: 'dance', count: 1 }],
//       },
//       ben: {
//         2020: [{ genre: 'dance', count: 1 }],
//         allYears: [{ genre: 'dance', count: 1 }],
//       },
//     }
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['dance']
//       },
//       {
//         poster: 'ben',
//         time: { year: 2020 },
//         genres: ['pop']
//       },
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'dance', count: 1 }, { genre: 'pop', count: 1 }],
//         allYears: [{ genre: 'dance', count: 1 }, { genre: 'pop', count: 1 }],
//       },
//       sam: {
//         2020: [{ genre: 'dance', count: 1 }],
//         allYears: [{ genre: 'dance', count: 1 }],
//       },
//       ben: {
//         2020: [{ genre: 'pop', count: 1 }],
//         allYears: [{ genre: 'pop', count: 1 }],
//       },
//     }
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['dance']
//       },
//       {
//         poster: 'ben',
//         time: { year: 2021 },
//         genres: ['pop']
//       },
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'dance', count: 1 }],
//         2021: [{ genre: 'pop', count: 1 }],
//         allYears: [{ genre: 'dance', count: 1 }, { genre: 'pop', count: 1 }],
//       },
//       sam: {
//         2020: [{ genre: 'dance', count: 1 }],
//         allYears: [{ genre: 'dance', count: 1 }],
//       },
//       ben: {
//         2021: [{ genre: 'pop', count: 1 }],
//         allYears: [{ genre: 'pop', count: 1 }],
//       },
//     }
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });

//   it('', () => {
//     const lookup = { renamed: [], grouped: [] };
//     const processedPosts = [
//       {
//         poster: 'sam',
//         time: { year: 2020 },
//         genres: ['dance']
//       },
//       {
//         poster: 'ben',
//         time: { year: 2021 },
//         genres: ['pop']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['dance']
//       },
//       {
//         poster: 'ben',
//         time: { year: 2021 },
//         genres: ['jazz']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['pop', 'jazz']
//       },
//       {
//         poster: 'sam',
//         time: { year: 2021 },
//         genres: ['rock', 'blues']
//       },
//       {
//         poster: 'jon',
//         time: { year: 2021 },
//         genres: ['rock', 'jazz', 'blues', 'flamenco']
//       },
//       {
//         poster: 'jon',
//         time: { year: 2022 },
//         genres: ['flamenco', 'classical']
//       },
//     ];
//     const res = tallyGenres(processedPosts, lookup);
//     const expected = {
//       allPosters: {
//         2020: [{ genre: 'dance', count: 1 }],
//         2021: [{ genre: 'jazz', count: 3 }, { genre: 'blues', count: 2 }, { genre: 'pop', count: 2 }, { genre: 'rock', count: 2 }, { genre: 'dance', count: 1 }, { genre: 'flamenco', count: 1 }],
//         2022: [{ genre: 'classical', count: 1 }, { genre: 'flamenco', count: 1 }],
//         allYears: [{ genre: 'jazz', count: 3 }, { genre: 'blues', count: 2 }, { genre: 'dance', count: 2 }, { genre: 'flamenco', count: 2 }, { genre: 'pop', count: 2 }, { genre: 'rock', count: 2 }, { genre: 'classical', count: 1 }],
//       },
//       sam: {
//         2020: [{ genre: 'dance', count: 1 }],
//         2021: [{ genre: 'blues', count: 1 }, { genre: 'dance', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
//         allYears: [{ genre: 'dance', count: 2 }, { genre: 'blues', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }, { genre: 'rock', count: 1 }],
//       },
//       ben: {
//         2021: [{ genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }],
//         allYears: [{ genre: 'jazz', count: 1 }, { genre: 'pop', count: 1 }],
//       },
//       jon: {
//         2021: [{ genre: 'blues', count: 1 }, { genre: 'flamenco', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'rock', count: 1 },],
//         2022: [{ genre: 'classical', count: 1 }, { genre: 'flamenco', count: 1 }],
//         allYears: [{ genre: 'flamenco', count: 2 }, { genre: 'blues', count: 1 }, { genre: 'classical', count: 1 }, { genre: 'jazz', count: 1 }, { genre: 'rock', count: 1 }],
//       },
//     }
//     console.log(JSON.stringify(res))
//     expect(_.isEqual(res, expected)).toEqual(true);
//   });


// });

// xdescribe('coerce2DigitYearTo4DigitYear()', () => {
//   it('', () => {
//     const twoDigitYearStr = '23';
//     const currentYear = new Date().getFullYear(); // 2023
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2023';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '20';
//     const currentYear = new Date().getFullYear(); // 2023
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2020';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '19';
//     const currentYear = new Date().getFullYear(); // 2023
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2019';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '19';
//     const currentYear = 2019;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2019';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '23';
//     const currentYear = 2023;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2023';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '01';
//     const currentYear = 2023;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2001';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '01';
//     const currentYear = new Date().getFullYear(); // 2023
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2001';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '99';
//     const currentYear = 2100;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2099';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '00';
//     const currentYear = 2100;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2100';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '01';
//     const currentYear = 2101;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2101';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '23';
//     const currentYear = 2123;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2123';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '22';
//     const currentYear = 2123;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2122';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '98';
//     const currentYear = 2000;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '1998';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '98';
//     const currentYear = 2023;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '1998';
//     console.log(res);
//     expect(res).toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '98';
//     const currentYear = 2023;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     const expected = '2098';
//     console.log(res);
//     expect(res).not.toEqual(expected);
//   });
//   it('', () => {
//     const twoDigitYearStr = '23';
//     const currentYear = 2023;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     console.log(res);
//     expect(typeof res).toEqual('string');
//   });
//   it('', () => {
//     const twoDigitYearStr = '23';
//     const currentYear = 2023;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     console.log(res);
//     expect(typeof res).not.toEqual('number');
//   });
//   it('', () => {
//     const twoDigitYearStr = 23;
//     const currentYear = 2023;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     console.log(res);
//     expect(typeof res).toEqual('string');
//   });
//   it('', () => {
//     const twoDigitYearStr = 23;
//     const currentYear = 2023;
//     const res = coerce2DigitYearTo4DigitYear(twoDigitYearStr, currentYear);
//     console.log(res);
//     expect(typeof res).not.toEqual('number');
//   });
// });

// xdescribe('coerceLanguageDateFormat()', () => {
//   const splitBySeperatorFunc = (datePortion) => {
//     let separator = '/';
//     if (datePortion.includes('.')) separator = '.';
//     if (datePortion.includes('-')) separator = '-';
//     if (datePortion.includes('/')) separator = '/';
//     return datePortion.split(separator);
//   };

//   describe('GB', () => {
//     const locale = 'en-GB';
//     // gb
//     it('d/m/yy', () => {
//       const datePortion = '1/9/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2023';
//       expect(res).toEqual({ day: '01', month: '09', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('d/m/yyyy', () => {
//       const datePortion = '1/8/2023';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/08/2023';
//       expect(res).toEqual({ day: '01', month: '08', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('d/mm/yy', () => {
//       const datePortion = '1/12/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/12/2023';
//       expect(res).toEqual({ day: '01', month: '12', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('d/mm/yyyy', () => {
//       const datePortion = '2/11/2023';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '02/11/2023';
//       expect(res).toEqual({ day: '02', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('dd/m/yy', () => {
//       const datePortion = '21/8/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '21/08/2023';
//       expect(res).toEqual({ day: '21', month: '08', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('dd/m/yyyy', () => {
//       const datePortion = '22/9/2023';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '22/09/2023';
//       expect(res).toEqual({ day: '22', month: '09', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('dd/mm/yy', () => {
//       const datePortion = '11/30/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '11/30/2023';
//       expect(res).toEqual({ day: '11', month: '30', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('dd/mm/yyyy', () => {
//       const datePortion = '11/30/2023';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '11/30/2023';
//       expect(res).toEqual({ day: '11', month: '30', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//   });


//   describe('US', () => {
//     const locale = 'en-US';
//     // us
//     it('d/m/yy', () => {
//       //. sept 1st 2022
//       const datePortion = '9/1/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('d/m/yyyy', () => {
//       const datePortion = '9/1/2023';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2023';
//       expect(res).toEqual({ day: '01', month: '09', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('d/mm/yy', () => {
//       //. 3rd Dec 21
//       const datePortion = '12/3/21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('d/mm/yyyy', () => {
//       //. 3rd Dec 2016
//       const datePortion = '12/3/2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('dd/m/yy', () => {
//       //. 30th May 19
//       const datePortion = '5/30/19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('dd/m/yyyy', () => {
//       //. 30th March 2019
//       const datePortion = '3/30/2018';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2018';
//       expect(res).toEqual({ day: '30', month: '03', year: '2018' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('dd/mm/yy', () => {
//       //. 12th November 23
//       const datePortion = '11/12/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     it('dd/mm/yyyy', () => {
//       //. 12th November 2022
//       const datePortion = '11/12/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });

//   // aus
//   describe('AUS', () => {
//     const locale = 'en-AU';

//     //. 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1/9/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1/9/2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '3/12/21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3/12/2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30/5/19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30/3/17';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12/11/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12/11/2023';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//   });

//   // can
//   describe('CAN', () => {
//     const locale = 'en-CA';

//     //. 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '22-9-1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '2020-9-1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '21-12-3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '2016-12-3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '19-05-30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '2017-3-30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '23-11-12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     //. 12th November 2022
//     it('dd/mm/yyyy', () => {
//       const datePortion = '2022-11-12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });


//   // ire
//   describe('IRE', () => {
//     const locale = 'en-IE';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1/9/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1/9/2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '3/12/21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3/12/2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30/5/19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30/3/2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12/11/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12/11/2022';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });


//   // nz
//   describe('NZ', () => {
//     const locale = 'en-NZ';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1/9/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1/9/2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '3/12/21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3/12/2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30/5/19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30/3/2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12/11/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12/11/2022';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });


//   // sa
//   describe('SA', () => {
//     const locale = 'en-ZA';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '22/9/1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '2020/9/1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '21/12/3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '2016/12/3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '19/5/30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '2017/3/30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '23/11/12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '2022/11/12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });


//   // ind
//   describe('IND', () => {
//     const locale = 'en-IN';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1/9/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1/9/2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '3/12/21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3/12/2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30/5/19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30/3/2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12/11/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12/11/2022';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });

//   // ph
//   describe('PH', () => {
//     const locale = 'en-PH';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '9/1/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '9/1/2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '12/3/21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '12/3/2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '5/30/19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '3/30/2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '11/12/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '11/12/2022';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });




//   // ned
//   describe('NED', () => {
//     const locale = 'nl-NL';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1-9-22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1-9-2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '3-12-21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3-12-2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30-5-2019';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30-3-2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12-11-23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12-11-2022';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });



//   // tur
//   describe('TURK', () => {
//     const locale = 'tr-TR';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1.9.22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1.9.2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '3.12.21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3.12.2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30.5.19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30.3.2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12.11.23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12.11.22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });



//   // fr
//   describe('FRA', () => {
//     const locale = 'fr-FR';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1/9/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1/9/2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '3/12/21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3/12/2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30/5/19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30/3/2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12/11/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12/11/2022';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });

//   // fr can
//   describe('FRA CAN', () => {
//     const locale = 'fr-CA';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '22-9-1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '2020-9-1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '21-12-3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd April 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '2016-04-3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/04/2016';
//       expect(res).toEqual({ day: '03', month: '04', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '19-5-30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '2017-3-30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '23-11-12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '2022-11-12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });



//   // ger
//   describe('GER', () => {
//     const locale = 'de-DE';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1.9.22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1.9.2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '3.12.21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3.12.2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30.5.19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30.3.2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12.11.23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12.11.2022';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });

//   // spai
//   describe('SPAI', () => {
//     const locale = 'es-ES';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1/9/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1/9/2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd June 21
//     it('d/mm/yy', () => {
//       const datePortion = '3/06/21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/06/2021';
//       expect(res).toEqual({ day: '03', month: '06', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3/12/16';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30/5/2019';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30/3/2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th Feb 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12/02/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/02/2023';
//       expect(res).toEqual({ day: '12', month: '02', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12/11/2022';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });



//   // ita
//   describe('ITA', () => {
//     const locale = 'it-IT';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1/9/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1/9/2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '3/12/21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3/12/2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30/5/19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30/3/2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12/11/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12/11/2022';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });


//   // spai usa
//   describe('SPAI USA', () => {
//     const locale = 'es-US';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1/9/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1/9/2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '3/12/21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3/12/2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30/5/19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30/3/2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12/11/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12/11/2022';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });




//   // kor
//   describe('KOR', () => {
//     const locale = 'ko-KR';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '22/9/1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '2020/9/1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd April 21
//     it('d/mm/yy', () => {
//       const datePortion = '21/04/3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/04/2021';
//       expect(res).toEqual({ day: '03', month: '04', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '2016/12/3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd May 19
//     it('dd/m/yy', () => {
//       const datePortion = '19/5/03';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/05/2019';
//       expect(res).toEqual({ day: '03', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '2017/3/30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '23/11/12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '22/11/01';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/11/2022';
//       expect(res).toEqual({ day: '01', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });



//   // jap
//   describe('JAP', () => {
//     const locale = 'ja-JP';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '22/9/1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '2020/9/1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '21/12/3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '2016/12/3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '19/5/30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '2017/3/01';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/03/2017';
//       expect(res).toEqual({ day: '01', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '23/11/12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '2022/11/12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });



//   // chi simp
//   describe('CHI SIMP', () => {
//     const locale = 'zh-CN';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '22/9/1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '2020/9/1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '21/12/3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '2016/12/3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '19/5/30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '2017/3/30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '23/11/12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '2022/11/12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });

//   // chi trad hk
//   describe('CHI TRAD HK', () => {
//     const locale = 'zh-HK';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '1/9/22';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '1/9/2020';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '3/12/21';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '3/12/2016';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '30/5/19';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '30/3/2017';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '12/11/23';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '12/11/2022';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });

//   // chi trad tw
//   describe('CHI TRAD TW', () => {
//     const locale = 'zh-TW';

//     // 1st Sept 22
//     it('d/m/yy', () => {
//       const datePortion = '22/9/1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2022';
//       expect(res).toEqual({ day: '01', month: '09', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 1st Sept 2020
//     it('d/m/yyyy', () => {
//       const datePortion = '2020/9/1';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '01/09/2020';
//       expect(res).toEqual({ day: '01', month: '09', year: '2020' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 21
//     it('d/mm/yy', () => {
//       const datePortion = '21/12/3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2021';
//       expect(res).toEqual({ day: '03', month: '12', year: '2021' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 3rd Dec 2016
//     it('d/mm/yyyy', () => {
//       const datePortion = '2016/12/3';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '03/12/2016';
//       expect(res).toEqual({ day: '03', month: '12', year: '2016' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th May 19
//     it('dd/m/yy', () => {
//       const datePortion = '19/5/30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/05/2019';
//       expect(res).toEqual({ day: '30', month: '05', year: '2019' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 30th March 2017
//     it('dd/m/yyyy', () => {
//       const datePortion = '2017/3/30';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '30/03/2017';
//       expect(res).toEqual({ day: '30', month: '03', year: '2017' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 23
//     it('dd/mm/yy', () => {
//       const datePortion = '23/11/12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2023';
//       expect(res).toEqual({ day: '12', month: '11', year: '2023' });
//       expect(resJoined).toEqual(expected);
//     });
//     // 12th November 2022 
//     it('dd/mm/yyyy', () => {
//       const datePortion = '2022/11/12';
//       const res = coerceLanguageDateFormat(splitBySeperatorFunc(datePortion), locale);
//       const resJoined = `${res.day}/${res.month}/${res.year}`;
//       const expected = '12/11/2022';
//       expect(res).toEqual({ day: '12', month: '11', year: '2022' });
//       expect(resJoined).toEqual(expected);
//     });
//   });
// });

describe.only('msgTimeComponents()', () => {

  it('GB', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'en-GB';

    let singleMessage = '21/05/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21/5/20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30/09/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10/12/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('US', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'en-US';

    let singleMessage = '05/21/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '5/21/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '9/30/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '12/10/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('AUS', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'en-AU';

    let singleMessage = '21/05/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21/5/20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30/9/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10/12/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('CAN', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'en-CA';

    let singleMessage = '2020-05-21, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '20-5-21, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '2019-9-30, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '19-12-10, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('IRE', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'en-IE';

    let singleMessage = '21/05/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21/5/20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30/09/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10/12/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('NZ', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'en-NZ';

    let singleMessage = '21/05/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21/5/20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30/09/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10/12/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('SA', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'en-ZA';

    let singleMessage = '2020/05/21, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '20/5/21, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '2019/9/30, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '19/12/10, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('IND', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'en-IN';

    let singleMessage = '21/05/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21/5/20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30/09/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10/12/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('PHI', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'en-PH';

    let singleMessage = '05/21/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '5/21/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '9/30/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '12/10/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('NED', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'nl-NL';

    let singleMessage = '21-05-2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21-5-20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30-09-2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10-12-19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('TURK', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'tr-TR';

    let singleMessage = '21.05.2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21.5.20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30.09.2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10.12.19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('FRA', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'fr-FR';

    let singleMessage = '21/05/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21/5/20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30/09/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10/12/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('FR CAN', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'fr-CA';

    let singleMessage = '2020-05-21, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '20-5-21, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '2019-9-30, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '19-12-10, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('GER', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'de-DE';

    let singleMessage = '21.05.2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21.5.20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30.09.2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10.12.19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('SPA', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'es-ES';

    let singleMessage = '21/05/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21/5/20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30/09/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10/12/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('ITA', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'it-IT';

    let singleMessage = '21/05/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21/5/20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30/09/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10/12/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('SPA USA', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'es-US';

    let singleMessage = '21/05/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21/5/20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30/09/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10/12/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('KOR', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'ko-KR';

    let singleMessage = '2020/05/21, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '20/5/21, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '2019/9/30, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '19/12/10, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('JAP', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'ja-JP';

    let singleMessage = '2020/05/21, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '20/5/21, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '2019/9/30, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '19/12/10, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('CHI SIMP', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'zh-CN';

    let singleMessage = '2020/05/21, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '20/5/21, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '2019/9/30, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '19/12/10, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('CHI TRAD HK', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'zh-HK';

    let singleMessage = '21/05/2020, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '21/5/20, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '30/09/2019, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '10/12/19, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

  it('CHI TRAD TW', () => { // 21st 0May[2] 2020, 21st May[1] 20, 30th Sep[1] 2019, 10th Dec[2] 19
    const locale = 'zh-TW';

    let singleMessage = '2020/05/21, 12:30 - Ben Belward: blah msg text etc.     ';
    let res = msgTimeComponents(singleMessage.trim(), locale);
    let expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    let theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '20/5/21, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '21', month: '05', year: '2020', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '2019/9/30, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '30', month: '09', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);

    singleMessage = '19/12/10, 12:30 - Ben Belward: blah msg text etc.     ';
    res = msgTimeComponents(singleMessage.trim(), locale);
    expected = { day: '10', month: '12', year: '2019', hour: '12', minute: '30' };
    theSame = _.isEqual(res, expected)
    expect(theSame).toEqual(true);
  });

});
