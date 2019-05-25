/* eslint-disable react/no-this-in-sfc */
import React from 'react';
import PropTypes from 'prop-types';
import GuestPicker from './GuestPicker.jsx';

const Guest = (props) => {
  const {
    message,
    guestExpand,
    guestSelected,
    guestExpandToggle,
    guest,
    adults,
    numChildren,
    infants,
    clickOutsideOfGuestPicker,
    increaseGuest,
    decreaseGuest,
    updateTotalNights,
    guestButtonMessage,
  } = props;
  return (
    <div className="guest">
      <div className="guestSection">Guests</div>
      <div className="guestSection1">
        <button className={guestExpand ? 'guestButton' : 'guestButton0'} type="button" expand={guestSelected.toString()} onClick={guestExpandToggle}>
          <div className="guestButton1">
            <div className="message">
              {message}
              <div className="goDown">
                {guestExpand
                  ? (
                    <svg
                      viewBox="0 0 18 18"
                      role="presentation"
                      aria-hidden="true"
                      focusable="false"
                      style={{
                        height: '16px', width: '16px', display: 'block', fill: 'currentcolor',
                      }}
                    >
                      <path d="m1.71 13.71a1 1 0 1 1 -1.42-1.42l8-8a1 1 0 0 1 1.41 0l8 8a1 1 0 1 1 -1.41 1.42l-7.29-7.29z" fillRule="evenodd" />

                    </svg>
                  )
                  : (
                    <svg
                      viewBox="0 0 18 18"
                      role="presentation"
                      aria-hidden="true"
                      focusable="false"
                      style={{
                        height: '16px', width: '16px', display: 'block', fill: 'currentcolor',
                      }}
                    >
                      <path d="m16.29 4.3a1 1 0 1 1 1.41 1.42l-8 8a1 1 0 0 1 -1.41 0l-8-8a1 1 0 1 1 1.41-1.42l7.29 7.29z" fillRule="evenodd" />
                    </svg>
                  )}
              </div>
            </div>
          </div>

        </button>
      </div>
      <div className="guestPicker">
        {guestExpand
          ? (
            <GuestPicker
              adults={adults}
              numChildren={numChildren}
              infants={infants}
              guest={guest}
              increaseGuest={increaseGuest}
              decreaseGuest={decreaseGuest}
              guestButtonMessage={guestButtonMessage}
              guestExpandToggle={guestExpandToggle}
              updateTotalNights={updateTotalNights}
              clickOutsideOfGuestPicker={clickOutsideOfGuestPicker}
            />
          ) : null}
      </div>
    </div>
  );
};

Guest.propTypes = {
  message: PropTypes.string.isRequired,
  guest: PropTypes.string.isRequired,
  adults: PropTypes.number.isRequired,
  numChildren: PropTypes.number.isRequired,
  infants: PropTypes.number.isRequired,
  clickOutsideOfGuestPicker: PropTypes.func.isRequired,
  increaseGuest: PropTypes.func.isRequired,
  decreaseGuest: PropTypes.func.isRequired,
  guestExpandToggle: PropTypes.func.isRequired,
  guestExpand: PropTypes.bool.isRequired,
  guestSelected: PropTypes.bool.isRequired,
  updateTotalNights: PropTypes.func.isRequired,
  guestButtonMessage: PropTypes.func.isRequired,
};

export default Guest;
