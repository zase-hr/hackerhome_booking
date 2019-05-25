import React from 'react';
import PropTypes from 'prop-types';

const Cost = (props) => {
  const {
    price,
    selectedNights,
    serviceFee,
    cleaningFee,
    tax,
    totalCost,
  } = props;
  const roomPrice = parseFloat(price);

  return (
    <div className="rates">
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td>
              {`$ ${roomPrice} x ${selectedNights}`}
              {(selectedNights === 1) ? ' night' : ' nights'}
            </td>
            <td className="prices">{`$ ${roomPrice * selectedNights}`}</td>
          </tr>
        </tbody>
      </table>
      <div className="dividingSection1" />
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td>Cleaning fee</td>
            <td className="prices">{`$ ${serviceFee * selectedNights}`}</td>
          </tr>
        </tbody>
      </table>
      <div className="dividingSection1" />
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td>Service fee</td>
            <td className="prices">{`$ ${cleaningFee * selectedNights}`}</td>
          </tr>
        </tbody>
      </table>
      <div className="dividingSection1" />
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td>Taxes</td>
            <td className="prices">{`$ ${(tax * selectedNights).toFixed(1)}`}</td>
          </tr>
        </tbody>
      </table>
      <div className="dividingSection1" />
      <table style={{ width: '100%' }}>
        <tbody>
          <tr />
          <tr>
            <td style={{ fontWeight: '600', fontSize: '15px' }}>Total</td>
            <td className="prices" style={{ fontWeight: '600' }}>{`$ ${totalCost}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Cost.propTypes = {
  price: PropTypes.number.isRequired,
  cleaningFee: PropTypes.number.isRequired,
  serviceFee: PropTypes.number.isRequired,
  tax: PropTypes.number.isRequired,
  totalCost: PropTypes.number.isRequired,
  selectedNights: PropTypes.string.isRequired,
};

export default Cost;
