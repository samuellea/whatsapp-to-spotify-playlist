import React, { useState, useEffect } from 'react';
import * as h from './helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import './styles/OverviewSection.css';

function OverviewSection({ overview }) {
  console.log(overview)
  const yearTotals = overview.map(e => e.posts.length);
  const maxPostsInAYear = Math.max(...yearTotals);
  const divisor = 100 / maxPostsInAYear;
  console.log(maxPostsInAYear, ' < maxPostsInAYear'); // = 9
  // 100 / 9 = 11.11 <-- thats how high we need each 'dot box' to be
  console.log(100 / maxPostsInAYear, ' %')

  return (
    <div className="OverviewSection Flex">
      {overview ?
        <div className="OverviewGraphBox">
          <div className="GraphChartContainer Flex Row">
            {overview.map(yearObj => {
              const desiredHeight = divisor * yearObj.posts.length;
              return (
                <div className="ChartBarContainer Flex Row">
                  <div className="BarAndNumberContainer Flex Column" >
                    <div className="NumberContainer Flex Column">{yearObj.posts.length}</div>
                    <div className="Bar Flex Column" style={{ height: `${desiredHeight - 15}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="GraphFooterContainer Flex Row">
            {overview.map(yearObj => (
              <div className="FooterYearContainer Flex">{`'` + yearObj.year.slice(2)}</div>
            ))}
          </div>
        </div>
        : <h2>No data to show</h2>
      }
    </div >
  )
};

export default OverviewSection;


