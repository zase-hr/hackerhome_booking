import React from 'react';
import ReactDOM from 'react-dom';
import GuestPicker from './GuestPicker.jsx'

class Guest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxAdults: 0,
      maxChildren: 0,
      maxInfants: 0,
      isChanged: false,
      adultMessage: '',
      childrenMessage: '',
      infantMessage: '',
      guestToggle: false,
    };
    this.updateMaxGuests = this.updateMaxGuests.bind(this);
    this.guestButtonMessage = this.guestButtonMessage.bind(this);
    this.guestToggle = this.guestToggle.bind(this);
  }

  componentDidUpdate() {
    if (!this.state.isChanged) {
      this.updateMaxGuests(this.props.guest);
      this.guestButtonMessage();
    }
  }

  updateMaxGuests(max) {
    const guest = JSON.parse(max);
    this.setState({
      maxAdults: guest.adults,
      maxChildren: guest.children,
      maxInfants: guest.infants,
      isChanged: true,
    });
  }

  guestToggle() {
    this.setState({
      guestToggle: true,
    });
    this.forceUpdate();
  }

  guestButtonMessage() {
    console.log('mes: ', this.props.adults)
    if (this.props.adults === 1) {
      this.setState({
        adultMessage: '1 Guest',
      });
    } else {
      this.setState({
        adultMessage: `${this.props.adults} Guests`,
      });
    }

    if (this.props.children === 1) {
      this.setState({
        childrenMessage: ', 1 Child',
      });
    } else {
      this.setState({
        childrenMessage: `, ${this.props.children} Children`,
      });
    }

    if (this.props.infants === 1) {
      this.setState({
        infantMessage: `, 1 Infant`,
      });
    } else {
      this.setState({
        infantMessage: `, ${this.props.infants} Infants`,
      });
    }
  }

  render() {
    let message = this.state.adultMessage;
    if (this.props.children !== 0) {
      message += this.state.childrenMessage;
    }
    if (this.props.infants) {
      message += this.state.infantMessage;
    }
    return (
      <div>
        <form>
          <button type="button" expand={this.state.guestToggle.toString()} onClick={this.guestToggle}>
            {message}
          </button>
          {this.state.guestToggle ? <GuestPicker adults={this.props.adults} children={this.props.children} infants={this.props.infants} guest={this.props.guest} /> : null}
          <br />
        </form>
        
      </div>
    );
  }
}

export default Guest;
