import React from 'react';
import PropTypes from 'prop-types';

const Info = (props) => {
  const { price, ratings, reviews } = props;
  const rating = parseFloat(ratings);
  const starsWidth = rating * 10;

  return (
    <div className="roomInfo">
      <div className="firstLine">
        <div className="price">
$
          {price}
        </div>
        {' '}
        <span className="per">  per night</span>
      </div>
      <div className="secondLine">
        <div className="ratings">
          <span className="outerStar">
            <span className="innerStar" style={{ width: `${starsWidth}px` }} />
          </span>
          {' '}
        </div>
        {' '}
        <div className="reviews">{reviews}</div>
      </div>
      <div className="thirdLine" />
    </div>
  );
};

Info.propTypes = {
  price: PropTypes.number.isRequired,
  ratings: PropTypes.string.isRequired,
  reviews: PropTypes.number.isRequired,
};


export default Info;
