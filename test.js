const arr = [{ to: 'a' }, { to: 'b' }, { to: 'c' }];
let arrUpdated = [...arr];
const groupee = 'b'
arrUpdated = arrUpdated.filter(e => e.to !== groupee);
console.log(arrUpdated)