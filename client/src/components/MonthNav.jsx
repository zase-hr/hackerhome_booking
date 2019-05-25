import React from 'react';
import PropTypes from 'prop-types';

const MonthNav = ({ month }) => (
  <span className="label-month">
    {month()}
  </span>
);

MonthNav.propTypes = { month: PropTypes.func.isRequired };

export default MonthNav;
