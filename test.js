const dataObjectEntries = [
  ['-idblah1234', { id: 1, name: 'apple' }],
  ['-xzblah5678', { id: 2, name: 'apple' }],
];


const res = dataObjectEntries.map(e => ({ metaId: e[0], ...e[1] }));
console.log(res)