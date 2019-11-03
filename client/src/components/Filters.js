import React, { Component } from 'react';

const FILTERS = [
  {name: 'destinationName'},
  {name: 'destinationCity'},
  {name: 'regionIds', type: 'number'},
  {name: 'minTripStartDate', type: 'date'},
  {name: 'maxTripStartDate', type: 'date'},
  {name: 'lengthOfStay', type: 'number'},
  {name: 'minStarRating', type: 'number'},
  {name: 'maxStarRating', type: 'number'},
  {name: 'minTotalRate', type: 'number'},
  {name: 'maxTotalRate', type: 'number'},
  {name: 'minGuestRating', type: 'number'},
  {name: 'maxGuestRating', type: 'number'},
  {name: 'hotelId', type: 'number'}
]

class Filters extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {};
  }

  componentDidMount() {
    const { onSubmit } = this.props;
    onSubmit && onSubmit(this.state);
  }

  handleChange(event) {
    event.persist();
    const target = event.target;
    this.setState({[target.name]: target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    const { onSubmit } = this.props;
    onSubmit && onSubmit(this.state);
  }

  render() {
    const filtersDom = FILTERS.map(filter => {
      return <div key={filter.name}>
        <label htmlFor={filter.name}>
          {filter.label || filter.name}
        </label>
        <input
          name={filter.name}
          type={filter.type || 'text'}
          onChange={this.handleChange}
        />
      </div>
    })
    return (
      <form onSubmit={this.handleSubmit}>
        {filtersDom}
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default Filters;
