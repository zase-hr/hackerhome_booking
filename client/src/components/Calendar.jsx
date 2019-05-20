import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.width = '350px';
    this.style = {};
    this.state = {
      dateContext: moment(),
      today: moment(),
      showMonthPopup: false,
      showYearPopup: false,
    };
    this.weekdays = moment.weekdays();
    this.weekdaysShort = moment.weekdaysShort();
    this.months = moment.months();
    this.month = this.month.bind(this);
    this.SelectList = this.SelectList.bind(this);
  }

  year() {
    return this.state.dateContext.format('Y');
  }

  month() {
    return this.state.dateContext.format('MMMM');
  }

  daysInMonth() {
    return this.state.dateContext.daysInMonth();
  }

  currentDate() {
    return this.state.dateContext.get('date');
  }

  currentDay() {
    return this.state.dateContext.format('D');
  }

  firstDayOfMonth() {
    const { dateContext } = this.state;
    return moment(dateContext).startOf('month').format('d');
  }

  SelectList(props) {
    const popup = props.data.map((data => (
      <div key={data}>
        <a href="#">
          {data}
        </a>
      </div>
    )));
    return (
      <div className="month-popup">
        {popup}
      </div>
    );
  }

  MonthNav(props) {
    return (
      <span className="label-month">
        {props.month()}
        {!props.showMonthPopup
        && <props.SelectList data={props.months} />
        }
      </span>
    );
  }

  render() {
    const weekdays = this.weekdaysShort.map(day => (
      <td key={day} className="week-day">{day}</td>
    ));
    const blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i += 1) {
      const key = i * 80;
      blanks.push(<td key={key} className="emptySlot" />);
    }

    const daysInMonth = [];
    for (let d = 1; d < this.daysInMonth(); d += 1) {
      const className = (d === this.currentDay() ? 'day current-day' : 'day');
      daysInMonth.push(
        <td key={d} className={className}>
          <span>{d}</span>
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
      <div className="calendar-container">
        <table className="calendar">
          <thead>
            <tr className="calendar-header" />
            <tr>
              <td colSpan="5">
                <this.MonthNav month={this.month} showMonthPopup={this.state.showMonthPopup} SelectList={this.SelectList} months={this.months} />
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
      </div>
    );
  }
}
export default Calendar;
