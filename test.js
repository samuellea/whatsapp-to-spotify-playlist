const posterAliasesInState = [
  // { main: 'John', aliases: ['John', 'John (Work)'] },
  { main: 'Sam', aliases: ['Sam', 'Sam (Work)'] },
];

const main = 'Ben';
const namesToGroup = ['Ben', 'Sam'];

const res = posterAliasesInState.findIndex(obj => obj.aliases.some(e => namesToGroup.includes(e)));
console.log(res)