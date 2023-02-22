const vidTitle = 'James Newman Song version';
const spotiTitle = 'James Newman Song - Karaoke Version';

const stringContainsKaraoke = (str) => {
        if (str.toLowerCase().includes('karaoke')) return true;
        if (str.toLowerCase().includes('karaoki')) return true;
        if (str.toLowerCase().includes('kareoke')) return true;
        if (str.toLowerCase().includes('kareoki')) return true;
        if (str.toLowerCase().includes('karioke')) return true;
        if (str.toLowerCase().includes('karioki')) return true;
        if (str.toLowerCase().includes('karaeoke')) return true;
        return false;
};


if (!stringContainsKaraoke(vidTitle) && stringContainsKaraoke(spotiTitle)) {
        console.log('oh no, karaoke!')
}