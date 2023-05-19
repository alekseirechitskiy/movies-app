import React, { Component } from 'react';

import MapiService from '../../services/mapi-service';
import List from '../List';

import './App.css';

export default class App extends Component {
  mapiService = new MapiService();

  constructor() {
    super();
    this.getData();
  }

  state = {
    resultsArray: null,
  };

  async getData() {
    const title = 'batman';
    const data = this.mapiService.getMovies(title);

    data.then((result) => {
      return this.setState({
        resultsArray: result,
      });
    });
  }

  // someFunc(data) {
  //   this.setState({
  //     resultsArray: data,
  //   });
  // console.log(this.state);
  // }

  //   fetch(
  //     'https://api.themoviedb.org/3/search/movie?query=return&include_adult=false&language=en-US&page=1&api_key=67794c82b9038fd6aca2a93ec32186a6',
  //     options
  //   )
  //     .then((response) => response.json())
  //     .then((data) => data)
  //     .catch((err) => console.error(err));
  // };

  render() {
    const { resultsArray } = this.state;
    if (!resultsArray) return;

    // const item = resultsArray.map((el) => <li key={el.id}>{el.title}</li>);

    return (
      <div className="container">
        <List data={resultsArray} />
        {/* <ul>{item}</ul> */}
      </div>
    );
  }
}
