const msg = "28/05/2020, 18:39 -  Johnny Ratcliffe: https://open.spotify.com/track/4TFtYsNd37rqc3rtYHM267?si=AsVuPxjxR86NzvLXpdyoRg \nNew Moby Album.\n\nOne of the better tracks."
console.log(JSON.stringify(msg))
const noNewlines = msg.replaceAll('\n', ' ');
console.log(JSON.stringify(noNewlines))

