import React from 'react';
import PropTypes from 'prop-types';

const Cost = (props) => {
  const {
    price,
    selectedNights,
    service_fee,
    cleaning_fee,
    tax,
    totalCost,
  } = props;
  return (
    <div className="rates">
      <div className="roomRate">
        <div className="costTitle">
$
          {price}
          {' '}
x
          {' '}
          {selectedNights}
          {selectedNights === 1 ? ' night' : ' nights'}
        </div>
        <div className="cost">{`$ ${price * selectedNights}`}</div>
      </div>
      <div className="dividingSection1" />
      <div className="serviceRate">
        <div className="costTitle">Service fee</div>
        <div className="cost">
$
          {service_fee * selectedNights}
        </div>
      </div>
      <div className="dividingSection1" />
      <div className="cleaningRate">
        <div className="costTitle">Cleaning fee</div>
        <div className="cost">
$
          {cleaning_fee * selectedNights}
        </div>
      </div>
      <div className="dividingSection1" />
      <div className="taxRate">
        <div className="costTitle">Ocupancy taxes</div>
        <div className="cost">
$
          {(tax * selectedNights).toFixed(1)}
        </div>
      </div>
      <div className="dividingSection1" />
      <div className="totalRate">
        <div className="costTitle"> Total</div>
        <div className="cost">{`$${(totalCost).toFixed(1)}`}</div>
      </div>
    </div>
  );
};

Cost.propTypes = {
  price: PropTypes.number.isRequired,
  cleaning_fee: PropTypes.number.isRequired,
  service_fee: PropTypes.number.isRequired,
  tax: PropTypes.number.isRequired,
  totalCost: PropTypes.number.isRequired,
  selectedNights: PropTypes.string.isRequired,
};

export default Cost;
