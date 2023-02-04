import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'
import * as h from './helpers';
import './styles/ByYearSection.css';

function ByYearSection({ byYear, lookupInState, colourMap }) {
  console.log(byYear, ' < byYear')

  const highestMonthlyPosts = h.determineMostPostsInAMonth(byYear);
  console.log(`highestMonthlyPosts: ${highestMonthlyPosts}`);
  const divisor = 100 / highestMonthlyPosts;
  console.log(`divisor: ${divisor}`);

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
          <div className="GraphArea Flex">
            <div className="MonthBarsContainer Flex Row">
              {Array(12).fill(0).map((e, i) => {
                const { monthlyTotalOverall, totalsByPoster } = h.calcTotalForMonth(i, byYear, slide);
                return (
                  <div className="MonthBarContainer Flex">
                    {totalsByPoster ?
                      <div className="MonthBar Flex Column">
                        {totalsByPoster.map(e => {
                          const posterColour = h.pickPosterColour(e.poster, lookupInState, colourMap);
                          return (
                            <div className="MonthSubBar" style={{ height: `calc(${e.monthlyTotal} * ${divisor}%)`, backgroundColor: `#${posterColour}` }} />
                          )
                        })}
                      </div>
                      : null}
                  </div>
                )
              })}
            </div >

          </div >
          <div className="GraphFooter Flex">
            <div className="MonthLabelsContainer Flex Row">
              {'JFMAMJJASOND'.split('').map(month => (
                <div className="MonthLabel">{month}</div>
              ))}
            </div >
          </div >
        </div >
        <div className="ListHalf Flex Row">
          {byYear.map((year, i) => (
            <div className={`YearSlide Flex ${slide === i + 1 ? 'SlideVisible' : 'SlideHidden'}`}>
              <div className="ListContainer">
                {year.posters.map((posterObj, i) => {

                  const { poster } = posterObj;
                  const posterColour = h.pickPosterColour(poster, lookupInState, colourMap);
                  return (
                    <div className="PosterCard">

                      <div className="ColourBoxColumn Flex">
                        <div className="ColourBox" style={{ backgroundColor: `#${posterColour}` }} >
                        </div>
                      </div>

                      <div className="InfoColumn Flex Row">
                        <div className="ContributorGroupIcon Flex">
                          <FontAwesomeIcon icon={faUserGroup} />
                        </div>
                        <div className="PosterName">
                          <span>{h.curtailString(h.equalSpacedPosters(year.posters, poster), 12)}</span>
                        </div>
                        <div className="PosterHyphen">
                          <span>-</span>
                        </div>
                        <div className="PosterTotal">
                          {posterObj.total}
                        </div>
                        <div className="PosterTrophy">
                          {i === 0 ? <span><i class="fas fa-trophy"></i></span> : null}
                        </div>
                      </div>

                    </div>
                  )
                })}
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


