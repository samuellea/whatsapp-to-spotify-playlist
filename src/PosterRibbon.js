import React, { useState, useEffect } from 'react';
import './styles/PosterRibbon.css';

function PosterRibbon({ text, posterColour }) {
  return (
    <div id="posterRibbon">
      <div id="posterRibbonLong" style={{ backgroundColor: `#${posterColour}`, borderRight: `2px solid #${posterColour}` }}>
        <span style={{ color: `white` }}>{text}</span>
      </div>
      <div id="posterRibbonTriangles">
        <div id="ribbonTri1Cont">
          <div id="ribbonTri1" />
        </div>
        <div id="ribbonTri2Cont">
          <div id="ribbonTri2" />
        </div>
      </div>
    </div>
  )
};

export default PosterRibbon;


