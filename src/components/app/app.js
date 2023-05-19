import React, { Component } from 'react';

import MapiService from '../../services/mapiService';
import Spinner from '../spinner';
import List from '../list';
import ErrorMessage from '../errorMessage';

import './app.css';

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
    const title = 'matrix';
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
        {spinner}
        {content}
      </div>
    );
  }
}
