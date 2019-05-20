import React from 'react';
import ReactDOM from 'react-dom';

const Info = props => (
  <div className="roomInfo">
    <div className="firstLine">
      <div className="price">${props.price}</div> <span className="per">  per night</span>
    </div>
    <div className="secondLine">
    <div className="ratings">ratings: {props.ratings}  </div> <div className="reviews">{props.reviews}</div>
    </div>
    <div className="thirdLine" ></div>
  </div>
);

export default Info;
