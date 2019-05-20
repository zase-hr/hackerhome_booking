import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from './Calendar.jsx';
class Date extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

handleChange(e){
  console.log(e.target.value)
}

  render() {
    return (
      <div className="dates">
        <div className="dateSection">Dates</div>
        <div className="inputs">
          <input className="check-in" type="text" value="check-in" onChange={this.handleChange} />
          <div className="arrow">→</div>
          <input className="check-out" type="text" value="check-out" onChange={this.handleChange} />
        </div>
        <Calendar />
      </div>
    );
  }
}

Date.propTypes = {
  // video: React.PropTypes.object.isRequired
};

export default Date;
