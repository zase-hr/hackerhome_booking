import React from 'react';
import ReactDOM from 'react-dom';
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
    this.setState({
      calendarExpanded: true,
    }, this.props.handleCheckinClicked());
  }

  handleCheckoutOnclick() {
    this.setState({
      calendarExpanded: true,
    }, this.props.handleCheckoutClicked());
  }

  closeCalendar() {
    this.setState({
      calendarExpanded: false,
    });
  }

  render() {
    return (
      <div className="dates">
        <div className="dateSection">Dates</div>
        <div className="inputs">
          <input className="check-in" type="text" value={this.props.check_in === 0 ? 'Check-in' : this.props.check_in} onChange={this.handleChange} onClick={this.handleCheckinOnclick} />
          <div className="arrow">→</div>
          <input className="check-out" type="text" value={this.props.check_out === 0 ? 'Checkout' : this.props.check_out} onChange={this.handleChange} onClick={this.handleCheckoutOnclick} />
        </div>
        <div className="datePicker">
          {this.state.calendarExpanded
            ? (
              <Calendar
                  handleCheckinOnclick={this.handleCheckinOnclick}
                  handleCheckoutOnclick={this.handleCheckoutOnclick}
                  onDayClick={this.props.onDayClick}
                  bookedDates={this.props.bookedDates}
                  check_in={this.props.check_in}
                  check_out={this.props.check_out}
                  check_in_clicked={this.props.check_in_clicked}
                  check_out_clicked={this.props.check_out_clicked}
                  closeCalendar={this.closeCalendar}
                  calendarInitialize={this.props.calendarInitialize}
                 />
            ) : null}
        </div>
      </div>
    );
  }
}

// for propTypes validation
// Date.propTypes = {
// };

export default Date;
