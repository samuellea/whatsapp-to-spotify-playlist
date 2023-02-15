import React, { useState, useEffect, createRef, useRef } from 'react';
import * as h from './helpers';
import './styles/ByYearList.css';

function ByYearList({ yearObj, mostPosters, lookupInState, colourMap }) {

  return (
    <div className="ByYearList Flex Row" style={{ height: `${mostPosters * 32}px` }}>
      <div className="ByYearColourAndNameColumn Flex Column">
        {yearObj.posters.map(posterObj => {
          const { poster } = posterObj;
          const posterColour = h.pickPosterColour(poster, lookupInState, colourMap);
          return (
            <div className="ByYearColourAndName Flex Row">
              <div className="ByYearColourBox" style={{ backgroundColor: `#${posterColour}` }} />
              <div className="ByYearName">{poster}</div>
            </div>
          )
        })}
      </div>

      <div className="ByYearHyphenTotalStarColumn Flex Column">
        {yearObj.posters.map((posterObj, i) => (
          <div className="ByYearTotalAndStarContainer Flex Row">
            <div className="ByYearHyphenContainer Flex Column">
              <div className="ByYearHyphen" />
            </div>

            <div className="ByYearPosterTotal Flex Column">
              {posterObj.total}
            </div>
            {i === 0 ?
              <div className="ByYearPosterStar Flex">
                <span><i class="fas fa-star"></i></span>
              </div>
              : null}
          </div>

        ))}

      </div>

    </div>
  )
};

export default ByYearList;



/*

        </div >
      </div >

      <div className="ListHalf Flex Row" style={{ height: `${(mostPosters * 32) + 15}px` }}>

        {byYear.map((year, i) => (
          <div className={`YearSlide Flex Column ${slide === i + 1 ? 'SlideVisible' : 'SlideHidden'}`} style={{ height: `${(mostPosters * 32)}px` }}>
            {year.posters.map((posterObj, i) => {

              const { poster } = posterObj;
              console.log(poster, ' /////////')
              const posterColour = h.pickPosterColour(poster, lookupInState, colourMap);
              return (
                <div className="ByYearPosterCard Flex Row">

                  <div className="ColourBoxColumn Flex">
                    <div className="ColourBox" style={{ backgroundColor: `#${posterColour}` }} />
                  </div>

                  <div className="ByYearGroupIcon Flex">
                    {!h.isContributorAGroup(lookupInState, poster) ?
                      null : <FontAwesomeIcon icon={faUserGroup} />}
                  </div>

                  <div className="ByYearPosterName" ref={myRefs[i]} key={`${year}-${poster}`}>
                    <span>{poster}</span>
                  </div>

                  <div className="ByYearPosterTotal">
                    {posterObj.total}
                  </div>

                  <div className="ByYearPosterTrophy Flex">
                    {i === 0 ? <span><i class="fas fa-star"></i></span> : null}
                  </div>


                </div >
              )
            })}

*/