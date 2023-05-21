import React, { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Alert } from 'antd';

import MapiService from '../../services/mapiService.js';
import Spinner from '../Spinner/index.js';
import List from '../List/index.js';
import ErrorMessage from '../CrrorMessage/index.js';

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
    const title = 'Iron';
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
      <>
        <Offline>
          <Alert message="Error" description="There is no connection to the internet!" type="error" showIcon />
        </Offline>
        <Online>
          <div className="container">
            {errorMessage}
            {spinner}
            {content}
          </div>
        </Online>
      </>
    );
  }
}
