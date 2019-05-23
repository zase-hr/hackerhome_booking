/* eslint-disable react/no-this-in-sfc */
import React from 'react';
import ReactDOM from 'react-dom';
import GuestPicker from './GuestPicker.jsx';

const Guest = props => (
  <div className="guest">
    <div className="guestSection">Guests</div>
    <div className="guestSection1">
      <button className={props.guestExpand ? 'guestButton' : 'guestButton0'} type="button" expand={props.guestSelected.toString()} onClick={props.guestExpandToggle}>
        <div className="guestButton1">
          <div className="message">
            {props.message}
            <div className="goDown">
              {props.guestExpand
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
      {props.guestExpand
        ? (
          <GuestPicker
            adults={props.adults}
            num_children={props.num_children}
            infants={props.infants}
            guest={props.guest}
            increaseGuest={props.increaseGuest}
            decreaseGuest={props.decreaseGuest}
            guestButtonMessage={props.guestButtonMessage}
            guestExpandToggle={props.guestExpandToggle}
            updateTotalNights={props.updateTotalNights}

          />
        ) : null}
    </div>
  </div>
);

export default Guest;
