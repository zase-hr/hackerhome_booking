import React from 'react';
import ReactDOM from 'react-dom';

const Info = props => (
  <div className="roomInfo">
    <div className="price">${props.price}</div><div>per Night</div>
    <div className="ratings">ratings: {props.ratings}</div>
    <div className="reviews">{props.reviews}</div>
  </div>
);

export default Info;
