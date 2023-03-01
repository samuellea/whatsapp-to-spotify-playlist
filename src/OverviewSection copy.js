import React, { useState, useEffect } from 'react';
import * as h from './helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import './styles/OverviewSection.css';

function OverviewSection({ overview }) {
  // console.log(overview)
  const yearTotals = overview.map(e => e.posts.length);
  const maxPostsInAYear = Math.max(...yearTotals);
  // console.log(maxPostsInAYear, ' < maxPostsInAYear'); // = 9
  // 100 / 9 = 11.11 <-- thats how high we need each 'dot box' to be
  // console.log(100 / maxPostsInAYear, ' %')

  return (
    <div className="OverviewSection Flex">
      {overview ?
        <div className="OverviewGraphBox">
          <div className="GraphChartContainer Flex Row">
            {overview.map(yearObj => (
              <div className="ChartBarContainer Flex Row">
                {/* <div className="BarAndNumberContainer Flex Column" > */}
                <div className="BarContainer Flex Column" >
                  {/* <div className="NumberContainer">{yearObj.posts.length}</div> */}
                  {yearObj.posts.map(post => (
                    <div className="DotContainer Flex" style={{ height: `calc(${100 / maxPostsInAYear}%)` }}>
                      <FontAwesomeIcon className="Dot" icon={faCircle} style={{ fontSize: `calc(${100 / maxPostsInAYear}% + 10px)` }} />
                    </div>
                  ))}
                </div>
                {/* </div> */}
              </div>
            ))}
          </div>
          <div className="GraphFooterContainer Flex Row">
            {overview.map(yearObj => (
              <div className="FooterYearContainer">{yearObj.year}</div>
            ))}
          </div>
        </div>
        : <h2>No data to show</h2>
      }
    </div >
  )
};

export default OverviewSection;


