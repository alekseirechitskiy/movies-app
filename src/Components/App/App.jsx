import React, { Component } from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Alert, Tabs } from 'antd';
import { debounce } from 'lodash';

import MapiService from '../../services/mapiService.js';
import Spinner from '../Spinner/index.js';
import List from '../List/index.js';
import ErrorMessage from '../ErrorMessage/index.js';
import Search from '../Search';
import PaginationComponent from '../PaginationComponent';
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
    loading: true,
    error: false,
    sessionId: '',
    ratedArray: [],
  };

  constructor() {
    super();
  }

  componentDidMount() {
    // this.getData(this.state.text);
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

    if (this.state.currentPage !== prevState.currentPage && this.state.text === prevState.text) {
      console.log('componentDidUpdate PAGE');
    }
  }

  onSearchChange = (e) => {
    if (e.target.value[0] === ' ') return;
    this.setState({ text: e.target.value });
  };

  getData = debounce((title) => {
    // const title = 'matrix';
    this.mapiService.getMovies(title).then(this.onUpdateList).catch(this.onError);
  }, 1000);

  onUpdateList = (data) => {
    // console.log('data: ', data);
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

  changePage = (page) => {
    this.setState({ currentPage: page });
    console.log('this.state: ', this.state);
  };

  pagOnChange = () => {
    console.log('from pagOnChange');
    this.changePage();
  };

  onChangePage = (page) => {
    this.setState({ currentPage: page });
    this.mapiService.getMovies(this.state.text, page).then(this.onUpdateList).catch(this.onError);
  };

  changeCurrentTabKey = (key) => {
    // this.displayRatedList();
    this.setState({
      currentTabKey: key,
      // loading: true,
    });
  };

  star = (value, id, obj) => {
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

    const searchBar = this.state.currentTabKey === 'search' ? <Search onSearchChange={this.onSearchChange} /> : null;

    const hasData = !(loading || error);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    // const content = hasData ? <List data={resultsArray} star={this.star} /> : 'No results';
    let content = '';

    if (hasData && this.state.currentTabKey === 'search') {
      content = <List data={resultsArray} star={this.star} />;
    }

    if (hasData && this.state.currentTabKey === 'rated') {
      content = <List data={ratedArray} star={this.star} />;
    }

    if (loading) {
      return <Spinner />;
    }

    return (
      <>
        <MovieProvider value={this.genresArray}>
          <Offline>
            <Alert message="Error" description="There is no connection to the internet!" type="error" showIcon />
          </Offline>
          <Online>
            <div className="container">
              <Tabs
                className=""
                destroyInactiveTabPane={true}
                centered
                size={'large'}
                onChange={this.changeCurrentTabKey}
                defaultActiveKey={this.state.currentTabKey}
                items={this.tabsItems}
              />
              <div className="view">
                {searchBar}
                {errorMessage}
                {spinner}
                <>
                  {resultsArray.length === 0 ? 'Movie not found' : content}
                  {this.state.totalPages && this.state.currentTabKey === 'search' ? (
                    <PaginationComponent
                      pages={this.state.totalPages}
                      currentPage={this.state.currentPage}
                      totalResults={this.state.totalResults}
                      onPageChange={this.onChangePage}
                    />
                  ) : null}
                  {this.state.totalPages && this.state.currentTabKey === 'rated' ? (
                    <PaginationComponent
                      // pages={Math.ceil(this.state.ratedArray.length / 20)}
                      currentPage={1}
                      // totalResults={this.state.ratedArray.length}
                      onPageChange={this.onChangePage}
                    />
                  ) : null}
                </>
              </div>
            </div>
          </Online>
        </MovieProvider>
      </>
    );
  }
}

{
  /* <>
  <Search onSearchChange={this.onSearchChange} />
  <div className="view">
    {errorMessage}
    {spinner}
    <>
      {resultsArray.length === 0 ? 'Movie not found' : content}
      {this.state.totalPages ? (
        <PaginationComponent
          pages={this.state.totalPages}
          currentPage={this.state.currentPage}
          totalResults={this.state.totalResults}
          onPageChange={this.onChangePage}
        />
      ) : null}
    </>
  </div>
</>; */
}
