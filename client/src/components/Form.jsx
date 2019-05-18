import React from 'react';
import ReactDOM from 'react-dom';
import Date from './Date.jsx';
import Cost from './Cost.jsx';
import Guest from './Guest.jsx';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adults: 1,
      children: 0,
      infants: 0,
    };
  }
  increaseAdults() {
    
    this.setState({
      adults: this.state.adults +1
    })
  }
  inCreaseChildren() {

  }
  inCreaseInfants() {

  }
  render() {
    return (
      <section>
        <div>
          <Date />
          <Guest guest={this.props.guest} adults={this.state.adults} children={this.state.children} infants={this.state.infants} />
          <Cost />
        </div>
      </section>

    );
  }
}

export default Form;
