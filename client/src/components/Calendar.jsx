import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.style = {};
    this.state = {
      dateContext: moment(),
      showMonthPopup: false,
      showYearPopup: false,
    };
    this.weekdays = moment.weekdays();
    this.weekdaysShort = moment.weekdaysShort();
    this.months = moment.months();
    this.month = this.month.bind(this);
    this.SelectList = this.SelectList.bind(this);
    this.onChangeMonth = this.onChangeMonth.bind(this);
    this.setMonth = this.setMonth.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.year = this.year.bind(this);
    this.showYearEditor = this.showYearEditor.bind(this);
    this.setYear = this.setYear.bind(this);
    this.onYearChange = this.onYearChange.bind(this);
    this.onKeyUpYear = this.onKeyUpYear.bind(this);
    this.prevMonth = this.prevMonth.bind(this);
    this.nextMonth = this.nextMonth.bind(this);
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

  setMonth(month) {
    const monthNo = this.months.indexOf(month);
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set('month', monthNo);
    this.setState({
      dateContext,
    });
  }

  nextMonth() {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).add(1, 'month');
    this.setState({
      dateContext,
    });
    this.props.onNextMonth && this.props.onNextMonth();
  }

  prevMonth() {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).subtract(1, 'month');
    this.setState({
      dateContext,
    });
    this.props.onPrevMonth && this.props.onPrevMonth();
  }

  onSelectChange(data) {
    this.setMonth(data);
    this.props.onChangeMonth && this.props.onChangeMonth();
  }

  SelectList(props) {
    const popup = props.data.map((data => (
      <div key={data}>
        <a href="#" onClick={() => { props.onSelectChange(data); }}>
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

  onChangeMonth() {
    this.setState({
      showMonthPopup: !this.state.showMonthPopup,
    });
  }

  MonthNav(props) {
    return (
      <span
        className="label-month"
        onClick={() => { props.onChangeMonth(); }}
      >
        {props.month()}
        {props.showMonthPopup
        && <props.SelectList data={props.months} onSelectChange={props.onSelectChange} />
        }
      </span>
    );
  }

  showYearEditor() {
    this.setState({
      showYearPopup: !this.state.showMonthPopup,
    });
  }

  setYear(year) {
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set('year', year);
    this.setState({
      dateContext,
    });
  }

  onYearChange(e) {
    this.setYear(e.target.value);
    this.props.onYearChange && this.props.onYearChange(e, e.target.value);
  }

  onKeyUpYear(e) {
    if (e.which === 13 || e.which === 27) {
      this.setYear(e.target.value);
      this.setState({
        showYearPopup: false,
      });
    }
  }

  YearNav(props) {
    return (
      props.showYearPopup
        ? (
          <input
            defaultValue={props.year()}
            className="editor-year"
            // ref={(yearInput) => { this.yearInput = yearInput; }}
            onKeyUp={(e) => { props.onKeyUpYear(e); }}
            onChange={(e) => { props.onYearChange(e); }}
            type="number"
            placeholder="year"
          />
        )
        : (
          <span
            className="label-year"
            onClick={() => { props.showYearEditor(); }}
          >
            {props.year()}
          </span>
        )
    );
  }

  onDayClick(e, day) {
    this.props.onDayClick && this.props.onDayClick(e, day);
  }


  render() {
    const weekdays = this.weekdaysShort.map(day => (
      <td key={day} className="week-day">{day.slice(0, day.length - 1)}</td>
    ));
    const blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i += 1) {
      const key = i * 80;
      blanks.push(<td key={key} className="emptySlot" />);
    }

    const bookedDates = this.props.bookedDates.map(date => date.format('MM/DD/YYYY'));

    const daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d += 1) {
      daysInMonth.push(
        <td key={d} className="days">
          <span
            className="day"
            disabled={
              moment(this.state.dateContext).set('date', d) < moment()
              || bookedDates.includes(moment(this.state.dateContext).set('date', d).format('MM/DD/YYYY'))
              || moment(this.state.dateContext).set('date', d) < moment(this.props.check_in, 'MM/DD/YYYY')
              || moment(this.state.dateContext).set('date', d) > moment(this.props.check_out, 'MM/DD/YYYY')
            }
            onClick={(e) => {
              let dateContext = Object.assign({}, this.state.dateContext);
              dateContext = moment(dateContext).set('date', d);
              this.props.onDayClick(e, dateContext, this.props.handleCheckoutOnclick, this.props.closeCalendar);
              this.setState({
                dateContext,
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
      <div className="calendar-container">
        <table className="calendar">
          <thead>
            <tr className="calendar-header" />
            <tr>
              <td colSpan="1" className="nav-month">
                <button
                  type="submit"
                  className="prev"
                  onClick={() => { this.prevMonth(); }}
                >
                ←
                </button>
              </td>
              <td colSpan="5" className="thisMonth">
                <this.MonthNav month={this.month} showMonthPopup={this.state.showMonthPopup} SelectList={this.SelectList} months={this.months} onChangeMonth={this.onChangeMonth} onSelectChange={this.onSelectChange} />
                {' '}
                <this.YearNav year={this.year} showYearPopup={this.state.showYearPopup} showYearEditor={this.showYearEditor} onYearChange={this.onYearChange} onKeyUpYear={this.onKeyUpYear} />
              </td>
              <td colSpan="2" className="nav-month">
                <button
                  type="submit"
                  className="prev"
                  onClick={() => { this.nextMonth(); }}
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
          onClick={() => {
            this.props.calendarInitialize();
            this.setState({
              dateContext: moment(),
            });
          }}
        >
Clear dates
        </button>
      </div>
    );
  }
}
export default Calendar;
