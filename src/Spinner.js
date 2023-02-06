import React from 'react';
import './styles/Spinner.css';

const Spinner = ({ size }) => {
  return (
    <div className="SpinnerContainer">
      <div className={`loader ${size}`}> Loading...</div >
    </div>
  )
};

export default Spinner;