import React, { useState, useEffect } from 'react';
import { PieChart, pieChartDefaultProps } from 'react-minimal-pie-chart';
import * as h from './helpers';
import './styles/ByGenreSection.css';

function ByGenreSection({ genresTallied }) {
  console.log(genresTallied);
  const shiftSize = 5;
  return (
    <div className="ByGenreSection Flex">
      <PieChart
        radius={pieChartDefaultProps.radius - shiftSize}
        segmentsShift={(index) => (1)}

        animate={true}
        animationDuration={1000}
        // lineWidth={40}
        paddingAngle={0}
        // segmentsStyle={{ margin: '15px' }}
        data={[
          { title: 'One', value: 10, color: 'lightyellow' },
          { title: 'Two', value: 15, color: 'lightblue' },
          { title: 'Three', value: 20, color: 'pink' },
        ]}
        label={({ dataEntry }) => dataEntry.value}
        labelPosition={50}
      />;
    </div>
  )
};

export default ByGenreSection;


