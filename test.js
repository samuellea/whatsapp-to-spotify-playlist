const dateTime = '4.03.2023 22:41';
let seperator = '.'
const splitBySeperator = dateTime.split(seperator);
console.log(splitBySeperator)
const daysMonthsDoubleDigits = splitBySeperator.map(e => {
  if (e.length >= 4) return e;
  if (e.length < 2) return `0${e}`;
  return e;
});
console.log(daysMonthsDoubleDigits)