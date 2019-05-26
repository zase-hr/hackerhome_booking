import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import $ from 'jquery';
import Date from './Date.jsx';
import Cost from './Cost.jsx';
import Guest from './Guest.jsx';
import BookingSummary from './BookingSummary.jsx';


export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adults: 1,
      children: 0,
      infants: 0,
      adultMessage: '1 Guest',
      childrenMessage: '',
      infantMessage: '',
      guestSelected: false,
      guestExpand: false,
      totalCostPerNight: 0,
      totalCost: 0,
      calculatedTax: 0,
      selectedNights: 0,
      checkIn: '',
      checkOut: '',
      selectedDate: 0,
      checkInClicked: false,
      checkOutClicked: false,
      bookingSummaryExpand: false,
    };

    this.increaseGuest = this.increaseGuest.bind(this);
    this.decreaseGuest = this.decreaseGuest.bind(this);
    this.guestButtonMessage = this.guestButtonMessage.bind(this);
    this.guestSelectToggle = this.guestSelectToggle.bind(this);
    this.guestExpandToggle = this.guestExpandToggle.bind(this);
    this.calculateCostPerNight = this.calculateCostPerNight.bind(this);
    this.onDayClick = this.onDayClick.bind(this);
    this.handleCheckinClicked = this.handleCheckinClicked.bind(this);
    this.handleCheckoutClicked = this.handleCheckoutClicked.bind(this);
    this.calendarInitialize = this.calendarInitialize.bind(this);
    this.updateTotalNights = this.updateTotalNights.bind(this);
    this.clickOutsideOfGuestPicker = this.clickOutsideOfGuestPicker.bind(this);
    this.handleBothUnclicked = this.handleBothUnclicked.bind(this);
    this.makeBooking = this.makeBooking.bind(this);
    this.bookButtonClick = this.bookButtonClick.bind(this);
    this.closeBookingPopup = this.closeBookingPopup.bind(this);
  }

  onDayClick(e, dateContext, cb1, cb2) {
    const { checkInClicked, checkOutClicked, checkOut } = this.state;
    if (checkInClicked) {
      if (dateContext.format('MM/DD/YYYY') > checkOut) {
        this.setState({
          checkIn: dateContext.format('MM/DD/YYYY'),
          checkOut: '',
        }, cb1());
      } else {
        this.setState({
          checkIn: dateContext.format('MM/DD/YYYY'),
        }, cb1());
      }
    } else if (checkOutClicked) {
      this.setState({
        checkOut: dateContext.format('MM/DD/YYYY'),
      }, cb2(), this.guestExpandToggle(e), this.handleBothUnclicked());
    }
  }

  guestButtonMessage() {
    const { adults, children, infants } = this.state;
    if (adults === 1) {
      this.setState({
        adultMessage: '1 Guest',
      });
    } else {
      this.setState({
        adultMessage: `${adults} Guests`,
      });
    }

    if (children === 1) {
      this.setState({
        childrenMessage: ', 1 Child',
      });
    } else {
      this.setState({
        childrenMessage: `, ${children} Children`,
      });
    }

    if (infants === 1) {
      this.setState({
        infantMessage: ', 1 Infant',
      });
    } else {
      this.setState({
        infantMessage: `, ${infants} Infants`,
      });
    }
  }

  guestSelectToggle(e) {
    this.setState({
      guestSelected: true,
    }, this.calculateCostPerNight);
    e.preventDefault();
  }

  guestExpandToggle(e) {
    const { guestExpand } = this.state;
    if (!guestExpand) {
      this.setState({
        guestExpand: true,
        guestSelected: true,
      }, this.calculateCostPerNight);
    } else {
      this.setState({
        guestExpand: false,
        guestSelected: true,
      }, this.calculateCostPerNight);
    }
    this.updateTotalNights();
    e.preventDefault();
  }

  clickOutsideOfGuestPicker() {
    this.setState({
      guestExpand: false,
    });
  }

  calculateCostPerNight() {
    const {
      price, serviceFee, cleaningFee, tax,
    } = this.props;
    const { selectedNights } = this.state;
    let cost = price + serviceFee + cleaningFee;
    let totalTax = cost * (tax / 100);
    totalTax = parseFloat(tax.toFixed(2));
    cost += totalTax;
    cost = parseFloat(cost.toFixed(2));
    const totalCost = cost * selectedNights;
    this.setState({
      totalCostPerNight: cost,
      calculatedTax: totalTax,
      totalCost,
    });
  }

  increaseGuest(e) {
    e.preventDefault(e);
    this.setState({
      [e.target.className]: this.state[e.target.className] + 1,
    }, this.guestButtonMessage);
  }

  decreaseGuest(e) {
    e.preventDefault(e);
    this.setState({
      [e.target.className]: this.state[e.target.className] - 1,
    }, this.guestButtonMessage);
  }

  handleCheckinClicked() {
    this.setState({
      checkInClicked: true,
      checkOutClicked: false,
    });
  }

  handleCheckoutClicked() {
    this.setState({
      checkOutClicked: true,
      checkInClicked: false,
    });
  }

  handleBothUnclicked() {
    this.setState({
      checkInClicked: false,
      checkOutClicked: false,
    });
  }

  updateTotalNights() {
    const { checkOut, checkIn } = this.state;
    let nights = moment(checkOut, 'MM/DD/YY') - moment(checkIn, 'MM/DD/YY');
    nights = moment(nights).format('D');
    this.setState({
      selectedNights: nights,
    });
  }

  calendarInitialize(e) {
    this.setState({
      checkIn: '',
      checkOut: '',
    }, this.handleCheckinClicked());
    e.preventDefault();
  }

  makeBooking(roomId, email) {
    const {
      checkIn, checkOut, adults, children, infants,
    } = this.state;
    let guests = {
      adults,
      children,
      infants,
    };
    guests = JSON.stringify(guests);
    const checkInDate = moment(checkIn, 'MM/DD/YYYY').format();
    const checkOutDate = moment(checkOut, 'MM/DD/YYYY').format();
    let value = {
      check_in: checkInDate,
      check_out: checkOutDate,
      guests,
      email,
      roomId,
      createdAt: moment().format(),
    };
    value = JSON.stringify(value);
    $.ajax({
      url: `/booking?roomId=${roomId}`,
      type: 'POST',
      contentType: 'application/json',
      data: value,
      success: (data) => {
        console.log(data);
      },
    });
  }

  bookButtonClick() {
    const { checkOut, checkIn, guestSelected } = this.state;
    if (checkIn === '' || checkOut === '') {
      this.handleCheckinClicked();
    } else if (!guestSelected) {
      this.guestExpandToggle();
    } else {
      this.setState({
        bookingSummaryExpand: true,
      });
    }
  }

  closeBookingPopup() {
    this.setState({
      bookingSummaryExpand: false,
    });
  }

  render() {
    const {
      adults,
      children,
      infants,
      adultMessage,
      childrenMessage,
      infantMessage,
      checkIn,
      checkOut,
      checkInClicked,
      checkOutClicked,
      guestSelected,
      guestExpand,
      selectedNights,
      calculatedTax,
      totalCost,
      bookingSummaryExpand,
    } = this.state;

    const {
      bookedDates,
      guest,
      price,
      cleaningFee,
      serviceFee,
      minNight,
      maxNight,
      roomId,
      roomname,
      reviews,
      ratings,
    } = this.props;

    let message = adultMessage;

    if (children !== 0) {
      message += childrenMessage;
    }
    if (infants) {
      message += infantMessage;
    }

    return (
      <section>
        <form>
          <div>
            <Date
              checkIn={checkIn}
              checkOut={checkOut}
              onDayClick={this.onDayClick}
              bookedDates={bookedDates}
              handleCheckinClicked={this.handleCheckinClicked}
              handleCheckoutClicked={this.handleCheckoutClicked}
              checkInClicked={checkInClicked}
              checkOutClicked={checkOutClicked}
              calendarInitialize={this.calendarInitialize}
              minNight={minNight}
              maxNight={maxNight}
              handleBothUnclicked={this.handleBothUnclicked}
            />
            <Guest
              guest={guest}
              adults={adults}
              numChildren={children}
              infants={infants}
              increaseGuest={this.increaseGuest}
              decreaseGuest={this.decreaseGuest}
              guestSelectToggle={this.guestSelectToggle}
              message={message}
              guestButtonMessage={this.guestButtonMessage}
              guestSelected={guestSelected}
              guestExpandToggle={this.guestExpandToggle}
              guestExpand={guestExpand}
              updateTotalNights={this.updateTotalNights}
              clickOutsideOfGuestPicker={this.clickOutsideOfGuestPicker}
            />
            {selectedNights !== 'Invalid date' && guestSelected && !guestExpand
              ? (
                <Cost
                  price={price}
                  cleaningFee={cleaningFee}
                  serviceFee={serviceFee}
                  tax={calculatedTax}
                  totalCost={totalCost}
                  selectedNights={selectedNights}
                />
              ) : null}
          </div>
        </form>
        <div className="bookbutton">
          <button className="book" type="button" onClick={this.bookButtonClick}><div>Book</div></button>
          {bookingSummaryExpand ? (
            <BookingSummary
              roomId={roomId}
              roomname={roomname}
              makeBooking={this.makeBooking}
              checkIn={checkIn}
              checkOut={checkOut}
              message={message}
              totalCost={totalCost}
              cleaningFee={cleaningFee}
              serviceFee={serviceFee}
              tax={calculatedTax}
              selectedNights={selectedNights}
              price={price}
              closeBookingPopup={this.closeBookingPopup}
              reviews={reviews}
              ratings={ratings}
            />
          ) : null}
        </div>
      </section>

    );
  }
}

Form.propTypes = {
  guest: PropTypes.string,
  price: PropTypes.number,
  cleaningFee: PropTypes.number,
  serviceFee: PropTypes.number,
  tax: PropTypes.number,
  bookedDates: PropTypes.arrayOf(PropTypes.string),
  minNight: PropTypes.number,
  maxNight: PropTypes.number,
  roomId: PropTypes.number,
  roomname: PropTypes.string,
};

Form.defaultProps = {
  guest: '',
  price: 0,
  cleaningFee: 0,
  serviceFee: 0,
  tax: 0,
  bookedDates: [],
  minNight: 0,
  maxNight: 0,
  roomId: 1,
  roomname: '',
};
