import React from 'react';
import ReactDOM from 'react-dom';


const GuestPicker = (props) => {
  const maxGuests = JSON.parse(props.guest);

  return (
    <div className="picker">
      <div>
        <div className="guestType">
          Adults
          <div className="buttonSection">
            <button className="buttons" disabled={props.adults === 1} onClick={props.decreaseAdults}>- </button>
            <div className="countAdults">{props.adults}</div>
            <button className="buttons" disabled={props.adults === maxGuests.adults} onClick={props.increaseAdult}> + </button>
          </div>
        </div>
        <div></div>
        <br /><br />
        <div className="guestType">
          Children
          <div className="buttonSection">
            <button className="buttons" disabled={props.num_children === 0} onClick={props.decreaseChildren}>-</button>
            <div className="count">{props.num_children}</div>
            <button className="buttons" disabled={props.num_children === maxGuests.children} onClick={props.increaseChildren}>+</button>
          </div>
        </div>
          <div className="guestTypeInfo">Ages 2-12</div>
        <br />
        <div className="guestType">
          Infants
          <div className="buttonSection">
            <button className="buttons" disabled={props.infants === 0} onClick={props.decreaseInfants}>-</button>
            <div className="count">{props.infants}</div>
            <button className="buttons" disabled={props.infants === maxGuests.infants} onClick={props.increaseInfants}>+</button>
          </div>
        </div>
        <div className="guestTypeInfo">Under 2</div>
      </div>
      <br />
      <div>
        {`${maxGuests.adults} guest maximum. `}{`${maxGuests.children} children and ${maxGuests.infants} infants are allowed in this room.`}
      </div>
      <button className="close" onClick={props.guestExpandToggle}>Close</button>
    </div>
  );
};


export default GuestPicker;
