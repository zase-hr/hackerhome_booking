/* eslint-disable react/no-this-in-sfc */
import React from 'react';
import ReactDOM from 'react-dom';
import GuestPicker from './GuestPicker.jsx';

const Guest = props => (
  <div className="guest">
    <div className="guestSection">Guests</div>
    <button className={props.guestExpand ? 'guestButton' : 'guestButton0'} type="button" expand={props.guestSelected.toString()} onClick={props.guestExpandToggle}>
      <div className="guestButton1"><div className="message">{props.message}</div></div>
      <div className="goDown" />
    </button>
    <div className="guestPicker">
      {props.guestExpand
        ? (
          <GuestPicker
            adults={props.adults}
            num_children={props.num_children}
            infants={props.infants}
            guest={props.guest}
            // increaseAdults={props.increaseAdults}
            // increaseChildren={props.increaseChildren}
            // increaseInfants={props.increaseInfants}
            increaseGuest={props.increaseGuest}
            decreaseGuest={props.decreaseGuest}
            // decreaseAdults={props.decreaseAdults}
            // decreaseChildren={props.decreaseChildren}
            // decreaseInfants={props.decreaseInfants}
            guestButtonMessage={props.guestButtonMessage}
            guestExpandToggle={props.guestExpandToggle}
            updateTotalNights={props.updateTotalNights}

          />
        ) : null}
    </div>
  </div>
);

export default Guest;
