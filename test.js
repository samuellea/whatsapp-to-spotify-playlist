const posterAliasesInState = [
  // { main: 'John', aliases: ['John', 'John (Work)'] },
  { main: 'Sam', aliases: ['Sam', 'Sam (Work)'] },
];

const main = 'Ben';
const namesToGroup = ['Ben', 'Sam'];

const res = posterAliasesInState.findIndex(obj => obj.aliases.some(e => namesToGroup.includes(e)));
console.log(res)

/*

const targetPosterAliasesObj = posterAliasesInState[indexOfAliasObjIfAlreadyExists];
//  { main: 'Sam', aliases: ['Sam', 'Sam (Work)'] }

const newNameGrouping = { main: main, aliases: _.uniq([...namesToGroup, ...targetPosterAliasesObj.aliases]) };
// {main: Ben, aliases: ['Ben', 'Sam', 'Sam (Work)']}

*/