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


  // create multiple refs to be used on multiple elements
  // creatRef useRef

  // let myRefs = useRef([])
  // myRefs = byYear[slide - 1].posters.map(e => React.createRef())
  // useEffect(() => {
  //   const refWidths = myRefs.map(e => e.current.clientWidth);
  // }, [slide])

  // ...map(e => (
  // <div className="blah" ref={myRefs[i]}
  // ))

  useEffect(() => {
    // console.log(genresTallied[poster][year])
    setPieData(h.formatForPie(genresTallied[poster][year]).slice(0, 10));
    // setPieData(null)
  }, [year, poster]);


  const yearsList = Object.keys(genresTallied.allPosters).filter(e => e !== 'allYears');
  const postersList = Object.keys(genresTallied).filter(e => e !== 'allPosters');

  const handleClick = (e) => {
    console.log('---------')
    console.log(genresTallied)
    const { id } = e.target;
    const { value } = e.target;
    if (id === 'year') setYear(value);
    if (id === 'poster') setPoster(value);
    console.log(genresTallied[poster][year])
    // console.log(`year: ${year}`);
    // console.log(`poster: ${poster}`);
  };

  const shiftSize = 5;

  const yearsB = () => ({
    color: year === 'allYears' ? '#292B3E' : 'white',
    backgroundColor: year === 'allYears' ? '#00FFFF' : '#7316C6',
  });

  const postersB = () => ({
    color: poster === 'allPosters' ? '#292B3E' : 'white',
    backgroundColor: poster === 'allPosters' ? '#00FFFF' : '#7316C6',
  });

  const yearB = (v) => ({
    color: v === year ? '#292B3E' : 'white',
    backgroundColor: v === year ? '#00FFFF' : '#7316C6',
  });

  const posterB = (v) => ({
    color: v === poster ? '#292B3E' : 'white',
    backgroundColor: v === poster ? '#00FFFF' : '#7316C6',
  });

  return (
    <div className="ByGenreSectionContainer Flex Column">

      <h4 className="SectionHeader">Top genres</h4>

      <div className="ByGenreSection Flex Column">

        <div className="ByGenreButtonsContainer">
          <div className="YearsButtonsContainer Flex Row">
            <button
              type="button"
              value="allYears"
              id="year"
              onClick={handleClick}
              style={yearsB()}
            >All Years</button>
            {yearsList.map(year => (
              <button
                type="button"
                value={year}
                id="year"
                onClick={handleClick}
                style={yearB(year)}
              >{year}</button>
            ))}
          </div>
          <div className="PostersButtonsContainer Flex Row">
            <button
              type="button"
              value="allPosters"
              id="poster"
              onClick={handleClick}
              style={postersB()}
            >All Posters</button>
            {postersList.map(poster => (
              <button
                type="button"
                value={poster}
                id="poster"
                onClick={handleClick}
                style={posterB(poster)}
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
              // padding={0}
              radius={pieChartDefaultProps.radius - shiftSize}
              segmentsShift={(index) => 1}
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
          {genresTallied[poster][year]?.slice(0, 10)?.map((genreObj, i) => (
            <div className="GenreCard Flex Row">
              <div className="GenreColourBox" style={{ backgroundColor: h.stringToColour(genreObj.genre) }} />
              <div className="Ranking" style={{ color: h.stringToColour(genreObj.genre) }}>{i + 1}.</div>
              <div className="GenreName">{genreObj.genre}
                <span className="GenreCount">{genreObj.count}</span>
              </div>
            </div>
          )) || <div className="NoDataMessage Flex">No Data</div>}

        </div>



      </div >


    </div >
  )
};

export default ByGenreSection;


