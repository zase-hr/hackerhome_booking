import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import MonthNav from './MonthNav.jsx';
import ClickOutsideOfCalendar from './ClickOutsideOfCalendar.jsx';
import CalendarDayItem from './CalendarDayItem.jsx';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.style = {};

    this.state = {
      dateContext: props.checkIn === '' ? moment() : moment(props.checkIn),
      candidateCheckOut: null,
    };
    this.weekdays = moment.weekdays();
    this.weekdaysShort = moment.weekdaysShort();
    this.months = moment.months();
    this.month = this.month.bind(this);
    this.setMonth = this.setMonth.bind(this);
    this.onMonthChange = this.onMonthChange.bind(this);
    this.year = this.year.bind(this);
    this.setYear = this.setYear.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
    this.clickDate = this.clickDate.bind(this);
    this.updateCandidateCheckOut = this.updateCandidateCheckOut.bind(this);
  }

  onMonthChange(data) {
    const { onChangeMonth } = this.props;
    this.setMonth(data);
    onChangeMonth && onChangeMonth();
  }

  setMonth(month) {
    const { dateContext } = this.state;
    const monthNo = this.months.indexOf(month);
    let dateContext1 = Object.assign({}, dateContext);
    dateContext1 = moment(dateContext1).set('month', monthNo);
    this.setState({
      dateContext: dateContext1,
    });
  }

  setYear(year) {
    const { dateContext } = this.state;
    let dateContext1 = Object.assign({}, dateContext);
    dateContext1 = moment(dateContext1).set('year', year);
    this.setState({
      dateContext: dateContext1,
    });
  }

  currentDate() {
    const { dateContext } = this.state;
    return dateContext.get('date');
  }

  year() {
    const { dateContext } = this.state;
    return dateContext.format('Y');
  }

  month() {
    const { dateContext } = this.state;
    return dateContext.format('MMMM');
  }

  daysInMonth() {
    const { dateContext } = this.state;
    return dateContext.daysInMonth();
  }

  currentDay() {
    const { dateContext } = this.state;
    return dateContext.format('D');
  }

  firstDayOfMonth() {
    const { dateContext } = this.state;
    return moment(dateContext).startOf('month').format('d');
  }

  nextMonth() {
    const { dateContext } = this.state;
    let dateContext1 = Object.assign({}, dateContext);
    dateContext1 = moment(dateContext1).add(1, 'month');
    this.setState({
      dateContext: dateContext1,
    });
    const { onNextMonth } = this.props;
    onNextMonth && onNextMonth();
  }

  prevMonth() {
    const { dateContext } = this.state;
    let dateContext1 = Object.assign({}, dateContext);
    dateContext1 = moment(dateContext1).subtract(1, 'month');
    this.setState({
      dateContext: dateContext1,
    });

    const { onPrevMonth } = this.props;
    onPrevMonth && onPrevMonth();
  }

  calculateMinMaxNight() {
    moment(checkIn, 'MM/DD/YYYY');
  }

  clickDate(e, day) {
    let dateContext1 = Object.assign({}, this.state.dateContext);
    dateContext1 = moment(dateContext1).set('date', day);
    this.props.onDayClick(e, dateContext1, this.props.handleCheckoutOnclick, this.props.closeCalendar);
    this.setState({
      dateContext: dateContext1,
    });
  }

  updateCandidateCheckOut(formattedCandidateCheckOut) {
    this.setState({
      candidateCheckOut: formattedCandidateCheckOut,
    });
  }

  isDayDisabled(day) {
    const { dateContext } = this.state;
    const {
      checkIn, checkOut, bookedDates, maxNight, minNight,
    } = this.props;
    if (checkIn === '' || checkOut !== '') {
      return dateContext.set('date', day) < moment() || bookedDates.map(date => date.format('MM/DD/YYYY')).includes(dateContext.set('date', day).format('MM/DD/YYYY'));
    }
    if (checkIn !== '') {
      const closestFutureBookedDate = this.findClosestFutureBookingCheckIn();
      return dateContext.set('date', day) < moment(checkIn, 'MM/DD/YYYY').startOf('date')
        || (dateContext.set('date', day).startOf('date') > moment(checkIn, 'MM/DD/YYYY').startOf('date') && dateContext.set('date', day) <= moment(checkIn, 'MM/DD/YYYY').startOf('date').add(minNight, 'd'))
        || (closestFutureBookedDate != null && dateContext.set('date', day) >= moment(closestFutureBookedDate, 'MM/DD/YYYY'))
        || dateContext.set('date', day) >= moment(checkIn, 'MM/DD/YYYY').startOf('date').add(maxNight, 'd');
    }
  }

  findClosestFutureBookingCheckIn() {
    const sortedBookedDates = this.props.bookedDates.map(date => date.format('MM/DD/YYYY')).sort();
    for (let i = 0; i < sortedBookedDates.length; i += 1) {
      if (moment(this.props.checkIn, 'MM/DD/YYYY') < moment(sortedBookedDates[i], 'MM/DD/YYYY')) {
        return sortedBookedDates[i];
      }
    }

    return null;
  }

  render() {
    const {
      checkIn,
      checkOut,
      closeCalendar,
      calendarInitialize,
      handleBothUnclicked,
    } = this.props;

    const {
      dateContext,
    } = this.state;

    const weekdays = this.weekdaysShort.map(day => (
      <td key={day} className="week-day">{day.slice(0, day.length - 1)}</td>
    ));
    const blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i += 1) {
      const key = i * 80;
      blanks.push(<td key={key} className="emptySlot" />);
    }

    const daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d += 1) {
      daysInMonth.push(
        <CalendarDayItem key={moment(dateContext).set('d', d)} day={d} isDayDisabled={this.isDayDisabled(d)} checkIn={checkIn} checkOut={checkOut} dateContext={dateContext} clickDate={this.clickDate} candidateCheckOut={this.state.candidateCheckOut} updateCandidateCheckOut={this.updateCandidateCheckOut} />,
      );
    }

    const totalSlots = [...blanks, ...daysInMonth];
    const rows = [];
    let cells = [];
    totalSlots.forEach((row, i) => {
      if ((i % 7) !== 0) {
        cells.push(row);
      } else {
        const insertRow = cells.slice();
        rows.push(insertRow);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        const insertRow = cells.slice();
        rows.push(insertRow);
      }
    });
    const trElems = rows.map((d, i) => {
      const key = i * 100;
      return (
        <tr key={key}>
          {d}
        </tr>
      );
    });

    return (
      <ClickOutsideOfCalendar
        closeCalendar={closeCalendar}
        handleBothUnclicked={handleBothUnclicked}
      >
        <div className="calendar-container">
          <table className="calendar">
            <thead>
              <tr className="calendar-header" />
              <tr>
                <td colSpan="1" className="nav-month">
                  <button
                    type="submit"
                    className="prev"
                    onClick={(e) => {
                      this.prevMonth();
                      e.preventDefault();
                    }}
                  >
                    ←
                  </button>
                </td>
                <td colSpan="5" className="thisMonth">
                  <MonthNav
                    month={this.month}
                    months={this.months}
                    onMonthChange={this.onMonthChange}
                  />
                  {' '}
                  {this.year()}
                </td>
                <td colSpan="2" className="nav-month">
                  <button
                    type="submit"
                    className="prev"
                    onClick={(e) => {
                      this.nextMonth();
                      e.preventDefault();
                    }}
                  >
                    →
                  </button>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                {weekdays}
              </tr>
              {trElems}
            </tbody>
          </table>
          <button
            className="clear"
            type="submit"
            onClick={(e) => {
              calendarInitialize(e);
              this.setState({
                dateContext: moment(),
              });
            }}
          >
            Clear dates
          </button>
        </div>
      </ClickOutsideOfCalendar>
    );
  }
}


Calendar.propTypes = {
  checkIn: PropTypes.string,
  checkOut: PropTypes.string,
  handleCheckoutOnclick: PropTypes.func,
  closeCalendar: PropTypes.func,
  onDayClick: PropTypes.func,
  calendarInitialize: PropTypes.func,
  bookedDates: PropTypes.arrayOf(PropTypes.object),
  minNight: PropTypes.number,
  maxNight: PropTypes.number,
  handleBothUnclicked: PropTypes.func,
};

Calendar.defaultProps = {
  checkIn: '',
  checkOut: '',
  handleCheckoutOnclick: () => { },
  closeCalendar: () => { },
  onDayClick: () => { },
  calendarInitialize: () => { },
  bookedDates: [],
  minNight: 0,
  maxNight: 0,
  handleBothUnclicked: () => { },
};
