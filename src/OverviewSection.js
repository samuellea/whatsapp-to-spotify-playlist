import React, { useState, useEffect } from 'react';
import * as h from './helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import './styles/OverviewSection.css';

function OverviewSection({ overview }) {
  const myOverview = [...overview,
    // { posts: [{ id: 1 }, { id: 1 }, { id: 1 }, { id: 1 }], year: '2022' },
    // { posts: [{ id: 1 }, { id: 1 }, { id: 1 }, { id: 1 }], year: '2021' },
    // { posts: [{ id: 1 }, { id: 1 }, { id: 1 }, { id: 1 }], year: '2020' },
  ]

  const yearTotals = myOverview.map(e => e.posts.length);
  const maxPostsInAYear = Math.max(...yearTotals);
  const divisor = 100 / maxPostsInAYear;

  return (
    <div className="OverviewSection Flex Column">
      <h4 className="SectionHeader">Total by year</h4>
      {myOverview ?
        <div className="OverviewGraphBox Flex">
          <div className="GraphChartContainer Flex Row">
            {myOverview.map(yearObj => {
              const desiredHeight = divisor * yearObj.posts.length;
              return (
                <div className="ChartBarContainer Flex Row">
                  <div className="BarAndNumberContainer Flex Column" >
                    <div className="NumberContainer Flex Column">{yearObj.posts.length}</div>
                    <div className="Bar Flex Column" style={{ height: `${desiredHeight - 5}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="GraphFooterContainer Flex Row">
            {myOverview.map(yearObj => (
              <div className="FooterYearContainer Flex">{yearObj.year}</div>
            ))}
          </div>
        </div>
        : <h2>No data to show</h2>
      }
    </div >
  )
};

export default OverviewSection;


