import React, { useState, useEffect } from 'react';
import fontColorContrast from 'font-color-contrast'
import './styles/PosterRibbon.css';

function PosterRibbon({ text, posterColour }) {
  return (
    <div id="posterRibbon">
      <div
        id="posterRibbonLong"
      // style={{ backgroundColor: `#${posterColour}`, borderRight: `2px solid #${posterColour}` }}
      >
      </div>
      <span
        id="ribbonLabel"
        // style={{ color: fontColorContrast(posterColour, 0.8) }}
        style={{ color: `#${posterColour}` }}
      // style={{ color: 'white' }}
      >{text}</span>
      <div id="posterRibbonTriangles">
        <div id="ribbonTri1Cont">
          <div
            id="ribbonTri1"
          // style={{ borderColor: `#${posterColour} transparent transparent transparent` }} 
          />
        </div>
        <div id="ribbonTri2Cont">
          <div
            id="ribbonTri2"
          // style={{ borderColor: `transparent transparent transparent #${posterColour}` }} 
          />
        </div>
      </div>
    </div>
  )
};

export default PosterRibbon;


