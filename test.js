export const getIdFromGoogleDocURL = (url) => {
        const googleDocRegex = /(?<=docs.google.com\/document\/d\/)(.*)/g;
        const match = url.match(googleDocRegex);
        if (match) return match[0].split('/')[0];
        return match;
};

const url = 'https://docs.google.com/document/d/1Y6aFY7pDjHO73RE_qaicP6K9lg4WOB_Nr3rm4TvYg-Q';

console.log(getIdFromGoogleDocURL(url))