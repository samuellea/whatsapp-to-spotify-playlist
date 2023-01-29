const _ = require('lodash');

const arrA = [
  { id: 1, food: 'apple' },
];
const arrB = [
  { id: 1, food: 'apple' },
  { id: 2, food: 'banana' },
];

console.log(_.find(arrA, arrB[0]))