import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Date from './Date.jsx';
import Cost from './Cost.jsx';
import Guest from './Guest.jsx';


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
      check_in: '',
      check_out: '',
      selectedDate: 0,
      check_in_clicked: false,
      check_out_clicked: false,
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
  }

  onDayClick(e, dateContext, cb1, cb2) {
    const { check_in_clicked, check_out_clicked } = this.state;
    if (check_in_clicked) {
      this.setState({
        check_in: dateContext.format('MM/DD/YYYY'),
      }, cb1());
    } else if (check_out_clicked) {
      this.setState({
        check_out: dateContext.format('MM/DD/YYYY'),
      }, cb2(), this.guestExpandToggle(e));
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
      price, service_fee, cleaning_fee, tax,
    } = this.props;
    const { selectedNights } = this.state;
    let cost = price + service_fee + cleaning_fee;
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
      check_in_clicked: true,
      check_out_clicked: false,
    });
  }

  handleCheckoutClicked() {
    this.setState({
      check_out_clicked: true,
      check_in_clicked: false,
    });
  }

  updateTotalNights() {
    const { check_out, check_in } = this.state;
    let nights = moment(check_out, 'MM/DD/YY') - moment(check_in, 'MM/DD/YY');
    nights = moment(nights).format('D');
    this.setState({
      selectedNights: nights,
    });
  }

  calendarInitialize(e) {
    this.setState({
      check_in: 0,
      check_out: 0,
    }, this.handleCheckinClicked());
    e.preventDefault();
  }

  render() {
    const {
      adults,
      children,
      infants,
      adultMessage,
      childrenMessage,
      infantMessage,
      check_in,
      check_out,
      check_in_clicked,
      check_out_clicked,
      guestSelected,
      guestExpand,
      selectedNights,
      calculatedTax,
      totalCost,
    } = this.state;

    const {
      bookedDates,
      guest,
      price,
      cleaning_fee,
      service_fee,
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
              check_in={check_in}
              check_out={check_out}
              onDayClick={this.onDayClick}
              bookedDates={bookedDates}
              handleCheckinClicked={this.handleCheckinClicked}
              handleCheckoutClicked={this.handleCheckoutClicked}
              check_in_clicked={check_in_clicked}
              check_out_clicked={check_out_clicked}
              calendarInitialize={this.calendarInitialize}
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
                  cleaning_fee={cleaning_fee}
                  service_fee={service_fee}
                  tax={calculatedTax}
                  totalCost={totalCost}
                  selectedNights={selectedNights}
                />
              ) : null}
          </div>
        </form>
        <div className="bookbutton">
          <button className="book" type="button"><div>Book</div></button>
        </div>
      </section>

    );
  }
}

Form.propTypes = {
  guest: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  cleaning_fee: PropTypes.number.isRequired,
  service_fee: PropTypes.number.isRequired,
  tax: PropTypes.number.isRequired,
  bookedDates: PropTypes.array.isRequired,
};
