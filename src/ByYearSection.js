import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import * as h from './helpers';
import './styles/ByYearSection.css';

function ByYearSection({ byYear }) {
  console.log(byYear)

  const [slide, setSlide] = useState(1);

  const handleLeft = () => {
    if (slide !== 1) setSlide(slide - 1);
  };

  const handleRight = () => {
    if (slide !== byYear.length) setSlide(slide + 1);
  };

  return (
    <div className="ByYearSection Flex">

      <div className="LeftNavContainer Flex TranspButton">
        <button type="button" onClick={handleLeft} disabled={slide === 1} className={`${slide !== 1 ? 'ShowButton' : 'HideButton'}`}>LEFT</button>
      </div>
      <div className="DisplayArea">
        <div className="GraphHalf">
          g
        </div >
        <div className="ListHalf Flex Row">
          {byYear.map((year, i) => (
            <div className={`YearSlide Flex ${slide === i + 1 ? 'SlideVisible' : 'SlideHidden'}`}>
              <div className="ListContainer">
                {year.posters.map((poster, i) => (
                  <div className="PosterCard Flex Row">
                    <div className="ContributorGroupIcon Flex">
                      <FontAwesomeIcon icon={faUserGroup} />
                    </div>
                    <div className="PosterName">
                      <span>{h.equalSpacedPosters(year.posters, poster.poster)}</span>
                    </div>
                    <div className="PosterHyphen">
                      <span>-</span>
                    </div>
                    <div className="PosterTotal">
                      {poster.total}
                    </div>
                    <div className="PosterTrophy">
                      {i === 0 ? <span><i class="fas fa-trophy"></i></span> : null}
                    </div>
                  </div>

                ))}




              </div>
            </div>
          ))}
        </div >
      </div >

      <div className="RightNavContainer Flex TranspButton">
        <button type="button" onClick={handleRight} className={`${slide !== byYear.length ? 'ShowButton' : 'HideButton'}`}>RIGHT</button>
      </div>

    </div >
  )
};

export default ByYearSection
  ;


