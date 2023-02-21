import './styles/GreenCircleRedCross.css';
import React, { useState, useEffect } from 'react';

function GreenCircleRedCross({ type, height, fadeInAnimation }) {

  const toRender = {
    'GreenCircle': () => (
      <div className="GreenCircleDisc">
        <span><i class="fa fa-check" style={{ marginTop: `${height / 25}px`, fontSize: `${height / 1.65}px`, }}></i></span>
      </div>
    ),
    'RedCross': () => (
      <div className="RedCrossDisc">
        <span><i class=" fa fa-times" style={{ marginTop: `${height / 50}px`, fontSize: `${height / 1.4}px`, }}></i></span>
      </div>
    )
  };

  return (
    <div className="GreenCircleRedCross" style={{
      height: `${height}px`,
      width: `${height}px`,
      animation: fadeInAnimation ? 'noNewFadeIn 0.5s linear' : null,
    }}>
      {toRender[type]()}
    </div>
  );
};

export default GreenCircleRedCross;
