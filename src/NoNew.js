import './styles/NoNew.css';
import React, { useState, useEffect } from 'react';
import GreenCircleRedCross from './GreenCircleRedCross';

function NoNew() {
  return (
    <div className="NoNew">
      <h1>Nothing new!</h1>
      <div className="NoNewGreenCircleContainer">
        <GreenCircleRedCross type="GreenCircle" height={165} fadeInAnimation={true} />
      </div>
      <h3>Playlist already up to date</h3>
    </div>
  )
};

export default NoNew;
