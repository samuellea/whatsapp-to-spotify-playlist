import {
  newMsgsNotInChatLog,
  splitTextIntoIndividualMessages,
  splitIndividualMessagesIntoPosts,
} from './helpers';

describe('newMsgsNotInChatLog()', () => {
  it('', () => {
    const cLog = []; // chatLogSplit
    const iTxt = []; // inputTextSplit
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [];
    const iTxt = [1];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [1];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [];
    const iTxt = [1, 2];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [1, 2];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2];
    const iTxt = [1, 2];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2];
    const iTxt = [1, 2, 3];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [3];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2];
    const iTxt = [2, 3, 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [3, 4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3];
    const iTxt = [1, 2, 3, 2, 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3];
    const iTxt = [2, 3, 2, 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3];
    const iTxt = [1, 2, 'd', 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3];
    const iTxt = ['d', 3, 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3];
    const iTxt = [2, 'd', 2, 3, 4];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 4];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 'd', 5];
    const iTxt = [3, 'd', 5, 6];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [6];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 4, 3, 5];
    const iTxt = [3, 5, 6, 7];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = [6, 7];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 4, 5, 6, 7];
    const iTxt = [1, 2, 3, 'd', 'd', 'd', 7, 8];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 'd', 'd', 8];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 4, 5, 6, 7];
    const iTxt = [1, 2, 3, 'd', 'd', 'd', 'd', 8];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 'd', 'd', 'd', 8];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 4, 5, 6, 7];
    const iTxt = [3, 'd', 'd', 'd', 7, 8];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 'd', 'd', 8];
    expect(newMsgs).toEqual(expected);
  });
  it('', () => {
    const cLog = [1, 2, 3, 4, 5, 6, 7];
    const iTxt = ['d', 'd', 'd', 7, 8];
    const newMsgs = newMsgsNotInChatLog(cLog, iTxt);
    const expected = ['d', 'd', 'd', 8];
    expect(newMsgs).toEqual(expected);
  });
});

