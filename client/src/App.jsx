import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import Info from './components/Info.jsx';
import Form from './components/form.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomInfo: {
        roomname: '',
        price: 0,
        cleaning_fee: 0,
        service_fee: 0,
        tax: 0,
        max_guest: {},
        min_night: 0,
        max_night: 0,
        ratings: 0,
        num_reviews: 0,
      },
      bookedDates: [],
      bookingInfo: {},
      rendering: true,
    };

    this.getRoomData = this.getRoomData.bind(this);
    this.getBookingData = this.getBookingData.bind(this);
    this.updateRoomState = this.updateRoomState.bind(this);
    this.updateBookedDates = this.updateBookedDates.bind(this);
    this.handleRendering = this.handleRendering.bind(this);
  }

  componentDidMount() {
    this.getRoomData(1);
    this.getBookingData(1);
  }

  getRoomData(roomId) {
    $.ajax({
      url: `/room?roomId=${roomId}`,
      type: 'GET',
      error: (err) => {
        throw err;
      },
      success: (result) => {
        this.updateRoomState(result);
      },
    });
  }

  getBookingData(roomId) {
    $.ajax({
      url: `/booking?roomId=${roomId}`,
      type: 'GET',
      error: (err) => {
        throw err;
      },
      success: (result) => {
        console.log(result);
        this.updateBookedDates(result);
      },
    });
  }

  handleRendering() {
    this.setState({
      rendering: false,
    });
  }

  updateBookedDates(results) {
    const bookedDate = [];
    results.forEach((data) => {
      const nights = moment(data.check_out).diff(data.check_in, 'd');
      for (let i = 0; i < nights; i += 1) {
        bookedDate.push(moment(data.check_in, 'YYYY-MM-DD').add(i, 'd'));
      }
    });
    this.setState({
      bookedDates: bookedDate,
    });
  }

  makeBooking(roomId) {
    $.ajax({
      url: `/booking?roomId=${roomId}`,
      type: 'POST',
      data: {
        value: {
          check_in: 0,
          check_out: 0,
          guests: {},
          email: 0,
          roomId: 1,
        },
      },
      dataType: 'application/json',
      error: (err) => {
        throw err;
      },
      success: () => {
        console.log('success to make booking');
      },
    });
  }

  updateRoomState(result) {
    this.setState({
      roomInfo: {
        roomname: result.roomname,
        price: result.price,
        cleaning_fee: result.cleaning_fee,
        service_fee: result.service_fee,
        tax: result.tax,
        max_guest: result.max_guest,
        min_night: result.min_night,
        max_night: result.max_night,
        ratings: result.ratings,
        num_reviews: result.num_reviews,
      },
    });
  }


  render() {
    const divStyle = {height: '16px', width: '16px', display: 'block', fill: 'rgb(118, 118, 118)', }
    const app = (
      <div className="app">
        <button type="submit" className="xbutton" onClick={this.handleRendering}>
          <svg viewBox="0 0 24 24" role="img" aria-label="Close" focusable="false" style={divStyle}>
            <path d="m23.25 24c-.19 0-.38-.07-.53-.22l-10.72-10.72-10.72 10.72c-.29.29-.77.29-1.06 0s-.29-.77 0-1.06l10.72-10.72-10.72-10.72c-.29-.29-.29-.77 0-1.06s.77-.29 1.06 0l10.72 10.72 10.72-10.72c.29-.29.77-.29 1.06 0s .29.77 0 1.06l-10.72 10.72 10.72 10.72c.29.29.29.77 0 1.06-.15.15-.34.22-.53.22" fillRule="evenodd" />
          </svg>
        </button>
        <div>
          <Info
            price={this.state.roomInfo.price}
            reviews={this.state.roomInfo.num_reviews}
            ratings={this.state.roomInfo.ratings}
          />
        </div>
        <div className="dividingSection" />
        <div>
          <Form
            guest={this.state.roomInfo.max_guest}
            price={this.state.roomInfo.price}
            cleaning_fee={this.state.roomInfo.cleaning_fee}
            service_fee={this.state.roomInfo.service_fee}
            tax={this.state.roomInfo.tax}
            min_night={this.state.roomInfo.min_night}
            max_night={this.state.roomInfo.max_night}
            bookedDates={this.state.bookedDates}
          />
        </div>

        <div className="notYet">You won’t be charged yet</div>
        <div className="dividingSection" />
        <div className="image">
          <div className="lower">New lower price</div>
          <div className="lowerPrice">Price for your trip dates was just lowered by $71.</div>
        </div>
      </div>
    );

    return (
      <div>
        {this.state.rendering ? app : null}
      </div>
    );
  }
}

export default App;
