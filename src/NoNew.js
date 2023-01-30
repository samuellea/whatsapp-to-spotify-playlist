import './styles/NoNew.css';
import React, { useState, useEffect } from 'react';

function NoNew() {
  return (
    <div className="NoNew">
      <h1>Nothing new!</h1>
      <div className="GreenCircleContainer">
        <div className="GreenCircle">
          <span><i class="fa fa-check"></i></span>
        </div>
      </div>
      <h3>Playlist already up to date</h3>
    </div>
  )
};

export default NoNew;
