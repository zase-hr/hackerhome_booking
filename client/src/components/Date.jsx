import React from 'react';
import PropTypes from 'prop-types';
import Calendar from './Calendar.jsx';

class Date extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarExpanded: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckinOnclick = this.handleCheckinOnclick.bind(this);
    this.handleCheckoutOnclick = this.handleCheckoutOnclick.bind(this);
    this.closeCalendar = this.closeCalendar.bind(this);
  }

  handleChange(e) {
    return e;
  }

  // handle check-in and out

  handleCheckinOnclick() {
    const { handleCheckinClicked } = this.props;
    this.setState({
      calendarExpanded: true,
    }, handleCheckinClicked());
  }

  handleCheckoutOnclick() {
    const { handleCheckoutClicked } = this.props;
    this.setState({
      calendarExpanded: true,
    }, handleCheckoutClicked());
  }

  closeCalendar() {
    this.setState({
      calendarExpanded: false,
    });
  }

  render() {
    const {
      checkIn,
      checkOut,
      onDayClick,
      bookedDates,
      checkInClicked,
      checkOutClicked,
      calendarInitialize,
      minNight,
      maxNight,
    } = this.props;

    const {
      calendarExpanded,
    } = this.state;

    return (
      <div className="dates">
        <div className="dateSection">Dates</div>
        <div className="inputs">
          <input className="check-in" type="text" value={checkIn === '' ? 'Check-in' : checkIn} onChange={this.handleChange} onClick={this.handleCheckinOnclick} />
          <div className="arrow">→</div>
          <input className="check-out" type="text" value={checkOut === '' ? 'Checkout' : checkOut} onChange={this.handleChange} onClick={this.handleCheckoutOnclick} />
        </div>
        <div className="datePicker">
          {calendarExpanded
            ? (
              <Calendar
                handleCheckinOnclick={this.handleCheckinOnclick}
                handleCheckoutOnclick={this.handleCheckoutOnclick}
                onDayClick={onDayClick}
                bookedDates={bookedDates}
                checkIn={checkIn}
                checkOut={checkOut}
                checkInClicked={checkInClicked}
                checkOutClicked={checkOutClicked}
                closeCalendar={this.closeCalendar}
                calendarInitialize={calendarInitialize}
                minNight={minNight}
                maxNight={maxNight}
              />
            ) : null}
        </div>
      </div>
    );
  }
}

Date.propTypes = {
  checkIn: PropTypes.string.isRequired,
  checkOut: PropTypes.string.isRequired,
  handleCheckinClicked: PropTypes.func.isRequired,
  handleCheckoutClicked: PropTypes.func.isRequired,
  onDayClick: PropTypes.func.isRequired,
  calendarInitialize: PropTypes.func.isRequired,
  checkInClicked: PropTypes.bool.isRequired,
  checkOutClicked: PropTypes.bool.isRequired,
  bookedDates: PropTypes.array.isRequired,
  minNight: PropTypes.number.isRequired,
  maxNight: PropTypes.number.isRequired,
};

export default Date;
