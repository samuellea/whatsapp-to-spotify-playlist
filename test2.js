const videoDataObjs = [{ id: 1 }, null, { id: 2 }]
const videoDataObjsMinusNulls = videoDataObjs.filter(e => e)
console.log(videoDataObjsMinusNulls)