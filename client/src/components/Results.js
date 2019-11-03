import React, { Component } from 'react';

const END_POINT = '/api/offers/?';

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: {}
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.filters) !== JSON.stringify(this.props.filters)) {
      this.fetchData(this.props.filters);
    }
  }

  fetchData(filters) {
    const url = END_POINT + new URLSearchParams(filters).toString();
    this.setState({
      isLoading: true
    });

    fetch(url)
      .then(response => response.json())
      .then(data => this.setState({data, isLoading: false}))
      .catch(error => this.setState({error, isLoading: false}));
  }



  render() {
    const {error, data, isLoading} = this.state;
    if (error) {
      return `Error: ${JSON.stringify(error)}`;
    }
    if (isLoading) {
      return 'Loading...';
    }

    const { Hotel: deals = [] } = (data.offers || {});
    const items = deals.map((offer, index) => {
      return <li key={index}>
        <pre>{JSON.stringify(offer)}</pre>
      </li>
    });

    return (
      <div className="Results">
        Results
        <ul>
          {items}
        </ul>
      </div>


    );
  }
}

export default Results;
