import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
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
      bookingInfo: {},
      makeBooking:{},
      calenderToggle: false,
      guestToggle: false,
    };

    this.getRoomData = this.getRoomData.bind(this);
    this.getBookingData = this.getBookingData.bind(this);
    this.upDateRoomState = this.upDateRoomState.bind(this);
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
        this.upDateRoomState(result);
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
      },
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

  upDateRoomState(result) {
    console.log(result)
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

  // upDateBookingState(result) {
  //   this.setState({
  //     bookingInfo: {
  //     },
  //   });
  //   console.log(this.state);
  // }

  

  render() {
    // const guest;
    // if (this.state.roomInfo.max_guest !== '') {
    //   guest = JSON.parse(this.state.roomInfo.max_guest);
    // };

    return (
      <div>
        <div>
          <Info
            price={this.state.roomInfo.price}
            reviews={this.state.roomInfo.num_reviews}
            ratings={this.state.roomInfo.ratings}
          />
        </div>
        <div>
          <Form guest={this.state.roomInfo.max_guest} />
        </div>
        <button type="button">Book</button>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('booking'));
