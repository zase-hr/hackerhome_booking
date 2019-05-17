import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


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
        max_guest: null,
        min_night: 0,
        max_night: 0,
        ratings: 0,
        num_reviews: 0,
      },
      bookingInfo: {},
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

  upDateRoomState(result) {
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
    console.log(this.state);
  }

  // upDateBookingState(result) {
  //   this.setState({
  //     bookingInfo: {
  //     },
  //   });
  //   console.log(this.state);
  // }

  render() {
    return (
      <div>
        <div>Hello</div>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('booking'));
