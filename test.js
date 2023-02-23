const str = `
30/05/2019, 10:12 - Aaron Ayling: I don't hate Courtney Barnett <_<
30/05/2019, 10:16 - Johnny Stowellman: She's got a realllly affected bogan accent
30/05/2019, 10:17 - Johnny Stowellman: She's from the inner north of Melbourne. It's the equivalent of putting on an eastend accent if you're from Richmond
30/05/2019, 10:20 - Johnny Stowellman: Northern Beaches in Sydney* actually, which is even worse
`

const res = str.replace('\r', '!');
console.log(res)