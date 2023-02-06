import React, { useState, useEffect } from 'react';
import { PieChart, pieChartDefaultProps } from 'react-minimal-pie-chart';
import _ from 'lodash';
import * as h from './helpers';
import './styles/ByGenreSection.css';

function ByGenreSection({ genresTallied }) {
  // console.log(genresTallied)
  const [year, setYear] = useState('allYears');
  const [poster, setPoster] = useState('allPosters'); // 'Sam'
  const [pieData, setPieData] = useState(null);
  // console.log(genresTallied);

  // useEffect(() => {
  //   const res = genresTallied[poster][year]
  //   console.log(res);
  // }, [year, poster]);

  useEffect(() => {
    // console.log(genresTallied[poster][year])
    setPieData(h.formatForPie(genresTallied[poster][year]).slice(0, 10));
    // setPieData(null)
  }, [year, poster]);


  const yearsList = Object.keys(genresTallied.allPosters).filter(e => e !== 'allYears');
  const postersList = Object.keys(genresTallied).filter(e => e !== 'allPosters');

  const handleClick = (e) => {
    console.log(e.target.value)
    const { id } = e.target;
    const { value } = e.target;
    if (id === 'year') setYear(value);
    if (id === 'poster') setPoster(value);
  };

  const shiftSize = 5;

  const yearsB = () => `1px solid ${year === 'allYears' ? 'white' : '#424242'}`;
  const postersB = () => `1px solid ${poster === 'allPosters' ? 'white' : '#424242'}`;
  const yearB = (v) => `1px solid ${v === year ? 'white' : '#424242'}`;
  const posterB = (v) => `1px solid ${v === poster ? 'white' : '#424242'}`;

  return (
    <div className="ByGenreSection Flex Column">

      <div className="ByGenreButtonsContainer">
        <div className="YearsButtonsContainer Flex Row">
          <button
            type="button"
            value="allYears"
            id="year"
            onClick={handleClick}
            style={{ border: yearsB() }}
          >All Years</button>
          {yearsList.map(year => (
            <button
              type="button"
              value={year}
              id="year"
              onClick={handleClick}
              style={{ border: yearB(year) }}
            >{year}</button>
          ))}
        </div>
        <div className="PostersButtonsContainer Flex Row">
          <button
            type="button"
            value="allPosters"
            id="poster"
            onClick={handleClick}
            style={{ border: postersB() }}
          >All Posters</button>
          {postersList.map(poster => (
            <button
              type="button"
              value={poster}
              id="poster"
              onClick={handleClick}
              style={{ border: posterB(poster) }}
            >{poster}</button>
          ))
          }
        </div >
      </div >
      <div className="ByGenrePieChartContainer Flex">
        {pieData ?
          <PieChart
            animate={true}
            animationDuration={1000}
            data={pieData}
            key={`${year}-${poster}`}
            labelPosition={50}
            lengthAngle={-360}
            lineWidth={40}
            padding={30}
            radius={pieChartDefaultProps.radius - shiftSize}
            segmentsShift={(index) => (4)}
            startAngle={0}
            style={{ display: 'flex', width: '55%', padding: '0px' }}
            viewBoxSize={[101, 101]}
          // label={({ dataEntry }) => dataEntry.value}
          // rounded
          // segmentsStyle={{ margin: '15px' }}
          />
          : null}
      </div>
      <div className="ByGenreRankingContainer">
        {genresTallied[poster][year].slice(0, 10).map((genreObj, i) => (
          <div className="GenreCard Flex Row">
            <div className="GenreColourBox" style={{ backgroundColor: h.stringToColour(genreObj.genre) }} />
            <div className="Ranking" style={{ color: h.stringToColour(genreObj.genre) }}>{i + 1}.</div>
            <div className="GenreName">{genreObj.genre}</div>
            <div className="GenreCount" style={{ color: 'darkgray' }}>{genreObj.count}</div>
          </div>
        ))}

      </div>





    </div >
  )
};

export default ByGenreSection;


