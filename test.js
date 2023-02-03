const acc = [
  { year: 1999, months: [{ month: 1, posts: [{ poster: 'Sam', monthlyTotal: 1 }] }] }
]

const res = acc.find(e => e.year === 1999)
console.log(res)