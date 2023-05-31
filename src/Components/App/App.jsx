import React, { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Alert, Tabs } from 'antd';
import { debounce } from 'lodash';

import MapiService from '../../services/mapiService.js';
import Spinner from '../Spinner/index.js';
import List from '../List/index.js';
import ErrorMessage from '../ErrorMessage/index.js';
import Search from '../Search';
import { MovieProvider } from '../../Context';

import './App.css';

export default class App extends Component {
  mapiService = new MapiService();

  tabsItems = [
    {
      key: 'search',
      label: 'Search',
    },
    {
      key: 'rated',
      label: 'Rated',
    },
  ];

  genresArray = [];

  state = {
    text: '',
    currentPage: 1,
    currentTabKey: 'search',
    totalPages: null,
    totalResults: null,
    resultsArray: [],
    loading: false,
    error: false,
    sessionId: '',
    ratedArray: [],
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.mapiService
      .getGenres()
      .then((res) => (this.genresArray = res))
      .catch(this.onError);
    this.mapiService
      .createGuestSession()
      .then((res) => {
        this.setState({ sessionId: res });
      })
      .catch(this.onError);
    this.setState({ loading: false, error: false });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.text !== prevState.text) {
      this.getData(this.state.text, this.state.currentPage);
    }
  }

  onSearchChange = (e) => {
    if (e.target.value[0] === ' ') return;
    this.setState({ text: e.target.value });
  };

  getData = debounce((title) => {
    // const title = 'matrix';
    this.setState({
      loading: true,
    });
    this.mapiService.getMovies(title).then(this.onUpdateList).catch(this.onError);
  }, 500);

  onUpdateList = (data) => {
    return this.setState({
      currentPage: data.page,
      resultsArray: data.results,
      totalPages: data.total_pages,
      totalResults: data.total_results,
      loading: false,
    });
  };

  onError = () => {
    this.setState({ error: true, loading: false });
  };

  onChangePage = (page) => {
    this.setState({ currentPage: page, loading: true });
    this.mapiService.getMovies(this.state.text, page).then(this.onUpdateList).catch(this.onError);
  };

  changeCurrentTabKey = (key) => {
    this.setState({
      currentTabKey: key,
    });
  };

  // star = (value, id, obj) => {
  setRate = (value, id, obj) => {
    this.setState(({ ratedArray }) => {
      const newArray = [...ratedArray];

      // Checking for already existing record
      const idx = newArray.findIndex((el) => el.id === id);
      if (idx !== -1) {
        const oldItem = newArray[idx];
        const newItem = { ...oldItem, myRate: value };
        const editedArray = [...newArray.slice(0, idx), newItem, ...newArray.slice(idx + 1)];

        return {
          ratedArray: editedArray,
        };
      }

      // Add a new record
      const newRecord = this.createRateRecord(value, obj);
      newArray.push(newRecord);

      return {
        ratedArray: newArray,
      };
    });
  };

  createRateRecord = (rate, obj) => {
    const movieInfo = JSON.parse(JSON.stringify(obj));
    const record = { ...movieInfo, myRate: rate };
    return record;
  };

  displayRatedList = () => {
    if (this.state.currentTabKey === 'rated') console.log(this.props.ratedArray);
  };

  render() {
    const { ratedArray, resultsArray, loading, error } = this.state;

    const hasData = !(loading || error);

    const searchBar =
      this.state.currentTabKey === 'search' ? (
        <Search onSearchChange={this.onSearchChange} inputValue={this.state.text} />
      ) : null;

    const errorMessage = error ? <ErrorMessage /> : null;

    const spinner = loading ? <Spinner /> : null;
    let content;

    const noContent = loading ? null : 'Movie not found';

    if (hasData && this.state.currentTabKey === 'search') {
      content = (
        <List
          data={resultsArray}
          totalPages={this.state.totalPages}
          currentTabKey={this.state.currentTabKey}
          currentPage={this.state.currentPage}
          totalResults={this.state.totalResults}
          onPageChange={this.onChangePage}
          setRate={this.setRate}
        />
      );
    }

    if (hasData && this.state.currentTabKey === 'rated') {
      content = <List data={ratedArray} star={this.star} />;
    }

    return (
      <MovieProvider value={this.genresArray}>
        <div className="container">
          <Offline>
            <Alert message="Error" description="There is no connection to the internet!" type="error" showIcon />
          </Offline>
          <Online>
            <Tabs
              className=""
              destroyInactiveTabPane={true}
              centered
              size={'large'}
              onChange={this.changeCurrentTabKey}
              defaultActiveKey={this.state.currentTabKey}
              items={this.tabsItems}
            />
            {searchBar}
            {errorMessage}
            {spinner}
            {resultsArray.length === 0 ? noContent : content}
          </Online>
        </div>
      </MovieProvider>
    );
  }
}
