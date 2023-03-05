const inputText = `29/05/2020, 12:19 - Johnny Ratcliffe: Yep
30/05/2020, 13:21 - Ben Belward: Here’s a song for you… Only One by James Taylor
https://open.spotify.com/track/05re487C0a3bJNZnPfDqMp?si=7IpsCBB6SAy-46V_T7Qx9w


14/09/2020, 14:59 - Ben Belward: guys, does anyone know what the song in the background of this is? 


https://www.youtube.com/watch?v=X6l1MLMLZ8M
4.03.2023 22:40 - Sam: A few more 😁
4.03.2023 22:41 - Esra: https://open.spotify.com/track/3ZGdgkYBOPhumjVBk7rCxb?si=FNDPCz5tQMSSRcDC9x8x_w
4.03.2023 22:40 - Sam: 9/11/2001 - never forget.
4.03.2023 22:40 - Sam: 9/11/2001 - what I think I want to say is: no. 
 
`;

const splitByNewline = inputText.split('\n');

let newStr = '';

const individualMessages = splitByNewline.reduce((acc, e, i) => {
  if ((/^\d{1,4}[\W\D]{1}\d{1,4}[\W\D]{1}\d{1,4}[^:]*\:{1}[^-]*\-{1}[^:]*\:{1}/gm).test(e)) {
    acc.push(newStr);
    newStr = e;
  } else {
    newStr += (' ' + e)
  }
  if (i === splitByNewline.length - 1) acc.push(newStr);
  return acc;
}, []).map(e => e.trim());

console.log(individualMessages)