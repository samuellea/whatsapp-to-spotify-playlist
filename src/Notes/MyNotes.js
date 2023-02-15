// sort an array based on two criteria
// eg. ranked by monthly total, then if monthly total the same, sort alphabetically
const monthObjDotPosts = [
  { poster: 'Sam (Work)', monthlyTotal: 1 },
  { poster: 'Ben Belward', monthlyTotal: 2 },
  { poster: 'Johnny Ratcliffe', monthlyTotal: 1 },
  { poster: 'Sam', monthlyTotal: 5 },
]

const res = [...monthObjDotPosts].sort(function (a, b) {

  // Sort by votes
  // If the first item has a higher number, move it down
  // If the first item has a lower number, move it up
  if (a.monthlyTotal > b.monthlyTotal) return 1;
  if (a.monthlyTotal < b.monthlyTotal) return -1;

  // If the votes number is the same between both items, sort alphabetically
  // If the first item comes first in the alphabet, move it up
  // Otherwise move it down
  if (a.poster < b.poster) return 1;
  if (a.poster > b.poster) return -1;

});
console.log(res)

// create multiple refs to be used on multiple elements
// creatRef useRef

let myRefs = useRef([])
myRefs = byYear[slide - 1].posters.map(e => React.createRef())
useEffect(() => {
  const refWidths = myRefs.map(e => e.current.clientWidth);
}, [slide])

// ...map(e => (
  // <div className="blah" ref={myRefs[i]}
// ))