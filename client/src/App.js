import React, { Component } from 'react';
import Filters from './components/Filters';
import Results from './components/Results';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {filters: {}}
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(filters) {
    this.setState({filters});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Expedia offers service
        </header>
        <Filters onSubmit={this.onSubmit} />
        <Results filters={this.state.filters}/>
      </div>
    );

  }
}

export default App;
