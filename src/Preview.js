import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./styles/Preview.css";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";

const Preview = ({ index, url, setIndexPlaying, indexPlaying, playingThis, playingOthers, post }) => {
  const [playing, setPlaying] = useState(false);
  const myRef = useRef();

  useEffect(() => {
    // console.log(`index: ${index}`);
    // console.log(`indexPlaying: ${indexPlaying}`);
    // console.log('-----')
    if (indexPlaying === index) {
      console.log(post, ' 🌱🌱🌱')
      // console.log(`🌱 I am ${index}. indexPlaying is ${indexPlaying}.`)
      myRef.current.play()
    };
    if (indexPlaying !== index) {
      // console.log(`🛑 Stopping ${index}!`)
      myRef.current.pause()
    };
    if (!indexPlaying) {
      // console.log('--- nothing playing now. ----')
      // myRef.current.pause();
    }
  }, [indexPlaying])

  const handleClickPause = () => {
    if (indexPlaying === index) {
      setIndexPlaying(null)
    }

  };

  const handleClickPlay = () => {
    if (indexPlaying !== index) {
      setIndexPlaying(index)
    } else if (indexPlaying === index) {
      setIndexPlaying(null)
    }
  };


  return (
    <div className="Preview">
      <audio
        ref={myRef}
        src={url}
      />
      {indexPlaying === index ? (
        <button onClick={handleClickPause}>
          <FontAwesomeIcon icon={faPause} pointerEvents="none" />

        </button>
      ) : (
        <button onClick={handleClickPlay} style={{ paddingLeft: '10px' }}>
          <FontAwesomeIcon icon={faPlay} pointerEvents="none" />
        </button>
      )}
    </div>
  );
};

export default Preview;