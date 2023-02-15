import React, { useState, useEffect, createRef, useRef } from 'react';
import ByYearList from './ByYearList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserGroup, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import * as h from './helpers';
import './styles/ByYearSection.css';

function ByYearSection({ byYear, lookupInState, colourMap }) {
  console.log('*****************')
  console.log(byYear);
  console.log('*****************')

  const highestMonthlyPosts = h.determineMostPostsInAMonth(byYear);
  const divisor = 100 / highestMonthlyPosts;
  const mostPosters = byYear.reduce((acc, e) => {
    if (e.posters.length > acc) acc = e.posters.length;
    return acc;
  }, 0);
  console.log(`mostPosters: ${mostPosters}`)

  const [slide, setSlide] = useState(1);

  const handleLeft = () => {
    if (slide !== 1) setSlide(slide - 1);
  };

  const handleRight = () => {
    if (slide !== byYear.length) setSlide(slide + 1);
  };

  return (
    <div className="ByYearSection Flex Column">
      <h4 className="SectionHeader">Yearly contributions</h4>

      <div className="YearAndButtonsContainer Flex Row">
        <span>{byYear[slide - 1].year}</span>
        <div className="YearAndButtonsSpacer" />
        <div className="LeftNavContainer Flex TranspButton">
          <button type="button" onClick={handleLeft} disabled={slide === 1} className={`${slide !== 1 ? 'ShowButton' : 'HideButton'}`}>
            <FontAwesomeIcon icon={faChevronLeft} pointerEvents="none" />
          </button>
        </div>
        <div className="RightNavContainer Flex TranspButton">
          <button type="button" onClick={handleRight} className={`${slide !== byYear.length ? 'ShowButton' : 'HideButton'}`}>
            <FontAwesomeIcon icon={faChevronRight} pointerEvents="none" />
          </button>
        </div>
      </div>


      {/* <div className="DisplayArea"> */}

      <div className="GraphHalf" key={`graph-slide-${slide}`}>
        <div className="GraphArea Flex">
          <div className="MonthBarsContainer Flex Row">
            {Array(12).fill(0).map((e, i) => {
              // totalsByPoster has been processed to return poster keys transformed to
              // account for aliases / groupings.
              const { monthlyTotalOverall, totalsByPoster } = h.calcTotalForMonth(i, byYear, slide);

              if (totalsByPoster !== null) {
                console.log('[TOTALS BY POSTER]');
                console.log(totalsByPoster)
                console.log('[TOTALS BY POSTER]');
              }
              return (
                <div className="MonthBarContainer Flex Column">
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

      <div className="ListHalf Flex">
        <ByYearList
          yearObj={byYear[slide - 1]}
          mostPosters={mostPosters}
          lookupInState={lookupInState}
          colourMap={colourMap}
        />
      </div >

    </div >
  )
};

export default ByYearSection;