describe.only('determines correct number of posts from input text', () => {
  let chatLog = '';
  let inputText;
  const newPostsFound = (textString) => {
    const chatLogSplit = splitTextIntoIndividualMessages(chatLog);
    const inputTextSplit = splitTextIntoIndividualMessages(inputText);
    const newMessages = newMsgsNotInChatLog(chatLogSplit, inputTextSplit);
    const newPosts = splitIndividualMessagesIntoPosts(newMessages);
    return newPosts;
  }
  it('', () => {
    inputText = `
    14/01/2023, 10:00 - Mum: https://youtu.be/y6xmhyd1423
    `
    const res = newPostsFound(inputText).length
    const expected = 1;
    expect(res).toEqual(expected);
  });

  it('', () => {
    inputText = `
    14/01/2023, 10:00 - Mum: https://youtu.be/y6xmhyd1P2w
    14/01/2023, 11:00 - Sam: Here's some text
    `
    const res = newPostsFound(inputText).length
    const expected = 1;
    expect(res).toEqual(expected);
  });

  it('', () => {
    inputText = `
    14/01/2023, 10:00 - Mum: https://youtu.be/y6xmhyd1P2w
    14/01/2023, 11:00 - Sam: Here's some text

    `
    const res = newPostsFound(inputText).length
    const expected = 1;
    expect(res).toEqual(expected);
  });

  it('', () => {
    inputText = `
    14/01/2023, 10:00 - Mum: https://youtu.be/y6xmhyd1P2w
    14/01/2023, 11:00 - Sam: Here's some text
    
    https://youtu.be/1NXmpUrp5W8
    `
    const res = newPostsFound(inputText).length
    const expected = 2;
    expect(res).toEqual(expected);
  });

  it('', () => {
    inputText = `
    14/01/2023, 10:00 - Mum: https://youtu.be/y6xmhyd1P2w
    14/01/2023, 11:00 - Sam: Here's some text
    
    https://youtu.be/1NXmpUrp5W8


    `
    const res = newPostsFound(inputText).length
    const expected = 2;
    expect(res).toEqual(expected);
  });

  it('', () => {
    inputText = `
    14/01/2023, 10:00 - Mum: https://youtu.be/y6xmhyd1P2w
    14/01/2023, 11:00 - Sam: Here's some text
    
    https://youtu.be/1NXmpUrp5W8
    14/01/2023, 13:00 - Sam: none here ^_^
    14/01/2023, 12:00 - Sam: https://youtu.be/kLWSQRNnGY8
    
    https://youtu.be/9OI4GH-lKMY?t=18000
    14/01/2023, 13:00 - Sam: https://youtu.be/Q0iqg2UanEc
    14/01/2023, 14:00 - Sam: https://www.youtube.com/watch?v=HLzqjmoZZAc&list=123990sdfZ
    14/01/2023, 15:00 - Mum: https://www.youtube.com/watch?v=H_hT61-E5kg?t=500s
    
    https://www.youtube.com/watch?v=IRaXGyzL4oU
    15/01/2023, 08:32 - Adamo: https://www.youtube.com/watch?v=mDW7q5ScgiA song 9/10, graphics 6/10
    https://www.youtube.com/watch?v=3rp_eO1verM song 7.5/10 graphics 9/10
    `
    const res = newPostsFound(inputText).length
    const expected = 10;
    expect(res).toEqual(expected);
  });

  it('', () => {
    inputText = `
    12/01/2023, 13:06 - Sam Lea: No link
    12/01/2023, 13:10 - Mum: https://open.spotify.com/track/2vHzOWRKYPLu8umRPIFuOq?si=udKz-L1CTVS9dRqRRmr31Q&context=spotify%3Aplaylist%3A37i9dQZF1DWVCKO3xAlT1Q
    12/01/2023, 16:25 - Sam Lea: You deleted this message
    13/01/2023, 10:58 - Sam Lea: https://open.spotify.com/track/3KiexfmhxHvG5IgAElmTkd?si=65fbbbeabb584d21
    13/01/2023, 10:58 - Sam Lea: There's a song on its own, and this is a seperate text-only message
    13/01/2023, 10:58 - Sam Lea: https://open.spotify.com/track/54X78diSLoUDI3joC2bjMz?si=e2ac80e63ba4486a
    
    Here's a message containing both a song, AND some text
    13/01/2023, 10:59 - Sam Lea: And the same again, but with the text at the start
    
    https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg?si=8e9daf4c0b514e78
    13/01/2023, 11:00 - Sam Lea: https://open.spotify.com/track/4wjKBHUbARaVSnVUviim80?si=f800cc6462804253
    
    https://open.spotify.com/track/6bu1USUraCJ7sl6A2XlftS?si=2f0ff697ba644478
    
    https://open.spotify.com/track/0R3OsaMMAK5IMFMhnk24OS?si=b9980d7613f14afd
    13/01/2023, 11:00 - Sam Lea: Then, there were multiple song links sent in a single message
    13/01/2023, 11:00 - Sam Lea: https://open.spotify.com/track/1CcnE9kM0wxQsxx9nonIfo?si=7c625052f5344fb9
    
    https://open.spotify.com/track/3K1XhkSbemUXNenamy2Tjq?si=8de8fd0a57854c7c
    
    And multiple tracks again, but with some text, too!
    13/01/2023, 11:00 - Sam Lea: That's it for now.
    
    14/01/2023, 10:00 - Mum: https://youtu.be/y6xmhyd1P2w
    14/01/2023, 11:00 - Sam: Here's some text
    
    https://youtu.be/1NXmpUrp5W8
    14/01/2023, 12:00 - Sam: https://youtu.be/kLWSQRNnGY8
    
    https://youtu.be/9OI4GH-lKMY?t=18000
    14/01/2023, 13:00 - Sam: https://open.spotify.com/track/7xbBNB9bivza5vrYfnZJYg?si=81c05244410d4706
    
    https://youtu.be/Q0iqg2UanEc
    14/01/2023, 14:00 - Sam: https://www.youtube.com/watch?v=HLzqjmoZZAc&list=123990sdfZ
    14/01/2023, 15:00 - Mum: https://www.youtube.com/watch?v=H_hT61-E5kg?t=500s
    
    https://www.youtube.com/watch?v=IRaXGyzL4oU
    15/01/2023, 08:32 - Adamo: https://www.youtube.com/watch?v=mDW7q5ScgiA song 9/10, graphics 6/10
    https://www.youtube.com/watch?v=3rp_eO1verM song 7.5/10 graphics 9/10
    .
    `
    const res = newPostsFound(inputText).length
    const expected = 20;
    expect(res).toEqual(expected);
  });

  /*
  one message, one youtube post
  one message, one youtube post + whitespace + some text on same line
  one message, one youtube post + no whitespace + some text on same line
  one message, one youtube post + an empty line + some text on third line
  
  one message, one spotify post
  one message, one spotify post + whitespace + some text on same line
  one message, one spotify post + no whitespace + some text on same line
  one message, one spotify post + an empty line + some text on third line
  
  one message, two youtube posts on same line, no space between them
  one message, two youtube posts on same line, a space between them
  one message, two youtube posts on same line, multiple spaces between them
  one message, two youtube posts on two seperate lines
  one message, two youtube posts on two seperate lines seperated by an EMPTY line
  
  
  one message, two spotify posts on same line, no space between them
  one message, two spotify posts on same line, a space between them
  one message, two spotify posts on same line, multiple spaces between them
  one message, two spotify posts on two seperate lines
  one message, two spotify posts on two seperate lines seperated by an EMPTY line
  
  one message, one youtube post, one spotify post
  one message, one youtube post, two spotify posts
  one message, one spotify post, two youtube posts
  
  two messages - 1 contains a youtube post, 2 contains a youtube post
  two messages - 1 contains a spotify post, 2 contains a spotify post
  two messages - 1 contains a youtube post, 2 contains a spotify post
  
  two messages - 1 contains a youtube post and some text no space, 2 contains a youtube post
  
  */

  it('', () => {
    inputText = ``;
    const res = newPostsFound(inputText).length
    const expected = 20;
    expect(res).toEqual(expected);
  });


});
