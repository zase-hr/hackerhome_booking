import React from 'react';
import ReactDOM from 'react-dom';

class Cost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceMessage: '',
    }
  }

  render() {
    return (
      <div className="rates">
        <div className="roomRate">
          <div className="costTitle">${this.props.price} x {this.props.selectedNights} 
            {this.props.selectedNights === 1 ? 'night' : 'nights'}
          </div>
          <div className="cost">{`$ ${this.props.price * this.props.selectedNights}`}</div>
        </div>
        <div className="dividingSection1" />
        <div className="serviceRate">
          <div className="costTitle">Service fee</div>
          <div className="cost">${this.props.service_fee * this.props.selectedNights}</div>
        </div>
        <div className="dividingSection1" />
        <div className="cleaningRate">
          <div className="costTitle">Cleaning fee</div>
          <div className="cost">${this.props.cleaning_fee * this.props.selectedNights}</div>
        </div>
        <div className="dividingSection1" />
        <div className="taxRate">
          <div className="costTitle">Ocupancy taxes</div>
          <div className="cost">${(this.props.tax * this.props.selectedNights).toFixed(1)}</div>
        </div>
        <div className="dividingSection1" />
        <div className="totalRate">
          <div className="costTitle"> Total</div>
          <div className="cost">{`$${(this.props.totalCost).toFixed(1)}`}</div>
        </div>
      </div>
    );
  }
}

export default Cost;
