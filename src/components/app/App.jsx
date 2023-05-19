import React, { Component } from 'react';

import MapiService from '../../services/mapi-service';
import Spinner from '../Spinner';
import List from '../List';
import ErrorMessage from '../ErrorMessage';

import './App.css';

export default class App extends Component {
  mapiService = new MapiService();

  constructor() {
    super();
    this.getData();
  }

  state = {
    resultsArray: [],
    loading: true,
    error: false,
  };

  getData = () => {
    const title = 'Spider-man';
    this.mapiService.getMovies(title).then(this.onUpdateList).catch(this.onError);
  };

  onUpdateList = (data) => {
    return this.setState({
      resultsArray: data,
      loading: false,
    });
  };

  onError = () => {
    this.setState({ error: true, loading: false });
  };

  render() {
    const { resultsArray, loading, error } = this.state;

    const hasData = !(loading || error);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = hasData ? <List data={resultsArray} /> : null;

    if (loading) {
      return <Spinner />;
    }

    return (
      <div className="container">
        {errorMessage}
        {/* <List data={resultsArray} /> */}
        {spinner}
        {content}
      </div>
    );
  }
}
