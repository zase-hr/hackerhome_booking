import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import MonthNav from './MonthNav.jsx';
import ClickOutsideOfCalendar from './ClickOutsideOfCalendar.jsx';

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.style = {};
    this.state = {
      dateContext: moment(),
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

  render() {
    const {
      bookedDates,
      checkIn,
      checkOut,
      handleCheckoutOnclick,
      closeCalendar,
      onDayClick,
      calendarInitialize,
      minNight,
      maxNight,
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

    const formattedBookedDates = bookedDates.map(date => date.format('MM/DD/YYYY'));
    const daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d += 1) {
      daysInMonth.push(
        <td
          key={d}
          className="days"
          style={
            (moment(dateContext).set('date', d) === moment(checkIn, 'MM/DD/YYYY')
              || moment(dateContext).set('date', d) === moment(checkOut, 'MM/DD/YYYY')
              ? {
                border: '1px double rgb(0, 166, 153)',
                color: 'rgb(255, 255, 255) !important',
                background: 'rgb(0, 166, 153) !important',
              }
              : null)
              || (
                checkIn !== ''
              && (moment(dateContext).set('date', d) > moment(checkIn, 'MM/DD/YYYY')
                && moment(dateContext).set('date', d) < moment(checkOut, 'MM/DD/YYYY'))
                  ? {
                    border: '1px double rgb(128, 232, 224)',
                    color: 'rgb(1, 122, 135)',
                    background: 'rgb (178, 241, 236)',
                  }
                  : null
              )
            }
        >
          <span
            className="day"
            role="button"
            disabled={
              (checkIn !== '' && checkOut !== '')
                ? moment(dateContext).set('date', d) < moment()
              || formattedBookedDates.includes(moment(dateContext).set('date', d).format('MM/DD/YYYY'))
                : moment(dateContext).set('date', d) < moment()
                || formattedBookedDates.includes(moment(dateContext).set('date', d).format('MM/DD/YYYY'))
              || moment(dateContext).set('date', d) < moment(checkIn, 'MM/DD/YYYY')
              || moment(dateContext).set('date', d) > moment(checkOut, 'MM/DD/YYYY')
              || moment(dateContext).set('date', d) < moment(checkIn, 'MM/DD/YYYY').add(minNight, 'd')
              || moment(dateContext).set('date', d) > moment(checkIn, 'MM/DD/YYYY').add(maxNight, 'd')
            }
            onClick={(e) => {
              let dateContext1 = Object.assign({}, dateContext);
              dateContext1 = moment(dateContext1).set('date', d);
              onDayClick(e, dateContext1, handleCheckoutOnclick, closeCalendar);
              this.setState({
                dateContext: dateContext1,
              });
            }}
            onKeyPress={(e) => {
              let dateContext1 = Object.assign({}, dateContext);
              dateContext1 = moment(dateContext1).set('date', d);
              onDayClick(e, dateContext1, handleCheckoutOnclick, closeCalendar);
              this.setState({
                dateContext: dateContext1,
              });
            }}
          >
            {d}
          </span>
        </td>,
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
