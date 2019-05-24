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
      check_in,
      check_out,
      onDayClick,
      bookedDates,
      check_in_clicked,
      check_out_clicked,
      calendarInitialize,
    } = this.props;

    const {
      calendarExpanded,
    } = this.state;

    return (
      <div className="dates">
        <div className="dateSection">Dates</div>
        <div className="inputs">
          <input className="check-in" type="text" value={check_in === '' ? 'Check-in' : check_in} onChange={this.handleChange} onClick={this.handleCheckinOnclick} />
          <div className="arrow">→</div>
          <input className="check-out" type="text" value={check_out === '' ? 'Checkout' : check_out} onChange={this.handleChange} onClick={this.handleCheckoutOnclick} />
        </div>
        <div className="datePicker">
          {calendarExpanded
            ? (
              <Calendar
                handleCheckinOnclick={this.handleCheckinOnclick}
                handleCheckoutOnclick={this.handleCheckoutOnclick}
                onDayClick={onDayClick}
                bookedDates={bookedDates}
                check_in={check_in}
                check_out={check_out}
                check_in_clicked={check_in_clicked}
                check_out_clicked={check_out_clicked}
                closeCalendar={this.closeCalendar}
                calendarInitialize={calendarInitialize}
              />
            ) : null}
        </div>
      </div>
    );
  }
}

Date.propTypes = {
  check_in: PropTypes.string.isRequired,
  check_out: PropTypes.string.isRequired,
  handleCheckinClicked: PropTypes.func.isRequired,
  handleCheckoutClicked: PropTypes.func.isRequired,
  onDayClick: PropTypes.func.isRequired,
  calendarInitialize: PropTypes.func.isRequired,
  // bookedDates: PropTypes.array.isRequired,
};

export default Date;
