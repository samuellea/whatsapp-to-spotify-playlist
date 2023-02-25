/*
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const time = { day: '30', month: '01', year: '2020', hour: '13', minute: '21' };
const timeAsString = `${months[+time.month - 1]} ${+time.day}, ${time.year} ${time.hour}:${time.minute}:00`;
const timeStringAsDate = new Date(timeAsString);
const timeAsMilliseconds = timeStringAsDate.getTime();
console.log(timeAsString)
console.log(timeStringAsDate)
console.log(timeAsMilliseconds)

// const event = new Date('August 19, 1975 23:15:30');

// 24 Hours = 86,400,000 Milliseconds
*/

/* NB - this affects 
h.inputTextIsValid
splitIndividualMessagesIntoPosts  
splitTextIntoIndividualMessages */

// const txt24Hr = `
// 11/01/2023, 19:41 - Dan Brown-Smith: Tap to learn more.
// 11/01/2023, 19:41 - Sam Lea: join brave-pressure
// 11/01/2023, 19:42 - Sam Lea: cupcake!
// `;

// const text12Hr = `
// 11/01/2023, 5:40pm - Dan Brown-Smith: Tap to learn more.
// 11/01/2023, 5:41pm - Sam Lea: join brave-pressure
// 11/01/2023, 5:42pm - Sam Lea: cupcake!
// `;

// const text12HrInvisiChar = `
// 11/01/2023, 5:40 pm - Dan Brown-Smith: Tap to learn more.
// 11/01/2023, 5:41 pm - Sam Lea: join brave-pressure
// 11/01/2023, 5:42 pm - Sam Lea: cupcake
// `;

// const text12HrGlitched = `
// 11/01/2023, 5:40â€¯pm - Dan Brown-Smith: Tap to learn more.
// 11/01/2023, 5:41â€¯pm - Sam Lea: join brave-pressure
// 11/01/2023, 5:42â€¯pm - Sam Lea: cupcake
// `;

// const dateTime = '11/01/2023, 13:32';
// const timePortion = dateTime.slice(12);
// console.log(timePortion)

// const timePortion = individualMessage.substring(0, individualMessage.indexOf('-'));

// const A = '11/01/2023, 5:40â€¯pm - Dan Brown - Smith: Tap to - learn more.';
// const B = '11/01/2023, 00:41 - Dan Brown-Smith: Tap to learn more.'
// const C = '11/01/2023, 09:01 - Dan Brown-Smith: Tap to learn more.'
// const D = '11/01/2023, 10:41 - Dan Brown-Smith: Tap to learn more.'
// const E = '11/01/2023, 10:41 - Dan Brown-Smith: Tap to learn more.'
// const F = '11/01/2023, 19:41 - Dan Brown-Smith: Tap to learn more.'
// const G = '11/01/2023, 20:01 - Dan Brown-Smith: Tap to learn more.'
// const H = '11/01/2023, 23:41 - Dan Brown-Smith: Tap to learn more.'
// const I = '11/01/2023, 5:40pm - Dan Brown-Smith: Tap to learn more.'
// const J = '11/01/2023, 5:40am - Dan Brown-Smith: Tap to learn more.'
// const K = '11/01/2023, 5:40 pm - Dan Brown-Smith: Tap to learn more.'
// const L = '11/01/2023, 5:40 am - Dan Brown-Smith: Tap to learn more.'
// const M = '11/01/2023, 5:40â€¯pm - Dan Brown-Smith: Tap to learn more.'
// const N = '11/01/2023, 5:40â€¯am - Dan Brown-Smith: Tap to learn more.'
// const O = '11/01/2023, 12:40pm - Dan Brown-Smith: Tap to learn more.'
// const P = '11/01/2023, 12:40am - Dan Brown-Smith: Tap to learn more.'
// const Q = '11/01/2023, 12:40 pm - Dan Brown-Smith: Tap to learn more.'
// const R = '11/01/2023, 12:40 am - Dan Brown-Smith: Tap to learn more.'
// const S = '11/01/2023, 12:40â€¯pm - Dan Brown-Smith: Tap to learn more.'
// const T = '11/01/2023, 5:40â€¯am - Dan Brown-Smith: Tap to learn more.'
// const individualMessage = U;

const indivMess1 = `
11/01/2023, 5:40â€¯am - Dan Brown-Smith: Well.

open.spotify.com/track/109132098s989sdhjk
`;

const indivMess2 = `
11/01/2023, 5:40â€¯am - Dan Brown-Smith: Well.

open.spotify.com/track/109132098s989sdhjk. Pretty good, right?
`;

const indivMess3 = `
11/01/2023, 5:40â€¯am - https://open.spotify.com/track/109132098s989sdhjk. One for my boys
`;

const indivMess4 = `
11/01/2023, 15:40pm - https://open.spotify.com/track/109132098s989sdhjk. 
One for my boys
`;

const singleMessage = indivMess4.trim();
const dateTime = singleMessage.substring(0, singleMessage.indexOf('-') - 1);
console.log(dateTime)

const timePortion = dateTime.substring(12)
console.log(timePortion.length)