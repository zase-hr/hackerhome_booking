import React from 'react';
import PropTypes from 'prop-types';
import ClickOutsideOfGuestPicker from './ClickOutsideOfGuestPicker.jsx';


const GuestPicker = (props) => {
  const {
    guest,
    adults,
    numChildren,
    infants,
    clickOutsideOfGuestPicker,
    increaseGuest,
    decreaseGuest,
    guestExpandToggle,
  } = props;

  const maxGuests = JSON.parse(guest);

  return (
    <ClickOutsideOfGuestPicker clickOutsideOfGuestPicker={clickOutsideOfGuestPicker}>
      <div className="picker">
        <div>
          <div className="guestType">
            Adults
            <div className="buttonSection">
              <button type="submit" className="adults" id="buttons" disabled={adults === 1} onClick={decreaseGuest}>- </button>
              <div className="countAdults">{adults}</div>
              <button type="submit" className="adults" id="buttons" disabled={adults === maxGuests.adults} onClick={increaseGuest}> + </button>
            </div>
          </div>
          <div />
          <br />
          <br />
          <div className="guestType">
            Children
            <div className="buttonSection">
              <button type="submit" className="children" id="buttons" disabled={numChildren === 0} onClick={decreaseGuest}>-</button>
              <div className="count">{numChildren}</div>
              <button type="submit" className="children" id="buttons" disabled={numChildren === maxGuests.children} onClick={increaseGuest}>+</button>
            </div>
          </div>
          <div className="guestTypeInfo">Ages 2-12</div>
          <br />
          <div className="guestType">
            Infants
            <div className="buttonSection">
              <button type="submit" className="infants" id="buttons" disabled={infants === 0} onClick={decreaseGuest}>-</button>
              <div className="count">{infants}</div>
              <button type="submit" className="infants" id="buttons" disabled={infants === maxGuests.infants} onClick={increaseGuest}>+</button>
            </div>
          </div>
          <div className="guestTypeInfo">Under 2</div>
        </div>
        <br />
        <div>
          {`${maxGuests.adults} guest maximum. `}
          {`${maxGuests.children} children and ${maxGuests.infants} infants are allowed in this room.`}
        </div>
        <button type="submit" className="close" onClick={guestExpandToggle}>Close</button>
      </div>
    </ClickOutsideOfGuestPicker>
  );
};

GuestPicker.propTypes = {
  guest: PropTypes.string,
  adults: PropTypes.number,
  numChildren: PropTypes.number,
  infants: PropTypes.number,
  clickOutsideOfGuestPicker: PropTypes.func,
  increaseGuest: PropTypes.func,
  decreaseGuest: PropTypes.func,
  guestExpandToggle: PropTypes.func,
};

GuestPicker.defaultProps = {
  guest: '',
  adults: 0,
  numChildren: 0,
  infants: 0,
  clickOutsideOfGuestPicker: () => {},
  increaseGuest: () => { },
  decreaseGuest: () => { },
  guestExpandToggle: () => { },
};


export default GuestPicker;
