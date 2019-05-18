import React from 'react';
import ReactDOM from 'react-dom';

class GuestPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxAdults: 0,
      maxChildren: 0,
      maxInfants: 0,
    };

    // this.upDateMaxGuests = this.upDateMaxGuests.bind(this);
  }



  render() {
    let maxGuests;
    if (typeof this.props.guest === 'string') {
      maxGuests = JSON.parse(this.props.guest);
    }
    return (
      <div>
        <div>
          <span>Adult</span> <button disabled={this.props.adults === 1}>-</button> {this.props.adults} <button>+</button>
          <br />
          <span>Children<div>Ages 2-12</div></span> <button disabled={this.props.children === 0}>-</button> {this.props.children} <button>+</button>
          <br />
          <span>Infants<div>Under 2</div></span> <button disabled={this.props.infants === 0}>-</button> {this.props.infants} <button>+</button>
        </div>
        <div></div>
        <div></div>
        <div>
          {`${maxGuests.adults} guest maximum. `} 
          <br />
          {`${maxGuests.children} children and ${maxGuests.infants} infants are allowed in this room.`}
        </div>
      </div>
    );
  }
}

export default GuestPicker;
